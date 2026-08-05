"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Works from "@/components/Works";
import MoreWork from "@/components/MoreWork";
import SkillsConstellation from "@/components/SkillsConstellation";
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

  // Sections don't exist in the DOM until loading finishes, so a hash from a
  // cross-page nav (e.g. /#skills) can't be scrolled to until now.
  useEffect(() => {
    if (!isLoading && window.location.hash) {
      document
        .querySelector(window.location.hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <Navbar />
        <Hero />
        <AboutMe />
        <Works />
        <MoreWork />
        <SkillsConstellation />
        <Stats />
        <Contact />
      </motion.main>
    </>
  );
}
