"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HlsVideo from "./HlsVideo";
import { RESUME_MAP, DEFAULT_RESUME } from "@/lib/resumes";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/MustafaPatharia",
    icon: (
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.6.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mustafa-patharia",
    icon: (
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/MustafaPatharia",
    icon: (
      <path d="M20.5 6.2c-.6.27-1.3.46-2 .54a3.5 3.5 0 0 0 1.53-1.93 6.9 6.9 0 0 1-2.2.85 3.47 3.47 0 0 0-5.9 3.16A9.83 9.83 0 0 1 4.7 5.15a3.47 3.47 0 0 0 1.07 4.63 3.4 3.4 0 0 1-1.57-.43v.04a3.47 3.47 0 0 0 2.78 3.4 3.5 3.5 0 0 1-1.56.06 3.47 3.47 0 0 0 3.24 2.41A6.96 6.96 0 0 1 3 16.7a9.8 9.8 0 0 0 5.32 1.56c6.38 0 9.87-5.29 9.87-9.87 0-.15 0-.3-.01-.45A7.06 7.06 0 0 0 20.5 6.2z" />
    ),
  },
];

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [resumeInfo, setResumeInfo] = useState(DEFAULT_RESUME);

  useEffect(() => {
    fetch("https://ipapi.co/json/", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const code = data?.country_code;
        if (code && RESUME_MAP[code]) setResumeInfo(RESUME_MAP[code]);
      })
      .catch(() => {});
  }, []);

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
            className="cosmic-btn group relative inline-flex rounded-full transition-transform duration-300 hover:scale-105"
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

        {/* Connect & follow */}
        <div className="mx-auto mt-20 max-w-[1200px] px-6 md:px-10 lg:px-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Connect &amp; Follow
            </span>
            <span className="h-px flex-1 bg-stroke" />
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="cosmic-btn group relative rounded-full transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span
                  className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ inset: "-1px" }}
                />
                <span className="relative flex items-center gap-2.5 rounded-full border border-stroke bg-surface/70 px-5 py-2.5 text-sm text-muted backdrop-blur-md transition-colors duration-300 group-hover:border-transparent group-hover:bg-bg group-hover:text-text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                    {s.icon}
                  </svg>
                  {s.label}
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer bar */}
        <div className="mx-auto mt-16 max-w-[1200px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-6 border-t border-stroke pt-8 sm:flex-row">
            <span className="flex items-center gap-2 rounded-full border border-stroke px-3 py-1.5 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Open to Work
            </span>

            <span className="text-xs text-muted">
              © {new Date().getFullYear()} Mustafa Patharia. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
