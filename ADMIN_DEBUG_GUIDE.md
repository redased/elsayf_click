# 🔧 Admin Debug & Tests - Guide Complet

## 📋 Vue d'ensemble

Le système dispose maintenant d'un **bouton debug admin paramétrable** et d'une **suite de tests unitaires complète** accessible depuis le Super Admin.

---

## 🐛 Bouton Debug Admin

### Accès

Un **bouton debug flottant** apparaît automatiquement en bas à droite de l'écran pour tous les admins :
- ✅ SUPER_ADMIN
- ✅ ADMIN
- ✅ R_STAT_ADMIN

### Fonctionnalités

Le bouton ouvre un panel avec :

#### 🖥️ Informations système
- Nom et email de l'utilisateur
- Rôle et permissions
- Environment (dev/prod)
- URL actuelle
- Timestamp

#### 🧪 Tests rapides
Boutons pour exécuter des tests instantanés :
- **Auth** - Tests d'authentification
- **DB** - Tests de base de données
- **Python** - Tests d'inscription Python
- **Email** - Tests du système d'email

#### 📊 Résultats en temps réel
- ✅ Succès (vert)
- ❌ Erreur (rouge)
- ⚠️ Warning (jaune)
- Détails JSON cliquables

#### 🔗 Liens rapides
- Tests unitaires complets
- Paramètres système
- Dashboard
- Health Check

---

## 🧪 Page de Tests Unitaires

### URL
```
https://elsayf.statlabo.com/super-admin/tests
```

### Suites de tests disponibles

#### 1. 🔐 Authentification
- Session active
- Rôles utilisateurs
- Permissions
- Connexion Google

#### 2. 🗄️ Base de données
- Connexion DB
- Comptes utilisateurs
- Cours publiés
- Inscriptions Python
- Logs email

#### 3. 🌐 API
- Python Register
- Settings API
- Super Admin Users
- Affiliate Links

#### 4. 🐍 Inscription Python
- Validation email
- Champs obligatoires
- Modules disponibles
- Filières
- Inscription complète

#### 5. 📧 Email
- Configuration SMTP
- Logs récents
- Template welcome
- Template Python

#### 6. ⚡ Performance
- Temps de réponse API
- Taille de la base
- Mémoire utilisée
- Connexions actives

#### 7. 🛡️ Sécurité
- Injection SQL
- XSS Prevention
- CSRF Token
- Rate Limiting

#### 8. 🔗 Intégration
- Google Analytics
- Chargily Payment
- Pusher
- AI Providers

---

## 🚀 Utilisation

### Depuis le bouton debug

1. Cliquez sur le **bouton bug** 🐛 en bas à droite
2. Choisissez un test rapide ou "Exécuter tous les tests"
3. Visualisez les résultats en temps réel

### Depuis la page de tests

1. Allez sur `/super-admin/tests`
2. Dépliez une suite de tests
3. Cliquez "Exécuter la suite"
4. Visualisez les résultats détaillés

### Exporter les résultats

Cliquez sur "Exporter" pour télécharger un JSON avec tous les résultats :

```json
[
  {
    "suiteId": "auth",
    "timestamp": "2026-01-31T12:00:00.000Z",
    "summary": {
      "total": 2,
      "success": 2,
      "error": 0,
      "warning": 0
    },
    "results": [...]
  }
]
```

---

## 📡 API Health Check

### Endpoint
```
GET /api/health
```

### Réponse
```json
{
  "uptime": 12345.67,
  "timestamp": 1769856618548,
  "environment": "production",
  "status": "ok",
  "database": "connected",
  "users": 3
}
```

### Codes HTTP
- `200` - Tout est OK
- `503` - Erreur (DB déconnectée, etc.)

---

## 🧪 Tests automatisés

### Script de tests Python

```bash
# Exécuter tous les tests
node tests/run-python-registration-tests.js

# Avec API réelle
TEST_REAL_API=true node tests/run-python-registration-tests.js
```

### Test via cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Python Register
curl -X POST http://localhost:3000/api/register/python \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
  }'

