'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicSurveyPage() {
    const params = useParams();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchSurvey();
    }, [params.id]);

    const fetchSurvey = async () => {
        try {
            const res = await fetch(`/api/public/surveys/${params.id}`);
            if (!res.ok) throw new Error('Sondage introuvable ou inactif');
            const data = await res.json();
            setSurvey(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (fieldId, value) => {
        setAnswers({ ...answers, [fieldId]: value });
    };

    const handleNumberChange = (fieldId, value) => {
        setAnswers({ ...answers, [fieldId]: value });
    };

    const handleRatingChange = (fieldId, value) => {
        setAnswers({ ...answers, [fieldId]: value });
    };

    const handleMultipleChoiceChange = (fieldId, option, checked) => {
        const currentAnswers = answers[fieldId] || [];
        if (checked) {
            setAnswers({ ...answers, [fieldId]: [...currentAnswers, option] });
        } else {
            setAnswers({ ...answers, [fieldId]: currentAnswers.filter(o => o !== option) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/public/surveys/${params.id}/responses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de la soumission');
            }

            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !survey) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800 border border-gray-700 p-12 rounded-2xl shadow-2xl text-center"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-900/40 border border-green-800 rounded-full mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white mb-4">Merci pour votre participation !</h2>
                            <p className="text-lg text-gray-300">Vos réponses ont été enregistrées avec succès.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 px-8 py-10 text-white relative overflow-hidden border-b border-gray-700">
                                <div className="relative z-10">
                                    <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-white">{survey.title}</h1>
                                    {survey.description && (
                                        <p className="text-indigo-200 text-lg max-w-2xl leading-relaxed">{survey.description}</p>
                                    )}
                                </div>
                                <Sparkles className="absolute top-4 right-4 w-32 h-32 text-indigo-400 opacity-20" />
                            </div>

                            <div className="p-8 space-y-8">
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                                        <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                )}

                                {survey.fields.map((field, index) => (
                                    <div key={field.id} className="relative group p-6 border border-gray-700 hover:border-indigo-500/50 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition duration-300">
                                        <label className="flex">
                                            <span className="text-indigo-400 font-bold mr-3 mt-1 text-lg">
                                                {index + 1}.
                                            </span>
                                            <div className="flex-1">
                                                <span className="text-lg font-semibold text-gray-100 mb-1 block">
                                                    {field.label}
                                                    {field.required && <span className="text-red-400 ml-1 font-bold">*</span>}
                                                </span>
                                            </div>
                                        </label>

                                        <div className="mt-4 pl-8">
                                            {/* TEXT INPUT */}
                                            {field.type === 'TEXTE' && (
                                                <textarea
                                                    className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 transition p-3 border placeholder-gray-500"
                                                    rows="3"
                                                    required={field.required}
                                                    onChange={(e) => handleTextChange(field.id, e.target.value)}
                                                    placeholder="Saisissez votre réponse ici..."
                                                ></textarea>
                                            )}

                                            {/* NUMBER INPUT */}
                                            {field.type === 'NOMBRE' && (
                                                <input
                                                    type="number"
                                                    className="w-full max-w-xs bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 transition p-3 border placeholder-gray-500"
                                                    required={field.required}
                                                    onChange={(e) => handleNumberChange(field.id, e.target.value)}
                                                    placeholder="Ex: 42"
                                                />
                                            )}

                                            {/* RATING INPUT */}
                                            {field.type === 'EVALUATION' && (
                                                <div className="flex space-x-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            type="button"
                                                            key={star}
                                                            onClick={() => handleRatingChange(field.id, star)}
                                                            className={`w-12 h-12 rounded-full font-bold text-lg transition ${answers[field.id] === star ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110 border-indigo-500' : 'bg-gray-800 text-gray-400 border-2 border-gray-600 hover:border-indigo-400 hover:text-indigo-400'}`}
                                                        >
                                                            {star}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* SINGLE CHOICE */}
                                            {field.type === 'CHOIX_UNIQUE' && (
                                                <div className="space-y-3">
                                                    {field.options && field.options.map((option, i) => (
                                                        <label key={i} className="flex items-center p-3 border border-gray-700 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                                            <input
                                                                type="radio"
                                                                name={`field_${field.id}`}
                                                                value={option}
                                                                required={field.required}
                                                                onChange={(e) => handleTextChange(field.id, e.target.value)}
                                                                className="h-5 w-5 text-indigo-500 focus:ring-indigo-500 border-gray-600 bg-gray-800"
                                                            />
                                                            <span className="ml-3 text-gray-200 font-medium">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {/* MULTIPLE CHOICE */}
                                            {field.type === 'CHOIX_MULTIPLES' && (
                                                <div className="space-y-3">
                                                    {field.options && field.options.map((option, i) => (
                                                        <label key={i} className="flex items-center p-3 border border-gray-700 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                                            <input
                                                                type="checkbox"
                                                                name={`field_${field.id}`}
                                                                value={option}
                                                                onChange={(e) => handleMultipleChoiceChange(field.id, option, e.target.checked)}
                                                                className="h-5 w-5 text-indigo-500 focus:ring-indigo-500 border-gray-600 bg-gray-800 rounded"
                                                            />
                                                            <span className="ml-3 text-gray-200 font-medium">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-900/50 px-8 py-6 border-t border-gray-700 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Envoi en cours...' : 'Envoyer mes réponses'}
                                    {!submitting && <ChevronRight className="w-5 h-5 ml-2" />}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
