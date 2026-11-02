import React from 'react';
// import style from './styles.module.scss';
import { ReactComponent as UserIcon } from 'assets/user.svg';
import { ReactComponent as UserIconLight } from 'assets/userLight.svg';
import { ReactComponent as LockIcon } from 'assets/lock.svg';
import { ReactComponent as LockIconLight } from 'assets/lockLight.svg';
import { ReactComponent as LogoutIcon } from 'assets/logout.svg';
import { ReactComponent as LogoutIconLight } from 'assets/logoutLight.svg';
import useGeneral from 'hooks/useGeneral';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  adminSideNavOverlayAtom,
  adminSideNavOverlayExpandAtom,
  DarkThemeAtom,
} from 'store/atoms/general';
import { useUser } from 'hooks/useUser';
import Avatar from 'components/Avatar';
import clsx from 'clsx';

export interface IAdminSideMenuShort {}

const AdminSideMenuShort: React.FunctionComponent<IAdminSideMenuShort> = () => {
  // const { lockScreen, logout } = useGeneral();
  // const { user } = useUser();
  const setShowSideOverlay = useSetRecoilState(adminSideNavOverlayAtom);
  const setExpand = useSetRecoilState(adminSideNavOverlayExpandAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);


  const handleShowOverlay = (expand?: string) => {
    setShowSideOverlay(true);
    expand && setExpand(expand);
  };

  return (
    <nav className={clsx("shadow-md bg-white flex flex-col px-[.5rem] py-5 justify-between", { 'bg-[#0F2230] border-[#0F2230] text-[#EDF1F3]': DarkTheme === true })}>
      <ul className="main-ul flex flex-col gap-y-4 items-center">
        <div>
          <div
            className="shrink-0 cursor-pointer"
            onClick={() => handleShowOverlay()}
          >
            {/* <Avatar
              name={user.fullName ?? user.name ?? ''}
              image={user.avatar}
            /> */}
          </div>
        </div>

        <li
          className="flex items-center gap-x-3 cursor-pointer"
          onClick={() => handleShowOverlay('Users & Permissions')}
          title="Users & Permissions"
        >
          {!DarkTheme ? <UserIcon className="w-5" /> : <UserIconLight className="w-5" />}
        </li>
      </ul>

      <ul className="main-ul flex flex-col gap-y-4 items-center">
        <li
          className={`a-s-opt cursor-pointer`}
          // onClick={lockScreen}
          title="Lock Screen"
        >
          {!DarkTheme ? <LockIcon className="w-[18px]" /> : <LockIconLight className="w-[18px]" />}
        </li>

        <li
          className={`a-s-opt cursor-pointer`}
          // onClick={logout}
          title="Log Out"
        >
          {!DarkTheme ? <LogoutIcon className="w-[1.25rem]" /> : <LogoutIconLight className="w-[1.25rem]" />}
        </li>
      </ul>
    </nav>
  );
};

export default AdminSideMenuShort;
