'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { 
    Code, Mail, CheckCircle, XCircle, Search, Filter, User, 
    BookOpen, RefreshCw, Phone, GraduationCap, MapPin, Clock,
    ChevronLeft, ChevronRight, Download, Eye, MessageSquare
} from 'lucide-react';

export default function PythonRegistrationsPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [modeFilter, setModeFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    useEffect(() => {
        const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                         session?.user?.role === 'ADMIN' ||
                         session?.user?.pythonAccess === true;

        if (hasAccess) {
            fetchRegistrations();
        } else {
            setLoading(false);
        }
    }, [session, page, statusFilter, modeFilter]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                ...(statusFilter !== 'ALL' && { status: statusFilter }),
                ...(modeFilter !== 'ALL' && { learningMode: modeFilter }),
                ...(searchTerm && { search: searchTerm })
            });

            const res = await fetch(`/api/admin/python-registrations?${params}`);
            const data = await res.json();
            
            if (data.registrations) {
                setRegistrations(data.registrations);
                setStats(data.stats);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setMessage({ type: 'error', text: 'Erreur lors du chargement des inscriptions' });
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus, notes = '') => {
        try {
            const res = await fetch('/api/admin/python-registrations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus, notes })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `Statut mis à jour: ${newStatus}` });
                fetchRegistrations();
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
        }
    };

    const getStatusBadge = (status) => {
        const configs = {
            PENDING: { color: 'yellow', icon: Clock, text: 'En attente' },
            CONTACTED: { color: 'blue', icon: MessageSquare, text: 'Contacté' },
            APPROVED: { color: 'green', icon: CheckCircle, text: 'Approuvé' },
            REJECTED: { color: 'red', icon: XCircle, text: 'Refusé' }
        };
        const config = configs[status] || configs.PENDING;
        const Icon = config.icon;
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${config.color}-500/20 text-${config.color}-400 flex items-center gap-1 w-fit`}>
                <Icon size={12} /> {config.text}
            </span>
        );
    };

    const getModeBadge = (mode) => {
        return mode === 'online' 
            ? <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">🖥️ En ligne</span>
            : <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">🏫 Présentiel</span>;
    };

    const exportCSV = () => {
        const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Niveau', 'Filière', 'Mode', 'Statut', 'Date'];
        const rows = registrations.map(r => [
            r.firstName, r.lastName, r.email, r.phone, r.educationLevel, 
            r.studyField, r.learningMode, r.status, new Date(r.createdAt).toLocaleDateString()
        ]);
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inscriptions-python-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // Vérification des accès
    const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                     session?.user?.role === 'ADMIN' ||
                     session?.user?.pythonAccess === true;

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || !hasAccess) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <Code size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">
                        Vous n'avez pas les droits nécessaires pour accéder à cette page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Code size={40} className="text-yellow-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                Inscriptions Python
                            </h1>
                            <p className="text-gray-400 mt-1">Gérez les candidatures à la formation Python</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/super-admin/python-stats"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            📊 Stats détaillées
                        </Link>
                        <button
                            onClick={exportCSV}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <Download size={16} /> Exporter
                        </button>
                        <button
                            onClick={fetchRegistrations}
                            className="p-2 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition-colors"
                            title="Actualiser"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Stats Cards */}
                {stats && (
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="glass-card p-6">
                            <p className="text-sm text-gray-500 uppercase">Total Inscriptions</p>
                            <p className="text-3xl font-bold">{stats.total}</p>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-sm text-gray-500 uppercase">Nouveaux (7j)</p>
                            <p className="text-3xl font-bold text-blue-400">{stats.newToday}</p>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-sm text-gray-500 uppercase">En attente</p>
                            <p className="text-3xl font-bold text-yellow-400">
                                {stats.byStatus.find(s => s.status === 'PENDING')?._count || 0}
                            </p>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-sm text-gray-500 uppercase">Approuvés</p>
                            <p className="text-3xl font-bold text-green-400">
                                {stats.byStatus.find(s => s.status === 'APPROVED')?._count || 0}
                            </p>
                        </div>
                    </div>
                )}

                {/* Mode Distribution */}
                {stats?.byMode && (
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="glass-card p-4">
                            <h4 className="text-sm text-gray-500 uppercase mb-3">Répartition par mode</h4>
                            <div className="flex gap-4">
                                {stats.byMode.map(mode => (
                                    <div key={mode.learningMode} className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{mode.learningMode === 'online' ? '🖥️ En ligne' : '🏫 Présentiel'}</span>
                                            <span className="font-bold">{mode._count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${mode.learningMode === 'online' ? 'bg-blue-500' : 'bg-green-500'}`}
                                                style={{ width: `${(mode._count / stats.total * 100) || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-4">
                            <h4 className="text-sm text-gray-500 uppercase mb-3">Répartition par statut</h4>
                            <div className="flex flex-wrap gap-2">
                                {stats.byStatus.map(s => (
                                    <span key={s.status} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                                        {s.status}: <strong>{s._count}</strong>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchRegistrations()}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                    >
                        <option value="ALL">Tous les statuts</option>
                        <option value="PENDING">En attente</option>
                        <option value="CONTACTED">Contacté</option>
                        <option value="APPROVED">Approuvé</option>
                        <option value="REJECTED">Refusé</option>
                    </select>
                    <select
                        value={modeFilter}
                        onChange={(e) => { setModeFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                    >
                        <option value="ALL">Tous les modes</option>
                        <option value="online">En ligne</option>
                        <option value="presentiel">Présentiel</option>
                    </select>
                </div>

                {/* Registrations Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Candidat</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Parcours</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Mode</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Statut</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            Chargement...
                                        </td>
                                    </tr>
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            Aucune inscription trouvée
                                        </td>
                                    </tr>
                                ) : registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                                    {reg.firstName?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">{reg.firstName} {reg.lastName}</span>
                                                    {reg.projectType && (
                                                        <p className="text-xs text-gray-500">{reg.projectType}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-400">{reg.email}</div>
                                            {reg.phone && (
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Phone size={10} /> {reg.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.educationLevel && (
                                                <span className="text-xs text-gray-400 block">{reg.educationLevel}</span>
                                            )}
                                            {reg.studyField && (
                                                <span className="text-xs text-gray-500">{reg.studyField}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getModeBadge(reg.learningMode)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(reg.status)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(reg.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedRegistration(reg)}
                                                    className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {reg.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => updateStatus(reg.id, 'CONTACTED')}
                                                        className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                                                        title="Marquer comme contacté"
                                                    >
                                                        <MessageSquare size={16} />
                                                    </button>
                                                )}
                                                {reg.status !== 'APPROVED' && (
                                                    <button
                                                        onClick={() => updateStatus(reg.id, 'APPROVED')}
                                                        className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                        title="Approuver"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {reg.status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => updateStatus(reg.id, 'REJECTED')}
                                                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                        title="Refuser"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg disabled:opacity-50"
                            >
                                <ChevronLeft size={16} /> Précédent
                            </button>
                            <span className="text-gray-400">Page {page} sur {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg disabled:opacity-50"
                            >
                                Suivant <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal Détails */}
                {selectedRegistration && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Détails de l'inscription</h2>
                                <button 
                                    onClick={() => setSelectedRegistration(null)}
                                    className="text-gray-500 hover:text-white"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Nom complet</label>
                                        <p className="font-medium">{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Email</label>
                                        <p className="font-medium">{selectedRegistration.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Téléphone</label>
                                        <p className="font-medium">{selectedRegistration.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Mode</label>
                                        <p>{getModeBadge(selectedRegistration.learningMode)}</p>
                                    </div>
                                </div>

                                {selectedRegistration.educationLevel && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Parcours</label>
                                        <p>{selectedRegistration.educationLevel} {selectedRegistration.studyField && `- ${selectedRegistration.studyField}`}</p>
                                        {selectedRegistration.institution && (
                                            <p className="text-sm text-gray-500">{selectedRegistration.institution}</p>
                                        )}
                                    </div>
                                )}

                                {selectedRegistration.modules && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Modules intéressés</label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {JSON.parse(selectedRegistration.modules).map(m => (
                                                <span key={m} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRegistration.projectDescription && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Projet</label>
                                        <p className="text-sm text-gray-300 bg-white/5 p-3 rounded">
                                            {selectedRegistration.projectDescription}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-800">
                                    <label className="text-xs text-gray-500 uppercase">Changer le statut</label>
                                    <div className="flex gap-2 mt-2">
                                        {['PENDING', 'CONTACTED', 'APPROVED', 'REJECTED'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    updateStatus(selectedRegistration.id, s);
                                                    setSelectedRegistration(null);
                                                }}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    selectedRegistration.status === s 
                                                        ? 'bg-yellow-500 text-black' 
                                                        : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
