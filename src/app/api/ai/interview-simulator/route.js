import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const INTERVIEW_QUESTIONS = {
  'data-analyst': [
    {
      id: 'da-1',
      title: 'Différence entre CALCULATE et RELATED en DAX (Power BI)',
      level: 'Intermédiaire',
      context: 'Un directeur financier vous demande de recalculer la marge brute d’une catégorie de produits en ignorant les filtres de date actifs.',
      question: 'Expliquez concrètement la différence entre CALCULATE et RELATED dans Power BI. Comment CALCULATE modifie-t-il le contexte de filtre (Filter Context) ?',
      keywords: ['contexte de filtre', 'filter context', 'transition de contexte', 'relations', 'all', 'mesure'],
      recommendedCourse: {
        title: 'Power BI & Business Intelligence',
        slug: 'power-bi-business-intelligence-data-analytics',
      },
      modelAnswer: 'CALCULATE est la fonction reine en DAX car elle permet de modifier le contexte d\'évaluation des filtres (Filter Context) avant d\'exécuter l\'expression. Elle peut ajouter, supprimer (avec ALL/REMOVEFILTERS) ou écraser des filtres. De plus, lorsqu\'elle est appelée dans un contexte de ligne, elle effectue une transition de contexte (transformant la ligne courante en filtre équivalent). RELATED, en revanche, ne modifie aucun contexte : elle navigue simplement le long d\'une relation existante (plusieurs-à-un) pour récupérer la valeur d\'une colonne dans une table dimensionnelle liée.',
    },
    {
      id: 'da-2',
      title: 'Gestion des valeurs manquantes et valeurs aberrantes (Outliers) en Python',
      level: 'Intermédiaire',
      context: 'Vous recevez un jeu de données de 500 000 transactions bancaires pour bâtir un modèle de détection d\'anomalies.',
      question: 'Quelles sont les méthodes recommandées pour détecter et traiter les valeurs manquantes et les outliers dans Pandas avant une analyse ? Dans quels cas ne faut-il JAMAIS supprimer brutalement les lignes ?',
      keywords: ['pandas', 'dropna', 'fillna', 'imputation', 'médiane', 'iqr', 'z-score', 'distribution'],
      recommendedCourse: {
        title: 'Analyse de Données Qualitatives & Quantitatives',
        slug: 'analyse-donnees-quali-quanti',
      },
      modelAnswer: 'Pour les valeurs manquantes, on analyse d\'abord le mécanisme (MCAR, MAR, MNAR). Si moins de 2% et aléatoire, un dropna peut convenir. Sinon, l\'imputation par médiane (si données asymétriques) ou par modèle (KNN/MICE) est préférable. Il ne faut JAMAIS supprimer brutalement si les valeurs manquantes portent une signification métier (ex: absence de sinistre). Pour les outliers, on utilise l\'écart interquartile (IQR = Q3 - Q1) avec bornes [Q1 - 1.5*IQR, Q3 + 1.5*IQR] ou le Z-Score (> 3). En détection de fraude, les outliers sont précisément les anomalies recherchées, donc les supprimer détruirait l\'essence même du projet.',
    },
    {
      id: 'da-3',
      title: 'Schéma en Étoile (Star Schema) vs Schéma en Flocon (Snowflake)',
      level: 'Junior / Intermédiaire',
      context: 'Conception d\'un Data Warehouse pour une chaîne de distribution de 40 magasins.',
      question: 'Pourquoi privilégie-t-on le schéma en étoile plutôt que le flocon dans Power BI et le Data Warehousing moderne ? Quels sont les impacts sur les performances du moteur VertiPaq ?',
      keywords: ['table de faits', 'dimensions', 'dénormalisation', 'jointures', 'vertipaq', 'compression'],
      recommendedCourse: {
        title: 'Power BI & Business Intelligence',
        slug: 'power-bi-business-intelligence-data-analytics',
      },
      modelAnswer: 'Le schéma en étoile dénormalise les tables de dimensions autour d\'une table de faits centrale. On le privilégie car il minimise le nombre de jointures (1 seule relation entre chaque dimension et la table de faits), ce qui rend le modèle beaucoup plus intuitif pour les utilisateurs métiers et ultra-performant pour le moteur tabulaire VertiPaq. Le moteur compresse efficacement les colonnes via le Run-Length Encoding et Dictionary Encoding. Le schéma en flocon normalise les dimensions, ce qui multiplie les jointures chaînées et complexifie l\'écriture des mesures DAX sans gain significatif de stockage.',
    },
  ],

  'cybersecurity-pentest': [
    {
      id: 'sec-1',
      title: 'Vulnérabilité SQL Injection Aveugle (Blind SQLi)',
      level: 'Intermédiaire',
      context: 'Lors d\'un audit de sécurité sur une plateforme d\'authentification qui ne renvoie aucun message d\'erreur SQL verbeux.',
      question: 'Qu\'est-ce qu\'une Blind SQL Injection (Time-based et Boolean-based) et comment un attaquant l\'exploite-t-il pour exfiltrer une base de données ? Comment la corriger de façon définitive ?',
      keywords: ['requêtes préparées', 'parameterized queries', 'sleep', 'boolean', 'time-based', 'inférence', 'caractère par caractère'],
      recommendedCourse: {
        title: 'Ethical Hacking & Sécurité Web / Pentest',
        slug: 'ethical-hacking-securite-web-pentest',
      },
      modelAnswer: 'Une Blind SQLi se produit lorsque l\'application est vulnérable à l\'injection mais n\'affiche aucune erreur ni donnée de la DB dans sa réponse HTTP. En Boolean-based, l\'attaquant pose des conditions vrai/faux (ex: AND SUBSTRING(password,1,1)=\'a\') et observe des différences infimes dans la page (code HTTP ou contenu). En Time-based, il injecte des fonctions de délai (ex: pg_sleep(5), SLEEP(5)) : si la réponse met 5s, la condition est vraie. L\'exfiltration se fait bit par bit ou caractère par caractère. La seule parade définitive est l\'usage universel de requêtes préparées avec paramètres typés (Prepared Statements / ORM sécurisé), complétées par le principe de moindre privilège sur l\'utilisateur SQL.',
    },
    {
      id: 'sec-2',
      title: 'Attaque CSRF vs XSS et protection par Cookies SameSite',
      level: 'Intermédiaire',
      context: 'Une fintech souhaite moderniser la gestion de session de son interface bancaire.',
      question: 'Distinguez précisément XSS (Cross-Site Scripting) et CSRF (Cross-Site Request Forgery). Quels attributs de cookies et headers HTTP (CSP, SameSite) doivent être configurés ?',
      keywords: ['samesite', 'httponly', 'secure', 'content-security-policy', 'tokens csrf', 'session hijacking'],
      recommendedCourse: {
        title: 'Cybersécurité : Protection & Défense des Systèmes',
        slug: 'cybersecurite-protection-systemes-defensive',
      },
      modelAnswer: 'XSS consiste à injecter et exécuter du script malveillant (JavaScript) dans le navigateur de la victime dans le contexte de son domaine légitime (vol de localStorage, manipulation du DOM). CSRF, en revanche, force le navigateur de la victime à envoyer une requête HTTP forgée vers une application où elle est déjà authentifiée, en exploitant l\'envoi automatique des cookies par le navigateur. Pour contrer XSS : échappement des sorties, Content-Security-Policy (CSP) stricte et cookies de session avec le flag HttpOnly (qui interdit l\'accès JS). Pour contrer CSRF : jetons anti-CSRF aléatoires (synchronizer token), en-tête SameSite=Strict ou Lax, et vérification des headers Origin/Referer.',
    },
  ],

  'automation-ia': [
    {
      id: 'ia-1',
      title: 'Technique RAG (Retrieval-Augmented Generation) vs Fine-Tuning',
      level: 'Intermédiaire / Senior',
      context: 'Une PME veut connecter un LLM à sa base de connaissances interne de 10 000 documents PDF comptables et juridiques.',
      question: 'Comparez le RAG et le Fine-Tuning pour intégrer des données d\'entreprise propriétaires dans un LLM. Quelle approche recommandez-vous et pourquoi ?',
      keywords: ['embeddings', 'base vectorielle', 'vector db', 'hallucinations', 'coût', 'mise à jour', 'chunking', 'fine-tuning'],
      recommendedCourse: {
        title: 'Google Antigravity Mastery : Bots & Automatisation',
        slug: 'google-antigravity-mastery',
      },
      modelAnswer: 'Pour des documents internes d\'entreprise, le RAG est très largement supérieur au Fine-Tuning. Le RAG indexe les textes découpés (chunking) via des embeddings dans une base vectorielle (Pinecone, Chroma, pgvector). À chaque question, les passages pertinents sont récupérés et insérés dans le prompt contextuel du LLM. Avantages majeurs : mise à jour instantanée sans ré-entraînement, citation exacte des sources, réduction drastique des hallucinations, et coûts divisés par 10. Le Fine-Tuning ne sert pas à injecter des faits ou de la mémoire documentaire (les LLMs oublient ou hallucinent les faits fins), mais plutôt à ajuster le style, le format de sortie (ex: JSON strict) ou le comportement linguistique spécialisé.',
    },
    {
      id: 'ia-2',
      title: 'Optimisation de process métier : Python vs N8N / Zapier',
      level: 'Junior / Intermédiaire',
      context: 'Automatisation de l\'extraction quotidienne de 200 factures PDF reçues par email et export vers un fichier Excel comptable.',
      question: 'Comment structureriez-vous ce pipeline d\'automatisation ? Quand privilégier un script Python autonome (avec PyPDF/Pandas) plutôt qu\'un workflow No-code (N8N) ?',
      keywords: ['n8n', 'python', 'pdfplumber', 'openpyxl', 'cron', 'webhooks', 'maintenance', 'robustesse'],
      recommendedCourse: {
        title: 'Automatisation Avancée Excel & Comptabilité',
        slug: 'automatisation-excel-comptabilite-detaillee',
      },
      modelAnswer: 'Le pipeline idéal comprend 4 étapes : 1) Déclencheur (Trigger IMAP/Gmail sur nouveaux emails avec pièce jointe), 2) Extraction & OCR (pdfplumber ou modèle vision IA pour extraire date, fournisseur, montants HT/TTC), 3) Validation & Typage des données (pydantic ou regex pour vérifier que HT + TVA = TTC), 4) Chargement dans le classeur Excel (openpyxl/pandas). N8N est idéal pour orchestrer la partie connecteurs (IMAP, Google Drive, notifications Telegram) sans coder l\'authentification. Python est indispensable dès qu\'il s\'agit de parsing complexe, regex conditionnelles sur des formats de factures disparates, ou gros volumes.',
    },
  ],
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get('track') || 'data-analyst';

  const questions = INTERVIEW_QUESTIONS[track] || INTERVIEW_QUESTIONS['data-analyst'];
  return NextResponse.json({
    track,
    total: questions.length,
    questions: questions.map(({ modelAnswer, keywords, ...q }) => q),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { track = 'data-analyst', questionId, answer } = body;

    if (!answer || answer.trim().length < 15) {
      return NextResponse.json(
        { error: 'Veuillez fournir une réponse d\'au moins quelques phrases pour être évalué.' },
        { status: 400 }
      );
    }

    const trackQuestions = INTERVIEW_QUESTIONS[track] || INTERVIEW_QUESTIONS['data-analyst'];
    const questionObj = trackQuestions.find((q) => q.id === questionId) || trackQuestions[0];

    // Try OpenAI evaluation if configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey && openaiApiKey !== 'change_me') {
      try {
        const client = new OpenAI({ apiKey: openaiApiKey });
        const prompt = `Tu es un Lead Tech et Recruteur Senior chevronné dans le domaine : ${track}.
Tu fais passer un entretien d'embauche technique à un candidat.

Question posée :
"${questionObj.question}"

Mise en contexte :
"${questionObj.context}"

Réponse du candidat :
"${answer}"

Évalue la réponse du candidat et réponds STRICTEMENT au format JSON avec cette structure :
{
  "score": <nombre entier entre 0 et 20>,
  "rating": "<Excellent | Très bon | Prometteur | Insuffisant>",
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "improvements": ["<axe d'amélioration 1>", "<axe d'amélioration 2>"],
  "verdict": "<Court commentaire du recruteur en 2 phrases>",
  "idealAnswer": "${questionObj.modelAnswer.replace(/"/g, '\\"')}"
}`;

        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        });

        const parsed = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json({
          evaluation: {
            ...parsed,
            idealAnswer: questionObj.modelAnswer,
            recommendedCourse: questionObj.recommendedCourse,
          },
        });
      } catch (aiErr) {
        console.warn('AI evaluation error, fallback to algorithmic heuristic:', aiErr.message);
      }
    }

    // Algorithmic heuristic evaluation based on keyword coverage & answer length
    const lowerAnswer = answer.toLowerCase();
    const matchedKeywords = (questionObj.keywords || []).filter((kw) =>
      lowerAnswer.includes(kw.toLowerCase())
    );

    const keywordRatio = matchedKeywords.length / Math.max(1, questionObj.keywords.length);
    const wordCount = answer.trim().split(/\s+/).length;

    let baseScore = 8;
    if (wordCount > 40) baseScore += 3;
    if (wordCount > 90) baseScore += 2;
    baseScore += Math.round(keywordRatio * 7);
    baseScore = Math.min(19, Math.max(7, baseScore));

    let rating = 'Prometteur';
    if (baseScore >= 16) rating = 'Excellent';
    else if (baseScore >= 13) rating = 'Très bon';
    else if (baseScore < 10) rating = 'À approfondir';

    const strengths = [];
    if (matchedKeywords.length > 0) {
      strengths.push(`Bonne maîtrise des notions clés : ${matchedKeywords.slice(0, 3).join(', ')}.`);
    }
    if (wordCount >= 50) {
      strengths.push('Explication détaillée et effort d\'argumentation technique structuré.');
    } else {
      strengths.push('Réponse synthétique et directe.');
    }

    const improvements = [];
    const missingKeywords = (questionObj.keywords || []).filter(
      (kw) => !lowerAnswer.includes(kw.toLowerCase())
    );
    if (missingKeywords.length > 0) {
      improvements.push(
        `N\'oubliez pas de mentionner les concepts : ${missingKeywords.slice(0, 3).join(', ')}.`
      );
    }
    if (wordCount < 40) {
      improvements.push('Illustrez votre réponse avec un exemple concret rencontré en entreprise.');
    }

    return NextResponse.json({
      evaluation: {
        score: baseScore,
        rating,
        strengths,
        improvements,
        verdict:
          baseScore >= 14
            ? 'Candidature solide ! Votre compréhension technique répond aux attentes des recruteurs.'
            : 'Des bases intéressantes, mais approfondissez la terminologie et les mécanismes sous-jacents.',
        idealAnswer: questionObj.modelAnswer,
        recommendedCourse: questionObj.recommendedCourse,
      },
    });
  } catch (error) {
    console.error('Interview evaluation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'évaluation de votre réponse.' },
      { status: 500 }
    );
  }
}
