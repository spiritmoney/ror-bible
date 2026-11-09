import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('utils/appShell', () => ({
  isAppShell: jest.fn(),
  APP_SHELL_READER_ROUTE: '/bible-online',
}));

import { isAppShell } from 'utils/appShell';
import { AppShellMarketingRoute } from './index';

const mockIsAppShell = isAppShell as jest.Mock;

const StubPage: React.FC<{ isModal?: boolean; onClose?: () => void }> = ({
  isModal,
  onClose,
}) =>
  isModal ? (
    <div>
      <span>Modal page</span>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  ) : (
    <div>Full page</div>
  );

describe('AppShellMarketingRoute', () => {
  beforeEach(() => {
    mockIsAppShell.mockReset();
  });

  it('renders cold-load modal in app shell and closes to reader', () => {
    mockIsAppShell.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/give']}>
        <Routes>
          <Route
            path="/give"
            element={<AppShellMarketingRoute Page={StubPage} />}
          />
          <Route path="/bible-online" element={<div>Reader</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Modal page')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByText('Reader')).toBeInTheDocument();
  });

  it('returns null when overlay has reader background', () => {
    mockIsAppShell.mockReturnValue(true);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/about',
            state: { backgroundLocation: { pathname: '/bible-online' } },
          },
        ]}
      >
        <Routes>
          <Route
            path="/about"
            element={<AppShellMarketingRoute Page={StubPage} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Modal page')).not.toBeInTheDocument();
    expect(screen.queryByText('Full page')).not.toBeInTheDocument();
  });
});
