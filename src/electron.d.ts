export {};

declare global {
  interface Window {
    electronAPI?: {
      isElectron: true;
      platform: string;
      openExternal: (url: string) => Promise<void>;
      clearExternalOpenLog?: () => Promise<void>;
      getExternalOpenLog?: () => Promise<string[]>;
      readStrongsJson: (relativePath: string) => Promise<string>;
      onAuthCallback: (handler: (url: string) => void) => () => void;
    };
  }
}
