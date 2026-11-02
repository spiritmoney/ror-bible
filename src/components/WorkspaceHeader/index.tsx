import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  annotationSwitchAtom,
  booksSwitchAtom,
} from '../../store/atoms/workspace';
import SquareSwitch from '../SquareSwitch';
import { ReactComponent as BooksIcon } from '../../assets/books.svg';
import { ReactComponent as SaveIcon } from '../../assets/save.svg';
import { ReactComponent as SaveIconDark } from '../../assets/SaveDarkIcon.svg';
import { ReactComponent as SubmitIcon } from '../../assets/send.svg';
import { ReactComponent as ApprovedIcon } from '../../assets/rocket.svg';
import Button from '../Button';
import clsx from 'clsx';
import useGetSize from '../../hooks/useGetSize';
import { workspaceHeaderHeightAtom } from '../../store/atoms/size';
import usePermission from 'hooks/usePermission';
import Modal from 'components/Modal';
import Submit from 'components/Submit';
import style from './styles.module.scss';
import useProjects from 'hooks/useProjects';
import { ReactComponent as DownloadIcon } from 'assets/download.svg';
import ModalContent from 'components/ModalContent';
import { DarkThemeAtom, libraryAtom } from '../../store/atoms/general';

export interface IWorkspaceHeader {}

const WorkspaceHeader: React.FunctionComponent<IWorkspaceHeader> = () => {
  const [booksSwitch, setBooksSwitch] = useRecoilState(booksSwitchAtom);
  const [annotationSwitch, setAnnotationSwitch] =
    useRecoilState(annotationSwitchAtom);
  const setHeight = useSetRecoilState(workspaceHeaderHeightAtom);
  const { height, ref } = useGetSize();
  const { isAuthor, isEditorInChief, isSystemsAdmin } = usePermission();
  const { project, isProjectInSync, saveDoc } = useProjects();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const setShowLibrary = useSetRecoilState(libraryAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  useEffect(() => {
    setHeight(height);
  }, [height, setHeight]);

  const handleSave = () => {
    saveDoc({
      // setShowSaveModal,
    });
  };

  const handleSubmit = () => {
    if (!project?.id) return;

    setShowSubmit(true);
  };
  const handleApprove = () => {
    if (!project?.id) return;

    setShowApproveModal(true);
  };

  const flex = 'flex justify-between items-center';

  return (
    <div className={clsx(flex, 'pl-[1.875rem] pr-[1.875rem] py-4', { 'bg-[#071723] text-[#EDF1F3]': DarkTheme === true })} ref={ref}>
      <div className={clsx(flex)}>
        <SquareSwitch position={booksSwitch} setPosition={setBooksSwitch} />

        <BooksIcon
          className="ml-6 cursor-pointer"
          onClick={() => setShowLibrary(true)}
        />
        <Modal
          id={'saved-project'}
          isShown={showSaveModal}
          setIsShown={setShowSaveModal}
          scrollable
          hasHeader={false}
          content={<ModalContent icon={<DownloadIcon />} isSaved />}
        />
        <Modal
          id={'approve-project'}
          isShown={showApproveModal}
          setIsShown={setShowApproveModal}
          scrollable
          hasHeader={false}
          content={<ModalContent icon={<ApprovedIcon />} approveProject />}
        />

        <Modal
          id={'submit'}
          hasHeader={false}
          content={<Submit />}
          isShown={showSubmit}
          setIsShown={setShowSubmit}
        />
      </div>

      <div className="font-bold text-[15px]">{project?.title} <span className='font-normal text-[12px]'>V: {project?.version}</span></div>

      <div className={clsx(flex, 'gap-x-[1.5625rem]')}>
       
       {!DarkTheme? <SaveIcon
          className={clsx('cursor-pointer', {
            [style.active]: !isProjectInSync,
          })}
          onClick={handleSave}
          
        /> : <SaveIconDark
          className={clsx('cursor-pointer', {
            [style.active]: !isProjectInSync,
          })}
          onClick={handleSave}

        />
        }

        <Button
          className={clsx('max-w-[6.25rem] w-full', {
            [style['submit']]: project?.id,
          })}
          small
          light
          iconBefore={<SubmitIcon />}
          onClick={handleSubmit}
        >
          Submit
        </Button>

        {(isAuthor || isEditorInChief || isSystemsAdmin) && (
          <Button
            className="max-w-[6.25rem] w-full"
            secondary
            small
            iconBefore={<ApprovedIcon />}
            onClick={handleApprove}
          >
            Approved
          </Button>
        )}

        <SquareSwitch
          position={annotationSwitch}
          setPosition={setAnnotationSwitch}
        />

      </div>
    </div>
  );
};

export default WorkspaceHeader;
