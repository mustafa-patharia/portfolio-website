import { motion } from "framer-motion";
import TechPill from "@/components/TechPill";
import ArchitectureDiagram, {
  type ArchNode,
  type ArchWire,
} from "../ArchitectureDiagram";
import { BentoGrid, BentoCard } from "./blocks/BentoGrid";
import { Timeline, TimelineStep } from "./blocks/Timeline";
import { PullQuote } from "./blocks/PullQuote";
import { AccordionDeepDive } from "./blocks/AccordionDeepDive";
import { Timer, SearchCode, Hourglass, ToggleLeft, Activity, Command } from "lucide-react";

const ARCH_BANDS = [
  { label: "Interface", h: 76 },
  { label: "Coordinator", h: 64 },
  { label: "Local data & security", h: 76 },
  { label: "External · network", h: 64 },
];

const ARCH_NODES: ArchNode[] = [
  { id: "content", band: 0, colFrac: 0.18, icon: "window", title: "ContentView", sub: ["Menu-bar root"] },
  { id: "tasks", band: 0, colFrac: 0.5, icon: "queue", title: "ProjectsTasksView", sub: ["Task list · timers"] },
  { id: "settings", band: 0, colFrac: 0.82, icon: "terminal", title: "SettingsView", sub: ["Subdomain · project config"] },
  { id: "appstate", band: 1, colFrac: 0.32, w: 260, icon: "cpu", title: "AppState", sub: ["Timer engine · sync coordinator"], variant: "seam" },
  { id: "shift", band: 1, colFrac: 0.72, w: 220, icon: "layers", title: "ShiftEnforcer", sub: ["Concurrent timer rules"] },
  { id: "swiftdata", band: 2, colFrac: 0.28, icon: "db", title: "SwiftData Store", sub: ["Offline-first cache", "Paused timers · prefs"] },
  { id: "keychain", band: 2, colFrac: 0.72, icon: "lock", title: "Keychain", sub: ["API key · encrypted"] },
  { id: "api", band: 3, colFrac: 0.5, icon: "cloud", title: "ProofHub Cloud", sub: ["Bolt REST API"], variant: "ext" },
];

const ARCH_WIRES: ArchWire[] = [
  { from: "content", to: "appstate", type: "ctrl" },
  { from: "tasks", to: "appstate", type: "ctrl" },
  { from: "settings", to: "appstate", type: "ctrl" },
  { from: "appstate", to: "shift", type: "ctrl" },
  { from: "appstate", to: "swiftdata", type: "data" },
  { from: "shift", to: "swiftdata", type: "data" },
  { from: "keychain", to: "api", type: "net" },
  { from: "appstate", to: "api", type: "net" },
];

// --- Custom Interactive Visual Components (SaaS Aesthetic) ---

const BrowserFrictionVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1200px]">
    <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/10 via-transparent to-rose-900/10" />
    
    <div className="relative z-10 flex w-full max-w-[280px] flex-col items-center justify-center transform-gpu rotate-x-[15deg]">
      {/* Heavy Browser */}
      <motion.div 
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 flex h-24 w-64 items-center justify-center gap-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(244,63,94,0.2)]"
      >
        <SearchCode className="h-8 w-8 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" strokeWidth={1.5} />
        <div className="flex flex-col">
          <span className="font-mono text-sm tracking-widest text-rose-100">BROWSER UI</span>
          <span className="font-mono text-[9px] text-rose-300/50 mt-1">HIGH FRICTION</span>
        </div>
      </motion.div>
      
      {/* Loading Spinners below */}
      <div className="mt-6 flex gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Activity className="h-6 w-6 text-rose-500/50" />
        </motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}>
          <Activity className="h-6 w-6 text-rose-500/50" />
        </motion.div>
      </div>
    </div>
  </div>
);

const LostHoursVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)]" />
    <motion.div 
      initial={{ rotateX: 20 }}
      animate={{ rotateX: [20, 0, 20], rotateZ: [0, -5, 0] }} 
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 flex h-24 w-40 flex-col items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(245,158,11,0.2)]"
    >
      <Hourglass className="h-8 w-8 text-amber-400 mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" strokeWidth={1.5} />
      <span className="text-[12px] font-mono font-bold tracking-widest text-amber-300">-4.2 HRS</span>
    </motion.div>
  </div>
);

const StateSwapVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
     <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:100%_20px]" />
     <div className="flex gap-4 relative z-10 items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-[#121214] shadow-lg">
          <Command className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 180, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <ToggleLeft className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
        </motion.div>

        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-[#121214] shadow-lg">
          <Timer className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
        </div>
     </div>
  </div>
);


