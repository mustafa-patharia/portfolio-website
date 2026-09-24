import { motion } from "framer-motion";

export function HorizontalProcess({ steps }: { steps: { title: string, description: string }[] }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      {/* Connector line for desktop */}
      <div className="hidden md:block absolute top-[24px] left-[50px] right-[50px] h-px bg-stroke -z-10" />
      
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="flex-1 flex flex-col relative"
        >
          <div className="w-12 h-12 rounded-full border border-stroke bg-bg flex items-center justify-center font-display text-text-primary text-xl mb-6 mx-auto md:mx-0">
            {i + 1}
          </div>
          <h3 className="text-xl font-display text-text-primary italic mb-3 text-center md:text-left">{step.title}</h3>
          <p className="text-muted text-sm leading-relaxed text-center md:text-left">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
