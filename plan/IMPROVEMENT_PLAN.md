# Plan d'Amélioration de la Plateforme E-Learning

Ce document détaille les étapes pour transformer la plateforme actuelle en une solution E-learning premium, sociale et gamifiée.

## 1. Communication Temps Réel (Chat "Discord-like") 🚀
**Objectif** : Rendre le forum instantané sans rechargement de page.
- [ ] Installer `pusher` (backend) et `pusher-js` (frontend).
- [ ] Configurer les clés API Pusher dans `.env`.
- [ ] Backend : Déclencher un événement `chat-event` lors du `POST` d'un message.
- [ ] Frontend : S'abonner au canal `forum-channel` et mettre à jour l'état `messages` en direct.

## 2. Gamification & Engagement 🎮
**Objectif** : Motiver les élèves avec des niveaux et de l'XP.
- [ ] Base de données : Ajouter `xp`, `level`, `badges` au modèle `User`.
- [ ] Système de points :
    - +10 XP par message forum.
    - +50 XP par leçon terminée.
    - +100 XP par exercice réussi.
- [ ] UI : Ajouter une barre de progression de niveau dans la Sidebar et le Profil.
- [ ] Leaderboard : Page affichant le top 10 des étudiants.

## 3. Suivi de Progression des Cours 📈
**Objectif** : Que l'élève sache où il en est.
- [ ] Base de données : Créer un modèle `CourseProgress` (User <-> Course).
- [ ] UI : Ajouter une barre de progression sur les cartes de cours.
- [ ] UI : Marquer les vidéos/leçons comme "Vues".

## 4. Quiz & Évaluations 📝
**Objectif** : Valider les connaissances.
- [ ] Base de données : Modèles `Quiz`, `Question`, `Answer`, `UserQuizResult`.
- [ ] Interface Admin : Créateur de Quiz.
- [ ] Interface Élève : Passage de quiz à la fin des modules.

## 5. Certificats Automatisés 🎓
**Objectif** : Récompenser la réussite.
- [ ] Backend : Générer un PDF avec `jspdf` ou `pdf-lib` quand Progression = 100%.
- [ ] Design : Créer un template de certificat moderne.
- [ ] Dashboard : Onglet "Mes Certificats".

## 6. Paiements & Abonnements 💳
**Objectif** : Monétiser la plateforme.
- [ ] Intégration Stripe (Checkout).
- [ ] Gestion des accès aux cours (Payés vs Gratuits).

---
**Ordre d'exécution immédiat :**
1. Mise en place du Temps Réel (Chat).
2. Ajout du système d'XP de base.
