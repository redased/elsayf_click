const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const lessonData = {
    "Introduction à Python": {
        image: "/images/course-python/lesson1.png",
        intro: "Bienvenue dans l'univers de Python ! Ce langage, créé par Guido van Rossum en 1991, est devenu le pilier de l'IA, de la Data Science et de l'automatisation. Sa philosophie ? 'La lisibilité compte'.",
        extra: `
### Pourquoi Python ?
1. **Syntaxe Intuitive** : Proche de l'anglais, idéale pour les débutants.
2. **Écosystème Géant** : Des bibliothèques pour tout (Web, Science, IA).
3. **Productivité** : Écrivez moins de code pour faire plus de choses.

![Concept Introduction]($IMAGE_PLACEHOLDER$)

> [!TIP]
> **Conseil d'expert** : Ne cherchez pas à tout apprendre d'un coup. Python est une boîte à outils immense ; apprenez à choisir l'outil dont vous avez besoin pour votre projet actuel.
`
    },
    "Variables et Types de Données": {
        image: "/images/course-python/lesson2.png",
        intro: "Les variables sont les briques fondamentales de tout programme. Imaginez-les comme des conteneurs étiquetés stockant des informations précieuses.",
        extra: `
### Les Types Essentiels
*   **Integers (int)** : Nombres entiers (ex: 42).
*   **Floats (float)** : Nombres à virgule (ex: 3.14).
*   **Strings (str)** : Chaînes de caractères (ex: "Hello").
*   **Booleans (bool)** : Vrai ou Faux.

![Variables Concept]($IMAGE_PLACEHOLDER$)

> [!NOTE]
> En Python, le typage est dynamique. Vous n'avez pas besoin de déclarer le type d'une variable avant de l'utiliser !
`
    },
    "Structures de Contrôle": {
        image: "/images/course-python/lesson3.png",
        intro: "Un programme sans conditions est comme une ligne droite. Les structures de contrôle permettent à votre code de prendre des décisions intelligentes.",
        extra: `
### La Logique du Choix
Grâce à \`if\`, \`elif\` et \`else\`, vous pouvez diriger le flux de votre application en fonction des données reçues.

![Structures de Contrôle]($IMAGE_PLACEHOLDER$)

> [!IMPORTANT]
> L'indentation n'est pas optionnelle en Python ! C'est elle qui définit les blocs de code. Soyez rigoureux.
`
    },
    "Les Boucles": {
        image: "/images/course-python/lesson4.png",
        intro: "La puissance de l'informatique réside dans sa capacité à répéter des tâches sans fatigue. Les boucles sont vos meilleures alliées pour l'automatisation.",
        extra: `
### For vs While
*   **For** : Pour parcourir une collection ou un intervalle connu.
*   **While** : Tant qu'une condition reste vraie.

![Les Boucles Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> Utilisez \`enumerate()\` dans vos boucles \`for\` pour obtenir l'index et l'élément en même temps.
`
    },
    "Les Fonctions": {
        image: "/images/course-python/lesson5.png",
        intro: "Une fonction est une 'recette' réutilisable. Elle permet de modulariser votre code et d'éviter les répétitions inutiles (principe DRY : Don't Repeat Yourself).",
        extra: `
### Anatomie d'une Fonction
Une bonne fonction doit faire une seule chose et le faire bien. Elle prend des entrées (paramètres) et produit une sortie (return).

![Fonctions Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> Documentez toujours vos fonctions avec des **docstrings** (\`\"\"\" documentation \"\"\"\`) pour aider les autres (et votre futur vous) à comprendre votre code.
`
    },
    "Listes et Tuples": {
        image: "/images/course-python/lesson6.png",
        intro: "Comment stocker 1000 noms ? Pas avec 1000 variables ! Les listes et tuples sont des collections ordonnées pour organiser vos données.",
        extra: `
### Mutable vs Immuable
*   **Listes** : Flexibles, on peut ajouter ou supprimer des éléments.
*   **Tuples** : Fixes, idéaux pour des données qui ne doivent pas changer (coordonnées, réglages).

![Collections Concept]($IMAGE_PLACEHOLDER$)

> [!NOTE]
> Le slicing (\`ma_liste[1:3]\`) est une technique surpuissante pour extraire des sous-parties de vos données.
`
    },
    "Dictionnaires et Sets": {
        image: "/images/course-python/lesson7.png",
        intro: "Chercher dans une liste peut être lent. Les dictionnaires utilisent des 'clés' pour un accès instantané, comme un index de livre.",
        extra: `
### Clé-Valeur et Unicité
*   **Dictionnaires** : Associez une information à un label unique.
*   **Sets** : Une collection sans doublons, parfaite pour les opérations mathématiques d'ensembles.

![Mapping Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> Les dictionnaires sont les bases du format JSON, le standard mondial de l'échange de données sur le web.
`
    },
    "Programmation Orientée Objet": {
        image: "/images/course-python/lesson8.png",
        intro: "La POO permet de modéliser le monde réel. Une Classe est le plan d'architecte, et l'Objet est la maison construite d'après ce plan.",
        extra: `
### Les Piliers de la POO
1. **Encapsulation** : Cacher la complexité interne.
2. **Héritage** : Réutiliser le code d'une classe parente.
3. **Polymorphisme** : Une interface unique pour des comportements différents.

![POO Concept]($IMAGE_PLACEHOLDER$)

> [!IMPORTANT]
> Ne complexifiez pas trop ! La POO est un outil d'organisation, pas une obligation pour les scripts simples.
`
    },
    "Gestion des Erreurs": {
        image: "/images/course-python/lesson9.png",
        intro: "Les erreurs (exceptions) sont inévitables. Savoir les anticiper et les gérer proprement distingue le développeur junior du senior.",
        extra: `
### Try / Except / Finally
Anticipez les crashs ! Si un fichier est manquant ou une connexion échoue, votre programme doit réagir avec élégance au lieu de s'arrêter brutalement.

![Security Concept]($IMAGE_PLACEHOLDER$)

> [!CAUTION]
> N'utilisez jamais un \`except\` vide. Attrapez toujours des exceptions spécifiques (\`ValueError\`, \`FileNotFoundError\`, etc.) pour savoir ce qui se passe réellement.
`
    },
    "Fichiers et Modules": {
        image: "/images/course-python/lesson10.png",
        intro: "Votre code n'existe pas en vase clos. Apprenez à lire des données externes et à utiliser des modules pour étendre les capacités de Python.",
        extra: `
### L'importation de la Puissance
Python possède une 'Standard Library' immense. Besoin de mathématiques complexes ? \`import math\`. Besoin de manipuler le temps ? \`import datetime\`.

![Modules Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> Utilisez toujours le context manager \`with open(...) as f:\` pour manipuler des fichiers. Cela garantit que le fichier est fermé correctement, même en cas d'erreur.
`
    },
    "NumPy - Calcul Scientifique": {
        image: "/images/course-python/lesson11.png",
        intro: "Entrez dans le monde de la Data Science. NumPy est la fondation de presque tous les calculs scientifiques en Python grâce à ses tableaux ultra-rapides.",
        extra: `
### Pourquoi NumPy ?
Le calcul vectorisé permet de traiter des millions de données en une fraction de seconde, là où les listes Python classiques seraient trop lentes.

![NumPy Concept]($IMAGE_PLACEHOLDER$)

> [!NOTE]
> Un tableau NumPy consomme beaucoup moins de mémoire qu'une liste Python équivalente.
`
    },
    "Pandas - Manipulation de Données": {
        image: "/images/course-python/lesson12.png",
        intro: "Pandas est le 'Excel sous stéroïdes' de Python. C'est l'outil indispensable pour nettoyer, transformer et analyser des jeux de données complexes.",
        extra: `
### DataFrames et Séries
Manipulez vos données sous forme de tableaux (DataFrames) puissants. Filtrez, groupez et agrégez vos informations en quelques lignes de code.

![Pandas Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> La plupart de votre temps en Data Science sera passé à nettoyer les données. Maîtrisez \`.dropna()\` et \`.fillna()\` !
`
    },
    "Visualisation avec Matplotlib": {
        image: "/images/course-python/lesson13.png",
        intro: "Une image vaut mille mots. Apprenez à transformer des chiffres abstraits en graphiques parlants et professionnels.",
        extra: `
### Du Chiffre au Graphique
Courbes, histogrammes, nuages de points... La visualisation permet de déceler des tendances invisibles dans les données brutes.

![Visualization Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> Pour des graphiques encore plus esthétiques et simples, tournez-vous vers la bibliothèque **Seaborn**, qui repose sur Matplotlib.
`
    },
    "Projet : Analyse de Données Réelles": {
        image: "/images/course-python/lesson14.png",
        intro: "C'est ici que tout s'assemble. Mettez en pratique vos connaissances sur un cas d'usage concret pour prouver votre maîtrise.",
        extra: `
### Le Cycle de l'Analyse
1. Importation des données.
2. Nettoyage et exploration.
3. Analyse statistique.
4. Visualisation des résultats.

![Analytical Concept]($IMAGE_PLACEHOLDER$)

> [!IMPORTANT]
> Un bon projet n'est pas seulement du code, c'est une histoire racontée à travers les données. Soignez vos conclusions !
`
    },
    "Python Avancé — Astuces et Bonnes Pratiques": {
        image: "/images/course-python/lesson15.png",
        intro: "Atteignez le niveau professionnel. Maîtrisez les outils sophistiqués qui rendent le code Python élégant, performant et maintenable.",
        extra: `
### Vers la Maîtrise
Découvrez les générateurs pour économiser la mémoire, les décorateurs pour étendre les fonctions, et les Type Hints pour un code plus sûr.

![Expert Concept]($IMAGE_PLACEHOLDER$)

> [!TIP]
> Le code ultime n'est pas le plus complexe, c'est celui qui est le plus facile à lire et à maintenir par vos collègues.
`
    }
};

async function main() {
    const course = await prisma.course.findUnique({
        where: { slug: 'python-integral' }
    });

    if (!course) {
        console.error('Course not found');
        return;
    }

    const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' },
        include: { contents: true }
    });

    for (const lesson of lessons) {
        const enrichment = lessonData[lesson.title];
        if (enrichment) {
            console.log(`Updating lesson: ${lesson.title}`);

            // Update main lesson content (description/intro)
            const newMainContent = `${enrichment.intro}\n\n${lesson.content || ''}`;

            await prisma.lesson.update({
                where: { id: lesson.id },
                data: {
                    content: newMainContent
                }
            });

            // Find the main text content to replace/append enrichment
            const textContent = lesson.contents.find(c => c.contentType === 'text');
            if (textContent) {
                let updatedContent = textContent.content;

                // Append extra info and image
                const extraWithImage = enrichment.extra.replace('$IMAGE_PLACEHOLDER$', enrichment.image);
                updatedContent += "\n\n" + extraWithImage;

                await prisma.courseContent.update({
                    where: { id: textContent.id },
                    data: {
                        content: updatedContent
                    }
                });
            } else {
                // If no text content exists, create one?
                // For now, assume it exists based on previous dump
            }
        }
    }

    console.log('Update complete!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
