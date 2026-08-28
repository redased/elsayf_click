@echo off
echo 🚀 Installation de l'application Elsayf Desktop...
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer d'abord:
    echo    https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js est installé
echo.

REM Installer les dépendances
echo 📦 Installation des dépendances...
cd electron-app
call npm install

echo.
echo ✨ Installation terminée !
echo.
echo 🎯 Commandes disponibles:
echo    npm run dev          - Lancer en mode développement
echo    npm run start        - Lancer l'application Electron
echo    npm run dist:windows - Créer un installateur Windows
echo.
pause
