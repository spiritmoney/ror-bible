import React from 'react';
import WebsiteLayout from './WebsiteLayout';
import PageHero from './PageHero';
import WebsiteButton from './WebsiteButton';
import { WebsiteDownloadRoute, WebsitePricingRoute } from './websitePaths';
import bibleOnline from '../../assets/website/new/bible-online-reader.jpg';
import f01 from '../../assets/website/new/feature-01-personalized-study.jpg';
import f02 from '../../assets/website/new/feature-02-solution-search.jpg';
import {
  WebsiteProductAlsoAvailable,
  WebsiteProductInstallPwa,
  WebsiteProductWhatYouGet,
} from './WebsiteProductSections';

export type ProductPlatform = 'web' | 'mobile' | 'desktop' | 'voice';

const PLATFORM_COPY: Record<
  ProductPlatform,
  { eyebrow: string; title: React.ReactNode; description: string; bullets: string[]; image: string; imageAlt: string }
> = {
  web: {
    eyebrow: 'ROR Bible+ Web',
    title: (
      <>
        Open your browser. Open <span className="text-brand-orange">the Word.</span>
      </>
    ),
    description: 'Bible Online and Bible Lite (PWA) for reading and study in the browser.',
    bullets: ['Bible Online reader', 'Bible Lite progressive web app', 'Sync with your ROR Bible+ account'],
    image: bibleOnline,
    imageAlt: 'ROR Bible+ Web reader',
  },
  mobile: {
    eyebrow: 'ROR Bible+ Mobile',
    title: (
      <>
        The Word <span className="text-brand-orange">wherever you go.</span>
      </>
    ),
    description: 'Android and iOS apps for reading, study and ministry on the move.',
    bullets: ['Android and iOS', 'Offline downloads where available', 'Personalized study experience'],
    image: f01,
    imageAlt: 'ROR Bible+ Mobile app',
  },
  desktop: {
    eyebrow: 'ROR Bible+ Desktop',
    title: (
      <>
        More room for <span className="text-brand-orange">deeper study.</span>
      </>
    ),
    description: 'MacOS, Windows and Linux clients for extended study sessions.',
    bullets: ['MacOS, Windows and Linux', 'Expanded workspace layouts', 'Study resources and parallel views'],
    image: bibleOnline,
    imageAlt: 'ROR Bible+ Desktop',
  },
  voice: {
    eyebrow: 'ROR Bible+ Voice',
    title: (
      <>
        Speak. Listen. Engage with <span className="text-brand-orange">the Word.</span>
      </>
    ),
    description: 'Amazon Alexa and Google Home experiences for hands-free engagement.',
    bullets: ['Amazon Alexa', 'Google Home', 'Listen and explore with voice commands'],
    image: f02,
    imageAlt: 'ROR Bible+ Voice',
  },
};

type Props = { platform: ProductPlatform };

export default function ProductPlatformPage({ platform }: Props): JSX.Element {
  const copy = PLATFORM_COPY[platform];

  return (
    <WebsiteLayout>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          <>
            <WebsiteButton to={WebsiteDownloadRoute}>Get the app</WebsiteButton>
            <WebsiteButton to={WebsitePricingRoute} variant="secondary">
              See pricing
            </WebsiteButton>
          </>
        }
      />
      <WebsiteProductWhatYouGet bullets={copy.bullets} image={copy.image} imageAlt={copy.imageAlt} />
      {platform === 'web' ? <WebsiteProductInstallPwa /> : null}
      <WebsiteProductAlsoAvailable platform={platform} />
    </WebsiteLayout>
  );
}
