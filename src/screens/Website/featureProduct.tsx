// src/components/featureProduct.tsx
import React from 'react';
import { motion } from 'framer-motion';

export type LinkBadge = {
  label?: string;
  href: string;
  icon?: string | React.ReactNode;
};
export type Bullet = string | { text: string; links?: LinkBadge[] };
export type ActionDropdown = {
  label: string;
  items: Array<{ label: string; href: string }>;
};

export type ProductFeature = {
  id: number;
  slugId?: string;
  title?: string;
  title2?: string;
  subtitle?: string;
  description?: string | string[] | React.ReactNode;
  closingDescription?: string | string[] | React.ReactNode;
  bullets?: Bullet[];
  actionText?: string;
  actionLinks?: LinkBadge[];
  actionDropdown?: ActionDropdown;
  image?: string;
  imagePlacement?: 'aside' | 'below';
  imageSide?: 'left' | 'right';
  actionLinksPlacement?: 'inline' | 'belowText' | 'belowImage';
};

type Props = {
  features: ProductFeature[];
  imgW?: number;
  imgH?: number;
  isLg?: boolean;
};

const slideVariant = (direction: 'left' | 'right' = 'left') => ({
  hidden: { opacity: 0, x: direction === 'left' ? -60 : 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
});

export default function FeatureProduct({
  features,
  imgW = 420,
  imgH = 320,
  isLg,
}: Props) {
  const [large, setLarge] = React.useState<boolean>(() => {
    if (typeof isLg === 'boolean') return isLg;
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });

  React.useEffect(() => {
    if (typeof isLg === 'boolean') return;
    const handler = () => setLarge(window.innerWidth >= 1024);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [isLg]);

  const IMAGE_SCALE = 0.94;
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    const closeOnOutsideClick = () => setOpenDropdownId(null);
    window.addEventListener('click', closeOnOutsideClick);
    return () => window.removeEventListener('click', closeOnOutsideClick);
  }, []);

  const renderDescription = (desc?: string | string[] | React.ReactNode) => {
    if (!desc) return null;
    if (React.isValidElement(desc)) return <div className="mb-3">{desc}</div>;
    if (Array.isArray(desc)) {
      return (
        <div className="mb-3">
          {desc.map((p, i) => (
            <p key={i} className="text-[1.1rem] text-slate-700 leading-6 mb-3">
              {p}
            </p>
          ))}
        </div>
      );
    }
    const paragraphs = (desc as string)
      .split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);
    return (
      <div className="mb-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[1.1rem] text-slate-700 leading-6 mb-3">
            {p}
          </p>
        ))}
      </div>
    );
  };

  /**
   * ActionBadge
   *
   * Behavior:
   * - If ln.icon is a string (image URL) AND ln.label is missing => render the image directly (badge-like).
   * - If ln.label exists => render pill with optional icon to the left (icon can be image URL or React node).
   * - If ln.icon is a React node and ln.label is missing => render a small round icon-only pill.
   */
  const ActionBadge = ({ ln }: { ln: LinkBadge }) => {
    // full-image badge (no label) - good for store badges
    if (ln.icon && typeof ln.icon === 'string' && !ln.label) {
      return (
        <a
          href={ln.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ln.label ?? ln.href}
          className="inline-block"
          style={{ whiteSpace: 'nowrap' }}
        >
          <img
            src={ln.icon}
            alt={ln.label ?? ln.href}
            className="h-10 object-contain"
          />
        </a>
      );
    }

    // icon + label pill (default)
    if (ln.label) {
      return (
        <a
          href={ln.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ln.label}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[1.1rem] bg-white"
          style={{ whiteSpace: 'nowrap' }}
        >
          {ln.icon ? (
            typeof ln.icon === 'string' ? (
              <img src={ln.icon} alt="" className="w-5 h-5 flex-shrink-0" />
            ) : (
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {ln.icon}
              </span>
            )
          ) : null}
          <span className="text-slate-700">{ln.label}</span>
        </a>
      );
    }

    // icon-only pill (React node icon, no label)
    if (ln.icon && typeof ln.icon !== 'string' && !ln.label) {
      return (
        <a
          href={ln.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ln.href}
          className="inline-flex items-center justify-center rounded-full border p-2 bg-white"
          style={{ width: 40, height: 40 }}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            {ln.icon}
          </span>
        </a>
      );
    }

    // fallback: simple link with href text
    return (
      <a
        href={ln.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-700 underline text-[1.1rem]"
        aria-label={ln.href}
      >
        {ln.href}
      </a>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 select-none">
      <div className="space-y-20">
        {features.map(f => {
          const placement = f.imagePlacement ?? 'below';
          const imageSide = f.imageSide ?? 'right';
          const actionPlacement = f.actionLinksPlacement ?? 'inline';
          const slideFrom =
            placement === 'aside'
              ? imageSide === 'right'
                ? 'left'
                : 'right'
              : 'left';

          const gridStyle: React.CSSProperties =
            large && placement === 'aside'
              ? imageSide === 'left'
                ? { gridTemplateColumns: `${imgW}px 1fr`, alignItems: 'center' }
                : { gridTemplateColumns: `1fr ${imgW}px`, alignItems: 'center' }
              : {};

          const imageElement = f.image ? (
            <div
              style={{
                width: large ? `${imgW}px` : '100%',
                height: large ? `${imgH}px` : 'auto',
                transform: large ? `scale(${IMAGE_SCALE})` : undefined,
                transformOrigin: 'center',
              }}
            >
              <img
                src={f.image}
                alt={f.title ?? `product-feature-${f.id}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ) : null;

          return (
            <motion.div
              key={f.id}
              id={f.slugId}
              className={`grid grid-cols-1 ${large && placement === 'aside' ? 'lg:grid-cols-2' : ''} gap-6`}
              style={large && placement === 'aside' ? gridStyle : undefined}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideVariant(slideFrom)}
            >
              {/* aside-left image (DOM-first when left) */}
              {placement === 'aside' && imageSide === 'left' && f.image && (
                <div
                  style={{
                    gridColumn: large ? '1' : undefined,
                    gridRow: large ? '1' : undefined,
                  }}
                  className="flex justify-start items-center"
                >
                  {imageElement}
                  {actionPlacement === 'belowImage' &&
                    f.actionLinks &&
                    f.actionLinks.length > 0 && (
                      <div className="mt-3 flex gap-3 flex-wrap lg:flex-col lg:gap-2">
                        {f.actionLinks.map((ln, i) => (
                          <ActionBadgeWrap key={i} ln={ln} />
                        ))}
                      </div>
                    )}
                </div>
              )}

              {/* Text column */}
              <div
                className="flex items-center"
                style={{
                  gridColumn:
                    large && placement === 'aside'
                      ? imageSide === 'left'
                        ? '2'
                        : '1'
                      : undefined,
                }}
              >
                <div
                  style={{ maxWidth: large ? '720px' : '100%', minWidth: 0 }}
                >
                  <div className="flex lg:flex-row lg:items-baseline lg:gap-4 mb-2">
                    {f.title && (
                      <h3 className="text-[1.4rem] lg:text-[1.9rem] font-semibold leading-tight">
                        {f.title}
                      </h3>
                    )}
                    {f.title2 && (
                      <span className="text-[1.4rem] lg:text-[1.9rem] font-normal ml-2 leading-tight">
                        {f.title2}
                      </span>
                    )}
                  </div>

                  {f.subtitle && (
                    <div className="mb-3">
                      <div className="pl-3">
                        <div className="inline-flex items-center gap-3">
                          <div
                            style={{
                              width: 4,
                              height: 25,
                              backgroundColor: '#E6E9EE',
                            }}
                          />
                          <span className="text-[1.1rem] text-[#202020] font-semibold">
                            {f.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {renderDescription(f.description)}

                  {f.bullets && f.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-6 text-slate-700 space-y-4 mb-3">
                      {f.bullets.map((b, bi) => {
                        if (typeof b === 'string') {
                          return (
                            <li key={bi} className="text-[1.1rem] leading-6">
                              {b}
                            </li>
                          );
                        }
                        return (
                          <li key={bi} className="text-[1.1rem] leading-6">
                            <div>{b.text}</div>
                            {b.links && b.links.length > 0 && (
                              <div className="mt-2 flex gap-3 flex-wrap">
                                {b.links.map((ln, li) => (
                                  <ActionBadgeWrap key={li} ln={ln} />
                                ))}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {renderDescription(f.closingDescription)}

                  {/* Action text + inline badges */}
                  {(f.actionText || f.actionDropdown) &&
                    actionPlacement === 'inline' && (
                      <div className="flex items-center gap-4 mb-3 flex-wrap">
                        {f.actionText ? (
                          <div className="font-semibold text-sm">
                            {f.actionText}
                          </div>
                        ) : null}
                        {f.actionDropdown ? (
                          <ActionDropdownMenu
                            id={f.id}
                            dropdown={f.actionDropdown}
                            isOpen={openDropdownId === f.id}
                            setOpenDropdownId={setOpenDropdownId}
                          />
                        ) : null}
                        {f.actionLinks && f.actionLinks.length > 0 && (
                          <div className="flex gap-3 flex-wrap">
                            {f.actionLinks.map((ln, i) => (
                              <ActionBadgeWrap key={i} ln={ln} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  {/* belowText placement */}
                  {(f.actionText || f.actionDropdown) &&
                    actionPlacement === 'belowText' && (
                      <div className="mt-3">
                        {f.actionText ? (
                          <div className="font-semibold text-sm mb-2">
                            {f.actionText}
                          </div>
                        ) : null}
                        {f.actionDropdown ? (
                          <div className="mb-2">
                            <ActionDropdownMenu
                              id={f.id}
                              dropdown={f.actionDropdown}
                              isOpen={openDropdownId === f.id}
                              setOpenDropdownId={setOpenDropdownId}
                            />
                          </div>
                        ) : null}
                        {f.actionLinks && f.actionLinks.length > 0 && (
                          <div className="flex gap-3 flex-wrap">
                            {f.actionLinks.map((ln, i) => (
                              <ActionBadgeWrap key={i} ln={ln} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* aside-right image */}
              {placement === 'aside' && imageSide === 'right' && f.image && (
                <div
                  style={{
                    gridColumn: large ? '2' : undefined,
                    gridRow: large ? '1' : undefined,
                  }}
                  className="flex justify-end items-center"
                >
                  <div>
                    {imageElement}
                    {actionPlacement === 'belowImage' &&
                      f.actionLinks &&
                      f.actionLinks.length > 0 && (
                        <div className="mt-3 flex gap-3 flex-wrap">
                          {f.actionLinks.map((ln, i) => (
                            <ActionBadgeWrap key={i} ln={ln} />
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* imagePlacement === 'below' */}
              {placement === 'below' && f.image && (
                <div className="col-span-1 lg:col-span-2 flex justify-center lg:justify-start items-center">
                  <div
                    style={{
                      width: large ? `${imgW}px` : '100%',
                      height: large ? `${imgH}px` : 'auto',
                      transform: large ? `scale(${IMAGE_SCALE})` : undefined,
                    }}
                  >
                    <img
                      src={f.image}
                      alt={f.title ?? `product-feature-${f.id}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {actionPlacement === 'belowImage' &&
                    f.actionLinks &&
                    f.actionLinks.length > 0 && (
                      <div className="mt-3 flex gap-3 flex-wrap">
                        {f.actionLinks.map((ln, i) => (
                          <ActionBadgeWrap key={i} ln={ln} />
                        ))}
                      </div>
                    )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Small wrapper to avoid duplicating ActionBadge markup in multiple places.
 * Kept outside main return for readability.
 */
function ActionBadgeWrap({ ln }: { ln: LinkBadge }) {
  // full-image badge (no label)
  if (ln.icon && typeof ln.icon === 'string' && !ln.label) {
    return (
      <a
        href={ln.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ln.label ?? ln.href}
        className="inline-block"
        style={{ whiteSpace: 'nowrap' }}
      >
        <img
          src={ln.icon}
          alt={ln.label ?? ln.href}
          className="h-10 object-contain"
        />
      </a>
    );
  }

  // icon + label pill
  if (ln.label) {
    return (
      <a
        href={ln.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ln.label}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm bg-white"
        style={{ whiteSpace: 'nowrap' }}
      >
        {ln.icon ? (
          typeof ln.icon === 'string' ? (
            <img src={ln.icon} alt="" className="w-5 h-5 flex-shrink-0" />
          ) : (
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {ln.icon}
            </span>
          )
        ) : null}
        <span className="text-slate-700">{ln.label}</span>
      </a>
    );
  }

  // icon-only pill (React node icon)
  if (ln.icon && typeof ln.icon !== 'string') {
    return (
      <a
        href={ln.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ln.href}
        className="inline-flex items-center justify-center rounded-full border p-2 bg-white"
        style={{ width: 40, height: 40 }}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {ln.icon}
        </span>
      </a>
    );
  }

  // fallback
  return (
    <a
      href={ln.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-700 underline text-sm"
      aria-label={ln.href}
    >
      {ln.href}
    </a>
  );
}

function ActionDropdownMenu({
  id,
  dropdown,
  isOpen,
  setOpenDropdownId,
}: {
  id: number;
  dropdown: ActionDropdown;
  isOpen: boolean;
  setOpenDropdownId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <div className="relative inline-block" onClick={e => e.stopPropagation()}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpenDropdownId(prev => (prev === id ? null : id))}
        className="inline-flex items-center gap-2 rounded-full border border-[#989898] px-4 py-1 text-sm font-semibold bg-white text-[#303030]"
      >
        <span>{dropdown.label}</span>
        <span className="text-[11px]">{isOpen ? '▲' : '▼'}</span>
      </button>

      <div
        className={`absolute left-0 mt-2 min-w-[180px] rounded-[12px] border border-[#D7D7D7] bg-white shadow-md transition-all duration-300 origin-top z-30 ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {dropdown.items.map((item, idx) => (
          <a
            key={`${item.href}-${idx}`}
            href={item.href}
            className="block px-4 py-2 text-[13px] text-[#3A3A3A] hover:bg-[#F5F5F5]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
