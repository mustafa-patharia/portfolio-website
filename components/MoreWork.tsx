"use client";

import Link from "next/link";
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
    icon: "/projects/rift.png",
  },
  {
    title: "ProofHub Task Timer",
    stack: "Swift · SwiftData · ProofHub API",
    note: "macOS menu-bar time tracking — pause, resume, bulk-save · open-sourced",
    mark: "tt",
    slug: "proofhub-task-timer",
    icon: "/projects/proofhub-task-timer.png",
  },
  // {
  //   title: "MatterGrid",
  //   stack: "TypeScript · React",
  //   note: "A grid UI component built for reuse",
  //   mark: "mg",
  //   slug: "mattergrid",
  // },
];

export default function MoreWork() {
  return (
    <section id="more" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Open Source"
          title="Open Source"
          italicWord="projects"
          subtext="Tools, apps, and components built and shared with the community."
          action={{
            label: "View all",
            href: "https://github.com/MustafaPatharia",
          }}
        />

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <Link key={entry.title} href={`/case-study/${entry.slug}`} className="block focus:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition-colors duration-300 hover:border-text-primary/30 hover:bg-surface sm:rounded-full"
              >
                <span className="accent-gradient flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-20 sm:w-20">
                  <span className="relative flex h-[calc(100%-3px)] w-[calc(100%-3px)] items-center justify-center overflow-hidden rounded-full bg-bg font-display text-lg italic text-text-primary">
                    {entry.icon ? (
                      <img src={entry.icon} alt={entry.title} className="h-full w-full object-cover" />
                    ) : (
                      <Cover
                        dir="/personal"
                        slug={entry.slug}
                        seed={i + 2}
                        label={entry.mark}
                        alt={entry.title}
                        compact
                      />
                    )}
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base text-text-primary md:text-lg transition-colors group-hover:text-text-primary">
                    {entry.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted">
                    {entry.note}
                  </span>
                </span>

                <span className="hidden shrink-0 max-w-[280px] truncate text-xs uppercase tracking-[0.15em] text-muted lg:block">
                  {entry.stack}
                </span>
                
                <span className="ml-4 mr-2 hidden items-center justify-center text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-text-primary sm:flex">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
