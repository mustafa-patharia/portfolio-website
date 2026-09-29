"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroScene from "./HeroScene";
import PlaceholderScene from "./PlaceholderScene";
import AboutScene from "./AboutScene";
import WorkScene from "./WorkScene";
import ContactScene from "./ContactScene";
import { CASE_STUDIES } from "@/lib/case-studies";
import {
  JOURNEY_LENGTH,
  SCENES,
  dive,
  ring,
  progress,
  RING_STEP,
  ABOUT_STEP,
  jumpToScene,
  SCENE_EVENT,
  setJourneyJump,
  playhead,
  type SceneId,
} from "./journey";

gsap.registerPlugin(ScrollTrigger, useGSAP);
// A solo page mounts one scene, but the timeline still names every scene's targets.
gsap.config({ nullTargetWarn: false });

const WORK_COUNT = CASE_STUDIES.length;
const LAST = SCENES[SCENES.length - 1].id;

/** Scroll with no animation in any browser (some ignore `behavior: "instant"`
 *  and fall back to CSS smooth scrolling), then sync ScrollTrigger now. */
function cut(top: number) {
  const html = document.documentElement;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  html.style.removeProperty("scroll-behavior");
  ScrollTrigger.update();
}

/**
 * One viewport pinned for the whole home page. Scroll scrubs a single master
 * timeline whose time unit is one screen-height of scroll, so each scene's
 * `at` value is both its timeline label and its scroll position.
 *
 * `solo` mounts a single scene on its own page from the same timeline: its
 * arrival from the journey plays as the entrance, then scroll scrubs only
 * that scene's own beats.
 */
