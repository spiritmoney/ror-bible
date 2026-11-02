import React, { useState, useCallback, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Main from './container/main';
import 'theme/_scroll-bar.scss';

const SPLASH_AUTO_MS = 2000;

const isKingsChatCallback = () =>
  typeof window !== 'undefined' &&
  window.location.pathname.indexOf('/auth/callback') === 0;

function App() {
  const [showingSplash, setshowingSplash] = useState(() => !isKingsChatCallback());

  const dismissSplash = useCallback(() => {
    setshowingSplash(false);
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
