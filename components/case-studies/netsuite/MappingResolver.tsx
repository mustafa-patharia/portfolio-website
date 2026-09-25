"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SyncBadge, mono, reveal } from "./shared";

/* Illustrative IDs in the shape of the addon's payloads. A shop is one warehouse with several
   POS counters, and every counter in it resolves to the same NetSuite IDs. */
const SHOP = { wh: "Shop A", op: "Shop A: PoS Orders", sub: "3", dept: "12", loc: "14" };
const COUNTERS = ["Counter 1", "Counter 2"].map((counter) => ({ id: counter, counter, ...SHOP }));

type RailKey = "subsidiary" | "payment" | "tax";

const RAILS: { key: RailKey; from: string; to: string; failure: string }[] = [
  { key: "subsidiary", from: "Warehouse", to: "Subsidiary · Department · Location", failure: "Warehouse has no active Subsidiary Mapping" },
  { key: "payment", from: "POS payment method · Cash", to: "NetSuite payment method (fetched live)", failure: "Payment method has no active POS Payment Method Mapping" },
  { key: "tax", from: "Sale tax · VAT 5%", to: "NetSuite tax code", failure: "A line's tax has no active Tax Code Mapping" },
];

export default function MappingResolver() {
  const [counter, setCounter] = useState(COUNTERS[0]);
  const [off, setOff] = useState<RailKey | null>(null);

  const chain = [
    { k: "POS counter", v: counter.counter },
    { k: "Operation type", v: counter.op },
    { k: "Warehouse", v: counter.wh },
  ];
  const failed = off ? RAILS.find((r) => r.key === off)! : null;

  return (
    <motion.div {...reveal} className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
      <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#121013] p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`${mono} mr-1 text-white/40`}>Sells at {SHOP.wh}</span>
          {COUNTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCounter(c)}
              aria-pressed={counter.id === c.id}
              className={`rounded-full border px-3 py-1 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                counter.id === c.id ? "border-odoo-600 bg-odoo-600 text-white" : "border-white/10 text-white/55 hover:border-odoo-400/50 hover:text-white"
              }`}
            >
              {c.counter}
            </button>
          ))}
        </div>

        {/* relational chain the addon walks */}
        <div className="flex flex-wrap items-center gap-1.5">
          {chain.map((c, k) => (
            <div key={c.k} className="flex items-center gap-1.5">
              <motion.div
                key={`${counter.id}-${c.k}`}
                initial={{ opacity: 0, y: 6, borderColor: "rgba(166,122,154,0.8)" }}
                animate={{ opacity: 1, y: 0, borderColor: "rgba(255,255,255,0.1)" }}
                transition={{ delay: k * 0.18, duration: 0.5 }}
                className="rounded-lg border bg-white/[0.03] px-2.5 py-1.5"
              >
                <p className={`${mono} text-white/35`}>{c.k}</p>
                <p className="text-sm text-white/85">{c.v}</p>
              </motion.div>
              {k < chain.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-white/25" />}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {RAILS.map((r) => {
            const on = off !== r.key;
            return (
              <div key={r.key} className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5 transition-colors hover:border-odoo-400/30">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{r.from}</p>
                  <p className={`${mono} truncate ${on ? "text-oteal-300" : "text-red-300/80 line-through"}`}>→ {r.to}</p>
                </div>
                <button
                  onClick={() => setOff(on ? r.key : null)}
                  aria-pressed={!on}
                  aria-label={`${on ? "Remove" : "Restore"} ${r.key} mapping`}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-oteal-500" : "bg-white/15"}`}
                >
                  <motion.span layout className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ${on ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            );
          })}
          <p className={`${mono} mt-1 text-white/30`}>Turn a mapping off to see what happens.</p>
        </div>
      </div>

      {/* resulting payload */}
      <div className="flex min-w-0 flex-col rounded-2xl border border-white/[0.06] bg-[#0f0d10] p-5 md:p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className={`${mono} text-white/40`}>invoice payload · header</span>
          <SyncBadge status={failed ? "failed" : "queued"} />
        </div>
        <AnimatePresence mode="wait">
          {failed ? (
            <motion.div key="fail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 rounded-lg border border-red-400/20 bg-red-500/[0.06] p-4">
              <p className="font-mono text-xs text-red-300">foresee_netsuite_error</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{failed.failure}.</p>
              <p className="mt-3 text-xs leading-relaxed text-muted">The record is marked as failed with a clear reason, before anything reaches NetSuite. Once the mapping is fixed, the next run picks it up.</p>
            </motion.div>
          ) : (
            <motion.pre key={counter.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`${mono} flex-1 overflow-hidden rounded-lg bg-black/40 p-4 leading-relaxed text-white/50`}>
              {"{\n"}
              {"  "}<span className="text-white/70">&quot;shop&quot;</span>: &quot;{counter.wh}&quot;,{"\n"}
              {"  "}<span className="text-white/70">&quot;subsidiary_id&quot;</span>: <span className="text-oteal-300">&quot;{counter.sub}&quot;</span>,{"\n"}
              {"  "}<span className="text-white/70">&quot;department_id&quot;</span>: <span className="text-oteal-300">&quot;{counter.dept}&quot;</span>,{"\n"}
              {"  "}<span className="text-white/70">&quot;location_id&quot;</span>: <span className="text-oteal-300">&quot;{counter.loc}&quot;</span>,{"\n"}
              {"  "}<span className="text-white/70">&quot;lines&quot;</span>: [{"{ "}&quot;item_id&quot;: &quot;456&quot;, <span className="text-oteal-300">&quot;tax_code_id&quot;: &quot;-8&quot;</span>{" }"}]{"\n"}
              {"}"}
            </motion.pre>
          )}
        </AnimatePresence>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Subsidiaries, departments and locations are loaded live from NetSuite, so nobody copies IDs by hand. Each warehouse can be mapped only once.
        </p>
      </div>
    </motion.div>
  );
}
