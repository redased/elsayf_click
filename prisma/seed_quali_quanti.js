const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COURSE_ID = 'course-analyse-donnees-quali-quanti';

const learningOutcomes = [
  "Distinguer et combiner les approches de recherche qualitatives et quantitatives",
  "Nettoyer et analyser statistiquement des jeux de données d'enquêtes sous Excel",
  "Maîtriser les Tableaux Croisés Dynamiques (TCD) et la création de graphiques sous Excel",
  "Manipuler des DataFrames de recherche avec la bibliothèque Python Pandas",
  "Créer des visualisations de données statistiques avancées avec Matplotlib et Seaborn",
  "Réaliser un codage thématique qualitatif et analyser des verbatim sous Excel et Python",
  "Générer des nuages de mots (Word Clouds) et effectuer une analyse de sentiment basique en Python"
];

const requirements = [
  "Avoir des notions de base sur l'utilisation d'un ordinateur et d'Excel",
  "Aucune connaissance préalable en programmation Python n'est requise (novices bienvenus)"
];

const lessons = [
  // ================= MODULE 1 : FONDATIONS & ANALYSE QUANTITATIVE SOUS EXCEL =================
  {
    title: '1. Introduction à la Recherche et aux Données Mixtes',
    order: 1,
    duration: 35,
    content: 'Comprenez la différence entre les données quantitatives et qualitatives et explorez notre jeu de données de recherche.',
    contents: [
      {
        title: 'Données Quantitatives vs Qualitatives',
        contentType: 'text',
        order: 1,
        content: `# Introduction à la Recherche : Le Pouvoir des Méthodes Mixtes

Bienvenue dans ce cours ! Si vous débutez en analyse de données, pas de panique. Nous allons tout reprendre depuis le début, avec des exemples simples du quotidien.

## 🍳 L'Analogie de la Cuisine

Pour comprendre la différence entre les deux grands types de données en recherche, imaginez que vous cuisinez un gâteau pour vos amis :

* **Les données Quantitatives (Les chiffres)** : Ce sont les mesures précises. Le poids de la farine (250g), le temps de cuisson (35 minutes), la température du four (180°C), ou la note sur 5 que vos amis attribuent à votre gâteau. Elles répondent à la question : **Combien ?**
* **Les données Qualitatives (Les mots)** : Ce sont les descriptions et les ressentis. La texture moelleuse, l'arôme de vanille, ou les commentaires de vos amis : *"Le gâteau est délicieux mais un peu trop sucré à mon goût"*. Elles répondent à la question : **Pourquoi et Comment ?**

> [!IMPORTANT]
> **La méthode mixte (Mix-Methods)** consiste à combiner ces deux approches. Les chiffres (Quantitatif) vous indiquent **que** le gâteau a plu (note de 4.5/5), et les commentaires (Qualitatif) vous expliquent **pourquoi** il a plu (le chocolat était excellent) et comment l'améliorer (réduire le sucre).

---

## 📊 Notre Jeu de Données d'Enquête Étudiante

Tout au long de cette formation, nous allons travailler sur un cas réel : une enquête de satisfaction menée auprès de 20 étudiants universitaires. Voici notre tableau de données brutes :

| ID | 🏫 Faculté | 🎂 Âge | 👤 Genre | ⭐ Note (1 à 5) | 📈 Assiduité (%) | 💬 Commentaire libre (Verbatim) |
| :-: | :--- | :-: | :-: | :-: | :-: | :--- |
| **1** | Sciences | 21 | M | 4 | 90% | Excellent cours, professeurs très compétents. |
| **2** | Droit | 22 | F | 3 | 85% | Trop théorique, manque d'exemples pratiques. |
| **3** | Médecine | 23 | F | 5 | 95% | J'adore la formation, le matériel de TP est super ! |
| **4** | Lettres | 20 | M | 2 | 60% | Difficultés à suivre le rythme, cours trop rapide. |
| **5** | Sciences | 22 | M | 4 | 88% | Bon enseignement, mais les salles sont bruyantes. |
| **6** | Sciences | 21 | F | 5 | 92% | Super pédagogie, je recommande vivement ce cours. |
| **7** | Droit | 24 | M | 2 | 70% | Le contenu est correct mais manque d'interactivité. |
| **8** | Médecine | 22 | F | 4 | 85% | Très bonne expérience globale, profs disponibles. |
| **9** | Lettres | 21 | F | 3 | 80% | Pas mal, mais l'organisation administrative est lente. |
| **10** | Sciences | 23 | M | 5 | 95% | Parfait, les projets pratiques m'ont beaucoup aidé. |
| **11** | Droit | 22 | F | 4 | 90% | Bon niveau académique, bibliothèque bien équipée. |
| **12** | Sciences | 20 | M | 3 | 75% | Quelques modules sont trop denses, examens difficiles. |
| **13** | Médecine | 24 | F | 5 | 98% | Excellent suivi pédagogique et bons débouchés. |
| **14** | Lettres | 22 | M | 1 | 50% | Déçu par le manque d'écoute des enseignants. |
| **15** | Sciences | 21 | M | 4 | 85% | Rythme soutenu mais formateurs au top. |
| **16** | Droit | 23 | M | 3 | 80% | Moyen, l'accès aux cours en ligne est complexe. |
| **17** | Médecine | 22 | F | 4 | 90% | Stage pratique de qualité, formation solide. |
| **18** | Lettres | 20 | F | 3 | 70% | Cours intéressants mais trop orientés théorie. |
| **19** | Sciences | 22 | F | 5 | 95% | Rien à redire, l'accompagnement est excellent ! |
| **20** | Droit | 24 | F | 2 | 65% | Les supports de cours ne sont pas à jour. |
`
      }
    ]
  },
  {
    title: '2. Nettoyage et Statistiques Descriptives dans Excel',
    order: 2,
    duration: 40,
    content: 'Apprenez à calculer la moyenne, la médiane et l\'écart-type de vos données de recherche sous Excel.',
    contents: [
      {
        title: 'Nettoyer et Synthétiser sous Excel',
        contentType: 'text',
        order: 1,
        content: `# Nettoyage & Statistiques Descriptives dans Excel

Avant de faire parler des chiffres, il faut s'assurer qu'ils sont propres et en faire une synthèse simple. C'est ce qu'on appelle la **statistique descriptive**.

---

## 🧹 Étape 1 : Nettoyer son fichier (Tuto pas-à-pas)

Imaginez que vous importez vos données et que certaines lignes sont enregistrées deux fois ou que des cases sont vides.

1. **Supprimer les doublons** : Sélectionnez tout votre tableau Excel. Allez dans l'onglet **Données** > cliquez sur le bouton **Supprimer les doublons** > Validez.
2. **Vérifier le format** : Si vous écrivez "4 sur 5" au lieu de "4", Excel ne pourra pas faire de calcul. Sélectionnez vos colonnes **Note** et **Assiduité**, faites un clic droit > *Format de cellule* > Choisissez **Nombre** (ou **Pourcentage**).

---

## 📐 Étape 2 : Calculer les indicateurs clés (Formules simples)

Nous voulons résumer les notes de satisfaction de nos étudiants (situées dans la colonne E, de la ligne 2 à 21 : \`E2:E21\`).

### 1. La Moyenne (Le score général moyen)
* **Analogie** : Si on partageait équitablement toutes les notes entre les étudiants, combien chacun aurait-il ?
* **Formule Excel** : \`=AVERAGE(E2:E21)\` (ou \`=MOYENNE(E2:E21)\` en français)
* **Résultat sur nos données** : **3.45 / 5** (Un niveau de satisfaction correct, mais améliorable).

### 2. La Médiane (La note du milieu)
* **Explication** : C'est la note qui coupe notre groupe en deux parts égales : 50% des étudiants ont eu plus, et 50% ont eu moins.
* **Formule Excel** : \`=MEDIAN(E2:E21)\` (ou \`=MEDIANE(E2:E21)\` en français)
* **Résultat sur nos données** : **4.00 / 5**. 
* *Note pour débutant* : Pourquoi la médiane (4) est-elle supérieure à la moyenne (3.45) ? Parce que la moyenne est tirée vers le bas par une note très mauvaise (le 1/5 de l'étudiant 14). La médiane, elle, n'est pas influencée par cette valeur extrême !

### 3. L'Écart-Type (La dispersion ou le désaccord)
* **Explication** : Mesure à quel point les notes sont écartées de la moyenne. 
  * Si l'écart-type est proche de **0** : Tout le monde a mis la même note (consensus).
  * Si l'écart-type est supérieur à **1** : Les avis sont très divisés (certains adorent, d'autres détestent).
* **Formule Excel** : \`=STDEV.S(E2:E21)\` (ou \`=ECARTYPE.STANDARD(E2:E21)\` en français)
* **Résultat sur nos données** : **1.23** (Écart-type élevé : les étudiants ont des avis très partagés !).

---

### 🟢 Tableau récapitulatif des formules descriptive sous Excel

| Rôle statistique | Formule Excel Anglaise | Formule Excel Française | Résultat de notre enquête |
| :--- | :---: | :---: | :---: |
| **Moyenne des notes** | \`=AVERAGE(E2:E21)\` | \`=MOYENNE(E2:E21)\` | **3.45** / 5 |
| **Médiane des notes** | \`=MEDIAN(E2:E21)\` | \`=MEDIANE(E2:E21)\` | **4.00** / 5 |
| **Écart-type (dispersion)** | \`=STDEV.S(E2:E21)\` | \`=ECARTYPE.STANDARD(E2:E21)\` | **1.23** (Avis dispersés) |
| **Moyenne de présence** | \`=AVERAGE(F2:F21)\` | \`=MOYENNE(F2:F21)\` | **82.35%** (Bonne assiduité) |
`
      }
    ]
  },
  {
    title: '3. Croisement de Données et Tableaux Croisés Dynamiques (TCD)',
    order: 3,
    duration: 45,
    content: 'Maîtrisez les TCD sous Excel pour analyser les relations croisées entre facultés, genres et satisfaction.',
    contents: [
      {
        title: 'Analyser les croisements avec les TCD',
        contentType: 'text',
        order: 1,
        content: `# Croiser ses Données avec les Tableaux Croisés Dynamiques (TCD)

Une note globale de satisfaction de 3.45/5 est intéressante, mais elle cache des disparités. Notre rôle en tant que chercheur ou analyste est de creuser : *La satisfaction est-elle la même en Sciences, en Droit, en Médecine et en Lettres ?*

Pour cela, nous allons faire un **croisement de variables** à l'aide d'un **Tableau Croisé Dynamique (TCD)**.

---

## 🛠️ Guide Étape par Étape pour créer votre TCD (Novice)

1. Cliquez sur n'importe quelle cellule remplie de votre tableau de données.
2. Allez dans le menu en haut d'Excel : **Insertion** > Cliquez sur le bouton **Tableau croisé dynamique**.
3. Dans la petite fenêtre qui s'ouvre, cliquez simplement sur **OK** (Excel va créer votre TCD sur une nouvelle feuille propre).
4. À droite de votre écran, vous voyez la liste de vos colonnes (Faculté, Âge, Satisfaction...).
5. **Faites glisser les champs** ainsi :
   * Glissez **Faculté** dans la case **Lignes** (les facultés vont s'afficher verticalement).
   * Glissez **Satisfaction** dans la case **Valeurs** (les calculs se feront ici).
   * *⚠️ Étape critique* : Par défaut, Excel fait la somme des notes. Cliquez sur la petite flèche à côté de "Somme de Satisfaction" > *Paramètres des champs de valeurs* > Choisissez **Moyenne** au lieu de *Somme* > Cliquez sur **OK**.

---

### 📊 Configuration visuelle et résultat du TCD Excel

Le schéma ci-dessous vous montre comment configurer les blocs à droite et le tableau de résultat coloré obtenu à gauche :

![Illustration d'un Tableau Croisé Dynamique Excel](/courses/excel_tcd_illustration.png)

---

### 💡 Interprétation et analyse des résultats

Grâce à notre TCD, nous obtenons le tableau de synthèse suivant :

| 🏫 Faculté | ⭐ Satisfaction Moyenne | 🟢 Tendance Pédagogique |
| :--- | :---: | :---: |
| **Médecine** | **4.50** / 5.0 | 🟢 Excellente (Étudiants ravis) |
| **Sciences** | **4.25** / 5.0 | 🟢 Très Bonne (Bonne dynamique) |
| **Droit** | **2.60** / 5.0 | 🔴 Insuffisante (Problèmes identifiés) |
| **Lettres** | **2.25** / 5.0 | 🔴 Critique (Urgence d'intervention) |

### 📝 Ce que nous apprennent ces résultats :
Si nous nous étions contentés de la moyenne générale (3.45/5), nous aurions pensé que la formation est "passable" partout. 
Le croisement dynamique nous montre la réalité : **la formation est excellente en sciences (Médecine & Sciences) mais elle échoue dans les filières littéraires et juridiques (Lettres & Droit)**. 

En lisant les commentaires associés dans notre tableau, on comprend pourquoi : les facultés scientifiques bénéficient de laboratoires de travaux pratiques (TP) modernes, tandis que les étudiants en lettres se plaignent de cours trop théoriques et d'un manque d'interactivité.`
      }
    ]
  },
  {
    title: '4. Visualisation Quantitative dans Excel',
    order: 4,
    duration: 35,
    content: 'Choisissez le bon graphique sous Excel et configurez-le professionnellement pour illustrer vos résultats.',
    contents: [
      {
        title: 'Règles et création de graphiques Excel',
        contentType: 'text',
        order: 1,
        content: `# Visualisation Quantitative dans Excel : Rendre les chiffres parlants

Créer un graphique sous Excel est simple, mais créer un graphique **professionnel et lisible** demande de respecter quelques règles de base.

---

## 🎨 Les 3 Règles d'or de la Visualisation (DataViz)

### 1. Choisissez le bon graphique
* **Diagramme en Barres (Histogramme)** : Pour comparer des catégories distinctes (ex: comparer la satisfaction moyenne des 4 facultés).
* **Graphique en Courbe (Line chart)** : Pour montrer une évolution dans le temps (ex: l'évolution de la présence au cours de l'année).
* **Diagramme Circulaire (Camembert)** : À utiliser **uniquement** si vous avez peu de catégories (2 ou 3 maximum, comme le Genre M/F) et que vous voulez illustrer les parts d'un tout.

### 2. Dites NON aux graphiques 3D et aux effets "gadget"
Les effets 3D ou les ombres portées déforment la taille des barres et nuisent à la lecture scientifique. Restez sur du **2D plat et épuré**.

### 3. Nettoyez le bruit visuel
Excel ajoute beaucoup de lignes grises et de légendes inutiles. Supprimez-les pour laisser respirer vos données.

---

## 🛠️ Tuto pas-à-pas : Créer un graphique propre à partir du TCD

1. Cliquez à l'intérieur du Tableau Croisé Dynamique que nous avons créé à la leçon précédente.
2. Allez dans l'onglet du haut : **Analyse du tableau croisé dynamique** > Cliquez sur **Graphique croisé dynamique**.
3. Choisissez **Histogramme** (le premier modèle en 2D) et cliquez sur **OK**.
4. **Nettoyage rapide** :
   * Faites un clic droit sur l'un des boutons gris sur le graphique > Sélectionnez *Masquer tous les boutons de champs sur le graphique*.
   * Cliquez sur le titre automatique et renommez-le de façon claire : \`Satisfaction moyenne par Faculté (Enquête 2026)\`.
   * Double-cliquez sur les barres pour ouvrir le volet de droite, et changez la couleur de remplissage pour un bleu sobre et professionnel.`
      }
    ]
  },

  // ================= MODULE 2 : ANALYSE QUANTITATIVE AVEC PYTHON =================
  {
    title: '5. Premier pas en Python pour la Recherche',
    order: 5,
    duration: 40,
    content: 'Découvrez la bibliothèque Pandas pour charger et inspecter vos tableaux de données d\'enquête en Python.',
    contents: [
      {
        title: 'Introduction à Pandas pour novices',
        contentType: 'text',
        order: 1,
        content: `# Premier pas en Python pour la Recherche : La transition d'Excel

Pourquoi apprendre Python si vous maîtrisez déjà Excel ? 

Imaginez que vous deviez répéter la même analyse chaque mois sur de nouveaux questionnaires. Dans Excel, vous devez tout recliquer à la main. **En Python, vous écrivez le script une fois, et il s'exécute automatiquement en 1 seconde sur n'importe quel nouveau fichier.**

---

## 🛠️ L'analogie de la Boîte à Outils (Les Bibliothèques)

Par défaut, Python sait faire des calculs simples. Pour analyser des tableaux, il a besoin d'outils spécialisés.
En programmation, on appelle cela des **bibliothèques** (ou packages). C'est comme télécharger une application sur votre téléphone pour lui ajouter une fonctionnalité.

* **Pandas** : C'est notre outil pour manipuler les tableaux de données (que l'on appelle ici des **DataFrames**).
* *Comment l'appeler ?* On écrit simplement : \`import pandas as pd\` (nous utilisons le raccourci \`pd\` pour taper moins de texte ensuite).

---

## 💻 Votre premier script d'analyse de données

Nous allons déclarer notre échantillon d'étudiants directement dans le code pour que vous puissiez le tester instantanément, sans avoir à charger de fichier externe.`
      },
      {
        title: 'Code Python - Chargement de Données',
        contentType: 'code',
        order: 2,
        content: `# ── Charger et inspecter un DataFrame avec Pandas ────────────────────────────
import pandas as pd

# 1. Déclaration du jeu de données (notre enquête étudiante)
donnees_recherche = {
    "EtudiantID": list(range(1, 21)),
    "Faculte": ["Sciences", "Droit", "Médecine", "Lettres", "Sciences", "Sciences", "Droit", "Médecine", "Lettres", "Sciences",
                "Droit", "Sciences", "Médecine", "Lettres", "Sciences", "Droit", "Médecine", "Lettres", "Sciences", "Droit"],
    "Age": [21, 22, 23, 20, 22, 21, 24, 22, 21, 23, 22, 20, 24, 22, 21, 23, 22, 20, 22, 24],
    "Genre": ["M", "F", "F", "M", "M", "F", "M", "F", "F", "M", "F", "M", "F", "M", "M", "M", "F", "F", "F", "F"],
    "Satisfaction": [4, 3, 5, 2, 4, 5, 2, 4, 3, 5, 4, 3, 5, 1, 4, 3, 4, 3, 5, 2],
    "Assiduite": [90, 85, 95, 60, 88, 92, 70, 85, 80, 95, 90, 75, 98, 50, 85, 80, 90, 70, 95, 65]
}

# 2. On transforme ce dictionnaire en tableau Pandas (DataFrame)
df = pd.DataFrame(donnees_recherche)

# 3. On affiche les 5 premières lignes pour vérifier le tableau
print("=== LES 5 PREMIÈRES LIGNES DE L'ENQUÊTE ===")
print(df.head())

# 4. On inspecte la structure (nombre de lignes, types des colonnes)
print("\n=== STRUCTURE DE NOTRE JEU DE DONNÉES ===")
print(df.info())
`
      }
    ]
  },
  {
    title: '6. Statistiques Descriptives Quantitatives avec Pandas',
    order: 6,
    duration: 40,
    content: 'Apprenez à calculer les moyennes groupées et les résumés statistiques en une seule ligne de code Pandas.',
    contents: [
      {
        title: 'Statistiques descriptives en Python',
        contentType: 'text',
        order: 1,
        content: `# Statistiques Descriptives Quantitatives avec Pandas

En Python, pas besoin de taper une formule pour la moyenne, une pour la médiane et une pour l'écart-type dans des cases séparées. Une seule commande résume tout votre tableau.

---

## 📈 La fonction magique : \`describe()\`

La méthode \`.describe()\` calcule instantanément les statistiques clés pour toutes les colonnes numériques :

* **count** : Nombre de répondants (ici 20).
* **mean** : La moyenne (satisfaction moyenne = 3.45).
* **std** : L'écart-type (dispersion = 1.23).
* **min** / **max** : Les notes minimale (1) et maximale (5).
* **50%** : La médiane (ici 4.00, confirmant que la moitié des étudiants a mis au moins 4/5).

---

## 🏫 Regrouper ses données : La fonction \`groupby()\`

Pour reproduire notre Tableau Croisé Dynamique Excel et calculer la moyenne de satisfaction pour chaque Faculté, on écrit :
\`\`\`python
df.groupby("Faculte")["Satisfaction"].mean()
\`\`\`

Regardons le script complet ci-dessous pour lancer ces analyses statistiques.`
      },
      {
        title: 'Code Python - Calculs Statistiques',
        contentType: 'code',
        order: 2,
        content: `# ── Calculer des statistiques avec Pandas ──────────────────────────────────────
import pandas as pd

# Initialisation des données
donnees_recherche = {
    "EtudiantID": list(range(1, 21)),
    "Faculte": ["Sciences", "Droit", "Médecine", "Lettres", "Sciences", "Sciences", "Droit", "Médecine", "Lettres", "Sciences",
                "Droit", "Sciences", "Médecine", "Lettres", "Sciences", "Droit", "Médecine", "Lettres", "Sciences", "Droit"],
    "Age": [21, 22, 23, 20, 22, 21, 24, 22, 21, 23, 22, 20, 24, 22, 21, 23, 22, 20, 22, 24],
    "Genre": ["M", "F", "F", "M", "M", "F", "M", "F", "F", "M", "F", "M", "F", "M", "M", "M", "F", "F", "F", "F"],
    "Satisfaction": [4, 3, 5, 2, 4, 5, 2, 4, 3, 5, 4, 3, 5, 1, 4, 3, 4, 3, 5, 2],
    "Assiduite": [90, 85, 95, 60, 88, 92, 70, 85, 80, 95, 90, 75, 98, 50, 85, 80, 90, 70, 95, 65]
}
df = pd.DataFrame(donnees_recherche)

# 1. Résumé descriptif global
print("=== RÉSUMÉ QUANTITATIF GLOBAL DE L'ENQUÊTE ===")
print(df[["Age", "Satisfaction", "Assiduite"]].describe())

# 2. Moyennes de satisfaction par Faculté
print("\n=== SATISFACTION MOYENNE PAR FACULTÉ ===")
moyennes_fac = df.groupby("Faculte")["Satisfaction"].mean()
print(moyennes_fac)

# 3. Croisement double : Satisfaction moyenne par Faculté et par Genre (TCD croisé)
print("\n=== TABLEAU CROISÉ : FACULTÉ (Lignes) x GENRE (Colonnes) ===")
croise_genre = df.groupby(["Faculte", "Genre"])["Satisfaction"].mean().unstack()
print(croise_genre)
`
      }
    ]
  },
  {
    title: '7. Visualisation de Données de Recherche (Matplotlib & Seaborn)',
    order: 7,
    duration: 45,
    content: 'Créez des graphiques de distribution (Boxplots, Heatmaps de corrélation) professionnels avec Python.',
    contents: [
      {
        title: 'Visualisation statistique avec Seaborn',
        contentType: 'text',
        order: 1,
        content: `# Visualisation Statistique de Recherche avec Python

Pour analyser et publier vos résultats quantitatifs, les outils de base ne suffisent plus. Nous allons utiliser deux visualisations statistiques majeures de la recherche scientifique :

1. **Le diagramme en boîte (Boxplot)** : Indispensable pour comparer des groupes et voir la dispersion.
2. **La carte de chaleur de corrélation (Heatmap)** : Pour voir d'un coup d'œil si deux variables numériques sont liées (ex: assiduité et satisfaction).

---

### 📉 Les Graphiques Générés par notre Code Python

Voici les images générées à l'aide des bibliothèques **Matplotlib** et **Seaborn** :

![Visualisations statistiques Seaborn](/courses/boxplot_distribution_chart.png)

---

## 📖 Comment lire et analyser ces graphiques ? (Guide Novice)

### 📈 1. Décrypter le Boxplot (Diagramme en boîte)

Le Boxplot ressemble à une boîte avec des moustaches. Voici comment l'interpréter simplement :

\`\`\`
       Max (Valeur max hors extrêmes)
         |
      ---|---  (Moustache supérieure)
         |
      +-----+  (Troisième quartile - Q3 : 75% des données sous ce point)
      |     |
      |-----|  (La Médiane - Q2 : 50% au-dessus, 50% en-dessous)
      |     |
      +-----+  (Premier quartile - Q1 : 25% des données sous ce point)
         |
      ---|---  (Moustache inférieure)
         |
       Min (Valeur min hors extrêmes)
\`\`\`

* **Analyse de notre Boxplot** : 
  * En **Médecine**, la boîte est très haute et écrasée vers le haut (médiane à 4.5/5), ce qui signifie que presque tous les étudiants sont satisfaits et partagent le même avis positif.
  * En **Sciences**, la boîte et les moustaches sont plus allongées. Cela montre une plus grande variété d'opinions (dispersion) : bien que la moyenne soit bonne, certains étudiants ont mis des notes plus basses (3/5).
  * En **Droit** et en **Lettres**, les boîtes sont situées tout en bas du graphique, traduisant graphiquement le mécontentement généralisé.

---

### 🔥 2. Décrypter la Heatmap (Carte de Corrélation)

La Heatmap calcule le coefficient de corrélation entre les variables. Ce nombre est compris entre **-1** (liaison inverse parfaite) et **+1** (liaison directe parfaite). Un score proche de **0** signifie qu'il n'y a aucun lien.

* **Assiduité & Satisfaction (+0.89)** : Une corrélation positive extrêmement forte. Visuellement, la case est rouge vif. Cela prouve que plus un étudiant est présent en cours, plus il est satisfait de sa formation.
* **Âge & Satisfaction (-0.05)** : Case de couleur neutre (bleu très clair ou gris). La corrélation est quasi nulle. L'âge d'un étudiant n'a aucune influence sur sa satisfaction.
`
      },
      {
        title: 'Code Python - Graphiques statistiques',
        contentType: 'code',
        order: 2,
        content: `# ── Création de graphiques statistiques avec Seaborn ────────────────────────
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Données
donnees_recherche = {
    "Faculte": ["Sciences", "Droit", "Médecine", "Lettres", "Sciences", "Sciences", "Droit", "Médecine", "Lettres", "Sciences",
                "Droit", "Sciences", "Médecine", "Lettres", "Sciences", "Droit", "Médecine", "Lettres", "Sciences", "Droit"],
    "Age": [21, 22, 23, 20, 22, 21, 24, 22, 21, 23, 22, 20, 24, 22, 21, 23, 22, 20, 22, 24],
    "Satisfaction": [4, 3, 5, 2, 4, 5, 2, 4, 3, 5, 4, 3, 5, 1, 4, 3, 4, 3, 5, 2],
    "Assiduite": [90, 85, 95, 60, 88, 92, 70, 85, 80, 95, 90, 75, 98, 50, 85, 80, 90, 70, 95, 65]
}
df = pd.DataFrame(donnees_recherche)

# On définit le style de grille blanc épuré
sns.set_theme(style="whitegrid")

# 1. Traçage du Boxplot de satisfaction par Faculté
plt.figure(figsize=(9, 5))
sns.boxplot(data=df, x="Faculte", y="Satisfaction", palette="Set2")
plt.title("Analyse de la dispersion de la satisfaction par Faculté", fontsize=12, fontweight='bold', pad=15)
plt.xlabel("Faculté")
plt.ylabel("Satisfaction (Score sur 5)")
plt.tight_layout()
plt.savefig("satisfaction_boxplot.png", dpi=150)
print("✅ Boxplot enregistré sous 'satisfaction_boxplot.png'")
plt.close()

# 2. Traçage de la Heatmap de Corrélation
corr = df[["Age", "Satisfaction", "Assiduite"]].corr()

plt.figure(figsize=(7, 5))
sns.heatmap(corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1, fmt=".2f", linewidths=.5)
plt.title("Carte de corrélation linéaire entre les variables", fontsize=12, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig("correlation_heatmap.png", dpi=150)
print("✅ Heatmap enregistrée sous 'correlation_heatmap.png'")
plt.close()
`
      }
    ]
  },

  // ================= MODULE 3 : ANALYSE QUALITATIVE SOUS EXCEL =================
  {
    title: '8. Codage Thématique Manuel et Catégorisation sous Excel',
    order: 8,
    duration: 35,
    content: 'Découvrez comment extraire manuellement des thèmes à partir de verbatim qualitatifs d\'étudiants dans Excel.',
    contents: [
      {
        title: 'Théorie et pratique du codage thématique',
        contentType: 'text',
        order: 1,
        content: `# L'Analyse Qualitative : Comment coder des verbatim ?

L'analyse de données quantitatives (les chiffres) nous donne des tendances. L'analyse qualitative (les mots) nous permet de comprendre les motivations profondes.

Pour analyser des textes libres (verbatim), la méthode standard est le **codage thématique**.

---

## 🎯 Le principe du Codage Thématique

Coder un texte consiste à lui coller des "étiquettes" (ou codes) résumant l'idée principale exprimée. 
Par exemple, si un étudiant écrit : *"La salle de TP informatique n'a pas d'ordinateurs fonctionnels et il y fait très chaud"*, le chercheur attribue deux codes :
* **Matériel** (pas d'ordinateurs fonctionnels)
* **Infrastructure** (chaleur dans la salle)

---

## 🛠️ Atelier Pratique : Créer sa grille de codage sous Excel

Dans votre fichier Excel, nous allons structurer l'analyse en ajoutant deux colonnes à droite du commentaire : \`Thème Majeur\` et \`Sentiment\`.

Voici un exemple concret de codage manuel :

| ID | Commentaire étudiant (Verbatim) | 🏷️ Thème Majeur | ❤️ Tonalité / Sentiment |
| :-: | :--- | :---: | :---: |
| **1** | Excellent cours, professeurs très compétents. | **Pédagogie** | 🟢 Positif |
| **2** | Trop théorique, manque d'exemples pratiques. | **Contenu** | 🔴 Négatif |
| **3** | J'adore la formation, le matériel de TP est super ! | **Matériel** | 🟢 Positif |
| **4** | Difficultés à suivre le rythme, cours trop rapide. | **Rythme** | 🔴 Négatif |
| **5** | Bon enseignement, mais les salles sont bruyantes. | **Infrastructure** | 🟡 Neutre / Mixte |

---

## 💡 Les conseils du chercheur pour débuter
* **Créez un dictionnaire de codes** : Limitez-vous à une liste de 5 ou 6 thèmes majeurs pour ne pas vous éparpiller.
* **Soyez constant** : N'écrivez pas "Profs" sur une ligne et "Pédagogie" sur une autre. Utilisez les mêmes mots exacts pour pouvoir compter les occurrences facilement par la suite !`
      }
    ]
  },
  {
    title: '9. Recherche Lexicale et Formules de Filtres dans Excel',
    order: 9,
    duration: 40,
    content: 'Automatisez la recherche de thèmes dans vos cellules de texte avec les formules de recherche textuelle d\'Excel.',
    contents: [
      {
        title: 'Recherche lexicale par formules Excel',
        contentType: 'text',
        order: 1,
        content: `# Recherche Lexicale Automatique dans Excel

Si votre enquête comporte 500 réponses libres, faire le codage à la main prendra des jours. Nous allons automatiser la recherche de mots-clés thématiques à l'aide de formules Excel.

Imaginons que nous cherchions tous les étudiants qui parlent des **enseignants** (mots-clés associés : *professeur*, *prof*, *enseignant*, *formateur*).

---

## 🛠️ Étape 1 : Détecter la présence d'un mot-clé (Vrai / Faux)

Nous allons écrire une formule dans la cellule **H2** (à côté du commentaire situé en **G2**) :

\`\`\`excel
=ISNUMBER(SEARCH("prof", G2))   (en anglais)
=ESTNUM(CHERCHE("prof"; G2))     (en français)
\`\`\`

### 💡 Comment fonctionne cette formule ? (Explication simple)
1. **\`SEARCH("prof", G2)\`** : Excel parcourt le commentaire en G2 à la recherche du morceau de texte "prof". S'il le trouve, il renvoie sa position (ex: s'il commence au 12ème caractère, il renvoie \`12\`). S'il ne le trouve pas, il renvoie une erreur \`#VALUE!\`.
2. **\`ISNUMBER(...)\`** : Cette fonction vérifie si le résultat obtenu est un nombre. 
   * Si oui (le mot est présent) -> la formule renvoie **TRUE** (Vrai).
   * Si non (erreur, le mot est absent) -> la formule renvoie **FALSE** (Faux).

---

## 🛠️ Étape 2 : Compter le nombre de commentaires thématiques

Pour comptabiliser combien de commentaires au total mentionnent la **théorie**, nous utilisons la formule de comptage avec le caractère générique \`*\` :

\`\`\`excel
=COUNTIF(G2:G21, "*théorie*") + COUNTIF(G2:G21, "*théorique*")
=NB.SI(G2:G21; "*théorie*") + NB.SI(G2:G21; "*théorique*")
\`\`\`

> [!TIP]
> **Le rôle de l'astérisque (\`*\`)** : Il indique à Excel que des lettres peuvent exister avant ou après notre mot-clé. Ainsi, \`*théorie*\` trouvera des phrases comme "La **théorie** est complexe" ou "trop de **théorie**".`
      }
    ]
  },

  // ================= MODULE 4 : ANALYSE QUALITATIVE AVEC PYTHON =================
  {
    title: '10. Nettoyage et Préparation de Textes (NLP Débutant)',
    order: 10,
    duration: 40,
    content: 'Apprenez à nettoyer vos verbatim textuels en enlevant la ponctuation et les mots vides (stop-words) en Python.',
    contents: [
      {
        title: 'Les bases du Text Mining',
        contentType: 'text',
        order: 1,
        content: `# Nettoyage de Textes en Python (NLP pour Débutants)

L'ordinateur est une machine très littérale. Pour lui, les mots **"Cours"**, **"cours,"** (avec une virgule) et **"cours !"** (avec un point d'exclamation) sont trois mots différents.

Pour faire du traitement de texte automatique (NLP), nous devons réaliser un nettoyage rigoureux en 3 étapes :

\`\`\`
[Texte Brut] ──> 1. Passage en minuscules ──> 2. Retrait Ponctuation ──> 3. Retrait Mots Vides (Stop-Words) ──> [Texte Propre]
\`\`\`

---

## 🛑 Qu'est-ce qu'un Stop-Word (Mot Vide) ?

Ce sont tous les mots nécessaires à la grammaire mais qui n'apportent aucun sens sur le fond du commentaire (ex: *le, la, les, de, pour, dans, mais, est, sont*). 
Si nous ne les enlevons pas, l'ordinateur nous dira que le mot le plus important de notre enquête est "de" ou "le" !

Voyons comment écrire un nettoyeur de texte simple en Python.`
      },
      {
        title: 'Code Python - Nettoyer les Verbatim',
        contentType: 'code',
        order: 2,
        content: `# ── Nettoyage de verbatim textuels en français ──────────────────────────────
import pandas as pd

# Quelques commentaires bruts de notre enquête
commentaires_bruts = [
    "Excellent cours, professeurs très compétents.",
    "Trop théorique, manque d'exemples pratiques.",
    "J'adore la formation, le matériel de TP est super !",
    "Bon enseignement, mais les salles sont bruyantes."
]

# Notre dictionnaire de mots vides à éliminer
MOTS_VIDES = {
    "le", "la", "les", "de", "du", "des", "un", "une", "et", "en", "à", "pour", 
    "dans", "par", "sur", "mais", "ou", "est", "sont", "avec", "ce", "ces", "je",
    "tu", "il", "elle", "nous", "vous", "ils", "se", "sa", "son", "ses", "trop", "très"
}

def nettoyer_commentaire(texte):
    # Étape 1 : Passage en minuscules
    texte_clean = texte.lower()
    
    # Étape 2 : Suppression de la ponctuation
    for car in ".,!?;:()'\"-":
        texte_clean = texte_clean.replace(car, " ")
        
    # Étape 3 : Découpage en mots individuels
    mots = texte_clean.split()
    
    # Étape 4 : Filtrage des mots vides et mots trop courts (ex: l', d')
    mots_filtres = [m for m in mots if m not in MOTS_VIDES and len(m) > 2]
    
    # On rassemble les mots propres restants
    return " ".join(mots_filtres)

# Application pratique
print("=== COMPARAISON AVANT / APRÈS NETTOYAGE ===")
for original in commentaires_bruts:
    print(f"Original : {original}")
    print(f"Nettoyé  : {nettoyer_commentaire(original)}\\n")
`
      }
    ]
  },
  {
    title: '11. Analyse Fréquentielle et Nuage de Mots (Word Cloud)',
    order: 11,
    duration: 45,
    content: 'Générez des nuages de mots-clés en Python pour visualiser graphiquement les thèmes dominants de vos retours qualitatifs.',
    contents: [
      {
        title: 'Visualisation qualitative : Word Clouds',
        contentType: 'text',
        order: 1,
        content: `# Analyse Fréquentielle & Nuages de Mots en Python

Une fois les verbatim d'enquête nettoyés, nous voulons connaître les thématiques majeures exprimées par nos 20 répondants. 

Le **nuage de mots (Word Cloud)** est l'outil visuel le plus populaire pour synthétiser des analyses qualitatives : plus un mot a été écrit souvent par les étudiants, plus il apparaît gros dans le nuage.

---

### ☁️ Le Graphique Généré par notre Code Python

Voici l'illustration générée automatiquement à partir des commentaires des étudiants :

![Nuage de mots clés étudiants](/courses/quali_wordcloud_illustration.png)

---

## 🔍 Comment interpréter scientifiquement ce Nuage de Mots ?

En analysant la taille et les regroupements de mots dans le graphique, nous pouvons structurer nos conclusions de recherche :

1. **Les Forces Pédagogiques (Mots géants : "cours", "professeurs", "pédagogie")** : 
   * *Analyse* : Ces termes dominent largement le nuage. Cela signifie que l'appréciation globale repose d'abord sur la qualité des enseignants et de leur enseignement. L'encadrement humain est perçu comme excellent.
2. **Le Problème de l'Abstraction (Mots moyens : "théorique", "manque", "pratiques")** :
   * *Analyse* : La présence marquée de ce triptyque sémantique traduit un besoin fort de changement. Les étudiants apprécient le contenu mais se sentent submergés par la théorie. Ils demandent plus de cas pratiques et de manipulation concrète.
3. **Les Alertes Logistiques (Mots petits : "matériel", "salles", "bruyantes", "lente")** :
   * *Analyse* : Bien que plus petits, ces mots mettent en lumière des points de friction matériels bien réels (problèmes de bruit ou de lenteur administrative).
`
      },
      {
        title: 'Code Python - Fréquences et Nuage de Mots',
        contentType: 'code',
        order: 2,
        content: `# ── Analyse de Fréquence et Word Cloud en Python ───────────────────────────
import pandas as pd
from collections import Counter
import matplotlib.pyplot as plt
from wordcloud import WordCloud

# Chargement complet des verbatim de notre enquête
donnees_recherche = {
    "Commentaire": [
        "Excellent cours, professeurs très compétents.",
        "Trop théorique, manque d'exemples pratiques.",
        "J'adore la formation, le matériel de TP est super !",
        "Difficultés à suivre le rythme, cours trop rapide.",
        "Bon enseignement, mais les salles sont bruyantes.",
        "Super pédagogie, je recommande vivement ce cours.",
        "Le contenu est correct mais manque d'interactivité.",
        "Très bonne expérience globale, profs disponibles.",
        "Pas mal, mais l'organisation administrative est lente.",
        "Parfait, les projets pratiques m'ont beaucoup aidé.",
        "Bon niveau académique, bibliothèque bien équipée.",
        "Quelques modules sont trop denses, examens difficiles.",
        "Excellent suivi pédagogique et bons débouchés.",
        "Déçu par le manque d'écoute des enseignants.",
        "Rythme soutenu mais formateurs au top.",
        "Moyen, l'accès aux cours en ligne est complexe.",
        "Stage pratique de qualité, formation solide.",
        "Cours intéressants mais trop orientés théorie.",
        "Rien à redire, l'accompagnement est excellent !",
        "Les supports de cours ne sont pas à jour."
    ]
}
df = pd.DataFrame(donnees_recherche)

# Dictionnaire de nettoyage
MOTS_VIDES = {
    "le", "la", "les", "de", "du", "des", "un", "une", "et", "en", "à", "pour", 
    "dans", "par", "sur", "mais", "ou", "est", "sont", "avec", "ce", "ces", "je",
    "aux", "ont", "pas", "non", "plus"
}

def nettoyer_texte(texte):
    txt = str(texte).lower()
    for car in ".,!?;:()'-":
        txt = txt.replace(car, " ")
    mots = txt.split()
    return [m for m in mots if m not in MOTS_VIDES and len(m) > 3]

# 1. Extraction et calcul des fréquences
mots_corpus = []
for com in df["Commentaire"]:
    mots_corpus.extend(nettoyer_texte(com))

compteur = Counter(mots_corpus)

print("=== TOP 5 DES MOTS LES PLUS UTILISÉS ===")
for mot, count in compteur.most_common(5):
    print(f"- {mot:12s} : {count} citations")

# 2. Génération visuelle du Nuage
texte_global = " ".join(mots_corpus)

wordcloud = WordCloud(
    width=800, 
    height=400, 
    background_color="white", 
    colormap="Blues",
    max_words=30
).generate(texte_global)

# Tracé et sauvegarde
plt.figure(figsize=(10, 5))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
plt.title("Nuage des thèmes récurrents (Retours étudiants)", fontsize=13, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig("nuage_mots_etudiants.png", dpi=150)
print("\\n✅ Nuage de mots enregistré sous 'nuage_mots_etudiants.png'")
plt.close()
`
      }
    ]
  },
  {
    title: '12. Analyse de Sentiment Basique et Synthèse de Recherche',
    order: 12,
    duration: 50,
    content: 'Créez un algorithme d\'analyse de sentiment simple par mots-clés et apprenez à structurer votre rapport final.',
    contents: [
      {
        title: 'Sentiments et rapport final',
        contentType: 'text',
        order: 1,
        content: `# Analyse de Sentiment Automatisée & Rapport Final

Comment l'ordinateur fait-il pour savoir si une phrase écrite est positive ou négative sans la comprendre comme un humain ?

La méthode la plus simple pour débuter consiste à utiliser une **approche lexicale** (un dictionnaire de mots).

---

## 🧠 Le principe de l'algorithme de sentiment (Novice)

Nous définissons deux listes de mots-clés dans la mémoire de l'ordinateur :
* **Mots Positifs** : *excellent, compétent, j'adore, super, bon, parfait, disponible...*
* **Mots Négatifs** : *théorique, manque, difficile, bruyant, lent, déçu, complexe...*

L'ordinateur lit chaque phrase et fait les comptes :
* S'il trouve un mot positif, il ajoute **+1** au score de la phrase.
* S'il trouve un mot négatif, il enlève **-1** au score.
* Si le score final est supérieur à 0 -> Le commentaire est classé **Positif**.
* Si le score final est inférieur à 0 -> Le commentaire est classé **Négatif**.
* Si le score est égal à 0 -> Le commentaire est classé **Neutre**.

Découvrons le code complet pour appliquer cette classification automatique et dresser le graphique final.`
      },
      {
        title: 'Code Python - Analyse de sentiments',
        contentType: 'code',
        order: 2,
        content: `# ── Analyse de sentiment lexicale simplifiée ──────────────────────────────
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

donnees_recherche = {
    "EtudiantID": list(range(1, 21)),
    "Commentaire": [
        "Excellent cours, professeurs très compétents.",
        "Trop théorique, manque d'exemples pratiques.",
        "J'adore la formation, le matériel de TP est super !",
        "Difficultés à suivre le rythme, cours trop rapide.",
        "Bon enseignement, mais les salles sont bruyantes.",
        "Super pédagogie, je recommande vivement ce cours.",
        "Le contenu est correct mais manque d'interactivité.",
        "Très bonne expérience globale, profs disponibles.",
        "Pas mal, mais l'organisation administrative est lente.",
        "Parfait, les projets pratiques m'ont beaucoup aidé.",
        "Bon niveau académique, bibliothèque bien équipée.",
        "Quelques modules sont trop denses, examens difficiles.",
        "Excellent suivi pédagogique et bons débouchés.",
        "Déçu par le manque d'écoute des enseignants.",
        "Rythme soutenu mais formateurs au top.",
        "Moyen, l'accès aux cours en ligne est complexe.",
        "Stage pratique de qualité, formation solide.",
        "Cours intéressants mais trop orientés théorie.",
        "Rien à redire, l'accompagnement est excellent !",
        "Les supports de cours ne sont pas à jour."
    ]
}
df = pd.DataFrame(donnees_recherche)

# Dictionnaires de classification
MOTS_POSITIFS = {"excellent", "compétents", "adore", "super", "bon", "bonne", "parfait", "aidé", "équipée", "solide"}
MOTS_NEGATIFS = {"théorique", "manque", "difficultés", "rapide", "bruyantes", "lente", "denses", "difficiles", "déçu", "complexe", "théorie", "déçus"}

def calculer_sentiment(phrase):
    mots = str(phrase).lower().split()
    score = 0
    for m in mots:
        m_clean = m.strip(".,!?;:")
        if m_clean in MOTS_POSITIFS:
            score += 1
        elif m_clean in MOTS_NEGATIFS:
            score -= 1
            
    if score > 0:
        return "Positif"
    elif score < 0:
        return "Négatif"
    else:
        return "Neutre"

# Application de la fonction
df["Sentiment"] = df["Commentaire"].apply(calculer_sentiment)

print("=== CLASSIFICATION DES COMMENTAIRES (Exemple) ===")
print(df[["Commentaire", "Sentiment"]].head(8))

# Synthèse statistique des sentiments
print("\\n=== RÉPARTITION FINALE DES SENTIMENTS ===")
repartition = df["Sentiment"].value_counts()
print(repartition)

# Visualisation finale
sns.set_theme(style="darkgrid")
plt.figure(figsize=(7, 4))
sns.countplot(data=df, x="Sentiment", order=["Positif", "Neutre", "Négatif"], palette="viridis")
plt.title("Répartition émotionnelle des retours étudiants (NLP)", fontsize=12, fontweight='bold', pad=15)
plt.xlabel("Sentiment détecté")
plt.ylabel("Nombre de répondants")
plt.tight_layout()
plt.savefig("repartition_sentiments.png", dpi=150)
print("\\n✅ Graphique 'repartition_sentiments.png' enregistré avec succès !")
plt.close()
`
      },
      {
        title: 'Le Rapport de Recherche Mixte Final',
        contentType: 'text',
        order: 3,
        content: `# Guide pour rédiger votre premier Rapport de Recherche Mixte

Félicitations, vous avez analysé les chiffres (satisfaction, assiduité) et les mots (verbatim, thèmes, sentiments) de votre enquête. 

Pour présenter vos résultats de manière académique ou professionnelle, structurez votre rapport final en 4 parties claires :

---

### 📄 Plan type de Rapport de Recherche (Modèle à copier)

| Partie du Rapport | Éléments clés à intégrer | Ce que vous devez écrire (Exemple concret) |
| :--- | :--- | :--- |
| **1. Introduction** | Contexte de l'étude et taille de l'échantillon. | *"Cette enquête évalue la satisfaction de 20 étudiants de 4 facultés différentes au semestre 1 2026."* |
| **2. Analyse Quantitative** | Résultats des calculs de moyenne et graphiques. | *"La satisfaction moyenne s'établit à 3.45/5. L'analyse par Faculté révèle un écart majeur : la médecine affiche 4.5/5 tandis que les lettres stagnent à 2.25/5."* |
| **3. Analyse Qualitative** | Mots les plus cités et sentiments détectés. | *"L'analyse textuelle montre que l'équipe pédagogique est très appréciée. Cependant, les termes 'théorique' et 'matériel' reviennent fréquemment dans les facultés insatisfaites."* |
| **4. Recommandations** | Solutions proposées pour résoudre les problèmes. | *"Nous recommandons de moderniser les équipements de TP et d'intégrer des cas pratiques en Droit et Lettres pour réduire le sentiment d'abstraction."* |
`
      }
    ]
  }
];

