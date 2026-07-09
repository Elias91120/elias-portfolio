"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  persistVisitorMode,
  resolveInitialVisitorMode,
  syncUrlWithMode,
  type VisitorMode,
} from "@/lib/visitor-mode";

type VisitorModeContextValue = {
  mode: VisitorMode | null;
  setMode: (mode: VisitorMode) => void;
  hydrated: boolean;
};

const VisitorModeContext = createContext<VisitorModeContextValue | null>(null);

export function VisitorModeProvider({
  children,
  initialMode = null,
}: {
  children: ReactNode;
  initialMode?: VisitorMode | null;
}) {
  const [mode, setModeState] = useState<VisitorMode | null>(initialMode);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setModeState(resolveInitialVisitorMode());
    setHydrated(true);
  }, []);

  const setMode = useCallback((next: VisitorMode) => {
    setModeState(next);
    persistVisitorMode(next);
    syncUrlWithMode(next);
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, hydrated }),
    [mode, setMode, hydrated]
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
