import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_SHELL_READER_ROUTE, isAppShell } from 'utils/appShell';

export type AppShellPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

type AppShellMarketingRouteProps = {
  Page: React.ComponentType<AppShellPageProps>;
};

/** Full website page in browser; modal with “back to reader” on cold app-shell entry. */
export const AppShellMarketingRoute: React.FunctionComponent<
  AppShellMarketingRouteProps
> = ({ Page }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasBackground = Boolean(
    (location.state as { backgroundLocation?: unknown } | null)
      ?.backgroundLocation
  );

  if (!isAppShell()) {
    return <Page />;
  }

  if (hasBackground) {
    return null;
  }

  return (
    <Page
      isModal
      onClose={() => navigate(APP_SHELL_READER_ROUTE, { replace: true })}
    />
  );
};

export default AppShellMarketingRoute;
