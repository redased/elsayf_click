'use client';
import { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Trophy, RefreshCw, Loader2, Sparkles } from 'lucide-react';

export default function QuizPanel({ lessonId, isAdmin = false }) {
    const [quiz, setQuiz] = useState(null);
    const [lastResult, setLastResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (lessonId) fetchQuiz();
    }, [lessonId]);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/lessons/${lessonId}/quiz`);
            const data = await res.json();
            setQuiz(data.quiz);
            setLastResult(data.lastResult);
        } catch {}
        setLoading(false);
    };

    const generateQuiz = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/ai/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId })
            });
            const data = await res.json();
            if (data.quiz) { setQuiz(data.quiz); setSelected({}); setSubmitted(false); setResult(null); }
        } catch {}
        setGenerating(false);
    };

    const submit = async () => {
        if (Object.keys(selected).length < quiz.questions.length) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/courses/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizId: quiz.id, answers: selected })
            });
            const data = await res.json();
            setResult(data);
            setSubmitted(true);
        } catch {}
        setSubmitting(false);
    };

    const reset = () => { setSelected({}); setSubmitted(false); setResult(null); };

    if (loading) return null;

    const hasQuiz = quiz && quiz.questions?.length > 0;

    // Admin with no quiz: show generate button
    if (!hasQuiz && isAdmin) {
        return (
            <div className="mt-6 border border-dashed border-gray-700 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-500 mb-3">Aucun quiz pour cette leçon</p>
                <button onClick={generateQuiz} disabled={generating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all disabled:opacity-50">
                    {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {generating ? 'Génération IA...' : 'Générer quiz avec IA'}
                </button>
            </div>
        );
    }

    if (!hasQuiz) return null;

    return (
        <div className="mt-8 bg-[#0d1117] border border-indigo-500/20 rounded-2xl overflow-hidden">
            {/* Header */}
            <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <HelpCircle size={16} className="text-indigo-400" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-white text-sm">{quiz.title || 'Quiz de la leçon'}</p>
                        <p className="text-xs text-gray-500">{quiz.questions.length} questions
                            {lastResult && <span className={`ml-2 font-semibold ${lastResult.passed ? 'text-green-400' : 'text-orange-400'}`}>
                                • Dernier score: {lastResult.score}%
                            </span>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); generateQuiz(); }} disabled={generating}
                            className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/20 hover:bg-violet-500/30 transition-all disabled:opacity-50 flex items-center gap-1">
                            {generating ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                            Regénérer
                        </button>
                    )}
                    <span className="text-gray-500 text-lg">{open ? '▲' : '▼'}</span>
                </div>
            </button>

            {open && (
                <div className="px-5 pb-5 border-t border-gray-800">
                    {/* Résultat */}
                    {submitted && result && (
                        <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${result.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                            {result.passed ? <Trophy size={20} className="text-green-400 shrink-0" /> : <RefreshCw size={20} className="text-orange-400 shrink-0" />}
                            <div className="flex-1">
                                <p className={`font-bold ${result.passed ? 'text-green-400' : 'text-orange-400'}`}>
                                    {result.passed ? `Bravo ! Score: ${result.score}%` : `Score: ${result.score}% — Essaie encore !`}
                                </p>
                                {result.earnedXp > 0 && <p className="text-xs text-green-300 mt-0.5">+{result.earnedXp} XP gagnés !</p>}
                            </div>
                            <button onClick={reset} className="text-xs px-3 py-1.5 rounded-lg border border-gray-600 text-gray-400 hover:text-white transition-colors">
                                Réessayer
                            </button>
                        </div>
                    )}

                    {/* Questions */}
                    <div className="mt-4 space-y-5">
                        {quiz.questions.map((q, qi) => {
                            const userAnswerId = selected[q.id];
                            const correctAnswer = submitted ? q.answers.find(a => a.isCorrect) : null;
                            return (
                                <div key={q.id}>
                                    <p className="text-sm font-semibold text-white mb-2.5">
                                        <span className="text-indigo-400 mr-1.5">Q{qi + 1}.</span>{q.text}
                                    </p>
                                    <div className="space-y-2">
                                        {q.answers.map(a => {
                                            let cls = 'border-gray-700/50 bg-white/3 text-gray-300 hover:border-indigo-500/50 hover:text-white';
                                            if (!submitted) {
                                                if (userAnswerId === a.id) cls = 'border-indigo-500 bg-indigo-500/15 text-white';
                                            } else {
                                                if (a.isCorrect) cls = 'border-green-500 bg-green-500/10 text-green-300';
                                                else if (userAnswerId === a.id && !a.isCorrect) cls = 'border-red-500 bg-red-500/10 text-red-300';
                                                else cls = 'border-gray-800 text-gray-600';
                                            }
                                            return (
                                                <button key={a.id} disabled={submitted}
                                                    onClick={() => setSelected(s => ({ ...s, [q.id]: a.id }))}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all flex items-center gap-2 ${cls}`}>
                                                    {submitted && a.isCorrect && <CheckCircle2 size={14} className="text-green-400 shrink-0" />}
                                                    {submitted && userAnswerId === a.id && !a.isCorrect && <XCircle size={14} className="text-red-400 shrink-0" />}
                                                    {a.text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit */}
                    {!submitted && (
                        <button onClick={submit} disabled={submitting || Object.keys(selected).length < quiz.questions.length}
                            className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                            {submitting ? <><Loader2 size={15} className="animate-spin" /> Correction...</> : 'Valider mes réponses'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
