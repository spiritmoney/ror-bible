import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ReactComponent as UserIcon } from 'assets/user.svg';
import { ReactComponent as UserIconLight } from 'assets/userLight.svg';
import { ReactComponent as ArrowIcon } from 'assets/arrow-down.svg';
import { ReactComponent as AddUserIcon } from 'assets/add-user.svg';
import { ReactComponent as ManageUserIcon } from 'assets/manage-user.svg';
import { ReactComponent as LockIcon } from 'assets/lock.svg';
import { ReactComponent as LockIconLight } from 'assets/lockLight.svg';
import { ReactComponent as LogoutIcon } from 'assets/logout.svg';
import { ReactComponent as LogoutIconLight } from 'assets/logoutLight.svg';
import { footerHeightAtom, headerHeightAtom } from '../../store/atoms/size';
import useGetSize from 'hooks/useGetSize';
import clsx from 'clsx';
import {
  adminSideNavOverlayAtom,
  adminSideNavOverlayExpandAtom,
  DarkThemeAtom,
} from 'store/atoms/general';
import { useUser } from 'hooks/useUser';
import useGeneral from 'hooks/useGeneral';
import Avatar from 'components/Avatar';

export interface IAdminSideMenu {}

const AdminSideMenu: React.FunctionComponent<IAdminSideMenu> = () => {
  const [showOverlay, setShowOverlay] = useRecoilState(adminSideNavOverlayAtom);
  const [expand, setExpand] = useRecoilState(adminSideNavOverlayExpandAtom);
  const footerHeight = useRecoilValue(footerHeightAtom);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const [userAreaHeight, setUserAreaHeight] = useState(0);
  const { ref, height } = useGetSize();
  // const { user } = useUser();
  const usersRef = useRef<any>();
  // const { lockScreen, logout } = useGeneral();
  const DarkTheme = useRecoilValue(DarkThemeAtom);


  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setExpand('');
  };

  useEffect(() => {
    setUserAreaHeight(height);
  }, [height]);

  useEffect(() => {
    if (expand === 'Users & Permissions') {
      usersRef.current.click();
    }
  }, [expand]);
  return (
    <nav
      className={clsx('w-60 shadow-md bg-white absolute', { 'bg-[#0F2230] border-[#0F2230] text-[#EDF1F3]': DarkTheme === true },{
        '-translate-x-[100%] transition-transform delay-[0s]': !showOverlay,
      })}
      id="sidenavSecExample"
      style={{
        minHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
        maxHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
      }}
    >
      <div className="pt-4 pb-2 px-6" ref={ref}>
        <a href="#!" onClick={handleCloseOverlay}>
          <div className="flex items-center">
            {/* <Avatar
              name={user.fullName ?? user.name ?? ''}
              image={user.avatar}
            /> */}
            <div className="grow ml-3">
              <p className="text-sm font-semibold text-primary">
                {/* {user.fullName ?? user.name} */}
              </p>
            </div>
          </div>
        </a>
      </div>

      <div
        className="flex h-full justify-between flex-col"
        style={{
          minHeight: `calc(100vh - ${
            footerHeight + headerHeight + userAreaHeight
          }px)`,
          maxHeight: `calc(100vh - ${
            footerHeight + headerHeight + userAreaHeight
          }px)`,
        }}
      >
        <ul className="relative px-1">
          <li className="relative" id="sidenavSecEx2">
            <a
              href="#!"
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-primary hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer"
              data-mdb-ripple="true"
              data-mdb-ripple-color="primary"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSidenavSecEx2"
              aria-expanded="false"
              aria-controls="collapseSidenavSecEx2"
              ref={usersRef}
            >
              {!DarkTheme? <UserIcon className="w-3 h-3 mr-3" /> : <UserIconLight className="w-3 h-3 mr-3" />}
              <span>Users & Permissions</span>
              <ArrowIcon
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                className="w-3 h-3 ml-auto"
                role="img"
              />
            </a>
            <ul
              className="relative accordion-collapse collapse"
              id="collapseSidenavSecEx2"
              aria-labelledby="sidenavSecEx2"
              data-bs-parent="#sidenavSecExample"
            >
              <li className="relative">
                <a
                  href="#!"
                  className="flex items-center text-xs py-4 pl-12 pr-6 h-6 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-primary hover:bg-blue-50 transition duration-300 ease-in-out"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="primary"
                >
                  <AddUserIcon className="w-3 h-3 mr-3" />{' '}
                  <span>Add Users</span>{' '}
                </a>
              </li>
              <li className="relative">
                <a
                  href="#!"
                  className="flex items-center text-xs py-4 pl-12 pr-6 h-6 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-primary hover:bg-blue-50 transition duration-300 ease-in-out"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="primary"
                >
                  <ManageUserIcon className="w-3 h-3 mr-3" /> Manage Users{' '}
                </a>
              </li>
            </ul>
          </li>
          <hr className="my-2" />
        </ul>

        <ul className="relative  px-1">
          {/* <li className="relative cursor-pointer" onClick={lockScreen}>
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-ellipsis whitespace-nowrap rounded hover:text-primary hover:bg-blue-50 transition duration-300 ease-in-out"
              href="#!"
              data-mdb-ripple="true"
              data-mdb-ripple-color="primary"
            >
              {!DarkTheme ? <LockIcon className="w-3 h-3 mr-3" /> : <LockIconLight className="w-3 h-3 mr-3" />}
              <span>Lock Screen</span>
            </a>
          </li>
          <li className="relative" onClick={logout}>
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-ellipsis whitespace-nowrap rounded hover:text-primary hover:bg-blue-50 transition duration-300 ease-in-out"
              href="#!"
              data-mdb-ripple="true"
              data-mdb-ripple-color="primary"
            >
              {!DarkTheme ? <LogoutIcon className="w-3 h-3 mr-3" /> : <LogoutIconLight className="w-3 h-3 mr-3" />}
              <span>Log out</span>
            </a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default AdminSideMenu;
