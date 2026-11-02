import { createContext, useContext } from 'react';

type MenuContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  megaOpen: boolean;
  setMegaOpen: (open: boolean) => void;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useWebsiteMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useWebsiteMenu must be used within WebsiteLayout');
  return ctx;
}
