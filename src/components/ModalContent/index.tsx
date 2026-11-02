import clsx from 'clsx';
import styles from './styles.module.scss';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import Button from 'components/Button';
import { useState, useEffect, useRef } from 'react';
import useProjects from 'hooks/useProjects';
import { DateTime } from 'luxon';
import useVersioning from '../../hooks/useVersioning';
import { useUser } from 'hooks/useUser';
import { useFirebase } from 'hooks/useFirebase';

interface IModalContent {
  isSaved?: boolean;
  underReview?: boolean;
  approveProject?: boolean;
  icon?: any;
}

const ModalContent: React.FC<IModalContent> = ({
  underReview,
  isSaved,
  approveProject,
  icon,
}) => {
  const [loading, setLoading] = useState(false);
  const { project, setProject } = useProjects();
  const ref = useRef<any>();
  const { actualVersion, incrementVersion } = useVersioning();
  const { user } = useUser();
  const { add, edit } = useFirebase();

  useEffect(() => {
    if (!project) return;
    incrementVersion(project?.version, project?.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, actualVersion]);

  const handleSave = async () => {
    if (!actualVersion) return;
    if (!project) return;
    // deleteData({
    //   col: 'projects',
    //   id: project.id,
    // })
    // return
    setLoading(true);

    const payload: any = {
      title: project?.title,
      version: actualVersion,
      to: [],
      cc: [],
      subject: '',
      comment: '',
      isEdit: true,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
      lastOpened: DateTime.now().toISO(),
      html: project?.html,
      delta: project?.delta,
      userId: user.id,
      originalOwner: project?.originalOwner ?? project?.userId,
      count: 0,
      isLatest: true,
      author: project?.author,
      editorInCharge: user.fullName ?? user.name,
      storedImageFolder: project?.storedImageFolder,
      storedImageName: project?.storedImageName,
      cover: project?.cover,
      seen: [],
      collaborators: [],
      seenCollab: [],
      hasMadeDuplicate: [],
      isDuplicate: true,
      makeDuplicate: false,
    };

    try {
      await edit({
        col: 'projects',
        id: project?.id,
        data: {
          hasMadeDuplicate: [...(project?.hasMadeDuplicate ?? []), user.id!],
        },
      });
      const clonedData: any = await add({
        col: 'projects',
        data: payload,
      });
      payload.id = clonedData.id;
      setProject(payload);
      ref.current.click();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!project) return;
    setLoading(true);
    await edit({
      col: 'projects',
      data: {
        isApproved: true,
      },
      id: project.id,
    });

    setLoading(false);


  };

  return (
    <div className={clsx(styles.parent, 'w-screen max-w-[531px]')}>
      <div className={styles['blue-top']}>
        {/* <button className={styles.close}>&times;</button> */}
        <button
          type="button"
          className={clsx(
            styles.close,
            'text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline'
          )}
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel />
        </button>
      </div>
      <div className={styles['icon-container']}>{icon}</div>
      {isSaved && (
        <div className={styles.isSaved}>
          <p className={styles.p1}>Saved!</p>
          <p className={styles.p2}>Project was successfully saved!</p>
        </div>
      )}
      {underReview && (
        <div className={styles.isSaved}>
          <p className={styles.p1}>Save As</p>
          <p className={styles.p2}>
            Kindly save as new file before proceeding...
          </p>
          <div className="submit-buttons flex justify-end ">
            <Button
              type="submit"
              secondary
              small
              className={clsx(
                'subClick  p-4 text-white bg-dark-blue font-small mt-5 mr-5 w-[7rem] h-[2.5rem] shrink-0'
              )}
              loading={loading}
              disabled={loading}
              onClick={handleSave}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
      {approveProject && (
        <div className={styles.isSaved}>
          <p className={styles.p1}>Approve Project</p>
          <p className={styles.p2}>
            Would you like to approve this project?
          </p>
          <div className="submit-buttons flex justify-end ">
            <Button
              type="submit"
              secondary
              small
              className={clsx(
                'subClick  p-4 text-white bg-dark-blue font-small mt-5 mr-5 w-[7rem] h-[2.5rem] shrink-0'
              )}
              loading={loading}
              disabled={loading}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalContent;
