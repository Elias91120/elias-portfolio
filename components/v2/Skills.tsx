"use client";

import { certifications, skillGroups } from "@/lib/people";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

export default function Skills() {
  const { t } = useLocale();

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={26}>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
            {t({ en: "Toolbox", fr: "Boîte à outils" })}
          </p>
          <h2
            className="mt-4 font-display font-semibold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 4.4vw, 3.4rem)" }}
          >
            {t({
              en: "What I reach for.",
              fr: "Ce que j'utilise au quotidien.",
            })}
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {skillGroups.map((group, i) => (
            <FadeIn key={group.title.en} delay={i * 0.07} y={22}>
              <h3 className="border-b border-white/[0.1] pb-3 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">
                {t(group.title)}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm font-light text-muted transition-colors duration-300 hover:text-[#D7E2EA]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>

        <FadeIn y={22} delay={0.1} className="mt-14 border-t border-white/[0.08] pt-8">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
            {t({ en: "Certifications", fr: "Certifications" })}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
            {certifications.map((cert) => (
              <li key={cert.name} className="min-w-0">
                <p className="text-sm font-medium text-white">{cert.name}</p>
                <p className="text-xs text-muted">
                  {cert.issuer} · {cert.year}
                </p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
