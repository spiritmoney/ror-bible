import React, { useEffect } from 'react';
import WebsiteLayout from './WebsiteLayout';
import PricingMain, { PRICING_YEARLY_MONTHS } from './pricingMain';

function formatPlanPrice(monthly: number, yearly: boolean): string {
  if (!yearly) {
    return `$${monthly.toFixed(2)}`;
  }
  const elevenMonths = monthly * PRICING_YEARLY_MONTHS;
  const dollars = Math.floor(elevenMonths + 1e-9);
  return `$${dollars}.99`;
}

export default function PricingPage(): JSX.Element {
  useEffect(() => {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[data-period]'),
    );

    const applyPeriod = (yearly: boolean) => {
      document.querySelectorAll<HTMLElement>('[data-per]').forEach((p) => {
        p.textContent = yearly ? '/ year' : '/ month';
      });
      document.querySelectorAll<HTMLElement>('[data-monthly]').forEach((el) => {
        const monthly = Number.parseFloat(el.getAttribute('data-monthly') || '');
        if (!Number.isFinite(monthly)) return;
        el.textContent = formatPlanPrice(monthly, yearly);
      });
    };

    const onClick = (b: HTMLButtonElement) => {
      const yearly = b.getAttribute('data-period') === 'yearly';
      buttons.forEach((x) => {
        const on = x === b;
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
        x.style.background = on ? '#19688B' : 'transparent';
        x.style.color = on ? '#FFFFFF' : '#19688B';
      });
      applyPeriod(yearly);
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

export { PLACEHOLDER_PRICES, PRICING_MONTHLY_USD, PRICING_YEARLY_MONTHS } from './pricingMain';
