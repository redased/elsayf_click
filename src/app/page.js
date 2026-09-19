'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Terminal,
  Video,
  Cpu,
  Zap,
  Crown,
  Globe,
  FileText,
  Sparkles,
  Shield,
  BookOpen,
  Clock,
  Award,
  Layers,
  Check,
  HelpCircle,
  ChevronDown,
  Laptop,
  Code2,
  Users,
  Star,
  BarChart3,
  Lock,
  Briefcase,
  GraduationCap,
  Target,
  Database
} from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import AdSenseAd from '../components/AdSenseAd';
import { useLanguage } from '@/context/LanguageContext';

function getDisplayPrice(plan, region) {
  if (region === 'ALGERIA' && plan.priceDzd > 0)
    return { amount: plan.priceDzd.toLocaleString('fr-FR', { maximumFractionDigits: 0 }), currency: 'DZD' };
  if (region === 'EUROPE' && plan.priceUsd > 0)
    return { amount: plan.priceUsd.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }), currency: '€' };
  return {
    amount: plan.price.toLocaleString('fr-FR', { maximumFractionDigits: 0 }),
    currency: plan.currency,
  };
}

const safeParseFeatures = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
};

// 10 Formations Complètes structurées en 4 Pôles d'Excellence
const ALL_COURSES = [
  // ── Pôle 1 : Data Analytics & Business Intelligence ──
  {
    slug: 'power-bi-business-intelligence-data-analytics',
    title: 'Power BI & Business Intelligence : Data Analytics, DAX & Dashboards',
    pole: 'Data & BI',
    level: 'Débutant à Avancé',
    duration: '14h de pratique',
    emoji: '📊',
    color: 'from-amber-600 to-yellow-600',
    border: 'border-yellow-500/40',
    desc: 'Maîtrisez Power BI Desktop, la modélisation Power Query (ETL), les formules DAX avancées et construisez des tableaux de bord interactifs professionnels en Dark Mode.',
    outcomes: [
      'ETL complet avec Power Query & nettoyage de données',
      'Calculs avancés DAX (CALCULATE, RELATED, Time Intelligence)',
      'Design de Dashboards décisionnels interactifs pour dirigeants'
    ],
    project: 'Dashboard financier & commercial prêt à présenter en entreprise'
  },
  {
    slug: 'analyse-donnees-quali-quanti',
    title: 'Analyse de Données Qualitatives & Quantitatives : Excel et Python pour Novices',
    pole: 'Data & BI',
    level: 'Débutant',
    duration: '10h de pratique',
    emoji: '📋',
    color: 'from-blue-600 to-cyan-600',
    border: 'border-cyan-500/30',
    desc: 'Apprenez à croiser des statistiques descriptives quantitatives avec des analyses qualitatives textuelles en utilisant la puissance combinée d\'Excel et de scripts Python.',
    outcomes: [
      'Statistiques descriptives, moyennes pondérées, écart-types',
      'Segmentation, corrélations et visualisations graphiques',
      'Traitement automatisé de questionnaires et feedbacks'
    ],
    project: 'Étude d\'impact statistique complète sur données d\'enquêtes réelles'
  },
  {
    slug: 'recherche-operationnelle-python-ia',
    title: 'Recherche Opérationnelle & Optimisation avec Python & IA',
    pole: 'Data & BI',
    level: 'Intermédiaire',
    duration: '12h de pratique',
    emoji: '🧠',
    color: 'from-indigo-600 to-purple-600',
    border: 'border-indigo-500/30',
    desc: 'Résolvez des problèmes complexes de logistique, d\'allocation de ressources et de planification industrielle avec les solveurs linéaires Python (PuLP, SciPy) et l\'IA.',
    outcomes: [
      'Modélisation mathématique linéaire et programmation sous contraintes',
      'Optimisation de tournées, gestion de flottes et stocks minimaux',
      'Assistance IA pour formuler des équations d\'optimisation'
    ],
    project: 'Solveur d\'optimisation de chaîne logistique et réduction des coûts'
  },

  // ── Pôle 2 : Cybersécurité & Sécurité Défensive / Offensive ──
  {
    slug: 'cybersecurite-protection-systemes-defensive',
    title: 'Cybersécurité & Protection des Systèmes : Defensive Security & SOC',
    pole: 'Cybersécurité',
    level: 'Intermédiaire',
    duration: '16h de pratique',
    emoji: '🛡️',
    color: 'from-red-600 to-rose-700',
    border: 'border-red-500/30',
    desc: 'Devenez analyste SOC Blue Team : hardening Linux, pare-feu UFW, Fail2ban, SIEM Wazuh, détection d\'intrusion Suricata, gestion d\'infrastructure PKI et réponse aux incidents.',
    outcomes: [
      'Sécurisation des serveurs de production (Hardening, SSH, UFW, Fail2ban)',
      'Déploiement et analyse des alertes SIEM avec Wazuh et Suricata',
      'Procédures de réponse aux incidents et analyse forensique de logs'
    ],
    project: 'Mise en place d\'un SOC défensif complet avec alertes en temps réel'
  },
  {
    slug: 'ethical-hacking-securite-web-pentest',
    title: 'Ethical Hacking & Pentest : Sécurité des Applications Web & OWASP Top 10',
    pole: 'Cybersécurité',
    level: 'Intermédiaire à Avancé',
    duration: '15h de pratique',
    emoji: '⚔️',
    color: 'from-cyan-600 to-blue-700',
    border: 'border-cyan-500/30',
    desc: 'Auditez la sécurité des sites web de manière éthique : injections SQL, XSS, CSRF, failles SSRF, RCE, IDOR, contournement d\'authentification JWT et scripts Python Red Team.',
    outcomes: [
      'Détection et exploitation éthique des failles de l\'OWASP Top 10',
      'Audit de sécurité d\'APIs REST, tokens JWT et sessions utilisateurs',
      'Rédaction d\'un rapport d\'audit de vulnérabilités professionnel'
    ],
    project: 'Audit de sécurité complet et pentest d\'une application web vulnérable'
  },

  // ── Pôle 3 : Automatisation & Gestion d'Entreprise ──
  {
    slug: 'automatisation-excel-comptabilite-detaillee',
    title: 'Automatisation Excel & Comptabilité Détaillée avec Python & IA',
    pole: 'Automatisation & Gestion',
    level: 'Tous niveaux',
    duration: '14h de pratique',
    emoji: '🧾',
    color: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-500/30',
    desc: 'Automatisez la tenue comptable de A à Z : Journal, Grand Livre, Balance à 6 colonnes, Rapprochement bancaire, déclaration de TVA, Bilan et Compte de résultat automatisés.',
    outcomes: [
      'Génération automatique des écritures comptables sous Excel et Python',
      'Rapprochement bancaire intelligent et détection des écarts',
      'Calcul automatisé des états financiers (Bilan & Compte de Résultat)'
    ],
    project: 'Générateur de comptabilité automatisée clé en main pour entreprises'
  },
  {
    slug: 'antigravity-business-excel',
    title: 'Gestion d\'Entreprise avec Excel & Python : Guide Débutant TPE/PME',
    pole: 'Automatisation & Gestion',
    level: 'Débutant',
    duration: '10h de pratique',
    emoji: '📈',
    color: 'from-orange-600 to-amber-600',
    border: 'border-orange-500/30',
    desc: 'Pilotez votre entreprise efficacement : suivi de trésorerie, gestion des stocks, gestion des fiches RH, facturation et génération automatique de devis sans logiciel payant.',
    outcomes: [
      'Suivi de trésorerie prévisionnelle et indicateurs financiers clés',
      'Gestion automatisée des stocks et alertes de réapprovisionnement',
      'Création et export de factures normalisées en PDF'
    ],
    project: 'Système ERP allégé Excel/Python pour piloter une PME en temps réel'
  },
  {
    slug: 'python-automatisation-excel-word',
    title: 'Python pour automatiser Excel & Word : Zéro Répétition',
    pole: 'Automatisation & Gestion',
    level: 'Débutant',
    duration: '8h de pratique',
    emoji: '⚡',
    color: 'from-teal-600 to-emerald-600',
    border: 'border-teal-500/30',
    desc: 'Éliminez les corvées manuelles bureautiques. Manipulez des centaines de fichiers Excel et Word à la seconde grâce aux bibliothèques openpyxl, pandas et python-docx.',
    outcomes: [
      'Fusion, découpage et nettoyage de classeurs Excel en masse',
      'Génération automatique de rapports et contrats Word personnalisés',
      'Scripts d\'automatisation programmés sans intervention humaine'
    ],
    project: 'Script de génération automatique de 50 contrats et fiches de paie'
  },

  // ── Pôle 4 : Intelligence Artificielle & Code Augmenté ──
  {
    slug: 'google-antigravity-mastery',
    title: 'Google Antigravity : Maîtrise de l\'IA & du Code Moderne',
    pole: 'IA & Code',
    level: 'Tous niveaux',
    duration: '12h de pratique',
    emoji: '🤖',
    color: 'from-violet-600 to-blue-600',
    border: 'border-violet-500/30',
    desc: 'Maîtrisez l\'assistant de développement Antigravity pour coder 10x plus vite. Automatisez vos flux, refactorisez votre code et devenez un développeur augmenté par l\'IA.',
    outcomes: [
      'Prompting avancé pour l\'ingénierie logicielle et le debug automatique',
      'Création d\'architectures complètes assistées par agents autonomes',
      'Industrialisation et bonnes pratiques de clean code avec l\'IA'
    ],
    project: 'Développement d\'une application web complète assistée par Antigravity'
  },
  {
    slug: 'antigravity-excel-advanced',
    title: 'Google Antigravity : Automatisation Excel Avancée & Macros IA',
    pole: 'IA & Code',
    level: 'Intermédiaire',
    duration: '9h de pratique',
    emoji: '📊',
    color: 'from-purple-600 to-indigo-600',
    border: 'border-purple-500/30',
    desc: 'Associez l\'intelligence artificielle d\'Antigravity avec Python pour générer des classeurs Excel ultra-dynamiques, des macros complexes et des analyses prédictives.',
    outcomes: [
      'Génération de formules complexes et scripts Python via requêtes en langage naturel',
      'Analyse de données volumineuses et détection d\'anomalies par IA',
      'Création de macros sans jamais avoir à coder en VBA traditionnel'
    ],
    project: 'Dashboard prédictif avec modèles d\'analyse automatisés par l\'IA'
  }
];

