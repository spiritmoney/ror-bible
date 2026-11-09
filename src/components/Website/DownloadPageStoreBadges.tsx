import React from 'react';
import { STORE_URLS } from 'config/storeLinks';
import WebsiteStoreAnchor from './WebsiteStoreAnchor';
import lwStore from '../../assets/website/new/loveworld-app-store.png';
import googlePlay from '../../assets/website/new/google-play.png';
import appStore from '../../assets/website/new/app-store.png';

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

export default function DownloadPageStoreBadges() {
  return (
    <>
      <WebsiteStoreAnchor href={STORE_URLS.loveworld} className="btn-lift u873fb7">
        <span className="u76317c">
          <img className="u0d77d9" src={lwStore} alt="" />
          Loveworld App Store
        </span>
        {arrowSvg}
      </WebsiteStoreAnchor>
      <WebsiteStoreAnchor href={STORE_URLS.googlePlay} className="btn-lift u873fb7">
        <span className="u76317c">
          <img className="u0d77d9" src={googlePlay} alt="" />
          Google Play
        </span>
        {arrowSvg}
      </WebsiteStoreAnchor>
      <WebsiteStoreAnchor href={STORE_URLS.appStore} className="btn-lift u873fb7">
        <span className="u76317c">
          <img className="u0d77d9" src={appStore} alt="" />
          App Store
        </span>
        {arrowSvg}
      </WebsiteStoreAnchor>
    </>
  );
}
