"use client";

import { expertise } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

/**
 * The one light surface on the page. Warm paper rather than pure white, so
 * the break reads as a change of chapter instead of a glare.
 */
export default function Expertise() {
  const { t } = useLocale();

  return (
    <section
      id="expertise"
      className="relative z-10 rounded-t-[40px] bg-[#F2F0EA] px-5 py-20 text-[#0C0B12] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-12 md:py-32"
    >
      <FadeIn y={30}>
        <h2
          className="text-center font-display font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.75rem, 11vw, 9rem)" }}
        >
          {t({ en: "Expertise", fr: "Expertise" })}
        </h2>
      </FadeIn>

      <ul className="mx-auto mt-14 max-w-5xl sm:mt-20 md:mt-24">
        {expertise.map((item, i) => (
          <FadeIn
            as="li"
            key={item.number}
            delay={i * 0.08}
            y={26}
            className="flex flex-col gap-4 border-t border-[#0C0B12]/[0.14] py-8 sm:flex-row sm:items-start sm:gap-8 sm:py-10 md:gap-12 md:py-12"
          >
            <span
              className="font-display font-bold leading-[0.8] tracking-[-0.04em] text-[#0C0B12]/85 sm:min-w-[2.6ch]"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              {item.number}
            </span>

            <div className="flex-1">
              <h3
                className="font-display font-medium uppercase tracking-[0.01em]"
                style={{ fontSize: "clamp(1.1rem, 2.1vw, 2rem)" }}
              >
                {t(item.name)}
              </h3>
              <p
                className="mt-3 max-w-2xl font-light leading-[1.7] text-[#0C0B12]/65"
                style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)" }}
              >
                {t(item.description)}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-[#0C0B12]/15 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#0C0B12]/60"
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
