import { projects, contact, skillGroups, type Project } from "@/lib/data";

export type TerminalAction =
  | { type: "scroll"; target: string; highlight?: string }
  | { type: "navigate"; href: string }
  | { type: "clear" }
  | { type: "close" };

export type TerminalState = {
  cwd: string;
};

export type TerminalResult = {
  output?: string;
  cwd?: string;
  action?: TerminalAction;
};

const HOME = "~";

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
  "cd",
  "pwd",
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

export function formatPrompt(cwd: string): string {
  return cwd === HOME
    ? "elias@portfolio:~$"
    : `elias@portfolio:${cwd}$`;
}

const WELCOME_TEXT = `Welcome to Developer Mode — a simulated shell to explore this portfolio.

Quick start:
  ls              see what's here
  cd projects     enter the projects folder
  cd two          open a project
  cat README.md   read project details
  open two        jump to it on the site

Type help for all commands. Nothing runs for real.`;

const WELCOME_BACK_TEXT = "Welcome back. Type help or ls to start.";

export function getWelcomeText(visited: boolean): string {
  return visited ? WELCOME_BACK_TEXT : WELCOME_TEXT;
}

const HELP_TEXT = `── Navigate ─────────────────────────────
  ls              List files and folders here
  cd <folder>     Move around (cd .. · cd ~ · cd projects/two)
  pwd             Show current folder

── Read ───────────────────────────────────
  cat README.md   Project info (when inside a project)
  cat nokia/dashboard.ts   Sample Nokia code snippet

── Portfolio ──────────────────────────────
  open <project>  Scroll to project on the site (e.g. open web-gen)
  whoami          Who is Elias
  skills          Tech stack by area
  contact         Email & LinkedIn

── Session ────────────────────────────────
  clear           Clear the screen
  exit            Close this terminal

Shortcuts: press \` (backtick) or Dev mode in the nav.`;

const WHOAMI_TEXT = `elias-elloumi
role:    full-stack · data engineering · AI agents
org:     Nokia (apprenticeship) + webgen (co-founder)
stack:   Next.js · FastAPI · Python · 3Geeks API · GSAP
status:  open to apprenticeship 2026–2028 (FR)
site:    https://elias-elloumi.com`;

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

const NOKIA_CURSOR_PORTAL = `# Cursor pour les nuls — Nokia internal portal

Internal portal accelerating Cursor adoption across teams:
knowledge base, RAG assistant, collaborative forum, hands-on demos.

Status: Internal · Tags: RAG, DevEx, AI adoption`;

const NOKIA_RAG_ASSISTANT = `# RAG Assistant — Nokia

Retrieval-augmented assistant wired into internal docs and onboarding flows.
Part of the Cursor adoption initiative at Nokia.

Status: Internal`;

function projectReadme(project: Project): string {
  const tags = project.tags.join(", ");
  const lines = [
    `# ${project.name}`,
    "",
    project.description,
    "",
    `Role:    ${project.role}`,
    `Status:  ${project.status}`,
    `Tags:    ${tags}`,
  ];
  if (project.link) lines.push(`Live:    ${project.link}`);
  if (project.caseStudy) lines.push(`Study:   ${project.caseStudy}`);
  return lines.join("\n");
}

function normalizePath(cwd: string, raw: string): string {
  const target = raw.trim().replace(/\/+$/, "") || ".";
  if (target === "~") return HOME;
  if (target === "." || target === "") return cwd;

  let segments: string[];
  if (target.startsWith("~/")) {
    segments = target.slice(2).split("/").filter(Boolean);
  } else if (target.startsWith("/")) {
    segments = target.slice(1).split("/").filter(Boolean);
  } else if (target.includes("/")) {
    const base = cwd === HOME ? [] : cwd.slice(2).split("/");
    segments = [...base, ...target.split("/").filter(Boolean)];
  } else {
    const base = cwd === HOME ? [] : cwd.slice(2).split("/");
    segments = [...base, target];
  }

  const stack: string[] = [];
  for (const seg of segments) {
    if (seg === "..") stack.pop();
    else if (seg !== ".") stack.push(seg);
  }

  return stack.length === 0 ? HOME : `~/${stack.join("/")}`;
}

function isValidPath(path: string): boolean {
  if (path === HOME) return true;
  if (path === "~/projects") return true;
  if (path === "~/nokia") return true;
  if (path === "~/nokia/cursor-portal") return true;
  if (path === "~/nokia/rag-assistant") return true;
  if (path.startsWith("~/projects/")) {
    const slug = path.slice("~/projects/".length);
    return findProjectBySlug(slug) !== undefined;
  }
  return false;
}

function resolveCd(cwd: string, target: string): { path: string } | { error: string; hint?: string } {
  if (!target || target === "~") return { path: HOME };

  let next = normalizePath(cwd, target);

  if (!isValidPath(next) && cwd === HOME) {
    const slug = target.replace(/\/$/, "");
    if (findProjectBySlug(slug)) {
      next = `~/projects/${slug}`;
    }
  }

  if (!isValidPath(next)) {
    const slug = target.replace(/\/$/, "");
    const hint =
      cwd === HOME && findProjectBySlug(slug)
        ? `try: cd projects/${slug}`
        : cwd === "~/projects"
          ? `try: cd ${slug}`
          : cwd === HOME
            ? "try: cd projects  or  cd nokia"
            : "try: cd ..  to go back";
    return { error: `cd: ${target}: No such folder`, hint };
  }

  return { path: next };
}

