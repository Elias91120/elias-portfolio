"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { prefersReducedMotion } from "@/lib/scroll-to-section";

export type TerminalSource = "nav" | "keyboard" | "avatar" | "konami" | "url";

type DeveloperModeContextValue = {
  isOpen: boolean;
  openTerminal: (source: TerminalSource) => void;
  closeTerminal: () => void;
  lastSource: TerminalSource | null;
  showKonamiToast: boolean;
};

const DeveloperModeContext = createContext<DeveloperModeContextValue | null>(
  null
);

const SESSION_VISITED_KEY = "dev-mode-visited";

export function hasVisitedDevMode(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_VISITED_KEY) === "1";
}

export function markDevModeVisited(): void {
  sessionStorage.setItem(SESSION_VISITED_KEY, "1");
}

function cleanDevUrlParam(): void {
  const url = new URL(window.location.href);
  const hadDev = url.searchParams.has("dev");
  const hadModeDev = url.searchParams.get("mode") === "dev";
  if (!hadDev && !hadModeDev) return;

  url.searchParams.delete("dev");
  if (hadModeDev) url.searchParams.delete("mode");

  const search = url.searchParams.toString();
  const next = url.pathname + (search ? `?${search}` : "") + url.hash;
  window.history.replaceState({}, "", next);
}

function shouldOpenFromUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has("dev") || params.get("mode") === "dev";
}

export function DeveloperModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSource, setLastSource] = useState<TerminalSource | null>(null);
  const [showKonamiToast, setShowKonamiToast] = useState(false);
  const pendingUrlOpen = useRef(false);

  useLayoutEffect(() => {
    if (shouldOpenFromUrl()) {
      pendingUrlOpen.current = true;
    }
  }, []);

  const openTerminal = useCallback((source: TerminalSource) => {
    if (isOpen) return;
    setLastSource(source);
    setIsOpen(true);
    if (source === "url") cleanDevUrlParam();
  }, [isOpen]);

  const closeTerminal = useCallback(() => {
    setIsOpen(false);
    setLastSource(null);
  }, []);

  useEffect(() => {
    if (pendingUrlOpen.current || shouldOpenFromUrl()) {
      pendingUrlOpen.current = false;
      openTerminal("url");
    }
  }, [openTerminal]);

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.setAttribute("data-dev-terminal", "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("data-dev-terminal");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.removeAttribute("data-dev-terminal");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKonami = useCallback(() => {
    if (isOpen) return;
    openTerminal("konami");
    setShowKonamiToast(true);
    const reduced = prefersReducedMotion();
    if (!reduced) {
      window.setTimeout(() => setShowKonamiToast(false), 3000);
    } else {
      window.setTimeout(() => setShowKonamiToast(false), 1500);
    }
  }, [isOpen, openTerminal]);

  useKonamiCode(handleKonami, !isOpen);

  useEffect(() => {
    if (isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "`" && e.code !== "Backquote") return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      openTerminal("keyboard");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, openTerminal]);

  const value = useMemo(
    () => ({
      isOpen,
      openTerminal,
      closeTerminal,
      lastSource,
      showKonamiToast,
    }),
    [isOpen, openTerminal, closeTerminal, lastSource, showKonamiToast]
  );

  return (
    <DeveloperModeContext.Provider value={value}>
      {children}
      <KonamiToast visible={showKonamiToast} />
    </DeveloperModeContext.Provider>
  );
}

function KonamiToast({ visible }: { visible: boolean }) {
  const reduced = prefersReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-full bg-card px-5 py-2.5 text-sm text-foreground ring-1 ring-accent/40 shadow-lg"
        >
          Developer mode unlocked
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useDeveloperMode() {
  const ctx = useContext(DeveloperModeContext);
  if (!ctx) {
    throw new Error(
      "useDeveloperMode must be used within DeveloperModeProvider"
    );
  }
  return ctx;
}

export { highlightProjectCard } from "@/lib/highlight-project";
