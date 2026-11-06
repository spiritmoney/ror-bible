/** Set when the document opened as an installed PWA / iOS home screen (session only). */
export const INSTALLED_LAUNCH_SESSION_KEY = 'rhapsody:installedLaunch';

export type InstalledLaunchMarker = 'pwa' | 'ios-standalone';

function readMarker(): InstalledLaunchMarker | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  const value = sessionStorage.getItem(INSTALLED_LAUNCH_SESSION_KEY);
  if (value === 'pwa' || value === 'ios-standalone') {
    return value;
  }
  return null;
}

export function hasInstalledLaunchInSession(): boolean {
  return readMarker() !== null;
}

/**
 * Records an installed-app launch for this tab session. Call once on startup.
 * A plain tab never calls this unless the URL has `?source=pwa` or iOS standalone.
 */
export function persistInstalledLaunchFromLocation(): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return;
  }

  const nav = navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) {
    sessionStorage.setItem(INSTALLED_LAUNCH_SESSION_KEY, 'ios-standalone');
    return;
  }

  try {
    if (new URLSearchParams(window.location.search).get('source') === 'pwa') {
      sessionStorage.setItem(INSTALLED_LAUNCH_SESSION_KEY, 'pwa');
    }
  } catch {
    /* ignore */
  }
}

/** @internal tests */
export function clearInstalledLaunchSessionForTests(): void {
  sessionStorage.removeItem(INSTALLED_LAUNCH_SESSION_KEY);
}
