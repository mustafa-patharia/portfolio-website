"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RELEASES, type Release } from "./releases";

type Point = { text: string; release?: Release };
type Role = { id: string; verb: string; line: string; points: Point[]; proof: string[]; release?: Release };

const ROLES: Role[] = [
  {
    id: "architected",
    verb: "Architected",
    line: "A site that grows without a rebuild.",
    points: [
      { text: "One route map drives the menu, the sitemap and every page, so a link can never point at a page that doesn't exist." },
      { text: "Pages are built from structured content rendered into twelve section types. Every page on the site came from the same system, and the next one is a content entry, not new code." },
      { text: "A three-level menu that deep-links straight into sections of each sector page." },
      { text: "Separate URLs per language (/en, /ar), so both are indexable, with the entire layout mirrored for right-to-left.", release: "arabic" },
    ],
    proof: ["Multi-page", "12 section types"],
  },
  {
    id: "optimised",
    verb: "Optimised",
    line: "Main content on screen in under a second.",
    points: [
      { text: "Largest Contentful Paint 0.7 s, zero blocking time and zero layout shift on Lighthouse, with Performance at 92." },
      { text: "Media cut by 84% in one pass: video from 306 to 58 MB, images from 173 to 19 MB." },
      { text: "Headlines are server-rendered, so they never wait on JavaScript to appear; compression and edge caching do the rest." },
    ],
    proof: ["Performance 92", "LCP 0.7 s"],
  },
  {
    id: "indexed",
    verb: "Indexed",
    line: "Found on Google, and quoted by AI assistants.",
    points: [
      { text: "A title, description, canonical address and link-preview card on every page, so each one ranks and shares correctly." },
      { text: "Structured data describing the company as an organisation with services, plus breadcrumb trails on every inner page." },
      { text: "14 AI crawlers welcomed by name and an llms.txt guide generated from the site's own content, so ChatGPT, Perplexity, Gemini and Claude can read and cite it." },
      { text: "Per-language metadata with hreflang, and a sitemap that lists both languages.", release: "arabic" },
    ],
    proof: ["SEO 100", "llms.txt"],
  },
  {
    id: "secured",
    verb: "Secured",
    line: "Secured hosting, watched around the clock.",
    points: [
      { text: "A fully pre-built static site: no database, no admin login and no server code for anyone to break into." },
      { text: "Served HTTPS-only over TLS 1.3 and HTTP/2, behind always-on edge protection and monitoring." },
      { text: "Deploys travel over SSH with a key held in repository secrets — never a password, never an open upload." },
      { text: "Best Practices scores 100 on Lighthouse." },
    ],
    proof: ["TLS 1.3", "Best Practices 100"],
  },
  {
    id: "integrated",
    verb: "Integrated",
    release: "cms",
    line: "A blog editor, without a second server.",
    points: [
      { text: "Payload CMS inside the same Next.js app: editors publish from /admin, which nothing on the public site links to." },
      { text: "Saving a post refreshes only the pages it touches, so publishing is instant." },
      { text: "The public site stays a static build; the editor only runs where it's needed." },
    ],
    proof: ["Payload CMS", "instant publish"],
  },
  {
    id: "shipped",
    verb: "Shipped",
    line: "From an empty repository to live, and stayed until it was done.",
    points: [
      { text: "Every push to main builds the site and deploys it automatically; rsync sends only the files that changed." },
      { text: "Worked every review round with the client through to launch." },
      { text: "Every commit on the project is mine." },
    ],
    proof: ["CI/CD", "live"],
  },
];

const live = (r?: Release) => !r || RELEASES[r];

export default function Roles() {
  const roles = ROLES.filter((r) => live(r.release));
  const [active, setActive] = useState(roles[0].id);
  const role = roles.find((r) => r.id === active)!;
  const points = role.points.filter((p) => live(p.release));

  return (
    <div>
      {/* a nav bar, like the site's own header */}
      <div role="tablist" aria-label="What I owned on this project" className="flex flex-wrap border-b border-white/10">
        {roles.map((r) => {
          const on = r.id === active;
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(r.id)}
              onMouseEnter={() => setActive(r.id)}
              className={`group relative px-3 py-3 font-sans text-base font-semibold transition-colors md:px-5 md:text-lg ${
                on ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
            >
              {r.verb}
              {on && <motion.span layoutId="pg-role-bar" className="absolute inset-x-0 -bottom-px h-[2px] bg-pg-500" transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
              <span className="absolute inset-x-3 -bottom-px h-[2px] origin-left scale-x-0 bg-white/20 transition-transform duration-300 group-hover:scale-x-100 md:inset-x-5" />
            </button>
          );
        })}
      </div>

      {/* panel with the gold arc that runs around the active card on the live site */}
      <div className="relative mt-6 p-px">
        <div className="pg-gold-run pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative min-h-[340px] overflow-hidden bg-[#0d1117] p-6 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pg-500/10 blur-3xl" />
          <AnimatePresence mode="wait">
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative grid gap-8 lg:grid-cols-[1fr_1.5fr]"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-pg-200/80">{role.verb}</p>
                <h3 className="mt-3 font-display text-3xl italic leading-snug text-white md:text-4xl">{role.line}</h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {role.proof.map((a) => (
                    <span key={a} className="border border-pgold-500/35 bg-pgold-500/[0.06] px-3 py-1 font-mono text-[11px] text-pgold-300">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="space-y-4">
                {points.map((p, k) => (
                  <motion.li
                    key={p.text}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + k * 0.07 }}
                    className="group/pt flex gap-3 leading-relaxed text-muted transition-colors hover:text-white/85"
                  >
                    <span className="mt-[0.55em] h-[2px] w-3 shrink-0 bg-pg-500 transition-all duration-300 group-hover/pt:w-5" />
                    {p.text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
