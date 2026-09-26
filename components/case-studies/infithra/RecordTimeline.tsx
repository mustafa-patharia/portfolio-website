"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { LOGO_GRADIENT, reveal } from "./shared";

/* The project's history, laid out like an employee record: from joining to final settlement. */
const ENTRIES = [
  { when: "Dec 2022", status: "Joined", title: "Founding engineer", body: "Started from an empty repository." },
  { when: "2023", status: "Foundation", title: "Architecture and the payroll engine", body: "Cloud infrastructure, service design, tenant isolation, the metadata-driven form system, then the payroll engine and HR modules." },
  { when: "2024", status: "Build-out", title: "The full platform", body: "Analytics and dashboards, leave planning, automated provisioning, the admin and billing platform, schedulers, payslips, the mobile API and the permission system." },
  { when: "31 Dec 2024", status: "Go-live", title: "Launch", body: "The platform went live in production, with KPI as the first client." },
  { when: "2025", status: "Growth", title: "Stabilisation and new clients", body: "Performance, reliability and improvements driven by real users, while more enterprise clients came on board." },
  { when: "2025 – 2026", status: "Scale", title: "Integrations and scale", body: "The NetSuite integration, scheduler reliability across every client, analytics, and faster deployments." },
  { when: "Jul 2026", status: "Settled", title: "Handover", body: "More than ten enterprise clients and over 2,000 daily users on the platform." },
];

export default function RecordTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <motion.div {...reveal} className="overflow-hidden rounded-3xl border border-white/10 bg-[#110d18]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full font-display text-lg italic text-white" style={{ backgroundImage: LOGO_GRADIENT }}>
            i
          </span>
          <div>
            <p className="text-sm font-medium text-white">Employment record</p>
            <p className="font-mono text-[10px] text-white/40">Infithra · Dec 2022 – Jul 2026</p>
          </div>
        </div>
        <span className="rounded-full border border-ipink-500/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ipink-300">~4 years</span>
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
