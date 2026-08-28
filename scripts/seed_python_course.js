const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📚 Création du cours Python Complet...\n');

  // Create the Python course
  const course = await prisma.course.upsert({
    where: { slug: 'python-complet' },
    update: {},
    create: {
      id: 'course-python-complet',
      title: 'Python Complet : De Zéro à Expert',
      slug: 'python-complet',
      description: 'Maîtrisez Python de A à Z : des bases jusqu\'à la programmation avancée, en passant par l\'analyse de données et le développement web.',
      level: 'Tous niveaux',
      duration: '50h',
      price: 25000,
      isFree: false,
      isPublished: true,
      requirements: JSON.stringify([
        'Aucune expérience en programmation requise',
        'Un ordinateur avec accès internet',
        'Motivation pour apprendre'
      ]),
      learningOutcomes: JSON.stringify([
        'Maîtriser les fondamentaux de Python',
        'Créer des programmes complets et fonctionnels',
        'Utiliser Python pour l\'analyse de données',
        'Développer des applications web avec Flask/Django',
        'Comprendre la programmation orientée objet',
        'Manipuler des fichiers et des bases de données',
        'Créer des scripts d\'automatisation'
      ])
    }
  });

  console.log(`✅ Cours créé: ${course.title}`);

  // Lesson 1: Introduction à Python
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-1' },
    update: {},
    create: {
      id: 'lesson-py-complet-1',
      courseId: course.id,
      title: 'Introduction à Python et Installation',
      duration: 60,
      order: 1,
      content: `# Introduction à Python et Installation

## Pourquoi Python ?

Python est l'un des langages de programmation les plus populaires au monde. Il est utilisé dans :

- **Analyse de données** : NumPy, Pandas, Matplotlib
- **Intelligence artificielle** : TensorFlow, PyTorch, scikit-learn
- **Développement web** : Django, Flask, FastAPI
- **Automatisation** : Scripts, web scraping, task automation
- **Finance** : Analyse quantitative, trading algorithmique
- **Jeux vidéo** : Pygame, Unity (via IronPython)

## Avantages de Python

1. **Syntaxe claire et lisible** : Ressemble à du pseudo-code
2. **Versatile** : Applications web, data science, automation, etc.
3. **Grande communauté** : Bibliothèques riches et support actif
4. **Facile à apprendre** : Idéal pour les débutants
5. **Puissant** : Utilisé par Google, Netflix, NASA, Instagram

## Installation de Python

### Windows
\`\`\`bash
# Télécharger depuis python.org
# Cocher "Add Python to PATH" lors de l'installation
python --version
\`\`\`

### macOS
\`\`\`bash
# Utiliser Homebrew
brew install python3
python3 --version
\`\`\`

### Linux
\`\`\`bash
# Debian/Ubuntu
sudo apt update
sudo apt install python3 python3-pip
python3 --version
\`\`\`

## Premier programme Python

\`\`\`python
# hello.py
print("Bonjour le monde!")
print("Bienvenue dans le cours Python Complet")

# Commentaires : lignes précédées de #
# Python ignore les commentaires

# Afficher plusieurs lignes
print("Python est:")
print("- Facile")
print("- Puissant")
print("- Polyvalent")
\`\`\`

## L'interpréteur Python (REPL)

\`\`\`python
# Lancer l'interpréteur
$ python3

>>> print("Hello")
Hello
>>> 2 + 2
4
>>> exit()
\`\`\`

## Environnements virtuels

\`\`\`bash
# Créer un environnement virtuel
python3 -m venv mon_env

# Activer (Linux/macOS)
source mon_env/bin/activate

# Activer (Windows)
mon_env\\Scripts\\activate

# Installer des packages
pip install requests pandas

# Désactiver
deactivate
\`\`\`

## Exercices

1. Installez Python sur votre machine
2. Vérifiez la version avec \`python --version\`
3. Créez un fichier \`bonjour.py\` qui affiche votre nom
4. Créez un environnement virtuel et activez-le
5. Installez le package \`requests\` avec pip

## Resources

- [Documentation officielle Python](https://docs.python.org/fr/3/)
- [Python pour les débutants](https://www.python.org/about/gettingstarted/)
- [Visual Studio Code](https://code.visualstudio.com/) - Excellent éditeur pour Python`
    }
  });

  // Lesson 2: Variables et Types de Données
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-2' },
    update: {},
    create: {
      id: 'lesson-py-complet-2',
      courseId: course.id,
      title: 'Variables et Types de Données',
      duration: 90,
      order: 2,
      content: `# Variables et Types de Données

## Les Variables en Python

En Python, pas besoin de déclarer le type d'une variable. Python le déduit automatiquement.

\`\`\`python
# Création de variables
nom = "Alice"
age = 25
taille = 1.68
est_etudiant = True

print(nom)        # Alice
print(age)        # 25
print(taille)     # 1.68
print(est_etudiant)  # True

# Afficher le type d'une variable
print(type(nom))     # <class 'str'>
print(type(age))     # <class 'int'>
print(type(taille))  # <class 'float'>
\`\`\`

## Les Types de Données Fondamentaux

### 1. Nombres (Numbers)

\`\`\`python
# Entiers (int)
x = 10
y = -5
grand_nombre = 1_000_000  # Underscores pour la lisibilité

# Flottants (float)
pi = 3.14159
temperature = -15.5

# Opérations arithmétiques
a = 10 + 5   # 15 (addition)
b = 10 - 5   # 5  (soustraction)
c = 10 * 5   # 50 (multiplication)
d = 10 / 5   # 2.0 (division)
e = 10 // 3  # 3  (division entière)
f = 10 % 3   # 1  (modulo - reste)
g = 2 ** 3   # 8  (puissance)

# Fonctions mathématiques
print(abs(-5))      # 5 (valeur absolue)
print(round(3.7))   # 4 (arrondi)
print(max(5, 10))   # 10
print(min(5, 10))   # 5
\`\`\`

### 2. Chaînes de caractères (Strings)

\`\`\`python
# Différentes façons de créer des strings
nom = "Alice"
prenom = 'Bob'
message = """Ceci est
un texte
sur plusieurs lignes"""

# Concaténation
nom_complet = prenom + " " + nom  # "Bob Alice"

# Répétition
print("Ha" * 3)  # "HaHaHa"

# Indexation (commence à 0)
texte = "Python"
print(texte[0])   # "P"
print(texte[-1])  # "n" (dernier caractère)

# Slicing (découpage)
print(texte[0:3])   # "Pyt"
print(texte[2:])    # "thon"
print(texte[:4])    # "Pyth"

# Méthodes utiles
phrase = "  bonjour le monde  "
print(phrase.upper())       # "  BONJOUR LE MONDE  "
print(phrase.lower())       # "  bonjour le monde  "
print(phrase.strip())       # "bonjour le monde"
print(phrase.replace("monde", "Python"))  # "  bonjour le Python  "
print(phrase.split())       # ['bonjour', 'le', 'monde']

# F-strings (formatage moderne)
nom = "Alice"
age = 25
message = f"Je m'appelle {nom} et j'ai {age} ans"
print(message)  # "Je m'appelle Alice et j'ai 25 ans"

# Formatage avec calculs
prix = 19.99
print(f"Le prix est {prix * 1.2:.2f}€")  # "Le prix est 23.99€"
\`\`\`

### 3. Booléens (Booleans)

\`\`\`python
# Valeurs booléennes
vrai = True
faux = False

# Opérateurs de comparaison
print(5 > 3)    # True
print(5 < 3)    # False
print(5 == 5)   # True (égalité)
print(5 != 3)   # True (différent)
print(5 >= 5)   # True
print(5 <= 3)   # False

# Opérateurs logiques
a = True
b = False

print(a and b)  # False (ET logique)
print(a or b)   # True  (OU logique)
print(not a)    # False (NON logique)

# Valeurs "truthy" et "falsy"
# False : 0, 0.0, "", [], {}, None
# True : tout le reste

print(bool(0))        # False
print(bool(""))       # False
print(bool("Hello"))  # True
print(bool([1, 2]))   # True
\`\`\`

### 4. None (Valeur nulle)

\`\`\`python
# None représente l'absence de valeur
resultat = None
print(resultat)  # None
print(type(resultat))  # <class 'NoneType'>

# Vérifier si une variable est None
if resultat is None:
    print("Aucun résultat")
\`\`\`

## Conversion de Types (Type Casting)

\`\`\`python
# String vers int/float
age_str = "25"
age_int = int(age_str)
print(age_int + 5)  # 30

prix_str = "19.99"
prix_float = float(prix_str)
print(prix_float * 2)  # 39.98

# Int/float vers string
nombre = 42
texte = str(nombre)
print("Le nombre est " + texte)  # "Le nombre est 42"

# Attention aux erreurs de conversion
try:
    nombre = int("abc")  # ValueError!
except ValueError:
    print("Conversion impossible")
\`\`\`

## Input : Lire des données de l'utilisateur

\`\`\`python
# input() retourne toujours une string
nom = input("Entrez votre nom: ")
print(f"Bonjour {nom}!")

# Convertir l'input en nombre
age_str = input("Entrez votre âge: ")
age = int(age_str)
print(f"Dans 10 ans, vous aurez {age + 10} ans")

# Version courte
age = int(input("Entrez votre âge: "))
\`\`\`

## Exercices

1. Créez un programme qui calcule l'aire d'un rectangle (longueur × largeur)
2. Demandez à l'utilisateur son nom et son âge, puis affichez un message personnalisé
3. Convertissez une température de Celsius en Fahrenheit : F = C × 9/5 + 32
4. Créez une calculatrice simple qui demande deux nombres et affiche leur somme
5. Inversez une chaîne de caractères (ex: "Python" → "nohtyP")

## Points Clés

- Python est **dynamiquement typé** : pas besoin de déclarer les types
- Utilisez des **noms de variables descriptifs** : \`age_utilisateur\` plutôt que \`x\`
- Les **F-strings** sont la meilleure façon de formater des strings
- Attention aux **conversions de types** avec input()
- **None** représente l'absence de valeur`
    }
  });

  // Lesson 3: Structures de Contrôle
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-3' },
    update: {},
    create: {
      id: 'lesson-py-complet-3',
      courseId: course.id,
      title: 'Structures de Contrôle : if, elif, else',
      duration: 75,
      order: 3,
      content: `# Structures de Contrôle : Conditions

## L'instruction if

\`\`\`python
# Syntaxe de base
age = 18

if age >= 18:
    print("Vous êtes majeur")
    print("Vous pouvez voter")

# L'indentation est OBLIGATOIRE en Python
# 4 espaces (ou 1 tab) pour définir un bloc
\`\`\`

## if-else

\`\`\`python
age = 15

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")
    print(f"Plus que {18 - age} ans avant la majorité")
\`\`\`

## if-elif-else

\`\`\`python
note = 85

if note >= 90:
    mention = "Excellent"
elif note >= 80:
    mention = "Très bien"
elif note >= 70:
    mention = "Bien"
elif note >= 60:
    mention = "Assez bien"
else:
    mention = "Insuffisant"

print(f"Votre mention: {mention}")
\`\`\`

## Conditions Multiples

\`\`\`python
age = 25
a_permis = True

# Opérateur AND
if age >= 18 and a_permis:
    print("Vous pouvez conduire")

# Opérateur OR
jour = "samedi"
if jour == "samedi" or jour == "dimanche":
    print("C'est le week-end!")

# Opérateur NOT
pluie = False
if not pluie:
    print("Pas besoin de parapluie")

# Combinaison complexe
temperature = 22
ensoleille = True

if temperature > 20 and (ensoleille or not pluie):
    print("Bonne journée pour sortir!")
\`\`\`

## Opérateurs de Comparaison

\`\`\`python
x = 5
y = 10

# Comparaisons
print(x == y)   # False (égal)
print(x != y)   # True  (différent)
print(x < y)    # True  (inférieur)
print(x > y)    # False (supérieur)
print(x <= 5)   # True  (inférieur ou égal)
print(y >= 10)  # True  (supérieur ou égal)

# Comparaison de strings
print("abc" < "xyz")  # True (ordre alphabétique)
print("Python" == "python")  # False (sensible à la casse)

# Opérateur in
print("a" in "Python")  # False
print("th" in "Python")  # True

fruits = ["pomme", "banane", "orange"]
print("pomme" in fruits)  # True
\`\`\`

## Conditions Ternaires (One-liner)

\`\`\`python
# Syntaxe: valeur_si_vrai if condition else valeur_si_faux
age = 20
statut = "majeur" if age >= 18 else "mineur"
print(statut)  # "majeur"

# Exemple pratique
prix = 100
reduction = 0.2 if prix > 50 else 0
prix_final = prix * (1 - reduction)
print(f"Prix final: {prix_final}€")  # 80€
\`\`\`

## Valeurs Truthy et Falsy

\`\`\`python
# Ces valeurs sont considérées comme False
valeurs_false = [False, 0, 0.0, "", [], {}, None]

# Tout le reste est True
if []:
    print("Ne s'affiche pas")
else:
    print("Liste vide = False")

if [1, 2, 3]:
    print("Liste non vide = True")

# Vérifier si une string est vide
nom = input("Entrez votre nom: ")
if nom:
    print(f"Bonjour {nom}")
else:
    print("Vous n'avez pas entré de nom")
\`\`\`

## Match-Case (Python 3.10+)

\`\`\`python
# Alternative moderne à if-elif-else
jour = "lundi"

match jour:
    case "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi":
        print("Jour de travail")
    case "samedi" | "dimanche":
        print("Week-end!")
    case _:
        print("Jour invalide")

# Avec patterns
code_http = 404

match code_http:
    case 200:
        print("OK")
    case 404:
        print("Non trouvé")
    case 500:
        print("Erreur serveur")
    case _ if code_http >= 400:
        print("Erreur client")
    case _:
        print("Autre code")
\`\`\`

## Exemples Pratiques

### Calculatrice simple
\`\`\`python
a = float(input("Nombre 1: "))
b = float(input("Nombre 2: "))
op = input("Opération (+, -, *, /): ")

if op == "+":
    resultat = a + b
elif op == "-":
    resultat = a - b
elif op == "*":
    resultat = a * b
elif op == "/":
    if b != 0:
        resultat = a / b
    else:
        resultat = "Division par zéro impossible"
else:
    resultat = "Opération invalide"

print(f"Résultat: {resultat}")
\`\`\`

### Vérification de mot de passe
\`\`\`python
mot_de_passe = input("Entrez un mot de passe: ")

# Vérifications
assez_long = len(mot_de_passe) >= 8
a_chiffre = any(c.isdigit() for c in mot_de_passe)
a_majuscule = any(c.isupper() for c in mot_de_passe)

if assez_long and a_chiffre and a_majuscule:
    print("✓ Mot de passe fort")
elif assez_long:
    print("⚠ Ajoutez un chiffre et une majuscule")
else:
    print("✗ Mot de passe trop court (min 8 caractères)")
\`\`\`

### Calculateur d'IMC
\`\`\`python
poids = float(input("Poids (kg): "))
taille = float(input("Taille (m): "))

imc = poids / (taille ** 2)

if imc < 18.5:
    categorie = "Insuffisance pondérale"
elif imc < 25:
    categorie = "Poids normal"
elif imc < 30:
    categorie = "Surpoids"
else:
    categorie = "Obésité"

print(f"IMC: {imc:.2f} - {categorie}")
\`\`\`

## Exercices

1. **Pair ou impair** : Programme qui indique si un nombre est pair ou impair
2. **Année bissextile** : Vérifiez si une année est bissextile (divisible par 4, sauf si divisible par 100, sauf si divisible par 400)
3. **Notes** : Convertir une note sur 100 en lettre (A, B, C, D, F)
4. **Triangle** : Déterminer le type de triangle (équilatéral, isocèle, scalène) à partir de 3 côtés
5. **Calculateur de taxes** : Calculer le prix TTC avec différents taux selon la catégorie du produit

## Points Clés

- L'**indentation** définit les blocs de code (4 espaces)
- Utilisez **elif** pour des conditions multiples (pas "else if")
- Les **opérateurs logiques** sont \`and\`, \`or\`, \`not\` (pas &&, ||, !)
- **Match-case** est disponible depuis Python 3.10
- Préférez la **lisibilité** à la concision`
    }
  });

  // Lesson 4: Boucles
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-4' },
    update: {},
    create: {
      id: 'lesson-py-complet-4',
      courseId: course.id,
      title: 'Boucles : for et while',
      duration: 90,
      order: 4,
      content: `# Boucles : for et while

## La Boucle for

La boucle \`for\` en Python itère sur une séquence (liste, string, range, etc.)

\`\`\`python
# Itérer sur une liste
fruits = ["pomme", "banane", "orange"]

for fruit in fruits:
    print(f"J'aime les {fruit}s")

# Output:
# J'aime les pommes
# J'aime les bananes
# J'aime les oranges
\`\`\`

### La fonction range()

\`\`\`python
# range(stop) : de 0 à stop-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop) : de start à stop-1
for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

# range(start, stop, step) : avec un pas
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Range décroissant
for i in range(10, 0, -1):
    print(i)  # 10, 9, 8, ..., 1
\`\`\`

### Itérer sur des Strings

\`\`\`python
mot = "Python"

for lettre in mot:
    print(lettre)
# P
# y
# t
# h
# o
# n

# Avec index
for i, lettre in enumerate(mot):
    print(f"Index {i}: {lettre}")
\`\`\`

### Itérer sur des Dictionnaires

\`\`\`python
etudiant = {
    "nom": "Alice",
    "age": 22,
    "ville": "Paris"
}

# Itérer sur les clés
for cle in etudiant:
    print(cle)

# Itérer sur les valeurs
for valeur in etudiant.values():
    print(valeur)

# Itérer sur clés et valeurs
for cle, valeur in etudiant.items():
    print(f"{cle}: {valeur}")
\`\`\`

## La Boucle while

La boucle \`while\` s'exécute tant qu'une condition est vraie.

\`\`\`python
# Compter jusqu'à 5
compteur = 1

while compteur <= 5:
    print(compteur)
    compteur += 1  # Incrémentation

# Output: 1, 2, 3, 4, 5
\`\`\`

### Boucles Infinies (à éviter!)

\`\`\`python
# ⚠️ ATTENTION : Boucle infinie
# while True:
#     print("À l'infini...")

# Solution : ajouter une condition de sortie
compteur = 0
while True:
    print(compteur)
    compteur += 1
    if compteur >= 10:
        break  # Sort de la boucle
\`\`\`

### Input avec Validation

\`\`\`python
# Demander un nombre positif
while True:
    nombre = int(input("Entrez un nombre positif: "))
    if nombre > 0:
        break
    print("Erreur! Le nombre doit être positif.")

print(f"Vous avez entré: {nombre}")
\`\`\`

## break et continue

### break : Sortir de la boucle

\`\`\`python
# Chercher un nombre dans une liste
nombres = [3, 7, 12, 8, 15]
cible = 12

for nombre in nombres:
    if nombre == cible:
        print(f"Trouvé! {nombre}")
        break
    print(f"Pas encore... {nombre}")

# Output:
# Pas encore... 3
# Pas encore... 7
# Trouvé! 12
\`\`\`

### continue : Passer à l'itération suivante

\`\`\`python
# Afficher seulement les nombres impairs
for i in range(10):
    if i % 2 == 0:  # Si pair
        continue    # Passer au suivant
    print(i)

# Output: 1, 3, 5, 7, 9
\`\`\`

## Boucles Imbriquées

\`\`\`python
# Table de multiplication
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i} × {j} = {i*j}")
    print()  # Ligne vide entre les tables

# Créer une grille
for ligne in range(3):
    for colonne in range(4):
        print(f"[{ligne},{colonne}]", end=" ")
    print()  # Nouvelle ligne

# Output:
# [0,0] [0,1] [0,2] [0,3]
# [1,0] [1,1] [1,2] [1,3]
# [2,0] [2,1] [2,2] [2,3]
\`\`\`

## Compréhensions de Listes

Alternative concise aux boucles pour créer des listes.

\`\`\`python
# Méthode traditionnelle
carres = []
for i in range(10):
    carres.append(i ** 2)

# Avec list comprehension
carres = [i ** 2 for i in range(10)]
print(carres)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Avec condition
pairs = [i for i in range(20) if i % 2 == 0]
print(pairs)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transformer des strings
mots = ["python", "java", "c++"]
majuscules = [mot.upper() for mot in mots]
print(majuscules)  # ['PYTHON', 'JAVA', 'C++']
\`\`\`

## Exemples Pratiques

### Somme de nombres
\`\`\`python
nombres = [12, 45, 23, 67, 34]
somme = 0

for nombre in nombres:
    somme += nombre

print(f"Somme: {somme}")  # 181

# Ou simplement
print(sum(nombres))  # 181
\`\`\`

### Factorielle
\`\`\`python
n = 5
factorielle = 1

for i in range(1, n + 1):
    factorielle *= i

print(f"{n}! = {factorielle}")  # 5! = 120
\`\`\`

### Nombre premier
\`\`\`python
nombre = 17
est_premier = True

if nombre < 2:
    est_premier = False
else:
    for i in range(2, int(nombre ** 0.5) + 1):
        if nombre % i == 0:
            est_premier = False
            break

if est_premier:
    print(f"{nombre} est premier")
else:
    print(f"{nombre} n'est pas premier")
\`\`\`

### FizzBuzz
\`\`\`python
# Classique des interviews
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
\`\`\`

### Menu interactif
\`\`\`python
while True:
    print("\\n=== MENU ===")
    print("1. Option 1")
    print("2. Option 2")
    print("3. Quitter")

    choix = input("Votre choix: ")

    if choix == "1":
        print("Vous avez choisi l'option 1")
    elif choix == "2":
        print("Vous avez choisi l'option 2")
    elif choix == "3":
        print("Au revoir!")
        break
    else:
        print("Choix invalide")
\`\`\`

## Exercices

1. **Suite de Fibonacci** : Générer les 20 premiers nombres de Fibonacci
2. **Pyramide d'étoiles** : Afficher une pyramide avec n lignes
   \`\`\`
   *
   **
   ***
   ****
   \`\`\`
3. **Moyenne de notes** : Demander des notes jusqu'à ce que l'utilisateur entre -1, puis calculer la moyenne
4. **Deviner un nombre** : L'ordinateur choisit un nombre aléatoire, l'utilisateur devine
5. **Compter les voyelles** : Compter le nombre de voyelles dans un texte
6. **Table de multiplication** : Afficher la table de multiplication de 1 à 10

## Points Clés

- **for** : Itérer sur une séquence connue
- **while** : Répéter tant qu'une condition est vraie
- **range()** : Générer une séquence de nombres
- **break** : Sortir de la boucle
- **continue** : Passer à l'itération suivante
- **List comprehension** : Créer des listes de manière concise
- Attention aux **boucles infinies**!`
    }
  });

  // Lesson 5: Fonctions
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-5' },
    update: {},
    create: {
      id: 'lesson-py-complet-5',
      courseId: course.id,
      title: 'Fonctions',
      duration: 100,
      order: 5,
      content: `# Fonctions en Python

## Pourquoi les Fonctions ?

Les fonctions permettent de :
- **Réutiliser** du code
- **Organiser** le code en blocs logiques
- **Éviter la répétition** (DRY : Don't Repeat Yourself)
- **Faciliter la maintenance** et le débogage

## Définir une Fonction

\`\`\`python
# Syntaxe de base
def saluer():
    print("Bonjour!")
    print("Bienvenue en Python")

# Appeler la fonction
saluer()
# Output:
# Bonjour!
# Bienvenue en Python
\`\`\`

## Fonctions avec Paramètres

\`\`\`python
# Fonction avec un paramètre
def saluer_personne(nom):
    print(f"Bonjour {nom}!")

saluer_personne("Alice")  # Bonjour Alice!
saluer_personne("Bob")    # Bonjour Bob!

# Fonction avec plusieurs paramètres
def calculer_rectangle(longueur, largeur):
    aire = longueur * largeur
    perimetre = 2 * (longueur + largeur)
    print(f"Aire: {aire}")
    print(f"Périmètre: {perimetre}")

calculer_rectangle(5, 3)
# Aire: 15
# Périmètre: 16
\`\`\`

## Valeur de Retour

\`\`\`python
# Fonction qui retourne une valeur
def additionner(a, b):
    somme = a + b
    return somme

resultat = additionner(5, 3)
print(resultat)  # 8

# Return multiple
def calculer_cercle(rayon):
    pi = 3.14159
    aire = pi * rayon ** 2
    circonference = 2 * pi * rayon
    return aire, circonference  # Retourne un tuple

a, c = calculer_cercle(5)
print(f"Aire: {a:.2f}, Circonférence: {c:.2f}")
\`\`\`

## Paramètres par Défaut

\`\`\`python
# Valeur par défaut si non fournie
def saluer(nom, salutation="Bonjour"):
    print(f"{salutation} {nom}!")

saluer("Alice")              # Bonjour Alice!
saluer("Bob", "Salut")       # Salut Bob!
saluer("Charlie", "Hey")     # Hey Charlie!

# Attention : les valeurs par défaut sont évaluées une seule fois
def ajouter_element(element, liste=[]):  # ⚠️ Erreur!
    liste.append(element)
    return liste

# Bonne pratique
def ajouter_element(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste
\`\`\`

## Arguments Nommés (Keyword Arguments)

\`\`\`python
def creer_profil(nom, age, ville="Paris"):
    print(f"{nom}, {age} ans, vit à {ville}")

# Arguments positionnels
creer_profil("Alice", 25)

# Arguments nommés (ordre n'a pas d'importance)
creer_profil(age=30, nom="Bob", ville="Lyon")
creer_profil(nom="Charlie", ville="Marseille", age=28)
\`\`\`

## *args et **kwargs

\`\`\`python
# *args : nombre variable d'arguments positionnels
def somme(*nombres):
    total = 0
    for n in nombres:
        total += n
    return total

print(somme(1, 2, 3))           # 6
print(somme(1, 2, 3, 4, 5))     # 15
print(somme(10))                # 10

# **kwargs : nombre variable d'arguments nommés
def afficher_infos(**infos):
    for cle, valeur in infos.items():
        print(f"{cle}: {valeur}")

afficher_infos(nom="Alice", age=25, ville="Paris")
# nom: Alice
# age: 25
# ville: Paris

# Combinaison
def fonction_complete(arg_requis, *args, defaut="valeur", **kwargs):
    print(f"Requis: {arg_requis}")
    print(f"Args: {args}")
    print(f"Défaut: {defaut}")
    print(f"Kwargs: {kwargs}")

fonction_complete(1, 2, 3, defaut="custom", a=10, b=20)
\`\`\`

## Fonctions Lambda (Anonymes)

\`\`\`python
# Syntaxe : lambda arguments: expression
carre = lambda x: x ** 2
print(carre(5))  # 25

# Équivalent avec def
def carre(x):
    return x ** 2

# Lambda avec plusieurs arguments
addition = lambda a, b: a + b
print(addition(3, 7))  # 10

# Utilisation avec sorted, map, filter
etudiants = [
    {"nom": "Alice", "note": 85},
    {"nom": "Bob", "note": 92},
    {"nom": "Charlie", "note": 78}
]

# Trier par note
tries = sorted(etudiants, key=lambda e: e["note"], reverse=True)
print(tries[0]["nom"])  # Bob
\`\`\`

## Fonctions map(), filter(), reduce()

\`\`\`python
# map() : appliquer une fonction à chaque élément
nombres = [1, 2, 3, 4, 5]
carres = list(map(lambda x: x ** 2, nombres))
print(carres)  # [1, 4, 9, 16, 25]

# filter() : filtrer les éléments
pairs = list(filter(lambda x: x % 2 == 0, nombres))
print(pairs)  # [2, 4]

# reduce() : réduire à une seule valeur
from functools import reduce
produit = reduce(lambda x, y: x * y, nombres)
print(produit)  # 120 (1*2*3*4*5)
\`\`\`

## Scope (Portée) des Variables

\`\`\`python
# Variable globale
x = 10

def fonction():
    # Variable locale
    y = 5
    print(f"x (global): {x}")
    print(f"y (local): {y}")

fonction()
# print(y)  # NameError: y n'existe pas ici

# Modifier une variable globale
compteur = 0

def incrementer():
    global compteur  # Déclarer comme globale
    compteur += 1

incrementer()
print(compteur)  # 1

# Éviter global : utiliser return
def incrementer(valeur):
    return valeur + 1

compteur = incrementer(compteur)
\`\`\`

## Docstrings (Documentation)

\`\`\`python
def calculer_imc(poids, taille):
    """
    Calcule l'Indice de Masse Corporelle.

    Args:
        poids (float): Poids en kilogrammes
        taille (float): Taille en mètres

    Returns:
        float: IMC arrondi à 2 décimales

    Example:
        >>> calculer_imc(70, 1.75)
        22.86
    """
    imc = poids / (taille ** 2)
    return round(imc, 2)

# Afficher la documentation
print(calculer_imc.__doc__)
help(calculer_imc)
\`\`\`

## Fonctions Récursives

\`\`\`python
# Fonction qui s'appelle elle-même
def factorielle(n):
    if n == 0 or n == 1:  # Cas de base
        return 1
    else:
        return n * factorielle(n - 1)  # Appel récursif

print(factorielle(5))  # 120

# Fibonacci récursif
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print([fibonacci(i) for i in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

## Décorateurs (Avancé)

\`\`\`python
# Décorateur : fonction qui modifie une autre fonction
def chronometrer(fonction):
    import time
    def wrapper(*args, **kwargs):
        debut = time.time()
        resultat = fonction(*args, **kwargs)
        fin = time.time()
        print(f"Temps: {fin - debut:.4f}s")
        return resultat
    return wrapper

@chronometrer
def calcul_lent():
    total = 0
    for i in range(1000000):
        total += i
    return total

calcul_lent()  # Affiche le temps d'exécution
\`\`\`

## Exemples Pratiques

### Validateur d'email
\`\`\`python
def est_email_valide(email):
    """Vérifie si un email est valide (simple)"""
    if "@" not in email:
        return False
    if email.count("@") != 1:
        return False
    local, domaine = email.split("@")
    if not local or not domaine:
        return False
    if "." not in domaine:
        return False
    return True

print(est_email_valide("user@example.com"))  # True
print(est_email_valide("invalid.email"))     # False
\`\`\`

### Générateur de mot de passe
\`\`\`python
import random
import string

def generer_mot_de_passe(longueur=12):
    """Génère un mot de passe aléatoire"""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    mot_de_passe = ''.join(random.choice(caracteres) for _ in range(longueur))
    return mot_de_passe

print(generer_mot_de_passe())
print(generer_mot_de_passe(20))
\`\`\`

## Exercices

1. **Convertisseur de température** : Créer des fonctions celsius_vers_fahrenheit() et l'inverse
2. **Nombre premier** : Fonction qui vérifie si un nombre est premier
3. **Palindrome** : Fonction qui vérifie si un mot est un palindrome
4. **Statistiques** : Fonction qui prend une liste de nombres et retourne min, max, moyenne
5. **FizzBuzz fonction** : Créer une fonction fizzbuzz(n) qui retourne "Fizz", "Buzz", "FizzBuzz" ou le nombre
6. **Calculatrice** : Créer 4 fonctions (addition, soustraction, multiplication, division)

## Points Clés

- Une fonction = un bloc de code réutilisable
- **def** pour définir, **return** pour retourner une valeur
- Paramètres **positionnels** et **nommés**
- ***args** pour arguments variables, ****kwargs** pour arguments nommés variables
- **Lambda** pour fonctions simples sur une ligne
- **Docstrings** pour documenter vos fonctions
- Évitez l'abus de **global**`
    }
  });

  // Lesson 6: Listes et Tuples
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-6' },
    update: {},
    create: {
      id: 'lesson-py-complet-6',
      courseId: course.id,
      title: 'Listes et Tuples',
      duration: 90,
      order: 6,
      content: `# Listes et Tuples

## Les Listes

Les listes sont des collections **ordonnées** et **modifiables** d'éléments.

\`\`\`python
# Créer une liste
fruits = ["pomme", "banane", "orange"]
nombres = [1, 2, 3, 4, 5]
mixte = [1, "texte", 3.14, True, [1, 2]]

# Liste vide
vide = []
vide2 = list()

print(fruits)  # ['pomme', 'banane', 'orange']
print(len(fruits))  # 3
\`\`\`

### Accéder aux Éléments

\`\`\`python
fruits = ["pomme", "banane", "orange", "kiwi", "mangue"]

# Indexation (commence à 0)
print(fruits[0])   # pomme
print(fruits[2])   # orange
print(fruits[-1])  # mangue (dernier)
print(fruits[-2])  # kiwi (avant-dernier)

# Slicing (découpage)
print(fruits[1:3])    # ['banane', 'orange']
print(fruits[:2])     # ['pomme', 'banane']
print(fruits[2:])     # ['orange', 'kiwi', 'mangue']
print(fruits[::2])    # ['pomme', 'orange', 'mangue'] (pas de 2)
print(fruits[::-1])   # Liste inversée
\`\`\`

### Modifier une Liste

\`\`\`python
fruits = ["pomme", "banane", "orange"]

# Modifier un élément
fruits[1] = "fraise"
print(fruits)  # ['pomme', 'fraise', 'orange']

# Ajouter à la fin
fruits.append("kiwi")
print(fruits)  # ['pomme', 'fraise', 'orange', 'kiwi']

# Insérer à une position
fruits.insert(1, "poire")
print(fruits)  # ['pomme', 'poire', 'fraise', 'orange', 'kiwi']

# Étendre avec une autre liste
fruits.extend(["mangue", "ananas"])
print(fruits)

# Supprimer un élément
fruits.remove("fraise")  # Supprime la première occurrence
print(fruits)

# Supprimer par index
del fruits[0]
element = fruits.pop()  # Supprime et retourne le dernier
element = fruits.pop(0)  # Supprime et retourne l'index 0

# Vider la liste
fruits.clear()
\`\`\`

### Méthodes Utiles

\`\`\`python
nombres = [3, 1, 4, 1, 5, 9, 2, 6]

# Trier
nombres.sort()
print(nombres)  # [1, 1, 2, 3, 4, 5, 6, 9]

nombres.sort(reverse=True)
print(nombres)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Nouvelle liste triée (sans modifier l'originale)
originale = [3, 1, 4]
triee = sorted(originale)
print(originale)  # [3, 1, 4]
print(triee)      # [1, 3, 4]

# Inverser
nombres.reverse()

# Compter occurrences
print(nombres.count(1))  # 2

# Trouver l'index
print(nombres.index(5))  # Index de la première occurrence de 5

# Copier
copie = nombres.copy()
copie2 = nombres[:]  # Autre méthode
\`\`\`

### Opérations sur Listes

\`\`\`python
# Concaténation
liste1 = [1, 2, 3]
liste2 = [4, 5, 6]
liste3 = liste1 + liste2  # [1, 2, 3, 4, 5, 6]

# Répétition
liste = [0] * 5  # [0, 0, 0, 0, 0]

# Vérifier l'appartenance
fruits = ["pomme", "banane", "orange"]
print("pomme" in fruits)      # True
print("kiwi" not in fruits)   # True

# Min, Max, Sum (pour nombres)
nombres = [3, 7, 1, 9, 2]
print(min(nombres))  # 1
print(max(nombres))  # 9
print(sum(nombres))  # 22
\`\`\`

### List Comprehensions

\`\`\`python
# Créer une liste avec une expression
carres = [x ** 2 for x in range(10)]
print(carres)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Avec condition
pairs = [x for x in range(20) if x % 2 == 0]
print(pairs)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transformation
mots = ["python", "java", "c++"]
majuscules = [mot.upper() for mot in mots]
print(majuscules)  # ['PYTHON', 'JAVA', 'C++']

# if-else dans comprehension
nombres = [1, 2, 3, 4, 5]
resultat = ["pair" if x % 2 == 0 else "impair" for x in nombres]
print(resultat)  # ['impair', 'pair', 'impair', 'pair', 'impair']

# Nested comprehension
matrice = [[i*j for j in range(3)] for i in range(3)]
print(matrice)  # [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
\`\`\`

## Les Tuples

Les tuples sont des collections **ordonnées** mais **non modifiables** (immutables).

\`\`\`python
# Créer un tuple
coordonnees = (10, 20)
fruits = ("pomme", "banane", "orange")
mixte = (1, "texte", 3.14, True)

# Tuple d'un seul élément (virgule obligatoire!)
un_element = (5,)  # Tuple
pas_tuple = (5)    # Int

# Tuple vide
vide = ()
vide2 = tuple()

print(coordonnees)  # (10, 20)
print(len(fruits))  # 3
\`\`\`

### Accéder aux Éléments

\`\`\`python
point = (10, 20, 30)

# Indexation
print(point[0])   # 10
print(point[-1])  # 30

# Slicing
print(point[1:])  # (20, 30)

# Unpacking
x, y, z = point
print(x, y, z)  # 10 20 30

# Unpacking partiel
first, *rest = (1, 2, 3, 4, 5)
print(first)  # 1
print(rest)   # [2, 3, 4, 5]
\`\`\`

### Opérations sur Tuples

\`\`\`python
# Concaténation
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
tuple3 = tuple1 + tuple2  # (1, 2, 3, 4, 5, 6)

# Répétition
tuple_rep = (0,) * 5  # (0, 0, 0, 0, 0)

# Appartenance
print(2 in tuple1)  # True

# Méthodes
tuple_val = (1, 2, 2, 3, 2, 4)
print(tuple_val.count(2))  # 3
print(tuple_val.index(3))  # 3
\`\`\`

### Pourquoi Utiliser des Tuples ?

\`\`\`python
# 1. Performance (plus rapides que les listes)
# 2. Protection contre modification
CONSTANTES = (3.14159, 2.71828)

# 3. Clés de dictionnaire (tuples immuables)
positions = {
    (0, 0): "origine",
    (1, 0): "droite",
    (0, 1): "haut"
}

# 4. Retour multiple de fonctions
def min_max(liste):
    return min(liste), max(liste)

minimum, maximum = min_max([3, 7, 1, 9, 2])
\`\`\`

## Listes vs Tuples

| Caractéristique | Liste | Tuple |
|----------------|-------|-------|
| Syntaxe | \`[1, 2, 3]\` | \`(1, 2, 3)\` |
| Modifiable | Oui | Non |
| Performance | Moins rapide | Plus rapide |
| Méthodes | Nombreuses | Limitées |
| Usage | Données changeantes | Données fixes |

## Exemples Pratiques

### To-Do List
\`\`\`python
taches = []

def ajouter_tache(tache):
    taches.append(tache)
    print(f"✓ Ajouté: {tache}")

def afficher_taches():
    print("\\n=== TÂCHES ===")
    for i, tache in enumerate(taches, 1):
        print(f"{i}. {tache}")

def supprimer_tache(index):
    if 0 <= index < len(taches):
        tache = taches.pop(index)
        print(f"✗ Supprimé: {tache}")

ajouter_tache("Apprendre Python")
ajouter_tache("Faire les courses")
afficher_taches()
supprimer_tache(0)
afficher_taches()
\`\`\`

### Statistiques
\`\`\`python
def statistiques(nombres):
    if not nombres:
        return None

    return {
        "min": min(nombres),
        "max": max(nombres),
        "moyenne": sum(nombres) / len(nombres),
        "total": sum(nombres),
        "compte": len(nombres)
    }

notes = [85, 92, 78, 90, 88]
stats = statistiques(notes)
print(f"Moyenne: {stats['moyenne']:.2f}")
print(f"Min: {stats['min']}, Max: {stats['max']}")
\`\`\`

### Filtrer et transformer
\`\`\`python
# Filtrer les nombres pairs et les doubler
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pairs_doubles = [x * 2 for x in nombres if x % 2 == 0]
print(pairs_doubles)  # [4, 8, 12, 16, 20]

# Extraire les mots de plus de 3 lettres
mots = ["le", "chat", "est", "sur", "la", "table"]
longs = [mot for mot in mots if len(mot) > 3]
print(longs)  # ['chat', 'table']
\`\`\`

## Exercices

1. **Somme cumulative** : \`[1, 2, 3, 4]\` → \`[1, 3, 6, 10]\`
2. **Supprimer les doublons** : Créer une liste sans doublons
3. **Intersection** : Trouver les éléments communs entre deux listes
4. **Rotation** : Faire une rotation d'une liste (\`[1,2,3,4]\` → \`[4,1,2,3]\`)
5. **Fusionner et trier** : Fusionner deux listes triées en gardant l'ordre
6. **Flatten** : Aplatir une liste imbriquée \`[[1,2],[3,4]]\` → \`[1,2,3,4]\`

## Points Clés

- **Listes** : modifiables, crochets \`[]\`
- **Tuples** : immuables, parenthèses \`()\`
- **Indexation** commence à 0
- **Slicing** : \`liste[start:stop:step]\`
- **List comprehension** : concise et efficace
- **Unpacking** : pratique pour assigner plusieurs variables`
    }
  });

  // Continue with remaining lessons...
  // I'll add lessons 7-12 to complete the course

  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-7' },
    update: {},
    create: {
      id: 'lesson-py-complet-7',
      courseId: course.id,
      title: 'Dictionnaires et Sets',
      duration: 85,
      order: 7,
      content: `# Dictionnaires et Sets

## Les Dictionnaires

Les dictionnaires stockent des paires **clé-valeur**. Très utilisés en Python!

\`\`\`python
# Créer un dictionnaire
etudiant = {
    "nom": "Alice",
    "age": 22,
    "ville": "Paris",
    "notes": [85, 90, 78]
}

# Dictionnaire vide
vide = {}
vide2 = dict()

print(etudiant)
print(type(etudiant))  # <class 'dict'>
\`\`\`

### Accéder aux Valeurs

\`\`\`python
# Accès par clé
print(etudiant["nom"])  # Alice
print(etudiant["age"])  # 22

# Méthode get() (plus sûre)
print(etudiant.get("nom"))        # Alice
print(etudiant.get("email"))      # None
print(etudiant.get("email", "Non renseigné"))  # Non renseigné

# Vérifier l'existence d'une clé
if "email" in etudiant:
    print(etudiant["email"])
else:
    print("Email non disponible")
\`\`\`

### Modifier un Dictionnaire

\`\`\`python
etudiant = {"nom": "Alice", "age": 22}

# Ajouter/modifier une clé
etudiant["ville"] = "Paris"
etudiant["age"] = 23

# Supprimer une clé
del etudiant["ville"]

# Pop : supprimer et retourner
age = etudiant.pop("age")  # Retourne 23
default = etudiant.pop("email", "N/A")  # Retourne "N/A"

# Clear : vider le dictionnaire
etudiant.clear()
\`\`\`

### Méthodes Utiles

\`\`\`python
personne = {
    "nom": "Bob",
    "age": 30,
    "ville": "Lyon"
}

# Obtenir toutes les clés
print(personne.keys())  # dict_keys(['nom', 'age', 'ville'])
print(list(personne.keys()))  # ['nom', 'age', 'ville']

# Obtenir toutes les valeurs
print(personne.values())  # dict_values(['Bob', 30, 'Lyon'])

# Obtenir les paires clé-valeur
print(personne.items())
# dict_items([('nom', 'Bob'), ('age', 30), ('ville', 'Lyon')])

# Update : fusionner des dictionnaires
personne.update({"email": "bob@example.com", "age": 31})
print(personne)

# Copier
copie = personne.copy()
\`\`\`

### Itérer sur un Dictionnaire

\`\`\`python
scores = {"Alice": 85, "Bob": 92, "Charlie": 78}

# Itérer sur les clés
for nom in scores:
    print(nom)

# Itérer sur les valeurs
for score in scores.values():
    print(score)

# Itérer sur clés et valeurs
for nom, score in scores.items():
    print(f"{nom}: {score}")
\`\`\`

### Dictionary Comprehension

\`\`\`python
# Créer un dictionnaire avec comprehension
carres = {x: x**2 for x in range(6)}
print(carres)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Avec condition
pairs = {x: x**2 for x in range(10) if x % 2 == 0}
print(pairs)  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Inverser clés et valeurs
original = {"a": 1, "b": 2, "c": 3}
inverse = {v: k for k, v in original.items()}
print(inverse)  # {1: 'a', 2: 'b', 3: 'c'}
\`\`\`

### Dictionnaires Imbriqués

\`\`\`python
etudiants = {
    "etud1": {
        "nom": "Alice",
        "notes": [85, 90, 78]
    },
    "etud2": {
        "nom": "Bob",
        "notes": [92, 88, 95]
    }
}

# Accéder aux données imbriquées
print(etudiants["etud1"]["nom"])  # Alice
print(etudiants["etud2"]["notes"][0])  # 92

# Itérer
for id_etud, infos in etudiants.items():
    print(f"{id_etud}: {infos['nom']}")
    print(f"  Moyenne: {sum(infos['notes']) / len(infos['notes'])}")
\`\`\`

## Les Sets (Ensembles)

Les sets sont des collections **non ordonnées** d'éléments **uniques**.

\`\`\`python
# Créer un set
fruits = {"pomme", "banane", "orange"}
nombres = {1, 2, 3, 4, 5}

# Set vide (attention!)
vide = set()  # Correct
# vide = {}   # Ceci crée un dict!

print(fruits)  # {'orange', 'pomme', 'banane'} (ordre aléatoire)
print(len(fruits))  # 3
\`\`\`

### Opérations sur Sets

\`\`\`python
nombres = {1, 2, 3, 4, 5}

# Ajouter un élément
nombres.add(6)
print(nombres)  # {1, 2, 3, 4, 5, 6}

# Ajouter plusieurs éléments
nombres.update([7, 8, 9])
nombres.update({10, 11})

# Supprimer un élément
nombres.remove(1)  # KeyError si absent
nombres.discard(2)  # Pas d'erreur si absent
element = nombres.pop()  # Supprime et retourne un élément aléatoire

# Vider le set
nombres.clear()
\`\`\`

### Opérations Mathématiques

\`\`\`python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

# Union (tous les éléments)
print(a | b)  # {1, 2, 3, 4, 5, 6, 7, 8}
print(a.union(b))

# Intersection (éléments communs)
print(a & b)  # {4, 5}
print(a.intersection(b))

# Différence (dans a mais pas dans b)
print(a - b)  # {1, 2, 3}
print(a.difference(b))

# Différence symétrique (dans l'un ou l'autre, mais pas les deux)
print(a ^ b)  # {1, 2, 3, 6, 7, 8}
print(a.symmetric_difference(b))

# Sous-ensemble
print({1, 2}.issubset(a))  # True
print(a.issuperset({1, 2}))  # True

# Disjoints (pas d'éléments communs)
print(a.isdisjoint({10, 11}))  # True
\`\`\`

### Supprimer les Doublons

\`\`\`python
# Convertir liste en set pour supprimer doublons
nombres = [1, 2, 2, 3, 3, 3, 4, 5, 5]
uniques = list(set(nombres))
print(uniques)  # [1, 2, 3, 4, 5]
\`\`\`

### Set Comprehension

\`\`\`python
# Créer un set avec comprehension
carres = {x**2 for x in range(10)}
print(carres)  # {0, 1, 64, 4, 36, 9, 16, 49, 81, 25}

# Avec condition
pairs = {x for x in range(20) if x % 2 == 0}
print(pairs)
\`\`\`

## Exemples Pratiques

### Compter les occurrences
\`\`\`python
texte = "python est un langage python"
mots = texte.split()

compteur = {}
for mot in mots:
    compteur[mot] = compteur.get(mot, 0) + 1

print(compteur)  # {'python': 2, 'est': 1, 'un': 1, 'langage': 1}

# Ou avec Counter
from collections import Counter
compteur = Counter(mots)
print(compteur.most_common(2))  # 2 mots les plus fréquents
\`\`\`

### Carnet d'adresses
\`\`\`python
contacts = {}

def ajouter_contact(nom, telephone):
    contacts[nom] = telephone
    print(f"✓ {nom} ajouté")

def chercher_contact(nom):
    if nom in contacts:
        print(f"{nom}: {contacts[nom]}")
    else:
        print(f"{nom} non trouvé")

def afficher_tous():
    for nom, tel in sorted(contacts.items()):
        print(f"{nom}: {tel}")

ajouter_contact("Alice", "0612345678")
ajouter_contact("Bob", "0698765432")
chercher_contact("Alice")
afficher_tous()
\`\`\`

### Grouper par catégorie
\`\`\`python
produits = [
    {"nom": "Pomme", "categorie": "Fruit"},
    {"nom": "Carotte", "categorie": "Légume"},
    {"nom": "Banane", "categorie": "Fruit"},
    {"nom": "Tomate", "categorie": "Légume"}
]

# Grouper par catégorie
groupes = {}
for produit in produits:
    cat = produit["categorie"]
    if cat not in groupes:
        groupes[cat] = []
    groupes[cat].append(produit["nom"])

print(groupes)
# {'Fruit': ['Pomme', 'Banane'], 'Légume': ['Carotte', 'Tomate']}
\`\`\`

### Mots uniques dans un texte
\`\`\`python
texte = "Python est génial Python est puissant"
mots = texte.lower().split()
mots_uniques = set(mots)
print(f"Nombre de mots uniques: {len(mots_uniques)}")
print(f"Mots: {sorted(mots_uniques)}")
\`\`\`

## Exercices

1. **Fusionner dictionnaires** : Fusionner deux dicts en additionnant les valeurs communes
2. **Inverser** : Créer un dict inversé (valeurs deviennent clés)
3. **Mots communs** : Trouver les mots présents dans deux textes
4. **Top N** : Trouver les N mots les plus fréquents dans un texte
5. **Supprimer clés** : Supprimer toutes les clés avec valeur None
6. **Cache** : Implémenter un système de cache simple avec dict

## Points Clés

- **Dict** : paires clé-valeur, \`{"clé": valeur}\`
- **Set** : éléments uniques, non ordonnés, \`{1, 2, 3}\`
- Dict: accès rapide par clé (O(1))
- Set: test d'appartenance rapide (O(1))
- **get()** plus sûr que \`dict[key]\`
- Sets parfaits pour opérations ensemblistes`
    }
  });

  // Add remaining lessons 8-12...
  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-8' },
    update: {},
    create: {
      id: 'lesson-py-complet-8',
      courseId: course.id,
      title: 'Manipulation de Strings',
      duration: 70,
      order: 8,
      content: `# Manipulation de Strings

## Création et Formatage

\`\`\`python
# Différentes façons de créer des strings
simple = 'Hello'
double = "World"
multi_ligne = """Ceci est
un texte sur
plusieurs lignes"""

# Concaténation
nom = "Alice"
message = "Bonjour " + nom  # "Bonjour Alice"

# F-strings (recommandé)
age = 25
message = f"Je m'appelle {nom} et j'ai {age} ans"

# Format avec expressions
prix = 19.99
message = f"Prix: {prix * 1.2:.2f}€"  # "Prix: 23.99€"

# Ancien format
message = "Nom: {}, Age: {}".format(nom, age)
message = "Nom: {n}, Age: {a}".format(n=nom, a=age)
\`\`\`

## Méthodes de String

\`\`\`python
texte = "  Python est Génial  "

# Casse
print(texte.upper())      # "  PYTHON EST GÉNIAL  "
print(texte.lower())      # "  python est génial  "
print(texte.capitalize()) # "  python est génial  "
print(texte.title())      # "  Python Est Génial  "
print(texte.swapcase())   # "  pYTHON EST gÉNIAL  "

# Espaces
print(texte.strip())      # "Python est Génial"
print(texte.lstrip())     # "Python est Génial  "
print(texte.rstrip())     # "  Python est Génial"

# Remplacement
print(texte.replace("Génial", "Super"))
print(texte.replace(" ", "_"))

# Division
mots = texte.split()  # ['Python', 'est', 'Génial']
csv = "a,b,c,d"
elements = csv.split(",")  # ['a', 'b', 'c', 'd']

# Jointure
liste = ["Python", "Java", "C++"]
resultat = ", ".join(liste)  # "Python, Java, C++"
\`\`\``
    }
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-9' },
    update: {},
    create: {
      id: 'lesson-py-complet-9',
      courseId: course.id,
      title: 'Fichiers et Exceptions',
      duration: 95,
      order: 9,
      content: `# Fichiers et Gestion d'Erreurs

## Lire un Fichier

\`\`\`python
# Méthode recommandée (with statement)
with open("fichier.txt", "r", encoding="utf-8") as f:
    contenu = f.read()
    print(contenu)
# Le fichier est automatiquement fermé

# Lire ligne par ligne
with open("fichier.txt", "r") as f:
    for ligne in f:
        print(ligne.strip())

# Lire toutes les lignes dans une liste
with open("fichier.txt", "r") as f:
    lignes = f.readlines()
\`\`\`

## Écrire dans un Fichier

\`\`\`python
# Écrire (écrase le fichier existant)
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Première ligne\\n")
    f.write("Deuxième ligne\\n")

# Ajouter (append)
with open("output.txt", "a") as f:
    f.write("Ligne ajoutée\\n")

# Écrire plusieurs lignes
lignes = ["Ligne 1\\n", "Ligne 2\\n", "Ligne 3\\n"]
with open("output.txt", "w") as f:
    f.writelines(lignes)
\`\`\`

## Gestion des Exceptions

\`\`\`python
# Try-except de base
try:
    nombre = int(input("Entrez un nombre: "))
    resultat = 10 / nombre
    print(f"Résultat: {resultat}")
except ValueError:
    print("Erreur: Ce n'est pas un nombre valide")
except ZeroDivisionError:
    print("Erreur: Division par zéro")
except Exception as e:
    print(f"Erreur inattendue: {e}")
else:
    print("Tout s'est bien passé")
finally:
    print("Ce bloc s'exécute toujours")

# Lever une exception
def diviser(a, b):
    if b == 0:
        raise ValueError("Le diviseur ne peut pas être zéro")
    return a / b
\`\`\``
    }
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-10' },
    update: {},
    create: {
      id: 'lesson-py-complet-10',
      courseId: course.id,
      title: 'Programmation Orientée Objet (POO)',
      duration: 120,
      order: 10,
      content: `# Programmation Orientée Objet

## Classes et Objets

\`\`\`python
# Définir une classe
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def se_presenter(self):
        return f"Je m'appelle {self.nom} et j'ai {self.age} ans"

# Créer des objets
p1 = Personne("Alice", 25)
p2 = Personne("Bob", 30)

print(p1.se_presenter())  # "Je m'appelle Alice et j'ai 25 ans"
print(p2.nom)  # "Bob"
\`\`\`

## Encapsulation

\`\`\`python
class CompteBancaire:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.__solde = solde  # Attribut privé

    def deposer(self, montant):
        if montant > 0:
            self.__solde += montant
            return True
        return False

    def retirer(self, montant):
        if 0 < montant <= self.__solde:
            self.__solde -= montant
            return True
        return False

    def get_solde(self):
        return self.__solde

compte = CompteBancaire("Alice", 1000)
compte.deposer(500)
print(compte.get_solde())  # 1500
\`\`\`

## Héritage

\`\`\`python
class Animal:
    def __init__(self, nom):
        self.nom = nom

    def parler(self):
        pass

class Chien(Animal):
    def parler(self):
        return f"{self.nom} dit: Wouf!"

class Chat(Animal):
    def parler(self):
        return f"{self.nom} dit: Miaou!"

chien = Chien("Rex")
chat = Chat("Whiskers")
print(chien.parler())  # "Rex dit: Wouf!"
print(chat.parler())   # "Whiskers dit: Miaou!"
\`\`\`

## Méthodes Spéciales

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(3, 4)
p3 = p1 + p2
print(p3)  # "Point(4, 6)"
\`\`\``
    }
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-11' },
    update: {},
    create: {
      id: 'lesson-py-complet-11',
      courseId: course.id,
      title: 'Modules et Packages',
      duration: 80,
      order: 11,
      content: `# Modules et Packages

## Importer des Modules

\`\`\`python
# Import complet
import math
print(math.pi)  # 3.141592653589793
print(math.sqrt(16))  # 4.0

# Import avec alias
import numpy as np
import pandas as pd

# Import spécifique
from math import pi, sqrt
print(pi)  # Pas besoin de math.pi

# Import tout (déconseillé)
from math import *
\`\`\`

## Modules Utiles

\`\`\`python
# math : fonctions mathématiques
import math
print(math.ceil(4.2))   # 5
print(math.floor(4.8))  # 4
print(math.factorial(5))  # 120

# random : nombres aléatoires
import random
print(random.randint(1, 10))  # Entre 1 et 10
print(random.choice(['a', 'b', 'c']))
random.shuffle([1, 2, 3, 4])

# datetime : dates et heures
from datetime import datetime, timedelta
maintenant = datetime.now()
demain = maintenant + timedelta(days=1)
print(maintenant.strftime("%Y-%m-%d %H:%M"))

# os : système d'exploitation
import os
print(os.getcwd())  # Répertoire courant
os.makedirs("nouveau_dossier", exist_ok=True)

# json : manipulation JSON
import json
data = {"nom": "Alice", "age": 25}
json_str = json.dumps(data)
data_back = json.loads(json_str)
\`\`\`

## Créer vos propres Modules

\`\`\`python
# fichier: mes_fonctions.py
def saluer(nom):
    return f"Bonjour {nom}!"

def additionner(a, b):
    return a + b

PI = 3.14159

# Dans un autre fichier
import mes_fonctions
print(mes_fonctions.saluer("Alice"))
print(mes_fonctions.PI)
\`\`\``
    }
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-py-complet-12' },
    update: {},
    create: {
      id: 'lesson-py-complet-12',
      courseId: course.id,
      title: 'Projet Final : Application Complète',
      duration: 150,
      order: 12,
      content: `# Projet Final : Gestionnaire de Tâches

## Objectif

Créer une application console complète de gestion de tâches avec:
- Ajout, suppression, modification de tâches
- Sauvegarde dans un fichier JSON
- Catégories et priorités
- Statistiques

## Structure du Projet

\`\`\`
projet/
│
├── main.py              # Point d'entrée
├── task_manager.py      # Logique métier
├── file_handler.py      # Gestion fichiers
└── tasks.json           # Données
\`\`\`

## Code Complet

\`\`\`python
# file_handler.py
import json
import os

class FileHandler:
    def __init__(self, filename="tasks.json"):
        self.filename = filename

    def load_tasks(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def save_tasks(self, tasks):
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(tasks, f, ensure_ascii=False, indent=2)

# task_manager.py
from datetime import datetime

class TaskManager:
    def __init__(self, file_handler):
        self.file_handler = file_handler
        self.tasks = self.file_handler.load_tasks()

    def add_task(self, title, category="Général", priority="Moyenne"):
        task = {
            "id": len(self.tasks) + 1,
            "title": title,
            "category": category,
            "priority": priority,
            "completed": False,
            "created_at": datetime.now().isoformat()
        }
        self.tasks.append(task)
        self.save()
        return task

    def remove_task(self, task_id):
        self.tasks = [t for t in self.tasks if t["id"] != task_id]
        self.save()

    def complete_task(self, task_id):
        for task in self.tasks:
            if task["id"] == task_id:
                task["completed"] = True
                task["completed_at"] = datetime.now().isoformat()
                self.save()
                return True
        return False

    def get_stats(self):
        total = len(self.tasks)
        completed = sum(1 for t in self.tasks if t["completed"])
        return {
            "total": total,
            "completed": completed,
            "pending": total - completed,
            "completion_rate": (completed / total * 100) if total > 0 else 0
        }

    def save(self):
        self.file_handler.save_tasks(self.tasks)

# main.py
from task_manager import TaskManager
from file_handler import FileHandler

def display_menu():
    print("\\n=== GESTIONNAIRE DE TÂCHES ===")
    print("1. Ajouter une tâche")
    print("2. Voir toutes les tâches")
    print("3. Marquer comme terminée")
    print("4. Supprimer une tâche")
    print("5. Statistiques")
    print("6. Quitter")

def main():
    fh = FileHandler()
    tm = TaskManager(fh)

    while True:
        display_menu()
        choice = input("\\nVotre choix: ")

        if choice == "1":
            title = input("Titre: ")
            category = input("Catégorie (Travail/Personnel/Urgent): ")
            priority = input("Priorité (Haute/Moyenne/Basse): ")
            task = tm.add_task(title, category, priority)
            print(f"✓ Tâche #{task['id']} ajoutée")

        elif choice == "2":
            print("\\n=== TOUTES LES TÂCHES ===")
            for task in tm.tasks:
                status = "✓" if task["completed"] else " "
                print(f"[{status}] #{task['id']} - {task['title']}")
                print(f"    Catégorie: {task['category']} | Priorité: {task['priority']}")

        elif choice == "3":
            task_id = int(input("ID de la tâche: "))
            if tm.complete_task(task_id):
                print("✓ Tâche marquée comme terminée")
            else:
                print("✗ Tâche non trouvée")

        elif choice == "4":
            task_id = int(input("ID de la tâche à supprimer: "))
            tm.remove_task(task_id)
            print("✓ Tâche supprimée")

        elif choice == "5":
            stats = tm.get_stats()
            print("\\n=== STATISTIQUES ===")
            print(f"Total: {stats['total']}")
            print(f"Terminées: {stats['completed']}")
            print(f"En cours: {stats['pending']}")
            print(f"Taux de complétion: {stats['completion_rate']:.1f}%")

        elif choice == "6":
            print("Au revoir!")
            break

if __name__ == "__main__":
    main()
\`\`\`

## Extensions Possibles

1. Interface graphique avec Tkinter
2. Rappels et notifications
3. Export PDF avec reportlab
4. Intégration calendrier
5. Partage cloud (API)
6. Tags et filtres avancés
7. Récurrence des tâches
8. Graphiques avec matplotlib

## Félicitations!

Vous avez maintenant toutes les bases de Python. Continuez à pratiquer et construire des projets!`
    }
  });

  console.log(`✅ 12 leçons créées`);

  // Enroll all users in the course
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        courseId: course.id,
        enrollmentType: 'GRANTED'
      }
    });
  }

  console.log(`✅ ${users.length} utilisateurs inscrits au cours`);
  console.log('\n🎉 Cours Python Complet créé avec succès!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
