import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import Workspace from './index';
import { useUser } from 'hooks/useUser';
import { libraryAtom } from 'store/atoms/general';
import { notificationsModalAtom } from 'store/atoms/workspace';
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

const loggedOut = () =>
  mockUseUser.mockReturnValue({
    isAuthenticated: false,
    isLoggedIn: 'false',
    user: {} as any,
    updateUserInfo: jest.fn(),
  } as unknown as ReturnType<typeof useUser>);

const loggedIn = () =>
  mockUseUser.mockReturnValue({
    isAuthenticated: true,
    isLoggedIn: 'true',
    user: { id: 'u1' } as any,
    updateUserInfo: jest.fn(),
  } as unknown as ReturnType<typeof useUser>);

const LibraryProbe = () => {
  const open = useRecoilValue(libraryAtom);
  return <div data-testid="library-open">{String(open)}</div>;
};

const NotificationsProbe = () => {
  const open = useRecoilValue(notificationsModalAtom);
  return <div data-testid="notifications-open">{String(open)}</div>;
};

describe('Workspace sidebar actions', () => {
  beforeEach(() => {
    sessionStorage.clear();
    loggedOut();
  });

  it('sends favourites to login without changing reader route first', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route path="/bible-online" element={<Workspace />} />
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

  it('opens library without login', () => {
    render(
      <RecoilRoot initializeState={({ set }) => set(libraryAtom, false)}>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route
              path="/bible-online"
              element={
                <>
                  <Workspace />
                  <LibraryProbe />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByLabelText('Library'));
    expect(screen.getByTestId('library-open')).toHaveTextContent('true');
  });

  it('opens downloads library after login', () => {
    loggedIn();
    render(
      <RecoilRoot initializeState={({ set }) => set(libraryAtom, false)}>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route
              path="/bible-online"
              element={
                <>
                  <Workspace />
                  <LibraryProbe />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByLabelText('Downloads'));
    expect(screen.getByTestId('library-open')).toHaveTextContent('true');
  });

  it('opens notifications when logged in', () => {
    loggedIn();
    render(
      <RecoilRoot initializeState={({ set }) => set(notificationsModalAtom, false)}>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route
              path="/bible-online"
              element={
                <>
                  <Workspace />
                  <NotificationsProbe />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByLabelText('Notifications'));
    expect(screen.getByTestId('notifications-open')).toHaveTextContent('true');
  });

  it('sends downloads to login when logged out', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/bible-online']}>
          <Routes>
            <Route path="/bible-online" element={<Workspace />} />
            <Route path="/login" element={<div>Login screen</div>} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByLabelText('Downloads'));
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});
