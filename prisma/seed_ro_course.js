const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COURSE_ID = 'course-ro-python-ia';

const learningOutcomes = [
  "Modéliser des problèmes décisionnels complexes sous forme mathématique",
  "Maîtriser la programmation linéaire, entière, mixte et binaire",
  "Résoudre des problèmes d'optimisation avec Python (PuLP, SciPy)",
  "Appliquer la théorie des graphes (Dijkstra, Kruskal, Ford-Fulkerson) pour le transport et les réseaux",
  "Utiliser l'IA et les métaheuristiques (Recuit Simulé, Algorithmes Génétiques) pour résoudre les problèmes NP-difficiles",
  "Concevoir et développer un projet industriel d'optimisation de chaîne logistique complet"
];

const requirements = [
  "Bases de la programmation en Python (variables, fonctions, listes)",
  "Niveau mathématique de base (niveau lycée : équations simples, repère cartésien)"
];

const lessons = [
  // ================= MODULE 1 : INTRODUCTION & FONDEMENTS DE LA MODELISATION =================
  {
    title: '1. Introduction à la Recherche Opérationnelle',
    order: 1,
    duration: 30,
    content: 'Découvrez les origines historiques, les objectifs majeurs et la démarche scientifique de la Recherche Opérationnelle.',
    contents: [
      {
        title: 'Qu\'est-ce que la Recherche Opérationnelle ?',
        contentType: 'text',
        order: 1,
        content: `# Introduction à la Recherche Opérationnelle (RO)

La **Recherche Opérationnelle (RO)** (en anglais *Operations Research* ou *Management Science*) est la discipline des mathématiques appliquées et de l'informatique qui fournit des méthodes scientifiques pour **prendre les meilleures décisions possibles** dans des situations complexes.

Elle est née durant la Seconde Guerre Mondiale lorsque des scientifiques ont été recrutés pour optimiser l'utilisation de ressources militaires limitées (comme le positionnement des radars ou l'organisation de convois). Après la guerre, ces techniques ont été transposées avec un immense succès au monde des affaires, de la finance et de la logistique.

> [!IMPORTANT]
> **Le But de la RO** : Maximiser un objectif souhaitable (bénéfice, efficacité, portée) ou minimiser un coût indésirable (temps, gaspillage de matière, risques) sous un ensemble de contraintes physiques, économiques ou réglementaires.

## Domaines d'application réels :
- **Logistique & Transport** : Planification de tournées de livraison, choix d'itinéraires (ex. DHL, UPS, DzLogistics).
- **Production industrielle** : Planification des ressources, gestion des stocks, ordonnancement des tâches en usine.
- **Télécommunications** : Routage de paquets de données, optimisation de couverture d'antennes.
- **Finance** : Optimisation de portefeuilles d'actifs, gestion des risques.`
      }
    ]
  },
  {
    title: '2. Formulation de Programmes Linéaires (PL)',
    order: 2,
    duration: 35,
    content: 'Apprenez à traduire un problème textuel en un modèle mathématique rigoureux.',
    contents: [
      {
        title: 'Les composantes d\'un modèle',
        contentType: 'text',
        order: 1,
        content: `# Formulation de Programmes Linéaires

Pour résoudre un problème avec la RO, on le traduit sous forme mathématique à l'aide de trois composants fondamentaux :

### 1. Les Variables de Décision
Ce sont les inconnues que nous cherchons à déterminer. Elles représentent les choix que le décideur peut faire.
*Exemple :* Le nombre de chaises $x_1$ et de tables $x_2$ à fabriquer ce mois-ci.

### 2. La Fonction Objectif
C'est l'expression mathématique qui définit la performance du système que nous voulons optimiser. Elle dépend directement des variables de décision.
*Exemple :* Maximiser le profit total $z = 3000x_1 + 5000x_2$ (où chaque chaise rapporte 3000 DA et chaque table 5000 DA).

### 3. Les Contraintes
Ce sont les limitations physiques, techniques ou budgétaires imposées au système. Elles définissent les valeurs que les variables de décision ont le droit de prendre.
*Exemple :* La quantité limitée de bois disponible ($2x_1 + 4x_2 \le 80$ kg).`
      }
    ]
  },
  {
    title: '3. Cas de Production Simple (La Menuiserie)',
    order: 3,
    duration: 40,
    content: 'Formulez pas à pas votre premier problème de production de chaises et de tables.',
    contents: [
      {
        title: 'La Menuiserie El Bahdja',
        contentType: 'text',
        order: 1,
        content: `# Cas d'étude : La Menuiserie El Bahdja

Une petite entreprise artisanale à Alger fabrique deux types de meubles : des **Chaises** et des **Tables**.

1. **Ressources en bois** : Une chaise nécessite **2 kg** de bois et une table nécessite **4 kg** de bois. La menuiserie ne dispose que de **80 kg** de bois par semaine.
2. **Temps de travail** : Une chaise requiert **3 heures** de travail et une table requiert **2 heures** de travail. L'atelier ne peut fournir que **60 heures** de travail par semaine.
3. **Bénéfices** : Chaque chaise vendue génère un profit de **3 000 DA** et chaque table rapporte **5 000 DA**.

L'objectif de l'artisan est de déterminer le nombre de chaises et de tables à produire par semaine pour maximiser son bénéfice.

---

## Modélisation mathématique du problème
Soit :
- $x_1$ : le nombre de chaises à fabriquer.
- $x_2$ : le nombre de tables à fabriquer.

L'artisan veut maximiser son profit total (noté $z$) :
$$\max z = 3000 x_1 + 5000 x_2$$

Sujet aux contraintes suivantes :
- **Contrainte du bois** : $2 x_1 + 4 x_2 \le 80$
- **Contrainte du temps** : $3 x_1 + 2 x_2 \le 60$
- **Non-négativité** : $x_1 \ge 0, \quad x_2 \ge 0$`
      }
    ]
  },
  {
    title: '4. Modélisation de Contraintes de Capacité et Demande',
    order: 4,
    duration: 30,
    content: 'Apprenez à modéliser des contraintes complexes de capacité de production et de demande du marché.',
    contents: [
      {
        title: 'Capacités et Demandes',
        contentType: 'text',
        order: 1,
        content: `# Capacités et Demandes dans un PL

Dans la majorité des problèmes industriels, la production est limitée non seulement par les matières premières et la main-d'œuvre, mais aussi par :
- **La capacité maximale des machines** : Une machine ne peut fabriquer plus d'une certaine quantité de produits.
- **La demande du marché** : Produire plus que ce que le marché peut absorber crée des invendus et des coûts de stockage inutiles.

> [!TIP]
> Si la demande maximale pour les chaises est de 15 unités par semaine, nous modélisons cette contrainte par :
> $$x_1 \le 15$$
> Si nous avons un contrat qui nous oblige à livrer au moins 5 tables par semaine, c'est une contrainte de demande minimale :
> $$x_2 \ge 5$$`
      }
    ]
  },
  {
    title: '5. Résolution Graphique en 2D',
    order: 5,
    duration: 40,
    content: 'Visualisez les contraintes et la fonction objectif sur un graphique 2D pour identifier la solution optimale.',
    contents: [
      {
        title: 'Tracer les contraintes',
        contentType: 'text',
        order: 1,
        content: `# La Résolution Graphique

Lorsque notre problème ne comporte que deux variables de décision ($x_1$ et $x_2$), nous pouvons représenter graphiquement le problème pour trouver la solution optimale.

Chaque contrainte linéaire est représentée par une droite. L'inégalité associée définit un demi-plan. L'intersection de tous ces demi-plans forme une zone géométrique appelée la **région réalisable** (ou le polytope des solutions). C'est la zone où toutes les contraintes sont respectées en même temps.

Voici le graphique représentant notre menuiserie El Bahdja :

![Représentation Graphique de la Programmation Linéaire](/courses/ro_simplex_graph.png)

## Recherche du sommet optimal
La théorie mathématique de l'optimisation linéaire stipule que **la solution optimale se trouve toujours sur l'un des sommets (coins) de la région réalisable**.

Pour identifier le meilleur sommet, on trace des droites représentant différents niveaux de bénéfice (droites d'iso-valeur de la fonction objectif). On déplace ensuite cette droite parallèlement à elle-même dans la direction qui augmente le bénéfice (vers le haut et la droite) jusqu'à ce qu'elle quitte la région réalisable. Le dernier point de contact est notre solution optimale.`
      }
    ]
  },
  {
    title: '6. Le Concept de Région Réalisable et Sommets Optimaux',
    order: 6,
    duration: 30,
    content: 'Comprenez la géométrie des programmes linéaires et pourquoi l\'optimum se trouve toujours sur un sommet.',
    contents: [
      {
        title: 'Géométrie des polytopes',
        contentType: 'text',
        order: 1,
        content: `# Géométrie des polytopes

La région réalisable d'un programme linéaire est un **polytope convexe** (un polygone en 2D, un polyèdre en 3D). La convexité est une propriété mathématique fondamentale : si vous prenez deux points quelconques dans la région réalisable, le segment qui les relie est également entièrement à l'intérieur de cette région.

## Théorème fondamental de la programmation linéaire
> Si un programme linéaire admet une solution optimale unique, celle-ci se situe nécessairement sur un point extrême (sommet) de la région réalisable. Si plusieurs solutions optimales existent, alors au moins deux sommets sont optimaux, ainsi que tous les points situés sur le segment qui les relie (solutions optimales multiples).

Dans notre exemple, les sommets de la zone réalisable sont :
- $A(0, 0)$ : Bénéfice = 0 DA
- $B(20, 0)$ : Bénéfice = 60 000 DA
- $C(0, 20)$ : Bénéfice = 100 000 DA
- $D(10, 15)$ : Bénéfice = 105 000 DA.

Le point optimal est donc **$D(10, 15)$** avec un bénéfice maximal de **105 000 DA**.`
      }
    ]
  },

  // ================= MODULE 2 : PROGRAMMATION LINEAIRE AVANCEE =================
  {
    title: '7. L\'Algorithme du Simplexe : Fondements',
    order: 7,
    duration: 40,
    content: 'Découvrez les bases théoriques du Simplexe, conçu pour résoudre des problèmes à n variables.',
    contents: [
      {
        title: 'George Dantzig et le Simplexe',
        contentType: 'text',
        order: 1,
        content: `# L'algorithme du Simplexe

Dans la vie réelle, un problème d'optimisation comporte souvent des milliers de variables et de contraintes. Il est alors impossible de dessiner un graphique.

En 1947, le mathématicien américain **George Dantzig** a inventé la méthode du **Simplexe**, qui reste l'un des algorithmes les plus importants du XXe siècle.

## Principe du Simplexe
Le Simplexe est un algorithme itératif qui procède ainsi :
1. **Initialisation** : Démarrer à un sommet réalisable connu (ex: $x_1=0, x_2=0$).
2. **Recherche de direction** : Évaluer les sommets voisins pour voir si l'un d'eux améliore la fonction objectif.
3. **Transition (Pivot)** : Se déplacer vers le sommet voisin qui améliore l'objectif.
4. **Optimalité** : S'arrêter lorsqu'aucun sommet voisin n'offre d'amélioration. La convexité garantit que cet optimum local est l'optimum global.`
      }
    ]
  },
  {
    title: '8. Le Simplexe par le Calcul (Tableaux)',
    order: 8,
    duration: 45,
    content: 'Apprenez à dresser un tableau du Simplexe et à effectuer les opérations de pivot à la main.',
    contents: [
      {
        title: 'Le Tableau du Simplexe',
        contentType: 'text',
        order: 1,
        content: `# Le Tableau du Simplexe et le Pivot

Pour résoudre algébriquement, on transforme les inégalités en égalités en ajoutant des **variables d'écart** ($e_1, e_2$ positive ou nulle) :
$$2x_1 + 4x_2 + e_1 = 80$$
$$3x_1 + 2x_2 + e_2 = 60$$

On dresse ensuite un tableau :

| Base | $x_1$ | $x_2$ | $e_1$ | $e_2$ | R.H.S (Valeur) |
|---|---|---|---|---|---|
| $e_1$ | 2 | **4** | 1 | 0 | 80 |
| $e_2$ | 3 | 2 | 0 | 1 | 60 |
| **$z$** | -3000 | -5000 | 0 | 0 | 0 |

On sélectionne la variable hors-base ayant le coût réduit le plus négatif (ici $x_2$ avec -5000) comme variable entrante. On calcule ensuite le rapport minimal de la colonne R.H.S par la colonne entrante ($80/4 = 20$ et $60/2 = 30$). Le plus petit rapport (20) désigne $e_1$ comme variable sortante. Le croisement donne le **pivot** (4). On effectue des opérations sur les lignes pour rendre la colonne du pivot nulle sauf à l'emplacement du pivot (qui doit valoir 1).`
      }
    ]
  },
  {
    title: '9. Le Simplexe en Variables Continues avec Python (PuLP)',
    order: 9,
    duration: 40,
    content: 'Installez PuLP et écrivez votre premier programme pour résoudre le cas de la menuiserie.',
    contents: [
      {
        title: 'Résolution avec PuLP',
        contentType: 'code',
        order: 1,
        content: `# ── Résolution de la Menuiserie avec PuLP ─────────────────────────────────────
import pulp

def resoudre():
    # 1. Initialiser le problème
    model = pulp.LpProblem("Menuiserie_El_Bahdja", pulp.LpMaximize)

    # 2. Variables de décision (continues)
    x1 = pulp.LpVariable("Chaises", lowBound=0, cat='Continuous')
    x2 = pulp.LpVariable("Tables", lowBound=0, cat='Continuous')

    # 3. Fonction objectif
    model += 3000 * x1 + 5000 * x2, "Profit"

    # 4. Contraintes
    model += 2 * x1 + 4 * x2 <= 80, "Bois"
    model += 3 * x1 + 2 * x2 <= 60, "Temps"

    # 5. Solveur
    model.solve()

    # 6. Affichage
    print(f"Statut : {pulp.LpStatus[model.status]}")
    print(f"Chaises à fabriquer : {x1.varValue}")
    print(f"Tables à fabriquer  : {x2.varValue}")
    print(f"Profit optimal      : {pulp.value(model.objective)} DA")

if __name__ == "__main__":
    resoudre()`
      }
    ]
  },
  {
    title: '10. Slack variables et interprétation des résultats',
    order: 10,
    duration: 35,
    content: 'Analysez les variables d\'écart (Slack) pour identifier les contraintes critiques ou saturées.',
    contents: [
      {
        title: 'Interprétation des écarts',
        contentType: 'text',
        order: 1,
        content: `# Variables d'écart (Slack)

Une **variable d'écart** représente la différence entre la ressource disponible et la ressource réellement consommée à l'optimum.

- Si une contrainte a un **slack de 0**, cela signifie que la ressource associée est entièrement consommée. On dit que la **contrainte est active (ou saturée)**. Elle bloque l'amélioration de notre bénéfice.
- Si une contrainte a un **slack strictement supérieur à 0**, cela signifie qu'il reste de la ressource inutilisée. C'est une **contrainte inactive**.

Dans notre cas de la menuiserie :
- Bois consommé = $2(10) + 4(15) = 80$ kg (Bois total = 80, slack = 0).
- Temps consommé = $3(10) + 2(15) = 60$ h (Temps total = 60, slack = 0).
Les deux contraintes sont saturées. Si l'artisan veut gagner plus d'argent, il doit soit acheter plus de bois, soit travailler plus d'heures.`
      }
    ]
  },
  {
    title: '11. La Dualité en Programmation Linéaire',
    order: 11,
    duration: 45,
    content: 'Découvrez comment tout programme linéaire primal possède un programme dual associé.',
    contents: [
      {
        title: 'Théorie de la Dualité',
        contentType: 'text',
        order: 1,
        content: `# La Théorie de la Dualité

À tout programme linéaire (appelé **Primal**), on peut associer de façon systématique un autre programme linéaire appelé **Dual**.

Si le Primal cherche à maximiser un profit sous des contraintes de ressources, le Dual cherche à **minimiser la valeur totale attribuée aux ressources** tout en garantissant que le bénéfice d'aucun produit ne dépasse sa valeur intrinsèque.

## Règles de passage du Primal au Dual :
- Si le Primal a $n$ variables et $m$ contraintes, le Dual aura $m$ variables et $n$ contraintes.
- Une maximisation dans le Primal devient une minimisation dans le Dual.
- Les coefficients de la fonction objectif du Primal deviennent les seconds membres (R.H.S) du Dual, et vice-versa.
- La matrice des contraintes est transposée.`
      }
    ]
  },
  {
    title: '12. Analyse de Sensibilité et Prix Duaux',
    order: 12,
    duration: 40,
    content: 'Interprétez les prix duaux (Shadow Prices) pour savoir combien payer pour obtenir des ressources supplémentaires.',
    contents: [
      {
        title: 'Shadow Prices en Python',
        contentType: 'code',
        order: 1,
        content: `# ── Analyse de Sensibilité avec PuLP ─────────────────────────────────────────
import pulp

def sensibilite():
    model = pulp.LpProblem("Menuiserie", pulp.LpMaximize)
    x1 = pulp.LpVariable("Chaises", lowBound=0)
    x2 = pulp.LpVariable("Tables", lowBound=0)

    model += 3000 * x1 + 5000 * x2
    model += 2 * x1 + 4 * x2 <= 80, "Bois"
    model += 3 * x1 + 2 * x2 <= 60, "Temps"

    model.solve()

    print("=== PRIX DUAUX (SHADOW PRICES) ===")
    # Le prix dual (shadow price) correspond au gain marginal d'une unité de ressource
    # En PuLP, on l'obtient via l'attribut .pi de la contrainte
    for name, c in model.constraints.items():
        print(f"Contrainte {name:6s} -> Prix Dual : {c.pi:.2f} DA / unité de ressource")

if __name__ == "__main__":
    sensibilite()`
      }
    ]
  },

  // ================= MODULE 3 : OPTIMISATION DANS LES GRAPHES ET RESEAUX =================
  {
    title: '13. Théorie des Graphes et Logistique',
    order: 13,
    duration: 35,
    content: 'Modélisez les réseaux de transport et stockez les connexions logistiques sous forme de graphes.',
    contents: [
      {
        title: 'Introduction aux Graphes',
        contentType: 'text',
        order: 1,
        content: `# Les Graphes en Logistique

Un **graphe** est un modèle mathématique composé de points (les **noeuds** ou sommets) reliés par des lignes (les **arcs** ou arêtes).

Dans un réseau de transport :
- Les **noeuds** représentent des villes (Alger, Oran, Constantine) ou des entrepôts.
- Les **arcs** représentent des routes ou des vols.
- Les **poids** sur les arcs représentent des distances en km, des temps de trajet en heures ou des coûts de carburant en dinars.

> [!NOTE]
> Un graphe est dit **orienté** si les arcs ont un sens unique de parcours (ex. une rue en sens interdit) et **non orienté** si les liaisons se font dans les deux sens.`
      }
    ]
  },
  {
    title: '14. Le Plus Court Chemin : Algorithme de Dijkstra',
    order: 14,
    duration: 45,
    content: 'Comprenez l\'algorithme de Dijkstra étape par étape pour calculer le trajet le plus rapide.',
    contents: [
      {
        title: 'Fonctionnement de Dijkstra',
        contentType: 'text',
        order: 1,
        content: `# L'algorithme de Dijkstra

L'algorithme de **Dijkstra** (1956) résout le problème du plus court chemin reliant un noeud source à tous les autres noeuds du graphe.

## Étapes de l'algorithme :
1. Assigner à chaque noeud une distance temporaire : 0 pour le noeud de départ, l'infini pour les autres.
2. Déclarer le noeud de départ comme noeud actif actuel.
3. Pour le noeud actif actuel, évaluer tous ses voisins non visités et calculer leur distance accumulée. Mettre à jour la distance si le nouveau chemin est plus court.
4. Une fois tous les voisins du noeud actif évalués, le marquer comme "visité". Un noeud visité ne sera plus jamais réévalué.
5. Sélectionner le noeud non visité ayant la distance minimale et le définir comme nouveau noeud actif.
6. Répéter jusqu'à ce que tous les noeuds soient visités.

Voici le réseau logistique routier algérien que nous allons résoudre :

![Réseau Logistique Algérien](/courses/ro_dijkstra_graph.png)`
      }
    ]
  },
  {
    title: '15. Implémentation de Dijkstra avec Python (NetworkX)',
    order: 15,
    duration: 40,
    content: 'Développez un script Python avec la bibliothèque NetworkX pour trouver le meilleur itinéraire routier.',
    contents: [
      {
        title: 'Code Dijkstra avec NetworkX',
        contentType: 'code',
        order: 1,
        content: `# ── Plus court chemin en Algérie avec NetworkX ──────────────────────────────
import networkx as nx

def calculer_trajet():
    G = nx.DiGraph()

    # Définition du réseau routier
    G.add_edge('Alger', 'Blida', weight=50)
    G.add_edge('Alger', 'Constantine', weight=400)
    G.add_edge('Blida', 'Oran', weight=370)
    G.add_edge('Blida', 'Constantine', weight=380)
    G.add_edge('Oran', 'Ghardaia', weight=720)
    G.add_edge('Constantine', 'Ghardaia', weight=580)
    G.add_edge('Alger', 'Ghardaia', weight=600)

    chemin = nx.shortest_path(G, source='Alger', target='Ghardaia', weight='weight')
    distance = nx.shortest_path_length(G, source='Alger', target='Ghardaia', weight='weight')

    print(f"Itinéraire optimal : {' -> '.join(chemin)}")
    print(f"Distance totale    : {distance} km")

if __name__ == "__main__":
    calculer_trajet()`
      }
    ]
  },
  {
    title: '16. Problème de l\'Arbre Couvrant Minimum (Kruskal/Prim)',
    order: 16,
    duration: 35,
    content: 'Apprenez comment connecter plusieurs villes avec le minimum de câblage ou de tuyauterie.',
    contents: [
      {
        title: 'Algorithmes de Kruskal et Prim',
        contentType: 'code',
        order: 1,
        content: `# ── Arbre Couvrant Minimum (MST) avec NetworkX ──────────────────────────────
import networkx as nx

def optimiser_reseau():
    # Création d'un graphe non orienté pour connecter des serveurs régionaux
    G = nx.Graph()
    G.add_edge('Alger', 'Oran', weight=350)
    G.add_edge('Alger', 'Constantine', weight=400)
    G.add_edge('Oran', 'Constantine', weight=600)
    G.add_edge('Alger', 'Ghardaia', weight=600)
    G.add_edge('Oran', 'Ghardaia', weight=720)
    G.add_edge('Constantine', 'Ghardaia', weight=580)

    # Calcul de l'Arbre Couvrant Minimum (Minimum Spanning Tree - MST)
    # Kruskal est le solveur par défaut sous NetworkX
    mst = nx.minimum_spanning_tree(G, algorithm='kruskal')

    print("Connexions optimales à installer pour connecter toutes les villes au coût minimal :")
    cout_total = 0
    for u, v, data in mst.edges(data=True):
        print(f"  {u} <---> {v} | Coût : {data['weight']} millions DA")
        cout_total += data['weight']
    print(f"Coût total de l'infrastructure : {cout_total} millions DA")

if __name__ == "__main__":
    optimiser_reseau()`
      }
    ]
  },
  {
    title: '17. Le Problème de Flot Maximum (Ford-Fulkerson)',
    order: 17,
    duration: 40,
    content: 'Maximisez le transfert d\'éléments (eau, données, colis) à travers un réseau aux capacités limitées.',
    contents: [
      {
        title: 'Ford-Fulkerson en Python',
        contentType: 'code',
        order: 1,
        content: `# ── Calcul de Flot Maximum avec NetworkX ────────────────────────────────────
import networkx as nx

def flot_maximum():
    G = nx.DiGraph()

    # Définition des capacités maximales des pipelines de carburant (en m3/h)
    G.add_edge('Source_Alger', 'Station_A', capacity=100)
    G.add_edge('Source_Alger', 'Station_B', capacity=80)
    G.add_edge('Station_A', 'Station_C', capacity=60)
    G.add_edge('Station_B', 'Station_C', capacity=20)
    G.add_edge('Station_B', 'Station_D', capacity=70)
    G.add_edge('Station_C', 'Terminal_Ghardaia', capacity=70)
    G.add_edge('Station_D', 'Terminal_Ghardaia', capacity=80)

    # Algorithme de Ford-Fulkerson sous le capot
    valeur_flot, plan_flot = nx.maximum_flow(G, 'Source_Alger', 'Terminal_Ghardaia')

    print(f"Débit maximal acheminable : {valeur_flot} m3/h\n")
    print("Plan de distribution du flux :")
    for depart, destinations in plan_flot.items():
        for dest, flux in destinations.items():
            if flux > 0:
                capacite = G[depart][dest]['capacity']
                print(f"  {depart:12s} ---> {dest:18s} : {flux:3d} / {capacite:3d} m3/h")

if __name__ == "__main__":
    flot_maximum()`
      }
    ]
  },
  {
    title: '18. Ordonnancement de Projets (PERT / CPM)',
    order: 18,
    duration: 45,
    content: 'Optimisez les étapes de planification de chantiers en calculant le chemin critique.',
    contents: [
      {
        title: 'Chemin Critique (CPM)',
        contentType: 'text',
        order: 1,
        content: `# Ordonnancement : Méthode PERT et CPM

La gestion de projets complexes (comme le bâtiment ou le développement de logiciels) nécessite d'ordonnancer des tâches ayant des contraintes d'antériorité (une tâche ne peut démarrer avant que sa précédente ne soit finie).

- **CPM** (*Critical Path Method*) : Détermine la durée minimale du projet et identifie le **chemin critique** (les tâches sur lesquelles tout retard retarde le projet entier).
- **PERT** (*Program Evaluation and Review Technique*) : Introduit la probabilité et l'incertitude sur la durée des tâches.`
      }
    ]
  },

  // ================= MODULE 4 : PROGRAMMATION EN NOMBRES ENTIERS & PROBLEMES CLASSIQUES =================
  {
    title: '19. Programmation Linéaire en Nombres Entiers (PLNE)',
    order: 19,
    duration: 35,
    content: 'Comprenez pourquoi imposer des variables entières ou binaires (0 ou 1) change radicalement la résolution.',
    contents: [
      {
        title: 'Variables Entières et Binaires',
        contentType: 'text',
        order: 1,
        content: `# Programmation Linéaire en Nombres Entiers (PLNE)

En programmation linéaire standard, le solveur peut proposer des solutions avec des valeurs décimales (ex. produire 12.63 chaises). C'est impossible dans beaucoup de domaines :
- On ne peut pas produire de fraction d'objet indivisible (avion, voiture, chaise).
- On doit parfois prendre des décisions logiques binaires : Oui (1) ou Non (0) (ex: construire un entrepôt dans une ville).

> [!WARNING]
> Ajouter la contrainte d'intégralité transforme le problème de facile (résolu en temps polynomial par le Simplexe) à difficile (NP-complet). Le solveur doit explorer les possibilités à l'aide d'arbres de décision.`
      }
    ]
  },
  {
    title: '20. Algorithme de Séparation et Évaluation (Branch & Bound)',
    order: 20,
    duration: 40,
    content: 'Découvrez comment le Branch & Bound subdivise le problème pour éliminer les zones sous-optimales.',
    contents: [
      {
        title: 'Principe du Branch and Bound',
        contentType: 'text',
        order: 1,
        content: `# L'algorithme Branch & Bound

L'algorithme de **Séparation et Évaluation** (en anglais *Branch & Bound*) est la méthode la plus utilisée pour résoudre les programmes linéaires en nombres entiers.

## Comment fonctionne-t-il ?
1. **Relaxation continue** : Résoudre le programme linéaire en oubliant la contrainte que les variables doivent être entières.
2. **Subdivision (Branching)** : Si une variable de décision $x_1$ vaut 3.4, l'algorithme sépare le problème en deux sous-problèmes :
   - Sous-problème A : $x_1 \le 3$
   - Sous-problème B : $x_1 \ge 4$
3. **Évaluation (Bounding)** : Calculer la meilleure valeur théorique (borne) pour chaque sous-problème. Si cette borne est moins bonne que la meilleure solution entière déjà connue, on élimine la branche (élagage).
4. On répète jusqu'à ce que tous les sous-problèmes soient résolus ou éliminés.`
      }
    ]
  },
  {
    title: '21. Le Problème du Sac à Dos (Knapsack Problem)',
    order: 21,
    duration: 45,
    content: 'Sélectionnez les objets les plus rentables à emporter dans un sac à dos à capacité maximale limitée.',
    contents: [
      {
        title: 'Résoudre le Sac à Dos avec PuLP',
        contentType: 'code',
        order: 1,
        content: `# ── Résolution du Sac à Dos (Knapsack) avec PuLP ────────────────────────────
import pulp

def optimiser_sac_a_dos():
    # Définition des objets (valeur en DA, poids en kg)
    objets = {
        'PC_Portable': {'valeur': 80000, 'poids': 2},
        'Appareil_Photo': {'valeur': 50000, 'poids': 1.5},
        'Livre_RO': {'valeur': 6000, 'poids': 1},
        'Gourde': {'valeur': 3000, 'poids': 0.8},
        'Projecteur': {'valeur': 60000, 'poids': 4}
    }
    
    capacite_max = 5  # Sac limité à 5 kg

    prob = pulp.LpProblem("Sac_a_dos", pulp.LpMaximize)

    # Variables de décision BINAIRES (1 si on prend l'objet, 0 sinon)
    x = pulp.LpVariable.dicts("Prendre", objets.keys(), cat='Binary')

    # Fonction objectif : Maximiser la valeur des objets choisis
    prob += sum(objets[o]['valeur'] * x[o] for o in objets.keys())

    # Contrainte : Le poids total ne doit pas dépasser la capacité du sac
    prob += sum(objets[o]['poids'] * x[o] for o in objets.keys()) <= capacite_max

    prob.solve()

    print("=== CONTENU DU SAC À DOS OPTIMAL ===")
    poids_total = 0
    valeur_totale = 0
    for o in objets.keys():
        if x[o].varValue == 1:
            print(f"  [x] {o} ({objets[o]['valeur']} DA, {objets[o]['poids']} kg)")
            poids_total += objets[o]['poids']
            valeur_totale += objets[o]['valeur']
    print(f"\nValeur totale embarquée : {valeur_totale:,.2f} DA")
    print(f"Poids total embarqué    : {poids_total:.2f} / {capacite_max} kg")

if __name__ == "__main__":
    optimiser_sac_a_dos()`
      }
    ]
  },
  {
    title: '22. Le Problème d\'Affectation (Matching)',
    order: 22,
    duration: 35,
    content: 'Affectez de manière optimale des employés à des machines ou des tâches pour réduire la pénibilité.',
    contents: [
      {
        title: 'Algorithme d\'Affectation en Python',
        contentType: 'code',
        order: 1,
        content: `# ── Résolution d'un Problème d'Affectation avec PuLP ──────────────────────────
import pulp

def affecter_taches():
    employes = ['Amine', 'Sarah', 'Kamel']
    taches = ['Tache_A', 'Tache_B', 'Tache_C']

    # Coût ou pénibilité de chaque employé pour chaque tâche (plus bas c'est mieux)
    couts = {
        'Amine': {'Tache_A': 10, 'Tache_B': 20, 'Tache_C': 5},
        'Sarah': {'Tache_A': 8, 'Tache_B': 15, 'Tache_C': 12},
        'Kamel': {'Tache_A': 12, 'Tache_B': 9, 'Tache_C': 14}
    }

    prob = pulp.LpProblem("Affectation_Taches", pulp.LpMinimize)

    # Variable binaire x[e][t] : 1 si l'employé e fait la tâche t, 0 sinon
    x = pulp.LpVariable.dicts("Affecte", (employes, taches), cat='Binary')

    # Fonction objectif : Minimiser le coût d'affectation total
    prob += sum(couts[e][t] * x[e][t] for e in employes for t in taches)

    # Chaque employé doit recevoir exactement UNE tâche
    for e in employes:
        prob += sum(x[e][t] for t in taches) == 1

    # Chaque tâche doit être exécutée par exactement UN employé
    for t in taches:
        prob += sum(x[e][t] for e in employes) == 1

    prob.solve()

    print("=== AFFECTATION OPTIMALE ===")
    for e in employes:
        for t in taches:
            if x[e][t].varValue == 1:
                print(f"  {e:5s} ---> {t} | Coût : {couts[e][t]}")

if __name__ == "__main__":
    affecter_taches()`
      }
    ]
  },
  {
    title: '23. Le Problème de Transport Standard',
    order: 23,
    duration: 40,
    content: 'Optimisez l\'acheminement de marchandises depuis des usines de départ vers des centres de vente.',
    contents: [
      {
        title: 'Le Problème de Transport',
        contentType: 'text',
        order: 1,
        content: `# Le Problème de Transport

Le problème de transport classique consiste à expédier un bien homogène depuis $m$ origines (usines, entrepôts) ayant des capacités d'offre fixes vers $n$ destinations (magasins, hubs régionaux) ayant des demandes clients connues.

L'objectif est de minimiser le coût total de transport sachant que le coût d'expédition d'une unité est proportionnel à la distance entre l'origine et la destination.

Voici le réseau de distribution logistique DzLogistics que nous allons optimiser par la suite :

![Réseau Supply Chain DzLogistics](/courses/ro_supply_chain.png)`
      }
    ]
  },
  {
    title: '24. Planification de Production Multi-périodes',
    order: 24,
    duration: 45,
    content: 'Anticipez les variations de demande sur 6 mois en arbitrant entre surproduction et coûts de stockage.',
    contents: [
      {
        title: 'Planification de Production',
        contentType: 'text',
        order: 1,
        content: `# Planification Multi-périodes

Dans l'industrie, la demande fluctue au cours de l'année (ex: plus de boissons fraîches en été). Une entreprise a deux solutions :
1. **Ajuster la production** chaque mois pour coller à la demande. Cela engendre des coûts de main-d'œuvre fluctuants (embauche d'intérimaires, heures supplémentaires).
2. **Produire à taux constant** et stocker le surplus pendant les périodes creuses pour le vendre pendant les pics. Cela engendre des coûts de stockage importants.

Un modèle d'optimisation linéaire multi-périodes permet de trouver le compromis parfait entre coût de production et coût de stockage pour maximiser les profits.`
      }
    ]
  },

  // ================= MODULE 5 : INTELLIGENCE ARTIFICIELLE & METAHEURISTIQUES =================
  {
    title: '25. Limites du Simplexe : La Complexité NP-difficile',
    order: 25,
    duration: 35,
    content: 'Découvrez pourquoi certains problèmes combinatoires font s\'effondrer les serveurs de calcul classiques.',
    contents: [
      {
        title: 'La barrière NP-difficile',
        contentType: 'text',
        order: 1,
        content: `# Limites de la RO classique et complexité NP-difficile

L'algorithme du Simplexe résout les programmes linéaires continus de manière extrêmement efficace. Cependant, lorsqu'on impose des contraintes d'intégralité (variables entières) ou des structures combinatoires discrètes, on fait face à des problèmes dits **NP-difficiles**.

Dans ces cas, le nombre de solutions possibles augmente à un rythme factoriel ou exponentiel avec le nombre de données.
*Exemple :* Le problème du voyageur de commerce qui doit visiter $n$ villes. Le nombre de trajets possibles est :
$$(n-1)! / 2$$
Pour seulement 20 villes, il y a plus de $6 \times 10^{16}$ trajets possibles. Si votre ordinateur calculait 1 million de trajets par seconde, il lui faudrait près de **2 000 ans** pour trouver la solution optimale !`
      }
    ]
  },
  {
    title: '26. Introduction aux Métaheuristiques de l\'IA',
    order: 26,
    duration: 40,
    content: 'Découvrez comment les algorithmes d\'IA approchent l\'optimum en quelques millisecondes.',
    contents: [
      {
        title: 'Les Métaheuristiques',
        contentType: 'text',
        order: 1,
        content: `# Les Métaheuristiques d'IA

Pour surmonter les limites des algorithmes exacts, la recherche en Intelligence Artificielle a développé des méthodes d'approximation appelées **métaheuristiques**.

Une métaheuristique est une stratégie algorithmique générale capable de s'adapter à une large gamme de problèmes d'optimisation difficiles sans nécessiter de formulation linéaire stricte.

## Avantages :
- **Rapidité** : Donne de très bonnes solutions en quelques secondes ou millisecondes.
- **Flexibilité** : Fonctionne sur des objectifs non linéaires complexes ou discontinus.

## Inconvénients :
- Ne garantit pas à 100% de trouver l'optimum mathématique absolu (mais donne une solution à moins de 1% de l'optimum en pratique).`
      }
    ]
  },
  {
    title: '27. Algorithme du Recuit Simulé (Simulated Annealing)',
    order: 27,
    duration: 45,
    content: 'Comprenez l\'algorithme inspiré du traitement thermique des métaux en métallurgie.',
    contents: [
      {
        title: 'Le Recuit Simulé',
        contentType: 'text',
        order: 1,
        content: `# L'algorithme du Recuit Simulé

Le **Recuit Simulé** s'inspire du processus de recuit en métallurgie : on chauffe un métal à haute température, puis on le refroidit très lentement pour réorganiser ses atomes de manière stable et solide (état d'énergie minimale).

## Traduction algorithmique :
1. **Température élevée** : Au début, l'algorithme accepte volontiers des solutions moins bonnes. Cela lui permet d'explorer l'espace des solutions et d'**échapper aux optimums locaux** (pièges).
2. **Refroidissement progressif** : Au fur et à mesure que la température baisse, l'algorithme devient plus sélectif et converge vers les zones de haute performance.
3. **Température basse** : L'algorithme se stabilise dans le meilleur creux trouvé.`
      }
    ]
  },
  {
    title: '28. Résolution du Voyageur de Commerce (TSP) en Algérie',
    order: 28,
    duration: 50,
    content: 'Écrivez le code du Recuit Simulé en Python pour planifier une tournée de livraison nationale.',
    contents: [
      {
        title: 'Code TSP Recuit Simulé',
        contentType: 'code',
        order: 1,
        content: `# ── Résolution du Voyageur de Commerce (TSP) avec le Recuit Simulé ──────────
import math
import random

# Définition des coordonnées de 5 villes algériennes (x, y) en km approximatifs
COORDONNEES = {
    'Alger': (0, 0),
    'Oran': (-350, -50),
    'Constantine': (320, 30),
    'Annaba': (450, 80),
    'Ghardaia': (0, -600)
}

def calculer_distance_villes(ville1, ville2):
    coord1 = COORDONNEES[ville1]
    coord2 = COORDONNEES[ville2]
    return math.sqrt((coord1[0] - coord2[0])**2 + (coord1[1] - coord2[1])**2)

def calculer_distance_totale_trajet(trajet):
    distance = 0
    for i in range(len(trajet)):
        ville_actuelle = trajet[i]
        ville_suivante = trajet[(i + 1) % len(trajet)]
        distance += calculer_distance_villes(ville_actuelle, ville_suivante)
    return distance

def recuit_simule():
    villes = list(COORDONNEES.keys())
    trajet_actuel = list(villes)
    random.shuffle(trajet_actuel)
    
    distance_actuelle = calculer_distance_totale_trajet(trajet_actuel)
    
    meilleur_trajet = list(trajet_actuel)
    meilleure_distance = distance_actuelle

    temperature = 1000.0
    taux_refroidissement = 0.99
    temperature_minimale = 0.01

    print("Initialisation du Recuit Simulé...")
    print(f"  Distance initiale : {distance_actuelle:.2f} km\n")

    while temperature > temperature_minimale:
        nouveau_trajet = list(trajet_actuel)
        idx1, idx2 = random.sample(range(len(villes)), 2)
        nouveau_trajet[idx1], nouveau_trajet[idx2] = nouveau_trajet[idx2], nouveau_trajet[idx1]
        
        nouvelle_distance = calculer_distance_totale_trajet(nouveau_trajet)
        difference = nouvelle_distance - distance_actuelle

        if difference < 0 or random.random() < math.exp(-difference / temperature):
            trajet_actuel = list(nouveau_trajet)
            distance_actuelle = nouvelle_distance

            if distance_actuelle < meilleure_distance:
                meilleur_trajet = list(trajet_actuel)
                meilleure_distance = distance_actuelle

        temperature *= taux_refroidissement

    print("============ RÉSULTATS RECUIT SIMULÉ ============")
    print(f"Meilleur trajet trouvé    : {' -> '.join(meilleur_trajet)} -> {meilleur_trajet[0]}")
    print(f"Distance minimale obtenue : {meilleure_distance:.2f} km")
    print("=================================================\n")

if __name__ == "__main__":
    random.seed(42)
    recuit_simule()`
      },
      {
        title: 'Illustration de la tournée nationale',
        contentType: 'text',
        order: 2,
        content: `# Itinéraire optimal obtenu

Voici la cartographie du trajet optimal obtenu pour notre tournée nationale logistique reliant les hubs régionaux algériens, calculée par le Recuit Simulé :

![Voyageur de Commerce Algérie](/courses/ro_tsp_algeria_map.png)`
      }
    ]
  },
  {
    title: '29. Introduction aux Algorithmes Génétiques',
    order: 29,
    duration: 40,
    content: 'Apprenez comment simuler la sélection naturelle de Darwin en Python pour faire évoluer des solutions.',
    contents: [
      {
        title: 'Darwinisme algorithmique',
        contentType: 'text',
        order: 1,
        content: `# Algorithmes Génétiques (AG)

Les **Algorithmes Génétiques** s'inspirent de la théorie de l'évolution naturelle. Les solutions possibles au problème sont codées sous forme de "chromosomes" (souvent des chaînes binaires).

## Étapes de l'algorithme :
1. **Population initiale** : Générer au hasard un ensemble de solutions (individus).
2. **Évaluation (Fitness)** : Calculer la qualité (adaptation) de chaque solution.
3. **Sélection** : Choisir les meilleures solutions pour devenir des parents.
4. **Croisement (Crossover)** : Combiner des parties de deux parents pour créer des enfants (nouvelles solutions).
5. **Mutation** : Modifier au hasard quelques éléments des enfants pour maintenir la diversité génétique et éviter les pièges.
6. **Remplacement** : La nouvelle génération remplace l'ancienne. On recommence à l'étape 2 jusqu'à convergence.`
      }
    ]
  },
  {
    title: '30. IA Générative et Formulation de Problèmes de RO',
    order: 30,
    duration: 50,
    content: 'Utilisez les LLM de manière intelligente pour rédiger, déboguer et vérifier vos modèles d\'optimisation complexes.',
    contents: [
      {
        title: 'Le futur de l\'optimisation avec l\'IA',
        contentType: 'text',
        order: 1,
        content: `# L'IA Générative comme copilote de modélisation

Les modèles d'IA générative (comme Gemini ou DeepSeek) transforment la façon dont les ingénieurs travaillent en RO. L'écriture d'un modèle d'optimisation mathématique complet à partir d'un cahier des charges client complexe est un exercice difficile.

## Ce que l'IA peut faire pour vous :
1. **Traduction de texte en équations** : Vous décrivez votre problème en langage naturel et l'IA génère la formulation mathématique (variables, fonction objectif et contraintes).
2. **Génération de code solveur** : L'IA peut générer le script Python PuLP ou SciPy complet à partir de la formulation mathématique.
3. **Explication de rapports de solveurs** : Copiez-collez les journaux d'erreurs ou les rapports de solveur, et l'IA vous expliquera quelles contraintes bloquent ou rendent le problème impossible.

> [!TIP]
> Dans cette leçon, nous voyons comment concevoir des prompts ultra-précis pour obtenir des modèles d'optimisation fonctionnels dès le premier coup.`
      }
    ]
  }
];

