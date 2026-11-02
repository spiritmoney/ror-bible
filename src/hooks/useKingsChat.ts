import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { useFirebase } from './useFirebase';
import { HomeRoute, WelcomeRoute } from '../navigation/routes';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useRecoilState } from 'recoil';
import { UpdateProfileAtom } from 'store/atoms/general';
import bcrypt from 'bcryptjs';
import { IProject } from 'interface/project';
import { projectAtom } from '../store/atoms/workspace';
import { kingschatLoginConfig } from 'config/kingschat';
import { IKingschatTokens } from 'interface/auth';
import kingsChatWebSdk from 'kingschat-web-sdk';

const STATE_STORAGE_KEY = 'kingschat_login_state';

interface IKingsChatState {
  csrf: string;
  returnTo: string;
}

const generateCsrf = () =>
  Math.random().toString(36).slice(2) +
  Date.now().toString(36) +
  Math.random().toString(36).slice(2);

// base64url so the state is URL-safe (no +, / or =). This survives being
// echoed back by KingsChat in the query string without double-encoding issues.
const encodeState = (state: IKingsChatState) =>
  btoa(JSON.stringify(state))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const decodeState = (raw?: string | null): IKingsChatState | null => {
  if (!raw) return null;
  try {
    let base64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return JSON.parse(atob(base64)) as IKingsChatState;
  } catch (error) {
    return null;
  }
};

// Never redirect to an arbitrary URL taken from `origin` without verifying it
// points to a path within this application (open-redirect protection).
const isValidReturnTo = (path?: string | null): string => {
  if (!path) return WelcomeRoute;
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return WelcomeRoute;
  }
  return path;
};

const useKingsChat = () => {
  const { setKingschatToken, saveUserInfo, user, kingschatToken } = useUser();
  const { getOnce, add, edit } = useFirebase();
  const navigate = useNavigate();
  const [project, setProject] = useRecoilState<IProject | null>(projectAtom);
  const [, setShowUpdate] = useRecoilState(UpdateProfileAtom);

  // Step 4: initiate login by redirecting the browser to KingsChat.
  const login = (
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    redirectRoute: string = HomeRoute
  ) => {
    const state: IKingsChatState = {
      csrf: generateCsrf(),
      returnTo: redirectRoute,
    };
    const encoded = encodeState(state);
    sessionStorage.setItem(STATE_STORAGE_KEY, encoded);

    const url = new URL(kingschatLoginConfig.loginUrl);
    url.searchParams.set('clientId', kingschatLoginConfig.clientId);
    url.searchParams.set('origin', encoded);

    window.location.assign(url.toString());
  };

  // Shared completion logic: persist tokens + profile and mark the user logged in.
  const completeLogin = async (
    tokens: IKingschatTokens,
    profile: any
  ): Promise<void> => {
    setKingschatToken(tokens);

    const email = profile.email;
    const exists: any = await getOnce({ col: 'users', id: email });
    const expiresAt = DateTime.now().plus({ days: 5 }).toISO();
    const createdAt = DateTime.now().toISO();
    const updatedAt = DateTime.now().toISO();

    if (project && project.userId !== email) {
      const allowed =
        project?.cc?.includes(email) ||
        project?.to?.includes(email) ||
        project?.collaborators?.includes(email);
      if (!allowed) {
        setProject(null);
      }
    }

    if (!exists) {
      await add({
        col: 'users',
        data: {
          ...profile,
          createdAt,
          updatedAt,
          kingsChatTokens: tokens,
          kingsChatid: profile.id,
          fullName: profile.name,
          password: bcrypt.hashSync(email),
        },
        id: email,
      });
      saveUserInfo({
        ...profile,
        createdAt,
        fullName: profile.name,
        expiresAt,
        id: email,
      });
      setShowUpdate(true);
    } else {
      await edit({
        col: 'users',
        data: {
          ...profile,
          kingsChatTokens: tokens,
          updatedAt,
          kingsChatid: profile.id,
          fullName: profile.name,
          password: exists.password ?? bcrypt.hashSync(email),
        },
        id: email,
      });
      saveUserInfo({
        ...exists,
        ...profile,
        fullName: profile.name,
        expiresAt,
        id: email,
      });
    }
  };

  // Step 5/6: complete login after the authorization code has been exchanged.
  const finishLogin = async (payload: {
    tokens: IKingschatTokens;
    profile: any;
    origin?: string;
  }): Promise<void> => {
    const stored = sessionStorage.getItem(STATE_STORAGE_KEY);
    if (!stored) {
      throw new Error('KingsChat login state was not found. Please try again.');
    }

    const state = decodeState(stored);
    if (!state || payload.origin !== stored) {
      sessionStorage.removeItem(STATE_STORAGE_KEY);
      throw new Error('KingsChat login state mismatch. Please try again.');
    }

    const returnTo = isValidReturnTo(state.returnTo);
    sessionStorage.setItem('kingschat_last_return_to', returnTo);
    sessionStorage.removeItem(STATE_STORAGE_KEY);
    await completeLogin(payload.tokens, payload.profile);
    navigate(WelcomeRoute, {
      replace: true,
      state: { from: returnTo },
    });
  };

  // Step 5/6 (Redirect mode): the code exchange must happen on the server side,
  // via the Cloudflare Worker. The browser only sends the auth code to the worker.
  const exchangeCode = async (code: string, origin: string): Promise<void> => {
    const workerRes = await axios.post(kingschatLoginConfig.workerExchangeUrl, {
      code,
    });

    const data = workerRes.data;
    const tokens: IKingschatTokens = {
      accessToken: data.tokens?.accessToken ?? data.accessToken,
      refreshToken: data.tokens?.refreshToken ?? data.refreshToken,
      expiresInMillis: data.tokens?.expiresInMillis ?? data.expiresInMillis,
    };

    const profile = data.profile ?? data.user?.profile ?? data.user;
    if (!profile) {
      throw new Error('KingsChat profile was not returned by the server');
    }

    await finishLogin({ tokens, profile, origin });
  };

  // Step 8: refresh the access token using the stored refresh token.
  const refreshTokens = async (): Promise<IKingschatTokens> => {
    const refreshToken =
      kingschatToken?.refreshToken || user?.kingsChatTokens?.refreshToken;
    if (!refreshToken) {
      throw new Error('No KingsChat refresh token available');
    }

    const res = await axios.post(kingschatLoginConfig.tokenUrl, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const tokens: IKingschatTokens = {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      expiresInMillis: res.data.expires_in_millis,
    };
    setKingschatToken(tokens);
    return tokens;
  };

  const sendMessage = async ({
    message,
    kingsChatid,
  }: {
    message: string;
    kingsChatid: string;
  }) => {
    try {
      const tokens = await refreshTokens();
      await kingsChatWebSdk.sendMessage({
        message,
        accessToken: tokens.accessToken,
        userIdentifier: kingsChatid,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    login,
    exchangeCode,
    finishLogin,
    refreshTokens,
    sendMessage,
  };
};

export default useKingsChat;
