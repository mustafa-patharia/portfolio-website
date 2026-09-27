"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function StickyScrollStory({ 
  stories 
}: { 
  stories: { id: string, text: ReactNode, visual: ReactNode }[] 
}) {
  const [activeId, setActiveId] = useState(stories[0].id);

  // Use Intersection Observer to detect which text block is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace(/^story-/, ""));
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // Triggers when element is strictly in the middle 20% of screen
    );

    stories.forEach((story) => {
      const el = document.getElementById(`story-${story.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [stories]);

  return (
    <div className="flex flex-col lg:flex-row relative items-start my-20">
      {/* Left side: Scrolling Text */}
      <div className="flex-1 w-full lg:pr-12">
        <div className="py-[30vh]"> {/* Padding to allow first and last item to reach center */}
          {stories.map((story) => (
            <div 
              key={story.id} 
              id={`story-${story.id}`}
              className={`min-h-[60vh] flex flex-col justify-center transition-opacity duration-500 ${activeId === story.id ? "opacity-100" : "opacity-30"}`}
            >
              <div className="text-muted leading-relaxed md:text-lg">
                {story.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right side: Pinned Visual */}
      <div className="hidden lg:flex flex-1 w-full sticky top-[20vh] h-[60vh] items-center justify-center rounded-3xl border border-stroke bg-surface overflow-hidden p-8">
        <AnimatePresence mode="wait">
          {stories.map((story) => 
            story.id === activeId ? (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                {story.visual}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
