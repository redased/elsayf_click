export const PRESET_PROFILES = {
  developer: {
    id: 'developer',
    name: 'Programmeur / Développeur Full-Stack & IA',
    badge: 'Tech & Code',
    icon: 'Terminal',
    template: 'modern-tech',
    color: '#7c3aed',
    font: 'sans',
    spacing: 'normal',
    data: {
      personal: {
        firstName: 'Sofiane',
        lastName: 'Mansouri',
        title: 'Développeur Full-Stack Python & React / Ingénieur IA',
        email: 'sofiane.mansouri@dev-mail.com',
        phone: '+213 550 00 00 00',
        city: 'Alger, Algérie',
        mobility: 'Télétravail & Hybride',
        website: 'https://sofiane-dev.tech',
        linkedin: 'linkedin.com/in/sofiane-mansouri',
        github: 'github.com/sofiane-code',
        avatar: '',
        summary: 'Ingénieur logiciel passionné avec 4+ ans d\'expérience dans la conception d\'applications web performantes et d\'architectures scalables avec Python, Django, Next.js et PostgreSQL. Spécialisé dans l\'intégration de modèles d\'IA (LLM, API Gemini/OpenAI) et l\'automatisation cloud.'
      },
      skills: [
        { name: 'Python / Django / FastAPI', level: 95, category: 'hard' },
        { name: 'JavaScript / TypeScript / Next.js', level: 90, category: 'hard' },
        { name: 'PostgreSQL / Prisma / Redis', level: 85, category: 'hard' },
        { name: 'Docker / CI-CD / Linux', level: 80, category: 'hard' },
        { name: 'Intégration API LLM (OpenAI, Gemini)', level: 88, category: 'hard' },
        { name: 'Tailwind CSS / UI Responsive', level: 92, category: 'hard' },
      ],
      softSkills: [
        'Résolution de problèmes complexes',
        'Veille technologique & Autonomie',
        'Travail d\'équipe en méthode Agile/Scrum',
        'Clean Code & Refactoring',
        'Communication technique'
      ],
      tools: [
        'Git / GitHub',
        'Docker',
        'VS Code',
        'Postman',
        'Linux / Bash',
        'Vercel'
      ],
      languages: [
        { name: 'Français', level: 'Bilingue / C2' },
        { name: 'Arabe', level: 'Langue maternelle' },
        { name: 'Anglais', level: 'Courant professionnel / C1' }
      ],
      experiences: [
        {
          id: 'exp-1',
          position: 'Lead Développeur Full-Stack',
          company: 'Nexus Digital Solutions',
          city: 'Alger',
          startDate: '2023-01',
          endDate: '',
          current: true,
          description: '• Conception et déploiement d\'une plateforme SaaS B2B sous Next.js 15, Node.js et PostgreSQL supportant 50k requêtes/jour.\n• Mise en place de pipelines de traitement automatique de documents intégrant l\'API Gemini et extraction OCR.\n• Optimisation du temps de chargement de 42% via mise en cache Redis et refactorisation des requêtes DB.\n• Encadrement d\'une équipe de 4 développeurs juniors et animation des sprints Scrum.'
        },
        {
          id: 'exp-2',
          position: 'Développeur Backend Python',
          company: 'DataFlow Systems',
          city: 'Oran',
          startDate: '2021-03',
          endDate: '2022-12',
          current: false,
          description: '• Développement d\'APIs REST performantes avec Django REST Framework et FastAPI.\n• Automatisation de scripts de scraping et de nettoyage de données de masse.\n• Configuration des conteneurs Docker et des workflows GitHub Actions pour l\'intégration continue.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Master en Ingénierie des Systèmes d\'Information',
          school: 'Université des Sciences et de la Technologie Houari Boumediene (USTHB)',
          city: 'Alger',
          year: '2021',
          description: 'Spécialisation Systèmes Distribués et Intelligence Artificielle. Major de promotion.'
        },
        {
          id: 'edu-2',
          degree: 'Certification Avancée Python & IA',
          school: 'Académie Elsayf E-Learning',
          city: 'En ligne',
          year: '2023',
          description: 'Maîtrise du Machine Learning, automatisation de scripts et architectures cloud.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Elsayf AI Assistant & Code Sandbox',
          description: 'Environnement de programmation Python dans le navigateur avec autocomplétion intelligente et exécution sécurisée de scripts.',
          technologies: 'Next.js, Tailwind, Docker, WebSocket, Monaco Editor',
          link: 'https://elsayf.click'
        },
        {
          id: 'proj-2',
          title: 'JobMatch AI - Sourcing Automatique',
          description: 'Outil d\'analyse sémantique et de mise en correspondance de profils CV et fiches de poste via vecteurs d\'embeddings.',
          technologies: 'Python, FastAPI, LangChain, PostgreSQL pgvector',
          link: 'https://github.com/sofiane-code/jobmatch-ai'
        }
      ],
      certifications: [
        'AWS Certified Solutions Architect - Associate (2024)',
        'Professional Scrum Master I (PSM I)'
      ],
      interests: [
        'Open Source',
        'Échecs',
        'Robotique & IoT',
        'Randonnée'
      ]
    }
  },

  rh: {
    id: 'rh',
    name: 'Responsable RH / Gestion des Talents & Recrutement',
    badge: 'Management & RH',
    icon: 'Users',
    template: 'executive-rh',
    color: '#1e40af',
    font: 'serif',
    spacing: 'normal',
    data: {
      personal: {
        firstName: 'Amina',
        lastName: 'Belkacem',
        title: 'Responsable Ressources Humaines & Acquisition de Talents',
        email: 'amina.belkacem@rh-conseil.com',
        phone: '+213 660 00 00 00',
        city: 'Alger, Algérie',
        mobility: 'Déplacements possibles / Présentiel & Hybride',
        website: 'https://linkedin.com/in/amina-belkacem-rh',
        linkedin: 'linkedin.com/in/amina-belkacem-rh',
        github: '',
        avatar: '',
        summary: 'Professionnelle des Ressources Humaines avec 6+ ans d\'expérience dans le recrutement stratégique, le développement des compétences et la gestion administrative du personnel. Reconnue pour l\'optimisation des processus d\'onboarding, la marque employeur et la mise en place d\'outils SIRH modernes réduisant le turnover de 25%.'
      },
      skills: [
        { name: 'Sourcing & Recrutement stratégique', level: 95, category: 'hard' },
        { name: 'Droit du travail & Gestion des contrats', level: 90, category: 'hard' },
        { name: 'Gestion de la paie & Déclarations sociales', level: 85, category: 'hard' },
        { name: 'Déploiement SIRH & Digitalisation RH', level: 88, category: 'hard' },
        { name: 'Évaluations annuelles & GPEC', level: 92, category: 'hard' },
        { name: 'Animation de formations internes', level: 85, category: 'hard' },
      ],
      softSkills: [
        'Écoute active & Négociation',
        'Gestion des conflits & Diplomatie',
        'Sens éthique & Confidentialité',
        'Organisation & Rigueur',
        'Leadership bienveillant'
      ],
      tools: [
        'LinkedIn Recruiter',
        'Workday / Sage Paie',
        'Excel Avancé (TCD, formules)',
        'Notion RH & Slack',
        'Google Workspace',
        'ATS (Greenhouse, Lever)'
      ],
      languages: [
        { name: 'Français', level: 'Bilingue / C2' },
        { name: 'Arabe', level: 'Langue maternelle' },
        { name: 'Anglais', level: 'Professionnel opérationnel / B2' }
      ],
      experiences: [
        {
          id: 'exp-1',
          position: 'Responsable Ressources Humaines',
          company: 'Groupe Horizon Médias & Tech',
          city: 'Alger',
          startDate: '2022-04',
          endDate: '',
          current: true,
          description: '• Pilotage de la politique RH pour un effectif de 180 collaborateurs multisites.\n• Recrutement réussi de plus de 45 profils cadres, techniques et administratifs en 18 mois.\n• Refonte complète du processus d\'intégration (Onboarding) avec taux de satisfaction de 94%.\n• Supervision de la paie mensuelle, des déclarations CNAS et du respect du cadre réglementaire.'
        },
        {
          id: 'exp-2',
          position: 'Chargée de Recrutement & Développement RH',
          company: 'Cabinet ProTalent Consulting',
          city: 'Alger',
          startDate: '2019-09',
          endDate: '2022-03',
          current: false,
          description: '• Prise en charge des missions de chasse de têtes et sourcing de talents pour des clients internationaux.\n• Conduite des entretiens de recrutement structurés et passation de tests de personnalité.\n• Élaboration des plans de formation et suivi des budgets d\'apprentissage.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Master 2 en Management des Ressources Humaines',
          school: 'École Supérieure de Commerce (ESC)',
          city: 'Alger',
          year: '2019',
          description: 'Mémoire sur l\'impact de la digitalisation sur la rétention des talents dans les entreprises maghrébines.'
        },
        {
          id: 'edu-2',
          degree: 'Licence en Sciences de Gestion',
          school: 'Université d\'Alger 3',
          city: 'Alger',
          year: '2017',
          description: 'Option Administration et Gestion du Personnel.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Guide d\'Accueil & Livret Numérique Collaborateur',
          description: 'Création d\'un portail interactif rassemblant les valeurs d\'entreprise, avantages sociaux, organigramme et processus administratifs.',
          technologies: 'Notion, Canva, Intranet',
          link: ''
        },
        {
          id: 'proj-2',
          title: 'Baromètre Climat Social & QVT',
          description: 'Mise en place d\'une enquête trimestrielle anonyme pour mesurer le bien-être au travail et plan d\'actions correctives.',
          technologies: 'Google Forms, Excel Analytics',
          link: ''
        }
      ],
      certifications: [
        'Certification Droit du Travail & Contentieux Social',
        'Certification Praticien MBTI / Process Com'
      ],
      interests: [
        'Psychologie du travail',
        'Littérature',
        'Yoga & Méditation',
        'Bénévolat associatif'
      ]
    }
  },

  designer: {
    id: 'designer',
    name: 'UI/UX Designer & Directeur Artistique',
    badge: 'Design & Créatif',
    icon: 'Palette',
    template: 'creative-designer',
    color: '#e11d48',
    font: 'sans',
    spacing: 'normal',
    data: {
      personal: {
        firstName: 'Yasmine',
        lastName: 'Haddad',
        title: 'Lead UI/UX Designer & Product Designer',
        email: 'yasmine.design@creativestudio.dz',
        phone: '+213 770 00 00 00',
        city: 'Constantine, Algérie',
        mobility: 'Full Remote ou Déplacements ponctuels',
        website: 'https://yasmine-ux.design',
        linkedin: 'linkedin.com/in/yasmine-haddad-design',
        github: 'dribbble.com/yasmine-ui',
        avatar: '',
        summary: 'Product Designer avec 5 ans d\'expérience dans la création d\'expériences numériques centrées sur l\'utilisateur, combinant esthétique raffinée, recherche UX rigoureuse et Design Systems cohérents. Passionnée par la transformation de problématiques complexes en interfaces intuitives et captivantes.'
      },
      skills: [
        { name: 'UI Design & Visual Craft', level: 96, category: 'hard' },
        { name: 'UX Research & Wireframing', level: 90, category: 'hard' },
        { name: 'Design Systems & Tokens', level: 94, category: 'hard' },
        { name: 'Prototypage interactif & Micro-animations', level: 88, category: 'hard' },
        { name: 'Tests Utilisateurs & Parcours Clients', level: 85, category: 'hard' },
        { name: 'Bases HTML5 / CSS3 / Tailwind', level: 75, category: 'hard' },
      ],
      softSkills: [
        'Empathie utilisateur & Curiosité',
        'Sens du détail et de la typographie',
        'Collaboration étroite avec développeurs',
        'Présentation & Storytelling',
        'Adaptabilité aux feedbacks'
      ],
      tools: [
        'Figma / FigJam',
        'Adobe Illustrator & Photoshop',
        'Principle / ProtoPie',
        'Miro',
        'Maze (User Testing)',
        'Webflow'
      ],
      languages: [
        { name: 'Français', level: 'Bilingue / C2' },
        { name: 'Arabe', level: 'Langue maternelle' },
        { name: 'Anglais', level: 'Courant / C1' }
      ],
      experiences: [
        {
          id: 'exp-1',
          position: 'Senior UI/UX Designer',
          company: 'Studio Pixel & Co',
          city: 'Alger / Remote',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description: '• Refonte globale de l\'expérience utilisateur pour 3 applications mobiles Fintech (iOS/Android) totalisant 200k utilisateurs actifs.\n• Création et maintenance d\'un Design System complet sur Figma adopté par 12 designers et 25 développeurs.\n• Conduite de 30+ tests d\'utilisabilité utilisateurs permettant d\'augmenter le taux de conversion de +34%.'
        },
        {
          id: 'exp-2',
          position: 'UI Designer & Graphiste',
          company: 'Agence Digitale Creativa',
          city: 'Constantine',
          startDate: '2020-02',
          endDate: '2021-12',
          current: false,
          description: '• Création d\'identités visuelles, chartes graphiques et interfaces de sites web e-commerce.\n• Collaboration étroite avec les équipes de développement frontend pour assurer la fidélité pixel-perfect.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Diplôme Supérieur d\'Arts Appliqués & Design Numérique',
          school: 'École Supérieure des Beaux-Arts',
          city: 'Alger',
          year: '2020',
          description: 'Major de promotion. Projet de fin d\'études primé : Application mobile d\'accessibilité culturelle.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'PaySafe Mobile Wallet',
          description: 'Application de paiement sans contact et gestion de budget personnel avec micro-interactions et dark mode soigné.',
          technologies: 'Figma, ProtoPie, User Testing Maze',
          link: 'https://behance.net/yasmine-haddad/paysafe'
        },
        {
          id: 'proj-2',
          title: 'Elsayf Design System',
          description: 'Kit UI complet pour plateforme d\'apprentissage moderne (120+ composants, typographies, palettes sombres).',
          technologies: 'Figma Tokens, Storybook',
          link: 'https://figma.com/@yasmine'
        }
      ],
      certifications: [
        'Google UX Design Professional Certificate',
        'Nielsen Norman Group UX Master Certification'
      ],
      interests: [
        'Photographie urbaine',
        'Typographie contemporaine',
        'Céramique',
        'Voyages'
      ]
    }
  },

  data_analyst: {
    id: 'data_analyst',
    name: 'Data Analyst & Business Intelligence (Python / R / Power BI)',
    badge: 'Data & Statistiques',
    icon: 'BarChart3',
    template: 'dual-column',
    color: '#059669',
    font: 'sans',
    spacing: 'compact',
    data: {
      personal: {
        firstName: 'Karim',
        lastName: 'Zitouni',
        title: 'Data Analyst & Spécialiste Business Intelligence',
        email: 'karim.zitouni@datalab.dz',
        phone: '+213 550 00 00 00',
        city: 'Oran, Algérie',
        mobility: 'Hybride / Télétravail',
        website: 'https://github.com/karim-data',
        linkedin: 'linkedin.com/in/karim-zitouni-data',
        github: 'github.com/karim-data',
        avatar: '',
        summary: 'Analyste de données rigoureux avec 3+ ans d\'expérience dans l\'extraction, la modélisation statistique et la visualisation de données stratégiques. Maîtrise avancée de Python, SQL, R Statistiques et Power BI pour transformer les données brutes en leviers de décision pour la direction.'
      },
      skills: [
        { name: 'Python (Pandas, NumPy, Scikit-Learn)', level: 92, category: 'hard' },
        { name: 'SQL & Requêtes complexes (PostgreSQL, BigQuery)', level: 94, category: 'hard' },
        { name: 'Power BI (DAX & Power Query)', level: 90, category: 'hard' },
        { name: 'R Statistiques & ggplot2', level: 85, category: 'hard' },
        { name: 'Modélisation prédictive & Séries temporelles', level: 80, category: 'hard' },
        { name: 'Excel Avancé & VBA', level: 95, category: 'hard' },
      ],
      softSkills: [
        'Esprit analytique & Synthèse',
        'Vulgarisation de données complexes',
        'Rigueur méthodologique',
        'Orientation résultats business',
        'Proactivité'
      ],
      tools: [
        'Power BI Desktop / Service',
        'Jupyter Notebook',
        'Tableau Software',
        'DBeaver / pgAdmin',
        'Git',
        'Excel Avancé'
      ],
      languages: [
        { name: 'Français', level: 'Bilingue / C2' },
        { name: 'Arabe', level: 'Langue maternelle' },
        { name: 'Anglais', level: 'Professionnel opérationnel / B2' }
      ],
      experiences: [
        {
          id: 'exp-1',
          position: 'Data Analyst Senior',
          company: 'Logistics & Supply DZ',
          city: 'Oran',
          startDate: '2023-03',
          endDate: '',
          current: true,
          description: '• Construction d\'une suite de 15 dashboards Power BI en direct pour le suivi des expéditions et des stocks (+15M DZD d\'économies annuelles).\n• Automatisation des pipelines ETL avec Python réduisant de 18 heures hebdomadaires le traitement manuel des reportings.\n• Modélisation des prévisions de demande par séries temporelles ARIMA avec une fiabilité de 91%.'
        },
        {
          id: 'exp-2',
          position: 'Analyste Statistiques & Reporting',
          company: 'Fintech Solutions Maghreb',
          city: 'Alger',
          startDate: '2021-06',
          endDate: '2023-02',
          current: false,
          description: '• Analyse des comportements clients et détection des anomalies de transactions par requêtes SQL.\n• Présentation mensuelle des KPIs de conversion et de rétention au comité de direction.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Master en Économétrie & Statistiques Appliquées',
          school: 'Université d\'Oran 1',
          city: 'Oran',
          year: '2021',
          description: 'Mention Très Bien. Spécialisation en Analyse Multivariée et Big Data.'
        },
        {
          id: 'edu-2',
          degree: 'Certification R Statistics & Data Science',
          school: 'Plateforme Elsayf',
          city: 'En ligne',
          year: '2022',
          description: 'Modélisation statistique, tests d\'hypothèses et data visualisation.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Algérie Macro-Economic & Inflation Dashboard',
          description: 'Tableau de bord interactif analysant les tendances d\'inflation et de pouvoir d\'achat sur 10 ans.',
          technologies: 'R Shiny, ggplot2, API Banque Mondiale',
          link: 'https://github.com/karim-data/algeria-macro-dashboard'
        }
      ],
      certifications: [
        'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
        'Google Data Analytics Professional Certificate'
      ],
      interests: [
        'Économétrie',
        'Course à pied',
        'Podcasts tech',
        'Échecs'
      ]
    }
  },

  business_finance: {
    id: 'business_finance',
    name: 'Responsable Finance / Contrôle de Gestion & Excel Pro',
    badge: 'Finance & Audit',
    icon: 'Briefcase',
    template: 'emerald',
    color: '#0d9488',
    font: 'serif',
    spacing: 'normal',
    data: {
      personal: {
        firstName: 'Farid',
        lastName: 'Benali',
        title: 'Contrôleur de Gestion & Spécialiste Automatisation Excel/VBA',
        email: 'farid.benali@audit-finance.dz',
        phone: '+213 560 00 00 00',
        city: 'Alger, Algérie',
        mobility: 'Disponible immédiatement',
        website: 'https://linkedin.com/in/farid-benali-finance',
        linkedin: 'linkedin.com/in/farid-benali-finance',
        github: '',
        avatar: '',
        summary: 'Expert en Contrôle de Gestion et Finance d\'Entreprise avec 7 ans de pratique en audit, modélisation financière et reporting de performance. Spécialiste de l\'automatisation de processus comptables sous Excel/VBA et Python, ayant permis des gains de productivité de 30% pour les clôtures mensuelles.'
      },
      skills: [
        { name: 'Élaboration & Suivi Budgétaire', level: 95, category: 'hard' },
        { name: 'Modélisation Financière & Business Plans', level: 92, category: 'hard' },
        { name: 'Excel Expert (VBA, Power Query, Macros)', level: 98, category: 'hard' },
        { name: 'Analyse des Coûts & Rentabilité (Direct Costing)', level: 90, category: 'hard' },
        { name: 'Audit Interne & Conformité SCF / IFRS', level: 88, category: 'hard' },
        { name: 'ERP & Outils Comptables (PC Compta, SAP)', level: 85, category: 'hard' },
      ],
      softSkills: [
        'Rigueur mathématique & Précision',
        'Capacité de négociation avec opérationnels',
        'Confidentialité absolue',
        'Esprit d\'initiative',
        'Résistance au stress'
      ],
      tools: [
        'Microsoft Excel (Niveau Expert)',
        'VBA & Macros',
        'Power Query & Power Pivot',
        'PC Compta / PC Paie',
        'SAP FI-CO',
        'Power BI'
      ],
      languages: [
        { name: 'Français', level: 'Bilingue / C2' },
        { name: 'Arabe', level: 'Langue maternelle' },
        { name: 'Anglais', level: 'Professionnel financier / B2' }
      ],
      experiences: [
        {
          id: 'exp-1',
          position: 'Responsable Contrôle de Gestion',
          company: 'Industrie Agro-Alimentaire Moderne',
          city: 'Blida / Alger',
          startDate: '2021-08',
          endDate: '',
          current: true,
          description: '• Pilotage de la procédure budgétaire annuelle (CA 4,2 Milliards DZD) et suivi des écarts mensuels.\n• Conception d\'un modèle financier automatisé sous Excel/Power Query réduisant les délais de clôture de 5 jours.\n• Calcul des coûts de revient industriels par gamme de produits et proposition de mesures d\'économies ayant généré 8% de marge brute supplémentaire.'
        },
        {
          id: 'exp-2',
          position: 'Auditeur Financier Junior',
          company: 'Cabinet d\'Audit & Conseil Fiduciaire',
          city: 'Alger',
          startDate: '2018-10',
          endDate: '2021-07',
          current: false,
          description: '• Missions de commissariat aux comptes et audit légal des états financiers pour des PME et grands comptes.\n• Vérification de la régularité des écritures comptables et inventaires physiques de fin d\'exercice.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Master 2 en Comptabilité, Contrôle, Audit (CCA)',
          school: 'École des Hautes Études Commerciales (EHEC)',
          city: 'Alger',
          year: '2018',
          description: 'Mémoire sur l\'automatisation du tableau de bord de gestion dans les industries de transformation.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Matrice Automatisée de Clôture Comptable & Déclarations',
          description: 'Outil Excel/VBA clé-en-main générant le bilan, compte de résultat et tableaux annexes du Système Comptable Financier (SCF).',
          technologies: 'Excel VBA, Macros, Formules complexes',
          link: ''
        }
      ],
      certifications: [
        'Certification Excel & Comptabilité Avancée Elsayf (2024)',
        'Diplôme d\'Expertise Comptable - Niveau Préliminaire'
      ],
      interests: [
        'Marchés financiers',
        'Histoire économique',
        'Tennis',
        'Lecture'
      ]
    }
  }
};
