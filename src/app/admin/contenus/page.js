'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  BookOpen, ArrowLeft, Search, Sparkles, FileText, Shield, Database,
  Cpu, Award, ExternalLink, Copy, Check, Printer, ChevronRight,
  TrendingUp, HelpCircle, Terminal, Code2, Layers, Zap, Eye, Bookmark
} from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';

// ── 3 Parcours Métiers Détaillés ──
const CAREER_PATHS = [
  {
    id: 'data-analyst',
    title: 'Data Analyst & Business Intelligence Specialist',
    pole: 'Pôle Data & Décisionnel',
    icon: Database,
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-yellow-500/30',
    bgBadge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    summary: 'Transformer des données brutes hétérogènes en tableaux de bord décisionnels interactifs pour guider la stratégie des comités de direction.',
    marketDemand: 'Très Forte Demande en Algérie (Banques, Télécoms, E-commerce) et en Remote international.',
    salaries: {
      dzJunior: '70 000 - 95 000 DZD/mois',
      dzMid: '110 000 - 160 000 DZD/mois',
      dzSenior: '180 000 - 280 000+ DZD/mois',
      remoteEur: '38 000€ - 65 000€ / an (3 200€ - 5 400€/mois)',
    },
    certifications: [
      'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
      'PCAP - Certified Associate in Python Programming',
    ],
    steps: [
      {
        num: 1,
        title: 'Nettoyage & Statistiques Novices (Excel + Python)',
        courseSlug: 'analyse-donnees-quali-quanti',
        desc: 'Moyennes pondérées, écart-types, croisements dynamiques et détection d\'anomalies sur 50 000 lignes de vente.',
        keySkills: ['Statistiques descriptives', 'Pandas DataFrame', 'Graphiques de corrélation', 'Nettoyage de valeurs nulles']
      },
      {
        num: 2,
        title: 'Modélisation Décisionnelle & DAX Avancé (Power BI)',
        courseSlug: 'power-bi-business-intelligence-data-analytics',
        desc: 'Étoile de données, transition de contexte, CALCULATE, Time Intelligence et conception de dashboards immersifs.',
        keySkills: ['Power Query ETL', 'Formules DAX complexes', 'Schéma en Étoile', 'KPIs Financiers & Ventes']
      },
      {
        num: 3,
        title: 'Optimisation de Flux & Recherche Opérationnelle',
        courseSlug: 'recherche-operationnelle-python-ia',
        desc: 'Résolution de problèmes d\'allocation de flottes, stocks minimaux et tournées logistiques avec solveurs Python (PuLP).',
        keySkills: ['Programmation linéaire', 'Solveurs PuLP/SciPy', 'Optimisation des coûts', 'Aide à la décision IA']
      }
    ],
    project: {
      title: 'Dashboard Financier & Logistique Intégré pour Groupe Multi-Filiales',
      desc: 'Conception d\'un modèle tabulaire complet reliant 5 sources disparates (ventes, trésorerie, stocks), avec 25 mesures DAX avancées et un rapport interactif prêt pour présentation en conseil d\'administration.'
    }
  },
  {
    id: 'cybersecurity-pentest',
    title: 'Expert Cybersécurité & Pentester Web (Red / Blue Team)',
    pole: 'Pôle Sécurité & Systèmes',
    icon: Shield,
    color: 'from-red-500 to-rose-700',
    borderColor: 'border-red-500/30',
    bgBadge: 'bg-red-500/10 text-red-400 border-red-500/20',
    summary: 'Protéger l\'infrastructure réseau et les serveurs d\'entreprise, surveiller les incidents avec un SIEM et auditer les applications contre l\'OWASP Top 10.',
    marketDemand: 'Secteur hautement stratégique. Pénurie mondiale de profils formés à la défense active et aux tests d\'intrusion éthiques.',
    salaries: {
      dzJunior: '80 000 - 110 000 DZD/mois',
      dzMid: '130 000 - 200 000 DZD/mois',
      dzSenior: '220 000 - 350 000+ DZD/mois',
      remoteEur: '45 000€ - 85 000€ / an (3 750€ - 7 000€/mois)',
    },
    certifications: [
      'CompTIA Security+ / CEH (Certified Ethical Hacker)',
      'eJPT (Junior Penetration Tester) / OSCP',
    ],
    steps: [
      {
        num: 1,
        title: 'Sécurité Défensive & Architecture SOC',
        courseSlug: 'cybersecurite-protection-systemes-defensive',
        desc: 'Durcissement Linux/SSH, pare-feu UFW/iptables, déploiement de Wazuh SIEM et analyse de flux avec Suricata IDS.',
        keySkills: ['Hardening Linux', 'Wazuh SIEM', 'Suricata IDS/IPS', 'Gestion des logs et alertes']
      },
      {
        num: 2,
        title: 'Ethical Hacking & Pentest Web (OWASP)',
        courseSlug: 'ethical-hacking-securite-web-pentest',
        desc: 'Reconnaissance d\'infrastructures, exploitation des vulnérabilités SQLi, XSS, CSRF, IDOR et rédaction de rapports d\'audit.',
        keySkills: ['Méthodologie PTES', 'Burp Suite / OWASP ZAP', 'Failles OWASP Top 10', 'Rapport de remédiation']
      }
    ],
    project: {
      title: 'Audit de Sécurité Complet & Déploiement d\'un SOC Minimal',
      desc: 'Audit d\'une application web vulnérable en environnement lab, rédaction du rapport de test d\'intrusion avec criticité CVSS, et configuration d\'un agent Wazuh sur serveur cloud avec règles d\'alerte automatisées.'
    }
  },
  {
    id: 'automation-ia',
    title: 'Productivité & Ingénieur en Automatisation IA',
    pole: 'Pôle Automatisation & IA',
    icon: Cpu,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/30',
    bgBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    summary: 'Éliminer 90% des corvées manuelles en entreprise grâce à la puissance des scripts Python, des workflows No-Code et des architectures RAG connectées aux LLMs.',
    marketDemand: 'Compétence tremplin à effet immédiat pour comptables, gestionnaires, directeurs administratifs et développeurs full-stack.',
    salaries: {
      dzJunior: '65 000 - 90 000 DZD/mois',
      dzMid: '100 000 - 150 000 DZD/mois',
      dzSenior: '170 000 - 260 000+ DZD/mois',
      remoteEur: '40 000€ - 70 000€ / an (3 300€ - 5 800€/mois)',
    },
    certifications: [
      'Python Institute Certified PCED / PCAP',
      'Prompt Engineering for Developers (OpenAI/Google)',
    ],
    steps: [
      {
        num: 1,
        title: 'Automatisation Excel & Comptabilité Détaillée',
        courseSlug: 'automatisation-excel-comptabilite-detaillee',
        desc: 'Scripts Python avec openpyxl et Pandas pour générer balances comptables, factures PDF et rapprochements bancaires instantanés.',
        keySkills: ['OpenPyXL scripts', 'Rapprochement bancaire', 'Génération PDF/Word', 'Audit des doublons']
      },
      {
        num: 2,
        title: 'Google Antigravity & Maîtrise du Code Assisté par IA',
        courseSlug: 'google-antigravity-mastery',
        desc: 'Pilotage d\'agents autonomes, architectures logicielles assistées par IA et création d\'outils internes ultra-rapides.',
        keySkills: ['Prompt Engineering génie logiciel', 'Assistants de code IA', 'APIs LLM & JSON', 'Pipelines N8N']
      }
    ],
    project: {
      title: 'Système Autonome de Facturation & Reporting Télégram',
      desc: 'Pipeline automatisé qui extrait des factures PDF, met à jour un classeur Excel consolidé, génère un rapport de trésorerie quotidien et l\'expédie automatiquement sur un canal Telegram sécurisé.'
    }
  }
];

