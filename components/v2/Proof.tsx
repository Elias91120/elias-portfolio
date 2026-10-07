"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { experience } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { CountUp, EASE, FadeIn } from "@/components/v2/Primitives";

/**
 * The first thing under the hero: three employers, one headline figure each,
 * three lines each. A visitor who stops scrolling here still knows where the
 * work was done and what it was.
 */
export default function Proof() {
  const { t } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-background px-5 pb-16 pt-16 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-20 sm:pt-20 md:-mt-14 md:rounded-t-[60px] md:px-12 md:pt-24"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn y={24} className="max-w-3xl">
          <p className="section-kicker text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
            {t({ en: "Where the work happened", fr: "Là où le travail s'est fait" })}
          </p>
          <h2
            className="mt-5 text-balance font-display font-semibold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 4.4vw, 3.4rem)" }}
          >
            {t({
              en: "Two companies and a studio of my own.",
              fr: "Deux entreprises et un studio à moi.",
            })}
          </h2>
        </FadeIn>

        <ul className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-5">
          {experience.map((job, i) => (
            <FadeIn as="li" key={job.id} delay={i * 0.1} y={30} className="flex">
              <article
                className="group relative flex w-full flex-col overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0C0A16] p-6 transition-colors duration-500 hover:border-white/[0.22] sm:p-7"
                style={{ ["--job" as string]: job.accent }}
              >
                {/* Accent rule that draws itself in, and a wash that wakes on hover. */}
                <motion.span
                  aria-hidden
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: EASE }}
                  className="absolute inset-x-0 top-0 h-[3px] origin-left"
                  style={{ background: job.accent }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full opacity-[0.14] blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.3]"
                  style={{ background: job.accent }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
                    {t(job.period)}
                  </span>
                  {job.current && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.14em]"
                      style={{
                        color: job.accent,
                        borderColor: `color-mix(in srgb, ${job.accent} 40%, transparent)`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full motion-safe:animate-pulse"
                        style={{ background: job.accent }}
                      />
                      {t({ en: "Now", fr: "En cours" })}
                    </span>
                  )}
                </div>

                {/* The logo is the heading: the mark a recruiter recognises first.
                    The company name stays in the alt text for readers and search. */}
                <h3 className="relative mt-5 flex h-[3.25rem] items-center">
                  <span
                    className={
                      job.logo.plate
                        ? "inline-flex items-center rounded-xl bg-white px-4 py-2.5"
                        : job.logo.crop
                          ? "inline-flex h-11 w-40 items-center justify-center overflow-hidden rounded-xl"
                          : "inline-flex items-center"
                    }
                  >
                    <Image
                      src={job.logo.src}
                      alt={job.company}
                      width={job.logo.width}
                      height={job.logo.height}
                      unoptimized
                      className={
                        job.logo.plate
                          ? "h-6 w-auto"
                          : job.logo.crop
                            ? "h-full w-full origin-[48%_50%] scale-[1.45] object-cover"
                            : "h-9 w-auto sm:h-10"
                      }
                    />
                  </span>
                </h3>
                <p
                  className="relative mt-2 text-[0.7rem] font-medium uppercase tracking-[0.14em]"
                  style={{ color: job.accent }}
                >
                  {t(job.tagline)}
                </p>
                <p className="relative mt-2 text-sm text-[#C9C4DC] md:min-h-[2.75rem]">{t(job.role)}</p>

                <div className="relative mt-6 flex items-baseline gap-3 border-y border-white/[0.08] py-4">
                  <CountUp
                    value={job.stat.value}
                    className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
                    style={{ color: job.accent }}
                  />
                  <span className="text-xs leading-snug text-muted sm:text-sm">
                    {t(job.stat.label)}
                  </span>
                </div>

                <ul className="relative mt-5 flex flex-1 flex-col gap-3">
                  {job.points.map((point) => (
                    <li
                      key={point.en}
                      className="flex gap-3 text-[0.86rem] font-light leading-[1.6] text-[#C9C4DC]"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.55rem] h-1 w-3 shrink-0 rounded-full"
                        style={{ background: job.accent }}
                      />
                      <span>{t(point)}</span>
                    </li>
                  ))}
                </ul>

                {job.note && (
                  <p className="relative mt-5 border-t border-white/[0.08] pt-4 text-[0.82rem] font-light italic leading-[1.6] text-muted">
                    {t(job.note)}
                  </p>
                )}
              </article>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
