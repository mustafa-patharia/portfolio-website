"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function BeforeAfter({ 
  beforeTitle, 
  afterTitle, 
  beforeContent, 
  afterContent 
}: { 
  beforeTitle: string, 
  afterTitle: string, 
  beforeContent: React.ReactNode, 
  afterContent: React.ReactNode 
}) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="flex flex-col border border-stroke rounded-3xl overflow-hidden bg-surface my-12">
      <div className="flex bg-[#1a1d24] border-b border-stroke">
        <button 
          onClick={() => setShowAfter(false)}
          className={`flex-1 py-4 text-center font-display italic text-lg transition-colors ${!showAfter ? "bg-bg text-text-primary border-b-2 border-[#ff5f56]" : "text-muted hover:text-text-primary"}`}
        >
          {beforeTitle}
        </button>
        <div className="w-px bg-stroke" />
        <button 
          onClick={() => setShowAfter(true)}
          className={`flex-1 py-4 text-center font-display italic text-lg transition-colors ${showAfter ? "bg-bg text-text-primary border-b-2 border-[#27c93f]" : "text-muted hover:text-text-primary"}`}
        >
          {afterTitle}
        </button>
      </div>
      <div className="p-8 md:p-12 relative min-h-[300px]">
        <motion.div
          initial={false}
          animate={{ opacity: showAfter ? 0 : 1, zIndex: showAfter ? 0 : 10 }}
          className="absolute inset-0 p-8 md:p-12"
          style={{ pointerEvents: showAfter ? "none" : "auto" }}
        >
          {beforeContent}
        </motion.div>
        <motion.div
          initial={false}
          animate={{ opacity: showAfter ? 1 : 0, zIndex: showAfter ? 10 : 0 }}
          className="absolute inset-0 p-8 md:p-12"
          style={{ pointerEvents: showAfter ? "auto" : "none" }}
        >
          {afterContent}
        </motion.div>
      </div>
    </div>
  );
}
