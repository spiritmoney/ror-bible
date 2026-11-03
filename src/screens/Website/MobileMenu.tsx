import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginRoute } from 'navigation/routes';
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
import { isAppShell } from 'utils/appShell';

export default function MobileMenu() {
  const appShell = isAppShell();
  const { mobileOpen, setMobileOpen } = useWebsiteMenu();
  const closeRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileOpen) {
      closeRef.current?.focus();
    }
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    document.querySelectorAll('[data-open-menu]').forEach((o) => {
      o.setAttribute('aria-expanded', 'false');
    });
  };

  const openModal = (path: string) => {
    closeMenu();
    navigate(path, { state: { backgroundLocation: location } });
  };

  if (appShell) {
    return null;
  }

  return (
    <div
      id="mobile-menu"
      className={`drawer${mobileOpen ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="ua7c764">
        <div className="u65ab74">
          <Link className="lockup uf4a30a" to="/home" aria-label="ROR Bible+ home" onClick={closeMenu}>
            <img className="u90a9e0" src={icon} alt="" />
            <span className="udae209">
              <span className="u29dbc6">ROR Bible+</span>
              <span className="u0ae8a0">Premium Bible Reader</span>
            </span>
          </Link>
          <button
            ref={closeRef}
            className="ub90127"
            type="button"
            data-close-menu
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="uad67f1" aria-hidden="true">
          <div className="u3e339b" />
          <div className="u1584b2" />
          <div className="u7c48ed" />
        </div>
        <div className="ue362a4">
          <label className="u8991f4" htmlFor="msearch">
            Search
          </label>
          <div className="u9045cb">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20l-4.3-4.3" />
            </svg>
            <input className="u94d9c8" id="msearch" placeholder="Search features and help" />
          </div>
          <Link className="ub51bfc" to={WebsiteFeaturesRoute} onClick={closeMenu}>
            Features
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9DB8C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a className="u7e57e7" href="#" onClick={(e) => e.preventDefault()}>
            Products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <div className="ufec3c0">
            <Link className="ub0f8e7" to={WebsiteProductMobileRoute} onClick={closeMenu}>
              Mobile
            </Link>
            <Link className="ub0f8e7" to={WebsiteProductWebRoute} onClick={closeMenu}>
              Web
            </Link>
            <Link className="ub0f8e7" to={WebsiteProductDesktopRoute} onClick={closeMenu}>
              Desktop
            </Link>
            <Link className="ub0f8e7" to={WebsiteProductVoiceRoute} onClick={closeMenu}>
              Voice
            </Link>
          </div>
          <Link className="ub51bfc" to={WebsitePricingRoute} onClick={closeMenu}>
            Pricing
          </Link>
          <Link className="ub51bfc" to={WebsiteDownloadRoute} onClick={closeMenu}>
            Download
          </Link>
          <a
            className="ub51bfc"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openModal('/about');
            }}
          >
            About
          </a>
          <div className="ubf62a4">
            <Link className="uc637f1" to="/bible-online" onClick={closeMenu}>
              Bible Online
            </Link>
            <a className="uc637f1" href="https://blog.rorbible.plus">
              Blog
            </a>
            <a
              className="uc637f1"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('/partner');
              }}
            >
              Partner
            </a>
            <a
              className="uc637f1"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('/give');
              }}
            >
              Give
            </a>
            <Link className="uc637f1" to={`${WebsiteDownloadRoute}#support`} onClick={closeMenu}>
              Support
            </Link>
            <Link className="uc637f1" to="/store" onClick={closeMenu} data-allowed="1">
              Store
            </Link>
            <Link className="uc637f1" to={`${WebsiteDownloadRoute}#contact`} onClick={closeMenu} data-allowed="1">
              Contact
            </Link>
          </div>
          <Link className="u5fbba1" to={WebsiteDownloadRoute} onClick={closeMenu}>
            Get the app
          </Link>
          <Link className="ufb0589" to={LoginRoute} onClick={closeMenu}>
            Sign in with KingsChat
          </Link>
        </div>
      </div>
    </div>
  );
}
