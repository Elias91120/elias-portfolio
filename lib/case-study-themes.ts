export type CaseStudyTheme = {
  bg: string;
  bgTo: string;
  fg: string;
  muted: string;
  accent: string;
  kickerColor: string;
  gold?: string;
  card: string;
  grain?: boolean;
};

export const caseStudyThemes: Record<string, CaseStudyTheme> = {
  "express-divorce": {
    bg: "#0a1628",
    bgTo: "#061018",
    fg: "#ece9f6",
    muted: "#8ba3be",
    accent: "#38bdf8",
    kickerColor: "#38bdf8",
    gold: "#d4a853",
    card: "#0f1f35",
    grain: false,
  },
  "nokia-dashboard": {
    bg: "#030f1d",
    bgTo: "#062037",
    fg: "#e8f4fc",
    muted: "#7a9bb5",
    accent: "#38bdf8",
    kickerColor: "#38bdf8",
    card: "#0a1a2e",
    grain: false,
  },
  "ai-travel-planner": {
    bg: "#1a1035",
    bgTo: "#2d1b4e",
    fg: "#f5f0ff",
    muted: "#b8a8d4",
    accent: "#fbbf24",
    kickerColor: "#fbbf24",
    card: "#241540",
    grain: false,
  },
  "green-jardin": {
    bg: "#0a1a0f",
    bgTo: "#061208",
    fg: "#ecfdf5",
    muted: "#86b89a",
    accent: "#22c55e",
    kickerColor: "#22c55e",
    card: "#0f2418",
    grain: false,
  },
};

export function getCaseStudyTheme(slug: string): CaseStudyTheme {
  return caseStudyThemes[slug] ?? caseStudyThemes["express-divorce"];
}
