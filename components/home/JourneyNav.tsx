"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { CASE_STUDIES } from "@/lib/case-studies";
import { RESUME } from "@/lib/resumes";
import {
  JOURNEY_LENGTH,
  RING_STEP,
  SCENES,
  SCENE_EVENT,
  jumpToScene,
  progress,
} from "./journey";

// Home navigation for a site you travel through rather than scroll: two
// controls in the top-right corner, a depth gauge down the right edge that
// shows where you are, and a star map behind "Menu" for longer jumps.

const pad = (n: number) => String(n).padStart(2, "0");
const WORK_AT = SCENES.find((s) => s.id === "work")!.at;
const RING_TICKS = Array.from({ length: CASE_STUDIES.length - 1 }, (_, k) => ({
  label: `work-${k + 1}`,
  at: WORK_AT + (k + 1) * RING_STEP,
  title: CASE_STUDIES[k + 1].title.split(" — ")[0],
}));

const LINKS = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Résumé", href: RESUME.file, download: RESUME.downloadName },
  { label: "Email", href: "mailto:patharia52@gmail.com" },
  { label: "GitHub", href: "https://github.com/mustafa-patharia", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/mustafa-patharia", external: true },
];

export default function JourneyNav() {
  const [scene, setScene] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScene = (e: Event) => setScene((e as CustomEvent<string>).detail);
    window.addEventListener(SCENE_EVENT, onScene);
    return () => window.removeEventListener(SCENE_EVENT, onScene);
  }, []);

  // The journey is the page's scroll, so the map holds it still while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Swallow scroll input rather than hiding overflow: dropping the
    // scrollbar would resize the pinned stage under ScrollTrigger.
    const hold = (e: Event) => e.preventDefault();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", hold, { passive: false });
    window.addEventListener("touchmove", hold, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", hold);
      window.removeEventListener("touchmove", hold);
    };
  }, [open]);

  const travel = (id: string) => {
    setOpen(false);
    jumpToScene(id);
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed right-4 top-4 z-[70] flex items-center gap-2 md:right-6 md:top-6"
      >
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            travel("contact");
          }}
          className="group relative rounded-full"
        >
          <span
            className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ inset: "-2px" }}
          />
          <span className="relative flex items-center gap-1 rounded-full border border-white/10 bg-surface/80 px-4 py-2 text-sm text-text-primary backdrop-blur-md">
            Say hi
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </span>
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="star-map"
          onClick={() => setOpen((o) => !o)}
          className="group flex items-center gap-3 rounded-full border border-white/10 bg-surface/80 py-2 pl-4 pr-3 text-sm text-text-primary backdrop-blur-md transition-colors duration-300 hover:border-[#89AACC]/50"
        >
          <span className="relative block h-4 overflow-hidden leading-4">
            <span
              className={`block transition-transform duration-500 ${open ? "-translate-y-4" : ""}`}
            >
              <span className="block">Menu</span>
              <span className="block">Close</span>
            </span>
          </span>
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0.5 group-hover:w-3"}`}
            />
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`}
            />
          </span>
        </button>
      </nav>

      <SceneRail scene={scene} onTravel={travel} />

      <AnimatePresence>
        {open && <StarMap scene={scene} onTravel={travel} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/** Depth gauge down the right edge: one mark per scene, a tick per poster
 *  inside the work ring, and a fill that tracks the live scroll. */
function SceneRail({ scene, onTravel }: { scene: string; onTravel: (id: string) => void }) {
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = -1;
    const draw = () => {
      if (progress.t === last) return;
      last = progress.t;
      fillRef.current!.style.transform = `scaleY(${progress.t / JOURNEY_LENGTH})`;
    };
    gsap.ticker.add(draw);
    return () => gsap.ticker.remove(draw);
  }, []);

  return (
    <nav
      aria-label="Scenes"
      className="fixed right-3 top-1/2 z-[60] h-[46vh] -translate-y-1/2 md:right-7 md:h-[52vh]"
    >
      <span className="absolute inset-y-0 right-[5px] w-px bg-white/10" />
      <span
        ref={fillRef}
        className="absolute inset-y-0 right-[5px] w-px origin-top"
        style={{ transform: "scaleY(0)", background: "linear-gradient(180deg,#89AACC,#4E85BF)" }}
      />

      {RING_TICKS.map((t) => (
        <button
          key={t.label}
          type="button"
          aria-label={`Work: ${t.title}`}
          onClick={() => onTravel(t.label)}
          className="group absolute right-0 flex h-3 w-6 -translate-y-1/2 items-center justify-end"
          style={{ top: `${(t.at / JOURNEY_LENGTH) * 100}%` }}
        >
          <span className="mr-[3px] h-px w-[5px] bg-white/25 transition-all duration-300 group-hover:w-2.5 group-hover:bg-[#89AACC]" />
        </button>
      ))}

      {SCENES.map((s, i) => {
        const active = s.id === scene;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onTravel(s.id)}
            aria-label={`${pad(i + 1)} ${s.title}`}
            aria-current={active ? "step" : undefined}
            className="group absolute right-0 flex -translate-y-1/2 items-center gap-3"
            style={{ top: `${(s.at / JOURNEY_LENGTH) * 100}%` }}
          >
            <span
              className={`pointer-events-none hidden whitespace-nowrap text-xs transition-all duration-300 md:block ${
                active
                  ? "translate-x-0 text-text-primary opacity-100"
                  : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              <span className="mr-2 font-display italic text-muted">{pad(i + 1)}</span>
              {s.title}
            </span>
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  active ? "scale-100 bg-[#4E85BF]/30 shadow-[0_0_12px_2px_rgba(78,133,191,0.7)]" : "scale-0"
                }`}
              />
              <span
                className={`relative rounded-full transition-all duration-300 ${
                  active
                    ? "h-1.5 w-1.5 bg-text-primary"
                    : "h-1 w-1 bg-white/40 group-hover:h-1.5 group-hover:w-1.5 group-hover:bg-[#89AACC]"
                }`}
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** Full-screen map: the scenes as stars on one orbit, plus everything that
 *  isn't a scene. Picking a star closes the map and flies there. */
function StarMap({
  scene,
  onTravel,
  onClose,
}: {
  scene: string;
  onTravel: (id: string) => void;
  onClose: () => void;
}) {
  // Stars sit on a shallow arch across the screen (desktop).
  const stars = SCENES.map((s, i) => {
    const u = i / (SCENES.length - 1);
    return { ...s, i, x: 10 + u * 80, y: 58 - Math.sin(u * Math.PI) * 22 };
  });
  const path = stars.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

  return (
    <motion.nav
      id="star-map"
      aria-label="Site map"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[65] overflow-y-auto bg-bg/85 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        exit={{ scale: 1.1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 45%, rgba(78,133,191,0.14), transparent 70%)",
        }}
      />

      {/* Desktop: stars on an orbit */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <motion.path
            d={path}
            fill="none"
            stroke="url(#orbit)"
            strokeWidth="0.15"
            strokeDasharray="0.6 0.8"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          />
          <defs>
            <linearGradient id="orbit" x1="0" x2="1">
              <stop offset="0" stopColor="#89AACC" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#89AACC" stopOpacity="0.8" />
              <stop offset="1" stopColor="#4E85BF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {stars.map((s) => {
          const active = s.id === scene;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onTravel(s.id)}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, delay: 0.25 + s.i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span className="font-display text-sm italic text-muted">{pad(s.i + 1)}</span>
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    active
                      ? "bg-[#4E85BF]/30 shadow-[0_0_24px_6px_rgba(78,133,191,0.6)]"
                      : "scale-50 bg-[#4E85BF]/0 group-hover:scale-100 group-hover:bg-[#4E85BF]/25 group-hover:shadow-[0_0_20px_4px_rgba(78,133,191,0.5)]"
                  }`}
                />
                <span
                  className={`relative rounded-full bg-text-primary transition-all duration-300 ${
                    active ? "h-2.5 w-2.5" : "h-1.5 w-1.5 group-hover:h-2.5 group-hover:w-2.5"
                  }`}
                />
              </span>
              <span
                className={`whitespace-nowrap font-display text-3xl italic transition-all duration-300 lg:text-4xl ${
                  active ? "text-text-primary" : "text-muted group-hover:-translate-y-1 group-hover:text-text-primary"
                }`}
              >
                {s.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: the same stars down a vertical orbit */}
      <div className="relative flex min-h-full flex-col justify-center px-8 pb-40 pt-24 md:hidden">
        <span className="absolute bottom-40 left-[2.35rem] top-24 w-px bg-gradient-to-b from-[#89AACC]/0 via-[#89AACC]/50 to-[#4E85BF]/0" />
        {stars.map((s) => {
          const active = s.id === scene;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onTravel(s.id)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + s.i * 0.06 }}
              className="relative flex items-center gap-5 py-3 text-left"
            >
              <span
                className={`relative z-10 rounded-full bg-text-primary ${
                  active ? "h-2.5 w-2.5 shadow-[0_0_16px_4px_rgba(78,133,191,0.7)]" : "ml-0.5 h-1.5 w-1.5 opacity-60"
                }`}
              />
              <span className="font-display text-sm italic text-muted">{pad(s.i + 1)}</span>
              <span className={`font-display text-4xl italic ${active ? "text-text-primary" : "text-muted"}`}>
                {s.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed inset-x-0 bottom-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 text-sm md:bottom-12"
      >
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.download ? { download: l.download } : {})}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group relative inline-flex items-center gap-1 text-muted transition-colors duration-300 hover:text-text-primary"
            >
              {l.label}
              <span
                aria-hidden
                className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
              <span className="accent-gradient absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </motion.ul>
    </motion.nav>
  );
}
