const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔍 Recherche du cours Google Antigravity Mastery...');
        const course = await prisma.course.findUnique({
            where: { slug: 'google-antigravity-mastery' },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                        contents: { orderBy: { order: 'asc' } }
                    }
                }
            }
        });

        if (!course) {
            console.error('❌ Cours Google Antigravity non trouvé. Assurez-vous de l\'avoir seedé.');
            return;
        }

        console.log('✅ Cours trouvé ! Traitement des leçons...');

        // 1. Leçon 1 : Présentation de Google Antigravity et fonctionnement
        const lesson1 = course.lessons.find(l => l.order === 1);
        if (lesson1 && lesson1.contents.length > 0) {
            const contentBlock = lesson1.contents[0];
            let md = contentBlock.content;

            const targetCode = `### Le code Python généré :

\`\`\`python
import sys
import os

# 1. Définition du message de bienvenue
message = "Bonjour et bienvenue sur Google Antigravity !"
print(message)

# 2. Récupération des informations système
platforme = sys.platform
dossier_actuel = os.getcwd()

# 3. Affichage des détails
print("Système d'exploitation détecté : " + platforme)
print("Dossier de travail : " + dossier_actuel)
\`\`\``;

            const replacementWidget = `### Le code Python généré (Tuteur de code interactif !) :

\`\`\`codetutor
{
  "title": "Hello Antigravity - Premier pas en Python",
  "code": "import sys\\nimport os\\n\\nmessage = \\"Bonjour et bienvenue sur Google Antigravity !\\"\\nprint(message)\\n\\nplatforme = sys.platform\\ndossier_actuel = os.getcwd()\\n\\nprint(\\"OS : \\" + platforme)\\nprint(\\"Dossier : \\" + dossier_actuel)",
  "steps": [
    {
      "line": 1,
      "explanation": "On importe le module 'sys' pour récupérer des informations systèmes de la machine de l'étudiant.",
      "variables": {}
    },
    {
      "line": 2,
      "explanation": "On importe le module 'os' pour pouvoir manipuler des dossiers et chemins de fichiers.",
      "variables": {}
    },
    {
      "line": 4,
      "explanation": "On crée une variable nommée 'message' et on y stocke le texte d'accueil.",
      "variables": {
        "message": "Bonjour et bienvenue sur Google Antigravity !"
      }
    },
    {
      "line": 5,
      "explanation": "La fonction 'print' affiche la valeur de la variable 'message' dans la console.",
      "variables": {
        "message": "Bonjour et bienvenue sur Google Antigravity !"
      },
      "console": "Bonjour et bienvenue sur Google Antigravity !"
    },
    {
      "line": 7,
      "explanation": "On récupère le nom du système d'exploitation (ex: 'win32' ou 'darwin') et on le stocke dans 'platforme'.",
      "variables": {
        "message": "Bonjour et bienvenue sur Google Antigravity !",
        "platforme": "win32"
      }
    },
    {
      "line": 8,
      "explanation": "On récupère le dossier actuel avec os.getcwd() et on le stocke dans 'dossier_actuel'.",
      "variables": {
        "message": "Bonjour et bienvenue sur Google Antigravity !",
        "platforme": "win32",
        "dossier_actuel": "C:\\\\Users\\\\reda\\\\Desktop\\\\elsayf_click"
      }
    },
    {
      "line": 10,
      "explanation": "On affiche le système d'exploitation dans la console.",
      "variables": {
        "message": "Bonjour et bienvenue sur Google Antigravity !",
        "platforme": "win32",
        "dossier_actuel": "C:\\\\Users\\\\reda\\\\Desktop\\\\elsayf_click"
      },
      "console": "Bonjour et bienvenue sur Google Antigravity !\\nOS : win32"
    },
    {
      "line": 11,
      "explanation": "On affiche le dossier de travail courant dans la console.",
      "variables": {
        "message": "Bonjour et bienvenue sur Google Antigravity !",
        "platforme": "win32",
        "dossier_actuel": "C:\\\\Users\\\\reda\\\\Desktop\\\\elsayf_click"
      },
      "console": "Bonjour et bienvenue sur Google Antigravity !\\nOS : win32\\nDossier : C:\\\\Users\\\\reda\\\\Desktop\\\\elsayf_click"
    }
  ]
}
\`\`\``;

            if (md.includes(targetCode)) {
                md = md.replace(targetCode, replacementWidget);
                await prisma.courseContent.update({
                    where: { id: contentBlock.id },
                    data: { content: md }
                });
                console.log('✅ Leçon 1 mise à jour avec le Python Code Tutor !');
            } else {
                console.log('⚠️ Leçon 1 : Target code introuvable ou déjà modifié.');
            }
        }

        // 2. Leçon 3 : Structure & Design Premium (HTML/CSS)
        const lesson3 = course.lessons.find(l => l.order === 3);
        if (lesson3 && lesson3.contents.length > 0) {
            const contentBlock = lesson3.contents[0];
            let md = contentBlock.content;

            const targetSection = `## CSS Moderne : HSL, Gradients et Flexbox/Grid`;

            const replacementWidget = `## Visualisation 3D de l'espace couleur HSL (Interactif) :

\`\`\`threed
{
  "title": "Représentation 3D de la palette de couleurs HSL",
  "points": [
    {"x": 0.8, "y": 0.1, "z": 0.1, "color": "#f87171", "label": "Teintes Rouges (Accent)"},
    {"x": 0.1, "y": 0.8, "z": 0.1, "color": "#4ade80", "label": "Teintes Vertes (Succès)"},
    {"x": 0.1, "y": 0.1, "z": 0.8, "color": "#60a5fa", "label": "Teintes Bleues (Primaire)"},
    {"x": 0.7, "y": 0.7, "z": 0.1, "color": "#fef08a", "label": "Teintes Jaunes (Warning)"},
    {"x": 0.5, "y": 0.1, "z": 0.6, "color": "#c084fc", "label": "Teintes Violettes (Premium)"}
  ]
}
\`\`\`

## Graphique Interactif des Tendances Design (Interactif) :

\`\`\`chart
{
  "title": "Adoption des tendances de Design Web en 2026",
  "type": "area",
  "keys": ["TauxAdoption"],
  "colors": ["#8b5cf6"],
  "labels": {
    "TauxAdoption": "Taux d'adoption (%)"
  },
  "data": [
    {"name": "2022", "TauxAdoption": 15},
    {"name": "2023", "TauxAdoption": 32},
    {"name": "2024", "TauxAdoption": 55},
    {"name": "2025", "TauxAdoption": 78},
    {"name": "2026", "TauxAdoption": 94}
  ],
  "description": "Le style Glassmorphism et les thèmes sombres HSL dominent largement les interfaces e-learning modernes."
}
\`\`\`

## CSS Moderne : HSL, Gradients et Flexbox/Grid`;

            if (md.includes(targetSection) && !md.includes('threed')) {
                md = md.replace(targetSection, replacementWidget);
                await prisma.courseContent.update({
                    where: { id: contentBlock.id },
                    data: { content: md }
                });
                console.log('✅ Leçon 3 mise à jour avec 3D Scatter Plot & Area Chart !');
            } else {
                console.log('⚠️ Leçon 3 : Cible introuvable ou déjà modifiée.');
            }
        }

        // 3. Leçon 5 : TP : Création d'un Dashboard interactif complet
        const lesson5 = course.lessons.find(l => l.order === 5);
        if (lesson5 && lesson5.contents.length > 0) {
            const contentBlock = lesson5.contents[0];
            let md = contentBlock.content;

            const targetSection = `## Objectifs du TP`;

            const replacementWidget = `## Objectifs du TP

## Simulation de Performance du Dashboard (Interactif) :

\`\`\`chart
{
  "title": "Statistiques Financières du Dashboard TP",
  "type": "bar",
  "keys": ["Revenus", "Depenses"],
  "colors": ["#10b981", "#ef4444"],
  "labels": {
    "Revenus": "Revenus (DA)",
    "Depenses": "Dépenses (DA)"
  },
  "data": [
    {"name": "Janvier", "Revenus": 45000, "Depenses": 20000},
    {"name": "Février", "Revenus": 52000, "Depenses": 22000},
    {"name": "Mars", "Revenus": 61000, "Depenses": 25000},
    {"name": "Avril", "Revenus": 58000, "Depenses": 24000},
    {"name": "Mai", "Revenus": 72000, "Depenses": 28000}
  ],
  "description": "Les revenus affichent une croissance stable avec une marge nette moyenne de 58%."
}
\`\`\`

## Tableau Analytique de Satisfaction (Interactif) :

\`\`\`tableinteractive
{
  "title": "Données analytiques de ventes du Dashboard (Enquête)",
  "headers": ["Région", "Ventes (Unités)", "Chiffre d'Affaires (DA)", "Satisfaction (%)"],
  "rows": [
    ["Alger", 120, 144000, 94],
    ["Oran", 85, 102000, 89],
    ["Constantine", 72, 86400, 91],
    ["Annaba", 54, 64800, 87],
    ["Setif", 63, 75600, 90]
  ]
}
\`\`\``;

            if (md.includes(targetSection) && !md.includes('tableinteractive')) {
                md = md.replace(targetSection, replacementWidget);
                await prisma.courseContent.update({
                    where: { id: contentBlock.id },
                    data: { content: md }
                });
                console.log('✅ Leçon 5 mise à jour avec Bar Chart & Table Interactive !');
            } else {
                console.log('⚠️ Leçon 5 : Cible introuvable ou déjà modifiée.');
            }
        }

    } catch (error) {
        console.error('❌ Erreur lors de l\'injection des widgets :', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
