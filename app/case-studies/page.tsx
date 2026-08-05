import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Contact";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";

export const metadata: Metadata = {
  title: "Case Studies | Mustafa Patharia",
  description:
    "Deep-dive engineering case studies — multi-tenant SaaS architecture, native macOS apps, and the systems behind them.",
  alternates: { canonical: "https://mustafapatharia.com/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-text-primary selection:text-bg">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 pt-40 md:px-10 lg:px-16 lg:pt-48">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Case Studies
            </span>
          </div>
          <h1 className="font-display text-5xl italic tracking-tight text-text-primary md:text-7xl">
            The systems, in detail
          </h1>
          <p className="mt-6 max-w-xl text-muted md:text-lg">
            Architecture decisions, trade-offs, and the engineering behind the
            projects — written for the recruiter or engineer who wants more
            than a bullet point.
          </p>
        </div>
        <CaseStudiesGrid />
      </main>
      <Footer />
    </div>
  );
}
