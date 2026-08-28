/*
 * Populate CourseContent - Partie 2 : Leçons 4 à 9
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

function codetutor(title, code, steps) {
    return {
        contentType: 'text',
        title: 'Démonstration animée',
        content: '```codetutor\n' + JSON.stringify({ title, code, steps }) + '\n```',
    };
}
function txt(title, markdown) { return { contentType: 'text', title, content: markdown }; }
function code(title, code) { return { contentType: 'code', title, content: code }; }

const LESSON_CONTENTS = {

    // ═════════════════════════════════════════════════════════════
    "Lire et explorer un fichier Excel existant": [
        txt("Ouvrir un fichier existant", `
On utilise \`load_workbook()\` pour ouvrir un fichier déjà présent sur le disque :

\`\`\`python
import openpyxl

classeur = openpyxl.load_workbook('mes_ventes.xlsx')
print("Feuilles :", classeur.sheetnames)
feuille = classeur['Mes Ventes']
\`\`\`
        `),
        codetutor(
            "Parcourir toutes les lignes d'un tableau",
            `import openpyxl

classeur = openpyxl.load_workbook('ventes.xlsx')
feuille = classeur.active

total = 0
for ligne in feuille.iter_rows(min_row=2,
                                max_col=2,
                                values_only=True):
    quantite = ligne[0]
    prix = ligne[1]
    total += quantite * prix

print("Total:", total, "DH")`,
            [
                { line: 1, explanation: "On importe openpyxl.", variables: {} },
                { line: 3, explanation: "load_workbook() ouvre un fichier EXISTANT sur le disque. Attention au chemin exact.", variables: { classeur: "ventes.xlsx" } },
                { line: 4, explanation: ".active sélectionne la première feuille du classeur.", variables: { classeur: "ventes.xlsx", feuille: "active" } },
                { line: 6, explanation: "On initialise un accumulateur 'total' à zéro. Il servira à additionner les montants.", variables: { total: 0 } },
                { line: 7, explanation: "iter_rows() parcourt les lignes. min_row=2 permet d'ignorer la ligne d'en-tête. values_only=True renvoie les valeurs brutes (pas les objets Cell).", variables: { total: 0 } },
                { line: 10, explanation: "Pour chaque ligne, on récupère la quantité (colonne A). À la 1re itération : 50.", variables: { total: 0, quantite: 50 } },
                { line: 11, explanation: "On récupère le prix unitaire (colonne B). À la 1re itération : 2.5.", variables: { total: 0, quantite: 50, prix: 2.5 } },
                { line: 12, explanation: "On calcule le montant (quantité × prix) et on l'ajoute au total. 50 × 2.5 = 125.", variables: { total: 125, quantite: 50, prix: 2.5 } },
                { line: 12, explanation: "Deuxième ligne : 30 × 4.0 = 120. Le total devient 125 + 120 = 245.", variables: { total: 245, quantite: 30, prix: 4.0 } },
                { line: 15, explanation: "Boucle terminée. On affiche le total final accumulé.", variables: { total: 245 }, console: "Total: 245 DH" },
            ]
        ),
        txt("Convertir Excel en liste de dictionnaires", `
Très utile pour manipuler les données comme des objets :

\`\`\`python
entetes = [cell.value for cell in feuille[1]]
donnees = []
for ligne in feuille.iter_rows(min_row=2, values_only=True):
    enregistrement = dict(zip(entetes, ligne))
    donnees.append(enregistrement)
\`\`\`
        `),
        code("Dimensions d'une feuille", `print(f"Lignes : {feuille.max_row}")
print(f"Colonnes : {feuille.max_column}")`),
    ],

    // ═════════════════════════════════════════════════════════════
    "Mise en forme et styles dans Excel": [
        txt("Pourquoi la mise en forme ?", `
Un fichier Excel bien présenté est **plus professionnel** et **plus lisible**. openpyxl permet de tout contrôler : police, couleurs, bordures, alignement.
        `),
        codetutor(
            "Créer un en-tête de tableau stylé",
            `import openpyxl
from openpyxl.styles import Font, PatternFill

classeur = openpyxl.Workbook()
feuille = classeur.active

feuille['A1'] = 'Produit'
feuille['B1'] = 'Prix'

# Style de l'en-tête
police = Font(bold=True, color='FFFFFF')
fond = PatternFill(start_color='2F5496',
                   end_color='2F5496',
                   fill_type='solid')

for col in ['A', 'B']:
    feuille[col + '1'].font = police
    feuille[col + '1'].fill = fond

classeur.save('tableau_style.xlsx')`,
            [
                { line: 1, explanation: "Import d'openpyxl.", variables: {} },
                { line: 2, explanation: "On importe Font (police) et PatternFill (couleur de fond) depuis openpyxl.styles.", variables: {} },
                { line: 4, explanation: "Création d'un nouveau classeur en mémoire.", variables: { classeur: "nouveau" } },
                { line: 7, explanation: "On écrit les en-têtes dans les cellules A1 et B1.", variables: { "A1": "Produit", "B1": "Prix" } },
                { line: 11, explanation: "Font(...) crée un style de police : gras + texte blanc (FFFFFF). On le stocke dans une variable pour le réutiliser.", variables: { "A1": "Produit", "B1": "Prix", police: "gras/blanc" } },
                { line: 12, explanation: "PatternFill crée une couleur de fond unie. Ici un bleu foncé (2F5496).", variables: { police: "gras/blanc", fond: "bleu #2F5496" } },
                { line: 16, explanation: "On boucle sur les colonnes A et B pour appliquer le style à chaque cellule d'en-tête.", variables: { police: "gras/blanc", fond: "bleu" } },
                { line: 17, explanation: "On applique la police (gras + blanc) à la cellule.", variables: { "A1": "Produit stylé ✓" } },
                { line: 18, explanation: "On applique le fond bleu. L'en-tête est maintenant blanc sur fond bleu.", variables: { "A1": "Produit stylé ✓", "B1": "Prix stylé ✓" } },
                { line: 20, explanation: "Sauvegarde sur le disque. Ouvrez le fichier : l'en-tête est magnifiquement stylé !", variables: { fichier: "tableau_style.xlsx ✓" } },
            ]
        ),
        txt("Largeur des colonnes", `
\`\`\`python
feuille.column_dimensions['A'].width = 30  # largeur fixe
\`\`\`

Pour une **largeur automatique** (approximation) :
\`\`\`python
for col in feuille.columns:
    longueur_max = max(len(str(c.value or '')) for c in col)
    feuille.column_dimensions[col[0].column_letter].width = longueur_max + 2
\`\`\`
        `),
        txt("Format des nombres", `
\`\`\`python
feuille['B2'] = 1234.5
feuille['B2'].number_format = '#,##0.00 "DH"'  # → 1 234,50 DH

feuille['C2'] = datetime.now()
feuille['C2'].number_format = 'DD/MM/YYYY'

feuille['D2'] = 0.15
feuille['D2'].number_format = '0%'            # → 15%
\`\`\`
        `),
        txt("Mise en forme conditionnelle", `
Colorer automatiquement les cellules selon leur valeur (ex : stocks faibles en rouge) :

\`\`\`python
from openpyxl.formatting.rule import CellIsRule
rouge = PatternFill(start_color='FFC7CE', fill_type='solid')
feuille.conditional_formatting.add(
    'C2:C100',
    CellIsRule(operator='lessThan', formula=['10'], fill=rouge)
)
\`\`\`
        `),
    ],

    // ═════════════════════════════════════════════════════════════
    "Formules et calculs automatiques": [
        txt("Des vraies formules Excel", `
openpyxl peut insérer de **vraies formules Excel** (=SOMME, =MOYENNE...) que l'utilisateur verra et pourra modifier directement dans Excel.

⚠️ Les formules doivent être écrites **en anglais** : SUM, AVERAGE, IF, VLOOKUP...
        `),
        codetutor(
            "Créer une facture avec formules",
            `import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active

feuille['A1'] = 'Article'
feuille['B1'] = 'Qté'
feuille['C1'] = 'Prix'
feuille['D1'] = 'Total'

# Données
feuille['A2'] = 'Ordinateur'
feuille['B2'] = 2
feuille['C2'] = 5000
feuille['D2'] = '=B2*C2'

# Sous-total
feuille['D5'] = '=SUM(D2:D2)'

classeur.save('facture.xlsx')`,
            [
                { line: 1, explanation: "Import d'openpyxl.", variables: {} },
                { line: 3, explanation: "Création d'un classeur vide pour notre facture.", variables: { classeur: "vide" } },
                { line: 6, explanation: "On crée les 4 en-têtes de colonnes : Article, Qté, Prix, Total.", variables: { "A1": "Article", "B1": "Qté", "C1": "Prix", "D1": "Total" } },
                { line: 12, explanation: "Premier article : 2 ordinateurs à 5000 DH.", variables: { "A2": "Ordinateur", "B2": 2, "C2": 5000 } },
                { line: 15, explanation: "⚡ ICI LA MAGIE : on insère une VRAIE formule Excel '=B2*C2'. Quand l'utilisateur ouvrira le fichier, Excel calculera 10000.", variables: { "D2": "=B2*C2 → 10000" } },
                { line: 18, explanation: "On ajoute une formule SUM qui fait la somme des totaux. Le calcul sera fait par Excel à l'ouverture.", variables: { "D5": "=SUM(D2:D2) → 10000" } },
                { line: 20, explanation: "Sauvegarde. Quand vous ouvrirez facture.xlsx, les formules seront calculées automatiquement !", variables: { fichier: "facture.xlsx ✓" } },
            ]
        ),
        txt("Tableau des formules courantes", `
| Français | Anglais (à utiliser) |
|----------|---------------------|
| =SOMME   | =SUM                |
| =MOYENNE | =AVERAGE            |
| =MAX / =MIN | =MAX / =MIN      |
| =NB      | =COUNT              |
| =SI      | =IF                 |
| =RECHERCHEV | =VLOOKUP         |

> 💡 **Astuce** : pour lire le **résultat calculé** d'une formule (pas la formule), utilisez \`data_only=True\`.
        `),
        code("Formule conditionnelle (SI)", `import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.append(['Étudiant', 'Note', 'Résultat'])
feuille.append(['Alice', 15, '=IF(B2>=10,"Admis","Échec")'])
feuille.append(['Bob', 8, '=IF(B3>=10,"Admis","Échec")'])
classeur.save('resultats.xlsx')`),
    ],

    // ═════════════════════════════════════════════════════════════
    "Analyse de données Excel avec pandas": [
        txt("Pourquoi pandas ?", `
**pandas** est LA bibliothèque d'analyse de données. Elle transforme vos fichiers Excel en "super-tableaux" appelés **DataFrame**, avec lesquels vous pouvez filtrer, grouper, calculer en quelques lignes.
        `),
        codetutor(
            "Charger et analyser des ventes",
            `import pandas as pd

df = pd.read_excel('ventes.xlsx')

# Calculer un chiffre d'affaires
df['CA'] = df['Quantité'] * df['Prix']

# Filtrer les grosses ventes
gros = df[df['CA'] > 1000]

print("CA total :", df['CA'].sum())
print("Top ville :")
print(df.groupby('Ville')['CA'].sum())`,
            [
                { line: 1, explanation: "On importe pandas, en lui donnant l'alias 'pd' (convention universelle).", variables: {} },
                { line: 3, explanation: "read_excel() lit le fichier et renvoie un DataFrame : un tableau intelligent avec des colonnes nommées.", variables: { df: "DataFrame (N lignes)" } },
                { line: 6, explanation: "On crée une NOUVELLE colonne 'CA' en multipliant les colonnes Quantité et Prix. pandas le fait pour TOUTES les lignes d'un coup !", variables: { df: "DataFrame + colonne CA" } },
                { line: 9, explanation: "On filtre : on ne garde que les lignes où CA > 1000. La syntaxe df[condition] est très puissante.", variables: { df: "complet", gros: "ventes > 1000" } },
                { line: 12, explanation: ".sum() additionne toute la colonne CA. En 1 ligne, on a le chiffre d'affaires total !", variables: { df: "complet" }, console: "CA total : 24500" },
                { line: 14, explanation: "groupby('Ville') regroupe les ventes par ville, puis .sum() additionne. On obtient le CA par ville instantanément.", variables: { df: "complet" }, console: "Casablanca : 15000\\nRabat : 9500" },
            ]
        ),
        txt("Opérations essentielles", `
**Filtrer :**
\`\`\`python
paris = df[df['Ville'] == 'Paris']
paris_gros = df[(df['Ville'] == 'Paris') & (df['CA'] > 1000)]
\`\`\`

**Trier :**
\`\`\`python
df_trie = df.sort_values('Prix', ascending=False)
\`\`\`

**Statistiques rapides :**
\`\`\`python
df.describe()             # moyenne, min, max, écart-type
df['Produit'].value_counts()  # occurrences par produit
\`\`\`
        `),
        code("Exporter plusieurs feuilles", `with pd.ExcelWriter('rapport.xlsx') as writer:
    df.to_excel(writer, sheet_name='Détail', index=False)
    gros.to_excel(writer, sheet_name='Gros montants')
    df.groupby('Ville').sum().to_excel(writer, sheet_name='Par ville')`),
    ],

    // ═════════════════════════════════════════════════════════════
    "Créer des documents Word avec python-docx": [
        txt("python-docx", `
La bibliothèque **python-docx** crée et modifie des fichiers \`.docx\`. Concept clé : un document est composé de **Paragraph** (paragraphes), eux-mêmes composés de **Run** (portions de texte avec un formatage).
        `),
        codetutor(
            "Créer un document Word structuré",
            `from docx import Document
from docx.shared import Pt

doc = Document()

doc.add_heading('Mon Rapport', 0)
doc.add_heading('1. Introduction', level=1)

p = doc.add_paragraph()
p.add_run('Texte normal, ')
p.add_run('texte en gras').bold = True

doc.save('rapport.docx')`,
            [
                { line: 1, explanation: "On importe Document (le document Word) depuis python-docx.", variables: {} },
                { line: 2, explanation: "On importe Pt pour définir des tailles de police en points.", variables: {} },
                { line: 4, explanation: "Document() crée un document Word VIDE en mémoire.", variables: { doc: "vide" } },
                { line: 6, explanation: "add_heading ajoute un TITRE. Le niveau 0 = Titre principal (le plus grand).", variables: { doc: "+ Titre 'Mon Rapport'" } },
                { line: 7, explanation: "level=1 crée un sous-titre (Titre 1). Les niveaux vont de 0 (titre) à 9.", variables: { doc: "+ sous-titre" } },
                { line: 9, explanation: "add_paragraph() crée un paragraphe vide. On le stocke dans 'p' pour y ajouter du texte.", variables: { doc: "+ paragraphe", p: "paragraphe vide" } },
                { line: 10, explanation: "add_run ajoute une portion de texte au paragraphe. Ici du texte normal.", variables: { p: "'Texte normal, '" } },
                { line: 11, explanation: "On ajoute un 2e run et on active le GRAS avec .bold = True. Chaque run peut avoir son propre style !", variables: { p: "'Texte normal, texte en gras'" } },
                { line: 13, explanation: "save() écrit le document sur le disque. Ouvrez rapport.docx dans Word pour voir le résultat.", variables: { fichier: "rapport.docx ✓" } },
            ]
        ),
        txt("Listes et tableaux", `
**Listes :**
\`\`\`python
doc.add_paragraph('Faire les courses', style='List Bullet')   # puces
doc.add_paragraph('Étape 1', style='List Number')             # numérotée
\`\`\`

**Tableau :**
\`\`\`python
tableau = doc.add_table(rows=1, cols=3)
tableau.style = 'Light Grid Accent 1'
entetes = tableau.rows[0].cells
entetes[0].text = 'Nom'
entetes[1].text = 'Poste'
\`\`\`
        `),
        code("Ajouter une image et un saut de page", `from docx.shared import Inches
from docx.enum.text import WD_BREAK

doc.add_picture('logo.png', width=Inches(3))   # image (3 pouces)
doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)  # saut de page`),
    ],

    // ═════════════════════════════════════════════════════════════
    "Modèles Word et publipostage (mail merge)": [
        txt("Le vrai pouvoir de l'automatisation", `
Générer **100 documents personnalisés en 1 clic** : factures, certificats, attestations. On utilise un **modèle Word** avec des mots-clés \`{{NOM}}\` qu'on remplace automatiquement.
        `),
        codetutor(
            "Générer des factures en masse",
            `from docx import Document

def generer_facture(client, montant, numero):
    doc = Document('modele_facture.docx')

    for para in doc.paragraphs:
        para.text = para.text.replace('{{CLIENT}}', client)
        para.text = para.text.replace('{{MONTANT}}', str(montant))
        para.text = para.text.replace('{{NUMERO}}', numero)

    doc.save(f'facture_{numero}.docx')

clients = [
    ('Société Alpha', 15000, 'F001'),
    ('Société Beta', 23000, 'F002'),
]
for c, m, n in clients:
    generer_facture(c, m, n)`,
            [
                { line: 1, explanation: "Import de Document.", variables: {} },
                { line: 3, explanation: "On définit une FONCTION réutilisable. Elle prend un client, un montant et un numéro de facture.", variables: {} },
                { line: 4, explanation: "On ouvre un MODÈLE Word existant ('modele_facture.docx') contenant des mots-clés comme {{CLIENT}}.", variables: { doc: "modèle chargé" } },
                { line: 6, explanation: "On parcourt chaque paragraphe du document.", variables: { doc: "modèle" } },
                { line: 7, explanation: "replace() remplace le mot-clé {{CLIENT}} par le vrai nom du client. Magique !", variables: { doc: "{{CLIENT}} → Société Alpha" } },
                { line: 8, explanation: "On remplace {{MONTANT}}. Notez str() pour convertir le nombre en texte.", variables: { doc: "modèle personnalisé" } },
                { line: 11, explanation: "On sauvegarde avec un nom unique : facture_F001.docx, facture_F002.docx...", variables: { fichier: "facture_F001.docx ✓" } },
                { line: 14, explanation: "Voici nos 2 clients à facturer. Cette liste pourrait venir d'Excel !", variables: { clients: "2 factures" } },
                { line: 18, explanation: "Boucle sur TOUS les clients. Pour chacun, on génère sa facture personnalisée.", variables: { fichiers: "F001, F002 ✓" } },
            ]
        ),
        txt("Technique robuste : remplacer dans les tableaux aussi", `
Word coupe parfois le texte en plusieurs *runs*. Pour être sûr de remplacer partout :

\`\`\`python
def remplacer_texte(doc, ancien, nouveau):
    for para in doc.paragraphs:
        if ancien in para.text:
            para.text = para.text.replace(ancien, nouveau)
    for tableau in doc.tables:           # ← aussi dans les tableaux !
        for ligne in tableau.rows:
            for cellule in ligne.cells:
                for para in cellule.paragraphs:
                    if ancien in para.text:
                        para.text = para.text.replace(ancien, nouveau)
\`\`\`
        `),
        txt("Cas réel : publipostage depuis Excel", `
On combine **openpyxl + python-docx** : on lit les destinataires dans Excel, et on génère un courrier Word pour chacun. C'est exactement le publipostage classique, mais automatisé et flexible.

\`\`\`python
import openpyxl
from docx import Document

classeur = openpyxl.load_workbook('destinataires.xlsx')
feuille = classeur.active
for ligne in feuille.iter_rows(min_row=2, values_only=True):
    nom, email, ville = ligne[0], ligne[1], ligne[2]
    doc = Document()
    doc.add_paragraph(f"À l'attention de : {nom}")
    doc.add_paragraph(f"Ville : {ville}")
    doc.save(f"courrier_{nom}.docx")
\`\`\`
        `),
    ],
};


async function main() {
    const course = await prisma.course.findUnique({ where: { slug: SLUG }, include: { lessons: true } });
    if (!course) throw new Error("Cours introuvable : " + SLUG);

    console.log(`📚 Partie 2 - Peuplement : ${course.title}\n`);

    let totalBlocks = 0;
    for (const lesson of course.lessons) {
        const blocks = LESSON_CONTENTS[lesson.title];
        if (!blocks) continue;

        await prisma.courseContent.deleteMany({ where: { lessonId: lesson.id } });
        for (let i = 0; i < blocks.length; i++) {
            await prisma.courseContent.create({
                data: { ...blocks[i], lessonId: lesson.id, order: i + 1 },
            });
        }
        totalBlocks += blocks.length;
        console.log(`  ✅ "${lesson.title}" → ${blocks.length} bloc(s)`);
    }

    console.log(`\n🎉 ${totalBlocks} blocs créés.`);
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
