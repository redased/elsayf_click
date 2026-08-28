'use client';
import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Shield, Activity, Cpu } from 'lucide-react';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        aiProvider: 'gemini',
        geminiApiKey: '',
        openaiApiKey: '',
        zaiApiKey: '',
        googleAnalyticsId: '',
        googleAnalyticsEnabled: false,
        googleClientId: '',
        googleSecret: ''
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Paramètres sauvegardés avec succès !');
            } else {
                alert('Erreur lors de la sauvegarde.');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur.');
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 pb-20 container mx-auto text-white">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <SettingsIcon className="text-[#a78bfa]" size={32} />
                    Configuration du Système
                </h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded flex items-center gap-2 font-bold disabled:opacity-50 transition-colors"
                >
                    <Save size={18} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* AI Configuration */}
                <div className="glass-card p-6 border border-gray-700 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-700 pb-4 mb-4">
                        <Cpu className="text-blue-400" />
                        <h2 className="text-xl font-bold">Intelligence Artificielle (IA)</h2>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Fournisseur d'IA par défaut</label>
                        <select
                            name="aiProvider"
                            value={settings.aiProvider}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                        >
                            <option value="gemini">Google Gemini</option>
                            <option value="openai">OpenAI (GPT-4)</option>
                            <option value="zai">Z-AI (Custom)</option>
                        </select>
                    </div>

                    {settings.aiProvider === 'gemini' && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Clé API Gemini</label>
                            <input
                                type="password"
                                name="geminiApiKey"
                                value={settings.geminiApiKey || ''}
                                onChange={handleChange}
                                placeholder="AIzaSy..."
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                    )}

                    {settings.aiProvider === 'openai' && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Clé API OpenAI</label>
                            <input
                                type="password"
                                name="openaiApiKey"
                                value={settings.openaiApiKey || ''}
                                onChange={handleChange}
                                placeholder="sk-..."
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                    )}

                    {settings.aiProvider === 'zai' && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Clé API Z-AI</label>
                            <input
                                type="password"
                                name="zaiApiKey"
                                value={settings.zaiApiKey || ''}
                                onChange={handleChange}
                                placeholder="ZAI-..."
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                    )}
                </div>

                {/* Google Services & Analytics */}
                <div className="glass-card p-6 border border-gray-700 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-700 pb-4 mb-4">
                        <Activity className="text-orange-400" />
                        <h2 className="text-xl font-bold">Google & Analytics</h2>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            id="googleAnalyticsEnabled"
                            name="googleAnalyticsEnabled"
                            checked={settings.googleAnalyticsEnabled}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-600 bg-[#0f172a]"
                        />
                        <label htmlFor="googleAnalyticsEnabled" className="text-white font-medium">Activer Google Analytics</label>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">ID de Mesure (G-XXXXXXXXXX)</label>
                        <input
                            type="text"
                            name="googleAnalyticsId"
                            value={settings.googleAnalyticsId || ''}
                            onChange={handleChange}
                            placeholder="G-ABC123456"
                            className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield size={18} /> Authentification Google
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Google Client ID</label>
                                <input
                                    type="text"
                                    name="googleClientId"
                                    value={settings.googleClientId || ''}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Google Client Secret</label>
                                <input
                                    type="password"
                                    name="googleSecret"
                                    value={settings.googleSecret || ''}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
