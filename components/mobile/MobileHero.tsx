"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import HeroAgentBlock from "@/components/HeroAgentBlock";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
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
      className="relative flex min-h-[100dvh] flex-col overflow-hidden pb-10"
    >
      <div className="relative h-[42svh] min-h-[16rem] w-full">
        <Image
          src="/art/hero-world.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_48%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060f] via-[#08060f]/20 to-[#08060f]/35" />
        <div className="absolute -bottom-10 left-1/2 z-10 -translate-x-1/2">
          <div className="relative h-24 w-24">
            {!reducedMotion && (
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full opacity-45"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 12%, #f59e0b 38%, #a78bfa 62%, transparent 88%)",
                }}
              />
            )}
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-amber-200/40 shadow-[0_0_50px_rgba(245,158,11,0.28)]">
              <Image
                src="/story/avatar-hero.jpg"
                alt="Cartoon portrait of Elias Elloumi"
                fill
                sizes="6rem"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={reducedMotion ? false : "hidden"}
        animate="show"
        variants={stagger}
        className="relative z-10 mx-auto mt-14 flex w-full max-w-md flex-col items-center px-5 text-center"
      >
        <motion.h1
          variants={fadeUp}
          className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-white"
        >
          From a Minecraft kid to a{" "}
          <span className="bg-gradient-to-r from-amber-200 via-violet-200 to-sky-200 bg-clip-text font-serif font-semibold italic text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-sm text-sm leading-relaxed text-[#d7d2ea]"
        >
          Building data pipelines, AI agents, and production products at{" "}
          <span className="text-white">Nokia</span> and{" "}
          <span className="text-white">3geeks</span>.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/12 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/25">
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
