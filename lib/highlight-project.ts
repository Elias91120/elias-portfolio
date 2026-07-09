const DEFAULT_DURATION_MS = 2500;

export function highlightProjectCard(
  slug: string,
  durationMs = DEFAULT_DURATION_MS
): void {
  const el = document.querySelector(`[data-project-slug="${slug}"]`);
  if (!el) return;
  el.classList.add("agent-highlight", "dev-terminal-highlight");
  window.setTimeout(() => {
    el.classList.remove("agent-highlight", "dev-terminal-highlight");
  }, durationMs);
}
