'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    BookOpen, Shield, Users, CheckCircle, AlertTriangle, Info,
    ArrowRight, Crown, Mail, Eye, Trash2, RefreshCw,
    ChevronDown, ChevronRight, BarChart, Lock, Unlock,
    UserCheck, UserX, AlertCircle, Lightbulb, Terminal,
    Globe, LayoutDashboard, PlayCircle, LogIn
} from 'lucide-react';

const steps = [
    {
        num: 1,
        icon: Globe,
        color: 'from-blue-600 to-cyan-600',
        glow: 'shadow-blue-500/20',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        title: "L'étudiant visite la page publique du cours",
        url: '/courses/r-statistics-finance',
        desc: "L'étudiant découvre le cours R pour Statistiques & Finance sur la page publique. Il voit que c'est une formation sur invitation uniquement.",
        detail: "La page affiche une bannière bleue « Formation accessible uniquement sur invitation ». Dans le panneau latéral droit, un formulaire permet à l'étudiant de soumettre son adresse email pour demander l'accès.",
        warning: null,
        tip: "L'étudiant doit être connecté pour que son email soit pré-rempli automatiquement dans le formulaire.",
        substeps: [
            { icon: Eye, text: "Il voit la bannière « Sur invitation uniquement »" },
            { icon: Mail, text: "Il entre son email et clique « Demander un accès »" },
            { icon: CheckCircle, text: "Un message vert de confirmation s'affiche" },
        ]
    },
    {
        num: 2,
        icon: Mail,
        color: 'from-purple-600 to-violet-600',
        glow: 'shadow-purple-500/20',
        badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        title: "La demande est enregistrée en base",
        url: null,
        desc: "Quand l'étudiant soumet le formulaire, le système crée un enregistrement « CourseInvitation » avec le statut PENDING (en attente).",
        detail: "Ce record est visible dans la base de données Prisma Studio. Il contient : l'email de l'étudiant, l'ID du cours, la date de la demande, et le statut PENDING. Aucune inscription au cours n'est encore créée à cette étape.",
        warning: "L'étudiant NE peut PAS encore accéder au cours à ce stade. Il doit attendre votre approbation.",
        tip: null,
        substeps: [
            { icon: Terminal, text: "POST /api/invitations/request" },
            { icon: CheckCircle, text: "CourseInvitation créé (status: PENDING)" },
            { icon: AlertTriangle, text: "Pas encore d'inscription au cours" },
        ]
    },
    {
        num: 3,
        icon: Shield,
        color: 'from-yellow-500 to-orange-500',
        glow: 'shadow-yellow-500/20',
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        title: "Vous accordez l'accès (Super Admin)",
        url: '/admin/r-stat-access',
        desc: "En tant que Super Admin, vous allez sur la page de gestion R Stat et entrez l'email de l'étudiant pour lui accorder l'accès.",
        detail: "Rendez-vous sur /admin/r-stat-access. Dans la section « Attribuer l'accès R Stat par Email », tapez l'email de l'étudiant et cliquez sur « Attribuer l'accès ». Le système effectue deux opérations simultanément : il met rStatAdminAccess à true sur le compte de l'utilisateur ET crée une inscription (CourseEnrollment) au cours r-statistics-finance.",
        warning: "L'utilisateur doit DÉJÀ avoir un compte sur la plateforme. Si son compte n'existe pas, l'opération échouera avec l'erreur « Utilisateur non trouvé ».",
        tip: "Vous pouvez aussi accorder l'accès depuis le Super Admin Dashboard (tableau principal) via le formulaire « Accès Rapide par Email ».",
        substeps: [
            { icon: UserCheck, text: "rStatAdminAccess = true sur le compte" },
            { icon: CheckCircle, text: "CourseEnrollment créé (type: INVITATION)" },
            { icon: BarChart, text: "Le cours apparaît dans son dashboard" },
        ]
    },
    {
        num: 4,
        icon: LogIn,
        color: 'from-green-600 to-emerald-600',
        glow: 'shadow-green-500/20',
        badge: 'bg-green-500/20 text-green-400 border-green-500/30',
        title: "L'étudiant se reconnecte",
        url: '/login',
        desc: "L'étudiant doit se déconnecter puis se reconnecter pour que sa session soit mise à jour avec les nouveaux droits.",
        detail: "La plateforme utilise des tokens JWT. Ces tokens sont créés une seule fois lors de la connexion et mis en cache. Si l'étudiant était déjà connecté avant que vous lui accordiez l'accès, son token ne contient pas encore la permission. En se reconnectant, un nouveau token est généré avec rStatAdminAccess = true.",
        warning: "C'est l'étape la plus souvent oubliée ! Si l'étudiant dit « ça ne marche pas », demandez-lui de se déconnecter et reconnecter.",
        tip: null,
        substeps: [
            { icon: UserX, text: "Se déconnecter (bouton en haut à droite)" },
            { icon: LogIn, text: "Se reconnecter avec son compte" },
            { icon: RefreshCw, text: "Token JWT regénéré avec les nouveaux droits" },
        ]
    },
    {
        num: 5,
        icon: LayoutDashboard,
        color: 'from-teal-600 to-cyan-600',
        glow: 'shadow-teal-500/20',
        badge: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
        title: "L'étudiant accède au cours depuis son dashboard",
        url: '/dashboard',
        desc: "Après reconnexion, le cours R pour Statistiques & Finance apparaît dans la section « Continuer l'apprentissage » du dashboard.",
        detail: "Le dashboard appelle /api/user/enrollments qui retourne tous les CourseEnrollment de l'utilisateur. Puisqu'on a créé l'enrollment à l'étape 3, le cours apparaît maintenant avec une barre de progression à 0%. L'étudiant peut cliquer sur « Reprendre le cours » pour accéder au contenu.",
        warning: null,
        tip: "Si le cours n'apparaît toujours pas après reconnexion, vérifiez en Prisma Studio que le CourseEnrollment a bien été créé pour cet utilisateur.",
        substeps: [
            { icon: LayoutDashboard, text: "Section « Continuer l'apprentissage » affiche le cours" },
            { icon: BarChart, text: "Barre de progression à 0%" },
            { icon: PlayCircle, text: "Bouton « Reprendre le cours » disponible" },
        ]
    },
    {
        num: 6,
        icon: PlayCircle,
        color: 'from-indigo-600 to-purple-600',
        glow: 'shadow-indigo-500/20',
        badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        title: "L'étudiant suit le cours",
        url: '/dashboard/courses/r-statistics-finance',
        desc: "L'étudiant navigue entre les leçons, marque sa progression et peut utiliser l'assistant IA pour poser des questions sur le contenu.",
        detail: "La page du cours affiche un sidebar avec toutes les leçons. Chaque leçon peut être marquée comme terminée. Un quiz peut apparaître après certaines leçons. La progression est sauvegardée automatiquement via UserLessonProgress. L'assistant IA contextuel (bouton en bas à droite) peut répondre aux questions basées sur le contenu de la leçon active.",
        warning: null,
        tip: "En tant qu'admin, vous pouvez ajouter des images et vidéos aux leçons via le bouton « Ajouter Média » qui n'est visible qu'aux ADMIN et SUPER_ADMIN.",
        substeps: [
            { icon: BookOpen, text: "4 leçons disponibles (R intro, data, viz, séries temp.)" },
            { icon: CheckCircle, text: "Progression sauvegardée automatiquement" },
            { icon: Lightbulb, text: "Assistant IA disponible pour chaque leçon" },
        ]
    },
];

