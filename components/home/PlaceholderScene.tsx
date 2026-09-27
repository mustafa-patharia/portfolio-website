// Stand-in for scenes not built yet, so the stage engine (pin, snap, nav,
// transitions) can be judged end to end before each scene lands.
export default function PlaceholderScene({
  id,
  index,
  title,
  note,
}: {
  id: string;
  index: number;
  title: string;
  note: string;
}) {
  return (
    <section
      id={id}
      data-scene={id}
      aria-label={title}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="flex aspect-video w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-stroke bg-surface/40 p-6 text-center backdrop-blur-sm">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          Scene {String(index + 1).padStart(2, "0")} · in progress
        </span>
        <h2 className="font-display text-5xl italic text-text-primary md:text-7xl">
          {title}
        </h2>
        <p className="max-w-sm text-sm text-muted">{note}</p>
      </div>
    </section>
  );
}
