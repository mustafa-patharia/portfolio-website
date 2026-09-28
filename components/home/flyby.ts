import gsap from "gsap";
import { crossing } from "./journey";

const MARGIN = 140; // px past the edge before a flyer counts as gone
const MAX_THROW = 2600; // px/s

/**
 * Drives one fly-by element (comet, asteroid, rocket) positioned at the top
 * left of a full-screen parent. `launch` sends it on a random crossing at
 * `speed` px/s; the visitor can grab it mid-flight and throw it off course.
 * In zero-g it keeps whatever velocity it's given until it leaves the screen,
 * then hides and calls back.
 *
 * `art` is the direction the artwork itself points, in screen degrees
 * (-90 = up); the flyer is turned to face where it's going. Leave it out and
 * the flyer tumbles instead.
 */
export function flyby(el: HTMLElement, { speed, art }: { speed: number; art?: number }) {
  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  let rot = 0;
  let spin = 0;
  let live = false;
  let onDone: (() => void) | null = null;
  let grab: { id: number; ox: number; oy: number; px: number; py: number; t: number } | null = null;

  const parent = () => el.offsetParent as HTMLElement;
  const local = (e: PointerEvent) => {
    const r = parent().getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const finish = () => {
    live = false;
    grab = null;
    delete el.dataset.grabbed;
    gsap.ticker.remove(tick);
    gsap.set(el, { autoAlpha: 0 });
    const cb = onDone;
    onDone = null;
    cb?.();
  };

  function tick(_: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    if (!grab) {
      x += vx * dt;
      y += vy * dt;
    }
    if (art === undefined) {
      rot += spin * dt;
    } else if (Math.hypot(vx, vy) > 30) {
      // Swing the nose round to the direction of travel.
      const want = (Math.atan2(vy, vx) * 180) / Math.PI - art;
      const gap = ((((want - rot) % 360) + 540) % 360) - 180;
      rot += gap * (1 - Math.exp(-dt * (grab ? 10 : 4)));
    }
    gsap.set(el, { x, y, rotation: rot });

    const p = parent();
    if (!grab && (x < -MARGIN || x > p.clientWidth + MARGIN || y < -MARGIN || y > p.clientHeight + MARGIN)) finish();
  }

  const onDown = (e: PointerEvent) => {
    if (!live || grab) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const p = local(e);
    grab = { id: e.pointerId, ox: x - p.x, oy: y - p.y, px: p.x, py: p.y, t: performance.now() };
    vx = vy = 0;
    el.dataset.grabbed = "";
  };
  const onMove = (e: PointerEvent) => {
    if (!grab || e.pointerId !== grab.id) return;
    const p = local(e);
    const now = performance.now();
    const dt = Math.max((now - grab.t) / 1000, 1 / 240);
    // Smoothed hand speed, so the throw is what the hand was doing lately.
    vx = vx * 0.6 + ((p.x - grab.px) / dt) * 0.4;
    vy = vy * 0.6 + ((p.y - grab.py) / dt) * 0.4;
    x = p.x + grab.ox;
    y = p.y + grab.oy;
    grab.px = p.x;
    grab.py = p.y;
    grab.t = now;
  };
  const onUp = (e: PointerEvent) => {
    if (!grab || e.pointerId !== grab.id) return;
    // Held still before letting go: no throw left in it.
    if (performance.now() - grab.t > 100) vx = vy = 0;
    let v = Math.hypot(vx, vy);
    if (v > MAX_THROW) {
      vx *= MAX_THROW / v;
      vy *= MAX_THROW / v;
      v = MAX_THROW;
    }
    // Dropped rather than thrown: drift on at cruising speed, the way it
    // was pointing (or was last pushed).
    if (v < speed) {
      const a = v > 1 ? Math.atan2(vy, vx) : art === undefined ? Math.random() * Math.PI * 2 : ((rot + art) * Math.PI) / 180;
      vx = Math.cos(a) * speed;
      vy = Math.sin(a) * speed;
    }
    if (art === undefined) spin += (Math.random() - 0.5) * v * 0.3;
    grab = null;
    delete el.dataset.grabbed;
  };
  el.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  return {
    launch(done: () => void) {
      const p = parent();
      const path = crossing(p.clientWidth, p.clientHeight, 100);
      const a = (path.heading * Math.PI) / 180;
      x = path.x0;
      y = path.y0;
      vx = Math.cos(a) * speed;
      vy = Math.sin(a) * speed;
      rot = art === undefined ? Math.random() * 360 : path.heading - art;
      spin = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 40);
      onDone = done;
      live = true;
      gsap.set(el, { xPercent: -50, yPercent: -50, x, y, rotation: rot, autoAlpha: 1 });
      gsap.ticker.remove(tick);
      gsap.ticker.add(tick);
    },
    /** Hides it and drops any pending callback. */
    stop() {
      onDone = null;
      if (live) finish();
    },
    dispose() {
      this.stop();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    },
  };
}
