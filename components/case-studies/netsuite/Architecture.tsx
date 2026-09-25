"use client";

import { motion } from "framer-motion";
import { mono, reveal } from "./shared";

function Box({ title, sub, items, tone }: { title: string; sub: string; items: string[]; tone: "odoo" | "addon" | "ns" }) {
  const ring =
    tone === "addon"
      ? "border-odoo-400/50 bg-odoo-600/[0.12] shadow-[0_0_60px_rgba(113,75,103,0.25)]"
      : tone === "ns"
        ? "border-oteal-400/35 bg-oteal-500/[0.07]"
        : "border-white/10 bg-white/[0.02]";
  return (
    <motion.div whileHover={{ y: -4 }} className={`relative flex-1 rounded-2xl border p-5 transition-colors ${ring}`}>
      <p className={`${mono} uppercase tracking-[0.2em] text-white/40`}>{sub}</p>
      <h3 className="mt-1 text-lg font-medium text-white">{title}</h3>
      <ul className="mt-4 space-y-1.5">
        {items.map((i) => (
          <li key={i} className={`${mono} rounded-md border border-white/[0.06] bg-black/20 px-2 py-1.5 text-white/65`}>
            {i}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Wire({ out, inn }: { out: string; inn?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-3 py-3 md:w-40 md:py-0">
      {[
        { label: out, dir: 1, color: "bg-odoo-300" },
        ...(inn ? [{ label: inn, dir: -1, color: "bg-oteal-300" }] : []),
      ].map((l) => (
        <div key={l.label} className="flex w-full flex-col items-center gap-1">
          <div className="relative hidden h-px w-full bg-white/15 md:block">
            <motion.span
              className={`absolute -top-[3px] h-[7px] w-[7px] rounded-full ${l.color} shadow-[0_0_10px_currentColor]`}
              animate={{ left: l.dir > 0 ? ["0%", "100%"] : ["100%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="relative h-8 w-px bg-white/15 md:hidden">
            <motion.span
              className={`absolute -left-[3px] h-[7px] w-[7px] rounded-full ${l.color}`}
              animate={{ top: l.dir > 0 ? ["0%", "100%"] : ["100%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className={`${mono} text-center text-white/45`}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Architecture() {
  return (
    <motion.div {...reveal}>
      <div className="flex flex-col items-stretch md:flex-row">
        <Box
          tone="odoo"
          sub="Odoo 18"
          title="Point of Sale"
          items={["pos.order", "pos.payment · tenders", "account.move · invoices, credit notes", "loyalty.history · gift cards"]}
        />
        <Wire out="posted / paid → queued" />
        <Box
          tone="addon"
          sub="The add-on"
          title="netsuite_pos_integration"
          items={["/api/netsuite/* controllers", "invoice · credit note · payment sync", "queue_job · root.netsuite", "mappings · sync log"]}
        />
        <Wire out="OAuth 1.0a · JSON" inn="config · products · X-API-Key" />
        <Box
          tone="ns"
          sub="NetSuite"
          title="RESTlets & SuiteQL"
          items={["invoice · credit memo · payment RESTlets", "payment method list", "SuiteQL · subsidiaries, locations", "configuration record · products"]}
        />
      </div>
      <p className="mt-6 max-w-5xl text-sm leading-relaxed text-muted">
        The add-on runs inside Odoo and calls NetSuite directly. NetSuite owns the configuration and product catalogue and sends both to Odoo.
        Odoo owns the POS transactions and sends those to NetSuite. Outgoing requests are signed with OAuth 1.0a; incoming requests are
        authenticated with an Odoo API key.
      </p>
    </motion.div>
  );
}
