const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding courses...')

    // --- COURS 1: Python Intégral (Complet) ---
    const pythonCourse = await prisma.course.upsert({
        where: { slug: 'python-integral' },
        update: {},
        create: {
            title: 'Python Intégral',
            slug: 'python-integral',
            description: 'Maîtrisez les bases et la POO avec Python.',
            price: 29.99,
            level: 'Débutant',
            duration: '20h 00m',
            image: '/images/courses/python.png',
            lessons: {
                create: [
                    {
                        title: '1. Variables et Types de données',
                        order: 1,
                        duration: 30,
                        content: `
# Variables et Types

Dans cette leçon, nous allons voir comment stocker des données.

\`\`\`python
# Entier (int)
age = 25

# Décimal (float)
prix = 19.99

# Chaîne de caractères (str)
nom = "Alice"

# Booléen (bool)
est_etudiant = True

print(f"Bonjour {nom}, vous avez {age} ans.")
\`\`\`

Python est un langage à typage dynamique, ce qui signifie que vous n'avez pas besoin de déclarer le type de la variable.
`
                    },
                    {
                        title: '2. Structures de contrôle (Conditions et Boucles)',
                        order: 2,
                        duration: 45,
                        content: `
# Conditions et Boucles

## If / Else

\`\`\`python
note = 15

if note >= 10:
    print("Réussite")
else:
    print("Échec")
\`\`\`

## Boucle For

\`\`\`python
fruits = ["pomme", "banane", "cerise"]

for fruit in fruits:
    print(fruit)
\`\`\`

## Boucle While

\`\`\`python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
\`\`\`
`
                    },
                    {
                        title: '3. Les Fonctions',
                        order: 3,
                        duration: 40,
                        content: `
# Les Fonctions

Une fonction est un bloc de code réutilisable.

\`\`\`python
def saluer(nom, heure):
    """Affiche un message de salutation"""
    if heure < 18:
        return f"Bonjour {nom}"
    else:
        return f"Bonsoir {nom}"

message = saluer("Bob", 19)
print(message)  # Bonsoir Bob
\`\`\`
`
                    },
                    {
                        title: '4. Gestion des Fichiers',
                        order: 4,
                        duration: 35,
                        content: `
# Lire et Écrire dans des fichiers

\`\`\`python
# Écriture
with open("data.txt", "w") as f:
    f.write("Ligne 1\\n")
    f.write("Ligne 2")

# Lecture
with open("data.txt", "r") as f:
    contenu = f.read()
    print(contenu)
\`\`\`
`
                    },
                    {
                        title: '5. Programmation Orientée Objet (POO)',
                        order: 5,
                        duration: 60,
                        content: `
# Classes et Objets

\`\`\`python
class Voiture:
    def __init__(self, marque, modele):
        self.marque = marque
        self.modele = modele
        self.vitesse = 0

    def accelerer(self, valeur):
        self.vitesse += valeur
        print(f"La {self.marque} accélère à {self.vitesse} km/h")

ma_voiture = Voiture("Tesla", "Model 3")
ma_voiture.accelerer(50)
\`\`\`
`
                    },
                    {
                        title: '6. Bibliothèques Externes (NumPy & Pandas)',
                        order: 6,
                        duration: 55,
                        content: `
# NumPy et Pandas

Ces bibliothèques sont essentielles pour la Data Science.

![NumPy et Pandas](https://placehold.co/600x400/png?text=NumPy+Pandas)

## NumPy
Calculs numériques performants.

\`\`\`python
import numpy as np
arr = np.array([1, 2, 3])
print(arr * 2)
\`\`\`

## Pandas
Manipulation de données tabulaires.

\`\`\`python
import pandas as pd
data = {"Nom": ["Alice", "Bob"], "Age": [25, 30]}
df = pd.DataFrame(data)
print(df)
\`\`\`
`
                    },
                    {
                        title: '7. Projet Final: Analyse Simple',
                        order: 7,
                        duration: 90,
                        content: `
# Projet Final

Analysons un jeu de données réel.

![Projet Final](https://placehold.co/600x400/1abc9c/white?text=Projet+Data)

Objectifs :
1. Charger les données.
2. Nettoyer les données.
3. Analyser et visualiser.

\`\`\`python
# Exemple de script complet
import pandas as pd

# 1. Chargement
df = pd.read_csv('ventes.csv')

# 2. Nettoyage
df = df.dropna()

# 3. Analyse
print(df.describe())
\`\`\`
`
                    }
                ]
            }
        }
    });
    console.log('✅ Cours Python Intégral créé/mis à jour.');


    // --- COURS 2: R Statistics (Base Complète) ---
    // User requested "Cour complet de base R stat avec image"
    // We update the existing slug 'r-statistics-finance' or create it if missing, but populate it with heavy base content.
    const rCourse = await prisma.course.upsert({
        where: { slug: 'r-statistics-finance' },
        update: {
            // Update title to reflect "Base" if needed, but keeping original title is safer for links
            // We just ensure lessons are comprehensive
        },
        create: {
            title: 'R pour Statistiques & Finance',
            slug: 'r-statistics-finance',
            description: 'Analysez des données financières complexes et créez des modèles prédictifs avec R.',
            price: 59.99,
            level: 'Intermédiaire',
            duration: '25h 00m',
            image: '/images/courses/r-stats.png',
            lessons: {
                create: [] // Will add via update if exists or simple create logic below
            }
        }
    });

    // We wipe existing lessons for R to force new structure (only for seed dev purposes)
    // In prod we would append. Here we adhere to "add course" request.
    // Let's just add lessons if they don't exist by title to avoid dupes, or simple UPSERT logic.

    const rLessons = [
        {
            title: '1. Introduction à R (Variables et Types)',
            order: 1,
            duration: 40,
            content: `
# Bases de R

R est un langage dédié aux statistiques.

\`\`\`r
# Assignation
x <- 10
nom <- "StatLabo"
est_valide <- TRUE

# Vecteurs (structure de base)
notes <- c(12, 15, 8, 19)

# Calculs sur vecteurs
moyenne <- mean(notes)
print(paste("Moyenne:", moyenne))
\`\`\`
`
        },
        {
            title: '2. Structures de Données (DataFrames)',
            order: 2,
            duration: 50,
            content: `
# Data Frames

Le Data Frame est similaire à une feuille Excel.

\`\`\`r
# Création
etudiants <- data.frame(
  nom = c("Ali", "Sara", "Karim"),
  age = c(22, 21, 23),
  note = c(15, 18, 14)
)

# Accès aux colonnes
print(etudiants$note)

# Filtrage
bons_eleves <- subset(etudiants, note > 14)
print(bons_eleves)
\`\`\`
`
        },
        {
            title: '3. Boucles et Fonctions',
            order: 3,
            duration: 45,
            content: `
# Automatisation

\`\`\`r
# Boucle For
for (i in 1:5) {
  print(paste("Tour numéro", i))
}

# Fonction personnalisée
carre <- function(x) {
  return(x^2)
}

resultat <- carre(9)
print(resultat)
\`\`\`
`
        },
        {
            title: '4. Visualisation avec ggplot2',
            order: 4,
            duration: 60,
            content: `
# Ggplot2 : La référence graphique

\`\`\`r
library(ggplot2)

# Données exemples
data(mtcars)

# Nuage de points
ggplot(mtcars, aes(x=wt, y=mpg)) +
  geom_point(color='blue') +
  labs(title="Poids vs Consommation", x="Poids", y="MPG") +
  theme_minimal()
\`\`\`
`
        },
        {
            title: '5. Statistiques Inférentielles',
            order: 5,
            duration: 60,
            content: `
# Tests Statistiques

\`\`\`r
# T-Test (comparaison de moyennes)
groupe_A <- c(10, 12, 9, 11)
groupe_B <- c(14, 15, 13, 16)

test <- t.test(groupe_A, groupe_B)
print(test)

# Régression Linéaire
modele <- lm(mpg ~ wt, data=mtcars)
summary(modele)
\`\`\`
`
        }
    ];

    for (const l of rLessons) {
        // Upsert lesson based on title+courseId
        // Needs finding course ID first
        const course = await prisma.course.findUnique({ where: { slug: 'r-statistics-finance' } });
        if (course) {
            const existing = await prisma.lesson.findFirst({
                where: { courseId: course.id, title: l.title }
            });
            if (!existing) {
                await prisma.lesson.create({
                    data: { ...l, courseId: course.id }
                })
            }
        }
    }
    console.log('✅ Cours R Statistics mis à jour avec contenu complet.');

    console.log('Seeding finished.');
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
