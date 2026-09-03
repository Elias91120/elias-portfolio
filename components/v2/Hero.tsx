"use client";

import { profile, ui } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { FadeIn, Magnet, PrimaryButton } from "@/components/v2/Primitives";
// Imported statically on purpose: only the WebGL work inside it is client-side,
// while its poster renders on the server. Deferring the whole component would
// hide the largest image from the preload scanner and push LCP past 2s.
import Head3D from "@/components/v2/Head3D";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="top"
      className="relative flex h-[100svh] min-h-[600px] flex-col justify-between overflow-hidden pt-24 sm:pt-28 md:pt-32"
    >
      {/* Ambient light behind the portrait — pure CSS, no image weight. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-[45%] rounded-full opacity-[0.55] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(126,86,214,0.5) 0%, rgba(240,180,41,0.12) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-20 overflow-hidden px-5 sm:px-8 md:px-12">
        <FadeIn delay={0.05} y={40} duration={0.8} onMount>
          <h1 className="hero-heading w-full whitespace-nowrap text-center font-display text-[12.6vw] font-bold uppercase leading-[0.85] tracking-[-0.045em]">
            Elias Elloumi
          </h1>
        </FadeIn>
      </div>

      {/* The portrait sits between the name and the baseline, overlapping both. */}
      <Magnet
        padding={160}
        strength={9}
        // Sized off the viewport height as well as its width: on a short
        // window the portrait has to shrink or it swallows the name.
        // Centred on a phone, where anchoring it to the baseline would leave a
        // hole under the name and push the hand into the strapline; anchored
        // low from sm up, where the wider frame gives it room to sit.
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(96vw,52vh,660px)] -translate-x-1/2 -translate-y-[52%] sm:top-auto sm:-bottom-[6vh] sm:w-[min(90vw,56vh,660px)] sm:translate-y-0"
      >
        <FadeIn delay={0.15} y={36} duration={0.95} onMount fade={false}>
          <Head3D className="aspect-square w-full" />
        </FadeIn>
      </Magnet>

      {/* Scrim between the portrait and the baseline copy: it grounds the
          figure and guarantees the strapline stays legible wherever the
          shoulders happen to fall at a given viewport. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[40%] bg-gradient-to-t from-background via-background/70 to-transparent"
      />

      {/* Stacked on a phone — side by side there is not enough room for the
          line to read as a sentence. */}
      <div className="relative z-20 flex flex-col items-start gap-5 px-5 pb-20 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-8 md:px-12 md:pb-24">
        <FadeIn delay={0.5} y={22} onMount className="max-w-[15rem] sm:max-w-[240px] md:max-w-[300px]">
          <p
            className="font-light uppercase leading-snug tracking-[0.06em] text-[#D7E2EA]"
            style={{ fontSize: "clamp(0.72rem, 1.15vw, 1.05rem)" }}
          >
            {t(profile.heroLine)}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.62}
          y={22}
          onMount
          className="flex w-full flex-col items-start gap-4 sm:w-auto sm:items-end"
        >
          <span className="hidden items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-emerald-300 sm:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t(profile.status)}
          </span>
          <Magnet padding={80} strength={7}>
            <PrimaryButton href="#contact">{t(ui.contactCta)}</PrimaryButton>
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
