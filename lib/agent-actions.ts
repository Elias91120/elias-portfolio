import {
  findProjectBySlug,
  getProjectSlug,
} from "@/lib/dev-terminal-commands";
import { projects } from "@/lib/data";
import { highlightProjectCard } from "@/lib/highlight-project";
import { prefersReducedMotion, scrollToSection } from "@/lib/scroll-to-section";

export type AgentAction =
  | { type: "scroll"; target: string; highlight?: string }
  | {
      type: "scroll_section";
      section: "story" | "projects" | "skills" | "contact" | "proof";
    };

/** Strict match — well-formed block from the prompt template. */
const AGENT_ACTIONS_PATTERN = /<!--\s*AGENT_ACTIONS\s*:\s*(\[[\s\S]*?\])\s*-->/i;

/** Lenient tail — models often omit `-->` or add stray `)`. */
const AGENT_ACTIONS_TAIL = /(?:<!--\s*)?AGENT_ACTIONS[\s\S]*$/i;

const AGENT_ACTIONS_JSON = /AGENT_ACTIONS\s*:\s*(\[[\s\S]*?\])/i;

const SCROLL_INTENT_PATTERN =
  /\b(show me|take me to|scroll to|where is|montre(?:-moi)?|va voir)\b/i;

const PROJECT_ALIASES: Record<string, string> = {
  nokia: "feature-analyzer",
  "feature analyzer": "feature-analyzer",
  "feature-analyzer": "feature-analyzer",
  dashboard: "feature-analyzer",
  webgen: "web-gen",
  "web-gen": "web-gen",
  "web gen": "web-gen",
  "cursor portal": "cursor-portal",
  "cursor pour les nuls": "cursor-portal",
  promptoptim: "promptoptim",
  "prompt optim": "promptoptim",
  "express divorce": "express-divorce-usa",
  "travel planner": "ai-travel-planner",
};

const SECTION_HASH: Record<
  Extract<AgentAction, { type: "scroll_section" }>["section"],
  string
> = {
  story: "#story",
  projects: "#projects",
  skills: "#skills",
  contact: "#contact",
  proof: "#proof",
};

const SECTION_KEYWORDS: Record<string, AgentAction> = {
  story: { type: "scroll_section", section: "story" },
  projects: { type: "scroll_section", section: "projects" },
  skills: { type: "scroll_section", section: "skills" },
  contact: { type: "scroll_section", section: "contact" },
  stats: { type: "scroll_section", section: "proof" },
  proof: { type: "scroll_section", section: "proof" },
};

export function resolveProjectSlug(query: string): string | null {
  const normalized = query.toLowerCase().trim();

  for (const [alias, slug] of Object.entries(PROJECT_ALIASES)) {
    if (normalized.includes(alias)) return slug;
  }

  for (const project of projects) {
    const slug = getProjectSlug(project);
    const nameLower = project.name.toLowerCase();
    if (normalized.includes(slug) || normalized.includes(nameLower)) {
      return slug;
    }
    const spaced = slug.replace(/-/g, " ");
    if (normalized.includes(spaced)) return slug;
  }

  return null;
}

function parseEmbeddedActions(text: string): AgentAction[] | null {
  const match =
    text.match(AGENT_ACTIONS_PATTERN) ?? text.match(AGENT_ACTIONS_JSON);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]) as AgentAction[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Remove invisible navigation metadata — tolerant of malformed model output. */
export function stripAgentActionsComment(text: string): string {
  return text
    .replace(AGENT_ACTIONS_TAIL, "")
    .replace(AGENT_ACTIONS_PATTERN, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

/** Text safe to render or read aloud in the UI. */
export function prepareAssistantDisplay(text: string): string {
  return stripAgentActionsComment(text);
}

export function parseAgentActions(
  userMessage: string,
  assistantText?: string
): AgentAction[] {
  if (assistantText) {
    const embedded = parseEmbeddedActions(assistantText);
    if (embedded?.length) return embedded;
  }

  const msg = userMessage.toLowerCase();
  const hasScrollIntent =
    SCROLL_INTENT_PATTERN.test(msg) ||
    /\b(nokia|feature analyzer|dashboard|web-?gen|cursor portal|promptoptim|express divorce|travel planner)\b/i.test(
      msg
    );

  if (hasScrollIntent) {
    const slug = resolveProjectSlug(msg);
    if (slug) {
      return [{ type: "scroll", target: "#projects", highlight: slug }];
    }
  }

  for (const [keyword, action] of Object.entries(SECTION_KEYWORDS)) {
    if (msg.includes(keyword)) {
      return [action];
    }
  }

  return [];
}

export function applyAgentAction(
  action: AgentAction,
  onAnnounce?: (message: string) => void
): void {
  const reduced = prefersReducedMotion();
  const behavior = reduced ? "auto" : "smooth";

  if (action.type === "scroll_section") {
    scrollToSection(SECTION_HASH[action.section], behavior);
    return;
  }

  if (action.type === "scroll") {
    scrollToSection(action.target, behavior);
    if (action.highlight) {
      const project = findProjectBySlug(action.highlight);
      if (project && onAnnounce) {
        onAnnounce(`Scrolling to ${project.name}`);
      }
      window.setTimeout(
        () => highlightProjectCard(action.highlight!),
        reduced ? 100 : 400
      );
    }
  }
}

export function applyAgentActions(
  actions: AgentAction[],
  onAnnounce?: (message: string) => void
): void {
  for (const action of actions) {
    applyAgentAction(action, onAnnounce);
  }
}
