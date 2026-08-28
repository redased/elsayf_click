'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    Code, TrendingUp, TrendingDown, Users, Monitor, MapPin, 
    GraduationCap, Target, Clock, Calendar, Download, RefreshCw,
    ChevronLeft, ChevronRight, BarChart3, PieChart, Activity,
    BookOpen, Lightbulb, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function PythonStatsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState('30days');

    useEffect(() => {
        if (status === 'authenticated') {
            if (session?.user?.role !== 'SUPER_ADMIN') {
                router.push('/');
            } else {
                fetchStats();
            }
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session, period]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/super-admin/python-stats?period=${period}`);
            const data = await res.json();
            
            if (data.summary) {
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportData = () => {
        if (!stats) return;
        
        const dataStr = JSON.stringify(stats, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `python-stats-${period}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const moduleNames = {
        excel: '📊 Excel',
        word: '📝 Word',
        powerpoint: '📽️ PowerPoint',
        email: '📧 Email Marketing',
        automatisation: '🤖 Automatisation',
        data_analysis: '📈 Analyse de données',
        web_scraping: '🌐 Web Scraping',
        dashboards: '📊 Tableaux de bord',
        api: '🔗 API & Intégration',
        database: '🗄️ Bases de données',
        ai_ml: '🧠 IA & Machine Learning',
        reporting: '📄 Rapports auto'
    };

    const educationLabels = {
        OBAC: 'OBAC / Primaire',
        CEM: 'CEM / Collège',
        LYCEE: 'Lycée',
        UNIVERSITAIRE: 'Universitaire',
        PROFESSIONNEL: 'Professionnel',
        AUTRE: 'Autre'
    };

    const projectTypeLabels = {
        personnel: 'Projet personnel',
        professionnel: 'Projet professionnel',
        academique: 'Projet académique',
        entreprise: 'Projet entreprise',
        startup: 'Startup / Business',
        autre: 'Autre'
    };

    const scheduleLabels = {
        weekday_morning: 'Semaine - Matin',
        weekday_afternoon: 'Semaine - Après-midi',
        weekday_evening: 'Semaine - Soir',
        weekend: 'Week-end',
        flexible: 'Flexible'
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="text-center">
                    <Code size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée aux Super Admins.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-900">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600 rounded-xl">
                            <BarChart3 size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Statistiques Python</h1>
                            <p className="text-gray-400 mt-1">Analytics avancées des inscriptions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                            <option value="7days">7 derniers jours</option>
                            <option value="30days">30 derniers jours</option>
                            <option value="90days">90 derniers jours</option>
                            <option value="all">Tout l'historique</option>
                        </select>
                        <button
                            onClick={exportData}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Download size={18} /> Exporter
                        </button>
                        <button
                            onClick={fetchStats}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <Link
                            href="/admin/python-registrations"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                            Voir les inscriptions
                        </Link>
                    </div>
                </div>

                {stats && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg">
                                        <Users size={24} className="text-blue-500" />
                                    </div>
                                    {stats.summary.growthRate >= 0 ? (
                                        <span className="text-green-400 flex items-center text-sm">
                                            <TrendingUp size={16} className="mr-1" /> +{stats.summary.growthRate}%
                                        </span>
                                    ) : (
                                        <span className="text-red-400 flex items-center text-sm">
                                            <TrendingDown size={16} className="mr-1" /> {stats.summary.growthRate}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm">Total inscriptions</p>
                                <p className="text-3xl font-bold text-white">{stats.summary.total}</p>
                            </div>

                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-500/20 rounded-lg">
                                        <Activity size={24} className="text-green-500" />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">Cette semaine</p>
                                <p className="text-3xl font-bold text-white">{stats.summary.recent7Days}</p>
                            </div>

                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                                        <Target size={24} className="text-yellow-500" />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">Taux de conversion</p>
                                <p className="text-3xl font-bold text-white">{stats.summary.conversionRate}%</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.summary.conversionApproved} approuvés / {stats.summary.total} total
                                </p>
                            </div>

                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-500/20 rounded-lg">
                                        <Clock size={24} className="text-purple-500" />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">En attente</p>
                                <p className="text-3xl font-bold text-white">{stats.summary.conversionPending}</p>
                            </div>
                        </div>

                        {/* Mode Distribution & Status */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Mode de formation */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Monitor size={20} className="text-blue-500" />
                                    Répartition par mode de formation
                                </h3>
                                <div className="space-y-4">
                                    {stats.distributions.byMode.map((mode) => {
                                        const percentage = stats.summary.total > 0 
                                            ? (mode._count / stats.summary.total * 100).toFixed(1) 
                                            : 0;
                                        const isOnline = mode.learningMode === 'online';
                                        return (
                                            <div key={mode.learningMode}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-300">
                                                        {isOnline ? '🖥️ En ligne' : '🏫 Présentiel'}
                                                    </span>
                                                    <span className="font-bold">{mode._count} ({percentage}%)</span>
                                                </div>
                                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all ${isOnline ? 'bg-blue-500' : 'bg-green-500'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Statut */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <PieChart size={20} className="text-yellow-500" />
                                    Répartition par statut
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {stats.distributions.byStatus.map((s) => {
                                        const colors = {
                                            PENDING: 'bg-yellow-500',
                                            CONTACTED: 'bg-blue-500',
                                            APPROVED: 'bg-green-500',
                                            REJECTED: 'bg-red-500'
                                        };
                                        const labels = {
                                            PENDING: 'En attente',
                                            CONTACTED: 'Contacté',
                                            APPROVED: 'Approuvé',
                                            REJECTED: 'Refusé'
                                        };
                                        const percentage = stats.summary.total > 0 
                                            ? (s._count / stats.summary.total * 100).toFixed(1) 
                                            : 0;
                                        return (
                                            <div key={s.status} className="bg-gray-700/50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-3 h-3 rounded-full ${colors[s.status]}`}></div>
                                                    <span className="text-sm text-gray-400">{labels[s.status]}</span>
                                                </div>
                                                <p className="text-2xl font-bold">{s._count}</p>
                                                <p className="text-xs text-gray-500">{percentage}%</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Education & Project Type */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Niveau d'éducation */}
                            {stats.distributions.byEducation.length > 0 && (
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <GraduationCap size={20} className="text-purple-500" />
                                        Niveau d'études
                                    </h3>
                                    <div className="space-y-3">
                                        {stats.distributions.byEducation
                                            .sort((a, b) => b._count - a._count)
                                            .map((edu) => (
                                                <div key={edu.educationLevel} className="flex items-center justify-between">
                                                    <span className="text-gray-300 text-sm">
                                                        {educationLabels[edu.educationLevel] || edu.educationLevel}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 bg-purple-500 rounded-full" 
                                                            style={{ width: `${Math.min(edu._count * 10, 100)}px` }}
                                                        />
                                                        <span className="font-bold text-sm">{edu._count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Type de projet */}
                            {stats.distributions.byProjectType.length > 0 && (
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Target size={20} className="text-green-500" />
                                        Type de projet
                                    </h3>
                                    <div className="space-y-3">
                                        {stats.distributions.byProjectType
                                            .sort((a, b) => b._count - a._count)
                                            .map((proj) => (
                                                <div key={proj.projectType} className="flex items-center justify-between">
                                                    <span className="text-gray-300 text-sm">
                                                        {projectTypeLabels[proj.projectType] || proj.projectType}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 bg-green-500 rounded-full" 
                                                            style={{ width: `${Math.min(proj._count * 10, 100)}px` }}
                                                        />
                                                        <span className="font-bold text-sm">{proj._count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Top Modules */}
                        {stats.topModules.length > 0 && (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Lightbulb size={20} className="text-yellow-500" />
                                    Top modules demandés
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {stats.topModules.map((mod, index) => (
                                        <div key={mod.module} className="bg-gray-700/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl mb-2">{index + 1}</div>
                                            <div className="text-sm text-gray-300 mb-1">
                                                {moduleNames[mod.module] || mod.module}
                                            </div>
                                            <div className="text-xl font-bold text-yellow-500">{mod.count}</div>
                                            <div className="text-xs text-gray-500">
                                                {stats.summary.total > 0 
                                                    ? (mod.count / stats.summary.total * 100).toFixed(0) 
                                                    : 0}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Horaires préférés */}
                        {stats.distributions.bySchedule.length > 0 && (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-pink-500" />
                                    Horaires préférés
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {stats.distributions.bySchedule
                                        .sort((a, b) => b._count - a._count)
                                        .map((sched) => (
                                            <div key={sched.preferredSchedule} className="bg-gray-700/50 rounded-lg px-4 py-2">
                                                <span className="text-sm text-gray-300">
                                                    {scheduleLabels[sched.preferredSchedule] || sched.preferredSchedule}
                                                </span>
                                                <span className="ml-2 font-bold">{sched._count}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Évolution temporelle */}
                        {stats.dailyEvolution.length > 0 && (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-500" />
                                    Évolution des inscriptions
                                </h3>
                                <div className="h-64 flex items-end gap-2 overflow-x-auto">
                                    {stats.dailyEvolution.slice(-30).map((day, index) => {
                                        const maxCount = Math.max(...stats.dailyEvolution.map(d => d.count));
                                        const height = maxCount > 0 ? (day.count / maxCount * 100) : 0;
                                        return (
                                            <div key={index} className="flex-1 min-w-[30px] flex flex-col items-center">
                                                <div className="text-xs text-gray-500 mb-1">{day.count}</div>
                                                <div 
                                                    className="w-full bg-blue-500 rounded-t"
                                                    style={{ height: `${Math.max(height, 5)}%` }}
                                                    title={`${day.date}: ${day.count} inscriptions`}
                                                />
                                                <div className="text-xs text-gray-600 mt-1 rotate-45 origin-left">
                                                    {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Sources de parrainage */}
                        {stats.distributions.byAffiliate.length > 0 && (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <h3 className="text-lg font-bold mb-4">Top sources de parrainage</h3>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                                            <th className="pb-3">Code</th>
                                            <th className="pb-3">Inscriptions</th>
                                            <th className="pb-3">%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.distributions.byAffiliate.slice(0, 10).map((aff) => {
                                            const percentage = stats.summary.total > 0 
                                                ? (aff._count / stats.summary.total * 100).toFixed(1) 
                                                : 0;
                                            return (
                                                <tr key={aff.affiliateCode} className="border-b border-gray-700/50">
                                                    <td className="py-3 font-mono text-sm">{aff.affiliateCode}</td>
                                                    <td className="py-3">{aff._count}</td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 bg-purple-500 rounded-full" 
                                                                style={{ width: `${percentage * 3}px` }}
                                                            />
                                                            {percentage}%
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Last Updated */}
                        <div className="mt-8 text-center text-gray-500 text-sm">
                            Dernière mise à jour: {new Date(stats.lastUpdated).toLocaleString('fr-FR')}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
