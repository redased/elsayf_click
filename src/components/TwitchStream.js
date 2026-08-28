'use client';
import { useState, useEffect } from 'react';
import { Video, ExternalLink, Users, Clock, Eye } from 'lucide-react';

export default function TwitchStream() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [streamStatus, setStreamStatus] = useState(null);
    const [viewerCount, setViewerCount] = useState(0);

    useEffect(() => {
        fetchSettings();
        // Check stream status every 30 seconds
        const interval = setInterval(checkStreamStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
            if (data?.twitchChannel && data.twitchEnabled) {
                checkStreamStatus();
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkStreamStatus = async () => {
        try {
            const res = await fetch('/api/twitch/stream-status');
            const data = await res.json();
            setStreamStatus(data);
            setViewerCount(data.stats?.viewerCount || 0);
        } catch (error) {
            console.error('Error checking stream status:', error);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-48 bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!settings?.twitchEnabled || !settings?.twitchChannel) {
        return null;
    }

    const isOnline = streamStatus?.live;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Video className="text-purple-500" size={24} />
                    {settings.twitchTitle || 'Live Stream'}
                    {isOnline && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            LIVE
                        </span>
                    )}
                </h2>
                <a
                    href={`https://twitch.tv/${settings.twitchChannel}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    Ouvrir sur Twitch <ExternalLink size={14} />
                </a>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={`https://player.twitch.tv/?channel=${settings.twitchChannel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=false`}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    title="Twitch Stream"
                />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                    {isOnline && viewerCount > 0 && (
                        <span className="flex items-center gap-1 text-green-400 font-bold">
                            <Eye size={16} />
                            {viewerCount} spectateurs
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Users size={16} />
                        Rejoignez la communauté
                    </span>
                    {isOnline && (
                        <span className="flex items-center gap-1 text-green-400">
                            <Clock size={16} />
                            En direct maintenant
                        </span>
                    )}
                </div>
                <a
                    href={`https://twitch.tv/${settings.twitchChannel}/chat`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                >
                    Chat Twitch
                </a>
            </div>

            {!isOnline && !settings.twitchShowOffline && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                    <p className="text-yellow-400">
                        😴 Stream actuellement hors ligne. Revenez bientôt pour des sessions live !
                    </p>
                </div>
            )}
        </div>
    );
}
