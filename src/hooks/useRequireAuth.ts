import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { LoginRoute } from 'navigation/routes';

/**
 * Helper for protecting a single action (e.g. highlight / bookmark).
 * Returns `requireAuth` which redirects to the login screen (remembering the
 * current page) when the user is not authenticated.
 */
export const useRequireAuth = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback((): boolean => {
    if (isAuthenticated) return true;

    navigate(LoginRoute, {
      state: {
        from: location.pathname + location.search + location.hash,
      },
    });
    return false;
  }, [isAuthenticated, navigate, location]);

  return { isAuthenticated, requireAuth };
};
