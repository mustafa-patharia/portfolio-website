import { motion } from "framer-motion";
import TechPill from "@/components/TechPill";

export default function infithraCaseStudy() {
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
            Enterprise Case Study
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          infithra <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">HRMS Platform</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Node.js" />
          <TechPill name="Angular" />
          <TechPill name="Next.js" />
          <TechPill name="AWS" />
          <TechPill name="PostgreSQL" />
          <TechPill name="Redis" />
        </div>

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

      {/* Hero Image Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-surface"
      >
        <img
          src={`/projects/infithra.jpg`}
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
          {/* Section 1: The Brief (Overview & Problem) */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          >
            <div>
              <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">
                Overview
              </h2>
              <p className="leading-relaxed text-muted md:text-lg">
                infithra is a multi-tenant HRMS platform I helped build from an empty repository into a system running the full employee lifecycle — onboarding, payroll, leave, attendance — for thousands of daily users across dozens of UAE-based companies, each with its own policies and Labour Law obligations.
              </p>
              <p className="mt-6 leading-relaxed text-muted md:text-lg">
                I joined before the first schema existed. What follows is the technical story: the decisions that held up, the ones that had to be revisited, and what building enterprise software from zero actually looks like from the inside.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-8 md:p-10">
              <h3 className="mb-6 font-display text-2xl italic text-text-primary">
                The Business Problem
              </h3>
              <p className="mb-6 leading-relaxed text-muted">
                The HR landscape in the UAE requires specific regulatory adherence. Businesses needed a unified platform that could:
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Handle multiple distinct organizations securely within a single deployment.",
                  "Calculate highly complex payroll structures, including gratuity, overtime, and multi-currency allowances.",
                  "Provide a seamless, fast, and unified experience for both HR administrators and employees.",
                ].map((item, i) => (
                  <li key={i} className="relative pl-5 text-sm text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-text-primary/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Section 2: Role & Impact (Callout) */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-3xl border border-stroke bg-surface p-8 md:p-12"
          >
            <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#89AACC] via-bg to-transparent blur-[80px]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-muted">The Role</span>
                <p className="leading-relaxed text-text-primary md:text-lg">
                  <span className="font-display italic">Founding / Lead Engineer.</span> There was no legacy code to inherit and no prior architecture to defend — every early call on data isolation, permissions, and deployment became the standard the rest of the platform would be built on. I later grew and led the 6–8 engineer team that took the platform from first tenant to production scale.
                </p>
              </div>
              <div>
                <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-muted">The Impact</span>
                <p className="leading-relaxed text-text-primary md:text-lg">
                  The platform now runs 800+ production APIs, sustains 99.9% uptime, and handles region-specific payroll and compliance for dozens of tenants without a single reported cross-tenant data leak — the one failure mode that would have been unrecoverable for a product built on this model.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Technical Challenges (Bento Grid) */}
          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-5xl">
              Technical Challenges
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { title: "Multi-tenant Isolation", text: "Serving hundreds of companies from one database required bulletproof isolation to prevent cross-tenant data leaks." },
                { title: "Complex Authorization", text: "Simple role-based access wasn't enough. We needed a hybrid RBAC and ABAC system to allow custom permissions per module per tenant." },
                { title: "API Scale", text: "Delivering over 800+ production APIs while maintaining response times under 200ms." },
                { title: "Dynamic Payroll Engine", text: "Handling intricate UAE Labour Law requirements required a highly scalable calculation engine capable of processing multi-currency allowances and gratuity concurrently." },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group relative overflow-hidden rounded-3xl border border-stroke bg-surface p-8 transition-colors duration-300 hover:border-text-primary/30"
                >
                  <h3 className="mb-3 text-lg font-bold text-text-primary">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 4: Architectural Decisions (Vertical Timeline) */}
          <section>
            <h2 className="mb-12 font-display text-3xl italic text-text-primary md:text-4xl">
              Architectural Decisions
            </h2>
            <div className="relative pl-6 md:pl-10">
              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-stroke md:left-[11px]" />
              <div className="flex flex-col gap-12">
                {[
                  { title: "Cloud Infrastructure", tool: "AWS", text: "Leveraged the AWS ecosystem to build a scalable and secure foundation—utilizing EC2 for compute, RDS for managed databases, S3 for object storage, Cognito for authentication, and SSM for secure parameter management." },
                  { title: "Backend Architecture", tool: "Node.js & PostgreSQL", text: "Selected Node.js for its robust ecosystem and scalability. We utilized PostgreSQL for relational integrity, which is critical for financial and HR data." },
                  { title: "Caching and Queueing", tool: "Redis", text: "Implemented Redis to handle session management and background task queueing (e.g., end-of-month payroll processing for thousands of employees simultaneously)." },
                  { title: "Frontend Strategy", tool: "Angular & Next.js", text: "Used Angular for the core multi-tenant platform due to its robust architecture and state management, and Next.js for the heavy-lifting admin dashboards where performance and rapid load times were paramount." },
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

          {/* Section 5: Lessons Learned */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-12 border-t border-stroke" />
            <h3 className="mb-6 font-display text-2xl italic text-text-primary">Key Takeaways</h3>
            <p className="leading-relaxed text-muted md:text-lg">
              In enterprise software, data architecture is destiny — a mistake made in the tenant model on day one is a mistake every future feature has to work around. What surprised me most wasn't the payroll math or the permission matrix; it was how much of &ldquo;architecture&rdquo; is really about writing down defaults so a growing team doesn't have to relitigate the same decision five different ways. I over-built a few abstractions early that never got used, and under-built others that had to be rewritten under load — both are part of learning what actually needs to be generic versus what just needs to work.
            </p>
          </motion.section>

          <div className="rounded-xl border border-stroke bg-surface p-6 text-sm text-muted">
            <strong>Disclaimer:</strong> This project was developed as part of my employment. This case study focuses exclusively on the engineering challenges and technical decisions made during its development, and does not disclose confidential business metrics or proprietary source code.
          </div>
        </div>
      </motion.article>
    </main>
  );
}
