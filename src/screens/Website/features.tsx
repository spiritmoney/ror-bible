// Legacy home features section (unused by new landing; kept for reference).
import React from "react";

type Feature = { id: number; description: string; image: string };

type Props = {
  features: Feature[];
  imgW: number;
  imgH: number;
  isLg: boolean;
};

export default function FeaturesSection({ features, imgW, imgH, isLg }: Props) {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16 select-none">
      <h2 className="text-[34px] font-semibold font-montserrat mb-10 text-center">Special Audio & Extra Features</h2>

      <div className="space-y-20">
        {features.map((feature, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <div
              key={feature.id}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center motion-safe:transition-opacity motion-safe:duration-500"
              style={isLg ? { gridTemplateColumns: `${imgW}px 1fr ${imgW}px`, gridAutoRows: `${imgH}px` } : undefined}
            >
              <div className={`${isLeft ? "flex" : "hidden"} justify-start items-center`}>
                <div style={{ width: isLg ? `${imgW}px` : "80%", maxWidth: 420, height: isLg ? `${imgH}px` : "auto" }}>
                  <img src={feature.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="flex items-center" style={isLg ? { gridColumn: "2", gridRow: "1", justifySelf: isLeft ? "start" : "end" } : undefined}>
                <div className={`w-full text-left ${isLeft ? "lg:pl-6 lg:pr-12" : "lg:pl-12 lg:pr-6"}`} style={{ minWidth: 0 }}>
                  <p className="text-[1.2rem] font-semibold leading-7">{feature.description}</p>
                </div>

                <div className="my-6">
                  <div className="w-full border-t border-2 border-slate-400" />
                </div>
              </div>

              <div className={`${!isLeft ? "flex" : "hidden"} justify-end items-center`} style={isLg ? { gridColumn: "3", gridRow: "1" } : undefined}>
                <div style={{ width: isLg ? `${imgW}px` : "80%", maxWidth: 420, height: isLg ? `${imgH}px` : "auto" }}>
                  <img src={feature.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
