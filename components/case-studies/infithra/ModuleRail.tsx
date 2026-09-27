"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Blocks, CalendarClock, Cable, KeyRound, Layers, Rocket, Settings2, Users, Wallet } from "lucide-react";

/* The page's chapters, laid out like the HR console's own sidebar. */
export const CHAPTERS = [
  { id: "overview", label: "Overview", icon: Users },
  { id: "scope", label: "Platform Scope", icon: Blocks },
  { id: "foundations", label: "Foundations", icon: Layers },
  { id: "payroll", label: "Payroll", icon: Wallet },
  { id: "access", label: "Access Control", icon: KeyRound },
  { id: "configuration", label: "Configuration", icon: Settings2 },
  { id: "scheduling", label: "Scheduling", icon: CalendarClock },
  { id: "integrations", label: "Integrations", icon: Cable },
  { id: "delivery", label: "Delivery", icon: Rocket },
];

export default function ModuleRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Past the chapters (the marker is above 60% of the viewport), the rail hides.
    const end = document.getElementById("chapters-end");
    const pastEnd = () => !!end && end.getBoundingClientRect().top < window.innerHeight * 0.6;

    const observer = new IntersectionObserver(
      (entries) => {
        if (pastEnd()) return setActive(null);
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.chapter ?? e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    // Follow-on sections that belong to a chapter (e.g. the scheduler catalogue).
    document.querySelectorAll("[data-chapter]").forEach((el) => observer.observe(el));

    // A scroll check catches fast scrolls that jump straight past the marker.
    const onScroll = () => {
      if (pastEnd()) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const current = CHAPTERS.find((c) => c.id === active);

  return (
    <>
      {/* desktop: icon sidebar that expands on hover */}
      <AnimatePresence>
        {current && (
          <motion.nav
            aria-label="Case study chapters"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="group/rail fixed left-4 top-0 bottom-0 z-40 my-auto hidden h-fit flex-col gap-1 rounded-2xl border border-inf-400/20 bg-inf-900/85 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md xl:flex"
          >
            {CHAPTERS.map((c) => {
              const on = c.id === active;
              const Icon = c.icon;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  onClick={go(c.id)}
                  className={`relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] transition-colors duration-200 ${on ? "text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="inf-rail-active"
                      className="absolute inset-0 rounded-xl bg-inf-600"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {on && <span className="absolute -left-1.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-ipink-500" />}
                  <Icon className="relative h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="relative max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover/rail:max-w-[140px] group-hover/rail:opacity-100">
                    {c.label}
                  </span>
                </a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* mobile and tablet: a floating pill naming the current module */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pointer-events-none fixed inset-x-0 top-[78px] z-40 flex justify-center md:top-[96px] xl:hidden"
          >
            <div className="flex items-center gap-2 rounded-full border border-inf-400/30 bg-inf-900/90 px-4 py-2 font-mono text-[11px] text-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-ipink-500" />
              <AnimatePresence mode="wait">
                <motion.span key={current.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
                  {current.label}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/35">
                {CHAPTERS.indexOf(current) + 1}/{CHAPTERS.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
