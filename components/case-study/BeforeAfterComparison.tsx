export type BeforeAfterItem = {
  before: string;
  after: string;
};

type BeforeAfterComparisonProps = {
  items: BeforeAfterItem[];
};

export default function BeforeAfterComparison({
  items,
}: BeforeAfterComparisonProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div
        className="rounded-2xl p-5 ring-1 ring-white/10 sm:p-6"
        style={{ backgroundColor: "var(--cs-card)" }}
      >
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
          Before
        </h3>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.before}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--cs-muted)]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
              {item.before}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded-2xl p-5 ring-1 sm:p-6"
        style={{
          backgroundColor: "color-mix(in srgb, var(--cs-accent) 8%, var(--cs-card))",
          borderColor: "color-mix(in srgb, var(--cs-accent) 25%, transparent)",
        }}
      >
        <h3
          className="font-display text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--cs-accent)" }}
        >
          After
        </h3>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.after}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--cs-fg)]"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--cs-accent)" }}
              />
              {item.after}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
