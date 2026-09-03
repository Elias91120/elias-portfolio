"use client";

import { useState } from "react";
import Link from "next/link";
import { otherWork } from "@/lib/work";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";

type Filter = "all" | "3geeks" | "other";

export default function OtherWork() {
  const { t } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = otherWork.filter((item) => {
    if (filter === "3geeks") return item.origin === "3geeks";
    if (filter === "other") return item.origin !== "3geeks";
    return true;
  });

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={24} className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent">
              {t({ en: "Also shipped", fr: "Également livré" })}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
              {t({
                en: "Ten more products, tools and experiments that made it to production.",
                fr: "Dix autres produits, outils et expérimentations arrivés jusqu'en production.",
              })}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase tracking-wider transition-colors ${
                filter === "all"
                  ? "border border-white/40 bg-white/10 text-white"
                  : "border border-white/10 text-muted hover:text-white"
              }`}
            >
              {t({ en: "All", fr: "Tous" })}
            </button>
            <button
              type="button"
              onClick={() => setFilter("3geeks")}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase tracking-wider transition-colors ${
                filter === "3geeks"
                  ? "border border-amber-400/50 bg-amber-400/15 text-amber-300"
                  : "border border-white/10 text-muted hover:text-amber-300"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              3geeks Studio
            </button>
            <button
              type="button"
              onClick={() => setFilter("other")}
              className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase tracking-wider transition-colors ${
                filter === "other"
                  ? "border border-white/40 bg-white/10 text-white"
                  : "border border-white/10 text-muted hover:text-white"
              }`}
            >
              {t({ en: "Client & Academic", fr: "Clients & ECE" })}
            </button>
          </div>
        </FadeIn>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => {
            const href = item.caseStudy ?? item.link;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {item.origin === "3geeks" && (
                      <span className="mb-1.5 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        3geeks Studio
                      </span>
                    )}
                    {item.origin === "client" && (
                      <span className="mb-1.5 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-sky-300">
                        Client
                      </span>
                    )}
                    {item.origin === "academic" && (
                      <span className="mb-1.5 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-violet-300">
                        ECE Paris
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
                    {item.stack.slice(0, 3).join(" · ")}
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
      </div>
    </section>
  );
}
