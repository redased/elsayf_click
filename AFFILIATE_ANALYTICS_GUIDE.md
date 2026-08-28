# 📊 Système d'Analytics & Affiliation Complet

## 🎯 Vue d'ensemble

Système complet de tracking d'affiliation avec analytics détaillés pour suivre chaque membre d'équipe, détecter les devices, sources de trafic, et mesurer les performances.

---

## ✨ Fonctionnalités

### 🔍 Tracking Automatique

Chaque clic sur un lien d'affiliation est tracké avec :

#### Informations Device
- ✅ **Device Type** : Mobile, Tablet, Desktop
- ✅ **OS** : Windows, macOS, iOS, Android, Linux
- ✅ **Browser** : Chrome, Safari, Firefox, Edge (+ version)

#### Informations Source
- ✅ **Source** : Facebook, Instagram, LinkedIn, TikTok, YouTube, Twitter, Google, Direct, etc.
- ✅ **Referrer** : URL d'origine
- ✅ **UTM Parameters** : utm_source, utm_medium, utm_campaign

#### Informations Session
- ✅ **IP Address** (anonymisée)
- ✅ **Session ID** unique
- ✅ **Landing Page** : première page visitée
- ✅ **Pages Visited** : liste des pages (JSON)

#### Conversion
- ✅ **Converted** : booléen si inscrit
- ✅ **Converted At** : date de conversion

---

## 📈 Dashboard Analytics

### URL
```
https://elsayf.statlabo.com/super-admin/analytics
```

### KPIs Affichés

1. **Clics Totaux** - Nombre total de clics sur la période
2. **Conversions** - Nombre d'inscriptions attribuées
3. **Taux de Conversion** - Pourcentage de conversion
4. **Mobile** - Nombre de clics depuis mobile
5. **Desktop** - Nombre de clics depuis desktop

### Graphiques

#### Par Device
- Répartition Mobile / Tablet / Desktop
- Barres de progression visuelles

#### Par Source
- Facebook (icône bleue)
- Instagram (icône rose)
- LinkedIn (icône bleue foncée)
- YouTube (icône rouge)
- Google (icône verte)
- Direct (icône grise)
- Autres sources

#### Par OS
- Windows
- macOS
- iOS
- Android
- Linux

### 🏆 Top Performers

Tableau des membres d'équipe classés par :

| Membre | Lien | Platform | Clics | Conversions | Taux |
|--------|------|----------|-------|------------|------|
| Reda | fb-page-reda-123 | Facebook (Page) | 1,234 | 45 | 3.6% |
| Sara | insta-story-sara-456 | Instagram (Story) | 987 | 38 | 3.9% |
| Karim | linkedin-karim-789 | LinkedIn (Profile) | 654 | 22 | 3.4% |

### 📋 Clics Récents

Liste des 100 derniers clics avec :

- Date et heure
- Affilié
- Source (avec icône)
- Device (avec icône)
- OS / Browser
- Landing page
- Statut conversion (✓ ou -)

---

## 🗄️ Schéma de Base de Données

### AffiliateLink (Liens d'affiliation)
```prisma
model AffiliateLink {
  id              String   @id
  code            String   @unique  // ex: "fb-page-reda-123"
  originalUrl     String            // ex: "/register"
  platform        String            // Facebook, Instagram, LinkedIn, etc.
  sourceType      String            // Page, Profile, Group, Post, Story, Video
  influencerName  String            // Nom de l'influenceur
  clicks          Int      @default(0)
  registrations   Int      @default(0)
  creatorId       String
  creator         User     @relation("CreatedLinks")
  usersReferred   User[]   @relation("ReferredBy")
  clickEvents     AffiliateClick[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### AffiliateClick (Tracking détaillé)
```prisma
model AffiliateClick {
  id              String   @id
  linkId          String
  link            AffiliateLink @relation

  // Device & Browser
  deviceType      String            // desktop, mobile, tablet
  os              String?           // Windows, macOS, iOS, Android, Linux
  browser         String?           // Chrome, Safari, Firefox, Edge
  browserVersion  String?

  // Source
  referrer        String?
  source          String?           // facebook, google, twitter, etc.
  utmSource       String?
  utmMedium       String?
  utmCampaign     String?

  // Location (optionnel)
  country         String?
  city            String?

  // Session
  ipAddress       String?
  sessionId       String?

  // Conversion
  converted       Boolean  @default(false)
  convertedAt     DateTime?

  // Page visited
  landingPage     String?
  pagesVisited    String?           // JSON array

  createdAt       DateTime @default(now())
}
```

---

## 🔗 Créer un Lien d'Affiliation

### Via le Super Admin Dashboard

1. Allez sur `/super-admin`
2. Cliquez "Créer Utilisateur" ou modifiez un utilisateur
3. Cochez "Affiliate Access"
4. L'utilisateur peut maintenant créer des liens

### Structure du Code de Lien

Le code de lien suit ce format :
```
{plateforme}-{type}-{nom}-{id}
```

**Exemples :**
- `fb-page-reda-123` - Facebook Page de Reda #123
- `insta-story-sara-456` - Instagram Story de Sara #456
- `linkedin-post-karim-789` - LinkedIn Post de Karim #789

### Générer des Liens

```
URL de base: https://elsayf.statlabo.com
Paramètre: ?ref={code}

