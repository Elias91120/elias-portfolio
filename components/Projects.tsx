"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  Beta: "bg-violet-400/10 text-violet-300 ring-violet-400/30",
  "App Store": "bg-sky-400/10 text-sky-300 ring-sky-400/30",
  Award: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  Internal: "bg-white/5 text-[#b8b3cf] ring-white/15",
};

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 px-5">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker font-display text-xs sm:text-sm font-semibold tracking-[0.3em] text-accent">
            SHIPPED
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Things I&apos;ve{" "}
            <span className="font-serif italic font-semibold text-[#f5f0e4]">
              built
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-muted leading-relaxed">
            Client products in production, internal platforms used daily by
            teams, and open tools built in public with 3geeks.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const Wrapper = project.link ? "a" : "div";
            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <Wrapper
                  {...(project.link
                    ? {
                        href: project.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-white/8 p-7 transition-all duration-300 ${
                    project.link
                      ? "hover:-translate-y-1.5 hover:ring-white/20 cursor-pointer"
                      : "hover:ring-white/15"
                  }`}
                  style={{
                    boxShadow: `0 20px 60px -32px ${project.accent}40`,
                  }}
                >
                  {/* Accent wash revealed on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(to bottom, ${project.accent}14, transparent)`,
                    }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="h-1.5 w-10 rounded-full mt-2"
                      style={{ backgroundColor: project.accent }}
                    />
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                        statusStyles[project.status]
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="font-display mt-4 text-xl font-semibold text-white">
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

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[#c5c0da]">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#b8b3cf] ring-1 ring-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.linkLabel && (
                    <div className="mt-4 text-xs text-muted group-hover:text-white transition-colors">
                      {project.linkLabel}
                    </div>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
