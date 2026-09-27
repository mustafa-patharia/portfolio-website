"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ArchitectureDiagram, { type ArchNode, type ArchWire } from "../ArchitectureDiagram";
import DecryptedText from "../reactbits/DecryptedText";
import CountUp from "../reactbits/CountUp";
import TagJourney from "./smartscan/TagJourney";
import Roles from "./smartscan/Roles";
import WorkflowGallery from "./smartscan/WorkflowGallery";
import {
  AtomicClaimVisual,
  HandheldVisual,
  OfflineResumeVisual,
  OutboxVisual,
  RbacVisual,
  SessionLockVisual,
  TenantsVisual,
} from "./smartscan/visuals";

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

/* ------------------------------------------------------------------ content */

const META = [
  { k: "Role", v: "Freelancer · end-to-end ownership" },
  { k: "Client", v: "InnovateNex, for Foresee Solutions" },
  { k: "Timeline", v: "Jun – Sep 2026 · live in production" },
  { k: "Surfaces", v: "REST API · Admin web · Android · AWS" },
];

const STATS = [
  { n: 174, label: "API endpoints" },
  { n: 43, label: "Postgres tables" },
  { n: 19, label: "Permission modules" },
  { n: 5, label: "Handheld workflows" },
];

const CONSTRAINTS = [
  { n: "01", t: "No typed quantities", d: "A quantity is the count of tags physically scanned. Operators never key in a number." },
  { n: "02", t: "Nothing gets lost", d: "Not on a dead battery, a dropped Wi-Fi link, or a Redis restart mid-sync." },
  { n: "03", t: "Not married to one ERP", d: "The core has no ERP-specific code in it. An ERP is a connector class you register." },
];

const ADMIN = [
  { id: "sync", label: "ERP sync queue", src: "/projects/smartscan/admin/20-sync-jobs.png", alt: "ERP sync queue listing succeeded and failed ERP posts with the error returned" },
  { id: "dash", label: "Dashboard", src: "/projects/smartscan/admin/01-dashboard.png", alt: "SmartScan admin dashboard with user, connector and inventory overviews" },
];

const DECISIONS = [
  { d: "Track tags, not quantities", w: "Every quantity is derived from tags that were physically scanned, so typing errors stop existing." },
  { d: "One conditional UPDATE claims the tags", w: "Wrong item, duplicate, already-shipped and two operators racing are all resolved by the database in one statement." },
  { d: "Locks live in the database", w: "A partial unique index allows one active session per bin or order. The second operator gets a 409, not a race." },
  { d: "Postgres outbox in front of Redis", w: "Every ERP job is written to Postgres before it's queued. Losing Redis delays a post; it never drops one." },
  { d: "Keep the payload of every ERP attempt", w: "When the ERP rejects a post, the queue shows what was sent next to what came back — no log-diving." },
  { d: "Schema per tenant, fail-closed", w: "Each client gets its own Postgres schema. A request without a resolved tenant is refused outright." },
];

const STACK = [
  { layer: "API", items: ["NestJS 11", "TypeScript", "Drizzle ORM", "PostgreSQL 17", "Redis 7", "BullMQ", "Passport JWT", "Swagger"] },
  { layer: "Admin web", items: ["Next.js 16", "React 19", "Tailwind v4", "shadcn/ui", "TanStack Table", "Zustand", "Zod"] },
  { layer: "Handheld", items: ["Expo SDK 54", "React Native 0.81", "Kotlin native module", "Urovo RFID SDK", "MMKV", "EAS Build"] },
  { layer: "Cloud", items: ["AWS EC2", "RDS", "S3", "ECR", "SSM", "Terraform", "GitHub Actions (OIDC)", "Caddy"] },
];

const ARCH_BANDS = [
  { label: "Clients", h: 86 },
  { label: "Middleware", h: 70 },
  { label: "State", h: 70 },
  { label: "ERP", h: 86 },
];

