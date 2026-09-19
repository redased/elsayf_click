# Configuration Multi-Domaine `mycv.click` & Intégration Google AdSense Studio CV

**Date** : 19 Septembre 2026  
**Domaines cibles** : `https://mycv.click` et `https://elsayf.click/cv`  
**Serveur VPS** : `165.245.251.31` (Ubuntu 24.04 / Nginx / Node.js 20 / PM2)  
**ID Client AdSense** : `ca-pub-1168470266191675`  

---

## 1. Objectifs & Stratégie Business

1. **Achat & Exploitation de `mycv.click`** :
   - Offrir un point d'accès direct, rapide et mémorable vers le générateur de CV.
   - Capturer un trafic organique SEO ciblé (étudiants, professionnels, chercheurs d'emploi).
   - Servir de passerelle naturelle vers les formations certifiantes de `elsayf.click`.
2. **Conformité & Monétisation Google AdSense** :
   - Éviter le blocage par formulaire de connexion ("Auth Wall") qui provoquerait un rejet automatique par Google AdSense ("Contenu indisponible").
   - Accorder un **Mode Invité Libre** : création, pré-remplissage en 1 clic, personnalisation de couleurs/polices, export PDF A4 direct et impression sans filigrane.
   - Ajouter des sections de contenu éditorial à haute valeur ajoutée (Guide d'optimisation ATS, comparatif des 6 modèles, FAQ Recrutement).
   - Intégrer les blocs d'annonces `AdSenseAd` aux emplacements autorisés sans jamais coller aux boutons d'action (téléchargement / impression).

---

## 2. Architecture Technique

### A. Nginx sur le VPS (`/etc/nginx/sites-available/mycv`)
- Écoute sur le port 80 pour les domaines `mycv.click` et `www.mycv.click`.
- Proxy_pass transparent vers le port local `3002` (instance Next.js partagée `elsayf-web`).
- Configuration prête pour la génération automatique du certificat SSL Let's Encrypt via Certbot dès la propagation des DNS.

### B. Middleware Next.js Multi-Domaine (`src/middleware.js`)
- Détecte l'en-tête `host` contenant `mycv.click`.
- Réécriture transparente de la racine `/` vers la route `/cv`. L'utilisateur conserve l'URL propre `https://mycv.click/` dans son navigateur.
- Redirection de `/cv` vers `/` sur le domaine `mycv.click` pour éviter les doublons.
- Les requêtes sur `elsayf.click` continuent d'afficher la page d'accueil d'e-learning habituelle.

### C. Refonte du Studio CV (`src/app/cv/page.js`)
- Suppression du blocage d'accès `unauthenticated`.
- Bandeau d'état :
  - **Utilisateur connecté** : nom affiché et synchronisation Cloud activée.
  - **Visiteur invité** : confirmation de la sauvegarde locale `localStorage` avec liens discrets vers la connexion / inscription Elsayf.
- Balisage Schema.org JSON-LD (`WebApplication`) pour le référencement Google.
- Guide exhaustif pour passer les filtres ATS (Applicant Tracking Systems).
- Présentation détaillée des 6 modèles de CV (ModernTech, ExecutiveRH, DualColumn, etc.).
- FAQ interactive avec accordéons.
- 3 emplacements publicitaires `AdSenseAd` (Top Leaderboard, Middle Slot, Bottom Leaderboard).
- Styles `@media print` stricts masquant 100% des publicités et de la navigation lors du rendu PDF ou de l'impression.

### D. Métadonnées SEO Dédiées (`src/app/cv/layout.js`)
- Titre optimisé : *Créateur de CV en Ligne Gratuit & Professionnel | MyCV (Format A4 & ATS)*.
- Balises OpenGraph et meta description riches.

---

## 3. Actions Requises côté Utilisateur (DNS)

Dans le tableau de bord du registrar où `mycv.click` a été acheté :
1. **Ajouter un enregistrement `A`** :
   - Nom / Hôte : `@`
   - Type : `A`
   - Valeur : `165.245.251.31`
2. **Ajouter un enregistrement `CNAME` (ou `A`)** :
   - Nom / Hôte : `www`
   - Type : `CNAME` (ou `A`)
   - Valeur : `mycv.click` (ou `165.245.251.31`)

Dès que ces DNS sont propagés, la commande suivante sur le VPS installe le certificat HTTPS :
```bash
certbot --nginx -d mycv.click -d www.mycv.click --non-interactive --agree-tos -m contact@statlabo.com
```

---

## 4. Statut du Déploiement & Validation SSL en Production

- **Certificat SSL Let's Encrypt** : Installé avec succès pour `mycv.click` et `www.mycv.click`.
- **Renouvellement automatique** : Planifié par Certbot (tâche cron système).
- **URLs de production vérifiées** :
  - `https://mycv.click` -> HTTP 200 OK (Studio CV direct)
  - `https://www.mycv.click` -> HTTP 200 OK
  - `https://mycv.click/ads.txt` -> HTTP 200 OK (`google.com, pub-1168470266191675, DIRECT, f08c47fec0942fa0`)
  - `https://elsayf.click` -> HTTP 200 OK (Portail de formations)
  - `https://elsayf.click/cv` -> HTTP 200 OK (Studio CV Elsayf)

---

## 5. Fichiers Modifiés & Sauvegardes

- **Sauvegardes** : `media/bbackup/mycv_click_multidomain_setup_20260919_1200/`
- **Fichiers créés/modifiés** :
  - `src/middleware.js` (Nouveau)
  - `src/app/cv/layout.js` (Nouveau)
  - `src/app/cv/page.js` (Enrichi & Mode Invité)
  - `scripts/vps_setup_mycv_nginx.py` (Script config Nginx)
  - `scripts/vps_cmd.py` (Exécuteur de commandes SSH)
