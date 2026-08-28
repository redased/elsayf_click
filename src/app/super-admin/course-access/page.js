'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import {
    Crown, BookOpen, Lock, Unlock, Eye, EyeOff,
    ChevronUp, ChevronDown, DollarSign, Globe, Users, CheckCircle,
    Save, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function CourseAccessManagement() {
    const { data: session, status } = useSession();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState('');

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') fetchCourses();
    }, [session]);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/admin/courses');
            const data = await res.json();
            const sorted = (data.courses || []).sort((a, b) => (a.order || 0) - (b.order || 0));
            setCourses(sorted);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async (courseId) => {
        try {
            const res = await fetch(`/api/super-admin/lessons/${courseId}/access?courseId=${courseId}`);
            const data = await res.json();
            if (data.success) setLessons(data.lessons);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelect = async (course) => {
        setSelectedCourse(course);
        setLessons([]);
        await fetchLessons(course.id);
    };

    // ── Visibilité ───────────────────────────────────────────────────────────
    const togglePublished = async (courseId, current) => {
        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !current })
            });
            if (res.ok) {
                await fetchCourses();
                if (selectedCourse?.id === courseId) {
                    setSelectedCourse(prev => ({ ...prev, isPublished: !current }));
                }
                showSaved('Visibilité mise à jour');
            }
        } catch (e) { console.error(e); }
    };

    // ── Ordre ────────────────────────────────────────────────────────────────
    const moveUp = async (index) => {
        if (index === 0) return;
        const updated = [...courses];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        await saveOrder(updated);
    };

    const moveDown = async (index) => {
        if (index === courses.length - 1) return;
        const updated = [...courses];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        await saveOrder(updated);
    };

    const saveOrder = async (ordered) => {
        setCourses(ordered);
        try {
            await fetch('/api/admin/courses/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders: ordered.map((c, i) => ({ id: c.id, order: i })) })
            });
            showSaved('Ordre sauvegardé');
        } catch (e) { console.error(e); }
    };

    // ── Pricing cours ────────────────────────────────────────────────────────
    const savePricing = async () => {
        if (!selectedCourse) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/super-admin/courses/${selectedCourse.id}/pricing`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isFree: selectedCourse.isFree,
                    price: selectedCourse.price,
                    priceDZ: selectedCourse.priceDZ,
                    priceEU: selectedCourse.priceEU,
                    accessType: selectedCourse.accessType
                })
            });
            if (res.ok) {
                await fetchCourses();
                showSaved('Prix sauvegardé ✓');
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    // ── Accès leçon ──────────────────────────────────────────────────────────
    const updateLessonAccess = async (lessonId, accessType) => {
        try {
            await fetch(`/api/super-admin/lessons/${lessonId}/access`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessType, isFree: accessType === 'FREE' })
            });
            if (selectedCourse) await fetchLessons(selectedCourse.id);
            showSaved('Leçon mise à jour');
        } catch (e) { console.error(e); }
    };

    const showSaved = (msg) => {
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(''), 2500);
    };

    if (status === 'loading') return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!session || session.user.role !== 'SUPER_ADMIN') return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
            <div className="glass-card p-12 text-center border-red-500/30">
                <Crown size={64} className="mx-auto text-red-500 mb-6" />
                <h1 className="text-3xl font-bold mb-2">Accès Refusé</h1>
                <p className="text-gray-400">Réservé au Super Admin.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                            Gestion des Formations
                        </h1>
                        <p className="text-gray-400 mt-1 text-sm">Ordre · Visibilité · Accès payant/gratuit · Leçons</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {savedMsg && (
                            <span className="flex items-center gap-1.5 text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
                                <CheckCircle size={14} /> {savedMsg}
                            </span>
                        )}
                        <Link href="/super-admin" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-all border border-gray-700">
                            ← Retour
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">

                    {/* ── Colonne gauche : liste des cours ── */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-4 sticky top-24">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                                Formations ({courses.length})
                            </h2>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Chargement...</div>
                            ) : (
                                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                                    {courses.map((course, idx) => (
                                        <div
                                            key={course.id}
                                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                                                selectedCourse?.id === course.id
                                                    ? 'bg-purple-500/15 border-purple-500/50'
                                                    : 'bg-white/5 border-transparent hover:bg-white/8 hover:border-gray-700'
                                            } ${!course.isPublished ? 'opacity-60' : ''}`}
                                            onClick={() => handleSelect(course)}
                                        >
                                            {/* Flèches ordre */}
                                            <div className="flex flex-col gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => moveUp(idx)}
                                                    disabled={idx === 0}
                                                    className="p-0.5 rounded hover:bg-gray-700 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronUp size={14} />
                                                </button>
                                                <span className="text-[10px] text-gray-600 text-center font-mono leading-none">
                                                    {idx + 1}
                                                </span>
                                                <button
                                                    onClick={() => moveDown(idx)}
                                                    disabled={idx === courses.length - 1}
                                                    className="p-0.5 rounded hover:bg-gray-700 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronDown size={14} />
                                                </button>
                                            </div>

                                            {/* Infos cours */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{course.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {course.isFree ? (
                                                        <span className="text-[10px] bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded font-mono">
                                                            Gratuit
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded font-mono">
                                                            {course.price} DA
                                                        </span>
                                                    )}
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                                        course.isPublished
                                                            ? 'bg-blue-500/15 text-blue-400'
                                                            : 'bg-gray-700 text-gray-500'
                                                    }`}>
                                                        {course.isPublished ? 'Visible' : 'Masqué'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Toggle visibilité */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); togglePublished(course.id, course.isPublished); }}
                                                className={`shrink-0 p-1.5 rounded-lg transition-all ${
                                                    course.isPublished
                                                        ? 'text-blue-400 hover:bg-blue-500/20'
                                                        : 'text-gray-600 hover:bg-gray-700 hover:text-white'
                                                }`}
                                                title={course.isPublished ? 'Masquer' : 'Publier'}
                                            >
                                                {course.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Colonne droite : détails ── */}
                    <div className="lg:col-span-3">
                        {!selectedCourse ? (
                            <div className="glass-card p-16 text-center">
                                <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                                <p className="text-gray-400">Sélectionnez une formation à gauche</p>
                                <p className="text-gray-600 text-sm mt-1">pour gérer ses accès et son prix</p>
                            </div>
                        ) : (
                            <div className="space-y-5">

                                {/* Titre + actions rapides */}
                                <div className="glass-card p-5">
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div>
                                            <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                                            <p className="text-gray-500 text-sm mt-0.5">{selectedCourse.slug}</p>
                                        </div>
                                        {/* Toggle visibilité grande version */}
                                        <button
                                            onClick={() => togglePublished(selectedCourse.id, selectedCourse.isPublished)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${
                                                selectedCourse.isPublished
                                                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25'
                                                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                                            }`}
                                        >
                                            {selectedCourse.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                                            {selectedCourse.isPublished ? 'Visible sur le site' : 'Masqué du site'}
                                        </button>
                                    </div>

                                    {/* Type d'accès */}
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        {[
                                            { value: 'FREE', label: '100% Gratuit', icon: <Unlock size={18} />, color: 'green' },
                                            { value: 'FREE_WITH_ADS', label: 'Gratuit + Ads', icon: <Globe size={18} />, color: 'blue' },
                                            { value: 'PAID', label: 'Payant', icon: <Lock size={18} />, color: 'yellow' },
                                        ].map(opt => {
                                            const current = selectedCourse.isFree
                                                ? (selectedCourse.isFreeWithAds ? 'FREE_WITH_ADS' : 'FREE')
                                                : 'PAID';
                                            const isActive = current === opt.value;
                                            const colors = {
                                                green: isActive ? 'bg-green-500/15 border-green-500/50 text-green-400' : 'bg-white/5 border-gray-700 text-gray-500 hover:bg-white/10',
                                                blue: isActive ? 'bg-blue-500/15 border-blue-500/50 text-blue-400' : 'bg-white/5 border-gray-700 text-gray-500 hover:bg-white/10',
                                                yellow: isActive ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-gray-700 text-gray-500 hover:bg-white/10',
                                            };
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSelectedCourse({
                                                        ...selectedCourse,
                                                        isFree: opt.value !== 'PAID',
                                                        isFreeWithAds: opt.value === 'FREE_WITH_ADS',
                                                        accessType: opt.value
                                                    })}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border font-semibold text-sm transition-all ${colors[opt.color]}`}
                                                >
                                                    {opt.icon}
                                                    <span className="text-xs text-center leading-tight">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Prix */}
                                    {!selectedCourse.isFree && (
                                        <div className="grid grid-cols-3 gap-3 mb-5">
                                            {[
                                                { key: 'price', label: 'Prix DA', placeholder: '1500' },
                                                { key: 'priceDZ', label: 'Prix DZD', placeholder: '1500' },
                                                { key: 'priceEU', label: 'Prix EUR', placeholder: '9.99' },
                                            ].map(field => (
                                                <div key={field.key}>
                                                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">{field.label}</label>
                                                    <div className="relative">
                                                        <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={selectedCourse[field.key] || 0}
                                                            onChange={e => setSelectedCourse({ ...selectedCourse, [field.key]: parseFloat(e.target.value) })}
                                                            className="w-full pl-8 pr-3 py-2 bg-white/5 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={savePricing}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                                    >
                                        {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                                        Sauvegarder le prix
                                    </button>
                                </div>

                                {/* Leçons */}
                                <div className="glass-card p-5">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <BookOpen size={18} className="text-purple-400" />
                                        Accès par leçon
                                        <span className="text-xs text-gray-500 font-normal ml-1">({lessons.length} leçons)</span>
                                    </h3>

                                    {lessons.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8 text-sm">Aucune leçon trouvée</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {/* Ligne d'en-tête */}
                                            <div className="grid grid-cols-12 gap-3 px-3 pb-1 text-xs text-gray-600 font-medium uppercase tracking-wider">
                                                <span className="col-span-7">Leçon</span>
                                                <span className="col-span-4 text-right">Accès</span>
                                                <span className="col-span-1" />
                                            </div>

                                            {lessons.map((lesson) => {
                                                const effectivelyFree = lesson.accessType === 'FREE'
                                                    || (lesson.accessType === 'INHERIT' && selectedCourse.isFree);
                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        className="grid grid-cols-12 gap-3 items-center px-3 py-3 bg-white/5 rounded-lg hover:bg-white/8 transition-colors"
                                                    >
                                                        <div className="col-span-7 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                <span className="text-gray-500 font-mono text-xs mr-1">#{lesson.order}</span>
                                                                {lesson.title}
                                                            </p>
                                                            <p className="text-xs text-gray-600 mt-0.5">{lesson.duration} min</p>
                                                        </div>

                                                        <div className="col-span-4">
                                                            <select
                                                                value={lesson.accessType || 'INHERIT'}
                                                                onChange={e => updateLessonAccess(lesson.id, e.target.value)}
                                                                className="w-full px-2 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                                                            >
                                                                <option value="INHERIT">Hérite du cours</option>
                                                                <option value="FREE">Gratuit</option>
                                                                <option value="PAID">Payant</option>
                                                                <option value="FREE_WITH_ADS">Gratuit + Ads</option>
                                                            </select>
                                                        </div>

                                                        <div className="col-span-1 flex justify-center">
                                                            {effectivelyFree
                                                                ? <Unlock size={15} className="text-green-500" />
                                                                : <Lock size={15} className="text-yellow-500" />
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
