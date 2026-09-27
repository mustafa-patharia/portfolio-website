import { motion } from "framer-motion";

export function MetricCards({ metrics }: { metrics: { label: string, value: string, trend?: string, positive?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-10">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface border border-stroke rounded-2xl p-6 flex flex-col"
        >
          <span className="text-xs uppercase tracking-widest text-muted mb-4">{metric.label}</span>
          <span className="font-display text-3xl italic text-text-primary mb-2">{metric.value}</span>
          {metric.trend && (
            <span className={`text-xs font-bold ${metric.positive ? "text-[#27c93f]" : "text-[#ff5f56]"}`}>
              {metric.trend}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
