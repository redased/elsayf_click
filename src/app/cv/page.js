'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Download, FileText, Zap, Shield, Star, ArrowRight,
  CheckCircle, ChevronRight, Award, Users, Clock,
  Palette, Layout, Code2, Briefcase, GraduationCap, Brush,
  Globe, Monitor, Smartphone, Check, ChevronDown, X, LogIn, User,
  Printer, Bot, CheckCircle2, Sliders, ArrowUpRight, HelpCircle,
  ExternalLink, BarChart3, RefreshCw, Layers, Edit3, Eye, FileCheck,
  Search, Lock, CheckSquare, Sparkle
} from 'lucide-react';
import AdSenseAd from '@/components/AdSenseAd';
import { PRESET_PROFILES } from '@/components/cv/defaultPresets';
import ModernTechTemplate from '@/components/cv/templates/ModernTechTemplate';
import ExecutiveRHTemplate from '@/components/cv/templates/ExecutiveRHTemplate';
import CreativeDesignerTemplate from '@/components/cv/templates/CreativeDesignerTemplate';
import MinimalistTemplate from '@/components/cv/templates/MinimalistTemplate';
import DualColumnTemplate from '@/components/cv/templates/DualColumnTemplate';
import EmeraldTemplate from '@/components/cv/templates/EmeraldTemplate';

const STORAGE_KEY_DATA = 'elsayf_cv_builder_data_v1';
const STORAGE_KEY_CONFIG = 'elsayf_cv_builder_config_v1';

// ─── 6 Modèles Professionnels A4 ─────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tagline: 'Développeurs, ingénieurs & métiers de la tech',
    category: 'Tech & Code',
    accent: '#7c3aed',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: Code2,
    popular: true,
    score: '98/100',
    features: ['Sidebar dynamique', 'Badges de compétences', 'Liens GitHub/LinkedIn']
  },
  {
    id: 'executive-rh',
    name: 'Executive RH',
    tagline: 'Cadres, managers & fonctions corporate',
    category: 'Management',
    accent: '#1e40af',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Briefcase,
    popular: false,
    score: '99/100',
    features: ['Mise en page épurée', 'Sections réalisations', 'Idéal grands groupes']
  },
  {
    id: 'minimalist',
    name: 'Minimalist ATS',
    tagline: 'Optimisé à 100% pour franchir tous les filtres ATS',
    category: 'Standard Universel',
    accent: '#374151',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    icon: FileText,
    popular: true,
    score: '100/100',
    features: ['Structure ATS pure', 'Polices universelles', 'Zéro friction parsing']
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    tagline: 'Designers, communicants & profils créatifs',
    category: 'Design & Médias',
    accent: '#db2777',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: Brush,
    popular: false,
    score: '95/100',
    features: ['Palette chaleureuse', 'Section portfolio', 'Typographie contemporaine']
  },
  {
    id: 'dual-column',
    name: 'Dual Column',
    tagline: 'Deux colonnes équilibrées pour carrières denses',
    category: 'Finance & Conseil',
    accent: '#0284c7',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: Layout,
    popular: false,
    score: '97/100',
    features: ['Double colonne moderne', 'Richesse d\'informations', 'Lecture fluide']
  },
  {
    id: 'emerald',
    name: 'Emerald Pro',
    tagline: 'Médical, enseignement, recherche & conseil',
    category: 'Santé & Sciences',
    accent: '#059669',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: GraduationCap,
    popular: false,
    score: '98/100',
    features: ['Teinte émeraude sobre', 'Mise en avant diplômes', 'Structure académique']
  }
];

// ─── Profils métiers de pré-remplissage rapide ───────────────────────────────
const QUICK_PROFILES = [
  { id: 'developer', title: 'Tech & Développeur', subtitle: 'Full-Stack, Python, Cloud', icon: Code2, template: 'modern-tech', color: '#7c3aed' },
  { id: 'rh', title: 'Management & RH', subtitle: 'Dirigeant, Recruteur, Chef de projet', icon: Briefcase, template: 'executive-rh', color: '#1e40af' },
  { id: 'business_finance', title: 'Finance & Gestion', subtitle: 'Contrôleur, Auditeur, Banque', icon: BarChart3, template: 'dual-column', color: '#0284c7' },
  { id: 'designer', title: 'Design & Créatif', subtitle: 'UI/UX, Graphiste, Directeur Artistique', icon: Brush, template: 'creative-designer', color: '#db2777' },
  { id: 'data_analyst', title: 'Data & Analyste', subtitle: 'Data Scientist, Business Intelligence', icon: FileCheck, template: 'minimalist', color: '#374151' }
];

