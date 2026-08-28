/*
 * Script d'enrichissement ultra-complet pour l'intégralité des 14 leçons de la formation
 * "Python pour automatiser Excel & Word" sur elsayf.click
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

function codetutor(title, code, steps) {
    return {
        contentType: 'text',
        title: 'Démonstration animée pas à pas',
        content: '```codetutor\n' + JSON.stringify({ title, code, steps }) + '\n```',
    };
}

function txt(title, markdown) {
    return { contentType: 'text', title, content: markdown };
}

function codeBlock(title, code) {
    return { contentType: 'code', title, content: code };
}

function excelgen(config) {
    return {
        contentType: 'text',
        title: '⚡ Atelier Tableur Excel Interactif (Live Generator)',
        content: '```excelgenerator\n' + JSON.stringify(config) + '\n```'
    };
}

// ==============================================================================
// CONTENU EXHAUSTIF POUR CHACUNE DES 14 LEÇONS
// ==============================================================================
const ALL_LESSON_DATA = {

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 1 : Introduction : Pourquoi automatiser Excel & Word ?
    // ──────────────────────────────────────────────────────────────────────────
    "Introduction : Pourquoi automatiser Excel & Word ?": [
        txt("Le défi des entreprises modernes & le coût du travail manuel", `
### ⏱️ Le problème du "Copy-Paste" en entreprise

Dans la majorité des entreprises, les employés passent entre **10 et 20 heures par semaine** à répéter les mêmes gestes sur Microsoft Office :
- Ouvrir 5 à 10 fichiers Excel différents reçus par email ou extraits d'un ERP.
- Copier-coller des colonnes de données dans un tableau récapitulatif.
- Recalculer manuellement des totaux, des remises, des taux de TVA.
- Créer un document Word (facture, contrat, rapport de synthèse) pour chaque client.
- Exporter en PDF et l'envoyer un par un.

> 🛑 **Le risque humain :** Fatigue, oublis de cellules, erreurs de saisie, formules décalées, retards de livraison.
>
> ⚡ **La solution Python :** Un script de 50 lignes effectue cette corvée en **moins de 5 secondes**, avec **zéro erreur**, 24h/24 et 7j/7.

---

### 📊 Tableau comparatif : Humain vs Script Python

| Critère | Travail Manuel | Script Python Automatisé |
|---|---|---|
| **Traitement de 500 factures** | 12 heures | **15 secondes** |
| **Taux d'erreur** | 2% à 5% (humain) | **0% (100% fiable)** |
| **Coût récurrent** | Salaire horaire répété | **0 DZD après écriture** |
| **Capacité de traitement** | ~50 lignes/minute | **100 000 lignes/seconde** |
| **Exécution nocturne** | Impossible | **Automatique (Task Scheduler)** |
        `),

        codetutor(
            "Exemple de Pipeline Automatisé en 15 lignes",
            `import openpyxl
from docx import Document

# 1. Lire la base de ventes
classeur = openpyxl.load_workbook('ventes.xlsx')
feuille = classeur.active
total_ca = sum(cell.value for cell in feuille['C2:C50'] if cell.value)

# 2. Rédiger le rapport Word
doc = Document()
doc.add_heading('Rapport Mensuel d\\'Activité', level=0)
doc.add_paragraph(f'Chiffre d\\'Affaires Global : {total_ca:,.2f} DZD')
doc.save('rapport_direction.docx')

print(f'Rapport généré avec succès ! Total : {total_ca:,.2f} DZD')`,
            [
                { line: 1, explanation: "Importation du module openpyxl pour manipuler les fichiers Excel.", variables: {} },
                { line: 2, explanation: "Importation de python-docx pour créer et formater des documents Word.", variables: {} },
                { line: 5, explanation: "Ouverture du classeur Excel en mémoire sans avoir besoin de lancer Microsoft Excel.", variables: { classeur: "ventes.xlsx" } },
                { line: 6, explanation: "Sélection de la feuille active principale.", variables: { feuille: "Feuil1" } },
                { line: 7, explanation: "Calcul instantané de la somme de 50 lignes de chiffre d'affaires.", variables: { total_ca: 2450000.0 } },
                { line: 10, explanation: "Création d'un document Word vierge en mémoire.", variables: { doc: "Document" } },
                { line: 11, explanation: "Ajout d'un titre de niveau 0 stylisé.", variables: { titre: "Rapport Mensuel d'Activité" } },
                { line: 12, explanation: "Ajout du paragraphe avec le montant formaté.", variables: { paragraphe: "Total : 2,450,000.00 DZD" } },
                { line: 13, explanation: "Sauvegarde du document Word sur le disque.", variables: { fichier: "rapport_direction.docx" } },
                { line: 15, explanation: "Message de succès dans la console.", variables: {}, console: "Rapport généré avec succès ! Total : 2,450,000.00 DZD" }
            ]
        ),

        txt("L'Écosystème Python pour la Bureautique", `
### 🛠️ Les 4 bibliothèques reines que vous allez maîtriser :

1. **\`openpyxl\`** : La référence universelle pour créer, lire, styliser et insérer des formules dans des fichiers \`.xlsx\`.
2. **\`pandas\`** : Le moteur de données le plus puissant au monde pour filtrer, fusionner, nettoyer et agréger des millions de lignes.
3. **\`python-docx\`** : Pour créer des rapports, devis, lettres et contrats Word \`.docx\` personnalisés avec en-têtes et logos.
4. **\`pywin32 (win32com)\`** : Le pont direct avec les applications Microsoft Windows pour convertir en PDF natif et exécuter des macros.
        `),

        excelgen({
            template: "facture",
            title: "Aperçu Direct : Ce que vous serez capable de générer en Python"
        }),

        txt("Votre plan d'action pour cette formation", `
1. **Module 1 (Leçons 1 à 2) :** Fondations & Environnement de développement.
2. **Module 2 (Leçons 3 à 6) :** Maîtrise d'Excel (Création, Lecture, Styles, Formules avancées).
3. **Module 3 (Leçon 7) :** Analyse de données massives & Pandas.
4. **Module 4 (Leçons 8 à 9) :** Automatisation Word & Publipostage en masse.
5. **Module 5 (Leçons 10 à 14) :** Pilotage Windows, Projets complets & Pipeline de production.
        `)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 2 : Installer Python et préparer son environnement
    // ──────────────────────────────────────────────────────────────────────────
    "Installer Python et préparer son environnement": [
        txt("Guide d'installation pas à pas", `
### 📥 Étape 1 : Installer Python 3.11+ sur votre ordinateur

1. Rendez-vous sur le site officiel : **[python.org/downloads](https://www.python.org/downloads/)**
2. Téléchargez l'installateur Windows (ou Mac/Linux).
3. ⚠️ **ATTENTION CRUCIALE (Windows) :** Cochez impérativement la case **"Add Python to PATH"** en bas avant de cliquer sur "Install Now".

---

### 💻 Étape 2 : Vérifier l'installation dans votre terminal

Ouvrez **PowerShell** ou **Invite de commandes** et tapez :
\`\`\`bash
python --version
# Doit répondre : Python 3.11.x ou supérieur

pip --version
# Vérifie que le gestionnaire de paquets est opérationnel
\`\`\`
        `),

        codeBlock("Installation des bibliothèques nécessaires en 1 seule commande", `# Commande à copier dans votre terminal :
pip install openpyxl pandas python-docx pywin32 xlsxwriter requests

# Si vous êtes sur Mac ou Linux (sans pywin32) :
pip install openpyxl pandas python-docx xlsxwriter requests`),

        codetutor(
            "Script de diagnostic automatique de votre environnement",
            `import sys

packages = ["openpyxl", "pandas", "docx"]
print(f"Version de Python : {sys.version.split()[0]}")

for pkg in packages:
    try:
        __import__(pkg)
        print(f"✅ Module '{pkg}' installe et pret !")
    except ImportError:
        print(f"❌ Module '{pkg}' MANQUANT. Faites: pip install {pkg}")

print("Diagnostic termine !")`,
            [
                { line: 1, explanation: "Import du module système standard sys.", variables: {} },
                { line: 3, explanation: "Liste des modules indispensables à vérifier.", variables: { packages: ["openpyxl", "pandas", "docx"] } },
                { line: 4, explanation: "Affichage de la version exacte de Python.", variables: {}, console: "Version de Python : 3.11.8" },
                { line: 6, explanation: "Début de la boucle de test pour chaque bibliothèque.", variables: { pkg: "openpyxl" } },
                { line: 8, explanation: "openpyxl est présent et prêt à l'emploi.", variables: {}, console: "✅ Module 'openpyxl' installe et pret !" },
                { line: 8, explanation: "pandas est présent et prêt à l'emploi.", variables: {}, console: "✅ Module 'pandas' installe et pret !" },
                { line: 8, explanation: "python-docx est présent et prêt à l'emploi.", variables: {}, console: "✅ Module 'docx' installe et pret !" },
                { line: 12, explanation: "Fin du diagnostic, votre PC est 100% prêt pour la formation.", variables: {}, console: "Diagnostic termine !" }
            ]
        ),

        txt("Bonnes pratiques : Éditeur VS Code & Environnements virtuels", `
### 💡 Éditeur recommandé : Visual Studio Code (VS Code)

Nous vous conseillons d'installer **VS Code** avec l'extension **Python (Microsoft)**.
Elle vous offrira :
- L'autocomplétion intelligente (IntelliSense) pour les méthodes openpyxl.
- La détection d'erreurs en direct.
- L'exécution de vos scripts en 1 clic sur le bouton Play (▶).

> 🌐 **Rappel El Sayf :** Sur notre plateforme, vous disposez également d'un **environnement Python interactif complet intégré**, vous permettant de coder et tester sans même rien installer sur votre PC !
        `)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 3 : Créer son premier fichier Excel avec openpyxl
    // ──────────────────────────────────────────────────────────────────────────
    "Créer son premier fichier Excel avec openpyxl": [
        txt("Comprendre l'anatomie d'un classeur Excel en Python", `
### 🏗️ L'architecture d'un fichier Excel avec openpyxl

Lorsque vous manipulez un fichier Excel en Python, vous interagissez avec 3 niveaux hiérarchiques :
1. **\`Workbook\` (Classeur)** : Le fichier global qui regroupe toutes les feuilles.
2. **\`Worksheet\` (Feuille)** : La grille à 2 dimensions (ex: "Ventes_2026", "Clients").
3. **\`Cell\` (Cellule)** : L'unité de base accessible par ses coordonnées (ex: \`A1\`, \`C5\`) ou par index \`cell(row=5, column=3)\`.

\`\`\`python
import openpyxl

wb = openpyxl.Workbook()      # 1. Classeur
ws = wb.active                 # 2. Feuille active
ws.title = "Donnees"          # Renommer la feuille
ws['A1'] = "Bonjour le monde" # 3. Cellule
wb.save("test.xlsx")          # Enregistrement
\`\`\`
        `),

        excelgen({
            template: "libre",
            title: "Atelier Pratique : Créez et téléchargez votre 1er classeur Excel"
        }),

        codetutor(
            "Remplissage rapide par liste de tuples",
            `import openpyxl

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Catalogue"

# En-têtes
ws.append(["ID", "Produit", "Stock", "Prix Unit."])

# Données sous forme de liste de tuples
produits = [
    (101, "Clavier Mecanique", 45, 8500),
    (102, "Souris Sans Fil", 120, 3200),
    (103, "Ecran 27 pouces", 18, 42000),
]

for p in produits:
    ws.append(list(p))

wb.save("catalogue_produits.xlsx")
print("Catalogue généré avec succès !")`,
            [
                { line: 1, explanation: "Importation d'openpyxl.", variables: {} },
                { line: 3, explanation: "Création d'un nouveau classeur vierge.", variables: { wb: "Workbook" } },
                { line: 4, explanation: "Sélection de la feuille par défaut.", variables: { ws: "Worksheet" } },
                { line: 5, explanation: "Renommage de la feuille en 'Catalogue'.", variables: { "ws.title": "Catalogue" } },
                { line: 8, explanation: "La méthode .append() insère une ligne complète d'en-têtes en une seule instruction.", variables: {} },
                { line: 11, explanation: "Définition d'une liste de tuples contenant les enregistrements métier.", variables: { nb_produits: 3 } },
                { line: 17, explanation: "Boucle d'insertion : chaque produit est ajouté à la ligne suivante.", variables: { p: (101, "Clavier Mecanique", 45, 8500) } },
                { line: 20, explanation: "Sauvegarde du fichier physique sur le disque.", variables: { fichier: "catalogue_produits.xlsx" } },
                { line: 21, explanation: "Confirmation d'exécution.", variables: {}, console: "Catalogue généré avec succès !" }
            ]
        ),

        txt("Techniques avancées de navigation dans les cellules", `
### 🔍 2 façons d'adresser les cellules :

1. **Par notation Excel standard (Lettre/Chiffre) :**
   \`\`\`python
   ws['B2'] = "Valeur"
   print(ws['B2'].value)
   \`\`\`

2. **Par notation ligne/colonne (Numérique 1-indexé) :**
   Idéal pour parcourir des données avec des boucles \`for\` :
   \`\`\`python
   for r in range(1, 10):
       for c in range(1, 5):
           ws.cell(row=r, column=c, value=f"L{r}C{c}")
   \`\`\`

> 💡 **Astuce de pro :** Utilisez \`get_column_letter(col_index)\` du sous-module \`openpyxl.utils\` pour convertir un numéro de colonne en lettre (ex: \`1 -> 'A'\`, \`27 -> 'AA'\`).
        `)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 4 : Lire et explorer un fichier Excel existant
    // ──────────────────────────────────────────────────────────────────────────
    "Lire et explorer un fichier Excel existant": [
        txt("Ouvrir et analyser un fichier existant", `
### 📖 La méthode \`load_workbook()\`

Dans la vie réelle, vous recevez souvent des fichiers Excel déjà créés qu'il faut analyser, filtrer ou mettre à jour.

\`\`\`python
import openpyxl

# Ouvrir un fichier existant
wb = openpyxl.load_workbook('ventes_annuelles.xlsx', data_only=True)

# Afficher les noms de tous les onglets
print("Feuilles disponibles :", wb.sheetnames)

# Sélectionner un onglet précis
ws = wb['Janvier']

# Obtenir les dimensions réelles du tableau
print(f"Nombre de lignes : {ws.max_row}")
print(f"Nombre de colonnes : {ws.max_column}")
\`\`\`

> ⚠️ **Le paramètre \`data_only=True\` :**
> - Si \`data_only=False\` (défaut) : \`cell.value\` renvoie la formule sous forme de texte (ex: \`"=SUM(A1:A10)"\`).
> - Si \`data_only=True\` : \`cell.value\` renvoie la **valeur calculée** en cache par Excel (ex: \`15000\`).
        `),

        codetutor(
            "Parcourir et extraire les données en dictionnaires",
            `import openpyxl

wb = openpyxl.load_workbook('donnees.xlsx')
ws = wb.active

# 1. Récupérer la première ligne comme clés
entetes = [cell.value for cell in ws[1]]

# 2. Convertir toutes les lignes en liste de dictionnaires
clients = []
for ligne in ws.iter_rows(min_row=2, values_only=True):
    if ligne[0] is not None:  # Ignorer lignes vides
        client_dict = dict(zip(entetes, ligne))
        clients.append(client_dict)

print(f"{len(clients)} clients charges avec succes !")
print("Exemple premier client :", clients[0])`,
            [
                { line: 1, explanation: "Importation du module openpyxl.", variables: {} },
                { line: 3, explanation: "Ouverture du classeur existant.", variables: { wb: "donnees.xlsx" } },
                { line: 4, explanation: "Sélection de la feuille active.", variables: { ws: "active" } },
                { line: 7, explanation: "Compréhension de liste pour capturer tous les noms de colonnes de la ligne 1.", variables: { entetes: ["ID", "Nom", "Email", "CA"] } },
                { line: 10, explanation: "Initialisation de la liste qui stockera les objets clients structurés.", variables: { clients: [] } },
                { line: 11, explanation: "iter_rows(min_row=2, values_only=True) parcourt les lignes sans charger d'objets Cell lourds.", variables: {} },
                { line: 13, explanation: "zip(entetes, ligne) associe chaque colonne à sa valeur pour créer un dict propre.", variables: { client_dict: { ID: 1, Nom: "Amine", CA: 150000 } } },
                { line: 16, explanation: "Affichage du bilan d'extraction.", variables: { total: 150 }, console: "150 clients charges avec succes !" }
            ]
        ),

        txt("Filtrer et agréger des données Excel en Python", `
### 🎯 Cas réel : Trouver tous les clients ayant dépassé un seuil de CA

Une fois vos données chargées dans une liste de dictionnaires, vous bénéficiez de toute la puissance des filtres Python :

\`\`\`python
# Filtrer les clients VIP (> 1 000 000 DZD)
clients_vip = [c for c in clients if c['CA'] >= 1000000]

# Calculer le CA total
ca_total = sum(c['CA'] for c in clients)

# Trouver le meilleur client
top_client = max(clients, key=lambda c: c['CA'])
print(f"Top client : {top_client['Nom']} avec {top_client['CA']:,} DZD")
\`\`\`
        `)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 5 : Mise en forme et styles dans Excel
    // ──────────────────────────────────────────────────────────────────────────
    "Mise en forme et styles dans Excel": [
        txt("Maîtriser les styles professionnels d'openpyxl", `
### 🎨 Pourquoi la mise en forme est capitale

Un document Excel brut sans couleur, sans alignement et avec des colonnes tronquées ne donne pas confiance.
Avec \`openpyxl.styles\`, vous pouvez appliquer une charte graphique digne d'un cabinet d'audit :

1. **Polices & Typographies** : \`Font(name="Segoe UI", size=11, bold=True, color="1E3A8A")\`
2. **Couleurs de remplissage** : \`PatternFill(start_color="0F766E", fill_type="solid")\`
3. **Alignement** : \`Alignment(horizontal="center", vertical="center", wrap_text=True)\`
4. **Bordures** : \`Border(left=thin, right=thin, top=thin, bottom=double)\`
5. **Formats monétaires & pourcentages** : \`cell.number_format = '#,##0.00 DZD'\`
        `),

        excelgen({
            template: "facture",
            title: "Cas Pratique : Facture B2B Haute Définition avec En-têtes Bleu Marine"
        }),

        codetutor(
            "Styliser un tableau et ajuster automatiquement la largeur des colonnes",
            `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Rapport"

# Style En-tête
bleu_sombre = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
texte_blanc = Font(name="Calibri", size=11, bold=True, color="FFFFFF")

headers = ["Code", "Description Prestation", "Montant HT"]
for col_idx, h in enumerate(headers, 1):
    c = ws.cell(row=1, column=col_idx, value=h)
    c.fill = bleu_sombre
    c.font = texte_blanc
    c.alignment = Alignment(horizontal="center")

# Ajustement automatique des largeurs de colonnes (Auto-Fit)
for col in ws.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

wb.save("rapport_stylise.xlsx")
print("Rapport stylisé et colonnes ajustées !")`,
            [
                { line: 1, explanation: "Importation des composants graphiques openpyxl.", variables: {} },
                { line: 9, explanation: "Création du fond bleu sombre pour les en-têtes.", variables: { bleu_sombre: "PatternFill(1E3A8A)" } },
                { line: 10, explanation: "Création de la police blanche en gras.", variables: { texte_blanc: "Font(bold=True, FFFFFF)" } },
                { line: 13, explanation: "Application des styles sur chaque cellule d'en-tête.", variables: { h: "Code" } },
                { line: 20, explanation: "Parcours de toutes les colonnes pour calculer la longueur maximale du texte.", variables: {} },
                { line: 22, explanation: "Application d'une largeur proportionnelle avec marge de sécurité (+4).", variables: { col_letter: "B", width: 26 } },
                { line: 24, explanation: "Sauvegarde du fichier.", variables: { fichier: "rapport_stylise.xlsx" } },
                { line: 25, explanation: "Confirmation d'exécution.", variables: {}, console: "Rapport stylisé et colonnes ajustées !" }
            ]
        )
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 6 : Formules et calculs automatiques
    // ──────────────────────────────────────────────────────────────────────────
    "Formules et calculs automatiques": [
        txt("Insérer des formules Excel dynamiques", `
### 🧮 Pourquoi insérer des formules plutôt que des chiffres figés ?

Insérer une formule Excel (\`=SUM(D2:D10)\`) permet à l'utilisateur final de modifier un chiffre dans Excel et de voir l'ensemble des totaux se recalculer instantanément.

> ⚠️ **Règle fondamentale :**
> Toutes les formules écrites avec \`openpyxl\` doivent utiliser les **noms de fonctions officiels en ANGLAIS** (\`SUM\`, \`AVERAGE\`, \`IF\`, \`COUNTIF\`, \`VLOOKUP\`), quelle que soit la langue de votre logiciel Excel.
        `),

        excelgen({
            template: "kpi",
            title: "Cas Pratique 1 : Dashboard KPIs Ventes avec Formules IF & Ratios %"
        }),

        excelgen({
            template: "paie",
            title: "Cas Pratique 2 : Grille de Paie avec Cotisations Sociales & Retenues"
        }),

        txt("Guide des formules indispensables en entreprise", `
| Objectif | Formule Excel à écrire en Python | Exemple d'utilisation |
|---|---|---|
| **Somme d'une colonne** | \`=SUM(C2:C50)\` | \`ws['C51'] = f"=SUM(C2:C{last_row})"\` |
| **Moyenne** | \`=AVERAGE(D2:D50)\` | \`ws['D52'] = "=AVERAGE(D2:D50)"\` |
| **Condition SI simple** | \`=IF(E2>=100, "OK", "RETARD")\` | \`ws.cell(row=r, column=6, value=f'=IF(E{r}>=100, "OK", "RETARD")')\` |
| **Calcul de TVA** | \`=D10*0.19\` | \`ws['D11'] = "=D10*0.19"\` |
| **Total TTC** | \`=D10+D11\` | \`ws['D12'] = "=D10+D11"\` |
| **Compter selon critère** | \`=COUNTIF(F2:F50, "URGENT")\` | \`ws['B55'] = '=COUNTIF(F2:F50, "URGENT")'\` |
        `)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 7 : Analyse de données Excel avec pandas
    // ──────────────────────────────────────────────────────────────────────────
    "Analyse de données Excel avec pandas": [
        txt("Pandas : Le moteur turbo pour les gros volumes Excel", `
### 🐼 Quand utiliser Pandas plutôt qu'openpyxl ?

- **openpyxl** est parfait pour le design, les formules, les bordures et les présentations soignées.
- **pandas** est conçu pour charger des fichiers de **100 000 à 1 000 000 de lignes**, filtrer, grouper (\`groupby\`), créer des Tableaux Croisés Dynamiques (TCD) et fusionner des fichiers en millisecondes.

---

### 🚀 Le flux de travail professionnel combiné :
1. **Pandas** extrait et calcule les statistiques et agrégations.
2. **OpenPyXL** prend le relais pour appliquer la charte graphique et générer le document final.
        `),

        excelgen({
            template: "stock",
            title: "Cas Réel 1 : Inventaire & Détection Automatique des Ruptures de Stock"
        }),

        excelgen({
            template: "datacleaning",
            title: "Cas Réel 2 : Pipeline de Nettoyage de Données Clients (Data Cleaning)"
        }),

        codetutor(
            "Tableau Croisé Dynamique (Pivot Table) avec Pandas et Export Excel",
            `import pandas as pd

# 1. Charger des ventes brutes
df = pd.DataFrame({
    'Region': ['Alger', 'Oran', 'Alger', 'Constantine', 'Oran', 'Alger'],
    'Produit': ['Ordinateur', 'Imprimante', 'Ordinateur', 'Serveur', 'Ordinateur', 'Ecran'],
    'Chiffre_Affaires': [120000, 45000, 180000, 320000, 95000, 35000]
})

# 2. Créer un Tableau Croisé Dynamique : CA total par Région et Produit
tcd = df.pivot_table(index='Region', columns='Produit', values='Chiffre_Affaires', aggfunc='sum', fill_value=0)

# 3. Export direct vers Excel
tcd.to_excel('synthese_tcd.xlsx')
print("Tableau croisé dynamique exporté avec succès !")`,
            [
                { line: 1, explanation: "Import de la bibliothèque pandas.", variables: {} },
                { line: 4, explanation: "Création d'un DataFrame de test simulant un export ERP de ventes.", variables: { lignes: 6 } },
                { line: 11, explanation: "pivot_table() crée un TCD : Régions en lignes, Produits en colonnes, somme du CA.", variables: { tcd: "PivotTable" } },
                { line: 14, explanation: "to_excel() enregistre le tableau croisé dans un fichier .xlsx.", variables: { fichier: "synthese_tcd.xlsx" } },
                { line: 15, explanation: "Succès de l'opération.", variables: {}, console: "Tableau croisé dynamique exporté avec succès !" }
            ]
        )
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 8 : Créer des documents Word avec python-docx
    // ──────────────────────────────────────────────────────────────────────────
    "Créer des documents Word avec python-docx": [
        txt("Introduction à python-docx", `
### 📄 Automatiser la création de documents Word (.docx)

Avec la bibliothèque **\`python-docx\`**, vous pouvez créer des documents Word de qualité professionnelle de zéro :
- Titres structurés de niveaux 0, 1, 2, 3...
- Paragraphes avec gras, italique, souligné, couleurs.
- Tableaux stylisés avec bordures et alignements.
- Insertion d'images (logos, graphiques de ventes).
- Sauts de page et sauts de section.
- En-têtes et pieds de page avec numérotation.
        `),

        codeBlock("Exemple complet de génération de document Word", `from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

# 1. Créer le document
doc = Document()

# 2. Titre principal
titre = doc.add_heading('Rapport Financier Annuel', level=0)
titre.alignment = WD_ALIGN_PARAGRAPH.CENTER

# 3. Paragraphe stylisé
p = doc.add_paragraph()
run1 = p.add_run("Ce document récapitule les performances de l'exercice ")
run2 = p.add_run("2026.")
run2.bold = True
run2.font.color.rgb = RGBColor(30, 58, 138)  # Bleu marine

# 4. Tableau structuré
table = doc.add_table(rows=1, cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
table.style = 'Light Shading Accent 1'

# En-têtes du tableau
hdr_cells = table.rows[0].cells
hdr_cells[0].text = "Département"
hdr_cells[1].text = "Objectif"
hdr_cells[2].text = "Réalisé (DZD)"

# Données
donnees = [
    ("Informatique", "100%", "4 500 000"),
    ("Marketing", "112%", "3 200 000"),
    ("Commercial", "95%", "8 900 000"),
]

for dep, obj, real in donnees:
    row_cells = table.add_row().cells
    row_cells[0].text = dep
    row_cells[1].text = obj
    row_cells[2].text = real

# 5. Sauvegarde
doc.save('rapport_financier.docx')
print("Document Word 'rapport_financier.docx' généré avec succès !")`),

        codetutor(
            "Personnalisation typographique avancée",
            `from docx import Document
from docx.shared import Pt, RGBColor

doc = Document()
p = doc.add_paragraph()

# Ajouter des runs (fragments de texte stylisés)
r1 = p.add_run("Statut du contrat : ")
r1.font.name = 'Arial'
r1.font.size = Pt(12)

r2 = p.add_run("VALIDÉ & SIGNÉ")
r2.bold = True
r2.font.color.rgb = RGBColor(16, 185, 129)  # Vert émeraude
r2.font.size = Pt(13)

doc.save("contrat_statut.docx")
print("Fichier généré avec texte bicolore !")`,
            [
                { line: 1, explanation: "Import des classes Document, Pt (points) et RGBColor.", variables: {} },
                { line: 4, explanation: "Création d'un document Word vierge.", variables: { doc: "Document" } },
                { line: 5, explanation: "Création d'un paragraphe.", variables: { p: "Paragraph" } },
                { line: 8, explanation: "Ajout du premier fragment de texte en police Arial 12pt.", variables: { r1: "Statut du contrat : " } },
                { line: 12, explanation: "Ajout du second fragment en gras, taille 13pt et couleur vert émeraude.", variables: { r2: "VALIDÉ & SIGNÉ" } },
                { line: 17, explanation: "Sauvegarde du document Word.", variables: { fichier: "contrat_statut.docx" } },
                { line: 18, explanation: "Confirmation d'exécution.", variables: {}, console: "Fichier généré avec texte bicolore !" }
            ]
        )
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 9 : Modèles Word et publipostage (mail merge)
    // ──────────────────────────────────────────────────────────────────────────
    "Modèles Word et publipostage (mail merge)": [
        txt("Le Publipostage Automatisé : 1 Modèle ➔ 100 Documents", `
### 💌 Le principe du Publipostage Python

Imaginez devoir générer **150 attestations de formation** ou **300 contrats de travail** personnalisés.
La méthode la plus rapide et la plus élégante consiste à :
1. Créer un **document Word modèle** (template) avec votre mise en page, logo et en-têtes officiels.
2. Placer des **balises de remplacement** dans le texte : \`{{NOM}}\`, \`{{DATE}}\`, \`{{MONTANT}}\`.
3. Utiliser un script Python qui lit le fichier Excel contenant la liste des personnes, remplace les balises et sauvegarde chaque document individuellement.

> ⏱️ **Gain de temps :** 300 contrats générés en **8 secondes** au lieu de 2 jours de travail manuel !
        `),

        codeBlock("Script complet de publipostage Excel ➔ Word", `import openpyxl
from docx import Document

# 1. Charger la liste des stagiaires depuis Excel
wb = openpyxl.load_workbook('liste_etudiants.xlsx')
ws = wb.active

etudiants = []
for row in ws.iter_rows(min_row=2, values_only=True):
    etudiants.append({
        'nom': row[0],
        'cours': row[1],
        'note': row[2],
        'date': row[3]
    })

# 2. Générer une attestation personnalisée pour chaque étudiant
for e in etudiants:
    doc = Document('modele_attestation.docx')  # Charger le modèle
    
    # Remplacer les balises dans tous les paragraphes
    for p in doc.paragraphs:
        if '{{NOM}}' in p.text:
            p.text = p.text.replace('{{NOM}}', e['nom'])
        if '{{COURS}}' in p.text:
            p.text = p.text.replace('{{COURS}}', e['cours'])
        if '{{DATE}}' in p.text:
            p.text = p.text.replace('{{DATE}}', str(e['date']))
            
    # Sauvegarde individuelle
    nom_fichier = f"Attestation_{e['nom'].replace(' ', '_')}.docx"
    doc.save(nom_fichier)
    print(f"✅ Généré : {nom_fichier}")

print(f"🎉 Total : {len(etudiants)} attestations générées avec succès !")`),

        codetutor(
            "Remplacement robuste dans les tableaux Word",
            `from docx import Document

def remplacer_dans_document(doc, variables):
    # 1. Parcourir les paragraphes simples
    for p in doc.paragraphs:
        for cle, val in variables.items():
            if cle in p.text:
                p.text = p.text.replace(cle, str(val))
                
    # 2. Parcourir les cellules de tableaux
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for cle, val in variables.items():
                    if cle in cell.text:
                        cell.text = cell.text.replace(cle, str(val))

doc = Document()
doc.add_paragraph("Bonjour {{NOM}}, votre solde est de {{SOLDE}} DZD.")
remplacer_dans_document(doc, {"{{NOM}}": "Karim", "{{SOLDE}}": "45000"})
doc.save("resultat_test.docx")
print("Remplacement terminé avec succès !")`,
            [
                { line: 1, explanation: "Importation du module Document de python-docx.", variables: {} },
                { line: 3, explanation: "Définition d'une fonction réutilisable pour inspecter tout le document.", variables: {} },
                { line: 5, explanation: "Remplacement dans le corps de texte standard.", variables: {} },
                { line: 11, explanation: "Inspection de l'intérieur de tous les tableaux pour ne manquer aucune balise.", variables: {} },
                { line: 18, explanation: "Création d'un paragraphe test avec 2 balises.", variables: { text: "Bonjour {{NOM}}..." } },
                { line: 19, explanation: "Exécution de la fonction avec le dictionnaire de valeurs.", variables: { "{{NOM}}": "Karim", "{{SOLDE}}": "45000" } },
                { line: 20, explanation: "Sauvegarde du fichier final propre.", variables: { fichier: "resultat_test.docx" } },
                { line: 21, explanation: "Succès.", variables: {}, console: "Remplacement terminé avec succès !" }
            ]
        )
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 10 : Piloter Excel et Word directement avec win32com
    // ──────────────────────────────────────────────────────────────────────────
    "Piloter Excel et Word directement avec win32com": [
        txt("Le pilotage direct sous Windows (COM Automation)", `
### 🎛️ Qu'est-ce que win32com ?

Sur le système d'exploitation Windows, Microsoft Office expose une interface de contrôle à distance appelée **COM (Component Object Model)**.
Avec la bibliothèque **\`pywin32\`**, Python peut ouvrir l'application Microsoft Word ou Excel en tâche de fond, lui donner des ordres et utiliser les moteurs officiels de conversion.

---

### 🌟 Les super-pouvoirs de win32com :
1. **Conversion Word ➔ PDF native** : Rendu graphique 100% fidèle avec les polices exactes du système.
2. **Conversion Excel ➔ PDF** : Impression PDF parfaite de feuilles ou de zones d'impression sélectionnées.
3. **Exécution de macros VBA existantes** : Déclencher des macros complexes sans ouvrir Office à l'écran.
4. **Actualisation des connexions de données & Power Query**.
        `),

        codeBlock("Convertir un document Word en PDF avec win32com", `import win32com.client
import os

def word_vers_pdf(chemin_docx, chemin_pdf):
    # Initialiser l'application Word en arrière-plan
    word = win32com.client.DispatchEx("Word.Application")
    word.Visible = False
    
    try:
        # Convertir les chemins relatifs en chemins absolus
        abs_docx = os.path.abspath(chemin_docx)
        abs_pdf = os.path.abspath(chemin_pdf)
        
        # Ouvrir le document Word
        doc = word.Documents.Open(abs_docx)
        
        # Format 17 = wdFormatPDF dans l'API Microsoft
        doc.SaveAs(abs_pdf, FileFormat=17)
        doc.Close()
        print(f"✅ PDF généré avec succès : {abs_pdf}")
    finally:
        # Toujours quitter Word proprement pour libérer la RAM
        word.Quit()

# Exemple d'appel
# word_vers_pdf('facture.docx', 'facture.pdf')`),

        txt("Alternative Multiplateforme (Linux / Mac / VPS) : LibreOffice CLI", `
### 🐧 Comment convertir en PDF sur Linux / Docker / Cloud ?

Sur un serveur Linux ou un VPS où Microsoft Office n'existe pas, on utilise **LibreOffice en ligne de commande** via le module Python \`subprocess\` :

\`\`\`python
import subprocess

def docx_to_pdf_libreoffice(fichier_docx):
    commande = [
        "libreoffice",
        "--headless",
        "--convert-to", "pdf",
        fichier_docx
    ]
    subprocess.run(commande, check=True)
    print(f"✅ Converti en PDF via LibreOffice : {fichier_docx.replace('.docx', '.pdf')}")
\`\`\`
        `)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 11 : Projet : Pipeline complet Excel → Word → PDF
    // ──────────────────────────────────────────────────────────────────────────
    "Projet : Pipeline complet Excel → Word → PDF": [
        txt("Le Projet Fil Rouge : De la Donnée Brute au PDF Final", `
### 🏆 Le Scénario Réel d'Entreprise

Vous travaillez pour une société de distribution. Chaque fin de mois :
1. Un fichier Excel brut \`ventes_brutes.xlsx\` est extrait de la base de données.
2. Votre script Python charge et nettoie les données avec **Pandas**.
3. Il calcule le chiffre d'affaires, la TVA, les remises et les performances par représentant.
4. Il génère un classeur Excel consolidé stylisé avec **OpenPyXL**.
5. Il génère un rapport de synthèse officiel avec tableaux et graphiques dans **Word**.
6. Il convertit le rapport en **PDF haute définition**.
7. Le rapport est prêt à être expédié automatiquement à la direction générale !
        `),

        excelgen({
            template: "multifeuille",
            title: "Étape 1 du Projet : Classeur Multi-Feuilles Consolidé"
        }),

        codeBlock("Architecture complète du Pipeline (main.py)", `import os
import openpyxl
import pandas as pd
from docx import Document
from docx.shared import Inches, Pt, RGBColor

def etape1_traitement_excel():
    print("📊 [Étape 1/3] Traitement des données Excel...")
    wb = openpyxl.load_workbook('ventes_mensuelles.xlsx', data_only=True)
    ws = wb.active
    
    total_ca = sum(row[3] for row in ws.iter_rows(min_row=2, values_only=True) if row[3])
    nb_ventes = ws.max_row - 1
    return total_ca, nb_ventes

def etape2_generation_word(total_ca, nb_ventes):
    print("📄 [Étape 2/3] Rédaction du rapport Word officiel...")
    doc = Document()
    
    # En-tête
    h = doc.add_heading('RAPPORT D\\'ACTIVITÉ MENSUEL', 0)
    
    p = doc.add_paragraph()
    p.add_run(f"Période : Exercice en cours\\n").bold = True
    p.add_run(f"Nombre total de transactions : {nb_ventes}\\n")
    p.add_run(f"Chiffre d'Affaires Global : {total_ca:,.2f} DZD\\n").bold = True
    
    doc.save('Rapport_Direction.docx')
    print("✅ Fichier 'Rapport_Direction.docx' créé.")

def executer_pipeline():
    print("🚀 Démarrage du pipeline d'automatisation...")
    ca, nb = etape1_traitement_excel()
    etape2_generation_word(ca, nb)
    print("🎉 Pipeline exécuté avec succès en 1.2 seconde !")

if __name__ == '__main__':
    executer_pipeline()`)
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 12 : Automatiser la planification (tâches programmées)
    // ──────────────────────────────────────────────────────────────────────────
    "Automatiser la planification (tâches programmées)": [
        txt("Exécuter vos scripts sans aucune intervention humaine", `
### ⏰ Pourquoi planifier vos scripts ?

Le but ultime de l'automatisation est que vous n'ayez **même plus besoin de cliquer sur un bouton**.
Votre script doit s'exécuter chaque lundi matin à 7h00 ou chaque dernier jour du mois à 23h59 de manière totalement autonome.

---

### 🖥️ Méthode 1 : Le Planificateur de Tâches Windows (Task Scheduler)

1. Appuyez sur la touche \`Windows + R\`, tapez \`taskschd.msc\` et validez.
2. Cliquez sur **"Créer une tâche de base"**.
3. Donnez un nom : *"Génération Rapports Mensuels El Sayf"*.
4. Déclencheur : *Tous les mois* ou *Toutes les semaines*.
5. Action : *Démarrer un programme* :
   - **Programme/script :** \`C:\\Python311\\python.exe\` (ou chemin de votre environnement)
   - **Ajouter des arguments :** \`main_pipeline.py\`
   - **Commencer dans :** \`C:\\MonEntreprise\\Scripts\\\`
        `),

        codetutor(
            "Mise en place d'un système de Journalisation (Logs de Production)",
            `import logging
import datetime

# Configuration du fichier de log
logging.basicConfig(
    filename='automatisation.log',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] : %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logging.info("🚀 Démarrage du script programmé...")

try:
    # Simulation du travail d'automatisation
    logging.info("Lecture du fichier Excel...")
    logging.info("Génération de 45 factures PDF...")
    logging.info("✅ Tâche terminée avec succès.")
except Exception as e:
    logging.error(f"❌ Erreur critique : {str(e)}")

print("Logs enregistrés dans 'automatisation.log'")`,
            [
                { line: 1, explanation: "Import du module standard logging.", variables: {} },
                { line: 5, explanation: "Configuration du journal : nom de fichier, niveau INFO et horodatage précis.", variables: { fichier: "automatisation.log" } },
                { line: 12, explanation: "Enregistrement de la trace de démarrage.", variables: {}, console: "" },
                { line: 16, explanation: "Journalisation de chaque étape du pipeline.", variables: {} },
                { line: 18, explanation: "Trace de succès avec 45 factures créées.", variables: {} },
                { line: 20, explanation: "Capture automatique de toute erreur imprévue.", variables: {} },
                { line: 23, explanation: "Fin du script.", variables: {}, console: "Logs enregistrés dans 'automatisation.log'" }
            ]
        )
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 13 : Conclusion et prochaines étapes
    // ──────────────────────────────────────────────────────────────────────────
    "Conclusion et prochaines étapes": [
        txt("Félicitations pour votre parcours !", `
### 🎓 Vous êtes désormais un Professionnel de l'Automatisation Python !

Vous disposez maintenant d'un avantage concurrentiel majeur sur le marché du travail :
- Vous savez créer des fichiers Excel professionnels de A à Z sans ouvrir Excel.
- Vous maîtrisez la mise en page, les formules anglaises et les couleurs d'entreprise.
- Vous manipulez des volumes massifs de données avec **Pandas**.
- Vous générez des documents Word et des contrats personnalisés en masse.
- Vous construisez des pipelines de production complets et automatisés.

---

### 🚀 10 Idées de Projets Immédiats à déployer dans votre entreprise :

1. **Générateur de Devis / Factures B2B** connecté à votre base de données.
2. **Rapport de Synthèse RH** : Suivi des congés et de la paie mensuelle.
3. **Tableau de Bord Commercial Hebdomadaire** avec graphiques et KPIs.
4. **Système d'Alerte de Rupture de Stock** avec envoi d'email automatique.
5. **Générateur d'Attestations de Travail / Certificats** pour les employés.
6. **Robot de Rapprochement Bancaire** comparant relevés et écritures comptables.
7. **Nettoyeur de Données CRM** supprimant les doublons et corrigeant les numéros.
8. **Pipeline de Consolidation Multi-Magasins** fusionnant 20 classeurs Excel.
9. **Générateur de Catalogues Produits** au format Word et PDF.
10. **Planificateur Nocturne de Sauvegardes** et d'exports automatisés.
        `),

        excelgen({
            template: "datacleaning",
            title: "Dernier Atelier Récapitulatif : Pipeline de Nettoyage et Validation"
        })
    ],

    // ──────────────────────────────────────────────────────────────────────────
    // LEÇON 14 : TP : Générer un vrai fichier Excel avec Python
    // ──────────────────────────────────────────────────────────────────────────
    "TP : Générer un vrai fichier Excel avec Python": [
        txt("Objectif du Grand Atelier Pratique Final", `
### 🏆 Bienvenue dans l'Atelier Pratique Intégral !

Cet atelier regroupe l'ensemble des **7 cas d'usage réels d'entreprise** :
1. 🧾 **Facture Professionnelle B2B & TVA 19%**
2. 📊 **Dashboard Commercial & KPIs avec Formules Conditionnelles**
3. 📦 **Gestion de Stock & Alertes de Réapprovisionnement**
4. 💰 **Fiche de Paie & Salaires avec Cotisations Sociales**
5. 📈 **Consolidation Multi-Feuilles (3 Onglets avec Formules Croisées)**
6. 🧹 **Nettoyage et Standardisation de Données Clients (Data Cleaning)**
7. ⚡ **Atelier Libre (Sandbox)** pour concevoir vos propres scripts.

> 🛠️ **Instructions :**
> Choisissez un cas d'usage parmi les boutons ci-dessous, inspectez le code Python, modifiez les données ou les formules, cliquez sur **« Exécuter & Générer l'Excel »** pour voir le résultat dans le tableur en direct et **téléchargez le fichier .xlsx réel** !
        `),

        excelgen({
            template: "facture",
            title: "Grand Atelier Interactif : 7 Modèles Pratiques d'Automatisation"
        }),

        txt("5 Défis Pratiques à réaliser dans cet atelier", `
### 🧪 Pour valider votre maîtrise complète :

1. **Défi Facturation :** Modifiez le taux de TVA de 19% à 9% et ajoutez une prestation *"Conseil en Stratégie Cloud"* à 95 000 DZD avec 5% de remise.
2. **Défi KPIs :** Dans le modèle Dashboard, ajoutez un nouveau commercial pour la région *"Tlemcen"* avec un objectif de 900 000 DZD et un réalisé de 1 150 000 DZD.
3. **Défi Stock :** Changez le seuil critique pour que l'ordinateur portable passe en statut \`🚨 COMMANDE REQUISE\`.
4. **Défi Multi-Feuilles :** Ajoutez une 4ème feuille *"Mars_2026"* et intégrez son chiffre d'affaires dans la formule de synthèse trimestrielle.
5. **Défi Data Cleaning :** Ajoutez une fonction pour masquer les adresses email (ex: \`a***e@gmail.com\`) pour respecter les règles de confidentialité RGPD.
        `)
    ]
};

async function withRetry(fn, maxRetries = 6, delayMs = 3000) {
    let lastErr;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;
            console.log(`⚠️ Tentative ${attempt}/${maxRetries} échouée, nouvelle tentative dans ${delayMs / 1000}s...`);
            await sleep(delayMs);
        }
    }
    throw lastErr;
}

async function main() {
    console.log('🚀 Démarrage de la mise à niveau exhaustive de toutes les leçons...');

    const course = await withRetry(async () => {
        return await prisma.course.findUnique({
            where: { slug: SLUG },
            include: { lessons: { orderBy: { order: 'asc' } } }
        });
    });

    if (!course) {
        console.error('❌ Cours introuvable avec le slug :', SLUG);
        return;
    }

    console.log(`📚 Cours trouvé : "${course.title}" (${course.lessons.length} leçons)`);

    for (const lesson of course.lessons) {
        const lessonTitle = lesson.title.trim();
        const contentBlocks = ALL_LESSON_DATA[lessonTitle];

        if (contentBlocks && contentBlocks.length > 0) {
            console.log(`\n🔄 Mise à jour de la Leçon #${lesson.order} : "${lessonTitle}" (${contentBlocks.length} blocs)...`);
            
            // Supprimer les anciens blocs de contenu
            await withRetry(async () => {
                await prisma.courseContent.deleteMany({
                    where: { lessonId: lesson.id }
                });
            });

            // Insérer les nouveaux blocs enrichis
            for (let i = 0; i < contentBlocks.length; i++) {
                const block = contentBlocks[i];
                await withRetry(async () => {
                    await prisma.courseContent.create({
                        data: {
                            lessonId: lesson.id,
                            title: block.title,
                            contentType: block.contentType,
                            content: block.content,
                            order: i + 1
                        }
                    });
                });
            }
            console.log(`✅ Leçon #${lesson.order} enrichie avec succès !`);
        } else {
            console.log(`ℹ️ Leçon #${lesson.order} "${lessonTitle}" conservée sans modification.`);
        }
    }

    console.log('\n🎉 TOUTES LES SECTIONS DU COURS ONT ÉTÉ ENRICHIES AVEC SUCCÈS !');
}

main()
    .catch(e => {
        console.error('❌ Erreur lors de l\'enrichissement :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
