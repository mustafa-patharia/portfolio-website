"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CalendarClock,
  CalendarDays,
  Cable,
  Globe,
  KeyRound,
  Settings2,
  ShieldCheck,
  Smartphone,
  UserPlus,
  UserRound,
  Wallet,
} from "lucide-react";
import { LOGO_GRADIENT, reveal } from "./shared";

/* The client platform's areas. Items follow the live modules on infithra.com. */
const AREAS = [
  { id: "core", name: "Core HR", icon: Building2, items: ["Organisation management", "Company structure charts", "Employee documents", "HR policies and handbooks"] },
  { id: "emp", name: "Employee management", icon: UserRound, items: ["Employee directory and headcount", "The full employee record", "Documents and records", "Changes across the employee lifecycle"] },
  { id: "pay", name: "Payroll engine", icon: Wallet, items: ["Automated payroll cycles", "WPS compliance", "Multi-currency", "Expenses, advances and overtime", "PDF payslips"] },
  { id: "time", name: "Leave and attendance", icon: CalendarDays, items: ["Requests and approvals", "Leave balances and planner", "Mobile attendance", "Biometric devices", "Work and holiday calendars"] },
  { id: "analytics", name: "Dashboards and analytics", icon: BarChart3, items: ["Custom dashboards", "Custom and scheduled reports", "Workforce trends"] },
  { id: "onboard", name: "Onboarding and offboarding", icon: UserPlus, items: ["Onboarding new joiners", "Access granted in stages", "Offboarding", "End-of-service settlement"] },
  { id: "ess", name: "Employee self-service", icon: Smartphone, items: ["Payslips and documents", "Requests and approvals", "Announcements, polls and surveys", "On web and mobile"] },
  { id: "access", name: "Identity and access", icon: KeyRound, items: ["Multi-tenant sign-in", "Multi-factor authentication", "Role- and attribute-based permissions"] },
  { id: "lang", name: "Multi-language", icon: Globe, items: ["Interface, emails and stored data", "Arabic in production", "Any further language without custom code"] },
  { id: "config", name: "Settings and configuration", icon: Settings2, items: ["Metadata-driven forms", "Pay components and policies", "Per-client rules"] },
  { id: "int", name: "Integrations", icon: Cable, items: ["NetSuite ledger sync", "Open APIs"] },
  { id: "jobs", name: "Schedulers and workers", icon: CalendarClock, items: ["More than ten schedulers", "Per client, subsidiary and time zone"] },
];

const SATELLITES = [
  {
    icon: ShieldCheck,
    name: "Admin platform",
    role: "Supporting platform",
    body: "Onboards new companies, runs system upgrades and keeps scheduler logs across every client platform.",
  },
  {
    icon: Smartphone,
    name: "Mobile app",
    role: "Employee self-service",
    body: "Built by mobile team on the backend services, APIs and business logic I designed.",
  },
];

export default function PlatformScope() {
  const [active, setActive] = useState(AREAS[2].id);
  const area = AREAS.find((a) => a.id === active)!;

  return (
    <motion.div {...reveal} className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      {/* the product itself */}
      <div className="relative overflow-hidden rounded-3xl border border-inf-400/25 bg-[#110d18] p-5 md:p-7">
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundImage: LOGO_GRADIENT }} />
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-inf-600/25 blur-3xl" />
        <div className="relative mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ipink-300">The product</p>
            <h3 className="mt-1 font-display text-3xl italic text-white">Client platform</h3>
          </div>
          <p className="font-mono text-[11px] text-white/40">HR teams · managers · employees</p>
        </div>

        <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {AREAS.map((a, k) => {
            const on = a.id === active;
            const Icon = a.icon;
            return (
              <motion.button
                key={a.id}
                onMouseEnter={() => setActive(a.id)}
                onFocus={() => setActive(a.id)}
                onClick={() => setActive(a.id)}
                aria-pressed={on}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: k * 0.03 }}
                whileHover={{ y: -2 }}
                className={`group relative flex min-h-[76px] flex-col justify-between gap-2 overflow-hidden rounded-xl border p-3 text-left transition-colors duration-300 ${on ? "border-transparent" : "border-white/[0.07] bg-white/[0.02] hover:border-inf-400/40"}`}
              >
                {on && <motion.span layoutId="inf-scope-bg" className="absolute inset-0 bg-inf-600" transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
                <Icon className={`relative h-4 w-4 transition-colors ${on ? "text-white" : "text-inf-300 group-hover:text-ipink-300"}`} strokeWidth={1.7} />
                <span className={`relative text-[13px] leading-tight ${on ? "text-white" : "text-white/70"}`}>{a.name}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative mt-4 min-h-[76px] rounded-xl border border-white/[0.07] bg-[#0b0811] px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.div key={area.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-inf-300">{area.name}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                {area.items.map((i) => (
                  <span key={i} className="flex items-center gap-2 text-[13px] text-white/75">
                    <span className="h-px w-3 bg-ipink-500" />
                    {i}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* what supports it */}
      <div className="flex flex-col gap-5">
        {SATELLITES.map((s, k) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.1 + k * 0.1 }}
              whileHover={{ y: -3 }}
              className="group relative flex flex-1 flex-col justify-center rounded-3xl border border-white/[0.07] bg-[#0d0a13] p-5 transition-colors duration-300 hover:border-ipink-500/40 md:p-6"
            >
              {/* connector back to the client platform */}
              <span aria-hidden className="absolute -left-5 top-1/2 hidden h-px w-5 bg-white/15 lg:block">
                <motion.span
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-ipink-500"
                  animate={{ left: ["100%", "0%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.7, ease: "easeInOut" }}
                />
              </span>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-inf-600/40 text-inf-100 transition-colors group-hover:bg-ipink-500/20 group-hover:text-ipink-200">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <h4 className="font-medium text-white">{s.name}</h4>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{s.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
