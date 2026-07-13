"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skillGroups, certifications, type SkillGroup } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

const groupBlurbs: Record<string, string> = {
  "AI-Native Engineering":
    "Cursor, MCP, and self-hosted LLMs — AI as the default way to ship.",
  "Data & AI":
    "Pipelines, agents, and analytics from notebook to production dashboard.",
  "Web & Product":
    "Interfaces people use — from Shopify storefronts to the App Store.",
  "Cloud & Engineering":
    "Deploy, integrate, and keep prod running — Coolify to Firebase.",
  "Embedded & Hardware":
    "Where it started — STI2D, soldering irons, and embedded logic.",
};

const totalSkills = skillGroups.reduce((n, g) => n + g.skills.length, 0);

function SkillPill({ skill, accent }: { skill: string; accent: string }) {
  return (
    <span
      className="inline-flex rounded-full bg-white/[0.04] px-3.5 py-1.5 text-sm text-[#cfcae3] ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 24px -8px ${accent}88`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {skill}
    </span>
  );
}

function SkillPanel({ group }: { group: SkillGroup }) {
  return (
    <motion.div
      key={group.title}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease }}
      className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-white/10"
      style={{ boxShadow: `0 24px 80px -40px ${group.accent}44` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: group.accent }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${group.accent}88, transparent)`,
        }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="h-1.5 w-10 rounded-full"
                style={{ backgroundColor: group.accent }}
              />
              <span
                className="font-display text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: group.accent }}
              >
                {group.skills.length} skills
              </span>
            </div>
            <h3 className="font-display mt-4 text-2xl font-semibold text-white sm:text-3xl">
              {group.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {groupBlurbs[group.title]}
            </p>
          </div>
        </div>

        <ul className="mt-8 flex list-none flex-wrap gap-2 sm:gap-2.5">
          {group.skills.map((skill, i) => (
            <motion.li
              key={skill}
              className="list-none"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.35), ease }}
            >
              <SkillPill skill={skill} accent={group.accent} />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Skills({ compact = false }: { compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGroup = skillGroups[activeIndex];

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
          <h2
            className={`font-display mt-4 font-bold tracking-tight text-white ${
              compact ? "text-3xl" : "text-3xl sm:text-5xl"
            }`}
          >
            What I{" "}
            <span className="font-serif italic font-semibold text-[#f5f0e4]">
              work
            </span>{" "}
            with
          </h2>
          <p
            className={`mt-5 max-w-2xl text-muted leading-relaxed ${
              compact ? "text-sm" : ""
            }`}
          >
            {compact ? (
              <>
                {totalSkills} skills across {skillGroups.length} domains — AI-native
                engineering, data, product, infra, and embedded.
              </>
            ) : (
              <>
                {totalSkills} skills across {skillGroups.length} domains. I ship
                through AI-native engineering — Cursor, Claude, MCP skills, and
                our self-hosted 3geeks API — across data pipelines, agents, and
                interfaces people actually use.
              </>
            )}
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="mt-10 -mx-5 px-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2 sm:gap-3">
            {skillGroups.map((group, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={group.title}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ring-1 sm:px-5"
                  style={
                    isActive
                      ? {
                          backgroundColor: `color-mix(in srgb, ${group.accent} 18%, transparent)`,
                          color: group.accent,
                          borderColor: `color-mix(in srgb, ${group.accent} 40%, transparent)`,
                          boxShadow: `0 12px 40px -20px ${group.accent}55`,
                        }
                      : {
                          backgroundColor: "rgba(255,255,255,0.04)",
                          color: "#9d97b5",
                          borderColor: "rgba(255,255,255,0.1)",
                        }
                  }
                >
                  <span className="hidden sm:inline">{group.title}</span>
                  <span className="sm:hidden">
                    {group.title.split(" ")[0]}
                    {group.title.includes("&") ? " & …" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active panel */}
        <div className="mt-6 min-h-[16rem]">
          <AnimatePresence mode="wait">
            <SkillPanel key={activeGroup.title} group={activeGroup} />
          </AnimatePresence>
        </div>

        {/* Compact overview strip — all domains at a glance */}
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            {skillGroups.map((group, i) => (
              <button
                key={`mini-${group.title}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`rounded-2xl bg-white/[0.03] px-4 py-3 text-left ring-1 transition-all duration-300 hover:bg-white/[0.06] ${
                  i === activeIndex ? "ring-white/20" : "ring-white/8"
                }`}
              >
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: group.accent }}
                />
                <div className="mt-3 font-display text-2xl font-bold text-white">
                  {group.skills.length}
                </div>
                <div className="mt-1 text-xs leading-snug text-muted">
                  {group.title}
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className={`flex flex-col gap-4 sm:flex-row ${compact ? "mt-8" : "mt-12"}`}
        >
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-1 items-center gap-4 rounded-2xl bg-card px-6 py-4 ring-1 ring-white/8"
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
              <div className="min-w-0">
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
