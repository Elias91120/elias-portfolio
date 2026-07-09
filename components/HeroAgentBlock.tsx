"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AgentMessageContent, {
  AgentTypingIndicator,
} from "@/components/AgentMessageContent";
import { useAgentChat } from "@/components/AgentChatProvider";
import { findProjectBySlug } from "@/lib/dev-terminal-commands";
import { prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;

const suggestions = [
  "Show me the Nokia dashboard project",
  "What is webgen and Web-Gen?",
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
  const { ask, busy, messages, openPanel, lastActions, consumeVoiceFlag } =
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
  const speechSupported = typeof window !== "undefined" && !!getSpeechRecognition();
  const showMic = speechSupported && !isIOSSafari();

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
    const utterance = new SpeechSynthesisUtterance(lastAssistant.content);
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
      className="relative z-10 mt-8 w-full max-w-lg"
    >
      <div className="rounded-3xl bg-card/80 backdrop-blur-md p-5 ring-1 ring-accent/30 shadow-[0_16px_48px_-20px_rgba(167,139,250,0.35)]">
        <div className="flex items-center gap-3">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/40">
            <Image
              src="/story/avatar-hero.jpg"
              alt=""
              fill
              sizes="2.25rem"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 text-left">
            <h2 className="font-display text-sm font-semibold text-white">
              Ask me anything about my work
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI agent · built by Elias · powered by Mistral
            </p>
          </div>
          {speaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="ml-auto shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[0.65rem] font-medium text-accent ring-1 ring-accent/30 transition-colors hover:bg-white/12"
              aria-label="Stop reading response"
            >
              Stop
            </button>
          )}
        </div>

        <form
          className="mt-4 flex items-center gap-2"
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
            className="min-h-11 min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-muted/70 ring-1 ring-white/10 outline-none transition-all focus:ring-accent/40 disabled:opacity-60"
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
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-default ${
                recording && !reducedMotion
                  ? "bg-red-500/20 text-red-400 ring-red-400/50 animate-pulse"
                  : "bg-white/5 text-muted ring-white/10 hover:bg-white/10 hover:text-white hover:ring-white/25"
              }`}
            >
              <svg
                className="h-4.5 w-4.5"
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-[#0c0a16] transition-all hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 cursor-pointer disabled:cursor-default"
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

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSubmit(s)}
              disabled={busy}
              className="min-h-11 rounded-full bg-white/5 px-3 py-2 text-left text-xs text-[#cfcae3] ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white hover:ring-white/25 disabled:opacity-50 cursor-pointer disabled:cursor-default"
            >
              {s}
            </button>
          ))}
        </div>

        {showInlineResponse && (
          <div className="agent-bubble-assistant mt-4 rounded-2xl px-4 py-3.5 ring-1 ring-white/10">
            {busy && !lastAssistant?.content ? (
              <AgentTypingIndicator />
            ) : (
              <div className="line-clamp-6">
                <AgentMessageContent content={lastAssistant?.content ?? ""} />
              </div>
            )}
            {hasConversation && !busy && (
              <button
                type="button"
                onClick={openPanel}
                className="mt-3 text-xs font-medium text-accent underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                View full conversation
              </button>
            )}
          </div>
        )}
      </div>

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
