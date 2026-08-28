'use client';
import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [copied, setCopied] = useState(null);
    const [form, setForm] = useState({ code: '', discount: '', maxUses: '', courseId: '', expiresAt: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/coupons');
        const data = await res.json();
        setCoupons(data.coupons || []);
        setLoading(false);
    };

    const create = async () => {
        if (!form.code || !form.discount) return;
        setCreating(true);
        await fetch('/api/admin/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        setForm({ code: '', discount: '', maxUses: '', courseId: '', expiresAt: '' });
        setShowForm(false);
        await fetchCoupons();
        setCreating(false);
    };

    const deleteCoupon = async (id) => {
        await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
        setCoupons(c => c.filter(x => x.id !== id));
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 1500);
    };

    const genCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setForm(f => ({ ...f, code }));
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition-colors">
                    <ArrowLeft size={13} /> Admin
                </Link>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                            <Tag size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Codes Promo</h1>
                            <p className="text-sm text-gray-500">Gérer les coupons de réduction</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(v => !v)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all">
                        <Plus size={15} /> Nouveau coupon
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5 mb-6">
                        <h2 className="font-bold text-white mb-4 text-sm">Créer un coupon</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Code *</label>
                                <div className="flex gap-2">
                                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                        placeholder="EX: PROMO20"
                                        className="flex-1 bg-white/5 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500" />
                                    <button onClick={genCode} className="px-3 py-2 rounded-xl border border-gray-700 text-xs text-gray-400 hover:text-white transition-colors">
                                        Générer
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Réduction (%) *</label>
                                <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                                    placeholder="Ex: 20" min="1" max="100"
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Utilisations max (optionnel)</label>
                                <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                                    placeholder="Illimité si vide"
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date d'expiration</label>
                                <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={create} disabled={creating || !form.code || !form.discount}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                                {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                                Créer
                            </button>
                            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white transition-colors">
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Coupons list */}
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-600" /></div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                        <Tag size={32} className="mx-auto mb-3 opacity-30" />
                        <p>Aucun coupon créé</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {coupons.map(c => {
                            const expired = c.expiresAt && new Date() > new Date(c.expiresAt);
                            const exhausted = c.maxUses && c.usedCount >= c.maxUses;
                            const active = c.active && !expired && !exhausted;
                            return (
                                <div key={c.id} className={`bg-[#0d1117] border rounded-2xl p-4 flex items-center gap-4 ${active ? 'border-emerald-500/20' : 'border-gray-800 opacity-60'}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono font-bold text-white text-sm">{c.code}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                                                {expired ? 'Expiré' : exhausted ? 'Épuisé' : !c.active ? 'Désactivé' : 'Actif'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            <span className="text-emerald-400 font-semibold">{c.discount}% de réduction</span>
                                            {c.course && ` · ${c.course.title}`}
                                            {c.maxUses && ` · ${c.usedCount}/${c.maxUses} utilisations`}
                                            {c.expiresAt && ` · Expire le ${new Date(c.expiresAt).toLocaleDateString('fr-FR')}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => copyCode(c.code)} className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                            {copied === c.code ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                        </button>
                                        <button onClick={() => deleteCoupon(c.id)} className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
