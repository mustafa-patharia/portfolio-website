"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SCENES, SCENE_EVENT, jumpToScene } from "./home/journey";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities", wide: true },
  { label: "My Journey", href: "#journey", wide: true },
  { label: "Case Studies", href: "/case-studies", page: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The home stage reports which scene is settled; mirror it in the pill.
  useEffect(() => {
    const onScene = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setActive(SCENES.find((s) => s.id === id)?.title ?? "Home");
    };
    window.addEventListener(SCENE_EVENT, onScene);
    return () => window.removeEventListener(SCENE_EVENT, onScene);
  }, []);

  const smoothTo = (e: React.MouseEvent, href: string, label?: string) => {
    e.preventDefault();
    if (label) setActive(label);

    if (pathname === "/") {
      jumpToScene(href.slice(1));
    } else {
      window.location.href = `/${href}`;
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-md shadow-black/10" : ""
          }`}
      >
        {/* Logo */}
        {/* <a
          href="#home"
          onClick={(e) => smoothTo(e, "#home", "Home")}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
          aria-label="Home"
        >
          <span className="accent-gradient absolute inset-0 rounded-full transition-all duration-500 group-hover:[background:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]" />
          <span className="absolute inset-[1.5px] flex items-center justify-center rounded-full bg-bg">
            <span className="font-display text-[13px] italic text-text-primary">
              MP
            </span>
          </span>
        </a> */}

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        {LINKS.map((link) =>
          link.page ? (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm ${pathname === link.href
                ? "bg-stroke/50 text-text-primary"
                : "text-muted hover:bg-stroke/50 hover:text-text-primary"
                }`}
            >
              {link.label}
            </a>
          ) : (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => smoothTo(e, link.href, link.label)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm ${link.wide ? "hidden md:inline-block" : ""
                } ${active === link.label
                  ? "bg-stroke/50 text-text-primary"
                  : "text-muted hover:bg-stroke/50 hover:text-text-primary"
                }`}
            >
              {link.label}
            </a>
          )
        )}

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        {/* Say hi */}
        <a
          href="#contact"
          onClick={(e) => smoothTo(e, "#contact")}
          className="group relative rounded-full"
        >
          <span
            className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ inset: "-2px" }}
          />
          <span className="relative flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs text-text-primary backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
            Say hi
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </span>
        </a>
      </nav>
    </header>
  );
}
