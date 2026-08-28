'use client';
import { useState, useEffect } from 'react';
import { Mail, Send, Plus, Loader2, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const TARGET_GROUPS = [
    { value: 'all', label: 'Tous les abonnés newsletter' },
    { value: 'enrolled', label: 'Tous les étudiants inscrits' },
];

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({ subject: '', content: '', targetGroup: 'all' });

    useEffect(() => { fetchCampaigns(); }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        const res = await fetch('/api/super-admin/campaigns');
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        setLoading(false);
    };

    const send = async (sendNow) => {
        if (!form.subject || !form.content) return;
        setSending(true);
        const res = await fetch('/api/super-admin/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, sendNow })
        });
        const data = await res.json();
        if (data.campaign) {
            setForm({ subject: '', content: '', targetGroup: 'all' });
            setShowForm(false);
            await fetchCampaigns();
        }
        setSending(false);
    };

    const statusIcon = { sent: CheckCircle, failed: XCircle, draft: Clock, sending: Loader2 };
    const statusColor = { sent: 'text-green-400', failed: 'text-red-400', draft: 'text-gray-500', sending: 'text-yellow-400' };

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/super-admin" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition-colors">
                    <ArrowLeft size={13} /> Super Admin
                </Link>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                            <Mail size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Campagnes Email</h1>
                            <p className="text-sm text-gray-500">Envoyer des emails à tes abonnés</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(v => !v)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-all">
                        <Plus size={15} /> Nouvelle campagne
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5 mb-6">
                        <h2 className="font-bold text-white mb-4 text-sm">Rédiger une campagne</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Sujet *</label>
                                <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                    placeholder="Sujet de l'email"
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Contenu *</label>
                                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Corps de l'email (supporte les sauts de ligne)..."
                                    rows={6}
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 resize-none" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Destinataires</label>
                                <select value={form.targetGroup} onChange={e => setForm(f => ({ ...f, targetGroup: e.target.value }))}
                                    className="w-full bg-[#0a0e17] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500">
                                    {TARGET_GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => send(true)} disabled={sending || !form.subject || !form.content}
                                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                                Envoyer maintenant
                            </button>
                            <button onClick={() => send(false)} disabled={sending || !form.subject || !form.content}
                                className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:border-gray-500 disabled:opacity-40 transition-colors">
                                Brouillon
                            </button>
                            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-500 text-sm hover:text-white transition-colors">
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Campaigns list */}
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-600" /></div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                        <Mail size={32} className="mx-auto mb-3 opacity-30" />
                        <p>Aucune campagne créée</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {campaigns.map(c => {
                            const Icon = statusIcon[c.status] || Clock;
                            const color = statusColor[c.status] || 'text-gray-500';
                            return (
                                <div key={c.id} className="bg-[#0d1117] border border-gray-800 rounded-2xl p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white text-sm truncate">{c.subject}</p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{c.content.slice(0, 80)}...</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Icon size={15} className={`${color} ${c.status === 'sending' ? 'animate-spin' : ''}`} />
                                            <span className={`text-xs font-semibold ${color}`}>
                                                {c.status === 'sent' ? `${c.sentCount} envoyés` : c.status === 'draft' ? 'Brouillon' : c.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                                        <span>{TARGET_GROUPS.find(g => g.value === c.targetGroup)?.label}</span>
                                        <span>·</span>
                                        <span>{new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
