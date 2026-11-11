import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

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

const baseClasses =
  'inline-flex items-center justify-center font-montserrat font-extrabold ds-btn-lift ds-focus-visible disabled:opacity-60 disabled:pointer-events-none';

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
    const sizeClasses = small
      ? 'min-h-[2.25rem] px-4 text-sm'
      : 'min-h-[3.25rem] px-7 text-base';

    const variantClasses = clsx(
      { 'w-full': fullWidth },
      {
        'rounded-full bg-brand-orange text-white shadow-brand-orange hover:text-white hover:bg-brand-navy transition-colors':
          primary,
      },
      {
        'rounded-full bg-brand-navy text-white border-2 border-brand-navy hover:text-white hover:bg-brand-orange transition-colors':
          secondary,
      },
      {
        'rounded-[5px] shadow-[inset_0_0_0_1px_#BFBFBF] text-brand-ink bg-white':
          light,
      },
      { 'rounded-full bg-danger text-white': danger },
      !primary && !secondary && !light && !danger && 'rounded-lg px-3 h-12'
    );

    const inClassName = clsx(baseClasses, sizeClasses, variantClasses, className);

    const content = (
      <>
        {loading && (
          <Spinner
            className={clsx('w-6 h-6', {
              'mr-3 -ml-1': !removeSpinnerMargin,
              'text-white': primary || secondary || danger,
              'text-brand-ink': light,
            })}
          />
        )}
        {iconBefore && (
          <div className={clsx('mr-5 empty:hidden', { 'mr-[.625rem]': small })}>
            {iconBefore}
          </div>
        )}
        {children}
        {iconAfter && <div className={clsx('ml-2 empty:hidden')}>{iconAfter}</div>}
      </>
    );

    return type === 'link' && to ? (
      <Link to={to} className={inClassName}>
        {content}
      </Link>
    ) : (
      <button
        ref={ref as any}
        type={type === 'submit' ? 'submit' : 'button'}
        disabled={disabled || loading}
        {...props}
        className={inClassName}
      >
        {content}
      </button>
    );
  }
);

export default Button;
