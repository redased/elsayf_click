'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, X, Send, Video, Bell, Check, CheckCheck, Tv2 } from 'lucide-react';
import Link from 'next/link';

export default function ChatWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Charger les messages
  const fetchMessages = async () => {
    if (!session?.user) return;
    try {
      setLoading(true);
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger le nombre de messages non lus
  const fetchUnreadCount = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/chat/unread');
      const data = await res.json();
      if (typeof data.unreadCount === 'number') {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Erreur comptage non lus:', error);
    }
  };

  // Marquer un message comme lu
  const markAsRead = async (messageId) => {
    try {
      await fetch('/api/chat/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchUnreadCount();

    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(() => {
      fetchMessages();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Marquer tous les messages comme lus quand on ouvre le chat
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messages.forEach(msg => {
        if (!msg.isRead && msg.toUserId === session?.user?.id) {
          markAsRead(msg.id);
        }
      });
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  if (!session?.user) return null;

  const renderMessage = (msg) => {
    const metadata = msg.metadata ? JSON.parse(msg.metadata) : null;
    const isFromAdmin = msg.fromUser.role === 'ADMIN' || msg.fromUser.role === 'SUPER_ADMIN';

    return (
      <div key={msg.id} className={`mb-4 ${isFromAdmin ? 'bg-violet-500/10 border border-violet-500/20 rounded-xl p-3' : ''}`}>
        <div className="flex items-start gap-2">
          {msg.fromUser.image ? (
            <img src={msg.fromUser.image} alt={msg.fromUser.name} className="w-8 h-8 rounded-full shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {msg.fromUser.name?.[0]?.toUpperCase() || 'A'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-white">{msg.fromUser.name}</span>
              {isFromAdmin && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/30 text-violet-300 font-bold">
                  {msg.fromUser.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'ADMIN'}
                </span>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Message type: Invitation Jitsi */}
            {msg.messageType === 'jitsi_invite' && metadata ? (
              <div className="bg-[#0d1117] border border-green-500/30 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Video size={16} className="text-green-400" />
                  <span className="text-sm font-bold text-green-400">Invitation Session Live</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{msg.message}</p>
                <a
                  href={`https://meet.jit.si/elsayf-${metadata.roomId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-bold transition-all"
                >
                  <Video size={14} /> Rejoindre "{metadata.roomLabel || metadata.roomId}"
                </a>
              </div>
            ) : msg.messageType === 'twitch_invite' && metadata ? (
              /* Message type: Invitation Twitch */
              <a
                href={metadata.url || `https://twitch.tv/${metadata.channel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-purple-900/60 to-indigo-900/40 border border-purple-500/40 rounded-xl p-3 mt-2 hover:border-purple-400/60 hover:from-purple-900/80 transition-all active:scale-95 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Tv2 size={16} className="text-purple-400 shrink-0" />
                  <span className="text-sm font-bold text-purple-300">Live Twitch en cours !</span>
                  <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse ml-auto shrink-0">● LIVE</span>
                </div>
                <p className="text-sm text-gray-200 mb-3">{msg.message}</p>
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-900/40">
                  <Tv2 size={16} />
                  Regarder sur Twitch →
                </div>
                <p className="text-center text-[10px] text-purple-400/60 mt-2 font-mono">
                  twitch.tv/{metadata.channel}
                </p>
              </a>
            ) : msg.messageType === 'announcement' ? (
              /* Message type: Annonce */
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={16} className="text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400">Annonce Importante</span>
                </div>
                <p className="text-sm text-gray-200">{msg.message}</p>
              </div>
            ) : (
              /* Message type: Texte normal */
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.message}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-900/40 flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Widget de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-[#0a0e17] border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-white" />
              <span className="text-white font-bold text-sm">Messages</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle size={40} className="text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm font-semibold">Aucun message</p>
                <p className="text-gray-600 text-xs mt-1">Les messages de vos instructeurs apparaîtront ici</p>
              </div>
            ) : (
              <>
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Footer info */}
          <div className="px-4 py-2 bg-white/5 border-t border-gray-800 text-center shrink-0">
            <p className="text-xs text-gray-500">
              Les messages se rafraîchissent automatiquement
            </p>
          </div>
        </div>
      )}
    </>
  );
}
