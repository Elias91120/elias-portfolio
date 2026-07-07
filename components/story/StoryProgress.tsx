"use client";

import { chapters } from "@/lib/data";
import { CHAPTER_ROMANS } from "./constants";

type StoryProgressProps = {
  active: number;
  progress: number;
  onJump: (index: number) => void;
  variant?: "desktop" | "mobile";
};

export default function StoryProgress({
  active,
  progress,
  onJump,
  variant = "desktop",
}: StoryProgressProps) {
  const isDesktop = variant === "desktop";

  return (
    <>
      <div
        className={
          isDesktop
            ? "hidden lg:flex absolute bottom-9 left-1/2 -translate-x-1/2 z-20 items-center gap-2.5"
            : "flex lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20 items-center gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md"
        }
        role="tablist"
        aria-label="Story chapters"
      >
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => onJump(i)}
            aria-label={`Go to chapter ${CHAPTER_ROMANS[i]}: ${ch.title}`}
            className="group flex h-6 items-center px-0.5 cursor-pointer"
          >
            <span
              className="block h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === active ? "1.75rem" : "0.375rem",
                backgroundColor:
                  i === active
                    ? chapters[active].accent
                    : "rgba(255,255,255,0.28)",
              }}
            />
          </button>
        ))}
      </div>

      {isDesktop && (
        <>
          <div
            className="hidden lg:block absolute bottom-[3.35rem] left-10 right-10 z-20 h-px bg-white/10"
            aria-hidden
          >
            <div
              className="story-progress-bar h-full origin-left bg-white/35 transition-none"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <div className="hidden lg:block absolute bottom-8 right-10 z-20 font-serif italic text-sm text-white/45 select-none">
            {active + 1} — {chapters.length}
          </div>
        </>
      )}
    </>
  );
}
