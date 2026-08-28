'use client';
import { useState } from 'react';
import {
    CommandLineIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

export default function LeadGenPage() {
    const [logs, setLogs] = useState([
        { time: '10:00:01', type: 'info', msg: 'System initialized. Ready for targeting.' }
    ]);
    const [isScraping, setIsScraping] = useState(false);
    const [target, setTarget] = useState('');

    const runScraper = () => {
        if (!target) return;
        setIsScraping(true);
        addLog('info', `Initializing scraping protocols for target: "${target}"`);

        // Simulation sequence
        setTimeout(() => addLog('success', 'Connected to targeted nodes (Facebook, LinkedIn).'), 800);
        setTimeout(() => addLog('warning', '2,405 profiles identified matching criteria.'), 2000);
        setTimeout(() => addLog('info', 'Extracting contact info (Email/Phone)...'), 3500);
        setTimeout(() => {
            addLog('success', 'Extraction complete. 142 Leads qualified.');
            setIsScraping(false);
        }, 5000);
    };

    const addLog = (type, msg) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { time, type, msg }]);
    };

    return (
        <div className="min-h-screen pt-24 px-8 text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <CpuChipIcon className="w-8 h-8 text-green-500" />
                        Lead Gen & Sniper Scraper
                    </h1>
                    <p className="text-gray-400 mt-2">Outil de ciblage haute précision et d'extraction de leads.</p>
                </div>
                <div className="px-4 py-2 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 text-sm font-mono">
                    STATUS: ONLINE
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
                {/* Control Panel */}
                <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-xl flex flex-col">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-indigo-400" />
                        Paramètres de Ciblage
                    </h2>

                    <div className="space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Mots-clés / Niche</label>
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="w-full bg-[#0f172a] border border-gray-600 rounded p-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono"
                                placeholder="ex: Étudiants Informatique Alger"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Source de Données</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 bg-blue-600/20 border border-blue-500/50 rounded text-blue-400 hover:bg-blue-600/30 transition">
                                    Facebook Groups
                                </button>
                                <button className="p-3 bg-sky-600/20 border border-sky-500/50 rounded text-sky-400 hover:bg-sky-600/30 transition">
                                    LinkedIn
                                </button>
                                <button className="p-3 bg-pink-600/20 border border-pink-500/50 rounded text-pink-400 hover:bg-pink-600/30 transition">
                                    Instagram
                                </button>
                                <button className="p-3 bg-gray-600/20 border border-gray-500/50 rounded text-gray-400 hover:bg-gray-600/30 transition">
                                    Google Maps
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={runScraper}
                        disabled={isScraping || !target}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${isScraping
                                ? 'bg-gray-700 cursor-wait text-gray-400'
                                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                            }`}
                    >
                        {isScraping ? 'SCRAPING EN COURS...' : 'LANCER L\'EXTRACTION'}
                    </button>
                </div>

                {/* Terminal Output */}
                <div className="lg:col-span-2 bg-black border border-gray-800 rounded-xl font-mono p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-8 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-4 text-xs text-gray-500">root@scraper-bot:~</span>
                    </div>

                    <div className="mt-6 space-y-2 h-full overflow-y-auto pb-4 custom-scrollbar">
                        {logs.map((log, idx) => (
                            <div key={idx} className={`text-sm ${log.type === 'error' ? 'text-red-500' :
                                    log.type === 'success' ? 'text-green-400' :
                                        log.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'
                                }`}>
                                <span className="opacity-50">[{log.time}]</span> {log.msg}
                            </div>
                        ))}
                        {isScraping && (
                            <div className="animate-pulse text-green-500">_</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
