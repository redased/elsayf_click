const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enhanceVBACoursePart2() {
  console.log('🚀 Amélioration des leçons 6-10 du cours VBA Access...\n');

  try {
    const course = await prisma.course.findUnique({
      where: { slug: 'vba-access-complet' },
    });

    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
    });

    const enhancedLessons = [
      {
        // Leçon 6
        order: 6,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `DAO (Data Access Objects) est la bibliothèque native pour manipuler les données dans Access. Vous apprendrez :
- Ouvrir et parcourir un Recordset
- Ajouter, modifier et supprimer des enregistrements
- Les différents types de Recordset
- Les bonnes pratiques de gestion mémoire

**Durée estimée :** 90 minutes • **Niveau :** Intermédiaire`,
          },
          {
            title: '📚 Introduction à DAO',
            type: 'text',
            content: `**DAO (Data Access Objects)** est la bibliothèque historique et la plus performante pour manipuler des données locales dans Access.

### Pourquoi DAO plutôt qu'autre chose ?

✅ **Rapidité** : Optimisé spécifiquement pour Access/Jet/ACE
✅ **Natif** : Intégré directement dans Access
✅ **Complet** : Accès à toutes les fonctionnalités
✅ **Léger** : Moins gourmand en ressources

**Hiérarchie DAO :**
\`\`\`
DBEngine (moteur de base de données)
└── Workspace (espace de travail)
    └── Database (base de données)
        ├── TableDefs (définitions de tables)
        ├── QueryDefs (requêtes enregistrées)
        └── Recordsets (données)
\`\`\`

**💡 Note :** Pour utiliser DAO, assurez-vous d'avoir la référence "Microsoft DAO 3.6 Object Library" activée dans VBE (Outils > Références).`,
          },
          {
            title: '📖 Le Recordset : Concept fondamental',
            type: 'text',
            content: `Un **Recordset** est un ensemble d'enregistrements en mémoire, comme un tableau virtuel.

### Types de Recordset :

| Type | Description | Modifiable | Usage |
|------|-------------|------------|-------|
| \`dbOpenTable\` | Accès direct à une table | ✅ Oui | Tables uniquement |
| \`dbOpenDynaset\` | Vue dynamique (tables + requêtes) | ✅ Oui | Le plus courant |
| \`dbOpenSnapshot\` | Photo instantanée en lecture seule | ❌ Non | Rapports, lectures |
| \`dbOpenForwardOnly\` | Parcours avant uniquement | ❌ Non | Le plus rapide |

**🎯 Règle d'or :** Utilisez \`dbOpenDynaset\` par défaut sauf si vous avez une raison spécifique.`,
          },
          {
            title: '💻 Ouvrir et lire un Recordset',
            type: 'code',
            content: `Sub LireTousLesClients()
    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim strListe As String

    ' 1. Initialisation
    Set db = CurrentDb
    Set rs = db.OpenRecordset("tblClients", dbOpenDynaset)

    ' 2. Vérifier s'il y a des données
    If rs.EOF And rs.BOF Then
        MsgBox "❌ Aucun client trouvé !", vbExclamation
        GoTo Nettoyage
    End If

    ' 3. Se positionner au début (bonne pratique)
    rs.MoveFirst

    ' 4. Parcourir tous les enregistrements
    Do While Not rs.EOF
        ' Accès aux champs : rs!NomChamp ou rs.Fields("NomChamp")
        strListe = strListe & rs!Nom & " " & rs!Prenom & vbCrLf

        ' Passer à l'enregistrement suivant
        rs.MoveNext
    Loop

    ' 5. Afficher le résultat
    MsgBox "📋 Liste des clients :" & vbCrLf & vbCrLf & strListe, _
           vbInformation, rs.RecordCount & " clients"

Nettoyage:
    ' 6. CRUCIAL : Fermer et libérer la mémoire
    If Not rs Is Nothing Then
        If Not rs.EOF Then rs.Close
        Set rs = Nothing
    End If
    Set db = Nothing

End Sub`,
          },
          {
            title: '🔍 Propriétés de navigation essentielles',
            type: 'text',
            content: `### Propriétés de position :

| Propriété | Description |
|-----------|-------------|
| \`BOF\` | **B**eginning **O**f **F**ile - Avant le 1er enregistrement |
| \`EOF\` | **E**nd **O**f **F**ile - Après le dernier enregistrement |
| \`RecordCount\` | Nombre d'enregistrements (pas toujours immédiat) |
| \`AbsolutePosition\` | Position actuelle (0 = premier) |

### Méthodes de navigation :

| Méthode | Action |
|---------|--------|
| \`MoveFirst\` | Va au premier enregistrement |
| \`MoveLast\` | Va au dernier (force RecordCount à se calculer) |
| \`MoveNext\` | Va à l'enregistrement suivant |
| \`MovePrevious\` | Va à l'enregistrement précédent |
| \`Move n\` | Avance de n enregistrements |

**⚠️ Piège :** Après \`MoveNext\` sur le dernier enregistrement, \`EOF = True\` (pas d'erreur, mais plus de données).`,
          },
          {
            title: '💻 Compter les enregistrements correctement',
            type: 'code',
            content: `Sub CompterEnregistrements()
    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim lngCount As Long

    Set db = CurrentDb
    Set rs = db.OpenRecordset("SELECT * FROM tblProduits", dbOpenDynaset)

    ' ❌ ERREUR : RecordCount peut être 1 même avec 1000 lignes !
    ' (Access charge les enregistrements progressivement)
    Debug.Print "RecordCount immédiat : " & rs.RecordCount

    ' ✅ CORRECT : Forcer le chargement complet
    If Not (rs.EOF And rs.BOF) Then
        rs.MoveLast  ' Force Access à charger tous les enregistrements
        rs.MoveFirst ' Revient au début
        lngCount = rs.RecordCount
    Else
        lngCount = 0
    End If

    Debug.Print "✅ Nombre réel d'enregistrements : " & lngCount

    rs.Close
    Set rs = Nothing
    Set db = Nothing

End Sub`,
          },
          {
            title: '➕ Ajouter un enregistrement (AddNew)',
            type: 'code',
            content: `Sub AjouterNouveauClient()
    Dim db As DAO.Database
    Dim rs As DAO.Recordset

    On Error GoTo GestionErreur

    Set db = CurrentDb
    Set rs = db.OpenRecordset("tblClients", dbOpenDynaset)

    ' 1. Créer un nouvel enregistrement vide
    rs.AddNew

    ' 2. Remplir les champs
    rs!Nom = "Durand"
    rs!Prenom = "Sophie"
    rs!Email = "sophie.durand@example.com"
    rs!DateCreation = Date
    rs!Statut = "Actif"

    ' Les champs non remplis prendront :
    ' - La valeur par défaut définie dans la table
    ' - Null si aucune valeur par défaut

    ' 3. Enregistrer (CRUCIAL !)
    rs.Update

    ' 4. Récupérer l'ID auto-généré (si champ AutoNumber)
    rs.Bookmark = rs.LastModified  ' Se positionner sur le nouvel enregistrement
    Dim lngNouvelID As Long
    lngNouvelID = rs!ID

    MsgBox "✅ Client ajouté avec succès !" & vbCrLf & _
           "ID : " & lngNouvelID, vbInformation

    GoTo Nettoyage

GestionErreur:
    MsgBox "❌ Erreur lors de l'ajout : " & Err.Description, vbCritical
    ' Annuler l'ajout en cours
    If Not rs Is Nothing Then
        If rs.EditMode <> dbEditNone Then rs.CancelUpdate
    End If

Nettoyage:
    If Not rs Is Nothing Then
        rs.Close
        Set rs = Nothing
    End If
    Set db = Nothing

End Sub`,
          },
          {
            title: '✏️ Modifier un enregistrement (Edit)',
            type: 'code',
            content: `Sub ModifierPrixProduit(lngProduitID As Long, dblNouveauPrix As Double)
    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim strSQL As String

    On Error GoTo GestionErreur

    ' Ouvrir seulement l'enregistrement à modifier (plus rapide)
    strSQL = "SELECT * FROM tblProduits WHERE ID = " & lngProduitID
    Set db = CurrentDb
    Set rs = db.OpenRecordset(strSQL, dbOpenDynaset)

    ' Vérifier si le produit existe
    If rs.EOF And rs.BOF Then
        MsgBox "❌ Produit #" & lngProduitID & " introuvable !", vbCritical
        GoTo Nettoyage
    End If

    ' 1. Passer en mode édition
    rs.Edit

    ' 2. Modifier les champs
    rs!Prix = dblNouveauPrix
    rs!DateModification = Now
    rs!ModifiePar = Environ("USERNAME")

    ' 3. Enregistrer les modifications
    rs.Update

    MsgBox "✅ Prix mis à jour : " & Format(dblNouveauPrix, "0.00 €"), vbInformation

    GoTo Nettoyage

GestionErreur:
    MsgBox "❌ Erreur : " & Err.Description, vbCritical
    If Not rs Is Nothing Then
        If rs.EditMode <> dbEditNone Then rs.CancelUpdate
    End If

Nettoyage:
    If Not rs Is Nothing Then
        rs.Close
        Set rs = Nothing
    End If
    Set db = Nothing

End Sub`,
          },
          {
            title: '🗑️ Supprimer un enregistrement (Delete)',
            type: 'code',
            content: `Sub SupprimerClientsInactifs()
    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim intNbSupprimes As Integer

    On Error GoTo GestionErreur

    ' Demander confirmation
    If MsgBox("⚠️ Supprimer tous les clients inactifs ?" & vbCrLf & _
              "Cette action est irréversible !", _
              vbQuestion + vbYesNo + vbDefaultButton2, "Confirmation") = vbNo Then
        Exit Sub
    End If

    Set db = CurrentDb
    Set rs = db.OpenRecordset("SELECT * FROM tblClients WHERE Statut = 'Inactif'", _
                              dbOpenDynaset)

    ' Vérifier s'il y a des enregistrements à supprimer
    If rs.EOF And rs.BOF Then
        MsgBox "ℹ️ Aucun client inactif trouvé.", vbInformation
        GoTo Nettoyage
    End If

    ' Parcourir et supprimer
    intNbSupprimes = 0
    Do While Not rs.EOF
        rs.Delete  ' Supprime l'enregistrement actuel
        intNbSupprimes = intNbSupprimes + 1
        rs.MoveNext  ' Important : passer au suivant après Delete
    Loop

    MsgBox "✅ " & intNbSupprimes & " client(s) supprimé(s).", vbInformation

    GoTo Nettoyage

GestionErreur:
    MsgBox "❌ Erreur lors de la suppression : " & Err.Description, vbCritical

Nettoyage:
    If Not rs Is Nothing Then
        rs.Close
        Set rs = Nothing
    End If
    Set db = Nothing

End Sub

' ⚠️ IMPORTANT : Delete ne nécessite PAS de rs.Update
' La suppression est immédiate !`,
          },
          {
            title: '🎯 Bonnes pratiques DAO',
            type: 'text',
            content: `### ✅ À FAIRE :

1. **Toujours fermer les Recordsets**
\`\`\`vba
rs.Close
Set rs = Nothing
\`\`\`

2. **Utiliser On Error** pour gérer les problèmes

3. **Filtrer au maximum dans la requête SQL**
\`\`\`vba
' ✅ BON (filtre côté BD)
"SELECT * FROM tblClients WHERE Ville = 'Paris'"

' ❌ MAUVAIS (charge tout puis filtre en mémoire)
"SELECT * FROM tblClients"
rs.Filter = "Ville = 'Paris'"
\`\`\`

4. **Utiliser dbOpenForwardOnly pour les lectures simples**
\`\`\`vba
' Plus rapide si vous ne faites que lire une fois
Set rs = db.OpenRecordset("...", dbOpenForwardOnly)
\`\`\`

### ❌ À ÉVITER :

1. Ouvrir des Recordsets dans des boucles (performance)
2. Modifier des enregistrements sans \`rs.Edit\`
3. Oublier \`rs.Update\` après \`AddNew\` ou \`Edit\`
4. Laisser des Recordsets ouverts indéfiniment`,
          },
        ],
      },
      {
        // Leçon 7
        order: 7,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `Le SQL dynamique permet de créer des requêtes à la volée selon les besoins. Vous maîtriserez :
- La construction de chaînes SQL avec des variables
- Les délimiteurs corrects (texte, nombres, dates)
- L'exécution avec CurrentDb.Execute
- Les techniques d'optimisation et de sécurité

**Durée estimée :** 90 minutes • **Niveau :** Intermédiaire`,
          },
          {
            title: '💡 Pourquoi du SQL dynamique ?',
            type: 'text',
            content: `### Avantages du SQL dynamique en VBA :

✅ **Flexibilité** : Requêtes qui s'adaptent aux choix de l'utilisateur
✅ **Performance** : Plus rapide que DAO pour les opérations en masse
✅ **Puissance** : Toute la richesse du SQL en une ligne
✅ **Simplicité** : Pas besoin d'ouvrir/fermer des Recordsets

### Quand l'utiliser ?

- **Opérations en masse** (UPDATE, DELETE sur beaucoup de lignes)
- **Requêtes paramétrées** (filtres choisis par l'utilisateur)
- **Création de tables temporaires** (SELECT INTO)
- **Actions simples** (INSERT unique, UPDATE ponctuel)

**💡 Règle :** Si vous devez modifier > 10 enregistrements, utilisez SQL. Si < 10, DAO est OK.`,
          },
          {
            title: '🔤 Les délimiteurs SQL : LA règle d\'or',
            type: 'text',
            content: `C'est **LA** source d'erreurs n°1 en SQL dynamique ! Chaque type de données a son délimiteur.

### Tableau de référence :

| Type | Délimiteur | Exemple VBA | SQL généré |
|------|------------|-------------|------------|
| **Nombre** | Aucun | \`"... ID = " & lngID\` | \`WHERE ID = 123\` |
| **Texte** | Apostrophe ' | \`"... Nom = '" & strNom & "'"\` | \`WHERE Nom = 'Dupont'\` |
| **Date** | Dièse # | \`"... DateNaiss = #" & Format(dtDate, "mm/dd/yyyy") & "#"\` | \`WHERE DateNaiss = #03/15/1990#\` |

**⚠️ ATTENTION DATES :**
- Access utilise le format **américain** dans le SQL : mm/jj/aaaa
- Toujours utiliser \`Format(maDate, "mm/dd/yyyy")\` !`,
          },
          {
            title: '💻 Exemples de délimiteurs',
            type: 'code',
            content: `Sub ExemplesDelimiteurs()
    Dim strSQL As String
    Dim lngID As Long
    Dim strNom As String
    Dim dtDate As Date

    ' Valeurs d'exemple
    lngID = 42
    strNom = "O'Connor"  ' Notez l'apostrophe dans le nom !
    dtDate = #3/15/2026#

    ' ─── 1. NOMBRE : Pas de délimiteur ───
    strSQL = "SELECT * FROM tblClients WHERE ID = " & lngID
    Debug.Print strSQL
    ' Résultat : SELECT * FROM tblClients WHERE ID = 42

    ' ─── 2. TEXTE : Apostrophes simples ───
    strSQL = "SELECT * FROM tblClients WHERE Nom = '" & strNom & "'"
    Debug.Print strSQL
    ' ❌ ERREUR ! : WHERE Nom = 'O'Connor'
    ' L'apostrophe dans O'Connor casse la requête !

    ' ✅ SOLUTION : Doubler les apostrophes
    strSQL = "SELECT * FROM tblClients WHERE Nom = '" & Replace(strNom, "'", "''") & "'"
    Debug.Print strSQL
    ' Résultat : WHERE Nom = 'O''Connor'

    ' ─── 3. DATE : Dièses # avec format US ───
    strSQL = "SELECT * FROM tblClients WHERE DateNaiss = #" & Format(dtDate, "mm/dd/yyyy") & "#"
    Debug.Print strSQL
    ' Résultat : WHERE DateNaiss = #03/15/2026#

    ' ─── 4. COMBINAISON ───
    strSQL = "SELECT * FROM tblCommandes " & _
             "WHERE ClientID = " & lngID & _
             " AND Statut = 'Validé'" & _
             " AND DateCommande >= #" & Format(dtDate, "mm/dd/yyyy") & "#"
    Debug.Print strSQL

End Sub`,
          },
          {
            title: '⚡ CurrentDb.Execute vs DoCmd.RunSQL',
            type: 'text',
            content: `Il existe deux méthodes pour exécuter des requêtes d'action. **CurrentDb.Execute est MEILLEURE**.

### Comparaison :

| Caractéristique | CurrentDb.Execute | DoCmd.RunSQL |
|-----------------|-------------------|---------------|
| **Avertissements** | ❌ Aucun | ✅ Popup "Vous allez modifier X lignes" |
| **Gestion erreurs** | ✅ Paramètre dbFailOnError | ❌ Nécessite SetWarnings |
| **Performance** | ✅ Plus rapide | ❌ Plus lent |
| **Lignes affectées** | ✅ Retourne le nombre | ❌ Non |

**🎯 Recommandation :** Utilisez TOUJOURS \`CurrentDb.Execute\`.`,
          },
          {
            title: '💻 Exécution avec CurrentDb.Execute',
            type: 'code',
            content: `Sub ExemplesExecute()
    Dim strSQL As String
    Dim lngLignesAffectees As Long

    On Error GoTo GestionErreur

    ' ─── 1. DELETE : Supprimer des données ───
    strSQL = "DELETE FROM tblTemp WHERE DateCreation < Date() - 30"
    CurrentDb.Execute strSQL, dbFailOnError
    Debug.Print "✅ Anciennes données supprimées"

    ' ─── 2. INSERT : Ajouter un enregistrement ───
    strSQL = "INSERT INTO tblLog (Utilisateur, Action, DateHeure) " & _
             "VALUES ('" & Environ("USERNAME") & "', 'Connexion', Now())"
    CurrentDb.Execute strSQL, dbFailOnError
    Debug.Print "✅ Log enregistré"

    ' ─── 3. UPDATE avec nombre de lignes modifiées ───
    strSQL = "UPDATE tblProduits SET Prix = Prix * 1.05 WHERE Categorie = 'Alimentaire'"
    CurrentDb.Execute strSQL, dbFailOnError
    lngLignesAffectees = CurrentDb.RecordsAffected
    Debug.Print "✅ " & lngLignesAffected & " produits mis à jour"

    ' ─── 4. SELECT INTO : Créer une table temporaire ───
    ' Supprimer l'ancienne table si elle existe
    On Error Resume Next
    CurrentDb.TableDefs.Delete "tblBackupClients"
    On Error GoTo GestionErreur

    ' Créer la nouvelle table
    strSQL = "SELECT * INTO tblBackupClients FROM tblClients WHERE Statut = 'Actif'"
    CurrentDb.Execute strSQL, dbFailOnError
    Debug.Print "✅ Table de backup créée"

    MsgBox "✅ Toutes les opérations terminées !", vbInformation
    Exit Sub

GestionErreur:
    MsgBox "❌ Erreur SQL : " & Err.Description & vbCrLf & vbCrLf & _
           "Requête : " & strSQL, vbCritical
End Sub

' 💡 dbFailOnError : Si une seule ligne échoue, toute l'opération est annulée (transaction implicite)`,
          },
          {
            title: '🛠️ Construction de requêtes complexes',
            type: 'code',
            content: `Sub RequeteComplexeDynamique()
    Dim strSQL As String
    Dim strVille As String
    Dim strStatut As String
    Dim dtDebut As Date
    Dim dtFin As Date
    Dim blnFiltreDateActif As Boolean

    ' Paramètres (normalement saisis par l'utilisateur)
    strVille = "Paris"
    strStatut = "Actif"
    dtDebut = #1/1/2026#
    dtFin = #3/1/2026#
    blnFiltreDateActif = True

    ' ─── Construction progressive de la requête ───
    strSQL = "SELECT ID, Nom, Prenom, Ville, DateInscription, Statut FROM tblClients"

    ' Début de la clause WHERE
    Dim strWhere As String
    strWhere = " WHERE 1=1"  ' Astuce : permet d'ajouter AND facilement

    ' Ajouter les filtres conditionnellement
    If strVille <> "" Then
        strWhere = strWhere & " AND Ville = '" & Replace(strVille, "'", "''") & "'"
    End If

    If strStatut <> "" Then
        strWhere = strWhere & " AND Statut = '" & strStatut & "'"
    End If

    If blnFiltreDateActif Then
        strWhere = strWhere & " AND DateInscription BETWEEN #" & _
                   Format(dtDebut, "mm/dd/yyyy") & "# AND #" & _
                   Format(dtFin, "mm/dd/yyyy") & "#"
    End If

    ' Finaliser la requête
    strSQL = strSQL & strWhere & " ORDER BY Nom, Prenom"

    ' Afficher pour déboguer
    Debug.Print "=== REQUÊTE GÉNÉRÉE ==="
    Debug.Print strSQL
    Debug.Print "======================="

    ' Exécuter (ici on ouvre un Recordset pour lecture)
    Dim rs As DAO.Recordset
    Set rs = CurrentDb.OpenRecordset(strSQL, dbOpenSnapshot)

    Debug.Print "Nombre de résultats : " & rs.RecordCount

    rs.Close
    Set rs = Nothing

End Sub`,
          },
          {
            title: '🔒 Sécurité : Injection SQL',
            type: 'text',
            content: `**L'injection SQL** est une attaque où un utilisateur malveillant insère du code SQL dans vos variables.

### Exemple d'attaque :

Si l'utilisateur tape dans une zone de texte :
\`\`\`
' OR '1'='1
\`\`\`

Et que votre code est :
\`\`\`vba
strSQL = "SELECT * FROM Users WHERE Login = '" & Me.txtLogin & "'"
\`\`\`

Vous obtenez :
\`\`\`sql
SELECT * FROM Users WHERE Login = '' OR '1'='1'
\`\`\`

**Résultat :** Cette requête retourne TOUS les utilisateurs (car 1=1 est toujours vrai) !

### 🛡️ Protection :

✅ **Échapper les apostrophes :**
\`\`\`vba
strNom = Replace(Me.txtNom, "'", "''")
\`\`\`

✅ **Valider les entrées :**
\`\`\`vba
If InStr(Me.txtLogin, "'") > 0 Or InStr(Me.txtLogin, "--") > 0 Then
    MsgBox "Caractères interdits !", vbCritical
    Exit Sub
End If
\`\`\`

✅ **Utiliser des requêtes paramétrées (QueryDef) :** (méthode la plus sûre)`,
          },
          {
            title: '💻 Requêtes paramétrées (QueryDef)',
            type: 'code',
            content: `Sub RequeteParametreeSure()
    Dim db As DAO.Database
    Dim qdf As DAO.QueryDef
    Dim rs As DAO.Recordset
    Dim strLogin As String

    ' Entrée utilisateur (même malveillante)
    strLogin = "' OR '1'='1"  ' Tentative d'injection

    Set db = CurrentDb

    ' ─── Méthode 1 : QueryDef temporaire ───
    Set qdf = db.CreateQueryDef("")
    qdf.SQL = "PARAMETERS pLogin Text(255); " & _
              "SELECT * FROM tblUsers WHERE Login = [pLogin]"

    ' Affecter la valeur au paramètre (100% sûr, pas d'injection possible)
    qdf.Parameters("pLogin").Value = strLogin

    Set rs = qdf.OpenRecordset(dbOpenSnapshot)

    If rs.EOF And rs.BOF Then
        Debug.Print "✅ Aucun utilisateur trouvé (tentative d'injection bloquée)"
    Else
        Debug.Print "Utilisateur : " & rs!Login
    End If

    rs.Close
    Set rs = Nothing
    Set qdf = Nothing
    Set db = Nothing

End Sub

' ─── Méthode 2 : QueryDef enregistrée (réutilisable) ───
Sub CreerRequeteParametree()
    Dim db As DAO.Database
    Dim qdf As DAO.QueryDef

    Set db = CurrentDb

    ' Supprimer si existe
    On Error Resume Next
    db.QueryDefs.Delete "qryRechercheClient"
    On Error GoTo 0

    ' Créer la requête avec paramètre
    Set qdf = db.CreateQueryDef("qryRechercheClient")
    qdf.SQL = "PARAMETERS pNom Text(100); " & _
              "SELECT * FROM tblClients WHERE Nom LIKE [pNom] & '*'"

    Debug.Print "✅ Requête paramétrée créée : qryRechercheClient"

    Set qdf = Nothing
    Set db = Nothing
End Sub

Sub UtiliserRequeteParametree()
    Dim db As DAO.Database
    Dim qdf As DAO.QueryDef
    Dim rs As DAO.Recordset

    Set db = CurrentDb
    Set qdf = db.QueryDefs("qryRechercheClient")

    ' Passer la valeur du paramètre
    qdf.Parameters("pNom").Value = "Dup"

    Set rs = qdf.OpenRecordset()

    ' Afficher les résultats
    Do While Not rs.EOF
        Debug.Print rs!Nom & " " & rs!Prenom
        rs.MoveNext
    Loop

    rs.Close
    Set rs = Nothing
    Set qdf = Nothing
    Set db = Nothing
End Sub`,
          },
        ],
      },
      {
        // Leçon 8
        order: 8,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `La gestion des erreurs et le débogage sont essentiels pour créer des applications robustes. Vous apprendrez :
- La structure On Error GoTo
- L'objet Err et ses propriétés
- Les outils de débogage de VBE (F8, points d'arrêt, espions)
- Les bonnes pratiques pour gérer les erreurs élégamment

**Durée estimée :** 90 minutes • **Niveau :** Intermédiaire-Avancé`,
          },
          {
            title: '⚠️ Pourquoi gérer les erreurs ?',
            type: 'text',
            content: `**Sans gestion d'erreurs :**
- L'utilisateur voit des messages techniques incompréhensibles
- L'application se bloque brutalement
- Les ressources ne sont pas libérées (Recordsets ouverts, connexions...)
- Perte de données en cours de traitement

**Avec gestion d'erreurs :**
- ✅ Messages clairs pour l'utilisateur
- ✅ Journalisation des problèmes techniques
- ✅ Nettoyage des ressources garanti
- ✅ Application professionnelle et fiable

**💡 Règle :** Tout code en production DOIT avoir une gestion d'erreurs.`,
          },
          {
            title: '🛡️ La structure On Error GoTo',
            type: 'text',
            content: `VBA propose plusieurs modes de gestion d'erreurs :

### 1. On Error GoTo Étiquette
Redirige vers une section de code spécifique en cas d'erreur.
\`\`\`vba
On Error GoTo GestionErreur
' ... code ...
Exit Sub
GestionErreur:
' Code de gestion
\`\`\`

### 2. On Error Resume Next
**Ignore** l'erreur et continue à la ligne suivante.
⚠️ **DANGEREUX** : À utiliser avec précaution !
\`\`\`vba
On Error Resume Next
' Code qui peut échouer
On Error GoTo 0  ' Réactiver les erreurs
\`\`\`

### 3. On Error GoTo 0
Désactive la gestion d'erreurs (mode par défaut).

**🎯 Recommandation :** Utilisez \`On Error GoTo\` pour un contrôle total.`,
          },
          {
            title: '💻 Exemple de gestion d\'erreur complète',
            type: 'code',
            content: `Sub ExempleGestionErreurComplete()
    ' 1. Activer la gestion d'erreurs DÈS LE DÉBUT
    On Error GoTo GestionErreur

    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim lngResultat As Long

    ' 2. Code normal
    Set db = CurrentDb
    Set rs = db.OpenRecordset("tblClients", dbOpenDynaset)

    ' Simulation d'une erreur : division par zéro
    lngResultat = 100 / 0  ' ❌ ERREUR 11

    ' Ce code ne sera JAMAIS exécuté si erreur ci-dessus
    rs.Close

' 3. Sortie normale (avant la section d'erreur)
SortieNormale:
    ' Nettoyage des ressources
    On Error Resume Next  ' Ignorer les erreurs de nettoyage
    If Not rs Is Nothing Then
        If Not rs.EOF Then rs.Close
        Set rs = Nothing
    End If
    Set db = Nothing
    On Error GoTo 0

    Debug.Print "✅ Procédure terminée"
    Exit Sub  ' ← CRUCIAL pour ne pas entrer dans GestionErreur

' 4. Section de gestion d'erreurs
GestionErreur:
    ' Afficher un message utilisateur convivial
    MsgBox "❌ Une erreur s'est produite :" & vbCrLf & vbCrLf & _
           "Erreur n° : " & Err.Number & vbCrLf & _
           "Description : " & Err.Description & vbCrLf & vbCrLf & _
           "Veuillez contacter le support.", _
           vbCritical, "Erreur Application"

    ' Journaliser l'erreur (dans une table de logs)
    JournaliserErreur "ExempleGestionErreurComplete", Err.Number, Err.Description

    ' Retourner au nettoyage
    Resume SortieNormale

End Sub

' ─── Fonction utilitaire de journalisation ───
Sub JournaliserErreur(strProcedure As String, lngNumErreur As Long, strDescription As String)
    On Error Resume Next  ' Ne pas créer d'erreur dans la gestion d'erreur !

    Dim strSQL As String
    strSQL = "INSERT INTO tblLogsErreurs (DateHeure, Procedure, NumErreur, Description, Utilisateur) " & _
             "VALUES (Now(), '" & strProcedure & "', " & lngNumErreur & ", " & _
             "'" & Replace(strDescription, "'", "''") & "', '" & Environ("USERNAME") & "')"

    CurrentDb.Execute strSQL

    Debug.Print "📝 Erreur journalisée : " & strProcedure
End Sub`,
          },
          {
            title: '🔍 L\'objet Err',
            type: 'text',
            content: `L'objet **Err** contient les informations sur la dernière erreur survenue.

### Propriétés essentielles :

| Propriété | Type | Description | Exemple |
|-----------|------|-------------|---------|
| **Number** | Long | Numéro de l'erreur | \`11\` |
| **Description** | String | Message d'erreur | \`"Division par zéro"\` |
| **Source** | String | Objet ayant causé l'erreur | \`"DAO.Recordset"\` |
| **HelpFile** | String | Fichier d'aide associé | (rarement utilisé) |
| **HelpContext** | Long | ID du sujet d'aide | (rarement utilisé) |

### Méthodes :

| Méthode | Description |
|---------|-------------|
| **Clear** | Efface l'erreur actuelle |
| **Raise** | Génère une erreur personnalisée |

**💡 Astuce :** \`Err.Number = 0\` signifie "pas d'erreur".`,
          },
          {
            title: '💻 Gérer différents types d\'erreurs',
            type: 'code',
            content: `Sub GererErreursSpecifiques()
    On Error GoTo GestionErreur

    Dim db As DAO.Database
    Dim rs As DAO.Recordset

    Set db = CurrentDb
    Set rs = db.OpenRecordset("tblProduits", dbOpenDynaset)

    If rs.EOF And rs.BOF Then
        ' Générer une erreur personnalisée
        Err.Raise vbObjectError + 1000, "GererErreursSpecifiques", _
                  "La table tblProduits est vide !"
    End If

    ' Code normal...

    GoTo Nettoyage

GestionErreur:
    ' Gérer chaque erreur différemment
    Select Case Err.Number

        Case 3011  ' Objet inexistant (table/requête)
            MsgBox "❌ La table 'tblProduits' n'existe pas !" & vbCrLf & _
                   "Veuillez restaurer la base de données.", _
                   vbCritical, "Table manquante"

        Case 3021  ' Pas d'enregistrement actuel
            MsgBox "⚠️ Aucun produit sélectionné.", vbExclamation
            Resume Next  ' Continue à la ligne suivante

        Case 3704  ' L'opération n'est pas autorisée si l'objet est fermé
            MsgBox "❌ Erreur technique : Objet fermé." & vbCrLf & _
                   "Redémarrez l'application.", vbCritical
            Resume Nettoyage

        Case Is >= vbObjectError  ' Erreurs personnalisées (>= 513)
            MsgBox "⚠️ " & Err.Description, vbExclamation, "Avertissement"
            Resume Nettoyage

        Case Else  ' Toutes les autres erreurs
            MsgBox "❌ Erreur inattendue :" & vbCrLf & vbCrLf & _
                   "N° : " & Err.Number & vbCrLf & _
                   "Description : " & Err.Description, _
                   vbCritical, "Erreur système"
            Resume Nettoyage

    End Select

Nettoyage:
    On Error Resume Next
    If Not rs Is Nothing Then
        rs.Close
        Set rs = Nothing
    End If
    Set db = Nothing
    On Error GoTo 0
End Sub`,
          },
          {
            title: '🐛 Outils de débogage VBE',
            type: 'text',
            content: `VBE offre des outils puissants pour traquer les bugs :

### 1. Pas-à-Pas Détaillé (F8) 🌟
- **L'outil le plus important**
- Exécute le code ligne par ligne
- Survolez une variable avec la souris pour voir sa valeur
- Permet de voir exactement où le problème se produit

### 2. Points d'Arrêt (F9)
- Cliquez dans la marge gauche (rond bordeaux apparaît)
- L'exécution se met en pause AVANT cette ligne
- Utile pour sauter les parties OK et déboguer la zone problématique

### 3. Fenêtre Variables Locales (Affichage > Fenêtre Variables Locales)
- Affiche toutes les variables de la procédure actuelle
- Se met à jour automatiquement en pas-à-pas
- Permet de voir les objets complexes (Recordsets, Collections)

### 4. Fenêtre Espions (Affichage > Fenêtre Espions)
- Surveiller des variables/expressions spécifiques
- Clic droit > Ajouter un espion
- Peut arrêter l'exécution quand une valeur change

### 5. Fenêtre Exécution (Ctrl+G)
- Taper des commandes pendant le débogage
- Exemple : \`?rs.RecordCount\` pour afficher la valeur
- \`Debug.Print\` affiche ici`,
          },
          {
            title: '💻 Utiliser Debug.Print et Debug.Assert',
            type: 'code',
            content: `Sub ExemplesOutils Debogage()
    Dim i As Integer
    Dim strNom As String
    Dim rs As Object

    ' ─── 1. Debug.Print : Afficher dans la fenêtre Exécution ───
    Debug.Print "=== Début du traitement ==="
    Debug.Print "Utilisateur : " & Environ("USERNAME")
    Debug.Print "Date : " & Now

    For i = 1 To 5
        strNom = "Client" & i
        Debug.Print "Traitement de " & strNom  ' Suivre la progression
    Next i

    ' ─── 2. Debug.Assert : Vérifier une condition ───
    ' Si la condition est FAUSSE, le code s'arrête sur cette ligne
    Dim lngTotal As Long
    lngTotal = 100

    Debug.Assert lngTotal > 0  ' ✅ OK, continue
    Debug.Assert lngTotal < 50  ' ❌ S'arrête ici car FAUX

    ' ─── 3. Stop : Point d'arrêt programmatique ───
    If i > 3 Then
        Stop  ' Équivalent à un point d'arrêt F9, mais dans le code
    End If

    Debug.Print "=== Fin du traitement ==="

End Sub

' ─── Fonction utilitaire : Tracer l'exécution ───
Sub TracerExecution(strMessage As String)
    ' Utile pour déboguer les boucles ou code complexe
    Debug.Print Format(Now, "hh:nn:ss") & " | " & strMessage
End Sub

Sub ExempleTrace()
    TracerExecution "Début de ExempleTrace"

    Dim i As Integer
    For i = 1 To 1000
        If i Mod 100 = 0 Then  ' Tous les 100 tours
            TracerExecution "Progression : " & i & "/1000"
        End If
    Next i

    TracerExecution "Fin de ExempleTrace"
End Sub`,
          },
          {
            title: '🎯 Bonnes pratiques de gestion d\'erreurs',
            type: 'text',
            content: `### ✅ À FAIRE :

1. **Toujours inclure On Error dans le code de production**
\`\`\`vba
On Error GoTo GestionErreur
\`\`\`

2. **Toujours libérer les ressources dans le nettoyage**
\`\`\`vba
Nettoyage:
    On Error Resume Next
    If Not rs Is Nothing Then rs.Close: Set rs = Nothing
\`\`\`

3. **Journaliser les erreurs dans une table**
- Permet de détecter les problèmes en production
- Aide au support utilisateur

4. **Messages utilisateur clairs**
- ❌ "Erreur 3021"
- ✅ "Veuillez sélectionner un client dans la liste"

5. **Utiliser Resume avec parcimonie**
- \`Resume Next\` : Continue après l'erreur
- \`Resume\` : Réessaie la ligne qui a échoué
- \`Resume Nettoyage\` : Va au nettoyage

### ❌ À ÉVITER :

1. **On Error Resume Next sans On Error GoTo 0 après**
\`\`\`vba
' ❌ DANGER : masque toutes les erreurs !
On Error Resume Next
' ... 1000 lignes de code ...
\`\`\`

2. **Laisser l'utilisateur voir les erreurs techniques**
3. **Oublier Exit Sub avant la section GestionErreur**
4. **Ne pas nettoyer les ressources en cas d'erreur**`,
          },
        ],
      },
      {
        // Leçon 9
        order: 9,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `VBA Access peut contrôler d'autres applications Office (Excel, Word, Outlook). Vous apprendrez :
- Le Late Binding vs Early Binding
- Automatiser Excel (exporter des données, créer des graphiques)
- Générer des documents Word (lettres, rapports)
- Envoyer des emails via Outlook
- Les bonnes pratiques d'automation

**Durée estimée :** 120 minutes • **Niveau :** Avancé`,
          },
          {
            title: '🔗 Late Binding vs Early Binding',
            type: 'text',
            content: `Il existe deux méthodes pour interagir avec d'autres applications Office :

### Early Binding (Liaison précoce)
\`\`\`vba
' Nécessite d'ajouter une référence (Outils > Références > Microsoft Excel XX.0)
Dim appExcel As Excel.Application
Set appExcel = New Excel.Application
\`\`\`

**Avantages :** IntelliSense, plus rapide
**Inconvénients :** Problèmes de compatibilité entre versions Office

### Late Binding (Liaison différée) ✅ RECOMMANDÉ
\`\`\`vba
' Pas de référence nécessaire
Dim appExcel As Object
Set appExcel = CreateObject("Excel.Application")
\`\`\`

**Avantages :** Fonctionne sur toutes les versions, portable
**Inconvénients :** Pas d'IntelliSense, légèrement plus lent

**🎯 Best Practice :** Utilisez Late Binding pour distribuer votre application.`,
          },
          {
            title: '📊 Automatisation Excel : Export simple',
            type: 'code',
            content: `Sub ExporterVersExcel_Simple()
    On Error GoTo GestionErreur

    Dim appExcel As Object
    Dim wb As Object
    Dim ws As Object
    Dim rs As DAO.Recordset
    Dim strFichier As String

    ' 1. Créer une instance d'Excel (cachée)
    Set appExcel = CreateObject("Excel.Application")
    appExcel.Visible = False  ' Travailler en arrière-plan

    ' 2. Créer un nouveau classeur
    Set wb = appExcel.Workbooks.Add
    Set ws = wb.Worksheets(1)
    ws.Name = "Clients Export"

    ' 3. Ouvrir les données Access
    Set rs = CurrentDb.OpenRecordset("SELECT Nom, Prenom, Email, Ville, CA FROM tblClients ORDER BY Nom")

    ' 4. Écrire les en-têtes
    ws.Cells(1, 1).Value = "Nom"
    ws.Cells(1, 2).Value = "Prénom"
    ws.Cells(1, 3).Value = "Email"
    ws.Cells(1, 4).Value = "Ville"
    ws.Cells(1, 5).Value = "CA (€)"

    ' Formater les en-têtes
    With ws.Range("A1:E1")
        .Font.Bold = True
        .Interior.Color = RGB(0, 112, 192)  ' Bleu
        .Font.Color = RGB(255, 255, 255)    ' Blanc
        .HorizontalAlignment = -4108        ' xlCenter
    End With

    ' 5. Transférer les données (méthode ultra-rapide)
    If Not (rs.EOF And rs.BOF) Then
        ws.Range("A2").CopyFromRecordset rs
    End If

    ' 6. Formater les colonnes
    ws.Columns("A:D").AutoFit  ' Ajuster la largeur
    ws.Columns("E").NumberFormat = "#,##0.00 €"  ' Format monétaire

    ' 7. Ajouter des bordures
    Dim lngDerniereLigne As Long
    lngDerniereLigne = ws.Cells(ws.Rows.Count, 1).End(-4162).Row  ' xlUp = -4162
    ws.Range("A1:E" & lngDerniereLigne).Borders.LineStyle = 1  ' xlContinuous

    ' 8. Enregistrer et ouvrir
    strFichier = "C:\Temp\Export_Clients_" & Format(Now, "yyyymmdd_hhnnss") & ".xlsx"
    wb.SaveAs strFichier, 51  ' xlOpenXMLWorkbook = 51

    appExcel.Visible = True  ' Montrer Excel à l'utilisateur

    MsgBox "✅ Export réussi !" & vbCrLf & vbCrLf & strFichier, vbInformation

    ' Nettoyage (ne pas fermer Excel car visible)
    rs.Close
    Set rs = Nothing
    Set ws = Nothing
    Set wb = Nothing
    Set appExcel = Nothing

    Exit Sub

GestionErreur:
    MsgBox "❌ Erreur lors de l'export Excel :" & vbCrLf & Err.Description, vbCritical
    On Error Resume Next
    If Not rs Is Nothing Then rs.Close
    If Not appExcel Is Nothing Then appExcel.Quit
End Sub`,
          },
          {
            title: '📈 Automatisation Excel : Graphique',
            type: 'code',
            content: `Sub CreerGraphiqueExcel()
    On Error GoTo GestionErreur

    Dim appExcel As Object
    Dim wb As Object
    Dim ws As Object
    Dim chartObj As Object
    Dim rs As DAO.Recordset
    Dim i As Long

    Set appExcel = CreateObject("Excel.Application")
    appExcel.Visible = False

    Set wb = appExcel.Workbooks.Add
    Set ws = wb.Worksheets(1)
    ws.Name = "Ventes par Mois"

    ' Données : Ventes mensuelles
    Set rs = CurrentDb.OpenRecordset(_
        "SELECT Format(DateVente, 'yyyy-mm') AS Mois, Sum(Montant) AS Total " & _
        "FROM tblVentes GROUP BY Format(DateVente, 'yyyy-mm') ORDER BY Mois", _
        dbOpenSnapshot)

    ' En-têtes
    ws.Cells(1, 1).Value = "Mois"
    ws.Cells(1, 2).Value = "Ventes (€)"

    ' Données
    i = 2
    Do While Not rs.EOF
        ws.Cells(i, 1).Value = rs!Mois
        ws.Cells(i, 2).Value = rs!Total
        i = i + 1
        rs.MoveNext
    Loop
    rs.Close

    lngDerniereLigne = i - 1

    ' Créer un graphique (histogramme)
    Set chartObj = ws.ChartObjects.Add(300, 20, 400, 250)

    With chartObj.Chart
        .SetSourceData ws.Range("A1:B" & lngDerniereLigne)
        .ChartType = 51  ' xlColumnClustered (histogramme groupé)
        .HasTitle = True
        .ChartTitle.Text = "Évolution des Ventes Mensuelles"

        ' Personnaliser
        .ChartArea.Fill.ForeColor.RGB = RGB(255, 255, 255)  ' Fond blanc
        .PlotArea.Fill.ForeColor.RGB = RGB(240, 248, 255)   ' Fond bleu clair

        ' Légende
        .HasLegend = True
        .Legend.Position = -4107  ' xlLegendPositionBottom
    End With

    ' Sauvegarder
    wb.SaveAs "C:\Temp\Graphique_Ventes.xlsx", 51
    appExcel.Visible = True

    MsgBox "✅ Graphique Excel créé avec succès !", vbInformation

    Set rs = Nothing
    Set chartObj = Nothing
    Set ws = Nothing
    Set wb = Nothing
    Set appExcel = Nothing

    Exit Sub

GestionErreur:
    MsgBox "❌ Erreur : " & Err.Description, vbCritical
    On Error Resume Next
    If Not rs Is Nothing Then rs.Close
    If Not appExcel Is Nothing Then appExcel.Quit
End Sub`,
          },
          {
            title: '📄 Automatisation Word : Génération de lettres',
            type: 'code',
            content: `Sub GenererLettreWord()
    On Error GoTo GestionErreur

    Dim appWord As Object
    Dim doc As Object
    Dim rs As DAO.Recordset
    Dim strNom As String, strPrenom As String, strAdresse As String

    ' Récupérer les infos du client
    Set rs = CurrentDb.OpenRecordset(_
        "SELECT Nom, Prenom, Adresse, Ville, CP FROM tblClients WHERE ID = " & Forms!frmClients!ID)

    If rs.EOF And rs.BOF Then
        MsgBox "❌ Client introuvable !", vbCritical
        Exit Sub
    End If

    strNom = rs!Nom
    strPrenom = rs!Prenom
    strAdresse = rs!Adresse & vbCrLf & rs!CP & " " & rs!Ville
    rs.Close

    ' Créer Word
    Set appWord = CreateObject("Word.Application")
    appWord.Visible = True

    Set doc = appWord.Documents.Add

    ' Écrire le contenu
    With doc.Content
        ' En-tête (aligné à droite)
        .InsertAfter "El Sayf Formation" & vbCrLf
        .InsertAfter "123 Rue de l'Exemple" & vbCrLf
        .InsertAfter "75001 Paris" & vbCrLf & vbCrLf & vbCrLf

        ' Destinataire
        .InsertAfter strPrenom & " " & strNom & vbCrLf
        .InsertAfter strAdresse & vbCrLf & vbCrLf & vbCrLf

        ' Date
        .InsertAfter "Paris, le " & Format(Date, "dd mmmm yyyy") & vbCrLf & vbCrLf

        ' Objet
        .Font.Bold = True
        .InsertAfter "Objet : Confirmation d'inscription" & vbCrLf & vbCrLf
        .Font.Bold = False

        ' Corps
        .InsertAfter "Madame, Monsieur," & vbCrLf & vbCrLf
        .InsertAfter "Nous vous confirmons votre inscription à notre formation VBA Access." & vbCrLf & vbCrLf
        .InsertAfter "Vous recevrez prochainement vos identifiants de connexion." & vbCrLf & vbCrLf
        .InsertAfter "Cordialement," & vbCrLf & vbCrLf
        .InsertAfter "L'équipe El Sayf Formation"
    End With

    ' Formater
    doc.Range(0, 0).Select  ' Début du document
    appWord.Selection.Font.Name = "Arial"
    appWord.Selection.Font.Size = 11

    MsgBox "✅ Lettre générée avec succès !", vbInformation

    ' Ne pas fermer Word (laissé ouvert pour l'utilisateur)
    Set doc = Nothing
    Set appWord = Nothing

    Exit Sub

GestionErreur:
    MsgBox "❌ Erreur Word : " & Err.Description, vbCritical
    On Error Resume Next
    If Not rs Is Nothing Then rs.Close
    If Not appWord Is Nothing Then appWord.Quit
End Sub`,
          },
          {
            title: '📧 Automatisation Outlook : Envoi d\'email',
            type: 'code',
            content: `Sub EnvoyerEmailOutlook()
    On Error GoTo GestionErreur

    Dim appOutlook As Object
    Dim mailItem As Object

    ' Créer l'instance Outlook
    Set appOutlook = CreateObject("Outlook.Application")

    ' Créer un nouveau mail
    Set mailItem = appOutlook.CreateItem(0)  ' olMailItem = 0

    With mailItem
        ' Destinataires
        .To = "client@example.com"
        .CC = "support@elsayf.com"
        .BCC = ""  ' Copie cachée

        ' Sujet
        .Subject = "Confirmation de votre commande #12345"

        ' Corps (peut être en HTML)
        .HTMLBody = "<html><body>" & _
                    "<h2>Bonjour,</h2>" & _
                    "<p>Nous vous confirmons la réception de votre commande.</p>" & _
                    "<p><strong>Référence :</strong> CMD-12345</p>" & _
                    "<p>Merci de votre confiance !</p>" & _
                    "<hr>" & _
                    "<p><em>El Sayf Formation</em></p>" & _
                    "</body></html>"

        ' Pièce jointe (optionnel)
        .Attachments.Add "C:\Factures\Facture_12345.pdf"

        ' Importance
        .Importance = 2  ' 0=Basse, 1=Normale, 2=Haute

        ' Envoi automatique
        .Send  ' Envoie immédiatement

        ' OU afficher pour relecture avant envoi
        ' .Display  ' Ouvre la fenêtre de composition
    End With

    MsgBox "✅ Email envoyé avec succès !", vbInformation

    Set mailItem = Nothing
    Set appOutlook = Nothing

    Exit Sub

GestionErreur:
    MsgBox "❌ Erreur Outlook : " & Err.Description & vbCrLf & vbCrLf & _
           "Assurez-vous qu'Outlook est installé et configuré.", vbCritical
End Sub

' ─── Envoi en masse ───
Sub EnvoyerEmailsMasse()
    Dim appOutlook As Object
    Dim mailItem As Object
    Dim rs As DAO.Recordset
    Dim intCompteur As Integer

    Set appOutlook = CreateObject("Outlook.Application")

    Set rs = CurrentDb.OpenRecordset(_
        "SELECT Nom, Prenom, Email FROM tblClients WHERE Newsletter = True")

    intCompteur = 0

    Do While Not rs.EOF
        Set mailItem = appOutlook.CreateItem(0)

        With mailItem
            .To = rs!Email
            .Subject = "Newsletter El Sayf - Mars 2026"
            .HTMLBody = "<h3>Bonjour " & rs!Prenom & ",</h3>" & _
                        "<p>Découvrez notre nouveau cours VBA Access !</p>"
            .Send
        End With

        intCompteur = intCompteur + 1

        ' Pause toutes les 10 emails (éviter le spam)
        If intCompteur Mod 10 = 0 Then
            Application.Wait Now + TimeValue("00:00:02")  ' Pause 2 sec
        End If

        rs.MoveNext
    Loop

    rs.Close

    MsgBox "✅ " & intCompteur & " email(s) envoyé(s) !", vbInformation

    Set rs = Nothing
    Set mailItem = Nothing
    Set appOutlook = Nothing
End Sub`,
          },
          {
            title: '🎯 Bonnes pratiques d\'automation',
            type: 'text',
            content: `### ✅ À FAIRE :

1. **Utilisez Late Binding pour la compatibilité**
\`\`\`vba
Dim app As Object  ' Pas Excel.Application
Set app = CreateObject("Excel.Application")
\`\`\`

2. **Gérez les erreurs (l'application peut ne pas être installée)**
\`\`\`vba
On Error Resume Next
Set app = CreateObject("Excel.Application")
If app Is Nothing Then
    MsgBox "Excel n'est pas installé !", vbCritical
    Exit Sub
End If
On Error GoTo 0
\`\`\`

3. **Libérez TOUJOURS les objets**
\`\`\`vba
Set ws = Nothing
Set wb = Nothing
Set app = Nothing
\`\`\`

4. **Fermez l'application si vous l'avez créée**
\`\`\`vba
If blnNouvelleInstance Then app.Quit
\`\`\`

5. **Affichez une barre de progression pour les longs traitements**

### ❌ À ÉVITER :

1. Laisser des instances d'applications ouvertes en arrière-plan
2. Ne pas gérer les erreurs (crash si Office pas installé)
3. Oublier de Set = Nothing (fuite mémoire)
4. Utiliser Early Binding sans vérifier la compatibilité`,
          },
        ],
      },
      {
        // Leçon 10
        order: 10,
        blocks: [
          {
            title: '🎯 Objectifs de cette leçon',
            type: 'text',
            content: `Votre application est prête, il faut maintenant la sécuriser et la distribuer. Vous apprendrez :
- Verrouiller le code VBA avec un mot de passe
- Masquer l'interface Access (ruban, volet de navigation)
- Compiler et générer un fichier ACCDE
- Créer un programme d'installation
- Optimiser les performances

**Durée estimée :** 60 minutes • **Niveau :** Avancé`,
          },
          {
            title: '🔐 Verrouiller le projet VBA',
            type: 'text',
            content: `**Pourquoi protéger votre code ?**
- Éviter les modifications accidentelles par les utilisateurs
- Protéger votre propriété intellectuelle
- Empêcher la lecture de mots de passe ou clés API en clair

### Étapes pour verrouiller :

1. Ouvrez l'éditeur VBA (**Alt + F11**)
2. Menu **Outils** > **Propriétés de [NomProjet]...**
3. Onglet **Protection**
4. ✅ Cochez **"Verrouiller le projet pour l'affichage"**
5. Entrez un **mot de passe** (deux fois)
6. Cliquez **OK**

**⚠️ IMPORTANT :**
- Enregistrez et fermez Access
- Rouvrez la base : le code est maintenant protégé
- **Ne perdez PAS le mot de passe** (impossible à récupérer !)
- Conservez une version déverrouillée pour vous

**💡 Astuce :** Utilisez un gestionnaire de mots de passe pour le stocker en sécurité.`,
          },
          {
            title: '🎨 Masquer l\'interface Access',
            type: 'text',
            content: `Pour une application professionnelle, l'utilisateur ne doit pas voir :
- Le ruban Access
- Le volet de navigation (tables, requêtes)
- Les menus contextuels
- Les touches spéciales (F11, Ctrl+G, etc.)

### Configuration dans les options :

1. **Fichier** > **Options** > **Base de données active**

2. **Formulaire d'affichage :** Sélectionnez votre menu principal (ex: \`frmMenuPrincipal\`)

3. **Volet de navigation :** ❌ Décochez "Afficher le volet de navigation"

4. **Barre de menus Ruban :** Sélectionnez "(aucun)" ou créez un ruban personnalisé

5. **Décochez** :
   - Autoriser les menus par défaut
   - Autoriser les menus contextuels par défaut
   - Autoriser les touches de raccourci par défaut

6. Cliquez **OK** et **redémarrez Access**

**⚠️ Astuce de contournement (pour vous) :** Maintenez **Shift** pendant l'ouverture pour bypasser ces restrictions.`,
          },
          {
            title: '💻 Masquer l\'interface par code',
            type: 'code',
            content: `' ─── Dans le Form_Load de votre formulaire de démarrage ───
Private Sub Form_Load()
    On Error Resume Next

    ' 1. Masquer le ruban
    DoCmd.ShowToolbar "Ribbon", acToolbarNo

    ' 2. Masquer le volet de navigation
    DoCmd.NavigateTo acNavigationCategoryObjectType

    ' Access 2010+ :
    DoCmd.SetProperty "NavigationPane", acProperty, "Visible", False

    ' 3. Désactiver les clics droits sur le formulaire
    Me.ShortcutMenu = False

    ' 4. Définir le titre de l'application
    Application.AppTitle = "El Sayf CRM - Version 1.0"

    ' 5. Masquer la fenêtre de base de données
    Application.SetOption "Show Hidden Objects", False

End Sub

' ─── Créer un bouton "Mode Admin" avec mot de passe ───
Private Sub btnModeAdmin_Click()
    Dim strMotDePasse As String

    strMotDePasse = InputBox("Entrez le mot de passe administrateur :", "Accès Admin")

    If strMotDePasse = "AdminVBA2026!" Then
        ' Afficher le volet de navigation
        DoCmd.SelectObject acTable, , True  ' True = dans le volet
        DoCmd.ShowToolbar "Ribbon", acToolbarYes

        MsgBox "✅ Mode administrateur activé", vbInformation
    Else
        MsgBox "❌ Mot de passe incorrect !", vbCritical
    End If
End Sub

' ─── Empêcher la fermeture du formulaire principal ───
Private Sub Form_Close()
    Dim intReponse As Integer

    intReponse = MsgBox("Voulez-vous vraiment quitter l'application ?", _
                        vbQuestion + vbYesNo, "Fermeture")

    If intReponse = vbNo Then
        Cancel = True  ' Annule la fermeture
    Else
        ' Fermer proprement l'application
        DoCmd.Quit acQuitSaveAll
    End If
End Sub`,
          },
          {
            title: '📦 Compiler le code VBA',
            type: 'text',
            content: `Avant de distribuer, vous **DEVEZ** compiler votre code.

### Pourquoi compiler ?

✅ **Détecte les erreurs** de syntaxe dans tout le code (même non exécuté)
✅ **Optimise les performances** (p-code plus rapide)
✅ **Réduit la taille** de la base de données
✅ **Évite les surprises** chez l'utilisateur final

### Étapes :

1. Ouvrez VBE (**Alt + F11**)
2. Menu **Débogage** > **Compiler [NomProjet]**
3. Si erreurs : elles sont surlignées → corrigez-les
4. Répétez jusqu'à ce que "Compiler" soit grisé (= tout est OK)

**💡 Astuce :** Compilez régulièrement pendant le développement, pas seulement à la fin !`,
          },
          {
            title: '🔒 Créer un fichier ACCDE',
            type: 'text',
            content: `Le format **ACCDE** est la version "exécutable" de votre base de données.

### Qu'est-ce qu'un ACCDE ?

- Fichier Access **sans code source visible**
- Le code VBA est compilé en p-code binaire
- **Impossible** de modifier les formulaires, états ou modules
- Les tables et données restent accessibles

**Avantages :**
✅ Protection totale du code
✅ Performances légèrement meilleures
✅ Taille réduite

**Inconvénients :**
❌ Vous ne pouvez plus modifier le design
❌ Conservez toujours la version .accdb originale !

### Étapes de création :

1. **Avant tout :** Compactez et réparez
   - **Fichier** > **Informations** > **Compacter et réparer**

2. **Compilez le code** (voir section précédente)

3. **Créez le ACCDE :**
   - **Fichier** > **Enregistrer sous**
   - **Type de fichier** : \`Créer un fichier ACCDE\`
   - Choisissez l'emplacement
   - Cliquez **Enregistrer**

4. **Testez** le fichier .accde généré

**⚠️ CRUCIAL :** Gardez TOUJOURS la version .accdb pour les futures modifications !`,
          },
          {
            title: '⚙️ Optimiser les performances',
            type: 'code',
            content: `' ─── 1. Désactiver l'affichage pendant les traitements longs ───
Sub TraitementOptimise()
    ' Fige l'écran (évite les scintillements)
    Application.Echo False
    DoCmd.Hourglass True

    ' ... Votre code ici ...

    ' Réactiver l'affichage
    DoCmd.Hourglass False
    Application.Echo True
End Sub

' ─── 2. Compacter la base régulièrement ───
Sub CompacterBaseDeDonnees()
    ' Compacter = défragmenter + réduire la taille
    Dim strCheminBD As String

    strCheminBD = Application.CurrentProject.Path & "\" & _
                  Application.CurrentProject.Name

    ' Fermer tous les formulaires
    DoCmd.Close acForm, "", acSaveNo

    ' Compacter
    DBEngine.CompactDatabase strCheminBD, strCheminBD & ".tmp"

    ' Remplacer l'ancienne par la nouvelle
    Kill strCheminBD
    Name strCheminBD & ".tmp" As strCheminBD

    MsgBox "✅ Base de données compactée !", vbInformation

    ' Rouvrir
    Application.Quit acQuitSaveAll
End Sub

' ─── 3. Créer des index sur les champs fréquemment recherchés ───
Sub CreerIndex()
    Dim db As DAO.Database
    Dim tdf As DAO.TableDef
    Dim idx As DAO.Index
    Dim fld As DAO.Field

    Set db = CurrentDb
    Set tdf = db.TableDefs("tblClients")

    ' Vérifier si l'index existe
    On Error Resume Next
    tdf.Indexes.Delete "idxNom"
    On Error GoTo 0

    ' Créer un index sur le champ Nom
    Set idx = tdf.CreateIndex("idxNom")
    Set fld = idx.CreateField("Nom")
    idx.Fields.Append fld
    tdf.Indexes.Append idx

    Debug.Print "✅ Index créé sur tblClients.Nom"

    Set fld = Nothing
    Set idx = Nothing
    Set tdf = Nothing
    Set db = Nothing
End Sub

' ─── 4. Utiliser des requêtes enregistrées plutôt que SQL dynamique ───
' Les QueryDefs sont pré-compilées = plus rapides

Sub UtiliserQueryDef()
    Dim db As DAO.Database
    Dim qdf As DAO.QueryDef
    Dim rs As DAO.Recordset

    Set db = CurrentDb
    Set qdf = db.QueryDefs("qryClientsActifs")  ' Requête enregistrée
    Set rs = qdf.OpenRecordset(dbOpenSnapshot)

    ' Plus rapide que :
    ' Set rs = db.OpenRecordset("SELECT * FROM tblClients WHERE Statut = 'Actif'")

    rs.Close
    Set rs = Nothing
    Set qdf = Nothing
    Set db = Nothing
End Sub`,
          },
          {
            title: '📋 Checklist de distribution',
            type: 'text',
            content: `Avant de distribuer votre application, vérifiez :

### 🔍 Tests

- [ ] Testez sur un ordinateur **différent** du vôtre
- [ ] Testez avec un utilisateur **non-admin** Windows
- [ ] Testez sur différentes **versions d'Office** (si possible)
- [ ] Vérifiez tous les chemins de fichiers (pas de C:\\Users\\VotreNom\\...)
- [ ] Testez la gestion d'erreurs (coupez le réseau, supprimez un fichier...)

### 🔒 Sécurité

- [ ] Code VBA verrouillé par mot de passe
- [ ] Fichier ACCDE généré
- [ ] Pas de mots de passe en clair dans le code
- [ ] Interface masquée (ruban, navigation)
- [ ] Formulaire de démarrage défini

### ⚡ Performance

- [ ] Code compilé sans erreur
- [ ] Base compactée et réparée
- [ ] Index créés sur les champs importants
- [ ] Requêtes optimisées (pas de SELECT *)

### 📄 Documentation

- [ ] Manuel utilisateur (PDF)
- [ ] Notes de version
- [ ] Contact support
- [ ] Fichier README.txt

### 🎁 Package final

- [ ] Fichier .accde
- [ ] Dossier avec fichiers nécessaires (images, templates...)
- [ ] Programme d'installation (optionnel)
- [ ] Instructions d'installation

**✅ Votre application est prête à être distribuée !**`,
          },
        ],
      },
    ];

    // Traiter chaque leçon
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

      // Créer les nouveaux blocs
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

    console.log('\n\n🎉 Amélioration des leçons 6-10 terminée avec succès !\n');

  } catch (error) {
    console.error('❌ Erreur :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

enhanceVBACoursePart2();