# Run tests (admin only)
curl -X POST http://localhost:3000/api/super-admin/run-tests \
  -H "Content-Type: application/json" \
  -d '{"testGroup": "auth"}'
```

---

## 📂 Structure des fichiers

```
src/
├── app/
│   ├── api/
│   │   ├── health/route.js              # Health check API
│   │   └── super-admin/run-tests/route.js  # Tests execution API
│   ├── super-admin/tests/page.js        # Page de tests UI
│   └── register/python/page.js          # Inscription Python
├── components/
│   └── admin/
│       ├── AdminDebugButton.js          # Bouton debug flottant
│       └── AdminDebugWrapper.js         # Wrapper client
└── layout.js                            # + AdminDebugWrapper

tests/
├── run-python-registration-tests.js     # Script de tests
├── api/register/
│   ├── python-registration.test.js      # Tests Jest
│   └── python-registration-helpers.js   # Helpers
└── README.md                            # Documentation tests
```

---

## 🎨 Personnalisation

### Ajouter une nouvelle suite de tests

1. **Dans `src/app/super-admin/tests/page.js`** :

```javascript
{
    id: 'mon_test',
    name: 'Mon Test',
    icon: '🎯',
    description: 'Description du test',
    tests: [
        { name: 'Test 1', description: 'Description 1' },
        { name: 'Test 2', description: 'Description 2' }
    ]
}
```

2. **Dans `src/app/api/super-admin/run-tests/route.js`** :

```javascript
if (testGroup === 'all' || testGroup === 'mon_test') {
    results.push(...await testMonTest());
}

async function testMonTest() {
    const results = [];

    try {
        // Votre test ici
        results.push({
            name: 'Mon Test - Test 1',
            status: 'success',
            message: 'Test réussi',
            details: { ... }
        });
    } catch (error) {
        results.push({
            name: 'Mon Test - Test 1',
            status: 'error',
            message: error.message
        });
    }

    return results;
}
```

---

## 🔍 Debug détaillé

### Activer le mode debug

Ajoutez dans votre `.env` :

```env
DEBUG=true
NODE_ENV=development
```

### Logs Docker

```bash
# Voir les logs
docker logs e-learning-web

# Logs en temps réel
docker logs -f e-learning-web

# Dernières 100 lignes
docker logs --tail 100 e-learning-web
```

---

## 📊 Métriques et monitoring

### Dashboard des tests

- ✅ Nombre total de tests
- ✅ Taux de réussite
- ✅ Tests par statut
- ✅ Historique des exécutions

### Export des données

Les résultats peuvent être exportés en :
- **JSON** - Pour analyse ultérieure
- **CSV** - Pour Excel
- **PDF** - Rapport imprimable

---

## 🛠️ Résolution de problèmes

### Tests qui échouent

1. **Vérifiez la connexion DB**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Vérifiez les variables d'environnement**
   ```bash
   docker exec e-learning-web env | grep SMTP
   ```

3. **Vérifiez les logs**
   ```bash
   docker logs e-learning-web | grep ERROR
   ```

### Bouton debug n'apparaît pas

- Vérifiez que vous êtes connecté
- Vérifiez votre rôle (doit être admin)
- Videz le cache du navigateur

### Tests lents

- Exécutez les tests un par un
- Utilisez le mode "tests rapides" du bouton debug
- Vérifiez la charge du serveur

---

## 🔗 Liens utiles

| Page | URL |
|------|-----|
| Page de tests | https://elsayf.statlabo.com/super-admin/tests |
| Super Admin | https://elsayf.statlabo.com/super-admin |
| Settings | https://elsayf.statlabo.com/super-admin/settings |
| Inscription Python | https://elsayf.statlabo.com/register/python |
| Health Check | https://elsayf.statlabo.com/api/health |

---

## 📞 Support

Pour toute question ou problème :
1. Consultez les logs via le bouton debug
2. Exportez les résultats des tests
3. Contactez l'équipe technique

---

**✅ Tout est déployé et fonctionnel !**
