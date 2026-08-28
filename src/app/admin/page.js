
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Wifi, MonitorPlay, ShieldAlert, Trophy, Award, Zap, Crown, BookOpen, Gift, Mail, UserCog, BarChart3, Brain, Code } from 'lucide-react';
import { useSession } from "next-auth/react"
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminDashboard() {
    const { t } = useLanguage();
    const { data: session, status } = useSession();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [gamificationStats, setGamificationStats] = useState({});
    const [fullStats, setFullStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

        if (isAdmin) {
            Promise.all([
                fetch('/api/admin/stats').then(res => res.json()),
                fetch('/api/admin/gamification-stats').then(res => res.json()),
                fetch('/api/admin/full-stats').then(res => res.json())
            ]).then(([stats, gameStats, full]) => {
                if (stats.error) console.error(stats.error);
                if (gameStats.error) console.error(gameStats.error);

                setData(stats.distribution || []);
                setTotal(stats.total || 0);
                setGamificationStats(gameStats || {});
                setFullStats(full || {});
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [session]);

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (session?.user?.role === 'MARKETING_RECOVERY') {
        // Redirect marketing users to their dashboard
        if (typeof window !== 'undefined') { // Client-side check
            window.location.href = '/admin/marketing';
        }
        return <div className="min-h-screen pt-24 text-center text-gray-500">Redirection vers l'espace Marketing...</div>;
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN' ||
                     session?.user?.role === 'R_STAT_ADMIN' || session?.user?.role === 'MARKETING_ADMIN' ||
                     session?.user?.rStatAdminAccess === true;

    if (!session || !isAdmin) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Accès Refusé</h1>
                    <p className="text-gray-400">
                        Vous n'avez pas les droits d'administration nécessaires pour voir cette page.
                        <br />
                        Votre rôle: <strong>{session?.user?.role || 'N/A'}</strong>
                    </p>
                </div>
            </div>
        );
    }

    const COLORS = ['#a78bfa', '#3b82f6', '#10b981'];

    return (
        <div className="min-h-screen pt-24 px-4 container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a78bfa]">
                        {t('admin.title')}
                    </h1>
                    <p className="text-gray-400 mt-2">{t('admin.analytics')} & {t('admin.revenue')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link href="/admin/invitations" className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <Mail size={20} /> Invitations
                    </Link>
                    <Link href="/admin/courses" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <BookOpen size={20} /> {t('admin.courses')}
                    </Link>
                    <Link href="/admin/grant-access" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <Gift size={20} /> Accès Gratuit
                    </Link>
                    <Link href="/admin/r-stat-access" className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <ShieldAlert size={20} /> R Stat Admin
                    </Link>
                    <Link href="/admin/manage-admins" className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <UserCog size={20} /> Gérer les Admins
                    </Link>
                    <Link href="/admin/analytics" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <BarChart3 size={20} /> Analytics
                    </Link>
                    <Link href="/admin/coupons" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <Gift size={20} /> Coupons
                    </Link>
                    <Link href="/admin/python-registrations" className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <Code size={20} /> Python Inscriptions
                    </Link>
                    <Link href="/admin/ai-config" className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <Brain size={20} /> IA Config
                    </Link>
                    <div className="glass px-6 py-3 rounded-xl flex items-center gap-3">
                        <Users className="text-[#a78bfa]" />
                        <div>
                            <span className="block text-xs text-gray-500 uppercase tracking-wider">{t('admin.users')}</span>
                            <span className="text-2xl font-bold">{total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Chargement des données...</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Chart Section */}
                    <div className="glass-card p-8 min-h-[400px] flex flex-col">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Wifi size={20} className="text-[#a78bfa]" /> Préférences
                        </h2>
                        <div className="flex-grow">
                            {data.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e2337', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Aucune donnée.
                                </div>
                            )}
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">
                        </p>
                    </div>

                    {/* Quick Stats / Details */}
                    <div className="space-y-6">
                        {data.map((item, index) => (
                            <div key={index} className="glass-card p-6 flex justify-between items-center group hover:bg-[#a78bfa]/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold`} style={{ backgroundColor: `${COLORS[index % COLORS.length]}33`, color: COLORS[index % COLORS.length] }}>
                                        {item.name === 'En Ligne' ? <MonitorPlay size={24} /> : <Users size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{item.name}</h3>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold">{item.value}</div>
                            </div>
                        ))}

                        <div className="glass p-8 rounded-2xl border border-[#a78bfa]/30 mt-8 relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#a78bfa]/10 rounded-full blur-[50px]"></div>
                            <h3 className="text-xl font-bold mb-2">Note IA</h3>
                        </div>
                    </div>
                </div>
            )}


            {/* Gamification Stats */}
            {!loading && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-6 flex items-center gap-2">
                        <Trophy size={28} className="text-yellow-500" /> {t('dashboard.leaderboard')}
                    </h2>


                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Stats Cards */}
                        <div className="glass-card p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase">Cours Terminés</p>
                                <p className="text-3xl font-bold">{gamificationStats.totalCoursesCompleted || 0}</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                                <Zap size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase">XP Total Distribué</p>
                                <p className="text-3xl font-bold">{gamificationStats.totalXp?.toLocaleString() || 0} XP</p>
                            </div>
                        </div>

                        {/* Leaderboard Table */}
                        <div className="glass-card p-6 md:row-span-2 md:col-start-3 row-start-2">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                                <Crown size={20} className="text-yellow-500" /> Top Étudiants
                            </h3>
                            <div className="space-y-4">
                                {gamificationStats.leaderboard?.map((student, idx) => (
                                    <div key={student.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5">
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                            {idx + 1}
                                        </div>
                                        {student.image ? (
                                            <img src={student.image} className="w-8 h-8 rounded-full" alt={student.name} />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white">
                                                {student.name?.[0]}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate text-white">{student.name}</p>
                                            <p className="text-xs text-gray-500">Niveau {student.level}</p>
                                        </div>
                                        <div className="font-bold text-[#a78bfa] text-sm">{student.xp} XP</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
