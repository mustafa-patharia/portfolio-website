"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SHOTS = [
  {
    id: "about",
    slot: -2,
    name: "About",
    src: "/projects/promax/mobile/about.jpg",
    alt: "About page on a phone: city skyline hero with the heading over a light wash",
    text: "Full-width imagery with the heading kept readable at every screen size.",
  },
  {
    id: "ports",
    slot: -1,
    name: "Portfolio page",
    src: "/projects/promax/mobile/ports.jpg",
    alt: "Ports and Maritime Development page on a phone with a video hero",
    text: "Each sector page is built from the same content system, so all of them behave the same on a phone.",
  },
  {
    id: "home",
    slot: 0,
    name: "Home",
    src: "/projects/promax/mobile/home.jpg",
    alt: "Home page on a phone: headline over a looping globe video",
    text: "The headline is on screen immediately. On a phone the copy takes the full width and the background sits behind it.",
  },
  {
    id: "whyus",
    slot: 1,
    name: "Why Us",
    src: "/projects/promax/mobile/whyus.jpg",
    alt: "Why Us page on a phone with a navy gradient hero",
    text: "Lightweight headers on text-led pages keep them quick to load on mobile data.",
  },
  {
    id: "reach",
    slot: 2,
    name: "Reach Us",
    src: "/projects/promax/mobile/reachus.jpg",
    alt: "Reach Us page on a phone with a container-yard video hero",
    text: "One clear page for getting in touch, readable at a glance on any phone.",
  },
] as const;

const X = { "-2": -120, "-1": -62, "0": 0, "1": 62, "2": 120 } as const;
const ROT = { "-2": -11, "-1": -5.5, "0": 0, "1": 5.5, "2": 11 } as const;
const SCALE = { "-2": 0.82, "-1": 0.91, "0": 1, "1": 0.91, "2": 0.82 } as const;

export default function MobileFan() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("home");
  const shot = SHOTS.find((s) => s.id === active)!;

  // The deck starts stacked and fans open as it scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-fan]").forEach((el) => {
          const s = el.dataset.fan as keyof typeof X;
          gsap.fromTo(
            el,
            { xPercent: 0, rotate: 0, scale: 0.86, yPercent: 8 },
            {
              xPercent: X[s],
              rotate: ROT[s],
              scale: SCALE[s],
              yPercent: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 30%", scrub: 0.6 },
            }
          );
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-fan]").forEach((el) => {
          const s = el.dataset.fan as keyof typeof X;
          gsap.set(el, { xPercent: X[s], rotate: ROT[s], scale: SCALE[s] });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="overflow-x-clip">
      <div className="relative mx-auto flex h-[320px] items-end justify-center sm:h-[440px] md:h-[580px]">
        {SHOTS.map((s) => {
          const on = s.id === active;
          return (
            <div
              key={s.id}
              data-fan={String(s.slot)}
              className="absolute bottom-6 w-[122px] sm:w-[176px] md:w-[236px]"
              style={{ zIndex: on ? 30 : 10 - Math.abs(s.slot), transformOrigin: "50% 100%" }}
            >
              <motion.button
                type="button"
                aria-label={s.name}
                aria-pressed={on}
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onClick={() => setActive(s.id)}
                animate={{ y: on ? -26 : 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="block w-full cursor-pointer outline-none"
              >
                <div
                  className={`overflow-hidden rounded-[1.3rem] border-[5px] border-[#1a1f26] bg-[#1a1f26] transition-all duration-300 md:rounded-[1.7rem] md:border-[6px] ${
                    on
                      ? "shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(212,175,55,0.7),0_0_44px_rgba(58,163,40,0.35)]"
                      : "shadow-[0_20px_50px_rgba(0,0,0,0.6)] brightness-[0.55] hover:brightness-90"
                  }`}
                >
                  <img src={s.src} alt={s.alt} className="block w-full rounded-[0.9rem] md:rounded-[1.2rem]" loading="lazy" draggable={false} />
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {SHOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            onMouseEnter={() => setActive(s.id)}
            className={`border px-3 py-1 font-mono text-[11px] transition-all duration-300 hover:-translate-y-0.5 ${
              s.id === active ? "border-pg-500 bg-pg-500 text-white" : "border-white/10 text-white/50 hover:border-pg-500/50 hover:text-white"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 min-h-[110px] max-w-2xl text-center">
        <AnimatePresence mode="wait">
          <motion.div key={shot.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <h3 className="text-2xl font-medium text-white">{shot.name}</h3>
            <p className="mt-3 leading-relaxed text-muted">{shot.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
