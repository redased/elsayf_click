
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Wifi, MonitorPlay, ShieldAlert, Trophy, Award, Zap, Crown, BookOpen, Gift, Mail, UserCog, BarChart3, Brain, Code, FileText, Sparkles, Tag } from 'lucide-react';
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
        <div className="min-h-screen pt-24 px-4 container mx-auto max-w-7xl">
            {/* Header supérieur avec titre, statut et compteurs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800/80 pb-6">
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-[#a78bfa]">
                            {t('admin.title')}
                        </h1>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {session?.user?.role || 'ADMIN'}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1.5">
                        Console de pilotage, supervision pédagogique et gestion des accès
                    </p>
                </div>

                <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
                    <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-inner">
                        <div className="w-9 h-9 rounded-lg bg-[#a78bfa]/15 text-[#a78bfa] flex items-center justify-center">
                            <Users size={18} />
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('admin.users')}</span>
                            <span className="text-xl font-black text-white">{total}</span>
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>
            </div>

            {/* Centre de Commandes Admin - Grille Moderne & Responsive (Zero débordement) */}
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                            Modules & Raccourcis Rapides
                        </span>
                    </div>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">11 outils de gestion actifs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
                    {/* Hub Lecture - En vedette */}
                    <Link
                        href="/admin/contenus"
                        className="group col-span-2 sm:col-span-1 p-3 rounded-xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 hover:border-purple-400 transition-all duration-200 shadow-md hover:shadow-purple-500/20 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <BookOpen size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5 truncate">
                                <span>Hub Lecture</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-500 text-white">VIP</span>
                            </div>
                            <div className="text-[10px] text-purple-300/70 truncate">Parcours & SEO</div>
                        </div>
                    </Link>

                    {/* Studio CV & MyCV */}
                    <Link
                        href="/admin/cv"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Studio MyCV</div>
                            <div className="text-[10px] text-slate-500 truncate">Créations de CV</div>
                        </div>
                    </Link>

                    {/* Formations */}
                    <Link
                        href="/admin/courses"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <BookOpen size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{t('admin.courses')}</div>
                            <div className="text-[10px] text-slate-500 truncate">Gestion catalogue</div>
                        </div>
                    </Link>

                    {/* Inscriptions Python */}
                    <Link
                        href="/admin/python-registrations"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Code size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Inscriptions Python</div>
                            <div className="text-[10px] text-slate-500 truncate">Demandes & Accès</div>
                        </div>
                    </Link>

                    {/* Invitations */}
                    <Link
                        href="/admin/invitations"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Invitations</div>
                            <div className="text-[10px] text-slate-500 truncate">Envoi d'invitations</div>
                        </div>
                    </Link>

                    {/* Accès Gratuit */}
                    <Link
                        href="/admin/grant-access"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Gift size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Accès Gratuit</div>
                            <div className="text-[10px] text-slate-500 truncate">Débloquer un cours</div>
                        </div>
                    </Link>

                    {/* Coupons */}
                    <Link
                        href="/admin/coupons"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Tag size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Coupons Promo</div>
                            <div className="text-[10px] text-slate-500 truncate">Réductions & Codes</div>
                        </div>
                    </Link>

                    {/* Analytics */}
                    <Link
                        href="/admin/analytics"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <BarChart3 size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Analytics</div>
                            <div className="text-[10px] text-slate-500 truncate">Audience & Clics</div>
                        </div>
                    </Link>

                    {/* IA Config */}
                    <Link
                        href="/admin/ai-config"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-violet-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Brain size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">IA & Telegram</div>
                            <div className="text-[10px] text-slate-500 truncate">Clés API & Rapports</div>
                        </div>
                    </Link>

                    {/* R Stat Admin */}
                    <Link
                        href="/admin/r-stat-access"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-fuchsia-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <ShieldAlert size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">R Stat Admin</div>
                            <div className="text-[10px] text-slate-500 truncate">Validations R</div>
                        </div>
                    </Link>

                    {/* Gérer les Admins */}
                    <Link
                        href="/admin/manage-admins"
                        className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <UserCog size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">Gérer Admins</div>
                            <div className="text-[10px] text-slate-500 truncate">Rôles & Permissions</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Section spéciale Hub de Lecture des nouveaux modules */}
            <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/40 border border-purple-500/30 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            <Sparkles size={14} className="text-purple-400" /> Mode Lecture & Consultation Admin
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">
                            Hub Pédagogique : Parcours, Articles SEO & Fiches Mémos
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                            Consultez à votre aise l'intégralité des 3 parcours métiers avec grilles de salaires, les 4 articles de fond du blog rédigés pour Google AdSense, les cheatsheets techniques prêtes à l'emploi et la banque de questions/réponses du recruteur IA.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/contenus"
                            className="px-6 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105"
                        >
                            <BookOpen size={18} />
                            <span>Ouvrir l'Espace de Lecture &rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* 4 cartes raccourcis rapides */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
                    <Link href="/admin/contenus" className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition group">
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">🚀 3 Parcours Métiers</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Data, Pentest, IA (Salaires DZD/€)</div>
                    </Link>
                    <Link href="/admin/contenus" className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition group">
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">✍️ 4 Articles Blog SEO</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">DAX, OWASP, Python, Normes ATS</div>
                    </Link>
                    <Link href="/admin/contenus" className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition group">
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">📚 4 Fiches Mémos</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">DAX, Excel, Nmap, Prompting</div>
                    </Link>
                    <Link href="/admin/contenus" className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition group">
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">🎯 Recruteur IA</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Questions & Réponses Modèles</div>
                    </Link>
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
