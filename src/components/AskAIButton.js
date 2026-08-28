'use client';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Maximize2, Minimize2, Trash2, Plus, History, MessageSquare, ChevronLeft, FileSpreadsheet, FileText, Download, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as XLSX from 'xlsx';
import { 
    ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

export default function AskAIButton({ context }) {
    const [isOpen, setIsOpen] = useState(false);
    const [threads, setThreads] = useState([]);
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [attachedFile, setAttachedFile] = useState(null);

    // Load history from localStorage on mount
    useEffect(() => {
        const savedThreads = localStorage.getItem('elsayf_ai_threads');
        const savedActiveId = localStorage.getItem('elsayf_ai_active_thread_id');
        
        if (savedThreads) {
            const parsed = JSON.parse(savedThreads);
            setThreads(parsed);
            if (parsed.length > 0) {
                if (savedActiveId && parsed.some(t => t.id === savedActiveId)) {
                    setActiveThreadId(savedActiveId);
                } else {
                    setActiveThreadId(parsed[0].id);
                }
            }
        } else {
            // Initialize with a default thread
            const defaultThread = {
                id: Date.now().toString(),
                title: 'Nouvelle discussion',
                messages: [],
                context: context || 'Général',
                updatedAt: Date.now()
            };
            setThreads([defaultThread]);
            setActiveThreadId(defaultThread.id);
            localStorage.setItem('elsayf_ai_threads', JSON.stringify([defaultThread]));
            localStorage.setItem('elsayf_ai_active_thread_id', defaultThread.id);
        }
    }, []);

    // Update active thread context if it's empty when changing lessons/pages
    useEffect(() => {
        if (context && activeThreadId) {
            setThreads(prev => {
                const updated = prev.map(t => {
                    if (t.id === activeThreadId && t.messages.length === 0) {
                        return { ...t, context: context };
                    }
                    return t;
                });
                localStorage.setItem('elsayf_ai_threads', JSON.stringify(updated));
                return updated;
            });
        }
    }, [context, activeThreadId]);

    // Auto-scroll on new messages or open
    const activeThread = threads.find(t => t.id === activeThreadId);
    const currentMessages = activeThread ? activeThread.messages : [];

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentMessages, loading, isOpen]);

    // Handle file upload and parsing client-side
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    
                    const textLines = json.map(row => row.map(val => val === undefined || val === null ? '' : String(val)).join('\t'));
                    const tabularString = textLines.join('\n');
                    
                    setAttachedFile({
                        name: file.name,
                        type: fileExtension === 'csv' ? 'csv' : 'excel',
                        data: json,
                        textSummary: `Fichier de données tabulaires (${file.name}) :\n\`\`\`\n${tabularString}\n\`\`\``
                    });
                } catch (err) {
                    console.error("Error reading excel file", err);
                    alert("Impossible de lire ce fichier Excel.");
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (['txt', 'py', 'r', 'json', 'md', 'html', 'css', 'js'].includes(fileExtension)) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const text = evt.target.result;
                    setAttachedFile({
                        name: file.name,
                        type: 'text',
                        content: text,
                        textSummary: `Contenu du fichier texte (${file.name}) :\n\`\`\`${fileExtension}\n${text}\n\`\`\``
                    });
                } catch (err) {
                    console.error("Error reading text file", err);
                    alert("Impossible de lire ce fichier texte.");
                }
            };
            reader.readAsText(file);
        } else {
            alert("Format de fichier non pris en charge. Veuillez choisir un fichier Excel, CSV ou un fichier texte (txt, py, r).");
        }
        e.target.value = null;
    };

    // Handle asking AI
    const handleAsk = async () => {
        if ((!question.trim() && !attachedFile) || loading || !activeThreadId) return;

        let userMsgContent = question.trim();
        let displayContent = question.trim();
        
        if (attachedFile) {
            if (!displayContent) {
                displayContent = `Fichier joint : ${attachedFile.name}`;
            } else {
                displayContent = `${displayContent}\n\n*(Fichier joint : ${attachedFile.name})*`;
            }
            userMsgContent = `[FICHIER JOINT: ${attachedFile.name}]\n\n${attachedFile.textSummary || attachedFile.content}\n\nQuestion de l'utilisateur: ${question.trim()}`;
        }

        const userMsg = { 
            role: 'user', 
            content: userMsgContent,
            displayContent: displayContent
        };
        
        const currentThread = threads.find(t => t.id === activeThreadId);
        if (!currentThread) return;

        const updatedMessages = [...currentThread.messages, userMsg];

        // Determine title based on first user query
        let updatedTitle = currentThread.title;
        if (currentThread.messages.length === 0) {
            const words = (userMsg.displayContent || userMsg.content).split(' ');
            updatedTitle = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
            if (updatedTitle.length > 35) {
                updatedTitle = updatedTitle.substring(0, 32) + '...';
            }
        }

        const updatedThread = {
            ...currentThread,
            title: updatedTitle,
            messages: updatedMessages,
            updatedAt: Date.now()
        };

        const nextThreads = threads.map(t => t.id === activeThreadId ? updatedThread : t);
        setThreads(nextThreads);
        localStorage.setItem('elsayf_ai_threads', JSON.stringify(nextThreads));
        setQuestion('');
        setAttachedFile(null);
        setLoading(true);

        try {
            const history = currentThread.messages.map(m => ({ role: m.role, content: m.content }));
            
            const res = await fetch('/api/ai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMsg.content,
                    context: currentThread.context || context || "No context",
                    history
                })
            });
            const data = await res.json();
            
            const assistantMsg = { 
                role: 'assistant', 
                content: data.answer || "Désolé, je n'ai pas pu obtenir une réponse." 
            };

            setThreads(prev => {
                const latestThread = prev.find(t => t.id === activeThreadId);
                if (!latestThread) return prev;
                const finalThread = {
                    ...latestThread,
                    messages: [...latestThread.messages, assistantMsg],
                    updatedAt: Date.now()
                };
                const finalThreads = prev.map(t => t.id === activeThreadId ? finalThread : t);
                localStorage.setItem('elsayf_ai_threads', JSON.stringify(finalThreads));
                return finalThreads;
            });
        } catch (error) {
            console.error("AI Error", error);
            const errorMsg = { role: 'assistant', content: "Erreur de connexion avec l'IA." };
            setThreads(prev => {
                const latestThread = prev.find(t => t.id === activeThreadId);
                if (!latestThread) return prev;
                const finalThread = {
                    ...latestThread,
                    messages: [...latestThread.messages, errorMsg],
                    updatedAt: Date.now()
                };
                const finalThreads = prev.map(t => t.id === activeThreadId ? finalThread : t);
                localStorage.setItem('elsayf_ai_threads', JSON.stringify(finalThreads));
                return finalThreads;
            });
        }
        setLoading(false);
    };

    // Create a new thread/discussion
    const handleCreateNewThread = () => {
        const newThread = {
            id: Date.now().toString(),
            title: 'Nouvelle discussion',
            messages: [],
            context: context || 'Général',
            updatedAt: Date.now()
        };
        const nextThreads = [newThread, ...threads];
        setThreads(nextThreads);
        setActiveThreadId(newThread.id);
        localStorage.setItem('elsayf_ai_threads', JSON.stringify(nextThreads));
        localStorage.setItem('elsayf_ai_active_thread_id', newThread.id);
        
        // Auto close sidebar in small view
        if (!isExpanded) {
            setShowSidebar(false);
        }
    };

    // Switch active thread
    const handleSwitchThread = (id) => {
        setActiveThreadId(id);
        localStorage.setItem('elsayf_ai_active_thread_id', id);
        if (!isExpanded) {
            setShowSidebar(false);
        }
    };

    // Delete a thread
    const handleDeleteThread = (idToDelete) => {
        const nextThreads = threads.filter(t => t.id !== idToDelete);
        setThreads(nextThreads);
        localStorage.setItem('elsayf_ai_threads', JSON.stringify(nextThreads));

        if (activeThreadId === idToDelete) {
            if (nextThreads.length > 0) {
                setActiveThreadId(nextThreads[0].id);
                localStorage.setItem('elsayf_ai_active_thread_id', nextThreads[0].id);
            } else {
                const defaultThread = {
                    id: Date.now().toString(),
                    title: 'Nouvelle discussion',
                    messages: [],
                    context: context || 'Général',
                    updatedAt: Date.now()
                };
                setThreads([defaultThread]);
                setActiveThreadId(defaultThread.id);
                localStorage.setItem('elsayf_ai_threads', JSON.stringify([defaultThread]));
                localStorage.setItem('elsayf_ai_active_thread_id', defaultThread.id);
            }
        }
    };

    // Clear all history
    const handleClearAllThreads = () => {
        if (confirm("Voulez-vous vraiment effacer tout l'historique des discussions ?")) {
            const defaultThread = {
                id: Date.now().toString(),
                title: 'Nouvelle discussion',
                messages: [],
                context: context || 'Général',
                updatedAt: Date.now()
            };
            setThreads([defaultThread]);
            setActiveThreadId(defaultThread.id);
            localStorage.setItem('elsayf_ai_threads', JSON.stringify([defaultThread]));
            localStorage.setItem('elsayf_ai_active_thread_id', defaultThread.id);
            if (!isExpanded) {
                setShowSidebar(false);
            }
        }
    };

    return (
        <>
            {/* Floating Star Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2 font-bold"
                title="Demander à l'IA"
            >
                <Sparkles size={24} />
                <span className="hidden md:inline">Ask AI</span>
            </motion.button>

            {/* AI Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            width: isExpanded ? '1050px' : '540px',
                            height: isExpanded ? '750px' : '650px'
                        }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-8 z-50 bg-[#0f172a] border border-[#a78bfa]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-950 via-[#1e293b] to-[#0f172a] p-4 flex justify-between items-center border-b border-[#a78bfa]/20 shrink-0">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-yellow-400" size={20} />
                                <h3 className="font-bold text-white text-sm md:text-base">Assistant IA</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Header Tools */}
                                <button
                                    onClick={() => setShowSidebar(!showSidebar)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                        showSidebar 
                                            ? 'bg-[#a78bfa]/20 text-[#a78bfa]' 
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                                    title="Historique des discussions"
                                >
                                    <History size={18} />
                                </button>
                                <button
                                    onClick={handleCreateNewThread}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                    title="Nouvelle discussion"
                                >
                                    <Plus size={18} />
                                </button>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                    title={isExpanded ? "Réduire" : "Agrandir"}
                                >
                                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                    title="Fermer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Main Body */}
                        <div className="flex-1 flex overflow-hidden relative bg-[#111827]">
                            
                            {/* Left Sidebar (History Panel) */}
                            <AnimatePresence>
                                {showSidebar && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: '260px', opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`bg-[#0b0f19] border-r border-[#a78bfa]/20 h-full flex flex-col z-20 shrink-0 overflow-hidden ${
                                            isExpanded ? 'relative' : 'absolute left-0 top-0 shadow-2xl'
                                        }`}
                                    >
                                        {/* Sidebar Header */}
                                        <div className="p-3 border-b border-[#a78bfa]/10 flex items-center justify-between bg-[#0e1322]">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discussions</span>
                                            <button
                                                onClick={() => setShowSidebar(false)}
                                                className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
                                                title="Masquer l'historique"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                        </div>

                                        {/* Create New Thread */}
                                        <div className="p-2 border-b border-[#a78bfa]/10">
                                            <button
                                                onClick={handleCreateNewThread}
                                                className="w-full bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                                            >
                                                <Plus size={14} />
                                                <span>Nouvelle discussion</span>
                                            </button>
                                        </div>

                                        {/* History list */}
                                        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
                                            {threads.map((t) => {
                                                const isActive = t.id === activeThreadId;
                                                return (
                                                    <div
                                                        key={t.id}
                                                        onClick={() => handleSwitchThread(t.id)}
                                                        className={`group relative w-full rounded-xl p-2.5 flex items-start gap-2.5 cursor-pointer transition-all border ${
                                                            isActive
                                                                ? 'bg-[#a78bfa]/15 text-white border-[#a78bfa]/30'
                                                                : 'hover:bg-gray-800/40 text-gray-400 hover:text-gray-200 border-transparent'
                                                        }`}
                                                    >
                                                        <MessageSquare size={15} className={`shrink-0 mt-0.5 ${isActive ? 'text-[#a78bfa]' : 'text-gray-500'}`} />
                                                        <div className="flex-1 min-w-0 pr-6">
                                                            <div className={`text-xs font-medium truncate leading-tight ${isActive ? 'text-[#a78bfa]' : ''}`}>
                                                                {t.title || 'Nouvelle discussion'}
                                                            </div>
                                                            {t.context && (
                                                                <div className="text-[10px] text-gray-500 truncate mt-0.5 max-w-[180px]">
                                                                    {t.context.replace(/-/g, ' ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteThread(t.id);
                                                            }}
                                                            className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-0.5 rounded hover:bg-gray-800"
                                                            title="Supprimer la discussion"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Footer delete all */}
                                        {threads.length > 1 && (
                                            <div className="p-3 border-t border-[#a78bfa]/10 bg-[#070a12] shrink-0">
                                                <button
                                                    onClick={handleClearAllThreads}
                                                    className="w-full text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 font-medium py-1.5 rounded-lg hover:bg-red-500/5"
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Tout effacer</span>
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col h-full bg-[#111827] overflow-hidden">
                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {currentMessages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-500">
                                            <Sparkles size={48} className="mb-4 text-[#a78bfa]/20 animate-pulse" />
                                            <p className="text-sm font-semibold text-gray-300">Posez-moi une question sur le contenu actuel.</p>
                                            {activeThread?.context && (
                                                <div className="mt-2 bg-[#a78bfa]/5 text-[#a78bfa] text-xs px-3 py-1 rounded-full border border-[#a78bfa]/15 inline-block">
                                                    Contexte : {activeThread.context.replace(/-/g, ' ')}
                                                </div>
                                            )}
                                            <p className="text-xs mt-3 text-gray-500">Je connais le contexte de votre leçon et je retiens notre conversation.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {currentMessages.map((msg, index) => {
                                                const isUser = msg.role === 'user';
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
                                                    >
                                                        <div
                                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                                                isUser
                                                                    ? 'bg-[#a78bfa] text-black rounded-tr-none font-medium'
                                                                    : 'bg-[#1f2937] text-gray-100 border border-gray-700/60 rounded-tl-none'
                                                            }`}
                                                        >
                                                            {!isUser && (
                                                                <div className="flex items-center gap-1.5 mb-1.5 border-b border-gray-700/40 pb-1">
                                                                    <Sparkles size={13} className="text-[#a78bfa]" />
                                                                    <span className="text-[10px] font-bold text-[#a78bfa] uppercase">Z-AI</span>
                                                                </div>
                                                            )}
                                                            {isUser ? (
                                                                 <p className="whitespace-pre-wrap">{msg.displayContent || msg.content}</p>
                                                             ) : (
                                                                 <MessageContent content={msg.content} />
                                                             )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {loading && (
                                                <div className="flex justify-start w-full">
                                                    <div className="bg-[#1f2937] text-gray-400 border border-gray-700/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                                                        <div className="flex gap-1">
                                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                        </div>
                                                        <span className="text-xs">Réflexion...</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-[#0f172a] border-t border-gray-800 shrink-0">
                                    {/* File attachment preview badge */}
                                    {attachedFile && (
                                        <div className="mb-2.5 p-2 bg-[#1e293b]/90 border border-gray-700 rounded-xl flex items-center justify-between gap-2 text-xs text-white animate-fade-in">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">
                                                    {attachedFile.type === 'excel' || attachedFile.type === 'csv' ? '📊' : '📄'}
                                                </span>
                                                <div className="truncate max-w-[240px]">
                                                    <p className="font-semibold truncate text-[11px] text-gray-200">{attachedFile.name}</p>
                                                    <p className="text-[9px] text-gray-400">
                                                        {attachedFile.type === 'excel' || attachedFile.type === 'csv' ? 'Tableur Excel lu avec succès' : 'Fichier texte lu avec succès'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setAttachedFile(null)} 
                                                className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                                title="Supprimer la pièce jointe"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={loading}
                                            className="bg-[#1e293b] hover:bg-gray-800 text-gray-300 hover:text-white p-3.5 rounded-xl transition-all border border-gray-700 active:scale-95 shrink-0 flex items-center justify-center"
                                            title="Joindre un fichier (Excel, CSV, Texte)"
                                        >
                                            <Paperclip size={18} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept=".xlsx,.xls,.csv,.txt,.py,.r,.md,.json"
                                            className="hidden"
                                        />

                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                                            placeholder={attachedFile ? "Posez une question sur ce fichier..." : "Posez votre question ici..."}
                                            className="flex-1 bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/30 transition-all"
                                            disabled={loading}
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAsk}
                                            disabled={loading || (!question.trim() && !attachedFile)}
                                            className="bg-[#a78bfa] hover:bg-[#8b5cf6] disabled:opacity-40 disabled:hover:bg-[#a78bfa] text-black font-bold p-3.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
                                        >
                                            <Send size={18} className="text-black" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// AI Document generation parser and subcomponents
function MessageContent({ content }) {
    const excelRegex = /\[GENERATE_EXCEL:\s*(\{.*?\})\s*\]/s;
    const wordRegex = /\[GENERATE_WORD:\s*(\{.*?\})\s*\]/s;

    let cleanText = content;
    let excelWidget = null;
    let wordWidget = null;

    const excelMatch = content.match(excelRegex);
    if (excelMatch) {
        cleanText = cleanText.replace(excelMatch[0], '');
        try {
            const parsedData = JSON.parse(excelMatch[1]);
            excelWidget = <AIExcelWidget data={parsedData.data} styles={parsedData.styles} chart={parsedData.chart} />;
        } catch (e) {
            console.error("Failed to parse AI Excel JSON", e);
            excelWidget = <div className="text-red-400 text-xs mt-2 border border-red-500/20 p-2 rounded bg-red-500/5">Erreur de structure Excel générée par l'IA.</div>;
        }
    }

    const wordMatch = content.match(wordRegex);
    if (wordMatch) {
        cleanText = cleanText.replace(wordMatch[0], '');
        try {
            const parsedData = JSON.parse(wordMatch[1]);
            wordWidget = (
                <AIWordWidget 
                    title={parsedData.title} 
                    notes={parsedData.notes} 
                    tableData={parsedData.tableData} 
                />
            );
        } catch (e) {
            console.error("Failed to parse AI Word JSON", e);
            wordWidget = <div className="text-red-400 text-xs mt-2 border border-red-500/20 p-2 rounded bg-red-500/5">Erreur de structure Word générée par l'IA.</div>;
        }
    }

    return (
        <div className="space-y-3">
            <div className="prose prose-invert prose-xs max-w-none text-gray-200 prose-headings:text-white prose-headings:font-bold prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-white prose-code:text-yellow-400 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanText.trim()}</ReactMarkdown>
            </div>
            {excelWidget}
            {wordWidget}
        </div>
    );
}

function AIExcelWidget({ data, styles, chart }) {
    const [isOpen, setIsOpen] = useState(false);
    
    if (!data || !Array.isArray(data)) return null;

    const handleDownload = () => {
        try {
            // Strip formatting characters like spaces or % from numerical inputs
            const parsedData = data.map((row, rIdx) => {
                if (rIdx === 0) return row;
                return row.map((cell, cIdx) => {
                    if (cIdx >= 1) {
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
            input.value = JSON.stringify({ 
                data: parsedData,
                styles: styles,
                chart: chart
            });
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } catch (e) {
            console.error("Download failed", e);
        }
    };

    const getRowStyle = (row, rIdx) => {
        if (rIdx === 0) {
            return {
                backgroundColor: styles?.headerBg || '#065f46',
                color: styles?.headerColor || '#ffffff',
                fontWeight: 'bold'
            };
        }
        
        let rowStyle = {};
        
        // Highlight rows
        if (styles?.highlightRows && Array.isArray(styles.highlightRows)) {
            for (const cond of styles.highlightRows) {
                const colIdx = data[0].indexOf(cond.column);
                if (colIdx !== -1) {
                    const cellValStr = String(row[colIdx]).replace(/[\sDA%]/g, '');
                    const cellNum = Number(cellValStr);
                    const condVal = Number(cond.value);
                    
                    let match = false;
                    if (!isNaN(cellNum) && !isNaN(condVal)) {
                        if (cond.operator === '>') match = cellNum > condVal;
                        else if (cond.operator === '<') match = cellNum < condVal;
                        else if (cond.operator === '==') match = cellNum === condVal;
                        else if (cond.operator === '>=') match = cellNum >= condVal;
                        else if (cond.operator === '<=') match = cellNum <= condVal;
                    } else {
                        const strCell = String(row[colIdx]).trim().toLowerCase();
                        const strCond = String(cond.value).trim().toLowerCase();
                        if (cond.operator === '==') match = strCell === strCond;
                    }
                    
                    if (match) {
                        rowStyle = {
                            backgroundColor: cond.bg || 'rgba(239, 68, 68, 0.1)',
                            color: cond.color || '#fca5a5'
                        };
                        return rowStyle;
                    }
                }
            }
        }
        
        // Striping style
        if (styles?.rowStriping !== false && rIdx % 2 === 0) {
            rowStyle.backgroundColor = 'rgba(255, 255, 255, 0.03)';
        }
        
        return rowStyle;
    };

    const renderChart = () => {
        if (!chart || !chart.type || !chart.xAxis || !chart.yAxis || !Array.isArray(chart.yAxis)) return null;
        if (!data || data.length < 2) return null;

        const headers = data[0];
        const xIdx = headers.indexOf(chart.xAxis);
        if (xIdx === -1) return null;

        const yCols = chart.yAxis.map(colName => ({
            name: colName,
            idx: headers.indexOf(colName)
        })).filter(c => c.idx !== -1);

        if (yCols.length === 0) return null;

        const chartData = data.slice(1).map((row) => {
            const obj = { name: String(row[xIdx]) };
            yCols.forEach(col => {
                const valStr = String(row[col.idx]).replace(/[\sDA%]/g, '');
                const val = Number(valStr);
                obj[col.name] = isNaN(val) ? 0 : val;
            });
            return obj;
        });

        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

        if (chart.type === 'bar') {
            return (
                <div className="mt-3 p-3 bg-[#070b14] border border-gray-800 rounded-lg">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Graphique en histogramme</p>
                    <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} />
                                <YAxis stroke="#9ca3af" fontSize={8} />
                                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', fontSize: 10 }} />
                                <Legend wrapperStyle={{ fontSize: 9 }} />
                                {yCols.map((col, cIdx) => (
                                    <Bar key={col.name} dataKey={col.name} fill={colors[cIdx % colors.length]} radius={[2, 2, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        }

        if (chart.type === 'line') {
            return (
                <div className="mt-3 p-3 bg-[#070b14] border border-gray-800 rounded-lg">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Graphique en courbe</p>
                    <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} />
                                <YAxis stroke="#9ca3af" fontSize={8} />
                                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', fontSize: 10 }} />
                                <Legend wrapperStyle={{ fontSize: 9 }} />
                                {yCols.map((col, cIdx) => (
                                    <Line key={col.name} type="monotone" dataKey={col.name} stroke={colors[cIdx % colors.length]} strokeWidth={2} activeDot={{ r: 5 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        }

        if (chart.type === 'pie') {
            const pieData = chartData.map(d => ({
                name: d.name,
                value: d[yCols[0].name] || 0
            }));
            return (
                <div className="mt-3 p-3 bg-[#070b14] border border-gray-800 rounded-lg">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Graphique en secteurs (Camembert)</p>
                    <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#10b981"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {pieData.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', fontSize: 10 }} />
                                <Legend wrapperStyle={{ fontSize: 9 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        }

        return null;
    };

    const columns = Array.from({ length: data[0]?.length || 0 }).map((_, i) => String.fromCharCode(65 + i));

    return (
        <div className="mt-3 p-3.5 bg-[#0e1726] border border-emerald-500/35 rounded-xl flex flex-col gap-3 font-sans text-xs animate-fade-in">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                        <FileSpreadsheet size={16} />
                    </div>
                    <div>
                        <div className="font-bold text-white">Tableur Excel IA</div>
                        <div className="text-[10px] text-gray-400">{data.length} lignes × {data[0]?.length || 0} colonnes</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] transition-colors border border-gray-700/50"
                    >
                        {isOpen ? "Masquer" : "Aperçu"}
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition-all active:scale-[0.97]"
                    >
                        <Download size={10} />
                        Télécharger
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="max-h-40 overflow-auto border border-gray-800 rounded-lg bg-[#070b14] p-2">
                    <table className="w-full text-[10px] text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-emerald-400 font-bold">
                                <th className="p-1 border border-gray-800/40 text-center w-6 bg-gray-900/60 font-sans"></th>
                                {columns.map((col, idx) => (
                                    <th 
                                        key={idx} 
                                        className="p-1.5 border border-gray-800/40 text-center font-sans"
                                        style={{ backgroundColor: styles?.headerBg || '#065f46', color: styles?.headerColor || '#ffffff' }}
                                    >{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rIdx) => (
                                <tr 
                                    key={rIdx} 
                                    style={getRowStyle(row, rIdx)}
                                    className={`border-b border-gray-800/20 text-gray-300 hover:bg-white/5 ${rIdx === 0 ? 'font-bold' : ''}`}
                                >
                                    <td className="p-1 border border-gray-800/40 text-center text-gray-500 font-bold bg-gray-900/40">{rIdx + 1}</td>
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="p-1.5 border border-gray-800/40 font-mono">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && renderChart()}
        </div>
    );
}

function AIWordWidget({ title, notes, tableData }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!title) return null;

    const handleDownload = () => {
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
            console.error("Download failed", e);
        }
    };

    return (
        <div className="mt-3 p-3.5 bg-[#0e1726] border border-blue-500/35 rounded-xl flex flex-col gap-3 font-sans text-xs animate-fade-in">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                        <FileText size={16} />
                    </div>
                    <div>
                        <div className="font-bold text-white">Document Word IA</div>
                        <div className="text-[10px] text-gray-400">Rapport Word (.doc) éditable</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] transition-colors border border-gray-700/50"
                    >
                        {isOpen ? "Masquer" : "Aperçu"}
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition-all active:scale-[0.97]"
                    >
                        <Download size={10} />
                        Télécharger
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border border-gray-800 rounded-lg bg-white text-gray-800 p-4 font-serif text-[10px] leading-relaxed max-h-48 overflow-y-auto shadow-inner">
                    <div className="border-b border-gray-200 pb-1 mb-2">
                        <h4 className="text-xs font-extrabold text-blue-900 font-sans">{title}</h4>
                    </div>
                    {notes && <p className="bg-blue-50 border-l-2 border-blue-500 p-2 text-[9px] text-blue-900 mb-2 font-sans">{notes}</p>}
                    {tableData && tableData.length > 0 && (
                        <table className="w-full border-collapse mt-2 text-[9px] text-left">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-350 font-sans font-bold">
                                    {tableData[0]?.map((h, idx) => (
                                        <th key={idx} className="p-1.5 border border-gray-200">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.slice(1).map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b border-gray-100 hover:bg-gray-50">
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="p-1.5 border border-gray-200">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
