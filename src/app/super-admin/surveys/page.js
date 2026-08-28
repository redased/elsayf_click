'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, BarChart2, Trash2, ExternalLink } from 'lucide-react';

export default function SurveysPage() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const res = await fetch('/api/super-admin/surveys');
            if (!res.ok) throw new Error('Erreur de chargement');
            const data = await res.json();
            setSurveys(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce sondage et toutes ses réponses ?')) return;

        try {
            const res = await fetch(`/api/super-admin/surveys/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Erreur de suppression');
            setSurveys(surveys.filter(s => s.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Sondages</h1>
                <Link
                    href="/super-admin/surveys/new"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Créer un sondage
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lien Public</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réponses</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {surveys.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Aucun sondage créé pour le moment.
                                </td>
                            </tr>
                        ) : (
                            surveys.map((survey) => (
                                <tr key={survey.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{survey.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={`/sondage_${survey.customId}`} target="_blank" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                                            /sondage_{survey.customId}
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                            {survey._count?.responses || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(survey.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/super-admin/surveys/${survey.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <BarChart2 className="w-4 h-4 mr-1" />
                                            Stats
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(survey.id)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
