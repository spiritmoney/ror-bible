/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useRef, useState } from 'react';
import { IUser } from '../../interface/user';
import './styles.scss';
import Button from 'components/Button';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
import clsx from 'clsx';
import { ReactComponent as Collab } from 'assets/collabWhite.svg';
import { DateTime } from 'luxon';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import CollabFooter from 'components/CollabFooter';
import { UserDropDownInput } from 'components/Submit';
import {
  removeSubmitUser,
  ISelectedSubmitUser,
  sendKCUserCollabMessage,
} from '../Submit/config';
import { useUser } from '../../hooks/useUser';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'service/firebase';
import { useEffectOnce } from 'usehooks-ts';
import { collabProjectAtom } from '../../store/atoms/workspace';
import { useFirebase } from '../../hooks/useFirebase';
import useKingsChat from '../../hooks/useKingsChat';
import useNotification from 'hooks/useNotification';

export interface ICollabMode { }

const CollabMode: React.FunctionComponent<ICollabMode> = () => {
  const ref = useRef<any>();
  const [DarkTheme,] = useRecoilState(DarkThemeAtom);
  const [reviewMode, setReviewMode] = useState(false);
  const [collabMode, setCollabMode] = useState(true);
  const [collabUser, setCollabUser] = useState('');
  const [collabUsers, setCollabUsers] = useState<IUser[]>([]);
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [selectedCollabUsers, setSelectedCollabUsers] = useState<{
    [key: string]: ISelectedSubmitUser;
  }>({});
  const { user: authUser } = useUser();
  const [error, setError] = useState('');
  const project = useRecoilValue(collabProjectAtom);
  const [hasSetUsers, setHasSetUsers] = useState(false);
  const { edit } = useFirebase();
  const [loading, setLoading] = useState(false);
  const { sendMessage } = useKingsChat();

  const { sendNotification } = useNotification();

  

  // useEffect(() => {
  //   if (hasSetUsers) return;
  //   usersData.forEach(user => {
  //     if (project?.collaborators?.includes(user.id!)) {
  //       setSelectedCollabUsers(prev => ({
  //         ...prev,
  //         [user.email]: {
  //           id: user.id!,
  //           name: user.fullName ?? user.name,
  //           kingsChatid: user.kingsChatid,
  //           kingsChatTokens: user.kingsChatTokens,
  //         },
  //       }));
  //       setHasSetUsers(true);
  //     }
  //   });
  // }, [hasSetUsers, project, project?.collaborators, usersData]);

  useEffectOnce(() => {
    onSnapshot(collection(db, 'users'), querySnapshot => {
      const users: any = querySnapshot.docs
        .map(doc => {
          if (doc.id === authUser.id) return null;
          // if (doc.id === 'oraculus.ai@gmail.com') return null;
          return { ...doc.data(), id: doc.id };
        })
        .filter(user => user?.id);
      setUsersData(users);
    });
  });

  const resetData = () => {
    setCollabUser('');
    setCollabUsers([]);
    setSelectedCollabUsers({});
    setError('');
  };

  const handleClose = () => {
    resetData();
    ref.current.click();
  };

  const handleReviewMode = () => {
    setReviewMode(true);
    setCollabMode(false);
  };

  const handleCollabMode = () => {
    setReviewMode(false);
    setCollabMode(true);
  };

//   const handleUpdate = async () => {
//     if (!project) return;
//     if (collabMode && Object.keys(selectedCollabUsers).length < 1) {
//       setError('Please select at least one Receiver');
//       return;
//     }
//     const collabUsers = Object.values(selectedCollabUsers).map(
//       user => user.id
//     )

//     setLoading(true);
//     try {
//       if (collabMode) {
//         await edit({
//           col: 'projects',
//           id: project.id,
//           data: {
//             collaborators: collabUsers,
//             updatedAt: DateTime.now().toISO(),
//             isEdit: true,
//           },
//         });

//         collabUsers.forEach(async user => {
//           await sendNotification(user, {
//             title: `${authUser.fullName ?? authUser.name
//               } wishes to collaborate with you on this project`,
//             message: `
// Project: 
// Date: ${DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
// `,
//             data: project,
//             type: 'collab',
//             inviteType: ''
//           });
//         });

//         await sendKCUserCollabMessage(
//           selectedCollabUsers,
//           authUser,
//           sendMessage,
//         );
//         handleClose();
//       } else {
//         await edit({
//           col: 'projects',
//           data: {
//             collaborators: [],
//             updatedAt: DateTime.now().toISO(),
//           },
//           id: project.id,
//         });
//         handleClose();
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const flex = 'flex justify-between items-center';

  return (
    <div className="collab-popup  pb-[20px]">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <Collab className="ml-6 mr-3" />
          <h5 className="title text-l font-small leading-normal text-white">
            Send Out Push Notification via Kingschat
          </h5>
        </div>
        <button
          type="button"
          className="close-modal text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel className="mr-5" />
        </button>
      </div>
      <div
        className={clsx(
          ' form h-[400px] px-5 mt-6 mr-5 mx-0.5 flex flex-col pb-6 overflow-auto',
          {
            ' Dark bg-[#071723] border-[#0F2230] text-[#EDF1F3]':
              DarkTheme === true,
          }
        )}
      // onSubmit={handleSubmit}
      >
        <div
          className="flex pb-[10px] cursor-pointer mb-4"
          onClick={handleReviewMode}
        >
          <div className="form-check p-0 form-switch">
            <input
              className={clsx(
                'form-check-input appearance-none w-5 rounded-full   h-5 align-top bg-white bg-no-repeat bg-contain bg-black focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={reviewMode}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
          <div
            className={clsx(
              'N-S-opts d-flex flex-column info  mb-2  text-[15px]',
              { active: reviewMode }
            )}
          >
            <div className="font-normal mr-[5rem] px-[1.25rem]">
              Review Mode
            </div>
          </div>
        </div>
        <div
          className="flex pb-[10px] cursor-pointer mb-4"
          onClick={handleCollabMode}
        >
          <div className="form-check p-0 form-switch">
            <input
              className={clsx(
                'form-check-input appearance-none w-5 rounded-full  h-5 align-top bg-white bg-no-repeat bg-contain bg-black focus:outline-none cursor-pointer shadow-sm'
              )}
              checked={!reviewMode}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            ></input>
          </div>
          <div
            className={clsx(
              'N-S-opts d-flex  flex-column info  mb-1  text-[15px] ',
              { active: !reviewMode }
            )}
          >
            <div className="font-normal mr-[5rem] px-[1.25rem]">
              Collaboration Mode
            </div>
          </div>
        </div>

        {collabMode && (
          <UserDropDownInput
            inputState={collabUser}
            list={collabUsers}
            remove={removeSubmitUser}
            selected={selectedCollabUsers}
            setSelected={setSelectedCollabUsers}
            setInputState={setCollabUser}
            label="Collaborators"
            name="collaborators"
            errors={error}
            required={false}
          />
        )}

        <div className="submit-buttons flex mt-14">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            secondary
            small
            className={clsx(
              'subClick  p-4 text-white bg-dark-blue font-normal mb-1 w-14 shrink-0'
            )}
            // onClick={handleUpdate}
          >
            {'Update'}
          </Button>
        </div>
      </div>

      <CollabFooter />
    </div>
  );
};

export default CollabMode;
