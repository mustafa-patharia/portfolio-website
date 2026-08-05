"use client";

import { useMemo } from "react";

/**
 * Reusable animated system-architecture diagram.
 * Visual language ported from the standalone Rift architecture.html:
 * glass nodes on labeled bands, glowing gradient orbs, animated flow wires.
 */

export type ArchIcon =
  | "window"
  | "layers"
  | "db"
  | "cloud"
  | "server"
  | "globe"
  | "lock"
  | "key"
  | "git"
  | "terminal"
  | "phone"
  | "cpu"
  | "queue"
  | "search"
  | "drive";

export interface ArchNode {
  id: string;
  band: number;
  colFrac: number; // 0..1 horizontal position within the diagram
  w?: number;
  h?: number;
  icon: ArchIcon;
  title: string;
  sub: string[];
  variant?: "default" | "seam" | "ext";
}

export type WireType = "ctrl" | "data" | "net";

export interface ArchWire {
  from: string;
  to: string;
  type: WireType;
}

export interface ArchitectureDiagramProps {
  bands: { label: string; h: number }[];
  nodes: ArchNode[];
  wires: ArchWire[];
  legend?: { type: WireType; label: string }[];
  note?: string;
}

const ICONS: Record<ArchIcon, string> = {
  window: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/><path d="M6.5 6.5h.01M9 6.5h.01"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  db: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  cloud: '<path d="M6.5 19a4.5 4.5 0 0 1-.5-8.98A6 6 0 0 1 17.6 8.2 4.5 4.5 0 0 1 17 19H6.5z"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.2"/>',
  key: '<circle cx="8" cy="12" r="4"/><path d="M11.5 11h9"/><path d="M17.5 11v3.5"/><path d="M20.5 11v2.5"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5V15.5"/><path d="M6 8.5c0 4 3 5.5 6 5.5h3.5"/><path d="M18 6.5v0"/>',
  terminal: '<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><path d="M6.5 9l4 3-4 3"/><path d="M12.5 15h5"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  cpu: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="2.5" y="10" width="3" height="4"/><rect x="18.5" y="10" width="3" height="4"/><rect x="10" y="2.5" width="4" height="3"/><rect x="10" y="18.5" width="4" height="3"/>',
  queue: '<rect x="3" y="6" width="6" height="12" rx="1.5"/><rect x="9.5" y="6" width="6" height="12" rx="1.5"/><rect x="16" y="6" width="6" height="12" rx="1.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
  drive: '<rect x="3" y="7" width="18" height="10" rx="2.5"/><path d="M3 12h18"/><circle cx="7" cy="14.5" r="1"/>',
};

const DEFAULT_LEGEND: { type: WireType; label: string }[] = [
  { type: "ctrl", label: "Control flow" },
  { type: "data", label: "Data & state" },
  { type: "net", label: "Network" },
];

/* Cosmic palette only — one hue, three brightness steps. */
const WIRE_COLOR: Record<WireType, string> = {
  ctrl: "#f0f4f8",
  data: "#89aacc",
  net: "#4e85bf",
};

const W = 1000;

