"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BellOff, CalendarCheck, CalendarPlus, Check, Clock, DatabaseZap, Mail, MailCheck } from "lucide-react";
import { Panel, mono, reveal, useTicker } from "./shared";

/* The platform's scheduler types. Figures and names in the visuals are illustrative. */

function EmailVisual() {
  const i = useTicker(3, 1500);
  const kinds = ["Happy birthday", "Work anniversary", "Document expiring soon"];
  return (
    <Panel className="h-[92px]">
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-iorange/15 text-iorange">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[13px] text-white/85">{kinds[i]}</p>
            <p className={`${mono} text-white/35`}>scheduled · 08:00 local</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}

function FollowUpVisual() {
  const i = useTicker(6, 800);
  const acked = Math.min(i, 4);
  return (
    <Panel className="h-[92px]">
      <div className={`${mono} mb-2 flex justify-between text-white/45`}>
        <span>Policy handbook · acknowledgements</span>
        <span className="text-ipink-200">{acked * 25}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, k) => (
          <span key={k} className={`grid h-7 flex-1 place-items-center rounded-md border transition-colors duration-300 ${k < acked ? "border-ipink-500/50 bg-ipink-500/15 text-ipink-200" : "border-white/10 text-white/25"}`}>
            {k < acked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <MailCheck className="h-3.5 w-3.5" />}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function AccrualVisual() {
  const i = useTicker(7, 700);
  const bal = (18 + i * 2.5).toFixed(1);
  return (
    <Panel className="h-[92px]">
      <div className={`${mono} mb-2 flex justify-between text-white/45`}>
        <span>Annual leave balance</span>
        <span className="text-inf-200">{bal} days</span>
      </div>
      <div className="flex h-8 items-end gap-1">
        {Array.from({ length: 7 }).map((_, k) => (
          <motion.span key={k} animate={{ height: k <= i ? `${30 + k * 10}%` : "12%", opacity: k <= i ? 1 : 0.25 }} className="flex-1 rounded-sm bg-iblue/70" />
        ))}
      </div>
    </Panel>
  );
}

function ClockVisual() {
  const i = useTicker(2, 1600);
  return (
    <Panel className="h-[92px]">
      <div className="flex h-full items-center gap-3">
        <motion.span animate={{ rotate: i ? 300 : 90 }} transition={{ type: "spring", stiffness: 60, damping: 14 }} className="relative h-10 w-10 shrink-0 rounded-full border border-white/15">
          <span className="absolute left-1/2 top-1 h-4 w-px -translate-x-1/2 origin-bottom bg-ipink-400" />
        </motion.span>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
            <p className="text-[13px] text-white/85">{i ? "Auto clock-out" : "Auto attendance"}</p>
            <p className={`${mono} text-white/35`}>{i ? "open shifts closed at end of day" : "attendance marked from the schedule"}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  );
}

function MigrateVisual() {
  const i = useTicker(6, 650);
  const dbs = ["admin", "client-a", "client-b", "client-c"];
  return (
    <Panel className="h-[92px]">
      <p className={`${mono} mb-2 text-white/45`}>server start · version check</p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {dbs.map((d, k) => (
          <span key={d} className={`truncate rounded-md border px-1.5 py-1 text-center font-mono text-[9px] transition-colors duration-300 ${k < i ? "border-inf-400/50 bg-inf-600/30 text-inf-100" : "border-white/10 text-white/30"}`}>
            {k < i ? "✓ " : ""}
            {d}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function CleanupVisual() {
  const i = useTicker(5, 700);
  return (
    <Panel className="h-[92px]">
      <div className="space-y-1.5">
        {[0, 1, 2].map((k) => (
          <motion.div key={k} animate={{ opacity: k < i - 1 ? 0.12 : 1, x: k < i - 1 ? 12 : 0 }} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 flex-1 rounded-full bg-white/10" />
            <span className={`${mono} text-white/30`}>{90 + k * 30}d old</span>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

function PlannedLeaveVisual() {
  const i = useTicker(4, 1100);
  return (
    <Panel className="h-[92px]">
      <div className="flex h-full items-center gap-2 sm:gap-3">
        <div className={`flex-1 rounded-lg border px-2.5 py-2 transition-colors duration-300 ${i >= 1 ? "border-inf-400/50 bg-inf-600/25" : "border-white/10"}`}>
          <p className={`${mono} text-white/40`}>Leave plan · 12–16 May</p>
          <p className={`mt-0.5 text-[12px] ${i >= 1 ? "text-inf-100" : "text-white/40"}`}>{i >= 1 ? "✓ Approved" : "Pending approval"}</p>
        </div>
        <motion.span animate={{ x: i >= 2 ? [0, 4, 0] : 0, opacity: i >= 2 ? 1 : 0.25 }} transition={{ duration: 0.6 }}>
          <ArrowRight className="h-4 w-4 text-ipink-400" />
        </motion.span>
        <div className={`flex-1 rounded-lg border px-2.5 py-2 transition-colors duration-300 ${i >= 3 ? "border-ipink-500/50 bg-ipink-500/10" : "border-white/10 border-dashed"}`}>
          <p className={`${mono} text-white/40`}>Leave application</p>
          <p className={`mt-0.5 text-[12px] ${i >= 3 ? "text-ipink-200" : "text-white/30"}`}>{i >= 3 ? "Created on schedule" : "Waiting for date"}</p>
        </div>
      </div>
    </Panel>
  );
}

const ITEMS = [
  { icon: Mail, t: "Email delivery", d: "Birthday and work anniversary emails, and reminders before employee documents expire.", v: EmailVisual },
  { icon: MailCheck, t: "Acknowledgement follow-ups", d: "Follow-up emails for announcements, policy handbooks, polls and surveys until employees acknowledge them.", v: FollowUpVisual },
  { icon: CalendarPlus, t: "Leave accruals", d: "Leave balances accrue on schedule, following each client's policy.", v: AccrualVisual },
  { icon: CalendarCheck, t: "Planned leave applications", d: "Employees plan leave ahead and get the plan approved. When the planned date arrives, a scheduler creates the leave application for it automatically.", v: PlannedLeaveVisual, span: "lg:col-span-2" },
  { icon: Clock, t: "Auto attendance and clock-out", d: "Attendance is marked from the schedule, and open shifts are closed automatically at the end of the day.", v: ClockVisual },
  { icon: BellOff, t: "Notification cleanup", d: "Old notifications are cleared on a schedule, so feeds and tables stay fast.", v: CleanupVisual },
  { icon: DatabaseZap, t: "Self-upgrading databases", d: "On every new deployment, the platform checks the admin database and every client database, and applies any pending migrations.", v: MigrateVisual, span: "sm:col-span-2" },
];

export default function SchedulerCatalog() {
  return (
    <section data-chapter="scheduling" className="px-6 pb-28 pt-2 md:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal} className="mb-8 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">
            <span className="h-px w-6 bg-ipink-500/70" /> The schedulers
          </p>
          <p className="leading-relaxed text-muted md:text-lg">
            Seven kinds of jobs run behind the platform, each for every client and subsidiary in its own time zone.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {ITEMS.map((it, k) => {
            const Icon = it.icon;
            const V = it.v;
            return (
              <motion.div
                key={it.t}
                {...reveal}
                transition={{ ...reveal.transition, delay: (k % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className={`group relative flex flex-col gap-4 overflow-hidden rounded-3xl ${"span" in it ? it.span : ""} border border-white/[0.06] bg-[#110d18] p-5 transition-colors duration-300 hover:border-ipink-500/40`}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-inf-600/40 text-inf-100 transition-colors group-hover:bg-ipink-500/20 group-hover:text-ipink-200">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h4 className="font-medium text-white">{it.t}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{it.d}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <V />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
