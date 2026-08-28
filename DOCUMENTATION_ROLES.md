# 📘 Documentation Système des Rôles - Esayf Platform

## 🎯 Vue d'ensemble

Le système de rôles de la plateforme Esayf permet de gérer les accès et permissions des utilisateurs de manière hiérarchique.

---

## 📊 Hiérarchie des Rôles

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER_ADMIN                                │
│              progdev97@gmail.com (Principal)                   │
│  └────────────────── Peut ajouter/supprimer tous les rôles     │
└─────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
    ┌─────▼───────┐  ┌──────▼──────┐  ┌───▼────────┐
    │   ADMIN     │  │MARKETING    │  │R_STAT_ADMIN │
    │  Standard   │  │_ADMIN       │  │             │
    └─────────────┘  └─────────────┘  └─────────────┘
          │
    ┌─────▼───────┐
    │  STUDENT    │
    └─────────────┘
```

---

## 📋 Description Détaillée des Rôles

### 1️⃣ **STUDENT** (Étudiant)
**Rôle par défaut** - Tous les nouveaux utilisateurs commencent ici.

**Accès:**
- ✅ Voir les cours (page d'accueil et /courses)
- ✅ S'inscrire aux cours (gratuits ou payants)
- ✅ Accéder au dashboard étudiant (/dashboard)
- ✅ Suivre sa progression
- ✅ Participer au forum
- ✅ Voir ses certificats
- ✅ Gagner des XP et monter de niveau

**Limitations:**
- ❌ Pas accès admin
- ❌ Pas gérer les autres utilisateurs
- ❌ Pas voir les statistiques globales

---

### 2️⃣ **R_STAT_ADMIN** (Admin R Statistics)
**Rôle spécialisé** - Validation des inscriptions au cours R Statistics.

**Pourquoi ça existe ?**
Le cours "R pour la Finance et les Statistiques" est gratuit mais nécessite une validation manuelle pour éviter les abus.

**Accès:**
- ✅ `/admin/r-stat` - Page de validation
- ✅ Voir les demandes d'inscription en attente
- ✅ Approuver une demande (créée l'inscription automatiquement)
- ✅ Rejeter une demande
- ✅ Voir la liste des utilisateurs inscrits
- ✅ Dashboard étudiant normal

**Comment on devient R_STAT_ADMIN:**
1. Se connecter avec Google Gmail au moins une fois
2. Le SUPER_ADMIN va sur `/admin/manage-admins`
3. Il entre l'email Gmail et sélectionne "R Stat Admin"
4. L'utilisateur se reconnecte et a accès à `/admin/r-stat`

**Pages accessibles:**
```
/dashboard                      ✅ Dashboard étudiant
/dashboard/courses/[slug]       ✅ Cours suivis
/dashboard/analytics             ✅ Analytics Python
/dashboard/forum               ✅ Forum
/admin/r-stat                   ✅ Validation R Stat (spécial)
/admin                           ❌ Dashboard admin principal
/admin/manage-admins             ❌ Gérer les admins
/admin/courses                   ❌ Gérer les cours
```

---

### 3️⃣ **MARKETING_ADMIN** (Admin Marketing)
**Rôle spécialisé** - Gestion marketing et affiliations.

**Accès:**
- ✅ `/admin/marketing` - Dashboard marketing
- ✅ Gérer les campagnes marketing
- ✅ Voir les leads et prospects
- ✅ Gérer les liens d'affiliation
- ✅ Voir les statistiques marketing

**Pages accessibles:**
```
/dashboard                      ✅ Dashboard étudiant
/admin/marketing                 ✅ Dashboard marketing
/admin/marketing/courses       ✅ Cours marketing
/admin/marketing/campaigns    ✅ Campagnes
/admin/marketing/leads        ✅ Leads
/admin/affiliates                ✅ Affiliés
```

---

### 4️⃣ **ADMIN** (Admin Standard)
**Rôle avancé** - Accès administrateur complet.

**Accès:**
- ✅ Dashboard admin principal (/admin)
- ✅ Gérer les invitations
- ✅ Gérer les cours
- ✅ Donner accès gratuit aux cours
- ✅ Voir toutes les statistiques
- ✅ Gérer les affiliés
- ✅ Configuration Analytics
- ✅ Configuration IA

**Pages accessibles:**
```
/dashboard                      ✅ Dashboard étudiant
/admin                          ✅ Dashboard admin
/admin/invitations               ✅ Gérer invitations
/admin/courses                   ✅ Gérer cours
/admin/grant-access              ✅ Accès gratuit
/admin/affiliates                ✅ Affiliés
/admin/analytics                  ✅ Analytics
/admin/ai-config                 ✅ Configuration IA
/admin/r-stat-access             ❌ (réservé SUPER_ADMIN)
/admin/manage-admins             ❌ (réservé SUPER_ADMIN)
```

---

### 5️⃣ **SUPER_ADMIN** (Super Admin)
**Rôle ultime** - Pouvoirs absolus sur la plateforme.

**Accès:**
- ✅ TOUT ce que ADMIN peut faire
- ✅ Gérer les autres admins (/admin/manage-admins)
- ✅ Ajouter/supprimer des R_STAT_ADMIN
- ✅ Ajouter/supprimer des MARKETING_ADMIN
- ✅ Ajouter/supprimer des ADMIN standard

**Compte principal:**
- Email: `progdev97@gmail.com` (ou celui défini comme admin principal)

**Pages accessibles:**
```
TOUTES les pages + /admin/manage-admins
```

---

## 🔄 Comment Ajouter un Admin

### Étape 1: L'utilisateur se connecte
L'utilisateur doit s'être connecté au moins une fois sur la plateforme avec son compte Google Gmail pour que son compte soit créé dans la base de données.

### Étape 2: Aller sur la page de gestion
Connectez-vous avec le compte SUPER_ADMIN et allez sur:
```
https://elsayf.statlabo.com/admin/manage-admins
```

### Étape 3: Ajouter l'admin
1. Entrez l'email Gmail de l'utilisateur
2. Sélectionnez le rôle:
   - **Super Admin** - Accès complet
   - **Marketing Admin** - Marketing & affiliations
   - **R Stat Admin** - Validation R Statistics
   - **Admin Standard** - Admin complet
3. Cliquez sur "Ajouter"

### Étape 4: L'utilisateur se reconnecte
L'utilisateur se déconnecte et se reconnecte avec son compte Google Gmail. Il a maintenant accès aux sections selon son rôle.

---

## 📱 Pages Admin Disponibles

| Page | Description | SUPER_ADMIN | ADMIN | MARKETING_ADMIN | R_STAT_ADMIN |
|------|-------------|-------------|-------|-----------------|---------------|
| `/admin` | Dashboard admin principal | ✅ | ✅ | ❌ | ❌ |
| `/admin/manage-admins` | Gérer les admins | ✅ | ❌ | ❌ | ❌ |
| `/admin/courses` | Gérer les cours | ✅ | ✅ | ✅ | ❌ |
| `/admin/grant-access` | Donner accès gratuit | ✅ | ✅ | ❌ | ❌ |
| `/admin/invitations` | Gérer invitations | ✅ | ✅ | ❌ | ❌ |
| `/admin/affiliates` | Gérer affiliés | ✅ | ✅ | ✅ | ❌ |
| `/admin/analytics` | Configurer Analytics | ✅ | ✅ | ❌ | ❌ |
| `/admin/ai-config` | Configurer IA | ✅ | ✅ | ❌ | ❌ |
| `/admin/r-stat-access` | Accès R Stat (ancien) | ✅ | ✅ | ❌ | ❌ |
| `/admin/marketing` | Dashboard marketing | ✅ | ❌ | ✅ | ❌ |
| `/admin/r-stat` | Validation R Stat | ✅ | ✅ | ❌ | ✅ |

---

## 🔐 Sécurité

### Vérification des Rôles

Toutes les APIs admin vérifient:
```javascript
if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Rôles Multiples
Un utilisateur peut cumuler des rôles en utilisant `rStatAdminAccess`:
```javascript
const isAdmin = session?.user?.role === 'ADMIN' ||
                 session?.user?.role === 'SUPER_ADMIN' ||
                 session?.user?.rStatAdminAccess === true;
```