Exemple:
https://elsayf.statlabo.com/register?ref=fb-page-reda-123
```

Avec UTM :
```
https://elsayf.statlabo.com/register?ref=fb-page-reda-123&utm_source=facebook&utm_medium=social&utm_campaign=campus_python
```

---

## 🎯 Détection Automatique des Sources

### Réseaux Sociaux

| Source | Détection | Icône |
|--------|-----------|-------|
| Facebook | `facebook.com`, `fb.` | 📘 |
| Instagram | `instagram.com` | 📷 |
| LinkedIn | `linkedin.com` | 💼 |
| Twitter/X | `twitter.com`, `x.com` | 🐦 |
| TikTok | `tiktok.com` | 🎵 |
| YouTube | `youtube.com`, `youtu.be` | 🎬 |
| WhatsApp | `whatsapp.com` | 💬 |
| Telegram | `telegram.` | ✈️ |

### Moteurs de Recherche

| Source | Détection | Icône |
|--------|-----------|-------|
| Google | `google.` | 🔍 |
| Bing | `bing.` | 🅱️ |
| Yahoo | `yahoo.` | Y! |

### Direct
- Pas de referrer = `direct`

---

## 📱 Détection des Devices

### Rules

```javascript
// Mobile
if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent))

// Tablet
if (/tablet|ipad|playbook|silk/i.test(userAgent))

// Desktop
// Everything else
```

### OS Detection

| Pattern | OS |
|---------|-----|
| `windows` | Windows |
| `macintosh|mac os x` | macOS |
| `linux` | Linux |
| `android` | Android |
| `iphone|ipad|ipod` | iOS |

### Browser Detection

| Pattern | Browser |
|---------|---------|
| `chrome` (not edge/brave) | Chrome |
| `safari` (not chrome) | Safari |
| `firefox` | Firefox |
| `edge` | Edge |

---

## 🔄 Workflow de Tracking

### 1. Clic sur Lien d'Affiliation

```
User clic sur: https://elsayf.statlabo.com/register?ref=fb-page-reda-123
           ↓
AffiliateTracker.js détecte le paramètre ?ref
           ↓
POST /api/tracking/click-v2
{
  code: "fb-page-reda-123",
  landingPage: "/register",
  utmSource: "facebook",
  utmMedium: "social",
  utmCampaign: "campus_python"
}
           ↓
Server détecte:
- Device (mobile/tablet/desktop)
- OS (iOS/Android/Windows/etc.)
- Browser (Chrome/Safari/etc.)
- Source (facebook/instagram/etc.)
- IP Address
- Session ID
           ↓
Crée AffiliateClick entry
           ↓
Incrémente clicks sur AffiliateLink
           ↓
Set cookies:
- ref_code=fb-page-reda-123 (30 days)
- ref_click_id={clickId} (30 days)
```

### 2. Inscription

```
User s'inscrit
           ↓
POST /api/register ou /api/register/python
           ↓
Lit cookie ref_code
           ↓
Crée User avec referredByCode
           ↓
Incrémente registrations sur AffiliateLink
           ↓
