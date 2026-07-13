"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/data";

function Stars() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="h-4 w-4 text-emerald-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-emerald-300">5/5</span>
    </div>
  );
}

export default function Testimonials({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      id="testimonials"
      className={`relative px-5 ${compact ? "py-12" : "py-20"}`}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker font-display text-xs sm:text-sm font-semibold tracking-[0.3em] text-accent">
            CLIENT FEEDBACK
          </span>
          <h2
            className={`font-display mt-4 font-bold tracking-tight text-white ${
              compact ? "text-2xl" : "text-3xl sm:text-5xl"
            }`}
          >
            What clients{" "}
            <span className="font-serif italic font-semibold text-[#f5f0e4]">
              say
            </span>
          </h2>
        </motion.div>

        <div
          className={`mt-10 grid gap-6 ${
            compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {testimonials.map((item, i) => (
            <motion.article
              key={item.author}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="relative overflow-hidden rounded-3xl bg-card p-7 ring-1 ring-white/10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(56, 189, 248, 0.12), transparent)",
                }}
              />
              <span className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-300 ring-1 ring-emerald-400/20">
                Retours clients
              </span>
              <div className="mt-5">
                <Stars />
              </div>
              <blockquote className="mt-5 text-base leading-relaxed text-[#d4d0e8]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm leading-relaxed text-[#8a849e]">
                {item.quoteEn}
              </p>
              <footer className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <span className="font-display text-lg font-semibold text-emerald-300">
                      {item.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.author}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.projectTags.map((tag) => (
                        <span
                          key={tag.label}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium ring-1"
                          style={{
                            color: tag.accent,
                            backgroundColor: `color-mix(in srgb, ${tag.accent} 12%, transparent)`,
                            borderColor: `color-mix(in srgb, ${tag.accent} 28%, transparent)`,
                          }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {item.verified && (
                  <span className="shrink-0 text-xs text-muted">
                    verified review
                  </span>
                )}
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
