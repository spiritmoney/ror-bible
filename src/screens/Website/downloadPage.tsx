import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import DownloadMain from './downloadMain';
import { scrollToHash } from '../../utils/scrolToHash';
import { HEADER_HEIGHT, HEADER_HEIGHT_COMPACT } from './constants';

type DownloadPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

export default function DownloadPage({
  isModal = false,
  onClose,
}: DownloadPageProps): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.toLowerCase();
    if (hash !== '#contact' && hash !== 'contact') {
      return;
    }
    void scrollToHash('#contact', {
      headerOffset: isModal ? HEADER_HEIGHT_COMPACT : HEADER_HEIGHT,
      behavior: 'smooth',
      maxAttempts: 30,
      retryDelay: 100,
    });
  }, [isModal, location.hash]);

  if (isModal) {
    return (
      <WebsiteLayout isModal onClose={() => (onClose ? onClose() : window.history.back())}>
        <DownloadMain />
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <DownloadMain />
    </WebsiteLayout>
  );
}
