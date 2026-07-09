"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { chaptersById } from "@/lib/data";
import {
  clearStoryPath,
  getBranchPointForChapter,
  loadStoryPath,
  resolveStoryPath,
  saveStoryPath,
  type StoryBranchPoint,
} from "@/lib/story-branches";
import StoryChoiceOverlay from "./StoryChoiceOverlay";
import StoryPage from "./StoryPage";
import StoryProgress from "./StoryProgress";
import { useStoryKeyboard, useStoryScroll } from "./useStoryScroll";

type StorySectionProps = {
  enabled?: boolean;
  collapsed?: boolean;
  onExpand?: () => void;
};

export default function StorySection({
  enabled = true,
  collapsed = false,
  onExpand,
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pathChoices, setPathChoices] = useState<Record<string, string>>(
    () => loadStoryPath()
  );
  const [pendingBranch, setPendingBranch] = useState<StoryBranchPoint | null>(
    null
  );
  const [choiceVisible, setChoiceVisible] = useState(false);

  const orderedChapterIds = useMemo(
    () => resolveStoryPath(pathChoices),
    [pathChoices]
  );

  const orderedChapters = useMemo(
    () =>
      orderedChapterIds
        .map((id) => chaptersById[id])
        .filter((ch): ch is NonNullable<typeof ch> => Boolean(ch)),
    [orderedChapterIds]
  );

  const refs = { sectionRef, pagesRef, bgRef, videoRefs };

  const handleBranchReveal = useCallback((chapterId: string) => {
    const bp = getBranchPointForChapter(chapterId);
    if (!bp) return;
    setPendingBranch(bp);
    setChoiceVisible(true);
  }, []);

  const {
    jumpTo,
    pauseForChoice,
    resumeAfterChoice,
    scheduleJumpAfterRebuild,
  } = useStoryScroll(refs, {
    orderedChapters,
    orderedChapterIds,
    pathChoices,
    setActive,
    setProgress,
    enabled,
    onBranchReveal: (chapterId) => {
      handleBranchReveal(chapterId);
      pauseForChoice();
    },
  });

  useStoryKeyboard(jumpTo, active, orderedChapters.length, choiceVisible);

  const handleChoice = useCallback(
    (choiceId: string) => {
      if (!pendingBranch) return;

      const choice = pendingBranch.choices.find((c) => c.id === choiceId);
      const next = { ...pathChoices, [pendingBranch.atChapterId]: choiceId };
      setPathChoices(next);
      saveStoryPath(next);

      setChoiceVisible(false);
      setPendingBranch(null);
      resumeAfterChoice();

      const newIds = resolveStoryPath(next);

      if (choice?.skipToChapterId) {
        const skipIndex = newIds.indexOf(choice.skipToChapterId);
        if (skipIndex >= 0) {
          scheduleJumpAfterRebuild(skipIndex);
        }
      } else if (choice && choice.nextChapterIds.length > 0) {
        const currentIdx = newIds.indexOf(pendingBranch.atChapterId);
        if (currentIdx >= 0 && currentIdx < newIds.length - 1) {
          scheduleJumpAfterRebuild(currentIdx + 1);
        }
      }
    },
    [
      pendingBranch,
      pathChoices,
      resumeAfterChoice,
      scheduleJumpAfterRebuild,
    ]
  );

  const handleRestart = useCallback(() => {
    clearStoryPath();
    setPathChoices({});
    setChoiceVisible(false);
    setPendingBranch(null);
    resumeAfterChoice();
    scheduleJumpAfterRebuild(0);
  }, [resumeAfterChoice, scheduleJumpAfterRebuild]);

  const activeChapter = orderedChapters[active];
  const showChoicePadding =
    choiceVisible && pendingBranch?.atChapterId === activeChapter?.id;

  return (
    <section
      id="story"
      ref={sectionRef}
      aria-label={collapsed ? "Story teaser" : undefined}
      className={
        collapsed
          ? "relative border-t border-white/5 px-5 py-10"
          : "story-section relative h-[100svh] overflow-hidden"
      }
    >
      {collapsed ? (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Prefer the narrative?
            </h2>
            <p className="mt-1 text-sm text-muted">
              7 chapters — from Minecraft kid to production engineer.
            </p>
          </div>
          <button
            type="button"
            onClick={onExpand}
            className="min-h-11 shrink-0 rounded-full bg-white/5 px-6 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 transition-all hover:bg-white/10 hover:ring-white/30"
          >
            Read the full story
          </button>
        </div>
      ) : (
        <>
          <div ref={bgRef} aria-hidden className="story-bg absolute inset-0" />
          <div aria-hidden className="story-grain absolute inset-0 z-[1]" />

          <div ref={pagesRef} className="relative h-full">
            {orderedChapters.map((ch, i) => (
              <StoryPage
                key={ch.id}
                chapter={ch}
                index={i}
                choicePadding={
                  showChoicePadding && ch.id === activeChapter?.id
                }
                setVideoRef={(el) => {
                  videoRefs.current[ch.id] = el;
                }}
              />
            ))}
          </div>

          <StoryChoiceOverlay
            branchPoint={pendingBranch}
            chapterAccent={activeChapter?.accent ?? "#a78bfa"}
            onChoose={handleChoice}
            visible={choiceVisible}
          />

          <StoryProgress
            active={active}
            progress={progress}
            orderedChapters={orderedChapters}
            onJump={jumpTo}
            onRestart={handleRestart}
            variant="desktop"
          />
          <StoryProgress
            active={active}
            progress={progress}
            orderedChapters={orderedChapters}
            onJump={jumpTo}
            onRestart={handleRestart}
            variant="mobile"
          />
        </>
      )}
    </section>
  );
}
