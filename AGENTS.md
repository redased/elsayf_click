# AGENTS.md - Guide pour Agents de Codage

> Ce fichier contient les informations essentielles pour les agents AI travaillant sur le projet El Sayf (Esayf).
> Langue principale du projet : **Français** (code et documentation)

---

## Vue d'ensemble du projet

**El Sayf (Esayf)** est une plateforme e-learning complète avec :
- Gestion de cours (Python, R Statistics)
- Système d'authentification (NextAuth v5)
- Système d'affiliation avancé avec tracking
- Analytics détaillés
- Paiement intégré (Chargily Pay - gateway de paiement algérien)
- Système de rôles hiérarchique (Student, Admin, Super Admin, R-Stat Admin, Marketing Admin)

**URL de production** : https://elsayf.click

---

## Stack Technologique

### Frontend
- **Framework** : Next.js 16.1.3 (App Router)
- **React** : 19.2.3
- **Styling** : Tailwind CSS 4.1.18 + PostCSS
- **UI Components** : Heroicons, Lucide React
- **Animations** : Framer Motion

### Backend
- **Runtime** : Node.js 20
- **API** : Next.js API Routes (App Router)
- **Authentification** : NextAuth v5 (Auth.js) avec Prisma Adapter
- **ORM** : Prisma 5.19.0
- **Base de données** : SQLite (dev) / PostgreSQL (production)

### Services externes
- **AI** : OpenAI, Google Gemini, Z-AI
- **Real-time** : Pusher (chat/forum)
- **Paiement** : Chargily Pay (DZ)
- **Email** : SMTP (Hostinger/Gmail)
- **Analytics** : Google Analytics 4

### Python Backend (Bot Engine)
- **Framework** : Django 5.0 + Django REST Framework
- **Usage** : Scraping LinkedIn, services backend
- **Port** : 8000
- **URL** : `/api/bot/*` (proxied via Next.js)

---

## Structure du projet

```
elsayf/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Groupes de routes auth
│   │   ├── admin/                    # Panel Admin
│   │   │   ├── affiliates/           # Gestion affiliés
│   │   │   ├── courses/              # Gestion cours
│   │   │   ├── marketing/            # Dashboard marketing
│   │   │   ├── r-stat-access/        # Validation R Stat
│   │   │   └── ...
│   │   ├── api/                      # API Routes
│   │   │   ├── admin/                # Endpoints admin
│   │   │   ├── auth/[...nextauth]/   # NextAuth config
│   │   │   ├── courses/              # Cours API
│   │   │   ├── payments/             # Paiement + Webhook Chargily
│   │   │   ├── tracking/             # Affiliation tracking
│   │   │   │   ├── click/            # v1 Legacy
│   │   │   │   └── click-v2/         # v2 Avancé
│   │   │   └── super-admin/          # Super admin endpoints
│   │   ├── dashboard/                # Dashboard étudiant
│   │   ├── courses/                  # Pages publiques cours
│   │   ├── login/                    # Page connexion
│   │   ├── register/                 # Page inscription
│   │   └── super-admin/              # Panel Super Admin
│   │       └── tests/                # Tests unitaires UI
│   ├── components/                   # Composants React
│   │   ├── admin/                    # Composants admin
│   │   ├── AffiliateTracker.js       # Tracking affiliation
│   │   ├── CodeEditor.js             # Éditeur de code
│   │   ├── PythonIDE.js              # IDE Python
│   │   └── ...
│   ├── context/                      # React Context
│   ├── lib/                          # Utilitaires
│   │   ├── prisma.js                 # Client Prisma singleton
│   │   ├── pusher.js                 # Config Pusher
│   │   ├── gamification.js           # Système XP/Badges
│   │   └── translations.js           # I18n
│   └── auth.ts                       # Config NextAuth
├── prisma/
│   ├── schema.prisma                 # Schéma DB complet
│   ├── migrations/                   # Migrations Prisma
│   ├── dev.db                        # SQLite local
│   └── seed*.js                      # Scripts de seeding
├── backend-python/                   # Django Bot Engine
│   ├── bots/                         # Apps Django
│   ├── core/                         # Config Django
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── docs/                             # Documentation
│   ├── AFFILIATE_QUICKSTART.md
│   ├── AFFILIATE_SYSTEM_COMPLETE.md
│   └── ...
├── scripts/                          # Scripts utilitaires
├── tests/                            # Tests
├── public/                           # Fichiers statiques
├── media/                            # Uploads médias
├── Dockerfile                        # Image Docker Next.js
├── docker-compose.yml                # Stack complet
└── .env                              # Variables d'environnement
```

---

## Commandes de développement

