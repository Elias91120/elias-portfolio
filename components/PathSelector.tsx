"use client";

import { motion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;

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
      className="mt-8 w-full max-w-md"
      role="group"
      aria-label="Choose how to explore the portfolio"
    >
      <p className="mb-3 text-[0.65rem] sm:text-xs uppercase tracking-[0.3em] text-muted">
        How would you like to explore?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Magnetic>
          <button
            type="button"
            onClick={chooseHiring}
            className="flex min-h-11 w-full flex-col items-start rounded-2xl bg-white px-5 py-3.5 text-left transition-transform duration-300 hover:scale-[1.02]"
          >
            <span className="font-medium text-[#0c0a16]">I&apos;m hiring</span>
            <span className="mt-0.5 text-xs text-[#0c0a16]/60">
              Stats, projects &amp; contact — fast path
            </span>
          </button>
        </Magnetic>
        <Magnetic>
          <button
            type="button"
            onClick={chooseBrowsing}
            className="flex min-h-11 w-full flex-col items-start rounded-2xl bg-white/5 px-5 py-3.5 text-left ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-white/30"
          >
            <span className="font-medium text-white">Just browsing</span>
            <span className="mt-0.5 text-xs text-muted">
              The full scroll story
            </span>
          </button>
        </Magnetic>
      </div>
    </motion.div>
  );
}
