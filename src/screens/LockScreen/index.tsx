import React, { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ReactComponent as Arrow } from '../../assets/arrow-right.svg';
import AuthScreen from '../../components/AuthScreen';
import { ReactComponent as Illustration } from '../../assets/lock-screen-ill.svg';
import useGeneral from 'hooks/useGeneral';
import { useUser } from 'hooks/useUser';
import { getInitials } from '../../utils/format';
import { startCase } from 'lodash';
// import style from './styles.module.scss';
import Avatar from '../../components/Avatar/index';

export interface ILockScreen {}

const LockScreen: React.FunctionComponent<ILockScreen> = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlockScreen, logout } = useGeneral();
  const { user } = useUser();

  return (
    <section className="flex">
      <aside className="min-h-screen w-1/2 mobile:hidden">
        <AuthScreen
          header
          illustration={<Illustration className="w-full max-w-[300px]" />}
        />
      </aside>
      <article className="h-max min-h-screen max-h-screen w-1/2 pt-[3.1875rem] pb-7 flex flex-col justify-between overflow-y-auto mobile:w-full px-2">
        <div className="flex items-center justify-center flex-col my-auto mobile:px-2">
          <div className="max-w-[480px] w-full ">
            <div className="w-[202px] h-[202px] rounded-[50%] mx-auto">
              <Avatar
                name={user.fullName ?? user.name}
                image={user.avatar}
                fontSize={60}
                size={202}
              />
            </div>

            <h2 className="text-center font-semibold text-[2.1875rem] mt-[.9375rem] capitalize">
              {startCase(user.role)}
            </h2>

            <Input
              type={'password'}
              name="password"
              required
              value={password}
              setValue={setPassword}
              placeholder="Enter Password"
              className="mb-[47px]"
              error={error}
            />

            <Button
              fullWidth
              primary
              loading={loading}
              disabled={loading}
              iconAfter={<Arrow />}
              onClick={() => unlockScreen(password, setError, setLoading)}
            >
              Unlock
            </Button>

            <Button
              fullWidth
              primary
              className='mt-4'
              onClick={logout}
            >
              Switch Accounts
            </Button>
          </div>
        </div>

        <p className="mt-20 text-center text-faded-black">
          © {new Date().getFullYear()} , Scribbbler Workspace, A Product of New Media Technologies.
          All Right Reserved.
        </p>
      </article>
    </section>
  );
};

export default LockScreen;
