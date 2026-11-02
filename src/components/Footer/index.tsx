import React from 'react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { ReactComponent as Clock } from '../../assets/clock.svg';
import { timeFormat } from '../../utils/format';
import { getCurrentYear } from '../../utils/year';
import useGetSize from '../../hooks/useGetSize';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ReactComponent as Appstore } from 'assets/app-store.svg';
import { ReactComponent as Googlestore } from 'assets/google-store.svg';
import { ReactComponent as Applestore } from 'assets/apple-store.svg';
import { ReactComponent as CeFlix } from 'assets/ceFlix.svg';
import { footerHeightAtom } from '../../store/atoms/size';
import logo from 'assets/Frame-LogoBW.png'

// import style from './styles.module.scss';
import clsx from 'clsx';
import { DarkThemeAtom, SideNavAtom } from 'store/atoms/general';

export interface IFooter { }

const Footer: React.FunctionComponent<IFooter> = () => {
  const [time, setTime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const { hour, minute, second } = time;
  const setFooterHeight = useSetRecoilState(footerHeightAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const [sideNav, setSideNav] = useRecoilState(SideNavAtom);
  const { height, ref } = useGetSize();
  // const { project } = useProjects();

  // useEffect(() => {
  //   const currentTime = setInterval(() => {
  //     setTime(DateTime.now().toObject());
  //   }, 1000);

  //   setTimeout(() => {
  //     clearInterval(currentTime);
  //   }, 1000);
  // }, [time]);

  useEffect(() => {
    setFooterHeight(height);
  }, [height, setFooterHeight]);

  return (
    <footer
      className="flex items-center bg-[#DDDDDD] "
      ref={ref}
    >
      <div className={clsx("flex items-center mr-auto bg-[#18668D] h-full w-[18%] transition-width duration-500 ease-in-out", { '!w-[6%]': sideNav === false })}
        style={{
          minHeight: height,
          maxHeight: height,
        }}
      >
        <img src={logo} alt="" className=" ml-6  w-5" />
        <span className={clsx("text-white text-[65%] ml-2", { 'hidden': sideNav === false })}>Bible+ Reader</span>
      </div>
      <div className={clsx("flex items-center w-full !h-[10%]  justify-between px-7  text-sm", { 'bg-[#869098]': DarkTheme })}>

        <ul className="flex flex-col w-56 ">
          {/* <span className="text-[8px] cursor-pointer font-bold hover:text-primary text-[#266A8E]"> Get Our Mobile Application</span> */}
          <div className="stores flex ">
            <Appstore className="w-15 mr-2 cursor-pointer" />
            <Googlestore className="w-15 mr-2 cursor-pointer" />
            <Applestore className="w-15 cursor-pointer" />
          </div>


        </ul>




        <div className="text-center text-[#727272] text-[13px] mr-10  justify-center  ">
          <p className="hidden md:block">
            {getCurrentYear()} &copy; ROR Bible+. All Rights Reserved | Privacy | Terms of Use
          </p>

          <p className="md:hidden">
            {getCurrentYear()} &copy; ROR Bible+.<br />
            All Rights Reserved | Privacy | Terms of Use
          </p>
        </div>

        <div></div>

      </div>

    </footer>
  );
};

export default Footer;
