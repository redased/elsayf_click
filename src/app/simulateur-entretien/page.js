'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TRACKS = [
  { id: 'data-analyst', name: '📊 Data Analyst & BI', icon: '📊', desc: 'Power BI, DAX, Python, Modélisation' },
  { id: 'cybersecurity-pentest', name: '🛡️ Cybersécurité & Pentest', icon: '🛡️', desc: 'OWASP, SQLi, XSS, Défense' },
  { id: 'automation-ia', name: '⚡ Productivité & IA', icon: '⚡', desc: 'RAG, N8N, LLMs, Scripts Python' },
];

export default function InterviewSimulatorPage() {
  const [selectedTrack, setSelectedTrack] = useState('data-analyst');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch questions for track
  useEffect(() => {
    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setEvaluation(null);
      setUserAnswer('');
      setErrorMsg('');
      try {
        const res = await fetch(`/api/ai/interview-simulator?track=${selectedTrack}`);
        const data = await res.json();
        setQuestions(data.questions || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
        setErrorMsg('Impossible de charger les questions pour ce parcours.');
      } finally {
        setIsLoadingQuestions(false);
      }
    }
    loadQuestions();
  }, [selectedTrack]);

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || userAnswer.trim().length < 20) {
      setErrorMsg('Veuillez formuler une réponse d\'au moins 20 caractères pour permettre une évaluation pertinente.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/interview-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: selectedTrack,
          questionId: currentQuestion?.id,
          answer: userAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'évaluation');
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluation(null);
    setUserAnswer('');
    setErrorMsg('');
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 selection:bg-purple-500 selection:text-white pb-24">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-purple-600/15 via-blue-600/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Entraînement Recrutement & Simulation IA
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simulateur d'Entretien Technique
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Testez vos connaissances en conditions réelles d'embauche. Notre Lead Recruteur IA analyse vos réponses, note votre précision technique sur 20 et vous livre la réponse modèle attendue par les directeurs techniques.
          </p>
        </div>

        {/* Track Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrack(t.id)}
              className={`p-4 rounded-xl text-left border transition-all ${
                selectedTrack === t.id
                  ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/10 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">{t.name}</div>
              <div className="text-xs text-slate-400">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Question & Practice Container */}
        {isLoadingQuestions ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p>Chargement des questions d'entretien...</p>
          </div>
        ) : currentQuestion ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Question & Input Form */}
            <div className={`lg:col-span-${evaluation ? '6' : '12'} transition-all`}>
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 backdrop-blur-sm">
                {/* Meta info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Question {currentIndex + 1} sur {questions.length}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Niveau : <span className="text-cyan-300 font-semibold">{currentQuestion.level}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {currentQuestion.title}
                </h2>

                {/* Scenario Context */}
                {currentQuestion.context && (
                  <div className="p-3.5 mb-5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                    <span className="text-base">🏢</span>
                    <div>
                      <strong className="text-purple-300 font-semibold">Mise en situation : </strong>
                      {currentQuestion.context}
                    </div>
                  </div>
                )}

                <div className="text-slate-200 text-sm sm:text-base font-medium mb-6 leading-relaxed bg-purple-950/20 p-4 rounded-xl border border-purple-500/20">
                  {currentQuestion.question}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Votre réponse technique (expliquez votre raisonnement) :
                    </label>
                    <textarea
                      rows={7}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ex: Dans ce cas de figure, je commencerais par analyser... car la fonction CALCULATE permet de modifier le contexte de filtre..."
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans transition resize-none placeholder:text-slate-600"
                    />
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                      <span>{userAnswer.trim().split(/\s+/).filter(Boolean).length} mots saisis</span>
                      <span>Min. recommandé : 40 mots</span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !userAnswer.trim()}
                      className="flex-1 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Analyse du Lead Tech en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          <span>Faire évaluer ma réponse</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      Question suivante &rarr;
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: AI Evaluation Result */}
            {evaluation && (
              <div className="lg:col-span-6 animate-fadeIn">
                <div className="bg-slate-900/90 rounded-2xl border border-purple-500/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-purple-500/10 space-y-6">
                  {/* Score banner */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                        Évaluation du Recruteur
                      </span>
                      <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        {evaluation.rating}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{evaluation.verdict}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-600/20 border border-purple-500/40 text-center">
                      <span className="text-2xl font-black text-white">{evaluation.score}</span>
                      <span className="text-[10px] uppercase font-bold text-purple-300">/ 20</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  {evaluation.strengths && evaluation.strengths.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                        <span>✅</span> Points forts détectés
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {evaluation.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20">
                            <span className="text-emerald-400">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {evaluation.improvements && evaluation.improvements.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                        <span>⚠️</span> Ce qu'il manquait pour 20/20
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {evaluation.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                            <span className="text-amber-400">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Model Answer */}
                  {evaluation.idealAnswer && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                        <span>🎯</span> Réponse modèle attendue
                      </h4>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed font-sans">
                        {evaluation.idealAnswer}
                      </div>
                    </div>
                  )}

                  {/* Course recommendation */}
                  {evaluation.recommendedCourse && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold text-purple-300">
                          Formation conseillée pour combler vos lacunes :
                        </div>
                        <div className="text-sm font-bold text-white">
                          {evaluation.recommendedCourse.title}
                        </div>
                      </div>
                      <Link
                        href={`/courses/${evaluation.recommendedCourse.slug}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white whitespace-nowrap transition"
                      >
                        Voir le cours &rarr;
                      </Link>
                    </div>
                  )}

                  {/* Next Question CTA */}
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
                    >
                      Question suivante &rarr;
                    </button>
                    <Link
                      href="/cv/job-scanner"
                      className="py-2.5 px-4 rounded-xl font-bold text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition text-center"
                    >
                      Scanner mon CV 📄
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            Aucune question trouvée.
          </div>
        )}
      </div>
    </div>
  );
}
