"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import TechPill from "@/components/TechPill";
import ArchitectureDiagram, {
  type ArchNode,
  type ArchWire,
} from "../ArchitectureDiagram";

const ARCH_BANDS = [
  { label: "Interface", h: 76 },
  { label: "Coordinator", h: 64 },
  { label: "Playback seam", h: 64 },
  { label: "Sources", h: 84 },
  { label: "Data & services", h: 76 },
  { label: "External · network", h: 64 },
];

const ARCH_NODES: ArchNode[] = [
  { id: "win", band: 0, colFrac: 0.15, icon: "window", title: "Main Window", sub: ["Sidebar · queue · library"] },
  { id: "menu", band: 0, colFrac: 0.5, icon: "phone", title: "Menu Bar", sub: ["Compact transport"] },
  { id: "notch", band: 0, colFrac: 0.85, icon: "layers", title: "Notch Island", sub: ["Dynamic-island player"] },
  { id: "pc", band: 1, colFrac: 0.5, w: 420, icon: "cpu", title: "PlayerController", sub: ["Transport · queue · now-playing state"] },
  { id: "seam", band: 2, colFrac: 0.5, w: 460, icon: "layers", title: "PlaybackSource · protocol", sub: ["The sacred seam — source-agnostic"], variant: "seam" },
  { id: "web", band: 3, colFrac: 0.15, icon: "globe", title: "WebView Player", sub: ["Hidden WKWebView", "YTM player JS · Google's cipher"] },
  { id: "local", band: 3, colFrac: 0.5, icon: "drive", title: "Local Player", sub: ["AVAudioEngine / AVPlayer", "User's own files"] },
  { id: "dl", band: 3, colFrac: 0.85, icon: "terminal", title: "Downloads", sub: ["yt-dlp · out-of-process", "Offline capture"] },
  { id: "tube", band: 4, colFrac: 0.15, icon: "search", title: "InnerTube Client", sub: ["Search · browse · recs · auth"] },
  { id: "lib", band: 4, colFrac: 0.5, icon: "db", title: "Library", sub: ["SQLite / GRDB · cache · stats"] },
  { id: "key", band: 4, colFrac: 0.85, icon: "lock", title: "Keychain", sub: ["Tokens & cookies · encrypted"] },
  { id: "ytm", band: 5, colFrac: 0.3, icon: "cloud", title: "YouTube Music", sub: ["InnerTube API · catalog"], variant: "ext" },
  { id: "oauth", band: 5, colFrac: 0.7, icon: "key", title: "Google OAuth", sub: ["TV-device flow"], variant: "ext" },
];

const ARCH_WIRES: ArchWire[] = [
  { from: "win", to: "pc", type: "ctrl" },
  { from: "menu", to: "pc", type: "ctrl" },
  { from: "notch", to: "pc", type: "ctrl" },
  { from: "pc", to: "seam", type: "ctrl" },
  { from: "seam", to: "web", type: "ctrl" },
  { from: "seam", to: "local", type: "ctrl" },
  { from: "seam", to: "dl", type: "ctrl" },
  { from: "tube", to: "win", type: "data" },
  { from: "local", to: "lib", type: "data" },
  { from: "dl", to: "lib", type: "data" },
  { from: "web", to: "ytm", type: "net" },
  { from: "tube", to: "ytm", type: "net" },
  { from: "oauth", to: "key", type: "net" },
  { from: "key", to: "tube", type: "net" },
];

const shots = [
  { src: "/projects/rift-shots/home_screen.png", label: "Home" },
  { src: "/projects/rift-shots/player_with_lyrics_screen.png", label: "Lyrics" },
  { src: "/projects/rift-shots/artist_screen.png", label: "Artist" },
  { src: "/projects/rift-shots/library_screen.png", label: "Library" },
  { src: "/projects/rift-shots/search_screen.png", label: "Search" },
  { src: "/projects/rift-shots/top_notch.png", label: "Notch Island" },
];

