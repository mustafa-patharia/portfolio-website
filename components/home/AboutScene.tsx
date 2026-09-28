"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import OrbitField from "./OrbitField";

gsap.registerPlugin(SplitText, useGSAP);

// One block per scroll beat, after the quote's two halves: who, what, how.
const BLOCKS = [
  "I'm somewhere between the cockpit and the engine room, as much at home shaping what people see and steer as working on the machinery that keeps everything moving. Curiosity brought me into this work, and it still decides where I go next, usually toward the part of a system nobody has explained to me yet.",
  "Good software disappears into someone's day and simply works. That's what I build: the tools people open first thing in the morning and trust with work that can't go wrong, made end to end, from the interface they touch to the systems quietly running beneath it.",
  "I follow a problem as far as it takes to understand it. If I know half a system, I push until I know nearly all of it. If I'm starting from nothing, I dig in until it's familiar ground. The edge cases, the details, the way one layer shapes another: that's where I find what can work better, and I keep returning to it until it does.",
];

// Out of the void after the dive, an astronaut drifts in and holds while the
// quote lands in two beats and the blocks step through beside him. The
// stage scrubs `.about-astro`, `.about-wa`/`.about-wb` (quote words),
// `.about-block` and `.about-pip`; this component splits the words and runs
// the idle drift.
export default function AboutScene() {
  const rootRef = useRef<HTMLElement>(null);

  // Cursor tilt, sprung so the astronaut turns lazily, as if weightless.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [10, -10]);
  const shiftX = useTransform(sx, [-1, 1], [-18, 18]);

  // Runs before the stage builds its timeline (child effects fire first), so
  // the word spans exist when the stage looks them up.
  useGSAP(
    () => {
      SplitText.create(".about-ha", { type: "words", wordsClass: "about-wa" });
      SplitText.create(".about-hb", { type: "words", wordsClass: "about-wb" });
      gsap.to(".about-float", {
        y: -16,
        rotation: 3,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="about"
      data-scene="about"
      aria-label="About"
      ref={rootRef}
      onPointerMove={(e) => {
        px.set((e.clientX / window.innerWidth) * 2 - 1);
        py.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden px-6"
    >
      <OrbitField />
      {/* Above the drifting objects so nothing crosses the astronaut or the
          text; it takes no pointer events, so grabs fall through to them. */}
      <div className="pointer-events-none relative z-10 grid w-full max-w-6xl items-center gap-4 pt-16 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:pt-0">
        <div className="about-astro relative mx-auto w-[46vw] max-w-[200px] md:w-full md:max-w-[480px]">
          <div className="about-float" style={{ perspective: 900 }}>
            <motion.div style={{ rotateX, rotateY, x: shiftX }}>
              <Image
                src="/personal/astronaut.png"
                alt="Mustafa as an astronaut, floating in space while working on a laptop"
                width={1024}
                height={1024}
                loading="eager"
                sizes="(max-width: 768px) 46vw, 480px"
                className="h-auto w-full select-none drop-shadow-[0_0_60px_rgba(78,133,191,0.35)]"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>

        <div className="about-copy flex flex-col items-center text-center md:items-start md:text-left">
          <blockquote className="mb-8 md:mb-10">
            <p className="font-display text-2xl italic leading-[1.1] text-text-primary sm:text-3xl md:text-4xl">
              <span className="about-ha">We shall not cease from exploration,</span>{" "}
              <span className="about-hb">
                and the end of all our exploring will be to arrive where we
                started and know the place for the first time.
              </span>
            </p>
            <footer className="mt-4 text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
              T.S. Eliot
            </footer>
          </blockquote>

          {/* Blocks share one grid cell, so the slot is as tall as the
              longest and nothing below it jumps between beats. */}
          <div className="grid w-full max-w-lg">
            {BLOCKS.map((body) => (
              <p
                key={body}
                className="about-block invisible text-[15px] leading-relaxed text-text-primary/85 opacity-0 [grid-area:1/1] md:text-lg"
              >
                {body}
              </p>
            ))}
          </div>

          <div aria-hidden className="mt-8 flex gap-2">
            {BLOCKS.map((body) => (
              <span key={body} className="relative h-px w-8 overflow-hidden bg-stroke">
                <span className="about-pip accent-gradient absolute inset-0 origin-left scale-x-0" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
