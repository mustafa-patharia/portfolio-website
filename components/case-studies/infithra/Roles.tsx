"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROLES = [
  {
    id: "architect",
    hat: "Architected",
    line: "Set the technical foundation of the whole platform.",
    points: [
      "Designed the cloud infrastructure and the service-based backend: one frontend service and four backend services, split by domain.",
      "Designed the database schema, and set the repository structure and coding standards every other developer followed.",
      "Defined the tenant isolation strategy and how new clients are onboarded.",
      "Took part in every design and vendor discussion, and decided how the system would operate as it grew.",
    ],
    tags: ["System architecture", "Cloud infrastructure", "Tenant isolation"],
  },
  {
    id: "design",
    hat: "Designed",
    line: "Shaped how HR teams, managers and employees use it.",
    points: [
      "Designed screens and user flows across the client platform and the admin platform.",
      "Built a metadata-driven form system with the frontend developer, so new fields and validations need no code change.",
      "A standard set of reusable components and a global theme, so every screen looks and behaves the same.",
    ],
    tags: ["UI / UX", "Metadata-driven forms", "Design system"],
  },
  {
    id: "engineer",
    hat: "Engineered",
    line: "Built the payroll engine and the HR modules around it.",
    points: [
      "A configurable payroll engine with labour-law compliance, for contracts, contributions and employee classifications.",
      "Leave, attendance, overtime, vacations, expenses, reimbursements, advances and end-of-service.",
      "The full employee lifecycle, from onboarding to offboarding, plus analytics dashboards and PDF payslips.",
    ],
    tags: ["Payroll engine", "Core HR", "Analytics"],
  },
  {
    id: "secure",
    hat: "Secured",
    line: "Made sure every user sees exactly what they should.",
    points: [
      "A hybrid role- and attribute-based permission system, designed after researching how leading HR and cloud platforms handle access.",
      "Module-level create, read, update and delete rights, scoped by organisational structure in any combination.",
      "Multi-tenant sign-in with multi-factor authentication: one login across clients, with access granted in stages.",
      "Tenant isolation built into every service from day one.",
    ],
    tags: ["RBAC + ABAC", "Multi-factor sign-in", "Data isolation"],
  },
  {
    id: "automate",
    hat: "Automated",
    line: "Built the background systems that run the platform every day.",
    points: [
      "More than ten schedulers and background workers, each running per client and per subsidiary, in that entity's own time zone.",
      "Leave accruals, auto attendance, auto clock-out, and leave applications created automatically from approved leave plans.",
      "Scheduled emails for birthdays, work anniversaries and expiring documents.",
      "Follow-up reminders until employees acknowledge announcements, policy handbooks, polls and surveys, and routine notification cleanup.",
      "Self-upgrading databases: on every new deployment, the platform checks every client database's version and applies pending migrations, the admin database included.",
    ],
    tags: ["10+ schedulers", "Per client & subsidiary", "Time-zone aware", "Auto migrations"],
  },
  {
    id: "integrate",
    hat: "Integrated",
    line: "Connected the platform to the systems clients already run.",
    points: [
      "Owned the NetSuite integration end to end: API and system design, the mapping UI and the background sync workers.",
      "Built the backend services and APIs the mobile app runs on.",
      "Open APIs for connecting other business systems.",
    ],
    tags: ["NetSuite", "Mobile backend", "Open API"],
  },
  {
    id: "ship",
    hat: "Shipped",
    line: "Took it live and kept it improving.",
    points: [
      "Launched the platform into production.",
      "Stabilised it through real user feedback, then scaled it to more than ten enterprise clients.",
      "Ongoing work on performance, reliability, analytics and deployment speed, with in-house AI agents in the workflow.",
    ],
    tags: ["Launch", "Stabilisation", "Scale"],
  },
];

export default function Roles() {
  const [active, setActive] = useState(ROLES[0].id);
  const role = ROLES.find((r) => r.id === active)!;

  return (
    <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#110d18] md:grid-cols-[220px_1fr]">
      {/* verb list, styled like the console's own side menu */}
      <div
        role="tablist"
        aria-label="What I owned on this project"
        className="flex overflow-x-auto border-b border-white/10 p-2 [scrollbar-width:none] md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-3"
      >
        {ROLES.map((r, k) => {
          const on = r.id === active;
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(r.id)}
              onMouseEnter={() => setActive(r.id)}
              className={`relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition-colors md:text-base ${on ? "text-white" : "text-white/45 hover:text-white/80"}`}
            >
              {on && <motion.span layoutId="inf-role-bg" className="absolute inset-0 rounded-xl bg-inf-600/60" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className={`relative hidden font-mono text-[10px] md:inline ${on ? "text-ipink-300" : "text-white/25"}`}>{String(k + 1).padStart(2, "0")}</span>
              <span className="relative">{r.hat}</span>
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[360px] p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ipink-500/10 blur-3xl" />
        <AnimatePresence mode="wait">
          <motion.div key={role.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="relative">
            <h3 className="max-w-2xl font-display text-3xl italic leading-snug text-white md:text-4xl">{role.line}</h3>
            <ul className="mt-7 space-y-4">
              {role.points.map((p, k) => (
                <motion.li key={p} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + k * 0.07 }} className="flex gap-3 leading-relaxed text-muted">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ipink-500" />
                  {p}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {role.tags.map((a) => (
                <span key={a} className="rounded-full border border-inf-400/30 bg-inf-600/15 px-3 py-1 font-mono text-[11px] text-inf-100 transition-all hover:-translate-y-0.5 hover:border-ipink-400/60">
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
