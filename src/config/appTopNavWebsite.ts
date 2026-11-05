import { getWebsitePageUrl } from 'config/runtime';
import {
  WebsiteDownloadRoute,
  WebsiteFeaturesRoute,
  WebsitePricingRoute,
  WebsiteProductWebRoute,
} from 'screens/Website/websitePaths';

/** External Blog link — still used elsewhere (Website utility nav). */
export const ROR_BIBLE_BLOG_URL = 'https://blog.rorbible.plus';

/** App-shell top bar → staging website (DEFAULT_WEBSITE_ORIGIN). */
export const APP_TOP_NAV_WEBSITE_URLS = {
  features: () => getWebsitePageUrl(WebsiteFeaturesRoute),
  products: () => getWebsitePageUrl(WebsiteProductWebRoute),
  pricing: () => getWebsitePageUrl(WebsitePricingRoute),
  download: () => getWebsitePageUrl(WebsiteDownloadRoute),
  about: () => getWebsitePageUrl('/about'),
  contact: () => getWebsitePageUrl(WebsiteDownloadRoute, 'contact'),
} as const;

export type AppTopNavWebsiteKey = keyof typeof APP_TOP_NAV_WEBSITE_URLS;

/** Desktop / dropdown order after Bible Online. */
export const APP_TOP_NAV_WEBSITE_ORDER: ReadonlyArray<{
  label: string;
  key: AppTopNavWebsiteKey;
}> = [
  { label: 'Features', key: 'features' },
  { label: 'Products', key: 'products' },
  { label: 'Pricing', key: 'pricing' },
  { label: 'Download', key: 'download' },
  { label: 'About', key: 'about' },
  { label: 'Contact', key: 'contact' },
];

export const APP_TOP_NAV_DESKTOP_LABELS = [
  'Bible Online',
  ...APP_TOP_NAV_WEBSITE_ORDER.map(item => item.label),
] as const;
