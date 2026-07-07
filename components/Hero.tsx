"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5"
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[34rem] w-[34rem] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #6d28d9 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="animate-float"
        >
          <div className="relative h-40 w-40 sm:h-52 sm:w-52 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-[0_0_60px_rgba(167,139,250,0.25)]">
            <Image
              src="/story/avatar-hero.jpg"
              alt="Cartoon portrait of Elias Elloumi waving"
              fill
              sizes="(min-width: 640px) 13rem, 10rem"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-8 text-sm sm:text-base uppercase tracking-[0.3em] text-accent"
        >
          Hi, I&apos;m Elias
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-display mt-4 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white"
        >
          From a Minecraft kid
          <br />
          to a{" "}
          <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-amber-300 bg-clip-text text-transparent">
            Data &amp; AI engineer
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-6 max-w-xl text-base sm:text-lg text-muted leading-relaxed"
        >
          Data engineering &amp; AI agent developer at Nokia, co-founder of
          3geeks. This is the story of how I got here — one scroll at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-14 flex flex-col items-center gap-3 text-muted"
        >
          <span className="text-xs uppercase tracking-[0.25em]">
            Scroll to open the story
          </span>
          <div className="h-9 w-6 rounded-full border-2 border-muted/50 flex justify-center pt-1.5">
            <div className="h-2 w-1 rounded-full bg-accent animate-wheel" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
