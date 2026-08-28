# Tâche : Ajout du support Multilingue (FR, EN, AR)

## Objectif
Ajouter le support des langues Français, Anglais et Arabe sur l'ensemble du site (Public + Admin).

## Stratégie
Utilisation de l'API Context de React pour gérer la langue globale sans refonte massive du routage (pas de /[locale]/... pour l'instant pour éviter de casser les liens existants).

## Étapes
1.  [ ] Créer le fichier de traductions (`src/lib/translations.js`).
2.  [ ] Créer le Context (`src/context/LanguageContext.js`).
3.  [ ] Créer le composant Switcher de langue (`src/components/LanguageSwitcher.js`).
4.  [ ] Intégrer le Provider dans `src/app/layout.js`.
5.  [ ] Ajouter le Switcher dans la Navbar (`src/components/Navbar.js`).
6.  [ ] Traduire la page d'accueil (`src/app/page.js`).
7.  [ ] Traduire le Dashboard Admin (`src/app/admin/layout.js` ou page).
8.  [ ] Vérifier le support RTL pour l'Arabe.

