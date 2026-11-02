import React from 'react';
import clsx from 'clsx';
import logo from 'assets/logo.png.png';
import cloudBG from 'assets/SplashBG.png';
import style from './styles.module.scss';

export interface ISplashScreen {
  onDismiss?: () => void;
}

const SplashScreen: React.FunctionComponent<ISplashScreen> = ({ onDismiss }) => {
  return (
    <section
      role="button"
      tabIndex={0}
      aria-label="Skip splash screen"
      className={clsx(
        'flex items-center justify-center min-h-screen cursor-pointer font-montserrat bg-brand-pale',
        style.wrapper
      )}
      onClick={() => onDismiss?.()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDismiss?.();
        }
      }}
    >
      <div className="flex relative w-full items-center justify-center h-screen">
        <img src={cloudBG} alt="" className="w-full h-full object-cover opacity-90" />
        <div className="flex flex-col w-[20rem] items-center justify-center absolute">
          <img
            src={logo}
            alt=""
            className={clsx('w-32 h-32 scale-150 animate-logo', style.logo)}
          />
          <span className="font-montserrat whitespace-nowrap font-extrabold text-[30px] mt-4 animate-logoText scale-0 w-0 text-brand-blue text-center">
            Rhapsody Bible
          </span>
          <span className="font-montserrat whitespace-nowrap flex font-semibold text-[15px] mt-1 animate-logoSubtitle scale-0 w-0 text-brand-navy">
            Read. Study. Meditate. Triumph.
          </span>
          <p className="mt-8 text-sm text-brand-ink/80 animate-fadein">
            Tap or press any key to continue
          </p>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;
