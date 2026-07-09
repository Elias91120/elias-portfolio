import type { Metadata } from "next";
import Image from "next/image";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import DashboardVizMock from "@/components/case-study/DashboardVizMock";
import NokiaGridDecor from "@/components/case-study/NokiaGridDecor";
import PipelineDiagram from "@/components/case-study/PipelineDiagram";
import UseCaseScreenGrid from "@/components/case-study/UseCaseScreenGrid";
import { NokiaDashboardMock } from "@/components/case-study/TravelPlannerMock";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("nokia-dashboard");

export const metadata: Metadata = {
  title: "Feature Analyzer Dashboard 2.0 — Case Study",
  description:
    "Centralized Nokia platform analyzing features end-to-end: 7+ heterogeneous sources through an automated collect → analyze → correlate → report pipeline.",
  alternates: { canonical: "/projects/nokia-dashboard" },
  openGraph: {
    title: "Feature Analyzer Dashboard 2.0 — Case Study · Elias Elloumi",
    description:
      "FastAPI + React platform replacing scattered manual analyses with real-time insights across seven data sources.",
  },
};

export default function NokiaDashboardCaseStudy() {
  return (
    <CaseStudyShell
      theme={theme}
      badge="Internal · Nokia"
      contactHref="/#contact"
      contactLabel="Discuss this project"
      decor={<NokiaGridDecor />}
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
            Feature Analyzer —{" "}
            <span className="font-serif italic font-semibold text-[var(--cs-fg)]">
              seven sources, one view
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--cs-muted)]">
            A centralized platform that replaced scattered manual analyses with
            a real-time dashboard — weaving seven heterogeneous data sources into
            one pipeline teams rely on daily.
          </p>
        </div>
      </ViewTransition>

      <ProjectBrowserPreview
        slug="nokia-dashboard"
        imageSrc="/projects/nokia-dashboard.webp"
        imageAlt="Feature Analyzer Dashboard overview"
        linkLabel="internal.nokia"
        priority
        className="mt-10"
      />

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="The problem">
            <p>
              Feature analysis at scale was fragmented. Data lived in seven
              heterogeneous sources, and teams ran manual, one-off analyses with
              no single real-time view of what was happening across the pipeline.
            </p>
            <p>
              The gap wasn&apos;t data — it was correlation. People needed to
              collect, analyze, and report in one flow, not seven separate tabs.
            </p>
          </CaseStudySection>

          <CaseStudySection title="The pipeline">
            <p>
              The platform follows a clear chain: heterogeneous sources feed a
              FastAPI backend that collects, analyzes, and correlates data —
              then a React dashboard surfaces real-time insights and structured
              reports.
            </p>
            <PipelineDiagram />
          </CaseStudySection>

          <CaseStudySection title="What I built">
            <p>
              Creator and lead developer. I designed and shipped the full stack —
              FastAPI services for the data pipeline, a React dashboard for
              real-time visibility, and the workflows that teams adopted as their
              daily reference.
            </p>
            <DashboardVizMock />
          </CaseStudySection>

          <CaseStudySection title="AI adoption angle">
            <p>
              Building at Nokia accelerated my AI-native workflow — the same
              Cursor-and-agents approach I later scaled across teams with
              internal portals and demos. Shipping this dashboard taught me how
              to move fast in enterprise constraints without sacrificing rigor.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Dashboard previews">
            <p>
              Internal tooling — no public URL. The interface prioritizes
              density, clarity, and real-time signal over polish for demos.
            </p>
            <UseCaseScreenGrid
              screens={[
                {
                  imageSrc: "/projects/nokia-dashboard.webp",
                  imageAlt: "Feature Analyzer dashboard overview",
                  linkLabel: "feature-analyzer.internal",
                  caption:
                    "Unified dashboard — KPIs, source health, and pipeline status in one view.",
                },
                {
                  linkLabel: "feature-analyzer.internal/detail",
                  imageAlt: "Feature Analyzer detail view mock",
                  caption:
                    "Detail drill-down — per-source analysis and correlation views.",
                  mock: <NokiaDashboardMock />,
                },
                {
                  imageSrc: "/story/chapter-5.jpg",
                  imageAlt: "Elias presenting data dashboards at Nokia",
                  linkLabel: "Nokia · Paris-Saclay",
                  caption:
                    "Presenting data dashboards to teams — the human context behind the platform.",
                },
              ]}
            />
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src="/story/chapter-5.jpg"
                alt="Elias presenting at Nokia"
                width={1400}
                height={600}
                className="h-48 w-full object-cover object-center sm:h-56"
              />
            </div>
          </CaseStudySection>

          <CaseStudyCta
            description="The Nokia chapter is where production craft met AI adoption — read the full story from internship to the person teams call to move faster."
          />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
