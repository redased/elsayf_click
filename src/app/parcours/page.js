'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Briefcase, ArrowRight, CheckCircle2, Award, Clock, Star, 
  Sparkles, Layers, Shield, BarChart3, Cpu, ChevronRight,
  GraduationCap, FileText, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import AdSenseAd from '@/components/AdSenseAd';

const CAREER_PATHS = [
  {
    id: 'data-analyst',
    title: 'Parcours Data Analyst & Business Intelligence',
    subtitle: 'Devenez le référent décisionnel capable de transformer la donnée brute en stratégie d\'entreprise.',
    badge: 'Filière N°1 Recrutement 2026',
    emoji: '📊',
    color: 'from-amber-500 to-yellow-600',
    accentColor: '#f59e0b',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-950/20 via-[#0a0f1d] to-[#050a14]',
    targetRoles: ['Data Analyst', 'Consultant BI', 'Contrôleur de Gestion Data', 'Analyste Reporting'],
    avgSalary: '90 000 - 180 000 DZD / mois (DZ) • 38k - 52k € / an (FR)',
    duration: '36 heures de pratique',
    projectTitle: 'Dashboard de Direction Financière & Commerciale Interactive',
    projectDesc: 'Conception d\'un modèle de données décisionnel complet sur Power BI avec ETL Power Query, calculs DAX complexes et KPIs en temps réel.',
    steps: [
      {
        num: '01',
        title: 'Fondations Excel & Pilotage d\'Entreprise',
        slug: 'antigravity-business-excel',
        duration: '10h',
        desc: 'Maîtrise des tableaux croisés dynamiques, formules matricielles et gestion comptable pour débutants.',
        skills: ['TCD & Formules', 'Bilan & Trésorerie', 'Structuration de données']
      },
      {
        num: '02',
        title: 'Analyse Quali-Quanti & Scripting Python',
        slug: 'analyse-donnees-quali-quanti',
        duration: '12h',
        desc: 'Croisement de statistiques descriptives numériques et d\'analyses qualitatives textuelles avec Python & Excel.',
        skills: ['Python Pandas', 'Statistiques descriptives', 'Enquêtes & Feedbacks']
      },
      {
        num: '03',
        title: 'Power BI, Modélisation DAX & Dashboards Decisionnels',
        slug: 'power-bi-business-intelligence-data-analytics',
        duration: '14h',
        desc: 'Création de pipelines ETL professionnels, formules DAX avancées (CALCULATE, Time Intelligence) et dataviz.',
        skills: ['Power Query ETL', 'Calculs DAX Avancés', 'Dashboards Directoriaux']
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Parcours Expert Cybersécurité & Pentest Web',
    subtitle: 'Apprenez à défendre les infrastructures critiques et à tester la robustesse des applications web face aux cyberattaques.',
    badge: 'Compétence Critique & Haut Salaire',
    emoji: '🛡️',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    borderColor: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/20 via-[#0a0f1d] to-[#050a14]',
    targetRoles: ['Analyste SOC Junior', 'Pentesteur Web', 'Consultant Cybersécurité', 'Auditeur Système'],
    avgSalary: '110 000 - 240 000 DZD / mois (DZ) • 42k - 65k € / an (FR)',
    duration: '28 heures de pratique',
    projectTitle: 'Audit d\'Intrusion Complet & Plan de Remédiation OWASP Top 10',
    projectDesc: 'Exploitation éthique de failles réelles sur un environnement vulnérable, analyse de logs SOC et rédaction d\'un rapport d\'audit professionnel.',
    steps: [
      {
        num: '01',
        title: 'Cybersécurité Défensive & Architecture SOC',
        slug: 'cybersecurite-protection-systemes-defensive',
        duration: '14h',
        desc: 'Surveillance des journaux, détection d\'intrusions, gestion des incidents et durcissement des systèmes d\'exploitation.',
        skills: ['Surveillance SOC', 'Analyse de Logs SIEM', 'Durcissement OS & Réseaux']
      },
      {
        num: '02',
        title: 'Ethical Hacking & Sécurité des Applications Web',
        slug: 'ethical-hacking-securite-web-pentest',
        duration: '14h',
        desc: 'Exploitation et sécurisation contre les injections SQL, failles XSS, CSRF, failles d\'authentification et API Pentesting.',
        skills: ['OWASP Top 10', 'Burp Suite & Nmap', 'Audit Offensif & Correction']
      }
    ]
  },
  {
    id: 'ai-automation',
    title: 'Parcours Automatisation, IA & Productivité Bureau',
    subtitle: 'Multipliez par 10 votre efficacité opérationnelle en déléguant vos tâches répétitives à Python et à l\'IA.',
    badge: 'ROI Immédiat pour Salariés & PME',
    emoji: '🤖',
    color: 'from-purple-500 to-indigo-600',
    accentColor: '#a78bfa',
    borderColor: 'border-purple-500/30',
    bgGradient: 'from-purple-950/20 via-[#0a0f1d] to-[#050a14]',
    targetRoles: ['Responsable Automatisation', 'Spécialiste Productivité IA', 'Office Manager Tech', 'Développeur Low-Code'],
    avgSalary: '80 000 - 160 000 DZD / mois (DZ) • 35k - 48k € / an (FR)',
    duration: '26 heures de pratique',
    projectTitle: 'Système d\'Automatisation Facturation & Reporting Autonome',
    projectDesc: 'Génération automatisée de documents Word et classeurs Excel réconciliés, alimentés par des agents IA interactifs.',
    steps: [
      {
        num: '01',
        title: 'Google Antigravity : Maîtrise de l\'IA & du Code',
        slug: 'google-antigravity-mastery',
        duration: '12h',
        desc: 'Techniques de prompting expert, génération de scripts fiables et déploiement d\'agents d\'assistance personnalisés.',
        skills: ['Prompt Engineering Avancé', 'Code Assisté par IA', 'Résolution de Problèmes']
      },
      {
        num: '02',
        title: 'Automatisation Excel & Comptabilité avec Python',
        slug: 'automatisation-excel-comptabilite-detaillee',
        duration: '14h',
        desc: 'Programmation de scripts Python pour fusionner des classeurs Excel, générer des rapports Word et contrôler les balances comptables.',
        skills: ['openpyxl & pandas', 'Génération Word automatique', 'Audit de cohérence financière']
      }
    ]
  }
];

export default function ParcoursPage() {
  const [selectedPath, setSelectedPath] = useState('data-analyst');
  const activePath = CAREER_PATHS.find(p => p.id === selectedPath) || CAREER_PATHS[0];

  return (
    <div className="min-h-screen bg-[#050a14] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* En-tête de la page */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap size={14} />
            <span>Formations Orientées Carrière & Emploi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-purple-300">
            Parcours Métiers Certifiants
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Ne collectionnez plus les cours sans lendemain. Suivez un programme structuré étape par étape, réalisez des projets réels et valorisez vos compétences immédiatement sur <strong>MyCV.click</strong>.
          </p>
        </div>

        {/* Sélecteur d'onglets de Parcours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAREER_PATHS.map((p) => {
            const isSelected = p.id === selectedPath;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPath(p.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                  isSelected
                    ? `${p.borderColor} bg-gradient-to-b ${p.bgGradient} shadow-2xl ring-2 ring-white/10 scale-[1.02]`
                    : 'border-gray-800 bg-white/[0.02] hover:border-gray-700 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-white/10 text-gray-300">
                    {p.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">{p.subtitle}</p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/5">
                  <span>{p.steps.length} modules séquencés</span>
                  <span className="font-semibold text-purple-300">{p.duration}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Détail Complet du Parcours Sélectionné */}
        <div className="rounded-3xl border border-gray-800 bg-[#090e1d] p-6 sm:p-10 space-y-10 shadow-2xl relative overflow-hidden">
          {/* Glow décoratif */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* En-tête du parcours actif */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-800">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activePath.emoji}</span>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">{activePath.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activePath.title}</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{activePath.subtitle}</p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-left lg:text-right">
                <span className="text-[11px] uppercase font-bold text-gray-400">Rémunération Moyenne Constatée</span>
                <p className="text-sm font-black text-emerald-400">{activePath.avgSalary}</p>
              </div>
              <Link
                href={`/courses/${activePath.steps[0].slug}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>Démarrer l'Étape 1</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Débouchés & Postes ciblés */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Métiers & Postes Accessibles après Validation du Parcours :
            </span>
            <div className="flex flex-wrap gap-2">
              {activePath.targetRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Briefcase size={12} className="text-purple-400" />
                  <span>{role}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Étapes du Programme Séquentiel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Programme Pas à Pas ({activePath.steps.length} Cours Complémentaires)
              </span>
              <span className="text-xs text-purple-400 font-medium">Validation progressive avec TPs</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activePath.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-gray-800/80 hover:border-gray-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-sm shrink-0">
                      {step.num}
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">{step.title}</h4>
                        <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {step.skills.map((sk, sIdx) => (
                          <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${step.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-2 shrink-0 transition-all hover:scale-105"
                  >
                    <span>Accéder au cours</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Projet Pratique Final & Synergie MyCV */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-purple-400" />
              <h3 className="text-lg font-bold text-white">Projet Pratique de Fin d'Études & Valorisation CV</h3>
            </div>
            <p className="text-sm font-semibold text-purple-200">{activePath.projectTitle}</p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{activePath.projectDesc}</p>
            
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-purple-500/20">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 size={16} />
                <span>Prêt à être intégré directement sur votre CV sur MyCV.click</span>
              </div>
              <a
                href="https://mycv.click"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 hover:text-white underline ml-auto"
              >
                <span>Créer mon CV professionnel gratuitement</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>

        {/* Publicité AdSense conforme */}
        <div className="py-2">
          <AdSenseAd slot="1234567890" format="auto" />
        </div>

        {/* Accordéon FAQ Parcours */}
        <div className="p-8 rounded-3xl bg-[#090e1d] border border-gray-800 space-y-6">
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-white">Questions Fréquentes sur les Parcours</h3>
            <p className="text-xs text-gray-400">Tout ce que vous devez savoir pour démarrer votre apprentissage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <HelpCircle size={15} className="text-purple-400" />
                Dois-je acheter tout le parcours d'un coup ?
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Non, vous pouvez suivre chaque cours à votre rythme, commencer par les leçons gratuites découvertes, ou opter pour l'accès complet.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <HelpCircle size={15} className="text-purple-400" />
                Comment valoriser mon parcours auprès d'un recruteur ?
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Chaque parcours se conclut par un projet réel tangible. Vous pouvez exporter ce projet en 1 clic sur MyCV.click au format A4 vectoriel certifié conforme ATS.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
