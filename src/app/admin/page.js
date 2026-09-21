'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
    Menu, X, LayoutDashboard, Users, TrendingUp, Trophy, BookOpen, Layers,
    Code, FileText, Mail, Gift, Tag, Brain, ShieldAlert, UserCog, Crown,
    ChevronRight, Search, Wifi, MonitorPlay, Award, Zap, Sparkles, Clock,
    CheckCircle, ExternalLink, ArrowRight
} from 'lucide-react';
import { useSession } from "next-auth/react";
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminDashboard() {
    const { t } = useLanguage();
    const { data: session, status } = useSession();

    // Data states
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [gamificationStats, setGamificationStats] = useState({});
    const [fullStats, setFullStats] = useState({});
    const [analyticsData, setAnalyticsData] = useState(null);
    const [studentsList, setStudentsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // YouTube Sidebar state (Expanded by default on desktop, collapsed on mobile)
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    // Active View Tab on page: 'overview' | 'students' | 'analytics' | 'gamification' | 'hub'
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

        if (isAdmin) {
            Promise.all([
                fetch('/api/admin/stats').then(r => r.ok ? r.json() : {}).catch(() => ({})),
                fetch('/api/admin/gamification-stats').then(r => r.ok ? r.json() : {}).catch(() => ({})),
                fetch('/api/admin/full-stats').then(r => r.ok ? r.json() : {}).catch(() => ({})),
                fetch('/api/admin/analytics/students').then(r => r.ok ? r.json() : null).catch(() => null),
                fetch('/api/admin/users').then(r => r.ok ? r.json() : { users: [] }).catch(() => ({ users: [] }))
            ]).then(([stats, gameStats, full, analytics, usersRes]) => {
                setData(stats.distribution || []);
                const userCount = stats.total || full.totalUsers || (usersRes?.users ? usersRes.users.length : 0);
                setTotal(userCount);
                setGamificationStats(gameStats || {});
                setFullStats(full || {});
                setAnalyticsData(analytics || null);
                setStudentsList(usersRes?.users || []);
                setLoading(false);
            }).catch(err => {
                console.error('Admin Dashboard Load Error:', err);
                setLoading(false);
            });
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [session, status]);

    if (status === 'loading') {
        return <div className="min-h-screen pt-28 text-center text-slate-400 animate-pulse">Chargement de la session...</div>;
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-md border-red-500/30">
                    <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Accès Non Autorisé</h1>
                    <p className="text-gray-400 text-sm">
                        Vous n'avez pas les droits d'administration nécessaires pour voir cette page.
                        <br />
                        Votre rôle: <strong>{session?.user?.role || 'N/A'}</strong>
                    </p>
                </div>
            </div>
        );
    }

    const COLORS = ['#a78bfa', '#3b82f6', '#10b981'];

    // Filter students
    const filteredStudents = studentsList.filter(u => {
        const term = searchTerm.toLowerCase();
        return (u.name || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
    });

    const enrolledCount = analyticsData?.overview?.totalEnrollments || fullStats?.totalEnrollments || 0;

    // Sidebar navigation items
    const handleTabSelect = (tabKey) => {
        setActiveTab(tabKey);
        setMobileDrawerOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-200 flex">
            {/* BACKDROP FOR MOBILE DRAWER */}
            {mobileDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileDrawerOpen(false)}
                />
            )}

            {/* SIDEBAR VERTICAL STYLE YOUTUBE */}
            <aside
                className={`fixed top-16 md:top-20 bottom-0 left-0 z-50 bg-[#0a0e17] border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
                    mobileDrawerOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
                } ${sidebarExpanded ? 'md:w-64' : 'md:w-20'}`}
            >
                {/* Header du Sidebar avec Toggle Hamburger */}
                <div className="p-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setSidebarExpanded(!sidebarExpanded)}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            title="Réduire / Agrandir le menu"
                        >
                            <Menu size={20} />
                        </button>
                        {(sidebarExpanded || mobileDrawerOpen) && (
                            <span className="font-bold text-sm text-white tracking-wide truncate">
                                Admin Studio
                            </span>
                        )}
                    </div>
                    {mobileDrawerOpen && (
                        <button
                            onClick={() => setMobileDrawerOpen(false)}
                            className="p-2 text-slate-400 hover:text-white md:hidden"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Contenu Déroulant du Sidebar Vertical */}
                <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                    {/* SECTION 1 : VUES PRINCIPALES (TABS) */}
                    <div>
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Principal</span>
                                <span className="text-[10px] text-purple-400 font-bold">Studio</span>
                            </div>
                        )}
                        <div className="space-y-1">
                            {/* Dashboard / Vue d'ensemble */}
                            <button
                                onClick={() => handleTabSelect('overview')}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Vue d'ensemble & Métriques"
                            >
                                <LayoutDashboard size={18} className={activeTab === 'overview' ? 'text-purple-400' : 'text-slate-400'} />
                                {sidebarExpanded && <span className="truncate">Vue Globale</span>}
                            </button>

                            {/* Étudiants Inscrits */}
                            <button
                                onClick={() => handleTabSelect('students')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'students'
                                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Voir les étudiants inscrits"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <Users size={18} className={activeTab === 'students' ? 'text-purple-400' : 'text-slate-400'} />
                                    {sidebarExpanded && <span className="truncate">Étudiants Inscrits</span>}
                                </div>
                                {sidebarExpanded && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        {total}
                                    </span>
                                )}
                            </button>

                            {/* Analytics Étudiants */}
                            <button
                                onClick={() => handleTabSelect('analytics')}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'analytics'
                                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Analytics & Progression"
                            >
                                <TrendingUp size={18} className={activeTab === 'analytics' ? 'text-sky-400' : 'text-slate-400'} />
                                {sidebarExpanded && <span className="truncate">Analytics & Cours</span>}
                            </button>

                            {/* Classement & Gamification */}
                            <button
                                onClick={() => handleTabSelect('gamification')}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'gamification'
                                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Classement et Gamification"
                            >
                                <Trophy size={18} className={activeTab === 'gamification' ? 'text-yellow-400' : 'text-slate-400'} />
                                {sidebarExpanded && <span className="truncate">Classement & XP</span>}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-800/80 my-2"></div>

                    {/* SECTION 2 : PÉDAGOGIE */}
                    <div>
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Pédagogie</span>
                                <ChevronRight size={13} className="text-slate-500" />
                            </div>
                        )}
                        <div className="space-y-1">
                            {/* Hub Lecture */}
                            <button
                                onClick={() => handleTabSelect('hub')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'hub'
                                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Hub Pédagogique (Parcours, SEO, Mémos)"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <BookOpen size={18} className="text-purple-400" />
                                    {sidebarExpanded && <span className="truncate">Hub Lecture</span>}
                                </div>
                                {sidebarExpanded && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500 text-white">VIP</span>
                                )}
                            </button>

                            {/* Formations */}
                            <Link
                                href="/admin/courses"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Gestion des formations"
                            >
                                <Layers size={18} className="text-blue-400" />
                                {sidebarExpanded && <span className="truncate">Formations</span>}
                            </Link>

                            {/* Inscriptions Python */}
                            <Link
                                href="/admin/python-registrations"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Inscriptions cours Python"
                            >
                                <Code size={18} className="text-amber-400" />
                                {sidebarExpanded && <span className="truncate">Inscriptions Python</span>}
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-slate-800/80 my-2"></div>

                    {/* SECTION 3 : OUTILS & GESTION */}
                    <div>
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Outils & Accès</span>
                                <ChevronRight size={13} className="text-slate-500" />
                            </div>
                        )}
                        <div className="space-y-1">
                            {/* Studio MyCV */}
                            <Link
                                href="/admin/cv"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Studio CV & MyCV"
                            >
                                <FileText size={18} className="text-indigo-400" />
                                {sidebarExpanded && <span className="truncate">Studio MyCV</span>}
                            </Link>

                            {/* Invitations */}
                            <Link
                                href="/admin/invitations"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Invitations étudiants"
                            >
                                <Mail size={18} className="text-orange-400" />
                                {sidebarExpanded && <span className="truncate">Invitations</span>}
                            </Link>

                            {/* Accès Gratuit */}
                            <Link
                                href="/admin/grant-access"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Débloquer un accès cours"
                            >
                                <Gift size={18} className="text-emerald-400" />
                                {sidebarExpanded && <span className="truncate">Accès Gratuit</span>}
                            </Link>

                            {/* Coupons Promo */}
                            <Link
                                href="/admin/coupons"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Gestion des codes promo"
                            >
                                <Tag size={18} className="text-teal-400" />
                                {sidebarExpanded && <span className="truncate">Coupons Promo</span>}
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-slate-800/80 my-2"></div>

                    {/* SECTION 4 : SYSTÈME & ADMINISTRATION */}
                    <div>
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Système</span>
                                <ChevronRight size={13} className="text-slate-500" />
                            </div>
                        )}
                        <div className="space-y-1">
                            {/* IA & Telegram */}
                            <Link
                                href="/admin/ai-config"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Configuration IA & Bot Telegram"
                            >
                                <Brain size={18} className="text-violet-400" />
                                {sidebarExpanded && <span className="truncate">IA & Telegram</span>}
                            </Link>

                            {/* R Stat Admin */}
                            <Link
                                href="/admin/r-stat-access"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Validation R Statistics"
                            >
                                <ShieldAlert size={18} className="text-fuchsia-400" />
                                {sidebarExpanded && <span className="truncate">R Stat Admin</span>}
                            </Link>

                            {/* Gérer Admins */}
                            <Link
                                href="/admin/manage-admins"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Gestion des rôles admin"
                            >
                                <UserCog size={18} className="text-rose-400" />
                                {sidebarExpanded && <span className="truncate">Gérer Admins</span>}
                            </Link>

                            {/* Super Admin Dashboard */}
                            <Link
                                href="/super-admin"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Espace Super Admin"
                            >
                                <Crown size={18} className="text-yellow-400" />
                                {sidebarExpanded && <span className="truncate">Super Admin</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL À DROITE DU SIDEBAR VERTICAL */}
            <main
                className={`flex-1 min-w-0 transition-all duration-300 pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 pb-16 ${
                    sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
                }`}
            >
                {/* Barre Supérieure du Contenu Principal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800/80 pb-5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setMobileDrawerOpen(true);
                                } else {
                                    setSidebarExpanded(!sidebarExpanded);
                                }
                            }}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
                            title="Menu vertical"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-[#a78bfa]">
                                    {activeTab === 'overview' && 'Tableau de Bord Admin'}
                                    {activeTab === 'students' && 'Gestion des Étudiants Inscrits'}
                                    {activeTab === 'analytics' && 'Analytics & Performance des Cours'}
                                    {activeTab === 'gamification' && 'Classement des Étudiants & XP'}
                                    {activeTab === 'hub' && 'Hub Pédagogique & Articles SEO'}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    {session?.user?.role || 'ADMIN'}
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                                {activeTab === 'overview' && 'Console de pilotage, supervision pédagogique et gestion des accès'}
                                {activeTab === 'students' && 'Liste complète des utilisateurs et gestion des droits d\'apprentissage'}
                                {activeTab === 'analytics' && 'Taux d\'inscriptions, avancement et activité récente des apprenants'}
                                {activeTab === 'gamification' && 'Récompenses, points d\'expérience et cours complétés'}
                                {activeTab === 'hub' && 'Parcours métiers, articles Google AdSense, fiches mémos et recruteur IA'}
                            </p>
                        </div>
                    </div>

                    {/* Stats Pills en Haut à Droite */}
                    <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
                        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 shadow-inner">
                            <div className="w-7 h-7 rounded-lg bg-[#a78bfa]/15 text-[#a78bfa] flex items-center justify-center">
                                <Users size={15} />
                            </div>
                            <div>
                                <span className="block text-[9px] uppercase font-bold text-slate-400">Utilisateurs</span>
                                <span className="text-sm font-black text-white">{total}</span>
                            </div>
                        </div>

                        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 shadow-inner">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                                <TrendingUp size={15} />
                            </div>
                            <div>
                                <span className="block text-[9px] uppercase font-bold text-slate-400">Inscriptions</span>
                                <span className="text-sm font-black text-white">{enrolledCount}</span>
                            </div>
                        </div>

                        <LanguageSwitcher />
                    </div>
                </div>

                {/* VUE 1 : OVERVIEW / VUE GLOBALE */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* 4 Cartes Métriques Rapides */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div
                                onClick={() => setActiveTab('students')}
                                className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-purple-500/40 hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Users size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs uppercase font-bold text-slate-500">Utilisateurs</p>
                                    <p className="text-2xl sm:text-3xl font-black text-white">{total}</p>
                                    <p className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                                        <span>Gérer la liste</span> &rarr;
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => setActiveTab('analytics')}
                                className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs uppercase font-bold text-slate-500">Inscriptions</p>
                                    <p className="text-2xl sm:text-3xl font-black text-white">{enrolledCount}</p>
                                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                                        <span>Voir le détail</span> &rarr;
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => setActiveTab('gamification')}
                                className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-amber-500/40 hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Zap size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs uppercase font-bold text-slate-500">XP Distribué</p>
                                    <p className="text-2xl sm:text-3xl font-black text-white">{gamificationStats.totalXp?.toLocaleString() || 0}</p>
                                    <p className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                                        <span>Classement</span> &rarr;
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => setActiveTab('gamification')}
                                className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-blue-500/40 hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Award size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs uppercase font-bold text-slate-500">Cours Terminés</p>
                                    <p className="text-2xl sm:text-3xl font-black text-white">{gamificationStats.totalCoursesCompleted || 0}</p>
                                    <p className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
                                        <span>Réussites</span> &rarr;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Graphique et Répartition */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card p-6 sm:p-8 min-h-[380px] flex flex-col rounded-2xl border border-slate-800">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                                    <Wifi size={18} className="text-[#a78bfa]" /> Répartition des Préférences
                                </h2>
                                <div className="flex-grow">
                                    {data.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={260}>
                                            <PieChart>
                                                <Pie
                                                    data={data}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={105}
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
                                        <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
                                            Chargement ou aucune donnée disponible.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {data.map((item, index) => (
                                    <div key={index} className="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between items-center group hover:bg-[#a78bfa]/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: `${COLORS[index % COLORS.length]}33`, color: COLORS[index % COLORS.length] }}>
                                                {item.name === 'En Ligne' ? <MonitorPlay size={22} /> : <Users size={22} />}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white">{item.name}</h3>
                                                <span className="text-xs text-slate-500">Mode d'apprentissage</span>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-white">{item.value}</div>
                                    </div>
                                ))}

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20">
                                    <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">Actions d'Accès Rapide</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                        Utilisez le menu vertical à gauche pour accéder directement aux étudiants inscrits, aux analytics ou aux modules de gestion de cours.
                                    </p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setActiveTab('students')} className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all">
                                            Voir les Étudiants &rarr;
                                        </button>
                                        <button onClick={() => setActiveTab('analytics')} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all">
                                            Voir Analytics &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VUE 2 : LISTE DES ÉTUDIANTS INSCRITS */}
                {activeTab === 'students' && (
                    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Users size={20} className="text-purple-400" />
                                    Liste des Utilisateurs & Étudiants Inscrits
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    {filteredStudents.length} utilisateur(s) actif(s) sur la plateforme
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher nom ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                                    <tr>
                                        <th className="px-4 py-3.5">Utilisateur</th>
                                        <th className="px-4 py-3.5">Email</th>
                                        <th className="px-4 py-3.5">Rôle</th>
                                        <th className="px-4 py-3.5">Date Inscription</th>
                                        <th className="px-4 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {filteredStudents.map((u) => (
                                        <tr key={u.id} className="hover:bg-purple-500/5 transition-colors">
                                            <td className="px-4 py-3 flex items-center gap-3 font-semibold text-white">
                                                {u.image ? (
                                                    <img src={u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                                                        {(u.name || u.email || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span>{u.name || 'Utilisateur'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-400">{u.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    u.role === 'SUPER_ADMIN' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                                                    u.role === 'ADMIN' ? 'bg-red-500/15 text-red-300 border border-red-500/30' :
                                                    'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href="/admin/grant-access"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-all"
                                                >
                                                    Accès Cours &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-slate-500">
                                                Aucun utilisateur trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* VUE 3 : ANALYTICS & COURS */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Course Stats */}
                            <div className="glass-card p-6 rounded-2xl border border-slate-800">
                                <h2 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-purple-400" />
                                    Inscriptions & Progression par Formation
                                </h2>
                                <div className="space-y-4">
                                    {(analyticsData?.courseStats || []).map(c => (
                                        <div key={c.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-bold text-white truncate flex-1 mr-3">{c.title}</p>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                                                    <span><strong className="text-white">{c.totalEnrolled}</strong> inscrits</span>
                                                    <span className="text-emerald-400 font-bold">{c.avgProgress}% moy.</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                                                    style={{ width: `${Math.max(c.avgProgress, 3)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {(!analyticsData?.courseStats || analyticsData.courseStats.length === 0) && (
                                        <p className="text-xs text-slate-500 text-center py-6">
                                            Aucune donnée d'inscriptions pour le moment.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="glass-card p-6 rounded-2xl border border-slate-800">
                                <h2 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                                    <Clock size={18} className="text-sky-400" />
                                    Activité Récente des Étudiants (7 jours)
                                </h2>
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                    {(analyticsData?.recentActivity || []).map((a, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {a.userName?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-300 truncate">
                                                    <span className="text-white font-semibold">{a.userName || 'Étudiant'}</span> a complété une leçon
                                                </p>
                                                <p className="text-[11px] text-slate-500 truncate">{a.lessonTitle} · {a.courseTitle}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-500 shrink-0">
                                                {a.completedAt ? new Date(a.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                            </span>
                                        </div>
                                    ))}
                                    {(!analyticsData?.recentActivity || analyticsData.recentActivity.length === 0) && (
                                        <p className="text-xs text-slate-500 text-center py-6">
                                            Aucune activité récente enregistrée.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VUE 4 : GAMIFICATION & LEADERBOARD */}
                {activeTab === 'gamification' && (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-slate-500">Cours Terminés</p>
                                    <p className="text-3xl font-black text-white">{gamificationStats.totalCoursesCompleted || 0}</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-slate-500">XP Total Distribué</p>
                                    <p className="text-3xl font-black text-white">{gamificationStats.totalXp?.toLocaleString() || 0} XP</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                                    <Crown size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-slate-500">Top Étudiant</p>
                                    <p className="text-lg font-bold text-white truncate">
                                        {gamificationStats.leaderboard?.[0]?.name || 'En cours...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Table */}
                        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                                <Crown size={22} className="text-yellow-400" />
                                Classement des Meilleurs Étudiants (Top 5)
                            </h3>
                            <div className="space-y-3">
                                {gamificationStats.leaderboard?.map((student, idx) => (
                                    <div key={student.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800/40 transition">
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs rounded-full ${
                                            idx === 0 ? 'bg-yellow-500 text-black' :
                                            idx === 1 ? 'bg-slate-300 text-black' :
                                            idx === 2 ? 'bg-amber-700 text-white' :
                                            'bg-slate-800 text-slate-400'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        {student.image ? (
                                            <img src={student.image} className="w-9 h-9 rounded-full object-cover" alt={student.name} />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs">
                                                {student.name?.[0]?.toUpperCase() || 'E'}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-xs sm:text-sm truncate text-white">{student.name}</p>
                                            <p className="text-[11px] text-slate-500">Niveau {student.level}</p>
                                        </div>
                                        <div className="font-black text-[#a78bfa] text-xs sm:text-sm">{student.xp} XP</div>
                                    </div>
                                ))}
                                {(!gamificationStats.leaderboard || gamificationStats.leaderboard.length === 0) && (
                                    <p className="text-xs text-slate-500 text-center py-6">Aucun étudiant classé pour le moment.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* VUE 5 : HUB PÉDAGOGIQUE */}
                {activeTab === 'hub' && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/40 border border-purple-500/30 shadow-2xl relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                    <Sparkles size={14} className="text-purple-400" /> Mode Consultation Pédagogique
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    Hub Pédagogique : Parcours, Articles SEO & Fiches Mémos
                                </h2>
                                <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                                    Consultez l'intégralité des 3 parcours métiers avec grilles de salaires, les 4 articles de fond du blog rédigés pour Google AdSense, les cheatsheets techniques prêtes à l'emploi et le recruteur IA.
                                </p>
                            </div>

                            <Link
                                href="/admin/contenus"
                                className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105 shrink-0"
                            >
                                <BookOpen size={18} />
                                <span>Ouvrir l'Espace de Lecture &rarr;</span>
                            </Link>
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
                )}
            </main>
        </div>
    );
}
