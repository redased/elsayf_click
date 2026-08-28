'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Terminal, Shield, Copy, Check, ChevronDown, ChevronUp, Zap } from 'lucide-react';

/**
 * CyberTerminal — Terminal interactif style Windows/PowerShell
 * avec auto-typing de commandes pour les cours de cybersécurité.
 *
 * Usage dans le markdown des leçons :
 * ```cyberterminal
 * {
 *   "title": "Sécurisation SSH",
 *   "os": "linux",       // "linux" | "windows" | "powershell"
 *   "steps": [
 *     {
 *       "command": "sudo nano /etc/ssh/sshd_config",
 *       "output": "# Configuration SSH ouverte dans l'éditeur...\nPort 2222\nPermitRootLogin no\nPasswordAuthentication no",
 *       "explanation": "On ouvre la configuration SSH pour durcir le service."
 *     },
 *     {
 *       "command": "sudo systemctl restart sshd",
 *       "output": "● sshd.service - OpenBSD Secure Shell server\n   Loaded: loaded\n   Active: active (running)",
 *       "explanation": "Redémarrage du service SSH avec la nouvelle configuration."
 *     }
 *   ]
 * }
 * ```
 */

const OS_THEMES = {
    linux: {
        bg: 'bg-[#0d1117]',
        headerBg: 'bg-[#161b22]',
        headerBorder: 'border-[#30363d]',
        prompt: (user = 'root', host = 'server') => (
            <span className="font-mono">
                <span className="text-emerald-400 font-bold">{user}@{host}</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-400 font-bold">~</span>
                <span className="text-gray-400">$ </span>
            </span>
        ),
        title: '🐧 Terminal Linux — Bash',
        icon: '●',
        dotColors: ['bg-red-500', 'bg-yellow-500', 'bg-green-500'],
    },
    windows: {
        bg: 'bg-[#0c0c0c]',
        headerBg: 'bg-[#1f1f1f]',
        headerBorder: 'border-[#3a3a3a]',
        prompt: () => (
            <span className="font-mono">
                <span className="text-gray-300">C:\Users\Admin&gt; </span>
            </span>
        ),
        title: '⬛ Invite de commandes — CMD',
        icon: '■',
        dotColors: ['bg-gray-600', 'bg-gray-600', 'bg-gray-600'],
    },
    powershell: {
        bg: 'bg-[#012456]',
        headerBg: 'bg-[#01326e]',
        headerBorder: 'border-[#1a4d8f]',
        prompt: () => (
            <span className="font-mono">
                <span className="text-yellow-300">PS</span>
                <span className="text-white"> C:\Security&gt; </span>
            </span>
        ),
        title: '🔷 Windows PowerShell',
        icon: '▶',
        dotColors: ['bg-red-400', 'bg-yellow-400', 'bg-green-400'],
    },
};

// Coloration syntaxique simplifiée pour les outputs
function colorizeOutput(text) {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
        let className = 'text-gray-300';
        if (line.startsWith('✅') || line.startsWith('Active: active') || line.includes('SUCCESS') || line.includes('running')) {
            className = 'text-emerald-400';
        } else if (line.startsWith('❌') || line.startsWith('FAILED') || line.includes('ERROR') || line.includes('denied')) {
            className = 'text-red-400';
        } else if (line.startsWith('⚠') || line.startsWith('WARNING') || line.includes('warning')) {
            className = 'text-yellow-400';
        } else if (line.startsWith('#') || line.startsWith('//') || line.startsWith('--')) {
            className = 'text-gray-500 italic';
        } else if (line.startsWith('●') || line.startsWith('Loaded:') || line.startsWith('   ')) {
            className = 'text-cyan-400';
        }
        return <div key={i} className={className}>{line || '\u00A0'}</div>;
    });
}

function parseCyberTerminalConfig(config) {
    if (!config) return null;
    if (typeof config === 'object') return config;

    try {
        return JSON.parse(config);
    } catch (e1) {
        try {
            // Fix unescaped single backslashes (e.g. C:\Windows -> C:\\Windows)
            const cleaned = config.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
            return JSON.parse(cleaned);
        } catch (e2) {
            try {
                // Fallback for JS object literal syntax
                const fn = new Function(`return (${config})`);
                return fn();
            } catch (e3) {
                throw e1;
            }
        }
    }
}

