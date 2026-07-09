export function TravelBriefMock() {
  return (
    <div className="space-y-4 p-5">
      <label className="block text-xs font-medium uppercase tracking-wider text-[var(--cs-muted)]">
        Trip brief
      </label>
      <div
        className="rounded-xl p-4 text-sm leading-relaxed text-[var(--cs-fg)] ring-1 ring-white/10"
        style={{ backgroundColor: "color-mix(in srgb, var(--cs-bg) 60%, transparent)" }}
      >
        &ldquo;5 days in Lisbon with my partner — food markets, sunset viewpoints, no tourist traps.
        Budget-friendly, walkable neighborhoods.&rdquo;
      </div>
      <div className="flex flex-wrap gap-2">
        {["Gemini", "Intent-based", "Day-by-day"].map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-xs ring-1 ring-white/10"
            style={{ color: "var(--cs-accent)" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TravelItineraryMock() {
  const days = [
    { day: "Day 1", title: "Alfama & riverfront", items: ["Pastéis de Belém", "Miradouro da Senhora do Monte"] },
    { day: "Day 2", title: "Markets & LX Factory", items: ["Time Out Market", "Sunset at Ponte 25 de Abril"] },
    { day: "Day 3", title: "Coastal escape", items: ["Cascais day trip", "Seafood dinner in Cais do Sodré"] },
  ];

  return (
    <div className="space-y-3 p-5">
      {days.map((d) => (
        <div
          key={d.day}
          className="rounded-xl p-4 ring-1 ring-white/10"
          style={{ backgroundColor: "color-mix(in srgb, var(--cs-bg) 50%, transparent)" }}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-accent)]">
              {d.day}
            </span>
            <span className="font-display text-sm font-semibold text-white">{d.title}</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-[var(--cs-muted)]">
            {d.items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--cs-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function NokiaDashboardMock() {
  return (
    <div className="space-y-3 p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-white">
          Feature Analyzer
        </span>
        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[0.65rem] text-emerald-300 ring-1 ring-emerald-400/30">
          Live
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Sources", "Analyses", "Reports"].map((label, i) => (
          <div
            key={label}
            className="rounded-lg p-3 ring-1 ring-white/8"
            style={{ backgroundColor: "color-mix(in srgb, var(--cs-bg) 70%, transparent)" }}
          >
            <div className="text-[0.6rem] uppercase tracking-wider text-[var(--cs-muted)]">
              {label}
            </div>
            <div className="mt-1 font-display text-lg font-bold text-[var(--cs-accent)]">
              {i === 0 ? "7" : i === 1 ? "24" : "12"}
            </div>
          </div>
        ))}
      </div>
      <div
        className="h-16 rounded-lg ring-1 ring-white/8"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--cs-accent) 30%, transparent) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
