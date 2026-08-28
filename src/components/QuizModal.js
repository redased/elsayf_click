'use client';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function QuizModal({ quiz, onClose, onComplete }) {
    const [answers, setAnswers] = useState({}); // { questionId: answerId }
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSelect = (qId, aId) => {
        setAnswers(prev => ({ ...prev, [qId]: aId }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/courses/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: quiz.id,
                    answers
                })
            });
            const data = await res.json();
            setResult(data);
            if (data.passed && onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error(error);
        }
        setSubmitting(false);
    };

    if (result) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-[#1e293b] p-8 rounded-xl max-w-md w-full text-center border border-gray-700">
                    {result.passed ? (
                        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    ) : (
                        <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                    )}
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {result.passed ? 'Félicitations !' : 'Aïe...'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Vous avez obtenu un score de <span className={`font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>{result.score}%</span>.
                        {result.passed && <br />}
                        {result.passed && result.earnedXp > 0 ? `+${result.earnedXp} XP ajoutés à votre profil !` : result.passed ? 'Vous avez déjà validé ce quiz.' : ''}
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold w-full"
                    >
                        {result.passed ? 'Continuer' : 'Réessayer'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] rounded-xl max-w-2xl w-full flex flex-col max-h-[90vh] border border-gray-700">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white max-w-[80%] truncate">{quiz.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">Fermer</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {quiz.questions.map((q, idx) => (
                        <div key={q.id} className="mb-8 last:mb-0">
                            <p className="font-medium text-white mb-4 text-lg">{idx + 1}. {q.text}</p>
                            <div className="space-y-3">
                                {q.answers.map(a => (
                                    <div
                                        key={a.id}
                                        onClick={() => handleSelect(q.id, a.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${answers[q.id] === a.id
                                            ? 'bg-indigo-600/20 border-indigo-500'
                                            : 'bg-[#0f172a] border-gray-700 hover:bg-[#1e293b]'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === a.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-500'
                                            }`}>
                                            {answers[q.id] === a.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <span className="text-gray-300">{a.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-700 bg-[#0f172a] rounded-b-xl">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== quiz.questions.length || submitting}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {submitting ? 'Validation...' : 'Valider mes réponses'}
                    </button>
                </div>
            </div>
        </div>
    );
}
