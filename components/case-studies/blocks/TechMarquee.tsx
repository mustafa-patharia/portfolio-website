import { motion } from "framer-motion";

export function TechMarquee({ items }: { items: string[] }) {
  // Duplicate items to ensure smooth infinite scrolling
  const marqueeItems = [...items, ...items, ...items, ...items];
  
  return (
    <div className="w-full overflow-hidden py-10 my-10 border-y border-stroke bg-surface/30 relative flex">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg to-transparent z-10" />
      
      <motion.div
        animate={{ x: [0, -1035] }} // Adjust based on content width, -1035 is an approximation for smooth loop
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 20 
        }}
        className="flex whitespace-nowrap gap-12 px-6 items-center"
      >
        {marqueeItems.map((item, i) => (
          <span key={i} className="font-display text-2xl md:text-3xl italic text-stroke whitespace-nowrap">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