function listDir(cwd: string): string {
  if (cwd === HOME) {
    return "projects/    nokia/";
  }

  if (cwd === "~/projects") {
    const slugs = projects.map((p) => ({
      slug: getProjectSlug(p),
      internal: p.status === "Internal",
    }));
    const maxLen = Math.max(...slugs.map((s) => s.slug.length));
    return slugs
      .map(({ slug, internal }) => {
        const name = `${slug}/`.padEnd(maxLen + 1, " ");
        return internal ? `${name}(internal)` : name;
      })
      .join("\n");
  }

  if (cwd.startsWith("~/projects/")) {
    return "README.md";
  }

  if (cwd === "~/nokia") {
    return "dashboard.ts    cursor-portal/    rag-assistant/";
  }

  if (cwd === "~/nokia/cursor-portal" || cwd === "~/nokia/rag-assistant") {
    return "README.md";
  }

  return "";
}

function readFile(path: string): string | null {
  const normalized = path
    .replace(/\\/g, "/")
    .toLowerCase()
    .replace(/^~\/?/, "");

  if (normalized === "nokia/dashboard.ts" || normalized.endsWith("/dashboard.ts")) {
    return NOKIA_DASHBOARD_TS;
  }

  if (normalized === "nokia/cursor-portal/readme.md" || normalized.endsWith("cursor-portal/readme.md")) {
    return NOKIA_CURSOR_PORTAL;
  }

  if (normalized === "nokia/rag-assistant/readme.md" || normalized.endsWith("rag-assistant/readme.md")) {
    return NOKIA_RAG_ASSISTANT;
  }

  const projectFromPath = normalized.match(/(?:projects\/)?([^/]+)\/readme\.md$/);
  if (projectFromPath) {
    const project = findProjectBySlug(projectFromPath[1]);
    if (project) return projectReadme(project);
  }

  if (normalized === "readme.md") return null;

  const legacyMatch = normalized.match(/^projects\/(.+)\.md$/);
  if (legacyMatch) {
    const project = findProjectBySlug(legacyMatch[1]);
    if (project) return projectReadme(project);
  }

  return null;
}

function catFromCwd(cwd: string, file: string): TerminalResult {
  const fileLower = file.toLowerCase();

  if (fileLower === "readme.md") {
    if (cwd.startsWith("~/projects/")) {
      const slug = cwd.slice("~/projects/".length);
      const content = readFile(`projects/${slug}/README.md`);
      if (content) return { output: content };
    }
    if (cwd === "~/nokia/cursor-portal") return { output: NOKIA_CURSOR_PORTAL };
    if (cwd === "~/nokia/rag-assistant") return { output: NOKIA_RAG_ASSISTANT };
    return {
      output: "cat: README.md: not found here.\nHint: cd into a project first — e.g. cd projects/two",
    };
  }

  if (cwd === "~/nokia" && fileLower === "dashboard.ts") {
    return { output: NOKIA_DASHBOARD_TS };
  }

  const absolute = file.includes("/")
    ? normalizePath(HOME, file)
    : `${cwd}/${file}`;

  const content = readFile(absolute);
  if (content) return { output: content };

  return {
    output: `cat: ${file}: No such file.\nHint: ls to see what's here, or cat nokia/dashboard.ts`,
  };
}

function cdHints(cwd: string): string[] {
  if (cwd === HOME) return ["projects", "nokia", ...projects.map((p) => getProjectSlug(p))];
  if (cwd === "~/projects") return ["..", "~", ...projects.map((p) => getProjectSlug(p))];
  if (cwd.startsWith("~/projects/")) return ["..", "~/projects", "~"];
  if (cwd === "~/nokia") return ["..", "~", "cursor-portal", "rag-assistant"];
  if (cwd.startsWith("~/nokia/")) return ["..", "~/nokia", "~"];
  return ["..", "~"];
}

export function runCommand(input: string, state: TerminalState): TerminalResult {
  const trimmed = input.trim();
  if (!trimmed) return {};

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const argPath = args.join(" ");
  const { cwd } = state;

  switch (cmd) {
    case "help":
      return { output: HELP_TEXT };

    case "whoami":
      return { output: WHOAMI_TEXT };

    case "pwd":
      return { output: cwd };

    case "cd": {
      const result = resolveCd(cwd, argPath);
      if ("error" in result) {
        const lines = [result.error];
        if (result.hint) lines.push(`Hint: ${result.hint}`);
        return { output: lines.join("\n") };
      }
      return { output: "", cwd: result.path };
    }

    case "ls":
      return { output: listDir(cwd) };

    case "cat":
      if (!argPath) return { output: "usage: cat <file>   e.g. cat README.md" };
      return catFromCwd(cwd, argPath);

    case "open": {
      const slug = args[0]?.toLowerCase();
      if (!slug) return { output: "usage: open <project>   e.g. open web-gen" };
      const project = findProjectBySlug(slug);
      if (!project) {
        return {
          output: `open: unknown project "${slug}".\nHint: cd projects, then ls to see all names`,
        };
      }
      return {
        output: `Scrolling to ${project.name} on the site…`,
        action: { type: "scroll", target: "#projects", highlight: slug },
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
      return {
        output: `command not found: ${cmd}\nType help to see available commands.`,
      };
  }
}

export function getAutocomplete(
  input: string,
  state: TerminalState
): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [...KNOWN_COMMANDS];

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const { cwd } = state;

  if (parts.length === 1) {
    return KNOWN_COMMANDS.filter((c) => c.startsWith(cmd));
  }

  if (cmd === "cd" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    return cdHints(cwd).filter((d) => d.startsWith(partial));
  }

  if (cmd === "open" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    return projects
      .map((p) => getProjectSlug(p))
      .filter((s) => s.startsWith(partial));
  }

  if (cmd === "cat" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    const files = ["README.md", "nokia/dashboard.ts"];
    if (cwd === "~/nokia") files.unshift("dashboard.ts");
    return files.filter((f) => f.toLowerCase().startsWith(partial));
  }

  return [];
}
