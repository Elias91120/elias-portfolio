"use client";

import { useCallback, useMemo, useState } from "react";
import { chaptersById } from "@/lib/data";
import {
  clearStoryPath,
  loadStoryPathWithDefaults,
  resolveStoryPath,
  saveStoryPath,
} from "@/lib/story-branches";
import MobileStoryCarousel from "./MobileStoryCarousel";

export default function MobileStorySection() {
  const [pathChoices, setPathChoices] = useState<Record<string, string>>(
    () => loadStoryPathWithDefaults()
  );

  const orderedChapterIds = useMemo(
    () => resolveStoryPath(pathChoices),
    [pathChoices]
  );

  const visibleChapters = useMemo(
    () =>
      orderedChapterIds
        .map((id) => chaptersById[id])
        .filter((ch): ch is NonNullable<typeof ch> => Boolean(ch)),
    [orderedChapterIds]
  );

  const handleRestart = useCallback(() => {
    clearStoryPath();
    setPathChoices(loadStoryPathWithDefaults());
  }, []);

  const totalChapters = orderedChapterIds.length;
  const progress =
    visibleChapters.length > 0
      ? visibleChapters.length / totalChapters
      : 0;

  return (
    <section id="story" className="relative px-5 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <span className="section-kicker font-display text-xs font-semibold tracking-[0.3em] text-accent">
            THE STORY
          </span>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-white">
              My journey
            </h2>
            <span className="shrink-0 text-xs text-muted">
              {visibleChapters.length}/{totalChapters}
            </span>
          </div>
          <div
            className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>

        <MobileStoryCarousel
          chapters={visibleChapters}
          orderedChapterIds={orderedChapterIds}
          totalChapters={totalChapters}
          onRestart={handleRestart}
          showRestart
        />
      </div>
    </section>
  );
}
