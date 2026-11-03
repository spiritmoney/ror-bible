import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true as const,
  platform: process.platform,
  openExternal: (url: string) => ipcRenderer.invoke('shell:open-external', url),
  readStrongsJson: (relativePath: string) =>
    ipcRenderer.invoke('strongs:load-json', relativePath),
  onAuthCallback: (handler: (url: string) => void) => {
    const listener = (_event: unknown, payload: string) => {
      handler(payload);
    };
    ipcRenderer.on('auth:callback-url', listener);
    return () => ipcRenderer.removeListener('auth:callback-url', listener);
  },
});
