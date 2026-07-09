"use client";

type StoryTeaserProps = {
  onExpand: () => void;
};

export default function StoryTeaser({ onExpand }: StoryTeaserProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
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
  );
}
