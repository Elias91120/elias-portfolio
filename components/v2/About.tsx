"use client";

import { about, ui } from "@/lib/content";
import { contact } from "@/lib/people";
import { useLocale } from "@/lib/i18n";
import {
  AnimatedText,
  FadeIn,
  GhostButton,
  Magnet,
  PrimaryButton,
} from "@/components/v2/Primitives";

/** Decorative, weightless: soft orbs and a thin ring drawn in CSS only. */
function Decor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-[-8%] top-[10%] h-[240px] w-[240px] rounded-full opacity-40 blur-[70px] sm:h-[340px] sm:w-[340px]"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute bottom-[8%] right-[-6%] h-[220px] w-[220px] rounded-full opacity-35 blur-[70px] sm:h-[320px] sm:w-[320px]"
        style={{
          background:
            "radial-gradient(circle, rgba(240,180,41,0.35) 0%, transparent 68%)",
        }}
      />
      <div className="absolute left-[6%] top-[22%] hidden h-[120px] w-[120px] rounded-full border border-white/[0.08] md:block" />
      <div className="absolute bottom-[16%] right-[9%] hidden h-[84px] w-[84px] rotate-12 rounded-[26px] border border-white/[0.08] md:block" />
    </div>
  );
}

export default function About() {
  const { t } = useLocale();

  return (
    <section
      id="about"
      className="relative flex min-h-[85vh] items-center justify-center px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-32"
    >
      <Decor />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 text-center sm:gap-14">
        <FadeIn y={36} duration={1}>
          <h2
            className="hero-heading font-display font-bold uppercase leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.75rem, 11vw, 9rem)" }}
          >
            {t(about.heading)}
          </h2>
        </FadeIn>

        <AnimatedText
          text={t(about.paragraph)}
          className="max-w-[46rem] font-light leading-[1.75] text-[#D7E2EA]"
          // Fluid body copy — comfortable on a phone, generous on a wide screen.
          style={{ fontSize: "clamp(1rem, 1.55vw, 1.3rem)" }}
        />

        <FadeIn delay={0.15} y={22} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
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
