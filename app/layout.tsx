import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fraunces } from "next/font/google";
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
  metadataBase: new URL("https://elias-elloumi.vercel.app"),
  title: {
    default: "Elias Elloumi — Data & AI Engineer",
    template: "%s · Elias Elloumi",
  },
  description:
    "From a Minecraft kid to a data & AI engineer at Nokia and co-founder of 3geeks. A portfolio that reads like an illustrated book — one scroll at a time.",
  keywords: [
    "Elias Elloumi",
    "Data Engineer",
    "AI Engineer",
    "Portfolio",
    "Nokia",
    "3geeks",
    "ECE Paris",
    "Data & AI",
  ],
  authors: [{ name: "Elias Elloumi", url: "https://elias-elloumi.vercel.app" }],
  creator: "Elias Elloumi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://elias-elloumi.vercel.app",
    siteName: "Elias Elloumi — Portfolio",
    locale: "en_US",
    title: "Elias Elloumi — Data & AI Engineer",
    description:
      "From a Minecraft kid to a data & AI engineer at Nokia and co-founder of 3geeks. A story that reads like an illustrated book.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elias Elloumi — Data & AI Engineer",
    description:
      "From a Minecraft kid to a data & AI engineer at Nokia and co-founder of 3geeks. A story that reads like an illustrated book.",
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
  url: "https://elias-elloumi.vercel.app",
  jobTitle: "Data Engineering & AI Agent Developer",
  worksFor: { "@type": "Organization", name: "Nokia" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "ECE Paris" },
  sameAs: ["https://www.linkedin.com/in/elias-elloumi/"],
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
      </body>
    </html>
  );
}
