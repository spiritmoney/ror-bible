import React from 'react';
// import book from 'assets/book.png';
import { ReactComponent as More } from 'assets/book-more.svg';
import { ReactComponent as ApprovedBanner } from 'assets/Approved-Banner.svg';
import { IProject } from 'interface/project';
import useProjects from 'hooks/useProjects';
import './styles.scss';
import clsx from 'clsx';
import Dropdown from 'components/Dropdown';
import { ReactComponent as Collab } from 'assets/collab.svg';
import { ReactComponent as View } from 'assets/view.svg';
import { useSetRecoilState } from 'recoil';
import {
  collabPopupModalAtom,
  viewProjectInfoModalAtom,
} from 'store/atoms/workspace';
import { collabProjectAtom } from '../../store/atoms/workspace';
import { useUser } from '../../hooks/useUser';

interface IBooksPreview {
  project: IProject;
}

//20

const BooksPreview: React.FunctionComponent<IBooksPreview> = ({ project }) => {
  const { saveDoc, setProject, project: active } = useProjects();
  const setShowcollabPopupModal = useSetRecoilState(collabPopupModalAtom);
  const setShowViewProjectPopupModal = useSetRecoilState(
    viewProjectInfoModalAtom
  );
  const setCollabProject = useSetRecoilState(collabProjectAtom);
  const { user } = useUser();

  const handleClick = () => {
    saveDoc({});
    setProject(project);
  };
  return (
    <div
      className={clsx(
        ' booksPreview flex w-full items-center justify-between cursor-pointer ',
        { 'bg-blue-200': project.id === active?.id }
      )}
    >
      <div className="book-img w-full mr-2 ">
        {project.isApproved === true && <ApprovedBanner className='approved' />}
        <img
          src={project.cover}
          alt=""
          className="w-[50.55px] mr-2"
          onClick={handleClick}
        />
      </div>

      <div onClick={handleClick}>
        <h4 className="mb-1 text-[.9375rem] truncate w-[7.5rem] ">
          {project.title}
        </h4>
        <p className="font-light text-sm">V: {project.version}</p>
      </div>
      <Dropdown
        dropdownClassName="border border-dropdown-border py-[0.375rem] font-raleway bg-white w-full "
        // style="!inset:0px 0px auto auto;"
        position="right"
        content={
          <ul className="flex flex-col gap-y-[10px] w-[14rem]">
            {project.collaborators?.includes(user.id!) ? (
              ''
            ) : (
              <li
                className="flex justify-between items-center font-normal text-[12px] text-faded-black cursor-pointer hover:bg-[rgba(34,119,184,0.09)] hover:text-[#2277b8] px-[1.25rem] "
                onClick={() => {
                  setShowcollabPopupModal(true);
                  setCollabProject(project);
                }}
              >
                <span>Collaboration Mode</span> <Collab />
              </li>
            )}

            <li
              className=" flex justify-between items-center font-normal text-[12px] text-faded-black cursor-pointer hover:bg-[rgba(34,119,184,0.09)] hover:text-[#2277b8] px-[1.25rem] "
              onClick={() =>
                setShowViewProjectPopupModal({ show: true, project })
              }
            >
              <span>View Project info</span> <View />
            </li>
          </ul>
        }
      >
        <More className="cursor-pointer ml-4" />
      </Dropdown>
    </div>
  );
};

export default BooksPreview;
