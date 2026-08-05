const ICON_MAP: Record<string, string> = {
  Swift: "swift",
  SwiftUI: "swift",
  SwiftData: "swift",
  macOS: "apple",
  "macOS Menu Bar": "apple",
  "Node.js": "nodejs",
  Angular: "angular",
  "Next.js": "nextjs",
  AWS: "aws",
  PostgreSQL: "postgres",
  Redis: "redis",
};

export default function TechPill({ name }: { name: string }) {
  const icon = ICON_MAP[name];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-bg/50 px-3 py-1 text-xs uppercase tracking-[0.15em] text-muted md:text-sm">
      {icon && (
        <img
          src={`https://skillicons.dev/icons?i=${icon}`}
          alt=""
          className="h-4 w-4 shrink-0 object-contain"
          loading="lazy"
        />
      )}
      {name}
    </span>
  );
}
