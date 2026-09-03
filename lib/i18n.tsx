"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "en" | "fr";

/** A string that exists in both languages. */
export type L = { en: string; fr: string };

/** Resolve a localized value (or a plain string) for the active locale. */
export function pick(value: L | string, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

const STORAGE_KEY = "ee-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (value: L | string) => string;
};

const LocaleContext = createContext<Ctx>({
  locale: "en",
  setLocale: () => {},
  t: (v) => pick(v, "en"),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Always start on "en" so server and client markup match; the stored or
  // browser preference is applied right after hydration.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      setLocaleState(stored);
      return;
    }
    if (navigator.language?.toLowerCase().startsWith("fr")) setLocaleState("fr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // Private mode / storage disabled — the choice just won't persist.
    }
  }, []);

  const t = useCallback((value: L | string) => pick(value, locale), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
