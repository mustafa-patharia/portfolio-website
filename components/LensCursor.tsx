"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Site-wide version of the hero's cursor lens: a tiny black hole (shadow and
// photon ring) that drifts after the pointer like a mass. Wherever the page
// shows a real cursor (links, buttons, fields, grab handles) it lets go and
// the native cursor returns. Over a black-hole canvas the WebGL lens takes
// over (html.lens-cursor), so the two never show at once.
export default function LensCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current!;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("site-cursor");

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let on = false;
    let fresh = true;

    const show = (next: boolean) => {
      if (next === on) return;
      on = next;
      el.style.opacity = next ? "1" : "0";
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return show(false);
      target.x = e.clientX;
      target.y = e.clientY;
      if (fresh) {
        pos.x = target.x;
        pos.y = target.y;
        fresh = false;
      }
      const t = e.target as Element | null;
      const native = t instanceof Element && getComputedStyle(t).cursor !== "none";
      show(!native && !root.classList.contains("lens-cursor"));
    };
    const onLeave = () => {
      show(false);
      fresh = true;
    };

    // Same drift as the WebGL lens (12% of the gap per frame).
    const tick = () => {
      const k = reduced ? 1 : 1 - Math.pow(0.88, gsap.ticker.deltaRatio(60));
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (on && root.classList.contains("lens-cursor")) show(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    return () => {
      root.classList.remove("site-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[10000] opacity-0 transition-opacity duration-300"
    >
      <span className="absolute -left-[13px] -top-[13px] h-[26px] w-[26px] rounded-full bg-black shadow-[0_0_0_2px_rgba(137,170,204,0.75),0_0_14px_3px_rgba(137,170,204,0.35),0_0_32px_8px_rgba(78,133,191,0.15)]" />
    </div>
  );
}