// Données structurées FAQ (Balisage Schema.org pour AdSense & SEO)
const FAQ_ITEMS = [
  {
    q: 'L\'accès aux 10 formations d\'Elsayf est-il réellement 100% gratuit ?',
    a: 'Oui, l\'ensemble de nos 10 parcours de formation (Data Science, Power BI, Cybersécurité SOC, Pentest OWASP, Automatisation Excel et IA) est accessible gratuitement sans carte bancaire requise. Cette gratuité est rendue possible grâce à un modèle économique transparent combinant des partenariats et des publicités ciblées non intrusives conformes aux règles Google AdSense.'
  },
  {
    q: 'Faut-il installer Python ou des logiciels lourds sur mon ordinateur ?',
    a: 'Non, aucune installation préalable n\'est nécessaire. La plateforme Elsayf intègre un éditeur de code et un simulateur interactif directement dans le navigateur web. Vous pouvez rédiger, exécuter et tester vos scripts Python ou manipuler vos requêtes instantanément depuis n\'importe quel ordinateur (Windows, Mac, Linux ou Chromebook).'
  },
  {
    q: 'Quels sont les prérequis pour débuter en Cybersécurité ou en Data Analytics ?',
    a: 'Nos formations sont calibrées pour accueillir aussi bien les novices complets que les professionnels en reconversion. Chaque parcours démarre par les fondamentaux conceptuels et mathématiques simples avant de progresser étape par étape vers des cas pratiques d\'entreprise et des projets concrets.'
  },
  {
    q: 'Comment s\'articule la pédagogie par la pratique d\'Elsayf ?',
    a: 'Nous rejetons l\'apprentissage purement théorique. Chaque chapitre combine une leçon détaillée, des extraits de code interactifs à exécuter, des exercices d\'application immédiate et un projet de fin de formation réaliste pouvant être intégré directement dans votre portfolio professionnel.'
  },
  {
    q: 'Puis-je valoriser ces compétences sur mon CV professionnel ?',
    a: 'Absolument. En plus des compétences techniques acquises, Elsayf met à votre disposition le Studio CV Pro (accessible gratuitement sur mycv.click et elsayf.click) pour générer des CV professionnels au format A4 vectoriel adaptés aux critères stricts des recruteurs et aux logiciels de filtrage ATS.'
  },
  {
    q: 'Délivrez-vous un certificat ou un diplôme officiel à la fin des cours ?',
    a: 'Non, Elsayf ne délivre pas de diplôme ou de certificat académique. Notre démarche est 100% orientée vers la pratique et les compétences réelles : chaque cours vous permet de développer des projets d\'entreprise concrets (Dashboards Power BI, scripts d\'automatisation, audits de sécurité) directement valorisables sur votre profil GitHub, votre portfolio et votre CV.'
  },
  {
    q: 'Comment les données personnelles des étudiants sont-elles protégées ?',
    a: 'Elsayf respecte scrupuleusement les exigences du RGPD et les standards internationaux de sécurité. Vos données ne sont jamais vendues à des tiers. Notre politique de confidentialité détaille l\'usage éthique des cookies techniques et des services tiers certifiés comme Google AdSense.'
  },
  {
    q: 'Comment fonctionne l\'assistance par Intelligence Artificielle sur la plateforme ?',
    a: 'Elsayf intègre des assistants IA pédagogiques (Gemini, Claude, Antigravity) configurés spécialement pour la programmation. Si votre script présente une erreur de syntaxe ou un bug logique, l\'assistant vous guide avec bienveillance pour vous aider à comprendre et corriger votre code sans donner la solution toute faite.'
  },
  {
    q: 'La plateforme est-elle compatible sur smartphone et tablette ?',
    a: 'Oui. Tout le contenu théorique, les guides méthodologiques, les quiz et l\'interface sont entièrement adaptatifs (Responsive Web Design). Pour coder confortablement dans l\'éditeur cloud, nous recommandons néanmoins un ordinateur portable ou de bureau.'
  },
  {
    q: 'Comment contacter l\'équipe pédagogique en cas de question ou de blocage ?',
    a: 'Notre équipe de formateurs et développeurs est joignable 7j/7 via notre formulaire de contact ou directement par e-mail à contact@statlabo.com. Nous nous engageons à répondre à toutes les demandes techniques et pédagogiques sous 24 heures ouvrées.'
  }
];

