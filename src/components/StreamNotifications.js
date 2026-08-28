'use client';
import { useState, useEffect } from 'react';
import { Bell, X, Video, Check } from 'lucide-react';

export default function StreamNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        // Refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/user/stream-notifications');
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await fetch('/api/user/stream-notifications', { method: 'PUT' });
            setUnreadCount(0);
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (isOpen && unreadCount > 0) {
            markAsRead();
        }
    };

    if (loading || notifications.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={toggleOpen}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Notifications de stream"
            >
                <Bell size={20} className="text-purple-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-12 w-80 bg-[#1a1f2e] border border-purple-500/30 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Video size={18} className="text-purple-400" />
                                Notifications Stream
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-80">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    Aucune notification
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-800 hover:bg-white/5 transition-colors ${
                                            !notification.read ? 'bg-purple-500/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <Video size={16} className="text-purple-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">
                                                    {notification.streamTitle || 'Stream en direct !'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(notification.sentAt).toLocaleString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {!notification.read && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-purple-400 mt-2">
                                                        <Check size={12} /> Nouveau
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <div className="p-3 border-t border-gray-700">
                                <button
                                    onClick={markAsRead}
                                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Tout marquer comme lu
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
