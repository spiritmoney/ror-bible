/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useRef, useState } from 'react';
import { IUser, IUserDept, IUserRoles } from '../../interface/user';
import bcrypt from 'bcryptjs';
import Input from 'components/Input';
import { useFormik } from 'formik';
import { sortArrayObjectsBaseOnString } from 'utils/format';
import axios from 'axios';
import { useEffectOnce } from 'usehooks-ts';
import { userRolesData, userDeptData } from 'utils/selectData';
import Button from 'components/Button';
import { usersSchema } from 'config/userSchema';
import { useFirebase } from 'hooks/useFirebase';
import { random } from 'lodash';
import { useSendGrid } from 'hooks/useSendGrid';
import { getEnv } from 'utils/general';
import { useRecoilState } from 'recoil';
import { countriesAtom } from 'store/atoms/general';
import clsx from 'clsx';
import Modal from 'components/Modal';
import { DateTime } from 'luxon';
import CustomPopover from 'components/CustomPopover';
// import { Checkbox } from "@mui/material";


export interface IAddUsers {
  user?: IUser;
  edit?: boolean;
}

const AddUsers: React.FunctionComponent<IAddUsers> = ({ edit, user }) => {
  const [countriesData, setCountriesData] = useRecoilState(countriesAtom);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = React.useState<File | null>(null);
  const [savedEmail,] = useState(user?.email);
  const ref = useRef<any>();
  const ref2 = useRef<any>();
  const [selectedDept, setSelectedDept] = useState<string[]>([]);

  // const [user, setUser] = useState<IUser | undefined>()

  // useMemo(() => setUser(inc), [inc, user])

  const {
    add,
    edit: firebaseEdit,
    getOnce,
    makeUpload,
    getUrl,
    deleteData,
  } = useFirebase();
  const { sendEmail } = useSendGrid();

  const resetData = () => {
    setFiles(null);
    setLoading(false);
    values.email = '';
    values.fullName = '';
    values.region = 'Nigeria';
    values.isActive = 'false';
    values.role = '';
    values.dept = [];
  };

  const onUpdate = async ({
    email,
    fullName,
    isActive,
    region,
    role,
    dept,
  }: {
    fullName: string;
    email: string;
    region: string;
    file?: string;
    role: IUserRoles | '';
    dept: IUserDept[];
    isActive: string;
  }) => {

    setLoading(true);

    const payload: Omit<IUser, 'terms' | 'createdAt'> = {
      email,
      fullName,
      region,
      isActive: isActive === 'true' ? true : false,
      role: role as IUserRoles,
      dept: dept as IUserDept[],
    };

    const check = savedEmail === email;

    if (!check && savedEmail) {

      try {
        const exists = await getOnce({ col: 'users', id: user?.id });
        if (exists) {
          setLoading(false);
          return;
        }
      } catch (error) { }
    }

    if (files) {
      try {
        const res: any = await makeUpload({
          file: files,
          fileName: email,
          folder: 'profileImages',
          uniqueName: email,
        });
        payload.storedImageFolder = res.folder;
        payload.storedImageName = res.filename;
        const imageUrl: any = await getUrl({
          filename: res.filename,
          folder: res.folder,
        });
        payload.avatar = imageUrl;
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    try {
      if (!savedEmail) {
        const randomPassword = String(random(100000000));
        await deleteData({
          col: 'users',
          id: user?.id as string,
        });

        handleAddNewUser(
          {
            ...payload,
            terms: true,
            password: bcrypt.hashSync(randomPassword),
            createdAt: DateTime.now().toISO(),
          },
          email,
          randomPassword
        );
        ref.current.click();
        setLoading(false);
        return;
      }
      await firebaseEdit({
        col: 'users',
        data: payload,
        id: user?.id,
      });
      ref.current.click();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onSubmit = async ({
    email,
    fullName,
    isActive,
    region,
    role,
    dept,
  }: {
    fullName: string;
    email: string;
    region: string;
    file?: string;
    role: IUserRoles | '';
    dept: IUserDept[] | [];
    isActive: string;
  }) => {
    if (!files) {
      errors.file = 'Please upload a file';
      return;
    }
    setLoading(true);

    const randomPassword = String(random(100000000));

    const payload: IUser = {
      email,
      fullName,
      region,
      terms: true,
      isActive: isActive === 'true' ? true : false,
      role: role as IUserRoles,
      dept: selectedDept as IUserDept[],
      password: bcrypt.hashSync(randomPassword),
      createdAt: DateTime.now().toISO(),
    };

    try {
      const exists = await getOnce({ col: 'users', id: email });

      if (!exists) {
        const res: any = await makeUpload({
          file: files,
          fileName: email,
          folder: 'profileImages',
          uniqueName: email,
        });
        payload.storedImageFolder = res.folder;
        payload.storedImageName = res.filename;
        const imageUrl: any = await getUrl({
          filename: res.filename,
          folder: res.folder,
        });
        payload.avatar = imageUrl;

        handleAddNewUser(payload, email, randomPassword);

        ref.current.click();

        resetData();
      } else {
        setLoading(false);
        errors.email = 'Email already exists';
      }
    } catch (error) {
      setLoading(false);
      console.error({ error });
    }
  };

  const handleAddNewUser = async (
    payload: IUser,
    email: string,
    randomPassword: string
  ) => {
    await add({
      col: 'users',
      data: payload,
      id: email,
    });

    await sendEmail({
      to: email,
      subject: 'Scribbler Account Created Successfully',
      html: `
      <div style="font-family: Arial;">
        <h1 style="text-align: center; color: #2480CA;">Scribbler account created on your behalf</h1>

        <p style="font-size: 1.1em; color: black;">An account has been created on Scribbbler for this email</p>
  
        <p style="font-size: 1.1em; color: black;">Follow the link below to login. <strong>Your password is <span style='display: block; font-size: 2em; padding: 1em 2em; border: 1px solid black;'>${randomPassword}</span> </strong></p>
  
        <a href="${getEnv(
        'SCRIBBBLE_URL'
      )}/login" style="font-size: 1em; font-weight: 600; text-decoration: none; background-color: #2480CA; padding: 1em; color: white; margin-top: 1em; display: block; max-width: fit-content;">Login Here</a>
      </div>
      `,
    });
  };

  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: user?.email ?? '',
      fullName: user?.fullName ?? user?.name ?? '',
      region: user?.region ?? 'Nigeria',
      isActive: user?.isActive ? 'true' : 'false',
      role: user?.role ?? '',
      dept: user?.dept ?? [],
    },
    validationSchema: usersSchema,
    onSubmit: edit ? onUpdate : onSubmit,
  });

  const getCountries = async () => {
    try {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      setCountriesData(res.data);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  useEffectOnce(() => {
    if (countriesData.length > 0) return;
    getCountries();
    console.log('ssa');
  });

  const handleCheckChange = (isChecked: boolean, value: string) => {
    const check = selectedDept.some((el) => el === value);
    if (!isChecked && check) {
      let arr = selectedDept.filter((el) => el !== value);
      setSelectedDept(arr);
    }

    if (isChecked && !check) {
      setSelectedDept((prev) => [...prev, value]);
    }
  };


  // useEffect(() => {
  //   if(edit && user) {
  //     console.log('ffdf')
  //     values.email = user.email
  //     values.fullName  = user.fullName ?? user.name
  //     values.isActive = user.isActive ? 'true' : 'false'
  //     values.region = user.region ?? 'Nigeria'
  //     values.role = user.role ?? 'author'
  //   }

  // }, [edit, user, values])

  return (
    <>
      <form
        noValidate
        className="px-4 mt-4 flex flex-col pb-4 gap-y-3 overflow-auto"
        onSubmit={handleSubmit}
      >
        <Input
          type={'text'}
          label="Full Name"
          name="fullName"
          required
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
        />

        <Input
          type={'email'}
          label="Email"
          name="email"
          placeholder="mail@simmmple.com"
          required
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <Input
          type={'select'}
          label="Department"
          name="dept"
          required
          selectData={userDeptData}
          value={values.dept}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Select a department"
          error={errors.dept}
        />

        {/* <div className="form-input">
          <div className="label">Department</div>
          <div className="input-area">
            <CustomPopover placeholder="Select a department">
              <div
                className="flex-content"
                style={{
                  maxHeight: "10rem",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "5px",
                  padding: "10px",
                }}
              >
                {userDeptData.map((el, i) => (
                  <div key={i}>
                    <label htmlFor={`chwmssm${i}`} style={{ backgroundColor: "", width: "100%" }}>
                      <Checkbox
                        id={`chwmssm${i}`}
                        size={"small"}
                        // checked={selectedDept.some((el2) => el === el2)}
                        style={{ padding: "0" }}
                        defaultChecked={false}
                        onChange={(e) => handleChange(e.target.checked, )}
                      />{" "}
                      <span style={{ fontSize: "13px" }}>{el.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </CustomPopover>
          </div>
        </div> */}

        <Input
          type={'select'}
          label="Role"
          name="role"
          required
          selectData={sortArrayObjectsBaseOnString(userRolesData)}
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Select a role"
          error={errors.role}
        />

        <Input
          type={'select'}
          label="Region/Country"
          name="region"
          required
          selectData={sortArrayObjectsBaseOnString(
            countriesData.map((country: any) => ({
              name: `${country.name.common}`,
              value: country.name.common,
            }))
          )}
          value={values.region}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.region}
        />

        <Input
          type={'select'}
          label="Active"
          name="isActive"
          required
          selectData={sortArrayObjectsBaseOnString([
            {
              name: 'True',
              value: true,
            },
            {
              name: 'False',
              value: false,
            },
          ])}
          value={values.isActive}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.isActive}
        />

        <Input
          type={'file'}
          label={'Upload Image'}
          required
          value={values.file}
          onChange={e => {
            if (e.target.files) {
              setFiles(e.target.files[0]);
            } else {
              errors.file = 'Please upload a file';
            }
          }}
          onBlur={handleBlur}
          error={errors.file}
          name={'file'}
        />

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          primary
          fullWidth
          className={clsx('font-normal shrink-0')}
        >
          {edit ? 'Update User' : 'Add User'}
        </Button>
      </form>

      <Modal loadOnOpen id={'reset'} content={<>Are you sure</>}>
        <a href="#" ref={ref2}></a>
      </Modal>
      <a href="#" data-bs-dismiss="modal" ref={ref}></a>
    </>
  );
};

export default AddUsers;
