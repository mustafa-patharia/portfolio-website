"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LoadingScreen from "@/components/LoadingScreen";
import Stage from "@/components/home/Stage";
import JourneyNav from "@/components/home/JourneyNav";
import { jumpToScene, onArrive } from "@/components/home/journey";

// Module state survives client-side navigation, so coming back from a case
// study skips the loader. A full load asks the pre-paint script in the root
// layout, which flags <html data-skip-loader> for repeat or internal visits.
let loaderSeen = false;

export default function Index() {
  const [isLoading, setIsLoading] = useState(!loaderSeen);
  // Arriving at a scene (`/#contact`, e.g. from the menu on another page):
  // the journey stays covered until the stage has settled there.
  const [cover, setCover] = useState(false);
  useLayoutEffect(() => {
    if (window.location.hash) setCover(true);
    if ("skipLoader" in document.documentElement.dataset) {
      loaderSeen = true;
      setIsLoading(false);
    }
  }, []);

  // Hold the page still while the loader runs.
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const handleComplete = useCallback(() => {
    loaderSeen = true;
    setIsLoading(false);
  }, []);

  // A hash from a cross-page nav (e.g. /#work) maps to a scene label, which
  // only has a scroll position once the loader is gone and the stage measured.
  useEffect(() => {
    if (isLoading || !window.location.hash) return;
    let cancel = () => {};
    const raf = requestAnimationFrame(() => {
      const at = jumpToScene(window.location.hash.slice(1), true);
      if (at === null) setCover(false);
      else cancel = onArrive(at, () => setCover(false));
    });
    return () => {
      cancelAnimationFrame(raf);
      cancel();
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>
      <AnimatePresence>
        {cover && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[64] bg-bg"
            exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
          />
        )}
      </AnimatePresence>

      <motion.main
        initial={isLoading ? { opacity: 0 } : false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <JourneyNav />
        <Stage ready={!isLoading} />
      </motion.main>
    </>
  );
}
