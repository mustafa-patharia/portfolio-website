"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import MoreWork from "@/components/MoreWork";
import Explorations from "@/components/Explorations";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";

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

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Navbar />
            <Hero />
            <Works />
            <MoreWork />
            <Explorations />
            <Stats />
            <Contact />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
