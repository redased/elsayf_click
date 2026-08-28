/**
 * MEGA-ENRICHISSEMENT : Ajout de contenu supplémentaire ultra-détaillé
 * pour chaque leçon de la formation "Python pour automatiser Excel & Word"
 * 
 * Stratégie : On AJOUTE des blocs (on ne remplace pas ce qui existe déjà)
 * Chaque leçon reçoit :
 *   - Quiz de validation des acquis
 *   - Erreurs classiques & solutions
 *   - Exercice pratique corrigé
 *   - Astuce Pro
 *   - Cas métier algérien concret
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function withRetry(fn, retries = 5, delay = 3000) {
    let err;
    for (let i = 1; i <= retries; i++) {
        try { return await fn(); }
        catch (e) { err = e; console.log(`⚠️ Retry ${i}/${retries}...`); await sleep(delay); }
    }
    throw err;
}

function txt(title, content) { return { contentType: 'text', title, content }; }
function codeBlock(title, content) { return { contentType: 'code', title, content }; }
function excelgen(config) {
    return { contentType: 'text', title: '⚡ Atelier Pratique Interactif', content: '```excelgenerator\n' + JSON.stringify(config) + '\n```' };
}
function codetutor(title, code, steps) {
    return { contentType: 'text', title: '🎬 Démonstration Animée', content: '```codetutor\n' + JSON.stringify({ title, code, steps }) + '\n```' };
}

// ============================================================
// BLOCS SUPPLÉMENTAIRES À AJOUTER PAR LEÇON
// ============================================================
const EXTRA_BLOCKS = {

    // ─────────────── LEÇON 1 : Introduction ────────────────
    "Introduction : Pourquoi automatiser Excel & Word ?": [
        txt("🇩🇿 Cas Réel Algérien : La Société d'Import-Export", `
### 🏭 Contexte

**SARL Maghreb Distribution**, société d'import-export basée à Alger, gère 800 articles fournisseurs. Chaque semaine, un assistant passe 3 jours à :
- Mettre à jour les prix en DZD selon le cours EUR/USD du jour.
- Générer les bon de commandes pour 15 fournisseurs différents.
- Envoyer les récapitulatifs au service comptable par email.

**Avec Python, le même travail prend 45 secondes :**

\`\`\`python
import openpyxl, requests

# 1. Récupérer le taux EUR/DZD du jour via API
taux = requests.get("https://api.exchangerate-api.com/v4/latest/EUR").json()['rates']['DZD']

# 2. Mettre à jour toutes les cellules de prix
wb = openpyxl.load_workbook('catalogue_fournisseur.xlsx')
ws = wb.active
for row in ws.iter_rows(min_row=2, values_only=False):
    if row[2].value:  # Colonne C = Prix EUR
        row[3].value = round(row[2].value * taux, 2)  # Colonne D = Prix DZD

wb.save('catalogue_mis_a_jour.xlsx')
print(f"✅ {ws.max_row - 1} prix mis à jour au taux : {taux:.2f} DZD/EUR")
\`\`\`

> **Économie estimée :** 3 jours de travail/semaine × 48 semaines = **144 jours économisés par an** sur ce seul script.
        `),

        txt("❌ Erreurs Classiques à Éviter en Automatisation", `
### 🚨 Les 5 pièges les plus fréquents pour les débutants

| Erreur Classique | Ce qui se passe | La Solution Correcte |
|---|---|---|
| Oublier \`wb.save()\` | Le fichier ne s'enregistre jamais | Toujours appeler \`.save()\` à la fin |
| Chemin de fichier relatif | \`FileNotFoundError\` sur d'autres machines | Utiliser \`os.path.abspath()\` |
| Modifier un fichier ouvert dans Excel | \`PermissionError\` | Fermer Excel avant d'exécuter le script |
| Données \`None\` non filtrées | \`TypeError\` sur l'opération | Toujours tester \`if row[i].value is not None:\` |
| Encoding des caractères | Caractères arabes ou accentués cassés | Sauvegarder le script en **UTF-8** et utiliser \`encoding='utf-8'\` |

---

### 🛡️ Astuce Pro : Gestion d'erreurs professionnelle

\`\`\`python
import openpyxl
import os

def traiter_fichier_securise(nom_fichier):
    chemin_absolu = os.path.abspath(nom_fichier)
    
    if not os.path.exists(chemin_absolu):
        print(f"❌ Fichier introuvable : {chemin_absolu}")
        return False
    
    try:
        wb = openpyxl.load_workbook(chemin_absolu)
        ws = wb.active
        print(f"✅ Fichier ouvert : {ws.max_row} lignes, {ws.max_column} colonnes")
        # ... traitement ...
        wb.save(chemin_absolu.replace('.xlsx', '_traite.xlsx'))
        return True
    except PermissionError:
        print("❌ Fichier utilisé par un autre programme (Excel ouvert ?)")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue : {e}")
        return False

traiter_fichier_securise('ventes.xlsx')
\`\`\`
        `),

        txt("📝 Quiz de Validation — Leçon 1", `
### 🧠 Testez vos connaissances

**Question 1 :** Quel est l'avantage principal d'automatiser avec Python plutôt que les macros Excel VBA ?
- A) Python est plus rapide à taper
- B) ✅ Python fonctionne sur Mac, Linux, serveurs cloud et sans Excel installé
- C) Python coûte moins cher
- D) Les macros VBA sont trop compliquées

**Question 2 :** Si votre script doit traiter 10 000 factures par mois, quelle bibliothèque sera la plus appropriée pour le chargement massif des données ?
- A) \`python-docx\`
- B) \`win32com\`
- C) ✅ \`pandas\` (optimisé pour les gros volumes)
- D) \`openpyxl\` seul (convient mieux pour les fichiers individuels)

**Question 3 :** Quel est le bon ordre d'un pipeline bureautique complet ?
- A) Word → Excel → PDF
- B) ✅ **Données brutes → Pandas (nettoyage) → OpenPyXL (mise en forme) → python-docx (rapport) → PDF**
- C) PDF → Excel → Word
- D) Peu importe l'ordre
        `)
    ],

    // ─────────────── LEÇON 2 : Installation ────────────────
    "Installer Python et préparer son environnement": [
        txt("🇩🇿 Configurer son Environnement en Algérie (Proxy, Pip lent...)", `
### 🌐 Problèmes fréquents en Algérie et leurs solutions

**Problème 1 : pip install très lent ou timeout**
Utilisez un miroir PyPI plus proche géographiquement :
\`\`\`bash
# Utiliser le miroir Douban (rapide depuis l'Afrique du Nord)
pip install openpyxl -i https://pypi.doubanio.com/simple/

# Ou installer en mode hors ligne après téléchargement
pip download openpyxl -d ./packages
pip install --no-index --find-links ./packages openpyxl
\`\`\`

**Problème 2 : Erreur SSL Certificate sur les réseaux d'entreprise**
\`\`\`bash
pip install openpyxl --trusted-host pypi.org --trusted-host files.pythonhosted.org
\`\`\`

**Problème 3 : Plusieurs versions Python cohabitent**
\`\`\`bash
# Vérifier quelle version est utilisée par défaut
where python
py -0  # Liste toutes les versions Python installées sur Windows

# Forcer l'utilisation de Python 3.11 spécifiquement
py -3.11 -m pip install openpyxl
\`\`\`
        `),

        txt("💡 Environnements Virtuels : La Bonne Pratique Professionnelle", `
### 🐍 Pourquoi créer un environnement virtuel ?

Un **environnement virtuel** (venv) isole les bibliothèques de votre projet de celles du système Python global. Cela évite les conflits de versions entre projets.

\`\`\`bash
# 1. Créer l'environnement dans le dossier du projet
cd MonProjetExcel
python -m venv .venv

# 2. Activer l'environnement (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# 3. Activer l'environnement (Windows CMD)
.venv\\Scripts\\activate.bat

# 4. Maintenant installer les bibliothèques (elles resteront locales au projet)
pip install openpyxl pandas python-docx xlsxwriter

# 5. Générer un fichier requirements.txt pour partager le projet
pip freeze > requirements.txt

# 6. Sur une autre machine, restaurer l'environnement en 1 commande :
pip install -r requirements.txt
\`\`\`

> 💼 **Bonne pratique pro :** Toujours créer un \`requirements.txt\`. Vos collègues pourront reproduire votre environnement exact en une commande.
        `),

        txt("📝 Quiz — Leçon 2", `
### 🧠 Testez vos connaissances

**Question 1 :** Que fait la commande \`pip freeze > requirements.txt\` ?
- A) Supprime toutes les bibliothèques installées
- B) ✅ Génère un fichier listant toutes les bibliothèques et leurs versions exactes
- C) Installe les bibliothèques depuis un fichier
- D) Met à jour pip

**Question 2 :** Après avoir installé Python, vous tapez \`python\` dans le terminal et obtenez "commande introuvable". Quelle est la cause probable ?
- A) Python est cassé, il faut le réinstaller
- B) ✅ La case "Add Python to PATH" n'a pas été cochée lors de l'installation
- C) Il faut redémarrer l'ordinateur
- D) Python ne s'installe pas sur Windows

**Question 3 :** Quelle commande vérifie que \`openpyxl\` est correctement installé ?
- A) \`pip verify openpyxl\`
- B) \`python check openpyxl\`
- C) ✅ \`python -c "import openpyxl; print(openpyxl.__version__)"\`
- D) \`openpyxl --version\`
        `)
    ],

    // ─────────────── LEÇON 3 : Créer son premier Excel ────────────────
    "Créer son premier fichier Excel avec openpyxl": [
        txt("🇩🇿 Exercice Guidé Corrigé : Tableau de Bord d'une Épicerie Algérienne", `
### 🛒 Énoncé

Vous gérez une épicerie à Bab El Oued. Créez un fichier Excel \`stock_epicerie.xlsx\` avec :
- Un onglet nommé \`"Produits_Ramadan"\`
- Des en-têtes : **Référence | Produit | Unité | Stock | Prix Achat (DZD) | Prix Vente (DZD) | Marge**
- 5 produits typiques avec leurs données
- La colonne **Marge** calculée par formule \`=F-E\`
- La largeur des colonnes ajustée automatiquement

### ✅ Correction Complète

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Produits_Ramadan"

# En-têtes
headers = ["Référence", "Produit", "Unité", "Stock", "Prix Achat (DZD)", "Prix Vente (DZD)", "Marge (DZD)"]
couleur_hdr = PatternFill(start_color="0D6832", end_color="0D6832", fill_type="solid")
font_hdr = Font(name="Calibri", bold=True, color="FFFFFF")

for c_idx, h in enumerate(headers, 1):
    cell = ws.cell(row=1, column=c_idx, value=h)
    cell.fill = couleur_hdr
    cell.font = font_hdr
    cell.alignment = Alignment(horizontal="center")

# Données produits
produits = [
    ("PRD-001", "Huile de Table 5L", "Bidon", 120, 780, 990),
    ("PRD-002", "Semoule Fin 1Kg", "Sachet", 500, 85, 110),
    ("PRD-003", "Sucre Cristallisé 5Kg", "Sac", 200, 460, 580),
    ("PRD-004", "Lentilles Rouges 1Kg", "Sachet", 300, 230, 290),
    ("PRD-005", "Concentré de Tomates 800g", "Boîte", 180, 155, 200),
]

for r_idx, (ref, prod, unite, stock, pa, pv) in enumerate(produits, 2):
    ws.cell(row=r_idx, column=1, value=ref)
    ws.cell(row=r_idx, column=2, value=prod)
    ws.cell(row=r_idx, column=3, value=unite).alignment = Alignment(horizontal="center")
    ws.cell(row=r_idx, column=4, value=stock).alignment = Alignment(horizontal="center")
    ws.cell(row=r_idx, column=5, value=pa).number_format = '#,##0'
    ws.cell(row=r_idx, column=6, value=pv).number_format = '#,##0'
    # Formule Marge = Prix Vente - Prix Achat
    c_marge = ws.cell(row=r_idx, column=7, value=f"=F{r_idx}-E{r_idx}")
    c_marge.number_format = '#,##0'
    c_marge.font = Font(bold=True, color="0D6832")

# Auto-ajustement des colonnes
for col in ws.columns:
    max_len = max((len(str(cell.value or '')) for cell in col), default=0)
    ws.column_dimensions[get_column_letter(col[0].column)].width = max_len + 4

wb.save("stock_epicerie.xlsx")
print("✅ Fichier généré avec", len(produits), "produits et formules de marge !")
\`\`\`
        `),

        excelgen({ template: "libre", title: "🧪 Pratiquez : Recréez votre propre tableau de stock personnalisé" }),

        txt("📝 Quiz — Leçon 3", `
### 🧠 Vrai ou Faux + QCM

**Question 1 :** La méthode \`ws.append(['A', 'B', 'C'])\` insère une nouvelle ligne à la suite des données existantes.
- ✅ **VRAI** — \`.append()\` détecte automatiquement la prochaine ligne vide et y insère les données.

**Question 2 :** Pour accéder à la cellule de la 3ème ligne et 2ème colonne, on utilise :
- A) \`ws['C2']\`
- B) ✅ \`ws.cell(row=3, column=2)\`
- C) \`ws.get(3, 2)\`
- D) \`ws[3][2]\`

**Question 3 :** Quelle commande permet de donner un nom personnalisé à la feuille active ?
- A) \`ws.name = "MaFeuille"\`
- B) ✅ \`ws.title = "MaFeuille"\`
- C) \`wb.rename("MaFeuille")\`
- D) \`ws.set_name("MaFeuille")\`

**Question 4 (Bonus) :** Que retourne \`ws.max_row\` si le fichier ne contient que les en-têtes en ligne 1 ?
- ✅ \`1\` — \`max_row\` renvoie l'index de la dernière ligne contenant des données.
        `)
    ],

    // ─────────────── LEÇON 4 : Lire un Excel existant ────────────────
    "Lire et explorer un fichier Excel existant": [
        codetutor(
            "Lire un fichier Multi-Feuilles et Consolider les données",
            `import openpyxl

# Simuler une consolidation de 3 fichiers mensuels
wb = openpyxl.Workbook()
for mois, ventes in [("Janvier", [50000, 65000, 42000]),
                      ("Fevrier", [55000, 70000, 48000]),
                      ("Mars",    [60000, 80000, 52000])]:
    ws = wb.create_sheet(title=mois)
    ws['A1'] = "Commercial"
    ws['B1'] = "Ventes"
    for i, v in enumerate(ventes, 2):
        ws.cell(row=i, column=1, value=f"Rep-{i-1}")
        ws.cell(row=i, column=2, value=v)

wb.save("ventes_trimestrielles.xlsx")

# Maintenant on re-lit et on consolide
wb2 = openpyxl.load_workbook("ventes_trimestrielles.xlsx")
total_global = 0
for nom_feuille in wb2.sheetnames:
    ws2 = wb2[nom_feuille]
    total_mois = sum(ws2.cell(r, 2).value for r in range(2, ws2.max_row + 1))
    total_global += total_mois
    print(f"{nom_feuille} : {total_mois:,} DZD")
print(f"Total T1 : {total_global:,} DZD")`,
            [
                { line: 1, explanation: "Importation d'openpyxl pour créer et lire des classeurs.", variables: {} },
                { line: 4, explanation: "Création d'un classeur de démonstration avec 3 onglets mensuels.", variables: { wb: "Workbook" } },
                { line: 5, explanation: "Itération sur les 3 mois du trimestre pour créer chaque onglet.", variables: { mois: "Janvier", ventes: [50000, 65000, 42000] } },
                { line: 15, explanation: "Sauvegarde du classeur multi-onglets.", variables: { fichier: "ventes_trimestrielles.xlsx" } },
                { line: 18, explanation: "Réouverture du fichier pour simuler la lecture d'un fichier existant.", variables: {} },
                { line: 20, explanation: "Boucle sur tous les noms d'onglets du classeur.", variables: { nom_feuille: "Janvier" } },
                { line: 21, explanation: "Calcul du total de la colonne B pour l'onglet courant.", variables: { total_mois: 157000 } },
                { line: 23, explanation: "Affichage des résultats par mois.", variables: {}, console: "Janvier : 157,000 DZD\nFevrier : 173,000 DZD\nMars : 192,000 DZD\nTotal T1 : 522,000 DZD" }
            ]
        ),

        txt("🇩🇿 Cas Pratique : Analyse des Ventes d'une Pharmacie", `
### 💊 Scénario Réel : Pharmacie El Chifa, Constantine

La pharmacie reçoit chaque semaine un export Excel de son logiciel de caisse avec des milliers de lignes. Voici comment lire et analyser ces données rapidement :

\`\`\`python
import openpyxl
from collections import defaultdict

wb = openpyxl.load_workbook('export_caisse_semaine.xlsx', data_only=True)
ws = wb.active

# 1. Calculer les ventes par catégorie de médicament
ventes_par_categorie = defaultdict(float)
for row in ws.iter_rows(min_row=2, values_only=True):
    if row[0] and row[3] and row[4]:  # Code, Catégorie, Montant
        categorie = row[3]
        montant = float(row[4])
        ventes_par_categorie[categorie] += montant

# 2. Trier par chiffre d'affaires décroissant
classement = sorted(ventes_par_categorie.items(), key=lambda x: x[1], reverse=True)

# 3. Afficher le TOP 5
print("=== TOP 5 CATÉGORIES - SEMAINE EN COURS ===")
for rang, (cat, ca) in enumerate(classement[:5], 1):
    print(f"#{rang} {cat:25} → {ca:>12,.2f} DZD")

# 4. Créer un rapport de synthèse
wb_rapport = openpyxl.Workbook()
ws_rpt = wb_rapport.active
ws_rpt.title = "Synthese_Hebdo"
ws_rpt['A1'] = "Catégorie"
ws_rpt['B1'] = "CA Semaine (DZD)"
for cat, ca in classement:
    ws_rpt.append([cat, ca])
wb_rapport.save("rapport_hebdo_pharmacie.xlsx")
print("\\n✅ Rapport hebdomadaire généré !")
\`\`\`
        `),

        txt("📝 Quiz — Leçon 4", `
### 🧠 Questions

**Question 1 :** Quelle différence entre \`load_workbook('f.xlsx')\` et \`load_workbook('f.xlsx', data_only=True)\` ?
- A) Il n'y a aucune différence
- B) ✅ \`data_only=True\` retourne les valeurs calculées en cache plutôt que les formules texte
- C) \`data_only=True\` charge uniquement la première feuille
- D) \`data_only=True\` est plus rapide car il ne charge pas les styles

**Question 2 :** Pour obtenir la liste de toutes les feuilles d'un classeur, on utilise :
- A) \`wb.sheets\`
- B) \`wb.get_sheets()\`
- C) ✅ \`wb.sheetnames\`
- D) \`list(wb)\`

**Question 3 :** La méthode \`iter_rows(min_row=2, values_only=True)\` ignore la première ligne car :
- A) La première ligne est toujours vide
- B) openpyxl ne peut pas lire la ligne 1
- C) ✅ \`min_row=2\` permet d'ignorer les en-têtes et de ne traiter que les données
- D) C'est une erreur, on doit utiliser \`skip_header=True\`
        `)
    ],

    // ─────────────── LEÇON 5 : Styles Excel ────────────────
    "Mise en forme et styles dans Excel": [
        txt("🎨 Guide Complet des Couleurs et Palettes Professionnelles", `
### 🖌️ Choisir les bonnes couleurs pour vos rapports

Les codes couleurs hexadécimaux sont en format **RRGGBB** (6 chiffres sans le #) :

| Style | Code Hex | Cas d'usage |
|---|---|---|
| Bleu Corporate | \`1E3A8A\` | En-têtes officiels, banques, assurances |
| Vert Finance | \`065F46\` | Environnement, agriculture, profits |
| Orange Alerte | \`B45309\` | Avertissements, délais, expirations |
| Rouge Critique | \`991B1B\` | Erreurs, dépassements de budget |
| Gris Neutre | \`374151\` | Texte secondaire, totaux |
| Blanc Pur | \`FFFFFF\` | Texte sur fonds colorés |

---

### 🏆 Technique Avancée : Alternance de Couleurs de Lignes (Zebra Striping)

\`\`\`python
from openpyxl.styles import PatternFill

# Couleurs alternées pour meilleure lisibilité
bleu_pale = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
blanc = PatternFill(fill_type=None)  # Pas de couleur = blanc

for idx, row in enumerate(ws.iter_rows(min_row=2, max_row=ws.max_row), start=2):
    fill = bleu_pale if idx % 2 == 0 else blanc
    for cell in row:
        cell.fill = fill
\`\`\`

### 🔲 Mise en Forme Conditionnelle Manuelle (Openpyxl)

\`\`\`python
from openpyxl.styles import Font

# Rendre rouge les cellules dont la valeur < seuil
SEUIL_ALERTE = 500

for row in ws.iter_rows(min_row=2, max_row=ws.max_row):
    stock_cell = row[3]  # Colonne D = Stock
    if stock_cell.value and stock_cell.value < SEUIL_ALERTE:
        stock_cell.font = Font(color="DC2626", bold=True)  # Rouge vif
        row[0].font = Font(color="DC2626")  # Mettre aussi le nom en rouge
\`\`\`
        `),

        txt("🇩🇿 Cas Pratique : Rapport de Remboursement CNAS Stylisé", `
### 🏥 Contexte

Voici comment générer le rapport de remboursements CNAS d'une clinique avec le style officiel algérien (couleurs vert/blanc) :

\`\`\`python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

def creer_rapport_cnas(dossiers):
    """
    dossiers : liste de tuples (num_securite_sociale, nom, acte, montant_paye, remboursement)
    """
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Remboursements_CNAS"
    
    # En-tête institutionnel
    ws['A1'] = "CAISSE NATIONALE DES ASSURANCES SOCIALES"
    ws['A1'].font = Font(name="Calibri", size=14, bold=True, color="065F46")
    ws['A2'] = f"État de Remboursement — {len(dossiers)} Dossiers"
    ws['A2'].font = Font(name="Calibri", size=10, italic=True, color="374151")
    
    # En-têtes colonnes
    headers = ["N° Sécurité Sociale", "Assuré(e)", "Acte Médical", "Montant Payé (DZD)", "Remboursement CNAS (DZD)"]
    vert_cnas = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid")
    
    for c, h in enumerate(headers, 1):
        cell = ws.cell(row=4, column=c, value=h)
        cell.fill = vert_cnas
        cell.font = Font(bold=True, color="FFFFFF")
        cell.alignment = Alignment(horizontal="center")
    
    # Données
    for r, (nss, nom, acte, montant, remb) in enumerate(dossiers, 5):
        ws.cell(row=r, column=1, value=nss)
        ws.cell(row=r, column=2, value=nom).font = Font(bold=True)
        ws.cell(row=r, column=3, value=acte)
        ws.cell(row=r, column=4, value=montant).number_format = '#,##0.00'
        ws.cell(row=r, column=5, value=remb).number_format = '#,##0.00'
    
    # Total
    last = 4 + len(dossiers)
    ws.cell(row=last+1, column=4, value=f"=SUM(D5:D{last})").number_format = '#,##0.00'
    ws.cell(row=last+1, column=5, value=f"=SUM(E5:E{last})").number_format = '#,##0.00'
    
    wb.save("rapport_cnas.xlsx")
    print(f"✅ Rapport CNAS généré : {len(dossiers)} dossiers traités")

# Exemple d'appel
exemple_dossiers = [
    ("7831246500001", "BENALI Karim", "Consultation Cardiologue", 4500, 2700),
    ("6920374800012", "HADJ Fatima", "Radio Thorax", 2800, 2240),
    ("8012345700034", "MEZIANI Ahmed", "Analyse Biologique", 3600, 2880),
]
creer_rapport_cnas(exemple_dossiers)
\`\`\`
        `),

        txt("📝 Quiz — Leçon 5", `
### 🧠 Questions

**Question 1 :** Pour un fond noir avec texte blanc, quel est le bon style ?
- A) \`Font(color="000000"); Fill(start_color="FFFFFF")\`
- B) ✅ \`Font(color="FFFFFF"); PatternFill(start_color="000000", fill_type="solid")\`
- C) \`Font(color="WHITE"); Fill(color="BLACK")\`
- D) Les deux sont identiques

**Question 2 :** Quelle méthode permet d'ajuster automatiquement la largeur d'une colonne ?
- A) \`ws.autofit_columns()\`
- B) ✅ Calculer \`max(len(str(cell.value)) for cell in col)\` puis \`ws.column_dimensions[lettre].width = valeur\`
- C) \`ws.column_dimensions['A'].auto = True\`
- D) openpyxl ne peut pas ajuster automatiquement les colonnes

**Question 3 :** Le format de nombre \`'#,##0.00 DZD'\` affichera \`1234567.8\` comme :
- A) 1234567.8 DZD
- B) ✅ 1,234,567.80 DZD
- C) 1.234.567,80 DZD
- D) 1234568 DZD
        `)
    ],

    // ─────────────── LEÇON 6 : Formules ────────────────
    "Formules et calculs automatiques": [
        codetutor(
            "Facturation Automatisée avec Formules Excel Imbriquées",
            `import openpyxl
from openpyxl.styles import Font, PatternFill

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Facture_Mai_2026"

# Données
articles = [
    ("Formation Python 3 jours", 3, 25000, 0.0),
    ("Licence Logiciel Annuelle", 10, 8500, 0.05),
    ("Support Technique 30h", 30, 3200, 0.10),
]

# En-têtes
ws.append(["Prestation", "Qté", "Prix/U", "Remise", "Sous-Total HT"])

# Lignes
for r, (prest, qte, pu, rem) in enumerate(articles, 2):
    ws.cell(row=r, column=1, value=prest)
    ws.cell(row=r, column=2, value=qte)
    ws.cell(row=r, column=3, value=pu)
    ws.cell(row=r, column=4, value=rem).number_format = '0%'
    # Formule : Qté × PU × (1 - Remise)
    cell = ws.cell(row=r, column=5, value=f"=B{r}*C{r}*(1-D{r})")
    cell.number_format = '#,##0.00'

# Totaux
last = 1 + len(articles)
ws.cell(row=last+2, column=4, value="Total HT")
ws.cell(row=last+2, column=5, value=f"=SUM(E2:E{last})")
ws.cell(row=last+3, column=4, value="TVA 19%")
ws.cell(row=last+3, column=5, value=f"=E{last+2}*0.19")
ws.cell(row=last+4, column=4, value="NET TTC")
ws.cell(row=last+4, column=5, value=f"=E{last+2}+E{last+3}")

wb.save("facture_auto.xlsx")
print("Facture générée avec formules Excel dynamiques !")`,
            [
                { line: 1, explanation: "Importation des modules nécessaires.", variables: {} },
                { line: 5, explanation: "Création du classeur et renommage de la feuille.", variables: { ws: "Facture_Mai_2026" } },
                { line: 8, explanation: "Liste de prestations avec quantité, prix unitaire et remise.", variables: { articles: "3 prestations" } },
                { line: 14, explanation: "Insertion des en-têtes de colonnes.", variables: {} },
                { line: 17, explanation: "Boucle d'insertion : chaque prestation reçoit une formule de calcul.", variables: { prest: "Formation Python 3 jours" } },
                { line: 22, explanation: "Insertion de la formule B×C×(1-D) qui calcule le Sous-Total HT avec remise.", variables: { formule: "=B2*C2*(1-D2)", valeur: 75000 } },
                { line: 27, explanation: "Ligne Total HT : somme de tous les sous-totaux.", variables: { formule: "=SUM(E2:E4)" } },
                { line: 29, explanation: "TVA = Total HT × 19%.", variables: { formule: "=E6*0.19" } },
                { line: 31, explanation: "Net TTC = HT + TVA.", variables: { formule: "=E6+E7" } },
                { line: 33, explanation: "Sauvegarde finale.", variables: {}, console: "Facture générée avec formules Excel dynamiques !" }
            ]
        ),

        txt("⚠️ Pièges des Formules : Ce Que Vous Devez Absolument Savoir", `
### 🚨 Les 4 erreurs de formules les plus courantes

**Erreur 1 : Mauvaise langue de la fonction**
\`\`\`python
# ❌ INTERDIT - Nom de fonction français
ws['D5'] = "=SOMME(D2:D4)"    # Ne fonctionnera PAS dans Excel anglais

# ✅ CORRECT - Nom de fonction anglais
ws['D5'] = "=SUM(D2:D4)"      # Fonctionne partout
\`\`\`

**Erreur 2 : Guillemets dans les formules conditionnelles**
\`\`\`python
# ❌ Guillemets Python vs Guillemets Excel mélangés
ws['F2'] = "=IF(E2>=100, "Atteint", "Retard")"  # SyntaxError Python !

# ✅ Utiliser des guillemets simples pour la chaîne Python
ws['F2'] = '=IF(E2>=100, "Atteint", "Retard")'  # Correct !
\`\`\`

**Erreur 3 : Références absolues vs relatives**
\`\`\`python
# Référence relative : s'adapte quand Excel copie la cellule
ws['E2'] = "=D2*0.19"         # Devient =D3*0.19, =D4*0.19...

# Référence absolue : reste fixe
ws['E2'] = "=D2*$F$1"         # $F$1 pointe toujours vers la cellule F1 (taux TVA)
\`\`\`

**Erreur 4 : Plages de formules mal calculées**
\`\`\`python
# ❌ La plage ne s'adapte pas aux données
ws['D10'] = "=SUM(D2:D9)"   # Manquera les nouvelles lignes

# ✅ Calculer dynamiquement la dernière ligne
last_row = ws.max_row
ws.cell(row=last_row + 2, column=4, value=f"=SUM(D2:D{last_row})")
\`\`\`
        `),

        txt("📝 Quiz — Leçon 6", `
### 🧠 Questions

**Question 1 :** Pour insérer une formule SOMME dans openpyxl, on écrit :
- A) \`ws['D10'] = "=SOMME(D2:D9)"\`
- B) ✅ \`ws['D10'] = "=SUM(D2:D9)"\`
- C) \`ws['D10'] = sum(ws['D2:D9'])\`
- D) \`ws['D10'].formula = "SUM(D2:D9)"\`

**Question 2 :** La formule Excel \`=IF(C5>1000, "VIP", "Standard")\` en Python s'écrit :
- A) \`f'=IF(C5>1000, "VIP", "Standard")'\` — avec guillemets doubles dans la string Python
- B) ✅ \`'=IF(C5>1000, "VIP", "Standard")'\` — guillemets simples pour la string Python
- C) \`"=IF(C5>1000, 'VIP', 'Standard')"\` — guillemets simples pour les strings Excel
- D) A et C sont toutes les deux correctes

**Question 3 :** \`data_only=True\` est nécessaire quand on veut :
- A) Insérer des formules dans un fichier
- B) ✅ Relire les valeurs calculées (et non les formules) d'un fichier Excel précédemment enregistré
- C) Accélérer le chargement du fichier
- D) Empêcher la modification du fichier
        `)
    ],

    // ─────────────── LEÇON 7 : Pandas ────────────────
    "Analyse de données Excel avec pandas": [
        codetutor(
            "Analyse Complète d'un Dataset Commercial avec Pandas",
            `import pandas as pd

# 1. Charger les données depuis Excel
df = pd.DataFrame({
    'Commercial': ['Amine', 'Karim', 'Sara', 'Yassine', 'Nadia', 'Amine'],
    'Region': ['Alger', 'Oran', 'Alger', 'Constantine', 'Alger', 'Oran'],
    'Produit': ['Ordinateur', 'Imprimante', 'Ordinateur', 'Serveur', 'Ecran', 'Ecran'],
    'CA': [85000, 32000, 92000, 280000, 45000, 38000],
    'Date': ['2026-01', '2026-01', '2026-02', '2026-01', '2026-02', '2026-02']
})

# 2. Statistiques de base
print("=== STATISTIQUES GÉNÉRALES ===")
print(df['CA'].describe())

# 3. Top 3 des commerciaux
top3 = df.groupby('Commercial')['CA'].sum().nlargest(3)
print("\n=== TOP 3 COMMERCIAUX ===")
print(top3)

# 4. CA par région et par produit
pivot = df.pivot_table(index='Region', columns='Produit', values='CA', aggfunc='sum', fill_value=0)
print("\n=== TABLEAU CROISÉ DYNAMIQUE ===")
print(pivot)

# 5. Export final vers Excel
with pd.ExcelWriter('analyse_commerciale.xlsx') as writer:
    df.to_excel(writer, sheet_name='Données_Brutes', index=False)
    top3.to_excel(writer, sheet_name='Top_Commerciaux')
    pivot.to_excel(writer, sheet_name='Tableau_Croisé')

print("\n✅ Analyse exportée dans analyse_commerciale.xlsx")`,
            [
                { line: 1, explanation: "Import de la bibliothèque pandas.", variables: {} },
                { line: 4, explanation: "Création d'un DataFrame simulant un export de CRM.", variables: { shape: "6 lignes × 5 colonnes" } },
                { line: 14, explanation: "describe() calcule automatiquement count, mean, std, min, max, quartiles.", variables: { moyenne_ca: 95333 } },
                { line: 18, explanation: "groupby('Commercial') + sum() + nlargest(3) : Classement des 3 meilleurs vendeurs.", variables: { top1: "Yassine: 280000" } },
                { line: 23, explanation: "pivot_table : Tableau croisé CA par Région (lignes) et Produit (colonnes).", variables: {} },
                { line: 28, explanation: "ExcelWriter crée un classeur multi-feuilles en une seule instruction.", variables: { onglets: 3 } },
                { line: 33, explanation: "Export réussi avec 3 onglets.", variables: {}, console: "✅ Analyse exportée dans analyse_commerciale.xlsx" }
            ]
        ),

        txt("🇩🇿 Cas Avancé : Fusion de Rapports Multi-Agences Bancaires", `
### 🏦 Scénario : Consolidation des rapports de 5 agences BNA

Vous recevez chaque mois 5 fichiers Excel distincts (un par agence). Voici comment les fusionner automatiquement :

\`\`\`python
import pandas as pd
import glob
import os

# 1. Charger et fusionner tous les fichiers Excel de l'agence
dossier_agences = "rapports_agences/"
tous_les_fichiers = glob.glob(os.path.join(dossier_agences, "agence_*.xlsx"))

print(f"📂 {len(tous_les_fichiers)} fichiers trouvés.")

# 2. Lecture et concaténation
dfs = []
for fichier in tous_les_fichiers:
    nom_agence = os.path.basename(fichier).replace("agence_", "").replace(".xlsx", "")
    df_temp = pd.read_excel(fichier, sheet_name="Transactions")
    df_temp['Agence'] = nom_agence.upper()  # Ajout colonne source
    dfs.append(df_temp)

df_consolide = pd.concat(dfs, ignore_index=True)
print(f"✅ {len(df_consolide)} transactions consolidées depuis {len(tous_les_fichiers)} agences.")

# 3. Agrégations
bilan_agences = df_consolide.groupby('Agence').agg(
    Nb_Transactions=('Montant', 'count'),
    Montant_Total=('Montant', 'sum'),
    Montant_Moyen=('Montant', 'mean')
).round(2)

# 4. Exporter le rapport consolidé final
bilan_agences.to_excel("bilan_consolide_BNA.xlsx")
print("📊 Bilan consolidé généré avec succès !")
\`\`\`

> **Point Clé :** \`glob.glob()\` permet de trouver automatiquement tous les fichiers correspondant à un motif (ici \`agence_*.xlsx\`). Cela évite d'écrire les noms de fichiers en dur dans le code.
        `),

        txt("📝 Quiz — Leçon 7", `
### 🧠 Questions

**Question 1 :** Quelle est la différence entre \`pd.read_excel()\` et \`openpyxl.load_workbook()\` ?
- A) Il n'y a aucune différence
- B) ✅ \`pd.read_excel()\` charge les données dans un DataFrame optimisé pour l'analyse ; \`openpyxl\` donne accès au format brut cellule par cellule
- C) openpyxl est plus rapide que pandas pour les grands fichiers
- D) pandas ne peut pas lire les fichiers .xlsx

**Question 2 :** Quelle méthode pandas crée un tableau croisé dynamique (comme dans Excel) ?
- A) \`df.crosstab()\`
- B) \`df.group_by()\`
- C) ✅ \`df.pivot_table(index=..., columns=..., values=..., aggfunc=...)\`
- D) \`df.cross()\`

**Question 3 :** Pour exporter un DataFrame vers un Excel avec plusieurs onglets, on utilise :
- A) \`df.to_excel('fichier.xlsx', sheets=['onglet1', 'onglet2'])\`
- B) ✅ \`pd.ExcelWriter\` en contexte \`with\` et plusieurs appels à \`df.to_excel(writer, sheet_name=...)\`
- C) \`pandas.create_workbook()\`
- D) On ne peut pas créer plusieurs onglets avec pandas
        `)
    ],

    // ─────────────── LEÇON 8 : Word ────────────────
    "Créer des documents Word avec python-docx": [
        txt("🇩🇿 Cas Pratique : Générateur d'Attestations de Formation", `
### 🎓 Scénario : Centre de Formation Professionnel, Alger

Voici un script complet pour générer des attestations de formation personnalisées :

\`\`\`python
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from datetime import datetime

def generer_attestation(nom, prenom, formation, duree, note, organisme):
    """
    Génère une attestation de formation officielle au format Word
    """
    doc = Document()
    
    # 1. Marge de page réduite (plus professionnel)
    from docx.shared import Cm
    for section in doc.sections:
        section.top_margin = Cm(2)
        section.bottom_margin = Cm(2)
        section.left_margin = Cm(2.5)
        section.right_margin = Cm(2.5)
    
    # 2. En-tête avec informations de l'organisme
    en_tete = doc.add_paragraph()
    en_tete.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = en_tete.add_run(organisme.upper())
    run.bold = True
    run.font.size = Pt(14)
    run.font.color.rgb = RGBColor(13, 104, 50)  # Vert institutionnel
    
    doc.add_paragraph()  # Ligne vide
    
    # 3. Titre de l'attestation
    titre = doc.add_heading('ATTESTATION DE FORMATION', level=1)
    titre.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # 4. Corps du document
    date_auj = datetime.now().strftime("%d %B %Y")
    corps = f"""
Le Directeur du Centre de Formation soussigné certifie que :

M./Mme {prenom.upper()} {nom.upper()}

a suivi avec succès la formation intitulée :

    « {formation} »

d'une durée de {duree} heures, du {'01/07/2026'} au {'31/07/2026'}.

Note finale obtenue : {note}/20 — {"MENTION TRÈS BIEN" if note >= 18 else "MENTION BIEN" if note >= 16 else "SATISFAISANT"}

La présente attestation est délivrée pour servir et valoir ce que de droit.

Fait à Alger, le {date_auj}
    """
    
    for ligne in corps.strip().split('\n'):
        p = doc.add_paragraph(ligne.strip())
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    # 5. Signature
    doc.add_paragraph()
    sig = doc.add_paragraph()
    sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    sig.add_run("Le Directeur de la Formation").bold = True
    
    # 6. Sauvegarde
    nom_fichier = f"Attestation_{nom}_{prenom}.docx"
    doc.save(nom_fichier)
    return nom_fichier

# Génération pour plusieurs étudiants
etudiants = [
    ("BENCHIKH", "Ryad", "Python pour Excel & Word", 40, 17.5),
    ("LARBI", "Amira", "Python pour Excel & Word", 40, 19.0),
    ("BELKAID", "Mourad", "Python pour Excel & Word", 40, 15.0),
]

for nom, prenom, formation, duree, note in etudiants:
    fichier = generer_attestation(nom, prenom, formation, duree, note, "EL SAYF DIGITAL ACADEMY")
    print(f"✅ Généré : {fichier}")
\`\`\`
        `),

        txt("📐 Structure Avancée : Sections, En-têtes & Pieds de Page", `
### 📄 Maîtriser la Mise en Page Avancée

\`\`\`python
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# 1. Configurer les marges de page
section = doc.sections[0]
section.page_height = Cm(29.7)   # A4
section.page_width = Cm(21.0)    # A4
section.left_margin = Cm(2.5)
section.right_margin = Cm(2.5)
section.top_margin = Cm(3.0)
section.bottom_margin = Cm(2.5)

# 2. En-tête de page (apparaît sur chaque page)
en_tete = section.header
para_hdr = en_tete.paragraphs[0]
para_hdr.text = "CONFIDENTIEL | SARL ENTREPRISE — Document interne"
para_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
para_hdr.runs[0].font.size = Pt(8)

# 3. Pied de page avec numérotation
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
pied_de_page = section.footer
para_ftr = pied_de_page.paragraphs[0]
para_ftr.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Ajout du numéro de page automatique
run_ftr = para_ftr.add_run("Page ")
fldChar1 = OxmlElement('w:fldChar')
fldChar1.set(qn('w:fldCharType'), 'begin')
instrText = OxmlElement('w:instrText')
instrText.text = 'PAGE'
fldChar2 = OxmlElement('w:fldChar')
fldChar2.set(qn('w:fldCharType'), 'end')
run_ftr._r.extend([fldChar1, instrText, fldChar2])

doc.add_paragraph("Contenu du document ici...")
doc.save("document_professionnel.docx")
print("Document avec en-têtes et pieds de page créé !")
\`\`\`
        `),

        txt("📝 Quiz — Leçon 8", `
### 🧠 Questions

**Question 1 :** Dans python-docx, un \`run\` est :
- A) La méthode pour exécuter le script
- B) ✅ Un fragment de texte au sein d'un paragraphe, ayant ses propres styles (gras, couleur, taille...)
- C) Un onglet du document Word
- D) Une erreur de code

**Question 2 :** Pour centrer un titre dans python-docx, on utilise :
- A) \`titre.style = 'center'\`
- B) \`titre.center = True\`
- C) ✅ \`titre.alignment = WD_ALIGN_PARAGRAPH.CENTER\`
- D) \`titre.add_run(alignment='center')\`

**Question 3 :** Quelle méthode permet d'insérer un tableau dans un document Word ?
- A) \`doc.insert_table(rows=5, cols=3)\`
- B) ✅ \`doc.add_table(rows=5, cols=3)\`
- C) \`doc.create_table(5, 3)\`
- D) \`doc.table(5, 3)\`
        `)
    ],

    // ─────────────── LEÇON 9 : Publipostage ────────────────
    "Modèles Word et publipostage (mail merge)": [
        txt("🇩🇿 Cas Ultra-Complet : Génération Automatique de Contrats de Travail CDI", `
### 📋 Scénario Entreprise

La DRH de **NAFTAL Distribution, Oran** doit générer 50 contrats CDI par mois. Chaque contrat est de 8 pages et doit être personnalisé avec les données de chaque employé.

**Template \`contrat_cdi_template.docx\` :**
- Toutes les données variables sont encadrées par des balises : \`{{NOM}}\`, \`{{PRENOM}}\`, \`{{POSTE}}\`, \`{{SALAIRE_BRUT}}\`, \`{{DATE_DEBUT}}\`, \`{{DUREE_ESSAI}}\`

\`\`\`python
import openpyxl
from docx import Document
from docx.shared import Pt
import os

def remplacer_toutes_occurrences(doc, variables):
    """Remplace les balises dans paragraphes ET dans les cellules de tableaux"""
    def remplacer_dans_paragraphe(p):
        for cle, val in variables.items():
            if cle in p.text:
                # Préserver le style du premier run
                style_premier_run = None
                if p.runs:
                    style_premier_run = {
                        'bold': p.runs[0].bold,
                        'font_size': p.runs[0].font.size,
                        'color': p.runs[0].font.color.rgb if p.runs[0].font.color and p.runs[0].font.color.type else None
                    }
                # Remplacement global
                texte_complet = p.text.replace(cle, str(val))
                # Effacer et réécrire le paragraphe
                for run in p.runs:
                    run.text = ""
                if p.runs:
                    p.runs[0].text = texte_complet
                    if style_premier_run:
                        p.runs[0].bold = style_premier_run['bold']
                        p.runs[0].font.size = style_premier_run['font_size']
    
    # Paragraphes simples
    for p in doc.paragraphs:
        remplacer_dans_paragraphe(p)
    
    # Paragraphes dans les tableaux
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    remplacer_dans_paragraphe(p)


def generer_contrats_depuis_excel(fichier_excel, template_docx, dossier_sortie):
    # Créer le dossier de sortie
    os.makedirs(dossier_sortie, exist_ok=True)
    
    # Lire la liste des employés
    wb = openpyxl.load_workbook(fichier_excel)
    ws = wb.active
    
    employes_traites = 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        nom, prenom, poste, salaire, date_debut = row[:5]
        if not nom:
            break
        
        # Charger le template (TOUJOURS relire le template original pour chaque document !)
        doc = Document(template_docx)
        
        # Dictionnaire de substitution
        variables = {
            "{{NOM}}": nom.upper(),
            "{{PRENOM}}": prenom.capitalize(),
            "{{POSTE}}": poste,
            "{{SALAIRE_BRUT}}": f"{salaire:,.2f} DZD",
            "{{DATE_DEBUT}}": str(date_debut),
            "{{DUREE_ESSAI}}": "3 mois" if salaire < 50000 else "6 mois",
        }
        
        # Remplacement
        remplacer_toutes_occurrences(doc, variables)
        
        # Sauvegarde
        nom_fichier = f"{dossier_sortie}/CDI_{nom.upper()}_{prenom.capitalize()}.docx"
        doc.save(nom_fichier)
        employes_traites += 1
        print(f"✅ Contrat généré : {nom_fichier}")
    
    print(f"\\n🎉 {employes_traites} contrats CDI générés en quelques secondes !")

# Appel
generer_contrats_depuis_excel("liste_employes.xlsx", "contrat_cdi_template.docx", "contrats_CDI_2026")
\`\`\`
        `),

        txt("📝 Quiz — Leçon 9", `
### 🧠 Questions

**Question 1 :** Pourquoi faut-il recharger le fichier template pour chaque document généré ?
- A) Pour économiser la mémoire
- B) ✅ Car \`Document\` modifie l'objet en mémoire. Si on ne recharge pas, les balises remplacées au tour précédent ne seront plus disponibles
- C) Car python-docx ne peut pas modifier plusieurs fois le même objet
- D) Ce n'est pas nécessaire, on peut réutiliser le même objet \`doc\`

**Question 2 :** Quelle stratégie utiliser quand une balise \`{{NOM}}\` est répartie sur plusieurs \`runs\` dans le document Word ?
- A) Utiliser \`p.text\` directement pour vérifier, puis reconstruire le contenu en une seule opération sur le run 0
- B) Ignorer le problème, cela n'arrive jamais
- C) ✅ Vérifier \`p.text\` (qui concatène tous les runs), puis effacer les runs et réécrire le texte complet dans le premier run
- D) Utiliser \`p.replace()\` (méthode inexistante)

**Question 3 :** Pour générer 200 contrats en moins de 10 secondes, la meilleure stratégie est :
- A) Ouvrir et sauvegarder chaque document manuellement
- B) ✅ Une boucle Python sur la liste Excel + rechargement du template + remplacement des balises + sauvegarde individuelle
- C) Utiliser les macros VBA Excel
- D) Word ne peut pas être automatisé avec Python
        `)
    ],

    // ─────────────── LEÇON 10 : win32com ────────────────
    "Piloter Excel et Word directement avec win32com": [
        txt("🇩🇿 Cas Pratique : Exporter en PDF 30 Factures Word d'un Coup", `
### 📄 Scénario Réel : Agence de Communication, Alger

Vous avez 30 fichiers \`.docx\` (factures clients) et devez tous les convertir en PDF pour envoi email. Sur Windows avec Word installé :

\`\`\`python
import os
import glob
import time
import win32com.client

def convertir_dossier_word_en_pdf(dossier_source, dossier_pdf):
    """Convertit tous les .docx d'un dossier en .pdf"""
    os.makedirs(dossier_pdf, exist_ok=True)
    
    fichiers_docx = glob.glob(os.path.join(dossier_source, "*.docx"))
    print(f"📁 {len(fichiers_docx)} fichiers Word trouvés.")
    
    # Démarrer Word une seule fois pour tous les documents (plus rapide)
    word = win32com.client.DispatchEx("Word.Application")
    word.Visible = False
    word.DisplayAlerts = False
    
    succes = 0
    erreurs = []
    
    try:
        for chemin_docx in fichiers_docx:
            try:
                nom_base = os.path.splitext(os.path.basename(chemin_docx))[0]
                chemin_pdf = os.path.abspath(os.path.join(dossier_pdf, nom_base + ".pdf"))
                
                doc = word.Documents.Open(os.path.abspath(chemin_docx))
                doc.SaveAs(chemin_pdf, FileFormat=17)  # 17 = wdFormatPDF
                doc.Close()
                
                succes += 1
                print(f"  ✅ [{succes}/{len(fichiers_docx)}] {nom_base}.pdf")
                
            except Exception as e:
                erreurs.append((chemin_docx, str(e)))
                print(f"  ❌ Erreur sur {chemin_docx}: {e}")
    
    finally:
        word.Quit()
    
    print(f"\\n🎉 Terminé ! {succes} PDF générés en {dossier_pdf}")
    if erreurs:
        print(f"⚠️ {len(erreurs)} erreur(s) :")
        for f, e in erreurs:
            print(f"  - {f}: {e}")

# Appel
convertir_dossier_word_en_pdf("factures_word/", "factures_pdf/")
\`\`\`

> ⏱️ **Performance :** 30 documents convertis en environ 60 secondes (2 sec/document). Contre 30 minutes manuellement !
        `),

        txt("📝 Quiz — Leçon 10", `
### 🧠 Questions

**Question 1 :** Quelle est la différence entre \`win32com.client.Dispatch()\` et \`win32com.client.DispatchEx()\` ?
- A) Il n'y a aucune différence
- B) \`DispatchEx\` est plus lent
- C) ✅ \`Dispatch\` réutilise une instance de Word déjà ouverte; \`DispatchEx\` crée toujours une nouvelle instance isolée (plus sûr pour les scripts automatisés)
- D) \`DispatchEx\` ne fonctionne que sur Windows 11

**Question 2 :** Pourquoi appeler \`word.Quit()\` dans un bloc \`finally\` ?
- A) Pour fermer tous les fichiers PDF
- B) ✅ Pour garantir que l'application Word se ferme même si une erreur survient, évitant des processus Word zombies en mémoire
- C) Car python-docx en a besoin pour fonctionner
- D) Ce n'est pas nécessaire, Word se ferme automatiquement

**Question 3 :** Sur un serveur Linux, quelle est l'alternative à win32com pour convertir Word en PDF ?
- A) Il n'y a aucune alternative
- B) \`pywin32\` fonctionne aussi sur Linux
- C) ✅ LibreOffice en mode headless via \`subprocess\` (\`libreoffice --headless --convert-to pdf fichier.docx\`)
- D) pdfkit (uniquement pour HTML→PDF, pas Word→PDF)
        `)
    ],

    // ─────────────── LEÇON 11 : Projet Pipeline ────────────────
    "Projet : Pipeline complet Excel → Word → PDF": [
        txt("🏗️ Architecture du Pipeline : Best Practices & Design Patterns", `
### 🎯 Concevoir un Pipeline Robuste et Maintenable

Un pipeline de production en entreprise doit suivre ces principes :

**Principe 1 : Séparation des responsabilités (SoC)**
\`\`\`
pipeline_automatisation/
├── config.py          # Paramètres : chemins, taux TVA, emails...
├── lecture_excel.py   # Module : chargement & nettoyage des données
├── generation_word.py # Module : rédaction du rapport Word
├── export_pdf.py      # Module : conversion finale en PDF
├── email_envoi.py     # Module : expédition automatique par email
└── main.py            # Orchestrateur : appelle les modules dans l'ordre
\`\`\`

**Principe 2 : Configuration centralisée dans \`config.py\`**
\`\`\`python
# config.py
CONFIG = {
    "dossier_donnees": "C:/DossierEntreprise/Donnees/",
    "dossier_sortie": "C:/DossierEntreprise/Rapports/",
    "template_word": "templates/rapport_mensuel.docx",
    "taux_tva": 0.19,
    "email_destinataire": "direction@entreprise.dz",
    "nom_entreprise": "SARL MA SOCIETE",
}
\`\`\`

**Principe 3 : Journalisation Complète (Logging)**
\`\`\`python
import logging
from datetime import datetime

# Créer un fichier de log horodaté
log_file = f"logs/pipeline_{datetime.now().strftime('%Y%m%d_%H%M')}.log"
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(message)s'
)

# Dans chaque module
logging.info("Pipeline démarré")
logging.error(f"Erreur sur le fichier {fichier}: {str(e)}")
logging.info(f"Pipeline terminé : {n_docs} documents générés")
\`\`\`
        `),

        excelgen({ template: "multifeuille", title: "Atelier : Générer le Classeur Source du Pipeline (Multi-Feuilles)" }),

        txt("📝 Quiz — Leçon 11", `
### 🧠 Questions

**Question 1 :** Quelle est la meilleure pratique pour gérer les chemins de fichiers dans un pipeline de production ?
- A) Écrire les chemins en dur dans chaque script (\`"C:/Jean/Bureau/fichier.xlsx"\`)
- B) ✅ Centraliser les chemins dans un fichier \`config.py\` et utiliser \`os.path.join()\` pour la compatibilité multi-OS
- C) Utiliser uniquement des chemins relatifs
- D) Demander le chemin à l'utilisateur à chaque exécution

**Question 2 :** La bonne structure d'un pipeline professionnel consiste à :
- A) Mettre tout le code dans un seul fichier \`main.py\` de 2000 lignes
- B) ✅ Séparer les responsabilités en modules distincts (lecture, traitement, génération, export, email)
- C) Utiliser uniquement des notebooks Jupyter
- D) Copier-coller le code entre les scripts

**Question 3 :** Un pipeline en production doit obligatoirement :
- A) Envoyer des emails de notification automatiques
- B) Utiliser une base de données
- C) ✅ Avoir un système de logs pour tracer chaque exécution, ses succès et ses erreurs
- D) Fonctionner en temps réel
        `)
    ],

    // ─────────────── LEÇON 12 : Planification ────────────────
    "Automatiser la planification (tâches programmées)": [
        txt("🐍 Planification Python Native avec le Module \`schedule\`", `
### ⏰ Alternative moderne : Planifier depuis Python directement

Sur Windows, Mac ou Linux, vous pouvez utiliser le module **\`schedule\`** pour planifier des tâches **directement en Python** sans passer par l'interface du planificateur Windows :

\`\`\`bash
pip install schedule
\`\`\`

\`\`\`python
import schedule
import time
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')

def generer_rapport_quotidien():
    """Rapport généré chaque jour à 07h30"""
    logging.info("🚀 Génération du rapport quotidien...")
    # ... votre code openpyxl / python-docx ici ...
    logging.info("✅ Rapport quotidien terminé.")

def envoyer_synthese_hebdo():
    """Synthèse envoyée chaque lundi"""
    logging.info("📊 Génération de la synthèse hebdomadaire...")
    # ... code de la synthèse ...

def sauvegarder_base():
    """Sauvegarde tous les vendredis à 18h00"""
    logging.info("💾 Sauvegarde de sécurité...")
    import shutil
    shutil.copy("base_clients.xlsx", f"backup_{datetime.now().strftime('%Y%m%d')}.xlsx")

# Définir la planification
schedule.every().day.at("07:30").do(generer_rapport_quotidien)
schedule.every().monday.at("08:00").do(envoyer_synthese_hebdo)
schedule.every().friday.at("18:00").do(sauvegarder_base)

print("✅ Planificateur démarré. Ctrl+C pour arrêter.")
while True:
    schedule.run_pending()
    time.sleep(30)  # Vérifier toutes les 30 secondes
\`\`\`

> 💡 **Sur un VPS/serveur Linux :** Vous pouvez aussi utiliser \`cron\` pour planifier l'exécution d'un script Python :
> \`\`\`bash
> # Ouvrir l'éditeur cron
> crontab -e
>
> # Exécuter chaque jour à 07h30
> 30 7 * * * /usr/bin/python3 /home/user/MonProjet/main_pipeline.py
>
> # Exécuter chaque lundi à 8h00
> 0 8 * * 1 /usr/bin/python3 /home/user/MonProjet/synthese.py
> \`\`\`
        `),

        txt("📤 Envoi Automatique d'Emails avec les Rapports en Pièces Jointes", `
### 📧 Automatiser l'envoi de rapports par email avec \`smtplib\`

\`\`\`python
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

def envoyer_rapport_email(
    destinataires,        # ["dg@societe.dz", "daf@societe.dz"]
    sujet,               # "Rapport Mensuel - Juillet 2026"
    corps_html,          # Corps du message en HTML
    fichiers_joints=[]   # ["rapport_juillet.xlsx", "synthese.pdf"]
):
    expediteur = "automatisation@societe.dz"
    mot_de_passe = os.environ.get("EMAIL_PASSWORD")  # Ne jamais mettre en dur !

    # Créer le message
    msg = MIMEMultipart()
    msg['From'] = expediteur
    msg['To'] = ', '.join(destinataires)
    msg['Subject'] = sujet
    msg.attach(MIMEText(corps_html, 'html'))

    # Attacher les fichiers
    for chemin_fichier in fichiers_joints:
        with open(chemin_fichier, 'rb') as f:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename="{os.path.basename(chemin_fichier)}"')
            msg.attach(part)

    # Envoi sécurisé via TLS
    contexte_ssl = ssl.create_default_context()
    with smtplib.SMTP("smtp.gmail.com", 587) as serveur:
        serveur.starttls(context=contexte_ssl)
        serveur.login(expediteur, mot_de_passe)
        serveur.sendmail(expediteur, destinataires, msg.as_string())

    print(f"✅ Email envoyé à {', '.join(destinataires)}")

# Exemple d'appel
envoyer_rapport_email(
    destinataires=["direction@entreprise.dz"],
    sujet="📊 Rapport Mensuel Automatisé - Juillet 2026",
    corps_html="<h2>Rapport mensuel</h2><p>Veuillez trouver ci-joint le rapport.</p>",
    fichiers_joints=["rapport_juillet.xlsx", "synthese_juillet.pdf"]
)
\`\`\`
        `),

        txt("📝 Quiz — Leçon 12", `
### 🧠 Questions

**Question 1 :** Pour planifier un script Python natif, sans dépendre de l'interface Windows, on utilise :
- A) \`time.sleep()\` dans une boucle infinie sans condition
- B) \`threading.Timer\`
- C) ✅ Le module \`schedule\` avec \`schedule.every().day.at("07:30").do(ma_fonction)\`
- D) Ce n'est pas possible en Python pur

**Question 2 :** Sur un serveur Linux/VPS, la planification des tâches se fait avec :
- A) Le Planificateur de Tâches Windows (absent sur Linux)
- B) ✅ \`cron\` via \`crontab -e\` avec une expression comme \`30 7 * * * python3 script.py\`
- C) \`schedule\` uniquement (cron n'existe pas)
- D) Docker Compose

**Question 3 :** Pourquoi ne jamais écrire son mot de passe email en dur dans le script ?
- A) Python ne peut pas lire les chaînes de caractères
- B) ✅ Un fichier de code peut être partagé, mis sur GitHub, ou volé. Utiliser \`os.environ.get()\` isole les credentials.
- C) Parce que Python chiffre automatiquement les fichiers
- D) Ce n'est pas un problème de sécurité
        `)
    ],

    // ─────────────── LEÇON 13 : Conclusion ────────────────
    "Conclusion et prochaines étapes": [
        txt("🚀 Ressources pour Continuer et S'Améliorer", `
### 📚 La Bibliothèque de Référence Officielle

| Bibliothèque | Documentation Officielle | Ce que vous y trouverez |
|---|---|---|
| **openpyxl** | [openpyxl.readthedocs.io](https://openpyxl.readthedocs.io/) | Formules, graphiques, images, validation |
| **pandas** | [pandas.pydata.org](https://pandas.pydata.org/docs/) | Nettoyage, agrégation, export multi-format |
| **python-docx** | [python-docx.readthedocs.io](https://python-docx.readthedocs.io/) | Tables, images, styles avancés |
| **xlsxwriter** | [xlsxwriter.readthedocs.io](https://xlsxwriter.readthedocs.io/) | Graphiques Excel natifs, tableaux croisés |

---

### 🎯 Les 3 Compétences Avancées à Explorer Ensuite

1. **Graphiques Excel avec xlsxwriter** — Insérer de vrais graphiques Excel (barres, lignes, secteurs) générés par code :
\`\`\`python
import xlsxwriter

wb = xlsxwriter.Workbook('graphique_ventes.xlsx')
ws = wb.add_worksheet()
ws.write_column('A1', ['Jan', 'Fév', 'Mar', 'Avr'])
ws.write_column('B1', [150000, 180000, 210000, 195000])

chart = wb.add_chart({'type': 'column'})
chart.add_series({'name': 'CA Mensuel', 'categories': '=Feuil1!A1:A4', 'values': '=Feuil1!B1:B4'})
ws.insert_chart('D1', chart)
wb.close()
\`\`\`

2. **Automatisation avec emails (smtplib)** — Envoyer automatiquement les rapports générés.

3. **Interface graphique (tkinter)** — Créer une petite application avec boutons pour que des collègues non-développeurs puissent lancer vos scripts sans terminal.
        `),

        excelgen({ template: "kpi", title: "🏆 Dernier Exercice : Créez votre Dashboard Personnel de Compétences" }),

        txt("📝 Quiz Final de Validation Globale", `
### 🎓 Quiz de Synthèse — Formation Complète

**Q1 :** Pour lire un fichier Excel de 50 000 lignes et calculer des groupes de statistiques, quelle est l'approche optimale ?
- ✅ **Pandas** (\`pd.read_excel()\` + \`groupby()\` + \`agg()\`)

**Q2 :** Pour créer un fichier Excel avec styles, couleurs et formules professionnelles destiné à un client :
- ✅ **openpyxl** avec \`Font\`, \`PatternFill\`, \`Border\`, \`Alignment\` et formules texte comme \`"=SUM(D2:D10)"\`

**Q3 :** Pour générer 200 contrats Word personnalisés depuis une liste Excel :
- ✅ **python-docx** + boucle sur les lignes Excel + remplacement de balises \`{{NOM}}\` dans le template

**Q4 :** Pour exécuter automatiquement votre pipeline chaque lundi à 07h30 sur un VPS Linux :
- ✅ **crontab** avec l'expression \`30 7 * * 1 python3 /chemin/pipeline.py\`

**Q5 :** Pour convertir 100 documents Word en PDF sur Windows avec une fidélité graphique parfaite :
- ✅ **win32com.client** avec \`word.Documents.Open()\` + \`doc.SaveAs(pdf_path, FileFormat=17)\`
        `)
    ],

    // ─────────────── LEÇON 14 : Grand TP ────────────────
    "TP : Générer un vrai fichier Excel avec Python": [
        txt("💡 Guide Complet d'Utilisation de l'Atelier Interactif", `
### 🖥️ Mode d'Emploi du Générateur Excel Interactif

Cet atelier unique sur la plateforme vous permet de vivre l'expérience de l'automatisation Excel **sans rien installer**.

**Comment utiliser l'atelier :**

1. **Choisissez un modèle** parmi les 7 cas pratiques (boutons colorés en haut).
2. **Lisez et comprenez le code** Python affiché dans l'éditeur de gauche.
3. **Modifiez le code** selon les défis proposés ou selon vos propres idées.
4. **Cliquez sur "Exécuter & Générer l'Excel"** pour lancer le code.
5. **Observez le tableur en direct** dans l'onglet "📊 Aperçu Tableur Direct" à droite.
6. **Cliquez sur une cellule** pour voir sa valeur et sa formule Excel native.
7. **Téléchargez le fichier .xlsx** en cliquant sur le bouton bleu de téléchargement.
8. **Ouvrez le fichier dans Excel, LibreOffice ou Google Sheets** pour vérifier la perfection des styles et formules.

> 🔒 **Confidentialité :** 100% de l'exécution se passe dans votre navigateur via WebAssembly. Aucune donnée ne quitte votre ordinateur.
        `),

        excelgen({ template: "facture", title: "🏆 Grand Atelier Final — 7 Cas Pratiques Réels d'Entreprise" }),

        codetutor(
            "Défi Bonus : Créer un Rapport Mensuel Complet en 50 Lignes",
            `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Rapport_Mensuel"

# Configuration des données
regions = ["Alger", "Oran", "Constantine", "Annaba", "Sétif"]
ca_mensuel = [2450000, 1820000, 1650000, 980000, 1230000]
objectifs = [2200000, 2000000, 1500000, 1000000, 1100000]

# En-têtes
ws['A1'] = "RAPPORT MENSUEL - RÉSULTATS COMMERCIAUX"
ws['A1'].font = Font(size=14, bold=True, color="1E3A8A")

headers = ["Région", "Objectif (DZD)", "Réalisé (DZD)", "Taux d'Atteinte", "Statut"]
hdr_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")

for c, h in enumerate(headers, 1):
    cell = ws.cell(row=3, column=c, value=h)
    cell.fill = hdr_fill
    cell.font = Font(bold=True, color="FFFFFF")
    cell.alignment = Alignment(horizontal="center")

# Données avec formules
for r, (reg, ca, obj) in enumerate(zip(regions, ca_mensuel, objectifs), 4):
    ws.cell(row=r, column=1, value=reg)
    ws.cell(row=r, column=2, value=obj).number_format = '#,##0'
    ws.cell(row=r, column=3, value=ca).number_format = '#,##0'
    ws.cell(row=r, column=4, value=f"=C{r}/B{r}").number_format = '0.0%'
    ws.cell(row=r, column=5, value=f'=IF(D{r}>=1, "✅ ATTEINT", "⚠️ RETARD")')

# Total
last = 3 + len(regions)
ws.cell(row=last+1, column=1, value="TOTAL").font = Font(bold=True)
ws.cell(row=last+1, column=2, value=f"=SUM(B4:B{last})").number_format = '#,##0'
ws.cell(row=last+1, column=3, value=f"=SUM(C4:C{last})").number_format = '#,##0'
ws.cell(row=last+1, column=4, value=f"=C{last+1}/B{last+1}").number_format = '0.0%'

wb.save("rapport_mensuel_complet.xlsx")
print("✅ Rapport mensuel complet généré avec formules Excel natives !")`,
            [
                { line: 1, explanation: "Imports nécessaires pour créer et styliser le classeur.", variables: {} },
                { line: 5, explanation: "Création du classeur et configuration de l'onglet.", variables: { ws: "Rapport_Mensuel" } },
                { line: 8, explanation: "Données des 5 régions commerciales : objectifs et réalisations.", variables: { nb_regions: 5 } },
                { line: 12, explanation: "Titre principal de grande taille en bleu corporate.", variables: { titre: "RAPPORT MENSUEL - RÉSULTATS COMMERCIAUX" } },
                { line: 15, explanation: "Application du fond bleu et texte blanc sur les en-têtes.", variables: {} },
                { line: 22, explanation: "Boucle d'insertion : une ligne par région avec formule de taux d'atteinte.", variables: { reg: "Alger", ca: 2450000 } },
                { line: 25, explanation: "Formule de ratio : Réalisé / Objectif.", variables: { formule: "=C4/B4", valeur: "111.4%" } },
                { line: 26, explanation: "Formule IF pour le statut vert/rouge automatique.", variables: { statut: "✅ ATTEINT" } },
                { line: 30, explanation: "Ligne de totaux avec formules SUM dynamiques.", variables: { total: 8130000 } },
                { line: 34, explanation: "Sauvegarde finale du rapport.", variables: {}, console: "✅ Rapport mensuel complet généré avec formules Excel natives !" }
            ]
        )
    ]
};

// ============================================================
// SCRIPT D'EXÉCUTION PRINCIPAL
// ============================================================
async function main() {
    console.log('🚀 Mega-Enrichissement : ajout du contenu supplémentaire pour toutes les leçons...');

    const course = await withRetry(async () => prisma.course.findUnique({
        where: { slug: SLUG },
        include: { lessons: { orderBy: { order: 'asc' }, include: { contents: { orderBy: { order: 'asc' } } } } }
    }));

    if (!course) { console.error('❌ Cours introuvable !'); return; }
    console.log(`📚 Cours : "${course.title}" — ${course.lessons.length} leçons\n`);

    let total_blocs_ajoutes = 0;

    for (const lesson of course.lessons) {
        const titre = lesson.title.trim();
        const extra = EXTRA_BLOCKS[titre];
        if (!extra || extra.length === 0) {
            console.log(`ℹ️  L#${lesson.order} "${titre}" — pas de blocs supplémentaires définis, passage.`);
            continue;
        }

        // Calculer le prochain ordre
        const max_order = lesson.contents.reduce((m, c) => Math.max(m, c.order), 0);

        console.log(`\n📝 L#${lesson.order} : "${titre}"`);
        console.log(`   Blocs existants: ${lesson.contents.length} | Nouveaux blocs: ${extra.length} | Ordre à partir de: ${max_order + 1}`);

        for (let i = 0; i < extra.length; i++) {
            const bloc = extra[i];
            await withRetry(async () => {
                await prisma.courseContent.create({
                    data: {
                        lessonId: lesson.id,
                        title: bloc.title,
                        contentType: bloc.contentType,
                        content: bloc.content,
                        order: max_order + 1 + i
                    }
                });
            });
            console.log(`   ✅ Bloc ${i + 1}/${extra.length} ajouté : "${bloc.title.substring(0, 60)}"`);
            total_blocs_ajoutes++;
        }
    }

    console.log(`\n🎉 TERMINÉ ! ${total_blocs_ajoutes} blocs ajoutés à la formation.`);
}

main()
    .catch(e => { console.error('❌ Erreur :', e.message); process.exit(1); })
    .finally(() => prisma.$disconnect());
