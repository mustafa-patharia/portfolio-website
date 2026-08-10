import type { Metadata } from "next";
import CaseStudyClient from "@/components/CaseStudyClient";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

interface CaseStudyProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study | Mustafa Patharia" };

  const url = `https://mustafapatharia.vercel.app/case-study/${study.slug}`;

  return {
    title: `${study.title} | Case Study | Mustafa Patharia`,
    description: study.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: study.title,
      description: study.description,
      images: [{ url: study.image, width: 1200, height: 630, alt: study.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.description,
      images: [study.image],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  return (
    <>
      {study && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechArticle",
              name: study.title,
              description: study.description,
              author: { "@type": "Person", name: "Mustafa Patharia" },
              url: `https://mustafapatharia.vercel.app/case-study/${study.slug}`,
              image: `https://mustafapatharia.vercel.app${study.image}`,
            }),
          }}
        />
      )}
      <CaseStudyClient slug={slug} />
    </>
  );
}
