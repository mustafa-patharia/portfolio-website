"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { BLUE, LOGO_GRADIENT, ORANGE, PINK, PURPLE } from "./shared";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Illustrative schedule: real scheduler types, generic clients and subsidiaries, sample local times. */
const JOBS = [
  { k: "Accruals", c: BLUE, local: 1 },
  { k: "Cleanup", c: "#b39ce2", local: 3 },
  { k: "Planned leave", c: "#d6c9ef", local: 5 },
  { k: "Auto attendance", c: PURPLE, local: 6 },
  { k: "Emails", c: ORANGE, local: 8 },
  { k: "Follow-ups", c: "#fe7fb5", local: 10 },
  { k: "Auto clock-out", c: PINK, local: 23 },
];

const TENANTS = [
  { k: "A · UAE", tz: "UTC+4", off: 4 },
  { k: "A · KSA", tz: "UTC+3", off: 3 },
  { k: "B · UAE", tz: "UTC+4", off: 4 },
  { k: "C · UAE", tz: "UTC+4", off: 4 },
  { k: "C · India", tz: "UTC+5:30", off: 5.5 },
  { k: "D · KSA", tz: "UTC+3", off: 3 },
];

const r2 = (n: number) => Math.round(n * 100) / 100;
const utc = (local: number, off: number) => (((local - off) % 24) + 24) % 24;

const EVENTS = TENANTS.flatMap((t, row) => JOBS.map((j) => ({ row, job: j, at: utc(j.local, t.off) })));

const BEATS = [
  { t: "Per tenant, subsidiary and time zone", b: "More than ten schedulers and background workers run for every tenant and each of its subsidiaries, at the right moment in that entity's own local day." },
  { t: "Many tenants, one peak hour", b: "Entities in the same time zone start their jobs together, so the platform sees sharp bursts of load at predictable hours." },
  { t: "Built for autoscaling", b: "The cluster adds capacity during a burst. Queued work stays intact while new instances join, so no tenant's job is ever skipped." },
  { t: "Optimised for peak load", b: "Heavy processing runs close to the data, so each job is light on the application servers and the busiest hours stay stable." },
  { t: "Reliable across every tenant", b: "The same schedules run every day for more than ten enterprise companies, whatever the load." },
];

