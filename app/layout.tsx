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
  title: "Elias Elloumi — Data & AI Engineer",
  description:
    "From a Minecraft kid to a data engineering & AI agent developer at Nokia and co-founder of 3geeks. Scroll through the story — Python, React, FastAPI, data pipelines and AI-powered products.",
  openGraph: {
    title: "Elias Elloumi — Data & AI Engineer",
    description:
      "From a Minecraft kid to a data & AI engineer at Nokia and co-founder of 3geeks. Scroll through the story.",
    images: ["/story/avatar-hero.jpg"],
  },
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
      <body className="min-h-full grain">{children}</body>
    </html>
  );
}
