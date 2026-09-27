"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATES = ["available", "in_stock", "in_transit", "shipped"] as const;

const STEPS = [
  {
    state: 0,
    title: "Imported",
    event: "CSV import · batch B-0142",
    body: "The tag enters the registry bound to one SKU. It exists on paper, not on a shelf — and a re-import can't rebind it once it has history.",
    entry: `{ "action": "import", "batch": "B-0142" }`,
  },
  {
    state: 1,
    title: "Received",
    event: "PO-10482 · bin A-03-2",
    body: "The operator scans the carton against a purchase order. One conditional UPDATE claims the tag; quantity is simply how many tags were claimed.",
    entry: `{ "action": "receipt", "po": "PO-10482", "bin": "A-03-2" }`,
  },
  {
    state: 1,
    title: "Moved — still in stock",
    event: "Bin transfer A-03-2 → C-11-4",
    body: "Transfers and cycle counts touch an in-stock tag as often as they like without changing its state. That's why state is a lifecycle, not a 'consumed' flag.",
    entry: `{ "action": "bin_transfer", "from": "A-03-2", "to": "C-11-4" }`,
  },
  {
    state: 2,
    title: "In transit",
    event: "TO-2231 · shipped to DC-2",
    body: "Picked on a transfer order and on the road. At the destination, an unknown tag on this order is an anomaly — it's rejected for review, never auto-registered.",
    entry: `{ "action": "to_ship", "to": "TO-2231" }`,
  },
  {
    state: 1,
    title: "Received at destination",
    event: "TO-2231 · bin R-01-1",
    body: "Back to in_stock at a new location. The same unit, the same tag — with every hop recorded on the way.",
    entry: `{ "action": "to_receive", "to": "TO-2231", "bin": "R-01-1" }`,
  },
  {
    state: 3,
    title: "Shipped",
    event: "SO-88310 fulfilled",
    body: "Fulfilled on a sales order. Shipping is one-way: if this tag is ever scanned again, the claim simply returns no row.",
    entry: `{ "action": "fulfillment", "so": "SO-88310" }`,
  },
];

const nodePos = (state: number) => 6 + (state / (STATES.length - 1)) * 88;

export default function TagJourney() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${STEPS.length * 70}%`,
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

  const current = STEPS[step];

  return (
    <section ref={root} className="relative flex h-screen flex-col justify-center overflow-hidden bg-bg px-6 pt-20 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(76,162,251,0.07),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ss-300/80">The life of one tag</p>
            <h2 className="font-display text-3xl italic md:text-5xl">EPC E280·6894·A3F1</h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            Scroll to follow a single unit through the warehouse. Every hop is one row in its append-only history.
          </p>
        </div>

        {/* state track */}
        <div className="relative mb-10 h-20 md:mb-14">
          <div className="absolute left-[6%] right-[6%] top-8 h-px bg-white/10" />
          {STATES.map((s, k) => {
            const active = current.state === k;
            return (
              <div key={s} className="absolute top-0 -translate-x-1/2 text-center" style={{ left: `${nodePos(k)}%` }}>
                <div
                  className={`mx-auto mt-[26px] h-3 w-3 rounded-full border transition-colors duration-300 ${
                    active ? "border-ss-300 bg-ss-300" : "border-white/25 bg-bg"
                  }`}
                />
                <span className={`mt-3 block font-mono text-[10px] transition-colors md:text-xs ${active ? "text-ss-200" : "text-white/35"}`}>
                  {s}
                </span>
              </div>
            );
          })}
          <motion.div
            className="absolute top-0 -translate-x-1/2"
            animate={{ left: `${nodePos(current.state)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="rounded-md border border-ss-400 bg-ss-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-[0_0_24px_rgba(76,162,251,0.55)]">
              TAG
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:gap-10">
          {/* narrative */}
          <div className="min-h-[190px] min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <p className="mb-2 font-mono text-xs text-ss-300/80">
                  {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} · {current.event}
                </p>
                <h3 className="mb-3 text-2xl font-medium text-white md:text-3xl">{current.title}</h3>
                <p className="leading-relaxed text-muted">{current.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* bin_history */}
          <div className="min-w-0 rounded-2xl border border-white/5 bg-[#0c0c0e] p-4 font-mono text-[11px] leading-relaxed md:p-5 md:text-xs">
            <p className="mb-2 text-white/35">epc_tags.bin_history</p>
            <div className="flex flex-col gap-1">
              {STEPS.map((s, k) => (
                <motion.div
                  key={k}
                  animate={{ opacity: k <= step ? 1 : 0, x: k <= step ? 0 : -8 }}
                  transition={{ duration: 0.3 }}
                  className={`truncate ${k === step ? "text-ss-200" : "text-white/40"} ${k > step ? "hidden md:block" : ""}`}
                >
                  {s.entry}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-white/5">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-ss-400" />
        </div>
      </div>
    </section>
  );
}
