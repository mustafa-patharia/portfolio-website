"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlackHole from "./home/BlackHole";

const EMAIL = "patharia52@gmail.com";

export const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/mustafa-patharia",
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
    label: "X",
    href: "https://x.com/PathariaMustafa",
    icon: (
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    ),
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden pb-8 pt-16 md:pb-12 md:pt-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <BlackHole at="bottom" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        {/* CTA */}
        <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
          <h2 className="mb-4 text-4xl leading-tight tracking-tight text-text-primary md:text-6xl">
            Have something worth{" "}
            <span className="font-display italic">building?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-text-primary/70 md:text-base">
            Tell me what you&apos;re building and where it&apos;s stuck. Every
            message reaches me directly, and I reply personally.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
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
              <span className="relative flex items-center gap-2 rounded-full bg-text-primary px-8 py-4 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
                Book a call
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </button>

            <button
              onClick={copyEmail}
              aria-label={`Copy ${EMAIL}`}
              className="cosmic-btn group relative rounded-full transition-transform duration-300 hover:scale-105"
            >
              <span
                className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ inset: "-2px" }}
              />
              <span className="relative block min-w-[15rem] rounded-full border-2 border-stroke bg-bg px-8 py-4 text-sm text-text-primary transition-colors duration-300 group-hover:border-transparent">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "email"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {copied ? "Copied to clipboard" : EMAIL}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>

          <nav aria-label="Social profiles" className="mt-6 flex items-center justify-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-surface/60 text-muted backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#89AACC]/60 hover:text-text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  {s.icon}
                </svg>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer bar */}
        <div className="mx-auto mt-20 max-w-[1200px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-6 border-t border-stroke pt-8 sm:flex-row">
            <span className="flex items-center gap-2 rounded-full border border-stroke px-3 py-1.5 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Available for freelance
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
