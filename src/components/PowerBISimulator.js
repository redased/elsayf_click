'use client';
import { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Filter, Database, FileSpreadsheet, Layers, RefreshCw, Eye, Code2, Sparkles, CheckCircle2, Play, Download, HelpCircle } from 'lucide-react';

/**
 * PowerBISimulator — Composant TP Interactif Power BI Desktop & Report Embedded
 * Permet d'explorer un vrai rapport Power BI avec DAX, KPI Cards, Filtres interactifs et Graphiques.
 */

const INITIAL_DATA = [
    { id: 1, region: 'Alger', year: 2025, segment: 'B2B', category: 'Logiciels', sales: 1250000, margin: 42, orders: 340 },
    { id: 2, region: 'Oran', year: 2025, segment: 'B2C', category: 'Hardware', sales: 850000, margin: 28, orders: 290 },
    { id: 3, region: 'Constantine', year: 2025, segment: 'Enterprise', category: 'Services', sales: 980000, margin: 38, orders: 180 },
    { id: 4, region: 'Annaba', year: 2025, segment: 'B2B', category: 'Logiciels', sales: 620000, margin: 45, orders: 150 },
    { id: 5, region: 'Ouargla', year: 2025, segment: 'Enterprise', category: 'Services', sales: 1150000, margin: 35, orders: 210 },
    { id: 6, region: 'Alger', year: 2026, segment: 'Enterprise', category: 'Logiciels', sales: 1680000, margin: 48, orders: 410 },
    { id: 7, region: 'Oran', year: 2026, segment: 'B2B', category: 'Services', sales: 1100000, margin: 32, orders: 320 },
    { id: 8, region: 'Constantine', year: 2026, segment: 'B2C', category: 'Hardware', sales: 740000, margin: 25, orders: 260 },
    { id: 9, region: 'Annaba', year: 2026, segment: 'B2B', category: 'Logiciels', sales: 890000, margin: 44, orders: 210 },
    { id: 10, region: 'Ouargla', year: 2026, segment: 'Enterprise', category: 'Services', sales: 1420000, margin: 36, orders: 280 }
];

