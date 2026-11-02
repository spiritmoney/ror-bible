import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';
// import style from './styles.module.scss';

// import { ReactComponent as Spinner } from '../../assets/button-spinner.svg';

export interface IButton {
  primary?: boolean;
  light?: boolean;
  danger?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
  small?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconAfter?: any;
  iconBefore?: any;
  removeSpinnerMargin?: boolean
  children?: any;
  className?: string;
  type?: 'button' | 'link' | 'submit';
  to?: string;
  onClick?: (event?: React.FormEvent<Element>) => void;
}

const Button = React.forwardRef(
  (
    {
      type,
      loading,
      iconAfter,
      iconBefore,
      disabled,
      children,
      light,
      className,
      primary,
      removeSpinnerMargin,
      fullWidth,
      secondary,
      small,
      danger,
      to,
      ...props
    }: IButton,
    ref
  ) => {
    const inClassName = clsx(
      'flex items-center justify-center rounded-lg px-3 h-12 font-raleway text-lg ',
      { 'bg-primary text-white': primary },
      { 'w-full': fullWidth },
      {
        'px-3 h-12  text-lg': !small,
        'pt-[.5313rem] pb-[.4688rem] px-[.625rem]': small,
      },
      {
        'shadow-[inset_0_0_0_1px_#BFBFBF] rounded-[5px] text-bf-grey': light,
      },
      { 'bg-dark-blue rounded-[5px] text-white': secondary },
      { ' bg-danger text-white': danger },
      className
    );
    return type === 'link' && to ? (
      <Link to={to} className={inClassName}>
        <>
          {loading && <Spinner className={clsx(" w-6 h-6  ", { 'mr-3 -ml-1': !removeSpinnerMargin })} />}
          {iconBefore && (
            <div
              className={clsx('mr-5 empty:hidden', { 'mr-[.625rem]': small })}
            >
              {iconBefore}
            </div>
          )}
          {children}
          {iconAfter && (
            <div className={clsx('ml-2 empty:hidden')}>{iconAfter}</div>
          )}
        </>
      </Link>
    ) : (
      <button
        ref={ref as any}
        type={type === 'submit' ? 'submit' : undefined}
        disabled={disabled}
        {...props}
        // This is suppose to be = inClassName but my tailwind intellisense only works on actuall classNames not variable
        className={clsx(
          'flex items-center justify-center rounded-lg font-raleway  disabled:bg-gray-500',
          { 'bg-primary text-white': primary },
          { 'w-full': fullWidth },
          {
            'px-3 h-12 text-lg': !small,
            'pt-[.5313rem] h-[1.875rem] pb-[.4688rem] px-[.625rem] text-sm font-medium':
              small,
          },
          // { 'border border-bf-grey rounded-[5px] text-bf-grey': light },
          {
            'shadow-[inset_0_0_0_1px_#BFBFBF] rounded-[5px] text-bf-grey':
              light,
          },
          { 'bg-dark-blue rounded-[5px] text-white': secondary },
          { ' bg-danger text-white': danger },
          className
        )}
      >
        <>
          {loading && <Spinner className={clsx(" w-6 h-6 ", { 'mr-3 -ml-1': !removeSpinnerMargin })} />}
          {iconBefore && (
            <div
              className={clsx('mr-5 empty:hidden', { 'mr-[.625rem]': small })}
            >
              {iconBefore}
            </div>
          )}
          {children}
          {iconAfter && (
            <div className={clsx('ml-2 empty:hidden')}>{iconAfter}</div>
          )}
        </>
      </button>
    );
  }
);

export default Button;
