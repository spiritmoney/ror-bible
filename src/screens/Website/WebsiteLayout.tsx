import React, { useEffect, useMemo, useState } from 'react';
import './website.css';
import Header from './header';
import Footer from './footer';
import MobileMenu from './MobileMenu';
import { HEADER_HEIGHT, HEADER_HEIGHT_COMPACT } from './constants';
import { MenuContext } from './websiteMenuContext';

type LayoutProps = {
  children: React.ReactNode;
  isModal?: boolean;
  onClose?: () => void;
};

export function useWebsiteHeaderOffset() {
  const [offset, setOffset] = useState(HEADER_HEIGHT);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    const update = () => setOffset(mq.matches ? HEADER_HEIGHT_COMPACT : HEADER_HEIGHT);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return offset;
}

export default function WebsiteLayout({
  children,
  isModal = false,
  onClose,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const headerOffset = useWebsiteHeaderOffset();

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setMegaOpen(false);
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
        className="website-root fixed inset-0 z-[60] flex flex-col bg-brand-pale overflow-auto"
      >
        <div className="sticky top-0 z-20 bg-white/95 border-b border-brand-mist backdrop-blur-sm">
          <div className="max-w-website mx-auto px-4 py-3 flex justify-end">
            <button
              type="button"
              onClick={() => (onClose ? onClose() : window.history.back())}
              className="px-4 py-2 rounded-full text-sm font-semibold text-brand-navy hover:bg-brand-mist focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-orange"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <MenuContext.Provider value={menuValue}>
      <div className="website-root min-h-screen bg-brand-pale text-brand-navy font-montserrat">
        <a href="#main" className="website-skip-link">
          Skip to content
        </a>
        <Header headerOffset={headerOffset} />
        <main id="main" style={{ paddingTop: headerOffset }}>
          {children}
        </main>
        <Footer />
        <MobileMenu />
      </div>
    </MenuContext.Provider>
  );
}