```bash
# Installation
cd /root/elsayf
npm install

# Développement
npm run dev              # Serveur Next.js sur :3000

# Build et production
npm run build            # Build de production
npm start                # Serveur production (nécessite build)

# Base de données
npx prisma generate      # Générer le client Prisma
npx prisma db push       # Pousser le schéma vers la DB
npx prisma studio        # UI Prisma Studio (localhost:5555)
npx prisma migrate dev   # Créer une migration
npm run seed             # Seeder la base (défini dans package.json)

# Docker
docker-compose up -d     # Lancer toute la stack
```

---

## Configuration des variables d'environnement

Fichier `.env` principal :

```env
# Database
DATABASE_URL="file:./dev.db"                    # SQLite local
# DATABASE_URL="postgresql://..."               # Production

# NextAuth / Auth.js
AUTH_SECRET="change_me_to_something_secure"     # openssl rand -base64 32
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI APIs
GEMINI_API_KEY="..."
OPENAI_API_KEY="..."
Z_AI_API_KEY="..."

# Pusher (Real-time)
PUSHER_APP_ID="..."
NEXT_PUBLIC_PUSHER_KEY="..."
PUSHER_SECRET="..."
NEXT_PUBLIC_PUSHER_CLUSTER="eu"

# Chargily Pay (Paiement DZ)
CHARGILY_API_KEY="test_pk_..."
CHARGILY_SECRET_KEY="test_sk_..."
CHARGILY_MODE="test"                            # test | live
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Python Backend
PYTHON_BACKEND_URL="http://127.0.0.1:8000"

# SMTP Email
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="contact@statlabo.com"
SMTP_PASS="..."
EMAIL_FROM="Esayf Platform <contact@statlabo.com>"
```

---

## Architecture de la base de données

### Modèles principaux (Prisma)

```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  password        String?   // Hashé (bcryptjs)
  role            String    @default("STUDENT") 
  // Roles: STUDENT, ADMIN, SUPER_ADMIN, R_STAT_ADMIN, MARKETING_ADMIN
  
  // Access flags
  rStatAdminAccess Boolean @default(false)
  analyticsAccess  Boolean @default(false)
  rStatAccess      Boolean @default(false)
  pythonAccess     Boolean @default(false)
  geminiAccess     Boolean @default(true)
  openaiAccess     Boolean @default(true)
  affiliateAccess  Boolean @default(false)
  
  // Gamification
  xp              Int       @default(0)
  level           Int       @default(1)
  badges          String?   // JSON
  
  // Relations
  accounts        Account[]
  sessions        Session[]
  courseProgress  CourseProgress[]
  enrollments     CourseEnrollment[]
  payments        Payment[]
  createdLinks    AffiliateLink[]
  messages        Message[]
}

model Course {
  id          String   @id @default(cuid())
  title       String
  title_ar    String?
  title_en    String?
  slug        String   @unique
  price       Float
  isFree      Boolean  @default(false)
  isPublished Boolean  @default(false)
  lessons     Lesson[]
  enrollments CourseEnrollment[]
}

model AffiliateLink {
  id              String   @id @default(cuid())
  code            String   @unique
  platform        String   // Facebook, Instagram, etc.
  influencerName  String
  clicks          Int      @default(0)
  registrations   Int      @default(0)
  clickEvents     AffiliateClick[]
  creator         User     @relation(fields: [creatorId], references: [id])
}

model AffiliateClick {
  id              String   @id @default(cuid())
  linkId          String
  deviceType      String   // desktop, mobile, tablet
  os              String?  // Windows, macOS, iOS, Android
  browser         String?  // Chrome, Safari, Firefox
  source          String?  // facebook, instagram, google
  converted       Boolean  @default(false)
  link            AffiliateLink @relation(fields: [linkId], references: [id])
}

model Payment {
  id                    String   @id @default(cuid())
  chargilyCheckoutId    String   @unique
  status                String   // pending, paid, failed
  amount                Float    // DZD
  userId                String
  courseId              String
}

// ... et autres modèles (voir prisma/schema.prisma)
```

---

## Système de rôles et permissions

### Hiérarchie

```
SUPER_ADMIN (progdev97@gmail.com)
    ├── ADMIN
    │       └── STUDENT
    ├── MARKETING_ADMIN
    └── R_STAT_ADMIN
```

### Rôles définis

| Rôle | Clé DB | Permissions |
|------|--------|-------------|
| **Super Admin** | `SUPER_ADMIN` | Accès total, gestion des admins |
| **Admin** | `ADMIN` | Gestion cours, users, affiliés, analytics |
| **Marketing Admin** | `MARKETING_ADMIN` | Marketing, campagnes, affiliés |
| **R Stat Admin** | `R_STAT_ADMIN` | Validation inscriptions R Statistics |
| **Student** | `STUDENT` | Cours achetés, dashboard, forum |

