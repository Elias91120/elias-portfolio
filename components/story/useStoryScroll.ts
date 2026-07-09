"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters, getChapterAnimation } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export type StoryScrollRefs = {
  sectionRef: RefObject<HTMLElement | null>;
  pagesRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLDivElement | null>;
  videoRefs: RefObject<(HTMLVideoElement | null)[]>;
};

type UseStoryScrollOptions = {
  setActive: (index: number) => void;
  setProgress: (progress: number) => void;
};

export function useStoryScroll(
  refs: StoryScrollRefs,
  { setActive, setProgress }: UseStoryScrollOptions
) {
  const stRef = useRef<ScrollTrigger | null>(null);

  useLayoutEffect(() => {
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
        const v = refs.videoRefs.current[i];
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

      // Same quiet dissolve as the original book — no blur/wipe/push on ch.2+
      tl.to(
        prev,
        { autoAlpha: 0, duration: 0.3, ease: "power1.in" },
        at
      );
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
    const last = pages.length - 1;
    gsap.set(pages.slice(1), { autoAlpha: 0 });
    gsap.set(section, { transformOrigin: "center center" });

    const targets = new Array(chapters.length).fill(0);
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

        // Smooth lerp only — fastSeek caused visible jumps on Ken Burns clips
        v.currentTime = v.currentTime + delta * lerp;
      };

      const tick = () => {
        const lerp = gsap.utils.clamp(
          0.28,
          0.5,
          0.5 - scrollVelocity * 0.25
        );

        refs.videoRefs.current.forEach((v, i) => {
          if (!v || !v.duration || !v.dataset.armed) return;
          if (i !== activeScrub) return;

          seekVideo(v, targets[i], lerp);
        });
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
            : {
                snapTo: 1 / last,
                inertia: isTouch,
                duration: { min: 0.25, max: isTouch ? 0.55 : 0.8 },
                delay: isTouch ? 0 : 0.06,
                ease: "power2.inOut",
              },
          onUpdate: (self) => {
            scrollVelocity = Math.abs(self.progress - lastProgress);
            lastProgress = self.progress;

            const idx = Math.round(self.progress * last);
            activeScrub = idx;
            setActive(idx);
            setProgress(self.progress);
            preloadAround(idx);

            const t = self.progress * last;
            for (let i = 0; i < chapters.length; i++) {
              const { scrubIn, scrubSpan } = getChapterAnimation(
                chapters[i],
                i
              );
              targets[i] = gsap.utils.clamp(0, 1, (t - scrubIn) / scrubSpan);
            }
          },
          onToggle: (self) => {
            document.body.toggleAttribute("data-story", self.isActive);
            if (self.isActive) {
              openBook();
              startScrub();
              preloadAround(Math.round(self.progress * last));
              chapters.forEach((_, i) => {
                const v = refs.videoRefs.current[i];
                if (v) armVideo(v);
              });
            } else {
              stopScrub();
            }
          },
        },
      });

      pages.forEach((page, i) => {
        const img = page.querySelector<HTMLElement>(".page-img");
        const anim = getChapterAnimation(chapters[i], i);
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
            "--bg-a": chapters[i].bgA,
            "--bg-b": chapters[i].bgB,
            "--bg-accent": chapters[i].accent,
            duration: 0.4,
            ease: "none",
          },
          i - 0.5
        );
      });

    stRef.current = tl.scrollTrigger ?? null;

    return () => {
      stopScrub();
      preloadST.kill();
      tl.kill();
      normalizeScroll?.kill();
      document.body.removeAttribute("data-story");
      stRef.current = null;
    };
    // refs are stable — only mount once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (i / (chapters.length - 1)) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return { jumpTo, stRef };
}

export function useStoryKeyboard(
  jumpTo: (index: number) => void,
  active: number
) {
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!document.body.hasAttribute("data-story")) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        jumpTo(Math.min(active + 1, chapters.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        jumpTo(Math.max(active - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        jumpTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        jumpTo(chapters.length - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jumpTo, active]);
}
