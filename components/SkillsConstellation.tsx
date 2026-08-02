"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeader from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SKILLS = {
  "Core Languages": [
    { id: "ts", label: "TypeScript", icon: "typescript" },
    { id: "js", label: "JavaScript", icon: "javascript" },
    { id: "node", label: "Node.js", icon: "nodejs" },
    { id: "python", label: "Python", icon: "python" },
    { id: "php", label: "PHP", icon: "php" },
    { id: "html", label: "HTML5", icon: "html" },
    { id: "css", label: "CSS3", icon: "css" },
  ],
  Frameworks: [
    { id: "next", label: "Next.js", icon: "nextjs" },
    { id: "react", label: "React", icon: "react" },
    { id: "angular", label: "Angular", icon: "angular" },
    { id: "nest", label: "NestJS", icon: "nestjs" },
    { id: "vue", label: "Vue.js", icon: "vue" },
    { id: "express", label: "Express", icon: "express" },
    { id: "laravel", label: "Laravel", icon: "laravel" },
    { id: "tailwind", label: "Tailwind", icon: "tailwind" },
    { id: "framer", label: "Framer", icon: "framer" },
    { id: "threejs", label: "Three.js", icon: "threejs" },
  ],
  "Cloud & Data": [
    { id: "aws", label: "AWS", icon: "aws" },
    { id: "docker", label: "Docker", icon: "docker" },
    { id: "postgres", label: "PostgreSQL", icon: "postgres" },
    { id: "mysql", label: "MySQL", icon: "mysql" },
    { id: "redis", label: "Redis", icon: "redis" },
    { id: "mongodb", label: "MongoDB", icon: "mongodb" },
    { id: "nginx", label: "Nginx", icon: "nginx" },
    { id: "vercel", label: "Vercel", icon: "vercel" },
  ],
  "Tools & Platforms": [
    { id: "git", label: "Git", icon: "git" },
    { id: "github", label: "GitHub", icon: "github" },
    { id: "gitlab", label: "GitLab", icon: "gitlab" },
    { id: "figma", label: "Figma", icon: "figma" },
    { id: "postman", label: "Postman", icon: "postman" },
    { id: "linux", label: "Linux", icon: "linux" },
    { id: "vite", label: "Vite", icon: "vite" },
    { id: "webpack", label: "Webpack", icon: "webpack" },
  ],
};

function TechBadge({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="group relative inline-flex cursor-default rounded-full transition-transform duration-300 hover:scale-105">
      {/* Animated gradient border reveal on hover */}
      <span
        className="accent-gradient pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ inset: "-1px" }}
      />
      {/* Badge Content */}
      <span className="relative flex items-center gap-2 rounded-full border border-stroke bg-bg/50 px-4 py-2 transition-colors duration-300 group-hover:border-transparent">
        <img
          src={`https://skillicons.dev/icons?i=${icon}`}
          alt={label}
          className="h-5 w-5 shrink-0 object-contain"
          loading="lazy"
        />
        <span className="font-body text-sm font-medium text-text-primary">
          {label}
        </span>
      </span>
    </div>
  );
}

function ArsenalPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; label: string; icon: string }>;
}) {
  return (
    <div className="panel-item relative overflow-hidden rounded-3xl border border-stroke bg-surface p-6 md:p-8">
      {/* Ambient Halftone Texture - Top Right */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 opacity-10 mix-blend-screen transition-opacity duration-500 group-hover:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
          maskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 60%)",
        }}
      />

      <h3 className="mb-6 font-display text-3xl italic text-text-primary">
        {title}
      </h3>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <TechBadge key={item.id} label={item.label} icon={item.icon} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsConstellation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".panel-item", {
          scrollTrigger: {
            trigger: ".panels-container",
            start: "top 80%",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(".panel-item", {
          scrollTrigger: {
            trigger: ".panels-container",
            start: "top 80%",
          },
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power1.out",
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Cosmic Glow Background Element */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[80%] -translate-x-1/2 -translate-y-1/3 rounded-[100%] bg-[#89AACC]/5 blur-[120px]" />

      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="My Stack"
          title="Technology"
          italicWord="Arsenal"
          subtext="The foundational tools, languages, and frameworks I use to architect, build, and deploy enterprise-grade applications."
        />

        {/* The Bento Grid Container */}
        <div className="panels-container grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {Object.entries(SKILLS).map(([title, items]) => (
            <ArsenalPanel key={title} title={title} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}
