const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const lessonData = [
  {
    title: "Introduction à Python",
    order: 1,
    duration: 45,
    content: "Bienvenue dans l'univers de Python ! Créé par Guido van Rossum en 1991, Python est aujourd'hui le langage de programmation le plus populaire au monde. Sa philosophie repose sur la lisibilité et la simplicité : 'Beautiful is better than ugly, Explicit is better than implicit'. Dans cette leçon fondatrice, vous allez comprendre pourquoi Python est le choix numéro un pour la Data Science, l'Intelligence Artificielle, le développement web et l'automatisation.",
    extra: `## Pourquoi Python Domine le Monde de la Tech ?

Python n'est pas juste populaire — il est omniprésent. Voici les raisons concrètes de son succès :

| Domaine | Utilisation |
|---|---|
| Data Science & IA | NumPy, Pandas, TensorFlow, PyTorch |
| Développement Web | Django, Flask, FastAPI |
| Automatisation | Scripts, bots, ETL pipelines |
| Cybersécurité | Outils d'analyse, pentest |
| Finance | Analyse quantitative, trading algo |

---

## Installation de Python

### Sur Windows
1. Téléchargez l'installateur sur [python.org](https://python.org)
2. **Cochez "Add Python to PATH"** (très important !)
3. Cliquez sur "Install Now"

### Sur macOS / Linux
\`\`\`bash
# macOS avec Homebrew
brew install python3

# Ubuntu / Debian
sudo apt update && sudo apt install python3 python3-pip
\`\`\`

### Vérifier l'installation
\`\`\`bash
python3 --version
# Python 3.12.0

pip3 --version
# pip 23.x
\`\`\`

---

## Votre Premier Programme Python

Ouvrez un terminal et tapez \`python3\` pour entrer dans l'interpréteur interactif :

\`\`\`python
# Le classique "Hello, World!"
print("Hello, World!")
# Sortie : Hello, World!

# Python comme calculatrice
print(2 + 2)        # 4
print(10 / 3)       # 3.3333...
print(10 // 3)      # 3 (division entière)
print(2 ** 8)       # 256 (puissance)

# Une interaction simple avec l'utilisateur
nom = input("Quel est ton prénom ? ")
print(f"Bonjour, {nom} ! Bienvenue dans Python.")
\`\`\`

---

## L'Environnement de Développement (IDE)

Nous recommandons **VS Code** avec l'extension Python, ou **PyCharm Community** (gratuit).

\`\`\`python
# Créez un fichier "bonjour.py" et écrivez :
import sys

print("Version de Python :", sys.version)
print("Chemin de l'interpréteur :", sys.executable)

# Afficher des informations système
import platform
print("Système d'exploitation :", platform.system())
print("Architecture :", platform.machine())
\`\`\`

---

## La Philosophie Python : Le Zen de Python

\`\`\`python
import this
# Exécutez ce code pour lire les 19 principes de Python
# "Beautiful is better than ugly."
# "Explicit is better than implicit."
# "Simple is better than complex."
# "Readability counts."
\`\`\`

> [!TIP]
> **Conseil d'expert** : Utilisez des **environnements virtuels** dès le début de chaque projet avec \`python -m venv mon_env\`. Cela isole vos dépendances et évite les conflits entre projets.

> [!NOTE]
> Python utilise l'**indentation** (espaces ou tabulations) pour structurer le code. Contrairement à d'autres langages qui utilisent des accolades \`{}\`, Python force un code visuellement propre.

---

## Exercices Pratiques

**Exercice 1** : Écrivez un script qui demande votre âge et affiche l'année de votre naissance.
\`\`\`python
age = int(input("Quel est votre âge ? "))
annee_naissance = 2024 - age
print(f"Vous êtes né(e) en {annee_naissance}.")
\`\`\`

**Exercice 2** : Calculez l'aire d'un cercle à partir de son rayon.
\`\`\`python
import math

rayon = float(input("Entrez le rayon du cercle : "))
aire = math.pi * rayon ** 2
print(f"L'aire du cercle est : {aire:.2f} cm²")
\`\`\`

> [!IMPORTANT]
> Ne cherchez pas à tout mémoriser immédiatement. La documentation officielle (docs.python.org) est votre meilleure amie. Les développeurs professionnels la consultent quotidiennement !`
  },
  {
    title: "Variables et Types de Données",
    order: 2,
    duration: 50,
    content: "Les variables sont les conteneurs de l'information dans tout programme. En Python, une variable est créée au moment où vous lui assignez une valeur — pas besoin de déclarer son type à l'avance. Ce mécanisme s'appelle le **typage dynamique**. Maîtriser les types de données est fondamental car chaque opération dépend du type de la donnée manipulée.",
    extra: `## Les Types Fondamentaux de Python

### Les Nombres

\`\`\`python
# Entiers (int) - taille illimitée en Python !
age = 25
population_mondiale = 8_000_000_000  # underscore pour la lisibilité
nombre_negatif = -42

# Flottants (float) - nombres décimaux
pi = 3.14159
temperature = -17.5
notation_scientifique = 1.5e-4  # = 0.00015

# Complexes (complex)
z = 3 + 4j
print(z.real)   # 3.0
print(z.imag)   # 4.0

# Opérations numériques
print(17 % 5)   # 2  (modulo - reste de la division)
print(17 // 5)  # 3  (division entière)
print(2 ** 10)  # 1024 (puissance)
\`\`\`

### Les Chaînes de Caractères (str)

\`\`\`python
# Différentes façons de créer une chaîne
simple = 'Bonjour'
double = "Le monde"
multiligne = """
Ceci est une chaîne
sur plusieurs lignes.
"""

# Les f-strings (Python 3.6+) - la méthode moderne
prenom = "Alice"
age = 30
message = f"Je m'appelle {prenom} et j'ai {age} ans."
print(message)

# Opérations sur les chaînes
texte = "Python est puissant"
print(texte.upper())          # PYTHON EST PUISSANT
print(texte.lower())          # python est puissant
print(texte.replace("puissant", "génial"))
print(texte.split(" "))       # ['Python', 'est', 'puissant']
print(len(texte))             # 19 (nombre de caractères)
print(texte[0])               # P (premier caractère)
print(texte[-1])              # t (dernier caractère)
print(texte[7:10])            # est (slicing)
print("Python" in texte)      # True

# Méthodes utiles
"  bonjour  ".strip()         # "bonjour" (supprime espaces)
"a,b,c".split(",")            # ['a', 'b', 'c']
"-".join(["a", "b", "c"])     # "a-b-c"
"bonjour".capitalize()        # "Bonjour"
"bonjour".startswith("bon")   # True
\`\`\`

### Les Booléens (bool)

\`\`\`python
vrai = True
faux = False

# Valeurs "falsy" en Python (considérées comme False)
bool(0)        # False
bool("")       # False
bool([])       # False
bool(None)     # False

# Valeurs "truthy" (considérées comme True)
bool(1)        # True
bool("texte")  # True
bool([1,2])    # True

# Opérateurs logiques
print(True and False)   # False
print(True or False)    # True
print(not True)         # False
\`\`\`

---

## Conversion de Types (Casting)

\`\`\`python
# str -> int
age_texte = "25"
age_nombre = int(age_texte)
print(age_nombre + 5)  # 30

# int -> str
prix = 99
message = "Le prix est " + str(prix) + " euros"

# str -> float
temperature = float("37.5")

# Attention aux erreurs de conversion !
try:
    int("abc")  # ValueError !
except ValueError as e:
    print(f"Erreur : {e}")

# Vérifier le type d'une variable
x = 42
print(type(x))           # <class 'int'>
print(isinstance(x, int))  # True
\`\`\`

---

## Variables Avancées

\`\`\`python
# Assignation multiple
a, b, c = 1, 2, 3
x = y = z = 0  # Même valeur pour plusieurs variables

# Échanger deux variables (Pythonique !)
a, b = b, a

# None - l'absence de valeur
resultat = None
if resultat is None:
    print("Pas encore de résultat")

# Constantes (convention : majuscules)
PI = 3.14159
VITESSE_LUMIERE = 299_792_458  # m/s
MAX_CONNEXIONS = 100
\`\`\`

> [!TIP]
> Utilisez des **noms descriptifs** pour vos variables : \`nombre_etudiants\` est bien mieux que \`n\`. Votre futur vous vous remerciera !

> [!WARNING]
> Évitez d'utiliser des mots réservés Python comme noms de variables : \`list\`, \`type\`, \`id\`, \`input\`, \`print\`, \`sum\`, \`min\`, \`max\` etc. Cela écrase les fonctions built-in !

---

## Exercices Pratiques

**Exercice 1** : Convertisseur de température
\`\`\`python
celsius = float(input("Température en Celsius : "))
fahrenheit = (celsius * 9/5) + 32
kelvin = celsius + 273.15
print(f"{celsius}°C = {fahrenheit:.1f}°F = {kelvin:.2f}K")
\`\`\`

**Exercice 2** : Analyseur de chaîne
\`\`\`python
texte = input("Entrez une phrase : ")
print(f"Nombre de caractères : {len(texte)}")
print(f"Nombre de mots : {len(texte.split())}")
print(f"Majuscules : {texte.upper()}")
print(f"Commence par une voyelle : {texte[0].lower() in 'aeiouy'}")
\`\`\``
  },
  {
    title: "Structures de Contrôle",
    order: 3,
    duration: 50,
    content: "Un programme sans conditions est comme un GPS sans carrefours — il ne peut que suivre une seule route. Les structures de contrôle permettent à votre code de prendre des décisions intelligentes en fonction des données. Avec if/elif/else, vous donnez à votre programme la capacité de raisonner et de s'adapter.",
    extra: `## L'Instruction if/elif/else

\`\`\`python
# Structure de base
age = 20

if age < 18:
    print("Mineur")
elif age < 65:
    print("Adulte")
else:
    print("Senior")

# Conditions multiples avec and / or
temperature = 25
humidite = 60

if temperature > 20 and humidite < 70:
    print("Météo agréable !")
elif temperature > 30 or humidite > 90:
    print("Attention : conditions extrêmes")
else:
    print("Météo correcte")
\`\`\`

---

## Les Opérateurs de Comparaison

\`\`\`python
x = 10

print(x == 10)   # True  - Égal à
print(x != 5)    # True  - Différent de
print(x > 8)     # True  - Supérieur à
print(x < 8)     # False - Inférieur à
print(x >= 10)   # True  - Supérieur ou égal
print(x <= 10)   # True  - Inférieur ou égal

# Comparaison d'identité (objet, pas valeur)
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)    # True  (même contenu)
print(a is b)    # False (objets différents en mémoire)
print(a is c)    # True  (même objet)

# Test d'appartenance
fruits = ["pomme", "banane", "cerise"]
print("banane" in fruits)      # True
print("mangue" not in fruits)  # True
\`\`\`

---

## Cas Pratiques : Un Système de Notation

\`\`\`python
def evaluer_note(note):
    """Convertit une note numérique en mention."""
    if not (0 <= note <= 20):
        return "Note invalide (doit être entre 0 et 20)"
    elif note >= 16:
        return f"{note}/20 - Très Bien"
    elif note >= 14:
        return f"{note}/20 - Bien"
    elif note >= 12:
        return f"{note}/20 - Assez Bien"
    elif note >= 10:
        return f"{note}/20 - Passable"
    else:
        return f"{note}/20 - Insuffisant"

# Test
for note in [18, 14.5, 11, 7, 25]:
    print(evaluer_note(note))
\`\`\`

---

## L'Expression Conditionnelle (Ternaire)

\`\`\`python
# Syntaxe : valeur_si_vrai if condition else valeur_si_faux
age = 20
statut = "majeur" if age >= 18 else "mineur"
print(statut)  # majeur

# Utile pour les assignations rapides
score = 75
mention = "Reçu" if score >= 50 else "Recalé"

# Equivalent à :
# if score >= 50:
#     mention = "Reçu"
# else:
#     mention = "Recalé"
\`\`\`

---

## Conditions Imbriquées et Cas Réels

\`\`\`python
def calculer_tarif_cinema(age, est_etudiant, est_weekend):
    """Calcule le tarif d'une place de cinéma."""
    tarif_base = 12.0

    if age < 12:
        tarif = tarif_base * 0.5   # 50% réduction enfant
    elif age >= 65:
        tarif = tarif_base * 0.7   # 30% réduction senior
    elif est_etudiant:
        tarif = tarif_base * 0.8   # 20% réduction étudiant
    else:
        tarif = tarif_base

    # Supplément weekend
    if est_weekend:
        tarif += 2.0

    return tarif

# Tests
print(f"Enfant semaine : {calculer_tarif_cinema(8, False, False):.2f}€")
print(f"Étudiant weekend : {calculer_tarif_cinema(22, True, True):.2f}€")
print(f"Adulte semaine : {calculer_tarif_cinema(35, False, False):.2f}€")
\`\`\`

---

## match/case — Le Switch Python (3.10+)

\`\`\`python
# Disponible depuis Python 3.10
commande = "quitter"

match commande:
    case "aide":
        print("Affichage de l'aide...")
    case "sauvegarder":
        print("Sauvegarde en cours...")
    case "quitter" | "exit" | "q":
        print("Au revoir !")
    case _:
        print(f"Commande inconnue : {commande}")
\`\`\`

> [!IMPORTANT]
> L'indentation en Python est **obligatoire et significative**. Utilisez toujours 4 espaces (jamais des tabulations mélangées avec des espaces). La plupart des IDE configurent cela automatiquement.

---

## Exercice : Jeu de devinette

\`\`\`python
import random

nombre_secret = random.randint(1, 100)
tentative = int(input("Devinez le nombre (1-100) : "))

if tentative == nombre_secret:
    print("Bravo ! Vous avez trouvé du premier coup !")
elif tentative < nombre_secret:
    print(f"Trop petit ! Le nombre était {nombre_secret}.")
else:
    print(f"Trop grand ! Le nombre était {nombre_secret}.")
\``
  },
  {
    title: "Les Boucles",
    order: 4,
    duration: 55,
    content: "La véritable puissance de la programmation réside dans la capacité à automatiser les répétitions. Les boucles permettent d'exécuter des instructions des milliers de fois sans réécrire le même code. En Python, les boucles for et while couvrent 99% des besoins, et leurs variantes avancées (enumerate, zip, list comprehensions) vous permettront d'écrire du code élégant et efficace.",
    extra: `## La Boucle for

### Itérer sur des séquences

\`\`\`python
# Sur une liste
fruits = ["pomme", "banane", "cerise"]
for fruit in fruits:
    print(f"J'aime les {fruit}s")

# Sur une chaîne de caractères
for lettre in "Python":
    print(lettre, end=" ")  # P y t h o n

# Sur un range (séquence de nombres)
for i in range(5):           # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11):       # 1 à 10
    print(i)

for i in range(0, 101, 10):  # 0, 10, 20, ..., 100
    print(i)

for i in range(10, 0, -1):   # 10, 9, 8, ..., 1 (compte à rebours)
    print(i)
\`\`\`

### enumerate — Index + Valeur

\`\`\`python
langages = ["Python", "JavaScript", "Java", "C++"]

for index, langage in enumerate(langages):
    print(f"{index + 1}. {langage}")
# 1. Python
# 2. JavaScript
# 3. Java
# 4. C++

# Commencer l'index à 1 directement
for index, langage in enumerate(langages, start=1):
    print(f"{index}. {langage}")
\`\`\`

### zip — Parcourir plusieurs listes en parallèle

\`\`\`python
noms = ["Alice", "Bob", "Charlie"]
notes = [18, 15, 12]
matieres = ["Python", "SQL", "Excel"]

for nom, note, matiere in zip(noms, notes, matieres):
    print(f"{nom} a eu {note}/20 en {matiere}")
# Alice a eu 18/20 en Python
# Bob a eu 15/20 en SQL
# Charlie a eu 12/20 en Excel
\`\`\`

---

## La Boucle while

\`\`\`python
# Tant qu'une condition est vraie
compteur = 0
while compteur < 5:
    print(f"Compteur : {compteur}")
    compteur += 1  # Équivalent à compteur = compteur + 1

# Boucle infinie contrôlée
import random
tentatives = 0
while True:
    nombre = random.randint(1, 10)
    tentatives += 1
    if nombre == 7:
        print(f"7 trouvé après {tentatives} tentatives !")
        break
\`\`\`

---

## break, continue et else

\`\`\`python
# break — Quitte la boucle immédiatement
for i in range(10):
    if i == 5:
        break
    print(i)  # Affiche 0, 1, 2, 3, 4

# continue — Passe à l'itération suivante
for i in range(10):
    if i % 2 == 0:
        continue  # Ignore les nombres pairs
    print(i)  # Affiche 1, 3, 5, 7, 9

# else — S'exécute si la boucle se termine normalement (sans break)
for i in range(5):
    if i == 10:  # Condition jamais vraie
        break
else:
    print("Boucle terminée normalement")  # S'affiche
\`\`\`

---

## Les List Comprehensions — Python Élégant

\`\`\`python
# Syntaxe : [expression for element in iterable if condition]

# Carré des nombres de 1 à 10
carres = [x**2 for x in range(1, 11)]
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# Filtrer les nombres pairs
pairs = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Convertir une liste de chaînes
noms = ["alice", "bob", "charlie"]
noms_majuscules = [nom.capitalize() for nom in noms]
# ['Alice', 'Bob', 'Charlie']

# Avec condition ternaire
resultats = ["pair" if x % 2 == 0 else "impair" for x in range(6)]
# ['pair', 'impair', 'pair', 'impair', 'pair', 'impair']

# Boucles imbriquées (produit cartésien)
coordonnees = [(x, y) for x in range(3) for y in range(3)]
# [(0,0), (0,1), (0,2), (1,0), ...]
\`\`\`

---

## Exemples Concrets

\`\`\`python
# 1. Table de multiplication
def table_multiplication(n):
    print(f"\\n--- Table de {n} ---")
    for i in range(1, 11):
        print(f"{n} x {i:2d} = {n*i:3d}")

table_multiplication(7)

# 2. Calcul de la moyenne d'une liste
notes = [14, 17, 12, 18, 11, 15, 16]
total = 0
for note in notes:
    total += note
moyenne = total / len(notes)
print(f"Moyenne : {moyenne:.2f}/20")

# 3. Recherche dans une liste
def trouver_element(liste, cible):
    for i, elem in enumerate(liste):
        if elem == cible:
            return f"'{cible}' trouvé à l'index {i}"
    return f"'{cible}' non trouvé"

mots = ["data", "science", "python", "machine", "learning"]
print(trouver_element(mots, "python"))    # Trouvé à l'index 2
print(trouver_element(mots, "java"))      # Non trouvé
\`\`\`

> [!TIP]
> Préférez les **list comprehensions** aux boucles \`for\` classiques pour créer des listes — elles sont jusqu'à 35% plus rapides et plus lisibles en Python.

> [!WARNING]
> Méfiez-vous des **boucles infinies** ! Assurez-vous toujours que votre condition \`while\` deviendra éventuellement fausse, ou qu'un \`break\` existe.

---

## Exercice : FizzBuzz Avancé

\`\`\`python
# Le classique test d'entretien !
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)

# Version élégante avec list comprehension
resultat = ["FizzBuzz" if i%15==0 else "Fizz" if i%3==0 else "Buzz" if i%5==0 else str(i) for i in range(1, 101)]
print(resultat[:15])
\``
  },
  {
    title: "Les Fonctions",
    order: 5,
    duration: 60,
    content: "Les fonctions sont le pilier de tout code professionnel. Elles permettent de découper un problème complexe en sous-problèmes simples, de réutiliser du code, et de rendre votre programme lisible et maintenable. Le principe fondamental est DRY : Don't Repeat Yourself — si vous écrivez le même code deux fois, c'est le signe qu'il faut une fonction.",
    extra: `## Définir et Appeler une Fonction

\`\`\`python
# Syntaxe de base
def saluer(nom):
    """Affiche un message de bienvenue personnalisé."""
    message = f"Bonjour, {nom} !"
    return message

# Appel de la fonction
resultat = saluer("Alice")
print(resultat)  # Bonjour, Alice !

# Fonction sans paramètre ni retour
def afficher_separateur():
    print("=" * 50)

afficher_separateur()
\`\`\`

---

## Les Paramètres et Arguments

\`\`\`python
# Valeurs par défaut
def calculer_puissance(base, exposant=2):
    return base ** exposant

print(calculer_puissance(3))       # 9  (exposant=2 par défaut)
print(calculer_puissance(3, 3))    # 27
print(calculer_puissance(2, 10))   # 1024

# Arguments nommés (keyword arguments)
def creer_profil(nom, age, ville="Paris", profession="Étudiant"):
    return {
        "nom": nom,
        "age": age,
        "ville": ville,
        "profession": profession
    }

profil = creer_profil("Alice", 28, profession="Data Scientist")
print(profil)

# *args — Nombre variable d'arguments positionnels
def calculer_somme(*nombres):
    return sum(nombres)

print(calculer_somme(1, 2, 3))        # 6
print(calculer_somme(10, 20, 30, 40)) # 100

# **kwargs — Nombre variable d'arguments nommés
def afficher_infos(**infos):
    for cle, valeur in infos.items():
        print(f"  {cle}: {valeur}")

afficher_infos(nom="Bob", age=35, ville="Lyon", score=95)
\`\`\`

---

## Les Valeurs de Retour

\`\`\`python
# Retour multiple
def statistiques(nombres):
    """Calcule plusieurs statistiques en une seule fonction."""
    n = len(nombres)
    total = sum(nombres)
    moyenne = total / n
    mini = min(nombres)
    maxi = max(nombres)
    return moyenne, mini, maxi  # Retourne un tuple

notes = [14, 17, 12, 18, 11, 15, 16]
moy, mini, maxi = statistiques(notes)
print(f"Moyenne: {moy:.1f}, Min: {mini}, Max: {maxi}")

# Fonction retournant None implicitement
def afficher(texte):
    print(texte)
    # Pas de return → renvoie None

resultat = afficher("Bonjour")
print(resultat)  # None
\`\`\`

---

## Les Fonctions Lambda

\`\`\`python
# Fonctions anonymes en une ligne
carre = lambda x: x ** 2
print(carre(5))  # 25

# Utiles pour trier des données complexes
etudiants = [
    {"nom": "Alice", "note": 18},
    {"nom": "Charlie", "note": 12},
    {"nom": "Bob", "note": 15},
]

# Trier par note (décroissant)
tries = sorted(etudiants, key=lambda e: e["note"], reverse=True)
for e in tries:
    print(f"{e['nom']}: {e['note']}/20")

# Avec map() et filter()
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
carres = list(map(lambda x: x**2, nombres))
pairs = list(filter(lambda x: x % 2 == 0, nombres))
print(carres)  # [1, 4, 9, 16, ...]
print(pairs)   # [2, 4, 6, 8, 10]
\`\`\`

---

## Portée des Variables (Scope)

\`\`\`python
# Variables locales vs globales
compteur = 0  # Variable globale

def incrementer():
    global compteur  # Déclarer qu'on modifie la variable globale
    compteur += 1

incrementer()
incrementer()
print(compteur)  # 2

# Closure — Fonction qui "capture" son environnement
def creer_multiplicateur(n):
    def multiplier(x):
        return x * n  # "n" est capturé depuis la fonction parente
    return multiplier

doubler = creer_multiplicateur(2)
tripler = creer_multiplicateur(3)
print(doubler(5))   # 10
print(tripler(5))   # 15
\`\`\`

---

## Fonctions Avancées : Décorateurs

\`\`\`python
import time

def mesurer_temps(fonction):
    """Décorateur qui mesure le temps d'exécution d'une fonction."""
    def wrapper(*args, **kwargs):
        debut = time.time()
        resultat = fonction(*args, **kwargs)
        fin = time.time()
        print(f"{fonction.__name__} exécutée en {fin-debut:.4f}s")
        return resultat
    return wrapper

@mesurer_temps
def calcul_lent():
    total = 0
    for i in range(1_000_000):
        total += i
    return total

resultat = calcul_lent()
# calcul_lent exécutée en 0.0523s
\`\`\`

> [!TIP]
> Chaque fonction doit avoir une **docstring** pour décrire ce qu'elle fait, ses paramètres et ce qu'elle retourne. Utilisez \`help(ma_fonction)\` pour afficher la documentation.

> [!NOTE]
> Une bonne fonction fait **une seule chose** et le fait bien. Si votre fonction dépasse 20-30 lignes, envisagez de la découper.

---

## Exercice Complet : Calculatrice

\`\`\`python
def calculatrice(a, b, operation="+"):
    operations = {
        "+": lambda x, y: x + y,
        "-": lambda x, y: x - y,
        "*": lambda x, y: x * y,
        "/": lambda x, y: x / y if y != 0 else "Erreur: division par zéro"
    }

    if operation not in operations:
        return f"Opération '{operation}' inconnue"

    return operations[operation](a, b)

# Tests
print(calculatrice(10, 5, "+"))   # 15
print(calculatrice(10, 5, "-"))   # 5
print(calculatrice(10, 5, "*"))   # 50
print(calculatrice(10, 0, "/"))   # Erreur: division par zéro
\``
  },
  {
    title: "Listes et Tuples",
    order: 6,
    duration: 55,
    content: "Comment gérer 1000 noms d'étudiants ? Pas avec 1000 variables ! Les listes sont les structures de données les plus utilisées en Python — elles permettent de stocker, organiser et manipuler des collections de données de manière flexible et puissante. Les tuples, leur cousin immuable, garantissent l'intégrité des données.",
    extra: `## Les Listes — Collections Dynamiques

\`\`\`python
# Créer une liste
nombres = [1, 2, 3, 4, 5]
fruits = ["pomme", "banane", "cerise"]
mixte = [42, "Python", True, 3.14, None]
vide = []

# Liste de listes (matrice)
matrice = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(matrice[1][2])  # 6 (ligne 1, colonne 2)
\`\`\`

---

## Accès et Modification

\`\`\`python
fruits = ["pomme", "banane", "cerise", "datte", "figue"]

# Accès par index (commence à 0)
print(fruits[0])    # pomme (premier)
print(fruits[-1])   # figue (dernier)
print(fruits[-2])   # datte (avant-dernier)

# Slicing — extraire des sous-listes
print(fruits[1:3])    # ['banane', 'cerise']
print(fruits[:2])     # ['pomme', 'banane'] (du début)
print(fruits[3:])     # ['datte', 'figue'] (jusqu'à la fin)
print(fruits[::2])    # ['pomme', 'cerise', 'figue'] (un sur deux)
print(fruits[::-1])   # ['figue', 'datte', 'cerise', 'banane', 'pomme'] (inverse)

# Modifier un élément
fruits[1] = "mangue"
print(fruits)  # ['pomme', 'mangue', 'cerise', 'datte', 'figue']
\`\`\`

---

## Les Méthodes Essentielles

\`\`\`python
ma_liste = [3, 1, 4, 1, 5, 9, 2, 6]

# Ajouter des éléments
ma_liste.append(7)          # Ajoute à la fin : [..., 7]
ma_liste.insert(0, 0)       # Insère à l'index 0
ma_liste.extend([10, 11])   # Ajoute plusieurs éléments

# Supprimer des éléments
ma_liste.remove(1)          # Supprime la première occurrence de 1
popped = ma_liste.pop()     # Retire et retourne le dernier élément
popped2 = ma_liste.pop(0)   # Retire et retourne l'élément à l'index 0
del ma_liste[2]             # Supprime l'élément à l'index 2

# Trier
nombres = [3, 1, 4, 1, 5, 9, 2, 6]
nombres.sort()              # Tri en place (modifie la liste)
nombres.sort(reverse=True)  # Tri décroissant

# sorted() retourne une nouvelle liste
original = [3, 1, 4, 1, 5]
trie = sorted(original)     # original est inchangé

# Autres méthodes
print(ma_liste.count(1))    # Compte les occurrences de 1
print(ma_liste.index(5))    # Retourne l'index de la valeur 5
ma_liste.reverse()          # Inverse la liste en place
ma_liste_copie = ma_liste.copy()  # Copie superficielle
\`\`\`

---

## Opérations sur les Listes

\`\`\`python
# Concaténation
liste_a = [1, 2, 3]
liste_b = [4, 5, 6]
combinee = liste_a + liste_b   # [1, 2, 3, 4, 5, 6]

# Répétition
repete = [0] * 5               # [0, 0, 0, 0, 0]

# Fonctions built-in
nombres = [4, 7, 2, 9, 1, 5]
print(len(nombres))    # 6
print(sum(nombres))    # 28
print(min(nombres))    # 1
print(max(nombres))    # 9
print(any(x > 8 for x in nombres))    # True
print(all(x > 0 for x in nombres))    # True

# Vérifier l'appartenance
print(7 in nombres)     # True
print(10 not in nombres) # True
\`\`\`

---

## Cas Pratique : Gestion d'une Classe

\`\`\`python
class GestionNotes:
    def __init__(self):
        self.notes = []

    def ajouter_note(self, note):
        if 0 <= note <= 20:
            self.notes.append(note)
        else:
            print(f"Note invalide : {note}")

    def statistiques(self):
        if not self.notes:
            return "Aucune note enregistrée"
        return {
            "nombre": len(self.notes),
            "moyenne": sum(self.notes) / len(self.notes),
            "min": min(self.notes),
            "max": max(self.notes),
            "admis": [n for n in self.notes if n >= 10],
            "recalés": [n for n in self.notes if n < 10]
        }

gs = GestionNotes()
for note in [15, 8, 18, 12, 7, 14, 11]:
    gs.ajouter_note(note)

stats = gs.statistiques()
print(f"Moyenne : {stats['moyenne']:.1f}/20")
print(f"Admis : {len(stats['admis'])} / {stats['nombre']}")
\`\`\`

---

## Les Tuples — Données Immuables

\`\`\`python
# Créer un tuple
coordonnees = (48.8566, 2.3522)   # Paris (lat, lon)
couleur_rgb = (255, 128, 0)
singleton = (42,)   # Tuple avec un seul élément (la virgule est obligatoire !)

# Accès identique aux listes
print(coordonnees[0])    # 48.8566
print(coordonnees[-1])   # 2.3522

# Les tuples sont immuables !
try:
    coordonnees[0] = 0  # TypeError !
except TypeError:
    print("Un tuple ne peut pas être modifié")

# Unpacking (déballage)
x, y = coordonnees
r, g, b = couleur_rgb
print(f"Rouge: {r}, Vert: {g}, Bleu: {b}")

# Cas d'usage : retour multiple de fonctions
def min_max(liste):
    return min(liste), max(liste)  # Retourne un tuple

minimum, maximum = min_max([3, 7, 1, 9, 4])
print(f"Min: {minimum}, Max: {maximum}")
\`\`\`

> [!NOTE]
> Utilisez les **tuples** pour les données qui ne doivent pas changer (coordonnées GPS, couleurs RGB, configuration), et les **listes** pour les données dynamiques.

> [!TIP]
> Pour copier une liste, utilisez \`.copy()\` ou \`list(original)\`. Ne faites **jamais** \`copie = original\` — les deux variables pointeraient vers le même objet !

---

## Exercice : Analyseur de données

\`\`\`python
def analyser_ventes(ventes):
    """Analyse une liste de ventes mensuelles."""
    ventes_triees = sorted(ventes, reverse=True)
    total = sum(ventes)
    moyenne = total / len(ventes)
    mois_record = ventes.index(max(ventes)) + 1

    print(f"Total annuel : {total:,}€")
    print(f"Moyenne mensuelle : {moyenne:,.0f}€")
    print(f"Meilleur mois : Mois {mois_record} ({max(ventes):,}€)")
    print(f"Pire mois : Mois {ventes.index(min(ventes))+1} ({min(ventes):,}€)")
    print(f"Top 3 des mois : {ventes_triees[:3]}")

ventes_2024 = [45000, 52000, 38000, 61000, 55000, 70000,
               48000, 53000, 67000, 72000, 81000, 95000]
analyser_ventes(ventes_2024)
\``
  },
  {
    title: "Dictionnaires et Sets",
    order: 7,
    duration: 55,
    content: "Si les listes sont des tiroirs numérotés, les dictionnaires sont des fichiers classeurs avec des étiquettes. Au lieu d'accéder aux données par un index numérique, vous utilisez des **clés** descriptives pour un accès instantané. Les dictionnaires sont la structure de données la plus polyvalente en Python et constituent la base du format JSON — le standard mondial de l'échange de données sur internet.",
    extra: `## Les Dictionnaires — Accès par Clé

\`\`\`python
# Créer un dictionnaire
etudiant = {
    "nom": "Alice Dupont",
    "age": 23,
    "formation": "Data Science",
    "notes": [15, 18, 14, 17],
    "actif": True
}

# Accès aux valeurs
print(etudiant["nom"])          # Alice Dupont
print(etudiant["notes"][0])     # 15 (premier élément de la liste)

# Accès sécurisé avec .get()
print(etudiant.get("email"))               # None (pas d'erreur)
print(etudiant.get("email", "Non défini")) # "Non défini" (valeur par défaut)
\`\`\`

---

## Modifier les Dictionnaires

\`\`\`python
inventaire = {"pommes": 50, "bananes": 30, "cerises": 100}

# Ajouter / Modifier
inventaire["mangues"] = 25      # Ajouter une nouvelle clé
inventaire["pommes"] = 45       # Modifier une valeur existante

# Supprimer
del inventaire["cerises"]       # Supprime la clé
fruit = inventaire.pop("bananes")  # Retire et retourne la valeur
print(fruit)  # 30

# Mettre à jour avec un autre dictionnaire
mises_a_jour = {"pommes": 60, "kiwis": 15}
inventaire.update(mises_a_jour)
print(inventaire)
\`\`\`

---

## Les Méthodes Essentielles

\`\`\`python
config = {
    "host": "localhost",
    "port": 5432,
    "database": "ma_bdd",
    "user": "admin",
    "password": "secret123"
}

# Accéder aux clés, valeurs, paires
print(list(config.keys()))
# ['host', 'port', 'database', 'user', 'password']

print(list(config.values()))
# ['localhost', 5432, 'ma_bdd', 'admin', 'secret123']

print(list(config.items()))
# [('host', 'localhost'), ('port', 5432), ...]

# Itérer sur un dictionnaire
for cle, valeur in config.items():
    if cle != "password":  # Ne pas afficher le mot de passe
        print(f"  {cle}: {valeur}")

# Vérifier l'existence d'une clé
print("host" in config)       # True
print("timeout" in config)    # False
\`\`\`

---

## Dictionnaires Imbriqués

\`\`\`python
# Structure de données complexe
universite = {
    "Paris": {
        "nom": "Sorbonne",
        "etudiants": 42000,
        "formations": ["Médecine", "Droit", "Sciences"]
    },
    "Lyon": {
        "nom": "Lyon 1",
        "etudiants": 38000,
        "formations": ["Sciences", "Pharmacie", "STAPS"]
    }
}

# Accès imbriqué
print(universite["Paris"]["nom"])              # Sorbonne
print(universite["Lyon"]["formations"][0])     # Sciences
print(universite["Paris"]["etudiants"])        # 42000

# Modifier des données imbriquées
universite["Paris"]["etudiants"] += 1000
universite["Lyon"]["formations"].append("Informatique")
\`\`\`

---

## Dict Comprehensions

\`\`\`python
# Créer un dict à partir d'une liste
etudiants = ["Alice", "Bob", "Charlie", "Diana"]
notes = [18, 15, 12, 17]

resultats = {nom: note for nom, note in zip(etudiants, notes)}
# {'Alice': 18, 'Bob': 15, 'Charlie': 12, 'Diana': 17}

# Filtrer
admis = {nom: note for nom, note in resultats.items() if note >= 14}
# {'Alice': 18, 'Diana': 17}

# Transformer
carres = {x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Inverser un dictionnaire (échanger clés et valeurs)
original = {"a": 1, "b": 2, "c": 3}
inverse = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}
\`\`\`

---

## Les Sets — Collections Uniques

\`\`\`python
# Un set n'a pas de doublons
visites = {"Paris", "Lyon", "Paris", "Marseille", "Lyon"}
print(visites)   # {'Paris', 'Lyon', 'Marseille'} — doublons supprimés

# Convertir une liste en set pour supprimer les doublons
emails_avec_doublons = ["a@test.com", "b@test.com", "a@test.com", "c@test.com"]
emails_uniques = list(set(emails_avec_doublons))
print(emails_uniques)  # ['a@test.com', 'b@test.com', 'c@test.com']

# Opérations d'ensembles
python_devs = {"Alice", "Bob", "Charlie", "Diana"}
data_analysts = {"Bob", "Diana", "Eve", "Frank"}

# Union (tous les membres)
print(python_devs | data_analysts)
# {'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'}

# Intersection (membres en commun)
print(python_devs & data_analysts)
# {'Bob', 'Diana'}

# Différence (dans Python mais pas Data)
print(python_devs - data_analysts)
# {'Alice', 'Charlie'}

# Différence symétrique (dans l'un OU l'autre, pas les deux)
print(python_devs ^ data_analysts)
# {'Alice', 'Charlie', 'Eve', 'Frank'}
\`\`\`

> [!TIP]
> Les dictionnaires sont la structure idéale pour le **caching** et la **mémoïsation** — stocker les résultats de calculs coûteux pour éviter de les recalculer.

> [!NOTE]
> Les **sets** sont extrêmement rapides pour vérifier l'appartenance (\`in\`). Si vous devez souvent tester si un élément existe dans une grande collection, utilisez un set plutôt qu'une liste.

---

## Exemple Complet : Analyse de Fréquence

\`\`\`python
def analyser_texte(texte):
    """Analyse la fréquence des mots dans un texte."""
    mots = texte.lower().split()

    # Compter les occurrences avec un dict
    frequences = {}
    for mot in mots:
        mot_propre = mot.strip(".,!?;:")
        frequences[mot_propre] = frequences.get(mot_propre, 0) + 1

    # Trier par fréquence
    tries = sorted(frequences.items(), key=lambda x: x[1], reverse=True)

    print(f"Mots uniques : {len(frequences)}")
    print(f"Total de mots : {len(mots)}")
    print("\\nTop 5 des mots les plus fréquents :")
    for mot, count in tries[:5]:
        print(f"  '{mot}' : {count} fois")

texte = """Python est un langage de programmation. Python est simple.
Python est puissant. La programmation Python est agréable."""
analyser_texte(texte)
\``
  }
];

