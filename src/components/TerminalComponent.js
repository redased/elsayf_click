'use client';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const PROMPT = '\x1b[1;32m➜\x1b[0m \x1b[1;36m~/project\x1b[0m \x1b[1;35m$\x1b[0m ';

const TerminalComponent = forwardRef(function TerminalComponent({ onRunFile }, ref) {
    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitRef = useRef(null);
    const inputRef = useRef('');
    const runningRef = useRef(false);
    const onRunFileRef = useRef(onRunFile);
    useEffect(() => { onRunFileRef.current = onRunFile; }, [onRunFile]);

    useImperativeHandle(ref, () => ({
        writeOutput: (text) => {
            if (!termRef.current) return;
            termRef.current.write('\r\n' + text.replace(/\n/g, '\r\n'));
            termRef.current.write('\r\n' + PROMPT);
        }
    }));

    useEffect(() => {
        if (!containerRef.current) return;

        const term = new Terminal({
            theme: {
                background: '#1e1e1e', foreground: '#cccccc', cursor: '#cccccc',
                green: '#0dbc79', cyan: '#11a8cd', red: '#cd3131', yellow: '#e5e510',
                blue: '#2472c8', white: '#e5e5e5', brightGreen: '#23d18b',
            },
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: 13,
            lineHeight: 1.2,
            cursorBlink: true,
            convertEol: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(containerRef.current);
        fitAddon.fit();
        termRef.current = term;
        fitRef.current = fitAddon;

        term.writeln('\x1b[1;33mTerminal Python interactif\x1b[0m');
        term.writeln('\x1b[2mCommandes: python3 fichier.py  |  ls  |  clear\x1b[0m');
        term.write('\r\n' + PROMPT);

        term.onData(async (data) => {
            if (runningRef.current) return;

            const code = data.charCodeAt(0);

            // Enter
            if (code === 13) {
                const cmd = inputRef.current.trim();
                inputRef.current = '';
                term.write('\r\n');

                if (!cmd) { term.write(PROMPT); return; }

                if (cmd === 'clear') { term.clear(); term.write(PROMPT); return; }

                if (cmd === 'ls') {
                    if (onRunFileRef.current) {
                        const files = await onRunFileRef.current('__ls__');
                        term.write((files || 'Aucun fichier').replace(/\n/g, '\r\n') + '\r\n' + PROMPT);
                    }
                    return;
                }

                // python3 fichier.py
                const pyMatch = cmd.match(/^python3?\s+(.+\.py)(\s.*)?$/);
                if (pyMatch) {
                    const filename = pyMatch[1].trim();
                    runningRef.current = true;
                    term.write('\x1b[2mExécution de ' + filename + '...\x1b[0m\r\n');
                    if (onRunFileRef.current) {
                        const output = await onRunFileRef.current(filename);
                        term.write((output || '').replace(/\n/g, '\r\n'));
                        if (output && !output.endsWith('\n')) term.write('\r\n');
                    }
                    runningRef.current = false;
                    term.write(PROMPT);
                    return;
                }

                term.write('\x1b[31mCommande non supportée: ' + cmd + '\x1b[0m\r\n');
                term.write('\x1b[2mEssaie: python3 main.py  |  ls  |  clear\x1b[0m\r\n');
                term.write(PROMPT);
                return;
            }

            // Backspace
            if (code === 127) {
                if (inputRef.current.length > 0) {
                    inputRef.current = inputRef.current.slice(0, -1);
                    term.write('\b \b');
                }
                return;
            }

            // Ctrl+C
            if (code === 3) {
                inputRef.current = '';
                term.write('^C\r\n' + PROMPT);
                return;
            }

            // Printable chars
            if (code >= 32) {
                inputRef.current += data;
                term.write(data);
            }
        });

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            term.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full" />;
});

export default TerminalComponent;
