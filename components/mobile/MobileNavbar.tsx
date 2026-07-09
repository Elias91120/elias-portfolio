"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";
import type { VisitorMode } from "@/lib/visitor-mode";

const browsingLinks = [
  { href: "#story", label: "Story" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const hiringLinks = [
  { href: "#proof", label: "Proof" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
  { href: "#story", label: "Story" },
];

function getLinks(mode: VisitorMode | null) {
  return mode === "hiring" ? hiringLinks : browsingLinks;
}

export default function MobileNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { mode, setMode, hydrated } = useVisitorMode();
  const links = getLinks(hydrated ? mode : null);
  const behavior = prefersReducedMotion() ? "auto" : "smooth";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    scrollToSection(href, behavior);
  };

  const toggleMode = () => {
    setOpen(false);
    if (mode === "hiring") {
      setMode("browsing");
      requestAnimationFrame(() => scrollToSection("#story", behavior));
    } else {
      setMode("hiring");
      requestAnimationFrame(() => scrollToSection("#proof", behavior));
    }
  };

  return (
    <>
      <header
        className={`site-nav fixed top-0 inset-x-0 z-50 ${
          scrolled || open
            ? "bg-[#08060f]/85 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="group flex min-w-0 items-center gap-2 font-display text-base font-semibold text-white"
          >
            <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/story/avatar-hero.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span>
              elias<span className="text-accent">.</span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white ring-1 ring-white/10 transition-colors hover:bg-white/5"
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-x-0 top-14 z-50 border-b border-white/10 bg-[#08060f]/95 px-5 pb-6 pt-4 backdrop-blur-xl"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(l.href);
                      }}
                      className="flex min-h-11 items-center rounded-xl px-4 text-base font-medium text-white transition-colors hover:bg-white/5"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>

              {hydrated && mode !== null && (
                <button
                  type="button"
                  onClick={toggleMode}
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-white/5 px-4 text-sm font-medium uppercase tracking-wider text-muted ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {mode === "hiring" ? "Switch to browsing" : "Switch to hiring"}
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
