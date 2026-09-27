"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LOGO_GRADIENT, mono } from "./shared";

/* Illustrative payslip — sample figures only, no client data. */
const LINES = [
  { k: "Basic salary", v: 12000, kind: "earn" },
  { k: "Housing allowance", v: 4500, kind: "earn" },
  { k: "Transport allowance", v: 1200, kind: "earn" },
  { k: "Overtime", v: 860, kind: "earn" },
  { k: "Unpaid leave", v: -400, kind: "deduct" },
  { k: "Salary advance", v: -1000, kind: "deduct" },
] as const;

const NET = LINES.reduce((s, l) => s + l.v, 0);
const fmt = (n: number) => n.toLocaleString("en-US");

export default function PayslipCard() {
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);

  // Lines tick in one by one, then a payroll run for 100 employees plays, then it loops.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (shown < LINES.length) t = setTimeout(() => setShown((s) => s + 1), 420);
    else if (run < 100) t = setTimeout(() => setRun((r) => Math.min(100, r + 4)), 140);
    else t = setTimeout(() => { setShown(0); setRun(0); }, 2600);
    return () => clearTimeout(t);
  }, [shown, run]);

  const total = LINES.slice(0, shown).reduce((s, l) => s + l.v, 0);
  const secs = ((run / 100) * 3.5).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      whileHover={{ rotate: 0, y: -6 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[380px]"
    >
      <div aria-hidden className="absolute -inset-px rounded-[1.6rem] opacity-60 blur-md" style={{ backgroundImage: LOGO_GRADIENT }} />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#120c1d] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <div className="h-1 w-full" style={{ backgroundImage: LOGO_GRADIENT }} />
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className={`${mono} uppercase text-white/40`}>Payslip · sample</p>
              <p className="mt-1 text-lg font-medium text-white">Employee #1042</p>
              <p className="text-xs text-white/40">Operations · Dubai</p>
            </div>
            <span className="rounded-full border border-ipink-500/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ipink-300">AED</span>
          </div>

          <div className="mt-5 space-y-2">
            {LINES.map((l, k) => (
              <motion.div
                key={l.k}
                animate={{ opacity: k < shown ? 1 : 0.15, x: k < shown ? 0 : -6 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/65">{l.k}</span>
                <span className={`font-mono ${l.kind === "deduct" ? "text-ipink-300" : "text-white/85"}`}>
                  {l.v < 0 ? "−" : ""}
                  {fmt(Math.abs(l.v))}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-dashed border-white/10 pt-4">
            <span className={`${mono} uppercase text-white/40`}>Net pay</span>
            <span className="font-display text-3xl italic text-white">{fmt(shown === LINES.length ? NET : total)}</span>
          </div>
        </div>

        <div className="border-t border-white/5 bg-white/[0.02] px-5 py-4 md:px-6">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-white/50">Payroll run · {run}/100 employees</span>
            <span className={run === 100 ? "text-inf-200" : "text-white/40"}>{run === 100 ? `done · ${secs}s` : `${secs}s`}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${run}%`, backgroundImage: LOGO_GRADIENT }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
