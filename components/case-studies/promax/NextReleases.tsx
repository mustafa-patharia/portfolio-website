"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heading, mono, reveal } from "./shared";
import { RELEASES } from "./releases";

/* ------------------------------------------------------------------ CMS */

const ROUTES = [
  { path: "/", file: "page.tsx", cms: false },
  { path: "/insights", file: "page.tsx", cms: false },
  { path: "/insights/[slug]", file: "page.cms.tsx", cms: true },
  { path: "/admin/[[...segments]]", file: "page.cms.tsx", cms: true },
  { path: "/api/[...slug]", file: "route.cms.ts", cms: true },
];

function BuildSplit() {
  const [target, setTarget] = useState<"server" | "export">("export");
  return (
    <div className="border border-white/[0.07] bg-[#0d1117] p-5 md:p-6">
      <div className="mb-4 flex gap-2">
        {(["server", "export"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTarget(t)}
            className={`${mono} border px-3 py-1.5 transition-all duration-300 hover:-translate-y-0.5 ${
              target === t ? "border-pg-500 bg-pg-500 text-white" : "border-white/10 text-white/55 hover:border-pg-500/50 hover:text-white"
            }`}
          >
            {t === "export" ? "STATIC_EXPORT=true" : "server build"}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {ROUTES.map((r) => {
          const dropped = target === "export" && r.cms;
          return (
            <motion.div
              key={r.path}
              animate={{ opacity: dropped ? 0.25 : 1, x: dropped ? 8 : 0 }}
              className={`${mono} flex items-center justify-between border px-3 py-2 ${dropped ? "border-white/5 line-through" : "border-white/10"}`}
            >
              <span className="text-white/75">{r.path}</span>
              <span className={r.cms ? "text-pgold-300" : "text-white/35"}>{r.file}</span>
            </motion.div>
          );
        })}
      </div>
      <p className={`${mono} mt-4 text-white/40`}>
        next.config registers the <span className="text-pgold-300">.cms.tsx</span> extension for server builds only.
      </p>
    </div>
  );
}

export function CmsSection() {
  if (!RELEASES.cms) return null;
  return (
    <section className="px-6 pb-32 md:px-10">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Heading ghost="Publish" label="Insights blog">
            Content management
          </Heading>
          <motion.ul {...reveal} className="mt-8 space-y-4 leading-relaxed text-muted">
            {[
              "Payload runs inside the same Next.js app — no second server. Editors sign in at /admin, and nothing on the public site links there.",
              "Pages read posts through Payload's local API, with no HTTP hop and no API keys. If the database can't be reached, the page renders empty instead of failing the build.",
              "Saving a post revalidates only the Insights pages it touches, so publishing is instant.",
              "Each article ships with Article structured data and Open Graph metadata, and the sitemap picks up new posts on its own.",
            ].map((t) => (
              <li key={t} className="group flex gap-3 transition-colors hover:text-white/85">
                <span className="mt-[0.55em] h-[2px] w-3 shrink-0 bg-pg-500 transition-all duration-300 group-hover:w-5" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div {...reveal}>
          <BuildSplit />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Arabic */

const GATE = [
  { k: "first visit", v: "browser language → /ar or /en" },
  { k: "switch", v: "swap only the locale segment" },
  { k: "remember", v: "cookie preference" },
  { k: "render", v: '<html lang dir="rtl">' },
];

export function ArabicSection() {
  const [rtl, setRtl] = useState(true);
  if (!RELEASES.arabic) return null;
  return (
    <section className="px-6 pb-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Heading ghost="عربي" label="English and Arabic">
          Arabic and right-to-left
        </Heading>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <motion.div {...reveal} className="border border-white/[0.07] bg-[#0d1117] p-5 md:p-6" dir="ltr">
            <div className="mb-4 flex items-center justify-between">
              <span className={`${mono} text-white/45`}>{rtl ? "/ar" : "/en"} · dir=&quot;{rtl ? "rtl" : "ltr"}&quot;</span>
              <button
                type="button"
                onClick={() => setRtl((r) => !r)}
                className={`${mono} border border-white/15 px-3 py-1.5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-pg-500/50 hover:text-white`}
              >
                EN | AR
              </button>
            </div>
            <motion.div layout className={`flex gap-3 ${rtl ? "flex-row-reverse text-right" : ""}`}>
              <motion.div layout className="flex-1 space-y-2">
                <span className="block h-3 w-4/5 bg-white/40" style={{ marginInlineStart: rtl ? "auto" : 0 }} />
                <span className="block h-1.5 w-full bg-white/15" />
                <span className="block h-1.5 w-2/3 bg-white/15" style={{ marginInlineStart: rtl ? "auto" : 0 }} />
                <span className="mt-3 block h-6 w-24 rounded-full bg-pg-500" style={{ marginInlineStart: rtl ? "auto" : 0 }} />
              </motion.div>
              <motion.div layout className="aspect-[4/5] w-2/5 bg-gradient-to-t from-pnavy-900 to-pnavy-600" />
            </motion.div>
            <p className={`${mono} mt-4 text-white/40`}>The header lockup stays pinned left-to-right in both languages; everything else mirrors.</p>
          </motion.div>

          <motion.div {...reveal} className="flex flex-col gap-px border border-white/10 bg-white/10">
            {GATE.map((g) => (
              <div key={g.k} className="group flex items-center justify-between gap-4 bg-[#0b1016] p-4 transition-colors hover:bg-[#101823]">
                <span className={`${mono} uppercase text-white/40 transition-colors group-hover:text-pg-200`}>{g.k}</span>
                <span className="font-mono text-xs text-white/75">{g.v}</span>
              </div>
            ))}
            <p className="bg-[#0b1016] p-4 text-sm leading-relaxed text-muted">
              Locales are real routes, so each language is server-rendered and indexable, with per-language metadata, hreflang en / ar / x-default and a
              sitemap that lists both.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
