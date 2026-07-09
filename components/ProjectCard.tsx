"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";

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
  variant?: "featured" | "compact";
};

export default function ProjectCard({
  project,
  index,
  variant = "featured",
}: ProjectCardProps) {
  const isFeatured = variant === "featured";
  const Wrapper = project.link ? "a" : "div";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
    >
      <Wrapper
        {...(project.link
          ? {
              href: project.link,
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 transition-all duration-300 ${
          isFeatured ? "p-8 ring-white/12" : "p-6 ring-white/8"
        } ${
          project.link
            ? "hover:-translate-y-1.5 hover:ring-white/25 cursor-pointer"
            : "hover:ring-white/15"
        }`}
        style={{
          boxShadow: `0 20px 60px -32px ${project.accent}${isFeatured ? "55" : "40"}`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            height: isFeatured ? "8rem" : "7rem",
            background: `linear-gradient(to bottom, ${project.accent}${isFeatured ? "1a" : "14"}, transparent)`,
          }}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-3 min-w-0">
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
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              statusStyles[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>

        <h3
          className={`font-display mt-4 font-semibold text-white ${
            isFeatured ? "text-2xl" : "text-xl"
          }`}
        >
          {project.name}
          {project.link && (
            <span className="ml-2 inline-block text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-white">
              ↗
            </span>
          )}
        </h3>
        <div className="mt-1 text-sm" style={{ color: project.accent }}>
          {project.role}
        </div>

        <p
          className={`mt-4 flex-1 leading-relaxed text-[#c5c0da] ${
            isFeatured ? "text-base" : "text-sm"
          }`}
        >
          {project.description}
        </p>

        {isFeatured && project.highlights && project.highlights.length > 0 && (
          <ul className="mt-5 space-y-2">
            {project.highlights.map((highlight) => (
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
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#b8b3cf] ring-1 ring-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {isFeatured && project.link && project.ctaLabel && (
          <div className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition-all duration-300 group-hover:bg-white/12 group-hover:ring-white/30">
            {project.ctaLabel}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              ↗
            </span>
          </div>
        )}

        {!isFeatured && project.linkLabel && (
          <div className="mt-4 text-xs text-muted group-hover:text-white transition-colors">
            {project.linkLabel}
          </div>
        )}
      </Wrapper>
    </motion.div>
  );
}
