"use client";

import { useEffect, useRef } from "react";
import { SCENE_EVENT, dive } from "./journey";

// Real-time black hole for the hero. Each pixel traces a light ray that bends
// around the hole (Schwarzschild photon paths, a = −1.5·h²·r̂/r⁴, units of the
// Schwarzschild radius), picking up a thin accretion disc and a procedural
// starfield — so the lensed back of the disc arcs over the shadow on its own.
// The cursor is a second, screen-space point lens (β = θ − θE²/θ) that bends
// that light again. Scroll (via `dive`) slides the hole to centre, then flies
// the camera through the horizon. Screen-space cursor lens + RGB split idea
// adapted from Scenes3D/black-hole (MIT, after Bruno Simon's webgl-black-hole).

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uCenter;    // hole position on screen, 0..1 (y up)
uniform float uCamDist;  // in Schwarzschild radii
uniform float uTilt;     // camera elevation above the disc, radians
uniform float uFov;
uniform vec2 uLens;      // cursor lens, device px (y up)
uniform float uLensOn;
uniform float uEinstein;
uniform float uHorizon;
uniform vec3 uVoid;      // empty-space colour, before the tonemap

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
  return v;
}
// Noise that wraps every P cells in x, so the disc's angular texture has no seam.
float noiseP(vec2 p, float P) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x0 = mod(i.x, P), x1 = mod(i.x + 1.0, P);
  return mix(mix(hash(vec2(x0, i.y)), hash(vec2(x1, i.y)), u.x),
             mix(hash(vec2(x0, i.y + 1.0)), hash(vec2(x1, i.y + 1.0)), u.x), u.y);
}
float fbmP(vec2 p, float P) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noiseP(p, P); p = vec2(p.x * 2.0, p.y * 2.03 + 7.1); P *= 2.0; a *= 0.5; }
  return v;
}

vec3 stars(vec3 d) {
  vec2 uv = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0)));
  vec3 col = uVoid + vec3(0.02, 0.035, 0.07) * fbm(uv * 3.0) * fbm(uv * 1.3 + 4.0);
  for (int l = 0; l < 2; l++) {
    float scale = l == 0 ? 55.0 : 130.0;
    vec2 g = uv * scale, id = floor(g), f = fract(g) - 0.5;
    float h = hash(id + float(l) * 17.0);
    if (h > 0.965) {
      vec2 o = vec2(hash(id + 3.1), hash(id + 5.7)) - 0.5;
      float b = smoothstep(0.12, 0.0, length(f - o * 0.7)) * (h - 0.965) * 28.0;
      col += mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.85, 0.8), hash(id + 9.0)) * b;
    }
  }
  return col;
}

// Accretion disc sample at a plane crossing; returns colour, writes opacity.
vec3 disc(vec3 hp, vec3 dir, out float a) {
  float rr = length(hp.xz);
  a = 0.0;
  if (rr < 2.6 || rr > 13.0) return vec3(0.0);
  // Texture lives in (angle, radius) and orbits at Kepler speed, so inner
  // rings race ahead and the gas shears into streaks as it flows.
  float omega = 9.0 / pow(rr, 1.5);                    // rad/s
  float ang = fract(atan(hp.z, hp.x) / 6.28318 - uTime * omega / 6.28318);
  float n = fbmP(vec2(ang * 28.0, rr * 2.2), 28.0) * 0.7 + fbmP(vec2(ang * 10.0, rr * 0.8 + 3.0), 10.0) * 0.5;
  float t = smoothstep(13.0, 2.6, rr);                 // 1 at the hot inner edge
  // Site accent, pushed deeper: saturated blue outside, #4E85BF → #89AACC
  // through the middle, a pale ice-blue (never white) at the hot inner edge.
  vec3 col = mix(vec3(0.12, 0.24, 0.58), vec3(0.27, 0.47, 0.82), smoothstep(0.0, 0.5, t));
  col = mix(col, vec3(0.5, 0.66, 0.9), smoothstep(0.4, 0.8, t));
  col = mix(col, vec3(0.8, 0.88, 1.0), smoothstep(0.8, 1.0, t));
  vec3 v = normalize(vec3(-hp.z, 0.0, hp.x));          // orbital velocity
  float beam = 1.0 + 0.2 * dot(v, -normalize(dir));    // Doppler beaming
  a = smoothstep(13.0, 9.0, rr) * smoothstep(2.6, 3.4, rr) * clamp(0.25 + 0.8 * n, 0.0, 1.0);
  return col * (0.25 + 1.2 * n) * (0.45 + 1.3 * t * t) * beam * beam;
}

