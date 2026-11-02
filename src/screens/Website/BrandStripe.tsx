import React from 'react';

export default function BrandStripe() {
  return (
    <div aria-hidden="true">
      <div className="h-0.5 bg-brand-cyan" />
      <div className="h-1.5 bg-brand-blue" />
      <div className="h-0.5 bg-brand-orange" />
    </div>
  );
}
