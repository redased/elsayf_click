'use client';
import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, BarChart2, Calculator } from 'lucide-react';

export default function InteractiveTable({ data }) {
    let parsed = null;
    try {
        parsed = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl my-4 text-xs font-mono">
                Erreur de parsing JSON pour le tableau interactif : {e.message}
            </div>
        );
    }

    const title = parsed.title || 'Tableau de données interactif';
    const headers = parsed.headers || [];
    const initialRows = parsed.rows || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Handle sort click
    const handleSort = (colIndex) => {
        let direction = 'asc';
        if (sortConfig.key === colIndex && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: colIndex, direction });
    };

    // Filter rows by search
    const filteredRows = useMemo(() => {
        if (!searchQuery.trim()) return initialRows;
        return initialRows.filter(row => 
            row.some(val => 
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [initialRows, searchQuery]);

    // Sort rows
    const sortedRows = useMemo(() => {
        if (sortConfig.key === null) return filteredRows;
        return [...filteredRows].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            // Parse numbers if applicable
            const numA = parseFloat(String(valA).replace(/[^0-9.-]/g, ''));
            const numB = parseFloat(String(valB).replace(/[^0-9.-]/g, ''));

            if (!isNaN(numA) && !isNaN(numB)) {
                return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
            }

            return sortConfig.direction === 'asc'
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
    }, [filteredRows, sortConfig]);

    // Paginate rows
    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedRows.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedRows, currentPage]);

    const totalPages = Math.ceil(sortedRows.length / itemsPerPage);

    // Compute automatic column stats for numeric columns
    const columnStats = useMemo(() => {
        const stats = {};

        headers.forEach((header, colIdx) => {
            let numericCount = 0;
            let sum = 0;
            let min = Infinity;
            let max = -Infinity;

            filteredRows.forEach(row => {
                const rawVal = row[colIdx];
                if (rawVal === undefined || rawVal === null) return;
                
                // Try parsing as number
                const cleanStr = String(rawVal).trim().replace(/[^0-9.-]/g, '');
                if (cleanStr === '') return;
                
                const num = Number(cleanStr);
                if (!isNaN(num)) {
                    numericCount++;
                    sum += num;
                    if (num < min) min = num;
                    if (num > max) max = num;
                }
            });

            // If at least 60% of the non-empty column values are numeric, output stats
            if (numericCount > 0 && numericCount >= filteredRows.length * 0.4) {
                stats[header] = {
                    avg: (sum / numericCount).toFixed(2),
                    min: min.toFixed(2),
                    max: max.toFixed(2),
                    sum: sum.toFixed(2),
                    count: numericCount
                };
            }
        });

        return stats;
    }, [filteredRows, headers]);

    return (
        <div className="my-6 p-5 bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-2xl relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-3 border-b border-gray-800">
                <div>
                    <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                        <BarChart2 size={16} />
                        {title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                        Données totales : {initialRows.length} | Filtrées : {filteredRows.length}
                    </p>
                </div>

                {/* Search query input */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                    <input
                        type="text"
                        placeholder="Rechercher dans le tableau..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-teal-500 text-xs placeholder-gray-500 text-white transition-all"
                    />
                </div>
            </div>

            {/* Layout split with Table and stats sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Main Table */}
                <div className="lg:col-span-3 overflow-x-auto rounded-xl border border-gray-800">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#111827] text-gray-400 font-bold border-b border-gray-800 select-none">
                            <tr>
                                {headers.map((header, i) => {
                                    const isSorted = sortConfig.key === i;
                                    return (
                                        <th
                                            key={i}
                                            onClick={() => handleSort(i)}
                                            className="px-4 py-3 cursor-pointer hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>{header}</span>
                                                {isSorted ? (
                                                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                ) : null}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/80 text-gray-300">
                            {paginatedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-500 font-medium">
                                        Aucune ligne ne correspond à vos critères.
                                    </td>
                                </tr>
                            ) : paginatedRows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors">
                                    {row.map((val, colIdx) => (
                                        <td key={colIdx} className="px-4 py-2.5 font-medium">
                                            {val === true ? 'Oui' : val === false ? 'Non' : String(val)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Statistics panel */}
                <div className="bg-[#111827]/50 border border-gray-800/80 rounded-xl p-4 flex flex-col gap-4">
                    <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-800">
                        <Calculator size={13} className="text-teal-400" />
                        Calculs Statistiques
                    </h5>
                    
                    {Object.keys(columnStats).length === 0 ? (
                        <p className="text-[10px] text-gray-500 italic py-4 text-center">
                            Filtrez ou insérez des données numériques pour voir les statistiques.
                        </p>
                    ) : (
                        <div className="space-y-4 overflow-y-auto max-h-[220px]">
                            {Object.entries(columnStats).map(([colName, stat]) => (
                                <div key={colName} className="bg-white/[0.02] border border-gray-800 rounded-lg p-2.5 space-y-1.5">
                                    <div className="text-[10px] font-bold text-teal-400 truncate">{colName}</div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                                        <div className="text-gray-500">Moyenne: <span className="text-white block font-bold mt-0.5">{stat.avg}</span></div>
                                        <div className="text-gray-500">Somme: <span className="text-white block font-bold mt-0.5">{stat.sum}</span></div>
                                        <div className="text-gray-500">Min: <span className="text-white block font-bold mt-0.5">{stat.min}</span></div>
                                        <div className="text-gray-500">Max: <span className="text-white block font-bold mt-0.5">{stat.max}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800 text-xs">
                    <span className="text-gray-500">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                            disabled={currentPage === 1}
                            className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 border border-gray-700/50 px-2.5 py-1.5 rounded-lg text-white font-bold transition-all"
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                            disabled={currentPage === totalPages}
                            className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 border border-gray-700/50 px-2.5 py-1.5 rounded-lg text-white font-bold transition-all"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
