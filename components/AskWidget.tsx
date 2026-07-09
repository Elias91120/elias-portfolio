"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type ChatMessage = { role: "user" | "assistant"; content: string };

const suggestions = [
  "What did Elias build at Nokia?",
  "Tell me about webgen",
  "Est-il disponible en alternance ?",
];

export default function AskWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  useEffect(() => {
    if (open) {
      document.body.setAttribute("data-ask-open", "");
    } else {
      document.body.removeAttribute("data-ask-open");
    }
    return () => document.body.removeAttribute("data-ask-open");
  }, [open]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);

    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error ?? "The assistant is unavailable.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
    } catch (err) {
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            err instanceof Error && err.message !== "Failed to fetch"
              ? err.message
              : "Sorry — I couldn't reach the assistant. You can always email Elias directly.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="ask-widget fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#181230] px-4 py-3 text-sm font-medium text-white ring-1 ring-accent/40 shadow-[0_8px_40px_-8px_rgba(167,139,250,0.45)] transition-all duration-300 hover:ring-accent/70 hover:shadow-[0_8px_48px_-6px_rgba(167,139,250,0.6)] cursor-pointer"
        aria-label={open ? "Close the portfolio assistant" : "Ask my portfolio — AI assistant"}
      >
        <svg
          className="h-4.5 w-4.5 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
          <circle cx="12" cy="12" r="4" />
        </svg>
        Ask my portfolio
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="ask-widget fixed bottom-20 right-5 z-50 flex max-h-[min(34rem,calc(100svh-7rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl bg-[#120e20] ring-1 ring-white/12 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)]"
            role="dialog"
            aria-label="Portfolio AI assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.03] px-5 py-4">
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-accent/40">
                <Image
                  src="/story/avatar-hero.jpg"
                  alt=""
                  fill
                  sizes="2.25rem"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0">
                <div className="font-display text-sm font-semibold text-white">
                  Ask my portfolio
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI agent, built by Elias
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto rounded-full p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted">
                    Hi! I&apos;m the AI assistant of this portfolio — ask me
                    anything about Elias, his projects, or his story.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="rounded-full bg-white/5 px-3 py-1.5 text-left text-xs text-[#cfcae3] ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white hover:ring-white/25 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent/15 text-white ring-1 ring-accent/25"
                        : "bg-white/5 text-[#d4d0e8] ring-1 ring-white/8"
                    }`}
                  >
                    {m.content ||
                      (busy && i === messages.length - 1 ? (
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
                        </span>
                      ) : (
                        ""
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-white/8 px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Elias…"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-muted/70 ring-1 ring-white/10 outline-none transition-all focus:ring-accent/40"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[#0c0a16] transition-all hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 cursor-pointer disabled:cursor-default"
                aria-label="Send"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 14 0M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
