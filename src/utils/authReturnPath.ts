export const AUTH_RETURN_STORAGE_KEY = 'authReturnTo';

export const ELECTRON_LAST_ROUTE_KEY = 'electron:lastRoute';

const PUBLIC_READER_PATHS = new Set(['/bible-online', '/read']);

export const getSafeReturnPath = (
  path?: string | null,
  fallback = '/bible-online'
): string => {
  if (!path) return fallback;
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return fallback;
  }
  return path;
};

export const saveAuthReturnPath = (path: string) => {
  sessionStorage.setItem(
    AUTH_RETURN_STORAGE_KEY,
    getSafeReturnPath(path, '/bible-online')
  );
};

export const readAuthReturnPath = (fallback = '/bible-online'): string => {
  const stored = sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY);
  return getSafeReturnPath(stored, fallback);
};

export const clearAuthReturnPath = () => {
  sessionStorage.removeItem(AUTH_RETURN_STORAGE_KEY);
};

export const isValidElectronPersistedRoute = (path: string) =>
  PUBLIC_READER_PATHS.has(path.split('?')[0].split('#')[0]);

export const persistElectronLastRoute = (pathname: string) => {
  if (!isValidElectronPersistedRoute(pathname)) return;
  sessionStorage.setItem(ELECTRON_LAST_ROUTE_KEY, pathname);
};

export const getElectronBootstrapRoute = (): string => {
  const last = sessionStorage.getItem(ELECTRON_LAST_ROUTE_KEY);
  if (last && isValidElectronPersistedRoute(last)) {
    return last;
  }
  return '/bible-online';
};
