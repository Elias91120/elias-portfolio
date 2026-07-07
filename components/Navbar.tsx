"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#story", label: "Story" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-nav fixed top-0 inset-x-0 z-50 ${
        scrolled
          ? "bg-[#08060f]/70 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-white"
        >
          <span className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-accent/40 transition-transform duration-300 group-hover:scale-110">
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
        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  const target = document.querySelector(l.href);
                  if (target) {
                    e.preventDefault();
                    // When the section is pinned by GSAP, scroll to its
                    // pin-spacer so we land at the start of the story.
                    const spacer = target.closest(".pin-spacer") ?? target;
                    window.scrollTo({
                      top:
                        spacer.getBoundingClientRect().top + window.scrollY,
                      behavior: "smooth",
                    });
                  }
                }}
                className="px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm text-muted hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
