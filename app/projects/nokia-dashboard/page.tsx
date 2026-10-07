import type { Metadata } from "next";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import CaseStudyMetrics from "@/components/case-study/CaseStudyMetrics";
import NokiaGridDecor from "@/components/case-study/NokiaGridDecor";
import PipelineDiagram from "@/components/case-study/PipelineDiagram";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("nokia-dashboard");

const facts = [
  { value: "7+", label: "sources: Jira and 6+ other internal systems" },
  { value: "4", label: "pipeline stages: collect, analyse, correlate, report" },
  { value: "1", label: "live dashboard replacing manual, one-off analyses" },
  { value: "AI", label: "summary layer on top of the correlated data" },
];

export const metadata: Metadata = {
  title: "Feature Analyzer — Case Study",
  description:
    "Nokia internal platform: Jira and 6+ other internal sources collected, correlated and shown in one live dashboard, with an AI summary on top. FastAPI + React.",
  alternates: { canonical: "/projects/nokia-dashboard" },
  openGraph: {
    title: "Feature Analyzer — Case Study · Elias Elloumi",
    description:
      "One pipeline from seven internal sources to one live dashboard with an AI summary — built end to end at Nokia.",
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
            An internal Nokia platform I designed and built end to end: it
            collects Jira and the other internal sources, correlates them, and
            shows one live dashboard with an AI summary on top.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Creator & lead developer", "FastAPI", "React", "Python"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1.5 text-xs font-medium ring-1"
                  style={{
                    color: "var(--cs-accent)",
                    backgroundColor:
                      "color-mix(in srgb, var(--cs-accent) 12%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--cs-accent) 30%, transparent)",
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </ViewTransition>

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="At a glance">
            <CaseStudyMetrics metrics={facts} />
          </CaseStudySection>

          <CaseStudySection title="The problem">
            <p>
              To understand a feature you had to open Jira, then a string of
              other internal tools, and reconcile what each one said by hand.
              Every analysis was a one-off, and nobody had a single, current
              view.
            </p>
            <p>
              The gap was not missing data. It was that the data lived in
              systems that never met, so the conclusion depended on whoever
              had the patience to stitch them together.
            </p>
          </CaseStudySection>

          <CaseStudySection title="The pipeline">
            <p>
              Sources feed a FastAPI backend that collects, analyses and
              correlates them; a React dashboard shows the result live, and a
              summary layer turns it into a conclusion that can be read in one
              pass.
            </p>
            <PipelineDiagram />
            <p>
              Collecting is plumbing. The value is in the correlation: a
              ticket and everything the other systems say about it appear
              together, instead of in seven tabs.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What I built">
            <p>
              Creator and lead developer. I designed the whole stack: the
              FastAPI services behind the data pipeline, the React dashboard,
              and the workflow the teams adopted as their daily reference in
              place of manual analysis.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Where the AI sits">
            <p>
              The AI layer is a summary on top of already-unified data, and I
              am straightforward about that: it is the simple part. The model
              reads a clean, correlated view instead of raw exports, and the
              data work is what makes that possible.
            </p>
            <p>
              The harder AI work came afterwards, at Cleva Solutions —
              fine-tuning and serving open-source models.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Confidentiality">
            <p>
              Internal tooling with no public URL, so there are no screenshots
              here and the sources are described by type, not by name.
            </p>
          </CaseStudySection>

          <CaseStudyCta description="Feature Analyzer is the main tool of the Nokia chapter. The other half is how I got four teams to adopt AI tooling — see the Cursor portal case study." />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
