"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useDeveloperMode,
  hasVisitedDevMode,
  markDevModeVisited,
  highlightProjectCard,
} from "@/components/DeveloperModeProvider";
import {
  runCommand,
  getAutocomplete,
  type TerminalAction,
} from "@/lib/dev-terminal-commands";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;
const PROMPT = "elias@portfolio:~$";
const MAX_HISTORY = 20;

type HistoryLine = {
  type: "output" | "command" | "banner";
  text: string;
};

function getWelcomeBanner(): string {
  if (hasVisitedDevMode()) {
    return "Welcome back. Type help.";
  }
  return `Welcome to Developer Mode.
Type help for commands — or try the classics:
  whoami, ls projects/, cat nokia/dashboard.ts
This is a simulated shell. Nothing executes for real.`;
}

function highlightOutput(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i} className="block whitespace-pre-wrap">
      {colorizeLine(line)}
      {i < lines.length - 1 ? "\n" : null}
    </span>
  ));
}

function colorizeLine(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  if (remaining.startsWith("//")) {
    return [<span key={0} className="text-muted">{remaining}</span>];
  }

  const patterns: { regex: RegExp; className: string }[] = [
    { regex: /^(import|export|const|async|function|return|from|as)\b/, className: "text-sky-400" },
    { regex: /^"[^"]*"/, className: "text-emerald-400" },
    { regex: /^'[^']*'/, className: "text-emerald-400" },
    { regex: /^`[^`]*`/, className: "text-emerald-400" },
    { regex: /^#[^\s]+/, className: "text-muted" },
    { regex: /^\*\*[^*]+\*\*/, className: "text-foreground font-medium" },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { regex, className } of patterns) {
      const m = remaining.match(regex);
      if (m) {
        parts.push(
          <span key={key++} className={className}>
            {m[0]}
          </span>
        );
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const nextSpace = remaining.search(/\s|"/);
      const chunk =
        nextSpace === -1 ? remaining : remaining.slice(0, nextSpace === 0 ? 1 : nextSpace);
      parts.push(<span key={key++}>{chunk}</span>);
      remaining = remaining.slice(chunk.length);
    }
  }

  return parts.length > 0 ? parts : [line];
}

function applyAction(action: TerminalAction, closeTerminal: () => void): void {
  switch (action.type) {
    case "clear":
      return;
    case "close":
      closeTerminal();
      return;
    case "scroll": {
      closeTerminal();
      requestAnimationFrame(() => {
        scrollToSection(
          action.target,
          prefersReducedMotion() ? "auto" : "smooth"
        );
        if (action.highlight) {
          window.setTimeout(
            () => highlightProjectCard(action.highlight!),
            prefersReducedMotion() ? 100 : 400
          );
        }
      });
      return;
    }
    case "navigate": {
      closeTerminal();
      window.setTimeout(() => {
        window.location.href = action.href;
      }, 150);
      return;
    }
  }
}

export default function DevTerminal() {
  const { isOpen, closeTerminal, lastSource } = useDeveloperMode();
  const [lines, setLines] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  const appendOutput = useCallback((text: string) => {
    if (!text) return;
    setLines((prev) => [...prev, { type: "output", text }]);
  }, []);

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      setLines((prev) => [...prev, { type: "command", text: trimmed }]);
      setHistory((prev) => {
        const next = [...prev.filter((c) => c !== trimmed), trimmed];
        return next.slice(-MAX_HISTORY);
      });
      setHistoryIndex(-1);

      const result = runCommand(trimmed);

      if ("action" in result && result.action?.type === "clear") {
        setLines([]);
        return;
      }

      if ("output" in result && result.output) {
        appendOutput(result.output);
      }

      if ("action" in result && result.action && result.action.type !== "clear") {
        applyAction(result.action, closeTerminal);
      }
    },
    [appendOutput, closeTerminal]
  );

  useEffect(() => {
    if (!isOpen) return;

    const banner = getWelcomeBanner();
    const initial: HistoryLine[] = [{ type: "banner", text: banner }];

    if (lastSource === "avatar") {
      initial.push({
        type: "output",
        text: "// unlocked via avatar handshake",
      });
    }

    setLines(initial);
    setInput("");
    setHistoryIndex(-1);
    markDevModeVisited();

    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen, lastSource]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [lines, reduced]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeTerminal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeTerminal]);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, input, [href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    dialog.addEventListener("keydown", trap);
    return () => dialog.removeEventListener("keydown", trap);
  }, [isOpen]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = input;
      setInput("");
      executeCommand(cmd);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const matches = getAutocomplete(input);
      if (matches.length === 1) {
        const parts = input.trim().split(/\s+/);
        if (parts.length <= 1) {
          setInput(matches[0] + " ");
        } else {
          setInput(`${parts[0]} ${matches[0]} `);
        }
      } else if (matches.length > 1) {
        appendOutput(matches.join("  "));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          role="presentation"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dev-terminal-title"
            initial={
              reduced
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 24, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            transition={{ duration: reduced ? 0 : 0.3, ease }}
            className="relative z-10 flex w-full sm:max-w-3xl flex-col overflow-hidden rounded-t-2xl sm:rounded-xl bg-[#0a0814] ring-1 ring-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.55)] min-h-[min(32rem,80svh)] sm:min-h-0 sm:h-[min(32rem,80svh)]"
          >
            {/* Title bar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="hidden sm:flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </span>
                <p
                  id="dev-terminal-title"
                  className="truncate font-mono text-xs text-muted"
                >
                  elias@portfolio — zsh — 80×24
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-[0.65rem] text-muted sm:inline">
                  esc to close
                </span>
                <button
                  type="button"
                  onClick={closeTerminal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/8 hover:text-white"
                  aria-label="Close developer terminal"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Output */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 font-mono text-sm leading-relaxed text-foreground"
            >
              {lines.map((line, i) => (
                <div key={i} className="mb-1">
                  {line.type === "command" ? (
                    <div>
                      <span className="text-accent">{PROMPT} </span>
                      <span>{line.text}</span>
                    </div>
                  ) : (
                    <div className="text-foreground/90">
                      {highlightOutput(line.text)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/8 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-base sm:text-sm">
                <span className="shrink-0 text-accent">{PROMPT}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="min-w-0 flex-1 bg-transparent text-base sm:text-sm text-foreground outline-none placeholder:text-muted/50"
                  aria-label="Terminal command input"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
