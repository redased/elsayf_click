'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Video, Tv, X, ExternalLink } from 'lucide-react';
import Pusher from 'pusher-js';

const TYPE_CONFIG = {
    new_course: {
        icon: BookOpen,
        gradient: 'from-violet-600 to-purple-700',
        label: 'Nouvelle formation',
    },
    live_session: {
        icon: Video,
        gradient: 'from-blue-600 to-cyan-700',
        label: 'Session live',
    },
    twitch: {
        icon: Tv,
        gradient: 'from-purple-600 to-pink-700',
        label: 'Twitch live',
    },
};

export default function LiveNotificationReceiver() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        });
        const channel = client.subscribe('global-notifications');

        channel.bind('new-notification', (data) => {
            const id = data.id || Math.random().toString(36).slice(2);
            setToasts(prev => [...prev, { ...data, toastId: id }]);

            // Notification navigateur si permission accordée
            if ('Notification' in window && Notification.permission === 'granted') {
                const n = new Notification(data.title, {
                    body: data.body,
                    icon: '/logo.png',
                    badge: '/logo.png',
                    tag: `broadcast-${id}`,
                    requireInteraction: false,
                });
                if (data.actionUrl) {
                    n.onclick = () => {
                        window.focus();
                        const url = data.actionUrl.startsWith('http')
                            ? data.actionUrl
                            : `${window.location.origin}${data.actionUrl}`;
                        window.open(url, '_blank');
                        n.close();
                    };
                }
            }

            // Retrait automatique après 8 secondes
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.toastId !== id));
            }, 8000);
        });

        return () => {
            channel.unbind_all();
            client.unsubscribe('global-notifications');
            client.disconnect();
        };
    }, []);

    const dismiss = (toastId) => {
        setToasts(prev => prev.filter(t => t.toastId !== toastId));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => {
                const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.new_course;
                const Icon = cfg.icon;
                return (
                    <div
                        key={toast.toastId}
                        className="pointer-events-auto"
                        style={{ animation: 'slideInToast 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                    >
                        <div className={`bg-gradient-to-br ${cfg.gradient} rounded-2xl shadow-2xl p-4 border border-white/10 text-white relative`}>
                            <button
                                onClick={() => dismiss(toast.toastId)}
                                className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Fermer"
                            >
                                <X size={14} />
                            </button>

                            <div className="flex items-start gap-3 pr-6">
                                <div className="bg-white/20 rounded-xl p-2.5 flex-shrink-0 mt-0.5">
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">
                                        {cfg.label}
                                    </p>
                                    <p className="font-bold text-sm leading-tight">{toast.title}</p>
                                    <p className="text-white/80 text-xs mt-1 leading-relaxed">{toast.body}</p>
                                </div>
                            </div>

                            {toast.actionUrl && (
                                <a
                                    href={toast.actionUrl}
                                    target={toast.actionUrl.startsWith('http') ? '_blank' : '_self'}
                                    rel="noreferrer"
                                    className="mt-3 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2 text-xs font-semibold w-full"
                                >
                                    Voir maintenant <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    </div>
                );
            })}

            <style>{`
                @keyframes slideInToast {
                    from { opacity: 0; transform: translateX(60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
