const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding Complete Courses...')

    // --- 1. R Statistics Complete Course ---
    const rCourse = await prisma.course.upsert({
        where: { slug: 'r-statistics-complete-mastery' },
        update: {
            image: '/courses/r_statistics_course_icon.png', // Update image
        },
        create: {
            title: 'R Statistique : De Zéro à l\'IA',
            title_en: 'R Statistics: Zero to AI',
            title_ar: 'إحصاء R: من الصفر إلى الذكاء الاصطناعي',
            slug: 'r-statistics-complete-mastery',
            description: 'La formation ultime pour maîtriser R, de la syntaxe de base à l\'intégration de l\'Intelligence Artificielle.',
            description_en: 'The ultimate course to master R, from basic syntax to Artificial Intelligence integration.',
            description_ar: 'الدورة النهائية لإتقان R، من بناء الجملة الأساسي إلى تكامل الذكاء الاصطناعي.',
            fullDescription: `
# Maîtrisez R pour la Data Science et l'IA

Cette formation complète est conçue pour vous transformer en expert R.

## Programme
1. **Les Bases** : Syntaxe, structures de données.
2. **Intermédiaire** : Manipulation de données avec Tidyverse.
3. **Avancé** : Statistiques inférentielles, Modèles linéaires.
4. **Expert & IA** : Machine Learning avec Caret/Tidymodels et intégration avec les LLMs.
            `,
            price: 79.99,
            level: 'Tous niveaux',
            duration: '25h 00m',
            image: '/courses/r_statistics_course_icon.png',
            lessons: {
                create: [
                    // Partie 1: Bases
                    {
                        title: 'Installation et Premier Script',
                        order: 1,
                        duration: 15,
                        content: 'Découverte de RStudio, installation des packages et "Hello World".',
                        videoUrl: 'https://www.youtube.com/embed/example1'
                    },
                    {
                        title: 'Vecteurs et Matrices',
                        order: 2,
                        duration: 30,
                        content: 'Comprendre les blocs de construction fondamentaux de R.',
                    },
                    // Partie 2: Intermédiaire
                    {
                        title: 'Manipulation avec Dplyr',
                        order: 3,
                        duration: 45,
                        content: 'Filtrer, sélectionner, muter et résumer vos données efficacement.',
                    },
                    {
                        title: 'Visualisation avec Ggplot2',
                        order: 4,
                        duration: 45,
                        content: 'La grammaire des graphiques pour des visuels époustouflants.',
                    },
                    // Partie 3: Avancé
                    {
                        title: 'Tests Statistiques',
                        order: 5,
                        duration: 60,
                        content: 'T-tests, ANOVA, Chi-2, et Tests non-paramétriques.',
                    },
                    // Partie 4: IA
                    {
                        title: 'Introduction au Machine Learning en R',
                        order: 6,
                        duration: 60,
                        content: 'Classification et Régression avec le package caret.',
                    },
                    {
                        title: 'Intégrer ChatGPT dans R',
                        order: 7,
                        duration: 40,
                        content: 'Utiliser l\'API OpenAI directement depuis R pour analyser vos résultats.',
                    }
                ]
            }
        }
    });

    // --- 2. Python Data Science Course ---
    const pythonCourse = await prisma.course.upsert({
        where: { slug: 'python-data-science-ai-mastery' },
        update: {
            image: '/courses/python_data_science_icon.png',
        },
        create: {
            title: 'Python Data Science & IA',
            title_en: 'Python Data Science & AI',
            title_ar: 'علم البيانات بايثون والذكاء الاصطناعي',
            slug: 'python-data-science-ai-mastery',
            description: 'Devenez Data Scientist : Python, Pandas, Scikit-Learn et Deep Learning.',
            description_en: 'Become a Data Scientist: Python, Pandas, Scikit-Learn and Deep Learning.',
            description_ar: 'كن عالم بيانات: بايثون، بانداس، سايكيت ليرن والتعلم العميق.',
            fullDescription: `
# Python pour le Futur

La référence pour apprendre Python dans un contexte scientifique et industriel.

## Programme
1. **Python Base** : Variables, Boucles, Fonctions.
2. **Data Science** : NumPy, Pandas, Matplotlib.
3. **Machine Learning** : Scikitis-Learn, Random Forests.
4. **Deep Learning & IA** : TensorFlow, Keras, et utilisation des APIs LLM.
            `,
            price: 89.99,
            level: 'Tous niveaux',
            duration: '30h 00m',
            image: '/courses/python_data_science_icon.png',
            lessons: {
                create: [
                    // Bases
                    { title: 'Les fondamentaux de Python', order: 1, duration: 20, content: 'Syntaxe, indentation, et types de base.' },
                    { title: 'Structures de contrôle', order: 2, duration: 30, content: 'If, For, While et compréhensions de listes.' },
                    // Data Science
                    { title: 'Analyse avec Pandas', order: 3, duration: 50, content: 'DataFrames, Series, et nettoyage de données.' },
                    { title: 'Visualisation Interactive', order: 4, duration: 40, content: 'Utilisation de Plotly et Seaborn.' },
                    // IA
                    { title: 'Réseaux de Neurones avec Keras', order: 5, duration: 60, content: 'Architecture d\'un réseau de neurones artificiel.' },
                    { title: 'Créer un chatbot avec Python', order: 6, duration: 45, content: 'Intégration d\'APIs d\'IA générative dans vos scripts.' },
                ]
            }
        }
    });

    console.log('✅ Cours R et Python (Complets) ajoutés/mis à jour.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
