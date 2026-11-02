import styles from './styles.module.scss';
import loginScreen from '../../assets/Group 4517.png';
// import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as CheckIcon } from '../../assets/check-icon.svg';
import AuthHeader from '../AuthHeader';
import clsx from 'clsx';

type IAuthScreen = {
  title?: string;
  description?: string;
  header?: boolean;
  listItems?: boolean;
  illustration?: any;
};
const AuthScreen = ({
  title,
  description,
  header,
  listItems,
  illustration,
}: IAuthScreen) => {
  return (
    <div className={styles['left']}>
      <AuthHeader
        className={clsx('ml-10 mt-7 absolute', {
          'scale-100': header,
          'scale-0': !header,
        })}
      />
      <div className={styles['left-content']}>
        {illustration ? (
          <>{illustration}</>
        ) : (
          <img src={loginScreen} className="w-full max-w-[431px]" alt="" />
        )}

        <div className={styles['left-text-content']}>
          <p className={styles['title']}>{title}</p>
          <p className={styles['description']}>{description}</p>

          {listItems && (
            <div className={styles['list-items']}>
              <div>
                <div className={styles['flex']}>
                  <CheckIcon />
                  <div>
                    <p className={styles['text-head']}>All-in-one Tool</p>
                    <p className={styles['text-small']}>
                      End-to-end document editing!
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles['padtop']}>
                <div className={styles['flex']}>
                  <CheckIcon />
                  <div>
                    <p className={styles['text-head']}>
                      Easy to manage your activities.
                    </p>
                    <p className={styles['text-small']}>
                      Manage,Review & Publish projects!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
