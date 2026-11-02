import React from 'react';
import logo from '../../assets/website/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { activeNavAtom } from 'store/atoms/general';
import { useUser } from 'hooks/useUser';
import ProfileMenu from 'components/ProfileMenu';

export const HEADER_HEIGHT = 96; // px — adjust if you want a different fixed header height

type Props = {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

export default function Header({ drawerOpen, setDrawerOpen }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const openAbout = () =>
    navigate('/about', { state: { backgroundLocation: location } });
  const openProduct = () =>
    navigate('/product', { state: { backgroundLocation: location } });
  const openPartner = () =>
    navigate('/partner', { state: { backgroundLocation: location } });
  const openGive = () =>
    navigate('/give', { state: { backgroundLocation: location } });
  const [activeNav, setActiveNav] = useRecoilState(activeNavAtom);
  const { user } = useUser();

  // normalizer so keys are consistent
  const normalize = (s?: string) => (s ?? '').trim().toLowerCase();

  // helper to set active from a label (keeps code simple)
  const setActiveFromLabel = (label?: string) => {
    const key = normalize(label);
    if (key) setActiveNav(key);
  };

  const logoClick = () => {
    navigate('/home');
    setActiveNav('home');
  };

  return (
    <header
      className="fixed left-0 right-0 z-40 select-none"
      style={{ height: HEADER_HEIGHT, backdropFilter: 'none' }}
    >
      {/* Top logo row */}
      <div className="bg-[#18668D]">
        <div
          className="max-w-7xl mx-auto px-4 md:ml-[4rem] md:px-4 py-2 flex items-center cursor-pointer"
          style={{ height: HEADER_HEIGHT / 2 }}
          onClick={logoClick}
          role="button"
        >
          <img src={logo} className="w-36 md:w-[10rem] !z-100" alt="logo" />
        </div>
      </div>

      {/* Main nav row */}
      <div
        className="bg-[#0299B4] text-white"
        style={{ height: HEADER_HEIGHT / 2 }}
      >
        <div className="max-w-7xl  px-4 md:mx-[3.5rem] p-1 flex items-center justify-between h-full">
          {/* hamburger Icon */}
          <button
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setDrawerOpen(true)}
            className={`rounded hover:bg-white/10 p-1 ${drawerOpen && 'hidden'} `}
            type="button"
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* center nav (hidden on small screens to preserve layout) */}
          <nav
            className={`hidden lg:flex flex-1 items-center justify-center gap-6 transition-opacity duration-300 ${
              drawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            {[
              { label: 'About', isButton: true, onClick: openAbout },
              { label: 'Products', isButton: true, onClick: openProduct },
              { label: 'Store', href: '/store' },
              { label: 'Bible Online', href: '/bible-online' },
              { label: 'Blog', href: '#blog' },
              { label: 'Partner', isButton: true, onClick: openPartner },
              { label: 'Give', isButton: true, onClick: openGive },
              { label: 'Contact', href: '#contact' },
            ].map(item => {
              const key = normalize(item.label);
              // Determine if underline should show
              const isHome =
                location.pathname === '/' || location.pathname === '/home';
              const isActive = !isHome && activeNav === key;

              return (
                <div key={key} className="relative flex items-center">
                  {item.isButton ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFromLabel(item.label);
                        item.onClick?.();
                      }}
                      className="text-white/90 hover:underline"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => {
                        setActiveFromLabel(item.label);
                      }}
                      className="text-white/90 hover:underline"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  )}
                  <span
                    className={`absolute -bottom-1 rounded left-0 right-0 h-[2px] bg-[#3CF9FF] transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden
                  />
                </div>
              );
            })}
          </nav>

          {/* search / icon area */}
          <div className="ml-auto flex items-center gap-3">
            {/* hide search on smallest screens to keep space Not working also */}
            <button
              className="p-1 hidden md:block lg:block"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-white/80"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* profile avatar — far right, shown once the user is logged in */}
            {user?.id && <ProfileMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
