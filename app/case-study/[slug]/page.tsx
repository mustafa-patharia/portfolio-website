"use client";

import { useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Contact";
import InfithraCaseStudy from "@/components/case-studies/Infithra";
import RiftCaseStudy from "@/components/case-studies/Rift";
import ProofHubCaseStudy from "@/components/case-studies/ProofHub";

interface CaseStudyProps {
  params: Promise<{ slug: string }>;
}

export default function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = use(params);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-text-primary selection:text-bg">
      <Navbar />

      {slug === "infithra" && <InfithraCaseStudy />}
      {slug === "rift" && <RiftCaseStudy />}
      {slug === "proofhub-task-timer" && <ProofHubCaseStudy />}

      {slug !== "infithra" && slug !== "rift" && slug !== "proofhub-task-timer" && (
        <div className="flex h-[60vh] items-center justify-center">
          <h1 className="text-2xl text-muted">Case study not found.</h1>
        </div>
      )}

      <Footer />
    </div>
  );
}