// 4 Parcours Métiers / Roadmaps pour enrichir la valeur éditoriale
const CAREER_ROADMAPS = [
  {
    title: 'Parcours Data Analyst & BI Specialist',
    icon: BarChart3,
    color: 'from-amber-500 to-yellow-600',
    tag: 'Très Forte Demande',
    desc: 'Transformez des millions de données brutes en indicateurs stratégiques visuels pour aider les dirigeants à prendre des décisions éclairées.',
    steps: [
      'Fondamentaux statistiques & nettoyage avec Excel & Python',
      'Modélisation décisionnelle & ETL avancé sous Power Query',
      'Mesures DAX complexes & intelligence temporelle',
      'Conception de Dashboards interactifs pour comités de direction'
    ],
    outcomes: 'Postes visés : Data Analyst, Consultant BI, Chargé d\'études statistiques.'
  },
  {
    title: 'Parcours Expert Cybersécurité & SOC',
    icon: Shield,
    color: 'from-red-500 to-rose-700',
    tag: 'Secteur Critique',
    desc: 'Protégez les serveurs d\'entreprise contre les cyberattaques et apprenez à identifier les failles web avant les pirates malveillants.',
    steps: [
      'Hardening système Linux, pare-feu UFW et sécurisation SSH',
      'Surveillance en temps réel et corrélation SIEM (Wazuh, Suricata)',
      'Audit de sécurité des applications web (OWASP Top 10)',
      'Méthodologie de réponse aux incidents et analyse de traces'
    ],
    outcomes: 'Postes visés : Analyste SOC Blue Team, Pentester Junior, Administrateur Sécurité.'
  },
  {
    title: 'Parcours Automatisation & Gestion PME',
    icon: Cpu,
    color: 'from-emerald-500 to-teal-700',
    tag: 'Gain de Temps Immédiat',
    desc: 'Supprimez 90% des tâches répétitives sur Excel et Word en automatisant la comptabilité, les factures et les flux administratifs.',
    steps: [
      'Scripts Python avec openpyxl et pandas pour traiter des classeurs volumineux',
      'Automatisation du Journal comptable, Balance et Rapprochement bancaire',
      'Génération automatisée de fiches de paie et contrats sous Word',
      'Mise en place d\'un système ERP léger et sur mesure'
    ],
    outcomes: 'Postes visés : Responsable Administratif & Financier, Office Manager Tech, Développeur d\'outils internes.'
  },
  {
    title: 'Parcours Ingénierie du Code & IA Moderne',
    icon: Sparkles,
    color: 'from-violet-500 to-indigo-600',
    tag: 'Compétence Avenir',
    desc: 'Multipliez votre productivité de développeur par 10 en associant la programmation Python moderne avec les assistants de code autonomes.',
    steps: [
      'Prompt engineering appliqué au génie logiciel et refactorisation',
      'Pilotage de l\'assistant Google Antigravity pour concevoir des architectures web',
      'Automatisation de macros complexes sans VBA historique',
      'Déploiement d\'applications robustes avec Docker et CI/CD'
    ],
    outcomes: 'Postes visés : Développeur Full-Stack Augmenté, Ingénieur Automatisation IA, Prompt Engineer.'
  }
];

