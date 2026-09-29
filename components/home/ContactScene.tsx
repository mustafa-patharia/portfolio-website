"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { SOCIALS } from "@/components/Contact";
import { onSceneVisit, progress, SCENES } from "./journey";
import { flyby } from "./flyby";

const EMAIL = "patharia52@gmail.com";
const CONTACT_AT = SCENES.find((s) => s.id === "contact")!.at;

// Where the dish sits on satellite.png (from its centre, in image widths) and
// which way it faces at rest, in screen radians (y down).
const DISH = { x: -0.32, y: 0.15 };
const ANTENNA = (150 * Math.PI) / 180;
const CRUISE = 0.18; // orbital speed the satellite settles back to, rad/s — one lap ≈ 35s
// Fixed orbit, the same on every screen: the ring seen at an angle. It may
// run off the edges; that's fine, the orbit holds.
const RX = 540;
const RY = 250;
const SAT_W = 90;
const EARTH = 240;

type Status = "idle" | "sending" | "sent" | "error";
type Point = { x: number; y: number };

// Open Channel, deep inside the black hole. Full-screen backdrop: Earth floats
// bottom-left with the satellite on a fixed orbit, dish always turned to it.
// Text and form sit centred on top; the satellite passes behind them. Drag the satellite along its orbit or pull it off it: let go
// and it springs back and cruises on. Tuck it behind Earth and the signal
// drops. A sent message relays form → satellite → Earth.
export default function ContactScene() {
  const rootRef = useRef<HTMLElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const satRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGEllipseElement>(null);
  const linkRef = useRef<SVGPathElement>(null);
  const packetsRef = useRef<SVGPathElement>(null);
  const carrierRef = useRef<SVGPathElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const upRef = useRef<SVGPathElement>(null);
  const burstRef = useRef<SVGPathElement>(null);
  const uplinkOn = useRef(false);
  const [linked, setLinked] = useState(true);
  const [hint, setHint] = useState(false);
  const [earthHover, setEarthHover] = useState(false);
  // The status tag hangs from Earth like a pendulum: `swing` is its angle,
  // driven by a damped spring and kicked by the cursor.
  const swing = useMotionValue(0);
  const kick = (push: number) =>
    animate(swing, 0, { type: "spring", stiffness: 120, damping: 4, velocity: swing.getVelocity() + push });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = rootRef.current!;
    const sat = satRef.current!;
    const earthEl = earthRef.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Layout offsets, not client rects: the stage scales this scene while it
    // flies in, and offsets ignore transforms.
    const offset = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };

    // Earth at rest, measured from the layout.
    let base = { x: 0, y: 0, r: 0 };
    const rx = RX;
    const ry = RY;
    const w = SAT_W;
    sat.style.width = `${w}px`;
    const measure = () => {
      const e = offset(earthEl);
      base = { x: e.x + e.w / 2, y: e.y + e.h / 2, r: e.w / 2 };
    };
    measure();

    // Orbit state: angle and speed around the ring, and `k` — how far off the
    // ring it's been pulled (1 = on it), sprung back when let go.
    let theta = 0.5;
    let omega = still ? 0 : CRUISE;
    let k = 1;
    let kv = 0;
    let grab: { id: number; last: number; t: number } | null = null;
    let earth = { ...base };
    // "Drag me" shows a few seconds after arriving, until the first grab.
    let introDone = false;
    let arrived = 0;
    let introAt = 0; // when the intro bubble went up
    let hovering = false;
    // Closest the satellite may come to Earth's centre at the current angle —
    // just grazing its edge, never across it.
    const kMin = () => (earth.r * 1.15) / Math.hypot(Math.cos(theta) * rx, Math.sin(theta) * ry);

    const toLocal = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      if (grab) return;
      e.preventDefault();
      sat.setPointerCapture(e.pointerId);
      grab = { id: e.pointerId, last: theta, t: performance.now() };
      sat.dataset.grabbed = "";
      introDone = true;
      setHint(false);
    };
    const onMove = (e: PointerEvent) => {
      if (!grab || e.pointerId !== grab.id) return;
      const p = toLocal(e);
      const dx = (p.x - earth.x) / rx;
      const dy = (p.y - earth.y) / ry;
      const next = Math.atan2(dy, dx);
      // Unwrap so a drag across ±π reads as a small step, not a full turn.
      let step = next - (theta % (Math.PI * 2));
      step = Math.atan2(Math.sin(step), Math.cos(step));
      theta += step;
      // Free drag: the satellite goes wherever the pointer does.
      const prevK = k;
      k = Math.max(kMin(), Math.hypot(dx, dy));
      const now = performance.now();
      const dt = Math.max((now - grab.t) / 1000, 1 / 120);
      // Carry the throw's outward/inward speed too, so a fling keeps coasting.
      kv = gsap.utils.clamp(-3, 3, (k - prevK) / dt);
      omega = gsap.utils.clamp(-8, 8, (theta - grab.last) / dt);
      grab.last = theta;
      grab.t = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!grab || e.pointerId !== grab.id) return;
      // A still release (no recent movement) shouldn't keep a stale spin.
      if (performance.now() - grab.t > 120) omega = kv = 0;
      grab = null;
      delete sat.dataset.grabbed;
    };
    // After the intro, the bubble answers hover.
    const onEnter = () => {
      hovering = true;
      if (introDone && !grab) setHint(true);
    };
    const onLeave = () => {
      hovering = false;
      if (introDone) setHint(false);
    };
    sat.addEventListener("pointerdown", onDown);
    sat.addEventListener("pointerenter", onEnter);
    sat.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // Link on/off: the beam grows out of the dish to Earth, then the signal
    // flows down it — a fine carrier with brighter pulses riding on it. The
    // flow is advanced in the tick in real pixels, so it runs at a steady
    // speed however long the line is.
    let lock = false;
    let flow = 0;
    const streams = () => [carrierRef.current, packetsRef.current];
    const setLock = (on: boolean) => {
      lock = on;
      setLinked(on);
      gsap.killTweensOf([linkRef.current, ".relay-earth-glow"]);
      if (on) {
        gsap.to(linkRef.current, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" });
        gsap.to(streams(), { autoAlpha: 1, duration: 0.3, delay: 0.4, overwrite: "auto" });
        gsap.to(".relay-earth-glow", { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.35, ease: "power2.out" });
      } else {
        gsap.to(linkRef.current, { strokeDashoffset: 1, duration: 0.35, ease: "power2.in" });
        gsap.to(streams(), { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
        gsap.to(".relay-earth-glow", { autoAlpha: 0, scale: 0.9, duration: 0.4 });
      }
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 32) / 1000;
      last = now;
      if (progress.t < CONTACT_AT - 0.3) {
        if (grab) onUp({ pointerId: grab.id } as PointerEvent);
        arrived = 0;
        if (introAt && !introDone) {
          introAt = 0;
          setHint(false);
        }
        return;
      }
      // First visit: the satellite says "Drag me!" once, a few seconds in.
      if (!arrived) arrived = now;
      if (!introDone && !introAt && now - arrived > 2500) {
        introAt = now;
        setHint(true);
      }
      if (!introDone && introAt && now - introAt > 3500) {
        introDone = true;
        if (!hovering) setHint(false);
      }

      // Earth bobs; the orbit follows it.
      const bob = Number(gsap.getProperty(floatRef.current, "y")) || 0;
      earth = { x: base.x, y: base.y + bob, r: base.r };

      if (!grab) {
        // Zero-g inertia: a weak pull back to the ring and little drag, so a
        // flung satellite coasts and drifts home over a few seconds instead
        // of snapping back. Spin eases back to cruising speed just as slowly.
        omega += ((still ? 0 : CRUISE) - omega) * (1 - Math.exp(-dt * 0.2));
        theta += omega * dt;
        kv += (1 - k) * 0.5 * dt;
        kv *= Math.exp(-dt * 1.25); // just under critical: one soft overshoot, no bounce into Earth
        k = Math.max(kMin(), k + kv * dt);
      }

      // Lower half of the ring is the near side: bigger, drawn over Earth.
      const depth = Math.sin(theta);
      const pos: Point = { x: earth.x + Math.cos(theta) * rx * k, y: earth.y + depth * ry * k };
      const toEarth = { x: earth.x - pos.x, y: earth.y - pos.y };
      const dist = Math.hypot(toEarth.x, toEarth.y);
      // Nearer Earth reads smaller, farther reads bigger.
      const scale = gsap.utils.clamp(0.55, 1.6, 0.4 + (0.6 * dist) / ((rx + ry) / 2));
      const angle = Math.atan2(toEarth.y, toEarth.x) - ANTENNA;
      sat.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${scale})`;
      // The hint rides above the satellite without turning with it.
      hintRef.current!.style.transform = `translate3d(${pos.x + w * scale * 0.2}px, ${pos.y - w * scale * 0.35}px, 0) translate(0, -100%)`;
      // Held: above everything, content included. Otherwise near side over Earth.
      sat.style.zIndex = grab ? "30" : depth >= 0 ? "7" : "5";
      sat.style.filter = depth >= 0 ? "" : `brightness(${0.75 + 0.25 * (1 + depth)})`;

      const orbit = orbitRef.current!;
      orbit.setAttribute("cx", String(earth.x));
      orbit.setAttribute("cy", String(earth.y));
      orbit.setAttribute("rx", String(rx));
      orbit.setAttribute("ry", String(ry));

      // Signal drops only when the satellite is tucked behind Earth's disk.
      const hidden = depth < 0 && dist < earth.r * 1.3;
      if (lock === hidden) setLock(!hidden);

      const dish = {
        x: pos.x + (Math.cos(angle) * DISH.x - Math.sin(angle) * DISH.y) * w * scale,
        y: pos.y + (Math.sin(angle) * DISH.x + Math.cos(angle) * DISH.y) * w * scale,
      };
      const n = Math.hypot(earth.x - dish.x, earth.y - dish.y) || 1;
      const surface = {
        x: earth.x - ((earth.x - dish.x) / n) * earth.r * 0.98,
        y: earth.y - ((earth.y - dish.y) / n) * earth.r * 0.98,
      };
      const line = `M${dish.x},${dish.y} L${surface.x},${surface.y}`;
      linkRef.current!.setAttribute("d", line);
      packetsRef.current!.setAttribute("d", line);
      carrierRef.current!.setAttribute("d", line);
      // Dashes travel dish → Earth: carrier at 50px/s, pulses at 120px/s.
      flow += dt;
      carrierRef.current!.setAttribute("stroke-dashoffset", String(-((flow * 50) % 12)));
      packetsRef.current!.setAttribute("stroke-dashoffset", String(-((flow * 120) % 110)));
      burstRef.current!.setAttribute("d", line);
      if (uplinkOn.current) {
        const s = offset(sendRef.current!);
        const a = { x: s.x + s.w / 2, y: s.y + s.h / 2 };
        upRef.current!.setAttribute(
          "d",
          `M${a.x},${a.y} Q${(a.x + dish.x) / 2},${Math.min(a.y, dish.y) - 80} ${dish.x},${dish.y}`
        );
      }
    };
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(measure);
    ro.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      sat.removeEventListener("pointerdown", onDown);
      sat.removeEventListener("pointerenter", onEnter);
      sat.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const { contextSafe } = useGSAP(
    (_, safe) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(floatRef.current, { y: -12, rotation: 3, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // A small rocket drifts across now and then — any edge to the far
      // side, nose along its path; grab it and throw it off course. Never
      // there on arrival: the first pass comes 5–20s after you reach the
      // scene, then one every 2–3 minutes; leaving clears it.
      gsap.to(".relay-rocket-body", { rotation: 4, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      const rocket = flyby(rootRef.current!.querySelector<HTMLElement>(".relay-rocket")!, { speed: 45, art: -90 });
      const fly = safe!(() => rocket.launch(safe!(() => void gsap.delayedCall(120 + Math.random() * 60, fly))));
      const ground = safe!(() => {
        gsap.killTweensOf(fly);
        rocket.stop();
      });
      const unvisit = onSceneVisit(
        "contact",
        safe!(() => {
          ground();
          gsap.delayedCall(5 + Math.random() * 15, fly);
        }),
        ground
      );
      return () => {
        unvisit();
        rocket.dispose();
      };
    },
    { scope: rootRef }
  );

  // Message relay: form → satellite, then satellite → Earth once accepted.
  const uplink = contextSafe(() => {
    uplinkOn.current = true;
    gsap.killTweensOf([upRef.current, burstRef.current, ".relay-sat-ping"]);
    gsap.set([upRef.current, burstRef.current], { strokeDashoffset: 1, autoAlpha: 1 });
    gsap.to(upRef.current, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" });
  });

  const delivered = contextSafe(() => {
    gsap
      .timeline({ onComplete: () => void (uplinkOn.current = false) })
      .fromTo(".relay-sat-ping", { scale: 0.5, autoAlpha: 1 }, { scale: 2.2, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0.2)
      .to(burstRef.current, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.35)
      .fromTo(".relay-earth-ping", { scale: 1, autoAlpha: 0.9 }, { scale: 1.6, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, 1)
      .to([upRef.current, burstRef.current], { autoAlpha: 0, duration: 0.8 }, 3);
  });

  const dropped = contextSafe(() => {
    gsap.to(upRef.current, {
      strokeDashoffset: 1,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => void (uplinkOn.current = false),
    });
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    uplink();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "The relay dropped it.");
      setStatus("sent");
      delivered();
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "The relay dropped it.");
      dropped();
    }
  }

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="contact"
      data-scene="contact"
      aria-label="Contact"
      ref={rootRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Backdrop: Earth bottom-left, floating; the orbit spans the screen. */}
      <div
        ref={earthRef}
        className="absolute bottom-[8vh] left-[6vw] z-[6]"
        style={{ width: EARTH, height: EARTH }}
        onPointerEnter={() => {
          setEarthHover(true);
          swing.set(-30); // drops in from the side and swings to rest
          kick(0);
        }}
        onPointerMove={(e) => kick(gsap.utils.clamp(-600, 600, e.movementX * 14))}
        onPointerLeave={() => setEarthHover(false)}
      >
        <div ref={floatRef} className="relative h-full w-full">
          <span className="relay-earth-glow invisible absolute -inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(137,170,204,0.45)_45%,transparent_70%)] blur-md" />
          <span className="relay-earth-ping invisible absolute inset-0 rounded-full border-2 border-[#89AACC]" />
          <Image
            src="/personal/orbit/earth.png"
            alt="Earth"
            width={480}
            height={480}
            sizes="240px"
            draggable={false}
            className="relative h-full w-full select-none drop-shadow-[0_0_30px_rgba(78,133,191,0.35)] transition-transform duration-700 ease-out hover:scale-105"
          />
          {/* Status tag on a tether, pivoting where it hangs from Earth. */}
          <AnimatePresence>
            {earthHover && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 260, damping: 14 }}
                style={{ rotate: swing, transformOrigin: "50% 0%" }}
                className="pointer-events-none absolute left-1/2 top-[92%] -ml-px flex w-0 flex-col items-center"
              >
                <span className="h-7 w-px bg-gradient-to-b from-transparent to-white/40" />
                <p
                  aria-live="polite"
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border border-stroke bg-bg/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-primary/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md md:text-[11px]"
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${linked ? "animate-pulse bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-red-400/80"}`}
                  />
                  {linked ? "Link established" : "Signal blocked by Earth"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The satellite: on the ring, dish to Earth. Drag it; it comes back. */}
      <div
        ref={satRef}
        data-grab
        aria-label="Satellite in orbit around Earth. Drag it along or off its orbit."
        className="group absolute left-0 top-0 z-[7] cursor-grab touch-none select-none will-change-transform data-[grabbed]:cursor-grabbing"
        style={{ transform: "translate3d(-300px, -300px, 0)" }}
      >
        <span className="relay-sat-ping invisible absolute inset-0 rounded-full border border-[#89AACC]" />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
          <Image
            src="/personal/orbit/satellite.png"
            alt=""
            width={320}
            height={242}
            sizes="150px"
            draggable={false}
            className={`h-auto w-full transition-[filter] duration-500 ${
              linked
                ? "drop-shadow-[0_0_18px_rgba(137,170,204,0.6)]"
                : "drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(137,170,204,0.45)]"
            }`}
          />
        </motion.div>
      </div>

      {/* "Drag me!": the satellite says it once a few seconds in, then on hover. */}
      <div ref={hintRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-30" style={{ transform: "translate3d(-300px, -300px, 0)" }}>
        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 11 }}
              className="origin-bottom-left pb-3"
            >
              <SpeechBubble />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rocket fly-by, behind the content; grab it and throw it. */}
      <div aria-hidden className="relay-rocket invisible absolute left-0 top-0 z-[3] w-6 cursor-grab touch-none select-none data-[grabbed]:cursor-grabbing md:w-7">
        <div className="relay-rocket-body">
          <Image src="/personal/orbit/rocket.png" alt="" width={107} height={200} sizes="28px" draggable={false} className="h-auto w-full drop-shadow-[0_0_10px_rgba(255,140,60,0.35)]" />
        </div>
      </div>

      {/* Orbit ring and the link sit under Earth, so both tuck behind it. */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-[4] h-full w-full overflow-visible">
        <ellipse ref={orbitRef} fill="none" stroke="#89AACC" strokeOpacity={0.14} strokeWidth={1} strokeDasharray="2 6" />
        <path
          ref={linkRef}
          pathLength={1}
          fill="none"
          stroke="#89AACC"
          strokeOpacity={0.25}
          strokeWidth={2}
          strokeDasharray="1 1"
          strokeDashoffset={1}
          style={{ filter: "drop-shadow(0 0 6px #4E85BF)" }}
        />
        <path
          ref={carrierRef}
          className="invisible"
          fill="none"
          stroke="#89AACC"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="2 10"
        />
        <path
          ref={packetsRef}
          className="invisible"
          fill="none"
          stroke="#F5F5F5"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="18 92"
          style={{ filter: "drop-shadow(0 0 6px #89AACC) drop-shadow(0 0 12px #4E85BF)" }}
        />
        <path
          ref={burstRef}
          pathLength={1}
          className="invisible"
          fill="none"
          stroke="#F5F5F5"
          strokeWidth={2.5}
          strokeDasharray="1 1"
          strokeDashoffset={1}
          style={{ filter: "drop-shadow(0 0 8px #89AACC)" }}
        />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
        <path
          ref={upRef}
          pathLength={1}
          className="invisible"
          fill="none"
          stroke="#89AACC"
          strokeWidth={1.5}
          strokeDasharray="1 1"
          strokeDashoffset={1}
          style={{ filter: "drop-shadow(0 0 6px #4E85BF)" }}
        />
      </svg>

      {/* Content, centred on top of the backdrop: text left, form right. */}
      <div className="pointer-events-none relative z-10 mx-auto grid h-full w-full max-w-6xl content-center items-center gap-6 px-6 pt-16 md:grid-cols-[1fr_1fr] md:gap-14 md:px-10 md:pt-0">
        <div className="contact-rise flex flex-col items-start">
          <h2 className="mb-3 text-3xl leading-[1.05] tracking-tight text-text-primary md:mb-4 md:text-5xl lg:text-6xl">
            Have something worth <span className="font-display italic">building?</span>
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-text-primary/70 md:text-base">
            Tell me what you&apos;re building and where it&apos;s stuck. Every
            message reaches me directly, and I reply personally.
          </p>

          <div className="pointer-events-auto flex flex-wrap items-center gap-3">
            <button
              data-cal-link="mustafa-patharia/quick-chat"
              data-cal-namespace="quick-chat"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              className="cosmic-btn group relative rounded-full transition-transform duration-300 hover:scale-105"
            >
              <span
                className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ inset: "-2px" }}
              />
              <span className="relative flex items-center gap-2 rounded-full bg-text-primary px-6 py-3 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
                Book a call
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </span>
            </button>

            <button
              onClick={copyEmail}
              aria-label={`Copy ${EMAIL}`}
              className="cosmic-btn group relative order-last rounded-full transition-transform duration-300 hover:scale-105 md:order-none"
            >
              <span
                className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ inset: "-2px" }}
              />
              <span className="relative block min-w-[13.5rem] rounded-full border-2 border-stroke bg-bg px-6 py-3 text-sm text-text-primary transition-colors duration-300 group-hover:border-transparent">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "email"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {copied ? "Copied to clipboard" : EMAIL}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>

            <nav aria-label="Social profiles" className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-surface/60 text-muted backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#89AACC]/60 hover:text-text-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    {s.icon}
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="contact-rise pointer-events-auto relative flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-surface/60 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-500 focus-within:border-[#89AACC]/40 md:p-6"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Transmission</span>
            <span className="flex items-center gap-2 text-[11px] text-muted">
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#89AACC] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#89AACC]" />
              </span>
              Relay online
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" autoComplete="name" placeholder="Your name" maxLength={120} className="contact-field" />
            <input name="email" type="email" required autoComplete="email" placeholder="Email" maxLength={200} className="contact-field" />
          </div>
          <textarea
            name="message"
            required
            rows={3}
            maxLength={4000}
            placeholder="What are you building, and what do you need?"
            className="contact-field resize-none"
          />
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="min-h-[1.25rem] text-xs text-muted">
              {status === "sending" && "Uplinking to the relay…"}
              {status === "sent" && "Received. I’ll be in touch shortly."}
              {status === "error" && <span className="text-red-300/90">{error}</span>}
            </p>
            <button
              ref={sendRef}
              type="submit"
              disabled={status === "sending"}
              className="cosmic-btn group relative rounded-full transition-transform duration-300 hover:scale-105 disabled:pointer-events-none disabled:opacity-60"
            >
              <span
                className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ inset: "-2px" }}
              />
              <span className="relative flex items-center gap-2 rounded-full bg-text-primary px-6 py-3 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
                {status === "sending" ? "Sending…" : "Send transmission"}
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// The satellite "types" for a beat, then speaks.
function SpeechBubble() {
  const [typed, setTyped] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setTyped(true), 550);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="relative rounded-2xl rounded-bl-[4px] bg-text-primary px-3.5 py-2 text-xs font-medium text-bg shadow-[0_12px_30px_-8px_rgba(0,0,0,0.7)]">
      <AnimatePresence mode="wait" initial={false}>
        {typed ? (
          <motion.span key="text" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="block whitespace-nowrap">
            Drag me!
          </motion.span>
        ) : (
          <motion.span key="dots" exit={{ opacity: 0 }} className="flex h-4 items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                className="h-1 w-1 rounded-full bg-bg/70"
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
      {/* Tail, pointing down-left at the satellite. */}
      <span className="absolute -bottom-[5px] left-0 h-3 w-3 bg-text-primary [clip-path:polygon(0_0,100%_0,0_100%)]" />
    </div>
  );
}
