/*
 * Populate CourseContent - Partie 3 : Leçons 10 à 13
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
    "Piloter Excel et Word directement avec win32com": [
        txt("Piloter comme un humain", `
**win32com** ouvre VRAIMENT Excel et Word en arrière-plan et les pilote. Avantage : toutes les fonctions sont disponibles (formules calculées, graphiques complexes, export PDF...).

> ⚠️ **Windows uniquement** (nécessite Microsoft Office installé).
> Installez : \`pip install pywin32\`
        `),
        codetutor(
            "Piloter Excel et créer un graphique",
            `import win32com.client as win32

excel = win32.Dispatch('Excel.Application')
excel.Visible = False

classeur = excel.Workbooks.Add()
feuille = classeur.ActiveSheet

feuille.Cells(1, 1).Value = "Mois"
feuille.Cells(1, 2).Value = "Ventes"
feuille.Cells(2, 1).Value = "Jan"
feuille.Cells(2, 2).Value = 100

# Créer un graphique
g = feuille.ChartObjects().Add(100, 50, 400, 300)
g.Chart.SetSourceData(feuille.Range("A1:B2"))
g.Chart.ChartType = 51

classeur.SaveAs('rapport.xlsx')
excel.Quit()`,
            [
                { line: 1, explanation: "On importe win32com. 'client' contient Dispatch qui permet de 'parler' à Excel.", variables: {} },
                { line: 3, explanation: "Dispatch('Excel.Application') démarre VRAIMENT Excel en arrière-plan. Comme si vous l'aviez ouvert vous-même !", variables: { excel: "Excel lancé" } },
                { line: 4, explanation: "Visible = False garde Excel invisible (plus rapide). Mettez True pour le voir travailler.", variables: { excel: "Excel invisible" } },
                { line: 6, explanation: "On crée un nouveau classeur dans Excel.", variables: { excel: "Excel", classeur: "nouveau" } },
                { line: 9, explanation: "On écrit dans les cellules. Notez la syntaxe Cells(ligne, colonne) — c'est du VBA piloté par Python !", variables: { "A1": "Mois", "B1": "Ventes", "A2": "Jan", "B2": 100 } },
                { line: 15, explanation: "On crée un objet graphique. Add(gauche, haut, largeur, hauteur) le positionne.", variables: { graphique: "créé (colonne)" } },
                { line: 16, explanation: "SetSourceData relie le graphique aux données A1:B2.", variables: { graphique: "avec données" } },
                { line: 17, explanation: "ChartType = 51 = histogramme. Excel dessine le graphique automatiquement !", variables: { graphique: "histogramme ✓" } },
                { line: 19, explanation: "SaveAs enregistre. Le fichier contient maintenant un vrai graphique Excel.", variables: { fichier: "rapport.xlsx ✓" } },
                { line: 20, explanation: "Quit() ferme Excel. TOUJOURS fermer proprement pour libérer la mémoire.", variables: { excel: "fermé ✓" } },
            ]
        ),
        codetutor(
            "Convertir Word en PDF (cas très courant !)",
            `import win32com.client as win32

word = win32.Dispatch('Word.Application')
word.Visible = False

doc = word.Documents.Open(r'C:\\rapport.docx')

# FileFormat=17 = PDF
doc.SaveAs(r'C:\\rapport.pdf', FileFormat=17)

doc.Close()
word.Quit()`,
            [
                { line: 1, explanation: "Import de win32com.", variables: {} },
                { line: 3, explanation: "On démarre Word en arrière-plan avec Dispatch.", variables: { word: "Word lancé" } },
                { line: 4, explanation: "On garde Word invisible pour plus de rapidité.", variables: { word: "invisible" } },
                { line: 6, explanation: "Documents.Open ouvre un fichier Word existant. Le 'r' devant la chaîne désactive les échappements.", variables: { doc: "rapport.docx ouvert" } },
                { line: 9, explanation: "SaveAs avec FileFormat=17 convertit en PDF ! C'est le code magique pour l'export PDF dans Word.", variables: { doc: "conversion..." } },
                { line: 11, explanation: "On ferme le document Word.", variables: { doc: "fermé" } },
                { line: 12, explanation: "On quitte Word. PDF généré avec succès !", variables: { word: "fermé ✓", fichier: "rapport.pdf ✓" } },
            ]
        ),
        txt("⚠️ Bonnes pratiques", `
TOUJOURS fermer proprement avec un bloc try/finally, sinon des processus Excel/Word fantômes restent ouverts :

\`\`\`python
excel = None
try:
    excel = win32.Dispatch('Excel.Application')
    # ... votre code ...
finally:
    if excel: excel.Quit()
\`\`\`
        `),
        code("Convertir plusieurs Word en PDF d'un coup", `import win32com.client as win32
import glob

word = win32.Dispatch('Word.Application')
word.Visible = False

for fichier in glob.glob(r'C:\\dossier\\*.docx'):
    doc = word.Documents.Open(fichier)
    pdf_path = fichier.replace('.docx', '.pdf')
    doc.SaveAs(pdf_path, FileFormat=17)
    doc.Close()

word.Quit()`),
    ],

    // ═════════════════════════════════════════════════════════════
    "Projet : Pipeline complet Excel → Word → PDF": [
        txt("🏆 PROJET FINAL", `
On combine TOUT ce qu'on a appris : lire des données Excel → générer des factures Word → exporter en PDF. C'est un vrai système professionnel.
        `),
        txt("Le scénario", `
Vous avez \`commandes.xlsx\` avec : **Numéro | Client | Email | Articles | Montant**.
Vous voulez générer, pour chaque commande : une **facture Word** + un **PDF**.
        `),
        code("Étape 1 — Le fichier source (Excel)", `import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.append(['Numéro', 'Client', 'Email', 'Articles', 'Montant'])
feuille.append(['CMD001', 'Société Alpha', 'contact@alpha.com', 'Ordinateur x2', 10000])
feuille.append(['CMD002', 'Société Beta', 'info@beta.com', 'Imprimante x5', 7500])
classeur.save('commandes.xlsx')`),
        codetutor(
            "Étape 2 — Le générateur de factures (cœur du système)",
            `import openpyxl
from docx import Document

# 1. Lire les commandes
classeur = openpyxl.load_workbook('commandes.xlsx')
feuille = classeur.active

for ligne in feuille.iter_rows(min_row=2, values_only=True):
    numero, client = ligne[0], ligne[1]
    articles, montant = ligne[3], ligne[4]

    # 2. Créer la facture Word
    doc = Document()
    doc.add_heading(f'FACTURE {numero}', 0)
    doc.add_paragraph(f'Client : {client}')
    doc.add_paragraph(f'Articles : {articles}')

    p = doc.add_paragraph()
    run = p.add_run(f'TOTAL : {montant} DH')
    run.bold = True

    # 3. Sauvegarder
    doc.save(f'facture_{numero}.docx')
    print(f'✅ {numero} créée')`,
            [
                { line: 1, explanation: "On importe openpyxl (pour Excel) et Document (pour Word). Le mariage des deux !", variables: {} },
                { line: 4, explanation: "On ouvre le fichier Excel des commandes.", variables: { classeur: "commandes.xlsx" } },
                { line: 7, explanation: "On parcourt chaque commande. min_row=2 saute l'en-tête. values_only=True récupère les valeurs brutes.", variables: {} },
                { line: 8, explanation: "On extrait le numéro et le client de chaque ligne. ligne[0] = 1re colonne.", variables: { numero: "CMD001", client: "Société Alpha" } },
                { line: 9, explanation: "On extrait les articles (4e colonne) et le montant (5e colonne).", variables: { numero: "CMD001", articles: "Ordinateur x2", montant: 10000 } },
                { line: 12, explanation: "On crée un NOUVEAU document Word pour cette facture.", variables: { doc: "vide" } },
                { line: 13, explanation: "Titre principal avec le numéro de facture.", variables: { doc: "+ titre FACTURE CMD001" } },
                { line: 14, explanation: "On ajoute le nom du client.", variables: { doc: "+ client" } },
                { line: 15, explanation: "On ajoute les articles.", variables: { doc: "+ articles" } },
                { line: 18, explanation: "On crée un run (portion de texte) pour le total.", variables: { run: "TOTAL: 10000 DH" } },
                { line: 19, explanation: "On met le total en GRAS pour qu'il ressorte.", variables: { run: "TOTAL en gras" } },
                { line: 22, explanation: "Sauvegarde avec un nom unique par facture.", variables: { fichier: "facture_CMD001.docx ✓" } },
                { line: 23, explanation: "Confirmation. La boucle recommence pour CMD002, CMD003...", variables: {}, console: "✅ CMD001 créée" },
            ]
        ),
        code("Étape 3 — Convertir en PDF (boucle)", `import win32com.client as win32

word = win32.Dispatch('Word.Application')
word.Visible = False

for numero in ['CMD001', 'CMD002']:
    docx_path = f'facture_{numero}.docx'
    pdf_path = f'facture_{numero}.pdf'

    doc = word.Documents.open(docx_path)
    doc.SaveAs(pdf_path, FileFormat=17)   # 17 = PDF
    doc.Close()
    print(f'PDF créé : {pdf_path}')

word.Quit()`),
        txt("Résultat & améliorations", `
Pour chaque commande : \`facture_CMD001.docx\` + \`facture_CMD001.pdf\`.
**100 commandes → traitées en moins de 2 minutes.**

Améliorations possibles :
- 📧 **Envoyer par email** (smtplib)
- 🖼️ Ajouter un **logo** (\`doc.add_picture\`)
- 🧮 Calculer la **TVA** (montant × 1.2)
- 📁 **Archiver** les fichiers traités
        `),
    ],

    // ═════════════════════════════════════════════════════════════
    "Automatiser la planification (tâches programmées)": [
        txt("Le but final", `
Votre script s'exécute **tout seul** chaque jour / semaine / mois, sans intervention. Vous dormez, il travaille.
        `),
        txt("Solution 1 — Planificateur Windows", `
1. Créez un fichier \`rapport.bat\` :
\`\`\`bat
@echo off
cd /d C:\\Users\\moi\\Documents\\projets
python rapport_quotidien.py
\`\`\`
2. Ouvrez le **Planificateur de tâches** → Créer une tâche de base → Déclencheur : Quotidien à 08:00 → Action : votre .bat
        `),
        codetutor(
            "Solution 2 — En Python pur avec schedule",
            `import schedule
import time

def rapport_quotidien():
    print("📊 Génération du rapport...")
    # Votre code d'automatisation ici
    print("✅ Rapport terminé")

# Programmer
schedule.every().day.at("08:00").do(rapport_quotidien)

print("⏰ Planificateur démarré...")

while True:
    schedule.run_pending()
    time.sleep(60)`,
            [
                { line: 1, explanation: "On importe schedule (planification) et time (pour la pause). pip install schedule", variables: {} },
                { line: 3, explanation: "On définit la fonction à exécuter. Ce sera votre script d'automatisation complet.", variables: {} },
                { line: 4, explanation: "Message de début.", variables: {}, console: "📊 Génération du rapport..." },
                { line: 7, explanation: "Confirmation.", variables: {}, console: "📊 ...\\n✅ Rapport terminé" },
                { line: 10, explanation: "schedule.every().day.at('08:00') programme l'exécution CHAQUE JOUR à 8h00 précises.", variables: { tâche: "tous les jours à 08:00" } },
                { line: 13, explanation: "Message de démarrage.", variables: { tâche: "programmée" }, console: "⏰ Planificateur démarré..." },
                { line: 15, explanation: "Boucle INFINIE : le script tourne en continu.", variables: { boucle: "active" } },
                { line: 16, explanation: "run_pending() vérifie s'il est temps d'exécuter la tâche. Si oui → il la lance.", variables: { boucle: "active" } },
                { line: 17, explanation: "sleep(60) : on vérifie toutes les 60 secondes (pour ne pas saturer le CPU). Le script doit tourner en continu.", variables: { boucle: "active (vérif 60s)" } },
            ]
        ),
        txt("Logger l'exécution", `
Pour savoir ce que fait votre robot (surtout s'il tourne la nuit), utilisez \`logging\` :

\`\`\`python
import logging
logging.basicConfig(
    filename='automatisation.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

def generer_rapport():
    logging.info("Début de la génération")
    try:
        # ... votre code ...
        logging.info("✅ Rapport généré")
    except Exception as e:
        logging.error(f"❌ Erreur : {e}")
\`\`\`

Vous obtenez un fichier log :
\`\`\`
2026-01-15 08:00:00 - Début de la génération
2026-01-15 08:00:01 - ✅ Rapport généré
\`\`\`
        `),
    ],

    // ═════════════════════════════════════════════════════════════
    "Conclusion et prochaines étapes": [
        txt("🎓 Félicitations !", `
Vous avez terminé la formation **Python pour automatiser Excel & Word**. Vous maîtrisez désormais :
        `),
        txt("Ce que vous maîtrisez maintenant", `
**Excel :**
- ✅ Créer des fichiers Excel de zéro
- ✅ Lire et explorer des fichiers existants
- ✅ Mettre en forme (couleurs, bordures, formats)
- ✅ Formules (SUM, IF, VLOOKUP...)
- ✅ Analyser avec pandas (filtres, groupements)
- ✅ Piloter Excel avec win32com (graphiques, PDF)

**Word :**
- ✅ Créer des documents Word complets
- ✅ Mettre en forme (titres, styles, couleurs)
- ✅ Tableaux et images
- ✅ Générer en masse (factures, certificats)
- ✅ Publipostage depuis Excel
- ✅ Convertir en PDF

**Automatisation :**
- ✅ Combiner Excel + Word + PDF
- ✅ Planifier les scripts
- ✅ Logger l'exécution
        `),
        txt("🚀 10 idées d'automatisation à mettre en place", `
1. **Rapport de ventes quotidien** généré automatiquement à 8h
2. **Factures clients** créées depuis un Excel de commandes
3. **Bulletins de paie** générés en masse chaque mois
4. **Attestations** de travail pour les employés
5. **Relevés bancaires** consolidés de plusieurs comptes
6. **Suivi de stock** avec alertes automatiques
7. **Conversion Word→PDF** de tous vos documents
8. **Emails personnalisés** avec pièces jointes
9. **Tableaux de bord Excel** mis à jour chaque semaine
10. **Certificats de formation** pour vos étudiants
        `),
        txt("🎯 Défi final", `
Avant de clôturer, automatisez **une vraie tâche** de votre quotidien :
1. Identifiez une tâche répétitive que vous faites souvent
2. Listez les étapes manuelles
3. Écrivez un script Python qui les reproduit
4. Planifiez-le pour qu'il tourne tout seul
        `),
        txt("Merci !", `
> *« L'automatisation n'est pas une question de remplacer les humains, mais de libérer leur temps pour des tâches à plus forte valeur ajoutée. »*

Vous avez maintenant les outils pour **gagner des heures** chaque semaine. **Bon code et bonne automatisation !** 🐍✨
        `),
    ],
};


async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function findCourseWithRetry() {
    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            return await prisma.course.findUnique({ where: { slug: SLUG }, include: { lessons: true } });
        } catch (e) {
            lastErr = e;
            console.log(`  ⏳ Tentative ${attempt}/5 — DB en réveil (Neon cold start)...`);
            await sleep(4000 * attempt);
        }
    }
    throw lastErr;
}

async function main() {
    const course = await findCourseWithRetry();
    if (!course) throw new Error("Cours introuvable : " + SLUG);

    console.log(`📚 Partie 3 (finale) - Peuplement : ${course.title}\n`);

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

    console.log(`\n🎉 ${totalBlocks} blocs créés. COURS 100% COMPLET !`);
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
