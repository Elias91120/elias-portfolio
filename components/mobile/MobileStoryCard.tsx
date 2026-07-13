"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    const video = videoRef.current;
    if (!el || !video || !ch.video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ch.video]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || !ch.video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [ch.video]);

  const mediaAspect = ch.video ? "aspect-[9/16] max-h-[22rem]" : "aspect-[16/9]";

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-white/10"
      data-chapter={ch.id}
      style={{ boxShadow: `0 16px 48px -24px ${ch.accent}44` }}
    >
      <button
        type="button"
        onClick={ch.video ? toggleVideo : undefined}
        className={`relative w-full overflow-hidden ${mediaAspect} ${ch.video ? "cursor-pointer" : "cursor-default"}`}
        aria-label={ch.video ? (playing ? "Pause video" : "Play video") : undefined}
      >
        <Image
          src={ch.image}
          alt={ch.imageAlt}
          fill
          sizes="88vw"
          className={`object-cover ${playing && ch.video ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
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
        {ch.video && (
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
            {playing ? (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#120e20] via-transparent to-transparent"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-medium text-white/90 backdrop-blur-sm">
          {index + 1}/{total}
        </span>
      </button>

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
    </motion.article>
  );
}
