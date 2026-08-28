'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Eye, Plus, Trash, GripVertical, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        fetch('/api/admin/courses')
            .then(res => res.json())
            .then(data => {
                // Trier par order
                const sorted = (data.courses || []).sort((a, b) => (a.order || 0) - (b.order || 0));
                setCourses(sorted);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleCreateCourse = async () => {
        try {
            const res = await fetch('/api/admin/courses', {
                method: 'POST',
            });
            const data = await res.json();

            if (res.ok && data.course) {
                router.push(`/admin/courses/${data.course.id}`);
            } else {
                alert("Erreur lors de la création de la formation");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la création");
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
            } else {
                alert("Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour");
        }
    };

    const moveUp = async (index) => {
        if (index === 0) return;
        const newCourses = [...courses];
        [newCourses[index - 1], newCourses[index]] = [newCourses[index], newCourses[index - 1]];

        // Mettre à jour les orders dans la DB
        await updateOrders(newCourses);
    };

    const moveDown = async (index) => {
        if (index === courses.length - 1) return;
        const newCourses = [...courses];
        [newCourses[index], newCourses[index + 1]] = [newCourses[index + 1], newCourses[index]];

        // Mettre à jour les orders dans la DB
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
            alert("Erreur lors de la réorganisation");
            fetchCourses(); // Recharger en cas d'erreur
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 container mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Formations</h1>
                <button
                    onClick={handleCreateCourse}
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Créer une formation
                </button>
            </div>

            <div className="grid gap-4">
                {courses.map((course, index) => (
                    <div key={course.id} className="glass-card p-6 flex items-center gap-4 border border-gray-700">
                        {/* Contrôles d'ordre */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => moveUp(index)}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Monter"
                            >
                                <ChevronUp size={18} />
                            </button>
                            <div className="text-xs text-gray-500 text-center font-mono">#{index + 1}</div>
                            <button
                                onClick={() => moveDown(index)}
                                disabled={index === courses.length - 1}
                                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Descendre"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        {/* Infos du cours */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{course.slug}</p>
                            <div className="flex gap-2 flex-wrap">
                                <span className={`inline-block px-2 py-0.5 text-xs rounded ${course.isPublished ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {course.isPublished ? '✓ Publié' : '○ Brouillon'}
                                </span>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded ${course.isFree ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                                    {course.isFree ? 'Gratuit' : `${course.price} DA`}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Toggle visibilité */}
                            <button
                                onClick={() => togglePublished(course.id, course.isPublished)}
                                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                                    course.isPublished
                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                                title={course.isPublished ? 'Masquer' : 'Publier'}
                            >
                                {course.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                                <span className="hidden sm:inline">{course.isPublished ? 'Visible' : 'Masqué'}</span>
                            </button>

                            {/* Voir */}
                            <Link href={`/courses/${course.slug}`} target="_blank" className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white" title="Voir la page publique">
                                <Eye size={20} />
                            </Link>

                            {/* Éditer */}
                            <Link href={`/admin/courses/${course.id}`} className="p-2 hover:bg-indigo-600/20 rounded text-indigo-400 hover:text-indigo-300" title="Éditer">
                                <Edit size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
