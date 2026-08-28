'use client';
import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/tracking/leaderboard');
            const data = await res.json();
            if (data.leaderboard) {
                setLeaders(data.leaderboard);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white p-8">Chargement du classement...</div>;

    const topThree = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Trophy className="text-yellow-400" size={32} />
                        Classement Général
                    </h1>
                    <p className="text-gray-400 mt-2">Les meilleurs étudiants de la plateforme.</p>
                </div>
            </div>

            {/* Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
                {/* 2nd Place */}
                {topThree[1] && (
                    <div className="glass-card p-6 flex flex-col items-center justify-end h-64 border-b-4 border-gray-400 bg-gradient-to-b from-gray-800/50 to-transparent order-1 md:order-1 relative">
                        <div className="absolute -top-4 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center font-bold text-gray-900 border-2 border-white">2</div>
                        <UserAvatar user={topThree[1]} size="lg" />
                        <h3 className="text-xl font-bold mt-4">{topThree[1].name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{topThree[1].faculty?.shortName || 'Étudiant'}</p>
                        <div className="bg-gray-400/20 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                            {topThree[1].xp} XP
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <div className="glass-card p-8 flex flex-col items-center justify-end h-80 border-b-4 border-yellow-400 bg-gradient-to-b from-yellow-900/20 to-transparent order-0 md:order-2 md:-mt-12 relative shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                        <div className="absolute -top-6">
                            <Crown size={40} className="text-yellow-400 animate-bounce" />
                        </div>
                        <UserAvatar user={topThree[0]} size="xl" border="border-4 border-yellow-400" />
                        <h3 className="text-2xl font-bold mt-4 text-yellow-400">{topThree[0].name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{topThree[0].faculty?.shortName || 'Champion'}</p>
                        <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {topThree[0].xp} XP
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <div className="glass-card p-6 flex flex-col items-center justify-end h-64 border-b-4 border-orange-700 bg-gradient-to-b from-orange-900/20 to-transparent order-2 md:order-3 relative">
                        <div className="absolute -top-4 w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center font-bold text-white border-2 border-white">3</div>
                        <UserAvatar user={topThree[2]} size="lg" />
                        <h3 className="text-xl font-bold mt-4">{topThree[2].name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{topThree[2].faculty?.shortName || 'Étudiant'}</p>
                        <div className="bg-orange-700/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold">
                            {topThree[2].xp} XP
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Rang</th>
                            <th className="px-6 py-4">Étudiant</th>
                            <th className="px-6 py-4">Faculté</th>
                            <th className="px-6 py-4">Niveau</th>
                            <th className="px-6 py-4 text-right">XP Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {rest.map((user, idx) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-500">#{idx + 4}</td>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <UserAvatar user={user} size="sm" />
                                    <span className="font-medium">{user.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">{user.faculty?.shortName || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded text-xs font-bold">
                                        Lvl {user.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-300">{user.xp} XP</td>
                            </tr>
                        ))}
                        {leaders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Aucun étudiant classé pour le moment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UserAvatar({ user, size = 'md', border = '' }) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-20 h-20 text-xl',
        xl: 'w-24 h-24 text-2xl',
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gray-700 text-white font-bold ${border} relative`}>
            {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
                <span>{user.name?.[0]?.toUpperCase() || '?'}</span>
            )}
        </div>
    );
}
