'use client';
import { useState } from 'react';
import { 
    ResponsiveContainer, LineChart, Line, BarChart, Bar, 
    AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, 
    CartesianGrid, Tooltip, Legend 
} from 'recharts';

export default function InteractiveChart({ config }) {
    const [chartType, setChartType] = useState(null);
    let parsed = null;

    try {
        parsed = typeof config === 'string' ? JSON.parse(config) : config;
    } catch (e) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl my-4 text-xs font-mono">
                Erreur de parsing JSON pour le graphique dynamique : {e.message}
            </div>
        );
    }

    const type = chartType || parsed.type || 'line';
    const data = parsed.data || [];
    const keys = parsed.keys || [];
    const labels = parsed.labels || {};
    const colors = parsed.colors || ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0b0f19]/95 border border-[#a78bfa]/30 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md text-xs">
                    <p className="font-bold text-white mb-1.5">{label}</p>
                    {payload.map((item, index) => (
                        <p key={index} style={{ color: item.color || item.fill }} className="font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                            {labels[item.name] || item.name} : {item.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        {keys.map((key, i) => (
                            <Bar 
                                key={key} 
                                dataKey={key} 
                                fill={colors[i % colors.length]} 
                                radius={[6, 6, 0, 0]}
                                maxBarSize={45}
                            />
                        ))}
                    </BarChart>
                );
            case 'area':
                return (
                    <AreaChart data={data}>
                        <defs>
                            {keys.map((key, i) => (
                                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        {keys.map((key, i) => (
                            <Area 
                                key={key} 
                                type="monotone" 
                                dataKey={key} 
                                stroke={colors[i % colors.length]} 
                                fillOpacity={1} 
                                fill={`url(#grad-${key})`} 
                                strokeWidth={2}
                            />
                        ))}
                    </AreaChart>
                );
            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" dataKey="x" name="x" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis type="number" dataKey="y" name="y" stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        {keys.map((key, i) => (
                            <Scatter 
                                key={key} 
                                name={key} 
                                data={data.filter(d => d.category === key || !d.category)} 
                                fill={colors[i % colors.length]} 
                            />
                        ))}
                    </ScatterChart>
                );
            case 'line':
            default:
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        {keys.map((key, i) => (
                            <Line 
                                key={key} 
                                type="monotone" 
                                dataKey={key} 
                                stroke={colors[i % colors.length]} 
                                strokeWidth={2.5}
                                dot={{ r: 4, strokeWidth: 1.5 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        ))}
                    </LineChart>
                );
        }
    };

    return (
        <div className="my-6 p-5 bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Header controls */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                    {parsed.title || 'Graphique interactif'}
                </span>
                {/* Switch type selectors */}
                <div className="flex gap-1.5">
                    {['line', 'bar', 'area'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setChartType(t)}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${
                                type === t 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart plot wrapper */}
            <div className="h-[280px] w-full text-white">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
            
            {parsed.description && (
                <p className="text-xs text-gray-500 mt-4 leading-relaxed font-medium">
                    💡 {parsed.description}
                </p>
            )}
        </div>
    );
}
