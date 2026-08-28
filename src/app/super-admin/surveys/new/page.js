'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Save, Calculator, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewSurveyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [customId, setCustomId] = useState('');

    // Calculateur de Taille d'Échantillon
    const [popSize, setPopSize] = useState('');
    const [confidence, setConfidence] = useState(95);
    const [marginError, setMarginError] = useState(5);
    const [sampleSize, setSampleSize] = useState(null);

    const calculateSample = () => {
        const p = 0.5;
        const e = marginError / 100;
        let z = 1.96; // 95% default
        if (confidence === 90) z = 1.645;
        if (confidence === 99) z = 2.576;

        let n = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);

        if (popSize && parseInt(popSize) > 0) {
            const N = parseInt(popSize);
            n = n / (1 + ((n - 1) / N));
        }
        setSampleSize(Math.ceil(n));
    };

    const [fields, setFields] = useState([
        { id: Date.now(), label: '', type: 'TEXTE', required: false, options: '' }
    ]);

    const addField = () => {
        setFields([...fields, { id: Date.now(), label: '', type: 'TEXTE', required: false, options: '' }]);
    };

    const removeField = (id) => {
        if (fields.length === 1) return;
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id, key, value) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (fields.some(f => !f.label)) {
            setError('Toutes les questions doivent avoir un titre.');
            setLoading(false);
            return;
        }

        const formattedFields = fields.map(f => ({
            label: f.label,
            type: f.type,
            required: f.required,
            options: (f.type === 'CHOIX_UNIQUE' || f.type === 'CHOIX_MULTIPLES')
                ? f.options.split(',').map(o => o.trim()).filter(Boolean)
                : null
        }));

        try {
            const res = await fetch('/api/super-admin/surveys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, customId, fields: formattedFields })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de la création');
            }

            router.push('/super-admin/surveys');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/super-admin/surveys" className="text-gray-500 hover:text-gray-700 mr-4">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Créer un Nouveau Sondage</h1>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

            {/* ASSISTANT DE CALCUL D'ÉCHANTILLON */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center mb-4 text-indigo-800">
                    <Calculator className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-bold">Assistant : Calculateur de Taille d'Échantillon (Formule de Cochran)</h2>
                </div>
                <p className="text-sm text-indigo-700 mb-4">Utilisez cet outil pour déterminer combien de réponses vous devez obtenir pour avoir des résultats statistiquement significatifs (représentatifs).</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-indigo-900 mb-1">
                            Population Cible <span className="text-gray-500 font-normal">(Optionnel)</span>
                        </label>
                        <input
                            type="number"
                            className="w-full border-indigo-200 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                            value={popSize}
                            onChange={(e) => setPopSize(e.target.value)}
                            placeholder="ex: 10000"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-indigo-900 mb-1 flex items-center">
                            Niveau de Confiance <HelpCircle className="w-3 h-3 ml-1 text-indigo-500" title="Probabilité que la vraie valeur soit dans la marge d'erreur" />
                        </label>
                        <select
                            className="w-full border-indigo-200 rounded-md shadow-sm p-2 border bg-white text-gray-900"
                            value={confidence}
                            onChange={(e) => setConfidence(parseInt(e.target.value))}
                        >
                            <option value={90}>90% (Acceptable)</option>
                            <option value={95}>95% (Standard)</option>
                            <option value={99}>99% (Très précis)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-indigo-900 mb-1 flex items-center">
                            Marge d'Erreur (%) <HelpCircle className="w-3 h-3 ml-1 text-indigo-500" title="Écart acceptable (ex: +/- 5%)" />
                        </label>
                        <input
                            type="number"
                            className="w-full border-indigo-200 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                            value={marginError}
                            onChange={(e) => setMarginError(parseFloat(e.target.value))}
                            step="0.1"
                            placeholder="5"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={calculateSample}
                            className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Calculer
                        </button>
                    </div>
                </div>

                {sampleSize !== null && (
                    <div className="mt-4 p-4 bg-white rounded-md border border-indigo-200 flex items-center justify-between">
                        <div>
                            <span className="text-indigo-900 font-bold block">Taille d'échantillon recommandée :</span>
                            <span className="text-xs text-gray-500">Pour garantir une validité statistique selon vos paramètres.</span>
                        </div>
                        <div className="text-2xl font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded">
                            {sampleSize} <span className="text-lg font-medium text-indigo-400">réponses</span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Informations Générales</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre du Sondage</label>
                        <input
                            required
                            type="text"
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Enquête de satisfaction"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnelle)</label>
                        <textarea
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant Personnalisé de l'URL</label>
                        <div className="flex items-center">
                            <span className="text-gray-500 bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md truncate max-w-xs">
                                elsayf.statlabo.com/sondage_
                            </span>
                            <input
                                required
                                type="text"
                                className="flex-1 border-gray-300 rounded-r-md shadow-sm p-2 border focus:ring-blue-500 text-gray-900 bg-white"
                                value={customId}
                                onChange={(e) => setCustomId(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                                placeholder="1"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Saisissez "1" pour l'URL /sondage_1. Seules les lettres, chiffres, tirets sont autorisés.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold">Questions ({fields.length})</h2>
                        <button type="button" onClick={addField} className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium">
                            <Plus className="w-4 h-4 mr-1" /> Ajouter une question
                        </button>
                    </div>

                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50">
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => removeField(field.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <span className="absolute top-2 left-3 text-xs font-bold text-gray-400">Q{index + 1}</span>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                            placeholder="Posez votre question ici..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de Réponse</label>
                                        <select
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white text-gray-900"
                                            value={field.type}
                                            onChange={(e) => updateField(field.id, 'type', e.target.value)}
                                        >
                                            <option value="TEXTE">Champ Texte Ouvert</option>
                                            <option value="NOMBRE">Nombre (Statistiques: Moyenne, Écart-Type)</option>
                                            <option value="EVALUATION">Évaluation (1 à 5 étoiles)</option>
                                            <option value="CHOIX_UNIQUE">Choix Unique (Menu déroulant)</option>
                                            <option value="CHOIX_MULTIPLES">Choix Multiples (Cases à cocher)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end mb-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 shadow-sm w-4 h-4"
                                                checked={field.required}
                                                onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                                            />
                                            <span className="text-sm font-medium text-gray-700">Question obligatoire</span>
                                        </label>
                                    </div>

                                    {(field.type === 'CHOIX_UNIQUE' || field.type === 'CHOIX_MULTIPLES') && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Options de réponse (Séparées par des virgules)</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                                                value={field.options}
                                                onChange={(e) => updateField(field.id, 'options', e.target.value)}
                                                placeholder="Oui, Non, Peut-être"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Link href="/super-admin/surveys" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Création...' : 'Publier le Sondage'}
                    </button>
                </div>
            </form>
        </div>
    );
}
