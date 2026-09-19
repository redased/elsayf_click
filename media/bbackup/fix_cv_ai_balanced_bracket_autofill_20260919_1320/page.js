'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, Printer, FileText, Download, Upload, Eye, Edit3, 
  CheckCircle2, ArrowRight, Lock, UserCheck, Loader2, ShieldCheck, 
  HelpCircle, ChevronDown, Award, Briefcase, Zap, Star, Save,
  BarChart2, X, RefreshCw, Smartphone, Monitor, ChevronRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import CVEditor from '@/components/cv/CVEditor';
import CVPreview from '@/components/cv/CVPreview';
import AskAICVButton from '@/components/cv/AskAICVButton';
import { PRESET_PROFILES } from '@/components/cv/defaultPresets';
import { downloadDirectPDF, printViaIsolatedIframe } from '@/components/cv/exportPDF';
import AdSenseAd from '@/components/AdSenseAd';
import Link from 'next/link';

const STORAGE_KEY_DATA = 'elsayf_cv_builder_data_v1';
const STORAGE_KEY_CONFIG = 'elsayf_cv_builder_config_v1';

// Algorithme de calcul du Score ATS en temps réel
function computeAtsScore(data) {
  let score = 0;
  const items = [];

  const hasName = Boolean((data.personal?.firstName || '').trim() && (data.personal?.lastName || '').trim());
  const hasTitle = Boolean((data.personal?.title || '').trim().length >= 4);
  const hasContact = Boolean((data.personal?.email || '').trim() && (data.personal?.phone || '').trim());
  const hasSummary = Boolean((data.personal?.summary || '').trim().length >= 40);
  const expCount = data.experiences?.length || 0;
  const skillCount = (data.skills?.length || 0) + (data.tools?.length || 0);
  const eduCount = data.education?.length || 0;
  const langCount = data.languages?.length || 0;

  if (hasName) { score += 15; items.push({ title: 'Nom et Prénom', pts: 15, done: true }); }
  else items.push({ title: 'Nom et Prénom complets', pts: 15, done: false, tip: 'Indiquez votre nom et prénom en haut du CV.' });

  if (hasTitle) { score += 15; items.push({ title: 'Titre professionnel ciblé', pts: 15, done: true }); }
  else items.push({ title: 'Titre de poste', pts: 15, done: false, tip: 'Précisez l\'intitulé exact de l\'offre visée.' });

  if (hasContact) { score += 15; items.push({ title: 'Email et Téléphone', pts: 15, done: true }); }
  else items.push({ title: 'Coordonnées de contact', pts: 15, done: false, tip: 'Ajoutez votre adresse email et un numéro de téléphone joignable.' });

  if (hasSummary) { score += 15; items.push({ title: 'Accroche / Résumé pro (> 40 car.)', pts: 15, done: true }); }
  else items.push({ title: 'Résumé professionnel percutant', pts: 15, done: false, tip: 'Rédigez 2-3 lignes synthétisant votre valeur ajoutée.' });

  if (expCount >= 2) { score += 20; items.push({ title: `${expCount} expériences détaillées`, pts: 20, done: true }); }
  else if (expCount === 1) { score += 12; items.push({ title: '1 expérience enregistrée', pts: 12, done: true, tip: 'Ajoutez une 2ème expérience pour obtenir +8 pts ATS.' }); }
  else items.push({ title: 'Expériences professionnelles', pts: 20, done: false, tip: 'Ajoutez au moins une expérience avec des réalisations chiffrées.' });

  if (skillCount >= 5) { score += 10; items.push({ title: `${skillCount} compétences & outils techniques`, pts: 10, done: true }); }
  else if (skillCount >= 2) { score += 5; items.push({ title: 'Compétences clés', pts: 5, done: true, tip: 'Listez 5 compétences ou outils pour valider +5 pts.' }); }
  else items.push({ title: 'Compétences & Outils', pts: 10, done: false, tip: 'Ajoutez des mots-clés techniques recherchés par les recruteurs.' });

  if (eduCount >= 1) { score += 10; items.push({ title: 'Formation ou diplôme', pts: 10, done: true }); }
  else items.push({ title: 'Formation & Diplôme', pts: 10, done: false, tip: 'Indiquez votre diplôme ou certification la plus pertinente.' });

  return { score: Math.min(100, score), items };
}

