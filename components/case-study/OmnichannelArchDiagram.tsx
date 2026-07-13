const nodes = [
  {
    label: "Shopify storefront",
    detail: "Public catalogue · green-jardin.fr",
    role: "public",
  },
  {
    label: "Firebase RTDB",
    detail: "Live menu · cart overlays · TV sync",
    role: "hub",
  },
  {
    label: "Staff POS",
    detail: "Gram sales · loyalty · SumUp / cash",
    role: "ops",
  },
  {
    label: "Shopify Admin API",
    detail: "GraphQL price compare & push",
    role: "bridge",
  },
];

const roleAccent: Record<string, string> = {
  public: "var(--cs-accent)",
  hub: "#fbbf24",
  ops: "#38bdf8",
  bridge: "#c084fc",
};

export default function OmnichannelArchDiagram() {
  return (
    <div className="mt-8 space-y-4">
      <div className="overflow-x-auto">
        <div className="flex min-w-[36rem] items-stretch gap-2 sm:gap-3">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex flex-1 items-center gap-2 sm:gap-3">
              <div
                className="flex flex-1 flex-col rounded-2xl p-4 ring-1 ring-white/10 sm:p-5"
                style={{ backgroundColor: "var(--cs-card)" }}
              >
                <span
                  className="font-display text-sm font-semibold text-white sm:text-base"
                  style={{ color: roleAccent[node.role] }}
                >
                  {node.label}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-[var(--cs-muted)] sm:text-sm">
                  {node.detail}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <span
                  className="shrink-0 text-lg text-[var(--cs-accent)]"
                  aria-hidden
                >
                  ↔
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs leading-relaxed text-[var(--cs-muted)] sm:text-sm">
        Firestore handles loyalty wallets &amp; atomic checkout transactions.
        The TV embed on the public site reads the same RTDB stream — no second
        catalogue to maintain.
      </p>
    </div>
  );
}
