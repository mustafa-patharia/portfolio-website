import { motion } from "framer-motion";

export function StatRow({ stats }: { stats: { value: string, label: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-stroke py-16 my-20">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <span className="font-display text-5xl md:text-6xl text-text-primary font-bold italic mb-3 tracking-tighter">{stat.value}</span>
          <span className="text-sm uppercase tracking-widest text-muted">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
