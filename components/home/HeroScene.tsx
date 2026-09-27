"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BlackHole from "./BlackHole";

const ROLES = ["Fullstack", "AI", "Platform", "Systems"];

export default function HeroScene({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2000
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
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
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
        <p className="blur-in mb-8 text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
          Senior Software Engineer &middot; AI Engineer
        </p>

        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          Mustafa Patharia
        </h1>

        <p className="blur-in mb-4 text-base text-muted md:text-lg">
          A{" "}
          <span
            key={roleIndex}
            className="inline-block animate-role-fade-in font-display italic text-text-primary"
          >
            {ROLES[roleIndex]}
          </span>{" "}
          engineer, architecting the systems that scale.
        </p>

        <p className="blur-in mb-12 max-w-md text-sm text-muted md:text-base">
          Five years architecting multi-tenant SaaS platforms, distributed
          backends, and the agentic tooling that builds them faster.
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
