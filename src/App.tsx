import React, { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import SplashScreen from './components/SplashScreen';
import Main from './container/main';
import 'theme/_scroll-bar.scss';

const isKingsChatCallback = () =>
  typeof window !== 'undefined' &&
  window.location.pathname.indexOf('/auth/callback') === 0;

function App() {
  //You can change this to false so the splash screen doesn't show on refresh. Remember to change back to true when pushing finally
  // Skip the splash when landing back from the KingsChat OAuth redirect so the
  // callback handler runs immediately instead of waiting for the splash timer.
  const [showingSplash, setshowingSplash] = useState(() => !isKingsChatCallback());

  useEffectOnce(() => {
    if (!showingSplash) return;
    setTimeout(() => {
      setshowingSplash(false);
    }, 7000);
  });

  return (
    <>
      {showingSplash && <SplashScreen />}
      {!showingSplash && <Main />}
      {/* <Toaster /> */}
    </>
  );
}

export default App;
