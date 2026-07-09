"use client";

import { motion } from "framer-motion";
import { contact } from "@/lib/data";
import Magnetic from "@/components/Magnetic";
import { useVisitorMode } from "@/components/VisitorModeProvider";

export default function Contact({ compact = false }: { compact?: boolean }) {
  const { mode, hydrated } = useVisitorMode();
  const isHiring = hydrated && mode === "hiring";
  const showCv = isHiring && Boolean(contact.cvPath);
  const showCal = isHiring && Boolean(contact.calUrl);

  return (
    <section
      id="contact"
      className={`relative px-5 overflow-hidden ${compact ? "py-16" : "py-28"}`}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[46rem] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Actively seeking apprenticeship — 2026–2028
        </span>

        <h2
          className={`font-display mt-6 font-bold tracking-tight text-white leading-[1.08] ${
            compact ? "text-3xl" : "text-4xl sm:text-6xl"
          }`}
        >
          Let&apos;s write the
          {!compact && (
            <>
              <br />
            </>
          )}{" "}
          <span className="font-serif italic font-semibold text-[#f5f0e4]">
            next chapter
          </span>{" "}
          together
        </h2>

        <p
          className={`mt-6 text-muted leading-relaxed max-w-xl mx-auto ${
            compact ? "text-sm" : "text-lg"
          }`}
        >
          {compact ? (
            <>
              Alternance 2026–2028 — M.Sc. Data Engineering &amp; AI at EFREI
              Paris.{" "}
              <span className="text-foreground">Open to apprenticeship.</span>
            </>
          ) : (
            <>
              Starting September 2026: M.Sc. Data Engineering &amp; AI at EFREI
              Paris — data infrastructure, structural AI, and cloud governance
              (RNCP level 7).{" "}
              <span className="text-foreground">
                Apprenticeship is my priority
              </span>{" "}
              for 2026–2028. I&apos;m also open to freelance missions through
              webgen or on Fiverr.
            </>
          )}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Magnetic>
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 font-medium text-[#0c0a16] transition-transform duration-300 hover:scale-[1.03]"
          >
            <svg
              className="h-4.5 w-4.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="m2 7 10 7L22 7" />
            </svg>
            {compact ? "Email" : contact.email}
          </a>
          </Magnetic>
          <Magnetic>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-white/5 px-7 py-3.5 font-medium text-white ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-white/30"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
            LinkedIn
          </a>
          </Magnetic>
        </div>

        {(showCv || showCal) && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {showCv && (
              <Magnetic>
                <a
                  href={contact.cvPath}
                  download={contact.cvPath?.endsWith(".pdf") ? true : undefined}
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white/5 px-7 py-3.5 font-medium text-white ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-white/30"
                >
                  <svg
                    className="h-4.5 w-4.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {contact.cvDownloadLabel ?? "Download CV"}
                </a>
              </Magnetic>
            )}
            {showCal && (
              <Magnetic>
                <a
                  href={contact.calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-accent/15 px-7 py-3.5 font-medium text-accent ring-1 ring-accent/30 transition-all duration-300 hover:bg-accent/25 hover:ring-accent/50"
                >
                  <svg
                    className="h-4.5 w-4.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book 15 min
                </a>
              </Magnetic>
            )}
          </div>
        )}

        {compact ? (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-center text-sm text-muted hover:text-white">
              Plus d&apos;infos
            </summary>
            <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                {contact.location}
              </span>
              <span>{contact.languages}</span>
              <a
                href={contact.studio}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {contact.studioLabel}
              </a>
              <a
                href={contact.fiverr}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {contact.fiverrLabel}
              </a>
            </div>
          </details>
        ) : (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {contact.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="M22 22l-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
            {contact.languages}
          </span>
          <a
            href={contact.studio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {contact.studioLabel}
          </a>
          <a
            href={contact.fiverr}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            {contact.fiverrLabel}
          </a>
        </div>
        )}
      </motion.div>
    </section>
  );
}
