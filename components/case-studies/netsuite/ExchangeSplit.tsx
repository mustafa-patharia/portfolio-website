"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { StatusBar, SyncBadge } from "./shared";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Real exchange from the addon's QA run: Shop A/0003 REFUND. IDs are the ones NetSuite returned. */
const STEPS = [
  {
    title: "The order",
    body: "A customer returns a Coffee (−10.00) and takes a Tea (+6.00) in one order, and receives 4.00 back on their card.",
    status: 1,
  },
  {
    title: "Separating the lines",
    body: "The add-on splits the order by direction. The item sold goes to an invoice; the item returned goes to a credit memo, with quantity and amount made positive, as NetSuite expects.",
    status: 2,
  },
  {
    title: "Invoice first",
    body: "The invoice is sent first and marked as part of an exchange. Its NetSuite ID is saved on the Odoo record as soon as NetSuite confirms it.",
    status: 3,
  },
  {
    title: "Credit memo, linked to the invoice",
    body: "The credit memo references the invoice just created, so the two offset each other in NetSuite.",
    status: 3,
  },
  {
    title: "The refund",
    body: "The payment on the order is negative (−4.00), so it's sent as a customer refund against the credit memo. A positive amount would have been a payment on the invoice.",
    status: 3,
  },
  {
    title: "Safe to retry",
    body: "Both NetSuite IDs are stored on the Odoo invoice. If anything fails halfway, the retry skips documents that already exist, so nothing is posted twice.",
    status: 3,
  },
];

const ROWS = [
  { from: 2, type: "Invoice", ref: "RINV/2026/00003", amt: "6.00", doc: "INV10001607", id: "74015" },
  { from: 3, type: "Credit Memo", ref: "RINV/2026/00003", amt: "-10.00", doc: "MEM00000109", id: "74016" },
  { from: 4, type: "Refund (Card)", ref: "RINV/2026/00003", amt: "-4.00", doc: "45", id: "74113" },
];

