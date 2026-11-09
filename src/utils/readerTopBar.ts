/**
 * Reader (Bible app) routes that use the same top bar as PWA/Electron app shell,
 * including when opened in a normal browser tab. Marketing/website routes keep
 * the website header; `isAppShell()` must stay false in a tab so redirects work.
 *
 * Store and XML tooling stay on the marketing website header because they are
 * linked from public site navigation.
 */
const READER_APP_TOP_BAR_EXACT = new Set(['/bible-online', '/read']);

export function isReaderAppTopBarRoute(pathname: string): boolean {
  return READER_APP_TOP_BAR_EXACT.has(pathname);
}
