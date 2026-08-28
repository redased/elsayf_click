'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    Video, Plus, ExternalLink,
    ArrowLeft, Copy, Check, Wifi, Lock,
    Power, PowerOff, Clock, Loader2, Radio,
    Tv2, Eye, Gamepad2, PlayCircle
} from 'lucide-react';
import AdminChatPanel from '@/components/admin/AdminChatPanel';

function TwitchWidget() {
    const [twitch, setTwitch] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            const res = await fetch('/api/twitch/stream-status');
            const data = await res.json();
            setTwitch(data);
        } catch { /* silencieux */ } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch_();
        const iv = setInterval(fetch_, 60000); // rafraîchir chaque minute
        return () => clearInterval(iv);
    }, [fetch_]);

    if (loading) {
        return (
            <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5 mb-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-20 bg-gray-800 rounded-xl" />
            </div>
        );
    }

    // Twitch non configuré ou désactivé → ne rien afficher
    if (!twitch || twitch.message === 'Twitch non configuré') return null;

    const isLive = twitch.live;

    return (
        <div className={`bg-[#0d1117] border rounded-2xl overflow-hidden mb-6 ${isLive ? 'border-purple-500/40 shadow-lg shadow-purple-900/20' : 'border-gray-800'}`}>
            {/* Header */}
            <div className={`px-5 py-3 flex items-center justify-between ${isLive ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30' : 'bg-white/3'}`}>
                <div className="flex items-center gap-3">
                    {twitch.profileImage ? (
                        <img src={twitch.profileImage} alt={twitch.displayName} className="w-9 h-9 rounded-full border-2 border-purple-500/40" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center">
                            <Tv2 size={16} className="text-white" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{twitch.displayName || twitch.channel}</span>
                            {isLive && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse">
                                    ● LIVE
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Twitch</p>
                    </div>
                </div>
                <a
                    href={`https://twitch.tv/${twitch.channel}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-500/10 border border-purple-500/20"
                >
                    <ExternalLink size={12} /> Twitch.tv
                </a>
            </div>

            {/* Stats live */}
            {isLive && (
                <>
                    {/* Thumbnail */}
                    {twitch.thumbnailUrl && (
                        <div className="relative">
                            <img
                                src={twitch.thumbnailUrl + `?t=${Date.now()}`}
                                alt="Stream preview"
                                className="w-full object-cover max-h-48"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white font-bold">
                                <Eye size={11} className="text-red-400" />
                                {(twitch.viewerCount || 0).toLocaleString('fr-FR')} viewers
                            </div>
                        </div>
                    )}

                    <div className="px-5 py-4">
                        {/* Titre stream */}
                        {twitch.title && (
                            <p className="text-sm text-white font-semibold mb-2 line-clamp-2">{twitch.title}</p>
                        )}

                        {/* Badges infos */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {twitch.gameName && (
                                <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                                    <Gamepad2 size={11} /> {twitch.gameName}
                                </div>
                            )}
                            {twitch.startedAt && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-gray-700 px-2.5 py-1 rounded-full">
                                    <Clock size={11} />
                                    {(() => {
                                        const mins = Math.floor((Date.now() - new Date(twitch.startedAt)) / 60000);
                                        if (mins < 60) return `${mins} min`;
                                        return `${Math.floor(mins / 60)}h${mins % 60 > 0 ? String(mins % 60).padStart(2,'0') : ''}`;
                                    })()}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                <Eye size={11} /> {(twitch.viewerCount || 0).toLocaleString('fr-FR')} viewers
                            </div>
                        </div>

                        <a
                            href={`https://twitch.tv/${twitch.channel}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all"
                        >
                            <PlayCircle size={16} /> Regarder sur Twitch
                        </a>
                    </div>
                </>
            )}

            {/* Hors ligne */}
            {!isLive && (
                <div className="px-5 py-4 text-center">
                    <p className="text-gray-500 text-sm mb-1">Hors ligne pour l'instant</p>
                    <p className="text-xs text-gray-600">Suit la chaîne pour être notifié au prochain live</p>
                </div>
            )}
        </div>
    );
}

const ALL_ROOMS = [
    { id: 'python-complet',       label: 'Python Complet',         color: 'from-blue-600 to-cyan-600',     icon: '🐍' },
    { id: 'r-statistics-finance', label: 'R Statistics & Finance', color: 'from-teal-600 to-emerald-600',  icon: '📊' },
    { id: 'google-sheets',        label: 'Google Sheets Mastery',  color: 'from-green-600 to-lime-600',    icon: '📗' },
    { id: 'data-science',         label: 'Data Science Python',    color: 'from-violet-600 to-indigo-600', icon: '🔬' },
];

function timeAgo(iso) {
    if (!iso) return '';
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (diff < 1) return 'à l\'instant';
    if (diff < 60) return `il y a ${diff} min`;
    const h = Math.floor(diff / 60);
    return `il y a ${h}h`;
}

export default function LivePage() {
    const { data: session } = useSession();
    const [customRoom, setCustomRoom] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [activeSessions, setActiveSessions] = useState(null); // null = loading
    const [toggling, setToggling] = useState(null); // roomId being toggled

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    const fetchSessions = useCallback(() => {
        fetch('/api/live/sessions', { cache: 'no-store' })
            .then(r => r.json())
            .then(d => setActiveSessions(d.sessions || []))
            .catch(() => setActiveSessions([]));
    }, []);

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 15000); // refresh every 15s
        return () => clearInterval(interval);
    }, [fetchSessions]);

    const isActive = (roomId) => activeSessions?.some(s => s.id === roomId);
    const getSession = (roomId) => activeSessions?.find(s => s.id === roomId);

    const toggleRoom = async (room, active) => {
        setToggling(room.id);
        try {
            await fetch('/api/live/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: room.id,
                    label: room.label,
                    icon: room.icon,
                    color: room.color,
                    active,
                }),
            });
            await fetchSessions();
        } finally {
            setToggling(null);
        }
    };

    const copyLink = (roomId) => {
        const url = `${window.location.origin}/dashboard/live/${roomId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(roomId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const goCustom = () => {
        const clean = customRoom.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        if (clean) window.location.href = `/dashboard/live/${clean}`;
    };

    const loading = activeSessions === null;
    const activeCount = activeSessions?.length ?? 0;

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-4">
                        <ArrowLeft size={13} /> Tableau de bord
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-900/30">
                            <Video size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Sessions Live</h1>
                            <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                                <Wifi size={12} className="text-green-400" />
                                Jitsi Meet • Vidéo chiffrée • Aucune limite de temps
                            </p>
                        </div>
                        {/* Live count badge */}
                        <div className="ml-auto">
                            {loading ? (
                                <Loader2 size={18} className="text-gray-600 animate-spin" />
                            ) : activeCount > 0 ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                                    <Radio size={12} className="animate-pulse" />
                                    {activeCount} session{activeCount > 1 ? 's' : ''} en direct
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-full">
                                    Aucune session active
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Widget Twitch ─────────────────────────────────── */}
                <TwitchWidget />

                {/* ── ADMIN: Chat Panel ─────────────────────────────── */}
                {isAdmin && <AdminChatPanel activeSessions={activeSessions || []} />}

                {/* ── ADMIN VIEW: all rooms with toggle ─────────────────── */}
                {isAdmin && (
                    <div className="mb-8">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            Gérer les salles
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono normal-case tracking-normal">Admin</span>
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {ALL_ROOMS.map(room => {
                                const active = isActive(room.id);
                                const liveSession = getSession(room.id);
                                const isToggling = toggling === room.id;
                                return (
                                    <div key={room.id} className={`bg-[#0d1117] border rounded-2xl p-4 transition-all ${active ? 'border-green-500/40 shadow-lg shadow-green-900/10' : 'border-gray-800 hover:border-gray-700'}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${room.color} flex items-center justify-center text-lg shrink-0`}>
                                                {room.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-white truncate">{room.label}</p>
                                                {active && liveSession ? (
                                                    <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} /> Démarrée {timeAgo(liveSession.startedAt)}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs font-mono text-gray-500 truncate">{room.id}</p>
                                                )}
                                            </div>
                                            {active ? (
                                                <div className="shrink-0 flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                    Live
                                                </div>
                                            ) : (
                                                <div className="shrink-0 text-xs text-gray-600 bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-700/50">
                                                    Inactif
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Toggle start/stop */}
                                            <button
                                                onClick={() => toggleRoom(room, !active)}
                                                disabled={isToggling}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 ${
                                                    active
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                                        : `bg-gradient-to-r ${room.color} text-white hover:opacity-90`
                                                }`}
                                            >
                                                {isToggling ? (
                                                    <Loader2 size={13} className="animate-spin" />
                                                ) : active ? (
                                                    <><PowerOff size={13} /> Arrêter</>
                                                ) : (
                                                    <><Power size={13} /> Démarrer</>
                                                )}
                                            </button>

                                            {active && (
                                                <>
                                                    <a
                                                        href={`https://meet.jit.si/elsayf-${room.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`px-3 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${room.color} hover:opacity-90 transition-opacity`}
                                                        title="Rejoindre"
                                                    >
                                                        Rejoindre
                                                    </a>
                                                    <button
                                                        onClick={() => copyLink(room.id)}
                                                        className="px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-colors"
                                                        title="Copier le lien"
                                                    >
                                                        {copiedId === room.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                                                    </button>
                                                    <a
                                                        href={`https://meet.jit.si/elsayf-${room.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-colors"
                                                        title="Ouvrir dans Jitsi"
                                                    >
                                                        <ExternalLink size={13} />
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── STUDENT VIEW: only active sessions ────────────────── */}
                {!isAdmin && (
                    <div className="mb-8">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                            Sessions disponibles
                        </h2>

                        {loading ? (
                            <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                                <Loader2 size={20} className="animate-spin" />
                                <span className="text-sm">Chargement des sessions...</span>
                            </div>
                        ) : activeSessions.length === 0 ? (
                            <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-10 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-gray-800/60 flex items-center justify-center mx-auto mb-4">
                                    <Video size={24} className="text-gray-600" />
                                </div>
                                <p className="text-gray-300 font-semibold mb-1">Aucune session en cours</p>
                                <p className="text-gray-500 text-sm">
                                    Ton instructeur lancera une session live bientôt.<br />
                                    Cette page se rafraîchit automatiquement.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {activeSessions.map(liveSession => {
                                    const room = ALL_ROOMS.find(r => r.id === liveSession.id) || {
                                        id: liveSession.id,
                                        label: liveSession.label,
                                        icon: liveSession.icon || '🎥',
                                        color: liveSession.color || 'from-violet-600 to-indigo-600',
                                    };
                                    return (
                                        <div key={room.id} className="bg-[#0d1117] border border-green-500/30 rounded-2xl p-4 shadow-lg shadow-green-900/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${room.color} flex items-center justify-center text-lg shrink-0`}>
                                                    {room.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-white truncate">{room.label}</p>
                                                    <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} /> Démarrée {timeAgo(liveSession.startedAt)}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                    Live
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={`https://meet.jit.si/elsayf-${room.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex-1 py-2 rounded-lg text-center text-xs font-bold text-white bg-gradient-to-r ${room.color} hover:opacity-90 transition-opacity`}
                                                >
                                                    Rejoindre
                                                </a>
                                                <button
                                                    onClick={() => copyLink(room.id)}
                                                    className="px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-colors"
                                                    title="Copier le lien"
                                                >
                                                    {copiedId === room.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                                                </button>
                                                <a
                                                    href={`https://meet.jit.si/elsayf-${room.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-colors"
                                                    title="Ouvrir dans Jitsi"
                                                >
                                                    <ExternalLink size={13} />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── ADMIN: Salle personnalisée ─────────────────────────── */}
                {isAdmin && (
                    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5 mb-6">
                        <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            <Plus size={15} className="text-violet-400" />
                            Salle personnalisée
                            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">Admin</span>
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">Pour des sessions privées, TP, ou office hours.</p>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center bg-white/5 border border-gray-700 rounded-xl overflow-hidden focus-within:border-violet-500 transition-colors">
                                <span className="text-xs text-gray-500 pl-3 font-mono shrink-0">elsayf-</span>
                                <input
                                    type="text"
                                    value={customRoom}
                                    onChange={e => setCustomRoom(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && goCustom()}
                                    placeholder="nom-de-la-salle"
                                    className="flex-1 bg-transparent text-sm text-white px-2 py-2.5 focus:outline-none font-mono min-w-0"
                                />
                            </div>
                            <button
                                onClick={goCustom}
                                disabled={!customRoom.trim()}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm transition-all"
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                )}

                {/* Télécharger Jitsi Meet */}
                <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5 mb-4">
                    <h2 className="text-sm font-bold text-white mb-1">📱 Mieux sur mobile</h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Télécharge l'app <strong className="text-gray-300">Jitsi Meet</strong> pour rejoindre les sessions depuis ton téléphone avec micro & caméra.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="https://play.google.com/store/apps/details?id=org.jitsi.meet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 rounded-xl transition-all flex-1"
                        >
                            <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none">
                                <path d="M3.18 23.76c.3.17.65.2.98.08L14.93 12 11.07 8.14 3.18 23.76z" fill="#EA4335"/>
                                <path d="M20.6 10.27L17.3 8.37l-3.8 3.8 3.8 3.8 3.32-1.9a1.97 1.97 0 000-3.8z" fill="#FBBC04"/>
                                <path d="M3.18.24A1.97 1.97 0 002 2v20c0 .73.4 1.37 1 1.72L14.93 12 3.18.24z" fill="#34A853"/>
                                <path d="M3.18.24L11.07 8.13 14.93 4.27 4.16.32A2 2 0 003.18.24z" fill="#4285F4"/>
                            </svg>
                            <div>
                                <p className="text-[10px] text-gray-500 leading-none mb-0.5">Disponible sur</p>
                                <p className="text-sm font-bold text-white">Google Play</p>
                            </div>
                        </a>
                        <a
                            href="https://apps.apple.com/app/jitsi-meet/id1165103905"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 rounded-xl transition-all flex-1"
                        >
                            <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="white">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <div>
                                <p className="text-[10px] text-gray-500 leading-none mb-0.5">Disponible sur</p>
                                <p className="text-sm font-bold text-white">App Store</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Info sécurité */}
                <div className="flex items-start gap-3 p-4 bg-white/3 border border-gray-800/50 rounded-xl">
                    <Lock size={15} className="text-violet-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-gray-300 mb-0.5">Sécurité & confidentialité</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Les sessions utilisent <strong className="text-gray-400">meet.jit.si</strong> avec chiffrement de bout en bout.
                            Les noms de salles sont préfixés <code className="text-violet-400 font-mono">elsayf-</code> pour éviter les conflits.
                            Aucune donnée n'est stockée sur nos serveurs.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
