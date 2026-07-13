export type ProjectMetric = {
  value: string;
  label: string;
};

type ProjectCardMetricsProps = {
  metrics: ProjectMetric[];
  accent: string;
  compact?: boolean;
  className?: string;
};

export default function ProjectCardMetrics({
  metrics,
  accent,
  compact = false,
  className = "",
}: ProjectCardMetricsProps) {
  const shown = compact ? metrics.slice(0, 2) : metrics.slice(0, 4);
  const isSingle = shown.length === 1;

  return (
    <div
      className={`grid gap-2.5 ${compact ? "gap-2" : "sm:gap-3"} ${
        isSingle ? "grid-cols-1" : "grid-cols-2"
      } ${className}`}
    >
      {shown.map((metric) => (
        <div
          key={metric.label}
          className={`flex flex-col rounded-2xl ring-1 ring-white/10 ${
            compact ? "px-3 py-3" : "px-4 py-3.5 sm:py-4"
          } ${isSingle ? "items-center px-6 py-4 text-center sm:py-5" : ""}`}
          style={{
            backgroundColor: `${accent}0d`,
            borderColor: `${accent}22`,
          }}
        >
          <span
            className={`font-display font-bold tracking-tight text-white ${
              compact ? "text-xl" : "text-2xl sm:text-[1.65rem]"
            }`}
            style={{ color: accent }}
          >
            {metric.value}
          </span>
          <span
            className={`mt-1 leading-snug text-[#b8b3cf] ${
              compact ? "text-[0.65rem]" : "text-xs sm:text-sm"
            }`}
          >
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
}
