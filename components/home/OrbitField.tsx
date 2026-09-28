"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import Matter from "matter-js";
import { onSceneVisit, progress, SCENES } from "./journey";
import { flyby } from "./flyby";

gsap.registerPlugin(useGSAP);

// The desk things that float off with the astronaut: these are the ones you
// can grab and throw. Each entry's `w` is its desktop width in px, sized
// against each other (a mug is smaller than a notebook); phones get
// the first `MOBILE`, scaled down.
const OBJECTS = [
  { src: "coffee", alt: "Coffee mug", w: 80, h: 76 },
  { src: "headphones", alt: "Headphones", w: 84, h: 103 },
  { src: "notebook", alt: "Sketch notebook", w: 104, h: 88 },
  { src: "burger", alt: "Burger", w: 68, h: 68 },
];

// Far-off bodies behind everything: huge next to the desk things. Distance
// comes from darkening, desaturating and softening them, never opacity, so
// they stay solid and the stars don't show through. They drift with the
// cursor by `depth` and aren't playable.
const PLANETS = [
  { src: "saturn", w: 871, h: 545, depth: 14, className: "-bottom-[10vh] -right-[12vw] w-[70vw] md:-bottom-[12vh] md:-right-[6vw] md:w-[36vw]" },
  { src: "moon", w: 460, h: 480, depth: 26, className: "-left-[3vw] top-[11vh] w-[18vw] md:-left-[1.5vw] md:top-[12vh] md:w-[8vw]" },
];
const MOBILE = 3;
const MOBILE_SCALE = 0.6; // keep in step with the 0.6 in the node width class

// The field only simulates while About is on screen (its fade-in through
// the start of the ring transition).
const ABOUT_AT = SCENES.find((s) => s.id === "about")!.at;
const WORK_AT = SCENES.find((s) => s.id === "work")!.at;
const LIVE_FROM = ABOUT_AT - 0.7;
const LIVE_TO = WORK_AT - 0.2;

const TOP = 76; // clear of the fixed nav pills
const MIN_SPEED = 0.35; // below this, a nudge keeps things drifting
const MAX_SPEED = 28;

