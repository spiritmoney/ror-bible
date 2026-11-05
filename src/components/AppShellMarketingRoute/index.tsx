import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_SHELL_READER_ROUTE, isAppShell } from 'utils/appShell';
import {
  closeAppShellMarketingOverlay,
  hasAppShellReaderBackground,
} from 'utils/appShellOverlayClose';

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
  const hasBackground = hasAppShellReaderBackground(location.state);

  if (!isAppShell()) {
    return <Page />;
  }

  if (hasBackground) {
    return null;
  }

  return (
    <Page
      isModal
      onClose={() =>
        closeAppShellMarketingOverlay(hasBackground, navigate)
      }
    />
  );
};

export default AppShellMarketingRoute;
