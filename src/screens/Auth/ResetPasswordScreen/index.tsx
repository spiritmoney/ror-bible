import React from 'react';
import AuthScreen from '../../../components/AuthScreen';
import { ReactComponent as Illustration } from '../../../assets/reset-password-illustration.svg';
import ResetPassword from '../../../components/ResetPassword';
import { useWindowSize } from 'usehooks-ts';
// import style from './styles.module.scss';

export interface IResetPasswordScreen {}

const ResetPasswordScreen: React.FunctionComponent<
  IResetPasswordScreen
> = () => {
  const { width } = useWindowSize();
  return (
    <section className="flex">
      <aside className="h-max min-h-screen max-h-screen w-1/2 mobile:hidden overflow-y-auto">
        {width >= 640 && (
          <AuthScreen
            header
            illustration={<Illustration className="w-full max-w-[18.75rem]" />}
          />
        )}
      </aside>
      <article className="h-max min-h-screen max-h-screen w-1/2 pt-[3.1875rem] pb-7 flex flex-col justify-between overflow-y-auto mobile:w-full px-2">
        <ResetPassword />
        <p className="mt-20 text-center text-faded-black text-[.8125rem]">
          © {new Date().getFullYear()} , Scribbbler Workspace, A Product of New Media Technologies.
          All Right Reserved.
        </p>
      </article>
    </section>
  );
};

export default ResetPasswordScreen;
