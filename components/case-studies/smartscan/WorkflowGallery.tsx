"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Card = {
  id: string;
  slot: -2 | -1 | 0 | 1 | 2;
  name: string;
  src: string;
  alt: string;
  text: string;
};

const CARDS: Card[] = [
  {
    id: "receiving",
    slot: -2,
    name: "Receiving",
    src: "/projects/smartscan/device/receiving.jpeg",
    alt: "Receiving screen listing pending purchase orders",
    text: "Goods arrive against a purchase order or an inbound transfer order. An unknown tag on a PO is new stock and gets registered; an unknown tag on a transfer order can't be real, so it's flagged.",
  },
  {
    id: "count",
    slot: -1,
    name: "Cycle count",
    src: "/projects/smartscan/device/cycle-count.jpeg",
    alt: "Cycle count screen with bins to audit",
    text: "Sweep a bin and compare what's there with what should be. Only the variance — short or extra — is posted as an adjustment. A clean count sends nothing and ends as 'skipped'.",
  },
  {
    id: "menu",
    slot: 0,
    name: "One scanning model",
    src: "/projects/smartscan/device/workflow-menu.jpeg",
    alt: "Handheld workflow menu: stock availability, receiving, cycle count, picking, bin transfer",
    text: "Every workflow starts the same way — pick a document or a bin, scan, review, complete — and every one is scoped to the operator's warehouse. Learn one, and you know them all.",
  },
  {
    id: "picking",
    slot: 1,
    name: "Picking & shipping",
    src: "/projects/smartscan/device/picking.jpeg",
    alt: "Picking screen listing active sales orders",
    text: "Scan out against a sales order or an outbound transfer. Tags that were already shipped, belong to another item, or sit outside the operator's location are rejected before the ERP ever sees them.",
  },
  {
    id: "stock",
    slot: 2,
    name: "Stock availability",
    src: "/projects/smartscan/device/stock-availability.jpeg",
    alt: "Stock availability lookup grouped by location",
    text: "A read-only lookup: search or scan an item and see what's on hand, grouped by location. No session, no lock — just the answer.",
  },
];

/* Fan geometry, in % of the card's own width so it scales with breakpoints. */
const X = { "-2": -118, "-1": -62, "0": 0, "1": 62, "2": 118 } as const;
const ROT = { "-2": -10, "-1": -5, "0": 0, "1": 5, "2": 10 } as const;
const SCALE = { "-2": 0.8, "-1": 0.9, "0": 1, "1": 0.9, "2": 0.8 } as const;

export default function WorkflowGallery() {
  const [active, setActive] = useState("menu");
  const card = CARDS.find((c) => c.id === active)!;

  return (
    <div className="overflow-x-clip">
      <div className="relative mx-auto flex h-[300px] items-end justify-center sm:h-[420px] md:h-[560px]">
        {CARDS.map((c, k) => {
          const on = c.id === active;
          const s = String(c.slot) as keyof typeof X;
          return (
            <motion.button
              key={c.id}
              type="button"
              aria-label={c.name}
              aria-pressed={on}
              onMouseEnter={() => setActive(c.id)}
              onFocus={() => setActive(c.id)}
              onClick={() => setActive(c.id)}
              initial={{ x: "0%", rotate: 0, scale: 0.85, opacity: 0 }}
              whileInView={{ x: `${X[s]}%`, rotate: ROT[s], scale: SCALE[s], opacity: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              animate={{ y: on ? -24 : 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 20, delay: k * 0.04 }}
              style={{ zIndex: on ? 30 : 10 - Math.abs(c.slot), transformOrigin: "50% 100%" }}
              className="absolute bottom-6 w-[118px] cursor-pointer outline-none sm:w-[170px] md:w-[230px]"
            >
              <div
                className={`overflow-hidden rounded-[1.2rem] border-[5px] bg-[#1c1c1f] transition-all duration-300 md:rounded-[1.6rem] md:border-[6px] ${
                  on
                    ? "border-[#1c1c1f] shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(76,162,251,0.6),0_0_40px_rgba(2,107,192,0.35)]"
                    : "border-[#1c1c1f] shadow-[0_20px_50px_rgba(0,0,0,0.6)] brightness-[0.6]"
                }`}
              >
                <img src={c.src} alt={c.alt} className="block w-full rounded-[0.8rem] md:rounded-[1.15rem]" loading="lazy" draggable={false} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* labels */}
      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {CARDS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            onMouseEnter={() => setActive(c.id)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-all duration-300 hover:-translate-y-0.5 ${
              c.id === active ? "border-ss-600 bg-ss-600 text-white" : "border-white/10 text-white/50 hover:border-ss-400/50 hover:text-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 min-h-[120px] max-w-2xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-2xl font-medium text-white">{card.name}</h3>
            <p className="mt-3 leading-relaxed text-muted">{card.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
