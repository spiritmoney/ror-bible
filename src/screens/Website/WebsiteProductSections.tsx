import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import Card from './Card';
import {
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import type { ProductPlatform } from './productPlatformPage';

const OTHER_PLATFORMS: Record<
  ProductPlatform,
  { route: string; label: string }[]
> = {
  web: [
    { route: WebsiteProductMobileRoute, label: 'Mobile' },
    { route: WebsiteProductDesktopRoute, label: 'Desktop' },
    { route: WebsiteProductVoiceRoute, label: 'Voice' },
  ],
  mobile: [
    { route: WebsiteProductWebRoute, label: 'Web' },
    { route: WebsiteProductDesktopRoute, label: 'Desktop' },
    { route: WebsiteProductVoiceRoute, label: 'Voice' },
  ],
  desktop: [
    { route: WebsiteProductMobileRoute, label: 'Mobile' },
    { route: WebsiteProductWebRoute, label: 'Web' },
    { route: WebsiteProductVoiceRoute, label: 'Voice' },
  ],
  voice: [
    { route: WebsiteProductMobileRoute, label: 'Mobile' },
    { route: WebsiteProductWebRoute, label: 'Web' },
    { route: WebsiteProductDesktopRoute, label: 'Desktop' },
  ],
};

export function WebsiteProductWhatYouGet({
  bullets,
  image,
  imageAlt,
}: {
  bullets: string[];
  image: string;
  imageAlt: string;
}) {
  return (
    <Section className="bg-white">
      <p className="text-xs font-extrabold uppercase tracking-wide text-brand-blue">Highlights</p>
      <span className="block w-[52px] h-[5px] rounded-sm bg-brand-orange mt-1 mb-4" aria-hidden />
      <h2 className="text-3xl font-extrabold text-brand-navy mb-8">What you get</h2>
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <ul className="space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-brand-navy font-semibold">
              <span className="text-brand-teal">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <div className="rounded-3xl overflow-hidden shadow-brand-card">
          <img src={image} alt={imageAlt} className="w-full h-auto" />
        </div>
      </div>
    </Section>
  );
}

export function WebsiteProductInstallPwa() {
  return (
    <Section className="bg-brand-pale">
      <h2 className="text-3xl font-extrabold text-brand-navy">
        Install once. Carry <span className="text-brand-orange">everywhere.</span>
      </h2>
      <p className="mt-4 text-brand-ink max-w-2xl">
        Add Bible Lite to your home screen for quick access and offline reading where supported.
      </p>
    </Section>
  );
}

export function WebsiteProductAlsoAvailable({ platform }: { platform: ProductPlatform }) {
  const links = OTHER_PLATFORMS[platform];
  return (
    <Section className="bg-white border-t border-brand-mist">
      <h2 className="text-3xl font-extrabold text-brand-navy mb-8">Also available on</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {links.map(({ route, label }) => (
          <Link key={route} to={route}>
            <Card className="website-card-lift p-6 text-center font-extrabold text-brand-navy">{label}</Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
