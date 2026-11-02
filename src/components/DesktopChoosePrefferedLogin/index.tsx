import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as KingschatIcon } from '../../assets/kingschat.svg';
import Button from '../Button';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { LoginRoute, RegisterRoute } from '../../navigation/routes';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useKingsChat from 'hooks/useKingsChat';

const DesktopChoosePrefferedLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useKingsChat()

  const handleKingsChatLogin = () => {
    login(setLoading)
  }

  return (
    <div className="flex items-center justify-center flex-col my-auto">
      <div className="max-w-[480px] w-full ">
        <div className={styles['right-content']}>
          <Logo className={styles.logo} />

          <h1 className={styles.text}>Choose a preferred Login</h1>
          <div className={clsx(styles.btn, 'flex flex-col gap-y-12')}>
            <Button
              primary
              loading={loading}
              disabled={loading}
              fullWidth
              className="font-light"
              onClick={handleKingsChatLogin}
              iconBefore={<KingschatIcon className={styles['icon-before']} />}
            >
              Login with KingsChat
            </Button>

            <Button
              type="link"
              to={LoginRoute}
              primary
              fullWidth
              className="font-light"
              iconBefore={<Logo className={styles['icon-before']} />}
            >
              Login with Scribbbler
            </Button>
          </div>
          <Link to={RegisterRoute} className={styles['bottom-text']}>
            Don't have an account ? <span>Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesktopChoosePrefferedLogin;
