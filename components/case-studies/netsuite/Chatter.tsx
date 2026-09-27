"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { reveal } from "./shared";

const NOTES = [
  { kind: "decision", title: "Branch comes from the warehouse.", body: "POS customers are usually anonymous, so subsidiary, department and location come from the counter's warehouse." },
  { kind: "decision", title: "Real-time means one record at a time.", body: "Merging needs a full day of sales, so it only happens in the scheduled run." },
  { kind: "decision", title: "Every NetSuite ID is saved immediately.", body: "A retry continues where it stopped instead of creating duplicates." },
  { kind: "decision", title: "Products are pushed from NetSuite.", body: "NetSuite maintains the catalogue and sends each change, so the add-on never polls for updates." },
  { kind: "limit", title: "One Odoo card, several NetSuite certificates.", body: "NetSuite can't top up a certificate, so each load gets its own. The full Odoo card code stays on the invoice line for reconciliation." },
  { kind: "limit", title: "Refunded gift card balances aren't sent back.", body: "Refunding a gift card doesn't change certificates already in NetSuite. If that balance is later spent, the sync stops with a clear error instead of posting a wrong amount." },
  { kind: "limit", title: "At most four jobs at once.", body: "NetSuite limits concurrent requests, so the queue never runs more than four jobs in parallel." },
  { kind: "lesson", title: "My first Odoo add-on.", body: "This was the first add-on I built for Odoo, and it required a working understanding of how Odoo operates internally: its module structure, the POS data model, and its background job processing. That understanding now allows me to design and deliver future Odoo add-ons considerably more efficiently." },
];

export default function Chatter() {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[19px] top-2 w-px bg-white/10" />
      <div className="flex flex-col gap-3">
        {NOTES.map((n, k) => {
          const limit = n.kind === "limit";
          return (
            <motion.div key={n.title} {...reveal} transition={{ ...reveal.transition, delay: k * 0.04 }} className="group relative flex gap-4">
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-transform duration-300 group-hover:scale-110 ${
                  limit ? "bg-[#3a2a12] text-amber-300" : "bg-odoo-600 text-white"
                }`}
              >
                {limit ? <AlertTriangle className="h-4 w-4" /> : "MP"}
              </span>
              <div className="flex-1 rounded-xl border border-white/[0.06] bg-[#121013] p-4 transition-all duration-300 group-hover:translate-x-1 group-hover:border-odoo-400/30">
                <p className="text-xs text-white/40">
                  <span className="font-medium text-white/70">Mustafa Patharia</span> · {limit ? "Known limitation" : n.kind === "lesson" ? "Lesson learned" : "Design decision"}
                </p>
                <h3 className="mt-1.5 font-medium text-white">{n.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{n.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
