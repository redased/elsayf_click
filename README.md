# El Sayf - Platforme E-Learning

Plateforme d'apprentissage en ligne avec système d'affiliation et analytics avancés.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide](#démarrage-rapide)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Développement](#développement)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

El Sayf est une plateforme e-learning complète qui permet:

- **Gestion de cours** (Python, R Statistics)
- **Système d'authentification** (NextAuth)
- **Système d'affiliation** avec tracking avancé
- **Analytics** détaillés pour les affiliés
- **Paiement** (Chargily Pay)
- **Rôles** (Student, Admin, Super Admin, R-Stat Admin)

## ✨ Fonctionnalités

### Pour les étudiants
- Inscription et connexion
- Accès aux cours achetés
- Suivi de progression
- Certificats

### Pour les admins
- Gestion des utilisateurs
- Gestion des cours
- Gestion des affiliés
- Analytics détaillés

### Système d'affiliation
- Création de liens uniques
- Tracking des clics (v1 legacy + v2 avancé)
- Détection device/OS/browser/source
- Attribution des conversions (30 jours)
- Analytics par affilié
- Top performers

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/your-org/elsayf.git
cd elsayf

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos credentials

# Appliquer les migrations de la base de données
npx prisma generate
npx prisma db push

# (Optionnel) Seeder la base de données
npm run seed
```

### Lancer le serveur

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

### Documentation du système d'affiliation

- **[Guide de démarrage rapide](./docs/AFFILIATE_QUICKSTART.md)** - Pour commencer rapidement
- **[Documentation complète](./docs/AFFILIATE_SYSTEM_COMPLETE.md)** - Référence complète

### Autres documentation

- **[Guide des rôles](./DOCUMENTATION_ROLES.md)** - Rôles et permissions
- **[Guide Admin Debug](./ADMIN_DEBUG_GUIDE.md)** - Debug pour admins
- **[Guide Analytics](./AFFILIATE_ANALYTICS_GUIDE.md)** - Analytics affiliés
- **[Docker Guide](./README_DOCKER.md)** - Déploiement Docker

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────┤
│  /                 - Page d'accueil                     │
│  /register         - Inscription                        │
│  /admin/*          - Panel Admin                        │
│  /super-admin/*    - Panel Super Admin                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    API Routes                            │
├─────────────────────────────────────────────────────────┤
│  /api/auth/*        - NextAuth                          │
│  /api/register/*    - Inscription                       │
│  /api/tracking/*    - Affiliation tracking              │
│  /api/admin/*       - Admin endpoints                   │
│  /api/super-admin/* - Super Admin endpoints             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Prisma ORM                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL                            │
└─────────────────────────────────────────────────────────┘
```

### Schéma de la base de données

```prisma
// Principaux modèles
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  password  String
  role      Role     @default(STUDENT)
  // ...
}

model Course {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  price       Float
  // ...
}

model AffiliateLink {
  id              String   @id @default(cuid())
  code            String   @unique
  influencerName  String
  platform        String
  clicks          Int      @default(0)
  registrations   Int      @default(0)
  // ...
}

model AffiliateClick {
  id        String   @id @default(cuid())
  code      String
  device    String?
  os        String?
  browser   String?
  source    String?
  converted Boolean  @default(false)
  // ...
}
```

## 👥 Rôles

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `STUDENT` | Étudiant | Accès aux cours achetés |
| `ADMIN` | Administrateur | Gestion users, cours, affiliés, analytics |
| `SUPER_ADMIN` | Super Admin | Tous les droits + tests système |
| `R_STAT_ADMIN` | Admin R Statistics | Gestion cours R uniquement |

## 📊 Système d'affiliation

### Fonctionnalités

- **Tracking en deux versions:**
  - v1 (Legacy): Simple tracking par code
  - v2 (Avancé): Détection device/OS/browser/source

- **Attribution:**
  - Cookies de 30 jours
  - Last-click attribution
  - Tracking multi-device

- **Analytics:**
  - Stats par affilié
  - Répartition device/OS/browser/source
  - Top performers
  - Taux de conversion

### Tests unitaires

**12 tests** disponibles dans `Super Admin → Tests → Affiliation & Analytics`:

1. Création lien d'affiliation
2. Tracking clic v1
3. Tracking clic v2
4. Détection device
5. Détection OS
6. Détection browser
7. Détection source
8. Attribution conversion
9. Cookie tracking
10. Stats affiliate
11. Top performers
12. Export analytics

## 🛠️ Développement

### Structure du projet

```
elsayf/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Groupes de routes auth
│   │   ├── admin/             # Routes admin
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard étudiant
│   │   └── super-admin/       # Routes super admin
│   ├── components/            # Composants React
│   ├── lib/                   # Utilitaires
│   └── styles/                # Styles globaux
├── prisma/
│   ├── schema.prisma          # Schéma de la DB
│   └── seed*.js              # Scripts de seed
├── docs/                      # Documentation
└── public/                    # Fichiers statiques
```

### Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run start           # Serveur de production
npm run lint            # Linter ESLint

# Base de données
npx prisma generate     # Générer client Prisma
npx prisma db push      # Pousser le schéma
npx prisma studio       # UI Prisma Studio

# Tests
npm run test            # Exécuter les tests
```

### Variables d'environnement

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/elsayf"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Paiement (Chargily)
CHARGILY_API_KEY=your-chargily-api-key
CHARGILY_SECRET_KEY=your-chargily-secret

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Docker

```bash
# Builder l'image
docker build -t elsayf .

# Lancer le conteneur
docker run -p 3000:3000 --env-file .env elsayf
```

Voir [README_DOCKER.md](./README_DOCKER.md) plus de détails.

### Manuel

```bash
# Build
npm run build

# Démarrer
npm start
```

## 🧪 Tests

### Accéder aux tests

1. Connectez-vous en tant que Super Admin
2. Allez sur `/super-admin/tests`
3. Sélectionnez une suite de tests
4. Cliquez sur "Exécuter les tests"

### Suites de tests disponibles

- **Auth**: Tests d'authentification
- **Database**: Tests de connexion DB
- **API**: Tests des endpoints
- **Python**: Tests du cours Python
- **Email**: Tests d'envoi d'emails
- **Affiliation**: Tests du système d'affiliation (12 tests)

## 📈 Monitoring

### Logs

Les logs sont disponibles dans:
- Console du serveur
- Dashboard Vercel (si déployé)
- Logs applicatifs

### Analytics

- **Admin**: `/admin/analytics`
- **Super Admin**: `/super-admin/analytics`

## 🤝 Contribuer

1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question:
- Email: support@statlabo.com
- Issues: [GitHub Issues](https://github.com/your-org/elsayf/issues)

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation NextAuth](https://next-auth.js.org)

---

**Développé avec ❤️ par l'équipe StatLabo**
