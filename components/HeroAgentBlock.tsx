"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AgentMessageContent, {
  AgentTypingIndicator,
} from "@/components/AgentMessageContent";
import { useAgentChat } from "@/components/AgentChatProvider";
import { findProjectBySlug } from "@/lib/dev-terminal-commands";
import { prepareAssistantDisplay } from "@/lib/agent-actions";
import { prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;

const suggestions = [
  "Show me the Nokia dashboard project",
  "What is 3geeks?",
  "Is Elias available for an apprenticeship?",
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

function detectSpeechLang(): string {
  if (typeof navigator === "undefined") return "en-US";
  const lang = navigator.language?.toLowerCase() ?? "en";
  return lang.startsWith("fr") ? "fr-FR" : "en-US";
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const prefix = lang.startsWith("fr") ? "fr" : "en";
  return (
    voices.find((v) => v.lang.startsWith(prefix) && v.localService) ??
    voices.find((v) => v.lang.startsWith(prefix)) ??
    voices[0] ??
    null
  );
}

export default function HeroAgentBlock({ ready = true }: { ready?: boolean }) {
  const { ask, busy, streaming, messages, openPanel, lastActions, consumeVoiceFlag } =
    useAgentChat();
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceSubmitRef = useRef(false);
  const reducedMotion = prefersReducedMotion();
  const [showMic, setShowMic] = useState(false);

  useEffect(() => {
    setShowMic(!!getSpeechRecognition() && !isIOSSafari());
  }, []);

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const hasConversation = messages.length > 0;
  const showInlineResponse =
    hasConversation && (lastAssistant?.content || busy);

  useEffect(() => {
    if (lastActions.length === 0) return;
    const scrollAction = lastActions.find(
      (a) => a.type === "scroll" && a.highlight
    );
    if (scrollAction?.type === "scroll" && scrollAction.highlight) {
      const project = findProjectBySlug(scrollAction.highlight);
      if (project) {
        setAnnouncement(`Scrolling to ${project.name}`);
      }
    }
  }, [lastActions]);

  useEffect(() => {
    if (busy || !lastAssistant?.content) return;
    if (!consumeVoiceFlag()) return;

    const lang = detectSpeechLang();
    const utterance = new SpeechSynthesisUtterance(
      prepareAssistantDisplay(lastAssistant.content),
    );
    utterance.lang = lang;
    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [busy, lastAssistant?.content, consumeVoiceFlag]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
    utteranceRef.current = null;
  }, []);

  const startRecording = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = detectSpeechLang();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = (event) => {
      setRecording(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicDenied(true);
        window.setTimeout(() => setMicDenied(false), 4000);
      }
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) return;
      setInput(transcript);
      voiceSubmitRef.current = true;
      void ask(transcript, { fromVoice: true });
      setInput("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setRecording(false);
    }
  }, [ask]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, []);

  const handleSubmit = useCallback(
    (text?: string) => {
      const question = (text ?? input).trim();
      if (!question || busy) return;
      setInput("");
      const fromVoice = voiceSubmitRef.current;
      voiceSubmitRef.current = false;
      (document.activeElement as HTMLElement | null)?.blur();
      void ask(question, fromVoice ? { fromVoice: true } : undefined);
    },
    [ask, busy, input]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay: ready ? 0.66 : 0, duration: 0.6, ease }}
      role="region"
      aria-label="Portfolio AI assistant"
      className="relative z-10 mt-6 w-full max-w-md"
    >
      <div className="rounded-2xl bg-card/40 backdrop-blur-sm p-3.5 ring-1 ring-white/8">
        <div className="flex items-center gap-2.5">
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
            <Image
              src="/story/avatar-hero.jpg"
              alt=""
              fill
              sizes="1.75rem"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <h2 className="font-display text-xs font-medium text-white/90">
              Ask me anything about my work
            </h2>
            <p className="flex items-center gap-1 text-[0.65rem] text-muted/80">
              <span className="h-1 w-1 rounded-full bg-emerald-400/80" />
              AI agent · 3Geeks
            </p>
          </div>
          {speaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="shrink-0 rounded-full bg-white/6 px-2 py-0.5 text-[0.6rem] font-medium text-accent/80 ring-1 ring-white/10 transition-colors hover:bg-white/10"
              aria-label="Stop reading response"
            >
              Stop
            </button>
          )}
        </div>

        <form
          className="mt-3 flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Elias…"
            maxLength={500}
            disabled={busy}
            className="min-h-9 min-w-0 flex-1 rounded-full bg-white/4 px-3.5 py-2 text-sm text-white placeholder:text-muted/60 ring-1 ring-white/8 outline-none transition-all focus:ring-accent/30 disabled:opacity-60"
          />
          {showMic && (
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={busy}
              aria-label="Ask with your voice"
              title={
                isIOSSafari()
                  ? "Voice search works best on Chrome desktop"
                  : "Ask with your voice"
              }
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-default ${
                recording && !reducedMotion
                  ? "bg-red-500/15 text-red-400 ring-red-400/40 animate-pulse"
                  : "bg-white/4 text-muted/80 ring-white/8 hover:bg-white/8 hover:text-white hover:ring-white/15"
              }`}
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/90 text-[#0c0a16] transition-all hover:bg-accent disabled:opacity-40 cursor-pointer disabled:cursor-default"
            aria-label="Send"
          >
            <svg
              className="h-3.5 w-3.5"
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

        {!showInlineResponse && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSubmit(s)}
                disabled={busy}
                className="rounded-full bg-white/4 px-2.5 py-1.5 text-left text-[0.7rem] leading-snug text-muted/90 ring-1 ring-white/8 transition-colors hover:bg-white/8 hover:text-white/90 hover:ring-white/15 disabled:opacity-50 cursor-pointer disabled:cursor-default"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showInlineResponse && (
          <div className="mt-2.5 overflow-hidden rounded-xl bg-white/3 px-3 py-2.5 ring-1 ring-white/6">
            {busy && !lastAssistant?.content ? (
              <AgentTypingIndicator />
            ) : (
              <div className="line-clamp-3 text-left text-xs leading-relaxed text-white/85 [&_.agent-message-p]:text-xs [&_.agent-message-p]:leading-relaxed">
                <AgentMessageContent
                  content={lastAssistant?.content ?? ""}
                  isStreaming={streaming && !!lastAssistant?.content}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {hasConversation && !busy && (
        <button
          type="button"
          onClick={openPanel}
          className="mx-auto mt-2 block text-[0.65rem] text-muted/70 underline-offset-2 transition-colors hover:text-accent hover:underline"
        >
          View full conversation
        </button>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {micDenied && (
        <p
          role="status"
          className="mt-2 text-center text-xs text-muted"
        >
          Microphone access denied — type your question instead
        </p>
      )}
    </motion.div>
  );
}
