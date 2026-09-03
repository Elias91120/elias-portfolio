"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { featuredWork, type Work } from "@/lib/work";
import { ui } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { useIsMobile } from "@/lib/use-is-mobile";
import { FadeIn } from "@/components/v2/Primitives";

const SCALE_STEP = 0.03;

export default function WorkStack() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { t } = useLocale();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="work"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-background px-5 pb-10 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-12 md:pt-28"
    >
      <FadeIn y={30}>
        <h2
          className="hero-heading text-center font-display font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.75rem, 11vw, 9rem)" }}
        >
          {t({ en: "Selected work", fr: "Projets" })}
        </h2>
      </FadeIn>

      <div ref={listRef} className="mx-auto mt-12 max-w-6xl sm:mt-16">
        {featuredWork.map((work, i) => (
          <Card
            key={work.id}
            work={work}
            index={i}
            total={featuredWork.length}
            progress={scrollYProgress}
            // The stack is a desktop delight. On a phone a card is already
            // taller than the screen, so pinning and scaling it would only
            // clip the content — plain vertical cards read better.
            stacked={isMobile === false && !reduce}
          />
        ))}
      </div>
    </section>
  );
}

function Card({
  work,
  index,
  total,
  progress,
  stacked,
}: {
  work: Work;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const { t } = useLocale();
  const targetScale = 1 - (total - 1 - index) * SCALE_STEP;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  const href = work.caseStudy ?? work.link;
  const isInternal = Boolean(work.caseStudy);

  return (
    <div
      className={
        stacked
          ? "sticky top-20 flex h-[86svh] min-h-[560px] items-start justify-center md:top-28"
          : "mb-5 flex items-start justify-center"
      }
    >
      <motion.article
        style={{
          scale: stacked ? scale : 1,
          top: stacked ? `${index * 26}px` : 0,
          backgroundColor: "#0C0A16",
        }}
        className="relative flex w-full flex-col gap-6 overflow-hidden rounded-[28px] border border-white/[0.13] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:gap-8 sm:rounded-[44px] sm:p-7 md:rounded-[56px] md:p-9"
      >
        {/* Accent wash, keyed to the project. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-[0.18] blur-[80px]"
          style={{ background: work.accent }}
        />

        <header className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 sm:gap-6">
            <span
              className="font-display font-bold leading-[0.8] tracking-[-0.05em] text-white/15"
              style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="pt-1">
              <p
                className="text-[0.7rem] font-medium uppercase tracking-[0.16em]"
                style={{ color: work.accent }}
              >
                {t(work.context)}
              </p>
              <h3
                className="mt-1.5 font-display font-semibold leading-tight tracking-tight text-white"
                style={{ fontSize: "clamp(1.35rem, 3vw, 2.5rem)" }}
              >
                {work.name}
              </h3>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                {t(work.category)}
              </p>
            </div>
          </div>

          {href && (
            <Link
              href={href}
              {...(isInternal ? {} : { target: "_blank", rel: "noreferrer" })}
              className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-white/25 px-5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.06] sm:px-7 sm:text-[0.72rem]"
            >
              {isInternal ? t(ui.caseStudy) : t(ui.liveProject)}
            </Link>
          )}
        </header>

        <div className="relative grid flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10">
          <div className="flex flex-col justify-between gap-6">
            <p
              className="max-w-xl font-light leading-[1.7] text-[#C9C4DC]"
              style={{ fontSize: "clamp(0.875rem, 1.35vw, 1.05rem)" }}
            >
              {t(work.description)}
            </p>

            <div className="flex flex-col gap-5">
              <dl className="flex flex-wrap gap-x-8 gap-y-4">
                {work.metrics.map((m) => (
                  <div key={m.value + t(m.label)}>
                    <dt className="sr-only">{t(m.label)}</dt>
                    <dd>
                      <span
                        className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
                        style={{ color: work.accent }}
                      >
                        {m.value}
                      </span>
                      <span className="mt-0.5 block text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                        {t(m.label)}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="flex flex-wrap gap-2">
                {work.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-white/12 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Visual work={work} />
        </div>
      </motion.article>
    </div>
  );
}

function Visual({ work }: { work: Work }) {
  const { t } = useLocale();
  const visual = work.visual;

  if (visual.kind === "image") {
    return (
      <div className="relative min-h-[180px] overflow-hidden rounded-[24px] border border-white/[0.09] bg-black/30 sm:rounded-[32px] md:min-h-[260px] md:rounded-[40px]">
        <Image
          src={visual.src}
          alt={t(visual.alt)}
          fill
          loading="lazy"
          sizes="(min-width: 768px) 44vw, 90vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[180px] flex-col justify-center gap-1 rounded-[24px] border border-white/[0.09] bg-black/25 p-5 sm:rounded-[32px] sm:p-7 md:min-h-[260px] md:rounded-[40px]">
      <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
        {t(visual.title)}
      </p>
      {visual.rows.map((row, i) => (
        <div
          key={row.k}
          className="flex items-center gap-3 border-t border-white/[0.06] py-2.5 first:border-t-0"
        >
          <span
            className="w-16 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.08em]"
            style={{ color: i === visual.rows.length - 1 ? work.accent : undefined }}
          >
            {row.k}
          </span>
          <span className="text-sm text-[#C9C4DC]">{row.v}</span>
        </div>
      ))}
    </div>
  );
}
