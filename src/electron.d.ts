export {};

declare global {
  interface Window {
    electronAPI?: {
      isElectron: true;
      platform: string;
      openExternal: (url: string) => Promise<void>;
      onAuthCallback: (handler: (url: string) => void) => () => void;
    };
  }
}
