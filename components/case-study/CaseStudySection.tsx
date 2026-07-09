type CaseStudySectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function CaseStudySection({
  title,
  children,
  className = "",
}: CaseStudySectionProps) {
  return (
    <section className={`mt-16 first:mt-20 ${className}`.trim()}>
      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-relaxed text-[var(--cs-muted)] [&_em]:font-serif [&_em]:text-[var(--cs-fg)]">
        {children}
      </div>
    </section>
  );
}