void main() {
  vec2 px = gl_FragCoord.xy;

  // Cursor lens: shift where this pixel "looks" before tracing the ray.
  vec2 d = px - uLens;
  float r = max(length(d), 1.0);
  vec2 dirL = d / r;
  float fade = smoothstep(uEinstein * 4.2, uEinstein * 1.4, r) * uLensOn;
  px -= dirL * fade * uEinstein * uEinstein / r;

  vec2 p = (px - uCenter * uRes) / uRes.y;

  vec3 cam = vec3(0.0, sin(uTilt), -cos(uTilt)) * uCamDist;
  vec3 fw = normalize(-cam);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 dir = normalize(fw + (p.x * rt + p.y * up) * uFov);
  vec3 pos = cam;

  float h2 = dot(cross(pos, dir), cross(pos, dir));
  vec3 col = vec3(0.0);
  float trans = 1.0;
  bool escaped = false;

  if (uCamDist > 1.0) {
    for (int i = 0; i < 120; i++) {
      float rad = length(pos);
      if (rad < 1.0) break;                            // swallowed by the horizon
      if (rad > 40.0 && dot(pos, dir) > 0.0) { escaped = true; break; }
      float dt = clamp(0.09 * rad, 0.03, 2.5);
      vec3 prev = pos;
      dir += -1.5 * h2 * pos / pow(rad, 5.0) * dt;
      pos += dir * dt;
      if (prev.y * pos.y < 0.0) {
        vec3 hp = mix(prev, pos, prev.y / (prev.y - pos.y));
        float a;
        vec3 dc = disc(hp, dir, a);
        col += trans * dc * a;
        trans *= 1.0 - a;
        if (trans < 0.02) break;
      }
    }
  }
  if (escaped) col += trans * stars(normalize(dir));

  // Per-channel tonemap: blue saturates last, so highlights stay blue.
  col = 1.0 - exp(-col * vec3(0.8, 1.0, 1.35));

  // Cursor lens' own shadow and photon ring, with a faint chromatic rim.
  float hz = uHorizon * uLensOn;
  float dr = length(gl_FragCoord.xy - uLens);
  col *= smoothstep(hz * 0.8, hz * 1.05, dr);
  float ring = exp(-pow((dr - hz * 1.12) / (hz * 0.14 + 0.5), 2.0)) * uLensOn;
  col += vec3(0.54, 0.67, 0.8) * ring * 0.7 + vec3(0.1, 0.0, 0.15) * fade * 0.25;

  gl_FragColor = vec4(col, 1.0);
}`;

const CAM_START = 16; // Schwarzschild radii — close enough that the half hole fills its band
// Empty space before the tonemap. The hero keeps its deep blue-black
// (#03040c on screen); the footer's tonemaps to the page's #0a0a0a so the
// canvas has no edge against the page.
const VOID_HERO = [0.012, 0.016, 0.028] as const;
const VOID_FOOTER = [0.0497, 0.0398, 0.0295] as const;
const FOOTER_Y = 0.06; // footer core height (0 = bottom edge) — raised so more than half the hole shows

/** `top` is the hero: core on the top edge, only the lower half shows until
 *  the scroll dives in. `bottom` is the site footer: core on the bottom edge,
 *  the upper half and the disc's lensed arc rising over it, no dive. */
export default function BlackHole({ at = "top" }: { at?: "top" | "bottom" }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A fresh canvas per run: cleanup loses the context, and a lost context
    // stays lost on a node React reuses for the next run.
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full opacity-0";
    hostRef.current!.appendChild(canvas);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return () => canvas.remove();

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => canvas.remove();
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: u("uRes"), time: u("uTime"), center: u("uCenter"), camDist: u("uCamDist"),
      tilt: u("uTilt"), fov: u("uFov"), lens: u("uLens"), lensOn: u("uLensOn"),
      einstein: u("uEinstein"), horizon: u("uHorizon"), void: u("uVoid"),
    };

    // Rendered below device resolution — the glow hides it, the GPU thanks us.
    let scale = 1;
    const resize = () => {
      scale = Math.min(window.devicePixelRatio || 1, 1.5) * (canvas.clientWidth < 768 ? 0.5 : 0.65);
      canvas.width = Math.round(canvas.clientWidth * scale);
      canvas.height = Math.round(canvas.clientHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // The cursor lens drifts after the pointer like a mass; over links and
    // buttons it lets go and the normal cursor returns.
    const target = { x: 0, y: 0, on: 0 };
    const lens = { x: 0, y: 0, on: 0 };
    const root = document.documentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
      const interactive = (e.target as Element | null)?.closest?.("a, button, nav, input, [role=button]");
      target.x = (e.clientX - rect.left) * scale;
      target.y = (rect.bottom - e.clientY) * scale;
      target.on = inside && !interactive && e.pointerType === "mouse" ? 1 : 0;
      if (lens.on < 0.01) { lens.x = target.x; lens.y = target.y; }
    };
    const onLeave = () => (target.on = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    // Only draw while the hole is on screen (the hero is the live scene, or
    // the footer is scrolled into view) — one WebGL canvas at a time.
    const hero = at === "top";
    let live = true;
    let seen = true;
    let active = true;
    let raf = 0;
    const sync = () => {
      const next = live && seen;
      if (next && !active) raf = requestAnimationFrame(frame);
      active = next;
      if (!next) root.classList.remove("lens-cursor");
    };
    const onScene = (e: Event) => {
      live = (e as CustomEvent<string>).detail === "home";
      sync();
    };
    if (hero) window.addEventListener(SCENE_EVENT, onScene);
    const io = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      sync();
    });
    if (!hero) io.observe(canvas);

    const start = performance.now();
    const frame = (now: number) => {
      if (!active) return;
      if (!reduced) raf = requestAnimationFrame(frame);

      const zoom = hero ? dive.zoom : 0;
      lens.x += (target.x - lens.x) * 0.12;
      lens.y += (target.y - lens.y) * 0.12;
      lens.on += (target.on * (1 - Math.min(1, zoom * 4)) - lens.on) * 0.08;
      root.classList.toggle("lens-cursor", lens.on > 0.3);

      const aspect = canvas.width / canvas.height;
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, reduced ? 20 : (now - start) / 1000);
      gl.uniform2f(U.center, 0.5, hero ? 1 - 0.5 * dive.center : FOOTER_Y);
      // Exponential approach: apparent size grows at a steady rate all the way in.
      gl.uniform1f(U.camDist, CAM_START * Math.pow(0.8 / CAM_START, zoom));
      gl.uniform1f(U.tilt, 0.1 + 0.18 * zoom);
      gl.uniform1f(U.fov, aspect < 1 ? 1 / (aspect * 1.1) : 1);
      gl.uniform2f(U.lens, lens.x, lens.y);
      gl.uniform1f(U.lensOn, lens.on);
      gl.uniform1f(U.einstein, 34 * scale);
      gl.uniform1f(U.horizon, 13 * scale);
      gl.uniform3f(U.void, ...(hero ? VOID_HERO : VOID_FOOTER));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.opacity = "1";
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener(SCENE_EVENT, onScene);
      root.classList.remove("lens-cursor");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [at]);

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-0" />
  );
}
