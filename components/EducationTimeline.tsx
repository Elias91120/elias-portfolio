"use client";

import { motion } from "framer-motion";
import { educationPath } from "@/lib/data";

const statusStyles = {
  completed: "bg-white/5 text-muted ring-white/10",
  current: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  upcoming: "bg-white/5 text-[#cfcae3] ring-white/10",
} as const;

export default function EducationTimeline({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      id="education"
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
            EDUCATION
          </span>
          <h2
            className={`font-display mt-4 font-bold tracking-tight text-white ${
              compact ? "text-2xl" : "text-3xl sm:text-4xl"
            }`}
          >
            Where I{" "}
            <span className="font-serif italic font-semibold text-[#f5f0e4]">
              am now
            </span>
          </h2>
          {!compact && (
            <p className="mt-4 max-w-2xl text-muted leading-relaxed">
              Final year of my Bachelor at ECE Paris — next up, the M.Sc. at
              EFREI and a two-year apprenticeship in data engineering &amp; AI.
            </p>
          )}
        </motion.div>

        <div
          className={`mt-10 grid gap-4 ${
            compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {educationPath.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl bg-card p-6 ring-1 ${
                step.status === "current"
                  ? "ring-emerald-400/25"
                  : "ring-white/8"
              }`}
              style={
                step.status === "current"
                  ? {
                      boxShadow: "0 20px 60px -32px rgba(52, 211, 153, 0.25)",
                    }
                  : undefined
              }
            >
              {step.status === "current" && (
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/25">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  You are here · final year
                </span>
              )}
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusStyles[step.status]}`}
              >
                {step.years}
              </div>
              <h3 className="font-display mt-4 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
