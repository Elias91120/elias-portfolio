"use client";

/**
 * Kept in its own module so AskWidget can show it without importing the
 * markdown renderer — react-markdown and its remark/micromark stack are ~45 KB
 * gzipped and are only needed once an actual answer arrives.
 */
export function AgentTypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5" aria-hidden>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
    </span>
  );
}
