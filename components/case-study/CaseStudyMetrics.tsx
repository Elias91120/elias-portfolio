type Metric = {
  value: string;
  label: string;
};

type CaseStudyMetricsProps = {
  metrics: Metric[];
};

export default function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex flex-col rounded-2xl p-4 ring-1 ring-white/10 sm:p-5"
          style={{ backgroundColor: "var(--cs-card)" }}
        >
          <span
            className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            style={{ color: "var(--cs-accent)" }}
          >
            {metric.value}
          </span>
          <span className="mt-2 text-xs leading-relaxed text-[var(--cs-muted)] sm:text-sm">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
}
