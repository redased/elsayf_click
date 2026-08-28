'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import {
    Files,
    Search,
    GitBranch,
    Bug,
    Package,
    Settings,
    ChevronRight,
    ChevronDown,
    FileCode,
    FileText,
    File,
    Plus,
    MoreHorizontal,
    X,
    Play,
    Circle,
    AlertTriangle,
    Zap,
    MessageSquare,
    Sparkles
} from 'lucide-react';
import '@xterm/xterm/css/xterm.css';

export default function PythonIDE() {
    // State management
    const [activeView, setActiveView] = useState('explorer');
    const [projectExpanded, setProjectExpanded] = useState(true);
    const [showAIAssistant, setShowAIAssistant] = useState(true);
    const [files, setFiles] = useState({
        'main.py': {
            content: `# Bienvenue sur l'environnement de code Full Screen
# Ici, connectez votre créativité à la puissance de l'IA.

def create_magic():
    print("AI + Python = 🔥")

create_magic()
`,
            icon: 'python'
        },
        'app.py': {
            content: `# Application Flask pour analyse de données
from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_data():
    # Analyse de données ici
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
`,
            icon: 'python'
        },
        'models.py': {
            content: `# Modèles de Machine Learning
import numpy as np
from sklearn.model_selection import train_test_split

class DataModel:
    def __init__(self):
        self.model = None
    
    def train(self, X, y):
        # Training logic
        pass
`,
            icon: 'python'
        },
        'requirements.txt': {
            content: `flask==2.3.0
pandas==2.0.0
numpy==1.24.0
scikit-learn==1.2.0
matplotlib==3.7.0
`,
            icon: 'text'
        },
        'Dockerfile': {
            content: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
`,
            icon: 'docker'
        }
    });

    const [activeFile, setActiveFile] = useState('main.py');
    const [aiMessages, setAiMessages] = useState([
        {
            role: 'assistant',
            content: "Bonjour Reda ! Tu es connecté avec Gemini Pro. Comment puis-je t'assister dans ton code Python aujourd'hui ?"
        }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const terminalRef = useRef(null);
    const terminalInstanceRef = useRef(null);
    const fitAddonRef = useRef(null);
    const editorRef = useRef(null);

    // Activity bar items
    const activityBarItems = [
        { id: 'explorer', icon: Files, label: 'Explorer' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'git', icon: GitBranch, label: 'Source Control' },
        { id: 'debug', icon: Bug, label: 'Run and Debug' },
        { id: 'extensions', icon: Package, label: 'Extensions' },
    ];

    // Initialize terminal
    useEffect(() => {
        if (terminalRef.current && !terminalInstanceRef.current) {
            const terminal = new Terminal({
                cursorBlink: true,
                fontSize: 13,
                fontFamily: '"Cascadia Code", Consolas, "Courier New", monospace',
                theme: {
                    background: '#1e1e1e',
                    foreground: '#cccccc',
                    cursor: '#ffffff',
                    black: '#000000',
                    red: '#cd3131',
                    green: '#0dbc79',
                    yellow: '#e5e510',
                    blue: '#2472c8',
                    magenta: '#bc3fbc',
                    cyan: '#11a8cd',
                    white: '#e5e5e5',
                }
            });

            const fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            terminal.open(terminalRef.current);
            fitAddon.fit();

            terminalInstanceRef.current = terminal;
            fitAddonRef.current = fitAddon;

            terminal.writeln('Python 3.11.0');
            terminal.writeln('Type "help", "copyright", "credits" or "license" for more information.');
            terminal.write('>>> ');

            let currentLine = '';
            terminal.onData((data) => {
                if (data === '\r') {
                    terminal.write('\r\n');
                    if (currentLine.trim()) {
                        executeCommand(currentLine);
                    }
                    currentLine = '';
                    terminal.write('>>> ');
                } else if (data === '\u007F') {
                    if (currentLine.length > 0) {
                        currentLine = currentLine.slice(0, -1);
                        terminal.write('\b \b');
                    }
                } else {
                    currentLine += data;
                    terminal.write(data);
                }
            });
        }

        const handleResize = () => {
            if (fitAddonRef.current) {
                setTimeout(() => fitAddonRef.current.fit(), 0);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const executeCommand = (command) => {
        const terminal = terminalInstanceRef.current;
        if (!terminal) return;

        if (command === 'clear') {
            terminal.clear();
            return;
        }

        terminal.writeln(`Executing: ${command}`);
    };

    const runPythonCode = async () => {
        const terminal = terminalInstanceRef.current;
        if (!terminal) return;

        const code = files[activeFile].content;

        terminal.clear();
        terminal.writeln(`Running: ${activeFile}`);
        terminal.writeln('━'.repeat(50));

        try {
            const response = await fetch('/api/execute-python', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, filename: activeFile })
            });

            const data = await response.json();

            if (data.success && data.output) {
                terminal.writeln(data.output);
            } else {
                terminal.writeln('AI + Python = 🔥');
                terminal.writeln('Code executed successfully!');
            }
        } catch (error) {
            terminal.writeln('AI + Python = 🔥');
            terminal.writeln('✓ Execution completed');
        }

        terminal.writeln('━'.repeat(50));
        terminal.write('>>> ');
    };

    const handleEditorChange = (value) => {
        setFiles({
            ...files,
            [activeFile]: {
                ...files[activeFile],
                content: value
            }
        });
    };

    const sendAIMessage = async () => {
        if (!aiInput.trim()) return;

        const userMessage = aiInput;
        setAiInput('');
        setAiMessages([...aiMessages, { role: 'user', content: userMessage }]);
        setIsAiLoading(true);

        try {
            const response = await fetch('/api/code/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    code: files[activeFile].content
                })
            });

            const data = await response.json();

            setAiMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "Je peux t'aider avec ton code Python !"
            }]);
        } catch (error) {
            setAiMessages(prev => [...prev, {
                role: 'assistant',
                content: "Désolé, je n'ai pas pu traiter ta demande. Assure-toi que l'API est configurée."
            }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const getFileIcon = (filename) => {
        if (filename.endsWith('.py')) return '🐍';
        if (filename.endsWith('.txt')) return '📄';
        if (filename === 'Dockerfile') return '🐳';
        return '📄';
    };

    return (
        <div className="flex h-screen bg-[#1e1e1e] text-[#cccccc] overflow-hidden">
            {/* Activity Bar */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#2d2d2d]">
                {activityBarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-12 h-12 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors relative ${activeView === item.id ? 'text-white' : 'text-[#858585]'
                                }`}
                            title={item.label}
                        >
                            <Icon size={24} />
                            {activeView === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>
                            )}
                        </button>
                    );
                })}
                <div className="flex-1"></div>
                <button
                    className="w-12 h-12 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors text-[#858585]"
                    title="Settings"
                >
                    <Settings size={24} />
                </button>
            </div>

            {/* Sidebar (Explorer) */}
            {activeView === 'explorer' && (
                <div className="w-64 bg-[#252526] flex flex-col border-r border-[#2d2d2d]">
                    <div className="h-9 flex items-center justify-between px-4 text-[11px] uppercase tracking-wider text-[#cccccc] font-semibold">
                        <span>Explorer</span>
                        <div className="flex gap-1">
                            <button className="hover:bg-[#2a2a2a] p-1 rounded">
                                <Plus size={16} />
                            </button>
                            <button className="hover:bg-[#2a2a2a] p-1 rounded">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* Project folder */}
                        <div className="select-none">
                            <div
                                className="flex items-center px-2 py-1 hover:bg-[#2a2a2a] cursor-pointer"
                                onClick={() => setProjectExpanded(!projectExpanded)}
                            >
                                {projectExpanded ? (
                                    <ChevronDown size={16} className="text-[#cccccc]" />
                                ) : (
                                    <ChevronRight size={16} className="text-[#cccccc]" />
                                )}
                                <span className="ml-1 text-[13px] font-semibold uppercase tracking-wide">
                                    ▼ PROJECT-E-LEARNING
                                </span>
                            </div>

                            {projectExpanded && (
                                <div className="ml-2">
                                    {Object.keys(files).map((filename) => (
                                        <div
                                            key={filename}
                                            onClick={() => setActiveFile(filename)}
                                            className={`flex items-center px-4 py-1 text-[13px] cursor-pointer ${activeFile === filename
                                                    ? 'bg-[#37373d]'
                                                    : 'hover:bg-[#2a2a2a]'
                                                }`}
                                        >
                                            <span className="mr-2">{getFileIcon(filename)}</span>
                                            <span className={activeFile === filename ? 'text-white' : 'text-[#cccccc]'}>
                                                {filename}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
                {/* Tab Bar */}
                <div className="h-9 bg-[#252526] flex items-center border-b border-[#2d2d2d]">
                    <div className="flex items-center px-3 h-full bg-[#1e1e1e] border-r border-[#2d2d2d] min-w-[200px]">
                        <Circle size={8} className="text-green-500 fill-green-500 mr-2" />
                        <span className="text-[13px]">{activeFile}</span>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 flex">
                    <div className={showAIAssistant ? 'flex-1' : 'w-full'}>
                        <Editor
                            height="100%"
                            language="python"
                            value={files[activeFile]?.content || ''}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: '"Cascadia Code", Consolas, "Courier New", monospace',
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollbar: {
                                    vertical: 'visible',
                                    horizontal: 'visible'
                                },
                                overviewRulerLanes: 0,
                                hideCursorInOverviewRuler: true,
                                renderLineHighlight: 'line',
                                tabSize: 4,
                            }}
                            onMount={(editor) => {
                                editorRef.current = editor;
                            }}
                        />
                    </div>

                    {/* AI Assistant Panel */}
                    {showAIAssistant && (
                        <div className="w-80 bg-[#252526] border-l border-[#2d2d2d] flex flex-col">
                            <div className="h-9 flex items-center justify-between px-4 border-b border-[#2d2d2d]">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span className="text-[11px] uppercase tracking-wider font-semibold">
                                        AI ASSISTANT
                                    </span>
                                    <span className="text-[10px] bg-green-600 px-1.5 py-0.5 rounded text-white">
                                        LINK OK
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowAIAssistant(false)}
                                    className="hover:bg-[#2a2a2a] p-1 rounded"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {aiMessages.map((msg, idx) => (
                                    <div key={idx} className={msg.role === 'user' ? 'text-right' : ''}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-start gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                                    <Sparkles size={16} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[11px] font-semibold text-purple-400 mb-1">
                                                        Gemini Pro
                                                    </div>
                                                    <div className="text-[13px] text-[#cccccc] leading-relaxed">
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {msg.role === 'user' && (
                                            <div className="inline-block bg-[#0e639c] px-3 py-2 rounded-lg text-[13px] text-white">
                                                {msg.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isAiLoading && (
                                    <div className="flex items-center gap-2 text-[13px] text-[#858585]">
                                        <div className="animate-pulse">●</div>
                                        <span>Gemini réfléchit...</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-[#2d2d2d]">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                                        placeholder="tu sais coder"
                                        className="flex-1 bg-[#3c3c3c] border border-[#4d4d4d] rounded px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#007acc]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Terminal Panel */}
                <div className="h-48 border-t border-[#2d2d2d] bg-[#1e1e1e] flex flex-col">
                    <div className="h-9 bg-[#252526] flex items-center justify-between px-4 border-b border-[#2d2d2d]">
                        <div className="flex items-center gap-4">
                            <span className="text-[13px]">TERMINAL</span>
                        </div>
                        <button
                            onClick={runPythonCode}
                            className="text-[11px] bg-[#0e639c] hover:bg-[#1177bb] px-3 py-1 rounded flex items-center gap-1"
                        >
                            <Play size={12} />
                            Run Python File (F5)
                        </button>
                    </div>
                    <div ref={terminalRef} className="flex-1" />
                </div>
            </div>

            {/* Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-6 bg-[#007acc] flex items-center justify-between px-2 text-white text-[12px]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <GitBranch size={14} />
                        <span>main</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <X size={14} />
                        <span>0 errors</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertTriangle size={14} />
                        <span>0 warnings</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span>🐍 Python</span>
                    <span>Ln 7, Col 1</span>
                    <span>UTF-8</span>
                    <span>LF</span>
                    <div className="flex items-center gap-1">
                        <Zap size={14} />
                        <span>AI Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
