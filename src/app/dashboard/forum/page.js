'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
    Hash,
    Volume2,
    Settings,
    Mic,
    Headphones,
    Plus,
    Search,
    Bell,
    Users,
    HelpCircle,
    Send,
    Smile,
    Paperclip,
    MoreVertical,
    Gift,
    Sticker
} from 'lucide-react';
import { pusherClient } from '@/lib/pusher';

export default function ForumPage() {
    const { data: session } = useSession();
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Charger les channels au démarrage
    useEffect(() => {
        fetchChannels();
    }, []);

    // Charger les messages quand on change de channel + Pusher Subscription
    useEffect(() => {
        if (activeChannel) {
            fetchMessages(activeChannel.id);

            // Only subscribe to Pusher if client is available
            if (!pusherClient) {
                console.warn('Pusher client not available. Real-time updates disabled.');
                return;
            }

            const channelName = `channel-${activeChannel.id}`;
            pusherClient.subscribe(channelName);

            pusherClient.bind('new-message', (newMessage) => {
                setMessages((prev) => {
                    // Éviter les doublons (si le message existe déjà par l'API ou optimistic update mal géré)
                    if (prev.some(m => m.id === newMessage.id)) {
                        return prev;
                    }
                    // Si c'est mon propre message et que j'ai un message temporaire (optimistic)
                    // Idéalement on devrait le remplacer, mais ici on va simplement l'ajouter si non présent
                    // Une stratégie plus robuste serait de filtrer les messages temporaires
                    // qui correspondent à ce nouveau message.

                    // Nettoyage basique des messages temporaires (si le contenu est identique et auteur identique)
                    // C'est une heuristique simple.
                    const filtered = prev.filter(m =>
                        !(m.isTemp && m.content === newMessage.content && m.author.name === newMessage.author.name)
                    );

                    return [...filtered, newMessage];
                });
            });

            return () => {
                pusherClient.unsubscribe(channelName);
                pusherClient.unbind('new-message');
            };
        }
    }, [activeChannel]);

    // Auto-scroll vers le bas
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChannels = async () => {
        try {
            const res = await fetch('/api/forum/channels');
            const data = await res.json();
            setChannels(data.channels);
            if (data.channels.length > 0) {
                // Trouver le premier channel textuel
                const general = data.channels.find(c => c.name === 'général') || data.channels[0];
                setActiveChannel(general);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchMessages = async (channelId) => {
        try {
            const res = await fetch(`/api/forum/messages?channelId=${channelId}`);
            const data = await res.json();
            setMessages(data.messages);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChannel) return;

        // Optimistic update
        const tempMsg = {
            id: Date.now().toString(),
            content: newMessage,
            createdAt: new Date().toISOString(),
            author: {
                name: session?.user?.name || 'Moi',
                image: session?.user?.image,
                id: session?.user?.email // fallback
            },
            isTemp: true
        };
        setMessages([...messages, tempMsg]);
        setNewMessage('');

        try {
            const res = await fetch('/api/forum/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: tempMsg.content,
                    channelId: activeChannel.id
                })
            });

            if (res.ok) {
                const { message } = await res.json();
                // Remplacer le message temporaire par le vrai
                setMessages((prev) => prev.map(m => m.id === tempMsg.id ? message : m));
            }
        } catch (error) {
            console.error('Failed to send', error);
        }
    };

    // Grouper les channels par catégorie
    const groupedChannels = channels.reduce((acc, channel) => {
        const cat = channel.category || 'GÉNÉRAL';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(channel);
        return acc;
    }, {});

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#313338] text-white">Chargement du QG...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-[#313338] text-[#dbdee1] font-sans">

            {/* 1. Sidebar Channels (Gris foncé) */}
            <div className="w-60 bg-[#2b2d31] flex flex-col h-full">

                {/* Header Serveur */}
                <div className="h-12 px-4 flex items-center justify-between shadow-sm border-b border-[#1f2023] hover:bg-[#35373c] cursor-pointer transition-colors">
                    <h1 className="font-bold text-white truncate">E-Learning QG 🚀</h1>
                    {/* <ChevronDown size={20} /> */}
                </div>

                {/* Liste des Channels */}
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {Object.entries(groupedChannels).map(([category, channelList]) => (
                        <div key={category} className="mb-4">
                            <div className="flex items-center justify-between px-2 mb-1 group cursor-pointer hover:text-white">
                                <span className="text-xs font-bold text-[#949ba4] uppercase hover:text-[#dbdee1] transition-colors flex items-center gap-0.5">
                                    {/* <ChevronDown size={12} /> */}
                                    {category}
                                </span>
                                <Plus size={16} className="text-[#949ba4] opacity-0 group-hover:opacity-100 cursor-pointer" />
                            </div>

                            <div className="space-y-0.5">
                                {channelList.map(channel => (
                                    <div
                                        key={channel.id}
                                        onClick={() => setActiveChannel(channel)}
                                        className={`flex items-center px-2 py-1.5 rounded-[4px] cursor-pointer group transition-all ${activeChannel?.id === channel.id
                                            ? 'bg-[#404249] text-white'
                                            : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                                            }`}
                                    >
                                        <div className="mr-1.5 text-[#80848e]">
                                            {channel.type === 'voice' ? <Volume2 size={20} /> : <Hash size={20} />}
                                        </div>
                                        <div className="truncate font-medium flex-1">
                                            {channel.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Info Footer */}
                <div className="bg-[#232428] p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer p-1 rounded hover:bg-[#3f4147]">
                        <div className="relative">
                            {session?.user?.image ? (
                                <img src={session.user.image} className="w-8 h-8 rounded-full" alt="avatar" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                    {session?.user?.name?.[0] || 'U'}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#232428]"></div>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold text-white truncate max-w-[80px]">
                                {session?.user?.name || 'Utilisateur'}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-[#b5bac1] truncate max-w-[60px]">
                                    #{session?.user?.id?.substring(0, 4) || '0000'}
                                </div>
                                <div className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1 rounded" title={`XP: ${session?.user?.xp || 0}`}>
                                    Lvl {session?.user?.level || 1}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="p-1.5 hover:bg-[#3f4147] rounded"><Mic size={18} /></button>
                        <button className="p-1.5 hover:bg-[#3f4147] rounded"><Headphones size={18} /></button>
                        <button className="p-1.5 hover:bg-[#3f4147] rounded"><Settings size={18} /></button>
                    </div>
                </div>
            </div>

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#313338]">

                {/* Channel Header */}
                <div className="h-12 px-4 flex items-center justify-between border-b border-[#26272d] shadow-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Hash size={24} className="text-[#80848e]" />
                        <h3 className="font-bold text-white truncate">{activeChannel?.name}</h3>
                        {activeChannel?.description && (
                            <>
                                <div className="w-[1px] h-6 bg-[#3f4147] mx-2 hidden md:block"></div>
                                <span className="text-sm text-[#949ba4] truncate hidden md:block">{activeChannel.description}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-[#b5bac1]">
                        {/* <Bell size={24} className="cursor-pointer hover:text-[#dbdee1]" /> */}
                        {/* <Pin size={24} className="cursor-pointer hover:text-[#dbdee1]" /> */}
                        <Users size={24} className="cursor-pointer hover:text-[#dbdee1] hidden md:block" />
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Rechercher"
                                className="bg-[#1e1f22] text-sm text-[#dbdee1] rounded-sm py-1 px-2 pr-8 w-36 transition-all focus:w-60 outline-none"
                            />
                            <Search size={16} className="absolute right-2 top-1.5 text-[#949ba4]" />
                        </div>
                        <HelpCircle size={24} className="cursor-pointer hover:text-[#dbdee1]" />
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-start justify-end p-4 mb-4">
                            <div className="w-16 h-16 bg-[#41434a] rounded-full flex items-center justify-center mb-4">
                                <Hash size={40} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Bienvenue dans #{activeChannel?.name} !</h2>
                            <p className="text-[#b5bac1]">C'est le début de ce salon. Dites bonjour ! 👋</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isConsecutive = idx > 0 && messages[idx - 1].author.id === msg.author.id && (new Date(msg.createdAt) - new Date(messages[idx - 1].createdAt) < 5 * 60 * 1000);

                            if (isConsecutive) {
                                return (
                                    <div key={msg.id} className="pl-[72px] pr-4 py-0.5 hover:bg-[#2e3035] group -mt-2">
                                        <p className="text-[#dbdee1]">{msg.content}</p>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className="flex gap-4 px-4 py-1 hover:bg-[#2e3035] group mt-[17px]">
                                    <div className="flex-shrink-0 cursor-pointer mt-0.5">
                                        {msg.author.image ? (
                                            <img src={msg.author.image} alt={msg.author.name} className="w-10 h-10 rounded-full hover:opacity-80" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg hover:opacity-80">
                                                {msg.author.name?.[0] || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white hover:underline cursor-pointer">
                                                {msg.author.name}
                                            </span>
                                            <span className="text-xs text-[#949ba4] ml-1">
                                                {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className={`text-[#dbdee1] whitespace-pre-wrap ${msg.isTemp ? 'opacity-70' : ''}`}>
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="px-4 pb-6 pt-2">
                    <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                        <button className="text-[#b5bac1] hover:text-[#dbdee1] p-1 rounded-full hover:bg-[#3f4147]">
                            <Plus size={20} className="bg-[#b5bac1] text-[#383a40] rounded-full p-0.5" />
                        </button>

                        <form onSubmit={handleSendMessage} className="flex-1">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Envoyer un message dans #${activeChannel?.name}`}
                                className="w-full bg-transparent text-[#dbdee1] placeholder-[#949ba4] outline-none"
                            />
                        </form>

                        <div className="flex items-center gap-3 text-[#b5bac1]">
                            <Gift size={24} className="cursor-pointer hover:text-[#dbdee1]" />
                            <Sticker size={24} className="cursor-pointer hover:text-[#dbdee1]" />
                            <Smile size={24} className="cursor-pointer hover:text-[#dbdee1]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Members Sidebar (Hidden on small screens) */}
            <div className="w-60 bg-[#2b2d31] border-l border-[#26272d] hidden lg:flex flex-col p-4 overflow-y-auto">
                <h3 className="text-xs font-bold text-[#949ba4] uppercase mb-4">En ligne — 3</h3>

                {/* Mock Users */}
                <div className="flex items-center gap-3 mb-4 opacity-100 hover:bg-[#35373c] p-1.5 rounded cursor-pointer">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">A</div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2b2d31]"></div>
                    </div>
                    <div>
                        <div className="text-white font-medium text-sm">Admin</div>
                        <div className="text-xs text-[#b5bac1]">Joue à Visual Studio Code</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4 opacity-100 hover:bg-[#35373c] p-1.5 rounded cursor-pointer">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">M</div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2b2d31]"></div>
                    </div>
                    <div className="text-[#949ba4] font-medium text-sm">Mentor Python</div>
                </div>

                <div className="flex items-center gap-3 mb-4 opacity-50 hover:bg-[#35373c] p-1.5 rounded cursor-pointer">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">R</div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#2b2d31]"></div>
                    </div>
                    <div className="text-[#949ba4] font-medium text-sm text-[#80848e]">Reda (Hors-ligne)</div>
                </div>

                <h3 className="text-xs font-bold text-[#949ba4] uppercase mb-4 mt-4">Faculté USTHB — 12</h3>
                {/* ... more mock users ... */}
            </div>
        </div>
    );
}

// Add some CSS to global.css for custom scrollbar later if needed, but Tailwind helps.
