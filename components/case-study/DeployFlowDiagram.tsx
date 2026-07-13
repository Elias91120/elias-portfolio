const steps = [
  { label: "Git push", detail: "Dockerfile + health check → main" },
  { label: "Coolify", detail: "Build, env vars, deploy" },
  { label: "Traefik", detail: "Reverse proxy · TLS :443" },
  { label: "CF Tunnel", detail: "Ingress → private origin" },
  { label: "Live", detail: "https://*.3geeks.fr" },
];

export default function DeployFlowDiagram() {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[40rem] items-stretch gap-2 sm:gap-3">
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
