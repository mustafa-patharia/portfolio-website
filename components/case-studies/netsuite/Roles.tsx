"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROLES = [
  {
    id: "architect",
    hat: "Architected",
    line: "Designed how every POS transaction reaches NetSuite.",
    points: [
      "Routed documents by warehouse rather than customer, since POS customers are usually anonymous.",
      "Used individual POS payments as the source for NetSuite payments, instead of end-of-session totals.",
      "Built one ordered sync that stops as soon as a step fails.",
    ],
    artifacts: ["Technical Design Document", "Data model"],
  },
  {
    id: "integrate",
    hat: "Integrated",
    line: "Defined how the two systems exchange data.",
    points: [
      "Wrote the data contract for every document sent to NetSuite, and the endpoints NetSuite uses to send configuration and products.",
      "Secured outgoing calls with OAuth 1.0a and incoming calls with API keys.",
      "Loaded branches, departments, locations and payment methods live from NetSuite.",
    ],
    artifacts: ["API Integration Docs", "Mapping models"],
  },
  {
    id: "scope",
    hat: "Scoped",
    line: "Turned real retail situations into clear rules.",
    points: [
      "Exchanges, change, zero-value payments, and gift cards topped up several times each got a defined outcome.",
      "Wrote the QA plan the add-on was signed off against.",
    ],
    artifacts: ["Product scope", "QA Test Documentation"],
  },
  {
    id: "design",
    hat: "Designed",
    line: "Made the integration easy to monitor and support.",
    points: [
      "An Add-on Overview tab on every POS order, listing each document it created in NetSuite.",
      "A one-step manual sync, and a log that keeps every request and response.",
      "Error messages that tell the admin exactly what to fix.",
    ],
    artifacts: ["Admin Manual", "User Manual"],
  },
  {
    id: "ship",
    hat: "Delivered",
    line: "Built, tested and handed over the add-on.",
    points: [
      "The complete Odoo 18 add-on.",
      "72 automated tests.",
      "Admin and user manuals, and the onboarding and deployment guide the client's team installs from.",
    ],
    artifacts: ["Test suite", "Customer Onboarding Guide"],
  },
];

export default function Roles() {
  const [active, setActive] = useState(ROLES[0].id);
  const role = ROLES.find((r) => r.id === active)!;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121013]">
      {/* Odoo form notebook tabs */}
      <div role="tablist" aria-label="What I owned on this project" className="flex overflow-x-auto border-b border-white/10 px-2 [scrollbar-width:none] md:px-4">
        {ROLES.map((r) => {
          const on = r.id === active;
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(r.id)}
              onMouseEnter={() => setActive(r.id)}
              className={`relative -mb-px shrink-0 rounded-t-lg border px-4 py-3 text-sm transition-colors md:px-5 md:text-base ${
                on ? "border-white/10 border-b-[#121013] bg-[#121013] text-white" : "border-transparent text-white/45 hover:text-white/80"
              }`}
            >
              {on && <motion.span layoutId="ns-role-top" className="absolute inset-x-0 top-0 h-0.5 rounded-t bg-odoo-400" />}
              {r.hat}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[330px] p-6 md:p-9">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-odoo-600/20 blur-3xl" />
        <AnimatePresence mode="wait">
          <motion.div key={role.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="relative grid gap-8 md:grid-cols-[1fr_1.5fr]">
            <h3 className="font-display text-3xl italic leading-snug text-white md:text-4xl">{role.line}</h3>
            <div>
              <ul className="space-y-4">
                {role.points.map((p, k) => (
                  <motion.li key={p} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + k * 0.07 }} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-oteal-400" />
                    {p}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-2">
                {role.artifacts.map((a) => (
                  <span key={a} className="rounded-md border border-odoo-400/30 bg-odoo-600/10 px-2.5 py-1 font-mono text-[11px] text-odoo-100 transition-colors hover:border-odoo-300/60">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
