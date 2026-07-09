import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fraunces } from "next/font/google";
import SpotlightCursor from "@/components/SpotlightCursor";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-story",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elias-elloumi.com"),
  title: {
    default: "Elias Elloumi — Full-Stack Developer · Data Engineering & AI",
    template: "%s · Elias Elloumi",
  },
  description:
    "Professional vibe coder building data pipelines, AI agents & production products at Nokia and webgen. A portfolio that reads like an illustrated book — one scroll at a time.",
  keywords: [
    "Elias Elloumi",
    "Full-Stack Developer",
    "Data Engineering",
    "AI Engineer",
    "Vibe coding",
    "Portfolio",
    "Nokia",
    "webgen",
    "Web-Gen",
    "EFREI Paris",
    "ECE Paris",
    "Data & AI",
  ],
  authors: [{ name: "Elias Elloumi", url: "https://elias-elloumi.com" }],
  creator: "Elias Elloumi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://elias-elloumi.com",
    siteName: "Elias Elloumi — Portfolio",
    locale: "en_US",
    title: "Elias Elloumi — Full-Stack Developer · Data Engineering & AI",
    description:
      "Professional vibe coder building data pipelines, AI agents & production products at Nokia and webgen. A story that reads like an illustrated book.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elias Elloumi — Full-Stack Developer · Data Engineering & AI",
    description:
      "Professional vibe coder building data pipelines, AI agents & production products at Nokia and webgen. A story that reads like an illustrated book.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Elias Elloumi",
  url: "https://elias-elloumi.com",
  jobTitle: "Full-Stack Developer · Data Engineering & AI Agent Developer",
  worksFor: { "@type": "Organization", name: "Nokia" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "ECE Paris" },
    { "@type": "CollegeOrUniversity", name: "EFREI Paris" },
  ],
  knowsAbout: [
    "Data Engineering",
    "Artificial Intelligence",
    "Vibe coding",
    "Web Development",
  ],
  sameAs: [
    "https://www.linkedin.com/in/elias-elloumi/",
    "https://www.fiverr.com/three_geeks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <SpotlightCursor />
      </body>
    </html>
  );
}
