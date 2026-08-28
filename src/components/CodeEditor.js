'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStreamingChat } from '@/lib/useStreamingChat';
import Editor from '@monaco-editor/react';
import TerminalComponent from './TerminalComponent';
import * as XLSX from 'xlsx';
import {
    Files, Search, GitBranch, MonitorPlay, Settings,
    X, MessageSquare, Bot, Play, Save,
    Brain, ChevronDown, FilePlus, Trash2, FileCode, Loader,
    FolderPlus, Folder, FolderOpen, ChevronRight, Upload, Table
} from 'lucide-react';

const DEFAULT_CODE = `# Bienvenue sur ton IDE Python Elsayf !
# Crée et sauvegarde tes fichiers depuis l'explorateur à gauche.

def welcome(name):
    return f"Hello {name}, prêt à coder ?"

print(welcome("Étudiant"))

for i in range(1, 6):
    print(f"  → Étape {i}")
`;

function ChatMessage({ msg, onApplyCode }) {
    const [showReasoning, setShowReasoning] = useState(false);
    const isAssistant = msg.role === 'assistant';

    const renderContent = (text) => {
        if (!text) return [];
        const parts = [];
        const codeBlockRegex = /```(?:python|py)?\n?([\s\S]*?)```/g;
        let last = 0, match;
        while ((match = codeBlockRegex.exec(text)) !== null) {
            if (match.index > last) {
                const prose = text.slice(last, match.index)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/`([^`\n]+)`/g, '<code style="background:#3c3c3c;color:#ce9178;padding:1px 4px;border-radius:3px;font-size:10px">$1</code>')
                    .replace(/\n/g, '<br />');
                parts.push(<span key={last} dangerouslySetInnerHTML={{ __html: prose }} />);
            }
            const codeContent = match[1];
            parts.push(
                <div key={match.index} className="my-2 rounded overflow-hidden border border-[#3c3c3c]">
                    <div className="flex justify-between items-center bg-[#2d2d2d] px-2 py-1">
                        <span className="text-[9px] text-[#858585] font-mono">python</span>
                        {onApplyCode && (
                            <button
                                onClick={() => onApplyCode(codeContent)}
                                className="text-[9px] bg-[#a78bfa] text-black px-2 py-0.5 rounded font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
                            >
                                ↑ Appliquer dans l'éditeur
                            </button>
                        )}
                    </div>
                    <pre className="bg-[#1e1e1e] p-2 text-[10px] text-[#ce9178] font-mono overflow-x-auto whitespace-pre-wrap leading-4">{codeContent}</pre>
                </div>
            );
            last = match.index + match[0].length;
        }
        if (last < text.length) {
            const prose = text.slice(last)
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`\n]+)`/g, '<code style="background:#3c3c3c;color:#ce9178;padding:1px 4px;border-radius:3px;font-size:10px">$1</code>')
                .replace(/\n/g, '<br />');
            parts.push(<span key={last} dangerouslySetInnerHTML={{ __html: prose }} />);
        }
        return parts;
    };

    return (
        <div className="flex gap-3">
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold text-xs shrink-0 ${isAssistant ? 'bg-[#a78bfa] text-black' : 'bg-gray-600 text-white'}`}>
                {isAssistant ? 'Z' : 'U'}
            </div>
            <div className="flex-1 min-w-0 text-xs text-gray-300 leading-relaxed pt-1">
                {isAssistant && msg.toolActions?.length > 0 && (
                    <div className="mb-2 space-y-1">
                        {msg.toolActions.map((action, i) => (
                            <div key={i} className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border ${
                                action.status === 'done' ? 'bg-green-900/20 border-green-700/40 text-green-400' :
                                action.status === 'running' ? 'bg-[#2d2d2d] border-[#444] text-[#a78bfa] animate-pulse' :
                                'bg-[#2d2d2d] border-[#444] text-[#888]'
                            }`}>
                                <span>{action.status === 'running' ? '⏳' : action.status === 'done' ? '✅' : 'ℹ️'}</span>
                                <span className="font-mono">{action.label}</span>
                            </div>
                        ))}
                    </div>
                )}
                {isAssistant && msg.reasoning && (
                    <div className="mb-2">
                        <button onClick={() => setShowReasoning(v => !v)} className="flex items-center gap-1 text-[9px] text-[#666] hover:text-[#999] transition-colors">
                            <Brain size={10} /><span>Raisonnement GLM-5</span>
                            <ChevronDown size={9} className={`transition-transform ${showReasoning ? 'rotate-180' : ''}`} />
                        </button>
                        {showReasoning && (
                            <div className="mt-1 p-2 bg-[#141414] border border-[#333] rounded text-[10px] text-[#666] font-mono leading-4 max-h-40 overflow-y-auto whitespace-pre-wrap">{msg.reasoning}</div>
                        )}
                    </div>
                )}
                <div>{renderContent(msg.content)}</div>
            </div>
        </div>
    );
}

export default function CodeEditor() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const terminalRef = useRef(null);

    // File & project management
    const [files, setFiles] = useState([]);
    const filesRef = useRef([]);
    const [projects, setProjects] = useState(['default']);
    const [expandedProjects, setExpandedProjects] = useState({ default: true });
    const [activeProject, setActiveProject] = useState('default');
    const [activeFile, setActiveFile] = useState(null); // { id, name, project }
    const [unsaved, setUnsaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [newFileName, setNewFileName] = useState('');
    const [showNewFile, setShowNewFile] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [showNewProject, setShowNewProject] = useState(false);
    const [uploadingExcel, setUploadingExcel] = useState(false);
    const excelInputRef = useRef(null);

    // Load file list
    const loadFiles = useCallback(async () => {
        try {
            const res = await fetch('/api/user/files?language=python');
            const data = await res.json();
            const f = data.files || [];
            setFiles(f);
            filesRef.current = f;
            if (data.projects?.length) {
                setProjects(data.projects);
                setExpandedProjects(prev => {
                    const next = { ...prev };
                    data.projects.forEach(p => { if (!(p in next)) next[p] = false; });
                    return next;
                });
            }
        } catch {}
        setLoadingFiles(false);
    }, []);

    useEffect(() => { loadFiles(); }, [loadFiles]);

    const { messages: chatMessages, isLoading: isChatLoading, userInput: userMessage,
        setUserInput: setUserMessage, sendMessage: sendMessageStream } = useStreamingChat(
        '/api/code/chat',
        "Bonjour ! Je peux lire, créer et modifier tes fichiers directement. Dis-moi ce que tu veux faire !",
        loadFiles
    );

    const sendMessage = () => sendMessageStream(code);

    // Ctrl+S to save
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    // Open a file
    const openFile = async (file) => {
        if (unsaved && !confirm('Modifications non sauvegardées. Continuer ?')) return;
        try {
            const res = await fetch('/api/user/files', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: file.id })
            });
            const data = await res.json();
            setCode(data.file.content);
            setActiveFile({ id: file.id, name: file.name, project: file.project });
            setActiveProject(file.project);
            setUnsaved(false);
        } catch {}
    };

    // Save current file
    const handleSave = async () => {
        if (!activeFile) {
            setShowNewFile(true);
            return;
        }
        setSaving(true);
        try {
            await fetch('/api/user/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: activeFile.name, content: code, language: 'python', project: activeFile.project })
            });
            setUnsaved(false);
            await loadFiles();
        } catch {}
        setSaving(false);
    };

    // Create new file (vide) dans le projet actif
    const createFile = async () => {
        let name = newFileName.trim();
        if (!name) return;
        if (!name.endsWith('.py')) name += '.py';
        try {
            const res = await fetch('/api/user/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, content: '', language: 'python', project: activeProject })
            });
            const data = await res.json();
            setCode('');
            setActiveFile({ id: data.file.id, name, project: activeProject });
            setUnsaved(false);
            setShowNewFile(false);
            setNewFileName('');
            await loadFiles();
        } catch {}
    };

    // Créer un nouveau projet
    const createProject = () => {
        const name = newProjectName.trim();
        if (!name) return;
        setProjects(prev => prev.includes(name) ? prev : [...prev, name]);
        setExpandedProjects(prev => ({ ...prev, [name]: true }));
        setActiveProject(name);
        setShowNewProject(false);
        setNewProjectName('');
    };

    // Supprimer un projet
    const deleteProject = async (project, e) => {
        e.stopPropagation();
        if (!confirm(`Supprimer le projet "${project}" et tous ses fichiers ?`)) return;
        await fetch(`/api/user/files?project=${encodeURIComponent(project)}`, { method: 'DELETE' });
        if (activeFile?.project === project) { setActiveFile(null); setCode(DEFAULT_CODE); }
        if (activeProject === project) setActiveProject('default');
        await loadFiles();
    };

    // Delete file
    const deleteFile = async (file, e) => {
        e.stopPropagation();
        if (!confirm(`Supprimer "${file.name}" ?`)) return;
        await fetch(`/api/user/files?id=${file.id}`, { method: 'DELETE' });
        if (activeFile?.id === file.id) {
            setActiveFile(null);
            setCode(DEFAULT_CODE);
            setUnsaved(false);
        }
        await loadFiles();
    };

    // Upload Excel → génère un script pandas
    const handleExcelUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingExcel(true);
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const csvData = XLSX.utils.sheet_to_csv(sheet);
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Aperçu des 3 premières lignes pour le contexte IA
            const preview = jsonData.slice(0, 3).map(row => row.join(', ')).join('\n');
            const columns = jsonData[0] || [];
            const baseName = file.name.replace(/\.[^/.]+$/, '');

            // Sauvegarder les données CSV comme fichier de données
            const csvFileName = `${baseName}_data.csv`;
            await fetch('/api/user/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: csvFileName,
                    content: csvData,
                    language: 'python',
                    project: activeProject
                })
            });

            // Générer un script d'analyse pandas
            const analysisScript = `import pandas as pd
import io

# Données importées depuis ${file.name}
CSV_DATA = """${csvData.slice(0, 5000)}"""

df = pd.read_csv(io.StringIO(CSV_DATA))

print("=== Aperçu des données ===")
print(df.head())
print(f"\\nDimensions: {df.shape[0]} lignes x {df.shape[1]} colonnes")
print("\\n=== Colonnes ===")
print(df.columns.tolist())
print("\\n=== Statistiques descriptives ===")
print(df.describe(include='all'))
print("\\n=== Valeurs manquantes ===")
print(df.isnull().sum())
`;

            const pyFileName = `analyse_${baseName}.py`;
            const res = await fetch('/api/user/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: pyFileName,
                    content: analysisScript,
                    language: 'python',
                    project: activeProject
                })
            });
            const data = await res.json();

            // Ouvrir le script généré dans l'éditeur
            setCode(analysisScript);
            setActiveFile({ id: data.file.id, name: pyFileName, project: activeProject });
            setUnsaved(false);
            await loadFiles();
        } catch (err) {
            console.error('Excel upload error:', err);
        } finally {
            setUploadingExcel(false);
            if (excelInputRef.current) excelInputRef.current.value = '';
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        try {
            const res = await fetch('/api/code/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: 'python' }),
            });
            const data = await res.json();
            terminalRef.current?.writeOutput(data.output || '');
        } catch (error) {
            terminalRef.current?.writeOutput(`Erreur: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    // Exécuter un fichier par nom depuis le terminal
    const handleRunFile = async (filename) => {
        const currentFiles = filesRef.current;
        if (filename === '__ls__') {
            if (currentFiles.length === 0) return 'Aucun fichier.';
            return currentFiles.map(f => `  ${f.project}/${f.name}`).join('\n');
        }
        // Trouver le fichier par nom
        const file = currentFiles.find(f => f.name === filename || f.name === filename + '.py');
        if (!file) return `Fichier "${filename}" introuvable.`;
        try {
            const patch = await fetch('/api/user/files', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: file.id })
            });
            const fileData = await patch.json();
            const res = await fetch('/api/code/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: fileData.file.content, language: 'python' }),
            });
            const data = await res.json();
            return data.output || '';
        } catch (e) {
            return `Erreur: ${e.message}`;
        }
    };

    return (
        <div className="flex w-full h-full bg-[#1e1e1e] text-[#cccccc] font-sans text-sm overflow-hidden">

            {/* Activity Bar */}
            <div className="w-12 flex flex-col items-center py-4 bg-[#333333] gap-6 border-r border-[#2b2b2b] shrink-0">
                <div className="cursor-pointer text-white border-l-2 border-white pl-3 pr-4"><Files size={24} /></div>
                <div className="cursor-pointer text-[#858585] hover:text-white px-3"><Search size={24} /></div>
                <div className="cursor-pointer text-[#858585] hover:text-white px-3"><GitBranch size={24} /></div>
                <div className="cursor-pointer text-[#858585] hover:text-white px-3"><MonitorPlay size={24} /></div>
                <div className="mt-auto cursor-pointer text-[#858585] hover:text-white px-3"><Settings size={24} /></div>
            </div>

            {/* Sidebar - Projets + Fichiers */}
            <div className="w-60 bg-[#252526] flex flex-col border-r border-[#2b2b2b] hidden md:flex shrink-0">
                <div className="p-3 text-xs font-bold tracking-wider uppercase pl-4 flex justify-between items-center border-b border-[#2b2b2b]">
                    <span>PROJETS</span>
                    <div className="flex gap-1">
                        <button onClick={() => { setShowNewProject(v => !v); setShowNewFile(false); }} title="Nouveau projet"
                            className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-white transition-colors">
                            <FolderPlus size={14} />
                        </button>
                        <button onClick={() => { setShowNewFile(v => !v); setShowNewProject(false); }} title="Nouveau fichier"
                            className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-white transition-colors">
                            <FilePlus size={14} />
                        </button>
                        <button onClick={() => excelInputRef.current?.click()} title="Importer Excel / CSV"
                            className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-green-400 transition-colors" disabled={uploadingExcel}>
                            {uploadingExcel ? <Loader size={14} className="animate-spin" /> : <Table size={14} />}
                        </button>
                        <input ref={excelInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} />
                    </div>
                </div>

                {/* New project input */}
                {showNewProject && (
                    <div className="p-2 border-b border-[#2b2b2b] bg-[#1e1e1e]">
                        <input autoFocus type="text" value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') createProject(); if (e.key === 'Escape') { setShowNewProject(false); setNewProjectName(''); } }}
                            placeholder="nom-du-projet"
                            className="w-full bg-[#3c3c3c] text-white text-xs px-2 py-1 rounded border border-yellow-500 focus:outline-none"
                        />
                        <div className="flex gap-1 mt-1">
                            <button onClick={createProject} className="flex-1 text-[10px] bg-yellow-500 text-black py-0.5 rounded font-bold hover:opacity-90">Créer</button>
                            <button onClick={() => { setShowNewProject(false); setNewProjectName(''); }} className="flex-1 text-[10px] bg-[#3c3c3c] text-gray-400 py-0.5 rounded">Annuler</button>
                        </div>
                    </div>
                )}

                {/* New file input */}
                {showNewFile && (
                    <div className="p-2 border-b border-[#2b2b2b] bg-[#1e1e1e]">
                        <p className="text-[9px] text-[#858585] mb-1">Dans : <span className="text-[#a78bfa]">{activeProject}</span></p>
                        <input autoFocus type="text" value={newFileName}
                            onChange={e => setNewFileName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') createFile(); if (e.key === 'Escape') { setShowNewFile(false); setNewFileName(''); } }}
                            placeholder="nom_fichier.py"
                            className="w-full bg-[#3c3c3c] text-white text-xs px-2 py-1 rounded border border-[#a78bfa] focus:outline-none"
                        />
                        <div className="flex gap-1 mt-1">
                            <button onClick={createFile} className="flex-1 text-[10px] bg-[#a78bfa] text-black py-0.5 rounded font-bold hover:opacity-90">Créer</button>
                            <button onClick={() => { setShowNewFile(false); setNewFileName(''); }} className="flex-1 text-[10px] bg-[#3c3c3c] text-gray-400 py-0.5 rounded">Annuler</button>
                        </div>
                    </div>
                )}

                {/* Projects + files tree */}
                <div className="flex-1 overflow-y-auto py-1">
                    {loadingFiles ? (
                        <div className="flex items-center justify-center py-4 text-[#858585]">
                            <Loader size={14} className="animate-spin mr-2" /> Chargement...
                        </div>
                    ) : (
                        projects.map(project => {
                            const projectFiles = files.filter(f => f.project === project);
                            const isExpanded = expandedProjects[project];
                            const isActive = activeProject === project;
                            return (
                                <div key={project}>
                                    {/* Project row */}
                                    <div
                                        onClick={() => {
                                            setActiveProject(project);
                                            setExpandedProjects(prev => ({ ...prev, [project]: !prev[project] }));
                                        }}
                                        className={`pl-2 pr-2 py-1.5 flex items-center gap-1.5 cursor-pointer group transition-colors ${isActive ? 'text-yellow-300' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}
                                    >
                                        {isExpanded ? <ChevronDown size={11} className="shrink-0 text-[#858585]" /> : <ChevronRight size={11} className="shrink-0 text-[#858585]" />}
                                        {isExpanded ? <FolderOpen size={13} className="shrink-0 text-yellow-400" /> : <Folder size={13} className="shrink-0 text-yellow-400" />}
                                        <span className="flex-1 text-xs truncate font-medium">{project === 'default' ? 'Mon espace' : project}</span>
                                        <span className="text-[9px] text-[#555] shrink-0">{projectFiles.length}</span>
                                        {project !== 'default' && (
                                            <button onClick={(e) => deleteProject(project, e)}
                                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 text-[#858585] transition-all shrink-0">
                                                <Trash2 size={10} />
                                            </button>
                                        )}
                                    </div>
                                    {/* Files under project */}
                                    {isExpanded && (
                                        <div>
                                            {projectFiles.length === 0 ? (
                                                <div className="pl-9 py-1 text-[10px] text-[#555] italic">Vide</div>
                                            ) : (
                                                projectFiles.map(file => (
                                                    <div key={file.id} onClick={() => openFile(file)}
                                                        className={`pl-9 pr-2 py-1.5 flex items-center gap-2 cursor-pointer group transition-colors ${
                                                            activeFile?.id === file.id ? 'bg-[#37373d] text-[#a78bfa]' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                                                        }`}>
                                                        <span className="text-xs shrink-0">🐍</span>
                                                        <span className="flex-1 text-xs truncate">{file.name}</span>
                                                        <button onClick={(e) => deleteFile(file, e)}
                                                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 text-[#858585] transition-all shrink-0">
                                                            <Trash2 size={11} />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-2 border-t border-[#2b2b2b] text-[10px] text-[#555] text-center">
                    {projects.length} projet{projects.length !== 1 ? 's' : ''} · {files.length} fichier{files.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Main Center Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">

                {/* Tabs & Toolbar */}
                <div className="flex justify-between items-center bg-[#252526] pr-4 border-b border-[#2b2b2b]">
                    <div className="flex overflow-x-auto">
                        <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-[#a78bfa] text-white flex items-center gap-2 min-w-fit pr-8 cursor-pointer relative group text-xs border-r border-[#2b2b2b]">
                            <span className="text-blue-400">🐍</span>
                            <span>{activeFile?.name || 'nouveau fichier'}</span>
                            {unsaved && <span className="text-orange-400 text-[10px]">●</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            title="Sauvegarder (Ctrl+S)"
                            className="flex items-center gap-1.5 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            <Play size={12} fill="currentColor" />
                            {isRunning ? 'Running...' : 'Run'}
                        </button>
                    </div>
                </div>

                {/* Editor + Terminal */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 relative border-b border-[#2b2b2b]" style={{ flexBasis: '70%' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => { setCode(value); setUnsaved(true); }}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontFamily: "'Fira Code', 'Consolas', monospace",
                                padding: { top: 16 }
                            }}
                        />
                    </div>
                    <div className="h-[30%] bg-[#1e1e1e] flex flex-col border-t border-[#2b2b2b]">
                        <div className="flex items-center gap-6 px-4 py-1.5 bg-[#1e1e1e] border-b border-[#2b2b2b] text-xs font-semibold uppercase tracking-wide">
                            <span className="text-white border-b border-white pb-0.5 cursor-pointer">Terminal</span>
                            <span className="text-[#858585] cursor-pointer hover:text-white">Output</span>
                        </div>
                        <div className="flex-1 p-2 overflow-hidden">
                            <TerminalComponent ref={terminalRef} onRunFile={handleRunFile} />
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between shrink-0">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1"><GitBranch size={10} /> main</div>
                        {unsaved && <span className="text-yellow-300 text-[10px]">● Non sauvegardé</span>}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1"><Bot size={12} /> Z.AI Active</div>
                        <div>Python 3.10</div>
                    </div>
                </div>
            </div>

            {/* AI Panel */}
            {isAiPanelOpen && (
                <div className="w-80 bg-[#252526] border-l border-[#2b2b2b] flex flex-col shrink-0">
                    <div className="p-3 border-b border-[#2b2b2b] flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-2">
                            <Bot size={14} /> AI Assistant
                        </span>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-green-900 text-green-300 px-1 rounded border border-green-700">ONLINE</span>
                            <X size={14} className="text-gray-500 cursor-pointer hover:text-white" onClick={() => setIsAiPanelOpen(false)} />
                        </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#1e1e1e]">
                        {chatMessages.map((msg, idx) => (
                            <ChatMessage
                                key={idx}
                                msg={msg}
                                onApplyCode={msg.role === 'assistant' ? async (newCode) => {
                                    setCode(newCode);
                                    setUnsaved(false);
                                    if (activeFile) {
                                        await fetch('/api/user/files', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ name: activeFile.name, content: newCode, language: 'python' })
                                        });
                                    } else {
                                        setUnsaved(true);
                                    }
                                } : null}
                            />
                        ))}
                        {isChatLoading && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-7 h-7 rounded-sm bg-[#a78bfa] flex items-center justify-center text-black font-bold text-xs shrink-0">Z</div>
                                <div className="text-xs text-gray-400 pt-1">GLM-5 réfléchit...</div>
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t border-[#2b2b2b]">
                        <div className="relative">
                            <textarea
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                placeholder="Posez une question sur votre code..."
                                className="w-full bg-[#3c3c3c] text-white text-xs rounded p-2 pr-8 focus:outline-none border border-[#3c3c3c] focus:border-[#a78bfa] resize-none h-16"
                            />
                            <div onClick={sendMessage} className={`absolute right-2 bottom-2 ${userMessage.trim() ? 'text-[#a78bfa] cursor-pointer hover:text-white' : 'text-gray-500'}`}>
                                <MessageSquare size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
