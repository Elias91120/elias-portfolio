"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StoryBranchPoint } from "@/lib/story-branches";
import { getDefaultChoiceForBranch } from "@/lib/story-branches";

const EASE = [0.22, 1, 0.36, 1] as const;

type StoryChoiceOverlayProps = {
  branchPoint: StoryBranchPoint | null;
  chapterAccent: string;
  onChoose: (choiceId: string) => void;
  visible: boolean;
};

export default function StoryChoiceOverlay({
  branchPoint,
  chapterAccent,
  onChoose,
  visible,
}: StoryChoiceOverlayProps) {
  const firstBtnRef = useRef<HTMLButtonElement>(null);
  const promptId = branchPoint
    ? `story-choice-prompt-${branchPoint.atChapterId}`
    : undefined;

  useEffect(() => {
    if (!visible || !branchPoint) return;
    const t = requestAnimationFrame(() => firstBtnRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [visible, branchPoint]);

  useEffect(() => {
    if (!visible || !branchPoint) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onChoose(getDefaultChoiceForBranch(branchPoint).id);
        return;
      }

      if (e.key !== "Tab" || !branchPoint.choices.length) return;

      const buttons = branchPoint.choices
        .map((_, i) =>
          document.getElementById(`story-choice-${branchPoint.atChapterId}-${i}`)
        )
        .filter((el): el is HTMLButtonElement => el instanceof HTMLButtonElement);

      if (buttons.length < 2) return;

      const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (idx === -1) return;

      e.preventDefault();
      const next = e.shiftKey
        ? buttons[(idx - 1 + buttons.length) % buttons.length]
        : buttons[(idx + 1) % buttons.length];
      next.focus();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, branchPoint, onChoose]);

  return (
    <AnimatePresence>
      {visible && branchPoint && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={promptId}
          className="story-choice-overlay pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-6 pb-28 sm:pb-32 lg:pb-36"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div
            aria-live="polite"
            className="sr-only"
          >
            {branchPoint.prompt}
          </div>

          {branchPoint.prompt && (
            <p
              id={promptId}
              className="story-kicker mb-4 text-center font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/70 sm:text-xs"
            >
              {branchPoint.prompt}
            </p>
          )}

          <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
            {branchPoint.choices.map((choice, i) => (
              <button
                key={choice.id}
                id={`story-choice-${branchPoint.atChapterId}-${i}`}
                ref={i === 0 ? firstBtnRef : undefined}
                type="button"
                onClick={() => onChoose(choice.id)}
                aria-label={choice.label}
                className="story-choice-btn min-h-11 flex-1 cursor-pointer rounded-full border border-white/15 bg-black/40 px-5 py-3 font-display text-sm font-medium text-[#ece9f6] backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                style={
                  {
                    "--choice-accent": chapterAccent,
                  } as CSSProperties
                }
              >
                {choice.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
