import React, { FormEvent, useState } from 'react';
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

      <Section className="bg-white">
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[lwStore, googlePlay, appStore].map((img, i) => (
            <a key={i} href="#" className="website-card-lift flex items-center gap-3 p-4 rounded-2xl border border-brand-mist bg-brand-pale">
              <img src={img} alt="" className="h-12 w-auto" />
              <span className="font-bold text-brand-navy">Download</span>
            </a>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            [WebsiteProductWebRoute, 'Web', bibleOnline],
            [WebsiteProductMobileRoute, 'Mobile', bibleOnline],
            [WebsiteProductDesktopRoute, 'Desktop', bibleOnline],
            [WebsiteProductVoiceRoute, 'Voice', bibleOnline],
          ].map(([to, label, img]) => (
            <WebsiteButton key={to as string} to={to as string} variant="secondary" className="flex-col !h-auto py-6">
              <img src={img as string} alt="" className="w-full h-24 object-cover rounded-xl mb-3" />
              Explore {label as string}
            </WebsiteButton>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 mt-10 justify-center">
          {[macos, windows, linux].map((img) => (
            <img key={img} src={img} alt="" className="h-10 w-auto opacity-90" />
          ))}
        </div>
      </Section>

      <Section id="support" className="bg-brand-pale">
        <h2 className="text-3xl font-extrabold text-brand-navy">Technical support</h2>
        <p className="mt-3 text-brand-ink max-w-2xl">
          Contact support from inside the ROR Bible+ app, or use the form below. This form is UI-only until connected to your handler.
        </p>
      </Section>

      <Section id="contact" className="bg-white">
        <h2 className="text-3xl font-extrabold text-brand-navy mb-6">Contact us</h2>
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
      </Section>
    </WebsiteLayout>
  );
}
