"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroScene from "./HeroScene";
import PlaceholderScene from "./PlaceholderScene";
import WorkScene from "./WorkScene";
import { CASE_STUDIES } from "@/lib/case-studies";
import {
  JOURNEY_LENGTH,
  SCENES,
  dive,
  ring,
  progress,
  RING_STEP,
  jumpToScene,
  SCENE_EVENT,
  setJourneyJump,
} from "./journey";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORK_COUNT = CASE_STUDIES.length;

/**
 * One viewport pinned for the whole home page. Scroll scrubs a single master
 * timeline whose time unit is one screen-height of scroll, so each scene's
 * `at` value is both its timeline label and its scroll position.
 */
export default function Stage({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scene = (id: string) => `[data-scene="${id}"]`;
      let current = "";

      gsap.set(`[data-scene]:not(${scene("home")})`, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: `+=${JOURNEY_LENGTH * 100}%`,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: "labels",
            inertia: false, // velocity projection flings fast flicks past whole scenes
            duration: { min: 0.4, max: 1.2 },
            delay: 0.15,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const t = self.progress * JOURNEY_LENGTH;
            progress.t = t;
            const i = SCENES.filter((s) => s.at <= t + 0.3).length - 1;
            const id = SCENES[i].id;
            if (id === current) return;
            current = id;
            window.dispatchEvent(new CustomEvent(SCENE_EVENT, { detail: id }));
          },
        },
      });

      SCENES.forEach((s) => tl.addLabel(s.id, s.at));

      // Transition 1 — the dive. Copy falls back into depth, the half-hidden
      // black hole slides down to centre in full, the camera flies through its
      // horizon into the void, and About surfaces out of the dark.
      tl.to(".hero-copy", { scale: 0.75, autoAlpha: 0, filter: "blur(14px)", duration: 0.45, ease: "power2.in" }, 0.35)
        .to(".hero-cue", { autoAlpha: 0, duration: 0.2 }, 0.3)
        .to(dive, { center: 1, duration: 0.6, ease: "power2.inOut" }, 0.2)
        .to(dive, { zoom: 1, duration: 0.62, ease: "power1.in" }, 0.7)
        .set(scene("home"), { autoAlpha: 0 }, 1.36)
        .fromTo(
          scene("about"),
          { autoAlpha: 0, scale: 0.6, filter: "blur(12px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.22, ease: "power2.out" },
          1.36
        );

      // Transition 2 — the ring forms. About falls past the camera while the
      // seven posters fly in from depth and take their places around you.
      const work = SCENES.find((s) => s.id === "work")!.at;
      tl.to(scene("about"), { scale: 1.6, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, work - 0.5)
        .set(scene("work"), { autoAlpha: 1 }, work - 0.4)
        .fromTo(ring, { form: 0 }, { form: 1, duration: 0.4 }, work - 0.4)
        .fromTo(".work-chrome", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, work - 0.2);

      // Inside the ring: each step turns it one poster and is its own snap point.
      for (let k = 1; k < WORK_COUNT; k++) {
        const at = work + k * RING_STEP;
        tl.to(ring, { turn: k, duration: RING_STEP * 0.8, ease: "power1.inOut" }, at - RING_STEP * 0.8)
          .addLabel(`work-${k}`, at);
      }

      // Remaining transitions — placeholder depth fly-through until each
      // scene gets its bespoke one (turn sideways, corridor, wormhole).
      SCENES.slice(3).forEach((s, i) => {
        const prev = SCENES[i + 2];
        tl.to(scene(prev.id), { scale: 1.6, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, s.at - 0.5)
          .fromTo(scene(s.id), { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, s.at - 0.3);
      });

      setJourneyJump((id) => {
        const st = tl.scrollTrigger;
        if (!st || !(id in tl.labels)) return false;
        window.scrollTo({ top: st.labelToScroll(id), behavior: "smooth" });
        return true;
      });

      return () => setJourneyJump(null);
    },
    { scope: rootRef }
  );

  // Layout shifts while the loader holds the page; re-measure once it's gone.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  // Outer wrapper keeps ScrollTrigger's pin-spacer inside this component, so
  // React's sibling bookkeeping in the page never points at a moved node.
  return (
    <div>
      <div
        ref={rootRef}
        className="journey relative h-screen w-full overflow-hidden"
        onClick={(e) => {
          const link = (e.target as HTMLElement).closest<HTMLElement>("[data-journey]");
          if (!link) return;
          e.preventDefault();
          jumpToScene(link.dataset.journey!);
        }}
      >
        <HeroScene ready={ready} />
        {SCENES.slice(1).map((s, i) =>
          s.id === "work" ? (
            <WorkScene key={s.id} />
          ) : (
            <PlaceholderScene key={s.id} id={s.id} index={i + 1} title={s.title} note={s.note} />
          )
        )}
      </div>
    </div>
  );
}
