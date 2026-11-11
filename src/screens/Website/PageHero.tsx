import React from 'react';
import clsx from 'clsx';
import Section from './Section';

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  /** Flat mist band without decorative waves (About / Partner / Give). */
  variant?: 'default' | 'flat';
};

export function HeroWaves() {
  return (
    <svg
      className="website-hero-waves absolute left-0 right-0 bottom-0 w-full h-40"
      aria-hidden
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
    >
      <path
        d="M0 120 C 360 40, 720 150, 1440 60 L1440 160 L0 160 Z"
        fill="#07BDD2"
        opacity="0.10"
      />
      <path
        d="M0 132 C 380 60, 760 160, 1440 78"
        fill="none"
        stroke="#099DB2"
        strokeWidth="22"
        opacity="0.55"
      />
      <path
        d="M0 112 C 380 40, 760 140, 1440 56"
        fill="none"
        stroke="#FF5900"
        strokeWidth="3"
      />
      <path
        d="M0 150 C 380 80, 760 176, 1440 98"
        fill="none"
        stroke="#07BDD2"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Eyebrow({
  children,
  flat = false,
}: {
  children: React.ReactNode;
  flat?: boolean;
}) {
  if (flat) {
    return (
      <>
        <p className="mkt-eyebrow">{children}</p>
        <span className="mkt-eyebrow-bar" aria-hidden />
      </>
    );
  }
  return (
    <>
      <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-brand-blue">
        {children}
      </p>
      <span className="block w-[52px] h-[5px] rounded-sm bg-brand-orange mt-1" aria-hidden />
    </>
  );
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  description,
  actions,
  className,
  variant = 'default',
}: Props) {
  if (variant === 'flat') {
    return (
      <section className={clsx('mkt-hero-flat', className)}>
        <div className="mkt-container">
          <Eyebrow flat>{eyebrow}</Eyebrow>
          <h1 className="mkt-h1">{title}</h1>
          {subtitle ? (
            <p className="mt-3 text-xl font-bold text-brand-navy">{subtitle}</p>
          ) : null}
          {description ? <p className="mkt-hero-intro">{description}</p> : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <Section pad="hero" className={clsx('relative bg-brand-pale overflow-hidden', className)}>
      <HeroWaves />
      <div className="relative z-[1] max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-website-hero-page website-sm:text-[42px] font-extrabold text-brand-blue leading-[1.05] tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-2xl website-sm:text-xl font-bold text-brand-navy">{subtitle}</p>
        ) : null}
        {description ? (
          <p className="mt-4 text-lg text-brand-ink leading-relaxed max-w-2xl">{description}</p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </div>
    </Section>
  );
}
