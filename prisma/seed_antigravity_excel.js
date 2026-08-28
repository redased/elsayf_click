require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Début du seed pour la formation Google Antigravity & Excel Avancé (7 leçons) ...')

    const slug = 'antigravity-excel-advanced'

    // Résultats d'apprentissage (Learning Outcomes)
    const learningOutcomes = [
        "Configurer un environnement d'automatisation Python complet pour Excel",
        "Formuler des prompts précis pour déléguer le filtrage de données massives à l'IA",
        "Écrire et insérer dynamiquement des formules complexes (VLOOKUP, SUMIFS, IF)",
        "Appliquer une charte graphique premium (styles HSL, bordures doubles, alignements) avec openpyxl",
        "Créer des règles de mise en forme conditionnelle avancées par programmation",
        "Réaliser des analyses statistiques descriptives complètes et des groupements de données",
        "Maîtriser la création de Tableaux Croisés Dynamiques (Pivot Tables) et les agrégations complexes",
        "Automatiser la consolidation de dizaines de classeurs Excel en un rapport unique",
        "Générer des graphiques professionnels (secteurs, barres 3D) directement intégrés à Excel"
    ]

    const learningOutcomes_en = [
        "Set up a complete Python automation environment for Excel",
        "Write precise prompts to delegate massive data filtering to AI",
        "Write and dynamically insert complex Excel formulas (VLOOKUP, SUMIFS, IF)",
        "Apply a premium graphic identity (HSL styles, double borders, alignments) using openpyxl",
        "Create advanced conditional formatting rules programmatically",
        "Perform comprehensive descriptive statistical analysis and data grouping",
        "Master the creation of Pivot Tables and complex aggregations",
        "Automate the consolidation of dozens of Excel workbooks into a single report",
        "Generate professional charts (pie, 3D bar) integrated directly into Excel"
    ]

    const learningOutcomes_ar = [
        "تهيئة بيئة عمل كاملة لأتمتة ملفات إكسل باستخدام بايثون",
        "صياغة مطالبات دقيقة لتوجيه الذكاء الاصطناعي لتصفية البيانات الضخمة",
        "كتابة وإدخال معادلات إكسل المعقدة برمجياً مثل (VLOOKUP, SUMIFS, IF)",
        "تطبيق تنسيقات ورسومات مميزة (أنماط HSL، حدود مزدوجة، محاذاة) باستخدام openpyxl",
        "إنشاء قواعد تنسيق شرطي متقدمة عن طريق البرمجة",
        "إجراء تحليلات إحصائية وصفية وتجميعية كاملة للبيانات",
        "إتقان إنشاء جداول محورية (Pivot Tables) والتجميعات المعقدة",
        "أتمتة دمج عشرات مصنفات إكسل في تقرير موحد",
        "إنشاء مخططات بيانية احترافية (دائرية، أعمدة ثلاثية الأبعاد) مدمجة مباشرة في إكسل"
    ]

    // Prérequis (Requirements)
    const requirements = [
        "Avoir suivi la formation d'initiation Google Antigravity",
        "Notions de base en Python (variables, listes, structures conditionnelles, boucles)",
        "Ordinateur avec Python installé ou accès à l'espace de dev de la plateforme"
    ]

    const requirements_en = [
        "Have completed the introductory Google Antigravity course",
        "Basic Python notions (variables, lists, conditional structures, loops)",
        "Computer with Python installed or access to the platform's dev space"
    ]

    const requirements_ar = [
        "إكمال الدورة التمهيدية لمساعد Google Antigravity",
        "مفاهيم أساسية في لغة بايثون (المتغيرات، القوائم، الهياكل الشرطية، الحلقات)",
        "كمبيوتر مثبت عليه بايثون أو الوصول إلى مساحة التطوير بالمنصة"
    ]

    // Description complète en Markdown
    const fullDescription = `# Antigravity : Automatisation Excel Avancée
    
## Maîtrisez le traitement de données et le reporting avec l'IA agentique

Cette formation intensive est axée à 100% sur l'automatisation de feuilles de calcul Excel en utilisant l'assistant de codage **Google Antigravity** et l'écosystème Python. 

### 📥 Télécharger l'assistant Antigravity
Pour suivre cette formation pratique, vous devez installer l'assistant de bureau :
👉 **[Télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

### Ce que ce cours va vous apporter :

📊 **Productivité Décuplée** : Ne perdez plus des heures à copier-coller des lignes. Laissez Antigravity coder des scripts de nettoyage de données instantanément.  
🎨 **Rapports Esthétiques** : Générez des tableaux formater de manière premium (styles HSL, typographies épurées, mise en forme conditionnelle) qui impressionneront vos clients et collègues.  
📈 **Dashboards Automatisés** : Consolidez des fichiers multiples et insérez des graphiques professionnels sans ouvrir Excel.

---

### Programme de la formation :
1. **Mise en route** : Prompting et configuration d'un script Python avec openpyxl.
2. **Lecture & Filtrage** : Requêtes complexes et nettoyage de gros volumes avec Pandas.
3. **Formules & Calculs** : Écriture dynamique de formules avancées (IF, VLOOKUP, SUMIFS).
4. **Mise en forme Premium** : Stylisation professionnelle et mise en forme conditionnelle.
5. **Analyse de Données & Statistiques** : Statistiques descriptives, quantiles et écart-types.
6. **Tableaux Croisés Dynamiques** : Pivot Tables, groupements multidimensionnels et rapports.
7. **Projet Final** : Consolidation multi-fichiers et insertion automatique de graphiques.
`

    const fullDescription_en = `# Antigravity: Advanced Excel Automation
    
## Master data processing and reporting with Agentic AI

### 📥 Download the Antigravity Assistant
To follow this hands-on course, you must install the desktop assistant:
👉 **[Download Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

This intensive course is 100% focused on automating Excel spreadsheets using the **Google Antigravity** coding assistant and the Python ecosystem.
`

    const fullDescription_ar = `# أنتيجرافيتي: أتمتة إكسل المتقدمة
    
## احترف معالجة البيانات وإعداد التقارير باستخدام الذكاء الاصطناعي الوكيل

### 📥 تحميل مساعد Antigravity
لمتابعة هذا التدريب العملي، يجب عليك تثبيت مساعد المكتب:
👉 **[تحميل Antigravity Desktop لنظام (Windows / macOS / Linux)](/telecharger)**
`

    // Supprimer le cours s'il existe déjà
    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) {
        console.log('⚠️ Cours existant trouvé. Suppression pour ré-insertion propre...')
        await prisma.course.delete({ where: { slug } })
    }

    const course = await prisma.course.create({
        data: {
            title: "Google Antigravity : Automatisation Excel Avancée",
            title_en: "Google Antigravity: Advanced Excel Automation",
            title_ar: "جوجل أنتيجرافيتي: أتمتة إكسل المتقدمة",
            slug: slug,
            description: "Devenez un expert du traitement de données Excel en apprenant à piloter des scripts de nettoyage, de stylisation, d'analyse statistique et de consolidation via Google Antigravity.",
            description_en: "Become an Excel data processing expert by learning to drive cleaning, styling, statistical analysis, and consolidation scripts via Google Antigravity.",
            description_ar: "كن خبيرًا في معالجة بيانات إكسل من خلال تعلم قيادة سيناريوهات التنظيف والتنسيق والتحليل الإحصائي والدمج عبر Google Antigravity.",
            price: 0,
            isFree: true,
            isPublished: true,
            isInviteOnly: false,
            level: "Avancé",
            duration: "9h 30m",
            image: "/courses/antigravity_excel_cover.png",
            fullDescription,
            fullDescription_en,
            fullDescription_ar,
            learningOutcomes: JSON.stringify(learningOutcomes),
            learningOutcomes_en: JSON.stringify(learningOutcomes_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes_ar),
            requirements: JSON.stringify(requirements),
            requirements_en: JSON.stringify(requirements_en),
            requirements_ar: JSON.stringify(requirements_ar),
            lessons: {
                create: [
                    // ===== LESSON 1 =====
                    {
                        title: "1. Mise en route et premier script de création Excel",
                        title_en: "1. Getting started and first Excel creation script",
                        title_ar: "1. البدء وأول سيناريو لإنشاء ملف إكسل",
                        duration: 60,
                        order: 1,
                        isFree: true,
                        content: "Configurez openpyxl avec Antigravity et écrivez votre premier script de génération de données.",
                        contents: {
                            create: [
                                {
                                    title: "Configuration et premier classeur",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 1 : Mise en route et premier script de création Excel

![Interface Antigravity](/courses/antigravity_excel_l1.png)

> [!IMPORTANT]
> **1. Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**
>
> **2. Télécharger et installer Python** :
> Les scripts de ce cours s'exécutent avec le langage Python. Téléchargez la dernière version stable (3.10 ou supérieure) :
> 👉 **[Télécharger Python sur le site officiel (python.org)](https://www.python.org/downloads/)**

## 1. Guide d'installation et de compatibilité

### Systèmes d'exploitation compatibles
* **Windows** : Windows 10 et 11 (64-bit).
* **macOS** : macOS Catalina (10.15) ou version ultérieure.
* **Linux** : Ubuntu, Debian, Fedora, Arch Linux (formats \`.AppImage\`).

### Instructions d'installation pas-à-pas

#### 1. Installation de Python
* **Sur Windows** :
  1. Lancez l'installateur téléchargé (\`.exe\`).
  2. **CRUCIAL** : Cochez la case **"Add Python to PATH"** en bas avant de cliquer sur *Install Now*. Si vous oubliez cela, vos terminaux ne reconnaîtront pas Python.
  3. Cliquez sur *Install Now* puis sur *Close* à la fin.
* **Sur macOS** :
  1. Ouvrez le fichier \`.pkg\` téléchargé et suivez l'assistant d'installation par défaut.
* **Sur Linux** :
  1. Installez Python via votre gestionnaire de paquets (ex: \`sudo apt install python3 python3-pip\` sur Ubuntu).

#### 2. Installation d'Antigravity Desktop
* **Windows** : Téléchargez l'exécutable et lancez-le pour l'installer dans votre dossier utilisateur.
* **macOS** : Ouvrez le fichier \`.dmg\` et glissez-déposez *Elsayf Desktop* dans votre dossier *Applications*.
* **Linux** : Rendez le fichier \`.AppImage\` exécutable via \`chmod +x\` et lancez-le.

---

## 2. Pourquoi utiliser Python pour Excel ?

Le langage VBA (Visual Basic for Applications) est le moteur historique d'Excel, mais il souffre de nombreuses limites :
- Syntaxe obsolète et lente sur de gros volumes.
- Difficulté à intégrer des APIs et des modèles d'IA modernes.
- Gestion complexe des dépendances.

En collaborant avec Antigravity, vous utiliserez **Python** avec deux bibliothèques majeures :
- \`openpyxl\` : Idéal pour créer des fichiers, éditer des cellules individuelles et appliquer des styles.
- \`pandas\` : Le standard de l'analyse de données pour filtrer et nettoyer de grandes tables.

---

## 3. Configurer l'environnement avec Antigravity

Pour démarrer, ouvrez la console Antigravity et demandez-lui d'installer les dépendances requises dans votre espace de travail :

> *"Antigravity, prépare un environnement Python dans mon projet et installe openpyxl et pandas."*

L'agent va exécuter de manière autonome les commandes d'installation nécessaires :
\`\`\`bash
pip install openpyxl pandas
\`\`\`

---

## 4. Premier Prompt : Création d'un classeur de base

Une fois les paquets installés, demandez à Antigravity d'écrire un script de création de classeur simple :

> *"Écris un script Python nommé \`creer_ventes.py\` qui crée un classeur Excel avec une feuille 'Ventes'. Ajoute une ligne d'en-tête (Produit, Quantité, Prix, Total) et 3 lignes de données. Enregistre le fichier sous le nom \`ventes_depart.xlsx\`."*

### Le code généré par l'agent :

\`\`\`python
import openpyxl

# 1. Initialisation du classeur en mémoire
wb = openpyxl.Workbook()

# 2. Récupération de la feuille active par défaut
ws = wb.active

# 3. Renommer l'onglet
ws.title = "Ventes"

# 4. Données de départ (En-tête et lignes de produits)
headers = ["Produit", "Quantité", "Prix", "Total"]
ws.append(headers)

items = [
    ["Smartphone", 12, 45000, 12 * 45000],
    ["Laptop Pro", 5, 120000, 5 * 120000],
    ["Écran 27\"", 8, 28000, 8 * 28000]
]

# 5. Injection des données ligne par ligne
for item in items:
    ws.append(item)

# 6. Sauvegarde du fichier sur le disque dur
wb.save("ventes_depart.xlsx")
print("Fichier ventes_depart.xlsx créé avec succès !")
\`\`\`

### Explication détaillée de chaque ligne de code :

* **\`import openpyxl\`** : Cette ligne importe la bibliothèque \`openpyxl\`, qui permet de manipuler les fichiers Excel au format \`.xlsx\` de manière native sans avoir besoin d'ouvrir Excel.
* **\`wb = openpyxl.Workbook()\`** : Nous instancions (créons) un nouvel objet \`Workbook\`. C'est l'équivalent de faire *Fichier > Nouveau* dans Excel. Ce classeur est créé en mémoire vive (RAM).
* **\`ws = wb.active\`** : Lorsque vous créez un classeur, openpyxl crée automatiquement une feuille blanche. Nous récupérons cette feuille par défaut à l'aide de la propriété \`active\` et nous la stockons dans la variable \`ws\` (Worksheet).
* **\`ws.title = "Ventes"\`** : Nous modifions le nom de l'onglet courant pour le définir sur "Ventes" (par défaut, il s'appelait "Sheet").
* **\`headers = ["Produit", "Quantité", "Prix", "Total"]\`** : Nous créons une liste de textes représentant les titres de nos colonnes.
* **\`ws.append(headers)\`** : La méthode \`append()\` ajoute une ligne complète à la fin de la feuille active. Puisque la feuille était vide, les en-têtes sont écrits sur la ligne 1 (cellules A1, B1, C1, D1).
* **\`items = [...]\`** : Nous définissons une liste de listes (tableau à deux dimensions) contenant nos lignes de transactions (Smartphone, Laptop Pro, Écran 27). Le dernier élément de chaque sous-liste calcule statiquement le total en multipliant la quantité par le prix en Python.
* **\`for item in items:\`** : Nous ouvrons une boucle \`for\` pour parcourir chaque élément (chaque sous-liste) de notre liste principale \`items\`.
* **\`ws.append(item)\`** : À chaque itération de la boucle, nous ajoutons le produit courant en dessous du précédent. Les produits seront donc insérés sur les lignes 2, 3 et 4.
* **\`wb.save("ventes_depart.xlsx")\`** : Nous enregistrons le classeur sur notre disque dur sous le nom \`ventes_depart.xlsx\`. C'est à ce moment précis que le fichier est créé physiquement.
* **\`print("Fichier ventes_depart.xlsx créé avec succès !")\`** : Affiche un message dans votre terminal pour confirmer que l'écriture s'est bien déroulée.

---

Exécutez ce code et vérifiez la création du fichier. Dans la leçon suivante, nous utiliserons Pandas pour filtrer de gros fichiers Excel !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 2 =====
                    {
                        title: "2. Lecture et filtrage intelligent avec Pandas",
                        title_en: "2. Reading and smart filtering with Pandas",
                        title_ar: "2. القراءة والتصفية الذكية باستخدام Pandas",
                        duration: 75,
                        order: 2,
                        isFree: true,
                        content: "Apprenez à charger de gros volumes de données Excel et à appliquer des filtres avancés via l'IA.",
                        contents: {
                            create: [
                                {
                                    title: "Filtrage et Nettoyage de Données",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 2 : Lecture et filtrage intelligent avec Pandas

![Filtrage de Données](/courses/antigravity_excel_l2.png)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

Les fichiers Excel réels contiennent souvent des milliers de lignes et de nombreuses anomalies (valeurs manquantes, doublons, formats incohérents). Dans cette leçon, nous allons voir comment filtrer et nettoyer ces données rapidement avec **Pandas** et **Antigravity**.

## 1. Charger des données avec Pandas

Pandas utilise l'objet \`DataFrame\` pour structurer les données sous forme de tableau bidimensionnel très performant.

Pour lire un classeur Excel, le code de base est :
\`\`\`python
import pandas as pd
df = pd.read_excel("ventes_globales.xlsx")
\`\`\`

## 2. Formuler une requête de filtrage à Antigravity

Imaginons que vous ayez un fichier contenant l'historique des ventes d'une boutique avec des cellules vides dans la colonne "Client" et des transactions négatives ou aberrantes. Vous pouvez demander à Antigravity de coder le nettoyage :

> *"Antigravity, lis le fichier \`ventes_globales.xlsx\` à l'aide de pandas. Nettoie la table en supprimant les lignes où le 'Client' est manquant, puis filtre pour ne garder que les lignes où la 'Région' est 'Ouest' et le 'Montant' est strictement supérieur à 5000 DA. Enregistre le résultat dans \`ventes_propres.xlsx\`."*

### Le code généré :

\`\`\`python
import pandas as pd

# 1. Chargement du fichier Excel
df = pd.read_excel("ventes_globales.xlsx")

# 2. Suppression des valeurs manquantes dans la colonne Client
df_cleaned = df.dropna(subset=["Client"])

# 3. Filtrage multicritère
df_filtered = df_cleaned[
    (df_cleaned["Région"] == "Ouest") & 
    (df_cleaned["Montant"] > 5000)
]

# 4. Enregistrement vers un nouveau fichier
df_filtered.to_excel("ventes_propres.xlsx", index=False)
print(f"Filtrage terminé. {len(df_filtered)} lignes conservées.")
\`\`\`

Dans la section suivante, nous étudierons un script de nettoyage complet très détaillé !`
                                },
                                {
                                    title: "Script complet et détaillé de nettoyage de ventes",
                                    contentType: "text",
                                    order: 2,
                                    content: `# Script Détaillé : Nettoyage et Filtrage Pandas

Voici un script de production robuste et commenté ligne par ligne pour traiter des anomalies courantes de fichiers Excel en entreprise.

\`\`\`python
import pandas as pd
import numpy as np

def nettoyer_donnees_ventes(input_file, output_file):
    """
    Lit un fichier Excel de ventes, nettoie les données aberrantes/manquantes,
    et filtre pour extraire les transactions clés.
    """
    print(f"Chargement du fichier {input_file}...")
    # Lire le classeur Excel et le charger dans un DataFrame Pandas
    df = pd.read_excel(input_file)
    
    # 1. Suppression des lignes vides critiques
    # On élimine les lignes qui n'ont ni Client ni ID_Commande
    df_propre = df.dropna(subset=["Client", "ID_Commande"])
    print(f"Après suppression des lignes vides : {len(df_propre)} lignes.")
    
    # 2. Remplacement des valeurs numériques manquantes (NaN)
    # Remplacer les quantités vides par 0 et convertir en entier
    df_propre["Quantité"] = df_propre["Quantité"].fillna(0).astype(int)
    # Remplacer les prix unitaires vides par 0.0
    df_propre["Prix"] = df_propre["Prix"].fillna(0.0)
    
    # 3. Recalcul de la colonne Total
    # Cela permet de corriger toute formule Excel corrompue dans le fichier source
    df_propre["Total"] = df_propre["Quantité"] * df_propre["Prix"]
    
    # 4. Élimination des doublons de commande
    # On garde seulement la première occurrence de chaque ID de commande unique
    df_propre = df_propre.drop_duplicates(subset=["ID_Commande"], keep="first")
    print(f"Après déduplication : {len(df_propre)} commandes uniques.")
    
    # 5. Filtrage des ventes importantes en région Ouest
    # Critères : région 'Ouest' et montant cumulé supérieur à 5 000 DA
    df_final = df_propre[
        (df_propre["Région"] == "Ouest") & 
        (df_propre["Total"] > 5000)
    ]
    
    # 6. Exportation vers le nouveau fichier Excel sans conserver les index Pandas
    df_final.to_excel(output_file, index=False)
    print(f"Opération terminée. Fichier enregistré sous : {output_file}")

# Exemple d'appel du script
# nettoyer_donnees_ventes("ventes_brutes.xlsx", "ventes_ouest_premium.xlsx")
\`\`\`

### Explication des fonctions utilisées :
- \`dropna(subset=[...])\` : Cible spécifiquement les colonnes dont l'absence de valeur invalide l'enregistrement.
- \`fillna(valeur)\` : Remplace de manière sécurisée les trous de données pour éviter les erreurs de type lors des calculs mathématiques.
- \`drop_duplicates()\` : Indispensable pour nettoyer les rapports consolidés contenant des doublons issus de plusieurs saisies.`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 3 =====
                    {
                        title: "3. Calculs et formules dynamiques complexes",
                        title_en: "3. Complex calculation and dynamic formulas",
                        title_ar: "3. الحسابات والمعادلات الديناميكية المعقدة",
                        duration: 80,
                        order: 3,
                        isFree: false,
                        content: "Insérer des formules Excel dynamiques (SUM, AVERAGE, VLOOKUP, IF) dans des cellules via openpyxl.",
                        contents: {
                            create: [
                                {
                                    title: "Insertion de Formules Excel",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 3 : Calculs et formules dynamiques complexes

![Formules Excel](/courses/antigravity_excel_l3.png)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

Pour que vos classeurs Excel restent interactifs et modifiables par les utilisateurs finaux, il est préférable d'y inscrire de **vraies formules Excel** (comme \`SUM\`, \`AVERAGE\` ou \`VLOOKUP\`) plutôt que de simplement calculer les valeurs statiques avec Python. 

## 1. La syntaxe des formules dans openpyxl

Avec \`openpyxl\`, écrire une formule est aussi simple que d'attribuer une chaîne de caractères commençant par \`=\` à la propriété \`value\` d'une cellule :

\`\`\`python
ws["D11"] = "=SUM(D2:D10)"
\`\`\`

> [!WARNING]
> Les noms des fonctions dans les formules Excel doivent impérativement être écrits **en anglais** (ex: \`AVERAGE\` au lieu de \`MOYENNE\`, \`IF\` au lieu de \`SI\`, \`VLOOKUP\` au lieu de \`RECHERCHEV\`) pour être correctement interprétés par le moteur de rendu d'Excel, quelle que soit la langue de votre logiciel.

## 2. Automatiser l'insertion de formules par ligne

Si vous avez un tableau dont le nombre de lignes varie, vous ne pouvez pas coder en dur \`ws["D11"]\`. Vous devez demander à Antigravity de générer des boucles dynamiques.

> *"Antigravity, écris un script qui parcourt toutes les lignes d'un tableau Excel existant. Pour chaque ligne, insère dans la colonne D la formule de multiplication de la colonne B (Quantité) et C (Prix Unitaire). À la fin du tableau, ajoute une ligne 'Total Général' et calcule la somme de la colonne D."*

### Le code généré par l'agent :

\`\`\`python
import openpyxl

wb = openpyxl.load_workbook("ventes_depart.xlsx")
ws = wb.active

# Déterminer la dernière ligne de données
max_row = ws.max_row

# 1. Ajouter les formules de calcul par produit (ligne par ligne)
# On commence à la ligne 2 car la ligne 1 contient les en-têtes
for row in range(2, max_row + 1):
    ws[f"D{row}"] = f"=B{row}*C{row}"

# 2. Ajouter la ligne du Total Général
total_row = max_row + 1
ws[f"A{total_row}"] = "Total Général"
ws[f"D{total_row}"] = f"=SUM(D2:D{max_row})"

wb.save("ventes_calculs.xlsx")
print("Formules dynamiques insérées !")
\`\`\`

Découvrez dans la partie suivante un script de génération de taxes et de synthèse automatique !`
                                },
                                {
                                    title: "Script d'injection de formules complexes",
                                    contentType: "text",
                                    order: 2,
                                    content: `# Script Détaillé : Calculs de TVA & Synthèse Automatique

Ce script montre comment injecter des calculs de TVA (taxe sur la valeur ajoutée à 19% en Algérie), des totaux TTC par ligne et des synthèses globales.

\`\`\`python
import openpyxl

def injecter_formules_commerciales(filename):
    """
    Charge un classeur Excel existant et y injecte dynamiquement
    les formules de taxe (TVA 19%) et de totaux de fin de table.
    """
    wb = openpyxl.load_workbook(filename)
    ws = wb.active
    
    # Déterminer la dernière ligne active de données
    max_row = ws.max_row
    
    # 1. Ajouter les en-têtes pour les nouveaux calculs
    # Colonne E: Taxe (19% de D), Colonne F: Total TTC (D + E)
    ws["E1"] = "TVA (19%)"
    ws["F1"] = "Total TTC"
    
    # 2. Insérer les formules ligne par ligne de manière dynamique
    # La formule s'écrira de manière relative pour chaque ligne (E2, E3, etc.)
    for row in range(2, max_row + 1):
        # TVA = Total HT (colonne D) * 0.19
        ws[f"E{row}"] = f"=D{row}*0.19"
        # TTC = Total HT (colonne D) + TVA (colonne E)
        ws[f"F{row}"] = f"=D{row}+E{row}"
        
    # 3. Ligne de synthèse de fin de tableau
    # On décale de deux lignes par rapport aux données pour aérer la mise en page
    summary_row = max_row + 2
    
    # Moyenne des prix
    ws[f"A{summary_row}"] = "Moyenne Prix"
    ws[f"C{summary_row}"] = f"=AVERAGE(C2:C{max_row})"
    
    # Somme cumulée du Chiffre d'Affaires HT
    ws[f"A{summary_row + 1}"] = "Total HT Général"
    ws[f"D{summary_row + 1}"] = f"=SUM(D2:D{max_row})"
    
    # Somme cumulée du Chiffre d'Affaires TTC
    ws[f"A{summary_row + 2}"] = "Total TTC Général"
    ws[f"F{summary_row + 2}"] = f"=SUM(F2:F{max_row})"
    
    # Sauvegarde du document complété
    wb.save(filename)
    print(f"Calculs de TVA et synthèses injectés avec succès dans : {filename}")

# Exemple d'appel
# injecter_formules_commerciales("ventes_calculs.xlsx")
\`\`\`

### Règle d'or de la manipulation dynamique :
- Utilisez toujours \`f-strings\` en Python pour formater dynamiquement la lettre de la colonne et l'index de ligne actuel (\`f"=D{row}*0.19"\`).
- Assurez-vous d'incrémenter le curseur de ligne (\`max_row + 1\`, etc.) pour éviter d'écraser des données.`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 4 =====
                    {
                        title: "4. Mise en forme premium et styles graphiques",
                        title_en: "4. Premium styling and graphic layouts",
                        title_ar: "4. التنسيقات المميزة والمخططات الرسومية",
                        duration: 90,
                        order: 4,
                        isFree: false,
                        content: "Stylisez vos feuilles de calcul Excel : polices, couleurs HSL, bordures et règles de mise en forme conditionnelle.",
                        contents: {
                            create: [
                                {
                                    title: "Styles et Mise en Forme Conditionnelle",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 4 : Mise en forme premium et styles graphiques

![Design Excel Premium](/courses/antigravity_excel_l4.png)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

Un tableau brut et non formaté est difficile à lire. Dans cette leçon, nous allons utiliser le module \`openpyxl.styles\` pour transformer vos feuilles de calcul en documents élégants, dotés d'une structure visuelle claire de type glassmorphism et de règles de mise en forme conditionnelle.

## 1. Les classes de style d'openpyxl
Pour modifier l'aspect visuel, openpyxl fournit plusieurs objets :
- \`Font\` : Gère le nom de la police, la taille, la couleur et le gras.
- \`PatternFill\` : Remplissage des cellules en couleur unie ou dégradée.
- \`Alignment\` : Centrage horizontal, vertical et retour à la ligne automatique.
- \`Border\` & \`Side\` : Configuration des bordures.

## 2. Création d'une charte graphique avec Antigravity

Vous pouvez demander à Antigravity d'appliquer un design moderne (ex: thème vert sombre ou bleu nuit) :

> *"Antigravity, écris un script Python pour styliser le tableau \`ventes_calculs.xlsx\`.
> 1. Applique une police 'Segoe UI' à tout le tableau.
> 2. Formate la ligne d'en-tête avec un fond vert sombre (Hex: #1E4620), du texte en blanc et gras.
> 3. Ajoute des bordures fines grises à toutes les cellules de données.
> 4. Ajuste automatiquement la largeur des colonnes par rapport à la taille de leur contenu."*

### Le code généré :

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.load_workbook("ventes_calculs.xlsx")
ws = wb.active

# Définition des styles
font_regular = Font(name="Segoe UI", size=10)
font_header = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
fill_header = PatternFill(start_color="1E4620", end_color="1E4620", fill_type="solid")
align_center = Alignment(horizontal="center", vertical="center")
thin_border = Border(
    left=Side(style="thin", color="D3D3D3"),
    right=Side(style="thin", color="D3D3D3"),
    top=Side(style="thin", color="D3D3D3"),
    bottom=Side(style="thin", color="D3D3D3")
)

# Appliquer le style aux en-têtes
for col in range(1, ws.max_column + 1):
    cell = ws.cell(row=1, column=col)
    cell.font = font_header
    cell.fill = fill_header
    cell.alignment = align_center

# Appliquer le style aux données
for row in range(2, ws.max_row + 1):
    for col in range(1, ws.max_column + 1):
        cell = ws.cell(row=row, column=col)
        cell.font = font_regular
        cell.border = thin_border

# Ajuster la largeur des colonnes
for col in ws.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = openpyxl.utils.get_column_letter(col[0].column)
    ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

wb.save("ventes_design_premium.xlsx")
print("Mise en forme terminée !")
\`\`\`

Découvrez dans la partie suivante comment appliquer du formatage conditionnel et styliser des tableaux entiers !`
                                },
                                {
                                    title: "Script complet de stylisation et mise en forme conditionnelle",
                                    contentType: "text",
                                    order: 2,
                                    content: `# Script Détaillé : Design de Tableau & Alertes Conditionnelles

Ce script montre l'utilisation d'openpyxl pour appliquer une mise en page d'entreprise professionnelle et des règles de coloration conditionnelle sur les cellules.

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule

def appliquer_design_premium(filename, sheet_name="Ventes"):
    """
    Stylise entièrement la feuille de calcul et applique
    des règles de mise en forme conditionnelle sur les ventes élevées.
    """
    wb = openpyxl.load_workbook(filename)
    ws = wb[sheet_name]
    
    # 1. Configuration des styles et polices
    font_header = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    font_data = Font(name="Segoe UI", size=10)
    font_summary = Font(name="Segoe UI", size=10, bold=True, color="1E4620")
    
    # Remplissage vert sapin pour les en-têtes
    fill_header = PatternFill(start_color="1E4620", end_color="1E4620", fill_type="solid")
    
    # Aligner le texte à gauche et les nombres à droite
    align_text = Alignment(horizontal="left", vertical="center")
    align_num = Alignment(horizontal="right", vertical="center")
    
    # Bordures fines grises pour délimiter les cellules
    border_side = Side(style="thin", color="E2E8F0")
    cell_border = Border(left=border_side, right=border_side, top=border_side, bottom=border_side)
    
    # 2. Stylisation de l'en-tête (ligne 1)
    for col in range(1, ws.max_column + 1):
        cell = ws.cell(row=1, column=col)
        cell.font = font_header
        cell.fill = fill_header
        cell.alignment = align_text
        
    # 3. Application des styles aux lignes de données
    for row in range(2, ws.max_row + 1):
        is_summary = ws.cell(row=row, column=1).value in ["Moyenne Prix", "Total HT Général", "Total TTC Général"]
        
        for col in range(1, ws.max_column + 1):
            cell = ws.cell(row=row, column=col)
            cell.border = cell_border
            
            # Formatage différent s'il s'agit des lignes de synthèse
            if is_summary:
                cell.font = font_summary
                cell.alignment = align_num if col > 1 else align_text
            else:
                cell.font = font_data
                # Si la valeur est numérique, aligner à droite et formater en DA (Dinar Algérien)
                if isinstance(cell.value, (int, float)) or (isinstance(cell.value, str) and cell.value.startswith('=')):
                    cell.alignment = align_num
                    if col in [3, 4, 5, 6]:  # Prix, Total, TVA, TTC
                        cell.number_format = '#,##0.00" DA"'
                else:
                    cell.alignment = align_text
                    
    # 4. Ajout de la règle de mise en forme conditionnelle
    # Si le Total TTC (Colonne F) est supérieur à 50 000 DA, colorer en vert pastel
    vert_pastel_fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
    vert_sombre_font = Font(color="006100", bold=True)
    
    rule = CellIsRule(operator='greaterThan', formula=['50000'], stopIfTrue=True, fill=vert_pastel_fill, font=vert_sombre_font)
    ws.conditional_formatting.add(f"F2:F{ws.max_row}", rule)
    
    # 5. Ajustement automatique des largeurs de colonnes
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 14)
        
    wb.save(filename)
    print(f"Stylisation premium et règles appliquées sur : {filename}")

# Exemple d'appel
# appliquer_design_premium("ventes_design_premium.xlsx")
\`\`\`

### Conseils pour un design de qualité :
- **Ne surchargez pas de couleurs** : Utilisez une seule couleur d'accentuation principale (ici le vert #1E4620) et des teintes très pastel pour la mise en forme conditionnelle.
- **Largeurs de colonnes** : Toujours inclure une marge de sécurité (\`max_len + 3\`) pour éviter l'affichage de l'erreur Excel \`###\` signifiant que la largeur est trop petite pour afficher le nombre.`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 5 =====
                    {
                        title: "5. Analyse de données et statistiques descriptives avec Pandas",
                        title_en: "5. Data analysis and descriptive statistics with Pandas",
                        title_ar: "5. تحليل البيانات والإحصاء الوصفي باستخدام Pandas",
                        duration: 90,
                        order: 5,
                        isFree: false,
                        content: "Orchestrez Antigravity pour réaliser des calculs de moyennes, médianes, percentiles et regrouper vos données.",
                        contents: {
                            create: [
                                {
                                    title: "Introduction à l'Analyse de Données",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 5 : Analyse de données et statistiques descriptives avec Pandas

![Analyse de Données](/courses/antigravity_excel_l5.png)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

Extraire du sens d'un tableau de données brutes est au cœur des besoins métiers. Grâce à **Pandas** piloté par **Antigravity**, vous pouvez réaliser des analyses statistiques descriptives complètes et des agrégations avancées en quelques secondes.

## 1. Résumé statistique instantané (\`describe\`)

Pandas fournit la méthode magique \`.describe()\` qui calcule instantanément pour toutes les colonnes numériques :
- Le nombre de valeurs (\`count\`).
- La moyenne (\`mean\`).
- L'écart-type (\`std\`), mesurant la dispersion.
- Les valeurs extrêmes (minimum et maximum).
- Les quartiles (25%, 50%/médiane, 75%).

\`\`\`python
import pandas as pd
df = pd.read_excel("ventes_propres.xlsx")
print(df.describe())
\`\`\`

## 2. Détecter et filtrer les valeurs aberrantes (Outliers)

Avant d'analyser vos données Excel, il est essentiel d'éliminer les lignes aberrantes. Par exemple, filtrer les commandes dont le montant dépasse 3 fois l'écart-type de la moyenne (règle des 3 sigmas) :

\`\`\`python
moyenne = df["Total"].mean()
ecart_type = df["Total"].std()
seuil_max = moyenne + 3 * ecart_type

# Filtrer les outliers
df_propres = df[df["Total"] <= seuil_max]
\`\`\`

Découvrez dans la partie suivante un script complet d'analyse de données descriptives que vous pouvez demander à Antigravity de coder et d'exécuter sur vos fichiers !`
                                },
                                {
                                    title: "Script complet de reporting et d'analyse statistique",
                                    contentType: "text",
                                    order: 2,
                                    content: `# Script Détaillé : Analyse Statistique & Tableaux Croisés

Ce script Python complet effectue des calculs de statistiques descriptives et crée un tableau de synthèse regroupé, prêt à être exporté ou envoyé à votre direction.

\`\`\`python
import pandas as pd

def generer_rapport_statistique(input_file, output_summary_file):
    """
    Lit un fichier de transactions et génère des statistiques descriptives
    ainsi qu'un tableau croisé synthétisé par produit et par région.
    """
    print(f"Ouverture du fichier : {input_file}")
    df = pd.read_excel(input_file)
    
    # 1. Obtenir les statistiques descriptives générales (sur les colonnes Quantité et Total)
    statistiques_generales = df[["Quantité", "Total"]].describe()
    print("\n--- STATISTIQUES DESCRIPTIVES GENERALES ---")
    print(statistiques_generales)
    
    # 2. Agrégation par Produit : Calculer le CA total et la quantité totale
    synthese_produit = df.groupby("Produit").agg(
        Ventes_Totales_DA=("Total", "sum"),
        Unites_Vendues=("Quantité", "sum"),
        Panier_Moyen_DA=("Total", "mean")
    ).reset_index()
    
    # Trier par ventes descendantes
    synthese_produit = synthese_produit.sort_values(by="Ventes_Totales_DA", ascending=False)
    
    # 3. Tableau croisé multidimensionnel (Pivot Table)
    # Calcule le chiffre d'affaires cumulé par Produit (lignes) et par Région (colonnes)
    tableau_croise = df.pivot_table(
        values="Total", 
        index="Produit", 
        columns="Région", 
        aggfunc="sum", 
        fill_value=0
    )
    
    # 4. Sauvegarde des rapports dans un unique classeur Excel avec plusieurs onglets
    with pd.ExcelWriter(output_summary_file) as writer:
        statistiques_generales.to_excel(writer, sheet_name="Stats_Generales")
        synthese_produit.to_excel(writer, sheet_name="Synthese_Produits", index=False)
        tableau_croise.to_excel(writer, sheet_name="Tableau_Croise_Regions")
        
    print(f"\nRapports d'analyse sauvegardés avec succès dans : {output_summary_file}")

# Appel du script d'analyse
# generer_rapport_statistique("ventes_ouest_premium.xlsx", "rapport_statistique_final.xlsx")
\`\`\`

Dans la leçon suivante, nous pousserons les Tableaux Croisés Dynamiques (Pivot Tables) encore plus loin avec des agrégations et métriques avancées !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 6 [NEW] =====
                    {
                        title: "6. Tableaux Croisés Dynamiques et Analyses Avancées",
                        title_en: "6. Pivot Tables and Advanced Data Analysis",
                        title_ar: "6. جداول محورية وتحليلات بيانات متقدمة",
                        duration: 85,
                        order: 6,
                        isFree: false,
                        content: "Maîtrisez la modélisation de données complexes avec pivot_table, les tris multicritères et les corrélations de variables.",
                        contents: {
                            create: [
                                {
                                    title: "Tableaux Croisés et Corrélations",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 6 : Tableaux Croisés Dynamiques et Analyses Avancées

![Tableaux Croisés Avancés](/courses/antigravity_excel_l6.png)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

Dans cette leçon, nous franchissons une étape supplémentaire dans l'analyse de données. Vous allez apprendre à piloter Antigravity pour réaliser des **analyses multidimensionnelles** similaires aux tableaux croisés dynamiques avancés d'Excel et à mesurer la corrélation entre les variables.

## 1. Tableaux Croisés Multi-Index (Lignes & Colonnes Multiples)

La méthode \`pivot_table\` de Pandas peut grouper les données sur plusieurs niveaux. Par exemple, pour structurer les ventes par **Région** et **Catégorie** en lignes, et par **Année** en colonnes :

\`\`\`python
tcd_avance = df.pivot_table(
    values="Total",
    index=["Région", "Catégorie"],
    columns="Mois",
    aggfunc=["sum", "count"],
    fill_value=0
)
\`\`\`

Cette commande calcule à la fois la somme totale et le nombre de transactions pour chaque croisement possible.

## 2. Analyse de corrélation statistique

Pour identifier si la météo, le jour de la semaine ou le prix unitaire influencent la quantité vendue, vous pouvez demander à Antigravity d'extraire la **matrice de corrélation de Pearson** de votre tableau Excel :

> *"Antigravity, écris un script qui calcule la corrélation linéaire entre les variables Prix, Quantité et Total. Enregistre la matrice résultante dans un onglet dédié 'Corrélations' du rapport Excel."*

Le code Pandas généré par l'agent est d'une grande simplicité :
\`\`\`python
correlation_matrix = df[["Prix", "Quantité", "Total"]].corr()
\`\`\`
Une corrélation proche de +1 indique un lien direct fort, proche de -1 un lien inverse, et proche de 0 aucune dépendance linéaire.

Découvrez dans la partie suivante le code complet pour automatiser ces calculs financiers et générer un rapport multiniveau élégant !`
                                },
                                {
                                    title: "Script complet d'analyse décisionnelle et pivot avancé",
                                    contentType: "text",
                                    order: 2,
                                    content: `# Script Détaillé : Pivot Avancé & Matrice de Corrélation

Ce script traite un fichier de ventes complexes, calcule des indicateurs clés multiniveaux, extrait les corrélations de performances et enregistre le tout de manière structurée.

\`\`\`python
import pandas as pd

def generer_analyse_decisionnelle(input_file, output_file):
    """
    Exécute un pipeline d'analyse de données :
    1. Pivot table avec doubles en-têtes de ligne.
    2. Calcul de la matrice de corrélation des métriques.
    3. Export multi-onglets structuré.
    """
    print(f"Chargement de {input_file} pour analyse décisionnelle...")
    df = pd.read_excel(input_file)
    
    # Correction automatique des formats de date si présents
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"])
        df["Mois"] = df["Date"].dt.strftime('%m - %B')
    else:
        df["Mois"] = "Non Spécifié"

    # 1. Pivot Table complexe (Région & Produit en lignes, Mois en colonnes)
    pivot_complex = df.pivot_table(
        values="Total",
        index=["Région", "Produit"],
        columns="Mois",
        aggfunc="sum",
        fill_value=0
    )
    
    # 2. Calcul des indicateurs de marge (si coût présent, sinon simulé)
    if "Coût" in df.columns:
        df["Marge"] = df["Total"] - (df["Quantité"] * df["Coût"])
    else:
        # Simulation d'un coût moyen à 65% du prix de vente
        df["Marge"] = df["Total"] * 0.35
        
    # 3. Matrice de corrélation
    matrice_corr = df[["Quantité", "Prix", "Total", "Marge"]].corr()
    print("\n--- MATRICE DE CORRELATION ---")
    print(matrice_corr)
    
    # 4. Top 5 des meilleurs clients (analyse de Pareto)
    top_clients = df.groupby("Client").agg(
        CA_Total=("Total", "sum"),
        Nombre_Commandes=("ID_Commande", "count")
    ).sort_values(by="CA_Total", ascending=False).head(5).reset_index()

    # 5. Écriture des onglets dans le fichier final
    with pd.ExcelWriter(output_file) as writer:
        pivot_complex.to_excel(writer, sheet_name="Tableau_Croise_Mois")
        top_clients.to_excel(writer, sheet_name="Top_5_Clients", index=False)
        matrice_corr.to_excel(writer, sheet_name="Matrice_Correlations")
        
    print(f"Analyse décisionnelle exportée avec succès dans : {output_file}")

# Exemple d'exécution
# generer_analyse_decisionnelle("ventes_ouest_premium.xlsx", "analyse_decisionnelle_finale.xlsx")
\`\`\`

### Synthèse des compétences de cette leçon :
- **Groupement multiniveau** : Permet de voir instantanément le sous-total par produit au sein de chaque région.
- **Pareto/Top Clients** : Indispensable pour cibler les actions marketing et identifier les comptes majeurs générant l'essentiel du chiffre d'affaires.`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 7 =====
                    {
                        title: "7. Projet final : Consolidation et graphiques automatiques",
                        title_en: "7. Final Project: Consolidation and charts",
                        title_ar: "7. المشروع النهائي: دمج البيانات والمخططات التلقائية",
                        duration: 105,
                        order: 7,
                        isFree: false,
                        content: "Projet complet : fusionnez plusieurs classeurs régionaux et ajoutez des graphiques de synthèse.",
                        contents: {
                            create: [
                                {
                                    title: "Projet de Synthèse Excel",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 7 : Projet final - Consolidation et graphiques automatiques

![Dashboard Excel Final](/courses/antigravity_excel_l6.png)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

Bienvenue dans le projet final de cette formation ! Nous allons réunir toutes les compétences acquises pour concevoir un pipeline d'automatisation complet. Vous allez orchestrer **Google Antigravity** pour lire 10 fichiers régionaux de ventes, fusionner leurs lignes et générer un rapport de synthèse incluant des statistiques clés et un graphique en barres.

## 1. Définition du besoin du projet

Vous disposez d'un dossier contenant plusieurs fichiers Excel nommés \`ventes_nord.xlsx\`, \`ventes_sud.xlsx\`, etc. Chaque fichier a la même structure.
Le but est de créer un script Python \`consolider_ventes.py\` qui :
1. Parcourt tous les fichiers Excel du dossier.
2. Filtre et rassemble toutes les lignes dans un seul tableau de synthèse.
3. Crée une feuille \`Rapport\` récapitulant les totaux régionaux.
4. Génère un **graphique en barres 3D** illustrant les performances de chaque région.

## 2. Formuler l'instruction finale à Antigravity

Voici le prompt à soumettre à l'agent :

> *"Antigravity, crée un script Python robuste pour consolider les ventes.
> 1. Crée un sous-dossier \`donnees_regionales\` et génère fictivement 3 fichiers de ventes régionales (Est, Ouest, Centre) contenant chacun 5 lignes de ventes.
> 2. Écris une fonction de fusion qui regroupe ces 3 fichiers dans un classeur final \`rapport_annuel.xlsx\`.
> 3. Ajoute une feuille 'Dashboard' de synthèse avec les totaux cumulés par région.
> 4. Utilise la classe \`BarChart\` d'openpyxl pour insérer un graphique en barres représentant ces ventes régionales directement dans la feuille Dashboard.
> 5. Applique le thème graphique vert sombre premium étudié dans la leçon précédente."*

### Le code de consolidation avec graphique :

\`\`\`python
import openpyxl
from openpyxl.chart import BarChart, Reference
from openpyxl.styles import Font, PatternFill

wb = openpyxl.Workbook()
ws_dash = wb.active
ws_dash.title = "Dashboard"

# 1. Écrire les totaux consolidés (simulés)
ws_dash.append(["Région", "Total Ventes"])
donnees_regionales = [
    ["Est", 450000],
    ["Ouest", 620000],
    ["Centre", 980000]
]

for row in donnees_regionales:
    ws_dash.append(row)

# 2. Créer le graphique
chart = BarChart()
chart.type = "col"
chart.style = 10
chart.title = "Ventes par Région"
chart.y_axis.title = "Chiffre d'Affaires (DA)"
chart.x_axis.title = "Régions"

# Définir les références de données et de catégories
data = Reference(ws_dash, min_col=2, min_row=1, max_row=4)
cats = Reference(ws_dash, min_col=1, min_row=2, max_row=4)

chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
chart.legend = None # Pas de légende nécessaire pour une seule série

# Positionner le graphique dans la feuille de calcul
ws_dash.add_chart(chart, "D2")

# Appliquer le design aux en-têtes
font_header = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
fill_header = PatternFill(start_color="1E4620", end_color="1E4620", fill_type="solid")

for col in range(1, 3):
    cell = ws_dash.cell(row=1, column=col)
    cell.font = font_header
    cell.fill = fill_header

wb.save("rapport_annuel.xlsx")
print("Rapport annuel avec dashboard et graphique créé !")
\`\`\`

## 3. Analyse et livraison du projet

Exécutez le script final généré par Antigravity. Ouvrez le classeur final \`rapport_annuel.xlsx\` dans Excel ou LibreOffice :
- Le graphique doit s'afficher à partir de la cellule D2.
- Les données de la feuille de calcul alimentent dynamiquement le graphique. Si vous modifiez manuellement le chiffre d'affaires du Centre, le graphique s'ajustera automatiquement dans Excel !

Félicitations, vous maîtrisez maintenant l'automatisation avancée d'Excel avec Google Antigravity !`
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log(`✅ Nouvelle formation Google Antigravity & Excel insérée en BDD (ID: ${course.id})`)
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
