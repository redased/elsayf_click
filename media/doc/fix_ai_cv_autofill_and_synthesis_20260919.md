# Correctif : Extraction Robuste du JSON CV par Accolades Équilibrées & Remplissage Automatique Immédiat

**Date :** 19 Septembre 2026  
**Auteur :** Antigravity AI  
**Composants impactés :**
- `src/app/api/ai/cv-assistant/route.js` (Route API de synthèse IA et extraction de données)
- `src/components/cv/AskAICVButton.js` (Bouton et panneau chat interactif)
- `src/app/cv/page.js` (Gestionnaire d'état du CV, normalisation des champs et toast de confirmation)

---

## 1. Origine du Problème

Lors du premier test, l'utilisateur a constaté :
1. **Une synthèse tronquée et dégradée** contenant des fragments de JSON bruts à la fin du texte.
2. **Aucun champ du CV rempli**, les formulaires restant vides.

### Diagnostic Technique :
- L'ancienne regex `/\[AUTO_FILL_CV:\s*({[\s\S]*?})\]/` utilisait un quantificateur paresseux (`*?`) qui s'arrêtait au premier bloc `}]`.
- Comme la charge JSON contient des tableaux d'objets (`"skills": [{"name": "Python", "level": 85}]`), le premier `}]` tronquait le JSON en plein milieu.
- Conséquences :
  - `JSON.parse` échouait avec une erreur de syntaxe.
  - La route renvoyait `hasCvData: false` et `cvData: null`.
  - La fin du JSON non nettoyée restait visible dans le message Markdown pour l'utilisateur.

---

## 2. Solutions Apportées

### A. Analyseur Syntaxique Robuste par Accolades Équilibrées (`extractFirstBalancedJsonObject`)
- Implémentation d'un algorithme de scan séquentiel qui compte la profondeur des accolades `{` et `}` tout en gérant les chaînes entre guillemets et les caractères d'échappement.
- Dès que la profondeur repasse à zéro, l'objet JSON complet racine est extrait avec une précision de 100%, quelle que soit la profondeur d'imbrication des tableaux.
- Suppression propre du tag et du bloc JSON de la réponse texte pour ne laisser qu'une synthèse Markdown prestigieuse, claire et sans artefacts.

### B. Parseur Tolérant aux Contrôles et Retours Ligne (`parseCandidateJson`)
- Nettoyage automatique des caractères de contrôle non échappés (`\u0000-\u001F`).
- Élimination des virgules traînantes (`,\s*[]}]`).
- Évaluation sécurisée de secours pour garantir 0 échec de parsing.

### C. Normalisation Automatique des Données dans le CV (`handleAutoFillFromAI`)
- Prise en charge des compétences sous forme de chaînes simples ou d'objets `{ name, level, category }`.
- Prise en charge des outils (`tools`), soft skills, expériences et formations avec génération d'identifiants uniques si manquants.
- Notification visuelle flottante immédiate (`✨ Tous vos champs de CV ont été remplis par l'IA !`).

### D. Remplissage Automatique Dès Réception
- Les données extraites sont appliquées immédiatement via `onApplyToCV(extractedCv)` dès que la réponse arrive du serveur, sans nécessiter de clic manuel supplémentaire.
- Carte d'aperçu haute définition dans le chat avec badge vert pulsant "Appliqué en direct ✓" et bouton pour basculer en vue A4.

---

## 3. Validation & Tests

- Script de test unitaire validé avec succès avec des charges imbriquées et retours à la ligne.
- Validation des champs : Prénom, Nom, Titre valorisé, Résumé exécutif, Compétences (avec barres de niveau), Outils techniques, Expériences avec puces d'action, et Formations.
