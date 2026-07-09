"use client";

import { useRef, useState } from "react";
import { chapters } from "@/lib/data";
import StoryPage from "./StoryPage";
import StoryProgress from "./StoryProgress";
import { useStoryKeyboard, useStoryScroll } from "./useStoryScroll";

export default function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const refs = { sectionRef, pagesRef, bgRef, videoRefs };

  const { jumpTo } = useStoryScroll(refs, { setActive, setProgress });
  useStoryKeyboard(jumpTo, active);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="story-section relative h-[100svh] overflow-hidden"
    >
      <div ref={bgRef} aria-hidden className="story-bg absolute inset-0" />
      <div aria-hidden className="story-grain absolute inset-0 z-[1]" />

      <div ref={pagesRef} className="relative h-full">
        {chapters.map((ch, i) => (
          <StoryPage
            key={ch.id}
            chapter={ch}
            index={i}
            setVideoRef={(el) => {
              videoRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <StoryProgress
        active={active}
        progress={progress}
        onJump={jumpTo}
        variant="desktop"
      />
      <StoryProgress
        active={active}
        progress={progress}
        onJump={jumpTo}
        variant="mobile"
      />
    </section>
  );
}
