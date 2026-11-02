import React from 'react';
import { useWindowSize } from 'usehooks-ts';
import AuthScreen from '../../../components/AuthScreen';
// import ChoosePrefferedLogin from '../../../components/ChoosePrefferedLogin';
import DesktopChoosePrefferedLogin from '../../../components/DesktopChoosePrefferedLogin';

export interface IDeskChoose { }

const DesktopChoose: React.FunctionComponent<IDeskChoose> = () => {
  const { width } = useWindowSize();
  return (
    <section className="flex">
      <aside className="h-max min-h-screen max-h-screen w-1/2 mobile:hidden overflow-y-auto">
        {width >= 640 && (
          <AuthScreen
            title="Edit, Review & Publish all in one workspace"
            description="End-to-end document editing, management, review & publishing for an enterprise!"
          // listItems
          />
        )}
      </aside>
      <article className="h-max min-h-screen max-h-screen w-1/2 pt-[3.1875rem] pb-7 flex flex-col justify-between overflow-y-auto mobile:w-full px-2">
        <DesktopChoosePrefferedLogin />
        <p className="mt-20 text-center text-faded-black text-[.8125rem]">
          © {new Date().getFullYear()} , Scribbbler Workspace, A Product of New Media Technologies.
          All Right Reserved.
        </p>
      </article>
    </section>
  );
};

export default DesktopChoose;
