import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import ProfileMenu from 'components/ProfileMenu';
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

export default function Header() {
  const appShell = isAppShell();
  const { mobileOpen, setMobileOpen, megaOpen, setMegaOpen } = useWebsiteMenu();
  const headerRef = useRef<HTMLElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const path = location.pathname;
  const navActive = {
    features: path === WebsiteFeaturesRoute,
    products:
      path === WebsiteProductWebRoute ||
      path === WebsiteProductMobileRoute ||
      path === WebsiteProductDesktopRoute ||
      path === WebsiteProductVoiceRoute,
    pricing: path === WebsitePricingRoute,
    download: path === WebsiteDownloadRoute,
  };
  const navClass = (active: boolean) => (active ? 'uddbb6d' : 'u406034');
  const navMarker = (active: boolean) =>
    active ? <span className="u3084a3" aria-hidden="true" /> : null;

  useEffect(() => {
    const header = headerRef.current;
    const onScroll = () => {
      if (header) {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
  }, [location.pathname, setMegaOpen]);

  useEffect(() => {
    const mega = megaRef.current;
    const trigger = triggerRef.current;
    if (!megaOpen || !mega || !trigger) return;
    const onDoc = (e: MouseEvent) => {
      if (!mega.contains(e.target as Node) && !trigger.contains(e.target as Node)) {
        setMegaOpen(false);
        trigger.setAttribute('aria-expanded', 'false');
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [megaOpen, setMegaOpen]);

  const openModal = (path: string) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  const openMenu = () => {
    setMobileOpen(true);
    const openBtn = document.querySelector('[data-open-menu]');
    if (openBtn instanceof HTMLElement) {
      openBtn.setAttribute('aria-expanded', 'true');
    }
  };

  const toggleMega = (e: React.MouseEvent) => {
    e.preventDefault();
    setMegaOpen(!megaOpen);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="hidesm u9badc9">
        <div className="wrap u15fd9a">
          <span className="u27305c">
            The Word. Across your world.{' '}
            <span className="u0d987c">Mobile · Web · Desktop · Voice</span>
          </span>
          <nav className="udb6254" aria-label="Utility">
            <Link className="u2ee821" to="/bible-online">
              Bible Online
            </Link>
            {!appShell && (
              <>
            <a className="u2ee821" href="https://blog.rorbible.plus">
              Blog
            </a>
            <a
              className="u2ee821"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('/partner');
              }}
            >
              Partner
            </a>
            <a
              className="u2ee821"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('/give');
              }}
            >
              Give
            </a>
            <Link className="u2ee821" to={`${WebsiteDownloadRoute}#support`}>
              Support
            </Link>
              </>
            )}
            <span className="u07d673" aria-hidden="true" />
            <Link className="u030a0a" to={LoginRoute}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 5h16v11H9l-5 4z" />
              </svg>
              Sign in with KingsChat
            </Link>
            <Link className="u2ee821" to="/store" data-allowed="1">
              Store
            </Link>
            <Link className="u2ee821" to={`${WebsiteDownloadRoute}#contact`} data-allowed="1">
              Contact
            </Link>
          </nav>
        </div>
      </div>
      <div className="main-bar uddc867">
        <div className="wrap u253ea9">
          <Link className="lockup u0eefb8" to={appShell ? '/bible-online' : '/home'} aria-label="ROR Bible+ home">
            <img className="u8abd8c" src={icon} alt="" />
            <span className="u1a913d">
              <span className="u55add1">ROR Bible+</span>
              <span className="u775481">Premium Bible Reader</span>
            </span>
          </Link>
          {!appShell && (
          <nav className="navlinks u807e2d" aria-label="Main">
            <Link className={navClass(navActive.features)} to={WebsiteFeaturesRoute}>
              Features
              {navMarker(navActive.features)}
            </Link>
            <a
              ref={triggerRef}
              className={navClass(navActive.products)}
              href={WebsiteProductWebRoute}
              data-mega-trigger
              aria-controls="products-menu"
              aria-expanded={megaOpen ? 'true' : 'false'}
              onClick={toggleMega}
            >
              Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B2F44" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
              {navMarker(navActive.products)}
            </a>
            <Link className={navClass(navActive.pricing)} to={WebsitePricingRoute}>
              Pricing
              {navMarker(navActive.pricing)}
            </Link>
            <Link className={navClass(navActive.download)} to={WebsiteDownloadRoute}>
              Download
              {navMarker(navActive.download)}
            </Link>
            <a
              className="u406034"
              href="#"
              aria-expanded="false"
              onClick={(e) => {
                e.preventDefault();
                openModal('/about');
              }}
            >
              About
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B2F44" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </nav>
          )}
          <div className="u133d27">
            <button className="hidesm u421e53" type="button" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20l-4.3-4.3" />
              </svg>
            </button>
            {!appShell && (
            <Link className="getapp btn-lift u05f1f4" to={WebsiteDownloadRoute}>
              Get the app
            </Link>
            )}
            {user?.id ? (
              <span data-allowed="1">
                <ProfileMenu />
              </span>
            ) : null}
            <button
              className="menubtn u1eed2d"
              type="button"
              data-open-menu
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen ? 'true' : 'false'}
              aria-label="Open menu"
              onClick={openMenu}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="uad67f1" aria-hidden="true">
        <div className="u3e339b" />
        <div className="u1584b2" />
        <div className="u7c48ed" />
      </div>
      {!appShell && (
      <div
        id="products-menu"
        ref={megaRef}
        className={`mega ue4ba2f${megaOpen ? ' is-open' : ''}`}
      >
        <div className="wrap u3cf3d8">
          <div className="u09a9f6">
            <div className="u6911fc">
              <span className="u0536e1">Premium Bible Reader · four formats</span>
              <div className="uc3ddf1">
                <Link className="uedde83" to={WebsiteProductMobileRoute} onClick={() => setMegaOpen(false)}>
                  <div className="uef9577">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="7" y="2" width="10" height="20" rx="2.5" />
                      <path d="M11 18h2" />
                    </svg>
                  </div>
                  <span className="ue799f8">
                    <span className="u59677c">ROR Bible+ Mobile</span>
                    <span className="ua6ac0f">
                      The Word <span className="ub8bc62">wherever you go.</span>
                    </span>
                    <span className="u316cbb">Android and iOS</span>
                  </span>
                </Link>
                <Link className="uedde83" to={WebsiteProductWebRoute} onClick={() => setMegaOpen(false)}>
                  <div className="uef9577">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
                    </svg>
                  </div>
                  <span className="ue799f8">
                    <span className="u59677c">ROR Bible+ Web</span>
                    <span className="ua6ac0f">
                      Open your browser. Open <span className="ub8bc62">the Word.</span>
                    </span>
                    <span className="u316cbb">Bible Online and Bible Lite (PWA)</span>
                  </span>
                </Link>
                <Link className="uedde83" to={WebsiteProductDesktopRoute} onClick={() => setMegaOpen(false)}>
                  <div className="uef9577">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="12" rx="1.5" />
                      <path d="M8 20h8M12 16v4" />
                    </svg>
                  </div>
                  <span className="ue799f8">
                    <span className="u59677c">ROR Bible+ Desktop</span>
                    <span className="ua6ac0f">
                      More room for <span className="ub8bc62">deeper study.</span>
                    </span>
                    <span className="u316cbb">MacOS, Windows and Linux</span>
                  </span>
                </Link>
                <Link className="uedde83" to={WebsiteProductVoiceRoute} onClick={() => setMegaOpen(false)}>
                  <div className="uef9577">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="3" width="6" height="11" rx="3" />
                      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                    </svg>
                  </div>
                  <span className="ue799f8">
                    <span className="u59677c">ROR Bible+ Voice</span>
                    <span className="ua6ac0f">
                      Speak. Listen. Engage with <span className="ub8bc62">the Word.</span>
                    </span>
                    <span className="u316cbb">Amazon Alexa and Google Home</span>
                  </span>
                </Link>
              </div>
            </div>
            <div className="u374c05">
              <span className="u0536e1">More from ROR Bible+</span>
              <a className="uec44a6" href="#" onClick={(e) => e.preventDefault()}>
                <span className="uf5c498">@MySpot</span>
                <span className="u316cbb">Digital evangelism tool</span>
              </a>
              <a className="uec44a6" href="#" onClick={(e) => e.preventDefault()}>
                <span className="uf5c498">RORK Bible for Kids</span>
                <span className="u316cbb">Scripture for children</span>
              </a>
              <a className="uec44a6" href="#" onClick={(e) => e.preventDefault()}>
                <span className="uf5c498">Teevo Bible for Teens</span>
                <span className="u316cbb">Scripture for teenagers</span>
              </a>
              <Link className="u67776a" to="/home#promo" onClick={() => setMegaOpen(false)}>
                <span className="u35f088">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </span>
                Watch the TV promo
              </Link>
            </div>
          </div>
        </div>
      </div>
      )}
    </header>
  );
}
