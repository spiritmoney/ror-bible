import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useRequireLogin } from './useRequireLogin';
import { useUser } from 'hooks/useUser';
import { AUTH_RETURN_STORAGE_KEY } from 'utils/authReturnPath';

jest.mock('hooks/useUser');

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

const Probe: React.FC<{ onRun?: () => void }> = ({ onRun }) => {
  const { requireLogin } = useRequireLogin();
  return (
    <button type="button" onClick={() => requireLogin(onRun)}>
      Run action
    </button>
  );
};

const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.state ? JSON.stringify(location.state) : ''}
    </div>
  );
};

describe('useRequireLogin', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockUseUser.mockReset();
  });

  it('runs the action when logged in', () => {
    const action = jest.fn();
    mockUseUser.mockReturnValue({
      isAuthenticated: true,
      isLoggedIn: 'true',
      user: { id: 'u1' } as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);

    render(
      <MemoryRouter initialEntries={['/bible-online']}>
        <Routes>
          <Route
            path="/bible-online"
            element={<Probe onRun={action} />}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Run action' }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('redirects to /login with return path when logged out', () => {
    const action = jest.fn();
    mockUseUser.mockReturnValue({
      isAuthenticated: false,
      isLoggedIn: 'false',
      user: {} as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);

    render(
      <MemoryRouter initialEntries={['/bible-online?book=John']}>
        <Routes>
          <Route
            path="/bible-online"
            element={
              <>
                <Probe onRun={action} />
                <LocationDisplay />
              </>
            }
          />
          <Route path="/login" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Run action' }));
    expect(action).not.toHaveBeenCalled();
    expect(screen.getByTestId('location')).toHaveTextContent('/login');
    expect(screen.getByTestId('location')).toHaveTextContent(
      '"/bible-online?book=John"'
    );
    expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBe(
      '/bible-online?book=John'
    );
  });
});
