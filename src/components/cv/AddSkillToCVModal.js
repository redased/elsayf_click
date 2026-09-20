'use client';
import { useState } from 'react';
import { Sparkles, CheckCircle2, Copy, ExternalLink, ArrowRight, X, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AddSkillToCVModal({ isOpen, onClose, courseTitle, projectData }) {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const defaultProjectText = projectData?.description || `• Réalisation d'un projet complet "${courseTitle}" avec mise en œuvre pratique sous standards professionnels.\n• Conception et déploiement de solutions optimisées et conformes aux exigences du marché.`;
  const skillsList = projectData?.skills || ['Compétence Technique', 'Résolution de Problèmes', 'Standards Professionnels'];

  const handleSyncToCV = async () => {
    setSaving(true);
    try {
      // Synchroniser avec l'API CV track pour injecter dans le profil Cloud
      const res = await fetch('/api/cv/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'SAVE_CLOUD',
          candidateTitle: projectData?.targetTitle || courseTitle,
          data: {
            personal: {
              firstName: session?.user?.name?.split(' ')[0] || 'Étudiant',
              lastName: session?.user?.name?.split(' ').slice(1).join(' ') || 'Certifié',
              email: session?.user?.email || '',
              title: projectData?.targetTitle || courseTitle,
            },
            experiences: [
              {
                id: `exp-course-${Date.now()}`,
                position: `Projet Pratique : ${courseTitle}`,
                company: 'Académie Elsayf & MyCV Studio',
                startDate: '2026',
                endDate: 'Aujourd\'hui',
                current: true,
                description: defaultProjectText,
              }
            ],
            skills: skillsList.map((s, i) => ({ id: `sk-${i}`, name: s, level: 90, category: 'hard' })),
          }
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
      }
    } catch (e) {
      console.error('Erreur synchronisation CV:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultProjectText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="max-w-xl w-full bg-[#0e1428] border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
        
        {/* En-tête Modal */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
              <Sparkles size={12} />
              <span>Synergie Elsayf & MyCV.click</span>
            </div>
            <h3 className="text-xl font-black text-white">Ajouter ce Projet à mon CV</h3>
            <p className="text-xs text-gray-400">Intégrez vos réalisations concrètes au format standard des recruteurs.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Corps */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Description Optimisée pour Filtrage ATS :
            </span>
            <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-gray-800 font-mono">
              {defaultProjectText}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Compétences Clés Associées :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.map((sk, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-200 border border-purple-500/25">
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Votre CV Cloud a été mis à jour avec ce projet avec succès !</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Copy size={14} />
            <span>{copiedText ? 'Copié dans le presse-papier !' : 'Copier le texte du projet'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSyncToCV}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{saving ? 'Synchronisation...' : 'Enregistrer sur mon CV Cloud'}</span>
            </button>
            <a
              href="https://mycv.click/cv/builder"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center"
              title="Ouvrir le Studio CV MyCV.click"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
