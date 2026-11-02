import React from 'react';
import { Link } from 'react-router-dom';
import BrandStripe from './BrandStripe';
import {
  WebsiteDownloadRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';

export default function Footer() {
  return (
    <footer className="mt-16 bg-white">
      <BrandStripe />
      <div className="max-w-website mx-auto px-8 website-sm:px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1">
          <Link to="/home" className="flex items-center gap-3" aria-label="ROR Bible+ home">
            <img src={icon} alt="" className="h-12 w-auto" />
            <span>
              <span className="block text-xl font-extrabold text-brand-blue">ROR Bible+</span>
              <span className="block text-sm font-medium text-brand-blue">Premium Bible Reader</span>
            </span>
          </Link>
          <p className="mt-4 text-sm font-semibold text-brand-navy">Read. Study. Meditate. Triumph.</p>
          <Link to={`${WebsiteDownloadRoute}#support`} className="block mt-3 text-sm text-brand-blue font-semibold">
            Technical support
          </Link>
          <Link to={`${WebsiteDownloadRoute}#contact`} className="block mt-2 text-sm text-brand-blue font-semibold">
            Contact us
          </Link>
          <Link to="/store" className="block mt-2 text-sm text-brand-blue font-semibold">
            Store
          </Link>
        </div>
        <FooterCol
          title="Products"
          links={[
            ['ROR Bible+ Web (Bible Online & Lite)', WebsiteProductWebRoute],
            ['ROR Bible+ Mobile', WebsiteProductMobileRoute],
            ['ROR Bible+ Desktop', WebsiteProductDesktopRoute],
            ['ROR Bible+ Voice', WebsiteProductVoiceRoute],
          ]}
        />
        <FooterCol
          title="About ROR Bible+"
          links={[
            ['Mission', '/about#mission'],
            ['Stories', '/about#stories'],
            ['Careers', '/about#careers'],
            ['Global Hubs', '/about#hub'],
            ['Bible Translation', '/about#bible'],
            ['Press', '/about#press'],
          ]}
        />
        <FooterCol
          title="Partners"
          links={[
            ['Content Partner', '/partner#content'],
            ['Bible Partner', '/partner#ror_bible_partners'],
            ['Churches', '/partner#churches'],
            ['Volunteers', '/partner#volunteers'],
            ['Give', '/give'],
          ]}
        />
        <FooterCol
          title="Follow us"
          links={[
            ['KingsChat', 'https://www.kingchat.online'],
            ['CeFlix', '#'],
            ['Blog', 'https://blog.rorbible.plus'],
          ]}
          external
        />
      </div>
      <div className="border-t border-brand-mist py-4">
        <div className="max-w-website mx-auto px-8 website-sm:px-4 flex flex-wrap justify-between gap-2 text-sm text-brand-ink">
          <span>© 2026 ROR Bible+. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="font-semibold text-brand-blue">
              Privacy
            </a>
            <a href="#" className="font-semibold text-brand-blue">
              Terms of Use
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  external,
}: {
  title: string;
  links: [string, string][];
  external?: boolean;
}) {
  return (
    <div>
      <h3 className="text-base font-extrabold text-brand-navy mb-3">{title}</h3>
      <div className="flex flex-col gap-2">
        {links.map(([label, href]) =>
          external || href.startsWith('http') ? (
            <a key={label} href={href} className="text-sm font-semibold text-brand-blue hover:underline">
              {label}
            </a>
          ) : (
            <Link key={label} to={href} className="text-sm font-semibold text-brand-blue hover:underline">
              {label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
