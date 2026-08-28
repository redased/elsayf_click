'use client';
import { useState, useEffect } from 'react';
import { BookOpenIcon, LinkIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MarketingCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/courses')
            .then(res => res.json())
            .then(data => {
                setCourses(data.courses || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen pt-24 px-8 text-white">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-teal-500" />
                Catalogue Formations
            </h1>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden flex flex-col hover:border-teal-500/50 transition-all group">
                        <div className="h-40 bg-gray-800 relative">
                            {course.image && (
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded ${course.isPublished ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
                                    {course.isPublished ? 'PUBLIÉ' : 'BROUILLON'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-700">
                                <Link
                                    href={`/courses/${course.slug}`}
                                    target="_blank"
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                                >
                                    <EyeIcon className="w-4 h-4" /> Voir
                                </Link>
                                <Link
                                    href={`/admin/affiliates?course=${course.id}`} // Pre-fill logic could be added to affiliate page later
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-teal-600 hover:bg-teal-500 rounded text-sm font-bold transition"
                                >
                                    <LinkIcon className="w-4 h-4" /> Promouvoir
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
