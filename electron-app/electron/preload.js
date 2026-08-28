const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Informations sur l'application
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // Notifications
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),

  // Ouvrir un lien externe
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Navigation
  onNavigate: (callback) => ipcRenderer.on('navigate', (event, path) => callback(path)),

  // État de l'application
  isDesktop: true,
  platform: process.platform,

  // Envoyer un message au main process
  send: (channel, data) => ipcRenderer.send(channel, data),

  // Recevoir des messages du main process
  on: (channel, callback) => {
    const validChannels = ['app-ready', 'navigate', 'update-available', 'update-downloading', 'update-progress', 'update-ready'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // Nettoyer les listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Empêcher le drag & drop de fichiers externes
window.addEventListener('dragover', (e) => {
  e.preventDefault();
});

window.addEventListener('drop', (e) => {
  e.preventDefault();
});
