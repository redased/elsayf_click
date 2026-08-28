require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findFirst({ where: { slug: 'antigravity-business-excel' } });
    if (!course) { console.log('Course not found'); return; }
    console.log('Mise à jour:', course.title);

    const lessonsData = [
        {
            order: 1,
            contents: [
                {
                    contentType: 'CALLOUT', title: 'bienvenue', order: 1,
                    content: JSON.stringify({
                        type: 'info',
                        title: '👋 Bienvenue dans cette formation — Aucun prérequis technique nécessaire !',
                        body: 'Cette formation est conçue pour des **débutants complets**. Si vous avez déjà utilisé Excel, vous êtes prêt(e).\n\n**À la fin de cette leçon, vous aurez :**\n✅ Compris ce qu\'est Python en 5 minutes\n✅ Installé Python sur votre ordinateur\n✅ Créé votre premier fichier Excel automatiquement avec du code\n✅ Compris la différence entre Excel manuel et Excel automatisé'
                    })
                },
                {
                    contentType: 'TEXT', title: 'python-kesako', order: 2,
                    content: `## C'est quoi Python ? L'explication la plus simple du monde

Imaginez que vous devez préparer 100 factures Excel identiques, chacune avec le nom d'un client différent. Manuellement, ça prendrait une journée entière.

**Python, c'est votre assistant qui fait ça en 3 secondes.**

Vous lui expliquez ce que vous voulez faire UNE SEULE FOIS, et il le fait autant de fois que nécessaire, sans se tromper, sans se fatiguer.

### Comparaison Excel vs Python

| Ce que vous faites | Excel Manuel | Python |
|---|---|---|
| Créer 100 factures | 5 heures | 3 secondes |
| Changer la couleur de 500 cellules | 30 minutes | 5 secondes |
| Calculer les salaires de 200 employés | 2 heures | 10 secondes |
| Consolider 20 fichiers en 1 | Demi-journée | 15 secondes |

### Pourquoi pas juste des macros Excel ?

Les macros Excel sont limitées à Excel. Python peut :
- Travailler avec des fichiers Excel, PDF, Word, CSV en même temps
- Se connecter à Internet pour récupérer des données
- Envoyer des emails automatiquement
- Interagir avec l'IA (ChatGPT, Gemini)

---

## Installer Python — Étape par Étape (5 minutes)

### Étape 1 : Télécharger Python

1. Ouvrez votre navigateur et allez sur **python.org**
2. Cliquez sur le gros bouton jaune **"Download Python"**
3. Téléchargez la version pour Windows (ou Mac)

### Étape 2 : Installer Python

1. Ouvrez le fichier téléchargé
2. ⚠️ **IMPORTANT** : Cochez la case **"Add Python to PATH"** en bas avant de cliquer sur Install
3. Cliquez **"Install Now"**
4. Attendez 2-3 minutes

### Étape 3 : Vérifier l'installation

1. Appuyez sur **Windows + R**, tapez \`cmd\`, appuyez Entrée
2. Dans la fenêtre noire, tapez :
\`\`\`
python --version
\`\`\`
3. Vous devez voir quelque chose comme : \`Python 3.12.0\`

Si vous voyez ce message → Python est installé ! ✅

### Étape 4 : Installer openpyxl (la bibliothèque Excel)

Dans la même fenêtre noire, tapez :
\`\`\`
pip install openpyxl
\`\`\`
Attendez que ça se termine. Vous verrez **"Successfully installed openpyxl"**. ✅`
                },
                {
                    contentType: 'CALLOUT', title: 'qu-est-ce-que-pip', order: 3,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '🛒 Qu\'est-ce que pip ? Pensez à l\'App Store',
                        body: '**pip** est comme l\'App Store ou Google Play de Python.\n\nQuand vous tapez `pip install openpyxl`, c\'est comme si vous téléchargiez une application gratuite sur votre téléphone — sauf que c\'est un "module" qui donne de nouvelles capacités à Python.\n\n**Modules utiles à connaître :**\n- `openpyxl` → Créer et modifier des fichiers Excel\n- `pandas` → Analyser de grands tableaux de données\n- `matplotlib` → Créer des graphiques\n- `requests` → Récupérer des données sur Internet\n\nTous sont **gratuits** et s\'installent avec `pip install nom_du_module`'
                    })
                },
                {
                    contentType: 'TEXT', title: 'premier-code', order: 4,
                    content: `## Votre Premier Code Python : Créer un Fichier Excel

Nous allons créer un fichier Excel simple avec le nom de votre entreprise. **Lisez chaque ligne de code — nous expliquons tout.**

### Le Code (copiez-collez dans Antigravity ou un fichier .py)

\`\`\`python
# Les lignes qui commencent par # sont des COMMENTAIRES
# Python les ignore — c'est juste pour nous aider à comprendre

# ÉTAPE 1 : Importer la bibliothèque Excel
# C'est comme dire à Python "j'ai besoin de l'outil Excel"
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# ÉTAPE 2 : Créer un nouveau classeur Excel (comme Fichier → Nouveau dans Excel)
wb = Workbook()          # wb = workbook = classeur
ws = wb.active           # ws = worksheet = feuille active

# ÉTAPE 3 : Donner un nom à la feuille
ws.title = "Mon Entreprise"

# ÉTAPE 4 : Écrire du texte dans les cellules
# C'est comme cliquer sur une cellule et taper du texte
ws['A1'] = "MON ENTREPRISE SARL"
ws['A2'] = "Tableau de Bord 2025"
ws['A4'] = "Chiffre d'Affaires :"
ws['B4'] = 150000        # Un nombre (sans guillemets = nombre)
ws['A5'] = "Nombre de clients :"
ws['B5'] = 47

# ÉTAPE 5 : Styliser le titre (gras, grande taille, couleur)
ws['A1'].font = Font(
    bold=True,           # Gras
    size=18,             # Taille 18
    color="FFFFFF"       # Blanc (les couleurs sont en code hexadécimal sans le #)
)
ws['A1'].fill = PatternFill(
    fill_type="solid",
    fgColor="2E75B6"     # Bleu foncé
)
ws['A1'].alignment = Alignment(horizontal="center")

# ÉTAPE 6 : Fusionner les cellules A1 à D1 (comme "Fusionner et centrer" dans Excel)
ws.merge_cells('A1:D1')

# ÉTAPE 7 : Largeur des colonnes
ws.column_dimensions['A'].width = 25
ws.column_dimensions['B'].width = 15

# ÉTAPE 8 : Sauvegarder le fichier
wb.save("mon_entreprise.xlsx")
print("✅ Fichier créé ! Cherchez 'mon_entreprise.xlsx' dans votre dossier")
\`\`\`

### Ce que vous verrez dans Excel après exécution :

| | A | B |
|---|---|---|
| **1** | MON ENTREPRISE SARL (bleu, centré, fusionné) | |
| **2** | Tableau de Bord 2025 | |
| **3** | | |
| **4** | Chiffre d'Affaires : | 150000 |
| **5** | Nombre de clients : | 47 |

### Comment exécuter ce code ?

**Option A — Dans Antigravity :**
1. Ouvrez Antigravity
2. Collez le code
3. Cliquez "Exécuter" ou appuyez F5

**Option B — Dans le terminal :**
1. Sauvegardez le code dans un fichier \`premier.py\`
2. Ouvrez cmd, naviguez jusqu'au dossier
3. Tapez : \`python premier.py\`

**Option C — Dans notre IDE en ligne :**
1. Allez sur **elsayf.click/dashboard/code**
2. Créez un nouveau fichier \`premier.py\`
3. Collez le code et cliquez "Run"`
                },
                {
                    contentType: 'CALLOUT', title: 'couleurs-attention', order: 5,
                    content: JSON.stringify({
                        type: 'warning',
                        title: '⚠️ Les couleurs en Python : sans le # et en majuscules',
                        body: '**Dans Excel :** vous choisissez la couleur avec un sélecteur visuel ou en tapant `#2E75B6`\n\n**Dans Python openpyxl :** vous écrivez la couleur SANS le # et en majuscules : `"2E75B6"`\n\n**Exemples de couleurs utiles :**\n- `"FFFFFF"` → Blanc\n- `"000000"` → Noir\n- `"2E75B6"` → Bleu professionnel\n- `"ED7D31"` → Orange\n- `"70AD47"` → Vert\n- `"FF0000"` → Rouge\n- `"FFC000"` → Jaune doré\n\n**Astuce :** Cherchez "color picker hex" sur Google pour trouver n\'importe quelle couleur !'
                    })
                },
                {
                    contentType: 'TEXT', title: 'exercice-l1', order: 6,
                    content: `## 🏋️ Exercice Pratique — Personnalisez votre fichier

Maintenant que vous avez le code de base, **modifiez-le** pour créer VOTRE fichier d'entreprise :

### Exercice 1 (Facile) : Changer les informations
Remplacez dans le code :
- \`"MON ENTREPRISE SARL"\` → le vrai nom de votre entreprise
- \`150000\` → votre chiffre d'affaires réel (ou fictif)
- \`47\` → votre nombre de clients
- La couleur \`"2E75B6"\` → une couleur de votre choix

### Exercice 2 (Moyen) : Ajouter des lignes
Ajoutez ces lignes de données avant le \`wb.save()\` :
\`\`\`python
ws['A6'] = "Bénéfice net :"
ws['B6'] = 23000
ws['A7'] = "Employés :"
ws['B7'] = 12
ws['A8'] = "Ville :"
ws['B8'] = "Alger"
\`\`\`

### Exercice 3 (Défi) : Formater les nombres
Ajoutez un format monétaire à la cellule B4 et B6 :
\`\`\`python
ws['B4'].number_format = '#,##0 "DA"'   # Format avec DA (Dinars Algériens)
ws['B6'].number_format = '#,##0 "DA"'
\`\`\`

✅ **Réponse attendue** : Un fichier Excel avec votre en-tête personnalisé et vos données formatées professionnellement.`
                },
                {
                    contentType: 'CALLOUT', title: 'fin-l1', order: 7,
                    content: JSON.stringify({
                        type: 'success',
                        title: '🎉 Bravo — Leçon 1 Terminée !',
                        body: '**Vous avez appris :**\n✅ Ce qu\'est Python et pourquoi c\'est utile pour Excel\n✅ Installer Python et openpyxl\n✅ Créer votre premier fichier Excel avec du code\n✅ Écrire du texte et des chiffres dans les cellules\n✅ Styliser les cellules (gras, couleur, taille)\n✅ Fusionner des cellules et ajuster la largeur\n\n**Dans la Leçon 2**, vous allez apprendre les Variables et les Boucles pour créer un vrai tableau de bord KPI professionnel avec des données automatiques !'
                    })
                }
            ]
        },
        {
            order: 2,
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: JSON.stringify({
                        type: 'info',
                        title: '📚 Leçon 2 — Ce que vous allez apprendre',
                        body: '**Concepts Python :**\n1. Les **Variables** (stocker des informations)\n2. Les **Listes** (plusieurs valeurs dans une boîte)\n3. Les **Boucles for** (répéter des actions)\n4. Les **Fonctions** (réutiliser du code)\n\n**Projet pratique :**\nCréer un **Tableau de Bord KPI** professionnel avec 6 indicateurs clés de performance, automatiquement mis en forme.'
                    })
                },
                {
                    contentType: 'TEXT', title: 'variables-expliquees', order: 2,
                    content: `## Les Variables : Stocker des Informations

### Analogie : La variable = une boîte étiquetée

Imaginez que vous avez des boîtes de rangement. Chaque boîte a une étiquette et contient quelque chose.

\`\`\`python
# La boîte "nom_entreprise" contient "TechAlgerie SARL"
nom_entreprise = "TechAlgerie SARL"

# La boîte "chiffre_affaires" contient le nombre 2450000
chiffre_affaires = 2450000

# La boîte "nombre_employes" contient 47
nombre_employes = 47

# La boîte "taux_croissance" contient 23.5 (un décimal)
taux_croissance = 23.5

# La boîte "est_profitable" contient Vrai ou Faux
est_profitable = True
\`\`\`

### Les 4 types de variables les plus utilisés :

| Type | Exemple | Utilisation |
|------|---------|-------------|
| **Texte** (str) | \`"TechAlgerie"\` | Noms, descriptions |
| **Entier** (int) | \`47\` | Comptages, quantités |
| **Décimal** (float) | \`23.5\` | Pourcentages, prix |
| **Booléen** (bool) | \`True / False\` | Oui/Non, Actif/Inactif |

### Pourquoi utiliser des variables ?

**Sans variables (difficile à modifier) :**
\`\`\`python
ws['A1'] = "TechAlgerie SARL"
ws['B1'] = "TechAlgerie SARL"
ws['C5'] = "Rapport de TechAlgerie SARL - 2025"
\`\`\`

**Avec variables (une seule modification suffit) :**
\`\`\`python
nom = "TechAlgerie SARL"
ws['A1'] = nom
ws['B1'] = nom
ws['C5'] = f"Rapport de {nom} - 2025"
\`\`\`
Si vous changez le nom de l'entreprise, vous modifiez **une seule ligne** !

---

## Les Listes : Plusieurs Valeurs dans une Variable

\`\`\`python
# Une liste = des valeurs entre crochets, séparées par des virgules
mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"]

# Accéder à un élément (attention : on compte à partir de 0 !)
print(mois[0])   # Affiche : Janvier
print(mois[2])   # Affiche : Mars
print(mois[-1])  # Affiche : Juin (le dernier)

# Liste de chiffres
ventes_mensuelles = [45000, 52000, 38000, 61000, 55000, 70000]

# Liste de listes (tableau 2D — comme une feuille Excel !)
employes = [
    ["Alice Martin",  "IT",      52000],
    ["Bob Dupont",    "Finance", 48000],
    ["Claire Simon",  "RH",      45000],
]
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'boucles-analogie', order: 3,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '🔄 La Boucle for = Le Stagiaire Infatigable',
                        body: 'Imaginez que vous dites à votre stagiaire :\n\n*"Pour chaque nom dans cette liste de 500 clients, écris leur nom dans une cellule Excel et mets la cellule en gras."*\n\nLe stagiaire le fait 500 fois sans se plaindre.\n\n**En Python :**\n```python\nclients = ["Ahmed", "Fatima", "Karim", "Nadia"]\nfor nom in clients:\n    print(f"Bonjour {nom} !")\n```\n**Résultat :**\n```\nBonjour Ahmed !\nBonjour Fatima !\nBonjour Karim !\nBonjour Nadia !\n```\n\nLa boucle répète le bloc de code **pour chaque élément** de la liste, automatiquement.'
                    })
                },
                {
                    contentType: 'TEXT', title: 'boucles-excel', order: 4,
                    content: `## Boucles for + Excel = Magie Automatique

### Exemple concret : Remplir 12 mois automatiquement

**Sans boucle (fastidieux) :**
\`\`\`python
ws['A1'] = "Janvier"
ws['A2'] = "Février"
ws['A3'] = "Mars"
# ... 9 lignes de plus
\`\`\`

**Avec boucle (élégant) :**
\`\`\`python
mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

for i, nom_mois in enumerate(mois, 1):
    # i commence à 1, nom_mois prend chaque valeur de la liste
    ws[f'A{i}'] = nom_mois
    ws[f'A{i}'].font = Font(bold=True)
\`\`\`

> 💡 **\`enumerate(liste, 1)\`** : donne en même temps le numéro (1, 2, 3...) et la valeur ("Janvier", "Février"...)

### Projet — Tableau de Bord KPI complet

\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Tableau de Bord KPI"

# Données de l'entreprise (variables faciles à modifier)
entreprise = "TechAlgerie SARL"
annee = 2025

# Les 6 KPIs : (Indicateur, Valeur, Unité, Couleur)
kpis = [
    ("Chiffre d'Affaires",    2_450_000,  "DA",  "2E75B6"),
    ("Bénéfice Net",          387_000,    "DA",  "70AD47"),
    ("Nombre de Clients",     847,        "",    "ED7D31"),
    ("Nouveaux Clients",      124,        "",    "5B9BD5"),
    ("Taux de Satisfaction",  94.7,       "%",   "FFC000"),
    ("Employés",              47,         "",    "7030A0"),
]

# === EN-TÊTE DU TABLEAU ===
ws.merge_cells('A1:F1')
ws['A1'] = f"TABLEAU DE BORD — {entreprise} — {annee}"
ws['A1'].font = Font(bold=True, size=16, color="FFFFFF")
ws['A1'].fill = PatternFill('solid', fgColor="1F4E79")
ws['A1'].alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[1].height = 35

# === LES 6 CARTES KPI ===
def creer_carte_kpi(ws, col, indicateur, valeur, unite, couleur):
    """Crée une carte KPI dans la colonne spécifiée"""
    lettre = get_column_letter(col)

    # Ligne 3 : Nom de l'indicateur
    ws[f'{lettre}3'] = indicateur
    ws[f'{lettre}3'].font = Font(bold=True, color='FFFFFF', size=9)
    ws[f'{lettre}3'].fill = PatternFill('solid', fgColor=couleur)
    ws[f'{lettre}3'].alignment = Alignment(horizontal='center')

    # Ligne 4 : Valeur
    if isinstance(valeur, float):
        ws[f'{lettre}4'] = f"{valeur}{unite}"
    else:
        ws[f'{lettre}4'] = f"{valeur:,}{unite}".replace(',', ' ')
    ws[f'{lettre}4'].font = Font(bold=True, size=18, color=couleur)
    ws[f'{lettre}4'].alignment = Alignment(horizontal='center', vertical='center')
    ws[f'{lettre}4'].fill = PatternFill('solid', fgColor='F2F2F2')

    # Largeur de colonne
    ws.column_dimensions[lettre].width = 20
    ws.row_dimensions[4].height = 45

# Créer les 6 cartes avec une boucle
for idx, (indicateur, valeur, unite, couleur) in enumerate(kpis, 1):
    creer_carte_kpi(ws, idx, indicateur, valeur, unite, couleur)

# === TABLEAU MENSUEL SOUS LES KPIs ===
ws['A6'] = "Mois"
ws['B6'] = "Ventes (DA)"
ws['C6'] = "Clients"
ws['D6'] = "Objectif"
ws['E6'] = "Atteint ?"

# Style en-têtes tableau
for col in range(1, 6):
    cell = ws.cell(6, col)
    cell.font = Font(bold=True, color='FFFFFF')
    cell.fill = PatternFill('solid', fgColor='2E75B6')
    cell.alignment = Alignment(horizontal='center')

# Données mensuelles
donnees_mensuelles = [
    ("Janvier",   180000, 65, 160000),
    ("Février",   210000, 72, 190000),
    ("Mars",      165000, 58, 200000),
    ("Avril",     250000, 89, 220000),
    ("Mai",       235000, 84, 230000),
    ("Juin",      290000, 98, 260000),
]

for ligne, (mois, ventes, clients, objectif) in enumerate(donnees_mensuelles, 7):
    ws.cell(ligne, 1, mois).font = Font(bold=True)
    ws.cell(ligne, 2, ventes).number_format = '#,##0 "DA"'
    ws.cell(ligne, 3, clients)
    ws.cell(ligne, 4, objectif).number_format = '#,##0 "DA"'
    # Formule pour vérifier si l'objectif est atteint
    ws.cell(ligne, 5, f'=IF(B{ligne}>=D{ligne},"✅ OUI","❌ NON")')

    # Alternance de couleurs (lignes paires/impaires)
    couleur_ligne = 'DEEAF1' if ligne % 2 == 0 else 'FFFFFF'
    for col in range(1, 6):
        ws.cell(ligne, col).fill = PatternFill('solid', fgColor=couleur_ligne)

wb.save("tableau_bord_kpi.xlsx")
print("✅ Tableau de bord KPI créé !")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'fstrings-tip', order: 5,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '💬 Les f-strings : Mélanger texte et variables',
                        body: 'Un **f-string** (f = formatted) permet de mettre des variables directement dans du texte.\n\n```python\nnom = "Alice"\nage = 32\nville = "Alger"\n\n# Sans f-string (compliqué)\nphrase = "Bonjour " + nom + ", vous avez " + str(age) + " ans"\n\n# Avec f-string (simple)\nphrase = f"Bonjour {nom}, vous avez {age} ans à {ville}"\n```\n\n**Résultat :** `Bonjour Alice, vous avez 32 ans à Alger`\n\n👆 Mettez simplement la variable entre accolades `{}` après le `f`'
                    })
                },
                {
                    contentType: 'CALLOUT', title: 'fin-l2', order: 6,
                    content: JSON.stringify({
                        type: 'success',
                        title: '🎉 Leçon 2 Terminée !',
                        body: '**Vous maîtrisez maintenant :**\n✅ Les variables (texte, nombres, booléens)\n✅ Les listes (plusieurs valeurs)\n✅ Les boucles for (répéter du code)\n✅ Les f-strings (texte dynamique)\n✅ Les fonctions def (réutiliser du code)\n\n**Fichier créé :** `tableau_bord_kpi.xlsx` avec 6 cartes KPI colorées et un tableau mensuel avec formules Excel automatiques !\n\n**Leçon 3 →** Les Conditions if/elif/else pour créer un Compte de Résultat financier intelligent.'
                    })
                }
            ]
        },
        {
            order: 3,
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: JSON.stringify({
                        type: 'info',
                        title: '📚 Leçon 3 — Ce que vous allez apprendre',
                        body: '**Concept Python :**\nLes **Conditions** (if / elif / else) — Prendre des décisions dans votre code\n\n**Projet pratique :**\nCréer un **Compte de Résultat** (P&L) avec :\n- Calcul automatique Revenus - Charges = Bénéfice\n- Mise en forme rouge si perte, vert si bénéfice\n- Formules Excel insérées automatiquement\n- Ratio de rentabilité calculé'
                    })
                },
                {
                    contentType: 'TEXT', title: 'conditions-expliquees', order: 2,
                    content: `## Les Conditions : Prendre des Décisions

### Analogie : Le feu de signalisation

Un feu de signalisation prend des décisions :
- Si c'est rouge → STOP
- Sinon si c'est orange → RALENTIR
- Sinon (vert) → AVANCER

**En Python, c'est exactement pareil :**

\`\`\`python
couleur_feu = "rouge"

if couleur_feu == "rouge":
    print("STOP !")
elif couleur_feu == "orange":
    print("Ralentissez")
else:
    print("Avancez")
\`\`\`

### Comparaison avec Excel

La formule Excel \`=IF(B2>0, "Bénéfice", "Perte")\` s'écrit en Python :

\`\`\`python
benefice = 25000

if benefice > 0:
    resultat = "Bénéfice"
else:
    resultat = "Perte"

print(resultat)  # Affiche : Bénéfice
\`\`\`

### Les opérateurs de comparaison

| Symbole | Signification | Exemple |
|---------|--------------|---------|
| \`==\` | Égal à | \`age == 18\` |
| \`!=\` | Différent de | \`pays != "France"\` |
| \`>\` | Supérieur à | \`salaire > 50000\` |
| \`<\` | Inférieur à | \`stock < 10\` |
| \`>=\` | Supérieur ou égal | \`note >= 10\` |
| \`<=\` | Inférieur ou égal | \`age <= 65\` |

### Conditions multiples avec AND et OR

\`\`\`python
chiffre_affaires = 500000
employes = 25

# AND = les DEUX conditions doivent être vraies
if chiffre_affaires > 200000 and employes < 50:
    print("PME en croissance")

# OR = AU MOINS UNE condition doit être vraie
if chiffre_affaires > 1000000 or employes > 100:
    print("Grande entreprise")
\`\`\`

---

## Application : Compte de Résultat Intelligent

\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Compte de Résultat"

# === DONNÉES FINANCIÈRES ===
revenus = {
    "Ventes produits":     1_850_000,
    "Prestations services":  420_000,
    "Revenus locatifs":       85_000,
    "Autres revenus":         32_000,
}

charges = {
    "Achats matières premières":   650_000,
    "Salaires et charges sociales": 480_000,
    "Loyer et charges locatives":   96_000,
    "Énergie et télécommunications": 24_000,
    "Frais de transport":           18_000,
    "Publicité et marketing":       45_000,
    "Amortissements":               38_000,
    "Frais bancaires":               8_000,
}

# === CALCULS ===
total_revenus = sum(revenus.values())
total_charges = sum(charges.values())
benefice_net = total_revenus - total_charges
taux_rentabilite = (benefice_net / total_revenus) * 100

# === TITRE ===
ws.merge_cells('A1:C1')
ws['A1'] = "COMPTE DE RÉSULTAT — TechAlgerie SARL — 2025"
ws['A1'].font = Font(bold=True, size=14, color="FFFFFF")
ws['A1'].fill = PatternFill('solid', fgColor="1F4E79")
ws['A1'].alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[1].height = 30

# Bordure fine réutilisable
def bordure():
    cote = Side(style='thin', color='BFBFBF')
    return Border(left=cote, right=cote, top=cote, bottom=cote)

# === SECTION REVENUS ===
ws['A3'] = "PRODUITS (REVENUS)"
ws['A3'].font = Font(bold=True, size=12, color="FFFFFF")
ws['A3'].fill = PatternFill('solid', fgColor="2E75B6")

ligne = 4
for nom, montant in revenus.items():
    ws[f'A{ligne}'] = nom
    ws[f'B{ligne}'] = montant
    ws[f'B{ligne}'].number_format = '#,##0 "DA"'
    ws[f'B{ligne}'].border = bordure()
    ws[f'A{ligne}'].border = bordure()
    ligne += 1

# Ligne total revenus avec FORMULE Excel
ws[f'A{ligne}'] = "TOTAL PRODUITS"
ws[f'A{ligne}'].font = Font(bold=True, color="FFFFFF")
ws[f'A{ligne}'].fill = PatternFill('solid', fgColor="2E75B6")
ws[f'B{ligne}'] = f"=SUM(B4:B{ligne-1})"
ws[f'B{ligne}'].number_format = '#,##0 "DA"'
ws[f'B{ligne}'].font = Font(bold=True, color="FFFFFF")
ws[f'B{ligne}'].fill = PatternFill('solid', fgColor="2E75B6")
total_rev_ligne = ligne
ligne += 2

# === SECTION CHARGES ===
ws[f'A{ligne}'] = "CHARGES (DÉPENSES)"
ws[f'A{ligne}'].font = Font(bold=True, size=12, color="FFFFFF")
ws[f'A{ligne}'].fill = PatternFill('solid', fgColor="C00000")
ligne += 1

debut_charges = ligne
for nom, montant in charges.items():
    ws[f'A{ligne}'] = nom
    ws[f'B{ligne}'] = montant
    ws[f'B{ligne}'].number_format = '#,##0 "DA"'
    ws[f'A{ligne}'].border = bordure()
    ws[f'B{ligne}'].border = bordure()
    ligne += 1

# Total charges avec FORMULE
ws[f'A{ligne}'] = "TOTAL CHARGES"
ws[f'A{ligne}'].font = Font(bold=True, color="FFFFFF")
ws[f'A{ligne}'].fill = PatternFill('solid', fgColor="C00000")
ws[f'B{ligne}'] = f"=SUM(B{debut_charges}:B{ligne-1})"
ws[f'B{ligne}'].number_format = '#,##0 "DA"'
ws[f'B{ligne}'].font = Font(bold=True, color="FFFFFF")
ws[f'B{ligne}'].fill = PatternFill('solid', fgColor="C00000")
total_chg_ligne = ligne
ligne += 2

# === RÉSULTAT NET ===
ws[f'A{ligne}'] = "RÉSULTAT NET"
ws[f'B{ligne}'] = f"=B{total_rev_ligne}-B{total_chg_ligne}"
ws[f'B{ligne}'].number_format = '#,##0 "DA"'

# Condition : couleur rouge si perte, vert si bénéfice
if benefice_net >= 0:
    couleur_resultat = "70AD47"  # Vert
    message = "✅ BÉNÉFICE"
else:
    couleur_resultat = "FF0000"  # Rouge
    message = "❌ PERTE"

ws[f'A{ligne}'].font = Font(bold=True, size=13, color="FFFFFF")
ws[f'A{ligne}'].fill = PatternFill('solid', fgColor=couleur_resultat)
ws[f'B{ligne}'].font = Font(bold=True, size=13, color="FFFFFF")
ws[f'B{ligne}'].fill = PatternFill('solid', fgColor=couleur_resultat)

# Taux de rentabilité
ligne += 1
ws[f'A{ligne}'] = "Taux de rentabilité"
ws[f'B{ligne}'] = f"=B{ligne-1}/B{total_rev_ligne}"
ws[f'B{ligne}'].number_format = '0.0%'

# Largeurs colonnes
ws.column_dimensions['A'].width = 35
ws.column_dimensions['B'].width = 20

wb.save("compte_resultat.xlsx")
print(f"✅ Compte de Résultat créé !")
print(f"   Revenus : {total_revenus:,} DA")
print(f"   Charges : {total_charges:,} DA")
print(f"   Résultat : {message} de {abs(benefice_net):,} DA ({taux_rentabilite:.1f}%)")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'exercice-conditions', order: 3,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '🏋️ Exercice — Ajouter une colonne "Statut" automatique',
                        body: 'Dans votre tableau mensuel de la Leçon 2, ajoutez une colonne qui affiche automatiquement le statut de chaque mois selon les ventes :\n\n```python\nfor ligne, (mois, ventes, clients, objectif) in enumerate(donnees_mensuelles, 7):\n    # Conditions pour le statut\n    if ventes >= objectif * 1.1:      # 10% au-dessus\n        statut = "🌟 Excellent"\n    elif ventes >= objectif:           # Objectif atteint\n        statut = "✅ Bon"\n    elif ventes >= objectif * 0.8:    # 80% de l\'objectif\n        statut = "⚠️ À améliorer"\n    else:                              # Moins de 80%\n        statut = "❌ Insuffisant"\n    \n    ws.cell(ligne, 6, statut)\n```\n\n**Résultat attendu :** La colonne F affiche le statut coloré pour chaque mois !'
                    })
                },
                {
                    contentType: 'CALLOUT', title: 'fin-l3', order: 4,
                    content: JSON.stringify({
                        type: 'success',
                        title: '🎉 Leçon 3 Terminée !',
                        body: '**Vous avez maîtrisé :**\n✅ Les conditions if / elif / else\n✅ Les opérateurs de comparaison (>, <, ==, !=)\n✅ Les conditions combinées (and, or)\n✅ Colorer dynamiquement selon les résultats\n✅ Insérer des formules Excel (SUM, IF) par programmation\n\n**Fichier créé :** `compte_resultat.xlsx` avec formules automatiques, couleurs conditionnelles et taux de rentabilité !'
                    })
                }
            ]
        },
        {
            order: 4,
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: JSON.stringify({
                        type: 'info',
                        title: '📚 Leçon 4 — Ce que vous allez apprendre',
                        body: '**Concept Python :**\nLes **Dictionnaires** — Organiser les données avec des clés\n\n**Projet pratique :**\nCréer un **Gestionnaire de Stock** complet avec :\n- Catalogue produits (dictionnaires)\n- Calcul automatique de la valeur du stock\n- Alertes automatiques si stock bas ou rupture\n- Bon de commande généré automatiquement'
                    })
                },
                {
                    contentType: 'TEXT', title: 'dictionnaires-detail', order: 2,
                    content: `## Les Dictionnaires : L'Outil le Plus Puissant

### Analogie : Le dictionnaire = une fiche produit

Dans un vrai catalogue produit papier, chaque produit a une fiche avec :
- Référence : PC-001
- Nom : Laptop Dell XPS
- Prix : 125 000 DA
- Stock : 15 unités
- Fournisseur : TechDist

**En Python, un dictionnaire représente exactement ça :**

\`\`\`python
produit = {
    "reference":   "PC-001",
    "nom":         "Laptop Dell XPS",
    "prix":        125_000,
    "stock":       15,
    "fournisseur": "TechDist"
}

# Accéder à une valeur par sa clé
print(produit["nom"])    # Laptop Dell XPS
print(produit["prix"])   # 125000
\`\`\`

### Catalogue complet — Liste de dictionnaires

Pour gérer plusieurs produits, on crée une **liste de dictionnaires** :

\`\`\`python
catalogue = [
    {"ref": "PC-001", "nom": "Laptop Dell XPS 15",       "prix": 125_000, "stock": 15, "stock_min": 5},
    {"ref": "PC-002", "nom": "Laptop HP ProBook",          "prix": 89_000,  "stock": 0,  "stock_min": 3},
    {"ref": "EC-001", "nom": "Écran Samsung 24\"",         "prix": 42_000,  "stock": 28, "stock_min": 10},
    {"ref": "PR-001", "nom": "Imprimante Brother MFC",     "prix": 38_500,  "stock": 7,  "stock_min": 4},
    {"ref": "CL-001", "nom": "Clavier Logitech MX Keys",   "prix": 12_800,  "stock": 45, "stock_min": 15},
    {"ref": "SO-001", "nom": "Souris Logitech MX Master 3", "prix": 9_500,  "stock": 3,  "stock_min": 10},
    {"ref": "WB-001", "nom": "Webcam Logitech C920",        "prix": 18_900,  "stock": 12, "stock_min": 5},
    {"ref": "CS-001", "nom": "Casque Sony WH-1000XM5",     "prix": 45_000,  "stock": 6,  "stock_min": 3},
]
\`\`\`

### Script complet de Gestion de Stock

\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# === FEUILLE 1 : CATALOGUE ===
ws = wb.active
ws.title = "Catalogue Stock"

# En-têtes
en_tetes = ["Référence", "Produit", "Prix Unitaire", "Stock", "Stock Min.", "Valeur Stock", "Statut"]
couleurs_entetes = ["1F4E79", "1F4E79", "1F4E79", "1F4E79", "1F4E79", "1F4E79", "1F4E79"]

for col, (entete, couleur) in enumerate(zip(en_tetes, couleurs_entetes), 1):
    cell = ws.cell(1, col, entete)
    cell.font = Font(bold=True, color="FFFFFF", size=10)
    cell.fill = PatternFill('solid', fgColor=couleur)
    cell.alignment = Alignment(horizontal='center')

# Remplir les données avec conditions
produits_alerte = []  # Pour la feuille commandes

for row, prod in enumerate(catalogue, 2):
    valeur_stock = prod["prix"] * prod["stock"]

    # Déterminer le statut avec des conditions
    if prod["stock"] == 0:
        statut = "🔴 RUPTURE"
        couleur_ligne = "FFE7E7"
        produits_alerte.append(prod)
    elif prod["stock"] <= prod["stock_min"]:
        statut = "🟠 STOCK BAS"
        couleur_ligne = "FFF2CC"
        produits_alerte.append(prod)
    elif prod["stock"] <= prod["stock_min"] * 2:
        statut = "🟡 Attention"
        couleur_ligne = "FFFDE7"
    else:
        statut = "🟢 Normal"
        couleur_ligne = "F0FFF0"

    donnees = [
        prod["ref"], prod["nom"], prod["prix"],
        prod["stock"], prod["stock_min"], valeur_stock, statut
    ]

    for col, valeur in enumerate(donnees, 1):
        cell = ws.cell(row, col, valeur)
        cell.fill = PatternFill('solid', fgColor=couleur_ligne)
        if col in [3, 6]:  # Colonnes prix et valeur
            cell.number_format = '#,##0 "DA"'
        if col == 4 and prod["stock"] == 0:
            cell.font = Font(bold=True, color="FF0000")

# Ligne total
total_row = len(catalogue) + 2
ws.cell(total_row, 1, "TOTAL STOCK")
ws.cell(total_row, 1).font = Font(bold=True)
ws.cell(total_row, 6, f"=SUM(F2:F{total_row-1})")
ws.cell(total_row, 6).number_format = '#,##0 "DA"'
ws.cell(total_row, 6).font = Font(bold=True, color="1F4E79")

# Largeurs colonnes
largeurs = [12, 35, 16, 10, 12, 18, 16]
for col, largeur in enumerate(largeurs, 1):
    ws.column_dimensions[get_column_letter(col)].width = largeur

# === FEUILLE 2 : BON DE COMMANDE AUTOMATIQUE ===
ws2 = wb.create_sheet("Bon de Commande")
ws2.merge_cells('A1:E1')
ws2['A1'] = f"BON DE COMMANDE — {len(produits_alerte)} produits à commander"
ws2['A1'].font = Font(bold=True, size=13, color="FFFFFF")
ws2['A1'].fill = PatternFill('solid', fgColor="C00000")
ws2['A1'].alignment = Alignment(horizontal='center')

if produits_alerte:
    en_tetes2 = ["Référence", "Produit", "Stock Actuel", "Stock Min.", "Qté à Commander"]
    for col, entete in enumerate(en_tetes2, 1):
        cell = ws2.cell(2, col, entete)
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill('solid', fgColor="ED7D31")

    for row, prod in enumerate(produits_alerte, 3):
        # Quantité à commander = (Stock Min. x 3) - Stock actuel
        qte_commander = max(0, prod["stock_min"] * 3 - prod["stock"])
        ws2.cell(row, 1, prod["ref"])
        ws2.cell(row, 2, prod["nom"])
        ws2.cell(row, 3, prod["stock"])
        ws2.cell(row, 4, prod["stock_min"])
        ws2.cell(row, 5, qte_commander).font = Font(bold=True, color="C00000")

    for col in range(1, 4):
        ws2.column_dimensions[get_column_letter(col)].width = 30

wb.save("gestion_stock.xlsx")
print(f"✅ Gestion de stock créée !")
print(f"   {len(produits_alerte)} produits nécessitent une commande urgente")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'get-methode', order: 3,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '🛡️ La méthode .get() — Éviter les erreurs de clé manquante',
                        body: '**Problème :** Si vous accédez à une clé qui n\'existe pas, Python génère une erreur :\n```python\nprod = {"nom": "Laptop"}\nprint(prod["prix"])  # KeyError: \'prix\'\n```\n\n**Solution : utilisez .get() avec une valeur par défaut :**\n```python\nprint(prod.get("prix", 0))     # Retourne 0 si "prix" absent\nprint(prod.get("stock", "N/A")) # Retourne "N/A" si absent\n```\n\n**Dans Excel**, c\'est l\'équivalent de `=IFERROR(A1, 0)` — si A1 génère une erreur, affiche 0.'
                    })
                },
                {
                    contentType: 'CALLOUT', title: 'fin-l4', order: 4,
                    content: JSON.stringify({
                        type: 'success',
                        title: '🎉 Leçon 4 Terminée !',
                        body: '**Vous avez maîtrisé :**\n✅ Les dictionnaires (données organisées par clés)\n✅ Les listes de dictionnaires (catalogues, bases de données simples)\n✅ Accéder aux données avec `dict["cle"]` et `dict.get("cle", defaut)`\n✅ Conditions multiples pour les alertes de stock\n✅ Créer plusieurs feuilles Excel dans un même classeur\n\n**Fichier créé :** `gestion_stock.xlsx` avec catalogue complet, alertes colorées et bon de commande automatique !'
                    })
                }
            ]
        },
        {
            order: 5,
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: JSON.stringify({
                        type: 'info',
                        title: '📚 Leçon 5 — Ce que vous allez apprendre',
                        body: '**Concepts Python :**\n- Travailler avec les **dates** (datetime)\n- Les **fonctions personnalisées** (def)\n- Les **calculs avancés** (ancienneté, congés, primes)\n\n**Projet pratique :**\nCréer un **Registre RH complet** avec 47 employés :\n- Calcul automatique de l\'ancienneté\n- Calcul de la paie selon le département\n- Congés restants\n- Statistiques par département'
                    })
                },
                {
                    contentType: 'TEXT', title: 'dates-et-rh', order: 2,
                    content: `## Travailler avec les Dates en Python

### Le module datetime — Votre calendrier intelligent

\`\`\`python
from datetime import date, datetime

# Date d'aujourd'hui
aujourd_hui = date.today()
print(aujourd_hui)  # 2025-06-01

# Créer une date spécifique
date_embauche = date(2018, 3, 15)  # 15 mars 2018

# Calculer la différence entre deux dates
difference = aujourd_hui - date_embauche
anciennete_jours = difference.days
anciennete_annees = anciennete_jours // 365  # // = division entière

print(f"Ancienneté : {anciennete_annees} ans")
\`\`\`

### Script RH Complet

\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import date
import random

wb = Workbook()
ws = wb.active
ws.title = "Registre Employés"

# Salaires de base par département
salaires_base = {
    "IT":         85_000,
    "Finance":    75_000,
    "RH":         65_000,
    "Commercial": 60_000,
    "Marketing":  62_000,
    "Direction":  150_000,
    "Logistique": 55_000,
}

# Couleurs par département
couleurs_dept = {
    "IT":         "2E75B6",
    "Finance":    "70AD47",
    "RH":         "ED7D31",
    "Commercial": "FFC000",
    "Marketing":  "7030A0",
    "Direction":  "1F4E79",
    "Logistique": "5B9BD5",
}

# Données des 47 employés
employes = [
    ("Amira Benali",     "IT",         date(2019, 3, 15), "Senior",    "F"),
    ("Karim Meziani",    "IT",         date(2021, 6, 1),  "Junior",    "M"),
    ("Nadia Oussedik",   "Finance",    date(2017, 9, 20), "Senior",    "F"),
    ("Mourad Hamidi",    "Commercial", date(2022, 1, 10), "Junior",    "M"),
    ("Sonia Chaibi",     "RH",         date(2018, 5, 3),  "Senior",    "F"),
    ("Yacine Bouzid",    "IT",         date(2020, 11, 8), "Interméd.", "M"),
    ("Fatima Rahmani",   "Marketing",  date(2023, 2, 14), "Junior",    "F"),
    ("Omar Belhadj",     "Direction",  date(2015, 7, 1),  "Directeur", "M"),
    ("Leila Tounsi",     "Finance",    date(2019, 4, 22), "Interméd.", "F"),
    ("Rachid Saadi",     "Logistique", date(2016, 8, 30), "Senior",    "M"),
    # ... (37 autres employés fictifs générés)
]

# Générer les 37 employés restants pour atteindre 47
prenoms_f = ["Amel", "Rania", "Yasmine", "Samira", "Houria", "Djamila", "Wafa", "Meriem"]
prenoms_m = ["Adel", "Bilal", "Djamel", "Hichem", "Lamine", "Nassim", "Sofiane", "Tarek"]
noms = ["Boudjelal", "Cherif", "Daoud", "Ferhat", "Guerfi", "Hadjadj", "Ibrir", "Jaber"]
depts = list(salaires_base.keys())
niveaux = ["Junior", "Interméd.", "Senior"]

random.seed(42)  # Pour reproductibilité
for i in range(37):
    genre = random.choice(["M", "F"])
    prenom = random.choice(prenoms_m if genre == "M" else prenoms_f)
    nom_fam = random.choice(noms)
    dept = random.choice(depts)
    annee_emb = random.randint(2015, 2023)
    mois_emb = random.randint(1, 12)
    niveau = random.choice(niveaux)
    employes.append((f"{prenom} {nom_fam}", dept, date(annee_emb, mois_emb, 1), niveau, genre))

# === EN-TÊTES ===
en_tetes = ["N°", "Nom Complet", "Département", "Niveau", "Date Embauche",
            "Ancienneté", "Salaire Base", "Prime (10%)", "Salaire Total", "Congés Restants"]
for col, entete in enumerate(en_tetes, 1):
    cell = ws.cell(1, col, entete)
    cell.font = Font(bold=True, color="FFFFFF", size=10)
    cell.fill = PatternFill('solid', fgColor="1F4E79")
    cell.alignment = Alignment(horizontal='center')
    cell.border = Border(bottom=Side(style='medium', color='FFFFFF'))

aujourd_hui = date.today()

# === REMPLIR LES DONNÉES ===
for row, (nom, dept, date_emb, niveau, genre) in enumerate(employes, 2):
    anciennete = (aujourd_hui - date_emb).days // 365

    # Salaire selon département et niveau
    base = salaires_base.get(dept, 60_000)
    if niveau == "Junior":
        salaire = base * 0.75
    elif niveau == "Interméd.":
        salaire = base
    elif niveau == "Senior":
        salaire = base * 1.3
    else:  # Directeur
        salaire = base

    # Prime d'ancienneté : +2% par année (max 20%)
    prime_anc = min(anciennete * 0.02, 0.20)
    salaire_total = salaire * (1 + prime_anc)
    prime = salaire_total - salaire

    # Congés : 30 jours de base + 2 par an d'ancienneté
    conges_acquis = 30 + (anciennete * 2)
    conges_pris = random.randint(5, min(conges_acquis, 25))
    conges_restants = conges_acquis - conges_pris

    # Couleur de la ligne selon le département
    couleur = couleurs_dept.get(dept, "F5F5F5")
    couleur_claire = couleur + "30" if len(couleur) == 6 else "F5F5F5"
    # Version plus claire pour les lignes
    fill_couleur = {
        "IT": "DEEAF1", "Finance": "E2EFDA", "RH": "FCE4D6",
        "Commercial": "FFF2CC", "Marketing": "EAD1FF", "Direction": "D6E4F0",
        "Logistique": "DEEAF1"
    }.get(dept, "F5F5F5")

    donnees_ligne = [
        row - 1, nom, dept, niveau,
        date_emb.strftime("%d/%m/%Y"),
        f"{anciennete} an{'s' if anciennete > 1 else ''}",
        salaire, prime, salaire_total, conges_restants
    ]

    for col, val in enumerate(donnees_ligne, 1):
        cell = ws.cell(row, col, val)
        cell.fill = PatternFill('solid', fgColor=fill_couleur)
        if col in [7, 8, 9]:
            cell.number_format = '#,##0 "DA"'
        if col == 3:
            cell.font = Font(bold=True, color=couleurs_dept.get(dept, "000000"))

# Largeurs
largeurs = [5, 25, 14, 12, 14, 12, 15, 13, 15, 15]
for col, larg in enumerate(largeurs, 1):
    ws.column_dimensions[get_column_letter(col)].width = larg

# Figer la première ligne (en-têtes toujours visibles)
ws.freeze_panes = 'A2'

# === FEUILLE 2 : STATISTIQUES PAR DÉPARTEMENT ===
ws2 = wb.create_sheet("Stats par Département")
ws2['A1'] = "STATISTIQUES PAR DÉPARTEMENT"
ws2['A1'].font = Font(bold=True, size=14, color="FFFFFF")
ws2['A1'].fill = PatternFill('solid', fgColor="1F4E79")
ws2.merge_cells('A1:E1')

en_tetes_stats = ["Département", "Nb Employés", "Salaire Moyen", "Salaire Total", "% des effectifs"]
for col, entete in enumerate(en_tetes_stats, 1):
    cell = ws2.cell(2, col, entete)
    cell.font = Font(bold=True, color="FFFFFF")
    cell.fill = PatternFill('solid', fgColor="2E75B6")

# Calculer stats par département
stats = {}
for nom, dept, date_emb, niveau, genre in employes:
    base = salaires_base.get(dept, 60_000)
    if dept not in stats:
        stats[dept] = {"count": 0, "total_salaire": 0}
    stats[dept]["count"] += 1
    stats[dept]["total_salaire"] += base

total_employes = len(employes)
for row, (dept, data) in enumerate(sorted(stats.items()), 3):
    moy = data["total_salaire"] / data["count"]
    pct = data["count"] / total_employes * 100
    ws2.cell(row, 1, dept).font = Font(bold=True, color=couleurs_dept.get(dept, "000000"))
    ws2.cell(row, 2, data["count"])
    ws2.cell(row, 3, moy).number_format = '#,##0 "DA"'
    ws2.cell(row, 4, data["total_salaire"]).number_format = '#,##0 "DA"'
    ws2.cell(row, 5, pct/100).number_format = '0.0%'
    for col in range(1, 6):
        ws2.cell(row, col).fill = PatternFill('solid', fgColor=
            {"IT":"DEEAF1","Finance":"E2EFDA","RH":"FCE4D6",
             "Commercial":"FFF2CC","Marketing":"EAD1FF",
             "Direction":"D6E4F0","Logistique":"DEEAF1"}.get(dept,"F5F5F5"))

for col in range(1, 4):
    ws2.column_dimensions[get_column_letter(col)].width = 20

wb.save("registre_rh_complet.xlsx")
print(f"✅ Registre RH créé avec {len(employes)} employés !")
print(f"   Départements : {len(stats)}")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'freeze-panes', order: 3,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '📌 Figer les volets avec Python — Comme "Figer les volets" dans Excel',
                        body: '`ws.freeze_panes = \'A2\'` fige la ligne 1 (en-têtes) pour qu\'elle reste visible quand vous faites défiler vers le bas.\n\n**Autres exemples :**\n```python\nws.freeze_panes = \'B1\'   # Figer la colonne A\nws.freeze_panes = \'B2\'   # Figer ligne 1 ET colonne A\nws.freeze_panes = None    # Supprimer le figement\n```\n\nC\'est l\'équivalent de **Vue → Figer les volets** dans Excel, mais fait automatiquement par Python !'
                    })
                },
                {
                    contentType: 'CALLOUT', title: 'fin-l5', order: 4,
                    content: JSON.stringify({
                        type: 'success',
                        title: '🎉 Leçon 5 Terminée !',
                        body: '**Vous avez maîtrisé :**\n✅ Le module datetime pour calculer les dates et anciennetés\n✅ Les calculs de paie (salaire, primes, majorations)\n✅ Générer des données avec random\n✅ Figer les volets pour une meilleure navigation\n✅ Créer des statistiques automatiques par catégorie\n\n**Fichier créé :** `registre_rh_complet.xlsx` avec 47 employés, calculs de paie complets et statistiques par département !'
                    })
                }
            ]
        },
        {
            order: 6,
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: JSON.stringify({
                        type: 'info',
                        title: '📚 Leçon 6 (Finale) — Ce que vous allez apprendre',
                        body: '**Objectif Final :**\nConsolider TOUS les fichiers créés dans les leçons 1 à 5 en un **Rapport de Direction** complet avec :\n\n✅ Page de couverture professionnelle\n✅ Résumé exécutif (les KPIs les plus importants)\n✅ Graphique d\'évolution du CA\n✅ Table des matières avec liens\n✅ Un script "maître" qui génère tout en une commande'
                    })
                },
                {
                    contentType: 'TEXT', title: 'rapport-direction', order: 2,
                    content: `## Le Rapport de Direction Final

### Concept : Le script "maître"

Un script maître appelle tous vos autres scripts pour tout générer en une seule fois.

\`\`\`python
# rapport_final.py — Le script maître
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.drawing.image import Image as XLImage
from openpyxl.utils import get_column_letter
from datetime import date
import io

# ============================================================
# DONNÉES CENTRALISÉES (modifiez ici pour tout le rapport)
# ============================================================
config = {
    "entreprise":     "TechAlgerie SARL",
    "annee":          2025,
    "directeur":      "Omar Belhadj",
    "ville":          "Alger",
    "date_rapport":   date.today().strftime("%d/%m/%Y"),
    "ca_annuel":      2_450_000,
    "benefice_net":   387_000,
    "nb_clients":     847,
    "nb_employes":    47,
    "taux_croissance": 23.5,
}

# Données mensuelles CA
mois = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"]
ca_2024 = [155,172,140,198,185,220,205,195,230,248,265,320]
ca_2025 = [180,210,165,250,235,290,275,260,310,330,350,395]

wb = Workbook()

# ============================================================
# FEUILLE 1 : PAGE DE COUVERTURE
# ============================================================
ws_cover = wb.active
ws_cover.title = "Couverture"

# Fond bleu foncé sur toute la page
for row in range(1, 45):
    for col in range(1, 9):
        ws_cover.cell(row, col).fill = PatternFill('solid', fgColor="1F3864")

# Titre principal
ws_cover.merge_cells('B5:H5')
ws_cover['B5'] = "RAPPORT ANNUEL"
ws_cover['B5'].font = Font(bold=True, size=36, color="FFFFFF")
ws_cover['B5'].alignment = Alignment(horizontal='center', vertical='center')
ws_cover.row_dimensions[5].height = 60

ws_cover.merge_cells('B6:H6')
ws_cover['B6'] = config["entreprise"].upper()
ws_cover['B6'].font = Font(bold=True, size=24, color="FFC000")
ws_cover['B6'].alignment = Alignment(horizontal='center')

ws_cover.merge_cells('B7:H7')
ws_cover['B7'] = str(config["annee"])
ws_cover['B7'].font = Font(bold=True, size=20, color="FFFFFF")
ws_cover['B7'].alignment = Alignment(horizontal='center')

# Ligne décorative
ws_cover.merge_cells('B9:H9')
ws_cover['B9'] = "─" * 60
ws_cover['B9'].font = Font(color="FFC000", size=10)
ws_cover['B9'].alignment = Alignment(horizontal='center')

# Métriques clés sur la couverture
kpis_cover = [
    ("💰 CA ANNUEL",        f"{config['ca_annuel']:,} DA".replace(',', ' ')),
    ("📈 CROISSANCE",       f"+{config['taux_croissance']}%"),
    ("👥 CLIENTS",          str(config['nb_clients'])),
    ("👔 EMPLOYÉS",         str(config['nb_employes'])),
]

for i, (label, valeur) in enumerate(kpis_cover):
    col = 2 + i * 2
    ws_cover.merge_cells(f'{get_column_letter(col)}12:{get_column_letter(col+1)}12')
    ws_cover.merge_cells(f'{get_column_letter(col)}13:{get_column_letter(col+1)}13')

    cell_label = ws_cover.cell(12, col, label)
    cell_label.font = Font(bold=True, size=9, color="AAAAAA")
    cell_label.alignment = Alignment(horizontal='center')

    cell_val = ws_cover.cell(13, col, valeur)
    cell_val.font = Font(bold=True, size=16, color="FFC000")
    cell_val.alignment = Alignment(horizontal='center')

# Pied de couverture
ws_cover.merge_cells('B40:H40')
ws_cover['B40'] = f"Préparé par : {config['directeur']}  |  Date : {config['date_rapport']}  |  {config['ville']}"
ws_cover['B40'].font = Font(italic=True, size=9, color="AAAAAA")
ws_cover['B40'].alignment = Alignment(horizontal='center')

# ============================================================
# FEUILLE 2 : RÉSUMÉ EXÉCUTIF
# ============================================================
ws_exec = wb.create_sheet("Résumé Exécutif")
ws_exec.sheet_view.showGridLines = False

ws_exec.merge_cells('A1:G1')
ws_exec['A1'] = f"RÉSUMÉ EXÉCUTIF — {config['entreprise']} — {config['annee']}"
ws_exec['A1'].font = Font(bold=True, size=16, color="FFFFFF")
ws_exec['A1'].fill = PatternFill('solid', fgColor="1F3864")
ws_exec['A1'].alignment = Alignment(horizontal='center', vertical='center')
ws_exec.row_dimensions[1].height = 35

# KPIs en tableau
indicateurs = [
    ("Chiffre d'Affaires Annuel", f"{config['ca_annuel']:,} DA".replace(',', ' '), "2E75B6", "↑ +23.5% vs 2024"),
    ("Bénéfice Net",              f"{config['benefice_net']:,} DA".replace(',', ' '), "70AD47", "Rentabilité : 15.8%"),
    ("Nombre de Clients",         str(config['nb_clients']), "ED7D31", "↑ +147 nouveaux clients"),
    ("Effectif",                  f"{config['nb_employes']} personnes", "7030A0", "3 recrutements prévus"),
    ("Taux de Satisfaction",      "94.7%", "FFC000", "↑ +2.1 pts vs 2024"),
    ("Objectif CA 2026",          "3 200 000 DA", "1F4E79", "Croissance cible : +30%"),
]

for row, (indic, valeur, couleur, note) in enumerate(indicateurs, 3):
    ws_exec.cell(row, 1, indic).font = Font(bold=True, size=11)
    ws_exec.cell(row, 2, valeur).font = Font(bold=True, size=14, color=couleur)
    ws_exec.cell(row, 3, note).font = Font(italic=True, size=10, color="666666")

    for col in range(1, 4):
        ws_exec.cell(row, col).fill = PatternFill('solid', fgColor="F8F9FA" if row % 2 == 0 else "FFFFFF")
    ws_exec.row_dimensions[row].height = 28

ws_exec.column_dimensions['A'].width = 30
ws_exec.column_dimensions['B'].width = 22
ws_exec.column_dimensions['C'].width = 28

# ============================================================
# FEUILLE 3 : ÉVOLUTION CA (avec graphique matplotlib)
# ============================================================
ws_ca = wb.create_sheet("Évolution CA")

# Données dans la feuille
ws_ca['A1'] = "Mois"
ws_ca['B1'] = "CA 2024 (k DA)"
ws_ca['C1'] = "CA 2025 (k DA)"
for i, (m, v24, v25) in enumerate(zip(mois, ca_2024, ca_2025), 2):
    ws_ca.cell(i, 1, m)
    ws_ca.cell(i, 2, v24)
    ws_ca.cell(i, 3, v25)

# Graphique matplotlib professionnel
fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#F8F9FA')
ax.set_facecolor('#FFFFFF')

x = np.arange(len(mois))
bars1 = ax.bar(x - 0.2, ca_2024, 0.35, label='CA 2024', color='#2E75B6', alpha=0.85)
bars2 = ax.bar(x + 0.2, ca_2025, 0.35, label='CA 2025', color='#ED7D31', alpha=0.85)

# Ligne de tendance 2025
ax.plot(x, ca_2025, 'o-', color='#C00000', linewidth=2, markersize=5, label='Tendance 2025', zorder=5)

ax.set_xticks(x)
ax.set_xticklabels(mois, fontsize=10)
ax.set_ylabel('CA (milliers DA)', fontsize=11)
ax.set_title(f'Évolution du Chiffre d\'Affaires — {config["entreprise"]}',
             fontsize=14, fontweight='bold', pad=15)
ax.legend(fontsize=10)
ax.grid(axis='y', alpha=0.3, linestyle='--')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'{x:,.0f}'))

# Annoter la croissance
for i, (v24, v25) in enumerate(zip(ca_2024, ca_2025)):
    croissance = (v25 - v24) / v24 * 100
    ax.annotate(f'+{croissance:.0f}%', xy=(i + 0.2, v25), xytext=(0, 5),
                textcoords='offset points', ha='center', fontsize=7,
                color='#C00000', fontweight='bold')

plt.tight_layout()
buf = io.BytesIO()
fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#F8F9FA')
buf.seek(0)
plt.close()

img = XLImage(buf)
img.width, img.height = 700, 350
ws_ca.add_image(img, 'E2')

wb.save("rapport_direction_final.xlsx")
print("=" * 50)
print(f"✅ RAPPORT DE DIRECTION CRÉÉ !")
print(f"   Entreprise : {config['entreprise']}")
print(f"   Exercice   : {config['annee']}")
print(f"   Feuilles   : Couverture + Résumé Exécutif + Évolution CA")
print(f"   Fichier    : rapport_direction_final.xlsx")
print("=" * 50)
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'prompt-rapport', order: 3,
                    content: JSON.stringify({
                        type: 'tip',
                        title: '🤖 Prompt Antigravity pour personnaliser votre rapport',
                        body: 'Copiez ce prompt dans Antigravity pour adapter le rapport à votre entreprise :\n\n*"Modifie le script rapport_direction_final.py pour mon entreprise avec ces données :\n- Nom : [VOTRE ENTREPRISE]\n- CA 2025 : [VOTRE CA]\n- Employés : [NOMBRE]\n- Ville : [VOTRE VILLE]\n\nAjoute aussi :\n- Une feuille \'Prévisions\' avec les projections 2026\n- Un camembert de la répartition du CA par département\n- Un tableau des 5 meilleurs clients"*'
                    })
                },
                {
                    contentType: 'CALLOUT', title: 'fin-formation', order: 4,
                    content: JSON.stringify({
                        type: 'success',
                        title: '🏆 Félicitations — Formation Complète Terminée !',
                        body: '**Récapitulatif complet de vos acquis :**\n\n**Leçon 1** → Variables, styles Excel, premier fichier automatique\n**Leçon 2** → Variables, listes, boucles, tableau de bord KPI\n**Leçon 3** → Conditions if/elif/else, compte de résultat avec formules\n**Leçon 4** → Dictionnaires, gestion de stock, alertes automatiques\n**Leçon 5** → Dates, calculs RH, registre de 47 employés\n**Leçon 6** → Rapport de direction avec graphiques matplotlib\n\n**Vos prochaines étapes :**\n→ **Leçon 7** : Formules Excel avancées (VLOOKUP, SUMIFS, INDEX/MATCH)\n→ **Leçon 8** : Graphiques professionnels approfondis\n→ **Leçon 9** : Génération d\'images avec l\'IA\n→ **Leçon 10** : Projet final — Pipeline automatisé complet'
                    })
                }
            ]
        }
    ];

    // Mettre à jour chaque leçon
    for (const lessonUpdate of lessonsData) {
        const lesson = await prisma.lesson.findFirst({
            where: { courseId: course.id, order: lessonUpdate.order }
        });

        if (!lesson) {
            console.log(`Leçon ${lessonUpdate.order} non trouvée, ignorée`);
            continue;
        }

        // Supprimer les anciens contenus
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson.id } });

        // Créer les nouveaux contenus
        for (const content of lessonUpdate.contents) {
            await prisma.courseContent.create({
                data: { ...content, lessonId: lesson.id }
            });
        }

        console.log(`✅ Leçon ${lessonUpdate.order} mise à jour avec ${lessonUpdate.contents.length} contenus`);
    }

    console.log('\n🎉 Toutes les leçons ont été enrichies pour les débutants !');
}

main().catch(console.error).finally(() => prisma.$disconnect());
