'use client';
import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function AISummary({ lessonTitle, lessonContent }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const generate = async () => {
        if (summary) { setOpen(v => !v); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/lesson-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: lessonTitle, content: lessonContent })
            });
            const data = await res.json();
            if (data.summary) { setSummary(data.summary); setOpen(true); }
            else setError('Impossible de générer le résumé');
        } catch { setError('Erreur de connexion'); }
        setLoading(false);
    };

    return (
        <div className="mb-5">
            <button onClick={generate} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 hover:border-violet-500/60 text-violet-300 hover:text-violet-200 text-sm font-medium transition-all disabled:opacity-60">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loading ? 'Analyse en cours...' : summary ? (open ? 'Masquer le résumé' : 'Voir le résumé IA') : 'Résumé IA de la leçon'}
                {summary && !loading && (open ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
            </button>

            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

            {summary && open && (
                <div className="mt-3 bg-[#0d1117] border border-violet-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs text-violet-400 font-semibold uppercase tracking-widest">
                        <Sparkles size={11} /> Résumé généré par IA
                    </div>
                    <div className="text-sm text-gray-300 leading-relaxed space-y-1.5">
                        {summary.split('\n').filter(l => l.trim()).map((line, i) => (
                            <p key={i} className={line.startsWith('•') || line.startsWith('-') ? 'flex gap-2' : ''}>
                                {(line.startsWith('•') || line.startsWith('-'))
                                    ? <><span className="text-violet-400 shrink-0">•</span><span>{line.replace(/^[•\-]\s*/, '')}</span></>
                                    : line
                                }
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
