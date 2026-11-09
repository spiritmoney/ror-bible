import React from 'react';
import { STORE_URLS } from 'config/storeLinks';
import WebsiteStoreAnchor from './WebsiteStoreAnchor';
import lwStore from '../../assets/website/new/loveworld-app-store.png';
import googlePlay from '../../assets/website/new/google-play.png';
import appStore from '../../assets/website/new/app-store.png';

type Props = {
  wrapperClassName?: string;
  buttonClassName?: string;
};

export default function MarketingStoreBadgeRow({
  wrapperClassName = 'u230928',
  buttonClassName = 'btn-lift u466af7',
}: Props) {
  return (
    <div className={wrapperClassName}>
      <WebsiteStoreAnchor href={STORE_URLS.loveworld} className={buttonClassName}>
        <img className="ue0f809" src={lwStore} alt="" />
        <span className="uad67f1">
          <span className="u7103c4">Get it on</span>
          <span className="uc7be1b">Loveworld App Store</span>
        </span>
      </WebsiteStoreAnchor>
      <WebsiteStoreAnchor href={STORE_URLS.googlePlay} className={buttonClassName}>
        <img className="ue0f809" src={googlePlay} alt="" />
        <span className="uad67f1">
          <span className="u7103c4">Get it on</span>
          <span className="uc7be1b">Google Play</span>
        </span>
      </WebsiteStoreAnchor>
      <WebsiteStoreAnchor href={STORE_URLS.appStore} className={buttonClassName}>
        <img className="ue0f809" src={appStore} alt="" />
        <span className="uad67f1">
          <span className="u7103c4">Download on the</span>
          <span className="uc7be1b">App Store</span>
        </span>
      </WebsiteStoreAnchor>
    </div>
  );
}
