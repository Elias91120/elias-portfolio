"use client";

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { chaptersById } from "@/lib/data";
import {
  clearStoryPath,
  getBranchPointForChapter,
  loadStoryPath,
  resolveStoryPath,
  saveStoryPath,
  type StoryBranchPoint,
} from "@/lib/story-branches";
import MobileStoryCard from "./MobileStoryCard";
import StoryTeaser from "./StoryTeaser";

type MobileStorySectionProps = {
  enabled?: boolean;
  collapsed?: boolean;
  onExpand?: () => void;
};

function MobileStoryChoice({
  branchPoint,
  chapterAccent,
  onChoose,
}: {
  branchPoint: StoryBranchPoint;
  chapterAccent: string;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div
      className="rounded-2xl bg-card/90 p-5 ring-1 ring-white/10 backdrop-blur-sm"
      role="group"
      aria-label={branchPoint.prompt ?? "Story choice"}
    >
      {branchPoint.prompt && (
        <p className="mb-3 text-center font-display text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted">
          {branchPoint.prompt}
        </p>
      )}
      <div className="flex flex-col gap-2.5">
        {branchPoint.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice.id)}
            className="story-choice-btn min-h-11 cursor-pointer rounded-full border border-white/15 bg-black/30 px-4 py-2.5 text-sm font-medium text-[#ece9f6] backdrop-blur-md transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            style={{ "--choice-accent": chapterAccent } as CSSProperties}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MobileStorySection({
  enabled = true,
  collapsed = false,
  onExpand,
}: MobileStorySectionProps) {
  const [pathChoices, setPathChoices] = useState<Record<string, string>>(
    () => loadStoryPath()
  );

  const orderedChapterIds = useMemo(
    () => resolveStoryPath(pathChoices),
    [pathChoices]
  );

  const visibleChapterIds = useMemo(() => {
    const ids: string[] = [];
    for (const id of orderedChapterIds) {
      ids.push(id);
      const bp = getBranchPointForChapter(id);
      if (bp && !pathChoices[id]) break;
    }
    return ids;
  }, [orderedChapterIds, pathChoices]);

  const visibleChapters = useMemo(
    () =>
      visibleChapterIds
        .map((id) => chaptersById[id])
        .filter((ch): ch is NonNullable<typeof ch> => Boolean(ch)),
    [visibleChapterIds]
  );

  const pendingBranch = useMemo(() => {
    const lastId = visibleChapterIds[visibleChapterIds.length - 1];
    if (!lastId) return null;
    const bp = getBranchPointForChapter(lastId);
    if (!bp || pathChoices[lastId]) return null;
    return bp;
  }, [visibleChapterIds, pathChoices]);

  const handleChoice = useCallback(
    (choiceId: string) => {
      if (!pendingBranch) return;
      const next = {
        ...pathChoices,
        [pendingBranch.atChapterId]: choiceId,
      };
      setPathChoices(next);
      saveStoryPath(next);
    },
    [pendingBranch, pathChoices]
  );

  const handleRestart = useCallback(() => {
    clearStoryPath();
    setPathChoices({});
  }, []);

  if (collapsed) {
    return (
      <section
        id="story"
        aria-label="Story teaser"
        className="relative border-t border-white/5 px-5 py-10"
      >
        <StoryTeaser onExpand={onExpand ?? (() => {})} />
      </section>
    );
  }

  if (!enabled) return null;

  const totalChapters = orderedChapterIds.length;
  const progress =
    visibleChapterIds.length > 0
      ? visibleChapterIds.length / totalChapters
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
              {visibleChapterIds.length}/{totalChapters}
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

        <div className="flex flex-col gap-6">
          {visibleChapters.map((ch, i) => (
            <MobileStoryCard
              key={ch.id}
              chapter={ch}
              index={orderedChapterIds.indexOf(ch.id)}
              total={totalChapters}
            />
          ))}

          {pendingBranch && (
            <MobileStoryChoice
              branchPoint={pendingBranch}
              chapterAccent={
                chaptersById[pendingBranch.atChapterId]?.accent ?? "#a78bfa"
              }
              onChoose={handleChoice}
            />
          )}

          {!pendingBranch &&
            visibleChapterIds.length === orderedChapterIds.length && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="min-h-11 rounded-full px-5 py-2 text-sm text-muted ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/20"
                >
                  Restart story
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
