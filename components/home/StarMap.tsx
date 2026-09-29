"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { RESUME } from "@/lib/resumes";
import { SCENES, onArrive } from "./journey";

// Full-screen site map: the scenes are bodies on one tilted orbit around a
// glowing core, the current scene parked nearest the viewer. Hovering a body
// halts the orbit, pulls it toward the cursor and lights its links; picking
// one jumps to hyperspace before the stage flies there. Positions are written
// straight to the DOM each frame; dust, orbit, links and sparks are a 2D
// canvas so the stage's WebGL canvas stays the only one alive.

const pad = (n: number) => String(n).padStart(2, "0");

const LINKS = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Résumé", href: RESUME.file, download: RESUME.downloadName },
  { label: "Email", href: "mailto:patharia52@gmail.com" },
  { label: "GitHub", href: "https://github.com/mustafa-patharia", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/mustafa-patharia", external: true },
];

const TAU = Math.PI * 2;
const N = SCENES.length;
const STEP = TAU / N;
const FRONT = Math.PI / 2; // screen-space angle nearest the viewer (bottom of the ellipse)
const DRIFT = TAU / 140; // orbit speed, radians per second
const DOT_Y = 12; // button top to dot centre: half the 24px dot box
const ACCENT = "137,170,204";
const DEEP = "78,133,191";

// Far-off bodies behind the orbit, darkened like the About planets so they
// read as distance. `depth` is cursor parallax in px; `dir` is where they
// rush off-screen on a jump.
const PLANETS = [
  { src: "saturn", w: 871, h: 545, depth: 22, dir: [1, 0.8], className: "-bottom-[14vh] -right-[18vw] w-[80vw] md:-bottom-[16vh] md:-right-[8vw] md:w-[34vw]" },
  { src: "moon", w: 460, h: 480, depth: 44, dir: [-1, -0.5], className: "left-[4vw] top-[16vh] w-[16vw] md:left-[5vw] md:top-[15vh] md:w-[6.5vw]" },
  { src: "earth", w: 480, h: 480, depth: 64, dir: [0.7, -1], className: "hidden md:block right-[17vw] top-[13vh] w-[3.6vw]" },
] as const;

type Spark ={ x: number; y: number; vx: number; vy: number; life: number; max: number; size: number };
// The jump: `t` spins the drive up (0→1) toward the chosen body, the page
// cuts under the flash, then `out` spins it down (0→1) as the map fades.
type Warp = { i: number; t: number; out: number; flash: number; x: number; y: number };
type Deep = { x: number; y: number; z: number; pz: number; c: string; size: number };
const FOCAL = 420; // hyperspace camera focal length, px
const FAR = 3000; // deepest star
const RING_SPAN = 3400; // tunnel length the rings cycle through
const RINGS = 12;

