import React, { useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as ArrowShow } from 'assets/arrow-show.svg';
import { ReactComponent as ArrowHide } from 'assets/arrow-hide.svg';
import { IProject } from '../../interface/project';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
import './styles.scss';
import { ReactComponent as ApprovedBanner } from 'assets/Approved-Banner.svg';



type Props = {
  alphabet: string;
  projects: IProject[];
  setSelectedProject: React.Dispatch<React.SetStateAction<IProject | null>>;
  selectedProject: IProject | null;
};

const LibraryDropDown = ({
  alphabet,
  projects,
  selectedProject,
  setSelectedProject,
}: Props) => {
  const [show, setShow] = useState(true);
  const DarkTheme = useRecoilValue(DarkThemeAtom);

  return (
    <div>
      <div
        onClick={() => setShow(prev => !prev)}
        className="top cursor-pointer font-semibold text-black select-none  px-[1.25rem]"
      >
        <span>{!show ? <ArrowHide /> : <ArrowShow />} </span> {alphabet}
      </div>

      <ul
        className={clsx('a_books mt-2 flex flex-col gap-y-1 empty:hidden', {
          hide: !show,
        })}
      >
        {projects.map((project, i) => {
          return (
            <li
              key={i}
              className={clsx(
                ' bookOption flex font-light gap-x-4 text-black cursor-pointer text-[11px] px-[1rem]', { ' !text-[#EDF1F3]': DarkTheme === true },
                {
                  'bg-[rgba(36,128,202,0.2)]':
                    project.id === selectedProject?.id,
                  'hover:bg-[rgba(36,128,202,0.05)]':
                    project.id !== selectedProject?.id,
                }
              )}
              onClick={() => setSelectedProject(project)}
            >
              <div className="book-img">
                {project.isApproved === true && <ApprovedBanner className='approved' />}
                <img
                  src={project.cover}
                  alt=""
                  className="w-[50.55px] mr-2"
                />
              </div>
              {/* <img src={project.cover} alt="" className="w-[50.55px]" /> */}
              <span className="flex flex-col">
                <span className="libraryTitle">{project.title}</span>
                <span className="libraryVersion">
                  Version: {project.version}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LibraryDropDown;
