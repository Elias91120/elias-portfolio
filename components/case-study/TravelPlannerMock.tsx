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
