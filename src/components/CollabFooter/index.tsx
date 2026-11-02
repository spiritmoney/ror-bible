import clsx from 'clsx';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom, ReviewModeAtom } from 'store/atoms/general';
// import style from './styles.module.scss';

interface ICollabFooter{}

const CollabFooter: React.FunctionComponent<ICollabFooter> = () => {
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const ReviewMode = useRecoilValue(ReviewModeAtom)

  return (
    <p className={clsx("w-[80%] ml-auto mr-auto text-[13px] font-light text-[#09A350] text-center pt-[10px] border-t mt-5 border-[0.3px solid rgba(62, 69, 82, 0.28]", { '!text-[#EDF1F3]': DarkTheme === true})}>
      Workspace now in: {ReviewMode? 'Review Mode' : 'Collaboration Mode'}
    </p>
  );
};

export default CollabFooter;
