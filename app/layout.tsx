import type { Metadata } from "next";
import { Kanit, Inter } from "next/font/google";
import SpotlightCursor from "@/components/SpotlightCursor";
import ViewTransitionRoot from "@/components/ViewTransitionRoot";
import { LocaleProvider } from "@/lib/i18n";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const title = "Elias Elloumi — Data & AI Engineer";
const description =
  "Data pipelines, AI agents and production systems — Nokia, 3geeks studio, EFREI Paris and apprenticeship at Cleva Solutions (ClevAI). Shipped work and verified recommendations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://elias-elloumi.com"),
  title: {
    default: title,
    template: "%s · Elias Elloumi",
  },
  description,
  keywords: [
    "Elias Elloumi",
    "Data Engineer",
    "AI Engineer",
    "AI agents",
    "Data pipelines",
    "Full-Stack Developer",
    "Portfolio",
    "Nokia",
    "3geeks",
    "Cleva Solutions",
    "EFREI Paris",
    "ECE Paris",
  ],
  authors: [{ name: "Elias Elloumi", url: "https://elias-elloumi.com" }],
  creator: "Elias Elloumi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://elias-elloumi.com",
    siteName: "Elias Elloumi",
    locale: "en_US",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Elias Elloumi",
  url: "https://elias-elloumi.com",
  jobTitle: "Data & AI Engineer",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "ECE Paris" },
    { "@type": "CollegeOrUniversity", name: "EFREI Paris" },
  ],
  knowsAbout: [
    "Data Engineering",
    "Artificial Intelligence",
    "AI agents",
    "Web Development",
    "Cloud Infrastructure",
  ],
  sameAs: [
    "https://www.linkedin.com/in/elias-elloumi/",
    "https://github.com/Elias91120",
    "https://www.3geeks.fr",
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
      className={`${kanit.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LocaleProvider>
          <ViewTransitionRoot>{children}</ViewTransitionRoot>
          <SpotlightCursor />
        </LocaleProvider>
      </body>
    </html>
  );
}
