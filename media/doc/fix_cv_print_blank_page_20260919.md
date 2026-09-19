# Correctif : Résolution de la Page Blanche lors de l'Impression du CV

**Date :** 19 Septembre 2026  
**Auteur :** Antigravity AI  
**Composants impactés :**
- `src/components/cv/exportPDF.js` (`printViaIsolatedIframe`)
- `src/app/cv/page.js` (Règles `@media print` et conteneur de prévisualisation)
- `src/components/cv/CVPreview.js` (Classes de visibilité d'impression sur `#cv-printable-area`)

---

## 1. Origine du Problème

Lors du clic sur le bouton « Imprimer » ou lors de l'ouverture de la boîte de dialogue d'impression (`Microsoft Print to PDF` ou imprimante physique), la page générée apparaissait entièrement blanche.

### Causes Techniques Identifiées :
1. **Opacité nulle héritée dans l'iframe d'impression (`exportPDF.js`)** :  
   L'iframe cachée était configurée avec `opacity: 0.01;`. Sous Chromium / Chrome / Microsoft Edge, l'impression d'une iframe applique l'opacité parent du DOM. Une opacité de 0.01 rend le contenu imprimé quasiment invisible (100% blanc).
2. **Héritage destructeur de la règle `body * { visibility: hidden !important; }`** :  
   Lors de la capture de tous les styles CSS du document parent (`document.querySelectorAll('style')`), la règle globale `@media print` masquant tous les enfants de `body` était injectée dans l'iframe. Comme l'iframe contenait un conteneur nommé `cv-clean-wrapper` et non `cv-printable-area`, **tous les éléments enfants de l'iframe étaient forcés à `visibility: hidden !important;`**.
3. **Absence de `<base href>` dans l'iframe** :  
   L'iframe générée à la volée (`about:blank`) ne résolvait pas toujours correctement les feuilles de styles externes et polices Web relatives.
4. **Masquage en mode mobile/tablette** :  
   Sur les écrans où `activeMobileView === 'editor'`, la colonne d'aperçu portait la classe `.hidden`, empêchant l'affichage du CV même avec `visibility: visible`.

---

## 2. Solutions Apportées

### A. Refonte de `printViaIsolatedIframe` (`exportPDF.js`)
- L'iframe est positionnée hors-champ (`left: -9999px; top: 0; width: 210mm; height: 297mm;`) avec **`opacity: 1 !important; visibility: visible !important;`**.
- Filtrage préventif lors de la collecte des styles : les règles `STYLE` contenant `visibility: hidden` ou `body *` sont ignorées.
- Ajout de la balise `<base href="${window.location.origin}/">` dans le `<head>` de l'iframe.
- Forçage CSS systématique dans l'iframe :  
  `body, body *, #cv-printable-area, #cv-printable-area *, #cv-clean-wrapper, #cv-clean-wrapper * { visibility: visible !important; opacity: 1 !important; }`.
- Attente du chargement des polices (`document.fonts.ready`) avant le déclenchement de `iframe.contentWindow.print()`.

### B. Assainissement du CSS Print dans `page.js`
- Suppression du sélecteur universel destructeur `body * { visibility: hidden !important; }`.
- Masquage ciblé des éléments d'interface non imprimables (`header, nav, footer, .print:hidden, #guide-ats`).
- Application de `print:!block print:!w-full print:!col-span-12` sur la colonne d'aperçu pour garantir sa présence dans l'arbre de rendu même si le formulaire d'édition est actif.

---

## 3. Validation

- Test de l'injection DOM dans l'iframe avec opacité 100% et conteneur `#cv-printable-area`.
- Compatibilité validée pour l'export A4 vectoriel et la boîte de dialogue d'impression native du navigateur.
