import type { Metadata } from "next";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import CaseStudyMetrics from "@/components/case-study/CaseStudyMetrics";
import AdoptionFlowDiagram from "@/components/case-study/AdoptionFlowDiagram";
import CursorPortalDecor from "@/components/case-study/CursorPortalDecor";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("cursor-portal");

const impactMetrics = [
  { value: "1,019", label: "total portal views" },
  { value: "75", label: "unique visitors" },
  { value: "100+", label: "questions to the RAG assistant" },
  { value: "4", label: "teams onboarded via demos" },
];

const portalTags = ["RAG", "DevEx", "MCP", "AI adoption"];

export const metadata: Metadata = {
  title: "Cursor pour les nuls — Case Study",
  description:
    "Internal Nokia portal accelerating Cursor adoption — knowledge hub, RAG assistant, team demos across 4 squads, and hands-on 1:1 coaching on real use cases.",
  alternates: { canonical: "/projects/cursor-portal" },
  openGraph: {
    title: "Cursor pour les nuls — Case Study · Elias Elloumi",
    description:
      "Led Cursor adoption at Nokia: internal portal with RAG assistant, 1,019 views, 100+ AI questions answered, demos across 4 teams.",
  },
};

export default function CursorPortalCaseStudy() {
  return (
    <CaseStudyShell
      theme={theme}
      badge="Internal · Nokia"
      contactHref="/#contact"
      contactLabel="Discuss this project"
      decor={<CursorPortalDecor />}
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
            Cursor pour les nuls —{" "}
            <span className="font-serif italic font-semibold text-[var(--cs-fg)]">
              adoption at scale
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--cs-muted)]">
            An internal portal I built and led to accelerate Cursor adoption
            across my sector — centralized knowledge, a RAG-powered assistant,
            team demos, and hands-on coaching so colleagues could ship faster
            with the right APIs, tools, and MCP setups.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {portalTags.map((tag) => (
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
            ))}
          </div>
        </div>
      </ViewTransition>

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="Impact at a glance">
            <p>
              Real usage from the portal — not vanity metrics. People came back,
              asked questions, and teams invited me to present.
            </p>
            <CaseStudyMetrics metrics={impactMetrics} />
          </CaseStudySection>

          <CaseStudySection title="The problem">
            <p>
              Cursor was powerful, but adoption was uneven. Engineers didn&apos;t
              know where to start, which internal APIs to wire in, or how to
              configure MCP servers for their stack. Knowledge was scattered —
              Confluence here, Slack threads there, no single place to learn and
              ask.
            </p>
            <p>
              The gap wasn&apos;t the tool — it was the onboarding path. People
              needed a hub, a guide, and someone to unblock them on real use
              cases.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What I built">
            <p>
              <em>Cursor pour les nuls</em> — an internal portal combining a
              structured knowledge base, a RAG assistant trained on internal docs,
              and a collaborative forum. One place to find the right APIs, discover
              internal tools, and learn how to set up MCP so Cursor works in
              enterprise conditions.
            </p>
            <AdoptionFlowDiagram />
          </CaseStudySection>

          <CaseStudySection title="RAG assistant">
            <p>
              The embedded AI assistant answered practical questions directly on
              the portal — how to connect to internal services, which APIs to
              use, workflow patterns that worked for other teams. Over{" "}
              <strong className="font-semibold text-white">100 questions</strong>{" "}
              were asked, turning the site from a static wiki into an active
              support layer.
            </p>
            <p>
              No public URL — internal tooling built for Nokia engineers in my
              sector, with content scoped to what they actually need day to day.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Team demos & onboarding">
            <p>
              I ran presentations and hands-on sessions across{" "}
              <strong className="font-semibold text-white">
                4 different teams
              </strong>{" "}
              in my sector — not generic slides, but hooks tied to their actual
              workflows. The goal: convince people to try Cursor, show concrete use
              cases, and point them to the portal when they needed APIs, internal
              tools, or MCP configuration.
            </p>
            <p>
              Each session ended with a clear next step — a use case to try, a
              doc to read, or a follow-up pairing session.
            </p>
          </CaseStudySection>

          <CaseStudySection title="1:1 guided coaching">
            <p>
              Beyond the portal and demos, I spent a lot of time helping
              colleagues one by one — unblocking specific use cases, pairing on
              tricky integrations, brainstorming the best approach when the first
              idea didn&apos;t land. That&apos;s where adoption actually stuck:
              when someone ships their first real feature with Cursor instead of
              giving up after day one.
            </p>
            <p>
              The pattern was always the same: understand the blocker, map it to
              the right internal API or MCP setup, then pair until it works in
              their repo.
            </p>
          </CaseStudySection>

          <CaseStudySection title="My role">
            <p>
              Creator, lead, and adoption champion. I designed and shipped the
              portal, built the RAG integration, ran the team demos, and stayed
              available for guided coaching. This is the human side of DevEx —
              not just documentation, but momentum.
            </p>
          </CaseStudySection>

          <CaseStudyCta
            description="This project sits alongside the Feature Analyzer Dashboard — the Nokia chapter where Elias went from shipping platforms to helping entire teams move faster with AI."
          />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
