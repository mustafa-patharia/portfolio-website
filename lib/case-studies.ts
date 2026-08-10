export interface CaseStudyMeta {
  slug: string;
  title: string;
  kicker: string;
  stack?: string;
  description: string;
  image: string;
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "infithra",
    title: "infithra — Enterprise SaaS Case Study",
    kicker: "Enterprise · SaaS",
    description:
      "A deep dive into my experience as a lead engineer — focusing on architectural ownership, scaling technical operations, and the interpersonal dynamics of leading a growing engineering team.",
    image: "/projects/infithra.jpg",
  },
  {
    slug: "rift",
    title: "Rift — Native macOS Music Player",
    kicker: "Open Source · macOS · SwiftUI",
    stack: "SwiftUI · macOS · AVFoundation · yt-dlp",
    description:
      "A truly native, ad-free YouTube Music client for macOS — hybrid WebView/local playback engine, offline downloads, and a source-agnostic playback architecture.",
    image: "/projects/rift.png",
  },
  {
    slug: "proofhub-task-timer",
    title: "ProofHub Task Timer",
    kicker: "Open Source · macOS Menu Bar",
    stack: "Swift · SwiftData · ProofHub API",
    description:
      "A native macOS menu-bar time tracker for ProofHub — concurrent task timers, offline-first SwiftData caching, and one-click sync to ProofHub's Bolt API.",
    image: "/projects/proofhub-task-timer.png",
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
