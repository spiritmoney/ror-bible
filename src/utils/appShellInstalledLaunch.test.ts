import {
  clearInstalledLaunchSessionForTests,
  hasInstalledLaunchInSession,
  INSTALLED_LAUNCH_SESSION_KEY,
  persistInstalledLaunchFromLocation,
} from './appShellInstalledLaunch';

describe('appShellInstalledLaunch', () => {
  beforeEach(() => {
    clearInstalledLaunchSessionForTests();
    window.history.pushState({}, '', '/');
    Object.defineProperty(navigator, 'standalone', {
      configurable: true,
      value: undefined,
      writable: true,
    });
  });

  it('does not persist on a plain marketing entry', () => {
    persistInstalledLaunchFromLocation();
    expect(hasInstalledLaunchInSession()).toBe(false);
    expect(sessionStorage.getItem(INSTALLED_LAUNCH_SESSION_KEY)).toBeNull();
  });

  it('persists when the URL has source=pwa', () => {
    window.history.pushState({}, '', '/bible-online?source=pwa');
    persistInstalledLaunchFromLocation();
    expect(hasInstalledLaunchInSession()).toBe(true);
    expect(sessionStorage.getItem(INSTALLED_LAUNCH_SESSION_KEY)).toBe('pwa');
  });

  it('persists for iOS standalone', () => {
    Object.defineProperty(navigator, 'standalone', {
      configurable: true,
      value: true,
    });
    persistInstalledLaunchFromLocation();
    expect(sessionStorage.getItem(INSTALLED_LAUNCH_SESSION_KEY)).toBe(
      'ios-standalone'
    );
  });
});
