"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prepareAssistantDisplay } from "@/lib/agent-actions";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="agent-message-p">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-[#e8e4f8] italic opacity-90">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent underline decoration-accent/40 underline-offset-[3px] transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="agent-message-list agent-message-list-ul">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="agent-message-list agent-message-list-ol">{children}</ol>
  ),
  li: ({ children }) => <li className="agent-message-li">{children}</li>,
  code: ({ children }) => (
    <code className="rounded-md bg-accent/10 px-1.5 py-0.5 font-mono text-[0.8125rem] text-accent ring-1 ring-accent/20">
      {children}
    </code>
  ),
  h1: ({ children }) => (
    <p className="agent-message-p font-display text-base font-semibold text-white">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p className="agent-message-p font-display text-[0.9375rem] font-semibold text-white">
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <p className="agent-message-p text-sm font-semibold text-white">{children}</p>
  ),
};

type AgentMessageContentProps = {
  content: string;
  variant?: "user" | "assistant";
  /** Show a blinking cursor while tokens are still arriving. */
  isStreaming?: boolean;
};

export function AgentTypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5" aria-hidden>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
    </span>
  );
}

export default function AgentMessageContent({
  content,
  variant = "assistant",
  isStreaming = false,
}: AgentMessageContentProps) {
  if (variant === "user") {
    return <span className="whitespace-pre-wrap leading-relaxed">{content}</span>;
  }

  const display = isStreaming ? content : prepareAssistantDisplay(content);
  if (!display && !isStreaming) return null;

  return (
    <div className="agent-message">
      {display ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {display}
        </ReactMarkdown>
      ) : null}
      {isStreaming && (
        <span
          className="agent-stream-cursor ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[1px] rounded-sm bg-accent align-middle"
          aria-hidden
        />
      )}
    </div>
  );
}
