import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import Section from './Section';
import Card from './Card';
import WebsiteButton from './WebsiteButton';
import { Eyebrow, HeroWaves } from './PageHero';
import {
  WebsiteDownloadRoute,
  WebsiteFeaturesRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import heroIpad from '../../assets/website/new/hero-ipad-reader.jpg';
import tvPoster from '../../assets/website/new/tv-promo-poster.jpg';
import f2 from '../../assets/website/new/feature-02-solution-search.jpg';
import f3 from '../../assets/website/new/feature-03-audio-bible.jpg';
import f4 from '../../assets/website/new/feature-04-pulpit.jpg';
import f8 from '../../assets/website/new/feature-08-roar.jpg';
import lwStore from '../../assets/website/new/loveworld-app-store.png';
import googlePlay from '../../assets/website/new/google-play.png';
import appStore from '../../assets/website/new/app-store.png';

const homeFeatureCards = [
  { title: 'Read with comfort', body: 'Choose a layout, adjust fonts and themes, and follow references in pop-up windows.' },
  { title: 'Compare and understand', body: 'Read translations side by side and follow cross-references in context.' },
  { title: 'Explore the original words', body: 'Hebrew Greek KJV Bible, Strong’s, LoveWorld Concordance and dictionaries.' },
  { title: 'Capture your insights', body: 'Highlight precisely, add notes and voice notes, and bookmark verses.' },
];

const distinctiveBlocks = [
  {
    tag: 'Solution Search',
    title: 'Bring your questions to Scripture.',
    body: 'Explore with Student Agent or go deeper with Minister Agent.',
    bullets: [
      'Ask everyday questions in plain language',
      'Student Agent for guided Scripture-based study',
      'Minister Agent for deeper biblical research, with references and source context',
    ],
    image: f2,
    alt: 'ROR Bible+ Solution Search shown on iPhone',
  },
  {
    tag: 'Personalized Audio Bible',
    title: 'Hear the Word in Pastor Chris’s voice.',
    body: 'Listen to the ROR Audio Bible and explore audio commentaries.',
    bullets: [
      'The ROR Audio Bible in Pastor Chris’s voice',
      'Pastor Chris audio commentaries',
      'Read-to-Me and playback controls with verse follow',
    ],
    image: f3,
    alt: 'ROR Bible+ Personalized Audio Bible shown on iPhone',
  },
  {
    tag: '@Pulpit',
    title: 'From revelation to ministration.',
    body: 'Shape your study into a message with Scripture and personal notes.',
    bullets: [
      'A sermon preparation workspace',
      'Organize Scripture, personal notes and research',
      'Keep source context close to your message',
    ],
    image: f4,
    alt: 'ROR Bible+ @Pulpit shown on iPhone',
  },
  {
    tag: 'ROAR Study Bible',
    title: 'Go deeper with ROAR.',
    body: 'Explore Scripture-linked annotations from Rev. Chris Oyakhilome.',
    bullets: [
      'Rev. Chris Oyakhilome’s Annotated Reference Study Bible',
      'Scripture-linked annotations',
      'Integrated study resources',
    ],
    image: f8,
    alt: 'ROR Bible+ ROAR Study Bible shown on iPhone',
  },
];

export default function LandingPage(): JSX.Element {
  const [promoPlaying, setPromoPlaying] = useState(false);

  return (
    <WebsiteLayout>
      <section className="relative bg-brand-pale pt-10 pb-24 website-sm:pt-8 website-sm:pb-28 overflow-hidden">
        <HeroWaves />
        <div className="max-w-website mx-auto px-8 website-sm:px-4 grid lg:grid-cols-2 gap-12 items-center relative z-[1]">
          <div>
            <Eyebrow>Now on Mobile · Web · Desktop · Voice</Eyebrow>
            <h1 className="mt-4 text-[56px] website-sm:text-[42px] font-extrabold text-brand-navy leading-[1.05] tracking-tight">
              Read. Study. Meditate. <span className="text-brand-orange">Triumph.</span>
            </h1>
            <p className="mt-3 text-2xl font-bold text-brand-navy">
              The Word. Across your <span className="text-brand-orange">world.</span>
            </p>
            <p className="mt-4 text-lg text-brand-ink leading-relaxed">
              A premium digital Bible experience for personal revelation, deeper study and inspired ministry: your Bible, study resources and personal insights in one workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WebsiteButton to={WebsiteDownloadRoute}>Get the app</WebsiteButton>
              <WebsiteButton to={WebsiteProductWebRoute} variant="secondary">
                Open Bible Online
              </WebsiteButton>
              <WebsiteButton to="/home#promo" variant="ghost">
                ▶ Watch the TV promo
              </WebsiteButton>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                [WebsiteProductMobileRoute, 'Mobile'],
                [WebsiteProductWebRoute, 'Web'],
                [WebsiteProductDesktopRoute, 'Desktop'],
                [WebsiteProductVoiceRoute, 'Voice'],
              ].map(([to, label]) => (
                <Link
                  key={to as string}
                  to={to as string}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-brand-mist text-sm font-semibold text-brand-navy"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[620px] rounded-[32px] overflow-hidden shadow-brand-card">
              <img src={heroIpad} alt="ROR Bible+ Reader on iPad showing Joshua 1" className="w-full h-auto block" />
            </div>
          </div>
        </div>
      </section>

      <Section id="promo" className="bg-white">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>ROR Bible+ TV promo</Eyebrow>
            <h2 className="mt-4 text-4xl website-sm:text-[31px] font-extrabold text-brand-navy">
              See ROR Bible+ <span className="text-brand-orange">in action.</span>
            </h2>
            <p className="mt-3 text-lg text-brand-ink">Watch how readers, students and ministers go deeper in the Word.</p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-brand-card bg-brand-navy">
            {!promoPlaying ? (
              <button
                type="button"
                className="block w-full relative"
                aria-label="Play the ROR Bible+ TV promo"
                onClick={() => setPromoPlaying(true)}
              >
                <img src={tvPoster} alt="" className="w-full h-auto opacity-90" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center text-2xl">
                    ▶
                  </span>
                </span>
              </button>
            ) : (
              <video
                className="w-full aspect-video bg-black"
                controls
                autoPlay
                poster={tvPoster}
                src={`${process.env.PUBLIC_URL || ''}/media/ror-bible-plus-tv-promo.mp4`}
              />
            )}
          </div>
        </div>
      </Section>

      <Section className="bg-brand-pale">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <Eyebrow>Discover the depth of Scripture</Eyebrow>
            <h2 className="mt-4 text-4xl website-sm:text-[31px] font-extrabold text-brand-navy">
              Everything you need to go deeper in <span className="text-brand-orange">the Word.</span>
            </h2>
          </div>
          <Link to={WebsiteFeaturesRoute} className="font-bold text-brand-blue inline-flex items-center gap-2">
            See all features →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {homeFeatureCards.map((c) => (
            <Card key={c.title} className="p-6 bg-white shadow-sm border border-brand-mist/60">
              <h3 className="text-lg font-extrabold text-brand-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-brand-ink leading-relaxed">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <Eyebrow>Distinctive to ROR Bible+</Eyebrow>
        <h2 className="mt-4 text-4xl website-sm:text-[31px] font-extrabold text-brand-navy mb-12">
          For readers, students and <span className="text-brand-orange">ministers.</span>
        </h2>
        <div className="space-y-16">
          {distinctiveBlocks.map((block, idx) => (
            <div
              key={block.tag}
              className={`grid lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <span className="text-sm font-extrabold text-brand-teal">{block.tag}</span>
                <h3 className="mt-2 text-3xl font-extrabold text-brand-navy">
                  {block.title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-brand-orange">{block.title.split(' ').slice(-1)}</span>
                </h3>
                <p className="mt-3 text-brand-ink">{block.body}</p>
                <ul className="mt-4 space-y-2">
                  {block.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-brand-navy">
                      <span className="text-brand-teal font-bold">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`rounded-3xl overflow-hidden shadow-brand-card ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <img src={block.image} alt={block.alt} className="w-full h-auto" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-pale">
        <Eyebrow>Mobile · Web · Desktop · Voice</Eyebrow>
        <h2 className="mt-4 text-4xl font-extrabold text-brand-navy mb-10">
          One Bible experience. <span className="text-brand-orange">Four ways in.</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            [WebsiteProductMobileRoute, 'ROR Bible+ Mobile', 'The Word wherever you go.', 'Android and iOS'],
            [WebsiteProductWebRoute, 'ROR Bible+ Web', 'Open your browser. Open the Word.', 'Bible Online and Bible Lite (PWA)'],
            [WebsiteProductDesktopRoute, 'ROR Bible+ Desktop', 'More room for deeper study.', 'MacOS, Windows and Linux'],
            [WebsiteProductVoiceRoute, 'ROR Bible+ Voice', 'Speak. Listen. Engage with the Word.', 'Amazon Alexa and Google Home'],
          ].map(([to, title, line, sub]) => (
            <Link
              key={to as string}
              to={to as string}
              className="website-card-lift block p-6 rounded-3xl bg-brand-navy text-white min-h-[220px] flex flex-col"
            >
              <span className="font-extrabold text-lg">{title}</span>
              <span className="mt-2 text-sm text-white/90 flex-1">{line}</span>
              <span className="text-xs text-brand-cyan mt-2">{sub}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-orange">Explore →</span>
            </Link>
          ))}
        </div>
      </Section>

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
                [lwStore, 'Loveworld App Store'],
                [googlePlay, 'Google Play'],
                [appStore, 'App Store'],
              ].map(([img, label]) => (
                <a
                  key={label as string}
                  href="#"
                  className="website-btn-lift flex items-center gap-3 bg-white text-brand-navy rounded-2xl px-4 py-3 min-w-[160px]"
                >
                  <img src={img as string} alt="" className="h-10 w-auto" />
                  <span className="text-sm font-bold">{label as string}</span>
                </a>
              ))}
            </div>
            <Link to={WebsiteProductDesktopRoute} className="text-sm font-semibold text-brand-cyan hover:underline">
              Also on MacOS, Windows and Linux →
            </Link>
          </div>
        </div>
      </Section>
    </WebsiteLayout>
  );
}
