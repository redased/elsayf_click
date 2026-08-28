'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Loader2, ShieldCheck } from 'lucide-react';

export default function LessonComments({ lessonId, userId, userRole }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => { if (lessonId && open) fetchComments(); }, [lessonId, open]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/lessons/${lessonId}/comments`);
            const data = await res.json();
            setComments(data.comments || []);
        } catch { }
        setLoading(false);
    };

    const postComment = async () => {
        if (!content.trim()) return;
        setPosting(true);
        try {
            const res = await fetch(`/api/lessons/${lessonId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const data = await res.json();
            if (data.comment) {
                setComments(c => [...c, data.comment]);
                setContent('');
            } else {
                console.error("Erreur lors de l'envoi du commentaire:", data.error || "Réponse inconnue");
                alert("Erreur: " + (data.error || "Impossible d'envoyer le commentaire"));
            }
        } catch (err) {
            console.error("Erreur réseau/client:", err);
            alert("Erreur réseau ou client lors de l'envoi");
        }
        setPosting(false);
    };

    const deleteComment = async (commentId) => {
        await fetch(`/api/lessons/${lessonId}/comments?commentId=${commentId}`, { method: 'DELETE' });
        setComments(c => c.filter(x => x.id !== commentId));
    };

    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    return (
        <div className="mt-6 bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                        <MessageSquare size={15} className="text-gray-400" />
                    </div>
                    <span className="font-semibold text-white text-sm">Questions & Discussion</span>
                    {comments.length > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{comments.length}</span>
                    )}
                </div>
                <span className="text-gray-500">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="border-t border-gray-800 px-5 pb-5">
                    {/* Input */}
                    <div className="mt-4 flex gap-2">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(); } }}
                            placeholder="Pose ta question ou partage une remarque..."
                            rows={2}
                            className="flex-1 bg-white/5 border border-gray-700 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none resize-none transition-colors"
                        />
                        <button onClick={postComment} disabled={posting || !content.trim()}
                            className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all self-end">
                            {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                        </button>
                    </div>

                    {/* Comments list */}
                    {loading ? (
                        <div className="flex justify-center py-6"><Loader2 size={18} className="text-gray-600 animate-spin" /></div>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-sm text-gray-600 py-6">Aucun commentaire pour le moment. Sois le premier !</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {comments.map(c => (
                                <div key={c.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {c.user.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 bg-white/3 rounded-xl px-3.5 py-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-xs font-semibold text-white">{c.user.name}</span>
                                            {(c.user.role === 'ADMIN' || c.user.role === 'SUPER_ADMIN') && (
                                                <span className="flex items-center gap-0.5 text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full border border-violet-500/20">
                                                    <ShieldCheck size={9} /> Admin
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-600 ml-auto">
                                                {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </span>
                                            {(c.user.id === userId || isAdmin) && (
                                                <button onClick={() => deleteComment(c.id)} className="text-gray-700 hover:text-red-400 transition-colors ml-1">
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{c.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
