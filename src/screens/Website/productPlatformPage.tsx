import React from 'react';
import WebsiteLayout from './WebsiteLayout';
import ProductWebMain from './productWebMain';
import ProductMobileMain from './productMobileMain';
import ProductDesktopMain from './productDesktopMain';
import ProductVoiceMain from './productVoiceMain';

export type ProductPlatform = 'web' | 'mobile' | 'desktop' | 'voice';

type Props = { platform: ProductPlatform };

const MAINS = {
  web: ProductWebMain,
  mobile: ProductMobileMain,
  desktop: ProductDesktopMain,
  voice: ProductVoiceMain,
} as const;

export default function ProductPlatformPage({ platform }: Props): JSX.Element {
  const Main = MAINS[platform];
  return (
    <WebsiteLayout>
      <Main />
    </WebsiteLayout>
  );
}
