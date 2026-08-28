# 🎯 Guide Rapide - Pricing Régional

## ✅ Ce qui a été implémenté

Vous avez maintenant un **système de pricing régional complet** sur **un seul domaine** (elsayf.statlabo.com) !

---

## 🚀 Accès rapide

### Pour vous (Super-Admin) :

1. **Gérer les plans d'abonnement** :
   - 🔗 https://elsayf.statlabo.com/super-admin/pricing
   - Créer/Modifier les plans Algérie, Europe, etc.
   - Définir prix, devise, durée

2. **Gérer l'accès aux cours** :
   - 🔗 https://elsayf.statlabo.com/super-admin/course-access
   - Choisir quels cours/leçons sont gratuits/payants
   - Définir les prix par région (DZ, EU)

3. **Dashboard principal** :
   - 🔗 https://elsayf.statlabo.com/super-admin
   - Nouveaux boutons : "Plans & Pricing" et "Accès Cours"

### Pour vos utilisateurs :

- **Page pricing publique** :
  - 🔗 https://elsayf.statlabo.com/pricing
  - Détection automatique de la région
  - Sélecteur manuel : 🇩🇿 Algérie / 🇪🇺 Europe / 🌍 Autre

---

## 📋 Plans créés par défaut

3 plans sont déjà configurés :

### 1️⃣ Gratuit avec Publicités (Mondial)
- **Prix** : 0 EUR/DZD
- **Accès** : Leçons marquées gratuites
- **Affichage** : Google Ads

### 2️⃣ Premium Algérie 🇩🇿
- **Prix** : 2500 DZD/mois
- **Paiement** : Chargily (CIB, eddahabia)
- **Support** : Arabe/Français

### 3️⃣ Premium Europe 🇪🇺
- **Prix** : 19 EUR/mois
- **Paiement** : Carte bancaire (Stripe)
- **Support** : Multilingue

---

## 🛠️ Comment configurer un cours ?

### Étape 1 : Aller sur la gestion des accès
1. Connectez-vous en tant que Super-Admin
2. Allez sur https://elsayf.statlabo.com/super-admin/course-access

### Étape 2 : Sélectionner un cours
- Cliquez sur un cours dans la liste de gauche

### Étape 3 : Configurer les prix régionaux
- **Type d'accès** : Choisissez entre
  - `100% Gratuit` : Accessible à tous sans pub
  - `Gratuit avec Google Ads` : Accessible avec pub
  - `Payant` : Nécessite abonnement

- **Prix par défaut** : Prix de base en DA
- **Prix Algérie (DZD)** : Prix pour les algériens (ex: 2500)
- **Prix Europe (EUR)** : Prix pour les européens (ex: 19)

### Étape 4 : Configurer les leçons
Pour chaque leçon, choisissez :
- `Hérite du cours` : Suit la config du cours (par défaut)
- `Gratuit` : Leçon gratuite même si le cours est payant (preview)
- `Payant` : Leçon payante même si le cours est gratuit
- `Gratuit + Ads` : Gratuit mais avec pub

**💡 Astuce** : Mettez la première leçon en "Gratuit" pour donner un aperçu !

---

## 🌍 Comment ça marche pour l'utilisateur ?

### Scénario 1 : Utilisateur algérien 🇩🇿
1. Visite `/pricing`
2. **Détection auto** → Région = ALGERIA
3. Voit :
   - Plan Gratuit : 0 DZD
   - Premium Algérie : **2500 DZD/mois** (Chargily)
4. Ne voit PAS le plan Europe

### Scénario 2 : Utilisateur français 🇫🇷
1. Visite `/pricing`
2. **Détection auto** → Région = EUROPE
3. Voit :
   - Plan Gratuit : 0 EUR
   - Premium Europe : **19 EUR/mois** (Stripe)
4. Ne voit PAS le plan Algérie

### Scénario 3 : Utilisateur peut changer manuellement
- Boutons : 🇩🇿 Algérie / 🇪🇺 Europe / 🌍 Autre
- Changement immédiat des plans affichés

---

## 💡 Cas d'usage pratiques

### Exemple 1 : Cours gratuit pour tous
```
✅ Type d'accès : "100% Gratuit"
✅ Toutes les leçons : "Hérite du cours"
→ Accessible sans abonnement ni pub
```

