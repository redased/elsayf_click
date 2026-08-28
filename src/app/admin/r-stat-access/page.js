'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ShieldAlert, Mail, CheckCircle, XCircle, Search, Users, Crown, Trash2, RefreshCw } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function RStatAccessPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState(null);

    // Formulaire pour donner l'accès par email
    const [emailForm, setEmailForm] = useState({
        email: ''
    });
    const [granting, setGranting] = useState(false);

    useEffect(() => {
        const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                         session?.user?.role === 'ADMIN' ||
                         session?.user?.role === 'R_STAT_ADMIN';

        if (hasAccess) {
            fetchRStatUsers();
        } else {
            setLoading(false);
        }
    }, [session]);

    const fetchRStatUsers = async () => {
        try {
            const res = await fetch('/api/admin/r-stat-users');
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching R Stat users:', error);
        } finally {
            setLoading(false);
        }
    };

    const grantAccessByEmail = async (e) => {
        e.preventDefault();
        if (!emailForm.email) return;

        setGranting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/grant-r-stat-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailForm.email })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Accès R Stat accordé à ${emailForm.email}` });
                setEmailForm({ email: '' });
                await fetchRStatUsers();
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'attribution de l\'accès' });
            }
        } catch (error) {
            console.error('Error granting access:', error);
            setMessage({ type: 'error', text: 'Erreur lors de l\'attribution de l\'accès' });
        } finally {
            setGranting(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const revokeAccess = async (userId, userEmail) => {
        if (!confirm(`Révoquer l'accès R Stat pour ${userEmail} ?`)) return;

        try {
            const res = await fetch('/api/admin/revoke-r-stat-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `Accès R Stat révoqué pour ${userEmail}` });
                await fetchRStatUsers();
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de la révocation' });
            }
        } catch (error) {
            console.error('Error revoking access:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la révocation' });
        } finally {
            setTimeout(() => setMessage(null), 5000);
        }
    };

    // Filtrage
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Vérification des accès
    const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                     session?.user?.role === 'ADMIN' ||
                     session?.user?.role === 'R_STAT_ADMIN' ||
                     session?.user?.rStatAdminAccess === true;

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || !hasAccess) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <ShieldAlert size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">
                        Vous n'avez pas les droits nécessaires pour accéder à cette page.
                    </p>
                </div>
            </div>
        );
    }

    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <ShieldAlert size={40} className="text-purple-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                R Stat Admin Access
                            </h1>
                            <p className="text-gray-400 mt-1">Gestion des accès R Stat Admin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={fetchRStatUsers}
                            className="p-2 hover:bg-purple-500/20 text-purple-500 rounded-lg transition-colors"
                            title="Actualiser"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Message de succès/erreur */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Formulaire pour donner l'accès par email (Super Admin uniquement) */}
                {isSuperAdmin && (
                    <div className="glass-card p-6 mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Mail className="text-purple-500" size={24} />
                            Attribuer l'accès R Stat par Email
                        </h2>
                        <form onSubmit={grantAccessByEmail} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    placeholder="Entrez l'adresse Gmail..."
                                    value={emailForm.email}
                                    onChange={(e) => setEmailForm({ email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={granting}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white disabled:opacity-50"
                            >
                                {granting ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Traitement...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} /> Attribuer l'accès
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="text-sm text-gray-500 mt-3">
                            💡 Entrez l'adresse email d'un utilisateur existant pour lui donner l'accès R Stat Admin.
                        </p>
                    </div>
                )}

                {/* Statistiques */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase">Total avec accès R Stat</p>
                            <p className="text-3xl font-bold">{users.length}</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                            <Crown size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase">Rôle R_STAT_ADMIN</p>
                            <p className="text-3xl font-bold">{users.filter(u => u.role === 'R_STAT_ADMIN').length}</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase">Accès rStatAdminAccess</p>
                            <p className="text-3xl font-bold">{users.filter(u => u.rStatAdminAccess).length}</p>
                        </div>
                    </div>
                </div>

                {/* Recherche */}
                <div className="glass-card p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* Liste des utilisateurs avec accès R Stat */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type d'accès</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            Chargement...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur avec accès R Stat'}
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
                                                user.role === 'R_STAT_ADMIN' ? 'bg-purple-500/20 text-purple-500' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {user.role || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {user.role === 'R_STAT_ADMIN' && (
                                                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Rôle</span>
                                                )}
                                                {user.rStatAdminAccess && (
                                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Permission</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isSuperAdmin && user.role !== 'SUPER_ADMIN' && (
                                                <button
                                                    onClick={() => revokeAccess(user.id, user.email)}
                                                    className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                    title="Révoquer l'accès"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
