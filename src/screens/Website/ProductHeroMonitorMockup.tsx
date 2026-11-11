import React from 'react';
import bibleOnline from '../../assets/website/new/bible-online-reader.jpg';

type ProductHeroMonitorMockupProps = {
  imageAlt?: string;
};

export default function ProductHeroMonitorMockup({
  imageAlt = 'ROR Bible+ study workspace on a desktop monitor',
}: ProductHeroMonitorMockupProps) {
  return (
    <div className="u1c0f7c">
      <div className="u20d6c8">
        <div className="u21ba85">
          <img className="u064c8c" src={bibleOnline} alt={imageAlt} loading="lazy" />
        </div>
        <div className="u8df831" aria-hidden="true" />
        <div className="ud68c8f" aria-hidden="true" />
      </div>
    </div>
  );
}
