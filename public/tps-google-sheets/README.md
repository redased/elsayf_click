# TP Pratiques - Formation Python & Google Sheets

## 📚 Structure des TP

Ce dossier contient les travaux pratiques (TP) pour chaque module de la formation.

## 🚀 Comment utiliser les TP

### Prérequis

1. **Service Account Google**:
   - Allez sur [console.cloud.google.com](https://console.cloud.google.com)
   - Créez un projet
   - Activez Google Sheets API et Drive API
   - Créez un Service Account
   - Téléchargez le fichier JSON
   - Renommez-le en `service-account.json`

2. **Installation des dépendances**:
   ```bash
   pip install gspread pandas numpy matplotlib seaborn schedule
   ```

3. **Configuration**:
   - Placez `service-account.json` dans chaque dossier de TP
   - **IMPORTANT**: Ne partagez JAMAIS ce fichier !

## 📁 Liste des TP par Module

### Module 1: Introduction & Setup
- **TP01_Connexion.py**: Votre première connexion Google Sheets
  - Lister vos feuilles
  - Ouvrir une feuille spécifique
  - Durée: 15-20 minutes

- **TP02_OAuth.py**: Authentification OAuth2
  - Gestion des tokens
  - Refresh automatique
  - Durée: 30 minutes

### Module 2: Bases Python pour Sheets
- **TP03_gspread_Bases.py**: Découvrir gspread
  - Connexion
  - Lecture/écriture basique
  - Durée: 25 minutes

- **TP04_CRUD_Complets.py**: Système CRUD
  - Créer, Lire, Mettre à jour, Supprimer
  - Menu interactif
  - Durée: 45 minutes

### Module 3: Lecture & Écriture
- **TP05_Analyse_Ventes.py**: Analyser des données de vente
  - Lecture de plages
  - Calculs de CA
  - Durée: 40 minutes

- **TP06_Import_Export.py**: Import/Export de données
  - CSV vers Sheets
  - Sheets vers CSV
  - Durée: 35 minutes

### Module 4: Pandas
- **TP07_Nettoyage_Pandas.py**: Nettoyage de données
  - Valeurs manquantes
  - Doublons
  - Validation
  - Durée: 50 minutes

- **TP08_Analyse_Avancee.py**: Analyse avec Pandas
  - Groupby, pivot table
  - Statistiques
  - Durée: 45 minutes

### Module 5: Statistiques
- **TP09_Correlation.py**: Analyse de corrélation
  - Matrice de corrélation
  - Heatmap
  - Durée: 40 minutes

- **TP10_Regression.py**: Régression linéaire
  - Prédictions
  - Visualisation
  - Durée: 45 minutes

### Module 6: Tableaux de Bord
- **TP11_Dashboard.py**: Dashboard interactif
  - KPIs en temps réel
  - Mise à jour auto
  - Durée: 50 minutes

- **TP12_Graphiques.py**: Création de graphiques
  - matplotlib & seaborn
  - Export en images
  - Durée: 40 minutes

### Module 7: Scheduling
- **TP13_Scheduler.py**: Automatisation planifiée
  - Tâches horaires
  - Tâches quotidiennes
  - Durée: 35 minutes

- **TP14_Cron_Jobs.py**: Jobs avec cron
  - Configuration cron
  - Logging
  - Durée: 30 minutes

### Module 8: Intégrations Google
- **TP15_Forms.py**: Intégration Google Forms
  - Récupération des réponses
  - Analyse automatique
  - Durée: 40 minutes

- **TP16_Gmail.py**: Envoi d'emails
  - Gmail API
  - Templates
  - Durée: 35 minutes

- **TP17_Drive.py**: Gestion Drive
  - Upload/Download
  - Organisation
  - Durée: 30 minutes

### Module 9: Projets Pratiques
- **TP18_Facturation.py**: Système de facturation
  - Génération automatique
  - Calculs TVA
  - PDF export
  - Durée: 60 minutes

- **TP19_Dashboard_Ventes.py**: Dashboard de ventes
  - Graphiques dynamiques
  - Filtres
  - Durée: 50 minutes

- **TP20_Gestion_Stock.py**: Gestion de stock
  - Alertes
  - Réapprovisionnement
  - Durée: 45 minutes

### Module 10: Déploiement
- **TP21_Production.py**: Mise en production
  - Docker
  - Logging
  - Monitoring
  - Durée: 50 minutes

## 🎯 Comment réaliser un TP

### Étape 1: Préparation
```bash
# Créer un dossier pour le TP
mkdir TP01 && cd TP01

# Copier le fichier du TP
cp ../TP01_Connexion.py .

# Copier votre service account
cp ~/service-account.json .
```

### Étape 2: Exécution
```bash
python TP01_Connexion.py
```

### Étape 3: Validation
- Suivez les instructions dans le script
- Vérifiez les résultats dans Google Sheets
- Passez aux TP suivants

## 📊 Feuilles Google Sheets requises

Pour chaque TP, vous aurez besoin de créer une feuille Google Sheets:

### TP01: TP_Test
- Feuille vide pour tester la connexion

### TP04: TP_Contacts
- Colonnes: Nom, Email, Téléphone, Entreprise

### TP05: TP_Ventes
- Colonnes: Date, Produit, Quantité, Prix, Région

### TP07: TP_Correlation
- Colonnes: Produit, Prix_Unite, Quantite_Vendue, Marge, Satisfaction_Client

### TP09: TP_Nettoyage
- Données "sales" avec des valeurs manquantes

### TP18: TP_Facturation
- Feuille avec clients et produits

## 🔧 Dépannage

### Erreur: "Service account not found"
- Vérifiez que `service-account.json` existe
- Vérifiez le chemin dans le script

### Erreur: "Insufficient permissions"
- Partagez la feuille avec le service account
- Email du service account: dans `service-account.json`, champ `client_email`

### Erreur: "API not enabled"
- Activez Google Sheets API dans Google Cloud Console
- Activez également Google Drive API

## 💡 Conseils

1. **Commencez par le TP01** pour vérifier votre connexion
2. **Sauvegardez vos données** avant les TP de modification
3. **Testez petit** avant de passer à l'échelle
4. **Lisez les commentaires** dans le code
5. **Expérimentez** une fois le TP réussi

## 🆘 Besoin d'aide?

- Consultez le cours pour la théorie
- Rejoignez le Discord pour poser des questions
- Vérifiez les logs en cas d'erreur

## 📝 Progression suggérée

1. Semaine 1-2: TP01 à TP04 (Modules 1-2)
2. Semaine 3: TP05 à TP08 (Modules 3-4)
3. Semaine 4: TP09 à TP12 (Modules 5-6)
4. Semaine 5: TP13 à TP17 (Modules 7-8)
5. Semaine 6-7: TP18 à TP20 (Module 9)
6. Semaine 8: TP21 (Module 10)

---

**Bon courage ! 🚀**

N'oubliez pas: chaque TP vous rapproche de la maîtrise de Python + Google Sheets !
