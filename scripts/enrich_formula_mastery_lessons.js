/**
 * ENRICHISSEMENT INTERACTIF : EXPERT EN FORMULES EXCEL
 * Formation : Python pour automatiser Excel & Word (python-automatisation-excel-word)
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'python-automatisation-excel-word';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function withRetry(fn, retries = 5, delay = 3000) {
    let err;
    for (let i = 1; i <= retries; i++) {
        try { return await fn(); }
        catch (e) { err = e; console.log(`⚠️ Tentative ${i}/${retries} échouée (${e.message}). Reconnexion dans ${delay/1000}s...`); await sleep(delay); }
    }
    throw err;
}

function txt(title, content) { return { contentType: 'text', title, content }; }
function formulaLab(title = '🧮 Laboratoire Interactif : Devenir Expert en Formules Excel (Simulateur & Défis)', config = {}) {
    return {
        contentType: 'text',
        title,
        content: '```excelformula\n' + JSON.stringify(config) + '\n```'
    };
}

const FORMULA_BLOCKS = {
    // ─────────────── LEÇON 6 : Formules et calculs automatiques ────────────────
    "Formules et calculs automatiques": [
        formulaLab("🧮 Laboratoire Interactif : Devenir Expert en Formules Excel (Simulateur & Défis)", {
            title: "Simulateur Interactif de Formules Avancées & Défis Métier",
            defaultFormula: "xlookup"
        }),

        txt("🔍 Masterclass RECHERCHEX (XLOOKUP) : Pourquoi RECHERCHEV est Mort", `
### ⚡ La Révolution des Formules de Recherche dans Excel

Pendant 25 ans, la formule la plus utilisée (et la plus détestée) du monde professionnel était **RECHERCHEV (VLOOKUP)**.

#### ❌ Les 3 défauts majeurs de RECHERCHEV :
1. **Elle ne sait pas chercher vers la gauche :** La clé de recherche doit obligatoirement être dans la toute première colonne du tableau. Si votre référence est en colonne C et le prix en colonne A, RECHERCHEV est impuissante !
2. **Elle casse dès qu'on insère une colonne :** Le numéro d'index de colonne est écrit en dur (\`=RECHERCHEV(A2, B:Z, 4, FAUX)\`). Si un collègue insère une colonne, le 4 pointe vers la mauvaise donnée sans prévenir !
3. **Elle renvoie une erreur moche \`#N/A\` :** Obligation d'ajouter un \`SIERREUR(...)\` autour, ce qui alourdit inutilement le code.

---

### ⭐ Pourquoi RECHERCHEX (XLOOKUP) est 10x Supérieure

\`\`\`excel
=RECHERCHEX(valeur_cherchée; tableau_recherche; tableau_renvoyé; [si_non_trouvé]; [mode_correspondance])
\`\`\`

- **Insensible aux ajouts de colonnes :** On référence des plages précises (\`A2:A100\`, \`G2:G100\`).
- **Cherche dans TOUTES les directions :** Vers la gauche, la droite, le haut ou le bas !
- **Gestion d'erreur native :** Le 4ème argument remplace le message \`#N/A\` par votre propre texte (ex: *"Article inconnu"*).

#### 🐍 Écriture dans openpyxl (Règle d'or) :
Dans vos scripts Python, utilisez **toujours le nom anglais \`XLOOKUP\`** :

\`\`\`python
ws[f'H{row}'] = f'=XLOOKUP(F{row}, A$2:A$100, G$2:G$100, "Non trouvé", 0)'
\`\`\`
*(À l'ouverture dans un Excel en français, Microsoft le traduira automatiquement en RECHERCHEX).*
`),

        txt("🇩🇿 Cas Métier Réel : Rapprochement Factures et Règlements Bancaires", `
### 🏦 Contexte Entreprise : Rapprochement Bancaire Automatique

La société **SARL Oran Logistique** reçoit chaque fin de mois un relevé bancaire de 1 200 lignes au format Excel. L'objectif est de vérifier pour chaque numéro de virement client si la facture correspondante existe et si le montant réglé est exact.

\`\`\`python
import openpyxl

wb = openpyxl.load_workbook("Rapprochement_Mensuel.xlsx")
ws = wb["Releve_Bancaire"]

# Pour chaque ligne du relevé, on cherche le statut dans la feuille 'Factures_Emises'
for r in range(2, ws.max_row + 1):
    # Chercher le montant facturé via XLOOKUP sur la feuille 'Factures'
    ws[f'E{r}'] = f'=XLOOKUP(B{r}, Factures!A:A, Factures!D:D, "Facture Introuvable", 0)'
    
    # Calculer l'écart par formule
    ws[f'F{r}'] = f'=IF(ISNUMBER(E{r}), C{r}-E{r}, "À Vérifier")'

wb.save("Rapprochement_Verifie.xlsx")
print("✅ 1 200 lignes rapprochées instantanément par formules !")
\`\`\`
`),

        txt("⚡ Le Barème de l'IRG Algérien par Formule SI.CONDITIONS (IFS)", `
### 💵 Calculer des Paliers Complexes sans SI Imbriqués

Sous Excel, les calculs de barèmes progressifs (tranches d'impôt, commissions par paliers, remises volume) étaient auparavant un calvaire de parenthèses : \`=SI(A1>100; "A"; SI(A1>50; "B"; SI(A1>20; "C"; "D")))\`.

La formule moderne **\`SI.CONDITIONS\` (en anglais \`IFS\`)** élimine ce problème :

\`\`\`excel
=SI.CONDITIONS(Brut<=30000; 0; Brut<=35000; (Brut-30000)*0.23; VRAI; (Brut-35000)*0.28 + 1150)
\`\`\`

#### En Python avec openpyxl :
\`\`\`python
formule_irg = f'=IFS(F{row}<=30000, 0, F{row}<=35000, (F{row}-30000)*0.23, TRUE, (F{row}-35000)*0.28 + 1150)'
ws.cell(row=row, column=8, value=formule_irg)
\`\`\`
> 💡 **Conseil d'Expert :** Terminez toujours une formule \`IFS\` par la condition \`TRUE\` (ou \`VRAI\` en FR) pour définir la valeur par défaut pour tous les cas restants !
`),

        txt("📊 Agrégation Multi-Critères : SOMME.SI.ENS & NB.SI.ENS", `
### 📈 Créer des Tableaux de Bord Dynamiques sans TCD

Les fonctions **\`SOMME.SI.ENS\` (SUMIFS)** et **\`NB.SI.ENS\` (COUNTIFS)** permettent d'agréger des données massives selon 2, 3 ou 10 conditions combinées.

| Fonction | En Français 🇫🇷 | En Anglais (openpyxl) 🇬🇧 | Exemple d'Application |
|---|---|---|---|
| **Somme Multi-Conditions** | \`SOMME.SI.ENS(plage_somme; c1; v1; c2; v2)\` | \`SUMIFS(sum_range, c1, v1, c2, v2)\` | Somme des ventes pour Alger ET catégorie "Matériel" |
| **Comptage Multi-Conditions** | \`NB.SI.ENS(c1; v1; c2; v2)\` | \`COUNTIFS(c1, v1, c2, v2)\` | Nombre d'articles en rupture ET dépôt Alger |
| **Moyenne Multi-Conditions** | \`MOYENNE.SI.ENS(plage_moy; c1; v1)\` | \`AVERAGEIFS(avg_range, c1, v1)\` | Panier moyen des clients VIP |

\`\`\`python
# Formule injectée via openpyxl
ws['C15'] = '=SUMIFS(Ventes!E:E, Ventes!B:B, "Alger", Ventes!D:D, ">=50000")'
\`\`\`
`)
    ],

    // ─────────────── LEÇON 14 : Grand Atelier Pratique TP ────────────────
    "TP : Générer un vrai fichier Excel avec Python": [
        formulaLab("🧮 Simulateur & Assistant Formules pour Votre Grand TP", {
            title: "Laboratoire de Référence pour Votre Projet Final",
            defaultFormula: "xlookup"
        })
    ]
};

async function main() {
    console.log('🚀 Début de l\'enrichissement interactif Formules Expert...');
    
    const course = await withRetry(() => prisma.course.findUnique({
        where: { slug: SLUG },
        include: { lessons: { orderBy: { order: 'asc' }, include: { contents: true } } }
    }));

    if (!course) {
        console.error(`❌ Cours avec le slug "${SLUG}" non trouvé.`);
        return;
    }

    console.log(`✅ Cours trouvé : "${course.title}" (${course.lessons.length} leçons)`);

    for (const [lessonTitle, blocks] of Object.entries(FORMULA_BLOCKS)) {
        const lesson = course.lessons.find(l => l.title.includes(lessonTitle) || lessonTitle.includes(l.title));
        if (!lesson) {
            console.warn(`⚠️ Leçon introuvable pour "${lessonTitle}"`);
            continue;
        }

        console.log(`\n📦 Traitement de la leçon : "${lesson.title}" (actuellement ${lesson.contents.length} blocs)`);

        // Pour la Leçon 6, on place le laboratoire de formules en tête pour un impact maximal
        let currentOrder = lesson.contents.length;
        
        for (const block of blocks) {
            currentOrder += 1;
            await withRetry(() => prisma.courseContent.create({
                data: {
                    lessonId: lesson.id,
                    contentType: block.contentType,
                    title: block.title,
                    content: block.content,
                    order: currentOrder
                }
            }));
            console.log(`   ➕ Ajouté [${block.contentType}] : ${block.title.substring(0, 60)}...`);
        }
    }

    console.log('\n✨ Enrichissement interactif terminé avec succès !');
}

main()
    .catch(e => {
        console.error('❌ Erreur générale :', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