export default function StarMap({
  scene,
  onTravel,
  onClose,
}: {
  scene: string;
  /** Scrolls this page to the scene and returns its timeline time, or null on a page change. */
  onTravel: (id: string) => number | null;
  onClose: () => void;
}) {
  const active = Math.max(0, SCENES.findIndex((s) => s.id === scene));
  const [hover, setHover] = useState<number | null>(null);
  // Set once a jump has faded the map out itself, so closing doesn't replay a fade.
  const [landed, setLanded] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [arriving, setArriving] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverRef = useRef<number | null>(null);
  const warpRef = useRef<Warp | null>(null);
  const warpTween = useRef<gsap.core.Animation | null>(null);
  const cancelArrive = useRef<(() => void) | null>(null);
  const startOffset = useRef(FRONT - active * STEP);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pointer = { x: W / 2, y: H / 2, tx: W / 2, ty: H / 2 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    const dust = Array.from({ length: 260 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.15 + Math.random() * 0.85,
      tw: Math.random() * TAU,
    }));
    const sparks: Spark[] = [];
    const spark = (x: number, y: number, speed: number, life: number) => {
      if (sparks.length > 420) return;
      const a = Math.random() * TAU;
      const v = speed * (0.3 + Math.random() * 0.7);
      const max = life * (0.6 + Math.random() * 0.6);
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 8, life: max, max, size: 0.6 + Math.random() * 1.4 });
    };

    // k grows the orbit out of the core; spin unwinds it into place.
    const orbit = { k: still ? 1 : 0, spin: still ? 0 : -1.4, offset: startOffset.current, drift: 1, boost: 0 };
    const intro = still ? null : gsap.to(orbit, { k: 1, spin: 0, duration: 1.7, ease: "expo.out", delay: 0.05 });
    const stars = SCENES.map(() => ({ x: 0, y: 0, depth: 0, mx: 0, my: 0, focus: 1, lx: NaN, ly: NaN }));
    let time = 0;

    // Hyperspace: stars in depth streak past a vanishing point that swings
    // from the chosen body to the centre; rings rush by; frames fade instead
    // of clearing, so everything trails.
    let deep: Deep[] = [];
    const rings = Array.from({ length: RINGS }, (_, i) => ({ z: 200 + (i / RINGS) * RING_SPAN }));
    const seed = (p: Deep, far: boolean) => {
      p.x = (Math.random() * 2 - 1) * W * 1.2;
      p.y = (Math.random() * 2 - 1) * H * 1.2;
      p.z = far ? FAR : 200 + Math.random() * (FAR - 200);
      p.pz = p.z;
      const r = Math.random();
      p.c = r < 0.5 ? "244,248,255" : r < 0.8 ? ACCENT : "125,180,255";
      p.size = 0.6 + Math.random() * 1.2;
    };
    const hyperspace = (warp: Warp, dt: number) => {
      if (!deep.length) {
        const n = Math.round(Math.min(1200, Math.max(400, (W * H) / 1800)));
        deep = Array.from({ length: n }, () => {
          const p = {} as Deep;
          seed(p, false);
          return p;
        });
      }
      const s = warp.out > 0 ? 1 - warp.out : warp.t;
      const aim = Math.min(1, warp.t * 1.6);
      const vx = warp.x + (W / 2 - warp.x) * aim;
      const vy = warp.y + (H / 2 - warp.y) * aim;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(3,5,10,${warp.out > 0 ? 0.16 + 0.3 * warp.out : 0.05 + 0.15 * warp.t})`;
      ctx.fillRect(0, 0, W, H);

      const shake = Math.max(0, (s - 0.75) / 0.25) * 5;
      ctx.save();
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      ctx.globalCompositeOperation = "lighter";

      const R = 40 + s * s * Math.min(W, H) * 0.35;
      const core = ctx.createRadialGradient(vx, vy, 0, vx, vy, R);
      core.addColorStop(0, `rgba(240,246,255,${0.05 + s * 0.6})`);
      core.addColorStop(0.3, `rgba(${ACCENT},${0.04 + s * 0.3})`);
      core.addColorStop(1, `rgba(${DEEP},0)`);
      ctx.fillStyle = core;
      ctx.fillRect(vx - R, vy - R, R * 2, R * 2);

      const radius = Math.min(W, H) * 1.1;
      const zr = (40 + s * s * 2600) * dt;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 6 + s * 12;
      for (const r of rings) {
        r.z -= zr;
        if (r.z < 40) r.z += RING_SPAN;
        const k = FOCAL / r.z;
        const pr = radius * k;
        if (pr > Math.max(W, H) * 2) continue;
        const a = Math.min(1, (RING_SPAN - r.z) / RING_SPAN) * (0.15 + s * 0.6) * Math.min(1, k * 3);
        ctx.strokeStyle = `rgba(${DEEP},${a})`;
        ctx.shadowColor = `rgba(${ACCENT},${a})`;
        ctx.beginPath();
        ctx.arc(vx, vy, pr, 0, TAU);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      const zs = (60 + s * s * 3200) * dt;
      const chroma = Math.max(0, (s - 0.7) / 0.3);
      ctx.lineCap = "round";
      for (const p of deep) {
        p.pz = p.z;
        p.z -= zs;
        if (p.z < 20) {
          seed(p, true);
          continue;
        }
        const k = FOCAL / p.z;
        const x = vx + p.x * k;
        const y = vy + p.y * k;
        if (x < -50 || x > W + 50 || y < -50 || y > H + 50) {
          seed(p, true);
          continue;
        }
        const qk = FOCAL / (p.pz + zs * (0.2 + s * 2.2));
        const qx = vx + p.x * qk;
        const qy = vy + p.y * qk;
        const a = Math.min(1, (FAR - p.z) / 1400) * (0.5 + s * 0.5);
        ctx.lineWidth = p.size * Math.min(3, k * 1.6);
        if (chroma > 0) {
          const off = chroma * 5 * Math.max(0.4, k);
          ctx.strokeStyle = `rgba(255,90,120,${a * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(qx - off, qy);
          ctx.lineTo(x - off, y);
          ctx.stroke();
          ctx.strokeStyle = `rgba(60,140,255,${a * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(qx + off, qy);
          ctx.lineTo(x + off, y);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(${p.c},${a})`;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.restore();

      if (warp.flash > 0) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(235,242,252,${warp.flash})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const tick = (_: number, ms: number) => {
      const dt = Math.min(ms, 50) / 1000;
      time += dt;
      const desktop = W >= 768;
      const held = hoverRef.current;
      const warp = warpRef.current;
      const wt = warp ? warp.t : 0;

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      const px = pointer.x / W - 0.5;
      const py = pointer.y / H - 0.5;

      // The orbit coasts to a stop while a body is held.
      orbit.drift += ((held === null && !warp ? 1 : 0) - orbit.drift) * 0.05;
      orbit.boost += ((held === null ? 0 : 1) - orbit.boost) * 0.08;
      if (!still) orbit.offset += DRIFT * orbit.drift * dt;

      const cx = W / 2 - px * 24;
      const cy = H * 0.46 - py * 16;
      const rx = Math.min(W * 0.36, 640) * orbit.k;
      const ry = rx * 0.34;
      const fade = Math.min(1, orbit.k * 1.4) * (1 - wt);

      stars.forEach((s, i) => {
        const th = orbit.offset + orbit.spin + i * STEP;
        const depth = (Math.sin(th) + 1) / 2;
        let x = cx + Math.cos(th) * rx - px * 30 * depth;
        let y = cy + Math.sin(th) * ry - py * 20 * depth;
        const isHeld = held === i;
        const clamp = (v: number) => Math.max(-28, Math.min(28, v));
        s.mx += ((isHeld ? clamp((pointer.tx - x) * 0.22) : 0) - s.mx) * 0.12;
        s.my += ((isHeld ? clamp((pointer.ty - y) * 0.22) : 0) - s.my) * 0.12;
        x += s.mx;
        y += s.my;
        const target = warp ? (warp.i === i ? 1 : 0) : held === null || isHeld ? 1 : 0.3;
        s.focus += (target - s.focus) * 0.1;

        // Wake: the held body sheds sparks, more when it moves.
        if (!still && desktop && isHeld && !warp && Number.isFinite(s.lx)) {
          const moved = Math.hypot(x - s.lx, y - s.ly);
          for (let n = 1 + Math.min(5, moved * 0.5); n > 0; n--) spark(x, y, 50, 1.1);
        }
        s.x = x;
        s.y = y;
        s.lx = x;
        s.ly = y;
        s.depth = depth;

        const el = starRefs.current[i];
        if (!el || !desktop) return;
        const lift = warp && warp.i === i ? 1 + wt * 0.5 : 1;
        const scale = (0.7 + 0.3 * depth) * lift * (0.35 + 0.65 * orbit.k);
        const shown = warp && warp.i === i ? 1 - wt * wt : isHeld ? 1 : 0.4 + 0.6 * depth;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -${DOT_Y}px) scale(${scale})`;
        el.style.opacity = String(shown * s.focus * Math.min(1, orbit.k * 1.4));
        el.style.zIndex = String(isHeld ? 200 : Math.round(depth * 100));
      });

      PLANETS.forEach((p, i) => {
        const el = planetRefs.current[i];
        if (!el) return;
        const rush = wt * wt;
        const x = -px * p.depth + p.dir[0] * rush * W * 0.45;
        const y = -py * p.depth * 0.6 + Math.sin(time * 0.35 + i * 2) * 6 + p.dir[1] * rush * H * 0.45;
        const scale = (0.88 + 0.12 * orbit.k) * (1 + rush * 1.6);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        el.style.opacity = String(Math.min(1, orbit.k * 1.2) * (1 - rush));
      });

      const hud = hudRef.current;
      if (hud) {
        hud.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        hud.style.opacity = String(fade);
      }

      if (warp) {
        if (Number.isNaN(warp.x)) {
          warp.x = stars[warp.i].x;
          warp.y = stars[warp.i].y;
        }
        hyperspace(warp, dt);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      // Dust in three-ish depths; parallax and drift scale with depth.
      for (const d of dust) {
        if (!still) d.x = (d.x - dt * 0.003 * d.z + 1) % 1;
        const x = ((((d.x - px * 0.05 * d.z) % 1) + 1) % 1) * W;
        const y = ((((d.y - py * 0.05 * d.z) % 1) + 1) % 1) * H;
        const a = (0.15 + 0.5 * d.z) * (0.65 + 0.35 * Math.sin(time * 1.3 + d.tw));
        const s = 0.6 + d.z * 1.4;
        ctx.fillStyle = `rgba(220,230,245,${a})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }

      if (desktop && orbit.k > 0.01) {
        // Ghost rings for depth, then the orbit: far half dim, near half lit.
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        for (const [m, a] of [[0.55, 0.05], [1.4, 0.035]] as const) {
          ctx.strokeStyle = `rgba(${ACCENT},${a * fade})`;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx * m, ry * m, 0, 0, TAU);
          ctx.stroke();
        }
        ctx.setLineDash([2, 7]);
        ctx.lineDashOffset = -time * 10;
        ctx.strokeStyle = `rgba(${ACCENT},${0.14 * fade})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, TAU);
        ctx.stroke();
        ctx.strokeStyle = `rgba(${ACCENT},${0.42 * fade})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI);
        ctx.stroke();

        // Constellation: the journey's order, one link per step. Links on
        // the held body flare and flow.
        for (let i = 0; i < N - 1; i++) {
          const a = stars[i];
          const b = stars[i + 1];
          const lit = held === i || held === i + 1;
          ctx.setLineDash(lit ? [6, 6] : []);
          ctx.lineDashOffset = -time * 30;
          ctx.lineWidth = lit ? 1.2 : 1;
          ctx.strokeStyle = `rgba(${ACCENT},${(lit ? 0.6 : 0.09 * Math.min(a.focus, b.focus)) * fade})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        ctx.globalCompositeOperation = "lighter";

        // Tractor beam from the core to the held body.
        if (held !== null) {
          const s = stars[held];
          const g = ctx.createLinearGradient(cx, cy, s.x, s.y);
          g.addColorStop(0, `rgba(${ACCENT},0)`);
          g.addColorStop(1, `rgba(${ACCENT},${0.5 * s.focus * fade})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }

        const R = 150 * orbit.k * (1 + Math.sin(time * 1.6) * 0.06 + orbit.boost * 0.18);
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        core.addColorStop(0, `rgba(210,225,245,${0.28 * fade})`);
        core.addColorStop(0.1, `rgba(${ACCENT},${0.22 * fade})`);
        core.addColorStop(0.45, `rgba(${DEEP},${0.08 * fade})`);
        core.addColorStop(1, `rgba(${DEEP},0)`);
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "lighter";
      for (let j = sparks.length - 1; j >= 0; j--) {
        const p = sparks[j];
        p.life -= dt;
        if (p.life <= 0) {
          sparks.splice(j, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
        const a = p.life / p.max;
        ctx.fillStyle = `rgba(${ACCENT},${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a + 0.3, 0, TAU);
        ctx.fill();
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      intro?.kill();
      warpTween.current?.kill();
      cancelArrive.current?.();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    if (landed) onClose();
  }, [landed, onClose]);

  const enter = (i: number) => {
    if (warpRef.current) return;
    hoverRef.current = i;
    setHover(i);
  };
  const leave = () => {
    if (warpRef.current) return;
    hoverRef.current = null;
    setHover(null);
  };

  const go = (i: number) => {
    if (warpRef.current) return;
    const id = SCENES[i].id;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || window.innerWidth < 768) {
      if (onTravel(id) !== null) onClose();
      return;
    }
    hoverRef.current = i;
    setHover(i);
    setJumping(true);
    const warp: Warp = { i, t: 0, out: 0, flash: 0, x: NaN, y: NaN };
    warpRef.current = warp;
    warpTween.current = gsap
      .timeline()
      .to(warp, { t: 1, duration: 1.3, ease: "power2.in" })
      .set(warp, { flash: 0.85 })
      .add(() => {
        // The page scrolls under the tunnel at full speed; once the scene has
        // settled, the drive spins down onto it. A page change just keeps
        // racing until the new page replaces this one.
        const at = onTravel(id);
        if (at === null) return;
        cancelArrive.current = onArrive(at, () => {
          setArriving(true);
          warpTween.current = gsap.to(warp, { out: 1, duration: 1.3, ease: "power2.out", onComplete: () => setLanded(true) });
        });
      })
      .to(warp, { flash: 0, duration: 0.7, ease: "power1.out" });
  };

  const shown = hover ?? active;

  return (
    <motion.nav
      id="star-map"
      aria-label="Site map"
      initial={{ opacity: 0 }}
      animate={arriving ? { opacity: 0, transition: { duration: 1, delay: 0.25, ease: "easeInOut" } } : { opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: landed ? 0 : 0.4 } }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[65] overflow-y-auto bg-bg/85 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none fixed inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        exit={{ scale: 1.1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "radial-gradient(ellipse 60% 45% at 50% 46%, rgba(78,133,191,0.14), transparent 70%)",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        {PLANETS.map((p, i) => (
          <div
            key={p.src}
            ref={(el) => {
              planetRefs.current[i] = el;
            }}
            className={`absolute opacity-0 will-change-transform ${p.className}`}
          >
            <Image
              src={`/personal/orbit/${p.src}.png`}
              alt=""
              width={p.w}
              height={p.h}
              sizes="(max-width: 768px) 80vw, 34vw"
              draggable={false}
              className="h-auto w-full select-none [filter:brightness(0.38)_saturate(0.5)_contrast(0.9)_blur(1.5px)]"
            />
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />

      {/* Desktop: bodies on the orbit, placed each frame */}
      <div className="pointer-events-none fixed inset-0 hidden md:block">
        <div ref={hudRef} className="absolute left-0 top-0 text-center opacity-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={shown}
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted">
                {shown === active ? "You are here" : "Set course"}
              </p>
              <p className="mt-3 text-sm tabular-nums tracking-[0.3em] text-text-primary">
                {pad(shown + 1)}
                <span className="text-muted"> / {pad(N)}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {SCENES.map((s, i) => {
          const current = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                starRefs.current[i] = el;
              }}
              type="button"
              onClick={() => go(i)}
              onPointerEnter={() => enter(i)}
              onPointerLeave={leave}
              onFocus={() => enter(i)}
              onBlur={leave}
              aria-label={`${pad(i + 1)} ${s.title}`}
              aria-current={current ? "location" : undefined}
              className="group pointer-events-auto absolute left-0 top-0 flex flex-col items-center gap-2 opacity-0 outline-none will-change-transform"
              style={{ transformOrigin: `50% ${DOT_Y}px` }}
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                {current && (
                  <span className="absolute inset-0 rounded-full bg-[#4E85BF]/40 [animation-duration:2.4s] motion-safe:animate-ping" />
                )}
                <span className="absolute -inset-5 scale-0 rounded-full bg-[radial-gradient(circle,rgba(137,170,204,0.45),transparent_68%)] transition-transform duration-500 ease-out group-hover:scale-100 group-focus-visible:scale-100" />
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    current
                      ? "bg-[#4E85BF]/30 shadow-[0_0_24px_6px_rgba(78,133,191,0.6)]"
                      : "scale-50 group-hover:scale-100 group-hover:bg-[#4E85BF]/25 group-hover:shadow-[0_0_20px_4px_rgba(78,133,191,0.5)] group-focus-visible:scale-100 group-focus-visible:bg-[#4E85BF]/25"
                  }`}
                />
                <span
                  className={`relative rounded-full bg-text-primary transition-all duration-300 ${
                    current ? "h-2.5 w-2.5" : "h-1.5 w-1.5 group-hover:h-2.5 group-hover:w-2.5 group-focus-visible:h-2.5 group-focus-visible:w-2.5"
                  }`}
                />
              </span>
              <span
                className={`relative whitespace-nowrap font-display text-3xl italic transition-[color,letter-spacing] duration-500 lg:text-4xl ${
                  current
                    ? "text-text-primary"
                    : "text-muted group-hover:tracking-wide group-hover:text-text-primary group-focus-visible:text-text-primary"
                }`}
              >
                {s.title}
                <span className="accent-gradient absolute -bottom-1 left-0 h-px w-full origin-center scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: the same stars down a vertical orbit */}
      <div className="relative flex min-h-full flex-col justify-center px-8 pb-40 pt-24 md:hidden">
        <span className="absolute bottom-40 left-[2.35rem] top-24 w-px bg-gradient-to-b from-[#89AACC]/0 via-[#89AACC]/50 to-[#4E85BF]/0" />
        {SCENES.map((s, i) => {
          const current = i === active;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onTravel(s.id)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
              aria-current={current ? "location" : undefined}
              className="relative flex items-center gap-5 py-3 text-left"
            >
              <span
                className={`relative z-10 rounded-full bg-text-primary ${
                  current ? "h-2.5 w-2.5 shadow-[0_0_16px_4px_rgba(78,133,191,0.7)]" : "ml-0.5 h-1.5 w-1.5 opacity-60"
                }`}
              />
              <span className="w-6 text-xs tabular-nums tracking-[0.2em] text-muted">{pad(i + 1)}</span>
              <span className={`font-display text-4xl italic ${current ? "text-text-primary" : "text-muted"}`}>
                {s.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        animate={jumping ? { opacity: 0, y: 12, transition: { duration: 0.3 } } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
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
