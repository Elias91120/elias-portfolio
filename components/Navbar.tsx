"use client";

import { useEffect, useState } from "react";
import { useDeveloperMode } from "@/components/DeveloperModeProvider";
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openTerminal } = useDeveloperMode();
  const { mode, setMode, hydrated } = useVisitorMode();
  const links = getLinks(hydrated ? mode : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const behavior = prefersReducedMotion() ? "auto" : "smooth";

  const toggleMode = () => {
    if (mode === "hiring") {
      setMode("browsing");
      requestAnimationFrame(() => scrollToSection("#story", behavior));
    } else {
      setMode("hiring");
      requestAnimationFrame(() => scrollToSection("#proof", behavior));
    }
  };

  return (
    <header
      className={`site-nav fixed top-0 inset-x-0 z-50 overflow-hidden ${
        scrolled
          ? "bg-[#08060f]/70 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
        <a
          href="#top"
          className="group flex min-w-0 shrink-0 items-center gap-2 font-display text-base font-semibold leading-none tracking-tight text-white sm:gap-2.5 sm:text-lg"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/40 transition-transform duration-300 group-hover:scale-105">
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
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    const target = document.querySelector(l.href);
                    if (target) {
                      e.preventDefault();
                      scrollToSection(l.href, behavior);
                    }
                  }}
                  className="px-2 sm:px-2.5 py-2 text-xs sm:text-sm text-muted hover:text-white transition-colors rounded-full hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openTerminal("nav")}
            className="ml-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.65rem] font-medium text-muted ring-1 ring-accent/30 transition-colors hover:bg-accent/10 hover:text-accent sm:px-3 sm:text-xs"
            aria-label="Open developer terminal"
          >
            <span aria-hidden className="font-mono text-accent/90">
              &gt;_
            </span>
            <span className="hidden sm:inline">Dev</span>
          </button>
          {hydrated && mode !== null && (
            <button
              type="button"
              onClick={toggleMode}
              className="ml-0.5 inline-flex shrink-0 rounded-full px-2 py-1.5 text-[0.6rem] font-medium uppercase tracking-wider text-muted ring-1 ring-white/10 transition-colors hover:bg-white/5 hover:text-white sm:px-2.5 sm:text-[0.65rem]"
            >
              {mode === "hiring" ? "Browsing?" : "Hiring?"}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