export default function Stage({ ready, solo }: { ready: boolean; solo?: Exclude<SceneId, "home"> }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const scene = (id: string) => `[data-scene="${id}"]`;
      let current = "";

      // Module state outlives a client-side route change; start clean.
      Object.assign(dive, { center: 0, zoom: 0 });
      Object.assign(ring, { form: 0, turn: 0 });
      progress.t = playhead.t = 0;

      gsap.set(`[data-scene]:not(${scene("home")})`, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        ...(solo
          ? { paused: true, onUpdate: () => void (progress.t = playhead.t = tl.time()) }
          : { scrollTrigger: homeTrigger(), onUpdate: () => void (playhead.t = tl.time()) }),
      });

      function homeTrigger(): ScrollTrigger.Vars {
        return {
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
        };
      }

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
        )
        // The astronaut drifts in out of the dark and the quote's first
        // half lights up word by word, settled by the About label.
        .fromTo(
          ".about-astro",
          { x: "-12vw", y: "10vh", scale: 0.35, rotation: -28, filter: "blur(10px)" },
          { x: 0, y: 0, scale: 1, rotation: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
          1.36
        )
        .fromTo(".about-orb", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(1.6)", stagger: { amount: 0.25, from: "random" } }, 1.45)
        .fromTo(".about-copy", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, 1.45)
        .fromTo(".about-wa", { opacity: 0.1 }, { opacity: 1, duration: 0.1, stagger: { amount: 0.25 } }, 1.6);

      // Inside About the astronaut holds while each beat is its own snap
      // point: the rest of the quote, then one block at a time.
      const about = SCENES.find((s) => s.id === "about")!.at;
      tl.fromTo(".about-wb", { opacity: 0.1 }, { opacity: 1, duration: 0.1, stagger: { amount: ABOUT_STEP * 0.55 } }, about + ABOUT_STEP * 0.15)
        .addLabel("about-1", about + ABOUT_STEP);
      const blocks = gsap.utils.toArray<HTMLElement>(".about-block", rootRef.current);
      const pips = gsap.utils.toArray<HTMLElement>(".about-pip", rootRef.current);
      blocks.forEach((block, k) => {
        const at = about + (k + 2) * ABOUT_STEP;
        if (k > 0) {
          tl.to(blocks[k - 1], { autoAlpha: 0, y: -16, filter: "blur(6px)", duration: ABOUT_STEP * 0.35, ease: "power2.in" }, at - ABOUT_STEP * 0.85);
        }
        tl.fromTo(block, { autoAlpha: 0, y: 16, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: ABOUT_STEP * 0.45, ease: "power2.out" }, at - ABOUT_STEP * 0.5)
          .to(pips[k], { scaleX: 1, duration: ABOUT_STEP * 0.45 }, at - ABOUT_STEP * 0.5)
          .addLabel(`about-${k + 2}`, at);
      });

      // Transition 2 — the ring forms. About falls past the camera while the
      // seven posters fly in from depth and take their places around you.
      const work = SCENES.find((s) => s.id === "work")!.at;
      tl.to(".about-astro", { x: "-30vw", y: "-8vh", rotation: -18, duration: 0.3, ease: "power2.in" }, work - 0.5)
        .to(scene("about"), { scale: 1.6, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, work - 0.5)
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

      // Open Channel — still inside the hole: the copy and form rise in.
      const contact = SCENES.find((s) => s.id === "contact")!.at;
      tl.fromTo(".contact-rise", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out", stagger: 0.06, immediateRender: false }, contact - 0.2);

      if (!solo) {
        setJourneyJump((id, instant) => {
          const st = tl.scrollTrigger;
          if (!st || !(id in tl.labels)) return null;
          const top = st.labelToScroll(id);
          if (instant) cut(top);
          else window.scrollTo({ top, behavior: "smooth" });
          return tl.labels[id];
        });
        return () => setJourneyJump(null);
      }

      // Solo: the scene's own beats (`about-1`…, `work-1`…) are the only
      // scroll; everything else about the timeline is shared with home.
      const at = SCENES.find((s) => s.id === solo)!.at;
      const beats = Object.entries(tl.labels)
        .filter(([k]) => k.startsWith(`${solo}-`))
        .map(([, v]) => v)
        .sort((a, b) => a - b);
      const end = beats.at(-1) ?? at;
      const span = end - at;
      // The last scene's rise-in runs past its label, as it does at the end of home.
      // A deep link (`/work#work-3`) lands its entrance on that beat.
      const hash = window.location.hash.slice(1);
      const deep = beats.includes(tl.labels[hash]) ? tl.labels[hash] : undefined;
      const settle = deep ?? (solo === LAST ? tl.duration() : at);

      window.dispatchEvent(new CustomEvent(SCENE_EVENT, { detail: solo }));
      setJourneyJump((id) => (id === solo ? at : null));

      const scrub = contextSafe!(() => {
        if (span <= 0) return;
        const proxy = tl.tweenFromTo(at, end, { paused: true, ease: "none" });
        // Start the scrub where the entrance left the playhead.
        proxy.progress(((deep ?? at) - at) / span);
        const st = ScrollTrigger.create({
          animation: proxy,
          trigger: rootRef.current,
          start: "top top",
          end: `+=${span * 100}%`,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: [0, ...beats.map((b) => (b - at) / span)],
            inertia: false,
            duration: { min: 0.4, max: 1.2 },
            delay: 0.15,
            ease: "power2.inOut",
          },
        });
        setJourneyJump((id, instant) => {
          const t = id === solo ? at : tl.labels[id];
          if (t === undefined || t < at || t > end) return null;
          const p = (t - at) / span;
          const top = st.start + p * (st.end - st.start);
          if (instant) cut(top);
          else window.scrollTo({ top, behavior: "smooth" });
          return t;
        });
        if (deep !== undefined) jumpToScene(hash, true);
      });

      // Entrance: the same camera move that brings this scene in on home.
      tl.seek(solo === "about" ? 1.3 : at - 0.5);
      tl.tweenTo(settle, { duration: 1.6, ease: "power2.out", onComplete: scrub });

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
        {!solo && <HeroScene ready={ready} />}
        {SCENES.slice(1).filter((s) => !solo || s.id === solo).map((s) =>
          s.id === "about" ? (
            <AboutScene key={s.id} />
          ) : s.id === "work" ? (
            <WorkScene key={s.id} />
          ) : s.id === "contact" ? (
            <ContactScene key={s.id} />
          ) : (
            <PlaceholderScene key={s.id} id={s.id} index={SCENES.indexOf(s)} title={s.title} note={s.note} />
          )
        )}
      </div>
    </div>
  );
}
