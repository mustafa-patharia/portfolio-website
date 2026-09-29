"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { CASE_STUDIES } from "@/lib/case-studies";
import { ring } from "./journey";

// The seven case studies stand on a ring around the camera. The camera sits
// inside the ring, just behind its centre, so the front poster faces you and
// its neighbours curve away past the edges of the screen. Scroll (via `ring`)
// flies the posters in from depth, then turns the ring one poster per step.

const COUNT = CASE_STUDIES.length;
const STEP = 360 / COUNT;
const shortTitle = (t: string) => t.split(" — ")[0];

// Dither mask three card-widths wide: opaque, a grainy ramp to clear, clear.
// Sliding it across a side card dissolves its outer edge into grain.
function dissolveMask(flip: boolean) {
  const cw = 512, w = cw * 3, h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let x = 0; x < w; x++) {
    const t = gsap.utils.clamp(0, 1, (x - cw) / cw);
    const keep = 1 - t * t * (3 - 2 * t);
    const col = flip ? w - 1 - x : x;
    for (let y = 0; y < h; y++) {
      img.data[(y * w + col) * 4 + 3] = Math.random() < keep ? 255 : 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return `url(${c.toDataURL()})`;
}

// Fine film grain laid over the side cards.
function grainTile() {
  const n = 160;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(n, n);
  for (let i = 0; i < n * n; i++) {
    const v = Math.random() * 255;
    img.data.set([v, v, v, 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);
  return `url(${c.toDataURL()})`;
}

export default function WorkScene() {
  const ringRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const grainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ringEl = ringRef.current!;
    const viewEl = viewRef.current!;
    const masks = { right: dissolveMask(false), left: dissolveMask(true) };
    const grain = grainTile();
    grainRefs.current.forEach((g) => g && (g.style.backgroundImage = grain));
    let w = 0;
    const size = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      w = Math.min(vw < 768 ? vw * 0.78 : Math.min(vw * 0.46, 680), (vh * 0.5) / 0.75);
      const el = ringEl;
      el.style.width = `${w}px`;
      el.style.height = `${w * 0.75}px`;
      el.style.marginLeft = `${-w / 2}px`;
      el.style.marginTop = `${(-w * 0.75) / 2}px`;
      viewEl.style.perspective = `${w * 1.5}px`;
      last = "";
    };

    let last = "";
    let current = 0;
    const render = () => {
      const { form, turn } = ring;
      const key = `${form.toFixed(4)}|${turn.toFixed(4)}`;
      if (key === last) return;
      last = key;

      const radius = w * 1.25;
      // Ring centre sits ahead of the camera, so the camera is inside the ring.
      ringEl.style.transform = `translateZ(${w}px) rotateY(${turn * STEP}deg)`;
      // Stars slide the way the camera turns, a step's width per poster.
      document.documentElement.style.setProperty("--sky-x", `${-turn * w * 0.6}px`);

      for (let i = 0; i < COUNT; i++) {
        const slot = slotRefs.current[i];
        if (!slot) continue;
        // Posters arrive nearest-first as the ring forms.
        const reach = Math.min(i, COUNT - i);
        const f = gsap.utils.clamp(0, 1, (form - reach * 0.12) / 0.64);
        const fly = 1 - gsap.parseEase("power3.out")(f);
        // Signed distance from the front, in posters: > 0 is to the right.
        const side = ((((i - turn) % COUNT) + COUNT + COUNT / 2) % COUNT) - COUNT / 2;
        const rel = Math.abs(side);
        const near = Math.min(rel, 1);
        const deg = rel * STEP;
        const visible = gsap.utils.clamp(0, 1, 1 - (deg - 70) / 30);
        // Neighbours stand a little shorter and fainter than the front poster.
        slot.style.transform = `rotateY(${-i * STEP}deg) translateZ(${-(radius + fly * 2400)}px) scale(${1 - 0.04 * near}, ${1 - 0.14 * near})`;
        slot.style.opacity = String(f * visible * (1 - 0.45 * near));
        slot.style.visibility = f * visible < 0.01 ? "hidden" : "visible";
        slot.style.pointerEvents = rel < 0.5 && f > 0.9 ? "auto" : "none";

        // Outer edge dissolves into grain as a poster turns away, and
        // resolves back to a clean image as it turns to the front.
        const reachIn = Math.min(rel, 1.3) * 0.42;
        if (rel < 0.02) {
          slot.style.maskImage = slot.style.webkitMaskImage = "none";
        } else {
          const right = side > 0;
          const mask = right ? masks.right : masks.left;
          const pos = `${(right ? reachIn : 1 - reachIn) * 100}% 0`;
          slot.style.maskImage = slot.style.webkitMaskImage = mask;
          slot.style.maskSize = slot.style.webkitMaskSize = "300% 256px";
          slot.style.maskRepeat = slot.style.webkitMaskRepeat = "repeat-y";
          slot.style.maskPosition = slot.style.webkitMaskPosition = pos;
        }

        const shade = shadeRefs.current[i];
        if (shade) shade.style.opacity = String(Math.min(0.5, rel * 0.5));
        const g = grainRefs.current[i];
        if (g) g.style.opacity = String(Math.min(0.35, near * 0.35));
      }

      const next = ((Math.round(turn) % COUNT) + COUNT) % COUNT;
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    size();
    render();
    window.addEventListener("resize", size);
    gsap.ticker.add(render);
    return () => {
      window.removeEventListener("resize", size);
      gsap.ticker.remove(render);
      document.documentElement.style.removeProperty("--sky-x");
    };
  }, []);

  const study = CASE_STUDIES[active];

  return (
    <section
      id="work"
      data-scene="work"
      aria-label="Selected work"
      className="absolute inset-0 overflow-hidden"
    >
      <div
        ref={viewRef}
        className="absolute inset-0"
        style={{ perspectiveOrigin: "50% 44%" }}
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-[44%]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {CASE_STUDIES.map((c, i) => (
            <div
              key={c.slug}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Link
                href={`/case-study/${c.slug}`}
                aria-label={`Read the ${shortTitle(c.title)} case study`}
                tabIndex={i === active ? 0 : -1}
                className="group relative block h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 hover:border-[#89AACC]/60 hover:shadow-[0_30px_90px_-10px_rgba(78,133,191,0.55)]"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 78vw, 680px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  ref={(el) => {
                    shadeRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute inset-0 bg-bg"
                />
                <div
                  ref={(el) => {
                    grainRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay"
                  style={{ backgroundSize: "160px 160px" }}
                />
                <span className="pointer-events-none absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-text-primary text-bg opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  &#8599;
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="work-chrome pointer-events-none absolute inset-x-0 top-24 flex flex-col items-center gap-2 text-center md:top-28">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
          Selected work
        </span>
        <span className="font-display italic text-muted">
          <span className="text-2xl text-text-primary">{String(active + 1).padStart(2, "0")}</span>
          <span className="text-sm"> / {String(COUNT).padStart(2, "0")}</span>
        </span>
      </div>

      <div className="work-chrome absolute inset-x-0 bottom-10 flex justify-center px-6 md:bottom-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={study.slug}
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex max-w-xl flex-col items-center gap-3 text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted sm:text-xs">
              {study.kicker}
            </span>
            <h2 className="font-display text-4xl italic leading-none text-text-primary md:text-5xl">
              {shortTitle(study.title)}
            </h2>
            <Link
              href={`/case-study/${study.slug}`}
              className="group mt-1 inline-flex items-center gap-2 text-sm text-text-primary"
            >
              <span className="relative">
                Read the case study
                <span className="accent-gradient absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                &#8599;
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