// ── 4 Fiches Mémos & Cheatsheets ──
const CHEATSHEETS = [
  {
    id: 'dax',
    title: 'DAX Power BI : 10 Formules Fondamentales',
    category: 'Data & BI',
    desc: 'Syntaxe précise, pièges de contexte et meilleures pratiques d\'évaluation pour Power BI Desktop.',
    snippets: [
      {
        name: 'CALCULATE avec filtre dynamique',
        code: `ChiffreAffaires_Alger = 
CALCULATE(
    SUM(Ventes[MontantTotal]),
    Ventes[Wilaya] = "Alger",
    Ventes[Statut] = "Livre"
)`
      },
      {
        name: 'Time Intelligence : Année à date (YTD)',
        code: `CA_Cumule_YTD = 
TOTALYTD(
    SUM(Ventes[MontantTotal]),
    'Calendrier'[Date]
)`
      },
      {
        name: 'Évolution en % par rapport à l\'année précédente (YoY)',
        code: `Croissance_YoY = 
VAR CA_Actuel = SUM(Ventes[MontantTotal])
VAR CA_Annee_Precedente = CALCULATE(SUM(Ventes[MontantTotal]), SAMEPERIODLASTYEAR('Calendrier'[Date]))
RETURN
    DIVIDE(CA_Actuel - CA_Annee_Precedente, CA_Annee_Precedente, 0)`
      }
    ]
  },
  {
    id: 'python-excel',
    title: 'Python pour Excel : Automatisation Pandas & OpenPyXL',
    category: 'Automatisation',
    desc: 'Charger, concaténer 50 classeurs en 2s et styliser les cellules par programme.',
    snippets: [
      {
        name: 'Fusionner tous les classeurs d\'un répertoire',
        code: `import glob
import pandas as pd

# Concaténer tous les fichiers de vente
fichiers = glob.glob("donnees/ventes_*.xlsx")
df_global = pd.concat([pd.read_excel(f) for f in fichiers], ignore_index=True)

# Sauvegarde consolidée
df_global.to_excel("Synthese_Ventes_Globales.xlsx", index=False)
print(f"✅ {len(fichiers)} fichiers fusionnés avec succès !")`
      },
      {
        name: 'Colorier automatiquement les totaux sous OpenPyXL',
        code: `import openpyxl
from openpyxl.styles import PatternFill, Font

wb = openpyxl.load_workbook("Synthese_Ventes_Globales.xlsx")
ws = wb.active

# Style d'en-tête bleu nuit
fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
font = Font(color="FFFFFF", bold=True)

for cell in ws[1]:
    cell.fill = fill
    cell.font = font

wb.save("Synthese_Stylisee.xlsx")`
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersécurité & Pentest : OWASP Top 10 & Nmap',
    category: 'Cybersécurité',
    desc: 'Commandes de reconnaissance réseau, identification des failles et remédiations préventives.',
    snippets: [
      {
        name: 'Scan réseau et détection de services avec Nmap',
        code: `# Scan furtif SYN avec détection des versions de services et OS
nmap -sS -sV -O -T4 192.168.1.1/24

# Scan rapide sur les ports web critiques
nmap -p 80,443,8080,8443 --script http-headers,http-title 192.168.1.50`
      },
      {
        name: 'Protection définitive contre SQLi : Requête Préparée en Python',
        code: `# ❌ MAUVAIS (Vulnérable à l'injection SQL) :
cursor.execute(f"SELECT * FROM users WHERE email = '{user_input}'")

# ✅ SÉCURISÉ (Requête paramétrée avec placeholder) :
cursor.execute("SELECT * FROM users WHERE email = %s", (user_input,))`
      }
    ]
  },
  {
    id: 'prompting-ia',
    title: 'Prompt Engineering : Les 6 Piliers d\'un Prompt Professionnel',
    category: 'IA & Code',
    desc: 'Méthodologie éprouvée pour obtenir des réponses déterministes, de qualité production.',
    snippets: [
      {
        name: 'Structure du Prompt Parfait (Format 6 Blocs)',
        code: `1. RÔLE : Tu es un architecte logiciel cloud certifié AWS et expert Node.js/Next.js.
2. CONTEXTE : Nous concevons une API de paiement connectée au gateway Chargily Pay.
3. INSTRUCTION : Écris une fonction sécurisée de vérification de signature de webhook.
4. CONTRAINTES : Renvoyer uniquement du code TypeScript strict, pas de texte inutile.
5. FORMAT DE SORTIE : Répondre sous forme d'un objet JSON { code: string, explanation: string }.
6. EXEMPLE (Few-Shot) : [Insérer un extrait court du résultat idéal attendu]`
      }
    ]
  }
];

// ── Banque de Questions Recruteur & Réponses Modèles ──
const INTERVIEW_QUESTIONS = [
  {
    role: 'Data Analyst & BI',
    question: 'Expliquez concrètement la différence entre CALCULATE et RELATED dans Power BI. Comment CALCULATE modifie-t-il le contexte de filtre ?',
    context: 'Un directeur financier demande de recalculer la marge brute d\'une catégorie de produits en ignorant les filtres de date actifs.',
    keyPoints: ['Transition de contexte', 'Filter Context vs Row Context', 'Relations 1-to-N', 'Fonction ALL/REMOVEFILTERS'],
    modelAnswer: 'CALCULATE est la fonction reine en DAX car elle permet de modifier le contexte d\'évaluation des filtres (Filter Context) avant d\'exécuter l\'expression. Elle peut ajouter, supprimer (avec ALL/REMOVEFILTERS) ou écraser des filtres. De plus, lorsqu\'elle est appelée dans un contexte de ligne, elle effectue une transition de contexte (transformant la ligne courante en filtre équivalent). RELATED, en revanche, ne modifie aucun contexte : elle navigue simplement le long d\'une relation existante (plusieurs-à-un) pour récupérer la valeur d\'une colonne dans une table dimensionnelle liée.'
  },
  {
    role: 'Cybersécurité & Pentest',
    question: 'Qu\'est-ce qu\'une Blind SQL Injection (Time-based et Boolean-based) et comment un attaquant l\'exploite-t-il pour exfiltrer une base de données ? Comment la corriger de façon définitive ?',
    context: 'Audit d\'une application bancaire dont la page de login renvoie un code HTTP 200 générique sans message d\'erreur SQL.',
    keyPoints: ['Requêtes préparées (Prepared Statements)', 'pg_sleep / SLEEP()', 'Infirmation caractère par caractère', 'Principe de moindre privilège'],
    modelAnswer: 'Une Blind SQLi se produit lorsque l\'application est vulnérable à l\'injection mais n\'affiche aucune donnée de la base de données dans sa réponse HTTP. En Boolean-based, l\'attaquant pose des conditions vrai/faux (ex: AND SUBSTRING(password,1,1)=\'a\') et observe les variations dans la page. En Time-based, il injecte des fonctions de délai (ex: SLEEP(5)) : si la réponse met 5 secondes, la condition est vraie. L\'exfiltration se fait bit par bit ou caractère par caractère. La seule parade définitive est l\'usage universel de requêtes préparées avec paramètres typés (Prepared Statements).'
  },
  {
    role: 'Automatisation & IA',
    question: 'Comparez le RAG (Retrieval-Augmented Generation) et le Fine-Tuning pour intégrer des données d\'entreprise propriétaires dans un LLM. Quelle approche recommandez-vous et pourquoi ?',
    context: 'Une PME veut connecter un modèle IA à ses 10 000 documents PDF comptables et juridiques internes.',
    keyPoints: ['Embeddings & Base Vectorielle', 'Chunking & Cosine Similarity', 'Réduction des hallucinations', 'Coûts de mise à jour'],
    modelAnswer: 'Pour des documents internes d\'entreprise, le RAG est très largement supérieur au Fine-Tuning. Le RAG découpe les documents (chunking) et les indexe via des embeddings dans une base vectorielle. À chaque question posée, les passages pertinents sont injectés dynamiquement dans le prompt contextuel du LLM. Avantages majeurs : mise à jour instantanée sans ré-entraînement coûteux, citation exacte des sources pour audit, et réduction drastique des hallucinations. Le Fine-Tuning sert plutôt à ajuster le style de réponse ou le respect d\'une syntaxe JSON stricte, non à mémoriser des faits documentaires.'
  }
];

export default function AdminContentHubPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('blog'); // 'blog' | 'parcours' | 'cheatsheets' | 'interview'
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(BLOG_POSTS[0]?.slug || '');
  const [fontSize, setFontSize] = useState('text-base'); // 'text-sm' | 'text-base' | 'text-lg'
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentArticle = BLOG_POSTS.find((p) => p.slug === selectedArticleSlug) || BLOG_POSTS[0];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050a14] pt-24 text-center text-slate-400 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Vérification des accès administrateur...</span>
      </div>
    );
  }

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN' ||
                  session?.user?.role === 'R_STAT_ADMIN' || session?.user?.role === 'MARKETING_ADMIN' ||
                  session?.user?.rStatAdminAccess === true;

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050a14] pt-24 px-4 flex items-center justify-center">
        <div className="p-10 text-center max-w-md border border-red-500/30 rounded-3xl bg-slate-900/90 shadow-2xl backdrop-blur-md">
          <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Accès Administrateur Requis</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Ce hub de lecture et de référence est strictement réservé aux administrateurs de la plateforme Elsayf.
          </p>
          <Link
            href="/login?callbackUrl=/admin/contenus"
            className="w-full inline-block py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 transition"
          >
            Se connecter en tant qu'Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 selection:bg-purple-500 selection:text-white pt-24 pb-20 px-4 sm:px-6">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-purple-600/10 via-blue-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <ArrowLeft size={14} /> Retour Admin
              </Link>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Espace Confort • Mode Lecture & Révision
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>📖</span>
              <span>Hub de Lecture & Référence Pédagogique</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Consultez à votre rythme tous les parcours métiers, articles de fond, fiches mémo et réponses types aux entretiens techniques.
            </p>
          </div>

          {/* Quick links to live public pages */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/parcours"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-purple-500/40 transition flex items-center gap-1.5"
            >
              <ExternalLink size={13} className="text-purple-400" />
              <span>Parcours Live</span>
            </Link>
            <Link
              href="/blog"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-purple-500/40 transition flex items-center gap-1.5"
            >
              <ExternalLink size={13} className="text-blue-400" />
              <span>Blog Live</span>
            </Link>
            <Link
              href="/ressources"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-purple-500/40 transition flex items-center gap-1.5"
            >
              <ExternalLink size={13} className="text-emerald-400" />
              <span>Ressources Live</span>
            </Link>
            <Link
              href="/simulateur-entretien"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition flex items-center gap-1.5"
            >
              <Zap size={13} className="text-cyan-400" />
              <span>Simulateur Live</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 backdrop-blur-md">
          {[
            { id: 'blog', label: '✍️ Articles & Guides Blog', count: BLOG_POSTS.length },
            { id: 'parcours', label: '🚀 Parcours Métiers Certifiants', count: CAREER_PATHS.length },
            { id: 'cheatsheets', label: '📚 Fiches Mémos & Snippets', count: CHEATSHEETS.length },
            { id: 'interview', label: '🎯 Questions & Réponses Recruteur', count: INTERVIEW_QUESTIONS.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── TAB 1 : ARTICLES & GUIDES BLOG ── */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left sidebar: Articles list */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
                <span>Sommaire des Articles</span>
                <span>{BLOG_POSTS.length} rédigés</span>
              </div>

              {BLOG_POSTS.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => setSelectedArticleSlug(post.slug)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedArticleSlug === post.slug
                      ? 'bg-purple-600/15 border-purple-500/60 shadow-lg shadow-purple-500/5 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-slate-500">⏱️ {post.readTime}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-200 mb-1 line-clamp-2">
                    {post.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">
                    {post.summary}
                  </div>
                </button>
              ))}
            </div>

            {/* Right container: Reading Mode */}
            <div className="lg:col-span-8">
              {currentArticle ? (
                <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-10 backdrop-blur-md">
                  {/* Reading Comfort Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Taille du texte :</span>
                      <button
                        onClick={() => setFontSize('text-sm')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          fontSize === 'text-sm' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setFontSize('text-base')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          fontSize === 'text-base' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('text-lg')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          fontSize === 'text-lg' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        A+
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${currentArticle.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition"
                      >
                        <ExternalLink size={13} /> Voir sur le site public
                      </Link>
                    </div>
                  </div>

                  {/* Article Content Header */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
                      <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                        {currentArticle.category}
                      </span>
                      <span>•</span>
                      <span>⏱️ {currentArticle.readTime}</span>
                      <span>•</span>
                      <span>{currentArticle.date}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-4">
                      {currentArticle.title}
                    </h2>

                    <div className="p-4 rounded-xl bg-purple-950/20 border-l-4 border-purple-500 text-slate-300 text-sm leading-relaxed italic mb-6">
                      {currentArticle.summary}
                    </div>

                    {/* SEO Meta Specs Box */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1 mb-8">
                      <div><strong className="text-purple-300">Balise Title SEO :</strong> {currentArticle.metaTitle}</div>
                      <div><strong className="text-purple-300">Meta Description :</strong> {currentArticle.metaDesc}</div>
                      <div><strong className="text-purple-300">Tags indexés :</strong> {currentArticle.tags?.join(', ')}</div>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className={`prose prose-invert max-w-none text-slate-300 leading-relaxed ${fontSize} whitespace-pre-line font-sans`}>
                    {currentArticle.content}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl">
                  Sélectionnez un article pour commencer la lecture.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2 : PARCOURS MÉTIERS CERTIFIANTS ── */}
        {activeTab === 'parcours' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {CAREER_PATHS.map((path) => {
                const IconComponent = path.icon;
                return (
                  <div
                    key={path.id}
                    className={`rounded-3xl bg-slate-900/80 border ${path.borderColor} p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm shadow-xl`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-white shadow-lg`}>
                          <IconComponent size={24} />
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${path.bgBadge}`}>
                          {path.pole}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-white mb-2 leading-tight">
                        {path.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                        {path.summary}
                      </p>

                      {/* Grille Salariale Réelle */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 space-y-2 text-xs">
                        <div className="font-bold text-slate-300 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                          <TrendingUp size={14} className="text-emerald-400" />
                          <span>Salaires Observés (Marché 2026) :</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Junior (Algérie) :</span>
                          <strong className="text-white">{path.salaries.dzJunior}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Confirmé (Algérie) :</span>
                          <strong className="text-white">{path.salaries.dzMid}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Senior (Algérie) :</span>
                          <strong className="text-white">{path.salaries.dzSenior}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-900">
                          <span>International / Remote :</span>
                          <strong className="text-purple-300">{path.salaries.remoteEur}</strong>
                        </div>
                      </div>

                      {/* Étapes du Cursus */}
                      <div className="space-y-3 mb-6">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Programme Étape par Étape :
                        </div>
                        {path.steps.map((step) => (
                          <div key={step.num} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
                            <div className="font-bold text-white flex items-center justify-between mb-1">
                              <span className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">
                                  {step.num}
                                </span>
                                <span>{step.title}</span>
                              </span>
                              <Link
                                href={`/courses/${step.courseSlug}`}
                                target="_blank"
                                className="text-[10px] text-purple-400 hover:text-purple-300 underline"
                              >
                                Fiche &rarr;
                              </Link>
                            </div>
                            <p className="text-slate-400 text-[11px] mb-2">{step.desc}</p>
                            <div className="flex flex-wrap gap-1">
                              {step.keySkills.map((k, kIdx) => (
                                <span key={kIdx} className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-cyan-300">
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projet Réel de Validation */}
                    <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs">
                      <strong className="text-purple-300 font-bold block mb-1">
                        🎯 Livrable de Fin de Formation :
                      </strong>
                      <div className="font-semibold text-white mb-1">{path.project.title}</div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{path.project.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3 : FICHES MÉMOS & CHEATSHEETS ── */}
        {activeTab === 'cheatsheets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CHEATSHEETS.map((sheet) => (
                <div
                  key={sheet.id}
                  className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {sheet.category}
                      </span>
                      <span className="text-xs text-slate-500">{sheet.snippets.length} snippets prêts</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{sheet.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-6">{sheet.desc}</p>

                    <div className="space-y-4">
                      {sheet.snippets.map((snip, idx) => (
                        <div key={idx} className="rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-300 font-medium">
                            <span>{snip.name}</span>
                            <button
                              onClick={() => handleCopy(snip.code, `${sheet.id}-${idx}`)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition"
                            >
                              {copiedSnippet === `${sheet.id}-${idx}` ? (
                                <>
                                  <Check size={12} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre">
                            {snip.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4 : QUESTIONS RECRUTEUR & RÉPONSES MODÈLES ── */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="text-slate-400 text-xs sm:text-sm mb-4">
              Ces questions sont celles posées par le <strong>Simulateur d'Entretien IA</strong>. Vous avez ici accès aux réponses modèles idéales attendues par les recruteurs techniques.
            </div>

            <div className="space-y-6">
              {INTERVIEW_QUESTIONS.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 backdrop-blur-md space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Filière : {q.role}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Question #{idx + 1}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{q.question}</h3>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-base">🏢</span>
                    <div>
                      <strong className="text-purple-300 font-semibold">Mise en situation d'entreprise : </strong>
                      {q.context}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-semibold">Mots-clés discriminants testés :</span>
                    {q.keyPoints.map((kp, kIdx) => (
                      <span key={kIdx} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20 font-mono">
                        {kp}
                      </span>
                    ))}
                  </div>

                  {/* Réponse Modèle */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-950 to-blue-950/30 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Check size={14} /> Réponse Modèle Officielle (Lead Recruteur)
                      </span>
                      <button
                        onClick={() => handleCopy(q.modelAnswer, `model-${idx}`)}
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                      >
                        {copiedSnippet === `model-${idx}` ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copier la réponse</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans">
                      {q.modelAnswer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
