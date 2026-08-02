"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "800+", label: "Production APIs" },
  { value: "99.9%", label: "Service Uptime" },
];

const EXPERIENCE = [
  {
    role: "Senior Application Developer",
    company: "KPI",
    meta: "July 2022 – Present",
    stack: "Node.js · NestJS · Angular · Next.js · PostgreSQL · Redis · MCP",
    points: [
      "Architected a multi-tenant platform serving many businesses from one codebase — 800+ production APIs, secure data isolation, hybrid RBAC/ABAC.",
      "Built in-house AI agents and MCP servers that automate routine engineering work and cut manual effort ~40%.",
      "Built and led a 6–8 developer team — code-quality standards, testing practices, reliable release processes.",
      "Automated the full customer lifecycle: one-click onboarding, scheduled background jobs, safe-migration offboarding. Cut Docker deploy times up to ~80%.",
    ],
  },
  {
    role: "Software Developer (Full Stack)",
    company: "PACE Group",
    meta: "March 2021 – July 2022",
    stack: "Vue.js · Laravel · PHP · MySQL · WebSockets · AWS",
    points: [
      "Built a multi-portal SaaS with role-separated experiences and rich interactive media.",
      "Shipped live multi-user sessions and rule-driven dynamic content over WebSockets.",
      "Owned cloud deployment, scaling, and email delivery on AWS.",
      "Designed the mobile app UI across phones and tablets in Figma and Illustrator.",
    ],
  },
];

export default function Stats() {
  return (
    <section id="resume" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* Stat row */}
        <div className="grid grid-cols-1 gap-10 border-y border-stroke py-14 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-center"
            >
              <div className="font-display text-5xl italic text-text-primary md:text-6xl lg:text-7xl">
                {stat.value}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.3em] text-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience */}
        <div className="mt-20">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-px w-8 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Experience
            </span>
          </div>

          <div className="flex flex-col gap-12">
            {EXPERIENCE.map((job, i) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="grid grid-cols-1 gap-6 border-t border-stroke pt-8 md:grid-cols-12"
              >
                <div className="md:col-span-4">
                  <h3 className="text-lg text-text-primary">{job.role}</h3>
                  <p className="mt-1 font-display text-2xl italic text-text-primary/80">
                    {job.company}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                    {job.meta}
                  </p>
                </div>

                <div className="md:col-span-8">
                  <p className="mb-5 text-xs uppercase tracking-[0.15em] text-muted">
                    {job.stack}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {job.points.map((p) => (
                      <li
                        key={p}
                        className="relative pl-5 text-sm text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-text-primary/50"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-12 grid grid-cols-1 gap-6 border-t border-stroke pt-8 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                Education
              </span>
            </div>
            <div className="md:col-span-8">
              <h3 className="text-lg text-text-primary">
                Bachelor of Engineering,{" "}
                <span className="font-display italic">Computer Science</span>
              </h3>
              <p className="mt-2 text-sm text-muted">
                University of Mumbai · Aug 2016 – Oct 2020
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
