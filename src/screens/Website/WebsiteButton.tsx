import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'marketing';

type BaseProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };

type LinkProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string;
    href?: undefined;
  };

type ExternalLinkProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: undefined;
  };

const styles: Record<Variant, string> = {
  primary:
    'inline-flex items-center justify-center min-h-[52px] px-7 rounded-full bg-brand-orange text-white hover:text-white hover:bg-brand-navy text-base font-extrabold shadow-brand-orange website-btn-lift transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-orange focus-visible:outline-offset-[3px]',
  secondary:
    'inline-flex items-center justify-center min-h-[52px] px-7 rounded-full bg-brand-navy text-white hover:text-white hover:bg-brand-orange border-2 border-brand-navy text-base font-extrabold website-btn-lift transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-orange focus-visible:outline-offset-[3px]',
  ghost:
    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-brand-navy font-semibold hover:text-brand-blue focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-orange focus-visible:outline-offset-[3px]',
  marketing:
    'inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-brand-orange text-white hover:bg-brand-navy hover:text-white font-extrabold text-base shadow-brand-orange-sm transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-orange focus-visible:outline-offset-[3px]',
};

export default function WebsiteButton(props: ButtonProps | LinkProps | ExternalLinkProps) {
  const { variant = 'primary', className, children } = props;
  const cn = clsx(styles[variant], className);

  if ('to' in props && props.to) {
    const { to, ...rest } = props as LinkProps;
    return (
      <Link to={to} className={cn} {...rest}>
        {children}
      </Link>
    );
  }
  if ('href' in props && props.href) {
    const { href, ...rest } = props as ExternalLinkProps;
    return (
      <a href={href} className={cn} {...rest}>
        {children}
      </a>
    );
  }
  const { ...rest } = props as ButtonProps;
  return (
    <button type="button" className={cn} {...rest}>
      {children}
    </button>
  );
}
