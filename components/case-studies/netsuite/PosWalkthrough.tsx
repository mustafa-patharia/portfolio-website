"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserFrame } from "./shared";

type Spot = { x: number; y: number; label: string };
type Step = { id: string; name: string; src: string; alt: string; text: string; spots: Spot[] };

const STEPS: Step[] = [
  {
    id: "cart",
    name: "Cart",
    src: "/projects/odoo-netsuite/pos-order-cart.jpg",
    alt: "Odoo POS cart with one Coffee line and a total of 10.00 AED",
    text: "Each product on the order becomes a line on a NetSuite document, matched by its NetSuite item ID. Products are created in NetSuite and pushed into Odoo, so every item already has one.",
    spots: [
      { x: 17, y: 11, label: "Line → NetSuite item + tax code" },
      { x: 17, y: 95, label: "Payment" },
    ],
  },
  {
    id: "payment",
    name: "Payment",
    src: "/projects/odoo-netsuite/pos-order-payment.jpg",
    alt: "Odoo POS payment screen with Cash selected and Invoice ticked",
    text: "Ticking Invoice creates the Odoo invoice that the add-on sends to NetSuite. Each payment line, like Cash here, becomes a customer payment applied to that invoice.",
    spots: [
      { x: 25, y: 65, label: "Invoice → NetSuite invoice" },
      { x: 67, y: 63, label: "Tender → Customer Payment" },
    ],
  },
  {
    id: "receipt",
    name: "Receipt",
    src: "/projects/odoo-netsuite/pos-order-receipt.jpg",
    alt: "Odoo POS receipt screen showing Payment Successful",
    text: "The cashier is done. In real-time mode the invoice and payment are already on their way to NetSuite; in scheduled mode they go in the nightly run. Either way, nobody re-enters anything.",
    spots: [{ x: 25, y: 17, label: "Queued for NetSuite" }],
  },
  {
    id: "exchange",
    name: "Exchange",
    src: "/projects/odoo-netsuite/pos-exchange-cart.jpg",
    alt: "Odoo POS exchange: Coffee returned at -10.00, Tea sold at 6.00, total -4.00 AED",
    text: "Not every order is a simple sale. Here a customer returns a Coffee, buys a Tea, and gets 4.00 back. For NetSuite, that one order has to become three linked documents.",
    spots: [
      { x: 17, y: 10, label: "−1 Coffee → credit memo" },
      { x: 17, y: 17, label: "+1 Tea → invoice" },
      { x: 30, y: 59, label: "−4.00 → customer refund" },
    ],
  },
];

export default function PosWalkthrough() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
      <BrowserFrame label={`point_of_sale / ${step.id}`}>
        <div className="relative aspect-[1.51] w-full bg-[#eceaec]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <img src={step.src} alt={step.alt} className="h-full w-full object-cover object-top" loading="lazy" />
              {step.spots.map((s, k) => (
                <motion.div
                  key={s.label}
                  className="group/spot absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + k * 0.15, type: "spring", stiffness: 260, damping: 18 }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-oteal-400/60" />
                  <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-white bg-oteal-500 shadow-[0_0_14px_rgba(1,126,132,0.8)] transition-transform group-hover/spot:scale-125" />
                  <span className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-[#1b1720]/95 px-2 py-1 font-mono text-[10px] text-oteal-200 shadow-lg sm:block">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </BrowserFrame>

      <div>
        <div role="tablist" aria-label="POS order steps" className="flex flex-wrap gap-2">
          {STEPS.map((s, k) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={k === active}
              onClick={() => setActive(k)}
              onMouseEnter={() => setActive(k)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                k === active ? "border-odoo-600 bg-odoo-600 text-white" : "border-white/10 text-white/55 hover:border-odoo-400/50 hover:text-white"
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{k + 1}</span>
              {s.name}
            </button>
          ))}
        </div>
        <div className="mt-6 min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <p className="leading-relaxed text-muted md:text-lg">{step.text}</p>
              <ul className="mt-4 space-y-1.5 sm:hidden">
                {step.spots.map((s) => (
                  <li key={s.label} className="flex items-center gap-2 font-mono text-[11px] text-oteal-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-oteal-400" />
                    {s.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