function Line({ name, qty, amt, flip }: { name: string; qty: string; amt: string; flip?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-[#2b2530]">{name}</p>
        <p className="font-mono text-[10px] text-[#8f8f8f]">
          <AnimatePresence mode="wait">
            <motion.span key={qty} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className={`inline-block rounded border px-1 ${flip ? "border-oteal-500/60 text-oteal-500" : "border-[#d9d3d7] text-[#2b2530]"}`}>
              {qty}
            </motion.span>
          </AnimatePresence>
        </p>
      </div>
      <AnimatePresence mode="wait">
        <motion.span key={amt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-mono text-sm ${flip ? "text-oteal-500" : "text-[#2b2530]"}`}>
          {amt}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function ExchangeSplit() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${STEPS.length * 65}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
          if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  const split = step >= 1;
  const current = STEPS[step];

  return (
    <section ref={root} className="relative flex h-screen flex-col justify-start overflow-hidden bg-[#0d0b0e] px-4 pt-28 md:px-10 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(113,75,103,0.18),transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(1,126,132,0.12),transparent_50%)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 md:mb-8">
          <div>
            <p className="mb-2 hidden font-mono text-[11px] uppercase tracking-[0.3em] text-odoo-300 md:block">One order, three documents</p>
            <h2 className="font-display text-xl italic md:text-5xl">Shop A/0003 REFUND</h2>
          </div>
          <StatusBar steps={["New", "Paid", "Posted", "Invoiced"]} active={current.status} />
        </div>

        <div className="grid items-center gap-3 md:grid-cols-[0.9fr_1.3fr] md:gap-10">
          {/* the order, tearing along its lines */}
          <div className="relative mx-auto flex w-full max-w-sm flex-col md:max-w-none">
            <motion.div
              animate={{ y: split ? -6 : 0, x: split ? -8 : 0, rotate: split ? -2.5 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="relative z-10 rounded-t-xl bg-[#f6f4f5] px-3 py-2 shadow-2xl md:p-4"
            >
              <Line name="Tea (Small)" qty="1.00 × 6.00" amt="6.00" />
              <AnimatePresence>
                {split && (
                  <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-2 inline-block rounded-full bg-[#714b67] px-2 py-0.5 font-mono text-[10px] text-white">
                    → invoice
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* perforation */}
            <motion.div animate={{ opacity: split ? 0 : 1 }} className="h-0 border-t-2 border-dashed border-[#c9c1c6] bg-[#f6f4f5]" />

            <motion.div
              animate={{ y: split ? 14 : 0, x: split ? 10 : 0, rotate: split ? 2 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="relative rounded-b-xl bg-[#f6f4f5] px-3 py-2 shadow-2xl md:p-4"
            >
              <Line name="Coffee (Small)" qty={split ? "1.00 × 10.00" : "-1.00 × 10.00"} amt={split ? "10.00" : "-10.00"} flip={split} />
              <AnimatePresence>
                {split && (
                  <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-2 inline-block rounded-full bg-[#714b67] px-2 py-0.5 font-mono text-[10px] text-white">
                    → credit memo
                  </motion.span>
                )}
              </AnimatePresence>
              <div className={`mt-3 flex justify-between border-t border-[#e4dee2] pt-2 text-sm text-[#2b2530] transition-opacity duration-500 ${split ? "opacity-30" : ""}`}>
                <span>Total</span>
                <span className="font-mono">-4.00 AED</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: step >= 4 ? 1 : 0.35, x: step >= 4 ? 18 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="mt-3 self-start rounded-full md:mt-6 border border-oteal-400/40 bg-oteal-500/15 px-3 py-1 font-mono text-[11px] text-oteal-200"
            >
              tender · Card · −4.00 {step >= 4 && "→ refund"}
            </motion.div>
          </div>

          {/* the NetSuite Overview tab, filling in */}
          <div className="min-w-0 rounded-xl border border-white/10 bg-[#151217] p-3 md:p-5">
            <div className="mb-3 hidden gap-4 border-b border-white/10 pb-2 text-xs md:flex">
              <span className="text-white/35">Products</span>
              <span className="hidden text-white/35 sm:inline">Payments</span>
              <span className="border-b-2 border-odoo-400 pb-2 -mb-[10px] text-white">Add-on Overview</span>
            </div>
            <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr] gap-2 pb-2 font-mono text-[10px] uppercase tracking-wider text-white/35 md:grid-cols-[1fr_0.6fr_1fr_0.6fr_0.8fr]">
              <span>Sync type</span>
              <span className="text-right">Amount</span>
              <span className="hidden md:block">Document</span>
              <span className="hidden md:block">NS ID</span>
              <span>Status</span>
            </div>
            <div className="flex flex-col gap-1 md:min-h-[108px] md:gap-1.5">
              {ROWS.map((r) => (
                <motion.div
                  key={r.type}
                  animate={{ opacity: step >= r.from ? 1 : 0.12, x: step >= r.from ? 0 : 12 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-[1.1fr_0.7fr_0.8fr] items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-1.5 text-xs text-white/80 md:grid-cols-[1fr_0.6fr_1fr_0.6fr_0.8fr] md:text-[13px]"
                >
                  <span>{r.type}</span>
                  <span className="text-right font-mono">{r.amt}</span>
                  <span className="hidden font-mono text-white/55 md:block">{r.doc}</span>
                  <span className="hidden font-mono text-white/55 md:block">{r.id}</span>
                  <span>{step >= r.from ? <SyncBadge status={step > r.from || step === 5 ? "synced" : "queued"} /> : null}</span>
                </motion.div>
              ))}
            </div>
            <motion.pre
              animate={{ opacity: step >= 5 ? 1 : 0.15 }}
              className={`mt-3 hidden overflow-hidden rounded-md bg-black/40 md:block p-2 font-mono text-[10px] leading-relaxed text-white/50 md:text-[11px]`}
            >
              <span className="text-odoo-300">foresee_netsuite_id</span> = {"{"} <span className="text-oteal-300">&quot;invoice&quot;</span>: &quot;74015&quot;, <span className="text-oteal-300">&quot;credit_memo&quot;</span>: &quot;74016&quot; {"}"}
            </motion.pre>
          </div>
        </div>

        <div className="mt-3 min-h-[118px] md:mt-8 md:min-h-[96px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="max-w-5xl">
              <p className="mb-1 font-mono text-[11px] text-odoo-300">
                {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} · {current.title}
              </p>
              <p className="text-sm leading-relaxed text-muted md:text-lg">{current.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 h-px w-full bg-white/5">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-odoo-400 to-oteal-400" />
        </div>
      </div>
    </section>
  );
}
