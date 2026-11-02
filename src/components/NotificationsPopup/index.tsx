import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import { ReactComponent as NotificationIcon } from 'assets/notification-white.svg';
import { ReactComponent as EditIcon } from 'assets/editDark.svg';
import { ReactComponent as ReviewIcon } from 'assets/reviewDark.svg';
import { ReactComponent as Collab } from 'assets/collab.svg';
import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import { DarkThemeAtom } from 'store/atoms/general';
import useProjects from '../../hooks/useProjects';
import { useUser } from '../../hooks/useUser';
import { DateTime } from 'luxon';
import useNotification from '../../hooks/useNotification';
import { INotification } from 'interface/notification';
import { useEffectOnce } from 'usehooks-ts';
import Button from 'components/Button';

export interface INotificationPopup { }

const NotificationPopup: React.FunctionComponent<INotificationPopup> = () => {
  const ref = useRef<any>();
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const [view, setView] = useState<'all' | 'edit' | 'review' | 'collab'>('all');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    allNotifications,
    getAllNotifications,
    readNotification,
    readAllNotifications,
  } = useNotification();
  const { setProject } = useProjects();

  const [editNotifications, setEditNotifications] = useState<INotification[]>([]);
  const [reviewNotifications, setReviewNotifications] = useState<INotification[]>([]);
  const [collabNotifications, setcollabNotifications] = useState<INotification[]>([]);

  useEffectOnce(() => {
    getAllNotifications(user.id!);
  });

  useEffect(() => {
    if (!allNotifications.length) return;
    const edit = allNotifications.filter(item => item.type === 'edit');
    const review = allNotifications.filter(item => item.type === 'review');
    const collab = allNotifications.filter(item => item.type === 'collab');
    setEditNotifications(edit);
    setReviewNotifications(review);
    setcollabNotifications(collab);
  }, [allNotifications]);

  const handleMakeAllRead = async () => {
    setLoading(true);
    try {
      await readAllNotifications(user.id!);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const flex = 'flex justify-between items-center';

  return (
    <div className="Notification-popup">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <NotificationIcon className="ml-6" />
          <h5 className="title text-l font-small leading-normal text-white">
            Notifications
          </h5>
        </div>
        <button
          type="button"
          className="close-modal text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel />
        </button>
      </div>

      <div className="flex justify-end">
        <Button
          small
          onClick={handleMakeAllRead}
          loading={loading}
          disabled={loading}
          light

          className="mark-all-button"
        >
          Mark all as read
        </Button>
      </div>

      <div
        className={clsx('main flex', {
          ' Dark bg-[#071723] border-[#0F2230] text-[#EDF1F3]':
            DarkTheme === true,
        })}
      >
        <div className="books mt-0 pr-[5px] border-r border-[rgba(62,69,82,0.28)] h-[25rem] flex">
          <ul className="flex flex-col font-normal cursor-pointer mb-2 text-[13px] gap-y-[12px]">
            <li
              className={clsx(
                ' flex nav-area items-center font-normal hover:bg-slate-50 px-[1.25rem] ',
                { active: view === 'all' }
              )}
              onClick={() => setView('all')}
            >
              <svg
                width="38"
                height="39"
                viewBox="0 0 38 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.9375 8.8125C6.59334 8.8125 7.125 8.28084 7.125 7.625C7.125 6.96916 6.59334 6.4375 5.9375 6.4375C5.28166 6.4375 4.75 6.96916 4.75 7.625C4.75 8.28084 5.28166 8.8125 5.9375 8.8125Z"
                  stroke={!DarkTheme ? 'black' : '#ffffff'}
                  strokeOpacity="0.65"
                  strokeWidth="2.375"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.9375 20.6875C6.59334 20.6875 7.125 20.1558 7.125 19.5C7.125 18.8442 6.59334 18.3125 5.9375 18.3125C5.28166 18.3125 4.75 18.8442 4.75 19.5C4.75 20.1558 5.28166 20.6875 5.9375 20.6875Z"
                  stroke={!DarkTheme ? 'black' : '#ffffff'}
                  strokeOpacity="0.65"
                  strokeWidth="2.375"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.9375 32.5625C6.59334 32.5625 7.125 32.0308 7.125 31.375C7.125 30.7192 6.59334 30.1875 5.9375 30.1875C5.28166 30.1875 4.75 30.7192 4.75 31.375C4.75 32.0308 5.28166 32.5625 5.9375 32.5625Z"
                  stroke={!DarkTheme ? 'black' : '#ffffff'}
                  strokeOpacity="0.65"
                  strokeWidth="2.375"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.875 7.625H33.25"
                  stroke={!DarkTheme ? 'black' : '#ffffff'}
                  strokeOpacity="0.65"
                  strokeWidth="2.375"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.875 19.5H33.25"
                  stroke={!DarkTheme ? 'black' : '#ffffff'}
                  strokeOpacity="0.65"
                  strokeWidth="2.375"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.875 31.375H33.25"
                  stroke={!DarkTheme ? 'black' : '#ffffff'}
                  strokeOpacity="0.65"
                  strokeWidth="2.375"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All
            </li>
            <li
              className={clsx(
                ' flex nav-area items-center font-normal hover:bg-slate-50 px-[1.25rem] ',
                { active: view === 'edit' }
              )}
              onClick={() => setView('edit')}
            >
              <EditIcon />
              Edit Notifications
            </li>
            <li
              className={clsx(
                ' flex nav-area items-center font-normal hover:bg-slate-50 px-[1.25rem] ',
                { active: view === 'review' }
              )}
              onClick={() => setView('review')}
            >
              <ReviewIcon />
              Review Notifications
            </li>
            <li
              className={clsx(
                ' flex nav-area items-center font-normal hover:bg-slate-50 px-[1.25rem] ',
                { active: view === 'collab' }
              )}
              onClick={() => setView('collab')}
            >
              <Collab />
              Collaboration Notifications
            </li>
          </ul>
        </div>
        <div className="select mt-0 scroll-auto flex flex-col text-[12px] ">
          {view === 'all' &&
            allNotifications.map((notification, i) => {
              return (
                <div
                  key={i}
                  className="not-section flex flex-col cursor-pointer"
                  onClick={() => {
                    notification.data && setProject(notification.data);
                    readNotification(notification.id);
                    notification.data && ref.current.click();
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className=" flex nav-area items-center  ">
                      {notification.type === 'edit' ? (
                        <EditIcon />
                      ) : notification.type === 'review' ? (
                        <ReviewIcon />
                      ) : notification.type === 'collab' ? (
                        <Collab />
                      ) : (
                        ''
                      )}
                      <span
                        className={clsx(' font-semibold', {
                          'text-primary': !notification.readAt,
                        })}
                      >
                        {notification.title}
                      </span>
                    </div>
                    <div className="dateTime">
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.DATETIME_MED
                      )}{' '}
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )}
                    </div>
                  </div>
                  <div className="noti-content font-normal whitespace-pre-wrap">
                    {notification.message}
                  </div>
                </div>
              );
            })}
          {view === 'edit' &&
            editNotifications.map((notification, i) => {
              return (
                <div
                  key={i}
                  className="not-section flex flex-col cursor-pointer"
                  onClick={() => {
                    notification.data && setProject(notification.data);
                    readNotification(notification.id);
                    notification.data && ref.current.click();
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className=" flex nav-area items-center  ">
                      <EditIcon />
                      <span
                        className={clsx(' font-semibold', {
                          'text-primary': !notification.readAt,
                        })}
                      >
                        {notification.title}
                      </span>
                    </div>
                    <div className="dateTime">
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.DATETIME_MED
                      )}{' '}
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )}
                    </div>
                  </div>
                  <div className="noti-content font-normal whitespace-pre-wrap">
                    {notification.message}
                  </div>
                </div>
              );
            })}

          {view === 'review' &&
            reviewNotifications.map((notification, i) => {
              return (
                <div
                  key={i}
                  className="not-section flex flex-col cursor-pointer"
                  onClick={() => {
                    notification.data && setProject(notification.data);
                    readNotification(notification.id);
                    notification.data && ref.current.click();
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className=" flex nav-area items-center  ">
                      <ReviewIcon />
                      <span
                        className={clsx(' font-semibold', {
                          'text-primary': !notification.readAt,
                        })}
                      >
                        {notification.title}
                      </span>
                    </div>
                    <div className="dateTime">
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.DATETIME_MED
                      )}{' '}
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )}
                    </div>
                  </div>
                  <div className="noti-content font-normal whitespace-pre-wrap">
                    {notification.message}
                  </div>
                </div>
              );
            })}

          {view === 'collab' &&
            collabNotifications.map((notification, i) => {
              return (
                <div
                  key={i}
                  className="not-section flex flex-col cursor-pointer"
                  onClick={() => {
                    notification.data && setProject(notification.data);
                    readNotification(notification.id);
                    notification.data && ref.current.click();
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className=" flex nav-area items-center  ">
                      {/* change this to collab icon */}
                      <Collab />
                      <span
                        className={clsx(' font-semibold', {
                          'text-primary': !notification.readAt,
                        })}
                      >
                        {notification.title}
                      </span>
                    </div>
                    <div className="dateTime">
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.DATETIME_MED
                      )}{' '}
                      {DateTime.fromISO(notification.createdAt).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )}
                    </div>
                  </div>
                  <div className="noti-content font-normal whitespace-pre-wrap">
                    {notification.message}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
