import { motion } from "framer-motion";
import TechPill from "@/components/TechPill";
import ArchitectureDiagram, {
  type ArchNode,
  type ArchWire,
} from "../ArchitectureDiagram";
import { BentoGrid, BentoCard } from "./blocks/BentoGrid";
import { Timeline, TimelineStep } from "./blocks/Timeline";
import { PullQuote } from "./blocks/PullQuote";
import { Store, Server, AlertTriangle, Workflow, ShieldAlert, ArrowRightLeft, DatabaseZap } from "lucide-react";

const ARCH_BANDS = [
  { label: "Cashier Layer", h: 76 },
  { label: "Odoo Core", h: 64 },
  { label: "Sync Engine", h: 64 },
  { label: "Enterprise", h: 76 },
];

const ARCH_NODES: ArchNode[] = [
  { id: "pos", band: 0, colFrac: 0.5, icon: "window", title: "Odoo POS (Offline)", sub: ["Cashier UI", "IndexedDB"] },
  { id: "odoo_api", band: 1, colFrac: 0.5, w: 260, icon: "cpu", title: "Odoo Backend", sub: ["PostgreSQL", "Session Commit"], variant: "seam" },
  { id: "sync", band: 2, colFrac: 0.5, w: 260, icon: "layers", title: "Asynchronous Sync Worker", sub: ["CRON triggered", "Batched XML-RPC"] },
  { id: "netsuite", band: 3, colFrac: 0.5, icon: "cloud", title: "Oracle NetSuite", sub: ["SuiteScript RESTlets", "GL Impact"], variant: "ext" },
];

const ARCH_WIRES: ArchWire[] = [
  { from: "pos", to: "odoo_api", type: "ctrl" },
  { from: "odoo_api", to: "sync", type: "data" },
  { from: "sync", to: "netsuite", type: "net" },
];

// --- Custom Interactive Visual Components (SaaS Aesthetic) ---

const DualSystemVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1200px]">
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10" />
    
    <div className="relative z-10 flex w-[280px] items-center justify-between transform-gpu rotate-y-[15deg]">
      {/* Odoo Node */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex h-20 w-24 flex-col items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(168,85,247,0.2)]"
      >
        <Store className="h-7 w-7 text-purple-400 mb-2" strokeWidth={1.5} />
        <span className="text-[10px] font-mono font-bold text-purple-200/80">ODOO POS</span>
      </motion.div>

      {/* Friction / Disconnect */}
      <div className="relative flex-1 mx-4 flex items-center justify-center">
        <motion.div 
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
        >
          <AlertTriangle className="h-4 w-4 text-red-400" strokeWidth={3} />
        </motion.div>
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/50 via-red-500 to-blue-500/50 -translate-y-1/2" />
      </div>

      {/* NetSuite Node */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex h-20 w-24 flex-col items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
      >
        <Server className="h-7 w-7 text-blue-400 mb-2" strokeWidth={1.5} />
        <span className="text-[10px] font-mono font-bold text-blue-200/80">NETSUITE</span>
      </motion.div>
    </div>
  </div>
);

const DataCorruptionVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
    
    <div className="relative z-10 flex flex-col items-center">
      {/* Broken Database */}
      <motion.div 
        animate={{ rotate: [-2, 2, -2], y: [-2, 2, -2] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-xl border border-red-500/50 bg-red-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)]"
      >
        <DatabaseZap className="h-10 w-10 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" strokeWidth={1.5} />
        <motion.div 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -right-2 -top-2 rounded-full bg-[#09090b] p-1 border border-red-500"
        >
          <ShieldAlert className="h-4 w-4 text-red-500" />
        </motion.div>
      </motion.div>
      
      {/* Orphaned Records visual */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            animate={{ opacity: i === 3 ? [1, 0.2, 1] : 1, y: i === 3 ? [0, 5, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`h-2 w-10 rounded-full ${i === 3 ? 'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  </div>
);

const AsyncQueueVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:100%_20px]" />
    
    <div className="relative z-10 flex gap-4">
      {/* Sequence of jobs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8], x: [40, 0, -40] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <Workflow className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  </div>
);


export default function NetSuiteOdooCaseStudy() {
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
            Enterprise Architecture Integration
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          NetSuite + Odoo <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">Point of Sale Sync</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Oracle NetSuite" />
          <TechPill name="Odoo ERP" />
          <TechPill name="PostgreSQL" />
          <TechPill name="SuiteScript" />
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl"
      >
        <img
          src={`/projects/poster/netsuite-odoo-sync.png`}
          alt={`NetSuite Odoo Integration poster`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-text-primary/10 transition-colors duration-500 group-hover:border-text-primary/30" />
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mt-16 flex flex-col gap-24">
          
          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              The Sync Challenge
            </h2>
            <BentoGrid>
              <BentoCard title="Dual System Friction" colSpan={2} rowSpan={2}>
                <div className="flex flex-col gap-4 h-[250px]">
                  <p className="flex-1">Retail businesses utilize Odoo for its rapid Point of Sale UI, but rely on NetSuite for rigid enterprise financials. Running two massive, disconnected ERP systems creates severe operational bottlenecks.</p>
                  <div className="h-1/2 w-full">
                    <DualSystemVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Data Corruption Risks" colSpan={2} rowSpan={1}>
                <div className="flex flex-col gap-4 h-[200px]">
                  <p className="flex-1 text-sm">Attempting to manually migrate thousands of daily retail transactions introduces data corruption and orphaned records.</p>
                  <div className="h-1/2 w-full">
                    <DataCorruptionVisual />
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="Synchronous Failures" colSpan={2} rowSpan={1}>
                <div className="flex flex-col gap-4 h-[200px]">
                  <p className="flex-1 text-sm">A brittle point-to-point integration leads to API timeouts that block the physical cashier UI during checkout.</p>
                  <div className="h-1/2 w-full">
                    <AsyncQueueVisual />
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
          </section>

          <section>
            <PullQuote 
              quote="To ensure cashiers were never blocked by an API timeout, we completely decoupled the systems. The POS commits locally instantly, and an asynchronous worker reconciles with NetSuite silently in the background."
              author="Lead Integration Architect"
            />
          </section>

          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              The Asynchronous Bridge
            </h2>
            <div className="mb-16">
              <ArchitectureDiagram
                bands={ARCH_BANDS}
                nodes={ARCH_NODES}
                wires={ARCH_WIRES}
                note="The cashier operates entirely offline in Odoo's local DB. A scheduled worker aggregates completed sessions and pushes them to NetSuite without blocking the UI thread."
              />
            </div>
            
            <Timeline>
              <TimelineStep title="Decoupled Cashier Sessions" tool="Odoo IndexedDB">
                The Odoo POS was configured to run autonomously. Cashiers ring up items, apply discounts, and tender payments entirely within the local browser DB. When the session closes, the data is committed to the local Odoo PostgreSQL backend, guaranteeing zero latency during checkout regardless of NetSuite's uptime.
              </TimelineStep>
              <TimelineStep title="Asynchronous Data Aggregation" tool="Python & XML-RPC">
                A custom Python worker runs on a cron schedule. It polls Odoo via XML-RPC for newly closed POS sessions, aggregates the complex multi-line invoices, customer payments, and tax data, and sanitizes the payload into a strictly defined JSON contract designed specifically for NetSuite ingestion.
              </TimelineStep>
              <TimelineStep title="Atomic SuiteScript Commits" tool="NetSuite RESTlets">
                The payload is transmitted to a custom SuiteScript RESTlet. The RESTlet handles the transaction atomically—creating the Cash Sale, applying the Customer Deposit, and hitting the GL in a single transaction. If the payload is malformed or hits an inventory deficit, the entire transaction rolls back, preventing orphaned financial records.
              </TimelineStep>
            </Timeline>
          </section>

          <section className="mb-20 rounded-3xl border border-stroke bg-[#09090b] p-8 md:p-12 shadow-xl">
            <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">
              Operational Stability
            </h2>
            <p className="leading-relaxed text-muted md:text-lg">
              The asynchronous architecture successfully eliminated checkout downtime. By decoupling the systems and utilizing atomic RESTlets, data integrity was maintained across both ERPs. The business scaled from 5 to 50 retail locations without a single integration-induced POS outage.
            </p>
          </section>

        </div>
      </motion.article>
    </main>
  );
}
