import React from 'react';
import { useRecoilValue } from 'recoil';
import { forgotPasswordEmailAtom } from 'store/atoms/general';
import { LoginRoute } from '../../navigation/routes';
import AuthTitle from '../AuthTitle';
import Button from '../Button';
// import style from './styles.module.scss';

export interface IEmailSent {}

const EmailSent: React.FunctionComponent<IEmailSent> = () => {
  const email = useRecoilValue(forgotPasswordEmailAtom)
  return (
    <div className="flex items-center justify-center flex-col my-auto">
      <div className="max-w-[480px] w-full ">
        <AuthTitle
          title="Email Instruction Sent!!"
          subtitle={
            <>
              <p className="mb-4">
                Please follow the instruction sent to your email.
              </p>
              <p className="font-semibold">{email}</p>
            </>
          }
        />

        <Button fullWidth primary className="mt-10" type="link" to={LoginRoute}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default EmailSent;
