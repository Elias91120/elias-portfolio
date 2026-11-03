import Link from "next/link";
import { contact } from "@/lib/people";

type CaseStudyCtaProps = {
  title?: string;
  description?: string;
};

/**
 * End of every case study: a reader who liked the work and has a project goes
 * to the studio; anyone else can still write to Elias.
 */
export default function CaseStudyCta({
  title = "Have a project like this one?",
  description = "3geeks, the studio I run with Noam, builds websites, apps and AI tools for businesses. Small requests ship in 24 to 48 hours, and nothing is paid until you are satisfied.",
}: CaseStudyCtaProps) {
  return (
    <section
      className="mt-20 rounded-3xl p-8 ring-1 ring-white/12 sm:p-10"
      style={{ backgroundColor: "var(--cs-card, #141221)" }}
    >
      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl leading-relaxed text-[var(--cs-muted,#a8a3bd)]">
        {description}
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href={contact.studioHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-[#0c0a16] transition-transform duration-300 hover:scale-[1.03]"
        >
          Visit 3geeks.fr ↗
        </a>
        <Link
          href="/#contact"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/5 px-6 py-3 font-medium text-white ring-1 ring-white/15 transition-all duration-300 hover:bg-white/10 hover:ring-white/30"
        >
          Contact me
        </Link>
      </div>
    </section>
  );
}
