"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";

export function AccordionDeepDive({ title, children }: { title: string, children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-stroke rounded-2xl overflow-hidden bg-surface my-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-stroke/20 transition-colors"
      >
        <span className="font-display text-xl text-text-primary italic">{title}</span>
        <span className="text-2xl text-muted">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-muted leading-relaxed border-t border-stroke mt-2">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
