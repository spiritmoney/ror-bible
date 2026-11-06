import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const LibraryProbe = () => {
  const open = useRecoilValue(libraryAtom);
  return <div data-testid="library-open">{String(open)}</div>;
};

const NotificationsProbe = () => {
  const open = useRecoilValue(notificationsModalAtom);
  return <div data-testid="notifications-open">{String(open)}</div>;
};

const renderLoggedOutWorkspace = (extra?: React.ReactNode) => {
  loggedOut();
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(libraryAtom, false);
        set(notificationsModalAtom, false);
      }}
    >
      <MemoryRouter initialEntries={['/bible-online']}>
        <Routes>
          <Route
            path="/bible-online"
            element={
              <>
                <Workspace />
                {extra}
              </>
            }
          />
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  );
};

describe('Workspace sidebar actions', () => {
  beforeEach(() => {
    sessionStorage.clear();
    loggedOut();
  });

  it.each(['Library', 'Downloads', 'Alerts'] as const)(
    'does not open modal state when %s rail is clicked',
    async label => {
      renderLoggedOutWorkspace(
        <>
          <LibraryProbe />
          <NotificationsProbe />
        </>
      );

      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByTestId('library-open')).toHaveTextContent('false');
      expect(screen.getByTestId('notifications-open')).toHaveTextContent(
        'false'
      );
      expect(screen.queryByText('Login screen')).not.toBeInTheDocument();
    }
  );

  it.each(['Favourites', 'Store'] as const)(
    'sends %s to login via userEvent on the rail button',
    async label => {
      renderLoggedOutWorkspace();

      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByText('Login screen')).toBeInTheDocument();
      expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBe(
        '/bible-online'
      );
    }
  );

  it('blocks persisted true for library atom (cannot open modal)', () => {
    render(
      <RecoilRoot
        initializeState={({ set }) => set(libraryAtom, true)}
      >
        <MemoryRouter>
          <LibraryProbe />
        </MemoryRouter>
      </RecoilRoot>
    );
    expect(screen.getByTestId('library-open')).toHaveTextContent('false');
  });

  it('sends store to login when stale email but no user id', async () => {
    mockUseUser.mockReturnValue({
      isAuthenticated: true,
      isLoggedIn: 'true',
      user: {} as any,
      updateUserInfo: jest.fn(),
    } as unknown as ReturnType<typeof useUser>);

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

    await userEvent.click(screen.getByRole('button', { name: 'Store' }));
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});
