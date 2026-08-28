'use client';
import { useState, useEffect } from 'react';
import { Send, Users, Video, Bell, Loader2, CheckCircle, User, Search, ChevronDown, X, Tv2 } from 'lucide-react';

export default function AdminChatPanel({ activeSessions = [] }) {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('text'); // text, announcement, jitsi_invite, twitch_invite
  const [targetMode, setTargetMode] = useState('all'); // 'all' | 'individual'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [customRoomId, setCustomRoomId] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [twitchChannel, setTwitchChannel] = useState(null);

  // Charger la chaîne Twitch configurée
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d?.twitchChannel && d?.twitchEnabled) setTwitchChannel(d.twitchChannel); })
      .catch(() => {});
  }, []);

  // Ciblage individuel
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (targetMode === 'individual' && students.length === 0) {
      setStudentsLoading(true);
      fetch('/api/super-admin/users')
        .then(r => r.json())
        .then(d => setStudents((d.users || []).filter(u => u.role === 'STUDENT')))
        .catch(() => {})
        .finally(() => setStudentsLoading(false));
    }
  }, [targetMode]);

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleSend = async () => {
    if (!message.trim()) return;
    if (targetMode === 'individual' && !selectedStudent) return;

    const roomId = selectedRoom?.id || customRoomId.trim();
    if (messageType === 'jitsi_invite' && !roomId) return;
    if (messageType === 'twitch_invite' && !twitchChannel) return;

    setSending(true);
    setResult(null);

    try {
      const payload = {
        message: message.trim(),
        messageType,
        ...(targetMode === 'all'
          ? { sendToAll: true }
          : { toUserId: selectedStudent.id }
        ),
        ...(messageType === 'jitsi_invite' && roomId
          ? { metadata: {
              roomId,
              roomLabel: selectedRoom?.label || roomId,
              icon: selectedRoom?.icon || '🎥',
              color: selectedRoom?.color || 'from-violet-600 to-indigo-600',
            }}
          : {}
        ),
        ...(messageType === 'twitch_invite'
          ? { metadata: {
              channel: twitchChannel,
              url: `https://twitch.tv/${twitchChannel}`,
            }}
          : {}
        ),
      };

      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setResult({ success: true, message: data.message || 'Message envoyé !' });
        setMessage('');
        setMessageType('text');
        setSelectedRoom(null);
        setCustomRoomId('');
        setSelectedStudent(null);
        setStudentSearch('');
      } else {
        setResult({ success: false, message: data.error || "Erreur lors de l'envoi" });
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setResult({ success: false, message: 'Erreur réseau' });
    } finally {
      setSending(false);
    }
  };

  const isSendDisabled =
    sending ||
    !message.trim() ||
    (targetMode === 'individual' && !selectedStudent) ||
    (messageType === 'jitsi_invite' && !selectedRoom && !customRoomId.trim()) ||
    (messageType === 'twitch_invite' && !twitchChannel);

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5 mb-6">
      <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
        <Send size={15} className="text-violet-400" />
        Envoyer un message
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">Admin</span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">Envoyez des annonces, messages ou invitations live.</p>

      {/* ── Destinataire ─────────────────────────────── */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTargetMode('all'); setSelectedStudent(null); }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            targetMode === 'all'
              ? 'bg-violet-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Users size={12} /> Tous les étudiants
        </button>
        <button
          onClick={() => setTargetMode('individual')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            targetMode === 'individual'
              ? 'bg-indigo-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <User size={12} /> Étudiant spécifique
        </button>
      </div>

      {/* ── Sélecteur d'étudiant ──────────────────────── */}
      {targetMode === 'individual' && (
        <div className="mb-4 relative">
          <label className="block text-xs font-semibold text-gray-400 mb-2">Sélectionner l'étudiant :</label>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 border border-gray-700 rounded-lg text-sm hover:border-gray-600 transition-colors"
          >
            {selectedStudent ? (
              <span className="flex items-center gap-2 text-white min-w-0">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {selectedStudent.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="truncate font-medium">{selectedStudent.name}</span>
                <span className="text-gray-500 text-xs hidden sm:inline">({selectedStudent.email})</span>
              </span>
            ) : (
              <span className="text-gray-500">Choisir un étudiant...</span>
            )}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {selectedStudent && (
                <span
                  role="button"
                  onClick={e => { e.stopPropagation(); setSelectedStudent(null); setStudentSearch(''); }}
                  className="text-gray-500 hover:text-white p-0.5 rounded"
                >
                  <X size={12} />
                </span>
              )}
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1117] border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
              <div className="p-2 border-b border-gray-700">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                  <Search size={12} className="text-gray-500 shrink-0" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="Rechercher par nom ou email..."
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {studentsLoading ? (
                  <div className="flex items-center justify-center py-5 gap-2 text-gray-500">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs">Chargement des étudiants...</span>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-5">Aucun étudiant trouvé</p>
                ) : (
                  filteredStudents.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedStudent(s); setShowDropdown(false); setStudentSearch(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold shrink-0">
                        {s.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{s.name}</p>
                        <p className="text-xs text-gray-500 truncate">{s.email}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Type de message ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setMessageType('text')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            messageType === 'text' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Send size={12} />Message
        </button>
        <button
          onClick={() => setMessageType('announcement')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            messageType === 'announcement' ? 'bg-yellow-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Bell size={12} />Annonce
        </button>
        <button
          onClick={() => setMessageType('jitsi_invite')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            messageType === 'jitsi_invite' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Video size={12} />Invitation Jitsi
        </button>
        <button
          onClick={() => setMessageType('twitch_invite')}
          disabled={!twitchChannel}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
            messageType === 'twitch_invite' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
          title={!twitchChannel ? 'Configurez Twitch dans Super Admin → Settings' : ''}
        >
          <Tv2 size={12} />Invitation Twitch
        </button>
      </div>

      {/* ── Sélection salle Jitsi ─────────────────────── */}
      {messageType === 'jitsi_invite' && (
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-400 mb-2">Session Jitsi :</label>
          {activeSessions.length > 0 && (
            <div className="grid gap-2 mb-2">
              {activeSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => { setSelectedRoom(session); setCustomRoomId(''); }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedRoom?.id === session.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 bg-white/5 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${session.color} flex items-center justify-center text-sm shrink-0`}>
                    {session.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{session.label}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{session.id}</p>
                  </div>
                  {selectedRoom?.id === session.id && <CheckCircle size={16} className="text-green-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center bg-white/5 border border-gray-700 rounded-lg overflow-hidden focus-within:border-green-500 transition-colors">
            <span className="text-xs text-gray-500 pl-3 font-mono shrink-0">elsayf-</span>
            <input
              type="text"
              value={customRoomId}
              onChange={e => { setCustomRoomId(e.target.value); setSelectedRoom(null); }}
              placeholder={activeSessions.length > 0 ? 'ou ID de salle manuel...' : 'nom-de-la-salle'}
              className="flex-1 bg-transparent text-sm text-white px-2 py-2.5 focus:outline-none font-mono"
            />
          </div>
        </div>
      )}

      {/* ── Aperçu invitation Twitch ──────────────────── */}
      {messageType === 'twitch_invite' && twitchChannel && (
        <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-700 flex items-center justify-center shrink-0">
            <Tv2 size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-purple-300">Invitation Twitch Live</p>
            <p className="text-xs text-gray-400 truncate font-mono">twitch.tv/{twitchChannel}</p>
          </div>
          <span className="text-[10px] text-white bg-red-500 px-2 py-0.5 rounded-full font-bold animate-pulse shrink-0">
            ● LIVE
          </span>
        </div>
      )}

      {/* ── Message ───────────────────────────────────── */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-400 mb-2">
          {messageType === 'jitsi_invite' ? "Message d'invitation Jitsi :"
            : messageType === 'twitch_invite' ? "Message d'invitation Twitch :"
            : 'Votre message :'}
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={
            messageType === 'jitsi_invite'
              ? 'Ex: Rejoignez-moi pour le cours de Python en direct ! 🚀'
              : messageType === 'twitch_invite'
              ? 'Ex: Je suis en live sur Twitch maintenant ! Rejoignez-moi 🎥'
              : messageType === 'announcement'
              ? 'Ex: Nouveau cours disponible sur Django !'
              : 'Écrivez votre message...'
          }
          rows={3}
          className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />
      </div>

      {/* ── Bouton envoyer ────────────────────────────── */}
      <button
        onClick={handleSend}
        disabled={isSendDisabled}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        {sending ? (
          <><Loader2 size={16} className="animate-spin" />Envoi en cours...</>
        ) : targetMode === 'all' ? (
          <><Users size={16} />Envoyer à tous les étudiants</>
        ) : (
          <><User size={16} />Envoyer à {selectedStudent?.name || '...'}</>
        )}
      </button>

      {result && (
        <div className={`mt-3 p-3 rounded-lg border ${
          result.success
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <p className="text-xs font-semibold flex items-center gap-2">
            {result.success ? <CheckCircle size={14} /> : '❌'}
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}
