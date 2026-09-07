'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Printer, FileText, Download, Upload, Eye, Edit3, CheckCircle2, ArrowRight, Lock, UserCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import CVEditor from '@/components/cv/CVEditor';
import CVPreview from '@/components/cv/CVPreview';
import { PRESET_PROFILES } from '@/components/cv/defaultPresets';
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
    a.download = `CV_${data.personal?.firstName || 'Candidat'}_${data.personal?.lastName || 'Elsayf'}.json`;
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

  const handlePrint = () => {
    window.print();
  };

  // Écran de chargement NextAuth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm font-medium">Vérification de l'accès au Studio CV Pro...</p>
      </div>
    );
  }

  // Écran d'authentification requise si non connecté
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen bg-[#050a14] text-white flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#0e1428] to-[#080d19] border border-violet-500/30 backdrop-blur-2xl shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-500/30 border border-violet-400/40">
            <Lock size={36} className="text-white" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30">
              Accès Membre Requis
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Connectez-vous pour Créer votre CV
            </h1>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
              L'utilisation du Studio CV Pro et l'exportation PDF haute fidélité sont exclusivement réservées aux membres de la plateforme Elsayf.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2.5 text-xs text-gray-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Sauvegarde automatique de vos profils dans votre compte</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Accès illimité aux 6 templates professionnels A4</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Exportation PDF A4 sans coupure ni filigrane</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Chargement instantané des profils types (RH, Tech, Design...)</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login?callbackUrl=/cv"
              className="btn btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
            >
              <span>Se connecter à mon compte</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/register?callbackUrl=/cv"
              className="block w-full py-3 rounded-xl font-semibold text-xs text-gray-300 hover:text-white border border-white/15 hover:border-white/30 transition-all text-center bg-white/5"
            >
              Créer un compte gratuit (Inscription rapide)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Utilisateur connecté : Affichage complet du studio CV
  return (
    <div className="min-h-screen bg-[#050a14] text-white py-6 px-3 sm:px-6 lg:px-8">
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
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-purple-900/20 to-indigo-950/40 border border-violet-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a78bfa]/15 border border-[#a78bfa]/30 text-[#a78bfa] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={13} /> Studio CV Pro • Multi-Profils & Templates
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-[#a78bfa]">
              Générateur de CV Professionnel & Dynamique
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl">
              Connecté en tant que <strong className="text-purple-300">{session?.user?.name || session?.user?.email}</strong>. Vos données sont sauvegardées automatiquement.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              <Printer size={17} />
              <span>Exporter PDF / Imprimer</span>
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
    </div>
  );
}
