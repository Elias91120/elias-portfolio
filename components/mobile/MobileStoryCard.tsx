"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Chapter } from "@/lib/data";
import { CHAPTER_ROMANS } from "@/components/story/constants";

type MobileStoryCardProps = {
  chapter: Chapter;
  index: number;
  total: number;
};

export default function MobileStoryCard({
  chapter: ch,
  index,
  total,
}: MobileStoryCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    const video = videoRef.current;
    if (!el || !video || !ch.video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ch.video]);

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-white/10"
      data-chapter={ch.id}
      style={{ boxShadow: `0 16px 48px -24px ${ch.accent}44` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={ch.image}
          alt={ch.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          loading={index === 0 ? "eager" : "lazy"}
          priority={index === 0}
          quality={85}
        />
        {ch.video && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={ch.video}
            poster={ch.image}
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden
            tabIndex={-1}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#120e20] via-transparent to-transparent"
        />
        <span
          className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-medium text-white/90 backdrop-blur-sm"
        >
          {index + 1}/{total}
        </span>
      </div>

      <div className="px-5 py-5">
        <div
          className="story-kicker font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em]"
          style={{ color: ch.accent, "--kicker-accent": ch.accent } as CSSProperties}
        >
          Chapter {CHAPTER_ROMANS[index] ?? index + 1} · {ch.years}
        </div>
        <h2 className="font-serif mt-2 text-2xl font-semibold tracking-tight text-[#f5f0e4]">
          {ch.title}
        </h2>
        <p className="font-serif mt-3 text-base leading-relaxed text-[#e9e3d3]/90">
          {ch.text}
        </p>
      </div>
    </article>
  );
}
