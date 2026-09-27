import React from "react";
import { motion } from "framer-motion";

interface DeviceMockupProps {
  src: string;
  alt: string;
  className?: string;
}

export function DeviceMockup({ src, alt, className = "" }: DeviceMockupProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[300px] ${className}`}>
      {/* Outer shadow / glow */}
      <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-stroke/20 to-text-primary/10 opacity-50 blur-xl filter" />

      {/* The physical phone bezel */}
      <div className="relative aspect-[9/19.5] w-full rounded-[2.5rem] border-[8px] border-surface bg-bg shadow-2xl ring-1 ring-stroke overflow-hidden">
        
        {/* Notch / Dynamic Island */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-1/3 -translate-x-1/2 rounded-b-2xl bg-surface shadow-sm flex items-center justify-center">
          {/* Camera lens */}
          <div className="h-2 w-2 rounded-full bg-bg shadow-inner opacity-50" />
        </div>

        {/* Side Buttons */}
        <div className="absolute -left-[10px] top-24 h-12 w-[2px] rounded-l-md bg-stroke" />
        <div className="absolute -left-[10px] top-40 h-16 w-[2px] rounded-l-md bg-stroke" />
        <div className="absolute -right-[10px] top-32 h-20 w-[2px] rounded-r-md bg-stroke" />

        {/* Screen Content */}
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 z-10 bg-bg"
        >
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-top"
          />
        </motion.div>
      </div>
    </div>
  );
}