export default function CyberTerminal({ config }) {
    let parsed = null;
    try {
        parsed = parseCyberTerminalConfig(config);
    } catch (e) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl my-6 text-xs font-mono">
                ❌ Erreur CyberTerminal: {e.message}
            </div>
        );
    }

    const title = parsed.title || 'Terminal Interactif';
    const os = parsed.os || 'linux';
    const steps = parsed.steps || [];
    const theme = OS_THEMES[os] || OS_THEMES.linux;

    const [currentStep, setCurrentStep] = useState(-1); // -1 = pas commencé
    const [typedChars, setTypedChars] = useState(0);
    const [showOutput, setShowOutput] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50); // ms par caractère
    const [completedSteps, setCompletedSteps] = useState([]);
    const [showExplanation, setShowExplanation] = useState(true);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef(null);
    const typingInterval = useRef(null);

    const activeStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
    const command = activeStepData?.command || '';

    // Nettoyage du timer
    useEffect(() => {
        return () => {
            if (typingInterval.current) clearInterval(typingInterval.current);
        };
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [typedChars, showOutput, currentStep, completedSteps]);

    // Typing animation
    const startTyping = useCallback(() => {
        if (!command) return;
        setIsPlaying(true);
        setShowOutput(false);
        setTypedChars(0);

        let charIdx = 0;
        typingInterval.current = setInterval(() => {
            charIdx++;
            setTypedChars(charIdx);

            if (charIdx >= command.length) {
                clearInterval(typingInterval.current);
                // Petit délai puis afficher l'output
                setTimeout(() => {
                    setShowOutput(true);
                    setIsPlaying(false);
                    setCompletedSteps(prev => [...prev, currentStep]);
                }, 400);
            }
        }, speed);
    }, [command, speed, currentStep]);

    // Lancer l'exécution
    const handlePlay = () => {
        if (currentStep === -1) {
            setCurrentStep(0);
            setTimeout(() => {
                // On doit refaire car currentStep n'est pas encore mis à jour
            }, 50);
        }
    };

    // Quand le step change, lancer le typing
    useEffect(() => {
        if (currentStep >= 0 && currentStep < steps.length && !completedSteps.includes(currentStep)) {
            setTypedChars(0);
            setShowOutput(false);
            const timer = setTimeout(() => startTyping(), 300);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    // Step suivant
    const handleNext = () => {
        if (typingInterval.current) clearInterval(typingInterval.current);
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    // Skip : finir l'étape instantanément
    const handleSkip = () => {
        if (typingInterval.current) clearInterval(typingInterval.current);
        setTypedChars(command.length);
        setShowOutput(true);
        setIsPlaying(false);
        setCompletedSteps(prev => [...prev, currentStep]);
    };

    // Restart
    const handleRestart = () => {
        if (typingInterval.current) clearInterval(typingInterval.current);
        setCurrentStep(-1);
        setTypedChars(0);
        setShowOutput(false);
        setIsPlaying(false);
        setCompletedSteps([]);
    };

    // Auto-play all
    const handleAutoPlayAll = () => {
        handleRestart();
        setTimeout(() => {
            setCurrentStep(0);
        }, 200);
    };

    // Copier commande
    const handleCopy = () => {
        const allCmds = steps.map(s => s.command).join('\n');
        navigator.clipboard.writeText(allCmds);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Quand une étape est terminée et qu'il reste des étapes, passer automatiquement
    useEffect(() => {
        if (showOutput && completedSteps.includes(currentStep) && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 2000); // 2s de pause entre les commandes
            return () => clearTimeout(timer);
        }
    }, [showOutput, completedSteps, currentStep, steps.length]);

    const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

    return (
        <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 group">
            {/* ── Header barre titre ── */}
            <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-4 py-2.5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        {theme.dotColors.map((c, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${c} transition-all hover:scale-110`} />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                        <Shield size={14} className="text-cyan-400" />
                        <span className="text-xs text-gray-400 font-medium">{theme.title}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">{title}</span>
                    <button onClick={handleCopy} className="p-1 hover:bg-white/10 rounded transition-colors" title="Copier toutes les commandes">
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-gray-500" />}
                    </button>
                </div>
            </div>

            {/* ── Barre de progression ── */}
            <div className="h-0.5 bg-gray-800">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* ── Corps du terminal ── */}
            <div
                ref={terminalRef}
                className={`${theme.bg} p-5 font-mono text-sm leading-relaxed min-h-[200px] max-h-[500px] overflow-y-auto`}
                style={{ fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace" }}
            >
                {/* Commandes déjà complétées */}
                {completedSteps.filter(s => s < currentStep).map(stepIdx => {
                    const s = steps[stepIdx];
                    return (
                        <div key={`done-${stepIdx}`} className="mb-4">
                            <div className="flex items-start gap-0 flex-wrap">
                                {theme.prompt()}
                                <span className="text-green-300">{s.command}</span>
                            </div>
                            {s.output && (
                                <div className="mt-1 ml-0 text-xs leading-5 opacity-70">
                                    {colorizeOutput(s.output)}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Étape courante */}
                {currentStep >= 0 && currentStep < steps.length && (
                    <div className="mb-2">
                        <div className="flex items-start gap-0 flex-wrap">
                            {theme.prompt()}
                            <span className="text-green-300">
                                {command.substring(0, typedChars)}
                            </span>
                            {typedChars < command.length && (
                                <span className="inline-block w-2.5 h-5 bg-green-400 animate-pulse ml-px" />
                            )}
                        </div>
                        {showOutput && activeStepData.output && (
                            <div className="mt-2 ml-0 text-xs leading-5 animate-in fade-in duration-500">
                                {colorizeOutput(activeStepData.output)}
                            </div>
                        )}
                    </div>
                )}

                {/* État initial */}
                {currentStep === -1 && (
                    <div className="text-gray-500 text-xs">
                        <div className="mb-2">
                            <span className="text-cyan-500">╔══════════════════════════════════════════════════════════╗</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-cyan-500">║</span>
                            <span className="text-emerald-400 font-bold">  🛡️  {title}</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-cyan-500">║</span>
                            <span className="text-gray-400">  📋 {steps.length} commandes à exécuter</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-cyan-500">╚══════════════════════════════════════════════════════════╝</span>
                        </div>
                        <div className="flex items-start gap-0 flex-wrap">
                            {theme.prompt()}
                            <span className="inline-block w-2.5 h-5 bg-green-400 animate-pulse" />
                        </div>
                    </div>
                )}

                {/* Tout terminé */}
                {completedSteps.length === steps.length && steps.length > 0 && currentStep >= steps.length - 1 && showOutput && (
                    <div className="mt-4 pt-3 border-t border-green-500/20">
                        <div className="text-emerald-400 text-xs font-bold">
                            ✅ Toutes les commandes ont été exécutées avec succès !
                        </div>
                    </div>
                )}
            </div>

            {/* ── Barre de contrôles ── */}
            <div className={`${theme.headerBg} border-t ${theme.headerBorder} px-4 py-3 flex items-center justify-between flex-wrap gap-2`}>
                <div className="flex items-center gap-2">
                    {currentStep === -1 ? (
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg text-xs font-semibold hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                        >
                            <Play size={12} /> Exécuter
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleRestart}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-all"
                            >
                                <RotateCcw size={11} /> Relancer
                            </button>
                            {isPlaying && (
                                <button
                                    onClick={handleSkip}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-all"
                                >
                                    <SkipForward size={11} /> Skip
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Contrôle vitesse */}
                    <div className="flex items-center gap-2">
                        <Zap size={11} className="text-yellow-500" />
                        <input
                            type="range"
                            min="10"
                            max="120"
                            value={120 - speed + 10}
                            onChange={(e) => setSpeed(120 - parseInt(e.target.value) + 10)}
                            className="w-16 h-1 accent-cyan-500 cursor-pointer"
                            title="Vitesse d'écriture"
                        />
                    </div>

                    {/* Toggle explication */}
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all ${showExplanation ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                    >
                        💡 Explications
                    </button>

                    {/* Progress */}
                    <span className="text-[10px] text-gray-500 font-mono">
                        {completedSteps.length}/{steps.length}
                    </span>
                </div>
            </div>

            {/* ── Panneau d'explication ── */}
            {showExplanation && activeStepData?.explanation && showOutput && (
                <div className="bg-cyan-500/5 border-t border-cyan-500/20 px-5 py-3">
                    <div className="flex items-start gap-2">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-[10px]">💡</span>
                        </div>
                        <div>
                            <p className="text-xs text-cyan-300 font-semibold mb-0.5">
                                Étape {currentStep + 1}/{steps.length}
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {activeStepData.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
