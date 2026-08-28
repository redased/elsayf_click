# 🐳 Guide d'installation Docker & GitHub

## 1. Installation avec Docker

Ce projet est configuré pour fonctionner avec Docker Compose, ce qui isole l'environnement de développement.

### Pré-requis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine.

### Lancer le projet
Ouvrez un terminal à la racine du projet et lancez :

```bash
docker-compose up --build
```

Cela va :
1. Construire les images (Next.js + Python Backend).
2. Installer les dépendances (y compris `zod` et autres).
3. Lancer le site sur [http://localhost:3000](http://localhost:3000).

> **Note :** La base de données SQLite `dev.db` est partagée entre votre machine et le conteneur via le montage de volume.

### Commandes utiles
- **Arrêter** : `Ctrl+C` ou `docker-compose down`
- **Accéder au shell** : `docker-compose exec web sh`
- **Reset DB** : `docker-compose exec web npx prisma migrate reset`

---

## 2. Héberger sur GitHub

Voici les étapes pour mettre ce projet sur votre GitHub.

1.  **Créer un nouveau Repository** sur GitHub (ex: `e-learning-platform`).
2.  **Initialiser Git** (si ce n'est pas fait) :
    ```bash
    git init
    git add .
    git commit -m "Initial commit - E-learning platform"
    ```
3.  **Lier votre repo distant** :
    ```bash
    git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/e-learning-platform.git
    ```
4.  **Pousser le code** :
    ```bash
    git branch -M main
    git push -u origin main
    ```

### Ignorer les fichiers sensibles
Le fichier `.gitignore` est déjà configuré pour ignorer `node_modules`, `.env`, et la base de données locale. **Assurez-vous de ne jamais commiter vos clés API.**

---

## 3. Déploiement sur VPS avec Git (Recommandé)

Vous POUVEZ tout à fait utiliser Git sur votre VPS (`elsayf.statlabo.com`). C'est même plus simple pour les mises à jour.

### Sur le VPS
1.  **Installer Git** (si nécessaire) :
    ```bash
    apt-get update && apt-get install git -y
    ```
2.  **Cloner le projet** :
    ```bash
    cd /var/www/elsayf
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/e-learning-platform.git .
    ```
    *(Si le dossier n'est pas vide, clonez d'abord ailleurs ou videz-le)*

3.  **Lancer avec Docker** :
    ```bash
    docker-compose up -d --build
    ```

### Mettre à jour par la suite
Quand vous faites des modifications sur votre PC :
1.  `git push` depuis votre PC.
2.  Sur le VPS :
    ```bash
    git pull
    docker-compose up -d --build
    ```

