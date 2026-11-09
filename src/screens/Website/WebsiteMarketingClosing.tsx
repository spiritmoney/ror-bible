import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import { Eyebrow } from './PageHero';
import {
  WebsiteDownloadRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import { STORE_URLS } from 'config/storeLinks';
import WebsiteStoreAnchor from '../../components/Website/WebsiteStoreAnchor';
import lwStore from '../../assets/website/new/loveworld-app-store.png';
import googlePlay from '../../assets/website/new/google-play.png';
import appStore from '../../assets/website/new/app-store.png';

const PLATFORM_CARDS = [
  [WebsiteProductMobileRoute, 'ROR Bible+ Mobile', 'The Word wherever you go.', 'Android and iOS'],
  [WebsiteProductWebRoute, 'ROR Bible+ Web', 'Open your browser. Open the Word.', 'Bible Online and Bible Lite (PWA)'],
  [WebsiteProductDesktopRoute, 'ROR Bible+ Desktop', 'More room for deeper study.', 'MacOS, Windows and Linux'],
  [WebsiteProductVoiceRoute, 'ROR Bible+ Voice', 'Speak. Listen. Engage with the Word.', 'Amazon Alexa and Google Home'],
] as const;

export function WebsitePlatformBand() {
  return (
    <Section className="bg-brand-pale">
      <Eyebrow>Mobile · Web · Desktop · Voice</Eyebrow>
      <h2 className="mt-4 text-4xl font-extrabold text-brand-navy mb-10">
        One Bible experience. <span className="text-brand-orange">Four ways in.</span>
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORM_CARDS.map(([to, title, line, sub]) => (
          <Link
            key={to}
            to={to}
            className="website-card-lift block p-6 rounded-3xl bg-brand-navy text-white hover:text-white min-h-[220px] flex flex-col"
          >
            <span className="font-extrabold text-lg">{title}</span>
            <span className="mt-2 text-sm text-white/90 flex-1">{line}</span>
            <span className="text-xs text-brand-cyan mt-2">{sub}</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-orange">Explore →</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function WebsiteDownloadCtaBand() {
  return (
    <Section className="bg-brand-blue text-white">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-extrabold">
            Download ROR Bible+ and begin your next discovery in <span className="text-brand-cyan">the Word.</span>
          </h2>
          <p className="mt-3 text-white/85">Free to download. Some features and resources require a subscription.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {[
              [STORE_URLS.loveworld, lwStore, 'Loveworld App Store'],
              [STORE_URLS.googlePlay, googlePlay, 'Google Play'],
              [STORE_URLS.appStore, appStore, 'App Store'],
            ].map(([href, img, label]) => (
              <WebsiteStoreAnchor
                key={label}
                href={href}
                className="website-btn-lift flex items-center gap-3 bg-white text-brand-navy hover:text-brand-navy rounded-2xl px-4 py-3 min-w-[160px]"
              >
                <img src={img} alt="" className="h-10 w-auto" />
                <span className="text-sm font-bold">{label}</span>
              </WebsiteStoreAnchor>
            ))}
          </div>
          <Link to={WebsiteProductDesktopRoute} className="text-sm font-semibold text-brand-cyan hover:text-brand-cyan hover:underline">
            Also on MacOS, Windows and Linux →
          </Link>
        </div>
      </div>
    </Section>
  );
}

export function WebsiteMarketingClosing({ showPlatformBand = true }: { showPlatformBand?: boolean }) {
  return (
    <>
      {showPlatformBand ? <WebsitePlatformBand /> : null}
      <WebsiteDownloadCtaBand />
    </>
  );
}
