import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginRoute } from 'navigation/routes';
import BrandStripe from './BrandStripe';
import WebsiteButton from './WebsiteButton';
import { useWebsiteMenu } from './websiteMenuContext';
import {
  WebsiteDownloadRoute,
  WebsiteFeaturesRoute,
  WebsitePricingRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';

export default function MobileMenu() {
  const { mobileOpen, setMobileOpen } = useWebsiteMenu();
  const location = useLocation();
  const navigate = useNavigate();

  if (!mobileOpen) return null;

  const openModal = (path: string) => {
    setMobileOpen(false);
    navigate(path, { state: { backgroundLocation: location } });
  };

  const row = (to: string, label: string, onClick?: () => void) =>
    onClick ? (
      <button
        type="button"
        className="flex items-center justify-between w-full py-4 border-b border-brand-mist text-left font-semibold text-brand-navy"
        onClick={onClick}
      >
        {label}
        <span aria-hidden>→</span>
      </button>
    ) : (
      <Link
        to={to}
        className="flex items-center justify-between py-4 border-b border-brand-mist font-semibold text-brand-navy"
        onClick={() => setMobileOpen(false)}
      >
        {label}
        <span aria-hidden>→</span>
      </Link>
    );

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[80] bg-brand-pale overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/home" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <img src={icon} alt="" className="h-10 w-auto" />
            <span className="font-extrabold text-brand-blue">ROR Bible+</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="w-11 h-11 rounded-xl bg-brand-mist inline-flex items-center justify-center"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>
        <BrandStripe />
        <div className="mt-6">
          {row(WebsiteFeaturesRoute, 'Features')}
          {row(WebsiteProductMobileRoute, 'Products — Mobile', () => openModal(WebsiteProductMobileRoute))}
          {row(WebsitePricingRoute, 'Pricing')}
          {row(WebsiteDownloadRoute, 'Download')}
          {row('/about', 'About', () => openModal('/about'))}
          <div className="grid grid-cols-2 gap-2 py-4">
            <Link to={WebsiteProductWebRoute} className="p-3 rounded-xl bg-white text-sm font-semibold" onClick={() => setMobileOpen(false)}>Web</Link>
            <Link to={WebsiteProductDesktopRoute} className="p-3 rounded-xl bg-white text-sm font-semibold" onClick={() => setMobileOpen(false)}>Desktop</Link>
            <Link to={WebsiteProductVoiceRoute} className="p-3 rounded-xl bg-white text-sm font-semibold" onClick={() => setMobileOpen(false)}>Voice</Link>
            <Link to="/bible-online" className="p-3 rounded-xl bg-white text-sm font-semibold" onClick={() => setMobileOpen(false)}>Bible Online</Link>
          </div>
          <div className="flex flex-wrap gap-2 py-2 text-sm font-semibold">
            <Link to="/store" onClick={() => setMobileOpen(false)}>Store</Link>
            <a href="https://blog.rorbible.plus">Blog</a>
            <button type="button" onClick={() => openModal('/partner')}>Partner</button>
            <button type="button" onClick={() => openModal('/give')}>Give</button>
            <Link to={`${WebsiteDownloadRoute}#support`} onClick={() => setMobileOpen(false)}>Support</Link>
            <Link to={`${WebsiteDownloadRoute}#contact`} onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>
          <WebsiteButton to={WebsiteDownloadRoute} className="w-full justify-center mt-4" onClick={() => setMobileOpen(false)}>
            Get the app
          </WebsiteButton>
          <WebsiteButton to={LoginRoute} variant="secondary" className="w-full justify-center mt-3">
            Sign in with KingsChat
          </WebsiteButton>
        </div>
      </div>
    </div>
  );
}
