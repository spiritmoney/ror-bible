import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Protected from './index';
import { useUser } from 'hooks/useUser';

jest.mock('hooks/useUser');
jest.mock('hooks/useFirebase', () => ({
  useFirebase: () => ({
    getOnSnapshot: jest.fn(),
  }),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('Protected', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to /login when logged out with no session hint', () => {
    mockUseUser.mockReturnValue({
      isLoggedIn: 'false',
      user: {} as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);

    render(
      <MemoryRouter initialEntries={['/dash']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/dash"
            element={
              <Protected>
                <div>Protected content</div>
              </Protected>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when logged in', () => {
    mockUseUser.mockReturnValue({
      isLoggedIn: 'true',
      user: { id: 'user-1' } as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);

    render(
      <MemoryRouter initialEntries={['/dash']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/dash"
            element={
              <Protected>
                <div>Protected content</div>
              </Protected>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});
