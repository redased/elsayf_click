# Tests Unitaires - Inscription Python

## 📋 Vue d'ensemble

Ce dossier contient les tests unitaires pour l'inscription Python sur la plateforme El Sayf.

## 🚀 Utilisation

### Exécuter tous les tests (mode mock)

```bash
node tests/run-python-registration-tests.js
```

### Tester l'API réelle

```bash
TEST_REAL_API=true node tests/run-python-registration-tests.js
```

### Tester manuellement avec cURL

```bash
# Test minimal
curl -X POST http://localhost:3000/api/register/python \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com"
  }'

# Test complet
curl -X POST http://localhost:3000/api/register/python \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+213555123456",
    "filiere": "OBAC",
    "modules": ["excel", "word", "automatisation"],
    "otherModule": "Machine Learning",
    "project": "Automatiser les rapports de vente",
    "customRequest": "Cours le week-end"
  }'
```

## 📝 Champs du formulaire

### Champs obligatoires
- `firstName` (string) - Prénom
- `lastName` (string) - Nom
- `email` (string) - Email valide

### Champs optionnels
- `phone` (string) - Téléphone
- `filiere` (string) - Filière : OBAC, CEM, Universitaire, Professionnel, Autre
- `modules` (array) - Modules souhaités :
  - `excel` - 📊 Excel
  - `word` - 📝 Word
  - `email` - 📧 Email Marketing
  - `automatisation` - 🤖 Automatisation
  - `data_analysis` - 📈 Analyse de données
  - `web_scraping` - 🌐 Web Scraping
  - `dashboards` - 📊 Tableaux de bord
  - `api` - 🔗 API & Integration
- `otherModule` (string) - Autre module personnalisé
- `project` (string) - Description du projet
- `customRequest` (string) - Demande personnalisée

## ✅ Scénarios de test

### 1. Validation des champs obligatoires
- ✅ Nom manquant
- ✅ Prénom manquant
- ✅ Email manquant
- ✅ Email invalide
- ✅ Données valides minimales

### 2. Gestion des doublons
- ✅ Email déjà utilisé

### 3. Champs optionnels
- ✅ Téléphone
- ✅ Filière
- ✅ Modules
- ✅ Autre module
- ✅ Projet
- ✅ Demande personnalisée

### 4. Inscription complète
- ✅ Tous les champs remplis

### 5. Validation des emails
- ✅ Formats invalides
- ✅ Formats valides

### 6. Filières
- ✅ Toutes les filières valides

### 7. Modules
- ✅ Tous les modules valides
- ✅ Un seul module

### 8. Code de parrainage
- ✅ Code valide

### 9. Caractères spéciaux
- ✅ Accents
- ✅ Caractères arabes

### 10. Limites de longueur
- ✅ Nom long (100 caractères)
- ✅ Projet long (1000 caractères)

## 📊 Résultats attendus

```
╔════════════════════════════════════════════════════════════╗
║  📊 Résultats des tests                                     ║
╚════════════════════════════════════════════════════════════╝

⏱️  Durée: ~0.00s
✅ Tests passés: 4
❌ Tests échoués: 0
📈 Taux de réussite: 100.0%

📋 Détails des tests:

┌─────────────────────────────┬──────────┬──────────────────────┐
│ Test                        │ Statut   │ Détails              │
├─────────────────────────────┼──────────┼──────────────────────┤
│ 1. Champs minimaux           │ ✅ PASS   │ OK                   │
│ 2. Tous les champs           │ ✅ PASS   │ OK                   │
│ 3. Email invalide            │ ✅ PASS   │ OK                   │
│ 4. Champs manquants          │ ✅ PASS   │ OK                   │
└─────────────────────────────┴──────────┴──────────────────────┘
```

## 🌐 Pages

- **Formulaire d'inscription**: `https://elsayf.statlabo.com/register/python`
- **API**: `https://elsayf.statlabo.com/api/register/python`

## 📧 Email de confirmation

Lors de l'inscription réussie, un email est automatiquement envoyé à l'utilisateur avec :
- ✅ Récapitulatif des informations
- ✅ Liste des modules sélectionnés
- ✅ Projet et demandes personnalisées
- ✅ Lien vers la plateforme

## 🐛 Debug

### Vérifier les logs

```bash
# Logs du conteneur
docker logs e-learning-web

# Logs en temps réel
docker logs -f e-learning-web
```

### Tester l'API directement

```bash
# Vérifier que l'API répond
curl http://localhost:3000/api/register/python

# POST avec données
curl -X POST http://localhost:3000/api/register/python \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
```

## 📚 Structure des fichiers

```
tests/
├── run-python-registration-tests.js     # Script principal
├── api/
│   └── register/
│       ├── python-registration.test.js           # Tests Jest
│       └── python-registration-helpers.js        # Helpers
└── README.md                                     # Ce fichier

src/app/register/python/                          # Page d'inscription
├── page.js                                       # Formulaire
└── api/
    └── register/
        └── python/
            └── route.js                          # API
```

## 🔧 Maintenance

Pour ajouter de nouveaux tests :

1. Ajouter le scénario dans `python-registration.test.js`
2. Ajouter le helper si nécessaire dans `python-registration-helpers.js`
3. Exécuter les tests pour vérifier

## 📞 Support

Pour toute question ou problème, contactez l'équipe technique El Sayf.
