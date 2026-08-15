"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import HeroAgentBlock from "@/components/HeroAgentBlock";
import { useDeveloperMode } from "@/components/DeveloperModeProvider";

const ease = [0.16, 1, 0.3, 1] as const;
const AVATAR_CLICKS_REQUIRED = 5;
const AVATAR_CLICK_WINDOW_MS = 2000;

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

export default function Hero() {
  const { openTerminal } = useDeveloperMode();
  const reducedMotion = useReducedMotion();

  const [avatarClicks, setAvatarClicks] = useState(0);
  const [showAvatarTooltip, setShowAvatarTooltip] = useState(false);
  const clickCountRef = useRef(0);
  const lastAvatarClickRef = useRef(0);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAvatarClick = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastAvatarClickRef.current;
    const nextCount =
      elapsed > AVATAR_CLICK_WINDOW_MS || lastAvatarClickRef.current === 0
        ? 1
        : clickCountRef.current + 1;

    lastAvatarClickRef.current = now;
    clickCountRef.current = nextCount;
    setAvatarClicks(nextCount);

    if (nextCount >= AVATAR_CLICKS_REQUIRED) {
      clickCountRef.current = 0;
      lastAvatarClickRef.current = 0;
      setAvatarClicks(0);
      setShowAvatarTooltip(false);
      openTerminal("avatar");
      return;
    }

    if (nextCount >= 3) {
      setShowAvatarTooltip(true);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => setShowAvatarTooltip(false), 1000);
    }
  }, [openTerminal]);

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-5 pb-10 pt-20 sm:justify-center sm:pb-16 sm:pt-24"
    >
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/art/hero-world.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08060f] via-[#08060f]/82 to-[#08060f]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060f] via-transparent to-[#08060f]/45" />
      </div>

      <motion.div
        initial={reducedMotion ? false : "hidden"}
        animate="show"
        variants={stagger}
        className="relative z-10 mx-auto grid w-full max-w-6xl items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center"
      >
        <div className="max-w-xl text-left">
          <motion.p
            variants={fadeUp}
            className="font-display text-xs uppercase tracking-[0.35em] text-amber-200/90 sm:text-sm"
          >
            Elias Elloumi
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]"
          >
            From a Minecraft kid
            <br />
            to a{" "}
            <span className="bg-gradient-to-r from-amber-200 via-violet-200 to-sky-200 bg-clip-text font-serif font-semibold italic text-transparent">
              Full-Stack Developer
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-base leading-relaxed text-[#d7d2ea] sm:text-lg"
          >
            I build data pipelines, AI agents, and production products at{" "}
            <span className="text-white">Nokia</span> and{" "}
            <span className="text-white">3geeks</span>.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-emerald-400/12 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/25 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                {!reducedMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Actively seeking apprenticeship, 2026-2028
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-2">
            <HeroAgentBlock />
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end"
        >
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_62%)]" />
          {!reducedMotion && (
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full opacity-50"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 10%, #f59e0b 32%, #a78bfa 55%, #38bdf8 72%, transparent 90%)",
              }}
            />
          )}
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label="Elias avatar — 5 quick taps open dev terminal"
            className={`relative aspect-square w-full overflow-hidden rounded-full ring-2 shadow-[0_20px_80px_rgba(8,6,15,0.55)] ${
              avatarClicks >= 3 && !reducedMotion
                ? "ring-amber-300 animate-pulse"
                : "ring-amber-200/40"
            }`}
          >
            <Image
              src="/story/avatar-hero.jpg"
              alt="Cartoon portrait of Elias Elloumi waving"
              fill
              sizes="(min-width: 1024px) 22rem, 18rem"
              className="object-cover"
              priority
            />
            <AnimatePresence>
              {showAvatarTooltip && (
                <motion.span
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.15 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-3 py-1 text-xs font-medium text-accent ring-1 ring-accent/40"
                >
                  {avatarClicks}/5 - keep going
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
