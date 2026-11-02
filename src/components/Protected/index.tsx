import SuspenseLoader from 'components/SuspenseLoader';
import { useFirebase } from 'hooks/useFirebase';
import { useUser } from 'hooks/useUser';
import { IUser } from 'interface/user';
import { AuthRoute } from 'navigation/routes';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export interface IProtected {
  children: any;
}

const Protected: React.FunctionComponent<IProtected> = ({ children }) => {
  const { isLoggedIn, updateUserInfo, user } = useUser();
  const { getOnSnapshot } = useFirebase();

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

  // if (isLoggedIn === 'false') {
  //   return <Navigate to={AuthRoute} />;
  // }
  // Replaced the condition for isLoggedIn = false
  if (isLoggedIn === 'false') {
    return <>{children}</>;
  }

  return <SuspenseLoader fullscreen />;
};

export default Protected;
