const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Python & Google Sheets Automation Course...')

    // Learning Outcomes
    const learningOutcomes = [
        "Maîtriser l'API Google Sheets avec Python (gspread, pygsheets)",
        "Automatiser la lecture, l'écriture et la manipulation de données à grande échelle",
        "Intégrer Pandas pour des analyses de données avancées dans Google Sheets",
        "Créer des tableaux de bord et rapports automatisés",
        "Implémenter des systèmes de scheduling et d'automatisation complète",
        "Intégrer Google Sheets avec Forms, Gmail, Drive et Slides",
        "Développer 5 projets réels: facturation, ventes, stock, sondages, CRM",
        "Déployer des solutions Python-Google Sheets en production"
    ]

    const learningOutcomes_en = [
        "Master Google Sheets API with Python (gspread, pygsheets)",
        "Automate reading, writing and manipulating data at scale",
        "Integrate Pandas for advanced data analysis in Google Sheets",
        "Create automated dashboards and reports",
        "Implement scheduling and complete automation systems",
        "Integrate Google Sheets with Forms, Gmail, Drive and Slides",
        "Develop 5 real projects: invoicing, sales, inventory, surveys, CRM",
        "Deploy Python-Google Sheets solutions to production"
    ]

    const learningOutcomes_ar = [
        "إتقان Google Sheets API باستخدام Python",
        "أتمتة قراءة وكتابة ومعالجة البيانات على نطاق واسع",
        "دمج Pandas لتحليل البيانات المتقدم في Google Sheets",
        "إنشاء لوحات المعلومات والتقارير الآلية",
        "تنفيذ أنظمة الجدولة والأتمتة الكاملة",
        "دمج Google Sheets مع Forms و Gmail و Drive و Slides",
        "تطوير 5 مشاريع واقعية",
        "نشر حلول Python-Google Sheets في الإنتاج"
    ]

    // Requirements
    const requirements = [
        "Connaissances de base en Python (variables, boucles, fonctions)",
        "Compte Google avec accès à Google Sheets",
        "Python 3.8+ installé sur votre machine",
        "Compréhension de base des tableurs (Excel, Sheets...)",
        "Notions de statistiques (moyenne, médiane) recommandées",
        "Environnement de développement (VS Code, PyCharm...)"
    ]

    const requirements_en = [
        "Basic Python knowledge (variables, loops, functions)",
        "Google account with Google Sheets access",
        "Python 3.8+ installed on your machine",
        "Basic spreadsheet understanding (Excel, Sheets...)",
        "Statistics basics (mean, median) recommended",
        "Development environment (VS Code, PyCharm...)"
    ]

    const requirements_ar = [
        "معرفة أساسية بـ Python",
        "حساب Google مع الوصول إلى Google Sheets",
        "Python 3.8+ مثبت على جهازك",
        "فهم أساسي لجداول البيانات",
        "موصى به: معرفة أساسية بالإحصاء",
        "بيئة تطوير (VS Code, PyCharm...)"
    ]

    // Full Description
    const fullDescription = `# Python & Google Sheets : Maîtrisez l'Automatisation des Données

## Transformez votre façon de travailler avec Google Sheets

Cette formation complète vous apprend à automatiser **toutes** vos tâches Google Sheets avec Python. Plus de copier-coller, plus de mises à jour manuelles - laissez Python faire le travail pour vous !

### Ce que vous allez apprendre

**Module 1-2 : Les Fondamentaux**
- Configuration complète de Google Cloud Console et OAuth2
- Maîtrise de gspread et pygsheets
- Authentification sécurisée et gestion des erreurs

**Module 3-4 : Manipulation de Données**
- Lire et écrire des données à toute échelle
- Intégration Pandas pour l'analyse de données
- Nettoyage, filtrage et transformation avancée

**Module 5-6 : Analyse & Visualisation**
- Statistiques descriptives et corrélations
- Tableaux de bord automatisés et interactifs
- Graphiques et KPIs en temps réel

**Module 7-8 : Automatisation & Intégrations**
- Scheduling avec cron, Cloud Functions
- Intégration Forms, Gmail, Drive, Slides
- Workflows multi-services complets

**Module 9-10 : Projets Réels & Production**
- 5 projets complets déployables
- Facturation, Ventes, Stock, Sondages, CRM
- Bonnes pratiques, tests, sécurité

### Pourquoi cette formation ?

✅ 100% Pratique - Projets réels et code immédiatement utilisable
✅ Avancé - Pour les développeurs qui veulent aller plus loin
✅ Complet - De la configuration au déploiement en production
✅ Support - Community Discord pour poser vos questions

### Prérequis

- Python intermédiaire recommandé
- Compte Google
- Env 30h de travail pour tout maîtriser`

    const googleSheetsCourse = await prisma.course.upsert({
        where: { slug: 'python-google-sheets-automation' },
        update: {},
        create: {
            title: 'Python & Google Sheets: Automatisation Complète des Données',
            title_en: 'Python & Google Sheets: Complete Data Automation',
            title_ar: 'Python و Google Sheets: أتمتة البيانات الشاملة',
            slug: 'python-google-sheets-automation',
            description: "Maîtrisez l'automatisation de Google Sheets avec Python, des bases au déploiement en production. 50 leçons, 10 modules, projets réels.",
            description_en: 'Master Google Sheets automation with Python, from basics to production deployment. 50 lessons, 10 modules, real projects.',
            description_ar: 'إتقان أتمتة Google Sheets باستخدام Python، من الأساسيات إلى النشر في الإنتاج. 50 درس، 10 وحدات، مشاريع واقعية.',
            price: 0,
            isFree: true,
            isPublished: true,
            isInviteOnly: false,
            level: 'Avancé',
            duration: '28h 30m',
            image: '/courses/python_google_sheets_icon.png',
            fullDescription: fullDescription,
            fullDescription_en: fullDescription.replace(/Maîtrisez/g, 'Master').replace(/Cette formation/g, 'This course').replace(/étape/g, 'step'),
            fullDescription_ar: 'دورة شاملة حول أتمتة Google Sheets باستخدام Python. تعلم كيفية أتمتة جميع المهام باستخدام Python.',
            learningOutcomes: JSON.stringify(learningOutcomes),
            learningOutcomes_en: JSON.stringify(learningOutcomes_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes_ar),
            requirements: JSON.stringify(requirements),
            requirements_en: JSON.stringify(requirements_en),
            requirements_ar: JSON.stringify(requirements_ar),
            lessons: {
                create: [
                    // ===== MODULE 1: Introduction & Setup =====
                    {
                        title: 'Introduction à l\'automatisation Google Sheets',
                        title_en: 'Introduction to Google Sheets Automation',
                        title_ar: 'مقدمة في أتمتة Google Sheets',
                        duration: 25,
                        order: 1,
                        content: "Dans cette leçon, nous allons découvrir les possibilités d'automatisation de Google Sheets avec Python. Vous apprendrez comment économiser du temps en automatisant les tâches répétitives, traiter de grandes quantités de données sans limitation, et créer des workflows complexes et personnalisés.",
                        content_en: "In this lesson, we will discover the possibilities of Google Sheets automation with Python. You will learn how to save time by automating repetitive tasks, process large amounts of data without limitations, and create complex, customized workflows.",
                        content_ar: "في هذا الدرس، سنكتشف إمكانيات أتمتة Google Sheets باستخدام Python. ستتعلم كيفية توفير الوقت من خلال أتمتة المهام المتكررة.",
                    },
                    {
                        title: 'Configuration Google Cloud Console',
                        title_en: 'Google Cloud Console Setup',
                        title_ar: 'إعداد Google Cloud Console',
                        duration: 40,
                        order: 2,
                        content: "Nous allons créer un projet Google Cloud, activer l'API Google Sheets, Drive, et Gmail. Vous apprendrez également à configurer l'écran de consentement OAuth et à créer des identifiants OAuth2.",
                        content_en: "We will create a Google Cloud project, enable Google Sheets, Drive, and Gmail APIs. You will also learn how to configure the OAuth consent screen and create OAuth2 credentials.",
                        content_ar: "سنقوم بإنشاء مشروع Google Cloud وتفعيل Google Sheets API و Drive API و Gmail API.",
                    },
                    {
                        title: 'Authentification OAuth2',
                        title_en: 'OAuth2 Authentication',
                        title_ar: 'مصادقة OAuth2',
                        duration: 45,
                        order: 3,
                        content: "Apprenez à implémenter l'authentification OAuth2 sécurisée avec Google. Nous verrons le flux d'authentification complet, la gestion des tokens d'accès et de rafraîchissement, et les bonnes pratiques de sécurité.",
                        content_en: "Learn to implement secure OAuth2 authentication with Google. We will cover the complete authentication flow, access and refresh token management, and security best practices.",
                        content_ar: "تعلم كيفية تطبيق مصادقة OAuth2 الآمنة مع Google.",
                    },
                    {
                        title: 'Installation des bibliothèques Python',
                        title_en: 'Installing Python Libraries',
                        title_ar: 'تثبيت مكتبات Python',
                        duration: 30,
                        order: 4,
                        content: "Installation des bibliothèques essentielles: gspread, pygsheets, pandas, numpy, matplotlib, google-auth-oauthlib. Création d'un environnement virtuel et fichier requirements.txt.",
                        content_en: "Installing essential libraries: gspread, pygsheets, pandas, numpy, matplotlib, google-auth-oauthlib. Creating a virtual environment and requirements.txt file.",
                        content_ar: "تثبيت المكتبات الأساسية: gspread و pygsheets و pandas.",
                    },
                    {
                        title: 'Premier script de connexion',
                        title_en: 'First Connection Script',
                        title_ar: 'برنامج الاتصال الأول',
                        duration: 40,
                        order: 5,
                        content: "Créez votre premier script pour vous connecter à Google Sheets. Nous listerons toutes vos feuilles, ouvrirons une feuille spécifique, et lirons notre première cellule.",
                        content_en: "Create your first script to connect to Google Sheets. We will list all your sheets, open a specific sheet, and read our first cell.",
                        content_ar: "أنشئ أول برنامج للاتصال بـ Google Sheets.",
                    },
                    // ===== MODULE 2: Bases Python pour Sheets =====
                    {
                        title: 'Introduction à gspread',
                        title_en: 'Introduction to gspread',
                        title_ar: 'مقدمة في gspread',
                        duration: 35,
                        order: 6,
                        content: "Découverte de gspread, la bibliothèque Python la plus populaire pour Google Sheets. Connexion, ouverture de feuilles par nom/URL/ID, sélection de worksheets, création de nouvelles feuilles.",
                        content_en: "Discover gspread, the most popular Python library for Google Sheets. Connection, opening sheets by name/URL/ID, selecting worksheets, creating new sheets.",
                        content_ar: "اكتشاف gspread، مكتبة Python الأكثر شعبية لـ Google Sheets.",
                    },
                    {
                        title: 'Introduction à pygsheets',
                        title_en: 'Introduction to pygsheets',
                        title_ar: 'مقدمة في pygsheets',
                        duration: 35,
                        order: 7,
                        content: "Découverte de pygsheets comme alternative à gspread. Comparaison des deux bibliothèques, syntaxe de base, avantages et inconvénients de chacune.",
                        content_en: "Discover pygsheets as an alternative to gspread. Comparison of both libraries, basic syntax, advantages and disadvantages of each.",
                        content_ar: "اكتشاف pygsheets كبديل لـ gspread.",
                    },
                    {
                        title: 'Structures de données Python pour Sheets',
                        title_en: 'Python Data Structures for Sheets',
                        title_ar: 'هياكل بيانات Python لـ Sheets',
                        duration: 40,
                        order: 8,
                        content: "Mapping des types Python vers Sheets: listes, dictionnaires, tableaux. Manipulation avancée des données avec des structures Python natives.",
                        content_en: "Mapping Python types to Sheets: lists, dictionaries, arrays. Advanced data manipulation with native Python structures.",
                        content_ar: "تعيين أنواع Python إلى Sheets: القوائم والقواميس.",
                    },
                    {
                        title: 'Gestion des erreurs et exceptions',
                        title_en: 'Error Handling and Exceptions',
                        title_ar: 'معالجة الأخطاء والاستثناءات',
                        duration: 35,
                        order: 9,
                        content: "Gérer les erreurs API avec try/except. APIError, HTTPError, gestion des quotas, implémentation de retries avec backoff exponentiel.",
                        content_en: "Handle API errors with try/except. APIError, HTTPError, quota management, implementing retries with exponential backoff.",
                        content_ar: "تعامل مع أخطاء API باستخدام try/except.",
                    },
                    {
                        title: 'Bonnes pratiques de code',
                        title_en: 'Code Best Practices',
                        title_ar: 'أفضل ممارسات الكود',
                        duration: 30,
                        order: 10,
                        content: "Code propre avec PEP 8, fonctions réutilisables, logging structuré, documentation avec docstrings, modularité du code.",
                        content_en: "Clean code with PEP 8, reusable functions, structured logging, documentation with docstrings, code modularity.",
                        content_ar: "كود نظيف مع PEP 8 ووظائف قابلة لإعادة الاستخدام.",
                    },
                    // ===== MODULE 3: Lecture & Écriture =====
                    {
                        title: 'Lire une cellule unique',
                        title_en: 'Read a Single Cell',
                        title_ar: 'قراءة خلية واحدة',
                        duration: 30,
                        order: 11,
                        content: "Accéder à une cellule spécifique avec cell() et acell(). Notation A1 vs coordonnées (ligne, colonne). Lecture de valeurs individuelles.",
                        content_en: "Access a specific cell with cell() and acell(). A1 notation vs coordinates (row, column). Reading individual values.",
                        content_ar: "الوصول إلى خلية محددة باستخدام cell() و acell().",
                    },
                    {
                        title: 'Lire des plages de cellules',
                        title_en: 'Read Cell Ranges',
                        title_ar: 'قراءة نطاقات الخلايا',
                        duration: 40,
                        order: 12,
                        content: "Extraire des lignes complètes avec row_values(), des colonnes avec col_values(), toutes les valeurs avec get_all_values(). get_all_records() pour les données structurées.",
                        content_en: "Extract complete rows with row_values(), columns with col_values(), all values with get_all_values(). get_all_records() for structured data.",
                        content_ar: "استخراج صفوف كاملة باستخدام row_values().",
                    },
                    {
                        title: 'Écrire dans des cellules',
                        title_en: 'Write to Cells',
                        title_ar: 'الكتابة في الخلايا',
                        duration: 35,
                        order: 13,
                        content: "Modifier le contenu des cellules avec update_cell() et update(). Écriture de plages avec batch_update(). append_row() pour ajouter des données.",
                        content_en: "Modify cell content with update_cell() and update(). Writing ranges with batch_update(). append_row() to add data.",
                        content_ar: "تعديل محتوى الخلايا باستخدام update_cell().",
                    },
                    {
                        title: 'Ajouter et supprimer des lignes/colonnes',
                        title_en: 'Add and Delete Rows/Columns',
                        title_ar: 'إضافة وحذف الصفوف والأعمدة',
                        duration: 40,
                        order: 14,
                        content: "Manipuler la structure de la feuille: add_rows(), delete_row(), insert_cols. Redimensionnement dynamique de la feuille.",
                        content_en: "Manipulate sheet structure: add_rows(), delete_row(), insert_cols. Dynamic sheet resizing.",
                        content_ar: "معالجة بنية الورقة: add_rows() و delete_row().",
                    },
                    {
                        title: 'Formattage des données',
                        title_en: 'Data Formatting',
                        title_ar: 'تنسيق البيانات',
                        duration: 35,
                        order: 15,
                        content: "Formats de nombres, dates, monnaie. Validation des données. Mise en forme conditionnelle de base avec l'API Sheets.",
                        content_en: "Number formats, dates, currency. Data validation. Basic conditional formatting with Sheets API.",
                        content_ar: "تنسيقات الأرقام والتاريخ والعملة.",
                    },
                    // ===== MODULE 4: Pandas =====
                    {
                        title: 'Introduction à Pandas pour Sheets',
                        title_en: 'Introduction to Pandas for Sheets',
                        title_ar: 'مقدمة في Pandas لـ Sheets',
                        duration: 40,
                        order: 16,
                        content: "Convertir Google Sheets en DataFrame Pandas. get_as_dataframe() vs conversion manuelle. Avantages de Pandas pour l'analyse de données.",
                        content_en: "Convert Google Sheets to Pandas DataFrame. get_as_dataframe() vs manual conversion. Advantages of Pandas for data analysis.",
                        content_ar: "تحويل Google Sheets إلى DataFrame Pandas.",
                    },
                    {
                        title: 'Nettoyage de données avec Pandas',
                        title_en: 'Data Cleaning with Pandas',
                        title_ar: 'تنظيف البيانات باستخدام Pandas',
                        duration: 45,
                        order: 17,
                        content: "Gérer les valeurs manquantes avec dropna() et fillna(). Supprimer les doublons avec drop_duplicates(). Normalisation des données.",
                        content_en: "Handle missing values with dropna() and fillna(). Remove duplicates with drop_duplicates(). Data normalization.",
                        content_ar: "التعامل مع القيم المفقودة باستخدام dropna().",
                    },
                    {
                        title: 'Filtrage et tri avancé',
                        title_en: 'Advanced Filtering and Sorting',
                        title_ar: 'التصفية والفرز المتقدم',
                        duration: 45,
                        order: 18,
                        content: "Query complexes sur les données avec query(). Filtrage conditionnel. Tri avec sort_values(). Combinaison de filtres.",
                        content_en: "Complex queries on data with query(). Conditional filtering. Sorting with sort_values(). Combining filters.",
                        content_ar: "استعلامات معقدة على البيانات باستخدام query().",
                    },
                    {
                        title: 'Agrégation et groupement',
                        title_en: 'Aggregation and Grouping',
                        title_ar: 'التجميع والتلخيص',
                        duration: 40,
                        order: 19,
                        content: "groupby() pour grouper les données. pivot_table() pour les tableaux croisés dynamiques. agg() pour les agrégations personnalisées.",
                        content_en: "groupby() to group data. pivot_table() for pivot tables. agg() for custom aggregations.",
                        content_ar: "groupby() لتجميع البيانات و pivot_table() للجداول المحورية.",
                    },
                    {
                        title: 'Exporter Pandas vers Sheets',
                        title_en: 'Export Pandas to Sheets',
                        title_ar: 'تصدير Pandas إلى Sheets',
                        duration: 45,
                        order: 20,
                        content: "Écrire un DataFrame dans Google Sheets avec set_with_dataframe(). Mise à jour batch de grandes quantités de données. Optimisation des performances.",
                        content_en: "Write a DataFrame to Google Sheets with set_with_dataframe(). Batch update large amounts of data. Performance optimization.",
                        content_ar: "كتابة DataFrame في Google Sheets باستخدام set_with_dataframe().",
                    },
                    // ===== MODULE 5: Statistiques =====
                    {
                        title: 'Statistiques descriptives',
                        title_en: 'Descriptive Statistics',
                        title_ar: 'الإحصاء الوصفي',
                        duration: 35,
                        order: 21,
                        content: "Calculer moyenne, médiane, écart-type avec describe() et statistics module. Visualisation des distributions.",
                        content_en: "Calculate mean, median, std dev with describe() and statistics module. Distribution visualization.",
                        content_ar: "حساب المتوسط والوسيط والانحراف المعياري.",
                    },
                    {
                        title: 'Analyse de corrélation',
                        title_en: 'Correlation Analysis',
                        title_ar: 'تحليل الارتباط',
                        duration: 40,
                        order: 22,
                        content: "Trouver des relations entre variables avec corr(). Matrice de corrélation. Heatmap de corrélation avec seaborn.",
                        content_en: "Find relationships between variables with corr(). Correlation matrix. Correlation heatmap with seaborn.",
                        content_ar: "إيجاد علاقات بين المتغيرات باستخدام corr().",
                    },
                    {
                        title: 'Régressions linéaires',
                        title_en: 'Linear Regressions',
                        title_ar: 'الانحدار الخطي',
                        duration: 40,
                        order: 23,
                        content: "Modéliser les tendances avec scikit-learn LinearRegression. Prédictions de valeurs. Évaluation du modèle (R², MSE).",
                        content_en: "Model trends with scikit-learn LinearRegression. Value predictions. Model evaluation (R², MSE).",
                        content_ar: "نمذجة الاتجاهات باستخدام LinearRegression من scikit-learn.",
                    },
                    {
                        title: 'Analyse de séries temporelles',
                        title_en: 'Time Series Analysis',
                        title_ar: 'تحليل السلاسل الزمنية',
                        duration: 35,
                        order: 24,
                        content: "Travailler avec des données chronologiques. Parsing de datetime. Resampling de données temporelles. Tendances et saisonnalité.",
                        content_en: "Work with time series data. Datetime parsing. Time data resampling. Trends and seasonality.",
                        content_ar: "العمل مع بيانات السلاسل الزمنية.",
                    },
                    {
                        title: 'Créer un rapport automatique',
                        title_en: 'Create an Automatic Report',
                        title_ar: 'إنشاء تقرير تلقائي',
                        duration: 30,
                        order: 25,
                        content: "Générer un rapport statistique complet. Automatiser la création de rapports périodiques. Export en différents formats.",
                        content_en: "Generate a complete statistical report. Automate periodic report creation. Export in different formats.",
                        content_ar: "إنشاء تقرير إحصائي كامل.",
                    },
                    // ===== MODULE 6: Tableaux de Bord =====
                    {
                        title: 'Créer des graphiques avec Python',
                        title_en: 'Create Charts with Python',
                        title_ar: 'إنشاء رسوم بيانية',
                        duration: 40,
                        order: 26,
                        content: "matplotlib et seaborn pour créer des visualisations. Graphiques linéaires, barres, scatter. Personnalisation des graphiques.",
                        content_en: "matplotlib and seaborn to create visualizations. Line, bar, scatter charts. Chart customization.",
                        content_ar: "matplotlib و seaborn لإنشاء تصورات.",
                    },
                    {
                        title: 'Intégrer des images dans Sheets',
                        title_en: 'Insert Images in Sheets',
                        title_ar: 'إدراج الصور في Sheets',
                        duration: 35,
                        order: 27,
                        content: "Insérer des graphiques automatiquement dans Sheets. API insert_image. Positionnement et redimensionnement des images.",
                        content_en: "Insert charts automatically into Sheets. insert_image API. Image positioning and resizing.",
                        content_ar: "إدراج المخططات تلقائياً في Sheets.",
                    },
                    {
                        title: 'Mise en forme conditionnelle',
                        title_en: 'Conditional Formatting',
                        title_ar: 'التنسيق الشرطي',
                        duration: 40,
                        order: 28,
                        content: "Appliquer des règles de formatage dynamiques. ConditionalFormatRule. Color scales. Icon sets.",
                        content_en: "Apply dynamic formatting rules. ConditionalFormatRule. Color scales. Icon sets.",
                        content_ar: "تطبيق قواعد التنسيق الديناميكية.",
                    },
                    {
                        title: 'Tableaux de bord interactifs',
                        title_en: 'Interactive Dashboards',
                        title_ar: 'لوحات المعلومات التفاعلية',
                        duration: 45,
                        order: 29,
                        content: "Combiner graphiques et KPIs. Layout de dashboard. Mise à jour automatique des données. Slicers et filtres.",
                        content_en: "Combine charts and KPIs. Dashboard layout. Automatic data update. Slicers and filters.",
                        content_ar: "دمج المخططات ومؤشرات الأداء.",
                    },
                    {
                        title: 'Actualisation automatique des données',
                        title_en: 'Automatic Data Refresh',
                        title_ar: 'التحديث التلقائي للبيانات',
                        duration: 35,
                        order: 30,
                        content: "Scripts pour mises à jour planifiées. Trigger updates. Fonctions de refresh. Gestion des conflits.",
                        content_en: "Scripts for scheduled updates. Trigger updates. Refresh functions. Conflict management.",
                        content_ar: "برامج للتحديثات المجدولة.",
                    },
                    // ===== MODULE 7: Scheduling =====
                    {
                        title: 'Introduction au scheduling',
                        title_en: 'Introduction to Scheduling',
                        title_ar: 'مقدمة في الجدولة',
                        duration: 30,
                        order: 31,
                        content: "cron, Windows Task Scheduler, launchd. Concepts de base de la planification de tâches. Outils disponibles.",
                        content_en: "cron, Windows Task Scheduler, launchd. Basic task scheduling concepts. Available tools.",
                        content_ar: "cron و Windows Task Scheduler و launchd.",
                    },
                    {
                        title: 'Scheduling avec Python',
                        title_en: 'Scheduling with Python',
                        title_ar: 'الجدولة باستخدام Python',
                        duration: 40,
                        order: 32,
                        content: "schedule library et time.sleep. Création de tâches récurrentes. Gestion du temps. Exemples pratiques.",
                        content_en: "schedule library and time.sleep. Creating recurring tasks. Time management. Practical examples.",
                        content_ar: "مكتبة الجدولة و time.sleep.",
                    },
                    {
                        title: 'Google Cloud Functions',
                        title_en: 'Google Cloud Functions',
                        title_ar: 'Google Cloud Functions',
                        duration: 45,
                        order: 33,
                        content: "Déployer sur Google Cloud Platform. Serverless functions. Triggers HTTP. Intégration avec Sheets API.",
                        content_en: "Deploy on Google Cloud Platform. Serverless functions. HTTP triggers. Integration with Sheets API.",
                        content_ar: "النشر على Google Cloud Platform.",
                    },
                    {
                        title: 'Google Apps Script integration',
                        title_en: 'Google Apps Script Integration',
                        title_ar: 'تكامل Google Apps Script',
                        duration: 35,
                        order: 34,
                        content: "Combiner Python et Apps Script. Webhooks. Communication inter-services. Avantages de chaque approche.",
                        content_en: "Combine Python and Apps Script. Webhooks. Inter-service communication. Advantages of each approach.",
                        content_ar: "دمج Python و Apps Script.",
                    },
                    {
                        title: 'Monitoring et alertes',
                        title_en: 'Monitoring and Alerts',
                        title_ar: 'المراقبة والتنبيهات',
                        duration: 30,
                        order: 35,
                        content: "Notifications par email en cas d'erreur. Logging structuré. Alertes sur échec. Tableau de bord de monitoring.",
                        content_en: "Email notifications on error. Structured logging. Failure alerts. Monitoring dashboard.",
                        content_ar: "إشعارات بالبريد الإلكتروني عند الخطأ.",
                    },
                    // ===== MODULE 8: Intégrations Google =====
                    {
                        title: 'Intégration Google Forms',
                        title_en: 'Google Forms Integration',
                        title_ar: 'تكامل Google Forms',
                        duration: 40,
                        order: 36,
                        content: "Récupérer les réponses automatiquement. Forms API. Auto-sync des réponses vers Sheets. Analyse des réponses.",
                        content_en: "Retrieve form responses automatically. Forms API. Auto-sync responses to Sheets. Response analysis.",
                        content_ar: "استرجاع استجابات النموذج تلقائياً.",
                    },
                    {
                        title: 'Intégration Gmail',
                        title_en: 'Gmail Integration',
                        title_ar: 'تكامل Gmail',
                        duration: 45,
                        order: 37,
                        content: "Envoyer des emails depuis Sheets. Gmail API. Templates d'emails. Pièces jointes. Suivi des emails.",
                        content_en: "Send emails from Sheets. Gmail API. Email templates. Attachments. Email tracking.",
                        content_ar: "إرسال رسائل بريد إلكتروني من Sheets.",
                    },
                    {
                        title: 'Intégration Google Drive',
                        title_en: 'Google Drive Integration',
                        title_ar: 'تكامل Google Drive',
                        duration: 40,
                        order: 38,
                        content: "Sauvegarder et exporter des fichiers. Drive API. Gestion des dossiers. Permissions de partage. Versioning.",
                        content_en: "Save and export files. Drive API. Folder management. Sharing permissions. Versioning.",
                        content_ar: "حفظ وتصدير الملفات.",
                    },
                    {
                        title: 'Google Slides Automation',
                        title_en: 'Google Slides Automation',
                        title_ar: 'أتمتة Google Slides',
                        duration: 35,
                        order: 39,
                        content: "Générer des présentations depuis Sheets. Slides API. Templates de présentation. Mise à jour automatique.",
                        content_en: "Generate presentations from Sheets. Slides API. Presentation templates. Automatic update.",
                        content_ar: "إنشاء عروض تقديمية من Sheets.",
                    },
                    {
                        title: 'Workflow multi-services complet',
                        title_en: 'Complete Multi-Service Workflow',
                        title_ar: 'سير عمل متكامل متعدد الخدمات',
                        duration: 50,
                        order: 40,
                        content: "Chaîner Forms → Sheets → Email → Drive. Projet complet d'intégration. Gestion des erreurs. Monitoring.",
                        content_en: "Chain Forms → Sheets → Email → Drive. Complete integration project. Error handling. Monitoring.",
                        content_ar: "سلسلة Forms → Sheets → Email → Drive.",
                    },
                    // ===== MODULE 9: Projets Pratiques =====
                    {
                        title: 'Projet 1: Système de facturation',
                        title_en: 'Project 1: Invoicing System',
                        title_ar: 'المشروع 1: نظام فوترة',
                        duration: 50,
                        order: 41,
                        content: "Créer un générateur de factures automatique. Calcul des totaux avec TVA. Génération de PDF. Envoi par email. Suivi des paiements.",
                        content_en: "Create an automatic invoice generator. Total calculation with VAT. PDF generation. Email sending. Payment tracking.",
                        content_ar: "إنشاء مولد فواتير تلقائي.",
                    },
                    {
                        title: 'Projet 2: Dashboard de ventes',
                        title_en: 'Project 2: Sales Dashboard',
                        title_ar: 'المشروع 2: لوحة تحكم المبيعات',
                        duration: 50,
                        order: 42,
                        content: "Suivi des ventes en temps réel. Graphiques dynamiques. KPIs de vente. Prévisions de ventes. Alertes sur objectifs.",
                        content_en: "Real-time sales tracking. Dynamic charts. Sales KPIs. Sales forecasts. Target alerts.",
                        content_ar: "تتبع المبيعات في الوقت الفعلي.",
                    },
                    {
                        title: 'Projet 3: Gestion de stock',
                        title_en: 'Project 3: Inventory Management',
                        title_ar: 'المشروع 3: إدارة المخزون',
                        duration: 50,
                        order: 43,
                        content: "Système d'inventaire avec alertes. Suivi des niveaux de stock. Points de réapprovisionnement. Historique des mouvements.",
                        content_en: "Inventory system with alerts. Stock level tracking. Reorder points. Movement history.",
                        content_ar: "نظام مخزون مع تنبيهات.",
                    },
                    {
                        title: 'Projet 4: Sondage et analyse',
                        title_en: 'Project 4: Survey and Analysis',
                        title_ar: 'المشروع 4: استطلاع وتحليل',
                        duration: 50,
                        order: 44,
                        content: "Enquête automatique avec rapports. Forms → Sheets → Analyse dashboard. Visualisation des résultats. Export des données.",
                        content_en: "Automated survey with reports. Forms → Sheets → Analysis dashboard. Results visualization. Data export.",
                        content_ar: "استطلاع تلقائي مع تقارير.",
                    },
                    {
                        title: 'Projet 5: CRM léger',
                        title_en: 'Project 5: Lightweight CRM',
                        title_ar: 'المشروع 5: CRM خفيف',
                        duration: 40,
                        order: 45,
                        content: "Gestion de relations clients simple. Base de données clients. Historique des interactions. Suivi des follow-ups. Pipeline de ventes.",
                        content_en: "Simple customer relationship management. Client database. Interaction history. Follow-up tracking. Sales pipeline.",
                        content_ar: "إدارة علاقات عملاء بسيطة.",
                    },
                    // ===== MODULE 10: Déploiement =====
                    {
                        title: 'Structure de projet professionnelle',
                        title_en: 'Professional Project Structure',
                        title_ar: 'بنية المشروع الاحترافية',
                        duration: 35,
                        order: 46,
                        content: "Organiser son code pour la production. Modularité. Configuration avec .env. Séparation des couches. Tests unitaires.",
                        content_en: "Organize code for production. Modularity. Configuration with .env. Layer separation. Unit tests.",
                        content_ar: "تنظيم الكود للإنتاج.",
                    },
                    {
                        title: 'Gestion des secrets et sécurité',
                        title_en: 'Secrets Management and Security',
                        title_ar: 'إدارة الأسرار والأمان',
                        duration: 35,
                        order: 47,
                        content: "Protéger ses credentials et API keys. Variables d'environnement. Encryption. Rotation des clés. Principes de sécurité.",
                        content_en: "Protect credentials and API keys. Environment variables. Encryption. Key rotation. Security principles.",
                        content_ar: "حماية بيانات الاعتماد ومفاتيح API.",
                    },
                    {
                        title: 'Tests et debugging',
                        title_en: 'Testing and Debugging',
                        title_ar: 'الاختبار وتصحيح الأخطاء',
                        duration: 40,
                        order: 48,
                        content: "pytest, logging, error handling. Tests unitaires et d'intégration. Debugging avec pdb. Monitoring en production.",
                        content_en: "pytest, logging, error handling. Unit and integration tests. Debugging with pdb. Production monitoring.",
                        content_ar: "pytest و logging و معالجة الأخطاء.",
                    },
                    {
                        title: 'Documentation et maintenance',
                        title_en: 'Documentation and Maintenance',
                        title_ar: 'التوثيق والصيانة',
                        duration: 35,
                        order: 49,
                        content: "Documenter ses scripts automatisés. Docstrings. README complet. Versioning. Stratégies de maintenance.",
                        content_en: "Document automated scripts. Docstrings. Complete README. Versioning. Maintenance strategies.",
                        content_ar: "توثيق البرامج النصية الآلية.",
                    },
                    {
                        title: 'Déploiement en production',
                        title_en: 'Production Deployment',
                        title_ar: 'النشر في الإنتاج',
                        duration: 35,
                        order: 50,
                        content: "Mettre en ligne ses automatisations. CI/CD. Monitoring. Scaling. Gestion des mises à jour. Support et maintenance.",
                        content_en: "Deploy automations online. CI/CD. Monitoring. Scaling. Update management. Support and maintenance.",
                        content_ar: "نشر الأتمتة عبر الإنترنت.",
                    }
                ]
            }
        }
    });

    console.log('✅ Python & Google Sheets Automation course created/updated successfully!');
    console.log('   📚 Course: Python & Google Sheets: Automatisation Complète des Données');
    console.log('   📝 Slug: python-google-sheets-automation');
    console.log('   📖 Lessons: 50 lessons across 10 modules');
    console.log('   ⏱️ Duration: 28h 30m');
    console.log('   📊 Level: Advanced');
    console.log('   🌍 Languages: French, English, Arabic');
    console.log('   💰 Price: FREE');
    console.log('');
    console.log('Course image: /courses/python_google_sheets_icon.png');
    console.log("Don't forget to run: node prisma/seed_google_sheets_simple.js");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error seeding course:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
