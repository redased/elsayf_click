'use client';
import { useState, useEffect } from 'react';
import { 
  Sparkles, Printer, FileText, Download, Upload, Eye, Edit3, 
  CheckCircle2, ArrowRight, Lock, UserCheck, Loader2, ShieldCheck, 
  HelpCircle, ChevronDown, Award, Briefcase, Zap, Star
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import CVEditor from '@/components/cv/CVEditor';
import CVPreview from '@/components/cv/CVPreview';
import { PRESET_PROFILES } from '@/components/cv/defaultPresets';
import { downloadDirectPDF, printViaIsolatedIframe } from '@/components/cv/exportPDF';
import AdSenseAd from '@/components/AdSenseAd';
import Link from 'next/link';

const STORAGE_KEY_DATA = 'elsayf_cv_builder_data_v1';
const STORAGE_KEY_CONFIG = 'elsayf_cv_builder_config_v1';

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

  // Charger depuis le localStorage au montage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else if (session?.user?.name) {
        // Pré-remplir avec les informations du compte connecté si premier usage
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
    } catch (e) {
      console.warn('Erreur sauvegarde localStorage CV:', e);
    }
  }, [data, config, isLoaded]);

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
  };

  const handleReset = () => {
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
      } catch (err) {
        alert('Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const getCvTitle = () => {
    const fName = data.personal?.firstName || 'Candidat';
    const lName = data.personal?.lastName || 'Professionnel';
    return `CV_${fName}_${lName}`;
  };

  const handlePrint = () => {
    printViaIsolatedIframe('cv-printable-area', getCvTitle());
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
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
      q: "L'outil et le téléchargement PDF A4 sont-ils 100% gratuits ?",
      a: "Oui, l'accès au Studio CV, la personnalisation des modèles, la prévisualisation en temps réel et l'exportation au format PDF A4 haute définition sont entièrement gratuits et sans filigrane."
    },
    {
      q: "Mes données personnelles sont-elles conservées en sécurité ?",
      a: "Absolument. Vos données sont enregistrées localement dans votre propre navigateur via le localStorage. Aucune information privée n'est revendue à des tiers. Si vous êtes connecté avec votre compte, vous bénéficiez également d'une sauvegarde cloud sécurisée."
    },
    {
      q: "Faut-il mettre une photo sur son curriculum vitae ?",
      a: "En France et dans plusieurs pays francophones, la photo reste courante mais facultative. Dans les pays anglo-saxons (USA, UK, Canada), elle est généralement déconseillée pour éviter les biais de sélection. Vous pouvez afficher ou masquer votre photo en un clic selon vos besoins."
    },
    {
      q: "Combien de pages doit faire un bon CV ?",
      a: "Pour les profils juniors et intermédiaires (moins de 7 ans d'expérience), le format 1 page A4 est le standard d'or recommandé par 95% des recruteurs. Nos modèles sont précisément calibrés sur le format 210 x 297 mm pour maximiser la densité sans surcharger la lecture."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050a14] text-white py-6 px-3 sm:px-6 lg:px-8">
      {/* Schema.org pour Google et AdSense */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MyCV - Studio CV Pro",
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

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 print:hidden">
        {/* Bandeau d'état (Connecté vs Visiteur invité) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border border-purple-500/20 text-xs mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            {session ? (
              <>
                <UserCheck size={16} className="text-emerald-400" />
                <span>
                  Connecté en tant que <strong className="text-white">{session.user?.name || session.user?.email}</strong> (Sauvegarde Cloud active)
                </span>
              </>
            ) : (
              <>
                <Zap size={16} className="text-amber-400" />
                <span>
                  <strong className="text-white">Accès Libre & Gratuit :</strong> Vos modifications sont sauvegardées dans votre navigateur.
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!session ? (
              <>
                <Link
                  href="/login?callbackUrl=/cv"
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all text-[11px] font-semibold"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register?callbackUrl=/cv"
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all text-[11px] font-bold"
                >
                  Créer un compte
                </Link>
              </>
            ) : (
              <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Profil synchronisé
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-purple-900/20 to-indigo-950/40 border border-violet-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a78bfa]/15 border border-[#a78bfa]/30 text-[#a78bfa] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={13} /> Studio CV Pro • 6 Templates A4 & Normes ATS
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-[#a78bfa]">
              Générateur de CV Professionnel & Dynamique
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl">
              Créez un CV élégant, structuré et conforme aux attentes des recruteurs. Choisissez un modèle, pré-remplissez votre profil en 1 clic et exportez votre PDF instantanément.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            {/* Bouton Téléchargement Direct PDF A4 */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-900/40 cursor-pointer disabled:opacity-50"
              title="Télécharger le fichier PDF directement sur votre appareil"
            >
              {isGeneratingPdf ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF (A4)'}</span>
            </button>

            {/* Bouton Impression Isolée */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-900/30 cursor-pointer"
              title="Ouvrir la boîte de dialogue d'impression"
            >
              <Printer size={17} />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Mobile View Toggle (Visible on screens < lg) */}
        <div className="flex lg:hidden mt-4 p-1 rounded-xl bg-slate-900 border border-white/10">
          <button
            onClick={() => setActiveMobileView('editor')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeMobileView === 'editor'
                ? 'bg-[#a78bfa] text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Edit3 size={15} />
            <span>Formulaire & Réglages</span>
          </button>
          <button
            onClick={() => setActiveMobileView('preview')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeMobileView === 'preview'
                ? 'bg-[#a78bfa] text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye size={15} />
            <span>Aperçu CV & PDF</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid (Editor on left, Preview on right) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)] min-h-[750px] print:m-0 print:p-0 print:h-auto">
        {/* Editor Column (5 cols on lg) */}
        <div
          className={`lg:col-span-5 h-full ${
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

        {/* Preview Column (7 cols on lg) */}
        <div
          className={`lg:col-span-7 h-full ${
            activeMobileView === 'preview' ? 'block' : 'hidden lg:block'
          } print:block print:w-full print:col-span-12`}
        >
          <CVPreview data={data} config={config} onPrint={handlePrint} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION ADVERTISING & RICH EDITORIAL CONTENT (PRINT:HIDDEN)               */}
      {/* Crucial pour AdSense Policy, SEO & Conversion                             */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto mt-16 print:hidden space-y-16">
        
        {/* Emplacement Publicitaire 1 (Format Bannière Responsive) */}
        <AdSenseAd slot="cv-top-leaderboard" format="auto" className="my-6" />

        {/* Guide d'optimisation ATS */}
        <section className="p-8 md:p-10 rounded-3xl bg-[#0b1022] border border-gray-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Guide Recrutement 2026
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
              Comment réussir son CV et franchir les filtres ATS ?
            </h2>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Plus de 80% des grandes entreprises et cabinets de recrutement utilisent des logiciels ATS (Applicant Tracking Systems) pour filtrer automatiquement les candidatures avant l'examen humain. Voici les critères clés intégrés dans nos templates :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                1
              </div>
              <h3 className="font-bold text-white text-base">Structure Standardisée</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Des sections reconnues (Expériences, Formations, Compétences) organisées par ordre antichronologique pour une indexation sans erreur.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                2
              </div>
              <h3 className="font-bold text-white text-base">Mots-Clés Ciblés</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Valorisez les compétences techniques (outils, logiciels, langages) et les compétences comportementales en lien avec l'offre visée.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                3
              </div>
              <h3 className="font-bold text-white text-base">Format PDF Calibré</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Exportation aux dimensions A4 exactes (210 x 297 mm) avec une typographie lisible et un texte net, sans marges blanches accidentelles.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                4
              </div>
              <h3 className="font-bold text-white text-base">Résultats Chiffrés</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Apportez de la crédibilité en quantifiant vos succès : pourcentages de progression, budgets gérés, délais réduits ou volumes traités.
              </p>
            </div>
          </div>
        </section>

        {/* Panorama des 6 modèles professionnels */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Designs & Typographies
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              6 Modèles Pensés pour Chaque Secteur d'Activité
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Adaptez le style visuel de votre candidature aux codes de votre métier en un clic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">Tech & Ingénierie</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 font-semibold">Modèle ModernTech</span>
              </div>
              <h3 className="text-lg font-bold text-white">Profil Développeur & Data</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Mise en valeur directe de la stack technologique, des projets GitHub, des certifications Cloud et des architectures logicielles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Management & RH</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-300 font-semibold">Modèle ExecutiveRH</span>
              </div>
              <h3 className="text-lg font-bold text-white">Cadres & Dirigeants</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Clarté sobre et élégance corporate pour mettre en lumière le leadership, la gestion d'équipes et les accomplissements stratégiques.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Polyvalent & Dense</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 font-semibold">Modèle DualColumn</span>
              </div>
              <h3 className="text-lg font-bold text-white">Double Colonne Équilibrée</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Optimisation maximale de la page A4 permettant de condenser expériences denses et compétences sans sensation d'encombrement.
              </p>
            </div>
          </div>
        </section>

        {/* Passerelle vers les formations certifiantes Elsayf */}
        <section className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0b1022] to-indigo-950/40 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <Award size={14} /> Boostez vos qualifications
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Enrichissez votre CV avec des compétences en haute demande
            </h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Les recruteurs recherchent des compétences concrètes en Data, Intelligence Artificielle, Cybersécurité et Automatisation. Suivez nos formations interactives gratuites avec simulateur de code en ligne.
            </p>
          </div>
          <Link
            href="/courses"
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-900/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Découvrir les formations</span>
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* Emplacement Publicitaire 2 (Format Médium / Responsive) */}
        <AdSenseAd slot="cv-middle-slot" format="auto" className="my-6" />

        {/* FAQ Accordéon Recrutement & CV */}
        <section className="p-8 md:p-10 rounded-3xl bg-[#0b1022] border border-gray-800/80 space-y-6">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={16} /> Questions Fréquentes
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Tout ce que vous devez savoir sur la création de votre CV
          </h2>

          <div className="space-y-3 pt-2">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-800 bg-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-purple-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer AdSense Slot */}
        <AdSenseAd slot="cv-bottom-leaderboard" format="auto" className="my-6" />

      </div>
    </div>
  );
}
