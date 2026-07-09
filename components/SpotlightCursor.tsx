"use client";

import { useEffect, useMemo, useState } from "react";
import { SPOTLIGHT_WATERMARKS } from "@/lib/spotlight-watermarks";

const DEFAULT_ACCENT = "#a78bfa";

const ZONE_SELECTORS: Record<string, string> = {
  hero: "#top",
  proof: "#proof",
  projects: "#projects",
  contact: "#contact",
};

function canUseSpotlight() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.body.classList.contains("spotlight-off")
  );
}

function isSpotlightActive() {
  return (
    !document.body.hasAttribute("data-intro") &&
    !document.body.hasAttribute("data-ask-open")
  );
}

function readStoryAccent(): string {
  const raw = document.body.dataset.storyAccent;
  if (!raw) return DEFAULT_ACCENT;
  return raw.startsWith("#") ? raw : `#${raw}`;
}

export default function SpotlightCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [inStory, setInStory] = useState(false);
  const [storyChapterId, setStoryChapterId] = useState<string | null>(null);
  const [visibleZones, setVisibleZones] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!canUseSpotlight()) return;
    setEnabled(true);

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--spotlight-x",
          `${e.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--spotlight-y",
          `${e.clientY}px`
        );
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const syncBodyState = () => {
      setActive(isSpotlightActive());
      const story = document.body.hasAttribute("data-story");
      setInStory(story);
      setAccent(story ? readStoryAccent() : DEFAULT_ACCENT);
      setStoryChapterId(document.body.dataset.storyChapterId ?? null);
    };
    syncBodyState();

    const bodyObserver = new MutationObserver(syncBodyState);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: [
        "data-intro",
        "data-ask-open",
        "data-story",
        "data-story-chapter-id",
        "data-story-accent",
        "class",
      ],
    });

    const zones = new Set<string>();
    const sectionObservers: IntersectionObserver[] = [];

    for (const [zone, selector] of Object.entries(ZONE_SELECTORS)) {
      const el = document.querySelector(selector);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) zones.add(zone);
          else zones.delete(zone);
          setVisibleZones(new Set(zones));
        },
        { threshold: 0.12 }
      );
      observer.observe(el);
      sectionObservers.push(observer);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      bodyObserver.disconnect();
      sectionObservers.forEach((o) => o.disconnect());
    };
  }, []);

  const watermarks = useMemo(
    () =>
      SPOTLIGHT_WATERMARKS.filter((wm) => {
        if (wm.chapterId) {
          return inStory && storyChapterId === wm.chapterId;
        }
        if (wm.zone) return visibleZones.has(wm.zone);
        return true;
      }),
    [inStory, storyChapterId, visibleZones]
  );

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="spotlight-layer"
      data-active={active ? "true" : "false"}
      style={{ "--spotlight-accent": accent } as React.CSSProperties}
    >
      <div className="spotlight-grain" />
      <div className="spotlight-tint" />
      {watermarks.map((wm) => (
        <span
          key={wm.text}
          className="spotlight-watermark font-display"
          style={{
            top: wm.top,
            left: wm.left,
            transform: `rotate(${wm.rotate}deg)`,
          }}
        >
          {wm.text}
        </span>
      ))}
    </div>
  );
}
