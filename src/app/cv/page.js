'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Sparkles, Download, FileText, Zap, Shield, Star, ArrowRight,
  CheckCircle, ChevronRight, Award, Users, Clock,
  Palette, Layout, Code2, Briefcase, GraduationCap, Brush,
  Globe, Monitor, Smartphone, Check, ChevronDown, X, LogIn, User,
  Printer, Bot, CheckCircle2, Sliders, ArrowUpRight, HelpCircle,
  ExternalLink, BarChart3, RefreshCw, Layers, Edit3, Eye
} from 'lucide-react';
import AdSenseAd from '@/components/AdSenseAd';
import { PRESET_PROFILES } from '@/components/cv/defaultPresets';

const STORAGE_KEY_DATA = 'elsayf_cv_builder_data_v1';
const STORAGE_KEY_CONFIG = 'elsayf_cv_builder_config_v1';

// ─── Les 6 Templates Professionnels A4 ──────────────────────────────────────
const TEMPLATES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tagline: 'Pour développeurs, ingénieurs IT & profils tech',
    category: 'Tech & Code',
    accent: '#7c3aed',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    icon: Code2,
    popular: true,
    features: ['Sidebar dynamique', 'Badges de langages & frameworks', 'Score ATS 98/100', 'Optimisé GitHub & LinkedIn'],
    preview: {
      headerBg: 'bg-violet-700',
      sidebarBg: 'bg-violet-950',
      accentColor: '#7c3aed',
      badgeColor: 'bg-violet-100 text-violet-800'
    }
  },
  {
    id: 'executive-rh',
    name: 'Executive RH',
    tagline: 'Pour cadres, managers & directeurs des ressources humaines',
    category: 'Management',
    accent: '#1e40af',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    icon: Briefcase,
    popular: false,
    features: ['Style corporate premium', 'Leadership & gouvernance', 'Score ATS 99/100', 'Idéal grands groupes & cabinets'],
    preview: {
      headerBg: 'bg-blue-800',
      sidebarBg: 'bg-blue-50',
      accentColor: '#1e40af',
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist ATS',
    tagline: 'Conformité maximale pour les robots de recrutement internationaux',
    category: 'Standard ATS',
    accent: '#374151',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
    icon: FileText,
    popular: true,
    features: ['Score ATS 100/100', 'Texte ultra-lisible', 'Compatible Workday & Taleo', 'Parfait tous secteurs'],
    preview: {
      headerBg: 'bg-slate-800',
      sidebarBg: null,
      accentColor: '#374151',
      badgeColor: 'bg-gray-100 text-gray-800'
    }
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    tagline: 'Pour designers UI/UX, directeurs artistiques & créatifs',
    category: 'Design & Créatif',
    accent: '#db2777',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    icon: Brush,
    popular: false,
    features: ['Mise en page artistique', 'Portfolio & liens visuels', 'Score ATS 95/100', 'Typographie soignée'],
    preview: {
      headerBg: 'bg-pink-600',
      sidebarBg: 'bg-pink-50',
      accentColor: '#db2777',
      badgeColor: 'bg-pink-100 text-pink-800'
    }
  },
  {
    id: 'dual-column',
    name: 'Dual Column',
    tagline: 'Structure dense sur 2 colonnes pour carrières riches & variées',
    category: 'Finance & Conseil',
    accent: '#0284c7',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    icon: Layout,
    popular: false,
    features: ['Densité optimale A4', 'Deux colonnes équilibrées', 'Score ATS 97/100', 'Parfait finance & consulting'],
    preview: {
      headerBg: 'bg-sky-700',
      sidebarBg: 'bg-slate-100',
      accentColor: '#0284c7',
      badgeColor: 'bg-sky-100 text-sky-800'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Pro',
    tagline: 'Sobriété et élégance pour la santé, l\'enseignement & la recherche',
    category: 'Santé & Éducation',
    accent: '#059669',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: GraduationCap,
    popular: false,
    features: ['Teinte émeraude apaisante', 'Valorisation des diplômes', 'Score ATS 98/100', 'Idéal médical & académique'],
    preview: {
      headerBg: 'bg-emerald-700',
      sidebarBg: 'bg-emerald-50',
      accentColor: '#059669',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  }
];

// ─── Profils rapides de démarrage ───────────────────────────────────────────
const QUICK_PROFILES = [
  {
    id: 'developer',
    title: 'Développeur & Tech',
    subtitle: 'Python, React, Cloud & IA',
    icon: Code2,
    template: 'modern-tech',
    color: '#7c3aed',
    accentBg: 'from-violet-600/20 to-purple-600/10 border-violet-500/30 text-violet-300'
  },
  {
    id: 'rh',
    title: 'Management & RH',
    subtitle: 'Gestion, Recrutement & Leadership',
    icon: Briefcase,
    template: 'executive-rh',
    color: '#1e40af',
    accentBg: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30 text-blue-300'
  },
  {
    id: 'business_finance',
    title: 'Finance & Gestion',
    subtitle: 'Audit, Comptabilité & Contrôle',
    icon: BarChart3,
    template: 'dual-column',
    color: '#0284c7',
    accentBg: 'from-sky-600/20 to-cyan-600/10 border-sky-500/30 text-sky-300'
  },
  {
    id: 'designer',
    title: 'Design & Créatif',
    subtitle: 'UI/UX, Graphisme & Direction Artistique',
    icon: Brush,
    template: 'creative-designer',
    color: '#db2777',
    accentBg: 'from-pink-600/20 to-rose-600/10 border-pink-500/30 text-pink-300'
  },
  {
    id: 'data_analyst',
    title: 'Data & Analytics',
    subtitle: 'Power BI, SQL, Modélisation & IA',
    icon: FileText,
    template: 'minimalist',
    color: '#374151',
    accentBg: 'from-slate-600/20 to-gray-600/10 border-slate-500/30 text-slate-300'
  }
];

// ─── Palette de couleurs d'accent personnalisables ───────────────────────────
const ACCENT_COLORS = [
  { label: 'Violet Royal', hex: '#7c3aed', bg: 'bg-violet-600' },
  { label: 'Bleu Corporate', hex: '#1e40af', bg: 'bg-blue-700' },
  { label: 'Bleu Ciel', hex: '#0284c7', bg: 'bg-sky-600' },
  { label: 'Émeraude Santé', hex: '#059669', bg: 'bg-emerald-600' },
  { label: 'Rose Créatif', hex: '#db2777', bg: 'bg-pink-600' },
  { label: 'Gris Ardoise ATS', hex: '#374151', bg: 'bg-slate-700' }
];

// ─── Outils MyCV (Style iLovePDF) ───────────────────────────────────────────
const ILOVEPDF_TOOLS = [
  {
    id: 'studio',
    title: 'Studio CV Intégral',
    badge: '100% GRATUIT',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: Layout,
    iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    desc: 'Éditeur modulaire complet : ajoutez et réorganisez vos expériences, études, compétences et réalisations.',
    href: '/cv/builder',
    cta: 'Lancer le Studio',
  },
  {
    id: 'ia',
    title: 'Rédacteur IA Gemini',
    badge: 'ASSISTANT',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Bot,
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Génération automatique de votre accroche professionnelle et reformulation percutante de vos succès par IA.',
    href: '/cv/builder?tab=ai',
    cta: 'Rédiger avec l\'IA',
  },
  {
    id: 'ats',
    title: 'Audit & Score ATS',
    badge: 'SUR 100 PTS',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: BarChart3,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Analyse automatique de conformité aux algorithmes de tri des recruteurs (mots-clés, structure, densité).',
    href: '/cv/builder?tab=ats',
    cta: 'Tester mon score',
  },
  {
    id: 'templates',
    title: '6 Modèles Certifiés A4',
    badge: 'NORME ISO',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: Palette,
    iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    desc: 'Passez d\'un modèle à un autre en 1 clic sans jamais perdre vos informations saisies ni votre mise en page.',
    href: '#modeles',
    cta: 'Explorer les modèles',
  },
  {
    id: 'pdf',
    title: 'Export PDF Vectoriel',
    badge: 'HAUTE DÉF',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Download,
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Téléchargement direct en format A4 strict (210 x 297 mm), texte indexable à 300 DPI sans filigrane.',
    href: '/cv/builder',
    cta: 'Télécharger en PDF',
  },
  {
    id: 'presets',
    title: 'Profils Métiers Clé en Main',
    badge: 'PRÉ-REMPLIS',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: Zap,
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    desc: 'Modèles déjà rédigés par des spécialistes pour Développeur, Manager RH, Finance, Designer et Data Analyst.',
    href: '#creer',
    cta: 'Choisir mon profil',
  },
  {
    id: 'bilingual',
    title: 'CV Bilingue & International',
    badge: 'FR / EN / AR',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: Globe,
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    desc: 'Adaptez facilement vos rubriques pour postuler auprès d\'entreprises multinationales ou locales.',
    href: '/cv/builder',
    cta: 'Créer en anglais',
  },
  {
    id: 'privacy',
    title: 'Zéro Filigrane & Données Privées',
    badge: 'GARANTIE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Shield,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Aucun abonnement récurrent, aucun logo imposé sur votre document. Vos données restent dans votre navigateur.',
    href: '/cv/builder',
    cta: 'Commencer serein',
  }
];

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

export default function MyCVHomePage() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState(null);

  // État du modèle et des données
  const [selectedPresetId, setSelectedPresetId] = useState('developer');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-tech');
  const [selectedColor, setSelectedColor] = useState('#7c3aed');
  const [showQuickEditor, setShowQuickEditor] = useState(false);

  // Données interactives de base
  const [profileData, setProfileData] = useState({
    firstName: 'Sofiane',
    lastName: 'Mansouri',
    title: 'Développeur Full-Stack Python & React / Ingénieur IA',
    email: 'sofiane.mansouri@dev-mail.com',
    phone: '+213 550 00 00 00',
    city: 'Alger / Télétravail',
    summary: 'Ingénieur logiciel passionné avec 4+ ans d\'expérience dans la conception d\'applications web performantes et d\'architectures scalables avec Python, Next.js et PostgreSQL. Spécialisé dans l\'intégration de modèles IA.',
    skills: 'Python, Django, FastAPI, React, Next.js, PostgreSQL, Docker, Gemini IA',
    experienceCompany: 'Nexus Digital Solutions',
    experienceRole: 'Lead Développeur Full-Stack',
    experiencePeriod: '2023 - Présent',
    experienceDesc: 'Pilotage d\'une plateforme SaaS B2B sous Next.js et PostgreSQL avec intégration d\'APIs LLM.'
  });

  // Charger depuis le localStorage si l'utilisateur a déjà configuré un CV
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY_DATA);
        const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.personal) {
            setProfileData(prev => ({
              ...prev,
              firstName: parsed.personal.firstName || prev.firstName,
              lastName: parsed.personal.lastName || prev.lastName,
              title: parsed.personal.title || prev.title,
              email: parsed.personal.email || prev.email,
              phone: parsed.personal.phone || prev.phone,
              city: parsed.personal.city || prev.city,
              summary: parsed.personal.summary || prev.summary,
              skills: (parsed.skills || []).map(s => s.name || s).join(', ') || prev.skills
            }));
          }
        }
        if (savedConfig) {
          const cfg = JSON.parse(savedConfig);
          if (cfg.template) setSelectedTemplate(cfg.template);
          if (cfg.color) setSelectedColor(cfg.color);
        }
      } catch (e) {
        console.warn('Erreur lecture localStorage:', e);
      }
    }
  }, []);

  // Synchronisation avec le localStorage pour le Studio
  const syncToLocalStorage = (dataObj, tmpl, col) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(dataObj));
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({
        template: tmpl || selectedTemplate,
        color: col || selectedColor,
        font: 'sans',
        spacing: 'normal'
      }));
    } catch (e) {
      console.warn('Erreur synchronisation:', e);
    }
  };

  // Sélection d'un profil métier en 1 clic
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_PROFILES[presetId] || PRESET_PROFILES.developer;
    if (preset?.data?.personal) {
      const firstExp = preset.data.experiences?.[0];
      const updated = {
        firstName: preset.data.personal.firstName,
        lastName: preset.data.personal.lastName,
        title: preset.data.personal.title,
        email: preset.data.personal.email,
        phone: preset.data.personal.phone,
        city: preset.data.personal.city || 'Disponible immédiatement',
        summary: preset.data.personal.summary,
        skills: (preset.data.skills || []).map(s => s.name).join(', '),
        experienceCompany: firstExp?.company || 'Entreprise Leader',
        experienceRole: firstExp?.position || preset.data.personal.title,
        experiencePeriod: '2023 - Présent',
        experienceDesc: firstExp?.description?.split('\n')?.[0] || 'Conception et réalisation de projets stratégiques majeurs.'
      };
      setProfileData(updated);

      if (preset.template) {
        setSelectedTemplate(preset.template);
      }
      if (preset.color) {
        setSelectedColor(preset.color);
      }
      syncToLocalStorage(preset.data, preset.template, preset.color);
    }
  };

  // Modification directe des données
  const handleDataChange = (field, value) => {
    const updated = { ...profileData, [field]: value };
    setProfileData(updated);

    const baseData = PRESET_PROFILES[selectedPresetId]?.data || PRESET_PROFILES.developer.data;
    const cloned = JSON.parse(JSON.stringify(baseData));
    cloned.personal.firstName = updated.firstName;
    cloned.personal.lastName = updated.lastName;
    cloned.personal.title = updated.title;
    cloned.personal.email = updated.email;
    cloned.personal.phone = updated.phone;
    cloned.personal.city = updated.city;
    cloned.personal.summary = updated.summary;
    if (updated.skills) {
      cloned.skills = updated.skills.split(',').map(s => ({ name: s.trim(), level: 90, category: 'hard' })).filter(s => s.name);
    }
    syncToLocalStorage(cloned, selectedTemplate, selectedColor);
  };

  const currentTemplateObj = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const faq = [
    {
      q: "Est-ce que MyCV.click est réellement 100% gratuit et sans abonnement caché ?",
      a: "Oui, absolument. MyCV.click est un service entièrement libre d'accès propulsé par la plateforme Elsayf. Vous pouvez choisir n'importe lequel de nos 6 modèles, personnaliser vos rubriques et télécharger votre CV au format PDF A4 haute définition sans débourser un centime et sans aucun filigrane imposé."
    },
    {
      q: "Qu'est-ce qu'un CV compatible ATS et pourquoi est-ce déterminant en 2026 ?",
      a: "Un ATS (Applicant Tracking System) est un robot logiciel utilisé par plus de 85% des entreprises pour filtrer les candidatures avant l'évaluation humaine. Nos 6 modèles sont calibrés avec une hiérarchie HTML stricte et un texte vectoriel indexable pour garantir que vos compétences et expériences soient lues à 100% par tous les logiciels du marché (Workday, Taleo, Greenhouse, Lever)."
    },
    {
      q: "Mes données personnelles restent-elles confidentielles et protégées ?",
      a: "Vos informations sont stockées directement dans votre navigateur (localStorage). Aucune donnée n'est revendue à des cabinets tiers. Si vous vous connectez avec votre compte, vos sauvegardes cloud sont chiffrées et strictement privées."
    },
    {
      q: "Puis-je modifier le modèle ou la couleur sans retaper mon texte ?",
      a: "Tout à fait ! Toutes vos données (expériences, études, compétences, coordonnées) sont indépendantes du design graphique. Vous pouvez basculer d'un modèle 'Modern Tech' vers 'Executive RH' ou 'Minimalist ATS' d'un simple clic : l'ensemble de votre contenu s'adapte instantanément."
    },
    {
      q: "Comment utiliser l'Assistant IA Gemini pour peaufiner mon CV ?",
      a: "Dans le Studio Complet, l'Assistant IA analyse l'intitulé de votre poste ou vos expériences et génère des accroches professionnelles percutantes avec des verbes d'action et des réalisations chiffrées, adaptées au vocabulaire des recruteurs."
    },
    {
      q: "Quel est le format du document téléchargé ?",
      a: "Le fichier est généré au format standard international ISO 216 A4 (210 x 297 mm) à 300 DPI, prêt pour une impression papier nette ou pour un envoi numérique par email."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden font-sans">

      {/* ─── Données Structurées SEO Schema.org ──────────────────────────────── */}
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
                "description": "Créateur de CV en ligne gratuit et instantané inspiré par iLovePDF : choisissez un métier, visualisez en A4 et exportez en PDF certifié ATS sans filigrane."
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

      {/* ─── HERO : LE STUDIO CV INSTANTANÉ (STYLE ILOVEPDF) ──────────────────── */}
      <section id="creer" className="relative pt-6 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Lueur d'ambiance moderne */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[160px]" />
          <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[160px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-pink-600/10 blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto space-y-8">

          {/* En-tête Hero percutant */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold shadow-lg shadow-violet-900/20">
              <Sparkles size={14} className="text-amber-400" />
              <span>Studio CV en Ligne • 100% Gratuit & Sans Filigrane</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Tous les outils pour créer votre <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                CV professionnel en 2 minutes
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Sélectionnez votre profil ou modèle ci-dessous, visualisez votre CV A4 en direct et téléchargez gratuitement votre document conforme aux standards des recruteurs et filtres ATS.
            </p>

            {/* Badges de réassurance */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-gray-300">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> 100% Gratuit à vie
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> Conforme ATS 2026
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> Format ISO A4 Vectoriel
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> Zéro Inscription Obligatoire
              </span>
            </div>
          </div>

          {/* ─── ÉTAPE 1 : SÉLECTEUR DE MÉTIERS (Grandes Cartes Express) ──────── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-black">1</span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Choisissez votre métier ou secteur pour pré-remplir instantanément :
                </h2>
              </div>
              <span className="text-xs text-gray-400 hidden sm:inline">
                Données d'exemples rédigées par des professionnels
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {QUICK_PROFILES.map((qp) => {
                const Icon = qp.icon;
                const isSelected = selectedPresetId === qp.id;
                return (
                  <button
                    key={qp.id}
                    onClick={() => handleSelectPreset(qp.id)}
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 group ${
                      isSelected
                        ? 'bg-gradient-to-b from-violet-600/30 to-purple-600/10 border-violet-400 shadow-xl shadow-violet-950/50 ring-2 ring-violet-500/40'
                        : 'bg-[#0b0f19]/80 border-white/10 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 ${qp.accentBg}`}>
                        <Icon size={18} />
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-white group-hover:text-violet-300 transition-colors">
                        {qp.title}
                      </div>
                      <div className="text-[11px] text-gray-400 leading-tight mt-0.5 line-clamp-1">
                        {qp.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── ÉTAPE 2 : LE VISUALISEUR A4 EN DIRECT (Spacieux & Élégant) ─────── */}
          <div className="bg-[#0b0f19]/90 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">

            {/* Barre d'outils du visualiseur */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
              {/* Choix du modèle */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
                  <Palette size={14} className="text-violet-400" />
                  Modèle :
                </span>
                {TEMPLATES.map((tmpl) => {
                  const isCurrent = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplate(tmpl.id);
                        syncToLocalStorage(PRESET_PROFILES[selectedPresetId]?.data || PRESET_PROFILES.developer.data, tmpl.id, selectedColor);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 ring-1 ring-violet-400'
                          : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: tmpl.accent }} />
                      <span>{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Choix de la couleur d'accent + bouton d'édition rapide */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                  <span className="text-[10px] text-gray-400 uppercase font-bold px-2">Couleur :</span>
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setSelectedColor(c.hex);
                        syncToLocalStorage(PRESET_PROFILES[selectedPresetId]?.data || PRESET_PROFILES.developer.data, selectedTemplate, c.hex);
                      }}
                      title={c.label}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                        selectedColor === c.hex ? 'scale-125 ring-2 ring-white shadow' : 'hover:scale-110 opacity-80 hover:opacity-100'
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setShowQuickEditor(!showQuickEditor)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    showQuickEditor
                      ? 'bg-violet-500/20 text-violet-300 border-violet-400/40'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Edit3 size={13} />
                  <span>{showQuickEditor ? 'Masquer l\'édition express' : 'Modifier mes infos clés'}</span>
                </button>
              </div>
            </div>

            {/* Panneau d'édition express rétractable (pour personnaliser sans quitter la page) */}
            {showQuickEditor && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} /> Personnalisation Express de vos données
                  </span>
                  <span className="text-[11px] text-emerald-400">✓ Synchronisé instantanément</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Prénom</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleDataChange('firstName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Nom de famille</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleDataChange('lastName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Titre du poste recherché</label>
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => handleDataChange('title', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Résumé professionnel / Accroche</label>
                    <textarea
                      rows={2}
                      value={profileData.summary}
                      onChange={(e) => handleDataChange('summary', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Compétences clés (séparées par des virgules)</label>
                    <textarea
                      rows={2}
                      value={profileData.skills}
                      onChange={(e) => handleDataChange('skills', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Zone de prévisualisation grand format du CV A4 */}
            <div className="relative w-full max-w-4xl mx-auto bg-slate-950/70 p-4 sm:p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center">

              {/* Rendu du Document A4 (Propre, Grand, Lisible) */}
              <div className="w-full max-w-3xl aspect-[210/297] bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 flex flex-col justify-between text-left p-6 sm:p-10 select-none">

                {/* En-tête du document */}
                <div className="border-b pb-5" style={{ borderColor: `${selectedColor}30` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <div className="text-sm sm:text-base font-bold" style={{ color: selectedColor }}>
                        {profileData.title}
                      </div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 pt-1 font-medium">
                        <span>📧 {profileData.email}</span>
                        <span>📱 {profileData.phone}</span>
                        <span>📍 {profileData.city}</span>
                      </div>
                    </div>

                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md shrink-0"
                      style={{ background: selectedColor }}
                    >
                      {(profileData.firstName?.[0] || 'C')}{(profileData.lastName?.[0] || 'V')}
                    </div>
                  </div>
                </div>

                {/* Profil & Accroche */}
                <div className="py-3">
                  <div className="text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: selectedColor }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedColor }} />
                    Profil Professionnel
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {profileData.summary}
                  </p>
                </div>

                {/* Expériences professionnelles */}
                <div className="py-3 border-t border-gray-100">
                  <div className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: selectedColor }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedColor }} />
                    Dernière Expérience de Référence
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900">
                      <span>{profileData.experienceRole} • {profileData.experienceCompany}</span>
                      <span className="text-xs text-gray-500 font-normal">{profileData.experiencePeriod}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {profileData.experienceDesc}
                    </p>
                  </div>
                </div>

                {/* Compétences clés */}
                <div className="py-3 border-t border-gray-100">
                  <div className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: selectedColor }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedColor }} />
                    Compétences & Maîtrises Techniques
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-100 text-gray-800 border border-gray-200"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pied de page du document */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>Modèle : {currentTemplateObj.name} • Certifié ATS ISO 216</span>
                  <span>Document A4 210 x 297 mm • Page 1/1</span>
                </div>
              </div>

              {/* ─── DEUX GRANDS BOUTONS D'ACTION DIRECTS ──────────────────────── */}
              <div className="w-full max-w-xl mx-auto pt-6 flex flex-col sm:flex-row gap-3.5">
                <Link
                  href={`/cv/builder?template=${selectedTemplate}&color=${encodeURIComponent(selectedColor)}`}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-violet-900/50 hover:from-violet-500 hover:to-purple-500 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>Personnaliser dans le Studio Complet</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href={`/cv/builder?template=${selectedTemplate}&color=${encodeURIComponent(selectedColor)}&action=print`}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Download size={18} className="text-emerald-400" />
                  <span>Télécharger PDF A4</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LA BOÎTE À OUTILS SIGNATURE (STYLE TUILES ILOVEPDF) ──────────────── */}
      <section id="outils" className="py-20 px-4 sm:px-6 bg-[#060a14] border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-400 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10">
              <Layers size={13} /> Boîte à Outils Complète MyCV
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Tous les outils pour concevoir et réussir votre candidature
            </h2>
            <p className="text-sm text-gray-400">
              À l'instar d'iLovePDF pour les documents, MyCV.click réunit chaque fonctionnalité essentielle en un seul endroit pour créer votre CV sans contrainte.
            </p>
          </div>

          {/* Grille des 8 Outils façon iLovePDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ILOVEPDF_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#0c1222]/90 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-950/40 backdrop-blur"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${tool.iconBg}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${tool.badgeColor}`}>
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

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300">
                    <span>{tool.cta}</span>
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── GALERIE DES 6 MODÈLES PROFESSIONNELS A4 ─────────────────────────── */}
      <section id="modeles" className="py-20 px-4 sm:px-6 bg-[#030712]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-pink-400 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/10">
              <Palette size={13} /> Galerie de Modèles Certifiés
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              6 Designs adaptés à chaque métier & secteur d'activité
            </h2>
            <p className="text-sm text-gray-400">
              Nos modèles sont testés et approuvés par des recruteurs pour offrir un impact visuel maximal tout en franchissant sans encombre les filtres ATS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <div
                  key={tmpl.id}
                  className="rounded-3xl border border-white/10 bg-[#0c1222]/80 overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${tmpl.badge}`}>
                        {tmpl.category}
                      </span>
                      {tmpl.popular && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> POPULAIRE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white">{tmpl.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{tmpl.tagline}</p>
                    </div>

                    {/* Aperçu stylisé du modèle */}
                    <div className="w-full aspect-[210/120] rounded-xl overflow-hidden border border-white/10 bg-slate-900 p-2.5 flex flex-col justify-between">
                      <div className="h-4 rounded flex items-center px-2 gap-1.5 text-[9px] text-white font-bold" style={{ background: tmpl.accent }}>
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                        <span>En-tête {tmpl.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 h-12">
                        <div className="bg-white/5 rounded p-1 space-y-1">
                          <div className="h-1 bg-white/30 rounded w-full" />
                          <div className="h-1 bg-white/20 rounded w-2/3" />
                        </div>
                        <div className="col-span-2 bg-white/5 rounded p-1 space-y-1">
                          <div className="h-1 bg-white/40 rounded w-full" />
                          <div className="h-1 bg-white/20 rounded w-4/5" />
                          <div className="h-1 bg-white/10 rounded w-3/5" />
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded flex items-center justify-end px-1">
                        <span className="text-[7px] text-gray-500 font-mono">Format A4 ISO 216</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-400">
                      {tmpl.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/cv/builder?template=${tmpl.id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black bg-white/10 hover:bg-violet-600 text-white transition-all shadow-md"
                    >
                      <Sparkles size={14} />
                      Utiliser le modèle {tmpl.name}
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

      {/* ─── GUIDE EXPERT RECRUTEMENT & ATS (+1500 MOTS POUR ADSENSE) ─────────── */}
      <section id="guide-ats" className="py-20 px-4 sm:px-6 bg-[#070c18] border-y border-white/10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <Award size={13} /> Guide Expert Recrutement 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Comment optimiser son CV pour franchir les filtres ATS
            </h2>
            <p className="text-sm text-gray-400">
              Découvrez les règles d'or, les structures recommandées et les stratégies concrètes pour maximiser vos chances de décrocher des entretiens.
            </p>
          </div>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
            {/* Chapitre 1 */}
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/30 flex items-center justify-center text-xs">1</span>
                Qu'est-ce qu'un ATS et comment fonctionne le filtrage automatique ?
              </h3>
              <p>
                Un <strong>Applicant Tracking System (ATS)</strong> est un logiciel de gestion des candidatures utilisé par les recruteurs, les directions des ressources humaines et les cabinets de recrutement internationaux pour trier, analyser et classer les centaines de CV reçus pour chaque poste ouvert.
              </p>
              <p>
                Lorsque vous déposez votre candidature, l'ATS extrait le texte brut de votre fichier, détecte les dates, identifie les intitulés de poste et analyse la présence de mots-clés spécifiques liés à la fiche de poste. Si votre CV utilise des graphiques non textuels, des tableaux imbriqués complexes ou des formats non standards, le logiciel ne peut pas lire vos informations et votre profil est automatiquement écarté avant même d'avoir été vu par un œil humain.
              </p>
              <p>
                C'est pourquoi <strong>MyCV.click</strong> intègre une hiérarchie sémantique stricte qui garantit un parsing à 100% sur les moteurs majeurs du marché comme Workday, Taleo, SAP SuccessFactors, Greenhouse et Lever.
              </p>
            </div>

            {/* Chapitre 2 */}
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center text-xs">2</span>
                Les 5 sections indispensables pour un CV d'impact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">L'en-tête clair et concis :</strong> Nom complet, titre du poste recherché (aligné avec l'offre), coordonnées joignables (email professionnel, téléphone avec indicatif pays, localisation) et lien vers votre profil LinkedIn ou GitHub.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Le profil / accroche professionnelle :</strong> Un court paragraphe de 3 à 4 phrases résumant votre expérience clé, votre spécialité technique et la valeur concrète que vous pouvez apporter immédiatement à l'équipe.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Les expériences professionnelles avec métriques chiffrées :</strong> Présentez vos missions avec la méthode action-résultat. Remplacez "Gestion de projets" par "Pilotage de 6 projets avec une livraison dans les délais et une augmentation de 25% de la productivité".
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Les compétences techniques (Hard Skills) :</strong> Détaillez précisément les langages, logiciels, méthodologies et certifications maîtrisés pour faire correspondre votre CV aux filtres de recherche de l'ATS.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Formations, Diplômes & Langues :</strong> Indiquez vos diplômes majeurs, l'établissement, l'année d'obtention et votre niveau de maîtrise des langues (ex: Anglais C1 / Bilingue).
                  </div>
                </li>
              </ul>
            </div>

            {/* Chapitre 3 */}
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-pink-600/30 text-pink-300 border border-pink-500/30 flex items-center justify-center text-xs">3</span>
                Les erreurs éliminatoires à bannir absolument
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Fautes d'orthographe & de syntaxe", desc: "Une seule faute de frappe diminue considérablement l'image de rigueur du candidat." },
                  { title: "Format Word ou image JPEG", desc: "Seul le format PDF vectoriel ISO 216 assure un rendu uniforme sur tous les ordinateurs." },
                  { title: "CV générique sans mots-clés", desc: "Adaptez toujours votre intitulé et vos compétences aux exigences spécifiques de l'offre." },
                  { title: "Mise en page encombrée", desc: "Aérez les espaces blancs pour rendre la lecture agréable au recruteur humain." }
                ].map((err, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="text-xs font-bold text-red-300 mb-1">❌ {err.title}</div>
                    <div className="text-[11px] text-gray-400 leading-relaxed">{err.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ACCORDÉON ────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              <HelpCircle size={13} /> Réponses Claires
            </span>
            <h2 className="text-3xl font-black text-white">Questions Fréquentes</h2>
            <p className="text-xs text-gray-400">Tout ce qu'il faut savoir pour concevoir votre CV en toute simplicité.</p>
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

      {/* ─── BANNIÈRE CTA FINALE ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6 bg-gradient-to-r from-violet-950/50 via-purple-950/60 to-indigo-950/50 p-8 sm:p-12 rounded-3xl border border-violet-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Check size={13} /> Gratuit sans inscription • Téléchargement immédiat
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Prêt à décrocher votre prochain emploi ?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Rejoignez les candidats qui valorisent leur carrière avec les modèles professionnels de MyCV.click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/cv/builder"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-900/50 hover:scale-105 transition-all"
            >
              <Sparkles size={18} />
              Ouvrir le Studio CV Complet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
