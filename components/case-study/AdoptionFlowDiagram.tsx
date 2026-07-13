const steps = [
  { label: "Knowledge hub", detail: "Docs, APIs & internal tools" },
  { label: "RAG assistant", detail: "100+ questions answered" },
  { label: "Team demos", detail: "4 teams onboarded" },
  { label: "1:1 coaching", detail: "Use-case unblock & brainstorm" },
];

export default function AdoptionFlowDiagram() {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[32rem] items-stretch gap-2 sm:gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div
              className="flex flex-1 flex-col rounded-2xl p-4 ring-1 ring-white/10 sm:p-5"
              style={{ backgroundColor: "var(--cs-card)" }}
            >
              <span className="font-display text-sm font-semibold text-white sm:text-base">
                {step.label}
              </span>
              <span className="mt-1 text-xs leading-relaxed text-[var(--cs-muted)] sm:text-sm">
                {step.detail}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className="shrink-0 text-lg text-[var(--cs-accent)]"
                aria-hidden
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
