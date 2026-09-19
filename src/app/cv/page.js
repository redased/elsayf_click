'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles, Download, FileText, Zap, Shield, Star, ArrowRight,
  CheckCircle, ChevronRight, Play, Award, Users, Clock,
  Palette, Layout, Code2, Briefcase, GraduationCap, Brush,
  Globe, Monitor, Smartphone, Check, ChevronDown, X
} from 'lucide-react';

// ─── Données des templates ──────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tagline: 'Pour les développeurs & ingénieurs',
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
    tagline: 'Pour les cadres & dirigeants',
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
    tagline: 'Pour les créatifs & designers',
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
    tagline: 'Maximal ATS - International',
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
    tagline: 'Deux colonnes élégantes',
    category: 'Polyvalent',
    categoryColor: '#14b8a6',
    accent: '#0d9488',
    gradient: 'from-teal-600 via-cyan-500 to-teal-600',
    gradientBg: 'from-teal-950/80 via-cyan-950/50 to-teal-950/80',
    border: 'border-teal-500/40',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    icon: Layout,
    popular: false,
    features: ['Double colonne compacte', 'Densité optimisée', 'Tous secteurs'],
    preview: {
      header: { bg: 'bg-teal-700', text: 'text-white' },
      sidebar: { bg: 'bg-teal-50', text: 'text-teal-900' },
      body: { bg: 'bg-white', text: 'text-gray-800' },
      accent: '#0d9488',
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Pro',
    tagline: 'Naturel, frais & professionnel',
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

// ─── Mini-aperçu visuel d'un CV ─────────────────────────────────────────────
function CVMiniPreview({ template, isActive }) {
  const p = template.preview;
  return (
    <div
      className={`relative w-full aspect-[210/297] rounded-lg overflow-hidden shadow-2xl border-2 transition-all duration-300 ${
        isActive ? `border-2 shadow-lg` : 'border-white/10'
      }`}
      style={{ borderColor: isActive ? template.accent : undefined }}
    >
      {/* Header du CV */}
      <div className={`${p.header.bg} px-2 py-1.5 flex items-center gap-1.5`}>
        <div className="w-4 h-4 rounded-full bg-white/30 shrink-0" />
        <div className="flex-1 space-y-0.5">
          <div className="h-1.5 bg-white/80 rounded w-16" />
          <div className="h-1 bg-white/40 rounded w-10" />
        </div>
      </div>

      {/* Corps */}
      <div className="flex h-[calc(100%-36px)]">
        {/* Sidebar si présente */}
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
              <div className="h-1.5 rounded w-full bg-current opacity-20" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1 rounded opacity-60 w-full" style={{ background: template.accent }} />
              <div className="flex gap-0.5 flex-wrap">
                {[3, 4, 3, 5, 2].map((w, i) => (
                  <div key={i} className="h-1 rounded bg-current opacity-25" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Corps principal */}
        <div className={`${p.body.bg} flex-1 px-1.5 py-1.5 space-y-1.5`}>
          {/* Section expérience */}
          <div>
            <div className="h-0.5 rounded mb-1 opacity-70" style={{ background: template.accent }} />
            <div className="h-1 bg-gray-700 rounded w-2/3 opacity-40 mb-0.5" />
            <div className="h-0.5 bg-gray-400 rounded w-1/2 opacity-30 mb-0.5" />
            <div className="h-0.5 bg-gray-300 rounded w-full opacity-25" />
            <div className="h-0.5 bg-gray-300 rounded w-4/5 opacity-25" />
          </div>
          <div>
            <div className="h-0.5 rounded mb-1 opacity-70" style={{ background: template.accent }} />
            <div className="h-1 bg-gray-700 rounded w-3/5 opacity-40 mb-0.5" />
            <div className="h-0.5 bg-gray-400 rounded w-2/5 opacity-30 mb-0.5" />
            <div className="h-0.5 bg-gray-300 rounded w-full opacity-25" />
          </div>
          {!p.sidebar && (
            <div>
              <div className="h-0.5 rounded mb-1 opacity-70" style={{ background: template.accent }} />
              <div className="flex gap-0.5 flex-wrap">
                {[4, 3, 5, 3, 4, 2].map((w, i) => (
                  <div key={i} className="h-1.5 rounded bg-gray-200" style={{ width: `${w * 5}px` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Card Template Galerie ──────────────────────────────────────────────────
function TemplateCard({ template, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const Icon = template.icon;

  return (
    <div
      className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-[#0d1117]/90 backdrop-blur hover:border-white/25 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: hovered ? `0 25px 60px -10px ${template.accent}40` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge Populaire */}
      {template.popular && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black shadow-lg">
          <Star size={9} fill="white" /> POPULAIRE
        </div>
      )}

      {/* Aperçu visuel du CV */}
      <div className={`relative p-4 pb-2 bg-gradient-to-b ${template.gradientBg}`}>
        <div className="max-w-[160px] mx-auto">
          <CVMiniPreview template={template} isActive={hovered} />
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0d1117] to-transparent" />
      </div>

      {/* Infos */}
      <div className="p-5 pt-3 flex-1 flex flex-col">
        {/* Catégorie */}
        <span
          className={`self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${template.badge} mb-2`}
        >
          {template.category}
        </span>

        {/* Titre & sous-titre */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-black text-white leading-tight">{template.name}</h3>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
            style={{ background: `${template.accent}25` }}
          >
            <Icon size={16} style={{ color: template.accent }} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{template.tagline}</p>

        {/* Features */}
        <ul className="space-y-1 mb-4 flex-1">
          {template.features.map((f, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <Check size={11} style={{ color: template.accent }} className="shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={`/cv/builder?template=${template.id}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-white transition-all duration-300 hover:gap-3 hover:scale-[1.02] active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${template.accent}, ${template.accent}cc)`,
            boxShadow: `0 4px 15px ${template.accent}40`,
          }}
        >
          <span>Utiliser ce design</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

// ─── Stat Counter animé ─────────────────────────────────────────────────────
function StatBadge({ value, label, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-lg font-black text-white leading-none">{value}</div>
        <div className="text-[11px] text-gray-400 font-medium">{label}</div>
      </div>
    </div>
  );
}

// ─── FAQ Item ───────────────────────────────────────────────────────────────
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
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-4 pt-1 text-sm text-gray-400 leading-relaxed border-t border-white/10">
          {a}
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────
export default function MyCVHomePage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0].id);
  const [isMyCvDomain, setIsMyCvDomain] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMyCv = window.location.hostname.toLowerCase().includes('mycv.click') ||
                     window.location.hostname === 'localhost';
      setIsMyCvDomain(isMyCv);
      document.title = 'MyCV.click — Créateur de CV Gratuit & Professionnel | 6 Designs Premium';
    }
  }, []);

  const faq = [
    {
      q: "Est-ce vraiment gratuit et sans inscription ?",
      a: "Oui, entièrement gratuit. Choisissez un design, remplissez vos informations, et téléchargez votre CV en PDF A4 haute définition — aucun compte requis, aucun filigrane."
    },
    {
      q: "Mes données sont-elles protégées ?",
      a: "Vos données restent dans votre navigateur (localStorage). Rien n'est envoyé sur nos serveurs sans votre accord. En créant un compte, vous profitez d'une sauvegarde cloud sécurisée."
    },
    {
      q: "Les CV sont-ils compatibles avec les systèmes ATS ?",
      a: "Absolument. Nos 6 modèles sont optimisés pour les ATS (Applicant Tracking Systems) : hiérarchie HTML propre, texte sélectionnable, sections standardisées, PDF vectoriel."
    },
    {
      q: "Puis-je changer de design après avoir rempli mes infos ?",
      a: "Oui, vos données sont sauvegardées automatiquement. Changez de template en un clic dans le builder sans perdre aucune information."
    },
    {
      q: "Comment fonctionne l'assistant IA ?",
      a: "Notre IA (Gemini) analyse votre profil ou l'offre d'emploi et rempli automatiquement tous les champs de votre CV avec un contenu professionnel adapté à votre secteur."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">

      {/* ─── SEO Schema.org ──────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MyCV.click",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
            "description": "Créateur de CV professionnel gratuit avec 6 designs premium, assistant IA, export PDF A4 et compatibilité ATS."
          })
        }}
      />

      {/* ─── NAVBAR ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
              CV
            </div>
            <div>
              <span className="font-black tracking-tight text-white">MyCV.click</span>
              <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                GRATUIT
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#designs" className="hover:text-white transition-colors font-medium">Designs</a>
            <a href="#fonctionnalites" className="hover:text-white transition-colors font-medium">Fonctionnalités</a>
            <a href="#faq" className="hover:text-white transition-colors font-medium">FAQ</a>
          </nav>

          <Link
            href="/cv/builder"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105 shadow-lg shadow-violet-900/30"
          >
            <Sparkles size={14} />
            Créer mon CV
          </Link>
        </div>
      </header>

      {/* ─── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 overflow-hidden" ref={heroRef}>
        {/* Background blobs animés */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-700/20 blur-[120px] animate-pulse" />
          <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-indigo-700/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-700/10 blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold mb-2">
            <Sparkles size={12} className="text-yellow-400" />
            Créateur de CV Gratuit — Aucune inscription requise
          </div>

          {/* Titre hero */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Créez votre CV
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              professionnel
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              en quelques minutes
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Choisissez parmi <strong className="text-white">6 designs professionnels</strong>, remplissez vos informations,
            laissez l'<strong className="text-violet-300">IA vous assister</strong> et exportez votre CV en{' '}
            <strong className="text-emerald-300">PDF A4 parfait</strong> — gratuitement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/cv/builder"
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/50 hover:shadow-violet-700/50 transition-all duration-300 hover:scale-105 hover:gap-3.5"
            >
              <Play size={16} fill="white" />
              Commencer gratuitement
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#designs"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-300 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <Layout size={15} />
              Voir les designs
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <StatBadge value="6" label="Designs Premium" icon={Palette} color="#8b5cf6" />
            <StatBadge value="100%" label="Gratuit & Sans pub" icon={Shield} color="#10b981" />
            <StatBadge value="IA" label="Assistant intégré" icon={Sparkles} color="#f59e0b" />
            <StatBadge value="PDF A4" label="Export instantané" icon={Download} color="#3b82f6" />
          </div>
        </div>
      </section>

      {/* ─── GALERIE DES DESIGNS ──────────────────────────────────────────────── */}
      <section id="designs" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* En-tête section */}
          <div className="text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-400 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10">
              <Palette size={12} />
              Choisissez votre style
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              6 Designs pour chaque{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                profil & secteur
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              Chaque template est optimisé pour un secteur précis et compatible avec les filtres ATS.
              Cliquez sur un design pour démarrer immédiatement.
            </p>
          </div>

          {/* Grille de templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((tmpl, i) => (
              <TemplateCard key={tmpl.id} template={tmpl} delay={i * 80} />
            ))}
          </div>

          {/* CTA final */}
          <div className="text-center mt-12">
            <Link
              href="/cv/builder"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-700/50 transition-all duration-300 hover:scale-105"
            >
              <Sparkles size={17} />
              Créer mon CV avec l'IA
              <ArrowRight size={17} />
            </Link>
            <p className="mt-3 text-xs text-gray-500">Aucune inscription • PDF gratuit • Données privées</p>
          </div>
        </div>
      </section>

      {/* ─── FONCTIONNALITÉS ──────────────────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <Zap size={12} />
              Puissant & Simple
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Tout ce qu'il faut pour un{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                CV parfait
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Sparkles, color: '#f59e0b',
                title: 'Assistant IA Gemini',
                desc: 'Remplissage automatique de votre CV par intelligence artificielle. Décrivez votre profil en quelques mots, l\'IA fait le reste.',
              },
              {
                icon: Shield, color: '#10b981',
                title: 'Score ATS en temps réel',
                desc: 'Analyseur ATS intégré qui vérifie votre CV en direct et vous donne des recommandations pour maximiser votre score.',
              },
              {
                icon: Download, color: '#3b82f6',
                title: 'PDF A4 Vectoriel',
                desc: 'Export PDF haute définition au format 210×297mm exact. Texte sélectionnable, parfait à l\'impression et pour les ATS.',
              },
              {
                icon: Monitor, color: '#8b5cf6',
                title: 'Aperçu A4 en direct',
                desc: 'Voyez votre CV au format réel pendant que vous le créez. Zoom, plein écran, et mode tablette inclus.',
              },
              {
                icon: Clock, color: '#ec4899',
                title: 'Sauvegarde automatique',
                desc: 'Vos données sont sauvegardées en temps réel dans votre navigateur. Reprenez là où vous avez arrêté.',
              },
              {
                icon: Globe, color: '#06b6d4',
                title: 'Multilingue & Mobilité',
                desc: 'Langues multiples, niveaux personnalisés, champs mobilité géographique. Adapté aux candidatures internationales.',
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                    style={{ background: `${feat.color}18` }}
                  >
                    <Icon size={20} style={{ color: feat.color }} />
                  </div>
                  <h3 className="font-black text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BANNIÈRE CTA CENTRALE ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-[#0d0f24] to-indigo-950/60">
            {/* Blobs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-violet-700/20 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-700/20 blur-[80px]" />

            <div className="relative space-y-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Award size={22} className="text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">100% Gratuit • Aucun filigrane</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Votre prochain emploi commence ici
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
                Rejoignez des milliers de candidats qui ont créé leur CV professionnel avec MyCV.click.
                Aucune carte bancaire, aucune inscription requise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/cv/builder"
                  className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/50 hover:shadow-violet-700/60 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles size={17} />
                  Créer mon CV maintenant
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {[
                  { icon: Check, text: 'Sans inscription' },
                  { icon: Check, text: 'PDF gratuit' },
                  { icon: Check, text: 'Données privées' },
                  { icon: Check, text: 'Sans filigrane' },
                ].map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Icon size={12} className="text-emerald-400" />
                      {b.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              Questions Fréquentes
            </span>
            <h2 className="text-3xl font-black text-white">Tout ce que vous devez savoir</h2>
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

      {/* ─── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-10 px-4 sm:px-6 bg-[#030712]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white font-black text-xs">
              CV
            </div>
            <span className="font-black text-white">MyCV.click</span>
            <span className="text-gray-600 text-sm">— Créateur de CV gratuit</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <Link href="/cv/builder" className="hover:text-white transition-colors">Builder CV</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <a href="https://elsayf.click" className="hover:text-white transition-colors">Elsayf E-learning</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 MyCV.click — Propulsé par Elsayf</p>
        </div>
      </footer>
    </div>
  );
}
