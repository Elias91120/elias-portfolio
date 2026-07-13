"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";
import ProjectCardMetrics from "@/components/ProjectCardMetrics";
import { getProjectSlug } from "@/lib/dev-terminal-commands";
import { getCaseStudySlug } from "@/lib/view-transitions";

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  Beta: "bg-violet-400/10 text-violet-300 ring-violet-400/30",
  "App Store": "bg-sky-400/10 text-sky-300 ring-sky-400/30",
  Award: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  Internal: "bg-white/5 text-[#b8b3cf] ring-white/15",
};

type ProjectCardProps = {
  project: Project;
  index: number;
  variant?: "featured" | "compact" | "mobileFeatured";
  mobile?: boolean;
};

function CardWrapper({
  project,
  className,
  style,
  children,
}: {
  project: Project;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (project.caseStudy) {
    return (
      <Link
        href={project.caseStudy}
        transitionTypes={["nav-forward"]}
        className={className}
        style={style}
      >
        {children}
      </Link>
    );
  }
  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
  variant = "featured",
  mobile = false,
}: ProjectCardProps) {
  const isMobileFeatured = variant === "mobileFeatured";
  const isFeatured = variant === "featured" && !mobile && !isMobileFeatured;
  const clickable = Boolean(project.link || project.caseStudy);
  const caseStudySlug = getCaseStudySlug(project);
  const projectSlug = getProjectSlug(project);
  const useMorphPreview =
    isFeatured && project.image && project.caseStudy && caseStudySlug;
  const isCaseStudy = Boolean(project.caseStudy);
  const isCompactCaseStudy = isCaseStudy && !isFeatured && !isMobileFeatured;

  return (
    <motion.div
      data-project-slug={projectSlug}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="h-full"
    >
      <CardWrapper
        project={project}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 transition-all duration-300 touch-press ${
          isFeatured || isMobileFeatured ? "ring-white/12" : "p-6 ring-white/8"
        } ${
          isCaseStudy ? "ring-[color-mix(in_srgb,var(--cs-accent,_#a78bfa)_18%,transparent)]" : ""
        } ${
          clickable
            ? "hover:-translate-y-1.5 hover:ring-white/25 cursor-pointer"
            : "hover:ring-white/15"
        } ${isCaseStudy && clickable ? "hover:ring-[color-mix(in_srgb,currentColor_35%,transparent)]" : ""}`}
        style={{
          boxShadow: `0 20px 60px -32px ${project.accent}${isFeatured || isMobileFeatured ? "55" : "40"}`,
          ...(isCaseStudy
            ? ({ "--cs-accent": project.accent } as React.CSSProperties)
            : {}),
        }}
      >
        {isMobileFeatured && project.image && (
          <div className="relative">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.04] px-3 py-2">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
              </span>
              {project.linkLabel && (
                <span className="mx-auto min-w-0 truncate font-mono text-[0.6rem] text-muted">
                  {project.linkLabel}
                </span>
              )}
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={project.image}
                alt={`Screenshot of ${project.name}`}
                fill
                sizes="88vw"
                className="object-cover object-top"
              />
              <span
                className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[0.65rem] font-medium ring-1 backdrop-blur-md ${
                  statusStyles[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        )}
        {/* Live product preview, framed like a browser window */}
        {isFeatured && project.image && useMorphPreview && (
          <ProjectBrowserPreview
            slug={caseStudySlug}
            imageSrc={project.image}
            imageAlt={`Screenshot of ${project.name}`}
            linkLabel={project.linkLabel}
            status={project.status}
            variant="card"
          />
        )}
        {isFeatured && project.image && !useMorphPreview && (
          <div className="relative">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.04] px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </span>
              {project.linkLabel && (
                <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full bg-black/30 px-3 py-0.5 font-mono text-[0.65rem] text-muted">
                  <svg
                    className="h-2.5 w-2.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="truncate">{project.linkLabel}</span>
                </span>
              )}
              <span className="w-8" aria-hidden />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={project.image}
                alt={`Screenshot of ${project.name}`}
                fill
                sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 92vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-16"
                style={{
                  background: "linear-gradient(to top, #120e20, transparent)",
                }}
              />
              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ring-1 backdrop-blur-md ${
                  statusStyles[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        )}

        <ViewTransition exit="card-content-exit" default="none">
          <div
            className={`flex flex-1 flex-col ${
              isFeatured ? "p-7 pt-5" : isMobileFeatured ? "p-5 pt-4" : ""
            }`}
          >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              height: isFeatured ? "8rem" : "7rem",
              background: `linear-gradient(to bottom, ${project.accent}${isFeatured ? "1a" : "14"}, transparent)`,
            }}
          />

          {isCaseStudy && (isFeatured || isMobileFeatured) && project.image && (
            <span
              className="mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ring-1"
              style={{
                color: project.accent,
                backgroundColor: `${project.accent}14`,
                borderColor: `${project.accent}35`,
              }}
            >
              Case study
            </span>
          )}

          {(!isFeatured || !project.image) && !isMobileFeatured && (
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-3">
                {project.logo && (
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain object-left"
                  />
                )}
                <div
                  className={`rounded-full ${project.logo ? "" : "mt-2"} ${isFeatured ? "h-2 w-12" : "h-1.5 w-10"}`}
                  style={{ backgroundColor: project.accent }}
                />
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {isCaseStudy && (
                  <span
                    className="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ring-1"
                    style={{
                      color: project.accent,
                      backgroundColor: `${project.accent}14`,
                      borderColor: `${project.accent}35`,
                    }}
                  >
                    Case study
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                    statusStyles[project.status]
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          )}

          <h3
            className={`font-display font-semibold text-white ${
              isFeatured ? "text-2xl" : isMobileFeatured ? "text-xl" : "text-xl"
            } ${(isFeatured || isMobileFeatured) && project.image ? "" : "mt-4"} ${
              isCaseStudy ? "transition-colors group-hover:text-[color-mix(in_srgb,white_92%,var(--cs-accent))]" : ""
            }`}
          >
            {project.name}
            {clickable && (
              <span
                className={`ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 ${
                  isCaseStudy
                    ? "text-[var(--cs-accent)] group-hover:text-white"
                    : "text-muted group-hover:text-white"
                }`}
              >
                {project.caseStudy ? "→" : "↗"}
              </span>
            )}
          </h3>
          <div className="mt-1 text-sm" style={{ color: project.accent }}>
            {project.role}
          </div>

          <p
            className={`mt-4 leading-relaxed text-[#c5c0da] ${
              isFeatured ? "text-base" : "text-sm"
            } ${
              isMobileFeatured
                ? "line-clamp-3"
                : isCompactCaseStudy
                  ? "line-clamp-3 flex-none"
                  : isCaseStudy && project.metrics
                    ? "line-clamp-2 flex-none"
                    : "flex-1"
            }`}
          >
            {project.description}
          </p>

          {isCaseStudy && project.metrics && project.metrics.length > 0 && (
            <ProjectCardMetrics
              metrics={project.metrics}
              accent={project.accent}
              compact={!isFeatured && !isMobileFeatured}
              className={`${isCompactCaseStudy ? "mt-5 flex-1" : "mt-5"} ${
                isFeatured ? "sm:mt-6" : ""
              }`}
            />
          )}

          {isFeatured && !isCaseStudy && project.highlights && project.highlights.length > 0 && (
            <ul className="mt-5 space-y-2">
              {(mobile ? project.highlights.slice(0, 2) : project.highlights).map(
                (highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-sm text-[#d4d0e8]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          <div className={`flex flex-wrap gap-2 ${isFeatured ? "mt-6" : "mt-5"}`}>
            {(mobile ? project.tags.slice(0, 3) : project.tags).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#b8b3cf] ring-1 ring-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {isMobileFeatured && clickable && (project.ctaLabel || project.caseStudy) && (
            <div
              className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
                isCaseStudy ? "" : "text-accent"
              }`}
              style={isCaseStudy ? { color: project.accent } : undefined}
            >
              {project.ctaLabel ?? "Voir le case study"}
              <span aria-hidden>{project.caseStudy ? "→" : "↗"}</span>
            </div>
          )}

          {clickable && project.ctaLabel && (isFeatured || isCompactCaseStudy) && (
            <div
              className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-medium text-white ring-1 transition-all duration-300 group-hover:ring-white/30 ${
                isFeatured ? "mt-6" : "mt-5"
              } ${isCaseStudy ? "" : "bg-white/8 ring-white/15 group-hover:bg-white/12"}`}
              style={
                isCaseStudy
                  ? {
                      backgroundColor: `${project.accent}22`,
                      boxShadow: `0 0 0 1px ${project.accent}30`,
                    }
                  : undefined
              }
            >
              {project.ctaLabel}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                {project.caseStudy ? "→" : "↗"}
              </span>
            </div>
          )}

          {!isFeatured && project.linkLabel && (
            <div className="mt-4 text-xs text-muted transition-colors group-hover:text-white">
              {project.linkLabel}
            </div>
          )}
          </div>
        </ViewTransition>
      </CardWrapper>
    </motion.div>
  );
}
