"use client";

import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";

export function ScrollDrivenTimeline({ steps }: { steps: { title: string, text: string, tool?: string }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <div ref={containerRef} className="relative py-10 max-w-3xl mx-auto">
      {/* SVG Line Background */}
      <div className="absolute left-6 md:left-[39px] top-10 bottom-10 w-[2px] bg-stroke/30" />

      {/* SVG Line Animated */}
      <motion.div
        style={{ scaleY: scrollYProgress }}
        className="absolute left-6 md:left-[39px] top-10 bottom-10 w-[2px] bg-text-primary origin-top"
      />

      <div className="flex flex-col gap-24 relative z-10">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-8 md:gap-12 items-start relative">
            <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 bg-surface border-2 border-stroke rounded-full flex items-center justify-center font-display text-xl md:text-3xl text-text-primary z-10 relative">
              {i + 1}
            </div>
            <div className="pt-2 md:pt-4">
              <h3 className="font-display text-2xl md:text-3xl italic text-text-primary mb-2">{step.title}</h3>
              {step.tool && <p className="text-xs font-bold uppercase tracking-widest text-[#89AACC] mb-4">{step.tool}</p>}
              <p className="text-muted leading-relaxed md:text-lg">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
