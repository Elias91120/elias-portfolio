"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  persistVisitorMode,
  syncUrlWithMode,
  type VisitorMode,
} from "@/lib/visitor-mode";

type VisitorModeContextValue = {
  mode: VisitorMode;
  setMode: (mode: VisitorMode) => void;
  hydrated: boolean;
};

const VisitorModeContext = createContext<VisitorModeContextValue | null>(null);

export function VisitorModeProvider({
  children,
}: {
  children: ReactNode;
  initialMode?: VisitorMode | null;
}) {
  const setMode = useCallback((next: VisitorMode) => {
    persistVisitorMode(next);
    syncUrlWithMode(next);
  }, []);

  const value = useMemo(
    () => ({ mode: "browsing" as const, setMode, hydrated: true }),
    [setMode]
  );

  return (
    <VisitorModeContext.Provider value={value}>
      {children}
    </VisitorModeContext.Provider>
  );
}

export function useVisitorMode() {
  const ctx = useContext(VisitorModeContext);
  if (!ctx) {
    throw new Error("useVisitorMode must be used within VisitorModeProvider");
  }
  return ctx;
}
