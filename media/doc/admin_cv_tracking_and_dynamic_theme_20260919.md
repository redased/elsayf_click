# Gestionnaire Admin CV & Personnalisation Dynamique du Design (MyCV.click)

**Date** : 19 Septembre 2026  
**Fonctionnalité** : Panel Admin CV, Suivi Télémétrique (Invités & Membres) & Thème Dynamique  
**Routes d'accès** :  
- **Admin Panel** : `https://elsayf.click/admin/cv`  
- **Site Public** : `https://mycv.click` et `https://elsayf.click/cv`  

---

## 1. Description du Besoin

L'administrateur souhaite :
1. **Changer dynamiquement le design de MyCV** directement depuis le panel Admin (sans toucher au code) tout en conservant le design par défaut actuel.
2. **Superviser l'activité des créations de CV** :
   - Voir qui a créé son CV et qui s'est connecté pour sauvegarder ses informations dans le Cloud.
   - Permettre aux visiteurs invités d'utiliser librement l'outil sans inscription obligatoire, tout en enregistrant leurs événements (téléchargements PDF, modèles choisis, métier du candidat).

---

## 2. Architecture des Données (Prisma / PostgreSQL)

### A. Modèle `CvProfile` (Profils Sauvegardés des Membres)
- `userId`, `userEmail`, `userName`
- `title` (ex: "Développeur Fullstack", "Comptable")
- `candidateName`
- `template`, `color`, `font`
- `dataJson` (Contenu structuré des expériences, formations, compétences)
- `configJson`
- `downloadsCount`
- `lastAction` (`SAVED`, `DOWNLOADED_PDF`, `PRINTED`)

### B. Modèle `CvEvent` (Télémétrie d'Activité Invités & Membres)
- `eventType` (`CREATE`, `DOWNLOAD_PDF`, `PRINT`, `SAVE_CLOUD`, `EXPORT_JSON`)
- `userType` (`GUEST` pour visiteur non inscrit, `REGISTERED` pour membre)
- `candidateTitle`, `candidateName`, `template`
- `deviceType` (`mobile`, `desktop`), `browser`

### C. Modèle `CvSiteSetting` (Thèmes & Réglages Dynamiques)
- `theme` (`dark-cyber`, `minimal-light`, `executive-navy`, `emerald-modern`, `sunset-gradient`)
- `primaryColor`, `accentColor`
- `heroTitle`, `heroSubtitle`
- `defaultTemplate`
- `showAtsGuide`, `showTemplates`, `showFaq`, `showAds`

---

## 3. Interfaces & Nouveaux Endpoints

### Endpoints API :
- `POST /api/cv/track` : Réceptionne les actions de création, téléchargement et impression. Synchronise automatiquement le profil si le membre est connecté.
- `GET /api/cv/settings` : Renvoie les réglages visuels dynamiques actifs sur `mycv.click`.
- `GET /api/admin/cv/stats` : Statistiques réservées aux administrateurs (KPIs, profils membres, flux d'activité invités).
- `POST /api/admin/cv/settings` : Met à jour les réglages de design en base de données.

### Interface Admin (`/admin/cv`) :
1. **Cartes KPIs** : Membres connectés, Actions des invités, Téléchargements PDF totaux, Thème actif.
2. **Onglet 1 - Membres Connectés** : Liste des profils sauvegardés avec recherche, nombre de téléchargements et modal d'inspection du CV.
3. **Onglet 2 - Flux d'Activité en Direct** : Suivi en temps réel des actions effectuées par les invités et membres avec badge de statut.
4. **Onglet 3 - Personnalisation Dynamique du Design** :
   - Sélecteur visuel de 5 thèmes (Dark Cyber, Minimalist Light, Executive Navy, Emerald Modern, Sunset Luxe).
   - Éditeur du titre Hero et sous-titre.
   - Interrupteurs pour activer/désactiver le guide ATS, la FAQ, et les annonces Google AdSense.

---

## 4. Sauvegardes & Fichiers

- **Dossier de sauvegarde** : `media/bbackup/admin_cv_tracking_and_dynamic_theme_20260919_1230/`
- **Fichiers modifiés / créés** :
  - `prisma/schema.prisma`
  - `src/app/api/cv/track/route.js`
  - `src/app/api/cv/settings/route.js`
  - `src/app/api/admin/cv/stats/route.js`
  - `src/app/api/admin/cv/settings/route.js`
  - `src/app/admin/cv/page.js`
  - `src/app/admin/page.js`
  - `src/app/cv/page.js`
