'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { BarChart, Users, Eye, MousePointerClick, TrendingUp, Smartphone, Monitor, Tablet, Globe, Facebook, Instagram, Linkedin, Youtube, Download, Filter } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SuperAdminAnalytics() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [clicks, setClicks] = useState([]);
    const [links, setLinks] = useState([]);
    const [filterDays, setFilterDays] = useState(30);
    const [selectedLink, setSelectedLink] = useState(null);

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') {
            fetchAnalytics();
        }
    }, [session, filterDays, selectedLink]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch links
            const linksRes = await fetch('/api/super-admin/affiliate-links');
            const linksData = await linksRes.json();
            setLinks(linksData.links || []);

            // Fetch clicks
            const clicksRes = await fetch(`/api/tracking/click-v2?days=${filterDays}${selectedLink ? `&linkId=${selectedLink}` : ''}`);
            const clicksData = await clicksRes.json();
            setClicks(clicksData.clicks || []);
            setStats(clicksData.stats);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportData = () => {
        const data = {
            stats,
            clicks,
            links,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `analytics-${filterDays}d-${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
    };

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg">
                    <BarChart size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée au Super Admin.</p>
                </div>
            </div>
        );
    }

    const getSourceIcon = (source) => {
        const icons = {
            facebook: <Facebook size={16} className="text-blue-500" />,
            instagram: <Instagram size={16} className="text-pink-500" />,
            linkedin: <Linkedin size={16} className="text-blue-700" />,
            youtube: <Youtube size={16} className="text-red-500" />,
            google: <Globe size={16} className="text-green-500" />,
            direct: <MousePointerClick size={16} className="text-gray-500" />
        };
        return icons[source] || <Globe size={16} className="text-gray-500" />;
    };

    const getDeviceIcon = (device) => {
        const icons = {
            mobile: <Smartphone size={18} className="text-blue-400" />,
            tablet: <Tablet size={18} className="text-purple-400" />,
            desktop: <Monitor size={18} className="text-green-400" />
        };
        return icons[device] || <Monitor size={18} className="text-gray-400" />;
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <BarChart size={40} className="text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Analytics & Affiliation
                            </h1>
                            <p className="text-gray-400 mt-1">Statistiques complètes du programme d'affiliation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={exportData}
                            className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
                        >
                            <Download size={18} />
                            Exporter
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card p-4 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <span className="font-medium">Filtres:</span>
                    </div>

                    <select
                        value={filterDays}
                        onChange={(e) => setFilterDays(parseInt(e.target.value))}
                        className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value={7}>7 derniers jours</option>
                        <option value={30}>30 derniers jours</option>
                        <option value={90}>90 derniers jours</option>
                        <option value={365}>365 derniers jours</option>
                    </select>

                    <select
                        value={selectedLink || ''}
                        onChange={(e) => setSelectedLink(e.target.value || null)}
                        className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Tous les liens</option>
                        {links.map(link => (
                            <option key={link.id} value={link.id}>
                                {link.influencerName} - {link.platform} ({link.sourceType})
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={fetchAnalytics}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                    >
                        Actualiser
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent rounded-full"></div>
                        <p className="mt-4 text-gray-400">Chargement des analytics...</p>
                    </div>
                ) : stats && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Eye className="text-blue-500" size={24} />
                                    <span className="text-xs text-gray-500">{filterDays}j</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
                                <p className="text-sm text-gray-400">Clics totaux</p>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Users className="text-green-500" size={24} />
                                    <span className="text-xs text-gray-500">{filterDays}j</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.conversions.toLocaleString()}</p>
                                <p className="text-sm text-gray-400">Conversions</p>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="text-purple-500" size={24} />
                                    <span className="text-xs text-gray-500">{filterDays}j</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                                <p className="text-sm text-gray-400">Taux de conversion</p>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Smartphone className="text-cyan-500" size={24} />
                                    <span className="text-xs text-gray-500">Device</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.byDevice.mobile?.toLocaleString() || 0}</p>
                                <p className="text-sm text-gray-400">Mobile</p>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Monitor className="text-orange-500" size={24} />
                                    <span className="text-xs text-gray-500">Device</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.byDevice.desktop?.toLocaleString() || 0}</p>
                                <p className="text-sm text-gray-400">Desktop</p>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid lg:grid-cols-3 gap-6 mb-8">
                            {/* By Device */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Monitor size={20} className="text-gray-400" />
                                    Par Device
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.byDevice).map(([device, count]) => (
                                        <div key={device} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getDeviceIcon(device)}
                                                <span className="capitalize">{device}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-blue-500 h-full"
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* By Source */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Globe size={20} className="text-gray-400" />
                                    Par Source
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => (
                                        <div key={source} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getSourceIcon(source)}
                                                <span className="capitalize">{source}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-purple-500 h-full"
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* By OS */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Smartphone size={20} className="text-gray-400" />
                                    Par OS
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.byOS).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([os, count]) => (
                                        <div key={os} className="flex items-center justify-between">
                                            <span className="capitalize">{os}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-green-500 h-full"
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Performers */}
                        <div className="glass-card p-6 mb-8">
                            <h3 className="text-xl font-bold mb-4">🏆 Top Performers - Équipe</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-400 uppercase">Membre</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-400 uppercase">Lien</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-400 uppercase">Platform</th>
                                            <th className="px-4 py-3 text-right text-sm font-bold text-gray-400 uppercase">Clics</th>
                                            <th className="px-4 py-3 text-right text-sm font-bold text-gray-400 uppercase">Conversions</th>
                                            <th className="px-4 py-3 text-right text-sm font-bold text-gray-400 uppercase">Taux</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {links
                                            .sort((a, b) => b.clicks - a.clicks)
                                            .slice(0, 10)
                                            .map((link) => {
                                                const rate = link.registrations > 0
                                                    ? ((link.registrations / link.clicks) * 100).toFixed(1)
                                                    : '0.0';

                                                return (
                                                    <tr key={link.id} className="hover:bg-white/5">
                                                        <td className="px-4 py-3">
                                                            <div>
                                                                <div className="font-medium">{link.influencerName}</div>
                                                                <div className="text-sm text-gray-400">{link.creator?.email}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                                                                {link.code}
                                                            </code>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                {getSourceIcon(link.platform.toLowerCase())}
                                                                <span>{link.platform}</span>
                                                                <span className="text-xs text-gray-500">({link.sourceType})</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold">{link.clicks}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-green-400">{link.registrations}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className={`font-bold ${parseFloat(rate) > 5 ? 'text-green-400' : parseFloat(rate) > 2 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                                                {rate}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Clicks */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold mb-4">📋 Clics récents</h3>
                            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Affilié</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Source</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Device</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">OS/Browser</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Landing</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase">Conversion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {clicks.slice(0, 100).map((click) => (
                                            <tr key={click.id} className="hover:bg-white/5 text-sm">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {new Date(click.createdAt).toLocaleDateString('fr-FR')} {new Date(click.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>{click.link?.influencerName}</div>
                                                    <div className="text-xs text-gray-500">{click.link?.platform}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {getSourceIcon(click.source)}
                                                        <span className="capitalize">{click.source}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {getDeviceIcon(click.deviceType)}
                                                        <span className="capitalize">{click.deviceType}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>{click.os || '-'}</div>
                                                    <div className="text-xs text-gray-500">{click.browser || '-'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">
                                                    {click.landingPage || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {click.converted ? (
                                                        <span className="text-green-400">✓</span>
                                                    ) : (
                                                        <span className="text-gray-600">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
