import React from 'react';
import AuthScreen from '../../../components/AuthScreen';
import Login from '../../../components/Login';
import { useWindowSize } from 'usehooks-ts';
// import style from './styles.module.scss';

export interface ILoginScreen { }

const LoginScreen: React.FunctionComponent<ILoginScreen> = () => {
  const { width } = useWindowSize();
  return (
    <section className="flex items-center justify-center">
      {/* <aside className="h-max min-h-screen max-h-screen w-1/2 mobile:hidden overflow-y-auto">
        {width >= 640 && (
          <AuthScreen
            header
            title="Edit, Review & Publish all in one workspace"
            description="End-to-end document editing, management, review & publishing for an enterprise!"
          />
        )}
      </aside> */}
      <article className="h-max min-h-screen max-h-screen w-1/2 pt-[3.1875rem] pb-7 flex flex-col justify-between overflow-y-auto mobile:w-full px-2">
        <Login />

        <p className="mt-20 text-center text-faded-black text-[.8125rem]">
          © {new Date().getFullYear()} , ROR Bible+, A Product of New Media Technologies.
          All Right Reserved.
        </p>
      </article>
    </section>
  );
};

export default LoginScreen;
