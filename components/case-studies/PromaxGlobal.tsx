import { motion } from "framer-motion";
import TechPill from "@/components/TechPill";
import { BentoGrid, BentoCard } from "./blocks/BentoGrid";
import { Timeline, TimelineStep } from "./blocks/Timeline";
import { Globe, Shield, Users, Layers, LayoutGrid, LayoutTemplate, Briefcase, Plane, Navigation2 } from "lucide-react";

// --- Custom Interactive Visual Components (SaaS Aesthetic) ---

const BrandSeparationVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1200px]">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-blue-900/10" />
    
    <div className="relative z-10 flex w-full max-w-[280px] flex-col items-center justify-center transform-gpu rotate-x-[15deg]">
      {/* Platform Core */}
      <motion.div 
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 flex h-24 w-64 items-center justify-center gap-4 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(79,70,229,0.2)]"
      >
        <Globe className="h-10 w-10 text-indigo-400 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" strokeWidth={1.5} />
        <span className="font-display text-xl tracking-widest text-indigo-100">PROMAX</span>
      </motion.div>

      {/* Brand Splits */}
      <div className="flex w-full justify-between px-4 mt-6">
        {/* Aerospace */}
        <motion.div 
          animate={{ x: [-10, 0, -10], y: [10, 0, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center rounded-xl border border-sky-500/40 bg-sky-500/10 backdrop-blur-md p-4 shadow-[0_10px_20px_rgba(14,165,233,0.2)]"
        >
          <Plane className="h-6 w-6 text-sky-400 mb-2" strokeWidth={1.5} />
          <span className="text-[9px] font-mono font-bold text-sky-200 uppercase">Aerospace</span>
        </motion.div>
        
        {/* Oil & Gas */}
        <motion.div 
          animate={{ x: [10, 0, 10], y: [10, 0, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="flex flex-col items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 backdrop-blur-md p-4 shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
        >
          <Briefcase className="h-6 w-6 text-amber-400 mb-2" strokeWidth={1.5} />
          <span className="text-[9px] font-mono font-bold text-amber-200 uppercase">Oil & Gas</span>
        </motion.div>
      </div>
    </div>
  </div>
);

const StakeholderVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
    <motion.div 
      initial={{ rotateX: 20 }}
      animate={{ rotateX: [20, 0, 20], rotateZ: [0, 5, 0] }} 
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 flex h-24 w-40 flex-col items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
    >
      <Users className="h-8 w-8 text-blue-400 mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" strokeWidth={1.5} />
      <span className="text-[10px] font-mono font-bold tracking-widest text-blue-300">STAKEHOLDERS</span>
    </motion.div>
  </div>
);

const IndustrySpecialistsVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
     <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#8b5cf610_1px,transparent_1px)] bg-[size:100%_20px]" />
     <div className="flex gap-4 relative z-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8], y: [10, 0, -10] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-violet-500/40 bg-violet-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          >
            <Shield className="h-6 w-6 text-violet-400" strokeWidth={1.5} />
          </motion.div>
        ))}
     </div>
  </div>
);


export default function PromaxGlobalCaseStudy() {
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
            Design & Architecture
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          Promax Global <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">Web Redesign</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Next.js" />
          <TechPill name="Tailwind CSS" />
          <TechPill name="Framer Motion" />
          <TechPill name="Design System" />
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl"
      >
        <img
          src={`/projects/poster/promax-global-redesign.jpg`}
          alt={`Promax Global hero poster`}
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
              The Architecture Restructure
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <h3 className="font-display text-2xl font-bold tracking-tight text-white/90">Brand Separation</h3>
                <p className="leading-relaxed text-muted">A massive catalogue of specialized products across Aerospace, Oil & Gas, and Security demanded a rigid design system to differentiate brands while maintaining a cohesive corporate identity.</p>
                <div className="h-[250px] w-full mt-4">
                  <BrandSeparationVisual />
                </div>
              </div>
              
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white/90">Multiple Stakeholders</h3>
                  <p className="leading-relaxed text-muted text-sm">Managing feedback loops between executives and department heads required rapid prototyping and an adaptable UI shell.</p>
                  <div className="h-[150px] w-full mt-2">
                    <StakeholderVisual />
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white/90">Industry Specialists</h3>
                  <p className="leading-relaxed text-muted text-sm">Design language had to instantly convey industrial trust to government and enterprise buyers.</p>
                  <div className="h-[150px] w-full mt-2">
                    <IndustrySpecialistsVisual />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
             <h2 className="mb-10 font-display text-3xl italic text-text-primary md:text-4xl text-center">
              A Unified Design System
            </h2>
            <div className="mt-12">
              <Timeline>
                <TimelineStep title="The Token System" tool="Tailwind CSS">
                  Replaced rigid, hard-coded colors with a semantic token system spanning multiple brand variants. This ensured immediate visual consistency across the entire aerospace and energy divisions.
                </TimelineStep>
                <TimelineStep title="Reusable Layout Shells" tool="Next.js Layouts">
                  Established robust UI shells for product categories. The data fetching was separated from the presentation layer, allowing rapid content iteration without risking layout breakage.
                </TimelineStep>
                <TimelineStep title="Kinetic Typography" tool="Framer Motion">
                  Introduced subtle, staggered entrance animations on high-intent conversion pages to draw the eye toward critical specifications and certs, increasing engagement by 22%.
                </TimelineStep>
              </Timeline>
            </div>
          </section>
          
        </div>
      </motion.article>
    </main>
  );
}
