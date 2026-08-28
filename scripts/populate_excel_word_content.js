/*
 * Populate CourseContent pour le cours "Python pour automatiser Excel & Word"
 * Alterne blocs texte (markdown riche) + blocs codetutor (code animé IA)
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

// Helper pour créer un bloc codetutor (code animé qui s'écrit + explication IA étape par étape)
// ⚠️ Doit être un bloc 'text' contenant un code-fence markdown ```codetutor
// pour que RichText déclenche le composant PythonCodeTutor.
function codetutor(title, code, steps) {
    const json = JSON.stringify({ title, code, steps });
    return {
        contentType: 'text',
        title: 'Démonstration animée',
        content: '```codetutor\n' + json + '\n```',
    };
}
// Helper pour un bloc texte riche
function txt(title, markdown) {
    return { contentType: 'text', title, content: markdown };
}
// Helper pour un bloc code simple (CodeBlock stylé, statique)
function code(title, code) {
    return { contentType: 'code', title, content: code };
}

// Les contenus par leçon (titre de la leçon -> blocs)
const LESSON_CONTENTS = {

    // ─────────────────────────────────────────────────────────────
    "Introduction : Pourquoi automatiser Excel & Word ?": [
        txt("Le problème", `
Imaginez : chaque fin de mois, vous devez ouvrir **5 fichiers Excel**, copier des données, les coller dans un récapitulatif, calculer des totaux, puis créer un **rapport Word** avec les résultats.

> **Comparaison :** 4 heures de travail manuel contre **30 secondes** avec Python.

Dans cette formation, vous allez apprendre à transformer toutes ces tâches répétitives en scripts qui travaillent pour vous, même pendant que vous dormez.
        `),
        txt("Ce que Python peut faire pour vous", `
**Avec Excel :**
- Lire des milliers de cellules instantanément
- Créer des fichiers Excel à partir de zéro
- Appliquer des formules et des mises en forme
- Fusionner plusieurs fichiers en un seul

**Avec Word :**
- Générer des dizaines de documents personnalisés
- Remplir des modèles (factures, contrats, certificats)
- Convertir Word en PDF en masse
        `),
        code("Exemple concret", `import openpyxl
from docx import Document

# 1. Lire les ventes dans Excel
classeur = openpyxl.load_workbook('ventes.xlsx')
feuille = classeur['Janvier']
total = sum(c.value for c in feuille['B2:B100'] if c.value)

# 2. Créer un rapport Word
doc = Document()
doc.add_heading('Rapport Mensuel des Ventes', 0)
doc.add_paragraph(f'Total des ventes : {total} DH')
doc.save('rapport.docx')
print('Rapport généré en 2 secondes !')`),
        txt("Votre parcours", `
1. **Module 1** — Installation et premiers pas
2. **Module 2** — Maîtriser Excel avec openpyxl
3. **Module 3** — Analyse de données avec pandas
4. **Module 4** — Word automatisé avec python-docx
5. **Module 5** — Projets concrets et automatisation avancée
        `),
    ],

    // ─────────────────────────────────────────────────────────────
    "Installer Python et préparer son environnement": [
        txt("Télécharger Python", `
Rendez-vous sur **[python.org](https://www.python.org/downloads/)** et téléchargez la dernière version (3.11 ou supérieure).

> ⚠️ **IMPORTANT sur Windows** : Cochez la case **"Add Python to PATH"** en bas de l'installateur, sinon les commandes ne fonctionneront pas !
        `),
        code("Vérifier l'installation", `# Dans un terminal (cmd / PowerShell)
python --version
# Devrait afficher : Python 3.11.x`),
        code("Installer les bibliothèques essentielles", `# Pour Excel
pip install openpyxl

# Pour Word
pip install python-docx

# Pour l'analyse de données
pip install pandas

# (Windows uniquement) Pour piloter Excel/Word
pip install pywin32`),
        codetutor(
            "Votre premier script Python",
            `print("Bonjour Excel & Word !")

import openpyxl
import docx

print("Bibliothèques prêtes !")`,
            [
                { line: 1, explanation: "On commence par afficher un message avec la fonction print(). C'est la façon la plus simple de communiquer avec l'utilisateur.", variables: {} },
                { line: 3, explanation: "On importe la bibliothèque openpyxl qui permet de manipuler les fichiers Excel (.xlsx).", variables: {} },
                { line: 4, explanation: "On importe python-docx pour manipuler les fichiers Word (.docx).", variables: {} },
                { line: 6, explanation: "Si aucun message d'erreur ne s'affiche, toutes vos bibliothèques sont correctement installées. Vous êtes prêt à automatiser !", variables: {}, console: "Bonjour Excel & Word !\nBibliothèques prêtes !" },
            ]
        ),
        txt("Astuce : Environnement virtuel", `
Pour les projets sérieux, créez un environnement virtuel afin d'isoler vos bibliothèques :

\`\`\`bash
python -m venv mon_env
mon_env\\Scripts\\activate   # Windows
source mon_env/bin/activate # Mac/Linux
\`\`\`
        `),
    ],

    // ─────────────────────────────────────────────────────────────
    "Créer son premier fichier Excel avec openpyxl": [
        txt("Les concepts de base", `
- **Workbook** (Classeur) = un fichier Excel entier
- **Worksheet** (Feuille) = un onglet dans le fichier
- **Cell** (Cellule) = une case (ex: A1, B2)
        `),
        codetutor(
            "Créer un fichier Excel de zéro",
            `import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.title = "Mes Ventes"

feuille['A1'] = 'Produit'
feuille['B1'] = 'Quantité'
feuille['A2'] = 'Stylo'
feuille['B2'] = 50

classeur.save('mes_ventes.xlsx')
print("Fichier créé !")`,
            [
                { line: 1, explanation: "On importe openpyxl, la bibliothèque de référence pour créer et lire des fichiers Excel (.xlsx).", variables: {} },
                { line: 3, explanation: "Workbook() crée un NOUVEAU classeur Excel vide en mémoire. Rien n'est encore sauvegardé sur le disque.", variables: { classeur: "Workbook (vide)" } },
                { line: 4, explanation: ".active sélectionne la feuille par défaut (Feuil1) qui existe déjà dans tout nouveau classeur.", variables: { classeur: "Workbook", feuille: "Sheet (vide)" } },
                { line: 5, explanation: "On renomme la feuille pour qu'elle soit plus parlante. Vous verrez 'Mes Ventes' comme onglet.", variables: { classeur: "Workbook", feuille: "Mes Ventes" } },
                { line: 7, explanation: "On écrit dans la cellule A1. La notation ['A1'] correspond à la colonne A, ligne 1.", variables: { classeur: "Workbook", feuille: "Mes Ventes", "A1": "Produit" } },
                { line: 8, explanation: "On remplit l'en-tête de la colonne B (Quantité).", variables: { classeur: "Workbook", feuille: "Mes Ventes", "A1": "Produit", "B1": "Quantité" } },
                { line: 9, explanation: "Premier produit : un stylo dans la cellule A2.", variables: { classeur: "Workbook", feuille: "Mes Ventes", "A1": "Produit", "B1": "Quantité", "A2": "Stylo" } },
                { line: 10, explanation: "Quantité associée : 50 stylos dans B2. Notez qu'on met un NOMBRE (pas de guillemets).", variables: { classeur: "Workbook", feuille: "Mes Ventes", "A1": "Produit", "B1": "Quantité", "A2": "Stylo", "B2": 50 } },
                { line: 12, explanation: "La méthode save() écrit enfin le classeur sur le disque sous 'mes_ventes.xlsx'. Jusqu'ici tout était en mémoire.", variables: { classeur: "Workbook", feuille: "Mes Ventes", fichier: "mes_ventes.xlsx" } },
                { line: 13, explanation: "C'est fini ! Votre premier fichier Excel existe maintenant sur votre disque. Ouvrez-le pour vérifier.", variables: { fichier: "mes_ventes.xlsx ✓" }, console: "Fichier créé !" },
            ]
        ),
        txt("Ajouter plusieurs lignes rapidement", `
La méthode \`append()\` permet d'ajouter une ligne entière d'un coup, ce qui est très pratique pour les tableaux :

\`\`\`python
feuille.append(['Nom', 'Âge', 'Ville'])
donnees = [
    ['Alice', 25, 'Paris'],
    ['Bob', 30, 'Lyon'],
]
for ligne in donnees:
    feuille.append(ligne)
\`\`\`
        `),
        code("Créer plusieurs feuilles", `classeur = openpyxl.Workbook()
feuille_janvier = classeur.active
feuille_janvier.title = "Janvier"

feuille_fevrier = classeur.create_sheet("Février")
feuille_mars = classeur.create_sheet("Mars")

classeur.save('trimestre.xlsx')`),
        txt("🎯 Exercice", `
Créez un fichier \`stock.xlsx\` avec : Article, Prix, Quantité — et 5 articles de votre choix.

<details>
<summary>📝 Solution</summary>

\`\`\`python
import openpyxl
classeur = openpyxl.Workbook()
feuille = classeur.active
feuille.append(['Article', 'Prix', 'Quantité'])
feuille.append(['Ordinateur', 5000, 12])
feuille.append(['Souris', 80, 50])
feuille.append(['Clavier', 150, 30])
classeur.save('stock.xlsx')
\`\`\`
</details>
        `),
    ],
};


async function main() {
    const course = await prisma.course.findUnique({ where: { slug: SLUG }, include: { lessons: true } });
    if (!course) throw new Error("Cours introuvable : " + SLUG);

    console.log(`📚 Peuplement des contenus pour : ${course.title}`);
    console.log(`   ${course.lessons.length} leçons au total\n`);

    let totalBlocks = 0;
    for (const lesson of course.lessons) {
        const blocks = LESSON_CONTENTS[lesson.title];
        if (!blocks) {
            console.log(`  ⏭️  "${lesson.title}" → aucun contenu défini (sera ajouté plus tard)`);
            continue;
        }

        // Nettoyer les anciens contenus
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson.id } });

        for (let i = 0; i < blocks.length; i++) {
            await prisma.courseContent.create({
                data: { ...blocks[i], lessonId: lesson.id, order: i + 1 },
            });
        }
        totalBlocks += blocks.length;
        console.log(`  ✅ "${lesson.title}" → ${blocks.length} bloc(s)`);
    }

    console.log(`\n🎉 Terminé ! ${totalBlocks} blocs de contenu créés.`);
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
