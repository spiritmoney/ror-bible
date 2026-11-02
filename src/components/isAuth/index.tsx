import React from 'react';
import { useUser } from 'hooks/useUser';
import SuspenseLoader from 'components/SuspenseLoader';
import { Navigate } from 'react-router-dom';
import { DashboardRoute } from '../../navigation/routes';

interface IIsAuth {
  children: any;
}

const IsAuth: React.FunctionComponent<IIsAuth> = ({ children }) => {
  const { isLoggedIn } = useUser();

  if (isLoggedIn === 'true') {
    return <Navigate to={DashboardRoute} />;
  }

  if (isLoggedIn === 'false') {
    return <>{children}</>;
  }

  return <SuspenseLoader fullscreen />;
};

export default IsAuth;
