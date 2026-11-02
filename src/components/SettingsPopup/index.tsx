import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import Button from 'components/Button';
import { useRecoilState } from 'recoil';
import {
  DarkThemeAtom,
  EditPNAtom,
  PushNAtom,
  ReviewPNAtom,
  SoundPNAtom,
} from 'store/atoms/general';
import clsx from 'clsx';
import { ReactComponent as SettingsIcon } from 'assets/gear-white.svg';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import VersionFooter from 'components/VersionFooter';
import { useFirebase } from '../../hooks/useFirebase';
import { useUser } from 'hooks/useUser';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import useSettings from 'hooks/useSettings';

export interface ISettingsPopup {}

const SettingsPopup: React.FunctionComponent<ISettingsPopup> = () => {
  const [loading, setLoading] = useState(false);
  const ref = useRef<any>();
  const [darkTheme, setDarkTheme] = useRecoilState(DarkThemeAtom);
  const [editPN, setEditPN] = useRecoilState(EditPNAtom);
  const [reveiwPN, setReveiwPN] = useRecoilState(ReviewPNAtom);
  const [soundPN, setSoundPN] = useRecoilState(SoundPNAtom);
  const [pushN, setPushN] = useRecoilState(PushNAtom);
  const { user } = useUser();

  const { settings, getUserSettings, setUserSettings } = useSettings();

  //@ts-ignore
  const handleDarkTheme = () => setDarkTheme(prev => !prev);
  //@ts-ignore
  const handleEditPN = () => setEditPN(prev => !prev);
  //@ts-ignore
  const handleReviewPN = () => setReveiwPN(prev => !prev);
  //@ts-ignore
  const handleSoundPN = () => setSoundPN(prev => !prev);
  //@ts-ignore
  const handlePushN = () => setPushN(prev => !prev);

  useEffect(() => {
    if (!user.id) return;
    getUserSettings(user.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  useUpdateEffect(() => {
    if (!settings) return;
    setDarkTheme(settings?.theme === 'dark' ? true : false);
    setEditPN(settings?.getEditPushNotification);
    setReveiwPN(settings?.getReviewPushNotification);
    setSoundPN(settings?.soundForPushNotification);
    setPushN(settings?.pushNotification);
  }, [settings]);

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setUserSettings(user.id!, {
        theme: darkTheme ? 'dark' : 'light',
        getEditPushNotification: editPN,
        getReviewPushNotification: reveiwPN,
        soundForPushNotification: soundPN,
        pushNotification: pushN,
      });

      ref.current.click();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const flex = 'flex justify-between items-center';

  return (
    <div className="setting-popup pb-[20px]">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <SettingsIcon className="ml-6 mr-3" />
          <h5 className="title text-l font-small leading-normal text-white">
            Settings
          </h5>
        </div>
        <button
          type="button"
          className="close-modal text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel className="mr-5" />
        </button>
      </div>
      <form
        noValidate
        className={clsx(
          ' form px-5 mt-6 mr-5 mx-0.5 flex flex-col pb-8 gap-y-6 overflow-auto',
          {
            ' Dark bg-[#071723] border-[#0F2230] text-[#EDF1F3]':
              darkTheme === true,
          }
        )}
        onSubmit={handleConfirm}
      >
        <div className="flex justify-between pb-[10px] border-b border-[rgba(62,69,82,0.28)]">
          <div className="N-S-opts d-flex flex-column info  mb-2  text-[13px] ">
            <div className="titles font-semibold  px-[1.25rem]">Theme</div>
            <span className="desc font-light mb-1 px-[1.25rem]">
              Toggle to change theme{' '}
            </span>
          </div>
          <div className="form-check form-switch" onClick={handleDarkTheme}>
            <input
              className={clsx(
                'form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={darkTheme}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
        </div>
        <div className="flex justify-between ">
          <div className="N-S-opts d-flex flex-column info  mb-2  text-[13px] ">
            <div className="titles font-semibold  px-[1.25rem]">
              Allow 'Edit' Notifications
            </div>
            <span className="desc font-light mb-1 px-[1.25rem]">
              Receive push notification when an 'Edit' is submitted
            </span>
          </div>
          <div className="form-check form-switch" onClick={handleEditPN}>
            <input
              className={clsx(
                'form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={editPN}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
        </div>
        <div className="flex justify-between pb-[10px] border-b border-[rgba(62,69,82,0.28)]">
          <div className="N-S-opts d-flex flex-column info  mb-2  text-[13px] ">
            <div className="titles font-semibold  px-[1.25rem]">
              Allow 'Review' Notifications{' '}
            </div>
            <span className="desc font-light mb-1 px-[1.25rem]">
              Receive push notification when a 'Review' is submitted?
            </span>
          </div>
          <div className="form-check form-switch" onClick={handleReviewPN}>
            <input
              className={clsx(
                'form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={reveiwPN}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
        </div>
        <div className="flex justify-between ">
          <div className="N-S-opts d-flex flex-column info  mb-2  text-[13px] ">
            <div className="titles font-semibold  px-[1.25rem]">Sound</div>
            <span className="desc font-light mb-1 px-[1.25rem]">
              Allow Notification Sound
            </span>
          </div>
          <div className="form-check form-switch" onClick={handleSoundPN}>
            <input
              className={clsx(
                'form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={soundPN}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="N-S-opts d-flex flex-column info  mb-2  text-[13px] ">
            <div className="titles font-semibold  px-[1.25rem]">Popup</div>
            <span className="desc font-light mb-1 px-[1.25rem]">
              Allow Push Notification Popups
            </span>
          </div>
          <div className="form-check form-switch" onClick={handlePushN}>
            <input
              className={clsx(
                'form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={pushN}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
        </div>

        <div className="submit-buttons flex ">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            secondary
            small
            className={clsx(
              'subClick  p-4 text-white bg-dark-blue font-small mb-3 w-14 shrink-0'
            )}
          >
            {'Confirm'}
          </Button>
        </div>
      </form>

      <VersionFooter />
    </div>
  );
};

export default SettingsPopup;
