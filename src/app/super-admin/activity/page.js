'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { 
    Activity, Users, Clock, BookOpen, Monitor, Globe, 
    Search, Filter, RefreshCw, Eye, Download, Play, 
    ArrowLeft, Calendar, Compass, Crown, Key, MessageCircle,
    DollarSign, Lock, Send, Code, ExternalLink, Video,
    CheckCircle, LayoutDashboard, Sparkles, Award, TrendingUp,
    Trophy, Zap, Smartphone, Laptop, BarChart2, ShieldAlert,
    ChevronRight, X, Menu
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SuperAdminActivity() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [filterDays, setFilterDays] = useState(30);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('students'); // 'students', 'courses', 'logs'
    const [actionFilter, setActionFilter] = useState('all'); // 'all', 'view', 'heartbeat'
    const [liveOnlyFilter, setLiveOnlyFilter] = useState(false);
    const [sortBy, setSortBy] = useState('time_desc'); // 'time_desc', 'time_asc', 'name'
    const [data, setData] = useState({ logs: [], studentStats: [], coursePopularity: [] });

    // YouTube Sidebar state (Expanded by default on desktop, collapsed on mobile)
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') {
            fetchActivityData();
        }
    }, [session, filterDays, actionFilter]);

    const fetchActivityData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/super-admin/activity?days=${filterDays}&action=${actionFilter}`);
            const json = await res.json();
            if (res.ok) {
                setData(json);
            }
        } catch (error) {
            console.error('Error fetching activity data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportActivityData = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `elsayf-activity-logs-${filterDays}j.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Helper functions
    const formatDuration = (seconds) => {
        if (!seconds) return '0 min';
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    const isLive = (lastActiveDate) => {
        if (!lastActiveDate) return false;
        const last = new Date(lastActiveDate);
        const now = new Date();
        // Heartbeat is sent every 30s. Consider active if pinged in the last 2 minutes
        return (now.getTime() - last.getTime()) < 120000;
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Jamais';
        const date = new Date(dateString);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSeconds < 60) return "À l'instant";
        if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)} min`;
        if (diffSeconds < 86400) return `Il y a ${Math.floor(diffSeconds / 3600)} h`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' ' +
               date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const parseUA = (ua) => {
        if (!ua) return { browser: 'Web', os: 'Inconnu', isMobile: false };
        let browser = 'Chrome';
        let os = 'Windows';
        let isMobile = false;
        
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
        
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Macintosh')) os = 'macOS';
        else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
        else if (ua.includes('Android')) { os = 'Android'; isMobile = true; }
        else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; isMobile = true; }
        
        return { browser, os, isMobile };
    };

    // Aggregated metrics
    const totalDurationSeconds = data.studentStats.reduce((sum, item) => sum + (item.totalTimeSpent || 0), 0);
    const activeStudentsCount = data.studentStats.length;
    const liveStudentsCount = data.studentStats.filter(s => isLive(s.lastActive)).length;
    const mostActiveCourse = data.coursePopularity[0]?.title || 'Aucune formation';
    const maxStudentTime = useMemo(() => {
        return Math.max(...data.studentStats.map(s => s.totalTimeSpent || 0), 1);
    }, [data.studentStats]);

    // Filtered & Sorted Students
    const filteredStudents = useMemo(() => {
        return data.studentStats
            .filter(student => {
                const term = searchTerm.toLowerCase();
                const matchesSearch = (student.name || '').toLowerCase().includes(term) ||
                                     (student.email || '').toLowerCase().includes(term);
                const matchesLive = !liveOnlyFilter || isLive(student.lastActive);
                return matchesSearch && matchesLive;
            })
            .sort((a, b) => {
                if (sortBy === 'time_desc') return (b.totalTimeSpent || 0) - (a.totalTimeSpent || 0);
                if (sortBy === 'time_asc') return (a.totalTimeSpent || 0) - (b.totalTimeSpent || 0);
                if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
                return 0;
            });
    }, [data.studentStats, searchTerm, liveOnlyFilter, sortBy]);

    // Filtered Logs
    const filteredLogs = useMemo(() => {
        return data.logs.filter(log => {
            const term = searchTerm.toLowerCase();
            return (log.user?.name || '').toLowerCase().includes(term) ||
                   (log.user?.email || '').toLowerCase().includes(term) ||
                   (log.action || '').toLowerCase().includes(term) ||
                   (log.details?.lessonTitle || '').toLowerCase().includes(term) ||
                   (log.details?.path || '').toLowerCase().includes(term);
        });
    }, [data.logs, searchTerm]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen pt-28 text-center text-slate-400 animate-pulse bg-[#070b14]">
                Chargement de la session Super Admin...
            </div>
        );
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-28 px-4 flex items-center justify-center bg-[#070b14]">
                <div className="glass-card p-10 text-center max-w-md border-red-500/30">
                    <ShieldAlert size={56} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Accès Super Admin Requis</h1>
                    <p className="text-gray-400 text-sm mb-6">
                        Cette section confidentielle de tracking est strictement réservée au Super Admin.
                    </p>
                    <Link
                        href="/super-admin"
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg"
                    >
                        Retourner au Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-200 flex">
            {/* BACKDROP FOR MOBILE DRAWER */}
            {mobileDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileDrawerOpen(false)}
                />
            )}

            {/* SIDEBAR VERTICAL STYLE YOUTUBE STUDIO */}
            <aside
                className={`fixed top-16 bottom-0 left-0 z-40 bg-[#0a0e17] border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
                    mobileDrawerOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
                } ${sidebarExpanded ? 'md:w-64' : 'md:w-20'}`}
            >
                {/* Header du Drawer Mobile */}
                {mobileDrawerOpen && (
                    <div className="p-3 flex items-center justify-between border-b border-slate-800/60 shrink-0 md:hidden">
                        <span className="font-bold text-sm text-white px-2 flex items-center gap-2">
                            <Crown size={16} className="text-amber-400" />
                            Super Studio
                        </span>
                        <button
                            onClick={() => setMobileDrawerOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Contenu Déroulant du Sidebar Vertical */}
                <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                    {/* SECTION 1 : VUES PRINCIPALES (CONTRÔLE) */}
                    <div>
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Contrôle</span>
                                <span className="text-[10px] text-amber-400 font-bold">SUPER</span>
                            </div>
                        )}
                        <div className="space-y-1">
                            {/* Onglet Utilisateurs */}
                            <Link
                                href="/super-admin"
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-300 hover:text-white hover:bg-white/5 ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Gestion des Utilisateurs & Rôles"
                            >
                                <Users size={18} className="text-slate-400" />
                                {sidebarExpanded && <span className="truncate">Utilisateurs & Rôles</span>}
                            </Link>

                            {/* Onglet Temps Passé & Activité (ACTIF SUR CETTE PAGE) */}
                            <Link
                                href="/super-admin/activity"
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Suivi d'Activité Étudiants & Temps Passé"
                            >
                                <Clock size={18} className="text-cyan-400" />
                                {sidebarExpanded && (
                                    <div className="flex-1 flex items-center justify-between truncate">
                                        <span>Temps Passé & Logs</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/25 text-cyan-200 font-black">
                                            LIVE
                                        </span>
                                    </div>
                                )}
                            </Link>

                            {/* Onglet Analytics Global */}
                            <Link
                                href="/super-admin/analytics"
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Analytics détaillés de la plateforme"
                            >
                                <BarChart2 size={18} className="text-emerald-400" />
                                {sidebarExpanded && (
                                    <div className="flex-1 flex items-center justify-between truncate">
                                        <span>Analytics Global</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                                            Stats
                                        </span>
                                    </div>
                                )}
                            </Link>

                            {/* Accès Rapide Email */}
                            <Link
                                href="/super-admin"
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Accès Rapide par Email"
                            >
                                <Key size={18} className="text-slate-400" />
                                {sidebarExpanded && <span className="truncate">Accès Rapide Email</span>}
                            </Link>

                            {/* Messagerie Étudiants */}
                            <Link
                                href="/super-admin"
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Messagerie Étudiants"
                            >
                                <MessageCircle size={18} className="text-slate-400" />
                                {sidebarExpanded && <span className="truncate">Messagerie Étudiants</span>}
                            </Link>
                        </div>
                    </div>

                    {/* SECTION 2 : OUTILS STRATÉGIQUES */}
                    <div className="pt-2 border-t border-slate-800/60">
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Outils Stratégiques
                            </div>
                        )}
                        <div className="space-y-1">
                            <Link
                                href="/super-admin/pricing"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Plans d'Abonnement & Tarification"
                            >
                                <DollarSign size={18} className="text-emerald-400" />
                                {sidebarExpanded && <span className="truncate">Plans & Pricing</span>}
                            </Link>

                            <Link
                                href="/super-admin/course-access"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Débloquer l'accès aux cours"
                            >
                                <Lock size={18} className="text-pink-400" />
                                {sidebarExpanded && <span className="truncate">Accès Cours</span>}
                            </Link>

                            <Link
                                href="/super-admin/campaigns"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Campagnes Marketing & Newsletters"
                            >
                                <Send size={18} className="text-orange-400" />
                                {sidebarExpanded && <span className="truncate">Campagnes Email</span>}
                            </Link>

                            <Link
                                href="/super-admin/vscode-access"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Console VSCode Web"
                            >
                                <Code size={18} className="text-blue-400" />
                                {sidebarExpanded && (
                                    <span className="flex items-center justify-between flex-1 truncate">
                                        <span>VSCode Web</span>
                                        <ExternalLink size={12} className="text-slate-500" />
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/super-admin/twitch-stats"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Directs & Twitch Stats"
                            >
                                <Video size={18} className="text-purple-400" />
                                {sidebarExpanded && <span className="truncate">Twitch & Lives</span>}
                            </Link>

                            <Link
                                href="/super-admin/tests"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Tests Unitaires & Santé Système"
                            >
                                <CheckCircle size={18} className="text-teal-400" />
                                {sidebarExpanded && <span className="truncate">Tests Système</span>}
                            </Link>
                        </div>
                    </div>

                    {/* SECTION 3 : PASSERELLES ADMIN */}
                    <div className="pt-2 border-t border-slate-800/60">
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Passerelles
                            </div>
                        )}
                        <div className="space-y-1">
                            <Link
                                href="/admin"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-purple-600/15 border border-purple-500/20 transition-all ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Basculer vers Admin Studio"
                            >
                                <LayoutDashboard size={18} className="text-purple-400" />
                                {sidebarExpanded && <span className="truncate text-purple-300">Admin Studio ↗</span>}
                            </Link>

                            <Link
                                href="/admin/contenus"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Hub Pédagogique & SEO"
                            >
                                <Sparkles size={18} className="text-amber-400" />
                                {sidebarExpanded && <span className="truncate">Hub Pédagogique</span>}
                            </Link>

                            <Link
                                href="/admin/affiliates"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Affiliation & Tracking"
                            >
                                <Award size={18} className="text-indigo-400" />
                                {sidebarExpanded && <span className="truncate">Affiliation</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL À DROITE DU SIDEBAR VERTICAL */}
            <div
                className={`flex-1 min-w-0 transition-all duration-300 pt-2 sm:pt-4 px-4 sm:px-6 lg:px-8 pb-16 ${
                    sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
                }`}
            >
                {/* Barre Supérieure du Contenu Principal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800/80 pb-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                                Super Admin • Suivi d'Activité & Temps Passé
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                LIVE TRACKING
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">
                            Mesure en temps réel du temps d'étude effectif par cours, détection des étudiants actifs et journal d'apprentissage
                        </p>
                    </div>

                    {/* Actions d'En-tête */}
                    <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
                        {/* Sélecteur de Période Temporelle */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner text-xs font-semibold">
                            <Calendar size={14} className="text-cyan-400" />
                            <select
                                value={filterDays}
                                onChange={(e) => setFilterDays(parseInt(e.target.value))}
                                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
                            >
                                <option value={1} className="bg-slate-900 text-white">Aujourd'hui</option>
                                <option value={7} className="bg-slate-900 text-white">7 derniers jours</option>
                                <option value={30} className="bg-slate-900 text-white">30 derniers jours</option>
                                <option value={90} className="bg-slate-900 text-white">90 derniers jours</option>
                                <option value={365} className="bg-slate-900 text-white">Toute l'année</option>
                            </select>
                        </div>

                        {/* Bouton Exporter */}
                        <button
                            onClick={exportActivityData}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                            title="Télécharger l'intégralité des logs au format JSON"
                        >
                            <Download size={15} className="text-indigo-400" />
                            <span className="hidden sm:inline">Exporter</span>
                        </button>

                        {/* Bouton Actualiser */}
                        <button
                            onClick={fetchActivityData}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Actualiser les données d'activité"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin text-cyan-400' : ''} />
                        </button>

                        {/* Lien Retour Super Admin */}
                        <Link
                            href="/super-admin"
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                        >
                            <ArrowLeft size={14} />
                            <span>Utilisateurs</span>
                        </Link>
                    </div>
                </div>

                {/* 4 CARTES KPI VIBRANTES STYLE STUDIO */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
                    {/* KPI 1 : TEMPS TOTAL */}
                    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-slate-950/70 to-slate-950 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                        <div className="absolute -right-2 -bottom-2 opacity-5 text-purple-400 group-hover:scale-110 transition-transform">
                            <Clock size={90} />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-black tracking-wider text-purple-300/80">Temps Total d'Étude</span>
                            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                                <Clock size={16} />
                            </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                            {formatDuration(totalDurationSeconds)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <span className="text-purple-300 font-bold">
                                {activeStudentsCount > 0 ? formatDuration(Math.round(totalDurationSeconds / activeStudentsCount)) : '0 min'}
                            </span>
                            <span>moyenne / étudiant</span>
                        </p>
                    </div>

                    {/* KPI 2 : ÉTUDIANTS ACTIFS */}
                    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-slate-950/70 to-slate-950 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                        <div className="absolute -right-2 -bottom-2 opacity-5 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Users size={90} />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300/80">Étudiants Actifs</span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                                <Users size={16} />
                            </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-black font-mono text-emerald-300 tracking-tight">
                            {activeStudentsCount}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Ayant suivi des cours ({filterDays} jours)
                        </p>
                    </div>

                    {/* KPI 3 : EN DIRECT / SESSIONS */}
                    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-950/70 to-slate-950 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                        <div className="absolute -right-2 -bottom-2 opacity-5 text-cyan-400 group-hover:scale-110 transition-transform">
                            <Compass size={90} />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-black tracking-wider text-cyan-300/80 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                <span>En Direct</span>
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                                <Activity size={16} />
                            </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-black font-mono text-cyan-300 tracking-tight">
                            {liveStudentsCount}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            {liveStudentsCount > 0 ? 'Apprenant en ce moment même' : 'Aucune session active'}
                        </p>
                    </div>

                    {/* KPI 4 : FORMATION TOP */}
                    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-slate-950/70 to-slate-950 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                        <div className="absolute -right-2 -bottom-2 opacity-5 text-amber-400 group-hover:scale-110 transition-transform">
                            <BookOpen size={90} />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-black tracking-wider text-amber-300/80">Formation Top</span>
                            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                                <Trophy size={16} />
                            </div>
                        </div>
                        <p className="text-sm sm:text-base font-black text-amber-200 truncate mt-1" title={mostActiveCourse}>
                            {mostActiveCourse}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <span className="text-amber-400 font-bold">
                                {data.coursePopularity[0] ? formatDuration(data.coursePopularity[0].duration) : '0h'}
                            </span>
                            <span>consacrées au total</span>
                        </p>
                    </div>
                </div>

                {/* ONGLETS HORIZONTAUX DE NAVIGATION */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800/60 scrollbar-none">
                    <button
                        onClick={() => { setActiveTab('students'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            activeTab === 'students'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                    >
                        <Users size={15} />
                        <span>Temps par Étudiant ({filteredStudents.length})</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('courses'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            activeTab === 'courses'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                    >
                        <BookOpen size={15} />
                        <span>Popularité des Formations ({data.coursePopularity.length})</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('logs'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            activeTab === 'logs'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                    >
                        <Eye size={15} />
                        <span>Flux d'Activité en Direct ({filteredLogs.length})</span>
                    </button>
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES DYNAMIQUES */}
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap gap-3 items-center justify-between mb-6">
                    <div className="relative min-w-[260px] flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder={activeTab === 'students' ? "Filtrer un étudiant par nom ou email..." : "Filtrer les logs par leçon, cours, nom..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-500 text-xs text-slate-200 placeholder-slate-500 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Filtre En Ligne Uniquement (Tab Étudiants) */}
                        {activeTab === 'students' && (
                            <>
                                <button
                                    onClick={() => setLiveOnlyFilter(!liveOnlyFilter)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                                        liveOnlyFilter
                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                                            : 'bg-slate-950/60 text-slate-400 hover:text-white border-slate-800'
                                    }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>En direct ({liveStudentsCount})</span>
                                </button>

                                <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
                                    <span className="text-slate-500">Tri:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1 text-xs"
                                    >
                                        <option value="time_desc" className="bg-slate-900 text-white">Plus d'heures</option>
                                        <option value="time_asc" className="bg-slate-900 text-white">Moins d'heures</option>
                                        <option value="name" className="bg-slate-900 text-white">Alphabétique</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Filtre d'Action (Tab Logs) */}
                        {activeTab === 'logs' && (
                            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
                                <Filter size={14} className="text-slate-400" />
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1 text-xs"
                                >
                                    <option value="all" className="bg-slate-900 text-white">Toutes les actions</option>
                                    <option value="view" className="bg-slate-900 text-white">Visites de leçons</option>
                                    <option value="heartbeat" className="bg-slate-900 text-white">Pings de présence (Temps)</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* ZONE DE CONTENU PRINCIPALE */}
                {loading ? (
                    <div className="glass-card p-16 rounded-2xl border border-slate-800 text-center">
                        <div className="animate-spin inline-block w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full mb-3" />
                        <p className="text-slate-400 text-xs font-semibold">Récupération des logs en temps réel...</p>
                    </div>
                ) : (
                    <>
                        {/* TAB 1 : LEADERBOARD DES ÉTUDIANTS & TEMPS D'ÉTUDE */}
                        {activeTab === 'students' && (
                            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-900/90 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                            <tr>
                                                <th className="py-3.5 px-4 w-12 text-center">#</th>
                                                <th className="py-3.5 px-4">Étudiant</th>
                                                <th className="py-3.5 px-4">Email</th>
                                                <th className="py-3.5 px-4 text-right">Temps Passé Total</th>
                                                <th className="py-3.5 px-4">Formations Suivies</th>
                                                <th className="py-3.5 px-4 text-right">Dernière Activité</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 text-xs">
                                            {filteredStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-12 text-center text-slate-500">
                                                        Aucune donnée d'apprentissage ne correspond à cette recherche.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredStudents.map((student, index) => {
                                                    const isStudentLive = isLive(student.lastActive);
                                                    const pct = Math.min(100, Math.round((student.totalTimeSpent / maxStudentTime) * 100));

                                                    return (
                                                        <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                                                            {/* Rang */}
                                                            <td className="py-3.5 px-4 text-center">
                                                                {index === 0 ? (
                                                                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] flex items-center justify-center mx-auto border border-amber-500/40">
                                                                        🥇
                                                                    </span>
                                                                ) : index === 1 ? (
                                                                    <span className="w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 font-black text-[11px] flex items-center justify-center mx-auto border border-slate-400/40">
                                                                        🥈
                                                                    </span>
                                                                ) : index === 2 ? (
                                                                    <span className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-black text-[11px] flex items-center justify-center mx-auto border border-amber-700/40">
                                                                        🥉
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-500 font-mono text-[11px] font-bold">
                                                                        {index + 1}
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Étudiant + Statut Live */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    {student.image ? (
                                                                        <img src={student.image} className="w-8 h-8 rounded-full border border-slate-700 object-cover" alt="" />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                                                                            {student.name?.[0]?.toUpperCase() || '?'}
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0">
                                                                        <p className="font-bold text-white truncate flex items-center gap-1.5">
                                                                            <span>{student.name || 'Étudiant Anonyme'}</span>
                                                                            {isStudentLive && (
                                                                                <span className="inline-flex items-center gap-1 text-[9px] text-emerald-300 font-black bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                                                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                                                                                    EN DIRECT
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Email */}
                                                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] truncate max-w-[180px]">
                                                                {student.email}
                                                            </td>

                                                            {/* Temps Passé Total avec Barre de Volume */}
                                                            <td className="py-3.5 px-4 text-right">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="font-black text-cyan-300 font-mono text-sm">
                                                                        {formatDuration(student.totalTimeSpent)}
                                                                    </span>
                                                                    <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                                                                        <div
                                                                            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                                                                            style={{ width: `${Math.max(pct, 5)}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Formations Suivies */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="flex flex-wrap gap-1.5 max-w-sm">
                                                                    {Object.entries(student.coursesBreakdown || {}).length === 0 ? (
                                                                        <span className="text-slate-500 text-[10px]">Navigation générale</span>
                                                                    ) : (
                                                                        Object.entries(student.coursesBreakdown).map(([course, time]) => (
                                                                            <span
                                                                                key={course}
                                                                                className="text-[10px] bg-slate-900 border border-slate-700/80 rounded-md px-2 py-0.5 text-slate-300 font-semibold flex items-center gap-1 shadow-sm"
                                                                                title={`${course} : ${formatDuration(time)}`}
                                                                            >
                                                                                <span className="truncate max-w-[110px]">{course.replace(/-/g, ' ')}</span>
                                                                                <span className="text-cyan-400 font-bold font-mono">({formatDuration(time)})</span>
                                                                            </span>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Horodatage Dernière Activité */}
                                                            <td className="py-3.5 px-4 text-right text-[11px] text-slate-400">
                                                                <span className="text-slate-300 font-medium">{formatRelativeTime(student.lastActive)}</span>
                                                                <span className="block text-[10px] text-slate-500 font-mono">
                                                                    {new Date(student.lastActive).toLocaleDateString('fr-FR')}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 2 : POPULARITÉ & VENTILATION DES FORMATIONS */}
                        {activeTab === 'courses' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Liste des Formations avec barres de progression */}
                                <div className="glass-card p-6 rounded-2xl border border-slate-800">
                                    <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                                        <BookOpen className="text-purple-400" size={18} />
                                        <span>Temps Cumulé par Formation</span>
                                    </h3>

                                    <div className="space-y-5">
                                        {data.coursePopularity.length === 0 ? (
                                            <p className="text-slate-500 text-xs text-center py-8">
                                                Aucun temps d'étude enregistré pour le moment.
                                            </p>
                                        ) : (
                                            data.coursePopularity.map((course, idx) => {
                                                const pct = totalDurationSeconds > 0
                                                    ? Math.min(100, Math.round((course.duration / totalDurationSeconds) * 100))
                                                    : 0;

                                                return (
                                                    <div key={course.slug} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black flex items-center justify-center shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="font-bold text-white text-xs truncate">
                                                                    {course.title}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-cyan-300 font-black font-mono text-xs">
                                                                    {formatDuration(course.duration)}
                                                                </span>
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-extrabold">
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Barre visuelle de progression */}
                                                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                                                                style={{ width: `${Math.max(pct, 3)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Analyse & Métriques Globales */}
                                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                                            <Compass className="text-cyan-400" size={18} />
                                            <span>Précision du Tracking d'Apprentissage</span>
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                            Chaque apprenant émet un heartbeat silencieux de <strong>30 secondes</strong> uniquement quand son onglet est au premier plan et qu'il consulte le cours. 
                                            Si l'étudiant quitte l'onglet ou met son navigateur en veille, le décompte s'interrompt instantanément.
                                        </p>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                                                <span className="text-xs text-slate-400">Formation Numéro 1 :</span>
                                                <span className="text-xs font-black text-amber-300 truncate max-w-[200px]">{mostActiveCourse}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                                                <span className="text-xs text-slate-400">Temps Total Enregistré :</span>
                                                <span className="text-xs font-black text-cyan-300 font-mono">{formatDuration(totalDurationSeconds)}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                                                <span className="text-xs text-slate-400">Nombre de Formations Étudiées :</span>
                                                <span className="text-xs font-black text-white font-mono">{data.coursePopularity.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                                                <span className="text-xs text-slate-400">Fréquence du Heartbeat :</span>
                                                <span className="text-xs font-bold text-emerald-400">Toutes les 30 secondes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5 border-t border-slate-800/80 mt-6 text-xs text-slate-500 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span>Synchronisation en temps réel active</span>
                                        </div>
                                        <button
                                            onClick={fetchActivityData}
                                            className="text-cyan-400 hover:underline font-semibold"
                                        >
                                            Forcer rafraîchissement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3 : JOURNAL D'ACTIVITÉ EN DIRECT (STREAM DES LOGS) */}
                        {activeTab === 'logs' && (
                            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto max-h-[650px] overflow-y-auto scrollbar-thin">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-900/95 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800 backdrop-blur-md">
                                            <tr>
                                                <th className="py-3 px-4">Horodatage</th>
                                                <th className="py-3 px-4">Étudiant</th>
                                                <th className="py-3 px-4">Type d'Action</th>
                                                <th className="py-3 px-4">Contexte Pédagogique</th>
                                                <th className="py-3 px-4">Appareil & OS</th>
                                                <th className="py-3 px-4 text-right">Adresse IP</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                                            {filteredLogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-12 text-center text-slate-500 font-sans">
                                                        Aucun événement enregistré ne correspond à ces critères.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredLogs.map((log) => {
                                                    const uaInfo = parseUA(log.userAgent);

                                                    return (
                                                        <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                                                            {/* Date & Heure */}
                                                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                                                                <span className="text-slate-300 font-semibold">{formatRelativeTime(log.createdAt)}</span>
                                                                <span className="block text-[10px] text-slate-500 font-mono">
                                                                    {new Date(log.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                </span>
                                                            </td>

                                                            {/* Profil Étudiant */}
                                                            <td className="py-3 px-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 font-sans">
                                                                    {log.user?.image ? (
                                                                        <img src={log.user.image} className="w-6 h-6 rounded-full object-cover" alt="" />
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                                                                            {log.user?.name?.[0]?.toUpperCase() || '?'}
                                                                        </div>
                                                                    )}
                                                                    <span className="font-semibold text-white text-xs">
                                                                        {log.user?.name || 'Inconnu'}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Action Badge */}
                                                            <td className="py-3 px-4 whitespace-nowrap font-sans">
                                                                {log.action === 'STUDENT_VIEW_LESSON' ? (
                                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-fit">
                                                                        <BookOpen size={11} />
                                                                        <span>LEÇON VUE</span>
                                                                    </span>
                                                                ) : log.action === 'STUDENT_VIEW_PAGE' ? (
                                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-500/15 text-orange-300 border border-orange-500/30 flex items-center gap-1 w-fit">
                                                                        <Globe size={11} />
                                                                        <span>PAGE VUE</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit">
                                                                        <Clock size={11} />
                                                                        <span>PRÉSENCE (+30s)</span>
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Contexte Pédagogique */}
                                                            <td className="py-3 px-4 max-w-xs truncate text-slate-300 font-sans">
                                                                {log.details?.lessonTitle ? (
                                                                    <div>
                                                                        <span className="font-bold text-white text-xs block truncate" title={log.details.lessonTitle}>
                                                                            📖 {log.details.lessonTitle}
                                                                        </span>
                                                                        <span className="text-[10px] text-cyan-400 block truncate">
                                                                            Formation : {log.details.courseSlug?.replace(/-/g, ' ')}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-400 text-xs font-mono">
                                                                        🌐 {log.details?.path || '/'}
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Device & OS */}
                                                            <td className="py-3 px-4 whitespace-nowrap font-sans">
                                                                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-semibold inline-flex items-center gap-1">
                                                                    {uaInfo.isMobile ? <Smartphone size={11} className="text-purple-400" /> : <Laptop size={11} className="text-cyan-400" />}
                                                                    <span>{uaInfo.browser} • {uaInfo.os}</span>
                                                                </span>
                                                            </td>

                                                            {/* IP */}
                                                            <td className="py-3 px-4 text-right text-[11px] text-slate-400 font-mono whitespace-nowrap">
                                                                {log.ipAddress || '127.0.0.1'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
