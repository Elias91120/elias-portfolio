"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "intro-seen";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring" as const, stiffness: 190, damping: 24 };

const TIMING_DESKTOP = {
  fadeIn: 380,
  avatar: 700,
  name: 650,
  tagline: 840,
  pause: 440,
  exitHold: 250,
  exitFade: 560,
} as const;

const TIMING_MOBILE = {
  fadeIn: 300,
  avatar: 570,
  name: 540,
  tagline: 700,
  pause: 350,
  exitHold: 190,
  exitFade: 510,
} as const;

type Phase = "fade-in" | "avatar" | "name" | "tagline" | "pause" | "exit";

type Props = {
  onComplete: () => void;
};

export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return sessionStorage.getItem(SESSION_KEY) !== "1";
}

export function markIntroSeen(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

const BURST_RAYS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  rotation: i * 30,
}));

export default function CinematicIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("fade-in");
  const [fadingOut, setFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timersRef = useRef<number[]>([]);

  const timing = isMobile ? TIMING_MOBILE : TIMING_DESKTOP;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const runExit = useCallback(
    (fast = false) => {
      setPhase("exit");
      const hold = fast ? 0 : timing.exitHold;
      const fade = fast ? 280 : timing.exitFade;

      const fadeId = window.setTimeout(() => {
        setFadingOut(true);
        const completeId = window.setTimeout(() => {
          markIntroSeen();
          onComplete();
        }, fade);
        timersRef.current.push(completeId);
      }, hold);
      timersRef.current.push(fadeId);
    },
    [onComplete, timing.exitFade, timing.exitHold],
  );

  const schedulePhases = useCallback(() => {
    clearTimers();
    const sequence: Array<{ phase: Phase; duration: number }> = [
      { phase: "avatar", duration: timing.fadeIn },
      { phase: "name", duration: timing.avatar },
      { phase: "tagline", duration: timing.name },
      { phase: "pause", duration: timing.tagline },
    ];

    let elapsed = 0;
    sequence.forEach(({ phase: next, duration }) => {
      elapsed += duration;
      const id = window.setTimeout(() => setPhase(next), elapsed);
      timersRef.current.push(id);
    });

    const exitId = window.setTimeout(
      () => runExit(false),
      elapsed + timing.pause,
    );
    timersRef.current.push(exitId);
  }, [clearTimers, runExit, timing]);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 639px)").matches);
    schedulePhases();
    return clearTimers;
  }, [schedulePhases, clearTimers]);

  const skip = () => {
    clearTimers();
    runExit(true);
  };

  const avatarVisible = phase !== "fade-in";
  const nameVisible = ["name", "tagline", "pause", "exit"].includes(phase);
  const taglineVisible = ["tagline", "pause", "exit"].includes(phase);
  const burstActive = phase === "avatar" || phase === "pause";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: fadingOut ? 0 : 1,
        scale: fadingOut ? 1.08 : 1,
        filter: fadingOut ? "blur(12px)" : "blur(0px)",
      }}
      transition={{
        duration: fadingOut ? (isMobile ? 0.45 : 0.55) : 0.7,
        ease,
      }}
      className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#08060f] px-5"
      role="dialog"
      aria-label="Cinematic introduction"
      aria-modal="true"
      style={{ pointerEvents: fadingOut ? "none" : "auto" }}
    >
      {/* Opening flash */}
      <AnimatePresence>
        {phase === "fade-in" && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease }}
            className="pointer-events-none absolute inset-0 z-30 bg-violet-400/20"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: avatarVisible ? 0.45 : 0.08,
            scale: avatarVisible ? 1 : 0.6,
          }}
          transition={{ duration: 1, ease }}
          className="aurora absolute -top-48 left-1/2 h-[40rem] w-[64rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, #8b5cf6 0%, rgba(139,92,246,0.4) 35%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: avatarVisible ? 0.22 : 0.05 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="aurora-slow absolute bottom-[-8rem] right-[4%] h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #f59e0b 0%, transparent 65%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: avatarVisible ? 0.18 : 0.04 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="aurora-slow absolute bottom-[10%] left-[-6rem] h-80 w-80 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #38bdf8 0%, transparent 65%)",
          }}
        />

        {/* Radial burst on avatar reveal */}
        <AnimatePresence>
          {burstActive && (
            <motion.div
              key="burst"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1.6, 2.2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: phase === "avatar" ? 1.2 : 0.95, ease }}
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 65%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Light rays */}
        <AnimatePresence>
          {phase === "avatar" && (
            <motion.div
              key="rays"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-[55%] sm:h-96 sm:w-96"
              aria-hidden
            >
              {BURST_RAYS.map(({ id, rotation }) => (
                <motion.div
                  key={id}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 0.35, 0] }}
                  transition={{ duration: 1, delay: id * 0.04, ease }}
                  className="absolute left-1/2 top-1/2 h-32 w-px origin-bottom -translate-x-1/2"
                  style={{
                    rotate: `${rotation}deg`,
                    background:
                      "linear-gradient(to top, rgba(167,139,250,0.6), transparent)",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.35, y: 30 }}
          animate={{
            opacity: avatarVisible ? 1 : 0,
            scale: avatarVisible ? 1 : 0.35,
            y: avatarVisible ? 0 : 30,
          }}
          transition={spring}
          className={avatarVisible && phase !== "avatar" ? "animate-float" : ""}
        >
          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-full opacity-60"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, #a78bfa, #38bdf8, #f59e0b, transparent)",
            }}
            aria-hidden
          />

          <motion.div
            animate={{
              boxShadow:
                phase === "pause"
                  ? [
                      "0 0 60px rgba(167,139,250,0.5), 0 0 120px rgba(56,189,248,0.25)",
                      "0 0 100px rgba(167,139,250,0.8), 0 0 180px rgba(56,189,248,0.4)",
                      "0 0 60px rgba(167,139,250,0.5), 0 0 120px rgba(56,189,248,0.25)",
                    ]
                  : "0 0 70px rgba(167,139,250,0.45), 0 0 140px rgba(56,189,248,0.2)",
            }}
            transition={{
              duration: phase === "pause" ? 0.9 : 0.4,
              repeat: phase === "pause" ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-accent/60 sm:h-44 sm:w-44"
          >
            <Image
              src="/story/avatar-hero.jpg"
              alt=""
              fill
              sizes="(min-width: 640px) 11rem, 8rem"
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        <div className="mt-8 min-h-[2.5rem] sm:min-h-[3rem]">
          <AnimatePresence>
            {nameVisible && (
              <motion.p
                key="name"
                initial={{ opacity: 0, y: 18, letterSpacing: "0.6em", filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.45em", filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.65, ease }}
                className="font-display text-lg font-semibold uppercase text-white/95 sm:text-xl"
              >
                Elias Elloumi
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5 min-h-[4.5rem] max-w-2xl sm:min-h-[5rem]">
          <AnimatePresence>
            {taglineVisible && (
              <motion.p
                key="tagline"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease, delay: 0.1 }}
                className="text-base leading-relaxed text-muted sm:text-lg md:text-xl"
              >
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.2 }}
                  className="intro-shimmer font-serif italic font-semibold bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text text-transparent"
                >
                  AI agents developer
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.45 }}
                >
                  {" "}
                  — I ship products, not slides
                </motion.span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {phase === "pause" && (
            <motion.div
              key="divider"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mt-8 flex items-center gap-4"
              aria-hidden
            >
              <span className="h-px w-12 bg-accent/50" />
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-accent"
              />
              <span className="h-px w-12 bg-accent/50" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "exit" && !fadingOut && (
            <motion.p
              key="enter"
              initial={{ opacity: 0, y: 10, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.35em" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease }}
              className="mt-10 text-[0.65rem] uppercase text-muted/80"
            >
              Enter
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-end px-5 pb-5 sm:px-8 sm:pb-8">
        <button
          type="button"
          onClick={skip}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted/80 ring-1 ring-white/8 transition-colors hover:text-foreground hover:ring-accent/30"
        >
          <span>Skip intro</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
