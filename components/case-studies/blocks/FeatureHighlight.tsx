import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FeatureHighlight({ 
  title, 
  subtitle, 
  align = "left", 
  text, 
  visual 
}: { 
  title: string, 
  subtitle?: string, 
  align?: "left" | "right", 
  text: ReactNode, 
  visual: ReactNode 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col lg:flex-row gap-12 items-center ${align === "right" ? "lg:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 w-full">
        <h3 className="font-display text-3xl italic text-text-primary mb-4">{title}</h3>
        {subtitle && <p className="text-sm uppercase tracking-widest text-[#89AACC] mb-6 font-bold">{subtitle}</p>}
        <div className="text-muted leading-relaxed md:text-lg">
          {text}
        </div>
      </div>
      <div className="flex-1 w-full">
        {visual}
      </div>
    </motion.div>
  );
}
