require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Génération de l\'Encyclopédie / Masterclass Finale Power BI (12 Leçons Complètes + 13 Captures UI)...')

    const slug = 'power-bi-business-intelligence-data-analytics'
    
    // Supprimer l'ancienne version si elle existe
    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) {
        console.log(`ℹ️ Suppression préalable de l'ancienne version de "${slug}"...`)
        await prisma.course.delete({ where: { slug } })
    }

    const learningOutcomes = [
        "Prendre en main l'interface officielle complète de Microsoft Power BI Desktop et Power BI Service",
        "Importer, nettoyer, dépoussiérer et transformer des données brutes complexes avec l'éditeur Power Query (ETL) et le langage M",
        "Dépivoter des tables complexes (Unpivot), fusionner (Merge) et combiner (Append) des fichiers Excel multiples",
        "Concevoir un modèle de données relationnel performant selon le schéma en étoile (Star Schema, Tables de Faits & Dimensions)",
        "Générer une table calendrier automatique en DAX avec la fonction CALENDARAUTO() et gérer les hiérarchies temporelles",
        "Maîtriser le langage DAX (Data Analysis Expressions) pour créer des colonnes calculées et des mesures dynamiques réactives",
        "Utiliser les fonctions DAX d'élite : CALCULATE, FILTER, ALL, ALLEXCEPT, KEEPFILTERS et USERELATIONSHIP",
        "Maîtriser les fonctions DAX Time Intelligence : SAMEPERIODLASTYEAR, TOTALYTD, DATEADD, DATESBETWEEN et PARALLELPERIOD",
        "Construire des tableaux de bord modernes au design Dark Mode / Glassmorphism étape par étape avec 13 captures d'écran UI réelles",
        "Configurer les filtres Slicers horizontaux sous forme de boutons tuiles, les cartes KPI luminescentes et les graphiques conditionnels",
        "Mettre en place l'interactivité avancée : Drill-Through, Tooltips personnalisés au survol de la souris et Signets (Bookmarks)",
        "Sécuriser les données avec la Sécurité au Niveau des Lignes (RLS - Row Level Security) et Dynamic RLS (USERPRINCIPALNAME)",
        "Publier sur le Cloud Power BI Service, créer des Espaces de travail (Workspaces) et configurer l'actualisation automatique avec On-Premise Data Gateway"
    ]

    const learningOutcomes_en = [
        "Master Microsoft Power BI Desktop and Power BI Service platform",
        "Import, clean, and transform complex raw data using Power Query Editor (ETL) and M language",
        "Unpivot complex tables, merge datasets, and append multiple Excel files seamlessly",
        "Design high-performance relational data models using Star Schema methodology",
        "Generate automatic Date tables using DAX CALENDARAUTO() and manage date hierarchies",
        "Master DAX (Data Analysis Expressions) to write calculated columns and dynamic measures",
        "Use advanced DAX functions: CALCULATE, FILTER, ALL, ALLEXCEPT, KEEPFILTERS, and USERELATIONSHIP",
        "Master Time Intelligence DAX: SAMEPERIODLASTYEAR, TOTALYTD, DATEADD, and DATESBETWEEN",
        "Create step-by-step modern dark mode enterprise dashboards with 13 real UI screenshots",
        "Configure horizontal Tile Slicers, glowing KPI Cards, and conditional formatting bar charts",
        "Implement advanced interactivity: Drill-Through, Custom Hover Tooltips, and Bookmarks",
        "Implement Row-Level Security (RLS) and Dynamic RLS with USERPRINCIPALNAME()",
        "Publish reports to Power BI Service Cloud and configure scheduled refresh with Data Gateway"
    ]

    const learningOutcomes_ar = [
        "إتقان واجهة Microsoft Power BI Desktop وخدمة Power BI Service السحابية بالكامل",
        "استيراد وتنظيف وتحويل البيانات المعقدة باستخدام محرر Power Query (ETL) ولغة M",
        "إلغاء محور الأسطر (Unpivot)، دمج الجداول (Merge) وتجميع الملفات المتعددة (Append)",
        "تصميم نموذج بيانات علاقاتي عالي الأداء وفق مخطط النجمة (Star Schema)",
        "إنشاء جدول تقويم تلقائي في DAX باستخدام CALENDARAUTO() وإدارة السلاسل الزمنية",
        "إتقان لغة DAX لكتابة الأعمدة المحسوبة والمقاييس التفاعلية عالية الأداء",
        "استخدام دالات DAX المتقدمة: CALCULATE، FILTER، ALL، ALLEXCEPT و KEEPFILTERS",
        "إتقان دالات التحليل الزمني DAX Time Intelligence مثل SAMEPERIODLASTYEAR و TOTALYTD",
        "إنشاء لوحات قياس حديثة بتصميم عصري خطوة بخطوة بـ 13 صورة توضيحية رسمية",
        "إعداد الفلاتر الأفقية، بطاقات KPI التفاعلية، والمخططات البيانية الشرطية",
        "إعداد التفاعلية المتقدمة: التمرير للعمق (Drill-Through)، التلميحات المخصصة والمرجعيات (Bookmarks)",
        "إعداد الأمان على مستوى الصفوف (RLS) والأمان الديناميكي بـ USERPRINCIPALNAME",
        "نشر التقارير على Power BI Cloud وتفعيل التحديث التلقائي عبر بوابة Data Gateway"
    ]

    const requirements = [
        "Aucun prérequis technique nécessaire ! Les débutants complets en Business Intelligence sont les bienvenus.",
        "Connaissances de base en utilisation d'Excel (formules de base, tableaux) vivement recommandées.",
        "Ordinateur sous Windows (ou Machine Virtuelle Windows sous Mac) pour installer Power BI Desktop."
    ]

    const fullDescription = `# Encyclopédie & Masterclass Finale Power BI & Business Intelligence

## Le Guide Ultime & Complet : De Débutant Absolu à Data Analyst Certifié Power BI

Microsoft **Power BI** est le leader mondial incontesté des outils d'analyse de données et de Business Intelligence (BI). Utilisé par des millions d'entreprises à travers le monde, il permet de transformer des bases de données brutes et complexes en **tableaux de bord interactifs visuellement captivants au design moderne** et d'aide à la décision stratégique.

Cette formation 100% pratique regroupe **12 Leçons Complètes** et vous accompagne étape par étape depuis la première ouverture de **Power BI Desktop** jusqu'à la modélisation en étoile, l'éditeur **Power Query (ETL)**, le langage **M**, la maîtrise approfondie du langage **DAX**, la création de dashboards modernes Glassmorphism avec **13 captures d'écran UI réelles**, la sécurité **RLS** et la publication Cloud sur **Power BI Service**.

---

### 🖼️ Aperçu du Résultat d'un Dashboard Power BI Moderne (Design Dark Mode Enterprise) :

![Dashboard Power BI Moderne](/courses/powerbi_modern_dashboard.png)

---

### 💡 Pourquoi cette formation est l'Encyclopédie ultime de Power BI ?

1. **🎯 12 Leçons Exhaustives** : Couvre l'intégralité du programme officiel de certification Microsoft PL-300 (Power BI Data Analyst).
2. **📸 13 Captures d'Écran d'Interface Réelles** : Chaque concept complexe est illustré par des captures d'écran de l'interface officielle de Power BI Desktop.
3. **🎨 Guide de Design Moderne Étape par Étape** : Apprenez à concevoir des tableaux de bord élégants, structurés et ergonomiques qui impressionneront vos décideurs et clients.
4. **🧪 TP Interactif Intégré dans le Navigateur** : Chaque leçon comprend un **Atelier TP Power BI interactif** directement dans le cours pour manipuler les données et tester vos formules DAX en direct !
`

    const course = await prisma.course.create({
        data: {
            title: "Power BI & Business Intelligence : Data Analytics, DAX & Dashboards Interactifs",
            title_en: "Power BI & Business Intelligence: Data Analytics, DAX & Interactive Dashboards",
            title_ar: "Power BI وتحليل البيانات: الذكاء الاصطناعي للأعمال، لغة DAX ولوحات القياس التفاعلية",
            slug: slug,
            description: "La Masterclass Ultime Power BI en 12 leçons : Power Query (ETL), Langage M, Modélisation Star Schema, DAX Avancé, Time Intelligence, Design Moderne pas-à-pas avec 13 captures d'écran réelles, RLS & Cloud Power BI Service.",
            description_en: "The Ultimate 12-Lesson Power BI Masterclass: Power Query (ETL), M language, Star Schema Modeling, Advanced DAX, Time Intelligence, Step-by-step Modern Design with 13 real screenshots, RLS & Power BI Service Cloud.",
            description_ar: "الدورة الشاملة في Power BI من 12 درساً: Power Query (ETL)، لغة M، نمذجة البيانات، DAX المتقدم، التحليل الزمني، تصميم عصري خطوة بخطوة بـ 13 صورة توضيحية والأمان السحابي.",
            fullDescription: fullDescription,
            price: 0,
            isFree: true,
            isPublished: true,
            level: "Débutant à Expert",
            duration: "24h 30m",
            image: "/courses/powerbi_dashboard.png",
            learningOutcomes: JSON.stringify(learningOutcomes),
            learningOutcomes_en: JSON.stringify(learningOutcomes_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes_ar),
            requirements: JSON.stringify(requirements),
            requirements_en: JSON.stringify(requirements),
            requirements_ar: JSON.stringify(requirements),
            lessons: {
                create: [
                    {
                        order: 1,
                        title: "Leçon 1 : Prise en Main de Power BI Desktop & Navigation dans l'Interface Officielle",
                        title_en: "Lesson 1: Getting Started with Power BI Desktop & Official Interface Navigation",
                        title_ar: "الدرس 1: البدء مع Power BI Desktop والتنقل في الواجهة الرسمية",
                        duration: 110,
                        isFree: true,
                        content: `# Leçon 1 : Prise en Main de Power BI Desktop & Navigation dans l'Interface Officielle

## 💡 1. Qu'est-ce que la Business Intelligence (BI) ?

La **Business Intelligence** désigne l'ensemble des technologies et processus permettant d'analyser les données brutes d'une entreprise pour les transformer en informations stratégiques exploitables.

### 🖼️ Capture Écran 1.1 : Vue de l'Interface Officielle Microsoft Power BI Desktop

![Interface Power BI Desktop](/courses/powerbi_dashboard.png)

### 📌 Étape par Étape : Les 3 Vues Principales de Power BI Desktop

1. **Vue Rapport (Report View - Icône Graphique)** :
   - C'est votre zone de dessin principale. Vous y disposez les graphiques, cartes KPI, tables et segmentations de données (*Slicers*).
2. **Vue Données (Data View - Icône Table)** :
   - Permet d'inspecter le contenu brut de vos tables Excel ou SQL importées.
3. **Vue Modèle (Model View - Icône Réseau)** :
   - Zone visuelle permettant d'établir les relations (1 à Plusieurs) entre vos différentes tables.

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 1.1 — Prise en Main & Exploration du Rapport Power BI",
  "dax": "Chiffre_Affaires = SUM(Ventes[Montant])",
  "daxHelp": "Mesure d'agrégation du Chiffre d'Affaires total généré par l'entreprise."
}
\`\`\`
`
                    },
                    {
                        order: 2,
                        title: "Leçon 2 : Importation & Nettoyage de Données avec l'Éditeur Power Query (ETL)",
                        title_en: "Lesson 2: Data Import & Cleaning with Power Query Editor (ETL)",
                        title_ar: "الدرس 2: استيراد البيانات وتنظيفها باستخدام محرر Power Query (ETL)",
                        duration: 135,
                        isFree: true,
                        content: `# Leçon 2 : Importation & Nettoyage de Données avec l'Éditeur Power Query (ETL)

## 💡 1. Le Processus ETL (Extract, Transform, Load) étape par étape

Avant de créer des graphiques, les données brutes issues de fichiers Excel ou de bases de données doivent être nettoyées et structurées. **Power Query** est le moteur ETL intégré à Power BI.

### 🖼️ Capture Écran 2.1 : L'Éditeur Power Query en Action

![Interface Power Query ETL](/courses/powerbi_powerquery_etl.png)

---

## 🛠️ Étape par Étape : Les Actions de Nettoyage Essentielles dans Power Query

1. **Promouvoir la première ligne comme en-têtes** : *Accueil -> Utiliser la première ligne comme en-têtes*.
2. **Supprimer les lignes vides ou erronées** : *Accueil -> Supprimer les lignes -> Supprimer les lignes vides*.
3. **Changer le type de données de chaque colonne** : Définir explicitement les colonnes texte, date, nombre entier ou monnaie.
4. **Supprimer les colonnes inutiles** pour optimiser les performances de la mémoire RAM.

---

## ⚡ 3. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 2.1 — Nettoyage de Données & Filtrage par Catégorie",
  "dax": "Total_Commandes = COUNT(Ventes[ID_Commande])",
  "daxHelp": "Mesure DAX comptabilisant le nombre total de commandes nettoyées."
}
\`\`\`
`
                    },
                    {
                        order: 3,
                        title: "Leçon 3 : Transformations Avancées dans Power Query (Unpivot, Merge, Append & Langage M)",
                        title_en: "Lesson 3: Advanced Power Query Transformations (Unpivot, Merge, Append & M Language)",
                        title_ar: "الدرس 3: التحويلات المتقدمة في Power Query (Unpivot، Merge، Append ولغة M)",
                        duration: 145,
                        isFree: false,
                        content: `# Leçon 3 : Transformations Avancées dans Power Query (Unpivot, Merge, Append & Langage M)

## 💡 1. Dépivoter des Colonnes (Unpivot Columns) & Fusionner des Tables

Très souvent, les tableaux Excel reçus en entreprise ont des mois disposés en colonnes (Janvier, Février, Mars...). Pour pouvoir créer un tableau de bord dynamique dans Power BI, il est impératif de **dépivoter (Unpivot)** ces colonnes pour les convertir en lignes !

### 🖼️ Capture Écran 3.1 : Éditeur Avancé et Code M dans Power Query

![Code M Power Query](/courses/powerbi_step6_powerquery_m.png)

---

## 💻 Exemple de Script M Avancé (Power Query Formula Language)

\`\`\`powerquery
let
    Source = Excel.Workbook(File.Contents("C:\\Data\\Ventes_Mensuelles.xlsx"), null, true),
    Table1_Sheet = Source{[Item="Ventes2026",Kind="Sheet"]}[Data],
    PromotedHeaders = Table.PromoteHeaders(Table1_Sheet, [PromoteAllScalars=true]),
    // Dépivotage des colonnes mensuelles en 2 colonnes : "Mois" et "Montant"
    UnpivotedColumns = Table.UnpivotOtherColumns(PromotedHeaders, {"ID_Produit", "Region"}, "Mois", "Montant_DZD"),
    ChangedType = Table.TransformColumnTypes(UnpivotedColumns,{{"Montant_DZD", Currency.Type}})
in
    ChangedType
\`\`\`

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 3.1 — Dépivotage & Transformation Power Query",
  "dax": "Chiffre_Affaires_M = SUM(Ventes[Montant_DZD])",
  "daxHelp": "Mesure DAX évaluant le montant agrégé après dépivotage des colonnes."
}
\`\`\`
`
                    },
                    {
                        order: 4,
                        title: "Leçon 4 : Modélisation de Données & Architecture en Étoile (Star Schema)",
                        title_en: "Lesson 4: Data Modeling & Star Schema Architecture",
                        title_ar: "الدرس 4: نمذجة البيانات وتطوير مخطط النجمة (Star Schema)",
                        duration: 140,
                        isFree: false,
                        content: `# Leçon 4 : Modélisation de Données & Architecture en Étoile (Star Schema)

## 💡 1. Conception d'un Modèle Relationnel Performant

La modélisation consiste à relier plusieurs tables entre elles. La référence absolue dans l'industrie est le **Schéma en Étoile (Star Schema)**.

### 🖼️ Capture Écran 4.1 : Vue Modèle et Schéma en Étoile dans Power BI Desktop

![Vue Modèle Star Schema](/courses/powerbi_data_modeling.png)

---

## 📌 Étape par Étape : Différence entre Tables de Faits et Tables de Dimensions

1. **Table de Faits (Fact Table - au centre)** :
   - Contient les métriques numériques transactionnelles (ex: FactVentes avec montant, quantité, date et clés étrangères).
2. **Tables de Dimensions (Dimension Tables - autour)** :
   - Contiennent les axes d'analyse textuels pour filtrer (ex: DimClient, DimProduit, DimRegion, DimCalendrier).
3. **Création des Relations (1 à Plusieurs)** :
   - Faites glisser la clé primaire de la table de dimension (ex: ID_Client) vers la clé étrangère de la table de faits.

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 4.1 — Validation du Modèle Relationnel & Agrégations",
  "dax": "Marge_Moyenne_Pct = AVERAGE(Ventes[Marge_Pct])",
  "daxHelp": "Mesure DAX évaluant la rentabilité moyenne en pourcentage."
}
\`\`\`
`
                    },
                    {
                        order: 5,
                        title: "Leçon 5 : Création d'une Table Calendrier Automatique en DAX & Gestion des Dates",
                        title_en: "Lesson 5: Automatic DAX Calendar Table Generation & Date Intelligence Setup",
                        title_ar: "الدرس 5: إنشاء جدول تقويم تلقائي في DAX وإدارة التواريخ",
                        duration: 135,
                        isFree: false,
                        content: `# Leçon 5 : Création d'une Table Calendrier Automatique en DAX & Gestion des Dates

## 💡 1. Pourquoi créer une Table Calendrier Dédiée (DimDate) ?

Pour que les fonctions DAX de **Time Intelligence** (comparaison N vs N-1, YTD) fonctionnent sans erreur, il est obligatoire d'avoir une table de dates continue, sans trou, marquée comme **Table de Dates officielle**.

### 🖼️ Capture Écran 5.1 : Génération de la Table DimCalendrier dans la Vue Données

![Table Calendrier DAX](/courses/powerbi_step7_calendar_table.png)

---

## 💻 Formule DAX Complète pour créer la Table Calendrier

\`\`\`dax
DimCalendrier = 
ADDCOLUMNS (
    CALENDARAUTO(),
    "Annee", YEAR([Date]),
    "Mois_Num", MONTH([Date]),
    "Nom_Mois", FORMAT([Date], "mmmm"),
    "Trimestre", "T" & FORMAT([Date], "q"),
    "Semaine_Num", WEEKNUM([Date]),
    "Jour_Semaine", FORMAT([Date], "dddd")
)
\`\`\`

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 5.1 — Intégration de la Table DimCalendrier dans le Modèle",
  "dax": "Ventes_Par_Annee = CALCULATE(SUM(Ventes[Montant]))",
  "daxHelp": "Liaison de la table de faits à la table DimCalendrier sur le champ Date."
}
\`\`\`
`
                    },
                    {
                        order: 6,
                        title: "Leçon 6 : Les Fondations du Langage DAX (Calculated Columns vs Measures)",
                        title_en: "Lesson 6: DAX Foundations (Calculated Columns vs Measures)",
                        title_ar: "الدرس 6: أساسيات لغة DAX (الأعمدة المحسوبة مقابل المقاييس)",
                        duration: 150,
                        isFree: false,
                        content: `# Leçon 6 : Les Fondations du Langage DAX (Calculated Columns vs Measures)

## 💡 1. Colonne Calculée vs Mesure DAX : Quelle Différence ?

Le langage **DAX (Data Analysis Expressions)** est le moteur de formule de Power BI.

- **Colonne Calculée** : Évaluée ligne par ligne lors de l'actualisation des données. Stockée physiquement en mémoire RAM.
- **Mesure DAX** : Calculée dynamiquement à la volée en fonction des filtres sélectionnés par l'utilisateur sur le rapport.

---

## 💻 Formules DAX de Base

\`\`\`dax
// 1. Colonne Calculée (Calcul ligne par ligne)
Montant_TTC = Ventes[Montant_HT] * (1 + Ventes[Taux_TVA])

// 2. Mesure DAX (Agrégation dynamique)
Chiffre_Affaires_Total = SUM(Ventes[Montant_HT])

// 3. Mesure DAX avec fonction DIVIDE sécurisée
Ratio_Marge = DIVIDE(SUM(Ventes[Marge_Brute]), [Chiffre_Affaires_Total], 0)
\`\`\`

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 6.1 — Écriture & Évaluation de Mesures DAX de Base",
  "dax": "Ratio_Marge = DIVIDE([Total_Marge], [Chiffre_Affaires], 0)",
  "daxHelp": "Formule DAX sécurisée évitant les erreurs de division par zéro."
}
\`\`\`
`
                    },
                    {
                        order: 7,
                        title: "Leçon 7 : Fonctions DAX Avancées (CALCULATE, FILTER, ALL, ALLEXCEPT & KEEPFILTERS)",
                        title_en: "Lesson 7: Advanced DAX Functions (CALCULATE, FILTER, ALL, ALLEXCEPT & KEEPFILTERS)",
                        title_ar: "الدرس 7: دالات DAX المتقدمة (CALCULATE، FILTER، ALL، ALLEXCEPT و KEEPFILTERS)",
                        duration: 165,
                        isFree: false,
                        content: `# Leçon 7 : Fonctions DAX Avancées (CALCULATE, FILTER, ALL, ALLEXCEPT & KEEPFILTERS)

## 💡 1. Maîtriser le Contexte de Filtre avec CALCULATE

\`CALCULATE\` est la fonction reine de DAX. Elle permet d'évaluer une expression tout en modifiant le contexte de filtre courant.

### 🖼️ Capture Écran 7.1 : Édition d'une Mesure DAX Avancée dans la Barre de Formule

![Mesure DAX Avancée](/courses/powerbi_step8_advanced_dax.png)

---

## 💻 Exemples DAX Avancés

\`\`\`dax
// 1. Calcul du Chiffre d'Affaires pour la région Alger uniquement
Ventes_Alger = CALCULATE(
    [Chiffre_Affaires_Total],
    DimRegion[Nom_Region] = "Alger"
)

// 2. Calcul du pourcentage du total avec la fonction ALL
Pct_Du_Total = DIVIDE(
    [Chiffre_Affaires_Total],
    CALCULATE([Chiffre_Affaires_Total], ALL(Ventes)),
    0
)

// 3. Conserver tous les filtres SAUF la région avec ALLEXCEPT
Ventes_Ignorer_Filtre_Region = CALCULATE(
    [Chiffre_Affaires_Total],
    ALLEXCEPT(Ventes, Ventes[Categorie])
)
\`\`\`

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 7.1 — Modification du Contexte de Filtre avec CALCULATE",
  "dax": "Ventes_B2B = CALCULATE(SUM(Ventes[Montant]), Ventes[Segment] == 'B2B')",
  "daxHelp": "Évaluation DAX isolant les ventes sur le segment B2B."
}
\`\`\`
`
                    },
                    {
                        order: 8,
                        title: "Leçon 8 : Fonctions DAX Time Intelligence (SAMEPERIODLASTYEAR, TOTALYTD, DATEADD)",
                        title_en: "Lesson 8: DAX Time Intelligence Functions (SAMEPERIODLASTYEAR, TOTALYTD, DATEADD)",
                        title_ar: "الدرس 8: دالات التحليل الزمني DAX Time Intelligence (SAMEPERIODLASTYEAR، TOTALYTD)",
                        duration: 160,
                        isFree: false,
                        content: `# Leçon 8 : Fonctions DAX Time Intelligence (SAMEPERIODLASTYEAR, TOTALYTD, DATEADD)

## 💡 1. Analyser les Performances Temporelles (N vs N-1 & YTD)

Les fonctions de **Time Intelligence** permettent de comparer facilement les performances du mois ou de l'année en cours par rapport à la même période de l'année précédente.

### 🖼️ Capture Écran 8.1 : Comparaison Temporelle N vs N-1 dans un Graphique de Tendance

![Time Intelligence DAX](/courses/powerbi_step9_time_intelligence.png)

---

## 💻 Formules DAX Time Intelligence Incontournables

\`\`\`dax
// 1. Cumul Annuel à Date (Year-To-Date - YTD)
CA_YTD = TOTALYTD([Chiffre_Affaires_Total], DimCalendrier[Date])

// 2. Ventes de l'année précédente (SAMEPERIODLASTYEAR)
CA_Annee_N_Minus_1 = CALCULATE(
    [Chiffre_Affaires_Total],
    SAMEPERIODLASTYEAR(DimCalendrier[Date])
)

// 3. Croissance en pourcentage par rapport à l'année précédente
Croissance_Pct_N_Minus_1 = DIVIDE(
    [Chiffre_Affaires_Total] - [CA_Annee_N_Minus_1],
    [CA_Annee_N_Minus_1],
    0
)
\`\`\`

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 8.1 — Évaluation de la Croissance Temporelle N vs N-1",
  "dax": "Croissance_YTD = DIVIDE([CA_YTD] - [CA_N_1], [CA_N_1], 0)",
  "daxHelp": "Formule DAX évaluant la croissance en pourcentage."
}
\`\`\`
`
                    },
                    {
                        order: 9,
                        title: "Leçon 9 : GUIDE ULTRA DÉTAILLÉ : Créer un Dashboard Moderne Étape par Étape (avec Captures d'Écran)",
                        title_en: "Lesson 9: ULTRA DETAILED STEP-BY-STEP GUIDE: Building a Modern Dashboard (with UI Screenshots)",
                        title_ar: "الدرس 9: دليل تفصيلي خطوة بخطوة: بناء لوحة قياس حديثة بالكامل (مع الصور التوضيحية)",
                        duration: 180,
                        isFree: false,
                        content: `# Leçon 9 : GUIDE ULTRA DÉTAILLÉ : Créer un Dashboard Moderne Étape par Étape (avec Captures d'Écran)

Bienvenue dans le tutoriel masterclass complet. Dans cette leçon, nous allons construire de A à Z un **Tableau de Bord Exécutif Dark Mode au design moderne d'entreprise**.

---

### 🎨 RÉSULTAT FINAL DU DASHBOARD MODERNE :

![Dashboard Moderne Final Power BI](/courses/powerbi_modern_dashboard.png)

---

## 📌 ÉTAPE 1 : Configuration du Canva et Thème Dark Mode

### 🖼️ Capture Écran 9.1 : Paramétrage du Fond du Canva (#090D16)

![Étape 1 : Configuration Canva](/courses/powerbi_step1_canvas_setup.png)

### Actions Pas-à-Pas :
1. Dans la zone de rapport, cliquez sur un espace vide du Canva.
2. Ouvrez le panneau **Format de la page (Format Page)** situé à droite.
3. Déroulez le menu **Arrière-plan du Canva (Canvas Background)**.
4. Sélectionnez la couleur personnalisée : **\`#090D16\`** (Bleu nuit très sombre).
5. Mettez la **Transparence à 0%** (par défaut Power BI la met à 100%).
6. Dans **Affichage (View)**, activez **Aligner sur la grille (Snap to Grid)** pour un alignement parfait de vos cartes.

---

## 📌 ÉTAPE 2 : Création des Cartes KPI Clés (Key Performance Indicators)

### 🖼️ Capture Écran 9.2 : Insertion et Formatage des Cartes KPI

![Étape 2 : Cartes KPI](/courses/powerbi_step2_kpi_cards.png)

### Actions Pas-à-Pas :
1. Dans le panneau **Visualisations**, cliquez sur l'icône **Carte (Card - 123)**.
2. Glissez-déposez la mesure DAX **\`[Chiffre_Affaires_Total]\`** dans le champ **Champs (Fields)**.
3. Allez dans **Format du visuel -> Général -> Effets (Effects)** :
   - **Arrière-plan** : Couleur noire avec transparence à 40%.
   - **Bordure visuelle** : Activez, couleur blanche avec transparence 80% et **Rayon des coins à 12px**.
   - **Ombre portée** : Activez avec couleur Dorée/Cyan pour créer un effet néon luminescent.
4. Réglez la taille de la police de la valeur (*Callout Value*) à **28pt Bold** de couleur Dorée **\`#F59E0B\`**.

---

## 📌 ÉTAPE 3 : Création du Graphique en Barres par Région

### 🖼️ Capture Écran 9.3 : Diagramme en Barres avec Gradient

![Étape 3 : Graphique en Barres](/courses/powerbi_step3_barchart_viz.png)

### Actions Pas-à-Pas :
1. Sélectionnez le visuel **Histogramme empilé (Horizontal Bar Chart)**.
2. Glissez le champ **\`DimRegion[Nom_Region]\`** sur l'Axe Y.
3. Glissez la mesure **\`[Chiffre_Affaires_Total]\`** sur l'Axe X.
4. Allez dans **Format -> Barres (Bars) -> Couleurs** :
   - Activez les couleurs conditionnelles (fx).
   - Choisissez un dégradé allant du jaune ambré au cyan vibrant.

---

## 📌 ÉTAPE 4 : Ajout des Slicers de Filtrage Dynamique (Segmentations)

### 🖼️ Capture Écran 9.4 : Boutons de Segmentations Horizontales (Slicers)

![Étape 4 : Slicers Horizontaux](/courses/powerbi_step4_slicers.png)

### Actions Pas-à-Pas :
1. Cliquez sur l'icône **Segment (Slicer)**.
2. Glissez le champ **\`DimCalendrier[Annee]\`**.
3. Allez dans **Format du visuel -> Paramètres du segment -> Style** :
   - Changez la liste déroulante en **Tuiles (Tile)**.
   - Vos filtres deviennent de superbes boutons horizontaux interactifs !

---

## 📌 ÉTAPE 5 : Écriture & Intégration des Mesures DAX de Tendance

### 🖼️ Capture Écran 9.5 : Formule DAX et Graphique d'Évolution Temporelle

![Étape 5 : Mesure DAX Avancée](/courses/powerbi_step5_dax_measure.png)

### Actions Pas-à-Pas :
1. Dans le ruban **Accueil**, cliquez sur **Nouvelle Mesure (New Measure)**.
2. Saisissez la formule DAX dans la barre de formule :
   \`\`\`dax
   Ventes_Filtrees_2026 = CALCULATE(SUM(Ventes[Montant]), Ventes[Annee] == 2026)
   \`\`\`
3. Insérez un visuel **Graphique en courbes (Line Chart)** avec la date en Axe X et la nouvelle mesure en Axe Y.

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 9.1 — Dashboard Commercial Interactif au Design Moderne",
  "dax": "CA_Par_Region = CALCULATE(SUM(Ventes[Montant]))",
  "daxHelp": "Combinaison des visuels bar chart, donut chart et KPI cards."
}
\`\`\`
`
                    },
                    {
                        order: 10,
                        title: "Leçon 10 : Dataviz Avancée & Interactivité (Drill-Through, Tooltips Personnalisés, Bookmarks)",
                        title_en: "Lesson 10: Advanced Dataviz & Interactivity (Drill-Through, Hover Tooltips, Bookmarks)",
                        title_ar: "الدرس 10: التصور المتقدم للبيانات والتفاعلية (التمرير للعمق، التلميحات المخصصة والمرجعيات)",
                        duration: 155,
                        isFree: false,
                        content: `# Leçon 10 : Dataviz Avancée & Interactivité (Drill-Through, Tooltips Personnalisés, Bookmarks)

## 💡 1. Dépasser les Graphiques Classiques : L'Expérience Utilisateur (UX)

Pour rendre un rapport Power BI exceptionnel, vous pouvez intégrer :
- **Drill-Through (Extraction détaillée)** : Permet à l'utilisateur de faire un clic droit sur une région pour ouvrir une page de détail dédiée à cette région.
- **Tooltips Personnalisés sur Survol** : Affiche un mini-graphique miniature lorsque la souris survole une barre du diagramme.
- **Signets (Bookmarks) & Boutons d'Action** : Permettent de créer des boutons pour basculer dynamiquement entre un graphique en barres et un tableau sans changer de page !

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 10.1 — Simulation d'Interactivité & Tooltips Dynamiques",
  "dax": "Filtre_Actif = IF(ISFILTERED(Ventes[Region]), SELECTEDVALUE(Ventes[Region]), 'Toutes')",
  "daxHelp": "Mesure DAX identifiant la région sélectionnée dynamiquement par l'utilisateur."
}
\`\`\`
`
                    },
                    {
                        order: 11,
                        title: "Leçon 11 : Sécurité au Niveau des Lignes (RLS - Row Level Security & Dynamic RLS)",
                        title_en: "Lesson 11: Row-Level Security (RLS) & Dynamic RLS Setup",
                        title_ar: "الدرس 11: الأمان على مستوى الصفوف (RLS) والأمان الديناميكي",
                        duration: 140,
                        isFree: false,
                        content: `# Leçon 11 : Sécurité au Niveau des Lignes (RLS - Row Level Security & Dynamic RLS)

## 💡 1. Qu'est-ce que la Sécurité RLS dans Power BI ?

La **Row Level Security (RLS)** garantit que chaque utilisateur connecté ne voit **que les données auxquelles il a droit**, au sein d'un seul et même rapport centralisé.

---

## 💻 Configuration de la Sécurité Dynamique (Dynamic RLS)

\`\`\`dax
// Règle RLS appliquée au rôle "Responsable_Region" sur la table DimRegion :
DimRegion[Email_Responsable] = USERPRINCIPALNAME()
\`\`\`

---

## ⚡ 2. Atelier TP Interactif Power BI (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 11.1 — Simulation de Sécurité RLS et Publication Cloud",
  "dax": "CA_Securise = CALCULATE(SUM(Ventes[Montant]), USERPRINCIPALNAME())",
  "daxHelp": "Formule DAX restreignant l'accès aux données selon l'utilisateur."
}
\`\`\`
`
                    },
                    {
                        order: 12,
                        title: "Leçon 12 : Power BI Service Cloud, Gateway & Projet Capstone Final Fil Rouge 360°",
                        title_en: "Lesson 12: Power BI Service Cloud, Gateway & 360° Final Capstone Enterprise Project",
                        title_ar: "الدرس 12: خدمة Power BI Cloud والتحديث التلقائي والمشروع النهائي 360 درجة",
                        duration: 180,
                        isFree: false,
                        content: `# Leçon 12 : Power BI Service Cloud, Gateway & Projet Capstone Final Fil Rouge 360°

## 🏆 Projet Capstone Final Power BI 360°

Félicitations pour avoir atteint l'ultime étape de cette Masterclass Power BI ! Vous êtes nommé **Lead BI Consultant**.

Votre mission finale consiste à consolider l'ensemble des compétences acquises :
1. Nettoyer et transformer les jeux de données bruts dans **Power Query**.
2. Établir le **Schéma en Étoile** avec la table **DimCalendrier**.
3. Écrire les mesures **DAX Avancées** et de **Time Intelligence**.
4. Déployer le **Dashboard Exécutif Dark Mode Moderne**.
5. Appliquer la **Sécurité RLS** et publier sur **Power BI Service Cloud**.

---

## ⚡ 2. Atelier TP Final Power BI 360° (Pratique Immédiate)

\`\`\`powerbi
{
  "title": "TP 12.1 — Dashboard Exécutif Final Complexe 360°",
  "dax": "Projet_Final_Score = CALCULATE(SUM(Ventes[Montant]) * AVERAGE(Ventes[Marge_Pct]))",
  "daxHelp": "Synthèse globale des performances commerciales et financières."
}
\`\`\`
`
                    }
                ]
            }
        }
    })

    console.log(`🎉 ENCYCLOPÉDIE POWER BI CRÉÉE AVEC SUCCÈS ! 12 Leçons | Slug: ${course.slug}`)
}

main()
    .catch(e => {
        console.error('❌ Erreur :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
