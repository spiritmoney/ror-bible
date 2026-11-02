import clsx from 'clsx';
import BooksPreview from 'components/BooksPreview';
import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ISquareSwitchPosition } from '../../interface/squareSwitch';
import {
  footerHeightAtom,
  headerHeightAtom,
  workspaceHeaderHeightAtom,
} from '../../store/atoms/size';
import {
  booksSwitchAtom,
  notificationsModalAtom,
  settingsModalAtom,
} from '../../store/atoms/workspace';
import menu from 'assets/menu.svg';
import { ReactComponent as Arrow } from 'assets/arrow.svg';
import { ReactComponent as Update } from 'assets/update.svg';
import { ReactComponent as Settings } from 'assets/gear.svg';
import { ReactComponent as Logout } from 'assets/logoutIcon.svg';
import { ReactComponent as User } from 'assets/UserIcon.svg';
import { ReactComponent as Lock } from 'assets/LockIcon.svg';
import { ReactComponent as Notification } from 'assets/notification.svg';
import { ReactComponent as Sun } from 'assets/sun.svg';
import { ReactComponent as SunDark } from 'assets/sunDark.svg';
import { ReactComponent as Moon } from 'assets/moon.svg';
import { ReactComponent as MoonLight } from 'assets/moonLight.svg';
import style from './styles.module.scss';
import { useUser } from 'hooks/useUser';
import useProjects from 'hooks/useProjects';
import Avatar from 'components/Avatar';
import { DarkThemeAtom, libraryAtom } from '../../store/atoms/general';
import { IProject } from '../../interface/project';
import useGeneral from 'hooks/useGeneral';
import { DateTime } from 'luxon';
import useSettings from 'hooks/useSettings';
import useNotification from 'hooks/useNotification';
import { useEffectOnce } from 'usehooks-ts';

export interface IAvailableBooks {}