export default function ArchitectureDiagram({
  bands,
  nodes,
  wires,
  legend = DEFAULT_LEGEND,
  note,
}: ArchitectureDiagramProps) {
  const { bandLayout, nodeLayout, height } = useMemo(() => {
    const gap = 78;
    let y = 40;
    const bandLayout = bands.map((b) => {
      const h = b.h + 32; // breathing room around the nodes inside each band
      const layout = { ...b, y, h };
      y += h + gap;
      return layout;
    });
    const height = y + 10;

    const nodeLayout = nodes.map((n) => {
      const band = bandLayout[n.band];
      const w = n.w ?? 220;
      const h = n.h ?? 78;
      const cx = 40 + n.colFrac * (W - 80);
      const ny = band.y + (band.h - h) / 2;
      return { ...n, w, h, cx, y: ny };
    });

    return { bandLayout, nodeLayout, height };
  }, [bands, nodes]);

  const nodeMap = useMemo(
    () => Object.fromEntries(nodeLayout.map((n) => [n.id, n])),
    [nodeLayout]
  );

  const wirePaths = useMemo(
    () =>
      wires.map((w, i) => {
        const a = nodeMap[w.from];
        const b = nodeMap[w.to];
        if (!a || !b) return null;
        // Same band → straight edge-to-edge line. Different bands → vertical S-curve,
        // leaving from the facing edge so wires never loop back on themselves.
        if (a.band === b.band) {
          const [l, r] = a.cx <= b.cx ? [a, b] : [b, a];
          const y = l.y + l.h / 2;
          const d = `M${l.cx + l.w / 2},${y} L${r.cx - r.w / 2},${r.y + r.h / 2}`;
          return { id: `w${i}`, d, type: w.type };
        }
        const downward = b.y > a.y;
        const start = { x: a.cx, y: downward ? a.y + a.h : a.y };
        const end = { x: b.cx, y: downward ? b.y : b.y + b.h };
        const dy = end.y - start.y;
        const d = `M${start.x},${start.y} C${start.x},${start.y + dy * 0.5} ${end.x},${end.y - dy * 0.5} ${end.x},${end.y}`;
        return { id: `w${i}`, d, type: w.type };
      }),
    [wires, nodeMap]
  );

  return (
    <div className="relative">

      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="relative z-10 w-full"
        role="img"
        aria-label="System architecture diagram"
      >
        <defs>
          <filter id="arch-soft" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Cosmic glass gradients — deep blue top-light, fading to void */}
          <linearGradient id="arch-g-node" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#89aacc" stopOpacity="0.16" />
            <stop offset="55%" stopColor="#4e85bf" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="arch-g-seam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a9c6e4" stopOpacity="0.34" />
            <stop offset="50%" stopColor="#4e85bf" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#89aacc" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="arch-g-ext" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4e85bf" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#4e85bf" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="arch-g-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#89aacc" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4e85bf" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="arch-g-seam-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#89aacc" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#e8f1fb" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4e85bf" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="arch-g-halo">
            <stop offset="0%" stopColor="#89aacc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#89aacc" stopOpacity="0" />
          </radialGradient>
          <filter id="arch-glow" x="-40%" y="-90%" width="180%" height="280%">
            <feGaussianBlur stdDeviation="9" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {Object.entries(ICONS).map(([key, path]) => (
            <symbol key={key} id={`arch-ic-${key}`} viewBox="0 0 24 24">
              <g dangerouslySetInnerHTML={{ __html: path }} />
            </symbol>
          ))}
        </defs>

        {bandLayout.map((b, i) => (
          <g key={i}>
            <rect
              x={16}
              y={b.y}
              width={W - 32}
              height={b.h}
              rx={16}
              fill="rgba(255,255,255,0.015)"
              stroke="hsl(var(--stroke))"
              strokeDasharray="2 8"
            />
            <text
              x={18}
              y={b.y - 10}
              fontSize="10.5"
              fontWeight={700}
              letterSpacing="0.14em"
              fill="hsl(var(--muted))"
              className="uppercase"
            >
              {b.label}
            </text>
          </g>
        ))}

        {wirePaths.map(
          (w) =>
            w && (
              <g key={w.id}>
                <path
                  id={w.id}
                  d={w.d}
                  fill="none"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeDasharray="4 9"
                  stroke={WIRE_COLOR[w.type]}
                  opacity={0.3}
                  style={{ animation: "arch-flow 1.1s linear infinite" }}
                />
                {[0].map((k) => (
                  <circle key={k} r={2.4} fill={WIRE_COLOR[w.type]} filter="url(#arch-soft)">
                    <animateMotion
                      dur="3.4s"
                      repeatCount="indefinite"
                      begin={`${k * 1.7}s`}
                      rotate="auto"
                    >
                      <mpath href={`#${w.id}`} />
                    </animateMotion>
                  </circle>
                ))}
              </g>
            )
        )}

        {nodeLayout.map((n) => {
          const x = n.cx - n.w / 2;
          const isSeam = n.variant === "seam";
          const isExt = n.variant === "ext";
          const fill = isSeam
            ? "url(#arch-g-seam)"
            : isExt
            ? "url(#arch-g-ext)"
            : "url(#arch-g-node)";
          const stroke = isSeam
            ? "url(#arch-g-seam-stroke)"
            : isExt
            ? "rgba(78,133,191,0.45)"
            : "url(#arch-g-stroke)";
          const titleColor = isSeam ? "#cfe1f2" : "hsl(var(--text))";
          const iconColor = isSeam ? "#89aacc" : isExt ? "#4e85bf" : "hsl(var(--text))";
          const iconSize = 20;
          const ix = x + 16;
          const iy = n.y + n.h / 2 - iconSize / 2;
          const tx = ix + iconSize + 12;
          const titleY = n.sub.length > 1 ? n.y + n.h / 2 - 6 : n.y + n.h / 2 - 2;

          return (
            <g key={n.id} className="group">
              {isSeam && (
                <ellipse
                  cx={n.cx}
                  cy={n.y + n.h / 2}
                  rx={n.w * 0.75}
                  ry={n.h * 0.9}
                  fill="url(#arch-g-halo)"
                />
              )}
              <rect
                x={x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={14}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSeam ? 1.4 : 1}
                filter={isSeam ? "url(#arch-glow)" : undefined}
              />
              {/* glass top highlight */}
              <path
                d={`M${x + 14},${n.y + 0.6} H${x + n.w - 14}`}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={1}
                strokeLinecap="round"
                fill="none"
              />
              <use
                href={`#arch-ic-${n.icon}`}
                x={ix}
                y={iy}
                width={iconSize}
                height={iconSize}
                fill="none"
                stroke={iconColor}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x={tx} y={titleY} fontSize="13" fontWeight={650} fill={titleColor}>
                {n.title}
              </text>
              {n.sub.map((s, si) => (
                <text
                  key={si}
                  x={tx}
                  y={titleY + 15 + si * 12.5}
                  fontSize="10"
                  fill="hsl(var(--muted))"
                >
                  {s}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      <style>{`@keyframes arch-flow { to { stroke-dashoffset: -24; } }`}</style>

      <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-6 text-xs text-muted">
        {legend.map((l) => (
          <span key={l.type} className="flex items-center gap-2">
            <span
              className="h-[3px] w-6 rounded-full"
              style={{ background: WIRE_COLOR[l.type] }}
            />
            {l.label}
          </span>
        ))}
      </div>
      {note && (
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted">
          {note}
        </p>
      )}
    </div>
  );
}
