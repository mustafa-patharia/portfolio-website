"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Bug, Check, Database, FileDown, GitPullRequest, Mail, Plug, ScanSearch, Server, Sparkles, Sprout, LogIn, Layers, Workflow, Wrench } from "lucide-react";
import { BLUE, LOGO_GRADIENT, ORANGE, PINK, PURPLE, Panel, mono, useTicker } from "./shared";

/* All figures below are illustrative. They show how a mechanism behaves, not client data. */

/* ------------------------------------------------------------ payroll */

const CLASSES = [
  { name: "Full-time · UAE national", parts: [48, 20, 8, 10, 6] },
  { name: "Full-time · expatriate", parts: [52, 22, 8, 0, 8] },
  { name: "Part-time · hourly", parts: [60, 0, 5, 0, 15] },
];
const PARTS = [
  { k: "Basic", c: PURPLE },
  { k: "Housing", c: BLUE },
  { k: "Allowances", c: "#b39ce2" },
  { k: "Contribution", c: ORANGE },
  { k: "Overtime", c: PINK },
];

/** Pay components stack differently per classification; the run itself finishes in seconds. */
export function PayComponentsVisual() {
  const i = useTicker(CLASSES.length, 2600);
  const cls = CLASSES[i];
  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
      <Panel label="Pay components by classification">
        <AnimatePresence mode="wait">
          <motion.p key={cls.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-3 text-sm text-white/80">
            {cls.name}
          </motion.p>
        </AnimatePresence>
        <div className="flex h-9 overflow-hidden rounded-lg bg-white/5">
          {cls.parts.map((w, k) => (
            <motion.div key={k} animate={{ width: `${w}%` }} transition={{ type: "spring", stiffness: 90, damping: 18 }} style={{ background: PARTS[k].c }} className="h-full border-r border-[#0b0811]/60" />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {PARTS.map((p, k) => (
            <span key={p.k} className={`${mono} flex items-center gap-1.5 transition-opacity ${cls.parts[k] ? "text-white/60" : "text-white/20 line-through"}`}>
              <span className="h-2 w-2 rounded-sm" style={{ background: p.c }} />
              {p.k}
            </span>
          ))}
        </div>
      </Panel>
      <Panel label="Payroll run · 100 employees">
        <div className="space-y-4">
          <div>
            <div className={`${mono} mb-1.5 flex justify-between text-white/60`}>
              <span>Infithra</span>
              <span className="text-inf-200">seconds</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundImage: LOGO_GRADIENT }}
                initial={{ width: "0%" }}
                whileInView={{ width: ["0%", "100%"] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.2, ease: "easeOut" }}
              />
            </div>
          </div>
          <div>
            <div className={`${mono} mb-1.5 flex justify-between text-white/40`}>
              <span>Traditional ERP payroll</span>
              <span>hours</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-white/25"
                initial={{ width: "0%" }}
                whileInView={{ width: ["0%", "9%"] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

const RULES = ["Contract type", "Contribution rule", "Overtime rate", "Leave entitlement", "End-of-service"];

/** Labour-law rules attach to an employee record automatically, from their classification. */
export function RuleSnapVisual() {
  const i = useTicker(RULES.length + 2, 900);
  return (
    <Panel label="Employee #1042 · rules applied">
      <div className="flex flex-wrap gap-2">
        {RULES.map((r, k) => (
          <motion.span
            key={r}
            animate={{ opacity: k < i ? 1 : 0.18, y: k < i ? 0 : -6, scale: k === i - 1 ? [1, 1.08, 1] : 1 }}
            transition={{ duration: 0.35 }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] ${k < i ? "border-inf-400/50 bg-inf-600/30 text-inf-100" : "border-white/10 text-white/40"}`}
          >
            {k < i && <Check className="h-3 w-3 text-ipink-300" strokeWidth={3} />}
            {r}
          </motion.span>
        ))}
      </div>
    </Panel>
  );
}

const STAGES = ["Onboarding", "Attendance", "Leave", "Payroll", "End-of-service"];

/** One employee record flows through every module of the platform. */
export function LifecycleVisual() {
  const i = useTicker(STAGES.length, 1100);
  return (
    <Panel>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-2 right-2 top-[7px] h-px bg-white/10" />
        <motion.div className="absolute left-2 top-[7px] h-px" style={{ backgroundImage: LOGO_GRADIENT }} animate={{ width: `calc(${(i / (STAGES.length - 1)) * 100}% - 16px)` }} transition={{ duration: 0.6 }} />
        {STAGES.map((s, k) => (
          <div key={s} className="relative flex flex-col items-center gap-2">
            <motion.span animate={{ scale: k === i ? 1.35 : 1 }} className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${k <= i ? "border-ipink-500 bg-ipink-500" : "border-white/20 bg-[#0b0811]"}`} />
            <span className={`hidden font-mono text-[9px] sm:block md:text-[10px] ${k === i ? "text-white" : "text-white/35"}`}>{s}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[11px] text-inf-200 sm:hidden">{STAGES[i]}</p>
    </Panel>
  );
}

/** A payslip assembles line by line, then exports as a PDF. */
export function PayslipExportVisual() {
  const i = useTicker(6, 700);
  return (
    <Panel className="flex items-center gap-4">
      <div className="relative w-24 shrink-0 rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
        {[0, 1, 2, 3].map((k) => (
          <motion.div key={k} animate={{ opacity: k < i ? 1 : 0.1, width: k < i ? `${90 - k * 12}%` : "30%" }} className="mb-1.5 h-1.5 rounded-full bg-inf-300/70" />
        ))}
        <motion.div animate={{ opacity: i >= 4 ? 1 : 0.1 }} className="mt-2 h-2 w-1/2 rounded-full bg-ipink-400" />
      </div>
      <AnimatePresence>
        {i >= 5 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-full border border-ipink-500/50 bg-ipink-500/10 px-3 py-1.5 font-mono text-[11px] text-ipink-200">
            <FileDown className="h-3.5 w-3.5" /> payslip.pdf
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}

/* ------------------------------------------------------------ provisioning */

const SETUP = [
  { k: "Database", icon: Database },
  { k: "Migrations", icon: Layers },
  { k: "Seed data", icon: Sprout },
  { k: "Welcome email", icon: Mail },
  { k: "First login", icon: LogIn },
];

/** Client setup from the admin panel: the steps tick off against a timer. */
export function ProvisionVisual() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s > SETUP.length + 2 ? 0 : s + 1)), step === 0 ? 1000 : 700);
    return () => clearTimeout(t);
  }, [step]);
  const done = Math.min(step, SETUP.length);
  const secs = Math.round((done / SETUP.length) * 35);
  return (
    <Panel className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {SETUP.map((s, k) => {
          const Icon = s.icon;
          const ok = k < done;
          return (
            <div key={s.k} className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors duration-300 ${ok ? "border-ipink-500/50 bg-ipink-500/10 text-ipink-200" : "border-white/10 text-white/35"}`}>
                {ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <Icon className="h-3 w-3" />}
                {s.k}
              </span>
              {k < SETUP.length - 1 && <span className="hidden h-px w-3 bg-white/15 sm:block" />}
            </div>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
        <span className="text-white/35 line-through">~20 min</span>
        <span className="text-inf-200">0:{String(secs).padStart(2, "0")}</span>
      </div>
    </Panel>
  );
}

const FIELDS = [
  { key: "employee_id", label: "Employee ID" },
  { key: "joining_date", label: "Joining date" },
  { key: "department", label: "Department" },
  { key: "visa_expiry", label: "Visa expiry" },
];

/** A field added to the form config renders straight into the live form. No release. */
export function MetaFormVisual() {
  const i = useTicker(3, 1800);
  const n = 2 + i;
  return (
    <div className="grid grid-cols-2 gap-3">
      <Panel label="form.config">
        <div className="space-y-1 font-mono text-[10px] leading-relaxed">
          {FIELDS.slice(0, n).map((f, k) => (
            <motion.div key={f.key} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={k === n - 1 && i > 0 ? "text-ipink-300" : "text-white/55"}>
              {`{ "${f.key}" }`}
            </motion.div>
          ))}
        </div>
      </Panel>
      <Panel label="Live form">
        <div className="space-y-1.5">
          <AnimatePresence initial={false}>
            {FIELDS.slice(0, n).map((f) => (
              <motion.div key={f.key} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/55">{f.label}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}

const PLANS = [
  { k: "Company onboarding", v: "ready" },
  { k: "System upgrades", v: "applied" },
  { k: "Scheduler logs", v: "all clients" },
];

/** The admin platform: the supporting tools behind every client platform. */
export function AdminPlatformVisual() {
  const i = useTicker(PLANS.length, 1300);
  return (
    <Panel>
      <div className="space-y-2">
        {PLANS.map((p, k) => (
          <motion.div key={p.k} animate={{ backgroundColor: k === i ? "rgba(72,32,132,0.45)" : "rgba(255,255,255,0.02)" }} className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px]">
            <span className="text-white/70">{p.k}</span>
            <span className={`font-mono text-[11px] ${k === i ? "text-ipink-200" : "text-white/40"}`}>{p.v}</span>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------ delivery */

/** Cached build layers shrink deploy times: frontend ~80% faster, each backend service ~40%. */
export function DeployVisual() {
  const [fast, setFast] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setFast((f) => !f), 2600);
    return () => clearInterval(id);
  }, []);
  const rows = [
    { k: "Frontend", before: 100, after: 17, label: fast ? "~5 min" : "~30 min" },
    { k: "Backend service", before: 67, after: 37, label: fast ? "10–12 min" : "~20 min" },
  ];
  return (
    <Panel label={fast ? "With cached layers" : "Before"}>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.k}>
            <div className={`${mono} mb-1.5 flex justify-between`}>
              <span className="text-white/60">{r.k}</span>
              <span className={fast ? "text-inf-200" : "text-white/40"}>{r.label}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${fast ? r.after : r.before}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 16 }}
                style={{ backgroundImage: fast ? LOGO_GRADIENT : "linear-gradient(90deg,rgba(255,255,255,.3),rgba(255,255,255,.18))" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["build cache", "cached dependencies", "separate web-server image"].map((c) => (
          <span key={c} className={`rounded-md border px-2 py-0.5 font-mono text-[10px] transition-colors duration-500 ${fast ? "border-ipink-500/40 text-ipink-200" : "border-white/10 text-white/30"}`}>
            {c}
          </span>
        ))}
      </div>
    </Panel>
  );
}

/** The migration system detects pending changes and applies them to every tenant in turn. */
export function MigrationVisual() {
  const i = useTicker(7, 600);
  return (
    <Panel label="migrate · all tenants">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, k) => (
          <div key={k} className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 font-mono text-[10px] transition-colors duration-300 ${k < i ? "border-inf-400/40 bg-inf-600/25 text-inf-100" : k === i ? "border-ipink-500/50 text-ipink-200" : "border-white/10 text-white/30"}`}>
            <Server className="h-3 w-3" />T{k + 1}
            {k < i && <Check className="ml-auto h-3 w-3 text-ipink-300" strokeWidth={3} />}
          </div>
        ))}
      </div>
    </Panel>
  );
}

/** Metrics from every service stream into one monitoring view. */
const OBS_TOOLS = [
  { k: "New Relic", v: "APM · traces" },
  { k: "Grafana", v: "dashboards" },
  { k: "CloudWatch", v: "logs · alarms" },
];

export function ObservabilityVisual() {
  const tool = useTicker(OBS_TOOLS.length, 1400);
  const [pts, setPts] = useState(() => Array.from({ length: 24 }, (_, k) => Math.round(40 + Math.sin(k / 2) * 14)));
  useEffect(() => {
    const id = setInterval(() => setPts((p) => [...p.slice(1), 36 + Math.random() * 30]), 450);
    return () => clearInterval(id);
  }, []);
  const d = pts.map((v, k) => `${k === 0 ? "M" : "L"}${((k / (pts.length - 1)) * 100).toFixed(2)},${(100 - v).toFixed(2)}`).join(" ");
  return (
    <Panel label="All services · healthy">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-20 w-full">
        <defs>
          <linearGradient id="inf-obs" x1="0" x2="1">
            <stop offset="0%" stopColor={BLUE} />
            <stop offset="60%" stopColor={PINK} />
            <stop offset="100%" stopColor={ORANGE} />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#inf-obs)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {OBS_TOOLS.map((t, k) => (
          <div
            key={t.k}
            className={`rounded-lg border px-2 py-1.5 transition-colors duration-300 ${k === tool ? "border-ipink-500/50 bg-ipink-500/10" : "border-white/[0.07]"}`}
          >
            <p className={`text-[12px] ${k === tool ? "text-white" : "text-white/60"}`}>{t.k}</p>
            <p className={`${mono} truncate text-white/35`}>{t.v}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/** In-house AI agents take routine development and review work off the team. */
const AI_KIT = [
  { icon: Bot, k: "AI agents" },
  { icon: Sparkles, k: "Claude skills" },
  { icon: Plug, k: "MCP servers" },
  { icon: Workflow, k: "Workflows" },
];
const AI_FLOWS = [
  {
    k: "Development",
    steps: [
      { icon: GitPullRequest, t: "Pull request opened" },
      { icon: Bot, t: "Agent reviews it against the codebase standards" },
      { icon: Check, t: "Findings ready for the engineer" },
    ],
  },
  {
    k: "Debugging",
    steps: [
      { icon: Bug, t: "Issue reported" },
      { icon: ScanSearch, t: "Agent traces it through the code and logs" },
      { icon: Wrench, t: "Root cause and a suggested fix" },
    ],
  },
];

/** The toolkit, then the two loops it runs: reviewing changes and tracing bugs. */
export function AiAgentsVisual() {
  const i = useTicker(8, 1100);
  const f = i < 4 ? 0 : 1;
  const step = i % 4;
  const flow = AI_FLOWS[f];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {AI_KIT.map((t) => {
          const Icon = t.icon;
          return (
            <span
              key={t.k}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] px-2 py-1.5 text-[12px] text-white/70 transition-colors duration-300 hover:border-ipink-500/50 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-inf-300" />
              {t.k}
            </span>
          );
        })}
      </div>
      <Panel>
        <div className="mb-3 flex gap-1 rounded-full border border-white/10 p-1">
          {AI_FLOWS.map((x, k) => (
            <span key={x.k} className={`flex-1 rounded-full px-3 py-1 text-center font-mono text-[10px] uppercase transition-colors duration-300 ${k === f ? "bg-inf-600 text-white" : "text-white/40"}`}>
              {x.k}
            </span>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={flow.k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-2">
            {flow.steps.map((s, k) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.t} animate={{ opacity: k <= step ? 1 : 0.25 }} className="flex items-center gap-2.5 text-[13px] text-white/75">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${k === step ? "border-ipink-500/60 text-ipink-200" : "border-white/10 text-white/40"}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {s.t}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Panel>
    </div>
  );
}
