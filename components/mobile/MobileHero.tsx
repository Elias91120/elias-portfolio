"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import HeroAgentBlock from "@/components/HeroAgentBlock";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

export default function MobileHero() {
  const reducedMotion = useReducedMotion();

  const scrollTo = (href: string) => {
    scrollToSection(href, prefersReducedMotion() ? "auto" : "smooth");
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-x-hidden px-5 pt-16 pb-10"
    >
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="aurora absolute -top-32 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, #6d28d9 0%, rgba(109,40,217,0.35) 40%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={reducedMotion ? false : "hidden"}
        animate="show"
        variants={stagger}
        className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
      >
        <motion.div variants={fadeUp} className="relative">
          {!reducedMotion && (
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full opacity-40"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 12%, #a78bfa 38%, #38bdf8 62%, transparent 88%)",
              }}
            />
          )}
          <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-accent/40 shadow-[0_0_50px_rgba(167,139,250,0.25)]">
            <Image
              src="/story/avatar-hero.jpg"
              alt="Cartoon portrait of Elias Elloumi"
              fill
              sizes="6rem"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display mt-5 text-3xl font-bold leading-[1.12] tracking-tight text-white"
        >
          From a Minecraft kid to a{" "}
          <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text font-serif font-semibold italic text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm font-medium tracking-wide text-sky-300/90"
        >
          Data Engineering &amp; AI Agents
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-sm text-sm leading-relaxed text-muted"
        >
          Building data pipelines, AI agents, and production products at{" "}
          <span className="text-foreground">Nokia</span> and{" "}
          <span className="text-foreground">3geeks</span>.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/25">
            <span className="relative flex h-1.5 w-1.5">
              {!reducedMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Alternance 2026-2028
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="w-full">
          <HeroAgentBlock />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-5 flex w-full flex-col gap-2.5">
          <button
            type="button"
            onClick={() => scrollTo("#projects")}
            className="touch-press min-h-11 w-full rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0c0a16] transition-transform"
          >
            Voir les projets
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#contact")}
            className="touch-press min-h-11 w-full rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/10"
          >
            Me contacter
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
