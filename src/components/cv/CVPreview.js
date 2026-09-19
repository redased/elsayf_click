'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Printer, Download, ZoomIn, ZoomOut, RotateCcw, Eye, FileText, 
  CheckCircle, Sparkles, Loader2, Maximize2, Minimize2, Smartphone, Monitor
} from 'lucide-react';
import ModernTechTemplate from './templates/ModernTechTemplate';
import ExecutiveRHTemplate from './templates/ExecutiveRHTemplate';
import CreativeDesignerTemplate from './templates/CreativeDesignerTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import DualColumnTemplate from './templates/DualColumnTemplate';
import EmeraldTemplate from './templates/EmeraldTemplate';
import { downloadDirectPDF, printViaIsolatedIframe } from './exportPDF';

export default function CVPreview({ data, config, onPrint }) {
  const [zoom, setZoom] = useState(85);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const printRef = useRef(null);
  const containerRef = useRef(null);

  const { template = 'modern-tech', color = '#7c3aed', font = 'sans', spacing = 'normal' } = config || {};

  // Auto-ajustement intelligent selon la taille de l'écran (mobile, tablette, PC)
  const fitToScreen = () => {
    if (!containerRef.current) return;
    const padding = window.innerWidth < 640 ? 24 : 48;
    const availableWidth = containerRef.current.clientWidth - padding;
    const a4PxWidth = 793.7; // 210mm à 96 DPI
    if (availableWidth < a4PxWidth) {
      const calculatedZoom = Math.floor((availableWidth / a4PxWidth) * 100);
      setZoom(Math.max(35, Math.min(100, calculatedZoom)));
    } else {
      setZoom(85);
    }
  };

  useEffect(() => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, []);

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

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDirectPDF('cv-printable-area', `${getCvTitle()}.pdf`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    printViaIsolatedIframe('cv-printable-area', getCvTitle());
  };

  const scale = zoom / 100;
  const a4WidthPx = 793.7;
  const a4HeightPx = 1122.5;

  return (
    <div className={`flex flex-col h-full bg-slate-950/90 rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative'
    }`}>
      {/* Top Toolbar Responsive */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 bg-slate-900/95 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-white">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:block" />
          <Eye size={15} className="text-[#a78bfa]" />
          <span className="text-xs sm:text-sm font-bold">Aperçu A4 Réel</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono hidden md:inline-block">
            210 × 297 mm
          </span>
        </div>

        {/* Controls: Zoom, Auto-Fit, PDF & Print */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-black/50 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(35, z - 10))}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Dézoomer"
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-[11px] text-gray-200 font-mono px-1.5 select-none min-w-[2.6rem] text-center font-semibold">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Zoomer"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={fitToScreen}
              className="p-1 text-purple-400 hover:text-purple-300 rounded hover:bg-white/10 transition-colors text-[10px] font-bold px-1.5 hidden sm:inline-flex items-center gap-0.5"
              title="Adapter automatiquement à la largeur"
            >
              <RotateCcw size={11} /> Auto
            </button>
          </div>

          {/* Toggle Plein écran */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors hidden sm:block"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Bouton Télécharger PDF Direct */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Télécharger votre CV en PDF format A4"
          >
            {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            <span>{isGeneratingPdf ? 'Génération...' : 'PDF A4'}</span>
          </button>

          {/* Bouton Imprimer */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Imprimer directement"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Imprimer</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container avec dimensionnement précis sans débordement horizontal */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-2 sm:p-4 md:p-8 flex justify-center items-start bg-[#060a14] relative cv-preview-scroll"
      >
        <div 
          style={{
            width: `${a4WidthPx * scale}px`,
            height: `${a4HeightPx * scale}px`,
            position: 'relative',
            overflow: 'visible',
            margin: '0 auto'
          }}
          className="transition-all duration-150"
        >
          <div
            id="cv-printable-area"
            ref={printRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: '210mm',
              minHeight: '297mm',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
              position: 'absolute',
              left: 0,
              top: 0
            }}
            className="bg-white text-black shrink-0 transition-all rounded-sm overflow-hidden print:!static print:!transform-none print:!m-0 print:!p-0 print:!w-[210mm] print:!h-[297mm] print:!min-h-[297mm] print:!shadow-none print:!rounded-none"
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}

