'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Crown, Settings, Key, Globe, Mail, Save, CheckCircle, XCircle, Eye, EyeOff, Video } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SuperAdminSettings() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(null);
    const [showKeys, setShowKeys] = useState({});

    const [settings, setSettings] = useState({
        aiProvider: 'gemini',
        geminiApiKey: '',
        openaiApiKey: '',
        zaiApiKey: '',
        googleAnalyticsId: '',
        googleAnalyticsEnabled: false,
        googleClientId: '',
        googleSecret: '',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPass: '',
        emailFrom: '',
        // Twitch
        twitchChannel: '',
        twitchEnabled: false,
        twitchShowOffline: true,
        twitchTitle: ''
    });

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') {
            fetchSettings();
        }
    }, [session]);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data) {
                setSettings({
                    aiProvider: data.aiProvider || 'gemini',
                    geminiApiKey: data.geminiApiKey || '',
                    openaiApiKey: data.openaiApiKey || '',
                    zaiApiKey: data.zaiApiKey || '',
                    googleAnalyticsId: data.googleAnalyticsId || '',
                    googleAnalyticsEnabled: data.googleAnalyticsEnabled || false,
                    googleClientId: data.googleClientId || '',
                    googleSecret: data.googleSecret || '',
                    smtpHost: data.smtpHost || '',
                    smtpPort: data.smtpPort || '587',
                    smtpUser: data.smtpUser || '',
                    smtpPass: data.smtpPass || '',
                    emailFrom: data.emailFrom || '',
                    // Twitch
                    twitchChannel: data.twitchChannel || '',
                    twitchEnabled: data.twitchEnabled || false,
                    twitchShowOffline: data.twitchShowOffline !== undefined ? data.twitchShowOffline : true,
                    twitchTitle: data.twitchTitle || ''
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(null);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(null), 3000);
            } else {
                setSaveSuccess(false);
                setTimeout(() => setSaveSuccess(null), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveSuccess(false);
            setTimeout(() => setSaveSuccess(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    const toggleKeyVisibility = (field) => {
        setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <Crown size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée au Super Admin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                    <div className="flex items-center gap-4">
                        <Settings size={40} className="text-yellow-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                Paramètres Système
                            </h1>
                            <p className="text-gray-400 mt-1">Configuration des API et services</p>
                        </div>
                    </div>
                    <LanguageSwitcher />
                </div>

                <form onSubmit={saveSettings} className="space-y-6">
                    {/* AI Providers */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Key className="text-purple-500" size={24} />
                            Providers IA
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Provider Principal</label>
                                <select
                                    value={settings.aiProvider}
                                    onChange={(e) => setSettings({...settings, aiProvider: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                >
                                    <option value="gemini">Google Gemini</option>
                                    <option value="openai">OpenAI</option>
                                    <option value="zai">Z AI</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Clé API Gemini</label>
                                <div className="relative">
                                    <input
                                        type={showKeys.gemini ? "text" : "password"}
                                        value={settings.geminiApiKey}
                                        onChange={(e) => setSettings({...settings, geminiApiKey: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 pr-10"
                                        placeholder="AIza..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('gemini')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showKeys.gemini ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Clé API OpenAI</label>
                                <div className="relative">
                                    <input
                                        type={showKeys.openai ? "text" : "password"}
                                        value={settings.openaiApiKey}
                                        onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 pr-10"
                                        placeholder="sk-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('openai')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showKeys.openai ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Clé API Z AI</label>
                                <div className="relative">
                                    <input
                                        type={showKeys.zai ? "text" : "password"}
                                        value={settings.zaiApiKey}
                                        onChange={(e) => setSettings({...settings, zaiApiKey: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 pr-10"
                                        placeholder="zai-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('zai')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showKeys.zai ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Analytics */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Globe className="text-blue-500" size={24} />
                            Google Analytics
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">ID de suivi Google Analytics</label>
                                <input
                                    type="text"
                                    value={settings.googleAnalyticsId}
                                    onChange={(e) => setSettings({...settings, googleAnalyticsId: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    placeholder="G-XXXXXXXXXX"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <input
                                    type="checkbox"
                                    id="gaEnabled"
                                    checked={settings.googleAnalyticsEnabled}
                                    onChange={(e) => setSettings({...settings, googleAnalyticsEnabled: e.target.checked})}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="gaEnabled" className="text-sm font-medium">Activer Google Analytics</label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Google Client ID (OAuth)</label>
                                <div className="relative">
                                    <input
                                        type={showKeys.googleClientId ? "text" : "password"}
                                        value={settings.googleClientId}
                                        onChange={(e) => setSettings({...settings, googleClientId: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 pr-10"
                                        placeholder="Client ID"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('googleClientId')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showKeys.googleClientId ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Google Client Secret</label>
                                <div className="relative">
                                    <input
                                        type={showKeys.googleSecret ? "text" : "password"}
                                        value={settings.googleSecret}
                                        onChange={(e) => setSettings({...settings, googleSecret: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 pr-10"
                                        placeholder="Client Secret"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('googleSecret')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showKeys.googleSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Email / SMTP */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Mail className="text-green-500" size={24} />
                            Configuration Email / SMTP
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Serveur SMTP</label>
                                <input
                                    type="text"
                                    value={settings.smtpHost}
                                    onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    placeholder="smtp.example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Port SMTP</label>
                                <input
                                    type="text"
                                    value={settings.smtpPort}
                                    onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    placeholder="587"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Utilisateur SMTP</label>
                                <input
                                    type="text"
                                    value={settings.smtpUser}
                                    onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mot de passe SMTP</label>
                                <div className="relative">
                                    <input
                                        type={showKeys.smtpPass ? "text" : "password"}
                                        value={settings.smtpPass}
                                        onChange={(e) => setSettings({...settings, smtpPass: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('smtpPass')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showKeys.smtpPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Email de provenance (From)</label>
                                <input
                                    type="text"
                                    value={settings.emailFrom}
                                    onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    placeholder='"El Sayf" <noreply@elsayf.statlabo.com>'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Configuration Twitch */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Video className="text-purple-500" size={24} />
                            Intégration Twitch (Live Streams)
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Nom du canal Twitch</label>
                                <input
                                    type="text"
                                    value={settings.twitchChannel}
                                    onChange={(e) => setSettings({...settings, twitchChannel: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                    placeholder="votre_chanel_twitch"
                                />
                                <p className="text-xs text-gray-500 mt-1">Exemple: elsayf_academy (sans twitch.tv/)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Titre personnalisé du stream</label>
                                <input
                                    type="text"
                                    value={settings.twitchTitle}
                                    onChange={(e) => setSettings({...settings, twitchTitle: e.target.value})}
                                    className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                    placeholder="🔴 Live Code - Apprenez avec nous!"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <input
                                    type="checkbox"
                                    id="twitchEnabled"
                                    checked={settings.twitchEnabled}
                                    onChange={(e) => setSettings({...settings, twitchEnabled: e.target.checked})}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="twitchEnabled" className="text-sm font-medium">Activer l'embed Twitch</label>
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <input
                                    type="checkbox"
                                    id="twitchShowOffline"
                                    checked={settings.twitchShowOffline}
                                    onChange={(e) => setSettings({...settings, twitchShowOffline: e.target.checked})}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="twitchShowOffline" className="text-sm font-medium">Afficher même hors ligne</label>
                            </div>
                        </div>

                        {settings.twitchChannel && (
                            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                <p className="text-sm text-gray-300">
                                    📺 Aperçu: Le stream sera disponible sur le dashboard étudiant avec le canal:
                                    <span className="font-bold text-purple-400 ml-2">twitch.tv/{settings.twitchChannel}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bouton de sauvegarde */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <span className="animate-spin">⏳</span> Enregistrement...
                                </>
                            ) : saveSuccess === true ? (
                                <>
                                    <CheckCircle size={20} /> Sauvegardé !
                                </>
                            ) : saveSuccess === false ? (
                                <>
                                    <XCircle size={20} /> Erreur !
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Sauvegarder
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
