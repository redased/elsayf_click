'use client';
import { useState, useEffect, useRef } from 'react';
import {
    Files, Search, GitBranch, MonitorPlay, Settings, Play, Download,
    X, Terminal, FileSpreadsheet, FileText, ChevronRight, PlayCircle, PauseCircle, RefreshCw
} from 'lucide-react';

const EXCEL_CODE = `import pandas as pd
import openpyxl

# 1. Preparation des donnees de ventes
donnees = {
    'Region': ['Alger', 'Oran', 'Constantine', 'Annaba', 'Setif'],
    'Ventes': [120, 85, 72, 54, 63],
    'Chiffre_Affaires': [144000, 102000, 86400, 64800, 75600],
    'Satisfaction': [94, 89, 91, 87, 90]
}

# 2. Creation du DataFrame pandas
df = pd.DataFrame(donnees)

# 3. Exportation au format Excel
df.to_excel('rapport_etudiants.xlsx', index=False)
print("Fichier excel 'rapport_etudiants.xlsx' cree avec succes !")`;

const WORD_CODE = `from docx import Document

# 1. Creation d'un document Word
doc = Document()
doc.add_heading('Rapport de Progres - Formation El Sayf', level=1)

# 2. Ajout de paragraphes et formatage
doc.add_paragraph('Ce document contient le suivi automatise des etudiants.')
doc.add_heading('Tableau recapitulatif des performances', level=2)

# 3. Sauvegarde
doc.save('rapport_progres.docx')
print("Fichier word 'rapport_progres.docx' cree avec succes !")`;

