"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import HlsVideo from "./HlsVideo";

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/mustafa-patharia" },
  { label: "GitHub", href: "https://github.com/MustafaPatharia" },
  { label: "Email", href: "mailto:patharia52@gmail.com" },
];
const MARQUEE_TEXT = "BUILDING THE FUTURE • ";

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      className="relative overflow-hidden pb-8 pt-16 md:pb-12 md:pt-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <HlsVideo className="scale-y-[-1]" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Marquee (Hidden per request)
        <div className="mb-16 overflow-hidden md:mb-24">
          <div ref={marqueeRef} className="flex w-max whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="font-display text-5xl italic text-text-primary/30 md:text-7xl lg:text-8xl"
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>
        */}

        {/* CTA */}
        <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">
            Let&rsquo;s work together
          </p>
          <h2 className="mb-10 text-4xl leading-tight tracking-tight text-text-primary md:text-6xl">
            Have a project in{" "}
            <span className="font-display italic">mind?</span>
          </h2>

          <a
            href="mailto:patharia52@gmail.com"
            className="group relative inline-flex rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-text-primary px-8 py-4 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              patharia52@gmail.com
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </span>
          </a>
        </div>

        {/* Footer bar */}
        <div className="mx-auto mt-20 max-w-[1200px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-6 border-t border-stroke pt-8 sm:flex-row">
            <span className="text-xs text-muted">
              © {new Date().getFullYear()} Mustafa Patharia
            </span>

            <nav className="flex flex-wrap items-center justify-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-xs text-muted transition-colors duration-200 hover:text-text-primary"
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Open to opportunities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
