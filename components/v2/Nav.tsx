"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav } from "@/lib/content";
import { useLocale, type Locale } from "@/lib/i18n";

export function LocaleSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {(["en", "fr"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 md:min-h-[34px] md:min-w-[38px] ${
            locale === l
              ? "bg-white/90 text-[#0b0913]"
              : "text-muted hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Nav() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape and lock the page while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open
          ? "border-b border-white/[0.07] bg-[#08060f]/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4 md:px-12 md:py-6">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="flex min-h-[44px] items-center font-display text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition-opacity duration-300 hover:opacity-70"
        >
          Elias<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex lg:gap-12">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex min-h-[44px] items-center text-sm font-medium uppercase tracking-[0.14em] text-[#D7E2EA] transition-opacity duration-300 hover:opacity-60 lg:text-[0.95rem]"
              >
                {t(item.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitch />

          <a
            href="#contact"
            className="hidden min-h-[44px] items-center rounded-full border border-white/20 px-4 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors duration-300 hover:border-white/45 hover:bg-white/[0.06] lg:inline-flex"
          >
            {t({ en: "Contact", fr: "Contact" })}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={
              open
                ? t({ en: "Close menu", fr: "Fermer le menu" })
                : t({ en: "Open menu", fr: "Ouvrir le menu" })
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition-colors duration-300 hover:bg-white/[0.06] lg:hidden"
          >
            <span className="relative block h-[10px] w-[18px]">
              <span
                className={`absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ${
                  open ? "top-[4px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ${
                  open ? "top-[4px] -rotate-45" : "top-[8px]"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col px-5 pb-4 sm:px-8">
              {nav.map((item) => (
                <li key={item.id} className="border-t border-white/[0.07]">
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[52px] items-center text-sm font-medium uppercase tracking-[0.16em] text-[#D7E2EA]"
                  >
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
