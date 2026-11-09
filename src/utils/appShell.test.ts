import { isAppShell } from './appShell';
import {
  clearInstalledLaunchSessionForTests,
  INSTALLED_LAUNCH_SESSION_KEY,
  persistInstalledLaunchFromLocation,
} from './appShellInstalledLaunch';
import * as general from './general';

function mockDisplayMode(...active: string[]) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: active.some(mode => query === `(display-mode: ${mode})`),
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe('isAppShell', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    jest.spyOn(general, 'isElectron').mockReturnValue(false);
    document.documentElement.classList.remove('is-electron');
    delete (window as Window & { electronAPI?: { isElectron?: boolean } })
      .electronAPI;
    Object.defineProperty(navigator, 'standalone', {
      configurable: true,
      value: undefined,
      writable: true,
    });
    clearInstalledLaunchSessionForTests();
    window.history.pushState({}, '', '/');
    mockDisplayMode();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.documentElement.classList.remove('is-electron');
    window.history.pushState({}, '', '/');
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false in a plain browser tab', () => {
    mockDisplayMode('browser');
    expect(isAppShell()).toBe(false);
  });

  it('returns false in a plain tab even when the is-electron class is set', () => {
    document.documentElement.classList.add('is-electron');
    mockDisplayMode('browser');
    expect(isAppShell()).toBe(false);
  });

  it('returns false when only the is-electron CSS class is present', () => {
    document.documentElement.classList.add('is-electron');
    mockDisplayMode();
    expect(isAppShell()).toBe(false);
  });

  it('returns false when display-mode is fullscreen', () => {
    mockDisplayMode('fullscreen');
    expect(isAppShell()).toBe(false);
  });

  it('returns true when display-mode is standalone', () => {
    mockDisplayMode('standalone');
    expect(isAppShell()).toBe(true);
  });

  it('returns false for minimal-ui in a tab without an installed launch', () => {
    mockDisplayMode('minimal-ui');
    expect(isAppShell()).toBe(false);
  });

  it('returns true for minimal-ui launched from the manifest start_url', () => {
    window.history.pushState({}, '', '/bible-online?source=pwa');
    mockDisplayMode('minimal-ui');
    expect(isAppShell()).toBe(true);
  });

  it('returns false for window-controls-overlay without an installed launch', () => {
    mockDisplayMode('window-controls-overlay');
    expect(isAppShell()).toBe(false);
  });

  it('returns true for window-controls-overlay launched from the manifest start_url', () => {
    window.history.pushState({}, '', '/bible-online?source=pwa');
    persistInstalledLaunchFromLocation();
    window.history.pushState({}, '', '/features');
    mockDisplayMode('window-controls-overlay');
    expect(isAppShell()).toBe(true);
  });

  it('returns true for minimal-ui when session stored an installed launch', () => {
    window.history.pushState({}, '', '/bible-online?source=pwa');
    persistInstalledLaunchFromLocation();
    window.history.pushState({}, '', '/bible-online');
    mockDisplayMode('minimal-ui');
    expect(isAppShell()).toBe(true);
  });

  it('returns false for minimal-ui when session has no installed launch marker', () => {
    sessionStorage.removeItem(INSTALLED_LAUNCH_SESSION_KEY);
    mockDisplayMode('minimal-ui');
    expect(isAppShell()).toBe(false);
  });

  it('returns true for an iOS home-screen launch', () => {
    Object.defineProperty(navigator, 'standalone', {
      configurable: true,
      value: true,
    });
    expect(isAppShell()).toBe(true);
  });

  it('returns true for Electron', () => {
    window.electronAPI = { isElectron: true } as typeof window.electronAPI;
    mockDisplayMode('browser');
    expect(isAppShell()).toBe(true);
  });

  it('returns false for Electron UA in a plain browser tab (IDE webview)', () => {
    jest.spyOn(general, 'isElectron').mockReturnValue(true);
    mockDisplayMode('browser');
    expect(isAppShell()).toBe(false);
  });
});