export default function RiftCaseStudy() {
  const [[currentIndex, direction], setSlide] = useState<[number, number]>([0, 0]);

  const nextSlide = () => {
    setSlide(([i]) => [(i + 1) % shots.length, 1]);
  };

  const prevSlide = () => {
    setSlide(([i]) => [(i - 1 + shots.length) % shots.length, -1]);
  };

  const goTo = (idx: number) => {
    setSlide(([i]) => [idx, idx > i ? 1 : -1]);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 pb-32 pt-40 md:px-10 lg:px-16 lg:pt-48">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-20"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Open Source Case Study
          </span>
        </div>
        <h1 className="mb-6 font-display text-4xl italic tracking-tight md:text-6xl lg:text-7xl">
          Rift <br className="hidden md:block" />
          <span className="font-sans font-normal not-italic text-muted">Music Player</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <TechPill name="Swift" />
          <TechPill name="SwiftUI" />
          <TechPill name="macOS" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://mustafapatharia.github.io/rift-music-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="cosmic-btn group relative inline-flex rounded-full transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span
              className="accent-gradient-animated pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ inset: "-2px" }}
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-text-primary px-6 py-3 text-sm text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              Visit Website
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </span>
          </a>

          <a
            href="https://github.com/mustafa-patharia/rift-music-app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-3 text-sm transition-colors hover:border-text-primary/30"
          >
            View on GitHub
            <svg className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </motion.header>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-24 w-full rounded-2xl overflow-hidden border-2 border-text-primary/10"
      >
        <img
          src={`/projects/rift-shots/full_screen_player_screen.png`}
          alt={`Rift full screen player`}
          className="w-full h-auto object-contain block"
        />
      </motion.div>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mt-16 flex flex-col gap-24">

          {/* Overview Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          >
            <div>
              <h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">
                The Vision
              </h2>
              <p className="leading-relaxed text-muted md:text-lg">
                macOS lacks a dedicated, native music player for YouTube Music. Users are forced to rely on heavy browser tabs or Electron wrappers. I built Rift to solve this: a truly native macOS client that plays music ad-free, maintains local listening stats, and provides instant playback control without ever opening a browser.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-8 md:p-10">
              <h3 className="mb-6 font-display text-2xl italic text-text-primary">
                Core Objectives
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Native Experience: Built entirely in SwiftUI for a seamless macOS feel.",
                  "Ad-Free & Standalone: Direct playback control without browser dependencies.",
                  "Local Stats: Maintain personal listening history and analytics directly on the device.",
                ].map((item, i) => (
                  <li key={i} className="relative pl-5 text-sm text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-text-primary/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Architecture Diagram Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="mb-10 font-display text-3xl italic text-text-primary md:text-4xl text-center">
              Under the Hood
            </h2>

            <ArchitectureDiagram
              bands={ARCH_BANDS}
              nodes={ARCH_NODES}
              wires={ARCH_WIRES}
              note="The seam: nothing above PlaybackSource knows whether audio comes from a WebView, a local file, or the yt-dlp downloader. Swap the conformer, keep the UI."
            />
          </motion.section>

          {/* Key Features (Vertical Timeline) */}
          <section>
            <h2 className="mb-12 font-display text-3xl italic text-text-primary md:text-4xl">
              Engineering Deep Dive
            </h2>
            <div className="relative pl-6 md:pl-10">
              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-stroke md:left-[11px]" />
              <div className="flex flex-col gap-12">
                {[
                  { title: "Hybrid Playback Engine", tool: "WKWebView & JS Bridge", text: "Instead of fighting a cat-and-mouse game against Google's stream ciphers on the backend, I engineered a Hybrid Engine. A hidden WKWebView executes Google's native 'base.js' to legally resolve and play the streams exactly like a browser would, while a JS bridge perfectly syncs playback state (duration, buffering, elapsed) back to the native SwiftUI interface." },
                  { title: "Bundled Offline Pipeline", tool: "Python & yt-dlp", text: "For offline downloads, I packaged a fully self-contained Python and yt-dlp environment directly into the macOS app bundle. By strictly separating the stream engine (WKWebView) from the download engine (yt-dlp), stream playback remains resilient even if the download API temporarily breaks." },
                  { title: "Instant Playback & Local Data", tool: "Caching & SwiftData", text: "To eliminate buffering and loading screens, I implemented an aggressive caching layer for audio streams. Combined with SwiftData for local state management and Keychain for secure OAuth storage, the app feels instantly responsive." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-[6px] h-3 w-3 rounded-full border-2 border-bg bg-text-primary transition-transform duration-300 hover:scale-150 md:left-[-38px]" />
                    <h3 className="mb-1 text-lg text-text-primary">{item.title}</h3>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#89AACC]">{item.tool}</p>
                    <p className="text-sm leading-relaxed text-muted md:text-base">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Lessons Learned */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-12 border-t border-stroke" />
            <h3 className="mb-6 font-display text-2xl italic text-text-primary">The Result</h3>
            <p className="leading-relaxed text-muted md:text-lg">
              Building Rift taught me that crafting a great user experience often requires hiding immense complexity under the hood. By figuring out how to bundle external binaries (like Python and yt-dlp) securely inside a native Swift application, I was able to bypass Google's walled garden and deliver the exact fluid, ad-free music experience that macOS users have been craving.
            </p>
          </motion.section>

        </div>
      </motion.article>

      {/* Carousel Showcase */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-24 mb-12"
      >
        <h3 className="mb-4 text-center font-display text-3xl italic text-text-primary">Interface Gallery</h3>
        <p className="mb-12 text-center text-sm text-muted">{shots[currentIndex].label}</p>

        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] flex items-center justify-center group">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={currentIndex}
              src={shots[currentIndex].src}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) nextSlide();
                else if (info.offset.x > 80) prevSlide();
              }}
              initial={{ opacity: 0, x: direction >= 0 ? 60 : -60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction >= 0 ? -60 : 60, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute h-full w-full cursor-grab object-contain active:cursor-grabbing"
              alt={`Rift — ${shots[currentIndex].label}`}
            />
          </AnimatePresence>

          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full border border-stroke bg-bg/60 backdrop-blur-md text-text-primary transition-all duration-300 hover:scale-110 hover:border-text-primary/40 z-10 hidden md:group-hover:flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full border border-stroke bg-bg/60 backdrop-blur-md text-text-primary transition-all duration-300 hover:scale-110 hover:border-text-primary/40 z-10 hidden md:group-hover:flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        {/* Thumbnail rail */}
        <div className="mt-8 flex justify-center gap-3 overflow-x-auto px-2 pb-2">
          {shots.map((s, idx) => (
            <button
              key={s.src}
              onClick={() => goTo(idx)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 md:h-16 md:w-16 ${idx === currentIndex
                  ? "border-text-primary/60 scale-105"
                  : "border-stroke opacity-50 hover:opacity-90"
                }`}
            >
              <img src={s.src} alt={s.label} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
