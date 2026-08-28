const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Création du cours : Python pour automatiser Excel & Word...\n');

    const courseData = {
        title: 'Python pour automatiser Excel & Word',
        slug: 'python-automatisation-excel-word',
        description: 'Automatisez vos tâches Excel et Word avec Python. Générez rapports, factures et documents en masse sans effort.',
        fullDescription: `
# Automatisez Excel & Word avec Python 🚀

Vous passez des heures chaque semaine à copier-coller des données, générer des rapports ou créer des factures manuellement ? **Ce cours va changer votre vie professionnelle.**

## Pourquoi apprendre l'automatisation bureautique ?

Python est devenu l'outil n°1 pour automatiser Excel et Word. Avec quelques lignes de code, vous pouvez :

- 📊 **Lire et écrire** dans des fichiers Excel sans l'ouvrir
- 🧮 **Calculer** des formules sur des milliers de lignes instantanément
- 📄 **Générer** des centaines de documents Word à partir d'un modèle
- 🔄 **Combiner** Excel et Word (ex: données Excel → factures Word)
- ⏰ **Planifier** des tâches qui s'exécutent toutes seules

## Ce que vous allez maîtriser

| Bibliothèque | Usage |
|--------------|-------|
| **openpyxl** | Lire/écrire des fichiers .xlsx |
| **pandas** | Analyser et transformer des données |
| **python-docx** | Créer des documents Word |
| **win32com** | Piloter Excel/Word directement (Windows) |

## À qui s'adresse ce cours ?

- Employés qui manipulent beaucoup de fichiers Excel/Word
- Comptables, gestionnaires, assistants
- Étudiants en finance, gestion, marketing
- Toute personne qui veut gagner 10h+ par semaine

Aucune connaissance préalable requise : on commence de zéro ! 🎯
        `,
        price: 59.99,
        priceDZ: 4500,
        priceEU: 49.99,
        isFree: false,
        level: 'Débutant',
        duration: '12h',
        image: '/courses/python-excel-word.png',
        learningOutcomes: JSON.stringify([
            'Installer Python et configurer son environnement',
            'Lire, écrire et modifier des fichiers Excel avec openpyxl',
            'Analyser des données massives avec pandas',
            'Créer des documents Word professionnels avec python-docx',
            'Générer des factures et rapports en masse automatiquement',
            'Piloter Excel et Word directement via win32com',
            'Planifier des scripts pour qu\'ils s\'exécutent seuls',
            'Réaliser un projet complet d\'automatisation de A à Z'
        ]),
        requirements: JSON.stringify([
            'Aucune connaissance en Python requise',
            'Un ordinateur Windows, Mac ou Linux',
            'Microsoft Excel et Word (idéalement installés)',
            'La motivation pour gagner du temps !'
        ]),
        isPublished: true,
    };

    const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: courseData,
        create: courseData,
    });

    console.log(`✅ Cours créé : ${course.title}\n`);

    // ============================================================
    //  MODULE 1 — INTRODUCTION & INSTALLATION
    // ============================================================
    const lessons = [
        {
            title: 'Introduction : Pourquoi automatiser Excel & Word ?',
            order: 1,
            duration: 25,
            content: `
# 🎯 Bienvenue dans le cours !

## Le problème
Imaginez : chaque fin de mois, vous devez :
1. Ouvrir 5 fichiers Excel différents
2. Copier des données de chacun
3. Les coller dans un fichier récapitulatif
4. Calculer des totaux
5. Créer un rapport Word avec les résultats

**Temps humain : 4 heures. Temps Python : 30 secondes.** ⚡

## Ce que Python peut faire pour vous

### ✅ Avec Excel
- Lire des milliers de cellules instantanément
- Créer des fichiers Excel à partir de zéro
- Appliquer des formules et des mises en forme
- Fusionner plusieurs fichiers en un seul
- Créer des graphiques automatiquement

### ✅ Avec Word
- Générer des dizaines de documents personnalisés
- Remplir des modèles (factures, contrats, certificats)
- Insérer des tableaux et des images
- Convertir Word en PDF en masse

## Exemple concret

Voici à quoi ressemble l'automatisation d'un rapport mensuel :

\`\`\`python
import openpyxl
from docx import Document

# 1. Lire les ventes dans Excel
classeur = openpyxl.load_workbook('ventes.xlsx')
feuille = classeur['Janvier']
total = sum(cellule.value for cellule in feuille['B2:B100'] if cellule.value)

# 2. Créer un rapport Word
doc = Document()
doc.add_heading('Rapport Mensuel des Ventes', 0)
doc.add_paragraph(f'Total des ventes : {total} DH')

doc.save('rapport_janvier.docx')
print('✅ Rapport généré en 2 secondes !')
\`\`\`

Ce script fait en **2 secondes** ce qui prendrait **2 heures** à la main.

## Votre parcours dans ce cours

1. **Module 1** : Installation et premiers pas
2. **Module 2** : Maîtriser Excel avec openpyxl
3. **Module 3** : Analyse de données avec pandas
4. **Module 4** : Word automatisé avec python-docx
5. **Module 5** : Projets concrets et automatisation avancée

Prêt à transformer votre façon de travailler ? C'est parti ! 🚀
            `
        },
        {
            title: 'Installer Python et préparer son environnement',
            order: 2,
            duration: 35,
            content: `
# 🛠️ Installation de Python

## Étape 1 : Télécharger Python

Rendez-vous sur [python.org](https://www.python.org/downloads/) et téléchargez la dernière version (3.11 ou supérieure).

⚠️ **IMPORTANT sur Windows** : Cochez la case **"Add Python to PATH"** en bas de l'installateur, sinon les commandes ne fonctionneront pas !

## Étape 2 : Vérifier l'installation

Ouvrez un terminal (cmd ou PowerShell sur Windows) et tapez :

\`\`\`bash
python --version
# Devrait afficher : Python 3.11.x
\`\`\`

## Étape 3 : Installer les bibliothèques essentielles

Dans le terminal, tapez ces commandes :

\`\`\`bash
# Pour Excel
pip install openpyxl

# Pour Word
pip install python-docx

# Pour l'analyse de données
pip install pandas

# (Windows uniquement) Pour piloter Excel/Word
pip install pywin32
\`\`\`

## Étape 4 : Choisir un éditeur de code

Je recommande **Visual Studio Code** (gratuit) : [code.visualstudio.com](https://code.visualstudio.com/)

Installez l'extension **Python** de Microsoft.

## Étape 5 : Votre premier script

Créez un fichier \`test.py\` et écrivez :

\`\`\`python
# test.py
print("Bonjour Excel & Word ! 🐍")

# Vérifier que les bibliothèques sont installées
import openpyxl
import docx
import pandas

print("✅ Toutes les bibliothèques sont prêtes !")
print(f"openpyxl version : {openpyxl.__version__}")
\`\`\`

Exécutez-le avec :
\`\`\`bash
python test.py
\`\`\`

## 💡 Astuce : Environnement virtuel

Pour les projets sérieux, créez un environnement virtuel :

\`\`\`bash
# Créer l'environnement
python -m venv mon_env

# Activer (Windows)
mon_env\\Scripts\\activate

# Activer (Mac/Linux)
source mon_env/bin/activate

# Puis installer les bibliothèques
pip install openpyxl python-docx pandas
\`\`\`

Félicitations, votre environnement est prêt ! 🎉 Dans la prochaine leçon, nous créons notre premier fichier Excel.
            `
        },

        // ============================================================
        //  MODULE 2 — EXCEL AVEC OPENPYXL
        // ============================================================
        {
            title: 'Créer son premier fichier Excel avec openpyxl',
            order: 3,
            duration: 40,
            content: `
# 📊 Créer un fichier Excel

La bibliothèque **openpyxl** permet de créer et modifier des fichiers \`.xlsx\`.

## Les concepts de base

- **Workbook** (Classeur) = un fichier Excel entier
- **Worksheet** (Feuille) = un onglet dans le fichier
- **Cell** (Cellule) = une case (ex: A1, B2)

## Créer un fichier vide et écrire dedans

\`\`\`python
import openpyxl

# 1. Créer un nouveau classeur
classeur = openpyxl.Workbook()

# 2. Sélectionner la feuille active
feuille = classeur.active
feuille.title = "Mes Ventes"

# 3. Écrire dans des cellules
feuille['A1'] = 'Produit'
feuille['B1'] = 'Quantité'
feuille['C1'] = 'Prix Unitaires'

feuille['A2'] = 'Stylo'
feuille['B2'] = 50
feuille['C2'] = 2.5

feuille['A3'] = 'Cahier'
feuille['B3'] = 30
feuille['C3'] = 4.0

# 4. Sauvegarder le fichier
classeur.save('mes_ventes.xlsx')
print("✅ Fichier créé avec succès !")
\`\`\`

## Ajouter plusieurs lignes rapidement

\`\`\`python
import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active

# En-têtes
feuille.append(['Nom', 'Âge', 'Ville'])

# Plusieurs lignes d'un coup
donnees = [
    ['Alice', 25, 'Paris'],
    ['Bob', 30, 'Lyon'],
    ['Charlie', 35, 'Marseille'],
    ['Diana', 28, 'Toulouse'],
]

for ligne in donnees:
    feuille.append(ligne)

classeur.save('contacts.xlsx')
\`\`\`

## Créer plusieurs feuilles

\`\`\`python
classeur = openpyxl.Workbook()

# La première feuille existe déjà
feuille_janvier = classeur.active
feuille_janvier.title = "Janvier"

# Ajouter d'autres feuilles
feuille_fevrier = classeur.create_sheet("Février")
feuille_mars = classeur.create_sheet("Mars")

# Écrire dans Février
feuille_fevrier['A1'] = 'Données de février'

classeur.save('trimestre.xlsx')
\`\`\`

## 🎯 Exercice

Créez un fichier \`stock.xlsx\` avec une feuille contenant :
- Colonnes : Article, Prix, Quantité en stock
- 5 articles de votre choix

<details>
<summary>📝 Solution</summary>

\`\`\`python
import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.title = "Stock"

feuille.append(['Article', 'Prix', 'Quantité'])
feuille.append(['Ordinateur', 5000, 12])
feuille.append(['Souris', 80, 50])
feuille.append(['Clavier', 150, 30])
feuille.append(['Écran', 1200, 8])
feuille.append(['Casque', 350, 25])

classeur.save('stock.xlsx')
print("Stock créé !")
\`\`\`
</details>

Bravo ! Vous savez maintenant créer des fichiers Excel. La prochaine étape : les **lire**. 👀
            `
        },
        {
            title: 'Lire et explorer un fichier Excel existant',
            order: 4,
            duration: 40,
            content: `
# 👀 Lire un fichier Excel

## Ouvrir un fichier existant

\`\`\`python
import openpyxl

# Ouvrir un fichier
classeur = openpyxl.load_workbook('mes_ventes.xlsx')

# Lister toutes les feuilles
print("Feuilles disponibles :", classeur.sheetnames)

# Sélectionner une feuille
feuille = classeur['Mes Ventes']  # par son nom
# ou
feuille = classeur.active         # la feuille active
\`\`\`

## Lire une cellule précise

\`\`\`python
# Méthode 1 : par référence
cellule = feuille['A1']
print(cellule.value)  # Affiche la valeur

# Méthode 2 : par coordonnées (ligne, colonne)
cellule = feuille.cell(row=2, column=1)
print(cellule.value)  # Ligne 2, Colonne A

# Savoir où on en est
print(f"Ligne : {cellule.row}, Colonne : {cellule.column}")
\`\`\`

## Parcourir toutes les cellules

### Méthode 1 : Boucle sur les lignes

\`\`\`python
for ligne in feuille.iter_rows(min_row=1, max_row=5, values_only=True):
    print(ligne)
# Résultat : ('Produit', 'Quantité', 'Prix')
#            ('Stylo', 50, 2.5)  ...
\`\`\`

### Méthode 2 : Parcourir tout le tableau

\`\`\`python
for ligne in feuille.iter_rows(values_only=True):
    for valeur in ligne:
        print(valeur, end=' | ')
    print()  # nouvelle ligne
\`\`\`

### Méthode 3 : Obtenir les dimensions

\`\`\`python
print(f"Lignes : {feuille.max_row}")
print(f"Colonnes : {feuille.max_column}")
\`\`\`

## Exemple complet : Analyser un fichier de ventes

\`\`\`python
import openpyxl

classeur = openpyxl.load_workbook('ventes.xlsx')
feuille = classeur.active

# Calculer le total des ventes (colonne C, à partir de la ligne 2)
total = 0
for ligne in feuille.iter_rows(min_row=2, min_col=3, max_col=3, values_only=True):
    if ligne[0] is not None:
        total += ligne[0]

print(f"💰 Total des ventes : {total} DH")

# Trouver la vente la plus élevée
prix_max = 0
produit_max = ""
for ligne in feuille.iter_rows(min_row=2, values_only=True):
    if ligne[2] and ligne[2] > prix_max:
        prix_max = ligne[2]
        produit_max = ligne[0]

print(f"🏆 Vente record : {produit_max} à {prix_max} DH")
\`\`\`

## Convertir Excel en liste de dictionnaires (très utile !)

\`\`\`python
import openpyxl

classeur = openpyxl.load_workbook('contacts.xlsx')
feuille = classeur.active

# Récupérer les en-têtes
entetes = [cell.value for cell in feuille[1]]

# Convertir chaque ligne en dictionnaire
donnees = []
for ligne in feuille.iter_rows(min_row=2, values_only=True):
    enregistrement = dict(zip(entetes, ligne))
    donnees.append(enregistrement)

print(donnees)
# [{'Nom': 'Alice', 'Âge': 25, 'Ville': 'Paris'}, ...]

# Exemple : trouver tous ceux de Paris
parisiens = [p for p in donnees if p['Ville'] == 'Paris']
print(f"Personnes à Paris : {len(parisiens)}")
\`\`\`

## 🎯 Exercice

Ouvrez un fichier Excel contenant des notes d'étudiants et calculez la **moyenne**.

\`\`\`python
import openpyxl

classeur = openpyxl.load_workbook('notes.xlsx')
feuille = classeur.active

notes = []
for ligne in feuille.iter_rows(min_row=2, min_col=2, max_col=2, values_only=True):
    if ligne[0] is not None:
        notes.append(ligne[0])

moyenne = sum(notes) / len(notes)
print(f"📊 Moyenne de la classe : {moyenne:.2f}")
print(f"📈 Note max : {max(notes)}")
print(f"📉 Note min : {min(notes)}")
\`\`\`

Vous maîtrisez maintenant la lecture ! Place à la **mise en forme** pour rendre vos fichiers professionnels. ✨
            `
        },
        {
            title: 'Mise en forme et styles dans Excel',
            order: 5,
            duration: 45,
            content: `
# ✨ Rendre ses fichiers Excel beaux

Un fichier Excel bien mis en forme = plus professionnel et plus facile à lire.

## Mettre en forme une cellule

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille['A1'] = 'Titre Principal'

# Police personnalisée
feuille['A1'].font = Font(
    name='Arial',
    size=16,
    bold=True,
    color='FFFFFF'  # texte blanc
)

# Couleur de fond
feuille['A1'].fill = PatternFill(
    start_color='1F4E79',  # bleu foncé
    end_color='1F4E79',
    fill_type='solid'
)

# Alignement
feuille['A1'].alignment = Alignment(
    horizontal='center',
    vertical='center'
)
\`\`\`

## En-tête de tableau stylé (réutilisable)

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

def styliser_en_tete(feuille, nb_colonnes):
    """Applique un style d'en-tête sur la ligne 1."""
    bleu = PatternFill(start_color='2F5496', end_color='2F5496', fill_type='solid')
    police_blanche = Font(bold=True, color='FFFFFF', size=12)
    bordure = Border(
        bottom=Side(style='medium', color='000000')
    )

    for col in range(1, nb_colonnes + 1):
        cellule = feuille.cell(row=1, column=col)
        cellule.fill = bleu
        cellule.font = police_blanche
        cellule.alignment = Alignment(horizontal='center')
        cellule.border = bordure

# Utilisation
classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.append(['Produit', 'Prix', 'Stock'])
feuille.append(['Ordinateur', 5000, 10])
feuille.append(['Souris', 80, 50])

styliser_en_tete(feuille, 3)
classeur.save('tableau_stylé.xlsx')
\`\`\`

## Largeur des colonnes

\`\`\`python
# Largeur fixe
feuille.column_dimensions['A'].width = 30
feuille.column_dimensions['B'].width = 15

# Largeur automatique (approximation)
for col in feuille.columns:
    longueur_max = max(len(str(cell.value or '')) for cell in col)
    feuille.column_dimensions[col[0].column_letter].width = longueur_max + 2
\`\`\`

## Hauteur des lignes

\`\`\`python
feuille.row_dimensions[1].height = 30  # ligne 1 plus haute
\`\`\`

## Bordures de tableau

\`\`\`python
from openpyxl.styles import Border, Side

bordure_fine = Border(
    left=Side(style='thin', color='000000'),
    right=Side(style='thin', color='000000'),
    top=Side(style='thin', color='000000'),
    bottom=Side(style='thin', color='000000')
)

# Appliquer à toute une zone
for ligne in feuuille.iter_rows(min_row=1, max_row=5, min_col=1, max_col=3):
    for cellule in ligne:
        cellule.border = bordure_fine
\`\`\`

## Format des nombres (prix, dates)

\`\`\`python
# Format prix (2 décimales + "DH")
feuille['B2'] = 1234.5
feuille['B2'].number_format = '#,##0.00 "DH"'
# Affiche : 1 234,50 DH

# Format date
import datetime
feuille['C2'] = datetime.datetime.now()
feuille['C2'].number_format = 'DD/MM/YYYY'

# Format pourcentage
feuille['D2'] = 0.15
feuille['D2'].number_format = '0%'
\`\`\`

## Mise en forme conditionnelle

Colorer automatiquement les cellules selon leur valeur :

\`\`\`python
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import PatternFill

# Colorer en rouge les stocks faibles (< 10)
rouge = PatternFill(start_color='FFC7CE', end_color='FFC7CE', fill_type='solid')
feuille.conditional_formatting.add(
    'C2:C100',
    CellIsRule(operator='lessThan', formula=['10'], fill=rouge)
)

# Colorer en vert les stocks élevés (> 50)
vert = PatternFill(start_color='C6EFCE', end_color='C6EFCE', fill_type='solid')
feuille.conditional_formatting.add(
    'C2:C100',
    CellIsRule(operator='greaterThan', formula=['50'], fill=vert)
)
\`\`\`

## 🎯 Mini-projet : Rapport de ventes stylé

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.title = "Rapport"

# Titre
feuille.merge_cells('A1:D1')
feuille['A1'] = 'RAPPORT DES VENTES - JANVIER 2026'
feuille['A1'].font = Font(size=18, bold=True, color='FFFFFF')
feuille['A1'].fill = PatternFill(start_color='1F4E79', end_color='1F4E79', fill_type='solid')
feuille['A1'].alignment = Alignment(horizontal='center', vertical='center')
feuille.row_dimensions[1].height = 35

# En-têtes
entetes = ['Date', 'Produit', 'Quantité', 'Total']
for col, entete in enumerate(entetes, 1):
    c = feuille.cell(row=3, column=col, value=entete)
    c.font = Font(bold=True, color='FFFFFF')
    c.fill = PatternFill(start_color='2F5496', end_color='2F5496', fill_type='solid')
    c.alignment = Alignment(horizontal='center')

# Données
donnees = [
    ['2026-01-05', 'Ordinateur', 3, 15000],
    ['2026-01-12', 'Souris', 25, 2000],
    ['2026-01-18', 'Écran', 5, 6000],
]
for ligne in donnees:
    feuille.append(ligne)

# Largeurs colonnes
for col, largeur in zip('ABCD', [15, 20, 12, 15]):
    feuille.column_dimensions[col].width = largeur

classeur.save('rapport_stylé.xlsx')
print("📊 Rapport professionnel créé !")
\`\`\`

Votre Excel est maintenant magnifique ! Prochaine étape : les **formules** pour qu'Excel calcule tout seul. 🧮
            `
        },
        {
            title: 'Formules et calculs automatiques',
            order: 6,
            duration: 40,
            content: `
# 🧮 Les formules Excel avec openpyxl

Vous pouvez insérer des **vraies formules Excel** (comme =SOMME, =MOYENNE) que l'utilisateur verra et pourra modifier.

## Insérer une formule

\`\`\`python
import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active

# Données
feuille['A1'] = 'Produit'
feuille['B1'] = 'Prix'
feuille['A2'] = 'Stylo';    feuille['B2'] = 2.5
feuille['A3'] = 'Cahier';   feuille['B3'] = 4.0
feuille['A4'] = 'Trousse';  feuille['B4'] = 8.5

# Formule SOMME
feuille['A6'] = 'TOTAL'
feuille['B6'] = '=SUM(B2:B4)'   # =SOMME en anglais

# Formule MOYENNE
feuille['A7'] = 'MOYENNE'
feuille['B7'] = '=AVERAGE(B2:B4)'

classeur.save('formules.xlsx')
\`\`\`

⚠️ **Important** : openpyxl écrit la formule mais **ne la calcule pas**. Le calcul se fait quand vous **ouvrez le fichier dans Excel**.

## Formules courantes (en anglais !)

| Français | Anglais (à utiliser) |
|----------|---------------------|
| =SOMME   | =SUM                |
| =MOYENNE | =AVERAGE            |
| =MAX     | =MAX                |
| =MIN     | =MIN                |
| =NB      | =COUNT              |
| =SI      | =IF                 |
| =RECHERCHEV | =VLOOKUP         |
| =CONCATENER | =CONCAT          |

## Exemple : Facture avec calculs automatiques

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.title = "Facture"

# En-têtes
feuille.append(['Article', 'Qté', 'Prix Unit.', 'Total'])

# Articles (le total sera calculé par formule)
articles = [
    ['Ordinateur', 2, 5000],
    ['Souris', 5, 80],
    ['Clavier', 3, 150],
]
for art in articles:
    feuille.append(art)

# Calculer le total de chaque ligne (colonne D)
derniere_ligne = len(articles) + 1
for i in range(2, derniere_ligne + 1):
    feuille.cell(row=i, column=4).value = f'=B{i}*C{i}'

# Sous-total
ligne_st = derniere_ligne + 2
feuille.cell(row=ligne_st, column=3).value = 'SOUS-TOTAL :'
feuille.cell(row=ligne_st, column=4).value = f'=SUM(D2:D{derniere_ligne})'

# TVA (20%)
ligne_tva = ligne_st + 1
feuille.cell(row=ligne_tva, column=3).value = 'TVA (20%) :'
feuille.cell(row=ligne_tva, column=4).value = f'=D{ligne_st}*0.2'

# Total final
ligne_tot = ligne_tva + 1
feuille.cell(row=ligne_tot, column=3).value = 'TOTAL TTC :'
feuille.cell(row=ligne_tot, column=4).value = f'=D{ligne_st}+D{ligne_tva}'
feuille.cell(row=ligne_tot, column=4).font = Font(bold=True, size=14)

classeur.save('facture.xlsx')
print("🧾 Facture avec calculs créée !")
\`\`\`

## Formules conditionnelles (SI)

\`\`\`python
import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active

feuille.append(['Étudiant', 'Note', 'Résultat'])
feuille.append(['Alice', 15, '=IF(B2>=10,"Admis","Non Admis")'])
feuille.append(['Bob', 8, '=IF(B3>=10,"Admis","Non Admis")'])
feuille.append(['Charlie', 12, '=IF(B4>=10,"Admis","Non Admis")'])

classeur.save('resultats.xlsx')
\`\`\`

## Lire le résultat d'une formule (valeur calculée)

Pour obtenir la **valeur calculée** d'une formule (pas la formule elle-même), utilisez \`data_only=True\` :

\`\`\`python
# ⚠️ Ne fonctionne QUE si le fichier a été ouvert et enregistré dans Excel
classeur = openpyxl.load_workbook('facture.xlsx', data_only=True)
feuille = classeur.active
print(f"Total TTC : {feuille['D8'].value} DH")
\`\`\`

> 💡 **Astuce** : \`data_only=True\` renvoie \`None\` si le fichier n'a jamais été ouvert dans Excel. Pour calculer sans Excel, on utilise **pandas** (prochaine section) ou **win32com**.

## 🎯 Exercice : Bulletin de notes

Créez un fichier avec 5 étudiants, leurs notes, et ajoutez :
- La moyenne de la classe
- Une colonne "Mention" (=SI note>=16 "Bien", >=14 "Assez Bien", sinon "Passable")

\`\`\`python
import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.append(['Étudiant', 'Note', 'Mention'])

etudiants = [('Alice', 17), ('Bob', 13), ('Charlie', 15), ('Diana', 11), ('Eva', 9)]
for i, (nom, note) in enumerate(etudiants, start=2):
    feuille.cell(row=i, column=1, value=nom)
    feuille.cell(row=i, column=2, value=note)
    feuille.cell(row=i, column=3,
                 value=f'=IF(B{i}>=16,"Bien",IF(B{i}>=14,"Assez Bien","Passable"))')

# Moyenne
ligne = len(etudiants) + 2
feuille.cell(row=ligne, column=1, value='MOYENNE')
feuille.cell(row=ligne, column=2, value=f'=AVERAGE(B2:B{ligne-1})')

classeur.save('bulletin.xlsx')
print("🎓 Bulletin créé !")
\`\`\`

Les formules donnent vie à vos fichiers Excel ! 🧮 Place maintenant à **pandas** pour l'analyse de données puissante.
            `
        },

        // ============================================================
        //  MODULE 3 — PANDAS
        // ============================================================
        {
            title: 'Analyse de données Excel avec pandas',
            order: 7,
            duration: 50,
            content: `
# 🐼 Analyse de données avec pandas

**pandas** est la bibliothèque la plus puissante pour analyser des données. Elle transforme vos fichiers Excel en "super-tableaux" appelés **DataFrame**.

## Lire un fichier Excel

\`\`\`python
import pandas as pd

# Lire tout simplement
df = pd.read_excel('ventes.xlsx')

print(df.head())  # 5 premières lignes
print(df.shape)   # (nb_lignes, nb_colonnes)
print(df.columns) # liste des colonnes
print(df.dtypes)  # type de chaque colonne
\`\`\`

## Lire une feuille précise

\`\`\`python
# Feuille par nom
df = pd.read_excel('fichier.xlsx', sheet_name='Janvier')

# Plusieurs feuilles à la fois
toutes = pd.read_excel('fichier.xlsx', sheet_name=None)
# 'toutes' est un dictionnaire {nom_feuille: DataFrame}
for nom, data in toutes.items():
    print(f"Feuille {nom} : {len(data)} lignes")
\`\`\`

## Explorer les données

\`\`\`python
# Statistiques rapides (moyenne, min, max, écart-type)
print(df.describe())

# Voir les valeurs uniques
print(df['Produit'].unique())

# Compter les occurrences
print(df['Ville'].value_counts())

# Trier
df_trie = df.sort_values('Prix', ascending=False)  # décroissant
\`\`\`

## Filtrer les données

\`\`\`python
# Ventes > 1000
gros = df[df['Montant'] > 1000]

# Ventes à Paris ET > 1000
paris_gros = df[(df['Ville'] == 'Paris') & (df['Montant'] > 1000)]

# Ventes d'un produit précis
stylos = df[df['Produit'] == 'Stylo']
\`\`\`

## Ajouter / modifier des colonnes

\`\`\`python
# Ajouter une colonne calculée
df['Total'] = df['Quantité'] * df['Prix']

# Ajouter une colonne avec une condition
df['Catégorie'] = df['Prix'].apply(lambda x: 'Cher' if x > 100 else 'Abordable')

# Convertir une date
df['Date'] = pd.to_datetime(df['Date'])
df['Mois'] = df['Date'].dt.month_name()
\`\`\`

## Groupements (très puissant !)

\`\`\`python
# Total des ventes par ville
print(df.groupby('Ville')['Montant'].sum())

# Moyenne par produit
print(df.groupby('Produit')['Prix'].mean())

# Tableau croisé : ventes par ville ET par mois
print(df.pivot_table(values='Montant', index='Ville',
                     columns='Mois', aggfunc='sum', fill_value=0))
\`\`\`

## Exporter vers Excel

\`\`\`python
# Sauvegarder un DataFrame
df.to_excel('resultat.xlsx', index=False)

# Plusieurs DataFrame dans un fichier (plusieurs feuilles)
with pd.ExcelWriter('rapport_complet.xlsx') as writer:
    df.to_excel(writer, sheet_name='Toutes ventes', index=False)
    gros.to_excel(writer, sheet_name='Gros montant', index=False)
    df.groupby('Ville').sum().to_excel(writer, sheet_name='Par ville')
\`\`\`

## 🎯 Projet complet : Analyse de ventes

\`\`\`python
import pandas as pd

# 1. Charger les données
df = pd.read_excel('ventes_2026.xlsx')

# 2. Nettoyer (enlever les lignes vides)
df = df.dropna()

# 3. Calculer le chiffre d'affaires par ligne
df['CA'] = df['Quantité'] * df['Prix']

# 4. Analyses
print("📊 CHIFFRE D'AFFAIRES TOTAL :", df['CA'].sum(), "DH")
print("\\n🏆 TOP 5 PRODUITS :")
print(df.groupby('Produit')['CA'].sum().sort_values(ascending=False).head())

print("\\n🌍 CA PAR VILLE :")
print(df.groupby('Ville')['CA'].sum().sort_values(ascending=False))

# 5. Sauvegarder le rapport
with pd.ExcelWriter('analyse_ventes.xlsx') as writer:
    df.to_excel(writer, sheet_name='Détail', index=False)
    df.groupby('Produit')['CA'].sum().to_excel(writer, sheet_name='Par Produit')
    df.groupby('Ville')['CA'].sum().to_excel(writer, sheet_name='Par Ville')

print("\\n✅ Rapport sauvegardé dans analyse_ventes.xlsx")
\`\`\`

pandas est incroyable pour l'analyse. Mais pour **piloter Excel directement** (comme un humain), il y a mieux → **win32com** ! 🎮
            `
        },

        // ============================================================
        //  MODULE 4 — WORD AVEC PYTHON-DOCX
        // ============================================================
        {
            title: 'Créer des documents Word avec python-docx',
            order: 8,
            duration: 45,
            content: `
# 📄 Créer un document Word

La bibliothèque **python-docx** permet de créer et modifier des fichiers \`.docx\`.

## Créer un document simple

\`\`\`python
from docx import Document

# Créer un document vide
doc = Document()

# Ajouter un titre
doc.add_heading('Mon Premier Document', level=0)

# Ajouter un paragraphe
doc.add_paragraph('Bonjour ! Ceci est mon premier document Word créé avec Python.')

# Sauvegarder
doc.save('premier.docx')
print("📄 Document créé !")
\`\`\`

## Structure d'un document Word

- **Document** : le fichier complet
- **Paragraph** : un paragraphe de texte
- **Run** : une portion de texte avec un formatage (gras, couleur...)
- **Heading** : un titre (niveaux 0 à 9)

## Titres et sous-titres

\`\`\`python
doc = Document()

doc.add_heading('Titre Principal', level=0)       # Niveau 0 = Titre
doc.add_heading('Chapitre 1', level=1)            # Niveau 1 = Titre 1
doc.add_heading('Sous-section', level=2)          # Niveau 2 = Titre 2
doc.add_heading('Petit titre', level=3)           # Niveau 3 = Titre 3
\`\`\`

## Mise en forme du texte (Runs)

Un **Run** est une portion de texte avec son propre style :

\`\`\`python
doc = Document()
para = doc.add_paragraph()

# Plusieurs runs avec des styles différents
run1 = para.add_run('Texte normal, ')
run2 = para.add_run('texte en gras, ')
run2.bold = True

run3 = para.add_run('texte en italique, ')
run3.italic = True

run4 = para.add_run('texte souligné.')
run4.underline = True

run5 = para.add_run(' Et en couleur !')
run5.font.color.rgb = RGBColor(0xFF, 0x00, 0x00)  # Rouge
run5.font.size = Pt(14)
run5.font.name = 'Arial'

doc.save('styles.docx')
\`\`\`

## Listes à puces et numérotées

\`\`\`python
doc = Document()

doc.add_heading('Mes tâches', level=1)

# Liste à puces
doc.add_paragraph('Acheter du pain', style='List Bullet')
doc.add_paragraph('Aller à la banque', style='List Bullet')
doc.add_paragraph('Répondre aux emails', style='List Bullet')

# Liste numérotée
doc.add_heading('Étapes du projet', level=1)
doc.add_paragraph('Analyse des besoins', style='List Number')
doc.add_paragraph('Conception', style='List Number')
doc.add_paragraph('Développement', style='List Number')
doc.add_paragraph('Tests et livraison', style='List Number')

doc.save('listes.docx')
\`\`\`

## Ajouter un tableau

\`\`\`python
doc = Document()

doc.add_heading('Employés', level=1)

# Créer un tableau (lignes, colonnes)
tableau = doc.add_table(rows=1, cols=3)
tableau.style = 'Light Grid Accent 1'  # style prédéfini

# En-têtes
cellules = tableau.rows[0].cells
cellules[0].text = 'Nom'
cellules[1].text = 'Poste'
cellules[2].text = 'Salaire'

# Données
employes = [
    ('Alice', 'Développeuse', '15000'),
    ('Bob', 'Designer', '12000'),
    ('Charlie', 'Manager', '20000'),
]

for nom, poste, salaire in employes:
    ligne = tableau.add_row().cells
    ligne[0].text = nom
    ligne[1].text = poste
    ligne[2].text = salaire

doc.save('employes.docx')
\`\`\`

## Ajouter une image

\`\`\`python
doc = Document()
doc.add_picture('logo.png', width=Inches(3))  # 3 pouces de large
doc.save('avec_image.docx')
\`\`\`

## Saut de page

\`\`\`python
from docx.enum.text import WD_BREAK

doc = Document()
doc.add_paragraph('Page 1')
doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)  # saut de page
doc.add_paragraph('Page 2')
doc.save('pages.docx')
\`\`\`

## 🎯 Mini-projet : Rapport d'activité

\`\`\`python
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from datetime import datetime

doc = Document()

# Titre
titre = doc.add_heading('Rapport d\'Activité Mensuel', level=0)
titre.alignment = 1  # Centré

# Date
para = doc.add_paragraph()
para.alignment = 1
run = para.add_run(f'Date : {datetime.now().strftime("%d/%m/%Y")}')
run.italic = True
run.font.color.rgb = RGBColor(0x80, 0x80, 0x80)

# Section 1
doc.add_heading('1. Résumé', level=1)
doc.add_paragraph(
    'Ce mois-ci, nous avons atteint nos objectifs de vente '
    'avec une croissance de 15% par rapport au mois précédent.'
)

# Section 2 avec tableau
doc.add_heading('2. Résultats par département', level=1)
tableau = doc.add_table(rows=1, cols=3)
tableau.style = 'Light List Accent 1'
entetes = tableau.rows[0].cells
entetes[0].text = 'Département'
entetes[1].text = 'Objectif'
entetes[2].text = 'Réalisé'

for dept, obj, rea in [('Ventes', '100k', '115k'), ('Marketing', '50k', '48k')]:
    ligne = tableau.add_row().cells
    ligne[0].text = dept
    ligne[1].text = obj
    ligne[2].text = rea

# Conclusion
doc.add_heading('3. Conclusion', level=1)
doc.add_paragraph('Les résultats sont positifs et dépassent les attentes.')

doc.save('rapport_activite.docx')
print("📋 Rapport créé !")
\`\`\`

Vous savez créer des documents Word complets ! Ensuite, on apprendra à les **personnaliser en masse** (factures, certificats...). 🎭
            `
        },
        {
            title: 'Modèles Word et publipostage (mail merge)',
            order: 9,
            duration: 45,
            content: `
# 🎭 Générer des documents en masse

Le vrai pouvoir de l'automatisation : générer **100 documents personnalisés** en 1 clic.

## Technique 1 : Variables dans un modèle

On crée un modèle avec des **mots-clés** qu'on remplace :

\`\`\`python
from docx import Document

def generer_facture(client, montant, date, numero):
    # Ouvrir le modèle
    doc = Document('modele_facture.docx')

    # Remplacer les mots-clés
    remplacements = {
        '{{CLIENT}}': client,
        '{{MONTANT}}': str(montant),
        '{{DATE}}': date,
        '{{NUMERO}}': numero,
    }

    for para in doc.paragraphes:
        for ancien, nouveau in remplacements.items():
            if ancien in para.text:
                para.text = para.text.replace(ancien, nouveau)

    # Sauvegarder
    nom_fichier = f'facture_{numero}.docx'
    doc.save(nom_fichier)
    return nom_fichier

# Générer plusieurs factures
factures = [
    ('Société Alpha', 15000, '2026-01-15', 'F001'),
    ('Société Beta', 23000, '2026-01-15', 'F002'),
    ('Société Gamma', 8700, '2026-01-15', 'F003'),
]

for client, montant, date, num in factures:
    fichier = generer_facture(client, montant, date, num)
    print(f"✅ Créé : {fichier}")
\`\`\`

> ⚠️ Pour l'exemple ci-dessus, créez d'abord \`modele_facture.docx\` dans Word avec le texte : "Facture {{NUMERO}} - Client : {{CLIENT}} - Montant : {{MONTANT}} DH"

## Technique 2 : Remplacement complet (plus fiable)

Problème : Word coupe parfois le texte en plusieurs *runs*. Solution robuste :

\`\`\`python
from docx import Document

def remplacer_texte(doc, ancien, nouveau):
    """Remplace un texte dans tout le document, y compris tableaux."""
    # Dans les paragraphes
    for para in doc.paragraphes:
        if ancien in para.text:
            # Reconstruire le paragraphe
            para.text = para.text.replace(ancien, nouveau)

    # Dans les tableaux
    for tableau in doc.tables:
        for ligne in tableau.rows:
            for cellule in ligne.cells:
                for para in cellule.paragraphs:
                    if ancien in para.text:
                        para.text = para.text.replace(ancien, nouveau)

# Usage
doc = Document('contrat_modele.docx')
remplacer_texte(doc, '{{NOM}}', 'Karim Benali')
remplacer_texte(doc, '{{SALAIRE}}', '12 000 DH')
doc.save('contrat_karim.docx')
\`\`\`

## Technique 3 : Publipostage depuis Excel

On lit les destinataires dans Excel et on génère un document pour chacun :

\`\`\`python
import openpyxl
from docx import Document
from datetime import datetime

# 1. Lire les destinataires depuis Excel
classeur = openpyxl.load_workbook('destinataires.xlsx')
feuille = classeur.active

clients = []
for ligne in feuille.iter_rows(min_row=2, values_only=True):
    clients.append({
        'nom': ligne[0],
        'email': ligne[1],
        'ville': ligne[2],
        'montant': ligne[3],
    })

# 2. Générer un courrier pour chaque client
for client in clients:
    doc = Document()

    doc.add_heading('Courrier Commercial', level=0)

    doc.add_paragraph(f"À l'attention de : {client['nom']}")
    doc.add_paragraph(f"Email : {client['email']}")
    doc.add_paragraph(f"Ville : {client['ville']}")
    doc.add_paragraph('')

    doc.add_paragraph(
        f"Cher/Chère {client['nom']},\\n\\n"
        f"Nous avons le plaisir de vous informer que votre commande "
        f"d'un montant de {client['montant']} DH a bien été enregistrée.\\n\\n"
        f"Cordialement,\\n"
        f"L'équipe commerciale"
    )

    nom_fichier = f"courrier_{client['nom'].replace(' ', '_')}.docx"
    doc.save(nom_fichier)

print(f"✉️ {len(clients)} courriers générés !")
\`\`\`

## Technique 4 : Attestations en masse (cas réel)

\`\`\`python
from docx import Document
from docx.shared import Pt

def creer_attestation(nom_employe, poste, date_debut, date_fin):
    doc = Document()

    doc.add_heading('ATTESTATION DE TRAVAIL', level=0).alignment = 1

    corps = doc.add_paragraph()
    corps.add_run(
        f"Je soussigné, Directeur des Ressources Humaines, atteste que "
        f"M./Mme {nom_employe} occupe le poste de {poste} au sein de notre "
        f"entreprise depuis le {date_debut}"
    )
    if date_fin:
        corps.add_run(f" jusqu'au {date_fin}")

    corps.add_run(
        f".\\n\\nCette attestation est délivrée à l'intéressé(e) pour servir "
        f"et valoir ce que de droit."
    )

    doc.add_paragraph('')
    doc.add_paragraph('Fait à Casablanca, le ' + date_fin or "aujourd'hui")

    doc.save(f'attestation_{nom_employe.replace(" ", "_")}.docx')

# Liste des employés
employes = [
    ('Aicha El Idrissi', 'Comptable', '01/09/2022', '31/12/2025'),
    ('Mohamed Tazi', 'Ingénieur', '15/03/2021', '31/12/2025'),
    ('Fatima Zahra', 'Secrétaire', '01/01/2020', None),
]

for emp in employes:
    creer_attestation(*emp)

print(f"📜 {len(employes)} attestations générées !")
\`\`\`

## 🎯 Exercice : Certificat de formation

Créez un script qui génère des certificats pour les 5 étudiants d'une liste.

<details>
<summary>📝 Solution</summary>

\`\`\`python
from docx import Document
from docx.shared import Pt, RGBColor

etudiants = [
    ('Alice Martin', 'Python pour Débutants', '15/01/2026'),
    ('Bob Leroy', 'Python pour Débutants', '15/01/2026'),
    ('Claire Dubois', 'Python pour Débutants', '15/01/2026'),
]

for nom, formation, date in etudiants:
    doc = Document()

    titre = doc.add_heading('CERTIFICAT DE RÉUSSITE', level=0)
    titre.alignment = 1

    doc.add_paragraph('Décerné à :').alignment = 1
    p = doc.add_paragraph(nom)
    p.alignment = 1
    for run in p.runs:
        run.bold = True
        run.font.size = Pt(18)

    doc.add_paragraph(
        f'Pour avoir suivi avec succès la formation "{formation}" '
        f'le {date}.'
    ).alignment = 1

    doc.save(f'certificat_{nom.replace(" ", "_")}.docx')

print(f"🎓 {len(etudiants)} certificats générés !")
\`\`\`
</details>

Imaginez : 200 certificats à générer → **30 secondes** au lieu de **2 jours**. C'est ça, le pouvoir de Python ! 💪
            `
        },

        // ============================================================
        //  MODULE 5 — PROJETS AVANCÉS
        // ============================================================
        {
            title: 'Piloter Excel et Word directement avec win32com',
            order: 10,
            duration: 50,
            content: `
# 🎮 Piloter Excel & Word comme un humain (Windows)

La bibliothèque **win32com** ouvre **vraiment** Excel et Word en arrière-plan et les pilote. Avantage : toutes les fonctions Excel (formules, graphiques complexes) sont disponibles !

⚠️ **Windows uniquement** (nécessite Microsoft Office installé).

## Prérequis

\`\`\`bash
pip install pywin32
\`\`\`

## Piloter Excel

### Ouvrir Excel et créer un classeur

\`\`\`python
import win32com.client as win32

# Démarrer Excel
excel = win32.Dispatch('Excel.Application')
excel.Visible = True  # False = invisible (plus rapide)

# Créer un classeur
classeur = excel.Workbooks.Add()
feuille = classeur.ActiveSheet

# Écrire
feuille.Cells(1, 1).Value = "Bonjour depuis Python !"
feuille.Cells(2, 1).Value = 42

# Sauvegarder
classeur.SaveAs('C:\\\\chemin\\\\fichier.xlsx')
classeur.Close()
excel.Quit()
\`\`\`

### Créer un graphique

\`\`\`python
import win32com.client as win32

excel = win32.Dispatch('Excel.Application')
excel.Visible = True
classeur = excel.Workbooks.Add()
feuille = classeur.ActiveSheet

# Données
donnees = [('Mois', 'Ventes'), ('Jan', 100), ('Fév', 150), ('Mar', 200), ('Avr', 180)]
for i, (mois, val) in enumerate(donnees, 1):
    feuille.Cells(i, 1).Value = mois
    feuille.Cells(i, 2).Value = val

# Créer un graphique
graphiques = feuille.ChartObjects()
graphique = graphiques.Add(100, 50, 400, 300)  # position + taille
graphique.Chart.SetSourceData(feuille.Range("A1:B5"))
graphique.Chart.ChartType = 4  # xlLine (ligne)

classeur.SaveAs('C:\\\\chemin\\\\avec_graphique.xlsx')
\`\`\`

### Calculer une formule et récupérer le résultat

\`\`\`python
import win32com.client as win32

excel = win32.Dispatch('Excel.Application')
classeur = excel.Workbooks.Open('C:\\\\chemin\\\\facture.xlsx')
feuille = classeur.Sheets(1)

# Forcer le calcul des formules
excel.Calculate()

# Récupérer la VALEUR calculée (pas la formule)
total = feuille.Range("D8").Value
print(f"Le total calculé est : {total}")

classeur.Close(SaveChanges=False)
excel.Quit()
\`\`\`

## Piloter Word

\`\`\`python
import win32com.client as win32

# Démarrer Word
word = win32.Dispatch('Word.Application')
word.Visible = True

# Créer un document
doc = word.Documents.Add()

# Ajouter du texte
selection = word.Selection
selection.TypeText("Bonjour, ceci est généré avec Python !")
selection.TypeParagraph()
selection.TypeText("Nouveau paragraphe.")

# Sauvegarder
doc.SaveAs('C:\\\\chemin\\\\document.docx')
doc.Close()
word.Quit()
\`\`\`

## Convertir Word en PDF (cas très courant !)

\`\`\`python
import win32com.client as win32

word = win32.Dispatch('Word.Application')
word.Visible = False

doc = word.Documents.Open(r'C:\\chemin\\rapport.docx')

# Format 17 = PDF
doc.SaveAs(r'C:\\chemin\\rapport.pdf', FileFormat=17)

doc.Close()
word.Quit()
print("✅ PDF généré !")
\`\`\`

## Convertir plusieurs Word en PDF d'un coup

\`\`\`python
import win32com.client as win32
import glob

word = win32.Dispatch('Word.Application')
word.Visible = False

# Tous les .docx du dossier
fichiers = glob.glob(r'C:\\dossier\\*.docx')

for fichier in fichiers:
    doc = word.Documents.Open(fichier)
    pdf_path = fichier.replace('.docx', '.pdf')
    doc.SaveAs(pdf_path, FileFormat=17)
    doc.Close()
    print(f"✅ {fichier} → PDF")

word.Quit()
print(f"🎉 {len(fichiers)} fichiers convertis !")
\`\`\`

## ⚠️ Bonnes pratiques win32com

\`\`\`python
import win32com.client as win32

excel = None
classeur = None
try:
    excel = win32.Dispatch('Excel.Application')
    excel.Visible = False
    classeur = excel.Workbooks.Open('mon_fichier.xlsx')
    # ... votre code ...
finally:
    # TOUJOURS fermer proprement !
    if classeur:
        classeur.Close(SaveChanges=False)
    if excel:
        excel.Quit()
\`\`\`

## 🎯 Mini-projet : Rapport Excel + Graphique + PDF

\`\`\`python
import win32com.client as win32

# 1. Créer un rapport Excel avec graphique
excel = win32.Dispatch('Excel.Application')
excel.Visible = False
classeur = excel.Workbooks.Add()
feuille = classeur.ActiveSheet

# Données
mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai']
ventes = [120, 150, 180, 160, 200]
feuille.Cells(1, 1).Value = "Mois"
feuille.Cells(1, 2).Value = "Ventes"
for i, (m, v) in enumerate(zip(mois, ventes), 2):
    feuille.Cells(i, 1).Value = m
    feuille.Cells(i, 2).Value = v

# Graphique
g = feuille.ChartObjects().Add(100, 50, 400, 300)
g.Chart.SetSourceData(feuille.Range("A1:B6"))
g.Chart.ChartType = 51  # Column
g.Chart.HasTitle = True
g.Chart.ChartTitle.Text = "Ventes Mensuelles"

# Sauver
chemin_xlsx = r'C:\\Rapport_2026.xlsx'
classeur.SaveAs(chemin_xlsx)
classeur.Close()

# 2. Exporter en PDF
feuille.ExportAsFixedFormat(0, r'C:\\Rapport_2026.pdf')

excel.Quit()
print("📊 Rapport Excel + PDF créés !")
\`\`\`

win32com est l'arme ultime : vous contrôlez Word/Excel exactement comme un humain, mais 1000x plus vite ! 🚀
            `
        },
        {
            title: 'Projet : Pipeline complet Excel → Word → PDF',
            order: 11,
            duration: 60,
            content: `
# 🏆 PROJET FINAL : Système de Facturation Automatisé

On combine **tout** ce qu'on a appris : lire des données Excel → générer des factures Word → exporter en PDF.

## Le scénario

Vous avez un fichier Excel \`commandes.xlsx\` avec les colonnes :
**Numéro | Client | Email | Articles | Montant**

Vous voulez générer, pour chaque commande :
1. Une **facture Word** personnalisée
2. Un **PDF** de cette facture

## Étape 1 : Le fichier source (Excel)

\`\`\`python
import openpyxl

# Créer le fichier de commandes (si nécessaire)
classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.append(['Numéro', 'Client', 'Email', 'Articles', 'Montant'])
feuille.append(['CMD001', 'Société Alpha', 'contact@alpha.com', 'Ordinateur x2', 10000])
feuille.append(['CMD002', 'Société Beta', 'info@beta.com', 'Imprimante x5', 7500])
feuille.append(['CMD003', 'Société Gamma', 'achat@gamma.com', 'Souris x50', 4000])
classeur.save('commandes.xlsx')
print("✅ commandes.xlsx créé")
\`\`\`

## Étape 2 : Le générateur de factures

\`\`\`python
import openpyxl
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from datetime import datetime
import win32com.client as win32
import os

DOSSIER_SORTIE = 'factures'
os.makedirs(DOSSIER_SORTIE, exist_ok=True)

def creer_facture_word(commande):
    """Crée une facture Word à partir d'une commande."""
    doc = Document()

    # En-tête entreprise
    doc.add_heading('MA SOCIÉTÉ SARL', level=0).alignment = 1
    doc.add_paragraph('123 Rue du Commerce, Casablanca\\nTél: 05 22 00 00 00').alignment = 1

    doc.add_paragraph('_' * 50).alignment = 1

    # Titre facture
    doc.add_heading(f'FACTURE {commande["numero"]}', level=1).alignment = 1

    # Infos client
    doc.add_paragraph()
    doc.add_paragraph(f"Client : {commande['client']}")
    doc.add_paragraph(f"Email : {commande['email']}")
    doc.add_paragraph(f"Date : {datetime.now().strftime('%d/%m/%Y')}")

    # Tableau articles
    doc.add_paragraph()
    tableau = doc.add_table(rows=1, cols=3)
    tableau.style = 'Light Grid Accent 1'
    entetes = tableau.rows[0].cells
    entetes[0].text = 'Désignation'
    entetes[1].text = 'Montant'
    entetes[2].text = 'Total'

    ligne = tableau.add_row().cells
    ligne[0].text = commande['articles']
    ligne[1].text = f"{commande['montant']} DH"
    ligne[2].text = f"{commande['montant']} DH"

    # Total
    doc.add_paragraph()
    p = doc.add_paragraph()
    run = p.add_run(f"TOTAL À PAYER : {commande['montant']} DH")
    run.bold = True
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(0xFF, 0x00, 0x00)

    # Pied de page
    doc.add_paragraph()
    doc.add_paragraph('_' * 50).alignment = 1
    doc.add_paragraph('Merci pour votre confiance !').alignment = 1

    # Sauvegarder
    chemin = os.path.join(DOSSIER_SORTIE, f"facture_{commande['numero']}.docx")
    doc.save(chemin)
    return chemin


def convertir_en_pdf(chemin_docx):
    """Convertit un Word en PDF avec win32com."""
    word = win32.Dispatch('Word.Application')
    word.Visible = False
    try:
        doc = word.Documents.Open(os.path.abspath(chemin_docx))
        chemin_pdf = chemin_docx.replace('.docx', '.pdf')
        doc.SaveAs(os.path.abspath(chemin_pdf), FileFormat=17)
        doc.Close()
        return chemin_pdf
    finally:
        word.Quit()


# ===== EXÉCUTION =====

# 1. Lire les commandes Excel
print("📖 Lecture des commandes...")
classeur = openpyxl.load_workbook('commandes.xlsx')
feuille = classeur.active

for ligne in feuille.iter_rows(min_row=2, values_only=True):
    commande = {
        'numero': ligne[0],
        'client': ligne[1],
        'email': ligne[2],
        'articles': ligne[3],
        'montant': ligne[4],
    }

    # 2. Créer la facture Word
    print(f"📄 Création facture {commande['numero']}...")
    chemin_docx = creer_facture_word(commande)

    # 3. Convertir en PDF
    print(f"📋 Conversion PDF...")
    chemin_pdf = convertir_en_pdf(chemin_docx)

    print(f"✅ {commande['numero']} terminé : {chemin_pdf}")

print(f"\\n🎉 Toutes les factures sont prêtes dans le dossier '{DOSSIER_SORTIE}/' !")
\`\`\`

## Résultat

Vous obtenez, pour chaque commande :
- \`facture_CMD001.docx\` + \`facture_CMD001.pdf\`
- \`facture_CMD002.docx\` + \`facture_CMD002.pdf\`
- \`facture_CMD003.docx\` + \`facture_CMD003.pdf\`

**100 commandes → traitées en moins de 2 minutes.** 🚀

## Améliorations possibles

1. **Envoyer par email** automatiquement :
\`\`\`python
import smtplib
from email.message import EmailMessage

def envoyer_email(destinataire, sujet, corps, fichier_joint):
    msg = EmailMessage()
    msg['From'] = 'vous@entreprise.com'
    msg['To'] = destinataire
    msg['Subject'] = sujet
    msg.set_content(corps)

    with open(fichier_joint, 'rb') as f:
        msg.add_attachment(f.read(), maintype='application',
                          subtype='pdf', filename=os.path.basename(fichier_joint))

    # Configurer selon votre fournisseur email
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login('vous@entreprise.com', 'mot_de_passe_app')
        smtp.send_message(msg)
    print(f"✉️ Email envoyé à {destinataire}")
\`\`\`

2. **Ajouter un logo** : \`doc.add_picture('logo.png', width=Inches(2))\`

3. **Calculer la TVA** : montant * 1.2 pour avoir le TTC

4. **Archiver** : déplacer les fichiers traités vers un dossier \`traités/\`

## Ce que vous avez accompli

Vous venez de construire un **vrai système professionnel** qui :
- ✅ Lit des données Excel
- ✅ Génère des documents Word personnalisés
- ✅ Les convertit en PDF
- ✅ Le tout automatiquement

C'est exactement ce que font les logiciels d'entreprise à 10 000 DH. Vous l'avez fait vous-même ! 💪🎉
            `
        },
        {
            title: 'Automatiser la planification (tâches programmées)',
            order: 12,
            duration: 35,
            content: `
# ⏰ Planifier vos scripts pour qu'ils tournent seuls

Le but final : votre script s'exécute **tout seul** chaque jour/semaine/mois, sans intervention.

## Solution 1 : Planificateur de tâches Windows

### Étape 1 : Créer un fichier .bat

Créez un fichier \`generer_rapport.bat\` :

\`\`\`bat
@echo off
cd /d C:\\Users\\votre_nom\\Documents\\automatisation
C:\\Python311\\python.exe rapport_quotidien.py
echo ✅ Script terminé
pause
\`\`\`

### Étape 2 : Programmer la tâche

1. Ouvrez le **Planificateur de tâches** (Task Scheduler)
2. **Créer une tâche de base**
3. Nommez-la (ex: "Rapport quotidien")
4. **Déclencheur** : Quotidien, à 08:00
5. **Action** : Démarrer un programme → votre fichier .bat
6. Terminé !

## Solution 2 : cron (Mac / Linux)

\`\`\`bash
# Ouvrir crontab
crontab -e

# Exécuter tous les jours à 8h00
0 8 * * * /usr/bin/python3 /home/user/rapport.py

# Chaque lundi à 9h
0 9 * * 1 /usr/bin/python3 /home/user/rapport_hebdo.py
\`\`\`

Format cron : \`minute heure jour mois jour_semaine\`

## Solution 3 : En Python avec schedule

\`\`\`python
import schedule
import time

def rapport_quotidien():
    print("📊 Génération du rapport...")
    # Votre code ici
    print("✅ Terminé")

# Programmer
schedule.every().day.at("08:00").do(rapport_quotidien)
schedule.every().monday.do(rapport_quotidien)
schedule.every(10).minutes.do(rapport_quotidien)

print("⏰ Planificateur démarré...")

# Boucle infinie
while True:
    schedule.run_pending()
    time.sleep(60)
\`\`\`

⚠️ Pour que ça marche, ce script doit **tourner en continu** (par exemple sur un serveur).

## Logger ce que fait le script

\`\`\`python
import logging
from datetime import datetime

# Configurer les logs
logging.basicConfig(
    filename='automatisation.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

def generer_rapport():
    logging.info("Début de la génération")
    try:
        # ... votre code ...
        logging.info("✅ Rapport généré avec succès")
    except Exception as e:
        logging.error(f"❌ Erreur : {e}")

generer_rapport()
\`\`\`

## Exemple complet : Rapport quotidien auto

\`\`\`python
import openpyxl
from docx import Document
import logging
from datetime import datetime
import os

logging.basicConfig(filename='rapports.log', level=logging.INFO)

def rapport_quotidien():
    aujourd = datetime.now().strftime('%Y-%m-%d')
    logging.info(f"Démarrage rapport {aujourd}")

    try:
        # 1. Lire les ventes du jour dans Excel
        classeur = openpyxl.load_workbook('ventes_du_jour.xlsx')
        feuille = classeur.active

        total = 0
        nb_ventes = 0
        for ligne in feuille.iter_rows(min_row=2, values_only=True):
            if ligne[2]:
                total += ligne[2]
                nb_ventes += 1

        # 2. Créer le rapport Word
        doc = Document()
        doc.add_heading(f'Rapport des Ventes - {aujourd}', level=0)
        doc.add_paragraph(f'Nombre de ventes : {nb_ventes}')
        doc.add_paragraph(f'Total : {total} DH')

        # 3. Sauvegarder
        dossier = 'rapports'
        os.makedirs(dossier, exist_ok=True)
        chemin = os.path.join(dossier, f'rapport_{aujourd}.docx')
        doc.save(chemin)

        logging.info(f"✅ Rapport sauvegardé : {chemin}")

    except Exception as e:
        logging.error(f"❌ Erreur : {e}")

# Lancer
rapport_quotidien()
\`\`\`

## Vérifier que tout s'est bien passé

Ouvrez le fichier \`rapports.log\` :

\`\`\`
2026-01-15 08:00:00 - Démarrage rapport 2026-01-15
2026-01-15 08:00:01 - ✅ Rapport sauvegardé : rapports/rapport_2026-01-15.docx
2026-01-16 08:00:00 - Démarrage rapport 2026-01-16
2026-01-16 08:00:01 - ✅ Rapport sauvegardé : rapports/rapport_2026-01-16.docx
\`\`\`

## 🎯 Vous êtes maintenant autonome !

Avec la planification, vous avez créé un **vrai robot** qui travaille pour vous pendant que vous dormez ! 🤖💤

Récapitulons tout ce qu'on a appris dans la dernière leçon. 🎓
            `
        },
        {
            title: 'Conclusion et prochaines étapes',
            order: 13,
            duration: 20,
            content: `
# 🎓 Félicitations !

Vous avez terminé la formation **Python pour automatiser Excel & Word** !

## 📋 Ce que vous maîtrisez maintenant

### Excel
- ✅ **Créer** des fichiers Excel de zéro
- ✅ **Lire** et explorer des fichiers existants
- ✅ **Mettre en forme** (couleurs, bordures, formats)
- ✅ **Formules** (SOMME, SI, RECHERCHEV...)
- ✅ **Analyser** avec pandas (filtres, groupements)
- ✅ **Piloter** Excel avec win32com (graphiques, PDF)

### Word
- ✅ **Créer** des documents Word complets
- ✅ **Mettre en forme** (titres, styles, couleurs)
- ✅ **Tableaux** et images
- ✅ **Générer en masse** (factures, certificats, attestations)
- ✅ **Publipostage** depuis Excel
- ✅ **Convertir** en PDF

### Automatisation
- ✅ **Combiner** Excel + Word + PDF
- ✅ **Planifier** les scripts (Windows, cron, schedule)
- ✅ **Logger** l'exécution

## 🚀 10 idées d'automatisation à mettre en place

1. **Rapport de ventes quotidien** généré automatiquement à 8h
2. **Factures clients** créées depuis un Excel de commandes
3. **Bulletins de paie** générés en masse chaque mois
4. **Attestations** de travail pour les employés
5. **Relevés bancaires** consolidés de plusieurs comptes
6. **Suivi de stock** avec alertes automatiques
7. **Conversion Word→PDF** de tous vos documents
8. **Emails personnalisés** avec pièces jointes automatiques
9. **Tableaux de bord Excel** mis à jour chaque semaine
10. **Certificats de formation** pour vos étudiants

## 📚 Pour aller plus loin

### Bibliothèques à explorer
- **xlwings** : Alternative à win32com, plus simple
- **matplotlib** : Créer des graphiques avancés
- **smtplib** : Envoyer des emails automatiques
- **pyautogui** : Automatiser la souris et le clavier
- **requests** : Télécharger des fichiers depuis internet

### Prochains cours recommandés
- 🐍 **Python avancé** : Classes, décorateurs, async
- 🌐 **Web scraping** : Extraire des données de sites web
- 🤖 **Python + IA** : OpenAI, analyse prédictive

## 💡 Conseils pour réussir

1. **Pratiquez !** Refaites les exemples avec vos propres données
2. **Commencez petit** : automatisez une seule tâche d'abord
3. **Sauvegardez** toujours vos fichiers originaux
4. **Documentez** vos scripts (commentaires)
5. **Partagez** vos automatisations avec vos collègues

## 🎯 Défi final

Avant de clôturer, automatisez **une vraie tâche** de votre quotidien :
1. Identifiez une tâche répétitive que vous faites souvent
2. Listez les étapes manuelles
3. Écrivez un script Python qui les reproduit
4. Planifiez-le pour qu'il tourne tout seul

## 💬 Conclusion

> *"L'automatisation n'est pas une question de remplacer les humains, mais de libérer leur temps pour des tâches à plus forte valeur ajoutée."*

Vous avez maintenant les outils pour **gagner des heures** chaque semaine et impressionner vos collègues et votre hiérarchie. 🌟

Merci d'avoir suivi cette formation ! N'hésitez pas à laisser un avis et à partager vos réalisations.

**Bon code et bonne automatisation !** 🐍✨
            `
        }
    ];

    // ============================================================
    //  INSERTION DES LEÇONS
    // ============================================================
    // Nettoyer les anciennes leçons si le cours existait
    await prisma.lesson.deleteMany({ where: { courseId: course.id } });

    for (const lesson of lessons) {
        await prisma.lesson.create({
            data: {
                ...lesson,
                courseId: course.id,
            },
        });
        console.log(`  📖 Leçon ${lesson.order}/${lessons.length} : ${lesson.title}`);
    }

    console.log(`\n🎉 Cours "${course.title}" créé avec ${lessons.length} leçons !`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
