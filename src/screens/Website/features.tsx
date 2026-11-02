// src/components/FeaturesSection.tsx
import React from "react";
import { motion } from "framer-motion";

type Feature = { id: number; description: string; image: string };

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

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16 select-none">
      <h2 className="text-[34px] font-semibold font-inter mb-10 text-center">Special Audio & Extra Features</h2>

      <div className="space-y-20">
        {features.map((feature, idx) => {
          const isLeft = idx % 2 === 0;
          const gridStyle: React.CSSProperties = isLg ? { gridTemplateColumns: `${imgW}px 1fr ${imgW}px`, gridAutoRows: `${imgH}px`, alignItems: "center" } : {};
          const peekPx = isLg ? (isLeft ? -12 : 12) : 0;

          return (
            <motion.div
              key={feature.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={slideVariant(isLeft ? "left" : "right")}
              // className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              // style={isLg ? gridStyle : undefined}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center"
              style={isLg ? { gridTemplateColumns: `${imgW}px 1fr ${imgW}px`, gridAutoRows: `${imgH}px` } : undefined}

            >
              {/* LEFT image col */}
              <div className={`${isLeft ? "flex" : "hidden"} justify-start items-center`}>
                <div style={{ width: isLg ? `${imgW}px` : "80%", maxWidth: 420, height: isLg ? `${imgH}px` : "auto" }}>
                  <img src={feature.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* center text */}
              {/* <div className="flex items-center">
                <div className={`w-full ${isLeft ? "pl-4 md:pl-6 lg:pl-6" : "pl-4 md:pl-6 lg:pl-12"}`} style={{ textAlign: "left" }}>
                  <p className="text-base md:text-[1.05rem] lg:text-[1.2rem] font-semibold leading-6 md:leading-7">{feature.description}</p>
                </div>
              </div> */}

              {/* CENTER text col */}
              <div className="flex items-center" style={isLg ? { gridColumn: "2", gridRow: "1", justifySelf: isLeft ? "start" : "end" } : undefined}>
                <div className={`w-full text-left ${isLeft ? "lg:pl-6 lg:pr-12" : "lg:pl-12 lg:pr-6"}`} style={{ minWidth: 0 }}>
                  <p className="text-[1.2rem] font-semibold leading-7">{feature.description}</p>
                </div>

                <div className="my-6">
                  <div className="w-full border-t border-2 border-slate-400" />
                </div>
              </div>

              {/* right image col */}
              <div className={`${!isLeft ? "flex" : "hidden"} justify-end items-center`} style={isLg ? { gridColumn: "3", gridRow: "1" } : undefined}>
                <div style={{ width: isLg ? `${imgW}px` : "80%", maxWidth: 420, height: isLg ? `${imgH}px` : "auto" }}>
                  <img src={feature.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
