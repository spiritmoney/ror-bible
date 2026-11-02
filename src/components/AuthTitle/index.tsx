import React from 'react';
// import style from './styles.module.scss';

export interface IAuthTitle {
  title: string;
  subtitle: React.ReactNode;
}

const AuthTitle: React.FunctionComponent<IAuthTitle> = ({
  subtitle,
  title,
}) => {
  return (
    <div className=''>
      <h1 className='text-center font-semibold text-[2.1875rem] mb-2'>{title}</h1>
      <div className='text-input-border text-center font-light'>{subtitle}</div>
    </div>
  );
};

export default AuthTitle;
