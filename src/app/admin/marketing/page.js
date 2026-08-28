'use client';
import { useState, useEffect } from 'react';
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline'; // Adjust imports

export default function MarketingDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/marketing')
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized or Error');
                return res.json();
            })
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-white">Chargement des données marketing...</div>;
    if (!stats) return <div className="p-10 text-center text-red-500">Accès refusé ou erreur.</div>;

    return (
        <div className="min-h-screen pt-24 px-6 container mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ChartBarIcon className="w-8 h-8 text-indigo-500" />
                Tableau de Bord Marketing
            </h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <span className="text-gray-400">Revenu Total</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} DA</div>
                </div>

                <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <span className="text-gray-400">Inscriptions Totales</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.totalEnrollments}</div>
                </div>

                <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-500">
                            <UserGroupIcon className="w-6 h-6" />
                        </div>
                        <span className="text-gray-400">Gratuit vs Payant</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-green-400">{stats.freeEnrollmentsCount} Free</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-2xl font-bold text-yellow-400">{stats.paidEnrollmentsCount} Paid</span>
                    </div>
                </div>
            </div>

            {/* Course Performance Table */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700 bg-gray-800/50">
                        <h2 className="text-xl font-bold">Performance des Cours</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Cours</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-center">Inscrits</th>
                                    <th className="px-6 py-4 text-right">Revenu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {stats.courseStats.map(course => (
                                    <tr key={course.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-medium">{course.title}</td>
                                        <td className="px-6 py-4">
                                            {course.isFree ? (
                                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Gratuit</span>
                                            ) : (
                                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Payant ({course.price} DA)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">{course.totalEnrollments}</td>
                                        <td className="px-6 py-4 text-right font-mono text-green-400">
                                            {course.revenue > 0 ? `${course.revenue.toLocaleString()} DA` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden h-fit">
                    <div className="p-6 border-b border-gray-700 bg-gray-800/50">
                        <h2 className="text-xl font-bold">Derniers Paiements</h2>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {stats.recentPayments.length === 0 ? (
                            <div className="p-6 text-gray-400 text-center">Aucun paiement récent</div>
                        ) : (
                            stats.recentPayments.map(payment => (
                                <div key={payment.id} className="p-4 hover:bg-white/5 transition">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white">{payment.user.name || payment.user.email}</span>
                                        <span className="text-green-400 font-mono font-bold">+{payment.amount} DA</span>
                                    </div>
                                    <div className="text-sm text-gray-400 mb-2">{payment.course.title}</div>
                                    <div className="text-xs text-gray-600">
                                        {new Date(payment.paidAt).toLocaleDateString()} à {new Date(payment.paidAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
