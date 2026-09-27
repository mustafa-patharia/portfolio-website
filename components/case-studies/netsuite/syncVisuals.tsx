"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, X } from "lucide-react";
import { mono, useTicker } from "./shared";

/* ------------------------------------------------------- four steps, one gate */

const PHASES = ["Invoices", "Payments", "Credit notes", "Refunds"];

export function FourStepsVisual() {
  // run A: all pass (0..4). run B: invoices fail, rest aborted (5..8).
  const tick = useTicker(10, 700);
  const failRun = tick >= 5;
  const progress = failRun ? Math.min(tick - 5, 1) : Math.min(tick, 4);

  return (
    <div className="flex min-h-[170px] flex-col justify-center gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PHASES.map((p, k) => {
          let state: "idle" | "ok" | "fail" | "aborted" = "idle";
          if (failRun) state = k === 0 && progress >= 1 ? "fail" : k > 0 && progress >= 1 ? "aborted" : "idle";
          else if (k < progress) state = "ok";
          return (
            <motion.div
              key={p}
              animate={{
                borderColor: state === "ok" ? "rgba(30,164,171,0.6)" : state === "fail" ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.08)",
                opacity: state === "aborted" ? 0.3 : 1,
              }}
              className="relative rounded-lg border bg-white/[0.02] p-3"
            >
              <p className={`${mono} text-white/35`}>step {k + 1}</p>
              <p className="mt-0.5 text-sm text-white/85">{p}</p>
              <span className="absolute right-2 top-2">
                {state === "ok" && <Check className="h-3.5 w-3.5 text-oteal-300" />}
                {state === "fail" && <X className="h-3.5 w-3.5 text-red-300" />}
              </span>
            </motion.div>
          );
        })}
      </div>
      <div className={`${mono} h-4`}>
        <AnimatePresence mode="wait">
          {failRun && progress >= 1 ? (
            <motion.span key="abort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-300">
              invoice step failed · payments, credit notes, refunds aborted: no orphaned payments
            </motion.span>
          ) : (
            <motion.span key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/45">
              sync_pos_netsuite() · {progress}/4 steps done
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ change netting */

export function ChangeNettingVisual() {
  const tick = useTicker(4, 1300);
  const merged = tick >= 2;
  return (
    <div className="flex min-h-[150px] flex-col justify-center gap-2">
      <AnimatePresence mode="popLayout">
        {!merged ? (
          [
            { m: "Cash", a: "+100.00", c: "text-white/80" },
            { m: "Cash (change)", a: "−5.00", c: "text-red-300/80" },
          ].map((r, k) => (
            <motion.div
              key={r.m}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: k === 0 ? 12 : -12, scale: 0.9 }}
              transition={{ delay: k * 0.15 }}
              className={`${mono} flex justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2`}
            >
              <span className="text-white/55">pos.payment · {r.m}</span>
              <span className={r.c}>{r.a}</span>
            </motion.div>
          ))
        ) : (
          <motion.div
            key="net"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`${mono} flex justify-between rounded-lg border border-oteal-400/40 bg-oteal-500/10 px-3 py-3`}
          >
            <span className="text-oteal-200">Customer Payment · Cash</span>
            <span className="text-oteal-200">95.00</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------ payment waits */

export function PaymentWaitVisual() {
  const tick = useTicker(12, 550);
  const done = tick >= 8;
  const wait = Math.min(tick + 1, 8);
  return (
    <div className="flex min-h-[150px] flex-col justify-center gap-3">
      <div className="flex items-center justify-between">
        <span className={`${mono} text-white/50`}>invoice</span>
        <span className={`${mono} ${done ? "text-oteal-300" : "text-white/40"}`}>{done ? "synced · 74013" : "queued"}</span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: 30 }).map((_, k) => (
          <motion.span
            key={k}
            className="h-4 flex-1 rounded-[2px]"
            animate={{ backgroundColor: k < wait ? (done ? "rgba(30,164,171,0.7)" : "rgba(166,122,154,0.6)") : "rgba(255,255,255,0.05)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`${mono} text-white/50`}>payment</span>
        <AnimatePresence mode="wait">
          <motion.span key={done ? "d" : wait} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`${mono} ${done ? "text-oteal-300" : "text-odoo-200"}`}>
            {done ? "posted · applied to 74013" : `wait ${wait}/60 · re-queue in 30s`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ row lock */

export function RowLockVisual() {
  // 0-1 A locks, 2 B bounces, 3-4 A syncs & releases, 5 B re-reads: already synced
  const tick = useTicker(7, 900);
  const aHolds = tick >= 0 && tick <= 3;
  return (
    <div className="flex min-h-[150px] flex-col justify-center gap-3">
      <div className="flex items-center justify-between gap-2">
        <motion.span animate={{ x: aHolds ? 10 : 0 }} className={`${mono} rounded-full border border-odoo-400/40 bg-odoo-600/20 px-2.5 py-1 text-odoo-100`}>
          job A
        </motion.span>
        <motion.div
          animate={{ borderColor: aHolds ? "rgba(166,122,154,0.7)" : "rgba(255,255,255,0.1)" }}
          className="flex items-center gap-1.5 rounded-lg border bg-white/[0.03] px-2.5 py-1.5"
        >
          <Lock className={`h-3.5 w-3.5 ${aHolds ? "text-odoo-300" : "text-white/25"}`} />
          <span className={`${mono} text-white/60`}>account_move · 70</span>
        </motion.div>
        <motion.span animate={{ x: tick === 2 ? [-12, 6, 0] : 0 }} className={`${mono} rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/60`}>
          job B
        </motion.span>
      </div>
      <div className={`${mono} h-8 text-right`}>
        <AnimatePresence mode="wait">
          <motion.p key={tick < 2 ? "a" : tick === 2 ? "b" : tick < 5 ? "c" : "d"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {tick < 2 && <span className="text-white/45">A: SELECT … FOR UPDATE NOWAIT</span>}
            {tick === 2 && <span className="text-red-300">B: lock held → RetryableJobError, re-queued</span>}
            {tick >= 3 && tick < 5 && <span className="text-oteal-300">A: synced, lock released</span>}
            {tick >= 5 && <span className="text-white/60">B: re-reads status → already synced, posts nothing</span>}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ consolidation */

/* Invoices merge per shop + day; payments per shop + day + payment method (refunds apart from
   payments), each group becoming one Customer Payment whose applyList settles every invoice. */
type MergeRow = { label: string; prefix: string; count: number; doc: string; target: string };

const MERGES: Record<"invoices" | "payments", MergeRow[]> = {
  invoices: [
    { label: "Shop A", prefix: "INV", count: 6, doc: "NetSuite invoice", target: "Consolidated 6 invoices (Shop A)" },
    { label: "Shop B", prefix: "INV", count: 4, doc: "NetSuite invoice", target: "Consolidated 4 invoices (Shop B)" },
  ],
  payments: [
    { label: "Shop A · Cash", prefix: "PAY", count: 4, doc: "Customer payment", target: "Shop A + Cash" },
    { label: "Shop A · Card", prefix: "PAY", count: 2, doc: "Customer payment", target: "Shop A + Card" },
    { label: "Shop B · Cash", prefix: "PAY", count: 3, doc: "Customer payment", target: "Shop B + Cash" },
  ],
};

export function ConsolidationVisual() {
  // 0-5 invoices, 6-11 payments; within each, 0-2 separate and 3-5 merged
  const tick = useTicker(12, 900);
  const [pinned, setPinned] = useState<"invoices" | "payments" | null>(null);
  const mode = pinned ?? (tick < 6 ? "invoices" : "payments");
  const folded = tick % 6 >= 3;

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-full border border-white/10 p-0.5" onMouseLeave={() => setPinned(null)}>
        {(["invoices", "payments"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPinned(m)}
            onMouseEnter={() => setPinned(m)}
            className="relative rounded-full px-3 py-1 font-mono text-[11px] capitalize transition-colors"
          >
            {mode === m && <motion.span layoutId="ns-merge-mode" className="absolute inset-0 rounded-full bg-odoo-600" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className={`relative ${mode === m ? "text-white" : "text-white/50 hover:text-white"}`}>{m}</span>
          </button>
        ))}
      </div>

      {/* Both views share one grid cell, so the tile is always as tall as the taller view. */}
      <div className="grid">
        {(["invoices", "payments"] as const).map((view) => {
          let n = 0;
          return (
            <motion.div
              key={view}
              aria-hidden={view !== mode}
              animate={{ opacity: view === mode ? 1 : 0, y: view === mode ? 0 : 8 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col justify-center gap-2.5 [grid-area:1/1] ${view === mode ? "" : "pointer-events-none"}`}
            >
              {MERGES[view].map((r, row) => (
                <div key={r.label} className="flex items-center gap-3 md:gap-4">
                  <span className={`${mono} w-14 shrink-0 text-white/45 md:w-24`}>{r.label}</span>
                  <div className="grid flex-1 grid-cols-3 gap-1.5 sm:grid-cols-6">
                    {Array.from({ length: r.count }).map((_, k) => {
                      n += 1;
                      const merged = folded && view === mode;
                      return (
                        <motion.div
                          key={k}
                          animate={merged ? { x: 40, opacity: 0, scale: 0.6 } : { x: 0, opacity: 1, scale: 1 }}
                          transition={{ delay: (merged ? k * 0.05 : k * 0.03) + row * 0.1, duration: 0.45 }}
                          className={`${mono} h-5 rounded-md border px-1 text-center sm:h-auto sm:py-1.5 ${
                            r.prefix === "PAY" ? "border-oteal-400/25 bg-oteal-500/10 text-oteal-200/80" : "border-odoo-400/25 bg-odoo-600/15 text-odoo-100/70"
                          }`}
                        >
                          <span className="hidden sm:inline">
                            {r.prefix}/{String(n).padStart(2, "0")}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.div
                    animate={{
                      scale: folded && view === mode ? 1 : 0.9,
                      opacity: folded && view === mode ? 1 : 0.3,
                      borderColor: folded && view === mode ? "rgba(30,164,171,0.6)" : "rgba(255,255,255,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 160, damping: 16, delay: folded ? 0.25 + row * 0.1 : 0 }}
                    className="w-32 shrink-0 rounded-lg border bg-oteal-500/10 px-2.5 py-1.5 md:w-52"
                  >
                    <p className={`${mono} text-white/45`}>{r.doc}</p>
                    <p className="mt-0.5 text-xs text-white md:text-sm">{r.target}</p>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ failure that sticks */

export function StickyFailureVisual() {
  const tick = useTicker(5, 1000);
  const rolledBack = tick >= 2;
  return (
    <div className="flex min-h-[150px] flex-col justify-center gap-2">
      <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
        <span className={`${mono} text-white/50`}>job transaction</span>
        <span className={`${mono} ${rolledBack ? "text-red-300 line-through" : "text-white/60"}`}>{rolledBack ? "rolled back" : "running…"}</span>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-odoo-400/30 bg-odoo-600/10 px-3 py-2">
        <span className={`${mono} text-white/50`}>separate cursor</span>
        <motion.span animate={{ opacity: tick >= 1 ? 1 : 0.2 }} className={`${mono} text-odoo-100`}>
          status = failed · error kept
        </motion.span>
      </div>
      <p className={`${mono} mt-1 text-white/35`}>retry {Math.min(tick, 3)}/3 · backoff 2^n min</p>
    </div>
  );
}
