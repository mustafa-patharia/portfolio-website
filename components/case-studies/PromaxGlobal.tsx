"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, Search, Sparkles } from "lucide-react";
import FoundScroll from "./promax/FoundScroll";
import Lighthouse, { Ring } from "./promax/Lighthouse";
import MobileFan from "./promax/MobileFan";
import Roles from "./promax/Roles";
import { ArabicSection, CmsSection } from "./promax/NextReleases";
import { RELEASES } from "./promax/releases";
import { DotField, EASE, Heading, Label, Tile, reveal } from "./promax/shared";
import {
  AiCrawlersVisual,
  CmsRevalidateVisual,
  EntityGraphVisual,
  FastVisual,
  HandshakeVisual,
  MetaTagsVisual,
  NoAttackSurfaceVisual,
  PagesFromDataVisual,
  RtlMirrorVisual,
  ShipVisual,
} from "./promax/visuals";

/* ------------------------------------------------------------------ content */

const META = [
  { k: "Role", v: "Freelancer · end-to-end ownership" },
  { k: "Client", v: "InnovateNex, for Promax Global" },
  { k: "Timeline", v: "Jul – Sep 2026 · live" },
  { k: "Scope", v: "Multi-page site · SEO + GEO · hosting & deploy" },
];

const HERO_SCORES = [
  { label: "Performance", n: 92 },
  { label: "Accessibility", n: 93 },
  { label: "Best Practices", n: 100 },
  { label: "SEO", n: 100 },
];

const OUTCOMES = [
  { t: "Modern", d: "A fresh, premium look across every page and every screen size.", icon: Sparkles },
  { t: "Structured", d: "Content organised around the company's vision: sectors, services, projects and a clear route to getting in touch.", icon: LayoutGrid },
  { t: "Found", d: "Built from day one to rank on Google and be cited by AI assistants.", icon: Search },
];

const STACK = [
  { layer: "Framework", items: ["Next.js", "React", "TypeScript", "Static export"] },
  { layer: "Front end", items: ["Tailwind CSS", "GSAP", "Motion"] },
  { layer: "Search", items: ["JSON-LD", "llms.txt", "robots.txt", "sitemap.xml", "Open Graph"] },
  {
    layer: "Hosting & delivery",
    items: ["Edge CDN", "TLS 1.3", "GitHub Actions", "rsync over SSH", ...(RELEASES.cms ? ["Payload CMS"] : [])],
  },
];

/* --------------------------------------------------------------- hero bits */

function Kinetic({ text, highlight, className }: { text: string; highlight: string[]; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-word]", { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
  return (
    <h1 ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word className={`inline-block ${highlight.includes(w) ? "text-pg-500" : ""}`}>
              {w}
            </span>
          </span>
        </Fragment>
      ))}
    </h1>
  );
}

/* --------------------------------------------------------------------- page */

