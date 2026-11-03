import { isAppShell } from './appShell';
import * as general from './general';

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
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false in a normal browser', () => {
    expect(isAppShell()).toBe(false);
  });

  it('returns true when display-mode is standalone', () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    expect(isAppShell()).toBe(true);
  });

  it('returns true for Electron preload flag', () => {
    window.electronAPI = { isElectron: true } as typeof window.electronAPI;
    expect(isAppShell()).toBe(true);
  });
});
