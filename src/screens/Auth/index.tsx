import React from 'react';
import EmailSent from '../../components/EmailSent';
// import style from './styles.module.scss';

export interface IAuth {}

const Auth: React.FunctionComponent<IAuth> = () => {
  return (
    <section className="flex">
      <aside className="min-h-screen w-1/2 mobile:hidden">left</aside>
      <article className="h-max min-h-screen max-h-screen w-1/2 pt-[3.1875rem] pb-7 flex flex-col justify-between overflow-y-auto mobile:w-full">
        <EmailSent />
        <p className="mt-20 text-center text-faded-black">
          © {new Date().getFullYear()} , Scribbbler Workspace, A Product of New Media Technologies.
          All Right Reserved.
        </p>
      </article>
    </section>
  );
};

export default Auth;
