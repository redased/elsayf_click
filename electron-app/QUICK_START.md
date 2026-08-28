# 🚀 Guide de Démarrage Rapide - Elsayf Desktop

## 📋 Prérequis

- Node.js 18+ installé
- npm ou yarn

## ⚡ Installation Rapide

### 1. Installer les dépendances

```bash
cd electron-app
npm install
```

### 2. Lancer en développement

```bash
# Terminal 1 - Lancer Next.js
npm run dev

# Terminal 2 - Lancer Electron
npm run start
```

### 3. Créer les installateurs

```bash
# Windows (.exe)
npm run dist:windows

# macOS (.dmg)
npm run dist:mac

# Linux (.AppImage, .deb)
npm run dist:linux
```

Les fichiers installables seront dans `dist/`

## 🎯 Résultat

Après le build, vous aurez:

**Windows:**
- `Elsayf-1.0.0-win.exe` - Installateur NSIS
- `Elsayf-1.0.0-win.exe` - Version portable

**macOS:**
- `Elsayf-1.0.0-mac.dmg` - Image disque
- `Elsayf-1.0.0-mac.zip` - Archive

**Linux:**
- `Elsayf-1.0.0-linux.AppImage` - Application universelle
- `Elsayf-1.0.0-linux.deb` - Package Debian/Ubuntu
- `Elsayf-1.0.0-linux.rpm` - Package Fedora/RHEL

## 🔧 Personnalisation

Pour modifier l'icône, remplacez `public/logo.png`

Pour changer les infos de l'appli, modifiez `electron-app/package.json`:
- `name` - Nom de l'application
- `version` - Version
- `build.productName` - Nom affiché

## 📝 Notes

- La taille finale sera ~150-200 MB (inclut Node.js et Chromium)
- Premier build peut prendre 5-10 minutes
- Les builds suivants seront plus rapides
