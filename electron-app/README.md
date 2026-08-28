# Elsayf Desktop Application

Application desktop pour la plateforme E-Learning Elsayf

## 🚀 Installation

```bash
cd electron-app
npm install
```

## 🛠️ Développement

```bash
# Lancer Next.js en mode dev
npm run dev

# Dans un autre terminal, lancer Electron
npm run start
```

## 📦 Build pour Production

### Windows
```bash
npm run dist:windows
```

### macOS
```bash
npm run dist:mac
```

### Linux
```bash
npm run dist:linux
```

### Toutes les plateformes
```bash
npm run dist
```

Les fichiers installables seront dans le dossier `dist/`

## 📁 Structure

```
electron-app/
├── electron/
│   ├── main.js       # Processus principal Electron
│   └── preload.js    # Script de sécurité (preload)
├── package.json      # Dépendances Electron
└── README.md         # Ce fichier
```

## ✨ Fonctionnalités

- ✅ Interface 100% native
- ✅ Menu application personnalisé
- ✅ Raccourcis clavier globaux
- ✅ Notifications desktop
- ✅ Ouverture des liens externes dans le navigateur
- ✅ Auto-update intégré
- ✅ Compatible Windows, macOS, Linux

## 🔧 Configuration

Les fichiers de build sont générés dans:
- `dist/` - Installateurs (.exe, .dmg, .AppImage)
- Configuration dans `package.json` > `build`

## 📝 Notes

- L'application utilise votre code Next.js existant
- En mode dev, elle se connecte à `http://localhost:3000`
- En production, elle utilise le build statique Next.js
