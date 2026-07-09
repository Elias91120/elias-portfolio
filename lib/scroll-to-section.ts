export function scrollToSection(
  hash: string,
  behavior: ScrollBehavior = "smooth"
): void {
  const target = document.querySelector(hash);
  if (!target) return;
  const spacer = target.closest(".pin-spacer") ?? target;
  window.scrollTo({
    top: spacer.getBoundingClientRect().top + window.scrollY,
    behavior,
  });
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
