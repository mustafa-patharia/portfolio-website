"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function StackingCards({ cards }: { cards: { title: string, content: ReactNode, bgColor?: string }[] }) {
  return (
    <div className="flex flex-col gap-4 my-20 relative px-4 md:px-0">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ 
            top: `calc(100px + ${i * 30}px)`,
            zIndex: i 
          }}
          className={`sticky w-full border border-stroke rounded-3xl p-8 md:p-16 shadow-2xl min-h-[400px] ${card.bgColor || "bg-surface"}`}
        >
          <h3 className="font-display text-4xl italic text-text-primary mb-8">{card.title}</h3>
          <div className="text-muted leading-relaxed text-lg">
            {card.content}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
