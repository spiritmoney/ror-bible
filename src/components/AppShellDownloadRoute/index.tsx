import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DownloadPage from 'screens/Website/downloadPage';
import { APP_SHELL_READER_ROUTE, isAppShell } from 'utils/appShell';

const isContactHash = (hash: string) => {
  const h = hash.toLowerCase();
  return h === '#contact' || h === 'contact';
};

/** Download marketing page in browser; contact-only modal in app shell. */
export const AppShellDownloadRoute: React.FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasBackground = Boolean(
    (location.state as { backgroundLocation?: unknown } | null)
      ?.backgroundLocation
  );

  if (!isAppShell()) {
    return <DownloadPage />;
  }

  if (!isContactHash(location.hash)) {
    return null;
  }

  if (hasBackground) {
    return null;
  }

  return (
    <DownloadPage
      isModal
      onClose={() => navigate(APP_SHELL_READER_ROUTE, { replace: true })}
    />
  );
};

export default AppShellDownloadRoute;
