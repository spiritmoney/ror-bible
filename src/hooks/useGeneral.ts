import { AuthRoute } from 'navigation/routes';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { lockAtom } from 'store/atoms/general';
import { useFirebase } from './useFirebase';
import { useUser } from './useUser';
import bcrypt from 'bcryptjs';
import { toaster } from 'evergreen-ui';
import useProjects from './useProjects';

const useGeneral = () => {
  const setLock = useSetRecoilState(lockAtom);
  const { clearUserInfo, user, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { getOnce } = useFirebase();
  const { saveDoc, isProjectInSync } = useProjects();
 
  

  const lockScreen = () => {
    toaster.success("Document saved!! ", {
      id: 'showOnce',
    });
    saveDoc({});
    setLock(true);
  };

  const unlockScreen = async (
    password: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    setError('');

    if (isLoggedIn === 'false') {
      logout();
      return;
    }

    if (isLoggedIn === 'loading') {
        setLoading(false);
        return
    }

    try {
      const userData: any = await getOnce({ col: 'users', id: user.email });
      if (!userData) {
        logout();
        return;
      }

      if (!bcrypt.compareSync(password, userData.password)) {
        setError('Invalid Password');
        setLoading(false);
        return;
      }

      if (!userData.isActive) {
        logout();
        return;
      }

      setLock(false);
    } catch (error) {
      setError('Something went wrong, Please try again later');
      setLoading(false);
    }
  };

  const logout = () => {
    toaster.success("Document saved!! ", {
      id: 'showOnce',
    });
    saveDoc({});
    clearUserInfo();
    navigate(AuthRoute);
  };

  return {
    lockScreen,
    unlockScreen,
    logout,
  };
};

export default useGeneral;
