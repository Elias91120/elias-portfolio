"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import AgentMessageContent, {
  AgentTypingIndicator,
} from "@/components/AgentMessageContent";
import { useAgentChat } from "@/components/AgentChatProvider";
import { prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;

const suggestions = [
  "What did Elias build at Nokia?",
  "Tell me about webgen",
  "Est-il disponible en alternance ?",
];

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
  return isIOS && isSafari;
}

export default function AskWidget() {
  const {
    messages,
    busy,
    ask,
    panelOpen,
    setPanelOpen,
    hasUnread,
  } = useAgentChat();
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);
  const showMic =
    typeof window !== "undefined" &&
    !!getSpeechRecognition() &&
    !isIOSSafari();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [messages, busy, reducedMotion]);

  useEffect(() => {
    if (!panelOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.body.hasAttribute("data-dev-terminal")) return;
      e.preventDefault();
      setPanelOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen, setPanelOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      <motion.button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="ask-widget fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full bg-[#181230] px-4 py-3 text-sm font-medium text-white ring-1 ring-accent/40 shadow-[0_8px_40px_-8px_rgba(167,139,250,0.45)] transition-all duration-300 hover:ring-accent/70 hover:shadow-[0_8px_48px_-6px_rgba(167,139,250,0.6)] cursor-pointer"
        aria-label={
          panelOpen
            ? "Close the portfolio assistant"
            : "Ask my portfolio — AI assistant"
        }
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
        {hasUnread && !panelOpen && (
          <span
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent ring-2 ring-[#181230]"
            aria-hidden
          />
        )}
      </motion.button>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease }}
            className="ask-widget fixed bottom-20 right-5 z-[70] flex max-h-[min(34rem,calc(100svh-7rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl bg-[#120e20]/95 backdrop-blur-xl ring-1 ring-white/12 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)]"
            role="dialog"
            aria-label="Portfolio AI assistant"
          >
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
                onClick={() => setPanelOpen(false)}
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

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
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
                        onClick={() => {
                          setInput("");
                          void ask(s);
                        }}
                        className="rounded-full bg-white/5 px-3 py-1.5 text-left text-xs text-[#cfcae3] ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white hover:ring-white/25 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const isTyping =
                  busy && i === messages.length - 1 && !m.content;

                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? "justify-end" : "justify-start gap-2.5"}`}
                  >
                    {!isUser && (
                      <span className="relative mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/30">
                        <Image
                          src="/story/avatar-hero.jpg"
                          alt=""
                          fill
                          sizes="1.75rem"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                        isUser
                          ? "agent-bubble-user rounded-br-md text-white ring-1 ring-accent/30"
                          : "agent-bubble-assistant rounded-bl-md text-[#d4d0e8] ring-1 ring-white/10"
                      }`}
                    >
                      {isTyping ? (
                        <AgentTypingIndicator />
                      ) : (
                        <AgentMessageContent
                          content={m.content}
                          variant={isUser ? "user" : "assistant"}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = input.trim();
                if (!text || busy) return;
                setInput("");
                void ask(text);
              }}
              className="flex items-center gap-2 border-t border-white/8 bg-white/[0.02] px-4 py-3.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Elias…"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-muted/70 ring-1 ring-white/10 outline-none transition-all focus:ring-accent/40"
              />
              {showMic && (
                <button
                  type="button"
                  onClick={() => {
                    const Ctor = getSpeechRecognition();
                    if (!Ctor) return;
                    const recognition = new Ctor();
                    recognition.lang =
                      navigator.language?.startsWith("fr") ? "fr-FR" : "en-US";
                    recognition.onresult = (event) => {
                      const transcript =
                        event.results[0]?.[0]?.transcript?.trim();
                      if (transcript) {
                        setInput(transcript);
                        void ask(transcript, { fromVoice: true });
                        setInput("");
                      }
                    };
                    recognition.start();
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
                  aria-label="Ask with your voice"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </button>
              )}
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
    </>,
    document.body,
  );
}
