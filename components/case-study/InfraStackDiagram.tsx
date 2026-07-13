const layers = [
  { label: "Mac Mini + OrbStack", detail: "On-prem prod VM" },
  { label: "Coolify", detail: "8+ apps · PostgreSQL · deploys" },
  { label: "Traefik", detail: "Routing · TLS termination" },
  { label: "Cloudflare", detail: "Tunnel · DNS · edge proxy" },
];

export default function InfraStackDiagram() {
  return (
    <div className="mt-8 space-y-3">
      {layers.map((layer, i) => (
        <div key={layer.label} className="flex items-stretch gap-3">
          <div
            className="flex flex-1 flex-col rounded-2xl px-5 py-4 ring-1 ring-white/10 sm:px-6 sm:py-5"
            style={{
              backgroundColor: "var(--cs-card)",
              marginLeft: `${i * 0.75}rem`,
            }}
          >
            <span
              className="font-display text-sm font-semibold sm:text-base"
              style={{ color: "var(--cs-accent)" }}
            >
              {layer.label}
            </span>
            <span className="mt-1 text-xs leading-relaxed text-[var(--cs-muted)] sm:text-sm">
              {layer.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
