# Correctif : Rétablissement de l'En-tête et Calibrage Pleine Page A4 à l'Impression

**Date :** 19 Septembre 2026  
**Auteur :** Antigravity AI  
**Composants impactés :**
- `src/components/cv/exportPDF.js` (`printViaIsolatedIframe`)
- `src/app/cv/page.js` (Règles `@media print` et exclusion des en-têtes de templates)

---

## 1. Origine du Problème

Lors de l'ouverture de la boîte d'impression (`Microsoft Print to PDF` / Aperçu du navigateur) :
1. **L'en-tête du CV était complètement invisible** : Le nom du candidat, la photo, le titre visé, les coordonnées de contact et la biographie n'apparaissaient pas. La page commençait directement par « Parcours & Expérience ».
2. **Le document ne prenait pas toute la page** : Des marges blanches excessives entouraient le contenu, et la moitié inférieure de la feuille restait vide.

### Causes Techniques Identifiées :
1. **Sélecteur CSS destructeur `header { display: none !important; }`** :  
   Pour masquer la barre de navigation du site (`<header className="sticky...">`), une règle CSS globale `@media print` ciblait la balise brute `header`. Or, tous les 6 modèles de CV utilisent une balise HTML5 `<header>` pour leur bloc d'identité (Nom, Photo, Titre, Contact). Cette règle masquait donc l'en-tête du CV lui-même !
2. **Syntaxe invalide dans `@page` (`margin: 0mm !important;`)** :  
   Selon la spécification W3C CSS Paged Media, la directive `!important` est interdite dans `@page`. Sa présence provoquait l'invalidation totale de la règle par le moteur Chromium/Edge, qui réappliquait ses marges par défaut de 1 cm, écrasant et réduisant l'échelle du document A4 (210mm).
3. **Absence d'expansion en hauteur du gabarit** :  
   Sans contrainte de hauteur pleine page (`height: 297mm`), le conteneur flex ne distribuait pas les éléments verticalement sur toute la feuille A4.

---

## 2. Solutions Apportées

### A. Filtrage et Rétablissement de l'En-tête (`exportPDF.js` & `page.js`)
- Remplacement du sélecteur universel par un ciblage précis de la barre de navigation du site : `header.sticky, nav, footer:not(#cv-printable-area *)`.
- Forçage explicite de l'en-tête et du pied de page du CV :  
  `header, footer, [class*="header"], [class*="banner"] { display: block !important; visibility: visible !important; opacity: 1 !important; }`.
- Filtrage préventif dans `exportPDF.js` pour exclure toute balise de style parente contenant des directives de masquage de `header`.

### B. Calibrage Pleine Page A4 Standardisé (210mm x 297mm)
- Correction de la règle `@page` en syntaxe conforme :  
  `@page { size: A4 portrait; margin: 0; }` (sans `!important`).
- Calibrage du conteneur racine de l'iframe à `width: 210mm !important; height: 297mm !important;`.
- Application d'un layout flex pleine hauteur sur le template :  
  `display: flex !important; flex-direction: column !important; justify-content: space-between !important; min-height: 297mm !important; height: 297mm !important;` pour que le contenu occupe harmonieusement toute la hauteur de la feuille du haut jusqu'au bas.

---

## 3. Validation

- En-tête visible : Nom complet, titre valorisé, badges, avatar et coordonnées de contact restaurés à 100%.
- Le contenu s'étend désormais de bord à bord (210mm) et sur toute la hauteur (297mm) de la feuille A4 sans déformation.
