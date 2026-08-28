const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding R Course...');

    const courseData = {
        title: 'R pour la Finance et les Statistiques',
        slug: 'r-statistics-finance',
        description: 'Devenez expert en analyse de données financières avec R. Du débutant au niveau avancé.',
        fullDescription: `
# Maîtrisez R pour la Finance

Cette formation complète vous guidera à travers l'écosystème R, spécifiquement adapté pour l'analyse financière et statistique.

## Pourquoi R en Finance ?
R est le standard pour les statistiques et la visualisation de données. En finance, il est utilisé pour :
- Le Backtesting de stratégies de trading
- L'analyse de risques (Value at Risk)
- La modélisation économétrique
- La visualisation de séries temporelles

Vous apprendrez à manipuler des données financières, créer des visualisations époustouflantes et automatiser vos analyses.
    `,
        price: 49.99,
        isFree: false,
        level: 'Intermédiaire',
        duration: '15h',
        image: '/courses/r-stats.png',
        learningOutcomes: JSON.stringify([
            'Installer et configurer R et RStudio',
            'Maîtriser les structures de données (Vecteurs, DataFrames)',
            'Manipuler des données avec Tidyverse (dplyr)',
            'Visualiser des données avec ggplot2',
            'Télécharger des données boursières avec quantmod',
            'Calculer des rendements et analyser un portefeuille'
        ]),
        requirements: JSON.stringify([
            'Aucune connaissance préalable requise',
            'Un ordinateur (Windows/Mac/Linux)'
        ]),
        isPublished: true,
    };

    const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: courseData,
        create: courseData,
    });

    console.log(`Course created: ${course.title}`);

    const lessons = [
        {
            title: 'Installation et Configuration',
            order: 1,
            duration: 30,
            content: `
# Installation de l'environnement

Pour suivre ce cours, vous avez besoin de deux outils essentiels et gratuits :

1.  **R (Le langage)** : C'est le moteur de calcul.
    *   [Télécharger R sur le CRAN](https://cran.r-project.org/)
2.  **RStudio (L'interface)** : C'est l'environnement de développement (IDE) qui rend R facile à utiliser.
    *   [Télécharger RStudio Desktop](https://posit.co/download/rstudio-desktop/)

## Premier aperçu de RStudio
Une fois installé, ouvrez RStudio. Vous verrez 4 panneaux principaux :
1.  **Source** (Haut-Gauche) : Pour écrire vos scripts.
2.  **Console** (Bas-Gauche) : Où le code s'exécute.
3.  **Environment** (Haut-Droite) : Vos variables et données.
4.  **Files/Plots** (Bas-Droite) : Vos graphiques et fichiers.

![RStudio Interface](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/RStudio_IDE_screenshot.png/800px-RStudio_IDE_screenshot.png)
      `
        },
        {
            title: 'Les Bases du Langage R',
            order: 2,
            duration: 60,
            content: `
# Les bases de la syntaxe

## Variables et Assignation
En R, on utilise \`<-\` pour assigner une valeur.
\`\`\`r
prix_action <- 150.5
volume <- 1000
ticker <- "AAPL"
\`\`\`

## Types de données
*   **Numeric** : Nombres (ex: 10.5)
*   **Character** : Texte (ex: "Finance")
*   **Logical** : TRUE / FALSE

## Structures de données

### Vecteurs
Une suite d'éléments du même type.
\`\`\`r
prix <- c(100, 102, 98, 105)
rendements <- c(0.02, -0.04, 0.07)
\`\`\`

### Data Frames
C'est comme un tableau Excel. C'est la structure la plus utilisée.
\`\`\`r
portfolio <- data.frame(
  Asset = c("AAPL", "GOOG", "MSFT"),
  Price = c(150, 2800, 300),
  Quantity = c(10, 5, 20)
)
print(portfolio)
\`\`\`
      `
        },
        {
            title: 'Manipulation de Données (Tidyverse)',
            order: 3,
            duration: 90,
            content: `
# Tidyverse et Dplyr

Le package \`tidyverse\` est une collection d'outils modernes pour la data science. \`dplyr\` est l'outil pour manipuler les données.

Installation :
\`\`\`r
install.packages("tidyverse")
library(tidyverse)
\`\`\`

## Verbes principaux
1.  **select()** : Choisir des colonnes
2.  **filter()** : Filtrer des lignes
3.  **mutate()** : Créer de nouvelles colonnes
4.  **arrange()** : Trier

## Exemple Finance
\`\`\`r
# Création d'un dataset exemple
data <- data.frame(
  Date = as.Date('2023-01-01') + 0:4,
  Price = c(100, 101, 99, 102, 105)
)

# Calcul du rendement journalier
data_clean <- data %>%
  mutate(Return = (Price - lag(Price)) / lag(Price)) %>%
  filter(!is.na(Return)) # Enlever la première ligne vide

print(data_clean)
\`\`\`
      `
        },
        {
            title: 'Visualisation avec ggplot2',
            order: 4,
            duration: 90,
            content: `
# Visualisation Pro avec ggplot2

ggplot2 fonctionne par "couches" (layers).

1.  **Data** : Les données
2.  **Aesthetics (aes)** : Quoi mettre sur X, Y, Couleur...
3.  **Geometries (geom)** : Le type de graphique (ligne, points, barres)

## Exemple : Cours de Bourse
\`\`\`r
library(ggplot2)

df <- data.frame(
  Day = 1:50,
  Price = cumsum(rnorm(50)) + 100 # Marche aléatoire
)

ggplot(df, aes(x = Day, y = Price)) +
  geom_line(color = "blue", size = 1) +
  geom_point(color = "red", alpha = 0.5) +
  theme_minimal() +
  labs(title = "Cours Simulé", y = "Prix ($)", x = "Jour")
\`\`\`
      `
        },
        {
            title: 'Projet Finance : Analyse Quantmod',
            order: 5,
            duration: 120,
            content: `
# Analyse Financière Réelle

Nous allons utiliser le package \`quantmod\` pour télécharger des vraies données.

\`\`\`r
install.packages("quantmod")
library(quantmod)

# Télécharger les données de Apple (AAPL) depuis Yahoo Finance
getSymbols("AAPL", src = "yahoo", from = "2023-01-01")

# Afficher les premières lignes
head(AAPL)

# Visualiser le graphique en chandeliers (Candlestick)
chartSeries(AAPL, theme = chartTheme("white"), name = "Apple Inc.")

# Ajouter des indicateurs techniques (Moyennes Mobiles)
addSMA(n = 20, col = "blue")
addSMA(n = 50, col = "red")
\`\`\`

## Calcul des Rendements Logarithmiques
\`\`\`r
returns <- dailyReturn(AAPL, type = "log")
hist(returns, breaks = 50, main = "Distribution des Rendements AAPL", col = "lightblue")
\`\`\`
      `
        }
    ];

    for (const lesson of lessons) {
        await prisma.lesson.create({
            data: {
                ...lesson,
                courseId: course.id,
            },
        });
        console.log(`Lesson created: ${lesson.title}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
