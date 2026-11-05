import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './index';
import { useUser } from 'hooks/useUser';
import {
  APP_TOP_NAV_DESKTOP_LABELS,
  APP_TOP_NAV_WEBSITE_ORDER,
  APP_TOP_NAV_WEBSITE_URLS,
} from 'config/appTopNavWebsite';
import { DEFAULT_WEBSITE_ORIGIN } from 'config/runtime';

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
jest.mock('utils/appShell', () => ({ isAppShell: () => true }));
jest.mock('utils/general', () => {
  const actual = jest.requireActual('utils/general');
  return { ...actual, isElectron: () => true };
});

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('Header top nav website links', () => {
  const openExternal = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    openExternal.mockClear();
    (window as any).electronAPI = { isElectron: true, openExternal };
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

  it('lists items in order and opens staging URLs externally without changing hash', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route path="/bible-online" element={<Header />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    const navList = document.querySelector('.app-top-nav-list');
    expect(navList).toBeTruthy();
    const labels = Array.from(
      navList!.querySelectorAll('button.app-top-nav-item')
    ).map(btn => btn.textContent?.trim());
    expect(labels).toEqual([...APP_TOP_NAV_DESKTOP_LABELS]);

    const expectedUrls: Record<string, string> = {
      Features: `${DEFAULT_WEBSITE_ORIGIN}/features`,
      Products: `${DEFAULT_WEBSITE_ORIGIN}/products/web`,
      Pricing: `${DEFAULT_WEBSITE_ORIGIN}/pricing`,
      Download: `${DEFAULT_WEBSITE_ORIGIN}/download`,
      About: `${DEFAULT_WEBSITE_ORIGIN}/about`,
      Contact: `${DEFAULT_WEBSITE_ORIGIN}/download#contact`,
    };

    for (const { label, key } of APP_TOP_NAV_WEBSITE_ORDER) {
      openExternal.mockClear();
      const before = window.location.hash;
      fireEvent.click(screen.getByRole('button', { name: label }));
      const url = APP_TOP_NAV_WEBSITE_URLS[key]();
      expect(url).toBe(expectedUrls[label]);
      expect(openExternal).toHaveBeenCalledWith(url);
      expect(window.location.hash).toBe(before);
    }
  });
});
