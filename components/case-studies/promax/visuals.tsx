"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { mono } from "./shared";

const EASE = [0.16, 1, 0.3, 1] as const;

function useTicker(length: number, ms: number, paused = false) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, paused]);
  return [i, setI] as const;
}

/* ------------------------------------------------------ search-ready on every page */

const PAGES = [
  { name: "Ports & Maritime Development", path: "/portfolio/ports-maritime-development/" },
  { name: "Why Us", path: "/why-us/" },
  { name: "Strategic Projects", path: "/strategic-projects/" },
];

export function MetaTagsVisual() {
  const [i] = useTicker(PAGES.length, 3600);
  const p = PAGES[i];
  const lines = [
    { tag: "title", v: `${p.name} | Promax Global` },
    { tag: "meta description", v: "…written for this page" },
    { tag: "link canonical", v: `promaxglobal.ae${p.path}` },
    { tag: "og:title", v: `${p.name} — Promax Global` },
    { tag: "og:image", v: "link-preview card" },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={`${mono} border border-white/5 bg-black/40 p-3 leading-relaxed`}>
        <p className="text-white/35">&lt;head&gt;</p>
        <AnimatePresence mode="wait">
          <motion.div key={p.path}>
            {lines.map((l, k) => (
              <motion.p
                key={l.tag}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: k * 0.12, duration: 0.3 }}
                className="flex gap-2 truncate pl-3"
              >
                <span className="shrink-0 text-pg-200">{l.tag}</span>
                <span className="truncate text-white/60">{l.v}</span>
              </motion.p>
            ))}
          </motion.div>
        </AnimatePresence>
        <p className="text-white/35">&lt;/head&gt;</p>
      </div>
      {/* the link preview card that metadata produces */}
      <AnimatePresence mode="wait">
        <motion.div
          key={p.path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.35 }}
          className="flex overflow-hidden border border-white/10 bg-white/[0.03] transition-colors hover:border-pg-500/40"
        >
          <div className="w-16 shrink-0 bg-gradient-to-br from-pnavy-600 to-pnavy-900" />
          <div className="min-w-0 p-2.5">
            <p className={`${mono} text-white/35`}>promaxglobal.ae</p>
            <p className="truncate text-sm font-medium text-white">{p.name} — Promax Global</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------ readable by AI assistants */

const BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export function AiCrawlersVisual() {
  const [i] = useTicker(BOTS.length + 3, 650);
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={`${mono} border border-white/5 bg-black/40 p-3 leading-relaxed`}>
        <p className="text-white/35"># robots.txt</p>
        {BOTS.map((b, k) => (
          <motion.p key={b} animate={{ opacity: k <= i ? 1 : 0.15 }} className="flex justify-between gap-2 text-white/60">
            <span className="truncate">User-Agent: {b}</span>
            <span className="shrink-0 text-pg-200">Allow: /</span>
          </motion.p>
        ))}
        <p className="text-white/30">… 10+ AI crawlers named</p>
      </div>
      <div className={`${mono} flex items-center gap-2 border border-pg-500/25 bg-pg-500/[0.06] px-3 py-2 text-pg-100`}>
        <Check className="h-3 w-3 shrink-0 text-pg-500" />
        /llms.txt · a plain-language map of the site for AI models
      </div>
    </div>
  );
}

/* ------------------------------------------------------ understood as a company */

const HUB = { x: 50, y: 50 };
const NODES = [
  { id: "site", label: "WebSite", x: 22, y: 16 },
  { id: "svc1", label: "Service", x: 78, y: 16 },
  { id: "svc2", label: "Service", x: 78, y: 84 },
  { id: "crumb", label: "BreadcrumbList", x: 22, y: 84 },
];

