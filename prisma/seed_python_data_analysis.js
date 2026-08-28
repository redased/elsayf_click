const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Python Data Analysis Course...')

    // Learning Outcomes
    const learningOutcomes = [
        "Maîtriser les fondamentaux de Python pour la Data Science",
        "Manipuler et analyser des données avec Pandas et NumPy",
        "Créer des visualisations de données percutantes avec Matplotlib et Seaborn",
        "Comprendre les concepts de base du Machine Learning avec Scikit-Learn",
        "Réaliser un projet complet d'analyse de données de A à Z"
    ]

    const learningOutcomes_en = [
        "Master Python fundamentals for Data Science",
        "Manipulate and analyze data with Pandas and NumPy",
        "Create impactful data visualizations with Matplotlib and Seaborn",
        "Understand basic Machine Learning concepts with Scikit-Learn",
        "Complete an end-to-step data analysis project"
    ]

    const learningOutcomes_ar = [
        "إتقان أساسيات بايثون لعلوم البيانات",
        "معالجة وتحليل البيانات باستخدام Pandas و NumPy",
        "إنشاء تصورات بيانات مؤثرة باستخدام Matplotlib و Seaborn",
        "فهم مفاهيم التعلم الآلي الأساسية مع Scikit-Learn",
        "إكمال مشروع تحليل بيانات كامل من الألف إلى الياء"
    ]

    // Requirements
    const requirements = [
        "Connaissances de base en programmation Python",
        "Un ordinateur avec accès à Internet",
        "Volonté d'apprendre et de manipuler des données"
    ]

    const requirements_en = [
        "Basic Python programming knowledge",
        "A computer with Internet access",
        "Willingness to learn and manipulate data"
    ]

    const requirements_ar = [
        "معرفة أساسية ببرمجة بايثون",
        "جهاز كمبيوتر مع وصول إلى الإنترنت",
        "الرغبة في التعلم ومعالجة البيانات"
    ]

    // Full Description
    const fullDescription = `# Python : Analyse de Données et Introduction au Machine Learning

## Découvrez le pouvoir de la Data avec Python

Cette formation vous guidera pas à pas dans l'écosystème Python dédié à l'analyse de données.

### Ce que vous allez apprendre

**Module 1 : NumPy, le calcul scientifique**
- Tableaux (Arrays) multidimensionnels
- Opérations mathématiques sur les tableaux
- Remplacer les boucles lentes par des opérations vectorisées

**Module 2 : Pandas, la manipulation de données**
- Series et DataFrames : les bases
- Importation et exportation de données (CSV, Excel)
- Nettoyage : valeurs manquantes, doublons
- Filtrage, groupement (groupby) et jointures

**Module 3 : Data Visualization (DataViz)**
- Créer des graphiques de base avec Matplotlib
- Personnaliser des graphiques (titres, axes, légendes)
- Visualisations statistiques avancées avec Seaborn (heatmaps, boxplots)

**Module 4 : Introduction au Machine Learning (Scikit-Learn)**
- Qu'est-ce que le Machine Learning ? Apprentissage supervisé vs non supervisé
- Préparation des données pour le ML (Train/Test split)
- Algorithmes de base : Régression Linéaire, KNN (K-Nearest Neighbors)
- Évaluation de base (Précision, Erreur quadratique moyenne / MSE)

**Module 5 : Projet Pratique Complet**
- Analyse exploratoire d'un jeu de données réel
- Nettoyage, visualisation, et création d'un modèle prédictif simple

### Pourquoi cette formation ?

✅ **Très Demandée** - L'analyse de données est une compétence clé aujourd'hui.
✅ **Orientée Pratique** - Moins de théorie, beaucoup plus de code Jupyter/Colab.
✅ **Fondations Solides** - Prépare idéalement aux cours de Machine Learning et Deep Learning avancés.`

    const pythonDataCourse = await prisma.course.upsert({
        where: { slug: 'python-data-analysis' },
        update: {},
        create: {
            title: 'Python : Analyse de Données Complète',
            title_en: 'Python: Complete Data Analysis',
            title_ar: 'بايثون: تحليل البيانات الشامل',
            slug: 'python-data-analysis',
            description: "Maîtrisez NumPy, Pandas, la visualisation de données et découvrez les bases du Machine Learning.",
            description_en: 'Master NumPy, Pandas, data visualization and discover Machine Learning basics.',
            description_ar: 'السيطرة على NumPy و Pandas وتصور البيانات واكتشاف أساسيات التعلم الآلي.',
            price: 0,
            isFree: true,
            isInviteOnly: false,
            isPublished: true,
            level: 'Intermédiaire',
            duration: '22h 00m',
            image: '/images/courses/python-data-analysis.png',
            fullDescription: fullDescription,
            fullDescription_en: fullDescription.replace(/Analyse de Données et Introduction au Machine Learning/g, 'Data Analysis and Introduction to Machine Learning').replace(/Découvrez le pouvoir de la Data avec Python/g, 'Discover the power of Data with Python').replace(/Cette formation vous guidera pas à pas dans l'écosystème Python/g, 'This course will guide you step by step in the Python ecosystem').replace(/Ce que vous allez apprendre/g, 'What you will learn'),
            fullDescription_ar: 'اكتشف قوة البيانات مع بايثون. دورة شاملة في NumPy و Pandas و DataViz.',
            learningOutcomes: JSON.stringify(learningOutcomes),
            learningOutcomes_en: JSON.stringify(learningOutcomes_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes_ar),
            requirements: JSON.stringify(requirements),
            requirements_en: JSON.stringify(requirements_en),
            requirements_ar: JSON.stringify(requirements_ar),
            lessons: {
                create: [
                    // ===== MODULE 1: Introduction & NumPy =====
                    {
                        title: 'Introduction et Setup (Jupyter/Colab)',
                        title_en: 'Introduction and Setup (Jupyter/Colab)',
                        title_ar: 'مقدمة وإعداد',
                        duration: 30,
                        order: 1,
                        content: `# Outils pour la Data Science en Python
## Google Colab
La solution la plus simple pour démarrer sans rien installer. Basé sur Jupyter Notebooks, il s'exécute dans le navigateur et offre des ressources gratuites.

## Anaconda et Jupyter Notebook local
Comment installer Anaconda, gérer des environnements virtuels (conda et pip) et lancer des notebooks Jupyter sur votre propre machine.`,
                        content_en: 'Setting up Jupyter Notebooks and Google Colab for data science.',
                        content_ar: 'إعداد Jupyter Notebooks و Google Colab لعلوم البيانات.',
                    },
                    {
                        title: 'NumPy: Les bases des ndarrays',
                        title_en: 'NumPy: ndarrays basics',
                        title_ar: 'NumPy: أساسيات ndarrays',
                        duration: 45,
                        order: 2,
                        content: `# Introduction à NumPy
NumPy (Numerical Python) est la bibliothèque fondamentale pour le calcul scientifique en Python.

## Les ndarrays
Création de tableaux 1D, 2D, 3D depuis des listes Python. Attributs (shape, size, dtype). Différence clé avec les listes Python natives.`,
                        content_en: 'Introduction to NumPy arrays: creation, dimensions, and data types.',
                        content_ar: 'مقدمة إلى مصفوفات NumPy: الإنشاء والأبعاد وأنواع البيانات.',
                    },
                    {
                        title: 'NumPy: Indexation et slicing avancés',
                        title_en: 'NumPy: Advanced indexing and slicing',
                        title_ar: 'NumPy: الفهرسة والتقطيع المتقدم',
                        duration: 40,
                        order: 3,
                        content: `# Travailler avec des sous-ensembles
Comment sélectionner des éléments spécifiques dans des matrices multidimensionnelles.
## Boolean Indexing
Sélectionner des données basées sur des conditions (ex: \`arr[arr > 5]\`).`,
                        content_en: 'Selecting subsets of data, conditional indexing.',
                        content_ar: 'تحديد مجموعات فرعية من البيانات الفهرسة الشرطية.',
                    },
                    {
                        title: 'NumPy: Fonctions universelles et vectorisation',
                        title_en: 'NumPy: Universal functions and vectorization',
                        title_ar: 'NumPy: الدوال العامة والمتجهات',
                        duration: 50,
                        order: 4,
                        content: `# Calcul rapide
Pourquoi il faut éviter les boucles \`for\` classiques. Utilisation des ufuncs (add, subtract, exp, log) pour des calculs ultra-rapides sur de grands volumes de données.`,
                        content_en: 'Fast computation avoiding loops using ufuncs.',
                        content_ar: 'حساب سريع مع تجنب الحلقات باستخدام ufuncs.',
                    },
                    // ===== MODULE 2: Pandas =====
                    {
                        title: 'Pandas: Introduction aux Series et DataFrames',
                        title_en: 'Pandas: Intro to Series and DataFrames',
                        title_ar: 'باندا: مقدمة إلى Series و DataFrames',
                        duration: 45,
                        order: 5,
                        content: `# La structure de données Pandas
## Series
Un tableau 1D avec des étiquettes (index).
## DataFrames
La structure principale : un tableau 2D (similaire à une table SQL ou Excel). Création de DataFrames à partir de dictionnaires ou de fichiers Pandas.`,
                        content_en: 'Core Pandas structures: 1D Series and 2D DataFrames.',
                        content_ar: 'هياكل باندا الأساسية Series و DataFrames.',
                    },
                    {
                        title: 'Pandas: Lecture et écriture de fichiers (CSV, Excel)',
                        title_en: 'Pandas: IO Operations (CSV, Excel)',
                        title_ar: 'باندا: عمليات الإدخال والإخراج',
                        duration: 35,
                        order: 6,
                        content: `# Importer et Exporter vos données
Comment utiliser \`pd.read_csv()\`, \`pd.read_excel()\`, etc. Gérer les encodages, les séparateurs et exporter vos résultats avec \`to_csv()\`.`,
                        content_en: 'Reading and writing data formats like CSV and Excel.',
                        content_ar: 'قراءة وكتابة تنسيقات البيانات مثل CSV و Excel.',
                    },
                    {
                        title: 'Pandas: Inspection et sélection de données',
                        title_en: 'Pandas: Data Inspection and Selection',
                        title_ar: 'باندا: فحص البيانات واختيارها',
                        duration: 50,
                        order: 7,
                        content: `# Explorer un DataFrame
\`df.head()\`, \`df.info()\`, \`df.describe()\`.
## Sélection
Utilisation de \`.loc[]\` (par label) et \`.iloc[]\` (par position entière). Filtrage avec des masques booléens.`,
                        content_en: 'Exploring DataFrame properties and subsetting using loc and iloc.',
                        content_ar: 'استكشاف خصائص DataFrame باستخدام loc و iloc.',
                    },
                    {
                        title: 'Pandas: Nettoyage de données',
                        title_en: 'Pandas: Data Cleaning',
                        title_ar: 'باندا: تنظيف البيانات',
                        duration: 55,
                        order: 8,
                        content: `# Préparer des données imparfaites
Détection et gestion des valeurs manquantes (NaN) avec \`dropna()\` et \`fillna()\`. Suppression des doublons. Renommage de colonnes et modification de types de données.`,
                        content_en: 'Handling missing values, duplicates, and inaccurate data.',
                        content_ar: 'التعامل مع القيم المفقودة والمكررة.',
                    },
                    {
                        title: 'Pandas: Groupby et agrégations',
                        title_en: 'Pandas: Groupby and Aggregations',
                        title_ar: 'باندا: التجميع',
                        duration: 60,
                        order: 9,
                        content: `# L'approche Split-Apply-Combine
Comment regrouper des données catégorielles et appliquer des fonctions d'agrégation (moyenne, somme, count) en utilisant \`df.groupby()\`.`,
                        content_en: 'Categorizing data and applying aggregate functions like mean or sum.',
                        content_ar: 'تصنيف البيانات وتطبيق دوال مثل المتوسط.',
                    },
                    {
                        title: 'Pandas: Jointures et concaténations',
                        title_en: 'Pandas: Joins and Concatenations',
                        title_ar: 'باندا: الدمج',
                        duration: 45,
                        order: 10,
                        content: `# Combiner des DataFrames
Utilisation de \`pd.concat()\` pour empiler des données. Utilisation de \`pd.merge()\` pour effectuer des jointures SQL-like (inner, left, right, outer join).`,
                        content_en: 'Combining multiple DataFrames together using concat and merge.',
                        content_ar: 'دمج عدة DataFrames معًا باستخدام concat و merge.',
                    },
                    // ===== MODULE 3: DataViz =====
                    {
                        title: 'Matplotlib: Les bases du traçage',
                        title_en: 'Matplotlib: Plotting basics',
                        title_ar: 'Matplotlib: أساسيات الرسم',
                        duration: 45,
                        order: 11,
                        content: `# Création de graphiques simples
Line plots, scatter plots, bar charts. Anatomie d'une figure (Figure, Axes). Personnalisation (titres, labels, légendes).`,
                        content_en: 'Creating line plots, scatter plots, and bar charts. Figure anatomy.',
                        content_ar: 'إنشاء مخططات خطية ومخططات شريطية.',
                    },
                    {
                        title: 'Seaborn: Visualisations statistiques avancées',
                        title_en: 'Seaborn: Advanced statistical visualizations',
                        title_ar: 'Seaborn: تصورات إحصائية متقدمة',
                        duration: 55,
                        order: 12,
                        content: `# Graphiques plus esthétiques
Utilisation de Seaborn (basé sur Matplotlib). Création de heatmaps de corrélation, de boxplots, et de pairplots pour explorer des ensembles de données complexes avec un minimum de code.`,
                        content_en: 'Using Seaborn to create correlation heatmaps, boxplots, and pairplots with minimal code.',
                        content_ar: 'استخدام Seaborn لإنشاء رسوم بيانية معقدة بأقل كود.',
                    },
                    // ===== MODULE 4: Machine Learning Intro =====
                    {
                        title: 'Introduction au Machine Learning (Scikit-Learn)',
                        title_en: 'Introduction to Machine Learning (Scikit-Learn)',
                        title_ar: 'مقدمة في التعلم الآلي',
                        duration: 50,
                        order: 13,
                        content: `# Concepts fondamentaux 
Supervisé vs Non Supervisé. Régression vs Classification.
La bibliothèque Scikit-Learn : API standard. La séparation Train/Test.`,
                        content_en: 'Supervised vs Unsupervised. Regression vs Classification. The Scikit-Learn API and Train/Test split.',
                        content_ar: 'التعلم الخاضع للإشراف وغير الخاضع. واجهة برمجة التطبيقات Scikit-Learn.',
                    },
                    {
                        title: 'Création et évaluation d\'un modèle de base',
                        title_en: 'Creating and evaluating a basic model',
                        title_ar: 'إنشاء وتقييم نموذج أساسي',
                        duration: 60,
                        order: 14,
                        content: `# Appliquer un algorithme simple
Exemple d'une Régression Linéaire ou K-Nearest Neighbors (KNN). Entraînement (\`fit\`), prédiction (\`predict\`) et évaluation de la performance du modèle.`,
                        content_en: 'Applying algorithms like Linear Regression or KNN. Fit, predict, and evaluate.',
                        content_ar: 'تطبيق خوارزميات مثل الانحدار الخطي.',
                    },
                    // ===== MODULE 5: Projet =====
                    {
                        title: 'Projet Final: Analyse complète d\'un jeu de données',
                        title_en: 'Final Project: Complete dataset analysis',
                        title_ar: 'المشروع النهائي: تحليل كامل للبيانات',
                        duration: 120,
                        order: 15,
                        content: `# Mettre le tout ensemble
Import des données → Nettoyage → Exploration visuelle (EDA) → Préparation ML → Modélisation simple.`,
                        content_en: 'Import → Cleaning → Exploratory Data Analysis (EDA) → ML Prep → Simple modeling.',
                        content_ar: 'الاستيراد → التنظيف → التحليل الاستكشافي للبيانات.',
                    }
                ]
            }
        }
    });

    console.log('✅ Cours Python : Analyse de Données ajouté.')
}

main()
    .catch(e => {
        console.error('❌ Erreur:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
