"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { CASE_STUDIES } from "@/lib/case-studies";
import {
  JOURNEY_LENGTH,
  RING_STEP,
  SCENES,
  SCENE_EVENT,
  jumpToScene,
  progress,
  onArrive,
  type SceneId,
} from "./journey";
import StarMap from "./StarMap";

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

/** `rail: false` drops the depth gauge on pages outside the journey. */
export default function JourneyNav({ scene: initial = "home", rail = true }: { scene?: SceneId; rail?: boolean }) {
  const router = useRouter();
  const [scene, setScene] = useState<string>(initial);
  const [open, setOpen] = useState(false);
  const [veil, setVeil] = useState(false);

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

  // Nav never shows a scroll through the journey: behind a cover it cuts the
  // scroll to the label if this page holds it (returning the label's time,
  // for `onArrive`); from anywhere else it enters the journey on home at
  // that label (`/#contact`) and returns null.
  const go = (id: string) => {
    const at = jumpToScene(id, true);
    if (at !== null) return at;
    router.push(id === "home" ? "/" : `/#${id}`);
    return null;
  };

  // Rail and "Say hi": a quick fade to dark hides the cut.
  const travel = (id: string) => {
    setOpen(false);
    setVeil(true);
    window.setTimeout(() => {
      const at = go(id);
      if (at !== null) onArrive(at, () => setVeil(false));
    }, 260);
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed right-4 top-4 z-[70] flex items-center gap-2 md:right-6 md:top-6"
      >
        <a
          href="/contact"
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

      {rail && <SceneRail scene={scene} onTravel={travel} />}

      <AnimatePresence>
        {open && <StarMap scene={scene} onTravel={go} onClose={() => setOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {veil && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[68] bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeIn" } }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Depth gauge down the right edge: one mark per scene, a tick per poster
 *  inside the work ring, and a fill that tracks the live scroll. */
function SceneRail({ scene, onTravel }: { scene: string; onTravel: (id: string) => void }) {
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current!;
    let last = -1;
    const draw = () => {
      if (progress.t === last) return;
      last = progress.t;
      fill.style.transform = `scaleY(${progress.t / JOURNEY_LENGTH})`;
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
