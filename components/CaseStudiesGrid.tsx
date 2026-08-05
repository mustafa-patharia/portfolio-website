"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Cover from "./Cover";
import { CASE_STUDIES } from "@/lib/case-studies";

export default function CaseStudiesGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {CASE_STUDIES.map((study, i) => (
        <motion.article
          key={study.slug}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-stroke bg-surface"
        >
          <Link href={`/case-study/${study.slug}`} className="block h-full w-full">
            <Cover dir="/projects" slug={study.slug} seed={i} alt={study.title} />
            <div className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-500 group-hover:opacity-0 md:p-8">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">
                {study.kicker}
              </p>
              <h3 className="font-display text-3xl italic text-white md:text-4xl">
                {study.title}
              </h3>
            </div>

            <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-bg/70 p-6 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                {study.stack}
              </p>
              <p className="max-w-md text-sm text-text-primary md:text-base">
                {study.description}
              </p>
              <span className="relative inline-flex w-fit rounded-full p-[2px]">
                <span className="accent-gradient-animated absolute inset-0 rounded-full" />
                <span className="relative rounded-full bg-white px-5 py-2.5 text-sm text-black">
                  Read Case Study
                </span>
              </span>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
