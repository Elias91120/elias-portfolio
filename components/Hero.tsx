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
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease },
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
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-x-hidden px-5 pt-20 pb-16 sm:pt-24 sm:pb-20"
    >
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="aurora absolute -top-48 left-1/2 h-[40rem] w-[64rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, #6d28d9 0%, rgba(109,40,217,0.35) 40%, transparent 70%)",
          }}
        />
        <div
          className="aurora-slow absolute bottom-[-8rem] right-[4%] h-96 w-96 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #f59e0b 0%, transparent 65%)",
          }}
        />
        <div
          className="aurora-slow absolute bottom-[10%] left-[-6rem] h-80 w-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #38bdf8 0%, transparent 65%)",
          }}
        />
      </div>

      <motion.div
        initial={reducedMotion ? false : "hidden"}
        animate="show"
        variants={stagger}
        className="relative z-10 flex max-w-4xl flex-col items-center text-center"
      >
        <motion.div variants={fadeUp} className="relative mt-2 sm:mt-4">
          {!reducedMotion && (
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 rounded-full opacity-45"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 12%, #a78bfa 38%, #38bdf8 62%, transparent 88%)",
              }}
            />
          )}
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label="Elias avatar — 5 quick taps open dev terminal"
            className={`relative h-36 w-36 overflow-hidden rounded-full ring-2 shadow-[0_0_64px_rgba(167,139,250,0.28)] transition-shadow sm:h-44 sm:w-44 md:h-52 md:w-52 ${
              avatarClicks >= 3 && !reducedMotion
                ? "ring-accent animate-pulse"
                : "ring-accent/40"
            }`}
          >
            <Image
              src="/story/avatar-hero.jpg"
              alt="Cartoon portrait of Elias Elloumi waving"
              fill
              sizes="(min-width: 768px) 13rem, (min-width: 640px) 11rem, 9rem"
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
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-3 py-1 text-xs font-medium text-accent ring-1 ring-accent/40"
                >
                  {avatarClicks}/5 - keep going
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-7 flex items-center gap-3 text-accent"
        >
          <span className="h-px w-8 bg-accent/40" />
          <span className="font-display text-xs uppercase tracking-[0.35em] sm:text-sm">
            Elias Elloumi
          </span>
          <span className="h-px w-8 bg-accent/40" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          From a Minecraft kid
          <br />
          to a{" "}
          <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text font-serif font-semibold italic text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-sm font-medium tracking-wide text-sky-300/90 sm:text-base"
        >
          Data Engineering &amp; AI Agents
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          I build data pipelines, AI agents, and production products at{" "}
          <span className="text-foreground">Nokia</span> and{" "}
          <span className="text-foreground">3geeks</span>.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-7">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/25">
            <span className="relative flex h-2 w-2">
              {!reducedMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Actively seeking apprenticeship, 2026-2028
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="w-full">
          <HeroAgentBlock />
        </motion.div>
      </motion.div>
    </section>
  );
}
