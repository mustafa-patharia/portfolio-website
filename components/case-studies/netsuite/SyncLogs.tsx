"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserFrame, mono, reveal } from "./shared";

const STATES = [
  { id: "not_synced", rule: "Not sent yet." },
  { id: "queued", rule: "Waiting in the real-time queue." },
  { id: "scheduled", rule: "Held for the nightly run or a manual sync." },
  { id: "synced", rule: "Accepted by NetSuite, with its IDs saved back on the record." },
  { id: "failed", rule: "The last attempt failed. The reason is saved, and it's retried." },
  { id: "skipped", rule: "A required condition wasn't met, for example the payment adds up to zero or its invoice failed." },
];

const SCREENS = [
  {
    id: "sale",
    label: "Add-on Overview · sale",
    src: "/projects/odoo-netsuite/pos-backend-sync.jpg",
    alt: "POS order NYC Shop/0003 with its NetSuite Overview tab: invoice and cash payment, both synced",
    note: "A standard sale. The invoice and its cash payment are listed with their NetSuite document numbers and IDs.",
  },
  {
    id: "exchange",
    label: "Add-on Overview · exchange",
    src: "/projects/odoo-netsuite/pos-exchange-backend-sync.jpg",
    alt: "Exchange order Shop A/0003 REFUND with invoice, credit memo and card refund all synced",
    note: "The exchange from earlier, as the back office sees it: invoice, credit memo and card refund, all synced.",
  },
  {
    id: "logs",
    label: "Sync Logs",
    src: "/projects/odoo-netsuite/sync-logs.jpg",
    alt: "Sync log list with failed refund attempts in red followed by a successful retry in green",
    note: "The red rows are real-time attempts that failed and were retried; the green row above them is the retry that succeeded. Each row keeps the exact request and response.",
  },
  {
    id: "wizard",
    label: "Sync to NetSuite",
    src: "/projects/odoo-netsuite/operation-sync.jpg",
    alt: "Sync to NetSuite dialog with a Sync From date",
    note: "A single date field. It sends everything pending from that date, in the correct order, following the merge rules set in NetSuite.",
  },
];

export default function SyncLogs() {
  const [state, setState] = useState(STATES[3].id);
  const [tab, setTab] = useState(SCREENS[0].id);
  const screen = SCREENS.find((s) => s.id === tab)!;
  const rule = STATES.find((s) => s.id === state)!;

  return (
    <div className="flex flex-col gap-10">
      {/* state machine */}
      <motion.div {...reveal} className="rounded-2xl border border-white/[0.06] bg-[#121013] p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATES.map((s, k) => {
            const on = s.id === state;
            const tone =
              s.id === "synced" ? "border-oteal-400/50 text-oteal-200" : s.id === "failed" ? "border-red-400/40 text-red-300" : "border-white/10 text-white/60";
            return (
              <div key={s.id} className="flex items-center gap-1.5">
                <button
                  onMouseEnter={() => setState(s.id)}
                  onFocus={() => setState(s.id)}
                  onClick={() => setState(s.id)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-all duration-200 hover:-translate-y-0.5 ${tone} ${on ? "bg-white/[0.08] ring-1 ring-odoo-400/50" : "bg-white/[0.02]"}`}
                >
                  {s.id}
                </button>
                {k < 3 && <span className="text-white/20">→</span>}
                {k === 3 && <span className="mx-1 text-white/15">|</span>}
              </div>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={rule.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            <span className="font-mono text-odoo-200">{rule.id}</span> · {rule.rule}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* back office */}
      <div>
        <motion.div {...reveal} className="mb-4 flex flex-wrap gap-x-5 gap-y-2 border-b border-white/10" role="tablist" aria-label="Back office screens">
          {SCREENS.map((s) => (
            <button key={s.id} role="tab" aria-selected={s.id === tab} onClick={() => setTab(s.id)} className="relative pb-2.5 text-sm transition-colors">
              <span className={s.id === tab ? "text-white" : "text-white/45 hover:text-white/80"}>{s.label}</span>
              {s.id === tab && <motion.span layoutId="ns-backoffice-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-odoo-400" />}
            </button>
          ))}
        </motion.div>
        <motion.div {...reveal}>
          <BrowserFrame label={`odoo / netsuite / ${screen.id}`}>
            <AnimatePresence mode="wait">
              <motion.img
                key={screen.id}
                src={screen.src}
                alt={screen.alt}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="block w-full"
                loading="lazy"
              />
            </AnimatePresence>
          </BrowserFrame>
          <AnimatePresence mode="wait">
            <motion.p key={screen.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${mono} mt-4 max-w-5xl text-xs leading-relaxed text-white/50 md:text-sm`}>
              {screen.note}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
