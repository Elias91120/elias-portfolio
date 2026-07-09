"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SESSION_KEY = "intro-seen";
const AMBIENT_SRC = "/sounds/intro-ambient.mp3";

const ease = [0.22, 1, 0.36, 1] as const;

const TIMING_DESKTOP = {
  fadeIn: 2000,
  avatar: 4000,
  name: 4000,
  tagline: 8000,
  pause: 4000,
  exitHold: 3500,
  exitFade: 2500,
} as const;

const TIMING_MOBILE = {
  fadeIn: 1200,
  avatar: 2400,
  name: 2400,
  tagline: 4800,
  pause: 2400,
  exitHold: 1000,
  exitFade: 2600,
} as const;

type Phase = "fade-in" | "avatar" | "name" | "tagline" | "pause" | "exit";

type Props = {
  onComplete: () => void;
};

function useTypewriter(text: string, active: boolean, charDelay: number) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!active) return;
    setVisible(0);
  }, [active, text]);

  useEffect(() => {
    if (!active || visible >= text.length) return;
    const timer = window.setTimeout(() => setVisible((n) => n + 1), charDelay);
    return () => window.clearTimeout(timer);
  }, [active, visible, text.length, charDelay]);

  return text.slice(0, visible);
}

function useIntroAmbient(enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;

    const nodes = nodesRef.current;
    if (nodes) {
      try {
        nodes.gain.gain.setValueAtTime(0, nodes.gain.context.currentTime);
        nodes.osc1.stop();
        nodes.osc2.stop();
      } catch {
        /* already stopped */
      }
      nodesRef.current = null;
    }
    if (ctxRef.current?.state !== "closed") {
      void ctxRef.current?.close();
      ctxRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    stop();

    try {
      const audio = new Audio(AMBIENT_SRC);
      audio.loop = true;
      audio.volume = 0.18;
      audioRef.current = audio;
      await audio.play();
      return;
    } catch {
      audioRef.current = null;
    }

    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      gain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 110;
      osc1.connect(gain);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 164.81;
      osc2.connect(gain);

      osc1.start();
      osc2.start();
      nodesRef.current = { osc1, osc2, gain };
    } catch {
      /* silent fallback */
    }
  }, [stop]);

  useEffect(() => {
    if (enabled) void start();
    else stop();
    return stop;
  }, [enabled, start, stop]);
}

export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return sessionStorage.getItem(SESSION_KEY) !== "1";
}

export function markIntroSeen(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export default function CinematicIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("fade-in");
  const [fadingOut, setFadingOut] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timersRef = useRef<number[]>([]);

  const timing = isMobile ? TIMING_MOBILE : TIMING_DESKTOP;
  const nameDelay = isMobile ? 70 : 100;
  const taglineDelay = isMobile ? 40 : 55;

  const nameText = useTypewriter("Elias Elloumi", phase === "name", nameDelay);
  const taglineLead = "AI agents developer";
  const taglineRest = " — I ship products, not slides";
  const taglineLeadText = useTypewriter(
    taglineLead,
    phase === "tagline",
    taglineDelay,
  );
  const taglineRestText = useTypewriter(
    taglineRest,
    phase === "tagline" && taglineLeadText.length >= taglineLead.length,
    taglineDelay,
  );

  useIntroAmbient(soundEnabled && !fadingOut);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const runExit = useCallback(
    (fast = false) => {
      setPhase("exit");
      const hold = fast ? 0 : timing.exitHold;
      const fade = fast ? 380 : timing.exitFade;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{ duration: fadingOut ? (isMobile ? 0.45 : 0.65) : 1.6, ease }}
      className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#08060f] px-5"
      role="dialog"
      aria-label="Cinematic introduction"
      aria-modal="true"
      style={{ pointerEvents: fadingOut ? "none" : "auto" }}
    >
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: avatarVisible ? 0.3 : 0.12 }}
          transition={{ duration: 2, ease }}
          className="aurora absolute -top-48 left-1/2 h-[40rem] w-[64rem] -translate-x-1/2 rounded-full blur-3xl"
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

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: avatarVisible ? 1 : 0,
            scale: avatarVisible ? 1 : 0.7,
          }}
          transition={{ duration: 1.1, ease }}
          className={avatarVisible && phase !== "avatar" ? "animate-float" : ""}
        >
          <motion.div
            animate={{
              boxShadow:
                phase === "pause"
                  ? [
                      "0 0 80px rgba(167,139,250,0.3)",
                      "0 0 110px rgba(167,139,250,0.55)",
                      "0 0 80px rgba(167,139,250,0.3)",
                    ]
                  : "0 0 80px rgba(167,139,250,0.3)",
            }}
            transition={{
              duration: phase === "pause" ? 2.2 : 0.6,
              repeat: phase === "pause" ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-accent/50 sm:h-44 sm:w-44"
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
          {nameVisible && (
            <p className="font-display text-lg font-semibold uppercase tracking-[0.45em] text-white/95 sm:text-xl">
              {nameText}
              <span className="inline-block w-[0.12em] animate-pulse text-accent">
                {phase === "name" && nameText.length < "Elias Elloumi".length
                  ? "|"
                  : ""}
              </span>
            </p>
          )}
        </div>

        <div className="mt-5 min-h-[4.5rem] max-w-2xl sm:min-h-[5rem]">
          {taglineVisible && (
            <p className="text-base leading-relaxed text-muted sm:text-lg md:text-xl">
              <span className="font-serif italic font-semibold bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text text-transparent">
                {taglineLeadText}
              </span>
              <span>{taglineRestText}</span>
              <span className="inline-block w-[0.12em] animate-pulse text-accent">
                {phase === "tagline" &&
                taglineLeadText.length + taglineRestText.length <
                  taglineLead.length + taglineRest.length
                  ? "|"
                  : ""}
              </span>
            </p>
          )}
        </div>

        {phase === "pause" && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease }}
            className="mt-8 flex items-center gap-4"
            aria-hidden
          >
            <span className="h-px w-12 bg-accent/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            <span className="h-px w-12 bg-accent/40" />
          </motion.div>
        )}

        {phase === "exit" && !fadingOut && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-[0.65rem] uppercase tracking-[0.35em] text-muted/80"
          >
            Enter
          </motion.p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-5 sm:px-8 sm:pb-8">
        <button
          type="button"
          onClick={() => setSoundEnabled((on) => !on)}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted/80 ring-1 ring-white/8 transition-colors hover:text-foreground hover:ring-accent/30"
          aria-label={soundEnabled ? "Disable ambient sound" : "Enable ambient sound"}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
          <span className="hidden sm:inline">
            {soundEnabled ? "Sound on" : "Enable sound"}
          </span>
        </button>

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
