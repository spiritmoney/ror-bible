import React, { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import SplashScreen from './components/SplashScreen';
import Main from './container/main';
import 'theme/_scroll-bar.scss';

function App() {
  //You can change this to false so the splash screen doesn't show on refresh. Remember to change back to true when pushing finally
  const [showingSplash, setshowingSplash] = useState(true);

  useEffectOnce(() => {
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
