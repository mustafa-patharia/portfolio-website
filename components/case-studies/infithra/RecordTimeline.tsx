"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { LOGO_GRADIENT, reveal } from "./shared";

/* How the platform was built, layer by layer, from the ground up. */
const ENTRIES = [
  { when: "Layer 01", status: "Foundation", title: "Architecture, infrastructure and standards", body: "The cloud services, the split into domain services, the database schema, and the repository structure and coding standards every developer followed." },
  { when: "Layer 02", status: "Platform services", title: "The shared core", body: "Authentication with multi-factor sign-in, multi-tenancy, access control, multi-language data, a standard API structure, reusable components and a global theme." },
  { when: "Layer 03", status: "HR modules", title: "Core HR and the employee lifecycle", body: "Core HR, employee management, onboarding and offboarding, leave, attendance, custom dashboards, analytics and reports." },
  { when: "Layer 04", status: "Payroll engine", title: "Rebuilt until it was configurable", body: "The engine went through several rebuilds as client rules grew more complex, until every pay component and labour-law rule could be configured." },
  { when: "Layer 05", status: "Automation", title: "Schedulers and background workers", body: "More than ten, running for every client and subsidiary in its own time zone." },
  { when: "Layer 06", status: "Admin platform", title: "Running every client platform", body: "Company onboarding, system upgrades and scheduler logs across all clients." },
  { when: "Layer 07", status: "Integrations", title: "Connected systems and mobile", body: "NetSuite ledger sync, open APIs, and the backend services and APIs the mobile app is built on." },
  { when: "Live", status: "Production", title: "In daily use", body: "Launched in production and grown to more than ten enterprise clients and over 2,000 daily users." },
];

export default function RecordTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <motion.div {...reveal} className="overflow-hidden rounded-3xl border border-white/10 bg-[#110d18]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ backgroundImage: LOGO_GRADIENT }}>
            {/* Ionicons "build" outline (MIT) */}
            <svg viewBox="0 0 512 512" aria-hidden className="h-[18px] w-[18px]">
              <path
                d="M393.87,190a32.1,32.1,0,0,1-45.25,0l-26.57-26.57a32.09,32.09,0,0,1,0-45.26L382.19,58a1,1,0,0,0-.3-1.64c-38.82-16.64-89.15-8.16-121.11,23.57-30.58,30.35-32.32,76-21.12,115.84a31.93,31.93,0,0,1-9.06,32.08L64,380a48.17,48.17,0,1,0,68,68L285.86,281a31.93,31.93,0,0,1,31.6-9.13C357,282.46,402,280.47,432.18,250.68c32.49-32,39.5-88.56,23.75-120.93a1,1,0,0,0-1.6-.26Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeWidth={36}
              />
              <circle cx="96" cy="416" r="16" fill="currentColor" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-medium text-white">Build record</p>
            <p className="font-mono text-[10px] text-white/40">Infithra · built from the ground up</p>
          </div>
        </div>
        <span className="rounded-full border border-ipink-500/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ipink-300">Ground up</span>
      </div>

      <div ref={ref} className="relative px-5 py-6 md:px-8 md:py-8">
        <div className="absolute bottom-8 left-[27px] top-8 w-px bg-white/10 md:left-[172px]" />
        <motion.div className="absolute bottom-8 left-[27px] top-8 w-px origin-top md:left-[172px]" style={{ scaleY, backgroundImage: LOGO_GRADIENT }} />
        <div className="space-y-7">
          {ENTRIES.map((e, k) => (
            <motion.div
              key={e.when}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: k * 0.03 }}
              className="group relative grid gap-1 pl-8 md:grid-cols-[120px_1fr] md:gap-10 md:pl-0"
            >
              <span className="font-mono text-xs text-white/45 transition-colors group-hover:text-ipink-300 md:pt-0.5 md:text-right">{e.when}</span>
              <span className="absolute left-[1px] top-1 h-3 w-3 rounded-full border-2 border-ipink-500 bg-bg transition-transform group-hover:scale-125 md:left-[134px]" />
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-white">{e.title}</h3>
                  <span className="rounded-full bg-inf-600/40 px-2 py-0.5 font-mono text-[10px] text-inf-100">{e.status}</span>
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{e.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
