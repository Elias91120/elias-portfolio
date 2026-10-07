"use client";

import { contact } from "@/lib/people";
import { useLocale } from "@/lib/i18n";
import type { L } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

/**
 * LinkedIn posts embedded as they were published, newest first. The frames
 * carry `loading="lazy"`, so LinkedIn's scripts and cookies are only fetched
 * when a visitor actually scrolls here — the rest of the page never waits on
 * a third party.
 */
const posts: { id: string; height: number; caption: L }[] = [
  {
    id: "7510761807641362432",
    height: 667,
    caption: { en: "3geeks, still building", fr: "3geeks, toujours là" },
  },
  {
    id: "7484058242340458496",
    height: 877,
    caption: { en: "Prompt Hub — update", fr: "Prompt Hub — mise à jour" },
  },
  {
    id: "7483245826916454400",
    height: 877,
    caption: { en: "Prompt Hub — first look", fr: "Prompt Hub — premier aperçu" },
  },
];

export default function Posts() {
  const { t } = useLocale();

  return (
    <section
      id="posts"
      className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn y={24} className="max-w-3xl">
          <p className="section-kicker text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
            {t({ en: "In public", fr: "En public" })}
          </p>
          <h2 className="mt-4 text-balance font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            {t({
              en: "What I build, shown as I post it.",
              fr: "Ce que je construis, tel que je le publie.",
            })}
          </h2>
        </FadeIn>

        <ul className="mt-12 grid items-start gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <FadeIn as="li" key={post.id} delay={i * 0.08} y={24}>
              <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
                {t(post.caption)}
              </p>
              <div className="overflow-hidden rounded-[24px] border border-white/[0.1] bg-white/[0.04]">
                <iframe
                  src={`https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${post.id}`}
                  title={`${t(post.caption)} — LinkedIn`}
                  loading="lazy"
                  allowFullScreen
                  className="block w-full max-w-full border-0"
                  style={{ height: post.height }}
                />
              </div>
            </FadeIn>
          ))}
        </ul>

        <FadeIn y={20} delay={0.1} className="mt-8">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/25 px-6 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.06]"
          >
            {t({ en: "More on LinkedIn", fr: "Plus sur LinkedIn" })}
            <span aria-hidden>→</span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
