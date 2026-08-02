"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Cover from "./Cover";

const ENTRIES = [
  {
    title: "Rift Music Player",
    stack: "Swift · SwiftUI · macOS",
    note: "A native macOS client for YouTube Music",
    mark: "rf",
    slug: "rift",
  },
  {
    title: "ProofHub Task Timer",
    stack: "Swift · SwiftData · ProofHub API",
    note: "macOS menu-bar time tracking — pause, resume, bulk-save · open-sourced",
    mark: "tt",
    slug: "proofhub-task-timer",
  },
  {
    title: "MatterGrid",
    stack: "TypeScript · React",
    note: "A grid UI component built for reuse",
    mark: "mg",
    slug: "mattergrid",
  },
];

export default function MoreWork() {
  return (
    <section id="more" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Built for Myself"
          title="Personal"
          italicWord="projects"
          subtext="Native apps and components built outside work hours."
          action={{
            label: "View all",
            href: "https://github.com/MustafaPatharia",
          }}
        />

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.06,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition-colors duration-300 hover:bg-surface sm:rounded-full"
            >
              <span className="accent-gradient flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-20 sm:w-20">
                <span className="relative flex h-[calc(100%-3px)] w-[calc(100%-3px)] items-center justify-center overflow-hidden rounded-full bg-bg font-display text-lg italic text-text-primary">
                  <Cover
                    dir="/personal"
                    slug={entry.slug}
                    seed={i + 2}
                    label={entry.mark}
                    alt={entry.title}
                    compact
                  />
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-base text-text-primary md:text-lg">
                  {entry.title}
                </span>
                <span className="mt-1 block truncate text-xs text-muted">
                  {entry.note}
                </span>
              </span>

              <span className="hidden shrink-0 max-w-[280px] truncate text-xs uppercase tracking-[0.15em] text-muted lg:block">
                {entry.stack}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
