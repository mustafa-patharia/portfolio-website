import { motion } from "framer-motion";

export function PullQuote({ quote, author, role }: { quote: string, author?: string, role?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-20 py-12 px-6 md:px-16 rounded-3xl bg-surface/50 border-l-4 border-text-primary"
    >
      <h3 className="font-display text-3xl md:text-5xl text-text-primary leading-tight italic tracking-tight mb-8">
        "{quote}"
      </h3>
      {author && (
        <div className="flex flex-col">
          <span className="font-bold text-text-primary">{author}</span>
          {role && <span className="text-sm text-muted uppercase tracking-widest mt-1">{role}</span>}
        </div>
      )}
    </motion.div>
  );
}
