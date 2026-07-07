"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function Story() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrap = pagesRef.current;
    const bg = bgRef.current;
    if (!section || !wrap || !bg) return;

    const mm = gsap.matchMedia();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reveal a video only once it can render frames (its first frame
    // matches the illustration, so the hand-off is invisible).
    const armVideo = (v: HTMLVideoElement) => {
      if (v.dataset.armed) return;
      v.dataset.armed = "1";
      const show = () => gsap.to(v, { opacity: 1, duration: 0.45 });
      if (v.readyState >= 2) show();
      else v.addEventListener("loadeddata", show, { once: true });
      v.preload = "auto";
      v.load();
    };

    // ----- Desktop: the section pins and each chapter is a full page that
    // ----- turns (crossfade) — the scroll itself stays invisible.
    mm.add("(min-width: 1024px)", () => {
      const pages = gsap.utils.toArray<HTMLElement>(".story-page", wrap);
      const last = pages.length - 1;
      gsap.set(pages.slice(1), { autoAlpha: 0 });

      // --- Scroll-scrubbing: scroll position drives each clip's playhead.
      const targets = new Array(chapters.length).fill(0);
      let rafId = 0;
      let scrubbing = false;
      const tick = () => {
        videoRefs.current.forEach((v, i) => {
          if (!v || !v.duration || !v.dataset.armed) return;
          const target = targets[i] * Math.max(v.duration - 0.08, 0);
          const delta = target - v.currentTime;
          if (Math.abs(delta) > 0.01) {
            v.currentTime = v.currentTime + delta * 0.28;
          }
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

      // Preload the clips as the reader approaches the book
      const preloadST = ScrollTrigger.create({
        trigger: section,
        start: "top 130%",
        once: true,
        onEnter: () => {
          if (reduceMotion) return;
          videoRefs.current.forEach((v) => v && armVideo(v));
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${last * window.innerHeight}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Always come to rest on a full page, like a book
          snap: {
            snapTo: 1 / last,
            inertia: false,
            duration: { min: 0.3, max: 0.8 },
            delay: 0.06,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * last);
            setActive((prev) => (prev === idx ? prev : idx));
            // Map the reading position of each page to its clip playhead
            const t = self.progress * last;
            for (let i = 0; i < chapters.length; i++) {
              const from = i === 0 ? 0 : i - 0.45;
              const span = i === 0 ? 0.55 : 1;
              targets[i] = gsap.utils.clamp(0, 1, (t - from) / span);
            }
          },
          // Hide the site chrome while reading the book
          onToggle: (self) => {
            document.body.toggleAttribute("data-story", self.isActive);
            if (self.isActive) startScrub();
            else stopScrub();
          },
        },
      });

      pages.forEach((page, i) => {
        const img = page.querySelector<HTMLElement>(".page-img");
        const textEls = page.querySelectorAll<HTMLElement>(".page-text > *");

        // Slow cinematic drift while the page is being read
        if (img) {
          const from = i === 0 ? 0 : i - 0.45;
          const to = i === last ? last : i + 0.55;
          tl.fromTo(
            img,
            { scale: 1.09 },
            { scale: 1, duration: to - from, ease: "none" },
            from
          );
        }

        if (i === 0) return;

        // Page turn: previous page dissolves, next one appears
        tl.to(
          pages[i - 1],
          { autoAlpha: 0, duration: 0.3, ease: "power1.in" },
          i - 0.5
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

        // The ambient tone of the book evolves with the years
        tl.to(
          bg,
          {
            "--bg-a": chapters[i].bgA,
            "--bg-b": chapters[i].bgB,
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
        document.body.removeAttribute("data-story");
        stRef.current = null;
      };
    });

    // ----- Mobile / tablet: pages flow vertically, tone still evolves.
    // ----- Clips play as gentle loops when their page is in view.
    mm.add("(max-width: 1023px)", () => {
      const pages = gsap.utils.toArray<HTMLElement>(".story-page", wrap);

      pages.forEach((page, i) => {
        ScrollTrigger.create({
          trigger: page,
          start: "top 75%",
          end: "bottom 25%",
          onToggle: (self) => {
            const v = videoRefs.current[i];
            if (self.isActive) {
              gsap.to(bg, {
                "--bg-a": chapters[i].bgA,
                "--bg-b": chapters[i].bgB,
                duration: 0.6,
                overwrite: "auto",
              });
              setActive(i);
              if (v && !reduceMotion) {
                armVideo(v);
                v.loop = true;
                v.play().catch(() => {});
              }
            } else if (v) {
              v.pause();
            }
          },
        });

        gsap.fromTo(
          page.querySelectorAll<HTMLElement>(".page-text > *"),
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: page,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  const jumpTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (i / (chapters.length - 1)) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative lg:h-screen lg:overflow-hidden"
    >
      {/* Evolving ambient background */}
      <div ref={bgRef} aria-hidden className="story-bg absolute inset-0" />

      <div ref={pagesRef} className="relative lg:h-full">
        {chapters.map((ch, i) => (
          <article
            key={ch.id}
            className="story-page relative lg:absolute lg:inset-0"
          >
            {/* Full-bleed illustration — the clip fades in over it and is
                driven by the scroll, so the page truly comes alive */}
            <div className="relative h-[54svh] lg:h-full lg:absolute lg:inset-0 overflow-hidden">
              <div className="page-img absolute inset-0 will-change-transform">
                <Image
                  src={ch.image}
                  alt={ch.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="eager"
                  quality={90}
                />
                {ch.video && (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    className="absolute inset-0 h-full w-full object-cover opacity-0"
                    src={ch.video}
                    muted
                    playsInline
                    preload="none"
                    disablePictureInPicture
                    aria-hidden
                    tabIndex={-1}
                  />
                )}
              </div>
              {/* Scrim so the words sit quietly on the picture */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[70%]"
                style={{
                  background: `linear-gradient(to top, ${ch.bgB} 4%, ${ch.bgB}cc 34%, transparent 100%)`,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-black/10"
              />
            </div>

            {/* The written page */}
            <div className="page-text relative z-10 -mt-16 lg:mt-0 px-6 pb-20 lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-24 lg:pb-28 lg:max-w-4xl">
              <div
                className="font-display text-[0.7rem] lg:text-xs font-semibold uppercase tracking-[0.35em]"
                style={{ color: ch.accent }}
              >
                Chapter {romans[i]} · {ch.years}
              </div>
              <h2 className="font-serif mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f5f0e4]">
                {ch.title}
              </h2>
              <p className="font-serif mt-4 lg:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed lg:leading-[1.75] text-[#e9e3d3]/90">
                {ch.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Quiet book indicators — desktop only */}
      <div className="hidden lg:flex absolute bottom-9 left-1/2 -translate-x-1/2 z-20 items-center gap-2.5">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => jumpTo(i)}
            aria-label={`Go to chapter ${romans[i]}: ${ch.title}`}
            className="group flex h-6 items-center px-0.5 cursor-pointer"
          >
            <span
              className="block h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === active ? "1.75rem" : "0.375rem",
                backgroundColor:
                  i === active ? chapters[active].accent : "rgba(255,255,255,0.28)",
              }}
            />
          </button>
        ))}
      </div>
      <div className="hidden lg:block absolute bottom-8 right-10 z-20 font-serif italic text-sm text-white/45 select-none">
        {active + 1} — {chapters.length}
      </div>
    </section>
  );
}
