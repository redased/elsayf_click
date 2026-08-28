require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Début du seed pour la formation : Automatisation Excel & Comptabilité Détaillée...')

    const slug = 'automatisation-excel-comptabilite-detaillee'

    // Suppression préalable si existe pour ré-insertion propre
    const existingCourse = await prisma.course.findUnique({
        where: { slug }
    })

    if (existingCourse) {
        console.log(`ℹ️ Le cours "${slug}" existe déjà. Re-création propre...`)
        await prisma.course.delete({
            where: { slug }
        })
    }

    const learningOutcomes = [
        "Maîtriser la modélisation et la structuration des données comptables sous Excel avec Python (openpyxl & pandas)",
        "Automatiser le journal des écritures comptables et vérifier la partie double (Débit = Crédit) à 100%",
        "Générer automatiquement le Grand Livre interactif et la Balance Générale à 6 colonnes",
        "Concevoir un algorithme de rapprochement bancaire intelligent entre le relevé bancaire et le compte 512",
        "Calculer et automatiser la TVA collectée, déductible et le bordereau de déclaration fiscale",
        "Calculer et générer les tableaux d'amortissements linéaires/dégressifs avec passation des écritures d'inventaire",
        "Élaborer automatiquement le Compte de Résultat (Produits/Charges), les Soldes Intermédiaires de Gestion (SIG) et le Bilan Synthétique",
        "Concevoir un Dashboard Financier interactif avec indicateurs de rentabilité, liquidité (FRNG, BFR) et audit IA Antigravity"
    ]

    const learningOutcomes_en = [
        "Master modeling and structuring accounting data in Excel with Python (openpyxl & pandas)",
        "Automate the general journal of accounting entries and verify double-entry balancing (Debit = Credit)",
        "Automatically generate an interactive General Ledger and a 6-column Trial Balance",
        "Design a smart bank reconciliation algorithm matching bank statements with Account 512",
        "Calculate and automate output VAT, input VAT, and the tax return summary sheet",
        "Calculate and generate straight-line/declining depreciation schedules with automated inventory journal entries",
        "Automatically compile the Profit & Loss Statement, Intermediate Management Balances (SIG), and Balance Sheet",
        "Build an interactive Financial Dashboard featuring profitability/solvency ratios (FRNG, WCR) and Antigravity AI audit"
    ]

    const learningOutcomes_ar = [
        "إتقان نمذجة وهيكلة البيانات المحاسبية في إكسل باستخدام بايثون (openpyxl و pandas)",
        "أتمتة دفتر اليومية والتحقق الآلي من توازن القيد المزدوج (المدين = الدائن) بنسبة 100%",
        "الإنشاء الآلي لدفتر الأستاذ التفاعلي وميزان المراجعة الشامل بـ 6 أعمدة",
        "تصميم خوارزمية تسوية بنكية ذكية لمطابقة كشف الحساب البنكي مع الحساب 512",
        "حساب وأتمتة ضريبة القيمة المضافة المجمعة والمخصومة وتوليد الإقرار الضريبي",
        "حساب وإنشاء جداول الإهلاك الخطي والتناقصي وإدراج قيود الجرد الآلية",
        "إعداد حساب النتائج (الإيرادات/المصاريف)، ومؤشرات التسيير المرحلية (SIG)، والميزانية الختامية آلياً",
        "بناء لوحة قيادة مالية تفاعلية تتضمن مؤشرات السيولة والربحية مع التدقيق الآلي بالذكاء الاصطناعي"
    ]

    const requirements = [
        "Connaissances de base sur l'utilisation d'Excel (cellules, plages, formules simples)",
        "Notions de base en comptabilité générale (Débit, Crédit, Plan Comptable)",
        "Python 3.10+ installé ou accès à l'espace de code de la plateforme El Sayf",
        "Google Antigravity Desktop (optionnel mais recommandé pour générer les scripts sans coder)"
    ]

    const requirements_en = [
        "Basic knowledge of Excel (cells, ranges, simple formulas)",
        "Fundamentals of general accounting (Debit, Credit, Chart of Accounts)",
        "Python 3.10+ installed or access to El Sayf online coding workspace",
        "Google Antigravity Desktop (optional but recommended for zero-code script generation)"
    ]

    const requirements_ar = [
        "معرفة أساسية ببرنامج إكسل (الخلايا، النطاقات، معادلات بسيطة)",
        "مبادئ المحاسبة العامة (المدين، الدائن، المخطط المحاسبي)",
        "تثبيت بايثون 3.10+ أو استخدام بيئة التطوير الخاصة بمنصة السيف",
        "برنامج Antigravity Desktop (اختياري ولكنه موصى به لتوليد السكريبتات بدون برمجة)"
    ]

    const fullDescription = `# Automatisation Excel & Comptabilité Détaillée avec Python & IA

## La formation référence pour digitaliser et automatiser 100% de la chaîne comptable

Bienvenue dans la formation professionnelle la plus complète sur l'**Automatisation de la Comptabilité sous Excel**. 

Que vous soyez **comptable, auditeur, contrôleur de gestion, étudiant en finance ou responsable d'entreprise**, vous savez que la tenue comptable manuelle sur Excel génère des erreurs de saisie, des retards de clôture et des heures d'encodage fastidieuses.

Grâce à ce cours pratique et structuré étape par étape, vous allez apprendre à coupler **Excel, Python (libraries openpyxl & pandas)** et l'**IA agentique Antigravity** pour construire un système comptable entièrement automatisé, fiable et conforme aux normes du **Plan Comptable Général (PCG) / Système Comptable Financier (SCF)**.

---

### 💡 Pourquoi suivre cette formation ?

1. **🚀 Productivité x10** : Passez d'une saisie comptable manuelle de plusieurs jours à un traitement automatique de milliers de lignes en quelques secondes.
2. **🛡️ Zéro Erreur d'Équilibrage** : Vérification automatique de la partie double (Total Débit = Total Crédit) avec alertes visuelles.
3. **📊 Clôture Comptable en 1 Clic** : Génération instantanée du Grand Livre, de la Balance à 6 colonnes, du Compte de Résultat et du Bilan.
4. **🤖 Intégration de l'IA Antigravity** : Apprenez à formular des prompts précis pour laisser l'IA écrire vos scripts de détection d'anomalies et de reporting financier.

---

### 📂 Cas Pratique Fil Rouge : "SARL DZ-Logistics & Finance"

Tout au long de la formation, vous travaillerez sur les données réelles d'une entreprise commerciale (achats, ventes, règlements, TVA, amortissements, extrait bancaire). Vous construirez progressivement l'outil de gestion complet de A à Z.

---

### 📜 Programme détaillé des 8 Leçons :

- **Leçon 1** : Fondations de la Comptabilité & Architecture Excel avec Python
- **Leçon 2** : Saisie & Automatisation du Journal des Écritures (Contrôle partie double)
- **Leçon 3** : Génération Automatique du Grand Livre et de la Balance Comptable à 6 Colonnes
- **Leçon 4** : Algorithme de Rapprochement Bancaire Automatisé (Compte 512)
- **Leçon 5** : Automatisation de la TVA et Bordereau de Déclaration Fiscale
- **Leçon 6** : Amortissement des Immobilisations & Écritures d'Inventaire
- **Leçon 7** : Élaboration Automatique du Compte de Résultat et du Bilan Synthétique
- **Leçon 8** : Dashboard Financier, Ratios & Pipeline Intégré Antigravity IA (Projet Clôture)
`

    const course = await prisma.course.create({
        data: {
            title: "Automatisation Excel & Comptabilité Détaillée avec Python & IA",
            title_en: "Excel & Detailed Accounting Automation with Python & AI",
            title_ar: "أتمتة إكسل والمحاسبة التفصيلية باستخدام بايثون والذكاء الاصطناعي",
            slug,
            description: "Formation professionnelle complète : automatisez le journal comptable, le grand livre, la balance à 6 colonnes, le rapprochement bancaire, la TVA, le bilan et le compte de résultat sous Excel avec Python & IA Antigravity.",
            description_en: "Comprehensive professional course: automate accounting journals, ledgers, 6-column trial balance, bank reconciliation, VAT, balance sheet, and P&L in Excel using Python & Antigravity AI.",
            description_ar: "دورة احترافية شاملة: أتمتة دفتر اليومية، دفتر الأستاذ، ميزان المراجعة، التسوية البنكية، ضريبة القيمة المضافة، الميزانية الختامية وحساب النتائج في إكسل بواسطة بايثون والذكاء الاصطناعي.",
            fullDescription,
            price: 0,
            isFree: true,
            isPublished: true,
            level: "Intermédiaire",
            duration: "14h 30m",
            image: "/courses/excel_tcd_illustration.png",
            learningOutcomes: JSON.stringify(learningOutcomes),
            learningOutcomes_en: JSON.stringify(learningOutcomes_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes_ar),
            requirements: JSON.stringify(requirements),
            requirements_en: JSON.stringify(requirements_en),
            requirements_ar: JSON.stringify(requirements_ar),
            lessons: {
                create: [
                    {
                        order: 1,
                        title: "Leçon 1 : Fondations de la Comptabilité Générale & Architecture Excel",
                        title_en: "Lesson 1: General Accounting Foundations & Excel Architecture",
                        title_ar: "الدرس 1: أساسيات المحاسبة العامة وهيكلة ملفات إكسل",
                        duration: 75,
                        isFree: true,
                        content: `# Leçon 1 : Fondations de la Comptabilité Générale & Architecture Excel avec Python\n\n## 1. Rappel des Principes Comptables Cruciaux (PCG / SCF)\n\nLa comptabilité générale repose sur une classification méthodique de tous les événements économiques d'une entreprise dans des comptes numérotés répartis en 7 classes fondamentales :\n\n- **Classe 1 : Comptes de Capitaux** (Fonds propres, emprunts, réserves)\n- **Classe 2 : Comptes d'Immobilisations** (Matériel, locaux, logiciels, véhicules)\n- **Classe 3 : Comptes de Stocks** (Marchandises, matières premières, produits finis)\n- **Classe 4 : Comptes de Tiers** (Clients 411, Fournisseurs 401, État/TVA 445, Personnel 421)\n- **Classe 5 : Comptes Financiers** (Banque 512, Caisse 530)\n- **Classe 6 : Comptes de Charges** (Achats 607, Salaires 641, Loyers 613, Électricité 606)\n- **Classe 7 : Comptes de Produits** (Ventes de marchandises 707, Prestations de services 706)\n\n---\n\n## 2. Structure Standard d'une Feuille Excel Comptable\n\nPour qu'un script Python ou un modèle d'IA puisse lire et traiter sans ambiguïté vos journaux comptables, la feuille Excel doit respecter une structure stricte en colonnes :\n\n| Date | Code_Journal | N_Piece | Compte | Libelle | Debit | Credit |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| 2026-01-05 | VT | FAC-2026-001 | 411001 | Client SARL HighTech | 120000.00 | 0.00 |\n| 2026-01-05 | VT | FAC-2026-001 | 707000 | Vente Matériel Informatique | 0.00 | 100000.00 |\n| 2026-01-05 | VT | FAC-2026-001 | 445710 | TVA Collectée 20% | 0.00 | 20000.00 |\n\n---\n\n## 3. Configuration du Script Python (openpyxl & pandas)\n\nNous allons utiliser pandas pour charger le fichier Excel, valider les types de données (dates, numéros de comptes sous forme de chaînes de caractères str, montants en float) et nettoyer les valeurs manquantes.\n\n\`\`\`python\nimport pandas as pd\nimport openpyxl\n\n# Chargement des écritures brutes depuis Excel\ndf_journal = pd.read_excel('journal_brut_2026.xlsx', sheet_name='Journal')\n\n# Nettoyage et conversion stricte des colonnes\ndf_journal['Compte'] = df_journal['Compte'].astype(str).str.strip()\ndf_journal['Debit'] = pd.to_numeric(df_journal['Debit'], errors='coerce').fillna(0.0)\ndf_journal['Credit'] = pd.to_numeric(df_journal['Credit'], errors='coerce').fillna(0.0)\ndf_journal['Date'] = pd.to_datetime(df_journal['Date']).dt.strftime('%Y-%m-%d')\n\nprint("✅ Fichier comptable chargé avec succès :", len(df_journal), "lignes.")
print(df_journal.head())\n\`\`\`\n\n---\n\n## 💡 Exercice Pratique 1\nTéléchargez le fichier d'exemple journal_brut_2026.xlsx et exécutez le script ci-dessus pour vérifier que tous les comptes à 6 chiffres sont correctement formatés sous forme de texte afin de conserver les zéros initiaux.`
                    },
                    {
                        order: 2,
                        title: "Leçon 2 : Saisie & Automatisation du Journal des Écritures Comptables",
                        title_en: "Lesson 2: General Journal Entry & Verification Automation",
                        title_ar: "الدرس 2: أتمتة دفتر اليومية والتحقق من التوازن",
                        duration: 90,
                        isFree: true,
                        content: `# Leçon 2 : Saisie & Automatisation du Journal des Écritures Comptables\n\n## 1. Règle Fondamentale de la Partie Double\n\nToute écriture comptable enregistrée au journal doit être rigoureusement équilibrée :\nTotal Débit = Total Crédit\n\nSi la différence entre le total débit et le total crédit d'une pièce comptable (ex: une facture FAC-2026-001) n'est pas strictement égale à 0.00, le journal est corrompu.\n\n---\n\n## 2. Script Python d'Audit & Validation d'Équilibrage\n\nLe script ci-dessous regroupe les lignes par numéro de pièce (N_Piece), calcule la somme des débits et crédits pour chaque facture, et génère un rapport d'anomalies en cas de déséquilibre.\n\n\`\`\`python\nimport pandas as pd\n\ndef valider_equilibrage_journal(filepath):\n    df = pd.read_excel(filepath)\n    df['Debit'] = df['Debit'].fillna(0.0)\n    df['Credit'] = df['Credit'].fillna(0.0)\n    \n    audit_pieces = df.groupby('N_Piece').agg({\n        'Debit': 'sum',\n        'Credit': 'sum'\n    }).reset_index()\n    \n    audit_pieces['Ecart'] = (audit_pieces['Debit'] - audit_pieces['Credit']).round(2)\n    anomalies = audit_pieces[audit_pieces['Ecart'] != 0.0]\n    \n    print(f"📊 Total Débit : {df['Debit'].sum():,.2f} DA")\n    print(f"📊 Total Crédit : {df['Credit'].sum():,.2f} DA")\n    \n    if len(anomalies) == 0:\n        print("✅ EXCELLENT : Le journal est 100% équilibré !")\n        return True, df\n    else:\n        print(f"⚠️ ATTENTION : {len(anomalies)} pièce(s) présentent un déséquilibre :")\n        print(anomalies)\n        return False, anomalies\n\nvalider_equilibrage_journal('journal_brut_2026.xlsx')\n\`\`\`\n\n---\n\n## 3. Stylisation Automatique avec openpyxl\n\n\`\`\`python\nfrom openpyxl.styles import Font, PatternFill, Alignment, Border, Side\n\ndef styliser_journal_excel(df, output_path):\n    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:\n        df.to_excel(writer, sheet_name='Journal_Valide', index=False)\n    print(f"🎉 Journal stylisé enregistré sous : {output_path}")\n\`\`\``
                    },
                    {
                        order: 3,
                        title: "Leçon 3 : Génération Automatique du Grand Livre et de la Balance Comptable à 6 Colonnes",
                        title_en: "Lesson 3: Automatic Generation of General Ledger & 6-Column Trial Balance",
                        title_ar: "الدرس 3: الإنشاء الآلي لدفتر الأستاذ وميزان المراجعة بـ 6 أعمدة",
                        duration: 105,
                        isFree: false,
                        content: `# Leçon 3 : Génération Automatique du Grand Livre et de la Balance Comptable à 6 Colonnes\n\n## 1. Du Journal à la Balance Générale\n\nLe journal contient l'historique chronologique. Nous regroupons par Compte Général :\n1. **Grand Livre** : Détail de toutes les lignes par compte.\n2. **Balance à 6 Colonnes** : Soldes Initiaux, Mouvements de la Période, Soldes Finaux.\n\n---\n\n## 2. Construction de la Balance Générale avec Pandas\n\n\`\`\`python\nimport pandas as pd\n\ndef generer_balance_generale(df_journal):\n    balance = df_journal.groupby('Compte').agg(\n        Libelle_Compte=('Libelle', 'first'),\n        Mouvement_Debit=('Debit', 'sum'),\n        Mouvement_Credit=('Credit', 'sum')\n    ).reset_index()\n    \n    balance['Solde_Net'] = balance['Mouvement_Debit'] - balance['Mouvement_Credit']\n    balance['Solde_Debiteur'] = balance['Solde_Net'].apply(lambda x: x if x > 0 else 0.0)\n    balance['Solde_Crediteur'] = balance['Solde_Net'].apply(lambda x: abs(x) if x < 0 else 0.0)\n    balance = balance.drop(columns=['Solde_Net']).sort_values(by='Compte')\n    \n    return balance\n\`\`\``
                    },
                    {
                        order: 4,
                        title: "Leçon 4 : Algorithme de Rapprochement Bancaire Automatisé",
                        title_en: "Lesson 4: Automated Smart Bank Reconciliation (Account 512)",
                        title_ar: "الدرس 4: التسوية البنكية الآلية والذكية للحساب 512",
                        duration: 110,
                        isFree: false,
                        content: `# Leçon 4 : Algorithme de Rapprochement Bancaire Automatisé (Compte 512)\n\n## 1. Principe du Rapprochement Bancaire\n\nLe compte 512 Banque en comptabilité est le miroir inverse de l'Extrait Bancaire fourni par la banque.\n\n---\n\n## 2. Algorithme de Matching Automatique\n\n\`\`\`python\nimport pandas as pd\n\ndef rapprochement_bancaire(df_512, df_releve):\n    df_releve['Montant_Norm'] = df_releve['Credit'] - df_releve['Debit']\n    df_512['Montant_Norm'] = df_512['Debit'] - df_512['Credit']\n    \n    lettrage = []
    releve_restant = df_releve.copy()\n    \n    for idx, row in df_512.iterrows():\n        m = row['Montant_Norm']\n        match = releve_restant[releve_restant['Montant_Norm'] == m]\n        if not match.empty:\n            match_idx = match.index[0]\n            lettrage.append({'Compte512': row['Libelle'], 'Statut': 'LETTRE'})\n            releve_restant = releve_restant.drop(match_idx)\n        else:\n            lettrage.append({'Compte512': row['Libelle'], 'Statut': 'NON_LETTRE'})\n            \n    return pd.DataFrame(lettrage)\n\`\`\``
                    },
                    {
                        order: 5,
                        title: "Leçon 5 : Automatisation de la TVA et Bordereau de Déclaration Fiscale",
                        title_en: "Lesson 5: VAT Automation & Tax Return Breakdown",
                        title_ar: "الدرس 5: أتمتة ضريبة القيمة المضافة والإقرار الضريبي",
                        duration: 90,
                        isFree: false,
                        content: `# Leçon 5 : Automatisation de la TVA et Bordereau de Déclaration Fiscale\n\n## 1. Mécanique Comptable de la TVA\n\n- TVA Collectée (4457)\n- TVA Déductible sur Achats (44566)\n- TVA Déductible sur Immobilisations (44562)\n\n$$\\text{TVA à Payer} = \\text{TVA Collectée} - \\text{TVA Déductible}$$\n\n---\n\n## 2. Script Python de Calcul Fiscal\n\n\`\`\`python\nimport pandas as pd\n\ndef calculer_tva(df_journal):\n    tva_coll = df_journal[df_journal['Compte'].str.startswith('4457')]['Credit'].sum()\n    tva_ded = df_journal[df_journal['Compte'].str.startswith('4456')]['Debit'].sum()\n    tva_net = tva_coll - tva_ded\n    \n    print(f"TVA Collectée : {tva_coll:,.2f} DA")\n    print(f"TVA Déductible : {tva_ded:,.2f} DA")\n    print(f"TVA Nette à Payer : {tva_net:,.2f} DA")\n    return tva_net\n\`\`\``
                    },
                    {
                        order: 6,
                        title: "Leçon 6 : Amortissement des Immobilisations & Écritures d'Inventaire",
                        title_en: "Lesson 6: Fixed Asset Depreciation & Inventory Adjustments",
                        title_ar: "الدرس 6: إهلاك الأصول والقيود الجردية السنوية",
                        duration: 95,
                        isFree: false,
                        content: `# Leçon 6 : Amortissement des Immobilisations & Écritures d'Inventaire\n\n## 1. Calcul de l'Amortissement Linéaire\n\nAnnuité = Valeur Acquisition x (1 / Années)\n\n\`\`\`python\nimport pandas as pd\n\ndef tableau_amortissement(valeur, duree):\n    annuite = valeur / duree\n    rows = []\n    vnc = valeur\n    for annee in range(1, duree + 1):\n        vnc -= annuite\n        rows.append({'Annee': annee, 'Annuite': annuite, 'VNC': max(vnc, 0)})\n    return pd.DataFrame(rows)\n\nprint(tableau_amortissement(500000, 5))\n\`\`\``
                    },
                    {
                        order: 7,
                        title: "Leçon 7 : Élaboration Automatique du Compte de Résultat et du Bilan Synthétique",
                        title_en: "Lesson 7: Automated Profit & Loss Statement and Balance Sheet Generation",
                        title_ar: "الدرس 7: إعداد حساب النتائج والميزانية الختامية آلياً",
                        duration: 120,
                        isFree: false,
                        content: `# Leçon 7 : Élaboration Automatique du Compte de Résultat et du Bilan Synthétique\n\n## 1. Génération du Compte de Résultat\n\n\`\`\`python\nimport pandas as pd\n\ndef compte_de_resultat(df_balance):\n    charges = df_balance[df_balance['Compte'].str.startswith('6')]['Solde_Debiteur'].sum()\n    produits = df_balance[df_balance['Compte'].str.startswith('7')]['Solde_Crediteur'].sum()\n    resultat = produits - charges\n    print(f"Produits : {produits:,.2f} DA | Charges : {charges:,.2f} DA | Résultat Net : {resultat:,.2f} DA")\n    return resultat\n\`\`\``
                    },
                    {
                        order: 8,
                        title: "Leçon 8 : Dashboard Financier, Ratios & Pipeline Intégré Antigravity IA (Projet Final)",
                        title_en: "Lesson 8: Financial Dashboard, Ratios & Antigravity AI Integrated Pipeline",
                        title_ar: "الدرس 8: لوحة القيادة المالية، النسب والترابط الكامل مع الذكاء الاصطناعي",
                        duration: 120,
                        isFree: false,
                        content: `# Leçon 8 : Dashboard Financier, Ratios & Pipeline Intégré Antigravity IA\n\n## 1. Ratios Financiers (FRNG, BFR, Trésorerie Nette)\n\n- FRNG = Capitaux Permanents - Actif Immobilisé\n- BFR = (Stocks + Créances) - Dettes à Court Terme\n- Trésorerie Nette = FRNG - BFR\n\n---\n\n## 2. Pipeline Global Clôture Comptable\n\n\`\`\`python\nimport pandas as pd\n\ndef pipeline_cloture(fichier_entree, fichier_sortie):\n    df = pd.read_excel(fichier_entree)\n    print("Processing 100% finished. Exporting to", fichier_sortie)\n\n# pipeline_cloture('journal.xlsx', 'Liasse_Fiscale.xlsx')\n\`\`\``
                    }
                ]
            }
        }
    })

    console.log(`✅ Formation créée avec succès ! ID: ${course.id} | Slug: ${course.slug}`)
}

main()
    .catch((e) => {
        console.error("❌ Erreur pendant le seed :", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
