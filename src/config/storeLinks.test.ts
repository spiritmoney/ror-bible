import {
  DESKTOP_DOWNLOAD_URLS,
  DESKTOP_RELEASE_ARTIFACTS,
  GITHUB_RELEASE_OWNER,
  GITHUB_RELEASE_REPO,
  STORE_URLS,
} from './storeLinks';

const releaseBase = `https://github.com/${GITHUB_RELEASE_OWNER}/${GITHUB_RELEASE_REPO}/releases/latest/download`;

describe('storeLinks config', () => {
  it('exposes mobile store URLs', () => {
    expect(STORE_URLS.appStore).toBe(
      'https://apps.apple.com/ng/app/ror-bible/id1461993744'
    );
    expect(STORE_URLS.googlePlay).toBe(
      'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4'
    );
    expect(STORE_URLS.loveworld).toBe(STORE_URLS.googlePlay);
  });

  it('builds fixed desktop release URLs', () => {
    expect(DESKTOP_DOWNLOAD_URLS.windows).toBe(
      `${releaseBase}/${DESKTOP_RELEASE_ARTIFACTS.windows}`
    );
    expect(DESKTOP_DOWNLOAD_URLS.macAppleSilicon).toBe(
      `${releaseBase}/${DESKTOP_RELEASE_ARTIFACTS.macAppleSilicon}`
    );
    expect(DESKTOP_DOWNLOAD_URLS.macIntel).toBe(
      `${releaseBase}/${DESKTOP_RELEASE_ARTIFACTS.macIntel}`
    );
    expect(DESKTOP_DOWNLOAD_URLS.linuxAppImage).toBe(
      `${releaseBase}/${DESKTOP_RELEASE_ARTIFACTS.linuxAppImage}`
    );
    expect(DESKTOP_DOWNLOAD_URLS.linuxDeb).toBe(
      `${releaseBase}/${DESKTOP_RELEASE_ARTIFACTS.linuxDeb}`
    );
  });
});
