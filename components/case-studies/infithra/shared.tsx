"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* Infithra brand, from infithra.com's own CSS and logo SVG:
   purple #482084 / #361863 / #170c34, pink #fc1777, logo gradient #3A86FF → #492D82 → #FC1776 → #FF8001. */
export const PURPLE = "#8d6dcf"; // inf-400, purple lifted for dark surfaces
export const PINK = "#fc1777";
export const BLUE = "#3a86ff";
export const ORANGE = "#ff8001";
export const LOGO_GRADIENT = "linear-gradient(120deg, #3A86FF 0%, #492D82 38%, #FC1776 72%, #FF8001 100%)";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

export const mono = "font-mono text-[10px] md:text-[11px] tracking-wide";

export function useTicker(length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms]);
  return i;
}

/** The logo's chevron gradient, used as a thin ribbon between chapters. */
export function Ribbon({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`h-[3px] w-full opacity-70 ${className}`} style={{ backgroundImage: LOGO_GRADIENT }} />;
}

/** Chapter heading, labelled with the platform module it belongs to. */
export function Chapter({ module, title, children }: { module: string; title: string; children?: React.ReactNode }) {
  return (
    <motion.div {...reveal} className="mb-10 max-w-4xl">
      <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">
        <span className="h-1.5 w-1.5 rounded-full bg-ipink-500 shadow-[0_0_10px_rgba(252,23,119,0.8)]" />
        {module}
      </p>
      <h2 className="font-display text-4xl italic leading-tight md:text-5xl">{title}</h2>
      {children && <div className="mt-5 space-y-4 leading-relaxed text-muted md:text-lg">{children}</div>}
    </motion.div>
  );
}

export function Tile({
  title,
  caption,
  className = "",
  children,
}: {
  title: string;
  caption: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...reveal}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-[#110d18] p-5 transition-colors duration-300 hover:border-inf-400/40 md:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-inf-600/0 blur-3xl transition-colors duration-500 group-hover:bg-inf-600/30" />
      <div className="relative z-10 mb-5">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{caption}</p>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-center">{children}</div>
    </motion.div>
  );
}

/** A small console-style panel the bento visuals sit in. */
export function Panel({ label, children, className = "" }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-[#0b0811] p-3.5 md:p-4 ${className}`}>
      {label && <p className={`${mono} mb-3 uppercase text-white/35`}>{label}</p>}
      {children}
    </div>
  );
}
