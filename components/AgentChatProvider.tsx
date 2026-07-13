"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyAgentActions,
  parseAgentActions,
  prepareAssistantDisplay,
  type AgentAction,
} from "@/lib/agent-actions";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type AgentChatContextValue = {
  messages: ChatMessage[];
  busy: boolean;
  panelOpen: boolean;
  hasUnread: boolean;
  lastActions: AgentAction[];
  ask: (question: string, options?: { fromVoice?: boolean }) => Promise<void>;
  setPanelOpen: (open: boolean) => void;
  openPanel: () => void;
  consumeVoiceFlag: () => boolean;
};

const AgentChatContext = createContext<AgentChatContextValue | null>(null);

const SESSION_PANEL_KEY = "ask-panel-open";

export function AgentChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [panelOpen, setPanelOpenState] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastActions, setLastActions] = useState<AgentAction[]>([]);
  const lastVoiceRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem(SESSION_PANEL_KEY);
      if (stored === "1") setPanelOpenState(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setPanelOpen = useCallback(
    (open: boolean) => {
      setPanelOpenState(open);
      if (open) setHasUnread(false);
      try {
        if (open) {
          sessionStorage.setItem(SESSION_PANEL_KEY, "1");
        } else {
          sessionStorage.removeItem(SESSION_PANEL_KEY);
        }
      } catch {
        /* ignore */
      }
    },
    []
  );

  const openPanel = useCallback(() => setPanelOpen(true), [setPanelOpen]);

  useEffect(() => {
    if (panelOpen) {
      document.body.setAttribute("data-ask-open", "");
    } else {
      document.body.removeAttribute("data-ask-open");
    }
    return () => document.body.removeAttribute("data-ask-open");
  }, [panelOpen]);

  const ask = useCallback(
    async (question: string, options?: { fromVoice?: boolean }) => {
      const text = question.trim();
      if (!text || busy) return;

      if (options?.fromVoice) {
        lastVoiceRef.current = true;
      }

      setBusy(true);

      const history: ChatMessage[] = [
        ...messages,
        { role: "user", content: text },
      ];
      setMessages([...history, { role: "assistant", content: "" }]);

      const userActions = parseAgentActions(text);
      if (userActions.length > 0) {
        setLastActions(userActions);
        applyAgentActions(userActions);
      }

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
          const display = prepareAssistantDisplay(answer);
          setMessages([...history, { role: "assistant", content: display }]);
        }

        const assistantActions = parseAgentActions(text, answer);
        const actionsToApply =
          assistantActions.length > 0 && userActions.length === 0
            ? assistantActions
            : userActions.length > 0
              ? userActions
              : assistantActions;

        if (actionsToApply.length > 0) {
          setLastActions(actionsToApply);
          if (userActions.length === 0) {
            applyAgentActions(actionsToApply);
          }
        }

        const finalDisplay = prepareAssistantDisplay(answer);
        setMessages([
          ...history,
          { role: "assistant", content: finalDisplay },
        ]);

        if (!panelOpen) {
          setHasUnread(true);
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
        if (!panelOpen) setHasUnread(true);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, panelOpen]
  );

  const consumeVoiceFlag = useCallback(() => {
    const was = lastVoiceRef.current;
    lastVoiceRef.current = false;
    return was;
  }, []);

  const value = useMemo(
    () => ({
      messages,
      busy,
      panelOpen,
      hasUnread,
      lastActions,
      ask,
      setPanelOpen,
      openPanel,
      consumeVoiceFlag,
    }),
    [
      messages,
      busy,
      panelOpen,
      hasUnread,
      lastActions,
      ask,
      setPanelOpen,
      openPanel,
      consumeVoiceFlag,
    ]
  );

  return (
    <AgentChatContext.Provider value={value}>
      {children}
    </AgentChatContext.Provider>
  );
}

export function useAgentChat() {
  const ctx = useContext(AgentChatContext);
  if (!ctx) {
    throw new Error("useAgentChat must be used within AgentChatProvider");
  }
  return ctx;
}
