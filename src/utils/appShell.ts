import { isElectron } from './general';

/**
 * True when running as the installed PWA or Electron shell — not a normal browser tab.
 */
export const isAppShell = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.electronAPI?.isElectron === true) {
    return true;
  }

  if (document.documentElement.classList.contains('is-electron')) {
    return true;
  }

  if (isElectron()) {
    return true;
  }

  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  const nav = navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) {
    return true;
  }

  return false;
};

export const APP_SHELL_READER_ROUTE = '/bible-online';

export const APP_SHELL_MARKETING_PATHS = new Set([
  '/',
  '/home',
  '/features',
  '/pricing',
  '/download',
  '/about',
  '/product',
  '/give',
  '/partner',
  '/products/web',
  '/products/mobile',
  '/products/desktop',
  '/products/voice',
]);
