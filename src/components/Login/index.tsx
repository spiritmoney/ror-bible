import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as Kingschat } from '../../assets/kingschat.svg';
import AuthTitle from '../AuthTitle';
import Button from '../Button';
import Input from '../Input';
import {
  DashboardRoute,
  ForgetPasswordRoute,
  RegisterRoute,
} from '../../navigation/routes';
import { useFormik } from 'formik';
import { ILoginInputs } from '../../interface/auth';
import { useFirebase } from '../../hooks/useFirebase';
import bcrypt from 'bcryptjs';
import { useUser } from 'hooks/useUser';
import { DateTime } from 'luxon';
import { loginSchema } from 'config/authSchema';
import useKingsChat from 'hooks/useKingsChat';
import { useSetRecoilState } from 'recoil';
import { lockAtom } from 'store/atoms/general';
// import style from './styles.module.scss';
import useProjects from '../../hooks/useProjects';
import { projectAtom } from '../../store/atoms/workspace';

export interface ILogin {}

const Login: React.FunctionComponent<ILogin> = () => {
  const [loading, setLoading] = useState(false);
  const [kingschatLoading, setKingschatLoading] = useState(false);
  const navigate = useNavigate();
  const { getOnce } = useFirebase();
  const { saveUserInfo } = useUser();
  const { login } = useKingsChat();
  const setLock = useSetRecoilState(lockAtom);
  const setProject  = useSetRecoilState(projectAtom);

  const handleKingsChatLogin = () => {
    login(setKingschatLoading);
  };

  const onSubmit = async (value: ILoginInputs) => {
    setLoading(true);
    try {
      const user: any = await getOnce({ col: 'users', id: value.email });
      if (!user) {
        errors.email = 'User not found';
        setLoading(false);
        return;
      }

      if (!bcrypt.compareSync(value.password, user.password)) {
        errors.password = 'Invalid Password';
        setLoading(false);
        return;
      }

      if (!user.isActive) {
        errors.email = 'This account has not been activated';
        setLoading(false);
        return;
      }
      setLock(false);
      saveUserInfo({
        ...user,
        expiresAt: value.rememberMe
          ? DateTime.now().plus({ days: 5 }).toISO()
          : DateTime.now().plus({ hours: 5 }).toISO(),
      });
      setProject(null as any);
      navigate(DashboardRoute);
    } catch (error) {
      errors.rememberMe = 'Something went wrong, Please try again later';
      setLoading(false);
    }
  };

  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <div className="flex items-center justify-center flex-col my-auto">
      <div className="max-w-[480px] w-full ">
        <AuthTitle
          title="Login"
          subtitle={
            <>
              Dont Have an Account ?{' '}
              {/* <Link
                to={RegisterRoute}
                className="text-primary underline font-medium"
              >
                Create an account.
              </Link> */}
              <span
                className="text-primary underline font-medium cursor-pointer"
              >
                Create an account.
              </span>
            </>
          }
        />

        <form
          noValidate
          action="#"
          className="mt-[3.5rem] mb-[0.8rem] flex flex-col gap-y-[0.8rem]"
          onSubmit={handleSubmit}
        >
          <Input
            type={'email'}
            label="Email"
            required
            value={values.email}
            placeholder="mail@rorbible.com"
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            error={errors.email}
          />
          <Input
            type={'password'}
            label="Password"
            name="password"
            required
            placeholder="Your ROR Bible password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            error={errors.password}
          />
          <Input
            type={'checkbox'}
            label="Keep me logged in"
            name="rememberMe"
            className="mb-[0rem]"
            checkboxValue={values.rememberMe}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.rememberMe}
          />
          <Button
            className="font-light"
            fullWidth
            iconBefore={<Logo className="h-fit w-[25px] " />}
            primary
            loading={loading}
            disabled={loading}
          >
            Login with ROR Bible+
          </Button>
        </form>

        <Link
          to={ForgetPasswordRoute}
          className="block mx-auto w-fit underline text-primary text-[.9375rem] mb-[0.8rem]"
        >
          Forget Password?
        </Link>

        <Button
          className="font-light mb-[0.8rem]"
          fullWidth
          iconBefore={<Kingschat className="h-fit" />}
          primary
          onClick={handleKingsChatLogin}
          loading={kingschatLoading}
          disabled={kingschatLoading}
        >
          Login with KingsChat
        </Button>

        <p className="block mx-auto w-fit text-faded-black text-[.9375rem]">
          Don’t have an account ?{' '}
          <Link to={RegisterRoute} className="underline text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
