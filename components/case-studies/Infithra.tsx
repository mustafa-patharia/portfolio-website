"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import CountUp from "../reactbits/CountUp";
import PayslipCard from "./infithra/PayslipCard";
import ModuleRail from "./infithra/ModuleRail";
import PlatformScope from "./infithra/PlatformScope";
import Foundations from "./infithra/Foundations";
import Roles from "./infithra/Roles";
import AccessControl from "./infithra/AccessControl";
import SchedulerDial from "./infithra/SchedulerDial";
import SchedulerCatalog from "./infithra/SchedulerCatalog";
import NetSuiteSync from "./infithra/NetSuiteSync";
import RecordTimeline from "./infithra/RecordTimeline";
import Lessons from "./infithra/Lessons";
import { Chapter, EASE, LOGO_GRADIENT, Ribbon, Tile, reveal } from "./infithra/shared";
import {
  AdminPlatformVisual,
  AiAgentsVisual,
  DeployVisual,
  LifecycleVisual,
  MetaFormVisual,
  MigrationVisual,
  ObservabilityVisual,
  PayComponentsVisual,
  PayslipExportVisual,
  ProvisionVisual,
  RuleSnapVisual,
} from "./infithra/visuals";

/* ------------------------------------------------------------------ content */

const META = [
  { k: "Role", v: "End-to-end ownership" },
  { k: "Company", v: "KPI" },
  { k: "Duration", v: "Jan 2023 – Jul 2026" },
  { k: "Scope", v: "Client platform · admin platform · mobile backend" },
];

const STATS = [
  { n: 3, suffix: "+", label: "Years, from concept to production" },
  { n: 800, suffix: "+", label: "Production APIs" },
  { n: 2000, suffix: "+", label: "Daily users" },
  { n: 10, suffix: "+", label: "Enterprise clients" },
  { n: 10, suffix: "+", label: "Automated schedulers" },
];

const PRINCIPLES = [
  { n: "01", t: "Configurable by design", d: "Fields, validations, pay components and permissions are configuration, so the platform adapts to a client without a release." },
  { n: "02", t: "Isolated per client", d: "Tenant data separation was part of the architecture from the first release." },
  { n: "03", t: "Built for scale", d: "Processing, scheduling and deployment were designed for many clients running at the same time." },
  { n: "04", t: "One standard for every module", d: "Shared structure, APIs and components, so the codebase stays predictable as the team and the product grow." },
];


