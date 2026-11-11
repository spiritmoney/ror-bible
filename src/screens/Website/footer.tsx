import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
} from './websitePaths';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';
import { isAppShell } from 'utils/appShell';

type FooterLinkItem = {
  label: string;
  to?: string;
  href?: string;
  placeholder?: boolean;
};

function FooterLink({ item, className }: { item: FooterLinkItem; className: string }) {
  if (item.to) {
    return (
      <Link className={className} to={item.to}>
        {item.label}
      </Link>
    );
  }
  if (item.href) {
    return (
      <a className={className} href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }
  return (
    <a className={className} href="#" onClick={(e) => e.preventDefault()}>
      {item.label}
    </a>
  );
}

function FooterColumn({
  title,
  primary,
  extra,
}: {
  title: string;
  primary: FooterLinkItem[];
  extra: FooterLinkItem[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasExtra = extra.length > 0;

  return (
    <div className={`uc56752${open ? ' uc56752--open' : ''}${hasExtra ? ' uc56752--collapsible' : ''}`}>
      <h3 className="u902935">
        {hasExtra ? (
          <button
            type="button"
            className="u-footer-col-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {title}
          </button>
        ) : (
          title
        )}
      </h3>
      <div id={panelId} className="u-footer-col-panel">
        {primary.map((item) => (
          <FooterLink key={`${title}-${item.label}`} item={item} className="u8c9a26" />
        ))}
        {extra.map((item) => (
          <FooterLink
            key={`${title}-extra-${item.label}`}
            item={item}
            className={`u8c9a26 u8c9a26--extra${open ? ' is-visible' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const appShell = isAppShell();

  return (
    <footer className="u6971eb">
      <div className="uad67f1" aria-hidden="true">
        <div className="u3e339b" />
        <div className="u1584b2" />
        <div className="u7c48ed" />
      </div>
      <div className="wrap uf37b3e">
        <div className="u1fd187">
          <Link className="lockup u8092d7" to={appShell ? '/bible-online' : '/home'} aria-label="ROR Bible+ home">
            <img className="u2ab49f" src={icon} alt="" />
            <span className="u55f5af">
              <span className="ub6a52a">ROR Bible+</span>
              <span className="u329d23">Premium Bible Reader</span>
            </span>
          </Link>
          <p className="u5fe755">Read. Study. Meditate. Triumph.</p>
        </div>
        {!appShell && (
          <div className="uf3b8e2">
            <FooterColumn
              title="Products"
              primary={[
                { label: 'ROR Bible+ Web', to: '/bible-online' },
                { label: 'ROR Bible+ Mobile', to: WebsiteProductMobileRoute },
                { label: 'ROR Bible+ Desktop', to: WebsiteProductDesktopRoute },
              ]}
              extra={[
                { label: 'ROR Bible+ Voice', to: WebsiteProductVoiceRoute },
                { label: '@MySpot: Digital Evangelism', placeholder: true },
                { label: 'RORK Bible for Kids', placeholder: true },
                { label: 'Teevo Bible for Teens', placeholder: true },
              ]}
            />
            <FooterColumn
              title="About ROR Bible+"
              primary={[
                { label: 'Mission', to: '/about#mission' },
                { label: 'Stories', to: '/about#stories' },
              ]}
              extra={[
                { label: 'Careers', to: '/about#careers' },
                { label: 'Global Hubs', to: '/about#hub' },
                { label: 'Bible Translation', to: '/about#bible' },
                { label: 'Press', to: '/about#press' },
              ]}
            />
            <FooterColumn
              title="Partners"
              primary={[
                { label: 'Bible Partner', to: '/partner#ror_bible_partners' },
                { label: 'Give', to: '/give' },
              ]}
              extra={[
                { label: 'Content Partner', to: '/partner#content_partners' },
                { label: 'Churches', to: '/partner#churches' },
                { label: 'Volunteers', to: '/partner#volunteers' },
              ]}
            />
            <FooterColumn
              title="Follow us"
              primary={[
                { label: 'KingsChat', href: 'https://www.kingchat.online' },
                { label: 'CeFlix', placeholder: true },
              ]}
              extra={[]}
            />
          </div>
        )}
      </div>
      <div className="ua95fd4">
        <div className="wrap u94c3c2">
          <span>© 2026 ROR Bible+. All rights reserved.</span>
          <span className="ub77529">
            <a className="uc0e2c3" href="#" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a className="uc0e2c3" href="#" onClick={(e) => e.preventDefault()}>
              Terms of Use
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
