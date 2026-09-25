"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* Odoo brand assets: purple #714B67 (primary), teal #017E84 (secondary), grey #8F8F8F.
   Purple is the Odoo side of the story; teal marks anything that reached NetSuite. */
export const PURPLE = "#a67a9a"; // odoo-400, purple lifted for dark surfaces
export const TEAL = "#1ea4ab"; // oteal-400

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

/** Chapter heading, labelled with the addon menu it stands for. */
export function Chapter({ menu, title, children }: { menu: string; title: string; children?: React.ReactNode }) {
  return (
    <motion.div {...reveal} className="mb-10">
      <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-odoo-300">
        <span className="rounded-[4px] bg-odoo-600 px-1.5 py-0.5 text-[10px] tracking-normal text-white">Add-on</span>
        <span className="text-white/30">›</span>
        {menu}
      </p>
      <h2 className="font-display text-4xl italic leading-tight md:text-5xl">{title}</h2>
      {children && <div className="mt-5 space-y-4 leading-relaxed text-muted md:text-lg">{children}</div>}
    </motion.div>
  );
}

/** Odoo's form status bar: chevron steps, the current one highlighted. */
export function StatusBar({ steps, active, className = "" }: { steps: string[]; active: number; className?: string }) {
  return (
    <div className={`flex overflow-hidden rounded-md border border-white/10 ${className}`}>
      {steps.map((s, k) => {
        const on = k === active;
        const done = k < active;
        return (
          <span
            key={s}
            className={`relative px-2.5 py-1 font-mono text-[10px] transition-colors duration-300 md:px-3.5 md:text-[11px] ${on ? "bg-odoo-600 text-white" : done ? "bg-odoo-600/20 text-odoo-200" : "bg-white/[0.02] text-white/35"
              } ${k > 0 ? "border-l border-white/10" : ""}`}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
}

/** The green-teal badge Odoo lists render for a synced record. */
export function SyncBadge({ status }: { status: "synced" | "queued" | "failed" | "waiting" | "skipped" }) {
  const map = {
    synced: "border-oteal-400/50 bg-oteal-500/25 text-oteal-200",
    queued: "border-white/15 bg-white/[0.05] text-white/60",
    waiting: "border-odoo-400/40 bg-odoo-600/20 text-odoo-200",
    failed: "border-red-400/40 bg-red-500/15 text-red-300",
    skipped: "border-white/10 bg-white/[0.03] text-white/40",
  } as const;
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] capitalize ${map[status]}`}>{status}</span>
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors duration-300 hover:border-odoo-400/40 md:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-odoo-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex-1">{children}</div>
      <div className="relative z-10 mt-5 border-t border-white/[0.06] pt-4">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{caption}</p>
      </div>
    </motion.div>
  );
}

export function BrowserFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#161418] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 truncate font-mono text-[11px] text-white/35">{label}</span>
      </div>
      {children}
    </div>
  );
}
