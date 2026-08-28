'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Award, TrendingUp, PlayCircle, ChevronRight, Code, Sparkles, Flame, Search, Bookmark, BarChart2, Workflow } from 'lucide-react';
import { useSession } from 'next-auth/react';
import TwitchStream from '@/components/TwitchStream';

export default function Dashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [debugLog, setDebugLog] = useState([]);

    useEffect(() => {
        fetchDashboardData();
        // Update streak on dashboard load
        fetch('/api/user/streak', { method: 'POST' })
            .then(r => r.json()).then(d => setStreak(d.streak)).catch(() => {});
    }, []);

    const fetchDashboardData = async () => {
        const logs = [];
        try {
            const [statsRes, enrollmentsRes, coursesRes] = await Promise.all([
                fetch('/api/user/stats', { cache: 'no-store' }),
                fetch('/api/user/enrollments', { cache: 'no-store' }),
                fetch('/api/public/courses', { cache: 'no-store' })
            ]);

            logs.push(`stats: ${statsRes.status}, enrollments: ${enrollmentsRes.status}, courses: ${coursesRes.status}`);

            const statsData = statsRes.ok ? await statsRes.json() : {};
            const enrollmentsData = enrollmentsRes.ok ? await enrollmentsRes.json() : { enrollments: [] };
            const coursesData = coursesRes.ok ? await coursesRes.json() : { courses: [] };

            logs.push(`enrollments: ${enrollmentsData.enrollments?.length || 0}, courses: ${coursesData.courses?.length || 0}`);

            setStats(statsData);
            setEnrollments((enrollmentsData.enrollments || []).filter(e => e.course));

            const enrolledIds = new Set(enrollmentsData.enrollments?.map(e => e.courseId) || []);
            const available = (coursesData.courses || []).filter(c => !enrolledIds.has(c.id));
            setAvailableCourses(available);
            logs.push(`available: ${available.length}, enrolled: ${enrolledIds.size}`);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            logs.push(`ERREUR: ${error.message}`);
        } finally {
            setDebugLog(logs);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const coursesToShow = availableCourses;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Bonjour, {session?.user?.name?.split(' ')[0] || 'Étudiant'} 👋</h1>
                    <p className="text-gray-400 mt-1">
                        {enrollments.length > 0
                            ? `${enrollments.length} formation${enrollments.length > 1 ? 's' : ''} en cours`
                            : 'Découvrez nos formations gratuites'
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Streak */}
                    {streak && streak.currentStreak > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <Flame size={16} className="text-orange-400" />
                            <div>
                                <p className="text-sm font-bold text-orange-300">{streak.currentStreak} jour{streak.currentStreak > 1 ? 's' : ''}</p>
                                <p className="text-[10px] text-orange-500/70">Streak actif</p>
                            </div>
                        </div>
                    )}
                    {/* XP + Level */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                        <div className="text-right">
                            <p className="text-sm font-bold text-violet-300">Niv. {session?.user?.level || 1}</p>
                            <p className="text-[10px] text-violet-500/70">{session?.user?.xp || 0} XP</p>
                        </div>
                    </div>
                    {/* Quick actions */}
                    <Link href="/dashboard/search" className="p-2 text-gray-500 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-xl transition-colors" title="Rechercher">
                        <Search size={17} />
                    </Link>
                    <button
                        onClick={() => { setRefreshing(true); fetchDashboardData(); }}
                        disabled={refreshing}
                        className="p-2 text-gray-500 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                        title="Actualiser"
                    >
                        <TrendingUp size={17} className={refreshing ? 'animate-pulse' : ''} />
                    </button>
                </div>
            </div>

            {/* Shortcut links */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Link href="/dashboard/certificates" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors">
                    <Award size={12} /> Mes attestations
                </Link>
                <Link href="/dashboard/search" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                    <Search size={12} /> Recherche
                </Link>
                <Link href="/dashboard/live" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-300 border border-green-500/20 hover:bg-green-500/20 transition-colors">
                    <BarChart2 size={12} /> Sessions live
                </Link>
                <Link href="/dashboard/code" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                    <Code size={12} /> IDE Python
                </Link>
                <a href="https://ormn-n8n-automation.hf.space" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                    <Workflow size={12} /> n8n Automation
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { icon: BookOpen, label: 'Cours suivis', value: stats?.coursesCount || enrollments.length || '0', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { icon: Clock, label: 'Heures', value: stats?.hoursSpent || '0h', color: 'text-green-400', bg: 'bg-green-400/10' },
                    { icon: Award, label: 'Attestations', value: stats?.certificates || '0', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { icon: TrendingUp, label: 'Progression moy.', value: `${stats?.averageProgress || '0'}%`, color: 'text-violet-400', bg: 'bg-violet-400/10' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 sm:p-6 flex items-center gap-3">
                        <div className={`p-2.5 sm:p-3 rounded-lg ${stat.bg} ${stat.color} shrink-0`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Twitch Live Stream */}
            <TwitchStream />

            {/* Current Enrollments */}
            {enrollments.length > 0 && (
                <>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PlayCircle className="text-[#a78bfa]" size={24} />
                        Continuer l'apprentissage
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="glass-card p-0 overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className={`w-full md:w-1/3 bg-gradient-to-br ${enrollment.course?.color || 'from-indigo-900 to-[#0a0e17]'} p-6 flex flex-col justify-center`}>
                                        <span className="text-xs font-bold text-white/70 uppercase mb-2">En cours</span>
                                        <h3 className="text-lg font-bold mb-2">{enrollment.course?.title || 'Formation'}</h3>
                                        <p className="text-white/70 text-sm">{enrollment.course?.level || 'Tous niveaux'}</p>
                                    </div>
                                    <div className="w-full md:w-2/3 p-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-semibold">Progression</span>
                                            <span className="text-sm text-gray-400">{enrollment.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-700 rounded-full mb-4">
                                            <div 
                                                className="h-full bg-[#a78bfa] rounded-full transition-all" 
                                                style={{ width: `${enrollment.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <Link 
                                            href={`/dashboard/courses/${enrollment.course?.slug || ''}`}
                                            className="btn btn-primary text-center w-full"
                                        >
                                            Reprendre le cours
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Available Courses */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={24} />
                {enrollments.length === 0 ? 'Commencez votre apprentissage' : 'Formations disponibles'}
            </h2>
            
            {coursesToShow.length === 0 && enrollments.length > 0 ? (
                <div className="glass-card p-8 text-center">
                    <p className="text-gray-400">Vous suivez toutes nos formations disponibles !</p>
                </div>
            ) : coursesToShow.length === 0 && enrollments.length === 0 ? (
                <div className="glass-card p-8 text-center">
                    <p className="text-gray-300 text-lg mb-2">Bienvenue sur El Sayf !</p>
                    <p className="text-gray-400 mb-4">Explorez notre catalogue de formations pour commencer votre apprentissage.</p>
                    <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors">
                        Voir les formations <ChevronRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coursesToShow.map((course) => (
                        <div key={course.id} className="glass-card p-6 hover:bg-white/5 transition-all group">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color || 'from-purple-600 to-blue-600'} flex items-center justify-center mb-4 overflow-hidden`}>
                                {course.image ? (
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Code className="text-white" size={24} />
                                )}
                            </div>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-[#a78bfa] transition-colors">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description || course.desc}</p>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                <span>{course.level}</span>
                                <span>&bull;</span>
                                <span>{course.duration}</span>
                                {course.lessonsCount > 0 && (
                                    <>
                                        <span>&bull;</span>
                                        <span>{course.lessonsCount} leçons</span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                {course.isFree ? (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Gratuit</span>
                                ) : (
                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{course.price ? `${(course.price / 100).toFixed(0)} DA` : 'Premium'}</span>
                                )}
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="flex items-center gap-1 text-[#a78bfa] hover:text-white text-sm font-medium transition-colors"
                                >
                                    Découvrir <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {coursesToShow.length > 6 && (
                <div className="mt-6 text-center">
                    <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-700 hover:border-purple-500 rounded-lg text-sm font-medium transition-colors">
                        Voir toutes les formations <ChevronRight size={16} />
                    </Link>
                </div>
            )}

        </div>
    );
}
