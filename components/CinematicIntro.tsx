"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { markIntroHandoff } from "@/lib/intro-handoff";

const SESSION_KEY = "intro-seen";

const ease = [0.22, 1, 0.36, 1] as const;
const easeOut = [0.16, 1, 0.3, 1] as const;

const TIMING_DESKTOP = {
  fadeIn: 520,
  avatar: 920,
  name: 780,
  tagline: 980,
  spotlight: 720,
  breathe: 560,
  pause: 520,
  exitHold: 420,
  exitFade: 820,
} as const;

const TIMING_MOBILE = {
  fadeIn: 420,
  avatar: 760,
  name: 660,
  tagline: 820,
  spotlight: 620,
  breathe: 480,
  pause: 420,
  exitHold: 320,
  exitFade: 720,
} as const;

type Phase =
  | "fade-in"
  | "avatar"
  | "name"
  | "tagline"
  | "spotlight"
  | "breathe"
  | "pause"
  | "exit";

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

const ORBIT_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  angle: (i / 20) * 360,
  radius: 72 + (i % 4) * 22,
  size: 1.5 + (i % 3) * 0.75,
  delay: i * 0.04,
  duration: 3.2 + (i % 5) * 0.35,
}));

const NAME_CHARS = "Elias Elloumi".split("");

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
      const fade = fast ? 320 : timing.exitFade;

      const fadeId = window.setTimeout(() => {
        setFadingOut(true);
        const completeId = window.setTimeout(() => {
          markIntroSeen();
          markIntroHandoff();
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
      { phase: "spotlight", duration: timing.tagline },
      { phase: "breathe", duration: timing.spotlight },
      { phase: "pause", duration: timing.breathe },
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
  const nameVisible = ["name", "tagline", "spotlight", "breathe", "pause", "exit"].includes(phase);
  const taglineVisible = ["tagline", "spotlight", "breathe", "pause", "exit"].includes(phase);
  const particlesActive = ["spotlight", "breathe", "pause"].includes(phase);
  const burstActive = phase === "avatar" || phase === "spotlight";
  const letterboxOpen = phase !== "fade-in";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: fadingOut ? 0 : 1,
        scale: fadingOut ? 1.015 : 1,
        filter: fadingOut ? "blur(4px)" : "blur(0px)",
      }}
      transition={{
        duration: fadingOut ? (isMobile ? 0.65 : 0.82) : 0.95,
        ease: easeOut,
      }}
      className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#08060f] px-5"
      role="dialog"
      aria-label="Cinematic introduction"
      aria-modal="true"
      style={{ pointerEvents: fadingOut ? "none" : "auto" }}
    >
      {/* Cinematic letterbox — lifts away on reveal */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: letterboxOpen ? 0 : 1 }}
        transition={{ duration: 1.1, ease: easeOut }}
        className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[11vh] origin-top bg-[#08060f]"
        aria-hidden
      />
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: letterboxOpen ? 0 : 1 }}
        transition={{ duration: 1.1, ease: easeOut }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[11vh] origin-bottom bg-[#08060f]"
        aria-hidden
      />

      {/* Soft opening glow — replaces harsh flash */}
      <AnimatePresence>
        {phase === "fade-in" && (
          <motion.div
            key="glow-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0.08] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease }}
            className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.22)_0%,transparent_65%)]"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: avatarVisible ? 0.42 : 0.06,
            scale: avatarVisible ? 1 : 0.75,
          }}
          transition={{ duration: 1.35, ease: easeOut }}
          className="aurora absolute -top-48 left-1/2 h-[40rem] w-[64rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, #8b5cf6 0%, rgba(139,92,246,0.4) 35%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: avatarVisible ? 0.2 : 0.04 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="aurora-slow absolute bottom-[-8rem] right-[4%] h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #f59e0b 0%, transparent 65%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: avatarVisible ? 0.16 : 0.03 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="aurora-slow absolute bottom-[10%] left-[-6rem] h-80 w-80 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, #38bdf8 0%, transparent 65%)",
          }}
        />

        {/* Vignette pulse during spotlight */}
        <motion.div
          animate={{
            opacity: particlesActive ? [0.35, 0.55, 0.35] : 0.25,
          }}
          transition={{
            duration: particlesActive ? 2.4 : 0.6,
            repeat: particlesActive ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,6,15,0.85)_100%)]"
        />

        <AnimatePresence>
          {burstActive && (
            <motion.div
              key="burst"
              initial={{ opacity: 0, scale: 0.55 }}
              animate={{ opacity: [0, 0.45, 0], scale: [0.55, 1.35, 1.85] }}
              exit={{ opacity: 0 }}
              transition={{ duration: phase === "avatar" ? 1.45 : 1.15, ease: easeOut }}
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 65%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Orbiting particles */}
        <AnimatePresence>
          {particlesActive && (
            <motion.div
              key="particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-[52%] sm:h-96 sm:w-96"
              aria-hidden
            >
              {ORBIT_PARTICLES.map(({ id, angle, radius, size, delay, duration }) => (
                <motion.span
                  key={id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.85, 0.45, 0.85],
                    scale: [0, 1, 0.85, 1],
                    rotate: [angle, angle + 360],
                  }}
                  transition={{
                    opacity: { duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration, delay, repeat: Infinity, ease: "linear" },
                  }}
                  className="intro-particle absolute left-1/2 top-1/2 rounded-full bg-accent/80"
                  style={{
                    width: size,
                    height: size,
                    marginLeft: -size / 2,
                    marginTop: -size / 2,
                    transformOrigin: `${radius}px 0`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "avatar" && (
            <motion.div
              key="rays"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-[55%] sm:h-96 sm:w-96"
              aria-hidden
            >
              {BURST_RAYS.map(({ id, rotation }) => (
                <motion.div
                  key={id}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 0.28, 0] }}
                  transition={{ duration: 1.25, delay: id * 0.05, ease: easeOut }}
                  className="absolute left-1/2 top-1/2 h-32 w-px origin-bottom -translate-x-1/2"
                  style={{
                    rotate: `${rotation}deg`,
                    background:
                      "linear-gradient(to top, rgba(167,139,250,0.55), transparent)",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{
            opacity: avatarVisible ? 1 : 0,
            scale: avatarVisible ? 1 : 0.5,
            y: avatarVisible ? 0 : 24,
          }}
          transition={{ duration: 1.05, ease: easeOut }}
          className={
            avatarVisible && !["avatar", "fade-in"].includes(phase)
              ? "animate-float"
              : ""
          }
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1.5 rounded-full opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, #a78bfa, #38bdf8, #f59e0b, transparent)",
            }}
            aria-hidden
          />

          <motion.div
            animate={{
              boxShadow:
                particlesActive || phase === "pause"
                  ? [
                      "0 0 60px rgba(167,139,250,0.45), 0 0 120px rgba(56,189,248,0.2)",
                      "0 0 95px rgba(167,139,250,0.75), 0 0 170px rgba(56,189,248,0.35)",
                      "0 0 60px rgba(167,139,250,0.45), 0 0 120px rgba(56,189,248,0.2)",
                    ]
                  : "0 0 70px rgba(167,139,250,0.4), 0 0 140px rgba(56,189,248,0.18)",
            }}
            transition={{
              duration: 2.2,
              repeat: particlesActive || phase === "pause" ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="relative h-40 w-40 overflow-hidden rounded-full ring-2 ring-accent/55 sm:h-52 sm:w-52 md:h-60 md:w-60"
          >
            <Image
              src="/story/avatar-hero.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 15rem, (min-width: 640px) 13rem, 10rem"
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease }}
                className="font-display text-lg font-semibold uppercase text-white/95 sm:text-xl"
                aria-label="Elias Elloumi"
              >
                {NAME_CHARS.map((char, i) => (
                  <motion.span
                    key={`${char}-${i}`}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.55,
                      delay: i * 0.045,
                      ease: easeOut,
                    }}
                    style={{ display: "inline-block", letterSpacing: char === " " ? "0.35em" : "0.45em" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5 min-h-[4.5rem] max-w-2xl sm:min-h-[5rem]">
          <AnimatePresence>
            {taglineVisible && (
              <motion.p
                key="tagline"
                initial={{ opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: easeOut, delay: 0.08 }}
                className="text-base leading-relaxed text-muted sm:text-lg md:text-xl"
              >
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, ease: easeOut, delay: 0.25 }}
                  className="intro-shimmer font-serif italic font-semibold bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text text-transparent"
                >
                  AI agents developer
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, delay: 0.55, ease }}
                >
                  {" "}
                  — I ship products, not slides
                </motion.span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(phase === "spotlight" || phase === "breathe") && (
            <motion.div
              key="spotlight-line"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.75, ease: easeOut }}
              className="mt-7 h-px w-24 bg-gradient-to-r from-transparent via-accent/70 to-transparent"
              aria-hidden
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "pause" && (
            <motion.div
              key="divider"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.65, ease: easeOut }}
              className="mt-8 flex items-center gap-4"
              aria-hidden
            >
              <span className="h-px w-12 bg-accent/45" />
              <motion.span
                animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-accent"
              />
              <span className="h-px w-12 bg-accent/45" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "exit" && !fadingOut && (
            <motion.p
              key="enter"
              initial={{ opacity: 0, y: 8, letterSpacing: "0.55em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.32em" }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.65, ease: easeOut }}
              className="mt-10 text-[0.65rem] uppercase text-muted/75"
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
