
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

export default function AdminInvitationsPage() {
    const { data: session } = useSession();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of invitation being processed

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const res = await fetch('/api/admin/invitations');
            if (res.ok) {
                const data = await res.json();
                setInvitations(data.invitations);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setActionLoading(id);
        try {
            const res = await fetch('/api/admin/invitations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invitationId: id, status })
            });

            if (res.ok) {
                // Refresh list or update local state
                setInvitations(prev => prev.map(inv =>
                    inv.id === id ? { ...inv, status, processedAt: new Date() } : inv
                ));
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            alert('Erreur serveur');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-xl text-center max-w-lg">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <XCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-white">Accès Refusé</h1>
                    <p className="text-gray-400">
                        Cette page est réservée aux administrateurs.
                        <br />
                        Veuillez vous connecter avec un compte autorisé.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Gestion des Invitations</h1>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Cours</th>
                            <th className="px-6 py-4">Date demande</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {invitations.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Aucune demande d'invitation en attente.
                                </td>
                            </tr>
                        ) : invitations.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                    <Mail size={16} className="text-gray-500" />
                                    {inv.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">
                                        {inv.course.title}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {new Date(inv.requestedAt).toLocaleDateString('fr-FR')} {new Date(inv.requestedAt).toLocaleTimeString('fr-FR')}
                                </td>
                                <td className="px-6 py-4">
                                    {inv.status === 'PENDING' && (
                                        <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs w-fit">
                                            <Clock size={12} /> En attente
                                        </span>
                                    )}
                                    {inv.status === 'APPROVED' && (
                                        <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs w-fit">
                                            <CheckCircle size={12} /> Approuvé
                                        </span>
                                    )}
                                    {inv.status === 'REJECTED' && (
                                        <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs w-fit">
                                            <XCircle size={12} /> Rejeté
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {inv.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(inv.id, 'APPROVED')}
                                                disabled={actionLoading === inv.id}
                                                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                                title="Approuver"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(inv.id, 'REJECTED')}
                                                disabled={actionLoading === inv.id}
                                                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                                title="Rejeter"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {inv.status !== 'PENDING' && (
                                        <span className="text-gray-600 text-xs italic">
                                            Traité le {new Date(inv.processedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
