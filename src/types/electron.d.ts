// Définitions TypeScript pour l'API Electron
interface ElectronAPI {
  getAppVersion(): Promise<string>;
  getAppPath(): Promise<string>;
  showNotification(title: string, body: string): Promise<void>;
  openExternal(url: string): Promise<void>;
  on(channel: string, callback: (...args: any[]) => void): void;
  send(channel: string, data: any): void;
  removeAllListeners(channel: string): void;
  isDesktop: boolean;
  platform: string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
