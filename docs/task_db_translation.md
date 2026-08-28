# Tâche : Support Multilingue Base de Données (Cours)

## Objectif
Permettre la traduction des cours (Titre, Description, Pré-requis, etc.) directment depuis la base de données et l'interface admin.

## Étapes
1.  [ ] Modifier `schema.prisma` pour ajouter les champs de traduction (`title_en`, `title_ar`, etc.) ou une table de traduction séparée. *Décision : Ajouter des colonnes suffixées pour simplifier sans join complexe pour l'instant.*
2.  [ ] Migrer la base de données.
3.  [ ] Mettre à jour `prisma/seed.js` avec des données traduites.
4.  [ ] Mettre à jour l'API `GET /api/public/courses/[slug]` pour renvoyer les données traduites selon la locale demandée (ou tout renvoyer et le front filtre).
5.  [ ] Mettre à jour la page publique du cours (`src/app/courses/[slug]/page.js`) pour afficher la bonne langue.
6.  [ ] Mettre à jour l'API Admin (`POST/PUT`) pour sauvegarder les traductions.
7.  [ ] Mettre à jour l'interface Admin (`src/app/admin/courses/page.js` ou composant d'édition) pour éditer les 3 langues.

## Champs à traduire
- `title` -> `title_fr` (defaut), `title_en`, `title_ar`
- `description` -> `description_fr`, `description_en`, `description_ar`
- `fullDescription` -> `fullDescription_fr`, `fullDescription_en`, `fullDescription_ar`
- `learningOutcomes` (JSON) -> Stocker un objet JSON avec structure `{fr: [], en: [], ar: []}` ou champs séparés. *Décision : Garder JSON mais structurer l'intérieur ou champs séparés ? Champs séparés plus clean pour Prisma.* -> `learningOutcomes_fr`, `learningOutcomes_en`, `learningOutcomes_ar`
- `requirements` -> `requirements_fr`, `requirements_en`, `requirements_ar`

