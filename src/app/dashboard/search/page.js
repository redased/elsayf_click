'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, BookOpen, GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const debounce = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        clearTimeout(debounce.current);
        if (query.length < 2) { setResults([]); setSearched(false); return; }
        setLoading(true);
        debounce.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
                setSearched(true);
            } catch {}
            setLoading(false);
        }, 400);
    }, [query]);

    const courses = results.filter(r => r.type === 'course');
    const lessons = results.filter(r => r.type === 'lesson');

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-6">
                    <ArrowLeft size={13} /> Tableau de bord
                </Link>

                {/* Search bar */}
                <div className="relative mb-8">
                    <div className="flex items-center gap-3 bg-[#0d1117] border border-gray-700 focus-within:border-violet-500 rounded-2xl px-4 py-3.5 transition-colors">
                        {loading ? <Loader2 size={20} className="text-gray-500 animate-spin shrink-0" /> : <Search size={20} className="text-gray-500 shrink-0" />}
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Rechercher une formation, une leçon, un concept..."
                            className="flex-1 bg-transparent text-white text-base focus:outline-none placeholder-gray-600"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="text-gray-600 hover:text-gray-400 text-xs shrink-0">✕</button>
                        )}
                    </div>
                </div>

                {/* Results */}
                {!searched && !loading && (
                    <div className="text-center py-16">
                        <div className="w-14 h-14 rounded-2xl bg-gray-800/60 flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-sm">Tape au moins 2 caractères pour commencer la recherche</p>
                    </div>
                )}

                {searched && results.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <p className="text-gray-400 font-semibold mb-1">Aucun résultat pour "{query}"</p>
                        <p className="text-gray-600 text-sm">Essaie un autre terme ou parcours les formations directement.</p>
                    </div>
                )}

                {/* Courses */}
                {courses.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                            <GraduationCap size={13} /> Formations
                        </h2>
                        <div className="space-y-2">
                            {courses.map(c => (
                                <Link key={c.id} href={c.url}
                                    className="flex items-center gap-4 bg-[#0d1117] border border-gray-800 hover:border-violet-500/40 rounded-2xl p-4 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 flex items-center justify-center shrink-0">
                                        <GraduationCap size={18} className="text-violet-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-white group-hover:text-violet-400 transition-colors">{c.title}</p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full shrink-0">{c.level}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lessons */}
                {lessons.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                            <BookOpen size={13} /> Leçons
                        </h2>
                        <div className="space-y-2">
                            {lessons.map(l => (
                                <Link key={l.id} href={l.url}
                                    className="flex items-center gap-4 bg-[#0d1117] border border-gray-800 hover:border-indigo-500/40 rounded-2xl p-4 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                        <BookOpen size={16} className="text-indigo-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors">{l.title}</p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{l.courseTitle}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