---

## 🎨 Couleurs des Rôles (UI)

| Rôle | Couleur | Code |
|------|--------|------|
| Super Admin | 🟣 Purple | `#a78bfa` |
| Admin | 🔵 Indigo | `#6366f1` |
| Marketing Admin | 🟠 Orange | `#f97316` |
| R Stat Admin | 🔵 Blue | `#3b82f6` |
| Student | ⚫ Gray | `text-gray-400` |

---

## 📊 Champs Utilisateur en Base de Données

```prisma
model User {
  role            String    // "STUDENT", "ADMIN", "MARKETING_ADMIN", "R_STAT_ADMIN"
  rStatAdminAccess Boolean   // Accès R Stat (true/false)
  analyticsAccess Boolean   // Accès Analytics Python
  geminiAccess    Boolean   // Accès Gemini AI
  openaiAccess    Boolean   // Accès OpenAI
  xp              Int       // Points d'expérience
  level           Int       // Niveau actuel
  badges          String?   // JSON des badges
}
```

---

## 🚀 Prochaines Développements

- [ ] Page profil utilisateur
- [ ] Dashboard analytics avancé
- [ ] Système de notifications en temps réel
- [ ] Export des données admin
- [ ] Historique des actions admin
- [ ] Permissions plus granulaires

---

*Document généré automatiquement - Mis à jour le 2026-01-26*
