"use client";

import { path } from "@/lib/people";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

const dotStyles: Record<string, string> = {
  past: "border-white/25 bg-background",
  current: "border-emerald-400/70 bg-emerald-400/20",
  next: "border-accent/70 bg-accent/20",
};

export default function Path() {
  const { t } = useLocale();

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28">
      <div className="mx-auto max-w-4xl">
        <FadeIn y={26}>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
            {t({ en: "The path", fr: "Le parcours" })}
          </p>
          <h2
            className="mt-4 font-display font-semibold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 4.4vw, 3.4rem)" }}
          >
            {t({
              en: "From soldering irons to production infrastructure.",
              fr: "Du fer à souder à l'infrastructure de production.",
            })}
          </h2>
        </FadeIn>

        <ol className="mt-12 sm:mt-16">
          {path.map((step, i) => (
            <FadeIn as="li" key={step.title} delay={i * 0.06} y={22}>
              <div className="relative grid gap-2 border-l border-white/[0.1] pb-10 pl-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 sm:pl-10 last:border-transparent last:pb-0">
                <span
                  className={`absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full border-2 ${dotStyles[step.status]}`}
                />
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted sm:pt-0.5">
                  {t(step.period)}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {step.title}
                    {step.status === "next" && (
                      <span className="ml-3 align-middle rounded-full border border-accent/35 px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-accent">
                        {t({ en: "Incoming", fr: "À venir" })}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-[#C9C4DC]">{t(step.subtitle)}</p>
                  <p className="mt-2.5 max-w-xl text-sm font-light leading-[1.7] text-muted">
                    {t(step.detail)}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
