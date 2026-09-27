"use client";

import { motion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75, ease: EASE },
};

export const mono = "font-mono text-[10px] md:text-[11px] tracking-wide";

/** The site's section label: a 60px brand rule, then the label. */
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-pg-200/80">
      <span className="h-[2px] w-[60px] bg-pg-500" />
      {children}
    </p>
  );
}

/**
 * Heading with the site's outlined watermark word behind it. The outline turns
 * brand green when the heading block is hovered, as it does on the live site.
 */
export function Heading({
  ghost,
  label,
  children,
  className = "",
}: {
  ghost: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div {...reveal} className={`group relative pt-10 md:pt-14 ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 select-none font-sans text-6xl font-bold capitalize leading-none tracking-tighter text-transparent opacity-[0.1] transition-all duration-500 [-webkit-text-stroke:1.5px_#fff] group-hover:opacity-40 group-hover:[-webkit-text-stroke:1.5px_#3aa328] md:text-8xl"
      >
        {ghost}
      </span>
      <div className="relative">
        {label && <Label>{label}</Label>}
        <h2 className="font-display text-4xl italic leading-tight md:text-5xl">{children}</h2>
      </div>
    </motion.div>
  );
}

/** Straight-edged bento tile — the site bans rounded cards, so this page does too. */
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
      className={`group relative flex flex-col overflow-hidden border border-white/[0.07] bg-[#0d1117] p-5 transition-colors duration-300 hover:border-pgold-500/40 md:p-6 ${className}`}
    >
      {/* gold hairline that draws across the top edge on hover */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-pgold-300 via-pgold-500 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(58,163,40,0.09),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{caption}</p>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
    </motion.div>
  );
}

/** Dotted-map texture from the site (radial dots on a 22px grid). */
export function DotField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: "radial-gradient(rgba(168,230,160,0.5) 1px, transparent 1.4px)", backgroundSize: "22px 22px" }}
    />
  );
}
