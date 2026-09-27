"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { mono } from "./shared";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Every file below is quoted from the live site (trimmed, not invented). */
const STEPS = [
  {
    file: "robots.txt",
    title: "Invited in",
    body: "Search engines are allowed everywhere, and 14 AI crawlers are named one by one, because several of them won't crawl a site unless they're welcomed by name.",
    readers: ["Google", "Bing", "ChatGPT", "Perplexity", "Gemini", "Claude"],
    lines: [
      ["User-Agent: *", "Allow: /"],
      ["User-Agent: GPTBot", "Allow: /"],
      ["User-Agent: ClaudeBot", "Allow: /"],
      ["User-Agent: PerplexityBot", "Allow: /"],
      ["User-Agent: Google-Extended", "Allow: /"],
      ["Sitemap: https://promaxglobal.ae/sitemap.xml", ""],
    ],
  },
  {
    file: "sitemap.xml",
    title: "Every page listed",
    body: "Every page, generated from the same route map that builds the menu — so the sitemap can't miss a page or point at one that's gone.",
    readers: ["Google", "Bing"],
    lines: [
      ["<loc>https://promaxglobal.ae/</loc>", "priority 1"],
      ["<loc>…/about</loc>", "0.7"],
      ["<loc>…/portfolio</loc>", "0.7"],
      ["<loc>…/portfolio/ports-maritime-development</loc>", "0.7"],
      ["<loc>…/strategic-projects</loc>", "0.7"],
      ["… every page listed", ""],
    ],
  },
  {
    file: "<head>",
    title: "Each page describes itself",
    body: "Every page carries its own title, description, canonical address and a link-preview card, so it reads correctly in search results and looks right when shared on LinkedIn or WhatsApp.",
    readers: ["Google", "Bing", "LinkedIn", "WhatsApp"],
    lines: [
      ["<title>", "Ports & Maritime Development | Promax Global"],
      ['<meta name="description">', "Port and terminal management…"],
      ['<link rel="canonical">', "…/ports-maritime-development/"],
      ['<meta property="og:title">', "Ports & Maritime Development — Promax Global"],
      ['<meta property="og:image">', "preview card"],
    ],
  },
  {
    file: "JSON-LD",
    title: "Understood as a company",
    body: "Structured data tells search engines what the business is, not just what the page says: an Organization with its services, and a breadcrumb trail on every inner page.",
    readers: ["Google", "Gemini", "ChatGPT"],
    lines: [
      ['"@type": "Organization"', "name · logo · contact"],
      ['"@type": "WebSite"', "publisher → Organization"],
      ['"@type": "Service"', "Ports & Maritime Development"],
      ['"@type": "BreadcrumbList"', "Home › Portfolio › …"],
    ],
  },
  {
    file: "llms.txt",
    title: "Written for AI models",
    body: "A plain-language guide to the whole site that AI assistants can read in one request, generated from the same content as the pages so it never falls out of date.",
    readers: ["ChatGPT", "Perplexity", "Claude", "Gemini"],
    lines: [
      ["# Promax Global", ""],
      ["> Integrated Smart Port Ecosystems…", ""],
      ["## Portfolio — Divisions", ""],
      ["- [Ports & Maritime Development](…)", ""],
      ["- [Energy & Utilities](…)", ""],
      ["## Verticals", ""],
    ],
  },
];

const ALL_READERS = ["Google", "Bing", "ChatGPT", "Perplexity", "Gemini", "Claude", "LinkedIn", "WhatsApp"];

export default function FoundScroll() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: `+=${STEPS.length * 65}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
            if (bar.current) gsap.set(bar.current, { scaleY: self.progress });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const s = STEPS[step];

  return (
    <section ref={root} className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#070b10] px-6 py-24 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(58,163,40,0.08),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-pg-200/80">
              <span className="h-[2px] w-[60px] bg-pg-500" />
              SEO + GEO
            </p>
            <h2 className="font-display text-3xl italic leading-tight md:text-5xl">How the site gets found</h2>
          </div>
          {/* who reads this step */}
          <div className="flex max-w-md flex-wrap justify-end gap-1.5">
            {ALL_READERS.map((r) => {
              const on = s.readers.includes(r);
              return (
                <span
                  key={r}
                  className={`${mono} border px-2 py-1 transition-all duration-300 ${
                    on ? "border-pg-500 bg-pg-500/15 text-white" : "border-white/10 text-white/30"
                  }`}
                >
                  {r}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[0.9fr_1.2fr] md:gap-10">
          {/* the path */}
          <div className="relative">
            <div className="absolute bottom-2 left-[11px] top-2 w-px bg-white/10" />
            <div ref={bar} className="absolute bottom-2 left-[11px] top-2 w-px origin-top scale-y-0 bg-pg-500" />
            <ol className="relative space-y-1">
              {STEPS.map((x, k) => {
                const on = k === step;
                const done = k < step;
                return (
                  <li
                    key={x.file}
                    onClick={() => setStep(k)}
                    className="group flex cursor-pointer items-start gap-4 py-1.5 md:cursor-default"
                  >
                    <span
                      className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] transition-colors duration-300 ${
                        on ? "border-pg-500 bg-pg-500 text-white" : done ? "border-pg-500/60 bg-[#070b10] text-pg-200" : "border-white/15 bg-[#070b10] text-white/35"
                      }`}
                    >
                      {k + 1}
                    </span>
                    <div className="min-w-0">
                      <p className={`font-mono text-xs transition-colors ${on ? "text-pg-200" : "text-white/35"}`}>{x.file}</p>
                      <p className={`text-base transition-colors md:text-lg ${on ? "text-white" : "text-white/40 group-hover:text-white/70"}`}>{x.title}</p>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden pt-1 text-sm leading-relaxed text-muted"
                          >
                            {x.body}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* the file itself */}
          <div className="min-w-0 border border-white/10 bg-[#0b1016] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-[11px] text-white/45">promaxglobal.ae / {s.file}</span>
              <span className={`${mono} text-pg-200`}>
                {step + 1} / {STEPS.length}
              </span>
            </div>
            <div className="min-h-[220px] p-4 md:p-5">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {s.lines.map(([a, b], k) => (
                    <motion.p
                      key={k}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: k * 0.07, duration: 0.25 }}
                      className="flex justify-between gap-4 border-b border-white/[0.04] py-1.5 font-mono text-[11px] md:text-xs"
                    >
                      <span className="truncate text-white/75">{a}</span>
                      {b && <span className="shrink-0 truncate text-pg-200/90">{b}</span>}
                    </motion.p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
