import React from 'react';

export type MarketingBandTone = 'white' | 'alt';

function bandClass(tone: MarketingBandTone) {
  return tone === 'white' ? 'mkt-band-white' : 'mkt-band-alt';
}

export function renderBulletWithLabel(text: string) {
  const colonIdx = text.indexOf(':');
  if (colonIdx > 0 && colonIdx < 80) {
    const label = text.slice(0, colonIdx + 1);
    const rest = text.slice(colonIdx + 1);
    return (
      <>
        <strong className="font-bold text-brand-navy">{label}</strong>
        {rest}
      </>
    );
  }
  return text;
}

export function SourceBulletList({ items }: { items: string[] }) {
  return (
    <ul className="mkt-list mkt-source-list">
      {items.map((item) => (
        <li key={item}>{renderBulletWithLabel(item)}</li>
      ))}
    </ul>
  );
}

type MarketingSourceBandProps = {
  id?: string;
  tone: MarketingBandTone;
  title: string;
  image?: string;
  imageAlt?: string;
  /** Full-width image only (e.g. appreciation banner). */
  imageOnly?: boolean;
  children?: React.ReactNode;
};

export default function MarketingSourceBand({
  id,
  tone,
  title,
  image,
  imageAlt,
  imageOnly,
  children,
}: MarketingSourceBandProps) {
  if (image && imageOnly) {
    return (
      <section id={id} className={`mkt-section ${bandClass(tone)}`}>
        <div className="mkt-container mkt-band-media-center">
          <img src={image} alt={imageAlt || title} className="mkt-src-img" loading="lazy" />
        </div>
      </section>
    );
  }

  if (!image) {
    return (
      <section id={id} className={`mkt-section ${bandClass(tone)}`}>
        <div className="mkt-container mkt-band-copy mkt-band-centered">
          <h2 className="mkt-band-title">{title}</h2>
          {children ? <div className="mkt-band-content">{children}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={`mkt-section ${bandClass(tone)}`}>
      <div className="mkt-container mkt-split-47 mkt-split-balanced">
        <img src={image} alt={imageAlt || title} className="mkt-src-img" loading="lazy" />
        <div className="mkt-band-copy mkt-band-copy--col">
          <h2 className="mkt-band-title">{title}</h2>
          {children ? <div className="mkt-band-content">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
