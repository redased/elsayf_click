'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, XCircle, Settings as SettingsIcon, Sparkles } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchSettings();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            setSettings(data.settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const toggleAccess = async (userId, field) => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/users/toggle-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, field })
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling access:', error);
        } finally {
            setSaving(false);
        }
    };

    const updateAIProvider = async (provider) => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiProvider: provider })
            });

            if (response.ok) {
                fetchSettings();
            }
        } catch (error) {
            console.error('Error updating AI provider:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* AI Provider Settings */}
            <div className="bg-gradient-to-br from-[#1a1f35] to-[#0a0e17] rounded-2xl p-8 border border-[#ffffff10]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Sparkles className="text-purple-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Configuration IA</h2>
                        <p className="text-gray-400 text-sm">Choisissez le fournisseur d'IA pour l'assistant de code</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => updateAIProvider('gemini')}
                        disabled={saving}
                        className={`p-6 rounded-xl border-2 transition-all ${settings?.aiProvider === 'gemini'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-[#ffffff10] hover:border-purple-500/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">Google Gemini</h3>
                            {settings?.aiProvider === 'gemini' && (
                                <CheckCircle className="text-purple-400" size={20} />
                            )}
                        </div>
                        <p className="text-gray-400 text-sm text-left">
                            Assistant IA puissant de Google avec compréhension contextuelle avancée
                        </p>
                        <div className="mt-4 text-xs text-gray-500">
                            API Key: {settings?.geminiApiKey ? '✓ Configurée' : '✗ Non configurée'}
                        </div>
                    </button>

                    <button
                        onClick={() => updateAIProvider('zai')}
                        disabled={saving}
                        className={`p-6 rounded-xl border-2 transition-all ${settings?.aiProvider === 'zai'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-[#ffffff10] hover:border-blue-500/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">Z.AI (GLM-4)</h3>
                            {settings?.aiProvider === 'zai' && (
                                <CheckCircle className="text-blue-400" size={20} />
                            )}
                        </div>
                        <p className="text-gray-400 text-sm text-left">
                            Modèle Zhipu AI optimisé pour le code avec support multilingue
                        </p>
                        <div className="mt-4 text-xs text-gray-500">
                            API Key: {settings?.zaiApiKey ? '✓ Configurée' : '✗ Non configurée'}
                        </div>
                    </button>
                </div>
            </div>

            {/* Users Access Management */}
            <div className="bg-gradient-to-br from-[#1a1f35] to-[#0a0e17] rounded-2xl p-8 border border-[#ffffff10]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Users className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Gestion des Accès Utilisateurs</h2>
                        <p className="text-gray-400 text-sm">Contrôlez l'accès à l'IDE Python Analytics</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#ffffff10]">
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Rôle
                                </th>
                                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Analytics IDE
                                </th>
                                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Gemini AI
                                </th>
                                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    OpenAI
                                </th>
                                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Affiliation
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-[#ffffff05] hover:bg-[#ffffff05] transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                    {user.name?.[0] || 'U'}
                                                </div>
                                            )}
                                            <span className="text-white font-medium">{user.name || 'Sans nom'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => toggleAccess(user.id, 'analyticsAccess')}
                                            disabled={saving}
                                            className={`p-2 rounded-lg transition-all ${user.analyticsAccess
                                                ? 'bg-green-500/20 hover:bg-green-500/30'
                                                : 'bg-red-500/20 hover:bg-red-500/30'
                                                }`}
                                        >
                                            {user.analyticsAccess ? (
                                                <CheckCircle className="text-green-400" size={20} />
                                            ) : (
                                                <XCircle className="text-red-400" size={20} />
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => toggleAccess(user.id, 'geminiAccess')}
                                            disabled={saving}
                                            className={`p-2 rounded-lg transition-all ${user.geminiAccess
                                                ? 'bg-green-500/20 hover:bg-green-500/30'
                                                : 'bg-red-500/20 hover:bg-red-500/30'
                                                }`}
                                        >
                                            {user.geminiAccess ? (
                                                <CheckCircle className="text-green-400" size={20} />
                                            ) : (
                                                <XCircle className="text-red-400" size={20} />
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => toggleAccess(user.id, 'openaiAccess')}
                                            disabled={saving}
                                            className={`p-2 rounded-lg transition-all ${user.openaiAccess
                                                ? 'bg-green-500/20 hover:bg-green-500/30'
                                                : 'bg-red-500/20 hover:bg-red-500/30'
                                                }`}
                                        >
                                            {user.openaiAccess ? (
                                                <CheckCircle className="text-green-400" size={20} />
                                            ) : (
                                                <XCircle className="text-red-400" size={20} />
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => toggleAccess(user.id, 'affiliateAccess')}
                                            disabled={saving}
                                            className={`p-2 rounded-lg transition-all ${user.affiliateAccess
                                                ? 'bg-green-500/20 hover:bg-green-500/30'
                                                : 'bg-red-500/20 hover:bg-red-500/30'
                                                }`}
                                        >
                                            {user.affiliateAccess ? (
                                                <CheckCircle className="text-green-400" size={20} />
                                            ) : (
                                                <XCircle className="text-red-400" size={20} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        Aucun utilisateur inscrit pour le moment
                    </div>
                )}
            </div>
        </div>
    );
}
