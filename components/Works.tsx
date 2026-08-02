"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Cover from "./Cover";
import Link from "next/link";

const PROJECTS = [
  {
    title: "HRMS Platform",
    kicker: "infithra",
    stack: "Node.js · Angular · Next.js · AWS · PostgreSQL · Redis",
    blurb:
      "Led and built from scratch — payroll, employee management, leave and attendance across fully configurable modules. Multi-tenant, UAE Labour Law compliant, thousands of daily users.",
    href: "/case-study/infithra",
    span: "md:col-span-12",
    aspect: "aspect-[4/3] md:aspect-[21/9]",
    mark: "in",
    slug: "infithra",
  },
  // {
  //   title: "SmartScan",
  //   kicker: "SaaS · Mobile · ERP Integration",
  //   stack: "React Native · NestJS · Drizzle · NetSuite REST · AWS",
  //   blurb:
  //     "Custom SaaS platform with a handheld warehouse app — barcode and RFID scanning on Urovo devices, real-time stock, two-way NetSuite sync. Owned the infrastructure setup end to end.",
  //   span: "md:col-span-5",
  //   mark: "ss",
  //   slug: "smartscan",
  // },
  // {
  //   title: "Promax Global",
  //   kicker: "Website Development",
  //   stack: "Node.js · Express · MySQL · React · GCP",
  //   blurb:
  //     "Corporate website on a custom content platform — multilingual content, role-based publishing, and built-in search-engine optimization.",
  //   span: "md:col-span-5",
  //   mark: "pg",
  //   slug: "promax-global",
  // },
  // {
  //   title: "Odoo–NetSuite POS",
  //   kicker: "Systems Integration",
  //   stack: "Python · Odoo ORM · REST API",
  //   blurb:
  //     "An add-on keeping point-of-sale invoices and payments in sync with the finance system automatically, mapping records by configurable rules.",
  //   span: "md:col-span-7",
  //   mark: "po",
  //   slug: "odoo-netsuite-pos",
  // },
  // {
  //   title: "n8n PO Workflow",
  //   kicker: "Email → NetSuite Automation",
  //   stack: "n8n · NetSuite API · Webhooks",
  //   blurb:
  //     "An automation pipeline that reads inbound purchase-order emails, extracts and validates line items, and files them into NetSuite without manual entry.",
  //   span: "md:col-span-12",
  //   aspect: "aspect-[4/3] md:aspect-[24/7]",
  //   mark: "n8n",
  //   slug: "n8n-po-workflow",
  // },
];

export default function Works() {
  return (
    <section id="work" className="py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Enterprise"
          title="Enterprise"
          italicWord="projects"
          subtext="Production-grade platforms architected and shipped for companies."
          action={{
            label: "GitHub",
            href: "https://github.com/MustafaPatharia",
          }}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {PROJECTS.map((p, i) => {
            const isInternal = p.href?.startsWith("/");
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: (i % 2) * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface ${p.aspect ?? "aspect-[4/3] md:aspect-[16/11]"
                  } ${p.span}`}
              >
                {isInternal ? (
                  <Link href={p.href} className="block h-full w-full">
                    <CardContent p={p} i={i} />
                  </Link>
                ) : (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full w-full"
                  >
                    <CardContent p={p} i={i} />
                  </a>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CardContent({
  p,
  i,
}: {
  p: (typeof PROJECTS)[number];
  i: number;
}) {
  return (
    <>
      <Cover
        dir="/projects"
        slug={p.slug}
        seed={i}
        label={p.mark}
        alt={p.title}
      />

      <div className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />

      {/* Resting state */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-500 group-hover:opacity-0 md:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">
          {p.kicker}
        </p>
        <h3 className="font-display text-3xl italic text-white md:text-4xl">
          {p.title}
        </h3>
      </div>

      {/* Hover state */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-bg/70 p-6 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          {p.stack}
        </p>
        <p className="max-w-md text-sm text-text-primary md:text-base">
          {p.blurb}
        </p>
        <span className="relative inline-flex w-fit rounded-full p-[2px]">
          <span className="accent-gradient-animated absolute inset-0 rounded-full" />
          <span className="relative rounded-full bg-white px-5 py-2.5 text-sm text-black">
            View Case Study —{" "}
            <span className="font-display italic">{p.kicker}</span>
          </span>
        </span>
      </div>
    </>
  );
}

