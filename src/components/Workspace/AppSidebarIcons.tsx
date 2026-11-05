import React from 'react';

const svgProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

type IconProps = { className?: string };

export const SidebarLibraryIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={24} height={24} viewBox="0 0 24 24" {...svgProps}>
    <path d="M5 4h4v16H5zM11 4h4v16h-4z" />
    <path d="m17 6.5 3.5 1-3.6 12.5-3.5-1z" />
  </svg>
);

export const SidebarFavouritesIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={24} height={24} viewBox="0 0 24 24" {...svgProps}>
    <path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8L3.6 9.6l5.8-.8z" />
  </svg>
);

export const SidebarStoreIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={24} height={24} viewBox="0 0 24 24" {...svgProps}>
    <path d="M3 4h2.5l2.2 11h10.5l2-8H6.5" />
    <circle cx={9} cy={19.5} r={1.2} />
    <circle cx={17} cy={19.5} r={1.2} />
  </svg>
);

export const SidebarDownloadsIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={24} height={24} viewBox="0 0 24 24" {...svgProps}>
    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
  </svg>
);

export const SidebarAlertsIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={24} height={24} viewBox="0 0 24 24" {...svgProps}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4" />
  </svg>
);

export const TopBarSearchIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={22} height={22} viewBox="0 0 24 24" {...svgProps}>
    <circle cx={11} cy={11} r={6.5} />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
