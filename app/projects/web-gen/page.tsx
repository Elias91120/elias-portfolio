import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";

export const metadata: Metadata = {
  title: "Web-Gen — Case Study",
  description:
    "How three friends built Web-Gen, an intent-to-website generator: LLM orchestration, GenUI and Next.js turning a text brief into a fully laid-out site.",
  alternates: { canonical: "/projects/web-gen" },
  openGraph: {
    title: "Web-Gen — Case Study · Elias Elloumi",
    description:
      "Intent-to-website generator: a text brief becomes a fully laid-out site. The flagship product of the webgen studio.",
  },
};

const stack = [
  { label: "LLM orchestration", detail: "Multi-step prompting turns a brief into structure" },
  { label: "GenUI", detail: "Generated layouts rendered as real components" },
  { label: "Next.js", detail: "App Router, streaming, deployed on Vercel" },
  { label: "Made in France", detail: "Built by the webgen studio — Elias, Noam & Charles" },
];

const shipped = [
  {
    name: "Express Divorce USA",
    detail: "Legal-tech SaaS in production with real users",
    href: "https://expressdivorceusa.co",
  },
  {
    name: "CallKitchen",
    detail: "AI phone assistant for restaurants",
    href: "https://call-kitchen-landing.vercel.app/",
  },
  {
    name: "Two",
    detail: "Consumer iOS app, live on the App Store",
    href: "https://apps.apple.com/fr/app/two/id6758867716",
  },
  {
    name: "PromptOptim",
    detail: "Green-IT prompt optimizer, released in the open",
    href: "https://frontend-prompt-optim.vercel.app/",
  },
];

export default function WebGenCaseStudy() {
  return (
    <main className="relative min-h-screen">
      {/* Minimal chrome — this page is a reading room, not the homepage */}
      <header
        className="fixed inset-x-0 top-0 z-50 bg-[#08060f]/70 backdrop-blur-md border-b border-white/5"
        style={{ viewTransitionName: "site-header" }}
      >
        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <Link
            href="/#projects"
            transitionTypes={["nav-back"]}
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
              ←
            </span>
            Back to portfolio
          </Link>
          <a
            href="https://www.3geeks.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-white ring-1 ring-white/15 transition-all hover:bg-white/10 hover:ring-white/30"
          >
            Visit live site ↗
          </a>
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-5 pb-28 pt-28">
        {/* Hero */}
        <ViewTransition enter="case-study-content-enter" default="none">
          <div>
            <span className="section-kicker font-display text-xs font-semibold tracking-[0.3em] text-[#4ade80]">
              CASE STUDY
            </span>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Web-Gen —{" "}
              <span className="font-serif italic font-semibold text-[#f5f0e4]">
                intent to website
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              The flagship of webgen, our three-person studio: describe the site
              you want in plain words, and Web-Gen turns that brief into a fully
              laid-out, ready-to-ship website.
            </p>
          </div>
        </ViewTransition>

        <ProjectBrowserPreview
          slug="web-gen"
          imageSrc="/projects/web-gen.webp"
          imageAlt="Screenshot of the Web-Gen studio site"
          linkLabel="www.3geeks.fr"
          priority
          className="mt-10"
        />

        <ViewTransition
          enter="case-study-content-enter-delay"
          default="none"
        >
          <div>
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            The problem
          </h2>
          <p className="mt-5 leading-relaxed text-[#c5c0da]">
            Getting a website made is still slow and expensive for most small
            businesses. You either fight a generic site-builder and its
            templates, or you hire an agency and wait weeks for a first
            version. In both cases, the hardest part gets lost in translation:
            what you actually <em className="font-serif text-[#f5f0e4]">meant</em>.
          </p>
          <p className="mt-4 leading-relaxed text-[#c5c0da]">
            Large language models changed that equation. If a model can
            understand intent, then a plain-language brief — &ldquo;a warm
            landing page for my bakery, with our story and opening hours&rdquo;
            — contains everything needed to design a site. The missing piece
            was the machinery to go from that sentence to real, structured
            pages.
          </p>
        </section>

        {/* The product */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            What we built
          </h2>
          <p className="mt-5 leading-relaxed text-[#c5c0da]">
            Web-Gen is an intent-to-website generator: one flow takes a text
            brief, extracts the intent, plans the site structure, and renders
            a fully laid-out website. No canvas, no drag-and-drop — the brief
            is the interface.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stack.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-card p-6 ring-1 ring-white/8"
              >
                <div className="font-display font-semibold text-white">
                  {item.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* My role */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            My role
          </h2>
          <p className="mt-5 leading-relaxed text-[#c5c0da]">
            webgen is three friends — Noam, Charles and me — and no one gets to
            do just one job. I work across the product: LLM orchestration and
            prompt design, the Next.js front end, and the pipeline that turns
            generated structure into rendered UI. The same AI-native workflow I
            use at Nokia — Cursor, Claude, agents — is how we ship here, at
            startup speed.
          </p>
        </section>

        {/* What it unlocked */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            What it unlocked
          </h2>
          <p className="mt-5 leading-relaxed text-[#c5c0da]">
            Web-Gen became the engine of the studio. Around it, we shipped real
            products for real clients — each one proof that a three-person team
            with an AI-native workflow can deliver production software:
          </p>
          <ul className="mt-8 space-y-3">
            {shipped.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-card px-6 py-4 ring-1 ring-white/8 transition-all hover:ring-white/20"
                >
                  <div>
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="ml-3 hidden text-sm text-muted sm:inline">
                      {item.detail}
                    </span>
                  </div>
                  <span className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-3xl bg-card p-8 ring-1 ring-white/12 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Want the full story?
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Web-Gen is one chapter — the portfolio reads like a book, from a
            Minecraft kid to production AI systems at Nokia.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#story"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-[#0c0a16] transition-transform duration-300 hover:scale-[1.03]"
            >
              Read the story
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-6 py-3 font-medium text-white ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-white/30"
            >
              Get in touch
            </Link>
          </div>
        </section>
          </div>
        </ViewTransition>
      </article>
    </main>
  );
}
