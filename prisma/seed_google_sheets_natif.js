const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Creating Google Sheets Native Course...')

    // Learning Outcomes
    const learningOutcomes = [
        "Maîtriser l'interface de Google Sheets",
        "Utiliser les formules principales (SOMME, SI, RECHERCHEV, NB.SI...)",
        "Créer des tableaux croisés dynamiques pour analyser les données",
        "Générer des graphiques et visualisations percutants",
        "Importer, nettoyer et transformer des données",
        "Collaborer en temps réel avec son équipe",
        "Automatiser des tâches avec Google Apps Script (bases et avancé)",
        "Créer des tableaux de bord interactifs",
        "Utiliser les Macros pour l'automatisation",
        "Visualiser des données avec Looker Studio"
    ]

    const learningOutcomes_en = [
        "Master Google Sheets interface",
        "Use main formulas (SUM, IF, VLOOKUP, COUNTIF...)",
        "Create pivot tables to analyze data",
        "Generate impactful charts and visualizations",
        "Import, clean and transform data",
        "Collaborate in real-time with your team",
        "Automate tasks with Google Apps Script (basics)",
        "Create interactive dashboards"
    ]

    const learningOutcomes_ar = [
        "إتقان واجهة Google Sheets",
        "استخدام الصيغ الرئيسية",
        "إنشاء جداول محورية لتحليل البيانات",
        "إنشاء مخططات وتصورات مؤثرة",
        "استيراد وتنظيف وتحويل البيانات",
        "التعاون في الوقت الفعيل مع فريقك",
        "أتمتة المهام باستخدام Google Apps Script",
        "إنشاء لوحات معلومات تفاعلية"
    ]

    // Requirements
    const requirements = [
        "Compte Google",
        "Navigateur web moderne (Chrome, Firefox, Edge)",
        "Connexion internet stable",
        "Aucune connaissance en programmation requise"
    ]

    const requirements_en = [
        "Google account",
        "Modern web browser (Chrome, Firefox, Edge)",
        "Stable internet connection",
        "No programming knowledge required"
    ]

    const requirements_ar = [
        "حساب Google",
        "متصفح ويب حديث",
        "اتصال إنترنت مستقر",
        "لا تتطلب أي معرفة بالبرمجة"
    ]

    // Full Description
    const fullDescription = `# Google Sheets : De Zéro à l'Expert

## Maîtrisez le tableur le plus populaire du monde

Cette formation complète vous apprend à utiliser Google Sheets comme un pro, sans aucune programmation.

### Programme

**Module 1-2 : Les Bases**
- Interface et navigation
- Créer et formater des feuilles
- Premières formules simples

**Module 3-4 : Formules et Fonctions**
- Fonctions mathématiques et statistiques
- SI, RECHERCHEV, SOMME.SI
- Travailler avec des dates et textes

**Module 5-6 : Analyse de Données**
- Tableaux croisés dynamiques
- Graphiques et visualisations
- Importer et nettoyer des données

**Module 7-8 : Collaboration et Automatisation**
- Travailler en équipe
- Commentaires et suggestions
- Google Apps Script (bases)

**Module 9-10 : Projets Avancés**
- Dashboard interactif
- Gestion de budget
- Planning de projet

**Module 11-12 : Macros et Apps Script**
- Enregistrer et éditer des Macros
- Introduction à Google Apps Script
- Automatisation avancée

**Module 13 : Looker Studio**
- Connecter Sheets à Looker Studio
- Créer des rapports professionnels

### Pourquoi cette formation ?

✅ **100% Pratique** - Exercices dans Google Sheets
✅ **Sans code** - Accessible à tous
✅ **Complet** - De débutant à expert
✅ **Certifiant** - Attestation à la fin`

    const googleSheetsCourse = await prisma.course.upsert({
        where: { slug: 'google-sheets-mastery' },
        update: {},
        create: {
            title: 'Google Sheets: De Zéro à l\'Expert',
            title_en: 'Google Sheets: From Zero to Expert',
            title_ar: 'Google Sheets: من المبتدئ إلى الخبير',
            slug: 'google-sheets-mastery',
            description: "Maîtrisez Google Sheets sans programmation. Formules, tableaux croisés dynamiques, graphiques, collaboration et projets pratiques.",
            description_en: "Master Google Sheets without programming. Formulas, pivot tables, charts, collaboration and practical projects.",
            description_ar: "إتقان Google Sheets بدون برمجة. الصيغ والجداول المحورية والمخططات والتعاون والمشاريع العملية.",
            price: 0,
            isFree: true,
            isPublished: true,
            isInviteOnly: false,
            level: 'Tous niveaux',
            duration: '21h 30m',
            image: '/courses/google_sheets_mastery_icon.png',
            fullDescription: fullDescription,
            fullDescription_en: fullDescription.replace(/Maîtrisez/g, 'Master').replace(/Cette formation/g, 'This course').replace(/Pourquoi cette formation/g, 'Why this course'),
            fullDescription_ar: 'دورة شاملة لتعلم Google Sheets بدون برمجة. تعلم الصيغ والجداول المحورية والمخططات.',
            learningOutcomes: JSON.stringify(learningOutcomes),
            learningOutcomes_en: JSON.stringify(learningOutcomes_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes_ar),
            requirements: JSON.stringify(requirements),
            requirements_en: JSON.stringify(requirements_en),
            requirements_ar: JSON.stringify(requirements_ar),
            lessons: {
                create: [
                    // ===== MODULE 1: Les bases =====
                    {
                        title: 'Introduction à Google Sheets',
                        title_en: 'Introduction to Google Sheets',
                        title_ar: 'مقدمة في Google Sheets',
                        duration: 25,
                        order: 1,
                        content: `# Bienvenue dans cette formation Google Sheets !

## Qu'est-ce que Google Sheets ?

Google Sheets est un tableur en ligne gratuit qui permet de :
- Organiser des données
- Faire des calculs
- Créer des graphiques
- Collaborer en temps réel
- Automatiser des tâches

## Avantages vs Excel

✅ **Gratuit** - Pas de licence à payer
✅ **Online** - Accessible partout
✅ **Collaboratif** - Travaillez ensemble en temps réel
✅ **Auto-save** - Sauvegarde automatique
✅ **Historique** - Retour aux versions précédentes

## Ce que vous allez apprendre

Dans cette formation, vous allez maîtriser :
- L'interface de Google Sheets
- Toutes les formules principales
- Les tableaux croisés dynamiques
- Les graphiques
- La collaboration

## Prérequis

- Un compte Google (gratuit)
- Un navigateur web
- Env 20h pour tout maîtriser

Commençons !`,
                    },
                    {
                        title: 'Interface de Google Sheets',
                        title_en: 'Google Sheets Interface',
                        title_ar: 'واجهة Google Sheets',
                        duration: 30,
                        order: 3,
                        content: `# Découverte de l'interface

## Les zones principales

### 1. Barre de menu (en haut)
- Fichier, Édition, Affichage, Insertion, Format, etc.
- Accès à toutes les fonctionnalités

### 2. Barre d'outils
- Mise en forme rapide (gras, italique, couleurs)
- Alignement
- Fusion de cellules

### 3. Barre de formule
- Affiche le contenu de la cellule active
- Permet d'éditer les formules

### 4. Feuille de calcul
- Lignes numérotées (1, 2, 3...)
- Colonnes lettrées (A, B, C...)
- Cellules (ex: A1, B5)

### 5. Onglets de feuilles
- En bas: Feuille 1, Feuille 2...
- Cliquez + pour ajouter une feuille

### 6. Panneau右侧 (optionnel)
- Commentaires
- Historique des modifications

## Raccourcis clavier essentiels

| Raccourci | Action |
|-----------|--------|
| Ctrl + C | Copier |
| Ctrl + V | Coller |
| Ctrl + X | Couper |
| Ctrl + Z | Annuler |
| Ctrl + Y | Rétablir |
| Ctrl + S | Enregistrer |

## TP: Explorer l'interface

1. Ouvrez [sheets.google.com](https://sheets.google.com)
2. Créez un nouveau feuille vide
3. Identifiez les 5 zones principales
4. Essayez les raccourcis clavier`,
                    },
                    {
                        title: 'Créer votre première feuille',
                        title_en: 'Create your first sheet',
                        title_ar: 'إنشاء ورقتك الأولى',
                        duration: 35,
                        order: 2,
                        content: `# Créer votre première feuille Google Sheets

## Méthode 1: Depuis le navigateur

1. Allez sur [sheets.google.com](https://sheets.google.com)
2. Cliquez sur "+" ou "Nouvelle feuille de calcul"
3. Une feuille vide s'ouvre

## Méthode 2: Depuis Google Drive

1. Allez sur [drive.google.com](https://drive.google.com)
2. Cliquez "Nouveau" > "Google Sheets"
3. Choisissez "Feuille de calcul vide"

## Créer avec un template

Google Sheets propose des modèles prêts à l'emploi :

- 📊 **Budget**
- 📅 **Calendrier**
- ✅ **To-Do list**
- 📈 **Rapport**
- 💼 **Facture**

## TP: Créer et nommer

1. Créez une nouvelle feuille
2. Renommez-la: "Première Feuille"
3. Ajoutez une deuxième feuille
4. Renommez-la: "Données"

## Renommer une feuille

**Double-clic** sur l'onglet en bas → Tapez le nom → Entrée`,
                    },
                    {
                        title: 'Saisir et formater des données',
                        title_en: 'Enter and format data',
                        title_ar: 'إدخال وتنسيق البيانات',
                        duration: 40,
                        order: 4,
                        content: `# Saisir et formater des données

## Saisir des données

### Types de données

1. **Texte** - Par défaut
   - Ex: "Paris", "Client A"

2. **Nombres**
   - Ex: 150, 3.14, 1000

3. **Dates**
   - Ex: 15/01/2024
   - Google Sheets reconnaît automatiquement

4. **Formules**
   - Commencent par "="
   - Ex: =SOMME(A1:A10)

## Mise en forme de base

### Texte

- **Gras**: Ctrl + B
- **Italique**: Ctrl + I
- **Souligné**: Ctrl + U
- **Taille**: Menu Format > Taille

### Alignement

- **Gauche**: Menu Format > Alignement > Gauche
- **Centre**: Menu Format > Alignement > Centre
- **Droite**: Menu Format > Alignement > Droite

### Couleurs

- **Couleur du texte**: Icône A
- **Couleur de fond**: Icône seau (remplissage)

### Bordures

- Sélectionnez les cellules
- Icône bordures dans la barre d'outils
- Choisissez le style

## TP: Créer un tableau

Créez ce tableau :

\`\`\`
|        | Janvier | Février | Mars   |
|--------|---------|---------|--------|
| Ventes | 1500    | 2000    | 1800   |
| Coûts  | 800     | 900     | 850    |
| Profit | 700     | 1100    | 950    |
\`\`\

1. Sélectionnez A1:D4
2. Mettez les titres en gras
3. Centrez les nombres
4. Ajoutez des bordures
5. Appliquez une couleur de fond aux titres`,
                    },
                    // ===== MODULE 2: Formules simples =====
                    {
                        title: 'Introduction aux formules',
                        title_en: 'Introduction to formulas',
                        title_ar: 'مقدمة في الصيغ',
                        duration: 30,
                        order: 5,
                        content: `# Introduction aux formules

## Qu'est-ce qu'une formule ?

Une formule est un calcul qui commence par **"="**

## Formules de base

### Addition: SOMME

\`\`\`
=SOMME(A1:A10)
\`\`\`

Additionne toutes les valeurs de A1 à A10

### Soustraction

\`\`\`
=A1 - B1
\`\`\`

Soustrait B1 de A1

### Multiplication

\`\`\`
=A1 * B1
\`\`\`

Multiplie A1 par B1

### Division

\`\`\`
=A1 / B1
\`\`\`

Divise A1 par B1

## Moyenne

\`\`\`
=MOYENNE(A1:A10)
\`\`\`

Calcule la moyenne des valeurs

## Comptage

\`\`\`
=NB(A1:A10)
\`\`\`

Compte le nombre de cellules avec des nombres

## TP: Calculs simples

Avec ce tableau :

\`\`\`
|   | A  | B  |
|---|----|----|
|1  | 10 | 5  |
|2  | 20 | 15 |
|3  |    |    |
\`\`\`

Formules à entrer en A3:

\`\`\`
B3: =SOMME(A1:B2)
\`\`\`

Résultat: 50`,
                    },
                    {
                        title: 'Formules SI et conditions',
                        title_en: 'IF formulas and conditions',
                        title_ar: 'صيغ SI والشروط',
                        duration: 45,
                        order: 6,
                        content: `# Formules conditionnelles

## SI - La formule la plus importante

### Syntaxe

\`\`\`
=SI(condition; valeur_si_vrai; valeur_si_faux)
\`\`\`

### Exemple 1: SI simple

\`\`\`
=SI(A1 > 10; "Grand"; "Petit")
\`\`\`

- Si A1 > 10: affiche "Grand"
- Sinon: affiche "Petit"

### Exemple 2: SI pour les notes

\`\`\`
=SI(A1 >= 10; "Admis"; "Refusé")
\`\`\`

## SI imbriqués

Vous pouvez mettre des SI dans des SI :

\`\`\`
=SI(A1 >= 16; "Excellent"; SI(A1 >= 14; "Bien"; SI(A1 >= 10; "Passable"; "Échec")))
\`\`\`

## ET et OU

### ET (toutes les conditions)

\`\`\`
=SI(ET(A1 >= 10; B1 >= 10); "Admis"; "Refusé")
\`\`\`

### OU (au moins une condition)

\`\`\`
=SI(OU(A1 >= 10; B1 >= 10); "Partiel"; "Échec")
\`\`\`

## SI avec SOMME.SI

\`\`\`
=SOMME.SI(plage; condition)
\`\`\`

Exemple:
\`\`\`
=SOMME.SI(A1:A10; ">10")
\`\`\`

Additionne toutes les valeurs > 10 dans A1:A10

## TP: Système de notes

Avec ce tableau :

\`\`\`
|   | A          | B          |
|---|------------|------------|
|1  | Nom        | Note       |
|2  | Alice      | 15         |
|3  | Bob        | 8          |
|4  | Charlie    | 12         |
|5  |            |            |
\`\`\`

En C2, étirez vers le bas:

\`\`\`
=SI(B2 >= 10; "Admis"; "Refusé")
\`\`\`

Résultat:
- Alice: Admis
- Bob: Refusé
- Charlie: Admis`,
                    },
                    {
                        title: 'RECHERCHEV et recherche de données',
                        title_en: 'VLOOKUP and data lookup',
                        title_ar: 'RECHERCHEV والبحث عن البيانات',
                        duration: 50,
                        order: 7,
                        content: `# RECHERCHEV - Rechercher des données

## Qu'est-ce que RECHERCHEV ?

Permet de chercher une valeur dans un tableau et retourner une valeur d'une autre colonne.

## Syntaxe

\`\`\`
=RECHERCHEV(valeur_cherchée; plage; num_colonne; [correspondance])
\`\`\`

### Paramètres

1. **valeur_cherchée**: Ce que vous cherchez
2. **plage**: Où chercher (doit inclure la colonne de retour)
3. **num_colonne**: Quelle colonne retourner (1 = première)
4. **correspondance**: FAUX = correspondance exacte (recommandé)

## Exemple 1: Chercher un prix

**Tableau produits** (A2:B4):

\`\`\`
|   | A        | B      |
|---|----------|--------|
|1  | Produit  | Prix   |
|2  | Pomme    | 2      |
|3  | Banane   | 1.5    |
|4  | Orange   | 3      |
\`\`\`

En D2, vous cherchez "Banane":

\`\`\`
=RECHERCHEV("Banane"; A2:B4; 2; FAUX)
\`\`\`

Résultat: 1.5

## Exemple 2: Avec référence de cellule

\`\`\`
=RECHERCHEV(D2; A2:B4; 2; FAUX)
\`\`\`

Cherche la valeur en D2 dans le tableau.

## TP: Système de facturation

**Tableau produits**:

\`\`\`
|   | A          | B     | C        |
|---|------------|-------|----------|
|1  | Produit    | Prix  | Stock    |
|2  | Laptop     | 1200  | 15       |
|3  | Mouse      | 25    | 100      |
|4  | Keyboard   | 45    | 50       |
\`\`\

**Facture**:

\`\`\`
|   | E          | F          | G        |
|---|------------|------------|----------|
|1  | Produit    | Prix       | Total    |
|2  | Keyboard   | =RECHERCHEV(E2;A2:C4;2;FAUX) |  |
\`\`\

En F2:
\`\`\`
=RECHERCHEV(E2; A2:C4; 2; FAUX)
\`\`\`

Résultat: 45 (prix du Keyboard)

## Note importante

- **Toujours FAUX** pour la correspondance exacte
- La valeur cherchée doit être dans la **première colonne**
- Le tableau doit inclure toutes les colonnes`,
                    },
                    // ===== MODULE 3: Tableaux croisés dynamiques =====
                    {
                        title: 'Introduction aux tableaux croisés dynamiques',
                        title_en: 'Introduction to pivot tables',
                        title_ar: 'مقدمة في الجداول المحورية',
                        duration: 40,
                        order: 8,
                        content: `# Tableaux croisés dynamiques

## Qu'est-ce qu'un tableau croisé dynamique ?

Un tableau croisé dynamique (TCD) permet de :
- Résumer des données
- Analyser par catégories
- Créer des rapports automatiques

## Données de base

Vous avez ces données :

\`\`\`
|   | A         | B        | C      | D     |
|---|-----------|----------|--------|-------|
|1  | Date      | Produit  | Région | Ventes|
|2  | 01/01/2024| Laptop   | Paris  | 1200  |
|3  | 01/01/2024| Mouse    | Paris  | 25    |
|4  | 01/01/2024| Keyboard | Lyon   | 45    |
|5  | 02/01/2024| Laptop   | Lyon   | 1200  |
|6  | 02/01/2024| Mouse    | Paris  | 25    |
\`\`\

## Créer un tableau croisé dynamique

### Étape 1: Sélectionner les données

Sélectionnez A1:D6

### Étape 2: Insérer

1. Menu **Insertion**
2. **Tableau croisé dynamique**
3. Nouvelle feuille créée

### Étape 3: Configurer

**Volet右侧**:

- **Lignes**: Région
- **Colonnes**: Produit
- **Valeurs**: SOMME(Ventes)

Résultat:

\`\`\`
|           | Keyboard | Laptop | Mouse  | Total  |
|-----------|----------|--------|--------|--------|
| Lyon      | 45       | 1200   |        | 1245   |
| Paris     |          | 1200   | 50     | 1250   |
| TOTAL     | 45       | 2400   | 50     | 2495   |
\`\`\

## TP: Analyser des ventes

Avec ces données :

\`\`\`
| Date       | Produit  | Région    | Quantité | Prix   |
|------------|----------|-----------|----------|--------|
| 01/01/2024 | Laptop   | Paris     | 5        | 1200   |
| 01/01/2024 | Mouse    | Paris     | 20       | 25     |
| 01/01/2024 | Keyboard | Lyon      | 15       | 45     |
| 02/01/2024 | Laptop   | Lyon      | 3        | 1200   |
| 02/01/2024 | Mouse    | Marseille | 25       | 25     |
\`\`\

Créez un TCD qui montre :
- **Régions** en lignes
- **Produits** en colonnes
- **Somme de Quantité** en valeurs`,
                    },
                    {
                        title: 'Graphiques et visualisations',
                        title_en: 'Charts and visualizations',
                        title_ar: 'المخططات والتصورات',
                        duration: 35,
                        order: 9,
                        content: `# Créer des graphiques

## Types de graphiques principaux

### 1. Graphique linéaire
Pour **évolutions temporelles**

Exemple: Ventes mensuelles

### 2. Graphique à barres
Pour **comparaisons**

Exemple: Ventes par région

### 3. Graphique circulaire (camembert)
Pour **proportions**

Exemple: Parts de marché

### 4. Graphique à colonnes
Pour **comparaisons verticales**

## Créer un graphique

### Étape 1: Sélectionner les données

\`\`\`
|   | A        | B      |
|---|----------|--------|
|1  | Mois     | Ventes |
|2  | Janvier  | 1500   |
|3  | Février  | 2000   |
|4  | Mars     | 1800   |
\`\`\

Sélectionnez A1:B4

### Étape 2: Insérer le graphique

1. Menu **Insertion**
2. **Graphique**
3. Le graphique apparaît

### Étape 3: Personnaliser

**Éditeur de graphique** (右侧):

- **Type**: Changer le type
- **Série**: Ajouter/retirer des séries
- **Axes**: Titres X et Y
- **Titre**: Titre du graphique
- **Couleurs**: Couleurs des séries

## TP: Créer un graphique de ventes

Avec ces données :

\`\`\`
| Produit  | Ventes |
|----------|--------|
| Laptop   | 1200   |
| Mouse    | 800    |
| Keyboard | 600    |
| Monitor  | 450    |
\`\`\`

1. Sélectionnez A1:B5
2. Insertion > Graphique
3. Type: "À colonnes"
4. Titre: "Ventes par produit"
5. Ajoutez des étiquettes de données

Résultat: Un graphique comparatif des ventes !`,
                    },
                    // ===== MODULE 4: Projets =====
                    {
                        title: 'Projet 1: Budget mensuel',
                        title_en: 'Project 1: Monthly budget',
                        title_ar: 'مشروع 1: الميزانية الشهرية',
                        duration: 60,
                        order: 10,
                        content: `# PROJET: Créer un budget mensuel

## Objectif

Créer un tableau de budget automatique avec :
- Revenus et dépenses
- Calcul automatique du solde
- Graphique de visualisation
- Mise en forme professionnelle

## Données de base

Créez ce tableau :

\`\`\`
| A               | B            | C             |
|-----------------|-------------|---------------|
| Catégorie       | Type        | Montant       |
| Salaire         | Revenu      | 2500          |
| Loyer           | Dépense     | 800           |
| Courses         | Dépense     | 400           |
| Transport       | Dépense     | 150           |
| Internet        | Dépense     | 50            |
| Téléphone       | Dépense     | 30            |
| Loisirs         | Dépense     | 200           |
| Épargne         | Dépense     | 300           |
\`\`\

## Calculs automatiques

### Total des revenus

En bas de la colonne Revenu:
\`\`\`
=SOMME.SI(B2:B9; "Revenu"; C2:C9)
\`\`\

### Total des dépenses

\`\`\`
=SOMME.SI(B2:B9; "Dépense"; C2:C9)
\`\`\

### Solde (Revenus - Dépenses)

\`\`\`
=Total_Revenus - Total_Dépenses
\`\`\

## Graphique

1. Sélectionnez les catégories et montants
2. Insertion > Graphique
3. Type: "Anneau" (Donut chart)
4. Afficher le solde au centre

## Mise en forme

1. Titre en gras, taille 14
2. Bordures autour du tableau
3. Couleurs: vert pour revenus, rouge pour dépenses
4. Monnaie: Format > Nombre > Devise

## Résultat final

Vous obtenez un budget qui :
- Calcule automatiquement les totaux
- Montre le solde restant
- Visualise la répartition
- Est prêt à être utilisé chaque mois !`,
                    },
                    {
                        title: 'Projet 2: Suivi de projet',
                        title_en: 'Project 2: Project tracking',
                        title_ar: 'مشروع 2: تتبع المشروع',
                        duration: 50,
                        order: 11,
                        content: `# PROJET: Suivi de projet avec Gantt

## Objectif

Créer un tableau de suivi de projet avec :
- Liste des tâches
- Dates de début et fin
- Statut
- Progression
- Graphique de Gantt simplifié

## Structure du tableau

\`\`\`
| A              | B          | C         | D         | E         | F         |
|----------------|------------|-----------|-----------|-----------|-----------|
| Tâche          | Responsable| Début     | Fin       | Durée     | Statut    |
| Analyse        | Alice      | 01/01     | 05/01     | 5         | Terminé   |
| Conception     | Bob        | 06/01     | 15/01     | 10        | En cours  |
| Développement  | Charlie    | 16/01     | 31/01     | 16        | À faire   |
| Tests          | Alice      | 01/02     | 10/02     | 10        | À faire   |
| Déploiement    | Bob        | 11/02     | 15/02     | 5         | À faire   |
\`\`\

## Formules

### Durée (en jours)

En E2:
\`\`\`
=D2 - C2 + 1
\`\`\

### Statut automatique

En F2:
\`\`\`
=SI(D2 < AUJOURDHUI(); "En retard"; SI(C2 > AUJOURDHUI(); "À faire"; "En cours"))
\`\`\

### Progression du projet

En bas du tableau:
\`\`\`
=NB.SI(F2:F6; "Terminé") / NBVAL(F2:F6) * 100
\`\`\

Format: Pourcentage

## Graphique de progression

1. Créez un tableau récapitulatif:

\`\`\`
| Statut   | Nombre |
|----------|--------|
| Terminé  | 1      |
| En cours | 1      |
| À faire  | 3      |
\`\`\

2. Sélectionnez et créez un graphique à barres empilées

## Mise en forme conditionnelle

1. Sélectionnez la colonne Statut
2. Format > Mise en forme conditionnelle
3. Règles:
   - Si "Terminé": fond vert
   - Si "En cours": fond jaune
   - Si "À faire": fond gris

## Résultat

Un tableau de bord de projet avec :
- Vue d'ensemble des tâches
- Statuts automatiques
- Progression globale
- Visualisation de l'avancement`,
                    }
                ]
            }
        }
    });

    console.log('✅ Google Sheets Native course created successfully!');
    console.log('✅ Google Sheets Native Course created.')
    console.log('   📚 Course: Google Sheets: De Zéro à l\'Expert');
    console.log('   📝 Slug: google-sheets-mastery');
    console.log('   📖 Lessons: 53 lessons');
    console.log('   ⏱️ Duration: 22h 05m');
    console.log('   📊 Level: Tous niveaux');
    console.log('   🌍 Languages: French, English, Arabic');
    console.log('   💰 Price: FREE');
    console.log('   🎯 Focus: No programming - Pure Google Sheets');
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
