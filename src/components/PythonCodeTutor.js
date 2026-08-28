'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, ArrowRight, ArrowLeft, RefreshCw, Keyboard, Code, Eye, Info } from 'lucide-react';

export default function PythonCodeTutor({ codeAndSteps }) {
    let parsed = null;
    try {
        parsed = typeof codeAndSteps === 'string' ? JSON.parse(codeAndSteps) : codeAndSteps;
    } catch (e) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl my-4 text-xs font-mono">
                Erreur de parsing JSON pour le tuteur de code : {e.message}
            </div>
        );
    }

    const title = parsed.title || 'Tuteur interactif Python';
    const code = parsed.code || '';
    const steps = parsed.steps || [];

    const [activeMode, setActiveMode] = useState('tutor'); // 'tutor' ou 'typing'
    
    // --- 1. Step-by-Step execution state ---
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const activeStep = steps[currentStepIdx] || { line: 0, explanation: '', variables: {} };

    const handleNextStep = () => {
        if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx(currentStepIdx + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStepIdx > 0) {
            setCurrentStepIdx(currentStepIdx - 1);
        }
    };

    // --- 2. Typing Game state ---
    const [charIndex, setCharIndex] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [isRobotActive, setIsRobotActive] = useState(false);
    const typingContainerRef = useRef(null);

    // Auto-indentation helper
    const getAutoIndent = (idx) => {
        let spaces = '';
        let i = idx;
        while (i < code.length && code[i] === ' ') {
            spaces += ' ';
            i++;
        }
        return spaces;
    };

    // Auto-complete suggestion detector
    const getSuggestion = () => {
        if (charIndex >= code.length) return null;
        
        const remaining = code.slice(charIndex);
        const keywords = ['print', 'def', 'return', 'for', 'while', 'import', 'from', 'in', 'if', 'else', 'elif'];
        
        for (const kw of keywords) {
            if (remaining.startsWith(kw)) {
                return kw;
            }
        }
        return null;
    };

    const activeSuggestion = getSuggestion();

    // Robot Auto-typer effect
    useEffect(() => {
        if (!isRobotActive || activeMode !== 'typing' || successMessage) return;

        const interval = setInterval(() => {
            const expectedChar = code[charIndex];
            
            // Check if suggestion is active, if so auto-complete it via tab simulation
            if (activeSuggestion) {
                setCharIndex(prev => prev + activeSuggestion.length);
                setErrorFlag(false);
                return;
            }

            let nextIdx = charIndex + 1;
            
            // If newline, skip any leading spaces (auto-indent)
            if (expectedChar === '\n') {
                const indent = getAutoIndent(nextIdx);
                nextIdx += indent.length;
            }

            setCharIndex(nextIdx);
            setErrorFlag(false);

            if (nextIdx >= code.length) {
                setSuccessMessage(true);
                setIsRobotActive(false);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isRobotActive, charIndex, activeMode, code, activeSuggestion, successMessage]);

    // Key interceptor for typing game
    useEffect(() => {
        if (activeMode !== 'typing' || successMessage) return;

        const handleKeyDown = (e) => {
            // Prevent scrolling on space or backspace
            if (e.key === ' ' || e.key === 'Backspace' || e.key === 'Tab') {
                e.preventDefault();
            }

            // Manually typing pauses the robot
            setIsRobotActive(false);

            const expectedChar = code[charIndex];
            
            // Handle Auto-complete via Tab key
            if (e.key === 'Tab' && activeSuggestion) {
                setCharIndex(prev => prev + activeSuggestion.length);
                setErrorFlag(false);
                return;
            }

            // Handle backspace (allow correction)
            if (e.key === 'Backspace' && charIndex > 0) {
                setCharIndex(prev => prev - 1);
                setErrorFlag(false);
                return;
            }

            // Check if key pressed matches expected char
            if (e.key === expectedChar || (expectedChar === '\n' && e.key === 'Enter')) {
                let nextIdx = charIndex + 1;
                
                // If it was a newline, skip any leading spaces (auto-indent)
                if (expectedChar === '\n') {
                    const indent = getAutoIndent(nextIdx);
                    nextIdx += indent.length;
                }

                setCharIndex(nextIdx);
                setErrorFlag(false);

                if (nextIdx >= code.length) {
                    setSuccessMessage(true);
                }
            } else if (!['Shift', 'Control', 'Alt', 'CapsLock', 'Meta'].includes(e.key)) {
                setErrorFlag(true);
                // Reset error flag after brief delay
                setTimeout(() => setErrorFlag(false), 500);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [charIndex, activeMode, code, activeSuggestion, successMessage]);

    // Reset typing game
    const handleResetTyping = () => {
        setCharIndex(0);
        setErrorFlag(false);
        setSuccessMessage(false);
        setIsRobotActive(false);
    };

    return (
        <div className="my-6 p-5 bg-[#0b0f19] border border-gray-800 rounded-2xl shadow-2xl relative select-none">
            {/* Header / Mode selectors */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-3 border-b border-gray-800">
                <div>
                    <h4 className="text-sm font-bold text-[#a78bfa] uppercase tracking-widest flex items-center gap-2">
                        <Code size={16} />
                        {title}
                    </h4>
                </div>
                {/* Tab select */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveMode('tutor')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                            activeMode === 'tutor'
                                ? 'bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30'
                                : 'bg-white/5 text-gray-400 border border-transparent hover:text-white'
                        }`}
                    >
                        <Eye size={14} />
                        Traceur de mémoire
                    </button>
                    <button
                        onClick={() => setActiveMode('typing')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                            activeMode === 'typing'
                                ? 'bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30'
                                : 'bg-white/5 text-gray-400 border border-transparent hover:text-white'
                        }`}
                    >
                        <Keyboard size={14} />
                        Jeu de frappe guidée
                    </button>
                </div>
            </div>

            {/* Mode 1: Step tutor memory tracer */}
            {activeMode === 'tutor' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left: Code Box */}
                    <div className="lg:col-span-3 bg-[#05070f] rounded-xl border border-gray-850 p-4 font-mono text-xs overflow-hidden relative">
                        <div className="absolute top-2 right-2 text-[10px] text-gray-600">Traceur Python</div>
                        <div className="space-y-1">
                            {code.split('\n').map((line, idx) => {
                                const isCurrentLine = activeStep.line === idx + 1;
                                return (
                                    <div 
                                        key={idx}
                                        className={`flex items-center gap-3 py-0.5 px-2 rounded transition-all ${
                                            isCurrentLine 
                                                ? 'bg-[#a78bfa]/15 text-white border-l-2 border-[#a78bfa]' 
                                                : 'text-gray-400 opacity-60'
                                        }`}
                                    >
                                        <span className="w-4 text-right text-[10px] text-gray-600 select-none">{idx + 1}</span>
                                        <pre className="flex-1 whitespace-pre">{line}</pre>
                                        {isCurrentLine && (
                                            <span className="text-[10px] bg-[#a78bfa]/20 text-[#a78bfa] px-1.5 py-0.2 rounded font-bold animate-pulse">LIGNE ACTIVE</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Control buttons */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
                            <button
                                onClick={handlePrevStep}
                                disabled={currentStepIdx === 0}
                                className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-xs text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all border border-gray-700/50"
                            >
                                <ArrowLeft size={13} />
                                Précédent
                            </button>
                            <span className="text-[11px] text-gray-500 font-bold">
                                Étape {currentStepIdx + 1} sur {steps.length}
                            </span>
                            <button
                                onClick={handleNextStep}
                                disabled={currentStepIdx === steps.length - 1}
                                className="bg-[#a78bfa] hover:bg-[#8b5cf6] disabled:opacity-30 disabled:hover:bg-[#a78bfa] text-xs text-black px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all"
                            >
                                Suivant
                                <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Memory & Explanation Panel */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Explanation card */}
                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 relative overflow-hidden flex-1">
                            <h5 className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Info size={12} />
                                Explication pas-à-pas
                            </h5>
                            <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                {activeStep.explanation}
                            </p>
                        </div>

                        {/* Memory Heap */}
                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
                            <h5 className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider mb-3">
                                🧠 Mémoire vive (Variables)
                            </h5>
                            {Object.keys(activeStep.variables || {}).length === 0 ? (
                                <div className="text-[10px] text-gray-500 italic py-6 text-center">
                                    Aucune variable initialisée en mémoire à cette étape.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(activeStep.variables).map(([name, val]) => (
                                        <div 
                                            key={name} 
                                            className="bg-[#05070f] border border-[#a78bfa]/20 rounded-lg p-2.5 flex items-center justify-between shadow-inner"
                                        >
                                            <span className="text-[11px] font-mono text-[#a78bfa] font-bold">{name}</span>
                                            <span className="text-xs font-mono text-white font-bold bg-[#a78bfa]/10 px-2 py-0.5 rounded border border-[#a78bfa]/10">
                                                {typeof val === 'string' ? `"${val}"` : String(val)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fake Console Output */}
                        {activeStep.console && (
                            <div className="bg-black border border-gray-900 rounded-xl p-3 font-mono text-xs text-green-400">
                                <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-1.5">Console de sortie</div>
                                <pre className="leading-tight">{activeStep.console}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mode 2: Typing game tutor */}
            {activeMode === 'typing' && (
                <div className="space-y-4">
                    {/* Instructions */}
                    <div className="bg-purple-950/20 border border-[#a78bfa]/20 p-4 rounded-xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-start gap-3">
                            <Keyboard className="text-[#a78bfa] shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="font-bold text-[#a78bfa] mb-1">Entraînez-vous à écrire ce code !</p>
                                <p className="text-gray-400 leading-relaxed">
                                    Cliquez n'importe où dans la fenêtre et commencez à taper. Le tuteur validera chaque touche et insérera automatiquement l'indentation (les espaces) après chaque retour à la ligne.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsRobotActive(prev => !prev)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                                isRobotActive 
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/35 hover:bg-red-500/30' 
                                    : 'bg-[#a78bfa]/25 text-[#a78bfa] border border-[#a78bfa]/35 hover:bg-[#a78bfa]/35'
                            }`}
                        >
                            <span>{isRobotActive ? '⏸️ Arrêter le robot' : '🤖 Lancer le robot'}</span>
                        </button>
                    </div>

                    {/* Game Canvas */}
                    <div 
                        ref={typingContainerRef}
                        tabIndex={0}
                        className={`bg-[#05070f] rounded-xl border p-5 font-mono text-xs leading-relaxed focus:outline-none transition-all relative min-h-[160px] flex flex-col justify-between ${
                            errorFlag ? 'border-red-500/40 shadow-lg shadow-red-500/5' : 'border-gray-800 focus:border-[#a78bfa]/40'
                        }`}
                    >
                        {/* Complete Overlay on Success */}
                        {successMessage ? (
                            <div className="absolute inset-0 bg-[#0b0f19]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-center p-6 z-10 animate-fade-in">
                                <span className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-3 animate-bounce">✓</span>
                                <h5 className="text-sm font-bold text-white mb-1">Félicitations !</h5>
                                <p className="text-xs text-gray-400 mb-4">Vous avez correctement tapé tout le code Python.</p>
                                <button
                                    onClick={handleResetTyping}
                                    className="bg-purple-600 hover:bg-purple-500 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all"
                                >
                                    <RefreshCw size={12} /> Réessayer
                                </button>
                            </div>
                        ) : null}

                        {/* Rendering of text highlighting cursor */}
                        <div className="whitespace-pre-wrap select-none leading-relaxed">
                            {code.split('').map((char, idx) => {
                                let className = 'text-gray-600 opacity-40';
                                if (idx < charIndex) {
                                    className = 'text-emerald-400 font-bold';
                                } else if (idx === charIndex) {
                                    className = 'bg-[#a78bfa]/20 text-white border-b border-[#a78bfa] font-bold animate-pulse';
                                }
                                return (
                                    <span key={idx} className={className}>
                                        {char === '\n' ? '↵\n' : char}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Auto-suggestion accelerator banner */}
                        {activeSuggestion && !successMessage && (
                            <div className="mt-6 pt-3 border-t border-gray-850 flex items-center justify-between text-[10px] text-gray-500 font-bold">
                                <span>Suggestion d'accélérateur :</span>
                                <span className="bg-[#a78bfa]/15 text-[#a78bfa] px-2 py-1 rounded border border-[#a78bfa]/30 animate-pulse">
                                    Pressez [Tab] pour autocompléter le mot-clé : <code className="font-mono bg-black px-1 rounded">{activeSuggestion}</code>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Progress tracking */}
                    {!successMessage && (
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Caractères saisis : {charIndex} / {code.length}</span>
                            <button
                                onClick={handleResetTyping}
                                className="text-gray-400 hover:text-white flex items-center gap-1.5"
                                title="Réinitialiser le jeu"
                            >
                                <RefreshCw size={13} />
                                <span>Recommencer</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
