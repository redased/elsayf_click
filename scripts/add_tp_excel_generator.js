/*
 * Ajouter une nouvelle leçon "TP : Générer un vrai fichier Excel" avec
 * le bloc excelgenerator intégré (Pyodide + openpyxl dans le navigateur)
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    let course, lastErr;
    for (let i = 1; i <= 5; i++) {
        try {
            course = await prisma.course.findUnique({
                where: { slug: SLUG },
                include: { lessons: { orderBy: { order: 'asc' } } }
            });
            break;
        } catch (e) { lastErr = e; console.log(`retry ${i}...`); await sleep(4000 * i); }
    }
    if (!course) throw lastErr;

    // Trouver la dernière leçon pour insérer après
    const lastLesson = course.lessons[course.lessons.length - 1];
    const insertOrder = (lastLesson ? lastLesson.order : 0) + 1;

    // Créer la leçon TP
    const lesson = await prisma.lesson.create({
        data: {
            courseId: course.id,
            title: 'TP : Générer un vrai fichier Excel avec Python',
            order: insertOrder,
            duration: 45,
            content: 'Atelier pratique : codez en vrai Python avec openpyxl directement dans le navigateur et téléchargez le fichier Excel généré.',
        },
    });
    console.log(`✅ Leçon créée : ${lesson.title} (order: ${insertOrder})`);

    // Contenu de la leçon
    const blocks = [
        {
            contentType: 'text',
            title: '🎯 Objectif du TP',
            order: 1,
            content: `Dans cet atelier, vous allez **coder en vrai Python** directement dans votre navigateur, exécuter le code, et **télécharger le fichier Excel généré**.

Tout se passe **localement** — aucune donnée n'est envoyée à un serveur. Python s'exécute dans votre navigateur grâce à **Pyodide** (Python compilé en WebAssembly), avec la bibliothèque **openpyxl** chargée en temps réel.

L'éditeur interactif se trouve ci-dessous. Vous pouvez modifier le code et cliquer sur **« Exécuter »** autant de fois que vous le souhaitez.
        `
        },
        {
            contentType: 'text',
            title: 'Atelier Excel interactif',
            order: 2,
            content: '```excelgenerator\n{}\n```'
        },
        {
            contentType: 'text',
            title: '📋 Explications du code',
            order: 3,
            content: `Le code par défaut fait les opérations suivantes :

**1. Création du classeur**
\`\`\`python
classeur = openpyxl.Workbook()
feuille = classeur.active
\`\`\`
Crée un fichier Excel en mémoire avec une feuille active.

**2. En-têtes stylisés**
\`\`\`python
bold = Font(bold=True, color='FFFFFF')
fond = PatternFill(start_color='2F5496', ...)
\`\`\`
Applique un style professionnel (texte blanc sur fond bleu) aux en-têtes.

**3. Remplissage des données**
\`\`\`python
for nom, qte, prix in produits:
    feuille.cell(row=ligne, column=1, value=nom)
    feuille.cell(row=ligne, column=4, value=f'=B{ligne}*C{ligne}')
\`\`\`
Remplit les cellules avec les données ET insère une **formule Excel** (B×C) pour calculer le total.

**4. Sauvegarde**
\`\`\`python
classeur.save('mes_ventes.xlsx')
\`\`\`
Sauvegarde le fichier dans le système virtuel. Le bouton **« Télécharger »** apparaît ensuite.
        `
        },
        {
            contentType: 'text',
            title: '🧪 Défis à essayer',
            order: 4,
            content: `Maintenant modifiez le code pour réaliser ces défis :

**Défi 1 — Ajouter des produits**
Ajoutez 3 nouveaux produits dans la liste \`produits\` :
\`\`\`python
('Clavier', 25, 12.0),
('Écran', 10, 250.0),
('Casque', 40, 35.0),
\`\`\`

**Défi 2 — Ajouter la TVA**
Après le total, ajoutez une ligne TVA à 20% avec une formule :
\`\`\`python
feuille.cell(row=ligne+2, column=3, value='TVA (20%) :')
feuille.cell(row=ligne+2, column=4, value=f'=D{ligne}*0.2')
\`\`\`

**Défi 3 — Changer le thème de couleurs**
Remplacez le \`2F5496\` (bleu) par \`C6EFCE\` (vert) ou \`FFC7CE\` (rouge).

**Défi 4 — Générer depuis des données aléatoires**
Utilisez \`import random\` pour générer 20 produits aléatoires.

Chaque modification → cliquez sur **« Exécuter »** → téléchargez le nouveau fichier !
        `
        },
    ];

    for (const block of blocks) {
        await prisma.courseContent.create({
            data: { ...block, lessonId: lesson.id },
        });
    }

    console.log(`  ✅ ${blocks.length} blocs de contenu créés`);
    console.log(`\n🎉 Leçon TP ajoutée (${course.lessons.length + 1} leçons au total)`);
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