export default function PromaxGlobalCaseStudy() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="selection:bg-pg-500 selection:text-white">
        {/* ============================================================ HERO */}
        <section className="relative overflow-hidden px-6 pb-24 pt-36 md:px-10 lg:pt-44">
          <DotField className="opacity-[0.12] [mask-image:radial-gradient(ellipse_at_30%_30%,black,transparent_70%)]" />
          <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-pnavy-600/40 blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-pg-500/15 blur-[120px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                  <Label>Case study · Corporate website</Label>
                </motion.div>
                <Kinetic
                  text="Promax Global"
                  highlight={["Global"]}
                  className="font-display text-6xl italic leading-[0.95] tracking-tight md:text-7xl xl:text-8xl"
                />
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: EASE }}>
                  <p className="mt-4 text-2xl font-light text-white/80 md:text-4xl">
                    A corporate website built to be <span className="text-pg-200">modern, trusted and fast.</span>
                  </p>
                  <p className="mt-6 max-w-2xl leading-relaxed text-muted md:text-lg">
                    I built a multi-page corporate website for a group operating across ports, infrastructure and national development. It
                    ranks on Google, can be read and cited by ChatGPT, Perplexity, Gemini, Claude and many other AI agents and LLMs, loads
                    its main content in under a second, and runs on a secured hosting platform with round-the-clock security and monitoring.
                  </p>
                  <a
                    href="https://promaxglobal.ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex items-center gap-2 rounded-full border border-pg-500/60 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-pg-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pg-500 hover:text-white"
                  >
                    Visit promaxglobal.ae
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              </div>

              {/* Lighthouse at a glance */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
                className="relative p-px"
              >
                <div aria-hidden className="pg-gold-run pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative bg-[#0d1117] p-6">
                  <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Lighthouse · live site</p>
                  <div className="grid grid-cols-4 gap-2">
                    {HERO_SCORES.map((s, k) => (
                      <Ring key={s.label} label={s.label} n={s.n} delay={0.5 + k * 0.1} size="sm" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.dl
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mt-14 grid grid-cols-1 gap-px border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {META.map((m) => (
                <div key={m.k} className="group bg-bg/90 p-5 transition-colors duration-300 hover:bg-[#0d1117]">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 transition-colors group-hover:text-pg-200">{m.k}</dt>
                  <dd className="mt-2 text-sm text-white/85">{m.v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* ============================================================ NEEDS */}
        <section className="px-6 py-24 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Heading ghost="Brief" label="The project" className="mb-10">
              Project brief
            </Heading>

            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
              <motion.div {...reveal} className="space-y-5 leading-relaxed text-muted md:text-lg">
                <p>
                  Promax Global needed its website rebuilt from the ground up. The old site no longer reflected where the company was heading.
                  It needed to look modern, be structured around the company&apos;s vision and its sectors, and work as hard for the business as
                  the team does: easy to find, quick to load, safe to run.
                </p>
                <p>
                  InnovateNex brought me in as a freelancer to deliver it. I took the existing content, restructured it around the
                  company&apos;s portfolio, and rebuilt the whole site on a modern stack. I stayed with the client until it was live.
                </p>
                <p>
                  The project was also my introduction to Generative Engine Optimisation (GEO). Implementing it showed me how search is
                  changing: visibility now depends not only on ranking in Google, but on being understood and cited by AI assistants.
                </p>
              </motion.div>

              <div className="grid gap-px self-start border border-white/[0.07] bg-white/[0.07]">
                {OUTCOMES.map((o, k) => (
                  <motion.div
                    key={o.t}
                    {...reveal}
                    transition={{ ...reveal.transition, delay: k * 0.1 }}
                    className="group relative flex gap-4 bg-[#0d1117] p-5 transition-colors duration-300 hover:bg-[#101823] md:p-6"
                  >
                    <span className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-pg-500 transition-transform duration-300 group-hover:scale-y-100" />
                    <span className="grid h-9 w-9 shrink-0 place-items-center border border-pg-500/40 bg-pg-500/10 transition-transform duration-300 group-hover:-rotate-6">
                      <o.icon className="h-4 w-4 text-pg-500" strokeWidth={1.6} />
                    </span>
                    <span>
                      <span className="block text-lg font-medium text-white transition-colors group-hover:text-pg-200">{o.t}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{o.d}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ SIGNATURE: how the site gets found (pinned) */}
        <FoundScroll />

        {/* ============================================================ LIGHTHOUSE */}
        <section className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Heading ghost="Speed" label="Lighthouse report" className="mb-10">
              Performance
            </Heading>
            <Lighthouse />
          </div>
        </section>

        {/* ============================================================ BENTO */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Heading ghost="Built" label="Under the hood" className="mb-10">
              Technical implementation
            </Heading>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
              <Tile
                title="Search-ready on every page"
                caption="Each page has a unique title, description, canonical URL and link-preview card."
                className="md:col-span-2"
              >
                <MetaTagsVisual />
              </Tile>
              <Tile title="Readable by AI assistants" caption="AI crawlers are permitted by name, and an llms.txt guide describes the site to them." className="md:col-span-2">
                <AiCrawlersVisual />
              </Tile>
              <Tile title="Understood as a company" caption="Structured data describes the business, its services and each page's position in the site." className="md:col-span-2">
                <EntityGraphVisual />
              </Tile>
              <Tile title="Secure connection" caption="Served exclusively over HTTPS with TLS 1.3, with round-the-clock protection and monitoring.">
                <HandshakeVisual />
              </Tile>
              <Tile title="Nothing to hack" caption="A fully pre-built site, with no back end exposed to attack.">
                <NoAttackSurfaceVisual />
              </Tile>
              <Tile title="Fast by default" caption="I reduced media weight by 84% and configured compression and edge caching." className="md:col-span-2">
                <FastVisual />
              </Tile>
              <Tile title="New page in minutes" caption="I built a content system that generates finished pages from structured entries; every page on the site is produced by it." className="md:col-span-2">
                <PagesFromDataVisual />
              </Tile>
              <Tile
                title="Ships on every push"
                caption="I configured continuous deployment: every change to the main branch is built and deployed automatically."
                className={RELEASES.cms || RELEASES.arabic ? "md:col-span-2" : "md:col-span-4"}
              >
                <ShipVisual />
              </Tile>
              {RELEASES.cms && (
                <Tile title="Editor saves, page updates" caption="Publishing a post refreshes only the pages it affects.">
                  <CmsRevalidateVisual />
                </Tile>
              )}
              {RELEASES.arabic && (
                <Tile title="English and Arabic" caption="Right-to-left layout with its own indexable URLs.">
                  <RtlMirrorVisual />
                </Tile>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ MOBILE */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Heading ghost="Mobile" label="Responsive" className="mb-6 text-center">
              Mobile-friendly
            </Heading>
            <MobileFan />
          </div>
        </section>

        {/* ============================================================ NEXT RELEASES (hidden until live) */}
        <CmsSection />
        <ArabicSection />

        {/* ============================================================ ROLES */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Heading ghost="Owned" label="Ownership" className="mb-8">
              What I owned
            </Heading>
            <motion.div {...reveal}>
              <Roles />
            </motion.div>
          </div>
        </section>

        {/* ============================================================ STACK + NEXT */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal}>
              <Label>Stack</Label>
            </motion.div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((g) => (
                <motion.div key={g.layer} {...reveal}>
                  <h3 className="mb-3 text-sm font-medium text-white">{g.layer}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((i) => (
                      <span
                        key={i}
                        className="cursor-default border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-pg-500/60 hover:text-pg-200"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div {...reveal} className="mx-auto mt-24 max-w-6xl">
            <Link
              href="/case-studies"
              className="group flex items-center justify-between border border-white/10 p-8 transition-all duration-300 hover:border-pg-500/60 hover:bg-pg-500/[0.04] md:p-10"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Keep reading</span>
                <span className="mt-2 block font-display text-3xl italic md:text-4xl">All case studies</span>
              </span>
              <ArrowUpRight className="h-8 w-8 text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-pg-500" />
            </Link>
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}
