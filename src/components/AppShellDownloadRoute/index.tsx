import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DownloadPage from 'screens/Website/downloadPage';
import { isAppShell } from 'utils/appShell';
import {
  closeAppShellMarketingOverlay,
  hasAppShellReaderBackground,
} from 'utils/appShellOverlayClose';

const isContactHash = (hash: string) => {
  const h = hash.toLowerCase();
  return h === '#contact' || h === 'contact';
};

/** Download marketing page in browser; contact-only modal in app shell. */
export const AppShellDownloadRoute: React.FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasBackground = hasAppShellReaderBackground(location.state);

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
      onClose={() =>
        closeAppShellMarketingOverlay(hasBackground, navigate)
      }
    />
  );
};

export default AppShellDownloadRoute;
