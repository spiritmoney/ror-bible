import React from 'react';
import clsx from 'clsx';

type Props = {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
  /** Default vertical section padding matching reference site */
  pad?: 'default' | 'hero' | 'tight';
};

export default function Section({
  id,
  className,
  innerClassName,
  children,
  pad = 'default',
}: Props) {
  const padClass =
    pad === 'hero'
      ? 'py-10 website-sm:py-[40px] website-sm:pb-[110px]'
      : pad === 'tight'
        ? 'py-10'
        : 'py-16 website-sm:py-[52px]';

  return (
    <section id={id} className={clsx(padClass, className)}>
      <div className={clsx('max-w-website mx-auto px-8 website-sm:px-4', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