### Vérification des rôles dans le code

```javascript
// API Routes
import { auth } from "@/auth";

export async function GET(request) {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // ... suite
}

// Vérification multi-rôles
const isAdmin = session?.user?.role === 'ADMIN' || 
                session?.user?.role === 'SUPER_ADMIN';
```

---

## Système d'affiliation

### Tracking

Deux versions de tracking coexistent :

**v1 (Legacy)** : `/api/tracking/click`
- Simple compteur de clics
- Body: `{ "code": "influencer-123" }`

**v2 (Avancé)** : `/api/tracking/click-v2`
- Détection device, OS, browser, source
- Cookies 30 jours pour attribution
- Analytics détaillés

### Composant de tracking

Le composant `AffiliateTracker.js` est inclus dans le layout racine et gère :
- La lecture du paramètre `?ref=CODE`
- L'appel API au tracking
- Le stockage des cookies

### Création d'un lien d'affiliation

```javascript
// POST /api/admin/affiliates
{
    "code": "influencer-123",
    "influencerName": "John Doe",
    "platform": "Instagram",
    "sourceType": "Story",
    "originalUrl": "/register"
}
```

---

## Authentification

### NextAuth v5 (Auth.js)

Configuration dans `src/auth.ts` :
- **Providers** : Google OAuth, Credentials (email/password)
- **Adapter** : PrismaAdapter
- **Session** : JWT strategy
- **Pages** : `/login`

### Utilisation

```javascript
import { auth, signIn, signOut } from "@/auth";

// Dans un Server Component
const session = await auth();

// Dans un Client Component
import { useSession } from "next-auth/react";
const { data: session } = useSession();
```

---

## Tests

### Tests unitaires intégrés

Localisation : `/super-admin/tests` (accessible uniquement aux SUPER_ADMIN)

**Suites de tests disponibles** :
- Auth (authentification)
- Database (connexion DB)
- API (endpoints)
- Python (cours Python)
- Email (envoi d'emails)
- Affiliation (12 tests complets)

### Exécution via API

```bash
curl -X POST http://localhost:3000/api/super-admin/run-tests \
  -H "Content-Type: application/json" \
  -d '{"testGroup": "affiliate"}'
```

---

## Déploiement

### Docker (Recommandé)

```bash
# Build et lancer
docker-compose up -d --build

# Services:
# - web (Next.js) :3000
# - bot-engine (Django) :8000
```

### Vercel

```bash
npm i -g vercel
vercel
```

### Manuel

```bash
npm run build
npm start
```

---

## Conventions de code

### Style
- **JS/React** : PascalCase pour composants, camelCase pour fonctions/variables
- **Fichiers** : camelCase pour les utilitaires, PascalCase pour les composants
- **CSS** : Tailwind classes (pas de CSS modules sauf exception)
- **API Routes** : Une route par fichier `route.js`

### Structure des fichiers

```javascript
// Composant React (Server Component par défaut)
export default async function Page() {
    const data = await fetchData();
    return <div>...</div>;
}

// API Route
import { NextResponse } from 'next/server';

export async function GET(request) {
    // ...
    return NextResponse.json({ data });
}

export async function POST(request) {
    const body = await request.json();
    // ...
    return NextResponse.json({ success: true });
}
```

### Imports
- Utiliser les aliases `@/` pour les imports depuis `src/`
- Ordre : React/Next → Libs externes → Locaux

---

## Points d'attention

### Sécurité
- Toutes les routes admin vérifient l'authentification ET le rôle
- Les mots de passe sont hashés avec bcryptjs
- Les cookies sont `httpOnly` et `secure` en production
- Le webhook Chargily vérifie la signature

### Performance
- Prisma client est un singleton (`src/lib/prisma.js`)
- Les images utilisent `next/image`
- Le build est en mode `standalone` pour Docker

### Données sensibles
- Ne jamais commiter le fichier `.env`
- Les credentials sont dans `.env` uniquement
- En production, utiliser des secrets Docker/Vercel

---

## Documentation complémentaire

- [README.md](./README.md) - Guide utilisateur complet
- [DOCUMENTATION_ROLES.md](./DOCUMENTATION_ROLES.md) - Système de rôles
- [AFFILIATE_ANALYTICS_GUIDE.md](./AFFILIATE_ANALYTICS_GUIDE.md) - Analytics affiliation
- [docs/AFFILIATE_SYSTEM_COMPLETE.md](./docs/AFFILIATE_SYSTEM_COMPLETE.md) - Affiliation
- [README_DOCKER.md](./README_DOCKER.md) - Déploiement Docker

---

## Contact et support

- **Email** : support@statlabo.com
- **Développeur principal** : progdev97@gmail.com (Super Admin)

---

*Dernière mise à jour : 2026-02-03*
