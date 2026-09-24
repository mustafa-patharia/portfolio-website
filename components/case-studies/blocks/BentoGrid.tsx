import { motion } from "framer-motion";
import { ReactNode } from "react";

export function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({ 
  children, 
  title, 
  colSpan = 1,
  rowSpan = 1,
  className = "" 
}: { 
  children: ReactNode; 
  title?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const cSpans = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  };
  
  const rSpans = {
    1: "md:row-span-1",
    2: "md:row-span-2",
    3: "md:row-span-3",
    4: "md:row-span-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group rounded-[2rem] border border-white/5 bg-[#0f0f11] p-6 overflow-hidden relative flex flex-col ${cSpans[colSpan]} ${rSpans[rowSpan]} ${className} shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] hover:border-white/10 transition-colors`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-50" />
      
      {title && <h3 className="relative z-10 mb-3 font-display text-2xl font-bold tracking-tight text-white/90 drop-shadow-sm">{title}</h3>}
      <div className="relative z-10 flex-1 flex flex-col h-full text-muted leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}
