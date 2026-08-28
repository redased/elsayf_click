# Guide de Démarrage Rapide - Système d'Affiliation

## Installation rapide

### 1. Vérifier le schéma de base de données

```bash
# Vérifier que les modèles existent dans prisma/schema.prisma
cat prisma/schema.prisma | grep -A 20 "model AffiliateLink"
cat prisma/schema.prisma | grep -A 20 "model AffiliateClick"
```

### 2. Appliquer les migrations

```bash
npx prisma db push
```

### 3. Créer un premier lien d'affiliation

**Via l'interface:**
1. Connectez-vous en tant qu'Admin
2. Allez sur `/admin/affiliates`
3. Cliquez sur "Créer un lien"
4. Remplissez:
   - Influenceur: `Test User`
   - Plateforme: `Instagram`
   - URL: `/register`

**Via le seed:**
```bash
node prisma/seed-affiliates.js
```

### 4. Tester le tracking

```bash
# Test v1 (simple)
curl -X POST http://localhost:3000/api/tracking/click \
  -H "Content-Type: application/json" \
  -d '{"code": "test-user"}'

# Test v2 (avancé)
curl -X POST http://localhost:3000/api/tracking/click-v2 \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)" \
  -d '{"code": "test-user", "landingPage": "/register", "utmSource": "facebook"}'
```

### 5. Vérifier les statistiques

```bash
# Voir les clicks
curl http://localhost:3000/api/tracking/click-v2?days=7

# Voir les stats admin
curl http://localhost:3000/api/admin/analytics?period=7d
```

### 6. Exécuter les tests unitaires

1. Allez sur `/super-admin/tests`
2. Sélectionnez "Affiliation & Analytics"
3. Cliquez sur "Exécuter les tests"

## Scénarios d'utilisation

### Scénario 1: Influencer sur Instagram

**Créer le lien:**
```javascript
// POST /api/admin/affiliates
{
  "code": "sarah-instagram",
  "influencerName": "Sarah Connor",
  "platform": "Instagram",
  "originalUrl": "/register",
  "sourceType": "social"
}
```

**L'URL à partager:**
```
https://statlabo.com/register?ref=sarah-instagram
```

**Le bio Instagram:**
```
🎓 Apprends le Python avec moi !
👇 Inscris-toi ici
statlabo.com/ref/sarah-instagram
```

### Scénario 2: Campagne Facebook Ads

**Créer le lien:**
```javascript
// POST /api/admin/affiliates
{
  "code": "fb-ads-summer2024",
  "influencerName": "Facebook Ads Summer 2024",
  "platform": "Facebook",
  "originalUrl": "/register",
  "sourceType": "paid"
}
```

**L'URL de la campagne:**
```
https://statlabo.com/api/tracking/click-v2?code=fb-ads-summer2024&utm_source=facebook&utm_medium=paid&utm_campaign=summer2024
```

**UTMs pour le tracking:**
- `utm_source`: facebook
- `utm_medium`: paid
- `utm_campaign`: summer2024
- `utm_content`: video_1

### Scénario 3: Newsletter

**Créer le lien:**
```javascript
// POST /api/admin/affiliates
{
  "code": "newsletter-january",
  "influencerName": "Newsletter January 2024",
  "platform": "Email",
  "originalUrl": "/register",
  "sourceType": "email"
}
```

**L'URL dans l'email:**
```
https://statlabo.com/register?ref=newsletter-january
```

## Attribution des inscriptions

### Mécanisme

1. Un utilisateur clique sur un lien d'affiliation
2. Un cookie `ref_code` est stocké (30 jours)
3. L'utilisateur s'inscrit
4. Le code est récupéré depuis le cookie
5. L'inscription est attribuée à l'affilié

### Vérifier l'attribution

```sql
-- Trouver les inscriptions d'un affilié
SELECT
  u.name,
  u.email,
  u."createdAt",
  ac.code
FROM "User" u
JOIN "AffiliateClick" ac ON ac."userId" = u.id
WHERE ac.code = 'sarah-instagram'
ORDER BY u."createdAt" DESC;
```

## Bonnes pratiques

### 1. Codes de liens

✅ **Bon:**
- `sarah-instagram`
- `fb-ads-summer2024`
- `newsletter-jan24`

❌ **Mauvais:**
- `link1`
- `test`
- `abc123`

### 2. Plateformes

Utilisez des noms cohérents:
- `Facebook`
- `Instagram`
- `YouTube`
- `TikTok`
- `LinkedIn`
- `Twitter`
- `Email`
- `Website`

### 3. Suivi dans le temps

Créez un nouveau lien par campagne:
- `fb-ads-jan24`
- `fb-ads-feb24`
- `fb-ads-mar24`

## Dépannage

### Problème: Les clics ne sont pas trackés

**Vérifier:**
1. L'API répond-elle ?
```bash
curl -X POST http://localhost:3000/api/tracking/click \
  -H "Content-Type: application/json" \
  -d '{"code": "test"}'
```

2. Le code existe-t-il ?
```sql
SELECT * FROM "AffiliateLink" WHERE code = 'test';
```

3. Les cookies sont-ils activés ?

### Problème: Les conversions ne sont pas attribuées

**Vérifier:**
1. Le cookie est-il présent ?
```javascript
// Dans la console du navigateur
document.cookie
```

2. Le code est-il récupéré à l'inscription ?
```javascript
// Dans le register
const refCode = getCookie('ref_code');
console.log('Ref code:', refCode);
```

3. La conversion est-elle marquée ?
```sql
SELECT * FROM "AffiliateClick" WHERE converted = true;
```

### Problème: Les stats sont fausses

**Recalculer les counters:**
```sql
-- Recalculer les clics
UPDATE "AffiliateLink" al
SET "clicks" = (
  SELECT COUNT(*)
  FROM "AffiliateClick" ac
  WHERE ac."linkId" = al.id
);

-- Recalculer les inscriptions
UPDATE "AffiliateLink" al
SET "registrations" = (
  SELECT COUNT(*)
  FROM "AffiliateClick" ac
  WHERE ac."linkId" = al.id AND ac.converted = true
);
```

## Ressources

- [Documentation complète](./AFFILIATE_SYSTEM_COMPLETE.md)
- [Tests unitaires](/super-admin/tests)
- [Schéma de base de données](../prisma/schema.prisma)

## Support

En cas de problème:
1. Consultez la documentation complète
2. Exécutez les tests unitaires
3. Vérifiez les logs du serveur
4. Contactez l'équipe technique
