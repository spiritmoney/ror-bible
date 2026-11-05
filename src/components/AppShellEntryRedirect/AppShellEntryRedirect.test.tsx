import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('utils/appShell', () => ({
  isAppShell: jest.fn(),
  APP_SHELL_READER_ROUTE: '/bible-online',
  shouldAppShellRedirectMarketingRoute: jest.fn(),
}));

jest.mock('navigation/routes', () => ({
  HomeRoute: '/home',
}));

import AppShellEntryRedirect from './index';

const mockIsAppShell = jest.requireMock('utils/appShell')
  .isAppShell as jest.Mock;
const mockShouldRedirect = jest.requireMock('utils/appShell')
  .shouldAppShellRedirectMarketingRoute as jest.Mock;

describe('AppShellEntryRedirect', () => {
  beforeEach(() => {
    mockIsAppShell.mockReset();
    mockShouldRedirect.mockReset();
  });

  it('does not redirect in a normal browser', () => {
    mockIsAppShell.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route
            path="/about"
            element={
              <>
                <AppShellEntryRedirect />
                <div>About page</div>
              </>
            }
          />
          <Route path="/bible-online" element={<div>Bible reader</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('About page')).toBeInTheDocument();
  });

  it('redirects app shell entry to /bible-online', () => {
    mockIsAppShell.mockReturnValue(true);
    mockShouldRedirect.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AppShellEntryRedirect />
                <div>Website home</div>
              </>
            }
          />
          <Route path="/bible-online" element={<div>Bible reader</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Bible reader')).toBeInTheDocument();
    expect(screen.queryByText('Website home')).not.toBeInTheDocument();
  });

  it('allows about in app shell when marketing redirect returns false', () => {
    mockIsAppShell.mockReturnValue(true);
    mockShouldRedirect.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route
            path="/about"
            element={
              <>
                <AppShellEntryRedirect />
                <div>About page</div>
              </>
            }
          />
          <Route path="/bible-online" element={<div>Bible reader</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('About page')).toBeInTheDocument();
  });

  it('redirects features in app shell when marketing redirect returns true', () => {
    mockIsAppShell.mockReturnValue(true);
    mockShouldRedirect.mockImplementation(
      (pathname: string) => pathname === '/features'
    );

    render(
      <MemoryRouter initialEntries={['/features']}>
        <Routes>
          <Route
            path="/features"
            element={
              <>
                <AppShellEntryRedirect />
                <div>Features page</div>
              </>
            }
          />
          <Route path="/bible-online" element={<div>Bible reader</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Bible reader')).toBeInTheDocument();
    expect(screen.queryByText('Features page')).not.toBeInTheDocument();
  });
});