export default function ProofHubCaseStudy() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-32 pt-40 md:px-10 lg:px-16 lg:pt-48">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-20"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Open Source Case Study
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          ProofHub <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">Task Timer</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Swift" />
          <TechPill name="SwiftData" />
          <TechPill name="ProofHub API" />
          <TechPill name="macOS Menu Bar" />
        </div>

        <div className="mt-10">
          <a
            href="https://github.com/mustafa-patharia/Proofhub-Task-Timer"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-3 text-sm transition-colors hover:border-text-primary/30"
          >
            View on GitHub
            <svg className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </motion.header>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl"
      >
        <img
          src={`/projects/poster/proofhub-task-timer.png`}
          alt={`ProofHub Task Timer hero poster`}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </motion.div>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mt-16 flex flex-col gap-24">

          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              The Context Switch
            </h2>
            <BentoGrid>
              <BentoCard title="Browser Friction" colSpan={2} rowSpan={2}>
                <div className="flex h-full flex-col gap-6">
                  <p className="flex-1 leading-relaxed text-muted">Time tracking in agency environments is inherently flawed. Developers and designers are forced to abandon their IDEs to hunt for a specific browser tab, navigate a clunky web UI, and click 'Start Timer'.</p>
                  <div className="h-[250px] w-full">
                    <BrowserFrictionVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Lost Billable Hours" colSpan={2} rowSpan={1}>
                 <div className="flex flex-col gap-6 h-[200px]">
                  <p className="flex-1 leading-relaxed text-muted text-sm">This massive friction point leads to inaccurate timesheets. Users desperately needed a zero-friction, native utility that lives globally in the system menu bar.</p>
                  <div className="w-full flex-1 min-h-0">
                    <LostHoursVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Instant State Swapping" colSpan={2} rowSpan={1}>
                <div className="flex flex-col gap-6 h-[200px]">
                  <p className="flex-1 leading-relaxed text-muted text-sm">The goal was to allow professionals to rapidly swap active contexts with a single click without ever breaking focus or waiting for a heavy DOM to render.</p>
                  <div className="w-full flex-1 min-h-0">
                    <StateSwapVisual />
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
          </section>

          <section>
            <PullQuote 
              quote="I engineered this native macOS application strictly using Swift and SwiftUI, completely rejecting web wrappers to ensure the app consumes virtually zero CPU cycles in the background."
              author="Sole Developer"
            />
          </section>

          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              Technical Architecture
            </h2>
            <div className="mb-16">
              <ArchitectureDiagram
                bands={ARCH_BANDS}
                nodes={ARCH_NODES}
                wires={ARCH_WIRES}
                note="AppState is the single source of truth for every running timer. SwiftData caches projects and tasks for instant browsing; nothing reaches ProofHub's Bolt API until a timer is explicitly saved."
              />
            </div>

            <Timeline>
              <TimelineStep title="The MenuBarExtra Lifecycle" tool="SwiftUI & macOS Native">
                Building a reliable menu bar app is vastly different from a standard windowed app. Using SwiftUI's modern MenuBarExtra scene ensures the app launches silently on login without polluting the dock. To preserve battery, the UI aggressively halts rendering loops when dismissed, relying strictly on a low-priority background Timer publisher to compute elapsed seconds.
              </TimelineStep>
              <TimelineStep title="SwiftData Offline Caching" tool="Local Persistence Layer">
                To eliminate network latency during project selection, I implemented a robust SwiftData schema. The app asynchronously pre-fetches the user's assigned projects and tasks, serializing the JSON into native @Model objects. The UI binds directly to this local database via @Query, guaranteeing instant 0ms responses even in airplane mode.
              </TimelineStep>
              <TimelineStep title="Concurrent State Engine" tool="Combine & Actor Model">
                Handling multiple paused, running, and syncing timers required an iron-clad local engine. An AppState coordinator uses Swift's concurrency model (async/await and Actors) to prevent data races. When a user switches tasks, the engine logs the timestamp, triggers an optimistic UI update, and queues a background push with exponential backoff.
              </TimelineStep>
            </Timeline>
          </section>

          <section className="mb-20">
            <div className="mx-auto max-w-2xl">
              <AccordionDeepDive title="Workflow Restored">
                <p className="leading-relaxed text-muted">
                  The end product successfully eliminated the catastrophic friction of web-based time tracking. By embedding the interface natively within the macOS menu bar and enforcing a strict offline-first architecture via SwiftData, users can now toggle complex task timers in under two seconds. The application guarantees 100% accurate time logging without breaking flow state, all while consuming less than 15MB of system memory.
                </p>
              </AccordionDeepDive>
            </div>
          </section>

        </div>
      </motion.article>
    </main>
  );
}
