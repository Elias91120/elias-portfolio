import type { Metadata } from "next";
import Image from "next/image";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import TravelMapDecor from "@/components/case-study/TravelMapDecor";
import UseCaseScreenGrid from "@/components/case-study/UseCaseScreenGrid";
import {
  TravelBriefMock,
  TravelItineraryMock,
} from "@/components/case-study/TravelPlannerMock";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("ai-travel-planner");

export const metadata: Metadata = {
  title: "AI Travel Planner — Case Study",
  description:
    "Intent-based travel planning powered by Gemini — day-by-day tailor-made trips from what travelers actually want. Best Bachelor project at ECE Paris.",
  alternates: { canonical: "/projects/ai-travel-planner" },
  openGraph: {
    title: "AI Travel Planner — Case Study · Elias Elloumi",
    description:
      "Gemini-powered travel planner elected best Bachelor project at ECE Paris — brief to itinerary in one flow.",
  },
};

const awardTags = ["Gemini", "Best Bachelor project", "Intent-based planning"];

export default function AiTravelPlannerCaseStudy() {
  return (
    <CaseStudyShell
      theme={theme}
      badge="Award · ECE Paris"
      contactHref="/#contact"
      contactLabel="Discuss this project"
      decor={<TravelMapDecor />}
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
            AI Travel Planner —{" "}
            <span className="font-serif italic font-semibold text-[var(--cs-fg)]">
              trips from intent
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--cs-muted)]">
            An intent-based travel app powered by Gemini — describe what you
            actually want, and get a day-by-day itinerary tailored to you. Elected
            best Bachelor project at ECE Paris.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {awardTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1.5 text-xs font-medium ring-1"
                style={{
                  color: "var(--cs-accent)",
                  backgroundColor: "color-mix(in srgb, var(--cs-accent) 12%, transparent)",
                  borderColor: "color-mix(in srgb, var(--cs-accent) 30%, transparent)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </ViewTransition>

      <ProjectBrowserPreview
        slug="ai-travel-planner"
        imageSrc="/projects/ai-travel-planner.webp"
        imageAlt="AI Travel Planner app interface"
        linkLabel="travel-planner.ece"
        priority
        className="mt-10"
      />

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="The problem">
            <p>
              Generic travel sites give you hotels and flights — not what you
              actually want from a trip. &ldquo;3 days in Barcelona&rdquo; ignores
              the brief: food markets, quiet neighborhoods, sunset spots, budget
              constraints.
            </p>
            <p>
              Travel planning should start with intent, not inventory.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Intent-based planning">
            <p>
              Users write a natural-language brief — who they&apos;re traveling with,
              what they care about, what to avoid. Gemini interprets the intent,
              and SaaS APIs enrich the plan with real-world data. The output is a
              day-by-day itinerary, not a list of links.
            </p>
            <p>
              Brief → structured days → actionable stops. One flow, from sentence
              to schedule.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Recognition">
            <p>
              The project was elected <em>best Bachelor project</em> at ECE Paris —
              recognition that intent-based AI products can be both technically
              sound and genuinely useful.
            </p>
          </CaseStudySection>

          <CaseStudySection title="My role">
            <p>
              Team project at ECE. I focused on AI integration — Gemini
              orchestration, prompt design, and the product UX that turns model
              output into something travelers can actually follow.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Use-case screens">
            <p>
              From trip brief to generated day cards — the interface makes AI
              output feel like a travel companion, not a chatbot dump.
            </p>
            <UseCaseScreenGrid
              screens={[
                {
                  linkLabel: "travel-planner.ece/brief",
                  imageAlt: "Trip brief input screen",
                  caption:
                    "Trip brief — natural language in, structured intent out.",
                  mock: <TravelBriefMock />,
                },
                {
                  linkLabel: "travel-planner.ece/itinerary",
                  imageAlt: "Generated day-by-day itinerary",
                  caption:
                    "Generated itinerary — day-by-day cards with stops, timing, and context.",
                  mock: <TravelItineraryMock />,
                },
                {
                  imageSrc: "/story/chapter-4.jpg",
                  imageAlt: "Elias presenting the AI travel planner on stage at ECE",
                  linkLabel: "ECE Paris · Best Bachelor",
                  caption:
                    "Presenting on stage at ECE — the moment the project earned best Bachelor recognition.",
                },
              ]}
            />
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src="/story/chapter-4.jpg"
                alt="Elias presenting AI Travel Planner at ECE Paris"
                width={1400}
                height={600}
                className="h-48 w-full object-cover object-top sm:h-56"
              />
            </div>
          </CaseStudySection>

          <CaseStudyCta
            description="The ECE chapter is where coding became shipping — read the full story from Minecraft worlds to production AI systems."
          />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