async function main() {
  console.log('🚀 Démarrage du seed pour le cours de Recherche Opérationnelle (RO) étendu en 30 leçons...\n');

  // 1. Création ou mise à jour de l'entité de cours principale
  const course = await prisma.course.upsert({
    where: { slug: 'recherche-operationnelle-python-ia' },
    update: {
      title: 'Recherche Opérationnelle & Optimisation avec Python & IA',
      title_en: 'Operational Research & Optimization with Python & AI',
      title_ar: 'البحوث العملياتية والتحسين باستخدام بايثون والذكاء الاصطناعي',
      description: 'Maîtrisez la Recherche Opérationnelle de A à Z : de la modélisation à la résolution avec Python et l\'IA.',
      description_en: 'Master Operational Research from A to Z: from modeling to solving with Python and AI.',
      description_ar: 'إتقان البحوث العملياتية من الألف إلى الياء: من النمذجة إلى الحل باستخدام بايثون والذكاء الاصطناعي.',
      price: 0,
      priceDZ: 0,
      priceEU: 0,
      isFree: true,
      isPublished: true,
      level: 'Débutant',
      duration: '30h 00m',
      image: '/courses/ro_course_cover.png',
      learningOutcomes: JSON.stringify(learningOutcomes),
      requirements: JSON.stringify(requirements),
      fullDescription: `# Recherche Opérationnelle & Optimisation avec Python & IA (30 leçons)
      
Devenez capable de résoudre les problèmes de logistique, de planification et d'optimisation de ressources les plus complexes du monde réel.

### Ce que vous allez apprendre :
- **Modélisation Mathématique** : Poser un problème sous forme d'équations (variables, contraintes, objectif).
- **Algorithme du Simplexe & Programmation Linéaire** : Comprendre le fonctionnement des solveurs modernes.
- **Résolution avec Python** : Utiliser la bibliothèque phare **PuLP** pour coder vos programmes linéaires.
- **Graphes et Réseaux** : Trouver les chemins les plus courts et optimiser les flux avec **NetworkX**.
- **Optimisation et IA** : Utiliser les métaheuristiques comme le **Recuit Simulé** pour les problèmes combinatoires (NP-difficiles).
- **Cas Pratiques Réels** : Résolution de cas logistiques nationaux et industriels complets.
      `
    },
    create: {
      id: COURSE_ID,
      title: 'Recherche Opérationnelle & Optimisation avec Python & IA',
      title_en: 'Operational Research & Optimization with Python & AI',
      title_ar: 'البحوث العملياتية والتحسين باستخدام بايثون والذكاء الاصطناعي',
      slug: 'recherche-operationnelle-python-ia',
      description: 'Maîtrisez la Recherche Opérationnelle de A à Z : de la modélisation à la résolution avec Python et l\'IA.',
      description_en: 'Master Operational Research from A to Z: from modeling to solving with Python and AI.',
      description_ar: 'إتقان البحوث العملياتية من الألف إلى الياء: من النmذجة إلى الحل باستخدام بايثون والذكاء الاصطناعي.',
      price: 0,
      priceDZ: 0,
      priceEU: 0,
      isFree: true,
      isPublished: true,
      level: 'Débutant',
      duration: '30h 00m',
      image: '/courses/ro_course_cover.png',
      learningOutcomes: JSON.stringify(learningOutcomes),
      requirements: JSON.stringify(requirements),
      fullDescription: `# Recherche Opérationnelle & Optimisation avec Python & IA (30 leçons)
      
Devenez capable de résoudre les problèmes de logistique, de planification et d'optimisation de ressources les plus complexes du monde réel.

### Ce que vous allez apprendre :
- **Modélisation Mathématique** : Poser un problème sous forme d'équations (variables, contraintes, objectif).
- **Algorithme du Simplexe & Programmation Linéaire** : Comprendre le fonctionnement des solveurs modernes.
- **Résolution avec Python** : Utiliser la bibliothèque phare **PuLP** pour coder vos programmes linéaires.
- **Graphes et Réseaux** : Trouver les chemins les plus courts et optimiser les flux avec **NetworkX**.
- **Optimisation et IA** : Utiliser les métaheuristiques comme le **Recuit Simulé** pour les problèmes combinatoires (NP-difficiles).
- **Cas Pratiques Réels** : Résolution de cas logistiques nationaux et industriels complets.
      `
    }
  });

  console.log(`✓ Cours "${course.title}" créé/mis à jour en base de données.`);

  // 2. Nettoyage des anciennes leçons pour ce cours
  await prisma.lesson.deleteMany({ where: { courseId: COURSE_ID } });
  console.log('✓ Anciennes leçons supprimées.');

  // 3. Création des nouvelles leçons et de leurs contenus
  for (const lesson of lessons) {
    const { contents, ...lessonData } = lesson;
    const createdLesson = await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: COURSE_ID,
        contents: {
          create: contents.map(c => ({
            title: c.title,
            content: c.content,
            contentType: c.contentType,
            order: c.order,
          }))
        }
      }
    });
    console.log(`  ✓ Leçon ${createdLesson.order} créée : "${createdLesson.title}" (${contents.length} sections)`);
  }

  console.log('\n✅ Seeding du cours de Recherche Opérationnelle étendu (30 leçons) complété avec succès !');
}

main()
  .catch(e => {
    console.error('❌ Erreur durant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
