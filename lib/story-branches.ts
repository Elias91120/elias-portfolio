export type StoryChoice = {
  id: string;
  label: string;
  /** Chapter IDs (`Chapter.id`) to follow after this choice */
  nextChapterIds: string[];
  /** Direct skip target chapter ID (optional) */
  skipToChapterId?: string;
};

export type StoryBranchPoint = {
  /** Chapter where the choice appears (after reading / end of scrub) */
  atChapterId: string;
  /** Local scroll threshold 0–1 within this chapter to reveal choices */
  revealAtProgress?: number;
  prompt?: string;
  choices: StoryChoice[];
};

export const DEFAULT_CHAPTER_ORDER: string[] = [
  "beginning",
  "first-code",
  "sti2d",
  "ece",
  "nokia",
  "3geeks",
  "future",
];

export const STORY_BRANCH_POINTS: StoryBranchPoint[] = [
  {
    atChapterId: "beginning",
    revealAtProgress: 0.85,
    prompt: "How do you want to explore?",
    choices: [
      { id: "full", label: "Read it all", nextChapterIds: [] },
      {
        id: "skip-to-shipping",
        label: "Skip to where I ship in prod",
        nextChapterIds: ["ece", "nokia", "3geeks", "future"],
        skipToChapterId: "ece",
      },
    ],
  },
  {
    atChapterId: "ece",
    revealAtProgress: 0.8,
    prompt: "Two paths opened at once — which first?",
    choices: [
      {
        id: "nokia-first",
        label: "The Nokia chapter",
        nextChapterIds: ["nokia", "3geeks", "future"],
      },
      {
        id: "3geeks-first",
        label: "Tell me about 3geeks first",
        nextChapterIds: ["3geeks", "nokia", "future"],
      },
    ],
  },
];

export const STORY_PATH_STORAGE_KEY = "story-path-v1";

/** Default linear choice per branch (used for Esc / reduced-motion fallback) */
export const DEFAULT_CHOICE_BY_BRANCH: Record<string, string> = {
  beginning: "full",
  ece: "nokia-first",
};

export function getBranchPointForChapter(
  chapterId: string
): StoryBranchPoint | undefined {
  return STORY_BRANCH_POINTS.find((bp) => bp.atChapterId === chapterId);
}

export function getDefaultChoiceForBranch(
  branch: StoryBranchPoint
): StoryChoice {
  const defaultId = DEFAULT_CHOICE_BY_BRANCH[branch.atChapterId];
  return (
    branch.choices.find((c) => c.id === defaultId) ?? branch.choices[0]
  );
}

/**
 * Resolves the final chapter ID sequence from accumulated choices.
 * Applies branch points in chronological order (by DEFAULT_CHAPTER_ORDER).
 * Skip path shortens to 5 chapters; full path keeps all 7.
 */
export function resolveStoryPath(
  choicesMade: Record<string, string>
): string[] {
  let path = [...DEFAULT_CHAPTER_ORDER];

  const sortedBranchPoints = [...STORY_BRANCH_POINTS].sort(
    (a, b) =>
      DEFAULT_CHAPTER_ORDER.indexOf(a.atChapterId) -
      DEFAULT_CHAPTER_ORDER.indexOf(b.atChapterId)
  );

  for (const bp of sortedBranchPoints) {
    const choiceId = choicesMade[bp.atChapterId];
    if (!choiceId) continue;

    const choice = bp.choices.find((c) => c.id === choiceId);
    if (!choice || choice.nextChapterIds.length === 0) continue;

    const atIndex = path.indexOf(bp.atChapterId);
    if (atIndex === -1) continue;

    path = [...path.slice(0, atIndex + 1), ...choice.nextChapterIds];
  }

  return path;
}

export function loadStoryPathWithDefaults(): Record<string, string> {
  return { ...DEFAULT_CHOICE_BY_BRANCH, ...loadStoryPath() };
}

export function loadStoryPath(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORY_PATH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveStoryPath(choices: Record<string, string>): void {
  sessionStorage.setItem(STORY_PATH_STORAGE_KEY, JSON.stringify(choices));
}

export function clearStoryPath(): void {
  sessionStorage.removeItem(STORY_PATH_STORAGE_KEY);
}
