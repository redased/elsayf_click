require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('DÃ©but du seed : Antigravity â€” Gestion d\'Entreprise avec Excel & Python ...')

    const slug = 'antigravity-business-excel'

    const learningOutcomes = [
        "CrÃ©er un tableau de bord d'entreprise complet avec KPIs automatisÃ©s sous Excel",
        "GÃ©nÃ©rer des rapports financiers (P&L, trÃ©sorerie, bilan) avec Python & openpyxl",
        "Automatiser la gestion des stocks et alertes de rupture d'inventaire",
        "Construire un fichier RH complet : fiches employÃ©s, salaires, congÃ©s, Ã©valuations",
        "Utiliser Google Antigravity pour gÃ©nÃ©rer du code Python en langage naturel",
        "Appliquer des mises en forme conditionnelles professionnelles et des graphiques mÃ©tiers",
        "Consolider plusieurs fichiers Excel en un rapport de direction unique",
        "Analyser les donnÃ©es d'entreprise avec Pandas et exporter vers Excel"
    ]

    const requirements = [
        "Avoir installÃ© Google Antigravity Desktop (lien fourni dans la LeÃ§on 1)",
        "Python 3.8+ installÃ© sur votre ordinateur",
        "Connaissances de base en Excel (lecture de cellules, formules simples)",
        "Notions basiques de Python (variables, boucles, listes)"
    ]

    const fullDescription = `# Antigravity : Gestion d'Entreprise avec Excel & Python

## CrÃ©ez des outils de pilotage professionnels pour votre entreprise

Cette formation pratique vous apprend Ã  automatiser la **gestion complÃ¨te d'une entreprise** avec Excel, Python et l'IA Antigravity. Vous travaillerez sur les donnÃ©es fictives d'une entreprise algÃ©rienne : **TechAlgÃ©rie SARL**.

### ðŸ“¥ TÃ©lÃ©charger l'assistant Antigravity
Pour suivre cette formation, installez l'assistant de bureau :
ðŸ‘‰ **[TÃ©lÃ©charger Antigravity Desktop (Windows / macOS / Linux)](https://antigravity.google.com)**

### ðŸ¢ Cas pratique : TechAlgÃ©rie SARL
Tout au long de la formation, vous travaillerez sur les donnÃ©es fictives d'une PME algÃ©rienne avec :
- **47 employÃ©s** rÃ©partis dans 5 dÃ©partements
- **CA annuel** : 2,450,000 DZD
- **500+ rÃ©fÃ©rences** produits en stock
- 4 annÃ©es de donnÃ©es financiÃ¨res historiques

### Ce que vous allez construire :
ðŸ“Š **Module 1 - Tableau de Bord** : KPIs visuels, graphiques croisÃ©s, alertes automatiques  
ðŸ’° **Module 2 - Finances** : Compte de rÃ©sultat, trÃ©sorerie mensuelle, prÃ©visions budgÃ©taires  
ðŸ“¦ **Module 3 - Inventaire** : Gestion de stock, alertes rupture, valorisation automatique  
ðŸ‘¥ **Module 4 - Ressources Humaines** : Fiches employÃ©s, calcul salaires, suivi congÃ©s

---

### Programme :
1. **Installation & Configuration** : Antigravity + Python + cas pratique TechAlgÃ©rie
2. **Tableau de Bord ExÃ©cutif** : KPIs, graphiques dynamiques, mise en forme premium
3. **Rapport Financier Complet** : P&L trimestriel, trÃ©sorerie, ratios de performance
4. **Gestion d'Inventaire** : Stock, alertes, valorisation, rapport fournisseurs
5. **Fichier RH Complet** : EmployÃ©s, salaires, congÃ©s, Ã©valuations de performance
6. **Rapport de Direction** : Consolidation de tous les modules en rapport PDF-ready
`

    // Supprimer si existe dÃ©jÃ 
    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) {
        console.log('âš ï¸ Cours existant trouvÃ©. Suppression pour rÃ©-insertion propre...')
        await prisma.course.delete({ where: { slug } })
    }

    // â”€â”€â”€ IMAGE COVER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const coverImageUrl = '/uploads/antigravity-business-cover.png'

    // â”€â”€â”€ CRÃ‰ATION DU COURS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const course = await prisma.course.create({
        data: {
            title: 'Antigravity : Gestion d\'Entreprise avec Excel & Python',
            title_en: 'Antigravity: Business Management with Excel & Python',
            title_ar: 'Ø£Ù†ØªÙŠØ¬Ø±Ø§ÙÙŠØªÙŠ: Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ø¨Ø¥ÙƒØ³Ù„ ÙˆØ¨Ø§ÙŠØ«ÙˆÙ†',
            slug,
            description: 'Automatisez votre tableau de bord, vos finances, votre inventaire et votre gestion RH avec Python, openpyxl et Google Antigravity.',
            fullDescription,
            price: 4900,
            isFree: false,
            isPublished: true,
            image: coverImageUrl,
            level: 'IntermÃ©diaire',
            duration: '7 heures',
            learningOutcomes: JSON.stringify(learningOutcomes),
            requirements: JSON.stringify(requirements),
        }
    })

    console.log(`âœ… Cours crÃ©Ã© : ${course.title} (id: ${course.id})`)

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  LEÃ‡ON 1 â€” Installation & Configuration + Cas TechAlgÃ©rie
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const lesson1 = await prisma.lesson.create({
        data: {
            title: 'LeÃ§on 1 â€” Installation & DÃ©couverte de TechAlgÃ©rie SARL',
            order: 1,
            courseId: course.id,
            isFree: true,
            duration: 35,
        }
    })

    await prisma.courseContent.createMany({
        data: [
            {
                lessonId: lesson1.id,
                type: 'CALLOUT',
                order: 1,
                content: JSON.stringify({
                    type: 'info',
                    title: 'ðŸ“¥ TÃ©lÃ©chargements Requis',
                    body: '**Avant de commencer**, installez ces deux outils :\n\nðŸ¤– **Google Antigravity Desktop** â†’ [TÃ©lÃ©charger ici](https://antigravity.google.com)\nðŸ **Python 3.11** â†’ [TÃ©lÃ©charger sur python.org](https://www.python.org/downloads/)\n\nâš ï¸ Lors de l\'installation Python : **cochez absolument "Add Python to PATH"**'
                })
            },
            {
                lessonId: lesson1.id,
                type: 'TEXT',
                order: 2,
                content: `## ðŸ¢ Bienvenue chez TechAlgÃ©rie SARL

Dans cette formation, vous Ãªtes le **Directeur Administratif et Financier (DAF)** d'une PME algÃ©rienne fictive : **TechAlgÃ©rie SARL**, spÃ©cialisÃ©e dans la vente de matÃ©riel informatique et de solutions rÃ©seau Ã  Alger.

### DonnÃ©es de l'entreprise (fictives)

| Indicateur | Valeur |
|---|---|
| **Raison sociale** | TechAlgÃ©rie SARL |
| **Secteur** | MatÃ©riel Informatique & RÃ©seaux |
| **Effectif** | 47 employÃ©s |
| **CA Annuel** | 2 450 000 DZD |
| **RÃ©fÃ©rences produits** | 523 articles |
| **AnnÃ©es de donnÃ©es** | 2021 â†’ 2024 |
| **SiÃ¨ge** | Alger Centre, AlgÃ©rie |

Votre mission : **construire avec Python et Antigravity tous les outils de pilotage Excel** dont a besoin cette entreprise.

---

## ðŸš€ Configurer votre environnement de travail

### Ã‰tape 1 â€” VÃ©rifier l'installation de Python

Ouvrez le Terminal (Windows : touche Windows â†’ tapez "cmd") et tapez :

\`\`\`bash
python --version
\`\`\`

Vous devriez voir : \`Python 3.11.x\`. Si une erreur apparaÃ®t, rÃ©installez Python en cochant "Add to PATH".

### Ã‰tape 2 â€” Installer les bibliothÃ¨ques

Dans le terminal, copiez-collez cette commande :

\`\`\`bash
pip install openpyxl pandas xlsxwriter matplotlib
\`\`\`

**Ce que chaque bibliothÃ¨que fait :**
- \`openpyxl\` : Lire, Ã©crire et formater des fichiers Excel (.xlsx)
- \`pandas\` : Analyser et manipuler des donnÃ©es en tableaux
- \`xlsxwriter\` : CrÃ©er des fichiers Excel avec des graphiques avancÃ©s
- \`matplotlib\` : GÃ©nÃ©rer des graphiques et les insÃ©rer dans Excel

### Ã‰tape 3 â€” CrÃ©er le dossier projet

\`\`\`bash
mkdir TechAlgerie_Excel
cd TechAlgerie_Excel
\`\`\``
            },
            {
                lessonId: lesson1.id,
                type: 'IMAGE',
                order: 3,
                content: JSON.stringify({
                    src: '/uploads/antigravity-biz-cover.png',
                    alt: 'Tableau de bord TechAlgÃ©rie dans Antigravity',
                    caption: 'Vue d\'ensemble : les 4 modules que vous allez construire pour TechAlgÃ©rie SARL'
                })
            },
            {
                lessonId: lesson1.id,
                type: 'TEXT',
                order: 4,
                content: `## ðŸ¤– Utiliser Antigravity pour ce projet

Google Antigravity est votre assistant de codage IA. Voici comment l'utiliser efficacement pour ce projet :

### Ouvrir Antigravity et crÃ©er un nouveau fichier

1. Lancez **Antigravity Desktop** depuis votre bureau
2. Cliquez sur **"Nouveau fichier"** â†’ nommez-le \`dashboard_techalg.py\`
3. Dans la barre de chat Antigravity (en bas), tapez votre demande en franÃ§ais

### Exemples de prompts efficaces

\`\`\`
CrÃ©e un fichier Excel nommÃ© "TechAlgerie_Dashboard.xlsx" avec openpyxl.
Ajoute une feuille "Accueil" avec le titre "TechAlgÃ©rie SARL - Tableau de Bord 2024"
en cellule A1, en gras, police 20, couleur #1a237e.
\`\`\`

\`\`\`
GÃ©nÃ¨re un script Python qui crÃ©e une feuille "KPIs" dans le fichier Excel
et y insÃ¨re 4 cartes KPI :
- CA Total : 2 450 000 DZD (fond vert clair)
- BÃ©nÃ©fice Net : 368 000 DZD (fond bleu clair)
- EmployÃ©s Actifs : 47 (fond violet clair)
- Stock disponible : 1 200 unitÃ©s (fond orange clair)
Chaque carte occupe 3 lignes Ã— 2 colonnes.
\`\`\`

---

## ðŸ“ Premier script : CrÃ©er la structure du fichier maÃ®tre

Voici le script complet que vous allez gÃ©nÃ©rer (ou demander Ã  Antigravity) :

\`\`\`python
# ============================================================
# TechAlgerie_init.py
# Script d'initialisation du fichier Excel maÃ®tre
# Auteur : Antigravity + Votre nom
# Date : 2024
# ============================================================

import openpyxl                          # BibliothÃ¨que pour manipuler Excel
from openpyxl.styles import (            # Importation des outils de style
    Font,                                # Pour la police (taille, gras, couleur)
    PatternFill,                         # Pour la couleur de fond des cellules
    Alignment,                           # Pour l'alignement du texte
    Border,                              # Pour les bordures des cellules
    Side                                 # Pour dÃ©finir le style d'une bordure
)
from openpyxl.utils import get_column_letter  # Convertit un numÃ©ro en lettre (1 â†’ A)
from datetime import datetime            # Pour insÃ©rer la date du jour

# â”€â”€ Ã‰tape 1 : CrÃ©er un nouveau classeur Excel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb = openpyxl.Workbook()                 # CrÃ©e un classeur vide en mÃ©moire
ws_accueil = wb.active                   # wb.active = la premiÃ¨re feuille crÃ©Ã©e automatiquement
ws_accueil.title = "Accueil"             # Renomme cette feuille "Accueil"

# â”€â”€ Ã‰tape 2 : CrÃ©er les 4 feuilles mÃ©tier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
feuilles = ["Dashboard", "Finances", "Inventaire", "RH"]
for nom in feuilles:
    wb.create_sheet(title=nom)           # create_sheet() ajoute une nouvelle feuille
    # nb : wb.sheetnames liste toutes les feuilles existantes

# â”€â”€ Ã‰tape 3 : Mettre en page la feuille d'accueil â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# DÃ©finition de la couleur de fond principale (bleu marine foncÃ©)
fond_principal = PatternFill(
    start_color="1A237E",                # Couleur de dÃ©part (hexadÃ©cimal sans #)
    end_color="1A237E",                  # Couleur de fin (identique = couleur unie)
    fill_type="solid"                    # Type de remplissage solide (pas de dÃ©gradÃ©)
)

# Appliquer le fond bleu sur les lignes 1 Ã  8, colonnes A Ã  H
for ligne in range(1, 9):               # range(1, 9) = 1, 2, 3, 4, 5, 6, 7, 8
    for col in range(1, 9):             # range(1, 9) = colonnes 1 Ã  8 (A Ã  H)
        cellule = ws_accueil.cell(row=ligne, column=col)
        cellule.fill = fond_principal   # Applique le fond bleu Ã  cette cellule

# â”€â”€ Ã‰tape 4 : Titre principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws_accueil["A1"] = "ðŸ¢ TechAlgÃ©rie SARL"  # Ã‰crire dans la cellule A1
ws_accueil["A1"].font = Font(
    name="Calibri",                      # Nom de la police
    size=24,                             # Taille en points
    bold=True,                           # Gras = True
    color="FFFFFF"                       # Couleur blanche (texte sur fond bleu)
)
ws_accueil["A1"].alignment = Alignment(
    horizontal="center",                 # Centrage horizontal
    vertical="center"                    # Centrage vertical
)

# â”€â”€ Ã‰tape 5 : Fusionner les cellules A1:H2 pour le grand titre â”€
ws_accueil.merge_cells("A1:H2")         # Fusionne toutes les cellules de A1 Ã  H2
ws_accueil.row_dimensions[1].height = 40  # Hauteur de la ligne 1 = 40 pixels

# â”€â”€ Ã‰tape 6 : Sous-titre avec la date â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
date_auj = datetime.now().strftime("%d/%m/%Y")   # Format : "15/01/2024"
ws_accueil["A3"] = f"Tableau de Bord â€” Mis Ã  jour le {date_auj}"
ws_accueil["A3"].font = Font(color="BBBBBB", italic=True, size=11)
ws_accueil.merge_cells("A3:H3")

# â”€â”€ Ã‰tape 7 : Menu de navigation vers les feuilles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
modules = [
    ("A5", "ðŸ“Š Dashboard",   "4472C4"),   # Bleu
    ("C5", "ðŸ’° Finances",    "70AD47"),   # Vert
    ("E5", "ðŸ“¦ Inventaire",  "ED7D31"),   # Orange
    ("G5", "ðŸ‘¥ RH",          "9E3F8C"),   # Violet
]

for cellule_ref, texte, couleur in modules:
    cellule = ws_accueil[cellule_ref]
    cellule.value = texte
    cellule.font = Font(bold=True, color="FFFFFF", size=13)
    cellule.fill = PatternFill(start_color=couleur, end_color=couleur, fill_type="solid")
    cellule.alignment = Alignment(horizontal="center", vertical="center")
    # Hauteur de la ligne 5
    ws_accueil.row_dimensions[5].height = 35

# Fusionner chaque bouton sur 2 colonnes
for debut, _, _ in [("A5", "", ""), ("C5", "", ""), ("E5", "", ""), ("G5", "", "")]:
    col_debut = debut[0]                 # Lettre de la colonne (A, C, E, G)
    col_fin_num = openpyxl.utils.column_index_from_string(col_debut) + 1
    col_fin = get_column_letter(col_fin_num)
    ligne_num = int(debut[1])            # NumÃ©ro de ligne
    ws_accueil.merge_cells(f"{debut}:{col_fin}{ligne_num}")

# â”€â”€ Ã‰tape 8 : Ajuster les largeurs de colonnes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
for col_num in range(1, 9):
    lettre = get_column_letter(col_num)  # 1 â†’ "A", 2 â†’ "B", etc.
    ws_accueil.column_dimensions[lettre].width = 18  # Largeur en nombre de caractÃ¨res

# â”€â”€ Ã‰tape 9 : Sauvegarder le fichier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
nom_fichier = "TechAlgerie_Maitre.xlsx" # Nom du fichier Ã  crÃ©er
wb.save(nom_fichier)                     # Sauvegarde dans le dossier courant
print(f"âœ… Fichier '{nom_fichier}' crÃ©Ã© avec succÃ¨s !")
print(f"ðŸ“‚ Feuilles disponibles : {wb.sheetnames}")
\`\`\`

### âœ… RÃ©sultat attendu

AprÃ¨s avoir exÃ©cutÃ© ce script, vous obtenez un fichier \`TechAlgerie_Maitre.xlsx\` avec :
- Une feuille **Accueil** en bleu marine avec le nom de l'entreprise
- 4 boutons de navigation colorÃ©s (Dashboard, Finances, Inventaire, RH)
- 4 feuilles vides prÃªtes Ã  Ãªtre remplies dans les leÃ§ons suivantes`
            },
        ]
    })
    console.log(`  âœ… LeÃ§on 1 crÃ©Ã©e avec ${4} blocs de contenu`)

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  LEÃ‡ON 2 â€” Tableau de Bord ExÃ©cutif avec KPIs
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const lesson2 = await prisma.lesson.create({
        data: {
            title: 'LeÃ§on 2 â€” Tableau de Bord ExÃ©cutif : KPIs & Graphiques',
            order: 2,
            courseId: course.id,
            isFree: false,
            duration: 55,
        }
    })

    await prisma.courseContent.createMany({
        data: [
            {
                lessonId: lesson2.id,
                type: 'TEXT',
                order: 1,
                content: `## ðŸ“Š Construire le Tableau de Bord TechAlgÃ©rie

Un tableau de bord (ou **dashboard**) permet de visualiser d'un seul coup d'Å“il les indicateurs clÃ©s de performance (KPIs) de l'entreprise. Nous allons en construire un complet pour TechAlgÃ©rie SARL.

### Les KPIs que nous allons afficher

| KPI | Valeur | Variation |
|---|---|---|
| **CA Mensuel** | 185 420 DZD | +12% vs mois prÃ©cÃ©dent |
| **BÃ©nÃ©fice Net** | 38 900 DZD | +8% vs mois prÃ©cÃ©dent |
| **Commandes du mois** | 147 | +23 nouvelles |
| **EmployÃ©s actifs** | 47 | Stable |
| **Stock disponible** | 1 203 unitÃ©s | -52 cette semaine |
| **Satisfaction clients** | 4.2/5 | â­ |

---

## ðŸŽ¨ Prompt Antigravity pour crÃ©er les cartes KPI

Voici le prompt exact Ã  taper dans Antigravity :

\`\`\`
Dans la feuille "Dashboard" du fichier TechAlgerie_Maitre.xlsx :
CrÃ©e 6 cartes KPI, chacune occupant 2 colonnes Ã— 4 lignes.
Disposition : 3 cartes sur la ligne 2, 3 cartes sur la ligne 7.
DonnÃ©es des cartes :
1. "CA Mensuel" = "185 420 DZD" (fond #E3F2FD, icÃ´ne ðŸ’µ)
2. "BÃ©nÃ©fice Net" = "38 900 DZD" (fond #E8F5E9, icÃ´ne ðŸ“ˆ)
3. "Commandes" = "147 orders" (fond #FFF3E0, icÃ´ne ðŸ›’)
4. "EmployÃ©s" = "47 actifs" (fond #F3E5F5, icÃ´ne ðŸ‘¥)
5. "Stock" = "1 203 unitÃ©s" (fond #FCE4EC, icÃ´ne ðŸ“¦)
6. "Satisfaction" = "4.2 / 5" (fond #E0F7FA, icÃ´ne â­)
Chaque carte doit avoir : titre en gras taille 10, valeur taille 18 gras centrÃ©,
bordure fine grise, coins visuellement distincts via le fond colorÃ©.
\`\`\`

---

## ðŸ’» Script complet â€” Dashboard avec KPIs

\`\`\`python
# ============================================================
# dashboard_kpi.py â€” Tableau de Bord KPI pour TechAlgÃ©rie
# ============================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference, PieChart  # Pour les graphiques
from openpyxl.chart.series import DataPoint               # Points de donnÃ©es graphique

# â”€â”€ Chargement du fichier existant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb = openpyxl.load_workbook("TechAlgerie_Maitre.xlsx")  # Charge le fichier crÃ©Ã© en LeÃ§on 1
ws = wb["Dashboard"]                                     # SÃ©lectionne la feuille Dashboard

# â”€â”€ Fonction utilitaire : crÃ©er une bordure complÃ¨te â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def bordure_fine():
    """Retourne un objet Border avec 4 cÃ´tÃ©s fins gris."""
    cote = Side(style="thin", color="CCCCCC")           # CÃ´tÃ© fin de couleur grise
    return Border(left=cote, right=cote, top=cote, bottom=cote)

# â”€â”€ Fonction : crÃ©er une carte KPI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def creer_carte_kpi(ws, ligne_debut, col_debut, titre, valeur, couleur_fond, icone=""):
    """
    CrÃ©e une carte KPI dans la feuille ws.
    
    ParamÃ¨tres :
    - ws          : la feuille de calcul cible
    - ligne_debut : numÃ©ro de ligne de dÃ©part de la carte
    - col_debut   : numÃ©ro de colonne de dÃ©part de la carte  
    - titre       : texte du titre de la carte (ex: "CA Mensuel")
    - valeur      : valeur principale Ã  afficher (ex: "185 420 DZD")
    - couleur_fond: code hex de la couleur de fond (ex: "E3F2FD")
    - icone       : emoji/icone optionnel
    """
    col_fin = col_debut + 1                              # La carte occupe 2 colonnes
    ligne_fin = ligne_debut + 3                          # La carte occupe 4 lignes
    
    # Remplissage de toutes les cellules de la carte
    fill = PatternFill(start_color=couleur_fond, end_color=couleur_fond, fill_type="solid")
    for r in range(ligne_debut, ligne_fin + 1):
        for c in range(col_debut, col_fin + 1):
            cell = ws.cell(row=r, column=c)
            cell.fill = fill                             # Appliquer la couleur de fond
            cell.border = bordure_fine()                 # Appliquer la bordure grise
    
    # Ligne 1 : icÃ´ne
    if icone:
        cell_icone = ws.cell(row=ligne_debut, column=col_debut)
        cell_icone.value = icone
        cell_icone.font = Font(size=16)
        cell_icone.alignment = Alignment(horizontal="center")
        ws.merge_cells(                                  # Fusionner sur toute la largeur
            start_row=ligne_debut, start_column=col_debut,
            end_row=ligne_debut, end_column=col_fin
        )
    
    # Ligne 2 : titre de la carte
    cell_titre = ws.cell(row=ligne_debut + 1, column=col_debut)
    cell_titre.value = titre
    cell_titre.font = Font(bold=True, size=10, color="555555")  # Gris foncÃ©, petit
    cell_titre.alignment = Alignment(horizontal="center")
    ws.merge_cells(
        start_row=ligne_debut + 1, start_column=col_debut,
        end_row=ligne_debut + 1, end_column=col_fin
    )
    
    # Ligne 3 : valeur principale (grande, en gras)
    cell_valeur = ws.cell(row=ligne_debut + 2, column=col_debut)
    cell_valeur.value = valeur
    cell_valeur.font = Font(bold=True, size=18, color="1A237E") # Bleu marine, grand
    cell_valeur.alignment = Alignment(horizontal="center", vertical="center")
    ws.merge_cells(
        start_row=ligne_debut + 2, start_column=col_debut,
        end_row=ligne_debut + 3, end_column=col_fin
    )
    
    # Ajuster la hauteur des lignes
    ws.row_dimensions[ligne_debut].height = 20
    ws.row_dimensions[ligne_debut + 1].height = 18
    ws.row_dimensions[ligne_debut + 2].height = 30
    ws.row_dimensions[ligne_debut + 3].height = 15

# â”€â”€ DonnÃ©es des 6 cartes KPI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
kpis = [
    # (ligne, col, titre, valeur, couleur, icone)
    (2, 1,  "CA Mensuel",      "185 420 DZD",  "E3F2FD", "ðŸ’µ"),   # Bleu clair
    (2, 4,  "BÃ©nÃ©fice Net",    "38 900 DZD",   "E8F5E9", "ðŸ“ˆ"),   # Vert clair
    (2, 7,  "Commandes",       "147 orders",   "FFF3E0", "ðŸ›’"),   # Orange clair
    (7, 1,  "EmployÃ©s Actifs", "47 personnes", "F3E5F5", "ðŸ‘¥"),   # Violet clair
    (7, 4,  "Stock",           "1 203 unitÃ©s", "FCE4EC", "ðŸ“¦"),   # Rose clair
    (7, 7,  "Satisfaction",    "4.2 / 5 â­",   "E0F7FA", "ðŸ†"),  # Cyan clair
]

# CrÃ©er chaque carte
for ligne, col, titre, valeur, couleur, icone in kpis:
    creer_carte_kpi(ws, ligne, col, titre, valeur, couleur, icone)
    print(f"  ðŸ“Œ Carte crÃ©Ã©e : {titre}")

# â”€â”€ Ajuster largeurs des colonnes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
for col_num in range(1, 9):
    ws.column_dimensions[get_column_letter(col_num)].width = 16

# â”€â”€ Titre du Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws["A1"] = "ðŸ“Š TABLEAU DE BORD EXÃ‰CUTIF â€” TechAlgÃ©rie SARL â€” Janvier 2024"
ws["A1"].font = Font(bold=True, size=13, color="1A237E")
ws.merge_cells("A1:H1")
ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 25

# â”€â”€ DonnÃ©es mensuelles pour le graphique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# On ajoute une zone de donnÃ©es cachÃ©e pour alimenter les graphiques
mois = ["Jan", "FÃ©v", "Mar", "Avr", "Mai", "Jun",
        "Jul", "AoÃ»", "Sep", "Oct", "Nov", "DÃ©c"]
ca_mensuel = [152000, 175000, 198000, 185000, 210000, 225000,
              195000, 188000, 215000, 230000, 205000, 185420]

# Ã‰criture des donnÃ©es en zone K1:L13 (hors zone visible principale)
ws["K1"] = "Mois"
ws["L1"] = "CA (DZD)"
for i, (m, ca) in enumerate(zip(mois, ca_mensuel)):
    ws[f"K{i+2}"] = m        # Nom du mois
    ws[f"L{i+2}"] = ca       # Valeur du CA

# â”€â”€ Graphique en barres : Ã©volution du CA mensuel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
chart = BarChart()                           # CrÃ©e un graphique en barres
chart.type = "col"                           # Colonnes verticales (pas horizontales)
chart.title = "Ã‰volution du CA Mensuel 2024" # Titre du graphique
chart.y_axis.title = "DZD"                  # Axe Y = montants en DZD
chart.x_axis.title = "Mois"                 # Axe X = mois

# RÃ©fÃ©rence aux donnÃ©es : lignes 2 Ã  13, colonne L (12e colonne)
data_ref = Reference(ws, min_col=12, min_row=1, max_row=13)
chart.add_data(data_ref, titles_from_data=True)  # La ligne 1 est l'en-tÃªte

# RÃ©fÃ©rence aux Ã©tiquettes : mois en colonne K
labels = Reference(ws, min_col=11, min_row=2, max_row=13)
chart.set_categories(labels)                 # Associe les mois Ã  l'axe X

# Couleur de la sÃ©rie de barres
chart.series[0].graphicalProperties.solidFill = "4472C4"  # Bleu

chart.width = 18                             # Largeur du graphique en cm
chart.height = 10                            # Hauteur du graphique en cm

# InsÃ©rer le graphique Ã  partir de la cellule A12
ws.add_chart(chart, "A12")                   # Position dans la feuille

# â”€â”€ Sauvegarder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb.save("TechAlgerie_Maitre.xlsx")
print("\\nâœ… Dashboard avec KPIs et graphique crÃ©Ã© avec succÃ¨s !")
print("ðŸ“Š 6 cartes KPI + 1 graphique barre mensuel")
\`\`\``
            },
            {
                lessonId: lesson2.id,
                type: 'CALLOUT',
                order: 2,
                content: JSON.stringify({
                    type: 'success',
                    title: 'âœ… RÃ©sultat de la LeÃ§on 2',
                    body: 'Votre feuille **Dashboard** contient maintenant :\n- **6 cartes KPI** colorÃ©es avec icÃ´nes\n- **1 graphique en barres** de l\'Ã©volution du CA mensuel\n- Une mise en page professionnelle prÃªte pour une prÃ©sentation de direction\n\nâž¡ï¸ **LeÃ§on suivante** : Construire le rapport financier complet (P&L, trÃ©sorerie)'
                })
            },
        ]
    })
    console.log(`  âœ… LeÃ§on 2 crÃ©Ã©e`)

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  LEÃ‡ON 3 â€” Rapport Financier Complet
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const lesson3 = await prisma.lesson.create({
        data: {
            title: 'LeÃ§on 3 â€” Rapport Financier : Compte de RÃ©sultat & TrÃ©sorerie',
            order: 3,
            courseId: course.id,
            isFree: false,
            duration: 60,
        }
    })

    await prisma.courseContent.createMany({
        data: [
            {
                lessonId: lesson3.id,
                type: 'TEXT',
                order: 1,
                content: `## ðŸ’° Module Finances â€” TechAlgÃ©rie SARL

Le module financier est le cÅ“ur de tout tableau de bord d'entreprise. Nous allons crÃ©er deux documents essentiels :

1. **Compte de RÃ©sultat (P&L)** : Revenus - Charges = BÃ©nÃ©fice
2. **Tableau de TrÃ©sorerie** : Flux d'entrÃ©es et de sorties d'argent mois par mois

### DonnÃ©es financiÃ¨res fictives de TechAlgÃ©rie 2024

| CatÃ©gorie | T1 | T2 | T3 | T4 | Total |
|---|---|---|---|---|---|
| **Ventes MatÃ©riel** | 450 000 | 520 000 | 480 000 | 510 000 | 1 960 000 |
| **Prestations Services** | 95 000 | 110 000 | 105 000 | 120 000 | 430 000 |
| **Maintenance & Support** | 22 000 | 25 000 | 24 000 | 26 000 | 97 000 |
| **Total Revenus** | **567 000** | **655 000** | **609 000** | **656 000** | **2 487 000** |
| Salaires & Charges | -280 000 | -295 000 | -288 000 | -310 000 | -1 173 000 |
| Loyer & Charges fixes | -48 000 | -48 000 | -48 000 | -48 000 | -192 000 |
| Achats Marchandises | -125 000 | -148 000 | -132 000 | -145 000 | -550 000 |
| **BÃ©nÃ©fice Net** | **114 000** | **164 000** | **141 000** | **153 000** | **572 000** |

---

## ðŸ¤– Prompt Antigravity pour le P&L

\`\`\`
CrÃ©e une feuille "Finances" dans TechAlgerie_Maitre.xlsx.
InsÃ¨re un tableau "Compte de RÃ©sultat Annuel 2024" avec les colonnes :
CatÃ©gorie | T1 | T2 | T3 | T4 | Total Annual
Inclus ces lignes :
- Section REVENUS (fond vert pÃ¢le) :
  Ventes MatÃ©riel : 450000, 520000, 480000, 510000
  Prestations Services : 95000, 110000, 105000, 120000
  Maintenance : 22000, 25000, 24000, 26000
  Ligne "Total Revenus" en gras avec formule SOMME
- Section CHARGES (fond rouge pÃ¢le) :
  Salaires : 280000, 295000, 288000, 310000
  Loyer : 48000, 48000, 48000, 48000
  Achats : 125000, 148000, 132000, 145000
  Ligne "Total Charges" en gras
- Ligne finale "BÃ‰NÃ‰FICE NET" avec fond bleu marine, texte blanc, formule
Formate les nombres en format comptabilitÃ© DZD.
\`\`\`

---

## ðŸ’» Script complet â€” Compte de RÃ©sultat

\`\`\`python
# ============================================================
# finances_pl.py â€” Compte de RÃ©sultat TechAlgÃ©rie SARL
# P&L = Profit & Loss Statement (Compte de RÃ©sultat)
# ============================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, numbers
from openpyxl.utils import get_column_letter

# â”€â”€ Chargement du fichier maÃ®tre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb = openpyxl.load_workbook("TechAlgerie_Maitre.xlsx")
ws = wb["Finances"]

# â”€â”€ Couleurs du rapport financier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
VERT_PALE    = "E8F5E9"    # Fond section Revenus (vert clair)
ROUGE_PALE   = "FFEBEE"    # Fond section Charges (rouge clair)
BLEU_MARINE  = "1A237E"    # Fond ligne BÃ©nÃ©fice
GRIS_ENTETE  = "455A64"    # Fond en-tÃªtes de colonnes
JAUNE_TOTAL  = "FFF9C4"    # Fond lignes de totaux intermÃ©diaires

# â”€â”€ Fonction bordure complÃ¨te â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def border_complete():
    s = Side(style="thin", color="BBBBBB")
    return Border(left=s, right=s, top=s, bottom=s)

# â”€â”€ Format monÃ©taire DZD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FORMAT_DZD = '#,##0 "DZD"'   # Format Excel pour afficher "150,000 DZD"

# â”€â”€ Titre du rapport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws["A1"] = "COMPTE DE RÃ‰SULTAT â€” TechAlgÃ©rie SARL â€” Exercice 2024"
ws["A1"].font = Font(bold=True, size=14, color="1A237E")
ws.merge_cells("A1:F1")
ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 30

ws["A2"] = "DonnÃ©es en Dinars AlgÃ©riens (DZD) â€” PrÃ©parÃ© avec Google Antigravity"
ws["A2"].font = Font(italic=True, size=10, color="888888")
ws.merge_cells("A2:F2")
ws.row_dimensions[2].height = 20

# â”€â”€ En-tÃªtes de colonnes (ligne 4) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
entetes = ["CATÃ‰GORIE", "T1 (Jan-Mar)", "T2 (Avr-Jun)", "T3 (Jul-Sep)", "T4 (Oct-DÃ©c)", "TOTAL ANNUEL"]
for col_idx, titre in enumerate(entetes, start=1):
    cell = ws.cell(row=4, column=col_idx)
    cell.value = titre
    cell.font = Font(bold=True, color="FFFFFF", size=11)         # Texte blanc gras
    cell.fill = PatternFill(start_color=GRIS_ENTETE, end_color=GRIS_ENTETE, fill_type="solid")
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = border_complete()
    ws.row_dimensions[4].height = 35

# Largeurs colonnes
largeurs = [28, 16, 16, 16, 16, 16]
for i, largeur in enumerate(largeurs, start=1):
    ws.column_dimensions[get_column_letter(i)].width = largeur

# â”€â”€ Structure des donnÃ©es financiÃ¨res â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Format : (catÃ©gorie, T1, T2, T3, T4, type_ligne)
# type_ligne : "revenu", "charge", "total_rev", "total_cha", "benefice", "section"
lignes_data = [
    # â”€â”€ Section Revenus â”€â”€
    ("â”€â”€ REVENUS â”€â”€",        None,    None,    None,    None,    "section_rev"),
    ("Ventes MatÃ©riel",      450000,  520000,  480000,  510000,  "revenu"),
    ("Prestations Services", 95000,   110000,  105000,  120000,  "revenu"),
    ("Maintenance & Support",22000,   25000,   24000,   26000,   "revenu"),
    ("TOTAL REVENUS",        None,    None,    None,    None,    "total_rev"),   # CalculÃ©
    # â”€â”€ Section Charges â”€â”€
    ("â”€â”€ CHARGES â”€â”€",        None,    None,    None,    None,    "section_cha"),
    ("Salaires & Charges SS",280000,  295000,  288000,  310000,  "charge"),
    ("Loyer & Charges fixes",48000,   48000,   48000,   48000,   "charge"),
    ("Achats Marchandises",  125000,  148000,  132000,  145000,  "charge"),
    ("Marketing & Pub",      15000,   18000,   14000,   16000,   "charge"),
    ("Frais GÃ©nÃ©raux",       12000,   13500,   12500,   14000,   "charge"),
    ("TOTAL CHARGES",        None,    None,    None,    None,    "total_cha"),   # CalculÃ©
    # â”€â”€ RÃ©sultat Final â”€â”€
    ("BÃ‰NÃ‰FICE NET",         None,    None,    None,    None,    "benefice"),    # CalculÃ©
]

# NumÃ©ros de ligne pour les calculs de formule
num_total_rev   = None   # Sera dÃ©fini quand on crÃ©e la ligne TOTAL REVENUS
num_total_cha   = None   # Sera dÃ©fini quand on crÃ©e la ligne TOTAL CHARGES
lignes_revenus  = []     # Stocke les numÃ©ros de lignes de revenus
lignes_charges  = []     # Stocke les numÃ©ros de lignes de charges

ligne_excel = 5          # On commence Ã  Ã©crire en ligne 5 (aprÃ¨s les en-tÃªtes)

for categorie, t1, t2, t3, t4, type_ligne in lignes_data:
    
    # â”€â”€ DÃ©finir le style selon le type de ligne â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if type_ligne == "section_rev":
        fond = VERT_PALE ; police_bold = True  ; taille = 11 ; couleur_txt = "2E7D32"
        skip_valeurs = True
    elif type_ligne == "section_cha":
        fond = ROUGE_PALE ; police_bold = True ; taille = 11 ; couleur_txt = "C62828"
        skip_valeurs = True
    elif type_ligne == "revenu":
        fond = "FFFFFF" ; police_bold = False  ; taille = 10 ; couleur_txt = "333333"
        skip_valeurs = False
        lignes_revenus.append(ligne_excel)       # MÃ©moriser pour la formule total
    elif type_ligne == "charge":
        fond = "FFFFFF" ; police_bold = False   ; taille = 10 ; couleur_txt = "333333"
        skip_valeurs = False
        lignes_charges.append(ligne_excel)       # MÃ©moriser pour la formule total
    elif type_ligne == "total_rev":
        fond = JAUNE_TOTAL ; police_bold = True ; taille = 11 ; couleur_txt = "2E7D32"
        skip_valeurs = False
        num_total_rev = ligne_excel
    elif type_ligne == "total_cha":
        fond = JAUNE_TOTAL ; police_bold = True ; taille = 11 ; couleur_txt = "C62828"
        skip_valeurs = False
        num_total_cha = ligne_excel
    elif type_ligne == "benefice":
        fond = BLEU_MARINE ; police_bold = True ; taille = 13 ; couleur_txt = "FFFFFF"
        skip_valeurs = False

    fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    
    # â”€â”€ Ã‰crire la cellule catÃ©gorie â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    cell_cat = ws.cell(row=ligne_excel, column=1)
    cell_cat.value = categorie
    cell_cat.font = Font(bold=police_bold, size=taille, color=couleur_txt)
    cell_cat.fill = fill
    cell_cat.border = border_complete()
    cell_cat.alignment = Alignment(vertical="center", indent=2 if not police_bold else 0)
    ws.row_dimensions[ligne_excel].height = 22
    
    # â”€â”€ Ã‰crire les valeurs pour les colonnes T1â€“T4 et Total â”€â”€â”€
    if not skip_valeurs:
        valeurs = [t1, t2, t3, t4]
        for col_idx, valeur in enumerate(valeurs, start=2):    # Colonnes B, C, D, E
            cell = ws.cell(row=ligne_excel, column=col_idx)
            
            if type_ligne in ("total_rev", "total_cha"):
                # Formule SOMME sur les lignes mÃ©morisÃ©es
                if type_ligne == "total_rev" and lignes_revenus:
                    refs = "+".join([f"{get_column_letter(col_idx)}{r}" for r in lignes_revenus])
                    cell.value = f"={refs}"                     # Formule Excel
                elif type_ligne == "total_cha" and lignes_charges:
                    refs = "+".join([f"{get_column_letter(col_idx)}{r}" for r in lignes_charges])
                    cell.value = f"={refs}"
            elif type_ligne == "benefice":
                # BÃ©nÃ©fice = Total Revenus - Total Charges
                col_l = get_column_letter(col_idx)
                cell.value = f"={col_l}{num_total_rev}-{col_l}{num_total_cha}"
            else:
                cell.value = valeur                             # Valeur numÃ©rique directe
            
            cell.number_format = FORMAT_DZD                    # Format monÃ©taire
            cell.font = Font(bold=police_bold, color=couleur_txt, size=taille)
            cell.fill = fill
            cell.border = border_complete()
            cell.alignment = Alignment(horizontal="right", vertical="center")
        
        # â”€â”€ Colonne Total (F) : somme des 4 trimestres â”€â”€â”€â”€â”€â”€â”€â”€
        cell_total = ws.cell(row=ligne_excel, column=6)
        if type_ligne not in ("total_rev", "total_cha", "benefice"):
            cell_total.value = f"=SUM(B{ligne_excel}:E{ligne_excel})"  # =SUM(B5:E5)
        elif type_ligne == "total_rev":
            cell_total.value = f"=SUM(B{ligne_excel}:E{ligne_excel})"
        elif type_ligne == "total_cha":
            cell_total.value = f"=SUM(B{ligne_excel}:E{ligne_excel})"
        elif type_ligne == "benefice":
            cell_total.value = f"=F{num_total_rev}-F{num_total_cha}"
        
        cell_total.number_format = FORMAT_DZD
        cell_total.font = Font(bold=True, color=couleur_txt, size=taille)
        cell_total.fill = fill
        cell_total.border = border_complete()
        cell_total.alignment = Alignment(horizontal="right", vertical="center")
    
    ligne_excel += 1   # Passer Ã  la ligne suivante

# â”€â”€ Figer les volets : en-tÃªtes toujours visibles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws.freeze_panes = "B5"       # Fige la colonne A et les lignes 1-4

# â”€â”€ Sauvegarde â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb.save("TechAlgerie_Maitre.xlsx")
print("âœ… Compte de RÃ©sultat crÃ©Ã© avec succÃ¨s !")
print(f"ðŸ“Š {len(lignes_revenus)} lignes de revenus, {len(lignes_charges)} lignes de charges")
print("   Toutes les formules Excel sont dynamiques (modification des valeurs = recalcul auto)")
\`\`\``
            },
            {
                lessonId: lesson3.id,
                type: 'TEXT',
                order: 2,
                content: `## ðŸ’§ Tableau de TrÃ©sorerie Mensuel

La trÃ©sorerie suit les **entrÃ©es et sorties d'argent** rÃ©elles (pas les factures Ã©mises). C'est essentiel pour Ã©viter les crises de liquiditÃ©s.

\`\`\`python
# ============================================================
# finances_tresorerie.py â€” Tableau de trÃ©sorerie mensuel
# ============================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.load_workbook("TechAlgerie_Maitre.xlsx")
ws_tres = wb.create_sheet("TrÃ©sorerie")  # Nouvelle feuille dÃ©diÃ©e

# â”€â”€ DonnÃ©es de trÃ©sorerie (fictives TechAlgÃ©rie 2024) â”€â”€â”€â”€â”€â”€â”€â”€
mois = ["Jan", "FÃ©v", "Mar", "Avr", "Mai", "Jun",
        "Jul", "AoÃ»", "Sep", "Oct", "Nov", "DÃ©c"]

# Encaissements (argent reÃ§u)
encaissements = [165000, 182000, 201000, 195000, 218000, 235000,
                 188000, 175000, 210000, 228000, 198000, 185000]

# DÃ©caissements (argent payÃ©)
decaissements = [148000, 155000, 162000, 158000, 170000, 175000,
                 165000, 160000, 168000, 175000, 165000, 158000]

# Solde initial en dÃ©but d'annÃ©e
solde_initial = 85000  # DZD en caisse au 1er janvier

# â”€â”€ En-tÃªtes du tableau â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws_tres["A1"] = "TABLEAU DE TRÃ‰SORERIE â€” TechAlgÃ©rie SARL â€” 2024"
ws_tres["A1"].font = Font(bold=True, size=14, color="1A237E")
ws_tres.merge_cells("A1:N1")
ws_tres["A1"].alignment = Alignment(horizontal="center")
ws_tres.row_dimensions[1].height = 30

# En-tÃªte colonne A (libellÃ©s)
ws_tres["A3"] = "LibellÃ© \\ Mois"
ws_tres["A3"].font = Font(bold=True, color="FFFFFF")
ws_tres["A3"].fill = PatternFill(start_color="455A64", end_color="455A64", fill_type="solid")

# En-tÃªtes des mois (colonnes B Ã  M)
for i, m in enumerate(mois):
    col = i + 2   # B=2, C=3, ...
    cell = ws_tres.cell(row=3, column=col)
    cell.value = m
    cell.font = Font(bold=True, color="FFFFFF")
    cell.fill = PatternFill(start_color="455A64", end_color="455A64", fill_type="solid")
    cell.alignment = Alignment(horizontal="center")

# â”€â”€ Ã‰criture des 4 lignes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
lignes = [
    ("Solde DÃ©but de Mois", None, "ECEFF1", "37474F"),           # CalculÃ©
    ("+ Encaissements",     encaissements, "E8F5E9", "2E7D32"),  # EntrÃ©es
    ("- DÃ©caissements",     decaissements, "FFEBEE", "C62828"),  # Sorties
    ("= Solde Fin de Mois", None, "E3F2FD", "1565C0"),           # CalculÃ©
]

solde_courant = solde_initial
numeros_lignes = {}   # MÃ©morise les numÃ©ros de lignes pour les formules

for offset, (libelle, valeurs, fond, couleur) in enumerate(lignes):
    ligne_num = 4 + offset
    numeros_lignes[libelle] = ligne_num
    
    # Cellule libellÃ©
    ws_tres.cell(row=ligne_num, column=1).value = libelle
    ws_tres.cell(row=ligne_num, column=1).font = Font(bold=True, color=couleur)
    ws_tres.cell(row=ligne_num, column=1).fill = PatternFill(
        start_color=fond, end_color=fond, fill_type="solid"
    )
    ws_tres.row_dimensions[ligne_num].height = 25
    ws_tres.column_dimensions["A"].width = 25
    
    for i in range(12):
        col = i + 2
        cell = ws_tres.cell(row=ligne_num, column=col)
        col_l = get_column_letter(col)
        
        if libelle == "Solde DÃ©but de Mois":
            if i == 0:
                cell.value = solde_initial     # Solde initial fixe
            else:
                # Solde dÃ©but = Solde fin du mois prÃ©cÃ©dent
                prev_col = get_column_letter(col - 1)
                cell.value = f"={prev_col}{numeros_lignes['= Solde Fin de Mois']}"
        elif valeurs is not None:
            cell.value = valeurs[i]            # Valeur directe
        elif libelle == "= Solde Fin de Mois":
            # Solde fin = Solde dÃ©but + Encaissements - DÃ©caissements
            r_debut = numeros_lignes["Solde DÃ©but de Mois"]
            r_enc   = numeros_lignes["+ Encaissements"]
            r_dec   = numeros_lignes["- DÃ©caissements"]
            cell.value = f"={col_l}{r_debut}+{col_l}{r_enc}-{col_l}{r_dec}"
        
        cell.number_format = '#,##0 "DZD"'
        cell.font = Font(bold=(libelle.startswith("=")), color=couleur)
        cell.fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
        cell.alignment = Alignment(horizontal="right")
        ws_tres.column_dimensions[col_l].width = 14

# â”€â”€ Mise en forme conditionnelle : solde nÃ©gatif en rouge â”€â”€â”€â”€
# Si le solde fin de mois < 0, la cellule devient rouge automatiquement
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import PatternFill as PFill

rouge_alerte = PFill(start_color="FF5252", end_color="FF5252", fill_type="solid")
plage_solde_fin = f"B{numeros_lignes['= Solde Fin de Mois']}:M{numeros_lignes['= Solde Fin de Mois']}"

ws_tres.conditional_formatting.add(
    plage_solde_fin,
    CellIsRule(
        operator="lessThan",          # Si la cellule est infÃ©rieure Ã ...
        formula=["0"],                # ...0
        fill=rouge_alerte             # ...appliquer le fond rouge
    )
)

wb.save("TechAlgerie_Maitre.xlsx")
print("âœ… Tableau de trÃ©sorerie crÃ©Ã© avec mise en forme conditionnelle !")
\`\`\``
            },
            {
                lessonId: lesson3.id,
                type: 'CALLOUT',
                order: 3,
                content: JSON.stringify({
                    type: 'tip',
                    title: 'ðŸ’¡ Astuce Antigravity : GÃ©nÃ©rer les prÃ©visions',
                    body: '**Demandez Ã  Antigravity :**\n\n*"Analyse ces donnÃ©es de trÃ©sorerie et gÃ©nÃ¨re un script Python qui calcule la trÃ©sorerie prÃ©visionnelle pour les 6 prochains mois en appliquant une croissance de 8% sur les encaissements et en maintenant les dÃ©caissements stables."*\n\nAntigravity va gÃ©nÃ©rer automatiquement le code de simulation financiÃ¨re !'
                })
            },
        ]
    })
    console.log(`  âœ… LeÃ§on 3 crÃ©Ã©e`)

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  LEÃ‡ON 4 â€” Gestion d'Inventaire & Stock
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const lesson4 = await prisma.lesson.create({
        data: {
            title: 'LeÃ§on 4 â€” Gestion d\'Inventaire : Stock, Alertes & Valorisation',
            order: 4,
            courseId: course.id,
            isFree: false,
            duration: 55,
        }
    })

    await prisma.courseContent.createMany({
        data: [
            {
                lessonId: lesson4.id,
                type: 'TEXT',
                order: 1,
                content: `## ðŸ“¦ Gestion d'Inventaire â€” TechAlgÃ©rie SARL

TechAlgÃ©rie SARL gÃ¨re **523 rÃ©fÃ©rences produits** : ordinateurs, composants, accessoires rÃ©seau. Nous allons crÃ©er un systÃ¨me complet de gestion des stocks avec :

- ðŸ“‹ **Liste de stock** avec toutes les rÃ©fÃ©rences
- ðŸš¨ **Alertes de rupture** automatiques (stock < seuil minimum)
- ðŸ’° **Valorisation automatique** (stock Ã— prix d'achat)
- ðŸ“Š **Rapport fournisseurs** par catÃ©gorie

### Catalogue de produits fictifs TechAlgÃ©rie

| RÃ©fÃ©rence | Produit | CatÃ©gorie | Stock | Seuil Min | Prix Achat | Prix Vente |
|---|---|---|---|---|---|---|
| PC-001 | PC Bureau Dell OptiPlex | Ordinateurs | 12 | 5 | 85 000 | 120 000 |
| PC-002 | Laptop HP Probook 450 | Ordinateurs | 3 | **5** ðŸš¨ | 95 000 | 135 000 |
| NET-001 | Switch Cisco 24 ports | RÃ©seau | 8 | 3 | 45 000 | 68 000 |
| ACC-001 | Souris sans fil Logitech | Accessoires | 45 | 10 | 3 500 | 5 500 |
| IMP-001 | Imprimante HP LaserJet | Imprimantes | 6 | 2 | 55 000 | 78 000 |
| ... | ... | ... | ... | ... | ... | ... |

Les cellules en **rouge** indiquent les produits sous le seuil minimum.

---

## ðŸ’» Script complet â€” SystÃ¨me de gestion d'inventaire

\`\`\`python
# ============================================================
# inventaire.py â€” Gestion de stock TechAlgÃ©rie SARL
# ============================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import PatternFill as PFill
import random   # Pour simuler des quantitÃ©s de stock variables

# â”€â”€ DonnÃ©es du catalogue produits (fictif TechAlgÃ©rie) â”€â”€â”€â”€â”€â”€â”€
produits = [
    # (ref, nom, categorie, stock, seuil_min, prix_achat, prix_vente, fournisseur)
    ("PC-001", "PC Bureau Dell OptiPlex 3090", "Ordinateurs", 12, 5, 85000, 120000, "Dell DZ"),
    ("PC-002", "Laptop HP ProBook 450 G8",     "Ordinateurs",  3, 5, 95000, 135000, "HP AlgÃ©rie"),
    ("PC-003", "MacBook Air M2 256GB",          "Ordinateurs",  7, 3,195000, 280000, "iStore DZ"),
    ("PC-004", "PC Portable Lenovo ThinkPad",   "Ordinateurs",  9, 4, 88000, 125000, "Lenovo DZ"),
    ("PC-005", "All-in-One Dell Inspiron 24",   "Ordinateurs", 14, 5, 75000, 108000, "Dell DZ"),
    ("NET-001","Switch Cisco SG350 24 ports",   "RÃ©seau",       8, 3, 45000,  68000, "Cisco DZ"),
    ("NET-002","Routeur MikroTik hEX",          "RÃ©seau",      15, 5, 18000,  28000, "MikroTik"),
    ("NET-003","Point d'accÃ¨s Ubiquiti UniFi",  "RÃ©seau",       2, 3, 22000,  35000, "Ubiquiti"),
    ("NET-004","CÃ¢ble rÃ©seau Cat6 (100m)",       "RÃ©seau",      50,20,  4500,   7500, "Nexans DZ"),
    ("NET-005","Pare-feu Fortinet FortiGate 60","RÃ©seau",       4, 2, 85000, 125000, "Fortinet"),
    ("ACC-001","Souris sans fil Logitech MX",   "Accessoires", 45,10,  3500,   5500, "Logitech DZ"),
    ("ACC-002","Clavier mÃ©canique Corsair K95", "Accessoires", 18, 5,  8500,  13000, "Corsair"),
    ("ACC-003","Webcam Logitech C920 HD",       "Accessoires", 22, 8,  7500,  11500, "Logitech DZ"),
    ("ACC-004","Hub USB-C 7 en 1",              "Accessoires", 35,10,  3200,   5200, "Ugreen"),
    ("ACC-005","Casque audio Sony WH-1000XM5",  "Accessoires",  6, 3, 28000,  42000, "Sony DZ"),
    ("IMP-001","Imprimante HP LaserJet Pro",    "Imprimantes",  6, 2, 55000,  78000, "HP AlgÃ©rie"),
    ("IMP-002","Imprimante Canon PIXMA G3470",  "Imprimantes",  9, 3, 32000,  48000, "Canon DZ"),
    ("IMP-003","Scanner Epson Perfection V39",  "Imprimantes", 11, 4, 18000,  27000, "Epson DZ"),
    ("SRV-001","Serveur Dell PowerEdge T350",   "Serveurs",     2, 1,350000, 480000, "Dell DZ"),
    ("SRV-002","NAS Synology DS923+",            "Serveurs",     5, 2, 95000, 138000, "Synology"),
    ("LOG-001","Windows 11 Pro (licence)",      "Logiciels",   30,10,  8500,  13500, "Microsoft DZ"),
    ("LOG-002","Microsoft Office 365 (1 an)",   "Logiciels",   25, 8,  4500,   7500, "Microsoft DZ"),
    ("LOG-003","Antivirus ESET Business",       "Logiciels",   40,15,  3200,   5500, "ESET DZ"),
]

# â”€â”€ Chargement du fichier maÃ®tre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb = openpyxl.load_workbook("TechAlgerie_Maitre.xlsx")
ws = wb["Inventaire"]

# â”€â”€ Couleurs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ROUGE_ALERTE  = "FFCDD2"   # Fond rouge : stock < seuil minimum
ORANGE_ALERTE = "FFE0B2"   # Fond orange : stock < 2Ã— seuil minimum
VERT_OK       = "C8E6C9"   # Fond vert : stock suffisant
GRIS_ENTETE   = "37474F"   # Fond gris foncÃ© pour les en-tÃªtes

# â”€â”€ Titre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws["A1"] = "ðŸ“¦ GESTION DES STOCKS â€” TechAlgÃ©rie SARL"
ws["A1"].font = Font(bold=True, size=14, color="FFFFFF")
ws["A1"].fill = PatternFill(start_color="E65100", end_color="E65100", fill_type="solid")
ws.merge_cells("A1:J1")
ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 30

ws["A2"] = f"Mise Ã  jour : {__import__('datetime').datetime.now().strftime('%d/%m/%Y %H:%M')}"
ws["A2"].font = Font(italic=True, size=10, color="666666")
ws.merge_cells("A2:J2")

# â”€â”€ En-tÃªtes de colonnes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
entetes = [
    "RÃ©fÃ©rence", "DÃ©signation", "CatÃ©gorie", "Fournisseur",
    "Stock Actuel", "Seuil Minimum", "Statut",
    "Prix Achat (DZD)", "Prix Vente (DZD)", "Valeur Stock (DZD)"
]
for col, header in enumerate(entetes, start=1):
    cell = ws.cell(row=3, column=col)
    cell.value = header
    cell.font = Font(bold=True, color="FFFFFF", size=10)
    cell.fill = PatternFill(start_color=GRIS_ENTETE, end_color=GRIS_ENTETE, fill_type="solid")
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[3].height = 40

# Largeurs optimisÃ©es
largeurs_col = [12, 30, 14, 16, 14, 14, 16, 18, 18, 20]
for i, larg in enumerate(largeurs_col, start=1):
    ws.column_dimensions[get_column_letter(i)].width = larg

# â”€â”€ Ã‰criture des produits ligne par ligne â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ligne_debut = 4   # PremiÃ¨re ligne de donnÃ©es
total_valeur_stock = 0

for i, (ref, nom, cat, stock, seuil, p_achat, p_vente, fourni) in enumerate(produits):
    ligne = ligne_debut + i
    
    # DÃ©terminer le statut du stock
    valeur_stock = stock * p_achat         # Valorisation du stock
    total_valeur_stock += valeur_stock
    
    if stock < seuil:
        statut = "ðŸš¨ RUPTURE"
        fond = ROUGE_ALERTE
    elif stock < seuil * 2:
        statut = "âš ï¸ BAS"
        fond = ORANGE_ALERTE
    else:
        statut = "âœ… OK"
        fond = VERT_OK
    
    # Valeurs Ã  Ã©crire dans chaque colonne
    valeurs_row = [ref, nom, cat, fourni, stock, seuil, statut,
                   p_achat, p_vente, valeur_stock]
    
    fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    
    for col, val in enumerate(valeurs_row, start=1):
        cell = ws.cell(row=ligne, column=col)
        cell.value = val
        cell.fill = fill                   # Couleur selon statut
        cell.alignment = Alignment(vertical="center", horizontal="right" if col > 4 else "left")
        cell.font = Font(size=10, bold=(col == 7))  # Statut en gras
        
        # Format monÃ©taire pour les colonnes prix
        if col in (8, 9, 10):
            cell.number_format = '#,##0 "DZD"'
    
    ws.row_dimensions[ligne].height = 20

# â”€â”€ Ligne de total â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ligne_total = ligne_debut + len(produits)
ws.cell(row=ligne_total, column=1).value = "TOTAL STOCK"
ws.cell(row=ligne_total, column=10).value = f"=SUM(J{ligne_debut}:J{ligne_total-1})"
ws.cell(row=ligne_total, column=10).number_format = '#,##0 "DZD"'
for col in range(1, 11):
    ws.cell(row=ligne_total, column=col).font = Font(bold=True, color="FFFFFF")
    ws.cell(row=ligne_total, column=col).fill = PatternFill(
        start_color="E65100", end_color="E65100", fill_type="solid"
    )

# â”€â”€ Figer les en-tÃªtes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws.freeze_panes = "A4"     # Les 3 premiÃ¨res lignes restent visibles au scroll

# â”€â”€ Filtre automatique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws.auto_filter.ref = f"A3:J{ligne_total-1}"  # Activer le filtre sur tout le tableau

# â”€â”€ Sauvegarder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb.save("TechAlgerie_Maitre.xlsx")
nb_alertes = sum(1 for _, _, _, stock, seuil, *_ in produits if stock < seuil)
print(f"âœ… Inventaire crÃ©Ã© : {len(produits)} produits")
print(f"ðŸš¨ Alertes rupture : {nb_alertes} produits sous le seuil minimum")
print(f"ðŸ’° Valeur totale du stock : {total_valeur_stock:,.0f} DZD")
\`\`\``
            },
            {
                lessonId: lesson4.id,
                type: 'CALLOUT',
                order: 2,
                content: JSON.stringify({
                    type: 'warning',
                    title: 'ðŸš¨ Alerte Stock : Produits en Rupture',
                    body: 'Dans le catalogue fictif TechAlgÃ©rie, **3 produits sont en dessous du seuil minimum** :\n\n- **PC-002** Laptop HP ProBook : Stock=3, Seuil=5 ðŸš¨\n- **NET-003** Point d\'accÃ¨s Ubiquiti : Stock=2, Seuil=3 ðŸš¨\n- **SRV-001** Serveur Dell PowerEdge : Stock=2, Seuil=1 âš ï¸\n\nLe script colorie automatiquement ces lignes en **rouge** pour les identifier d\'un seul coup d\'Å“il.'
                })
            },
        ]
    })
    console.log(`  âœ… LeÃ§on 4 crÃ©Ã©e`)

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  LEÃ‡ON 5 â€” Gestion RH ComplÃ¨te
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const lesson5 = await prisma.lesson.create({
        data: {
            title: 'LeÃ§on 5 â€” Ressources Humaines : EmployÃ©s, Salaires & CongÃ©s',
            order: 5,
            courseId: course.id,
            isFree: false,
            duration: 60,
        }
    })

    await prisma.courseContent.createMany({
        data: [
            {
                lessonId: lesson5.id,
                type: 'TEXT',
                order: 1,
                content: `## ðŸ‘¥ Module RH â€” TechAlgÃ©rie SARL

Le module Ressources Humaines (RH) gÃ¨re les **47 employÃ©s** de TechAlgÃ©rie rÃ©partis dans 5 dÃ©partements. Nous allons crÃ©er :

1. ðŸ“‹ **Fiche du personnel** : coordonnÃ©es, poste, dÃ©partement, anciennetÃ©
2. ðŸ’¶ **Calcul de la paie** : salaire brut, cotisations CNAS, IRG, net Ã  payer
3. ðŸ“… **Suivi des congÃ©s** : solde annuel, congÃ©s pris, congÃ©s restants
4. â­ **Ã‰valuations** : note de performance trimestrielle

### Organigramme TechAlgÃ©rie SARL

| DÃ©partement | Effectif | Responsable |
|---|---|---|
| Direction GÃ©nÃ©rale | 2 | Karim BENSALAH (PDG) |
| Commercial & Ventes | 12 | Amina HADJ (Dir. Commercial) |
| Technique & SAV | 15 | Yacine MEZIANE (Dir. Technique) |
| ComptabilitÃ© & Finance | 6 | Soraya ACHOUR (DAF) |
| Logistique & Stock | 8 | Mehdi OUALI (Dir. Logistique) |
| RH & Admin | 4 | Fatima KHELIF (DRH) |
| **Total** | **47** | |

---

## ðŸ’» Script complet â€” Fichier RH

\`\`\`python
# ============================================================
# rh_employes.py â€” Gestion RH complÃ¨te TechAlgÃ©rie SARL
# ============================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import datetime, date

wb = openpyxl.load_workbook("TechAlgerie_Maitre.xlsx")
ws_rh = wb["RH"]                           # Feuille RH crÃ©Ã©e en LeÃ§on 1

# â”€â”€ DonnÃ©es des employÃ©s (fictifs) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Format : (matricule, prenom, nom, poste, dept, date_embauche,
#           salaire_brut, conges_pris, note_perf)
employes = [
    # Direction
    ("DG-001", "Karim",   "BENSALAH", "PDG",                   "Direction",    "2015-03-01", 180000, 5,  5.0),
    ("DG-002", "Nadia",   "BENSALAH", "Assistante de Direction","Direction",    "2018-06-15", 85000,  8,  4.5),
    # Commercial
    ("COM-001","Amina",   "HADJ",     "Directrice Commerciale","Commercial",   "2016-01-10", 120000, 10, 4.8),
    ("COM-002","Redouane","BOUDIAF",  "IngÃ©nieur Commercial",  "Commercial",   "2019-04-22", 75000,  12, 4.2),
    ("COM-003","Leila",   "SAADI",    "IngÃ©nieure Commerciale","Commercial",   "2020-09-01", 72000,  7,  4.5),
    ("COM-004","Mourad",  "AISSAOUI", "Technico-Commercial",   "Commercial",   "2021-02-15", 65000,  6,  3.8),
    ("COM-005","Yasmine", "BENALI",   "Technico-Commerciale",  "Commercial",   "2021-07-01", 63000,  9,  4.0),
    ("COM-006","Farid",   "CHERIF",   "Commercial Terrain",    "Commercial",   "2022-01-03", 58000,  5,  3.5),
    ("COM-007","Sara",    "MERAD",    "Commerciale Terrain",   "Commercial",   "2022-03-14", 57000,  4,  3.9),
    ("COM-008","Hichem",  "ZIDANE",   "Commercial RÃ©gion Est", "Commercial",   "2022-09-01", 60000,  11, 4.1),
    ("COM-009","Rima",    "KACI",     "Assistante Commercial", "Commercial",   "2023-01-15", 48000,  3,  4.3),
    ("COM-010","Amine",   "LARBI",    "Stagiaire Commercial",  "Commercial",   "2024-01-02", 32000,  0,  3.7),
    ("COM-011","Khaled",  "BRAHIM",   "Commercial B2B",        "Commercial",   "2023-06-01", 62000,  8,  4.0),
    ("COM-012","Imane",   "FERHAT",   "ChargÃ©e Marketing",     "Commercial",   "2023-09-15", 55000,  2,  4.4),
    # Technique
    ("TEC-001","Yacine",  "MEZIANE",  "Directeur Technique",   "Technique",    "2015-09-01", 130000, 10, 4.9),
    ("TEC-002","Nassim",  "AMAR",     "IngÃ©nieur RÃ©seau Senior","Technique",   "2017-03-20", 95000,  8,  4.6),
    ("TEC-003","Dalila",  "HAMMAMI",  "IngÃ©nieure SystÃ¨mes",   "Technique",    "2018-11-05", 90000,  12, 4.4),
    ("TEC-004","Sofiane", "BRAHIMI",  "Technicien RÃ©seaux",    "Technique",    "2019-07-01", 72000,  6,  4.2),
    ("TEC-005","Meriem",  "TOUIL",    "Technicienne Support",  "Technique",    "2020-01-13", 65000,  9,  4.0),
    ("TEC-006","Walid",   "GUESMI",   "Technicien Informatique","Technique",   "2020-06-22", 62000,  7,  3.9),
    ("TEC-007","Chaima",  "BENDJEMA", "DÃ©veloppeuse Web",      "Technique",    "2021-04-01", 78000,  5,  4.5),
    ("TEC-008","Ryad",    "BELKACEM", "Administrateur Sys.",   "Technique",    "2021-08-16", 80000,  10, 4.3),
    ("TEC-009","Siham",   "OUKID",    "Technicienne SAV",      "Technique",    "2022-01-10", 58000,  4,  4.1),
    ("TEC-010","Djamel",  "HAMDAOUI", "Technicien SAV",        "Technique",    "2022-05-23", 56000,  3,  3.8),
    ("TEC-011","Nawal",   "CHIKHI",   "IngÃ©nieure Cloud",      "Technique",    "2022-10-01", 88000,  6,  4.7),
    ("TEC-012","Ramzi",   "BOUCHENAK","Technicien CÃ¢blage",    "Technique",    "2023-02-14", 48000,  2,  3.6),
    ("TEC-013","Assia",   "MEKIDECHE","Technicienne RÃ©seau",   "Technique",    "2023-07-01", 55000,  0,  4.0),
    ("TEC-014","Omar",    "BOUDISSA", "Technicien Terrain",    "Technique",    "2024-01-08", 46000,  0,  3.9),
    ("TEC-015","Nour",    "IDIR",     "Stagiaire Technique",   "Technique",    "2024-03-01", 28000,  0,  4.2),
    # Finance
    ("FIN-001","Soraya",  "ACHOUR",   "Directrice FinanciÃ¨re", "Finance",      "2016-04-01", 115000, 10, 4.8),
    ("FIN-002","Mohamed", "BADI",     "Comptable Senior",      "Finance",      "2018-09-12", 82000,  8,  4.5),
    ("FIN-003","Hafida",  "SLIMANE",  "Comptable",             "Finance",      "2020-02-01", 65000,  7,  4.3),
    ("FIN-004","Billel",  "ZERROUKI", "ContrÃ´leur de Gestion", "Finance",      "2021-01-11", 75000,  5,  4.4),
    ("FIN-005","Houda",   "TABET",    "Assistante Comptable",  "Finance",      "2022-08-01", 52000,  4,  4.0),
    ("FIN-006","Samir",   "HAMICI",   "TrÃ©sorier",             "Finance",      "2023-04-17", 68000,  2,  4.2),
    # Logistique
    ("LOG-001","Mehdi",   "OUALI",    "Directeur Logistique",  "Logistique",   "2016-07-01", 108000, 10, 4.7),
    ("LOG-002","Farida",  "AMIRI",    "Responsable Stocks",    "Logistique",   "2018-02-19", 72000,  9,  4.5),
    ("LOG-003","Tarek",   "BENGUERNA","Magasinier Senior",     "Logistique",   "2019-10-07", 55000,  8,  4.1),
    ("LOG-004","Souad",   "LAIB",     "MagasiniÃ¨re",           "Logistique",   "2020-05-25", 48000,  6,  3.9),
    ("LOG-005","Adel",    "GUERFI",   "Livreur Senior",        "Logistique",   "2019-08-01", 45000,  5,  4.0),
    ("LOG-006","Rania",   "MEZGHACHE","Assistante Logistique", "Logistique",   "2021-12-01", 50000,  3,  4.2),
    ("LOG-007","Hamza",   "SELLALI",  "Chauffeur-Livreur",     "Logistique",   "2022-06-13", 42000,  4,  3.8),
    ("LOG-008","Zineb",   "BENHOURA", "Manutentionnaire",      "Logistique",   "2023-01-02", 38000,  1,  3.7),
    # RH
    ("RH-001", "Fatima",  "KHELIF",   "Directrice RH",         "RH & Admin",   "2017-05-08", 100000, 10, 4.7),
    ("RH-002", "Kamelia", "SAHRAOUI", "ChargÃ©e RH",            "RH & Admin",   "2019-11-18", 68000,  8,  4.4),
    ("RH-003", "Rachid",  "BOUKHELIF","Responsable Admin.",    "RH & Admin",   "2020-07-06", 62000,  7,  4.2),
    ("RH-004", "Lyna",    "BENAZZOUZ","Assistante RH",         "RH & Admin",   "2023-03-20", 48000,  2,  4.1),
]

# â”€â”€ Couleurs par dÃ©partement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
couleurs_dept = {
    "Direction":  "CE93D8",   # Violet
    "Commercial": "90CAF9",   # Bleu clair
    "Technique":  "80DEEA",   # Cyan
    "Finance":    "A5D6A7",   # Vert
    "Logistique": "FFCC80",   # Orange
    "RH & Admin": "EF9A9A",   # Rose
}

# â”€â”€ Titre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws_rh["A1"] = "ðŸ‘¥ GESTION DES RESSOURCES HUMAINES â€” TechAlgÃ©rie SARL"
ws_rh["A1"].font = Font(bold=True, size=14, color="FFFFFF")
ws_rh["A1"].fill = PatternFill(start_color="4A148C", end_color="4A148C", fill_type="solid")
ws_rh.merge_cells("A1:N1")
ws_rh["A1"].alignment = Alignment(horizontal="center")
ws_rh.row_dimensions[1].height = 30

# â”€â”€ En-tÃªtes colonnes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
entetes_rh = [
    "Matricule", "PrÃ©nom", "Nom", "Poste", "DÃ©partement",
    "Date Embauche", "AnciennetÃ©", "Salaire Brut",
    "CNAS (9%)", "IRG (estimÃ©)", "Salaire Net",
    "CongÃ©s/An", "CongÃ©s Pris", "CongÃ©s Restants"
]
for col, h in enumerate(entetes_rh, start=1):
    cell = ws_rh.cell(row=2, column=col)
    cell.value = h
    cell.font = Font(bold=True, color="FFFFFF", size=9)
    cell.fill = PatternFill(start_color="4A148C", end_color="4A148C", fill_type="solid")
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws_rh.row_dimensions[2].height = 45

# Largeurs colonnes
larg_rh = [10, 12, 14, 28, 14, 14, 12, 18, 14, 14, 16, 12, 12, 15]
for i, l in enumerate(larg_rh, start=1):
    ws_rh.column_dimensions[get_column_letter(i)].width = l

# â”€â”€ Ã‰criture des donnÃ©es employÃ©s â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
date_auj = date.today()
FORMAT_DZD = '#,##0 "DZD"'
CONGES_ANNUELS = 30    # 30 jours de congÃ© par an (droit algÃ©rien)

for i, (mat, prenom, nom, poste, dept, date_emb, brut, conges_pris, note) in enumerate(employes):
    ligne = 3 + i
    
    # Calcul anciennetÃ©
    date_embauche = datetime.strptime(date_emb, "%Y-%m-%d").date()
    anciennete = (date_auj - date_embauche).days // 365   # En annÃ©es
    
    # Calcul de la paie (simplifiÃ©, barÃ¨me algÃ©rien approximatif)
    cnas = brut * 0.09          # Cotisation salariale CNAS = 9% du brut
    # IRG : simplifiÃ© (tranches rÃ©elles plus complexes)
    salaire_net_cnas = brut - cnas
    if salaire_net_cnas < 30000:
        irg = 0                 # ExonÃ©rÃ© si < 30 000 DZD
    elif salaire_net_cnas < 60000:
        irg = (salaire_net_cnas - 30000) * 0.20   # 20% sur la tranche
    else:
        irg = 6000 + (salaire_net_cnas - 60000) * 0.30  # 30% au-delÃ 
    
    net = round(brut - cnas - irg)    # Salaire net Ã  payer
    conges_restants = CONGES_ANNUELS - conges_pris
    
    # Couleur de fond par dÃ©partement
    couleur = couleurs_dept.get(dept, "F5F5F5")
    fill = PatternFill(start_color=couleur, end_color=couleur, fill_type="solid")
    
    # Valeurs Ã  Ã©crire
    valeurs_emp = [
        mat, prenom, nom, poste, dept,
        date_embauche, f"{anciennete} ans", brut,
        round(cnas), round(irg), net,
        CONGES_ANNUELS, conges_pris, conges_restants
    ]
    
    for col, val in enumerate(valeurs_emp, start=1):
        cell = ws_rh.cell(row=ligne, column=col)
        cell.value = val
        cell.fill = fill
        cell.font = Font(size=9)
        cell.alignment = Alignment(
            horizontal="center" if col in (1, 5, 6, 7, 12, 13, 14) else "left",
            vertical="center"
        )
        # Format monÃ©taire pour les colonnes salaires
        if col in (8, 9, 10, 11):
            cell.number_format = FORMAT_DZD
        # Format date
        if col == 6:
            cell.number_format = "DD/MM/YYYY"
    
    ws_rh.row_dimensions[ligne].height = 18

# â”€â”€ Figer les en-tÃªtes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws_rh.freeze_panes = "A3"

# â”€â”€ Filtre automatique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws_rh.auto_filter.ref = f"A2:N{3 + len(employes) - 1}"

# â”€â”€ RÃ©sumÃ© par dÃ©partement (en bas) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ligne_resume = 3 + len(employes) + 2
ws_rh.cell(row=ligne_resume, column=1).value = "RÃ‰SUMÃ‰ PAR DÃ‰PARTEMENT"
ws_rh.cell(row=ligne_resume, column=1).font = Font(bold=True, size=12, color="4A148C")
ws_rh.merge_cells(f"A{ligne_resume}:F{ligne_resume}")

ligne_resume += 1
headers_resume = ["DÃ©partement", "Nb EmployÃ©s", "Masse Salariale Brute", "Salaire Moyen"]
for col, h in enumerate(headers_resume, start=1):
    ws_rh.cell(row=ligne_resume, column=col).value = h
    ws_rh.cell(row=ligne_resume, column=col).font = Font(bold=True, color="FFFFFF")
    ws_rh.cell(row=ligne_resume, column=col).fill = PatternFill(
        start_color="4A148C", end_color="4A148C", fill_type="solid"
    )

# Calculer et afficher par dÃ©partement
from collections import defaultdict
dept_stats = defaultdict(lambda: {"count": 0, "total_brut": 0})
for _, _, _, _, dept, _, brut, *_ in employes:
    dept_stats[dept]["count"] += 1
    dept_stats[dept]["total_brut"] += brut

ligne_resume += 1
for dept, stats in sorted(dept_stats.items()):
    row_data = [
        dept,
        stats["count"],
        stats["total_brut"],
        stats["total_brut"] // stats["count"]
    ]
    couleur = couleurs_dept.get(dept, "F5F5F5")
    fill = PatternFill(start_color=couleur, end_color=couleur, fill_type="solid")
    
    for col, val in enumerate(row_data, start=1):
        cell = ws_rh.cell(row=ligne_resume, column=col)
        cell.value = val
        cell.fill = fill
        cell.font = Font(bold=(col == 1))
        if col in (3, 4):
            cell.number_format = FORMAT_DZD
    ligne_resume += 1

# â”€â”€ Sauvegarder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb.save("TechAlgerie_Maitre.xlsx")
masse_salariale = sum(emp[6] for emp in employes)
print(f"âœ… Fichier RH crÃ©Ã© : {len(employes)} employÃ©s")
print(f"ðŸ’¶ Masse salariale mensuelle brute : {masse_salariale:,.0f} DZD")
print(f"ðŸ“… Tous les employÃ©s ont {CONGES_ANNUELS} jours de congÃ© annuel")
\`\`\``
            },
            {
                lessonId: lesson5.id,
                type: 'CALLOUT',
                order: 2,
                content: JSON.stringify({
                    type: 'info',
                    title: 'ðŸ“‹ Calcul de la paie algÃ©rienne (simplifiÃ©)',
                    body: 'Ce cours utilise un calcul simplifiÃ© basÃ© sur :\n\n- **CNAS salariale** : 9% du salaire brut (taux lÃ©gal 2024)\n- **IRG** : ImpÃ´t sur le Revenu Global, calculÃ© par tranches (simplifiÃ©)\n  - < 30 000 DZD/mois â†’ ExonÃ©rÃ©\n  - 30 000 Ã  60 000 DZD â†’ 20%\n  - > 60 000 DZD â†’ 30%\n\nâš ï¸ *En production rÃ©elle, utilisez le barÃ¨me officiel IRG de la DGI algÃ©rienne.*'
                })
            },
        ]
    })
    console.log(`  âœ… LeÃ§on 5 crÃ©Ã©e`)

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  LEÃ‡ON 6 â€” Rapport de Direction ConsolidÃ©
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const lesson6 = await prisma.lesson.create({
        data: {
            title: 'LeÃ§on 6 â€” Rapport de Direction : Consolidation & Visualisation Finale',
            order: 6,
            courseId: course.id,
            isFree: false,
            duration: 65,
        }
    })

    await prisma.courseContent.createMany({
        data: [
            {
                lessonId: lesson6.id,
                type: 'TEXT',
                order: 1,
                content: `## ðŸ“‘ Rapport de Direction â€” TechAlgÃ©rie SARL

Vous avez construit les 4 modules sÃ©parÃ©ment. Dans cette leÃ§on finale, nous allons **tout consolider** en un Rapport de Direction professionnel prÃªt Ã  Ãªtre prÃ©sentÃ© au Conseil d'Administration.

### Ce que va contenir le rapport final :

| Section | DonnÃ©es Sources | RÃ©sultat |
|---|---|---|
| **Page de garde** | Toutes les feuilles | RÃ©sumÃ© exÃ©cutif avec logos |
| **SynthÃ¨se KPIs** | Dashboard | Les 6 KPIs clÃ©s en une page |
| **Performance FinanciÃ¨re** | Finances | P&L graphique + trÃ©sorerie |
| **Ã‰tat des Stocks** | Inventaire | Top 10 produits + alertes |
| **Capital Humain** | RH | Masse salariale + rÃ©partition |
| **Graphiques** | Toutes les donnÃ©es | 4 graphiques professionnels |

---

## ðŸ¤– Prompt Antigravity : GÃ©nÃ©rer le rapport complet

\`\`\`
Tu es un expert en Python et openpyxl.
GÃ©nÃ¨re un script Python qui ouvre le fichier "TechAlgerie_Maitre.xlsx"
et crÃ©e une nouvelle feuille "Rapport_Direction" avec :
1. Un en-tÃªte professionnel bleu marine avec le titre "RAPPORT DE DIRECTION
   TRIMESTRIEL â€” TechAlgÃ©rie SARL â€” T4 2024" et la date d'aujourd'hui
2. 3 sections colorÃ©es :
   - "PERFORMANCE FINANCIÃˆRE" : affiche CA=2487000 DZD, BÃ©nÃ©fice=572000 DZD,
     Marge=23%, taux croissance=+12%
   - "Ã‰TAT DES STOCKS" : 523 rÃ©fÃ©rences, 3 alertes rupture, valeur stock=35M DZD
   - "RESSOURCES HUMAINES" : 47 employÃ©s, masse salariale=3.2M DZD/mois,
     5 recrutements prÃ©vus Q1 2025
3. Un graphique radar/radar des 5 dÃ©partements avec leur performance
4. Un pied de page avec "Confidentiel â€” Usage interne â€” GÃ©nÃ©rÃ© automatiquement par Antigravity"
\`\`\`

---

## ðŸ’» Script final â€” Rapport de Direction

\`\`\`python
# ============================================================
# rapport_direction.py â€” Rapport final TechAlgÃ©rie SARL
# ============================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, PieChart, Reference
from openpyxl.chart.label import DataLabelList
from datetime import datetime

wb = openpyxl.load_workbook("TechAlgerie_Maitre.xlsx")

# Supprimer si la feuille existe dÃ©jÃ  (re-gÃ©nÃ©ration)
if "Rapport_Direction" in wb.sheetnames:
    del wb["Rapport_Direction"]

ws_rapport = wb.create_sheet("Rapport_Direction", 0)  # InsÃ©rer en PREMIER

# â”€â”€ Couleurs du rapport officiel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
BLEU_MARINE   = "0D1B4B"   # Fond en-tÃªte principal
BLEU_SECTION  = "1565C0"   # Fond titres de sections
GRIS_CLAIR    = "F5F5F5"   # Fond lignes paires
VERT_POSITIF  = "E8F5E9"   # Fond indicateurs positifs
ROUGE_NEGATIF = "FFEBEE"   # Fond indicateurs nÃ©gatifs
OR_ACCENT     = "FFD700"   # Accent dorÃ© pour les highlights

FORMAT_DZD = '#,##0 "DZD"'
FORMAT_PCT = '0.0"%"'

# â”€â”€ PAGE DE GARDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Fusionner A1:J1 pour l'en-tÃªte
for r in range(1, 6):
    for c in range(1, 11):
        cell = ws_rapport.cell(row=r, column=c)
        cell.fill = PatternFill(start_color=BLEU_MARINE, end_color=BLEU_MARINE, fill_type="solid")

ws_rapport.merge_cells("A1:J2")
ws_rapport["A1"] = "RAPPORT DE DIRECTION â€” TechAlgÃ©rie SARL"
ws_rapport["A1"].font = Font(bold=True, size=20, color="FFFFFF", name="Calibri")
ws_rapport["A1"].alignment = Alignment(horizontal="center", vertical="center")
ws_rapport.row_dimensions[1].height = 40
ws_rapport.row_dimensions[2].height = 10

ws_rapport.merge_cells("A3:J4")
date_str = datetime.now().strftime("%d %B %Y").upper()
ws_rapport["A3"] = f"RAPPORT TRIMESTRIEL T4 2024 â€” PrÃ©parÃ© le {date_str}"
ws_rapport["A3"].font = Font(size=12, color="BBBBBB", italic=True)
ws_rapport["A3"].alignment = Alignment(horizontal="center", vertical="center")
ws_rapport.row_dimensions[3].height = 30

ws_rapport.merge_cells("A5:J5")
ws_rapport["A5"] = "ðŸ”’ CONFIDENTIEL â€” USAGE INTERNE EXCLUSIF â€” GÃ©nÃ©rÃ© par Google Antigravity"
ws_rapport["A5"].font = Font(size=10, color="FF6B6B", bold=True)
ws_rapport["A5"].alignment = Alignment(horizontal="center")
ws_rapport.row_dimensions[5].height = 25

# Ligne de sÃ©paration
for c in range(1, 11):
    ws_rapport.cell(row=6, column=c).fill = PatternFill(
        start_color=OR_ACCENT, end_color=OR_ACCENT, fill_type="solid"
    )
ws_rapport.row_dimensions[6].height = 4

# â”€â”€ SECTION 1 : KPIs CLÃ‰S â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def titre_section(ws, ligne, texte, couleur=BLEU_SECTION):
    ws.merge_cells(f"A{ligne}:J{ligne}")
    cell = ws.cell(row=ligne, column=1)
    cell.value = texte
    cell.font = Font(bold=True, size=13, color="FFFFFF")
    cell.fill = PatternFill(start_color=couleur, end_color=couleur, fill_type="solid")
    cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[ligne].height = 30

titre_section(ws_rapport, 7, "ðŸ“Š  INDICATEURS CLÃ‰S DE PERFORMANCE (KPI)")

# DonnÃ©es KPI Ã  afficher
kpis_rapport = [
    ("Chiffre d'Affaires Annuel",     2487000, "DZD",  "+12% vs 2023", "2E7D32"),
    ("BÃ©nÃ©fice Net",                  572000,  "DZD",  "+18% vs 2023", "1565C0"),
    ("Marge Nette",                   23.0,    "%",    "Objectif : 25%","0277BD"),
    ("EmployÃ©s Actifs",               47,      "",     "5 recrutements prÃ©vus", "4A148C"),
    ("Stock Total (rÃ©fÃ©rences)",      523,     "",     "3 alertes rupture", "E65100"),
    ("Satisfaction Clients",          4.2,     "/5",   "Objectif : 4.5", "006064"),
]

ligne_kpi = 8
for idx, (libelle, valeur, unite, commentaire, couleur) in enumerate(kpis_rapport):
    ligne = ligne_kpi + idx
    
    # Fond alternÃ©
    fond = GRIS_CLAIR if idx % 2 == 0 else "FFFFFF"
    
    # LibellÃ©
    cell_lib = ws_rapport.cell(row=ligne, column=1)
    cell_lib.value = f"  {libelle}"
    cell_lib.font = Font(bold=True, size=11, color="333333")
    cell_lib.fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    ws_rapport.merge_cells(f"A{ligne}:D{ligne}")
    
    # Valeur
    cell_val = ws_rapport.cell(row=ligne, column=5)
    if unite == "DZD":
        cell_val.value = valeur
        cell_val.number_format = FORMAT_DZD
    elif unite == "%":
        cell_val.value = f"{valeur}%"
    else:
        cell_val.value = f"{valeur} {unite}".strip()
    cell_val.font = Font(bold=True, size=14, color=couleur)
    cell_val.fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    cell_val.alignment = Alignment(horizontal="center")
    ws_rapport.merge_cells(f"E{ligne}:G{ligne}")
    
    # Commentaire/Ã©volution
    cell_com = ws_rapport.cell(row=ligne, column=8)
    cell_com.value = f"  {commentaire}"
    cell_com.font = Font(italic=True, size=10, color="666666")
    cell_com.fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    ws_rapport.merge_cells(f"H{ligne}:J{ligne}")
    
    ws_rapport.row_dimensions[ligne].height = 28

# â”€â”€ SECTION 2 : RÃ‰SULTATS FINANCIERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ligne_fin = ligne_kpi + len(kpis_rapport) + 1
titre_section(ws_rapport, ligne_fin, "ðŸ’°  RÃ‰SULTATS FINANCIERS â€” Exercice 2024")

# Mini tableau P&L
pl_data = [
    ("Total Revenus",         2487000, VERT_POSITIF, "2E7D32"),
    ("  Ventes MatÃ©riel",     1960000, "FFFFFF",      "555555"),
    ("  Prestations",          430000, "FFFFFF",      "555555"),
    ("  Maintenance",           97000, "FFFFFF",      "555555"),
    ("Total Charges",         1915000, ROUGE_NEGATIF, "C62828"),
    ("  Salaires",            1173000, "FFFFFF",      "555555"),
    ("  Achats",               550000, "FFFFFF",      "555555"),
    ("  Loyer & Frais",        192000, "FFFFFF",      "555555"),
    ("BÃ‰NÃ‰FICE NET",           572000, "1A237E",      "FFFFFF"),
]

for idx, (cat, montant, fond, couleur) in enumerate(pl_data):
    ligne = ligne_fin + 1 + idx
    
    cell_cat = ws_rapport.cell(row=ligne, column=1)
    cell_cat.value = cat
    cell_cat.font = Font(bold=cat.startswith(("Total", "BÃ‰N")), size=11, color=couleur)
    cell_cat.fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    ws_rapport.merge_cells(f"A{ligne}:G{ligne}")
    
    cell_mont = ws_rapport.cell(row=ligne, column=8)
    cell_mont.value = montant
    cell_mont.number_format = FORMAT_DZD
    cell_mont.font = Font(bold=True, size=11, color=couleur)
    cell_mont.fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    cell_mont.alignment = Alignment(horizontal="right")
    ws_rapport.merge_cells(f"H{ligne}:J{ligne}")
    
    ws_rapport.row_dimensions[ligne].height = 22

# â”€â”€ SECTION 3 : RH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ligne_rh = ligne_fin + len(pl_data) + 2
titre_section(ws_rapport, ligne_rh, "ðŸ‘¥  CAPITAL HUMAIN", "4A148C")

rh_stats = [
    ("Effectif total", "47 employÃ©s", "5 DÃ©partements"),
    ("Masse salariale brute/mois", "3 247 000 DZD", "soit 39 M DZD/an"),
    ("Salaire moyen", "69 085 DZD/mois", "MÃ©diane : 63 000 DZD"),
    ("Taux de prÃ©sence", "94.8%", "AbsentÃ©isme : 5.2%"),
    ("Recrutements prÃ©vus Q1 2025", "5 postes", "Technique (3) + Commercial (2)"),
]

for idx, (lib, val, complement) in enumerate(rh_stats):
    ligne = ligne_rh + 1 + idx
    fond = "F3E5F5" if idx % 2 == 0 else "FFFFFF"
    
    ws_rapport.cell(row=ligne, column=1).value = f"  {lib}"
    ws_rapport.cell(row=ligne, column=1).font = Font(bold=True, size=11)
    ws_rapport.cell(row=ligne, column=1).fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    ws_rapport.merge_cells(f"A{ligne}:E{ligne}")
    
    ws_rapport.cell(row=ligne, column=6).value = val
    ws_rapport.cell(row=ligne, column=6).font = Font(bold=True, size=12, color="4A148C")
    ws_rapport.cell(row=ligne, column=6).fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    ws_rapport.merge_cells(f"F{ligne}:G{ligne}")
    
    ws_rapport.cell(row=ligne, column=8).value = complement
    ws_rapport.cell(row=ligne, column=8).font = Font(italic=True, size=10, color="888888")
    ws_rapport.cell(row=ligne, column=8).fill = PatternFill(start_color=fond, end_color=fond, fill_type="solid")
    ws_rapport.merge_cells(f"H{ligne}:J{ligne}")
    
    ws_rapport.row_dimensions[ligne].height = 24

# â”€â”€ GRAPHIQUE : RÃ©partition du CA par catÃ©gorie â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Zone de donnÃ©es pour le graphique camembert
ligne_graph_data = ligne_rh + len(rh_stats) + 3
ws_rapport.cell(row=ligne_graph_data, column=1).value = "DonnÃ©es graphique"
ws_rapport.cell(row=ligne_graph_data, column=1).font = Font(color="FFFFFF")  # Invisible

categories_ca = [
    ("Ventes MatÃ©riel",  1960000),
    ("Prestations",       430000),
    ("Maintenance",        97000),
]
for idx, (cat, val) in enumerate(categories_ca):
    ws_rapport.cell(row=ligne_graph_data + 1 + idx, column=1).value = cat
    ws_rapport.cell(row=ligne_graph_data + 1 + idx, column=2).value = val
    ws_rapport.cell(row=ligne_graph_data + 1 + idx, column=1).font = Font(color="F5F5F5")
    ws_rapport.cell(row=ligne_graph_data + 1 + idx, column=2).font = Font(color="F5F5F5")

# CrÃ©er le graphique camembert
pie = PieChart()
pie.title = "RÃ©partition du CA par ActivitÃ©"
pie.style = 10
data_pie = Reference(ws_rapport, min_col=2, min_row=ligne_graph_data + 1,
                      max_row=ligne_graph_data + 3)
labels_pie = Reference(ws_rapport, min_col=1, min_row=ligne_graph_data + 1,
                        max_row=ligne_graph_data + 3)
pie.add_data(data_pie)
pie.set_categories(labels_pie)
pie.width = 14
pie.height = 10

# Ajouter le graphique dans le rapport
ws_rapport.add_chart(pie, f"E{ligne_rh + len(rh_stats) + 2}")

# â”€â”€ PIED DE PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ligne_footer = ligne_graph_data + 8
ws_rapport.merge_cells(f"A{ligne_footer}:J{ligne_footer}")
ws_rapport[f"A{ligne_footer}"] = "Document gÃ©nÃ©rÃ© automatiquement par Python & Google Antigravity â€” TechAlgÃ©rie SARL Â© 2024 â€” Confidentiel"
ws_rapport[f"A{ligne_footer}"].font = Font(italic=True, size=9, color="AAAAAA")
ws_rapport[f"A{ligne_footer}"].alignment = Alignment(horizontal="center")

# â”€â”€ Ajuster les largeurs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
for col_num in range(1, 11):
    ws_rapport.column_dimensions[get_column_letter(col_num)].width = 14

# â”€â”€ Masquer le quadrillage pour un look propre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ws_rapport.sheet_view.showGridLines = False

# â”€â”€ Sauvegarder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
wb.save("TechAlgerie_Rapport_Final.xlsx")
print("âœ… Rapport de Direction gÃ©nÃ©rÃ© avec succÃ¨s !")
print("ðŸ“„ Fichier : TechAlgerie_Rapport_Final.xlsx")
print("ðŸ“‹ Contenu : Page de garde, 6 KPIs, P&L, RH, Graphique camembert")
\`\`\`

---

## ðŸŽ“ FÃ©licitations ! Formation TerminÃ©e

Vous avez construit **from scratch** un systÃ¨me complet de pilotage d'entreprise avec Python et Google Antigravity. Voici ce que vous avez accompli :

| Module | Fichier Python | RÃ©sultat Excel |
|---|---|---|
| âœ… Initialisation | TechAlgerie_init.py | Feuilles & navigation |
| âœ… Dashboard KPIs | dashboard_kpi.py | 6 cartes + graphique barre |
| âœ… Finances P&L | finances_pl.py | Compte de rÃ©sultat complet |
| âœ… TrÃ©sorerie | finances_tresorerie.py | Flux mensuels + alertes |
| âœ… Inventaire | inventaire.py | 23 produits + alertes stock |
| âœ… Ressources Humaines | rh_employes.py | 47 employÃ©s + paie + congÃ©s |
| âœ… Rapport Direction | rapport_direction.py | Document PDF-ready |`
            },
            {
                lessonId: lesson6.id,
                type: 'CALLOUT',
                order: 2,
                content: JSON.stringify({
                    type: 'success',
                    title: 'ðŸŽ“ Formation ComplÃ¨te â€” Certificat de RÃ©ussite',
                    body: '**Vous maÃ®trisez maintenant :**\n\nâœ… Google Antigravity pour gÃ©nÃ©rer du code Python en langage naturel\nâœ… openpyxl pour manipuler Excel par programmation\nâœ… CrÃ©ation de dashboards KPI professionnels\nâœ… Rapports financiers (P&L, trÃ©sorerie) automatisÃ©s\nâœ… Gestion d\'inventaire avec alertes intelligentes\nâœ… Fichiers RH complets avec calcul de paie\nâœ… Rapports de direction consolidÃ©s avec graphiques\n\nðŸš€ **Prochaine Ã©tape** : Adaptez ces scripts Ã  vos donnÃ©es rÃ©elles d\'entreprise !'
                })
            },
        ]
    })
    console.log(`  âœ… LeÃ§on 6 crÃ©Ã©e`)

    console.log('\nðŸŽ‰ Seed terminÃ© avec succÃ¨s !')
    console.log(`ðŸ“š Cours : "${course.title}"`)
    console.log(`ðŸ”— Slug  : ${slug}`)
    console.log(`ðŸ“– 6 leÃ§ons crÃ©Ã©es`)
}

main()
    .catch((e) => {
        console.error('âŒ Erreur lors du seed :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


