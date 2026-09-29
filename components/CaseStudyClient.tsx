"use client";

import { useEffect } from "react";
import JourneyNav from "@/components/home/JourneyNav";
import Footer from "@/components/Contact";
import InfithraCaseStudy from "@/components/case-studies/Infithra";
import RiftCaseStudy from "@/components/case-studies/Rift";
import ProofHubCaseStudy from "@/components/case-studies/ProofHub";
import SmartScanCaseStudy from "@/components/case-studies/SmartScan";
import NetSuiteOdooPOSCaseStudy from "@/components/case-studies/NetSuiteOdooPOS";
import GetRoundedCaseStudy from "@/components/case-studies/GetRounded";
import PromaxGlobalCaseStudy from "@/components/case-studies/PromaxGlobal";

export default function CaseStudyClient({ slug }: { slug: string }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-text-primary selection:bg-text-primary selection:text-bg">
      <JourneyNav scene="work" rail={false} />

      {slug === "infithra" && <InfithraCaseStudy />}
      {slug === "rift" && <RiftCaseStudy />}
      {slug === "proofhub-task-timer" && <ProofHubCaseStudy />}
      {slug === "smartscan" && <SmartScanCaseStudy />}
      {slug === "netsuite-odoo-pos" && <NetSuiteOdooPOSCaseStudy />}
      {slug === "get-rounded" && <GetRoundedCaseStudy />}
      {slug === "promax-global" && <PromaxGlobalCaseStudy />}

      {slug !== "infithra" && slug !== "rift" && slug !== "proofhub-task-timer" && slug !== "smartscan" && slug !== "netsuite-odoo-pos" && slug !== "get-rounded" && slug !== "promax-global" && (
        <div className="flex h-[60vh] items-center justify-center">
          <h1 className="text-2xl text-muted">Case study not found.</h1>
        </div>
      )}

      <Footer />
    </div>
  );
}
