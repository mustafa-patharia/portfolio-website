"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { mono, reveal, useTicker } from "./shared";

/* Keys as the addon reads them from the pushed configuration JSON. */
const FIELDS = [
  { json: `"integration_mode": "realtime"`, label: "Integration mode", value: "Real-time" },
  { json: `"consolidate_invoices": false`, label: "Consolidate invoices", value: "No" },
  { json: `"consolidate_payments": false`, label: "Consolidate payments", value: "No" },
  { json: `"max_concurrent_jobs": 3`, label: "Max concurrent jobs", value: "3" },
  { json: `"log_retention_days": 90`, label: "Log retention", value: "90 days" },
];

const MODES = {
  realtime: {
    label: "Real-time",
    lines: [
      "Each invoice and payment is queued the moment it's created and sent individually.",
      "Real-time can't be combined with merged invoices; the add-on rejects that setting when it arrives.",
    ],
  },
  scheduled: {
    label: "Scheduled",
    lines: [
      "Records are held during the day.",
      "A nightly run at 00:05 sends everything pending, in the correct order.",
      "Each shop's invoices, credit notes and payments are merged by day.",
    ],
  },
} as const;

export default function ConfigPush() {
  // 0..4 fields arrive, 5..8 locked and held
  const tick = useTicker(9, 800);
  const filled = Math.min(tick + 1, FIELDS.length);
  const locked = tick >= FIELDS.length;
  const [mode, setMode] = useState<keyof typeof MODES>("realtime");

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <motion.div {...reveal} className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors hover:border-odoo-400/40 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-center lg:grid-cols-1">
          {/* the push */}
          <div className="min-w-0">
            <p className={`${mono} mb-2 text-white/40`}>POST /api/netsuite/config/update</p>
            <pre className={`${mono} overflow-hidden rounded-lg border border-white/5 bg-black/40 p-3 leading-relaxed text-white/45`}>
              {"{ "}<span className="text-oteal-300">&quot;configuration&quot;</span>{": {"}
              {FIELDS.map((f, k) => (
                <motion.span key={f.json} className="block truncate pl-3" animate={{ color: k < filled ? "rgba(163,226,229,0.9)" : "rgba(255,255,255,0.18)" }}>
                  {f.json}
                </motion.span>
              ))}
              {"} }"}
            </pre>
          </div>


          {/* the read-only form in Odoo */}
          <div className="min-w-0 rounded-lg bg-[#f6f4f5] p-3 text-[#2b2530]">
            {/* Always mounted so its row is reserved: only colour and label change, never the card's height. */}
            <motion.div
              animate={{
                backgroundColor: locked ? "#d7ecec" : "#ebe7ea",
                borderColor: locked ? "#017e84" : "#c9c1c6",
                color: locked ? "#0b5357" : "#8f8f8f",
              }}
              transition={{ duration: 0.35 }}
              className="mb-2 flex h-6 items-center gap-1.5 overflow-hidden rounded border-l-2 px-2 text-[10px] font-medium"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={locked ? "locked" : "receiving"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  {locked ? (
                    <>
                      <Lock className="h-3 w-3" /> Managed by NetSuite
                    </>
                  ) : (
                    "Receiving from NetSuite…"
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <div className="flex flex-col gap-1.5">
              {FIELDS.map((f, k) => (
                <div key={f.label} className="flex items-center justify-between gap-2 border-b border-[#e4dee2] pb-1 text-[11px]">
                  <span className="text-[#6b6170]">{f.label}</span>
                  <motion.span
                    className="font-medium"
                    animate={{ opacity: k < filled ? 1 : 0, x: k < filled ? 0 : 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {f.value}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-5 border-t border-white/[0.06] pt-4 text-sm leading-relaxed text-muted">
          <span className="font-medium text-white">A single, protected configuration.</span> Saving the configuration in NetSuite sends it to Odoo.
          Odoo accepts only one configuration record; an attempt to delete it is blocked and logged.
        </p>
      </motion.div>

      <div className="flex flex-col gap-5">
        <motion.div {...reveal} className="rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors hover:border-odoo-400/40 md:p-6">
          <div className="mb-4 inline-flex rounded-full border border-white/10 p-1">
            {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                onMouseEnter={() => setMode(m)}
                className="relative rounded-full px-4 py-1.5 text-sm transition-colors"
              >
                {mode === m && <motion.span layoutId="ns-mode" className="absolute inset-0 rounded-full bg-odoo-600" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className={`relative ${mode === m ? "text-white" : "text-white/50 hover:text-white"}`}>{MODES[m].label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.ul key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-2.5">
              {MODES[mode].lines.map((l) => (
                <li key={l} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-odoo-400" />
                  {l}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </motion.div>

        <ThrottleCard />
      </div>
    </div>
  );
}

function ThrottleCard() {
  const limit = 3;
  return (
    <motion.div {...reveal} className="group flex-1 rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors hover:border-odoo-400/40 md:p-6">
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 4 }).map((_, lane) => {
          const open = lane < limit;
          return (
            <div key={lane} className="relative h-5 overflow-hidden rounded bg-white/[0.03]">
              {open ? (
                <motion.span
                  className="absolute top-1 h-3 w-10 rounded-sm bg-oteal-400/70"
                  animate={{ left: ["-15%", "105%"] }}
                  transition={{ duration: 1.8 + lane * 0.4, repeat: Infinity, ease: "linear", delay: lane * 0.3 }}
                />
              ) : (
                <span className={`${mono} absolute inset-0 flex items-center justify-center text-white/25`}>closed</span>
              )}
            </div>
          );
        })}
      </div>
      <p className={`${mono} mt-3 text-white/45`}>
        queue_job.channels = <span className="text-oteal-300">root.netsuite:{limit}</span>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        <span className="font-medium text-white">Within NetSuite&apos;s limits.</span> NetSuite limits how many requests an integration can make at once. The add-on reads that limit (1–4) from the configuration and sizes its job queue to match.
      </p>
    </motion.div>
  );
}
