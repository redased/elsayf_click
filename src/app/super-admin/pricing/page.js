'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Crown, DollarSign, Globe, Edit, Trash2, Plus, Save, X, BookOpen, Check } from 'lucide-react';
import Link from 'next/link';

const safeParseJSON = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    try { return JSON.parse(str); } catch { return []; }
};

const EMPTY_FORM = {
    name: '', name_ar: '', name_en: '',
    description: '', description_ar: '', description_en: '',
    region: 'ALGERIA',
    price: 0, priceDzd: 0, priceUsd: 0,
    currency: 'DZD',
    duration: 30,
    isActive: true,
    features: [],
    courseIds: [],
};

export default function PricingManagement() {
    const { data: session, status } = useSession();
    const [plans, setPlans] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') fetchPlans();
    }, [session]);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/super-admin/subscription-plans');
            const data = await res.json();
            if (data.success) {
                setPlans(data.plans);
                setCourses(data.courses || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));

    const addFeature = () => {
        if (!newFeature.trim()) return;
        set('features', [...formData.features, newFeature.trim()]);
        setNewFeature('');
    };

    const removeFeature = (idx) =>
        set('features', formData.features.filter((_, i) => i !== idx));

    const toggleCourse = (courseId) => {
        const ids = formData.courseIds.includes(courseId)
            ? formData.courseIds.filter(id => id !== courseId)
            : [...formData.courseIds, courseId];
        set('courseIds', ids);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingPlan
                ? `/api/super-admin/subscription-plans/${editingPlan.id}`
                : '/api/super-admin/subscription-plans';

            const res = await fetch(url, {
                method: editingPlan ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchPlans();
                closeModal();
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch {
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce plan ?')) return;
        try {
            const res = await fetch(`/api/super-admin/subscription-plans/${id}`, { method: 'DELETE' });
            if (res.ok) fetchPlans();
            else { const d = await res.json(); alert(d.error || 'Erreur'); }
        } catch { alert('Erreur'); }
    };

    const openCreate = () => {
        setEditingPlan(null);
        setFormData(EMPTY_FORM);
        setNewFeature('');
        setShowModal(true);
    };

    const openEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            name_ar: plan.name_ar || '',
            name_en: plan.name_en || '',
            description: plan.description || '',
            description_ar: plan.description_ar || '',
            description_en: plan.description_en || '',
            region: plan.region,
            price: plan.price,
            priceDzd: plan.priceDzd ?? 0,
            priceUsd: plan.priceUsd ?? 0,
            currency: plan.currency,
            duration: plan.duration,
            isActive: plan.isActive,
            features: safeParseJSON(plan.features),
            courseIds: safeParseJSON(plan.courseIds),
        });
        setNewFeature('');
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingPlan(null); };

    if (status === 'loading') return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <Crown size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <DollarSign size={40} className="text-green-500" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                Gestion des Abonnements
                            </h1>
                            <p className="text-gray-400 mt-1">Plans régionaux et pricing dynamique</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/super-admin" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all text-sm">
                            ← Retour
                        </Link>
                        <button
                            onClick={openCreate}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-white text-sm"
                        >
                            <Plus size={18} /> Nouveau Plan
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-gray-500">Chargement...</div>
                    ) : plans.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            Aucun plan configuré.
                        </div>
                    ) : plans.map((plan) => {
                        const planCourses = safeParseJSON(plan.courseIds)
                            .map(id => courses.find(c => c.id === id))
                            .filter(Boolean);

                        return (
                            <div key={plan.id} className={`glass-card p-5 flex flex-col gap-3 ${!plan.isActive ? 'opacity-50' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold">{plan.name}</h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Globe size={12} /> {plan.region}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(plan)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                                            <Edit size={15} />
                                        </button>
                                        <button onClick={() => handleDelete(plan.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {plan.description && <p className="text-gray-400 text-xs">{plan.description}</p>}

                                {/* Prix */}
                                <div className="flex flex-wrap gap-2">
                                    {plan.priceDzd > 0 && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                                            <span className="text-green-400 font-bold text-sm">{plan.priceDzd.toLocaleString('fr-FR')} DZD</span>
                                        </div>
                                    )}
                                    {plan.priceUsd > 0 && (
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
                                            <span className="text-blue-400 font-bold text-sm">{plan.priceUsd} €</span>
                                        </div>
                                    )}
                                    {plan.priceDzd === 0 && plan.priceUsd === 0 && (
                                        <div className="text-2xl font-bold text-green-500">
                                            {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString('fr-FR')} ${plan.currency}`}
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500">{plan.duration} jours</p>

                                {/* Formations incluses */}
                                {planCourses.length > 0 && (
                                    <div className="border-t border-gray-700 pt-3">
                                        <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                                            <BookOpen size={11} /> Formations incluses
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {planCourses.map(c => (
                                                <span key={c.id} className="text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/20">
                                                    {c.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                {safeParseJSON(plan.features).length > 0 && (
                                    <div className="border-t border-gray-700 pt-3">
                                        <p className="text-xs font-bold text-gray-400 mb-1">Fonctionnalités :</p>
                                        <ul className="text-xs text-gray-300 space-y-0.5">
                                            {safeParseJSON(plan.features).map((f, i) => (
                                                <li key={i}>✓ {f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {!plan.isActive && (
                                    <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full self-start">Inactif</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Modal ─────────────────────────────────────────── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="glass-card w-full max-w-2xl p-6 my-6 relative">
                        {/* Header modal */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {editingPlan
                                    ? <><Edit size={20} className="text-blue-400" /> Modifier le Plan</>
                                    : <><Plus size={20} className="text-green-400" /> Nouveau Plan</>
                                }
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Nom */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Nom (FR) *">
                                    <input required value={formData.name} onChange={e => set('name', e.target.value)}
                                        className={inp} placeholder="Plan Pro" />
                                </Field>
                                <Field label="Nom (AR)">
                                    <input value={formData.name_ar} onChange={e => set('name_ar', e.target.value)}
                                        className={inp} dir="rtl" />
                                </Field>
                            </div>

                            {/* Description */}
                            <Field label="Description">
                                <textarea value={formData.description} onChange={e => set('description', e.target.value)}
                                    rows={2} className={inp} placeholder="Description courte du plan" />
                            </Field>

                            {/* Région + Devise + Durée */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Field label="Région *">
                                    <select required value={formData.region} onChange={e => {
                                        const r = e.target.value;
                                        set('region', r);
                                        if (r === 'ALGERIA') set('currency', 'DZD');
                                        else set('currency', 'EUR');
                                    }} className={inp}>
                                        <option value="GLOBAL">Mondial</option>
                                        <option value="ALGERIA">🇩🇿 Algérie</option>
                                        <option value="EUROPE">🇪🇺 Europe</option>
                                    </select>
                                </Field>
                                <Field label="Devise">
                                    <select value={formData.currency} onChange={e => set('currency', e.target.value)} className={inp}>
                                        <option value="DZD">DZD</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </Field>
                                <Field label="Durée (jours)">
                                    <input type="number" min="1" value={formData.duration}
                                        onChange={e => set('duration', parseInt(e.target.value) || 30)} className={inp} />
                                </Field>
                            </div>

                            {/* ── Prix doubles ── */}
                            <div className="bg-white/3 border border-gray-700 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Tarifs</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Field label="Prix principal *">
                                        <div className="relative">
                                            <input type="number" step="0.01" min="0" required value={formData.price}
                                                onChange={e => set('price', e.target.value)}
                                                className={inp + ' pr-14'} placeholder="0" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{formData.currency}</span>
                                        </div>
                                    </Field>
                                    <Field label="Prix DZD 🇩🇿">
                                        <div className="relative">
                                            <input type="number" step="1" min="0" value={formData.priceDzd}
                                                onChange={e => set('priceDzd', e.target.value)}
                                                className={inp + ' pr-12'} placeholder="0" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">DZD</span>
                                        </div>
                                    </Field>
                                    <Field label="Prix EUR 🇪🇺">
                                        <div className="relative">
                                            <input type="number" step="0.01" min="0" value={formData.priceUsd}
                                                onChange={e => set('priceUsd', e.target.value)}
                                                className={inp + ' pr-12'} placeholder="0" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">EUR</span>
                                        </div>
                                    </Field>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2">
                                    🇩🇿 DZD → affiché aux visiteurs algériens · 🇪🇺 EUR → affiché aux visiteurs européens · Prix principal = fallback
                                </p>
                            </div>

                            {/* ── Formations incluses ── */}
                            <div className="bg-white/3 border border-gray-700 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <BookOpen size={13} /> Formations incluses
                                </p>
                                {courses.length === 0 ? (
                                    <p className="text-xs text-gray-500">Aucune formation trouvée</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                        {courses.map(course => {
                                            const selected = formData.courseIds.includes(course.id);
                                            return (
                                                <button
                                                    key={course.id}
                                                    type="button"
                                                    onClick={() => toggleCourse(course.id)}
                                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all border ${selected
                                                        ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                                                        : 'bg-white/3 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-violet-500 border-violet-500' : 'border-gray-600'}`}>
                                                        {selected && <Check size={10} className="text-white" />}
                                                    </div>
                                                    <span className="truncate">{course.title}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                {formData.courseIds.length > 0 && (
                                    <p className="text-[10px] text-violet-400 mt-2">{formData.courseIds.length} formation(s) sélectionnée(s)</p>
                                )}
                            </div>

                            {/* ── Features ── */}
                            <div className="bg-white/3 border border-gray-700 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Fonctionnalités</p>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        placeholder="Ex: Accès illimité aux cours"
                                        className={inp + ' flex-1'}
                                    />
                                    <button type="button" onClick={addFeature}
                                        className="px-3 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-xs font-bold transition-colors shrink-0">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {formData.features.length > 0 && (
                                    <ul className="space-y-1.5">
                                        {formData.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                                <span className="text-green-400">✓</span>
                                                <span className="flex-1">{f}</span>
                                                <button type="button" onClick={() => removeFeature(i)}
                                                    className="text-red-400 hover:text-red-300 transition-colors">
                                                    <X size={13} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Actif */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.isActive}
                                    onChange={e => set('isActive', e.target.checked)}
                                    className="w-4 h-4 rounded accent-violet-500" />
                                <span className="text-sm font-medium">Plan actif</span>
                            </label>

                            {/* Boutons */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors text-sm">
                                    Annuler
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:opacity-50 rounded-xl font-bold transition-all text-white flex items-center justify-center gap-2 text-sm">
                                    <Save size={16} />
                                    {saving ? 'Sauvegarde...' : editingPlan ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper composant champ
const inp = 'w-full px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-500 text-sm transition-colors';

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
            {children}
        </div>
    );
}
