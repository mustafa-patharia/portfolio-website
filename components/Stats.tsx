"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { RESUME } from "@/lib/resumes";

const EXPERIENCE = [
  {
    role: "Senior Application Developer",
    company: "KPI",
    meta: "July 2022 – July 2026",
    stack: "Node.js · NestJS · Angular · Next.js · PostgreSQL · Redis · MCP",
    points: [
      "Responsible for architecting and maintaining a multi-tenant platform serving multiple businesses from a single, isolated codebase.",
      "Owned the design and implementation of in-house AI agents and MCP servers to streamline engineering workflows.",
      "Led a cross-functional team of developers, establishing code quality standards, testing practices, and reliable release pipelines.",
      "Managed the full customer lifecycle architecture, including onboarding automation, scheduled jobs, and secure data migrations.",
    ],
  },
  {
    role: "Software Developer (Full Stack)",
    company: "PACE Group",
    meta: "March 2021 – July 2022",
    stack: "Vue.js · Laravel · PHP · MySQL · WebSockets · AWS",
    points: [
      "Responsible for end-to-end development of a multi-portal SaaS application featuring role-based access control.",
      "Owned the integration of real-time multi-user sessions and dynamic content delivery via WebSockets.",
      "Managed cloud infrastructure on AWS, overseeing deployment, scaling, and secure email delivery systems.",
      "Led the UI/UX design for mobile and tablet interfaces, creating responsive designs in Figma and Illustrator.",
    ],
  },
];

export default function Stats() {
  return (
    <section id="resume" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* Download Resume CTA (Hidden per request)
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-20 flex flex-col items-center gap-4 border-y border-stroke py-14 text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Get the full picture
          </p>
          <h3 className="mb-2 text-3xl tracking-tight text-text-primary md:text-4xl">
            Download my{" "}
            <span className="font-display italic">résumé</span>
          </h3>
          <p className="mb-6 max-w-sm text-sm text-muted">
            PDF, ATS-friendly.
          </p>

          <a
            href={RESUME.file}
            download={RESUME.downloadName}
            className="group relative inline-flex rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-text-primary px-8 py-4 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </span>
          </a>
        </motion.div>
        */}

        {/* Experience & Timeline */}
        <div className="relative">
          <SectionHeader
            eyebrow="Experience"
            title="My journey"
            italicWord="so far"
            subtext="A timeline of my professional roles, responsibilities, and the systems I've owned."
          />

          <div className="relative mt-20">
            {/* Vertical Timeline Line */}
            <div className="absolute bottom-0 left-[7px] top-4 w-px bg-stroke md:left-[9px]" />

            <div className="flex flex-col gap-16">
              {EXPERIENCE.map((job, i) => (
                <motion.div
                  key={job.company}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="relative pl-8 md:pl-16"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-[6px] h-4 w-4 rounded-full border-4 border-bg bg-text-primary transition-transform duration-300 hover:scale-125 md:left-[-2px] md:h-5 md:w-5" />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <h3 className="text-xl text-text-primary">{job.role}</h3>
                      <p className="mt-1 font-display text-3xl italic text-text-primary/80">
                        {job.company}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                        {job.meta}
                      </p>
                    </div>

                    <div className="md:col-span-8">
                      <p className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-[#89AACC]">
                        {job.stack}
                      </p>
                      <ul className="flex flex-col gap-4">
                        {job.points.map((p) => (
                          <li
                            key={p}
                            className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-text-primary/30"
                          >
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Education Node */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative pl-8 md:pl-16"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-[6px] h-4 w-4 rounded-full border-4 border-bg bg-stroke transition-transform duration-300 hover:scale-125 md:left-[-2px] md:h-5 md:w-5" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted">
                      Education
                    </span>
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="text-xl text-text-primary">
                      Bachelor of Engineering,{" "}
                      <span className="font-display italic">Computer Science</span>
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      University of Mumbai · Aug 2016 – Oct 2020
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Resume — closes the timeline: the whole story in one file */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative pl-8 md:pl-16"
              >
                <div className="absolute left-0 top-[6px] h-4 w-4 rounded-full border-4 border-bg bg-[#89AACC] transition-transform duration-300 hover:scale-125 md:left-[-2px] md:h-5 md:w-5" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted">
                      Full history
                    </span>
                  </div>
                  <div className="md:col-span-8">
                    <a
                      href={RESUME.file}
                      download={RESUME.downloadName}
                      className="cosmic-btn group relative inline-flex rounded-full transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <span
                        className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ inset: "-2px" }}
                      />
                      <span className="relative inline-flex items-center gap-2 rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Resume
                      </span>
                    </a>
                    <p className="mt-3 text-xs text-muted">
                      PDF, ATS-friendly.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
