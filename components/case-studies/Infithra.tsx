import { motion } from "framer-motion";

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
          {/* Section 1: Overview */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          >
            <div>
              <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">
                Engineering Leadership
              </h2>
              <p className="leading-relaxed text-muted md:text-lg">
                Joining as the founding engineer before the first line of code was written, my journey at infithra was defined by scaling a comprehensive cloud-based HR and Payroll platform tailored for businesses across the UAE.
              </p>
              <p className="mt-6 leading-relaxed text-muted md:text-lg">
                This case study highlights the evolution of my role from an individual contributor to a technical leader. It focuses on the strategic planning and engineering rigor required to take a major enterprise SaaS product from zero to massive adoption, entirely built around publicly verifiable capabilities.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-8 md:p-10">
              <h3 className="mb-6 font-display text-2xl italic text-text-primary">
                My Focus Areas
              </h3>
              <p className="mb-6 leading-relaxed text-muted">
                Building an enterprise platform at this scale demanded much more than writing code. My core responsibilities included:
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Architecting a scalable SaaS deployment model to support high availability and multi-tenant isolation.",
                  "Mentoring a growing engineering team, fostering a culture of ownership, and establishing rigorous code quality standards.",
                  "Translating complex regional business requirements (like GCC compliance) into actionable technical deliverables.",
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
                  <span className="font-display italic">Founding / Lead Engineer.</span> As the product expanded to cover Core HR, Time & Leave management, and People Analytics, my role naturally evolved into leadership. I was responsible for onboarding talent and ensuring our sprint goals consistently met the high standards required for enterprise software.
                </p>
              </div>
              <div>
                <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-muted">The Impact</span>
                <p className="leading-relaxed text-text-primary md:text-lg">
                  Through active mentorship and clear communication channels, I helped cultivate a cohesive engineering team. This directly contributed to the seamless delivery of critical modules and enabled us to sustain exceptional product stability under pressure.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Driving Team Success (Bento Grid) */}
          <section>
            <h2 className="mb-10 text-center font-display text-3xl italic text-text-primary md:text-4xl">
              Driving Team Success
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { title: "Cross-Functional Communication", text: "Regularly interfaced with product managers and business stakeholders to align engineering efforts with high-level company objectives, ensuring transparency and realistic timelines." },
                { title: "Mentorship & Growth", text: "Conducted 1-on-1 sessions, pair programming, and comprehensive code reviews to elevate the overall skill level of the team and encourage independent problem-solving." },
                { title: "Process Optimization", text: "Identified workflow inefficiencies and introduced streamlined agile methodologies that significantly improved our team's delivery cadence and morale across the development lifecycle." },
                { title: "Conflict Resolution", text: "Navigated technical disagreements gracefully by fostering an evidence-based discussion culture where the best ideas won, regardless of seniority." },
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

          {/* Section 4: Operational Excellence (Vertical Timeline) */}
          <section>
            <h2 className="mb-12 font-display text-3xl italic text-text-primary md:text-4xl">
              Execution & Strategy
            </h2>
            <div className="relative pl-6 md:pl-10">
              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-stroke md:left-[11px]" />
              <div className="flex flex-col gap-12">
                {[
                  { title: "Establishing Culture", label: "Foundation", text: "From day one, I championed a culture of extreme ownership. I ensured that every engineer understood not just the 'how', but the 'why' behind the enterprise features they were building." },
                  { title: "Scaling the Organization", label: "Growth", text: "As user demand skyrocketed, so did the engineering team. I played a key role in interviewing, hiring, and successfully onboarding new members to keep momentum high without sacrificing quality." },
                  { title: "Navigating High-Stakes Deliveries", label: "Resilience", text: "During critical release cycles for major compliance updates, I coordinated cross-team efforts to manage risk, perform thorough testing, and handle incident responses calmly and effectively." },
                  { title: "Continuous Improvement", label: "Iterative Learning", text: "Implemented regular retrospectives that provided a safe space for the team to voice concerns, celebrate wins, and continuously refine our internal processes." },
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
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#89AACC]">{item.label}</p>
                    <p className="text-sm leading-relaxed text-muted md:text-base">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 5: Engineering Excellence ("How good developer im") */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-12 border-t border-stroke" />
            <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">Technical Excellence</h2>
            <p className="leading-relaxed text-muted md:text-lg">
              Beyond leadership, my foundation remains rooted in writing exceptional, production-grade code. I architected the core of infithra to be highly resilient and scalable, seamlessly handling thousands of concurrent users and complex payroll computations. 
            </p>
            <p className="mt-4 leading-relaxed text-muted md:text-lg">
              A key milestone in demonstrating this technical depth was single-handedly designing and building the entire NetSuite ERP integration for infithra. Bridging the gap between a modern HRMS and a massive enterprise ERP required deep technical knowledge, robust bidirectional data synchronization pipelines, and flawless error handling to ensure mission-critical financial and employee data remained perfectly aligned.
            </p>
            <p className="mt-4 leading-relaxed text-muted md:text-lg">
              By enforcing rigorous code quality standards, crafting pixel-perfect interfaces, and designing optimized backend services, I ensured that the platform was not only robust enough to achieve ISO 27001 and SOC-2 compliance, but also maintainable for years to come. I take immense pride in being a developer who doesn't just write code, but builds durable, elegant, and secure systems.
            </p>
          </motion.section>

          <div className="rounded-xl border border-stroke bg-surface p-6 text-sm text-muted">
            <strong>Disclaimer:</strong> This project was developed as part of my employment. To respect company confidentiality, this case study intentionally omits the internal tech stack and proprietary architectures, focusing instead on publicly documented features, engineering leadership, and strategic execution.
          </div>
        </div>
      </motion.article>
    </main>
  );
}
