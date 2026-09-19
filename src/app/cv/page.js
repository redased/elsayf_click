'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Sparkles, Download, FileText, Zap, Shield, Star, ArrowRight,
  CheckCircle, ChevronRight, Play, Award, Users, Clock,
  Palette, Layout, Code2, Briefcase, GraduationCap, Brush,
  Globe, Monitor, Smartphone, Check, ChevronDown, X, LogIn, User,
  Printer, Bot, CheckCircle2, Sliders, ArrowUpRight, HelpCircle,
  ExternalLink, BarChart3, RefreshCw, Layers
} from 'lucide-react';
import AdSenseAd from '@/components/AdSenseAd';
import { PRESET_PROFILES } from '@/components/cv/defaultPresets';

const STORAGE_KEY_DATA = 'elsayf_cv_builder_data_v1';
const STORAGE_KEY_CONFIG = 'elsayf_cv_builder_config_v1';

// ─── Données des 6 Templates ────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tagline: 'Pour les développeurs & profils techniques',
    category: 'Tech & Code',
    categoryColor: '#8b5cf6',
    accent: '#7c3aed',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    gradientBg: 'from-violet-950/80 via-purple-950/50 to-indigo-950/80',
    border: 'border-violet-500/40',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    icon: Code2,
    popular: true,
    features: ['Sidebar colorée', 'Barres de compétences', 'Stack technique mise en avant'],
    preview: {
      header: { bg: 'bg-violet-700', text: 'text-white' },
      sidebar: { bg: 'bg-violet-900', text: 'text-violet-200' },
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#7c3aed',
    }
  },
  {
    id: 'executive-rh',
    name: 'Executive RH',
    tagline: 'Pour les cadres, managers & ressources humaines',
    category: 'Management',
    categoryColor: '#3b82f6',
    accent: '#1e40af',
    gradient: 'from-blue-600 via-sky-600 to-blue-700',
    gradientBg: 'from-blue-950/80 via-sky-950/50 to-blue-950/80',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    icon: Briefcase,
    popular: false,
    features: ['Style corporate premium', 'Leadership & gouvernance', 'Format ATS optimal'],
    preview: {
      header: { bg: 'bg-blue-800', text: 'text-white' },
      sidebar: { bg: 'bg-blue-100', text: 'text-blue-900' },
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#1e40af',
    }
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    tagline: 'Pour les créatifs, graphistes & UI/UX designers',
    category: 'Design & Art',
    categoryColor: '#ec4899',
    accent: '#db2777',
    gradient: 'from-pink-600 via-rose-500 to-orange-500',
    gradientBg: 'from-pink-950/80 via-rose-950/50 to-orange-950/80',
    border: 'border-pink-500/40',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    icon: Brush,
    popular: false,
    features: ['Design coloré & vivant', 'Mise en page créative', 'Portfolio intégré'],
    preview: {
      header: { bg: 'bg-rose-600', text: 'text-white' },
      sidebar: { bg: 'bg-pink-50', text: 'text-rose-800' },
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#db2777',
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist ATS',
    tagline: 'Score ATS maximal pour cabinets internationaux',
    category: 'Épuré & Pro',
    categoryColor: '#6b7280',
    accent: '#374151',
    gradient: 'from-gray-600 via-slate-600 to-gray-700',
    gradientBg: 'from-gray-950/80 via-slate-950/50 to-gray-950/80',
    border: 'border-gray-500/40',
    badge: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
    icon: FileText,
    popular: false,
    features: ['Score ATS maximal', 'Lisibilité parfaite', 'Standard international'],
    preview: {
      header: { bg: 'bg-gray-800', text: 'text-white' },
      sidebar: null,
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#374151',
    }
  },
  {
    id: 'dual-column',
    name: 'Dual Column',
    tagline: 'Deux colonnes pour structurer une carrière riche',
    category: 'Classique',
    categoryColor: '#0ea5e9',
    accent: '#0284c7',
    gradient: 'from-sky-600 via-cyan-600 to-blue-600',
    gradientBg: 'from-sky-950/80 via-cyan-950/50 to-blue-950/80',
    border: 'border-sky-500/40',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    icon: Layout,
    popular: false,
    features: ['Équilibre visuel parfait', 'Densité d\'information', 'Hiérarchie claire'],
    preview: {
      header: { bg: 'bg-slate-800', text: 'text-white' },
      sidebar: { bg: 'bg-slate-100', text: 'text-slate-800' },
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#0284c7',
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Pro',
    tagline: 'Idéal santé, conseil, enseignement & sciences',
    category: 'Élégant',
    categoryColor: '#10b981',
    accent: '#059669',
    gradient: 'from-emerald-600 via-green-500 to-emerald-600',
    gradientBg: 'from-emerald-950/80 via-green-950/50 to-emerald-950/80',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: GraduationCap,
    popular: false,
    features: ['Couleurs apaisantes', 'Idéal santé & éducation', 'Très lisible'],
    preview: {
      header: { bg: 'bg-emerald-700', text: 'text-white' },
      sidebar: { bg: 'bg-emerald-50', text: 'text-emerald-900' },
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#059669',
    }
  },
];

// ─── Profils rapides de démarrage ───────────────────────────────────────────
const QUICK_PROFILES = [
  { id: 'developer', label: '💻 Tech / Développeur', template: 'modern-tech' },
  { id: 'rh', label: '👔 RH / Management', template: 'executive-rh' },
  { id: 'business_finance', label: '📈 Finance / Gestion', template: 'dual-column' },
  { id: 'designer', label: '🎨 Design / Créatif', template: 'creative-designer' },
  { id: 'data_analyst', label: '📊 Data / Analyste', template: 'minimalist' },
];

// ─── Outils MyCV (Style iLovePDF) ───────────────────────────────────────────
const ILOVEPDF_TOOLS = [
  {
    id: 'studio',
    title: 'Studio CV Complet',
    badge: 'PRINCIPAL',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: Layout,
    iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    desc: 'Éditeur modulaire complet avec gestion illimitée des expériences, formations, projets et certifications.',
    href: '/cv/builder',
    cta: 'Ouvrir l\'éditeur',
  },
  {
    id: 'ia',
    title: 'Assistant IA Gemini',
    badge: 'INTELLIGENT',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Bot,
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Génération automatique du résumé professionnel et reformulation percutante de vos réalisations en 1 clic.',
    href: '/cv/builder?tab=ai',
    cta: 'Tester l\'IA',
  },
  {
    id: 'ats',
    title: 'Audit & Score ATS',
    badge: 'SUR 100 PTS',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: BarChart3,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Analyse automatique de conformité aux robots de recrutement : densité de mots-clés et hiérarchie.',
    href: '/cv/builder?tab=ats',
    cta: 'Vérifier mon score',
  },
  {
    id: 'templates',
    title: '6 Modèles Certifiés',
    badge: 'DESIGN',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: Palette,
    iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    desc: 'Changez de modèle et de palette de couleurs à tout moment sans jamais perdre vos informations saisies.',
    href: '#designs',
    cta: 'Voir les modèles',
  },
  {
    id: 'pdf',
    title: 'Export PDF A4 Haute Définition',
    badge: 'VECTORIEL',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Download,
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Génération instantanée en format A4 strict (210 x 297 mm) avec texte sélectionnable et netteté maximale.',
    href: '/cv/builder',
    cta: 'Télécharger en PDF',
  },
  {
    id: 'cloud',
    title: 'Sauvegarde Cloud & Locale',
    badge: 'SÉCURISÉ',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: Shield,
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    desc: 'Sauvegarde automatique dans votre navigateur et synchronisation cloud sécurisée si vous êtes connecté.',
    href: '/login?callbackUrl=/cv/builder',
    cta: 'Synchroniser',
  },
  {
    id: 'i18n',
    title: 'Multi-langues (FR, EN, AR)',
    badge: 'INTERNATIONAL',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: Globe,
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    desc: 'Adaptez votre CV pour postuler auprès d\'entreprises multinationales ou locales avec des intitulés bilingues.',
    href: '/cv/builder',
    cta: 'Créer en anglais',
  },
  {
    id: 'free',
    title: '100% Gratuit & Zéro Filigrane',
    badge: 'GARANTIE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Aucun frais caché, aucun abonnement surprise, aucun filigrane publicitaire imposé sur votre document.',
    href: '/cv/builder',
    cta: 'Commencer gratuitement',
  }
];

// ─── Mini-aperçu vectoriel CV ───────────────────────────────────────────────
function CVMiniPreview({ template, isActive }) {
  const p = template.preview;
  return (
    <div
      className={`relative w-full aspect-[210/297] rounded-lg overflow-hidden shadow-2xl border-2 transition-all duration-300 ${
        isActive ? `border-2 shadow-lg` : 'border-white/10'
      }`}
      style={{ borderColor: isActive ? template.accent : undefined }}
    >
      <div className={`${p.header.bg} px-2 py-1.5 flex items-center gap-1.5`}>
        <div className="w-4 h-4 rounded-full bg-white/30 shrink-0" />
        <div className="flex-1 space-y-0.5">
          <div className="h-1.5 bg-white/80 rounded w-16" />
          <div className="h-1 bg-white/40 rounded w-10" />
        </div>
      </div>
      <div className="flex h-[calc(100%-36px)]">
        {p.sidebar && (
          <div className={`${p.sidebar.bg} w-2/5 px-1 py-1.5 space-y-1.5`}>
            <div className="space-y-0.5">
              <div className="h-1 rounded w-full opacity-60" style={{ background: template.accent }} />
              <div className="h-0.5 bg-current rounded w-4/5 opacity-30" />
              <div className="h-0.5 bg-current rounded w-3/5 opacity-30" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1 rounded w-full opacity-60" style={{ background: template.accent }} />
              <div className="h-1.5 rounded w-full bg-current opacity-20" />
              <div className="h-1.5 rounded w-4/5 bg-current opacity-15" />
            </div>
          </div>
        )}
        <div className={`${p.body.bg} flex-1 px-2 py-1.5 space-y-2`}>
          <div>
            <div className="h-0.5 rounded mb-1 opacity-70" style={{ background: template.accent }} />
            <div className="h-1 bg-gray-700 rounded w-2/3 opacity-40 mb-0.5" />
            <div className="h-0.5 bg-gray-400 rounded w-1/2 opacity-30 mb-0.5" />
            <div className="h-0.5 bg-gray-300 rounded w-full opacity-25" />
          </div>
          <div>
            <div className="h-0.5 rounded mb-1 opacity-70" style={{ background: template.accent }} />
            <div className="h-1 bg-gray-700 rounded w-3/5 opacity-40 mb-0.5" />
            <div className="h-0.5 bg-gray-300 rounded w-full opacity-25" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ──────────────────────────────────────────────────────────
function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 transition-all duration-300 hover:border-white/20">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span>{q}</span>
        <ChevronDown
          size={17}
          className={`transition-transform duration-300 shrink-0 text-gray-400 ${isOpen ? 'rotate-180 text-white' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-4 pt-1 text-sm text-gray-400 leading-relaxed border-t border-white/10">
          {a}
        </div>
      </div>
    </div>
  );
}

// ─── Page Principale MyCV.click (Inspirée iLovePDF) ───────────────────────────
export default function MyCVHomePage() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState(null);

  // État du créateur rapide direct sur la page d'accueil
  const [selectedTemplate, setSelectedTemplate] = useState('modern-tech');
  const [selectedPresetId, setSelectedPresetId] = useState('developer');
  const [quickData, setQuickData] = useState({
    firstName: 'Sofiane',
    lastName: 'Mansouri',
    title: 'Développeur Full-Stack & Ingénieur IA',
    email: 'sofiane.mansouri@dev-mail.com',
    phone: '+213 550 00 00 00',
    summary: 'Ingénieur passionné avec 4+ ans d\'expérience dans la conception d\'applications web scalables avec Next.js et Python. Spécialisé dans l\'intégration de modèles IA.',
    skills: 'Python, Next.js, Django, PostgreSQL, Docker, Tailwind CSS, API Gemini'
  });

  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'form' | 'templates'
  const [isCopied, setIsCopied] = useState(false);

  // Charger depuis le localStorage si l'utilisateur a déjà des données
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY_DATA);
        const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.personal) {
            setQuickData({
              firstName: parsed.personal.firstName || '',
              lastName: parsed.personal.lastName || '',
              title: parsed.personal.title || '',
              email: parsed.personal.email || '',
              phone: parsed.personal.phone || '',
              summary: parsed.personal.summary || '',
              skills: (parsed.skills || []).map(s => s.name || s).join(', ')
            });
          }
        }
        if (savedConfig) {
          const cfg = JSON.parse(savedConfig);
          if (cfg.template) setSelectedTemplate(cfg.template);
        }
      } catch (e) {
        console.warn('Erreur lecture localStorage:', e);
      }
    }
  }, []);

  // Changer de preset rapide
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_PROFILES[presetId] || PRESET_PROFILES.developer;
    if (preset?.data?.personal) {
      setQuickData({
        firstName: preset.data.personal.firstName,
        lastName: preset.data.personal.lastName,
        title: preset.data.personal.title,
        email: preset.data.personal.email,
        phone: preset.data.personal.phone,
        summary: preset.data.personal.summary,
        skills: (preset.data.skills || []).map(s => s.name).join(', ')
      });
      if (preset.template) {
        setSelectedTemplate(preset.template);
      }
      // Sauvegarder dans le localStorage
      syncToLocalStorage(preset.data, preset.template);
    }
  };

  // Synchroniser dans le localStorage pour le builder
  const syncToLocalStorage = (dataObj, tmpl) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(dataObj));
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({
        template: tmpl || selectedTemplate,
        color: '#7c3aed',
        font: 'sans',
        spacing: 'normal'
      }));
    } catch (e) {
      console.warn('Erreur sync localStorage:', e);
    }
  };

  // Mise à jour formulaire
  const handleInputChange = (field, val) => {
    const updated = { ...quickData, [field]: val };
    setQuickData(updated);

    // Mettre à jour l'objet complet pour le builder
    const fullData = PRESET_PROFILES[selectedPresetId]?.data || PRESET_PROFILES.developer.data;
    const cloned = JSON.parse(JSON.stringify(fullData));
    cloned.personal.firstName = updated.firstName;
    cloned.personal.lastName = updated.lastName;
    cloned.personal.title = updated.title;
    cloned.personal.email = updated.email;
    cloned.personal.phone = updated.phone;
    cloned.personal.summary = updated.summary;
    if (updated.skills) {
      cloned.skills = updated.skills.split(',').map(s => ({ name: s.trim(), level: 85, category: 'hard' })).filter(s => s.name);
    }
    syncToLocalStorage(cloned, selectedTemplate);
  };

  const currentTmplObj = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const faq = [
    {
      q: "Est-ce que MyCV.click est réellement 100% gratuit et sans abonnement caché ?",
      a: "Oui, MyCV.click est entièrement gratuit. Vous pouvez concevoir votre CV de A à Z, modifier la mise en page, utiliser nos 6 designs professionnels et télécharger votre document en PDF A4 haute définition sans débourser le moindre centime et sans aucun filigrane."
    },
    {
      q: "Mes informations personnelles et professionnelles sont-elles protégées ?",
      a: "Absolument. Vos informations sont stockées localement dans votre navigateur (localStorage). Aucune donnée n'est revendue à des tiers. Si vous choisissez de vous connecter avec votre compte Google, la sauvegarde cloud est chiffrée et privée."
    },
    {
      q: "Qu'est-ce qu'un CV compatible ATS et pourquoi est-ce crucial en 2026 ?",
      a: "Un ATS (Applicant Tracking System) est un logiciel utilisé par plus de 80% des grandes entreprises et cabinets de recrutement pour filtrer automatiquement les candidatures avant l'œil humain. Nos 6 modèles respectent les standards ATS : structure HTML sémantique, polices vectorielles standardisées, sections délimitées et texte sélectionnable."
    },
    {
      q: "Puis-je changer de modèle ou de couleur sans perdre mes textes ?",
      a: "Oui ! Vos données sont totalement séparées de la couche graphique. Vous pouvez basculer d'un modèle 'Modern Tech' vers 'Executive RH' ou 'Minimalist ATS' en un clic, tout votre contenu reste intact."
    },
    {
      q: "Comment fonctionne l'Assistant IA Gemini pour la rédaction du CV ?",
      a: "L'assistant IA analyse votre profil ou votre poste et rédige instantanément une accroche professionnelle percutante, tout en suggérant des verbes d'action et des réalisations chiffrées adaptés à votre secteur."
    },
    {
      q: "Comment télécharger mon CV au format PDF prêt pour l'impression ?",
      a: "Cliquez simplement sur 'Continuer dans le Studio Complet' ou 'Télécharger PDF'. Le moteur de rendu génère un document vectoriel A4 calibré à 210 x 297 mm, parfait pour être envoyé par email ou imprimé."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden font-sans">

      {/* ─── SEO Schema.org WebApplication & FAQPage ─────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "MyCV.click",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
                "description": "Créateur de CV en ligne gratuit et rapide inspiré par iLovePDF : créez votre CV directement sur la page d'accueil, exportez en PDF A4 et optimisez votre score ATS."
              },
              {
                "@type": "FAQPage",
                "mainEntity": faq.map(f => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                  }
                }))
              }
            ]
          })
        }}
      />

      {/* ─── NAVBAR ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-900/30">
              CV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">MyCV.click</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  100% GRATUIT
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-medium hidden sm:block">
                Le studio CV instantané façon iLovePDF
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="#creation-rapide" className="hover:text-white transition-colors font-medium flex items-center gap-1.5">
              <Sparkles size={14} className="text-violet-400" /> Créer mon CV
            </a>
            <a href="#outils" className="hover:text-white transition-colors font-medium flex items-center gap-1.5">
              <Layers size={14} className="text-blue-400" /> Outils
            </a>
            <a href="#designs" className="hover:text-white transition-colors font-medium">Modèles</a>
            <a href="#guide-ats" className="hover:text-white transition-colors font-medium">Guide ATS 2026</a>
            <a href="#faq" className="hover:text-white transition-colors font-medium">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300">
                  {(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="text-xs text-gray-300 font-medium hidden sm:inline max-w-[120px] truncate">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/cv/builder"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all"
              >
                <LogIn size={13} />
                Connexion
              </Link>
            )}

            <Link
              href="/cv/builder"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 transition-all hover:scale-105 shadow-lg shadow-violet-900/30"
            >
              <Layout size={14} />
              Studio Complet
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO & CRÉATEUR DIRECT SUR LA PAGE D'ACCUEIL ─────────────────────── */}
      <section id="creation-rapide" className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Background glow ambient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-700/20 blur-[140px]" />
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-indigo-700/15 blur-[120px]" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-pink-700/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8">
          {/* Titre d'accroche */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold">
              <Sparkles size={13} className="text-amber-400" />
              Inspiré par la simplicité d'iLovePDF • 100% Gratuit
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Créez votre CV professionnel <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                directement ici en 1 minute
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Choisissez votre métier, ajustez vos informations et téléchargez votre CV prêt pour les recruteurs.
              Aucune carte bancaire, aucun filigrane.
            </p>
          </div>

          {/* ─── LE WIDGET CRÉATEUR DIRECT (Le cœur de la page) ────────────────── */}
          <div className="bg-[#0b0f19]/95 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
            {/* Header du widget avec onglets */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Création Rapide & Intuitive
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('preset')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'preset' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ Profils Métiers
                </button>
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'form' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ✍️ Vos Informations
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'templates' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🎨 6 Designs ({selectedTemplate})
                </button>
              </div>
            </div>

            {/* Corps du widget en 2 colonnes (Édition + Live Preview) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* Colonne gauche : Contrôles (7/12) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Contenu de l'onglet : Profils rapides */}
                {activeTab === 'preset' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <Zap size={14} className="text-yellow-400" />
                      1. Choisissez un secteur pour pré-remplir instantanément :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {QUICK_PROFILES.map((qp) => {
                        const isSelected = selectedPresetId === qp.id;
                        return (
                          <button
                            key={qp.id}
                            onClick={() => handleSelectPreset(qp.id)}
                            className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-900/30'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <span>{qp.label}</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              Modèle : {qp.template}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Contenu de l'onglet : Formulaire express */}
                {(activeTab === 'form' || activeTab === 'preset') && (
                  <div className="space-y-3.5 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Vos Coordonnées Clés
                      </label>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        ✓ Sauvegardé automatiquement
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-gray-400 mb-1 block">Prénom</span>
                        <input
                          type="text"
                          value={quickData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Prénom"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 mb-1 block">Nom</span>
                        <input
                          type="text"
                          value={quickData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Nom de famille"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-gray-400 mb-1 block">Titre de poste recherché</span>
                      <input
                        type="text"
                        value={quickData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="ex: Chef de Projet Digital / Développeur Python"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-gray-400 mb-1 block">Email</span>
                        <input
                          type="email"
                          value={quickData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="votre.email@exemple.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 mb-1 block">Téléphone</span>
                        <input
                          type="text"
                          value={quickData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+33 6 00 00 00 00"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-gray-400 mb-1 block">Résumé professionnel / Accroche</span>
                      <textarea
                        rows={2}
                        value={quickData.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        placeholder="2 à 3 lignes décrivant vos points forts et votre valeur ajoutée..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-gray-400 mb-1 block">Compétences clés (séparées par virgules)</span>
                      <input
                        type="text"
                        value={quickData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        placeholder="ex: Python, React, Gestion de projet, Anglais C1..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Sélecteur de Modèle en pastilles rapides */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span className="uppercase tracking-wider">Modèle actif :</span>
                    <span className="text-violet-400">{currentTmplObj.name} ({currentTmplObj.category})</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TEMPLATES.map((tmpl) => {
                      const isAct = selectedTemplate === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => {
                            setSelectedTemplate(tmpl.id);
                            syncToLocalStorage(PRESET_PROFILES[selectedPresetId]?.data || PRESET_PROFILES.developer.data, tmpl.id);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isAct
                              ? 'bg-violet-600/30 border-violet-400 text-white ring-2 ring-violet-500/50'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="w-3.5 h-3.5 rounded-full mx-auto mb-1" style={{ background: tmpl.accent }} />
                          <div className="text-[10px] font-bold truncate">{tmpl.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Boutons d'action géants du créateur */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/cv/builder?template=${selectedTemplate}`}
                    className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-violet-900/40 hover:from-violet-500 hover:to-purple-500 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Sparkles size={16} />
                    Ouvrir le Studio Complet (Gratuit)
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href={`/cv/builder?template=${selectedTemplate}&action=print`}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Download size={16} className="text-emerald-400" />
                    Télécharger PDF A4
                  </Link>
                </div>
              </div>

              {/* Colonne droite : Live Preview visuelle (5/12) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full max-w-[310px] bg-slate-900/90 p-3.5 rounded-2xl border border-white/15 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                    <span className="font-semibold flex items-center gap-1.5 text-white">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Aperçu A4 Direct
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      Format ISO 216
                    </span>
                  </div>

                  {/* Carte visuelle du CV en direct */}
                  <div className="relative w-full aspect-[210/297] rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-white text-gray-900 text-left p-3.5 flex flex-col justify-between">
                    {/* Header dynamique */}
                    <div className="border-b pb-2" style={{ borderColor: `${currentTmplObj.accent}40` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-gray-900 leading-tight">
                            {quickData.firstName || 'Votre'} {quickData.lastName || 'Nom'}
                          </div>
                          <div className="text-[10px] font-bold" style={{ color: currentTmplObj.accent }}>
                            {quickData.title || 'Titre du poste'}
                          </div>
                        </div>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                          style={{ background: currentTmplObj.accent }}
                        >
                          {(quickData.firstName?.[0] || 'C')}{(quickData.lastName?.[0] || 'V')}
                        </div>
                      </div>

                      <div className="text-[8px] text-gray-500 mt-1 flex flex-wrap gap-2">
                        <span>{quickData.email || 'email@exemple.com'}</span>
                        <span>{quickData.phone || '+213 550 00 00'}</span>
                      </div>
                    </div>

                    {/* Résumé */}
                    <div className="py-1">
                      <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color: currentTmplObj.accent }}>
                        Profil Professionnel
                      </div>
                      <p className="text-[7.5px] text-gray-600 leading-tight line-clamp-3">
                        {quickData.summary || 'Votre accroche professionnelle s\'affichera ici.'}
                      </p>
                    </div>

                    {/* Expérience simulée */}
                    <div className="border-t border-gray-100 pt-1">
                      <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: currentTmplObj.accent }}>
                        Dernière Expérience
                      </div>
                      <div className="text-[8px] font-bold text-gray-800">
                        {quickData.title || 'Poste occupé'} • Entreprise Référence
                      </div>
                      <div className="text-[7px] text-gray-500">2023 - Présent • Alger / Paris</div>
                      <div className="text-[7px] text-gray-600 leading-tight mt-0.5">
                        • Pilotage de projets stratégiques avec augmentation de +30% de la performance.
                      </div>
                    </div>

                    {/* Compétences tags */}
                    <div className="border-t border-gray-100 pt-1">
                      <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: currentTmplObj.accent }}>
                        Compétences Clés
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(quickData.skills || 'Compétence 1, Compétence 2, Compétence 3')
                          .split(',')
                          .slice(0, 4)
                          .map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[7px] px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-700"
                            >
                              {sk.trim()}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Footer mini-CV */}
                    <div className="text-[7px] text-gray-400 text-center border-t border-gray-100 pt-1 font-mono">
                      Page 1/1 • Modèle {currentTmplObj.name} • Certifié ATS
                    </div>
                  </div>

                  <div className="text-center">
                    <Link
                      href={`/cv/builder?template=${selectedTemplate}`}
                      className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center justify-center gap-1 transition"
                    >
                      Personnaliser toutes les sections dans le studio <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LA BOÎTE À OUTILS MYCV (GRILLE DE TUILES STYLE ILOVEPDF) ─────────── */}
      <section id="outils" className="py-16 px-4 sm:px-6 bg-[#060a14] border-y border-white/10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-400 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10">
              <Layers size={13} /> Boîte à Outils Complète
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Tous les outils nécessaires pour réussir votre candidature
            </h2>
            <p className="text-sm text-gray-400">
              À l'instar des célèbres outils PDF en ligne, MyCV.click réunit chaque fonction indispensable pour concevoir un dossier de recrutement parfait.
            </p>
          </div>

          {/* Grille des 8 outils façon iLovePDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ILOVEPDF_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#0c1222]/90 border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-violet-950/40 backdrop-blur"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${tool.iconBg}`}>
                        <Icon size={22} />
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-violet-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300">
                    <span>{tool.cta}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SHOWCASE DES 6 MODÈLES DE CV ─────────────────────────────────────── */}
      <section id="designs" className="py-20 px-4 sm:px-6 bg-[#030712]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-pink-400 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/10">
              <Palette size={13} /> Galerie de Modèles
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              6 Designs modernes, ergonomiques et conformes ATS
            </h2>
            <p className="text-sm text-gray-400">
              Chaque modèle est conçu en collaboration avec des professionnels du recrutement pour valoriser votre parcours avec élégance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <div
                  key={tmpl.id}
                  className="rounded-3xl border border-white/10 bg-[#0c1222]/80 overflow-hidden hover:border-white/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="p-5 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${tmpl.badge}`}>
                        {tmpl.category}
                      </span>
                      {tmpl.popular && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> POPULAIRE
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-gray-400 mb-4">{tmpl.tagline}</p>

                    {/* Mini preview */}
                    <div className="max-w-[170px] mx-auto py-2">
                      <CVMiniPreview template={tmpl} isActive={selectedTemplate === tmpl.id} />
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-white/5 space-y-3">
                    <ul className="space-y-1 text-[11px] text-gray-400">
                      {tmpl.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/cv/builder?template=${tmpl.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black bg-white/10 hover:bg-violet-600 text-white transition-all"
                    >
                      <Sparkles size={13} />
                      Choisir ce design
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── EMPLACEMENT PUBLICITAIRE ADSENSE (CONFORME & NON-INTRUSIF) ────────── */}
      <section className="py-6 px-4 bg-[#030712]">
        <AdSenseAd slot="cv-home-middle" />
      </section>

      {/* ─── GUIDE ÉDITORIAL COMPLET ADSENSE (ANTI-THIN-CONTENT) ───────────────── */}
      <section id="guide-ats" className="py-20 px-4 sm:px-6 bg-[#070c18] border-y border-white/10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <Award size={13} /> Guide Expert Recrutement 2026
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Comment réussir son CV et franchir les filtres ATS
            </h2>
            <p className="text-sm text-gray-400">
              Découvrez les règles d'or, les structures recommandées et les stratégies éprouvées pour maximiser vos chances d'obtenir des entretiens d'embauche.
            </p>
          </div>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
            {/* Article Part 1 */}
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/30 flex items-center justify-center text-xs">1</span>
                Qu'est-ce qu'un ATS et comment fonctionne le filtrage automatique ?
              </h3>
              <p>
                Un <strong>Applicant Tracking System (ATS)</strong> est une suite logicielle utilisée par les départements RH et cabinets de recrutement pour trier, analyser et classer les candidatures. Lorsqu'un recruteur reçoit 300 candidatures pour un seul poste, l'ATS extrait les données textuelles du fichier PDF ou Word et calcule un score de pertinence en fonction des mots-clés de l'offre d'emploi.
              </p>
              <p>
                Si votre CV contient des tableaux complexes imbriqués, des colonnes flottantes non indexables ou des images de texte, le robot ne parviendra pas à lire votre profil. C'est pourquoi **MyCV.click applique une hiérarchie stricte** reconnue par tous les moteurs de parsing internationaux (Workday, Taleo, Greenhouse, Lever).
              </p>
            </div>

            {/* Article Part 2 */}
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center text-xs">2</span>
                Les 5 sections indispensables pour un CV d'impact en 2026
              </h3>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">L'en-tête clair et professionnel :</strong> Nom complet, titre de poste ciblé (identique à l'offre visée), coordonnées joignables (email sérieux, numéro, ville) et lien vers votre profil LinkedIn ou portfolio.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">L'accroche / Résumé de carrière :</strong> 3 à 4 lignes percutantes résumant vos années d'expérience, vos spécialisations majeures et la valeur directe que vous apportez à l'entreprise.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Les expériences avec réalisations chiffrées :</strong> Utilisez la méthode STAR (Situation, Tâche, Action, Résultat). Remplacez "Responsable des ventes" par "Pilotage d'un portefeuille de 45 clients avec une croissance du CA de +22% en 12 mois".
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Les compétences techniques & outils (Hard Skills) :</strong> Listez précisément les logiciels, langages ou méthodes maîtrisés pour faire correspondre votre CV aux filtres de recherche des recruteurs.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Formations, Diplômes & Langues :</strong> Mentionnez le diplôme le plus élevé, l'établissement et votre niveau de maîtrise linguistique selon le cadre européen (C1, C2, Bilingue).
                  </div>
                </li>
              </ul>
            </div>

            {/* Article Part 3 */}
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-pink-600/30 text-pink-300 border border-pink-500/30 flex items-center justify-center text-xs">3</span>
                Les 5 erreurs éliminatoires à bannir absolument
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Fautes d'orthographe", desc: "Une seule faute de grammaire divise par deux les chances d'être contacté." },
                  { title: "CV générique non ciblé", desc: "Adapter le titre et les 3 compétences clés à chaque annonce postulée." },
                  { title: "Absence de métriques", desc: "Un recruteur cherche des preuves d'impact concrètes, pas des listes de devoirs." },
                  { title: "Format A4 non respecté", desc: "Un document mal calibré sera coupé lors de l'impression physique chez le recruteur." },
                ].map((err, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="text-xs font-bold text-red-300 mb-1">❌ {err.title}</div>
                    <div className="text-[11px] text-gray-400">{err.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              <HelpCircle size={13} /> Réponses Claires
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Questions Fréquentes</h2>
            <p className="text-xs text-gray-400">Tout ce que vous devez savoir pour concevoir votre CV en toute sérénité.</p>
          </div>
          <div className="space-y-3">
            {faq.map((item, idx) => (
              <FaqItem
                key={idx}
                q={item.q}
                a={item.a}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-6 bg-gradient-to-r from-violet-950/40 via-purple-950/50 to-indigo-950/40 p-8 sm:p-12 rounded-3xl border border-violet-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Check size={13} /> Aucun compte requis • Téléchargement immédiat
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            Prêt à propulser votre carrière ?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Rejoignez des milliers de candidats qui ont obtenu des entretiens grâce aux modèles optimisés de MyCV.click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/cv/builder"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-900/40 hover:scale-105 transition-all"
            >
              <Sparkles size={18} />
              Lancer le Studio CV Complet
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER COMPLET & CONFORME GOOGLE ─────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 bg-[#030712] text-xs text-gray-500">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white font-black text-xs">
                  CV
                </div>
                <span className="font-black text-white text-base">MyCV.click</span>
              </div>
              <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                Le créateur de CV en ligne gratuit et sans filigrane inspiré par la simplicité d'iLovePDF. Conçu pour aider chaque candidat à décrocher des opportunités professionnelles grâce à des formats conformes aux normes ATS.
              </p>
              <div className="text-[11px] text-gray-600">
                Hébergé en Europe • 100% conforme RGPD • Données traitées localement
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Outils CV</div>
              <ul className="space-y-1.5">
                <li><Link href="/cv/builder" className="hover:text-white transition-colors">Studio CV Complet</Link></li>
                <li><a href="#designs" className="hover:text-white transition-colors">6 Modèles Professionnels</a></li>
                <li><Link href="/cv/builder?tab=ai" className="hover:text-white transition-colors">Assistant IA Gemini</Link></li>
                <li><Link href="/cv/builder?tab=ats" className="hover:text-white transition-colors">Calculateur Score ATS</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Informations Légales</div>
              <ul className="space-y-1.5">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Politique de Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Conditions Générales d'Utilisation</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact & Support</Link></li>
                <li><a href="https://elsayf.click" className="hover:text-white transition-colors">Plateforme Elsayf</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-600">
            <div>© 2026 MyCV.click — Tous droits réservés. Propulsé par Elsayf.</div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-gray-400">Confidentialité</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-400">Mentions Légales</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-gray-400">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