const faqs = [
    {
        q: "L'étudiant a soumis le formulaire mais ne voit pas le cours ?",
        a: "Le formulaire d'invitation ne donne PAS accès automatiquement. Vous devez manuellement aller sur /admin/r-stat-access et entrer son email dans le formulaire. Ce n'est qu'après cette étape que l'accès est accordé.",
        type: 'error'
    },
    {
        q: "L'accès a été accordé mais l'étudiant voit encore « Formation sur invitation » ?",
        a: "L'étudiant doit se déconnecter et se reconnecter. La session JWT est mise en cache et n'est pas mise à jour automatiquement. C'est la cause n°1 des signalements « ça ne marche pas ».",
        type: 'warning'
    },
    {
        q: "Le message d'erreur « Utilisateur non trouvé » apparaît ?",
        a: "L'utilisateur n'a pas encore de compte sur la plateforme. Il doit d'abord s'inscrire sur /register (ou via Google). Une fois le compte créé, vous pouvez lui accorder l'accès.",
        type: 'error'
    },
    {
        q: "Comment révoquer l'accès d'un étudiant ?",
        a: "Sur /admin/r-stat-access, trouvez l'utilisateur dans le tableau et cliquez sur l'icône poubelle rouge. Cette opération met rStatAdminAccess à false ET supprime l'inscription au cours. L'étudiant perdra l'accès à la prochaine reconnexion.",
        type: 'info'
    },
    {
        q: "Un étudiant avec rôle R_STAT_ADMIN peut-il accéder au cours sans enrollment ?",
        a: "Oui. Les utilisateurs avec le rôle R_STAT_ADMIN ont accès direct au contenu du cours même sans CourseEnrollment. Cependant, le cours n'apparaîtra pas dans leur dashboard (section Continuer l'apprentissage) car celle-ci dépend uniquement des enrollments.",
        type: 'info'
    },
    {
        q: "Puis-je voir qui a fait une demande d'accès ?",
        a: "Les demandes d'invitation (status PENDING) sont stockées dans la table CourseInvitation en base de données. Pour les voir, utilisez Prisma Studio (npx prisma studio sur le serveur) ou demandez au développeur d'ajouter une interface admin pour les lister.",
        type: 'info'
    },
];

