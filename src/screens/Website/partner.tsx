import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import { scrollToHash } from '../../utils/scrolToHash';
import PageHero from './PageHero';
import WebsitePageMeta from './WebsitePageMeta';
import MarketingSourceBand from './MarketingSourceBand';
import PartnerTranslatorForm from './PartnerTranslatorForm';
import './appMarketingPages.css';

import partnerTranslator from '../../assets/partner/partnerTranslator.svg';
import partnerBible from '../../assets/partner/partnerBible.svg';
import partnerChurches from '../../assets/partner/partnerChurches.svg';
import partnerContent from '../../assets/partner/partnerContent.svg';

type PartnerPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const ROR_PARTNERS_TEXT =
  'To provide as many Bibles as we can, ROR Bible+ partners with generous copyright holders such as Bible publishers, Bible translators, and Bible societies. Discover the many ways that you can participate in the mission of our Bible partnership.';

const CHURCHES_TEXT =
  "ROR Bible+ offers free tools and resources to help churches engage their attenders with the Bible and with community. Find out how you can get more from the strengths your church already has, better equip your people to grow spiritually, and grow your church's potential to fulfill its mission.";

const CONTENT_TEXT =
  'To help people engage more with the Bible, ROR Bible+ Partners with organization and content creators that develop Bible-based devotional and study resources. Discover the benefits of getting you Bible-focused content in front of millions of Bible App users all over the world.';

export default function PartnerPage({
  isModal = false,
  onClose,
}: PartnerPageProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModal) return;
    const state = (location.state as { scrollTo?: string }) || {};
    const slug = state.scrollTo ?? (window.location.hash || undefined);
    if (!slug) return;
    const hash = slug.startsWith('#') ? slug : `#${slug}`;
    void scrollToHash(hash, {
      headerOffset: HEADER_HEIGHT,
      behavior: 'smooth',
      maxAttempts: 20,
      retryDelay: 80,
    });
  }, [location, isModal]);

  const PageInner = (
    <div className="website-root app-marketing-page bg-white text-brand-navy font-montserrat">
      <PageHero
        variant="flat"
        eyebrow="Partners"
        title={
          <>
            Work with <span className="text-brand-orange">ROR Bible+</span>
          </>
        }
        description={ROR_PARTNERS_TEXT}
      />

      <section className="mkt-section mkt-band-white">
        <div className="mkt-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            ['Content Partner', '#content_partners'],
            ['Bible Partner', '#ror_bible_partners'],
            ['Churches', '#churches'],
            ['Volunteers', '#volunteers'],
            ['Bible Translation', '#ror_bible_partners'],
          ].map(([label, href]) => (
            <a key={label} href={href} className="mkt-category-card no-underline">
              {label}
            </a>
          ))}
        </div>
      </section>

      <section id="volunteers" className="mkt-section mkt-band-alt">
        <div className="mkt-container mkt-split-56 mkt-split-top">
          <img src={partnerTranslator} alt="Be a Translator" className="mkt-src-img" loading="lazy" />
          <PartnerTranslatorForm />
        </div>
      </section>

      <MarketingSourceBand
        id="ror_bible_partners"
        tone="white"
        title="ROR Bible+ Partners"
        image={partnerBible}
        imageAlt="ROR Bible+ Partners"
      >
        <p className="mkt-body">{ROR_PARTNERS_TEXT}</p>
      </MarketingSourceBand>

      <MarketingSourceBand
        id="churches"
        tone="alt"
        title="Churches"
        image={partnerChurches}
        imageAlt="Churches"
      >
        <p className="mkt-body">{CHURCHES_TEXT}</p>
      </MarketingSourceBand>

      <MarketingSourceBand
        id="content_partners"
        tone="white"
        title="Content Partners"
        image={partnerContent}
        imageAlt="Content Partners"
      >
        <p className="mkt-body">{CONTENT_TEXT}</p>
      </MarketingSourceBand>
    </div>
  );

  if (isModal) {
    return (
      <WebsiteLayout isModal onClose={() => (onClose ? onClose() : navigate(-1))}>
        {PageInner}
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <WebsitePageMeta
        title="Rhapsody Bible"
        description="The Ultimate Bible Reader & Study Resource Tool!"
      />
      {PageInner}
    </WebsiteLayout>
  );
}
