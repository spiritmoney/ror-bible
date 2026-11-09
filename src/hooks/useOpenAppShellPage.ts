import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAppShell } from 'utils/appShell';
import { isElectron } from 'utils/general';
import { ROR_BIBLE_BLOG_URL } from 'config/appTopNavWebsite';

export { ROR_BIBLE_BLOG_URL };

export const openExternalUrl = (url: string): void => {
  if (typeof window === 'undefined') return;

  if (isElectron() && window.electronAPI?.openExternal) {
    void window.electronAPI.openExternal(url);
    return;
  }

  window.open(url, '_blank', 'noopener');
};

/**
 * Opens in-app marketing pages over the reader (modal overlay) in app shell,
 * or as normal routes in the website browser.
 */
export const useOpenAppShellPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const openPage = useCallback(
    (pathname: string, hash?: string) => {
      const hashValue = hash
        ? hash.startsWith('#')
          ? hash.slice(1)
          : hash
        : undefined;

      if (isAppShell()) {
        navigate(
          { pathname, hash: hashValue },
          { state: { backgroundLocation: location } }
        );
        return;
      }

      navigate({ pathname, hash: hashValue });
    },
    [location, navigate]
  );

  const closeOverlay = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return { openPage, closeOverlay, openExternalUrl };
};
