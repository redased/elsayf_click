const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const lessonData = [
  {
    title: "Programmation Orientée Objet",
    order: 8,
    duration: 65,
    content: "La Programmation Orientée Objet (POO) est un paradigme qui permet de modéliser des entités du monde réel sous forme d'objets possédant des données (attributs) et des comportements (méthodes). Au lieu d'écrire des fonctions isolées, vous organisez votre code en classes qui encapsulent à la fois les données et les opérations qui leur sont associées. C'est la base de tout développement professionnel en Python.",
    extra: `## Classes et Objets — Les Fondamentaux

\`\`\`python
# Une classe est le "plan" ou le "moule"
class Voiture:
    # Attribut de classe (partagé par toutes les instances)
    nombre_roues = 4

    def __init__(self, marque, modele, annee, couleur="Blanc"):
        """Constructeur — appelé à la création de l'objet."""
        # Attributs d'instance (propres à chaque objet)
        self.marque = marque
        self.modele = modele
        self.annee = annee
        self.couleur = couleur
        self.kilometrage = 0
        self._carburant = 100  # _ = convention "semi-privé"

    def __str__(self):
        """Représentation lisible (pour print)."""
        return f"{self.annee} {self.marque} {self.modele} ({self.couleur})"

    def __repr__(self):
        """Représentation officielle (pour le débogage)."""
        return f"Voiture('{self.marque}', '{self.modele}', {self.annee})"

    def rouler(self, km):
        """Simule un trajet."""
        if km <= 0:
            raise ValueError("La distance doit être positive")
        if self._carburant <= 0:
            print("Panne d'essence !")
            return
        self.kilometrage += km
        self._carburant -= km * 0.08  # 8L/100km
        print(f"Trajet de {km} km effectué. Total: {self.kilometrage} km")

    def faire_le_plein(self):
        """Remet le carburant au maximum."""
        self._carburant = 100
        print("Plein fait !")

    @property
    def age(self):
        """Propriété calculée (pas stockée)."""
        return 2024 - self.annee

# Créer des objets (instances)
ma_voiture = Voiture("Peugeot", "208", 2021, "Rouge")
voiture2 = Voiture("Renault", "Clio", 2019)

print(ma_voiture)       # 2021 Peugeot 208 (Rouge)
print(repr(ma_voiture)) # Voiture('Peugeot', '208', 2021)
print(f"Age: {ma_voiture.age} ans")
ma_voiture.rouler(150)
ma_voiture.rouler(200)
\`\`\`

---

## L'Héritage — Réutiliser le Code

\`\`\`python
class Animal:
    """Classe de base."""
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def se_presenter(self):
        return f"Je m'appelle {self.nom}, j'ai {self.age} ans."

    def parler(self):
        return "..."  # Son générique

class Chien(Animal):
    """Hérite d'Animal et ajoute des comportements spécifiques."""
    def __init__(self, nom, age, race):
        super().__init__(nom, age)  # Appelle le constructeur parent
        self.race = race

    def parler(self):
        return "Woof !"  # Override de la méthode parente

    def fetcher(self, objet):
        return f"{self.nom} rapporte le {objet} !"

class Chat(Animal):
    def parler(self):
        return "Miaou !"

    def ronronner(self):
        return f"{self.nom} ronronne..."

# Polymorphisme — même interface, comportements différents
animaux = [
    Chien("Rex", 3, "Labrador"),
    Chat("Mittens", 5),
    Chien("Buddy", 2, "Beagle")
]

for animal in animaux:
    print(f"{animal.nom}: {animal.parler()}")
    # Rex: Woof !
    # Mittens: Miaou !
    # Buddy: Woof !
\`\`\`

---

## Encapsulation et Propriétés

\`\`\`python
class CompteBancaire:
    def __init__(self, titulaire, solde_initial=0):
        self._titulaire = titulaire
        self.__solde = solde_initial  # __ = vraiment privé

    @property
    def solde(self):
        """Getter — lecture du solde."""
        return self.__solde

    @property
    def titulaire(self):
        return self._titulaire

    def deposer(self, montant):
        if montant <= 0:
            raise ValueError("Le montant doit être positif")
        self.__solde += montant
        print(f"Dépôt de {montant}€. Nouveau solde: {self.__solde}€")

    def retirer(self, montant):
        if montant <= 0:
            raise ValueError("Le montant doit être positif")
        if montant > self.__solde:
            raise ValueError("Solde insuffisant")
        self.__solde -= montant
        print(f"Retrait de {montant}€. Nouveau solde: {self.__solde}€")

    def __str__(self):
        return f"Compte de {self._titulaire}: {self.__solde}€"

# Utilisation
compte = CompteBancaire("Alice", 1000)
compte.deposer(500)
compte.retirer(200)
print(compte.solde)  # 1300
print(compte)         # Compte de Alice: 1300€
\`\`\`

---

## Méthodes Spéciales (Dunder Methods)

\`\`\`python
class Vecteur2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vecteur({self.x}, {self.y})"

    def __add__(self, autre):
        return Vecteur2D(self.x + autre.x, self.y + autre.y)

    def __mul__(self, scalaire):
        return Vecteur2D(self.x * scalaire, self.y * scalaire)

    def __len__(self):
        import math
        return int(math.sqrt(self.x**2 + self.y**2))

    def __eq__(self, autre):
        return self.x == autre.x and self.y == autre.y

v1 = Vecteur2D(3, 4)
v2 = Vecteur2D(1, 2)

print(v1 + v2)   # Vecteur(4, 6)
print(v1 * 3)    # Vecteur(9, 12)
print(len(v1))   # 5 (norme)
print(v1 == v2)  # False
\`\`\`

> [!IMPORTANT]
> Ne complexifiez pas à l'excès ! La POO est un excellent outil d'organisation, mais un simple script n'a pas besoin de classes. Utilisez-les quand vous gérez des entités avec état et comportements complexes.

---

## Exercice : Système de Bibliothèque

\`\`\`python
class Livre:
    def __init__(self, titre, auteur, isbn):
        self.titre = titre
        self.auteur = auteur
        self.isbn = isbn
        self.disponible = True

    def __str__(self):
        statut = "Disponible" if self.disponible else "Emprunté"
        return f'"{self.titre}" par {self.auteur} [{statut}]'

class Bibliotheque:
    def __init__(self, nom):
        self.nom = nom
        self.livres = {}

    def ajouter_livre(self, livre):
        self.livres[livre.isbn] = livre
        print(f"✅ '{livre.titre}' ajouté")

    def emprunter(self, isbn):
        livre = self.livres.get(isbn)
        if not livre:
            print("Livre non trouvé")
        elif not livre.disponible:
            print(f"'{livre.titre}' est déjà emprunté")
        else:
            livre.disponible = False
            print(f"📖 Vous avez emprunté '{livre.titre}'")

    def retourner(self, isbn):
        livre = self.livres.get(isbn)
        if livre:
            livre.disponible = True
            print(f"✅ '{livre.titre}' retourné")

    def afficher_disponibles(self):
        dispo = [l for l in self.livres.values() if l.disponible]
        print(f"\\n{len(dispo)} livre(s) disponible(s) :")
        for livre in dispo:
            print(f"  - {livre}")

# Test
bib = Bibliotheque("BiblioPython")
bib.ajouter_livre(Livre("Python Crash Course", "Eric Matthes", "978-1"))
bib.ajouter_livre(Livre("Fluent Python", "Luciano Ramalho", "978-2"))
bib.emprunter("978-1")
bib.afficher_disponibles()
\``
  },
  {
    title: "Gestion des Erreurs",
    order: 9,
    duration: 50,
    content: "Les erreurs sont inévitables dans tout programme — fichier manquant, saisie utilisateur invalide, connexion réseau coupée... La différence entre un développeur junior et un senior réside souvent dans la capacité à anticiper et gérer ces situations avec élégance. Python offre un mécanisme puissant de gestion d'exceptions qui permet à votre programme de réagir intelligemment aux problèmes au lieu de planter.",
    extra: `## Les Exceptions en Python

Une exception est un événement qui interrompt le déroulement normal d'un programme. Python possède une hiérarchie d'exceptions intégrées :

\`\`\`
BaseException
├── SystemExit
├── KeyboardInterrupt
└── Exception
    ├── ValueError      — Valeur incorrecte
    ├── TypeError       — Mauvais type
    ├── KeyError        — Clé de dict inexistante
    ├── IndexError      — Index hors limites
    ├── FileNotFoundError — Fichier introuvable
    ├── ZeroDivisionError — Division par zéro
    ├── AttributeError  — Attribut inexistant
    ├── ImportError     — Module introuvable
    └── PermissionError — Droits insuffisants
\`\`\`

---

## La Structure try/except/else/finally

\`\`\`python
def diviser(a, b):
    try:
        # Code qui peut échouer
        resultat = a / b
    except ZeroDivisionError:
        # Erreur spécifique : division par zéro
        print("Erreur : Division par zéro impossible !")
        return None
    except TypeError as e:
        # Erreur de type avec le message original
        print(f"Erreur de type : {e}")
        return None
    else:
        # Exécuté UNIQUEMENT si aucune exception n'est levée
        print(f"{a} / {b} = {resultat}")
        return resultat
    finally:
        # Exécuté TOUJOURS (avec ou sans erreur)
        print("Opération terminée.")

diviser(10, 2)    # 10 / 2 = 5.0 — Opération terminée.
diviser(10, 0)    # Erreur: Division par zéro — Opération terminée.
diviser("a", 2)   # Erreur de type — Opération terminée.
\`\`\`

---

## Capturer Plusieurs Exceptions

\`\`\`python
def lire_entier_utilisateur():
    while True:
        try:
            valeur = int(input("Entrez un nombre entier positif : "))
            if valeur <= 0:
                raise ValueError("Le nombre doit être positif")
            return valeur
        except ValueError as e:
            print(f"Saisie invalide : {e}. Réessayez.")
        except KeyboardInterrupt:
            print("\\nOpération annulée par l'utilisateur.")
            return None

# Capturer plusieurs types à la fois
try:
    data = {"clé": "valeur"}
    print(data["autre"])
except (KeyError, IndexError) as e:
    print(f"Erreur d'accès : {e}")
\`\`\`

---

## Exceptions Personnalisées

\`\`\`python
# Créer ses propres exceptions
class ErreurAge(ValueError):
    """Exception pour un âge invalide."""
    def __init__(self, age):
        self.age = age
        super().__init__(f"Âge invalide : {age}. Doit être entre 0 et 150.")

class ErreurSoldeInsuffisant(Exception):
    """Exception pour un retrait impossible."""
    def __init__(self, montant, solde):
        self.montant = montant
        self.solde = solde
        super().__init__(
            f"Impossible de retirer {montant}€. Solde disponible : {solde}€"
        )

def valider_age(age):
    if not isinstance(age, int):
        raise TypeError(f"L'âge doit être un entier, pas {type(age).__name__}")
    if not (0 <= age <= 150):
        raise ErreurAge(age)
    return age

# Test
try:
    valider_age(-5)
except ErreurAge as e:
    print(f"Erreur métier : {e}")
    print(f"Âge soumis : {e.age}")

try:
    valider_age("vingt")
except TypeError as e:
    print(f"Erreur de type : {e}")
\`\`\`

---

## Les Context Managers (with)

\`\`\`python
# Le gestionnaire de contexte garantit la libération des ressources
# Même si une exception se produit !

# Lecture de fichier (safe)
try:
    with open("mon_fichier.txt", "r", encoding="utf-8") as f:
        contenu = f.read()
        print(contenu)
except FileNotFoundError:
    print("Le fichier n'existe pas.")
except PermissionError:
    print("Pas les droits pour lire ce fichier.")

# Écriture de fichier (safe)
donnees = ["ligne 1\\n", "ligne 2\\n", "ligne 3\\n"]
with open("sortie.txt", "w", encoding="utf-8") as f:
    f.writelines(donnees)
print("Fichier écrit avec succès")

# Créer son propre context manager
from contextlib import contextmanager

@contextmanager
def mesurer_temps(nom_operation):
    import time
    print(f"Début : {nom_operation}")
    debut = time.time()
    try:
        yield
    finally:
        duree = time.time() - debut
        print(f"Fin : {nom_operation} ({duree:.3f}s)")

with mesurer_temps("Calcul intensif"):
    total = sum(range(1_000_000))
\`\`\`

---

## Bonnes Pratiques

\`\`\`python
# ❌ MAUVAIS : except trop générique
try:
    resultat = 10 / 0
except:  # Capture TOUT, même KeyboardInterrupt !
    pass  # Silencieux = dangereux

# ✅ BON : exceptions spécifiques
try:
    resultat = 10 / 0
except ZeroDivisionError:
    print("Division par zéro")

# ❌ MAUVAIS : code défensif excessif
def obtenir_valeur(d, cle):
    try:
        return d[cle]
    except:
        return None

# ✅ BON : utiliser .get()
def obtenir_valeur(d, cle, defaut=None):
    return d.get(cle, defaut)

# Logging des erreurs (pratique professionnelle)
import logging
logging.basicConfig(level=logging.ERROR)

try:
    resultat = int("texte_invalide")
except ValueError as e:
    logging.error(f"Conversion impossible : {e}", exc_info=True)
\`\`\`

> [!CAUTION]
> N'utilisez **jamais** un \`except\` vide ou un \`except Exception: pass\`. Cela masque les bugs et rend le débogage cauchemardesque. Attrapez toujours des exceptions **spécifiques**.

---

## Exercice : Parseur de Fichier CSV Robuste

\`\`\`python
import csv

def lire_notes_csv(chemin_fichier):
    """Lit un fichier CSV de notes avec gestion d'erreurs complète."""
    notes = []
    erreurs = []

    try:
        with open(chemin_fichier, "r", encoding="utf-8") as f:
            lecteur = csv.DictReader(f)
            for i, ligne in enumerate(lecteur, start=2):
                try:
                    nom = ligne["nom"].strip()
                    note = float(ligne["note"])
                    if not (0 <= note <= 20):
                        raise ValueError(f"Note hors limites : {note}")
                    notes.append({"nom": nom, "note": note})
                except (KeyError, ValueError) as e:
                    erreurs.append(f"Ligne {i}: {e}")
    except FileNotFoundError:
        print(f"Fichier '{chemin_fichier}' introuvable")
        return None, None

    if erreurs:
        print(f"⚠️  {len(erreurs)} erreur(s) détectée(s) :")
        for err in erreurs:
            print(f"  - {err}")

    return notes, erreurs

# notes, erreurs = lire_notes_csv("notes_classe.csv")
\``
  },
  {
    title: "Fichiers et Modules",
    order: 10,
    duration: 55,
    content: "Votre code n'existe pas en vase clos — il interagit avec des fichiers, des bases de données, et d'autres bibliothèques. La gestion de fichiers est fondamentale pour persister des données, lire des configurations, et traiter des jeux de données. Les modules et packages permettent d'organiser votre code en composants réutilisables et d'accéder à l'immense écosystème Python via pip.",
    extra: `## Lire et Écrire des Fichiers Texte

\`\`\`python
# Modes d'ouverture des fichiers :
# 'r'  — Lecture (défaut)
# 'w'  — Écriture (écrase le fichier existant)
# 'a'  — Ajout à la fin (append)
# 'x'  — Création exclusive (erreur si fichier existe)
# 'b'  — Mode binaire (rb, wb pour images, etc.)
# '+'  — Lecture et écriture (r+, w+)

# Écrire un fichier
with open("journal.txt", "w", encoding="utf-8") as f:
    f.write("Ligne 1 : Introduction à Python\\n")
    f.write("Ligne 2 : Variables et types\\n")

    lignes = ["Ligne 3 : Boucles\\n", "Ligne 4 : Fonctions\\n"]
    f.writelines(lignes)

# Lire tout le fichier
with open("journal.txt", "r", encoding="utf-8") as f:
    contenu = f.read()
    print(contenu)

# Lire ligne par ligne (efficace pour les gros fichiers)
with open("journal.txt", "r", encoding="utf-8") as f:
    for i, ligne in enumerate(f, start=1):
        print(f"{i}: {ligne.strip()}")

# Lire toutes les lignes dans une liste
with open("journal.txt", "r", encoding="utf-8") as f:
    lignes = f.readlines()
    print(f"{len(lignes)} lignes lues")
\`\`\`

---

## Fichiers CSV — Données Tabulaires

\`\`\`python
import csv

# Écrire un CSV
etudiants = [
    {"nom": "Alice", "note": 18, "matiere": "Python"},
    {"nom": "Bob", "note": 15, "matiere": "Python"},
    {"nom": "Charlie", "note": 12, "matiere": "Python"},
]

with open("notes.csv", "w", newline="", encoding="utf-8") as f:
    champs = ["nom", "note", "matiere"]
    writer = csv.DictWriter(f, fieldnames=champs)
    writer.writeheader()
    writer.writerows(etudiants)

# Lire un CSV
with open("notes.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['nom']}: {row['note']}/20 en {row['matiere']}")
\`\`\`

---

## Fichiers JSON — Échange de Données

\`\`\`python
import json

# Données Python
config = {
    "version": "1.0.0",
    "debug": False,
    "serveur": {
        "host": "localhost",
        "port": 8080
    },
    "utilisateurs_admins": ["alice", "bob"]
}

# Écrire en JSON
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

# Lire un JSON
with open("config.json", "r", encoding="utf-8") as f:
    config_lu = json.load(f)
    print(config_lu["serveur"]["port"])  # 8080

# Convertir en chaîne JSON (utile pour les APIs)
chaine_json = json.dumps(config, indent=2)
print(chaine_json)

# Convertir depuis une chaîne JSON
data = json.loads('{"nom": "Alice", "age": 30}')
print(data["nom"])  # Alice
\`\`\`

---

## Gestion des Chemins avec pathlib

\`\`\`python
from pathlib import Path

# Créer des chemins
dossier_data = Path("data")
fichier = dossier_data / "notes.csv"   # Opérateur / pour combiner les chemins

# Opérations sur les chemins
print(fichier.name)       # notes.csv
print(fichier.stem)       # notes
print(fichier.suffix)     # .csv
print(fichier.parent)     # data
print(fichier.absolute()) # Chemin absolu

# Créer des dossiers
dossier_data.mkdir(parents=True, exist_ok=True)

# Lister les fichiers
for chemin in Path(".").iterdir():
    if chemin.is_file() and chemin.suffix == ".py":
        print(chemin.name)

# Vérifications
print(fichier.exists())   # True/False
print(fichier.is_file())  # True/False
print(fichier.is_dir())   # True/False
\`\`\`

---

## Créer et Importer des Modules

\`\`\`python
# Fichier: math_utils.py
"""Module utilitaire pour les calculs mathématiques."""

PI = 3.14159265358979

def aire_cercle(rayon):
    """Calcule l'aire d'un cercle."""
    return PI * rayon ** 2

def perimetre_cercle(rayon):
    """Calcule le périmètre d'un cercle."""
    return 2 * PI * rayon

def est_premier(n):
    """Vérifie si un nombre est premier."""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# ---- Dans un autre fichier : main.py ----
# import math_utils
# print(math_utils.aire_cercle(5))

# from math_utils import aire_cercle, est_premier
# print(aire_cercle(5))
# print(est_premier(17))  # True

# Le bloc if __name__ == "__main__" est crucial !
# Il permet au fichier d'être importé SANS exécuter le code de test
if __name__ == "__main__":
    print("Tests du module math_utils :")
    print(f"Aire cercle r=5 : {aire_cercle(5):.2f}")
    print(f"17 est premier : {est_premier(17)}")
\`\`\`

---

## La Standard Library — Les Modules Essentiels

\`\`\`python
import os           # Interaction avec le système d'exploitation
import sys          # Paramètres de l'interpréteur
import datetime     # Gestion des dates et heures
import math         # Fonctions mathématiques avancées
import random       # Génération de nombres aléatoires
import re           # Expressions régulières
import collections  # Structures de données avancées
import itertools    # Outils d'itération avancée
import functools    # Outils de programmation fonctionnelle

# Exemples pratiques
from datetime import datetime, timedelta

maintenant = datetime.now()
print(f"Date et heure : {maintenant.strftime('%d/%m/%Y %H:%M')}")

dans_30_jours = maintenant + timedelta(days=30)
print(f"Dans 30 jours : {dans_30_jours.strftime('%d/%m/%Y')}")

# Collections utiles
from collections import Counter, defaultdict, deque

# Counter — compter des éléments
votes = ["Python", "Java", "Python", "JS", "Python", "Java"]
compteur = Counter(votes)
print(compteur.most_common(2))  # [('Python', 3), ('Java', 2)]

# defaultdict — dict avec valeur par défaut
groupes = defaultdict(list)
for nom, groupe in [("Alice", "A"), ("Bob", "B"), ("Charlie", "A")]:
    groupes[groupe].append(nom)
print(dict(groupes))  # {'A': ['Alice', 'Charlie'], 'B': ['Bob']}
\`\`\`

---

## Installer des Packages avec pip

\`\`\`bash
# Installer un package
pip install requests

# Installer une version spécifique
pip install pandas==2.1.0

# Lister les packages installés
pip list

# Sauvegarder les dépendances
pip freeze > requirements.txt

# Installer depuis requirements.txt
pip install -r requirements.txt
\`\`\`

> [!TIP]
> Utilisez **toujours** des **environnements virtuels** pour isoler les dépendances de vos projets : \`python -m venv env\` puis \`source env/bin/activate\` (Linux/Mac) ou \`env\\Scripts\\activate\` (Windows).

---

## Exercice : Gestionnaire de Tâches avec Persistence

\`\`\`python
import json
from pathlib import Path

class GestionnaireTaches:
    def __init__(self, fichier="taches.json"):
        self.fichier = Path(fichier)
        self.taches = self._charger()

    def _charger(self):
        if self.fichier.exists():
            with open(self.fichier, "r") as f:
                return json.load(f)
        return []

    def _sauvegarder(self):
        with open(self.fichier, "w") as f:
            json.dump(self.taches, f, indent=2)

    def ajouter(self, titre, priorite="normale"):
        tache = {"id": len(self.taches) + 1, "titre": titre,
                 "priorite": priorite, "termine": False}
        self.taches.append(tache)
        self._sauvegarder()
        print(f"✅ Tâche ajoutée : '{titre}'")

    def terminer(self, id_tache):
        for t in self.taches:
            if t["id"] == id_tache:
                t["termine"] = True
                self._sauvegarder()
                return print(f"✔️  Tâche {id_tache} terminée")
        print("Tâche non trouvée")

    def afficher(self):
        print("\\n=== MES TÂCHES ===")
        for t in self.taches:
            statut = "✔" if t["termine"] else "○"
            print(f"[{statut}] #{t['id']} {t['titre']} ({t['priorite']})")

gt = GestionnaireTaches()
gt.ajouter("Apprendre Python", "haute")
gt.ajouter("Faire le TP NumPy", "haute")
gt.ajouter("Lire documentation", "normale")
gt.terminer(1)
gt.afficher()
\``
  },
  {
    title: "NumPy - Calcul Scientifique",
    order: 11,
    duration: 65,
    content: "NumPy (Numerical Python) est la bibliothèque fondamentale de la Data Science en Python. Elle introduit un objet essentiel — le **ndarray** (tableau multidimensionnel) — qui permet d'effectuer des calculs numériques sur des millions de données en une fraction de seconde grâce à la vectorisation. Tous les grands outils de l'IA (TensorFlow, PyTorch, Pandas, Scikit-Learn) reposent sur NumPy.",
    extra: `## Installation et Import

\`\`\`bash
pip install numpy
\`\`\`

\`\`\`python
import numpy as np
print(np.__version__)  # 1.26.x
\`\`\`

---

## Créer des Arrays NumPy

\`\`\`python
import numpy as np

# Depuis une liste Python
a = np.array([1, 2, 3, 4, 5])
print(a)          # [1 2 3 4 5]
print(a.dtype)    # int64
print(a.shape)    # (5,)
print(a.ndim)     # 1 (1 dimension)

# Tableau 2D (matrice)
M = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
print(M.shape)  # (3, 3)
print(M.ndim)   # 2

# Fonctions de création
zeros = np.zeros((3, 4))         # Matrice 3x4 de zéros
uns = np.ones((2, 3))            # Matrice 2x3 de uns
identite = np.eye(4)             # Matrice identité 4x4
aleatoire = np.random.rand(3, 3) # Valeurs aléatoires [0, 1)
entiers = np.arange(0, 10, 2)   # [0, 2, 4, 6, 8] (comme range)
lineaire = np.linspace(0, 1, 5)  # [0.0, 0.25, 0.5, 0.75, 1.0]
\`\`\`

---

## Opérations Vectorisées — La Magie de NumPy

\`\`\`python
import numpy as np

# LISTES Python (lent pour les gros volumes)
liste = list(range(1_000_000))
# Pour multiplier par 2 : [x * 2 for x in liste]

# NUMPY (ultra-rapide grâce aux opérations C en dessous)
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

print(a * 2)          # [ 2  4  6  8 10]
print(a + b)          # [11 22 33 44 55]
print(a ** 2)         # [ 1  4  9 16 25]
print(np.sqrt(a))     # [1.   1.41 1.73 2.   2.24]

# Fonctions universelles (ufuncs)
angles = np.array([0, np.pi/2, np.pi])
print(np.sin(angles))  # [0. 1. 0.]
print(np.cos(angles))  # [ 1.  0. -1.]
print(np.exp([1, 2, 3]))  # [e, e², e³]
print(np.log([1, np.e, np.e**2]))  # [0. 1. 2.]

# Statistiques
data = np.array([14, 17, 12, 18, 11, 15, 16, 13])
print(f"Moyenne : {np.mean(data):.2f}")
print(f"Médiane : {np.median(data)}")
print(f"Écart-type : {np.std(data):.2f}")
print(f"Variance : {np.var(data):.2f}")
print(f"Min/Max : {np.min(data)} / {np.max(data)}")
print(f"Somme : {np.sum(data)}")
print(f"Centiles : {np.percentile(data, [25, 50, 75])}")
\`\`\`

---

## Indexation et Slicing

\`\`\`python
import numpy as np

M = np.array([[1, 2, 3, 4],
              [5, 6, 7, 8],
              [9, 10, 11, 12]])

# Accès à un élément
print(M[1, 2])    # 7 (ligne 1, colonne 2)
print(M[0, -1])   # 4 (première ligne, dernière colonne)

# Slicing
print(M[0, :])    # [1 2 3 4] (première ligne entière)
print(M[:, 1])    # [ 2  6 10] (deuxième colonne)
print(M[1:, 2:])  # [[7 8], [11 12]] (sous-matrice)

# Indexation booléenne (filtrage)
data = np.array([3, 7, 1, 9, 4, 6, 2, 8, 5])
print(data[data > 5])           # [7 9 6 8] — valeurs > 5
print(data[(data > 3) & (data < 7)])  # [4 6 5] — entre 3 et 7

# Fancy indexing
indices = [0, 2, 4]
print(data[indices])  # [3 1 4] — éléments aux indices donnés
\`\`\`

---

## Manipulation de Formes

\`\`\`python
import numpy as np

a = np.arange(12)  # [0, 1, 2, ..., 11]

# Reshape — changer les dimensions
M = a.reshape(3, 4)   # 3 lignes, 4 colonnes
print(M)

# -1 = Python calcule automatiquement
M2 = a.reshape(2, -1)  # 2 lignes, 6 colonnes
M3 = a.reshape(-1, 3)  # 4 lignes, 3 colonnes

# Aplatir
print(M.flatten())    # Retourne une copie 1D
print(M.ravel())      # Retourne une vue 1D (plus efficace)

# Transposer
print(M.T)            # Transposée

# Concaténer des arrays
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(np.concatenate([a, b], axis=0))  # Empiler en hauteur
print(np.vstack([a, b]))               # Idem
print(np.hstack([a, b]))               # Côte à côte
\`\`\`

---

## Broadcasting — Opérations entre Arrays de Formes Différentes

\`\`\`python
import numpy as np

# Normaliser une matrice de notes (chaque ligne = un étudiant)
notes = np.array([[14, 16, 18],
                  [12, 15, 11],
                  [17, 13, 19]])

# Moyenne par colonne (par matière)
moyennes_matieres = np.mean(notes, axis=0)
print("Moyennes par matière:", moyennes_matieres)  # [14.33 14.67 16.]

# Centrer les notes par matière (broadcasting automatique)
notes_centrees = notes - moyennes_matieres
print("Notes centrées:\\n", notes_centrees)
\`\`\`

---

## Algèbre Linéaire

\`\`\`python
import numpy as np

A = np.array([[2, 1], [1, 3]])
B = np.array([[1, 0], [0, 1]])

# Produit matriciel
print(A @ B)           # Équivalent à np.dot(A, B)
print(np.dot(A, B))

# Valeurs et vecteurs propres
valeurs, vecteurs = np.linalg.eig(A)
print("Valeurs propres:", valeurs)

# Déterminant
print("Déterminant:", np.linalg.det(A))

# Inverse
print("Inverse:\\n", np.linalg.inv(A))

# Résoudre un système Ax = b
b = np.array([5, 10])
x = np.linalg.solve(A, b)
print("Solution x:", x)
\`\`\`

> [!NOTE]
> NumPy est environ **50x plus rapide** qu'une liste Python pour les opérations numériques sur de gros volumes de données, car il stocke les données de manière contiguë en mémoire et utilise du code C optimisé.

---

## Exercice : Simulation Monte Carlo

\`\`\`python
import numpy as np

def estimer_pi(n_points=1_000_000):
    """Estime π avec la méthode Monte Carlo."""
    # Générer des points aléatoires dans le carré [-1, 1] x [-1, 1]
    x = np.random.uniform(-1, 1, n_points)
    y = np.random.uniform(-1, 1, n_points)

    # Compter les points dans le cercle unité
    distances = np.sqrt(x**2 + y**2)
    dans_cercle = np.sum(distances <= 1)

    pi_estime = 4 * dans_cercle / n_points
    return pi_estime

for n in [1_000, 10_000, 100_000, 1_000_000]:
    pi = estimer_pi(n)
    print(f"n={n:>10,} | π ≈ {pi:.6f} | Erreur: {abs(pi - np.pi):.6f}")
\``
  },
  {
    title: "Pandas - Manipulation de Données",
    order: 12,
    duration: 70,
    content: "Pandas est l'outil incontournable de tout Data Scientist Python. Il introduit deux structures de données clés — la **Series** (colonne) et le **DataFrame** (tableau) — qui transforment Python en un outil d'analyse de données aussi puissant qu'Excel, mais infiniment plus flexible et automatisable. Dans la pratique, 70% du travail en Data Science consiste à nettoyer et préparer les données — c'est exactement ce que Pandas excelle à faire.",
    extra: `## Installation et Import

\`\`\`bash
pip install pandas openpyxl
\`\`\`

\`\`\`python
import pandas as pd
import numpy as np
print(pd.__version__)
\`\`\`

---

## Series — Une Colonne de Données

\`\`\`python
import pandas as pd

# Créer une Series
notes = pd.Series([14, 17, 12, 18, 11], name="Notes")
print(notes)
# 0    14
# 1    17
# ...

# Avec un index personnalisé
etudiants = pd.Series(
    [14, 17, 12, 18],
    index=["Alice", "Bob", "Charlie", "Diana"],
    name="Notes Python"
)
print(etudiants["Alice"])  # 14
print(etudiants[etudiants >= 15])  # Filtrage

# Statistiques
print(etudiants.mean())    # 15.25
print(etudiants.describe()) # Résumé complet
\`\`\`

---

## DataFrame — Le Tableau de Données

\`\`\`python
# Créer un DataFrame depuis un dictionnaire
data = {
    "Nom": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "Age": [23, 28, 22, 31, 25],
    "Ville": ["Paris", "Lyon", "Paris", "Marseille", "Lyon"],
    "Python": [18, 15, 12, 17, 14],
    "SQL": [16, 18, 11, 15, 13],
    "Salaire": [45000, 55000, 38000, 62000, 48000]
}

df = pd.DataFrame(data)
print(df)
print(f"\\nDimensions : {df.shape}")   # (5, 6)
print(f"Colonnes : {list(df.columns)}")
print(f"\\nAperçu des types :\\n{df.dtypes}")
\`\`\`

---

## Lire et Écrire des Fichiers

\`\`\`python
import pandas as pd

# Lire un CSV
df = pd.read_csv("donnees.csv", encoding="utf-8", sep=",")

# Avec options avancées
df = pd.read_csv(
    "donnees.csv",
    sep=";",
    decimal=",",          # Pour les fichiers français
    parse_dates=["date"], # Convertir en datetime
    usecols=["nom", "age", "salaire"],  # Ne lire que certaines colonnes
    nrows=1000            # Lire seulement les 1000 premières lignes
)

# Lire un Excel
df = pd.read_excel("rapport.xlsx", sheet_name="Données 2024")

# Écrire
df.to_csv("resultat.csv", index=False, encoding="utf-8")
df.to_excel("rapport_propre.xlsx", index=False, sheet_name="Résultats")
df.to_json("data.json", orient="records", indent=2)
\`\`\`

---

## Explorer et Inspecter les Données

\`\`\`python
df = pd.read_csv("donnees.csv")

# Premières/dernières lignes
print(df.head(5))   # 5 premières
print(df.tail(3))   # 3 dernières

# Résumé
print(df.info())    # Types, valeurs nulles, mémoire
print(df.describe())  # Statistiques descriptives (count, mean, std, etc.)

# Valeurs manquantes
print(df.isnull().sum())        # Nombre de NaN par colonne
print(df.isnull().sum() / len(df) * 100)  # Pourcentage

# Valeurs uniques
print(df["Ville"].unique())      # ['Paris', 'Lyon', 'Marseille']
print(df["Ville"].value_counts()) # Fréquence de chaque valeur
print(df["Ville"].nunique())      # 3 (nombre de valeurs uniques)
\`\`\`

---

## Sélection et Filtrage

\`\`\`python
# Sélectionner des colonnes
print(df["Nom"])                        # Une colonne (Series)
print(df[["Nom", "Python", "SQL"]])    # Plusieurs colonnes (DataFrame)

# Sélectionner par index
print(df.iloc[0])           # Première ligne (par position)
print(df.iloc[0:3])         # Lignes 0, 1, 2
print(df.iloc[1, 2])        # Ligne 1, Colonne 2

# Sélectionner par étiquette
df.index = df["Nom"]        # Utiliser Nom comme index
print(df.loc["Alice"])      # Ligne avec l'index "Alice"
print(df.loc["Alice", "Python"])

# Filtrage conditionnel
admis = df[df["Python"] >= 14]
parisiens = df[df["Ville"] == "Paris"]
top = df[(df["Python"] >= 15) & (df["Age"] < 30)]

# isin — filtre sur plusieurs valeurs
grandes_villes = df[df["Ville"].isin(["Paris", "Lyon"])]
\`\`\`

---

## Nettoyage des Données

\`\`\`python
# Gérer les valeurs manquantes
df.dropna()                    # Supprimer toutes les lignes avec NaN
df.dropna(subset=["Salaire"]) # Supprimer seulement si Salaire est NaN
df.fillna(0)                   # Remplacer NaN par 0
df["Age"].fillna(df["Age"].mean())  # Remplacer par la moyenne

# Supprimer les doublons
df.drop_duplicates()
df.drop_duplicates(subset=["Nom"])

# Renommer des colonnes
df.rename(columns={"Python": "Note_Python", "SQL": "Note_SQL"}, inplace=True)

# Changer les types
df["Age"] = df["Age"].astype(int)
df["Date"] = pd.to_datetime(df["Date"], format="%d/%m/%Y")

# Nettoyer des chaînes
df["Nom"] = df["Nom"].str.strip()
df["Ville"] = df["Ville"].str.lower().str.capitalize()

# Remplacer des valeurs
df["Ville"] = df["Ville"].replace({"Marseille": "Aix-Marseille"})
\`\`\`

---

## GroupBy — Agrégation par Groupe

\`\`\`python
# Moyenne des notes par ville
print(df.groupby("Ville")["Python"].mean())

# Plusieurs agrégations
stats = df.groupby("Ville").agg({
    "Python": ["mean", "min", "max", "count"],
    "Salaire": "mean"
})
print(stats)

# Compter les occurrences
print(df.groupby("Ville").size())

# Agréger avec une fonction personnalisée
def ecart_interquartile(x):
    return x.quantile(0.75) - x.quantile(0.25)

df.groupby("Ville")["Python"].agg(ecart_interquartile)
\`\`\`

---

## Cas Pratique : Analyse Complète

\`\`\`python
import pandas as pd
import numpy as np

# Création d'un jeu de données fictif
np.random.seed(42)
n = 200

df = pd.DataFrame({
    "etudiant_id": range(1, n+1),
    "age": np.random.randint(18, 35, n),
    "ville": np.random.choice(["Paris", "Lyon", "Marseille", "Toulouse"], n),
    "formation": np.random.choice(["Data Science", "Dev Web", "Cybersec"], n),
    "note_python": np.random.randint(8, 20, n),
    "note_sql": np.random.randint(7, 20, n),
    "salaire_embauche": np.random.randint(32000, 75000, n)
})

# Analyse
print("=== ANALYSE DES ÉTUDIANTS ===\\n")
print(f"Total étudiants : {len(df)}")
print(f"\\nMoyenne générale Python : {df['note_python'].mean():.1f}/20")
print(f"Taux de réussite (>= 10) : {(df['note_python'] >= 10).mean()*100:.1f}%")

print("\\n--- Moyennes par formation ---")
print(df.groupby("formation")[["note_python", "note_sql"]].mean().round(1))

print("\\n--- Corrélation notes/salaire ---")
print(df[["note_python", "note_sql", "salaire_embauche"]].corr().round(3))
\`\`\`

> [!TIP]
> Utilisez **\`df.copy()\`** avant de modifier un DataFrame pour éviter les avertissements \`SettingWithCopyWarning\`. Travaillez toujours sur une copie, pas sur une vue.`
  },
  {
    title: "Visualisation avec Matplotlib",
    order: 13,
    duration: 60,
    content: "Une visualisation bien conçue peut communiquer en quelques secondes ce que des pages de chiffres ne parviendraient pas à transmettre. Matplotlib est la bibliothèque de visualisation de référence en Python, et Seaborn (construite dessus) permet de créer des graphiques statistiques élégants avec très peu de code. Maîtriser la dataviz est une compétence clé pour tout Data Analyst.",
    extra: `## Installation

\`\`\`bash
pip install matplotlib seaborn
\`\`\`

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
\`\`\`

---

## Les Graphiques Essentiels avec Matplotlib

### Graphique en Ligne (Line Plot)

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Données
x = np.linspace(0, 2 * np.pi, 200)
y_sin = np.sin(x)
y_cos = np.cos(x)

fig, ax = plt.subplots(figsize=(10, 5))

ax.plot(x, y_sin, color='blue', linewidth=2, linestyle='-', label='sin(x)')
ax.plot(x, y_cos, color='red', linewidth=2, linestyle='--', label='cos(x)')

ax.set_title("Fonctions Trigonométriques", fontsize=16, fontweight='bold')
ax.set_xlabel("x (radians)")
ax.set_ylabel("y")
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3)
ax.axhline(y=0, color='black', linewidth=0.8)

plt.tight_layout()
plt.savefig("trig.png", dpi=150, bbox_inches='tight')
plt.show()
\`\`\`

### Graphique en Barres

\`\`\`python
import matplotlib.pyplot as plt

formations = ["Data Science", "Dev Web", "Cybersec", "Cloud", "IA/ML"]
inscrits = [245, 312, 178, 203, 289]
couleurs = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']

fig, ax = plt.subplots(figsize=(10, 6))

barres = ax.bar(formations, inscrits, color=couleurs, width=0.6, edgecolor='white')

# Ajouter les valeurs sur les barres
for barre in barres:
    hauteur = barre.get_height()
    ax.text(barre.get_x() + barre.get_width()/2., hauteur + 5,
            f'{hauteur}', ha='center', va='bottom', fontweight='bold')

ax.set_title("Inscriptions par Formation — 2024", fontsize=15, pad=20)
ax.set_xlabel("Formation")
ax.set_ylabel("Nombre d'inscrits")
ax.set_ylim(0, max(inscrits) * 1.15)
ax.grid(axis='y', alpha=0.3)
plt.xticks(rotation=15, ha='right')
plt.tight_layout()
plt.show()
\`\`\`

### Histogramme

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

notes = np.random.normal(loc=13.5, scale=2.8, size=500)
notes = np.clip(notes, 0, 20)

fig, ax = plt.subplots(figsize=(9, 5))

ax.hist(notes, bins=20, color='#3498db', edgecolor='white',
        alpha=0.8, density=False)

ax.axvline(np.mean(notes), color='red', linestyle='--',
           linewidth=2, label=f'Moyenne: {np.mean(notes):.1f}')
ax.axvline(np.median(notes), color='green', linestyle='-.',
           linewidth=2, label=f'Médiane: {np.median(notes):.1f}')

ax.set_title("Distribution des Notes", fontsize=14)
ax.set_xlabel("Note /20")
ax.set_ylabel("Nombre d'étudiants")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
\`\`\`

### Nuage de Points (Scatter Plot)

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
heures_etude = np.random.uniform(1, 10, 80)
notes = 5 + heures_etude * 1.3 + np.random.normal(0, 1.5, 80)
notes = np.clip(notes, 0, 20)

fig, ax = plt.subplots(figsize=(8, 6))

scatter = ax.scatter(heures_etude, notes, c=notes, cmap='RdYlGn',
                     s=80, alpha=0.7, edgecolors='gray', linewidth=0.5)

plt.colorbar(scatter, ax=ax, label='Note /20')

# Ligne de tendance
z = np.polyfit(heures_etude, notes, 1)
p = np.poly1d(z)
x_line = np.linspace(1, 10, 100)
ax.plot(x_line, p(x_line), "r--", alpha=0.8, linewidth=2, label='Tendance')

ax.set_title("Heures d'étude vs Note obtenue", fontsize=14)
ax.set_xlabel("Heures d'étude par semaine")
ax.set_ylabel("Note /20")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
\`\`\`

---

## Subplots — Plusieurs Graphiques

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.suptitle("Tableau de Bord — Analyse des Données", fontsize=16, fontweight='bold')

x = np.linspace(0, 10, 100)

# Graphique 1
axes[0, 0].plot(x, np.sin(x), 'b-', linewidth=2)
axes[0, 0].set_title("Fonction Sinus")
axes[0, 0].grid(alpha=0.3)

# Graphique 2
data_bar = {"A": 30, "B": 45, "C": 22, "D": 38}
axes[0, 1].bar(data_bar.keys(), data_bar.values(), color='coral')
axes[0, 1].set_title("Répartition par Catégorie")

# Graphique 3
data_hist = np.random.normal(0, 1, 1000)
axes[1, 0].hist(data_hist, bins=30, color='green', alpha=0.7)
axes[1, 0].set_title("Distribution Normale")

# Graphique 4 — Camembert
labels = ["Python", "SQL", "Excel", "Autre"]
tailles = [45, 25, 20, 10]
axes[1, 1].pie(tailles, labels=labels, autopct='%1.1f%%',
               colors=['#3498db', '#2ecc71', '#e74c3c', '#f39c12'])
axes[1, 1].set_title("Compétences Demandées")

plt.tight_layout()
plt.savefig("dashboard.png", dpi=150)
plt.show()
\`\`\`

---

## Seaborn — Graphiques Statistiques Élégants

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Charger un dataset exemple
df = sns.load_dataset("iris")

# Heatmap de corrélation
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Heatmap
corr = df.select_dtypes(include='number').corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f', ax=axes[0],
            square=True, linewidths=0.5)
axes[0].set_title("Matrice de Corrélation")

# Boxplot
sns.boxplot(data=df, x='species', y='petal_length',
            palette='Set2', ax=axes[1])
axes[1].set_title("Longueur des pétales par espèce")
axes[1].set_xlabel("Espèce")
axes[1].set_ylabel("Longueur (cm)")

plt.tight_layout()
plt.show()

# Pairplot — vue d'ensemble des relations
sns.pairplot(df, hue='species', diag_kind='kde', corner=True)
plt.suptitle("Relations entre Variables", y=1.02)
plt.show()
\`\`\`

> [!TIP]
> Utilisez **\`plt.savefig('nom.png', dpi=150, bbox_inches='tight')\`** avant \`plt.show()\` pour sauvegarder vos graphiques en haute qualité.

> [!NOTE]
> Pour les notebooks Jupyter, ajoutez \`%matplotlib inline\` en début de cellule pour afficher les graphiques directement dans le notebook.`
  },
  {
    title: "Projet : Analyse de Données Réelles",
    order: 14,
    duration: 90,
    content: "C'est ici que tout se concrétise. Dans ce projet fil rouge, vous allez appliquer l'ensemble des compétences acquises — NumPy, Pandas, Matplotlib — pour analyser un jeu de données réel du début à la fin. Vous allez suivre le cycle complet d'un Data Analyst : chargement des données, nettoyage, exploration, analyse statistique, visualisation et formulation de recommandations.",
    extra: `## Le Cycle Complet d'une Analyse de Données

\`\`\`
1. Chargement & Inspection  →  2. Nettoyage  →  3. Exploration  →  4. Analyse  →  5. Visualisation  →  6. Conclusions
\`\`\`

---

## Étape 1 : Chargement et Inspection

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Simulation d'un dataset e-commerce réaliste
np.random.seed(42)
n = 500

categories = ["Électronique", "Vêtements", "Livres", "Maison", "Sport"]
villes = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux"]
mois = [f"2024-{m:02d}" for m in range(1, 13)]

df = pd.DataFrame({
    "commande_id": range(1001, 1001 + n),
    "client_id": np.random.randint(1, 201, n),
    "date": pd.date_range("2024-01-01", periods=n, freq="D")[:n],
    "categorie": np.random.choice(categories, n),
    "ville": np.random.choice(villes, n),
    "quantite": np.random.randint(1, 10, n),
    "prix_unitaire": np.random.uniform(5, 500, n).round(2),
    "remise": np.random.choice([0, 0.05, 0.10, 0.15, 0.20], n, p=[0.5, 0.2, 0.15, 0.1, 0.05]),
    "satisfaction": np.random.choice([1, 2, 3, 4, 5], n, p=[0.05, 0.10, 0.20, 0.40, 0.25])
})

# Introduire quelques valeurs manquantes (réalisme)
df.loc[np.random.choice(df.index, 20), "satisfaction"] = np.nan

print("=== INSPECTION INITIALE ===")
print(f"Dimensions : {df.shape} ({df.shape[0]} commandes, {df.shape[1]} colonnes)")
print(f"\\n{df.head()}")
print(f"\\nInformations :")
df.info()
print(f"\\nValeurs manquantes :\\n{df.isnull().sum()}")
\`\`\`

---

## Étape 2 : Nettoyage des Données

\`\`\`python
# Copie de travail (bonne pratique !)
df_clean = df.copy()

# 1. Gérer les valeurs manquantes
df_clean["satisfaction"].fillna(df_clean["satisfaction"].median(), inplace=True)
print(f"NaN après nettoyage : {df_clean.isnull().sum().sum()}")

# 2. Créer des colonnes calculées
df_clean["chiffre_affaires"] = (
    df_clean["quantite"] * df_clean["prix_unitaire"] * (1 - df_clean["remise"])
).round(2)

df_clean["mois"] = df_clean["date"].dt.month
df_clean["mois_nom"] = df_clean["date"].dt.strftime("%B")
df_clean["trimestre"] = df_clean["date"].dt.quarter
df_clean["jour_semaine"] = df_clean["date"].dt.day_name()

# 3. Catégoriser le chiffre d'affaires
df_clean["segment_ca"] = pd.cut(
    df_clean["chiffre_affaires"],
    bins=[0, 100, 500, 1500, float('inf')],
    labels=["Faible", "Moyen", "Élevé", "Premium"]
)

print(f"\\nColonnes après enrichissement : {list(df_clean.columns)}")
print(f"\\nRépartition des segments :\\n{df_clean['segment_ca'].value_counts()}")
\`\`\`

---

## Étape 3 : Analyse Exploratoire

\`\`\`python
print("\\n=== ANALYSE EXPLORATOIRE ===")

# KPIs globaux
total_ca = df_clean["chiffre_affaires"].sum()
total_commandes = len(df_clean)
clients_uniques = df_clean["client_id"].nunique()
ca_moyen = df_clean["chiffre_affaires"].mean()
satisfaction_moy = df_clean["satisfaction"].mean()

print(f"💰 Chiffre d'affaires total : {total_ca:,.0f}€")
print(f"📦 Nombre de commandes : {total_commandes}")
print(f"👤 Clients uniques : {clients_uniques}")
print(f"🛒 Panier moyen : {ca_moyen:.2f}€")
print(f"⭐ Satisfaction moyenne : {satisfaction_moy:.2f}/5")

# Analyse par catégorie
print("\\n--- CA par catégorie ---")
cat_analysis = df_clean.groupby("categorie").agg(
    commandes=("commande_id", "count"),
    ca_total=("chiffre_affaires", "sum"),
    ca_moyen=("chiffre_affaires", "mean"),
    satisfaction=("satisfaction", "mean")
).round(2).sort_values("ca_total", ascending=False)
print(cat_analysis)

# Analyse temporelle
print("\\n--- Évolution mensuelle ---")
monthly = df_clean.groupby("mois").agg(
    commandes=("commande_id", "count"),
    ca=("chiffre_affaires", "sum")
).round(0)
print(monthly)
\`\`\`

---

## Étape 4 : Visualisations du Rapport

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use('seaborn-v0_8-whitegrid')
fig = plt.figure(figsize=(18, 14))
fig.suptitle("Dashboard E-Commerce 2024", fontsize=20, fontweight='bold', y=1.01)

# Graphique 1 : CA par catégorie
ax1 = fig.add_subplot(2, 3, 1)
cat_ca = df_clean.groupby("categorie")["chiffre_affaires"].sum().sort_values(ascending=True)
bars = ax1.barh(cat_ca.index, cat_ca.values, color=sns.color_palette("viridis", len(cat_ca)))
ax1.set_title("CA par Catégorie (€)", fontweight='bold')
for bar, val in zip(bars, cat_ca.values):
    ax1.text(val + 100, bar.get_y() + bar.get_height()/2,
             f'{val:,.0f}€', va='center', fontsize=9)

# Graphique 2 : Évolution mensuelle
ax2 = fig.add_subplot(2, 3, 2)
monthly_ca = df_clean.groupby("mois")["chiffre_affaires"].sum()
ax2.plot(monthly_ca.index, monthly_ca.values, 'o-', color='#3498db', linewidth=2.5, markersize=8)
ax2.fill_between(monthly_ca.index, monthly_ca.values, alpha=0.15, color='#3498db')
ax2.set_title("Évolution CA Mensuelle", fontweight='bold')
ax2.set_xlabel("Mois")
ax2.set_ylabel("CA (€)")

# Graphique 3 : Part de marché (camembert)
ax3 = fig.add_subplot(2, 3, 3)
cat_parts = df_clean.groupby("categorie")["chiffre_affaires"].sum()
ax3.pie(cat_parts, labels=cat_parts.index, autopct='%1.1f%%',
        colors=sns.color_palette("Set2"), startangle=90)
ax3.set_title("Part de Marché par Catégorie", fontweight='bold')

# Graphique 4 : Distribution satisfaction
ax4 = fig.add_subplot(2, 3, 4)
satisfaction_counts = df_clean["satisfaction"].value_counts().sort_index()
bars4 = ax4.bar(satisfaction_counts.index, satisfaction_counts.values,
                color=['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'])
ax4.set_title("Distribution de la Satisfaction", fontweight='bold')
ax4.set_xlabel("Note (1-5)")
ax4.set_ylabel("Nombre d'avis")

# Graphique 5 : Satisfaction par catégorie (boxplot)
ax5 = fig.add_subplot(2, 3, 5)
sns.boxplot(data=df_clean, x="categorie", y="satisfaction",
            palette="Set3", ax=ax5)
ax5.set_title("Satisfaction par Catégorie", fontweight='bold')
plt.setp(ax5.get_xticklabels(), rotation=20, ha='right')

# Graphique 6 : Corrélation remise/CA
ax6 = fig.add_subplot(2, 3, 6)
remise_ca = df_clean.groupby("remise")["chiffre_affaires"].mean()
ax6.bar([f"{r*100:.0f}%" for r in remise_ca.index], remise_ca.values,
        color='#9b59b6')
ax6.set_title("CA Moyen par Niveau de Remise", fontweight='bold')
ax6.set_xlabel("Remise accordée")
ax6.set_ylabel("CA Moyen (€)")

plt.tight_layout()
plt.savefig("rapport_ecommerce_2024.png", dpi=150, bbox_inches='tight')
plt.show()
print("\\n✅ Rapport visuel sauvegardé !")
\`\`\`

---

## Étape 5 : Recommandations

\`\`\`python
print("\\n=== CONCLUSIONS ET RECOMMANDATIONS ===\\n")

# Identifier la meilleure et la moins bonne catégorie
meilleure_cat = cat_analysis["ca_total"].idxmax()
moins_bonne = cat_analysis["satisfaction"].idxmin()
mois_record = monthly_ca.idxmax()

print(f"✅ Catégorie la plus rentable : {meilleure_cat}")
print(f"   → CA total : {cat_analysis.loc[meilleure_cat, 'ca_total']:,.0f}€")
print(f"\\n⚠️  Catégorie à améliorer : {moins_bonne}")
print(f"   → Satisfaction : {cat_analysis.loc[moins_bonne, 'satisfaction']:.2f}/5")
print(f"\\n📈 Mois record : Mois {mois_record}")
print(f"   → CA : {monthly_ca[mois_record]:,.0f}€")

# Clients premium
valeur_clients = df_clean.groupby("client_id")["chiffre_affaires"].sum()
top_10_pct = valeur_clients.quantile(0.90)
clients_premium = valeur_clients[valeur_clients >= top_10_pct]
print(f"\\n💎 Top 10% des clients ({len(clients_premium)} clients)")
print(f"   → Génèrent {clients_premium.sum()/total_ca*100:.1f}% du CA total")
print("   → RECOMMANDATION : Créer un programme de fidélité VIP")
\`\`\`

> [!IMPORTANT]
> Un bon rapport d'analyse ne se limite pas aux graphiques. Il doit toujours répondre à la question : **"So what ?"** — Que signifient ces chiffres ? Quelles décisions peut-on prendre ?`
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
    console.log('--- Enrichissement Partie 2/3 (Leçons 8-14) ---\n');

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

    console.log('\n✅ Partie 2/3 terminée (leçons 8-14 enrichies).');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
