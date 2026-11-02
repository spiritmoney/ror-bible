import React from 'react';
import AuthTitle from '../AuthTitle';
import Button from '../Button';
import Input from '../Input';
import { useFirebase } from '../../hooks/useFirebase';
import { useFormik } from 'formik';
import { forgetPasswordSchema } from 'config/authSchema';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useEncrypt } from 'hooks/useEncrypt';
import { useSendGrid } from 'hooks/useSendGrid';
import { getEnv } from 'utils/general';
import { DateTime } from 'luxon';
import { EmailSentRoute } from 'navigation/routes';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { forgotPasswordEmailAtom } from 'store/atoms/general';
// import style from './styles.module.scss';

export interface IForgetPassword {}

const ForgetPassword: React.FunctionComponent<IForgetPassword> = () => {
  const [loading, setLoading] = useState(false);
  const setForgotPasswordEmail = useSetRecoilState(forgotPasswordEmailAtom)
  const navigate = useNavigate();
  const { getOnce, edit } = useFirebase();
  const { encrypt } = useEncrypt();
  const { sendEmail } = useSendGrid();

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      const user: any = await getOnce({ col: 'users', id: email });
      if (!user) {
        errors.email = 'Email not found';
        setLoading(false);
        return;
      }

      setForgotPasswordEmail(user.email)

      const otp = nanoid(6);

      const emailData = encrypt({
        email: user.email,
        otp,
      });

      await sendEmail({
        to: user.email,
        subject: 'Scribbbler Password Reset',
        html: `
        <div style="font-family: Arial;">
          <h1 style="text-align: center; color: #2480CA;">Scribbler Password Reset</h1>

          <p style="font-size: 1.1rem; color: black;">You are trying to reset your password on Scribbbler</p>
    
          <p style="font-size: 1.1rem; color: black;">Follow the link below to reset your password. <strong>Note this link expires in 20 minutes</strong></p>
    
          <a href="${getEnv('SCRIBBBLE_URL')}rp?jwt=${emailData}" style="font-size: 1rem; font-weight: 600; text-decoration: none; background-color: #2480CA; padding: 1em; color: white; margin-top: 1em; display: block; max-width: fit-content;">Reset Password Here</a>
        </div>
        `,
      });

      await edit({
        col: 'users',
        data: {
          otp: nanoid(6),
          otpExpiresIn: DateTime.now().plus({ minutes: 20 }).toISO(),
        },
        id: email,
      });

      navigate(EmailSentRoute);
    } catch (error) {
      errors.email = 'Something went wrong, Please try again later';
      console.error(error);
      setLoading(false);
    }
  };

  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgetPasswordSchema,
    onSubmit,
  });
  return (
    <div className="flex items-center justify-center flex-col my-auto">
      <div className="max-w-[480px] w-full ">
        <AuthTitle
          title="Forget Password "
          subtitle={
            <>
              <p className="mb-4">
                Please enter your registered email address we’ll
              </p>
              <p>send instructions to help reset your password</p>
            </>
          }
        />
        <form
          noValidate
          action=""
          className="mt-[2.8125rem] flex flex-col gap-y-[1.8rem]"
          onSubmit={handleSubmit}
        >
          <Input
            type={'email'}
            label="Email"
            name="email"
            placeholder="mail@scribbbler.com"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            error={errors.email}
          />

          <Button
            type="submit"
            fullWidth
            primary
            loading={loading}
            disabled={loading}
          >
            Send Reset Instructions
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
