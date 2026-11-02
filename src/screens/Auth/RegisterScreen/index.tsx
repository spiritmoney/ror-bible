import React from 'react';
import AuthScreen from '../../../components/AuthScreen';
import Register from '../../../components/Register';
import { useWindowSize } from 'usehooks-ts';
// import style from './styles.module.scss';

export interface IRegisterScreen { }

const RegisterScreen: React.FunctionComponent<IRegisterScreen> = () => {
  const { width } = useWindowSize();
  return (
    <section className="flex">
      <aside className="h-max min-h-screen max-h-screen w-1/2 mobile:hidden overflow-y-auto">
        {width >= 640 && (
          <AuthScreen
            header
            title="Edit, Review & Publish all in one workspace"
            listItems
          />
        )}
      </aside>
      <article className="h-max min-h-screen max-h-screen w-1/2 pt-[3.1875rem] pb-7 flex flex-col justify-between overflow-y-auto mobile:w-full px-2">
        <Register />
        <p className="mt-4 text-center text-faded-black text-[.8125rem]">
          © {new Date().getFullYear()} , Scribbbler Workspace, A Product of New Media Technologies.
          All Right Reserved.
        </p>
      </article>
    </section>
  );
};

export default RegisterScreen;
