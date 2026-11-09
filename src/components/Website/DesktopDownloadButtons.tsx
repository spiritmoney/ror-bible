import React, { useMemo } from 'react';
import { DESKTOP_DOWNLOAD_URLS } from 'config/storeLinks';
import MarketingStoreBadgeRow from './MarketingStoreBadgeRow';
import DownloadPageStoreBadges from './DownloadPageStoreBadges';
import {
  detectMacCpuHint,
  readVisitorOs,
  type VisitorOs,
} from 'utils/visitorOs';
import { handleDesktopDownloadClick } from 'utils/storeLinkClick';
import macos from '../../assets/website/new/macos.png';
import windows from '../../assets/website/new/windows.png';
import linux from '../../assets/website/new/linux.png';

const arrowSvg = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#072233"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

type DesktopOsKey = 'windows' | 'macAppleSilicon' | 'macIntel' | 'linuxAppImage';

type DesktopButtonSpec = {
  key: DesktopOsKey;
  label: string;
  url: string;
  icon: string;
  productLabel: string;
};

const ALL_DESKTOP: DesktopButtonSpec[] = [
  {
    key: 'macAppleSilicon',
    label: 'macOS (Apple Silicon)',
    productLabel: 'MacOS (Apple Silicon)',
    url: DESKTOP_DOWNLOAD_URLS.macAppleSilicon,
    icon: macos,
  },
  {
    key: 'macIntel',
    label: 'macOS (Intel)',
    productLabel: 'MacOS (Intel)',
    url: DESKTOP_DOWNLOAD_URLS.macIntel,
    icon: macos,
  },
  {
    key: 'windows',
    label: 'Windows',
    productLabel: 'Windows',
    url: DESKTOP_DOWNLOAD_URLS.windows,
    icon: windows,
  },
  {
    key: 'linuxAppImage',
    label: 'Linux',
    productLabel: 'Linux',
    url: DESKTOP_DOWNLOAD_URLS.linuxAppImage,
    icon: linux,
  },
];

export type DesktopDownloadButtonsProps = {
  variant: 'download-page' | 'product-hero';
};

function planButtons(
  os: VisitorOs,
  macHint: ReturnType<typeof detectMacCpuHint>
): { primary: DesktopButtonSpec[]; secondary: DesktopButtonSpec[] } {
  if (os === 'other') {
    return {
      primary: [
        ALL_DESKTOP.find((b) => b.key === 'windows')!,
        ALL_DESKTOP.find((b) => b.key === 'macAppleSilicon')!,
        ALL_DESKTOP.find((b) => b.key === 'linuxAppImage')!,
      ],
      secondary: [ALL_DESKTOP.find((b) => b.key === 'macIntel')!],
    };
  }

  const macButtons = (): DesktopButtonSpec[] => {
    if (macHint === 'apple-silicon') {
      return [ALL_DESKTOP[0]];
    }
    if (macHint === 'intel') {
      return [ALL_DESKTOP[1]];
    }
    return [ALL_DESKTOP[0], ALL_DESKTOP[1]];
  };

  const win = ALL_DESKTOP.find((b) => b.key === 'windows')!;
  const linuxBtn = ALL_DESKTOP.find((b) => b.key === 'linuxAppImage')!;
  const macs = macButtons();

  if (os === 'windows') {
    return { primary: [win], secondary: [...macs, linuxBtn] };
  }
  if (os === 'linux') {
    return { primary: [linuxBtn], secondary: [win, ...macs] };
  }
  if (os === 'mac') {
    return { primary: macs, secondary: [win, linuxBtn] };
  }

  return { primary: ALL_DESKTOP, secondary: [] };
}

function DesktopAnchorDownloadPage({
  spec,
  secondary,
}: {
  spec: DesktopButtonSpec;
  secondary?: boolean;
}) {
  return (
    <a
      href={spec.url}
      className={secondary ? 'btn-lift u311bd0' : 'btn-lift u9c2843'}
      onClick={(e) => handleDesktopDownloadClick(spec.url, e)}
    >
      <span className="u76317c">
        <img className="u0d77d9" src={spec.icon} alt="" />
        Download for {spec.label}
      </span>
      {arrowSvg}
    </a>
  );
}

function DesktopAnchorProductHero({
  spec,
  secondary,
}: {
  spec: DesktopButtonSpec;
  secondary?: boolean;
}) {
  return (
    <a
      href={spec.url}
      className={secondary ? 'btn-lift u311bd0' : 'btn-lift u11b395'}
      onClick={(e) => handleDesktopDownloadClick(spec.url, e)}
    >
      <img className="ue0f809" src={spec.icon} alt="" />
      <span className="uad67f1">
        <span className="ubbc4dd">Download for</span>
        <span className="uc7be1b">{spec.productLabel}</span>
      </span>
    </a>
  );
}

export default function DesktopDownloadButtons({
  variant,
}: DesktopDownloadButtonsProps) {
  const os = useMemo(() => readVisitorOs(), []);
  const macHint = useMemo(
    () =>
      typeof navigator !== 'undefined'
        ? detectMacCpuHint(navigator.userAgent)
        : 'unknown',
    []
  );

  if (os === 'ios' || os === 'android') {
    if (variant === 'download-page') {
      return <DownloadPageStoreBadges />;
    }
    return <MarketingStoreBadgeRow />;
  }

  const { primary, secondary } = planButtons(os, macHint);

  if (variant === 'download-page') {
    return (
      <>
        {primary.map((spec) => (
          <DesktopAnchorDownloadPage key={spec.key} spec={spec} />
        ))}
        {secondary.map((spec) => (
          <DesktopAnchorDownloadPage
            key={`${spec.key}-secondary`}
            spec={spec}
            secondary
          />
        ))}
      </>
    );
  }

  return (
    <div className="u230928">
      {primary.map((spec) => (
        <DesktopAnchorProductHero key={spec.key} spec={spec} />
      ))}
      {secondary.map((spec) => (
        <DesktopAnchorProductHero
          key={`${spec.key}-secondary`}
          spec={spec}
          secondary
        />
      ))}
    </div>
  );
}
