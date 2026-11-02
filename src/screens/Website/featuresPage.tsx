import React from 'react';
import WebsiteLayout from './WebsiteLayout';
import PageHero from './PageHero';
import Section from './Section';
import WebsiteButton from './WebsiteButton';
import { WebsiteDownloadRoute, WebsitePricingRoute } from './websitePaths';
import { WEBSITE_FEATURES } from './websiteFeaturesData';

export default function FeaturesPage(): JSX.Element {
  return (
    <WebsiteLayout>
      <PageHero
        eyebrow="Features"
        title={
          <>
            Ten ways to go deeper in <span className="text-brand-orange">the Word.</span>
          </>
        }
        description="Reading, research, ministry and audio, all completed and working together in one premium Bible experience."
        actions={
          <>
            <WebsiteButton to={WebsiteDownloadRoute}>Get the app</WebsiteButton>
            <WebsiteButton to={WebsitePricingRoute} variant="secondary">
              See pricing
            </WebsiteButton>
          </>
        }
      />

      <Section pad="tight" className="bg-white border-b border-brand-mist">
        <div className="flex flex-wrap gap-2">
          {WEBSITE_FEATURES.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-brand-mist text-sm font-semibold text-brand-navy hover:bg-brand-pale"
            >
              {f.label}
            </a>
          ))}
        </div>
      </Section>

      {WEBSITE_FEATURES.map((f, idx) => (
        <Section
          key={f.id}
          id={f.id}
          className={idx % 2 === 0 ? 'bg-brand-pale' : 'bg-white'}
        >
          <div className={`grid lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? '' : ''}`}>
            <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
              <span className="text-sm font-extrabold text-brand-teal">
                {f.num} · {f.label}
              </span>
              <h2 className="mt-3 text-3xl website-sm:text-[28px] font-extrabold text-brand-navy">{f.title}</h2>
              <p className="mt-3 text-brand-ink">{f.description}</p>
              <ul className="mt-4 space-y-2">
                {f.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-brand-navy">
                    <span className="text-brand-teal font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl overflow-hidden shadow-brand-card ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <img src={f.image} alt={f.alt} className="w-full h-auto" />
            </div>
          </div>
        </Section>
      ))}
    </WebsiteLayout>
  );
}
