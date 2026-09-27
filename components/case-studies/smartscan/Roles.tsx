"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Role = {
  id: string;
  hat: string;
  area: string;
  line: string;
  points: string[];
  artifacts: string[];
};

const ROLES: Role[] = [
  {
    id: "architect",
    hat: "Architected",
    area: "Architecture",
    line: "Designed the system before a line of it was written.",
    points: [
      "Made the middleware the owner of warehouse state, with the ERP remaining the financial system of record: the decision the rest of the architecture depends on.",
      "Chose tag-level tracking over quantities, a Postgres outbox ahead of Redis, and database-enforced locks.",
      "Made the ERP a pluggable connector, and multi-tenancy a schema per tenant, so one deployment serves many companies, on any ERP.",
    ],
    artifacts: ["Technical Design Document", "Architecture & data model"],
  },
  {
    id: "solution",
    hat: "Integrated",
    area: "Integration",
    line: "Plugs into any NetSuite account, and any ERP after it.",
    points: [
      "Kept the core ERP-agnostic. An ERP is a connector class with two methods, fetch records and post transactions, so supporting SAP or another ERP is one new class with no API, route or dashboard changes.",
      "Made the NetSuite connector account-independent. Credentials, RESTlet URLs and record mappings are set per tenant in the dashboard, not written into the code.",
      "Mapped each warehouse flow to the ERP transaction it becomes (receipts, fulfillments, bin transfers, inventory adjustments), and caught anything the ERP would reject at scan time, on the floor.",
    ],
    artifacts: ["Pluggable connector interface", "NetSuite Integration Guide"],
  },
  {
    id: "product",
    hat: "Scoped",
    area: "Product",
    line: "Owned what shipped, not just how.",
    points: [
      "Scoped the product around how warehouses actually run: multiple companies on one platform, operators limited to their own locations, counts that catch extra stock as well as missing stock, one active handheld per user.",
      "Turned edge cases into rules — what a transfer-order receipt does with an unknown tag, what a clean count posts (nothing).",
      "Wrote the QA plan the product was signed off against.",
    ],
    artifacts: ["Product scope", "QA Test Documentation"],
  },
  {
    id: "ux",
    hat: "Designed",
    area: "Experience",
    line: "Designed for the person holding the scanner.",
    points: [
      "Designed every handheld workflow around one scanning model, scoped to the operator's own warehouse.",
      "Every rejected tag comes back with a plain reason, and every sync error goes to the person who can fix it — 'map this item in Connectors'.",
      "Locked Android's back gesture during an active scan so one stray swipe can't throw away a session.",
    ],
    artifacts: ["Handheld & admin UI", "Operator and admin manuals"],
  },
  {
    id: "engineer",
    hat: "Shipped",
    area: "Delivery",
    line: "Built and shipped every surface.",
    points: [
      "Middleware API — NestJS 11, Drizzle, PostgreSQL 17: tag registry, warehouse flows, RBAC, tenant isolation, pluggable ERP connectors.",
      "Admin dashboard — Next.js 16, React 19: master data, orders, the ERP sync queue and connector mappings.",
      "Android app — Expo / React Native, plus a Kotlin native module wrapping the Urovo RFID SDK.",
      "Infrastructure — Terraform on AWS, GitHub Actions over OIDC, zero-SSH deploys through SSM.",
    ],
    artifacts: ["162 of 171 commits", "API Reference"],
  },
];

export default function Roles() {
  const [active, setActive] = useState(ROLES[0].id);
  const role = ROLES.find((r) => r.id === active)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-10">
      <div role="tablist" aria-label="What I owned on this project" className="flex flex-col">
        {ROLES.map((r, k) => {
          const on = r.id === active;
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(r.id)}
              onMouseEnter={() => setActive(r.id)}
              className="group relative flex items-baseline gap-4 border-b border-white/10 py-4 text-left transition-colors md:py-5"
            >
              {on && (
                <motion.span
                  layoutId="ss-role-bar"
                  className="absolute bottom-[-1px] left-0 h-px w-full bg-ss-400"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className={`font-mono text-xs transition-colors ${on ? "text-ss-300" : "text-white/30 group-hover:text-white/60"}`}>
                {String(k + 1).padStart(2, "0")}
              </span>
              <span
                className={`font-display text-2xl italic transition-all duration-300 md:text-3xl ${
                  on ? "translate-x-1 text-white" : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {r.hat}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[380px] overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#0f0f11] p-6 md:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ss-400/10 blur-3xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ss-300/80">{role.area}</p>
            <h3 className="mt-3 text-2xl font-medium leading-snug text-white md:text-3xl">{role.line}</h3>
            <ul className="mt-6 space-y-4">
              {role.points.map((p, k) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + k * 0.07 }}
                  className="flex gap-3 leading-relaxed text-muted"
                >
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-ss-400" />
                  {p}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {role.artifacts.map((a) => (
                <span key={a} className="rounded-full border border-ss-400/30 bg-ss-400/[0.06] px-3 py-1 font-mono text-[11px] text-ss-200">
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
