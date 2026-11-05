export const GITHUB_RELEASE_OWNER = 'spiritmoney';
export const GITHUB_RELEASE_REPO = 'ror-bible';

const githubReleaseAssetUrl = (fileName: string): string =>
  `https://github.com/${GITHUB_RELEASE_OWNER}/${GITHUB_RELEASE_REPO}/releases/latest/download/${fileName}`;

/** Loveworld App Store — same app listing as Android share link. */
export const STORE_LOVEWORLD_APP_STORE_URL =
  'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4';

/** Google Play badge — Loveworld web store share link. */
export const STORE_GOOGLE_PLAY_URL =
  'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4';

export const STORE_APPLE_APP_STORE_URL =
  'https://apps.apple.com/ng/app/ror-bible/id1461993744';

export const STORE_URLS = {
  loveworld: STORE_LOVEWORLD_APP_STORE_URL,
  googlePlay: STORE_GOOGLE_PLAY_URL,
  appStore: STORE_APPLE_APP_STORE_URL,
} as const;

export const DESKTOP_RELEASE_ARTIFACTS = {
  windows: 'Rhapsody-Bible-Setup.exe',
  macAppleSilicon: 'Rhapsody-Bible-Apple-Silicon.dmg',
  macIntel: 'Rhapsody-Bible-Intel.dmg',
  linuxAppImage: 'Rhapsody-Bible.AppImage',
  linuxDeb: 'Rhapsody-Bible.deb',
} as const;

export const DESKTOP_DOWNLOAD_URLS = {
  windows: githubReleaseAssetUrl(DESKTOP_RELEASE_ARTIFACTS.windows),
  macAppleSilicon: githubReleaseAssetUrl(DESKTOP_RELEASE_ARTIFACTS.macAppleSilicon),
  macIntel: githubReleaseAssetUrl(DESKTOP_RELEASE_ARTIFACTS.macIntel),
  linuxAppImage: githubReleaseAssetUrl(DESKTOP_RELEASE_ARTIFACTS.linuxAppImage),
  linuxDeb: githubReleaseAssetUrl(DESKTOP_RELEASE_ARTIFACTS.linuxDeb),
} as const;

const RELEASES_PREFIX = `https://github.com/${GITHUB_RELEASE_OWNER}/${GITHUB_RELEASE_REPO}/releases/latest/download/`;

export function isDesktopReleaseDownloadUrl(href: string): boolean {
  return href.startsWith(RELEASES_PREFIX);
}
