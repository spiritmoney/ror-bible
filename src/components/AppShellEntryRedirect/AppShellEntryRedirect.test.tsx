import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('utils/appShell', () => ({
  isAppShell: jest.fn(),
  APP_SHELL_READER_ROUTE: '/bible-online',
  APP_SHELL_MARKETING_PATHS: new Set(['/']),
}));

import AppShellEntryRedirect from './index';

const mockIsAppShell = jest.requireMock('utils/appShell')
  .isAppShell as jest.Mock;

describe('AppShellEntryRedirect', () => {
  beforeEach(() => {
    mockIsAppShell.mockReset();
  });

  it('does not redirect in a normal browser', () => {
    mockIsAppShell.mockReturnValue(false);

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

    expect(screen.getByText('Website home')).toBeInTheDocument();
  });

  it('redirects app shell entry to /bible-online', () => {
    mockIsAppShell.mockReturnValue(true);

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
});
