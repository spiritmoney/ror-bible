/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { ReactComponent as CloneIcon } from 'assets/clone.svg';
import { ReactComponent as DeleteIcon } from 'assets/delete.svg';
import { ReactComponent as EditIcon } from 'assets/edit.svg';
import { ReactComponent as ViewUserIcon } from 'assets/hide-password.svg';
import { ReactComponent as ManageUserIcon } from 'assets/manage-user.svg';
import { ReactComponent as MoreIcon } from 'assets/more.svg';
import { ReactComponent as MoreIconLight } from 'assets/moreLight.svg';
import clsx from 'clsx';
import AddUsers from 'components/AddUsers';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Modal from 'components/Modal';
import Table from 'components/Table';
import { useFirebase } from 'hooks/useFirebase';
import { IUser } from 'interface/user';
import { useEffect, useState, useRef } from 'react';
import { sortArrayObjectsBaseOnDate, sortArrayObjectsBaseOnString } from 'utils/format';
import { redactPayloadProp } from 'utils/general';
import { DateTime } from 'luxon';
import './styles.scss';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';

export interface IUsers {}

const Users: React.FunctionComponent<IUsers> = () => {
  const [usersData, setUsersData] = useState<IUser[]>([
    { fullName: '', createdAt: '', email: '', region: '', terms: true },
  ]);
  const [userToEdit, setUserToEdit] = useState<IUser | undefined>();
  const [editId, setEditId] = useState<number | undefined>();
  const ref = useRef<any>();
  const { getOnSnapshot, add, deleteData } = useFirebase();
  const [cloneLoading, setCloneLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const DarkTheme = useRecoilValue(DarkThemeAtom);


  useEffect(() => {
    (async () => {
      try {
        const users: any = await getOnSnapshot({
          col: 'users',
        });
        setUsersData(users);
      } catch (error) {}
    })();
  }, [getOnSnapshot]);

  const handleEdit = (data: IUser, index: number) => {
    setEditId(index);
    setUserToEdit(data);
    ref.current.click();
  };

  const handleClone = async (data: IUser, index: number) => {
    setCloneLoading(true);
    setEditId(index);
    const dataToSave = { ...data };
    redactPayloadProp(dataToSave, ['password', 'email', 'id'], true);
    try {
      await add({
        col: 'users',
        data: { ...dataToSave, createdAt: DateTime.now().toISO() },
      });
      setCloneLoading(false);
      setEditId(undefined);
    } catch (error) {
      setCloneLoading(false);
      setEditId(undefined);
    }
  };

  const handleDelete = async (data: IUser, index: number) => {
    setDeleteLoading(true);
    setEditId(index);
    try {
      await deleteData({
        col: 'users',
        id: data.id as string,
      });
      setDeleteLoading(false);
      setEditId(undefined);
    } catch (error) {
      setDeleteLoading(false);
      setEditId(undefined);
    }
  };

  return (
    <div className="py-5 px-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <p>{'Home > Users & Permissions > Manage Users'}</p>

        <Modal
          id={'add-user'}
          scrollable
          title="Add User"
          content={<AddUsers />}
          
        >
          <Button primary className="font-normal py-1 h-[40px] text-base">
            Add User +
          </Button>
        </Modal>
      </div>

      <Table
       
        tableData={sortArrayObjectsBaseOnDate(usersData).map((user, i) => ({
          Name: user.fullName ?? user.name,
          email: user.email,
          role: user?.role ?? 'user',
          dept: user?.dept ?? '',
          managementButtons: (
            <div className="flex items-center gap-x-3">
              <Button
                className="h-[40px]"
                primary
                loading={cloneLoading && editId === i}
                disabled={cloneLoading && editId === i}
                onClick={() => handleClone(user, i)}
                removeSpinnerMargin
              >
                {cloneLoading && editId === i ? (
                  ''
                ) : (
                  <CloneIcon className="w-[16px]" />
                )}
              </Button>

              <Button
                className="h-[40px]"
                primary
                onClick={() => handleEdit(user, i)}
              >
                <EditIcon className="w-[16px]" />
              </Button>

              <Button
                loading={deleteLoading && editId === i}
                disabled={deleteLoading && editId === i}
                className="h-[40px]"
                danger
                onClick={() => handleDelete(user, i)}
                removeSpinnerMargin
              >
                {deleteLoading && editId === i ? (
                  ''
                ) : (
                  <DeleteIcon className="w-[16px]" />
                )}
              </Button>
            </div>
          ),
          '': (
            <div className="flex items-center">
              <Dropdown
                dropdownClassName="bottom-16 top-[100%] h-fit "
                content={
                  <ul
                    className={clsx(' bg-white', {
                      '-translate-y-16': usersData.length === i + 1,
                    })}
                  >
                    <li className="flex rounded-[5px] px-2 py-2 text-[14px] cursor-pointer gap-x-3 hover:bg-slate-50">
                      <ViewUserIcon className="w-[16px]" /> View User
                    </li>
                    <li className="flex rounded-[5px] px-2 py-2 text-[14px] cursor-pointer gap-x-3 hover:bg-slate-50">
                      <ManageUserIcon className="w-[16px]" />{' '}
                      {user.isActive ? 'Disable User' : 'Enable User'}
                    </li>
                  </ul>
                }
              >
                <Button className="h-[40px] cursor-pointer">
                  {!DarkTheme ? <MoreIcon /> : <MoreIconLight />}
                </Button>
              </Dropdown>
            </div>
          ),
        }))}
        hiddenColumns={['id']}
      />

      <Modal
        id={`edit-${editId}`}
        onClose={() => {
          setUserToEdit(undefined);
          setEditId(undefined);
        }}
        scrollable
        loadOnOpen={true}
        title="Edit User"
        content={userToEdit && <AddUsers edit user={userToEdit} />}
      >
        <a href="#" ref={ref}></a>
      </Modal>
    </div>
  );
};

export default Users;
