'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Crown, Video, Eye, Users, Bell, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function TwitchStatsPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'ADMIN') {
            fetchStats();
        }
    }, [session]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/super-admin/twitch-stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching Twitch stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const refreshStats = async () => {
        setRefreshing(true);
        // Trigger stream status check
        await fetch('/api/twitch/stream-status');
        await fetchStats();
    };

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <Crown size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée aux administrateurs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                    <div className="flex items-center gap-4">
                        <Video size={40} className="text-purple-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                Statistiques Twitch
                            </h1>
                            <p className="text-gray-400 mt-1">Analytics des streams et notifications</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link
                            href="/super-admin"
                            className="text-gray-400 hover:text-white"
                        >
                            ← Retour
                        </Link>
                        <button
                            onClick={refreshStats}
                            disabled={refreshing}
                            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-white disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                            Actualiser
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Chargement des statistiques...</p>
                    </div>
                ) : stats ? (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Video className="text-purple-500" size={32} />
                                    {stats.current?.isLive ? (
                                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">LIVE</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-600 text-gray-300 text-xs font-bold rounded-full">Offline</span>
                                    )}
                                </div>
                                <p className="text-3xl font-bold">{stats.weekly.totalStreams}</p>
                                <p className="text-sm text-gray-500">Streams cette semaine</p>
                            </div>

                            <div className="glass-card p-6">
                                <Eye className="text-blue-500 mb-4" size={32} />
                                <p className="text-3xl font-bold">{stats.weekly.avgViewers}</p>
                                <p className="text-sm text-gray-500">Moyenne spectateurs</p>
                            </div>

                            <div className="glass-card p-6">
                                <TrendingUp className="text-green-500 mb-4" size={32} />
                                <p className="text-3xl font-bold">{stats.weekly.peakViewers}</p>
                                <p className="text-sm text-gray-500">Pic spectateurs</p>
                            </div>

                            <div className="glass-card p-6">
                                <Bell className="text-yellow-500 mb-4" size={32} />
                                <p className="text-3xl font-bold">{stats.notifications.total}</p>
                                <p className="text-sm text-gray-500">Notifications envoyées</p>
                                {stats.notifications.unread > 0 && (
                                    <p className="text-xs text-yellow-400 mt-1">{stats.notifications.unread} non lues</p>
                                )}
                            </div>
                        </div>

                        {/* Daily Breakdown */}
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Calendar className="text-purple-500" size={24} />
                                Derniers 7 jours
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Streams</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Moy. Spectateurs</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Pic Spectateurs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.weekly.dailyBreakdown.map((day, index) => (
                                            <tr key={index} className="border-b border-gray-800 hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    {new Date(day.date).toLocaleDateString('fr-FR', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        day.streams > 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-500'
                                                    }`}>
                                                        {day.streams}
                                                    </span>
                                                </td>
                                                <td className="text-center py-3 px-4 font-mono">
                                                    {day.avgViewers}
                                                </td>
                                                <td className="text-center py-3 px-4 font-mono text-green-400">
                                                    {day.peakViewers}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/super-admin/settings"
                                    className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white"
                                >
                                    ⚙️ Configurer Twitch
                                </Link>
                                <a
                                    href={`https://twitch.tv/${stats.current?.channel || ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-purple-900/50 hover:bg-purple-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-purple-500/30"
                                >
                                    📺 Ouvrir le stream
                                </a>
                                <a
                                    href="https://dashboard.twitch.tv/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                                >
                                    🎛️ Twitch Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center">
                        <Video size={64} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-500">Aucune statistique disponible</p>
                        <p className="text-sm text-gray-600 mt-2">Configurez Twitch dans les paramètres pour commencer</p>
                    </div>
                )}
            </div>
        </div>
    );
}
