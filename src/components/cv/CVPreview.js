'use client';
import { useState, useRef } from 'react';
import { Printer, Download, ZoomIn, ZoomOut, RotateCcw, Eye, FileText, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import ModernTechTemplate from './templates/ModernTechTemplate';
import ExecutiveRHTemplate from './templates/ExecutiveRHTemplate';
import CreativeDesignerTemplate from './templates/CreativeDesignerTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import DualColumnTemplate from './templates/DualColumnTemplate';
import EmeraldTemplate from './templates/EmeraldTemplate';
import { downloadDirectPDF, printViaIsolatedIframe } from './exportPDF';

export default function CVPreview({ data, config, onPrint }) {
  const [zoom, setZoom] = useState(90);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef(null);

  const { template = 'modern-tech', color = '#7c3aed', font = 'sans', spacing = 'normal' } = config || {};

  const renderTemplate = () => {
    switch (template) {
      case 'executive-rh':
        return <ExecutiveRHTemplate data={data} color={color} font={font} spacing={spacing} />;
      case 'creative-designer':
        return <CreativeDesignerTemplate data={data} color={color} font={font} spacing={spacing} />;
      case 'minimalist':
        return <MinimalistTemplate data={data} color={color} font={font} spacing={spacing} />;
      case 'dual-column':
        return <DualColumnTemplate data={data} color={color} font={font} spacing={spacing} />;
      case 'emerald':
        return <EmeraldTemplate data={data} color={color} font={font} spacing={spacing} />;
      case 'modern-tech':
      default:
        return <ModernTechTemplate data={data} color={color} font={font} spacing={spacing} />;
    }
  };

  const getCvTitle = () => {
    const fName = data.personal?.firstName || 'Candidat';
    const lName = data.personal?.lastName || 'Elsayf';
    return `CV_${fName}_${lName}`;
  };

  // Téléchargement direct du fichier PDF vectoriel A4 (sans boîte d'impression)
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDirectPDF('cv-printable-area', `${getCvTitle()}.pdf`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Impression isolée (garantit 0 marge et 0 interférence avec la Navbar ou le layout du site)
  const handlePrint = () => {
    printViaIsolatedIframe('cv-printable-area', getCvTitle());
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-white">
          <Eye size={16} className="text-[#a78bfa]" />
          <span className="text-sm font-semibold">Aperçu en Direct (Format A4)</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30 font-medium">
            210 × 297 mm
          </span>
        </div>

        {/* Controls: Zoom, Direct Download & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 10))}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
              title="Dézoomer"
            >
              <ZoomOut size={15} />
            </button>
            <span className="text-xs text-gray-300 font-mono px-2 select-none min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
              title="Zoomer"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoom(90)}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
              title="Réinitialiser zoom"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Bouton Télécharger PDF Direct (100% calibré A4) */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            title="Télécharger le fichier PDF directement sur votre ordinateur"
          >
            {isGeneratingPdf ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF (A4)'}</span>
          </button>

          {/* Bouton Imprimer / Dialogue Navigateur */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Ouvrir la fenêtre d'impression"
          >
            <Printer size={15} />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Astuce d'impression A4 Pleine Page */}
      <div className="px-4 py-2 bg-gradient-to-r from-violet-950/80 via-purple-950/60 to-indigo-950/80 border-b border-violet-500/20 flex flex-wrap items-center justify-between gap-2 text-xs text-purple-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-yellow-300 font-bold shrink-0">💡 Recommandation A4 :</span>
          <span className="leading-snug">
            Pour un PDF parfait sans boîte de dialogue, utilisez <strong>« Télécharger PDF (A4) »</strong>. Si vous imprimez via le navigateur, cochez <strong>« Graphiques d'arrière-plan »</strong> et mettez les marges sur <strong>« Aucune »</strong>.
          </span>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-[#080d19]/90 relative cv-preview-scroll">
        <div
          id="cv-printable-area"
          ref={printRef}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: '210mm',
            minHeight: '297mm',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            transition: 'transform 0.15s ease-out',
          }}
          className="bg-white text-black shrink-0 relative transition-all rounded-sm overflow-hidden print:!transform-none print:!m-0 print:!p-0 print:!w-[210mm] print:!h-[297mm] print:!min-h-[297mm] print:!shadow-none print:!rounded-none"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
