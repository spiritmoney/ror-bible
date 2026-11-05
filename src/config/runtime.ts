import { getEnv, isElectron } from 'utils/general';

/** Firebase Hosting origin used for static assets and Hosting rewrites in desktop builds. */
const DEFAULT_HOSTING_ORIGIN = 'https://rhapsodybible.web.app';

/** Cloud Functions region/project defaults for Espees rewrite targets (defer payment UI; URLs ready). */
const DEFAULT_FUNCTIONS_ORIGIN =
  'https://us-central1-kjv-strongs-reader.cloudfunctions.net';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

/**
 * Origin for relative API paths (/proxy, /espees/*) in the packaged desktop app.
 * On web, return empty string so callers keep relative URLs (Hosting rewrites / dev proxy).
 */
export const getApiOrigin = (): string => {
  if (!isElectron()) {
    return '';
  }
  return trimTrailingSlash(
    getEnv('ELECTRON_HOSTING_ORIGIN', DEFAULT_HOSTING_ORIGIN)
  );
};

export const resolveApiPath = (pathname: string): string => {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const origin = getApiOrigin();
  return origin ? `${origin}${path}` : path;
};

export const getProxyUrl = (targetUrl: string): string =>
  resolveApiPath(`/proxy?url=${encodeURIComponent(targetUrl)}`);

export const getEspeesCreateProductUrl = (): string =>
  resolveApiPath(
    getEnv(
      'ESPEES_CREATE_PRODUCT_PATH',
      '/espees/create-product'
    )
  );

export const getEspeesConfirmPaymentUrl = (): string =>
  resolveApiPath(
    getEnv(
      'ESPEES_CONFIRM_PAYMENT_PATH',
      '/espees/confirm-payment'
    )
  );

/** Optional override for the full Cloud Functions base (Espees deferred). */
export const getFunctionsOrigin = (): string =>
  trimTrailingSlash(
    getEnv('ELECTRON_FUNCTIONS_ORIGIN', DEFAULT_FUNCTIONS_ORIGIN)
  );

/** Public Hosting base for Strong's assets fetched on demand in desktop. */
export const getHostingOrigin = (): string => getApiOrigin() || DEFAULT_HOSTING_ORIGIN;

export const resolveHostingAssetPath = (assetPath: string): string => {
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${getHostingOrigin()}${normalized}`;
};

/** Live marketing website (Firebase Hosting site in firebase.json → *.web.app). */
export const DEFAULT_WEBSITE_ORIGIN = 'https://rhapsodybiblestaging.web.app';

export const getWebsiteOrigin = (): string =>
  trimTrailingSlash(getEnv('WEBSITE_ORIGIN', DEFAULT_WEBSITE_ORIGIN));

export const getWebsitePageUrl = (pathname: string, hash?: string): string => {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const hashPart = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
  return `${getWebsiteOrigin()}${path}${hashPart}`;
};
