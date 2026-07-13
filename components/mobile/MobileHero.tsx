"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroAgentBlock from "@/components/HeroAgentBlock";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";
import { consumeIntroHandoff } from "@/lib/intro-handoff";

const ease = [0.22, 1, 0.36, 1] as const;
const easeOut = [0.16, 1, 0.3, 1] as const;

export default function MobileHero({ ready = true }: { ready?: boolean }) {
  const introHandoffRef = useRef<boolean | null>(null);

  if (ready && introHandoffRef.current === null) {
    introHandoffRef.current = consumeIntroHandoff();
  }
  const fromIntro = introHandoffRef.current === true;

  const scrollTo = (href: string) => {
    scrollToSection(href, prefersReducedMotion() ? "auto" : "smooth");
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-x-hidden px-5 pt-16 pb-10"
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

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <motion.div
          initial={
            fromIntro
              ? { opacity: 0.92, scale: 1 }
              : { opacity: 0, scale: 0.9 }
          }
          animate={
            ready
              ? { opacity: 1, scale: 1 }
              : fromIntro
                ? { opacity: 0.92, scale: 1 }
                : { opacity: 0, scale: 0.9 }
          }
          transition={{
            duration: fromIntro ? 0.5 : 0.7,
            ease: fromIntro ? easeOut : ease,
          }}
        >
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
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: ready ? 0.15 : 0, duration: 0.6, ease }}
          className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight text-white"
        >
          From a Minecraft kid to a{" "}
          <span className="font-serif italic font-semibold bg-gradient-to-r from-violet-300 via-sky-300 to-amber-200 bg-clip-text text-transparent">
            Full-Stack Developer
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: ready ? 0.25 : 0, duration: 0.6, ease }}
          className="mt-3 text-sm font-medium tracking-wide text-sky-300/90"
        >
          Data Engineering &amp; AI Agents
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: ready ? 0.3 : 0, duration: 0.6, ease }}
          className="mt-4 max-w-sm text-sm leading-relaxed text-muted"
        >
          Building data pipelines, AI agents, and production products at{" "}
          <span className="text-foreground">Nokia</span> and{" "}
          <span className="text-foreground">3geeks</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: ready ? 0.32 : 0, duration: 0.5, ease }}
          className="mt-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/25">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Alternance 2026–2028
          </span>
        </motion.div>

        <HeroAgentBlock ready={ready} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: ready ? 0.48 : 0, duration: 0.5, ease }}
          className="mt-5 flex w-full flex-col gap-2.5"
        >
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

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: ready ? 0.58 : 0, duration: 0.9 }}
          className="mt-6 flex flex-col items-center gap-2 text-muted"
          onClick={() =>
            scrollToSection("#story", prefersReducedMotion() ? "auto" : "smooth")
          }
          aria-label="Scroll to open the story"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">
            Scroll to open the story
          </span>
          <div className="flex h-9 w-6 justify-center rounded-full border-2 border-muted/40 pt-1.5">
            <div className="h-2 w-1 animate-wheel rounded-full bg-accent" />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
