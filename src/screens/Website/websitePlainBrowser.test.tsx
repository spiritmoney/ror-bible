import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './landingPage';
import FeaturesPage from './featuresPage';
import PricingPage from './pricingPage';
import DownloadPage from './downloadPage';
import About from './about';
import ProductPlatformPage from './productPlatformPage';
import Partner from './partner';
import GivePage from './give';

jest.mock('utils/appShell', () => ({
  isAppShell: () => false,
  persistInstalledLaunchFromLocation: jest.fn(),
}));
jest.mock('hooks/useUser', () => ({
  useUser: () => ({
    isAuthenticated: false,
    user: {},
    updateUserInfo: jest.fn(),
  }),
}));
jest.mock('axios');

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  document.documentElement.classList.remove('is-app-shell', 'is-electron');
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === '(display-mode: browser)',
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
});

function expectWebsiteChrome() {
  expect(document.querySelector('.site-header')).toBeInTheDocument();
  expect(document.querySelector('.website-root')).toBeInTheDocument();
  expect(document.querySelector('.app-chrome-header')).not.toBeInTheDocument();
  expect(document.documentElement.classList.contains('is-app-shell')).toBe(
    false
  );
}

function atPath(path: string, element: React.ReactElement) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={element} />
      </Routes>
    </MemoryRouter>
  );
}

describe('website marketing routes in a plain browser tab', () => {
  it.each([
    ['/', <LandingPage />, 'home'],
    ['/features', <FeaturesPage />, 'features'],
    ['/pricing', <PricingPage />, 'pricing'],
    ['/download', <DownloadPage />, 'download'],
    ['/about', <About />, 'about'],
    ['/products/web', <ProductPlatformPage platform="web" />, 'products web'],
    ['/partner', <Partner />, 'partner'],
    ['/give', <GivePage />, 'give'],
  ])('%s shows website header and footer, not app chrome', (path, element) => {
    atPath(path, element);
    expectWebsiteChrome();
    expect(
      screen.getByRole('navigation', { name: /main/i })
    ).toBeInTheDocument();
  });
});
