import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import { scrollToHash } from '../../utils/scrolToHash';
import PageHero from './PageHero';
import WebsitePageMeta from './WebsitePageMeta';
import WebsiteButton from './WebsiteButton';
import MarketingSourceBand, { SourceBulletList } from './MarketingSourceBand';
import { WebsiteDownloadRoute } from './websitePaths';
import './appMarketingPages.css';

import aboutImg from '../../assets/about/image1.png';
import aboutImg2 from '../../assets/about/about-2.png';
import aboutImg3 from '../../assets/about/about-3.png';
import aboutImg4 from '../../assets/about/about-4.png';
import aboutImg5 from '../../assets/about/about-5.png';
import aboutImg6 from '../../assets/about/about-6.png';
import aboutImg7 from '../../assets/about/about-7.png';
import aboutImg8 from '../../assets/about/about-8.png';
import appreciation from '../../assets/about/appreciation.png';
import press from '../../assets/about/press.png';
import stories from '../../assets/about/stories.png';
import kc from '../../assets/about/kc.png';
import link from '../../assets/about/link.png';

const INTRO =
  'All around the world, over 3 billion people are daily reading and sharing the #1 best-selling  daily devotional “Rhapsody of Realities” by Rev. (Dr.) Chris Oyakhilome, DSc. Dsc. DD., completely free. From the desk of the same author, comes the ROR Bible+, a fully interactive Bible reader developed to deliver the most exhilarating study experience!';

const MISSION_BODY =
  'Apart from the usual electronic stationery features like note-keeping, highlighting, bookmarking etc., this novel app is built on solid interactive technologies that avail users of the opportunities to take advantage of the following extra-special features: inspirational articles reading, access all online or download versions to use offline. Read, study, meditate and triumph in life while you share your victories verses with friends.';

type AboutPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

