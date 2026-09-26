"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Building2, CalendarDays, Clock, Globe, Smartphone, Target, UserRound, Wallet } from "lucide-react";
import { LOGO_GRADIENT, reveal } from "./shared";

/* The platform's live modules, as listed on infithra.com. */
const MODULES = [
  { id: "core", name: "Core HR", icon: Building2, items: ["Organisation management", "Company structure charts", "Employee documents", "HR policies and handbooks"] },
  { id: "emp", name: "Employee Management", icon: UserRound, items: ["Onboarding", "Employee directory", "Headcount", "Lifecycle through to offboarding"] },
  { id: "time", name: "Time & Attendance", icon: Clock, items: ["Mobile attendance", "Hours across locations", "Work and holiday calendars", "Biometric device integration"] },
  { id: "leave", name: "Leave Management", icon: CalendarDays, items: ["Requests and approvals on web and mobile", "Leave balances", "Vacations and absences", "Leave planner"] },
  { id: "pay", name: "Payroll", icon: Wallet, items: ["Automated payroll cycles", "WPS compliance", "Multi-currency", "PDF payslips", "Expenses, advances, overtime", "End-of-service"] },
  { id: "analytics", name: "People Analytics", icon: BarChart3, items: ["Custom reports", "Scheduled reports", "Per-module dashboards", "Workforce trends"] },
  { id: "perf", name: "Performance", icon: Target, items: ["Employee performance tracking"] },
  { id: "ess", name: "Self-Service", icon: Smartphone, items: ["Payslips and documents", "Requests and approvals", "Announcements", "iOS and Android app"] },
  { id: "platform", name: "Platform", icon: Globe, items: ["English and Arabic", "Open API", "Subscriptions and billing", "Company management"] },
];

export default function ModuleMap() {
  const [active, setActive] = useState(MODULES[4].id);
  const mod = MODULES.find((m) => m.id === active)!;

  return (
    <motion.div {...reveal} className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MODULES.map((m, k) => {
          const on = m.id === active;
          const Icon = m.icon;
          return (
            <motion.button
              key={m.id}
              onMouseEnter={() => setActive(m.id)}
              onFocus={() => setActive(m.id)}
              onClick={() => setActive(m.id)}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: k * 0.04 }}
              whileHover={{ y: -3 }}
              className={`group relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300 ${on ? "border-transparent" : "border-white/[0.07] bg-[#110d18] hover:border-inf-400/40"}`}
            >
              {on && <motion.span layoutId="inf-module-bg" className="absolute inset-0 bg-inf-600" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              {on && <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundImage: LOGO_GRADIENT }} />}
              <Icon className={`relative h-5 w-5 transition-colors ${on ? "text-white" : "text-inf-300 group-hover:text-ipink-300"}`} strokeWidth={1.6} />
              <span className={`relative text-sm font-medium ${on ? "text-white" : "text-white/75"}`}>{m.name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0811] p-6 md:p-8">
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-ipink-500/15 blur-3xl" />
        <AnimatePresence mode="wait">
          <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inf-300">Module</p>
            <h3 className="mt-2 font-display text-3xl italic text-white">{mod.name}</h3>
            <ul className="mt-6 space-y-3">
              {mod.items.map((i, k) => (
                <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + k * 0.05 }} className="flex items-center gap-3 text-white/75">
                  <span className="h-px w-4 bg-ipink-500" />
                  {i}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
