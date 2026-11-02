import React, { useRef } from 'react';
import { IUser } from '../../interface/user';
import './styles.scss';
import { DateTime } from 'luxon';
import clsx from 'clsx';
import { ReactComponent as ViewIcon } from '../../assets/viewWhite.svg';
import { ReactComponent as OngoingStatus } from '../../assets/ProjectOngoing.svg';
import { ReactComponent as ApprovedStatus } from '../../assets/ProjectApproved.svg';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import { IProject } from '../../interface/project';
import { ReactComponent as ApprovedBanner } from 'assets/largeApproved-Banner.svg';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';

export interface IViewProjectInfo {
  user?: IUser;
  project: IProject | null;
}

const ViewProjectInfo: React.FunctionComponent<IViewProjectInfo> = ({
  project,
  user,
}) => {
  const ref = useRef<any>();
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const flex = 'flex justify-between items-center';

  return (
    <div className="ProjectInfo-popup">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <ViewIcon className="ml-6" />
          <h5 className="title text-l font-small leading-normal text-white">
            View Project Info
          </h5>
        </div>
        <button
          type="button"
          className="close-modal text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel />
        </button>
      </div>

      <div className="main flex mt-3">
        <div className={clsx('bookIcon flex ')}>
          {project?.isApproved === true && <ApprovedBanner className='approved' />}

          <img src={project?.cover} alt="" className="w-[10rem] ml-5" />
        </div>

        <div className="select scroll-auto flex flex-col gap-y-4">
          <ul className="flex flex-col font-bold cursor-pointer mb-5 text-[12px] gap-y-[12px]">
            <li
              className={clsx(' font-light mb-4 px-[1.25rem] ', {
                '': DarkTheme === true,
              })}
            >
              <span className="font-bold mr-[4rem]">Project Name:</span>{' '}
              {project?.title}
            </li>
            <li
              className={clsx(' font-light mb-4  px-[1.25rem] ', {
                'hover:!bg-[#0f2230]': DarkTheme === true,
              })}
            >
              <span className="font-bold mr-[4rem]">Latest Version:</span>{' '}
              {project?.version}
            </li>
            <li
              className={clsx(' font-light   mb-4 px-[1.25rem] ', {
                'hover:!bg-[#0f2230]': DarkTheme === true,
              })}
            >
              <span className="font-bold mr-[6.5rem]">Author:</span>{' '}
              {project?.author}
            </li>
            <li
              className={clsx(' font-light mb-4  px-[1.25rem] ', {
                'hover:!bg-[#0f2230]': DarkTheme === true,
              })}
            >
              <span className="font-bold mr-[3rem]">Editor-in-Charge:</span>{' '}
              {project?.editorInCharge}
            </li>
            <li
              className={clsx(' font-light mb-4  px-[1.25rem] ', {
                'hover:!bg-[#0f2230]': DarkTheme === true,
              })}
            >
              <span className="font-bold mr-[4rem]">Team Members:</span>
            </li>
            <li
              className={clsx(
                ' flex items-center font-light mb-4  px-[1.25rem] ',
                { 'hover:!bg-[#0f2230]': DarkTheme === true }
              )}
            >
              <span className="font-bold mr-[4rem]">Current Status:</span>{' '}
              {project?.isApproved === true ? <ApprovedStatus className="w-[5rem]" /> : <OngoingStatus className="w-[5rem]" />}
            </li>
          </ul>
        </div>
      </div>
      <p
        className={clsx(
          'w-[80%] ml-auto mr-auto text-[12px] font-light text-[rgba(0,0,0,0.75)] text-center pt-[10px] border-t mt-8 border-[rgba(62,69,82,0.28)]',
          { '!text-[#EDF1F3]': DarkTheme === true }
        )}
      >
        Date Created :{' '}
        {DateTime.fromISO(project?.createdAt ?? '').toLocaleString(
          DateTime.DATE_FULL
        )}{' '}
        at{' '}
        {DateTime.fromISO(project?.createdAt ?? '').toLocaleString(
          DateTime.TIME_SIMPLE
        )}
      </p>
      <p
        className={clsx(
          'w-[80%] ml-auto mr-auto text-[12px] font-light text-[rgba(0,0,0,0.75)] text-center pt-[10px]',
          { '!text-[#EDF1F3]': DarkTheme === true }
        )}
      >
        Date Modified : {DateTime.now().toLocaleString(DateTime.DATE_FULL)} at{' '}
        {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
      </p>

    </div>
  );
};

export default ViewProjectInfo;
