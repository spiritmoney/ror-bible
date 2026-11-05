/** Marketing paths that app shell (Electron / installed PWA) sends to the Bible reader. */
export const APP_SHELL_MARKETING_PATHS = new Set([
  '/',
  '/home',
  '/features',
  '/pricing',
  '/download',
  '/products/web',
  '/products/mobile',
  '/products/desktop',
  '/products/voice',
]);

export const APP_SHELL_READER_ROUTE = '/bible-online';

const CONTACT_HASH = '#contact';

/** True when app shell should bounce this location to the reader route. */
export const shouldAppShellRedirectMarketingRoute = (
  pathname: string,
  hash: string
): boolean => {
  if (!APP_SHELL_MARKETING_PATHS.has(pathname)) {
    return false;
  }

  if (pathname === '/download') {
    const normalized = hash.toLowerCase();
    if (normalized === CONTACT_HASH || normalized === 'contact') {
      return false;
    }
  }

  return true;
};
