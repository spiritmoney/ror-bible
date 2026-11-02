import { IKingschatTokens } from 'interface/auth';
import { IUser } from 'interface/user';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { kingschatTokensAtom, userAtom } from 'store/atoms/user';
import { LOCAL_STORAGE_USER_EMAIL } from 'store/constant';
import { redactPayloadProp } from 'utils/general';
import { isLoggedInAtom } from '../store/atoms/user';

export const useUser = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [kingschatToken, setKingschatToken] = useRecoilState<
    IKingschatTokens | undefined
  >(kingschatTokensAtom);
  const [isLoggedIn, setisLoggedIn] = useRecoilState<
    'loading' | 'false' | 'true'
  >(isLoggedInAtom);
  const [checkLoginState, setCheckLoginState] = useState(false);

  // Synchronous auth signal: Recoil user (async-hydrated) OR the email we
  // store in localStorage on login. localStorage keeps this flash-free for
  // returning users on a fresh page load.
  const storedEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem(LOCAL_STORAGE_USER_EMAIL)
      : null;
  const isAuthenticated = !!(user.id || storedEmail) && isLoggedIn !== 'false';

  const saveUserInfo = (data: IUser) => {
    const payload = redactPayloadProp(data, ['password'], true) as IUser;
    setisLoggedIn('loading');
    if (payload.email) {
      localStorage.setItem(LOCAL_STORAGE_USER_EMAIL, payload.email);
    }
    setUser(payload);
    setisLoggedIn('true');
  };

  const updateUserInfo = (data: IUser) => {
    const updateInfo = { ...data };
    redactPayloadProp(updateInfo, ['password'], true);
    setUser((prev: IUser) => ({
      ...prev,
      ...updateInfo,
    }));
  };

  const clearUserInfo = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);
    setUser({});
    setisLoggedIn('false');
    setKingschatToken(undefined);
  };

  useEffect(() => {
    if (checkLoginState) {
      if (isLoggedIn === 'loading') {
        clearUserInfo();
      }
      setCheckLoginState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkLoginState, isLoggedIn]);

  useEffect(() => {
    if (!user.id) {
      const storedEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);

      if (!storedEmail) {
      } else {
        setTimeout(() => {
          setCheckLoginState(true);
        }, 7000);
        return;
      }
    }

    const check =
      DateTime.fromISO(user.expiresAt || '').toMillis() >
      DateTime.now().toMillis();

    if (!check) {
      setisLoggedIn('false');
      return;
    }

    setisLoggedIn('true');
  }, [setUser, user]);

  // useEffect(() => {
  //   if (!userId) return;
  //   getOnce({
  //     col: 'users',
  //     id: userId,
  //   }).then(res => {
  //     if (!res) return
  //     saveUserInfo(res as IUser);
  //   });
  // }, [getOnce, saveUserInfo, userId]);

  return {
    user: user as IUser,
    saveUserInfo,
    isLoggedIn,
    setKingschatToken,
    kingschatToken,
    clearUserInfo,
    updateUserInfo,
    isAuthenticated,
  };
};
