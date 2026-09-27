// The home page is one pinned stage; scroll plays a master timeline through
// these scenes. `at` is the timeline position (in screen-heights of scroll)
// where the scene is fully settled — it doubles as the snap/nav label.
export const SCENES = [
  { id: "home", title: "Home", at: 0, note: "" },
  { id: "about", title: "About", at: 1.6, note: "Statement, portrait and proof numbers." },
  { id: "work", title: "Work", at: 3, note: "Seven case studies on a ring around the camera." },
  { id: "capabilities", title: "Capabilities", at: 6, note: "Horizontal track of what I build, each tied to its proof project." },
  { id: "journey", title: "My Journey", at: 8.5, note: "A corridor of roles you fly through." },
  { id: "contact", title: "Contact", at: 11, note: "Back at the black hole — booking, email and socials." },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const JOURNEY_LENGTH = SCENES[SCENES.length - 1].at;

/** Scrubbed by the master timeline, read each frame by the hero black hole:
 *  `center` slides it from the top half to mid-screen, `zoom` flies the
 *  camera through the horizon. */
export const dive = { center: 0, zoom: 0 };

/** Fired on window with the settled scene id whenever it changes. */
export const SCENE_EVENT = "journey:scene";

let jump: ((id: string) => boolean) | null = null;

export function setJourneyJump(fn: typeof jump) {
  jump = fn;
}

/** Scrolls to a scene label. Returns false when the stage isn't mounted. */
export function jumpToScene(id: string) {
  return jump?.(id) ?? false;
}
