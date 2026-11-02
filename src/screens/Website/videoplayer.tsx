import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  triggerOffset?: number;
  width?: number | string;
  className?: string;
};

export default function FloatingVideoPlayer({
  src,
  poster,
  triggerOffset = 400,
  width = "700px",
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [floatingRect, setFloatingRect] = useState<DOMRect | null>(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const currentRect = containerRef.current.getBoundingClientRect();
      const scrolledPast = currentRect.bottom < triggerOffset;
      if (scrolledPast && !showFloating) {
        setFloatingRect(currentRect); // measure BEFORE showing
        setShowFloating(true);
      } else if (!scrolledPast && showFloating) {
        setShowFloating(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerOffset, showFloating]);

  return (
    <>
      {/* Inline player */}
      <div
        ref={containerRef}
        className={`w-full mx-auto ${className}`}
        style={{ maxWidth: width }}
      >
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          className="w-full mb-5 h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Floating animated version */}
      <AnimatePresence>
        {showFloating && floatingRect && (
          <motion.div
            initial={{
              position: "fixed",
              top: floatingRect.top,
              left: floatingRect.left,
              width: floatingRect.width,
              height: floatingRect.height,
              opacity: 1,
            }}
            animate={{
              top: "auto",
              bottom: 20,
              right: 20,
              left: "auto",
              width: 320,
              height: "auto",
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 120,
                damping: 18,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.3 },
            }}
            className="fixed z-[9999] shadow-2xl rounded-lg overflow-hidden bg-white"
          >
            <video
              src={src}
              poster={poster}
              controls
              playsInline
            //   muted
              className="w-full h-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
