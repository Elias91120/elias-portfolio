"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { Chapter } from "@/lib/data";
import { CHAPTER_ROMANS } from "./constants";
import StoryVideo from "./StoryVideo";

type StoryPageProps = {
  chapter: Chapter;
  index: number;
  setVideoRef: (el: HTMLVideoElement | null) => void;
};

export default function StoryPage({
  chapter: ch,
  index,
  setVideoRef,
}: StoryPageProps) {
  return (
    <article
      className="story-page absolute inset-0"
      data-chapter={ch.id}
    >
      <div className="page-img-wrap relative h-full absolute inset-0 overflow-hidden">
        <div className="page-img absolute inset-0">
          <Image
            src={ch.image}
            alt={ch.imageAlt}
            fill
            sizes="100vw"
            className={`object-cover${ch.video ? " story-poster" : ""}`}
            loading={index === 0 ? "eager" : "lazy"}
            priority={index === 0}
            quality={90}
          />
          {ch.video && (
            <StoryVideo
              ref={setVideoRef}
              src={ch.video}
              poster={ch.image}
            />
          )}
        </div>

        <div
          aria-hidden
          className="story-vignette absolute inset-0"
          style={
            {
              "--vignette-color": ch.bgB,
            } as CSSProperties
          }
        />

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[70%]"
          style={{
            background: `linear-gradient(to top, ${ch.bgB} 4%, ${ch.bgB}cc 34%, transparent 100%)`,
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/10" />
      </div>

      <div className="page-text absolute z-10 inset-x-0 bottom-0 px-6 pb-24 sm:px-10 lg:px-24 lg:pb-28 max-w-4xl">
        <div
          className="story-kicker font-display text-[0.7rem] lg:text-xs font-semibold uppercase tracking-[0.35em]"
          style={{ color: ch.accent, "--kicker-accent": ch.accent } as CSSProperties}
        >
          Chapter {CHAPTER_ROMANS[index]} · {ch.years}
        </div>
        <h2 className="font-serif mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f5f0e4]">
          {ch.title}
        </h2>
        <p className="font-serif mt-4 lg:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed lg:leading-[1.75] text-[#e9e3d3]/90">
          {ch.text}
        </p>
      </div>
    </article>
  );
}
