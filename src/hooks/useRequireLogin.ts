import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { LoginRoute } from 'navigation/routes';
import { saveAuthReturnPath } from 'utils/authReturnPath';

/**
 * Runs an action when logged in; otherwise sends the user to /login with a
 * return path (router state + sessionStorage) so reader position is preserved.
 */
export const useRequireLogin = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const requireLogin = useCallback(
    (run?: () => void): boolean => {
      if (isAuthenticated) {
        run?.();
        return true;
      }

      const returnPath =
        location.pathname + location.search + location.hash;
      saveAuthReturnPath(returnPath);
      navigate(LoginRoute, {
        state: { from: returnPath },
      });
      return false;
    },
    [isAuthenticated, navigate, location]
  );

  return { isAuthenticated, requireLogin };
};
