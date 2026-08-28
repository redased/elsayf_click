const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enhanceVBACourse() {
  console.log('🚀 Début de l\'amélioration du cours VBA Access...\n');

  try {
    // 1. Mettre à jour le cours avec une image
    console.log('📸 Ajout de l\'image de couverture...');
    const course = await prisma.course.update({
      where: { slug: 'vba-access-complet' },
      data: {
        image: '/images/courses/vba-access.jpg',
        fullDescription: `Ce cours complet vous transformera en expert VBA pour Microsoft Access, même si vous partez de zéro ! 🎯

**Ce que vous allez maîtriser :**
- L'éditeur VBA (VBE) et toutes ses fonctionnalités avancées
- La syntaxe VBA de A à Z avec des exemples concrets
- Les structures de contrôle pour automatiser vos processus
- Le modèle objet d'Access (DoCmd, CurrentDb) pour contrôler l'interface
- La programmation événementielle des formulaires et états
- La manipulation de données via DAO (Data Access Objects)
- L'exécution de requêtes SQL dynamiques depuis VBA
- La gestion professionnelle des erreurs et le débogage
- L'automatisation d'Excel et Word depuis Access
- Les techniques de sécurisation et de distribution

**Pourquoi ce cours ?**
VBA est LA compétence qui fait la différence entre un utilisateur Access et un développeur Access. Vous pourrez créer des applications complètes, professionnelles et automatisées qui impressionneront vos collègues et employeurs.

**Format pédagogique :**
Le cours est entièrement axé sur le code et la pratique. Chaque concept est illustré par des exemples de code commentés que vous pouvez copier-coller et adapter à vos besoins.`,
      },
    });
    console.log('✅ Image et description améliorées\n');

    // 2. Récupérer toutes les leçons
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      include: { contents: true },
    });

    console.log(`📚 ${lessons.length} leçons trouvées\n`);

    // 3. Structure améliorée pour chaque leçon
    const enhancedLessons = [
      {
        // Leçon 1
        order: 1,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `À la fin de ce chapitre, vous saurez :
- Ce qu'est VBA et pourquoi il est indispensable avec Access
- Naviguer dans l'éditeur Visual Basic (VBE) comme un pro
- Comprendre l'organisation du code en modules
- Écrire et exécuter votre première procédure VBA

**Durée estimée :** 90 minutes • **Niveau :** Débutant`,
          },
          {
            title: '💡 Qu\'est-ce que VBA ?',
            type: 'text',
            content: `**Visual Basic for Applications (VBA)** est le langage de programmation intégré à la suite Microsoft Office.

Dans Access, VBA vous permet de :
- 🚀 **Automatiser** des tâches répétitives
- 🎨 **Personnaliser** l'interface utilisateur au-delà des possibilités standard
- 🔧 **Contrôler** finement la manipulation des données
- 🔗 **Intégrer** Access avec d'autres applications Office (Excel, Word, Outlook)
- ⚡ **Créer** des fonctionnalités que les macros ne peuvent pas gérer

VBA dépasse les limites des macros classiques en offrant un contrôle total sur votre base de données.`,
          },
          {
            title: '🛠️ L\'éditeur Visual Basic (VBE)',
            type: 'text',
            content: `Pour accéder à l'éditeur VBA, utilisez le raccourci **Alt + F11** depuis Access.

### Les composants essentiels de VBE :

**1. L'Explorateur de projets (Ctrl+R)**
- Affiche l'arborescence complète de votre projet
- Liste tous les modules, formulaires et états contenant du code
- Permet de naviguer rapidement entre les différents éléments

**2. La Fenêtre des propriétés (F4)**
- Affiche les caractéristiques de l'objet sélectionné
- Permet de modifier le nom, la taille, les couleurs, etc.
- Essentielle pour configurer vos formulaires et contrôles

**3. La Fenêtre d'exécution (Ctrl+G)**
- Outil INDISPENSABLE pour tester du code rapidement
- Permet d'afficher des résultats avec \`Debug.Print\`
- Vous pouvez y taper des commandes VBA directement

**💡 Astuce :** Gardez toujours la fenêtre d'exécution ouverte pendant le développement !`,
          },
          {
            title: '📂 Types de Modules',
            type: 'text',
            content: `Le code VBA est organisé dans différents types de modules :

### 1. Modules Standards
- Contiennent des procédures globales (Sub et Function)
- Peuvent être appelés depuis n'importe où dans l'application
- Idéaux pour les fonctions utilitaires réutilisables

### 2. Modules de Classe
- Permettent de créer vos propres objets personnalisés
- Définissent des propriétés et méthodes custom
- Pour la programmation orientée objet avancée

### 3. Modules de Formulaire / État
- Directement liés à un formulaire ou état spécifique
- Contiennent le code des événements (clics, chargement, etc.)
- Le code n'est actif que quand le formulaire/état est ouvert

**🎯 Best Practice :** Utilisez les modules standards pour la logique métier et les modules de formulaire uniquement pour l'interface.`,
          },
          {
            title: '🎬 Votre première procédure VBA',
            type: 'code',
            content: `Public Sub BonjourMonde()
    ' Ceci est un commentaire (ligne ignorée à l'exécution)
    ' Les commentaires commencent toujours par une apostrophe

    ' MsgBox affiche une boîte de dialogue
    MsgBox "Bonjour, bienvenue dans le monde VBA !", vbInformation, "Accueil"

    ' vbInformation ajoute une icône d'information
    ' "Accueil" est le titre de la fenêtre
End Sub`,
          },
          {
            title: '▶️ Exécuter votre code',
            type: 'text',
            content: `Pour exécuter cette procédure :

1. **Dans VBE :** Placez votre curseur n'importe où à l'intérieur de la procédure et appuyez sur **F5**
2. **Depuis Access :** Créez un bouton sur un formulaire et utilisez l'événement \`On Click\` pour appeler \`BonjourMonde\`

**🔍 Débogage :** Si vous avez une erreur, VBE mettra la ligne problématique en jaune. Lisez le message d'erreur attentivement !

**✨ Félicitations !** Vous venez d'écrire et d'exécuter votre premier code VBA.`,
          },
        ],
      },
      {
        // Leçon 2
        order: 2,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `Dans ce chapitre, vous apprendrez :
- Comment déclarer et utiliser des variables
- Les types de données essentiels en VBA
- La portée des variables (locale, module, globale)
- L'utilisation des constantes pour un code plus maintenable

**Durée estimée :** 90 minutes • **Niveau :** Débutant`,
          },
          {
            title: '📦 Déclarer des variables avec Dim',
            type: 'text',
            content: `**Une variable** est un conteneur qui stocke une valeur en mémoire. En VBA, il est crucial de déclarer explicitement toutes vos variables.

### Option Explicit : Votre meilleur ami

Placez \`Option Explicit\` en haut de chaque module. Cette instruction **force** la déclaration de toutes les variables et évite 90% des bugs liés aux fautes de frappe !

**Sans Option Explicit :**
\`\`\`vba
' Bug silencieux ! maVriable au lieu de maVariable
maVariable = 10
Debug.Print maVriable ' Affiche 0 (variable vide créée automatiquement)
\`\`\`

**Avec Option Explicit :**
\`\`\`vba
' Erreur immédiate : "Variable non définie"
' Vous détectez la faute de frappe tout de suite !
\`\`\``,
          },
          {
            title: '💻 Exemple complet de déclaration',
            type: 'code',
            content: `Option Explicit

Sub ExempleVariables()
    ' Déclaration de plusieurs variables avec leur type
    Dim strNom As String        ' Texte
    Dim intAge As Integer       ' Nombre entier petit (-32,768 à 32,767)
    Dim lngID As Long          ' Nombre entier grand (recommandé)
    Dim dblPrix As Double      ' Nombre décimal
    Dim curMontant As Currency ' Montant monétaire (plus précis)
    Dim blnEstActif As Boolean ' Vrai/Faux
    Dim dtDate As Date         ' Date et heure

    ' Attribution de valeurs
    strNom = "El Sayf"
    intAge = 35
    lngID = 123456789
    dblPrix = 45.50
    curMontant = 1999.99
    blnEstActif = True
    dtDate = #3/1/2026#  ' Format américain mm/jj/aaaa

    ' Affichage
    MsgBox "Nom : " & strNom & vbCrLf & _
           "Âge : " & intAge & " ans" & vbCrLf & _
           "Prix : " & Format(dblPrix, "0.00 €"), _
           vbInformation, "Mes Variables"
End Sub`,
          },
          {
            title: '📊 Les types de données essentiels',
            type: 'text',
            content: `| Type | Usage | Plage | Mémoire |
|------|-------|-------|---------|
| **String** | Texte | 0 à ~2 milliards de caractères | Variable |
| **Integer** | Petit entier | -32,768 à 32,767 | 2 octets |
| **Long** | Entier (recommandé) | -2 milliards à +2 milliards | 4 octets |
| **Double** | Décimal | ±1.79769313486231E308 | 8 octets |
| **Currency** | Monétaire précis | 4 décimales fixes | 8 octets |
| **Boolean** | Vrai/Faux | True ou False | 2 octets |
| **Date** | Date/Heure | 1/1/100 au 31/12/9999 | 8 octets |
| **Variant** | N'importe quoi | Tout type | Variable |
| **Object** | Objets VBA | Recordset, Form, etc. | 4 octets |

**🎯 Best Practices :**
- Utilisez **Long** plutôt que Integer (plus sûr, même taille en 32-bit)
- Utilisez **Currency** pour l'argent (évite les erreurs d'arrondi)
- Évitez **Variant** sauf si nécessaire (consomme plus de mémoire)`,
          },
          {
            title: '🔍 La portée des variables',
            type: 'text',
            content: `La **portée** détermine où une variable est accessible dans votre code :

### 1. Variable Locale (Dim dans une Sub/Function)
\`\`\`vba
Sub MaProcedure()
    Dim x As Integer ' Variable locale
    x = 10
End Sub
' x n'existe plus ici (détruite à la fin de la procédure)
\`\`\`

### 2. Variable de Module (Private en haut du module)
\`\`\`vba
Option Explicit
Private m_Compteur As Long ' Accessible par toutes les procédures du module

Sub IncrémenterCompteur()
    m_Compteur = m_Compteur + 1
End Sub

Sub AfficherCompteur()
    MsgBox m_Compteur ' Peut lire m_Compteur
End Sub
\`\`\`

### 3. Variable Globale (Public en haut d'un module standard)
\`\`\`vba
Public g_NomUtilisateur As String ' Accessible depuis TOUTE l'application
\`\`\`

**⚠️ Attention :** Limitez l'usage des variables globales ! Elles rendent le code difficile à déboguer.`,
          },
          {
            title: '🔒 Les Constantes',
            type: 'text',
            content: `Si une valeur ne change **jamais**, utilisez une **constante**. Cela rend le code plus lisible et plus facile à maintenir.

**Avantages :**
- 📖 Nom significatif au lieu de "nombre magique"
- 🔧 Modification centralisée (changez une seule fois)
- 🚀 Légèrement plus rapide (optimisé à la compilation)`,
          },
          {
            title: '💻 Exemple d\'utilisation de constantes',
            type: 'code',
            content: `Option Explicit

' Constantes en haut du module
Const TAUX_TVA As Double = 0.20
Const NOM_ENTREPRISE As String = "El Sayf Formation"
Const MAX_TENTATIVES As Integer = 3

Sub CalculerPrixTTC()
    Dim dblPrixHT As Double
    Dim dblPrixTTC As Double

    dblPrixHT = 100

    ' Utilisation de la constante (plus clair que 0.20)
    dblPrixTTC = dblPrixHT * (1 + TAUX_TVA)

    MsgBox "Prix TTC : " & Format(dblPrixTTC, "0.00 €") & vbCrLf & _
           "Entreprise : " & NOM_ENTREPRISE, _
           vbInformation, "Facture"
End Sub`,
          },
        ],
      },
      {
        // Leçon 3
        order: 3,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `Les structures de contrôle permettent de créer une logique dans votre code. Vous apprendrez :
- Les conditions IF...THEN...ELSE pour prendre des décisions
- SELECT CASE pour des conditions multiples élégantes
- Les boucles FOR pour répéter des actions
- Les boucles DO WHILE/UNTIL pour itérer selon une condition

**Durée estimée :** 90 minutes • **Niveau :** Débutant-Intermédiaire`,
          },
          {
            title: '🔀 Conditions IF...THEN...ELSE',
            type: 'text',
            content: `La structure **IF** permet d'exécuter du code différent selon qu'une condition est vraie ou fausse.

### Syntaxe de base :
\`\`\`vba
If condition Then
    ' Code si condition vraie
End If
\`\`\`

### Avec alternative (Else) :
\`\`\`vba
If condition Then
    ' Code si vrai
Else
    ' Code si faux
End If
\`\`\`

### Avec plusieurs conditions (ElseIf) :
\`\`\`vba
If condition1 Then
    ' Code pour condition1
ElseIf condition2 Then
    ' Code pour condition2
Else
    ' Code si aucune condition vraie
End If
\`\`\``,
          },
          {
            title: '💻 Exemple pratique : Vérification d\'âge',
            type: 'code',
            content: `Sub VerifierAge(age As Integer)
    ' Vérification avec plusieurs conditions
    If age >= 18 Then
        MsgBox "✅ Vous êtes majeur.", vbInformation, "Statut"
    ElseIf age >= 14 Then
        MsgBox "👤 Vous êtes adolescent.", vbInformation, "Statut"
    ElseIf age >= 0 Then
        MsgBox "👶 Vous êtes enfant.", vbInformation, "Statut"
    Else
        MsgBox "❌ Âge invalide !", vbCritical, "Erreur"
    End If
End Sub

' Test : appeler avec différentes valeurs
Sub TestVerification()
    VerifierAge 25    ' Affiche "majeur"
    VerifierAge 16    ' Affiche "adolescent"
    VerifierAge 8     ' Affiche "enfant"
    VerifierAge -5    ' Affiche "invalide"
End Sub`,
          },
          {
            title: '🎛️ SELECT CASE : L\'alternative élégante',
            type: 'text',
            content: `Quand vous devez tester **la même variable** avec plusieurs valeurs possibles, **SELECT CASE** est bien plus lisible que des IF imbriqués.

**Avantages :**
- ✨ Code plus propre et facile à lire
- 🚀 Plus rapide à écrire
- 🔧 Plus facile à maintenir

**Quand l'utiliser ?** Dès que vous avez 3+ conditions sur la même variable.`,
          },
          {
            title: '💻 Exemple : Traitement selon statut',
            type: 'code',
            content: `Sub TraiterCommande(statut As String)
    Select Case statut
        Case "Validé", "Payé"
            ' Plusieurs valeurs possibles
            MsgBox "✅ Traiter et expédier la commande"

        Case "En attente"
            MsgBox "⏳ Attendre le paiement"

        Case "Annulé", "Remboursé"
            MsgBox "❌ Archiver sans traitement"

        Case "Livré"
            MsgBox "📦 Commande déjà traitée"

        Case Else
            ' Important : toujours gérer le cas "autre"
            MsgBox "⚠️ Statut inconnu : " & statut, vbExclamation
    End Select
End Sub`,
          },
          {
            title: '🔁 Boucle FOR...NEXT',
            type: 'text',
            content: `La boucle **FOR** répète un bloc de code un **nombre précis de fois**.

**Syntaxe :**
\`\`\`vba
For compteur = début To fin [Step incrément]
    ' Code à répéter
Next compteur
\`\`\`

**Paramètres :**
- **compteur** : Variable qui change à chaque itération
- **début** : Valeur de départ
- **fin** : Valeur finale (incluse)
- **Step** : Incrément (optionnel, défaut = 1)`,
          },
          {
            title: '💻 Exemples de boucles FOR',
            type: 'code',
            content: `Sub ExemplesBouclesFor()
    Dim i As Integer
    Dim resultat As String

    ' 1. Boucle simple de 1 à 10
    Debug.Print "=== Compte de 1 à 10 ==="
    For i = 1 To 10
        Debug.Print "Valeur : " & i
    Next i

    ' 2. Boucle avec Step (de 2 en 2)
    Debug.Print vbCrLf & "=== Nombres pairs de 0 à 20 ==="
    For i = 0 To 20 Step 2
        Debug.Print i & " "
    Next i

    ' 3. Boucle à rebours (Step négatif)
    Debug.Print vbCrLf & "=== Compte à rebours ==="
    For i = 10 To 1 Step -1
        Debug.Print i & "... "
    Next i
    Debug.Print "🚀 Décollage !"

    ' 4. Table de multiplication
    resultat = "Table de 7 :" & vbCrLf
    For i = 1 To 10
        resultat = resultat & "7 × " & i & " = " & (7 * i) & vbCrLf
    Next i
    MsgBox resultat
End Sub`,
          },
          {
            title: '🔄 Boucle FOR EACH...NEXT',
            type: 'text',
            content: `La boucle **FOR EACH** parcourt tous les éléments d'une **collection** d'objets.

**Collections courantes en Access :**
- \`Form.Controls\` : Tous les contrôles d'un formulaire
- \`Recordset\` : Tous les enregistrements (méthode alternative)
- \`TableDefs\` : Toutes les tables
- \`Forms\` : Tous les formulaires ouverts

**Avantage :** Pas besoin de connaître le nombre d'éléments à l'avance !`,
          },
          {
            title: '💻 Exemple : Parcourir les contrôles d\'un formulaire',
            type: 'code',
            content: `Sub ViderToutesLesZonesDeTexte()
    Dim frm As Form
    Dim ctrl As Control
    Dim compteur As Integer

    ' Référence au formulaire actif
    Set frm = Screen.ActiveForm

    compteur = 0

    ' Parcourt TOUS les contrôles du formulaire
    For Each ctrl In frm.Controls
        ' Vérifie si c'est une zone de texte
        If ctrl.ControlType = acTextBox Then
            ' Vide le contenu
            ctrl.Value = Null
            compteur = compteur + 1
        End If
    Next ctrl

    MsgBox compteur & " zone(s) de texte vidée(s).", vbInformation

    ' Nettoyage
    Set frm = Nothing
End Sub`,
          },
          {
            title: '⏱️ Boucles DO WHILE et DO UNTIL',
            type: 'text',
            content: `Ces boucles s'exécutent tant qu'une **condition** est remplie.

### DO WHILE (Tant que)
\`\`\`vba
Do While condition
    ' Code répété tant que condition = True
Loop
\`\`\`

### DO UNTIL (Jusqu'à ce que)
\`\`\`vba
Do Until condition
    ' Code répété jusqu'à ce que condition = True
Loop
\`\`\`

**⚠️ Danger :** Risque de boucle infinie si la condition ne change jamais !`,
          },
          {
            title: '💻 Exemples de boucles DO',
            type: 'code',
            content: `Sub ExemplesBouclesDo()
    Dim x As Integer
    Dim reponse As String

    ' 1. DO WHILE - Tant que x <= 5
    x = 1
    Debug.Print "=== DO WHILE ==="
    Do While x <= 5
        Debug.Print "x = " & x
        x = x + 1  ' Important : incrémenter pour éviter boucle infinie !
    Loop

    ' 2. DO UNTIL - Jusqu'à ce que x > 10
    Debug.Print vbCrLf & "=== DO UNTIL ==="
    Do Until x > 10
        Debug.Print "x = " & x
        x = x + 1
    Loop

    ' 3. Demander une saisie jusqu'à validation
    Do
        reponse = InputBox("Entrez 'OK' pour continuer :", "Saisie")

        If reponse = "" Then
            MsgBox "Annulation !", vbExclamation
            Exit Do  ' Sort de la boucle
        End If

    Loop Until UCase(reponse) = "OK"

    MsgBox "Merci ! Vous avez entré : " & reponse
End Sub`,
          },
        ],
      },
      {
        // Leçon 4
        order: 4,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `Le modèle objet d'Access vous permet de contrôler programmatiquement votre application. Vous découvrirez :
- L'objet DoCmd pour les actions d'interface
- CurrentDb pour accéder à la base de données
- Les méthodes essentielles pour ouvrir formulaires et états
- L'exécution de requêtes SQL d'action

**Durée estimée :** 90 minutes • **Niveau :** Intermédiaire`,
          },
          {
            title: '🏗️ Hiérarchie du modèle objet Access',
            type: 'text',
            content: `Microsoft Access expose une **hiérarchie d'objets** que vous pouvez manipuler en VBA :

\`\`\`
Application (racine)
├── Forms (collection de tous les formulaires ouverts)
├── Reports (collection de tous les états ouverts)
├── DoCmd (objet pour les commandes macro)
├── CurrentDb (objet Database actuel)
│   ├── TableDefs (tables)
│   ├── QueryDefs (requêtes)
│   ├── Recordsets (données)
│   └── Relations (relations)
└── Screen (élément actif à l'écran)
\`\`\`

**L'objet le plus utilisé :** **DoCmd** (remplace les macros)`,
          },
          {
            title: '🎬 L\'objet DoCmd',
            type: 'text',
            content: `**DoCmd** (Do Command = Faire Commande) exécute les actions qu'on ferait normalement par des macros.

### Méthodes essentielles :

| Méthode | Usage |
|---------|-------|
| \`OpenForm\` | Ouvre un formulaire |
| \`OpenReport\` | Ouvre un état (rapport) |
| \`Close\` | Ferme un objet |
| \`RunSQL\` | Exécute une requête SQL d'action |
| \`GoToRecord\` | Navigue entre enregistrements |
| \`FindRecord\` | Recherche un enregistrement |
| \`SetWarnings\` | Active/désactive les messages d'alerte |
| \`Quit\` | Ferme Access |
| \`Hourglass\` | Affiche un curseur d'attente |

**💡 Astuce :** Tapez "DoCmd." dans VBE et IntelliSense vous montrera toutes les méthodes disponibles !`,
          },
          {
            title: '💻 DoCmd.OpenForm - Ouvrir un formulaire',
            type: 'code',
            content: `Sub ExemplesOuvertureFormulaire()

    ' 1. Ouverture simple en mode normal
    DoCmd.OpenForm "frmClients"

    ' 2. Ouverture en mode création (design)
    DoCmd.OpenForm "frmClients", acDesign

    ' 3. Ouverture avec filtre (clients de Paris uniquement)
    DoCmd.OpenForm "frmClients", acNormal, , "Ville = 'Paris'"

    ' 4. Ouverture avec filtre sur ID (pour édition)
    Dim lngClientID As Long
    lngClientID = 12345
    DoCmd.OpenForm "frmDetailClient", acNormal, , "ID = " & lngClientID

    ' 5. Ouverture en mode boîte de dialogue (bloque l'accès au reste)
    DoCmd.OpenForm "frmConnexion", acNormal, , , , acDialog

    ' 6. Ouverture en lecture seule (DataMode)
    DoCmd.OpenForm "frmConsultation", acNormal, , , acFormReadOnly

End Sub

' Syntaxe complète :
' DoCmd.OpenForm FormName, [View], [FilterName], [WhereCondition], _
'                [DataMode], [WindowMode], [OpenArgs]`,
          },
          {
            title: '💻 DoCmd.OpenReport - Ouvrir un état',
            type: 'code',
            content: `Sub ExemplesOuvertureEtat()
    Dim lngFactureID As Long

    ' 1. Aperçu avant impression
    DoCmd.OpenReport "rptFacture", acViewPreview

    ' 2. Impression directe (sans aperçu)
    DoCmd.OpenReport "rptListeClients", acViewNormal

    ' 3. Aperçu avec filtre (facture spécifique)
    lngFactureID = 7890
    DoCmd.OpenReport "rptFacture", acViewPreview, , "IdFacture = " & lngFactureID

    ' 4. Export en PDF (Access 2007+)
    DoCmd.OpenReport "rptRapportAnnuel", acViewReport, , , acHidden
    DoCmd.OutputTo acOutputReport, "rptRapportAnnuel", acFormatPDF, _
                    "C:\Rapports\Annuel_2026.pdf"
    DoCmd.Close acReport, "rptRapportAnnuel"

    MsgBox "✅ Rapport généré : C:\Rapports\Annuel_2026.pdf"

End Sub

' Modes d'ouverture :
' acViewNormal = impression directe
' acViewPreview = aperçu
' acViewReport = aperçu (Access 2007+)
' acViewDesign = mode création`,
          },
          {
            title: '💻 DoCmd.RunSQL - Exécuter des requêtes',
            type: 'code',
            content: `Sub ExecuterRequetesSQL()

    ' ⚠️ IMPORTANT : Désactiver les avertissements
    ' Sinon Access affiche "Vous êtes sur le point de modifier X lignes"
    DoCmd.SetWarnings False

    On Error GoTo GestionErreur

    ' 1. Supprimer des données
    DoCmd.RunSQL "DELETE FROM tblTemporaire WHERE DateCreation < Date() - 30"

    ' 2. Insérer un enregistrement
    DoCmd.RunSQL "INSERT INTO tblLog (Utilisateur, Action, DateHeure) " & _
                 "VALUES ('Admin', 'Connexion', Now())"

    ' 3. Mettre à jour des données
    DoCmd.RunSQL "UPDATE tblProduits SET Prix = Prix * 1.05 WHERE Categorie = 'Alimentaire'"

    ' 4. Créer une table temporaire
    DoCmd.RunSQL "SELECT * INTO tblBackup FROM tblClients WHERE Statut = 'Actif'"

    ' ✅ Réactiver les avertissements (CRUCIAL)
    DoCmd.SetWarnings True

    MsgBox "✅ Toutes les requêtes ont été exécutées avec succès !", vbInformation
    Exit Sub

GestionErreur:
    DoCmd.SetWarnings True ' Réactiver même en cas d'erreur !
    MsgBox "❌ Erreur : " & Err.Description, vbCritical
End Sub

' ⚡ Note : CurrentDb.Execute est plus performant que DoCmd.RunSQL
' Voir leçon suivante pour DAO`,
          },
          {
            title: '🗄️ L\'objet CurrentDb',
            type: 'text',
            content: `**CurrentDb** retourne une référence à la base de données actuellement ouverte.

### Utilisations principales :

**1. Accéder aux données (via DAO)**
\`\`\`vba
Dim db As DAO.Database
Set db = CurrentDb
\`\`\`

**2. Exécuter des requêtes (plus rapide que DoCmd)**
\`\`\`vba
CurrentDb.Execute "UPDATE...", dbFailOnError
\`\`\`

**3. Manipuler les objets de la base**
\`\`\`vba
' Lister toutes les tables
For Each tdf In CurrentDb.TableDefs
    Debug.Print tdf.Name
Next
\`\`\`

**💡 Best Practice :** Créez toujours une variable \`db\` plutôt que d'appeler \`CurrentDb\` plusieurs fois (plus performant).`,
          },
          {
            title: '💻 CurrentDb vs DBEngine',
            type: 'code',
            content: `Sub ComparerCurrentDbEtDBEngine()
    Dim db As DAO.Database

    ' ─── Méthode 1 : CurrentDb (recommandé pour DB courante) ───
    Set db = CurrentDb
    Debug.Print "Base actuelle : " & db.Name
    Set db = Nothing

    ' ─── Méthode 2 : DBEngine (pour accès multi-bases) ───
    ' DBEngine(0)(0) = Workspace par défaut, Database par défaut
    Set db = DBEngine(0)(0)
    Debug.Print "Via DBEngine : " & db.Name
    Set db = Nothing

    ' ─── Ouvrir une AUTRE base de données ───
    Dim dbExterne As DAO.Database
    Set dbExterne = DBEngine(0).OpenDatabase("C:\Autres\AutreBase.accdb")

    ' Maintenant vous pouvez lire/écrire dans cette autre base
    Debug.Print "Base externe : " & dbExterne.Name

    dbExterne.Close
    Set dbExterne = Nothing

End Sub

' 🎯 Règle simple :
' - CurrentDb → pour la base actuelle (99% des cas)
' - DBEngine → pour ouvrir d'autres bases ou gérer des transactions`,
          },
          {
            title: '⏳ DoCmd.Hourglass - Curseur d\'attente',
            type: 'code',
            content: `Sub TraitementLong()
    Dim i As Long

    ' Affiche le curseur "sablier/roue" pour indiquer un traitement
    DoCmd.Hourglass True

    ' Simulation d'un traitement long
    For i = 1 To 1000000
        ' Votre code ici (calculs, requêtes, etc.)
    Next i

    ' ✅ IMPORTANT : Toujours désactiver à la fin
    DoCmd.Hourglass False

    MsgBox "Traitement terminé !"

End Sub

' ⚠️ Conseil : Utilisez aussi Application.Echo False/True
' pour figer l'écran pendant les traitements (évite les scintillements)

Sub TraitementAvecEcho()
    Application.Echo False  ' Fige l'affichage
    DoCmd.Hourglass True

    ' Vos opérations ici

    DoCmd.Hourglass False
    Application.Echo True   ' Réactive l'affichage
End Sub`,
          },
        ],
      },
      {
        // Leçon 5
        order: 5,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `La programmation événementielle est au cœur du développement Access. Vous maîtriserez :
- Le mot-clé "Me" dans les formulaires
- Les événements essentiels (Load, Current, BeforeUpdate...)
- La validation de saisie avec Cancel
- La manipulation des ListBox et ComboBox

**Durée estimée :** 120 minutes • **Niveau :** Intermédiaire`,
          },
          {
            title: '💡 Le mot-clé "Me"',
            type: 'text',
            content: `Dans un **module de formulaire**, le mot-clé **Me** fait référence au formulaire lui-même.

### Pourquoi utiliser Me ?

**Sans Me (ancienne méthode) :**
\`\`\`vba
Forms!frmClients!txtNom.Value = "Dupont"
\`\`\`

**Avec Me (recommandé) :**
\`\`\`vba
Me.txtNom.Value = "Dupont"
' ou encore plus court :
Me.txtNom = "Dupont"  ' .Value est implicite
\`\`\`

**Avantages de Me :**
- ✨ Plus court et lisible
- 🚀 Plus rapide à l'exécution
- 🔧 Facilite les copier-coller de code entre formulaires
- 💡 IntelliSense fonctionne mieux

**🎯 Best Practice :** Utilisez TOUJOURS \`Me\` dans les modules de formulaire/état.`,
          },
          {
            title: '📅 Cycle de vie d\'un formulaire',
            type: 'text',
            content: `Voici l'ordre chronologique des événements quand un formulaire s'ouvre :

\`\`\`
1. Open         → Le formulaire commence à s'ouvrir
2. Load         → Le formulaire charge ses données
3. Resize       → Le formulaire s'affiche à l'écran
4. Activate     → Le formulaire reçoit le focus
5. Current      → Le premier enregistrement est activé
\`\`\`

**Puis, pendant l'utilisation :**
- \`Current\` : À chaque changement d'enregistrement
- \`BeforeUpdate\` : Avant l'enregistrement des modifications
- \`AfterUpdate\` : Après l'enregistrement des modifications

**À la fermeture :**
\`\`\`
1. Unload       → Avant que le formulaire se ferme
2. Close        → Le formulaire se ferme
\`\`\``,
          },
          {
            title: '🔧 Événement Form_Load',
            type: 'text',
            content: `**Form_Load** se déclenche **une seule fois** quand le formulaire s'ouvre.

**Utilisations courantes :**
- ✅ Initialiser des variables
- ✅ Charger des valeurs par défaut
- ✅ Configurer l'interface (masquer/afficher des contrôles)
- ✅ Vérifier les droits de l'utilisateur
- ✅ Préremplir des listes déroulantes`,
          },
          {
            title: '💻 Exemple : Initialisation au chargement',
            type: 'code',
            content: `Private Sub Form_Load()
    ' Exécuté UNE SEULE FOIS à l'ouverture du formulaire

    ' 1. Définir des valeurs par défaut
    Me.txtDateCreation = Date  ' Date du jour
    Me.txtCreePar = Environ("USERNAME")  ' Nom Windows de l'utilisateur

    ' 2. Masquer certains contrôles
    Me.btnSupprimer.Visible = False
    Me.lblAvertissement.Visible = False

    ' 3. Configurer une liste déroulante
    Me.cboCategorie.RowSource = "SELECT ID, NomCategorie FROM tblCategories ORDER BY NomCategorie"

    ' 4. Afficher un message de bienvenue
    Me.lblBienvenue.Caption = "Bienvenue, " & Environ("USERNAME") & " !"

    ' 5. Vérifier les droits utilisateur
    If CurrentUser() <> "Admin" Then
        Me.AllowEdits = False  ' Formulaire en lecture seule
        MsgBox "Vous êtes en mode consultation uniquement.", vbInformation
    End If

    Debug.Print "✅ Formulaire chargé avec succès"
End Sub`,
          },
          {
            title: '🔄 Événement Form_Current',
            type: 'text',
            content: `**Form_Current** se déclenche **à chaque fois** que l'utilisateur change d'enregistrement.

**Quand est-il déclenché ?**
- À l'ouverture (après Load)
- Quand on navigue avec les boutons ◀ ▶
- Après une recherche (FindRecord)
- Après un GoToRecord

**Utilisations courantes :**
- ✅ Afficher/masquer des boutons selon l'enregistrement
- ✅ Calculer des totaux
- ✅ Mettre à jour des étiquettes
- ✅ Actualiser des sous-formulaires liés`,
          },
          {
            title: '💻 Exemple : Adaptation dynamique de l\'interface',
            type: 'code',
            content: `Private Sub Form_Current()
    ' Exécuté à CHAQUE changement d'enregistrement

    ' 1. Gérer l'affichage du bouton Supprimer
    If Me.NewRecord Then
        ' Nouvel enregistrement (vide)
        Me.btnSupprimer.Enabled = False
        Me.lblStatut.Caption = "📝 Nouvel enregistrement"
    Else
        ' Enregistrement existant
        Me.btnSupprimer.Enabled = True
        Me.lblStatut.Caption = "📄 Enregistrement #" & Me.ID
    End If

    ' 2. Colorer selon le statut
    Select Case Nz(Me.txtStatut, "")
        Case "Actif"
            Me.txtStatut.BackColor = RGB(200, 255, 200)  ' Vert clair
        Case "Inactif"
            Me.txtStatut.BackColor = RGB(255, 200, 200)  ' Rouge clair
        Case Else
            Me.txtStatut.BackColor = RGB(255, 255, 255)  ' Blanc
    End Select

    ' 3. Calculer un total
    If Not IsNull(Me.PrixUnitaire) And Not IsNull(Me.Quantite) Then
        Me.txtTotal = Me.PrixUnitaire * Me.Quantite
    End If

End Sub`,
          },
          {
            title: '✅ Validation avec BeforeUpdate',
            type: 'text',
            content: `**BeforeUpdate** est l'événement LE PLUS IMPORTANT pour la validation de données.

**Moments de déclenchement :**
- Avant l'enregistrement d'un formulaire (Form_BeforeUpdate)
- Avant la modification d'un contrôle (Control_BeforeUpdate)

**Le paramètre Cancel :**
\`\`\`vba
Private Sub Form_BeforeUpdate(Cancel As Integer)
    If [condition invalide] Then
        Cancel = True  ' ❌ ANNULE l'enregistrement
    End If
End Sub
\`\`\`

**💡 Astuce :** Utilisez \`.SetFocus\` pour replacer le curseur sur le champ invalide.`,
          },
          {
            title: '💻 Exemple : Validation complète',
            type: 'code',
            content: `Private Sub Form_BeforeUpdate(Cancel As Integer)
    ' Validation AVANT l'enregistrement du formulaire

    ' 1. Vérifier les champs obligatoires
    If IsNull(Me.txtNom) Or Trim(Me.txtNom) = "" Then
        MsgBox "❌ Le nom du client est obligatoire !", vbCritical, "Erreur"
        Cancel = True
        Me.txtNom.SetFocus  ' Replace le curseur
        Exit Sub
    End If

    If IsNull(Me.txtEmail) Then
        MsgBox "❌ L'email est obligatoire !", vbCritical, "Erreur"
        Cancel = True
        Me.txtEmail.SetFocus
        Exit Sub
    End If

    ' 2. Valider le format de l'email
    If InStr(Me.txtEmail, "@") = 0 Then
        MsgBox "❌ Format d'email invalide !", vbCritical, "Erreur"
        Cancel = True
        Me.txtEmail.SetFocus
        Exit Sub
    End If

    ' 3. Vérifier les doublons
    If DCount("ID", "tblClients", "Email = '" & Me.txtEmail & "' AND ID <> " & Nz(Me.ID, 0)) > 0 Then
        MsgBox "⚠️ Cet email existe déjà dans la base !", vbExclamation, "Doublon"
        Cancel = True
        Me.txtEmail.SetFocus
        Exit Sub
    End If

    ' 4. Valider une plage de valeurs
    If Not IsNull(Me.txtAge) Then
        If Me.txtAge < 0 Or Me.txtAge > 150 Then
            MsgBox "❌ L'âge doit être entre 0 et 150 !", vbCritical, "Erreur"
            Cancel = True
            Me.txtAge.SetFocus
            Exit Sub
        End If
    End If

    ' ✅ Si on arrive ici, tout est OK
    Debug.Print "✅ Validation réussie, enregistrement autorisé"
End Sub`,
          },
          {
            title: '📋 Manipulation des ListBox et ComboBox',
            type: 'text',
            content: `Les listes déroulantes (ComboBox) et listes (ListBox) ont des **colonnes cachées** très utiles.

### Propriétés importantes :

| Propriété | Description |
|-----------|-------------|
| \`RowSource\` | Requête SQL qui alimente la liste |
| \`BoundColumn\` | Colonne dont la valeur est stockée (défaut = 1) |
| \`ColumnCount\` | Nombre de colonnes |
| \`ColumnWidths\` | Largeur de chaque colonne (ex: "0cm;3cm;2cm") |
| \`Column(index)\` | Accède à une colonne spécifique |

**💡 Astuce :** Mettez la largeur à "0cm" pour cacher une colonne (comme l'ID).`,
          },
          {
            title: '💻 Exemple : Utilisation avancée de ComboBox',
            type: 'code',
            content: `' ─── Configuration de la ComboBox (à mettre dans Form_Load) ───
Private Sub Form_Load()
    With Me.cboClient
        ' Requête : ID caché, puis Nom, puis Email
        .RowSource = "SELECT ID, Nom, Email FROM tblClients ORDER BY Nom"
        .ColumnCount = 3
        .ColumnWidths = "0cm;4cm;5cm"  ' ID caché, Nom 4cm, Email 5cm
        .BoundColumn = 1  ' La valeur stockée = ID (colonne 1)
    End With
End Sub

' ─── Récupération des valeurs après sélection ───
Private Sub cboClient_AfterUpdate()
    ' La valeur de la combo = ID (BoundColumn = 1)
    Dim lngClientID As Long
    lngClientID = Me.cboClient.Value  ' Ou Me.cboClient tout court

    ' Récupérer les autres colonnes (index commence à 0)
    Dim strNom As String
    Dim strEmail As String

    strNom = Me.cboClient.Column(1)    ' 2ème colonne (Nom)
    strEmail = Me.cboClient.Column(2)  ' 3ème colonne (Email)

    ' Afficher les infos
    MsgBox "Client sélectionné :" & vbCrLf & _
           "ID : " & lngClientID & vbCrLf & _
           "Nom : " & strNom & vbCrLf & _
           "Email : " & strEmail, _
           vbInformation, "Détails"

    ' Pré-remplir d'autres champs du formulaire
    Me.txtNomClient = strNom
    Me.txtEmailClient = strEmail
End Sub

' ─── Effacer la sélection ───
Private Sub btnEffacer_Click()
    Me.cboClient = Null
End Sub`,
          },
        ],
      },
    ];

    // 4. Traiter chaque leçon
    for (const lessonData of enhancedLessons) {
      const lesson = lessons.find(l => l.order === lessonData.order);
      if (!lesson) {
        console.log(`⚠️ Leçon ${lessonData.order} non trouvée, ignorée`);
        continue;
      }

      console.log(`\n📝 Traitement de la leçon ${lesson.order}: ${lesson.title}`);

      // Supprimer les anciens contenus
      await prisma.courseContent.deleteMany({
        where: { lessonId: lesson.id },
      });

      // Créer les nouveaux blocs de contenu
      for (let i = 0; i < lessonData.blocks.length; i++) {
        const block = lessonData.blocks[i];
        await prisma.courseContent.create({
          data: {
            lessonId: lesson.id,
            title: block.title,
            content: block.content,
            contentType: block.type,
            order: i + 1,
          },
        });
      }

      console.log(`   ✅ ${lessonData.blocks.length} blocs de contenu créés`);
    }

    console.log('\n\n🎉 Amélioration du cours VBA Access terminée avec succès !');
    console.log('\n📊 Résumé :');
    console.log('   • Image de couverture ajoutée');
    console.log('   • Description enrichie');
    console.log('   • Structure en blocs CourseContent appliquée');
    console.log('   • Contenu visuellement amélioré avec emojis et formatage\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'amélioration :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution
enhanceVBACourse();
