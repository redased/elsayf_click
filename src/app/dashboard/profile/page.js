'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Award, BookOpen, TrendingUp, Settings, Edit3, Save, CheckCircle, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: '',
    });

    const [stats, setStats] = useState({
        coursesInProgress: 0,
        completedCourses: 0,
        totalXP: 0,
        currentLevel: 0,
        certificates: 0,
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchUserData();
        }
    }, [status, router]);

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setUserProfile(data.user);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userProfile),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                setEditMode(false);
                fetchUserData();
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: 'Erreur de connexion' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        fetchUserData(); // Recharger les données originales
        setEditMode(false);
        setMessage(null);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#a78bfa]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <User size={40} className="text-[#a78bfa]" />
                        Mon Profil
                    </h1>
                    <p className="text-gray-400">Gérez vos informations personnelles et suive votre progression</p>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/30 text-green-200'
                                : 'bg-red-500/10 border border-red-500/30 text-red-200'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        {message.text}
                    </div>
                )}

                {/* Profile Card */}
                <div className="glass-card p-8 rounded-2xl border border-gray-800 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Settings size={28} className="text-[#a78bfa]" />
                            Informations Personnelles
                        </h2>
                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-[#a78bfa] hover:bg-[#8b5cf6] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                            >
                                <Edit3 size={18} />
                                Modifier
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Avatar et infos de base */}
                        <div className="flex items-center gap-6 mb-6 p-6 bg-[#1e293b] rounded-xl">
                            <div className="w-20 h-20 rounded-full bg-[#a78bfa]/20 text-[#a78bfa] flex items-center justify-center text-3xl font-bold">
                                {userProfile.firstName?.[0] || userProfile.email?.[0] || '?'}
                            </div>
                            <div>
                                <p className="text-xl font-bold">
                                    {userProfile.firstName} {userProfile.lastName}
                                </p>
                                <p className="text-gray-400">{userProfile.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-[#a78bfa]/20 text-[#a78bfa] rounded-full text-sm font-semibold">
                                    Niveau {stats.currentLevel}
                                </span>
                            </div>
                        </div>

                        {/* Champs modifiables */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Prénom</label>
                                <input
                                    type="text"
                                    value={userProfile.firstName}
                                    onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                                    disabled={!editMode}
                                    className={`w-full bg-[#1e293b] border ${editMode ? 'border-gray-600' : 'border-gray-800'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#a78bfa] focus:outline-none disabled:opacity-50`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Nom</label>
                                <input
                                    type="text"
                                    value={userProfile.lastName}
                                    onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                                    disabled={!editMode}
                                    className={`w-full bg-[#1e293b] border ${editMode ? 'border-gray-600' : 'border-gray-800'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#a78bfa] focus:outline-none disabled:opacity-50`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={userProfile.email}
                                    disabled
                                    className="w-full bg-[#1e293b] border border-gray-800 rounded-lg px-4 py-3 text-white opacity-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    value={userProfile.phone}
                                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                                    disabled={!editMode}
                                    className={`w-full bg-[#1e293b] border ${editMode ? 'border-gray-600' : 'border-gray-800'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#a78bfa] focus:outline-none disabled:opacity-50`}
                                    placeholder="+33 6 XX XX XX XX"
                                />
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-gradient-to-r from-[#a78bfa] to-purple-600 hover:from-purple-500 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div>
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Sauvegarder
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Stats Card */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Progression */}
                    <div className="glass-card p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={24} className="text-[#a78bfa]" />
                            Ma Progression
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Niveau actuel</span>
                                <span className="text-2xl font-bold text-[#a78bfa]">{stats.currentLevel}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">XP Total</span>
                                <span className="text-2xl font-bold text-yellow-500">{stats.totalXP}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-[#a78bfa] to-purple-600 h-full rounded-full"
                                    style={{ width: `${Math.min((stats.totalXP % 1000) / 10, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Cours */}
                    <div className="glass-card p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen size={24} className="text-[#a78bfa]" />
                            Mes Cours
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">En cours</span>
                                <span className="text-xl font-bold">{stats.coursesInProgress}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Terminés</span>
                                <span className="text-xl font-bold text-green-500">{stats.completedCourses}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Certificats</span>
                                <span className="text-xl font-bold text-blue-400">{stats.certificates}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificats */}
                {stats.certificates > 0 && (
                    <div className="glass-card p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Award size={24} className="text-[#a78bfa]" />
                            Mes Certificats
                        </h3>
                        <div className="text-gray-400">
                            Vous avez obtenu {stats.certificates} certificat(s)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AlertCircle({ size }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
