
'use client';
import { useState, useEffect } from 'react';
import { Save, Key, Video, Cpu, ShieldCheck, Lock, Users } from 'lucide-react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [keys, setKeys] = useState({
        googleAuthClientId: '',
        googleAuthClientSecret: '',
        gemini: '',
        openai: '',
        zoom: '',
    });

    const [studentAccess, setStudentAccess] = useState({
        enableGeminiForStudents: true,
        enableOpenAiForStudents: false
    });

    const handleChange = (e) => {
        setKeys({ ...keys, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        alert('Configurations sécurisées mises à jour !');
    };

    if (status === 'loading') return <div>Chargement...</div>;

    if (!session || session.user.role !== 'ADMIN') {
        return (
            <div className="max-w-4xl mx-auto pb-10 text-center pt-20">
                <div className="mx-auto w-16 h-16 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-6">
                    <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Paramètres Étudiant</h1>
                <p className="text-gray-400">
                    Vous pouvez modifier ici vos préférences de profil et de notifications.
                    <br />
                    (Les paramètres système sont réservés aux administrateurs).
                </p>
                {/* Simplified student settings could go here */}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Paramètres Système (Admin)</h1>
                    <p className="text-gray-400">Connecté en tant que Super Admin ({session.user.email})</p>
                </div>
                <Link
                    href="/dashboard/settings/users"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Users size={20} />
                    Gérer les Utilisateurs
                </Link>
            </div>

            <div className="grid gap-8">

                {/* Google Auth Configuration */}
                <section className="glass-card p-6 border-l-4 border-red-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Authentification (Google)</h2>
                            <p className="text-xs text-gray-400">Pour permettre aux étudiants de se connecter.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Client ID</label>
                            <input
                                type="password"
                                name="googleAuthClientId"
                                value={keys.googleAuthClientId}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="...apps.googleusercontent.com"
                            />
                        </div>
                        <div>
                            <label className="label">Client Secret</label>
                            <input
                                type="password"
                                name="googleAuthClientSecret"
                                value={keys.googleAuthClientSecret}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="GOCSPX-..."
                            />
                        </div>
                    </div>
                </section>

                {/* AI Configuration */}
                <section className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Cpu size={24} />
                        </div>
                        <h2 className="text-xl font-bold">Moteurs IA & Accès</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-[#1e2337] rounded-xl border border-gray-700">
                            <label className="label text-white font-bold mb-1">Clé API Google Gemini (Prioritaire)</label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    name="gemini"
                                    value={keys.gemini}
                                    onChange={handleChange}
                                    className="input-field mb-0"
                                    placeholder="AIzaSy..."
                                />
                                <div className="flex items-center gap-2 px-3 bg-[#0a0e17] rounded border border-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={studentAccess.enableGeminiForStudents}
                                        onChange={(e) => setStudentAccess({ ...studentAccess, enableGeminiForStudents: e.target.checked })}
                                        className="w-4 h-4 accent-[#a78bfa]"
                                    />
                                    <span className="text-xs whitespace-nowrap">Donner accès aux étudiants</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-[#1e2337] rounded-xl border border-gray-700 opacity-75">
                            <label className="label text-white font-bold mb-1">Clé API OpenAI (Secondaire)</label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    name="openai"
                                    value={keys.openai}
                                    onChange={handleChange}
                                    className="input-field mb-0"
                                    placeholder="sk-..."
                                />
                                <div className="flex items-center gap-2 px-3 bg-[#0a0e17] rounded border border-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={studentAccess.enableOpenAiForStudents}
                                        onChange={(e) => setStudentAccess({ ...studentAccess, enableOpenAiForStudents: e.target.checked })}
                                        className="w-4 h-4 accent-[#a78bfa]"
                                    />
                                    <span className="text-xs whitespace-nowrap">Donner accès aux étudiants</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button onClick={handleSave} className="btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center">
                        <Save size={18} /> Sauvegarder et Appliquer
                    </button>
                </div>

            </div>
        </div>
    );
}
