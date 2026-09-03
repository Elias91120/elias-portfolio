"use client";

import { clientQuotes, contact, recommendations } from "@/lib/people";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

export default function Recommendations() {
  const { t } = useLocale();

  return (
    <section
      id="recommendations"
      className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn y={26}>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
            {t({ en: "Recommendations", fr: "Recommandations" })}
          </p>
          <h2
            className="mt-4 max-w-3xl font-display font-semibold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 4.4vw, 3.4rem)" }}
          >
            {t({
              en: "What the engineers I worked with at Nokia wrote about me.",
              fr: "Ce que les ingénieurs avec qui j'ai travaillé chez Nokia ont écrit sur moi.",
            })}
          </h2>
          <a
            href={`${contact.linkedin}details/recommendations/`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm text-muted underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-foreground"
          >
            {t({
              en: "Verified on LinkedIn",
              fr: "Vérifiées sur LinkedIn",
            })}
            <span aria-hidden>↗</span>
          </a>
        </FadeIn>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-2">
          {recommendations.map((rec, i) => (
            <FadeIn
              key={rec.author}
              delay={(i % 2) * 0.1}
              y={26}
              // min-w-0 on both the card and its footer: the truncated role
              // line is nowrap, and without it its min-content width pushes
              // the whole grid wider than the viewport on a phone.
              className="flex h-full min-w-0 flex-col justify-between gap-6 rounded-3xl border border-white/[0.09] bg-[#0E0B1A] p-6 sm:p-8"
            >
              <blockquote
                className="font-light leading-[1.75] text-[#D7E2EA]"
                style={{ fontSize: "clamp(0.92rem, 1.35vw, 1.08rem)" }}
              >
                <span aria-hidden className="mr-1 text-accent">
                  “
                </span>
                {t(rec.quote)}
                <span aria-hidden className="ml-0.5 text-accent">
                  ”
                </span>
              </blockquote>

              <footer className="flex min-w-0 items-center gap-4 border-t border-white/[0.07] pt-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] font-display text-sm font-semibold tracking-tight text-accent">
                  {rec.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-white">
                    {rec.author}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {t(rec.role)} · {rec.company}
                  </p>
                  <p className="mt-0.5 truncate text-[0.7rem] text-muted/70">
                    {t(rec.relation)} · {t(rec.date)}
                  </p>
                </div>
              </footer>
            </FadeIn>
          ))}
        </div>

        {/* Client side of the ledger — shorter, kept visually secondary. */}
        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-2">
          {clientQuotes.map((item, i) => (
            <FadeIn
              key={item.author}
              delay={(i % 2) * 0.1}
              y={22}
              className="flex flex-col gap-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <p className="text-sm font-light leading-[1.7] text-[#C9C4DC]">
                {t(item.quote)}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.7rem] uppercase tracking-[0.1em]">
                <span className="font-medium text-white">{item.author}</span>
                <span aria-hidden className="text-white/20">
                  ·
                </span>
                <span className="text-muted">{item.projects.join(" · ")}</span>
                {item.verified && (
                  <span className="rounded-full border border-emerald-400/25 px-2 py-0.5 text-[0.7rem] text-emerald-300">
                    {t({ en: "Verified", fr: "Vérifié" })}
                  </span>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
