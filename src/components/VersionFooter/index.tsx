import clsx from 'clsx';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
// import style from './styles.module.scss';

interface IVersionFooter{}

const VersionFooter: React.FunctionComponent<IVersionFooter> = () => {
  const DarkTheme = useRecoilValue(DarkThemeAtom);

  return (
    <p className={clsx("w-[80%] ml-auto mr-auto text-[13px] font-light text-[rgba(0,0,0,0.75)] text-center pt-[10px] border-t mt-8 border-[rgba(62,69,82,0.28)]", { '!text-[#EDF1F3]': DarkTheme === true})}>
      {/* latest Version of scribbbler as at oct 26th 2022 */}
      Scribbbler Version: 1.0.7_10_26
    </p>
  );
};

export default VersionFooter;
