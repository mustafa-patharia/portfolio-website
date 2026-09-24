import { motion } from "framer-motion";
import TechPill from "@/components/TechPill";
import { BentoGrid, BentoCard } from "./blocks/BentoGrid";
import { Timeline, TimelineStep } from "./blocks/Timeline";
import { AccordionDeepDive } from "./blocks/AccordionDeepDive";
import ArchitectureDiagram, {
  type ArchNode,
  type ArchWire,
} from "../ArchitectureDiagram";
import { Cpu, Zap, Box, HardDrive, WifiOff, RefreshCcw, Network } from "lucide-react";

const ARCH_BANDS = [
  { label: "SwiftUI View", h: 76 },
  { label: "Tauri Rust Core", h: 64 },
  { label: "OS Native APIs", h: 76 },
];

const ARCH_NODES: ArchNode[] = [
  { id: "ui", band: 0, colFrac: 0.5, icon: "window", title: "React / Vite", sub: ["Framer Motion"] },
  { id: "core", band: 1, colFrac: 0.5, w: 260, icon: "cpu", title: "Rust Backend", sub: ["Tauri IPC Commands"], variant: "seam" },
  { id: "os", band: 2, colFrac: 0.5, icon: "terminal", title: "System APIs", sub: ["File System", "Win32/Cocoa"], variant: "ext" },
];

const ARCH_WIRES: ArchWire[] = [
  { from: "ui", to: "core", type: "ctrl" },
  { from: "core", to: "os", type: "data" },
];

// --- Custom Interactive Visual Components (SaaS Aesthetic) ---

const ElectronBloatVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1200px]">
    <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/10 via-transparent to-amber-900/10" />
    
    <div className="relative z-10 flex w-full max-w-[280px] items-center justify-between">
      {/* Heavy Electron Bloat */}
      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(244,63,94,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]"
      >
        <Box className="h-8 w-8 text-rose-400 mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" strokeWidth={1.5} />
        <span className="text-[10px] font-mono font-bold text-rose-200">ELECTRON</span>
        <span className="text-[9px] font-mono text-rose-300/50 mt-1">200MB+ / 500MB RAM</span>
      </motion.div>

      {/* VS */}
      <div className="text-xs font-mono font-bold text-white/30 tracking-widest">VS</div>

      {/* Lightweight Tauri */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="flex h-24 w-28 flex-col items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]"
      >
        <Zap className="h-8 w-8 text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" strokeWidth={1.5} />
        <span className="text-[10px] font-mono font-bold text-emerald-200">TAURI (RUST)</span>
        <span className="text-[9px] font-mono text-emerald-300/50 mt-1">8MB / 30MB RAM</span>
      </motion.div>
    </div>
  </div>
);

const NativeIntegrationVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
    <motion.div 
      initial={{ rotateX: 30 }}
      animate={{ rotateX: [30, 0, 30], rotateZ: [0, 5, 0] }} 
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 flex h-24 w-48 items-center justify-center gap-4 rounded-2xl border border-blue-500/40 bg-blue-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
    >
      <Cpu className="h-8 w-8 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" strokeWidth={1.5} />
      <div className="h-10 w-px bg-blue-500/30" />
      <HardDrive className="h-8 w-8 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" strokeWidth={1.5} />
    </motion.div>
  </div>
);

const OfflineSupportVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
     <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:100%_20px]" />
     <div className="relative z-10 flex items-center gap-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <WifiOff className="h-7 w-7 text-emerald-400" strokeWidth={1.5} />
        </motion.div>
        
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          <RefreshCcw className="h-5 w-5 text-emerald-500/50" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-xl border border-teal-500/40 bg-teal-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.3)]"
        >
          <Network className="h-7 w-7 text-teal-400" strokeWidth={1.5} />
        </motion.div>
     </div>
  </div>
);


export default function RiftCaseStudy() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-32 pt-40 md:px-10 lg:px-16 lg:pt-48">
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-20"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Open Source Desktop App
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          Rift <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">Mod Manager</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Rust" />
          <TechPill name="Tauri" />
          <TechPill name="React" />
          <TechPill name="Tailwind CSS" />
        </div>

        <div className="mt-10">
          <a
            href="https://github.com/mustafa-patharia/Rift"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-3 text-sm transition-colors hover:border-text-primary/30"
          >
            View on GitHub
            <svg className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl"
      >
        <img
          src={`/projects/poster/rift.png`}
          alt={`Rift hero poster`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mt-16 flex flex-col gap-24">
          
          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              The Electron Problem
            </h2>
            <BentoGrid>
              <BentoCard title="Electron Bloat" colSpan={2} rowSpan={2}>
                <div className="flex h-full flex-col gap-6">
                  <p className="flex-1 leading-relaxed text-muted">Packaging an entire Chromium browser for a utility app results in massive RAM consumption and unacceptably slow startup times. Gamers demand maximum system resources for the game itself, not the mod manager.</p>
                  <div className="h-[250px] w-full">
                    <ElectronBloatVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Native Integration" colSpan={2} rowSpan={1}>
                <div className="flex flex-col gap-6 h-[200px]">
                  <p className="flex-1 leading-relaxed text-muted text-sm">Managing files across complex OS permissions requires deep, native file system hooks that web apps struggle to execute efficiently.</p>
                  <div className="w-full flex-1 min-h-0">
                    <NativeIntegrationVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Offline Functionality" colSpan={2} rowSpan={1}>
                 <div className="flex flex-col gap-6 h-[200px]">
                  <p className="flex-1 leading-relaxed text-muted text-sm">Gamers frequently play offline. The application must run perfectly without a connection, caching manifests locally.</p>
                  <div className="w-full flex-1 min-h-0">
                    <OfflineSupportVisual />
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
          </section>

          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              Tauri + Rust Architecture
            </h2>
            <div className="mb-16">
              <ArchitectureDiagram
                bands={ARCH_BANDS}
                nodes={ARCH_NODES}
                wires={ARCH_WIRES}
                note="Rift leverages Tauri to render a React frontend via the OS's native WebKit/WebView2, while Rust handles the heavy lifting of file I/O and process execution."
              />
            </div>
          </section>

          <section className="mb-20">
            <div className="mx-auto max-w-2xl">
              <AccordionDeepDive title="Why Rust?">
                <p className="leading-relaxed text-muted">
                  By moving all business logic (file moving, parsing manifests, launching executables) into a Rust backend via Tauri IPC commands, Rift achieves near-instant startup times and consumes less than 30MB of RAM. This guarantees the mod manager never steals CPU cycles from the actual game.
                </p>
              </AccordionDeepDive>
            </div>
          </section>

        </div>
      </motion.article>
    </main>
  );
}
