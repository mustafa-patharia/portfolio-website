import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import GlobalBackground from "@/components/GlobalBackground";
import CalEmbed from "@/components/CalEmbed";
import ChatWidget from "@/components/ChatWidget";
import { Analytics } from "@vercel/analytics/next";

const GA_MEASUREMENT_ID = "G-69RBNWHM1D";
export const metadata: Metadata = {
  metadataBase: new URL("https://mustafapatharia.com"), // Provide the base URL for resolving relative OG/Twitter images
  title: "Mustafa Patharia | Senior Software Engineer & AI Engineer",
  description:
    "Five years architecting multi-tenant SaaS platforms, distributed backends, and the agentic tooling that builds them faster.",
  keywords: [
    "Mustafa Patharia",
    "Software Engineer",
    "AI Engineer",
    "Full Stack Developer",
    "Next.js",
    "Node.js",
    "SaaS Architect",
  ],
  authors: [{ name: "Mustafa Patharia" }],
  creator: "Mustafa Patharia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mustafapatharia.com", // Adjust as necessary
    title: "Mustafa Patharia | Senior Software Engineer",
    description:
      "Five years architecting multi-tenant SaaS platforms, distributed backends, and the agentic tooling that builds them faster.",
    siteName: "Mustafa Patharia Portfolio",
    images: [
      {
        url: "/projects/infithra.jpg",
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
      "Architecting multi-tenant SaaS platforms and the agentic tooling that builds them faster.",
    creator: "@MustafaPatharia",
    images: ["/projects/infithra.jpg"],
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
        <GlobalBackground />
        <CalEmbed />
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
