import { isElectron } from './general';
import { hasInstalledLaunchInSession } from './appShellInstalledLaunch';

export { persistInstalledLaunchFromLocation } from './appShellInstalledLaunch';

function matchesDisplayMode(...modes: string[]): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return modes.some(m => window.matchMedia(`(display-mode: ${m})`).matches);
}

/** Manifest start_url is `/bible-online?source=pwa`. A normal tab does not carry it. */
function openedFromManifestStartUrl(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('source') === 'pwa';
  } catch {
    return false;
  }
}

function iosHomeScreenLaunch(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

/**
 * `minimal-ui` and `window-controls-overlay` also match some browser tabs.
 * Count them only when this document was launched as the installed app.
 */
function ambiguousDisplayLaunchedInstalled(): boolean {
  if (!matchesDisplayMode('minimal-ui', 'window-controls-overlay')) {
    return false;
  }
  return (
    openedFromManifestStartUrl() ||
    iosHomeScreenLaunch() ||
    hasInstalledLaunchInSession()
  );
}

/**
 * True for the installed PWA, an iOS home-screen launch, or Electron.
 * A plain tab (`display-mode: browser`) is never the app shell. `fullscreen`
 * (including F11) does not count. The `is-electron` DOM class is not used here.
 */
export const isAppShell = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.electronAPI?.isElectron === true) {
    return true;
  }

  if (matchesDisplayMode('browser')) {
    return false;
  }

  if (isElectron()) {
    return true;
  }

  if (matchesDisplayMode('fullscreen')) {
    return false;
  }

  if (matchesDisplayMode('standalone') || iosHomeScreenLaunch()) {
    return true;
  }

  if (ambiguousDisplayLaunchedInstalled()) {
    return true;
  }

  return false;
};

export {
  APP_SHELL_MARKETING_PATHS,
  APP_SHELL_READER_ROUTE,
  shouldAppShellRedirectMarketingRoute,
} from './appShellRedirect';
