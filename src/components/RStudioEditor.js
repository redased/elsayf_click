'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useStreamingChat } from '@/lib/useStreamingChat';
import Editor from '@monaco-editor/react';
import {
    Play, Bot, MessageSquare, X, ChevronDown,
    MoreHorizontal, BarChart2, Database, HelpCircle, Package,
    FolderOpen, Settings, RefreshCw, Trash2, Info, Terminal, Brain,
    FilePlus, Save, Loader2
} from 'lucide-react';

// ─── ChatMessage with collapsible reasoning ───────────────────────────────────
function ChatMessage({ msg, accentColor = '#a78bfa', label = 'Z' }) {
    const [showReasoning, setShowReasoning] = useState(false);
    const isAssistant = msg.role === 'assistant';

    const renderContent = (text) => ({
        __html: (text || '')
            .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${accentColor}">$1</strong>`)
            .replace(/`([^`\n]+)`/g, '<code style="background:#3c3c3c;color:#ce9178;padding:1px 4px;border-radius:3px;font-size:10px">$1</code>')
            .replace(/\n/g, '<br />')
    });

    return (
        <div className="flex gap-2">
            <div
                className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5"
                style={{ background: isAssistant ? accentColor : '#569cd6', color: isAssistant ? '#000' : '#fff' }}
            >
                {isAssistant ? label : 'U'}
            </div>
            <div className="flex-1 min-w-0">
                {/* Reasoning block */}
                {isAssistant && msg.reasoning && (
                    <div className="mb-1.5">
                        <button
                            onClick={() => setShowReasoning(v => !v)}
                            className="flex items-center gap-1 text-[9px] text-[#858585] hover:text-[#aaaaaa] transition-colors"
                        >
                            <Brain size={10} />
                            <span>Raisonnement GLM-5</span>
                            <ChevronDown size={9} className={`transition-transform ${showReasoning ? 'rotate-180' : ''}`} />
                        </button>
                        {showReasoning && (
                            <div className="mt-1 p-2 bg-[#141414] border border-[#333] rounded text-[10px] text-[#777] font-mono leading-4 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {msg.reasoning}
                            </div>
                        )}
                    </div>
                )}
                {/* Main content */}
                <div
                    className="text-[11px] text-[#cccccc] leading-relaxed"
                    dangerouslySetInnerHTML={renderContent(msg.content)}
                />
            </div>
        </div>
    );
}

// ─── R Terminal Output Component ──────────────────────────────────────────────
function RConsole({ lines, isRunning }) {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    return (
        <div className="flex-1 overflow-y-auto p-2 font-mono text-[13px] bg-[#1a1a1a]">
            {lines.map((line, i) => (
                <div key={i} className={`leading-5 whitespace-pre-wrap ${line.type === 'input' ? 'text-[#569cd6]'
                    : line.type === 'error' ? 'text-[#f48771]'
                        : line.type === 'info' ? 'text-[#4ec9b0]'
                            : 'text-[#d4d4d4]'
                    }`}>
                    {line.type === 'input' && <span className="text-[#608b4e] select-none">&gt; </span>}
                    {line.text}
                </div>
            ))}
            {isRunning && (
                <div className="text-[#608b4e] animate-pulse">Exécution en cours...</div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

// ─── Main RStudio Editor Component ────────────────────────────────────────────
export default function RStudioEditor() {
    // ── File management state ─────────────────────────────────────────────────
    const [files, setFiles] = useState([]);           // [{ id, name, updatedAt }]
    const [activeFile, setActiveFile] = useState(null); // { id, name, content }
    const [unsaved, setUnsaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [creatingFile, setCreatingFile] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const newFileInputRef = useRef(null);

    // ── Editor / UI state ─────────────────────────────────────────────────────
    const [consoleLines, setConsoleLines] = useState([
        { type: 'info', text: 'R version 4.4.3 (2025-02-28) -- "Trophy Case"' },
        { type: 'info', text: "Type 'q()' pour quitter R." },
        { type: 'info', text: '' },
        { type: 'info', text: 'Bienvenue dans R Studio Web — Elsayf Platform' },
        { type: 'info', text: '──────────────────────────────────────────────' },
    ]);
    const [isRunning, setIsRunning] = useState(false);
    const [plotImage, setPlotImage] = useState(null);
    const [rightPanel, setRightPanel] = useState('ai');       // 'ai' | 'env' | 'help'
    const [bottomPanel, setBottomPanel] = useState('console'); // 'console' | 'output' | 'plots'
    const [showEnvVars] = useState([
        { name: 'data', type: 'num', value: '[1] 23 45 12 67 34 89 56 78 90 11' },
        { name: 'model', type: 'lm', value: 'List of 12' },
        { name: 'x', type: 'int', value: '[1:10]' },
        { name: 'y', type: 'num', value: '[1:10]' },
    ]);

    const code = activeFile?.content ?? '';

    // ── AI Chat (streaming) ───────────────────────────────────────────────────
    const {
        messages: chatMessages,
        isLoading: isChatLoading,
        userInput: userMessage,
        setUserInput: setUserMessage,
        sendMessage: sendMessageStream,
    } = useStreamingChat(
        '/api/rstat/chat',
        'Bonjour ! Je suis votre assistant R sur Elsayf. Je peux vous aider avec **R, tidyverse, ggplot2, statistiques et finance quantitative**. Que voulez-vous analyser ?'
    );
    const chatBottomRef = useRef(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const sendMessage = () => sendMessageStream(code);

    // ── Load files from DB ────────────────────────────────────────────────────
    const loadFiles = useCallback(async () => {
        setLoadingFiles(true);
        try {
            const res = await fetch('/api/user/files?language=r');
            if (res.ok) {
                const data = await res.json();
                setFiles(data.files || []);
            }
        } catch { /* silently ignore */ }
        setLoadingFiles(false);
    }, []);

    useEffect(() => { loadFiles(); }, [loadFiles]);

    // ── Open a file (load full content) ──────────────────────────────────────
    const openFile = async (file) => {
        if (activeFile?.id === file.id) return;
        try {
            const res = await fetch('/api/user/files', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: file.id }),
            });
            if (res.ok) {
                const data = await res.json();
                setActiveFile({ id: data.file.id, name: data.file.name, content: data.file.content });
                setUnsaved(false);
            }
        } catch { /* silently ignore */ }
    };

    // ── Save current file ─────────────────────────────────────────────────────
    const handleSave = useCallback(async () => {
        if (!activeFile || saving) return;
        setSaving(true);
        try {
            const res = await fetch('/api/user/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: activeFile.name, content: activeFile.content, language: 'r' }),
            });
            if (res.ok) {
                setUnsaved(false);
                await loadFiles();
            }
        } catch { /* silently ignore */ }
        setSaving(false);
    }, [activeFile, saving, loadFiles]);

    // ── Ctrl+S shortcut ───────────────────────────────────────────────────────
    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleSave]);

    // ── Create new file ───────────────────────────────────────────────────────
    const createFile = async () => {
        let name = newFileName.trim();
        if (!name) return;
        if (!name.toLowerCase().endsWith('.r') && !name.includes('.')) {
            name = name + '.R';
        }
        try {
            const res = await fetch('/api/user/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, content: '# Nouveau fichier R\n', language: 'r' }),
            });
            if (res.ok) {
                const data = await res.json();
                setActiveFile({ id: data.file.id, name: data.file.name, content: data.file.content });
                setUnsaved(false);
                setCreatingFile(false);
                setNewFileName('');
                await loadFiles();
            }
        } catch { /* silently ignore */ }
    };

    // ── Delete a file ─────────────────────────────────────────────────────────
    const deleteFile = async (file, e) => {
        e.stopPropagation();
        if (!confirm(`Supprimer "${file.name}" ?`)) return;
        try {
            await fetch(`/api/user/files?id=${file.id}`, { method: 'DELETE' });
            if (activeFile?.id === file.id) setActiveFile(null);
            await loadFiles();
        } catch { /* silently ignore */ }
    };

    // ── Focus new file input when visible ────────────────────────────────────
    useEffect(() => {
        if (creatingFile) newFileInputRef.current?.focus();
    }, [creatingFile]);

    // ── Run R code ────────────────────────────────────────────────────────────
    const runCode = async () => {
        if (isRunning || !code.trim()) return;
        setIsRunning(true);
        setConsoleLines(prev => [...prev,
            { type: 'input', text: `source("${activeFile?.name || 'script.R'}")` },
        ]);

        try {
            const res = await fetch('/api/rstat/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (data.error) {
                setConsoleLines(prev => [...prev, { type: 'error', text: data.error }]);
            } else {
                const lines = (data.output || '').split('\n');
                if (lines.some(l => l.trim())) {
                    setConsoleLines(prev => [...prev, ...lines.map(t => ({ type: 'output', text: t }))]);
                }
                if (data.plot) {
                    setPlotImage(data.plot);
                    setBottomPanel('plots');
                    setConsoleLines(prev => [...prev, { type: 'info', text: '📊 Graphique généré → onglet Graphiques' }]);
                }
            }
        } catch (err) {
            setConsoleLines(prev => [...prev, { type: 'error', text: `Erreur réseau: ${err.message}` }]);
        } finally {
            setIsRunning(false);
        }
    };

    const clearConsole = () => {
        setConsoleLines([{ type: 'info', text: 'Console effacée.' }]);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="flex w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-sans text-sm overflow-hidden select-none">

            {/* ── Menu Bar ─────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-[#3c3c3c] flex items-center px-3 gap-1 text-[11px] text-[#cccccc] z-10 border-b border-[#2b2b2b] shrink-0">
                {['Fichier', 'Édition', 'Code', 'Affichage', 'Graphiques', 'Session', 'Debug', 'Outils', 'Aide'].map(m => (
                    <button key={m} className="px-2 py-0.5 hover:bg-[#4c4c4c] rounded text-[11px]">{m}</button>
                ))}
                <div className="ml-auto flex items-center gap-3 text-[#858585] text-[10px]">
                    <span className="text-[#4ec9b0]">R 4.4.3</span>
                    <span>Project: elsayf-rstat</span>
                </div>
            </div>

            {/* ── Activity Bar ─────────────────────────────────────── */}
            <div className="w-12 flex flex-col items-center pt-11 pb-4 bg-[#2c2c2c] gap-5 border-r border-[#2b2b2b] shrink-0">
                <div title="Explorer" className="cursor-pointer text-white border-l-2 border-[#4ec9b0] pl-2 pr-3"><FolderOpen size={22} /></div>
                <div title="Graphiques" className="cursor-pointer text-[#858585] hover:text-white px-3"><BarChart2 size={22} /></div>
                <div title="Packages" className="cursor-pointer text-[#858585] hover:text-white px-3"><Package size={22} /></div>
                <div title="Base de données" className="cursor-pointer text-[#858585] hover:text-white px-3"><Database size={22} /></div>
                <div title="Aide" className="cursor-pointer text-[#858585] hover:text-white px-3"><HelpCircle size={22} /></div>
                <div title="Paramètres" className="mt-auto cursor-pointer text-[#858585] hover:text-white px-3"><Settings size={22} /></div>
            </div>

            {/* ── File Explorer ─────────────────────────────────────── */}
            <div className="w-56 bg-[#252526] flex flex-col border-r border-[#2b2b2b] pt-7 hidden md:flex shrink-0">
                <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-[#bbbbbb] flex justify-between items-center">
                    <span>MES FICHIERS R</span>
                    <button
                        onClick={() => setCreatingFile(true)}
                        title="Nouveau fichier"
                        className="text-[#858585] hover:text-[#4ec9b0] transition-colors"
                    >
                        <FilePlus size={13} />
                    </button>
                </div>

                {/* Project folder label */}
                <div className="px-3 py-1 flex items-center gap-1.5 text-[#cccccc] text-[11px] font-semibold cursor-pointer hover:bg-[#2a2d2e]">
                    <ChevronDown size={12} />
                    <FolderOpen size={14} className="text-[#dcb67a]" />
                    ELSAYF-RSTAT
                </div>

                {/* Inline new file input */}
                {creatingFile && (
                    <div className="pl-8 pr-3 py-1">
                        <input
                            ref={newFileInputRef}
                            value={newFileName}
                            onChange={e => setNewFileName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') createFile();
                                if (e.key === 'Escape') { setCreatingFile(false); setNewFileName(''); }
                            }}
                            onBlur={() => { if (!newFileName.trim()) { setCreatingFile(false); setNewFileName(''); } }}
                            placeholder="nom.R"
                            className="w-full bg-[#3c3c3c] text-white text-[11px] px-1.5 py-0.5 rounded border border-[#4ec9b0] outline-none"
                        />
                    </div>
                )}

                {/* File list */}
                {loadingFiles ? (
                    <div className="pl-8 py-2 text-[11px] text-[#858585] flex items-center gap-2">
                        <Loader2 size={11} className="animate-spin" /> Chargement...
                    </div>
                ) : files.length === 0 ? (
                    <div className="pl-8 py-2 text-[11px] text-[#555] italic">Aucun fichier</div>
                ) : (
                    files.map(f => (
                        <div
                            key={f.id}
                            onClick={() => openFile(f)}
                            className={`pl-8 pr-3 py-0.5 flex items-center justify-between cursor-pointer text-[12px] group ${activeFile?.id === f.id ? 'bg-[#37373d] text-[#4ec9b0]' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}
                        >
                            <span className="flex items-center gap-1.5 truncate">
                                <span>📄</span>
                                <span className="truncate">{f.name}</span>
                                {activeFile?.id === f.id && unsaved && (
                                    <span className="text-orange-400 shrink-0">●</span>
                                )}
                            </span>
                            <button
                                onClick={(e) => deleteFile(f, e)}
                                className="opacity-0 group-hover:opacity-100 text-[#858585] hover:text-[#f48771] transition-all shrink-0 ml-1"
                            >
                                <Trash2 size={11} />
                            </button>
                        </div>
                    ))
                )}

                {/* Packages section */}
                <div className="border-t border-[#2b2b2b] mt-2 pt-2 px-3">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#858585] mb-1">PACKAGES</div>
                    {['tidyverse', 'ggplot2', 'dplyr', 'caret', 'quantmod'].map(pkg => (
                        <div key={pkg} className="text-[11px] text-[#858585] py-0.5 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4ec9b0]" />
                            {pkg}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Center: Editor + Console ───────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 pt-7 overflow-hidden">

                {/* Editor tab bar + Run button */}
                <div className="flex items-center justify-between bg-[#2d2d2d] border-b border-[#2b2b2b] pr-3 shrink-0">
                    <div className="flex overflow-x-auto">
                        {activeFile ? (
                            <div className="px-4 py-1.5 flex items-center gap-2 cursor-pointer text-[12px] min-w-fit border-r border-[#2b2b2b] relative bg-[#1e1e1e] text-white border-t-2 border-t-[#4ec9b0]">
                                <span>📄</span>
                                {activeFile.name}
                                {unsaved && <span className="text-orange-400 text-[10px]">●</span>}
                            </div>
                        ) : (
                            <div className="px-4 py-1.5 text-[12px] text-[#555] italic">
                                Aucun fichier ouvert
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Save button */}
                        <button
                            onClick={handleSave}
                            disabled={!activeFile || !unsaved || saving}
                            title="Enregistrer (Ctrl+S)"
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border transition-colors ${activeFile && unsaved ? 'border-[#4ec9b0] text-[#4ec9b0] hover:bg-[#4ec9b020]' : 'border-[#333] text-[#555] cursor-default'}`}
                        >
                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                            <span>Enregistrer</span>
                        </button>

                        <button
                            onClick={runCode}
                            disabled={isRunning || !activeFile}
                            className="flex items-center gap-1.5 bg-[#4ec9b0] hover:bg-[#3bb89e] disabled:opacity-50 text-black px-3 py-1 rounded text-[11px] font-semibold transition-colors"
                        >
                            {isRunning
                                ? <><RefreshCw size={13} className="animate-spin" /> Exécution...</>
                                : <><Play size={13} fill="currentColor" /> Exécuter</>
                            }
                        </button>
                        <button
                            title="Exécuter la sélection (Ctrl+Enter)"
                            className="text-[11px] text-[#858585] hover:text-white px-2 py-1 rounded hover:bg-[#3c3c3c] transition-colors border border-[#3c3c3c]"
                        >
                            Source
                        </button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden" style={{ flexBasis: '65%' }}>
                    {activeFile ? (
                        <Editor
                            height="100%"
                            defaultLanguage="r"
                            theme="vs-dark"
                            value={code}
                            onChange={(v) => {
                                setActiveFile(prev => prev ? { ...prev, content: v ?? '' } : prev);
                                setUnsaved(true);
                            }}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 13,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontFamily: "'Fira Code', 'Consolas', monospace",
                                fontLigatures: true,
                                padding: { top: 10 },
                                wordWrap: 'on',
                                tabSize: 2,
                                renderLineHighlight: 'line',
                            }}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#555] bg-[#1e1e1e]">
                            <FolderOpen size={48} className="mb-4 opacity-30" />
                            <p className="text-[13px] mb-1">Aucun fichier ouvert</p>
                            <p className="text-[11px] text-[#444]">Créez un fichier avec le bouton <FilePlus size={11} className="inline" /> ou ouvrez-en un dans l&apos;explorateur</p>
                        </div>
                    )}
                </div>

                {/* ── Bottom Panel: Console / Output / Plots ──────────── */}
                <div className="flex flex-col border-t border-[#2b2b2b]" style={{ flexBasis: '35%', minHeight: '120px' }}>
                    {/* Panel tabs */}
                    <div className="flex items-center bg-[#2d2d2d] border-b border-[#2b2b2b] px-2 shrink-0">
                        {[
                            { id: 'console', label: 'Console', icon: <Terminal size={12} /> },
                            { id: 'output', label: 'Sortie', icon: <Info size={12} /> },
                            { id: 'plots', label: 'Graphiques', icon: <BarChart2 size={12} /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setBottomPanel(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors ${bottomPanel === tab.id
                                    ? 'border-[#4ec9b0] text-white'
                                    : 'border-transparent text-[#858585] hover:text-[#cccccc]'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center gap-1">
                            <button onClick={clearConsole} title="Effacer la console" className="p-1 text-[#858585] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Console content */}
                    {bottomPanel === 'console' && (
                        <RConsole lines={consoleLines} isRunning={isRunning} />
                    )}
                    {bottomPanel === 'output' && (
                        <div className="flex-1 p-3 overflow-y-auto text-[12px] font-mono text-[#858585] bg-[#1a1a1a]">
                            {consoleLines.filter(l => l.type === 'output').map((l, i) => (
                                <div key={i} className="text-[#d4d4d4]">{l.text}</div>
                            ))}
                            {consoleLines.filter(l => l.type === 'output').length === 0 && (
                                <span className="italic">Aucune sortie encore. Exécutez du code R.</span>
                            )}
                        </div>
                    )}
                    {bottomPanel === 'plots' && (
                        <div className="flex-1 bg-[#1a1a1a] overflow-auto flex flex-col">
                            {plotImage ? (
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center justify-between px-3 py-1 border-b border-[#2b2b2b] shrink-0">
                                        <span className="text-[10px] text-[#4ec9b0] font-mono">Plot 1</span>
                                        <div className="flex gap-2">
                                            <a href={plotImage} download="rplot.png"
                                                className="text-[10px] text-[#858585] hover:text-white px-2 py-0.5 rounded hover:bg-[#3c3c3c] transition-colors">
                                                ↓ Exporter PNG
                                            </a>
                                            <button onClick={() => setPlotImage(null)}
                                                className="text-[10px] text-[#858585] hover:text-[#f48771] px-1 rounded transition-colors">
                                                <X size={11} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-2 overflow-auto">
                                        <img
                                            src={plotImage}
                                            alt="R Plot"
                                            className="max-w-full max-h-full object-contain rounded"
                                            style={{ imageRendering: 'crisp-edges' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-[#858585] text-[12px]">
                                    <div className="text-center">
                                        <BarChart2 size={36} className="mx-auto mb-2 opacity-25" />
                                        <p className="text-[11px]">Exécutez du code R avec un graphique</p>
                                        <p className="text-[10px] mt-1 text-[#555]">ggplot2, plot(), barplot(), hist()...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Status bar */}
                <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] justify-between shrink-0">
                    <div className="flex gap-4 items-center">
                        <span className="font-semibold">R 4.4.3</span>
                        <span>elsayf-rstat</span>
                        <span>{isRunning ? '⏳ Exécution...' : '✓ Prêt'}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1"><Bot size={11} /> AI Actif</span>
                        <span>UTF-8</span>
                        <span>{activeFile?.name || '—'}</span>
                    </div>
                </div>
            </div>

            {/* ── Right Panel ───────────────────────────────────────── */}
            <div className="w-80 bg-[#252526] border-l border-[#2b2b2b] flex flex-col shrink-0 pt-7">

                {/* Right panel tabs */}
                <div className="flex border-b border-[#2b2b2b] bg-[#2d2d2d] shrink-0">
                    {[
                        { id: 'ai', label: 'AI R', icon: <Bot size={12} /> },
                        { id: 'env', label: 'Environnement', icon: <Database size={12} /> },
                        { id: 'help', label: 'Aide', icon: <HelpCircle size={12} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setRightPanel(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium border-b-2 transition-colors ${rightPanel === tab.id
                                ? 'border-[#4ec9b0] text-white'
                                : 'border-transparent text-[#858585] hover:text-white'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── AI Chat Panel ─────────────────────────────────── */}
                {rightPanel === 'ai' && (
                    <>
                        <div className="px-3 py-2 border-b border-[#2b2b2b] flex items-center justify-between bg-[#252526]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ec9b0] flex items-center gap-1.5">
                                <Bot size={13} /> Assistant R
                            </span>
                            <span className="text-[9px] bg-green-900 text-green-300 px-1.5 py-0.5 rounded border border-green-700">ONLINE</span>
                        </div>

                        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#1e1e1e]">
                            {chatMessages.map((msg, i) => (
                                <ChatMessage key={i} msg={msg} accentColor="#4ec9b0" label="R" />
                            ))}
                            {isChatLoading && (
                                <div className="flex gap-2 animate-pulse">
                                    <div className="w-6 h-6 rounded bg-[#4ec9b0] flex items-center justify-center text-black font-bold text-[10px] shrink-0">R</div>
                                    <div className="text-[11px] text-[#858585] pt-0.5">GLM-5 réfléchit...</div>
                                </div>
                            )}
                            <div ref={chatBottomRef} />
                        </div>

                        <div className="p-3 border-t border-[#2b2b2b] bg-[#252526]">
                            <div className="relative">
                                <textarea
                                    value={userMessage}
                                    onChange={e => setUserMessage(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Question sur votre code R..."
                                    className="w-full bg-[#3c3c3c] text-white text-[11px] rounded p-2 pr-7 focus:outline-none border border-[#3c3c3c] focus:border-[#4ec9b0] resize-none h-14"
                                />
                                <button
                                    onClick={sendMessage}
                                    className={`absolute right-2 bottom-2 ${userMessage.trim() ? 'text-[#4ec9b0] cursor-pointer hover:text-white' : 'text-[#555] cursor-default'}`}
                                >
                                    <MessageSquare size={13} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Environment Panel ─────────────────────────────── */}
                {rightPanel === 'env' && (
                    <div className="flex-1 overflow-y-auto bg-[#1e1e1e]">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#858585] border-b border-[#2b2b2b] flex items-center justify-between">
                            <span>Espace de travail</span>
                            <button className="hover:text-white"><RefreshCw size={11} /></button>
                        </div>
                        <div className="p-2">
                            <div className="text-[10px] text-[#569cd6] font-semibold mb-1 px-1">Global Environment</div>
                            {showEnvVars.map(v => (
                                <div key={v.name} className="flex items-center justify-between px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer">
                                    <div>
                                        <span className="text-[11px] text-[#d4d4d4] font-mono">{v.name}</span>
                                        <span className="text-[10px] text-[#858585] ml-2">{v.type}</span>
                                    </div>
                                    <span className="text-[10px] text-[#ce9178] font-mono truncate max-w-24">{v.value}</span>
                                </div>
                            ))}
                            {consoleLines.filter(l => l.type === 'output').length > 0 && (
                                <div className="mt-2 border-t border-[#2b2b2b] pt-2">
                                    <div className="text-[10px] text-[#858585] italic px-1">
                                        Exécutez du code pour mettre à jour l&apos;environnement
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Help Panel ────────────────────────────────────── */}
                {rightPanel === 'help' && (
                    <div className="flex-1 overflow-y-auto bg-[#1e1e1e] p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#858585] mb-3">Aide R</div>
                        {[
                            { fn: 'mean(x)', desc: 'Calcule la moyenne' },
                            { fn: 'sd(x)', desc: 'Écart-type' },
                            { fn: 'lm(y ~ x)', desc: 'Régression linéaire' },
                            { fn: 'summary(obj)', desc: 'Résumé statistique' },
                            { fn: 'ggplot(data, aes())', desc: 'Créer un graphique' },
                            { fn: 'read.csv("file")', desc: 'Lire un CSV' },
                            { fn: 'dplyr::filter()', desc: 'Filtrer des lignes' },
                            { fn: 'dplyr::mutate()', desc: 'Créer une colonne' },
                            { fn: 'cor(x, y)', desc: 'Corrélation' },
                            { fn: 'quantile(x)', desc: 'Quantiles' },
                        ].map(item => (
                            <div key={item.fn} className="mb-2 p-2 bg-[#252526] rounded border border-[#2b2b2b] hover:border-[#4ec9b0] cursor-pointer transition-colors">
                                <div className="font-mono text-[11px] text-[#4ec9b0]">{item.fn}</div>
                                <div className="text-[10px] text-[#858585] mt-0.5">{item.desc}</div>
                            </div>
                        ))}
                        <div className="mt-3 p-2 bg-[#1a3040] rounded border border-[#4ec9b0]/20">
                            <div className="text-[10px] text-[#4ec9b0] font-semibold mb-1">💡 Astuce</div>
                            <div className="text-[10px] text-[#858585]">Posez une question à l&apos;assistant AI pour obtenir de l&apos;aide sur n&apos;importe quelle fonction R.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
