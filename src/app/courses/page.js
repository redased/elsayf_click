'use client';
import { motion } from 'framer-motion';
import { Terminal, Database, TrendingUp, BookOpen, Clock, Users, Eye, EyeOff, ChevronUp, ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Courses() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminMode, setAdminMode] = useState(false);

    const isAdmin = session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'ADMIN';

    useEffect(() => {
        fetchCourses();
    }, [adminMode]);

    const fetchCourses = () => {
        // En mode admin, récupérer TOUS les cours (y compris non publiés)
        const endpoint = adminMode ? '/api/admin/courses' : '/api/public/courses';

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setCourses(data.courses || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch courses", err);
                setLoading(false);
            });
    };

    const handleDelete = async (courseId) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert("Cours supprimé avec succès");
                setCourses(prev => prev.filter(c => c.id !== courseId));
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur système");
        }
    };

    const togglePublished = async (courseId, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !currentStatus })
            });

            if (res.ok) {
                fetchCourses();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const moveUp = async (index) => {
        if (index === 0) return;
        const newCourses = [...courses];
        [newCourses[index - 1], newCourses[index]] = [newCourses[index], newCourses[index - 1]];
        await updateOrders(newCourses);
    };

    const moveDown = async (index) => {
        if (index === courses.length - 1) return;
        const newCourses = [...courses];
        [newCourses[index], newCourses[index + 1]] = [newCourses[index + 1], newCourses[index]];
        await updateOrders(newCourses);
    };

    const updateOrders = async (newCourses) => {
        setCourses(newCourses);

        try {
            await fetch('/api/admin/courses/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orders: newCourses.map((c, idx) => ({ id: c.id, order: idx }))
                })
            });
        } catch (error) {
            console.error(error);
            fetchCourses();
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-400">Chargement des cours...</p>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="text-center">
                    <BookOpen size={64} className="mx-auto text-gray-600 mb-4" />
                    <h1 className="text-3xl font-bold mb-4">Aucun cours disponible</h1>
                    <p className="text-gray-400 mb-8">Les cours seront bientôt disponibles. Revenez plus tard !</p>
                    <Link href="/" className="btn btn-primary">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Nos Formations
                        </h1>
                        {status === 'authenticated' && isAdmin && (
                            <button
                                onClick={() => setAdminMode(!adminMode)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                    adminMode
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                                title={adminMode ? 'Quitter le mode gestion' : 'Activer le mode gestion'}
                            >
                                <Settings size={16} />
                                {adminMode ? 'Mode Gestion' : 'Gérer'}
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-xl text-gray-400">
                    {courses.length} cours {adminMode ? 'au total' : 'disponible'}{courses.length > 1 ? 's' : ''}
                </p>
                {adminMode && (
                    <p className="text-sm text-yellow-500 mt-2">
                        ⚠️ Mode gestion activé - Vous pouvez réorganiser et publier/masquer les formations
                    </p>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group"
                    >
                        <div className={`bg-gradient-to-br ${course.color || 'from-gray-600 to-gray-800'} rounded-3xl p-1 h-full ${!course.isPublished && adminMode ? 'opacity-60' : ''}`}>
                            <div className="bg-[#0a0f1e] rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
                                {/* Background gradient effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${course.color || 'from-gray-600 to-gray-800'} opacity-5 group-hover:opacity-10 transition-opacity`} />

                                {/* Contrôles admin en haut à gauche */}
                                {adminMode && (
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                                        <button
                                            onClick={() => moveUp(i)}
                                            disabled={i === 0}
                                            className="p-1.5 bg-gray-900 rounded hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-gray-700"
                                            title="Monter"
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                        <div className="text-xs text-gray-500 text-center font-mono bg-gray-900 rounded px-1">
                                            #{i + 1}
                                        </div>
                                        <button
                                            onClick={() => moveDown(i)}
                                            disabled={i === courses.length - 1}
                                            className="p-1.5 bg-gray-900 rounded hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-gray-700"
                                            title="Descendre"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Badge statut publication en haut à droite */}
                                {adminMode && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={() => togglePublished(course.id, course.isPublished)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                                                course.isPublished
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                            }`}
                                            title={course.isPublished ? 'Masquer' : 'Publier'}
                                        >
                                            {course.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                                            <span>{course.isPublished ? 'Visible' : 'Masqué'}</span>
                                        </button>
                                    </div>
                                )}

                                {/* Icon / Image */}
                                <div className={`relative bg-gradient-to-br ${course.color || 'from-gray-600 to-gray-800'} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden ${adminMode ? 'mt-16' : ''}`}>
                                    {course.image ? (
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Terminal size={32} className="text-white" />
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold mb-2 relative">
                                    {course.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 mb-4 text-sm flex-grow relative">
                                    {course.description || 'Formation complète pour maîtriser ce sujet'}
                                </p>

                                {/* Meta info */}
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500 font-mono mb-4 relative">
                                    {course.level && (
                                        <span className="bg-white/5 px-2 py-1 rounded">
                                            {course.level}
                                        </span>
                                    )}
                                    {course.duration && (
                                        <span className="bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                                            <Clock size={12} />
                                            {course.duration}
                                        </span>
                                    )}
                                    <span className="bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                                        <BookOpen size={12} />
                                        {course.lessonsCount || 0} leçon{course.lessonsCount > 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="mb-4 relative">
                                    {course.isFree || course.price === 0 ? (
                                        <span className="inline-block bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm font-bold">
                                            Gratuit
                                        </span>
                                    ) : (
                                        <span className="inline-block bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full text-sm font-bold">
                                            {course.price} DA
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3 relative">
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        className="btn btn-outline w-full text-center block"
                                    >
                                        Voir le programme
                                    </Link>

                                    {isAdmin && adminMode && (
                                        <Link
                                            href={`/admin/courses/${course.id}`}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium text-center flex items-center justify-center gap-2"
                                        >
                                            <Database size={14} /> Éditer le contenu
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
