#!/bin/bash

echo "🚀 Installation de l'application Elsayf Desktop..."
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js est installé"

# Créer le dossier s'il n'existe pas
if [ ! -d "electron-app" ]; then
    echo "📁 Création du dossier electron-app..."
    mkdir -p electron-app
fi

# Copier les fichiers nécessaires
echo "📋 Copie des fichiers..."
cp package.json electron-app/
cp -r public electron-app/
cp -r src electron-app/
cp next.config.js electron-app/
cp tailwind.config.js electron-app/ 2>/dev/null || true
cp postcss.config.js electron-app/ 2>/dev/null || true

# Installer les dépendances
echo "📦 Installation des dépendances..."
cd electron-app
npm install

echo ""
echo "✨ Installation terminée !"
echo ""
echo "🎯 Commandes disponibles:"
echo "   npm run dev          - Lancer en mode développement"
echo "   npm run start        - Lancer l'application Electron"
echo "   npm run dist:windows - Créer un installateur Windows"
echo "   npm run dist:mac     - Créer un installateur macOS"
echo "   npm run dist:linux   - Créer un installateur Linux"
echo ""
