import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Timeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative pl-6 md:pl-10">
      <div className="absolute bottom-0 left-[7px] top-2 w-px bg-stroke md:left-[11px]" />
      <div className="flex flex-col gap-12">
        {children}
      </div>
    </div>
  );
}

export function TimelineStep({ title, tool, children, delay = 0 }: { title: string, tool?: string, children: ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      <div className="absolute left-[-24px] top-[6px] h-3 w-3 rounded-full border-2 border-bg bg-text-primary transition-transform duration-300 hover:scale-150 md:left-[-38px]" />
      <h3 className="mb-1 text-xl text-text-primary">{title}</h3>
      {tool && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#89AACC]">{tool}</p>}
      <div className="text-sm leading-relaxed text-muted md:text-base">
        {children}
      </div>
    </motion.div>
  );
}
