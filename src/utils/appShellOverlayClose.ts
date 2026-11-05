import type { NavigateFunction } from 'react-router-dom';
import { APP_SHELL_READER_ROUTE } from './appShell';

/** Close overlay from reader (history back) or cold entry (replace to reader). */
export const closeAppShellMarketingOverlay = (
  hasReaderBackground: boolean,
  navigate: NavigateFunction
): void => {
  if (hasReaderBackground) {
    navigate(-1);
    return;
  }
  navigate(APP_SHELL_READER_ROUTE, { replace: true });
};

export const hasAppShellReaderBackground = (
  locationState: unknown
): boolean =>
  Boolean(
    (locationState as { backgroundLocation?: unknown } | null)?.backgroundLocation
  );
