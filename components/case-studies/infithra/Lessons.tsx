"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { reveal } from "./shared";

/* What I would do differently: my own design choices, told as general lessons. */
const LESSONS = [
  {
    t: "Split services by need, not by module",
    then: "Services split by module",
    now: "Modular monolith, split by need",
    d: "I split the backend into services by business module early on. Most of them did the same create, read, update and delete work, so the split added network calls and deployment overhead with little benefit, and the services stayed tightly coupled: one often could not finish its work without another. Next time I would start with a modular monolith and separate only what truly needs independence, such as PDF generation, schedulers, reporting and analytics, each designed to keep working when a dependency is unavailable.",
  },
  {
    t: "A schema per tenant, not a database per tenant",
    then: "Database per tenant",
    now: "Schema per tenant",
    d: "A separate database for every client made isolation simple, but connection management grew with every new client: each database needed its own credentials and connection pool, in every service. A schema per tenant in a shared database would have kept isolation strong while keeping connection pooling, migrations and day-to-day operations far simpler.",
  },
  {
    t: "Own the authentication layer",
    then: "Third-party identity provider",
    now: "In-house authentication",
    d: "A third-party identity provider got sign-in working quickly, but multi-tenant rules, such as one person across several clients and access granted in stages, meant working around the provider rather than with it. When identity is this central to the product, I would build authentication in-house.",
  },
  {
    t: "Components with one job",
    then: "One component for every case",
    now: "Small, composable components",
    d: "Some frontend components tried to handle every possible combination of options in one place, and each new case made them harder to change. Smaller components, each with one clear purpose and combined as needed, would have been easier to maintain and extend.",
  },
  {
    t: "More structure from the framework and data layer",
    then: "Minimal framework, general ORM",
    now: "Opinionated framework, type-safe ORM",
    d: "An opinionated backend framework such as NestJS would have given the codebase stronger structure and consistent validation out of the box, and a type-safe ORM such as Drizzle would have been a better fit for multi-tenant data access.",
  },
];

export default function Lessons() {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-white/10">
      {LESSONS.map((l, k) => {
        const on = open === k;
        return (
          <motion.div key={l.t} {...reveal} transition={{ ...reveal.transition, delay: k * 0.05 }} className="border-b border-white/10">
            <button
              onClick={() => setOpen(on ? -1 : k)}
              aria-expanded={on}
              className={`group grid w-full items-center gap-3 py-6 text-left transition-colors duration-300 md:grid-cols-[3rem_1fr_auto_1.5rem] md:gap-8 ${on ? "bg-inf-600/[0.06]" : "hover:bg-inf-600/[0.04]"}`}
            >
              <span className={`font-mono text-sm transition-colors ${on ? "text-ipink-300" : "text-white/30 group-hover:text-ipink-300"}`}>{String(k + 1).padStart(2, "0")}</span>
              <h3 className={`text-lg font-medium text-white transition-transform duration-300 ${on ? "translate-x-1" : "group-hover:translate-x-1"}`}>{l.t}</h3>
              <span className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-white/45 line-through decoration-white/25">{l.then}</span>
                <ArrowRight className={`h-3.5 w-3.5 transition-colors ${on ? "text-ipink-400" : "text-white/30"}`} />
                <span className={`rounded-full border px-2.5 py-1 transition-colors duration-300 ${on ? "border-ipink-500/60 bg-ipink-500/10 text-ipink-200" : "border-inf-400/30 text-inf-100"}`}>{l.now}</span>
              </span>
              <ChevronDown className={`hidden h-4 w-4 text-white/40 transition-transform duration-300 md:block ${on ? "rotate-180 text-ipink-300" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-7 leading-relaxed text-muted md:pl-[5rem]">{l.d}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