### Exemple 2 : Cours gratuit avec pub
```
✅ Type d'accès : "Gratuit avec Google Ads"
✅ Toutes les leçons : "Hérite du cours"
→ Accessible mais Google Ads affiché
```

### Exemple 3 : Cours payant avec preview
```
✅ Type d'accès : "Payant"
✅ Prix DZ : 2500 DZD
✅ Prix EU : 19 EUR
✅ Leçon 1 : "Gratuit" (preview)
✅ Autres leçons : "Hérite du cours" (payant)
→ Preview gratuit, reste payant
```

### Exemple 4 : Mix gratuit/payant
```
✅ Type d'accès : "Gratuit"
✅ Leçon 1-5 : "Hérite du cours" (gratuit)
✅ Leçon 6+ : "Payant"
→ Début gratuit, advanced payant
```

---

## 🎨 Personnaliser les plans

### Créer un nouveau plan

1. Allez sur `/super-admin/pricing`
2. Cliquez "Nouveau Plan"
3. Remplissez :
   - **Nom** (FR/AR/EN) : Ex: "Premium Tunisie"
   - **Région** : GLOBAL / ALGERIA / EUROPE
   - **Prix** : Ex: 3500
   - **Devise** : DZD / EUR / USD
   - **Durée** : Ex: 30 (jours)
   - **Actif** : Coché

4. Cliquez "Créer"

### Modifier un plan existant

1. Cliquez sur l'icône ✏️ (Edit)
2. Modifiez les champs
3. Cliquez "Mettre à jour"

### Désactiver un plan

1. Éditez le plan
2. Décochez "Plan actif"
3. Sauvegardez
→ Le plan n'apparaîtra plus sur `/pricing`

---

## 📊 Vérifier que tout fonctionne

### Test 1 : Page pricing
```bash
1. Ouvrir https://elsayf.statlabo.com/pricing
2. Vérifier : détection de région affichée
3. Vérifier : plans affichés correctement
4. Changer de région manuellement
5. Vérifier : plans mis à jour
```

### Test 2 : Super-admin pricing
```bash
1. Ouvrir https://elsayf.statlabo.com/super-admin/pricing
2. Vérifier : 3 plans visibles (Gratuit, DZ, EU)
3. Cliquer "Nouveau Plan"
4. Créer un plan test
5. Vérifier : plan apparaît dans la liste
```

### Test 3 : Gestion accès cours
```bash
1. Ouvrir https://elsayf.statlabo.com/super-admin/course-access
2. Sélectionner un cours
3. Modifier le type d'accès
4. Modifier une leçon
5. Vérifier : changements sauvegardés
```

---

## 🆘 Résolution de problèmes

### Problème : Plans non visibles sur /pricing
**Solution** :
1. Vérifier que les plans sont actifs (checkbox "Plan actif")
2. Vérifier que la région correspond (DZ vs EU)
3. Vider le cache du navigateur

### Problème : Détection de région incorrecte
**Solution** :
1. Utiliser le sélecteur manuel (boutons région)
2. La détection dépend de l'IP du serveur/proxy
3. En développement local, peut détecter "UNKNOWN"

### Problème : Impossible de modifier un cours
**Solution** :
1. Vérifier que vous êtes connecté en SUPER_ADMIN
2. Vérifier dans la console navigateur (F12) pour erreurs
3. Vérifier que PM2 est running : `pm2 list`

---

## 📞 Support

Si vous rencontrez un problème non listé ici :

1. Vérifier les logs PM2 :
   ```bash
   pm2 logs elsayf-web --lines 50
   ```

2. Redémarrer l'application :
   ```bash
   pm2 restart elsayf-web
   ```

3. Vérifier la base de données :
   ```bash
   npx prisma studio
   ```

---

## 🎉 Félicitations !

Votre système de pricing régional est maintenant opérationnel !

**Prochaines étapes suggérées** :
- [ ] Configurer vos cours existants (gratuit/payant)
- [ ] Ajuster les prix selon votre stratégie
- [ ] Intégrer Stripe pour l'Europe
- [ ] Tester le parcours utilisateur complet
- [ ] Communiquer les nouvelles offres 🚀

**Documentation complète** : `/root/elsayf/media/doc/systeme_pricing_regional.md`
