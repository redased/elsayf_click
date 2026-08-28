'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, X, BookOpen, Video, Tv, Send, Clock, ChevronRight, Loader2 } from 'lucide-react';

const NOTIFICATION_TYPES = [
    {
        key: 'new_course',
        label: 'Nouvelle Formation',
        icon: BookOpen,
        color: 'from-violet-600 to-purple-700',
        badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        defaultTitle: '🎓 Nouvelle formation disponible !',
        defaultBody: 'Une nouvelle formation vient d\'être publiée sur Elsayf. Découvrez-la maintenant !',
        defaultUrl: '/courses',
    },
    {
        key: 'live_session',
        label: 'Session Live',
        icon: Video,
        color: 'from-blue-600 to-cyan-700',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        defaultTitle: '🎥 Session live démarrée !',
        defaultBody: 'Une session en direct vient de commencer. Rejoignez-nous maintenant !',
        defaultUrl: '/dashboard/live',
    },
    {
        key: 'twitch',
        label: 'Stream Twitch',
        icon: Tv,
        color: 'from-purple-600 to-pink-700',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        defaultTitle: '📺 Twitch en direct !',
        defaultBody: 'Nous sommes en direct sur Twitch ! Rejoignez le stream maintenant.',
        defaultUrl: 'https://twitch.tv',
    },
];

function typeLabel(type) {
    return NOTIFICATION_TYPES.find(t => t.key === type)?.label || type;
}

function typeIcon(type) {
    const t = NOTIFICATION_TYPES.find(t => t.key === type);
    if (!t) return null;
    const Icon = t.icon;
    return <Icon size={14} />;
}

function timeSince(date) {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'à l\'instant';
    if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
    if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
    return `il y a ${Math.floor(s / 86400)} j`;
}

export default function NotificationSendPanel() {
    const [open, setOpen] = useState(false);
    const [activeType, setActiveType] = useState('new_course');
    const [fields, setFields] = useState({});
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState(null); // { ok: bool, msg: string }
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Initialiser les champs quand le type change
    useEffect(() => {
        const t = NOTIFICATION_TYPES.find(t => t.key === activeType);
        if (t) {
            setFields({
                title: t.defaultTitle,
                body: t.defaultBody,
                actionUrl: t.defaultUrl,
            });
        }
        setFeedback(null);
    }, [activeType]);

    const loadHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch('/api/super-admin/notifications/broadcast');
            if (res.ok) {
                const data = await res.json();
                setHistory(data.notifications || []);
            }
        } catch {}
        finally { setLoadingHistory(false); }
    }, []);

    useEffect(() => {
        if (open) loadHistory();
    }, [open, loadHistory]);

    const handleSend = async () => {
        if (!fields.title?.trim() || !fields.body?.trim()) {
            setFeedback({ ok: false, msg: 'Le titre et le message sont requis.' });
            return;
        }
        setSending(true);
        setFeedback(null);
        try {
            const res = await fetch('/api/super-admin/notifications/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: fields.title,
                    body: fields.body,
                    type: activeType,
                    actionUrl: fields.actionUrl || null,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setFeedback({ ok: true, msg: 'Notification envoyée à tous les utilisateurs connectés !' });
                loadHistory();
            } else {
                setFeedback({ ok: false, msg: data.error || 'Erreur lors de l\'envoi.' });
            }
        } catch {
            setFeedback({ ok: false, msg: 'Erreur réseau.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Bouton déclencheur */}
            <button
                onClick={() => setOpen(true)}
                title="Envoyer une notification"
                className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 border border-yellow-500/20 transition-all text-sm font-semibold"
            >
                <Bell size={16} className="animate-[ring_2s_ease-in-out_infinite]" />
                <span className="hidden xl:inline">Notifier</span>
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Panneau slide depuis la droite */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0d1117] border-l border-[#ffffff10] z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ffffff10] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Bell size={16} className="text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-sm">Envoyer une notification</h2>
                            <p className="text-gray-500 text-xs">Diffusion instantanée à tous les utilisateurs</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                    {/* Sélecteur de type */}
                    <div className="px-5 pt-5 pb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Type de notification</p>
                        <div className="flex flex-col gap-2">
                            {NOTIFICATION_TYPES.map((t) => {
                                const Icon = t.icon;
                                const isActive = activeType === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        onClick={() => setActiveType(t.key)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                                            isActive
                                                ? `bg-gradient-to-r ${t.color} border-transparent text-white shadow-lg`
                                                : 'border-[#ffffff10] text-gray-400 hover:border-[#ffffff20] hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-semibold text-sm">{t.label}</span>
                                        {isActive && <ChevronRight size={14} className="ml-auto" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-[#ffffff08] mx-5" />

                    {/* Formulaire */}
                    <div className="px-5 py-4 space-y-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Message</p>

                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Titre *</label>
                            <input
                                type="text"
                                value={fields.title || ''}
                                onChange={e => setFields(f => ({ ...f, title: e.target.value }))}
                                placeholder="Titre de la notification"
                                className="w-full bg-[#1a1f2e] border border-[#ffffff15] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Message *</label>
                            <textarea
                                value={fields.body || ''}
                                onChange={e => setFields(f => ({ ...f, body: e.target.value }))}
                                placeholder="Corps de la notification"
                                rows={3}
                                className="w-full bg-[#1a1f2e] border border-[#ffffff15] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#a78bfa]/50 transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Lien (optionnel)</label>
                            <input
                                type="text"
                                value={fields.actionUrl || ''}
                                onChange={e => setFields(f => ({ ...f, actionUrl: e.target.value }))}
                                placeholder="/courses ou https://..."
                                className="w-full bg-[#1a1f2e] border border-[#ffffff15] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
                            />
                        </div>

                        {/* Feedback */}
                        {feedback && (
                            <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
                                feedback.ok
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                                {feedback.ok ? '✅ ' : '❌ '}{feedback.msg}
                            </div>
                        )}

                        {/* Bouton envoyer */}
                        <button
                            onClick={handleSend}
                            disabled={sending}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                        >
                            {sending ? (
                                <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>
                            ) : (
                                <><Send size={16} /> Envoyer à tous</>
                            )}
                        </button>
                    </div>

                    {/* Historique */}
                    <div className="border-t border-[#ffffff08] mx-5" />
                    <div className="px-5 py-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Historique récent</p>

                        {loadingHistory ? (
                            <div className="flex justify-center py-4">
                                <Loader2 size={20} className="text-gray-600 animate-spin" />
                            </div>
                        ) : history.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-4">Aucune notification envoyée</p>
                        ) : (
                            <div className="space-y-2">
                                {history.map((n) => (
                                    <div key={n.id} className="bg-[#1a1f2e] border border-[#ffffff08] rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-gray-500">{typeIcon(n.type)}</span>
                                            <span className="text-xs text-gray-500 font-medium">{typeLabel(n.type)}</span>
                                            <span className="ml-auto text-xs text-gray-600 flex items-center gap-1">
                                                <Clock size={10} />
                                                {timeSince(n.sentAt)}
                                            </span>
                                        </div>
                                        <p className="text-white text-sm font-medium truncate">{n.title}</p>
                                        <p className="text-gray-500 text-xs truncate mt-0.5">{n.body}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ring {
                    0%, 100% { transform: rotate(0deg); }
                    10%, 30% { transform: rotate(-10deg); }
                    20%, 40% { transform: rotate(10deg); }
                    50% { transform: rotate(0deg); }
                }
            `}</style>
        </>
    );
}
