import { motion } from "framer-motion";
import { BentoGrid, BentoCard } from "./blocks/BentoGrid";
import { PullQuote } from "./blocks/PullQuote";
import { Database, Server, RefreshCw, CheckCircle2, Users, Cloud, Building2, ShieldCheck, Lock, FileKey } from "lucide-react";

// --- Custom Interactive Visual Components (SaaS Aesthetic) ---

const NetSuiteSyncVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex flex-col items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1200px]">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    
    <div className="relative z-10 flex w-full max-w-[320px] items-center justify-between transform-gpu rotate-x-[15deg] rotate-y-[-10deg]">
      
      {/* Infithra Node */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]"
      >
        <Database className="h-8 w-8 text-blue-400 mb-2" strokeWidth={1.5} />
        <span className="text-[10px] font-mono font-medium text-blue-200/80">INFITHRA</span>
      </motion.div>

      {/* Sync Bridge */}
      <div className="relative flex-1 mx-4 flex flex-col items-center justify-center h-full">
        {/* Connection Line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-white/10 rounded-full" />
        
        {/* Animated Data Packet */}
        <motion.div 
          animate={{ x: [-60, 60], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -translate-y-1/2 h-2 w-8 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] z-10"
        />

        {/* Sync Icon */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#121214] shadow-lg backdrop-blur-md"
        >
          <RefreshCw className="h-5 w-5 text-gray-300" strokeWidth={2} />
        </motion.div>
      </div>

      {/* NetSuite Node */}
      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(16,185,129,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)]"
      >
        <Server className="h-8 w-8 text-emerald-400 mb-2" strokeWidth={1.5} />
        <span className="text-[10px] font-mono font-medium text-emerald-200/80">NETSUITE</span>
        
        {/* Success Checkmark popup */}
        <motion.div
          animate={{ scale: [0, 1.2, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
          className="absolute -right-3 -top-3 rounded-full bg-emerald-500 p-1 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
        >
          <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>
      
    </div>
  </div>
);

const MultiTenantVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center perspective-[1200px] border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
    
    <div className="relative z-10 flex flex-col items-center justify-center transform-gpu rotate-x-[50deg] rotate-z-[-20deg] scale-110">
      
      {/* Core Platform Node (Top Layer) */}
      <motion.div 
        animate={{ y: [-20, -30, -20] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-30 mb-8 flex h-20 w-48 items-center justify-center gap-3 rounded-2xl border border-indigo-500/40 bg-indigo-500/20 backdrop-blur-xl shadow-[0_30px_60px_rgba(79,70,229,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]"
      >
        <Cloud className="h-8 w-8 text-indigo-300" strokeWidth={1.5} />
        <span className="font-display font-bold tracking-widest text-indigo-100 text-sm">CORE INFRA</span>
      </motion.div>

      {/* Floating Tenant Nodes (Bottom Layer) */}
      <div className="relative z-20 flex gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            className={`relative flex h-20 w-28 flex-col items-center justify-center rounded-xl border backdrop-blur-lg shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] ${i === 2 ? 'border-sky-500/40 bg-sky-500/20' : 'border-white/10 bg-white/5'}`}
          >
            {i === 2 ? <Building2 className="h-6 w-6 text-sky-400 mb-2" strokeWidth={1.5} /> : <Users className="h-6 w-6 text-gray-400 mb-2" strokeWidth={1.5} />}
            <span className={`text-[9px] font-mono font-bold tracking-widest ${i === 2 ? 'text-sky-200' : 'text-gray-400'}`}>TENANT {i}</span>
            
            {/* Active connection pulse for tenant 2 */}
            {i === 2 && (
              <motion.div 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-12 left-1/2 w-px h-12 bg-gradient-to-b from-indigo-400 to-sky-400 -translate-x-1/2 shadow-[0_0_10px_rgba(56,189,248,1)]"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const ComplianceVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-emerald-900/10" />
    
    <div className="relative z-10 flex items-center justify-center">
      {/* Expanding Radar/Sonar Rings */}
      <motion.div 
        animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        className="absolute h-24 w-24 rounded-full border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
      />
      <motion.div 
        animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
        className="absolute h-24 w-24 rounded-full border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
      />
      
      {/* Orbital Data Keys */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute h-40 w-40 rounded-full border border-white/5 border-dashed"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[#121214] border border-white/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
          <Lock className="h-3 w-3" strokeWidth={2.5} />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[#121214] border border-white/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
          <FileKey className="h-3 w-3" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Shield Core */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="relative z-20 flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600/80 to-teal-500/80 shadow-[0_0_40px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/30 backdrop-blur-xl"
      >
        <ShieldCheck className="h-10 w-10 text-white mb-1 drop-shadow-md" strokeWidth={1.5} />
        <span className="text-[9px] font-bold tracking-widest text-emerald-50">SOC-2</span>
      </motion.div>
    </div>
  </div>
);


export default function infithraCaseStudy() {
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
            Enterprise Case Study
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          infithra <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">HRMS Platform</span>
        </h1>

        <div className="mt-10">
          <a
            href="https://infithra.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-3 text-sm transition-colors hover:border-text-primary/30"
          >
            Visit infithra.com
            <svg className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </motion.header>

      {/* Hero Image - Keeping the main product shot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl"
      >
        <img
          src={`/projects/poster/infithra.jpg`}
          alt={`infithra hero poster`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              Scaling Regional HR
            </h2>
            <BentoGrid>
              <BentoCard title="Regional Complexities" colSpan={2} rowSpan={1}>
                <p>Businesses across the UAE and GCC face complex, regionally-specific HR challenges—from localized payroll compliance to intricate leave management policies and end-of-service accruals.</p>
              </BentoCard>
              <BentoCard title="A Tailored Cloud Solution" colSpan={2} rowSpan={1}>
                <p>There was a strong need for a highly scalable, multi-tenant cloud HRMS platform built specifically to handle these regulatory nuances while remaining highly available and performant.</p>
              </BentoCard>
            </BentoGrid>
          </section>

          <section>
            <PullQuote 
              quote="As the Founding and Lead Engineer, my role rapidly evolved from writing the first line of code to architecting a scalable SaaS deployment model and leading a growing team."
              author="Lead Engineer"
            />
          </section>

          {/* Section 2: Interactive UI Bento Grids */}
          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              Technical Foundation
            </h2>
            
            <BentoGrid>
              <BentoCard title="NetSuite ERP Integration" colSpan={2} rowSpan={2}>
                <div className="mt-4 flex flex-col gap-6 h-[250px]">
                  <div className="flex-1">
                    <p className="leading-relaxed">Single-handedly designed and built robust bidirectional data synchronization pipelines to bridge infithra with Oracle NetSuite, ensuring mission-critical financial data remained perfectly aligned.</p>
                  </div>
                  <div className="w-full flex-1 min-h-0">
                    <NetSuiteSyncVisual />
                  </div>
                </div>
              </BentoCard>

              <BentoCard title="Multi-Tenant Cloud" colSpan={2} rowSpan={1}>
                <div className="mt-4 flex flex-col gap-6 h-[220px]">
                  <p className="leading-relaxed text-sm">Architected the core system to seamlessly handle thousands of concurrent users while maintaining strict tenant isolation.</p>
                  <div className="w-full flex-1 min-h-0">
                    <MultiTenantVisual />
                  </div>
                </div>
              </BentoCard>

              <BentoCard title="Compliance Security" colSpan={2} rowSpan={2}>
                <div className="mt-4 flex flex-col gap-6 h-[250px]">
                  <div className="flex-1">
                    <p className="leading-relaxed">Enforced rigorous code quality standards and designed optimized backend services robust enough to help the platform achieve ISO 27001 and SOC-2 compliance.</p>
                  </div>
                  <div className="w-full flex-1 min-h-0">
                    <ComplianceVisual />
                  </div>
                </div>
              </BentoCard>
              
              <BentoCard title="Engineering Culture" colSpan={2} rowSpan={1}>
                <div className="flex h-[220px] flex-col justify-center">
                  <p className="leading-relaxed">Introduced streamlined agile methodologies that significantly improved delivery cadence. Cultivated an evidence-based discussion culture where the best technical ideas won.</p>
                </div>
              </BentoCard>
            </BentoGrid>
          </section>

          {/* Section 3: Outcome */}
          <section className="rounded-3xl border border-stroke bg-[#09090b] p-8 md:p-12 shadow-xl">
            <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">
              Market Adoption
            </h2>
            <p className="leading-relaxed text-muted md:text-lg">
              The result was a highly successful, enterprise-grade HRMS platform that achieved mass adoption across businesses in the UAE. By setting a strong architectural foundation and fostering an environment of technical excellence and extreme ownership, the platform seamlessly handled scale and became a critical operational tool for its users.
            </p>
          </section>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-sm text-muted">
            <strong>Disclaimer:</strong> This project was developed as part of my employment. To respect company confidentiality, this case study intentionally omits the internal tech stack and proprietary architectures, focusing instead on publicly documented features, engineering leadership, and strategic execution.
          </div>
        </div>
      </motion.article>
    </main>
  );
}
