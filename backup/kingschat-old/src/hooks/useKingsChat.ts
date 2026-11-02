import { useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { useFirebase } from './useFirebase';
import { DashboardRoute } from '../navigation/routes';
import kingsChatWebSdk from 'kingschat-web-sdk';
import {
  kingschatLoginOptions,
  kingschatRefreshConfig,
} from 'config/kingschat';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { lockAtom, UpdateProfileAtom } from 'store/atoms/general';
import bcrypt from 'bcryptjs';
import { IProject } from 'interface/project';
import { projectAtom } from '../store/atoms/workspace';

const useKingsChat = () => {
  const { setKingschatToken, saveUserInfo } = useUser();
  const { getOnce, add, edit } = useFirebase();
  const navigate = useNavigate();
  const [lock, setLock] = useRecoilState(lockAtom);
  const [project, setProject] = useRecoilState<IProject | null>(projectAtom);
  const [show, setShowUpdate] = useRecoilState(UpdateProfileAtom);

  const login = async (
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    redirectRoute: string = DashboardRoute
  ) => {
    setLoading && setLoading(true);

    try {
      const res = await kingsChatWebSdk.login(kingschatLoginOptions);
      setKingschatToken(res);
      console.log('User', res);

      const profile = await axios.get(
        'https://connect.kingsch.at/developer/api/profile',
        {
          headers: {
            authorization: `Bearer ${res.accessToken}`,
          },
        }
      );

      const email = profile.data.profile.email;
      const exists: any = await getOnce({ col: 'users', id: email });
      const expiresAt = DateTime.now().plus({ days: 5 }).toISO();
      const createdAt = DateTime.now().toISO();
      const updatedAt = DateTime.now().toISO();

      if (project) {
        if (project?.userId === email) {
        } else if (project?.cc?.includes(email)) {
        } else if (project?.to?.includes(email)) {
        } else if (
          project?.collaborators &&
          project?.collaborators?.includes(email)
        ) {
        } else {
          setProject(null);
        }
      }

      if (!exists) {
        await add({
          col: 'users',
          data: {
            ...profile.data.profile,
            createdAt,
            updatedAt,
            // role: 'editor',
            kingsChatTokens: res,
            kingsChatid: profile.data.profile.id,
            fullName: profile.data.profile.name,
            password: bcrypt.hashSync(email),
            // company: ['']
          },
          id: email,
        });
        saveUserInfo({
          ...profile.data.profile,
          createdAt,
          fullName: profile.data.profile.name,
          expiresAt,
          id: email,
        });
        navigate(redirectRoute);
        setShowUpdate(true);
      } else {
        await edit({
          col: 'users',
          data: {
            ...profile.data.profile,
            kingsChatTokens: res,
            updatedAt,
            kingsChatid: profile.data.profile.id,
            fullName: profile.data.profile.name,
            password: exists.password ?? bcrypt.hashSync(email),
          },
          id: email,
        });

        saveUserInfo({
          ...exists,
          ...profile.data.profile,
          fullName: profile.data.profile.name,
          expiresAt,
          id: email,
        });
        navigate(redirectRoute);
      }
    } catch (error) {
      setLoading && setLoading(false);
      console.error(error);
    } finally {
      if (lock) {
        setLock(false);
      }
    }
  };

  const refreshTokens = async () => {
    console.log(kingschatRefreshConfig);
    try {
      const res = await kingsChatWebSdk.refreshAuthenticationToken(
        kingschatRefreshConfig
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async ({
    message,
    kingsChatid,
  }: {
    message: string;
    kingsChatid: string;
  }) => {
    try {
      const tokens: any = await refreshTokens();

      await kingsChatWebSdk.sendMessage({
        message,
        accessToken: tokens.accessToken,
        userIdentifier: kingsChatid,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    login,
    sendMessage,
  };
};

export default useKingsChat;
