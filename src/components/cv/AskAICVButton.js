'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, X, Send, Maximize2, Minimize2, Trash2, Plus, 
  MessageSquare, ChevronLeft, FileText, CheckCircle2, Loader2,
  Paperclip, ArrowRight, Zap, RefreshCw, Briefcase, GraduationCap, Wrench
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AskAICVButton({ currentCvData, onApplyToCV }) {
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Charger l'historique depuis localStorage au montage
  useEffect(() => {
    try {
      const savedThreads = localStorage.getItem('mycv_ai_threads');
      const savedActiveId = localStorage.getItem('mycv_ai_active_thread_id');

      if (savedThreads) {
        const parsed = JSON.parse(savedThreads);
        setThreads(parsed);
        if (parsed.length > 0) {
          if (savedActiveId && parsed.some((t) => t.id === savedActiveId)) {
            setActiveThreadId(savedActiveId);
          } else {
            setActiveThreadId(parsed[0].id);
          }
        }
      } else {
        const defaultThread = {
          id: Date.now().toString(),
          title: 'Remplissage intelligent du CV',
          messages: [
            {
              role: 'assistant',
              content: `👋 Bonjour ! Je suis votre **Coach Carrière & Rédacteur de CV IA**.

Collez votre parcours brut, votre profil LinkedIn, vos notes d'expérience ou importez un document : **je vais résumer votre carrière, l'optimiser pour les filtres ATS et remplir automatiquement tous les champs de votre CV** !`
            }
          ],
          updatedAt: Date.now()
        };
        setThreads([defaultThread]);
        setActiveThreadId(defaultThread.id);
        localStorage.setItem('mycv_ai_threads', JSON.stringify([defaultThread]));
        localStorage.setItem('mycv_ai_active_thread_id', defaultThread.id);
      }
    } catch (e) {
      console.warn('Erreur chargement threads CV IA:', e);
    }
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const currentMessages = activeThread ? activeThread.messages : [];

  // Auto-scroll en bas de discussion
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, loading, isOpen]);

  // Gestion des fichiers joints (texte, markdown, json)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result || '';
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' Ko',
        content: typeof content === 'string' ? content.substring(0, 8000) : ''
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Envoi d'un message
  const handleSendMessage = async (customPrompt) => {
    const textToSend = typeof customPrompt === 'string' ? customPrompt : question;
    if (!textToSend.trim() && !attachedFile) return;

    let userMsgContent = textToSend.trim();
    let displayContent = textToSend.trim();

    if (attachedFile) {
      displayContent = `📎 [Document joint: ${attachedFile.name}]\n\n${displayContent}`;
      userMsgContent = `[DOCUMENT ATTACHÉ: ${attachedFile.name}]\n${attachedFile.content}\n\nInstructions de l'utilisateur : ${textToSend.trim()}`;
    }

    const userMsg = {
      role: 'user',
      content: userMsgContent,
      displayContent
    };

    const currentThread = threads.find((t) => t.id === activeThreadId);
    if (!currentThread) return;

    const updatedMessages = [...currentThread.messages, userMsg];

    // Titre automatique selon la 1ère question
    let updatedTitle = currentThread.title;
    if (currentThread.messages.length <= 1) {
      const words = (displayContent || userMsgContent).split(' ');
      updatedTitle = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
    }

    const updatedThread = {
      ...currentThread,
      title: updatedTitle,
      messages: updatedMessages,
      updatedAt: Date.now()
    };

    const nextThreads = threads.map((t) => (t.id === activeThreadId ? updatedThread : t));
    setThreads(nextThreads);
    localStorage.setItem('mycv_ai_threads', JSON.stringify(nextThreads));

    setQuestion('');
    setAttachedFile(null);
    setLoading(true);

    try {
      const history = currentThread.messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/cv-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content,
          history,
          currentCvData
        })
      });

      const data = await res.json();
      const assistantMsg = {
        role: 'assistant',
        content: data.answer || "Désolé, je n'ai pas pu générer une réponse."
      };

      setThreads((prev) => {
        const latestThread = prev.find((t) => t.id === activeThreadId);
        if (!latestThread) return prev;
        const finalThread = {
          ...latestThread,
          messages: [...latestThread.messages, assistantMsg],
          updatedAt: Date.now()
        };
        const finalThreads = prev.map((t) => (t.id === activeThreadId ? finalThread : t));
        localStorage.setItem('mycv_ai_threads', JSON.stringify(finalThreads));
        return finalThreads;
      });
    } catch (err) {
      console.error('Erreur API CV Assistant:', err);
      const errorMsg = { role: 'assistant', content: "Erreur de connexion avec l'IA. Veuillez réessayer." };
      setThreads((prev) => {
        const latestThread = prev.find((t) => t.id === activeThreadId);
        if (!latestThread) return prev;
        const finalThread = {
          ...latestThread,
          messages: [...latestThread.messages, errorMsg],
          updatedAt: Date.now()
        };
        const finalThreads = prev.map((t) => (t.id === activeThreadId ? finalThread : t));
        localStorage.setItem('mycv_ai_threads', JSON.stringify(finalThreads));
        return finalThreads;
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle conversation
  const handleCreateNewThread = () => {
    const newThread = {
      id: Date.now().toString(),
      title: 'Nouvelle session CV',
      messages: [
        {
          role: 'assistant',
          content: `👋 Comment puis-je vous aider ? Partagez-moi vos expériences ou vos questions pour concevoir le CV idéal.`
        }
      ],
      updatedAt: Date.now()
    };
    const nextThreads = [newThread, ...threads];
    setThreads(nextThreads);
    setActiveThreadId(newThread.id);
    localStorage.setItem('mycv_ai_threads', JSON.stringify(nextThreads));
    localStorage.setItem('mycv_ai_active_thread_id', newThread.id);
    setShowSidebar(false);
  };

  // Supprimer une conversation
  const handleDeleteThread = (threadId, e) => {
    e.stopPropagation();
    const filtered = threads.filter((t) => t.id !== threadId);
    if (filtered.length === 0) {
      handleCreateNewThread();
      return;
    }
    setThreads(filtered);
    localStorage.setItem('mycv_ai_threads', JSON.stringify(filtered));
    if (activeThreadId === threadId) {
      setActiveThreadId(filtered[0].id);
      localStorage.setItem('mycv_ai_active_thread_id', filtered[0].id);
    }
  };

  // Extraction et application du tag [AUTO_FILL_CV: {...}]
  const parseAutoFillPayload = (content) => {
    if (!content) return null;
    const match = content.match(/\[AUTO_FILL_CV:\s*({[\s\S]*?})\]/);
    if (!match || !match[1]) return null;
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      return null;
    }
  };

  const handleApplyPayload = (payload) => {
    if (!payload || !onApplyToCV) return;
    onApplyToCV(payload);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  // Suggestions rapides pour le démarrage
  const quickPrompts = [
    {
      label: "✨ Résumer mon parcours & remplir le CV",
      prompt: "Voici mon parcours : j'ai 4 ans d'expérience dans mon domaine. Peux-tu analyser mon profil, rédiger une accroche professionnelle percutante avec mes compétences clés et remplir les champs de mon CV ?"
    },
    {
      label: "🎯 Optimiser mon accroche pro (ATS)",
      prompt: "Peux-tu rédiger une accroche professionnelle percutante de 3 ou 4 lignes qui met en avant mes compétences et franchit les filtres ATS ?"
    },
    {
      label: "💼 Améliorer mes puces d'expériences",
      prompt: "Peux-tu reformuler mes expériences professionnelles en utilisant des verbes d'action et des métriques chiffrées (% d'amélioration, délais, volumes) ?"
    },
    {
      label: "🛠️ Suggérer les compétences clés recherchées",
      prompt: "Quelles sont les 6 compétences techniques et outils indispensables à mettre sur mon CV pour mon métier aujourd'hui ?"
    }
  ];

  return (
    <>
      {/* Bouton Déclencheur Flottant (En bas à droite) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-black text-xs sm:text-sm shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/70 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          title="Ouvrir l'Assistant IA pour rédiger et remplir votre CV"
        >
          <div className="relative">
            <Sparkles size={18} className="text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-purple-950 animate-pulse" />
          </div>
          <span className="tracking-wide">Assistant IA CV</span>
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
            Remplissage auto
          </span>
        </button>
      </div>

      {/* Modal / Fenêtre de Discussion Flottante */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 print:hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10'
              : 'bottom-4 right-4 left-4 sm:left-auto sm:w-[460px] md:w-[500px] h-[600px] max-h-[85vh]'
          }`}
        >
          <div className="flex flex-col h-full bg-[#0a0f22]/95 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl text-slate-100">
            
            {/* Header de la discussion */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Historique des discussions"
                >
                  <MessageSquare size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      Assistant IA • CV Studio
                    </h3>
                    <p className="text-[10px] text-purple-300/80">Remplissage automatique & Conseils ATS</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCreateNewThread}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Nouvelle discussion"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
                  title={isExpanded ? "Réduire" : "Agrandir"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Notification de CV appliqué */}
            {appliedNotice && (
              <div className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shrink-0 animate-in fade-in duration-150">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Votre CV a été rempli avec succès ! Vérifiez l'aperçu en direct.
                </span>
                <button onClick={() => setAppliedNotice(false)} className="text-white/80 hover:text-white">
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Corps du Chat + Sidebar de discussion */}
            <div className="flex-1 relative overflow-hidden flex">
              
              {/* Sidebar Historique des sessions */}
              {showSidebar && (
                <div className="absolute inset-y-0 left-0 w-64 bg-slate-950/95 border-r border-white/10 z-20 flex flex-col p-3 space-y-2 backdrop-blur-xl animate-in slide-in-from-left duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-gray-300">Vos sessions IA</span>
                    <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-white">
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleCreateNewThread}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-purple-500/30 transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Nouvelle session
                  </button>
                  <div className="flex-1 overflow-y-auto space-y-1 pt-1">
                    {threads.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveThreadId(t.id);
                          localStorage.setItem('mycv_ai_active_thread_id', t.id);
                          setShowSidebar(false);
                        }}
                        className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          t.id === activeThreadId
                            ? 'bg-purple-600/30 text-white border border-purple-500/40 font-bold'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate flex-1 pr-2">{t.title}</span>
                        <button
                          onClick={(e) => handleDeleteThread(t.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded"
                          title="Supprimer la discussion"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zone des messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
                
                {/* Suggestions initiales */}
                {currentMessages.length <= 1 && (
                  <div className="space-y-2.5 mb-4">
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <Zap size={13} className="text-amber-400" /> Actions rapides en 1 clic :
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {quickPrompts.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q.prompt)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/30 text-left text-xs text-gray-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <span className="font-semibold">{q.label}</span>
                          <ArrowRight size={13} className="text-gray-500 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Liste des messages */}
                {currentMessages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const autoFillData = !isUser ? parseAutoFillPayload(msg.content) : null;
                  const cleanContent = !isUser
                    ? msg.content.replace(/\[AUTO_FILL_CV:[\s\S]*?\]/, '').trim()
                    : msg.displayContent || msg.content;

                  return (
                    <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}>
                      <div
                        className={`max-w-[90%] sm:max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
                            : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none prose prose-invert prose-xs max-w-none'
                        }`}
                      >
                        {isUser ? (
                          <div className="whitespace-pre-wrap">{cleanContent}</div>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
                        )}
                      </div>

                      {/* Carte d'Auto-Fill si l'IA a extrait les informations du parcours */}
                      {autoFillData && (
                        <div className="w-full max-w-[90%] sm:max-w-[85%] p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 via-indigo-950/40 to-slate-900 border-2 border-purple-500/40 space-y-3 shadow-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles size={15} className="text-yellow-300 animate-pulse" />
                              <strong className="text-white text-xs sm:text-sm">Parcours CV Extrait & Structuré</strong>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              Prêt à injecter
                            </span>
                          </div>

                          {/* Résumé des champs extraits */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                            {autoFillData.personal?.title && (
                              <div className="col-span-2 flex items-center gap-1.5 truncate">
                                <Briefcase size={12} className="text-purple-400 shrink-0" />
                                <span className="text-white font-medium truncate">{autoFillData.personal.title}</span>
                              </div>
                            )}
                            {autoFillData.personal?.firstName && (
                              <div className="truncate">
                                👤 {autoFillData.personal.firstName} {autoFillData.personal.lastName || ''}
                              </div>
                            )}
                            {autoFillData.experiences?.length > 0 && (
                              <div>💼 {autoFillData.experiences.length} expérience(s)</div>
                            )}
                            {autoFillData.skills?.length > 0 && (
                              <div>🛠️ {autoFillData.skills.length} compétence(s)</div>
                            )}
                            {autoFillData.education?.length > 0 && (
                              <div>🎓 {autoFillData.education.length} diplôme(s)</div>
                            )}
                          </div>

                          {/* Bouton d'action pour appliquer sur le CV */}
                          <button
                            onClick={() => handleApplyPayload(autoFillData)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <CheckCircle2 size={15} />
                            <span>Remplir automatiquement mon CV</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-2 text-purple-300 text-xs p-3 rounded-2xl bg-white/5 border border-white/10 w-fit">
                    <Loader2 size={15} className="animate-spin text-purple-400" />
                    <span>Analyse du parcours et rédaction en cours...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Fichier joint en cours */}
            {attachedFile && (
              <div className="px-4 py-2 bg-purple-950/40 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-200 shrink-0">
                <span className="flex items-center gap-1.5 truncate">
                  <Paperclip size={13} className="text-purple-400 shrink-0" />
                  <span className="truncate font-semibold">{attachedFile.name}</span>
                  <span className="text-[10px] text-gray-400">({attachedFile.size})</span>
                </span>
                <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-white p-1">
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Input d'envoi */}
            <div className="p-3 bg-slate-950 border-t border-white/10 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Upload fichier joint */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Joindre un document ou d'anciennes notes (txt, pdf, doc)"
                >
                  <Paperclip size={16} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.json,.csv,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </button>

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Collez votre parcours, vos notes ou posez une question..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />

                <button
                  type="submit"
                  disabled={loading || (!question.trim() && !attachedFile)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow active:scale-95"
                  title="Envoyer"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
