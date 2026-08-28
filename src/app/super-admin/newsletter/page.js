'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Mail, Plus, Trash2, Search, Download, CheckCircle,
    XCircle, AlertCircle, Users, Send, BookOpen, ChevronDown,
    Loader2, Eye, Radio
} from 'lucide-react';

const RECIPIENT_OPTIONS = [
    { value: 'all',      label: 'Tous les abonnés newsletter',   desc: 'Tous les emails actifs de la liste' },
    { value: 'enrolled', label: 'Tous les étudiants inscrits',   desc: 'Utilisateurs ayant au moins une formation' },
    { value: 'custom',   label: 'Emails personnalisés',          desc: 'Entrer les emails manuellement' },
];

export default function NewsletterPage() {
    const { data: session } = useSession();
    const [subscribers, setSubscribers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailInput, setEmailInput] = useState('');
    const [adding, setAdding] = useState(false);
    const [result, setResult] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Send course form
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [recipientMode, setRecipientMode] = useState('all');
    const [customEmails, setCustomEmails] = useState('');
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchSubscribers();
        fetchCourses();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/super-admin/newsletter');
            const data = await res.json();
            setSubscribers(data.subscribers || []);
        } catch {}
        setLoading(false);
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/public/courses');
            const data = await res.json();
            setCourses(data.courses || []);
        } catch {}
    };

    const handleAdd = async () => {
        if (!emailInput.trim()) return;
        setAdding(true); setResult(null);
        const emails = emailInput.split('\n').map(e => e.trim()).filter(Boolean);
        try {
            const res = await fetch('/api/super-admin/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails })
            });
            const data = await res.json();
            setResult(data);
            setEmailInput('');
            fetchSubscribers();
        } catch { setResult({ error: 'Erreur réseau' }); }
        setAdding(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet abonné ?')) return;
        await fetch('/api/super-admin/newsletter', {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        setSubscribers(prev => prev.filter(s => s.id !== id));
    };

    const handleExportCSV = () => {
        const csv = ['Email,Date inscription,Source,Actif']
            .concat(subscribers.map(s =>
                `${s.email},${new Date(s.createdAt).toLocaleDateString('fr-FR')},${s.source},${s.active ? 'Oui' : 'Non'}`
            )).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `newsletter_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const handleSendCourse = async () => {
        if (!selectedCourse) return;
        setSending(true); setSendResult(null);
        try {
            let recipients = recipientMode;
            if (recipientMode === 'custom') {
                recipients = customEmails.split('\n').map(e => e.trim()).filter(Boolean);
                if (!recipients.length) { setSendResult({ error: 'Aucun email saisi' }); setSending(false); return; }
            }
            const res = await fetch('/api/super-admin/newsletter/send-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: selectedCourse.id, recipients })
            });
            const data = await res.json();
            setSendResult(data);
        } catch { setSendResult({ error: 'Erreur réseau' }); }
        setSending(false);
    };

    const filtered = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (session?.user?.role !== 'SUPER_ADMIN')
        return <div className="p-8 text-red-400">Accès refusé</div>;

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Mail className="text-yellow-400" /> Newsletter
                    </h1>
                    <p className="text-gray-400 mt-1">{subscribers.length} abonné{subscribers.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={handleExportCSV} disabled={subscribers.length === 0}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Download size={16} /> Exporter CSV
                </button>
            </div>

            {/* ══ SECTION ENVOYER UNE FORMATION ══ */}
            <div className="bg-[#0d1117] border border-violet-500/30 rounded-2xl overflow-hidden mb-8">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border-b border-violet-500/20 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                        <Send size={17} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-sm">Promouvoir une formation par email</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Sélectionne un cours et envoie un bel email à tes abonnés</p>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Step 1 — Sélectionner la formation */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                            Choisir la formation
                        </label>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {courses.length === 0 ? (
                                <div className="col-span-3 text-center py-6 text-gray-600 text-sm">Chargement des formations...</div>
                            ) : courses.map(course => (
                                <button key={course.id} onClick={() => { setSelectedCourse(course); setSendResult(null); }}
                                    className={`text-left p-4 rounded-xl border transition-all ${selectedCourse?.id === course.id
                                        ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-900/20'
                                        : 'border-gray-800 bg-white/3 hover:border-gray-700'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/40 to-indigo-600/40 flex items-center justify-center shrink-0">
                                            <BookOpen size={14} className="text-violet-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{course.title}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{course.level}</span>
                                                <span className={`text-[10px] font-bold ${course.isFree ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {course.isFree ? 'Gratuit' : `${course.price} DZD`}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedCourse?.id === course.id && (
                                            <CheckCircle size={15} className="text-violet-400 shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2 — Sélectionner les destinataires */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                            Destinataires
                        </label>
                        <div className="grid sm:grid-cols-3 gap-3 mb-3">
                            {RECIPIENT_OPTIONS.map(opt => (
                                <button key={opt.value} onClick={() => setRecipientMode(opt.value)}
                                    className={`text-left p-3.5 rounded-xl border transition-all ${recipientMode === opt.value
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-gray-800 bg-white/3 hover:border-gray-700'}`}>
                                    <p className="text-sm font-semibold text-white mb-0.5">{opt.label}</p>
                                    <p className="text-xs text-gray-500">{opt.desc}</p>
                                    {opt.value === 'all' && (
                                        <p className="text-xs text-indigo-400 mt-1 font-semibold">{subscribers.filter(s => s.active).length} abonnés</p>
                                    )}
                                </button>
                            ))}
                        </div>
                        {recipientMode === 'custom' && (
                            <textarea value={customEmails} onChange={e => setCustomEmails(e.target.value)}
                                placeholder={"email1@exemple.com\nemail2@exemple.com"}
                                rows={4}
                                className="w-full bg-[#0a0e17] border border-gray-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none resize-none transition-colors" />
                        )}
                    </div>

                    {/* Aperçu formation sélectionnée */}
                    {selectedCourse && (
                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                                <BookOpen size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm">{selectedCourse.title}</p>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{selectedCourse.description?.slice(0, 80)}...</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className={`text-sm font-bold ${selectedCourse.isFree ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {selectedCourse.isFree ? 'Gratuit' : `${selectedCourse.price} DZD`}
                                </p>
                                <p className="text-xs text-gray-500">{selectedCourse.level}</p>
                            </div>
                        </div>
                    )}

                    {/* Résultat envoi */}
                    {sendResult && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${sendResult.error
                            ? 'bg-red-500/10 border-red-500/20'
                            : 'bg-green-500/10 border-green-500/20'}`}>
                            {sendResult.error
                                ? <XCircle size={18} className="text-red-400 shrink-0" />
                                : <CheckCircle size={18} className="text-green-400 shrink-0" />}
                            <div>
                                {sendResult.error
                                    ? <p className="text-sm text-red-300">{sendResult.error}</p>
                                    : <p className="text-sm text-green-300 font-semibold">
                                        {sendResult.sent} email{sendResult.sent > 1 ? 's' : ''} envoyé{sendResult.sent > 1 ? 's' : ''} avec succès
                                        {sendResult.failed > 0 && <span className="text-yellow-400 ml-2">({sendResult.failed} échec{sendResult.failed > 1 ? 's' : ''})</span>}
                                      </p>
                                }
                            </div>
                        </div>
                    )}

                    {/* Bouton envoyer */}
                    <div className="flex justify-end">
                        <button onClick={handleSendCourse}
                            disabled={sending || !selectedCourse}
                            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-900/30">
                            {sending
                                ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</>
                                : <><Send size={16} /> Envoyer la formation</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══ SECTION AJOUT ABONNÉS ══ */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-green-400" /> Ajouter des emails
                </h2>
                <p className="text-sm text-gray-400 mb-3">Collez vos emails, un par ligne. Les doublons seront ignorés automatiquement.</p>
                <textarea value={emailInput} onChange={e => setEmailInput(e.target.value)}
                    placeholder={"email1@exemple.com\nemail2@exemple.com"}
                    rows={5}
                    className="w-full bg-[#0a0e17] border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-yellow-500 resize-y" />
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">{emailInput.split('\n').filter(e => e.trim()).length} email(s) détecté(s)</span>
                    <button onClick={handleAdd} disabled={adding || !emailInput.trim()}
                        className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                        {adding ? <><Loader2 size={16} className="animate-spin" /> Ajout...</> : <><Plus size={18} /> Ajouter</>}
                    </button>
                </div>
                {result && !result.error && (
                    <div className="mt-4 bg-[#0a0e17] border border-gray-700 rounded-lg p-4 flex gap-6 text-sm">
                        <span className="flex items-center gap-1 text-green-400"><CheckCircle size={16} /> {result.added} ajouté{result.added > 1 ? 's' : ''}</span>
                        {result.duplicates > 0 && <span className="flex items-center gap-1 text-yellow-400"><AlertCircle size={16} /> {result.duplicates} doublon{result.duplicates > 1 ? 's' : ''}</span>}
                        {result.invalid > 0 && <span className="flex items-center gap-1 text-red-400"><XCircle size={16} /> {result.invalid} invalide{result.invalid > 1 ? 's' : ''}</span>}
                    </div>
                )}
                {result?.error && <div className="mt-4 text-red-400 text-sm">{result.error}</div>}
            </div>

            {/* ══ TABLEAU ABONNÉS ══ */}
            <div className="mb-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un email..."
                        className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-yellow-500" />
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center"><Loader2 size={24} className="animate-spin text-yellow-400 mx-auto" /></div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Users size={48} className="mx-auto mb-3 opacity-50" />
                        <p>{searchTerm ? 'Aucun résultat' : 'Aucun abonné pour le moment'}</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-xs text-gray-400 uppercase">
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((sub, idx) => (
                                <tr key={sub.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-6 py-3 text-sm font-medium text-white">{sub.email}</td>
                                    <td className="px-6 py-3">
                                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{sub.source}</span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-400">
                                        {new Date(sub.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-3">
                                        {sub.active
                                            ? <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Actif</span>
                                            : <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Inactif</span>}
                                    </td>
                                    <td className="px-6 py-3">
                                        <button onClick={() => handleDelete(sub.id)}
                                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
