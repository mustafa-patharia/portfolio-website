import { motion } from "framer-motion";

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
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.15em] text-muted md:text-sm">
          <span>Swift</span>
          <span>·</span>
          <span>SwiftData</span>
          <span>·</span>
          <span>ProofHub API</span>
          <span>·</span>
          <span>macOS Menu Bar</span>
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
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-surface"
      >
        <img
          src={`/projects/proofhub-task-timer.png`}
          alt={`ProofHub Task Timer hero poster`}
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-text-primary/10 transition-colors duration-500 group-hover:border-text-primary/30" />
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
              Data Sync Architecture
            </h2>
            
            <div className="rounded-3xl border border-stroke bg-surface/50 p-8 md:p-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-text-primary/5 via-bg/0 to-transparent pointer-events-none" />
              
              {/* Diagram Layout */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Node 1: SwiftUI Menu Bar */}
                <div className="w-full md:w-1/3 p-6 rounded-2xl bg-surface border border-stroke shadow-xl flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <h4 className="text-text-primary font-bold mb-2">Native UI</h4>
                  <p className="text-xs text-muted">SwiftUI Menu Bar App<br/>& Timer Engine</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center text-muted">
                  <span className="text-xs mb-1">Local State</span>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0 12h58M50 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 20l-8-8 8-8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3"/>
                  </svg>
                </div>

                {/* Node 2: SwiftData */}
                <div className="w-full md:w-1/3 p-6 rounded-2xl bg-surface border border-stroke shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-text-primary" />
                  <div className="h-12 w-12 rounded-full bg-text-primary/10 text-text-primary flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  </div>
                  <h4 className="text-text-primary font-bold mb-2">SwiftData Store</h4>
                  <p className="text-xs text-muted">Offline Persistence &<br/>Query Caching</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center text-muted">
                  <span className="text-xs mb-1">Bolt APIs</span>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0 12h58M50 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Node 3: ProofHub API */}
                <div className="w-full md:w-1/3 p-6 rounded-2xl bg-[#0070f3]/10 border border-[#0070f3]/20 shadow-xl flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-[#0070f3]/20 text-[#0070f3] flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <h4 className="text-text-primary font-bold mb-2">ProofHub Cloud</h4>
                  <p className="text-xs text-muted">Remote Projects<br/>& Bolt Integration</p>
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-center text-muted max-w-2xl mx-auto">
              SwiftData acts as an intermediate offline-first caching layer. This allows the app to query large lists of projects and tasks instantly. When timers are stopped, the data is pushed to the remote ProofHub Bolt APIs.
            </p>
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
