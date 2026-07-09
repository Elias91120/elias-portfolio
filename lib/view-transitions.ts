import type { Project } from "@/lib/data";

/** Stable view-transition name for a project browser preview morph. */
export function projectPreviewName(slug: string): string {
  return `project-preview-${slug}`;
}

/** Explicit slug or derived from `/projects/{slug}` caseStudy path. */
export function getCaseStudySlug(project: Project): string | null {
  if (project.caseStudySlug) return project.caseStudySlug;
  if (!project.caseStudy) return null;
  const match = project.caseStudy.match(/\/projects\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

/** Whether the browser supports the View Transitions API (client-only). */
export function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") return false;
  return typeof document.startViewTransition === "function";
}
