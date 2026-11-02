/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useRef, useState } from 'react';
import { IUser } from '../../interface/user';
import './styles.scss';
import Input from 'components/Input';
import Button from 'components/Button';
import clsx from 'clsx';
import { ReactComponent as LibraryIcon } from '../../assets/libraryWhite.svg';
import { ReactComponent as FilterIcon } from '../../assets/Filter-Icon.svg';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import LibraryDropDown from 'components/LibraryDropDown';
import { generateAlphabets } from 'utils/general';
import { useEffectOnce } from 'usehooks-ts';
import useProjects from '../../hooks/useProjects';
import { IProject } from '../../interface/project';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
import { ReactComponent as FilterIconDark } from '../../assets/FilterDark.svg';
import Dropdown from 'components/Dropdown';
import { ReactComponent as ApprovedBanner } from 'assets/smallApproved-Banner.svg';



export interface ILibraryPopup {
  user?: IUser;
  edit?: boolean;
}

const LibraryPopup: React.FunctionComponent<ILibraryPopup> = ({
  edit,
  user,
}) => {
  const [alphabets, setAlphabets] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [topFourProjects, setTopFourProjects] = useState<IProject[]>([]);
  const ref = useRef<any>();
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [search, setSearch] = useState('');
  const { allProjects, getMostOpenedProject, setProject } = useProjects();

  useEffectOnce(() => {
    setAlphabets(generateAlphabets());
  });

  useEffect(() => {
    (async () => {
      const top4: any = await getMostOpenedProject();
      setTopFourProjects(top4 ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProjects]);

  useEffect(() => {
    const filterProject = allProjects.filter(project =>
      (project?.title ?? project?.author ).toLowerCase().includes(search.toLowerCase())
    );
    setProjects(filterProject);
  }, [search, allProjects]);


  const openProject = (project: IProject) => {
    if (!project) return;
    setProject(project);
    cancel()
  };

  const cancel = () => {
    setSelectedProject(null);
    ref.current.click();
  };

  const flex = 'flex justify-between items-center';

  return (
    <div className="library-popup">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <LibraryIcon className="ml-6" />
          <h5 className="title text-l font-small leading-normal text-white">
            Library
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

      <div className="flex mt-[1.1875rem] mb-[1.6875rem] items-center justify-between gap-x-10 px-[2.1875rem] ">

        <Dropdown
          dropdownClassName="border border-dropdown-border py-[10px] font-raleway overflow-auto  bg-white max-h-[250px]  min-w-[12rem] w-max"
          className={'h-max'}
          content={
            <ul className="flex flex-col gap-y-[10px]">
              {projects.length > 0 ? (
                projects.map((el, i) => {
                  // if (Object.values(selected).some(project => project.id === el.id))
                  //   return '';

                  return (
                    <li
                      key={i}
                      className={clsx(
                        ' flex items-center gap-x-4 font-normal text-[11px]  cursor-pointer hover:bg-slate-50 px-[.875rem] ',
                        { 'hover:!bg-[#0f2230]': DarkTheme === true }
                      )}
                      onClick={() => openProject(el)}
                    >
                      <div className="book-img">
                        {el.isApproved === true && <ApprovedBanner className='approvedSearch ' />}
                        <img
                          src={el.cover}
                          alt=""
                          className="w-[20.55px] mr-2"
                        />
                      </div>
                      <span className="flex flex-col">
                        <span className="searchTitle">{el.title}</span>
                        <span className="searchVersion">
                          Version: {el.version}
                        </span>
                      </span>

                    </li>
                  );
                })
              ) : (
                <li className="px-[.875rem] text-sm">No Similar Project</li>
              )}
            </ul>
          }
        >
          <Input
            type={'search'}
            name={'search'}
            placeholder="Search by Book Name, Date, Name of Author"
            value={search}
            setValue={setSearch}
            autoComplete={'off'}
          />
        </Dropdown>

        <Button className="px-0 h-fit">
          {!DarkTheme ? <FilterIcon /> : <FilterIconDark />}
        </Button>
      </div>

      <div className="main flex">
        <div className={clsx("books flex",)}>
          <ul className={clsx("flex flex-col font-semibold cursor-pointer mb-5  text-[12px] gap-y-[12px]", { ' text-[#EDF1F3]': DarkTheme === true })}>
            <li className=" font-semibold  px-[1.25rem] ">
              All Books
            </li>

            {topFourProjects.map((project, i) => (
              <li
                key={i}
                className={clsx("font-light mb-2  hover:bg-slate-50  px-[1.25rem] ", { 'hover:!bg-[#0f2230]': DarkTheme === true })}
                onClick={() => openProject(project)}
              >
                {project.title}
              </li>
            ))}

            <ul className="flex flex-col font-semibold cursor-pointer mb-5 text-[12px] gap-y-[12px]">
              <li className={clsx(" font-semibold  px-[1.25rem] ", { '': DarkTheme === true })}>
                Special Categories
              </li>
              <li className={clsx(" font-light mb-2  hover:bg-slate-50 px-[1.25rem] ", { 'hover:!bg-[#0f2230]': DarkTheme === true })}>
                Favourites
              </li>
              <li className={clsx(" font-light   hover:bg-slate-50 mb-5 px-[1.25rem] ", { 'hover:!bg-[#0f2230]': DarkTheme === true })}>
                Recently Opened
              </li>
              <li className={clsx(" font-light mb-2  hover:bg-slate-50 px-[1.25rem] ", { 'hover:!bg-[#0f2230]': DarkTheme === true })}>
                Publisher
              </li>
              <li className={clsx(" font-light mb-2  hover:bg-slate-50 px-[1.25rem] ", { 'hover:!bg-[#0f2230]': DarkTheme === true })}>
                Author
              </li>
            </ul>
          </ul>
        </div>

        <div className="select scroll-auto flex flex-col gap-y-4">
          {alphabets.map((alphabet, i) => {
            return (
              <LibraryDropDown
                alphabet={alphabet}
                key={i}
                setSelectedProject={setSelectedProject}
                selectedProject={selectedProject}
                projects={allProjects.filter(
                  project =>
                    project.title[0].toLowerCase() === alphabet.toLowerCase()
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="library-buttons p-3flex ">
        <Button
          type="submit"
          secondary
          small
          // fullWidth
          className={clsx(
            'cancel  p-4 text-white bg-dark-blue font-small mb-5 w-14 shrink-0'
          )}
          onClick={cancel}
        >
          {'Cancel'}
        </Button>
        <Button
          type="submit"
          small
          // fullWidth
          className={clsx('open p-4  bg-white font-small mb-5 w-14 shrink-0', {
            'text-[#BFBFBF]': !selectedProject,
            '': selectedProject,
          })}
          onClick={() => openProject(selectedProject!)}
        >
          {'Open'}
        </Button>
      </div>

      <a href="#" data-bs-dismiss="modal" ref={ref}></a>
    </div>
  );
};

export default LibraryPopup;
