import Link from "next/link";

type CaseStudyCtaProps = {
  title?: string;
  description?: string;
  storyHref?: string;
  storyLabel?: string;
  contactHref?: string;
  contactLabel?: string;
};

export default function CaseStudyCta({
  title = "Want the full story?",
  description = "This project is one chapter — the portfolio reads like a book, from a Minecraft kid to production AI systems at Nokia.",
  storyHref = "/#story",
  storyLabel = "Read the story",
  contactHref = "/#contact",
  contactLabel = "Get in touch",
}: CaseStudyCtaProps) {
  return (
    <section
      className="mt-20 rounded-3xl p-8 ring-1 ring-white/12 sm:p-10"
      style={{ backgroundColor: "var(--cs-card)" }}
    >
      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl leading-relaxed text-[var(--cs-muted)]">
        {description}
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href={storyHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-[#0c0a16] transition-transform duration-300 hover:scale-[1.03]"
        >
          {storyLabel}
        </Link>
        <Link
          href={contactHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/5 px-6 py-3 font-medium text-white ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-white/30"
        >
          {contactLabel}
        </Link>
      </div>
    </section>
  );
}
