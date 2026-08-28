/*
 * Ajoute de NOUVELLES démonstrations animées (codetutor) à plusieurs leçons
 * sans toucher au contenu existant. Les nouveaux blocs sont insérés en position 2.
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

// Nouvelles démos : { titreLeçon: [nouvellesDémos] }
const NEW_TUTORS = {

    "Introduction : Pourquoi automatiser Excel & Word ?": [
        codetutor(
            "Comparaison : manuel vs automatique",
            `# Travail manuel (4 heures)
# - Ouvrir 5 fichiers Excel un par un
# - Copier chaque onglet
# - Coller dans le récap
# - Calculer les totaux
# - Créer le rapport Word

# Travail Python (30 secondes)
import openpyxl

fichiers = ['janv.xlsx', 'fevr.xlsx', 'mars.xlsx']
total = 0

for f in fichiers:
    wb = openpyxl.load_workbook(f)
    feuille = wb.active
    for cell in feuille['B']:
        if cell.value:
            total += cell.value

print(f"Total trimestriel : {total} DH")`,
            [
                { line: 1, explanation: "Voici le travail MANUEL : 5 étapes répétitives qui prennent environ 4 heures. Fastidieux et source d'erreurs.", variables: { mode: "manuel", temps: "~4 heures" } },
                { line: 8, explanation: "Maintenant voyons la version Python. On importe openpyxl. Le même travail prendra 30 secondes.", variables: { mode: "python" } },
                { line: 10, explanation: "On liste les 5 fichiers à traiter dans une liste Python. Simple et lisible.", variables: { fichiers: "5 fichiers", mode: "python" } },
                { line: 11, explanation: "On initialise le total à zéro.", variables: { fichiers: "5 fichiers", total: 0 } },
                { line: 13, explanation: "La boucle 'for' traite TOUS les fichiers automatiquement. Plus besoin d'ouvrir chaque fichier à la main !", variables: { fichier_courant: "janv.xlsx", total: 0 } },
                { line: 14, explanation: "On ouvre chaque fichier Excel à tour de rôle.", variables: { fichier_courant: "janv.xlsx", wb: "ouvert" } },
                { line: 16, explanation: "On parcourt toutes les cellules de la colonne B (les montants).", variables: { fichier_courant: "janv.xlsx" } },
                { line: 18, explanation: "On additionne chaque valeur. Au fur et à mesure, le total augmente.", variables: { fichier_courant: "janv.xlsx", total: 45000 } },
                { line: 13, explanation: "Boucle suivante : février.xlsx. Tout est automatique !", variables: { fichier_courant: "fevr.xlsx", total: 45000 } },
                { line: 21, explanation: "Résultat final affiché en 30 secondes. Gain de temps : 4 heures → 30 secondes !", variables: { fichiers: "5 traités", total: 142000 }, console: "Total trimestriel : 142000 DH" },
            ]
        ),
    ],

    "Lire et explorer un fichier Excel existant": [
        codetutor(
            "Convertir Excel en dictionnaires Python",
            `import openpyxl

classeur = openpyxl.load_workbook('contacts.xlsx')
feuille = classeur.active

# Récupérer les en-têtes (ligne 1)
entetes = [c.value for c in feuille[1]]

# Convertir chaque ligne en dictionnaire
contacts = []
for ligne in feuille.iter_rows(min_row=2, values_only=True):
    personne = dict(zip(entetes, ligne))
    contacts.append(personne)

# Filtrer : uniquement les Parisiens
parisiens = [p for p in contacts if p['Ville'] == 'Paris']
print(f"{len(parisiens)} Parisien(s) trouvé(s)")`,
            [
                { line: 1, explanation: "Import d'openpyxl.", variables: {} },
                { line: 3, explanation: "On ouvre le fichier contacts.xlsx.", variables: { classeur: "contacts.xlsx" } },
                { line: 6, explanation: "On récupère TOUS les en-têtes de la ligne 1 (ex: Nom, Âge, Ville).", variables: { entetes: "['Nom', 'Âge', 'Ville']" } },
                { line: 9, explanation: "On crée une liste vide pour stocker nos contacts.", variables: { contacts: "[]" } },
                { line: 10, explanation: "On parcourt chaque ligne de données (à partir de la ligne 2 pour sauter l'en-tête).", variables: { contacts: "[]" } },
                { line: 11, explanation: "dict(zip(entetes, ligne)) combine les en-têtes avec les valeurs → crée un dictionnaire {Nom: 'Alice', Âge: 25, Ville: 'Paris'}. Très puissant !", variables: { personne: "{'Nom':'Alice','Âge':25,'Ville':'Paris'}" } },
                { line: 12, explanation: "On ajoute ce dictionnaire à notre liste de contacts.", variables: { contacts: "[Alice, Bob, Charlie]" } },
                { line: 15, explanation: "Maintenant la magie : on FILTRE en une ligne. On ne garde que les personnes dont la Ville est 'Paris'.", variables: { parisiens: "[Alice, Diana]" } },
                { line: 16, explanation: "On affiche combien de Parisiens ont été trouvés.", variables: { parisiens: "2 personnes" }, console: "2 Parisien(s) trouvé(s)" },
            ]
        ),
    ],

    "Mise en forme et styles dans Excel": [
        codetutor(
            "Largeur auto + bordures de tableau",
            `import openpyxl
from openpyxl.styles import Border, Side

classeur = openpyxl.Workbook()
feuille = classeur.active

feuille.append(['Produit', 'Prix'])
feuille.append(['Stylo', 2.5])
feuille.append(['Cahier', 4.0])

# Bordure fine pour tout le tableau
bordure = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)

for ligne in feuille.iter_rows(min_row=1, max_row=3, max_col=2):
    for cellule in ligne:
        cellule.border = bordure

# Largeur automatique des colonnes
for col in feuille.columns:
    max_len = max(len(str(c.value or '')) for c in col)
    feuille.column_dimensions[col[0].column_letter].width = max_len + 2

classeur.save('tableau_pro.xlsx')`,
            [
                { line: 1, explanation: "Import openpyxl et les outils de style (Border, Side) pour les bordures.", variables: {} },
                { line: 4, explanation: "Création d'un classeur.", variables: { classeur: "nouveau" } },
                { line: 7, explanation: "On remplit un petit tableau Produit/Prix avec append().", variables: { "A1": "Produit", "B1": "Prix" } },
                { line: 12, explanation: "Border(...) crée un objet 'bordure' avec 4 côtés en trait fin. On le réutilisera pour toutes les cellules.", variables: { bordure: "trait fin (4 côtés)" } },
                { line: 19, explanation: "On boucle sur toutes les cellules du tableau (lignes 1 à 3, colonnes 1 à 2).", variables: {} },
                { line: 21, explanation: "On applique la bordure à chaque cellule. Le tableau a maintenant des contours nets !", variables: { cellules: "bordées ✓" } },
                { line: 24, explanation: "Largeur auto : pour chaque colonne, on calcule la longueur max du contenu.", variables: { "col A width": 10, "col B width": 7 } },
                { line: 26, explanation: "On définit la largeur = longueur max + 2 (marge). Les colonnes s'ajustent toutes seules !", variables: { "col A width": "10", "col B width": "7" } },
                { line: 28, explanation: "Sauvegarde. Votre tableau est maintenant bordé et bien dimensionné — aspect pro garanti !", variables: { fichier: "tableau_pro.xlsx ✓" } },
            ]
        ),
    ],

    "Formules et calculs automatiques": [
        codetutor(
            "Bulletin de notes avec formules SI imbriquées",
            `import openpyxl

classeur = openpyxl.Workbook()
feuille = classeur.active

feuille.append(['Étudiant', 'Note', 'Mention'])
etudiants = [('Alice', 17), ('Bob', 13), ('Eva', 9)]

for i, (nom, note) in enumerate(etudiants, start=2):
    feuille.cell(row=i, column=1, value=nom)
    feuille.cell(row=i, column=2, value=note)
    # Mention automatique par formule SI imbriquée
    feuille.cell(row=i, column=3,
        value=f'=IF(B{i}>=16,"Bien",IF(B{i}>=14,"Assez Bien","Passable"))')

# Moyenne de la classe
ligne = len(etudiants) + 2
feuille.cell(row=ligne, column=1, value='MOYENNE')
feuille.cell(row=ligne, column=2, value='=AVERAGE(B2:B4)')

classeur.save('bulletin.xlsx')`,
            [
                { line: 1, explanation: "Import d'openpyxl.", variables: {} },
                { line: 4, explanation: "Création du classeur et ajout des en-têtes.", variables: { "A1": "Étudiant", "B1": "Note", "C1": "Mention" } },
                { line: 6, explanation: "Nos 3 étudiants avec leurs notes. Alice (17), Bob (13), Eva (9).", variables: { etudiants: "3 étudiants" } },
                { line: 8, explanation: "enumerate(..., start=2) nous donne l'indice ET le numéro de ligne (on commence à 2 pour sauter l'en-tête).", variables: { i: 2, nom: "Alice", note: 17 } },
                { line: 12, explanation: "⚡ La formule magique : IF imbriqué ! Si note ≥ 16 → 'Bien', sinon si ≥ 14 → 'Assez Bien', sinon 'Passable'.", variables: { "C2": "=IF..." } },
                { line: 16, explanation: "Boucle terminée : les 3 étudiants ont leur mention calculée automatiquement.", variables: { etudiants: "3 ✓" } },
                { line: 19, explanation: "On calcule la ligne où placer la moyenne (après les étudiants).", variables: { ligne: 5 } },
                { line: 21, explanation: "AVERAGE(B2:B4) calcule la moyenne de la classe. Excel le fera à l'ouverture.", variables: { "B5": "=AVERAGE(B2:B4)" } },
                { line: 23, explanation: "Sauvegarde. Ouvrez bulletin.xlsx : mentions ET moyenne calculées automatiquement !", variables: { fichier: "bulletin.xlsx ✓" } },
            ]
        ),
    ],

    "Analyse de données Excel avec pandas": [
        codetutor(
            "Pandas : grouper et agréger comme un pro",
            `import pandas as pd

df = pd.read_excel('ventes.xlsx')

# Chiffre d'affaires par ligne
df['CA'] = df['Quantité'] * df['Prix']

# Tableau croisé : CA par Ville ET par Mois
pivot = df.pivot_table(
    values='CA',
    index='Ville',
    columns='Mois',
    aggfunc='sum',
    fill_value=0
)

print(pivot)

# Exporter le tableau croisé
pivot.to_excel('synthese.xlsx')`,
            [
                { line: 1, explanation: "Import de pandas (alias pd).", variables: {} },
                { line: 3, explanation: "On charge le fichier ventes.xlsx dans un DataFrame.", variables: { df: "DataFrame ventes" } },
                { line: 6, explanation: "On crée une colonne CA = Quantité × Prix. pandas le fait pour TOUTES les lignes instantanément.", variables: { df: "DF + colonne CA" } },
                { line: 9, explanation: "pivot_table crée un TABLEAU CROISÉ : lignes = Villes, colonnes = Mois, valeurs = somme du CA. Comme un tableau croisé dynamique Excel !", variables: {} },
                { line: 10, explanation: "values='CA' : la valeur à agréger.", variables: {} },
                { line: 11, explanation: "index='Ville' : les Villes deviennent les lignes.", variables: { index: "Ville" } },
                { line: 12, explanation: "columns='Mois' : les Mois deviennent les colonnes.", variables: { colonnes: "Mois" } },
                { line: 13, explanation: "aggfunc='sum' : on additionne. fill_value=0 : remplace les cases vides par 0.", variables: { pivot: "créé" } },
                { line: 17, explanation: "Affichage du tableau croisé. Une analyse puissante en quelques lignes !", variables: { pivot: "affiché" }, console: "Ville    Jan  Fevr  Mars\\nCasa    15k   18k   20k\\nRabat   8k    9k    11k" },
                { line: 20, explanation: "On exporte le tableau croisé vers Excel. Votre synthèse est prête !", variables: { fichier: "synthese.xlsx ✓" } },
            ]
        ),
    ],

    "Créer des documents Word avec python-docx": [
        codetutor(
            "Créer un tableau stylé dans Word",
            `from docx import Document

doc = Document()
doc.add_heading('Employés', level=1)

# Créer un tableau (1 ligne, 3 colonnes)
tableau = doc.add_table(rows=1, cols=3)
tableau.style = 'Light Grid Accent 1'

# En-têtes
entetes = tableau.rows[0].cells
entetes[0].text = 'Nom'
entetes[1].text = 'Poste'
entetes[2].text = 'Salaire'

# Données
employes = [
    ('Alice', 'Développeuse', '15000'),
    ('Bob', 'Designer', '12000'),
]
for nom, poste, salaire in employes:
    ligne = tableau.add_row().cells
    ligne[0].text = nom
    ligne[1].text = poste
    ligne[2].text = salaire

doc.save('employes.docx')`,
            [
                { line: 1, explanation: "Import de Document depuis python-docx.", variables: {} },
                { line: 3, explanation: "Création d'un document Word vide.", variables: { doc: "vide" } },
                { line: 4, explanation: "On ajoute un titre 'Employés' (niveau 1 = sous-titre).", variables: { doc: "+ titre Employés" } },
                { line: 7, explanation: "add_table crée un tableau. rows=1 (juste l'en-tête pour l'instant), cols=3 (Nom, Poste, Salaire).", variables: { tableau: "1×3" } },
                { line: 8, explanation: "On applique un STYLE prédéfini 'Light Grid Accent 1' pour un rendu pro immédiat.", variables: { tableau: "stylé" } },
                { line: 11, explanation: "On récupère les cellules de la première ligne (l'en-tête).", variables: { entetes: "3 cellules" } },
                { line: 15, explanation: "On remplit les en-têtes : Nom, Poste, Salaire.", variables: { "en-têtes": "Nom|Poste|Salaire" } },
                { line: 18, explanation: "Voici nos 2 employés à ajouter au tableau.", variables: { employes: "2 personnes" } },
                { line: 22, explanation: "Pour chaque employé, add_row() ajoute une NOUVELLE ligne vide au tableau.", variables: { ligne: "nouvelle ligne" } },
                { line: 24, explanation: "On remplit chaque cellule de la ligne avec les données de l'employé.", variables: { ligne: "Alice|Développeuse|15000" } },
                { line: 27, explanation: "Sauvegarde. Votre document Word contient un joli tableau stylé !", variables: { fichier: "employes.docx ✓" } },
            ]
        ),
        codetutor(
            "Mise en forme avancée : Runs colorés",
            `from docx import Document
from docx.shared import Pt, RGBColor

doc = Document()
para = doc.add_paragraph()

# Run 1 : texte normal
para.add_run('Ce texte contient ')

# Run 2 : gras
r2 = para.add_run('du gras, ')
r2.bold = True

# Run 3 : italique rouge
r3 = para.add_run('de l\\'italique rouge, ')
r3.italic = True
r3.font.color.rgb = RGBColor(0xFF, 0x00, 0x00)

# Run 4 : gros texte bleu
r4 = para.add_run('et du gros bleu !')
r4.font.size = Pt(18)
r4.font.color.rgb = RGBColor(0x00, 0x66, 0xFF)

doc.save('multicolore.docx')`,
            [
                { line: 1, explanation: "On importe Document, Pt (points) et RGBColor (couleurs).", variables: {} },
                { line: 5, explanation: "Création d'un paragraphe vide. On va lui ajouter plusieurs portions (runs) au style différent.", variables: { para: "vide" } },
                { line: 8, explanation: "Run 1 : texte normal, sans style particulier.", variables: { para: "'Ce texte contient '" } },
                { line: 11, explanation: "Run 2 : on crée le run puis on active le GRAS.", variables: { r2: "'du gras,' (gras)" } },
                { line: 12, explanation: "r2.bold = True rend ce run gras. Chaque run peut avoir SON propre style !", variables: { r2: "gras ✓" } },
                { line: 15, explanation: "Run 3 : italique.", variables: { r3: "italique" } },
                { line: 16, explanation: "On active l'italique.", variables: { r3: "italique ✓" } },
                { line: 17, explanation: "RGBColor(0xFF,0x00,0x00) = rouge pur. On colorise ce run en rouge.", variables: { r3: "italique rouge ✓" } },
                { line: 20, explanation: "Run 4 : on change la TAILLE à 18 points (gros).", variables: { r4: "taille 18pt" } },
                { line: 21, explanation: "On le met en BLEU. RGBColor(0x00,0x66,0xFF) = bleu.", variables: { r4: "gros bleu ✓" } },
                { line: 23, explanation: "Sauvegarde. Un même paragraphe contient 4 styles différents ! Puissant.", variables: { fichier: "multicolore.docx ✓" } },
            ]
        ),
    ],

    "Modèles Word et publipostage (mail merge)": [
        codetutor(
            "Attestations en masse (cas réel)",
            `from docx import Document

def creer_attestation(nom, poste, date_debut):
    doc = Document()

    doc.add_heading('ATTESTATION DE TRAVAIL', 0)

    doc.add_paragraph(
        f"Je soussigné atteste que {nom} "
        f"occupe le poste de {poste} "
        f"depuis le {date_debut}."
    )

    doc.save(f'attestation_{nom}.docx')

# Générer pour 3 employés
employes = [
    ('Karim', 'Comptable', '01/09/2022'),
    ('Sara', 'Ingénieure', '15/03/2021'),
]
for nom, poste, date in employes:
    creer_attestation(nom, poste, date)
    print(f"✅ {nom}")`,
            [
                { line: 1, explanation: "Import de Document.", variables: {} },
                { line: 3, explanation: "On crée une FONCTION réutilisable creer_attestation. Paramètres : nom, poste, date.", variables: {} },
                { line: 4, explanation: "On crée un nouveau document Word pour cette attestation.", variables: { doc: "vide" } },
                { line: 6, explanation: "Titre principal niveau 0 (le plus grand).", variables: { doc: "+ ATTESTATION DE TRAVAIL" } },
                { line: 9, explanation: "Le f-string (f\"...\") insère automatiquement les variables dans le texte. {nom} est remplacé par 'Karim'.", variables: { doc: "+ paragraphe personnalisé" } },
                { line: 10, explanation: "On insère le poste.", variables: { doc: "+ poste" } },
                { line: 11, explanation: "On insère la date de début.", variables: { doc: "+ date" } },
                { line: 14, explanation: "Sauvegarde avec un nom unique : attestation_Karim.docx.", variables: { fichier: "attestation_Karim.docx ✓" } },
                { line: 17, explanation: "Voici 2 employés. Imaginez 200 employés → le script les traite tous en 30 secondes !", variables: { employes: "2 personnes" } },
                { line: 21, explanation: "On appelle la fonction pour chaque employé.", variables: {} },
                { line: 22, explanation: "Confirmation. Attestation générée instantanément !", variables: { fichiers: "attestation_Karim ✓, attestation_Sara ✓" }, console: "✅ Karim\\n✅ Sara" },
            ]
        ),
    ],

    "Projet : Pipeline complet Excel → Word → PDF": [
        codetutor(
            "Bonus : envoyer la facture par email",
            `import smtplib
from email.message import EmailMessage

def envoyer_facture(email_client, fichier_pdf):
    msg = EmailMessage()
    msg['From'] = 'facturation@masociete.com'
    msg['To'] = email_client
    msg['Subject'] = 'Votre facture'

    msg.set_content("Bonjour,\\n\\nVeuillez trouver votre facture ci-jointe.")

    # Joindre le PDF
    with open(fichier_pdf, 'rb') as f:
        msg.add_attachment(f.read(),
                          maintype='application',
                          subtype='pdf',
                          filename=fichier_pdf)

    # Envoyer via le serveur SMTP de Gmail
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login('facturation@masociete.com', 'mot_de_passe_app')
        smtp.send_message(msg)

    print(f"✉️ Email envoyé à {email_client}")

envoyer_facture('client@example.com', 'facture_F001.pdf')`,
            [
                { line: 1, explanation: "On importe smtplib (envoi d'emails) et EmailMessage (construction du message).", variables: {} },
                { line: 3, explanation: "Fonction envoyer_facture : prend l'email du client et le PDF à joindre.", variables: {} },
                { line: 4, explanation: "On crée un objet EmailMessage vide.", variables: { msg: "vide" } },
                { line: 5, explanation: "Expéditeur.", variables: { msg: "+ From" } },
                { line: 6, explanation: "Destinataire.", variables: { msg: "+ To" } },
                { line: 7, explanation: "Sujet de l'email.", variables: { msg: "+ Subject" } },
                { line: 9, explanation: " Corps de l'email (texte simple).", variables: { msg: "+ corps" } },
                { line: 12, explanation: "On ouvre le PDF en mode binaire ('rb') pour pouvoir l'envoyer.", variables: { fichier: "ouvert (binaire)" } },
                { line: 13, explanation: "add_attachment attache le PDF à l'email. maintype/subtype précisent que c'est un PDF.", variables: { msg: "+ pièce jointe PDF" } },
                { line: 19, explanation: "On se connecte au serveur SMTP de Gmail (SSL = sécurisé, port 465).", variables: { smtp: "connecté à Gmail" } },
                { line: 20, explanation: "Authentification. Utilisez un 'mot de passe d'application' Gmail, pas votre mot de passe habituel.", variables: { smtp: "authentifié" } },
                { line: 21, explanation: "send_message envoie réellement l'email avec sa pièce jointe !", variables: { smtp: "envoyé ✓" } },
                { line: 24, explanation: "Confirmation. Le client reçoit sa facture automatiquement !", variables: {}, console: "✉️ Email envoyé à client@example.com" },
                { line: 26, explanation: "On appelle la fonction. Combine avec le pipeline : facture Word → PDF → Email, 100% automatique !", variables: {} },
            ]
        ),
    ],
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function findCourseWithRetry() {
    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            return await prisma.course.findUnique({
                where: { slug: SLUG },
                include: { lessons: { include: { contents: true }, orderBy: { order: 'asc' } } }
            });
        } catch (e) {
            lastErr = e;
            console.log(`  ⏳ Tentative ${attempt}/5 — réveil DB...`);
            await sleep(4000 * attempt);
        }
    }
    throw lastErr;
}

async function main() {
    const course = await findCourseWithRetry();
    if (!course) throw new Error("Cours introuvable");

    console.log(`🤖 Ajout de démonstrations animées : ${course.title}\n`);

    let added = 0;
    for (const lesson of course.lessons) {
        const newDemos = NEW_TUTORS[lesson.title];
        if (!newDemos) continue;

        // Récupérer l'ordre max existant
        const maxOrder = lesson.contents.reduce((m, c) => Math.max(m, c.order), 0);

        // Insérer les nouvelles démos en position 2 (juste après le 1er bloc)
        // en décalant les blocs existants
        for (const block of newDemos) {
            // Décaler les blocs existants d'autant
            await prisma.courseContent.updateMany({
                where: { lessonId: lesson.id, order: { gte: 2 } },
                data: { order: { increment: 1 } }
            });
            // Insérer le nouveau bloc en position 2
            await prisma.courseContent.create({
                data: { ...block, lessonId: lesson.id, order: 2 },
            });
            added++;
            console.log(`  ✅ + Démo animée ajoutée dans "${lesson.title}"`);
        }
    }

    console.log(`\n🎉 ${added} nouvelle(s) démonstration(s) animée(s) ajoutée(s) !`);
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
