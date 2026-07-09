"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Chapter } from "@/lib/data";
import { getChapterAnimation } from "@/lib/data";
import { getBranchPointForChapter } from "@/lib/story-branches";

gsap.registerPlugin(ScrollTrigger);

export type StoryScrollRefs = {
  sectionRef: RefObject<HTMLElement | null>;
  pagesRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLDivElement | null>;
  videoRefs: RefObject<Record<string, HTMLVideoElement | null>>;
};

type UseStoryScrollOptions = {
  orderedChapters: Chapter[];
  orderedChapterIds: string[];
  pathChoices: Record<string, string>;
  setActive: (index: number) => void;
  setProgress: (progress: number) => void;
  onBranchReveal?: (chapterId: string, localProgress: number) => void;
  enabled?: boolean;
};

export function useStoryScroll(
  refs: StoryScrollRefs,
  {
    orderedChapters,
    orderedChapterIds,
    pathChoices,
    setActive,
    setProgress,
    onBranchReveal,
    enabled = true,
  }: UseStoryScrollOptions
) {
  const stRef = useRef<ScrollTrigger | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(false);
  const branchTriggeredRef = useRef<string | null>(null);
  const pathChoicesRef = useRef(pathChoices);
  const onBranchRevealRef = useRef(onBranchReveal);
  const pendingJumpRef = useRef<number | null>(null);

  pathChoicesRef.current = pathChoices;
  onBranchRevealRef.current = onBranchReveal;

  const jumpToInternal = (i: number, chaptersCount: number) => {
    const st = stRef.current;
    if (!st || chaptersCount <= 1) return;
    const progress = i / (chaptersCount - 1);
    const y = st.start + progress * (st.end - st.start);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    if (!enabled) return;

    const section = refs.sectionRef.current;
    const wrap = refs.pagesRef.current;
    const bg = refs.bgRef.current;
    if (!section || !wrap || !bg) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = ScrollTrigger.isTouch === 1;
    const normalizeScroll = isTouch
      ? ScrollTrigger.normalizeScroll({ allowNestedScroll: true })
      : null;

    const armVideo = (v: HTMLVideoElement) => {
      if (v.dataset.armed) return;
      v.dataset.armed = "1";
      v.preload = "auto";

      const prime = () => {
        if (v.readyState >= 1 && v.duration) {
          try {
            v.currentTime = 0.001;
          } catch {
            /* ignore seek errors while metadata loads */
          }
        }
      };

      const show = () => {
        prime();
        gsap.to(v, { opacity: 1, duration: 0.35 });
        const poster = v.previousElementSibling;
        if (poster instanceof HTMLElement) {
          gsap.to(poster, { opacity: 0, duration: 0.35 });
        }
      };

      v.addEventListener("loadedmetadata", prime, { once: true });
      if (v.readyState >= 2) show();
      else v.addEventListener("canplay", show, { once: true });
      v.load();
    };

    const preloadAround = (center: number) => {
      if (reduceMotion) return;
      for (let i = center - 2; i <= center + 2; i++) {
        const ch = orderedChapters[i];
        if (!ch) continue;
        const v = refs.videoRefs.current[ch.id];
        if (v) armVideo(v);
      }
    };

    const addPageTransition = (
      tl: gsap.core.Timeline,
      pages: HTMLElement[],
      page: HTMLElement,
      i: number
    ) => {
      const prev = pages[i - 1];
      const textEls = page.querySelectorAll<HTMLElement>(".page-text > *");
      const at = i - 0.5;

      if (reduceMotion) {
        tl.set(prev, { autoAlpha: 0 }, at);
        tl.set(page, { autoAlpha: 1 }, at);
        tl.set(textEls, { y: 0, autoAlpha: 1 }, at);
        return;
      }

      tl.to(prev, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, at);
      tl.fromTo(
        page,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: "power1.out" },
        i - 0.45
      );
      tl.fromTo(
        textEls,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.22,
          stagger: 0.04,
          ease: "power2.out",
        },
        i - 0.32
      );
    };

    const pages = gsap.utils.toArray<HTMLElement>(".story-page", wrap);
    const last = Math.max(pages.length - 1, 0);
    gsap.set(pages.slice(1), { autoAlpha: 0 });
    gsap.set(section, { transformOrigin: "center center" });

    const targets: Record<string, number> = {};
    let activeScrub = 0;
    let rafId = 0;
    let scrubbing = false;
    let lastProgress = 0;
    let scrollVelocity = 0;

    const seekVideo = (v: HTMLVideoElement, target: number, lerp: number) => {
      const maxTime = Math.max(v.duration - 0.04, 0);
      const goal = target * maxTime;
      const delta = goal - v.currentTime;

      if (Math.abs(delta) <= 0.004) return;
      v.currentTime = v.currentTime + delta * lerp;
    };

    const tick = () => {
      const lerp = gsap.utils.clamp(0.28, 0.5, 0.5 - scrollVelocity * 0.25);
      const activeChapter = orderedChapters[activeScrub];
      if (activeChapter) {
        const v = refs.videoRefs.current[activeChapter.id];
        const target = targets[activeChapter.id] ?? 0;
        if (v?.duration && v.dataset.armed) {
          seekVideo(v, target, lerp);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const startScrub = () => {
      if (!scrubbing && !reduceMotion) {
        scrubbing = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const stopScrub = () => {
      scrubbing = false;
      cancelAnimationFrame(rafId);
    };

    let opened = false;
    const openBook = () => {
      if (opened || reduceMotion) return;
      opened = true;
      gsap.fromTo(
        section,
        { scale: 0.98, filter: "brightness(0.92)" },
        {
          scale: 1,
          filter: "brightness(1)",
          duration: 0.6,
          ease: "power2.out",
        }
      );
    };

    const preloadST = ScrollTrigger.create({
      trigger: section,
      start: "top 130%",
      once: true,
      onEnter: () => preloadAround(0),
    });

    const checkBranchReveal = (idx: number, t: number) => {
      const chapter = orderedChapters[idx];
      if (!chapter) return;

      const bp = getBranchPointForChapter(chapter.id);
      if (!bp || pathChoicesRef.current[chapter.id]) return;

      const threshold = reduceMotion ? 0 : (bp.revealAtProgress ?? 0.8);
      const localProgress = gsap.utils.clamp(0, 1, t - idx);

      if (localProgress >= threshold) {
        if (branchTriggeredRef.current !== chapter.id) {
          branchTriggeredRef.current = chapter.id;
          onBranchRevealRef.current?.(chapter.id, localProgress);
        }
      } else if (branchTriggeredRef.current === chapter.id) {
        branchTriggeredRef.current = null;
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${last * window.innerHeight}`,
        scrub: reduceMotion ? false : isTouch ? 0.6 : 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: reduceMotion
          ? undefined
          : last > 0
            ? {
                snapTo: 1 / last,
                inertia: isTouch,
                duration: { min: 0.25, max: isTouch ? 0.55 : 0.8 },
                delay: isTouch ? 0 : 0.06,
                ease: "power2.inOut",
              }
            : undefined,
        onUpdate: (self) => {
          if (pausedRef.current) return;

          scrollVelocity = Math.abs(self.progress - lastProgress);
          lastProgress = self.progress;

          const idx = last > 0 ? Math.round(self.progress * last) : 0;
          activeScrub = idx;
          setActive(idx);
          setProgress(self.progress);
          preloadAround(idx);

          const t = self.progress * last;
          orderedChapters.forEach((ch, i) => {
            const { scrubIn, scrubSpan } = getChapterAnimation(ch, i);
            targets[ch.id] = gsap.utils.clamp(0, 1, (t - scrubIn) / scrubSpan);
          });

          checkBranchReveal(idx, t);
        },
        onToggle: (self) => {
          document.body.toggleAttribute("data-story", self.isActive);
          if (self.isActive) {
            openBook();
            startScrub();
            preloadAround(Math.round(self.progress * last));
            orderedChapters.forEach((ch) => {
              const v = refs.videoRefs.current[ch.id];
              if (v) armVideo(v);
            });
          } else {
            stopScrub();
            document.body.removeAttribute("data-story-choice");
          }
        },
      },
    });

    pages.forEach((page, i) => {
      const ch = orderedChapters[i];
      if (!ch) return;

      const img = page.querySelector<HTMLElement>(".page-img");
      const anim = getChapterAnimation(ch, i);
      const from = i === 0 ? 0 : i - 0.45;
      const to = i === last ? last : i + 0.55;

      if (img && anim.driftFrom !== anim.driftTo) {
        tl.fromTo(
          img,
          { scale: anim.driftFrom },
          { scale: anim.driftTo, duration: to - from, ease: "none" },
          from
        );
      }

      if (i === 0) return;

      addPageTransition(tl, pages, page, i);

      tl.to(
        bg,
        {
          "--bg-a": ch.bgA,
          "--bg-b": ch.bgB,
          "--bg-accent": ch.accent,
          duration: 0.4,
          ease: "none",
        },
        i - 0.5
      );
    });

    stRef.current = tl.scrollTrigger ?? null;
    tlRef.current = tl;

    ScrollTrigger.refresh();

    if (pendingJumpRef.current !== null) {
      const jumpIdx = pendingJumpRef.current;
      pendingJumpRef.current = null;
      requestAnimationFrame(() =>
        jumpToInternal(jumpIdx, orderedChapters.length)
      );
    }

    return () => {
      stopScrub();
      preloadST.kill();
      tl.kill();
      normalizeScroll?.kill();
      document.body.removeAttribute("data-story");
      document.body.removeAttribute("data-story-choice");
      stRef.current = null;
      tlRef.current = null;
      branchTriggeredRef.current = null;
      ScrollTrigger.refresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, orderedChapterIds.join(",")]);

  const pauseForChoice = () => {
    const st = stRef.current;
    if (!st) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    pausedRef.current = true;
    st.disable();
    document.body.setAttribute("data-story-choice", "");
    refs.sectionRef.current?.classList.add("story-paused");
  };

  const resumeAfterChoice = () => {
    const st = stRef.current;
    pausedRef.current = false;
    document.body.removeAttribute("data-story-choice");
    refs.sectionRef.current?.classList.remove("story-paused");
    branchTriggeredRef.current = null;
    if (st) {
      st.enable();
      ScrollTrigger.refresh();
    }
  };

  const jumpTo = (i: number) => {
    jumpToInternal(i, orderedChapters.length);
  };

  const scheduleJumpAfterRebuild = (i: number) => {
    pendingJumpRef.current = i;
  };

  return {
    jumpTo,
    stRef,
    pauseForChoice,
    resumeAfterChoice,
    scheduleJumpAfterRebuild,
  };
}

export function useStoryKeyboard(
  jumpTo: (index: number) => void,
  active: number,
  chapterCount: number,
  disabled = false
) {
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return;
      if (!document.body.hasAttribute("data-story")) return;
      if (document.body.hasAttribute("data-story-choice")) return;

      const last = Math.max(chapterCount - 1, 0);

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        jumpTo(Math.min(active + 1, last));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        jumpTo(Math.max(active - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        jumpTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        jumpTo(last);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jumpTo, active, chapterCount, disabled]);
}
