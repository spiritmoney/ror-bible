import React from "react";
import { motion } from "framer-motion";

export type LinkBadge = { label: string; href: string; icon?: string | React.ReactNode };
export type Bullet = string | { text: string; links?: LinkBadge[] };

export type Feature = {
  id: number;
  slugId?: string;
  title?: string;
  description?: string;
  bullets?: Bullet[];
  links?: LinkBadge[];
  image?: string;
};

type Props = {
  features: Feature[];
  imgW: number;
  imgH: number;
  isLg: boolean;
};

export default function FeaturesSection({ features, imgW, imgH, isLg }: Props) {
  const slideVariant = (direction: "left" | "right" = "left") => ({
    hidden: { opacity: 0, x: direction === "left" ? -80 : 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  });

  const imageLeftForPair = (index: number) => Math.floor(index / 2) % 2 === 0;

  // tweak this to scale images up/down slightly (no cropping — image is scaled inside same box)
  const IMAGE_SCALE = 0.92; // 0.92 = reduce to 92% of original

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16 select-none">
      <div className="space-y-16"> {/* tightened spacing between rows */}
        {features.map((feature, idx) => {
          const imageOnLeft = imageLeftForPair(idx);
          const peekPx = isLg ? (imageOnLeft ? -12 : 12) : 0;

          const imgWrapperClass = imageOnLeft ? "order-1 flex justify-center lg:justify-start" : "order-2 flex justify-center lg:justify-end";
          const textWrapperClass = imageOnLeft ? "order-2 flex items-center" : "order-1 flex items-center";

          const gridStyle: React.CSSProperties = isLg
            ? { gridTemplateColumns: `${imgW}px 1fr`, gridAutoRows: `${imgH}px`, alignItems: "center" }
            : {};

          return (
            <motion.div
              key={feature.id}
              id={feature.slugId}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={slideVariant(imageOnLeft ? "left" : "right")}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              style={isLg ? gridStyle : undefined}
            >
              {/* IMAGE */}
              {feature.image ? (
                <div
                  className={imgWrapperClass}
                  style={{ gridColumn: isLg ? (imageOnLeft ? "1" : "2") : undefined, gridRow: isLg ? "1" : undefined }}
                >
                  <div
                    className={`${imageOnLeft ? "lg:-ml-16 md:-ml-10 -ml-6" : "lg:-mr-16 md:-mr-10 -mr-6"}`}
                    style={{
                      width: isLg ? `${imgW}px` : "100%",
                      height: isLg ? `${imgH}px` : "auto",
                      minWidth: 0,
                      // combine horizontal peek with a scale to reduce image size slightly (no cropping)
                      transform: isLg ? `translateX(${peekPx}px) scale(${IMAGE_SCALE})` : undefined,
                      transformOrigin: "center",
                    }}
                  >
                    <img src={feature.image} alt={feature.title ?? `feature-${feature.id}`} className="w-full h-full object-cover" draggable={false} />
                  </div>
                </div>
              ) : (
                <div style={{ display: isLg ? "block" : "none" }} />
              )}

              {/* Text block (anchored to image side; internal content always left-aligned) */}
              <div
                className={textWrapperClass}
                style={{
                  gridColumn: isLg ? (imageOnLeft ? "2" : "1") : undefined,
                  gridRow: isLg ? "1" : undefined,
                  justifySelf: isLg ? (imageOnLeft ? "start" : "end") : undefined,
                }}
              >
                <div className="text-left" style={{ minWidth: 0, maxWidth: isLg ? "620px" : "100%", textAlign: "left" }}>
                  {feature.title && <h3 className="text-xl lg:text-2xl font-semibold mb-2">{feature.title}</h3>}

                  {/* reduced line-height here */}
                  {feature.description && <p className="text-[1.1rem] text-slate-700 leading-6 mb-3">{feature.description}</p>}

                  {/* BULLETS: supports both string[] and Bullet[] */}
                  {feature.bullets && feature.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-6 text-slate-700 space-y-2 mb-4"> {/* tighter spacing between bullets */}
                      {feature.bullets.map((b, i) => {
                        if (typeof b === "string") {
                          return (
                            <li key={i} className="text-base leading-6"> {/* tighter list line-height */}
                              {b}
                            </li>
                          );
                        }

                        return (
                          <li key={i} className="text-base leading-6">
                            <div>{b.text}</div>

                            {/* per-bullet links: kept inside li to avoid stray bullets/empty lines */}
                            {b.links && b.links.length > 0 && (
                              <div className="mt-2 flex gap-3 flex-wrap">
                                {b.links.map((ln, li) => (
                                  <a
                                    key={li}
                                    href={ln.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm bg-white"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    {ln.icon ? (
                                      typeof ln.icon === "string" ? (
                                        <img src={ln.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                                      ) : (
                                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{ln.icon}</span>
                                      )
                                    ) : null}
                                    <span className="text-slate-700">{ln.label}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Top-level links */}
                  {feature.links && feature.links.length > 0 && (
                    <div className="flex justify-start gap-3 flex-wrap mb-4">
                      {feature.links.map((ln, i) => (
                        <a
                          key={i}
                          href={ln.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm bg-white"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {ln.icon ? (
                            typeof ln.icon === "string" ? (
                              <img src={ln.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{ln.icon}</span>
                            )
                          ) : null}
                          <span className="text-slate-700">{ln.label}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* divider */}
                  <div className="mt-4">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
