import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useUser } from 'hooks/useUser';
import ProfileMenu from 'components/ProfileMenu';
import { LoginRoute } from 'navigation/routes';
import BrandStripe from './BrandStripe';
import WebsiteButton from './WebsiteButton';
import { useWebsiteMenu } from './WebsiteLayout';
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

type Props = { headerOffset: number };

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header({ headerOffset }: Props) {
  const { mobileOpen, setMobileOpen, megaOpen, setMegaOpen } = useWebsiteMenu();
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setAboutOpen(false);
  }, [location.pathname, setMegaOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [megaOpen, setMegaOpen]);

  const openModal = (path: string) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  const path = location.pathname;
  const navClass = (active: boolean) =>
    clsx(
      'inline-flex items-center gap-1.5 min-h-[76px] text-base font-semibold text-brand-navy relative',
      active && 'text-brand-orange after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-brand-orange after:rounded-full'
    );

  return (
    <header
      className="site-header fixed left-0 right-0 top-0 z-50"
      style={{ height: headerOffset }}
    >
      <div className="hidden website-md:block bg-brand-blue">
        <div className="max-w-website mx-auto px-8 website-sm:px-4 min-h-10 flex items-center justify-between gap-6 text-[13px] font-semibold text-white">
          <span>
            The Word. Across your world.{' '}
            <span className="text-[#BDE9F0] font-medium">Mobile · Web · Desktop · Voice</span>
          </span>
          <nav className="flex items-center gap-5 flex-wrap justify-end" aria-label="Utility">
            <Link to="/bible-online" className="hover:underline">
              Bible Online
            </Link>
            <a href="https://blog.rorbible.plus" className="hover:underline">
              Blog
            </a>
            <button type="button" className="hover:underline" onClick={() => openModal('/partner')}>
              Partner
            </button>
            <button type="button" className="hover:underline" onClick={() => openModal('/give')}>
              Give
            </button>
            <Link to={`${WebsiteDownloadRoute}#support`} className="hover:underline">
              Support
            </Link>
            <Link to="/store" className="hover:underline">
              Store
            </Link>
            <Link to={`${WebsiteDownloadRoute}#contact`} className="hover:underline">
              Contact
            </Link>
            <span className="w-px h-4 bg-white/40" aria-hidden />
            <Link to={LoginRoute} className="inline-flex items-center gap-2 font-bold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 5h16v11H9l-5 4z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign in with KingsChat
            </Link>
          </nav>
        </div>
      </div>

      <div
        className={clsx(
          'bg-white/95 backdrop-blur-md transition-shadow',
          scrolled && 'shadow-brand-header'
        )}
      >
        <div className="max-w-website mx-auto px-8 website-sm:px-4 min-h-[76px] flex items-center justify-between gap-6">
          <Link to="/home" className="flex items-center gap-3 shrink-0" aria-label="ROR Bible+ home">
            <img src={icon} alt="" className="h-[52px] website-sm:h-10 w-auto" />
            <span className="flex flex-col justify-between h-[52px] website-sm:h-10">
              <span className="text-[30px] website-sm:text-[19px] leading-none font-extrabold text-brand-blue tracking-tight">
                ROR Bible+
              </span>
              <span className="text-lg website-sm:text-[11.5px] leading-none font-medium text-brand-blue">
                Premium Bible Reader
              </span>
            </span>
          </Link>

          <nav className="hidden website-md:flex items-center gap-8" aria-label="Main">
            <Link to={WebsiteFeaturesRoute} className={navClass(path === WebsiteFeaturesRoute)}>
              Features
            </Link>
            <button
              type="button"
              className={navClass(megaOpen || path.startsWith('/products'))}
              aria-expanded={megaOpen}
              aria-controls="products-menu"
              onClick={(e) => {
                e.stopPropagation();
                setMegaOpen(!megaOpen);
              }}
            >
              Products
              <Chevron />
            </button>
            <Link to={WebsitePricingRoute} className={navClass(path === WebsitePricingRoute)}>
              Pricing
            </Link>
            <Link to={WebsiteDownloadRoute} className={navClass(path === WebsiteDownloadRoute)}>
              Download
            </Link>
            <div className="relative">
              <button
                type="button"
                className={navClass(aboutOpen || path === '/about')}
                aria-expanded={aboutOpen}
                onClick={() => setAboutOpen(!aboutOpen)}
              >
                About
                <Chevron />
              </button>
              {aboutOpen ? (
                <div className="absolute left-0 top-full pt-2 min-w-[220px] z-[70]">
                  <div className="rounded-2xl bg-white shadow-brand-card border border-brand-mist p-2">
                    {[
                      ['Mission', 'mission'],
                      ['Stories', 'stories'],
                      ['Careers', 'careers'],
                      ['Global Hubs', 'hub'],
                      ['Bible Translation', 'bible'],
                      ['Press', 'press'],
                    ].map(([label, slug]) => (
                      <button
                        key={slug}
                        type="button"
                        className="block w-full text-left px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-pale"
                        onClick={() => {
                          setAboutOpen(false);
                          navigate(`/about#${slug}`, {
                            state: { backgroundLocation: location },
                          });
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              aria-label="Search"
              className="hidden website-md:inline-flex w-11 h-11 rounded-full bg-brand-mist items-center justify-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-orange"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6" stroke="#19688B" strokeWidth="2.2" />
                <path d="M20 20l-4.3-4.3" stroke="#19688B" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
            <WebsiteButton
              to={WebsiteDownloadRoute}
              className="hidden website-md:inline-flex !min-h-12 !px-5 !text-[15px] website-sm:!text-[15px] shadow-brand-orange-sm"
            >
              Get the app
            </WebsiteButton>
            {user?.id ? <ProfileMenu /> : null}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="website-md:hidden inline-flex w-11 h-11 rounded-xl bg-brand-mist items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="#19688B" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <BrandStripe />

      <div
        id="products-menu"
        ref={megaRef}
        className={clsx(
          'absolute left-0 right-0 top-full z-[60] pb-6',
          megaOpen ? 'block' : 'hidden'
        )}
      >
        <div className="max-w-website mx-auto px-8 website-sm:px-4">
          <div className="mt-3 p-7 rounded-3xl bg-white shadow-brand-card flex flex-wrap gap-7">
            <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-3">
              <span className="text-xs font-extrabold tracking-wide uppercase text-brand-blue">
                Premium Bible Reader · four formats
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  [WebsiteProductMobileRoute, 'ROR Bible+ Mobile', 'The Word wherever you go.', 'Android and iOS'],
                  [WebsiteProductWebRoute, 'ROR Bible+ Web', 'Open your browser. Open the Word.', 'Bible Online and Bible Lite (PWA)'],
                  [WebsiteProductDesktopRoute, 'ROR Bible+ Desktop', 'More room for deeper study.', 'MacOS, Windows and Linux'],
                  [WebsiteProductVoiceRoute, 'ROR Bible+ Voice', 'Speak. Listen. Engage with the Word.', 'Amazon Alexa and Google Home'],
                ].map(([to, title, tag, sub]) => (
                  <Link
                    key={to as string}
                    to={to as string}
                    className="flex gap-4 p-4 rounded-[18px] bg-brand-pale hover:bg-brand-mist transition-colors"
                    onClick={() => setMegaOpen(false)}
                  >
                    <span className="w-[52px] h-[52px] rounded-2xl bg-white flex items-center justify-center shrink-0 text-brand-blue font-bold text-lg">
                      +
                    </span>
                    <span>
                      <span className="block text-[17px] font-extrabold text-brand-blue">{title}</span>
                      <span className="block text-sm font-semibold text-brand-navy">{tag}</span>
                      <span className="block text-sm text-brand-ink">{sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex flex-col gap-3">
              <span className="text-xs font-extrabold tracking-wide uppercase text-brand-blue">
                More from ROR Bible+
              </span>
              {['@MySpot', 'RORK Bible for Kids', 'Teevo Bible for Teens'].map((label) => (
                <span key={label} className="block p-3 rounded-2xl bg-brand-pale text-sm font-bold text-brand-navy">
                  {label}
                </span>
              ))}
              <Link
                to="/home#promo"
                className="mt-2 flex items-center gap-3 p-3 rounded-2xl bg-brand-navy text-white text-sm font-bold"
                onClick={() => setMegaOpen(false)}
              >
                <span className="w-10 h-10 rounded-full bg-brand-orange inline-flex items-center justify-center">▶</span>
                Watch the TV promo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { HEADER_HEIGHT, HEADER_HEIGHT_COMPACT } from './WebsiteLayout';
