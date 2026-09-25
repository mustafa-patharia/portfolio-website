"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

/* The module as it appears in Odoo Apps — activating it is how the page opens. */
export default function AppCard() {
  const [phase, setPhase] = useState<"idle" | "installing" | "done">("idle");

  useEffect(() => {
    const a = setTimeout(() => setPhase("installing"), 900);
    const b = setTimeout(() => setPhase("done"), 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const replay = () => {
    if (phase !== "done") return;
    setPhase("installing");
    setTimeout(() => setPhase("done"), 1700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotate: -1 }}
      className="relative w-full max-w-[340px] rounded-2xl border border-white/10 bg-[#f6f4f5] p-5 text-[#2b2530] shadow-[0_40px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(113,75,103,0.25)]"
    >
      <div className="flex items-start gap-4">
        <img src="/projects/odoo-netsuite/module-icon.png" alt="NetSuite POS Integration module icon" className="h-16 w-16 rounded-xl bg-white p-1 shadow-sm" />
        <div className="min-w-0">
          <p className="font-semibold leading-tight">NetSuite POS Integration</p>
          <p className="mt-0.5 text-xs text-[#8f8f8f]">Point of Sale · Odoo 18</p>
          <p className="mt-2 text-xs leading-snug text-[#5b5160]">Invoices, returns, payments and gift cards, posted to NetSuite.</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={replay}
          className="relative h-9 flex-1 overflow-hidden rounded-md bg-[#714b67] text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          <motion.span
            className="absolute inset-y-0 left-0 bg-[#017e84]"
            initial={{ width: "0%" }}
            animate={{ width: phase === "idle" ? "0%" : "100%" }}
            transition={{ duration: phase === "installing" ? 1.6 : 0.3, ease: "easeInOut" }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="relative flex items-center justify-center gap-1.5"
            >
              {phase === "idle" && "Activate"}
              {phase === "installing" && "Installing…"}
              {phase === "done" && (
                <>
                  <Check className="h-4 w-4" /> Installed
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
        <span className="rounded-md border border-[#d9d3d7] px-3 py-2 text-xs text-[#5b5160]">Module Info</span>
      </div>

      <p className="mt-4 border-t border-[#e4dee2] pt-3 font-mono text-[10px] leading-relaxed text-[#8f8f8f]">
        depends: point_of_sale · account · loyalty · queue_job
      </p>
    </motion.div>
  );
}
