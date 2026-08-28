'use client';
import { use, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Users, Lock, Copy, Check, ExternalLink } from 'lucide-react';

export default function LiveRoomPage({ params }) {
    const { roomId } = use(params);
    const { data: session } = useSession();
    const [copied, setCopied] = useState(false);

    const displayName = session?.user?.name || session?.user?.email || 'Participant';
    const email = session?.user?.email || '';
    const roomUrl = `https://meet.jit.si/elsayf-${roomId}`;

    const copyLink = () => {
        navigator.clipboard.writeText(roomUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo + titre */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-900/40">
                        <Users size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Session Live</h1>
                    <p className="text-gray-400 text-sm">Powered by Jitsi Meet • Chiffrement de bout en bout</p>
                </div>

                {/* Carte de la salle */}
                <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Salle</p>
                            <p className="font-mono text-violet-400 font-semibold">{roomId}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Disponible
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-gray-800 mb-4">
                        <Lock size={13} className="text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-400 font-mono truncate flex-1">elsayf-{roomId}</span>
                        <button onClick={copyLink} className="shrink-0 text-gray-500 hover:text-white transition-colors">
                            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-gray-800">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                            {displayName[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{displayName}</p>
                            <p className="text-xs text-gray-500 truncate">{email}</p>
                        </div>
                    </div>
                </div>

                {/* Ouvrir dans Jitsi Meet — action principale */}
                <a
                    href={roomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30 mb-3 flex items-center justify-center gap-2"
                >
                    <ExternalLink size={15} /> Rejoindre sur Jitsi Meet
                </a>

                <div className="mt-6 text-center">
                    <Link href="/dashboard/live" className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1">
                        <ArrowLeft size={11} /> Retour aux sessions
                    </Link>
                </div>
            </div>
        </div>
    );
}
