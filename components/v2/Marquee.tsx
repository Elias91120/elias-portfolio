"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Two rows that slide in opposite directions as the page scrolls.
 *
 * Row one is real product screenshots — the proof. Row two is typographic,
 * so the band reads as a stack manifesto without costing a single extra
 * kilobyte of imagery.
 */

const shots: { src: string; alt: string }[] = [
  { src: "/projects/nokia-dashboard.webp", alt: "Nokia Feature Analyzer dashboard" },
  { src: "/projects/express-divorce.webp", alt: "Express Divorce USA" },
  { src: "/projects/prompt-hub.webp", alt: "Prompt Hub" },
  { src: "/projects/green-jardin-storefront.webp", alt: "Green Jardin storefront" },
  { src: "/projects/two.webp", alt: "Two iOS app" },
  { src: "/projects/promptoptim.webp", alt: "PromptOptim" },
  { src: "/projects/ai-travel-planner.webp", alt: "AI Travel Planner" },
  { src: "/projects/green-jardin-tv.webp", alt: "Green Jardin live TV menu" },
  { src: "/projects/callkitchen.webp", alt: "CallKitchen" },
  { src: "/projects/web-gen.webp", alt: "3geeks web generator" },
  { src: "/projects/green-jardin-pos.webp", alt: "Green Jardin point of sale" },
];

const words = [
  "Data pipelines",
  "AI agents",
  "RAG",
  "FastAPI",
  "Next.js",
  "LangGraph",
  "Docker",
  "Traefik",
  "PostgreSQL",
  "Multi-agent",
  "Self-hosted",
  "TypeScript",
];

export default function Marquee() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowA = useRef<HTMLDivElement | null>(null);
  const rowB = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const offset =
        (window.scrollY - top + window.innerHeight) * 0.24 - 200;
      if (rowA.current)
        rowA.current.style.transform = `translate3d(${offset}px,0,0)`;
      if (rowB.current)
        rowB.current.style.transform = `translate3d(${-offset}px,0,0)`;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const tripled = [...shots, ...shots, ...shots];
  const tripledWords = [...words, ...words, ...words];

  return (
    <section
      ref={sectionRef}
      aria-hidden
      className="relative overflow-hidden py-20 sm:py-24 md:py-28"
    >
      <div className="flex flex-col gap-3">
        <div
          ref={rowA}
          className="flex w-max gap-3"
          style={{ willChange: "transform" }}
        >
          {tripled.map((shot, i) => (
            <div
              key={`${shot.src}-${i}`}
              className="relative h-[150px] w-[240px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-card sm:h-[190px] sm:w-[300px] md:h-[230px] md:w-[360px]"
            >
              <Image
                src={shot.src}
                alt=""
                fill
                loading="lazy"
                sizes="360px"
                className="object-cover opacity-80"
              />
            </div>
          ))}
        </div>

        <div
          ref={rowB}
          className="flex w-max gap-3"
          style={{ willChange: "transform" }}
        >
          {tripledWords.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="flex h-[54px] shrink-0 items-center rounded-full border border-white/[0.09] px-6 font-display text-sm font-medium uppercase tracking-[0.14em] text-muted sm:h-[64px] sm:px-8 sm:text-base"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Soft edges so the rows fade into the page rather than getting cut. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />
    </section>
  );
}
