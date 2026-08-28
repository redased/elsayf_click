'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Users, Calculator, BarChart3, AlertCircle } from 'lucide-react';

export default function SurveyStatsPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSurveyDetails();
    }, [params.id]);

    const fetchSurveyDetails = async () => {
        try {
            const res = await fetch(`/api/super-admin/surveys/${params.id}`);
            if (!res.ok) throw new Error('Erreur de chargement');
            const result = await res.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Chargement des statistiques...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data || !data.survey) return <div className="p-8 text-center text-gray-500">Sondage introuvable</div>;

    const { survey, stats } = data;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <Link href="/super-admin/surveys" className="text-gray-500 hover:text-gray-700 mr-4">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">{survey.title}</h1>
                </div>
                <a
                    href={`/sondage_${survey.customId}`}
                    target="_blank"
                    className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition text-sm font-medium"
                >
                    Voir le sondage public
                    <ExternalLink className="w-4 h-4 ml-2" />
                </a>
            </div>

            <p className="text-gray-600 mb-6">{survey.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Total Réponses</p>
                        <p className="text-3xl font-bold text-gray-800">{survey.responses.length}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Analyse des résultats par question
            </h2>

            <div className="space-y-6">
                {survey.fields.map((field, index) => {
                    const fieldStats = stats[field.id];

                    return (
                        <div key={field.id} className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                <span className="text-gray-400 mr-2">Q{index + 1}.</span>
                                {field.label}
                                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                    {field.type}
                                </span>
                            </h3>

                            <div className="mt-4">
                                {fieldStats?.totalResponses === 0 ? (
                                    <div className="text-gray-500 italic flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Aucune réponse pour cette question
                                    </div>
                                ) : (
                                    <>
                                        {/* NOMBRE / EVALUATION STATS */}
                                        {(field.type === 'NOMBRE' || field.type === 'EVALUATION') && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                                                    <div className="text-xs text-blue-500 uppercase font-bold mb-1">Moyenne</div>
                                                    <div className="text-2xl font-bold text-blue-700">{fieldStats.mean}</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-md text-center border border-gray-100">
                                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1 flex justify-center items-center">
                                                        Écart-Type <Calculator className="w-3 h-3 ml-1" />
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-700">±{fieldStats.stdDev}</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-md text-center border border-gray-100">
                                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Minimum</div>
                                                    <div className="text-xl font-semibold text-gray-700">{fieldStats.min}</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-md text-center border border-gray-100">
                                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Maximum</div>
                                                    <div className="text-xl font-semibold text-gray-700">{fieldStats.max}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CHOIX STATS */}
                                        {(field.type === 'CHOIX_UNIQUE' || field.type === 'CHOIX_MULTIPLES') && (
                                            <div className="space-y-3">
                                                {Object.entries(fieldStats.counts || {}).sort((a, b) => b[1] - a[1]).map(([option, count]) => {
                                                    const percentage = ((count / fieldStats.totalResponses) * 100).toFixed(1);
                                                    return (
                                                        <div key={option} className="flex flex-col">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className="font-medium text-gray-700">{option}</span>
                                                                <span className="text-gray-500">{count} vote(s) ({percentage}%)</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* TEXTE STATS */}
                                        {field.type === 'TEXTE' && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-500 mb-2">Dernières réponses (Total: {fieldStats.totalResponses})</p>
                                                {fieldStats.latest?.map((text, i) => (
                                                    <div key={i} className="bg-gray-50 p-3 rounded-md border border-gray-100 text-sm text-gray-700 italic">
                                                        "{text}"
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
