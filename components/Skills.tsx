"use client";

import { motion } from "framer-motion";
import { skillGroups, certifications } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 px-5">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker font-display text-xs sm:text-sm font-semibold tracking-[0.3em] text-accent">
            TOOLBOX
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            What I{" "}
            <span className="font-serif italic font-semibold text-[#f5f0e4]">
              work
            </span>{" "}
            with
          </h2>
          <p className="mt-5 max-w-2xl text-muted leading-relaxed">
            Turning raw data into practical, well-designed solutions — from
            pipelines and AI agents to the interfaces people actually use.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => {
            const accent = group.accent;
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: gi * 0.12 }}
                className="rounded-3xl bg-card ring-1 ring-white/8 p-7 hover:ring-white/15 transition-shadow"
                style={{ boxShadow: `0 20px 60px -30px ${accent}33` }}
              >
                <div
                  className="h-1.5 w-12 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <h3 className="font-display mt-5 text-xl font-semibold text-white">
                  {group.title}
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-white/5 px-3.5 py-1.5 text-sm text-[#cfcae3] ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/10 hover:text-white hover:ring-white/25"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex items-center gap-4 rounded-2xl bg-card ring-1 ring-white/8 px-6 py-4 flex-1"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/30">
                <svg
                  className="h-5 w-5 text-amber-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">{cert.name}</div>
                <div className="text-sm text-muted">
                  {cert.issuer} — {cert.year}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
