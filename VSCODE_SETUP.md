# Configuration VS Code Access

Ce document explique comment configurer l'accès VS Code pour elsayf.

## Vue d'ensemble

Le système VS Code est une application Django séparée (statlabo) qui communique avec elsayf via une API sécurisée. Seuls les utilisateurs ayant l'accès VS Code activé peuvent utiliser l'IDE.

## Architecture

```
Utilisateur → elsayf.statlabo.com (Next.js)
                    ↓
            Authentification + Vérification vscodeAccess
                    ↓
            Redirection vers statlabo.com/vscode/
                    ↓
            Vérification API (server-to-server)
                    ↓
            Accès autorisé/refusé
```

## Configuration

### 1. Variables d'environnement (elsayf)

Dans `.env`:
```env
VSCODE_API_SECRET="votre-secret-key-pour-statlabo"
```

### 2. Variables d'environnement (statlabo)

Dans `.env`:
```env
ELSAYF_API_URL=https://elsayf.statlabo.com
ELSAYF_API_SECRET="le-meme-secret-key-que-elsayf"
```

### 3. Gestion des accès

#### Via le Super Admin

1. Connectez-vous comme SUPER_ADMIN sur elsayf
2. Allez sur `/super-admin/vscode-access`
3. Utilisez les boutons "Accorder" ou "Révoquer" pour chaque utilisateur

#### Via l'API

```javascript
// Accorder l'accès
POST /api/super-admin/users/toggle-vscode-access
{
    "userId": "user-id",
    "vscodeAccess": true
}

// Révoquer l'accès
POST /api/super-admin/users/toggle-vscode-access
{
    "userId": "user-id",
    "vscodeAccess": false
}
```

## API Endpoints

### elsayf (fournisseur d'authentification)

- `GET/POST /api/vscode/check-access` - Vérifie si un utilisateur a accès à VS Code
- `GET/POST /api/super-admin/users/toggle-vscode-access` - Gère les accès (Super Admin only)

### statlabo (consommateur)

- `/vscode/` - Interface VS Code (protégée)
- Toutes les routes VS Code vérifient l'accès via le middleware

## Sécurité

1. **Communication server-to-server** : Utilise un secret partagé (VSCODE_API_SECRET)
2. **Cache local** : Les vérifications d'accès sont mises en cache 5 minutes
3. **Vérification double** : Middleware + Vue vérifient tous les deux l'accès
4. **Logging** : Toutes les actions d'accès sont loggées dans ActivityLog

## Déploiement

### elsayf
```bash
cd /root/elsayf
npx prisma db push  # Appliquer les migrations
npm run build
npm start
```

### statlabo
```bash
cd /root/statlabo
./start.sh
```

## Dépannage

### L'utilisateur ne peut pas accéder à VS Code

1. Vérifier que `vscodeAccess` est à `true` dans la base de données
2. Vérifier que les secrets API correspondent
3. Vérifier les logs de elsayf et statlabo
4. Vider le cache session de l'utilisateur

### Erreur "Invalid API token"

Les secrets dans `ELSAYF_API_SECRET` (statlabo) et `VSCODE_API_SECRET` (elsayf) doivent être identiques.

## Notes

- Les SUPER_ADMIN ont toujours accès à VS Code, même sans le flag `vscodeAccess`
- Les changements d'accès sont effectifs immédiatement (mais peuvent prendre jusqu'à 5 minutes à cause du cache)
- L'accès est vérifié à chaque connexion sur statlabo.com/vscode/
