require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Début du seed (avec illustrations) pour la formation Google Antigravity ...')

    const slug = 'google-antigravity-mastery'

    // Résultats d'apprentissage (Learning Outcomes)
    const learningOutcomes = [
        "Comprendre le fonctionnement d'un assistant agentique comme Google Antigravity",
        "Formuler des prompts efficaces pour le code et la manipulation de fichiers",
        "Créer des pages web complètes (HTML/CSS/JS) guidé par l'IA",
        "Concevoir des interfaces web interactives et responsives de qualité premium",
        "Automatiser la lecture, l'écriture et le formatage de fichiers Excel (.xlsx)",
        "Générer et modifier des rapports et des contrats Word (.docx) dynamiquement",
        "Créer, manipuler et extraire des données de fichiers PDF par programmation",
        "Gérer le cycle de développement complet avec planification, exécution et vérification"
    ]

    const learningOutcomes_en = [
        "Understand the mechanics of an agentic assistant like Google Antigravity",
        "Write effective prompts for code generation and file manipulation",
        "Create complete web pages (HTML/CSS/JS) guided by AI",
        "Design responsive and premium quality web interfaces",
        "Automate reading, writing, and formatting of Excel files (.xlsx)",
        "Generate and modify Word reports and contracts (.docx) dynamically",
        "Create, manipulate, and extract data from PDF files programmatically",
        "Manage the full development cycle with planning, execution, and verification"
    ]

    const learningOutcomes_ar = [
        "فهم آلية عمل المساعد البرمجي Google Antigravity",
        "صياغة مطالبات فعالة لإنشاء الأكواد البرمجية ومعالجة الملفات",
        "إنشاء صفحات ويب كاملة (HTML/CSS/JS) بتوجيه من الذكاء الاصطناعي",
        "تصميم واجهات ويب تفاعلية ومتجاوبة ذات جودة ممتازة",
        "أتمتة قراءة وكتابة وتنسيق ملفات إكسل (.xlsx)",
        "إنشاء وتعديل تقارير وعقود وورد (.docx) بشكل ديناميكي",
        "إنشاء ومعالجة واستخراج البيانات من ملفات PDF برمجياً",
        "إدارة دورة التطوير الكاملة من خلال التخطيط والتنفيذ والتحقق"
    ]

    // Prérequis (Requirements)
    const requirements = [
        "Compétences de base en informatique",
        "Notions élémentaires en logique de programmation",
        "Un éditeur de code ou accès à la plateforme e-learning El Sayf",
        "Une envie d'apprendre à collaborer avec des agents intelligents"
    ]

    const requirements_en = [
        "Basic computer skills",
        "Elementary notions of programming logic",
        "A code editor or access to the El Sayf e-learning platform",
        "A desire to learn how to collaborate with intelligent agents"
    ]

    const requirements_ar = [
        "مهارات الكمبيوتر الأساسية",
        "مفاهيم أولية في منطق البرمجة",
        "محرر أكواد أو الوصول إلى منصة El Sayf التعليمية",
        "الرغبة في تعلم كيفية التعاون مع الوكلاء الأذكياء"
    ]

    // Description complète en Markdown
    const fullDescription = `# Google Antigravity : Maîtrise de l'IA & du Code

## Apprenez à coder et automatiser avec l'assistant de codage nouvelle génération

Cette formation complète est conçue pour vous apprendre à collaborer avec **Google Antigravity**, un assistant de codage autonome puissant capable de manipuler votre espace de travail, de générer du code, de créer des visuels et d'automatiser vos flux de travail documentaires.

### 📥 Télécharger l'assistant Antigravity
Pour suivre cette formation pratique, vous devez installer l'assistant de bureau :
👉 **[Télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

### Pourquoi suivre cette formation ?

🚀 **Boostez votre productivité** : Multipliez par 10 votre vitesse de développement en déléguant les tâches répétitives à Antigravity.  
🎨 **Créez sans limites** : Concevez des pages web interactives de qualité professionnelle sans avoir besoin d'être un expert en CSS ou en JavaScript.  
📊 **Automatisez votre bureautique** : Libérez-vous des tâches administratives en apprenant à manipuler les fichiers Excel, Word et PDF par des scripts automatisés.  
🧠 **Adoptez la méthode de planification** : Découvrez le cycle de travail structuré (Recherche, Planification, Exécution, Vérification) utilisé par les ingénieurs pour obtenir des résultats fiables avec l'IA.

---

### Programme de la formation

**🎯 Module 1 : Fondations d'Antigravity & Prompt Engineering**
- Qu'est-ce qu'un agent autonome ?
- Techniques avancées de prompt et transmission de contexte.
- Gestion sécurisée des permissions et commandes système.

**💻 Module 2 : Développement Web Guidé par l'IA (HTML/CSS/JS)**
- Structurer des pages web modernes avec HTML5 sémantique.
- Design premium et responsive en CSS3 (Flexbox, Grid et animations).
- Rendre les pages dynamiques avec JavaScript moderne.
- Projet Pratique : Création d'un Dashboard d'analytics interactif.

**📄 Module 3 : Automatisation de Documents (Excel, Word, PDF)**
- Scripts de manipulation Excel avec Python (Lecture, écriture, formules et graphes).
- Génération de documents Word dynamiques à partir de templates.
- Lecture, fusion et génération de rapports PDF professionnels.
`

    const fullDescription_en = `# Google Antigravity: Code & AI Mastery

## Learn to code and automate with the next-generation coding assistant

### 📥 Download the Antigravity Assistant
To follow this hands-on course, you must install the desktop assistant:
👉 **[Download Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**

This comprehensive course is designed to teach you how to collaborate with **Google Antigravity**, a powerful autonomous coding assistant capable of manipulating your workspace, generating code, creating assets, and automating your document workflows.
`

    const fullDescription_ar = `# جوجل أنتيجرافيتي: إتقان البرمجة والذكاء الاصطناعي

## تعلم البرمجة والأتمتة باستخدام مساعد البرمجة من الجيل الجديد

### 📥 تحميل مساعد Antigravity
لمتابعة هذا التدريب العملي، يجب عليك تثبيت مساعد المكتب:
👉 **[تحميل Antigravity Desktop لنظام (Windows / macOS / Linux)](/telecharger)**
`

    // Supprimer le cours s'il existe déjà pour réinsérer proprement (évite les doublons complexes)
    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) {
        console.log('⚠️ Cours existant trouvé. Suppression pour ré-insertion propre...')
        await prisma.course.delete({ where: { slug } })
    }

    const course = await prisma.course.create({
        data: {
            title: "Google Antigravity : Maîtrise de l'IA & du Code",
            title_en: "Google Antigravity: Code & AI Mastery",
            title_ar: "جوجل أنتيجرافيتي: إتقان البرمجة والذكاء الاصطناعي",
            slug: slug,
            description: "Apprenez à utiliser l'assistant de codage Google Antigravity pour créer des pages web interactives (HTML, CSS, JS) et automatiser la manipulation de documents Excel, Word et PDF.",
            description_en: "Learn how to use the Google Antigravity coding assistant to create interactive web pages (HTML, JS) and automate document processing.",
            description_ar: "تعلم كيفية استخدام مساعد البرمجة Google Antigravity لإنشاء صفحات ويب تفاعلية وأتمتة معالجة المستندات.",
            price: 0,
            isFree: true,
            isPublished: true,
            isInviteOnly: false,
            level: "Tous niveaux",
            duration: "10h 00m",
            image: "/courses/antigravity_course_icon.png",
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
                        title: "1. Présentation de Google Antigravity et fonctionnement",
                        title_en: "1. Introduction to Google Antigravity and how it works",
                        title_ar: "1. مقدمة في Google Antigravity وطريقة عمله",
                        duration: 45,
                        order: 1,
                        isFree: true,
                        content: "Présentation générale de l'assistant de codage, de son fonctionnement et de ses capacités d'automatisation.",
                        contents: {
                            create: [
                                {
                                    title: "Présentation de Google Antigravity",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 1 : Présentation de Google Antigravity et fonctionnement

![Illustration de l'interface](/courses/antigravity_lesson1.png)

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

## 2. Qu'est-ce que Google Antigravity ?

Antigravity est un **agent de codage autonome** (Agentic AI) conçu par Google. Contrairement aux chatbots classiques qui se contentent de répondre à des questions par du texte, Antigravity a la capacité d'interagir directement avec votre ordinateur :
- 📁 **Lire et écrire** des fichiers sur votre disque dur.
- 💻 **Exécuter des commandes** dans votre terminal (npm, git, python, etc.).
- 🖼️ **Générer ou éditer des images** d'interface ou d'illustrations.
- 🧭 **Parcourir le Web** pour lire de la documentation à jour.

---

## 3. Premier contact avec Python : Hello Antigravity

Pour vérifier que tout fonctionne, créons notre tout premier script Python. Demandez à Antigravity de le générer pour vous :
> *"Antigravity, crée un script nommé \`hello.py\` qui affiche un message de bienvenue et donne des informations sur le système."*

### Le code Python généré :

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
\`\`\`

### Explication détaillée de chaque ligne de code :

* **\`import sys\`** : Cette ligne importe le module système de Python. Il fournit des variables et des fonctions qui interagissent directement avec l'interpréteur Python et le système hôte.
* **\`import os\`** : Cette ligne importe le module système d'exploitation de Python. Il permet d'effectuer des opérations liées au système de fichiers (créer des dossiers, lire des chemins, etc.).
* **\`message = "Bonjour et bienvenue sur Google Antigravity !"\`** : Nous déclarons une variable nommée \`message\` et nous lui affectons une chaîne de caractères (du texte) entre guillemets.
* **\`print(message)\`** : La fonction intégrée \`print()\` affiche la valeur contenue dans la variable \`message\` dans le terminal.
* **\`platforme = sys.platform\`** : Nous appelons la variable \`platform\` du module \`sys\` pour détecter le système d'exploitation (ex: \`win32\` pour Windows, \`darwin\` pour macOS) et nous stockons cette valeur dans la variable \`platforme\`.
* **\`dossier_actuel = os.getcwd()\`** : Nous appelons la fonction \`getcwd()\` (Get Current Working Directory) du module \`os\`. Elle renvoie le chemin absolu du dossier dans lequel le script s'exécute, que nous stockons dans \`dossier_actuel\`.
* **\`print("Système d'exploitation détecté : " + platforme)\`** : Nous concaténons (assemblons) le texte d'en-tête avec la variable \`platforme\` à l'aide de l'opérateur \`+\` pour afficher le résultat final.
* **\`print("Dossier de travail : " + dossier_actuel)\`** : De la même manière, nous affichons le dossier de travail courant.

---

## 4. Le cycle de développement agentique

Pour travailler efficacement avec Antigravity, vous devez comprendre son cycle de travail structuré :

1. **Recherche (Research)** : L'agent analyse les fichiers du projet, recherche des fonctions ou inspecte la base de données pour comprendre le contexte.
2. **Planification (Plan)** : L'agent crée un plan d'action détaillé dans le fichier \`implementation_plan.md\` et vous demande votre accord.
3. **Exécution (Execute)** : Une fois approuvé, il modifie les fichiers requis et liste ses tâches dans \`task.md\`.
4. **Vérification (Verify)** : Il s'assure que tout fonctionne (tests, builds) et rédige un rapport de fin dans \`walkthrough.md\`.

## 5. Collaboration Homme-Machine

Antigravity ne vous remplace pas, il travaille en **pair programming** avec vous. Vous gardez le contrôle total en :
- Définissant les objectifs.
- Validant ou modifiant ses plans d'implémentation.
- Autorisant ou refusant l'exécution des commandes sensibles sur votre système.

Dans la prochaine leçon, nous apprendrons à rédiger des prompts clairs pour guider au mieux l'agent dans ses tâches !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 2 =====
                    {
                        title: "2. Prompt Engineering & Transmission du contexte",
                        title_en: "2. Prompt Engineering & Context Management",
                        title_ar: "2. هندسة المطالبات وإدارة السياق",
                        duration: 60,
                        order: 2,
                        isFree: true,
                        content: "Apprenez à rédiger des instructions claires et à passer des références de fichiers pour guider l'agent.",
                        contents: {
                            create: [
                                {
                                    title: "Techniques de Prompt pour l'IA",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 2 : Prompt Engineering & Transmission du contexte

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration du Prompt Engineering](/courses/antigravity_lesson2.png)

Pour obtenir de bons résultats avec un assistant de codage autonome, la clarté et le contexte de vos instructions sont cruciaux. Cette leçon vous montre les meilleures techniques de prompt engineering.

## 1. La règle du contexte explicite

Les agents ont besoin de savoir précisément sur quels fichiers ils doivent intervenir. Pour cela, vous disposez d'un raccourci puissant dans l'interface de chat d'Antigravity : le symbole **@**.

En tapant \`@[chemin/vers/le/fichier]\`, vous indiquez directement à l'agent :
- Le code source à lire.
- La structure de la base de données.
- Les fichiers de configuration.

> [!TIP]
> **Exemple de prompt inefficace :**
> "Ajoute un champ d'abonnement à la page d'accueil"
> 
> **Exemple de prompt efficace :**
> "Ajoute un formulaire d'inscription newsletter dans la page @[src/app/page.js] en utilisant l'API définie dans @[src/app/api/newsletter/route.js]."

## 2. Définir des contraintes claires

Spécifiez toujours les technologies à utiliser et les normes de style à respecter :
- *"Génère cette page en HTML pur et CSS Vanilla."*
- *"Utilise Flexbox pour centrer le logo et assure-toi que la page est 100% responsive sur mobile."*

## 3. Le système de permissions

Lorsque Antigravity a besoin de réaliser une action importante (écrire un fichier sensible ou exécuter une commande de build), le système affiche une invite de confirmation.
- Lisez attentivement la commande avant de l'accepter.
- Vous pouvez ajuster les autorisations de lecture/écriture pour des dossiers précis si vous souhaitez lui donner plus d'autonomie.

Prêt à mettre cela en pratique ? Dans le prochain module, nous allons coder notre première page web !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 3 =====
                    {
                        title: "3. Création Web : Structure & Design Premium (HTML/CSS)",
                        title_en: "3. Web Development: Structure & Premium Design (HTML/CSS)",
                        title_ar: "3. تطوير الويب: الهيكل والتصميم المميز (HTML/CSS)",
                        duration: 75,
                        order: 3,
                        isFree: false,
                        content: "Concevoir une page web responsive moderne avec des codes couleurs HSL et du style glassmorphism.",
                        contents: {
                            create: [
                                {
                                    title: "Structure HTML & Styles CSS",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 3 : Création Web - Structure & Design Premium (HTML/CSS)

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration du Design Web](/courses/antigravity_lesson3.png)

Entrons dans le vif du sujet ! Nous allons concevoir une page web esthétique, moderne et responsive en collaborant avec Antigravity.

## Les bases d'une structure HTML5 propre

Demandez à Antigravity d'initier un fichier \`index.html\` structuré avec des balises sémantiques :
- \`<header>\` pour la navigation.
- \`<main>\` pour le contenu principal.
- \`<section>\` pour découper les différentes parties de la page.
- \`<footer>\` pour le bas de page.

## CSS Moderne : HSL, Gradients et Flexbox/Grid

Pour que votre design impressionne dès le premier regard, demandez à Antigravity d'intégrer :

1. **Une palette de couleurs HSL harmonieuse** : Évitez les couleurs primaires brutes. Utilisez des tons sombres élégants (ex: \`hsl(220, 15%, 8%)\`) contrastant avec des accents néons (cyan, violet).
2. **Des dégradés fluides (Gradients)** :
   \`\`\`css
   background: linear-gradient(135deg, hsl(260, 80%, 60%), hsl(180, 80%, 50%));
   \`\`\`
3. **Le glassmorphism** : Effet de verre poli très populaire sur les designs modernes.
   \`\`\`css
   background: rgba(255, 255, 255, 0.05);
   backdrop-filter: blur(10px);
   border: 1px solid rgba(255, 255, 255, 0.1);
   \`\`\`

## Intégration d'images générées par IA

Si vous avez besoin d'illustrations de qualité pour votre page, n'utilisez pas de placeholders génériques ! Demandez à Antigravity de générer un asset unique :
> "Génère-moi une image futuriste représentant un espace de travail de développeur avec des touches de néon bleu et violet. Enregistre-la dans le dossier public sous le nom hero_image.png."

Dans la leçon suivante, nous allons animer notre page et y intégrer de la logique interactive en JavaScript !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 4 =====
                    {
                        title: "4. Rendre la page interactive avec JavaScript",
                        title_en: "4. Making pages interactive with JavaScript",
                        title_ar: "4. جعل الصفحات تفاعلية باستخدام JavaScript",
                        duration: 90,
                        order: 4,
                        isFree: false,
                        content: "Ajouter de la logique en JavaScript pur, écouter les événements et manipuler dynamiquement le DOM.",
                        contents: {
                            create: [
                                {
                                    title: "Logique Interactive JS",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 4 : Rendre la page interactive avec JavaScript

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration JavaScript](/courses/antigravity_lesson4.png)

Une belle page statique est un bon début, mais c'est le JavaScript qui lui insuffle la vie. Voyons comment ajouter des fonctionnalités dynamiques avec Antigravity.

## Manipulation du DOM & Événements

Le DOM (Document Object Model) représente la structure de votre page. En JavaScript, vous pouvez interagir avec pour modifier le texte, les styles, ou la structure à la volée.

Demandez à Antigravity de concevoir des scripts pour gérer :
- Le clic sur un bouton (ouvrir un menu mobile, valider un formulaire).
- La soumission de formulaires en bloquant le rechargement par défaut (\`event.preventDefault()\`).
- Le basculement entre mode clair et mode sombre (dark mode).

## Appels API avec Fetch API

Pour afficher des données dynamiques (météo, cours de bourse, articles de blog), vous devez interroger des serveurs distants.

Voici un exemple de code JavaScript que vous pouvez demander à Antigravity d'écrire pour vous :

\`\`\`javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error("Impossible de charger les données:", error);
    }
}
\`\`\`

## Débogage intelligent avec l'assistant

Si votre script ne fonctionne pas ou génère des erreurs dans la console du navigateur :
1. Copiez le message d'erreur.
2. Demandez à Antigravity : *"Mon script JS renvoie l'erreur suivante dans la console : [ERREUR]. Voici mon code : @[script.js]. Peux-tu m'expliquer d'où vient le problème et le corriger ?"*`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 5 =====
                    {
                        title: "5. TP : Création d'un Dashboard interactif complet",
                        title_en: "5. Practical Work: Building a complete interactive Dashboard",
                        title_ar: "5. تطبيق عملي: إنشاء لوحة معلومات تفاعلية كاملة",
                        duration: 120,
                        order: 5,
                        isFree: false,
                        content: "TP guidé pas-à-pas pour assembler une interface de tableau de bord moderne avec des graphiques animés (Chart.js).",
                        contents: {
                            create: [
                                {
                                    title: "TP Pratique - Dashboard",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 5 : TP - Création d'un Dashboard interactif complet

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration du Dashboard](/courses/antigravity_lesson5.png)

Mettez en pratique tout ce que vous avez appris ! Dans ce TP guidé par Antigravity, nous allons concevoir un **Dashboard d'Analytics** avec des graphiques animés, des statistiques clés et un design sombre premium.

## Objectifs du TP

1. Créer une structure HTML5 sémantique (\`dashboard.html\`).
2. Développer un style CSS moderne de type glassmorphism avec une grille responsive (\`styles.css\`).
3. Écrire le script JavaScript pour calculer les KPIs et alimenter des graphiques (\`app.js\`).

## Instructions à donner à Antigravity

Pour démarrer le projet, ouvrez une discussion et formulez une instruction détaillée :

> "Antigravity, aide-moi à concevoir un dashboard d'analyse financière moderne. 
> 1. Crée un fichier \`dashboard.html\` avec une grille CSS comprenant : une barre latérale de navigation, une vue principale avec 3 cartes de statistiques (Revenu, Ventes, Nouveaux Clients), et une zone pour un graphique.
> 2. Utilise un thème sombre premium avec des dégradés violets et bleus en CSS. Ajoute des effets de transition fluides au survol des cartes.
> 3. Ajoute la bibliothèque Chart.js via CDN dans le HTML.
> 4. Écris un fichier \`app.js\` qui génère un graphique en courbes dynamique et met à jour les chiffres des cartes de statistiques de manière aléatoire toutes les 5 secondes pour simuler du temps réel."

## Analyse du résultat

Une fois qu'Antigravity a généré les fichiers :
- Ouvrez le fichier HTML dans votre navigateur pour tester le rendu.
- Observez les transitions CSS et la réactivité du graphique.
- N'hésitez pas à lui demander des ajustements sur l'alignement ou les couleurs si nécessaire !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 6 =====
                    {
                        title: "6. Automatiser Excel avec Python & Antigravity",
                        title_en: "6. Automating Excel with Python & Antigravity",
                        title_ar: "6. أتمتة ملفات إكسل باستخدام Python و Antigravity",
                        duration: 80,
                        order: 6,
                        isFree: false,
                        content: "Utilisation des bibliothèques pandas et openpyxl pour manipuler et mettre en forme des feuilles Excel par programmation.",
                        contents: {
                            create: [
                                {
                                    title: "Automatisation Excel (Python)",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 6 : Automatiser Excel avec Python & Antigravity

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration Excel Automation](/courses/antigravity_lesson6.png)

La manipulation de feuilles de calcul Excel est l'un des besoins les plus fréquents en entreprise. Grâce à Python et aux librairies comme \`openpyxl\`, vous pouvez automatiser toutes ces tâches rébarbatives.

## Pourquoi utiliser Python plutôt que VBA ?
- **Performance** : Python traite les grands volumes de données beaucoup plus vite.
- **Écosystème** : Connexion facile à des bases de données SQL, des APIs ou des modèles de Machine Learning.
- **Simplicité** : Le code est plus lisible et plus facile à maintenir.

## Les librairies indispensables
1. **pandas** : Pour analyser et transformer les tableaux de données.
2. **openpyxl** : Pour créer, modifier des fichiers Excel (.xlsx) et gérer la mise en forme (couleurs, polices, bordures).

## Écrire un script Excel avec Antigravity

Pour créer un rapport Excel stylisé, demandez à Antigravity d'écrire un script de ce type :

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment

# Créer un classeur
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Rapport Ventes"

# Ajouter des données
ws['A1'] = "Produit"
ws['B1'] = "Quantité"
ws['C1'] = "Prix Unitaire"
ws['D1'] = "Total"

donnees = [
    ("Laptop", 5, 1200),
    ("Souris", 25, 25),
    ("Clavier", 10, 80)
]

for ligne in donnees:
    total = ligne[1] * ligne[2]
    ws.append([ligne[0], ligne[1], ligne[2], total])

# Appliquer un style aux en-têtes
header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
header_fill = PatternFill(start_color="4F81BD", end_color="4F81BD", fill_type="solid")

for col in range(1, 5):
    cell = ws.cell(row=1, column=col)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = Alignment(horizontal="center")

wb.save("Rapport_Ventes.xlsx")
\`\`\`

## Exercice d'automatisation
Demandez à l'assistant d'écrire un script qui parcourt un dossier contenant 10 fichiers Excel de ventes régionales, extrait le total de chaque fichier, et compile le tout dans un unique graphique récapitulatif !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 7 =====
                    {
                        title: "7. Générer et éditer des documents Word (DOCX) automatiquement",
                        title_en: "7. Generating and editing Word documents (DOCX) automatically",
                        title_ar: "7. إنشاء وتعديل مستندات وورد (DOCX) تلقائياً",
                        duration: 80,
                        order: 7,
                        isFree: false,
                        content: "Utiliser python-docx pour créer des contrats personnalisés à partir de documents templates.",
                        contents: {
                            create: [
                                {
                                    title: "Automatisation Word (Python)",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 7 : Générer et éditer des documents Word (DOCX) automatiquement

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration Word Automation](/courses/antigravity_lesson7.png)

La rédaction de rapports, de devis ou de contrats types prend du temps. Apprenez à générer ces documents automatiquement sous forme de fichiers Word \`.docx\` à partir de vos scripts en Python.

## Utilisation de la librairie python-docx

La librairie Python \`python-docx\` permet de manipuler facilement des documents Word.

Voici les opérations fondamentales que vous pouvez demander à Antigravity d'automatiser :
- Ajouter des titres de différents niveaux (\`add_heading\`).
- Insérer des paragraphes (\`add_paragraph\`) et y formater le texte en gras ou italique.
- Ajouter des images (\`add_picture\`).
- Créer des tableaux structurés avec des styles de cellule.

## Exemple : Remplacement de variables dans un contrat (Mail Merge)

Une méthode classique consiste à créer un document modèle (.docx) contenant des variables comme \`{{NomClient}}\` ou \`{{Montant}}\`, puis de demander à un script Python de les remplacer par les vraies valeurs.

Demandez à Antigravity de générer un script pour réaliser cette tâche :

\`\`\`python
from docx import Document

def generer_contrat(template_path, output_path, donnees_client):
    doc = Document(template_path)
    
    # Parcourir les paragraphes du document
    for paragraphe in doc.paragraphs:
        for variable, valeur in donnees_client.items():
            placeholder = f"{{{{{variable}}}}}"
            if placeholder in paragraphe.text:
                paragraphe.text = paragraphe.text.replace(placeholder, valeur)
                
    doc.save(output_path)

# Exemple d'appel
donnees = {
    "NomClient": "Société StatLabo",
    "Montant": "15,000 DA",
    "Date": "30 Mai 2026"
}
generer_contrat("template_contrat.docx", "Contrat_Final.docx", donnees)
\`\`\`

Grâce à cette approche, vous pouvez générer des centaines de documents personnalisés en quelques secondes depuis un simple fichier de données Excel !`
                                }
                            ]
                        }
                    },
                    // ===== LESSON 8 =====
                    {
                        title: "8. Création et manipulation avancée de fichiers PDF",
                        title_en: "8. Creation and advanced manipulation of PDF files",
                        title_ar: "8. إنشاء ومعالجة ملفات PDF بشكل متقدم",
                        duration: 90,
                        order: 8,
                        isFree: false,
                        content: "Génération de PDF côté client (jsPDF) et manipulation côté serveur (ReportLab et PyPDF).",
                        contents: {
                            create: [
                                {
                                    title: "Génération PDF (Python & JS)",
                                    contentType: "text",
                                    order: 1,
                                    content: `# Leçon 8 : Création et manipulation avancée de fichiers PDF

> [!IMPORTANT]
> **Télécharger l'assistant Google Antigravity Desktop** :
> Pour exécuter localement les scripts de cette formation et bénéficier de l'intégration complète avec votre système de fichiers, téléchargez notre application de bureau native :
> 👉 **[Cliquez ici pour télécharger Antigravity Desktop (Windows / macOS / Linux)](/telecharger)**


![Illustration PDF Automation](/courses/antigravity_lesson8.png)

Le format PDF est la référence pour partager des documents figés et non modifiables (factures, reçus de paiement, certificats). Dans cette leçon, nous allons voir comment générer et traiter ces fichiers.

## 1. Génération de PDF avec ReportLab (Python)

\`ReportLab\` est la bibliothèque Python de référence pour dessiner des PDF complexes de manière programmatique. Elle permet d'ajouter des logos, de dessiner des formes géométriques précises et de positionner le texte au millimètre près.

*Demandez à Antigravity :*
> "Écris un script Python en utilisant la bibliothèque ReportLab pour générer une facture PDF stylisée. Elle doit comprendre un en-tête avec les détails de l'entreprise, un tableau contenant les articles facturés et le total, et un pied de page avec les mentions légales."

## 2. Manipulation de PDF existants avec PyPDF (Python)

Si vous devez travailler avec des PDF existants (les fusionner, extraire des pages ou pivoter des documents), utilisez la bibliothèque \`pypdf\`.

Voici les tâches automatisables courantes :
- **Fusionner** plusieurs fichiers PDF en un seul (par exemple regrouper toutes les factures du mois).
- **Découper** un document volumineux pour en extraire des pages clés.
- **Protéger** un PDF par mot de passe.

## 3. Génération de PDF côté client (JavaScript)

Dans les applications web, il est parfois nécessaire de télécharger un reçu directement depuis le navigateur. On utilise alors des bibliothèques JavaScript comme \`jsPDF\` ou \`pdf-lib\`.

*Exemple de code que vous pouvez demander à Antigravity d'intégrer dans votre site :*

\`\`\`javascript
import { jsPDF } from "jspdf";

function imprimerFacture(nomClient, total) {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.text("FACTURE ESAYF E-LEARNING", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.text(\`Client : \${nomClient}\`, 20, 40);
    doc.text(\`Montant Total : \${total} DA\`, 20, 50);
    
    doc.save("facture.pdf");
}
\`\`\`

Félicitations ! Vous avez terminé toutes les leçons de ce module et maîtrisez désormais les bases d'Antigravity ainsi que l'automatisation web et documentaire.`
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log(`✅ Formation Google Antigravity insérée avec succès en BDD (ID: ${course.id})`)
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
