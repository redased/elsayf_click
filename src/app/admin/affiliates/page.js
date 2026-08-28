'use client';
import { useState, useEffect } from 'react';
import { ShareIcon, ChartBarIcon, ClipboardDocumentIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function AffiliateDashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        platform: '',
        sourceType: 'Profile',
        influencerName: '',
        originalUrl: '/'
    });
    const [createdLink, setCreatedLink] = useState(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/admin/affiliates');
            const data = await res.json();
            if (data.links) setStats(data.links);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLink = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/affiliates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.code) {
                setCreatedLink(data);
                fetchLinks(); // Refresh list
                setFormData({ ...formData, influencerName: '' }); // Reset partial
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    };

    const copyToClipboard = (code) => {
        const url = `${window.location.origin}/?ref=${code}`; // Always home for now, or use originalUrl logic if needed
        navigator.clipboard.writeText(url);
        alert('Lien copié !');
    };

    if (loading) return <div className="p-8 text-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen pt-24 px-6 container mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ShareIcon className="w-8 h-8 text-indigo-500" />
                Affiliation & Tracking
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Generator Form */}
                <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-xl h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <PlusIcon className="w-5 h-5 text-green-400" />
                        Générer un Lien
                    </h2>
                    <form onSubmit={handleCreateLink} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Réseau Social / Plateforme</label>
                            <input
                                type="text"
                                placeholder="ex: Facebook, Instagram"
                                value={formData.platform}
                                onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type de Source</label>
                            <select
                                value={formData.sourceType}
                                onChange={e => setFormData({ ...formData, sourceType: e.target.value })}
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                            >
                                <option value="Profile">Profil Perso</option>
                                <option value="Page">Page / Fanpage</option>
                                <option value="Group">Groupe</option>
                                <option value="Story">Story</option>
                                <option value="Ads">Publicité (Ads)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nom / Identifiant (Personne)</label>
                            <input
                                type="text"
                                placeholder="ex: Reda, Amine, InfluenceurX"
                                value={formData.influencerName}
                                onChange={e => setFormData({ ...formData, influencerName: e.target.value })}
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-2 rounded transition-colors">
                            Créer le lien
                        </button>
                    </form>

                    {createdLink && (
                        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-sm text-green-400 mb-2">Lien créé avec succès !</p>
                            <div className="flex items-center gap-2 bg-[#0a0e17] p-2 rounded">
                                <code className="text-sm truncate flex-1 text-gray-300">
                                    ?ref={createdLink.code}
                                </code>
                                <button onClick={() => copyToClipboard(createdLink.code)} className="p-1 hover:text-white text-gray-400">
                                    <ClipboardDocumentIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Table */}
                <div className="lg:col-span-2 bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-blue-400" />
                            Performances
                        </h2>
                        <button onClick={fetchLinks} className="text-sm text-indigo-400 hover:underline">
                            Actualiser
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4 text-center">Vues</th>
                                    <th className="px-6 py-4 text-center">Inscriptions</th>
                                    <th className="px-6 py-4 text-center">Taux (Conv.)</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {stats.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            Aucun lien créé.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.map(link => {
                                        const convRate = link.clicks > 0 ? ((link.registrations / link.clicks) * 100).toFixed(1) : 0;
                                        return (
                                            <tr key={link.id} className="hover:bg-white/5 transition">
                                                <td className="px-6 py-4 font-mono text-sm text-indigo-300">{link.code}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-white">{link.platform}</div>
                                                    <div className="text-xs text-gray-400">{link.sourceType} • {link.influencerName}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">{link.clicks}</td>
                                                <td className="px-6 py-4 text-center text-green-400 font-bold">{link.registrations}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs ${parseFloat(convRate) > 10 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                                        {convRate}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => copyToClipboard(link.code)} className="text-gray-400 hover:text-white" title="Copier le lien">
                                                        <ClipboardDocumentIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