const ARCH_NODES: ArchNode[] = [
  { id: "hh", band: 0, colFrac: 0.28, icon: "phone", title: "RFID Handheld", sub: ["Android · Urovo SDK"] },
  { id: "web", band: 0, colFrac: 0.72, icon: "window", title: "Admin Dashboard", sub: ["Next.js 16"] },
  { id: "api", band: 1, colFrac: 0.5, w: 260, icon: "cpu", title: "SmartScan Middleware", sub: ["Auth · RBAC · tenant context"], variant: "seam" },
  { id: "pg", band: 2, colFrac: 0.2, icon: "db", title: "PostgreSQL 17", sub: ["Tenant schemas · outbox"] },
  { id: "rd", band: 2, colFrac: 0.5, icon: "queue", title: "BullMQ / Redis", sub: ["Dispatch only"] },
  { id: "s3", band: 2, colFrac: 0.8, icon: "drive", title: "S3", sub: ["Item & user images"] },
  { id: "erp", band: 3, colFrac: 0.5, w: 280, icon: "server", title: "ERP", sub: ["NetSuite connector · Flow A in · Flow B out"], variant: "ext" },
];

const ARCH_WIRES: ArchWire[] = [
  { from: "hh", to: "api", type: "net" },
  { from: "web", to: "api", type: "net" },
  { from: "api", to: "pg", type: "data" },
  { from: "api", to: "rd", type: "data" },
  { from: "api", to: "s3", type: "data" },
  { from: "rd", to: "erp", type: "ctrl" },
];

/* --------------------------------------------------------------- primitives */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ss-300/80">
      <span className="h-px w-8 bg-ss-400/60" />
      {children}
    </p>
  );
}

function HazardRule() {
  return (
    <div
      aria-hidden
      className="h-2 w-full opacity-60"
      style={{ backgroundImage: "repeating-linear-gradient(-45deg, #026bc0 0 10px, transparent 10px 20px)" }}
    />
  );
}

function Tile({
  title,
  caption,
  className = "",
  children,
}: {
  title: string;
  caption: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...reveal}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#0f0f11] p-5 transition-colors duration-300 hover:border-ss-400/30 md:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(76,162,251,0.08),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{caption}</p>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
    </motion.div>
  );
}

/* --------------------------------------------------------------------- page */

