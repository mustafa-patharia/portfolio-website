export interface CaseStudyMeta {
  slug: string;
  title: string;
  kicker: string;
  stack: string;
  description: string;
  image: string;
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "infithra",
    title: "infithra — HRMS Platform",
    kicker: "Enterprise · Multi-Tenant SaaS",
    stack: "Node.js · Angular · Next.js · AWS · PostgreSQL · Redis",
    description:
      "Founding engineer's account of building a multi-tenant HRMS platform from zero — 800+ production APIs, hybrid RBAC/ABAC, UAE Labour Law-compliant payroll, serving thousands of daily users.",
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
