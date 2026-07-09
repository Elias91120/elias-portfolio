export type VisitorMode = "hiring" | "browsing";

export const STORAGE_KEY = "visitor-mode";

export function readVisitorModeFromUrl(): VisitorMode | null {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get("mode");
  if (param === "hiring" || param === "browsing") return param;
  return null;
}

export function getStoredVisitorMode(): VisitorMode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "hiring" || stored === "browsing") return stored;
  } catch {
    /* sessionStorage unavailable */
  }
  return null;
}

export function persistVisitorMode(mode: VisitorMode): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* sessionStorage unavailable */
  }
}

export function syncUrlWithMode(mode: VisitorMode): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("mode", mode);
  window.history.replaceState(null, "", url.toString());
}

export function parseVisitorMode(
  param: string | undefined | null
): VisitorMode | null {
  if (param === "hiring" || param === "browsing") return param;
  return null;
}

export function resolveInitialVisitorMode(): VisitorMode | null {
  return readVisitorModeFromUrl() ?? getStoredVisitorMode();
}