export function EntityGraphVisual() {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [on, setOn] = useTicker(NODES.length, 1400);
  const still = useReducedMotion();

  // Draw in real pixels so every line lands exactly on its node at any width.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const px = (p: { x: number; y: number }) => ({ x: (p.x / 100) * size.w, y: (p.y / 100) * size.h });
  const hub = px(HUB);

  return (
    <div className="flex h-full flex-col gap-3">
      <div ref={box} className="relative h-48 w-full">
        {size.w > 0 && (
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden>
            {NODES.map((n, k) => {
              const end = px(n);
              const d = `M ${hub.x} ${hub.y} L ${end.x} ${end.y}`;
              const active = k === on;
              return (
                <g key={n.id}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth={1}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: k * 0.15, ease: EASE }}
                  />
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#3aa328"
                    strokeWidth={1.5}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ filter: "drop-shadow(0 0 4px rgba(58,163,40,0.7))" }}
                  />
                  {active && !still && (
                    <motion.circle
                      key={`pulse-${on}`}
                      r={3}
                      fill="#a8e6a0"
                      initial={{ cx: hub.x, cy: hub.y, opacity: 0 }}
                      animate={{ cx: end.x, cy: end.y, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.1, ease: "easeInOut" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        )}

        <span
          className={`${mono} absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-pgold-500/60 bg-pnavy-800 px-2.5 py-1 text-pgold-300 shadow-[0_0_24px_rgba(212,175,55,0.15)]`}
          style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
        >
          Organization
        </span>
        {NODES.map((n, k) => (
          <motion.button
            key={n.id}
            type="button"
            onMouseEnter={() => setOn(k)}
            onFocus={() => setOn(k)}
            animate={{ scale: k === on ? 1.06 : 1 }}
            className={`${mono} absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border px-2 py-1 transition-colors ${
              k === on ? "border-pg-500 bg-[#12301a] text-white" : "border-white/10 bg-[#0d1117] text-white/55 hover:text-white/80"
            }`}
            style={{ left: `${n.x}%`, top: `${n.y}%`, x: "-50%", y: "-50%" }}
          >
            {n.label}
          </motion.button>
        ))}
      </div>
      <p className={`${mono} text-white/40`}>JSON-LD on every page · Service on the sector pages</p>
    </div>
  );
}

/* ------------------------------------------------------ secure connection */

const HANDSHAKE = [
  { k: "http://", v: "301 → https://" },
  { k: "TLS", v: "1.3 · AES-256-GCM" },
  { k: "Protocol", v: "HTTP/2" },
  { k: "HSTS", v: "HTTPS-only, remembered" },
];

export function HandshakeVisual() {
  const [i] = useTicker(HANDSHAKE.length + 2, 900);
  const done = i >= HANDSHAKE.length;
  return (
    <div className="flex h-full min-h-[160px] flex-col justify-center gap-3">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ borderColor: done ? "#3aa328" : "rgba(255,255,255,0.15)" }}
          className="grid h-11 w-11 shrink-0 place-items-center border bg-white/[0.03]"
        >
          <Lock className={`h-4 w-4 transition-colors ${done ? "text-pg-500" : "text-white/40"}`} strokeWidth={1.8} />
        </motion.div>
        <span className="font-mono text-xs text-white/70">https://promaxglobal.ae</span>
      </div>
      <div className="space-y-1.5">
        {HANDSHAKE.map((h, k) => (
          <motion.div
            key={h.k}
            animate={{ opacity: k <= i ? 1 : 0.2, x: k <= i ? 0 : -6 }}
            transition={{ duration: 0.3 }}
            className={`${mono} flex justify-between gap-2 border-b border-white/5 pb-1`}
          >
            <span className="text-white/45">{h.k}</span>
            <span className="text-pg-200">{h.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ nothing to hack */

const SURFACE = ["Database", "Admin login", "Server-side code", "Plugins to patch", "Open API"];

export function NoAttackSurfaceVisual() {
  const [i] = useTicker(SURFACE.length + 2, 800);
  return (
    <div className="flex h-full min-h-[160px] flex-col justify-center gap-2">
      {SURFACE.map((s, k) => {
        const struck = k < i;
        return (
          <div key={s} className={`${mono} relative flex items-center justify-between border border-white/5 px-3 py-1.5`}>
            <span className={struck ? "text-white/30" : "text-white/70"}>{s}</span>
            <span className={struck ? "text-pg-200" : "text-white/20"}>{struck ? "none" : "…"}</span>
            <motion.span
              className="absolute left-3 right-14 top-1/2 h-px origin-left bg-white/40"
              animate={{ scaleX: struck ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
          </div>
        );
      })}
      <p className={`${mono} mt-1 text-white/40`}>Pre-built pages served from the edge</p>
    </div>
  );
}

/* ------------------------------------------------------ fast by default */

const MEDIA = [
  { k: "Video", before: 306, after: 58 },
  { k: "Images", before: 173, after: 19 },
  { k: "Total", before: 479, after: 77 },
];

export function FastVisual() {
  const [cut, setCut] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setCut((c) => !c), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full min-h-[160px] flex-col justify-center gap-3">
      {MEDIA.map((m) => (
        <div key={m.k} className="group/bar">
          <div className={`${mono} mb-1 flex justify-between text-white/45 transition-colors group-hover/bar:text-white`}>
            <span>{m.k}</span>
            <span className={cut ? "text-pg-200" : ""}>{cut ? m.after : m.before} MB</span>
          </div>
          <div className="h-2 bg-white/5">
            <motion.div
              className={`h-full ${m.k === "Total" ? "bg-pgold-500" : "bg-pg-500"}`}
              animate={{ width: `${((cut ? m.after : m.before) / 479) * 100}%` }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5">
        {["Brotli", "Edge cache", "HTTP/2"].map((c) => (
          <span key={c} className={`${mono} border border-white/10 px-2 py-0.5 text-white/55 transition-colors hover:border-pg-500/50 hover:text-pg-200`}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ new page in minutes */

const BLOCKS = [
  { type: "feature-cards", extra: "columns: 3", shape: "cards" },
  { type: "service-overlay", extra: "columns: 4", shape: "overlay" },
  { type: "overview", extra: "paragraphs: [...]", shape: "split" },
  { type: "service-freight", extra: "checklist: [...]", shape: "freight" },
  { type: "gallery", extra: "images: [...]", shape: "gallery" },
] as const;

function Wire({ shape }: { shape: (typeof BLOCKS)[number]["shape"] }) {
  const cell = "bg-white/[0.06] border border-white/10";
  if (shape === "cards")
    return (
      <div className="grid h-full grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${cell} flex flex-col gap-1 p-1.5`}>
            <span className="h-2 w-2 rounded-full border border-pg-500" />
            <span className="h-1 w-3/4 bg-white/25" />
            <span className="h-1 w-1/2 bg-white/10" />
          </div>
        ))}
      </div>
    );
  if (shape === "overlay")
    return (
      <div className="grid h-full grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative border border-white/10 bg-gradient-to-t from-pnavy-900 to-pnavy-500/40">
            <span className="absolute bottom-1.5 left-1.5 h-1 w-2/3 bg-white/40" />
          </div>
        ))}
      </div>
    );
  if (shape === "split")
    return (
      <div className="grid h-full grid-cols-[2fr_3fr] gap-2">
        <div className="border border-white/10 bg-gradient-to-br from-pnavy-600 to-pnavy-900" />
        <div className="flex flex-col justify-center gap-1.5">
          <span className="h-2 w-2/3 bg-white/30" />
          <span className="h-1 w-full bg-white/10" />
          <span className="h-1 w-5/6 bg-white/10" />
        </div>
      </div>
    );
  if (shape === "freight")
    return (
      <div className="grid h-full grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${cell} flex flex-col gap-1 p-1.5`}>
            <span className="h-1 w-2/3 bg-white/25" />
            {[0, 1, 2].map((j) => (
              <span key={j} className="flex items-center gap-1">
                <Check className="h-2 w-2 text-pg-500" />
                <span className="h-0.5 w-3/4 bg-white/10" />
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  return (
    <div className="grid h-full grid-cols-4 grid-rows-2 gap-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-gradient-to-br from-pnavy-600/70 to-pnavy-900" />
      ))}
    </div>
  );
}

export function PagesFromDataVisual() {
  const [i] = useTicker(BLOCKS.length, 2400);
  const b = BLOCKS[i];
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr] sm:items-start">
      <pre className={`${mono} overflow-hidden border border-white/5 bg-black/40 p-3 leading-relaxed text-white/50`}>
        <span className="text-white/35">// one content entry</span>
        {"\n"}blocks: [
        {"\n"}  {"{"}
        {"\n"}    type: <span className="text-pg-200">&quot;{b.type}&quot;</span>,
        {"\n"}    heading: &quot;…&quot;,
        {"\n"}    {b.extra},
        {"\n"}  {"}"},
        {"\n"}]
      </pre>
      <div className="relative min-h-[110px] border border-white/5 bg-[#0a0e13] p-2.5">
        <p className={`${mono} mb-2 text-white/35`}>becomes a finished section</p>
        <AnimatePresence mode="wait">
          <motion.div key={b.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="h-[76px]">
            <Wire shape={b.shape} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ ships on every push */

const PIPE = ["git push", "build", "rsync · SSH", "live"];

export function ShipVisual() {
  const [i] = useTicker(PIPE.length + 1, 1100);
  return (
    <div className="flex h-full min-h-[140px] flex-col justify-center gap-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        <motion.div
          className="absolute left-4 top-1/2 h-px -translate-y-1/2 bg-pg-500"
          animate={{ width: `${(Math.min(i, PIPE.length - 1) / (PIPE.length - 1)) * 92}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        {PIPE.map((s, k) => (
          <span
            key={s}
            className={`${mono} relative z-10 border px-2 py-1 transition-colors ${
              k <= i ? "border-pg-500/60 bg-[#0d1117] text-pg-100" : "border-white/10 bg-[#0d1117] text-white/40"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
      <p className={`${mono} text-white/40`}>GitHub Actions · static export · only changed files travel · SSH key held in repository secrets</p>
    </div>
  );
}

/* ------------------------------------------------------ draft: CMS revalidation */

export function CmsRevalidateVisual() {
  const [step] = useTicker(4, 1200);
  const rows = ["/insights", "/insights/<slug>"];
  return (
    <div className="flex h-full min-h-[150px] flex-col justify-center gap-3">
      <div className="flex items-center gap-3">
        <motion.span
          animate={{ scale: step === 0 ? 1.08 : 1, borderColor: step === 0 ? "#3aa328" : "rgba(255,255,255,0.15)" }}
          className={`${mono} border bg-white/[0.03] px-3 py-1.5 text-white/80`}
        >
          /admin · Save
        </motion.span>
        <span className="h-px flex-1 bg-white/10" />
        <span className={`${mono} text-white/40`}>afterChange</span>
      </div>
      {rows.map((r, k) => (
        <div key={r} className={`${mono} flex items-center justify-between border border-white/5 px-3 py-1.5`}>
          <span className="text-white/60">revalidatePath(&quot;{r}&quot;)</span>
          <motion.span animate={{ opacity: step > k ? 1 : 0.2 }} className="text-pg-200">
            fresh
          </motion.span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------ draft: RTL mirror */

export function RtlMirrorVisual() {
  const [rtl, setRtl] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setRtl((r) => !r), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full min-h-[150px] flex-col justify-center gap-3" dir="ltr">
      <div className={`${mono} flex justify-between text-white/45`}>
        <span>{rtl ? '/ar · dir="rtl"' : '/en · dir="ltr"'}</span>
        <span className="text-pg-200">hreflang en · ar · x-default</span>
      </div>
      <motion.div layout className={`flex gap-2 ${rtl ? "flex-row-reverse" : ""}`}>
        <motion.div layout className="w-1/3 border border-pg-500/40 bg-pg-500/10 p-2">
          <span className="block h-1.5 w-3/4 bg-white/40" />
          <span className="mt-1 block h-1 w-1/2 bg-white/15" />
        </motion.div>
        {[0, 1].map((i) => (
          <motion.div layout key={i} className="flex-1 border border-white/10 bg-gradient-to-t from-pnavy-900 to-pnavy-600/60" />
        ))}
      </motion.div>
      <p className={`${mono} text-white/40`}>Separate indexable URLs per language, the whole layout mirrored.</p>
    </div>
  );
}
