'use client';
import { useState, useEffect, use, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
    CheckCircle, ChevronRight, Menu, X, BookOpen, Code2, Terminal,
    BarChart2, TrendingUp, Brain, FlaskConical, Target,
    Sigma, Database, Layers, Copy, Check, ArrowLeft, ChevronLeft,
    ZoomIn, ZoomOut, Maximize2, Clock, Award, Lightbulb,
    AlertCircle, Info, Star, Play, ChevronDown, ChevronUp, Monitor
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import QuizModal from '@/components/QuizModal';
import AskAIButton from '@/components/AskAIButton';
import QuizPanel from '@/components/QuizPanel';
import LessonComments from '@/components/LessonComments';
import AISummary from '@/components/AISummary';
import InteractiveChart from '@/components/InteractiveChart';
import InteractiveTable from '@/components/InteractiveTable';
import ThreeDScatterPlot from '@/components/ThreeDScatterPlot';
import PythonCodeTutor from '@/components/PythonCodeTutor';
import PythonExcelGenerator from '@/components/PythonExcelGenerator';
import VSCodePopup from '@/components/VSCodePopup';
import CyberTerminal from '@/components/CyberTerminal';
import RealTerminalPlayground from '@/components/RealTerminalPlayground';
import PowerBISimulator from '@/components/PowerBISimulator';
import { Bookmark, BookmarkCheck, Download } from 'lucide-react';

const RStudioEditor = dynamic(() => import('@/components/RStudioEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500">Chargement R IDE...</p>
            </div>
        </div>
    ),
});

const LESSON_ICONS = [
    <Terminal key="t" size={14} />, <Database key="d" size={14} />,
    <Sigma key="s" size={14} />, <BarChart2 key="b" size={14} />,
    <TrendingUp key="tr" size={14} />, <Brain key="br" size={14} />,
    <Target key="tg" size={14} />, <FlaskConical key="f" size={14} />,
    <Layers key="l" size={14} />, <Code2 key="c" size={14} />,
    <BookOpen key="bo" size={14} />, <Play key="p" size={14} />,
];

// Palette accent bleue/violette cohérente
const ACCENT = {
    primary: 'from-blue-600 to-violet-600',
    primarySolid: 'bg-blue-600',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    text: 'text-blue-400',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/20',
};