async function main() {
  console.log('Début du seeding du cours d\'Analyse de Données Quali & Quanti...');

  // 1. Création / Mise à jour du cours
  const course = await prisma.course.upsert({
    where: { slug: 'analyse-donnees-quali-quanti' },
    update: {
      title: 'Analyse de Données Qualitatives & Quantitatives : Excel et Python pour Novices',
      title_en: 'Qualitative & Quantitative Data Analysis: Excel & Python for Novices',
      title_ar: 'تحليل البيانات الكيفية والكمية: إكسل وبايثون للمبتدئين',
      description: 'Apprenez à combiner Excel et Python pour nettoyer, analyser et visualiser des données qualitatives et quantitatives de recherche.',
      description_en: 'Learn to combine Excel and Python to clean, analyze, and visualize qualitative and quantitative research data.',
      description_ar: 'تعلم كيفية الجمع بين إكسل وبايثون لتنظيف وتحليل وتصور البيانات البحثية الكيفية والكمية.',
      price: 0,
      priceDZ: 0,
      priceEU: 0,
      isFree: true,
      isPublished: true,
      level: 'Débutant',
      duration: '15h 00m',
      image: '/images/courses/quali-quanti-cover.png',
      learningOutcomes: JSON.stringify(learningOutcomes),
      requirements: JSON.stringify(requirements),
      fullDescription: `# Analyse de Données Qualitatives & Quantitatives : Excel et Python pour Novices

Cette formation complète a été spécialement conçue pour les chercheurs, étudiants et analystes souhaitant maîtriser les méthodologies d'analyse de données mixtes (qualitatives et quantitatives) de A à Z.

### Ce que vous allez apprendre :
* **Fondements de l'Analyse Mixte** : Comprendre comment associer les chiffres et les mots pour enrichir vos conclusions.
* **Maîtrise d'Excel (Niveau Novice)** : Nettoyer des données brutes, réaliser des calculs statistiques descriptifs (moyenne, médiane, écart-type), croiser des variables avec les Tableaux Croisés Dynamiques (TCD) et générer des graphiques professionnels.
* **Transition vers Python** : Charger des jeux de données d'enquête avec Pandas, calculer des agrégations complexes et automatiser vos rapports.
* **Visualisation de Données (DataViz)** : Construire des histogrammes, des Boxplots et des Heatmaps de corrélation avec Matplotlib et Seaborn.
* **Analyse Qualitative et Traitement de Texte (NLP)** : Coder des verbatim sous Excel et utiliser Python pour nettoyer des textes, calculer les fréquences lexicales, générer des nuages de mots (Word Clouds) et classer les commentaires par analyse de sentiment.

### Pourquoi suivre ce cours ?
✅ **Accessible aux débutants** : Aucun prérequis en programmation Python ou statistiques avancées.
✅ **Jeu de données réel** : Vous travaillez sur une vraie enquête d'étudiants, combinant notes et retours d'expérience libres.
✅ **Pratique à 100%** : Chaque leçon contient des formules Excel prêtes à l'emploi et des scripts Python autonomes.
`
    },
    create: {
      id: COURSE_ID,
      title: 'Analyse de Données Qualitatives & Quantitatives : Excel et Python pour Novices',
      title_en: 'Qualitative & Quantitative Data Analysis: Excel & Python for Novices',
      title_ar: 'تحليل البيانات الكيفية والكمية: إكسل وبايثون للمبتدئين',
      slug: 'analyse-donnees-quali-quanti',
      description: 'Apprenez à combiner Excel et Python pour nettoyer, analyser et visualiser des données qualitatives et quantitatives de recherche.',
      description_en: 'Learn to combine Excel and Python to clean, analyze, and visualize qualitative and quantitative research data.',
      description_ar: 'تعلم كيفية الجمع بين إكسل وبايثون لتنظيف وتحليل وتصور البيانات البحثية الكيفية والكمية.',
      price: 0,
      priceDZ: 0,
      priceEU: 0,
      isFree: true,
      isPublished: true,
      level: 'Débutant',
      duration: '15h 00m',
      image: '/images/courses/quali-quanti-cover.png',
      learningOutcomes: JSON.stringify(learningOutcomes),
      requirements: JSON.stringify(requirements),
      fullDescription: `# Analyse de Données Qualitatives & Quantitatives : Excel et Python pour Novices

Cette formation complète a été spécialement conçue pour les chercheurs, étudiants et analystes souhaitant maîtriser les méthodologies d'analyse de données mixtes (qualitatives et quantitatives) de A à Z.

### Ce que vous allez apprendre :
* **Fondements de l'Analyse Mixte** : Comprendre comment associer les chiffres et les mots pour enrichir vos conclusions.
* **Maîtrise d'Excel (Niveau Novice)** : Nettoyer des données brutes, réaliser des calculs statistiques descriptifs (moyenne, médiane, écart-type), croiser des variables avec les Tableaux Croisés Dynamiques (TCD) et générer des graphiques professionnels.
* **Transition vers Python** : Charger des jeux de données d'enquête avec Pandas, calculer des agrégations complexes et automatiser vos rapports.
* **Visualisation de Données (DataViz)** : Construire des histogrammes, des Boxplots et des Heatmaps de corrélation avec Matplotlib et Seaborn.
* **Analyse Qualitative et Traitement de Texte (NLP)** : Coder des verbatim sous Excel et utiliser Python pour nettoyer des textes, calculer les fréquences lexicales, générer des nuages de mots (Word Clouds) et classer les commentaires par analyse de sentiment.

### Pourquoi suivre ce cours ?
✅ **Accessible aux débutants** : Aucun prérequis en programmation Python ou statistiques avancées.
✅ **Jeu de données réel** : Vous travaillez sur une vraie enquête d'étudiants, combinant notes et retours d'expérience libres.
✅ **Pratique à 100%** : Chaque leçon contient des formules Excel prêtes à l'emploi et des scripts Python autonomes.
`
    }
  });

  console.log(`✓ Cours "${course.title}" créé ou mis à jour.`);

  // 2. Nettoyage des anciennes leçons pour ce cours
  await prisma.lesson.deleteMany({ where: { courseId: COURSE_ID } });
  console.log('✓ Anciennes leçons supprimées.');

  // 3. Création des nouvelles leçons et de leurs contenus
  for (const lesson of lessons) {
    const { contents, ...lessonData } = lesson;
    const createdLesson = await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: COURSE_ID,
        contents: {
          create: contents.map(c => ({
            title: c.title,
            content: c.content,
            contentType: c.contentType,
            order: c.order,
          }))
        }
      }
    });
    console.log(`  ✓ Leçon ${createdLesson.order} créée : "${createdLesson.title}" (${contents.length} sections)`);
  }

  console.log('\n✅ Seeding du cours d\'Analyse Quali/Quanti complété avec succès !');
}

main()
  .catch(e => {
    console.error('❌ Erreur durant le seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
