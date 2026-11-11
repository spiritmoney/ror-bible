import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
// @ts-ignore
import 'react-phone-input-2/lib/style.css';
// @ts-ignore
import './partnerPhoneInput.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import { scrollToHash } from '../../utils/scrolToHash';
import PageHero from './PageHero';
import WebsitePageMeta from './WebsitePageMeta';
import Card from './Card';
import './appMarketingPages.css';

import partnerTranslator from '../../assets/partner/partnerTranslator.svg';
import partnerBible from '../../assets/partner/partnerBible.svg';
import partnerChurches from '../../assets/partner/partnerChurches.svg';
import partnerContent from '../../assets/partner/partnerContent.svg';
import partnerCareer from '../../assets/partner/partnerCareer.svg';

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

const TRANSLATOR_TEXT =
  "ROR Bible+ staff makes the Bible App and the Bible App for Kids and Teenagers, but it's our extended team of world-class volunteers who serve our millions of users. When you use your gifts to help us connect people with God, you're not just watching God move through this historical spiritual revolution... you're actively participating in it.";

const CAREERS_TEXT =
  "As a digital ministry of Life. Church, ROR Bible+ mission is to encourage and challenge people to seek intimacy with God every day. If you have the skills and experience that we're looking for, and if you're actively engage in pursuing God's calling for your life, there may be a place for you on our team.";

export default function PartnerPage({
  isModal = false,
  onClose,
}: PartnerPageProps): JSX.Element {
  const [translatorContact, setTranslatorContact] = useState('234');
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
        <div className="mkt-container mkt-split-56">
          <img
            src={partnerTranslator}
            alt="Be a Translator"
            className="mkt-img mkt-partner-photo"
            loading="lazy"
          />

          <div id="be_a_translator" className="mkt-form-card">
            <h2 className="m-0 text-[28px] font-extrabold text-brand-blue">Be a Translator</h2>
            <p className="mt-4 text-[16px] leading-[1.65] text-brand-ink">{TRANSLATOR_TEXT}</p>

            <h3 className="mt-8 text-sm font-extrabold text-brand-navy tracking-wide">
              Translator details
            </h3>

            <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <label className="block">
                <span className="mkt-label">Name</span>
                <input className="mkt-input" type="text" name="translator-name" />
              </label>
              <label className="block">
                <span className="mkt-label">Surname</span>
                <input className="mkt-input" type="text" name="translator-surname" />
              </label>
              <label className="block">
                <span className="mkt-label">Date of Birth</span>
                <div className="grid grid-cols-3 gap-2">
                  <select className="mkt-input" aria-label="Birth day">
                    <option value="">Day</option>
                  </select>
                  <select className="mkt-input" aria-label="Birth month">
                    <option value="">Month</option>
                  </select>
                  <select className="mkt-input" aria-label="Birth year">
                    <option value="">Year</option>
                  </select>
                </div>
              </label>
              <label className="block">
                <span className="mkt-label">Contact</span>
                <PhoneInput
                  country="ng"
                  value={translatorContact}
                  onChange={(value) => setTranslatorContact(value)}
                  enableSearch
                  disableSearchIcon
                  countryCodeEditable={false}
                  containerClass="partner-phone-input"
                  inputClass="partner-phone-input__field"
                  buttonClass="partner-phone-input__button"
                  dropdownClass="partner-phone-input__dropdown"
                  searchClass="partner-phone-input__search"
                  inputProps={{ name: 'translator-contact', required: false }}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mkt-label">Email</span>
                <input className="mkt-input" type="email" name="translator-email" />
              </label>
              <label className="block">
                <span className="mkt-label">Language to Translate 1</span>
                <select className="mkt-input" name="language-1" />
              </label>
              <label className="block">
                <span className="mkt-label">Language to Translate 2 (Optional)</span>
                <select className="mkt-input" name="language-2" />
              </label>
              <div className="sm:col-span-2 pt-2">
                <button type="submit" className="mkt-btn-give">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="ror_bible_partners" className="mkt-section mkt-band-white">
        <div className="mkt-container">
          <Card className="mkt-card" lift={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <img src={partnerBible} alt="ROR Bible+ Partners" className="mkt-img" loading="lazy" />
              <div>
                <h3 className="m-0 text-2xl font-extrabold text-brand-blue">ROR Bible+ Partners</h3>
                <p className="mt-4 text-[16px] leading-[1.65] text-brand-ink">{ROR_PARTNERS_TEXT}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="churches" className="mkt-section mkt-band-alt">
        <div className="mkt-container">
          <Card className="mkt-card" lift={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <img src={partnerChurches} alt="Churches" className="mkt-img" loading="lazy" />
              <div>
                <h3 className="m-0 text-2xl font-extrabold text-brand-blue">Churches</h3>
                <p className="mt-4 text-[16px] leading-[1.65] text-brand-ink">{CHURCHES_TEXT}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="content_partners" className="mkt-section mkt-band-white">
        <div className="mkt-container">
          <Card className="mkt-card" lift={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <img src={partnerContent} alt="Content Partners" className="mkt-img" loading="lazy" />
              <div>
                <h3 className="m-0 text-2xl font-extrabold text-brand-blue">Content Partners</h3>
                <p className="mt-4 text-[16px] leading-[1.65] text-brand-ink">{CONTENT_TEXT}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="careers" className="mkt-section mkt-band-alt">
        <div className="mkt-container grid grid-cols-1 lg:grid-cols-2 gap-12">
          <img src={partnerCareer} alt="Careers" className="mkt-img" loading="lazy" />
          <div className="mkt-form-card">
            <h3 className="m-0 text-2xl font-extrabold text-brand-blue">Careers</h3>
            <p className="mt-4 text-[16px] leading-[1.65] text-brand-ink">{CAREERS_TEXT}</p>
            <h4 className="mt-8 text-sm font-extrabold text-brand-navy">Career Search</h4>
            <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <label className="block">
                <span className="mkt-label">Name</span>
                <input className="mkt-input" type="text" name="career-name" />
              </label>
              <label className="block">
                <span className="mkt-label">Surname</span>
                <input className="mkt-input" type="text" name="career-surname" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mkt-label">Email</span>
                <input className="mkt-input" type="email" name="career-email" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mkt-label">Select Career</span>
                <select className="mkt-input" name="career-role" />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="mkt-btn-give">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
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