export default function SmartScanCaseStudy() {
  const [adminTab, setAdminTab] = useState(ADMIN[0].id);
  const admin = ADMIN.find((a) => a.id === adminTab)!;

  return (
    <MotionConfig reducedMotion="user">
      <main className="selection:bg-ss-600 selection:text-white">
        {/* ============================================================ HERO */}
        <section className="relative overflow-hidden px-6 pb-20 pt-40 md:px-10 lg:pt-48">
          {/* bin-rack grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_75%)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "72px 48px",
            }}
          />
          {/* laser sweep */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-ss-300 to-transparent shadow-[0_0_24px_4px_rgba(76,162,251,0.35)]"
            initial={{ top: "12%" }}
            animate={{ top: ["12%", "88%", "12%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <Kicker>Case study · Enterprise warehouse inventory · Foresee Solutions</Kicker>
              <h1 className="font-display text-6xl italic leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">SmartScan</h1>
              <p className="mt-4 text-2xl font-light text-white/80 md:text-4xl">
                Every tag, <span className="text-ss-300">accounted for.</span>
              </p>
              <p className="mt-6 max-w-2xl leading-relaxed text-muted md:text-lg">
                RFID middleware that sits between Android handhelds and any ERP, starting with NetSuite. It tracks every physical unit by its tag, runs the
                warehouse&apos;s floor workflows, and posts only finished, consistent transactions to the ERP.
              </p>
              <div className="mt-6 font-mono text-xs text-white/40 md:text-sm">
                <span className="mr-2 text-ss-300/70">EPC</span>
                <DecryptedText
                  text="E280 6894 0000 5012 A3F1 09C4"
                  animateOn="view"
                  sequential
                  speed={45}
                  characters="0123456789ABCDEF"
                  className="text-white/70"
                  encryptedClassName="text-ss-300/60"
                />
              </div>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {META.map((m) => (
                <div key={m.k} className="bg-bg/90 p-5 transition-colors duration-300 hover:bg-[#121214]">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">{m.k}</dt>
                  <dd className="mt-2 text-sm text-white/85">{m.v}</dd>
                </div>
              ))}
            </motion.dl>

            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s, k) => (
                <motion.div key={s.label} {...reveal} transition={{ ...reveal.transition, delay: k * 0.08 }}>
                  <CountUp to={s.n} duration={1.6} className="font-display text-5xl italic text-ss-300 md:text-6xl" />
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <HazardRule />

        {/* ============================================================ BRIEF */}
        <section className="px-6 py-28 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1fr]">
            <motion.div {...reveal}>
              <Kicker>The problem</Kicker>
              <h2 className="font-display text-4xl italic leading-tight md:text-5xl">The floor moves faster than the ERP.</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted md:text-lg">
                <p>
                  A handheld reader picks up dozens of tags a second. The ERP wants clean, complete transactions, one at a time, and
                  it takes its time to answer. Wire the two together directly and you get timeouts on the floor, quantities typed in
                  by hand, and no record of which physical unit went where.
                </p>
                <p>
                  SmartScan owns the warehouse state in between. Operators scan against it at floor speed. The ERP stays the
                  financial system of record and receives only the finished result.
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3">
              {CONSTRAINTS.map((c, k) => (
                <motion.div
                  key={c.n}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: k * 0.1 }}
                  className="group flex gap-5 rounded-2xl border border-white/5 bg-[#0f0f11] p-5 transition-all duration-300 hover:translate-x-1 hover:border-ss-400/30"
                >
                  <span className="font-mono text-sm text-ss-300/70 transition-colors group-hover:text-ss-300">{c.n}</span>
                  <div>
                    <h3 className="font-medium text-white">{c.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{c.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ ROLES */}
        <section className="px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10">
              <Kicker>What I owned</Kicker>
              <h2 className="font-display text-4xl italic md:text-5xl">Whiteboard to warehouse floor.</h2>
              <p className="mt-5 leading-relaxed text-muted md:text-lg">
                InnovateNex brought me in as a freelancer to deliver SmartScan for their client, Foresee Solutions. I owned the
                whole of it: the system design, the ERP integration, what shipped, the handheld experience, and the
                build and deploy.
              </p>
            </motion.div>
            <motion.div {...reveal}>
              <Roles />
            </motion.div>
          </div>
        </section>

        {/* ============================================================ BENTO */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10">
              <Kicker>Under the hood</Kicker>
              <h2 className="font-display text-4xl italic md:text-5xl">Correctness, enforced by the database.</h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
              <Tile
                title="Built for the handheld"
                caption="Operators live on an Android RFID gun. The app drives the reader through a native module and scopes everything to their warehouse."
                className="md:col-span-2 md:row-span-2"
              >
                <HandheldVisual />
              </Tile>
              <Tile
                title="One statement, every edge case"
                caption="A single conditional UPDATE claims the scanned tags. Whatever it doesn't return is rejected, with a reason for each."
                className="md:col-span-2"
              >
                <AtomicClaimVisual />
              </Tile>
              <Tile title="Session locks" caption="One active session per bin or order, via a partial unique index.">
                <SessionLockVisual />
              </Tile>
              <Tile title="Durable outbox" caption="Postgres first, Redis for dispatch, retries with backoff.">
                <OutboxVisual />
              </Tile>
              <Tile
                title="19 modules × 3 actions"
                caption="Granular RBAC. Stock edits are split from catalog edits; force-releasing a lock needs delete rights."
                className="md:col-span-2"
              >
                <RbacVisual />
              </Tile>
              <Tile title="Schema per tenant" caption="New clients are cloned from a template schema.">
                <TenantsVisual />
              </Tile>
              <Tile title="Survives a dead battery" caption="The scan buffer syncs to the server as a draft.">
                <OfflineResumeVisual />
              </Tile>
            </div>
          </div>
        </section>

        {/* ============================================================ TAG JOURNEY (pinned) */}
        <HazardRule />
        <TagJourney />
        <HazardRule />

        {/* ============================================================ FLOWS */}
        <section className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-6 text-center">
              <Kicker>On the floor</Kicker>
              <h2 className="font-display text-4xl italic md:text-5xl">Five workflows, one scanning model.</h2>
            </motion.div>
            <WorkflowGallery />
          </div>
        </section>

        {/* ============================================================ ADMIN */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <Kicker>Back office</Kicker>
                <h2 className="font-display text-4xl italic md:text-5xl">When the ERP rejects a sync, you know why.</h2>
                <p className="mt-4 max-w-xl leading-relaxed text-muted">
                  The admin dashboard is where supervisors map records to the ERP and watch the sync queue. Every failed post
                  carries the exact payload sent and the ERP&apos;s response, so an integration dispute takes minutes, not a log
                  search.
                </p>
              </div>
              <div className="flex gap-2">
                {ADMIN.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAdminTab(a.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 ${adminTab === a.id
                      ? "border-ss-600 bg-ss-600 text-white"
                      : "border-white/10 text-white/60 hover:border-ss-400/40 hover:text-white"
                      }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div {...reveal} className="overflow-hidden rounded-2xl border border-white/10 bg-[#161618] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-[11px] text-white/35">app.smartscan / {admin.label.toLowerCase()}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={admin.id}
                  src={admin.src}
                  alt={admin.alt}
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="block w-full"
                />
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ ARCHITECTURE */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-5xl">
            <motion.div {...reveal} className="mb-10">
              <Kicker>Architecture</Kicker>
              <h2 className="font-display text-4xl italic md:text-5xl">The middleware is the only thing that talks to the ERP.</h2>
            </motion.div>
            <ArchitectureDiagram
              bands={ARCH_BANDS}
              nodes={ARCH_NODES}
              wires={ARCH_WIRES}
              legend={[
                { type: "net", label: "JWT clients" },
                { type: "data", label: "State & storage" },
                { type: "ctrl", label: "ERP sync" },
              ]}
              note="The ERP pushes items, bins and orders in over an API key (Flow A). Completed receipts, fulfillments, transfers and count variances go back out through the outbox (Flow B)."
            />
          </div>
        </section>

        {/* ============================================================ DECISIONS */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10">
              <Kicker>Decisions that paid off</Kicker>
              <h2 className="font-display text-4xl italic md:text-5xl">The ledger.</h2>
            </motion.div>
            <div className="border-t border-white/10">
              {DECISIONS.map((x, k) => (
                <motion.div
                  key={x.d}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: k * 0.05 }}
                  className="group grid gap-2 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[3rem_1fr_1.3fr] md:gap-8"
                >
                  <span className="font-mono text-sm text-white/30 transition-colors group-hover:text-ss-300">
                    {String(k + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium text-white transition-transform duration-300 group-hover:translate-x-1">{x.d}</h3>
                  <p className="leading-relaxed text-muted">{x.w}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ STACK + NEXT */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <motion.div {...reveal}>
                <Kicker>Stack</Kicker>
              </motion.div>
              <div className="grid gap-8 sm:grid-cols-2">
                {STACK.map((g) => (
                  <motion.div key={g.layer} {...reveal}>
                    <h3 className="mb-3 text-sm font-medium text-white">{g.layer}</h3>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((i) => (
                        <span
                          key={i}
                          className="cursor-default rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-ss-400/50 hover:text-ss-200"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div {...reveal} className="rounded-3xl border border-white/5 bg-[#0f0f11] p-7">
              <Kicker>Honest limits</Kicker>
              <ul className="space-y-4 text-sm leading-relaxed text-muted">
                <li>
                  <span className="text-white">One connector so far.</span> The abstraction is proven against NetSuite only; SAP is
                  the next class to write.
                </li>
                <li>
                  <span className="text-white">Android only.</span> The reader SDK is Android, so the handheld app is too.
                </li>
                <li>
                  <span className="text-white">No inbound quantity sync.</span> If someone edits a stock quantity by hand in the ERP,
                  SmartScan doesn&apos;t pick it up — stock is expected to move through the floor, where every change is scanned.
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div {...reveal} className="mx-auto mt-24 max-w-6xl">
            <Link
              href="/case-studies"
              className="group flex items-center justify-between rounded-3xl border border-white/10 p-8 transition-all duration-300 hover:border-ss-400/50 hover:bg-ss-400/[0.04] md:p-10"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Keep reading</span>
                <span className="mt-2 block font-display text-3xl italic md:text-4xl">All case studies</span>
              </span>
              <ArrowUpRight className="h-8 w-8 text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ss-300" />
            </Link>
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}