export default function AboutPage({
  isModal = false,
  onClose,
}: AboutPageProps): JSX.Element {
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

  const customizeBullets = [
    'On-Screen Setting: Make the ROR Bible+ completely yours. Personalize your Bible Study experience. Adjust the fonts, font type, and color to your preference. Switch the reference letters and Strong’s numbers off/on etc.',
    'Easy Reading & Night Mode: Adjust font, text size, and contrast for bright or low-light.',
    'Highlights: Keep your favorite scripture in your choice color',
    'Bookmarks: Smart utility for sharing, memorizing, finding your favorite verses.',
    'Share verses with friends: on social media, email, or via SMS/text,',
    'Notes: Keep your study notes privately, or share them with friends',
    "Cloud Sync: With your free ROR Bible+ account, see all of your Notes, Highlights, Bookmarks, on any supported devices, just at the tap of the Sync button!",
  ];

  const PageInner = (
    <div className="website-root app-marketing-page bg-white text-brand-navy font-montserrat">
      <PageHero
        variant="flat"
        eyebrow="About"
        title={
          <>
            More Than <span className="text-brand-orange">Just A Bible!</span>
          </>
        }
        description={INTRO}
      />

      <MarketingSourceBand
        id="read"
        tone="alt"
        title="Read The Rhapsody Bible Daily"
        image={aboutImg2}
        imageAlt="Read The Rhapsody Bible Daily"
      >
        <SourceBulletList
          items={[
            'Experience the illumination of God’s Word in 20+ flavors of the Rhapsody Bible',
            'Switch between several Bible versions, in over 70 languages',
            'Offline Feature: Download and read ALL Bibles without Internet access',
            'Read daily Rhapsody of Realities inspirational articles by the author.',
          ]}
        />
      </MarketingSourceBand>

      <MarketingSourceBand
        id="meditate"
        tone="white"
        title="Study & Meditate On Rhapsody Bible"
        image={aboutImg3}
        imageAlt="Study & Meditate On Rhapsody Bible"
      >
        <SourceBulletList
          items={[
            'Inspirational articles: Do topical study with hundreds of daily inspirations articles by Pastor Chris, all year round',
            'Bible Study Plans: Topical study of the entire Bible using the Rhapsody 1-Year® or 2- Year® Bible Study Planners.',
            'Study Resources: Adopt immersive study, take advantage of study resources like the Hebrew Greek Bible, Enhanced Hebrew & Greek Dictionaries, LoveWorld Concordance, Enhanced Exhaustive Strong’s concordance.',
            'Parallel Study: Use the Split view to enhance your Parallel Bible Study experience; comparing scriptures or scripture in one Bible Version with another.',
          ]}
        />
      </MarketingSourceBand>

      <MarketingSourceBand
        id="hub"
        tone="alt"
        title="Use the Rhapsody Bible with Friends"
        image={aboutImg4}
        imageAlt="Use the Rhapsody Bible with Friends"
      >
        <SourceBulletList
          items={[
            'Share your daily reading with your friends.',
            'Send your notes via email, KingsChat to loved ones or evangelism contacts.',
          ]}
        />
      </MarketingSourceBand>

      <MarketingSourceBand
        tone="white"
        title="Customize Your Free Rhapsody Bible"
        image={aboutImg5}
        imageAlt="Customize Your Free Rhapsody Bible"
      >
        <SourceBulletList items={customizeBullets} />
      </MarketingSourceBand>

      <MarketingSourceBand
        tone="alt"
        title="Connect With ROR Bible+"
        image={aboutImg6}
        imageAlt="Connect With ROR Bible+"
      >
        <ul className="mkt-list mkt-source-list">
          <li>Contact support from inside the ROR Bible+ App</li>
          <li>
            Follow us on KingsChat app, download @:{' '}
            <a className="mkt-link inline-flex items-center gap-1" href="https://kingschat.online/user/rorbible">
              <img src={kc} alt="" className="w-4 h-4" />
              ROR Bible+ Superuser
            </a>
          </li>
          <li>
            Keep current on our blog:{' '}
            <a className="mkt-link inline-flex items-center gap-1" href="https://blog.rorbible.plus">
              <img src={link} alt="" className="w-4 h-4" />
              https://blog.rorbible.plus
            </a>
          </li>
          <li>
            ROR Bible+ Online:{' '}
            <a className="mkt-link inline-flex items-center gap-1" href="/bible-online">
              <img src={link} alt="" className="w-4 h-4" />
              https://www.rorbible.plus
            </a>
          </li>
        </ul>
      </MarketingSourceBand>

      <MarketingSourceBand
        id="bible"
        tone="white"
        title="Several ROR Bible Versions:"
        image={aboutImg7}
        imageAlt="Several ROR Bible Versions:"
      >
        <SourceBulletList
          items={[
            'King James Version (KJV)',
            'New King James Version (NKJV)',
            'Amplified Classic Bible (AMPC)',
            'New International Version (NIV)',
            'New Living Translation (NLT)',
            'English Standard Version (ESV)',
            'The Message (MSG)',
            'and many more! ',
          ]}
        />
      </MarketingSourceBand>

      <MarketingSourceBand
        tone="alt"
        title="More Than 2000+ Int’l Languages"
        image={aboutImg8}
        imageAlt="More Than 2000+ Int’l Languages"
      >
        <p className="mkt-body">
          English, Spanish, Hindi, Urdu, Myanmar, Mandarin, Portuguese, Korean, German, French, Russian,
          Malayalam, Indonesian, Arabic, Zulu, Efik, Igbo, Tagalog, Bengali, Nepali, Swedish, Norwegian,
          Kazakh, Acehnese, Cebuano, Turkmen, Mongol, Javanese, Kannada, Italian, Afrikaans, Albanian,
          Amharic, Bulgarian, Czech, Farsi, Gujarati, Hebrew, Marathi, Orija, Swahili, Thai, Ukrainian,
          Vietnamese, Latvian.
        </p>
      </MarketingSourceBand>

      <section className="mkt-cta-band">
        <div className="mkt-container">
          <h2 className="mkt-h2">Stories</h2>
          <p className="mkt-body">
            See how God is using ROR Bible+ to impact lives across the world.
          </p>
          <div className="mt-8 flex justify-center">
            <WebsiteButton variant="marketing" to={WebsiteDownloadRoute}>
              Get the app
            </WebsiteButton>
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
