const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📚 Création du cours Algorithmes Fondamentaux...\n');

  // Créer le cours
  const course = await prisma.course.upsert({
    where: { slug: 'algorithmes-fondamentaux' },
    update: {},
    create: {
      id: 'course-algo-fondamentaux',
      title: 'Algorithmes Fondamentaux : De Zéro à Expert',
      slug: 'algorithmes-fondamentaux',
      description: 'Maîtrisez les algorithmes et structures de données essentiels pour devenir un excellent programmeur',
      fullDescription: `# Formation Complète en Algorithmique

Ce cours complet vous fera passer de débutant à expert en algorithmique. Vous apprendrez :

- Les fondamentaux de l'algorithmique et de la complexité
- Toutes les structures de données essentielles
- Les algorithmes de tri et de recherche
- Les algorithmes sur graphes
- La programmation dynamique
- Les algorithmes gloutons et bien plus

Chaque concept est accompagné d'exemples pratiques, d'exercices et d'implémentations en Python.`,
      level: 'Intermédiaire',
      duration: '45h',
      price: 20000,
      isFree: false,
      isPublished: true,
      learningOutcomes: JSON.stringify([
        'Comprendre la complexité algorithmique (Big O)',
        'Maîtriser toutes les structures de données fondamentales',
        'Implémenter les algorithmes de tri classiques',
        'Résoudre des problèmes avec les graphes',
        'Appliquer la programmation dynamique',
        'Analyser et optimiser vos algorithmes'
      ]),
      requirements: JSON.stringify([
        'Bases de programmation (variables, boucles, fonctions)',
        'Connaissance d\'un langage de programmation (Python recommandé)',
        'Motivation pour résoudre des problèmes complexes'
      ])
    }
  });

  console.log('✅ Cours créé:', course.title);

  // Créer les leçons
  const lessons = [
    {
      id: 'algo-lesson-1',
      title: 'Introduction à l\'Algorithmique',
      order: 1,
      duration: 60,
      content: `# Introduction à l'Algorithmique

## Qu'est-ce qu'un algorithme ?

Un **algorithme** est une séquence d'instructions précises et non ambiguës permettant de résoudre un problème ou d'effectuer une tâche.

### Caractéristiques d'un bon algorithme

1. **Précis** : Chaque étape est clairement définie
2. **Fini** : L'algorithme doit se terminer après un nombre fini d'étapes
3. **Efficace** : Utilise les ressources de manière optimale
4. **Général** : Fonctionne pour tous les cas du problème

## Exemple Simple : Trouver le Maximum

\`\`\`python
def trouver_maximum(liste):
    """
    Trouve le plus grand élément dans une liste.
    """
    if not liste:
        return None

    max_val = liste[0]
    for element in liste:
        if element > max_val:
            max_val = element
    return max_val

# Utilisation
nombres = [3, 7, 1, 9, 2, 5]
print(trouver_maximum(nombres))  # Affiche: 9
\`\`\`

## Exercice Pratique

Écrivez un algorithme qui trouve le minimum dans une liste.

### Points Clés

- Un algorithme résout un problème de manière systématique
- La clarté et la précision sont essentielles
- L'efficacité compte, mais la correction d'abord`
    },
    {
      id: 'algo-lesson-2',
      title: 'Complexité Algorithmique : Big O',
      order: 2,
      duration: 90,
      content: `# Complexité Algorithmique

## Pourquoi mesurer la complexité ?

La **complexité algorithmique** mesure l'efficacité d'un algorithme en termes de :
- **Temps** : Combien d'opérations ?
- **Espace** : Combien de mémoire ?

## Notation Big O

La notation **O(n)** décrit le comportement dans le pire des cas.

### Complexités courantes

| Notation | Nom | Exemple |
|----------|-----|---------|
| O(1) | Constante | Accès à un élément de tableau |
| O(log n) | Logarithmique | Recherche binaire |
| O(n) | Linéaire | Parcours de tableau |
| O(n log n) | Log-linéaire | Tri fusion, tri rapide |
| O(n²) | Quadratique | Tri à bulles, double boucle |
| O(2ⁿ) | Exponentielle | Suite de Fibonacci naïve |

## Exemples Pratiques

### O(1) - Temps Constant

\`\`\`python
def acceder_element(tableau, index):
    return tableau[index]  # Une seule opération
\`\`\`

### O(n) - Temps Linéaire

\`\`\`python
def somme(tableau):
    total = 0
    for element in tableau:  # n opérations
        total += element
    return total
\`\`\`

### O(n²) - Temps Quadratique

\`\`\`python
def somme_paires(tableau):
    total = 0
    for i in tableau:        # n itérations
        for j in tableau:    # n itérations
            total += i + j
    return total
\`\`\`

## Règles de Simplification

1. **Ignorer les constantes** : O(2n) → O(n)
2. **Garder le terme dominant** : O(n² + n) → O(n²)
3. **Additionner les séquences** : O(n) + O(m) → O(n + m)
4. **Multiplier les boucles imbriquées** : O(n) × O(m) → O(n × m)

## Exercice

Quelle est la complexité de cet algorithme ?

\`\`\`python
def mystere(n):
    for i in range(n):
        for j in range(i):
            print(i, j)
\`\`\`

**Réponse** : O(n²) car double boucle imbriquée.`
    },
    {
      id: 'algo-lesson-3',
      title: 'Tableaux et Listes',
      order: 3,
      duration: 75,
      content: `# Structures de Données : Tableaux et Listes

## Les Tableaux (Arrays)

Un **tableau** est une structure de données qui stocke des éléments de même type dans des emplacements mémoire contigus.

### Opérations et Complexités

| Opération | Complexité |
|-----------|------------|
| Accès par index | O(1) |
| Recherche | O(n) |
| Insertion (fin) | O(1) |
| Insertion (début) | O(n) |
| Suppression | O(n) |

### Implémentation en Python

\`\`\`python
# Python utilise des listes dynamiques
tableau = [1, 2, 3, 4, 5]

# Accès O(1)
print(tableau[2])  # 3

# Ajout en fin O(1)
tableau.append(6)

# Insertion au début O(n)
tableau.insert(0, 0)

# Suppression O(n)
tableau.remove(3)
\`\`\`

## Listes Chaînées

Une **liste chaînée** est une structure où chaque élément (nœud) contient :
- Une valeur
- Un pointeur vers le nœud suivant

### Avantages vs Tableaux

✅ Insertion/suppression en O(1) si on a le pointeur
✅ Taille dynamique sans réallocation
❌ Accès séquentiel seulement O(n)
❌ Plus de mémoire (stockage des pointeurs)

### Implémentation

\`\`\`python
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.suivant = None

class ListeChainee:
    def __init__(self):
        self.tete = None

    def inserer_debut(self, valeur):
        nouveau = Noeud(valeur)
        nouveau.suivant = self.tete
        self.tete = nouveau

    def afficher(self):
        actuel = self.tete
        while actuel:
            print(actuel.valeur, end=" -> ")
            actuel = actuel.suivant
        print("None")

# Utilisation
liste = ListeChainee()
liste.inserer_debut(3)
liste.inserer_debut(2)
liste.inserer_debut(1)
liste.afficher()  # 1 -> 2 -> 3 -> None
\`\`\`

## Exercices

1. Implémentez une méthode pour supprimer un élément
2. Créez une liste chaînée doublement chaînée
3. Inversez une liste chaînée`
    },
    {
      id: 'algo-lesson-4',
      title: 'Piles et Files',
      order: 4,
      duration: 60,
      content: `# Piles (Stack) et Files (Queue)

## La Pile (LIFO - Last In First Out)

La **pile** est une structure où le dernier élément ajouté est le premier retiré.

### Opérations Principales

- **push(x)** : Ajouter un élément O(1)
- **pop()** : Retirer le dernier élément O(1)
- **peek()** : Voir le dernier élément O(1)
- **isEmpty()** : Vérifier si vide O(1)

### Implémentation

\`\`\`python
class Pile:
    def __init__(self):
        self.elements = []

    def push(self, valeur):
        self.elements.append(valeur)

    def pop(self):
        if self.est_vide():
            raise IndexError("Pile vide")
        return self.elements.pop()

    def peek(self):
        if self.est_vide():
            raise IndexError("Pile vide")
        return self.elements[-1]

    def est_vide(self):
        return len(self.elements) == 0

    def taille(self):
        return len(self.elements)

# Utilisation
pile = Pile()
pile.push(1)
pile.push(2)
pile.push(3)
print(pile.pop())   # 3
print(pile.peek())  # 2
\`\`\`

### Applications Réelles

- Historique de navigation (bouton retour)
- Pile d'appels de fonctions
- Évaluation d'expressions
- Annuler/Refaire (Undo/Redo)

## La File (FIFO - First In First Out)

La **file** est une structure où le premier élément ajouté est le premier retiré.

### Opérations Principales

- **enqueue(x)** : Ajouter à la fin O(1)
- **dequeue()** : Retirer du début O(1)
- **front()** : Voir le premier élément O(1)

### Implémentation

\`\`\`python
from collections import deque

class File:
    def __init__(self):
        self.elements = deque()

    def enfiler(self, valeur):
        self.elements.append(valeur)

    def defiler(self):
        if self.est_vide():
            raise IndexError("File vide")
        return self.elements.popleft()

    def premier(self):
        if self.est_vide():
            raise IndexError("File vide")
        return self.elements[0]

    def est_vide(self):
        return len(self.elements) == 0

# Utilisation
file = File()
file.enfiler(1)
file.enfiler(2)
file.enfiler(3)
print(file.defiler())  # 1
print(file.premier())  # 2
\`\`\`

### Applications Réelles

- File d'attente (impression, serveur)
- Parcours en largeur (BFS)
- Gestion de processus
- Cache (algorithmes de remplacement)

## Exercice : Parenthèses Équilibrées

Vérifiez si une expression a des parenthèses équilibrées.

\`\`\`python
def parentheses_equilibrees(expression):
    pile = Pile()
    for char in expression:
        if char in '([{':
            pile.push(char)
        elif char in ')]}':
            if pile.est_vide():
                return False
            ouvrante = pile.pop()
            if not correspond(ouvrante, char):
                return False
    return pile.est_vide()

def correspond(ouvrante, fermante):
    pairs = {'(': ')', '[': ']', '{': '}'}
    return pairs[ouvrante] == fermante

print(parentheses_equilibrees("(())"))     # True
print(parentheses_equilibrees("([)]"))     # False
print(parentheses_equilibrees("{[()]}"))   # True
\`\`\``
    },
    {
      id: 'algo-lesson-5',
      title: 'Algorithmes de Tri : Partie 1',
      order: 5,
      duration: 90,
      content: `# Algorithmes de Tri - Partie 1

## Introduction au Tri

Le **tri** consiste à ordonner des éléments selon un critère.

## 1. Tri à Bulles (Bubble Sort)

### Principe

Compare des paires adjacentes et les échange si nécessaire.

### Complexité

- **Temps** : O(n²) dans le pire cas
- **Espace** : O(1)

### Implémentation

\`\`\`python
def tri_bulles(tableau):
    n = len(tableau)
    for i in range(n):
        echange = False
        for j in range(0, n - i - 1):
            if tableau[j] > tableau[j + 1]:
                tableau[j], tableau[j + 1] = tableau[j + 1], tableau[j]
                echange = True
        if not echange:
            break
    return tableau

# Test
nombres = [64, 34, 25, 12, 22, 11, 90]
print(tri_bulles(nombres))
# [11, 12, 22, 25, 34, 64, 90]
\`\`\`

## 2. Tri par Insertion (Insertion Sort)

### Principe

Construit le tableau trié élément par élément.

### Complexité

- **Temps** : O(n²) pire cas, O(n) meilleur cas
- **Espace** : O(1)

### Implémentation

\`\`\`python
def tri_insertion(tableau):
    for i in range(1, len(tableau)):
        cle = tableau[i]
        j = i - 1
        while j >= 0 and tableau[j] > cle:
            tableau[j + 1] = tableau[j]
            j -= 1
        tableau[j + 1] = cle
    return tableau

# Test
nombres = [12, 11, 13, 5, 6]
print(tri_insertion(nombres))
# [5, 6, 11, 12, 13]
\`\`\`

## 3. Tri par Sélection (Selection Sort)

### Principe

Trouve le minimum et le place au début.

### Complexité

- **Temps** : O(n²)
- **Espace** : O(1)

### Implémentation

\`\`\`python
def tri_selection(tableau):
    n = len(tableau)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if tableau[j] < tableau[min_idx]:
                min_idx = j
        tableau[i], tableau[min_idx] = tableau[min_idx], tableau[i]
    return tableau

# Test
nombres = [64, 25, 12, 22, 11]
print(tri_selection(nombres))
# [11, 12, 22, 25, 64]
\`\`\`

## Comparaison

| Algorithme | Temps Moyen | Espace | Stable |
|------------|-------------|--------|--------|
| Bulles | O(n²) | O(1) | ✅ |
| Insertion | O(n²) | O(1) | ✅ |
| Sélection | O(n²) | O(1) | ❌ |

**Stable** : Préserve l'ordre relatif des éléments égaux.

## Quand les Utiliser ?

- **Insertion** : Petit tableau ou presque trié
- **Bulles** : Rarement (sauf à des fins pédagogiques)
- **Sélection** : Minimiser les écritures en mémoire

## Exercice

Modifiez le tri à bulles pour trier en ordre décroissant.`
    },
    {
      id: 'algo-lesson-6',
      title: 'Algorithmes de Tri : Partie 2 (Avancés)',
      order: 6,
      duration: 120,
      content: `# Algorithmes de Tri Avancés

## 1. Tri Fusion (Merge Sort)

### Principe : Diviser pour Régner

1. Diviser le tableau en deux moitiés
2. Trier récursivement chaque moitié
3. Fusionner les deux moitiés triées

### Complexité

- **Temps** : O(n log n) garanti
- **Espace** : O(n)

### Implémentation

\`\`\`python
def tri_fusion(tableau):
    if len(tableau) <= 1:
        return tableau

    # Diviser
    milieu = len(tableau) // 2
    gauche = tri_fusion(tableau[:milieu])
    droite = tri_fusion(tableau[milieu:])

    # Fusionner
    return fusionner(gauche, droite)

def fusionner(gauche, droite):
    resultat = []
    i = j = 0

    while i < len(gauche) and j < len(droite):
        if gauche[i] <= droite[j]:
            resultat.append(gauche[i])
            i += 1
        else:
            resultat.append(droite[j])
            j += 1

    resultat.extend(gauche[i:])
    resultat.extend(droite[j:])
    return resultat

# Test
nombres = [38, 27, 43, 3, 9, 82, 10]
print(tri_fusion(nombres))
# [3, 9, 10, 27, 38, 43, 82]
\`\`\`

## 2. Tri Rapide (Quick Sort)

### Principe

1. Choisir un pivot
2. Partitionner : éléments < pivot à gauche, > pivot à droite
3. Trier récursivement les deux partitions

### Complexité

- **Temps** : O(n log n) moyen, O(n²) pire cas
- **Espace** : O(log n)

### Implémentation

\`\`\`python
def tri_rapide(tableau):
    if len(tableau) <= 1:
        return tableau

    pivot = tableau[len(tableau) // 2]
    gauche = [x for x in tableau if x < pivot]
    milieu = [x for x in tableau if x == pivot]
    droite = [x for x in tableau if x > pivot]

    return tri_rapide(gauche) + milieu + tri_rapide(droite)

# Version in-place (plus efficace)
def tri_rapide_inplace(tableau, bas=0, haut=None):
    if haut is None:
        haut = len(tableau) - 1

    if bas < haut:
        pivot_idx = partitionner(tableau, bas, haut)
        tri_rapide_inplace(tableau, bas, pivot_idx - 1)
        tri_rapide_inplace(tableau, pivot_idx + 1, haut)

    return tableau

def partitionner(tableau, bas, haut):
    pivot = tableau[haut]
    i = bas - 1

    for j in range(bas, haut):
        if tableau[j] <= pivot:
            i += 1
            tableau[i], tableau[j] = tableau[j], tableau[i]

    tableau[i + 1], tableau[haut] = tableau[haut], tableau[i + 1]
    return i + 1

# Test
nombres = [10, 7, 8, 9, 1, 5]
print(tri_rapide_inplace(nombres))
# [1, 5, 7, 8, 9, 10]
\`\`\`

## 3. Tri par Tas (Heap Sort)

### Principe

Utilise une structure de tas (heap) pour trier.

### Complexité

- **Temps** : O(n log n) garanti
- **Espace** : O(1)

### Implémentation

\`\`\`python
def tri_tas(tableau):
    n = len(tableau)

    # Construire un tas max
    for i in range(n // 2 - 1, -1, -1):
        heapify(tableau, n, i)

    # Extraire les éléments un par un
    for i in range(n - 1, 0, -1):
        tableau[0], tableau[i] = tableau[i], tableau[0]
        heapify(tableau, i, 0)

    return tableau

def heapify(tableau, n, i):
    plus_grand = i
    gauche = 2 * i + 1
    droite = 2 * i + 2

    if gauche < n and tableau[gauche] > tableau[plus_grand]:
        plus_grand = gauche

    if droite < n and tableau[droite] > tableau[plus_grand]:
        plus_grand = droite

    if plus_grand != i:
        tableau[i], tableau[plus_grand] = tableau[plus_grand], tableau[i]
        heapify(tableau, n, plus_grand)

# Test
nombres = [12, 11, 13, 5, 6, 7]
print(tri_tas(nombres))
# [5, 6, 7, 11, 12, 13]
\`\`\`

## Comparaison des Tris Avancés

| Algorithme | Temps Moyen | Pire Cas | Espace | Stable |
|------------|-------------|----------|--------|--------|
| Fusion | O(n log n) | O(n log n) | O(n) | ✅ |
| Rapide | O(n log n) | O(n²) | O(log n) | ❌ |
| Tas | O(n log n) | O(n log n) | O(1) | ❌ |

## Quel Algorithme Choisir ?

- **Fusion** : Besoin de stabilité, données en liste chaînée
- **Rapide** : Performance moyenne excellente, tableaux
- **Tas** : Contrainte mémoire stricte
- **Python's sorted()** : Utilise Timsort (fusion + insertion) O(n log n)

## Exercice

Implémentez le tri comptage (Counting Sort) pour des entiers positifs.`
    },
    {
      id: 'algo-lesson-7',
      title: 'Recherche Binaire',
      order: 7,
      duration: 60,
      content: `# Recherche Binaire

## Principe

La **recherche binaire** trouve un élément dans un tableau **trié** en divisant l'espace de recherche par 2 à chaque étape.

### Complexité

- **Temps** : O(log n)
- **Espace** : O(1) itératif, O(log n) récursif

### Condition : Tableau Trié

⚠️ **Important** : Ne fonctionne que sur des tableaux triés !

## Implémentation Itérative

\`\`\`python
def recherche_binaire(tableau, cible):
    gauche, droite = 0, len(tableau) - 1

    while gauche <= droite:
        milieu = (gauche + droite) // 2

        if tableau[milieu] == cible:
            return milieu  # Trouvé !
        elif tableau[milieu] < cible:
            gauche = milieu + 1  # Chercher à droite
        else:
            droite = milieu - 1  # Chercher à gauche

    return -1  # Non trouvé

# Test
nombres = [1, 3, 5, 7, 9, 11, 13, 15, 17]
print(recherche_binaire(nombres, 7))   # 3
print(recherche_binaire(nombres, 10))  # -1
\`\`\`

## Implémentation Récursive

\`\`\`python
def recherche_binaire_recursive(tableau, cible, gauche=0, droite=None):
    if droite is None:
        droite = len(tableau) - 1

    if gauche > droite:
        return -1

    milieu = (gauche + droite) // 2

    if tableau[milieu] == cible:
        return milieu
    elif tableau[milieu] < cible:
        return recherche_binaire_recursive(tableau, cible, milieu + 1, droite)
    else:
        return recherche_binaire_recursive(tableau, cible, gauche, milieu - 1)

# Test
nombres = [2, 4, 6, 8, 10, 12, 14]
print(recherche_binaire_recursive(nombres, 10))  # 4
\`\`\`

## Variantes de Recherche Binaire

### 1. Trouver la Première Occurrence

\`\`\`python
def premiere_occurrence(tableau, cible):
    gauche, droite = 0, len(tableau) - 1
    resultat = -1

    while gauche <= droite:
        milieu = (gauche + droite) // 2

        if tableau[milieu] == cible:
            resultat = milieu
            droite = milieu - 1  # Continuer à gauche
        elif tableau[milieu] < cible:
            gauche = milieu + 1
        else:
            droite = milieu - 1

    return resultat

# Test
nombres = [1, 2, 2, 2, 3, 4, 5]
print(premiere_occurrence(nombres, 2))  # 1
\`\`\`

### 2. Trouver la Dernière Occurrence

\`\`\`python
def derniere_occurrence(tableau, cible):
    gauche, droite = 0, len(tableau) - 1
    resultat = -1

    while gauche <= droite:
        milieu = (gauche + droite) // 2

        if tableau[milieu] == cible:
            resultat = milieu
            gauche = milieu + 1  # Continuer à droite
        elif tableau[milieu] < cible:
            gauche = milieu + 1
        else:
            droite = milieu - 1

    return resultat

# Test
nombres = [1, 2, 2, 2, 3, 4, 5]
print(derniere_occurrence(nombres, 2))  # 3
\`\`\`

## Comparaison avec Recherche Linéaire

| Critère | Linéaire | Binaire |
|---------|----------|---------|
| Complexité | O(n) | O(log n) |
| Pré-requis | Aucun | Tableau trié |
| Meilleur pour | Petits tableaux | Grands tableaux triés |

### Exemple de Gain

Pour 1 million d'éléments :
- **Linéaire** : ~500 000 comparaisons en moyenne
- **Binaire** : ~20 comparaisons maximum

## Applications Réelles

- Recherche dans un dictionnaire
- Systèmes de fichiers
- Recherche de versions dans le contrôle de version
- Algorithmes de jeux (recherche de coups optimaux)

## Exercice

Implémentez une fonction qui trouve l'élément le plus proche d'une cible dans un tableau trié.

\`\`\`python
def element_plus_proche(tableau, cible):
    # Votre code ici
    pass

# Test
nombres = [1, 3, 8, 10, 15]
print(element_plus_proche(nombres, 12))  # Devrait retourner 10
\`\`\``
    },
    {
      id: 'algo-lesson-8',
      title: 'Arbres Binaires',
      order: 8,
      duration: 90,
      content: `# Arbres Binaires

## Qu'est-ce qu'un Arbre ?

Un **arbre** est une structure hiérarchique composée de nœuds.

### Terminologie

- **Racine** : Nœud au sommet
- **Feuille** : Nœud sans enfants
- **Hauteur** : Longueur du plus long chemin vers une feuille
- **Profondeur** : Distance depuis la racine

## Arbre Binaire

Chaque nœud a **au plus 2 enfants** : gauche et droite.

### Implémentation

\`\`\`python
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.gauche = None
        self.droite = None

# Création d'un arbre
#       1
#      / \\
#     2   3
#    / \\
#   4   5

racine = Noeud(1)
racine.gauche = Noeud(2)
racine.droite = Noeud(3)
racine.gauche.gauche = Noeud(4)
racine.gauche.droite = Noeud(5)
\`\`\`

## Parcours d'Arbres

### 1. Parcours en Profondeur (DFS)

#### Préordre (Racine - Gauche - Droite)

\`\`\`python
def parcours_preordre(noeud):
    if noeud:
        print(noeud.valeur, end=' ')
        parcours_preordre(noeud.gauche)
        parcours_preordre(noeud.droite)

# Résultat : 1 2 4 5 3
\`\`\`

#### Inordre (Gauche - Racine - Droite)

\`\`\`python
def parcours_inordre(noeud):
    if noeud:
        parcours_inordre(noeud.gauche)
        print(noeud.valeur, end=' ')
        parcours_inordre(noeud.droite)

# Résultat : 4 2 5 1 3
\`\`\`

#### Postordre (Gauche - Droite - Racine)

\`\`\`python
def parcours_postordre(noeud):
    if noeud:
        parcours_postordre(noeud.gauche)
        parcours_postordre(noeud.droite)
        print(noeud.valeur, end=' ')

# Résultat : 4 5 2 3 1
\`\`\`

### 2. Parcours en Largeur (BFS)

\`\`\`python
from collections import deque

def parcours_largeur(racine):
    if not racine:
        return

    file = deque([racine])

    while file:
        noeud = file.popleft()
        print(noeud.valeur, end=' ')

        if noeud.gauche:
            file.append(noeud.gauche)
        if noeud.droite:
            file.append(noeud.droite)

# Résultat : 1 2 3 4 5
\`\`\`

## Arbre Binaire de Recherche (ABR)

### Propriété

Pour chaque nœud :
- Tous les nœuds à gauche ont des valeurs **< nœud**
- Tous les nœuds à droite ont des valeurs **> nœud**

### Implémentation

\`\`\`python
class ABR:
    def __init__(self):
        self.racine = None

    def inserer(self, valeur):
        if not self.racine:
            self.racine = Noeud(valeur)
        else:
            self._inserer_recursif(self.racine, valeur)

    def _inserer_recursif(self, noeud, valeur):
        if valeur < noeud.valeur:
            if noeud.gauche is None:
                noeud.gauche = Noeud(valeur)
            else:
                self._inserer_recursif(noeud.gauche, valeur)
        else:
            if noeud.droite is None:
                noeud.droite = Noeud(valeur)
            else:
                self._inserer_recursif(noeud.droite, valeur)

    def rechercher(self, valeur):
        return self._rechercher_recursif(self.racine, valeur)

    def _rechercher_recursif(self, noeud, valeur):
        if noeud is None or noeud.valeur == valeur:
            return noeud

        if valeur < noeud.valeur:
            return self._rechercher_recursif(noeud.gauche, valeur)
        return self._rechercher_recursif(noeud.droite, valeur)

# Utilisation
arbre = ABR()
for val in [50, 30, 70, 20, 40, 60, 80]:
    arbre.inserer(val)

resultat = arbre.rechercher(40)
print(resultat.valeur if resultat else "Non trouvé")  # 40
\`\`\`

### Complexités ABR

| Opération | Équilibré | Déséquilibré |
|-----------|-----------|--------------|
| Recherche | O(log n) | O(n) |
| Insertion | O(log n) | O(n) |
| Suppression | O(log n) | O(n) |

## Exercices

1. Calculez la hauteur d'un arbre
2. Comptez le nombre de feuilles
3. Vérifiez si un arbre est un ABR valide`
    },
    {
      id: 'algo-lesson-9',
      title: 'Graphes : Introduction et Parcours',
      order: 9,
      duration: 120,
      content: `# Introduction aux Graphes

## Qu'est-ce qu'un Graphe ?

Un **graphe** G = (V, E) est composé de :
- **V** : Ensemble de sommets (vertices)
- **E** : Ensemble d'arêtes (edges) reliant les sommets

### Types de Graphes

1. **Orienté** : Les arêtes ont une direction (A → B)
2. **Non orienté** : Les arêtes sont bidirectionnelles (A — B)
3. **Pondéré** : Les arêtes ont un poids/coût
4. **Non pondéré** : Toutes les arêtes ont le même poids

## Représentations

### 1. Matrice d'Adjacence

\`\`\`python
# Graphe avec 4 sommets
graphe = [
    [0, 1, 1, 0],  # Sommet 0 connecté à 1 et 2
    [1, 0, 1, 1],  # Sommet 1 connecté à 0, 2 et 3
    [1, 1, 0, 1],  # Sommet 2 connecté à 0, 1 et 3
    [0, 1, 1, 0]   # Sommet 3 connecté à 1 et 2
]

# Complexité
# Espace : O(V²)
# Vérifier arête : O(1)
# Trouver voisins : O(V)
\`\`\`

### 2. Liste d'Adjacence (Plus Efficace)

\`\`\`python
class Graphe:
    def __init__(self):
        self.adjacence = {}

    def ajouter_sommet(self, sommet):
        if sommet not in self.adjacence:
            self.adjacence[sommet] = []

    def ajouter_arete(self, sommet1, sommet2, poids=1):
        self.ajouter_sommet(sommet1)
        self.ajouter_sommet(sommet2)
        self.adjacence[sommet1].append((sommet2, poids))
        # Pour graphe non orienté, ajouter aussi :
        # self.adjacence[sommet2].append((sommet1, poids))

    def afficher(self):
        for sommet, voisins in self.adjacence.items():
            print(f"{sommet}: {voisins}")

# Utilisation
g = Graphe()
g.ajouter_arete('A', 'B')
g.ajouter_arete('A', 'C')
g.ajouter_arete('B', 'D')
g.ajouter_arete('C', 'D')
g.afficher()

# Complexité
# Espace : O(V + E)
# Vérifier arête : O(degré)
# Trouver voisins : O(degré)
\`\`\`

## Parcours en Profondeur (DFS)

Explore le plus loin possible avant de revenir en arrière.

\`\`\`python
def dfs(graphe, depart, visite=None):
    if visite is None:
        visite = set()

    visite.add(depart)
    print(depart, end=' ')

    for voisin, _ in graphe.adjacence.get(depart, []):
        if voisin not in visite:
            dfs(graphe, voisin, visite)

    return visite

# Version itérative avec pile
def dfs_iteratif(graphe, depart):
    visite = set()
    pile = [depart]

    while pile:
        sommet = pile.pop()
        if sommet not in visite:
            visite.add(sommet)
            print(sommet, end=' ')

            for voisin, _ in reversed(graphe.adjacence.get(sommet, [])):
                if voisin not in visite:
                    pile.append(voisin)

    return visite

# Complexité : O(V + E)
\`\`\`

## Parcours en Largeur (BFS)

Explore tous les voisins avant d'aller plus loin.

\`\`\`python
from collections import deque

def bfs(graphe, depart):
    visite = set([depart])
    file = deque([depart])

    while file:
        sommet = file.popleft()
        print(sommet, end=' ')

        for voisin, _ in graphe.adjacence.get(sommet, []):
            if voisin not in visite:
                visite.add(voisin)
                file.append(voisin)

    return visite

# Complexité : O(V + E)
\`\`\`

## Plus Court Chemin (BFS non pondéré)

\`\`\`python
def plus_court_chemin_bfs(graphe, depart, arrivee):
    if depart == arrivee:
        return [depart]

    visite = {depart}
    file = deque([(depart, [depart])])

    while file:
        sommet, chemin = file.popleft()

        for voisin, _ in graphe.adjacence.get(sommet, []):
            if voisin not in visite:
                nouveau_chemin = chemin + [voisin]

                if voisin == arrivee:
                    return nouveau_chemin

                visite.add(voisin)
                file.append((voisin, nouveau_chemin))

    return None  # Pas de chemin trouvé

# Test
g = Graphe()
for a, b in [('A','B'), ('A','C'), ('B','D'), ('C','D'), ('D','E')]:
    g.ajouter_arete(a, b)
    g.ajouter_arete(b, a)  # Non orienté

chemin = plus_court_chemin_bfs(g, 'A', 'E')
print(' -> '.join(chemin))  # A -> B -> D -> E
\`\`\`

## Applications des Graphes

- **Réseaux sociaux** : Amis, connections
- **Navigation GPS** : Routes, chemins
- **Internet** : Pages web, liens
- **Dépendances** : Packages, modules
- **Jeux** : États, mouvements

## Exercices

1. Détectez un cycle dans un graphe
2. Trouvez toutes les composantes connexes
3. Implémentez la détection de pont (bridge)`
    },
    {
      id: 'algo-lesson-10',
      title: 'Algorithme de Dijkstra',
      order: 10,
      duration: 90,
      content: `# Algorithme de Dijkstra

## Plus Court Chemin dans un Graphe Pondéré

L'**algorithme de Dijkstra** trouve le plus court chemin dans un graphe avec **poids positifs**.

### Principe

1. Initialiser toutes les distances à l'infini sauf le départ (0)
2. Choisir le sommet non visité avec la plus petite distance
3. Mettre à jour les distances de ses voisins
4. Répéter jusqu'à visiter tous les sommets

### Complexité

- **Temps** : O((V + E) log V) avec tas binaire
- **Espace** : O(V)

## Implémentation

\`\`\`python
import heapq
from collections import defaultdict

class GraphePondere:
    def __init__(self):
        self.adjacence = defaultdict(list)

    def ajouter_arete(self, u, v, poids):
        self.adjacence[u].append((v, poids))
        self.adjacence[v].append((u, poids))  # Pour graphe non orienté

def dijkstra(graphe, depart):
    # Distance minimale de depart à chaque sommet
    distances = {sommet: float('inf') for sommet in graphe.adjacence}
    distances[depart] = 0

    # Prédécesseurs pour reconstruire le chemin
    predecesseurs = {sommet: None for sommet in graphe.adjacence}

    # File de priorité : (distance, sommet)
    file_priorite = [(0, depart)]
    visite = set()

    while file_priorite:
        dist_actuelle, sommet_actuel = heapq.heappop(file_priorite)

        if sommet_actuel in visite:
            continue

        visite.add(sommet_actuel)

        # Relaxation des arêtes
        for voisin, poids in graphe.adjacence[sommet_actuel]:
            distance = dist_actuelle + poids

            if distance < distances[voisin]:
                distances[voisin] = distance
                predecesseurs[voisin] = sommet_actuel
                heapq.heappush(file_priorite, (distance, voisin))

    return distances, predecesseurs

def reconstruire_chemin(predecesseurs, depart, arrivee):
    chemin = []
    sommet = arrivee

    while sommet is not None:
        chemin.append(sommet)
        sommet = predecesseurs[sommet]

    chemin.reverse()

    return chemin if chemin[0] == depart else []

# Exemple d'utilisation
g = GraphePondere()
g.ajouter_arete('A', 'B', 4)
g.ajouter_arete('A', 'C', 2)
g.ajouter_arete('B', 'C', 1)
g.ajouter_arete('B', 'D', 5)
g.ajouter_arete('C', 'D', 8)
g.ajouter_arete('C', 'E', 10)
g.ajouter_arete('D', 'E', 2)

distances, predecesseurs = dijkstra(g, 'A')

print("Distances depuis A:")
for sommet, distance in distances.items():
    print(f"  {sommet}: {distance}")

# Trouver le chemin le plus court de A à E
chemin = reconstruire_chemin(predecesseurs, 'A', 'E')
print(f"\\nChemin le plus court A -> E: {' -> '.join(chemin)}")
print(f"Distance totale: {distances['E']}")

# Résultat :
# Distances depuis A:
#   A: 0
#   B: 3
#   C: 2
#   D: 8
#   E: 10
#
# Chemin le plus court A -> E: A -> C -> B -> D -> E
# Distance totale: 10
\`\`\`

## Visualisation de l'Algorithme

\`\`\`
Graphe:
    A --(4)-- B
    |\\        |\\
   (2) \\     (1) \\
    |   \\(8)  |  (5)
    C    \\    |    \\
    |\\    \\   D --(2)-- E
  (10)\\   -------
        E

Étapes:
1. Départ A, distances: A=0, autres=∞
2. Voisins de A: B=4, C=2 → Choisir C (min)
3. Voisins de C: B=3 (2+1), D=10, E=12 → Choisir B
4. Voisins de B: D=8 (3+5) → Choisir D
5. Voisins de D: E=10 (8+2) → Choisir E
6. Terminé
\`\`\`

## Limites

❌ **Ne fonctionne PAS** avec des poids négatifs
✅ Utiliser **Bellman-Ford** pour les poids négatifs

## Optimisations

### Tas de Fibonacci

- Complexité théorique : O(E + V log V)
- En pratique, tas binaire suffit

### Arrêt Anticipé

Si on cherche un seul chemin :

\`\`\`python
def dijkstra_vers_cible(graphe, depart, cible):
    distances = {sommet: float('inf') for sommet in graphe.adjacence}
    distances[depart] = 0
    file_priorite = [(0, depart)]

    while file_priorite:
        dist_actuelle, sommet_actuel = heapq.heappop(file_priorite)

        # Arrêt anticipé
        if sommet_actuel == cible:
            return dist_actuelle

        # ... reste du code
\`\`\`

## Applications Réelles

- **GPS** : Navigation routière
- **Réseaux** : Routage de paquets
- **Jeux vidéo** : Pathfinding IA
- **Logistique** : Optimisation de livraisons

## Exercice

Modifiez Dijkstra pour compter le **nombre de plus courts chemins** différents vers chaque sommet.`
    },
    {
      id: 'algo-lesson-11',
      title: 'Introduction à la Programmation Dynamique',
      order: 11,
      duration: 120,
      content: `# Programmation Dynamique

## Qu'est-ce que c'est ?

La **programmation dynamique** (DP) résout des problèmes en :
1. Décomposant en sous-problèmes
2. Résolvant chaque sous-problème une seule fois
3. Stockant les résultats (mémoïsation)

### Quand l'utiliser ?

✅ Sous-structure optimale (solution optimale = solutions optimales des sous-problèmes)
✅ Sous-problèmes chevauchants (mêmes calculs répétés)

## Exemple Classique : Suite de Fibonacci

### Approche Naïve (Récursive)

\`\`\`python
def fib_naif(n):
    if n <= 1:
        return n
    return fib_naif(n-1) + fib_naif(n-2)

# Complexité : O(2^n) - TRÈS LENT !
# fib_naif(40) prend plusieurs secondes
\`\`\`

### Avec Mémoïsation (Top-Down)

\`\`\`python
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n

    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Complexité : O(n) - RAPIDE !
# fib_memo(100) instant
\`\`\`

### Avec Tabulation (Bottom-Up)

\`\`\`python
def fib_tab(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]

# Complexité : O(n) temps, O(n) espace
\`\`\`

### Optimisé (Espace Constant)

\`\`\`python
def fib_optimise(n):
    if n <= 1:
        return n

    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b

    return b

# Complexité : O(n) temps, O(1) espace
\`\`\`

## Problème du Sac à Dos (Knapsack)

### Énoncé

Vous avez :
- Un sac de capacité W
- n objets avec poids et valeurs
- But : Maximiser la valeur sans dépasser W

### Solution DP

\`\`\`python
def sac_a_dos(poids, valeurs, capacite):
    n = len(poids)

    # dp[i][w] = valeur max avec i objets et capacité w
    dp = [[0] * (capacite + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacite + 1):
            # Option 1: Ne pas prendre l'objet i
            dp[i][w] = dp[i-1][w]

            # Option 2: Prendre l'objet i (si possible)
            if poids[i-1] <= w:
                valeur_avec = valeurs[i-1] + dp[i-1][w - poids[i-1]]
                dp[i][w] = max(dp[i][w], valeur_avec)

    return dp[n][capacite]

# Exemple
poids = [2, 3, 4, 5]
valeurs = [3, 4, 5, 6]
capacite = 8

max_valeur = sac_a_dos(poids, valeurs, capacite)
print(f"Valeur maximale: {max_valeur}")  # 10
# (objets 2 et 4: poids 3+5=8, valeur 4+6=10)

# Complexité : O(n × W) temps et espace
\`\`\`

## Problème du Rendu de Monnaie

### Énoncé

Rendre une somme avec le minimum de pièces.

### Solution

\`\`\`python
def rendu_monnaie(pieces, montant):
    # dp[i] = nombre min de pièces pour montant i
    dp = [float('inf')] * (montant + 1)
    dp[0] = 0

    for m in range(1, montant + 1):
        for piece in pieces:
            if piece <= m:
                dp[m] = min(dp[m], dp[m - piece] + 1)

    return dp[montant] if dp[montant] != float('inf') else -1

# Exemple
pieces = [1, 5, 10, 25]
montant = 63

min_pieces = rendu_monnaie(pieces, montant)
print(f"Minimum de pièces: {min_pieces}")  # 6
# (25 + 25 + 10 + 1 + 1 + 1)

# Complexité : O(montant × len(pieces))
\`\`\`

### Avec Reconstruction de la Solution

\`\`\`python
def rendu_avec_pieces(pieces, montant):
    dp = [float('inf')] * (montant + 1)
    dp[0] = 0
    piece_utilisee = [-1] * (montant + 1)

    for m in range(1, montant + 1):
        for piece in pieces:
            if piece <= m and dp[m - piece] + 1 < dp[m]:
                dp[m] = dp[m - piece] + 1
                piece_utilisee[m] = piece

    # Reconstruire la solution
    if dp[montant] == float('inf'):
        return None

    resultat = []
    m = montant
    while m > 0:
        resultat.append(piece_utilisee[m])
        m -= piece_utilisee[m]

    return resultat

pieces_utilisees = rendu_avec_pieces([1, 5, 10, 25], 63)
print(f"Pièces: {sorted(pieces_utilisees, reverse=True)}")
# [25, 25, 10, 1, 1, 1]
\`\`\`

## Plus Longue Sous-Séquence Commune (LCS)

\`\`\`python
def lcs(texte1, texte2):
    m, n = len(texte1), len(texte2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if texte1[i-1] == texte2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

# Exemple
t1 = "ABCDGH"
t2 = "AEDFHR"
print(f"Longueur LCS: {lcs(t1, t2)}")  # 3 (ADH)
\`\`\`

## Mémoïsation vs Tabulation

| Critère | Mémoïsation | Tabulation |
|---------|-------------|------------|
| Approche | Top-down (récursif) | Bottom-up (itératif) |
| Calcule | Seulement nécessaire | Tous les sous-problèmes |
| Mémoire | Pile récursive | Tableau DP |
| Debugging | Plus facile | Plus difficile |

## Exercices

1. Problème de l'escalier (combien de façons de monter n marches avec 1, 2 ou 3 pas)
2. Plus long palindrome sous-chaîne
3. Partition égale (diviser tableau en 2 sous-ensembles de somme égale)`
    },
    {
      id: 'algo-lesson-12',
      title: 'Algorithmes Gloutons',
      order: 12,
      duration: 75,
      content: `# Algorithmes Gloutons (Greedy)

## Principe

Un algorithme **glouton** fait toujours le choix **localement optimal** en espérant obtenir une solution **globalement optimale**.

### Caractéristiques

✅ Simple à implémenter
✅ Efficace (souvent O(n log n))
❌ Ne garantit PAS toujours la solution optimale
✅ Mais optimal pour certains problèmes spécifiques

## Quand ça Marche ?

1. **Propriété de choix glouton** : Un choix local optimal mène à l'optimal global
2. **Sous-structure optimale** : Solution optimale contient solutions optimales des sous-problèmes

## Problème de Sélection d'Activités

### Énoncé

Maximiser le nombre d'activités non chevauchantes.

### Solution Gloutonne

\`\`\`python
def selection_activites(debut, fin):
    # Trier par heure de fin
    activites = sorted(zip(debut, fin), key=lambda x: x[1])

    selectionnees = [activites[0]]
    derniere_fin = activites[0][1]

    for d, f in activites[1:]:
        if d >= derniere_fin:  # Pas de chevauchement
            selectionnees.append((d, f))
            derniere_fin = f

    return selectionnees

# Exemple
debut = [1, 3, 0, 5, 8, 5]
fin =   [2, 4, 6, 7, 9, 9]

resultat = selection_activites(debut, fin)
print(f"Activités sélectionnées: {resultat}")
# [(1, 2), (3, 4), (5, 7), (8, 9)]

# Complexité : O(n log n) pour le tri
\`\`\`

## Problème du Rendu de Monnaie (Glouton)

### Attention !

L'approche gloutonne ne marche que pour **certains systèmes monétaires**.

### Solution

\`\`\`python
def rendu_glouton(pieces, montant):
    # Trier en ordre décroissant
    pieces = sorted(pieces, reverse=True)
    resultat = []

    for piece in pieces:
        while montant >= piece:
            resultat.append(piece)
            montant -= piece

    return resultat if montant == 0 else None

# Fonctionne avec le système US/EU
pieces_us = [25, 10, 5, 1]
print(rendu_glouton(pieces_us, 63))
# [25, 25, 10, 1, 1, 1] ✅ Optimal

# Mais échoue avec d'autres systèmes !
pieces_custom = [25, 10, 1]
print(rendu_glouton(pieces_custom, 30))
# [25, 1, 1, 1, 1, 1] ❌ 6 pièces
# Optimal serait [10, 10, 10] = 3 pièces
\`\`\`

## Problème du Sac à Dos Fractionnaire

### Différence avec le Sac Classique

On peut prendre des **fractions** d'objets (contrairement au 0/1 knapsack).

### Solution Gloutonne

\`\`\`python
def sac_fractionnaire(poids, valeurs, capacite):
    # Calculer ratio valeur/poids
    items = [(v/p, p, v) for p, v in zip(poids, valeurs)]
    items.sort(reverse=True)  # Trier par ratio décroissant

    valeur_totale = 0

    for ratio, p, v in items:
        if capacite >= p:
            # Prendre l'objet entier
            capacite -= p
            valeur_totale += v
        else:
            # Prendre une fraction
            valeur_totale += ratio * capacite
            break

    return valeur_totale

# Exemple
poids = [10, 20, 30]
valeurs = [60, 100, 120]
capacite = 50

max_val = sac_fractionnaire(poids, valeurs, capacite)
print(f"Valeur maximale: {max_val}")  # 240
# (item 1 entier: 60, item 2 entier: 100, item 3 2/3: 80)

# Complexité : O(n log n)
\`\`\`

## Algorithme de Huffman (Compression)

### Principe

Créer un codage à longueur variable pour compresser des données.

### Implémentation

\`\`\`python
import heapq
from collections import Counter, defaultdict

class Noeud:
    def __init__(self, freq, char=None, gauche=None, droite=None):
        self.freq = freq
        self.char = char
        self.gauche = gauche
        self.droite = droite

    def __lt__(self, autre):
        return self.freq < autre.freq

def huffman(texte):
    # Compter les fréquences
    freq = Counter(texte)

    # Créer une file de priorité
    heap = [Noeud(f, c) for c, f in freq.items()]
    heapq.heapify(heap)

    # Construire l'arbre
    while len(heap) > 1:
        gauche = heapq.heappop(heap)
        droite = heapq.heappop(heap)
        parent = Noeud(gauche.freq + droite.freq, gauche=gauche, droite=droite)
        heapq.heappush(heap, parent)

    # Générer les codes
    codes = {}
    def generer_codes(noeud, code=''):
        if noeud.char:
            codes[noeud.char] = code
        else:
            generer_codes(noeud.gauche, code + '0')
            generer_codes(noeud.droite, code + '1')

    if heap:
        generer_codes(heap[0])

    return codes

# Exemple
texte = "AAAABBBCCD"
codes = huffman(texte)
print("Codes de Huffman:")
for char, code in sorted(codes.items()):
    print(f"  {char}: {code}")

# Résultat:
# A: 0      (4 occurrences -> code court)
# B: 10     (3 occurrences)
# C: 110    (2 occurrences)
# D: 111    (1 occurrence -> code long)
\`\`\`

## Comparaison : Glouton vs Programmation Dynamique

| Critère | Glouton | DP |
|---------|---------|-----|
| Choix | Local optimal | Considère toutes options |
| Complexité | Généralement plus rapide | Plus lent |
| Garantie | Pas toujours optimal | Toujours optimal |
| Mémoire | O(1) ou O(n) | O(n) ou O(n²) |

### Exemples

| Problème | Glouton OK ? | Méthode |
|----------|--------------|---------|
| Sac à dos fractionnaire | ✅ | Glouton |
| Sac à dos 0/1 | ❌ | DP |
| Sélection d'activités | ✅ | Glouton |
| Plus court chemin (Dijkstra) | ✅ | Glouton |
| Plus court chemin (poids négatifs) | ❌ | DP (Bellman-Ford) |

## Exercices

1. Problème de la station-service (minimiser arrêts)
2. Ordonnancement de tâches avec deadlines
3. Compression de texte avec Huffman`
    }
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        ...lesson,
        courseId: course.id
      }
    });
  }

  console.log(`✅ ${lessons.length} leçons créées\n`);

  // Inscrire tous les users aux cours
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

  console.log(`✅ ${users.length} utilisateurs inscrits au cours\n`);
  console.log('🎉 Cours Algorithmes Fondamentaux créé avec succès!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
