"use client";

import { useState } from "react";
import Link from "next/link";
import { OTHER_WORK_VISIBLE, otherWork, type SideProject } from "@/lib/work";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

const originBadge: Record<
  NonNullable<SideProject["origin"]>,
  { label: string; className: string }
> = {
  nokia: { label: "Nokia", className: "text-violet-300" },
  "3geeks": { label: "3geeks", className: "text-amber-300" },
  client: { label: "Client", className: "text-sky-300" },
  academic: { label: "ECE Paris", className: "text-violet-300" },
};

export default function OtherWork() {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? otherWork : otherWork.slice(0, OTHER_WORK_VISIBLE);
  const hiddenCount = otherWork.length - OTHER_WORK_VISIBLE;

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={24} className="max-w-3xl">
          <p className="section-kicker text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
            {t({ en: "Also shipped", fr: "Également livré" })}
          </p>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            {t({
              en: "The rest of the work, one line each.",
              fr: "Le reste du travail, une ligne chacun.",
            })}
          </h2>
        </FadeIn>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => {
            const href = item.caseStudy ?? item.link;
            const badge = item.origin ? originBadge[item.origin] : undefined;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {badge && (
                      <span
                        className={`mb-1.5 inline-flex items-center text-[0.7rem] font-medium uppercase tracking-[0.14em] ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    )}
                    <h3 className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                      {item.name}
                    </h3>
                  </div>
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: item.accent }}
                  />
                </div>
                <p className="mt-3 flex-1 text-[0.82rem] font-light leading-[1.65] text-muted">
                  {t(item.tagline)}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#C9C4DC]">
                    {t(item.status)}
                  </span>
                  <span aria-hidden className="text-white/20">
                    ·
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                    {item.stack.join(" · ")}
                  </span>
                </div>
              </>
            );

            const base =
              "flex h-full flex-col bg-background p-6 transition-colors duration-500 sm:p-7";

            return (
              <FadeIn as="li" key={item.name} delay={(i % 3) * 0.07} y={22}>
                {href ? (
                  <Link
                    href={href}
                    {...(item.caseStudy
                      ? {}
                      : { target: "_blank", rel: "noreferrer" })}
                    className={`${base} hover:bg-[#100D1C]`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className={base}>{inner}</div>
                )}
              </FadeIn>
            );
          })}
        </ul>

        {hiddenCount > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/25 px-6 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.06]"
            >
              {expanded
                ? t({ en: "Show less", fr: "Voir moins" })
                : t({
                    en: `Show ${hiddenCount} more`,
                    fr: `Voir ${hiddenCount} de plus`,
                  })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
