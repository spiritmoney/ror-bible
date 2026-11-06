import React, { useState, useCallback, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Main from './container/main';
import 'theme/_scroll-bar.scss';
import { isAppShell } from 'utils/appShell';
import { isRunningInElectron } from 'utils/electronRuntime';

const SPLASH_AUTO_MS = 2000;

const isKingsChatCallback = () => {
  if (typeof window === 'undefined') return false;
  const hashPath = window.location.hash.replace(/^#/, '');
  if (hashPath.startsWith('/auth/callback')) return true;
  return window.location.pathname.indexOf('/auth/callback') === 0;
};

/** Marketing pages: show the site immediately (splash would keep Main unmounted and break tooling). */
function skipSplashForMarketingPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/home' ||
    pathname === '/bible-online' ||
    pathname === '/features' ||
    pathname === '/pricing' ||
    pathname === '/download' ||
    /^\/products\/(web|mobile|desktop|voice)$/.test(pathname) ||
    pathname === '/about' ||
    pathname === '/product' ||
    pathname === '/give' ||
    pathname === '/partner'
  );
}

function App() {
  const [showingSplash, setshowingSplash] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (process.env.NODE_ENV === 'development') return false;
    if (isKingsChatCallback()) return false;
    if (skipSplashForMarketingPath(window.location.pathname)) return false;
    return true;
  });

  const dismissSplash = useCallback(() => {
    setshowingSplash(false);
  }, []);

  useEffect(() => {
    if (isAppShell()) {
      document.documentElement.classList.add('is-app-shell');
    }
    return () => document.documentElement.classList.remove('is-app-shell');
  }, []);

  useEffect(() => {
    const id = process.env.REACT_APP_BUILD_ID;
    if (id) {
      console.info(`[Rhapsody Bible] build ${id}`);
    }
  }, []);

  useEffect(() => {
    if (!isRunningInElectron()) return;
    document.documentElement.classList.add('is-electron');
    return () => document.documentElement.classList.remove('is-electron');
  }, []);

  useEffect(() => {
    if (!showingSplash) return;
    const t = window.setTimeout(dismissSplash, SPLASH_AUTO_MS);
    return () => window.clearTimeout(t);
  }, [showingSplash, dismissSplash]);

  useEffect(() => {
    if (!showingSplash) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismissSplash();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showingSplash, dismissSplash]);

  return (
    <>
      {showingSplash && <SplashScreen onDismiss={dismissSplash} />}
      {!showingSplash && <Main />}
      {/* <Toaster /> */}
    </>
  );
}

export default App;
