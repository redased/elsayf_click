'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { 
    Activity, Users, Clock, BookOpen, Monitor, Globe, 
    Search, Filter, RefreshCw, Eye, Download, Play, 
    ArrowLeft, Calendar, Compass 
} from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SuperAdminActivity() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [filterDays, setFilterDays] = useState(30);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('students'); // 'students', 'courses', 'logs'
    const [actionFilter, setActionFilter] = useState('all'); // 'all', 'view', 'heartbeat'
    const [data, setData] = useState({ logs: [], studentStats: [], coursePopularity: [] });

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

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <Activity size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée au Super Admin.</p>
                </div>
            </div>
        );
    }

    // Helper functions
    const formatDuration = (seconds) => {
        if (!seconds) return '0s';
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
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

    const parseUA = (ua) => {
        if (!ua) return 'Inconnu';
        let browser = 'Web';
        let os = 'OS';
        
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';
        
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Macintosh')) os = 'macOS';
        else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        
        return `${browser} - ${os}`;
    };

    // Calculate aggregated metrics
    const totalDurationSeconds = data.studentStats.reduce((sum, item) => sum + item.totalTimeSpent, 0);
    const activeStudentsCount = data.studentStats.length;
    const liveStudentsCount = data.studentStats.filter(s => isLive(s.lastActive)).length;
    const mostActiveCourse = data.coursePopularity[0]?.title || 'Aucun';

    // Filters for students
    const filteredStudents = data.studentStats.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filters for logs
    const filteredLogs = data.logs.filter(log => 
        log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.lessonTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.path?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-[#050a14] text-white">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Activity size={40} className="text-[#a78bfa]" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-purple-500">
                                Suivi d'Activité Étudiants
                            </h1>
                            <p className="text-gray-400 mt-1">Logs d'apprentissage et temps passé sur la plateforme</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <LanguageSwitcher />
                        <button
                            onClick={exportActivityData}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-gray-700/60"
                        >
                            <Download size={18} />
                            Exporter les logs
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                <div className="glass-card p-5 mb-8 flex flex-wrap gap-4 items-center justify-between border-purple-500/10">
                    <div className="flex flex-wrap gap-4 items-center flex-1">
                        {/* Search Bar */}
                        <div className="relative min-w-[280px] flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder={activeTab === 'students' ? "Rechercher un étudiant..." : "Rechercher par nom, email, leçon..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm placeholder-gray-500"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <select
                                value={filterDays}
                                onChange={(e) => setFilterDays(parseInt(e.target.value))}
                                className="px-3 py-2 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                            >
                                <option value={1}>Aujourd'hui</option>
                                <option value={7}>7 derniers jours</option>
                                <option value={30}>30 derniers jours</option>
                                <option value={90}>90 derniers jours</option>
                                <option value={365}>Toute l'année</option>
                            </select>
                        </div>

                        {/* Action Filter (Only in Logs tab) */}
                        {activeTab === 'logs' && (
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-gray-400" />
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                                >
                                    <option value="all">Toutes les actions</option>
                                    <option value="view">Visites de pages</option>
                                    <option value="heartbeat">Pings d'activité (temps)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={fetchActivityData}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 text-sm"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                    </button>
                </div>

                {/* KPI Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* KPI 1 */}
                    <div className="glass-card p-6 border-purple-500/10 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-white">
                            <Clock size={120} />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="text-purple-400" size={24} />
                            <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 uppercase font-bold">Cumul</span>
                        </div>
                        <p className="text-3xl font-bold font-mono text-purple-200">
                            {formatDuration(totalDurationSeconds)}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Temps total d'étude</p>
                    </div>

                    {/* KPI 2 */}
                    <div className="glass-card p-6 border-green-500/10 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-white">
                            <Users size={120} />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <Users className="text-green-400" size={24} />
                            <span className="text-[10px] bg-green-500/10 text-green-300 px-2 py-0.5 rounded border border-green-500/20 uppercase font-bold">{filterDays} jours</span>
                        </div>
                        <p className="text-3xl font-bold font-mono text-green-200">{activeStudentsCount}</p>
                        <p className="text-sm text-gray-400 mt-1">Étudiants actifs</p>
                    </div>

                    {/* KPI 3 */}
                    <div className="glass-card p-6 border-emerald-500/10 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-white">
                            <Compass size={120} />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute" />
                                <span className="text-sm font-bold text-emerald-400">EN DIRECT</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold font-mono text-emerald-200">{liveStudentsCount}</p>
                        <p className="text-sm text-gray-400 mt-1">Étudiants sur le site</p>
                    </div>

                    {/* KPI 4 */}
                    <div className="glass-card p-6 border-blue-500/10 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-white">
                            <BookOpen size={120} />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <BookOpen className="text-blue-400" size={24} />
                            <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 uppercase font-bold">Populaire</span>
                        </div>
                        <p className="text-lg font-bold text-blue-200 truncate mt-1.5" title={mostActiveCourse}>
                            {mostActiveCourse}
                        </p>
                        <p className="text-sm text-gray-400 mt-2.5">Formation la plus étudiée</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-800 mb-6">
                    <button
                        onClick={() => { setActiveTab('students'); setSearchTerm(''); }}
                        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'students' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        <Users size={16} />
                        Temps par Étudiant ({filteredStudents.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('courses'); setSearchTerm(''); }}
                        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'courses' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        <BookOpen size={16} />
                        Popularité des Formations ({data.coursePopularity.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('logs'); setSearchTerm(''); }}
                        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'logs' 
                                ? 'border-purple-500 text-purple-400' 
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        <Eye size={16} />
                        Journal d'Activité en Direct ({filteredLogs.length})
                    </button>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-[#a78bfa] border-t-transparent rounded-full mb-4"></div>
                        <p className="text-gray-400 text-sm">Chargement des données en direct...</p>
                    </div>
                ) : (
                    <>
                        {/* Tab 1: Students Leaderboard */}
                        {activeTab === 'students' && (
                            <div className="glass-card overflow-hidden border-purple-500/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Étudiant</th>
                                                <th className="px-6 py-4 text-left">Email</th>
                                                <th className="px-6 py-4 text-right">Temps d'étude total</th>
                                                <th className="px-6 py-4 text-left">Répartition par formation</th>
                                                <th className="px-6 py-4 text-right">Dernier ping actif</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800 text-sm">
                                            {filteredStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                        Aucune donnée d'activité trouvée pour cet étudiant.
                                                    </td>
                                                </tr>
                                            ) : filteredStudents.map((student) => {
                                                const isStudentLive = isLive(student.lastActive);
                                                return (
                                                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {student.image ? (
                                                                    <img src={student.image} className="w-9 h-9 rounded-full" alt="" />
                                                                ) : (
                                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a78bfa] to-purple-600 flex items-center justify-center text-black font-bold">
                                                                        {student.name?.[0]?.toUpperCase() || '?'}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="font-semibold text-white block">{student.name}</span>
                                                                    {isStudentLive && (
                                                                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                                            EN LIGNE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">{student.email}</td>
                                                        <td className="px-6 py-4 text-right font-bold text-purple-300 font-mono">
                                                            {formatDuration(student.totalTimeSpent)}
                                                        </td>
                                                        <td className="px-6 py-4 max-w-xs">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {Object.entries(student.coursesBreakdown).map(([course, time]) => (
                                                                    <span 
                                                                        key={course}
                                                                        className="text-[10px] bg-white/5 border border-gray-700/60 rounded px-2 py-0.5 text-gray-300"
                                                                        title={`${course} : ${formatDuration(time)}`}
                                                                    >
                                                                        {course} ({formatDuration(time)})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-xs text-gray-400 font-mono">
                                                            {new Date(student.lastActive).toLocaleDateString('fr-FR')} {new Date(student.lastActive).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Course Popularity */}
                        {activeTab === 'courses' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Bar list */}
                                <div className="glass-card p-6 border-purple-500/10">
                                    <h3 className="text-xl font-bold mb-6">Temps cumulé par formation</h3>
                                    <div className="space-y-6">
                                        {data.coursePopularity.length === 0 ? (
                                            <p className="text-gray-500 text-center py-6">Aucun log enregistré pour le moment.</p>
                                        ) : data.coursePopularity.map((course) => {
                                            const pct = totalDurationSeconds > 0
                                                ? Math.min(100, Math.round((course.duration / totalDurationSeconds) * 100))
                                                : 0;
                                            return (
                                                <div key={course.slug} className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-bold text-gray-200">{course.title}</span>
                                                        <span className="font-semibold text-purple-400 font-mono">
                                                            {formatDuration(course.duration)} ({pct}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700/30">
                                                        <div 
                                                            className="bg-gradient-to-r from-[#a78bfa] to-purple-600 h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Summary details */}
                                <div className="glass-card p-6 border-purple-500/10 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <Compass className="text-purple-400" size={20} />
                                            Analyse des formations
                                        </h3>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                            Ces statistiques sont basées sur les heartbeats en direct émis par les navigateurs des étudiants. 
                                            Chaque ping valide confirme une présence active d'apprentissage de 30 secondes sur le cours spécifié.
                                        </p>
                                        
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-gray-800">
                                                <span className="text-sm text-gray-400">Formation Leader :</span>
                                                <span className="text-sm font-bold text-white font-mono">{mostActiveCourse}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-gray-800">
                                                <span className="text-sm text-gray-400">Temps total enregistré :</span>
                                                <span className="text-sm font-bold text-white font-mono">{formatDuration(totalDurationSeconds)}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-gray-800">
                                                <span className="text-sm text-gray-400">Total de cours étudiés :</span>
                                                <span className="text-sm font-bold text-white font-mono">{data.coursePopularity.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-800 mt-6 text-xs text-gray-500 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Mise à jour en temps réel à chaque heartbeat.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Live Activity Stream */}
                        {activeTab === 'logs' && (
                            <div className="glass-card overflow-hidden border-purple-500/5">
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
                                    <table className="w-full">
                                        <thead className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Horodatage</th>
                                                <th className="px-6 py-4 text-left">Étudiant</th>
                                                <th className="px-6 py-4 text-left">Action</th>
                                                <th className="px-6 py-4 text-left">Contexte de la page</th>
                                                <th className="px-6 py-4 text-left">Appareil/OS</th>
                                                <th className="px-6 py-4 text-right">Adresse IP</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800 text-xs font-mono">
                                            {filteredLogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-sans">
                                                        Aucun log d'activité récent ne correspond aux filtres.
                                                    </td>
                                                </tr>
                                            ) : filteredLogs.map((log) => {
                                                const isActionHeartbeat = log.action === 'STUDENT_HEARTBEAT';
                                                return (
                                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                                                            {new Date(log.createdAt).toLocaleDateString('fr-FR')} {new Date(log.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                                        </td>
                                                        <td className="px-6 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-2 font-sans">
                                                                {log.user?.image ? (
                                                                    <img src={log.user.image} className="w-6 h-6 rounded-full" alt="" />
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-[#a78bfa] border border-[#a78bfa]/20 flex items-center justify-center font-bold text-[10px]">
                                                                        {log.user?.name?.[0]?.toUpperCase() || '?'}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="font-semibold text-white text-xs block">{log.user?.name}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 whitespace-nowrap">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                log.action === 'STUDENT_VIEW_LESSON' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' :
                                                                log.action === 'STUDENT_VIEW_PAGE' ? 'bg-orange-500/15 text-orange-300 border border-orange-500/20' :
                                                                'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                                                            }`}>
                                                                {log.action.replace('STUDENT_', '')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 max-w-xs truncate text-gray-300" title={log.details?.path}>
                                                            {log.details?.lessonTitle ? (
                                                                <span className="font-sans font-medium text-purple-200">
                                                                    📖 {log.details.lessonTitle} 
                                                                    <span className="text-[10px] text-gray-500 block">
                                                                        Cours: {log.details.courseSlug?.replace(/-/g, ' ')}
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">
                                                                    🌐 {log.details?.path || '/'}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                                                            {parseUA(log.userAgent)}
                                                        </td>
                                                        <td className="px-6 py-3 text-right text-gray-400 whitespace-nowrap">
                                                            {log.ipAddress || '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
