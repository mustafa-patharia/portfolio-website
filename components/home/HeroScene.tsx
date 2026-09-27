"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import BlackHole from "./BlackHole";

// Asked of the visitor (clients first, then the recruiter hook); the one
// answer below fits every question.
const ASKS = [
  "a SaaS platform?",
  "a mobile app?",
  "an ERP integration?",
  "a custom add-on module?",
  "a website?",
  "a full-stack engineer on your team?",
];

export default function HeroScene({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setRoleIndex((i) => (i + 1) % ASKS.length),
      2600
    );
    return () => window.clearInterval(id);
  }, []);

  // Intro waits for the loader so it isn't spent behind it.
  useGSAP(
    () => {
      if (!ready) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".name-reveal",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
        )
        .fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          // Drop the spent filter: a lingering blur(0px) re-rasterises the buttons'
          // animated borders every frame over the live canvas, and they shimmer.
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, clearProps: "filter" },
          0.3
        );
    },
    { scope: rootRef, dependencies: [ready] }
  );

  return (
    <section
      id="home"
      data-scene="home"
      aria-label="Intro"
      ref={rootRef}
      className="absolute inset-0"
    >
      <BlackHole />

      <div className="hero-copy relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 text-center md:pt-32">
        <p className="blur-in mb-8 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted sm:flex-row sm:gap-0 sm:text-xs sm:tracking-[0.3em]">
          <span>Senior Full-Stack Engineer</span>
          <span aria-hidden className="hidden sm:inline">&nbsp;&middot;&nbsp;</span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#89AACC] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#89AACC]" />
            </span>
            Available for freelance &amp; full-time
          </span>
        </p>

        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          Mustafa Patharia
        </h1>

        {/* The line stays centred on each question; "Need" glides to its new
            spot while the old question pops out and the next fades in. */}
        <p className="blur-in mb-5 flex items-baseline justify-center gap-2 md:gap-3">
          <motion.span
            layout="position"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-base text-text-primary/70 md:text-lg"
          >
            Need
          </motion.span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={roleIndex}
              layout="position"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="whitespace-nowrap font-display text-xl italic text-text-primary sm:text-2xl md:text-3xl"
            >
              {ASKS[roleIndex % ASKS.length]}
            </motion.span>
          </AnimatePresence>
        </p>

        <p className="blur-in mb-12 max-w-md text-[15px] leading-relaxed text-text-primary/70 md:max-w-lg md:text-lg">
          I&apos;ve spent five years taking software from first idea to launch,
          working on my own and as part of a team.
        </p>

        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
          <button
            data-cal-link="mustafa-patharia/quick-chat"
            data-cal-namespace="quick-chat"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            className="cosmic-btn group relative rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative flex items-center gap-2 rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              Schedule Meet
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </button>

          <a
            href="#work"
            data-journey="work"
            className="cosmic-btn group relative rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative block rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm text-text-primary transition-colors duration-300 group-hover:border-transparent">
              See Works
            </span>
          </a>
        </div>
      </div>

      <div className="hero-cue absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          Scroll to enter
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-stroke">
          <span className="accent-gradient absolute inset-x-0 h-1/2 animate-scroll-down" />
        </span>
      </div>
    </section>
  );
}
