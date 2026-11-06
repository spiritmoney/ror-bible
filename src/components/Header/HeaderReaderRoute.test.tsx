import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './index';
import WebsiteHeader from 'screens/Website/header';
import { MenuContext } from 'screens/Website/websiteMenuContext';
import { useUser } from 'hooks/useUser';

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
jest.mock('hooks/useRequireLogin', () => ({
  useRequireLogin: () => ({ requireLogin: jest.fn() }),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

function appHeaderAt(path: string) {
  return render(
    <RecoilRoot>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<Header />} />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );
}

function websiteHeaderAt(initialPath: string) {
  const menu = {
    mobileOpen: false,
    setMobileOpen: jest.fn(),
    megaOpen: false,
    setMegaOpen: jest.fn(),
  };
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <MenuContext.Provider value={menu}>
        <WebsiteHeader />
      </MenuContext.Provider>
    </MemoryRouter>
  );
}

describe('Header by route (browser tab, not app shell)', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
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

  it('uses app chrome on /bible-online (icon logo, Sign in)', () => {
    appHeaderAt('/bible-online');
    const logo = screen.getByAltText('Rhapsody Bible');
    expect(logo).toHaveClass('app-top-bar-logo-mark');
    expect(screen.getByRole('button', { name: 'Sign in' })).toHaveClass(
      'app-top-sign-in'
    );
  });

  it('uses marketing-style logo on / (no icon-only class)', () => {
    appHeaderAt('/');
    const logo = screen.getByAltText('Rhapsody Bible');
    expect(logo).not.toHaveClass('app-top-bar-logo-mark');
  });

  it('uses marketing-style logo on /store (linked from website nav)', () => {
    appHeaderAt('/store');
    const logo = screen.getByAltText('Rhapsody Bible');
    expect(logo).not.toHaveClass('app-top-bar-logo-mark');
  });

  it('website header on / keeps site-header and home lockup', () => {
    websiteHeaderAt('/');
    expect(document.querySelector('.site-header')).toBeTruthy();
    const home = screen.getByRole('link', { name: /ROR Bible\+ home/i });
    expect(home).toHaveAttribute('href', '/home');
  });

  it('website header on /features keeps site-header and home lockup', () => {
    websiteHeaderAt('/features');
    expect(document.querySelector('.site-header')).toBeTruthy();
    const home = screen.getByRole('link', { name: /ROR Bible\+ home/i });
    expect(home).toHaveAttribute('href', '/home');
  });

  it('website header lockup on /bible-online points to reader when embedded', () => {
    websiteHeaderAt('/bible-online');
    const home = screen.getByRole('link', { name: /ROR Bible\+ home/i });
    expect(home).toHaveAttribute('href', '/bible-online');
  });
});
