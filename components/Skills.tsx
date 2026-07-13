"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillGroups, certifications } from "@/lib/data";

export default function Skills({ compact = false }: { compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const visibleGroups = compact && !expanded ? skillGroups.slice(0, 2) : skillGroups;

  return (
    <section
      id="skills"
      className={`relative px-5 ${compact ? "py-16" : "py-28"}`}
    >
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
          <p
            className={`mt-5 max-w-2xl text-muted leading-relaxed ${
              compact ? "text-sm hidden" : ""
            }`}
          >
            I ship through AI-native engineering — Cursor, Claude, MCP skills,
            and our self-hosted 3geeks API — across data pipelines, agents, and
            interfaces people actually use.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {visibleGroups.map((group, gi) => {
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
                  {(compact ? group.skills.slice(0, 6) : group.skills).map(
                    (skill) => (
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

        {compact && !expanded && skillGroups.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-6 min-h-11 w-full rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            Voir toutes les compétences
          </button>
        )}

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
