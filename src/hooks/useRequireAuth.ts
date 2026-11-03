import { useRequireLogin } from 'hooks/useRequireLogin';

/** @deprecated Prefer `useRequireLogin` — kept for existing call sites. */
export const useRequireAuth = () => {
  const { isAuthenticated, requireLogin } = useRequireLogin();
  const requireAuth = (): boolean => requireLogin();
  return { isAuthenticated, requireAuth };
};
