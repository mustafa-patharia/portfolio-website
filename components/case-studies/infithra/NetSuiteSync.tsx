"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Panel, mono, reveal, useTicker } from "./shared";

/* Illustrative mapping and journal entry — generic accounts, no client data. */
const INBOUND = ["Subsidiaries", "Locations", "Departments", "Employees"];
const OUTBOUND = ["Payroll disbursements", "Contributions", "Expenses"];

const MAP_ROWS = [
  { from: "Company", to: "Subsidiary", multiOnly: true },
  { from: "Branch", to: "Location", multiOnly: false },
  { from: "Department", to: "Department", multiOnly: false },
  { from: "Pay component", to: "GL account", multiOnly: false },
];

const JOURNAL = [
  { acc: "Salaries expense", dr: "182,400", cr: "" },
  { acc: "Contributions expense", dr: "14,200", cr: "" },
  { acc: "Salaries payable", dr: "", cr: "182,400" },
  { acc: "Contributions payable", dr: "", cr: "14,200" },
];

export default function NetSuiteSync() {
  const [multi, setMulti] = useState(true);
  const pulse = useTicker(INBOUND.length + OUTBOUND.length, 900);

  return (
    <motion.div {...reveal} className="overflow-hidden rounded-3xl border border-white/10 bg-[#110d18]">
      {/* flow strip */}
      <div className="grid items-center gap-6 border-b border-white/10 p-5 md:grid-cols-[1fr_auto_1fr] md:p-8">
        <div className="space-y-2">
          <p className={`${mono} uppercase text-white/40`}>Into Infithra</p>
          {INBOUND.map((x, k) => (
            <motion.div key={x} animate={{ x: pulse === k ? 6 : 0 }} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${pulse === k ? "border-iblue/50 bg-iblue/10 text-white" : "border-white/[0.07] text-white/60"}`}>
              <ArrowLeft className="h-3.5 w-3.5 text-iblue" /> {x}
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <motion.span aria-label="Sync" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="grid h-20 w-20 place-items-center">
            <RefreshCw className="h-10 w-10 text-white" strokeWidth={1.75} />
          </motion.span>
          <span className={`${mono} text-white/40`}>background workers</span>
        </div>
        <div className="space-y-2">
          <p className={`${mono} uppercase text-white/40 md:text-right`}>To NetSuite · journal entries</p>
          {OUTBOUND.map((x, k) => {
            const on = pulse === INBOUND.length + k;
            return (
              <motion.div key={x} animate={{ x: on ? -6 : 0 }} className={`flex items-center justify-end gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${on ? "border-ipink-500/50 bg-ipink-500/10 text-white" : "border-white/[0.07] text-white/60"}`}>
                {x} <ArrowRight className="h-3.5 w-3.5 text-ipink-400" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* account type toggle */}
      <div className="p-5 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">Field mapping is set per company. Switch the account type to see how the mapping and the posted entry change.</p>
          <div className="relative flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs">
            {[
              { v: true, l: "Multi-subsidiary" },
              { v: false, l: "Single entity" },
            ].map((o) => (
              <button key={o.l} onClick={() => setMulti(o.v)} className={`relative rounded-full px-3.5 py-1.5 transition-colors ${multi === o.v ? "text-white" : "text-white/50 hover:text-white"}`}>
                {multi === o.v && <motion.span layoutId="inf-ns-toggle" className="absolute inset-0 rounded-full bg-inf-600" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{o.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Field mapping">
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {MAP_ROWS.filter((r) => multi || !r.multiOnly).map((r) => (
                  <motion.div
                    key={r.from}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] transition-colors hover:border-inf-400/40">
                      <span className="text-white/75">{r.from}</span>
                      <ArrowRight className="h-3 w-3 text-white/30" />
                      <span className="text-right font-mono text-[11px] text-inf-200">{r.to}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Panel>

          <Panel label="Journal entry · monthly payroll · sample">
            <AnimatePresence initial={false}>
              {multi && (
                <motion.p key="sub" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-2 overflow-hidden font-mono text-[11px] text-ipink-200">
                  Subsidiary: Company A
                </motion.p>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1.5 font-mono text-[11px]">
              <span className="text-white/35">Account</span>
              <span className="text-right text-white/35">Debit</span>
              <span className="text-right text-white/35">Credit</span>
              {JOURNAL.map((j) => (
                <div key={j.acc} className="contents">
                  <span className="text-white/70">{j.acc}</span>
                  <span className="text-right text-white/80">{j.dr}</span>
                  <span className="text-right text-white/80">{j.cr}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </motion.div>
  );
}
