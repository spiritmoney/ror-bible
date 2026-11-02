import React from 'react';
import clsx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
  lift?: boolean;
  as?: 'div' | 'article' | 'a';
  href?: string;
  onClick?: () => void;
};

export default function Card({
  className,
  children,
  lift = true,
  as = 'div',
  href,
  onClick,
}: Props) {
  const cn = clsx(
    'rounded-[18px] bg-white',
    lift && 'website-card-lift',
    className
  );

  if (as === 'a' && href) {
    return (
      <a href={href} className={cn} onClick={onClick}>
        {children}
      </a>
    );
  }

  const Tag = as;
  return (
    <Tag className={cn} onClick={onClick}>
      {children}
    </Tag>
  );
}
