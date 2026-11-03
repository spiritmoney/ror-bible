import SuspenseLoader from 'components/SuspenseLoader';
import { useFirebase } from 'hooks/useFirebase';
import { useUser } from 'hooks/useUser';
import { IUser } from 'interface/user';
import { LoginRoute } from 'navigation/routes';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LOCAL_STORAGE_USER_EMAIL } from 'store/constant';

export interface IProtected {
  children: any;
}

const Protected: React.FunctionComponent<IProtected> = ({ children }) => {
  const { isLoggedIn, updateUserInfo, user } = useUser();
  const { getOnSnapshot } = useFirebase();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn !== 'true') return;

    (async () => {
      try {
        const userData = await getOnSnapshot({
          col: 'users',
          id: user.id,
        });

        if (!userData) return;

        updateUserInfo(userData as IUser);
      } catch (error) {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  if (isLoggedIn === 'true') {
    return <>{children}</>;
  }

  if (isLoggedIn === 'loading') {
    return <SuspenseLoader fullscreen />;
  }

  const storedEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem(LOCAL_STORAGE_USER_EMAIL)
      : null;
  const hasSessionHint = !!(user?.id || storedEmail);

  if (hasSessionHint) {
    return <SuspenseLoader fullscreen />;
  }

  return (
    <Navigate
      to={LoginRoute}
      replace
      state={{
        from: location.pathname + location.search + location.hash,
      }}
    />
  );
};

export default Protected;