export default function VSCodePopup({ onClose }) {
    const [activeFile, setActiveFile] = useState('generate_excel.py');
    const [editorContent, setEditorContent] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState('elsayf@terminal:~/espace_tp$ ');
    const [running, setRunning] = useState(false);
    const [generatedFiles, setGeneratedFiles] = useState([]); // 'rapport_etudiants.xlsx', 'rapport_progres.docx'
    
    // Excel Data State
    const [excelData, setExcelData] = useState([
        ["Région", "Ventes (Unités)", "Chiffre d'Affaires (DA)", "Satisfaction (%)"],
        ["Alger", "120", "144 000", "94%"],
        ["Oran", "85", "102 000", "89%"],
        ["Constantine", "72", "86 400", "91%"],
        ["Annaba", "54", "64 800", "87%"],
        ["Sétif", "63", "75 600", "90%"]
    ]);

    // Word Data State
    const [wordTitle, setWordTitle] = useState("Rapport de Progrès - Formation El Sayf");
    const [wordNotes, setWordNotes] = useState("Ce document récapitule les données récoltées lors du TP pratique d'automatisation. Il est entièrement modifiable sous Microsoft Word.");
    const [wordTableData, setWordTableData] = useState([
        ["Étudiant", "Filière", "Note (TP)", "Heures d'étude"],
        ["Alice", "Sciences", "15 / 20", "24h"],
        ["Bob", "Lettres", "11 / 20", "10h"],
        ["Charlie", "Médecine", "18 / 20", "45h"],
        ["David", "Sciences", "14 / 20", "18h"]
    ]);

    const typingTimerRef = useRef(null);

    // File definitions
    const files = [
        { name: 'generate_excel.py', type: 'code', content: EXCEL_CODE },
        { name: 'generate_word.py', type: 'code', content: WORD_CODE }
    ];

    // Auto-typing animation when switching python files
    useEffect(() => {
        if (activeFile.endsWith('.py')) {
            setIsTyping(true);
            setEditorContent('');
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);

            const fileObj = files.find(f => f.name === activeFile);
            const fullText = fileObj ? fileObj.content : '';
            let index = 0;

            typingTimerRef.current = setInterval(() => {
                setEditorContent(prev => prev + fullText[index]);
                index++;
                if (index >= fullText.length) {
                    clearInterval(typingTimerRef.current);
                    setIsTyping(false);
                }
            }, 10); // Swift autotype speed
        }

        return () => {
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        };
    }, [activeFile]);

    // Toggle robot autotyping
    const toggleAutoplay = () => {
        if (isTyping) {
            // Pause
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
            setIsTyping(false);
        } else {
            // Play from current length or restart
            const fileObj = files.find(f => f.name === activeFile);
            const fullText = fileObj ? fileObj.content : '';
            let currentLen = editorContent.length;

            if (currentLen >= fullText.length) {
                setEditorContent('');
                currentLen = 0;
            }

            setIsTyping(true);
            typingTimerRef.current = setInterval(() => {
                setEditorContent(prev => {
                    const nextChar = fullText[prev.length];
                    if (nextChar === undefined) {
                        clearInterval(typingTimerRef.current);
                        setIsTyping(false);
                        return prev;
                    }
                    return prev + nextChar;
                });
            }, 10);
        }
    };

    // Run python script simulation
    const handleRun = () => {
        if (isTyping || running) return;
        setRunning(true);
        setTerminalOutput(prev => prev + `python ${activeFile}\n`);

        setTimeout(() => {
            // Extract custom prints dynamically
            const lines = editorContent.split('\n');
            const prints = [];
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('print(')) {
                    const match = trimmed.match(/print\((['"])(.*?)\1\)/);
                    if (match) prints.push(match[2]);
                }
            }

            let output = "";
            if (prints.length > 0) {
                output = prints.join('\n') + '\n';
            } else {
                output = activeFile === 'generate_excel.py'
                    ? "Fichier excel 'rapport_etudiants.xlsx' cree avec succes !\n"
                    : "Fichier word 'rapport_progres.docx' cree avec succes !\n";
            }

            setTerminalOutput(prev => prev + output + `elsayf@terminal:~/espace_tp$ `);

            if (activeFile === 'generate_excel.py') {
                if (!generatedFiles.includes('rapport_etudiants.xlsx')) {
                    setGeneratedFiles(prev => [...prev, 'rapport_etudiants.xlsx']);
                }
            } else {
                if (!generatedFiles.includes('rapport_progres.docx')) {
                    setGeneratedFiles(prev => [...prev, 'rapport_progres.docx']);
                }
            }
            setRunning(false);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-6xl h-[85vh] bg-[#1e1e1e] border border-gray-700/80 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative select-none">
                
                {/* Titlebar */}
                <div className="h-11 bg-[#323233] flex justify-between items-center px-4 border-b border-gray-800 shrink-0 text-gray-400 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold tracking-wider">VS CODE</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-300 font-mono text-[11px]">{activeFile}</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Workspace Body */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Activity Bar */}
                    <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-6 border-r border-[#2b2b2b] shrink-0 text-gray-400">
                        <div className="cursor-pointer text-[#a78bfa] border-l-2 border-[#a78bfa] pl-2 pr-3 py-1">
                            <Files size={20} />
                        </div>
                        <div className="cursor-pointer hover:text-white transition-colors"><Search size={20} /></div>
                        <div className="cursor-pointer hover:text-white transition-colors"><GitBranch size={20} /></div>
                        <div className="cursor-pointer hover:text-white transition-colors" onClick={handleRun}>
                            <MonitorPlay size={20} />
                        </div>
                        <div className="mt-auto cursor-pointer hover:text-white transition-colors">
                            <Settings size={20} />
                        </div>
                    </div>

                    {/* Sidebar Explorer */}
                    <div className="w-56 bg-[#252526] border-r border-gray-800 flex flex-col shrink-0">
                        <div className="p-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase border-b border-gray-800/80">
                            EXPLORATEUR : ESPACE_TP
                        </div>
                        <div className="flex-1 overflow-y-auto py-2 font-sans select-none">
                            
                            {/* Scripts Section */}
                            <div className="px-2 py-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                <ChevronRight size={12} className="text-gray-600" /> SCRIPTS PYTHON (TP)
                            </div>
                            <div className="space-y-0.5 mb-4">
                                {files.map(f => (
                                    <button
                                        key={f.name}
                                        onClick={() => {
                                            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
                                            setIsTyping(false);
                                            setActiveFile(f.name);
                                        }}
                                        className={`w-full text-left px-4 py-1.5 flex items-center gap-2 text-xs transition-colors ${
                                            activeFile === f.name ? 'bg-[#37373d] text-[#a78bfa] font-semibold' : 'hover:bg-[#2a2d2e] text-gray-400'
                                        }`}
                                    >
                                        <span className="text-yellow-500">🐍</span>
                                        <span className="truncate">{f.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Outputs Section */}
                            <div className="px-2 py-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1 border-t border-gray-850 pt-3">
                                <ChevronRight size={12} className="text-gray-600" /> FICHIERS GÉNÉRÉS
                            </div>
                            <div className="space-y-0.5 mt-1 px-1">
                                {generatedFiles.length === 0 ? (
                                    <div className="px-4 py-2.5 text-[10px] text-gray-600 italic">
                                        Exécutez un script pour générer les fichiers.
                                    </div>
                                ) : (
                                    generatedFiles.map(name => {
                                        const isExcel = name.endsWith('.xlsx');
                                        return (
                                            <button
                                                key={name}
                                                onClick={() => {
                                                    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
                                                    setIsTyping(false);
                                                    setActiveFile(name);
                                                }}
                                                className={`w-full text-left px-3 py-2 flex items-center gap-2 text-xs rounded-lg transition-colors ${
                                                    activeFile === name 
                                                        ? 'bg-[#37373d] text-[#a78bfa] font-semibold' 
                                                        : 'hover:bg-[#2a2d2e] text-gray-300'
                                                }`}
                                            >
                                                {isExcel ? (
                                                    <FileSpreadsheet size={14} className="text-emerald-400 shrink-0" />
                                                ) : (
                                                    <FileText size={14} className="text-blue-400 shrink-0" />
                                                )}
                                                <span className="truncate flex-1">{name}</span>
                                                <span className="text-[8px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20 font-bold">VIEW</span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Canvas & Editor Area */}
                    <div className="flex-1 flex flex-col min-w-0">
                        
                        {/* Tab Bar */}
                        <div className="h-9 bg-[#252526] border-b border-gray-800 flex items-center justify-between px-3 shrink-0">
                            <div className="flex overflow-x-auto h-full">
                                <div className="px-4 h-full flex items-center gap-2 border-t-2 border-[#a78bfa] bg-[#1e1e1e] text-white text-xs border-r border-gray-850">
                                    <span>{activeFile.endsWith('.py') ? '🐍' : activeFile.endsWith('.xlsx') ? '📊' : '📝'}</span>
                                    <span>{activeFile}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                                {activeFile.endsWith('.py') && (
                                    <>
                                        <button
                                            onClick={toggleAutoplay}
                                            className="hover:bg-white/5 text-gray-400 hover:text-white px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all"
                                            title="Lancer / Mettre en pause la saisie automatique par l'agent"
                                        >
                                            {isTyping ? <PauseCircle size={14} className="text-[#a78bfa]" /> : <PlayCircle size={14} />}
                                            <span>{isTyping ? 'Pause Robot' : 'Autoplay'}</span>
                                        </button>
                                        <button
                                            onClick={handleRun}
                                            disabled={isTyping || running}
                                            className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-black font-extrabold px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-all active:scale-[0.97]"
                                        >
                                            <Play size={12} fill="currentColor" />
                                            <span>{running ? 'Exécution...' : 'Exécuter'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contents Frame */}
                        <div className="flex-1 overflow-hidden relative">
                            {/* Editor Mode */}
                            {activeFile.endsWith('.py') && (
                                <div className="w-full h-full flex flex-col relative bg-[#1e1e1e] font-mono text-sm leading-relaxed">
                                    {isTyping && (
                                        <div className="absolute top-3 right-4 z-10 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-bold animate-pulse">
                                            🤖 AGENT EN TRAIN D'ÉCRIRE...
                                        </div>
                                    )}
                                    <div className="flex-1 flex overflow-hidden">
                                        {/* Line Numbers Column */}
                                        <div className="w-10 bg-[#1e1e1e] text-right pr-2.5 text-gray-600 select-none border-r border-gray-800/60 pt-4 text-xs font-mono">
                                            {Array.from({ length: Math.max(1, editorContent.split('\n').length) }).map((_, i) => (
                                                <div key={i} className="h-6 leading-6">{i + 1}</div>
                                            ))}
                                        </div>
                                        {/* Styled Textarea Code Input */}
                                        <textarea
                                            value={editorContent}
                                            onChange={e => {
                                                if (isTyping) {
                                                    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
                                                    setIsTyping(false);
                                                }
                                                setEditorContent(e.target.value);
                                            }}
                                            placeholder="# Tapez votre code Python ici ou cliquez sur Autoplay..."
                                            className="flex-1 h-full p-4 bg-transparent text-gray-300 border-none outline-none resize-none overflow-y-auto whitespace-pre font-mono text-xs focus:ring-0 leading-6"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* spreadsheet View */}
                            {activeFile === 'rapport_etudiants.xlsx' && (
                                <ExcelViewer data={excelData} setData={setExcelData} />
                            )}

                            {/* document View */}
                            {activeFile === 'rapport_progres.docx' && (
                                <WordViewer
                                    title={wordTitle} setTitle={setWordTitle}
                                    notes={wordNotes} setNotes={setWordNotes}
                                    tableData={wordTableData} setTableData={setWordTableData}
                                />
                            )}
                        </div>

                        {/* Terminal */}
                        <div className="h-40 bg-[#151515] border-t border-gray-800 flex flex-col shrink-0 font-mono">
                            <div className="h-7 bg-[#1e1e1e] border-b border-gray-800 px-4 flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider select-none shrink-0">
                                <Terminal size={12} /> TERMINAL DE COMPILATION
                            </div>
                            <div className="flex-1 p-3 text-xs text-gray-300 overflow-y-auto whitespace-pre-wrap leading-5">
                                {terminalOutput}
                                {running && (
                                    <span className="inline-block animate-pulse font-bold text-green-400">● Exécution du processus python...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="h-6 bg-[#007acc] text-white flex items-center px-4 text-[11px] justify-between shrink-0 font-medium font-sans">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><GitBranch size={11} /> main</span>
                        <span className="text-white/80">Statut : Prêt</span>
                    </div>
                    <div className="flex gap-4">
                        <span>Ligne {editorContent.split('\n').length}, Col {editorContent.length}</span>
                        <span>LF</span>
                        <span>Python 3.10.4</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Interactive Excel Spreadsheet Component
function ExcelViewer({ data, setData }) {
    const [editingCell, setEditingCell] = useState(null); // { rIdx, cIdx }
    const [tempValue, setTempValue] = useState('');
    const inputRef = useRef(null);

    const handleCellClick = (rIdx, cIdx, val) => {
        setEditingCell({ rIdx, cIdx });
        setTempValue(val);
    };

    const handleSaveCell = () => {
        if (!editingCell) return;
        const { rIdx, cIdx } = editingCell;
        const newData = [...data];
        newData[rIdx][cIdx] = tempValue;
        setData(newData);
        setEditingCell(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSaveCell();
        if (e.key === 'Escape') setEditingCell(null);
    };

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCell]);

    const handleDownloadExcel = () => {
        try {
            // Strip formatting characters like spaces or % from numerical inputs if needed, or pass directly
            const parsedData = data.map((row, rIdx) => {
                if (rIdx === 0) return row;
                return row.map((cell, cIdx) => {
                    if (cIdx === 1 || cIdx === 2 || cIdx === 3) {
                        const stripped = String(cell).replace(/[\sDA%]/g, '');
                        const num = Number(stripped);
                        return isNaN(num) ? cell : num;
                    }
                    return cell;
                });
            });

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/api/code/generate-doc?type=excel';
            form.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'payload';
            input.value = JSON.stringify({ data: parsedData });
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } catch (e) {
            console.error('Erreur download Excel', e);
        }
    };

    const columns = ["A", "B", "C", "D", "E"];

    return (
        <div className="w-full h-full flex flex-col bg-[#1c1c1c] text-gray-300 select-none">
            {/* Toolbar */}
            <div className="px-4 py-2 bg-[#2d2d2d] border-b border-gray-800 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <FileSpreadsheet size={14} />
                    Lecteur Excel Interactif (Double-cliquez pour éditer les cases)
                </span>
                <button
                    onClick={handleDownloadExcel}
                    className="bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold px-3 py-1.5 rounded text-[11px] flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.97] border border-transparent font-sans"
                >
                    <Download size={11} />
                    Télécharger .xlsx
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto p-4 bg-[#151515]">
                <div className="min-w-max border border-gray-800 rounded-xl overflow-hidden shadow-lg bg-[#0e1117]">
                    <table className="w-full border-collapse font-sans text-xs">
                        <thead>
                            <tr className="bg-[#1f2937] text-gray-300">
                                <th className="border border-gray-850 bg-gray-900 w-10 text-center select-none py-1.5"></th>
                                {columns.map(col => (
                                    <th key={col} className="border border-gray-855 px-4 py-2 text-center font-bold text-gray-400 bg-[#161b22] select-none min-w-[130px]">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white/5 transition-colors border-b border-gray-800/40">
                                    <td className="border border-gray-850 bg-gray-900 text-center text-[10px] text-gray-500 font-bold select-none py-1.5">{rIdx + 1}</td>
                                    {row.map((cell, cIdx) => {
                                        const isEditing = editingCell && editingCell.rIdx === rIdx && editingCell.cIdx === cIdx;
                                        return (
                                            <td 
                                                key={cIdx} 
                                                onDoubleClick={() => handleCellClick(rIdx, cIdx, cell)}
                                                className={`border border-gray-850 px-4 py-2 font-mono relative cursor-pointer ${
                                                    rIdx === 0 
                                                        ? 'bg-gray-800/30 text-emerald-400 font-bold cursor-default select-none' 
                                                        : 'text-gray-300 hover:bg-gray-700/25'
                                                }`}
                                            >
                                                {isEditing && rIdx > 0 ? (
                                                    <input
                                                        ref={inputRef}
                                                        value={tempValue}
                                                        onChange={e => setTempValue(e.target.value)}
                                                        onBlur={handleSaveCell}
                                                        onKeyDown={handleKeyDown}
                                                        className="absolute inset-0 w-full h-full bg-[#1c2128] text-white border border-emerald-500 focus:outline-none px-4 py-2 font-mono text-xs"
                                                    />
                                                ) : (
                                                    cell
                                                )}
                                            </td>
                                        );
                                    })}
                                    {row.length < columns.length && Array.from({ length: columns.length - row.length }).map((_, idx) => (
                                        <td key={idx} className="border border-gray-850 px-4 py-2 font-mono text-gray-700"></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// WYSIWYG styled Word Viewer Component
function WordViewer({ title, setTitle, notes, setNotes, tableData, setTableData }) {
    
    const handleDownloadWord = () => {
        try {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/api/code/generate-doc?type=word';
            form.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'payload';
            input.value = JSON.stringify({ title, notes, tableData });
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } catch (e) {
            console.error('Erreur download Word', e);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#1c1c1c] text-gray-300">
            {/* Toolbar */}
            <div className="px-4 py-2 bg-[#2d2d2d] border-b border-gray-800 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <FileText size={14} />
                    Lecteur Word Interactif (Éditez le texte directement à l'écran)
                </span>
                <button
                    onClick={handleDownloadWord}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1.5 rounded text-[11px] flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.97] font-sans"
                >
                    <Download size={11} />
                    Télécharger .doc
                </button>
            </div>

            {/* Document Frame */}
            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#151515] select-text">
                <div className="w-full max-w-[650px] bg-white text-gray-800 p-12 rounded shadow-2xl flex flex-col gap-6 font-serif border border-gray-200 leading-relaxed min-h-[800px]">
                    
                    {/* Editable Header */}
                    <div className="border-b-2 border-blue-600 pb-4 mb-2">
                        <h1 
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => setTitle(e.target.innerText)}
                            className="text-2xl font-extrabold text-blue-800 tracking-tight font-sans outline-none focus:bg-yellow-50 focus:px-1 rounded transition-colors"
                        >
                            {title}
                        </h1>
                        <p className="text-[10px] text-gray-400 mt-2 font-mono">
                            Document généré automatiquement - Édition directe activée
                        </p>
                    </div>

                    <p className="text-xs text-gray-500 font-sans">
                        Ce document est généré de manière entièrement automatique par le script Python d'automatisation bureautique.
                    </p>

                    {/* Editable Note Box */}
                    <div 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => setNotes(e.target.innerText)}
                        className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-xs font-sans text-blue-900 leading-relaxed my-1 outline-none focus:bg-yellow-50 focus:border-yellow-400 transition-colors"
                    >
                        {notes}
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-4 border-b border-gray-200 pb-1 font-sans">
                        Tableau récapitulatif des performances
                    </h2>
                    
                    {/* Editable Table */}
                    <table className="w-full border-collapse font-sans text-xs my-2 text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                {tableData[0].map((header, cIdx) => (
                                    <th 
                                        key={cIdx} 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={e => {
                                            const newData = [...tableData];
                                            newData[0][cIdx] = e.target.innerText;
                                            setTableData(newData);
                                        }}
                                        className="p-2.5 font-bold text-gray-700 border border-gray-300 outline-none focus:bg-yellow-50"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.slice(1).map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-gray-200 hover:bg-gray-50">
                                    {row.map((cell, cIdx) => (
                                        <td 
                                            key={cIdx}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={e => {
                                                const newData = [...tableData];
                                                newData[rIdx + 1][cIdx] = e.target.innerText;
                                                setTableData(newData);
                                            }}
                                            className={`p-2.5 border border-gray-200 outline-none focus:bg-yellow-50 ${
                                                cIdx === 2 ? 'font-bold text-blue-700' : ''
                                            }`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p className="text-[10px] text-gray-400 italic mt-8 text-center border-t border-gray-100 pt-4">
                        Fin du rapport d'automatisation d'El Sayf.
                    </p>
                </div>
            </div>
        </div>
    );
}
