"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LoadingScreen from "@/components/LoadingScreen";
import Stage from "@/components/home/Stage";
import JourneyNav from "@/components/home/JourneyNav";
import { jumpToScene } from "@/components/home/journey";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  // Hold the page still while the loader runs.
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const handleComplete = useCallback(() => setIsLoading(false), []);

  // A hash from a cross-page nav (e.g. /#work) maps to a scene label, which
  // only has a scroll position once the loader is gone and the stage measured.
  useEffect(() => {
    if (!isLoading && window.location.hash) {
      requestAnimationFrame(() => jumpToScene(window.location.hash.slice(1), true));
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <JourneyNav />
        <Stage ready={!isLoading} />
      </motion.main>
    </>
  );
}
