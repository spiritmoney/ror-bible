import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Footer from './footer';
import ProductWebMain from './productWebMain';
import ProductHeroMonitorMockup from './ProductHeroMonitorMockup';
import About from './about';
import Partner from './partner';
import GivePage from './give';
import Header from './header';
import { MenuContext } from './websiteMenuContext';

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

const menuValue = {
  mobileOpen: false,
  setMobileOpen: jest.fn(),
  megaOpen: false,
  setMegaOpen: jest.fn(),
};

function wrap(ui: React.ReactElement, path = '/') {
  return (
    <MemoryRouter initialEntries={[path]}>
      <MenuContext.Provider value={menuValue}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MenuContext.Provider>
    </MemoryRouter>
  );
}

describe('footer marketing columns', () => {
  it('has Follow us as a fourth column without Blog or Store', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /follow us/i })).toBeInTheDocument();
    expect(screen.queryByText(/^Blog$/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^Store$/i })).not.toBeInTheDocument();
    expect(container.querySelector('.uf3b8e2')).toBeInTheDocument();
    const columns = within(container.querySelector('.uf3b8e2') as HTMLElement).getAllByRole(
      'heading',
      { level: 3 }
    );
    expect(columns.map((h) => h.textContent)).toEqual([
      'Products',
      'About ROR Bible+',
      'Partners',
      'Follow us',
    ]);
  });
});

describe('web product hero mockup', () => {
  it('uses the shared monitor component', () => {
    const { container } = render(
      <MemoryRouter>
        <ProductWebMain />
      </MemoryRouter>
    );
    expect(container.querySelector('.u20d6c8')).toBeInTheDocument();
    expect(container.querySelector('.u852f09')).not.toBeInTheDocument();
  });

  it('exports monitor markup with stand', () => {
    const { container } = render(<ProductHeroMonitorMockup />);
    expect(container.querySelector('.u21ba85')).toBeInTheDocument();
    expect(container.querySelector('.ud68c8f')).toBeInTheDocument();
  });
});

describe('same-tab marketing navigation', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('is-app-shell', 'is-electron');
  });

  it('links About, Partner and Give without modal hash handlers', () => {
    render(wrap(<Header />, '/features'));
    const mainNav = screen.getByRole('navigation', { name: /main/i });
  const utilityNav = screen.getByRole('navigation', { name: /utility/i });
    const about = within(mainNav).getByRole('link', { name: /about/i });
    const partner = within(utilityNav).getByRole('link', { name: /^partner$/i });
    const give = within(utilityNav).getByRole('link', { name: /^give$/i });
    expect(about).toHaveAttribute('href', '/about');
    expect(partner).toHaveAttribute('href', '/partner');
    expect(give).toHaveAttribute('href', '/give');
    expect(about.getAttribute('href')).not.toBe('#');
  });

  it.each([
    ['/about', About],
    ['/partner', Partner],
    ['/give', GivePage],
  ])('%s renders header and footer in a plain browser', (path, Page) => {
    render(wrap(<Page />, path));
    expect(document.querySelector('.site-header')).toBeInTheDocument();
    expect(document.querySelector('footer.u6971eb')).toBeInTheDocument();
    expect(document.querySelector('button[aria-label="Close"]')).not.toBeInTheDocument();
  });
});
