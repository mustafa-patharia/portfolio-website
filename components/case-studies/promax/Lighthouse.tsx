"use client";

import { motion } from "framer-motion";
import CountUp from "../../reactbits/CountUp";
import { mono, reveal } from "./shared";

/* From the Lighthouse 13.4.1 report on promaxglobal.ae (desktop, 26 Sep 2026). */
const SCORES = [
  { label: "Performance", n: 92 },
  { label: "Accessibility", n: 93 },
  { label: "Best Practices", n: 100 },
  { label: "SEO", n: 100 },
];

const VITALS = [
  { k: "First Contentful Paint", v: "0.5 s", note: "first content on screen" },
  { k: "Largest Contentful Paint", v: "0.7 s", note: "main content visible" },
  { k: "Total Blocking Time", v: "0 ms", note: "nothing blocks a click" },
  { k: "Cumulative Layout Shift", v: "0", note: "the page never jumps" },
];

const R = 42;
const C = 2 * Math.PI * R;

export function Ring({ label, n, delay = 0, size = "lg" }: { label: string; n: number; delay?: number; size?: "lg" | "sm" }) {
  const box = size === "lg" ? "h-28 w-28 md:h-32 md:w-32" : "h-16 w-16";
  return (
    <div className="group flex flex-col items-center gap-2">
      <div className={`relative ${box} transition-transform duration-300 group-hover:-translate-y-1`}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="rgba(58,163,40,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="#3aa328"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: C * (1 - n / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
            className="drop-shadow-[0_0_8px_rgba(58,163,40,0.5)] transition-[stroke] duration-300 group-hover:stroke-[#a8e6a0]"
          />
        </svg>
        <span className={`absolute inset-0 grid place-items-center font-mono text-pg-200 ${size === "lg" ? "text-3xl md:text-4xl" : "text-lg"}`}>
          <CountUp to={n} duration={1.4} delay={delay} />
        </span>
      </div>
      <span className={`${size === "lg" ? "text-sm" : "text-[11px]"} text-white/60 transition-colors group-hover:text-white`}>{label}</span>
    </div>
  );
}

export default function Lighthouse() {
  return (
    <div>
      <motion.div {...reveal} className="grid grid-cols-2 gap-8 border border-white/[0.07] bg-[#0d1117] p-8 md:grid-cols-4 md:p-10">
        {SCORES.map((s, k) => (
          <Ring key={s.label} label={s.label} n={s.n} delay={k * 0.12} />
        ))}
      </motion.div>

      <div className="mt-px grid grid-cols-1 gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
        {VITALS.map((v, k) => (
          <motion.div
            key={v.k}
            {...reveal}
            transition={{ ...reveal.transition, delay: k * 0.08 }}
            className="group bg-[#0b1016] p-5 transition-colors hover:bg-[#101823]"
          >
            <p className={`${mono} uppercase text-white/35 transition-colors group-hover:text-pg-200`}>{v.k}</p>
            <p className="mt-2 font-display text-4xl italic text-pg-500">{v.v}</p>
            <p className="mt-1 text-sm text-muted">{v.note}</p>
          </motion.div>
        ))}
      </div>

      <motion.p {...reveal} className={`${mono} mt-6 text-white/40`}>
        Lighthouse 13.4.1 · desktop · promaxglobal.ae
      </motion.p>
    </div>
  );
}
