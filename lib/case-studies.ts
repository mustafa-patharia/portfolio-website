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
    image: "/projects/poster/infithra.jpg",
  },
  {
    slug: "rift",
    title: "Rift — Native macOS Music Player",
    kicker: "Open Source · macOS · SwiftUI",
    stack: "SwiftUI · macOS · AVFoundation · yt-dlp",
    description:
      "A truly native, ad-free YouTube Music client for macOS — hybrid WebView/local playback engine, offline downloads, and a source-agnostic playback architecture.",
    image: "/projects/poster/rift-music-app.png",
  },
  {
    slug: "proofhub-task-timer",
    title: "ProofHub Task Timer",
    kicker: "Open Source · macOS Menu Bar",
    stack: "Swift · SwiftData · ProofHub API",
    description:
      "A native macOS menu-bar time tracker for ProofHub — concurrent task timers, offline-first SwiftData caching, and one-click sync to ProofHub's Bolt API.",
    image: "/projects/poster/proofhub-task-timer.png",
  },
  {
    slug: "smartscan",
    title: "SmartScan — RFID Warehouse Middleware",
    kicker: "Enterprise · Warehouse Inventory",
    stack: "NestJS · PostgreSQL · Next.js · React Native · AWS",
    description:
      "RFID warehouse inventory platform I owned end to end as a freelancer: architecture, NetSuite integration, product scope, handheld UX and delivery. Tag-level tracking, Android handheld workflows and durable NetSuite sync.",
    image: "/projects/poster/smarscan-rfid-warehouse-app.png",
  },
  {
    slug: "netsuite-odoo-pos",
    title: "NetSuite Odoo POS Integration",
    kicker: "Enterprise · ERP Integration",
    stack: "Odoo · Python · NetSuite RESTlets",
    description:
      "A bidirectional integration module between Odoo POS and NetSuite. Automatically syncs products, invoices, and payments with support for manual and scheduled background jobs.",
    image: "/projects/poster/netsuite-odoo-pos-integration.png",
  },
  {
    slug: "get-rounded",
    title: "GetRounded",
    kicker: "Open Source · Desktop App",
    stack: "Python · pywebview · Tailwind CSS",
    description:
      "A fully offline desktop app for macOS, Windows, and Linux that instantly rounds image corners. Built with a Python backend and a lightweight HTML/Tailwind frontend via pywebview.",
    image: "/projects/poster/get-rounded.png",
  },
  {
    slug: "promax-global",
    title: "Promax Global",
    kicker: "Website Development",
    stack: "React · CMS",
    description:
      "Corporate website on a custom content platform — multilingual content, role-based publishing, and built-in search-engine optimization.",
    image: "/projects/poster/promax-gloabal.png",
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
