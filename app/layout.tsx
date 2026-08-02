import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mustafa Patharia — Senior Software Engineer & AI Engineer",
  description:
    "Five years architecting multi-tenant SaaS platforms, distributed backends, and the agentic tooling that builds them faster.",
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
      <body className="bg-bg text-text-primary">{children}</body>
    </html>
  );
}
