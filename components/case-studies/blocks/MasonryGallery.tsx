import { motion } from "framer-motion";

export function MasonryGallery({ images }: { images: { src: string, alt: string, span?: "col-span-1" | "col-span-2" }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`relative overflow-hidden rounded-3xl border border-stroke bg-surface ${img.span || "col-span-1"}`}
        >
          <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
        </motion.div>
      ))}
    </div>
  );
}
