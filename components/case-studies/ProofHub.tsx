import { motion } from "framer-motion";
import TechPill from "@/components/TechPill";
import ArchitectureDiagram, {
  type ArchNode,
  type ArchWire,
} from "../ArchitectureDiagram";

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

export default function ProofHubCaseStudy() {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-32 pt-40 md:px-10 lg:px-16 lg:pt-48">
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
            href="https://github.com/MustafaPatharia/Proofhub-Task-Timer"
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
          src={`/projects/proofhub-task-timer.png`}
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
          
          {/* Overview Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          >
            <div>
              <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">
                The Objective
              </h2>
              <p className="leading-relaxed text-muted md:text-lg">
                The objective was simple: eliminate the friction of time tracking. Constantly opening a browser, navigating to ProofHub, and manually starting timers for different projects was a tiresome break in workflow. I built this macOS menu bar app to bring active tasks directly to my fingertips.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-8 md:p-10">
              <h3 className="mb-6 font-display text-2xl italic text-text-primary">
                Technical Hurdles
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Concurrent Tracking: Syncing and playing multiple timers simultaneously across different tasks.",
                  "State Management: Handling complex hierarchies of multiple projects and their respective task lists.",
                  "Data Consistency: Ensuring offline tracking synced perfectly back to the cloud without dropping seconds.",
                ].map((item, i) => (
                  <li key={i} className="relative pl-5 text-sm text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-text-primary/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Architecture Diagram Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="mb-10 font-display text-3xl italic text-text-primary md:text-4xl text-center">
              Under the Hood
            </h2>

            <ArchitectureDiagram
              bands={ARCH_BANDS}
              nodes={ARCH_NODES}
              wires={ARCH_WIRES}
              note="AppState is the single source of truth for every running timer. SwiftData caches projects and tasks for instant browsing; nothing reaches ProofHub's Bolt API until a timer is explicitly saved."
            />
          </motion.section>

          {/* Key Features (Vertical Timeline) */}
          <section>
            <h2 className="mb-12 font-display text-3xl italic text-text-primary md:text-4xl">
              Engineering Deep Dive
            </h2>
            <div className="relative pl-6 md:pl-10">
              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-stroke md:left-[11px]" />
              <div className="flex flex-col gap-12">
                {[
                  { title: "macOS Native Development", tool: "Swift & SwiftUI", text: "Built from the ground up using Swift to ensure the app is a lightweight, first-class citizen on macOS, seamlessly integrating into the system menu bar without the memory overhead of web wrappers." },
                  { title: "High-Performance Caching", tool: "SwiftData Store", text: "To eliminate network latency when browsing through multiple projects and their respective task lists, I implemented a robust caching strategy using SwiftData. This ensures the UI is always instantly responsive." },
                  { title: "Concurrent Timer Synchronization", tool: "State Management", text: "Handling the complexity of a user rapidly switching between tasks or running multiple timers simultaneously required an iron-clad local state engine that precisely synced elapsed seconds before pushing to the ProofHub Bolt APIs." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-[6px] h-3 w-3 rounded-full border-2 border-bg bg-text-primary transition-transform duration-300 hover:scale-150 md:left-[-38px]" />
                    <h3 className="mb-1 text-lg text-text-primary">{item.title}</h3>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#89AACC]">{item.tool}</p>
                    <p className="text-sm leading-relaxed text-muted md:text-base">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Lessons Learned */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-12 border-t border-stroke" />
            <h3 className="mb-6 font-display text-2xl italic text-text-primary">Key Takeaways</h3>
            <p className="leading-relaxed text-muted md:text-lg">
              As my first dedicated macOS application, ProofHub Task Timer was an incredible deep-dive into the Apple ecosystem. I learned how to build robust, native macOS architectures using Swift, and gained a deep appreciation for the power of SwiftData as a local caching engine for complex, concurrent data syncing.
            </p>
          </motion.section>

        </div>
      </motion.article>
    </main>
  );
}
