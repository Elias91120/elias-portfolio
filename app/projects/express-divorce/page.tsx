import type { Metadata } from "next";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import ComplianceBadges from "@/components/case-study/ComplianceBadges";
import UsStatesMap from "@/components/case-study/UsStatesMap";
import UseCaseScreenGrid from "@/components/case-study/UseCaseScreenGrid";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("express-divorce");

export const metadata: Metadata = {
  title: "Express Divorce USA — Case Study",
  description:
    "Live legal-tech SaaS simplifying US divorce journeys across multiple states — built for regulated-sector constraints at 3geeks.",
  alternates: { canonical: "/projects/express-divorce" },
  openGraph: {
    title: "Express Divorce USA — Case Study · Elias Elloumi",
    description:
      "Multi-state US divorce SaaS in production with real users. Compliance-minded, privacy-first legal tech.",
  },
};

export default function ExpressDivorceCaseStudy() {
  return (
    <CaseStudyShell
      theme={theme}
      liveHref="https://expressdivorceusa.co"
      liveLabel="Visit live site ↗"
      decor={<UsStatesMap />}
    >
      <ViewTransition enter="case-study-content-enter" default="none">
        <div>
          <span
            className="font-display text-xs font-semibold tracking-[0.3em]"
            style={{ color: "var(--cs-kicker)" }}
          >
            CASE STUDY
          </span>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Express Divorce USA —{" "}
            <span className="font-serif italic font-semibold text-[var(--cs-fg)]">
              legal tech in production
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--cs-muted)]">
            A live SaaS that guides people through US divorce journeys — state by
            state, with the compliance mindset that regulated sectors demand.
            Shipped by 3geeks for real users.
          </p>
          <ComplianceBadges />
        </div>
      </ViewTransition>

      <ProjectBrowserPreview
        slug="express-divorce"
        imageSrc="/projects/express-divorce.webp"
        imageAlt="Screenshot of Express Divorce USA landing page"
        linkLabel="expressdivorceusa.co"
        priority
        className="mt-10"
      />

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="The problem">
            <p>
              Divorce in the United States is fragmented, state-specific, and
              emotionally draining. Each state has its own forms, timelines, and
              rules — and most online tools treat divorce like a one-size-fits-all
              checkout flow.
            </p>
            <p>
              People navigating separation need clarity, not confusion. They need
              workflows that respect where they live, what they owe in personal
              data, and how stressful the process already is.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What we shipped">
            <p>
              Express Divorce USA is a live legal-tech SaaS with real users —
              built at 3geeks as a production Next.js application. It guides
              people through multi-state divorce journeys with state-aware
              workflows, not generic templates.
            </p>
            <p>
              From landing to intake, every screen is designed for trust: clear
              language, structured steps, and a product that feels serious enough
              for a regulated sector.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Regulated-sector constraints">
            <p>
              Legal tech sits at the intersection of personal data, compliance,
              and high-stakes life events. We built with a privacy-first mindset:
              data sovereignty considerations, careful handling of sensitive
              information, and workflows shaped by multi-state requirements.
            </p>
            <p>
              The goal was never to move fast and break things — it was to move
              fast <em>and</em> earn trust.
            </p>
          </CaseStudySection>

          <CaseStudySection title="My role">
            <p>
              Full-stack developer at 3geeks. I worked across the
              Next.js production app — from user-facing flows to the engineering
              decisions that keep a regulated-sector product maintainable in
              production.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Screens in context">
            <p>
              The product spans a public landing, guided intake, and state-specific
              journeys — each screen built to reduce friction without cutting
              corners on compliance.
            </p>
            <UseCaseScreenGrid
              screens={[
                {
                  imageSrc: "/projects/express-divorce.webp",
                  imageAlt: "Express Divorce USA homepage",
                  linkLabel: "expressdivorceusa.co",
                  caption:
                    "Public landing — clear value proposition and trust signals for a legal-tech product.",
                },
                {
                  imageSrc: "/projects/express-divorce-flow.webp",
                  imageAlt: "Express Divorce guided flow",
                  linkLabel: "expressdivorceusa.co/get-started",
                  caption:
                    "Guided intake flow — structured steps that adapt to state-specific requirements.",
                },
              ]}
            />
          </CaseStudySection>

          <CaseStudyCta
            description="Express Divorce is one of 3geeks's production ships — the portfolio reads like a book, from a Minecraft kid to production AI systems at Nokia."
          />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
