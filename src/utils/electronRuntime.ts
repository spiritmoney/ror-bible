export function isBrowserDisplayTab(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: browser)').matches
  );
}

/** Packaged desktop app or Electron shell — not a normal browser tab. */
export function isRunningInElectron(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.electronAPI?.isElectron === true) return true;
  if (isBrowserDisplayTab()) return false;
  return navigator.userAgent.toLowerCase().includes(' electron/');
}

export function isPackagedElectronBundle(): boolean {
  return process.env.REACT_APP_IS_ELECTRON === 'true';
}
