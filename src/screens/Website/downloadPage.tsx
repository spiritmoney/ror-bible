import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import PageHero from './PageHero';
import Section from './Section';
import WebsiteButton from './WebsiteButton';
import {
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import lwStore from '../../assets/website/new/loveworld-app-store.png';
import googlePlay from '../../assets/website/new/google-play.png';
import appStore from '../../assets/website/new/app-store.png';
import macos from '../../assets/website/new/macos.png';
import windows from '../../assets/website/new/windows.png';
import linux from '../../assets/website/new/linux.png';
import bibleOnline from '../../assets/website/new/bible-online-reader.jpg';

const DEVICES = [
  {
    title: 'ROR Bible+ Mobile',
    body: 'The Word wherever you go. Android and iOS.',
    route: WebsiteProductMobileRoute,
    stores: [lwStore, googlePlay, appStore],
  },
  {
    title: 'ROR Bible+ Web',
    body: 'Open your browser. Open the Word. Bible Online and Bible Lite (PWA).',
    route: WebsiteProductWebRoute,
    image: bibleOnline,
  },
  {
    title: 'ROR Bible+ Desktop',
    body: 'More room for deeper study. MacOS, Windows and Linux.',
    route: WebsiteProductDesktopRoute,
    os: [macos, windows, linux],
  },
  {
    title: 'ROR Bible+ Voice',
    body: 'Speak. Listen. Engage with the Word. Amazon Alexa and Google Home.',
    route: WebsiteProductVoiceRoute,
  },
] as const;

export default function DownloadPage(): JSX.Element {
  const [formNote, setFormNote] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormNote('Thank you. Support will connect this form to a handler before go-live.');
  };

  return (
    <WebsiteLayout>
      <PageHero
        eyebrow="Download"
        title={
          <>
            Get ROR Bible+ on <span className="text-brand-orange">every device.</span>
          </>
        }
        description="Free to download. Some features and resources require a subscription."
      />

      {DEVICES.map((device, idx) => (
        <Section key={device.title} className={idx % 2 === 0 ? 'bg-white' : 'bg-brand-pale'}>
          <h2 className="text-3xl font-extrabold text-brand-navy">{device.title}</h2>
          <p className="mt-3 text-brand-ink max-w-2xl">{device.body}</p>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            {'stores' in device && device.stores
              ? device.stores.map((img, i) => (
                  <a key={i} href="#" className="website-card-lift flex items-center gap-3 p-4 rounded-2xl border border-brand-mist bg-brand-pale">
                    <img src={img} alt="" className="h-12 w-auto" />
                    <span className="font-bold text-brand-navy">Download</span>
                  </a>
                ))
              : null}
            {'image' in device && device.image ? (
              <img src={device.image} alt="" className="rounded-2xl shadow-brand-card max-w-md w-full h-auto" />
            ) : null}
            {'os' in device && device.os
              ? device.os.map((img) => <img key={img} src={img} alt="" className="h-10 w-auto" />)
              : null}
            <WebsiteButton to={device.route} variant="secondary">
              Explore
            </WebsiteButton>
          </div>
        </Section>
      ))}

      <Section id="support" className="bg-brand-pale">
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand-blue">Support</p>
        <h2 className="mt-2 text-3xl font-extrabold text-brand-navy">
          We are here to <span className="text-brand-orange">help.</span>
        </h2>
        <p className="mt-3 text-brand-ink max-w-2xl">
          Contact support from inside the ROR Bible+ app, or use the form below.
        </p>
      </Section>

      <Section id="contact" className="bg-white">
        <h2 className="text-3xl font-extrabold text-brand-navy mb-6">Send us a message</h2>
        <form onSubmit={onSubmit} className="max-w-xl grid gap-4">
          <label className="grid gap-1 text-sm font-semibold">
            Name
            <input required className="h-11 px-3 rounded-xl border border-brand-mist bg-brand-pale" name="name" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Email
            <input required type="email" className="h-11 px-3 rounded-xl border border-brand-mist bg-brand-pale" name="email" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Message
            <textarea required rows={5} className="px-3 py-2 rounded-xl border border-brand-mist bg-brand-pale" name="message" />
          </label>
          <WebsiteButton type="submit" className="w-fit">
            Send message
          </WebsiteButton>
          {formNote ? <p className="text-sm text-brand-teal font-semibold">{formNote}</p> : null}
        </form>
        <Link to="/store" className="inline-block mt-6 text-sm font-semibold text-brand-blue">
          Visit the Store →
        </Link>
      </Section>
    </WebsiteLayout>
  );
}
