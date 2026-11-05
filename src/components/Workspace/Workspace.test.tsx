import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Workspace from './index';
import { useUser } from 'hooks/useUser';
import { AUTH_RETURN_STORAGE_KEY } from 'utils/authReturnPath';

jest.mock('hooks/useUser');
jest.mock('components/SingleReaderArea', () => () => <div>Reader</div>);
jest.mock('screens/Store/store_components', () => () => null);
jest.mock('screens/Favourites/favourites_components', () => () => null);
jest.mock('screens/Store/store_bible', () => () => null);
jest.mock('screens/Store/store_audio', () => () => null);
jest.mock('screens/Store/store_resources', () => () => null);
jest.mock('screens/Store/store_translations', () => () => null);
jest.mock('screens/Store/store_freesbies', () => () => null);
jest.mock('screens/Store/dynamicProduct_Details', () => () => null);
jest.mock('screens/Multi_layout/multi_layout_component', () => () => null);
jest.mock('screens/Xml2Json', () => () => null);
jest.mock('../Anotations', () => () => null);
jest.mock('../AvailableBooks', () => () => null);
jest.mock('../EditorScreen', () => () => null);
jest.mock('../WorkspaceHeader', () => () => null);
jest.mock('components/Utility-Tools', () => () => null);
jest.mock('components/AdminSideMenu', () => () => null);

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="path">{location.pathname}</div>;
};

describe('Workspace sidebar login-on-demand', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockUseUser.mockReturnValue({
      isAuthenticated: false,
      isLoggedIn: 'false',
      user: {} as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);
  });

  it('sends favourites to login without changing reader route first', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route
              path="/bible-online"
              element={
                <>
                  <Workspace />
                  <LocationDisplay />
                </>
              }
            />
            <Route path="/login" element={<div>Login screen</div>} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByText('Favourite'));
    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBe(
      '/bible-online'
    );
  });
});
