import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketingStoreBadgeRow from './MarketingStoreBadgeRow';
import DesktopDownloadButtons from './DesktopDownloadButtons';
import { DESKTOP_DOWNLOAD_URLS, STORE_URLS } from 'config/storeLinks';
import * as visitorOs from 'utils/visitorOs';

jest.mock('utils/appShell', () => ({
  isAppShell: () => false,
}));

describe('store buttons', () => {
  it('marketing badges use config hrefs', () => {
    render(
      <MemoryRouter>
        <MarketingStoreBadgeRow />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /loveworld app store/i })).toHaveAttribute(
      'href',
      STORE_URLS.loveworld
    );
    expect(screen.getByRole('link', { name: /google play/i })).toHaveAttribute(
      'href',
      STORE_URLS.googlePlay
    );
    const apple = screen.getByRole('link', { name: /download on the app store/i });
    expect(apple).toHaveAttribute('href', STORE_URLS.appStore);
  });

  it('primary desktop button navigates to the release URL', () => {
    jest.spyOn(visitorOs, 'readVisitorOs').mockReturnValue('windows');
    const assign = jest.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, assign },
    });

    render(
      <MemoryRouter>
        <div className="uc74f11">
          <DesktopDownloadButtons variant="download-page" />
        </div>
      </MemoryRouter>
    );

    const primary = screen.getByRole('link', { name: /download for windows/i });
    expect(primary).toHaveAttribute('href', DESKTOP_DOWNLOAD_URLS.windows);
    fireEvent.click(primary);
    expect(assign).toHaveBeenCalledWith(DESKTOP_DOWNLOAD_URLS.windows);
  });
});
