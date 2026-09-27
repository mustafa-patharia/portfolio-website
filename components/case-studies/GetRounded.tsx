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
import { Image, ShieldCheck, Download, Code2, MoveRight } from "lucide-react";

const ARCH_BANDS = [
  { label: "Frontend", h: 76 },
  { label: "Native Bridge", h: 64 },
  { label: "Host System", h: 76 },
];

const ARCH_NODES: ArchNode[] = [
  { id: "ui", band: 0, colFrac: 0.5, icon: "window", title: "HTML/JS UI", sub: ["Tailwind · Canvas Render"] },
  { id: "bridge", band: 1, colFrac: 0.5, w: 260, icon: "cpu", title: "pywebview", sub: ["Cross-Platform Web Engine"], variant: "seam" },
  { id: "backend", band: 2, colFrac: 0.5, icon: "terminal", title: "Python Shell", sub: ["File System Access", "Drop Handling"], variant: "ext" },
];

const ARCH_WIRES: ArchWire[] = [
  { from: "ui", to: "bridge", type: "ctrl" },
  { from: "bridge", to: "backend", type: "ctrl" },
  { from: "backend", to: "ui", type: "data" },
];

// --- Custom Interactive Visual Components (SaaS Aesthetic) ---

// Mimicking the "Novu" style embedded UI mockups
const AppUIMockupVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1200px]">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/10" />
    
    <div className="relative z-10 flex w-full max-w-[280px] flex-col items-center justify-center transform-gpu rotate-x-[15deg]">
      
      {/* Floating App Window Mockup */}
      <motion.div 
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full rounded-xl border border-white/10 bg-[#121214]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-red-500/80" />
          <div className="h-2 w-2 rounded-full bg-amber-500/80" />
          <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[10px] font-mono text-gray-500">GetRounded.app</span>
        </div>
        
        {/* Mock Image Drop Zone */}
        <div className="h-20 w-full rounded-lg border border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center gap-2 mb-4">
          <Image className="h-6 w-6 text-indigo-400" strokeWidth={1.5} />
          <span className="text-[9px] font-medium text-indigo-300/70">Drop Screenshot Here</span>
        </div>

        {/* Mock Sliders/Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-gray-400">Border Radius</span>
              <span className="text-[9px] text-indigo-400">24px</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ["0%", "60%", "60%", "0%"] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              />
            </div>
          </div>
        </div>
      </motion.div>
      
    </div>
  </div>
);

// Mimicking the "Paragon" style mock code editor
const CodeEditorVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
    
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full max-w-[280px] rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl overflow-hidden"
    >
      {/* Editor Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#121214]">
        <div className="h-2 w-2 rounded-full bg-red-500/50" />
        <div className="h-2 w-2 rounded-full bg-amber-500/50" />
        <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
        <div className="ml-2 flex items-center gap-1.5 text-gray-500">
          <Code2 className="h-3 w-3" />
          <span className="text-[9px] font-mono">local_render.py</span>
        </div>
      </div>
      
      {/* Code Snippet with Syntax Highlighting Mock */}
      <div className="p-4 text-[10px] font-mono leading-relaxed text-gray-300">
        <div><span className="text-purple-400">def</span> <span className="text-blue-400">process_image</span>(filepath):</div>
        <div className="pl-4"><span className="text-gray-500"># Intercepts drop natively</span></div>
        <div className="pl-4"><span className="text-purple-400">if not</span> os.path.exists(filepath):</div>
        <div className="pl-8"><span className="text-purple-400">return</span> <span className="text-emerald-400">False</span></div>
        <br />
        <div className="pl-4"><span className="text-gray-500"># Zero network calls</span></div>
        <div className="pl-4">canvas = CanvasEngine(filepath)</div>
        <div className="pl-4">canvas.apply_mask(radius=<span className="text-amber-400">24</span>)</div>
        <br />
        <motion.div 
          animate={{ opacity: [0, 1, 1, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="pl-4"
        >
          <span className="text-purple-400">return</span> <span className="text-emerald-400">"SUCCESS"</span>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

const OfflineSecurityVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent" />
    <motion.div 
      initial={{ rotateY: -20 }}
      animate={{ rotateY: [-20, 0, -20] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 flex h-24 w-full max-w-[240px] items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(52,211,153,0.2)] px-6"
    >
      <div className="flex flex-col items-center gap-1">
        <Image className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
        <span className="text-[8px] font-mono text-gray-400">LOCAL SSD</span>
      </div>

      <div className="flex flex-col items-center">
        <motion.div 
          animate={{ x: [-5, 5, -5] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <MoveRight className="h-4 w-4 text-emerald-400" />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <ShieldCheck className="h-6 w-6 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" strokeWidth={1.5} />
        <span className="text-[8px] font-mono font-bold text-emerald-300 tracking-widest">ENCLAVE</span>
      </div>
    </motion.div>
  </div>
);


export default function GetRoundedCaseStudy() {
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
            Open Source Case Study
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          GetRounded <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">Desktop App</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Python" />
          <TechPill name="pywebview" />
          <TechPill name="Tailwind CSS" />
          <TechPill name="HTML5 Canvas" />
        </div>

        <div className="mt-10">
          <a
            href="https://github.com/mustafa-patharia/get-rounded"
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
        className="group relative mb-24 aspect-[21/9] w-full flex items-center justify-center overflow-hidden rounded-3xl"
      >
        <img
          src={`/projects/poster/get-rounded.png`}
          alt={`GetRounded hero poster`}
          className="max-w-[40%] object-contain"
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
              The Friction of Web Tools
            </h2>
            <BentoGrid>
              <BentoCard title="High Friction Workflows" colSpan={2} rowSpan={2}>
                <div className="flex h-full flex-col gap-6">
                  <p className="flex-1 leading-relaxed text-muted">Rounding the corners of a screenshot is a trivial task that historically demands disproportionate friction. Users are forced to launch heavy design tools like Figma or Photoshop, manually draw a vector mask, and export the file.</p>
                  <div className="h-[250px] w-full">
                    <AppUIMockupVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Security Sandbox" colSpan={2} rowSpan={1}>
                <div className="flex flex-col gap-6 h-[200px]">
                  <p className="flex-1 leading-relaxed text-muted text-sm">Ad-ridden online tools force users to upload potentially sensitive corporate screenshots to a remote, untrusted server just to execute a basic CSS operation.</p>
                  <div className="w-full flex-1 min-h-0">
                    <CodeEditorVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="A Privacy-First Solution" colSpan={2} rowSpan={1}>
                <div className="flex flex-col gap-6 h-[200px]">
                  <p className="flex-1 leading-relaxed text-muted text-sm">The market lacked a zero-friction, privacy-first desktop app that could operate offline, bind to local file paths, and execute rendering locally.</p>
                  <div className="w-full flex-1 min-h-0">
                    <OfflineSecurityVisual />
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
          </section>

          <section>
            <PullQuote 
              quote="I architected GetRounded from scratch specifically to bypass the massive footprint of traditional Electron apps, hooking directly into native OS rendering engines."
              author="Creator & Developer"
            />
          </section>

          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              The Rendering Pipeline
            </h2>
            <div className="mb-16">
              <ArchitectureDiagram
                bands={ARCH_BANDS}
                nodes={ARCH_NODES}
                wires={ARCH_WIRES}
                note="The Python host binds system drops to real file paths, while the lightweight Tailwind UI handles the rendering via HTML5 Canvas. pywebview bridges the gap."
              />
            </div>

            <Timeline>
              <TimelineStep title="The Anti-Electron Architecture" tool="pywebview & Python">
                Shipping a massive 150MB Chromium binary for a simple utility is an architectural anti-pattern. Instead, I built the application using pywebview, which instantiates a lightweight Python server and hooks directly into the host operating system's native web engine (WebKit on macOS, EdgeHTML on Windows). This hybrid approach reduces the binary size by 90% while allowing the Python backend to execute privileged OS-level operations that are strictly sandboxed in standard browsers.
              </TimelineStep>
              <TimelineStep title="Bypassing the Security Sandbox" tool="Native Event Interceptors">
                A standard JavaScript environment cannot resolve the absolute physical file path of a dragged-and-dropped image due to strict OS sandboxing, which normally prevents web apps from blindly overwriting local files. To circumvent this safely, I intercepted the drop event natively in the Python shell. By binding a custom handler with prevent_default=True, I captured the absolute file URI natively before the webview could process it. This absolute path is then securely marshaled across the bridge to the JS frontend.
              </TimelineStep>
              <TimelineStep title="Canvas Memory Optimization" tool="HTML5 Rendering API">
                The actual image rounding does not rely on heavy image processing libraries like Pillow or OpenCV. Instead, it utilizes a highly optimized HTML5 Canvas operation. The app mathematically calculates the clipping boundaries based on the user's slider input, builds a bezier-curve rounded rectangle path, applies a 2D clipping mask, and draws the pixel buffer into memory. To prevent memory leaks when processing massive 4K uncompressed PNGs, the canvas context is strictly garbage collected, and the output is instantly serialized back to the host file system.
              </TimelineStep>
            </Timeline>
          </section>

          <section className="mb-20">
            <div className="mx-auto max-w-2xl">
              <AccordionDeepDive title="The Offline Advantage">
                <p className="leading-relaxed text-muted">
                  GetRounded was successfully launched as an open-source utility available natively for macOS, Windows, and Linux. It provides a 100% offline, privacy-first workflow for instantly rounding images. By rejecting the heavy Electron framework in favor of native OS web engine hooks via Python, the application proves that powerful desktop utilities can be built with modern web technologies without incurring a massive performance penalty.
                </p>
              </AccordionDeepDive>
            </div>
          </section>
        </div>
      </motion.article>
    </main>
  );
}
