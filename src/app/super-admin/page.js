'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Crown, UserPlus, Shield, Mail, Key, Users, Edit, Trash2, CheckCircle, XCircle, Search, Filter, Code, ExternalLink, Video, Send, DollarSign, Lock, MessageCircle } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdminChatPanel from '@/components/admin/AdminChatPanel';

export default function SuperAdminDashboard() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Formulaire création
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        analyticsAccess: false,
        geminiAccess: true,
        openaiAccess: true,
        affiliateAccess: false,
        rStatAccess: false,
        pythonAccess: false
    });

    // Formulaire édition
    const [editUser, setEditUser] = useState({
        id: '',
        role: '',
        analyticsAccess: false,
        rStatAccess: false,
        pythonAccess: false,
        geminiAccess: true,
        openaiAccess: true,
        affiliateAccess: false
    });

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') {
            fetchUsers();
        }
    }, [session]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/super-admin/users');
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/super-admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                await fetchUsers();
                setShowCreateModal(false);
                setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'STUDENT',
                    analyticsAccess: false,
                    geminiAccess: true,
                    openaiAccess: true,
                    affiliateAccess: false,
                    rStatAccess: false,
                    pythonAccess: false
                });
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la création');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Erreur lors de la création');
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/super-admin/users/${editUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser)
            });

            if (res.ok) {
                await fetchUsers();
                setShowEditModal(false);
                setSelectedUser(null);
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await fetchUsers();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditUser({
            id: user.id,
            role: user.role,
            analyticsAccess: user.analyticsAccess || false,
            rStatAccess: user.rStatAccess || false,
            pythonAccess: user.pythonAccess || false,
            geminiAccess: user.geminiAccess !== false,
            openaiAccess: user.openaiAccess !== false,
            affiliateAccess: user.affiliateAccess || false
        });
        setShowEditModal(true);
    };

    // Filtrage
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Stats par rôle
    const roleStats = {
        SUPER_ADMIN: users.filter(u => u.role === 'SUPER_ADMIN').length,
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        MARKETING_RECOVERY: users.filter(u => u.role === 'MARKETING_RECOVERY').length,
        R_STAT_ADMIN: users.filter(u => u.role === 'R_STAT_ADMIN').length,
        STUDENT: users.filter(u => u.role === 'STUDENT').length,
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
        <div>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Crown size={40} className="text-yellow-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                Super Admin Dashboard
                            </h1>
                            <p className="text-gray-400 mt-1">Gestion des utilisateurs et des rôles</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <LanguageSwitcher />
                        <Link
                            href="/super-admin/pricing"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white"
                        >
                            <DollarSign size={20} /> Plans & Pricing
                        </Link>
                        <Link
                            href="/super-admin/course-access"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white"
                        >
                            <Lock size={20} /> Accès Cours
                        </Link>
                        <Link
                            href="/super-admin/vscode-access"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white"
                        >
                            <Code size={20} /> VSCode <ExternalLink size={14} />
                        </Link>
                        <Link
                            href="/super-admin/campaigns"
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white"
                        >
                            <Send size={20} /> Campagnes
                        </Link>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white"
                        >
                            <UserPlus size={20} /> Créer Utilisateur
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="glass-card p-4 text-center">
                        <Crown className="mx-auto text-yellow-500 mb-2" size={24} />
                        <p className="text-2xl font-bold text-yellow-500">{roleStats.SUPER_ADMIN}</p>
                        <p className="text-xs text-gray-500">Super Admins</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Shield className="mx-auto text-red-500 mb-2" size={24} />
                        <p className="text-2xl font-bold text-red-500">{roleStats.ADMIN}</p>
                        <p className="text-xs text-gray-500">Admins</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Mail className="mx-auto text-purple-500 mb-2" size={24} />
                        <p className="text-2xl font-bold text-purple-500">{roleStats.MARKETING_RECOVERY}</p>
                        <p className="text-xs text-gray-500">Marketing</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Key className="mx-auto text-blue-500 mb-2" size={24} />
                        <p className="text-2xl font-bold text-blue-500">{roleStats.R_STAT_ADMIN}</p>
                        <p className="text-xs text-gray-500">R Stat</p>
                    </div>
                    <div className="glass-card p-4 text-center col-span-2">
                        <Users className="mx-auto text-green-500 mb-2" size={24} />
                        <p className="text-2xl font-bold text-green-500">{roleStats.STUDENT}</p>
                        <p className="text-xs text-gray-500">Étudiants</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                        <option value="ALL">Tous les rôles</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MARKETING_RECOVERY">Marketing</option>
                        <option value="R_STAT_ADMIN">R Stat Admin</option>
                        <option value="STUDENT">Étudiant</option>
                    </select>
                </div>

                {/* Quick Grant Access Section */}
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <Mail className="text-purple-500" size={24} />
                        Accès Rapide par Email
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="email"
                                placeholder="Entrez l'adresse Gmail..."
                                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                id="quickAccessEmail"
                            />
                        </div>
                        <button
                            onClick={async () => {
                                const emailInput = document.getElementById('quickAccessEmail');
                                const email = emailInput?.value;
                                if (!email) return alert('Veuillez entrer une adresse email');

                                try {
                                    const res = await fetch('/api/admin/grant-r-stat-access', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email })
                                    });

                                    if (res.ok) {
                                        alert(`Accès R Stat accordé à ${email}`);
                                        emailInput.value = '';
                                        await fetchUsers();
                                    } else {
                                        const data = await res.json();
                                        alert(data.error || 'Erreur lors de l\'attribution');
                                    }
                                } catch (error) {
                                    alert('Erreur lors de l\'attribution');
                                }
                            }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white"
                        >
                            <Key size={20} /> Donner Accès R Stat
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        💡 Entrez l'adresse Gmail d'un utilisateur existant pour lui donner rapidement l'accès R Stat Admin.
                    </p>
                </div>

                {/* Messagerie */}
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <MessageCircle className="text-violet-400" size={24} />
                        Messagerie Étudiants
                    </h2>
                    <AdminChatPanel activeSessions={[]} />
                </div>

                {/* Users Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Accès</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Créé le</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            Chargement...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                ) : filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img src={user.image} className="w-10 h-10 rounded-full" alt={user.name} />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                        {user.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                )}
                                                <span className="font-medium">{user.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{user.email || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.role === 'SUPER_ADMIN' ? 'bg-yellow-500/20 text-yellow-500' :
                                                user.role === 'ADMIN' ? 'bg-red-500/20 text-red-500' :
                                                user.role === 'MARKETING_RECOVERY' ? 'bg-purple-500/20 text-purple-500' :
                                                user.role === 'R_STAT_ADMIN' ? 'bg-blue-500/20 text-blue-500' :
                                                'bg-green-500/20 text-green-500'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {user.analyticsAccess && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Analytics</span>}
                                                {user.rStatAccess && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">R Stat</span>}
                                                {user.pythonAccess && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Python</span>}
                                                {user.affiliateAccess && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Affiliate</span>}
                                                {user.geminiAccess && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Gemini</span>}
                                                {user.openaiAccess && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">OpenAI</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                {user.role !== 'SUPER_ADMIN' && (
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create User Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="glass-card max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <UserPlus size={24} className="text-yellow-500" />
                                    Créer un Utilisateur
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <form onSubmit={createUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Mot de passe</label>
                                    <input
                                        type="password"
                                        required
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rôle</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    >
                                        <option value="STUDENT">Étudiant</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MARKETING_RECOVERY">Marketing Recovery</option>
                                        <option value="R_STAT_ADMIN">R Stat Admin</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-3 pt-2 border-t border-gray-700">
                                    <p className="font-medium text-sm">Permissions d'accès</p>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Google Analytics Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.analyticsAccess}
                                            onChange={(e) => setNewUser({...newUser, analyticsAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">R Stat Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.rStatAccess}
                                            onChange={(e) => setNewUser({...newUser, rStatAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Python Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.pythonAccess}
                                            onChange={(e) => setNewUser({...newUser, pythonAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Gemini AI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.geminiAccess}
                                            onChange={(e) => setNewUser({...newUser, geminiAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">OpenAI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.openaiAccess}
                                            onChange={(e) => setNewUser({...newUser, openaiAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Affiliate Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.affiliateAccess}
                                            onChange={(e) => setNewUser({...newUser, affiliateAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-lg font-bold transition-all text-white"
                                    >
                                        Créer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="glass-card max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Edit size={24} className="text-blue-500" />
                                    Modifier {selectedUser.name}
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <form onSubmit={updateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rôle</label>
                                    <select
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="STUDENT">Étudiant</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MARKETING_RECOVERY">Marketing Recovery</option>
                                        <option value="R_STAT_ADMIN">R Stat Admin</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-gray-700">
                                    <p className="font-medium">Permissions d'accès</p>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Analytics Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.analyticsAccess}
                                            onChange={(e) => setEditUser({...editUser, analyticsAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">R Stat Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.rStatAccess}
                                            onChange={(e) => setEditUser({...editUser, rStatAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Python Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.pythonAccess}
                                            onChange={(e) => setEditUser({...editUser, pythonAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Gemini AI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.geminiAccess}
                                            onChange={(e) => setEditUser({...editUser, geminiAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">OpenAI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.openaiAccess}
                                            onChange={(e) => setEditUser({...editUser, openaiAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">Affiliate Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.affiliateAccess}
                                            onChange={(e) => setEditUser({...editUser, affiliateAccess: e.target.checked})}
                                            className="w-5 h-5 rounded"
                                        />
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-bold transition-all text-white"
                                    >
                                        Sauvegarder
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