export default function SchedulerDial() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${BEATS.length * 80}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setP(self.progress);
          if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  const hour = p * 24;
  const beat = Math.min(BEATS.length - 1, Math.floor(p * BEATS.length));
  const load = EVENTS.filter((e) => Math.abs(e.at - hour) < 0.6).length;
  const pods = load >= 3 ? 4 : load >= 1 ? 3 : 2;
  const hh = String(Math.floor(hour) % 24).padStart(2, "0");
  const mm = String(Math.floor((hour % 1) * 60)).padStart(2, "0");

  return (
    <section ref={root} id="scheduling" className="relative flex h-screen flex-col justify-center overflow-hidden bg-bg px-6 pt-20 md:px-10">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-inf-600/15 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">
              <span className="h-1.5 w-1.5 rounded-full bg-ipink-500" /> Leave &amp; Attendance · Background jobs
            </p>
            <h2 className="font-display text-3xl italic md:text-5xl">Scheduling and background processing</h2>
          </div>
          <p className="max-w-xs text-sm text-muted">Scroll through one day across six company subsidiaries in four time zones. Schedule shown is illustrative.</p>
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[260px_1fr] md:gap-10">
          {/* dial */}
          <div className="relative mx-auto hidden aspect-square w-[240px] md:block">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle cx="100" cy="100" r="92" fill="#0b0811" stroke="rgba(255,255,255,0.08)" />
              {Array.from({ length: 24 }).map((_, k) => {
                const a = (k / 24) * Math.PI * 2 - Math.PI / 2;
                const r1 = k % 6 === 0 ? 76 : 82;
                return <line key={k} x1={r2(100 + Math.cos(a) * r1)} y1={r2(100 + Math.sin(a) * r1)} x2={r2(100 + Math.cos(a) * 88)} y2={r2(100 + Math.sin(a) * 88)} stroke={k % 6 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)"} strokeWidth={k % 6 === 0 ? 1.5 : 1} />;
              })}
              {EVENTS.map((e, k) => {
                const a = (e.at / 24) * Math.PI * 2 - Math.PI / 2;
                const r = 66 - e.row * 7;
                const fired = e.at <= hour;
                return <circle key={k} cx={r2(100 + Math.cos(a) * r)} cy={r2(100 + Math.sin(a) * r)} r={fired ? 2.6 : 1.6} fill={fired ? e.job.c : "rgba(255,255,255,0.15)"} />;
              })}
              <line x1="100" y1="100" x2="100" y2="14" stroke={PINK} strokeWidth="2" strokeLinecap="round" transform={`rotate(${(hour / 24) * 360} 100 100)`} />
              <circle cx="100" cy="100" r="4" fill={PINK} />
            </svg>
            <div className="absolute inset-x-0 bottom-[-28px] text-center font-mono text-xs text-white/60">
              {hh}:{mm} <span className="text-white/30">UTC</span>
            </div>
          </div>

          <div className="min-w-0">
            {/* timeline per tenant */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0b0811] p-3 md:p-4">
              <div className="mb-2 flex justify-between pl-[68px] font-mono text-[9px] text-white/30 md:pl-[110px]">
                {["00", "06", "12", "18", "24"].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              <div className="space-y-1.5">
                {TENANTS.map((t, row) => (
                  <div key={t.k} className="flex items-center gap-2">
                    <span className="w-[60px] shrink-0 truncate font-mono text-[10px] text-white/55 md:w-[102px] md:text-[11px]">
                      {t.k} <span className="hidden text-white/25 md:inline">{t.tz}</span>
                    </span>
                    <div className="relative h-5 flex-1 rounded bg-white/[0.03]">
                      {EVENTS.filter((e) => e.row === row).map((e) => {
                        const fired = e.at <= hour;
                        const live = Math.abs(e.at - hour) < 0.6;
                        return (
                          <span
                            key={e.job.k}
                            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
                            style={{
                              left: `${(e.at / 24) * 100}%`,
                              background: fired ? e.job.c : "rgba(255,255,255,0.12)",
                              boxShadow: live ? `0 0 12px 2px ${e.job.c}` : "none",
                              transform: `translate(-50%,-50%) scale(${live ? 1.5 : 1})`,
                            }}
                          />
                        );
                      })}
                      <span className="absolute inset-y-[-3px] w-px bg-ipink-500/80" style={{ left: `${(hour / 24) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 pl-[68px] md:pl-[110px]">
                {JOBS.map((j) => (
                  <span key={j.k} className="flex items-center gap-1 font-mono text-[9px] text-white/45 md:text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: j.c }} /> {j.k}
                  </span>
                ))}
              </div>
            </div>

            {/* load + capacity */}
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] md:text-[11px]">
              <div className="rounded-xl border border-white/[0.07] bg-[#0b0811] p-2.5">
                <p className="text-white/35">Jobs running</p>
                <p className={`mt-1 text-base ${load >= 3 ? "text-ipink-300" : "text-white/80"}`}>{load}</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-[#0b0811] p-2.5">
                <p className="text-white/35">Instances</p>
                <div className="mt-1.5 flex gap-1">
                  {[0, 1, 2, 3].map((k) => (
                    <motion.span key={k} animate={{ opacity: k < pods ? 1 : 0.15, scale: k < pods ? 1 : 0.8 }} className="h-3 w-3 rounded-sm" style={{ background: k < pods ? PURPLE : "white" }} />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-[#0b0811] p-2.5">
                <p className="text-white/35">Skipped</p>
                <p className="mt-1 text-base text-inf-200">0</p>
              </div>
            </div>

            {/* beat */}
            <div className="mt-5 min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div key={beat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                  <p className="mb-1.5 font-mono text-xs text-ipink-300">
                    {String(beat + 1).padStart(2, "0")} / {String(BEATS.length).padStart(2, "0")}
                  </p>
                  <h3 className="mb-2 text-xl font-medium text-white md:text-2xl">{BEATS[beat].t}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted md:text-base">{BEATS[beat].b}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/5">
          <div ref={bar} className="h-full origin-left scale-x-0" style={{ backgroundImage: LOGO_GRADIENT }} />
        </div>
      </div>
    </section>
  );
}
