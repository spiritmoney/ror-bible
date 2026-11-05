import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { isDesktopReleaseDownloadUrl } from 'config/storeLinks';
import { isElectron } from 'utils/general';

export function handleStoreExternalClick(
  href: string,
  event: MouseEvent<HTMLAnchorElement>
): void {
  if (!isElectron() || !window.electronAPI?.openExternal) return;
  event.preventDefault();
  void window.electronAPI.openExternal(href);
}

export function startDesktopDownloadNavigation(url: string): void {
  if (typeof window === 'undefined') return;
  if (isElectron() && window.electronAPI?.openExternal) {
    void window.electronAPI.openExternal(url);
    return;
  }
  window.location.assign(url);
}

export function handleDesktopDownloadClick(
  url: string,
  event: MouseEvent<HTMLAnchorElement>
): void {
  event.preventDefault();
  startDesktopDownloadNavigation(url);
}

export function externalAnchorProps(
  href: string
): Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'target' | 'rel' | 'onClick'
> {
  if (isDesktopReleaseDownloadUrl(href)) {
    return {
      href,
      onClick: (event) => handleDesktopDownloadClick(href, event),
    };
  }
  return {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: (event) => handleStoreExternalClick(href, event),
  };
}