// Zero-g: bodies keep what you give them, bounce off the screen edges and
// knock into each other, passing behind the astronaut and the copy. Grab
// one to drag it; let go mid-swing to throw it. Matter only simulates — each body's transform is
// written straight onto its DOM node.
export default function OrbitField() {
  const layerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const layer = layerRef.current;
    const root = layer?.parentElement;
    if (!layer || !root) return;

    const { Engine, Bodies, Body, Composite, Constraint, Vector } = Matter;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    const world = engine.world;

    let bodies: Matter.Body[] = [];
    let statics: Matter.Body[] = [];
    let scale = 1;
    let count = 0;

    const build = () => {
      const W = root.clientWidth;
      const H = root.clientHeight;
      const mobile = W < 768;
      const nextScale = mobile ? MOBILE_SCALE : 1;
      const nextCount = mobile ? MOBILE : OBJECTS.length;

      // The screen edges are the only walls: the astronaut and the copy sit
      // above this layer, and objects drift behind them.
      Composite.remove(world, statics);
      const t = 400;
      statics = [
        Bodies.rectangle(W / 2, TOP - t / 2, W + t * 2, t, { isStatic: true }),
        Bodies.rectangle(W / 2, H - 12 + t / 2, W + t * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2, t, H + t * 2, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2, t, H + t * 2, { isStatic: true }),
      ];
      Composite.add(world, statics);

      const spot = (w: number, h: number) => ({
        x: w / 2 + Math.random() * (W - w),
        y: TOP + h / 2 + Math.random() * (H - TOP - 12 - h),
      });

      // Same size and count: keep bodies where they are, only moving the
      // ones the new bounds leave outside.
      if (bodies.length && nextScale === scale && nextCount === count) {
        bodies.forEach((b, i) => {
          const { x, y } = b.position;
          const o = OBJECTS[i];
          if (x < 0 || x > W || y < TOP || y > H) Body.setPosition(b, spot(o.w * scale, o.h * scale));
        });
        return;
      }

      Composite.remove(world, bodies);
      scale = nextScale;
      count = nextCount;
      bodies = OBJECTS.slice(0, count).map((o) => {
        const w = o.w * scale;
        const h = o.h * scale;
        const { x, y } = spot(w, h);
        const body = Bodies.rectangle(x, y, w * 0.9, h * 0.9, {
          chamfer: { radius: Math.min(w, h) * 0.3 },
          restitution: 0.85,
          friction: 0.02,
          frictionAir: 0.012,
          angle: (Math.random() - 0.5) * 0.8,
        });
        if (!still) {
          Body.setVelocity(body, { x: (Math.random() - 0.5) * 1.6, y: (Math.random() - 0.5) * 1.6 });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.01);
        }
        return body;
      });
      Composite.add(world, bodies);
      nodes.current.forEach((n, i) => n && (n.style.display = i < count ? "" : "none"));
    };

    build();

    // Drag: a soft spring from the pointer to the grab point, so an object
    // swings and turns as it's pulled and keeps its momentum when let go.
    let grab: { id: number; c: Matter.Constraint } | null = null;
    const toLocal = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const downs = nodes.current.map((n, i) => {
      const onDown = (e: PointerEvent) => {
        const body = bodies[i];
        if (!n || !body || grab) return;
        e.preventDefault();
        n.setPointerCapture(e.pointerId);
        const p = toLocal(e);
        const local = Vector.rotate(Vector.sub(p, body.position), -body.angle);
        const c = Constraint.create({ pointA: p, bodyB: body, pointB: local, stiffness: 0.08, damping: 0.08, length: 0 });
        Composite.add(world, c);
        grab = { id: e.pointerId, c };
        n.dataset.grabbed = "";
      };
      n?.addEventListener("pointerdown", onDown);
      return onDown;
    });
    // The drag point stays inside the walls, so a pull past the edge can't
    // drag an object through them.
    const onMove = (e: PointerEvent) => {
      if (!grab || e.pointerId !== grab.id) return;
      const p = toLocal(e);
      grab.c.pointA = { x: Math.min(Math.max(p.x, 0), root.clientWidth), y: Math.min(Math.max(p.y, TOP), root.clientHeight) };
    };
    const onUp = (e: PointerEvent) => {
      if (!grab || e.pointerId !== grab.id) return;
      Composite.remove(world, grab.c);
      const b = grab.c.bodyB;
      if (b) Body.setVelocity(b, Vector.mult(Vector.normalise(b.velocity), Math.min(Vector.magnitude(b.velocity), MAX_SPEED)));
      grab = null;
      nodes.current.forEach((n) => n && delete n.dataset.grabbed);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    let raf = 0;
    let wasLive = false;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 32);
      last = now;
      const live = progress.t >= LIVE_FROM && progress.t <= LIVE_TO;
      if (!live) {
        if (grab) onUp({ pointerId: grab.id } as PointerEvent);
        wasLive = false;
        return;
      }
      // Re-measure on the way in: fonts and the loader can shift the copy
      // after mount.
      if (!wasLive) build();
      wasLive = true;

      bodies.forEach((b) => {
        const v = Vector.magnitude(b.velocity);
        if (!still && v < MIN_SPEED) {
          const a = Math.random() * Math.PI * 2;
          const dir = v > 0.05 ? Vector.normalise(b.velocity) : { x: Math.cos(a), y: Math.sin(a) };
          Body.applyForce(b, b.position, Vector.mult(dir, b.mass * 2e-5));
        }
        if (v > MAX_SPEED) Body.setVelocity(b, Vector.mult(b.velocity, MAX_SPEED / v));
      });
      Engine.update(engine, dt);

      // Anything that still got knocked out of bounds comes back in.
      const W = root.clientWidth;
      const H = root.clientHeight;
      bodies.forEach((b) => {
        const { x, y } = b.position;
        if (x > -20 && x < W + 20 && y > TOP - 20 && y < H + 20) return;
        Body.setPosition(b, { x: W * (0.1 + Math.random() * 0.8), y: TOP + 40 });
        Body.setVelocity(b, { x: 0, y: 1 });
      });

      bodies.forEach((b, i) => {
        const n = nodes.current[i];
        if (!n) return;
        n.style.transform = `translate3d(${b.position.x}px, ${b.position.y}px, 0) translate(-50%, -50%) rotate(${b.angle}rad)`;
      });
    };
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(build);
    ro.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      nodes.current.forEach((n, i) => n?.removeEventListener("pointerdown", downs[i]));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      Engine.clear(engine);
    };
  }, []);

  // Planets idle and lean with the cursor. Now and then a comet or an
  // asteroid (picked at random) crosses from any edge to the far side, and
  // can be grabbed and thrown off course —
  // never there on arrival: the first pass comes 5–20s after reaching
  // About, then one every 2–3 minutes.
  useGSAP(
    (_, safe) => {
      gsap.utils.toArray<HTMLElement>(".about-planet-float").forEach((el, i) => {
        gsap.to(el, { y: i ? -10 : 8, rotation: i ? 4 : -2, duration: 7 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      const leans = gsap.utils.toArray<HTMLElement>(".about-planet").map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1.6, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.6, ease: "power3.out" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        leans.forEach((l) => {
          l.x(-nx * l.depth);
          l.y(-ny * l.depth);
        });
      };
      window.addEventListener("pointermove", onMove);

      let unvisit = () => {};
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const layer = layerRef.current!;
        // The comet's art flies down-left (135°) with its tail behind; the
        // asteroid just tumbles.
        const comet = flyby(layer.querySelector<HTMLElement>(".about-comet")!, { speed: 170, art: 135 });
        const asteroid = flyby(layer.querySelector<HTMLElement>(".about-asteroid")!, { speed: 65 });
        const pass = safe!(() =>
          (Math.random() < 0.5 ? comet : asteroid).launch(safe!(() => void gsap.delayedCall(120 + Math.random() * 60, pass)))
        );
        const clear = safe!(() => {
          gsap.killTweensOf(pass);
          comet.stop();
          asteroid.stop();
        });
        const off = onSceneVisit(
          "about",
          safe!(() => {
            clear();
            gsap.delayedCall(5 + Math.random() * 15, pass);
          }),
          clear
        );
        unvisit = () => {
          off();
          comet.dispose();
          asteroid.dispose();
        };
      }
      return () => {
        window.removeEventListener("pointermove", onMove);
        unvisit();
      };
    },
    { scope: layerRef }
  );

  return (
    <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0">
      {PLANETS.map((p) => (
        <div key={p.src} data-depth={p.depth} className={`about-planet absolute ${p.className}`}>
          <div className="about-planet-float">
            <Image
              src={`/personal/orbit/${p.src}.png`}
              alt=""
              width={p.w}
              height={p.h}
              sizes="(max-width: 768px) 70vw, 36vw"
              draggable={false}
              className="h-auto w-full select-none [filter:brightness(0.5)_saturate(0.55)_contrast(0.9)_blur(1.5px)]"
            />
          </div>
        </div>
      ))}
      {/* Fly-bys: driven by flyby(); grab one mid-flight and throw it. */}
      <div className="about-comet pointer-events-auto invisible absolute left-0 top-0 w-14 cursor-grab touch-none select-none data-[grabbed]:cursor-grabbing md:w-20">
        <Image src="/personal/orbit/comet.png" alt="" width={160} height={158} sizes="80px" draggable={false} className="h-auto w-full" />
      </div>
      <div className="about-asteroid pointer-events-auto invisible absolute left-0 top-0 w-10 cursor-grab touch-none select-none data-[grabbed]:cursor-grabbing md:w-14">
        <Image src="/personal/orbit/asteroid.png" alt="" width={156} height={160} sizes="56px" draggable={false} className="h-auto w-full [filter:brightness(0.8)]" />
      </div>

      {OBJECTS.map((o, i) => (
        <div
          key={o.src}
          ref={(n) => {
            nodes.current[i] = n;
          }}
          className="group pointer-events-auto absolute left-0 top-0 w-[calc(var(--w)*0.6)] cursor-grab touch-none select-none will-change-transform data-[grabbed]:cursor-grabbing md:w-[var(--w)]"
          style={{ "--w": `${o.w}px`, transform: "translate3d(-200px, -200px, 0)" } as CSSProperties}
        >
          <div className="about-orb">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Image
                src={`/personal/orbit/${o.src}.png`}
                alt={o.alt}
                width={o.w * 2}
                height={o.h * 2}
                sizes={`${o.w}px`}
                draggable={false}
                className="h-auto w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_24px_rgba(137,170,204,0.45)]"
              />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}
