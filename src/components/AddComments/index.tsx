/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { ReactComponent as AddCommentIcon } from 'assets/add-comment.svg';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Input from 'components/Input';
import { useFirebase } from 'hooks/useFirebase';
import { DateTime } from 'luxon';
import {useRef, useState, useEffect} from 'react';
import { getDuration } from 'utils/format';
import useProjects from '../../hooks/useProjects';
import { useUser } from '../../hooks/useUser';

import {
  formatDateToDuration,
  sortArrayObjectsBaseOnDate,
} from '../../utils/format';
import useVersioning from '../../hooks/useVersioning';
import './styles.scss';

export interface IAddComments {
  edit?: boolean;
}

const AddComment: React.FunctionComponent<IAddComments> = ({ edit }) => {
  const ref = useRef<any>();
  const { add } = useFirebase();
  const [comment, setComment] = useState('');
  const { allComments, project } = useProjects();
  const [loading, setLoading] = useState(false);
  const { actualVersion, incrementVersion } = useVersioning();

  const { user } = useUser();

  useEffect(() => {
    if (project) {
      incrementVersion(project.version, project.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const flex = 'flex justify-between items-center';

  const send = async (e: any) => {
    e.preventDefault();
    if (!comment || !project) return;
    setLoading(true);
    try {
      await add({
        col: 'comments',
        data: {
          createdAt: DateTime.now().toISO(),
          updatedAt: DateTime.now().toISO(),
          comment,
          userId: user.id,
          name: user.fullName ?? user.name,
          projectId: project.id,
          userAvatar: user.avatar,
          seen: [],
          nextVersion: actualVersion,
          projectName: project.title,
          projectVersion: project.version,
        },
      });
      setComment('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-popup pb-[20px]">
      <div
        className={clsx(
          flex,
          'modal-header pl-[2rem] bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <AddCommentIcon />
          <h5 className="title text-l font-small leading-normal text-white">
            Add Comments
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
      <form
        noValidate
        className=" form px-[2rem] mt-6 flex flex-col pb-8 gap-y-6 overflow-auto"
        onSubmit={send}
      >
        <div className="make-comment">
          <div className="text-[15px] mb-4">Comments</div>

          <div className=" input-area items-center flex gap-x-4">
            <Avatar
              size={31}
              fontSize={13}
              name={user?.fullName!}
              image={user?.avatar}
            />

            <div className="text-area font-light text-[12px] w-full">
              <Input
                type="textarea"
                placeholder="Write a comment..."
                value={comment}
                setValue={setComment}
                inputClassName="h-[5rem]"
              />
            </div>
          </div>

          <Button
            loading={loading}
            disabled={loading}
            secondary
            small
            className="text-[11px] h-8 ml-auto  font-small mb-3 w-14 shrink-0 mt-[1rem] "
          >
            Send
          </Button>
        </div>
      </form>

      {sortArrayObjectsBaseOnDate(allComments).map(comment => (
        <div className=" flex flex-col px-[2rem] mt-3">
          <div className="comment-id flex text-[15px] font-normal items-center">
            <Avatar
              size={31}
              fontSize={13}
              name={comment.name}
              image={comment.userAvatar}
            />
            <span className="ml-4">{comment.name}</span>
          </div>
          <div className="comment-text mt-3 text-[12px] font-light">
            {comment.comment}
          </div>
          <div className="i-c-actions mt-3 flex text-[12px] items-center">
            <div className="reply mr-2">
              <span> Reply</span>
            </div>
            <div className="time-stamp">
              {formatDateToDuration(comment.createdAt)} Ago
            </div>
          </div>
        </div>
      ))}

      {/* <ModalFooterTime /> */}
    </div>
  );
};

export default AddComment;
