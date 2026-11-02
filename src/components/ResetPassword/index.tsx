import { LoginRoute } from 'navigation/routes';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthTitle from '../AuthTitle';
import Button from '../Button';
import Input from '../Input';
import { useEncrypt } from 'hooks/useEncrypt';
import { useFormik } from 'formik';
import { resetPasswordSchema } from 'config/authSchema';
import { useFirebase } from '../../hooks/useFirebase';
import bcrypt from 'bcryptjs';
import { DateTime } from 'luxon';
// import style from './styles.module.scss';

export interface IResetPassword {}

const ResetPassword: React.FunctionComponent<IResetPassword> = () => {
  const [loading, setLoading] = useState(false);
  const [otpData, setOtpData] = useState<{
    email: string;
    otp: string;
  } | null>(null);
  const [search] = useSearchParams();
  const token = search.get('jwt');
  const navigate = useNavigate();
  const { decrypt } = useEncrypt();
  const { getOnce, edit } = useFirebase();

  useEffect(() => {
    if (!token) return navigate(LoginRoute);
    const tokenData = decrypt(token);
    setOtpData(tokenData as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, token]);

  const onSubmit = async ({
    password,
  }: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);

    try {
      const user: any = await getOnce({ col: 'users', id: otpData?.email });

      const check =
        DateTime.now().toMillis() >
        DateTime.fromISO(user?.otpExpiresIn).toMillis();
        
      if (check) {
        errors.confirmPassword = 'Token expired';
        setLoading(false);
        return;
      }

      await edit({
        col: 'users',
        id: otpData?.email,
        data: {
          password: bcrypt.hashSync(password),
        },
      });

      navigate(LoginRoute);
    } catch (error) {
      setLoading(false);
    }
  };

  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit,
  });

  return (
    <div className="flex items-center justify-center flex-col my-auto">
      <div className="max-w-[480px] w-full ">
        <AuthTitle
          title="Reset Password"
          subtitle={
            <>
              <p className="mb-4">
                Minimium 8 character. Must contain upper and
              </p>
              <p>lowercase, numbers and symbols</p>
            </>
          }
        />

        <form
          noValidate
          action=""
          className="mt-[2.8125rem] flex flex-col gap-y-[1.25rem]"
          onSubmit={handleSubmit}
        >
          <Input
            type={'password'}
            label="Password"
            name="password"
            required
            value={values.password}
            placeholder="Min. 8 characters"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />
          <Input
            type={'password'}
            label="Confirm Password"
            name="confirmPassword"
            required
            value={values.confirmPassword}
            placeholder="Min. 8 characters"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            className="mb-[2.2rem]"
          />

          <Button
            type="submit"
            fullWidth
            primary
            loading={loading}
            disabled={loading}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
