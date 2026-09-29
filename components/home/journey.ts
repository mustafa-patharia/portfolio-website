// The home page is one pinned stage; scroll plays a master timeline through
// these scenes. `at` is the timeline position (in screen-heights of scroll)
// where the scene is fully settled — it doubles as the snap/nav label.
export const SCENES = [
  { id: "home", title: "Home", at: 0, note: "" },
  { id: "about", title: "First Contact", at: 2, note: "The astronaut holds while the quote and three blocks step through." },
  { id: "work", title: "Missions", at: 4.4, note: "Seven case studies on a ring around the camera." },
  { id: "capabilities", title: "Capabilities", at: 7.4, note: "Horizontal track of what I build, each tied to its proof project." },
  { id: "journey", title: "My Journey", at: 9.9, note: "A corridor of roles you fly through." },
  { id: "contact", title: "Open Channel", at: 12.4, note: "Inside the hole — booking, email, socials and the satellite relay." },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const JOURNEY_LENGTH = SCENES[SCENES.length - 1].at;

/** Scrubbed by the master timeline, read each frame by the hero black hole:
 *  `center` slides it from the top half to mid-screen, `zoom` flies the
 *  camera through the horizon. */
export const dive = { center: 0, zoom: 0 };

/** Scrubbed by the master timeline, read each frame by the work ring:
 *  `form` flies the posters in from depth, `turn` is how many cards the
 *  ring has rotated past (0 → last case study). */
export const ring = { form: 0, turn: 0 };

/** Screens of scroll per beat inside About (labels `about-1`…): the
 *  quote's second half, then one beat per body block. */
export const ABOUT_STEP = 0.4;
export const ABOUT_BLOCKS = 3;

/** Screens of scroll per poster step inside the ring (labels `work-1`…). */
export const RING_STEP = 0.4;

/** Live timeline position in screen-heights, written by the stage on every
 *  scroll update and read each frame by the scene rail. */
export const progress = { t: 0 };

/** Where the timeline's playhead actually is (it trails the scroll while the
 *  scrub catches up), in the same units as `progress`. */
export const playhead = { t: 0 };

/** Calls `done` once the playhead has settled on `at` (or after `limit` ms,
 *  whichever is first). Returns the cancel. */
export function onArrive(at: number, done: () => void, limit = 5000) {
  const start = performance.now();
  let still = 0;
  let raf = requestAnimationFrame(function check(now) {
    still = Math.abs(playhead.t - at) < 0.01 ? still + 1 : 0;
    if (still > 3 || now - start > limit) return done();
    raf = requestAnimationFrame(check);
  });
  return () => cancelAnimationFrame(raf);
}

/** Fired on window with the settled scene id whenever it changes. */
export const SCENE_EVENT = "journey:scene";

let jump: ((id: string, instant: boolean) => number | null) | null = null;

export function setJourneyJump(fn: typeof jump) {
  jump = fn;
}

/** Scrolls to a scene label, flying through the journey or, `instant`,
 *  cutting the scroll straight there (the scrub then catches up; pair with
 *  `onArrive` behind a cover). Returns the label's time, or null when this
 *  page can't reach it. */
export function jumpToScene(id: string, instant = false) {
  return jump?.(id, instant) ?? null;
}

/** Calls `enter` each time scene `id` becomes the live one and `leave` when
 *  it stops being. Returns the unsubscribe. */
export function onSceneVisit(id: SceneId, enter: () => void, leave: () => void) {
  let inside = false;
  const handle = (e: Event) => {
    const now = (e as CustomEvent<string>).detail === id;
    if (now === inside) return;
    inside = now;
    (now ? enter : leave)();
  };
  window.addEventListener(SCENE_EVENT, handle);
  return () => window.removeEventListener(SCENE_EVENT, handle);
}

/** A straight pass across a W×H view for fly-bys: a random heading through a
 *  random point near the middle, entering past one edge and leaving past the
 *  opposite side, `margin` px off-screen at both ends. `heading` is in
 *  degrees, screen-space (0 = right, 90 = down). */
export function crossing(W: number, H: number, margin: number) {
  const p = { x: W * (0.2 + Math.random() * 0.6), y: H * (0.2 + Math.random() * 0.6) };
  const a = Math.random() * Math.PI * 2;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  // Distance from p to the margin box along (sx, sy).
  const reach = (sx: number, sy: number) =>
    Math.min(
      sx > 0 ? (W + margin - p.x) / sx : sx < 0 ? (-margin - p.x) / sx : Infinity,
      sy > 0 ? (H + margin - p.y) / sy : sy < 0 ? (-margin - p.y) / sy : Infinity
    );
  const back = reach(-dx, -dy);
  const fwd = reach(dx, dy);
  return {
    x0: p.x - dx * back,
    y0: p.y - dy * back,
    x1: p.x + dx * fwd,
    y1: p.y + dy * fwd,
    length: back + fwd,
    heading: (a * 180) / Math.PI,
  };
}
