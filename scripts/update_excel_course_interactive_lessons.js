/*
 * Script d'amélioration et enrichissement de la formation
 * "Python pour automatiser Excel & Word"
 * Intègre les générateurs interactifs de vrais fichiers Excel avec tableur direct
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    console.log('🚀 Démarrage de la mise à jour des leçons pour :', SLUG);

    const course = await prisma.course.findUnique({
        where: { slug: SLUG },
        include: { lessons: { orderBy: { order: 'asc' }, include: { contents: true } } }
    });

    if (!course) {
        console.error('❌ Cours introuvable avec le slug', SLUG);
        return;
    }

    console.log(`✅ Cours trouvé : "${course.title}" (${course.lessons.length} leçons)`);

    // =========================================================================
    // ENRICHISSEMENT LEÇON 3 : Créer son premier fichier Excel avec openpyxl
    // =========================================================================
    const lesson3 = course.lessons.find(l => l.order === 3 || l.title.includes('Créer son premier fichier Excel'));
    if (lesson3) {
        console.log('📝 Enrichissement Leçon 3...');
        // Supprimer anciens contenus
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson3.id } });

        const blocks3 = [
            {
                contentType: 'text',
                title: 'Les concepts fondamentaux d\'openpyxl',
                order: 1,
                content: `### 🎯 Pourquoi créer des fichiers Excel avec Python ?

Créer un classeur Excel manuellement prend du temps et est source d'erreurs. Avec la bibliothèque **openpyxl**, vous pouvez automatiser la création de fichiers \`.xlsx\` complets en quelques lignes de code.

Dans cette leçon, vous allez comprendre la structure d'un classeur Excel en Python :
1. **Workbook (Classeur)** : Le fichier Excel complet qui contient une ou plusieurs feuilles.
2. **Worksheet (Feuille de calcul)** : La grille de cellules (ex: "Feuil1", "Ventes_2026").
3. **Cell (Cellule)** : L'intersection d'une colonne (lettre) et d'une ligne (chiffre), par exemple \`A1\`, \`C5\`.

> 💡 **Le saviez-vous ?** Les fichiers \`.xlsx\` modernes sont en réalité des archives ZIP contenant du code XML standardisé. \`openpyxl\` manipule ce format nativement sans avoir besoin que Microsoft Excel soit installé sur votre machine !`
            },
            {
                contentType: 'text',
                title: '⚡ Atelier Pratique Direct : Générez votre 1er classeur Excel',
                order: 2,
                content: `Exécutez le code Python ci-dessous directement sur la plateforme. Le moteur compile votre script en temps réel, génère un **vrai fichier Excel .xlsx**, affiche le **tableur interactif en direct** et vous permet de le télécharger sur votre ordinateur !

\`\`\`excelgenerator
{"template": "libre", "title": "Atelier : Créer et télécharger son 1er classeur Excel"}
\`\`\`
`
            },
            {
                contentType: 'text',
                title: 'Explications détaillées du code pas à pas',
                order: 3,
                content: `Voici comment fonctionne le code que vous venez d'exécuter :

**1. Importation et création du classeur :**
\`\`\`python
import openpyxl

# Créer un nouveau classeur vierge en mémoire
wb = openpyxl.Workbook()

# Sélectionner la feuille active par défaut
ws = wb.active
ws.title = "MesProduits"
\`\`\`

**2. Écriture dans des cellules ciblées :**
\`\`\`python
# Accès direct par coordonnées
ws['A1'] = "RAPPORT DE STOCK"

# Ou via la méthode cell(row, column)
ws.cell(row=2, column=1, value="Article")
ws.cell(row=2, column=2, value="Quantité")
\`\`\`

**3. Boucle d'insertion de données et formules :**
\`\`\`python
donnees = [("Stylo", 50, 2.5), ("Cahier", 30, 4.0)]
for r_idx, (nom, qte, pu) in enumerate(donnees, start=3):
    ws.cell(row=r_idx, column=1, value=nom)
    ws.cell(row=r_idx, column=2, value=qte)
    ws.cell(row=r_idx, column=3, value=pu)
    ws.cell(row=r_idx, column=4, value=f"=B{r_idx}*C{r_idx}")  # Formule de multiplication
\`\`\`

**4. Sauvegarde physique du fichier :**
\`\`\`python
wb.save('mon_premier_classeur.xlsx')
\`\`\``
            },
            {
                contentType: 'text',
                title: '🧪 Exercice guidé & Défi',
                order: 4,
                content: `### 🎯 À vous de jouer dans l'éditeur interactif ci-dessus !

1. Ajoutez 2 nouveaux articles dans la liste \`donnees\` (ex: \`("Calculatrice", 15, 2500)\`).
2. Modifiez le titre de la feuille pour qu'il s'appelle \`"Inventaire_2026"\`.
3. Cliquez sur **« Exécuter & Générer l'Excel »** pour voir vos modifications apparaître instantanément dans le tableur.
4. Téléchargez le fichier final et ouvrez-le avec Excel ou LibreOffice !`
            }
        ];

        for (const b of blocks3) {
            await prisma.courseContent.create({ data: { lessonId: lesson3.id, ...b } });
        }
    }

    // =========================================================================
    // ENRICHISSEMENT LEÇON 5 : Mise en forme et styles dans Excel
    // =========================================================================
    const lesson5 = course.lessons.find(l => l.order === 5 || l.title.includes('Mise en forme et styles'));
    if (lesson5) {
        console.log('📝 Enrichissement Leçon 5...');
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson5.id } });

        const blocks5 = [
            {
                contentType: 'text',
                title: 'L\'importance de la mise en forme professionnelle',
                order: 1,
                content: `Un fichier Excel automatisé doit être **aussi beau et soigné** qu'un fichier créé par un designer. \`openpyxl\` dispose d'un module \`openpyxl.styles\` ultra complet :

- **Font** : Police, taille, gras (\`bold=True\`), italique, couleur hexadécimale (\`color="FFFFFF"\`).
- **PatternFill** : Couleurs de fond pleines (\`fill_type="solid"\`) pour en-têtes, totaux ou alertes.
- **Alignment** : Alignement horizontal (\`left\`, \`center\`, \`right\`) et vertical (\`center\`), retour à la ligne (\`wrap_text=True\`).
- **Border & Side** : Bordures fines, épaisses ou doubles pour les lignes de totaux comptables.
- **Number Formats** : Formats monétaires (\`#,##0.00 DZD\`), pourcentages (\`0.0%\`), dates.`
            },
            {
                contentType: 'text',
                title: '⚡ Atelier Pratique : Facture Professionnelle Stylisée',
                order: 2,
                content: `Testez ci-dessous la génération d'une **vraie facture d'entreprise B2B complète** avec en-têtes bleu navy, bordures professionnelles, calculs de remise, TVA 19% et Net à Payer TTC.

\`\`\`excelgenerator
{"template": "facture", "title": "Cas Réel : Facture B2B Professionnelle & TVA"}
\`\`\`
`
            },
            {
                contentType: 'text',
                title: 'Mémento des styles openpyxl les plus utilisés',
                order: 3,
                content: `### 🎨 Guide de style rapide openpyxl

\`\`\`python
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# 1. En-tête professionnel bleu nuit
fond_bleu = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
texte_blanc = Font(name="Calibri", size=11, bold=True, color="FFFFFF")

# 2. Alignement centré
centre = Alignment(horizontal="center", vertical="center")

# 3. Bordure discrète
gris = Side(border_style="thin", color="CBD5E1")
bordure = Border(left=gris, right=gris, top=gris, bottom=gris)

# 4. Formats numériques
cellule_prix.number_format = '#,##0.00 DZD'
cellule_taux.number_format = '0.0%'
\`\`\``
            },
            {
                contentType: 'text',
                title: '🧪 Défi de style',
                order: 4,
                content: `Dans l'atelier ci-dessus :
1. Changez la couleur de l'en-tête de la facture pour un vert émeraude (\`0F766E\`) ou bordeaux (\`881337\`).
2. Passez le taux de TVA de 19% à 9%.
3. Re-générez le fichier et constatez la mise à jour immédiate dans l'aperçu tableur et au téléchargement !`
            }
        ];

        for (const b of blocks5) {
            await prisma.courseContent.create({ data: { lessonId: lesson5.id, ...b } });
        }
    }

    // =========================================================================
    // ENRICHISSEMENT LEÇON 6 : Formules et calculs automatiques
    // =========================================================================
    const lesson6 = course.lessons.find(l => l.order === 6 || l.title.includes('Formules et calculs'));
    if (lesson6) {
        console.log('📝 Enrichissement Leçon 6...');
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson6.id } });

        const blocks6 = [
            {
                contentType: 'text',
                title: 'Insérer des formules Excel dynamiques avec Python',
                order: 1,
                content: `### 🧮 Pourquoi insérer des formules plutôt que des valeurs fixes ?

Lorsque vous générez un fichier Excel, il y a deux approches :
1. **Calculer en Python et écrire le résultat fixe** (ex: \`ws['D10'] = 15000\`).
2. **Insérer une vraie formule Excel** (ex: \`ws['D10'] = "=SUM(D2:D9)"\`).

> ⭐ **La bonne pratique :** Insérez toujours des **formules Excel** ! Ainsi, si votre client ou collègue modifie une quantité ou un prix dans le fichier Excel après coup, tous les totaux se recalculent automatiquement dans Excel !

⚠️ **Règle d'or :** Dans \`openpyxl\`, les noms de fonctions Excel doivent **TOUJOURS être écrits en anglais** (\`SUM\`, \`AVERAGE\`, \`IF\`, \`COUNTIF\`, \`VLOOKUP\`), même si votre Excel est en français.`
            },
            {
                contentType: 'text',
                title: '⚡ Atelier Pratique : Tableau de Bord KPIs & Calculs de Commissions',
                order: 2,
                content: `Exécutez ce tableau de bord commercial qui utilise des formules avancées : ratios de réalisation en \`%\`, conditions \`IF\` pour déterminer le statut d'objectif, et calcul de commissions vendeur à taux variable.

\`\`\`excelgenerator
{"template": "kpi", "title": "Cas Réel : KPIs Ventes & Formules Conditionnelles"}
\`\`\`
`
            },
            {
                contentType: 'text',
                title: '⚡ Atelier Pratique 2 : Gestion de Paie & Retenues Sociales',
                order: 3,
                content: `Voici un autre exemple concret : calcul automatique de la masse salariale avec formules de retenues de cotisations sociales (\`CNAS 9%\`), impôt (\`IRG 10%\`) et Net à payer.

\`\`\`excelgenerator
{"template": "paie", "title": "Cas Réel : Fiche de Paie & Formules Mathématiques"}
\`\`\`
`
            },
            {
                contentType: 'text',
                title: '📋 Tableau des formules Excel courantes en Python',
                order: 4,
                content: `| Fonction Anglaise | Équivalent Français | Exemple de syntaxe en Python |
|---|---|---|
| **SUM** | SOMME | \`ws['D10'] = f"=SUM(D2:D{derniere_ligne})"\` |
| **AVERAGE** | MOYENNE | \`ws['E10'] = "=AVERAGE(E2:E9)"\` |
| **IF** | SI | \`ws['F2'] = '=IF(D2>=1000, "BONUS", "NORMAL")'\` |
| **COUNTIF** | NB.SI | \`ws['B12'] = '=COUNTIF(H2:H8, "*URGENT*")'\` |
| **ROUND** | ARRONDI | \`ws['C5'] = "=ROUND(A5*1.19, 2)"\` |`
            }
        ];

        for (const b of blocks6) {
            await prisma.courseContent.create({ data: { lessonId: lesson6.id, ...b } });
        }
    }

    // =========================================================================
    // ENRICHISSEMENT LEÇON 7 : Analyse de données Excel avec pandas
    // =========================================================================
    const lesson7 = course.lessons.find(l => l.order === 7 || l.title.includes('Analyse de données Excel'));
    if (lesson7) {
        console.log('📝 Enrichissement Leçon 7...');
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson7.id } });

        const blocks7 = [
            {
                contentType: 'text',
                title: 'La puissance combinée de Pandas et OpenPyXL',
                order: 1,
                content: `### 📊 Pourquoi associer Pandas et OpenPyXL ?

- **Pandas** est imbattable pour charger, filtrer, agréger et nettoyer des millions de lignes de données en une fraction de seconde.
- **OpenPyXL** est parfait pour appliquer des styles sur mesure, des formules, des bordures et organiser des classeurs multi-feuilles.

Ensemble, ils forment le duo ultime pour l'automatisation bureautique et le reporting d'entreprise !`
            },
            {
                contentType: 'text',
                title: '⚡ Atelier Pratique : Gestion d\'Inventaire & Alertes Réassort',
                order: 2,
                content: `Découvrez comment analyser un état de stock, calculer les valeurs globales et détecter automatiquement les articles sous le seuil critique de sécurité.

\`\`\`excelgenerator
{"template": "stock", "title": "Cas Réel : Gestion de Stock & Détection de Rupture"}
\`\`\`
`
            },
            {
                contentType: 'text',
                title: '⚡ Atelier Pratique 2 : Nettoyage Automatisé de Données (Data Cleaning)',
                order: 3,
                content: `Nettoyage et standardisation automatique d'une base clients brute : suppression des espaces parasites, uniformisation des minuscules/majuscules, standardisation des numéros de téléphone au format international (+213) et validation de statut.

\`\`\`excelgenerator
{"template": "datacleaning", "title": "Cas Réel : Pipeline de Nettoyage de Données"}
\`\`\`
`
            }
        ];

        for (const b of blocks7) {
            await prisma.courseContent.create({ data: { lessonId: lesson7.id, ...b } });
        }
    }

    // =========================================================================
    // ENRICHISSEMENT LEÇON 14 : TP : Générer un vrai fichier Excel avec Python
    // =========================================================================
    const lesson14 = course.lessons.find(l => l.order === 14 || l.title.includes('TP : Générer un vrai fichier Excel'));
    if (lesson14) {
        console.log('📝 Enrichissement Leçon 14 (TP Global)...');
        await prisma.courseContent.deleteMany({ where: { lessonId: lesson14.id } });

        const blocks14 = [
            {
                contentType: 'text',
                title: '🎯 Objectif du Grand TP d\'Automatisation Excel',
                order: 1,
                content: `### 🏆 Bienvenue dans le grand atelier pratique interactif !

Dans ce TP complet, vous avez accès à l'ensemble des **7 cas réels d'entreprise** :
1. 🧾 **Facture Professionnelle B2B & Calcul de TVA**
2. 📊 **Tableau de Bord Commercial & KPIs avec Formules Conditionnelles**
3. 📦 **Gestion de Stock & Alertes Automatiques de Réapprovisionnement**
4. 💰 **Fiche de Paie & Salaires Mensuels avec Retenues Sociales**
5. 📈 **Consolidation Multi-Feuilles (3 Onglets avec Liaisons Inter-Feuilles)**
6. 🧹 **Nettoyage et Standardisation de Données (Data Cleaning)**
7. ⚡ **Atelier Libre (Sandbox)** pour coder vos propres automatisations de zéro.

Tout s'exécute **directement dans votre navigateur** grâce à la technologie WebAssembly. Vous pouvez modifier le code, changer les formules, ajouter des colonnes, inspecter le tableur généré en direct et télécharger les fichiers \`.xlsx\` finaux !`
            },
            {
                contentType: 'text',
                title: 'Atelier Multi-Modèles & Générateur Excel Complet',
                order: 2,
                content: `\`\`\`excelgenerator
{"template": "facture", "title": "Grand Atelier Interactif : 7 Cas Pratiques d'Automatisation"}
\`\`\`
`
            },
            {
                contentType: 'text',
                title: '🧪 5 Défis Pratiques pour Valider vos Compétences',
                order: 3,
                content: `Pour devenir un expert de l'automatisation Excel, réalisez les 5 défis suivants :

1. **Défi Facturation :** Dans le modèle Facture, ajoutez une ligne d'article pour une prestation *"Déploiement Serveur & Sécurité"* à 55 000 DZD avec une remise de 8%, et vérifiez que le Net à Payer s'actualise correctement.
2. **Défi KPIs :** Dans le tableau commercial, changez le seuil de bonus pour qu'une commission de 10% soit accordée si l'objectif est dépassé à plus de 110% (\`>= 1.10\`).
3. **Défi Alertes Stock :** Ajoutez un nouveau produit avec 2 unités en stock et un seuil de sécurité de 10, et vérifiez que la formule affiche bien \`🚨 COMMANDE REQUISE\`.
4. **Défi Multi-Feuilles :** Dans le modèle multi-feuilles, ajoutez une 4ème feuille *"Mars_2026"* et intégrez-la dans la feuille de synthèse.
5. **Défi Export :** Téléchargez chacun des fichiers \`.xlsx\` générés et ouvrez-les dans votre tableur favori (Excel, Calc, Google Sheets) pour vérifier la perfection des formules et des styles !`
            }
        ];

        for (const b of blocks14) {
            await prisma.courseContent.create({ data: { lessonId: lesson14.id, ...b } });
        }
    }

    console.log('🎉 Mise à jour terminée avec succès !');
}

main()
    .catch(e => {
        console.error('❌ Erreur lors de la mise à jour :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
