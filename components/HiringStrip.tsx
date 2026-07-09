"use client";

import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

export default function HiringStrip() {
  const { mode, setMode } = useVisitorMode();

  if (mode !== "hiring") return null;

  const switchToBrowsing = () => {
    setMode("browsing");
    requestAnimationFrame(() =>
      scrollToSection("#story", prefersReducedMotion() ? "auto" : "smooth")
    );
  };

  return (
    <div
      aria-live="polite"
      className="sticky top-14 z-40 border-b border-white/5 bg-[#08060f]/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-3 px-5">
        <p className="truncate text-xs text-muted sm:text-sm">
          Recruiter view — proof first. Full story still below.
        </p>
        <button
          type="button"
          onClick={switchToBrowsing}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted ring-1 ring-white/10 transition-colors hover:bg-white/5 hover:text-white"
        >
          Switch to story mode
        </button>
      </div>
    </div>
  );
}
