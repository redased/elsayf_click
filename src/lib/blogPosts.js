export const BLOG_CATEGORIES = [
  { id: 'all', label: 'Tous les articles' },
  { id: 'data', label: 'Data & BI' },
  { id: 'cyber', label: 'Cybersécurité' },
  { id: 'automation', label: 'Automatisation' },
  { id: 'career', label: 'Carrière & CV' },
];

export const BLOG_POSTS = [
  {
    slug: 'automatiser-excel-python-2026',
    title: 'Comment Automatiser ses Tableaux Excel avec Python en 2026 : Le Guide Complet',
    metaTitle: 'Automatiser Excel avec Python en 2026 : Tutoriel Pandas & OpenPyXL | Elsayf',
    metaDesc: 'Découvrez comment automatiser vos tâches répétitives sur Excel avec Python. Traitement de données, génération de rapports et conciliation comptable en quelques lignes de code.',
    date: '18 Septembre 2026',
    readTime: '8 min de lecture',
    category: 'Automatisation',
    author: 'Équipe Pédagogique Elsayf',
    summary: 'Marre de copier-coller des données entre plusieurs fichiers Excel chaque semaine ? Apprenez comment les bibliothèques Pandas et OpenPyXL permettent de traiter des milliers de lignes en quelques secondes.',
    excerpt: 'Marre de copier-coller des données entre plusieurs fichiers Excel chaque semaine ? Apprenez comment les bibliothèques Pandas et OpenPyXL permettent de traiter des milliers de lignes en quelques secondes.',
    tags: ['Python', 'Excel', 'Automatisation', 'Pandas', 'OpenPyXL'],
    relatedCourse: {
      title: 'Automatisation Excel & Comptabilité Détaillée',
      slug: 'automatisation-excel-comptabilite-detaillee',
      desc: 'Maîtrisez Python, openpyxl et Pandas pour transformer vos classeurs administratifs et comptables en pipelines 100% automatisés.'
    },
    content: `
## Pourquoi lier Python à Excel en 2026 ?

Excel est l'outil universel des entreprises, des cabinets comptables et des directions financières. Cependant, dès que le volume de données augmente ou que les opérations de rapprochement deviennent hebdomadaires, les manipulations manuelles créent des erreurs chronophages.

C'est ici que **Python** intervient : non pas pour remplacer Excel, mais pour en devenir le **moteur turbo**.

---

### Les Deux Outils Clés de l'Écosystème Python-Excel

1. **Pandas** : La bibliothèque reine pour manipuler des tableaux de données, filtrer, fusionner (équivalent des RECHERCHEV et JOINTURES) et agréger des millions de lignes sans aucun ralentissement.
2. **OpenPyXL** : Idéal pour conserver la mise en forme de vos classeurs, insérer des formules Excel natives et créer des styles visuels professionnels.

---

### Exemple Concret : Rapprochement de 10 Fichiers de Ventes en 5 Lignes de Code

Imaginez que vous receviez un fichier de vente par jour ou par agence commerciale. Plutôt que de les ouvrir un par un :

\`\`\`python
import glob
import pandas as pd

# 1. Récupération de tous les fichiers Excel du dossier
fichiers = glob.glob("ventes_*.xlsx")

# 2. Concaténation instantanée
df_total = pd.concat([pd.read_excel(f) for f in fichiers], ignore_index=True)

# 3. Filtrage des ventes payées et export
df_paye = df_total[df_total["Statut"] == "Validé"]
df_paye.to_excel("Synthese_Ventes_Consolidee.xlsx", index=False)
print("✅ Traitement terminé avec succès !")
\`\`\`

En exécutant ce script, plusieurs heures de manipulation manuelle sont réduites à **moins de 2 secondes d'exécution**.

---

### Vers des Compétences Rémunératrices

Les professionnels (comptables, contrôleurs de gestion, ingénieurs) qui maîtrisent ce couplage Python-Excel constatent des gains de productivité immédiats et se distinguent nettement sur le marché de l'emploi.

Sur **Elsayf**, nous avons conçu la formation complète *"Automatisation Excel & Comptabilité Détaillée avec Python & IA"* pour vous guider pas à pas sans prérequis technique lourd.
    `
  },
  {
    slug: 'questions-entretien-dax-power-bi',
    title: 'Les 10 Questions DAX Incontournables en Entretien Power BI & Data Analyst',
    metaTitle: 'Top 10 Questions DAX en Entretien d\'Embauche Power BI | Elsayf',
    metaDesc: 'Préparez votre entretien de Data Analyst avec les questions techniques Power BI les plus fréquentes : CALCULATE, FILTER, ALL, Contexte de filtre et Time Intelligence.',
    date: '15 Septembre 2026',
    readTime: '10 min de lecture',
    category: 'Data & BI',
    author: 'Consultant BI Senior',
    summary: 'CALCULATE vs FILTER ? Contexte de ligne vs Contexte de filtre ? Découvrez les réponses exactes et les pièges à éviter pour impressionner les recruteurs en entretien technique.',
    excerpt: 'CALCULATE vs FILTER ? Contexte de ligne vs Contexte de filtre ? Découvrez les réponses exactes et les pièges à éviter pour impressionner les recruteurs en entretien technique.',
    tags: ['Power BI', 'DAX', 'Data Analyst', 'Entretien Technique', 'Business Intelligence'],
    relatedCourse: {
      title: 'Power BI & Business Intelligence (DAX & Dashboards)',
      slug: 'power-bi-business-intelligence-data-analytics',
      desc: 'Maîtrisez Power BI Desktop, Power Query ETL, les calculs avancés DAX et concevez des dashboards interactifs professionnels.'
    },
    content: `
## Le DAX : Le Vrai Test de Niveau en Recrutement BI

Tout le monde peut créer un graphique à barres sur Power BI en glissant-déposant des colonnes. En revanche, la capacité à écrire des formules **DAX (Data Analysis Expressions)** optimisées distingue un profil débutant d'un véritable **Data Analyst Senior**.

Voici les questions les plus fréquemment posées par les recruteurs et responsables techniques.

---

### Question 1 : Quelle est la différence entre CALCULATE et FILTER ?

* **CALCULATE** est la fonction la plus puissante de DAX. Elle permet d'évaluer une mesure en **modifiant le contexte de filtre existant**.
* **FILTER** est une fonction itératrice de table. Elle scanne une table ligne par ligne et ne doit être utilisée dans CALCULATE que lorsqu'on a besoin d'un filtre dynamique complexe, pour éviter de dégrader les performances du modèle.

---

### Question 2 : Colonne Calculée vs Mesure DAX : Quand utiliser quoi ?

* **Colonne Calculée** : Calculée lors du chargement des données, stockée en mémoire vive (RAM) dans le modèle tabulaire. Elle consomme des ressources de stockage.
* **Mesure DAX** : Calculée **à la volée** uniquement lorsque l'utilisateur interagit avec un visuel. C'est la bonne pratique pour 95% des agrégations (Sommes, Moyennes, Ratios, Évolutions).

---

### Question 3 : Qu'est-ce que le Contexte de Filtre ?

Le contexte de filtre correspond à l'ensemble des conditions de filtrage actives qui s'appliquent à un visuel à un moment donné : filtres de page, segments (slicers), filtres appliqués par clic croisé sur d'autres visuels, et filtres internes définis via \`CALCULATE\`.

---

### Comment s'entraîner ?

Pour consolider vos compétences et réaliser des projets décisionnels concrets à présenter en entretien, découvrez notre formation certifiante *"Power BI & Business Intelligence : Data Analytics, DAX & Dashboards Interactifs"*.
    `
  },
  {
    slug: 'debuter-cybersecurite-pentest-algerie',
    title: 'Comment Débuter en Cybersécurité et Ethical Hacking sans Expérience Préalable',
    metaTitle: 'Guide Débutant Cybersécurité & Pentest en 2026 | Académie Elsayf',
    metaDesc: 'Comprendre la cybersécurité défensive (SOC) et offensive (Pentest). Les étapes pour débuter, les certifications clés et les débouchés en Algérie et à l\'international.',
    date: '10 Septembre 2026',
    readTime: '7 min de lecture',
    category: 'Cybersécurité',
    author: 'Expert Sécurité des Systèmes',
    summary: 'La cybersécurité n\'est pas réservée aux génies du cinéma. Avec les bonnes méthodes (réseaux, Linux, OWASP Top 10), tout passionné peut construire un profil recherché par les banques et entreprises.',
    excerpt: 'La cybersécurité n\'est pas réservée aux génies du cinéma. Avec les bonnes méthodes (réseaux, Linux, OWASP Top 10), tout passionné peut construire un profil recherché par les banques et entreprises.',
    tags: ['Cybersécurité', 'Pentest', 'SOC', 'Ethical Hacking', 'OWASP'],
    relatedCourse: {
      title: 'Ethical Hacking & Sécurité Web (Pentest)',
      slug: 'ethical-hacking-securite-web-pentest',
      desc: 'Apprenez à auditer et sécuriser des applications web face aux failles de l\'OWASP Top 10 dans un cadre légal et éthique.'
    },
    content: `
## La Cybersécurité : Un Marché en Pénurie Aiguë de Talents

En 2026, la digitalisation accélérée des banques, des plateformes e-commerce et des services gouvernementaux crée une demande sans précédent d'analystes sécurité et de testeurs d'intrusion (pentesters).

Pourtant, beaucoup de débutants se sentent perdus face à la masse d'informations disponibles sur internet.

---

### 1. Défense (Blue Team) ou Attaque (Red Team) ?

* **La Sécurité Défensive (SOC)** : Vous surveillez les réseaux, analysez les journaux (logs) avec un SIEM, détectez les comportements anormaux et configurez les défenses pour stopper les attaques. C'est souvent la voie d'entrée la plus accessible pour un premier emploi.
* **La Sécurité Offensive (Pentest)** : Vous jouez le rôle d'un attaquant éthique mandaté par l'entreprise pour identifier les failles avant les cybercriminels (vulnérabilités web, mots de passe faibles, erreurs de configuration).

---

### 2. Le Socle Fondamental pour Réussir

Pour progresser sereinement, concentrez-vous sur 3 piliers :
1. **Les Réseaux & Protocoles** : Comprendre le modèle TCP/IP, DNS, HTTP/HTTPS et les mécanismes de sessions.
2. **Le Top 10 OWASP** : Connaître par cœur les 10 failles les plus destructrices sur le web (SQL Injections, Cross-Site Scripting, Défaillances de contrôle d'accès).
3. **La Pratique sur Environnements Légaux** : Ne tentez jamais d'attaquer des cibles réelles sans mandat écrit. Utilisez des laboratoires contrôlés et des machines virtuelles.

Sur **Elsayf**, nous proposons deux formations progressives complémentaires : le cours *Defensive Security & SOC* suivi du cours *Ethical Hacking & Sécurité Web*.
    `
  },
  {
    slug: 'cv-compatible-ats-normes-recruteurs',
    title: 'Rédiger un CV Compatible ATS : 7 Règles d\'Or pour Décrocher des Entretiens',
    metaTitle: 'CV Compatible ATS en 2026 : Règles d\'Or & Export PDF A4 | MyCV.click',
    metaDesc: 'Comment faire passer votre CV à travers les filtres des logiciels de recrutement ATS. Typographie, mots-clés, rubriques et export vectoriel sans filigrane.',
    date: '05 Septembre 2026',
    readTime: '6 min de lecture',
    category: 'Carrière & CV',
    author: 'Consultante en Recrutement RH',
    summary: 'Saviez-vous que plus de 75% des CVs sont rejetés par des robots avant même d\'être lus par un être humain ? Découvrez comment structurer votre CV pour franchir le filtre ATS.',
    excerpt: 'Saviez-vous que plus de 75% des CVs sont rejetés par des robots avant même d\'être lus par un être humain ? Découvrez comment structurer votre CV pour franchir le filtre ATS.',
    tags: ['CV ATS', 'Recrutement', 'Emploi', 'MyCV', 'Entretien'],
    relatedCourse: {
      title: 'Google Antigravity : Maîtrise IA & Code',
      slug: 'google-antigravity-mastery',
      desc: 'Développez des compétences de pointe en ingénierie de prompt et programmation assistée pour maximiser votre impact professionnel.'
    },
    content: `
## Qu'est-ce qu'un ATS (Applicant Tracking System) ?

Les grandes entreprises et cabinets de recrutement reçoivent des centaines de candidatures pour chaque offre. Pour trier ce flux, ils utilisent des logiciels de parsing automatique appelés **ATS** (comme Taleo, Workday, Greenhouse ou Recruitee).

Ces logiciels scannent le document texte de votre CV, en extraient les rubriques et recherchent la correspondance exacte avec les mots-clés de l'offre d'emploi.

---

### Les 7 Règles d'Or pour Réussir le Filtrage ATS :

1. **Format A4 Vectoriel Propre** : Évitez les formats d'image (PNG, JPG) illisibles pour les robots. Préférez un PDF A4 textuel net généré par un outil dédié comme **MyCV.click**.
2. **Titres de Rubriques Clairs** : Utilisez des intitulés standards (*"Expériences professionnelles"*, *"Formations"*, *"Compétences"*). Bannissez les titres originaux mais confus pour un parser.
3. **Mots-Clés Ciblés** : Reprenez les termes exacts de l'offre visée (ex : *Power BI*, *Python Pandas*, *Audit OWASP*).
4. **Dates Structurées** : Précisez l'année ou le mois/année (ex : *2024 - 2026*) pour que l'algorithme calcule correctement votre expérience cumulée.
5. **Résultats Chiffrés** : Ne vous contentez pas de lister des tâches. Donnez des métriques mesurables (*"Automatisation du reporting financier, gain de 6h par semaine"*).
6. **Pas de Tableaux Graphiques Complexes Imbriqués** : Les logiciels ATS ont du mal à lire le texte enfermé dans des tableaux imbriqués sur plusieurs colonnes non ordonnées.
7. **Pas de Filigrane Bloquant** : Assurez-vous que votre PDF est 100% libre et net.

---

### Créez votre CV Conforme en 5 Minutes

Le studio **MyCV.click** (propulsé par Elsayf) applique nativement ces 7 règles d'or sur tous ses designs. Vous pouvez créer votre profil gratuitement et exporter votre PDF vectoriel haute fidélité immédiatement.
    `
  }
];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}
