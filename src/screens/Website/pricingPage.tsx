import React, { useState } from 'react';
import clsx from 'clsx';
import WebsiteLayout from './WebsiteLayout';
import PageHero from './PageHero';
import Section from './Section';
import WebsiteButton from './WebsiteButton';
import { WebsiteDownloadRoute } from './websitePaths';

type Period = 'monthly' | 'yearly';

const PLACEHOLDER_PRICES = ['[PRICE]', '[PRICE]', '[PRICE]'] as const;

const plans = [
  {
    name: 'Free',
    tagline: 'For everyday reading',
    price: 'Free',
    showPeriod: false,
    cta: 'Download free',
    variant: 'secondary' as const,
    features: [
      'Read Scripture in available editions',
      'Highlights, notes and bookmarks',
      'Cloud sync with your ROR Bible+ account',
      'Exact-word and any-word Bible search',
    ],
    dark: false,
  },
  {
    name: 'Premium',
    tagline: 'For deeper personal study',
    price: PLACEHOLDER_PRICES[0],
    showPeriod: true,
    cta: 'Choose Premium',
    variant: 'secondary' as const,
    features: [
      'Everything in Free',
      'Parallel study and verse comparison',
      'Hebrew and Greek study resources',
      'Audio Bible and Read-to-Me',
      'Colour search and study layouts',
    ],
    dark: false,
  },
  {
    name: 'Pro',
    tagline: 'For students and ministers',
    badge: 'For ministers',
    price: PLACEHOLDER_PRICES[1],
    showPeriod: true,
    cta: 'Choose Pro',
    variant: 'primary' as const,
    features: [
      'Everything in Premium',
      'Solution Search: Student Agent and Minister Agent',
      '@Pulpit sermon preparation workspace',
      'Voice notes',
    ],
    dark: false,
  },
  {
    name: 'Max',
    tagline: 'The complete ROR Bible+',
    badge: 'Everything included',
    price: PLACEHOLDER_PRICES[2],
    showPeriod: true,
    cta: 'Choose Max',
    variant: 'primary' as const,
    features: [
      'Everything in Pro',
      'Pastor Chris Audio Bible and commentaries',
      'ROAR Study Bible',
      'All available licensed resources',
    ],
    dark: true,
  },
];

const faqs = [
  {
    q: 'Which features need a subscription?',
    a: 'Some features and resources require a subscription. Available editions, audio, resources and functions depend on your plan, content catalogue and supported device.',
  },
  {
    q: 'Can I use one account on all my devices?',
    a: 'Yes. With your ROR Bible+ account, your notes, highlights and bookmarks sync across supported devices.',
  },
  {
    q: 'Do I need an internet connection?',
    a: 'Online services require an internet connection. Bible Lite, the progressive web app, offers offline access to your Bible study.',
  },
  {
    q: 'How do I get help?',
    a: 'Contact support from inside the ROR Bible+ app, or reach us through the Support page.',
  },
];

export default function PricingPage(): JSX.Element {
  const [period, setPeriod] = useState<Period>('monthly');
  const periodSuffix = period === 'yearly' ? '/ year' : '/ month';

  return (
    <WebsiteLayout>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Start free. Go as deep as <span className="text-brand-orange">you study.</span>
          </>
        }
        description="Four plans: Free, Premium, Pro and Max. Download for free, then choose the plan that matches how deeply you study."
      />

      <Section className="bg-white">
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full border-2 border-brand-blue p-1" role="group" aria-label="Billing period">
            {(['monthly', 'yearly'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                className={clsx(
                  'px-6 py-2 rounded-full text-sm font-bold capitalize transition-colors',
                  period === p ? 'bg-brand-blue text-white' : 'text-brand-blue bg-transparent'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(
                'rounded-3xl p-6 flex flex-col border',
                plan.dark ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white border-brand-mist shadow-sm'
              )}
            >
              {plan.badge ? (
                <span className="text-xs font-extrabold uppercase tracking-wide text-brand-orange mb-2">{plan.badge}</span>
              ) : (
                <span className="h-5" />
              )}
              <h2 className="text-2xl font-extrabold">{plan.name}</h2>
              <p className={clsx('text-sm mt-1', plan.dark ? 'text-white/80' : 'text-brand-ink')}>{plan.tagline}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                {plan.showPeriod ? <span className="text-sm font-semibold">{periodSuffix}</span> : null}
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <span className="text-brand-teal">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <WebsiteButton to={WebsiteDownloadRoute} variant={plan.variant} className="w-full justify-center mt-6">
                {plan.cta}
              </WebsiteButton>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-brand-ink max-w-3xl mx-auto">
          Available editions, audio, resources and functions depend on your plan, content catalogue and supported device.
        </p>
      </Section>

      <Section className="bg-brand-pale">
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand-blue">Questions</p>
        <h2 className="mt-2 text-3xl font-extrabold text-brand-navy mb-8">Plans and access</h2>
        <div className="space-y-3 max-w-3xl">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-2xl bg-white border border-brand-mist p-4 group">
              <summary className="font-bold text-brand-navy cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-brand-orange group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-brand-ink leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </WebsiteLayout>
  );
}

export { PLACEHOLDER_PRICES };
