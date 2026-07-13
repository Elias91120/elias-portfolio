"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

type MobileProjectCarouselProps = {
  projects: Project[];
};

export default function MobileProjectCarousel({
  projects,
}: MobileProjectCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || projects.length === 0) return;
    const slideWidth = el.scrollWidth / projects.length;
    if (slideWidth <= 0) return;
    const index = Math.round(el.scrollLeft / slideWidth);
    setActiveIndex(Math.min(projects.length - 1, Math.max(0, index)));
  }, [projects.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el || projects.length === 0) return;
    const slideWidth = el.scrollWidth / projects.length;
    el.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  if (projects.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2 px-0.5">
        <span className="text-xs text-muted">
          {activeIndex + 1}/{projects.length}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="mobile-project-carousel -mx-5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {projects.map((project, i) => (
          <div
            key={project.name}
            className="w-[88vw] shrink-0 snap-center px-2.5 first:pl-5 last:pr-5"
          >
            <ProjectCard
              project={project}
              index={i}
              variant="mobileFeatured"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {projects.map((project, i) => (
          <button
            key={project.name}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to project ${project.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
