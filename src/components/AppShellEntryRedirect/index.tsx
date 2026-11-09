import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { HomeRoute } from 'navigation/routes';
import {
  APP_SHELL_READER_ROUTE,
  isAppShell,
  shouldAppShellRedirectMarketingRoute,
} from 'utils/appShell';

/** Sends PWA / Electron entry and marketing URLs to the Bible reader. */
export const AppShellEntryRedirect: React.FunctionComponent = () => {
  const location = useLocation();

  if (!isAppShell()) {
    return null;
  }

  const isHomeEntry =
    location.pathname === '/' ||
    location.pathname === HomeRoute ||
    location.pathname === '/home';

  if (
    isHomeEntry ||
    shouldAppShellRedirectMarketingRoute(location.pathname, location.hash)
  ) {
    return <Navigate to={APP_SHELL_READER_ROUTE} replace />;
  }

  return null;
};

export default AppShellEntryRedirect;
