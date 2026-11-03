import React, { useState, useCallback, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Main from './container/main';
import 'theme/_scroll-bar.scss';
import { isElectron } from 'utils/general';

const SPLASH_AUTO_MS = 2000;

const isKingsChatCallback = () => {
  if (typeof window === 'undefined') return false;
  const hashPath = window.location.hash.replace(/^#/, '');
  if (hashPath.startsWith('/auth/callback')) return true;
  return window.location.pathname.indexOf('/auth/callback') === 0;
};

function App() {
  const [showingSplash, setshowingSplash] = useState(() => !isKingsChatCallback());

  const dismissSplash = useCallback(() => {
    setshowingSplash(false);
  }, []);

  useEffect(() => {
    if (!isElectron()) return;
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
