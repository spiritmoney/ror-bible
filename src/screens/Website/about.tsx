import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import { scrollToHash } from '../../utils/scrolToHash';
import PageHero from './PageHero';
import WebsitePageMeta from './WebsitePageMeta';
import WebsiteButton from './WebsiteButton';
import Card from './Card';
import { WebsiteDownloadRoute } from './websitePaths';
import './appMarketingPages.css';

import aboutImg from '../../assets/about/image1.png';
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

type AboutPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 pl-5 text-[15px] leading-relaxed text-brand-ink space-y-2 list-disc">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ExtraFeatureSection({
  id,
  title,
  description,
  bullets,
  image,
  imageAlt,
}: {
  id?: string;
  title: string;
  description?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section id={id} className="mkt-section">
      <div className="mkt-container">
        <Card className="mkt-card !p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {image ? (
              <img
                src={image}
                alt={imageAlt || title}
                className="mkt-img !rounded-none md:min-h-[280px] object-cover w-full h-full"
                loading="lazy"
              />
            ) : null}
            <div className="p-7 md:p-9">
              <h3 className="m-0 text-2xl font-extrabold text-brand-blue">{title}</h3>
              {description ? (
                <p className="mt-4 text-[15px] leading-relaxed text-brand-ink">{description}</p>
              ) : null}
              {bullets ? (
                <div className="mt-4">
                  <BulletList items={bullets} />
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

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

  const readBullets = [
    'Experience the illumination of God’s Word in 20+ flavors of the Rhapsody Bible',
    'Switch between several Bible versions, in over 70 languages',
    'Offline Feature: Download and read ALL Bibles without Internet access',
    'Read daily Rhapsody of Realities inspirational articles by the author.',
  ];

  const studyBullets = [
    'Inspirational articles: Do topical study with hundreds of daily inspirations articles by Pastor Chris, all year round',
    'Bible Study Plans: Topical study of the entire Bible using the Rhapsody 1-Year® or 2- Year® Bible Study Planners.',
    'Study Resources: Adopt immersive study, take advantage of study resources like the Hebrew Greek Bible, Enhanced Hebrew & Greek Dictionaries, LoveWorld Concordance, Enhanced Exhaustive Strong’s concordance.',
    'Parallel Study: Use the Split view to enhance your Parallel Bible Study experience; comparing scriptures or scripture in one Bible Version with another.',
  ];

  const friendsBullets = [
    'Share your daily reading with your friends.',
    'Send your notes via email, KingsChat to loved ones or evangelism contacts.',
  ];

  const PageInner = (
    <div className="website-root app-marketing-page bg-brand-pale text-brand-navy font-montserrat">
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

      <section id="mission" className="mkt-section">
        <div className="mkt-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <img
            src={aboutImg}
            alt="About ROR Bible"
            className="mkt-img w-full max-w-full"
            loading="lazy"
          />
          <div>
            <h2 className="m-0 text-[32px] font-extrabold text-brand-blue leading-tight">
              More Than Just A Bible!
            </h2>
            <p className="mt-4 text-[16px] leading-[1.65] text-brand-ink">
              Apart from the usual electronic stationery features like note-keeping, highlighting,
              bookmarking etc., this novel app is built on solid interactive technologies that avail
              users of the opportunities to take advantage of the following extra-special features:
              inspirational articles reading, access all online or download versions to use
              offline. Read, study, meditate and triumph in life while you share your victories
              verses with friends.
            </p>
          </div>
        </div>
      </section>

      <section className="mkt-section pt-0">
        <div className="mkt-container grid grid-cols-1 md:grid-cols-3 gap-6">
          <article id="read" className="mkt-card">
            <h3 className="m-0 text-lg font-extrabold text-brand-navy">Read The Rhapsody Bible Daily</h3>
            <div className="mt-4">
              <BulletList items={readBullets} />
            </div>
          </article>
          <article id="meditate" className="mkt-card">
            <h3 className="m-0 text-lg font-extrabold text-brand-navy">
              Study &amp; Meditate On Rhapsody Bible
            </h3>
            <div className="mt-4">
              <BulletList items={studyBullets} />
            </div>
          </article>
          <article id="hub" className="mkt-card">
            <h3 className="m-0 text-lg font-extrabold text-brand-navy">
              Use the Rhapsody Bible with Friends
            </h3>
            <div className="mt-4">
              <BulletList items={friendsBullets} />
            </div>
          </article>
        </div>
      </section>

      <ExtraFeatureSection
        title="Customize Your Free Rhapsody Bible"
        image={aboutImg5}
        imageAlt="Customize Your Free Rhapsody Bible"
        bullets={[
          'On-Screen Setting: Make the ROR Bible+ completely yours. Personalize your Bible Study experience. Adjust the fonts, font type, and color to your preference. Switch the reference letters and Strong’s numbers off/on etc.',
          'Easy Reading & Night Mode: Adjust font, text size, and contrast for bright or low-light.',
          'Highlights: Keep your favorite scripture in your choice color',
          'Bookmarks: Smart utility for sharing, memorizing, finding your favorite verses.',
          'Share verses with friends: on social media, email, or via SMS/text,',
          'Notes: Keep your study notes privately, or share them with friends',
          "Cloud Sync: With your free ROR Bible+ account, see all of your Notes, Highlights, Bookmarks, on any supported devices, just at the tap of the Sync button!",
        ]}
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <Card className="mkt-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <img
                src={aboutImg6}
                alt="Connect With ROR Bible+"
                className="mkt-img"
                loading="lazy"
              />
              <div>
                <h3 className="m-0 text-2xl font-extrabold text-brand-blue">Connect With ROR Bible+</h3>
                <ul className="mt-4 pl-5 text-[15px] text-brand-ink space-y-3 list-disc">
                  <li>Contact support from inside the ROR Bible+ App</li>
                  <li>
                    Follow us on KingsChat app, download @:{' '}
                    <a
                      className="text-brand-blue font-semibold inline-flex items-center gap-1"
                      href="https://kingschat.online/user/rorbible"
                    >
                      <img src={kc} alt="" className="w-4 h-4" />
                      ROR Bible+ Superuser
                    </a>
                  </li>
                  <li>
                    Keep current on our blog:{' '}
                    <a className="text-brand-blue font-semibold inline-flex items-center gap-1" href="https://blog.rorbible.plus">
                      <img src={link} alt="" className="w-4 h-4" />
                      https://blog.rorbible.plus
                    </a>
                  </li>
                  <li>
                    ROR Bible+ Online:{' '}
                    <a className="text-brand-blue font-semibold inline-flex items-center gap-1" href="/bible-online">
                      <img src={link} alt="" className="w-4 h-4" />
                      https://www.rorbible.plus
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <ExtraFeatureSection
        id="bible"
        title="Several ROR Bible Versions:"
        image={aboutImg7}
        imageAlt="Several ROR Bible Versions:"
        bullets={[
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

      <ExtraFeatureSection
        title="More Than 2000+ Int’l Languages"
        description="English, Spanish, Hindi, Urdu, Myanmar, Mandarin, Portuguese, Korean, German, French, Russian, Malayalam, Indonesian, Arabic, Zulu, Efik, Igbo, Tagalog, Bengali, Nepali, Swedish, Norwegian, Kazakh, Acehnese, Cebuano, Turkmen, Mongol, Javanese, Kannada, Italian, Afrikaans, Albanian, Amharic, Bulgarian, Czech, Farsi, Gujarati, Hebrew, Marathi, Orija, Swahili, Thai, Ukrainian, Vietnamese, Latvian."
        image={aboutImg8}
        imageAlt="More Than 2000+ Int’l Languages"
      />

      <section className="mkt-section pt-0">
        <div className="mkt-container">
          <img src={appreciation} alt="Appreciation block" className="mkt-img w-full" loading="lazy" />
        </div>
      </section>

      <section className="mkt-section pt-0">
        <div className="mkt-container grid grid-cols-1 md:grid-cols-2 gap-6">
          <article id="stories" className="mkt-card">
            <img src={stories} alt="Stories" className="mkt-img mb-4" loading="lazy" />
            <h3 className="m-0 text-xl font-extrabold text-brand-blue">Stories</h3>
            <p className="mt-3 text-[15px] text-brand-ink">
              See how God is using ROR Bible+ to impact lives across the world.
            </p>
          </article>
          <article id="press" className="mkt-card">
            <img src={press} alt="Press" className="mkt-img mb-4" loading="lazy" />
            <h3 className="m-0 text-xl font-extrabold text-brand-blue">Press</h3>
            <p className="mt-3 text-[15px] text-brand-ink">
              ROR Bible+ have been covered by the press all over the world.
            </p>
          </article>
        </div>
      </section>

      <section className="mkt-navy-band">
        <div className="mkt-container">
          <h2 className="m-0 text-[32px] font-extrabold text-white">Stories</h2>
          <p className="mt-3 text-[16px] text-white/90 max-w-xl mx-auto">
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
