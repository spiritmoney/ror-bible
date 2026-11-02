import { DateTime } from 'luxon';
import { useFirebase } from './useFirebase';
import { useRecoilState } from 'recoil';
import {userSettingsAtom} from '../store/atoms/user';
const useSettings = () => {
  const [settings, setSettings] = useRecoilState<{
    [key: string]: any;
  } | null>(userSettingsAtom);
  const { getOnce, add, edit } = useFirebase();

  const setUserSettings = (userId: string, data: any) => {
    return new Promise((resolve, reject) => {
      add({
        col: 'settings',
        data: {
          ...data,
          updatedAt: DateTime.now().toISO(),
        },
        id: userId,
      })
        .then(res => {
          resolve(res);
          setSettings(prev => ({...prev, ...data}));
          console.log('success', res)
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const editUserSettings = (userId: string, data: any) => {
    return new Promise((resolve, reject) => {
      edit({
        col: 'settings',
        data: {
          ...data,
          updatedAt: DateTime.now().toISO(),
        },
        id: userId,
      })
        .then(res => {
          resolve(res);
          setSettings(prev => ({...prev, ...data}));
          console.log('success edit', res)
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const getUserSettings = (userId: string) => {
    getOnce({
      col: 'settings',
      id: userId,
    })
      .then((res: any) => {
        setSettings(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return {
    setUserSettings,
    editUserSettings,
    getUserSettings,
    settings,
  }
};

export default useSettings;
