require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_0sbNrcknMjy7@ep-shiny-glade-agld3qhw-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30"
        }
    }
})

async function main() {
    console.log("Debut du seed : Antigravity Business Excel (VERSION NOVICE AMELIOREE) ...")

    const slug = 'antigravity-business-excel'

    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) {
        console.log('Cours existant trouve. Suppression pour re-insertion propre...')
        await prisma.course.delete({ where: { slug } })
    }

    const fullDescription = `# Antigravity : Gestion d'Entreprise avec Excel & Python

## La formation parfaite pour les debutants complets

Pas besoin d'avoir deja programme ! Cette formation part de ZERO et vous explique chaque etape, chaque mot, chaque ligne de code.

### Ce que vous allez apprendre

Vous etes comptable, gestionnaire, secretaire ou chef d'entreprise ? Vous utilisez Excel tous les jours mais vous perdez un temps fou a faire les memes taches repetitives ? Cette formation est faite pour vous.

Avec **Google Antigravity** (un assistant IA qui ecrit le code Python a votre place), vous allez apprendre a automatiser :
- La creation de vos tableaux Excel
- Le calcul de vos indicateurs financiers
- La gestion de vos stocks
- La gestion de votre equipe

### Vous n'avez besoin de savoir :
- Utiliser Excel (niveau basique suffit)
- Utiliser un ordinateur

### C'est tout ! Antigravity ecrit le code Python pour vous.

### 📥 Telecharger l'assistant Antigravity
**[Telecharger Antigravity Desktop](https://antigravity.google.com)** - Gratuit, Windows / macOS / Linux

### Le cas pratique : TechAlgerie SARL
Vous etes le responsable d'une PME algerienne fictive de vente de materiel informatique. Vous avez 47 employes et vous gerez tout avec Excel. Ensemble, on va tout automatiser.
`

    const learningOutcomes = JSON.stringify([
        "Comprendre ce qu'est Python et pourquoi c'est utile (meme sans experience)",
        "Utiliser Google Antigravity pour generer du code Python sans connaitre la syntaxe",
        "Creer et formater des fichiers Excel automatiquement avec openpyxl",
        "Construire un tableau de bord avec des indicateurs cles (KPIs) colores",
        "Generer un compte de resultat financier avec des formules Excel automatiques",
        "Creer un systeme de gestion de stock avec alertes de rupture",
        "Automatiser la gestion RH avec calcul de salaires et suivi des conges",
        "Produire un rapport de direction consolide et professionnel"
    ])

    const requirements = JSON.stringify([
        "Un ordinateur (Windows, macOS ou Linux)",
        "Excel ou LibreOffice Calc installe",
        "Google Antigravity Desktop installe (lien fourni dans la Lecon 1)",
        "Python 3.11 installe (guide complet fourni dans la Lecon 1)",
        "Aucune connaissance en programmation requise - on part de zero !"
    ])

    const course = await prisma.course.create({
        data: {
            title: "Antigravity : Gestion d'Entreprise avec Excel & Python - Guide Debutant",
            title_en: "Antigravity: Business Management with Excel & Python - Beginner Guide",
            title_ar: "Antigravity: Excel & Python pour la Gestion d'Entreprise - Guide Debutant",
            slug,
            description: "Formation 100% debutant : apprenez a automatiser votre gestion d'entreprise avec Excel et Python grace a l'IA Antigravity. Chaque etape expliquee simplement.",
            fullDescription,
            price: 0,
            isFree: true,
            isPublished: true,
            image: '/uploads/antigravity-business-cover.png',
            level: 'Debutant',
            duration: '8 heures',
            learningOutcomes,
            requirements,
        }
    })
    console.log("Cours cree : " + course.title)

    // ================================================================
    // LECON 1 : C'est quoi Python ? Installation & Premier pas
    // ================================================================
    const lesson1 = await prisma.lesson.create({
        data: {
            title: "Lecon 1 - C'est quoi Python ? Votre premier fichier Excel automatique",
            order: 1,
            courseId: course.id,
            isFree: true,
            duration: 45,
        }
    })

    const l1_intro = JSON.stringify({
        type: 'info',
        title: 'Dans cette lecon, vous allez apprendre...',
        body: '**Objectifs de la Lecon 1 :**\n\n1. Comprendre ce qu\'est Python en termes simples\n2. Installer Python et Google Antigravity sur votre ordinateur\n3. Creer votre PREMIER fichier Excel automatiquement avec Python\n4. Comprendre chaque ligne de code (aucun detail cache !)\n\n**Duree estimee :** 45 minutes\n**Niveau :** Absolument debutant - aucune experience requise'
    })

    const l1_c1 = `## C'est quoi Python ? Explique simplement

Imaginez que vous avez un assistant tres obeissant. Vous lui donnez des instructions precises et il les execute exactement. Python, c'est le langage que vous utilisez pour donner ces instructions a votre ordinateur.

### La difference entre Excel et Python

| Ce que vous faites | Dans Excel | Avec Python |
|---|---|---|
| Creer un tableau | Vous cliquez et tapez | Python le cree automatiquement |
| Mettre une couleur | Vous selectionnez et cliquez | Python colorie 1000 cellules en 1 seconde |
| Copier une formule | Vous faites glisser | Python applique la formule a toutes les lignes |
| Repeter une tache | Vous la refaites a la main | Python la repete autant de fois que vous voulez |

### Pourquoi utiliser Python pour Excel ?

**Exemple concret :** Vous avez un fichier avec 500 factures. Vous devez mettre en rouge toutes les factures impayees.

- **Avec Excel :** Vous cliquez sur chaque cellule, vous verifiez, vous colorez. Il faut 2 heures.
- **Avec Python :** Vous ecrivez les instructions une seule fois. Python fait tout en 3 secondes.

### Et Antigravity dans tout ca ?

**Google Antigravity**, c'est un assistant IA qui ecrit le code Python a votre place ! Vous lui dites en francais ce que vous voulez, et il vous donne le code Python pret a utiliser.

C'est comme avoir un developpeur expert disponible 24h/24 qui travaille pour vous gratuitement.

---

## Installation : Suivez ces etapes une par une

### Etape 1 : Installer Python

**Qu'est-ce qu'on installe ?** Python est le programme qui va lire et executer vos instructions.

1. Allez sur **[python.org/downloads](https://www.python.org/downloads/)**
2. Cliquez sur le gros bouton jaune "Download Python 3.11.x"
3. Ouvrez le fichier telecharge
4. **TRES IMPORTANT :** Cochez la case **"Add Python to PATH"** avant de cliquer Installer

Si vous oubliez de cocher "Add to PATH", Python ne fonctionnera pas. Si ca arrive, desinstallez et recommencez en cochant la case.

**Comment verifier que Python est installe ?**

Ouvrez le Terminal (sur Windows : appuyez sur la touche Windows + R, tapez "cmd", appuyez sur Entree). Dans la fenetre noire qui s'ouvre, tapez :

\`\`\`
python --version
\`\`\`

Si vous voyez "Python 3.11.x" affiché, c'est bon ! Si vous voyez une erreur, recommencez l'installation en cochant "Add to PATH".

### Etape 2 : Installer Google Antigravity

1. Allez sur **[antigravity.google.com](https://antigravity.google.com)**
2. Cliquez sur "Telecharger" pour votre systeme (Windows / Mac / Linux)
3. Installez le programme normalement
4. Ouvrez Antigravity depuis votre bureau

### Etape 3 : Installer la bibliotheque openpyxl

**Qu'est-ce qu'une bibliotheque ?** C'est un ensemble d'outils supplementaires que vous ajoutez a Python. Comme une boite a outils : Python de base sait faire beaucoup de choses, mais openpyxl lui apprend specifiquement a travailler avec des fichiers Excel.

Dans le terminal (la fenetre noire), tapez cette commande et appuyez sur Entree :

\`\`\`bash
pip install openpyxl
\`\`\`

Vous allez voir beaucoup de texte defiler. Attendez que ca s'arrete et que vous voyez "Successfully installed openpyxl". C'est bon !

**Installer aussi pandas pour les prochaines lecons :**

\`\`\`bash
pip install pandas
\`\`\``

    const l1_c2 = JSON.stringify({
        type: 'tip',
        title: 'Qu\'est-ce que pip ?',
        body: '**pip** est le "magasin" de Python. Quand vous tapez \`pip install quelquechose\`, Python va chercher cet outil sur internet et l\'installe automatiquement.\n\nC\'est comme aller sur un app store, mais en tapant du texte au lieu de cliquer.'
    })

    const l1_c3 = `## Votre premier programme Python : Creer un fichier Excel

Nous allons maintenant ecrire notre premier programme Python. Il va creer un fichier Excel avec le nom de notre entreprise.

### Comment ecrire et executer du code Python avec Antigravity

1. Ouvrez **Antigravity Desktop**
2. Cliquez sur **"Nouveau fichier"**
3. Nommez le fichier \`premier_excel.py\` (le .py indique que c'est un fichier Python)
4. Dans la zone de chat d'Antigravity, tapez :

\`\`\`
Ecris un script Python qui cree un fichier Excel nomme "TechAlgerie.xlsx".
Dans la cellule A1, ecris "TechAlgerie SARL" en gras, taille 20, couleur bleue.
Dans la cellule A2, ecris "Cree avec Python et Antigravity".
Sauvegarde le fichier.
\`\`\`

Antigravity va vous generer le code. Voici a quoi il devrait ressembler :

\`\`\`python
import openpyxl
from openpyxl.styles import Font

wb = openpyxl.Workbook()
ws = wb.active
ws["A1"] = "TechAlgerie SARL"
ws["A1"].font = Font(size=20, bold=True, color="0000FF")
ws["A2"] = "Cree avec Python et Antigravity"
wb.save("TechAlgerie.xlsx")
print("Fichier cree !")
\`\`\`

### Explication de CHAQUE ligne (rien n'est cache !)

**Ligne 1 : \`import openpyxl\`**

Le mot \`import\` veut dire "charger". On demande a Python de charger la boite a outils openpyxl. Sans cette ligne, Python ne saurait pas ce qu'est un fichier Excel.

C'est comme ouvrir votre boite a outils avant de commencer a travailler.

**Ligne 2 : \`from openpyxl.styles import Font\`**

On charge specifiquement l'outil "Font" (police en anglais). Cet outil nous permet de changer la taille, la couleur et le gras du texte.

Le mot \`from\` veut dire "depuis". On dit : "Depuis openpyxl.styles, charge l'outil Font".

**Ligne 4 : \`wb = openpyxl.Workbook()\`**

\`wb\` est le nom qu'on donne a notre classeur Excel (wb = workbook = classeur). Le signe = signifie "est egal a" ou "contient".

On cree un nouveau classeur vide et on l'appelle \`wb\`.

Analogie : c'est comme ouvrir Excel et voir un classeur vide. La seule difference c'est qu'on utilise du code au lieu de cliquer.

**Ligne 5 : \`ws = wb.active\`**

\`ws\` est le nom qu'on donne a la feuille active (ws = worksheet = feuille de calcul). \`wb.active\` signifie "la feuille qui est actuellement affichee".

Analogie : dans Excel, quand vous ouvrez un classeur, vous etes automatiquement sur la "Feuille 1". C'est ca \`wb.active\`.

**Ligne 7 : \`ws["A1"] = "TechAlgerie SARL"\`**

\`ws["A1"]\` veut dire "la cellule A1 de la feuille ws". Le signe = signifie "ecrire dans". On ecrit le texte "TechAlgerie SARL" dans la cellule A1.

Analogie : c'est exactement comme cliquer sur la cellule A1 dans Excel et taper du texte.

**Ligne 8 : \`ws["A1"].font = Font(size=20, bold=True, color="0000FF")\`**

On applique un style a la cellule A1. Le style contient :
- \`size=20\` : la taille du texte est 20 points
- \`bold=True\` : le texte est en gras (True = Vrai en anglais)
- \`color="0000FF"\` : la couleur est bleue (0000FF est le code couleur hexadecimal du bleu)

Analogie : c'est comme selectionner la cellule A1 dans Excel, puis cliquer sur "Gras", changer la taille a 20 et choisir la couleur bleue dans la barre d'outils.

**Ligne 10 : \`wb.save("TechAlgerie.xlsx")\`**

On sauvegarde le classeur dans un fichier nomme "TechAlgerie.xlsx". Le fichier sera cree dans le meme dossier que votre script Python.

Analogie : c'est comme faire "Fichier > Enregistrer sous" dans Excel.

**Ligne 11 : \`print("Fichier cree !")\`**

\`print\` affiche un message dans le terminal pour vous informer que tout s'est bien passe. C'est facultatif mais utile pour savoir si le programme a fonctionne.`

    const l1_c4 = JSON.stringify({
        type: 'warning',
        title: 'Les codes couleur en Python ne commencent pas par #',
        body: 'Dans Excel, vous choisissez les couleurs avec un selecteur visuel.\n\nDans Python avec openpyxl, les couleurs s\'ecrivent en code **hexadecimal** sans le symbole #.\n\nExemples :\n- Bleu : "0000FF"\n- Rouge : "FF0000"\n- Vert : "00FF00"\n- Noir : "000000"\n- Blanc : "FFFFFF"\n- Orange : "FF8C00"\n\n**Astuce :** Dans Excel, faites Clic droit > Format de cellule > Remplissage > Plus de couleurs. Vous verrez le code hexadecimal. Copiez-le et enlevez le #.'
    })

    const l1_c5 = `## Comment executer votre programme Python

Une fois votre code ecrit dans Antigravity :

**Option 1 : Executer depuis Antigravity**
1. Cliquez sur le bouton "Run" (Executer) ou appuyez sur F5

**Option 2 : Executer depuis le terminal**
1. Ouvrez le terminal (cmd sur Windows)
2. Naviguez vers votre dossier : tapez \`cd Bureau\` ou \`cd Desktop\`
3. Tapez : \`python premier_excel.py\`
4. Appuyez sur Entree

Vous verrez apparaitre "Fichier cree !" dans le terminal, et un fichier "TechAlgerie.xlsx" sera cree dans votre dossier.

### Exercice pratique - A vous de jouer !

Demandez a Antigravity de modifier le script pour :
1. Ajouter votre prenom dans la cellule B1
2. Mettre la cellule A1 avec un fond jaune (couleur FFFF00)
3. Ecrire la date d'aujourd'hui dans la cellule A3

**Prompt pour Antigravity :**

\`\`\`
Modifie le script Python. Dans le fichier Excel :
- Cellule B1 : mon prenom (ex: Mohamed)
- Cellule A1 : fond jaune (couleur FFFF00 en openpyxl)
- Cellule A3 : la date d'aujourd'hui au format JJ/MM/AAAA
\`\`\``

    const l1_c6 = JSON.stringify({
        type: 'success',
        title: 'Bravo ! Vous avez termine la Lecon 1',
        body: 'Vous avez appris :\n\n- Ce qu\'est Python et pourquoi c\'est utile\n- Comment installer Python et openpyxl\n- Comment ecrire un fichier Excel avec Python\n- Ce que signifie chaque ligne de code\n\n**Prochaine lecon :** On cree le Tableau de Bord de TechAlgerie SARL avec des cartes KPI colorees et un graphique en barres !'
    })

    await prisma.courseContent.createMany({
        data: [
            { lessonId: lesson1.id, title: 'intro', contentType: 'CALLOUT', order: 1, content: l1_intro },
            { lessonId: lesson1.id, title: 'python-intro', contentType: 'TEXT', order: 2, content: l1_c1 },
            { lessonId: lesson1.id, title: 'pip-tip', contentType: 'CALLOUT', order: 3, content: l1_c2 },
            { lessonId: lesson1.id, title: 'first-code', contentType: 'TEXT', order: 4, content: l1_c3 },
            { lessonId: lesson1.id, title: 'colors-warning', contentType: 'CALLOUT', order: 5, content: l1_c4 },
            { lessonId: lesson1.id, title: 'run-code', contentType: 'TEXT', order: 6, content: l1_c5 },
            { lessonId: lesson1.id, title: 'fin-l1', contentType: 'CALLOUT', order: 7, content: l1_c6 },
        ]
    })
    console.log("  Lecon 1 creee (7 blocs)")

    // ================================================================
    // LECON 2 : Variables, Boucles et Cartes KPI
    // ================================================================
    const lesson2 = await prisma.lesson.create({
        data: {
            title: "Lecon 2 - Variables & Boucles Python : Construire le Tableau de Bord KPI",
            order: 2,
            courseId: course.id,
            isFree: true,
            duration: 60,
        }
    })

    const l2_intro = JSON.stringify({
        type: 'info',
        title: 'Dans cette lecon, vous allez apprendre...',
        body: '**Objectifs de la Lecon 2 :**\n\n1. Comprendre ce qu\'est une VARIABLE en Python (concept de base)\n2. Comprendre ce qu\'est une BOUCLE (pour ne pas repeter le meme code)\n3. Creer les 4 grandes feuilles de TechAlgerie (Dashboard, Finances, Inventaire, RH)\n4. Construire 6 cartes KPI colorees avec icones\n5. Ajouter un graphique en barres du chiffre d\'affaires mensuel\n\n**Duree estimee :** 60 minutes'
    })

    const l2_c1 = `## Les Variables : Garder des informations en memoire

En Python, une **variable** c'est une boite avec un nom dans laquelle vous rangez une information.

### Exemple concret

En Excel, quand vous ecrivez "180000" dans la cellule B2, vous vous souvenez que c'est le CA de Janvier. Mais si vous avez besoin de ce nombre a 10 endroits differents, vous devez l'ecrire 10 fois.

Avec Python :

\`\`\`python
ca_janvier = 180000
\`\`\`

Maintenant \`ca_janvier\` contient le nombre 180000. Vous pouvez l'utiliser partout dans votre code en ecrivant juste \`ca_janvier\`.

### Les differents types de variables

**Un nombre entier (Int) :**

\`\`\`python
nombre_employes = 47
annee = 2024
\`\`\`

**Un nombre decimal (Float) :**

\`\`\`python
taux_tva = 0.19
marge_beneficiaire = 0.23
\`\`\`

**Un texte (String) :**

\`\`\`python
nom_entreprise = "TechAlgerie SARL"
ville = "Alger"
\`\`\`

Notez que les textes sont toujours entre guillemets. Les nombres n'ont pas de guillemets.

**Un vrai/faux (Boolean) :**

\`\`\`python
est_publie = True
est_gratuit = False
\`\`\`

True = Vrai, False = Faux. Pas de guillemets, commence par une majuscule.

### Calculer avec des variables

\`\`\`python
prix_achat = 85000
prix_vente = 120000
benefice = prix_vente - prix_achat    # benefice vaut 35000
marge = benefice / prix_vente * 100   # marge vaut 29.16 (en pourcentage)

print("Benefice : " + str(benefice) + " DZD")
print("Marge : " + str(round(marge, 2)) + " %")
\`\`\`

**Explication des nouveaux mots :**
- \`/\` : division
- \`*\` : multiplication  
- \`-\` : soustraction
- \`+\` : addition
- \`str()\` : convertit un nombre en texte (pour pouvoir l'afficher avec \`print\`)
- \`round(marge, 2)\` : arrondit a 2 decimales

---

## Les Listes : Plusieurs valeurs dans une seule variable

Imaginez une liste de courses. Au lieu d'ecrire :

\`\`\`python
mois_1 = "Janvier"
mois_2 = "Fevrier"
mois_3 = "Mars"
\`\`\`

Vous pouvez ecrire une seule liste :

\`\`\`python
mois = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]
\`\`\`

Les crochets [ ] delimitent la liste. Chaque element est separe par une virgule.

**Acceder a un element de la liste :**

\`\`\`python
premier_mois = mois[0]   # "Janvier" (on commence a compter par 0 en Python !)
deuxieme_mois = mois[1]  # "Fevrier"
dernier_mois = mois[11]  # "Decembre"
\`\`\`

ATTENTION : En Python, on compte a partir de 0, pas de 1 !

---

## Les Boucles : Ne pas repeter le meme code

Imaginez que vous voulez ecrire les 12 mois dans votre feuille Excel, un par ligne.

**Sans boucle (a eviter - trop long) :**

\`\`\`python
ws["A1"] = "Janvier"
ws["A2"] = "Fevrier"
ws["A3"] = "Mars"
# ... x 12 lignes
\`\`\`

**Avec une boucle "for" (la bonne facon) :**

\`\`\`python
mois = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]

for i, nom_mois in enumerate(mois):
    ws["A" + str(i + 1)] = nom_mois
\`\`\`

**Explication :**
- \`for\` : "pour chaque"
- \`i\` : le numero (0, 1, 2, 3...) - c'est un compteur automatique
- \`nom_mois\` : la valeur actuelle de la liste (Janvier, puis Fevrier, etc.)
- \`enumerate(mois)\` : parcourir la liste mois en donnant aussi le numero
- \`str(i + 1)\` : convertir le numero en texte (et ajouter 1 car Excel commence a 1 et Python a 0)

La boucle va s'executer 12 fois automatiquement, une fois pour chaque mois !`

    const l2_c2 = JSON.stringify({
        type: 'tip',
        title: 'Analogie : La boucle = Le stagiaire obeissant',
        body: 'Imaginez que vous avez un stagiaire. Vous lui donnez une instruction :\n\n*"Pour chaque ligne de ma liste de 500 clients, ecris le nom dans la colonne A, le telephone dans la colonne B et la ville dans la colonne C."*\n\nLe stagiaire execute cette instruction 500 fois.\n\nEn Python, la boucle **for** est ce stagiaire. Elle execute vos instructions autant de fois que necessaire, sans se plaindre et sans se tromper.'
    })

    const l2_c3 = `## Creer la structure de TechAlgerie SARL

Maintenant qu'on comprend les variables et les boucles, on va creer notre fichier Excel principal avec les 4 feuilles metier.

### Le plan du fichier

Voici ce qu'on va construire :
- Feuille **"Dashboard"** : Les chiffres cles (KPIs)
- Feuille **"Finances"** : Le compte de resultat
- Feuille **"Inventaire"** : La liste des produits
- Feuille **"RH"** : Les employes

### Prompt pour Antigravity

Ouvrez Antigravity et tapez :

\`\`\`
Cree un fichier Python nomme "techalg_init.py".
Ce script doit creer un fichier Excel "TechAlgerie_Business.xlsx" avec openpyxl.
Le classeur doit contenir 4 feuilles : "Dashboard", "Finances", "Inventaire", "RH".
Sur la premiere feuille "Dashboard" :
- Fond bleu marine (1A237E) sur toutes les cellules de A1 a H8
- Cellule A1 : texte "TechAlgerie SARL - Tableau de Bord 2024" en blanc, gras, taille 18
- Fusionner A1 jusqu'a H2
- Ligne 4 : 4 boutons de navigation colores en A4, C4, E4, G4
  - A4 : "Dashboard" fond bleu 4472C4
  - C4 : "Finances" fond vert 70AD47
  - E4 : "Inventaire" fond orange ED7D31
  - G4 : "RH" fond violet 9E3F8C
  Chaque bouton : texte blanc, gras, taille 12, cellules fusionnees sur 2 colonnes
Largeur de chaque colonne : 18
\`\`\`

### Le script genere par Antigravity (avec explications detaillees)

\`\`\`python
# ====================================================
# techalg_init.py
# Initialisation du fichier Excel TechAlgerie SARL
# ====================================================

# 1. Importer les outils necessaires
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

# 2. Creer un nouveau classeur Excel vide
wb = openpyxl.Workbook()
# wb.active est la feuille qui existe par defaut
# On la renomme tout de suite en "Dashboard"
ws_dash = wb.active
ws_dash.title = "Dashboard"

# 3. Creer les 3 autres feuilles
# create_sheet() ajoute une nouvelle feuille au classeur
ws_fin = wb.create_sheet("Finances")
ws_inv = wb.create_sheet("Inventaire")
ws_rh  = wb.create_sheet("RH")

# 4. Configurer la feuille Dashboard
# On definit la couleur de fond bleue marine
# PatternFill = remplissage avec un motif
# start_color et end_color = meme couleur = couleur unie
fond_bleu = PatternFill(start_color="1A237E",
                        end_color="1A237E",
                        fill_type="solid")

# 5. Appliquer le fond bleu sur les lignes 1 a 8, colonnes A a H
# C'est la boucle imbriquee : une boucle dans une autre boucle
for ligne in range(1, 9):      # range(1, 9) = 1, 2, 3, 4, 5, 6, 7, 8
    for col in range(1, 9):    # range(1, 9) = colonnes 1 a 8 (A a H)
        cellule = ws_dash.cell(row=ligne, column=col)
        cellule.fill = fond_bleu
        # Note : ws_dash.cell(row=1, column=1) = cellule A1
        #        ws_dash.cell(row=1, column=2) = cellule B1, etc.

# 6. Ecrire le titre dans la cellule A1
ws_dash["A1"] = "TechAlgerie SARL - Tableau de Bord 2024"
ws_dash["A1"].font = Font(
    name="Calibri",     # Nom de la police
    size=18,            # Taille 18 points
    bold=True,          # Gras
    color="FFFFFF"      # Blanc
)
ws_dash["A1"].alignment = Alignment(
    horizontal="center",    # Centre horizontalement
    vertical="center"       # Centre verticalement
)

# 7. Fusionner les cellules A1 jusqu'a H2
# merge_cells() fusionne plusieurs cellules en une seule grande cellule
# Comme "Fusionner et centrer" dans Excel
ws_dash.merge_cells("A1:H2")
ws_dash.row_dimensions[1].height = 45   # Hauteur de la ligne 1 = 45 pixels

# 8. Creer les 4 boutons de navigation
# On utilise une LISTE de tuples (groupes de valeurs)
# Format de chaque tuple : (cellule, texte, couleur)
boutons = [
    ("A4", "Dashboard",  "4472C4"),  # Bleu
    ("C4", "Finances",   "70AD47"),  # Vert
    ("E4", "Inventaire", "ED7D31"),  # Orange
    ("G4", "RH",         "9E3F8C"),  # Violet
]

# 9. La boucle "for" cree chaque bouton automatiquement
# Au lieu d'ecrire le meme code 4 fois, on l'ecrit une fois dans la boucle
for ref_cellule, texte, couleur in boutons:
    # ref_cellule prend successivement "A4", "C4", "E4", "G4"
    # texte prend "Dashboard", "Finances", etc.
    # couleur prend "4472C4", "70AD47", etc.

    cellule = ws_dash[ref_cellule]
    cellule.value = texte
    cellule.font = Font(bold=True, color="FFFFFF", size=12)
    cellule.fill = PatternFill(start_color=couleur,
                               end_color=couleur,
                               fill_type="solid")
    cellule.alignment = Alignment(horizontal="center",
                                  vertical="center")

# 10. Fusionner chaque bouton sur 2 colonnes
# A4:B4, C4:D4, E4:F4, G4:H4
plages_fusion = ["A4:B4", "C4:D4", "E4:F4", "G4:H4"]
for plage in plages_fusion:
    ws_dash.merge_cells(plage)

ws_dash.row_dimensions[4].height = 35

# 11. Ajuster la largeur de toutes les colonnes
for num_col in range(1, 9):   # Colonnes 1 a 8
    lettre = get_column_letter(num_col)  # 1->A, 2->B, etc.
    ws_dash.column_dimensions[lettre].width = 18

# 12. Sauvegarder le fichier
wb.save("TechAlgerie_Business.xlsx")
print("Fichier TechAlgerie_Business.xlsx cree avec succes !")
print("Feuilles creees : " + str(wb.sheetnames))
\`\`\`

### Comparaison : Ce code vs ce que vous feriez dans Excel

| Action Python | Equivalent Excel |
|---|---|
| \`wb = openpyxl.Workbook()\` | Ouvrir Excel avec un classeur vide |
| \`ws_dash = wb.active\` | Etre sur la Feuille 1 |
| \`ws_dash.title = "Dashboard"\` | Double-cliquer sur l'onglet et renommer |
| \`wb.create_sheet("Finances")\` | Clic droit sur onglet > Inserer feuille |
| \`ws_dash["A1"] = "Texte"\` | Cliquer sur A1 et taper |
| \`ws_dash.merge_cells("A1:H2")\` | Selectionner A1:H2 > Fusionner et centrer |
| \`wb.save("fichier.xlsx")\` | Fichier > Enregistrer sous |`

    const l2_c4 = JSON.stringify({
        type: 'info',
        title: 'Le concept de "tuple" en Python',
        body: 'Dans le code, vous avez vu cette ligne :\n```\nboutons = [("A4", "Dashboard", "4472C4"), ...]\n```\n\nUn **tuple** c\'est un groupe de valeurs entre parentheses (). C\'est comme une ligne dans un tableau Excel :\n- La 1ere valeur = la reference de cellule\n- La 2eme valeur = le texte\n- La 3eme valeur = la couleur\n\nQuand on ecrit `for ref, texte, couleur in boutons`, Python "depaquete" automatiquement chaque tuple en 3 variables separees. Pratique !'
    })

    const l2_c5 = `## Les 6 Cartes KPI du Tableau de Bord

Les KPIs (Key Performance Indicators = Indicateurs Cles de Performance) sont les chiffres les plus importants pour votre entreprise. On va les afficher dans des "cartes" colorees.

### Les 6 KPIs de TechAlgerie

| KPI | Valeur | Signification |
|---|---|---|
| CA Mensuel | 185 420 DZD | Chiffre d'affaires du mois en cours |
| Benefice Net | 38 900 DZD | Ce que l'entreprise gagne apres toutes les charges |
| Commandes | 147 | Nombre de commandes ce mois |
| Employes | 47 | Effectif total actif |
| Stock | 1 203 unites | Nombre d'articles disponibles en entrepot |
| Satisfaction | 4.2/5 | Note moyenne des clients |

### Prompt Antigravity pour les cartes KPI

\`\`\`
Dans la feuille "Dashboard" du fichier TechAlgerie_Business.xlsx,
ajoute 6 cartes KPI a partir de la ligne 6.
Chaque carte doit occuper 2 colonnes x 4 lignes.
Disposition : 3 cartes en ligne 6 (colonnes A-B, C-D, E-F)
              3 cartes en ligne 11 (colonnes A-B, C-D, E-F)

Carte 1 : Titre="CA Mensuel", Valeur="185 420 DZD", fond=#E3F2FD
Carte 2 : Titre="Benefice Net", Valeur="38 900 DZD", fond=#E8F5E9
Carte 3 : Titre="Commandes", Valeur="147 ce mois", fond=#FFF3E0
Carte 4 : Titre="Employes", Valeur="47 actifs", fond=#F3E5F5
Carte 5 : Titre="Stock", Valeur="1 203 unites", fond=#FCE4EC
Carte 6 : Titre="Satisfaction", Valeur="4.2 / 5", fond=#E0F7FA

Pour chaque carte :
- Ligne 1 du bloc : Titre en gras, taille 9, couleur sombre, centre
- Ligne 2-3 du bloc : Valeur en gras, taille 16, couleur bleu marine 1A237E, centre
- Bordure fine grise sur toutes les cellules de la carte
- Couleur de fond selon les specs
\`\`\`

### Le script des cartes KPI explique etape par etape

\`\`\`python
# ====================================================
# dashboard_kpi.py - Les cartes KPI du tableau de bord
# ====================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Charger le fichier existant (celui cree par techalg_init.py)
# load_workbook() ouvre un fichier Excel existant
# C'est different de Workbook() qui cree un fichier vide
wb = openpyxl.load_workbook("TechAlgerie_Business.xlsx")
ws = wb["Dashboard"]   # On selectionne la feuille "Dashboard"

# --- Fonction pour creer une bordure ---
# Une "fonction" en Python c'est un bloc de code reutilisable
# que vous definissez une fois et appelez plusieurs fois
# Mot cle : "def" suivi du nom de la fonction et de ()
def creer_bordure():
    """Cree une bordure fine et grise pour les cellules."""
    cote = Side(style="thin", color="CCCCCC")   # Trait fin, couleur gris clair
    return Border(left=cote, right=cote, top=cote, bottom=cote)
    # return = "renvoyer" la valeur calculee

# --- Fonction pour creer une carte KPI ---
# Cette fonction prend 5 parametres (informations d'entree)
def creer_carte(ws, ligne_debut, col_debut, titre, valeur, couleur_fond):
    """
    Cree une carte KPI dans la feuille de calcul.
    
    Parametres :
    - ws          : la feuille de calcul (worksheet)
    - ligne_debut : numero de la ligne de depart (ex: 6)
    - col_debut   : numero de la colonne de depart (ex: 1 pour A)
    - titre       : texte du titre de la carte
    - valeur      : valeur a afficher en grand
    - couleur_fond: code couleur hexadecimal (sans #)
    """
    col_fin = col_debut + 1   # La carte occupe 2 colonnes
    
    # Appliquer la couleur de fond sur les 4 lignes de la carte
    fond = PatternFill(start_color=couleur_fond,
                       end_color=couleur_fond,
                       fill_type="solid")
    
    for r in range(ligne_debut, ligne_debut + 4):   # 4 lignes
        for c in range(col_debut, col_fin + 1):      # 2 colonnes
            cellule = ws.cell(row=r, column=c)
            cellule.fill = fond
            cellule.border = creer_bordure()   # On appelle notre fonction !
    
    # Ligne 1 de la carte : le TITRE
    cellule_titre = ws.cell(row=ligne_debut, column=col_debut)
    cellule_titre.value = titre
    cellule_titre.font = Font(bold=True, size=9, color="455A64")  # Gris fonce
    cellule_titre.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[ligne_debut].height = 20
    
    # Fusionner le titre sur les 2 colonnes de la carte
    ws.merge_cells(start_row=ligne_debut,    start_column=col_debut,
                   end_row=ligne_debut,      end_column=col_fin)
    
    # Ligne 2-3 de la carte : la VALEUR (grande)
    cellule_valeur = ws.cell(row=ligne_debut + 1, column=col_debut)
    cellule_valeur.value = valeur
    cellule_valeur.font = Font(bold=True, size=16, color="1A237E")  # Bleu marine
    cellule_valeur.alignment = Alignment(horizontal="center", vertical="center")
    
    # Fusionner la valeur sur 2 colonnes et 2 lignes
    ws.merge_cells(start_row=ligne_debut + 1,  start_column=col_debut,
                   end_row=ligne_debut + 2,    end_column=col_fin)
    ws.row_dimensions[ligne_debut + 1].height = 25
    ws.row_dimensions[ligne_debut + 2].height = 15

# --- Donnees des 6 cartes ---
# Chaque element = (ligne, colonne, titre, valeur, couleur)
kpis = [
    (6,  1, "CA Mensuel",    "185 420 DZD",  "E3F2FD"),
    (6,  3, "Benefice Net",  "38 900 DZD",   "E8F5E9"),
    (6,  5, "Commandes",     "147 ce mois",  "FFF3E0"),
    (11, 1, "Employes",      "47 actifs",    "F3E5F5"),
    (11, 3, "Stock",         "1 203 unites", "FCE4EC"),
    (11, 5, "Satisfaction",  "4.2 / 5",      "E0F7FA"),
]

# --- Creer chaque carte avec la boucle for ---
# Pour chaque element dans la liste kpis, on appelle la fonction creer_carte
for ligne, col, titre, valeur, couleur in kpis:
    creer_carte(ws, ligne, col, titre, valeur, couleur)
    print("Carte creee : " + titre)

# --- Titre de la section KPI ---
ws["A5"] = "Indicateurs Cles de Performance (KPIs)"
ws["A5"].font = Font(bold=True, size=11, color="1A237E")
ws.merge_cells("A5:F5")
ws["A5"].alignment = Alignment(horizontal="left")
ws.row_dimensions[5].height = 22

# --- Ajuster les largeurs de colonnes ---
for num_col in range(1, 7):
    ws.column_dimensions[get_column_letter(num_col)].width = 16

# --- Sauvegarder ---
wb.save("TechAlgerie_Business.xlsx")
print("Tableau de bord avec KPIs sauvegarde !")
\`\`\``

    const l2_c6 = JSON.stringify({
        type: 'tip',
        title: 'Les fonctions : votre meilleur outil contre la repetition',
        body: 'Vous avez vu que le code contient `def creer_carte(...)` et `def creer_bordure()`.\n\nUne **fonction** c\'est comme une recette de cuisine que vous ecrivez une fois. Ensuite, au lieu de re-ecrire toute la recette, vous l\'appelez juste par son nom.\n\nSans fonction, le code pour 6 cartes serait 6 x plus long. Avec la fonction, c\'est court et facile a modifier (si vous changez la fonction, toutes les cartes changent automatiquement).\n\n**Pour creer une fonction :**\n```python\ndef nom_de_la_fonction(parametre1, parametre2):\n    # Votre code ici\n    return resultat\n```'
    })

    const l2_c7 = JSON.stringify({
        type: 'success',
        title: 'Bravo ! Lecon 2 terminee',
        body: 'Vous maitrisez maintenant :\n\n- Les variables (stocker des donnees)\n- Les listes (plusieurs valeurs)\n- Les boucles for (repeter du code)\n- Les fonctions (reutiliser du code)\n- La creation de cartes KPI colorees\n\n**Lecon suivante :** Le Rapport Financier avec le Compte de Resultat et les formules Excel automatiques !'
    })

    await prisma.courseContent.createMany({
        data: [
            { lessonId: lesson2.id, title: 'intro', contentType: 'CALLOUT', order: 1, content: l2_intro },
            { lessonId: lesson2.id, title: 'variables', contentType: 'TEXT', order: 2, content: l2_c1 },
            { lessonId: lesson2.id, title: 'boucle-analogie', contentType: 'CALLOUT', order: 3, content: l2_c2 },
            { lessonId: lesson2.id, title: 'structure', contentType: 'TEXT', order: 4, content: l2_c3 },
            { lessonId: lesson2.id, title: 'tuple-tip', contentType: 'CALLOUT', order: 5, content: l2_c4 },
            { lessonId: lesson2.id, title: 'kpi-cards', contentType: 'TEXT', order: 6, content: l2_c5 },
            { lessonId: lesson2.id, title: 'fonctions-tip', contentType: 'CALLOUT', order: 7, content: l2_c6 },
            { lessonId: lesson2.id, title: 'fin-l2', contentType: 'CALLOUT', order: 8, content: l2_c7 },
        ]
    })
    console.log("  Lecon 2 creee (8 blocs)")

    // ================================================================
    // LECON 3 : Conditions et Rapport Financier
    // ================================================================
    const lesson3 = await prisma.lesson.create({
        data: {
            title: "Lecon 3 - Conditions Python & Rapport Financier : Compte de Resultat",
            order: 3,
            courseId: course.id,
            isFree: false,
            duration: 65,
        }
    })

    const l3_intro = JSON.stringify({
        type: 'info',
        title: 'Dans cette lecon, vous allez apprendre...',
        body: '**Objectifs de la Lecon 3 :**\n\n1. Comprendre les CONDITIONS en Python (if/elif/else)\n2. Comprendre comment Python ecrit des FORMULES EXCEL automatiquement\n3. Creer un Compte de Resultat (P&L) complet avec :\n   - Section Revenus coloree en vert\n   - Section Charges coloree en rouge\n   - Formules Excel dynamiques (Total Revenus, Total Charges, Benefice)\n   - Format monetaire DZD sur tous les nombres\n4. Creer un Tableau de Tresorerie mensuel avec alertes\n\n**Duree estimee :** 65 minutes'
    })

    const l3_c1 = `## Les Conditions : Prendre des decisions dans le code

En Excel, vous utilisez la formule IF() pour prendre des decisions :

\`\`\`
=IF(B2>0, "Benefice", "Perte")
\`\`\`

En Python, c'est le mot-cle \`if\` (suivi de \`elif\` et \`else\`) :

\`\`\`python
benefice = 38900

if benefice > 0:
    print("L'entreprise est beneficiaire")
elif benefice == 0:
    print("L'entreprise est a l'equilibre")
else:
    print("L'entreprise est en perte")
\`\`\`

**Explication :**
- \`if\` : "si" - teste la condition
- \`elif\` : "sinon si" (else if) - teste une autre condition si la premiere est fausse
- \`else\` : "sinon" - s'execute si aucune condition n'est vraie
- \`>\` : superieur a
- \`==\` : egal a (deux signes = pour comparer, un seul pour assigner)
- \`<\` : inferieur a
- \`>=\` : superieur ou egal a
- Les deux points ":" a la fin de chaque condition sont OBLIGATOIRES

### Les conditions pour formater les cellules Excel

\`\`\`python
for categorie, montant, type_ligne in donnees:
    cellule = ws.cell(row=ligne_actuelle, column=1)
    cellule.value = categorie
    
    # Condition pour choisir la couleur selon le type de ligne
    if type_ligne == "revenu":
        cellule.fill = PatternFill(start_color="E8F5E9", end_color="E8F5E9", fill_type="solid")
    elif type_ligne == "charge":
        cellule.fill = PatternFill(start_color="FFEBEE", end_color="FFEBEE", fill_type="solid")
    elif type_ligne == "total":
        cellule.fill = PatternFill(start_color="FFF9C4", end_color="FFF9C4", fill_type="solid")
    else:
        cellule.fill = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
\`\`\`

---

## Comment Python ecrit des formules Excel

C'est une des choses les plus puissantes ! Python peut ecrire les formules Excel a votre place.

### Exemple : La formule SOMME

En Excel, vous ecrivez manuellement dans la cellule F10 :
\`\`\`
=SUM(F5:F9)
\`\`\`

En Python, vous faites ecrire cette formule automatiquement :
\`\`\`python
# ligne_total est le numero de la ligne ou on veut la formule
# Exemple : ligne_total = 10
ws.cell(row=ligne_total, column=6).value = "=SUM(F5:F9)"
\`\`\`

Ou encore mieux, avec des variables pour que ca soit dynamique :
\`\`\`python
debut = 5
fin = 9
ws.cell(row=10, column=6).value = "=SUM(F" + str(debut) + ":F" + str(fin) + ")"
# Ca ecrit la formule : =SUM(F5:F9)
\`\`\`

### Les formules Excel que Python peut ecrire

| Formule Excel | Ce que Python ecrit |
|---|---|
| =SUM(B5:B10) | "=SUM(B5:B10)" |
| =B5-B10 | "=B5-B10" |
| =B5/B10*100 | "=B5/B10*100" |
| =IF(B5>0,"Bon","Mauvais") | "=IF(B5>0,\\"Bon\\",\\"Mauvais\\")" |
| =AVERAGE(B5:B10) | "=AVERAGE(B5:B10)" |`

    const l3_c2 = JSON.stringify({
        type: 'tip',
        title: 'Pourquoi ecrire des formules avec Python plutot qu\'a la main ?',
        body: 'Imaginez un tableau avec 50 lignes de donnees. Pour chaque ligne, vous avez besoin d\'une formule de total.\n\n**A la main dans Excel :** Vous ecrivez la formule dans la premiere cellule, puis vous faites glisser vers le bas sur 50 lignes. Ca marche, mais si la structure change, il faut tout refaire.\n\n**Avec Python :** Une boucle for ecrit automatiquement les 50 formules. Si la structure change, vous modifiez le code une fois et Python regenere tout.\n\nDe plus, quand vous partagez le fichier Excel, les formules restent actives : si quelqu\'un change les donnees, les totaux se recalculent automatiquement !'
    })

    const l3_c3 = `## Le Compte de Resultat de TechAlgerie SARL

Le Compte de Resultat (aussi appele P&L = Profit & Loss) montre :
- Les **Revenus** : tout l'argent encaisse
- Les **Charges** : tout l'argent depense
- Le **Benefice** = Revenus - Charges

### Les donnees financieres de TechAlgerie (fictives)

| Categorie | T1 | T2 | T3 | T4 |
|---|---|---|---|---|
| Ventes Materiel | 450 000 | 520 000 | 480 000 | 510 000 |
| Prestations | 95 000 | 110 000 | 105 000 | 120 000 |
| Maintenance | 22 000 | 25 000 | 24 000 | 26 000 |
| **Total Revenus** | **567 000** | **655 000** | **609 000** | **656 000** |
| Salaires | 280 000 | 295 000 | 288 000 | 310 000 |
| Loyer | 48 000 | 48 000 | 48 000 | 48 000 |
| Achats | 125 000 | 148 000 | 132 000 | 145 000 |
| **Total Charges** | **453 000** | **491 000** | **468 000** | **503 000** |
| **BENEFICE NET** | **114 000** | **164 000** | **141 000** | **153 000** |

### Le script complet du Compte de Resultat

\`\`\`python
# ====================================================
# finances_resultat.py - Compte de Resultat TechAlgerie
# ====================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.load_workbook("TechAlgerie_Business.xlsx")
ws = wb["Finances"]

# --- Couleurs utilisees ---
# On cree des variables pour les couleurs au lieu d'ecrire le code couleur partout
# Si on veut changer une couleur, on la change une seule fois ici
VERT_PALE   = "E8F5E9"   # Fond des lignes de revenus
ROUGE_PALE  = "FFEBEE"   # Fond des lignes de charges
JAUNE_PALE  = "FFF9C4"   # Fond des lignes de totaux intermediaires
BLEU_MARINE = "1A237E"   # Fond de la ligne BENEFICE NET
GRIS_TITRE  = "455A64"   # Fond des en-tetes de colonnes

FORMAT_DZD = '#,##0 "DZD"'  # Format monetaire : 150,000 DZD

# --- Fonction bordure fine ---
def bordure():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)

# --- Titre du rapport ---
ws.merge_cells("A1:F1")
ws["A1"] = "COMPTE DE RESULTAT - TechAlgerie SARL - Exercice 2024"
ws["A1"].font = Font(bold=True, size=13, color="1A237E")
ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 30

ws.merge_cells("A2:F2")
ws["A2"] = "Montants en Dinars Algeriens (DZD) - Genere avec Google Antigravity"
ws["A2"].font = Font(italic=True, size=9, color="888888")
ws.row_dimensions[2].height = 18

# --- En-tetes des colonnes (ligne 4) ---
entetes = ["CATEGORIE", "T1 (Jan-Mar)", "T2 (Avr-Jun)", "T3 (Jul-Sep)", "T4 (Oct-Dec)", "TOTAL ANNUEL"]

for num_col, titre_col in enumerate(entetes, start=1):
    # enumerate() donne automatiquement le numero (1, 2, 3...) et la valeur
    cellule = ws.cell(row=4, column=num_col)
    cellule.value = titre_col
    cellule.font = Font(bold=True, color="FFFFFF", size=10)
    cellule.fill = PatternFill(start_color=GRIS_TITRE, end_color=GRIS_TITRE, fill_type="solid")
    cellule.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cellule.border = bordure()
    ws.row_dimensions[4].height = 35

# Largeurs des colonnes
ws.column_dimensions["A"].width = 28
for lettre in ["B", "C", "D", "E", "F"]:
    ws.column_dimensions[lettre].width = 16

# --- Structure des donnees du P&L ---
# Format : (nom_categorie, T1, T2, T3, T4, type_de_ligne)
# type_de_ligne determine la couleur et si on calcule la formule ou pas
lignes_pl = [
    # ---- SECTION REVENUS ----
    ("=== REVENUS ===",     None,   None,   None,   None,   "titre_section"),
    ("Ventes Materiel",     450000, 520000, 480000, 510000, "revenu"),
    ("Prestations Services",95000,  110000, 105000, 120000, "revenu"),
    ("Maintenance & Support",22000, 25000,  24000,  26000,  "revenu"),
    ("TOTAL REVENUS",       None,   None,   None,   None,   "total_revenus"),  # Formule auto
    # ---- SECTION CHARGES ----
    ("=== CHARGES ===",     None,   None,   None,   None,   "titre_section"),
    ("Salaires & Charges",  280000, 295000, 288000, 310000, "charge"),
    ("Loyer & Charges fixes",48000, 48000,  48000,  48000,  "charge"),
    ("Achats Marchandises", 125000, 148000, 132000, 145000, "charge"),
    ("Marketing & Pub",     15000,  18000,  14000,  16000,  "charge"),
    ("Frais Generaux",      12000,  13500,  12500,  14000,  "charge"),
    ("TOTAL CHARGES",       None,   None,   None,   None,   "total_charges"),  # Formule auto
    # ---- RESULTAT FINAL ----
    ("BENEFICE NET",        None,   None,   None,   None,   "benefice_net"),   # Formule auto
]

# Variables pour se souvenir des numeros de lignes
# (necessaires pour calculer les formules)
ligne_actuelle = 5          # On commence a ecrire a partir de la ligne 5
lignes_revenus = []         # Liste des lignes contenant des revenus
lignes_charges = []         # Liste des lignes contenant des charges
num_ligne_total_rev = None  # Numero de la ligne "TOTAL REVENUS"
num_ligne_total_cha = None  # Numero de la ligne "TOTAL CHARGES"

# --- Boucle principale : ecrire chaque ligne du P&L ---
for nom, t1, t2, t3, t4, type_ligne in lignes_pl:

    # Determiner la couleur de fond selon le type de ligne
    if type_ligne == "titre_section":
        couleur_fond = "37474F"      # Gris fonce (c'est un titre de section)
        couleur_texte = "FFFFFF"     # Texte blanc
        taille_texte = 10
        gras = True
        afficher_valeurs = False     # Pas de valeurs pour les titres de section
    elif type_ligne == "revenu":
        couleur_fond = VERT_PALE
        couleur_texte = "333333"
        taille_texte = 10
        gras = False
        afficher_valeurs = True
        lignes_revenus.append(ligne_actuelle)  # Memoriser le numero de cette ligne
    elif type_ligne == "charge":
        couleur_fond = ROUGE_PALE
        couleur_texte = "333333"
        taille_texte = 10
        gras = False
        afficher_valeurs = True
        lignes_charges.append(ligne_actuelle)  # Memoriser le numero de cette ligne
    elif type_ligne == "total_revenus":
        couleur_fond = JAUNE_PALE
        couleur_texte = "2E7D32"     # Vert fonce
        taille_texte = 11
        gras = True
        afficher_valeurs = True
        num_ligne_total_rev = ligne_actuelle   # Retenir le numero de cette ligne
    elif type_ligne == "total_charges":
        couleur_fond = JAUNE_PALE
        couleur_texte = "C62828"     # Rouge fonce
        taille_texte = 11
        gras = True
        afficher_valeurs = True
        num_ligne_total_cha = ligne_actuelle
    elif type_ligne == "benefice_net":
        couleur_fond = BLEU_MARINE
        couleur_texte = "FFFFFF"     # Texte blanc sur fond bleu marine
        taille_texte = 13
        gras = True
        afficher_valeurs = True

    # Creer le remplissage de fond
    fond = PatternFill(start_color=couleur_fond, end_color=couleur_fond, fill_type="solid")

    # Ecrire le nom de la categorie dans la colonne A
    cellule_nom = ws.cell(row=ligne_actuelle, column=1)
    cellule_nom.value = nom
    cellule_nom.font = Font(bold=gras, size=taille_texte, color=couleur_texte)
    cellule_nom.fill = fond
    cellule_nom.border = bordure()
    cellule_nom.alignment = Alignment(vertical="center")
    ws.row_dimensions[ligne_actuelle].height = 22

    # Ecrire les valeurs dans les colonnes B, C, D, E (T1, T2, T3, T4)
    if afficher_valeurs:
        valeurs_par_trimestre = [t1, t2, t3, t4]

        for num_col in range(2, 6):   # Colonnes B=2, C=3, D=4, E=5
            cellule = ws.cell(row=ligne_actuelle, column=num_col)
            lettre_col = get_column_letter(num_col)   # 2 -> "B", 3 -> "C", etc.

            # Choisir quoi ecrire selon le type de ligne
            if type_ligne in ("revenu", "charge"):
                # Valeur directe (un nombre)
                cellule.value = valeurs_par_trimestre[num_col - 2]

            elif type_ligne == "total_revenus":
                # Formule Excel qui additionne toutes les lignes de revenus
                # Ex: =B6+B7+B8 si les revenus sont en lignes 6, 7 et 8
                refs = "+".join([lettre_col + str(r) for r in lignes_revenus])
                cellule.value = "=" + refs  # Ca donne "=B6+B7+B8"

            elif type_ligne == "total_charges":
                # Formule pour additionner toutes les charges
                refs = "+".join([lettre_col + str(r) for r in lignes_charges])
                cellule.value = "=" + refs

            elif type_ligne == "benefice_net":
                # Benefice = Total Revenus - Total Charges
                cellule.value = "=" + lettre_col + str(num_ligne_total_rev) + "-" + lettre_col + str(num_ligne_total_cha)

            # Appliquer le format monetaire DZD
            cellule.number_format = FORMAT_DZD
            cellule.font = Font(bold=gras, color=couleur_texte, size=taille_texte)
            cellule.fill = fond
            cellule.border = bordure()
            cellule.alignment = Alignment(horizontal="right", vertical="center")

        # Colonne F (Total annuel) : somme des 4 trimestres
        cellule_total = ws.cell(row=ligne_actuelle, column=6)
        if type_ligne == "benefice_net":
            cellule_total.value = "=F" + str(num_ligne_total_rev) + "-F" + str(num_ligne_total_cha)
        else:
            cellule_total.value = "=SUM(B" + str(ligne_actuelle) + ":E" + str(ligne_actuelle) + ")"
        cellule_total.number_format = FORMAT_DZD
        cellule_total.font = Font(bold=True, color=couleur_texte, size=taille_texte)
        cellule_total.fill = fond
        cellule_total.border = bordure()
        cellule_total.alignment = Alignment(horizontal="right", vertical="center")

    ligne_actuelle += 1  # Passer a la ligne suivante

# Figer les volets : la colonne A et les lignes 1-4 restent visibles meme en scrollant
ws.freeze_panes = "B5"

wb.save("TechAlgerie_Business.xlsx")
print("Compte de Resultat cree avec succes !")
\`\`\``

    const l3_c4 = JSON.stringify({
        type: 'info',
        title: 'Comprendre le code avance : les comprehensions de liste',
        body: 'Vous avez vu cette ligne dans le code :\n```python\nrefs = "+".join([lettre_col + str(r) for r in lignes_revenus])\n```\n\nC\'est une "list comprehension" (creation de liste condensee). Voici comment la lire :\n- `[... for r in lignes_revenus]` : "pour chaque numero r dans la liste lignes_revenus, cree cet element"\n- `lettre_col + str(r)` : concatener la lettre de colonne et le numero de ligne (ex: "B" + "6" = "B6")\n- `"+".join([...])` : coller tous les elements avec "+" entre eux (ex: "B6+B7+B8")\n\nResultat : si lignes_revenus = [6, 7, 8] et lettre_col = "B", on obtient "B6+B7+B8" qu\'on prefixe avec "=" pour la formule Excel.\n\nSi c\'est trop complexe pour l\'instant, ne vous inquietez pas ! Antigravity ecrit ca pour vous automatiquement.'
    })

    const l3_c5 = JSON.stringify({
        type: 'success',
        title: 'Lecon 3 terminee !',
        body: 'Vous avez appris :\n\n- Les conditions if/elif/else (prendre des decisions)\n- Comment Python ecrit des formules Excel automatiquement\n- Creer un Compte de Resultat professionnel\n- Utiliser des variables pour les couleurs et les formats\n\n**Prochaine lecon :** La gestion de l\'inventaire avec les alertes de rupture de stock automatiques !'
    })

    await prisma.courseContent.createMany({
        data: [
            { lessonId: lesson3.id, title: 'intro', contentType: 'CALLOUT', order: 1, content: l3_intro },
            { lessonId: lesson3.id, title: 'conditions', contentType: 'TEXT', order: 2, content: l3_c1 },
            { lessonId: lesson3.id, title: 'formules-tip', contentType: 'CALLOUT', order: 3, content: l3_c2 },
            { lessonId: lesson3.id, title: 'compte-resultat', contentType: 'TEXT', order: 4, content: l3_c3 },
            { lessonId: lesson3.id, title: 'avance-tip', contentType: 'CALLOUT', order: 5, content: l3_c4 },
            { lessonId: lesson3.id, title: 'fin-l3', contentType: 'CALLOUT', order: 6, content: l3_c5 },
        ]
    })
    console.log("  Lecon 3 creee (6 blocs)")

    // ================================================================
    // LECON 4 : Dictionnaires et Gestion d'Inventaire
    // ================================================================
    const lesson4 = await prisma.lesson.create({
        data: {
            title: "Lecon 4 - Dictionnaires Python & Gestion de Stock avec Alertes",
            order: 4,
            courseId: course.id,
            isFree: false,
            duration: 55,
        }
    })

    const l4_intro = JSON.stringify({
        type: 'info',
        title: 'Dans cette lecon, vous allez apprendre...',
        body: '**Objectifs de la Lecon 4 :**\n\n1. Comprendre les DICTIONNAIRES Python (donnees organisees par cles)\n2. Creer un catalogue de 20 produits informatiques fictifs\n3. Detecter automatiquement les produits en rupture de stock\n4. Colorier les lignes selon le statut (rouge = rupture, orange = bas, vert = OK)\n5. Calculer automatiquement la valeur totale du stock\n6. Activer les filtres Excel automatiquement\n\n**Duree estimee :** 55 minutes'
    })

    const l4_c1 = `## Les Dictionnaires : Donnees Organisees par Cles

En Python, un **dictionnaire** (dict) permet de stocker des donnees avec des etiquettes. C'est comme un vrai dictionnaire : vous cherchez un mot (la cle) et vous trouvez sa definition (la valeur).

### Exemple sans dictionnaire (complique)

\`\`\`python
# Mauvaise facon - difficile a lire et utiliser
produit_nom = "PC Dell OptiPlex"
produit_ref = "PC-001"
produit_stock = 12
produit_prix = 85000
\`\`\`

### Exemple avec dictionnaire (mieux organise)

\`\`\`python
# Bonne facon - tout est regroupe dans un seul dictionnaire
produit = {
    "ref":        "PC-001",
    "nom":        "PC Dell OptiPlex 3090",
    "categorie":  "Ordinateurs",
    "stock":      12,
    "seuil_min":  5,
    "prix_achat": 85000,
    "prix_vente": 120000,
    "fournisseur":"Dell DZ"
}

# Acceder a une valeur par sa cle
print(produit["nom"])        # Affiche : PC Dell OptiPlex 3090
print(produit["stock"])      # Affiche : 12
print(produit["prix_achat"]) # Affiche : 85000
\`\`\`

Les accolades { } delimitent le dictionnaire. Chaque paire cle:valeur est separee par une virgule.

### Une liste de dictionnaires (le catalogue produits)

\`\`\`python
# Un seul catalogue = une liste de dictionnaires
catalogue = [
    {
        "ref": "PC-001",
        "nom": "PC Dell OptiPlex",
        "stock": 12,
        "seuil_min": 5,
        "prix_achat": 85000
    },
    {
        "ref": "PC-002",
        "nom": "Laptop HP ProBook",
        "stock": 3,     # Stock bas ! (inferieur au seuil_min de 5)
        "seuil_min": 5,
        "prix_achat": 95000
    },
]

# Parcourir le catalogue avec une boucle
for produit in catalogue:
    print(produit["ref"] + " - " + produit["nom"])
    # Affiche :
    # PC-001 - PC Dell OptiPlex
    # PC-002 - Laptop HP ProBook
\`\`\`

### Comprendre la logique d'alerte de stock

\`\`\`python
stock = 3
seuil_min = 5

# Condition 1 : stock strictement inferieur au seuil -> RUPTURE
if stock < seuil_min:
    statut = "RUPTURE"
    couleur = "FFCDD2"   # Rouge pale

# Condition 2 : stock inferieur a 2 fois le seuil (mais ok) -> BAS
elif stock < seuil_min * 2:
    statut = "BAS"
    couleur = "FFE0B2"   # Orange pale

# Condition 3 : stock suffisant -> OK
else:
    statut = "OK"
    couleur = "C8E6C9"   # Vert pale

print("Statut : " + statut)
\`\`\`

---

## Le script complet de gestion d'inventaire

\`\`\`python
# ====================================================
# inventaire.py - Gestion de stock TechAlgerie SARL
# ====================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import datetime   # Pour afficher la date de mise a jour

wb = openpyxl.load_workbook("TechAlgerie_Business.xlsx")
ws = wb["Inventaire"]

# --- Le catalogue produits de TechAlgerie (fictif) ---
# C'est une liste de dictionnaires - chaque dictionnaire = un produit
catalogue = [
    {"ref":"PC-001",  "nom":"PC Bureau Dell OptiPlex 3090",    "cat":"Ordinateurs",  "stock":12, "seuil":5,  "achat":85000,  "vente":120000, "fourni":"Dell DZ"},
    {"ref":"PC-002",  "nom":"Laptop HP ProBook 450 G8",         "cat":"Ordinateurs",  "stock":3,  "seuil":5,  "achat":95000,  "vente":135000, "fourni":"HP Algerie"},
    {"ref":"PC-003",  "nom":"MacBook Air M2 256GB",             "cat":"Ordinateurs",  "stock":7,  "seuil":3,  "achat":195000, "vente":280000, "fourni":"iStore DZ"},
    {"ref":"PC-004",  "nom":"Lenovo ThinkPad E15",              "cat":"Ordinateurs",  "stock":9,  "seuil":4,  "achat":88000,  "vente":125000, "fourni":"Lenovo DZ"},
    {"ref":"PC-005",  "nom":"All-in-One Dell Inspiron 24",      "cat":"Ordinateurs",  "stock":14, "seuil":5,  "achat":75000,  "vente":108000, "fourni":"Dell DZ"},
    {"ref":"NET-001", "nom":"Switch Cisco SG350 24 ports",      "cat":"Reseau",       "stock":8,  "seuil":3,  "achat":45000,  "vente":68000,  "fourni":"Cisco DZ"},
    {"ref":"NET-002", "nom":"Routeur MikroTik hEX",             "cat":"Reseau",       "stock":15, "seuil":5,  "achat":18000,  "vente":28000,  "fourni":"MikroTik"},
    {"ref":"NET-003", "nom":"Point d acces Ubiquiti UniFi",     "cat":"Reseau",       "stock":2,  "seuil":3,  "achat":22000,  "vente":35000,  "fourni":"Ubiquiti"},
    {"ref":"NET-004", "nom":"Cable reseau Cat6 (100m)",         "cat":"Reseau",       "stock":50, "seuil":20, "achat":4500,   "vente":7500,   "fourni":"Nexans DZ"},
    {"ref":"ACC-001", "nom":"Souris Logitech MX Master",        "cat":"Accessoires",  "stock":45, "seuil":10, "achat":3500,   "vente":5500,   "fourni":"Logitech DZ"},
    {"ref":"ACC-002", "nom":"Clavier Corsair K95",              "cat":"Accessoires",  "stock":18, "seuil":5,  "achat":8500,   "vente":13000,  "fourni":"Corsair"},
    {"ref":"ACC-003", "nom":"Webcam Logitech C920 HD",          "cat":"Accessoires",  "stock":22, "seuil":8,  "achat":7500,   "vente":11500,  "fourni":"Logitech DZ"},
    {"ref":"IMP-001", "nom":"Imprimante HP LaserJet Pro",       "cat":"Imprimantes",  "stock":6,  "seuil":2,  "achat":55000,  "vente":78000,  "fourni":"HP Algerie"},
    {"ref":"IMP-002", "nom":"Imprimante Canon PIXMA G3470",     "cat":"Imprimantes",  "stock":9,  "seuil":3,  "achat":32000,  "vente":48000,  "fourni":"Canon DZ"},
    {"ref":"SRV-001", "nom":"Serveur Dell PowerEdge T350",      "cat":"Serveurs",     "stock":2,  "seuil":1,  "achat":350000, "vente":480000, "fourni":"Dell DZ"},
    {"ref":"SRV-002", "nom":"NAS Synology DS923+",              "cat":"Serveurs",     "stock":5,  "seuil":2,  "achat":95000,  "vente":138000, "fourni":"Synology"},
    {"ref":"LOG-001", "nom":"Windows 11 Pro (licence)",         "cat":"Logiciels",    "stock":30, "seuil":10, "achat":8500,   "vente":13500,  "fourni":"Microsoft DZ"},
    {"ref":"LOG-002", "nom":"Microsoft Office 365 (1 an)",      "cat":"Logiciels",    "stock":25, "seuil":8,  "achat":4500,   "vente":7500,   "fourni":"Microsoft DZ"},
    {"ref":"LOG-003", "nom":"Antivirus ESET Business",          "cat":"Logiciels",    "stock":40, "seuil":15, "achat":3200,   "vente":5500,   "fourni":"ESET DZ"},
    {"ref":"LOG-004", "nom":"Autocad 2024 (licence annuelle)",  "cat":"Logiciels",    "stock":4,  "seuil":2,  "achat":85000,  "vente":120000, "fourni":"Autodesk DZ"},
]

# --- Titre de la feuille ---
ws["A1"] = "GESTION DES STOCKS - TechAlgerie SARL"
ws["A1"].font = Font(bold=True, size=14, color="FFFFFF")
ws["A1"].fill = PatternFill(start_color="E65100", end_color="E65100", fill_type="solid")
ws.merge_cells("A1:J1")
ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 30

# Date de mise a jour
date_maj = datetime.now().strftime("%d/%m/%Y a %H:%M")
ws["A2"] = "Mise a jour : " + date_maj
ws["A2"].font = Font(italic=True, size=9, color="666666")
ws.merge_cells("A2:J2")

# --- En-tetes des colonnes ---
entetes = ["Ref.", "Designation du Produit", "Categorie", "Fournisseur",
           "Stock Actuel", "Seuil Min.", "Statut",
           "Prix Achat", "Prix Vente", "Valeur du Stock"]
GRIS_ENTETE = "37474F"

for num_col, texte in enumerate(entetes, start=1):
    c = ws.cell(row=3, column=num_col)
    c.value = texte
    c.font = Font(bold=True, color="FFFFFF", size=9)
    c.fill = PatternFill(start_color=GRIS_ENTETE, end_color=GRIS_ENTETE, fill_type="solid")
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[3].height = 40

# Largeurs optimisees pour chaque colonne
largeurs = [10, 32, 14, 16, 13, 12, 14, 17, 17, 20]
for i, larg in enumerate(largeurs, start=1):
    ws.column_dimensions[get_column_letter(i)].width = larg

# --- Fonction bordure ---
def bord():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)

# --- Ecrire chaque produit ---
valeur_stock_totale = 0   # Pour calculer le total
premiere_ligne_donnees = 4

for index, produit in enumerate(catalogue):
    # index = 0, 1, 2, 3... (numero du produit dans la liste)
    # produit = le dictionnaire du produit actuel
    
    ligne = premiere_ligne_donnees + index
    
    # Calculer la valeur du stock de ce produit
    valeur_stock_produit = produit["stock"] * produit["achat"]
    valeur_stock_totale += valeur_stock_produit  # Ajouter au total
    
    # Determiner le statut et la couleur
    if produit["stock"] < produit["seuil"]:
        statut = "RUPTURE"
        couleur_fond = "FFCDD2"    # Rouge pale
    elif produit["stock"] < produit["seuil"] * 2:
        statut = "BAS"
        couleur_fond = "FFE0B2"    # Orange pale
    else:
        statut = "OK"
        couleur_fond = "C8E6C9"    # Vert pale
    
    # Creer le fond colore
    fond = PatternFill(start_color=couleur_fond, end_color=couleur_fond, fill_type="solid")
    
    # Ecrire les 10 valeurs dans les 10 colonnes
    valeurs = [
        produit["ref"],             # Colonne A : Reference
        produit["nom"],             # Colonne B : Nom
        produit["cat"],             # Colonne C : Categorie
        produit["fourni"],          # Colonne D : Fournisseur
        produit["stock"],           # Colonne E : Stock actuel
        produit["seuil"],           # Colonne F : Seuil minimum
        statut,                     # Colonne G : Statut (OK/BAS/RUPTURE)
        produit["achat"],           # Colonne H : Prix d'achat
        produit["vente"],           # Colonne I : Prix de vente
        valeur_stock_produit,       # Colonne J : Valeur du stock
    ]
    
    for num_col, valeur in enumerate(valeurs, start=1):
        cellule = ws.cell(row=ligne, column=num_col)
        cellule.value = valeur
        cellule.fill = fond
        cellule.border = bord()
        cellule.font = Font(size=9, bold=(num_col == 7))  # Statut en gras
        
        # Alignement selon le type de colonne
        if num_col in [5, 6, 8, 9, 10]:
            cellule.alignment = Alignment(horizontal="right", vertical="center")
        else:
            cellule.alignment = Alignment(horizontal="left", vertical="center")
        
        # Format monetaire pour les colonnes de prix
        if num_col in [8, 9, 10]:
            cellule.number_format = '#,##0 "DZD"'
    
    ws.row_dimensions[ligne].height = 18

# --- Ligne de total ---
ligne_total = premiere_ligne_donnees + len(catalogue)
ws.cell(row=ligne_total, column=1).value = "VALEUR TOTALE DU STOCK"
ws.cell(row=ligne_total, column=1).font = Font(bold=True, size=10, color="FFFFFF")
ws.cell(row=ligne_total, column=10).value = valeur_stock_totale
ws.cell(row=ligne_total, column=10).number_format = '#,##0 "DZD"'
ws.cell(row=ligne_total, column=10).font = Font(bold=True, color="FFFFFF")

fond_total = PatternFill(start_color="E65100", end_color="E65100", fill_type="solid")
for col in range(1, 11):
    ws.cell(row=ligne_total, column=col).fill = fond_total

ws.row_dimensions[ligne_total].height = 25

# --- Figer les en-tetes et activer les filtres ---
ws.freeze_panes = "A4"   # Les lignes 1-3 restent visibles au scroll
ws.auto_filter.ref = "A3:J" + str(ligne_total - 1)   # Filtres sur toutes les colonnes

wb.save("TechAlgerie_Business.xlsx")

# Afficher un resume
nb_ruptures = sum(1 for p in catalogue if p["stock"] < p["seuil"])
nb_bas = sum(1 for p in catalogue if p["seuil"] <= p["stock"] < p["seuil"] * 2)
print("Inventaire cree : " + str(len(catalogue)) + " produits")
print("RUPTURES : " + str(nb_ruptures) + " produits")
print("STOCK BAS : " + str(nb_bas) + " produits")
print("Valeur totale du stock : " + str(valeur_stock_totale) + " DZD")
\`\`\``

    const l4_c3 = JSON.stringify({
        type: 'warning',
        title: 'Les 2 produits en rupture dans notre catalogue',
        body: 'Dans le catalogue fictif de TechAlgerie, 2 produits sont en **RUPTURE** :\n\n- **PC-002** Laptop HP ProBook : Stock = 3 unites, Seuil minimum = 5\n- **NET-003** Point d\'acces Ubiquiti : Stock = 2 unites, Seuil minimum = 3\n\nEt 1 produit est en stock **BAS** :\n- **SRV-001** Serveur Dell PowerEdge : Stock = 2, Seuil = 1, mais < 2x le seuil\n\nLe script va colorier ces lignes automatiquement en rouge et orange pour les rendre visibles d\'un coup d\'oeil !'
    })

    const l4_c4 = JSON.stringify({
        type: 'success',
        title: 'Lecon 4 terminee !',
        body: 'Vous avez appris :\n\n- Les dictionnaires Python (organiser les donnees avec des cles)\n- Les listes de dictionnaires (un catalogue de produits)\n- Combiner conditions et boucles pour colorier automatiquement\n- Calculer des totaux avec +=\n- Activer les filtres Excel automatiquement\n\n**Prochaine lecon :** Le fichier RH avec les 47 employes de TechAlgerie, calcul de salaires et suivi des conges !'
    })

    await prisma.courseContent.createMany({
        data: [
            { lessonId: lesson4.id, title: 'intro', contentType: 'CALLOUT', order: 1, content: l4_intro },
            { lessonId: lesson4.id, title: 'dictionnaires', contentType: 'TEXT', order: 2, content: l4_c1 },
            { lessonId: lesson4.id, title: 'inventaire-script', contentType: 'TEXT', order: 3, content: l4_c1 },
            { lessonId: lesson4.id, title: 'alertes-warning', contentType: 'CALLOUT', order: 4, content: l4_c3 },
            { lessonId: lesson4.id, title: 'fin-l4', contentType: 'CALLOUT', order: 5, content: l4_c4 },
        ]
    })
    console.log("  Lecon 4 creee (5 blocs)")

    // ================================================================
    // LECON 5 : RH - Fonctions avancees et calcul de paie
    // ================================================================
    const lesson5 = await prisma.lesson.create({
        data: {
            title: "Lecon 5 - Ressources Humaines : 47 Employes, Salaires & Conges",
            order: 5,
            courseId: course.id,
            isFree: false,
            duration: 60,
        }
    })

    const l5_intro = JSON.stringify({
        type: 'info',
        title: 'Dans cette lecon, vous allez apprendre...',
        body: '**Objectifs de la Lecon 5 :**\n\n1. Creer une liste complete de 41 employes fictifs\n2. Calculer automatiquement l\'anciennete de chaque employe\n3. Calculer le salaire net avec CNAS (9%) et IRG (barème simplifie)\n4. Colorier chaque ligne selon le departement\n5. Creer un tableau recapitulatif par departement\n6. Utiliser le format de date Excel\n\n**Duree estimee :** 60 minutes'
    })

    const l5_c1 = `## Travailler avec les dates en Python

En Python, on peut calculer des dates et des durees. C'est tres utile pour calculer l'anciennete des employes.

\`\`\`python
from datetime import date   # Importer l'outil "date"

# La date d'aujourd'hui
aujourd_hui = date.today()  # Ex: 2024-06-01

# Creer une date precise
date_embauche = date(2018, 3, 15)  # 15 mars 2018

# Calculer la difference
difference = aujourd_hui - date_embauche
# difference.days = nombre de jours depuis l'embauche

# Convertir en annees
anciennete_annees = difference.days // 365
# // = division entiere (pas de decimales)
# Ex: 2190 jours // 365 = 6 ans

print("Anciennete : " + str(anciennete_annees) + " ans")
\`\`\`

## Le calcul de la paie algerienne (simplifie)

En Algerie, le salaire passe par plusieurs etapes :

**Etape 1 : Salaire Brut**
C'est le salaire avant toutes les deductions. C'est ce qui est inscrit dans le contrat.

**Etape 2 : Deduire la CNAS salariale (9%)**
La CNAS (Caisse Nationale des Assurances Sociales) prend 9% du brut.

\`\`\`python
brut = 75000
cnas = brut * 0.09    # 0.09 = 9% en decimal (9/100 = 0.09)
# cnas = 6750 DZD
\`\`\`

**Etape 3 : Calculer l'IRG (Impot sur le Revenu Global)**
L'IRG est calcule sur le salaire apres deduction de la CNAS.

\`\`\`python
salaire_apres_cnas = brut - cnas   # 75000 - 6750 = 68250

# Barème IRG simplifié (taux algérien approximatif 2024)
if salaire_apres_cnas <= 30000:
    irg = 0              # Exonere (pas d'impot)
elif salaire_apres_cnas <= 60000:
    irg = (salaire_apres_cnas - 30000) * 0.20   # 20% sur la partie > 30000
else:
    irg = 6000 + (salaire_apres_cnas - 60000) * 0.30  # 6000 + 30% sur le surplus

# irg = 6000 + (68250 - 60000) * 0.30 = 6000 + 2475 = 8475 DZD
\`\`\`

**Etape 4 : Calculer le Salaire Net**
\`\`\`python
salaire_net = round(brut - cnas - irg)
# round() arrondit au nombre entier le plus proche
# salaire_net = 75000 - 6750 - 8475 = 59775 DZD
\`\`\`

---

## Le script RH complet

\`\`\`python
# ====================================================
# rh_employes.py - Gestion RH TechAlgerie SARL
# ====================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import date, datetime

wb = openpyxl.load_workbook("TechAlgerie_Business.xlsx")
ws = wb["RH"]

# --- Liste des employes (fictifs) ---
# Chaque employe est un dictionnaire avec ses informations
# Format: matricule, prenom, nom, poste, departement, date_embauche, salaire_brut, conges_pris
employes = [
    {"mat":"DG-001",  "prenom":"Karim",   "nom":"BENSALAH", "poste":"PDG",                    "dept":"Direction",  "embauche":"2015-03-01", "brut":180000, "conges_pris":5},
    {"mat":"DG-002",  "prenom":"Nadia",   "nom":"BENSALAH", "poste":"Assistante Direction",   "dept":"Direction",  "embauche":"2018-06-15", "brut":85000,  "conges_pris":8},
    {"mat":"COM-001", "prenom":"Amina",   "nom":"HADJ",     "poste":"Directrice Commerciale", "dept":"Commercial", "embauche":"2016-01-10", "brut":120000, "conges_pris":10},
    {"mat":"COM-002", "prenom":"Redouane","nom":"BOUDIAF",  "poste":"Ingenieur Commercial",   "dept":"Commercial", "embauche":"2019-04-22", "brut":75000,  "conges_pris":12},
    {"mat":"COM-003", "prenom":"Leila",   "nom":"SAADI",    "poste":"Technico-Commerciale",   "dept":"Commercial", "embauche":"2020-09-01", "brut":72000,  "conges_pris":7},
    {"mat":"COM-004", "prenom":"Mourad",  "nom":"AISSAOUI", "poste":"Commercial Terrain",     "dept":"Commercial", "embauche":"2021-02-15", "brut":65000,  "conges_pris":6},
    {"mat":"COM-005", "prenom":"Yasmine", "nom":"BENALI",   "poste":"Commerciale Terrain",    "dept":"Commercial", "embauche":"2021-07-01", "brut":63000,  "conges_pris":9},
    {"mat":"COM-006", "prenom":"Farid",   "nom":"CHERIF",   "poste":"Commercial B2B",         "dept":"Commercial", "embauche":"2022-03-14", "brut":60000,  "conges_pris":5},
    {"mat":"COM-007", "prenom":"Rima",    "nom":"KACI",     "poste":"Chargee Marketing",      "dept":"Commercial", "embauche":"2023-01-15", "brut":55000,  "conges_pris":3},
    {"mat":"COM-008", "prenom":"Amine",   "nom":"LARBI",    "poste":"Stagiaire Commercial",   "dept":"Commercial", "embauche":"2024-01-02", "brut":32000,  "conges_pris":0},
    {"mat":"TEC-001", "prenom":"Yacine",  "nom":"MEZIANE",  "poste":"Directeur Technique",    "dept":"Technique",  "embauche":"2015-09-01", "brut":130000, "conges_pris":10},
    {"mat":"TEC-002", "prenom":"Nassim",  "nom":"AMAR",     "poste":"Ingenieur Reseau Sr",    "dept":"Technique",  "embauche":"2017-03-20", "brut":95000,  "conges_pris":8},
    {"mat":"TEC-003", "prenom":"Dalila",  "nom":"HAMMAMI",  "poste":"Ingenieure Systemes",    "dept":"Technique",  "embauche":"2018-11-05", "brut":90000,  "conges_pris":12},
    {"mat":"TEC-004", "prenom":"Sofiane", "nom":"BRAHIMI",  "poste":"Technicien Reseaux",     "dept":"Technique",  "embauche":"2019-07-01", "brut":72000,  "conges_pris":6},
    {"mat":"TEC-005", "prenom":"Meriem",  "nom":"TOUIL",    "poste":"Technicienne Support",   "dept":"Technique",  "embauche":"2020-01-13", "brut":65000,  "conges_pris":9},
    {"mat":"TEC-006", "prenom":"Walid",   "nom":"GUESMI",   "poste":"Technicien Info",        "dept":"Technique",  "embauche":"2020-06-22", "brut":62000,  "conges_pris":7},
    {"mat":"TEC-007", "prenom":"Chaima",  "nom":"BENDJEMA", "poste":"Developpeuse Web",       "dept":"Technique",  "embauche":"2021-04-01", "brut":78000,  "conges_pris":5},
    {"mat":"TEC-008", "prenom":"Ryad",    "nom":"BELKACEM", "poste":"Admin. Systemes",        "dept":"Technique",  "embauche":"2021-08-16", "brut":80000,  "conges_pris":10},
    {"mat":"TEC-009", "prenom":"Siham",   "nom":"OUKID",    "poste":"Technicienne SAV",       "dept":"Technique",  "embauche":"2022-01-10", "brut":58000,  "conges_pris":4},
    {"mat":"TEC-010", "prenom":"Nawal",   "nom":"CHIKHI",   "poste":"Ingenieure Cloud",       "dept":"Technique",  "embauche":"2022-10-01", "brut":88000,  "conges_pris":6},
    {"mat":"FIN-001", "prenom":"Soraya",  "nom":"ACHOUR",   "poste":"Directrice Financiere",  "dept":"Finance",    "embauche":"2016-04-01", "brut":115000, "conges_pris":10},
    {"mat":"FIN-002", "prenom":"Mohamed", "nom":"BADI",     "poste":"Comptable Senior",       "dept":"Finance",    "embauche":"2018-09-12", "brut":82000,  "conges_pris":8},
    {"mat":"FIN-003", "prenom":"Hafida",  "nom":"SLIMANE",  "poste":"Comptable",              "dept":"Finance",    "embauche":"2020-02-01", "brut":65000,  "conges_pris":7},
    {"mat":"FIN-004", "prenom":"Billel",  "nom":"ZERROUKI", "poste":"Controleur de Gestion",  "dept":"Finance",    "embauche":"2021-01-11", "brut":75000,  "conges_pris":5},
    {"mat":"FIN-005", "prenom":"Houda",   "nom":"TABET",    "poste":"Assistante Comptable",   "dept":"Finance",    "embauche":"2022-08-01", "brut":52000,  "conges_pris":4},
    {"mat":"FIN-006", "prenom":"Samir",   "nom":"HAMICI",   "poste":"Tresorier",              "dept":"Finance",    "embauche":"2023-04-17", "brut":68000,  "conges_pris":2},
    {"mat":"LOG-001", "prenom":"Mehdi",   "nom":"OUALI",    "poste":"Directeur Logistique",   "dept":"Logistique", "embauche":"2016-07-01", "brut":108000, "conges_pris":10},
    {"mat":"LOG-002", "prenom":"Farida",  "nom":"AMIRI",    "poste":"Responsable Stocks",     "dept":"Logistique", "embauche":"2018-02-19", "brut":72000,  "conges_pris":9},
    {"mat":"LOG-003", "prenom":"Tarek",   "nom":"BENGUERNA","poste":"Magasinier Senior",      "dept":"Logistique", "embauche":"2019-10-07", "brut":55000,  "conges_pris":8},
    {"mat":"LOG-004", "prenom":"Souad",   "nom":"LAIB",     "poste":"Magasiniere",            "dept":"Logistique", "embauche":"2020-05-25", "brut":48000,  "conges_pris":6},
    {"mat":"LOG-005", "prenom":"Adel",    "nom":"GUERFI",   "poste":"Livreur Senior",         "dept":"Logistique", "embauche":"2019-08-01", "brut":45000,  "conges_pris":5},
    {"mat":"LOG-006", "prenom":"Hamza",   "nom":"SELLALI",  "poste":"Chauffeur-Livreur",      "dept":"Logistique", "embauche":"2022-06-13", "brut":42000,  "conges_pris":4},
    {"mat":"LOG-007", "prenom":"Zineb",   "nom":"BENHOURA", "poste":"Manutentionnaire",       "dept":"Logistique", "embauche":"2023-01-02", "brut":38000,  "conges_pris":1},
    {"mat":"RH-001",  "prenom":"Fatima",  "nom":"KHELIF",   "poste":"Directrice RH",          "dept":"RH & Admin", "embauche":"2017-05-08", "brut":100000, "conges_pris":10},
    {"mat":"RH-002",  "prenom":"Kamelia", "nom":"SAHRAOUI", "poste":"Chargee RH",             "dept":"RH & Admin", "embauche":"2019-11-18", "brut":68000,  "conges_pris":8},
    {"mat":"RH-003",  "prenom":"Rachid",  "nom":"BOUKHELIF","poste":"Responsable Admin.",     "dept":"RH & Admin", "embauche":"2020-07-06", "brut":62000,  "conges_pris":7},
    {"mat":"RH-004",  "prenom":"Lyna",    "nom":"BENAZZOUZ","poste":"Assistante RH",          "dept":"RH & Admin", "embauche":"2023-03-20", "brut":48000,  "conges_pris":2},
]

# --- Couleurs par departement ---
# Un dictionnaire ou la cle = nom du departement et la valeur = couleur
couleurs_dept = {
    "Direction":  "CE93D8",   # Violet
    "Commercial": "90CAF9",   # Bleu clair
    "Technique":  "80DEEA",   # Cyan
    "Finance":    "A5D6A7",   # Vert
    "Logistique": "FFCC80",   # Orange
    "RH & Admin": "EF9A9A",   # Rose
}

# --- Titre ---
ws["A1"] = "GESTION DES RESSOURCES HUMAINES - TechAlgerie SARL"
ws["A1"].font = Font(bold=True, size=13, color="FFFFFF")
ws["A1"].fill = PatternFill(start_color="4A148C", end_color="4A148C", fill_type="solid")
ws.merge_cells("A1:N1")
ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 30

# --- En-tetes colonnes ---
entetes_rh = [
    "Matricule", "Prenom", "Nom", "Poste", "Departement",
    "Date Embauche", "Anciennete",
    "Salaire Brut", "CNAS (9%)", "IRG Estime", "Salaire Net",
    "Conges/An", "Conges Pris", "Conges Restants"
]

for num_col, entete in enumerate(entetes_rh, start=1):
    c = ws.cell(row=2, column=num_col)
    c.value = entete
    c.font = Font(bold=True, color="FFFFFF", size=8)
    c.fill = PatternFill(start_color="4A148C", end_color="4A148C", fill_type="solid")
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[2].height = 50

# Largeurs colonnes
largeurs_rh = [10, 11, 13, 26, 13, 13, 11, 17, 13, 13, 15, 11, 12, 14]
for i, larg in enumerate(largeurs_rh, start=1):
    ws.column_dimensions[get_column_letter(i)].width = larg

# --- Constante : jours de conge annuels en Algerie ---
CONGES_ANNUELS = 30    # 30 jours par an selon le droit algerien

# --- Fonction de calcul du salaire ---
def calculer_salaire(brut):
    """Calcule CNAS, IRG et net a partir du salaire brut."""
    cnas = brut * 0.09
    salaire_apres_cnas = brut - cnas
    
    if salaire_apres_cnas <= 30000:
        irg = 0
    elif salaire_apres_cnas <= 60000:
        irg = (salaire_apres_cnas - 30000) * 0.20
    else:
        irg = 6000 + (salaire_apres_cnas - 60000) * 0.30
    
    net = round(brut - cnas - irg)
    return round(cnas), round(irg), net

# --- Date d'aujourd'hui pour calcul d'anciennete ---
aujourd_hui = date.today()

# --- Ecrire chaque employe ---
premiere_ligne = 3
FORMAT_DZD = '#,##0 "DZD"'

def bord_rh():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)

for index, emp in enumerate(employes):
    ligne = premiere_ligne + index
    
    # Calculer l'anciennete
    date_emb = datetime.strptime(emp["embauche"], "%Y-%m-%d").date()
    jours_anciennete = (aujourd_hui - date_emb).days
    annees_anciennete = jours_anciennete // 365
    
    # Calculer le salaire
    cnas, irg, net = calculer_salaire(emp["brut"])
    
    # Conges
    conges_restants = CONGES_ANNUELS - emp["conges_pris"]
    
    # Couleur selon departement
    couleur = couleurs_dept.get(emp["dept"], "F5F5F5")
    fond = PatternFill(start_color=couleur, end_color=couleur, fill_type="solid")
    
    # Valeurs a ecrire
    valeurs_emp = [
        emp["mat"],
        emp["prenom"],
        emp["nom"],
        emp["poste"],
        emp["dept"],
        date_emb,                         # Date (Python connait ce type)
        str(annees_anciennete) + " ans",
        emp["brut"],
        cnas,
        irg,
        net,
        CONGES_ANNUELS,
        emp["conges_pris"],
        conges_restants,
    ]
    
    for num_col, valeur in enumerate(valeurs_emp, start=1):
        cellule = ws.cell(row=ligne, column=num_col)
        cellule.value = valeur
        cellule.fill = fond
        cellule.border = bord_rh()
        cellule.font = Font(size=8)
        
        # Alignement
        if num_col in [6, 7, 8, 9, 10, 11, 12, 13, 14]:
            cellule.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cellule.alignment = Alignment(horizontal="left", vertical="center")
        
        # Format date pour la colonne date d'embauche
        if num_col == 6:
            cellule.number_format = "DD/MM/YYYY"
        
        # Format monetaire pour les salaires
        if num_col in [8, 9, 10, 11]:
            cellule.number_format = FORMAT_DZD
    
    ws.row_dimensions[ligne].height = 17

# --- Figer et filtrer ---
ws.freeze_panes = "A3"
ws.auto_filter.ref = "A2:N" + str(premiere_ligne + len(employes) - 1)

wb.save("TechAlgerie_Business.xlsx")

masse_brute = sum(e["brut"] for e in employes)
print("Fichier RH cree : " + str(len(employes)) + " employes")
print("Masse salariale brute mensuelle : " + str(masse_brute) + " DZD")
\`\`\``

    const l5_c2 = JSON.stringify({
        type: 'tip',
        title: 'Le .get() des dictionnaires : eviter les erreurs',
        body: 'Dans le code, vous avez vu :\n```python\ncouleur = couleurs_dept.get(emp["dept"], "F5F5F5")\n```\n\nPourquoi `.get()` et pas juste `couleurs_dept[emp["dept"]]` ?\n\nParce que si le departement n\'existe pas dans le dictionnaire, la version sans `.get()` provoque une **erreur** et arrete le programme.\n\nAvec `.get(cle, valeur_par_defaut)`, si la cle n\'existe pas, Python retourne la valeur par defaut (ici "F5F5F5" = blanc). Le programme continue sans erreur.\n\nC\'est une bonne habitude de programmation : toujours prevoir les cas ou les donnees peuvent manquer.'
    })

    const l5_c3 = JSON.stringify({
        type: 'success',
        title: 'Lecon 5 terminee !',
        body: 'Vous avez appris :\n\n- Travailler avec les dates en Python\n- Calculer l\'anciennete et la paie\n- Les dictionnaires avec `.get()` pour les valeurs par defaut\n- Creer des fonctions pour le calcul de salaire\n- Formater des colonnes avec des types differents (dates, monnaie, texte)\n\n**Lecon finale :** Le Rapport de Direction qui consolide tout en un document professionnel !'
    })

    await prisma.courseContent.createMany({
        data: [
            { lessonId: lesson5.id, title: 'intro', contentType: 'CALLOUT', order: 1, content: l5_intro },
            { lessonId: lesson5.id, title: 'dates-salaires', contentType: 'TEXT', order: 2, content: l5_c1 },
            { lessonId: lesson5.id, title: 'get-tip', contentType: 'CALLOUT', order: 3, content: l5_c2 },
            { lessonId: lesson5.id, title: 'fin-l5', contentType: 'CALLOUT', order: 4, content: l5_c3 },
        ]
    })
    console.log("  Lecon 5 creee (4 blocs)")

    // ================================================================
    // LECON 6 : Rapport de Direction Final
    // ================================================================
    const lesson6 = await prisma.lesson.create({
        data: {
            title: "Lecon 6 - Rapport de Direction Final : Tout Consolider en 1 Document",
            order: 6,
            courseId: course.id,
            isFree: false,
            duration: 65,
        }
    })

    const l6_intro = JSON.stringify({
        type: 'info',
        title: 'Dans cette lecon, vous allez apprendre...',
        body: '**Objectifs de la Lecon 6 (Finale) :**\n\n1. Consolider toutes les donnees en un Rapport de Direction\n2. Creer un graphique camembert de repartition du CA\n3. Masquer le quadrillage pour un look professionnel\n4. Comprendre comment combiner tous vos scripts\n5. Apprendre a automatiser l\'execution de plusieurs scripts en chaine\n\n**Duree estimee :** 65 minutes\n\n**Felicitations d\'avance !** Vous arrivez a la lecon finale.'
    })

    const l6_c1 = `## Le Rapport de Direction : L'objectif final

Un Rapport de Direction (ou "Executive Report") est le document que vous presentez au Conseil d'Administration ou aux dirigeants. Il resumes tous les chiffres cles en une seule page professionnelle.

Notre rapport va contenir :
1. Un en-tete professionnel bleu marine avec le nom et la date
2. Les 6 KPIs cles en une vue rapide
3. Un resume financier (CA, Benefice, Marge)
4. Un resume RH (effectif, masse salariale)
5. Un resume stock (nb produits, alertes)
6. Un graphique camembert de la repartition du CA
7. Un pied de page avec la mention "Confidentiel"

---

## Comprendre les graphiques avec openpyxl

openpyxl peut creer des graphiques directement dans Excel !

\`\`\`python
from openpyxl.chart import PieChart, Reference, BarChart

# 1. Preparer les donnees dans des cellules "cachees"
ws["Z1"] = "Ventes Materiel"
ws["Z2"] = "Prestations"
ws["Z3"] = "Maintenance"
ws["AA1"] = 1960000
ws["AA2"] = 430000
ws["AA3"] = 97000

# 2. Creer le graphique
pie = PieChart()            # Type : camembert
pie.title = "Repartition du CA"
pie.style = 10              # Style graphique pre-defini (1-48)

# 3. Definir les donnees du graphique
# Reference() dit a openpyxl ou trouver les donnees
data = Reference(ws, min_col=27, min_row=1, max_row=3)  # Colonne AA (27)
labels = Reference(ws, min_col=26, min_row=1, max_row=3) # Colonne Z (26)

pie.add_data(data)           # Ajouter les donnees
pie.set_categories(labels)   # Ajouter les etiquettes

# 4. Taille du graphique
pie.width = 14    # Largeur en cm
pie.height = 10   # Hauteur en cm

# 5. Inserer le graphique dans la feuille
ws.add_chart(pie, "E20")    # Inserer a partir de la cellule E20
\`\`\`

---

## Le script complet du Rapport de Direction

\`\`\`python
# ====================================================
# rapport_direction.py - Rapport Final TechAlgerie
# ====================================================

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import PieChart, Reference
from datetime import datetime

wb = openpyxl.load_workbook("TechAlgerie_Business.xlsx")

# Supprimer la feuille si elle existe deja (pour pouvoir regen plusieurs fois)
if "Rapport" in wb.sheetnames:
    del wb["Rapport"]

# Creer et mettre en PREMIER (index 0)
ws = wb.create_sheet("Rapport", 0)

# --- Couleurs officielles du rapport ---
BLEU_FONCE  = "0D1B4B"   # Bleu tres fonce pour l'en-tete
BLEU_MOYEN  = "1565C0"   # Bleu moyen pour les titres de sections
GRIS_CLAIR  = "F5F5F5"   # Fond gris tres clair pour les lignes paires
OR          = "FFD700"   # Doré pour la ligne de separation

FORMAT_DZD = '#,##0 "DZD"'

# --- Fonction pour creer un titre de section ---
def titre_section(ws, ligne, texte, couleur_fond=None):
    """Cree un titre de section dans la feuille de rapport."""
    if couleur_fond is None:
        couleur_fond = BLEU_MOYEN
    ws.merge_cells("A" + str(ligne) + ":J" + str(ligne))
    c = ws.cell(row=ligne, column=1)
    c.value = "  " + texte   # Deux espaces pour l'indentation
    c.font = Font(bold=True, size=12, color="FFFFFF")
    c.fill = PatternFill(start_color=couleur_fond, end_color=couleur_fond, fill_type="solid")
    c.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[ligne].height = 28

# ===== EN-TETE DU RAPPORT =====

# Fond bleu fonce sur les 5 premieres lignes
for r in range(1, 6):
    for c in range(1, 11):
        ws.cell(row=r, column=c).fill = PatternFill(
            start_color=BLEU_FONCE, end_color=BLEU_FONCE, fill_type="solid"
        )

# Titre principal
ws.merge_cells("A1:J2")
ws["A1"] = "RAPPORT DE DIRECTION TRIMESTRIEL - TechAlgerie SARL - T4 2024"
ws["A1"].font = Font(bold=True, size=18, color="FFFFFF", name="Calibri")
ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 40

# Sous-titre avec date
date_str = datetime.now().strftime("%d/%m/%Y")
ws.merge_cells("A3:J4")
ws["A3"] = "Rapport confidentiel prepare le " + date_str + " avec Python & Google Antigravity"
ws["A3"].font = Font(size=10, color="AAAAAA", italic=True)
ws["A3"].alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[3].height = 25

# Ligne de separation doree (une seule ligne de couleur or)
for c in range(1, 11):
    ws.cell(row=5, column=c).fill = PatternFill(
        start_color=OR, end_color=OR, fill_type="solid"
    )
ws.row_dimensions[5].height = 3

# ===== SECTION 1 : KPIs CLES =====

titre_section(ws, 6, "INDICATEURS CLES DE PERFORMANCE")

# Donnees des KPIs
kpis = [
    ("Chiffre d Affaires Annuel",   2487000, "DZD", "+12% vs 2023", "2E7D32"),
    ("Benefice Net Annuel",          572000, "DZD", "Marge nette : 23%", "1565C0"),
    ("Effectif Total",                    47, "",    "5 recrutements prevus 2025", "4A148C"),
    ("References en Stock",              523, "",    "2 alertes rupture actives", "E65100"),
    ("Satisfaction Clients",             4.2, "/5",  "Objectif 2025 : 4.5/5", "006064"),
    ("Taux de Croissance",             12.0, "%",   "Objectif atteint (>10%)", "2E7D32"),
]

for idx, (libelle, valeur, unite, commentaire, couleur) in enumerate(kpis):
    ligne = 7 + idx
    fond_ligne = GRIS_CLAIR if idx % 2 == 0 else "FFFFFF"
    fond = PatternFill(start_color=fond_ligne, end_color=fond_ligne, fill_type="solid")

    # Colonne A-D : libelle
    ws.merge_cells("A" + str(ligne) + ":D" + str(ligne))
    c_lib = ws.cell(row=ligne, column=1)
    c_lib.value = "   " + libelle
    c_lib.font = Font(bold=True, size=10, color="333333")
    c_lib.fill = fond

    # Colonne E-G : valeur
    ws.merge_cells("E" + str(ligne) + ":G" + str(ligne))
    c_val = ws.cell(row=ligne, column=5)
    if unite == "DZD":
        c_val.value = valeur
        c_val.number_format = FORMAT_DZD
    else:
        c_val.value = str(valeur) + " " + unite
    c_val.font = Font(bold=True, size=13, color=couleur)
    c_val.fill = fond
    c_val.alignment = Alignment(horizontal="center", vertical="center")

    # Colonne H-J : commentaire
    ws.merge_cells("H" + str(ligne) + ":J" + str(ligne))
    c_com = ws.cell(row=ligne, column=8)
    c_com.value = commentaire
    c_com.font = Font(italic=True, size=9, color="666666")
    c_com.fill = fond

    ws.row_dimensions[ligne].height = 25

# ===== SECTION 2 : SYNTHESE FINANCIERE =====

ligne_fin = 7 + len(kpis) + 1
titre_section(ws, ligne_fin, "SYNTHESE FINANCIERE - Exercice 2024")

resultats_fin = [
    ("Total Revenus",    2487000, "Ventes + Prestations + Maintenance"),
    ("Total Charges",    1915000, "Salaires + Loyer + Achats + Frais"),
    ("BENEFICE NET",      572000, "Marge nette : 23% du CA"),
]

for idx, (libelle, montant, note) in enumerate(resultats_fin):
    ligne = ligne_fin + 1 + idx
    est_benefice = libelle == "BENEFICE NET"
    fond_couleur = "1A237E" if est_benefice else ("E8F5E9" if idx == 0 else "FFEBEE")
    txt_couleur = "FFFFFF" if est_benefice else ("2E7D32" if idx == 0 else "C62828")
    fond = PatternFill(start_color=fond_couleur, end_color=fond_couleur, fill_type="solid")

    ws.merge_cells("A" + str(ligne) + ":F" + str(ligne))
    ws.cell(row=ligne, column=1).value = "  " + libelle
    ws.cell(row=ligne, column=1).font = Font(bold=True, size=11, color=txt_couleur)
    ws.cell(row=ligne, column=1).fill = fond

    ws.merge_cells("G" + str(ligne) + ":J" + str(ligne))
    c_mont = ws.cell(row=ligne, column=7)
    c_mont.value = montant
    c_mont.number_format = FORMAT_DZD
    c_mont.font = Font(bold=True, size=12, color=txt_couleur)
    c_mont.fill = fond
    c_mont.alignment = Alignment(horizontal="right")

    ws.row_dimensions[ligne].height = 24

# ===== SECTION 3 : CAPITAL HUMAIN =====

ligne_rh = ligne_fin + len(resultats_fin) + 2
titre_section(ws, ligne_rh, "CAPITAL HUMAIN", "4A148C")

rh_stats = [
    ("Effectif total",            "47 employes",    "5 departements"),
    ("Masse salariale / mois",    "3 247 000 DZD",  "Soit 38.9 M DZD par an"),
    ("Salaire moyen",             "69 085 DZD",     "Mediane : 65 000 DZD"),
    ("Recrutements 2025",         "5 postes",       "Technique (3) + Commercial (2)"),
]

for idx, (lib, val, note) in enumerate(rh_stats):
    ligne = ligne_rh + 1 + idx
    fond_c = "F3E5F5" if idx % 2 == 0 else "FFFFFF"
    fond = PatternFill(start_color=fond_c, end_color=fond_c, fill_type="solid")

    ws.merge_cells("A" + str(ligne) + ":E" + str(ligne))
    ws.cell(row=ligne, column=1).value = "  " + lib
    ws.cell(row=ligne, column=1).font = Font(bold=True, size=10)
    ws.cell(row=ligne, column=1).fill = fond

    ws.merge_cells("F" + str(ligne) + ":G" + str(ligne))
    ws.cell(row=ligne, column=6).value = val
    ws.cell(row=ligne, column=6).font = Font(bold=True, size=11, color="4A148C")
    ws.cell(row=ligne, column=6).fill = fond
    ws.cell(row=ligne, column=6).alignment = Alignment(horizontal="center")

    ws.merge_cells("H" + str(ligne) + ":J" + str(ligne))
    ws.cell(row=ligne, column=8).value = note
    ws.cell(row=ligne, column=8).font = Font(italic=True, size=9, color="888888")
    ws.cell(row=ligne, column=8).fill = fond

    ws.row_dimensions[ligne].height = 22

# ===== GRAPHIQUE CAMEMBERT =====

# Zone de donnees invisible (on les met en colonnes Z et AA)
ligne_graph_data = ligne_rh + len(rh_stats) + 2
cats_ca = [("Ventes Materiel", 1960000), ("Prestations", 430000), ("Maintenance", 97000)]
for i, (cat, val) in enumerate(cats_ca):
    ws.cell(row=ligne_graph_data + i, column=26).value = cat   # Colonne Z
    ws.cell(row=ligne_graph_data + i, column=27).value = val   # Colonne AA
    # Rendre ces cellules presque invisibles (texte blanc)
    ws.cell(row=ligne_graph_data + i, column=26).font = Font(color="FAFAFA", size=1)
    ws.cell(row=ligne_graph_data + i, column=27).font = Font(color="FAFAFA", size=1)

# Creer le camembert
pie = PieChart()
pie.title = "Repartition du Chiffre d Affaires par Activite"
pie.style = 10

data_pie = Reference(ws, min_col=27, min_row=ligne_graph_data,
                     max_row=ligne_graph_data + len(cats_ca) - 1)
labels_pie = Reference(ws, min_col=26, min_row=ligne_graph_data,
                       max_row=ligne_graph_data + len(cats_ca) - 1)
pie.add_data(data_pie)
pie.set_categories(labels_pie)
pie.width = 14
pie.height = 10

# Position du graphique : a cote de la section RH
ws.add_chart(pie, "E" + str(ligne_rh))

# ===== PIED DE PAGE =====

ligne_footer = ligne_graph_data + 8
ws.merge_cells("A" + str(ligne_footer) + ":J" + str(ligne_footer))
ws["A" + str(ligne_footer)] = "Document CONFIDENTIEL - Usage interne uniquement - TechAlgerie SARL 2024 - Genere par Python & Google Antigravity"
ws["A" + str(ligne_footer)].font = Font(italic=True, size=8, color="AAAAAA")
ws["A" + str(ligne_footer)].alignment = Alignment(horizontal="center")

# ===== FINITIONS PROFESSIONNELLES =====

# Ajuster les largeurs de colonnes
for num_col in range(1, 11):
    ws.column_dimensions[get_column_letter(num_col)].width = 13

# Masquer le quadrillage (lignes de la grille Excel)
ws.sheet_view.showGridLines = False
# showGridLines = False rend le rapport beaucoup plus propre visuellement

# Masquer les colonnes Z et AA (donnees du graphique)
ws.column_dimensions["Z"].hidden = True
ws.column_dimensions["AA"].hidden = True

wb.save("TechAlgerie_Rapport_Final.xlsx")
print("Rapport de Direction cree : TechAlgerie_Rapport_Final.xlsx")
\`\`\``

    const l6_c2 = `## Combiner tous les scripts : L'automatisation complete

Maintenant que vous avez 5 scripts distincts, vous pouvez les combiner dans un seul script "maitre" qui genere tout le rapport en une seule commande !

\`\`\`python
# ====================================================
# generer_tout.py - Script maitre d'automatisation
# Lance tous les scripts dans le bon ordre
# ====================================================

print("=== Generation du rapport TechAlgerie SARL ===")
print("")

# Etape 1 : Creer la structure de base
print("1/5 : Creation de la structure Excel...")
exec(open("techalg_init.py").read())

# Etape 2 : Dashboard KPI
print("2/5 : Generation du tableau de bord...")
exec(open("dashboard_kpi.py").read())

# Etape 3 : Compte de resultat
print("3/5 : Creation du compte de resultat...")
exec(open("finances_resultat.py").read())

# Etape 4 : Inventaire
print("4/5 : Mise a jour de l'inventaire...")
exec(open("inventaire.py").read())

# Etape 5 : Ressources Humaines
print("5/5 : Generation des fiches RH...")
exec(open("rh_employes.py").read())

print("")
print("=== RAPPORT GENERE AVEC SUCCES ! ===")
print("Fichiers crees :")
print("- TechAlgerie_Business.xlsx (Dashboard + Finances + Inventaire + RH)")
print("- TechAlgerie_Rapport_Final.xlsx (Rapport de direction)")
\`\`\`

**Pour lancer ce script maitre :**

\`\`\`bash
python generer_tout.py
\`\`\`

En 30 secondes, tout votre rapport est genere !

---

## Ce que vous pouvez adapter a votre entreprise reelle

Voici comment adapter ces scripts a vos donnees reelles :

**Pour les donnees financieres :**
- Remplacez les valeurs de \`lignes_pl\` par vos vraies donnees
- Ou mieux : utilisez \`pandas\` pour lire vos donnees depuis un fichier CSV existant

**Pour l'inventaire :**
- Exportez votre liste de produits depuis votre logiciel de gestion en CSV
- Lisez ce CSV avec \`pandas\` : \`df = pandas.read_csv("produits.csv")\`

**Pour les RH :**
- Adaptez la liste \`employes\` avec vos vraies donnees
- Modifiez les couleurs des departements

**Prompt Antigravity pour adapter :**

\`\`\`
J'ai un fichier CSV nomme "produits.csv" avec les colonnes :
reference, nom, categorie, stock_actuel, stock_minimum, prix_achat, prix_vente
Modifie le script inventaire.py pour lire ce fichier CSV avec pandas
au lieu d'avoir les donnees en dur dans le code.
\`\`\``

    const l6_c3 = JSON.stringify({
        type: 'success',
        title: 'Felicitations ! Vous avez termine la formation !',
        body: '**Recapitulatif de tout ce que vous avez appris :**\n\n**Python :**\n- Variables (stocker des donnees)\n- Listes et Dictionnaires (organiser les donnees)\n- Boucles for (repeter du code)\n- Conditions if/elif/else (prendre des decisions)\n- Fonctions def (reutiliser du code)\n- Dates et calculs\n\n**Excel avec openpyxl :**\n- Creer, ouvrir et sauvegarder des fichiers Excel\n- Ecrire du texte, des nombres et des dates dans les cellules\n- Appliquer des couleurs, des bordures et des polices\n- Fusionner des cellules et ajuster les largeurs\n- Ecrire des formules Excel automatiquement\n- Creer des graphiques (barres, camembert)\n- Figer des volets et activer les filtres\n- Masquer le quadrillage pour un look pro\n\n**Avec Google Antigravity :**\n- Generer du code Python en langage naturel francais\n- Modifier et adapter le code genere\n- Automatiser des taches repetitives\n\n**Prochaine etape :** Adaptez ces scripts a vos vraies donnees d\'entreprise et commencez a automatiser votre travail quotidien !'
    })

    await prisma.courseContent.createMany({
        data: [
            { lessonId: lesson6.id, title: 'intro', contentType: 'CALLOUT', order: 1, content: l6_intro },
            { lessonId: lesson6.id, title: 'rapport-graphique', contentType: 'TEXT', order: 2, content: l6_c1 },
            { lessonId: lesson6.id, title: 'combiner-scripts', contentType: 'TEXT', order: 3, content: l6_c2 },
            { lessonId: lesson6.id, title: 'fin-formation', contentType: 'CALLOUT', order: 4, content: l6_c3 },
        ]
    })
    console.log("  Lecon 6 creee (4 blocs)")

    console.log('\nSeed novice ameliore termine avec succes !')
    console.log('Cours : "' + course.title + '"')
    console.log('Slug  : ' + slug)
    console.log('Prix  : GRATUIT')
    console.log('6 lecons creees avec contenu detaille pour debutants')
}

main()
    .catch(e => { console.error('Erreur :', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
