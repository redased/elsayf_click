'use client';
import { useState, useEffect, useRef } from 'react';
import { Compass, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export default function ThreeDScatterPlot({ data }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    let parsed = null;

    try {
        parsed = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl my-4 text-xs font-mono">
                Erreur de parsing JSON pour le graphe 3D : {e.message}
            </div>
        );
    }

    const title = parsed.title || 'Visualisation de données en 3D';
    const points = parsed.points || [];

    // State for yaw, pitch and zoom
    const [yaw, setYaw] = useState(0.8);  // Angle horizontal
    const [pitch, setPitch] = useState(0.5); // Angle vertical
    const [zoom, setZoom] = useState(1.1);   // Facteur de zoom
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const angleStart = useRef({ yaw: 0, pitch: 0 });

    // Handle mouse events for rotation
    const handleMouseDown = (e) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        angleStart.current = { yaw, pitch };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        // Update angles
        setYaw(angleStart.current.yaw + dx * 0.007);
        setPitch(Math.max(-Math.PI/2.1, Math.min(Math.PI/2.1, angleStart.current.pitch - dy * 0.007)));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        setZoom(z => Math.max(0.4, Math.min(3.0, z - e.deltaY * 0.001)));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Make canvas responsive
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 360;

        const ctx = canvas.getContext('2d');
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const scaleBase = Math.min(canvas.width, canvas.height) * 0.35 * zoom;

        // 3D Projection function
        const project = (x, y, z) => {
            // Apply yaw rotation (around Z-axis)
            const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
            const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);

            // Apply pitch rotation (around X-axis)
            const y2 = y1 * Math.cos(pitch) - z * Math.sin(pitch);
            const z2 = y1 * Math.sin(pitch) + z * Math.cos(pitch);

            // 2D Coordinates and depth
            return {
                px: cx + x1 * scaleBase,
                py: cy - y2 * scaleBase,
                depth: z2
            };
        };

        // Render loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background grid lines on bottom plane (z = -1)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let i = -5; i <= 5; i++) {
            const val = i / 5;
            // Lines parallel to X
            const p1 = project(-1, val, -1);
            const p2 = project(1, val, -1);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();

            // Lines parallel to Y
            const p3 = project(val, -1, -1);
            const p4 = project(val, 1, -1);
            ctx.beginPath();
            ctx.moveTo(p3.px, p3.py);
            ctx.lineTo(p4.px, p4.py);
            ctx.stroke();
        }

        // Draw Axis lines X, Y, Z
        const drawAxis = (x, y, z, color, label) => {
            const origin = project(0, 0, 0);
            const end = project(x, y, z);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(origin.px, origin.py);
            ctx.lineTo(end.px, end.py);
            ctx.stroke();

            // Label
            ctx.fillStyle = color;
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText(label, end.px + 5, end.py + 4);
        };

        drawAxis(1.2, 0, 0, '#f87171', 'X (Statistique)');
        drawAxis(0, 1.2, 0, '#4ade80', 'Y (Excel)');
        drawAxis(0, 0, 1.2, '#60a5fa', 'Z (Python)');

        // Project and prepare points
        const projectedPoints = points.map(pt => {
            const projected = project(pt.x, pt.y, pt.z);
            return {
                ...pt,
                px: projected.px,
                py: projected.py,
                depth: projected.depth
            };
        });

        // Depth-sort points (draw back-to-front so closer points overlap farther ones)
        projectedPoints.sort((a, b) => a.depth - b.depth);

        // Draw points
        projectedPoints.forEach(pt => {
            // Adjust size based on depth (perspective)
            const r = Math.max(2, (pt.r || 6) * (1 + pt.depth * 0.4) * zoom);
            
            // Draw point body glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = pt.color || '#a78bfa';

            ctx.fillStyle = pt.color || '#a78bfa';
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, r, 0, 2 * Math.PI);
            ctx.fill();

            // Reset shadow
            ctx.shadowBlur = 0;

            // Draw point border
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw labels for points
            if (pt.label) {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = '9px sans-serif';
                ctx.fillText(pt.label, pt.px + r + 4, pt.py + 3);
            }
        });

    }, [yaw, pitch, zoom, points]);

    return (
        <div className="my-6 p-5 bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-2xl relative select-none">
            {/* Header controls */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                <span className="text-xs font-bold text-[#a78bfa] uppercase tracking-widest flex items-center gap-2">
                    <Compass size={16} />
                    {title}
                </span>
                {/* Control Panel */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setZoom(z => Math.min(3.0, z + 0.1))}
                        className="bg-white/5 hover:bg-white/10 p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Zoomer"
                    >
                        <ZoomIn size={14} />
                    </button>
                    <button
                        onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
                        className="bg-white/5 hover:bg-white/10 p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Dézoomer"
                    >
                        <ZoomOut size={14} />
                    </button>
                    <button
                        onClick={() => { setYaw(0.8); setPitch(0.5); setZoom(1.1); }}
                        className="bg-white/5 hover:bg-white/10 p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Réinitialiser"
                    >
                        <RotateCw size={14} />
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef} 
                className="w-full bg-[#05070f] rounded-xl border border-gray-850 cursor-grab active:cursor-grabbing overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <canvas ref={canvasRef} className="block" />
            </div>

            <p className="text-[10px] text-gray-500 mt-3 text-center">
                💡 Clic-glissez pour faire pivoter le repère 3D. Molette de souris pour zoomer.
            </p>
        </div>
    );
}
