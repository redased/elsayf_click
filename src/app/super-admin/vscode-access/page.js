'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    Code, 
    Check, 
    X, 
    Search, 
    Filter,
    ToggleLeft,
    ToggleRight,
    Users,
    UserCheck,
    Loader2
} from 'lucide-react';

export default function VSCodeAccessPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, withAccess: 0, withoutAccess: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (status === 'authenticated') {
            if (session?.user?.role !== 'SUPER_ADMIN') {
                router.push('/');
            } else {
                loadUsers();
            }
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session, filter]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/super-admin/users/toggle-vscode-access?filter=${filter}`);
            const data = await response.json();
            
            if (data.error) {
                setMessage({ type: 'error', text: data.error });
            } else {
                setUsers(data.users);
                setStats(data.stats);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors du chargement des utilisateurs' });
        } finally {
            setLoading(false);
        }
    };

    const toggleAccess = async (userId, currentAccess) => {
        try {
            setActionLoading(userId);
            
            const response = await fetch('/api/super-admin/users/toggle-vscode-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    vscodeAccess: !currentAccess
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setMessage({ 
                    type: 'success', 
                    text: data.message 
                });
                loadUsers();
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Code className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl font-bold">Gestion Accès VS Code</h1>
                    </div>
                    <p className="text-gray-400">
                        Gérez quels utilisateurs ont accès à l'environnement de développement VS Code
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' 
                            ? 'bg-green-600/20 border border-green-600 text-green-400' 
                            : 'bg-red-600/20 border border-red-600 text-red-400'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Utilisateurs</p>
                                <p className="text-3xl font-bold">{stats.total}</p>
                            </div>
                            <Users className="w-12 h-12 text-gray-600" />
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Avec Accès VS Code</p>
                                <p className="text-3xl font-bold text-green-400">{stats.withAccess}</p>
                            </div>
                            <UserCheck className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Sans Accès</p>
                                <p className="text-3xl font-bold text-red-400">{stats.withoutAccess}</p>
                            </div>
                            <X className="w-12 h-12 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 w-5 h-5" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">Tous les utilisateurs</option>
                                <option value="with_access">Avec accès VS Code</option>
                                <option value="without_access">Sans accès VS Code</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-900 border-b border-gray-700">
                            <tr>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium">Utilisateur</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-medium">Rôle</th>
                                <th className="text-center py-4 px-6 text-gray-400 font-medium">Accès VS Code</th>
                                <th className="text-center py-4 px-6 text-gray-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-750">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img 
                                                    src={user.image} 
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                    {user.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <span className="font-medium">{user.name || 'Sans nom'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400">{user.email}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'SUPER_ADMIN' 
                                                ? 'bg-purple-600/20 text-purple-400 border border-purple-600' 
                                                : user.role === 'ADMIN'
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-600'
                                                : 'bg-gray-600/20 text-gray-400 border border-gray-600'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {user.vscodeAccess || user.role === 'SUPER_ADMIN' ? (
                                            <span className="inline-flex items-center gap-1 text-green-400">
                                                <Check className="w-4 h-4" /> Actif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-400">
                                                <X className="w-4 h-4" /> Inactif
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {user.role === 'SUPER_ADMIN' ? (
                                            <span className="text-gray-500 text-sm">Admin permanent</span>
                                        ) : (
                                            <button
                                                onClick={() => toggleAccess(user.id, user.vscodeAccess)}
                                                disabled={actionLoading === user.id}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                    user.vscodeAccess
                                                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600'
                                                        : 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {actionLoading === user.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : user.vscodeAccess ? (
                                                    <><ToggleLeft className="w-4 h-4" /> Révoquer</>
                                                ) : (
                                                    <><ToggleRight className="w-4 h-4" /> Accorder</>
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredUsers.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                            <Users className="mx-auto w-12 h-12 mb-4" />
                            <p>Aucun utilisateur trouvé</p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                        <Code className="w-5 h-5" /> Comment ça marche
                    </h3>
                    <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                        <li>Seuls les utilisateurs avec l'accès VS Code activé peuvent utiliser l'IDE</li>
                        <li>Les SUPER_ADMIN ont toujours accès, même sans le flag vscodeAccess</li>
                        <li>L'accès est vérifié à chaque connexion sur statlabo.com/vscode</li>
                        <li>Les changements sont effectifs immédiatement</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
