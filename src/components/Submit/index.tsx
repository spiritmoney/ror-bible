/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import ModalFooterTime from 'components/ModalFooterTime';
import { collection, onSnapshot } from 'firebase/firestore';
import { useFirebase } from 'hooks/useFirebase';
import useProjects from 'hooks/useProjects';
import { DateTime } from 'luxon';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { db } from 'service/firebase';
import { copyContactAtom, DarkThemeAtom } from 'store/atoms/general';
import { ISO_TIME_FORMAT } from 'store/constant';
import { useEffectOnce } from 'usehooks-ts';
import { ReactComponent as SubmitIcon } from '../../assets/submitIcon.svg';
import useKingsChat from '../../hooks/useKingsChat';
import { useUser } from '../../hooks/useUser';
import { IUser } from '../../interface/user';
import Chip from '../Chip/index';
import {
  ISelectedSubmitUser,
  removeSubmitUser,
  sendKCUserSubmitMessage,
} from './config';
import './styles.scss';
import useVersioning from '../../hooks/useVersioning';
import useNotification from 'hooks/useNotification';

export interface ISubmit { }

const Submit: React.FunctionComponent<ISubmit> = () => {
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [toUsersList, setToUsersList] = useState<IUser[]>([]);
  const [ccUsersList, setCcUsersList] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({
    to: '',
    cc: '',
    subject: '',
    comment: '',
  });
  const [selectedToUsers, setSelectedToUsers] = useState<{
    [key: string]: ISelectedSubmitUser;
  }>({});
  const [selectedCcUsers, setSelectedCcUsers] = useState<{
    [key: string]: ISelectedSubmitUser;
  }>({});
  const [version, setVersion] = useState('');

  const ref = useRef<any>();
  const [copyContact, setCopyContact] = useRecoilState(copyContactAtom);
  const { edit, add } = useFirebase();
  // const { project, saveDoc } = useProjects();
  const { sendMessage } = useKingsChat();
  const { user: authUser } = useUser();
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const { actualVersion, incrementVersion } = useVersioning();

  const { sendNotification } = useNotification();

  // useEffect(() => {
  //   if (!project) return;
  //   console.log(project);

  //   incrementVersion(project?.version, project?.title);
  //   if (project.isDuplicate) {
  //     setVersion(project.version);
  //     return;
  //   }
  //   setVersion(actualVersion);
  // }, [project, actualVersion]);

  // useEffect(() => {
  //   if (!actualVersion) return;
  //   saveDoc({})
  // }, [actualVersion])

  useEffectOnce(() => {
    onSnapshot(collection(db, 'users'), querySnapshot => {
      const users: any = querySnapshot.docs
        .map(doc => {
          return { ...doc.data(), id: doc.id };
        })
        .filter(user => user?.id);
      console.log({ users });
      setUsersData(users);
    });

  });

  useEffect(() => {
    if (usersData.length < 1) return;
    const filterData = usersData.filter(user =>
      (user?.fullName ?? user?.name).toLowerCase().includes(to.toLowerCase())
    );
    const filterList = filterData.filter((el) => el.dept === authUser.dept);
    setToUsersList(filterList);
  }, [to, usersData]);

  useEffect(() => {
    const filterData = usersData.filter(user =>
      (user?.fullName ?? user?.name).toLowerCase().includes(cc.toLowerCase())
    );
    const filterList = filterData.filter((el) => el.dept === authUser.dept);
    setCcUsersList(filterList);
  }, [cc, usersData]);


  const handleCc = () => {
    setCopyContact(true);
  };
  const handleCcOut = () => {
    setCopyContact(false);
  };

  const resetData = () => {
    setCc('');
    setTo('');
    setSubject('');
    setComment('');
    setSelectedToUsers({});
    setSelectedCcUsers({});
    setErrors({
      to: '',
      cc: '',
      subject: '',
      comment: '',
    });
    setVersion('');
  };

  const handleClose = () => {
    resetData();
    ref.current.click();
  };

  // ========================================================================== //
  const handleSubmit = async (e: any) => {

    // setErrors({
    //   to: '',
    //   cc: '',
    //   subject: '',
    //   comment: '',
    // });

    let hasError = false;

    if (Object.values(selectedToUsers).length === 0) {
      setErrors(prev => ({ ...prev, to: 'Please select at least one user' }));
      hasError = true;
    }

    // if (hasError) {
    //   return;
    // }

    setLoading(true);

    const toData = Object.values(selectedToUsers).map(user => user.id);
    console.log('user', selectedToUsers);
    console.log('Authuser', authUser);
    const ccData = Object.values(selectedCcUsers).map(user => user.id);
    // const isToUser = project.to.some(user => user.includes(authUser?.id!));
    // const isCcUser = project.cc.some(user => user.includes(authUser?.id!));
    // const isCollabUser = project.collaborators?.some(user => user.includes(authUser?.id!));

    const editorPayload = {
      subject,
      comment,
      to: toData,
      cc: ccData,
    };

    const payload: any = {

      to: toData,
      cc: ccData,
      subject,
      comment,
    };

    try {

//       toData.forEach(async user => {
//         await sendNotification(user, {
//           title: `$ You Have Received a New Message from`,
//           message: `
// Subject: ${payload.subject}
// Comment: ${payload.comment}
// Date: ${DateTime.now().toLocaleString(DateTime.DATETIME_MED)}`,
//           data: payload,
//           inviteType: 'to',

//         });
//       });

      await sendKCUserSubmitMessage(
        selectedToUsers,
        selectedCcUsers,
        sendMessage,
        payload
      );

      // handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const flex = 'flex justify-between items-center';

  return (
    <div className="submit-popup pb-[20px]">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <SubmitIcon className="ml-6" />
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
          <Cancel />
        </button>
      </div>
      <form
        className=" form px-5 mt-6 mx-0.5 flex flex-col pb-8 gap-y-6 overflow-auto"
        onSubmit={handleSubmit}
      >
        <div className="contact">
          <UserDropDownInput
            inputState={to}
            list={toUsersList}
            remove={removeSubmitUser}
            selected={selectedToUsers}
            setSelected={setSelectedToUsers}
            setInputState={setTo}
            errors={errors.to}
          />
        </div>

        <Input
          type={'text'}
          label="Subject"
          name="subject"
          required
          pattern="^.{3,}$"
          title="Enter at least 3 characters"
          value={subject}
          setValue={setSubject}
          error={errors.subject}
        />

        <Input
          type={'textarea'}
          label="Message"
          required
          value={comment}
          setValue={setComment}
          error={errors.comment}
        />

        <div className="submit-buttons flex ">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            secondary
            small
            className={clsx(
              'subClick  p-4 text-white bg-dark-blue font-small mb-3 w-14 shrink-0'
            )}
          >
            {'Submit'}
          </Button>
        </div>
      </form>

      <ModalFooterTime />
    </div>
  );
};

export default Submit;

type IUserDropDownInputProps = {
  list: IUser[];
  setSelected: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ISelectedSubmitUser;
    }>
  >;
  selected: {
    [key: string]: ISelectedSubmitUser;
  };
  remove: (
    id: string,
    setState: React.Dispatch<
      React.SetStateAction<{
        [key: string]: ISelectedSubmitUser;
      }>
    >,
    state: {
      [key: string]: ISelectedSubmitUser;
    }
  ) => void;
  inputState: string;
  setInputState: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  name?: string;
  errors?: string;
  required?: boolean;
};

export const UserDropDownInput = ({
  inputState,
  list,
  remove,
  selected,
  setInputState,
  setSelected,
  label,
  name,
  errors,
  required = true,
}: IUserDropDownInputProps) => {
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  return (
    <>
      <Dropdown
        // dropdownClassName="border border-dropdown-border py-[10px] font-raleway overflow-auto  bg-white max-h-[180px]  min-w-[12rem] w-max"
        className={'h-max w-max min-w-[37rem]'}
        content={
          <ul className="flex flex-col  gap-y-[10px]">
            {list.length > 0 ? (
              list.map((el, i) => {
                if (Object.values(selected).some(user => user.id === el.id))
                  return '';

                return (
                  <li
                    key={i}
                    className={clsx(
                      ' flex items-center gap-x-4 font-semibold text-[12px]  cursor-pointer hover:bg-slate-50 px-[.875rem] ',
                      { 'hover:!bg-[#0f2230]': DarkTheme === true }
                    )}
                    onClick={() => {
                      setSelected(prev => ({
                        ...prev,
                        [el.email]: {
                          id: el.id as string,
                          name: el.fullName,
                          kingsChatid: el.kingsChatid,
                          kingsChatTokens: el.kingsChatTokens,
                        },
                      }));
                    }}
                  >
                    <Avatar name={el.fullName} image={el.avatar} random />
                    <span>
                      {el.fullName}
                      <br />
                      <span>{el.email}</span>
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="px-[.875rem] text-sm">No user</li>
            )}
          </ul>
        }
      >
        <Input
          type={'text'}
          label={label ?? 'To'}
          name={name ?? 'to'}
          className="w-[100%]"
          required={required}
          autoComplete="off"
          value={inputState}
          setValue={setInputState}
          error={errors}
          formNoValidate={true}
        />
      </Dropdown>
      <div className="flex mt-1 flex-wrap gap-x-2 gap-y-2 empty:hidden">
        {Object.values(selected).map((el, i) => (
          <Chip
            key={i}
            name={el.name}
            id={el.id}
            remove={id => remove(id, setSelected, selected)}
          />
        ))}
      </div>
    </>
  );
};
