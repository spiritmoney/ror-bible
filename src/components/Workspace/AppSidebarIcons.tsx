import React from 'react';

const stroke = 1.75;

type IconProps = { className?: string };

export const SidebarMenuIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M4 7h16M4 12h16M4 17h10"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </svg>
);

export const SidebarLibraryIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4z"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
    <path
      d="M5 4v14a2 2 0 002 2h12"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarFavouritesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 20.5l-1.1-1C6.9 15.4 4 12.7 4 9.5a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 9.5c0 3.2-2.9 5.9-6.9 9.9l-1.1 1.1z"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarStoreIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2M5 8h14l-1 12H6L5 8z"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarDownloadsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 4v10m0 0l3.5-3.5M12 14l-3.5-3.5M6 18h12"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarAlertsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 4a4 4 0 00-4 4v2.5c0 .6-.2 1.2-.6 1.7L6 14h12l-1.4-1.8c-.4-.5-.6-1.1-.6-1.7V8a4 4 0 00-4-4z"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
    <path
      d="M10 17a2 2 0 004 0"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </svg>
);