export default function Home() {
  const { t } = useLanguage();
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const [region, setRegion] = useState('GLOBAL');
  const [country, setCountry] = useState('');
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPole, setSelectedPole] = useState('TOUS');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchGeo = fetch('/api/geo/detect')
      .then(r => r.json())
      .then(d => { if (d.success) { setRegion(d.region); setCountry(d.country); } })
      .catch(() => { });

    const fetchPlans = fetch('/api/super-admin/subscription-plans')
      .then(r => r.json())
      .then(d => { if (d.success) setPlans(d.plans.filter(p => p.isActive)); })
      .catch(() => { })
      .finally(() => setPlansLoading(false));

    Promise.all([fetchGeo, fetchPlans]);
  }, []);

  const regionalPlans = plans.filter(p => p.region === region || p.region === 'GLOBAL');
  const mainPlan = regionalPlans[0] || null;

  const polesList = ['TOUS', 'Data & BI', 'Cybersécurité', 'Automatisation & Gestion', 'IA & Code'];
  const filteredCourses = selectedPole === 'TOUS'
    ? ALL_COURSES
    : ALL_COURSES.filter(c => c.pole === selectedPole);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-20 pb-20 overflow-hidden">

      {/* Script JSON-LD Schema.org pour Google AdSense, Search & SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              'name': 'Elsayf E-Learning',
              'url': 'https://elsayf.click',
              'logo': 'https://elsayf.click/logo.png',
              'description': 'Plateforme d\'apprentissage en ligne spécialisée en Python, Data Science, Cybersécurité, Business Intelligence et Intelligence Artificielle.',
              'sameAs': [
                'https://elsayf.statlabo.com'
              ],
              'contactPoint': {
                '@type': 'ContactPoint',
                'email': 'contact@statlabo.com',
                'contactType': 'customer support'
              }
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': FAQ_ITEMS.map(item => ({
                '@type': 'Question',
                'name': item.q,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': item.a
                }
              }))
            }
          ])
        }}
      />

      {/* ── 1. Hero Section ── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 pt-16 sm:pt-20">
        <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a78bfa] rounded-full blur-[150px] opacity-20 animate-pulse"></div>

        <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-6">
          <span className="px-4 py-2 rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] text-xs sm:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2">
            <Sparkles size={14} /> {t('hero.badge')}
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-[#a78bfa] leading-tight" dangerouslySetInnerHTML={{ __html: t('hero.title') }}>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4">
            <Link href="/register" className="btn btn-primary text-base sm:text-lg px-7 sm:px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/30">
              {t('hero.start_free')} <ArrowRight size={20} />
            </Link>

            <Link
              href="/cv"
              className="group relative px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold hover:shadow-[0_0_35px_rgba(167,139,250,0.6)] hover:scale-105 transition-all flex items-center gap-2.5 overflow-hidden border border-violet-400/50"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FileText size={18} className="relative z-10 text-yellow-300" />
              <span className="relative z-10 text-sm sm:text-base">Studio CV Pro</span>
              <span className="relative z-10 px-2 py-0.5 text-[10px] font-black rounded-full bg-yellow-300 text-black uppercase tracking-wider">
                Gratuit
              </span>
            </Link>

            <Link href="#formations" className="btn btn-outline text-base sm:text-lg px-7 sm:px-8 py-3 rounded-xl border-gray-700 text-gray-200 hover:text-white">
              Découvrir les 10 Formations
            </Link>
          </div>

          {/* Badges de Réassurance */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> 10 Formations Publiées</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-purple-400" /> Code Direct dans le Navigateur</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-blue-400" /> Sans Carte Bancaire</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-yellow-400" /> Projets Concrets & Portfolio</span>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Code Demo Section (Valeur Applicative Majeure) ── */}
      <section id="demo" className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Terminal size={14} /> Environnement Cloud Intégré
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Codez Directement dans Votre Navigateur</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Aucun logiciel lourd à installer. Exécutez vos scripts Python, testez vos algorithmes et manipulez vos données en temps réel en toute sécurité.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#a78bfa] to-blue-600 rounded-2xl blur opacity-30"></div>
          <CodeEditor />
        </motion.div>
      </section>

      {/* ── AdSense Slot 1 (Sous la démo de code) ── */}
      <AdSenseAd slot="1234567890" format="horizontal" />

      {/* ── 3. SECTION FORMATIONS ENRICHIE (10 Formations en 4 Pôles d'Excellence) ── */}
      <section id="formations" className="container mx-auto px-4 py-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
            <Award size={14} /> 100% Gratuit & Libre d'Accès
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Nos Parcours de Formation d'Élite
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Explorez nos 10 formations spécialisées créées par des experts métiers. Projets concrets, cas réels d'entreprise et compétences immédiatement opérationnelles.
          </p>

          {/* Filtres par Pôles d'Excellence */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {polesList.map((pole) => (
              <button
                key={pole}
                onClick={() => setSelectedPole(pole)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedPole === pole
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {pole === 'TOUS' ? 'Toutes les Formations (10)' : pole}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Formations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredCourses.map((c) => (
            <div
              key={c.slug}
              className={`glass-card p-6 border ${c.border} rounded-3xl hover:border-purple-500/50 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between bg-gradient-to-b from-gray-900/90 to-[#070c18] group`}
            >
              <div className="space-y-4">
                {/* Header Carte */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                    {c.emoji}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
                      {c.pole}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={11} /> {c.duration}
                    </span>
                  </div>
                </div>

                {/* Titre & Description */}
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-1">{c.level}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                {/* Compétences clés acquises (Valeur Pédagogique AdSense) */}
                <div className="space-y-1.5 pt-2 border-t border-gray-800/80">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ce que vous apprenez :</div>
                  {c.outcomes.map((out, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>

                {/* Projet concret */}
                <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/60 text-[11px] text-purple-300">
                  <strong className="text-white">Projet pratique :</strong> {c.project}
                </div>
              </div>

              {/* Bouton d'accès */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800/80">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  ✓ ACCÈS GRATUIT
                </span>
                <Link
                  href={`/courses/${c.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 font-semibold text-xs transition-all group-hover:shadow-lg group-hover:shadow-purple-600/20"
                >
                  Suivre la formation <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold text-sm transition-all shadow-lg"
          >
            <BookOpen size={16} /> Explorer l'ensemble du catalogue de cours
          </Link>
        </div>
      </section>

      {/* ── AdSense Slot 2 (Entre catalogue et Parcours Métiers) ── */}
      <AdSenseAd slot="1234567891" format="horizontal" />

      {/* ── 4. SECTION ROADMAPS MÉTIERS & DÉBOUCHÉS (Éléments Clés pour Recruteurs & SEO AdSense) ── */}
      <section id="roadmap" className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-purple-500/20">
              <CompassIcon size={14} /> Orientation Professionnelle
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Quel Parcours Choisir Selon Vos Objectifs ?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Pour vous guider efficacement, notre équipe pédagogique a structuré 4 parcours métiers complets. Choisissez la trajectoire qui correspond à vos ambitions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CAREER_ROADMAPS.map((road, idx) => {
              const IconComp = road.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800 hover:border-purple-500/30 transition-all space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${road.color} flex items-center justify-center text-white shadow-lg`}>
                        <IconComp size={24} />
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                        {road.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{road.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{road.desc}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-800/80">
                      <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Étapes d'apprentissage :</div>
                      {road.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-950/80 border border-gray-800 text-xs text-purple-300 font-medium">
                    🎯 <strong className="text-white">Objectif :</strong> {road.outcomes}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. DOSSIER ÉDITORIAL PÉDAGOGIQUE (Contenu Haute Valeur Rédigé pour AdSense) ── */}
      <section id="guide" className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gray-900/40 border border-gray-800 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <GraduationCap size={14} /> Dossier Pédagogique 2026
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Pourquoi l'Apprentissage Actif du Code Change Tout
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Comprendre la différence entre visionner des tutoriels vidéo passifs et construire des projets réels assistés par un environnement de développement interactif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-gray-300 text-sm leading-relaxed">
            <div className="space-y-4 p-6 rounded-2xl bg-gray-950/50 border border-gray-800/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database size={18} className="text-amber-400" />
                1. La Data et la BI au cœur des décisions
              </h3>
              <p>
                Dans un monde saturé d'informations, savoir extraire, nettoyer et modéliser la donnée brute est devenu la compétence la plus valorisée en entreprise. Grâce à Power BI, Power Query et Python Pandas, les données ne sont plus des chiffres abstraits : elles deviennent des tableaux de bord interactifs permettant d'anticiper la trésorerie, la fidélité client et la performance des ventes.
              </p>
              <p className="text-xs text-gray-400">
                Nos cours vous apprennent à penser comme un analyste : formuler la bonne hypothèse, modéliser les relations et raconter une histoire claire aux décideurs.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-gray-950/50 border border-gray-800/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock size={18} className="text-red-400" />
                2. La Cybersécurité : Défense et Éthique
              </h3>
              <p>
                Chaque jour, des milliers d'entreprises et de serveurs web subissent des tentatives d'intrusion automatisées. L'approche d'Elsayf repose sur l'apprentissage par la pratique des deux côtés du miroir : comprendre les failles de l'OWASP Top 10 pour mieux concevoir les défenses, et déployer des outils professionnels comme Wazuh SIEM et Suricata pour bloquer les menaces.
              </p>
              <p className="text-xs text-gray-400">
                Vous apprenez dans un cadre 100% éthique et légal, préparant directement aux exigences des postes de sécurité opérationnelle (SOC Blue Team).
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-gray-950/50 border border-gray-800/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-emerald-400" />
                3. L'Automatisation : Libérer le Potentiel Humain
              </h3>
              <p>
                Passer des heures à copier-coller des lignes de calculs sur des classeurs Excel ou à rédiger manuellement 50 contrats est une perte de temps immense. Avec quelques dizaines de lignes de code Python (openpyxl, docx), ces corvées sont exécutées en quelques secondes sans risque d'erreur humaine de frappe.
              </p>
              <p className="text-xs text-gray-400">
                Cette compétence fait de vous un collaborateur indispensable capable de faire gagner des dizaines d'heures par semaine à son équipe.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-gray-950/50 border border-gray-800/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                4. L'IA comme Mentor et Accélérateur
              </h3>
              <p>
                L'intelligence artificielle ne remplace pas le développeur : elle amplifie considérablement ses capacités. Sur Elsayf, nous intégrons les assistants IA générative (Google Antigravity, Gemini) comme des copilotes pédagogiques qui vous expliquent la logique d'un algorithme et vous aident à déboguer en temps réel.
              </p>
              <p className="text-xs text-gray-400">
                Vous apprenez les bonnes pratiques du prompt engineering appliqué au génie logiciel dès vos premières leçons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AdSense Slot 3 (Milieu de page / In-Article) ── */}
      <AdSenseAd slot="1234567892" format="horizontal" />

      {/* ── 6. SECTION STUDIO CV PRO ── */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-[#0a0f1d] to-indigo-950/40 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#a78bfa] rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a78bfa]/15 border border-[#a78bfa]/30 text-[#a78bfa] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} /> OUTIL INTÉGRÉ GRATUIT • STUDIO CV PRO
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Créez un CV d'Élite <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] via-purple-300 to-indigo-300">
                  Calibré pour Décrocher des Entretiens
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Valorisez les compétences acquises dans nos cours. Que vous postuliez comme <strong className="text-white">Data Analyst</strong>, <strong className="text-white">Développeur Python</strong>, <strong className="text-white">Analyste Cybersécurité</strong> ou <strong className="text-white">Gestionnaire financier</strong>, exportez un CV A4 vectoriel optimisé pour les recruteurs et les systèmes ATS.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-bold text-[#a78bfa]">6+</div>
                  <div className="text-[11px] text-gray-400">Templates A4</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-bold text-emerald-400">1 Clic</div>
                  <div className="text-[11px] text-gray-400">Profils Types</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-bold text-cyan-400">100%</div>
                  <div className="text-[11px] text-gray-400">ATS Compatible</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-bold text-purple-400">Gratuit</div>
                  <div className="text-[11px] text-gray-400">Export PDF</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/cv"
                  className="btn btn-primary text-base px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <FileText size={18} />
                  <span>Créer mon CV Pro</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/cv"
                  className="px-6 py-3.5 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-[#a78bfa] transition-all text-sm font-semibold"
                >
                  Tester les modèles en direct
                </Link>
              </div>
            </div>

            {/* Visual Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white text-gray-900 p-5 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs">
                      SM
                    </div>
                    <div>
                      <div className="text-xs font-bold">Sofiane Mansouri</div>
                      <div className="text-[10px] text-gray-500">Dev Full-Stack & Data</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-700">
                    Template Tech A4
                  </span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                  <div className="pt-2 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-mono text-slate-700">Python</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-mono text-slate-700">Power BI</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-mono text-slate-700">Cybersécurité</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-mono text-slate-700">Antigravity IA</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                  <span>Prêt pour recruteurs & ATS</span>
                  <span className="text-violet-600 font-bold">PDF Haute Définition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Espace Parents ── */}
      <section className="container mx-auto px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a78bfa]/10 via-night-blue to-night-blue border border-[#a78bfa]/30 p-8 md:p-14">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-5">
              <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1.5">
                <Globe size={14} /> Suivi Pédagogique
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {t('parents.title')}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {t('parents.subtitle')}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-green-400 mt-1 shrink-0" />
                  <p className="text-gray-300 text-xs sm:text-sm">{t('parents.card_1_title')}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-green-400 mt-1 shrink-0" />
                  <p className="text-gray-300 text-xs sm:text-sm">{t('parents.card_3_title')}</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/parents" className="group px-7 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all inline-flex items-center gap-2 text-sm shadow-lg shadow-green-600/20">
                  {t('parents.cta')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <div className="glass-card p-6 border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Tableau de Bord Parent</h4>
                    <p className="text-[11px] text-gray-400">Suivi en temps réel des leçons complétées</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progression Globale</span>
                    <span className="text-green-400 font-bold">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Pricing / Plans d'Accès ── */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">{t('pricing.title')}</h2>

        {country && (
          <p className="text-xs sm:text-sm text-gray-400 mb-8 flex items-center justify-center gap-1.5">
            <Globe size={14} />
            Prix affichés pour&nbsp;
            <span className="text-purple-300 font-medium">
              {region === 'ALGERIA' ? '🇩🇿 Algérie (DZD)' : region === 'EUROPE' ? '🇪🇺 Europe (EUR)' : '🌍 International'}
            </span>
            &nbsp;·&nbsp;
            <Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
              Voir tous les plans
            </Link>
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Gratuit */}
          <div className="glass-card p-8 border-t-4 border-[#a78bfa] relative rounded-3xl flex flex-col justify-between">
            <div>
              <div className="absolute top-0 right-0 bg-[#a78bfa] text-black text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">POPULAIRE</div>
              <h3 className="text-2xl font-bold mb-2 text-white">{t('pricing.student_plan')}</h3>
              <div className="text-4xl font-bold text-[#a78bfa] my-4">
                0 {region === 'ALGERIA' ? 'DZD' : '€'}
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-6 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Accès Immédiat aux 10 Formations
              </p>
              <ul className="text-left w-full space-y-2.5 mb-8 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa] shrink-0" /> Accès complet à tous les 10 cours</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa] shrink-0" /> Simulateur de code Cloud dans le navigateur</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa] shrink-0" /> Studio CV Pro A4 gratuit</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa] shrink-0" /> Forum d'entraide communautaire</li>
              </ul>
            </div>
            <Link href="/register?plan=student" className="btn btn-primary w-full text-base py-3.5 shadow-lg shadow-violet-500/20 rounded-xl font-bold">
              Commencer Gratuitement
            </Link>
          </div>

          {/* Plan Premium / Dynamique */}
          {plansLoading ? (
            <div className="glass-card p-8 flex items-center justify-center rounded-3xl">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : mainPlan ? (
            (() => {
              const { amount, currency } = getDisplayPrice(mainPlan, region);
              const features = safeParseFeatures(mainPlan.features);
              return (
                <div className="glass-card p-8 border-t-4 border-purple-500 relative rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">
                      {region === 'ALGERIA' ? '🇩🇿 ALGÉRIE' : region === 'EUROPE' ? '🇪🇺 EUROPE' : 'PREMIUM'}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {mainPlan.region === 'ALGERIA'
                        ? <Crown size={36} className="text-yellow-500" />
                        : <Zap size={36} className="text-purple-400" />}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{mainPlan.name}</h3>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 my-4">
                      {amount} {currency}
                      <span className="text-sm text-gray-500 font-normal ml-1">
                        /{mainPlan.duration === 30 ? 'mois' : `${mainPlan.duration}j`}
                      </span>
                    </div>
                    <ul className="text-left w-full space-y-2.5 mb-8 text-gray-300 text-xs sm:text-sm">
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-400 shrink-0" /> Accès complet sans publicité</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-400 shrink-0" /> Support prioritaire avec les formateurs</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-400 shrink-0" /> Projets concrets pour votre portfolio</li>
                    </ul>
                  </div>
                  <Link href="/pricing" className="btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white w-full text-base py-3.5 shadow-lg shadow-purple-500/20 rounded-xl font-bold">
                    Voir les formules Premium
                  </Link>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-8 border-t-4 border-gray-600 flex flex-col justify-between rounded-3xl">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-400">Offre Premium</h3>
                <div className="text-4xl font-bold text-gray-500 my-4">Bientôt disponible</div>
                <p className="text-xs text-gray-400 mb-6">Nos formules pour entreprises et accompagnement intensif arrivent sous peu.</p>
              </div>
              <Link href="/courses" className="btn btn-outline w-full py-3 rounded-xl border-gray-700 text-gray-300">
                Explorer les formations gratuites
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 9. SECTION FAQ PÉDAGOGIQUE ENRICHIE (Balisage Schema.org & Texte Haute Valeur AdSense) ── */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle size={14} /> Questions Fréquentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Tout ce qu'il faut savoir sur Elsayf</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Retrouvez les réponses aux questions les plus courantes sur le fonctionnement de la plateforme et nos formations.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left font-bold text-white flex items-center justify-between gap-4 hover:text-purple-300 transition-colors cursor-pointer text-sm sm:text-base"
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-purple-400 transition-transform duration-200 ${
                    openFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/60">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── AdSense Slot 4 (Avant le Mega-Footer) ── */}
      <AdSenseAd slot="1234567893" format="horizontal" />

    </div>
  );
}

function CompassIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
  );
}
