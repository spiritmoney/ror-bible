import React from 'react';
import clsx from 'clsx';
import logo from 'assets/logo.png.png';
import cloudBG from 'assets/SplashBG.png';
import style from './styles.module.scss';

export interface ISplashScreen { }

const SplashScreen: React.FunctionComponent<ISplashScreen> = () => {
  return (
    <section
      className={clsx(
        'flex items-center justify-center min-h-screen',
        style.wrapper
      )}
      style={{
        // background: 'linear-gradient(116.82deg, #ffffff 0%, #143D5E 100%)',
      }}
    >
      <div className="flex relative w-full items-center justify-center h-screen">
        <img src={cloudBG} alt='' className='w-full h-full' />
        <div className='flex flex-col w-[20rem] items-center justify-center  absolute '>
          <img src={logo} alt='' className={clsx('  w-32 h-32 scale-150 animate-logo', style.logo)} />
          <span className="font-montserrat whitespace-nowrap font-bold text-[30px] mt-4 animate-logoText scale-0 w-0  text-[#0989b8] text-center">
            Rhapsody Bible
          </span>
          <span className="font-montserrat whitespace-nowrap  flex font-bold text-[15px] mt-1 animate-logoSubtitle scale-0 w-0 text-[#63170d]">
            Read. Study. Meditate. Triumph.
          </span>
        </div>
      </div>

      
    </section>
  );
};

export default SplashScreen;
