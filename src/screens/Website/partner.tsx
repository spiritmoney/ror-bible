import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
// @ts-ignore - side-effect stylesheet import has no declaration in this setup
import 'react-phone-input-2/lib/style.css';
// @ts-ignore
import './partnerPhoneInput.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import FeaturesSection, { ProductFeature } from './featureProduct';
import { scrollToHash } from '../../utils/scrolToHash';
import PageHero from './PageHero';
import Section from './Section';
import './appMarketingPages.css';

import partnerBanner from '../../assets/partner/partnerBanner.svg';
import partnerTranslator from '../../assets/partner/partnerTranslator.svg';
import partnerBible from '../../assets/partner/partnerBible.svg';
import partnerChurches from '../../assets/partner/partnerChurches.svg';
import partnerContent from '../../assets/partner/partnerContent.svg';
import partnerCareer from '../../assets/partner/partnerCareer.svg';

type PartnerPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

export default function PartnerPage({
  isModal = false,
  onClose,
}: PartnerPageProps): JSX.Element {
  const [isLg, setIsLg] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );
  const [showTranslatorForm, setShowTranslatorForm] = useState(true);
  const [showCareerForm, setShowCareerForm] = useState(true);
  const [translatorContact, setTranslatorContact] = useState('234');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModal) return;
    const state = (location.state as any) || {};
    const slug =
      state?.scrollTo ??
      (window.location.hash ? window.location.hash : undefined);
    if (!slug) return;

    const hash = slug.startsWith('#') ? slug : `#${slug}`;
    (async () => {
      await scrollToHash(hash, {
        headerOffset: HEADER_HEIGHT,
        behavior: 'smooth',
        maxAttempts: 20,
        retryDelay: 80,
      });
    })();
  }, [location, isModal]);

  const features: ProductFeature[] = [
    {
      id: 2,
      slugId: 'ror_bible_partners',
      title: 'ROR Bible+ Partners',
      description: [
        'To provide as many Bibles as we can, ROR Bible+ partners with generous copyright holders such as Bible publishers, Bible translators, and Bible societies. Discover the many ways that you can participate in the mission of our Bible partnership.',
      ],
      actionDropdown: {
        label: 'LEARN MORE',
        items: [
          {
            label: 'Contact Us',
            href: 'https://kingschat.online/user/rorbible',
          },
        ],
      },
      image: partnerBible,
      imagePlacement: 'aside',
      imageSide: 'right',
    },
    {
      id: 3,
      slugId: 'churches',
      title: 'Churches',
      description: [
        "ROR Bible+ offers free tools and resources to help churches engage their attenders with the Bible and with community. Find out how you can get more from the strengths your church already has, better equip your people to grow spiritually, and grow your church's potential to fulfill its mission.",
      ],
      actionDropdown: {
        label: 'LEARN MORE',
        items: [
          {
            label: 'Contact Us',
            href: 'https://kingschat.online/user/rorbible',
          },
        ],
      },
      image: partnerChurches,
      imagePlacement: 'aside',
      imageSide: 'left',
    },
    {
      id: 4,
      slugId: 'content_partners',
      title: 'Content Partners',
      description: [
        'To help people engage more with the Bible, ROR Bible+ Partners with organization and content creators that develop Bible-based devotional and study resources. Discover the benefits of getting you Bible-focused content in front of millions of Bible App users all over the world.',
      ],
      actionDropdown: {
        label: 'LEARN MORE',
        items: [
          {
            label: 'Contact Us',
            href: 'https://kingschat.online/user/rorbible',
          },
        ],
      },
      image: partnerContent,
      imagePlacement: 'aside',
      imageSide: 'right',
    },
  ];

  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isModal) return;
    const state = (location.state as any) || {};
    let slug = state.scrollTo || window.location.hash;

    if (!slug) return;

    const hash = slug.startsWith('#') ? slug : `#${slug}`;
    if (!window.location.hash && state.scrollTo) {
      window.history.replaceState({}, '', `${window.location.pathname}${hash}`);
    }

    const timer = setTimeout(() => {
      scrollToHash(hash, {
        headerOffset: HEADER_HEIGHT,
        behavior: 'smooth',
        maxAttempts: 20,
        retryDelay: 80,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [location, isModal]);

  const PageInner = (
    <div className="website-root app-marketing-page bg-brand-pale text-brand-navy font-montserrat">
      <PageHero
        eyebrow="Partners"
        title="Work with ROR Bible+"
        description="Publishers, churches, creators, and translators—join the mission to put Scripture in every language and every home."
      />
      <div className="w-full">
        <div className="relative w-full overflow-hidden">
          <img
            src={partnerBanner}
            alt="Partner banner"
            className="w-full h-auto object-contain"
            draggable={false}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-[6%] md:pr-[7%] lg:pr-[8%]">
            <div className="text-right text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
              <div className="text-[34px] md:text-[48px] lg:text-[58px] leading-none font-semibold tracking-[-0.03em]">
                Our
              </div>
              <div className="text-[34px] md:text-[48px] lg:text-[58px] leading-none font-semibold tracking-[-0.03em]">
                PARTNERS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 app-marketing-section">
        <section
          id="be_a_translator"
          className="grid grid-cols-1 lg:grid-cols-[469px_1fr] gap-6 items-start"
        >
          <div className="flex justify-center lg:justify-start">
            <img
              src={partnerTranslator}
              alt="Be a Translator"
              className="w-full max-w-[469px] h-auto rounded-[26px] object-cover"
              draggable={false}
            />
          </div>

          <div className="pt-4 lg:pt-10">
            <h3 className="text-[1.4rem] lg:text-[1.9rem] font-semibold leading-tight mb-2">
              Be a Translator
            </h3>
            <p className="text-[1.1rem] text-slate-700 leading-6 max-w-[700px]">
              ROR Bible+ staff makes the Bible App and the Bible App for Kids
              and Teenagers, but it's our extended team of world-class
              volunteers who serve our millions of users. When you use your
              gifts to help us connect people with God, you're not just watching
              God move through this historical spiritual revolution... you're
              actively participating in it.
            </p>

            <div className="mt-8 border-t border-[#E1E1E1] pt-3 max-w-[720px]">
              {showTranslatorForm ? (
                <>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-[#E1E1E1]" />
                    <h4 className="text-[1.05rem] font-semibold text-[#333] whitespace-nowrap">
                      Translator details
                    </h4>
                    <div className="h-px flex-1 bg-[#E1E1E1]" />
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Name
                        </span>
                        <input className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-3 outline-none text-[13px]" />
                      </label>
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Surname
                        </span>
                        <input className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-3 outline-none text-[13px]" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
                      <div>
                        <span className="block text-[12px] text-[#666] mb-1">
                          Date of Birth
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <select className="h-8 rounded-[4px] bg-[#E9E5E5] px-2 outline-none text-[13px]" />
                          <select className="h-8 rounded-[4px] bg-[#E9E5E5] px-2 outline-none text-[13px]" />
                          <select className="h-8 rounded-[4px] bg-[#E9E5E5] px-2 outline-none text-[13px]" />
                        </div>
                      </div>
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Contact
                        </span>
                        <PhoneInput
                          country={'ng'}
                          value={translatorContact}
                          onChange={value => setTranslatorContact(value)}
                          enableSearch
                          disableSearchIcon
                          countryCodeEditable={false}
                          containerClass="partner-phone-input"
                          inputClass="partner-phone-input__field"
                          buttonClass="partner-phone-input__button"
                          dropdownClass="partner-phone-input__dropdown"
                          searchClass="partner-phone-input__search"
                          inputProps={{
                            name: 'translator-contact',
                            required: false,
                          }}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="block text-[12px] text-[#666] mb-1">
                        Email
                      </span>
                      <input className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-3 outline-none text-[13px]" />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Language to Translate 1
                        </span>
                        <select className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-2 outline-none text-[13px]" />
                      </label>
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Language to Translate 2 (Optional)
                        </span>
                        <select className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-2 outline-none text-[13px]" />
                      </label>
                    </div>

                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        className="min-w-[100px] h-7 rounded-full bg-[#0F7FA7] text-white text-[12px] font-semibold px-4"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </>
              ) : null}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowTranslatorForm(prev => !prev)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#959595] px-3 py-1 text-[11px] text-[#303030]"
                >
                  {showTranslatorForm ? 'CANCEL' : 'JOIN US'}
                  <span className="text-[10px]">
                    {showTranslatorForm ? '⌃' : '⌄'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Section innerClassName="app-marketing-section" pad="tight">
          <FeaturesSection
            features={features}
            imgW={469}
            imgH={487}
            isLg={isLg}
          />
        </Section>

        <section
          id="careers"
          className="mt-10 grid grid-cols-1 lg:grid-cols-[469px_1fr] gap-6 items-start"
        >
          <div className="flex justify-center lg:justify-start">
            <img
              src={partnerCareer}
              alt="Careers"
              className="w-full max-w-[469px] h-auto rounded-[26px] object-cover"
              draggable={false}
            />
          </div>

          <div className="pt-4 lg:pt-10">
            <h3 className="text-[1.4rem] lg:text-[1.9rem] font-semibold leading-tight mb-2">
              Careers
            </h3>
            <p className="text-[1.1rem] text-slate-700 leading-6 max-w-[700px]">
              As a digital ministry of Life. Church, ROR Bible+ mission is to
              encourage and challenge people to seek intimacy with God every
              day. If you have the skills and experience that we're looking for,
              and if you're actively engage in pursuing God's calling for your
              life, there may be a place for you on our team.
            </p>

            <div className="mt-8 border-t border-[#E1E1E1] pt-3 max-w-[720px]">
              {showCareerForm ? (
                <>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-[#E1E1E1]" />
                    <h4 className="text-[1.05rem] font-semibold text-[#333] whitespace-nowrap">
                      Career Search
                    </h4>
                    <div className="h-px flex-1 bg-[#E1E1E1]" />
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Name
                        </span>
                        <input className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-3 outline-none text-[13px]" />
                      </label>
                      <label className="block">
                        <span className="block text-[12px] text-[#666] mb-1">
                          Surname
                        </span>
                        <input className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-3 outline-none text-[13px]" />
                      </label>
                    </div>

                    <label className="block">
                      <span className="block text-[12px] text-[#666] mb-1">
                        Email
                      </span>
                      <input className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-3 outline-none text-[13px]" />
                    </label>

                    <label className="block">
                      <span className="block text-[12px] text-[#666] mb-1">
                        Select Career
                      </span>
                      <select className="w-full h-8 rounded-[4px] bg-[#E9E5E5] px-2 outline-none text-[13px]" />
                    </label>

                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        className="min-w-[100px] h-7 rounded-full bg-[#0F7FA7] text-white text-[12px] font-semibold px-4"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </>
              ) : null}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowCareerForm(prev => !prev)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#959595] px-3 py-1 text-[11px] text-[#303030]"
                >
                  {showCareerForm ? 'CANCEL' : 'SEARCH CAREERS'}
                  <span className="text-[10px]">
                    {showCareerForm ? '⌃' : '⌄'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );

  if (isModal) {
    return (
      <WebsiteLayout isModal onClose={() => (onClose ? onClose() : navigate(-1))}>
        {PageInner}
      </WebsiteLayout>
    );
  }

  return <WebsiteLayout>{PageInner}</WebsiteLayout>;
}
