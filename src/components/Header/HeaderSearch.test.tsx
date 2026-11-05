import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import Header from './index';
import { SetNavAtom, libraryAtom } from 'store/atoms/general';
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

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

const NavProbe = () => {
  const nav = useRecoilValue(SetNavAtom);
  return <div data-testid="nav">{nav}</div>;
};

describe('Header app search', () => {
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
    document.body.innerHTML =
      '<div class="multi_layout_right_top_search"><input /></div>';
  });

  it('navigates to bible-online and focuses reader search', () => {
    jest.useFakeTimers();
    const focusSpy = jest.spyOn(
      document.querySelector('input') as HTMLInputElement,
      'focus'
    );

    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route
              path="/bible-online"
              element={
                <>
                  <Header />
                  <NavProbe />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Search in Bible reader' })
    );
    expect(screen.getByTestId('nav')).toHaveTextContent('multi_layout');
    jest.advanceTimersByTime(400);
    expect(focusSpy).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
