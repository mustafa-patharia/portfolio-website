import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import GlobalBackground from "@/components/GlobalBackground";
import CalEmbed from "@/components/CalEmbed";
import ChatWidget from "@/components/ChatWidget";
import { Analytics } from "@vercel/analytics/next";

const GA_MEASUREMENT_ID = "G-69RBNWHM1D";
export const metadata: Metadata = {
  metadataBase: new URL("https://mustafapatharia.vercel.app"), // Provide the base URL for resolving relative OG/Twitter images
  title: "Mustafa Patharia | Senior Full-Stack Engineer",
  description:
    "Five years building software end to end, from SaaS platforms and mobile apps to the ERP integrations that keep a business running.",
  keywords: [
    "Mustafa Patharia",
    "Software Engineer",
    "Full Stack Engineer",
    "SaaS Development",
    "Mobile App Development",
    "ERP Integration",
    "Odoo Development",
    "Full Stack Developer",
    "Next.js",
    "Node.js",
    "SaaS Architect",
  ],
  authors: [{ name: "Mustafa Patharia" }],
  creator: "Mustafa Patharia",
  alternates: { canonical: "https://mustafapatharia.vercel.app" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mustafapatharia.vercel.app", // Adjust as necessary
    title: "Mustafa Patharia | Senior Software Engineer",
    description:
      "Five years building software end to end, from SaaS platforms and mobile apps to the ERP integrations that keep a business running.",
    siteName: "Mustafa Patharia Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mustafa Patharia Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mustafa Patharia | Senior Software Engineer",
    description:
      "Five years building software end to end, from SaaS platforms and mobile apps to the ERP integrations that keep a business running.",
    creator: "@mustafa-patharia",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="text-text-primary bg-transparent relative">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mustafa Patharia",
              url: "https://mustafapatharia.vercel.app",
              jobTitle: "Senior Full-Stack Engineer",
              description: "Five years building software end to end, from SaaS platforms and mobile apps to the ERP integrations that keep a business running.",
              knowsAbout: [
                "Software Engineering",
                "ERP Integration",
                "Next.js",
                "Node.js",
                "SaaS Architecture",
                "TypeScript",
                "System Design"
              ],
              sameAs: [
                "https://github.com/mustafapatharia",
                "https://www.linkedin.com/in/mustafapatharia/" // Adjust if the LinkedIn URL differs
              ]
            })
          }}
        />
        <GlobalBackground />
        <CalEmbed />
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
