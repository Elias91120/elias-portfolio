"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chaptersById } from "@/lib/data";
import {
  clearStoryPath,
  loadStoryPathWithDefaults,
  resolveStoryPath,
} from "@/lib/story-branches";
import StoryPage from "./StoryPage";
import StoryProgress from "./StoryProgress";
import { useStoryKeyboard, useStoryScroll } from "./useStoryScroll";

export default function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pathChoices, setPathChoices] = useState<Record<string, string>>(
    () => loadStoryPathWithDefaults()
  );

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

  const { jumpTo, resumeAfterChoice, scheduleJumpAfterRebuild } = useStoryScroll(
    refs,
    {
      orderedChapters,
      orderedChapterIds,
      pathChoices,
      setActive,
      setProgress,
      enabled: true,
    }
  );

  useStoryKeyboard(jumpTo, active, orderedChapters.length, false);

  useEffect(() => {
    const chapter = orderedChapters[active];
    if (chapter) {
      document.body.dataset.storyChapterId = chapter.id;
      document.body.dataset.storyAccent = chapter.accent;
    }

    return () => {
      delete document.body.dataset.storyChapterId;
      delete document.body.dataset.storyAccent;
    };
  }, [active, orderedChapters]);

  const handleRestart = useCallback(() => {
    clearStoryPath();
    setPathChoices(loadStoryPathWithDefaults());
    resumeAfterChoice();
    scheduleJumpAfterRebuild(0);
  }, [resumeAfterChoice, scheduleJumpAfterRebuild]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="story-section relative h-[100svh] overflow-hidden"
    >
      <div ref={bgRef} aria-hidden className="story-bg absolute inset-0" />
      <div aria-hidden className="story-grain absolute inset-0 z-[1]" />

      <div ref={pagesRef} className="relative h-full">
        {orderedChapters.map((ch, i) => (
          <StoryPage
            key={ch.id}
            chapter={ch}
            index={i}
            choicePadding={false}
            setVideoRef={(el) => {
              videoRefs.current[ch.id] = el;
            }}
          />
        ))}
      </div>

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
    </section>
  );
}