export default function CVBuilderPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(PRESET_PROFILES.developer.data);
  const [config, setConfig] = useState({
    template: PRESET_PROFILES.developer.template,
    color: PRESET_PROFILES.developer.color,
    font: PRESET_PROFILES.developer.font,
    spacing: PRESET_PROFILES.developer.spacing,
  });
  const [activeMobileView, setActiveMobileView] = useState('editor'); // 'editor' | 'preview'
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isCloudSaving, setIsCloudSaving] = useState(false);
  const [cloudSaveSuccess, setCloudSaveSuccess] = useState(false);
  const [showAtsAudit, setShowAtsAudit] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const hasTrackedCreation = useRef(false);

  // Score ATS calculé en temps réel
  const atsResult = useMemo(() => computeAtsScore(data), [data]);

  // Réglages dynamiques administrables depuis /admin/cv
  const [siteSettings, setSiteSettings] = useState({
    theme: 'dark-cyber',
    heroTitle: 'Générateur de CV Professionnel & Dynamique',
    heroSubtitle: 'Créez un CV élégant, structuré et conforme aux attentes des recruteurs. Choisissez un modèle, pré-remplissez votre profil en 1 clic et exportez votre PDF instantanément.',
    showAtsGuide: true,
    showTemplates: true,
    showFaq: true,
    showAds: true,
  });

  // Styles visuels riches associés aux thèmes dynamiques
  const themeStyles = {
    'dark-cyber': {
      container: 'bg-[#050814] text-slate-100',
      headerBar: 'bg-[#0a0f24]/90 border-violet-500/20 text-white backdrop-blur-xl',
      heroCard: 'bg-gradient-to-r from-violet-950/40 via-[#0a1128] to-indigo-950/40 border-violet-500/20 text-white shadow-2xl',
      sectionCard: 'bg-[#090e21] border-gray-800/80 text-white',
      cardSub: 'text-slate-400',
      badge: 'bg-[#a78bfa]/15 border-[#a78bfa]/30 text-[#a78bfa]',
      gradientText: 'from-white via-purple-100 to-[#a78bfa]',
      dockBar: 'bg-slate-900/95 border-white/20',
      accentColor: '#a78bfa'
    },
    'minimal-light': {
      container: 'bg-[#f8fafc] text-slate-900',
      headerBar: 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-xl shadow-sm',
      heroCard: 'bg-white border-slate-200 shadow-xl text-slate-900',
      sectionCard: 'bg-white border-slate-200 shadow-lg text-slate-900',
      cardSub: 'text-slate-600',
      badge: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      gradientText: 'from-slate-950 via-slate-800 to-indigo-600',
      dockBar: 'bg-white/95 border-slate-300 text-slate-900',
      accentColor: '#4f46e5'
    },
    'executive-navy': {
      container: 'bg-[#060f26] text-slate-100',
      headerBar: 'bg-[#09173d]/90 border-blue-500/25 text-white backdrop-blur-xl',
      heroCard: 'bg-gradient-to-r from-[#0d1f4d] via-[#102a6b] to-[#0d1f4d] border-blue-500/30 text-white shadow-2xl',
      sectionCard: 'bg-[#0a1b42] border-blue-900/60 text-slate-100',
      cardSub: 'text-slate-400',
      badge: 'bg-blue-500/15 border-blue-400/30 text-blue-300',
      gradientText: 'from-white via-sky-100 to-sky-400',
      dockBar: 'bg-[#09173d]/95 border-blue-400/30',
      accentColor: '#38bdf8'
    },
    'emerald-modern': {
      container: 'bg-[#041510] text-slate-100',
      headerBar: 'bg-[#07241b]/90 border-emerald-500/25 text-white backdrop-blur-xl',
      heroCard: 'bg-gradient-to-r from-[#08291e] via-[#0b3829] to-[#08291e] border-emerald-500/30 text-white shadow-2xl',
      sectionCard: 'bg-[#07241b] border-emerald-900/60 text-slate-100',
      cardSub: 'text-slate-400',
      badge: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      gradientText: 'from-white via-emerald-100 to-emerald-400',
      dockBar: 'bg-[#07241b]/95 border-emerald-400/30',
      accentColor: '#34d399'
    },
    'sunset-gradient': {
      container: 'bg-[#12071f] text-slate-100',
      headerBar: 'bg-[#1f0b36]/90 border-rose-500/25 text-white backdrop-blur-xl',
      heroCard: 'bg-gradient-to-r from-[#261245] via-[#3b1554] to-[#261245] border-rose-500/30 text-white shadow-2xl',
      sectionCard: 'bg-[#220f3d] border-rose-900/60 text-slate-100',
      cardSub: 'text-slate-400',
      badge: 'bg-rose-500/15 border-rose-400/30 text-rose-300',
      gradientText: 'from-white via-rose-100 to-rose-400',
      dockBar: 'bg-[#1f0b36]/95 border-rose-400/30',
      accentColor: '#fb7185'
    }
  };

  const currentTheme = themeStyles[siteSettings.theme] || themeStyles['dark-cyber'];

  // Charger les réglages dynamiques du site
  useEffect(() => {
    fetch('/api/cv/settings')
      .then((res) => res.json())
      .then((d) => {
        if (d?.settings) {
          setSiteSettings(d.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Titre dynamique selon le domaine
  const [isMyCvDomain, setIsMyCvDomain] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMyCv = window.location.hostname.toLowerCase().includes('mycv.click');
      setIsMyCvDomain(isMyCv);
      document.title = isMyCv
        ? 'MyCV.click • Studio CV Professionnel Gratuit (Format A4 & Normes ATS)'
        : 'Studio CV Pro • Créateur de CV en Ligne | Elsayf';
    }
  }, []);

  // Télémétrie d'activité CV (Invités & Membres)
  const trackCvAction = async (eventType) => {
    try {
      await fetch('/api/cv/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          candidateTitle: data.personal?.title || '',
          candidateName: `${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`.trim(),
          template: config.template,
          data,
          config,
        }),
      });
    } catch (e) {
      console.warn('Erreur trackCvAction:', e);
    }
  };

  // Charger depuis le localStorage au montage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else if (session?.user?.name) {
        const names = (session.user.name || '').trim().split(' ');
        const fName = names[0] || '';
        const lName = names.slice(1).join(' ') || '';
        setData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            firstName: fName || prev.personal.firstName,
            lastName: lName || prev.personal.lastName,
            email: session.user.email || prev.personal.email,
          }
        }));
      }
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (e) {
      console.warn('Erreur chargement localStorage CV:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [session]);

  // Sauvegarder automatiquement lors des changements
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
      
      if (!hasTrackedCreation.current && (data.personal?.firstName || data.personal?.title)) {
        hasTrackedCreation.current = true;
        trackCvAction('CREATE');
      }
    } catch (e) {
      console.warn('Erreur sauvegarde localStorage CV:', e);
    }
  }, [data, config, isLoaded]);

  // Remplissage automatique des champs par l'IA
  const handleAutoFillFromAI = (aiData) => {
    if (!aiData) return;
    setData((prev) => {
      const merged = {
        ...prev,
        personal: {
          ...prev.personal,
          ...(aiData.personal || {}),
        },
        skills: aiData.skills && aiData.skills.length > 0 ? aiData.skills : prev.skills,
        softSkills: aiData.softSkills && aiData.softSkills.length > 0 ? aiData.softSkills : prev.softSkills,
        tools: aiData.tools && aiData.tools.length > 0 ? aiData.tools : prev.tools,
        languages: aiData.languages && aiData.languages.length > 0 ? aiData.languages : prev.languages,
        experiences: aiData.experiences && aiData.experiences.length > 0 ? aiData.experiences : prev.experiences,
        education: aiData.education && aiData.education.length > 0 ? aiData.education : prev.education,
        projects: aiData.projects && aiData.projects.length > 0 ? aiData.projects : prev.projects,
        certifications: aiData.certifications && aiData.certifications.length > 0 ? aiData.certifications : prev.certifications,
      };
      return merged;
    });
    trackCvAction('AI_AUTOFILL');
  };

  // Presets en 1 clic
  const handleLoadPreset = (presetKey) => {
    const preset = PRESET_PROFILES[presetKey];
    if (!preset) return;
    setData(preset.data);
    setConfig({
      template: preset.template,
      color: preset.color,
      font: preset.font,
      spacing: preset.spacing,
    });
    trackCvAction('LOAD_PRESET');
  };

  const handleReset = () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser entièrement votre CV ?')) return;
    const emptyData = {
      personal: { firstName: '', lastName: '', title: '', email: '', phone: '', city: '', mobility: '', website: '', linkedin: '', github: '', avatar: '', summary: '' },
      skills: [],
      softSkills: [],
      tools: [],
      languages: [],
      experiences: [],
      education: [],
      projects: [],
      certifications: [],
      interests: []
    };
    setData(emptyData);
    localStorage.removeItem(STORAGE_KEY_DATA);
  };

  const handleExportJson = () => {
    const exportObject = { data, config, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${data.personal?.firstName || 'Candidat'}_${data.personal?.lastName || 'Professionnel'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    trackCvAction('EXPORT_JSON');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.data) setData(imported.data);
        if (imported.config) setConfig(imported.config);
        alert('Votre profil CV a été importé avec succès !');
        trackCvAction('IMPORT_JSON');
      } catch (err) {
        alert('Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Sauvegarde Cloud explicite pour membres
  const handleCloudSave = async () => {
    setIsCloudSaving(true);
    try {
      await trackCvAction('SAVE_CLOUD');
      setCloudSaveSuccess(true);
      setTimeout(() => setCloudSaveSuccess(false), 3000);
    } finally {
      setIsCloudSaving(false);
    }
  };

  const getCvTitle = () => {
    const fName = data.personal?.firstName || 'Candidat';
    const lName = data.personal?.lastName || 'Professionnel';
    return `CV_${fName}_${lName}`;
  };

  const handlePrint = () => {
    trackCvAction('PRINT');
    printViaIsolatedIframe('cv-printable-area', getCvTitle());
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    trackCvAction('DOWNLOAD_PDF');
    try {
      await downloadDirectPDF('cv-printable-area', `${getCvTitle()}.pdf`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqItems = [
    {
      q: "Comment ce créateur de CV garantit-il la compatibilité avec les filtres ATS ?",
      a: "Nos 6 modèles sont conçus selon les critères stricts des systèmes de suivi des candidatures (ATS - Applicant Tracking Systems). La hiérarchie HTML est propre, les titres de sections sont standardisés (Expérience, Formation, Compétences), et l'export PDF génère un texte sélectionnable et vectoriel sans éléments graphiques perturbateurs."
    },
    {
      q: "L'outil et le téléchargement PDF A4 sont-ils 100% gratuits et sans inscription ?",
      a: "Oui, vous pouvez créer, éditer, tester tous les modèles et télécharger votre CV au format PDF A4 haute définition directement, sans aucune obligation d'inscription ni filigrane."
    },
    {
      q: "Mes données personnelles sont-elles sécurisées ?",
      a: "Absolument. Vos données sont enregistrées localement dans votre propre navigateur via le localStorage. Aucune information privée n'est revendue. Si vous créez un compte, vous profitez également d'une sauvegarde cloud chiffrée."
    },
    {
      q: "Faut-il mettre une photo sur son curriculum vitae ?",
      a: "En France et dans plusieurs pays francophones, la photo reste courante mais facultative. Dans les pays anglo-saxons (USA, UK, Canada), elle est généralement déconseillée. Vous pouvez ajouter ou retirer votre photo en 1 clic selon votre cible."
    },
    {
      q: "Combien de pages doit faire un bon CV ?",
      a: "Pour les profils juniors et intermédiaires (moins de 7 ans d'expérience), le format 1 page A4 est le standard recommandé par 95% des recruteurs. Nos modèles sont précisément calibrés sur le format 210 x 297 mm pour maximiser la densité sans surcharger."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.container}`}>
      {/* Schema.org pour Google et AdSense */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": isMyCvDomain ? "MyCV.click - Studio CV Pro" : "Studio CV Pro Elsayf",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "description": "Générateur de curriculum vitae professionnel gratuit avec 6 modèles A4 compatibles filtres ATS et export PDF direct."
          })
        }}
      />

      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0mm !important;
        }
        @media print {
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            background: white !important;
          }
          main,
          main > div,
          #__next,
          div[class*="min-h-screen"],
          div[class*="py-"],
          div[class*="pt-"],
          div[class*="p-"] {
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            max-height: 297mm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            transform: none !important;
            filter: none !important;
            backdrop-filter: none !important;
          }
          header, nav, footer, .print\\:hidden {
            display: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #cv-printable-area, #cv-printable-area * {
            visibility: visible !important;
          }
          #cv-printable-area {
            position: fixed !important;
            left: 0mm !important;
            top: 0mm !important;
            margin: 0mm !important;
            padding: 0mm !important;
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            transform: none !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            background: white !important;
            color: black !important;
            z-index: 99999999 !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. TOP STUDIO BAR (Compacité & Ergonomie Canva / Figma / Linear)          */}
      {/* ========================================================================= */}
      <header className={`sticky top-0 z-30 border-b shadow-md transition-colors print:hidden ${currentTheme.headerBar}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Logo & Jauge Score ATS */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link href="/cv" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                CV
              </div>
              <div className="hidden sm:block">
                <span className="font-black tracking-tight text-sm text-white">
                  {isMyCvDomain ? 'MyCV.click' : 'Studio CV'}
                </span>
                <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  PRO A4
                </span>
              </div>
            </Link>

            {/* Bouton Score ATS interactif */}
            <button
              onClick={() => setShowAtsAudit(!showAtsAudit)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 transition-all text-xs font-semibold cursor-pointer active:scale-95"
              title="Cliquer pour voir l'audit ATS de votre CV"
            >
              <Zap size={13} className={atsResult.score >= 80 ? 'text-emerald-400' : 'text-amber-400'} />
              <span className="hidden xs:inline text-gray-300">Score ATS :</span>
              <span className={`font-mono font-bold ${
                atsResult.score >= 80 ? 'text-emerald-400' : atsResult.score >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {atsResult.score}%
              </span>
              <div className="w-10 h-1.5 bg-black/40 rounded-full overflow-hidden hidden md:block">
                <div 
                  className={`h-full transition-all duration-300 ${
                    atsResult.score >= 80 ? 'bg-emerald-400' : atsResult.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${atsResult.score}%` }}
                />
              </div>
            </button>
          </div>

          {/* Sélecteur de Profils Rapides (Visible sur Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
            <span className="px-2 text-[11px] text-gray-400 font-semibold flex items-center gap-1">
              <Sparkles size={12} className="text-purple-400" /> Exemples :
            </span>
            {Object.entries(PRESET_PROFILES).slice(0, 4).map(([key, p]) => (
              <button
                key={key}
                onClick={() => handleLoadPreset(key)}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all text-[11px] font-medium cursor-pointer"
                title={`Charger le modèle type ${p.name}`}
              >
                {p.badge}
              </button>
            ))}
          </div>

          {/* Actions Droite: Cloud Save & PDF Direct */}
          <div className="flex items-center gap-2">
            {/* Statut Membre / Invité */}
            {session ? (
              <button
                onClick={handleCloudSave}
                disabled={isCloudSaving}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                title="Sauvegarder immédiatement dans votre compte"
              >
                {isCloudSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>{cloudSaveSuccess ? 'Sauvegardé !' : 'Cloud Sync'}</span>
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <ShieldCheck size={12} className="text-emerald-400" /> Auto-Save Local
              </span>
            )}

            {/* Bouton Imprimer */}
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
              title="Imprimer directement le CV"
            >
              <Printer size={14} />
              <span>Imprimer</span>
            </button>

            {/* Bouton Primaire Télécharger PDF A4 */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Télécharger le fichier PDF au format A4 vectoriel"
            >
              {isGeneratingPdf ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>
          </div>
        </div>

        {/* Modal / Tiroir d'Audit ATS */}
        {showAtsAudit && (
          <div className="p-4 bg-[#0a0e1c] border-b border-white/15 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  <strong className="text-white text-sm">Diagnostic de Conformité ATS : {atsResult.score}/100</strong>
                </div>
                <button
                  onClick={() => setShowAtsAudit(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
              <p className="text-gray-400 text-[11px]">
                Les robots recruteurs (ATS) scannent votre curriculum vitae selon ces critères essentiels. Complétez les étapes ci-dessous pour maximiser votre visibilité :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {atsResult.items.map((item, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-xl border flex items-start gap-2 ${
                      item.done 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.done ? <CheckCircle2 size={14} className="text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-500" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold">{item.title} (+{item.pts} pts)</div>
                      {!item.done && item.tip && (
                        <div className="text-[10px] text-amber-300/90 leading-tight">{item.tip}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTENU PRINCIPAL & STUDIO WORKSPACE                                   */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-6 space-y-6">
        
        {/* Toggle Mobile / Tablette (< lg) */}
        <div className="flex lg:hidden p-1 rounded-2xl bg-black/50 border border-white/10 print:hidden">
          <button
            onClick={() => setActiveMobileView('editor')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMobileView === 'editor'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Edit3 size={15} />
            <span>1. Édition & Données</span>
          </button>
          <button
            onClick={() => setActiveMobileView('preview')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMobileView === 'preview'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye size={15} />
            <span>2. Aperçu Direct A4</span>
          </button>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Colonne Éditeur (5 cols sur Desktop) */}
          <div
            className={`lg:col-span-5 h-[calc(100vh-8.5rem)] min-h-[680px] ${
              activeMobileView === 'editor' ? 'block' : 'hidden lg:block'
            } print:hidden`}
          >
            <CVEditor
              data={data}
              onChange={setData}
              config={config}
              onConfigChange={setConfig}
              onLoadPreset={handleLoadPreset}
              onReset={handleReset}
              onExportJson={handleExportJson}
              onImportJson={handleImportJson}
            />
          </div>

          {/* Colonne Aperçu A4 (7 cols sur Desktop) */}
          <div
            className={`lg:col-span-7 h-[calc(100vh-8.5rem)] min-h-[680px] ${
              activeMobileView === 'preview' ? 'block' : 'hidden lg:block'
            } print:block print:w-full print:col-span-12`}
          >
            <CVPreview data={data} config={config} onPrint={handlePrint} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SECTIONS EDITORIALES, CONSEILS ATS & FAQ                              */}
        {/* ========================================================================= */}
        <div className="space-y-12 pt-8 print:hidden">
          
          {/* AdSense Top slot */}
          {siteSettings.showAds !== false && (
            <AdSenseAd slot="cv-top-leaderboard" format="auto" className="my-4" />
          )}

          {/* Guide ATS */}
          {siteSettings.showAtsGuide !== false && (
            <section id="guide-ats" className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden scroll-mt-20 ${currentTheme.sectionCard}`}>
              <div className="max-w-3xl mb-6">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentTheme.badge}`}>
                  Recommandations Recrutement 2026
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2 text-white">
                  Comment maximiser l'impact de votre CV auprès des filtres ATS ?
                </h2>
                <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${currentTheme.cardSub}`}>
                  Plus de 80% des grandes entreprises et cabinets RH utilisent des ATS pour trier les candidatures. Nos templates respectent à la lettre ces 4 règles d'or :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-bold text-sm text-white">Sections Claires</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Titres standardisés (Expérience, Formation, Compétences) organisés par ordre antichronologique.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-bold text-sm text-white">Mots-Clés Ciblés</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Intégrez les logiciels, technologies et compétences exactes mentionnées dans l'annonce.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-bold text-sm text-white">PDF 100% Calibré A4</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Exportation vectorielle aux dimensions exactes 210 x 297 mm avec texte sélectionnable.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                    4
                  </div>
                  <h3 className="font-bold text-sm text-white">Résultats Chiffrés</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Donnez du poids à vos missions avec des métriques réelles (%, volumes, délais, budgets).
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Panorama des 6 modèles */}
          {siteSettings.showTemplates !== false && (
            <section id="modeles" className="space-y-4 scroll-mt-20">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${currentTheme.badge}`}>
                  Design & Typographies
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  6 Modèles Pensés pour Chaque Métier
                </h2>
                <p className={`text-xs ${currentTheme.cardSub}`}>
                  Adaptez le style visuel de votre candidature aux codes de votre secteur d'activité.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border space-y-2 ${currentTheme.sectionCard}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 uppercase">Tech & Code</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 font-semibold">Modern Tech</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Développeurs & Data Scientists</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Mise en valeur directe de la stack technique, des dépôts GitHub et des architectures logicielles.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border space-y-2 ${currentTheme.sectionCard}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase">Management & RH</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-300 font-semibold">Executive RH</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Cadres & Dirigeants</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Élégance corporate valorisant le leadership, la gouvernance et le pilotage d'équipes.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border space-y-2 ${currentTheme.sectionCard}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase">International</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 font-semibold">Minimaliste ATS</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Swiss ATS Standard</h3>
                  <p className={`text-xs leading-relaxed ${currentTheme.cardSub}`}>
                    Structure épurée à haute lisibilité garantissant un score maximal sur tous les filtres automatisés.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* FAQ Accordion */}
          {siteSettings.showFaq !== false && (
            <section id="faq" className={`p-6 sm:p-8 rounded-3xl border shadow-xl scroll-mt-20 ${currentTheme.sectionCard}`}>
              <div className="max-w-2xl mb-6 space-y-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${currentTheme.badge}`}>
                  Foire Aux Questions
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Questions Fréquemment Posées
                </h2>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={17}
                        className={`transition-transform duration-200 shrink-0 text-gray-400 ${
                          openFaq === idx ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t border-white/10 ${currentTheme.cardSub}`}>
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AdSense Bottom slot */}
          {siteSettings.showAds !== false && (
            <AdSenseAd slot="cv-bottom-content" format="auto" className="my-6" />
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. DOCK FLOTTANT MOBILE (Navigation tactile permanente < lg)             */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 max-w-sm mx-auto print:hidden">
        <div className={`p-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-1.5 ${currentTheme.dockBar}`}>
          <button
            onClick={() => setActiveMobileView('editor')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMobileView === 'editor'
                ? 'bg-[#a78bfa] text-black shadow font-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Edit3 size={14} />
            <span>Formulaire</span>
          </button>

          <button
            onClick={() => setActiveMobileView('preview')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMobileView === 'preview'
                ? 'bg-[#a78bfa] text-black shadow font-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Eye size={14} />
            <span>Aperçu</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1"
            title="Télécharger le PDF"
          >
            {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Assistant IA Flottant avec Remplissage Automatique */}
      <AskAICVButton currentCvData={data} onApplyToCV={handleAutoFillFromAI} />
    </div>
  );
}