// ── Cercle de progression ──────────────────────────────────────────────────────
function CircleProgress({ value, size = 48, stroke = 4 }) {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="url(#prog)" strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// ── Bloc de code Python/R ─────────────────────────────────────────────────────
function CodeBlock({ code, lang = 'python' }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderLine = (line, idx) => {
        if (/^\s*#/.test(line)) {
            return <div key={idx} className="leading-6"><span className="text-[#6a9955] italic">{line}</span></div>;
        }

        const PY_KW = /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue|True|False|None|and|or|not|in|is|print|len|range|type|str|int|float|list|dict|tuple|set|open|input|super|self)\b/g;
        const R_KW = /\b(function|if|else|for|while|return|TRUE|FALSE|NULL|NA|library|require|cat|print|data\.frame|list|seq|mean|sd|sum|lm|ggplot|aes|filter|mutate|select|group_by)\b/g;
        const KW = lang === 'python' ? PY_KW : R_KW;

        const parts = [];
        const allMatches = [];
        let m;
        const re = new RegExp(KW.source, 'g');
        re.lastIndex = 0;
        while ((m = re.exec(line)) !== null) allMatches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: 'kw' });

        const strRe = /(["'])(?:(?!\1).)*\1/g;
        strRe.lastIndex = 0;
        const strMatches = [];
        while ((m = strRe.exec(line)) !== null) strMatches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: 'str' });

        const numRe = /\b(\d+\.?\d*)\b/g;
        numRe.lastIndex = 0;
        const numMatches = [];
        while ((m = numRe.exec(line)) !== null) numMatches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: 'num' });

        const all = [...allMatches, ...strMatches, ...numMatches]
            .sort((a, b) => a.start - b.start)
            .filter((x, i, arr) => i === 0 || x.start >= arr[i - 1].end);

        let cur = 0;
        for (const tok of all) {
            if (tok.start > cur) parts.push(<span key={cur} className="text-[#d4d4d4]">{line.slice(cur, tok.start)}</span>);
            if (tok.type === 'str') parts.push(<span key={tok.start} className="text-[#ce9178]">{tok.text}</span>);
            else if (tok.type === 'num') parts.push(<span key={tok.start} className="text-[#b5cea8]">{tok.text}</span>);
            else parts.push(<span key={tok.start} className="text-[#569cd6] font-medium">{tok.text}</span>);
            cur = tok.end;
        }
        if (cur < line.length) parts.push(<span key={cur} className="text-[#d4d4d4]">{line.slice(cur)}</span>);
        return <div key={idx} className="leading-6 hover:bg-white/[0.03] px-1 rounded">{parts}</div>;
    };

    const lines = code.split('\n');
    const label = lang === 'python' ? 'Python' : 'R Script';
    const badgeColor = lang === 'python' ? 'text-yellow-400' : 'text-teal-400';

    return (
        <div className="my-6 rounded-2xl overflow-hidden border border-[#2d2d2d] shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#2d2d2d]">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <span className={`text-xs font-mono font-semibold ${badgeColor} flex items-center gap-1.5`}>
                        <Code2 size={11} /> {label}
                    </span>
                </div>
                <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors px-2.5 py-1 rounded-lg hover:bg-white/10 border border-transparent hover:border-gray-700">
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
            </div>
            <div className="bg-[#0d1117] overflow-x-auto">
                <div className="flex">
                    <div className="select-none text-right pr-4 pl-3 py-4 text-[#3c4557] font-mono text-xs border-r border-[#1d2433] min-w-[3rem]">
                        {lines.map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                    </div>
                    <div className="flex-1 py-4 px-4 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre">
                        {lines.map((line, i) => renderLine(line, i))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Boîtes callout OpenClassrooms style ──────────────────────────────────────
function Callout({ type = 'info', children }) {
    const styles = {
        info:      { border: 'border-blue-500/40',   bg: 'bg-blue-500/8',    icon: <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />,      label: 'À noter',      labelColor: 'text-blue-400' },
        warning:   { border: 'border-amber-500/40',  bg: 'bg-amber-500/8',   icon: <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />, label: 'Attention',    labelColor: 'text-amber-400' },
        tip:       { border: 'border-emerald-500/40',bg: 'bg-emerald-500/8', icon: <Lightbulb size={16} className="text-emerald-400 mt-0.5 shrink-0" />, label: 'Conseil',      labelColor: 'text-emerald-400' },
        important: { border: 'border-violet-500/40', bg: 'bg-violet-500/8',  icon: <Star size={16} className="text-violet-400 mt-0.5 shrink-0" />,       label: 'À retenir',    labelColor: 'text-violet-400' },
    };
    const s = styles[type] || styles.info;
    return (
        <div className={`my-5 rounded-xl border ${s.border} ${s.bg} px-4 py-4`}>
            <div className="flex gap-3">
                {s.icon}
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${s.labelColor}`}>{s.label}</p>
                    <div className="text-sm text-gray-300 leading-relaxed">{children}</div>
                </div>
            </div>
        </div>
    );
}

// ── Texte Markdown enrichi ────────────────────────────────────────────────────
function RichText({ content }) {
    // Détecte les blocs callout dans le markdown : > [!info], > [!warning], etc.
    const parseCallouts = (text) => {
        return text.replace(
            /^>\s*\[!(info|warning|tip|important)\]\s*\n((?:>.*\n?)*)/gim,
            (_, type, body) => {
                const clean = body.replace(/^>\s?/gm, '').trim();
                return `CALLOUT_${type.toUpperCase()}:::${clean}:::END_CALLOUT\n`;
            }
        );
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 leading-snug">{children}</h1>
                ),
                h2: ({ children }) => (
                    <div className="flex items-center gap-3 mt-10 mb-4">
                        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-500 shrink-0" />
                        <h2 className="text-lg sm:text-xl font-bold text-white m-0">{children}</h2>
                    </div>
                ),
                h3: ({ children }) => (
                    <h3 className="text-base sm:text-lg font-semibold text-gray-100 mt-6 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 inline-block" />
                        {children}
                    </h3>
                ),
                p: ({ children }) => {
                    const text = String(children);
                    if (text.startsWith('CALLOUT_')) {
                        const match = text.match(/CALLOUT_(\w+):::([\s\S]*?):::END_CALLOUT/);
                        if (match) {
                            return <Callout type={match[1].toLowerCase()}><p className="m-0">{match[2]}</p></Callout>;
                        }
                    }
                    return <p className="text-gray-300 leading-8 mb-5 text-sm sm:text-base">{children}</p>;
                },
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
                ul: ({ children }) => <ul className="space-y-2.5 mb-5 ml-1">{children}</ul>,
                ol: ({ children }) => <ol className="space-y-2.5 mb-5 ml-1 list-decimal list-inside">{children}</ol>,
                li: ({ children }) => (
                    <li className="flex items-start gap-2.5 text-gray-300 text-sm sm:text-base">
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500" />
                        <span className="flex-1">{children}</span>
                    </li>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500/60 pl-5 py-2 my-5 rounded-r-xl bg-blue-500/5 text-gray-400 italic text-sm leading-7">
                        {children}
                    </blockquote>
                ),
                code: ({ inline, className, children }) => {
                    if (inline) return (
                        <code className="bg-[#1e2533] text-[#e2b857] px-2 py-0.5 rounded-md text-xs font-mono border border-[#2d3748]">{children}</code>
                    );
                    const lang = /language-(\w+)/.exec(className || '')?.[1] || 'python';
                    const content = String(children).replace(/\n$/, '');

                    if (lang === 'chart') {
                        return <InteractiveChart config={content} />;
                    }
                    if (lang === 'tableinteractive') {
                        return <InteractiveTable data={content} />;
                    }
                    if (lang === 'threed') {
                        return <ThreeDScatterPlot data={content} />;
                    }
                    if (lang === 'codetutor') {
                        return <PythonCodeTutor codeAndSteps={content} />;
                    }
                    if (lang === 'excelgenerator') {
                        return <PythonExcelGenerator config={content} />;
                    }

                    if (lang === 'cyberterminal') {
                        return <CyberTerminal config={content} />;
                    }

                    if (lang === 'realterminal') {
                        return <RealTerminalPlayground config={content} />;
                    }

                    if (lang === 'powerbi') {
                        return <PowerBISimulator config={content} />;
                    }

                    return <CodeBlock code={content} lang={lang} />;
                },
                pre: ({ children }) => <>{children}</>,
                table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-xl border border-gray-700/60 shadow-lg">
                        <table className="w-full text-xs sm:text-sm">{children}</table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-gradient-to-r from-blue-600/80 to-violet-600/80 text-white">{children}</thead>,
                th: ({ children }) => <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-sm">{children}</th>,
                td: ({ children }) => <td className="px-4 py-3 border-t border-gray-800/80 text-gray-300">{children}</td>,
                tr: ({ children }) => <tr className="hover:bg-white/4 transition-colors">{children}</tr>,
                hr: () => <hr className="border-gray-800 my-8" />,
                a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-400 transition-colors text-sm font-medium">
                        {children}
                    </a>
                ),
                img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="w-full h-auto object-cover rounded-2xl border border-white/10 shadow-2xl shadow-black/50 hover:scale-[1.01] transition-all duration-300 my-6" />
                ),
            }}
        >
            {parseCallouts(content)}
        </ReactMarkdown>
    );
}

// ── Bloc de contenu (texte ou code) ──────────────────────────────────────────
function ContentBlock({ block }) {
    const isCode = block.contentType === 'code';
    return (
        <div className="mb-8">
            {block.title && (
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isCode ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
                        {isCode ? <Code2 size={14} /> : <BookOpen size={14} />}
                    </div>
                    <h3 className="text-base font-bold text-white">{block.title}</h3>
                    <span className={`ml-auto text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold border ${isCode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {isCode ? 'Code' : 'Lecture'}
                    </span>
                </div>
            )}
            {isCode ? <CodeBlock code={block.content} lang="python" /> : <RichText content={block.content} />}
        </div>
    );
}

// ── Cours non trouvé ──────────────────────────────────────────────────────────
function CourseNotFound({ onRetry }) {
    return (
        <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <BookOpen className="text-blue-400" size={36} />
                </div>
                <h1 className="text-2xl font-bold mb-3">Cours non disponible</h1>
                <p className="text-gray-400 mb-8">Ce cours n'existe pas ou vous n'y êtes pas inscrit.</p>
                <div className="flex justify-center gap-3">
                    <button onClick={onRetry} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors">Réessayer</button>
                    <Link href="/dashboard" className="px-5 py-2.5 bg-white/8 hover:bg-white/15 rounded-xl text-sm font-semibold transition-colors border border-white/10">Tableau de bord</Link>
                </div>
            </div>
        </div>
    );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function CoursePage({ params }) {
    const { slug } = use(params);
    const router = useRouter();
    const { data: session, update } = useSession();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showIDE, setShowIDE] = useState(false);
    const [isVSCodePopupOpen, setIsVSCodePopupOpen] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [fullReadMode, setFullReadMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [completing, setCompleting] = useState(false);
    const mainContentRef = useRef(null);

    const zoomIn = () => setZoomLevel(v => Math.min(1.5, parseFloat((v + 0.1).toFixed(1))));
    const zoomOut = () => setZoomLevel(v => Math.max(0.7, parseFloat((v - 0.1).toFixed(1))));

    const toggleFullRead = async () => {
        try {
            if (!document.fullscreenElement && !fullReadMode) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
                setFullReadMode(true);
                setZoomLevel(1.1);
                setSidebarOpen(false);
            } else {
                if (document.fullscreenElement) await document.exitFullscreen();
                setIsFullscreen(false);
                setFullReadMode(false);
                setZoomLevel(1);
            }
        } catch {
            const next = !fullReadMode;
            setFullReadMode(next);
            setZoomLevel(next ? 1.1 : 1);
            if (next) setSidebarOpen(false);
        }
    };

    useEffect(() => {
        const handler = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                setFullReadMode(false);
                setZoomLevel(1);
            }
        };
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { fetchCourse(); }, [slug]);

    // Track active lesson viewing activity and heartbeat pings
    useEffect(() => {
        if (!activeLesson || !course) return;

        // Log lesson view event
        const logLessonView = async () => {
            try {
                await fetch('/api/tracking/activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'STUDENT_VIEW_LESSON',
                        courseId: course.id,
                        lessonId: activeLesson.id,
                        courseSlug: slug,
                        lessonSlug: activeLesson.slug || activeLesson.id,
                        lessonTitle: activeLesson.title
                    })
                });
            } catch (e) {
                console.error('[Lesson Tracker] Failed to log view:', e);
            }
        };

        logLessonView();

        // 30s heartbeat interval while active on this lesson
        const interval = setInterval(async () => {
            if (document.visibilityState !== 'visible') return;

            try {
                await fetch('/api/tracking/activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'STUDENT_HEARTBEAT',
                        courseId: course.id,
                        lessonId: activeLesson.id,
                        courseSlug: slug,
                        lessonSlug: activeLesson.slug || activeLesson.id,
                        lessonTitle: activeLesson.title,
                        duration: 30
                    })
                });
            } catch (e) {
                console.error('[Lesson Tracker] Heartbeat error:', e);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [activeLesson?.id, course?.id, slug]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${slug}`);
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                setFetchError(`${res.status}: ${err.error || res.statusText}`);
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.course) {
                if (!data.isEnrolled) { router.push(`/courses/${slug}`); return; }
                setCourse(data.course);
                const first = data.course.lessons.find(l => !l.userProgress?.[0]?.completed);
                setActiveLesson(first || data.course.lessons[0]);
            } else {
                setFetchError('Réponse invalide');
            }
            setLoading(false);
        } catch (e) {
            setFetchError(`Erreur réseau: ${e.message}`);
            setLoading(false);
        }
    };

    const selectLesson = (lesson) => {
        setActiveLesson(lesson);
        setBookmarked(false);
        checkBookmark(lesson.id);
        if (window.innerWidth < 1024) setSidebarOpen(false);
        
        // Fait défiler le conteneur principal des leçons vers le haut
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const checkBookmark = async (lessonId) => {
        try {
            const res = await fetch('/api/user/bookmarks');
            const data = await res.json();
            setBookmarked((data.bookmarks || []).some(b => b.lessonId === lessonId));
        } catch { }
    };

    const toggleBookmark = async () => {
        if (!activeLesson || bookmarkLoading) return;
        setBookmarkLoading(true);
        try {
            const res = await fetch('/api/user/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: activeLesson.id })
            });
            const data = await res.json();
            setBookmarked(data.bookmarked);
        } catch { }
        setBookmarkLoading(false);
    };

    const handleLessonComplete = async () => {
        if (!activeLesson || completing) return;
        setCompleting(true);
        const prev = { ...activeLesson };
        setCourse(c => ({ ...c, lessons: c.lessons.map(l => l.id === activeLesson.id ? { ...l, userProgress: [{ completed: true }] } : l) }));
        try {
            const res = await fetch('/api/tracking/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: activeLesson.id, courseId: course.id })
            });
            const data = await res.json();
            if (res.ok) {
                if (data.earnedXp > 0) await update({ ...session, user: { ...session?.user, xp: data.newTotalXp } });
                if (activeLesson.quizzes?.length > 0) {
                    setActiveQuiz(activeLesson.quizzes[0]);
                    setShowQuiz(true);
                } else {
                    const idx = course.lessons.findIndex(l => l.id === activeLesson.id);
                    if (idx !== -1 && idx < course.lessons.length - 1)
                        setTimeout(() => selectLesson(course.lessons[idx + 1]), 500);
                }
            } else {
                setCourse(c => ({ ...c, lessons: c.lessons.map(l => l.id === activeLesson.id ? prev : l) }));
            }
        } catch {
            setCourse(c => ({ ...c, lessons: c.lessons.map(l => l.id === activeLesson.id ? prev : l) }));
        }
        setCompleting(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
            <div className="flex flex-col items-center gap-5">
                <div className="relative">
                    <div className="w-14 h-14 border-2 border-blue-500/20 rounded-full" />
                    <div className="absolute inset-0 w-14 h-14 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-gray-500 text-sm">Chargement du cours...</p>
            </div>
        </div>
    );

    if (!course) return <CourseNotFound onRetry={() => { setLoading(true); setFetchError(null); fetchCourse(); }} />;

    const completedCount = course.lessons.filter(l => l.userProgress?.[0]?.completed).length;
    const progress = course.lessons.length > 0 ? Math.round((completedCount / course.lessons.length) * 100) : 0;
    const lessonIdx = Math.max(0, course.lessons.findIndex(l => l.id === activeLesson?.id));
    const isCompleted = activeLesson?.userProgress?.[0]?.completed;
    const hasContents = activeLesson?.contents?.length > 0;
    const isRCourse = slug === 'r-statistics-finance';
    const prevLesson = lessonIdx > 0 ? course.lessons[lessonIdx - 1] : null;
    const nextLesson = lessonIdx < course.lessons.length - 1 ? course.lessons[lessonIdx + 1] : null;

    return (
        <div className="flex h-screen bg-[#080c14] text-white overflow-hidden">

            {/* Overlay mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Onglet réouvrir sidebar quand cachée ── */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-6 h-16 bg-[#0b0f1a] border border-white/10 border-l-0 rounded-r-xl shadow-xl hover:bg-white/8 hover:border-blue-500/30 transition-all group"
                    title="Afficher le plan du cours"
                >
                    <ChevronRight size={13} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                </button>
            )}

            {/* ── SIDEBAR — fixe sur mobile, inline sur desktop ── */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                bg-[#0b0f1a] border-r border-white/6
                flex flex-col shrink-0
                transition-all duration-300 ease-in-out
                ${sidebarOpen
                    ? 'w-72 translate-x-0'
                    : 'w-0 -translate-x-full lg:translate-x-0 overflow-hidden'}
            `}>

                {/* Sidebar — En-tête cours */}
                <div className="p-5 border-b border-white/6">
                    {course.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/50">
                            <img src={course.image} alt={course.title} className="w-full h-24 object-cover" />
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-1.5">Formation</p>
                            <h2 className="font-bold text-sm leading-snug text-white line-clamp-2">{course.title}</h2>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-white/8 rounded-lg text-gray-500 hover:text-white transition-colors shrink-0">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Progression */}
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <CircleProgress value={progress} size={52} stroke={4} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white">{progress}%</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-gray-400">{completedCount} / {course.lessons.length} leçons</span>
                                {progress === 100 && (
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                                        <Award size={11} /> Terminé
                                    </span>
                                )}
                            </div>
                            <div className="w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner de téléchargement Antigravity si c'est un cours Antigravity ou Excel */}
                {course?.slug && (course.slug.includes('antigravity') || course.slug.includes('excel')) && (
                    <div className="mx-4 my-2 p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-transparent border border-blue-500/35 shadow-md shadow-blue-950/20 shrink-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                                <Terminal size={11} className="text-blue-400 animate-pulse" />
                            </div>
                            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wide">Assistant Antigravity</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">
                            Téléchargez l&apos;assistant desktop pour suivre les TP et exécuter vos scripts.
                        </p>
                        <Link
                            href="/telecharger"
                            target="_blank"
                            className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow-sm active:scale-[0.97]"
                        >
                            <Download size={11} /> Télécharger l&apos;assistant
                        </Link>
                    </div>
                )}

                {/* Sidebar — Liste des leçons avec codes couleurs */}
                <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {/* Légende des couleurs */}
                    <div className="mx-3 mb-3 px-3 py-2 rounded-xl bg-white/3 border border-white/6">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Progression</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1.5 text-[9px] text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"/> Terminée</span>
                            <span className="flex items-center gap-1.5 text-[9px] text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"/> En cours</span>
                            <span className="flex items-center gap-1.5 text-[9px] text-orange-300"><span className="w-2 h-2 rounded-full bg-orange-400 shrink-0"/> À faire</span>
                        </div>
                    </div>

                    {course.lessons.map((lesson, idx) => {
                        const done = lesson.userProgress?.[0]?.completed;
                        const active = activeLesson?.id === lesson.id;

                        // Couleurs selon statut
                        const statut = done ? 'done' : active ? 'active' : 'todo';
                        const borderColor = statut === 'done' ? 'border-emerald-500' : statut === 'active' ? 'border-blue-500' : 'border-orange-400/50';
                        const bgColor    = statut === 'done' ? 'bg-emerald-500/8'  : statut === 'active' ? 'bg-blue-500/12' : 'bg-orange-500/5 hover:bg-orange-500/8';
                        const iconBg     = statut === 'done' ? 'bg-emerald-500/20 border-emerald-500/35' : statut === 'active' ? 'bg-blue-500/25 border-blue-500/40' : 'bg-orange-500/12 border-orange-400/25';
                        const titleColor = statut === 'done' ? 'text-emerald-300' : statut === 'active' ? 'text-white' : 'text-orange-200/80';
                        const badge      = done ? { label: 'Terminée', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' }
                                         : active ? { label: 'En cours', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' }
                                         : { label: 'À faire', cls: 'bg-orange-500/10 text-orange-300 border-orange-400/20' };

                        return (
                            <button
                                key={lesson.id}
                                onClick={() => selectLesson(lesson)}
                                className={`
                                    w-full text-left mx-0 px-3 py-2.5 mb-1.5 flex items-start gap-3 transition-all
                                    border-l-[3px] rounded-r-xl ${borderColor} ${bgColor}
                                    focus:outline-none focus:ring-1 focus:ring-blue-500/40
                                `}
                            >
                                {/* Numéro + icône statut */}
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${iconBg}`}>
                                    {done
                                        ? <CheckCircle size={15} className="text-emerald-400" />
                                        : <span className={active ? 'text-blue-300 font-bold text-xs' : 'text-orange-300 font-bold text-xs'}>
                                            {idx + 1}
                                          </span>
                                    }
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Titre */}
                                    <p className={`text-[11px] font-semibold leading-snug transition-colors ${titleColor} line-clamp-2`}>
                                        {lesson.title}
                                    </p>
                                    {/* Méta-infos */}
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${badge.cls}`}>
                                            {badge.label}
                                        </span>
                                        <span className="flex items-center gap-0.5 text-[9px] text-gray-600">
                                            <Clock size={8} /> {lesson.duration} min
                                        </span>
                                    </div>
                                </div>

                                {active && <ChevronRight size={11} className="text-blue-400 shrink-0 mt-1" />}
                            </button>
                        );
                    })}
                </div>

                {/* Sidebar — Pied */}
                <div className="p-4 border-t border-white/6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-300 transition-colors">
                        <ArrowLeft size={13} /> Retour au tableau de bord
                    </Link>
                </div>

                {/* Flèche pour réduire la sidebar — collée sur le bord droit */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-1/2 -translate-y-1/2 -right-3.5 z-50 w-7 h-7 bg-[#0b0f1a] border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-blue-500/40 transition-all group shadow-lg"
                    title="Réduire le panneau"
                >
                    <ChevronLeft size={13} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                </button>
            </aside>

            {/* ── ZONE PRINCIPALE ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* ── TOP BAR ── */}
                <header className={`
                    h-14 border-b border-white/6 flex items-center px-4 sm:px-5 justify-between
                    bg-[#0b0f1a]/95 backdrop-blur-md shrink-0 gap-3
                    ${fullReadMode ? 'fixed top-0 left-0 right-0 z-40 border-b-0' : ''}
                `}>
                    {/* Gauche : menu + breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        {activeLesson && (
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-500/12 text-blue-400 border border-blue-500/25 font-semibold shrink-0">
                                    {lessonIdx + 1}/{course.lessons.length}
                                </span>
                                <ChevronRight size={12} className="text-gray-700 shrink-0 hidden sm:block" />
                                <span className="text-xs text-gray-400 truncate hidden sm:block">{activeLesson.title}</span>
                            </div>
                        )}
                    </div>

                    {/* Droite : actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button
                            onClick={() => setIsVSCodePopupOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/25 transition-all"
                        >
                            <Monitor size={14} />
                            <span className="hidden sm:inline">VS Code (Interactif)</span>
                        </button>

                        {isRCourse && (
                            <button
                                onClick={() => setShowIDE(v => !v)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${showIDE
                                    ? 'bg-teal-500 text-black'
                                    : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/25'
                                }`}
                            >
                                <BarChart2 size={14} />
                                <span className="hidden sm:inline">{showIDE ? 'Fermer IDE' : 'R IDE'}</span>
                            </button>
                        )}

                        {/* Zoom */}
                        <div className="hidden sm:flex items-center gap-0.5 bg-white/5 px-2 py-1.5 rounded-xl border border-white/8">
                            <button onClick={zoomOut} disabled={zoomLevel <= 0.7}
                                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed">
                                <ZoomOut size={14} />
                            </button>
                            <button onClick={() => setZoomLevel(1)}
                                className="text-[10px] text-gray-500 hover:text-white font-mono min-w-[36px] text-center transition-colors">
                                {Math.round(zoomLevel * 100)}%
                            </button>
                            <button onClick={zoomIn} disabled={zoomLevel >= 1.5}
                                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed">
                                <ZoomIn size={14} />
                            </button>
                        </div>

                        {/* Plein écran */}
                        <button
                            onClick={toggleFullRead}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-xs font-semibold ${
                                fullReadMode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Maximize2 size={14} />
                            <span className="hidden sm:inline">{fullReadMode ? 'Quitter' : 'Lecture'}</span>
                        </button>

                        {/* Favori */}
                        <button onClick={toggleBookmark} disabled={bookmarkLoading}
                            className={`p-2 rounded-xl transition-colors ${bookmarked ? 'text-amber-400 bg-amber-500/12 border border-amber-500/20' : 'text-gray-600 hover:text-white hover:bg-white/8 border border-transparent'}`}
                            title={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                    </div>
                </header>

                {/* ── SPLIT VIEW ── */}
                <div className="flex-1 flex overflow-hidden">

                    {/* ── CONTENU LEÇON ── */}
                    <main ref={mainContentRef} className={`overflow-y-auto transition-all duration-300
                        ${showIDE ? 'hidden lg:block lg:w-1/2 lg:border-r lg:border-white/6' : 'flex-1'}
                        ${fullReadMode ? 'pt-14' : ''}
                    `}>
                        <div
                            className="transition-all duration-300"
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: 'top center',
                            }}
                        >
                            {/* ── HERO LEÇON (style OpenClassrooms) ── */}
                            <div className={`relative overflow-hidden ${fullReadMode ? 'mx-auto max-w-4xl px-6 pt-8' : ''}`}>
                                <div className="bg-gradient-to-br from-[#0e1525] via-[#0b1020] to-[#080c14] border-b border-white/6 px-6 sm:px-10 lg:px-16 pt-10 pb-8">
                                    {/* Décoration fond */}
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/4 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/4 rounded-full blur-2xl pointer-events-none" />

                                    <div className="relative max-w-3xl">
                                        {/* Badges */}
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-500/12 text-blue-400 border border-blue-500/25 font-bold tracking-wider uppercase">
                                                Leçon {lessonIdx + 1}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white/4 border border-white/8 px-2.5 py-1 rounded-full">
                                                <Clock size={10} /> {activeLesson?.duration} min
                                            </span>
                                            {isCompleted && (
                                                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                                                    <CheckCircle size={10} /> Terminée
                                                </span>
                                            )}
                                        </div>

                                        {/* Titre */}
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                                            {activeLesson?.title}
                                        </h1>

                                        {/* Description courte (seulement si pas de contents structurés et pas de content markdown) */}
                                        {activeLesson?.content && !activeLesson?.contents?.length && (
                                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
                                                {activeLesson.content.substring(0, 200).replace(/[#*`\n]/g, ' ').trim()}...
                                            </p>
                                        )}

                                        {/* Séparateur décoratif */}
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                <div className="w-1 h-1 rounded-full bg-violet-500" />
                                                <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── CORPS DU CONTENU ── */}
                            <div className={`mx-auto px-6 sm:px-10 lg:px-16 py-10 ${fullReadMode ? 'max-w-4xl' : 'max-w-3xl'}`}>

                                {/* Résumé IA */}
                                {activeLesson && (hasContents || activeLesson.content) && (
                                    <div className="mb-8">
                                        <AISummary
                                            lessonTitle={activeLesson.title}
                                            lessonContent={hasContents ? activeLesson.contents.map(c => c.content).join('\n') : activeLesson.content}
                                        />
                                    </div>
                                )}

                                {/* Blocs de contenu */}
                                {hasContents ? (
                                    activeLesson.contents.map((block) => (
                                        <ContentBlock key={block.id} block={block} />
                                    ))
                                ) : activeLesson?.content ? (
                                    /* Fallback : rendu markdown du champ lesson.content */
                                    <div className="prose-custom">
                                        <RichText content={activeLesson.content} />
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                                            <BookOpen size={28} className="text-gray-600" />
                                        </div>
                                        <p className="text-gray-600 text-sm">Le contenu de cette leçon arrive bientôt.</p>
                                    </div>
                                )}

                                {/* Quiz */}
                                {activeLesson && (
                                    <div className="mt-10">
                                        <QuizPanel
                                            lessonId={activeLesson.id}
                                            isAdmin={session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'}
                                        />
                                    </div>
                                )}

                                {/* Commentaires */}
                                {activeLesson && (
                                    <div className="mt-10">
                                        <LessonComments
                                            lessonId={activeLesson.id}
                                            userId={session?.user?.id}
                                            userRole={session?.user?.role}
                                        />
                                    </div>
                                )}

                                {/* ── NAVIGATION BAS DE PAGE (style OpenClassrooms) ── */}
                                <div className="mt-12 pt-8 border-t border-white/6">

                                    {/* Bouton complétion */}
                                    {!isCompleted ? (
                                        <button
                                            onClick={handleLessonComplete}
                                            disabled={completing}
                                            className={`
                                                w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                                                font-bold text-base transition-all mb-6
                                                bg-gradient-to-r from-blue-600 to-violet-600
                                                hover:from-blue-500 hover:to-violet-500
                                                shadow-lg shadow-blue-500/20
                                                disabled:opacity-60 disabled:cursor-not-allowed
                                                active:scale-[0.98]
                                            `}
                                        >
                                            {completing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <CheckCircle size={20} />
                                            )}
                                            {completing ? 'Enregistrement...' : 'Marquer comme terminée'}
                                        </button>
                                    ) : (
                                        <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold text-sm mb-6">
                                            <CheckCircle size={18} /> Leçon terminée
                                        </div>
                                    )}

                                    {/* Prev / Next */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Précédente */}
                                        {prevLesson ? (
                                            <button
                                                onClick={() => selectLesson(prevLesson)}
                                                className="flex items-center gap-4 p-4 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-2xl transition-all group text-left"
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center shrink-0 group-hover:border-white/20 transition-colors">
                                                    <ChevronLeft size={16} className="text-gray-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-0.5">Précédente</p>
                                                    <p className="text-xs text-gray-400 group-hover:text-gray-300 truncate font-medium transition-colors">{prevLesson.title}</p>
                                                </div>
                                            </button>
                                        ) : <div />}

                                        {/* Suivante */}
                                        {nextLesson ? (
                                            <button
                                                onClick={() => selectLesson(nextLesson)}
                                                className="flex items-center gap-4 p-4 bg-blue-500/8 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/35 rounded-2xl transition-all group text-right justify-end"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-blue-500/80 uppercase tracking-wider font-semibold mb-0.5">Suivante</p>
                                                    <p className="text-xs text-blue-400 group-hover:text-blue-300 truncate font-medium transition-colors">{nextLesson.title}</p>
                                                </div>
                                                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 group-hover:border-blue-500/40 transition-all">
                                                    <ChevronRight size={16} className="text-blue-400" />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-4 p-4 bg-emerald-500/6 border border-emerald-500/20 rounded-2xl">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider font-semibold mb-0.5">Formation terminée</p>
                                                    <p className="text-xs text-emerald-400 font-medium">Félicitations !</p>
                                                </div>
                                                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                                                    <Award size={16} className="text-emerald-400" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ── PANNEAU R IDE ── */}
                    {isRCourse && showIDE && (
                        <>
                            <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setShowIDE(false)} />
                            <div className="fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto lg:w-1/2 flex flex-col bg-[#1e1e1e] overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2.5 bg-[#161b22] border-b border-[#2d2d2d] shrink-0">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2 h-2 rounded-full bg-teal-400" />
                                        <span className="text-xs font-semibold text-teal-300">R IDE</span>
                                        <span className="text-[10px] text-gray-600 font-mono">R 4.4.3</span>
                                    </div>
                                    <button onClick={() => setShowIDE(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <RStudioEditor />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal quiz */}
            {showQuiz && activeQuiz && (
                <QuizModal
                    quiz={activeQuiz}
                    onClose={() => setShowQuiz(false)}
                    onComplete={() => {
                        setShowQuiz(false);
                        const idx = course.lessons.findIndex(l => l.id === activeLesson.id);
                        if (idx < course.lessons.length - 1) selectLesson(course.lessons[idx + 1]);
                    }}
                />
            )}

            {isVSCodePopupOpen && (
                <VSCodePopup onClose={() => setIsVSCodePopupOpen(false)} />
            )}

            <AskAIButton context={activeLesson?.content || course?.description} />
        </div>
    );
}
