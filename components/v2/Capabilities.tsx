"use client";

import { motion, useReducedMotion } from "framer-motion";
import { capabilities, ui } from "@/lib/content";
import { contact } from "@/lib/people";
import { useLocale } from "@/lib/i18n";
import { scrollToSection } from "@/lib/scroll-to-section";
import {
  EASE,
  FadeIn,
  GhostButton,
  Magnet,
  PrimaryButton,
} from "@/components/v2/Primitives";

/**
 * Three things a team gets, each one pinned to the project that proves it.
 * The proof chip scrolls to that card, so a claim is never more than a click
 * from the evidence.
 */
export default function Capabilities() {
  const { t } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[18%] h-[320px] w-[320px] rounded-full opacity-30 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <FadeIn y={30}>
          <h2
            className="hero-heading text-balance font-display font-bold uppercase leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.4rem, 8vw, 6.5rem)" }}
          >
            {t(capabilities.heading)}
          </h2>
        </FadeIn>

        <ol className="mt-12 sm:mt-16">
          {capabilities.items.map((item, i) => (
            <li key={item.title.en} className="relative">
              <motion.span
                aria-hidden
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, ease: EASE }}
                className="absolute inset-x-0 top-0 h-px origin-left bg-white/[0.14]"
              />
              <FadeIn
                y={26}
                delay={0.05}
                className="grid gap-4 py-9 sm:py-12 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.25fr)] md:gap-10"
              >
                <span
                  className="font-display font-bold leading-none tracking-[-0.05em] text-white/[0.16]"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className="font-display font-semibold leading-[1.1] tracking-tight text-white"
                  style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)" }}
                >
                  {t(item.title)}
                </h3>

                <div>
                  <p className="font-light leading-[1.75] text-[#D7E2EA]" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}>
                    {t(item.body)}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection(`#${item.proof.target}`)}
                    className="group mt-5 inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/[0.14] px-4 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#C9C4DC] transition-colors duration-300 hover:border-accent/60 hover:text-white"
                  >
                    <span className="text-accent">
                      {t({ en: "Proof", fr: "Preuve" })}
                    </span>
                    {t(item.proof.label)}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>
              </FadeIn>
            </li>
          ))}
          <li aria-hidden className="h-px bg-white/[0.14]" />
        </ol>

        <FadeIn y={22} className="mt-10 max-w-2xl">
          <p
            className="text-balance font-display font-medium leading-[1.35] tracking-tight text-[#D7E2EA]"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.45rem)" }}
          >
            {t(capabilities.outro)}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.1}
          y={22}
          className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Magnet padding={70} strength={8}>
            <PrimaryButton href="#contact">{t(ui.contactCta)}</PrimaryButton>
          </Magnet>
          <GhostButton href={contact.cvPath} external>
            {t(ui.downloadCv)}
          </GhostButton>
        </FadeIn>
      </div>
    </section>
  );
}
