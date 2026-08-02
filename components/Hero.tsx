"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HlsVideo from "./HlsVideo";

const ROLES = ["Fullstack", "AI", "Platform", "Systems"];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2000
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      ).fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
        0.3
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Adjust the height of this wrapper to change the video's height */}
        <div className="absolute top-0 inset-x-0 h-[50%] overflow-hidden">
          <HlsVideo className="!top-0 !translate-y-0 object-top" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          SENIOR SOFTWARE ENGINEER &middot; AI ENGINEER
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
          <a
            href="#work"
            onClick={(e) => scrollTo(e, "#work")}
            className="group relative rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative block rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              See Works
            </span>
          </a>

          <a
            href="#contact"
            onClick={(e) => scrollTo(e, "#contact")}
            className="group relative rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative block rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm text-text-primary transition-colors duration-300 group-hover:border-transparent">
              Reach out&hellip;
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          SCROLL
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-stroke">
          <span className="accent-gradient absolute inset-x-0 h-1/2 animate-scroll-down" />
        </span>
      </div>
    </section>
  );
}
