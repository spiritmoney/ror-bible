import React, { useEffect, useMemo } from 'react';
import './website-isolation.css';
import './reference.css';
import Header from './header';
import Footer from './footer';
import MobileMenu from './MobileMenu';
import { MenuContext } from './websiteMenuContext';

type LayoutProps = {
  children: React.ReactNode;
  isModal?: boolean;
  onClose?: () => void;
};

export default function WebsiteLayout({
  children,
  isModal = false,
  onClose,
}: LayoutProps) {
  const [mobileOpen, setMobileOpenState] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);

  const setMobileOpen = (open: boolean) => {
    setMobileOpenState(open);
  };

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpen);
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [mobileOpen]);

  useEffect(() => {
    const closeMega = () => setMegaOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        closeMega();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const menuValue = useMemo(
    () => ({ mobileOpen, setMobileOpen, megaOpen, setMegaOpen }),
    [mobileOpen, megaOpen]
  );

  if (isModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="website-root"
      >
        <div className="u65ab74">
          <button
            type="button"
            onClick={() => (onClose ? onClose() : window.history.back())}
            className="ub90127"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <MenuContext.Provider value={menuValue}>
      <div className="website-root">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="ufbe48a">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <MobileMenu />
      </div>
    </MenuContext.Provider>
  );
}
