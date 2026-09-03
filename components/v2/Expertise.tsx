"use client";

import { expertise } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

/**
 * The chapter break in the middle of the page.
 *
 * It reads as a distinct surface without leaving the night palette: a panel
 * lifted a few points above the page background, rounded off at the top, with
 * a hairline of light along its edge. A white section would have broken the
 * art direction just to signal "new section".
 */
export default function Expertise() {
  const { t } = useLocale();

  return (
    <section
      id="expertise"
      className="relative z-10 overflow-hidden rounded-t-[40px] px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-12 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #14111f 0%, #100d1b 45%, #0b0913 100%)",
      }}
    >
      {/* Hairline along the top edge — catches the light like a folded sheet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.4) 35%, rgba(240,180,41,0.28) 65%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(167,139,250,0.5) 0%, transparent 70%)",
        }}
      />

      <FadeIn y={30}>
        <h2
          className="hero-heading relative text-center font-display font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.75rem, 11vw, 9rem)" }}
        >
          {t({ en: "Expertise", fr: "Expertise" })}
        </h2>
      </FadeIn>

      <ul className="relative mx-auto mt-14 max-w-5xl sm:mt-20 md:mt-24">
        {expertise.map((item, i) => (
          <FadeIn
            as="li"
            key={item.number}
            delay={i * 0.08}
            y={26}
            className="flex flex-col gap-4 border-t border-white/[0.09] py-8 sm:flex-row sm:items-start sm:gap-8 sm:py-10 md:gap-12 md:py-12"
          >
            <span
              className="font-display font-bold leading-[0.8] tracking-[-0.04em] text-white/[0.16] sm:min-w-[2.6ch]"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              {item.number}
            </span>

            <div className="flex-1">
              <h3
                className="font-display font-medium uppercase tracking-[0.01em] text-white"
                style={{ fontSize: "clamp(1.1rem, 2.1vw, 2rem)" }}
              >
                {t(item.name)}
              </h3>
              <p
                className="mt-3 max-w-2xl font-light leading-[1.7] text-[#C9C4DC]"
                style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)" }}
              >
                {t(item.description)}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-white/12 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
