"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectArt from "./ProjectArt";

const ITEMS = [
  {
    head: "AI & Agentic",
    items: ["MCP Servers", "Claude Skills", "AI Agents"],
    rotate: -3,
  },
  {
    head: "Frameworks",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "Laravel",
      "React",
      "Next.js",
      "Angular",
      "Vue.js",
      "React Native",
      "Swift",
    ],
    rotate: 2,
  },
  {
    head: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "PHP", "SQL"],
    rotate: -2,
  },
  {
    head: "Databases",
    items: ["PostgreSQL", "Redis", "MySQL", "Drizzle", "Sequelize"],
    rotate: 3,
  },
  {
    head: "Architecture",
    items: [
      "Microservices",
      "Multi-Tenant SaaS",
      "Real-Time Systems",
      "API Design",
      "Security & Auth",
    ],
    rotate: -4,
  },
  {
    head: "Cloud & DevOps",
    items: [
      "AWS",
      "GCP",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Kafka",
      "CI/CD",
      "Observability",
    ],
    rotate: 2,
  },
];

const LEFT = ITEMS.filter((_, i) => i % 2 === 0);
const RIGHT = ITEMS.filter((_, i) => i % 2 === 1);

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      gsap.fromTo(
        leftRef.current,
        { y: 0 },
        {
          y: -220,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { y: 160 },
        {
          y: -320,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="toolkit"
      ref={sectionRef}
      className="relative min-h-[300vh] overflow-hidden"
    >
      {/* Layer 1 — pinned center */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Toolkit
          </span>
          <span className="h-px w-8 bg-stroke" />
        </div>

        <h2 className="mb-4 text-4xl leading-tight tracking-tight text-text-primary md:text-5xl lg:text-6xl">
          The <span className="font-display italic">stack</span>
        </h2>

        <p className="mb-8 max-w-sm text-sm text-muted md:text-base">
          What I reach for — backend systems, agentic tooling, and the
          infrastructure underneath.
        </p>

        <a
          href="https://github.com/MustafaPatharia"
          target="_blank"
          rel="noreferrer"
          className="group relative rounded-full"
        >
          <span
            className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ inset: "-2px" }}
          />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-3 text-sm text-text-primary transition-colors duration-300 group-hover:border-transparent">
            GitHub
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </span>
        </a>
      </div>

      {/* Layer 2 — parallax columns */}
      <div className="pointer-events-none absolute inset-0 z-20 flex justify-center">
        <div className="grid w-full max-w-[1400px] grid-cols-2 gap-12 px-6 md:gap-40 md:px-10">
          <div ref={leftRef} className="flex flex-col items-end gap-12 md:gap-24">
            {LEFT.map((item, i) => (
              <Card key={item.head} {...item} seed={i * 2} />
            ))}
          </div>
          <div
            ref={rightRef}
            className="flex flex-col items-start gap-12 md:gap-24"
          >
            {RIGHT.map((item, i) => (
              <Card key={item.head} {...item} seed={i * 2 + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  head,
  items,
  rotate,
  seed,
}: {
  head: string;
  items: string[];
  rotate: number;
  seed: number;
}) {
  return (
    <div
      style={{ "--r": `${rotate}deg` } as React.CSSProperties}
      className="group pointer-events-auto relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-stroke bg-surface transition-transform duration-500 [transform:rotate(var(--r))] hover:[transform:rotate(0deg)_scale(1.03)]"
    >
      <ProjectArt seed={seed} />

      <div className="relative flex h-full flex-col justify-end p-6">
        <h3 className="mb-3 font-display text-2xl italic text-white">{head}</h3>
        <div className="flex flex-wrap gap-1.5">
          {items.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] text-white/85 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
