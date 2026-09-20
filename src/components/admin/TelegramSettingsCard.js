'use client';
import { useState, useEffect } from 'react';
import { 
  Send, Bell, Clock, ShieldCheck, CheckCircle2, AlertCircle, 
  Settings2, Smartphone, Users, FileText, Sparkles, RefreshCw, Eye, EyeOff
} from 'lucide-react';

export default function TelegramSettingsCard({ className = '' }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [showToken, setShowToken] = useState(false);

  const [form, setForm] = useState({
    enabled: true,
    botToken: '',
    chatId: '',
    notifyOnCvDownload: true,
    notifyOnNewStudent: true,
    notifyOnGoogleSignup: true,
    notifyOnCvSaved: true,
    dailyReportEnabled: true,
    dailyReportTime: '20:00',
    dailyReportFrequency: 'daily',
    morningReportTime: '08:00',
    includeStudentStats: true,
    includeCvStats: true,
    includeDeviceStats: true,
    includeTemplateRanking: true,
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/telegram/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setForm(prev => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error('Erreur chargement réglages Telegram:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMessage({ text: 'Enregistrement des paramètres...', type: 'info' });
    try {
      const res = await fetch('/api/admin/telegram/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: '✅ Paramètres Telegram enregistrés avec succès !', type: 'success' });
      } else {
        setStatusMessage({ text: `❌ Erreur: ${data.error}`, type: 'error' });
      }
    } catch (e) {
      setStatusMessage({ text: `❌ Erreur réseau: ${e.message}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 6000);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMessage({ text: 'Envoi d\'un message de test...', type: 'info' });
    try {
      const res = await fetch('/api/admin/telegram/test', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: '✅ Message de test reçu avec succès sur Telegram !', type: 'success' });
      } else {
        setStatusMessage({ text: `❌ Erreur test: ${data.error}`, type: 'error' });
      }
    } catch (e) {
      setStatusMessage({ text: `❌ Erreur réseau: ${e.message}`, type: 'error' });
    } finally {
      setTesting(false);
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 6000);
    }
  };

  const handleSendReportNow = async () => {
    setSendingReport(true);
    setStatusMessage({ text: 'Génération et envoi du rapport direct...', type: 'info' });
    try {
      const res = await fetch('/api/admin/telegram/report', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: '✅ Rapport statistique envoyé sur votre Telegram !', type: 'success' });
      } else {
        setStatusMessage({ text: `❌ Erreur rapport: ${data.error}`, type: 'error' });
      }
    } catch (e) {
      setStatusMessage({ text: `❌ Erreur réseau: ${e.message}`, type: 'error' });
    } finally {
      setSendingReport(false);
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 6000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-gray-900/60 border border-gray-800 text-center text-gray-400">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-sky-400" />
        Chargement de la configuration Telegram...
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-b from-[#0c1322] to-[#080d18] border border-sky-500/30 p-6 sm:p-8 shadow-2xl space-y-8 ${className}`}>
      
      {/* Header avec switch principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/10">
            <Send size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Automatisation & Notifications Telegram
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Configurez précisément ce que vous recevez sur votre téléphone et définissez l'heure exacte des résumés.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-900/80 p-2 rounded-2xl border border-gray-800">
          <span className="text-xs font-semibold text-gray-300">
            {form.enabled ? 'Service Actif' : 'Service En Pause'}
          </span>
          <button
            type="button"
            onClick={() => handleChange('enabled', !form.enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              form.enabled ? 'bg-sky-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform transform ${
                form.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Message de statut toast */}
      {statusMessage.text && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between animate-fadeIn ${
          statusMessage.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200' :
          statusMessage.type === 'error' ? 'bg-red-950/70 border-red-500/40 text-red-200' :
          'bg-sky-950/70 border-sky-500/40 text-sky-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage({ text: '', type: '' })} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Grille principale des paramètres */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Colonne 1 : Identifiants & Alertes en direct */}
        <div className="space-y-6">
          
          {/* Identifiants Telegram */}
          <div className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-400" />
              Identifiants de Connexion Bot
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Bot Token Telegram</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={form.botToken}
                    onChange={(e) => handleChange('botToken', e.target.value)}
                    placeholder="8904370377:AAFuCI..."
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:border-sky-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Votre Chat ID Personnel ou Groupe</label>
                <input
                  type="text"
                  value={form.chatId}
                  onChange={(e) => handleChange('chatId', e.target.value)}
                  placeholder="1706545248"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Alertes Instantanées (Temps réel) */}
          <div className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell size={16} className="text-yellow-400" />
              Alertes en Temps Réel (Instantanées)
            </h3>
            <p className="text-xs text-gray-400">
              Recevez un message sur Telegram à la seconde où l'événement survient.
            </p>

            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Téléchargement de CV (PDF A4)</div>
                    <div className="text-[11px] text-gray-400">Alerte avec nom, poste, modèle et appareil du candidat</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.notifyOnCvDownload}
                  onChange={(e) => handleChange('notifyOnCvDownload', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Nouvel Étudiant Inscrit</div>
                    <div className="text-[11px] text-gray-400">Notification dès qu'un nouvel utilisateur crée son compte</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.notifyOnNewStudent}
                  onChange={(e) => handleChange('notifyOnNewStudent', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-xs text-sky-400">G</span>
                  <div>
                    <div className="text-xs font-bold text-white">Compte Google / Gmail (MyCV & Elsayf)</div>
                    <div className="text-[11px] text-gray-400">Alerte avec nom et email Gmail lors d'une connexion ou inscription</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.notifyOnGoogleSignup !== false}
                  onChange={(e) => handleChange('notifyOnGoogleSignup', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold text-white">CV Enregistré dans le Cloud (MyCV)</div>
                    <div className="text-[11px] text-gray-400">Alerte immédiate quand un utilisateur sauvegarde son profil CV</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.notifyOnCvSaved !== false}
                  onChange={(e) => handleChange('notifyOnCvSaved', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Colonne 2 : Planification du rapport et contenu */}
        <div className="space-y-6">

          {/* Horaires et Fréquence */}
          <div className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-sky-400" />
              Horaires & Fréquence du Rapport Quotidien
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950/60 border border-gray-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Activer le rapport programmé</div>
                  <div className="text-[11px] text-gray-400">Le serveur compile et envoie les statistiques du jour</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.dailyReportEnabled}
                  onChange={(e) => handleChange('dailyReportEnabled', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </label>

              {form.dailyReportEnabled && (
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">
                      Fréquence d'envoi
                    </label>
                    <select
                      value={form.dailyReportFrequency}
                      onChange={(e) => handleChange('dailyReportFrequency', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                    >
                      <option value="daily">1 fois par jour (Soir)</option>
                      <option value="twice_daily">2 fois par jour (Matin & Soir)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">
                      Heure principale d'envoi
                    </label>
                    <input
                      type="time"
                      value={form.dailyReportTime}
                      onChange={(e) => handleChange('dailyReportTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  {form.dailyReportFrequency === 'twice_daily' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-medium">
                        Heure du rapport du matin
                      </label>
                      <input
                        type="time"
                        value={form.morningReportTime}
                        onChange={(e) => handleChange('morningReportTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contenu personnalisé du rapport */}
          <div className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings2 size={16} className="text-sky-400" />
              Contenu à Inclure dans le Rapport
            </h3>
            <p className="text-xs text-gray-400">
              Cochez les métriques que vous souhaitez afficher dans vos messages Telegram.
            </p>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={form.includeStudentStats}
                  onChange={(e) => handleChange('includeStudentStats', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
                <span>🎓 Étudiants & Formations</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={form.includeCvStats}
                  onChange={(e) => handleChange('includeCvStats', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
                <span>📄 Créateur de CV (MyCV)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={form.includeTemplateRanking}
                  onChange={(e) => handleChange('includeTemplateRanking', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
                <span>🎨 Top 3 des Modèles de CV</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={form.includeDeviceStats}
                  onChange={(e) => handleChange('includeDeviceStats', e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
                <span>📱 Mobiles vs Ordinateurs</span>
              </label>
            </div>
          </div>

        </div>

      </div>

      {/* Barre d'actions & Boutons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send size={14} className={testing ? 'animate-pulse' : ''} />
            <span>{testing ? 'Test en cours...' : 'Tester le bot Telegram'}</span>
          </button>

          <button
            type="button"
            onClick={handleSendReportNow}
            disabled={sendingReport}
            className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 disabled:opacity-50 text-purple-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={14} className={sendingReport ? 'animate-spin' : ''} />
            <span>{sendingReport ? 'Génération...' : 'Recevoir le rapport maintenant'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-105 cursor-pointer ml-auto"
        >
          <CheckCircle2 size={16} />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}</span>
        </button>
      </div>

    </div>
  );
}