const AvailableBooks: React.FunctionComponent<IAvailableBooks> = () => {
  const footerHeight = useRecoilValue(footerHeightAtom);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const workspaceHeaderHeight = useRecoilValue(workspaceHeaderHeightAtom);
  const toggle = useRecoilValue<ISquareSwitchPosition>(booksSwitchAtom);
  const setShowSettingsModal = useSetRecoilState(settingsModalAtom);
  const setShowNotificationsModal = useSetRecoilState(notificationsModalAtom);
  const setShowLibrary = useSetRecoilState(libraryAtom);
  const [topThreeProjects, setTopThreeProjects] = useState<IProject[]>([]);
  const [DarkTheme, setDarkTheme] = useRecoilState(DarkThemeAtom);
  const { user } = useUser();
  const [show, setShow] = useState(false);
  const [limit, setLimit] = useState(true);
  const [limitCollab, setLimitCollab] = useState(true);
  const { settings, getUserSettings, setUserSettings, editUserSettings } =
    useSettings();

  const [numberOfUnreadNotifications, setNumberOfUnreadNotifications] = useState('')
  
  const [hasSetTheme, setHasSetTheme] = useState(false)

  const { allUnReadNotifications, getAllUnReadNotifications} = useNotification()

  useEffectOnce(() => {
    getAllUnReadNotifications(user.id!)
  })

  useEffect(() => {
    const unread = allUnReadNotifications.length ? String(allUnReadNotifications.length) : ''
    setNumberOfUnreadNotifications(unread)
  }, [allUnReadNotifications])

  const {
    allProjects,
    getMostOpenedProject,
    allRecievedProjects,
    allCollabProjects,
  } = useProjects();
  const { lockScreen, logout } = useGeneral();

  useEffect(() => {
    (async () => {
      const top3: any = await getMostOpenedProject(3);
      setTopThreeProjects(top3 ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProjects]);

  useEffect(() => {
    if (!user.id) return;
    getUserSettings(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  useEffect(() => {
    if (!settings || !settings?.theme) return;
    // if(hasSetTheme) return;
    console.log(settings)
    setDarkTheme(settings?.theme === 'light' ? false : true);
    setHasSetTheme(true)
  }, [hasSetTheme, setDarkTheme, settings]);

  const handleDarkTheme = async() => {
    setDarkTheme((prev: boolean) => !prev);
    try {
      if (!settings) {
        await setUserSettings(user.id!, {
          theme: !DarkTheme ? 'dark' : 'light',
          getEditPushNotification: true,
          getReviewPushNotification: true,
          soundForPushNotification: true,
          pushNotification: true,
        });
      } else {
        await editUserSettings(user.id!, {
          theme: !DarkTheme ? 'dark' : 'light',
        });
      }
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <aside
      style={{
        minHeight: `calc(100vh - ${
          footerHeight + headerHeight + workspaceHeaderHeight
        }px)`,
        maxHeight: `calc(100vh - ${
          footerHeight + headerHeight + workspaceHeaderHeight
        }px)`,
      }}
      className={clsx(
        'relative bg-side-bg w-full origin-[0%_0%] transition-width delay-[0s] duration-300 max-w-[17.8125rem] scroll-auto',
        {
          '!bg-[#0F2230] !text-[#EDF1F3] !border-[1px solid rgba(62, 69, 82, 0.08)]':
            DarkTheme === true,
        },
        {
          '-translate-x-[0%] min-w-[17.8125rem] w-[17.8125rem] scale-100 ':
            toggle === 'left',
          ' w-0 min-w-0 ': toggle === 'right',
        },
        ' rounded-[5px_0px_0px_5px]'
      )}
    >
      <div
        className={clsx({
          ' scale-0 ': toggle === 'right',
          'transition-transform delay-200 origin-[0%_0%]': toggle === 'left',
        })}
      >
        <h2 className="font-semibold text-[18px] px-6 shadow-[0px_2px_8px_rgba(73,95,137,0.1)] h-[60px] flex items-center border border-[rgba(62,69,82,0.08)] rounded-[5px_0px_0px_5px]">
          Available Books
        </h2>

        <div
          className="px-6 pt-6 pb-16 flex overflow-y-auto flex-col gap-y-10"
          style={{
            minHeight: `calc(100vh - ${
              footerHeight + headerHeight + workspaceHeaderHeight + 60
            }px)`,
            maxHeight: `calc(100vh - ${
              footerHeight + headerHeight + workspaceHeaderHeight + 60
            }px)`,
          }}
        >
          <div className="flex flex-col gap-y-[1.1875rem]">
            {topThreeProjects.map((project, i) => (
              <BooksPreview key={i} project={project} />
            ))}
            <div
              className="flex text-primary text-sm gap-x-[.9375rem] cursor-pointer"
              onClick={() => setShowLibrary(true)}
            >
              <img src={menu} alt="" />
              See More Books
            </div>
          </div>

          <div className="flex flex-col gap-y-[1.1875rem]">
            <h3 className="flex font-medium text-base justify-between items-center">
              Recently Reviewed <Arrow className={clsx(style.arrow, '')} />
            </h3>
            {allRecievedProjects
              .sort((a, b) => {
                return (
                  DateTime.fromISO(b.lastOpened).toMillis() -
                  DateTime.fromISO(a.lastOpened).toMillis()
                );
              })
              .map((project, i) => {
                if (limit && i > 2) return '';
                return <BooksPreview key={i} project={project} />;
              })}

            <div
              className="flex text-primary text-sm gap-x-[.9375rem] cursor-pointer"
              onClick={() => setLimit(prev => !prev)}
            >
              <img src={menu} alt="" />
              See {limit ? 'More' : 'Less'} Books
            </div>
          </div>

          {allCollabProjects.length > 0 && (
            <div className="flex flex-col gap-y-[1.1875rem]">
              <h3 className="flex font-medium text-base justify-between items-center">
                Collaborating
              </h3>
              {allCollabProjects
                .sort((a, b) => {
                  return (
                    DateTime.fromISO(b.lastOpened).toMillis() -
                    DateTime.fromISO(a.lastOpened).toMillis()
                  );
                })
                .map((project, i) => {
                  if (limitCollab && i > 2) return '';
                  return <BooksPreview key={i} project={project} />;
                })}

              <div
                className="flex text-primary text-sm gap-x-[.9375rem] cursor-pointer"
                onClick={() => setLimitCollab(prev => !prev)}
              >
                <img src={menu} alt="" />
                See {limitCollab ? 'More' : 'Less'} Books
              </div>
            </div>
          )}

          <div className="flex flex-col gap-y-[1.625rem]">
            <div className="flex justify-between max-w-[12.4375rem] items-center cursor-pointer">
              <div className="flex gap-x-[1.875rem]">
                <Update />
                <span className="font-medium">Update</span>
              </div>
              <span className="w-[18px] h-[18px] empty:hidden bg-maroon-red text-white font-semibold text-[10.7px] rounded-full flex items-center justify-center">
                
              </span>
            </div>

            <div className="flex justify-between max-w-[12.4375rem] items-center cursor-pointer">
              <div
                className="flex gap-x-[1.875rem]"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings />
                <span className="font-medium">Settings</span>
              </div>
            </div>

            <div className="flex justify-between max-w-[12.4375rem] items-center cursor-pointer">
              <div
                className="flex gap-x-[1.875rem]"
                onClick={() => setShowNotificationsModal(true)}
              >
                <Notification className="ml-[3px]" />
                <span className="font-medium">Notifications</span>
              </div>

              <span className="w-[18px] h-[18px] empty:hidden bg-maroon-red text-white font-semibold text-[10.7px] rounded-full flex items-center justify-center">
                {numberOfUnreadNotifications}
              </span>
            </div>
          </div>

          <div
            onClick={() => setShow(prev => !prev)}
            className="flex items-center cursor-pointer gap-x-4 font-medium"
          >
            <Avatar name={user.fullName} image={user.avatar} />
            {user.fullName}
          </div>
          <ul className={clsx('flex flex-col gap-y-5', { hidden: !show })}>
            <li className="flex  gap-x-4 font-medium items-center cursor-pointer ">
              <User />
              My Account
            </li>
            <li
              className="flex  gap-x-4 font-medium items-center cursor-pointer "
              onClick={lockScreen}
            >
              <Lock />
              Lockscreen
            </li>
            <li
              className="flex  gap-x-4 font-medium items-center cursor-pointer "
              onClick={logout}
            >
              <Logout />
              Logout
            </li>
          </ul>

          <div
            onClick={handleDarkTheme}
            className="bg-grey-box text-[.75rem] text-[rgba(11,28,42,0.75)] rounded-md max-w-[11.375rem] flex  "
          >
            <div
              className={clsx(
                'w-1/2 flex justify-center items-center rounded-md max-w-[11.375rem] gap-x-2 h-[1.875rem] cursor-pointer',
                { 'bg-primary text-white': !DarkTheme }
              )}
            >
              {DarkTheme ? <SunDark /> : <Sun />}Light
            </div>
            <div
              className={clsx(
                'w-1/2 flex justify-center items-center rounded-md max-w-[11.375rem] gap-x-2 h-[1.875rem] cursor-pointer',
                { 'bg-primary text-white': DarkTheme }
              )}
            >
              {!DarkTheme ? <Moon /> : <MoonLight />} Dark
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AvailableBooks;
