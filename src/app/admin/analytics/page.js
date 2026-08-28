'use client';
import { useState, useEffect } from 'react';
import { BarChart2, Users, BookOpen, Award, Clock, ArrowLeft, Loader2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetch('/api/admin/analytics/students').then(r => r.json()).then(d => { setData(d); setLoading(false); }); }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-gray-500">
            <Loader2 size={24} className="animate-spin mr-3" /> Chargement des analytics...
        </div>
    );

    const { overview, recentActivity, courseStats } = data || {};

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white p-6">
            <div className="max-w-5xl mx-auto">
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition-colors">
                    <ArrowLeft size={13} /> Admin
                </Link>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                        <BarChart2 size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Analytics Étudiants</h1>
                        <p className="text-sm text-gray-500">Progression et activité de la plateforme</p>
                    </div>
                </div>

                {/* Overview cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Étudiants', value: overview?.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Inscriptions', value: overview?.totalEnrollments, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                        { label: 'Complétions', value: overview?.totalCompletions, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5">
                            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                                <Icon size={17} className={color} />
                            </div>
                            <p className="text-2xl font-bold text-white">{value ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Course stats */}
                    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5">
                        <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <TrendingUp size={15} className="text-violet-400" /> Performance par cours
                        </h2>
                        <div className="space-y-4">
                            {(courseStats || []).map(c => (
                                <div key={c.id}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-sm text-gray-300 truncate flex-1 mr-3">{c.title}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
                                            <span><span className="text-white font-semibold">{c.totalEnrolled}</span> inscrits</span>
                                            <span><span className="text-emerald-400 font-semibold">{c.avgProgress}%</span></span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
                                            style={{ width: `${c.avgProgress}%` }} />
                                    </div>
                                </div>
                            ))}
                            {!courseStats?.length && <p className="text-sm text-gray-600 text-center py-4">Aucune donnée</p>}
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5">
                        <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                            <Clock size={15} className="text-blue-400" /> Activité récente (7j)
                        </h2>
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {(recentActivity || []).map((a, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {a.userName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-300 truncate">
                                            <span className="text-white font-semibold">{a.userName}</span> a complété
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{a.lessonTitle} · {a.courseTitle}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-600 shrink-0">
                                        {a.completedAt ? new Date(a.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                    </span>
                                </div>
                            ))}
                            {!recentActivity?.length && <p className="text-sm text-gray-600 text-center py-4">Aucune activité récente</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
