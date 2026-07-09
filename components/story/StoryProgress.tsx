"use client";

import { useCallback, useRef } from "react";
import type { Chapter } from "@/lib/data";
import { CHAPTER_ROMANS } from "./constants";

type StoryProgressProps = {
  active: number;
  progress: number;
  orderedChapters: Chapter[];
  onJump: (index: number) => void;
  onRestart: () => void;
  variant?: "desktop" | "mobile";
};

export default function StoryProgress({
  active,
  progress,
  orderedChapters,
  onJump,
  onRestart,
  variant = "desktop",
}: StoryProgressProps) {
  const isDesktop = variant === "desktop";
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const startLongPress = useCallback(() => {
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      onRestart();
      longPressTimer.current = null;
    }, 600);
  }, [clearLongPress, onRestart]);

  const activeAccent = orderedChapters[active]?.accent ?? "#a78bfa";

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
        onPointerDown={!isDesktop ? startLongPress : undefined}
        onPointerUp={!isDesktop ? clearLongPress : undefined}
        onPointerLeave={!isDesktop ? clearLongPress : undefined}
        onPointerCancel={!isDesktop ? clearLongPress : undefined}
      >
        {orderedChapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => onJump(i)}
            aria-label={`Go to chapter ${CHAPTER_ROMANS[i] ?? i + 1}: ${ch.title}`}
            className="group flex h-6 min-h-11 min-w-6 items-center justify-center px-0.5 cursor-pointer lg:min-h-6"
          >
            <span
              className="block h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === active ? "1.75rem" : "0.375rem",
                backgroundColor:
                  i === active ? activeAccent : "rgba(255,255,255,0.28)",
              }}
            />
          </button>
        ))}
        {!isDesktop && (
          <button
            type="button"
            onClick={onRestart}
            className="ml-1 min-h-11 cursor-pointer px-2 font-display text-[0.65rem] font-medium uppercase tracking-wider text-white/45 hover:text-white/70"
            aria-label="Restart story from chapter I"
          >
            Restart
          </button>
        )}
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
          <div className="hidden lg:flex absolute bottom-8 right-10 z-20 items-center gap-4">
            <button
              type="button"
              onClick={onRestart}
              className="min-h-11 cursor-pointer font-display text-xs font-medium uppercase tracking-wider text-white/40 transition-colors hover:text-white/65"
              aria-label="Restart story from chapter I"
            >
              Restart story
            </button>
            <span className="font-serif italic text-sm text-white/45 select-none">
              {active + 1} — {orderedChapters.length}
            </span>
          </div>
        </>
      )}
    </>
  );
}
