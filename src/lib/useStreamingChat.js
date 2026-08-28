'use client';
import { useState, useRef } from 'react';

export function useStreamingChat(apiPath, initialMessage, onFilesChanged) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: initialMessage, reasoning: null }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const abortRef = useRef(null);

    const sendMessage = async (codeContext) => {
        const text = userInput.trim();
        if (!text || isLoading) return;

        const userMsg = { role: 'user', content: text };
        const assistantMsg = { role: 'assistant', content: '', reasoning: '', streaming: true };

        setMessages(prev => [...prev, userMsg, assistantMsg]);
        setUserInput('');
        setIsLoading(true);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await fetch(apiPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                    codeContext,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: res.statusText }));
                setMessages(prev => {
                    const arr = [...prev];
                    arr[arr.length - 1] = { role: 'assistant', content: `❌ ${err.error || 'Erreur'}`, reasoning: null };
                    return arr;
                });
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop();

                for (const part of parts) {
                    if (!part.startsWith('data: ')) continue;
                    const raw = part.slice(6).trim();
                    if (!raw) continue;

                    try {
                        const event = JSON.parse(raw);

                        if (event.t === 'done') break;

                        if (event.t === 'files_changed' && onFilesChanged) {
                            onFilesChanged();
                            continue;
                        }

                        if (event.t === 'tool_call') {
                            const label = event.name === 'write_file'
                                ? `📝 Écriture → ${event.args?.project}/${event.args?.name}`
                                : event.name === 'read_file'
                                ? `📖 Lecture → ${event.args?.project}/${event.args?.name}`
                                : `🔍 Liste des fichiers`;
                            setMessages(prev => {
                                const arr = [...prev];
                                arr[arr.length - 1] = {
                                    ...arr[arr.length - 1],
                                    toolActions: [...(arr[arr.length - 1].toolActions || []), { label, status: 'running' }]
                                };
                                return arr;
                            });
                            continue;
                        }

                        if (event.t === 'tool_result') {
                            const isWrite = event.name === 'write_file';
                            setMessages(prev => {
                                const arr = [...prev];
                                const last = arr[arr.length - 1];
                                const actions = [...(last.toolActions || [])];
                                const idx = actions.map(a => a.status).lastIndexOf('running');
                                if (idx !== -1) actions[idx] = { ...actions[idx], status: isWrite ? 'done' : 'info' };
                                arr[arr.length - 1] = { ...last, toolActions: actions };
                                return arr;
                            });
                            if (isWrite && onFilesChanged) onFilesChanged();
                            continue;
                        }

                        if (event.t === 'error') {
                            setMessages(prev => {
                                const arr = [...prev];
                                arr[arr.length - 1] = { role: 'assistant', content: `❌ ${event.v}`, reasoning: null };
                                return arr;
                            });
                            break;
                        }

                        setMessages(prev => {
                            const arr = [...prev];
                            const last = arr[arr.length - 1];
                            if (last.role !== 'assistant') return arr;
                            arr[arr.length - 1] = {
                                ...last,
                                content: event.t === 'c' ? last.content + event.v : last.content,
                                reasoning: event.t === 'r' ? (last.reasoning || '') + event.v : last.reasoning,
                            };
                            return arr;
                        });
                    } catch (_) {}
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setMessages(prev => {
                    const arr = [...prev];
                    arr[arr.length - 1] = { role: 'assistant', content: `❌ Erreur réseau: ${err.message}`, reasoning: null };
                    return arr;
                });
            }
        } finally {
            setMessages(prev => {
                const arr = [...prev];
                const last = arr[arr.length - 1];
                if (last?.streaming) arr[arr.length - 1] = { ...last, streaming: false };
                return arr;
            });
            setIsLoading(false);
        }
    };

    return { messages, isLoading, userInput, setUserInput, sendMessage };
}
