"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const shots = [
  "/projects/rift-shots/home_screen.png",
  "/projects/rift-shots/player_with_lyrics_screen.png",
  "/projects/rift-shots/artist_screen.png",
  "/projects/rift-shots/library_screen.png",
  "/projects/rift-shots/search_screen.png"
];

export default function RiftCaseStudy() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % shots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + shots.length) % shots.length);
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
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.15em] text-muted md:text-sm">
          <span>Swift</span>
          <span>·</span>
          <span>SwiftUI</span>
          <span>·</span>
          <span>macOS</span>
        </div>

        <div className="mt-10">
          <a
            href="https://github.com/MustafaPatharia/rift-music-app"
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
              Data & Playback Flow
            </h2>
            
            <div className="rounded-3xl border border-stroke bg-surface/50 p-8 md:p-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-text-primary/5 via-bg/0 to-transparent pointer-events-none" />
              
              {/* Diagram Layout */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Node 1: SwiftUI */}
                <div className="w-full md:w-1/3 p-6 rounded-2xl bg-surface border border-stroke shadow-xl flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                  </div>
                  <h4 className="text-text-primary font-bold mb-2">Native UI</h4>
                  <p className="text-xs text-muted">SwiftUI View Layer<br/>& SwiftData Store</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center text-muted">
                  <span className="text-xs mb-1">State & Auth</span>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0 12h58M50 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M60 12H2M10 20l-8-8 8-8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3"/>
                  </svg>
                </div>

                {/* Node 2: Core Engine */}
                <div className="w-full md:w-1/3 p-6 rounded-2xl bg-surface border border-stroke shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                  <div className="h-12 w-12 rounded-full bg-text-primary/10 text-text-primary flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  </div>
                  <h4 className="text-text-primary font-bold mb-2">Playback Engine</h4>
                  <p className="text-xs text-muted">Bundled Python &<br/>yt-dlp Core</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center text-muted">
                  <span className="text-xs mb-1">Ciphers</span>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0 12h58M50 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M60 12H2M10 20l-8-8 8-8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3"/>
                  </svg>
                </div>

                {/* Node 3: YouTube */}
                <div className="w-full md:w-1/3 p-6 rounded-2xl bg-[#ff0000]/10 border border-[#ff0000]/20 shadow-xl flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-[#ff0000]/20 text-[#ff0000] flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                  </div>
                  <h4 className="text-text-primary font-bold mb-2">YouTube Music</h4>
                  <p className="text-xs text-muted">Media Streams<br/>& Metadata</p>
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-center text-muted max-w-2xl mx-auto">
              To guarantee streaming reliability without constant maintenance, Rift uses a Hybrid Engine: a hidden WKWebView lets Google's own JS resolve the streams, while a bundled yt-dlp binary is isolated exclusively for robust offline downloads.
            </p>
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
        <h3 className="mb-12 text-center font-display text-3xl italic text-text-primary">Interface Gallery</h3>
        <div className="relative w-full overflow-hidden rounded-3xl bg-surface aspect-[16/10] md:aspect-[21/9] flex items-center justify-center group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={shots[currentIndex]}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute h-full w-full object-contain p-4"
              alt="App Screenshot"
            />
          </AnimatePresence>

          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-bg/80 backdrop-blur-md rounded-full border border-stroke text-text-primary hover:bg-stroke transition-colors z-10 hidden md:group-hover:block">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-bg/80 backdrop-blur-md rounded-full border border-stroke text-text-primary hover:bg-stroke transition-colors z-10 hidden md:group-hover:block">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {shots.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-text-primary' : 'bg-stroke hover:bg-text-primary/50'}`} 
              />
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
