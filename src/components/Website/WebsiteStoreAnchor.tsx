import React from 'react';
import { handleStoreExternalClick } from 'utils/storeLinkClick';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function WebsiteStoreAnchor({
  href,
  onClick,
  target = '_blank',
  rel = 'noopener noreferrer',
  children,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={(e) => {
        handleStoreExternalClick(href, e);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
