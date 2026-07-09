"use client";

import { motion } from "framer-motion";
import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;

const baseBtn =
  "group relative flex min-h-[4.25rem] w-full flex-col items-start rounded-2xl px-5 py-3.5 text-left backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

type PathSelectorProps = {
  ready: boolean;
};

export default function PathSelector({ ready }: PathSelectorProps) {
  const { mode, setMode, hydrated } = useVisitorMode();

  if (!hydrated || mode !== null) return null;

  const behavior = prefersReducedMotion() ? "auto" : "smooth";

  const chooseHiring = () => {
    setMode("hiring");
    requestAnimationFrame(() => scrollToSection("#proof", behavior));
  };

  const chooseBrowsing = () => {
    setMode("browsing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ delay: ready ? 0.72 : 0, duration: 0.6, ease }}
      className="mt-8 w-full max-w-lg"
      role="group"
      aria-label="Choose how to explore the portfolio"
    >
      <p className="mb-3 text-[0.65rem] sm:text-xs uppercase tracking-[0.3em] text-muted">
        How would you like to explore?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={chooseHiring}
          className={`${baseBtn} bg-accent/10 ring-1 ring-accent/25 hover:bg-accent/16 hover:ring-accent/45 hover:-translate-y-0.5 shadow-[0_0_0_0_rgba(167,139,250,0)] hover:shadow-[0_12px_40px_-16px_rgba(167,139,250,0.45)]`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="font-medium text-foreground transition-colors group-hover:text-white">
            I&apos;m hiring
          </span>
          <span className="mt-0.5 text-xs text-muted transition-colors group-hover:text-accent/80">
            Stats, projects &amp; contact — fast path
          </span>
        </button>
        <button
          type="button"
          onClick={chooseBrowsing}
          className={`${baseBtn} bg-card/90 ring-1 ring-white/10 hover:bg-white/[0.07] hover:ring-white/22 hover:-translate-y-0.5`}
        >
          <span className="font-medium text-foreground transition-colors group-hover:text-white">
            Just browsing
          </span>
          <span className="mt-0.5 text-xs text-muted transition-colors group-hover:text-foreground/70">
            The full scroll story
          </span>
        </button>
      </div>
    </motion.div>
  );
}
