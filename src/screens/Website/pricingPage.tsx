import React, { useEffect } from 'react';
import WebsiteLayout from './WebsiteLayout';
import PricingMain from './pricingMain';

export default function PricingPage(): JSX.Element {
  useEffect(() => {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-period]'),
    );
    const onClick = (b: HTMLButtonElement) => {
      buttons.forEach((x) => {
        const on = x === b;
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
        x.style.background = on ? '#19688B' : 'transparent';
        x.style.color = on ? '#FFFFFF' : '#19688B';
      });
      document.querySelectorAll('[data-per]').forEach((p) => {
        p.textContent = b.getAttribute('data-period') === 'yearly' ? '/ year' : '/ month';
      });
    };
    const handlers = buttons.map((b) => {
      const handler = () => onClick(b);
      b.addEventListener('click', handler);
      return { b, handler };
    });
    return () => {
      handlers.forEach(({ b, handler }) => b.removeEventListener('click', handler));
    };
  }, []);

  return (
    <WebsiteLayout>
      <PricingMain />
    </WebsiteLayout>
  );
}

export { PLACEHOLDER_PRICES } from './pricingMain';