const STACK = [
  { layer: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Sequelize", "Redis", "BullMQ"] },
  { layer: "Frontend", items: ["Angular", "Next.js"] },
  { layer: "Cloud", items: ["AWS Cognito", "S3", "EC2", "ECR", "EKS", "CloudFront", "SSM", "IAM"] },
  { layer: "Delivery & monitoring", items: ["Kubernetes", "Jenkins", "CloudWatch", "New Relic", "Grafana", "QuickSight"] },
];

/* --------------------------------------------------------------------- page */

export default function InfithraCaseStudy() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="selection:bg-inf-600 selection:text-white">
        {/* ============================================================ HERO */}
        <section className="relative overflow-hidden px-6 pb-16 pt-36 md:px-10 lg:pt-44">
          <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[560px] w-[560px] rounded-full bg-inf-600/30 blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-ipink-500/15 blur-[130px]" />
          {/* the logo's chevron, as a faint motif */}
          <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -right-20 top-24 hidden h-[520px] w-[520px] opacity-[0.07] lg:block">
            <defs>
              <linearGradient id="inf-hero-chev" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FC1776" />
                <stop offset="50%" stopColor="#492D82" />
                <stop offset="100%" stopColor="#3A86FF" />
              </linearGradient>
            </defs>
            <path d="M20 20 L110 100 L20 180 L70 180 L160 100 L70 20 Z" fill="url(#inf-hero-chev)" />
          </svg>

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.35fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <p className="mb-5 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-inf-300">
                <span className="h-px w-8 bg-ipink-500/80" />
                Case study · Enterprise HR &amp; payroll SaaS · KPI
              </p>
              <h1 className="font-display text-6xl italic leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">Infithra</h1>
              <p className="mt-5 text-2xl font-light text-white/80 md:text-3xl">
                Enterprise HR and Payroll Platform <span className="bg-clip-text text-transparent" style={{ backgroundImage: LOGO_GRADIENT }}>for the UAE and KSA</span>
              </p>
              <p className="mt-6 max-w-xl leading-relaxed text-muted md:text-lg">
                A cloud HR and payroll platform for businesses in the UAE and Saudi Arabia, covering the full employee lifecycle from onboarding to
                end-of-service: labour-law and WPS-compliant payroll, time and attendance, leave, expenses, people analytics and employee
                self-service on web and mobile. I joined at the inception of the project, and over more than three years
                built it into a production platform used by enterprise clients every day.
              </p>
              <a
                href="https://infithra.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-ipink-500/60 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ipink-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ipink-500 hover:text-white"
              >
                Visit infithra.com
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.div>

            <div className="flex justify-center lg:justify-end">
              <PayslipCard />
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl">
            <motion.dl
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4"
            >
              {META.map((m) => (
                <div key={m.k} className="group bg-[#0d0a13] p-5 transition-colors duration-300 hover:bg-inf-900">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">{m.k}</dt>
                  <dd className="mt-2 text-sm text-white/85 transition-colors group-hover:text-inf-100">{m.v}</dd>
                </div>
              ))}
            </motion.dl>

            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
              {STATS.map((s, k) => (
                <motion.div key={s.label} {...reveal} transition={{ ...reveal.transition, delay: k * 0.08 }} className="group">
                  <span className="font-display text-5xl italic text-inf-200 transition-colors group-hover:text-ipink-300 md:text-6xl">
                    <CountUp to={s.n} duration={1.6} separator="," />
                    {s.suffix}
                  </span>
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Ribbon />

        {/* ============================================================ CHAPTERS */}
        <ModuleRail />

        {/* ---------------------------------------------------- Overview */}
        <section id="overview" className="scroll-mt-28 px-6 py-28 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.15fr_1fr]">
            <Chapter module="Overview" title="Project overview">
              <p>
                HR and payroll in the Gulf are governed by labour law: contracts, contributions, overtime, leave entitlements and end-of-service
                gratuity, with rules that change by employee classification and location. Companies usually manage this across spreadsheets,
                stand-alone tools and ERP payroll modules that are slow to run and hard to adapt.
              </p>
              <p>
                I architected Infithra to consolidate this into a single multi-tenant platform. Each client&apos;s data is isolated,
                business rules are held in configuration rather than code, and intensive processing such as payroll completes in seconds
                rather than hours.
              </p>
            </Chapter>
            <div className="flex flex-col gap-3 lg:pt-16">
              {PRINCIPLES.map((c, k) => (
                <motion.div
                  key={c.n}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: k * 0.1 }}
                  className="group flex gap-5 rounded-2xl border border-white/[0.07] bg-[#110d18] p-5 transition-all duration-300 hover:translate-x-1 hover:border-ipink-500/40"
                >
                  <span className="font-mono text-sm text-inf-300 transition-colors group-hover:text-ipink-300">{c.n}</span>
                  <div>
                    <h3 className="font-medium text-white">{c.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{c.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Roles */}
        <section className="px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10 max-w-4xl">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">What I owned</p>
              <h2 className="font-display text-4xl italic md:text-5xl">My role and contribution</h2>
              <p className="mt-5 leading-relaxed text-muted md:text-lg">
                At KPI, I owned the platform end to end: the architecture, the product modules, the UI and UX, the
                integrations and delivery. I was part of every design and vendor discussion, and defined how the system would operate, from the
                initial architecture through launch and scale.
              </p>
            </motion.div>
            <motion.div {...reveal}>
              <Roles />
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------- Scope */}
        <section id="scope" className="scroll-mt-28 px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Platform" title="Platform scope">
              <p>
                I built the client platform used daily by HR teams, managers and employees, together with the two supporting systems around
                it. Hover over an area to see what it covers.
              </p>
            </Chapter>
            <PlatformScope />
          </div>
        </section>

        {/* ---------------------------------------------------- Foundations */}
        <section id="foundations" className="scroll-mt-28 px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Engineering" title="Foundations and engineering standards">
              <p>
                From the outset, I established the foundation that every other part of the platform, and every other developer, built on: the
                architecture, the data model, the codebase conventions and the shared building blocks.
              </p>
            </Chapter>
            <Foundations />
          </div>
        </section>

        {/* ---------------------------------------------------- Payroll */}
        <section id="payroll" className="scroll-mt-28 px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Payroll" title="Payroll engine and compliance">
              <p>
                Payroll carries the platform&apos;s heaviest workload. I made every pay component configurable, applied labour-law rules
                based on each employee&apos;s contract and classification, and reduced a full payroll run to seconds. The engine was rebuilt
                several times as client requirements grew more complex, until every rule could be configured.
              </p>
            </Chapter>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <Tile
                title="Configurable pay components"
                caption="Earnings, allowances, contributions and deductions are configurable per client and per employee classification. A run for 100 employees completes in seconds rather than hours."
                className="md:col-span-2"
              >
                <PayComponentsVisual />
              </Tile>
              <Tile title="Labour-law rules" caption="Contract, contribution and classification rules are applied automatically to every employee record.">
                <RuleSnapVisual />
              </Tile>
              <Tile title="Payslips and reports" caption="Each run generates PDF payslips and payroll reports, delivered to employees through self-service.">
                <PayslipExportVisual />
              </Tile>
              <Tile
                title="The full employee lifecycle"
                caption="I integrated attendance, leave, overtime, expenses, reimbursements, advances and end-of-service into payroll through a single employee record."
                className="md:col-span-2"
              >
                <LifecycleVisual />
              </Tile>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Access */}
        <section id="access" className="scroll-mt-28 px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Security" title="Identity, access and tenancy">
              <p>
                HR data is sensitive, and large organisations need precise control over who signs in where and who sees whom. I built
                multi-tenant authentication and designed a hybrid role- and attribute-based permission model, after researching how leading HR
                and cloud platforms handle access.
              </p>
            </Chapter>
            <AccessControl />
          </div>
        </section>

        {/* ---------------------------------------------------- Configuration */}
        <section id="configuration" className="scroll-mt-28 px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Configuration" title="Configuration and administration">
              <p>
                Every client runs HR differently. I made the product configurable, so most client requirements are met in settings rather than in
                a new release. Alongside it I built the admin platform, the supporting platform used to run every client platform.
              </p>
            </Chapter>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              <Tile
                title="Metadata-driven forms"
                caption="Forms are generated from configuration, so new fields and validations go live without a code change or deployment."
                className="md:col-span-2"
              >
                <MetaFormVisual />
              </Tile>
              <Tile title="Admin platform" caption="I built the admin platform to onboard new companies, apply system upgrades, and maintain scheduler logs and monitoring for every client.">
                <AdminPlatformVisual />
              </Tile>
              <Tile
                title="Faster client setup"
                caption="I improved the admin panel's client setup, so a new tenant is configured from one form in under a minute instead of about 20."
                className="md:col-span-3"
              >
                <ProvisionVisual />
              </Tile>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Scheduling (pinned) */}
        <Ribbon />
        <SchedulerDial />
        <SchedulerCatalog />
        <Ribbon />

        {/* ---------------------------------------------------- Integrations */}
        <section id="integrations" className="scroll-mt-28 px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Integrations" title="ERP and system integrations">
              <p>
                I owned the NetSuite integration end to end: the API and system design, the mapping UI and the background sync workers.
                Organisational data flows into Infithra, and payroll, contributions and expenses post back to the ledger as journal entries. It
                supports both single-entity and multi-subsidiary NetSuite accounts, and open APIs connect other business systems.
              </p>
            </Chapter>
            <NetSuiteSync />
          </div>
        </section>

        {/* ---------------------------------------------------- Delivery */}
        <section id="delivery" className="scroll-mt-28 px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Chapter module="Engineering" title="Delivery and engineering operations">
              <p>
                A platform serving many clients needs to ship often and safely. I rebuilt the delivery pipeline, automated database changes across
                every tenant, and brought AI agents into the development workflow.
              </p>
            </Chapter>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <Tile
                title="Faster deployments"
                caption="I restructured the build pipeline with layer caching, cached dependencies and a separate web-server image. Frontend deploys dropped from about 30 minutes to 5, and each backend service from about 20 minutes to 10–12."
              >
                <DeployVisual />
              </Tile>
              <Tile title="Multi-tenant migrations" caption="I automated database migrations across all tenants. On every deployment, the platform checks the version of the admin database and each client database, then applies pending migrations in order. Every tenant stays on the same schema, with no manual database steps in a release.">
                <MigrationVisual />
              </Tile>
              <Tile title="Observability" caption="I integrated New Relic across the backend services for application performance and tracing, and used Grafana dashboards and CloudWatch logs and alarms to monitor the platform and gain insight into its behaviour, so a slow endpoint or failing job can be traced to its source quickly.">
                <ObservabilityVisual />
              </Tile>
              <Tile
                title="AI-assisted development and debugging"
                caption="I developed in-house AI agents, Claude skills, MCP servers and workflows, connected to the codebase and the team's tools. They review changes against the project's standards and trace bugs to a likely root cause, cutting development and review effort by about 40%."
              >
                <AiAgentsVisual />
              </Tile>
            </div>
          </div>
        </section>

        <div id="chapters-end" />

        {/* ============================================================ BUILD LAYERS */}
        <section className="px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">Build</p>
              <h2 className="font-display text-4xl italic md:text-5xl">How the platform was built</h2>
            </motion.div>
            <RecordTimeline />
          </div>
        </section>

        {/* ============================================================ LESSONS */}
        <section className="px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10 max-w-3xl">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">Reflection</p>
              <h2 className="font-display text-4xl italic md:text-5xl">Lessons learned</h2>
              <p className="mt-5 leading-relaxed text-muted md:text-lg">
                Building a platform from the ground up taught me as much from what I would change as from what worked. These are the decisions I
                would make differently today.
              </p>
            </motion.div>
            <Lessons />
            <motion.p {...reveal} className="mt-8 max-w-3xl leading-relaxed text-white/60">
              These lessons shape how I design systems today: start simple, split only when there is a real reason, and choose tools that fit how
              the product works.
            </motion.p>
          </div>
        </section>

        {/* ============================================================ STACK */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal}>
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-inf-300">Technology stack</p>
            </motion.div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((g) => (
                <motion.div key={g.layer} {...reveal}>
                  <h3 className="mb-3 text-sm font-medium text-white">{g.layer}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((i) => (
                      <span
                        key={i}
                        className="cursor-default rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-ipink-500/50 hover:text-ipink-200"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p {...reveal} className="mt-10 font-mono text-[11px] text-white/35">
              Infithra is closed source and covered by a non-disclosure agreement. Visuals on this page are illustrative.
            </motion.p>
          </div>

          <motion.div {...reveal} className="mx-auto mt-24 max-w-6xl">
            <Link
              href="/case-studies"
              className="group flex items-center justify-between rounded-3xl border border-white/10 p-8 transition-all duration-300 hover:border-ipink-500/50 hover:bg-inf-600/[0.08] md:p-10"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Keep reading</span>
                <span className="mt-2 block font-display text-3xl italic md:text-4xl">All case studies</span>
              </span>
              <ArrowUpRight className="h-8 w-8 text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ipink-300" />
            </Link>
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}
