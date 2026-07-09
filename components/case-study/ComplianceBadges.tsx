const badges = [
  {
    label: "Data encryption",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: "State-aware workflows",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "Privacy-first design",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function ComplianceBadges() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm ring-1 ring-white/10"
          style={{
            backgroundColor: "color-mix(in srgb, var(--cs-card) 80%, transparent)",
            color: "var(--cs-fg)",
          }}
        >
          <span style={{ color: "var(--cs-gold)" }}>{badge.icon}</span>
          {badge.label}
        </div>
      ))}
    </div>
  );
}
