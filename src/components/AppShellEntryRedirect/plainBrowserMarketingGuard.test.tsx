import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppShellEntryRedirect from './index';
import { isAppShell } from 'utils/appShell';
import {
  clearInstalledLaunchSessionForTests,
  INSTALLED_LAUNCH_SESSION_KEY,
} from 'utils/appShellInstalledLaunch';
import DownloadPage from 'screens/Website/downloadPage';
import { STORE_URLS } from 'config/storeLinks';

jest.mock('hooks/useUser', () => ({
  useUser: () => ({
    isAuthenticated: false,
    user: {},
    updateUserInfo: jest.fn(),
  }),
}));
jest.mock('axios');

const MARKETING_PATHS = [
  '/',
  '/download',
  '/features',
  '/pricing',
  '/about',
  '/partner',
  '/give',
  '/products/web',
] as const;

function mockPlainBrowserTab() {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === '(display-mode: browser)',
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  document.documentElement.classList.remove('is-electron', 'is-app-shell');
  delete (window as Window & { electronAPI?: { isElectron?: boolean } })
    .electronAPI;
  clearInstalledLaunchSessionForTests();
  expect(sessionStorage.getItem(INSTALLED_LAUNCH_SESSION_KEY)).toBeNull();
}

describe('plain browser marketing guard', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    mockPlainBrowserTab();
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it.each(MARKETING_PATHS)('isAppShell() is false on %s', (path) => {
    window.history.pushState({}, '', path);
    expect(isAppShell()).toBe(false);
  });

  it.each(MARKETING_PATHS)(
    'AppShellEntryRedirect does not redirect %s',
    (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <AppShellEntryRedirect />
                  <div data-testid="marketing-stays">Marketing route</div>
                </>
              }
            />
            <Route path="/bible-online" element={<div>Reader</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('marketing-stays')).toBeInTheDocument();
      expect(screen.queryByText('Reader')).not.toBeInTheDocument();
    }
  );

  it.each(['/download', '/features', '/'])(
    'redirects %s to the reader in Electron mode',
    (path) => {
      window.electronAPI = { isElectron: true } as typeof window.electronAPI;
      window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === '(display-mode: browser)',
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <AppShellEntryRedirect />
                  <div>Marketing route</div>
                </>
              }
            />
            <Route path="/bible-online" element={<div>Reader</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Reader')).toBeInTheDocument();
      delete (window as { electronAPI?: unknown }).electronAPI;
    }
  );

  it('Download page shows store badges and desktop controls in a plain tab', () => {
    render(
      <MemoryRouter initialEntries={['/download']}>
        <DownloadPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /loveworld app store/i })
    ).toHaveAttribute('href', STORE_URLS.loveworld);
    expect(screen.getByRole('link', { name: /google play/i })).toHaveAttribute(
      'href',
      STORE_URLS.googlePlay
    );
    const storeLinks = screen
      .getAllByRole('link')
      .filter((el) => (el.getAttribute('href') ?? '').startsWith('http'));
    expect(storeLinks.map((el) => el.getAttribute('href'))).toEqual(
      expect.arrayContaining([
        STORE_URLS.loveworld,
        STORE_URLS.googlePlay,
        STORE_URLS.appStore,
      ])
    );
    expect(
      screen.getByRole('link', { name: /download for windows/i })
    ).toBeInTheDocument();
  });
});
