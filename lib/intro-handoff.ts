const INTRO_HANDOFF_KEY = "intro-handoff";

export function markIntroHandoff(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INTRO_HANDOFF_KEY, "1");
}

export function consumeIntroHandoff(): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(INTRO_HANDOFF_KEY) !== "1") return false;
  sessionStorage.removeItem(INTRO_HANDOFF_KEY);
  return true;
}
