"use client";

import Image from "next/image";
import { chapters, chaptersById } from "@/lib/data";
import { resolveStoryPath } from "@/lib/story-branches";

type StoryTeaserProps = {
  onExpand: () => void;
};

const previewIds = resolveStoryPath({}).slice(0, 3);

export default function StoryTeaser({ onExpand }: StoryTeaserProps) {
  const previews = previewIds
    .map((id) => chaptersById[id])
    .filter(Boolean);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
      <div className="flex -space-x-3">
        {previews.map((ch, i) => (
          <div
            key={ch.id}
            className="relative h-14 w-14 overflow-hidden rounded-xl ring-2 ring-[#08060f]"
            style={{ zIndex: previews.length - i }}
          >
            <Image
              src={ch.image}
              alt=""
              fill
              sizes="3.5rem"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-white">
          Prefer the narrative?
        </h2>
        <p className="mt-1 text-sm text-muted">
          {chapters.length} chapitres · ~3 min — from Minecraft kid to production engineer.
        </p>
      </div>

      <button
        type="button"
        onClick={onExpand}
        className="touch-press min-h-11 shrink-0 rounded-full bg-gradient-to-r from-violet-500/20 to-sky-500/20 px-6 py-2.5 text-sm font-medium text-white ring-1 ring-accent/40 transition-all hover:ring-accent/60"
      >
        Lancer l&apos;histoire
      </button>
    </div>
  );
}
