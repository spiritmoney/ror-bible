import clsx from 'clsx';
import { DateTime } from 'luxon';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
// import style from './styles.module.scss';

interface IModalFooterTime {}

const ModalFooterTime: React.FunctionComponent<IModalFooterTime> = () => {
  const DarkTheme = useRecoilValue(DarkThemeAtom);

  return (
    <p className={clsx("w-[80%] ml-auto mr-auto text-[13px] font-light text-[rgba(0,0,0,0.75)] text-center pt-[10px] border-t mt-8 border-[rgba(62,69,82,0.28)]", {'!text-[#EDF1F3]': DarkTheme === true })}>
      Date : {DateTime.now().toLocaleString(DateTime.DATE_FULL)} at{' '}
      {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
    </p>
  );
};

export default ModalFooterTime;