function StepCard({ step, index }) {
    const Icon = step.icon;
    return (
        <div className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-gray-600 to-transparent z-10" />
            )}

            <div className="glass-card p-6 hover:border-gray-600 transition-all duration-300 group">
                <div className="flex gap-5">
                    {/* Step number + icon */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${step.glow} group-hover:scale-105 transition-transform`}>
                            <Icon size={28} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-500">Étape {step.num}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white leading-tight">{step.title}</h3>
                            {step.url && (
                                <Link
                                    href={step.url}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${step.badge} hover:opacity-80 transition-opacity flex-shrink-0`}
                                >
                                    <Globe size={11} />
                                    {step.url}
                                </Link>
                            )}
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">{step.desc}</p>

                        {/* Detail box */}
                        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4 mb-4">
                            <div className="flex gap-2 text-gray-400 text-sm leading-relaxed">
                                <Info size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                                <p>{step.detail}</p>
                            </div>
                        </div>

                        {/* Sub-steps */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            {step.substeps.map((sub, i) => {
                                const SubIcon = sub.icon;
                                return (
                                    <div key={i} className="flex items-center gap-2.5 bg-white/3 border border-gray-800 rounded-lg px-3 py-2">
                                        <SubIcon size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-xs text-gray-400">{sub.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Warning */}
                        {step.warning && (
                            <div className="flex gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-3">
                                <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm leading-relaxed"><span className="font-bold">Attention : </span>{step.warning}</p>
                            </div>
                        )}

                        {/* Tip */}
                        {step.tip && (
                            <div className="flex gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                <Lightbulb size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-blue-300 text-sm leading-relaxed"><span className="font-bold">Astuce : </span>{step.tip}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FaqItem({ faq, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const colors = {
        error: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: 'text-red-400', text: 'text-red-300', Icon: AlertCircle },
        warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-400', text: 'text-yellow-300', Icon: AlertTriangle },
        info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400', text: 'text-blue-300', Icon: Info },
    };
    const c = colors[faq.type];

    return (
        <div className={`border ${c.border} rounded-xl overflow-hidden transition-all`}>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors`}
            >
                <c.Icon size={20} className={`flex-shrink-0 ${c.icon}`} />
                <span className="flex-1 font-semibold text-white text-sm">{faq.q}</span>
                {open ? <ChevronDown size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />}
            </button>
            {open && (
                <div className={`px-5 pb-5 pt-1 ${c.bg}`}>
                    <p className={`text-sm leading-relaxed ${c.text}`}>{faq.a}</p>
                </div>
            )}
        </div>
    );
}

export default function RStatDocPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg border-red-500/30">
                    <Lock size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée aux administrateurs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Documentation</p>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Gestion des accès R Statistics
                        </h1>
                    </div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Guide complet pour gérer les inscriptions au cours <span className="text-white font-semibold">R pour Statistiques & Finance</span>.
                    Ce cours est en accès sur invitation uniquement — suivez ces étapes pour accorder l'accès à un étudiant.
                </p>

                {/* Quick action banner */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/admin/r-stat-access"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Shield size={18} />
                        Gérer les accès R Stat
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/courses/r-statistics-finance"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl font-semibold transition-all border border-gray-700"
                    >
                        <Eye size={18} />
                        Voir la page du cours
                    </Link>
                </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { icon: Lock, label: 'Type de cours', value: 'Sur Invitation', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { icon: Users, label: 'Rôle requis', value: 'Super Admin', color: 'text-red-400', bg: 'bg-red-500/10' },
                    { icon: BookOpen, label: 'Leçons', value: '4 leçons', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { icon: CheckCircle, label: 'Prix', value: 'Gratuit', color: 'text-green-400', bg: 'bg-green-500/10' },
                ].map((c, i) => {
                    const Icon = c.icon;
                    return (
                        <div key={i} className={`glass-card p-4 flex flex-col items-center text-center gap-2 ${c.bg} border-0`}>
                            <Icon size={22} className={c.color} />
                            <p className="text-xs text-gray-500 uppercase">{c.label}</p>
                            <p className={`font-bold ${c.color}`}>{c.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Flow summary */}
            <div className="glass-card p-6 mb-10">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <BarChart size={20} className="text-purple-400" />
                    Vue d'ensemble du flux
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { label: 'Demande', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                        { label: '→', color: 'text-gray-600', plain: true },
                        { label: 'PENDING', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
                        { label: '→', color: 'text-gray-600', plain: true },
                        { label: 'Admin accorde', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
                        { label: '→', color: 'text-gray-600', plain: true },
                        { label: 'Enrollment créé', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
                        { label: '→', color: 'text-gray-600', plain: true },
                        { label: 'Reconnexion', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
                        { label: '→', color: 'text-gray-600', plain: true },
                        { label: 'Accès au cours', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
                    ].map((item, i) =>
                        item.plain ? (
                            <span key={i} className={`${item.color} font-bold text-lg`}>{item.label}</span>
                        ) : (
                            <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.label}</span>
                        )
                    )}
                </div>
            </div>

            {/* Steps */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-sm font-bold text-white">6</span>
                    Étapes détaillées
                </h2>
                <div className="space-y-6">
                    {steps.map((step, i) => (
                        <StepCard key={step.num} step={step} index={i} />
                    ))}
                </div>
            </div>

            {/* Action rapide */}
            <div className="glass-card p-6 mb-10 border-purple-500/20">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Crown size={22} className="text-yellow-400" />
                    Action rapide — Accorder l'accès maintenant
                </h2>
                <p className="text-gray-400 text-sm mb-5">Vous avez un email à traiter ? Cliquez ci-dessous pour accéder directement au formulaire.</p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/r-stat-access"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        <Unlock size={18} />
                        Accorder l'accès via email
                    </Link>
                    <Link
                        href="/super-admin"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-gray-700"
                    >
                        <Users size={18} />
                        Gérer tous les utilisateurs
                    </Link>
                </div>
            </div>

            {/* Révocation */}
            <div className="glass-card p-6 mb-10 border-red-500/10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trash2 size={22} className="text-red-400" />
                    Révoquer un accès
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    Pour retirer l'accès d'un étudiant au cours R Statistics :
                </p>
                <div className="space-y-3">
                    {[
                        { n: '1', text: 'Allez sur /admin/r-stat-access', color: 'bg-red-500/20 text-red-400' },
                        { n: '2', text: 'Trouvez l\'utilisateur dans le tableau (utilisez la recherche)', color: 'bg-red-500/20 text-red-400' },
                        { n: '3', text: 'Cliquez sur l\'icône poubelle rouge à droite', color: 'bg-red-500/20 text-red-400' },
                        { n: '4', text: 'Confirmez la révocation dans la popup', color: 'bg-red-500/20 text-red-400' },
                    ].map((item) => (
                        <div key={item.n} className="flex items-center gap-4 bg-white/5 border border-gray-800 rounded-xl px-4 py-3">
                            <span className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{item.n}</span>
                            <span className="text-gray-300 text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                        La révocation supprime à la fois la permission <code className="bg-white/10 px-1 rounded">rStatAdminAccess</code> ET l'inscription au cours.
                        L'étudiant perdra définitivement sa progression. Cette action est irréversible (sauf à réaccorder manuellement l'accès).
                    </p>
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <AlertCircle size={24} className="text-orange-400" />
                    Problèmes fréquents & Solutions
                </h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} faq={faq} defaultOpen={i === 0} />
                    ))}
                </div>
            </div>

            {/* Footer info */}
            <div className="glass-card p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
                <div className="flex gap-3">
                    <Info size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-white mb-1">À propos du cours R Statistics</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Le cours <strong className="text-white">R pour Statistiques & Finance</strong> est une formation avancée (niveau Top) de 12h.
                            Il est intentionnellement restreint à un public sélectionné. Les 4 leçons couvrent l'introduction à R/RStudio,
                            les structures de données financières, la visualisation avec ggplot2, et l'analyse de séries temporelles.
                            Slug : <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">r-statistics-finance</code>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
