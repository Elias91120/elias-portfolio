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

/** The home page exists at "/" (English) and "/fr" (French). */
const pathFor = (l: Locale) => (l === "fr" ? "/fr" : "/");

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

/**
 * `initial` is the language the server renders, so "/" and "/fr" are each
 * indexable in their own language. On "/", a visitor's stored or browser
 * preference for French still switches the page after hydration.
 */
export function LocaleProvider({
  children,
  initial = "en",
}: {
  children: React.ReactNode;
  initial?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  useEffect(() => {
    // The URL already says French: nothing to detect.
    if (initial === "fr") return;
    let preferred: string | null = null;
    try {
      preferred = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage blocked: fall back to the browser language.
    }
    if (preferred !== "fr" && preferred !== "en") {
      preferred = navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
    }
    if (preferred === "fr") {
      // Applied after hydration on purpose, so server and client markup match.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState("fr");
      window.history.replaceState(null, "", pathFor("fr") + window.location.hash);
    }
  }, [initial]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    // Keep the address in step with the language, so a shared link opens in it.
    window.history.replaceState(null, "", pathFor(l) + window.location.hash);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // Private mode / storage disabled: the choice just won't persist.
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
