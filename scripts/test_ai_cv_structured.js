const OpenAI = require('openai');
require('dotenv').config();

async function testPrompt() {
  const userQuery = "Je m'appelle Karim, 28 ans, dev Python et React 4 ans chez Nexus, master USTHB, maitrise Docker SQL, cherche poste Lead Dev. Remplis mon CV.";

  const systemPrompt = `Tu es un Expert Recruteur & Rédacteur de CV professionnel d'élite sur MyCV.click et la plateforme Elsayf.
Tu dois analyser le parcours fourni et répondre STRICTEMENT avec un objet JSON valide (aucun texte avant ou après le JSON).

SCHEMA DU JSON ATTENDU :
{
  "mode": "FILL_CV",
  "message": "Synthèse valorisante et professionnelle du profil (chaleureuse, percutante, rédigée avec style sans mots vagues comme 'probablement').",
  "strengths": [
    "Expertise technique solide en Python et React avec 4 ans chez Nexus",
    "Maîtrise éprouvée des architectures conteneurisées avec Docker et bases de données SQL",
    "Formation académique d'excellence : Master en Informatique à l'USTHB"
  ],
  "atsAdvice": [
    "Valoriser le titre ciblé 'Lead Développeur' pour capter l'algorithme des ATS",
    "Quantifier les succès techniques (% d'optimisation, volume d'utilisateurs, gestion de sprints)"
  ],
  "cv": {
    "personal": {
      "firstName": "Karim",
      "lastName": "",
      "title": "Lead Développeur Python & React / Cloud & SQL",
      "email": "",
      "phone": "",
      "city": "Alger",
      "mobility": "Télétravail & Hybride",
      "website": "",
      "linkedin": "",
      "github": "",
      "summary": "Développeur Full-Stack & Ingénieur Logiciel expérimenté avec 4 ans de pratique chez Nexus. Spécialiste de la conception d'architectures backend robustes en Python et d'interfaces réactives modernes avec React. Maîtrise de Docker et de l'optimisation SQL. Diplômé d'un Master USTHB, j'apporte rigueur technique et vision produit pour piloter des équipes en tant que Lead Développeur."
    },
    "skills": [
      { "name": "Python & Frameworks", "level": 95, "category": "hard" },
      { "name": "React & Next.js", "level": 90, "category": "hard" },
      { "name": "SQL & Bases de données", "level": 88, "category": "hard" },
      { "name": "Docker & Conteneurisation", "level": 85, "category": "hard" },
      { "name": "Architecture Logicielle & API REST", "level": 88, "category": "hard" }
    ],
    "softSkills": [
      "Leadership technique & Mentorat",
      "Méthodes Agiles / Scrum",
      "Résolution de problèmes complexes",
      "Communication technique & Vision produit"
    ],
    "tools": ["Docker", "Git / GitHub", "PostgreSQL / MySQL", "Linux / Bash", "VS Code"],
    "languages": [
      { "name": "Français", "level": "Bilingue / C2" },
      { "name": "Arabe", "level": "Langue maternelle" },
      { "name": "Anglais", "level": "Technique professionnel / C1" }
    ],
    "experiences": [
      {
        "id": "exp-1",
        "position": "Lead Développeur / Senior Full-Stack Python & React",
        "company": "Nexus Solutions",
        "city": "Alger",
        "startDate": "2021-01",
        "endDate": "",
        "current": true,
        "description": "• Pilotage technique et développement d'applications critiques sous Python et React supportant plusieurs milliers d'utilisateurs actifs.\\n• Mise en place d'environnements conteneurisés Docker et optimisation des requêtes SQL ayant amélioré les temps de réponse de 35%.\\n• Encadrement technique de développeurs juniors, revues de code et animation des rituels agiles.\\n• Collaboration étroite avec les équipes produit pour garantir la scalabilité et la sécurité des déploiements."
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "degree": "Master en Ingénierie Informatique",
        "school": "Université des Sciences et de la Technologie Houari Boumediene (USTHB)",
        "city": "Alger",
        "year": "2021",
        "description": "Spécialisation Systèmes Distribués, Génie Logiciel et Algorithmique Avancée."
      }
    ],
    "projects": []
  }
}

Important : Écris uniquement le JSON. Pas de markdown, pas de texte autour.`;

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const res = await client.chat.completions.create({
    model: 'deepseek/deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ],
    temperature: 0.3,
  });

  const content = res.choices[0]?.message?.content;
  console.log("RESPONSE RECEIVED LENGTH:", content?.length);
  console.log("FIRST 200 CHARS:", content?.substring(0, 200));

  let jsonMatch = content;
  if (content.includes("```")) {
    jsonMatch = content.replace(/```json/g, "").replace(/```/g, "").trim();
  }
  const parsed = JSON.parse(jsonMatch);
  console.log("PARSED SUCCESS! mode:", parsed.mode);
  console.log("Title:", parsed.cv?.personal?.title);
  console.log("Skills count:", parsed.cv?.skills?.length);
  console.log("Experiences count:", parsed.cv?.experiences?.length);
}

testPrompt().catch(console.error);