async function main() {
    const course = await prisma.course.findUnique({
        where: { slug: 'python-integral' }
    });

    if (!course) {
        console.error('Cours "python-integral" non trouvé.');
        return;
    }

    console.log(`\nCours trouvé: "${course.title}" (ID: ${course.id})`);
    console.log('--- Enrichissement Partie 1/3 (Leçons 1-7) ---\n');

    for (const data of lessonData) {
        process.stdout.write(`Traitement: "${data.title}"... `);

        let lesson = await prisma.lesson.findFirst({
            where: { courseId: course.id, title: data.title }
        });

        if (!lesson) {
            lesson = await prisma.lesson.create({
                data: {
                    title: data.title,
                    order: data.order,
                    duration: data.duration,
                    courseId: course.id,
                    content: data.content
                }
            });
            process.stdout.write('[CRÉÉE] ');
        } else {
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { content: data.content, order: data.order, duration: data.duration }
            });
            process.stdout.write('[MAJ] ');
        }

        const existing = await prisma.courseContent.findFirst({
            where: { lessonId: lesson.id, contentType: 'text' }
        });

        if (existing) {
            await prisma.courseContent.update({
                where: { id: existing.id },
                data: { content: data.extra, title: "Contenu Détaillé" }
            });
        } else {
            await prisma.courseContent.create({
                data: {
                    lessonId: lesson.id,
                    contentType: 'text',
                    title: "Contenu Détaillé",
                    content: data.extra,
                    order: 1
                }
            });
        }
        console.log('OK');
    }

    console.log('\n✅ Partie 1/3 terminée (leçons 1-7 enrichies).');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
