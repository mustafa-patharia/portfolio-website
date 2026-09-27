export default function GlobalBackground() {
  return (
    <div
      className="global-bg absolute inset-0 pointer-events-none -z-50 opacity-50"
      style={{
        backgroundImage: "url('/bg-pattern-2.jpg')",
        backgroundSize: "100% auto",
        backgroundRepeat: "repeat",
        // The home journey turns the sky sideways with the work ring.
        backgroundPositionX: "var(--sky-x, 0px)",
      }}
    />
  );
}
