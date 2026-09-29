import type { Metadata } from "next";
import JourneyNav from "@/components/home/JourneyNav";
import Footer from "@/components/Contact";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";

import { CASE_STUDIES } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | Mustafa Patharia",
  description:
    "Deep-dive engineering case studies — multi-tenant SaaS architecture, native macOS apps, and the systems behind them.",
  alternates: { canonical: "https://mustafapatharia.vercel.app/case-studies" },
  openGraph: {
    type: "website",
    url: "https://mustafapatharia.vercel.app/case-studies",
    title: "Case Studies | Mustafa Patharia",
    description: "Deep-dive engineering case studies — multi-tenant SaaS architecture, native macOS apps, and the systems behind them.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Case Studies | Mustafa Patharia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Mustafa Patharia",
    description: "Architecture decisions, trade-offs, and the engineering behind the projects.",
    images: ["/og-image.jpg"],
  },
};

export default function CaseStudiesPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Engineering Case Studies by Mustafa Patharia",
    description: "Deep-dive engineering case studies highlighting architecture decisions, trade-offs, and technical implementation.",
    url: "https://mustafapatharia.vercel.app/case-studies",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CASE_STUDIES.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://mustafapatharia.vercel.app/case-study/${study.slug}`,
        name: study.title,
        description: study.description
      }))
    }
  };

  return (
    <div className="min-h-screen text-text-primary selection:bg-text-primary selection:text-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <JourneyNav scene="work" rail={false} />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 pt-40 md:px-10 lg:px-16 lg:pt-48">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Missions
            </span>
          </div>
          <h1 className="font-display text-5xl italic tracking-tight text-text-primary md:text-7xl">
            Every mission, in detail
          </h1>
          <p className="mt-6 max-w-xl text-muted md:text-lg">
            Each mission logged in full: the problem, the architecture, the
            trade-offs and what shipped — for the team that wants more than a
            bullet point before they bring me in.
          </p>
        </div>
        <CaseStudiesGrid />
      </main>
      <Footer />
    </div>
  );
}
