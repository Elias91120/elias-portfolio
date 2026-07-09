"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PathSelector from "@/components/PathSelector";
import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ ready = true }: { ready?: boolean }) {
  const { mode, setMode, hydrated } = useVisitorMode();
  const showScrollHint = hydrated && mode === "browsing";
  const showHiringSummary = hydrated && mode === "hiring";

  const switchToBrowsing = () => {
    setMode("browsing");
    requestAnimationFrame(() =>
      scrollToSection("#story", prefersReducedMotion() ? "auto" : "smooth")
    );
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5"
    >
      {/* Ambient aurora */}
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

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            ready
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.85 }
          }
          transition={{ duration: 0.8, ease }}
          className="animate-float"
        >
          <div className="relative h-36 w-36 sm:h-48 sm:w-48 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-[0_0_80px_rgba(167,139,250,0.3)]">
            <Image
              src="/story/avatar-hero.jpg"
              alt="Cartoon portrait of Elias Elloumi waving"
              fill
              sizes="(min-width: 640px) 12rem, 9rem"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: ready ? 0.2 : 0, duration: 0.7, ease }}
          className="mt-8 flex items-center gap-3 text-accent"
        >
          <span className="h-px w-8 bg-accent/40" />
          <span className="font-display text-xs sm:text-sm uppercase tracking-[0.35em]">
            Elias Elloumi
          </span>
          <span className="h-px w-8 bg-accent/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: ready ? 0.35 : 0, duration: 0.7, ease }}
          className="font-display mt-5 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]"
        >
          From a Minecraft kid
          <br />
          to a{" "}
          <span className="font-serif italic font-semibold bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: ready ? 0.45 : 0, duration: 0.7, ease }}
          className="mt-4 text-sm sm:text-base font-medium tracking-wide text-sky-300/90"
        >
          Data Engineering &amp; AI Agents
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: ready ? 0.5 : 0, duration: 0.7, ease }}
          className="mt-5 max-w-xl text-base sm:text-lg text-muted leading-relaxed"
        >
          Professional vibe coder from the fresh new wave — building data
          pipelines, AI agents, and production products at{" "}
          <span className="text-foreground">Nokia</span> and{" "}
          <span className="text-foreground">webgen</span>. This is the story of
          how I got here — one scroll at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: ready ? 0.62 : 0, duration: 0.6, ease }}
          className="mt-8"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/25">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Actively seeking apprenticeship — 2026–2028
          </span>
        </motion.div>

        <PathSelector ready={ready} />

        {showHiringSummary && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: ready ? 0.72 : 0, duration: 0.6, ease }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <p className="text-sm text-muted">
              You&apos;re on the{" "}
              <span className="text-foreground">hiring path</span>
            </p>
            <button
              type="button"
              onClick={switchToBrowsing}
              className="text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              Switch to story mode
            </button>
          </motion.div>
        )}

        {showScrollHint && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: ready ? 0.95 : 0, duration: 0.9 }}
            className="mt-14 flex flex-col items-center gap-3 text-muted cursor-pointer group"
            onClick={() =>
              scrollToSection("#story", prefersReducedMotion() ? "auto" : "smooth")
            }
            aria-label="Scroll to open the story"
          >
            <span className="text-[0.65rem] sm:text-xs uppercase tracking-[0.3em] group-hover:text-foreground transition-colors">
              Scroll to open the story
            </span>
            <div className="h-9 w-6 rounded-full border-2 border-muted/40 group-hover:border-accent/50 flex justify-center pt-1.5 transition-colors">
              <div className="h-2 w-1 rounded-full bg-accent animate-wheel" />
            </div>
          </motion.button>
        )}
      </div>
    </section>
  );
}
