const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Python Course...')
    const pythonCourse = await prisma.course.upsert({
        where: { slug: 'python-novice' },
        update: {
            title: 'Python pour Débutants',
            title_en: 'Python for Novices',
            title_ar: 'بايثون للمبتدئين',
            description: 'Apprenez les bases de la programmation avec Python, idéal pour les débutants.',
            description_en: 'Learn programming basics with Python, perfect for beginners.',
            description_ar: 'تعلم أساسيات البرمجة مع بايثون، مثالي للمبتدئين.',
            price: 0,
            isFree: true,
            isInviteOnly: false,
            isPublished: true,
        },
        create: {
            title: 'Python pour Débutants',
            title_en: 'Python for Novices',
            title_ar: 'بايثون للمبتدئين',
            slug: 'python-novice',
            description: 'Apprenez les bases de la programmation avec Python, idéal pour les débutants.',
            description_en: 'Learn programming basics with Python, perfect for beginners.',
            description_ar: 'تعلم أساسيات البرمجة مع بايثون، مثالي للمبتدئين.',
            price: 0,
            isFree: true,
            isInviteOnly: false,
            isPublished: true,
            level: 'Débutant',
            duration: '8h 30m',
            image: '/images/courses/python-novice.png',
            lessons: {
                create: [
                    {
                        title: 'Introduction à Python',
                        title_en: 'Introduction to Python',
                        title_ar: 'مقدمة في بايثون',
                        duration: 25,
                        order: 1,
                        content: `# Bienvenue dans le cours Python pour Débutants !

## Qu'est-ce que Python ?

Python est un langage de programmation simple et puissant, très populaire dans le monde.

### Pourquoi apprendre Python ?
- Syntaxe simple et lisible
- Très demandé sur le marché du travail
- Polyvalent : web, data science, IA, automatisation...

## Installation

### Windows
1. Téléchargez Python depuis [python.org](https://python.org)
2. Cochez "Add Python to PATH"
3. Cliquez sur "Install Now"

### Mac/Linux
Python est souvent préinstallé. Vérifiez avec :
\`\`\`bash
python3 --version
\`\`\`

## Votre premier programme

Ouvrez un terminal et tapez :
\`\`\`python
print("Bonjour, monde !")
\`\`\`

**Félicitations !** Vous avez écrit votre premier programme Python.
`,
                        content_en: 'Introduction to Python programming language and its ecosystem.',
                        content_ar: 'مقدمة في لغة البرمجة بايثون ونظامها البيئي.',
                    },
                    {
                        title: 'Variables et Types de Données',
                        title_en: 'Variables and Data Types',
                        title_ar: 'المتغيرات وأنواع البيانات',
                        duration: 40,
                        order: 2,
                        content: `# Variables et Types de Données

## Qu'est-ce qu'une variable ?

Une variable est comme un conteneur qui stocke une valeur.

### Déclarer une variable
\`\`\`python
nom = "Ahmed"
age = 25
taille = 1.75
est_etudiant = True
\`\`\`

## Types de données principaux

### 1. Entiers (int)
\`\`\`python
x = 42
y = -10
\`\`\`

### 2. Nombres à virgule (float)
\`\`\`python
prix = 19.99
pi = 3.14159
\`\`\`

### 3. Chaînes de caractères (str)
\`\`\`python
message = "Bonjour"
nom = 'Sarah'
\`\`\`

### 4. Booléens (bool)
\`\`\`python
vrai = True
faux = False
\`\`\`

## Connaître le type d'une variable
\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

## Exercice
Créez des variables pour :
- Votre nom
- Votre âge
- Votre ville
- Si vous aimez Python (booléen)
`,
                        content_en: 'Understanding variables, integers, floats, strings, and booleans.',
                        content_ar: 'فهم المتغيرات والأعداد الصحيحة والعشرية والنصوص والقيم المنطقية.',
                    },
                    {
                        title: 'Opérateurs Mathématiques',
                        title_en: 'Mathematical Operators',
                        title_ar: 'المعاملات الرياضية',
                        duration: 30,
                        order: 3,
                        content: `# Opérateurs Mathématiques

## Les opérateurs de base

\`\`\`python
a = 10
b = 3

# Addition
print(a + b)  # 13

# Soustraction
print(a - b)  # 7

# Multiplication
print(a * b)  # 30

# Division
print(a / b)  # 3.333...

# Division entière
print(a // b)  # 3

# Modulo (reste de la division)
print(a % b)  # 1

# Puissance
print(a ** b)  # 1000
\`\`\`

## Ordre des opérations

Python respecte les règles mathématiques (PEMDAS) :
1. **P**arenthèses
2. **E**xposants
3. **M**ultiplication/**D**ivision
4. **A**ddition/**S**oustraction

\`\`\`python
resultat = 2 + 3 * 4  # 14 (pas 20)
resultat = (2 + 3) * 4  # 20
\`\`\`

## Exercice
Calculez :
1. La surface d'un rectangle (longueur × largeur)
2. La moyenne de 3 notes
3. Le reste de 17 divisé par 5
`,
                        content_en: 'Learn addition, subtraction, multiplication, division, and more.',
                        content_ar: 'تعلم الجمع والطرح والضرب والقسمة والمزيد.',
                    },
                    {
                        title: 'Conditions (if/else)',
                        title_en: 'Conditions (if/else)',
                        title_ar: 'الشروط (if/else)',
                        duration: 35,
                        order: 4,
                        content: `# Conditions en Python

## Structure if/else

\`\`\`python
age = 18

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")
\`\`\`

## if/elif/else

\`\`\`python
note = 15

if note >= 16:
    print("Excellent !")
elif note >= 14:
    print("Bien")
elif note >= 10:
    print("Assez bien")
else:
    print("Doit améliorer")
\`\`\`

## Opérateurs de comparaison

| Opérateur | Signification |
|-----------|---------------|
| == | Égal à |
| != | Différent de |
| < | Inférieur à |
| > | Supérieur à |
| <= | Inférieur ou égal à |
| >= | Supérieur ou égal à |

## Opérateurs logiques

\`\`\`python
age = 25
a_permis = True

if age >= 18 and a_permis:
    print("Peut conduire")

if age < 18 or not a_permis:
    print("Ne peut pas conduire")
\`\`\`

## Exercice
Écrivez un programme qui :
- Demande un nombre
- Affiche "positif", "négatif" ou "zéro"
- Vérifie s'il est pair ou impair
`,
                        content_en: 'Make decisions in your code with conditional statements.',
                        content_ar: 'اتخاذ القرارات في الكود باستخدام العبارات الشرطية.',
                    },
                    {
                        title: 'Boucles (for et while)',
                        title_en: 'Loops (for and while)',
                        title_ar: 'الحلقات (for و while)',
                        duration: 45,
                        order: 5,
                        content: `# Boucles en Python

## Boucle for

La boucle **for** parcourt une séquence :

\`\`\`python
# Afficher les nombres de 1 à 5
for i in range(1, 6):
    print(i)

# Parcourir une liste
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(f"J'aime {fruit}")
\`\`\`

## Fonction range()

\`\`\`python
range(5)        # 0, 1, 2, 3, 4
range(1, 5)     # 1, 2, 3, 4
range(0, 10, 2) # 0, 2, 4, 6, 8
\`\`\`

## Boucle while

La boucle **while** continue tant qu'une condition est vraie :

\`\`\`python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
\`\`\`

## break et continue

\`\`\`python
# break - sortir de la boucle
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue - passer au suivant
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
\`\`\`

## Exercice
1. Affichez les nombres pairs de 0 à 20
2. Calculez la somme des nombres de 1 à 100
3. Créez un compte à rebours de 10 à 0
`,
                        content_en: 'Repeat actions with loops to automate repetitive tasks.',
                        content_ar: 'كرر الإجراءات باستخدام الحلقات لأتمتة المهام المتكررة.',
                    },
                    {
                        title: 'Listes',
                        title_en: 'Lists',
                        title_ar: 'القوائم',
                        duration: 40,
                        order: 6,
                        content: `# Les Listes en Python

## Créer une liste

\`\`\`python
fruits = ["pomme", "banane", "orange"]
nombres = [1, 2, 3, 4, 5]
mixte = ["texte", 42, True, 3.14]
\`\`\`

## Accéder aux éléments

\`\`\`python
fruits = ["pomme", "banane", "orange"]

print(fruits[0])   # pomme (premier)
print(fruits[1])   # banane
print(fruits[-1])  # orange (dernier)
\`\`\`

## Modifier une liste

\`\`\`python
fruits = ["pomme", "banane"]

# Ajouter
fruits.append("orange")      # ["pomme", "banane", "orange"]
fruits.insert(1, "fraise")   # ["pomme", "fraise", "banane", "orange"]

# Supprimer
fruits.remove("banane")      # ["pomme", "fraise", "orange"]
dernier = fruits.pop()       # ["pomme", "fraise"]

# Modifier
fruits[0] = "abricot"        # ["abricot", "fraise"]
\`\`\`

## Opérations sur les listes

\`\`\`python
nombres = [3, 1, 4, 1, 5]

len(nombres)        # 5 (longueur)
sorted(nombres)     # [1, 1, 3, 4, 5]
nombres.reverse()   # [5, 1, 4, 1, 3]
sum(nombres)        # 14
\`\`\`

## Slicing (découpage)

\`\`\`python
nombres = [0, 1, 2, 3, 4, 5]

nombres[2:5]    # [2, 3, 4]
nombres[:3]     # [0, 1, 2]
nombres[3:]     # [3, 4, 5]
nombres[::2]    # [0, 2, 4] (un sur deux)
\`\`\`

## Exercice
1. Créez une liste de 5 pays
2. Ajoutez un pays au début
3. Supprimez le 3ème pays
4. Affichez la liste triée par ordre alphabétique
`,
                        content_en: 'Store multiple values in lists, the most common data structure.',
                        content_ar: 'تخزين قيم متعددة في القوائم، وهي أكثر هياكل البيانات شيوعاً.',
                    },
                    {
                        title: 'Dictionnaires',
                        title_en: 'Dictionaries',
                        title_ar: 'القواميس',
                        duration: 35,
                        order: 7,
                        content: `# Les Dictionnaires en Python

## Qu'est-ce qu'un dictionnaire ?

Un dictionnaire stocke des paires **clé : valeur**.

\`\`\`python
personne = {
    "nom": "Ahmed",
    "age": 25,
    "ville": "Alger"
}
\`\`\`

## Accéder aux valeurs

\`\`\`python
print(personne["nom"])      # Ahmed
print(personne.get("age"))  # 25
\`\`\`

## Modifier un dictionnaire

\`\`\`python
personne = {"nom": "Ahmed", "age": 25}

# Ajouter
personne["ville"] = "Alger"

# Modifier
personne["age"] = 26

# Supprimer
del personne["ville"]
\`\`\`

## Méthodes utiles

\`\`\`python
personne = {"nom": "Ahmed", "age": 25, "ville": "Alger"}

personne.keys()      # dict_keys(['nom', 'age', 'ville'])
personne.values()    # dict_values(['Ahmed', 25, 'Alger'])
personne.items()     # dict_items([('nom', 'Ahmed'), ...])
len(personne)        # 3
\`\`\`

## Parcourir un dictionnaire

\`\`\`python
personne = {"nom": "Ahmed", "age": 25}

# Clés
for key in personne:
    print(key)

# Valeurs
for value in personne.values():
    print(value)

# Clés et valeurs
for key, value in personne.items():
    print(f"{key}: {value}")
\`\`\`

## Exercice
Créez un dictionnaire pour représenter :
- Un livre (titre, auteur, année, pages)
- Un étudiant (nom, notes, classe)
- Un produit (nom, prix, stock)
`,
                        content_en: 'Store key-value pairs with dictionaries for structured data.',
                        content_ar: 'تخزين أزواج المفتاح والقيمة باستخدام القواميس للبيانات المنظمة.',
                    },
                    {
                        title: 'Fonctions',
                        title_en: 'Functions',
                        title_ar: 'الدوال',
                        duration: 40,
                        order: 8,
                        content: `# Les Fonctions en Python

## Qu'est-ce qu'une fonction ?

Une fonction est un bloc de code réutilisable.

\`\`\`python
def dire_bonjour():
    print("Bonjour !")

dire_bonjour()  # Appel de la fonction
\`\`\`

## Paramètres et arguments

\`\`\`python
def saluer(nom):
    print(f"Bonjour, {nom} !")

saluer("Ahmed")   #Bonjour, Ahmed !
saluer("Sarah")   #Bonjour, Sarah !
\`\`\`

## Plusieurs paramètres

\`\`\`python
def presenter(nom, age):
    print(f"{nom} a {age} ans")

presenter("Ahmed", 25)  # Ahmed a 25 ans
\`\`\`

## Valeur de retour

\`\`\`python
def additionner(a, b):
    return a + b

resultat = additionner(5, 3)
print(resultat)  # 8
\`\`\`

## Paramètres par défaut

\`\`\`python
def saluer(nom, message="Bonjour"):
    print(f"{message}, {nom} !")

saluer("Ahmed")                    #Bonjour, Ahmed !
saluer("Sarah", "Bonsoir")        #Bonsoir, Sarah !
\`\`\`

## Exercice
Créez les fonctions suivantes :
1. **celsius_vers_fahrenheit(c)** - Convertit °C en °F
2. **est_pair(nombre)** - Retourne True si pair
3. **moyenne(liste)** - Calcule la moyenne d'une liste
4. **calculer_tva(prix, tva=0.19)** - Calcule le prix TTC
`,
                        content_en: 'Create reusable code blocks with functions.',
                        content_ar: 'إنشاء كتل قابلة لإعادة الاستخدام باستخدام الدوال.',
                    },
                    {
                        title: 'Projets Pratiques',
                        title_en: 'Practical Projects',
                        title_ar: 'مشاريع عملية',
                        duration: 50,
                        order: 9,
                        content: `# Projets Pratiques

## Projet 1 : Calculatrice Simple

\`\`\`python
def calculatrice():
    print("=== Calculatrice ===")
    print("1. Addition")
    print("2. Soustraction")
    print("3. Multiplication")
    print("4. Division")

    choix = input("Choisissez (1-4): ")
    a = float(input("Premier nombre: "))
    b = float(input("Deuxième nombre: "))

    if choix == "1":
        print(f"Résultat: {a + b}")
    elif choix == "2":
        print(f"Résultat: {a - b}")
    elif choix == "3":
        print(f"Résultat: {a * b}")
    elif choix == "4":
        print(f"Résultat: {a / b}")

calculatrice()
\`\`\`

## Projet 2 : Deviner le Nombre

\`\`\`python
import random

nombre_secret = random.randint(1, 100)
essais = 0

print("Devinez le nombre entre 1 et 100 !")

while True:
    essai = int(input("Votre proposition: "))
    essais += 1

    if essai < nombre_secret:
        print("Plus grand !")
    elif essai > nombre_secret:
        print("Plus petit !")
    else:
        print(f"Bravo ! Trouvé en {essais} essais !")
        break
\`\`\`

## Projet 3 : Liste de Courses

\`\`\`python
courses = []

while True:
    print("\\n=== Liste de Courses ===")
    print("1. Ajouter")
    print("2. Afficher")
    print("3. Supprimer")
    print("4. Quitter")

    choix = input("Choix: ")

    if choix == "1":
        item = input("Que voulez-vous ajouter ? ")
        courses.append(item)
        print(f"{item} ajouté !")

    elif choix == "2":
        for i, item in enumerate(courses, 1):
            print(f"{i}. {item}")

    elif choix == "3":
        if courses:
            num = int(input("Numéro à supprimer: ")) - 1
            if 0 <= num < len(courses):
                supprime = courses.pop(num)
                print(f"{supprime} supprimé !")

    elif choix == "4":
        print("Au revoir !")
        break
\`\`\`

## Projet 4 : Gestionnaire de Notes

\`\`\`python
etudiants = []

def ajouter_etudiant():
    nom = input("Nom de l'étudiant: ")
    note = float(input("Note: "))
    etudiants.append({"nom": nom, "note": note})

def afficher_moyenne():
    if not etudiants:
        print("Aucun étudiant !")
        return
    moyenne = sum(e["note"] for e in etudiants) / len(etudiants)
    print(f"Moyenne de classe: {moyenne:.2f}")

def meilleur_etudiant():
    if not etudiants:
        print("Aucun étudiant !")
        return
    meilleur = max(etudiants, key=lambda x: x["note"])
    print(f"Meilleur: {meilleur['nom']} avec {meilleur['note']}/20")

while True:
    print("\\n1. Ajouter étudiant")
    print("2. Voir moyenne")
    print("3. Voir meilleur")
    print("4. Quitter")

    choix = input("Choix: ")

    if choix == "1":
        ajouter_etudiant()
    elif choix == "2":
        afficher_moyenne()
    elif choix == "3":
        meilleur_etudiant()
    elif choix == "4":
        break
\`\`\`

## Continuez votre parcours !

Félicitations pour avoir terminé ce cours. Vous avez maintenant les bases de Python !

**Prochaines étapes :**
- Python intermédiaire
- Django/Flask pour le web
- Pandas pour la data science
- Automatisation avec scripts
`,
                        content_en: 'Build real projects to consolidate your Python knowledge.',
                        content_ar: 'بناء مشاريع حقيقية لتوطيد معرفتك ببايثون.',
                    },
                ]
            }
        }
    });
    console.log('✅ Cours Python Novice ajouté avec succès.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
