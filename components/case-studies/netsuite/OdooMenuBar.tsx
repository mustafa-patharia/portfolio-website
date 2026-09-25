"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* The addon's real top-level menu. Each chapter of the page is one of these menus. */
export const MENUS = [
  { id: "overview", label: "Overview" },
  { id: "configuration", label: "Configuration" },
  { id: "mappings", label: "Master Data Mappings" },
  { id: "sync", label: "Sync to NetSuite" },
  { id: "logs", label: "Sync Logs" },
];

export default function OdooMenuBar() {
  const [active, setActive] = useState(MENUS[0].id);
  const nav = useRef<HTMLElement>(null);

  // On narrow screens the bar scrolls sideways; keep the current chapter in view.
  useEffect(() => {
    const bar = nav.current;
    const link = bar?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (bar && link) bar.scrollTo({ left: link.offsetLeft - 12, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    MENUS.forEach((m) => {
      const el = document.getElementById(m.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className=" top-[76px] z-40 px-4 md:top-[92px] md:px-10">
      <nav
        ref={nav}
        aria-label="Case study chapters"
        className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto rounded-lg border border-odoo-400/20 bg-odoo-600/90 px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md [scrollbar-width:none]"
      >
        <span className="mr-2 hidden shrink-0 items-center gap-2 pl-1 text-sm font-medium text-white sm:flex">
          <span className="grid grid-cols-3 gap-[2px]" aria-hidden>
            {Array.from({ length: 9 }).map((_, k) => (
              <span key={k} className="h-[3px] w-[3px] rounded-[1px] bg-white/80" />
            ))}
          </span>
          Netsuite
        </span>
        {MENUS.map((m) => {
          const on = m.id === active;
          return (
            <a
              key={m.id}
              href={`#${m.id}`}
              onClick={go(m.id)}
              className={`relative shrink-0 rounded-md px-2.5 py-1 text-xs transition-colors duration-200 md:px-3 md:text-[13px] ${on ? "text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
            >
              {on && (
                <motion.span
                  layoutId="odoo-menu-active"
                  className="absolute inset-0 rounded-md bg-black/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{m.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
