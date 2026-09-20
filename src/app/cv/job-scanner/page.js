'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Search, CheckCircle2, ArrowRight, BookOpen, 
  ExternalLink, FileText, AlertCircle, RefreshCw, Briefcase, Zap
} from 'lucide-react';
import AdSenseAd from '@/components/AdSenseAd';

export default function JobScannerPage() {
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobText.trim() || jobText.trim().length < 20) {
      setError('Veuillez coller le texte complet de l\'offre d\'emploi (au moins 20 caractères).');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/job-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobOfferText: jobText }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
      } else {
        setError(data.error || 'Erreur lors de l\'analyse.');
      }
    } catch (e) {
      setError(`Erreur réseau : ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* En-tête */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Audit & Matching IA Gratuit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-indigo-300">
            Scanner d'Offre d'Emploi & Diagnostic CV
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Collez la description d'une offre d'emploi (LinkedIn, Emploitic, Indeed). L'IA extrait les compétences obligatoires, audite les mots-clés ATS et vous oriente vers les formations exactes pour décrocher l'entretien.
          </p>
        </div>

        {/* Formulaire de scan */}
        <form onSubmit={handleAnalyze} className="p-6 sm:p-8 rounded-3xl bg-[#090e1d] border border-gray-800 space-y-5 shadow-2xl">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Texte de l'Offre d'Emploi à Scanner :
            </label>
            <textarea
              rows="7"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Collez ici l'annonce de recrutement (Missions, profil recherché, outils exigés : ex. Power BI, DAX, Python, Cybersécurité, Excel Avancé...)"
              className="w-full p-4 rounded-2xl bg-black/50 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all font-sans leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-gray-500">
              Analyse instantanée et confidentielle • 100% libre d'accès
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Analyse de l'Offre en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Lancer le Scan IA</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Résultats du Scan IA */}
        {result && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1d] border border-purple-500/30 space-y-8 animate-fadeIn shadow-2xl">
            
            {/* Score d'Adéquation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Score de Compatibilité Estimé</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-emerald-400">{result.matchPercentage}%</span>
                  <span className="text-xs text-gray-400">d'adéquation avec les critères recruteurs</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] uppercase font-bold text-gray-400">Compétences Clés Détectées</span>
                <p className="text-xl font-bold text-white">{result.detectedSkillsCount} mots-clés techniques</p>
              </div>
            </div>

            {/* Mots-clés extraits */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Mots-Clés Déterminants à Insérer Absolument dans Votre CV :
              </span>
              <div className="flex flex-wrap gap-2">
                {result.detectedSkills.map((sk, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Formations Recommandées pour Combler l'Écart */}
            {result.recommendedCourses.length > 0 && (
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Formations Elsayf Recommandées pour Valider ces Exigences :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.recommendedCourses.map((c, idx) => (
                    <Link
                      key={idx}
                      href={`/courses/${c.slug}`}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-gray-800 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all space-y-2 group"
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {c.category}
                      </span>
                      <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                        {c.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-purple-400 font-semibold pt-2">
                        <span>Suivre ce cours</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommandations ATS & CTA CV */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 space-y-4">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Conseils Stratégiques pour Décrocher l'Entretien :
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-gray-400">
                  Votre CV est prêt ? Exportez-le au format PDF A4 officiel.
                </span>
                <a
                  href="https://mycv.click/cv/builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
                >
                  <FileText size={14} />
                  <span>Ouvrir Studio CV MyCV</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>
        )}

        {/* Bannière AdSense */}
        <div className="py-2">
          <AdSenseAd slot="1234567890" format="auto" />
        </div>

      </div>
    </div>
  );
}
