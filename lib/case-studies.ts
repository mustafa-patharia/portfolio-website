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
    title: "Infithra — Enterprise HR & Payroll SaaS",
    kicker: "Enterprise · Multi-tenant SaaS · HR & Payroll",
    stack: "Node.js · Angular · Next.js · PostgreSQL · AWS",
    description:
      "Enterprise HR and payroll platform for the UAE and KSA, built from the ground up as founding engineer: configurable payroll engine, multi-tenant cloud architecture, two-layer access control, 10+ schedulers and NetSuite ledger sync.",
    image: "/projects/poster/infithra.jpg",
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
    title: "Odoo POS × NetSuite — Odoo Addon",
    kicker: "Enterprise · Odoo Addon · ERP Integration",
    stack: "Odoo 18 · Python · queue_job · NetSuite RESTlets",
    description:
      "Odoo 18 addon I owned end to end as a freelancer: every POS order becomes the right NetSuite invoices, credit memos, payments, refunds and gift certificates, posted in order and never twice. NetSuite pushes the configuration and products in.",
    image: "/projects/poster/netsuite-odoo-pos-integration.png",
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
    slug: "get-rounded",
    title: "GetRounded",
    kicker: "Open Source · Desktop App",
    stack: "Python · pywebview · Tailwind CSS",
    description:
      "A fully offline desktop app for macOS, Windows, and Linux that instantly rounds image corners. Built with a Python backend and a lightweight HTML/Tailwind frontend via pywebview.",
    image: "/projects/poster/get-rounded.png",
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
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