Marque AffiliateClick.converted = true
           ↓
Marque AffiliateClick.convertedAt = now()
```

### 3. Analytics

```
Super Admin va sur /super-admin/analytics
           ↓
GET /api/super-admin/affiliate-links
           ↓
GET /api/tracking/click-v2?days=30
           ↓
Affiche:
- KPIs
- Graphiques
- Top Performers
- Clics récents
```

---

## 📊 Export des Données

### Depuis le Dashboard

1. Allez sur `/super-admin/analytics`
2. Cliquez "Exporter"
3. Téléchargez le fichier JSON

### Contenu de l'Export

```json
{
  "stats": {
    "total": 1234,
    "byDevice": { "mobile": 456, "tablet": 123, "desktop": 655 },
    "byOS": { "Windows": 400, "Android": 350, "iOS": 300 },
    "byBrowser": { "Chrome": 600, "Safari": 400 },
    "bySource": { "facebook": 300, "instagram": 250, "google": 200 },
    "conversions": 45,
    "conversionRate": "3.65"
  },
  "clicks": [...],
  "links": [...],
  "exportedAt": "2026-01-31T12:00:00.000Z"
}
```

---

## 🧪 Tester le Tracking

### Via cURL

```bash
# Simuler un clic depuis Facebook mobile
curl -X POST http://localhost:3000/api/tracking/click-v2 \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1" \
  -H "Referer: https://www.facebook.com/" \
  -d '{
    "code": "fb-page-reda-123",
    "landingPage": "/register",
    "utmSource": "facebook",
    "utmMedium": "social"
  }'
```

### Via le Navigateur

1. Ouvrez les DevTools (F12)
2. Alsez sur l'onglet Network
3. Visitez : `https://elsayf.statlabo.com/register?ref=test-code`
4. Vérifiez la requête POST vers `/api/tracking/click-v2`
5. Vérifiez les cookies créés

---

## 🎨 Personnalisation

### Ajouter une Nouvelle Source

Dans `src/app/api/tracking/click-v2/route.js`:

```javascript
if (referrerLower.includes('votre-site.com')) {
    source = 'votre-source';
}
```

### Ajouter un Device Type

```javascript
if (/votre-pattern/i.test(userAgent)) {
    deviceType = 'votre-device';
}
```

---

## 📈 Métriques Clés

### Pour les Affiliés

- **Clics** : Nombre de personnes qui ont cliqué
- **Conversions** : Nombre d'inscriptions attribuées
- **Taux de Conversion** : Conversions / Clics × 100
- **Revenue** : Si payant, conversions × commission

### Pour l'Admin

- **Top Sources** : Quels réseaux apportent le plus de trafic
- **Top Devices** : Mobile vs Desktop
- **Top Affiliés** : Meilleurs performeurs
- **Meilleures Pages** : Landing pages qui convertissent le plus

---

## 🔗 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/tracking/click-v2` | POST | Track un clic d'affiliation |
| `/api/tracking/click-v2?days=30` | GET | Stats des clics |
| `/api/super-admin/affiliate-links` | GET | Liste des liens d'affiliation |
| `/api/super-admin/analytics` | GET | Analytics complets |

---

## 📂 Fichiers Créés

```
src/
├── app/
│   ├── api/
│   │   ├── super-admin/affiliate-links/route.js  # API liens
│   │   └── tracking/click-v2/route.js           # API tracking v2
│   ├── super-admin/analytics/page.js             # Dashboard analytics
│   └── register/
│       ├── route.js                              # API register (mis à jour)
│       └── python/route.js                      # API Python (mis à jour)
├── components/
│   └── AffiliateTracker.js                       # Tracking client (mis à jour)
└── prisma/schema.prisma                          # + AffiliateClick model

AFFILIATE_ANALYTICS_GUIDE.md                      # Ce fichier
```

---

## 🚀 Déploiement

Le système est déjà déployé ! Allez sur :

**Dashboard Analytics :**
```
https://elsayf.statlabo.com/super-admin/analytics
```

**Testez un lien :**
```
https://elsayf.statlabo.com/register?ref=test-link-123
```

---

**✅ Tout est déployé et fonctionnel !**
