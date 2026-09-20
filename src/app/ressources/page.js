'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Download, Copy, CheckCircle2, Terminal, 
  Sparkles, ExternalLink, BookOpen, Layers, Shield, BarChart3, 
  Code2, ArrowRight, Printer, Check
} from 'lucide-react';
import AdSenseAd from '@/components/AdSenseAd';

const CHEATSHEETS = [
  {
    id: 'dax-powerbi',
    title: 'Fiche Mémo : DAX & Power BI Essentials',
    category: 'Data & BI',
    badge: 'Incontournable',
    color: 'from-amber-500 to-yellow-600',
    desc: 'Les 25 fonctions DAX les plus utilisées en entreprise avec exemples réels et syntaxe détaillée.',
    sections: [
      {
        title: 'Fonctions de Calcul & Filtrage',
        items: [
          { code: 'CALCULATE(Expression, Filter1, Filter2)', desc: 'Modifie le contexte de filtre d\'une mesure.' },
          { code: 'FILTER(Table, Condition)', desc: 'Retourne une table filtrée pour itérateurs.' },
          { code: 'ALL(Table[Column])', desc: 'Ignore tous les filtres appliqués sur la colonne.' },
          { code: 'ALLEXCEPT(Table, Table[Col1])', desc: 'Supprime tous les filtres sauf sur les colonnes spécifiées.' },
        ]
      },
      {
        title: 'Time Intelligence (Analyses Temporelles)',
        items: [
          { code: 'TOTALYTD(SUM(Ventes[Montant]), Calendrier[Date])', desc: 'Cumul des ventes de l\'année en cours.' },
          { code: 'SAMEPERIODLASTYEAR(Calendrier[Date])', desc: 'Décale la plage de dates à l\'année précédente (N-1).' },
          { code: 'DATEADD(Calendrier[Date], -1, MONTH)', desc: 'Décale la période sélectionnée d\'un mois en arrière.' },
        ]
      },
      {
        title: 'Itérateurs (Fonctions en X)',
        items: [
          { code: 'SUMX(Ventes, Ventes[Quantite] * Ventes[PrixUnitaire])', desc: 'Calcule ligne par ligne puis somme.' },
          { code: 'AVERAGEX(Clients, [Total Ventes])', desc: 'Calcule la moyenne des ventes par client.' },
        ]
      }
    ]
  },
  {
    id: 'python-excel',
    title: 'Fiche Mémo : Automatisation Python & Excel',
    category: 'Automatisation',
    badge: 'Gain de temps x10',
    color: 'from-blue-500 to-cyan-600',
    desc: 'Guide rapide pour manipuler des classeurs Excel avec pandas et openpyxl sans ouvrir Excel.',
    sections: [
      {
        title: 'Lecture & Écriture avec Pandas',
        items: [
          { code: 'import pandas as pd\ndf = pd.read_excel("ventes.xlsx", sheet_name="2026")', desc: 'Charger une feuille Excel dans un DataFrame.' },
          { code: 'df_filtre = df[df["Statut"] == "Payé"]', desc: 'Filtrer les lignes selon une condition.' },
          { code: 'df.to_excel("rapport_final.xlsx", index=False)', desc: 'Exporter les données nettoyées vers un nouveau classeur.' },
        ]
      },
      {
        title: 'Mise en Forme avec OpenPyXL',
        items: [
          { code: 'from openpyxl import load_workbook\nwb = load_workbook("factures.xlsx")', desc: 'Charger un classeur sans détruire les graphiques existants.' },
          { code: 'ws = wb.active\nws["B12"] = "Total TTC :"', desc: 'Écrire une valeur dans une cellule précise.' },
          { code: 'from openpyxl.styles import Font\nws["B12"].font = Font(bold=True, color="FF0000")', desc: 'Appliquer du texte gras et une couleur hexadécimale.' },
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-owasp',
    title: 'Fiche Mémo : Cybersécurité & OWASP Top 10',
    category: 'Sécurité',
    badge: 'Conformité 2026',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Checklist des vulnérabilités critiques web et commandes réseau incontournables.',
    sections: [
      {
        title: 'Top Failles Web & Remédiations',
        items: [
          { code: 'A01: Broken Access Control', desc: 'Vérifier les permissions côté serveur sur chaque endpoint IDOR.' },
          { code: 'A03: Injection (SQLi)', desc: 'Utiliser systématiquement des requêtes préparées (Prepared Statements).' },
          { code: 'A07: Identification & Auth Failures', desc: 'Activer la 2FA et limiter les tentatives (Rate Limiting).' },
        ]
      },
      {
        title: 'Commandes Réseau Essentielles',
        items: [
          { code: 'nmap -sV -sC -p- 192.168.1.1', desc: 'Scan complet de tous les ports avec détection de version et scripts de base.' },
          { code: 'tcpdump -i eth0 -n "port 80 or port 443"', desc: 'Capture du trafic HTTP/HTTPS sur l\'interface réseau.' },
        ]
      }
    ]
  },
  {
    id: 'prompt-ai',
    title: 'Fiche Mémo : Prompt Engineering & Google Antigravity',
    category: 'Intelligence Artificielle',
    badge: 'Productivité IA',
    color: 'from-purple-500 to-indigo-600',
    desc: 'Structures de prompts professionnels pour obtenir des réponses fiables et du code sans bugs.',
    sections: [
      {
        title: 'Structure du Prompt Parfait (Framework CARE)',
        items: [
          { code: 'C - Contexte', desc: 'Définir le rôle exact (ex: "Tu es un expert-comptable certifié...").' },
          { code: 'A - Action', desc: 'Préciser la tâche opérationnelle unique sans ambiguïté.' },
          { code: 'R - Règles', desc: 'Contraintes strictes (format JSON, longueur, ton, interdictions).' },
          { code: 'E - Exemples', desc: 'Fournir 1 ou 2 exemples d\'entrées et de sorties attendues (Few-Shot).' },
        ]
      }
    ]
  }
];

export default function RessourcesPage() {
  const [activeCheatsheet, setActiveCheatsheet] = useState('dax-powerbi');
  const [copiedCode, setCopiedCode] = useState('');

  const currentSheet = CHEATSHEETS.find(s => s.id === activeCheatsheet) || CHEATSHEETS[0];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen size={14} />
            <span>Kits de Ressources Pratiques Gratuits</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-purple-300">
            Fiches Mémo & Cheatsheets
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Consultez et imprimez les aide-mémoire essentiels pour vos projets professionnels et entretiens techniques (Power BI, Python, Cybersécurité, IA).
          </p>
        </div>

        {/* Sélecteur de Cheatsheet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHEATSHEETS.map((sheet) => {
            const isSelected = sheet.id === activeCheatsheet;
            return (
              <div
                key={sheet.id}
                onClick={() => setActiveCheatsheet(sheet.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 shadow-xl ring-2 ring-purple-500/30'
                    : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {sheet.category}
                  </span>
                  <span className="text-[10px] font-bold text-purple-400">
                    {sheet.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">{sheet.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{sheet.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Contenu de la Cheatsheet active */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090e1d] border border-gray-800 space-y-8 shadow-2xl relative overflow-hidden" id="printable-area">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">{currentSheet.category}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{currentSheet.title}</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{currentSheet.desc}</p>
            </div>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Printer size={15} />
              <span>Imprimer la Fiche PDF</span>
            </button>
          </div>

          {/* Sections de code */}
          <div className="space-y-8">
            {currentSheet.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={15} className="text-purple-400" />
                  <span>{sec.title}</span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {sec.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-4 rounded-xl bg-black/50 border border-gray-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1">
                        <code className="text-xs sm:text-sm font-mono text-purple-300 font-bold block whitespace-pre-line">
                          {item.code}
                        </code>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>

                      <button
                        onClick={() => handleCopy(item.code)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer self-start md:self-auto"
                        title="Copier le code"
                      >
                        {copiedCode === item.code ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Formation Associée */}
          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-gray-400">
              Vous souhaitez maîtriser l'ensemble de ces concepts en pratique avec des projets réels ?
            </span>
            <Link
              href="/parcours"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-105"
            >
              <span>Découvrir nos Parcours Métiers</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Publicité AdSense */}
        <div className="py-2">
          <AdSenseAd slot="1234567890" format="auto" />
        </div>

      </div>
    </div>
  );
}
