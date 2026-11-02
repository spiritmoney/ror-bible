import React from 'react';
import { ReactComponent as Spinner } from '../../assets/spinner.svg';
import clsx from 'clsx';

export interface ISuspenseLoader {
  fullscreen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const SuspenseLoader: React.FunctionComponent<ISuspenseLoader> = ({
  fullscreen = false,
  children,
  className,
}) => {
  return (
    <div className={clsx('suspenseLoader', { 'flex justify-center items-center min-h-screen' : fullscreen }, className)}>
      <>
        <Spinner className='w-14 h-14 mr-2 text-gray-200 animate-spin dark:text-gray-500 fill-primary'  />
        {children}
      </>
    </div>
  );
};

export default SuspenseLoader;
