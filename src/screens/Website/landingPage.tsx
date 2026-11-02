import React from 'react';
import WebsiteLayout from './WebsiteLayout';
import HomeMain from './homeMain';

export default function LandingPage(): JSX.Element {
  return (
    <WebsiteLayout>
      <HomeMain />
    </WebsiteLayout>
  );
}
