"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Chapter } from "@/lib/data";
import MobileStoryCard from "./MobileStoryCard";

type MobileStoryCarouselProps = {
  chapters: Chapter[];
  orderedChapterIds: string[];
  totalChapters: number;
  onRestart?: () => void;
  showRestart?: boolean;
};

export default function MobileStoryCarousel({
  chapters,
  orderedChapterIds,
  totalChapters,
  onRestart,
  showRestart = false,
}: MobileStoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || chapters.length === 0) return;
    const slideWidth = el.scrollWidth / chapters.length;
    if (slideWidth <= 0) return;
    const index = Math.round(el.scrollLeft / slideWidth);
    setActiveIndex(Math.min(chapters.length - 1, Math.max(0, index)));
  }, [chapters.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el || chapters.length === 0) return;
    const slideWidth = el.scrollWidth / chapters.length;
    el.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <div>
      <div
        ref={scrollRef}
        className="mobile-story-carousel -mx-5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="w-[88vw] shrink-0 snap-center px-2.5 first:pl-5 last:pr-5"
          >
            <MobileStoryCard
              chapter={ch}
              index={orderedChapterIds.indexOf(ch.id)}
              total={totalChapters}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to chapter ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex
                ? "w-5 bg-accent"
                : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>

      {showRestart && onRestart && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="touch-press min-h-11 rounded-full px-5 py-2 text-sm text-muted ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/20"
          >
            Restart story
          </button>
        </div>
      )}
    </div>
  );
}
