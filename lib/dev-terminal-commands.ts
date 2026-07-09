import { projects, contact, skillGroups, type Project } from "@/lib/data";

export type TerminalAction =
  | { type: "scroll"; target: string; highlight?: string }
  | { type: "navigate"; href: string }
  | { type: "clear" }
  | { type: "close" };

export type TerminalResult =
  | { output: string }
  | { output: string; action: TerminalAction }
  | { action: TerminalAction };

const SLUG_OVERRIDES: Record<string, string> = {
  "Feature Analyzer Dashboard 2.0": "feature-analyzer",
  "Cursor pour les nuls": "cursor-portal",
  PromptOptim: "promptoptim",
  CallKitchen: "callkitchen",
};

export function getProjectSlug(project: Project): string {
  if (project.caseStudySlug) return project.caseStudySlug;
  if (SLUG_OVERRIDES[project.name]) return SLUG_OVERRIDES[project.name];
  return project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => getProjectSlug(p) === slug);
}

export const KNOWN_COMMANDS = [
  "help",
  "whoami",
  "ls",
  "cat",
  "open",
  "skills",
  "contact",
  "clear",
  "exit",
  "quit",
  "vim",
  "sudo",
] as const;

const WHOAMI_TEXT = `elias-elloumi
role:    full-stack · data engineering · AI agents
org:     Nokia (apprenticeship) + webgen (co-founder)
stack:   Next.js · FastAPI · Python · Mistral · GSAP
status:  open to apprenticeship 2026–2028 (FR)
site:    https://elias-elloumi.com`;

const HELP_TEXT = `Available commands:
  help                        — show this message
  whoami                      — identity & stack
  ls [projects/|nokia/]       — list directories
  cat <path>                  — read file (e.g. nokia/dashboard.ts)
  open <slug>                 — scroll to project card
  skills                      — top skills by group
  contact                     — email & LinkedIn
  clear                       — clear screen
  exit | quit                 — close terminal

Shortcuts: press \` (backtick) or click Dev mode in the nav.`;

const NOKIA_DASHBOARD_TS = `// Feature Analyzer Dashboard 2.0 — Nokia
// Illustrative reconstruction — not the actual Nokia repo.
// collect → analyze → correlate → report
import { aggregateSources } from "@/pipeline/ingest";

const SOURCES = [
  "jira", "gitlab", "confluence", "powerbi",
  "telemetry", "feature-flags", "customer-feedback",
] as const;

export async function buildDashboardSnapshot(featureId: string) {
  const raw = await aggregateSources(SOURCES, { featureId });
  return {
    featureId,
    healthScore: correlate(raw),
    refreshedAt: new Date().toISOString(),
  };
}`;

function padSlug(slug: string, maxLen: number): string {
  return `${slug}/`.padEnd(maxLen + 1, " ");
}

function lsProjects(): string {
  const slugs = projects.map((p) => ({
    slug: getProjectSlug(p),
    internal: p.status === "Internal",
  }));
  const maxLen = Math.max(...slugs.map((s) => s.slug.length));
  return slugs
    .map(({ slug, internal }) => {
      const line = padSlug(slug, maxLen);
      return internal ? `${line}(internal)` : line;
    })
    .join("\n");
}

function lsNokia(): string {
  return `dashboard.ts\n  cursor-portal/\n  rag-assistant/`;
}

function catProject(slug: string): string {
  const project = findProjectBySlug(slug);
  if (!project) {
    return `cat: projects/${slug}.md: No such file`;
  }
  const tags = project.tags.join(", ");
  return `# ${project.name}

${project.description}

**Role:** ${project.role}
**Status:** ${project.status}
**Tags:** ${tags}`;
}

export function runCommand(input: string): TerminalResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: "" };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const argPath = args.join(" ");

  switch (cmd) {
    case "help":
      return { output: HELP_TEXT };

    case "whoami":
      return { output: WHOAMI_TEXT };

    case "ls": {
      const target = argPath.replace(/\/$/, "").toLowerCase();
      if (!target || target === "projects") return { output: lsProjects() };
      if (target === "nokia") return { output: lsNokia() };
      return { output: `ls: ${argPath}: No such directory` };
    }

    case "cat": {
      const path = argPath.toLowerCase();
      if (path === "nokia/dashboard.ts") return { output: NOKIA_DASHBOARD_TS };
      const projectMatch = path.match(/^projects\/(.+)\.md$/);
      if (projectMatch) return { output: catProject(projectMatch[1]) };
      return { output: `cat: ${argPath}: No such file` };
    }

    case "open": {
      const slug = args[0]?.toLowerCase();
      if (!slug) return { output: "usage: open <slug>" };
      const project = findProjectBySlug(slug);
      if (!project) return { output: `open: project not found: ${slug}` };
      return {
        output: `Scrolling to ${project.name}…`,
        action: {
          type: "scroll",
          target: "#projects",
          highlight: slug,
        },
      };
    }

    case "skills": {
      const lines = skillGroups.map((g) => {
        const top = g.skills.slice(0, 4).join(" · ");
        return `${g.title}\n  ${top}`;
      });
      return { output: lines.join("\n\n") };
    }

    case "contact":
      return {
        output: `email:    ${contact.email}\nlinkedin: ${contact.linkedin}\nlocation: ${contact.location}`,
      };

    case "clear":
      return { action: { type: "clear" } };

    case "exit":
    case "quit":
      return { action: { type: "close" } };

    case "vim":
    case "sudo":
      return {
        output: "nice try — this terminal ships products, not sudo privileges.",
      };

    default:
      return { output: `command not found: ${cmd}. Type help.` };
  }
}

export function getAutocomplete(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [...KNOWN_COMMANDS];

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();

  if (parts.length === 1) {
    return KNOWN_COMMANDS.filter((c) => c.startsWith(cmd));
  }

  if (cmd === "open" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    return projects
      .map((p) => getProjectSlug(p))
      .filter((s) => s.startsWith(partial));
  }

  if (cmd === "cat" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    const paths = [
      "nokia/dashboard.ts",
      ...projects.map((p) => `projects/${getProjectSlug(p)}.md`),
    ];
    return paths.filter((p) => p.startsWith(partial));
  }

  if (cmd === "ls" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    const dirs = ["projects/", "nokia/"];
    return dirs.filter((d) => d.startsWith(partial));
  }

  return [];
}
