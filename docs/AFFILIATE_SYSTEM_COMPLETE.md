# Documentation Complète - Système d'Affiliation et Analytics

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Schéma de base de données](#schéma-de-base-de-données)
4. [API Endpoints](#api-endpoints)
5. [Tracking des clics](#tracking-des-clics)
6. [Analytics](#analytics)
7. [Tests unitaires](#tests-unitaires)
8. [Guide d'utilisation](#guide-dutilisation)
9. [Développement](#développement)

---

## Vue d'ensemble

Le système d'affiliation et analytics permet de :
- **Créer des liens d'affiliation** pour les influenceurs
- **Tracker les clics** avec détection device, OS, browser, source
- **Analyser les performances** de chaque affilié
- **Attribuer les conversions** (inscriptions) aux bons affiliés
- **Exporter les données** pour analyse externe

### Fonctionnalités principales

| Fonctionnalité | Description |
|----------------|-------------|
| Liens d'affiliation | Création de liens uniques par influenceur/platforme |
| Tracking v1 | Legacy, code simple |
| Tracking v2 | Avancé, avec device/OS/browser/source |
| Cookies | Durée de 30 jours pour l'attribution |
| Analytics | Stats en temps réel par affilié |
| Tests unitaires | 12 tests dans Super Admin |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
├─────────────────────────────────────────────────────────────┤
│  • /admin/affiliates        - Gestion des affiliés          │
│  • /admin/analytics         - Dashboard analytics            │
│  • /super-admin/tests       - Tests unitaires               │
│  • AffiliateTracker.js      - Composant de tracking         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Routes                               │
├─────────────────────────────────────────────────────────────┤
│  • /api/tracking/click       - Tracking v1 (legacy)         │
│  • /api/tracking/click-v2    - Tracking v2 (avancé)         │
│  • /api/admin/affiliates     - CRUD affiliés                │
│  • /api/admin/analytics      - Stats analytics              │
│  • /api/super-admin/tests    - Exécution tests              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Prisma ORM                               │
├─────────────────────────────────────────────────────────────┤
│  • AffiliateLink              - Liens d'affiliation         │
│  • AffiliateClick             - Clics trackés               │
│  • User                       - Utilisateurs                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Schéma de base de données

### AffiliateLink

```prisma
model AffiliateLink {
  id              String   @id @default(cuid())
  code            String   @unique
  originalUrl     String
  platform        String
  sourceType      String
  influencerName  String
  creatorId       String
  clicks          Int      @default(0)
  registrations   Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  creator         User     @relation(fields: [creatorId], references: [id])
  clicksRecords   AffiliateClick[]

  @@index([code])
  @@index([creatorId])
}
```

**Champs :**
- `code`: Code unique du lien (ex: `influencer-123`)
- `originalUrl`: URL de destination (ex: `/register`)
- `platform`: Plateforme (Facebook, Instagram, etc.)
- `sourceType`: Type de source
- `influencerName`: Nom de l'influenceur
- `clicks`: Nombre total de clics (counter)
- `registrations`: Nombre d'inscriptions attribuées (counter)

### AffiliateClick

```prisma
model AffiliateClick {
  id              String   @id @default(cuid())
  code            String
  linkId          String
  device          String?
  os              String?
  browser         String?
  source          String?
  referrer        String?
  converted       Boolean  @default(false)
  userId          String?
  createdAt       DateTime @default(now())

  link            AffiliateLink @relation(fields: [linkId], references: [id])

  @@index([code])
  @@index([linkId])
  @@index([converted])
  @@index([createdAt])
}
```

**Champs :**
- `code`: Code utilisé
- `linkId`: Référence au lien d'affiliation
- `device`: mobile, tablet, desktop
- `os`: Windows, macOS, iOS, Android, Linux
- `browser`: Chrome, Safari, Firefox, Edge
- `source`: facebook, instagram, linkedin, youtube, google, direct
- `referrer`: URL HTTP Referer
- `converted`: Si le clic a conduit à une inscription
- `userId`: ID utilisateur si converti

---

## API Endpoints

### 1. Tracking v1 (Legacy)

**POST** `/api/tracking/click`

**Body:**
```json
{
  "code": "influencer-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Click tracked"
}
```

---

### 2. Tracking v2 (Avancé)

**POST** `/api/tracking/click-v2`

**Body:**
```json
{
  "code": "influencer-123",
  "landingPage": "/register",
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "summer2024"
}
```

**Headers:**
```
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0...)
Referer: https://www.facebook.com/posts/123
```

**Response:**
```json
{
  "success": true,
  "tracked": true,
  "clickId": "clx1234567890",
  "code": "influencer-123",
  "destination": "/register?ref=influencer-123",
  "device": "mobile",
  "os": "iOS",
  "browser": "Safari",
  "source": "facebook"
}
```

**GET** `/api/tracking/click-v2?days=7`

**Response (Analytics):**
```json
{
  "stats": {
    "total": 1250,
    "byDevice": { "mobile": 800, "tablet": 200, "desktop": 250 },
    "byOS": { "iOS": 450, "Android": 350, "Windows": 300, "macOS": 150 },
    "byBrowser": { "Safari": 400, "Chrome": 500, "Firefox": 200, "Edge": 150 },
    "bySource": { "facebook": 400, "instagram": 300, "google": 250, "direct": 300 },
    "conversions": 125,
    "conversionRate": "10.0"
  },
  "clicks": [
    {
      "id": "clx123",
      "code": "influencer-123",
      "device": "mobile",
      "os": "iOS",
      "browser": "Safari",
      "source": "facebook",
      "converted": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "topLinks": [
    {
      "code": "influencer-123",
      "clicks": 500,
      "registrations": 50,
      "rate": "10.0"
    }
  ]
}
```

---

### 3. Gestion des affiliés

**GET** `/api/admin/affiliates`

**Response:**
```json
{
  "links": [
    {
      "id": "clx123",
      "code": "influencer-123",
      "influencerName": "John Doe",
      "platform": "Instagram",
      "originalUrl": "/register",
      "clicks": 500,
      "registrations": 50,
      "rate": "10.0",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**POST** `/api/admin/affiliates`

**Body:**
```json
{
  "code": "influencer-123",
  "influencerName": "John Doe",
  "platform": "Instagram",
  "originalUrl": "/register",
  "sourceType": "social"
}
```

**DELETE** `/api/admin/affiliates/[id]`

---

### 4. Analytics Admin

**GET** `/api/admin/analytics?period=7d`

**Response:**
```json
{
  "summary": {
    "totalClicks": 5000,
    "totalConversions": 500,
    "conversionRate": "10.0",
    "activeAffiliates": 25
  },
  "topPerformers": [
    {
      "code": "influencer-123",
      "influencerName": "John Doe",
      "clicks": 500,
      "conversions": 50
    }
  ],
  "byPlatform": {
    "instagram": 2000,
    "facebook": 1500,
    "youtube": 1000,
    "tiktok": 500
  }
}
```

---

## Tracking des clics

### Détection Device

```javascript
function detectDevice(userAgent) {
  const isMobile = /mobile|android|iphone/i.test(userAgent);
  const isTablet = /tablet|ipad|kindle/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}
```

**User Agents exemples :**
- **Mobile**: `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)`
- **Tablet**: `Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)`
- **Desktop**: `Mozilla/5.0 (Windows NT 10.0; Win64; x64)`

### Détection OS

```javascript
function detectOS(userAgent) {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS X')) return 'macOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  if (userAgent.includes('Linux')) return 'Linux';
  return 'Unknown';
}
```

### Détection Browser

```javascript
function detectBrowser(userAgent) {
  if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) return 'Chrome';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}
```

### Détection Source

```javascript
function detectSource(referrer) {
  if (!referrer) return 'direct';

  const url = new URL(referrer);
  const domain = url.hostname.toLowerCase();

  if (domain.includes('facebook.com')) return 'facebook';
  if (domain.includes('instagram.com')) return 'instagram';
  if (domain.includes('linkedin.com')) return 'linkedin';
  if (domain.includes('youtube.com')) return 'youtube';
  if (domain.includes('tiktok.com')) return 'tiktok';
  if (domain.includes('google.')) return 'google';
  if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';

  return 'other';
}
```

### Cookies de tracking

```javascript
// Durée: 30 jours
// Domaine: .statlabo.com (production) ou localhost (dev)

document.cookie = `ref_code=${code}; max-age=${30*24*60*60}; domain=${domain}; path=/; SameSite=Lax`;
document.cookie = `ref_click_id=${clickId}; max-age=${30*24*60*60}; domain=${domain}; path=/; SameSite=Lax`;
```

---

## Analytics

### Statistiques disponibles

#### Par lien d'affiliation
- Nombre total de clics
- Nombre d'inscriptions
- Taux de conversion
- Date de création

#### Par device
- Répartition mobile/tablet/desktop
- Taux de conversion par device

#### Par OS
- Répartition Windows/macOS/iOS/Android/Linux
- Performance par OS

#### Par browser
- Répartition Chrome/Safari/Firefox/Edge
- Performance par browser

#### Par source
- Répartition Facebook/Instagram/LinkedIn/YouTube/Google/Direct
- Performance par source

#### Top performers
- Classement des influenceurs
- Meilleures plateformes
- Meilleurs taux de conversion

---

## Tests unitaires

### Suite de tests "Affiliation & Analytics"

Localisation: **Super Admin → Tests → Affiliation & Analytics**

#### Liste des 12 tests

| # | Test | Description |
|---|------|-------------|
| 1 | Création lien affiliation | Crée et supprime un lien de test |
| 2 | Tracking clic v1 | Vérifie l'API legacy |
| 3 | Tracking clic v2 | Vérifie le tracking avancé avec device/OS/browser |
| 4 | Détection device | Teste mobile/tablet/desktop |
| 5 | Détection OS | Teste Windows/macOS/iOS/Android/Linux |
| 6 | Détection browser | Teste Chrome/Safari/Firefox/Edge |
| 7 | Détection source | Teste Facebook/Instagram/LinkedIn/YouTube/Google/Direct |
| 8 | Attribution conversion | Compte les clics convertis |
| 9 | Cookie tracking | Vérifie la configuration des cookies 30j |
| 10 | Stats affiliate | Liste les liens avec leurs stats |
| 11 | Top performers | Affiche le top 3 des influenceurs |
| 12 | Export analytics | Teste l'export des données |

#### Exécution des tests

**Via l'interface:**
1. Connectez-vous en tant que Super Admin
2. Allez dans **Super Admin → Tests**
3. Sélectionnez **Affiliation & Analytics**
4. Cliquez sur **Exécuter les tests**

**Via l'API:**
```bash
curl -X POST http://localhost:3000/api/super-admin/run-tests \
  -H "Content-Type: application/json" \
  -d '{"testGroup": "affiliate"}'
```

#### Résultat attendu

```json
{
  "success": true,
  "testGroup": "affiliate",
  "results": [
    {
      "name": "Affiliation - Création lien",
      "status": "success",
      "message": "Lien créé et supprimé avec succès",
      "details": { "code": "test-1234567890", "linkId": "clx..." }
    },
    {
      "name": "Affiliation - Tracking clic v1",
      "status": "success",
      "message": "API v1 répond",
      "details": { "status": 200 }
    },
    // ... 10 autres tests
  ],
  "summary": {
    "total": 12,
    "passed": 12,
    "failed": 0,
    "warnings": 0
  }
}
```

---

## Guide d'utilisation

### 1. Créer un lien d'affiliation

**Via l'interface Admin:**
1. Allez dans **Admin → Affiliates**
2. Cliquez sur **Créer un lien**
3. Remplissez le formulaire:
   - Nom de l'influenceur
   - Plateforme (Facebook, Instagram, etc.)
   - URL de destination
   - Type de source
4. Cliquez sur **Créer**

**Via l'API:**
```bash
curl -X POST http://localhost:3000/api/admin/affiliates \
  -H "Content-Type: application/json" \
  -d '{
    "code": "influencer-123",
    "influencerName": "John Doe",
    "platform": "Instagram",
    "originalUrl": "/register",
    "sourceType": "social"
  }'
```

### 2. Utiliser le lien d'affiliation

**URL générée:**
```
https://statlabo.com/register?ref=influencer-123
```

**Ou via le tracker:**
```
https://statlabo.com/api/tracking/click-v2?code=influencer-123
```

### 3. Consulter les statistiques

**Par affilié:**
1. Allez dans **Admin → Affiliates**
2. Consultez le tableau avec:
   - Nombre de clics
   - Nombre d'inscriptions
   - Taux de conversion

**Analytics globaux:**
1. Allez dans **Admin → Analytics**
2. Consultez:
   - Répartition par device
   - Répartition par OS
   - Répartition par source
   - Top performers

### 4. Tester le système

1. Allez dans **Super Admin → Tests**
2. Sélectionnez **Affiliation & Analytics**
3. Exécutez les 12 tests
4. Corrigez les erreurs si nécessaire

---

## Développement

### Structure des fichiers

```
src/
├── app/
│   ├── admin/
│   │   ├── affiliates/
│   │   │   └── page.js              # Gestion des affiliés
│   │   └── analytics/
│   │       └── page.js              # Dashboard analytics
│   ├── api/
│   │   ├── tracking/
│   │   │   ├── click/
│   │   │   │   └── route.js         # API v1
│   │   │   └── click-v2/
│   │   │       └── route.js         # API v2
│   │   ├── admin/
│   │   │   ├── affiliates/
│   │   │   │   └── route.js         # CRUD affiliés
│   │   │   └── analytics/
│   │   │       └── route.js         # Stats
│   │   └── super-admin/
│   │       └── run-tests/
│   │           └── route.js         # Exécution tests
│   └── super-admin/
│       └── tests/
│           └── page.js              # UI tests
├── components/
│   └── AffiliateTracker.js          # Composant tracking
└── lib/
    └── prisma.js                    # Client Prisma

prisma/
└── schema.prisma                    # Schéma DB
```

### Variables d'environnement

```env
# URL de l'application
NEXT_PUBLIC_APP_URL=https://statlabo.com

# Base de données
DATABASE_URL=postgresql://...

# Auth (NextAuth)
NEXTAUTH_URL=https://statlabo.com
NEXTAUTH_SECRET=...
```

### Commandes utiles

```bash
# Générer un client Prisma
npx prisma generate

# Pousser le schéma vers la DB
npx prisma db push

# Créer une migration
npx prisma migrate dev --name add_affiliate_tracking

# Lancer le serveur de développement
npm run dev

# Builder pour production
npm run build

# Lancer en production
npm start
```

### Debug

**Vérifier les tables:**
```sql
SELECT * FROM "AffiliateLink" ORDER BY "clicks" DESC;
SELECT * FROM "AffiliateClick" ORDER BY "createdAt" DESC;
```

**Vérifier les counters:**
```sql
SELECT
  code,
  "influencerName",
  clicks,
  registrations,
  CASE WHEN clicks > 0 THEN ROUND((registrations::float / clicks) * 100, 2) ELSE 0 END as rate
FROM "AffiliateLink"
ORDER BY registrations DESC;
```

**Tester le tracking:**
```bash
# Test v1
curl -X POST http://localhost:3000/api/tracking/click \
  -H "Content-Type: application/json" \
  -d '{"code": "test-123"}'

# Test v2
curl -X POST http://localhost:3000/api/tracking/click-v2 \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)" \
  -d '{"code": "test-123", "landingPage": "/register"}'
```

---

## Annexe: Codes de réponse

| Code | Signification |
|------|---------------|
| 200  | Succès |
| 400  | Requête invalide |
| 401  | Non autorisé |
| 404  | Non trouvé |
| 500  | Erreur serveur |

---

## Support

Pour toute question ou problème:
1. Consultez les tests unitaires dans Super Admin
2. Vérifiez les logs du serveur
3. Consultez la base de données

**Dernière mise à jour:** 2024-01-31
**Version:** 1.0.0