// ─── Couleurs d'accent ────────────────────────────────────────────────────────
const ACCENT_COLORS = [
  { label: 'Violet', hex: '#7c3aed', bg: 'bg-violet-600' },
  { label: 'Bleu', hex: '#1e40af', bg: 'bg-blue-700' },
  { label: 'Cyan', hex: '#0284c7', bg: 'bg-sky-600' },
  { label: 'Émeraude', hex: '#059669', bg: 'bg-emerald-600' },
  { label: 'Rose', hex: '#db2777', bg: 'bg-pink-600' },
  { label: 'Anthracite', hex: '#374151', bg: 'bg-slate-700' }
];

// ─── Boîte à outils iLovePDF style ──────────────────────────────────────────
const TOOLS_GRID = [
  {
    id: 'builder',
    title: 'Créateur de CV Complet',
    badge: 'LE PLUS POPULAIRE',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: Layout,
    iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    desc: 'Construisez votre CV pas-à-pas avec aperçu direct, sections illimitées et sauvegarde automatique.',
    href: '/cv/builder',
    cta: 'Ouvrir le créateur'
  },
  {
    id: 'templates',
    title: '6 Modèles de CV A4',
    badge: '100% GRATUIT',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: Palette,
    iconColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    desc: 'Explorez 6 mises en page certifiées conformes aux standards internationaux des recruteurs.',
    href: '#modeles',
    cta: 'Voir les modèles'
  },
  {
    id: 'ats',
    title: 'Optimiseur de Score ATS',
    badge: 'IA & PARSING',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: BarChart3,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    desc: 'Vérifiez en temps réel le taux de compatibilité de votre CV face aux logiciels de recrutement.',
    href: '/cv/builder?tab=ats',
    cta: 'Tester mon score'
  },
  {
    id: 'ai',
    title: 'Rédacteur IA Gemini',
    badge: 'INTELLIGENCE ARTIFICIELLE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Bot,
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    desc: 'Rédigez automatiquement vos accroches professionnelles et formulez des expériences percutantes.',
    href: '/cv/builder?tab=ai',
    cta: 'Rédiger avec l\'IA'
  },
  {
    id: 'pdf',
    title: 'Exportateur PDF Vectoriel',
    badge: '300 DPI - SANS FILIGRANE',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Download,
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    desc: 'Convertissez instantanément votre CV au format PDF prêt à l\'impression ou à l\'envoi par email.',
    href: '/cv/builder',
    cta: 'Exporter mon CV'
  },
  {
    id: 'presets',
    title: 'Modèles pré-remplis',
    badge: 'GAIN DE TEMPS',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: Zap,
    iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    desc: 'Partez d\'exemples professionnels complets adaptés à votre industrie (Tech, RH, Finance, etc.).',
    href: '#creer',
    cta: 'Choisir un profil'
  },
  {
    id: 'bilingual',
    title: 'CV Bilingue & International',
    badge: 'FR / EN / AR',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: Globe,
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    desc: 'Traduisez et adaptez le vocabulaire de votre CV selon le pays où vous souhaitez postuler.',
    href: '/cv/builder',
    cta: 'Passer en bilingue'
  },
  {
    id: 'security',
    title: 'Sécurité & Confidentialité',
    badge: '100% PRIVÉ',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: Shield,
    iconColor: 'text-green-400 bg-green-500/10 border-green-500/20',
    desc: 'Vos informations personnelles restent stockées dans votre navigateur, aucun tiers n\'y a accès.',
    href: '/privacy',
    cta: 'En savoir plus'
  }
];

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
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedPresetId, setSelectedPresetId] = useState('developer');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-tech');
  const [selectedColor, setSelectedColor] = useState('#7c3aed');
  const [showQuickEditor, setShowQuickEditor] = useState(false);
  const [currentCvData, setCurrentCvData] = useState(() => {
    return PRESET_PROFILES.developer?.data || null;
  });

  // Charger depuis le localStorage au montage si existant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY_DATA);
        const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed && parsed.personal) {
            setCurrentCvData(parsed);
          }
        }
        if (savedConfig) {
          const cfg = JSON.parse(savedConfig);
          if (cfg.template) setSelectedTemplate(cfg.template);
          if (cfg.color) setSelectedColor(cfg.color);
        }
      } catch (e) {
        console.warn('Erreur chargement localStorage:', e);
      }
    }
  }, []);

  // Synchroniser les choix dans le localStorage
  const saveState = (data, tmpl, col) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({
        template: tmpl,
        color: col,
        font: 'sans',
        spacing: 'normal'
      }));
    } catch (e) {
      console.warn('Erreur sauvegarde:', e);
    }
  };

  // Sélection d'un profil pré-rempli
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_PROFILES[presetId] || PRESET_PROFILES.developer;
    if (preset?.data) {
      setCurrentCvData(preset.data);
      if (preset.template) setSelectedTemplate(preset.template);
      if (preset.color) setSelectedColor(preset.color);
      saveState(preset.data, preset.template || selectedTemplate, preset.color || selectedColor);
    }
  };

  // Changement de template
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    saveState(currentCvData, templateId, selectedColor);
  };

  // Changement de couleur
  const handleSelectColor = (hex) => {
    setSelectedColor(hex);
    saveState(currentCvData, selectedTemplate, hex);
  };

  // Mise à jour rapide des champs
  const handleQuickFieldChange = (field, val) => {
    if (!currentCvData) return;
    const updated = {
      ...currentCvData,
      personal: {
        ...currentCvData.personal,
        [field]: val
      }
    };
    setCurrentCvData(updated);
    saveState(updated, selectedTemplate, selectedColor);
  };

  // Rendu dynamique du template sélectionné
  const renderTemplatePreview = () => {
    if (!currentCvData) return null;
    const props = {
      data: currentCvData,
      color: selectedColor,
      font: 'sans',
      spacing: 'normal'
    };
    switch (selectedTemplate) {
      case 'executive-rh':
        return <ExecutiveRHTemplate {...props} />;
      case 'creative-designer':
        return <CreativeDesignerTemplate {...props} />;
      case 'minimalist':
        return <MinimalistTemplate {...props} />;
      case 'dual-column':
        return <DualColumnTemplate {...props} />;
      case 'emerald':
        return <EmeraldTemplate {...props} />;
      case 'modern-tech':
      default:
        return <ModernTechTemplate {...props} />;
    }
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
      a: "Vos informations sont stockées directement dans votre navigateur (localStorage). Aucune donnée n'est revendue à des tiers. Si vous vous connectez avec votre compte, vos sauvegardes cloud sont chiffrées et strictement privées."
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

      {/* ─── SECTION HERO : LE CRÉATEUR EN LIGNE INTUITIF ─────────────────────── */}
      <section id="creer" className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-violet-600/15 blur-[160px]" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto space-y-8">

          {/* En-tête Titre & Accroche */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold shadow-lg shadow-violet-900/20">
              <Sparkles size={14} className="text-amber-400" />
              <span>Studio CV en Ligne • 100% Gratuit & Sans Filigrane</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Tous les outils pour créer votre <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                CV professionnel en 2 minutes
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Choisissez votre secteur, découvrez votre modèle de CV en direct et téléchargez votre fichier PDF A4 haute définition prêt à envoyer aux recruteurs.
            </p>

            {/* Badges de confiance */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs text-gray-300">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> 100% Gratuit
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> Conforme ATS 2026
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> Format A4 Haute Définition
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 size={13} className="text-emerald-400" /> Sans inscription obligatoire
              </span>
            </div>
          </div>

          {/* ─── 1. SÉLECTEUR DE MÉTIER ────────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] font-bold">1</span>
              <span>Sélectionnez votre métier (remplit instantanément le CV avec du contenu pro) :</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {QUICK_PROFILES.map((qp) => {
                const Icon = qp.icon;
                const isSelected = selectedPresetId === qp.id;
                return (
                  <button
                    key={qp.id}
                    onClick={() => handleSelectPreset(qp.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-violet-600/25 border-violet-400 shadow-lg shadow-violet-950/40 ring-1 ring-violet-400'
                        : 'bg-[#0f172a]/70 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${qp.accentBg}`}>
                        <Icon size={16} />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <Check size={12} /> Actif
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{qp.title}</div>
                      <div className="text-[10px] text-gray-400 truncate">{qp.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 2. BARRE DE COMMANDE & PERSONNALISATION ──────────────────────── */}
          <div className="bg-[#0b0f19] border border-white/15 rounded-3xl p-5 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
              {/* Choix du modèle */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] font-bold">2</span>
                  <span>Modèle :</span>
                </span>
                {TEMPLATES.map((tmpl) => {
                  const isCurrent = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40 ring-1 ring-violet-300'
                          : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: tmpl.accent }} />
                      <span>{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Palette couleur & Édition */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Couleur :</span>
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleSelectColor(c.hex)}
                      title={c.label}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                        selectedColor === c.hex ? 'scale-125 ring-2 ring-white shadow' : 'opacity-70 hover:opacity-100 hover:scale-110'
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setShowQuickEditor(!showQuickEditor)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    showQuickEditor
                      ? 'bg-violet-500/20 text-violet-300 border-violet-400'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
                  }`}
                >
                  <Edit3 size={13} />
                  <span>{showQuickEditor ? 'Fermer' : 'Modifier mes infos'}</span>
                </button>
              </div>
            </div>

            {/* Formulaire de modification rapide si activé */}
            {showQuickEditor && (
              <div className="py-4 border-b border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Prénom</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleDataChange('firstName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Nom</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleDataChange('lastName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Titre de poste</label>
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => handleDataChange('title', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleDataChange('email', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">Téléphone</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => handleDataChange('phone', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 mb-1 block">Résumé / Accroche</label>
                  <textarea
                    rows={2}
                    value={profileData.summary}
                    onChange={(e) => handleDataChange('summary', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-violet-500 outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* ─── 3. GRAND APERÇU A4 DU MODÈLE EN ACTION ────────────────────── */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3 px-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Aperçu du modèle {currentTemplateObj.name} en temps réel
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  Format standard A4 (210 x 297 mm) • Score ATS : {currentTemplateObj.score}
                </span>
              </div>

              {/* Cadre de présentation A4 avec ombre et scroll contrôlé */}
              <div className="relative mx-auto w-full max-w-[800px] h-[550px] sm:h-[650px] overflow-y-auto rounded-2xl border border-white/20 shadow-2xl bg-slate-900 scrollbar-thin scrollbar-thumb-violet-600">
                <div className="origin-top scale-[0.68] sm:scale-[0.88] md:scale-100 transition-transform duration-300 w-[794px] mx-auto bg-white min-h-[1123px]">
                  {renderTemplatePreview()}
                </div>
              </div>

              {/* Boutons d'action centraux sous le CV */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/cv/builder?template=${selectedTemplate}&color=${encodeURIComponent(selectedColor)}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-violet-900/50 hover:from-violet-500 hover:to-purple-500 hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles size={20} />
                  <span>Personnaliser tout le CV dans le Studio</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href={`/cv/builder?template=${selectedTemplate}&color=${encodeURIComponent(selectedColor)}&action=print`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
                >
                  <Download size={18} className="text-emerald-400" />
                  <span>Télécharger en PDF A4</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GRILLE DES OUTILS (STYLE ILOVEPDF) ───────────────────────────────── */}
      <section id="outils" className="py-20 px-4 sm:px-6 bg-[#060a14] border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-400 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10">
              <Layers size={13} /> Boîte à Outils Complète MyCV
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Tous les outils pour un dossier de candidature réussi
            </h2>
            <p className="text-sm text-gray-400">
              Comme sur iLovePDF, accédez immédiatement à chaque fonctionnalité en 1 clic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOOLS_GRID.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#0c1222]/90 border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-950/40 backdrop-blur"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${tool.iconColor}`}>
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

      {/* ─── COMMENT ÇA MARCHE EN 3 ÉTAPES ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-[#030712]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <Zap size={13} /> Rapide & Simple
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Créez votre CV en 3 étapes simples
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b0f19] border border-white/10 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="text-base font-bold text-white">Choisissez votre modèle</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Parcourez nos 6 designs conformes aux exigences ATS. Sélectionnez un profil pré-rempli correspondant à votre métier pour gagner un temps précieux.
              </p>
            </div>

            <div className="bg-[#0b0f19] border border-white/10 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="text-base font-bold text-white">Personnalisez avec l'IA</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Renseignez vos expériences, compétences et formations. Utilisez l'Assistant IA Gemini pour générer des descriptions percutantes et accrocheuses.
              </p>
            </div>

            <div className="bg-[#0b0f19] border border-white/10 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-base font-bold text-white">Exportez en PDF A4</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Vérifiez votre score de conformité ATS et téléchargez en 1 clic un PDF vectoriel prêt pour les candidatures et l'impression haute définition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VITRINE DES 6 MODÈLES ────────────────────────────────────────────── */}
      <section id="modeles" className="py-20 px-4 sm:px-6 bg-[#060a14] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10">
              <Layout size={13} /> Modèles Prêts à l'Emploi
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Conçus pour convaincre les recruteurs
            </h2>
            <p className="text-sm text-gray-400">
              Chaque mise en page respecte scrupuleusement les proportions du format A4 et les critères d'analyse des logiciels RH.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-[#0b0f19] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">{tmpl.category}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Score {tmpl.score}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {tmpl.tagline}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/cv/builder?template=${tmpl.id}`}
                    className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    <span>Lancer avec ce modèle</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMPLACEMENT PUBLICITAIRE ADSENSE ──────────────────────────────────── */}
      <section className="py-6 px-4 bg-[#030712]">
        <AdSenseAd slot="cv-home-middle" />
      </section>

      {/* ─── GUIDE ÉDITORIAL COMPLET ADSENSE (ANTI-THIN-CONTENT) ───────────────── */}
      <section id="guide-ats" className="py-20 px-4 sm:px-6 bg-[#070c18] border-y border-white/10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <Award size={13} /> Guide Complet du Candidat
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Réussir sa candidature à l'ère des algorithmes
            </h2>
            <p className="text-sm text-gray-400">
              Comprendre le fonctionnement des systèmes de recrutement automatisés et concevoir un document à forte valeur ajoutée.
            </p>
          </div>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/30 flex items-center justify-center text-xs">1</span>
                Pourquoi la compatibilité ATS est-elle primordiale ?
              </h3>
              <p>
                Aujourd'hui, la grande majorité des candidatures transitent d'abord par un système informatique avant d'atteindre un recruteur humain. L'ATS extrait les coordonnées, les dates d'expérience, les formations et les compétences techniques pour les comparer aux critères de recherche définis par les ressources humaines.
              </p>
              <p>
                Un modèle de CV mal structuré ou enregistré dans un format non conventionnel risque de subir des erreurs d'indexation. En choisissant un modèle conçu pour l'export vectoriel A4 et doté d'une typographie claire, vous maximisez la précision de l'extraction et votre score de pertinence globale.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center text-xs">2</span>
                Structure recommandée pour un CV percutant
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Coordonnées complètes :</strong> Nom, prénom, téléphone avec indicatif, adresse email professionnelle et lien vers un profil professionnel en ligne.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Titre et accroche personnalisés :</strong> Précisez exactement le rôle ciblé et synthétisez votre proposition de valeur en quelques lignes percutantes.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Parcours professionnel ordonné :</strong> Du poste le plus récent au plus ancien, en insistant sur les réalisations quantifiées et mesurables.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Compétences techniques et humaines :</strong> Équilibrez hard skills (outils, logiciels, langages) et soft skills (communication, gestion d'équipe).
                  </div>
                </li>
              </ul>
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
            <h2 className="text-3xl font-black text-white">Questions Fréquentes</h2>
            <p className="text-xs text-gray-400">Tout ce que vous devez savoir sur la plateforme MyCV.click.</p>
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
            <Check size={13} /> Gratuit & Rapide
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            Prêt à créer votre nouveau CV ?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Démarrez maintenant avec nos modèles optimisés pour les recruteurs et le format A4.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/cv/builder"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-900/40 hover:scale-105 transition-all"
            >
              <Sparkles size={18} />
              Lancer le Studio Gratuitement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
