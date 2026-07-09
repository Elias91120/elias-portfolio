"use client";

import { motion } from "framer-motion";
import {
  clientLiveProjects,
  greenStackProjects,
  professionalProjects,
} from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

type ProjectSectionProps = {
  kicker: string;
  title: string;
  titleAccent?: string;
  description: string;
  projects: typeof clientLiveProjects;
  variant: "featured" | "compact";
  gridClassName: string;
  subdued?: boolean;
};

function ProjectSection({
  kicker,
  title,
  titleAccent,
  description,
  projects,
  variant,
  gridClassName,
  subdued = false,
}: ProjectSectionProps) {
  return (
    <div className={subdued ? "mt-24" : "mt-0"}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span
          className={`section-kicker font-display font-semibold tracking-[0.3em] text-accent ${
            subdued ? "text-xs tracking-[0.25em]" : "text-xs sm:text-sm tracking-[0.3em]"
          }`}
        >
          {kicker}
        </span>
        <h2
          className={`font-display mt-4 font-bold tracking-tight text-white ${
            subdued ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
          }`}
        >
          {titleAccent ? (
            <>
              {title}{" "}
              <span className="font-serif italic font-semibold text-[#f5f0e4]">
                {titleAccent}
              </span>
            </>
          ) : (
            title
          )}
        </h2>
        <p
          className={`mt-5 max-w-2xl text-muted leading-relaxed ${
            subdued ? "text-sm" : ""
          }`}
        >
          {description}
        </p>
      </motion.div>

      <div className={`mt-10 grid gap-6 ${gridClassName}`}>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={i}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 px-5">
      <div className="mx-auto max-w-6xl">
        <ProjectSection
          kicker="CLIENT SHIPPED"
          title="Real projects,"
          titleAccent="already live"
          description="Public projects that show the kind of web and app experiences we can design, build, and launch."
          projects={clientLiveProjects}
          variant="featured"
          gridClassName="grid-cols-1 lg:grid-cols-3"
        />

        <ProjectSection
          kicker="WEBGEN LAB"
          title="Studio lab by"
          titleAccent="webgen"
          description="Web-Gen is the flagship — an intent-to-website generator. Alongside it, we build open AI tools around digital sobriety, project planning, and developer workflows."
          projects={greenStackProjects}
          variant="featured"
          gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />

        <ProjectSection
          kicker="BEHIND THE SCENES"
          title="Professional work"
          description="Internal platforms and award-winning school projects built inside Nokia and at ECE Paris."
          projects={professionalProjects}
          variant="compact"
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          subdued
        />
      </div>
    </section>
  );
}
