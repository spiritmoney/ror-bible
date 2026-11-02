import React, { useEffect, useRef, useState } from "react";

type Slide = { id: string; image: string };
type Props = {
  slides: Slide[];
  intervalMs?: number;
  heightClass?: string; // e.g. "h-[420px] md:h-[520px]"
};

export default function Carousel({
  slides, intervalMs = 7000,
  // heightClass = "h-[420px]"
  heightClass="h-[115px] sm:h-[225px] md:h-[225px] lg:h-[420px]"

}: Props) {
  const timerRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, slides.length, intervalMs]);

  return (
    <div className={`relative ${heightClass} overflow-hidden`}>
      <div className="flex  transition-transform duration-900 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s) => (
          <div key={s.id} className="flex-shrink-0 w-full relative">
            <img src={s.image} alt={s.id} className="w-full h-auto object-cover" draggable={false} />
          </div>
        ))}
      </div>

      {/* simple dots (optional) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
