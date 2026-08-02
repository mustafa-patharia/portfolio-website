"use client";

/**
 * Generated cover art — layered mesh gradients + a grid, no image assets.
 * `seed` picks a palette so each card reads distinctly.
 */

const PALETTES = [
  ["#89AACC", "#4E85BF", "#1b2a3a"],
  ["#7f9fbf", "#2f5d8a", "#141d26"],
  ["#9db8d4", "#3c6f9e", "#101820"],
  ["#6f93b8", "#264a70", "#0d141b"],
  ["#a8c0d8", "#4a7ba8", "#161f29"],
  ["#84a6c6", "#356491", "#121a22"],
];

export default function ProjectArt({
  seed,
  label,
  compact = false,
}: {
  seed: number;
  label?: string;
  compact?: boolean;
}) {
  const [a, b, c] = PALETTES[seed % PALETTES.length];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: c }} />

      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110"
        style={{
          backgroundImage: [
            `radial-gradient(60% 60% at ${20 + (seed % 3) * 22}% 25%, ${a}80 0%, transparent 65%)`,
            `radial-gradient(55% 70% at ${70 - (seed % 2) * 18}% 78%, ${b}90 0%, transparent 60%)`,
            `radial-gradient(40% 40% at 85% 15%, ${a}45 0%, transparent 70%)`,
          ].join(", "),
        }}
      />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {label && (
        <span
          className={
            compact
              ? "pointer-events-none absolute inset-0 flex items-center justify-center font-display text-lg italic leading-none text-white/80"
              : "pointer-events-none absolute bottom-5 left-6 font-display text-[80px] italic leading-none text-white/10 md:text-[120px]"
          }
        >
          {label}
        </span>
      )}
    </div>
  );
}
