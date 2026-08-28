const { app, BrowserWindow, Menu, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

let mainWindow;
const appUrl = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../out/index.html')}`;

// Fonction pour créer la fenêtre principale
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/logo.png'),
    title: 'Elsayf - Plateforme E-Learning',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#ffffff',
    show: false
  });

  mainWindow.loadURL(appUrl);

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Envoyer un message de bienvenue
    if (process.platform !== 'darwin') {
      mainWindow.webContents.send('app-ready', {
        version: app.getVersion(),
        platform: process.platform
      });
    }
  });

  // Ouvrir les liens externes dans le navigateur par défaut
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // DevTools en développement
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Créer le menu de l'application
function createMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Tableau de Bord',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('navigate', '/dashboard');
          }
        },
        {
          label: 'Mes Cours',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow.webContents.send('navigate', '/dashboard/courses');
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' },
        { role: 'selectall', label: 'Tout sélectionner' }
      ]
    },
    {
      label: 'Vue',
      submenu: [
        { role: 'reload', label: 'Actualiser' },
        { role: 'forceReload', label: 'Actualisation forcée' },
        { role: 'toggleDevTools', label: 'Outils de développement' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { role: 'zoomIn', label: 'Zoom avant' },
        { role: 'zoomOut', label: 'Zoom arrière' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' }
      ]
    },
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Page d\'accueil',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.send('navigate', '/');
          }
        },
        {
          label: 'Éditeur de Code',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('navigate', '/dashboard/code');
          }
        },
        {
          label: 'Cours disponibles',
          click: () => {
            mainWindow.webContents.send('navigate', '/courses');
          }
        }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://elsayf.com');
          }
        },
        {
          label: 'Support',
          click: () => {
            shell.openExternal('mailto:support@elsayf.com');
          }
        },
        { type: 'separator' },
        {
          label: 'À propos',
          click: () => {
            const dialog = require('electron').dialog;
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos d\'Elsayf',
              message: 'Elsayf Desktop',
              detail: `Version: ${app.getVersion()}\nPlateforme E-Learning moderne\n\n© 2025 Elsayf. Tous droits réservés.`
            });
          }
        }
      ]
    }
  ];

  // Menu macOS
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'À propos d\'Elsayf' },
        { type: 'separator' },
        { role: 'services', label: 'Services' },
        { type: 'separator' },
        { role: 'hide', label: 'Masquer Elsayf' },
        { role: 'hideOthers', label: 'Masquer les autres' },
        { role: 'unhide', label: 'Afficher' },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter Elsayf' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Gestion de l'auto-update
function setupAutoUpdater() {
  if (isDev) return;

  // Vérifier les mises à jour au démarrage et toutes les 2 heures
  autoUpdater.checkForUpdates();
  setInterval(() => autoUpdater.checkForUpdates(), 2 * 60 * 60 * 1000);

  autoUpdater.on('checking-for-update', () => {
    console.log('[Updater] Vérification des mises à jour...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[Updater] Mise à jour disponible:', info.version);
    new Notification({
      title: 'Mise à jour disponible',
      body: `Version ${info.version} disponible. Téléchargement en cours...`
    }).show();
    // Informer l'interface web
    if (mainWindow) {
      mainWindow.webContents.send('update-downloading', { version: info.version });
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[Updater] Application à jour');
  });

  autoUpdater.on('download-progress', (progress) => {
    const percent = Math.round(progress.percent);
    if (mainWindow) {
      // Mise à jour de la barre de progression dans la taskbar
      mainWindow.setProgressBar(percent / 100);
      mainWindow.webContents.send('update-progress', { percent });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[Updater] Mise à jour téléchargée:', info.version);
    // Retirer la barre de progression
    if (mainWindow) mainWindow.setProgressBar(-1);

    // Informer l'interface web → affiche un banner "Redémarrer"
    if (mainWindow) {
      mainWindow.webContents.send('update-ready', { version: info.version });
    }

    // Notification OS
    new Notification({
      title: 'Mise à jour prête',
      body: `Version ${info.version} téléchargée. Cliquez sur "Redémarrer" dans l'application.`
    }).show();
  });

  autoUpdater.on('error', (err) => {
    console.error('[Updater] Erreur:', err.message);
  });
}

// IPC : l'utilisateur demande le redémarrage pour appliquer la MAJ
ipcMain.on('apply-update', () => {
  autoUpdater.quitAndInstall(false, true);
});

// Événements de l'application
app.whenReady().then(() => {
  createWindow();
  createMenu();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

// Gestion des notifications de navigation
ipcMain.on('navigate', (event, path) => {
  if (mainWindow) {
    mainWindow.webContents.send('navigate', path);
  }
});
