import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './index';
import { useUser } from 'hooks/useUser';
import {
  APP_TOP_NAV_DESKTOP_LABELS,
  APP_TOP_NAV_WEBSITE_ORDER,
} from 'config/appTopNavWebsite';
import { DEFAULT_WEBSITE_ORIGIN } from 'config/runtime';
import { isAppShell } from 'utils/appShell';
import { isElectron } from 'utils/general';

jest.mock('hooks/useUser');
jest.mock('hooks/usePermission', () => () => ({
  isSystemsAdmin: false,
  isAppManager: false,
}));
jest.mock('hooks/useGetSize', () => () => ({
  height: 80,
  ref: { current: null },
}));
jest.mock('components/ProfileMenu', () => () => null);
jest.mock('utils/appShell', () => ({ isAppShell: jest.fn(() => false) }));
jest.mock('utils/general', () => {
  const actual = jest.requireActual('utils/general');
  return { ...actual, isElectron: jest.fn(() => false) };
});

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockIsAppShell = isAppShell as jest.MockedFunction<typeof isAppShell>;
const mockIsElectron = isElectron as jest.MockedFunction<typeof isElectron>;

const IN_SITE: Record<string, string> = {
  Features: '/features',
  Products: '/products/web',
  Pricing: '/pricing',
  Download: '/download',
  About: '/about',
  Contact: '/download#contact',
};

const STAGING: Record<string, string> = {
  Features: `${DEFAULT_WEBSITE_ORIGIN}/features`,
  Products: `${DEFAULT_WEBSITE_ORIGIN}/products/web`,
  Pricing: `${DEFAULT_WEBSITE_ORIGIN}/pricing`,
  Download: `${DEFAULT_WEBSITE_ORIGIN}/download`,
  About: `${DEFAULT_WEBSITE_ORIGIN}/about`,
  Contact: `${DEFAULT_WEBSITE_ORIGIN}/download#contact`,
};

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="loc">
      {location.pathname}
      {location.hash}
    </div>
  );
}

function renderHeader() {
  return render(
    <RecoilRoot>
      <MemoryRouter initialEntries={['/bible-online']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Header />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );
}

describe('Header top nav website links', () => {
  const openExternal = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    openExternal.mockClear();
    mockIsAppShell.mockReset();
    mockIsElectron.mockReset();
    window.open = jest.fn();
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('min-width: 1024px'),
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    mockUseUser.mockReturnValue({
      isAuthenticated: false,
      isLoggedIn: 'false',
      user: {} as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);
  });

  it('lists the desktop items in order', () => {
    mockIsAppShell.mockReturnValue(false);
    mockIsElectron.mockReturnValue(false);
    renderHeader();
    const navList = document.querySelector('.app-top-nav-list');
    const labels = Array.from(
      navList!.querySelectorAll('button.app-top-nav-item')
    ).map(btn => btn.textContent?.trim());
    expect(labels).toEqual([...APP_TOP_NAV_DESKTOP_LABELS]);
  });

  it('navigates the six website items in the same tab', () => {
    mockIsAppShell.mockReturnValue(false);
    mockIsElectron.mockReturnValue(false);
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Bible Online' }));
    expect(screen.getByTestId('loc')).toHaveTextContent('/bible-online');

    for (const { label } of APP_TOP_NAV_WEBSITE_ORDER) {
      fireEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByTestId('loc')).toHaveTextContent(IN_SITE[label]);
      expect(window.open).not.toHaveBeenCalled();
    }
  });

  it('opens the six website items on the staging origin in an installed PWA', () => {
    mockIsAppShell.mockReturnValue(true);
    mockIsElectron.mockReturnValue(false);
    delete (window as any).electronAPI;
    renderHeader();

    for (const { label } of APP_TOP_NAV_WEBSITE_ORDER) {
      (window.open as jest.Mock).mockClear();
      fireEvent.click(screen.getByRole('button', { name: label }));
      expect(window.open).toHaveBeenCalledWith(
        STAGING[label],
        '_blank',
        'noopener'
      );
      expect(screen.getByTestId('loc')).toHaveTextContent('/bible-online');
    }
  });

  it('opens the six website items via openExternal in Electron', () => {
    mockIsAppShell.mockReturnValue(true);
    mockIsElectron.mockReturnValue(true);
    (window as any).electronAPI = { isElectron: true, openExternal };
    renderHeader();

    for (const { label } of APP_TOP_NAV_WEBSITE_ORDER) {
      openExternal.mockClear();
      const before = window.location.hash;
      fireEvent.click(screen.getByRole('button', { name: label }));
      expect(openExternal).toHaveBeenCalledWith(STAGING[label]);
      expect(window.location.hash).toBe(before);
      expect(screen.getByTestId('loc')).toHaveTextContent('/bible-online');
    }
  });
});
