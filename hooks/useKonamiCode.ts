"use client";

import { useEffect, useRef } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

export function useKonamiCode(
  onMatch: () => void,
  enabled = true
): void {
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[indexRef.current];
      if (e.code === expected) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI_SEQUENCE.length) {
          indexRef.current = 0;
          onMatch();
        }
      } else {
        indexRef.current = e.code === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onMatch, enabled]);
}