export default function PowerBISimulator({ config }) {
    let parsed = null;
    try {
        parsed = typeof config === 'string' ? JSON.parse(config) : config;
    } catch (e) {
        parsed = {};
    }

    const title = parsed.title || 'Atelier Pratique Power BI Desktop & DAX';
    const embedUrl = parsed.embedUrl || null;
    const initialDax = parsed.dax || 'Chiffre_Affaires = SUM(Ventes[Montant])';
    const daxHelp = parsed.daxHelp || 'Formule DAX d\'agrégation du Chiffre d\'Affaires total.';

    // Filtres dynamiques Power BI Slicers
    const [selectedYear, setSelectedYear] = useState('ALL');
    const [selectedRegion, setSelectedRegion] = useState('ALL');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // Éditeur DAX interactif
    const [daxFormula, setDaxFormula] = useState(initialDax);
    const [daxResult, setDaxResult] = useState(null);
    const [activeTab, setActiveTab] = useState('report'); // 'report' | 'dax' | 'data'

    // Calculs agrégés réactifs (Modèle de données Power BI)
    const filteredData = useMemo(() => {
        return INITIAL_DATA.filter(row => {
            if (selectedYear !== 'ALL' && row.year !== parseInt(selectedYear)) return false;
            if (selectedRegion !== 'ALL' && row.region !== selectedRegion) return false;
            if (selectedCategory !== 'ALL' && row.category !== selectedCategory) return false;
            return true;
        });
    }, [selectedYear, selectedRegion, selectedCategory]);

    const totalSales = useMemo(() => filteredData.reduce((acc, r) => acc + r.sales, 0), [filteredData]);
    const totalOrders = useMemo(() => filteredData.reduce((acc, r) => acc + r.orders, 0), [filteredData]);
    const avgMargin = useMemo(() => {
        if (filteredData.length === 0) return 0;
        return (filteredData.reduce((acc, r) => acc + r.margin, 0) / filteredData.length).toFixed(1);
    }, [filteredData]);

    const salesByRegion = useMemo(() => {
        const map = {};
        filteredData.forEach(r => {
            map[r.region] = (map[r.region] || 0) + r.sales;
        });
        return Object.entries(map).map(([name, val]) => ({ name, val }));
    }, [filteredData]);

    const salesByCategory = useMemo(() => {
        const map = {};
        filteredData.forEach(r => {
            map[r.category] = (map[r.category] || 0) + r.sales;
        });
        return Object.entries(map).map(([name, val]) => ({ name, val }));
    }, [filteredData]);

    // Évaluation DAX simulée
    const handleRunDax = () => {
        const clean = daxFormula.trim().toUpperCase();
        if (clean.includes('SUM') && clean.includes('SALES')) {
            setDaxResult(`Calcul DAX réussi ! [Chiffre_Affaires] = ${totalSales.toLocaleString('fr-FR')} DZD`);
        } else if (clean.includes('AVERAGE') || clean.includes('MARGE')) {
            setDaxResult(`Calcul DAX réussi ! [Marge_Moyenne] = ${avgMargin}%`);
        } else if (clean.includes('COUNT') || clean.includes('COMMANDES')) {
            setDaxResult(`Calcul DAX réussi ! [Nombre_Commandes] = ${totalOrders.toLocaleString('fr-FR')}`);
        } else if (clean.includes('CALCULATE')) {
            setDaxResult(`Calcul DAX avec filtre réussi ! [Ventes_Filtrees] = ${totalSales.toLocaleString('fr-FR')} DZD`);
        } else {
            setDaxResult(`Évaluation DAX exécutée sur le modèle Power BI. Résultat = ${totalSales.toLocaleString('fr-FR')} DZD`);
        }
    };

    return (
        <div className="my-8 rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-500/10 bg-[#0d1117]">
            
            {/* ── Barre Titre Power BI Desktop ── */}
            <div className="bg-[#1b222d] border-b border-gray-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center font-bold text-yellow-400 text-xs">
                        PBI
                    </div>
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white m-0 flex items-center gap-2">
                            {title}
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                                Microsoft Power BI Desktop Simulator
                            </span>
                        </h4>
                    </div>
                </div>

                {/* Onglets de navigation */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'report' ? 'bg-yellow-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        <BarChart3 size={13} /> Rapport Visuel
                    </button>
                    <button
                        onClick={() => setActiveTab('dax')}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'dax' ? 'bg-yellow-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Code2 size={13} /> Éditeur DAX
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'data' ? 'bg-yellow-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Database size={13} /> Vue Données
                    </button>
                </div>
            </div>

            {/* ── Barre de formule DAX au-dessus du rapport ── */}
            <div className="bg-[#161c26] border-b border-gray-800 px-4 py-2 flex items-center gap-3 text-xs">
                <span className="font-mono text-yellow-400 font-bold shrink-0">fx DAX =</span>
                <input
                    type="text"
                    value={daxFormula}
                    onChange={(e) => setDaxFormula(e.target.value)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-1 font-mono text-cyan-300 outline-none focus:border-yellow-500 transition-colors"
                />
                <button
                    onClick={handleRunDax}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded flex items-center gap-1 transition-all"
                >
                    <Play size={11} fill="currentColor" /> Évaluer
                </button>
            </div>

            {/* ── TAB 1 : RAPPORT INTERACTIF POWER BI ── */}
            {activeTab === 'report' && (
                <div className="p-5 space-y-6">

                    {/* Slicers / Filtres Power BI */}
                    <div className="bg-[#121824] p-4 rounded-xl border border-gray-800 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
                            <Filter size={15} /> Segmentations de données (Slicers Power BI) :
                        </div>

                        <div className="flex items-center gap-3 flex-wrap text-xs">
                            {/* Filtre Année */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">Année :</span>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="bg-black/60 border border-gray-700 rounded px-2.5 py-1 text-white font-mono outline-none focus:border-yellow-500"
                                >
                                    <option value="ALL">Toutes (2025-2026)</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>

                            {/* Filtre Région */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">Région :</span>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="bg-black/60 border border-gray-700 rounded px-2.5 py-1 text-white font-mono outline-none focus:border-yellow-500"
                                >
                                    <option value="ALL">Toutes les régions</option>
                                    <option value="Alger">Alger</option>
                                    <option value="Oran">Oran</option>
                                    <option value="Constantine">Constantine</option>
                                    <option value="Annaba">Annaba</option>
                                    <option value="Ouargla">Ouargla</option>
                                </select>
                            </div>

                            {/* Filtre Catégorie */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">Catégorie :</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-black/60 border border-gray-700 rounded px-2.5 py-1 text-white font-mono outline-none focus:border-yellow-500"
                                >
                                    <option value="ALL">Toutes les catégories</option>
                                    <option value="Logiciels">Logiciels</option>
                                    <option value="Services">Services</option>
                                    <option value="Hardware">Hardware</option>
                                </select>
                            </div>

                            {(selectedYear !== 'ALL' || selectedRegion !== 'ALL' || selectedCategory !== 'ALL') && (
                                <button
                                    onClick={() => { setSelectedYear('ALL'); setSelectedRegion('ALL'); setSelectedCategory('ALL'); }}
                                    className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[11px] hover:bg-red-500/30 transition-all"
                                >
                                    Réinitialiser filtres
                                </button>
                            )}
                        </div>
                    </div>

                    {/* KPI Cards Power BI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-[#161c28] p-4 rounded-xl border border-yellow-500/30 shadow-lg">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-1">
                                <span>Chiffre d'Affaires Total</span>
                                <TrendingUp size={16} className="text-emerald-400" />
                            </div>
                            <div className="text-2xl font-bold text-yellow-400 font-mono">
                                {totalSales.toLocaleString('fr-FR')} <span className="text-xs text-gray-400 font-normal">DZD</span>
                            </div>
                            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                                Mesure DAX : SUM(Ventes[Montant])
                            </div>
                        </div>

                        <div className="bg-[#161c28] p-4 rounded-xl border border-cyan-500/30 shadow-lg">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-1">
                                <span>Commandes Totales</span>
                                <BarChart3 size={16} className="text-cyan-400" />
                            </div>
                            <div className="text-2xl font-bold text-cyan-300 font-mono">
                                {totalOrders.toLocaleString('fr-FR')} <span className="text-xs text-gray-400 font-normal">unités</span>
                            </div>
                            <div className="text-[10px] text-cyan-400 mt-1 font-semibold">
                                Mesure DAX : COUNT(Commandes[ID])
                            </div>
                        </div>

                        <div className="bg-[#161c28] p-4 rounded-xl border border-emerald-500/30 shadow-lg sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-1">
                                <span>Marge Moyenne</span>
                                <Sparkles size={16} className="text-emerald-400" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-300 font-mono">
                                {avgMargin}%
                            </div>
                            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                                Mesure DAX : AVERAGE(Ventes[Marge_Pct])
                            </div>
                        </div>
                    </div>

                    {/* Visualisations Graphiques */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Graphique 1 : Ventes par Région */}
                        <div className="bg-[#121824] p-5 rounded-xl border border-gray-800 shadow-xl">
                            <h5 className="text-xs font-bold text-gray-200 mb-4 uppercase tracking-wider flex items-center justify-between">
                                <span>📊 Ventes par Région (Power BI Bar Chart)</span>
                                <span className="text-[10px] text-gray-500 font-mono font-normal">Cliquez sur une barre pour filtrer</span>
                            </h5>
                            <div className="space-y-3">
                                {salesByRegion.map((item, idx) => {
                                    const maxVal = Math.max(...salesByRegion.map(s => s.val), 1);
                                    const pct = ((item.val / maxVal) * 100).toFixed(0);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-gray-300">
                                                <span>{item.name}</span>
                                                <span className="font-mono text-yellow-400">{item.val.toLocaleString('fr-FR')} DZD</span>
                                            </div>
                                            <div
                                                onClick={() => setSelectedRegion(item.name === selectedRegion ? 'ALL' : item.name)}
                                                className="w-full bg-black/50 h-5 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-white/5"
                                            >
                                                <div
                                                    className="h-full bg-gradient-to-r from-yellow-600 to-amber-400 rounded-md transition-all duration-700"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Graphique 2 : Répartition par Catégorie */}
                        <div className="bg-[#121824] p-5 rounded-xl border border-gray-800 shadow-xl">
                            <h5 className="text-xs font-bold text-gray-200 mb-4 uppercase tracking-wider flex items-center justify-between">
                                <span>🍩 Répartition par Catégorie (Power BI Donut)</span>
                                <span className="text-[10px] text-gray-500 font-mono font-normal">Filtre interactif</span>
                            </h5>
                            <div className="space-y-3">
                                {salesByCategory.map((item, idx) => {
                                    const colors = ['from-cyan-600 to-blue-400', 'from-emerald-600 to-teal-400', 'from-purple-600 to-pink-400'];
                                    const maxVal = Math.max(...salesByCategory.map(s => s.val), 1);
                                    const pct = ((item.val / maxVal) * 100).toFixed(0);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-gray-300">
                                                <span>{item.name}</span>
                                                <span className="font-mono text-cyan-300">{item.val.toLocaleString('fr-FR')} DZD</span>
                                            </div>
                                            <div
                                                onClick={() => setSelectedCategory(item.name === selectedCategory ? 'ALL' : item.name)}
                                                className="w-full bg-black/50 h-5 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-white/5"
                                            >
                                                <div
                                                    className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-md transition-all duration-700`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* ── TAB 2 : ÉDITEUR & REQUÊTES DAX ── */}
            {activeTab === 'dax' && (
                <div className="p-5 space-y-4">
                    <div className="bg-[#121824] p-4 rounded-xl border border-gray-800">
                        <h5 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Code2 size={16} /> Console d'Évaluation des Formules DAX (Data Analysis Expressions)
                        </h5>
                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                            {daxHelp}
                        </p>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300">Formule DAX active :</label>
                            <textarea
                                value={daxFormula}
                                onChange={(e) => setDaxFormula(e.target.value)}
                                rows={4}
                                className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 font-mono text-xs sm:text-sm text-cyan-300 outline-none focus:border-yellow-500 transition-colors"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            <button
                                onClick={handleRunDax}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-yellow-500/20"
                            >
                                <Play size={13} fill="currentColor" /> Évaluer la Mesure DAX
                            </button>

                            <span className="text-[11px] text-gray-500 font-mono">
                                Syntaxe DAX officielle Microsoft Power BI
                            </span>
                        </div>
                    </div>

                    {daxResult && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-300 text-xs font-mono animate-in fade-in duration-300">
                            <div className="font-bold mb-1 text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 size={15} /> Résultat de l'Évaluation DAX :
                            </div>
                            {daxResult}
                        </div>
                    )}
                </div>
            )}

            {/* ── TAB 3 : VUE DONNÉES / TABLEAU EXCEL & SQL ── */}
            {activeTab === 'data' && (
                <div className="p-5">
                    <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-xl">
                        <table className="w-full text-xs text-left font-mono">
                            <thead className="bg-[#1b222d] text-yellow-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Région</th>
                                    <th className="p-3">Année</th>
                                    <th className="p-3">Segment</th>
                                    <th className="p-3">Catégorie</th>
                                    <th className="p-3 text-right">Ventes (DZD)</th>
                                    <th className="p-3 text-right">Marge %</th>
                                    <th className="p-3 text-right">Commandes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60 bg-[#121824] text-gray-300">
                                {filteredData.map(row => (
                                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 text-gray-500">#{row.id}</td>
                                        <td className="p-3 font-semibold text-white">{row.region}</td>
                                        <td className="p-3 text-cyan-300">{row.year}</td>
                                        <td className="p-3">{row.segment}</td>
                                        <td className="p-3 text-emerald-300">{row.category}</td>
                                        <td className="p-3 text-right font-bold text-yellow-400">{row.sales.toLocaleString('fr-FR')}</td>
                                        <td className="p-3 text-right text-emerald-400">{row.margin}%</td>
                                        <td className="p-3 text-right">{row.orders}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}
